import type {
  BirdsmouthGeometry,
  RafterCutAngles,
  RafterGeometryResult,
  RoofCalculatorInput,
  RoofCalculatorResult,
  RoofCostEstimate,
  RoofMaterialsTakeoff,
} from "@/types/roof";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  ROOFING_CONSTANTS,
  getRafterLumberInfo,
} from "@/data/materials/roofing-types";
import { roundTo } from "./rounding";

/**
 * Converts decimal inches to a traditional fractional string (to nearest 1/16").
 */
export function formatFeetAndInches(totalInches: number): string {
  if (isNaN(totalInches) || totalInches <= 0) return "0 in";

  const totalInchesRounded = Math.round(totalInches * 16) / 16;
  const feet = Math.floor(totalInchesRounded / 12);
  const remainingInches = totalInchesRounded - feet * 12;
  const wholeInches = Math.floor(remainingInches);
  const fractionSixteenths = Math.round((remainingInches - wholeInches) * 16);

  let fractionStr = "";
  if (fractionSixteenths > 0) {
    // Reduce fraction
    if (fractionSixteenths === 16) {
      return formatFeetAndInches(totalInches + 1);
    } else if (fractionSixteenths % 8 === 0) {
      fractionStr = `${fractionSixteenths / 8}/2`;
    } else if (fractionSixteenths % 4 === 0) {
      fractionStr = `${fractionSixteenths / 4}/4`;
    } else if (fractionSixteenths % 2 === 0) {
      fractionStr = `${fractionSixteenths / 2}/8`;
    } else {
      fractionStr = `${fractionSixteenths}/16`;
    }
  }

  const inchPart =
    fractionStr.length > 0
      ? wholeInches > 0
        ? `${wholeInches}-${fractionStr}"`
        : `${fractionStr}"`
      : `${wholeInches}"`;

  if (feet > 0) {
    return `${feet}' ${inchPart}`;
  }
  return inchPart;
}

/**
 * Calculates pitch angle, grade %, and slope multiplier factor.
 */
export function calculatePitchProperties(pitchIn12: number): {
  pitchAngleDegrees: number;
  gradePercent: number;
  slopeFactor: number;
} {
  if (pitchIn12 <= 0) {
    throw new RangeError("Roof pitch must be greater than zero");
  }
  if (pitchIn12 > 36) {
    throw new RangeError("Roof pitch must be 36/12 (71.6°) or less");
  }

  const pitchRadians = Math.atan(pitchIn12 / 12);
  const pitchAngleDegrees = roundTo((pitchRadians * 180) / Math.PI, 2);
  const gradePercent = roundTo((pitchIn12 / 12) * 100, 2);
  const slopeFactor = roundTo(Math.sqrt(1 + Math.pow(pitchIn12 / 12, 2)), 4);

  return {
    pitchAngleDegrees,
    gradePercent,
    slopeFactor,
  };
}

/**
 * Calculates complete common rafter geometry including line length, overhang,
 * ridge deduction, ridge height, birdsmouth cuts, and cut angles.
 */
