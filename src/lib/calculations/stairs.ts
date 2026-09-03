import type {
  StairCalculatorInput,
  StairCalculatorResult,
  StairCodeCompliance,
  StairCostEstimate,
  StairGeometryResult,
  StairMaterialsTakeoff,
  StairStepCutItem,
} from "@/types/stairs";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  STANDARD_STRINGER_STOCK_LENGTHS,
  getStairCodeLimit,
  getStringerLumberInfo,
} from "@/data/materials/stair-types";
import { formatFeetAndInches } from "./roof";
import { roundTo } from "./rounding";

/**
 * Calculates theoretical riser count, exact riser height, tread count, and total run.
 */
export function calculateRiserAndTreadCounts(
  totalRiseInches: number,
  targetRiserHeightInches: number = 7.5,
  targetTreadDepthInches: number = 10.5
): {
  riserCount: number;
  exactRiserHeightInches: number;
  treadCount: number;
  exactTreadDepthInches: number;
  totalRunInches: number;
  stairAngleDegrees: number;
  comfortRuleValueInches: number;
} {
  if (totalRiseInches <= 0) {
    throw new RangeError("Total stair rise must be greater than zero");
  }
  if (targetRiserHeightInches <= 0) {
    throw new RangeError("Target riser height must be greater than zero");
  }
  if (targetTreadDepthInches <= 0) {
    throw new RangeError("Target tread depth must be greater than zero");
  }

  // Optimize riser count (nearest integer to totalRise / targetRiser)
  const riserCount = Math.max(1, Math.round(totalRiseInches / targetRiserHeightInches));
  const exactRiserHeightInches = roundTo(totalRiseInches / riserCount, 3);

  // For standard flush top landing, treads = risers - 1
  const treadCount = Math.max(1, riserCount - 1);
  const exactTreadDepthInches = roundTo(targetTreadDepthInches, 3);
  const totalRunInches = roundTo(treadCount * exactTreadDepthInches, 2);

  // Incline Angle: arctan(Riser / Tread)
  const angleRadians = Math.atan(exactRiserHeightInches / exactTreadDepthInches);
  const stairAngleDegrees = roundTo((angleRadians * 180) / Math.PI, 2);

  // Comfort Rule: 2R + T
  const comfortRuleValueInches = roundTo(2 * exactRiserHeightInches + exactTreadDepthInches, 2);

  return {
    riserCount,
    exactRiserHeightInches,
    treadCount,
    exactTreadDepthInches,
    totalRunInches,
    stairAngleDegrees,
    comfortRuleValueInches,
  };
}

/**
 * Evaluates overhead ceiling headroom clearance for each tread along the stair run.
 */
export function evaluateHeadroomClearance(
  totalRiseInches: number,
  exactRiserHeightInches: number,
  exactTreadDepthInches: number,
  treadCount: number,
  totalRunInches: number,
  wellholeLengthInches?: number,
  upperFloorThicknessInches: number = 11.25,
  treadThicknessInches: number = 1.0
): {
  headroomClearanceInches: number;
  headroomCriticalStep: number;
} {
  // If wellhole opening is not specified, assume generous opening (120 inches)
  const wellhole = wellholeLengthInches && wellholeLengthInches > 0 ? wellholeLengthInches : 120;
  const ceilingHeaderPositionX = Math.max(0, totalRunInches - wellhole);
  const ceilingHeightAboveLowerFloor = totalRiseInches - upperFloorThicknessInches;

  let minClearance = 999;
  let criticalStep = 1;

  for (let i = 1; i <= treadCount; i++) {
    const stepNoseX = i * exactTreadDepthInches;
    const stepTreadY = i * exactRiserHeightInches + treadThicknessInches;

    // Check if this step is underneath the upper floor ceiling plane
    if (stepNoseX <= ceilingHeaderPositionX) {
      const clearance = ceilingHeightAboveLowerFloor - stepTreadY;
      if (clearance < minClearance) {
        minClearance = clearance;
        criticalStep = i;
      }
    }
  }

  // If no step is underneath the ceiling plane, headroom is unlimited (report full ceiling height)
  if (minClearance === 999) {
    minClearance = totalRiseInches - exactRiserHeightInches;
    criticalStep = 1;
  }

  return {
    headroomClearanceInches: roundTo(minClearance, 1),
    headroomCriticalStep: criticalStep,
  };
}

