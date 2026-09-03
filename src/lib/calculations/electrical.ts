import type {
  CandidateConductorEvaluation,
  ConductorMaterial,
  ConductorTemperatureRating,
  ElectricalPhase,
  VoltageDropCalculationResult,
  VoltageDropCalculatorInput,
  WireGaugeSize,
} from "@/types/electrical";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  CONDUCTOR_RESISTIVITY_K,
  NEC_TABLE_310_16,
  getAmbientTemperatureCorrectionFactor,
  getBaseAmpacity,
  getConduitFillAdjustmentFactor,
} from "@/data/references/electrical-types";
import { roundTo } from "./rounding";

/**
 * Calculates raw voltage drop in Volts and Percentage for a specific conductor and circuit.
 */
export function calculateVoltageDrop(
  voltage: number,
  current: number,
  distanceFt: number,
  circularMils: number,
  material: ConductorMaterial = "copper",
  phase: ElectricalPhase = "single_phase"
): {
  voltageDropVolts: number;
  voltageDropPercent: number;
  voltageAtLoad: number;
} {
  if (voltage <= 0) {
    throw new RangeError("System voltage must be greater than zero");
  }
  if (current <= 0) {
    throw new RangeError("Load current must be greater than zero");
  }
  if (distanceFt <= 0) {
    throw new RangeError("Circuit distance must be greater than zero");
  }
  if (circularMils <= 0) {
    throw new RangeError("Conductor circular mils must be greater than zero");
  }

  const K = CONDUCTOR_RESISTIVITY_K[material];
  const phaseMultiplier = phase === "three_phase" ? Math.sqrt(3) : 2.0;

  const voltageDropVolts = roundTo(
    (phaseMultiplier * K * current * distanceFt) / circularMils,
    2
  );
  const voltageDropPercent = roundTo((voltageDropVolts / voltage) * 100, 2);
  const voltageAtLoad = roundTo(Math.max(0, voltage - voltageDropVolts), 2);

  return {
    voltageDropVolts,
    voltageDropPercent,
    voltageAtLoad,
  };
}

/**
 * Calculates maximum one-way circuit distance in feet before exceeding a target voltage drop percentage.
 */
export function calculateMaxDistance(
  voltage: number,
  current: number,
  circularMils: number,
  material: ConductorMaterial = "copper",
  phase: ElectricalPhase = "single_phase",
  targetDropPercent: number = 3.0
): number {
  if (voltage <= 0 || current <= 0 || circularMils <= 0) return 0;

  const K = CONDUCTOR_RESISTIVITY_K[material];
  const phaseMultiplier = phase === "three_phase" ? Math.sqrt(3) : 2.0;
  const maxDropVolts = voltage * (targetDropPercent / 100);

  const maxDistanceFt = (maxDropVolts * circularMils) / (phaseMultiplier * K * current);
  return roundTo(maxDistanceFt, 1);
}

/**
 * Evaluates candidate conductor sizes across NEC Table 310.16 for a given circuit.
 */
export function evaluateCandidateConductors(
  voltage: number,
  loadCurrentAmps: number,
  designCurrentAmps: number,
  distanceFt: number,
  material: ConductorMaterial = "copper",
  phase: ElectricalPhase = "single_phase",
  rating: ConductorTemperatureRating = "75C",
  targetMaxDropPercent: number = 3.0,
  tempCorrectionFactor: number = 1.0,
  conduitFillFactor: number = 1.0
): {
  candidates: CandidateConductorEvaluation[];
  recommendedSize: WireGaugeSize;
  recommendedEvaluation: CandidateConductorEvaluation;
} {
  const candidates: CandidateConductorEvaluation[] = [];

  for (const prop of NEC_TABLE_310_16) {
    const baseAmpacity = getBaseAmpacity(prop.size, material, rating);

    // Skip unavailable conductors (e.g. 14 AWG Aluminum prohibited by NEC)
    if (baseAmpacity <= 0) continue;

    const deratedAmpacity = roundTo(
      baseAmpacity * tempCorrectionFactor * conduitFillFactor,
      1
    );

    const { voltageDropVolts, voltageDropPercent, voltageAtLoad } =
      calculateVoltageDrop(
        voltage,
        loadCurrentAmps,
        distanceFt,
        prop.circularMils,
        material,
        phase
      );

    const isAmpacityCompliant = deratedAmpacity >= designCurrentAmps;
    const isVoltageDropCompliant = voltageDropPercent <= targetMaxDropPercent;

    const maxDistanceFor3PctDropFt = calculateMaxDistance(
      voltage,
      loadCurrentAmps,
      prop.circularMils,
      material,
      phase,
      3.0
    );

    const maxDistanceFor5PctDropFt = calculateMaxDistance(
      voltage,
      loadCurrentAmps,
      prop.circularMils,
      material,
      phase,
      5.0
    );

    let overallStatus: CandidateConductorEvaluation["overallStatus"] = "fail";
    if (isAmpacityCompliant && isVoltageDropCompliant) {
      overallStatus = "pass";
    } else if (isAmpacityCompliant && voltageDropPercent <= 5.0) {
      overallStatus = "warning";
    }

    candidates.push({
      size: prop.size,
      circularMils: prop.circularMils,
      material,
      baseAmpacity,
      deratedAmpacity,
      voltageDropVolts,
      voltageDropPercent,
      voltageAtLoad,
      isAmpacityCompliant,
      isVoltageDropCompliant,
      overallStatus,
      maxDistanceFor3PctDropFt,
      maxDistanceFor5PctDropFt,
    });
  }

  // Find the smallest conductor that meets BOTH ampacity and voltage drop compliance
  let recommended = candidates.find(
    (c) => c.isAmpacityCompliant && c.isVoltageDropCompliant
  );

  // If no candidate satisfies 3% drop, find the largest available conductor with compliant ampacity
  if (!recommended) {
    recommended =
      candidates.filter((c) => c.isAmpacityCompliant).pop() ?? candidates[candidates.length - 1];
  }

  // Mark the recommended conductor
  const finalCandidates = candidates.map((c) =>
    c.size === recommended?.size ? { ...c, overallStatus: "recommended" as const } : c
  );

  return {
    candidates: finalCandidates,
    recommendedSize: recommended.size,
    recommendedEvaluation: { ...recommended, overallStatus: "recommended" },
  };
}

