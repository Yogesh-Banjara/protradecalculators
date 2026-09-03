import type {
  ConductorInputRow,
  ConduitCandidateEvaluation,
  ConduitFillInput,
  ConduitFillResult,
  ConduitTradeSize,
  ConduitType,
} from "@/types/conduit";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  CONDUIT_TRADE_SIZES_ORDERED,
  CONDUIT_TYPES,
  getConductorDimensionData,
  getConduitTradeSizeData,
} from "@/data/references/conduit-types";
import { roundTo } from "./rounding";

/**
 * Calculates total conductor cross-sectional area (sq in) and total wire count for mixed conductor bundles.
 */
export function calculateTotalConductorArea(
  conductors: readonly ConductorInputRow[]
): {
  totalAreaSqIn: number;
  totalWireCount: number;
  maxWireDiameterInches: number;
  breakdown: Array<{
    size: string;
    insulation: string;
    count: number;
    areaPerWireSqIn: number;
    subtotalAreaSqIn: number;
  }>;
} {
  let totalAreaSqIn = 0;
  let totalWireCount = 0;
  let maxWireDiameterInches = 0;
  const breakdown: Array<{
    size: string;
    insulation: string;
    count: number;
    areaPerWireSqIn: number;
    subtotalAreaSqIn: number;
  }> = [];

  for (const row of conductors) {
    if (row.count <= 0) continue;

    const data = getConductorDimensionData(row.size, row.insulation);
    const subtotalAreaSqIn = data.crossSectionalAreaSqIn * row.count;

    totalAreaSqIn += subtotalAreaSqIn;
    totalWireCount += row.count;
    if (data.approxDiameterInches > maxWireDiameterInches) {
      maxWireDiameterInches = data.approxDiameterInches;
    }

    breakdown.push({
      size: row.size,
      insulation: row.insulation,
      count: row.count,
      areaPerWireSqIn: data.crossSectionalAreaSqIn,
      subtotalAreaSqIn: roundTo(subtotalAreaSqIn, 4),
    });
  }

  return {
    totalAreaSqIn: roundTo(totalAreaSqIn, 4),
    totalWireCount,
    maxWireDiameterInches,
    breakdown,
  };
}

/**
 * Determines allowable fill percentage per NEC Chapter 9 Table 1.
 */
export function getAllowableFillPercentage(
  totalWireCount: number,
  isNipple: boolean = false
): number {
  if (isNipple) return 60; // NEC Chapter 9 Note 4 for nipples <= 24"
  if (totalWireCount <= 0) return 40;
  if (totalWireCount === 1) return 53;
  if (totalWireCount === 2) return 31;
  return 40; // 3 or more conductors
}

/**
 * Evaluates all candidate trade sizes for a specific conduit type.
 */
export function evaluateConduitTradeSizes(
  conduitType: ConduitType,
  totalConductorAreaSqIn: number,
  totalWireCount: number,
  isNipple: boolean = false,
  maxWireDiameterInches: number = 0
): {
  candidates: ConduitCandidateEvaluation[];
  recommendedTradeSize: ConduitTradeSize;
  recommendedEvaluation: ConduitCandidateEvaluation;
} {
  const candidates: ConduitCandidateEvaluation[] = [];

  for (const tradeSize of CONDUIT_TRADE_SIZES_ORDERED) {
    const data = getConduitTradeSizeData(conduitType, tradeSize);

    let allowableAreaSqIn: number;
    if (isNipple) {
      allowableAreaSqIn = data.areaNipple60Pct;
    } else if (totalWireCount === 1) {
      allowableAreaSqIn = data.area1Wire53Pct;
    } else if (totalWireCount === 2) {
      allowableAreaSqIn = data.area2Wire31Pct;
    } else {
      allowableAreaSqIn = data.areaOver2Wire40Pct;
    }

    const fillPercentage = roundTo(
      (totalConductorAreaSqIn / data.totalInternalAreaSqIn) * 100,
      2
    );
    const remainingAreaSqIn = roundTo(
      allowableAreaSqIn - totalConductorAreaSqIn,
      4
    );

    // Jam Ratio calculation for 3 wires of similar size in a conduit bend:
    // J = Conduit ID / Conductor OD. If 2.8 <= J <= 3.2, jamming can occur.
    let jamRatio: number | undefined;
    let hasJamRatioRisk = false;

    if (totalWireCount === 3 && maxWireDiameterInches > 0) {
      jamRatio = roundTo(data.internalDiameterInches / maxWireDiameterInches, 2);
      if (jamRatio >= 2.8 && jamRatio <= 3.2) {
        hasJamRatioRisk = true;
      }
    }

    let status: ConduitCandidateEvaluation["status"] = "fail";
    if (totalConductorAreaSqIn <= allowableAreaSqIn) {
      status = hasJamRatioRisk ? "warning" : "pass";
    }

    candidates.push({
      tradeSize,
      internalDiameterInches: data.internalDiameterInches,
      totalInternalAreaSqIn: data.totalInternalAreaSqIn,
      allowableAreaSqIn: roundTo(allowableAreaSqIn, 4),
      actualConductorAreaSqIn: totalConductorAreaSqIn,
      fillPercentage,
      remainingAreaSqIn,
      status,
      jamRatio,
      hasJamRatioRisk,
    });
  }

  // Find the smallest trade size that passes or has warning
  let recommended = candidates.find(
    (c) => c.status === "pass" || c.status === "warning"
  );

  if (!recommended) {
    recommended = candidates[candidates.length - 1];
  }

  const finalCandidates = candidates.map((c) =>
    c.tradeSize === recommended?.tradeSize
      ? { ...c, status: "recommended" as const }
      : c
  );

  return {
    candidates: finalCandidates,
    recommendedTradeSize: recommended.tradeSize,
    recommendedEvaluation: { ...recommended, status: "recommended" },
  };
}

