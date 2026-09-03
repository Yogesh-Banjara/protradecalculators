import type { CalculationStep, CalculationWarning } from "./calculations";

export type DuctMaterial =
  | "sheet_metal" // Galvanized steel (smooth: roughness e = 0.0003 ft)
  | "flexible_duct" // Wire-helix flexible duct (roughness e = 0.003 ft, +15% diameter/friction penalty)
  | "duct_board"; // Fibrous glass board (roughness e = 0.00075 ft)

export type DuctShape = "round" | "rectangular";

export type SizingMethod =
  | "equal_friction" // Standard design method: sizing for constant friction drop per 100 ft
  | "velocity_reduction"; // Velocity limit method: sizing for target max air velocity (FPM)

export type AirflowInputMode =
  | "direct_cfm" // User provides total CFM directly
  | "tonnage" // Derived from cooling tons (e.g. 3.0 tons * 400 CFM/ton)
  | "room_schedule"; // Summed from individual room CFM branch entries

export type VelocityStatus =
  | "quiet" // < 500 FPM (Ideal for quiet bedrooms and sound-sensitive spaces)
  | "optimal" // 500 - 900 FPM (Standard residential supply/return design range)
  | "high_velocity" // 900 - 1,200 FPM (Acceptable in commercial trunks, noticeable residential air rush noise)
  | "excessive_noise"; // > 1,200 FPM (Severe acoustic noise & excessive fan static pressure)

export interface RoomAirflowEntry {
  readonly id: string;
  readonly roomName: string;
  readonly targetCfm: number;
  readonly ductShape?: DuctShape;
  readonly fixedHeightInches?: number;
}

export interface SingleDuctEvaluation {
  readonly cfm: number;
  readonly theoreticalDiameterInches: number;
  readonly recommendedStandardDiameterInches: number;
  readonly roundDuctAreaSqIn: number;
  readonly roundDuctAreaSqFt: number;
  readonly actualRoundVelocityFpm: number;
  readonly roundFrictionLossInWgPer100Ft: number;
  readonly rectangularWidthInches: number;
  readonly rectangularHeightInches: number;
  readonly rectangularAreaSqIn: number;
  readonly rectangularAreaSqFt: number;
  readonly actualRectangularVelocityFpm: number;
  readonly rectangularAspectRatio: number;
  readonly equivalentDiameterInches: number;
  readonly velocityStatus: VelocityStatus;
}

export interface BranchRunEvaluation extends SingleDuctEvaluation {
  readonly id: string;
  readonly roomName: string;
}

export interface DuctSizingInput {
  readonly inputMode: AirflowInputMode;
  readonly targetCfm?: number;
  readonly coolingTons?: number;
  readonly cfmPerTon?: number; // Default: 400 CFM/ton
  readonly rooms?: readonly RoomAirflowEntry[];
  readonly ductMaterial?: DuctMaterial; // Default: sheet_metal
  readonly sizingMethod?: SizingMethod; // Default: equal_friction
  readonly frictionRateInWgPer100Ft?: number; // Default: 0.08 in. w.g.
  readonly targetVelocityFpm?: number; // Default: 700 FPM
  readonly fixedRectangularHeightInches?: number; // Default: 8 in
}

export interface DuctSizingResult {
  readonly totalCfm: number;
  readonly inputMode: AirflowInputMode;
  readonly ductMaterial: DuctMaterial;
  readonly sizingMethod: SizingMethod;
  readonly frictionRateInWgPer100Ft: number;
  readonly targetVelocityFpm: number;
  readonly mainTrunk: SingleDuctEvaluation;
  readonly branchRuns: readonly BranchRunEvaluation[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
