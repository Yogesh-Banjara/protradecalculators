import type { CalculationStep, CalculationWarning } from "./calculations";
import type { RafterNominalDepth, RafterCutAngles, BirdsmouthGeometry, RafterGeometryResult } from "./roof";

export type { RafterNominalDepth, RafterCutAngles, BirdsmouthGeometry, RafterGeometryResult };

export type RafterSpacingInches = 12 | 16 | 24;

export interface RafterIrcCompliance {
  readonly isNotchCompliant: boolean;
  readonly maxAllowedPlumbCutInches: number;
  readonly plumbCutDepthInches: number;
  readonly isBearingCompliant: boolean;
  readonly minBearingRequiredInches: number;
  readonly seatBearingInches: number;
  readonly isHapCompliant: boolean;
  readonly heightAbovePlateInches: number;
}

export interface RafterCalculatorInput {
  /** Building overall span from exterior framing to exterior framing in feet */
  readonly buildingSpanFt: number;
  /** Pitch rise in 12 inches (e.g. 4, 6, 8, 12) */
  readonly pitchIn12: number;
  /** Horizontal eave overhang in inches (default 12") */
  readonly eaveOverhangInches?: number;
  /** Thickness of ridge beam or ridge board in inches (default 1.5" for 2x lumber) */
  readonly ridgeBoardThicknessInches?: number;
  /** Nominal depth of common rafter lumber (2x4, 2x6, 2x8, 2x10, 2x12) */
  readonly rafterDepthNominal?: RafterNominalDepth;
  /** Horizontal seat cut bearing length in inches (e.g. 3.5" for 2x4 top plate) */
  readonly seatCutBearingInches?: number;
  /** On-center spacing between rafters in inches (12, 16, or 24) */
  readonly rafterSpacingInches?: RafterSpacingInches;
  /** Total building roof length along ridge in feet (optional, for rafter count) */
  readonly roofLengthFt?: number;
}

export interface RafterCalculatorResult {
  readonly geometry: RafterGeometryResult;
  /** Recommended minimum stock lumber length to purchase (e.g. 8', 10', 12', 14', 16', 18', 20') */
  readonly recommendedStockLumberFt: number;
  /** IRC Section R802.7.1 code check results for notches and bearing */
  readonly ircCompliance: RafterIrcCompliance;
  /** Optional materials count when roof length is provided */
  readonly totalRafterPairs?: number;
  readonly totalCommonRafters?: number;
  readonly steps: readonly CalculationStep[];
  readonly warnings: readonly CalculationWarning[];
}
