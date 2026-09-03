import type { DrywallSheetSize, DrywallThickness } from "@/types/drywall";

export interface DrywallSheetInfo {
  readonly size: DrywallSheetSize;
  readonly widthFt: number;
  readonly lengthFt: number;
  readonly areaSqFt: number;
  readonly label: string;
  readonly description: string;
}

export interface DrywallThicknessInfo {
  readonly thickness: DrywallThickness;
  readonly label: string;
  readonly typicalWeightLbsPer4x8Sheet: number;
  readonly description: string;
}

export const DRYWALL_SHEET_SIZES: readonly DrywallSheetInfo[] = [
  {
    size: "4x8",
    widthFt: 4,
    lengthFt: 8,
    areaSqFt: 32,
    label: "4 ft × 8 ft (32 sq ft)",
    description: "Standard residential size. Easiest to transport, carry up stairwells, and hang solo.",
  },
  {
    size: "4x10",
    widthFt: 4,
    lengthFt: 10,
    areaSqFt: 40,
    label: "4 ft × 10 ft (40 sq ft)",
    description: "Ideal for 9 ft and 10 ft high ceilings to eliminate horizontal mid-wall joints.",
  },
  {
    size: "4x12",
    widthFt: 4,
    lengthFt: 12,
    areaSqFt: 48,
    label: "4 ft × 12 ft (48 sq ft)",
    description: "Commercial standard and long residential runs. Reduces taped butt joints by 25%. Requires 2-person crew.",
  },
] as const;

export const DRYWALL_THICKNESSES: readonly DrywallThicknessInfo[] = [
  {
    thickness: "1/2",
    label: "1/2 Inch (Standard Residential)",
    typicalWeightLbsPer4x8Sheet: 51,
    description: "Universal thickness for standard interior partition walls and residential ceilings with 16\" OC framing.",
  },
  {
    thickness: "5/8",
    label: "5/8 Inch (Type X Fire-Rated & Ceilings)",
    typicalWeightLbsPer4x8Sheet: 70,
    description: "Required for garage-to-house firewall separation, furnace rooms, 24\" OC ceilings to prevent sagging, and soundproofing.",
  },
] as const;

/**
 * Standard Drywall Finishing & Accessory Consumption Factors:
 * 
 * 1. Joint Tape: ~0.053 linear ft of paper/fiberglass tape per sq ft of board (approx 370 ft per 1,000 sq ft).
 * 2. Joint Compound (Premixed Mud): ~0.053 gallons per sq ft (approx 5.3 gal per 100 sq ft, or 1 x 4.5-gal bucket per 85 sq ft).
 * 3. Drywall Screws (1-1/4" #6 Coarse): ~1 screw per sq ft (approx 32 screws per 4x8 sheet).
 * 4. Fastener density: ~300 screws per lb; 1,500 screws per 5 lb box.
 */
export const DRYWALL_CONSTANTS = {
  TAPE_FT_PER_SQ_FT: 0.053,
  COMPOUND_GAL_PER_SQ_FT: 0.053,
  SCREWS_PER_SQ_FT: 1.0,
  SCREWS_PER_LB: 300,
  SCREWS_PER_5LB_BOX: 1500,
  STANDARD_BUCKET_GAL: 4.5,
  STANDARD_TAPE_ROLL_500_FT: 500,
  STANDARD_TAPE_ROLL_250_FT: 250,
} as const;

export function getDrywallSheetInfo(size: DrywallSheetSize): DrywallSheetInfo {
  const found = DRYWALL_SHEET_SIZES.find((s) => s.size === size);
  return (
    found ?? {
      size: "4x8",
      widthFt: 4,
      lengthFt: 8,
      areaSqFt: 32,
      label: "4 ft × 8 ft (32 sq ft)",
      description: "Standard residential sheet.",
    }
  );
}

export function getDrywallThicknessInfo(thickness: DrywallThickness): DrywallThicknessInfo {
  const found = DRYWALL_THICKNESSES.find((t) => t.thickness === thickness);
  return (
    found ?? {
      thickness: "1/2",
      label: "1/2 Inch (Standard)",
      typicalWeightLbsPer4x8Sheet: 51,
      description: "Standard residential drywall.",
    }
  );
}
