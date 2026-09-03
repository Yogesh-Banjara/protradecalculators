import type { CalculationStep, CalculationWarning } from "./calculations";
import type { WireGaugeSize } from "./electrical";

export type ConduitType =
  | "emt"
  | "pvc_sch40"
  | "pvc_sch80"
  | "rmc"
  | "fmc"
  | "lfmc";

export type ConduitTradeSize =
  | "1/2"
  | "3/4"
  | "1"
  | "1-1/4"
  | "1-1/2"
  | "2"
  | "2-1/2"
  | "3"
  | "3-1/2"
  | "4";

export type ConductorInsulation =
  | "thhn"
  | "xhhw"
  | "use_rhw"
  | "bare_copper";

export interface ConductorInputRow {
  readonly id: string;
  readonly size: WireGaugeSize;
  readonly insulation: ConductorInsulation;
  readonly count: number;
}

export interface ConduitTypeInfo {
  readonly type: ConduitType;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
}

export interface ConduitTradeSizeData {
  readonly tradeSize: ConduitTradeSize;
  readonly internalDiameterInches: number;
  readonly totalInternalAreaSqIn: number;
  readonly area1Wire53Pct: number;
  readonly area2Wire31Pct: number;
  readonly areaOver2Wire40Pct: number;
  readonly areaNipple60Pct: number;
}

export interface ConductorDimensionData {
  readonly size: WireGaugeSize;
  readonly insulation: ConductorInsulation;
  readonly approxDiameterInches: number;
  readonly crossSectionalAreaSqIn: number;
}

export interface ConduitCandidateEvaluation {
  readonly tradeSize: ConduitTradeSize;
  readonly internalDiameterInches: number;
  readonly totalInternalAreaSqIn: number;
  readonly allowableAreaSqIn: number;
  readonly actualConductorAreaSqIn: number;
  readonly fillPercentage: number;
  readonly remainingAreaSqIn: number;
  readonly status: "recommended" | "pass" | "warning" | "fail";
  readonly jamRatio?: number;
  readonly hasJamRatioRisk: boolean;
}

export interface ConduitFillInput {
  readonly conduitType?: ConduitType;
  readonly isNippleOrShortRun?: boolean;
  readonly conductors: readonly ConductorInputRow[];
}

export interface ConduitFillResult {
  readonly conduitType: ConduitType;
  readonly isNipple: boolean;
  readonly totalConductorCount: number;
  readonly totalConductorAreaSqIn: number;
  readonly allowableFillPercentage: number;
  readonly recommendedTradeSize: ConduitTradeSize;
  readonly recommendedConduitAreaSqIn: number;
  readonly allowableConduitAreaSqIn: number;
  readonly actualFillPercentage: number;
  readonly remainingAreaSqIn: number;
  readonly isCompliant: boolean;
  readonly hasJamRatioRisk: boolean;
  readonly jamRatio?: number;
  readonly candidates: readonly ConduitCandidateEvaluation[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