/**
 * Evaluates stair configuration against building code limits.
 */
export function evaluateCodeCompliance(
  riserHeightInches: number,
  treadDepthInches: number,
  headroomInches: number,
  stairWidthInches: number,
  comfortRuleScore: number,
  codeStandard: "irc" | "commercial" | "custom" = "irc"
): StairCodeCompliance {
  const limits = getStairCodeLimit(codeStandard);

  const isRiserCompliant =
    riserHeightInches >= limits.minRiserInches && riserHeightInches <= limits.maxRiserInches;
  const isTreadCompliant = treadDepthInches >= limits.minTreadInches;
  const isHeadroomCompliant = headroomInches >= limits.minHeadroomInches;
  const isWidthCompliant = stairWidthInches >= limits.minWidthInches;
  const isComfortRuleCompliant = comfortRuleScore >= 24.0 && comfortRuleScore <= 25.5;

  const overallCompliant =
    isRiserCompliant && isTreadCompliant && isHeadroomCompliant && isWidthCompliant;

  return {
    isRiserCompliant,
    maxRiserAllowedInches: limits.maxRiserInches,
    isTreadCompliant,
    minTreadAllowedInches: limits.minTreadInches,
    isHeadroomCompliant,
    minHeadroomAllowedInches: limits.minHeadroomInches,
    isWidthCompliant,
    minWidthAllowedInches: limits.minWidthInches,
    isComfortRuleCompliant,
    comfortRuleScoreInches: comfortRuleScore,
    overallCompliant,
  };
}

/**
 * Calculates complete stair geometry, stringer cuts, deductions, and code compliance.
 */
export function calculateStairGeometry(input: StairCalculatorInput): StairGeometryResult {
  const {
    totalRiseInches,
    targetRiserHeightInches = 7.5,
    targetTreadDepthInches = 10.5,
    treadThicknessInches = 1.0,
    finishedFloorLowerInches = 0.75,
    stairWidthInches = 36,
    stringerStock = "2x12",
    wellholeLengthInches,
    upperFloorThicknessInches = 11.25,
    codeStandard = "irc",
  } = input;

  if (totalRiseInches <= 0) {
    throw new RangeError("Total stair rise must be greater than zero");
  }

  const {
    riserCount,
    exactRiserHeightInches,
    treadCount,
    exactTreadDepthInches,
    totalRunInches,
    stairAngleDegrees,
    comfortRuleValueInches,
  } = calculateRiserAndTreadCounts(
    totalRiseInches,
    targetRiserHeightInches,
    targetTreadDepthInches
  );

  // Stringer Line Length (hypotenuse)
  const stringerLineLengthInches = roundTo(
    Math.sqrt(Math.pow(totalRiseInches, 2) + Math.pow(totalRunInches, 2)),
    2
  );
  const stringerLineLengthFt = roundTo(stringerLineLengthInches / 12, 2);

  // Minimum Stock Board Length (ft)
  const minBoardFtRequired = Math.ceil((stringerLineLengthInches + 6) / 12);
  const stringerMinBoardLengthFt =
    STANDARD_STRINGER_STOCK_LENGTHS.find((len) => len >= minBoardFtRequired) ?? 20;

  // Bottom Riser Stringer Drop Deduction = Tread Thickness - Lower Finished Floor
  const bottomRiserDeductionInches = roundTo(
    Math.max(0, treadThicknessInches - finishedFloorLowerInches),
    2
  );

  // Top Stringer Hanger Deduction
  const topHangerDeductionInches = roundTo(exactTreadDepthInches, 2);

  // Stringer Throat Depth (solid wood remaining beneath notch)
  const lumberInfo = getStringerLumberInfo(stringerStock);
  const angleRad = (stairAngleDegrees * Math.PI) / 180;
  const stringerThroatDepthInches = roundTo(
    lumberInfo.actualDepthInches - exactRiserHeightInches * Math.cos(angleRad),
    2
  );

  // Headroom Clearance Evaluation
  const { headroomClearanceInches, headroomCriticalStep } = evaluateHeadroomClearance(
    totalRiseInches,
    exactRiserHeightInches,
    exactTreadDepthInches,
    treadCount,
    totalRunInches,
    wellholeLengthInches,
    upperFloorThicknessInches,
    treadThicknessInches
  );

  // Building Code Compliance
  const codeCompliance = evaluateCodeCompliance(
    exactRiserHeightInches,
    exactTreadDepthInches,
    headroomClearanceInches,
    stairWidthInches,
    comfortRuleValueInches,
    codeStandard
  );

  // Step-by-step layout cut schedule
  const cutSchedule: StairStepCutItem[] = [];
  for (let i = 1; i <= riserCount; i++) {
    cutSchedule.push({
      stepNumber: i,
      riserHeightInches: exactRiserHeightInches,
      treadDepthInches: i <= treadCount ? exactTreadDepthInches : 0,
      cumulativeRiseInches: roundTo(i * exactRiserHeightInches, 2),
      cumulativeRunInches: roundTo(Math.min(i, treadCount) * exactTreadDepthInches, 2),
    });
  }

  return {
    totalRiseInches,
    totalRiseFormatted: formatFeetAndInches(totalRiseInches),
    totalRunInches,
    totalRunFormatted: formatFeetAndInches(totalRunInches),
    riserCount,
    exactRiserHeightInches,
    exactRiserHeightFormatted: formatFeetAndInches(exactRiserHeightInches),
    treadCount,
    exactTreadDepthInches,
    exactTreadDepthFormatted: formatFeetAndInches(exactTreadDepthInches),
    stairAngleDegrees,
    comfortRuleValueInches,
    stringerLineLengthInches,
    stringerLineLengthFt,
    stringerLineLengthFormatted: formatFeetAndInches(stringerLineLengthInches),
    stringerMinBoardLengthFt,
    bottomRiserDeductionInches,
    topHangerDeductionInches,
    stringerThroatDepthInches,
    headroomClearanceInches,
    headroomCriticalStep,
    codeCompliance,
    cutSchedule,
  };
}

