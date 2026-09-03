import type { CalculationStep, CalculationWarning } from "./calculations";

export type StairCodeStandard = "irc" | "commercial" | "custom";

export type StairStringerLumber = "2x12" | "2x14" | "LVL";

export interface StairStepCutItem {
  readonly stepNumber: number;
  readonly riserHeightInches: number;
  readonly treadDepthInches: number;
  readonly cumulativeRiseInches: number;
  readonly cumulativeRunInches: number;
}

export interface StairCodeCompliance {
  readonly isRiserCompliant: boolean;
  readonly maxRiserAllowedInches: number;
  readonly isTreadCompliant: boolean;
  readonly minTreadAllowedInches: number;
  readonly isHeadroomCompliant: boolean;
  readonly minHeadroomAllowedInches: number;
  readonly isWidthCompliant: boolean;
  readonly minWidthAllowedInches: number;
  readonly isComfortRuleCompliant: boolean;
  readonly comfortRuleScoreInches: number;
  readonly overallCompliant: boolean;
}

export interface StairGeometryResult {
  readonly totalRiseInches: number;
  readonly totalRiseFormatted: string;
  readonly totalRunInches: number;
  readonly totalRunFormatted: string;
  readonly riserCount: number;
  readonly exactRiserHeightInches: number;
  readonly exactRiserHeightFormatted: string;
  readonly treadCount: number;
  readonly exactTreadDepthInches: number;
  readonly exactTreadDepthFormatted: string;
  readonly stairAngleDegrees: number;
  /** 2R + T comfort rule score in inches (Ideal: 24" to 25") */
  readonly comfortRuleValueInches: number;
  /** Theoretical stringer line length from top landing to bottom landing */
  readonly stringerLineLengthInches: number;
  readonly stringerLineLengthFt: number;
  readonly stringerLineLengthFormatted: string;
  /** Minimum standard stock lumber length required (e.g. 10', 12', 14', 16') */
  readonly stringerMinBoardLengthFt: number;
  /** Amount to cut off bottom of stringer = Tread Thickness - Lower Floor Finish Thickness */
  readonly bottomRiserDeductionInches: number;
  /** Amount to deduct from top of stringer */
  readonly topHangerDeductionInches: number;
  /** Solid wood depth remaining beneath stringer notches */
  readonly stringerThroatDepthInches: number;
  /** Minimum vertical headroom clearance measured to ceiling wellhole header */
  readonly headroomClearanceInches: number;
  /** The specific step number where headroom is closest to ceiling header */
  readonly headroomCriticalStep: number;
  readonly codeCompliance: StairCodeCompliance;
  readonly cutSchedule: readonly StairStepCutItem[];
}

export interface StairMaterialsTakeoff {
  /** Number of stringers required based on stair width and spacing */
  readonly stringerBoardCount: number;
  readonly stringerStockLengthFt: number;
  readonly stringerLumberStock: StairStringerLumber;
  readonly treadBoardPieces: number;
  readonly riserBoardPieces: number;
  readonly stringerHangersCount: number;
  readonly structuralScrewsLbs: number;
}

export interface StairCostRates {
  readonly pricePerStringerBoard?: number;
  readonly pricePerTreadBoard?: number;
  readonly pricePerRiserBoard?: number;
  readonly pricePerHangerBracket?: number;
}

export interface StairCostEstimate {
  readonly stringersCost: number;
  readonly treadsCost: number;
  readonly risersCost: number;
  readonly hangersCost: number;
  readonly totalEstimatedCost: number;
}

export interface StairCalculatorInput {
  /** Total vertical elevation from finished lower floor to finished upper floor in inches */
  readonly totalRiseInches: number;
  /** Desired target riser height in inches (default 7.5") */
  readonly targetRiserHeightInches?: number;
  /** Desired target tread depth in inches (default 10.5") */
  readonly targetTreadDepthInches?: number;
  /** Thickness of tread material in inches (default 1.0") */
  readonly treadThicknessInches?: number;
  /** Finished lower floor thickness in inches (default 0.75") */
  readonly finishedFloorLowerInches?: number;
  /** Finished upper floor thickness in inches (default 0.75") */
  readonly finishedFloorUpperInches?: number;
  /** Total stair clear width in inches (default 36") */
  readonly stairWidthInches?: number;
  /** Maximum on-center spacing between stringers in inches (default 16") */
  readonly maxStringerSpacingInches?: number;
  /** Stringer lumber stock (default "2x12") */
  readonly stringerStock?: StairStringerLumber;
  /** Ceiling wellhole opening length in inches (optional, for headroom check) */
  readonly wellholeLengthInches?: number;
  /** Upper floor joist + ceiling thickness in inches (default 11.25" for 2x10 + drywall) */
  readonly upperFloorThicknessInches?: number;
  /** Building code standard preset (default "irc") */
  readonly codeStandard?: StairCodeStandard;
  readonly costRates?: StairCostRates;
}

export interface StairCalculatorResult {
  readonly geometry: StairGeometryResult;
  readonly materials: StairMaterialsTakeoff;
  readonly costEstimate?: StairCostEstimate;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
