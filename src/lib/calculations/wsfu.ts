import type {
  PipeCandidateEvaluation,
  PlumbingWsfuInput,
  PlumbingWsfuResult,
  StandardWaterPipeSizeInches,
  WsfuCalculationSubtotal,
} from "@/types/plumbing-wsfu";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  HAZEN_WILLIAMS_C,
  HUNTERS_CURVE_FLUSH_TANK_POINTS,
  MAX_VELOCITY_FPS,
  PIPE_INTERNAL_DIAMETERS,
  STANDARD_WATER_PIPE_SIZES,
  WATER_PIPE_SIZE_NUMERIC_MAP,
} from "@/data/references/plumbing-wsfu-types";
import { roundTo } from "./rounding";

/**
 * Pure deterministic calculation engine for Water Supply Fixture Unit (WSFU) & Potable Water Pipe Sizing.
 * Implements formulas and sizing tables from IPC Appendix E / Section 604 and UPC Appendix A / Chapter 6.
 */
export function calculatePlumbingWsfu(input: PlumbingWsfuInput): PlumbingWsfuResult {
  const {
    codeStandard = "IPC",
    pipeMaterial = "copper_l",
    staticPressurePsi = 60,
    highestFixtureElevationFeet = 10,
    developedLengthFeet = 60,
    minResidualPressurePsi = 15,
    meterPressureDropPsi = 5,
    fixtures = [],
    continuousDemandGpm = 0,
  } = input;

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // Input Validation
  if (staticPressurePsi <= 0) {
    throw new RangeError("Static available water pressure must be greater than 0 PSI");
  }
  if (developedLengthFeet <= 0) {
    throw new RangeError("Developed pipe length must be greater than 0 feet");
  }
  if (highestFixtureElevationFeet < 0) {
    throw new RangeError("Highest fixture elevation cannot be negative");
  }

  let totalFixtureCount = 0;
  let rawTotalWsfu = 0;
  let rawColdWsfu = 0;
  let rawHotWsfu = 0;
  let hasFlushometer = false;
  let maxBranchSizeNumeric = 0.5;
  let largestBranchSize: StandardWaterPipeSizeInches = "1/2";

  const fixtureBreakdown: WsfuCalculationSubtotal[] = [];

  // 1. Process Fixture Schedule
  for (const item of fixtures) {
    const qty = Math.max(0, item.quantity);
    if (qty > 0) {
      totalFixtureCount += qty;
      const subTotal = roundTo(qty * item.wsfuTotalEach, 2);
      const subCold = roundTo(qty * item.wsfuColdEach, 2);
      const subHot = roundTo(qty * item.wsfuHotEach, 2);

      rawTotalWsfu += subTotal;
      rawColdWsfu += subCold;
      rawHotWsfu += subHot;

      if (item.isFlushometer || item.fixtureId.includes("flushometer")) {
        hasFlushometer = true;
      }

      const branchNumeric = WATER_PIPE_SIZE_NUMERIC_MAP[item.minBranchSizeInches] || 0.5;
      if (branchNumeric > maxBranchSizeNumeric) {
        maxBranchSizeNumeric = branchNumeric;
        largestBranchSize = item.minBranchSizeInches;
      }

      fixtureBreakdown.push({
        fixtureId: item.fixtureId,
        name: item.name,
        quantity: qty,
        wsfuTotalEach: item.wsfuTotalEach,
        wsfuColdEach: item.wsfuColdEach,
        wsfuHotEach: item.wsfuHotEach,
        subtotalTotalWsfu: subTotal,
        subtotalColdWsfu: subCold,
        subtotalHotWsfu: subHot,
        minBranchSizeInches: item.minBranchSizeInches,
      });
    }
  }

  const totalCalculatedWsfu = roundTo(rawTotalWsfu, 1);
  const totalColdWsfu = roundTo(rawColdWsfu, 1);
  const totalHotWsfu = roundTo(rawHotWsfu, 1);

  if (totalCalculatedWsfu <= 0 && continuousDemandGpm <= 0) {
    throw new RangeError("Fixture schedule must contain at least one active fixture or continuous flow demand");
  }

  steps.push({
    label: "Water Supply Fixture Unit (WSFU) Summation",
    formula: "Total WSFU = Σ (Quantity × Fixture WSFU)",
    values: `${totalFixtureCount} Fixtures across schedule`,
    result: `${totalCalculatedWsfu} Total WSFU (${totalColdWsfu} Cold WSFU / ${totalHotWsfu} Hot WSFU)`,
  });

  // 2. Hunter's Curve: WSFU -> Peak Demand (GPM) Conversion
  const peakDemandGpm = interpolateHuntersCurve(totalCalculatedWsfu);
  const totalDesignFlowGpm = roundTo(peakDemandGpm + Math.max(0, continuousDemandGpm), 1);

  steps.push({
    label: "Hunter's Curve Peak Flow Conversion (IPC Table E103.3(3) / UPC Table A 103.1)",
    formula: "Design Flow (GPM) = Hunter's Curve(WSFU) + Continuous GPM",
    values: `Hunter's Curve(${totalCalculatedWsfu} WSFU) = ${peakDemandGpm} GPM + ${continuousDemandGpm} Continuous GPM`,
    result: `${totalDesignFlowGpm} GPM Total Design Flow`,
  });

  // 3. Hydraulic Pressure Budget
  const elevationLossPsi = roundTo(highestFixtureElevationFeet * 0.433, 1);
  const equivalentLengthFeet = roundTo(developedLengthFeet * 1.2, 1); // 20% fitting allowance

  const allowableFrictionLossPsi = roundTo(
    staticPressurePsi - elevationLossPsi - meterPressureDropPsi - minResidualPressurePsi,
    1
  );

  const allowableFrictionGradientPsiPer100Ft = allowableFrictionLossPsi > 0
    ? roundTo((allowableFrictionLossPsi / (equivalentLengthFeet / 100)), 2)
    : 0;

  steps.push({
    label: "Static Elevation Pressure Loss",
    formula: "Elevation Loss (PSI) = Highest Elevation (ft) × 0.433 PSI/ft",
    values: `${highestFixtureElevationFeet} ft × 0.433`,
    result: `${elevationLossPsi} PSI Loss`,
  });

  steps.push({
    label: "Allowable Friction Loss & Gradient Budget",
    formula: "Allowable Loss = Static PSI - Elevation Loss - Meter Loss - Min Residual PSI",
    values: `${staticPressurePsi} PSI - ${elevationLossPsi} PSI - ${meterPressureDropPsi} PSI - ${minResidualPressurePsi} PSI`,
    result: `${allowableFrictionLossPsi} PSI Allowable Loss (${allowableFrictionGradientPsiPer100Ft} PSI / 100 ft)`,
  });

  if (allowableFrictionLossPsi <= 0) {
    warnings.push({
      code: "INSUFFICIENT_STATIC_PRESSURE",
      field: "staticPressurePsi",
      message: `Static available pressure (${staticPressurePsi} PSI) is insufficient to overcome elevation loss (${elevationLossPsi} PSI), meter loss (${meterPressureDropPsi} PSI), and satisfy the minimum required fixture residual pressure (${minResidualPressurePsi} PSI). A booster pump system or municipal pressure increase is required.`,
    });
  }

  // 4. Evaluate Pipe Candidates using Hazen-Williams
  const cFactor = HAZEN_WILLIAMS_C[pipeMaterial];
  const maxVelCold = MAX_VELOCITY_FPS[pipeMaterial].cold;
  const ids = PIPE_INTERNAL_DIAMETERS[pipeMaterial];

  const candidateEvaluations: PipeCandidateEvaluation[] = [];
  let recommendedMainPipeSizeInches: StandardWaterPipeSizeInches = "3";
  let foundCompliant = false;

  const minPermittedMainSize: StandardWaterPipeSizeInches = hasFlushometer ? "1" : largestBranchSize;
  const minPermittedNumeric = WATER_PIPE_SIZE_NUMERIC_MAP[minPermittedMainSize];

  for (const size of STANDARD_WATER_PIPE_SIZES) {
    const idInches = ids[size];
    // Velocity: V = 0.4085 * Q / (d^2)
    const velocityFps = roundTo((0.4085 * totalDesignFlowGpm) / (idInches * idInches), 1);

    // Hazen-Williams Friction Gradient: J (psi / 100 ft)
    // J = 4.52 * Q^1.852 / (C^1.852 * d^4.8655)
    const frictionLossPsiPer100Ft = roundTo(
      (4.52 * Math.pow(totalDesignFlowGpm, 1.852)) /
        (Math.pow(cFactor, 1.852) * Math.pow(idInches, 4.8655)),
      2
    );

    const totalFrictionLossPsi = roundTo(
      frictionLossPsiPer100Ft * (equivalentLengthFeet / 100),
      1
    );

    const residualPressureAtFixturePsi = roundTo(
      staticPressurePsi - elevationLossPsi - meterPressureDropPsi - totalFrictionLossPsi,
      1
    );

    const isVelocityCompliant = velocityFps <= maxVelCold;
    const isPressureCompliant = residualPressureAtFixturePsi >= minResidualPressurePsi;
    const sizeNumeric = WATER_PIPE_SIZE_NUMERIC_MAP[size];
    const isSizeFloorMet = sizeNumeric >= minPermittedNumeric;

    const isCompliant = isVelocityCompliant && isPressureCompliant && isSizeFloorMet;

    candidateEvaluations.push({
      sizeInches: size,
      internalDiameterInches: idInches,
      velocityFps,
      frictionLossPsiPer100Ft,
      totalFrictionLossPsi,
      residualPressureAtFixturePsi,
      isVelocityCompliant,
      isPressureCompliant,
      isCompliant,
    });

    if (isCompliant && !foundCompliant) {
      recommendedMainPipeSizeInches = size;
      foundCompliant = true;
    }
  }

  // If no candidate met both pressure & velocity (e.g. extreme flow or zero allowable pressure), pick largest standard size
  if (!foundCompliant) {
    recommendedMainPipeSizeInches = "2";
  }

  const selectedEvaluation = candidateEvaluations.find((c) => c.sizeInches === recommendedMainPipeSizeInches) || candidateEvaluations[0];
  const velocityAtRecommendedSizeFps = selectedEvaluation.velocityFps;
  const actualResidualPressurePsi = selectedEvaluation.residualPressureAtFixturePsi;

  // 5. Branch Size Recommendations
  const coldGpm = interpolateHuntersCurve(totalColdWsfu);
  const hotGpm = interpolateHuntersCurve(totalHotWsfu);
  const minColdBranchSizeInches = selectBranchSize(coldGpm, cFactor, ids, maxVelCold);
  const minHotBranchSizeInches = selectBranchSize(hotGpm, cFactor, ids, MAX_VELOCITY_FPS[pipeMaterial].hot);

  steps.push({
    label: `Pipe Sizing Hydraulic Selection (${pipeMaterial.toUpperCase()} Tubing, C=${cFactor})`,
    formula: "Selected Size = Smallest diameter where Velocity <= Max Limit and Residual PSI >= Min PSI",
    values: `${totalDesignFlowGpm} GPM in ${recommendedMainPipeSizeInches}\" pipe`,
    result: `${recommendedMainPipeSizeInches}\" Main Pipe (${velocityAtRecommendedSizeFps} FPS Velocity, ${actualResidualPressurePsi} PSI Residual Pressure)`,
  });

  // 6. Warnings & Code Alerts
  if (staticPressurePsi > 80) {
    warnings.push({
      code: "HIGH_STATIC_PRESSURE_PRV_REQUIRED",
      field: "staticPressurePsi",
      message: `Static water pressure (${staticPressurePsi} PSI) exceeds the 80 PSI maximum threshold permitted by IPC Section 604.8 and UPC Section 608.2. A Pressure Reducing Valve (PRV) must be installed to prevent fixture damage and pipe fatigue.`,
    });
  }

  if (hasFlushometer && recommendedMainPipeSizeInches === "1/2" || recommendedMainPipeSizeInches === "3/4") {
    warnings.push({
      code: "FLUSHOMETER_MIN_1INCH_REQUIRED",
      field: "recommendedMainPipeSizeInches",
      message: `Commercial flushometer valve toilets require an instantaneous supply line of at least 1\" diameter to operate properly. Sizing has been set to at least 1\".`,
    });
  }

  if (velocityAtRecommendedSizeFps > maxVelCold) {
    warnings.push({
      code: "EXCESSIVE_WATER_VELOCITY",
      field: "velocityAtRecommendedSizeFps",
      message: `Water velocity (${velocityAtRecommendedSizeFps} FPS) exceeds the ${maxVelCold} FPS code limit for ${pipeMaterial.replace("_", " ")} tubing. Excessive velocity leads to water hammer and pipe wall erosion.`,
    });
  }

  // Legal Disclaimer
  warnings.push({
    code: "PLUMBING_CODE_DISCLAIMER",
    message: `Calculated per ${codeStandard} water supply methods (Hazen-Williams hydraulic analysis). Local plumbing codes, water purveyor meters, and backflow preventer requirements vary by municipality. This tool is an estimation aid and does not replace stamped engineering plans or licensed master plumber sign-off.`,
  });

  return {
    codeStandard,
    pipeMaterial,
    staticPressurePsi,
    highestFixtureElevationFeet,
    elevationLossPsi,
    meterPressureDropPsi,
    minResidualPressurePsi,
    allowableFrictionLossPsi,
    equivalentLengthFeet,
    allowableFrictionGradientPsiPer100Ft,
    totalFixtureCount,
    totalCalculatedWsfu,
    totalColdWsfu,
    totalHotWsfu,
    peakDemandGpm,
    continuousDemandGpm,
    totalDesignFlowGpm,
    recommendedMainPipeSizeInches,
    minColdBranchSizeInches,
    minHotBranchSizeInches,
    velocityAtRecommendedSizeFps,
    actualResidualPressurePsi,
    candidateEvaluations,
    fixtureBreakdown,
    warnings,
    steps,
  };
}