/**
 * Master Conduit Fill calculation orchestrator.
 */
export function calculateConduitFillProject(
  input: ConduitFillInput
): ConduitFillResult {
  const {
    conduitType = "emt",
    isNippleOrShortRun = false,
    conductors = [],
  } = input;

  if (conductors.length === 0 || conductors.every((c) => c.count <= 0)) {
    throw new RangeError("At least one conductor with quantity greater than zero is required");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // 1. Calculate total conductor area
  const { totalAreaSqIn, totalWireCount, maxWireDiameterInches, breakdown } =
    calculateTotalConductorArea(conductors);

  const allowableFillPercentage = getAllowableFillPercentage(
    totalWireCount,
    isNippleOrShortRun
  );

  steps.push({
    label: "Sum Total Conductor Cross-Sectional Area (NEC Chapter 9 Table 5)",
    formula: "Σ (Conductor Count × Area per Wire)",
    values: breakdown
      .map((b) => `${b.count}× ${b.size} (${b.insulation.toUpperCase()}) = ${b.subtotalAreaSqIn} sq in`)
      .join(" + "),
    result: `${totalAreaSqIn} sq in total conductor area (${totalWireCount} conductors)`,
  });

  steps.push({
    label: `Determine Maximum Allowable Fill Percentage (NEC Chapter 9 Table 1)`,
    formula: isNippleOrShortRun
      ? "60% (NEC Chapter 9 Note 4 for Nipples ≤ 24\")"
      : totalWireCount === 1
      ? "53% (Single Conductor)"
      : totalWireCount === 2
      ? "31% (Two Conductors)"
      : "40% (Three or More Conductors)",
    values: `${totalWireCount} conductors in ${conduitType.toUpperCase()}`,
    result: `${allowableFillPercentage}% allowable fill limit`,
  });

  // 2. Evaluate all candidate trade sizes
  const { candidates, recommendedTradeSize, recommendedEvaluation } =
    evaluateConduitTradeSizes(
      conduitType,
      totalAreaSqIn,
      totalWireCount,
      isNippleOrShortRun,
      maxWireDiameterInches
    );

  const conduitInfo =
    CONDUIT_TYPES.find((c) => c.type === conduitType) ?? CONDUIT_TYPES[0];

  steps.push({
    label: `Select Minimum Standard Trade Size for ${conduitInfo.shortName}`,
    formula: "Conduit Trade Size where Allowable Area ≥ Total Conductor Area",
    values: `${recommendedTradeSize}" ${conduitInfo.shortName} (Allowable Area: ${recommendedEvaluation.allowableAreaSqIn} sq in, Conductor Area: ${totalAreaSqIn} sq in)`,
    result: `${recommendedTradeSize}" Trade Size (${recommendedEvaluation.fillPercentage}% actual fill, ${recommendedEvaluation.remainingAreaSqIn} sq in free area)`,
  });

  // Warnings
  if (recommendedEvaluation.hasJamRatioRisk && recommendedEvaluation.jamRatio) {
    warnings.push({
      code: "CONDUIT_JAM_RATIO_WARNING",
      field: "conduitType",
      message: `Jam Ratio is ${recommendedEvaluation.jamRatio} (between 2.8 and 3.2) for 3 conductors in ${recommendedTradeSize}" ${conduitInfo.shortName}. During pulling through bends, the three conductors may align side-by-side and jam against the conduit wall. Upsizing to the next trade size is recommended.`,
    });
  }

  if (conduitType === "pvc_sch80") {
    warnings.push({
      code: "PVC_SCHEDULE_80_THICK_WALL_NOTICE",
      field: "conduitType",
      message: "PVC Schedule 80 has a thicker wall and significantly smaller internal diameter than Schedule 40 or EMT. Ensure trade sizes are sized accordingly for physical protection runs.",
    });
  }

  // Safety & AHJ Disclaimer
  warnings.push({
    code: "CONDUIT_FILL_CODE_DISCLAIMER",
    message: "Planning and design reference calculator based on NEC Chapter 9 Tables 1, 4, and 5. Conductor diameters and jacket thicknesses vary slightly by manufacturer (e.g. Southwire, Cerrowire). Verify actual raceway dimensions, pull box requirements, and local electrical inspector (AHJ) rules.",
  });

  return {
    conduitType,
    isNipple: isNippleOrShortRun,
    totalConductorCount: totalWireCount,
    totalConductorAreaSqIn: totalAreaSqIn,
    allowableFillPercentage,
    recommendedTradeSize,
    recommendedConduitAreaSqIn: recommendedEvaluation.totalInternalAreaSqIn,
    allowableConduitAreaSqIn: recommendedEvaluation.allowableAreaSqIn,
    actualFillPercentage: recommendedEvaluation.fillPercentage,
    remainingAreaSqIn: recommendedEvaluation.remainingAreaSqIn,
    isCompliant: recommendedEvaluation.actualConductorAreaSqIn <= recommendedEvaluation.allowableAreaSqIn,
    hasJamRatioRisk: recommendedEvaluation.hasJamRatioRisk,
    jamRatio: recommendedEvaluation.jamRatio,
    candidates,
    warnings,
    steps,
  };
}
