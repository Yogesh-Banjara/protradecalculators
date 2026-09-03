import type { StairCodeStandard, StairStringerLumber } from "@/types/stairs";

export interface StairCodeLimit {
  readonly code: StairCodeStandard;
  readonly name: string;
  readonly maxRiserInches: number;
  readonly minRiserInches: number;
  readonly minTreadInches: number;
  readonly minHeadroomInches: number;
  readonly minWidthInches: number;
  readonly maxRiserVariationInches: number;
  readonly description: string;
}

export interface StringerLumberInfo {
  readonly stock: StairStringerLumber;
  readonly actualDepthInches: number;
  readonly actualThicknessInches: number;
  readonly minThroatDepthInches: number;
  readonly label: string;
}

export const STAIR_CODE_LIMITS: Record<StairCodeStandard, StairCodeLimit> = {
  irc: {
    code: "irc",
    name: "IRC Standard (Residential)",
    maxRiserInches: 7.75,
    minRiserInches: 4.0,
    minTreadInches: 10.0,
    minHeadroomInches: 80.0, // 6 ft 8 in
    minWidthInches: 36.0,
    maxRiserVariationInches: 0.375, // 3/8 in
    description: "Standard residential single-family home code under IRC Section R311.7.",
  },
  commercial: {
    code: "commercial",
    name: "IBC / ADA (Commercial & Public)",
    maxRiserInches: 7.0,
    minRiserInches: 4.0,
    minTreadInches: 11.0,
    minHeadroomInches: 84.0, // 7 ft 0 in
    minWidthInches: 44.0,
    maxRiserVariationInches: 0.375,
    description: "Commercial, multi-family, and public egress standards under IBC Section 1011.",
  },
  custom: {
    code: "custom",
    name: "Custom Project Limits",
    maxRiserInches: 8.5,
    minRiserInches: 3.5,
    minTreadInches: 9.0,
    minHeadroomInches: 76.0,
    minWidthInches: 30.0,
    maxRiserVariationInches: 0.5,
    description: "Relaxed tolerances for compact attic, deck, or tiny house stairs.",
  },
};

export const STRINGER_LUMBER_OPTIONS: readonly StringerLumberInfo[] = [
  {
    stock: "2x12",
    actualDepthInches: 11.25,
    actualThicknessInches: 1.5,
    minThroatDepthInches: 3.5,
    label: "2x12 Dimensional Lumber (Standard Stringer)",
  },
  {
    stock: "2x14",
    actualDepthInches: 13.25,
    actualThicknessInches: 1.5,
    minThroatDepthInches: 5.0,
    label: "2x14 Heavy-Duty Lumber (Long Spans)",
  },
  {
    stock: "LVL",
    actualDepthInches: 11.875,
    actualThicknessInches: 1.75,
    minThroatDepthInches: 4.5,
    label: "11-7/8\" LVL (Engineered Laminated Veneer Lumber)",
  },
] as const;

export const STANDARD_STRINGER_STOCK_LENGTHS = [8, 10, 12, 14, 16, 20] as const;

export function getStairCodeLimit(code: StairCodeStandard = "irc"): StairCodeLimit {
  return STAIR_CODE_LIMITS[code] ?? STAIR_CODE_LIMITS.irc;
}

export function getStringerLumberInfo(stock: StairStringerLumber = "2x12"): StringerLumberInfo {
  const found = STRINGER_LUMBER_OPTIONS.find((s) => s.stock === stock);
  return (
    found ?? {
      stock: "2x12",
      actualDepthInches: 11.25,
      actualThicknessInches: 1.5,
      minThroatDepthInches: 3.5,
      label: "2x12 Dimensional Lumber",
    }
  );
}
