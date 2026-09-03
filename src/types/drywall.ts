import type { CalculationStep, CalculationWarning } from "./calculations";

export type DrywallSheetSize = "4x8" | "4x10" | "4x12";

export type DrywallThickness = "1/2" | "5/8";

export type DrywallOpeningType = "door" | "window" | "custom";

export interface DrywallOpeningInput {
  readonly id: string;
  readonly name: string;
  readonly type: DrywallOpeningType;
  /** Opening width in feet */
  readonly widthFt: number;
  /** Opening height in feet */
  readonly heightFt: number;
  readonly count: number;
}

export interface DrywallOpeningResult {
  readonly id: string;
  readonly name: string;
  readonly type: DrywallOpeningType;
  readonly widthFt: number;
  readonly heightFt: number;
  readonly count: number;
  readonly totalAreaSqFt: number;
}

export interface DrywallRoomInput {
  readonly id: string;
  readonly name: string;
  /** Room length in feet */
  readonly lengthFt: number;
  /** Room width in feet */
  readonly widthFt: number;
  /** Wall ceiling height in feet (e.g. 8, 9, 10, 12) */
  readonly heightFt: number;
  readonly includeWalls: boolean;
  readonly includeCeiling: boolean;
  readonly openings: readonly DrywallOpeningInput[];
}

export interface DrywallRoomResult {
  readonly id: string;
  readonly name: string;
  readonly lengthFt: number;
  readonly widthFt: number;
  readonly heightFt: number;
  readonly includeWalls: boolean;
  readonly includeCeiling: boolean;
  readonly grossWallAreaSqFt: number;
  readonly ceilingAreaSqFt: number;
  readonly openingsAreaSqFt: number;
  readonly netAreaSqFt: number;
  readonly openings: readonly DrywallOpeningResult[];
  readonly steps: readonly CalculationStep[];
}

export interface DrywallAccessoryEstimate {
  /** Joint tape required in linear feet */
  readonly jointTapeLinearFt: number;
  /** Number of standard 500-ft paper tape rolls */
  readonly tapeRolls500Ft: number;
  /** Number of 250-ft paper tape rolls */
  readonly tapeRolls250Ft: number;
  /** Ready-mixed joint compound required in gallons */
  readonly jointCompoundGallons: number;
  /** Number of standard 4.5-gallon buckets */
  readonly compoundBuckets4_5Gal: number;
  /** Total drywall screws count */
  readonly drywallScrewsCount: number;
  /** Fastener weight in pounds (approx 300 screws/lb for 1-1/4" #6 coarse) */
  readonly screwPounds: number;
  /** Number of standard 5 lb boxes (approx 1,500 screws per box) */
  readonly screwBoxes5Lb: number;
}

export interface DrywallCostRates {
  readonly pricePerSheet?: number;
  readonly pricePerTapeRoll?: number;
  readonly pricePerCompoundBucket?: number;
  readonly pricePerScrewBox?: number;
}

export interface DrywallCostEstimate {
  readonly sheetsCost: number;
  readonly tapeCost: number;
  readonly compoundCost: number;
  readonly screwsCost: number;
  readonly totalEstimatedCost: number;
}

export interface DrywallProjectInput {
  readonly rooms: readonly DrywallRoomInput[];
  readonly sheetSize: DrywallSheetSize;
  readonly thickness: DrywallThickness;
  readonly wastePercent: number;
  readonly costRates?: DrywallCostRates;
}

export interface DrywallProjectResult {
  readonly sheetSize: DrywallSheetSize;
  readonly thickness: DrywallThickness;
  readonly sheetAreaSqFt: number;
  readonly grossAreaSqFt: number;
  readonly openingsAreaSqFt: number;
  readonly netAreaSqFt: number;
  readonly wastePercent: number;
  readonly wasteAreaSqFt: number;
  readonly adjustedAreaSqFt: number;
  /** Exact decimal sheet count before whole-sheet rounding */
  readonly exactSheets: number;
  /** Final purchase sheet count (rounded up to nearest whole sheet) */
  readonly sheetsRequired: number;
  readonly accessories: DrywallAccessoryEstimate;
  readonly costEstimate?: DrywallCostEstimate;
  readonly rooms: readonly DrywallRoomResult[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
