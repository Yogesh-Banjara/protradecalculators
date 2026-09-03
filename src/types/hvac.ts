import type { CalculationStep, CalculationWarning } from "./calculations";

export type ClimateZone =
  | "zone_1" // Hot/Humid (Miami, Houston, Honolulu)
  | "zone_2" // Warm/Humid or Hot/Dry (Atlanta, Phoenix, Tampa)
  | "zone_3" // Moderate (Dallas, Charlotte, Las Vegas)
  | "zone_4" // Mixed (DC, St. Louis, Nashville, Seattle)
  | "zone_5" // Cool (Chicago, Denver, Boston, Indianapolis)
  | "zone_6" // Cold (Minneapolis, Burlington, Milwaukee)
  | "zone_7"; // Very Cold (Fargo, Duluth, Anchorage)

export type InsulationGrade =
  | "poor" // Pre-1980 / minimal insulation: R-11 walls, R-19 attic, single-pane windows
  | "average" // Standard Code: R-13/R-15 walls, R-30/R-38 attic, double-pane windows
  | "good"; // Modern High-Efficiency: R-21 walls, R-49 attic, Low-E argon windows

export type SunExposure =
  | "low" // Heavy tree shade / North-facing orientation
  | "moderate" // Average suburban sun / mixed orientation
  | "high"; // Unshaded South / West facing large glass exposure

export type DuctworkLocation =
  | "conditioned_space" // 0% duct thermal loss (inside envelope)
  | "unconditioned_attic" // 12% duct thermal loss allowance
  | "crawlspace"; // 8% duct thermal loss allowance

export interface ClimateZoneInfo {
  readonly zone: ClimateZone;
  readonly name: string;
  readonly exampleCities: string;
  readonly summerOutdoorDesignTempF: number;
  readonly winterOutdoorDesignTempF: number;
  readonly summerDeltaTF: number;
  readonly winterDeltaTF: number;
}

export interface InsulationProperties {
  readonly grade: InsulationGrade;
  readonly name: string;
  readonly wallRValue: number;
  readonly wallUValue: number;
  readonly ceilingRValue: number;
  readonly ceilingUValue: number;
  readonly windowUValue: number;
  readonly windowShgc: number;
  readonly airChangesPerHour: number;
}

export interface HvacLoadInput {
  readonly floorAreaSqFt: number;
  readonly ceilingHeightFt?: number; // Default: 8 ft
  readonly climateZone?: ClimateZone; // Default: zone_4
  readonly insulationGrade?: InsulationGrade; // Default: average
  readonly sunExposure?: SunExposure; // Default: moderate
  readonly occupantsCount?: number; // Default: 2
  readonly includeKitchen?: boolean; // Default: true
  readonly windowAreaPercentage?: number; // Default: 15% of floor area
  readonly ductworkLocation?: DuctworkLocation; // Default: unconditioned_attic
}

export interface HvacLoadDetailedBreakdown {
  readonly envelopeCoolingBtu: number;
  readonly envelopeHeatingBtu: number;
  readonly windowSolarCoolingBtu: number;
  readonly windowConductionHeatingBtu: number;
  readonly infiltrationCoolingBtu: number;
  readonly infiltrationHeatingBtu: number;
  readonly occupantSensibleBtu: number;
  readonly occupantLatentBtu: number;
  readonly internalAppliancesSensibleBtu: number;
  readonly ductLossCoolingBtu: number;
  readonly ductLossHeatingBtu: number;
  readonly totalSensibleCoolingBtu: number;
  readonly totalLatentCoolingBtu: number;
}

export interface HvacLoadResult {
  readonly conditionedAreaSqFt: number;
  readonly ceilingHeightFt: number;
  readonly conditionedVolumeCuFt: number;
  readonly climateZone: ClimateZone;
  readonly climateZoneInfo: ClimateZoneInfo;
  readonly insulationGrade: InsulationGrade;
  readonly sunExposure: SunExposure;
  readonly occupantsCount: number;
  readonly coolingLoadBtuHr: number;
  readonly coolingTonsExact: number;
  readonly recommendedCoolingTons: number;
  readonly coolingSizingMarginPct: number;
  readonly heatingLoadBtuHr: number;
  readonly heatingKwEquivalent: number;
  readonly recommendedHeatingBtuHr: number;
  readonly miniSplitZoneRecommendation: string;
  readonly breakdown: HvacLoadDetailedBreakdown;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
