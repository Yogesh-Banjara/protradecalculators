import type { VolumeUnit, WeightUnit } from "@/types/units";
import { convertVolume, convertWeight } from "../units/converter";
import { calculateWithWaste } from "./waste";

/**
 * Calculates material weight given volume, unit, and density in lb/cu ft.
 */
export function calculateMaterialWeight(
  volume: number,
  volumeUnit: VolumeUnit,
  densityLbsPerCuFt: number,
  targetWeightUnit: WeightUnit = "pound"
): number {
  if (volume < 0 || densityLbsPerCuFt < 0) {
    throw new RangeError("Volume and density must be non-negative");
  }

  const volumeInCuFt = convertVolume(volume, volumeUnit, "cubic-foot");
  const weightLbs = volumeInCuFt * densityLbsPerCuFt;

  return convertWeight(weightLbs, "pound", targetWeightUnit);
}

/**
 * Calculates required volume given material target weight and density.
 */
export function calculateMaterialVolumeFromWeight(
  weight: number,
  weightUnit: WeightUnit,
  densityLbsPerCuFt: number,
  targetVolumeUnit: VolumeUnit = "cubic-yard"
): number {
  if (weight < 0 || densityLbsPerCuFt <= 0) {
    throw new RangeError("Weight must be non-negative and density greater than zero");
  }

  const weightInLbs = convertWeight(weight, weightUnit, "pound");
  const volumeCuFt = weightInLbs / densityLbsPerCuFt;

  return convertVolume(volumeCuFt, "cubic-foot", targetVolumeUnit);
}

/**
 * Calculates total aggregate tonnage (e.g. gravel, crusher run, sand)
 * from cubic yards and density rating (typical 1.3 - 1.5 tons/cu yd),
 * with optional waste factor.
 */
export function calculateAggregateTonnage(
  volumeCubicYards: number,
  tonsPerCubicYard: number,
  wastePercent: number = 0
): {
  netTons: number;
  totalTons: number;
  wasteTons: number;
} {
  if (volumeCubicYards < 0 || tonsPerCubicYard < 0) {
    throw new RangeError("Volume and tons per cubic yard must be non-negative");
  }

  const netTons = volumeCubicYards * tonsPerCubicYard;
  const withWaste = calculateWithWaste(netTons, wastePercent);

  return {
    netTons: withWaste.netQuantity,
    totalTons: withWaste.totalQuantity,
    wasteTons: withWaste.wasteQuantity,
  };
}
