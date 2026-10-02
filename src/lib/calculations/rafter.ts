import type {
  RafterCalculatorInput,
  RafterCalculatorResult,
  RafterGeometryResult,
  RafterIrcCompliance,
  BirdsmouthGeometry,
  RafterCutAngles,
} from "@/types/rafter";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import { getRafterLumberInfo } from "@/data/materials/roofing-types";
import { formatFeetAndInches, calculatePitchProperties } from "./roof";
import { roundTo } from "./rounding";

const STANDARD_STOCK_LUMBER_FEET = [8, 10, 12, 14, 16, 18, 20, 22, 24] as const;

/**
 * Calculates complete common rafter framing geometry, birdsmouth cuts,
 * IRC R802.7.1 code compliance checks, and lumber order recommendations.
 */
export function calculateRafterProject(
  input: RafterCalculatorInput
): RafterCalculatorResult {
  const {
    buildingSpanFt,
    pitchIn12,
    eaveOverhangInches = 12,
    ridgeBoardThicknessInches = 1.5,
    rafterDepthNominal = "2x6",
    seatCutBearingInches = 3.5,
    rafterSpacingInches = 16,
    roofLengthFt,
  } = input;

  if (buildingSpanFt <= 0) {
    throw new RangeError("Building span must be greater than zero.");
  }
  if (pitchIn12 <= 0) {
    throw new RangeError("Roof pitch must be greater than zero.");
  }
  if (pitchIn12 > 36) {
    throw new RangeError("Roof pitch must be 36/12 or less.");
  }

  const { pitchAngleDegrees, gradePercent, slopeFactor } =
    calculatePitchProperties(pitchIn12);

  // 1. Run and Rise Calculations
  const runFt = roundTo(buildingSpanFt / 2, 3);
  const runInches = roundTo(runFt * 12, 2);
  const riseFt = roundTo(runFt * (pitchIn12 / 12), 3);
  const riseInches = roundTo(riseFt * 12, 2);

  // 2. Common Rafter Line Length (Center of ridge to outer wall plate line)
  const rafterLineLengthInches = roundTo(runInches * slopeFactor, 2);
  const rafterLineLengthFt = roundTo(rafterLineLengthInches / 12, 3);

  // 3. Overhang Length along Rafter Slope
  const overhangRunInches = Math.max(0, eaveOverhangInches);
  const overhangRafterLengthInches = roundTo(overhangRunInches * slopeFactor, 2);

  // 4. Ridge Board Thickness Deduction
  const halfRidgeThick = Math.max(0, ridgeBoardThicknessInches) / 2;
  const ridgeDeductionInches = roundTo(halfRidgeThick * slopeFactor, 2);

  // 5. Total Practical Cut Length (From top plumb cut to tail cut)
  const totalCutInches = roundTo(
    rafterLineLengthInches - ridgeDeductionInches + overhangRafterLengthInches,
    2
  );
  const totalCutRafterLengthFt = roundTo(totalCutInches / 12, 3);

  // 6. Birdsmouth Geometry & IRC R802.7.1 Notching Limits
  const lumberInfo = getRafterLumberInfo(rafterDepthNominal);
  const actualRafterDepth = lumberInfo.actualDepthInches;
  const seatBearing = Math.max(0.5, seatCutBearingInches);
  const plumbCutDepthInches = roundTo(seatBearing * (pitchIn12 / 12), 2);
  const heightAbovePlateInches = roundTo(
    Math.max(0, actualRafterDepth - plumbCutDepthInches),
    2
  );

  const birdsmouth: BirdsmouthGeometry = {
    seatCutLengthInches: seatBearing,
    plumbCutDepthInches,
    heightAbovePlateInches,
  };

  // IRC R802.7.1: Notches on rafter ends cannot exceed 1/4 of actual depth
  const maxAllowedPlumbCutInches = roundTo(actualRafterDepth / 4, 2);
  const isNotchCompliant = plumbCutDepthInches <= maxAllowedPlumbCutInches;
  const isBearingCompliant = seatBearing >= 1.5;
  const isHapCompliant = heightAbovePlateInches >= actualRafterDepth * 0.5;

  const ircCompliance: RafterIrcCompliance = {
    isNotchCompliant,
    maxAllowedPlumbCutInches,
    plumbCutDepthInches,
    isBearingCompliant,
    minBearingRequiredInches: 1.5,
    seatBearingInches: seatBearing,
    isHapCompliant,
    heightAbovePlateInches,
  };

  // 7. Cut Angles
  const plumbCutAngleDegrees = pitchAngleDegrees;
  const seatCutAngleDegrees = roundTo(90 - pitchAngleDegrees, 2);

  const cutAngles: RafterCutAngles = {
    plumbCutAngleDegrees,
    seatCutAngleDegrees,
    plumbCutPitchString: `${pitchIn12}/12`,
    seatCutPitchString: `${roundTo(144 / pitchIn12, 1)}/12`,
  };

  // 8. Theoretical Ridge Board Height above top plate
  const ridgeHeightAbovePlateFt = roundTo(
    riseFt + heightAbovePlateInches / 12,
    2
  );

  // 9. Stock Lumber Recommendation
  let recommendedStockLumberFt = 24;
  for (const len of STANDARD_STOCK_LUMBER_FEET) {
    if (len >= totalCutRafterLengthFt) {
      recommendedStockLumberFt = len;
      break;
    }
  }

  // 10. Geometry Result Object
  const geometry: RafterGeometryResult = {
    buildingSpanFt,
    runFt: roundTo(runFt, 2),
    runInches,
    riseFt: roundTo(riseFt, 2),
    riseInches,
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

  // 11. Optional Framing Materials Count
  let totalRafterPairs: number | undefined;
  let totalCommonRafters: number | undefined;
  if (roofLengthFt && roofLengthFt > 0) {
    const spacingFt = rafterSpacingInches / 12;
    totalRafterPairs = Math.ceil(roofLengthFt / spacingFt) + 1;
    totalCommonRafters = totalRafterPairs * 2;
  }

  // 12. Mathematical Steps
  const steps: CalculationStep[] = [
    {
      label: "Unit Run and Slope Factor",
      formula: "Slope Factor = sqrt(1 + (Pitch / 12)^2)",
      values: `sqrt(1 + (${pitchIn12} / 12)^2)`,
      result: `${slopeFactor.toFixed(4)} (Pitch Angle: ${pitchAngleDegrees}°)`,
    },
    {
      label: "Rafter Run & Theoretical Rise",
      formula: "Run = Span / 2; Rise = Run * (Pitch / 12)",
      values: `${buildingSpanFt}' / 2 = ${runFt}' (${runInches}"); ${runFt}' * (${pitchIn12} / 12)`,
      result: `Run: ${runFt}' | Rise: ${riseFt}' (${riseInches}")`,
    },
    {
      label: "Rafter Line Length (Ridge Center to Wall)",
      formula: "Line Length = Run (inches) * Slope Factor",
      values: `${runInches}" * ${slopeFactor.toFixed(4)}`,
      result: `${rafterLineLengthInches}" (${geometry.rafterLineLengthFormatted})`,
    },
    {
      label: "Ridge Board Deduction",
      formula: "Deduction = (Ridge Board Thickness / 2) * Slope Factor",
      values: `(${ridgeBoardThicknessInches}" / 2) * ${slopeFactor.toFixed(4)}`,
      result: `${ridgeDeductionInches}"`,
    },
    {
      label: "Eave Overhang Rafter Length",
      formula: "Overhang Rafter Length = Overhang Run * Slope Factor",
      values: `${overhangRunInches}" * ${slopeFactor.toFixed(4)}`,
      result: `${overhangRafterLengthInches}"`,
    },
    {
      label: "Total Cutting Length",
      formula: "Cut Length = Line Length - Ridge Deduction + Overhang Length",
      values: `${rafterLineLengthInches}" - ${ridgeDeductionInches}" + ${overhangRafterLengthInches}"`,
      result: `${totalCutInches}" (${geometry.totalCutRafterLengthFormatted} / ${totalCutRafterLengthFt}')`,
    },
    {
      label: "Birdsmouth Seat & Plumb Cut (IRC R802.7.1)",
      formula: "Plumb Cut = Seat Bearing * (Pitch / 12); HAP = Actual Depth - Plumb Cut",
      values: `${seatBearing}" * (${pitchIn12} / 12) = ${plumbCutDepthInches}"; ${actualRafterDepth}" - ${plumbCutDepthInches}"`,
      result: `Seat: ${seatBearing}" | Plumb Cut: ${plumbCutDepthInches}" | H.A.P.: ${heightAbovePlateInches}"`,
    },
  ];

  // 13. Contractor Warnings & Code Advice
  const warnings: CalculationWarning[] = [];

  if (!isNotchCompliant) {
    warnings.push({
      code: "BIRDSMOUTH_NOTCH_EXCEEDS_IRC_LIMIT",
      message: `The birdsmouth plumb cut (${plumbCutDepthInches}") exceeds 1/4 the rafter depth (${maxAllowedPlumbCutInches}" for ${rafterDepthNominal}) per IRC R802.7.1. Increase rafter lumber depth (e.g. 2x8) or reduce seat cut bearing to prevent structural split failure.`,
    });
  }

  if (totalCutRafterLengthFt > 24) {
    warnings.push({
      code: "RAFTER_LENGTH_EXCEEDS_STOCK_LUMBER",
      message: `Total rafter cut length (${totalCutRafterLengthFt}') exceeds standard solid-sawn 24-foot dimensional lumber. Engineered LVL rafters, pre-fabricated roof trusses, or mid-span purlins/bearing walls are required.`,
    });
  }

  if (!isBearingCompliant) {
    warnings.push({
      code: "INSUFFICIENT_BEARING_LENGTH",
      message: `Seat cut bearing (${seatBearing}") is less than the IRC minimum 1.5-inch requirement on wood framing.`,
    });
  }

  return {
    geometry,
    recommendedStockLumberFt,
    ircCompliance,
    totalRafterPairs,
    totalCommonRafters,
    steps,
    warnings,
  };
}