/**
 * Calculates complete stair material takeoff and optional cost estimation.
 */
export function calculateStairMaterials(
  geometry: StairGeometryResult,
  stairWidthInches: number = 36,
  maxStringerSpacingInches: number = 16,
  stringerStock: "2x12" | "2x14" | "LVL" = "2x12",
  costRates?: StairCalculatorInput["costRates"]
): {
  materials: StairMaterialsTakeoff;
  costEstimate?: StairCostEstimate;
} {
  // Stringer count: width / max spacing + 1 (min 2)
  const stringerBoardCount = Math.max(
    2,
    Math.ceil(stairWidthInches / maxStringerSpacingInches) + 1
  );

  const treadBoardPieces = geometry.treadCount;
  const riserBoardPieces = geometry.riserCount;
  const stringerHangersCount = stringerBoardCount;
  const structuralScrewsLbs = Math.max(1, Math.ceil(stringerBoardCount * 0.75));

  const materials: StairMaterialsTakeoff = {
    stringerBoardCount,
    stringerStockLengthFt: geometry.stringerMinBoardLengthFt,
    stringerLumberStock: stringerStock,
    treadBoardPieces,
    riserBoardPieces,
    stringerHangersCount,
    structuralScrewsLbs,
  };

  let costEstimate: StairCostEstimate | undefined;
  if (costRates) {
    const priceStringer = costRates.pricePerStringerBoard ?? 0;
    const priceTread = costRates.pricePerTreadBoard ?? 0;
    const priceRiser = costRates.pricePerRiserBoard ?? 0;
    const priceHanger = costRates.pricePerHangerBracket ?? 0;

    const stringersCost = stringerBoardCount * priceStringer;
    const treadsCost = treadBoardPieces * priceTread;
    const risersCost = riserBoardPieces * priceRiser;
    const hangersCost = stringerHangersCount * priceHanger;
    const totalEstimatedCost = stringersCost + treadsCost + risersCost + hangersCost;

    costEstimate = {
      stringersCost: roundTo(stringersCost, 2),
      treadsCost: roundTo(treadsCost, 2),
      risersCost: roundTo(risersCost, 2),
      hangersCost: roundTo(hangersCost, 2),
      totalEstimatedCost: roundTo(totalEstimatedCost, 2),
    };
  }

  return { materials, costEstimate };
}

/**
 * Master stair project orchestrator.
 */
