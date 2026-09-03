import type { AnyUnit, LengthUnit, CurrencyCode } from "./units";

export type RoundingPolicy = "exact" | "standard" | "trade-up" | "trade-down";

export interface Measurement<U extends AnyUnit = AnyUnit> {
  readonly value: number;
  readonly unit: U;
}

export interface CalculationWarning {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

export interface CalculationStep {
  readonly label: string;
  readonly formula: string;
  readonly values: string;
  readonly result: string;
}

export interface CalculationResult<T = number> {
  readonly value: T;
  readonly unit?: AnyUnit;
  readonly steps?: readonly CalculationStep[];
  readonly warnings?: readonly CalculationWarning[];
  readonly rawValue?: number;
}

export interface Dimensions2D {
  readonly length: Measurement<LengthUnit>;
  readonly width: Measurement<LengthUnit>;
}

export interface Dimensions3D extends Dimensions2D {
  readonly depthOrHeight: Measurement<LengthUnit>;
}

export interface PitchRatio {
  readonly rise: number;
  readonly run: number; // e.g. 12 for standard x:12 roof pitch
}

export interface SlopeResult {
  readonly degrees: number;
  readonly radians: number;
  readonly percentGrade: number;
  readonly pitchRatio: PitchRatio;
  readonly pitchNotation: string; // e.g. "4:12"
}

export interface MaterialDensity {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  /** Density in kilograms per cubic meter (SI Base) */
  readonly densityKgPerM3: number;
  /** Typical pounds per cubic foot */
  readonly densityLbsPerFt3: number;
  /** Typical short tons per cubic yard */
  readonly tonsPerYd3: number;
  readonly description?: string;
}

export interface CostItem {
  readonly label: string;
  readonly quantity: number;
  readonly unit: AnyUnit | string;
  readonly unitCost: number;
  readonly totalCost: number;
}

export interface CostEstimationResult {
  readonly materialCost: number;
  readonly laborCost: number;
  readonly wasteCost: number;
  readonly subtotal: number;
  readonly taxAmount: number;
  readonly totalCost: number;
  readonly currency: CurrencyCode;
  readonly items: readonly CostItem[];
}
