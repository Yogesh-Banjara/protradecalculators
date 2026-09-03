import type { CalculationStep, CalculationWarning } from "./calculations";
import type { WireGaugeSize } from "./electrical";

export type BoxMaterial = "metal" | "plastic_nonmetallic";

export type BoxMountType =
  | "square_4"
  | "square_4_11_16"
  | "octagonal_4"
  | "round_ceiling"
  | "handy_utility"
  | "single_gang_device"
  | "two_gang_device"
  | "three_gang_device"
  | "four_gang_device"
  | "custom";

export interface ConductorFillRow {
  readonly id: string;
  readonly size: WireGaugeSize;
  readonly count: number;
  readonly isPigtail?: boolean; // Pigtails originate and remain in box -> 0 allowance
}

export interface DeviceYokeEntry {
  readonly id: string;
  readonly name: string;
  readonly largestConnectedSize: WireGaugeSize;
  readonly gangCount: number; // 1 for single-gang (2 volume allowances), 2 for double-gang (4 allowances)
}

export interface StandardBoxData {
  readonly id: string;
  readonly name: string;
  readonly tradeDimensions: string;
  readonly material: BoxMaterial;
  readonly mountType: BoxMountType;
  readonly standardVolumeCuIn: number;
  readonly description: string;
}

export interface MudRingData {
  readonly id: string;
  readonly name: string;
  readonly depthInches: string;
  readonly additionalVolumeCuIn: number;
}

export interface BoxCandidateEvaluation {
  readonly box: StandardBoxData;
  readonly baseVolumeCuIn: number;
  readonly mudRingVolumeCuIn: number;
  readonly totalAvailableVolumeCuIn: number;
  readonly requiredVolumeCuIn: number;
  readonly remainingVolumeCuIn: number;
  readonly fillPercentage: number;
  readonly status: "recommended" | "pass" | "fail";
}

export interface BoxFillInput {
  readonly conductors: readonly ConductorFillRow[];
  readonly internalClampsCount: number; // 0 or more internal cable clamps
  readonly supportFittingsCount: number; // 0 or more fixture studs/hickeys
  readonly devices: readonly DeviceYokeEntry[];
  readonly equipmentGroundsCount: number; // Total equipment grounding conductors entering box
  readonly largestGroundSize?: WireGaugeSize;
  readonly isolatedGroundsCount?: number;
  readonly selectedBoxId?: string;
  readonly customBoxVolumeCuIn?: number;
  readonly selectedMudRingId?: string;
  readonly customMudRingVolumeCuIn?: number;
}

export interface BoxFillDetailedBreakdown {
  readonly conductorVolumeCuIn: number;
  readonly conductorBreakdown: Array<{
    size: WireGaugeSize;
    count: number;
    allowancePerWireCuIn: number;
    subtotalCuIn: number;
  }>;
  readonly clampAllowanceCount: number;
  readonly clampAllowanceSize: WireGaugeSize;
  readonly clampVolumeCuIn: number;
  readonly fittingAllowanceCount: number;
  readonly fittingAllowanceSize: WireGaugeSize;
  readonly fittingVolumeCuIn: number;
  readonly deviceYokeAllowanceCount: number;
  readonly deviceBreakdown: Array<{
    name: string;
    gangCount: number;
    allowanceMultiplier: number;
    largestSize: WireGaugeSize;
    subtotalCuIn: number;
  }>;
  readonly deviceVolumeCuIn: number;
  readonly groundAllowanceCount: number;
  readonly groundAllowanceSize: WireGaugeSize;
  readonly groundVolumeCuIn: number;
  readonly isolatedGroundVolumeCuIn: number;
}

export interface BoxFillResult {
  readonly totalRequiredVolumeCuIn: number;
  readonly totalConductorCount: number;
  readonly breakdown: BoxFillDetailedBreakdown;
  readonly selectedBox?: StandardBoxData;
  readonly selectedMudRing?: MudRingData;
  readonly baseBoxVolumeCuIn: number;
  readonly mudRingVolumeCuIn: number;
  readonly totalAvailableVolumeCuIn: number;
  readonly remainingVolumeCuIn: number;
  readonly fillPercentage: number;
  readonly isCompliant: boolean;
  readonly recommendedBox: StandardBoxData;
  readonly recommendedTotalAvailableVolumeCuIn: number;
  readonly candidates: readonly BoxCandidateEvaluation[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
