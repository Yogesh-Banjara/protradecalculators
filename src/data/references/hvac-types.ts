import type {
  ClimateZone,
  ClimateZoneInfo,
  InsulationGrade,
  InsulationProperties,
  SunExposure,
} from "@/types/hvac";

/**
 * Standard DOE / ASHRAE 99%/1% Outdoor Design Temperatures for US Climate Zones.
 * Baseline Indoor Setpoints: Summer = 75°F, Winter = 70°F.
 */
export const CLIMATE_ZONES_REGISTRY: Record<ClimateZone, ClimateZoneInfo> = {
  zone_1: {
    zone: "zone_1",
    name: "Zone 1: Very Hot & Humid",
    exampleCities: "Miami, FL · Houston, TX · Honolulu, HI",
    summerOutdoorDesignTempF: 95,
    winterOutdoorDesignTempF: 48,
    summerDeltaTF: 20, // 95 - 75
    winterDeltaTF: 22, // 70 - 48
  },
  zone_2: {
    zone: "zone_2",
    name: "Zone 2: Hot & Humid / Hot & Dry",
    exampleCities: "Phoenix, AZ · Orlando, FL · New Orleans, LA",
    summerOutdoorDesignTempF: 98,
    winterOutdoorDesignTempF: 32,
    summerDeltaTF: 23, // 98 - 75
    winterDeltaTF: 38, // 70 - 32
  },
  zone_3: {
    zone: "zone_3",
    name: "Zone 3: Warm / Moderate",
    exampleCities: "Atlanta, GA · Dallas, TX · Las Vegas, NV",
    summerOutdoorDesignTempF: 95,
    winterOutdoorDesignTempF: 22,
    summerDeltaTF: 20, // 95 - 75
    winterDeltaTF: 48, // 70 - 22
  },
  zone_4: {
    zone: "zone_4",
    name: "Zone 4: Mixed-Humid / Mixed-Dry",
    exampleCities: "Washington, DC · St. Louis, MO · Seattle, WA · Nashville, TN",
    summerOutdoorDesignTempF: 92,
    winterOutdoorDesignTempF: 12,
    summerDeltaTF: 17, // 92 - 75
    winterDeltaTF: 58, // 70 - 12
  },
  zone_5: {
    zone: "zone_5",
    name: "Zone 5: Cool / Temperate",
    exampleCities: "Chicago, IL · Denver, CO · Boston, MA · Philadelphia, PA",
    summerOutdoorDesignTempF: 89,
    winterOutdoorDesignTempF: -2,
    summerDeltaTF: 14, // 89 - 75
    winterDeltaTF: 72, // 70 - (-2)
  },
  zone_6: {
    zone: "zone_6",
    name: "Zone 6: Cold",
    exampleCities: "Minneapolis, MN · Burlington, VT · Milwaukee, WI · Helena, MT",
    summerOutdoorDesignTempF: 86,
    winterOutdoorDesignTempF: -14,
    summerDeltaTF: 11, // 86 - 75
    winterDeltaTF: 84, // 70 - (-14)
  },
  zone_7: {
    zone: "zone_7",
    name: "Zone 7: Very Cold / Subarctic",
    exampleCities: "Fargo, ND · Duluth, MN · Anchorage, AK",
    summerOutdoorDesignTempF: 84,
    winterOutdoorDesignTempF: -24,
    summerDeltaTF: 9, // 84 - 75
    winterDeltaTF: 94, // 70 - (-24)
  },
};

/**
 * Standard Envelope Insulation & Window Thermal Properties.
 */
export const INSULATION_REGISTRY: Record<InsulationGrade, InsulationProperties> = {
  poor: {
    grade: "poor",
    name: "Poor / Pre-1980 (Minimal Insulation)",
    wallRValue: 11,
    wallUValue: 0.091, // 1 / 11
    ceilingRValue: 19,
    ceilingUValue: 0.053, // 1 / 19
    windowUValue: 0.85, // Single-pane clear glass
    windowShgc: 0.72, // High solar heat transmission
    airChangesPerHour: 0.8, // Drafty older construction
  },
  average: {
    grade: "average",
    name: "Average / Standard Code (Standard Insulation)",
    wallRValue: 13,
    wallUValue: 0.077, // 1 / 13
    ceilingRValue: 38,
    ceilingUValue: 0.026, // 1 / 38
    windowUValue: 0.35, // Double-pane standard glass
    windowShgc: 0.4, // Moderate solar control
    airChangesPerHour: 0.5, // Standard modern construction
  },
  good: {
    grade: "good",
    name: "Superior / High-Efficiency (Modern Tight Envelope)",
    wallRValue: 21,
    wallUValue: 0.048, // 1 / 21
    ceilingRValue: 49,
    ceilingUValue: 0.02, // 1 / 49
    windowUValue: 0.28, // Low-E Argon double/triple pane
    windowShgc: 0.25, // Advanced solar low-E coating
    airChangesPerHour: 0.3, // Continuous air barrier / tight envelope
  },
};

export const SUN_EXPOSURE_MULTIPLIERS: Record<SunExposure, number> = {
  low: 0.75, // Shaded / North facing
  moderate: 1.0, // Average suburban tree cover & mixed exposure
  high: 1.35, // Direct unshaded South/West afternoon solar exposure
};

export const NOMINAL_AC_TONS: readonly number[] = [
  1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0,
];

export function getClimateZoneInfo(zone: ClimateZone): ClimateZoneInfo {
  return CLIMATE_ZONES_REGISTRY[zone] ?? CLIMATE_ZONES_REGISTRY.zone_4;
}

export function getInsulationProperties(grade: InsulationGrade): InsulationProperties {
  return INSULATION_REGISTRY[grade] ?? INSULATION_REGISTRY.average;
}
