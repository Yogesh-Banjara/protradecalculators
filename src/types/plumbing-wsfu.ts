import type { CalculationStep, CalculationWarning } from "./calculations";

export type PlumbingCodeStandard = "IPC" | "UPC";

export type PotablePipeMaterial = "copper_l" | "pex" | "cpvc";

export type StandardWaterPipeSizeInches =
  | "1/2"
  | "3/4"
  | "1"
  | "1-1/4"
  | "1-1/2"
  | "2"
  | "2-1/2"
  | "3";

export interface WsfuScheduleItem {
  readonly id: string;
  readonly fixtureId: string;
  readonly name: string;
  readonly quantity: number;
  readonly wsfuTotalEach: number;
  readonly wsfuColdEach: number;
  readonly wsfuHotEach: number;
  readonly minBranchSizeInches: StandardWaterPipeSizeInches;
  readonly isFlushometer?: boolean;
}

export interface PlumbingWsfuInput {
  readonly codeStandard: PlumbingCodeStandard;
  readonly pipeMaterial: PotablePipeMaterial;
  readonly staticPressurePsi: number; // Municipal or well supply pressure (e.g. 50-80 psi, default: 60)
  readonly highestFixtureElevationFeet: number; // Height above meter/source in feet (default: 10 ft)
  readonly developedLengthFeet: number; // Total physical pipe length in feet (default: 60 ft)
  readonly minResidualPressurePsi?: number; // Minimum required pressure at highest fixture (default: 15 psi)
  readonly meterPressureDropPsi?: number; // Estimated meter/PRV/backflow drop (default: 5 psi)
  readonly fixtures: readonly WsfuScheduleItem[];
  readonly continuousDemandGpm?: number; // Continuous flow irrigation or commercial load (default: 0 GPM)
}

export interface WsfuCalculationSubtotal {
  readonly fixtureId: string;
  readonly name: string;
  readonly quantity: number;
  readonly wsfuTotalEach: number;
  readonly wsfuColdEach: number;
  readonly wsfuHotEach: number;
  readonly subtotalTotalWsfu: number;
  readonly subtotalColdWsfu: number;
  readonly subtotalHotWsfu: number;
  readonly minBranchSizeInches: StandardWaterPipeSizeInches;
}

export interface PipeCandidateEvaluation {
  readonly sizeInches: StandardWaterPipeSizeInches;
  readonly internalDiameterInches: number;
  readonly velocityFps: number;
  readonly frictionLossPsiPer100Ft: number;
  readonly totalFrictionLossPsi: number;
  readonly residualPressureAtFixturePsi: number;
  readonly isVelocityCompliant: boolean; // Velocity <= 8 fps (or 10 fps for PEX)
  readonly isPressureCompliant: boolean; // Residual pressure >= minResidualPressurePsi
  readonly isCompliant: boolean;
}

export interface PlumbingWsfuResult {
  readonly codeStandard: PlumbingCodeStandard;
  readonly pipeMaterial: PotablePipeMaterial;
  readonly staticPressurePsi: number;
  readonly highestFixtureElevationFeet: number;
  readonly elevationLossPsi: number;
  readonly meterPressureDropPsi: number;
  readonly minResidualPressurePsi: number;
  readonly allowableFrictionLossPsi: number;
  readonly equivalentLengthFeet: number; // Developed length + 20% fitting allowance
  readonly allowableFrictionGradientPsiPer100Ft: number;
  readonly totalFixtureCount: number;
  readonly totalCalculatedWsfu: number;
  readonly totalColdWsfu: number;
  readonly totalHotWsfu: number;
  readonly peakDemandGpm: number; // Hunter's Curve conversion
  readonly continuousDemandGpm: number;
  readonly totalDesignFlowGpm: number;
  readonly recommendedMainPipeSizeInches: StandardWaterPipeSizeInches;
  readonly minColdBranchSizeInches: StandardWaterPipeSizeInches;
  readonly minHotBranchSizeInches: StandardWaterPipeSizeInches;
  readonly velocityAtRecommendedSizeFps: number;
  readonly actualResidualPressurePsi: number;
  readonly candidateEvaluations: readonly PipeCandidateEvaluation[];
  readonly fixtureBreakdown: readonly WsfuCalculationSubtotal[];
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