export function calculateStairProject(input: StairCalculatorInput): StairCalculatorResult {
  const {
    totalRiseInches,
    stairWidthInches = 36,
    maxStringerSpacingInches = 16,
    stringerStock = "2x12",
    codeStandard = "irc",
    costRates,
  } = input;

  if (totalRiseInches <= 0) {
    throw new RangeError("Total stair rise must be greater than zero");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // 1. Geometry & Code Check
  const geometry = calculateStairGeometry(input);

  steps.push({
    label: "Determine Optimal Riser & Tread Count",
    formula: "Risers = round(Total Rise ÷ Target Riser Height)",
    values: `${totalRiseInches}" ÷ ${input.targetRiserHeightInches ?? 7.5}" = ${geometry.riserCount} risers (${geometry.treadCount} treads)`,
    result: `${geometry.exactRiserHeightInches}" exact riser height (${geometry.exactRiserHeightFormatted})`,
  });

  steps.push({
    label: "Calculate Total Stair Run",
    formula: "Treads × Tread Depth",
    values: `${geometry.treadCount} treads × ${geometry.exactTreadDepthInches}"`,
    result: `${geometry.totalRunInches}" total run (${geometry.totalRunFormatted})`,
  });

  steps.push({
    label: "Calculate Stringer Board Length & Bottom Cut Drop",
    formula: "√(Rise² + Run²) & (Tread Thickness − Lower Floor Finish)",
    values: `√(${totalRiseInches}² + ${geometry.totalRunInches}²) = ${geometry.stringerLineLengthInches}" (Cut ${geometry.bottomRiserDeductionInches}" off stringer bottom)`,
    result: `${geometry.stringerMinBoardLengthFt} ft stock board (${geometry.stringerLineLengthFormatted} line length)`,
  });

  // Warnings for code non-compliance
  if (!geometry.codeCompliance.isRiserCompliant) {
    warnings.push({
      code: "STAIR_RISER_EXCEEDS_CODE",
      field: "targetRiserHeightInches",
      message: `Riser height (${geometry.exactRiserHeightInches}") exceeds maximum code allowance (${geometry.codeCompliance.maxRiserAllowedInches}" for ${codeStandard.toUpperCase()}). Consider increasing riser count to reduce step height.`,
    });
  }

  if (!geometry.codeCompliance.isTreadCompliant) {
    warnings.push({
      code: "STAIR_TREAD_BELOW_CODE",
      field: "targetTreadDepthInches",
      message: `Tread depth (${geometry.exactTreadDepthInches}") is below minimum code requirement (${geometry.codeCompliance.minTreadAllowedInches}" for ${codeStandard.toUpperCase()}). Increase tread depth for safe footing.`,
    });
  }

  if (!geometry.codeCompliance.isHeadroomCompliant) {
    warnings.push({
      code: "STAIR_HEADROOM_INSUFFICIENT",
      field: "wellholeLengthInches",
      message: `Minimum headroom clearance (${geometry.headroomClearanceInches}") at step #${geometry.headroomCriticalStep} is below the 80" (6'8") code minimum. Enlarge the ceiling wellhole opening or adjust total run.`,
    });
  }

  if (geometry.stringerThroatDepthInches < 3.5) {
    warnings.push({
      code: "STRINGER_THROAT_TOO_THIN",
      field: "stringerStock",
      message: `Stringer throat solid wood depth (${geometry.stringerThroatDepthInches}") is under 3.5". Use 2x14 lumber or engineered LVL stringers to prevent structural sagging/failure.`,
    });
  }

  // 2. Materials & Costs
  const { materials, costEstimate } = calculateStairMaterials(
    geometry,
    stairWidthInches,
    maxStringerSpacingInches,
    stringerStock,
    costRates
  );

  steps.push({
    label: "Determine Stringer Quantity",
    formula: "⌈Stair Width ÷ Max Spacing⌉ + 1",
    values: `⌈${stairWidthInches}" ÷ ${maxStringerSpacingInches}"⌉ + 1`,
    result: `${materials.stringerBoardCount} stringers (${materials.stringerStockLengthFt}' ${stringerStock} boards)`,
  });

  // Structural Safety Disclaimer
  warnings.push({
    code: "STRUCTURAL_STAIR_DISCLAIMER",
    message: "Geometry and stringer layout estimate only. Stair structural support, center stringer blocking, handrail/guardrail heights (34\"–38\"), baluster 4\" sphere rules, and local building code compliance must be verified with local building officials.",
  });

  return {
    geometry,
    materials,
    costEstimate,
    warnings,
    steps,
  };
}
