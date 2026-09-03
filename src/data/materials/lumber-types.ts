import type { LumberNominalSize } from "@/types/framing";

export interface LumberSizeInfo {
  readonly nominal: LumberNominalSize;
  readonly nominalThicknessInches: number;
  readonly nominalWidthInches: number;
  readonly actualThicknessInches: number;
  readonly actualWidthInches: number;
  /** Board feet per linear foot = (nominal thickness * nominal width) / 12 */
  readonly boardFeetPerLinearFt: number;
  readonly commonUse: string;
}

export const LUMBER_SIZES: readonly LumberSizeInfo[] = [
  {
    nominal: "2x4",
    nominalThicknessInches: 2,
    nominalWidthInches: 4,
    actualThicknessInches: 1.5,
    actualWidthInches: 3.5,
    boardFeetPerLinearFt: 0.6667,
    commonUse: "Interior partition walls, non-bearing walls, short exterior walls (warm climates).",
  },
  {
    nominal: "2x6",
    nominalThicknessInches: 2,
    nominalWidthInches: 6,
    actualThicknessInches: 1.5,
    actualWidthInches: 5.5,
    boardFeetPerLinearFt: 1.0,
    commonUse: "Exterior structural load-bearing walls, R-20+ cavity insulation walls, plumbing wet walls.",
  },
  {
    nominal: "2x8",
    nominalThicknessInches: 2,
    nominalWidthInches: 8,
    actualThicknessInches: 1.5,
    actualWidthInches: 7.25,
    boardFeetPerLinearFt: 1.3333,
    commonUse: "Window/door headers for spans up to 6 ft, floor joists, roof rafters.",
  },
  {
    nominal: "2x10",
    nominalThicknessInches: 2,
    nominalWidthInches: 10,
    actualThicknessInches: 1.5,
    actualWidthInches: 9.25,
    boardFeetPerLinearFt: 1.6667,
    commonUse: "Window/door headers for spans up to 8 ft, heavy floor joists.",
  },
  {
    nominal: "2x12",
    nominalThicknessInches: 2,
    nominalWidthInches: 12,
    actualThicknessInches: 1.5,
    actualWidthInches: 11.25,
    boardFeetPerLinearFt: 2.0,
    commonUse: "Large garage door headers, sliding patio door headers (spans up to 10+ ft), stair stringers.",
  },
] as const;

export const STANDARD_STOCK_PLATE_LENGTHS = [16, 14, 12, 10, 8] as const;

export const STANDARD_WALL_HEIGHTS = [
  { heightFt: 8, preCutStudInches: 92.625, label: "8 ft Ceiling (92-5/8\" Pre-cut Studs)" },
  { heightFt: 9, preCutStudInches: 104.625, label: "9 ft Ceiling (104-5/8\" Pre-cut Studs)" },
  { heightFt: 10, preCutStudInches: 116.625, label: "10 ft Ceiling (116-5/8\" Pre-cut Studs)" },
  { heightFt: 12, preCutStudInches: 140.625, label: "12 ft High-Ceiling Wall" },
] as const;

/**
 * Retrieves lumber sizing metadata by nominal size.
 */
export function getLumberSizeInfo(nominal: LumberNominalSize): LumberSizeInfo {
  const found = LUMBER_SIZES.find((l) => l.nominal === nominal);
  return (
    found ?? {
      nominal: "2x4",
      nominalThicknessInches: 2,
      nominalWidthInches: 4,
      actualThicknessInches: 1.5,
      actualWidthInches: 3.5,
      boardFeetPerLinearFt: 0.6667,
      commonUse: "Standard framing lumber.",
    }
  );
}

/**
 * Retrieves all registered lumber sizes.
 */
export function getAllLumberSizes(): readonly LumberSizeInfo[] {
  return LUMBER_SIZES;
}