export function calculateRafterGeometry(
  input: RoofCalculatorInput
): RafterGeometryResult {
  const {
    buildingWidthFt,
    pitchIn12,
    eaveOverhangInches = 12,
    ridgeBoardThicknessInches = 1.5,
    rafterDepthNominal = "2x6",
    seatCutBearingInches = 3.5,
  } = input;

  if (buildingWidthFt <= 0) {
    throw new RangeError("Building width / span must be greater than zero");
  }

  const { pitchAngleDegrees, gradePercent, slopeFactor } =
    calculatePitchProperties(pitchIn12);

  const runFt = buildingWidthFt / 2;
  const runInches = runFt * 12;
  const riseFt = runFt * (pitchIn12 / 12);
  const riseInches = riseFt * 12;

  // Common Rafter Line Length (Center of ridge to outer wall plate line)
  const rafterLineLengthFt = roundTo(runFt * slopeFactor, 3);
  const rafterLineLengthInches = roundTo(runInches * slopeFactor, 2);

  // Overhang Rafter Tail Length
  const overhangRunInches = Math.max(0, eaveOverhangInches);
  const overhangRafterLengthInches = roundTo(overhangRunInches * slopeFactor, 2);

  // Ridge Board Thickness deduction along rafter line = (half thickness) * slopeFactor
  const halfRidgeThick = Math.max(0, ridgeBoardThicknessInches) / 2;
  const ridgeDeductionInches = roundTo(halfRidgeThick * slopeFactor, 2);

  // Practical cut length from top plumb cut to bottom plumb cut
  const totalCutInches =
    rafterLineLengthInches - ridgeDeductionInches + overhangRafterLengthInches;
  const totalCutRafterLengthFt = roundTo(totalCutInches / 12, 3);

  // Birdsmouth Geometry
  const lumberInfo = getRafterLumberInfo(rafterDepthNominal);
  const actualRafterDepth = lumberInfo.actualDepthInches;
  const seatBearing = Math.max(1.0, seatCutBearingInches);
  const plumbCutDepthInches = roundTo(seatBearing * (pitchIn12 / 12), 2);
  const heightAbovePlateInches = roundTo(
    Math.max(0.5, actualRafterDepth - plumbCutDepthInches),
    2
  );

  const birdsmouth: BirdsmouthGeometry = {
    seatCutLengthInches: seatBearing,
    plumbCutDepthInches,
    heightAbovePlateInches,
  };

  // Cut Angles
  const plumbCutAngleDegrees = pitchAngleDegrees;
  const seatCutAngleDegrees = roundTo(90 - pitchAngleDegrees, 2);

  const cutAngles: RafterCutAngles = {
    plumbCutAngleDegrees,
    seatCutAngleDegrees,
    plumbCutPitchString: `${pitchIn12}/12`,
    seatCutPitchString: `${roundTo(144 / pitchIn12, 1)}/12`,
  };

  // Theoretical Ridge Board Height above top wall plate
  const ridgeHeightAbovePlateFt = roundTo(
    riseFt + heightAbovePlateInches / 12,
    2
  );

  return {
    buildingSpanFt: buildingWidthFt,
    runFt: roundTo(runFt, 2),
    runInches: roundTo(runInches, 1),
    riseFt: roundTo(riseFt, 2),
    riseInches: roundTo(riseInches, 1),
    pitchIn12,
    pitchAngleDegrees,
    gradePercent,
    slopeFactor,
    rafterLineLengthFt,
    rafterLineLengthInches,
    rafterLineLengthFormatted: formatFeetAndInches(rafterLineLengthInches),
    overhangRunInches,
    overhangRafterLengthInches,
    ridgeDeductionInches,
    totalCutRafterLengthFt,
    totalCutRafterLengthFormatted: formatFeetAndInches(totalCutInches),
    ridgeHeightAbovePlateFt,
    birdsmouth,
    cutAngles,
  };
}

/**
 * Calculates sloped roof surface area, roofing squares, and material quantities
 * including shingle bundles, underlayment rolls, drip edge, and ridge cap shingles.
 */
