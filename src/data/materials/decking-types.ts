import type {
  DeckBoardInfo,
  DeckBoardType,
  DeckJoistLumber,
  DeckJoistSpacing,
} from "@/types/deck";

export const DECK_BOARD_REGISTRY: readonly DeckBoardInfo[] = [
  {
    type: "5/4x6_composite",
    name: "5/4x6 Composite Decking (Trex, TimberTech)",
    nominalWidthInches: 6.0,
    actualWidthInches: 5.5,
    actualThicknessInches: 1.0,
    maxWoodJoistSpacingInches: 16,
    maxCompositeJoistSpacingInches: 12,
    isComposite: true,
  },
  {
    type: "5/4x6_wood",
    name: "5/4x6 Premium Wood (Cedar, Redwood, Pressure-Treated)",
    nominalWidthInches: 6.0,
    actualWidthInches: 5.5,
    actualThicknessInches: 1.0,
    maxWoodJoistSpacingInches: 16,
    maxCompositeJoistSpacingInches: 16,
    isComposite: false,
  },
  {
    type: "2x6_wood",
    name: "2x6 Heavy-Duty Dimensional Wood (Pressure-Treated)",
    nominalWidthInches: 6.0,
    actualWidthInches: 5.5,
    actualThicknessInches: 1.5,
    maxWoodJoistSpacingInches: 24,
    maxCompositeJoistSpacingInches: 24,
    isComposite: false,
  },
  {
    type: "2x4_wood",
    name: "2x4 Dimensional Wood Decking",
    nominalWidthInches: 4.0,
    actualWidthInches: 3.5,
    actualThicknessInches: 1.5,
    maxWoodJoistSpacingInches: 16,
    maxCompositeJoistSpacingInches: 16,
    isComposite: false,
  },
] as const;

/**
 * Maximum allowable joist clear spans based on IRC Table R507.6 (No. 2 Southern Pine / Douglas Fir, 40 PSF live load, 10 PSF dead load).
 */
export const IRC_MAX_JOIST_SPANS_FT: Record<
  DeckJoistLumber,
  Record<DeckJoistSpacing, number>
> = {
  "2x6": {
    12: 10.5,
    16: 9.75,
    24: 8.5,
  },
  "2x8": {
    12: 13.8,
    16: 12.8,
    24: 11.2,
  },
  "2x10": {
    12: 17.5,
    16: 16.4,
    24: 14.3,
  },
  "2x12": {
    12: 21.0,
    16: 19.4,
    24: 17.0,
  },
};

export const DECKING_CONSTANTS = {
  SQ_FT_PER_HIDDEN_FASTENER_BOX: 100,
  SCREWS_PER_SQ_FT: 3.5,
  SCREWS_PER_5LB_BOX: 350,
  BAG_60LB_YIELD_CU_FT: 0.45,
  BAG_80LB_YIELD_CU_FT: 0.60,
  CU_FT_PER_CU_YD: 27,
  STANDARD_BOARD_STOCK_LENGTHS: [12, 16, 20] as const,
  STANDARD_JOIST_STOCK_LENGTHS: [8, 10, 12, 14, 16, 20] as const,
} as const;

export function getDeckBoardInfo(type: DeckBoardType = "5/4x6_composite"): DeckBoardInfo {
  const found = DECK_BOARD_REGISTRY.find((b) => b.type === type);
  return found ?? DECK_BOARD_REGISTRY[0];
}

export function getMaxAllowableJoistSpan(
  lumber: DeckJoistLumber = "2x8",
  spacing: DeckJoistSpacing = 16
): number {
  return IRC_MAX_JOIST_SPANS_FT[lumber]?.[spacing] ?? 12.8;
}
