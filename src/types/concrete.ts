import type { LengthUnit } from "./units";
import type { CalculationStep, CalculationWarning } from "./calculations";

export type ConcreteShape =
  | "rectangular-slab"
  | "continuous-footing"
  | "round-column"
  | "circular-slab"
  | "circular-footing";

export interface ConcreteSectionInput {
  readonly id: string;
  readonly name: string;
  readonly shape: ConcreteShape;
  readonly quantity: number;
  readonly length?: number;
  readonly width?: number;
  readonly depth?: number; // Also used as thickness or height
  readonly diameter?: number;
  readonly lengthUnit: LengthUnit;
  readonly depthUnit: LengthUnit;
  readonly diameterUnit?: LengthUnit;
}

export interface ConcreteSectionResult {
  readonly id: string;
  readonly name: string;
  readonly shape: ConcreteShape;
  readonly quantity: number;
  readonly volumeCuFt: number;
  readonly volumeCuYd: number;
  readonly volumeCuMeters: number;
  readonly steps: readonly CalculationStep[];
}

export interface ConcreteBagEstimate {
  readonly bagWeightLbs: number;
  readonly bagYieldCuFt: number;
  readonly bagsRequired: number;
  readonly exactBags: number;
  readonly surplusCuFt: number;
}

export interface ConcreteProjectInput {
  readonly sections: readonly ConcreteSectionInput[];
  readonly wastePercent: number;
  readonly customBagYieldCuFt?: number;
}

export interface ConcreteProjectResult {
  readonly netVolumeCuFt: number;
  readonly netVolumeCuYd: number;
  readonly netVolumeCuMeters: number;
  readonly wastePercent: number;
  readonly wasteVolumeCuFt: number;
  readonly wasteVolumeCuYd: number;
  readonly totalVolumeCuFt: number;
  readonly totalVolumeCuYd: number;
  readonly totalVolumeCuMeters: number;
  /** Ready-mix truck order recommendation rounded up to nearest 0.25 cubic yards */
  readonly recommendedOrderYards: number;
  readonly sections: readonly ConcreteSectionResult[];
  readonly bagEstimates: readonly ConcreteBagEstimate[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