export function calculateRoofMaterials(
  input: RoofCalculatorInput,
  slopeFactor: number
): RoofMaterialsTakeoff {
  const {
    buildingLengthFt,
    buildingWidthFt,
    eaveOverhangInches = 12,
    gableOverhangInches = 12,
    wastePercent = 10,
  } = input;

  if (buildingLengthFt <= 0) {
    throw new RangeError("Building length must be greater than zero");
  }
  if (buildingWidthFt <= 0) {
    throw new RangeError("Building width must be greater than zero");
  }

  // Total roof footprint including overhangs
  const totalLengthFt = buildingLengthFt + (2 * gableOverhangInches) / 12;
  const totalWidthFt = buildingWidthFt + (2 * eaveOverhangInches) / 12;
  const flatFootprintAreaSqFt = roundTo(totalLengthFt * totalWidthFt, 2);

  // Actual sloped surface area
  const roofSurfaceAreaSqFt = roundTo(flatFootprintAreaSqFt * slopeFactor, 2);
  const roofingSquares = roundTo(roofSurfaceAreaSqFt / 100, 2);

  // Waste allowance
  const wasteAreaSqFt = roundTo(roofSurfaceAreaSqFt * (wastePercent / 100), 2);
  const adjustedAreaSqFt = roundTo(roofSurfaceAreaSqFt + wasteAreaSqFt, 2);
  const adjustedSquares = roundTo(adjustedAreaSqFt / 100, 2);

  // Shingles (3 bundles per square)
  const shingleBundlesCount = Math.ceil(
    adjustedSquares * ROOFING_CONSTANTS.SHINGLE_BUNDLES_PER_SQUARE
  );

  // Underlayment
  const underlaymentRollsSynthetic = Math.max(
    1,
    Math.ceil(
      adjustedAreaSqFt / ROOFING_CONSTANTS.SYNTHETIC_UNDERLAYMENT_ROLL_SQ_FT
    )
  );
  const underlaymentRollsFelt = Math.max(
    1,
    Math.ceil(adjustedAreaSqFt / ROOFING_CONSTANTS.FELT_UNDERLAYMENT_ROLL_SQ_FT)
  );

  // Drip Edge (Perimeter: 2 Eaves + 4 Rakes)
  const eavesLengthFt = roundTo(2 * totalLengthFt, 2);
  const singleRakeSlopeFt = (totalWidthFt / 2) * slopeFactor;
  const rakesLengthFt = roundTo(4 * singleRakeSlopeFt, 2);
  const dripEdgeLinearFt = roundTo(eavesLengthFt + rakesLengthFt, 2);
  const dripEdgePieces10Ft = Math.ceil(
    dripEdgeLinearFt / ROOFING_CONSTANTS.DRIP_EDGE_PIECE_LENGTH_FT
  );

  // Ridge Cap Shingles (Length = total roof length)
  const ridgeLengthFt = roundTo(totalLengthFt, 2);
  const ridgeCapBundlesCount = Math.max(
    1,
    Math.ceil(ridgeLengthFt / ROOFING_CONSTANTS.RIDGE_CAP_BUNDLE_LINEAR_FT)
  );

  return {
    flatFootprintAreaSqFt,
    roofSurfaceAreaSqFt,
    roofingSquares,
    wastePercent,
    wasteAreaSqFt,
    adjustedAreaSqFt,
    adjustedSquares,
    shingleBundlesCount,
    underlaymentRollsSynthetic,
    underlaymentRollsFelt,
    eavesLengthFt,
    rakesLengthFt,
    dripEdgeLinearFt,
    dripEdgePieces10Ft,
    ridgeLengthFt,
    ridgeCapBundlesCount,
  };
}

/**
 * Calculates complete roof pitch, rafter geometry, surface area, material takeoff,
 * cost breakdown, and step-by-step mathematical formulas.
 */
