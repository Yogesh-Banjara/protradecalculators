import type { CalculationStep, CalculationWarning } from "./calculations";

export type ConductorMaterial = "copper" | "aluminum";

export type ElectricalPhase = "single_phase" | "three_phase" | "dc";

export type ConductorTemperatureRating = "60C" | "75C" | "90C";

export type WireGaugeSize =
  | "14 AWG"
  | "12 AWG"
  | "10 AWG"
  | "8 AWG"
  | "6 AWG"
  | "4 AWG"
  | "3 AWG"
  | "2 AWG"
  | "1 AWG"
  | "1/0 AWG"
  | "2/0 AWG"
  | "3/0 AWG"
  | "4/0 AWG"
  | "250 kcmil"
  | "300 kcmil"
  | "350 kcmil"
  | "400 kcmil"
  | "500 kcmil"
  | "600 kcmil"
  | "750 kcmil"
  | "1000 kcmil";

export interface ConductorProperties {
  readonly size: WireGaugeSize;
  readonly circularMils: number;
  readonly copperAmpacity60C: number;
  readonly copperAmpacity75C: number;
  readonly copperAmpacity90C: number;
  readonly aluminumAmpacity60C: number;
  readonly aluminumAmpacity75C: number;
  readonly aluminumAmpacity90C: number;
  readonly copperResistancePer1000Ft: number;
  readonly aluminumResistancePer1000Ft: number;
}

export interface CandidateConductorEvaluation {
  readonly size: WireGaugeSize;
  readonly circularMils: number;
  readonly material: ConductorMaterial;
  readonly baseAmpacity: number;
  readonly deratedAmpacity: number;
  readonly voltageDropVolts: number;
  readonly voltageDropPercent: number;
  readonly voltageAtLoad: number;
  readonly isAmpacityCompliant: boolean;
  readonly isVoltageDropCompliant: boolean;
  readonly overallStatus: "recommended" | "pass" | "warning" | "fail";
  readonly maxDistanceFor3PctDropFt: number;
  readonly maxDistanceFor5PctDropFt: number;
}

export interface VoltageDropCalculationResult {
  readonly systemVoltage: number;
  readonly phase: ElectricalPhase;
  readonly loadCurrentAmps: number;
  readonly oneWayDistanceFt: number;
  readonly targetMaxVoltageDropPercent: number;
  readonly conductorMaterial: ConductorMaterial;
  readonly temperatureRating: ConductorTemperatureRating;
  readonly isContinuousLoad: boolean;
  readonly designCurrentAmps: number;
  readonly recommendedSize: WireGaugeSize;
  readonly recommendedCircularMils: number;
  readonly voltageDropVolts: number;
  readonly voltageDropPercent: number;
  readonly voltageAtLoad: number;
  readonly baseAmpacity: number;
  readonly deratedAmpacity: number;
  readonly is3PctCompliant: boolean;
  readonly is5PctCompliant: boolean;
  readonly maxDistanceFor3PctDropFt: number;
  readonly maxDistanceFor5PctDropFt: number;
  readonly candidates: readonly CandidateConductorEvaluation[];
  readonly copperVsAluminumComparison: {
    readonly copperRecommendedSize: WireGaugeSize;
    readonly copperDropPercent: number;
    readonly aluminumRecommendedSize: WireGaugeSize;
    readonly aluminumDropPercent: number;
  };
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}

export interface VoltageDropCalculatorInput {
  /** System nominal voltage (e.g. 120, 208, 240, 277, 480, 12, 24, 48) */
  readonly voltage: number;
  /** System phase: single phase, 3-phase, or DC */
  readonly phase?: ElectricalPhase;
  /** Full load current in Amperes */
  readonly loadCurrentAmps: number;
  /** One-way circuit distance in feet */
  readonly distanceFt: number;
  /** Conductor material (copper or aluminum) */
  readonly material?: ConductorMaterial;
  /** Conductor insulation temperature rating */
  readonly temperatureRating?: ConductorTemperatureRating;
  /** Target maximum voltage drop percentage (default 3.0%) */
  readonly targetMaxVoltageDropPercent?: number;
  /** Whether the load is continuous (runs ≥ 3 hours, requiring 125% ampacity sizing) */
  readonly isContinuousLoad?: boolean;
  /** Ambient temperature in °F (default 86°F / 30°C standard) */
  readonly ambientTempF?: number;
  /** Number of current-carrying conductors in raceway/cable (default 3) */
  readonly conductorsInConduit?: number;
}
