import type { DuctMaterial, VelocityStatus } from "@/types/duct";

/**
 * Standard factory-manufactured round duct diameters in inches.
 */
export const STANDARD_ROUND_DUCT_SIZES: readonly number[] = [
  4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24,
] as const;

/**
 * Standard sheet metal shop rectangular duct depths (heights) in inches.
 */
export const STANDARD_RECTANGULAR_HEIGHTS: readonly number[] = [
  6, 8, 10, 12, 14, 16, 18, 20, 24,
] as const;

/**
 * Standard rectangular duct widths in inches.
 */
export const STANDARD_RECTANGULAR_WIDTHS: readonly number[] = [
  6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40,
] as const;

/**
 * Duct material roughness properties and friction compensation multipliers.
 */
export interface DuctMaterialProperties {
  readonly material: DuctMaterial;
  readonly name: string;
  readonly absoluteRoughnessFt: number;
  readonly diameterAdjustmentMultiplier: number; // Factor applied to diameter for equal pressure drop
  readonly description: string;
}

export const DUCT_MATERIAL_REGISTRY: Record<DuctMaterial, DuctMaterialProperties> = {
  sheet_metal: {
    material: "sheet_metal",
    name: "Galvanized Sheet Metal (Smooth)",
    absoluteRoughnessFt: 0.0003,
    diameterAdjustmentMultiplier: 1.0,
    description: "Standard smooth rigid galvanized steel. Lowest friction loss and longest durability.",
  },
  flexible_duct: {
    material: "flexible_duct",
    name: "Wire-Helix Flexible Duct (Fully Stretched)",
    absoluteRoughnessFt: 0.003,
    diameterAdjustmentMultiplier: 1.15, // Requires ~15% larger diameter for equal pressure drop
    description: "Spiral wire vinyl/metal flex duct. High internal rib roughness increases resistance by 30%–50%.",
  },
  duct_board: {
    material: "duct_board",
    name: "Fibrous Glass Duct Board",
    absoluteRoughnessFt: 0.00075,
    diameterAdjustmentMultiplier: 1.05,
    description: "Rigid resin-bonded fiberglass board. Superior acoustic dampening with moderate friction.",
  },
};

/**
 * Recommended residential and commercial duct air velocity ranges in feet per minute (FPM).
 */
export const VELOCITY_THRESHOLDS = {
  quietMax: 500, // < 500 FPM (Whisper-quiet, sound studios & master bedrooms)
  optimalMax: 900, // 500–900 FPM (Standard residential supply/return design limit)
  highVelocityMax: 1200, // 900–1,200 FPM (Commercial main trunks, noticeable residential airflow hiss)
  excessiveNoiseMin: 1200, // > 1,200 FPM (Excessive noise, high blower static pressure penalty)
};

export function getVelocityStatus(velocityFpm: number): VelocityStatus {
  if (velocityFpm < VELOCITY_THRESHOLDS.quietMax) return "quiet";
  if (velocityFpm <= VELOCITY_THRESHOLDS.optimalMax) return "optimal";
  if (velocityFpm <= VELOCITY_THRESHOLDS.highVelocityMax) return "high_velocity";
  return "excessive_noise";
}

/**
 * Calculates equivalent round diameter for a rectangular duct using Huebscher's formula (ASHRAE Fundamentals).
 * De = 1.30 * (a * b)^0.625 / (a + b)^0.250
 */
export function calculateHuebscherEquivalentDiameter(widthInches: number, heightInches: number): number {
  if (widthInches <= 0 || heightInches <= 0) return 0;
  const numerator = 1.3 * Math.pow(widthInches * heightInches, 0.625);
  const denominator = Math.pow(widthInches + heightInches, 0.25);
  return numerator / denominator;
}

/**
 * Finds the nearest standard factory round duct size.
 */
export function findNearestStandardRoundDuct(theoreticalDiameterInches: number): number {
  for (const std of STANDARD_ROUND_DUCT_SIZES) {
    if (std >= theoreticalDiameterInches - 0.25) {
      return std;
    }
  }
  return STANDARD_ROUND_DUCT_SIZES[STANDARD_ROUND_DUCT_SIZES.length - 1];
}

/**
 * Finds the nearest practical rectangular width for a given height to match target round diameter.
 */
export function findMatchingRectangularWidth(
  targetEquivalentDiameterInches: number,
  fixedHeightInches: number
): number {
  for (const w of STANDARD_RECTANGULAR_WIDTHS) {
    const eqDia = calculateHuebscherEquivalentDiameter(w, fixedHeightInches);
    if (eqDia >= targetEquivalentDiameterInches - 0.3) {
      return w;
    }
  }
  return STANDARD_RECTANGULAR_WIDTHS[STANDARD_RECTANGULAR_WIDTHS.length - 1];
}
