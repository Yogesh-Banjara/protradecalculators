import type { CalculationStep, CalculationWarning } from "./calculations";

export type RoofType = "gable" | "hip" | "shed";

export type RafterNominalDepth = "2x4" | "2x6" | "2x8" | "2x10" | "2x12";

export interface RafterCutAngles {
  readonly plumbCutAngleDegrees: number;
  readonly seatCutAngleDegrees: number;
  readonly plumbCutPitchString: string;
  readonly seatCutPitchString: string;
}

export interface BirdsmouthGeometry {
  /** Width of horizontal seat bearing on top plate in inches (e.g. 3.5" for 2x4 wall) */
  readonly seatCutLengthInches: number;
  /** Vertical plumb cut depth in inches */
  readonly plumbCutDepthInches: number;
  /** Height Above Plate (HAP) / Stand in inches */
  readonly heightAbovePlateInches: number;
}

export interface RafterGeometryResult {
  readonly buildingSpanFt: number;
  readonly runFt: number;
  readonly runInches: number;
  readonly riseFt: number;
  readonly riseInches: number;
  readonly pitchIn12: number;
  readonly pitchAngleDegrees: number;
  readonly gradePercent: number;
  readonly slopeFactor: number;
  /** Theoretical rafter line length from ridge center to wall plate outer edge */
  readonly rafterLineLengthFt: number;
  readonly rafterLineLengthInches: number;
  /** Formatted string e.g. "12 ft 4-3/8 in" */
  readonly rafterLineLengthFormatted: string;
  readonly overhangRunInches: number;
  readonly overhangRafterLengthInches: number;
  readonly ridgeDeductionInches: number;
  /** Practical cutting length = Line Length - Ridge Deduction + Overhang */
  readonly totalCutRafterLengthFt: number;
  readonly totalCutRafterLengthFormatted: string;
  /** Theoretical ridge board top height above wall plate */
  readonly ridgeHeightAbovePlateFt: number;
  readonly birdsmouth: BirdsmouthGeometry;
  readonly cutAngles: RafterCutAngles;
}

export interface RoofMaterialsTakeoff {
  readonly flatFootprintAreaSqFt: number;
  readonly roofSurfaceAreaSqFt: number;
  readonly roofingSquares: number;
  readonly wastePercent: number;
  readonly wasteAreaSqFt: number;
  readonly adjustedAreaSqFt: number;
  readonly adjustedSquares: number;
  /** Shingle bundles required (3 bundles per square) */
  readonly shingleBundlesCount: number;
  /** Synthetic underlayment rolls (approx 400 sq ft / 4 squares per roll) */
  readonly underlaymentRollsSynthetic: number;
  /** Traditional felt underlayment rolls (approx 200 sq ft / 2 squares per roll) */
  readonly underlaymentRollsFelt: number;
  readonly eavesLengthFt: number;
  readonly rakesLengthFt: number;
  readonly dripEdgeLinearFt: number;
  readonly dripEdgePieces10Ft: number;
  readonly ridgeLengthFt: number;
  /** Ridge cap shingles required (approx 33 linear ft per bundle) */
  readonly ridgeCapBundlesCount: number;
}

export interface RoofCostRates {
  readonly pricePerSquare?: number;
  readonly pricePerShingleBundle?: number;
  readonly pricePerUnderlaymentRoll?: number;
  readonly pricePerDripEdgePiece?: number;
  readonly pricePerRidgeCapBundle?: number;
}

export interface RoofCostEstimate {
  readonly shinglesCost: number;
  readonly underlaymentCost: number;
  readonly dripEdgeCost: number;
  readonly ridgeCapCost: number;
  readonly totalEstimatedCost: number;
}

export interface RoofCalculatorInput {
  /** Building total length (ridge parallel dimension) in feet */
  readonly buildingLengthFt: number;
  /** Building total span (outer wall to outer wall) in feet */
  readonly buildingWidthFt: number;
  /** Pitch rise in 12 inches (e.g. 4, 6, 8, 12) */
  readonly pitchIn12: number;
  /** Horizontal eave overhang in inches (default 12") */
  readonly eaveOverhangInches?: number;
  /** Gable rake overhang in inches (default 12") */
  readonly gableOverhangInches?: number;
  /** Thickness of ridge beam/board in inches (default 1.5" for 2x stock) */
  readonly ridgeBoardThicknessInches?: number;
  /** Rafter lumber nominal depth (default "2x6", actual 5.5") */
  readonly rafterDepthNominal?: RafterNominalDepth;
  /** Width of top plate bearing in inches (default 3.5" for 2x4 wall) */
  readonly seatCutBearingInches?: number;
  readonly wastePercent?: number;
  readonly costRates?: RoofCostRates;
}

export interface RoofCalculatorResult {
  readonly roofType: RoofType;
  readonly geometry: RafterGeometryResult;
  readonly materials: RoofMaterialsTakeoff;
  readonly costEstimate?: RoofCostEstimate;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