export function calculateRoofProject(
  input: RoofCalculatorInput
): RoofCalculatorResult {
  const {
    buildingLengthFt,
    buildingWidthFt,
    pitchIn12,
    wastePercent = 10,
    costRates,
  } = input;

  if (buildingLengthFt <= 0) {
    throw new RangeError("Building length must be greater than zero");
  }
  if (buildingWidthFt <= 0) {
    throw new RangeError("Building width / span must be greater than zero");
  }
  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percentage must be between 0% and 100%");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // 1. Rafter Geometry
  const geometry = calculateRafterGeometry(input);

  steps.push({
    label: `Calculate Roof Slope Angle & Multiplier (${pitchIn12}/12 pitch)`,
    formula: "arctan(pitch ÷ 12) & √(1 + [pitch/12]²)",
    values: `arctan(${pitchIn12}/12) = ${geometry.pitchAngleDegrees}° (Slope factor: ${geometry.slopeFactor})`,
    result: `${geometry.pitchAngleDegrees}° pitch angle`,
  });

  steps.push({
    label: "Common Rafter Line Length",
    formula: "Run × Slope Factor = √(Run² + Rise²)",
    values: `${geometry.runFt} ft run × ${geometry.slopeFactor} multiplier`,
    result: `${geometry.rafterLineLengthFt} ft (${geometry.rafterLineLengthFormatted})`,
  });

  steps.push({
    label: "Estimated Common Rafter Cut Length (under stated ridge & overhang assumptions)",
    formula: "Line Length − (½ Ridge Board × Slope Factor) + Overhang Rafter",
    values: `${geometry.rafterLineLengthInches}" − ${geometry.ridgeDeductionInches}" + ${geometry.overhangRafterLengthInches}"`,
    result: `${geometry.totalCutRafterLengthFt} ft (${geometry.totalCutRafterLengthFormatted})`,
  });

  // Check birdsmouth notch depth safety (Reference Check)
  const lumberInfo = getRafterLumberInfo(input.rafterDepthNominal);
  if (geometry.birdsmouth.plumbCutDepthInches > lumberInfo.actualDepthInches / 3) {
    warnings.push({
      code: "DEEP_BIRDSMOUTH_NOTCH",
      field: "seatCutBearingInches",
      message: `Reference note: Birdsmouth plumb notch depth (${geometry.birdsmouth.plumbCutDepthInches}") exceeds 1/3 of rafter stock depth (${lumberInfo.actualDepthInches}"). Model building codes (e.g. IRC Section R802.5.2) commonly restrict notch depth to limit cross-grain splitting. This check is informational only and does not constitute structural approval.`,
    });
  }

  // Check low slope shingle warning (Material Reference)
  if (pitchIn12 < 4) {
    warnings.push({
      code: "LOW_SLOPE_SHINGLE_LIMITATION",
      field: "pitchIn12",
      message: `Roofing material reference: Roof pitch (${pitchIn12}/12) is below 4/12. Standard asphalt shingles generally require double-layer underlayment on 2/12 to 4/12 slopes (e.g. IRC Table R905.1.1) and are prohibited below 2/12. Verify applicable roofing assembly specifications separately.`,
    });
  }

  // 2. Surface Area & Materials
  const materials = calculateRoofMaterials(input, geometry.slopeFactor);

  steps.push({
    label: "Sloped Roof Surface Area Estimate",
    formula: "Flat Footprint with Overhangs × Slope Multiplier",
    values: `${materials.flatFootprintAreaSqFt} sq ft flat × ${geometry.slopeFactor}`,
    result: `${materials.roofSurfaceAreaSqFt} sq ft (${materials.roofingSquares} squares)`,
  });

  steps.push({
    label: `Calculate Shingle Bundles (${wastePercent}% waste applied)`,
    formula: "⌈Adjusted Squares × 3 bundles/square⌉",
    values: `⌈${materials.adjustedSquares} squares × 3⌉`,
    result: `${materials.shingleBundlesCount} bundles`,
  });

  // 3. Optional Cost Estimator
  let costEstimate: RoofCostEstimate | undefined;
  if (costRates) {
    const priceSquare = costRates.pricePerSquare ?? 0;
    const priceBundle = costRates.pricePerShingleBundle ?? 0;
    const priceUnderlayment = costRates.pricePerUnderlaymentRoll ?? 0;
    const priceDrip = costRates.pricePerDripEdgePiece ?? 0;
    const priceRidge = costRates.pricePerRidgeCapBundle ?? 0;

    const shinglesCost =
      priceSquare > 0
        ? materials.adjustedSquares * priceSquare
        : materials.shingleBundlesCount * priceBundle;
    const underlaymentCost =
      materials.underlaymentRollsSynthetic * priceUnderlayment;
    const dripEdgeCost = materials.dripEdgePieces10Ft * priceDrip;
    const ridgeCapCost = materials.ridgeCapBundlesCount * priceRidge;
    const totalEstimatedCost =
      shinglesCost + underlaymentCost + dripEdgeCost + ridgeCapCost;

    costEstimate = {
      shinglesCost: roundTo(shinglesCost, 2),
      underlaymentCost: roundTo(underlaymentCost, 2),
      dripEdgeCost: roundTo(dripEdgeCost, 2),
      ridgeCapCost: roundTo(ridgeCapCost, 2),
      totalEstimatedCost: roundTo(totalEstimatedCost, 2),
    };
  }

  // Structural Disclaimer
  warnings.push({
    code: "STRUCTURAL_RAFTER_DISCLAIMER",
    message: "Geometric layout and material estimation reference only. Structural rafter sizing, lumber species/grades, allowable clear spans, collar tie spacing, and snow/wind load deflection criteria must be verified against applicable building codes (such as IRC Table R802.5.1) or project engineering.",
  });

  return {
    roofType: "gable",
    geometry,
    materials,
    costEstimate,
    warnings,
    steps,
  };
}
