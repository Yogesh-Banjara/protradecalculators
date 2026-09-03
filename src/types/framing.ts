import type { CalculationStep, CalculationWarning } from "./calculations";

export type StudSpacing = 12 | 16 | 19.2 | 24;

export type LumberNominalSize = "2x4" | "2x6" | "2x8" | "2x10" | "2x12";

export type OpeningType = "door" | "window";

export interface WallOpeningInput {
  readonly id: string;
  readonly name: string;
  readonly type: OpeningType;
  /** Width in feet */
  readonly widthFt: number;
  /** Height in feet */
  readonly heightFt: number;
  readonly count: number;
  readonly headerLumberSize?: LumberNominalSize;
}

export interface WallSectionInput {
  readonly id: string;
  readonly name: string;
  /** Wall length in feet */
  readonly lengthFt: number;
  /** Wall height in feet (e.g. 8, 9, 10, 12) */
  readonly heightFt: number;
  readonly studSpacingInches: StudSpacing;
  readonly lumberSize: LumberNominalSize;
  readonly hasDoubleTopPlate: boolean;
  /** Number of 90-degree outside corners (adds 2 studs per corner for 3-stud corner assembly) */
  readonly cornerCount: number;
  /** Number of intersecting T-walls (adds 2 studs for drywall backing) */
  readonly intersectionCount: number;
  readonly openings: readonly WallOpeningInput[];
}

export interface WallOpeningResult {
  readonly id: string;
  readonly name: string;
  readonly type: OpeningType;
  readonly count: number;
  readonly widthFt: number;
  readonly heightFt: number;
  readonly kingStuds: number;
  readonly jackStuds: number;
  readonly crippleStudsTop: number;
  readonly crippleStudsBottom: number;
  readonly sillPlatesLinearFt: number;
  readonly headerLinearFt: number;
  readonly headerPieceCount: number;
  readonly headerLumberSize: LumberNominalSize;
}

export interface WallSectionResult {
  readonly id: string;
  readonly name: string;
  readonly lengthFt: number;
  readonly heightFt: number;
  readonly studSpacingInches: StudSpacing;
  readonly lumberSize: LumberNominalSize;
  readonly commonStuds: number;
  readonly cornerStuds: number;
  readonly intersectionStuds: number;
  readonly kingStuds: number;
  readonly jackStuds: number;
  readonly crippleStuds: number;
  readonly totalStuds: number;
  readonly topPlatesCount: number;
  readonly bottomPlatesCount: number;
  readonly totalPlateBoards: number;
  readonly plateLinearFt: number;
  readonly headerLinearFt: number;
  readonly headerPieces: number;
  readonly sillLinearFt: number;
  readonly totalLinearFt: number;
  readonly boardFeet: number;
  readonly openings: readonly WallOpeningResult[];
  readonly steps: readonly CalculationStep[];
}

export interface FramingCostRates {
  readonly pricePerStud?: number;
  readonly pricePerPlateBoard?: number;
  readonly pricePerHeaderPiece?: number;
}

export interface FramingCostEstimate {
  readonly studsCost: number;
  readonly platesCost: number;
  readonly headersCost: number;
  readonly totalEstimatedCost: number;
}

export interface FramingProjectInput {
  readonly walls: readonly WallSectionInput[];
  readonly wastePercent: number;
  /** Preferred stock length for top/bottom plates (default 16 ft) */
  readonly stockPlateLengthFt?: number;
  readonly costRates?: FramingCostRates;
}

export interface FramingProjectResult {
  readonly wastePercent: number;
  readonly totalCommonStuds: number;
  readonly totalCornerAndIntersectionStuds: number;
  readonly totalOpeningStuds: number;
  readonly netStuds: number;
  readonly wasteStuds: number;
  readonly totalStudsWithWaste: number;
  readonly totalPlateBoards: number;
  readonly plateLinearFt: number;
  readonly headerPieces: number;
  readonly headerLinearFt: number;
  readonly totalLinearFt: number;
  readonly totalBoardFeet: number;
  readonly stockPlateLengthFt: number;
  readonly costEstimate?: FramingCostEstimate;
  readonly walls: readonly WallSectionResult[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
