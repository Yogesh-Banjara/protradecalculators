import type { LengthUnit } from "./units";
import type { CalculationStep, CalculationWarning } from "./calculations";

export type AggregateMaterialId =
  | "gravel"
  | "crushed-stone"
  | "stone-57"
  | "crusher-run"
  | "limestone"
  | "pea-gravel"
  | "river-rock"
  | "sand"
  | "topsoil"
  | "custom";

export type AdjustmentMode = "compaction" | "waste" | "combined" | "none";

export type AggregateSectionShape = "rectangular" | "circular";

export interface AggregateDensityInfo {
  readonly id: AggregateMaterialId;
  readonly name: string;
  /** Density in pounds per cubic foot (lbs/cu ft) */
  readonly densityLbsPerCuFt: number;
  /** Approximate short tons per cubic yard (tons/cu yd) */
  readonly tonsPerCuYd: number;
  /** Density in kilograms per cubic meter (kg/m³) */
  readonly densityKgPerM3: number;
  readonly sourceNote: string;
  readonly defaultAdjustmentPercent: number;
  readonly defaultAdjustmentMode: AdjustmentMode;
}

export interface AggregateSectionInput {
  readonly id: string;
  readonly name: string;
  readonly shape: AggregateSectionShape;
  readonly quantity: number;
  readonly length?: number;
  readonly width?: number;
  readonly depth?: number; // Thickness / depth
  readonly diameter?: number;
  readonly lengthUnit: LengthUnit;
  readonly depthUnit: LengthUnit;
  readonly diameterUnit?: LengthUnit;
}

export interface AggregateSectionResult {
  readonly id: string;
  readonly name: string;
  readonly shape: AggregateSectionShape;
  readonly quantity: number;
  readonly volumeCuFt: number;
  readonly volumeCuYd: number;
  readonly volumeCuMeters: number;
  readonly steps: readonly CalculationStep[];
}

export interface TruckloadEstimate {
  readonly truckCapacityTons: number;
  readonly truckType: string;
  readonly loadsRequired: number;
  readonly exactLoads: number;
  readonly leftoverTons: number;
}

export interface AggregateBagEstimate {
  readonly bagWeightLbs: number;
  readonly bagsRequired: number;
  readonly exactBags: number;
  readonly surplusLbs: number;
}

export interface AggregateProjectInput {
  readonly sections: readonly AggregateSectionInput[];
  readonly materialId: AggregateMaterialId;
  readonly customDensityLbsPerCuFt?: number;
  readonly adjustmentMode: AdjustmentMode;
  readonly adjustmentPercent: number;
  readonly truckCapacityTons?: number;
}

export interface AggregateProjectResult {
  readonly netVolumeCuFt: number;
  readonly netVolumeCuYd: number;
  readonly netVolumeCuMeters: number;
  readonly adjustmentMode: AdjustmentMode;
  readonly adjustmentPercent: number;
  readonly adjustedVolumeCuFt: number;
  readonly adjustedVolumeCuYd: number;
  readonly adjustedVolumeCuMeters: number;
  readonly effectiveDensityLbsPerCuFt: number;
  readonly effectiveTonsPerCuYd: number;
  readonly totalWeightLbs: number;
  readonly totalTons: number;
  readonly truckloadEstimate: TruckloadEstimate;
  readonly bagEstimates: readonly AggregateBagEstimate[];
  readonly sections: readonly AggregateSectionResult[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