/**
 * Piecewise linear interpolation across Hunter's Curve Flush Tank points
 */
function interpolateHuntersCurve(wsfu: number): number {
  if (wsfu <= 0) return 0.0;

  const points = HUNTERS_CURVE_FLUSH_TANK_POINTS;
  if (wsfu >= points[points.length - 1].wsfu) {
    // Extrapolate linearly beyond 500 WSFU
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const slope = (last.gpm - prev.gpm) / (last.wsfu - prev.wsfu);
    return roundTo(last.gpm + slope * (wsfu - last.wsfu), 1);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (wsfu >= p1.wsfu && wsfu <= p2.wsfu) {
      const frac = (wsfu - p1.wsfu) / (p2.wsfu - p1.wsfu);
      return roundTo(p1.gpm + frac * (p2.gpm - p1.gpm), 1);
    }
  }

  return 3.0;
}

/**
 * Quick branch pipe sizing helper based on velocity & flow rate
 */
function selectBranchSize(
  gpm: number,
  cFactor: number,
  ids: Record<StandardWaterPipeSizeInches, number>,
  maxVelocityFps: number
): StandardWaterPipeSizeInches {
  if (gpm <= 0) return "1/2";

  for (const size of STANDARD_WATER_PIPE_SIZES) {
    const id = ids[size];
    const vel = (0.4085 * gpm) / (id * id);
    if (vel <= maxVelocityFps) {
      return size;
    }
  }

  return "1-1/4";
}