/**
 * Master Voltage Drop and Wire Sizing project calculation engine.
 */
export function calculateVoltageDropProject(
  input: VoltageDropCalculatorInput
): VoltageDropCalculationResult {
  const {
    voltage,
    phase = "single_phase",
    loadCurrentAmps,
    distanceFt,
    material = "copper",
    temperatureRating = "75C",
    targetMaxVoltageDropPercent = 3.0,
    isContinuousLoad = false,
    ambientTempF = 86,
    conductorsInConduit = 3,
  } = input;

  if (voltage <= 0) {
    throw new RangeError("System voltage must be greater than zero");
  }
  if (loadCurrentAmps <= 0) {
    throw new RangeError("Load current must be greater than zero");
  }
  if (distanceFt <= 0) {
    throw new RangeError("Circuit distance must be greater than zero");
  }
  if (targetMaxVoltageDropPercent <= 0 || targetMaxVoltageDropPercent > 20) {
    throw new RangeError("Target voltage drop percentage must be between 0.1% and 20%");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // Continuous load sizing: NEC 210.19(A)(1) requires 125% of continuous load
  const designCurrentAmps = isContinuousLoad
    ? roundTo(loadCurrentAmps * 1.25, 2)
    : loadCurrentAmps;

  // Derating factors
  const tempCorrectionFactor = getAmbientTemperatureCorrectionFactor(
    ambientTempF,
    temperatureRating
  );
  const conduitFillFactor = getConduitFillAdjustmentFactor(conductorsInConduit);

  if (isContinuousLoad) {
    steps.push({
      label: "Apply Continuous Load Sizing (125% Factor)",
      formula: "Load Current × 1.25",
      values: `${loadCurrentAmps}A × 1.25 = ${designCurrentAmps}A minimum conductor ampacity`,
      result: `${designCurrentAmps}A design current`,
    });
  }

  if (tempCorrectionFactor < 1.0 || conduitFillFactor < 1.0) {
    steps.push({
      label: "Calculate Conductor Derating Factor",
      formula: "Temperature Factor × Conduit Fill Factor",
      values: `${tempCorrectionFactor} (at ${ambientTempF}°F) × ${conduitFillFactor} (${conductorsInConduit} conductors) = ${roundTo(tempCorrectionFactor * conduitFillFactor, 3)}`,
      result: `${roundTo(tempCorrectionFactor * conduitFillFactor * 100, 1)}% derating factor`,
    });
  }

  // 1. Primary Conductor Sizing Evaluation
  const { candidates, recommendedSize, recommendedEvaluation } =
    evaluateCandidateConductors(
      voltage,
      loadCurrentAmps,
      designCurrentAmps,
      distanceFt,
      material,
      phase,
      temperatureRating,
      targetMaxVoltageDropPercent,
      tempCorrectionFactor,
      conduitFillFactor
    );

  const phaseMultiplierString = phase === "three_phase" ? "√3 (1.732)" : "2.0";
  const K = CONDUCTOR_RESISTIVITY_K[material];

  steps.push({
    label: `Calculate Voltage Drop for Recommended ${recommendedSize} (${material.toUpperCase()})`,
    formula: `(${phaseMultiplierString} × K × Current × Distance) ÷ Circular Mils`,
    values: `(${phaseMultiplierString} × ${K} × ${loadCurrentAmps}A × ${distanceFt} ft) ÷ ${recommendedEvaluation.circularMils} CM`,
    result: `${recommendedEvaluation.voltageDropVolts}V (${recommendedEvaluation.voltageDropPercent}% drop, ${recommendedEvaluation.voltageAtLoad}V at load)`,
  });

  steps.push({
    label: "Determine Maximum Distance for 3% Voltage Drop",
    formula: `(0.03 × Voltage × CM) ÷ (${phaseMultiplierString} × K × Current)`,
    values: `(0.03 × ${voltage}V × ${recommendedEvaluation.circularMils}) ÷ (${phaseMultiplierString} × ${K} × ${loadCurrentAmps}A)`,
    result: `${recommendedEvaluation.maxDistanceFor3PctDropFt} ft maximum one-way length`,
  });

  // 2. Copper vs Aluminum Comparison
  const altMaterial: ConductorMaterial = material === "copper" ? "aluminum" : "copper";
  const altEvaluation = evaluateCandidateConductors(
    voltage,
    loadCurrentAmps,
    designCurrentAmps,
    distanceFt,
    altMaterial,
    phase,
    temperatureRating,
    targetMaxVoltageDropPercent,
    tempCorrectionFactor,
    conduitFillFactor
  );

  const copperVsAluminumComparison = {
    copperRecommendedSize:
      material === "copper" ? recommendedSize : altEvaluation.recommendedSize,
    copperDropPercent:
      material === "copper"
        ? recommendedEvaluation.voltageDropPercent
        : altEvaluation.recommendedEvaluation.voltageDropPercent,
    aluminumRecommendedSize:
      material === "aluminum" ? recommendedSize : altEvaluation.recommendedSize,
    aluminumDropPercent:
      material === "aluminum"
        ? recommendedEvaluation.voltageDropPercent
        : altEvaluation.recommendedEvaluation.voltageDropPercent,
  };

  // Warnings
  if (recommendedEvaluation.voltageDropPercent > targetMaxVoltageDropPercent) {
    warnings.push({
      code: "VOLTAGE_DROP_EXCEEDS_TARGET",
      field: "targetMaxVoltageDropPercent",
      message: `Voltage drop (${recommendedEvaluation.voltageDropPercent}%) exceeds target limit (${targetMaxVoltageDropPercent}%). Upsize conductor or reduce circuit length to protect sensitive electronics and motors.`,
    });
  }

  if (material === "aluminum" && recommendedEvaluation.circularMils <= 10380) {
    warnings.push({
      code: "SMALL_ALUMINUM_CONDUCTOR_RESTRICTION",
      field: "material",
      message: "Aluminum conductors smaller than 8 AWG are restricted or prohibited in most residential branch wiring per NEC 310.106(B) due to termination oxidation and expansion risks.",
    });
  }

  if (tempCorrectionFactor <= 0.82) {
    warnings.push({
      code: "SEVERE_HIGH_AMBIENT_TEMPERATURE",
      field: "ambientTempF",
      message: `High ambient temperature (${ambientTempF}°F) significantly derates conductor ampacity by ${roundTo((1 - tempCorrectionFactor) * 100, 0)}%. Ensure raceways are isolated from rooftop solar heat gain.`,
    });
  }

  // Safety Disclaimer
  warnings.push({
    code: "ELECTRICAL_ENGINEERING_DISCLAIMER",
    message: "Educational and reference calculator only. Conductor sizing must comply with the National Electrical Code (NEC Table 310.16), local AHJ amendments, equipment terminal temperature ratings (60°C/75°C), and short-circuit withstand ratings. Always consult a licensed electrical contractor.",
  });

  return {
    systemVoltage: voltage,
    phase,
    loadCurrentAmps,
    oneWayDistanceFt: distanceFt,
    targetMaxVoltageDropPercent,
    conductorMaterial: material,
    temperatureRating,
    isContinuousLoad,
    designCurrentAmps,
    recommendedSize,
    recommendedCircularMils: recommendedEvaluation.circularMils,
    voltageDropVolts: recommendedEvaluation.voltageDropVolts,
    voltageDropPercent: recommendedEvaluation.voltageDropPercent,
    voltageAtLoad: recommendedEvaluation.voltageAtLoad,
    baseAmpacity: recommendedEvaluation.baseAmpacity,
    deratedAmpacity: recommendedEvaluation.deratedAmpacity,
    is3PctCompliant: recommendedEvaluation.voltageDropPercent <= 3.0,
    is5PctCompliant: recommendedEvaluation.voltageDropPercent <= 5.0,
    maxDistanceFor3PctDropFt: recommendedEvaluation.maxDistanceFor3PctDropFt,
    maxDistanceFor5PctDropFt: recommendedEvaluation.maxDistanceFor5PctDropFt,
    candidates,
    copperVsAluminumComparison,
    warnings,
    steps,
  };
}
