import type {
  BranchRunEvaluation,
  DuctMaterial,
  DuctSizingInput,
  DuctSizingResult,
  SizingMethod,
  SingleDuctEvaluation,
} from "@/types/duct";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  DUCT_MATERIAL_REGISTRY,
  calculateHuebscherEquivalentDiameter,
  findMatchingRectangularWidth,
  findNearestStandardRoundDuct,
  getVelocityStatus,
} from "@/data/references/duct-types";
import { roundTo } from "./rounding";

/**
 * Calculates theoretical round diameter and rectangular equivalent for a specific airflow CFM.
 */
export function evaluateSingleDuct(
  cfm: number,
  material: DuctMaterial,
  sizingMethod: SizingMethod,
  frictionRateInWgPer100Ft: number,
  targetVelocityFpm: number,
  fixedRectangularHeightInches: number = 8
): SingleDuctEvaluation {
  if (cfm <= 0) {
    throw new RangeError("Airflow CFM must be greater than zero");
  }

  const matProps = DUCT_MATERIAL_REGISTRY[material] ?? DUCT_MATERIAL_REGISTRY.sheet_metal;

  // 1. Calculate Theoretical Round Diameter
  let theoreticalDiameterInches: number;
  if (sizingMethod === "equal_friction") {
    // Exact ASHRAE Fundamentals duct friction equation: D = ((0.109136 * CFM^1.9) / FrictionRate)^0.1992
    const baseDia = Math.pow((0.109136 * Math.pow(cfm, 1.9)) / frictionRateInWgPer100Ft, 0.1992);
    theoreticalDiameterInches = baseDia * matProps.diameterAdjustmentMultiplier;
  } else {
    // Velocity reduction method: Area = CFM / TargetVelocity; D = sqrt(4 * Area * 144 / pi)
    const targetAreaSqFt = cfm / targetVelocityFpm;
    const baseDia = Math.sqrt((4 * targetAreaSqFt * 144) / Math.PI);
    theoreticalDiameterInches = baseDia * matProps.diameterAdjustmentMultiplier;
  }

  theoreticalDiameterInches = roundTo(theoreticalDiameterInches, 2);

  // 2. Standard Factory Round Size Selection
  const recommendedStandardDiameterInches = findNearestStandardRoundDuct(theoreticalDiameterInches);
  const roundDuctAreaSqIn = roundTo(
    Math.PI * Math.pow(recommendedStandardDiameterInches / 2, 2),
    1
  );
  const roundDuctAreaSqFt = roundTo(roundDuctAreaSqIn / 144, 3);
  const actualRoundVelocityFpm = roundTo(cfm / roundDuctAreaSqFt, 0);

  // Friction loss calculation with actual standard diameter
  const roundFrictionLossInWgPer100Ft = roundTo(
    frictionRateInWgPer100Ft * Math.pow(theoreticalDiameterInches / recommendedStandardDiameterInches, 5),
    3
  );

  // 3. Rectangular Equivalent Sizing (using Huebscher's formula)
  const rectangularHeightInches = fixedRectangularHeightInches;
  const rectangularWidthInches = findMatchingRectangularWidth(
    theoreticalDiameterInches,
    rectangularHeightInches
  );
  const rectangularAreaSqIn = rectangularWidthInches * rectangularHeightInches;
  const rectangularAreaSqFt = roundTo(rectangularAreaSqIn / 144, 3);
  const actualRectangularVelocityFpm = roundTo(cfm / rectangularAreaSqFt, 0);
  const equivalentDiameterInches = roundTo(
    calculateHuebscherEquivalentDiameter(rectangularWidthInches, rectangularHeightInches),
    2
  );

  const rectangularAspectRatio = roundTo(
    Math.max(rectangularWidthInches, rectangularHeightInches) /
      Math.min(rectangularWidthInches, rectangularHeightInches),
    2
  );

  const velocityStatus = getVelocityStatus(actualRoundVelocityFpm);

  return {
    cfm,
    theoreticalDiameterInches,
    recommendedStandardDiameterInches,
    roundDuctAreaSqIn,
    roundDuctAreaSqFt,
    actualRoundVelocityFpm,
    roundFrictionLossInWgPer100Ft,
    rectangularWidthInches,
    rectangularHeightInches,
    rectangularAreaSqIn,
    rectangularAreaSqFt,
    actualRectangularVelocityFpm,
    rectangularAspectRatio,
    equivalentDiameterInches,
    velocityStatus,
  };
}

