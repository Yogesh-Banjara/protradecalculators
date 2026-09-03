import type { RafterNominalDepth } from "@/types/roof";

export interface PitchInfo {
  readonly pitchIn12: number;
  readonly angleDegrees: number;
  readonly slopeFactor: number;
  readonly label: string;
  readonly classification: "flat" | "low_slope" | "standard" | "steep";
  readonly materialRecommendation: string;
}

export interface RafterLumberInfo {
  readonly nominal: RafterNominalDepth;
  readonly actualDepthInches: number;
  readonly actualThicknessInches: number;
}

export const RAFTER_LUMBER_SIZES: readonly RafterLumberInfo[] = [
  { nominal: "2x4", actualDepthInches: 3.5, actualThicknessInches: 1.5 },
  { nominal: "2x6", actualDepthInches: 5.5, actualThicknessInches: 1.5 },
  { nominal: "2x8", actualDepthInches: 7.25, actualThicknessInches: 1.5 },
  { nominal: "2x10", actualDepthInches: 9.25, actualThicknessInches: 1.5 },
  { nominal: "2x12", actualDepthInches: 11.25, actualThicknessInches: 1.5 },
] as const;

export const STANDARD_PITCHES: readonly PitchInfo[] = [
  {
    pitchIn12: 1,
    angleDegrees: 4.76,
    slopeFactor: 1.0035,
    label: "1/12 (Flat / Low Slope)",
    classification: "flat",
    materialRecommendation: "Membrane roofing only (EPDM, TPO, PVC, Modified Bitumen). Asphalt shingles prohibited.",
  },
  {
    pitchIn12: 2,
    angleDegrees: 9.46,
    slopeFactor: 1.0138,
    label: "2/12 (Low Slope Membrane)",
    classification: "low_slope",
    materialRecommendation: "Standing seam metal or low-slope membrane roofing. Shingles require double underlayment if permitted.",
  },
  {
    pitchIn12: 3,
    angleDegrees: 14.04,
    slopeFactor: 1.0308,
    label: "3/12 (Low Slope Shingle Threshold)",
    classification: "low_slope",
    materialRecommendation: "Asphalt shingles permitted with double-layer self-adhering ice & water underlayment.",
  },
  {
    pitchIn12: 4,
    angleDegrees: 18.43,
    slopeFactor: 1.0541,
    label: "4/12 (Standard Ranch / Modern)",
    classification: "standard",
    materialRecommendation: "Standard 3-tab or architectural asphalt shingles, metal panels, concrete tiles.",
  },
  {
    pitchIn12: 5,
    angleDegrees: 22.62,
    slopeFactor: 1.0833,
    label: "5/12 (Standard Residential)",
    classification: "standard",
    materialRecommendation: "Architectural shingles, metal roofing, cedar shakes, slate.",
  },
  {
    pitchIn12: 6,
    angleDegrees: 26.57,
    slopeFactor: 1.1180,
    label: "6/12 (Traditional Residential)",
    classification: "standard",
    materialRecommendation: "Standard walkable residential pitch. Ideal for architectural shingles and solar panel efficiency.",
  },
  {
    pitchIn12: 7,
    angleDegrees: 30.26,
    slopeFactor: 1.1577,
    label: "7/12 (Traditional Gable)",
    classification: "standard",
    materialRecommendation: "Architectural shingles, synthetic composite slate, standing seam metal.",
  },
  {
    pitchIn12: 8,
    angleDegrees: 33.69,
    slopeFactor: 1.2019,
    label: "8/12 (Cape Cod / Colonial)",
    classification: "standard",
    materialRecommendation: "Excellent water and snow runoff. Architectural shingles, cedar shakes, slate tiles.",
  },
  {
    pitchIn12: 9,
    angleDegrees: 36.87,
    slopeFactor: 1.2500,
    label: "9/12 (Steep Slope)",
    classification: "steep",
    materialRecommendation: "Steep pitch. Requires roof brackets/staging for installation safety.",
  },
  {
    pitchIn12: 10,
    angleDegrees: 39.81,
    slopeFactor: 1.3017,
    label: "10/12 (Steep Gothic / Tudor)",
    classification: "steep",
    materialRecommendation: "Architectural shingles, natural slate tiles, standing seam metal. High visual profile.",
  },
  {
    pitchIn12: 12,
    angleDegrees: 45.00,
    slopeFactor: 1.4142,
    label: "12/12 (45° A-Frame / Tudor)",
    classification: "steep",
    materialRecommendation: "45-degree slope. Rapid snow shedding. Requires full harness safety rigging.",
  },
] as const;

export const ROOFING_CONSTANTS = {
  SHINGLE_BUNDLES_PER_SQUARE: 3,
  SYNTHETIC_UNDERLAYMENT_ROLL_SQ_FT: 400, // 4 squares per roll
  FELT_UNDERLAYMENT_ROLL_SQ_FT: 200,      // 2 squares per roll
  DRIP_EDGE_PIECE_LENGTH_FT: 10,
  RIDGE_CAP_BUNDLE_LINEAR_FT: 33,
} as const;

export function getRafterLumberInfo(nominal: RafterNominalDepth = "2x6"): RafterLumberInfo {
  const found = RAFTER_LUMBER_SIZES.find((r) => r.nominal === nominal);
  return found ?? { nominal: "2x6", actualDepthInches: 5.5, actualThicknessInches: 1.5 };
}
