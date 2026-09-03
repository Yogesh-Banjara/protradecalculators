import type { CalculationStep, CalculationWarning } from "./calculations";

export type DeckBoardType =
  | "5/4x6_composite"
  | "5/4x6_wood"
  | "2x6_wood"
  | "2x4_wood";

export type DeckBoardStockLength = 12 | 16 | 20;

export type DeckBoardOrientation = "perpendicular" | "diagonal";

export type DeckPictureFrame = "none" | "single" | "double";

export type DeckJoistSpacing = 12 | 16 | 24;

export type DeckJoistLumber = "2x6" | "2x8" | "2x10" | "2x12";

export type DeckBeamType = "drop" | "flush";

export type DeckBeamLumber =
  | "2-ply 2x8"
  | "2-ply 2x10"
  | "2-ply 2x12"
  | "3-ply 2x10"
  | "3-ply 2x12";

export interface DeckBoardInfo {
  readonly type: DeckBoardType;
  readonly name: string;
  readonly nominalWidthInches: number;
  readonly actualWidthInches: number;
  readonly actualThicknessInches: number;
  readonly maxWoodJoistSpacingInches: number;
  readonly maxCompositeJoistSpacingInches: number;
  readonly isComposite: boolean;
}

export interface DeckingTakeoffResult {
  readonly deckSurfaceAreaSqFt: number;
  readonly wastePercent: number;
  readonly wasteAreaSqFt: number;
  readonly adjustedAreaSqFt: number;
  readonly boardActualWidthInches: number;
  readonly boardGapInches: number;
  readonly effectiveCoverageWidthInches: number;
  readonly totalBoardRows: number;
  readonly totalLinearFeet: number;
  readonly pictureFrameLinearFeet: number;
  readonly pictureFrameBoardCount: number;
  readonly fieldBoardCount: number;
  readonly totalStockBoardsRequired: number;
  readonly stockLengthFt: DeckBoardStockLength;
}

export interface DeckFramingTakeoffResult {
  readonly ledgerLengthFt: number;
  readonly ledgerBoardPieces: number;
  readonly rimJoistPieces: number;
  readonly fieldJoistsCount: number;
  readonly joistSpacingInches: DeckJoistSpacing;
  readonly joistStockLengthFt: number;
  readonly joistLumber: DeckJoistLumber;
  readonly maxAllowableJoistSpanFt: number;
  readonly beamLengthFt: number;
  readonly beamBoardPieces: number;
  readonly beamLumber: DeckBeamLumber;
  readonly beamType: DeckBeamType;
  readonly supportPostsCount: number;
  readonly postLumberStock: "4x4" | "6x6";
}

export interface DeckConcreteTakeoffResult {
  readonly pierFootingCount: number;
  readonly pierDiameterInches: number;
  readonly pierDepthInches: number;
  readonly volumePerPierCuFt: number;
  readonly totalConcreteVolumeCuFt: number;
  readonly totalConcreteVolumeCuYd: number;
  readonly concreteBags60Lb: number;
  readonly concreteBags80Lb: number;
}

export interface DeckHardwareTakeoffResult {
  readonly joistHangersCount: number;
  readonly ledgerLagScrewsCount: number;
  readonly postToBeamBracketsCount: number;
  readonly postBaseAnchorsCount: number;
  readonly hiddenFastenerBoxes: number;
  readonly faceScrewPounds: number;
  readonly ledgerFlashingTapeRolls: number;
}

export interface DeckCostRates {
  readonly pricePerDeckBoard?: number;
  readonly pricePerJoistBoard?: number;
  readonly pricePerBeamBoard?: number;
  readonly pricePerPostBoard?: number;
  readonly pricePerConcreteBag?: number;
  readonly pricePerHardwarePack?: number;
}

export interface DeckCostEstimate {
  readonly deckingCost: number;
  readonly framingCost: number;
  readonly concreteCost: number;
  readonly hardwareCost: number;
  readonly totalEstimatedCost: number;
}

export interface DeckCalculatorInput {
  /** Deck length along the house / ledger line in feet */
  readonly lengthFt: number;
  /** Deck width / projection out from the house in feet */
  readonly widthFt: number;
  /** Decking surface board material */
  readonly boardType?: DeckBoardType;
  /** Selected stock board length (12', 16', 20') */
  readonly boardStockLengthFt?: DeckBoardStockLength;
  /** Deck board layout angle */
  readonly boardOrientation?: DeckBoardOrientation;
  /** Gap between decking boards in inches (default 0.1875" / 3/16") */
  readonly boardGapInches?: number;
  /** Perimeter picture frame border style */
  readonly pictureFrame?: DeckPictureFrame;
  /** Joist on-center spacing in inches (default 16" for wood, 12" for composite) */
  readonly joistSpacingInches?: DeckJoistSpacing;
  /** Joist lumber dimension */
  readonly joistLumber?: DeckJoistLumber;
  /** Beam construction style */
  readonly beamType?: DeckBeamType;
  /** Beam lumber dimension */
  readonly beamLumber?: DeckBeamLumber;
  /** Cantilever overhang length in feet (if drop beam) */
  readonly cantileverOverhangFt?: number;
  /** Number of support posts / piers (default calculated from span) */
  readonly postCount?: number;
  /** Sonotube pier footing diameter in inches (default 12") */
  readonly pierDiameterInches?: number;
  /** Pier footing depth below frost line in inches (default 36") */
  readonly pierDepthInches?: number;
  readonly wastePercent?: number;
  readonly costRates?: DeckCostRates;
}

export interface DeckCalculatorResult {
  readonly lengthFt: number;
  readonly widthFt: number;
  readonly decking: DeckingTakeoffResult;
  readonly framing: DeckFramingTakeoffResult;
  readonly concrete: DeckConcreteTakeoffResult;
  readonly hardware: DeckHardwareTakeoffResult;
  readonly costEstimate?: DeckCostEstimate;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
