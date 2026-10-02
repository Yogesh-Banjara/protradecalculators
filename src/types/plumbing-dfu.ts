import type { CalculationStep, CalculationWarning } from "./calculations";

export type PlumbingCodeStandard = "IPC" | "UPC";

export type DrainageSystemType =
  | "horizontal_branch" // Horizontal branch drain
  | "vertical_stack" // Vertical soil or waste stack
  | "building_drain" // Building drain (inside foundation)
  | "building_sewer"; // Building sewer (outside foundation to main)

export type PipeSlope =
  | "1_16" // 1/16 in. per foot (0.5%) - large mains only (>= 8")
  | "1_8" // 1/8 in. per foot (1.0%) - standard for >= 3"
  | "1_4" // 1/4 in. per foot (2.0%) - standard for <= 2.5"
  | "1_2"; // 1/2 in. per foot (4.0%) - steep slope

export type StandardDrainPipeSizeInches =
  | "1-1/4"
  | "1-1/2"
  | "2"
  | "2-1/2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8";

export interface FixtureScheduleItem {
  readonly id: string;
  readonly fixtureId: string;
  readonly name: string;
  readonly quantity: number;
  readonly dfuEach: number;
  readonly minTrapSizeInches: StandardDrainPipeSizeInches;
  readonly isWaterCloset?: boolean;
}

export interface VentStackSizingInput {
  readonly soilStackSizeInches: StandardDrainPipeSizeInches;
  readonly totalDfu: number;
  readonly developedLengthFt: number;
}

export interface VentStackSizingResult {
  readonly soilStackSizeInches: StandardDrainPipeSizeInches;
  readonly totalDfu: number;
  readonly developedLengthFt: number;
  readonly minAllowedVentSizeByHalfRule: StandardDrainPipeSizeInches;
  readonly recommendedVentSizeInches: StandardDrainPipeSizeInches;
  readonly maxAllowedDevelopedLengthFt: number;
  readonly governingTable: string;
  readonly notes: string;
}

export interface PlumbingDfuInput {
  readonly codeStandard: PlumbingCodeStandard;
  readonly systemType: DrainageSystemType;
  readonly pipeSlope?: PipeSlope; // Default: 1/4" for <=2.5", 1/8" or 1/4" for >=3"
  readonly stackBranchIntervalsCount?: number; // For vertical stacks (Default: 1 to 3 stories)
  readonly fixtures: readonly FixtureScheduleItem[];
  readonly continuousPumpGpm?: number; // Continuous flow pumps (1 GPM = 2 DFU)
  readonly includeVentStackSizing?: boolean;
  readonly ventDevelopedLengthFt?: number;
}

export interface FixtureCalculationSubtotal {
  readonly fixtureId: string;
  readonly name: string;
  readonly quantity: number;
  readonly dfuEach: number;
  readonly subtotalDfu: number;
  readonly minTrapSizeInches: StandardDrainPipeSizeInches;
  readonly isWaterCloset: boolean;
}

export interface PlumbingDfuResult {
  readonly codeStandard: PlumbingCodeStandard;
  readonly systemType: DrainageSystemType;
  readonly pipeSlope: PipeSlope;
  readonly totalFixtureCount: number;
  readonly totalCalculatedDfu: number;
  readonly continuousPumpDfu: number;
  readonly recommendedPipeSizeInches: StandardDrainPipeSizeInches;
  readonly minPermittedPipeSizeInches: StandardDrainPipeSizeInches;
  readonly maxCapacityDfuForSelectedSize: number;
  readonly capacityUtilizationPct: number;
  readonly governingCodeRule: string;
  readonly containsWaterCloset: boolean;
  readonly waterClosetCount: number;
  readonly fixtureBreakdown: readonly FixtureCalculationSubtotal[];
  readonly ventStackSizing?: VentStackSizingResult;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}