/**
 * Pure deterministic calculation engine for HVAC Duct Sizing & CFM Airflow.
 */
export function calculateDuctSizingProject(input: DuctSizingInput): DuctSizingResult {
  const {
    inputMode,
    targetCfm = 1200,
    coolingTons = 3.0,
    cfmPerTon = 400,
    rooms = [],
    ductMaterial = "sheet_metal",
    sizingMethod = "equal_friction",
    frictionRateInWgPer100Ft = 0.08,
    targetVelocityFpm = 700,
    fixedRectangularHeightInches = 8,
  } = input;

  if (frictionRateInWgPer100Ft <= 0) {
    throw new RangeError("Friction rate must be greater than zero in. w.g.");
  }
  if (targetVelocityFpm <= 0) {
    throw new RangeError("Target velocity must be greater than zero FPM");
  }
  if (fixedRectangularHeightInches <= 0) {
    throw new RangeError("Rectangular height constraint must be greater than zero inches");
  }

  // 1. Resolve Total Airflow CFM
  let totalCfm = 0;
  if (inputMode === "direct_cfm") {
    if (targetCfm <= 0) throw new RangeError("Target CFM must be greater than zero");
    totalCfm = targetCfm;
  } else if (inputMode === "tonnage") {
    if (coolingTons <= 0) throw new RangeError("Cooling tons must be greater than zero");
    if (cfmPerTon <= 0) throw new RangeError("CFM per ton must be greater than zero");
    totalCfm = roundTo(coolingTons * cfmPerTon, 0);
  } else if (inputMode === "room_schedule") {
    if (!rooms || rooms.length === 0) {
      throw new RangeError("Room schedule must contain at least one room entry");
    }
    totalCfm = rooms.reduce((acc, r) => acc + (r.targetCfm > 0 ? r.targetCfm : 0), 0);
    if (totalCfm <= 0) {
      throw new RangeError("Total room schedule CFM must be greater than zero");
    }
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  steps.push({
    label: "Airflow Requirement Resolution",
    formula:
      inputMode === "tonnage"
        ? "Total CFM = Cooling Tons × CFM/Ton"
        : inputMode === "room_schedule"
        ? "Total CFM = Σ (Room Branch CFMs)"
        : "Total CFM = Direct User Input",
    values:
      inputMode === "tonnage"
        ? `${coolingTons} Tons × ${cfmPerTon} CFM/Ton`
        : inputMode === "room_schedule"
        ? `${rooms.length} rooms evaluated`
        : `${targetCfm} CFM entered`,
    result: `${totalCfm} CFM Total Airflow`,
  });

  // 2. Evaluate Main Trunk Duct
  const mainTrunk = evaluateSingleDuct(
    totalCfm,
    ductMaterial,
    sizingMethod,
    frictionRateInWgPer100Ft,
    targetVelocityFpm,
    fixedRectangularHeightInches
  );

  steps.push({
    label: "Main Trunk Round Duct Sizing",
    formula:
      sizingMethod === "equal_friction"
        ? "D = ((0.109136 × CFM^1.9) / FrictionRate)^0.1992 × MatMultiplier (ASHRAE Power-Law)"
        : "D = √(4 × (CFM / TargetVelocity) × 144 / π) × MatMultiplier (Continuity Equation)",
    values: `${totalCfm} CFM, ${
      sizingMethod === "equal_friction"
        ? `${frictionRateInWgPer100Ft} in. w.g. friction`
        : `${targetVelocityFpm} FPM target`
    }, ${DUCT_MATERIAL_REGISTRY[ductMaterial].name}`,
    result: `${mainTrunk.theoreticalDiameterInches}" theoretical → ${mainTrunk.recommendedStandardDiameterInches}" standard round (${mainTrunk.actualRoundVelocityFpm} FPM)`,
  });

  steps.push({
    label: "Main Trunk Rectangular Equivalent (Huebscher)",
    formula: "De = 1.30 × (a × b)^0.625 / (a + b)^0.250",
    values: `Height = ${mainTrunk.rectangularHeightInches}", Width = ${mainTrunk.rectangularWidthInches}" (${mainTrunk.rectangularAreaSqIn} sq in)`,
    result: `${mainTrunk.rectangularWidthInches}" × ${mainTrunk.rectangularHeightInches}" Rectangular (${mainTrunk.actualRectangularVelocityFpm} FPM, Aspect Ratio ${mainTrunk.rectangularAspectRatio}:1)`,
  });

  // 3. Evaluate Branch Runs (if room_schedule is active)
  const branchRuns: BranchRunEvaluation[] = [];
  if (inputMode === "room_schedule" && rooms.length > 0) {
    for (const room of rooms) {
      if (room.targetCfm > 0) {
        const branchEval = evaluateSingleDuct(
          room.targetCfm,
          ductMaterial,
          sizingMethod,
          frictionRateInWgPer100Ft,
          Math.min(targetVelocityFpm, 600), // Target lower velocity in branch runouts for quiet acoustic performance
          room.fixedHeightInches ?? 6
        );
        branchRuns.push({
          ...branchEval,
          id: room.id,
          roomName: room.roomName,
        });
      }
    }
  }

  // 4. Warning Evaluation (Design & Acoustic Guidelines)
  if (mainTrunk.actualRoundVelocityFpm > 900) {
    warnings.push({
      code: "HIGH_AIR_VELOCITY_NOISE_RISK",
      field: "targetVelocityFpm",
      message: `Main trunk air velocity (${mainTrunk.actualRoundVelocityFpm} FPM) exceeds the recommended residential design guideline (900 FPM). While acceptable in commercial trunks or unconditioned attics, velocities above 900 FPM increase acoustic air rush noise at supply registers and raise blower motor static pressure.`,
    });
  }

  if (mainTrunk.actualRoundVelocityFpm < 400) {
    warnings.push({
      code: "LOW_AIR_VELOCITY_STRATIFICATION_RISK",
      field: "targetVelocityFpm",
      message: `Air velocity (${mainTrunk.actualRoundVelocityFpm} FPM) is below 400 FPM. Very low velocity reduces register throw distance, which can lead to thermal stratification and uneven room temperature distribution.`,
    });
  }

  if (mainTrunk.rectangularAspectRatio > 4.0) {
    warnings.push({
      code: "EXTREME_RECTANGULAR_ASPECT_RATIO",
      field: "fixedRectangularHeightInches",
      message: `Rectangular aspect ratio (${mainTrunk.rectangularAspectRatio}:1) exceeds 4:1. This is a residential design/construction warning: while mathematically valid under Huebscher's formula, wide-and-flat ducts have significantly higher perimeter surface friction, increased heat gain, and higher fabrication cost. Increasing duct height is recommended where joist space permits.`,
    });
  }

  if (ductMaterial === "flexible_duct") {
    warnings.push({
      code: "FLEXIBLE_DUCT_INSTALLATION_PENALTY",
      field: "ductMaterial",
      message: "Flexible duct internal wire-helix ribs create 30%–50% more friction resistance than smooth sheet metal. This calculator applies a simplified +15% diameter engineering approximation assuming fully stretched installation (<4% sag). Keep flex runs taut and avoid sharp 90-degree bends without rigid metal elbows.",
    });
  }

  // Technical Disclaimer
  warnings.push({
    code: "DUCT_SIZING_ESTIMATION_DISCLAIMER",
    message: "Duct sizing estimations are based on ASHRAE/ACCA hydrodynamic flow principles and Huebscher circular equivalency. This tool is an estimation aid and does not constitute a certified ACCA Manual D design or PE engineering submittal. Final static pressure (ESP) budgeting and blower motor curves must be verified by a licensed mechanical contractor.",
  });

  return {
    totalCfm,
    inputMode,
    ductMaterial,
    sizingMethod,
    frictionRateInWgPer100Ft,
    targetVelocityFpm,
    mainTrunk,
    branchRuns,
    warnings,
    steps,
  };
}
