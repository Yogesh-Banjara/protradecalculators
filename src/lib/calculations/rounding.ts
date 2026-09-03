import type { RoundingPolicy } from "@/types/calculations";

/**
 * Deterministically rounds a number according to a specified policy.
 * - 'exact': No rounding, returns input
 * - 'standard': Standard half-up arithmetic rounding to N decimals
 * - 'trade-up': Rounds UP (ceil) to the nearest decimal (standard for purchasing materials)
 * - 'trade-down': Rounds DOWN (floor)
 */
export function roundTo(
  value: number,
  decimals: number = 2,
  policy: RoundingPolicy = "standard"
): number {
  if (!Number.isFinite(value)) return value;
  if (decimals < 0) {
    throw new RangeError("Decimals must be non-negative");
  }

  switch (policy) {
    case "exact":
      return value;
    case "trade-up":
      return Number(Math.ceil(Number(value + "e" + decimals)) + "e-" + decimals);
    case "trade-down":
      return Number(Math.floor(Number(value + "e" + decimals)) + "e-" + decimals);
    case "standard":
    default:
      // Prevent standard IEEE-754 precision glitch e.g. 1.005 * 100 = 100.49999999999999
      return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
  }
}

/**
 * Rounds a quantity UP to the nearest trade purchasing increment.
 * e.g. Ready-mix concrete ordered in 0.25 cubic yard increments.
 * 
 * @param value Actual calculated quantity
 * @param increment Minimum ordering increment (e.g. 0.25 for ready-mix, 1 for whole sheets/bags)
 */
export function roundToTradeIncrement(value: number, increment: number): number {
  if (increment <= 0) {
    throw new RangeError("Increment must be greater than zero");
  }
  if (value <= 0) return 0;

  return Math.ceil(value / increment) * increment;
}

/**
 * Calculates the exact whole bag count needed for premixed dry materials
 * (e.g. 80 lb concrete bags yielding 0.60 cu ft).
 */
export function calculateBagCount(
  totalVolumeCubicFeet: number,
  bagYieldCubicFeet: number
): { bagCount: number; exactBags: number; surplusCubicFeet: number } {
  if (totalVolumeCubicFeet < 0 || bagYieldCubicFeet <= 0) {
    throw new RangeError("Invalid volume or bag yield");
  }

  const exactBags = totalVolumeCubicFeet / bagYieldCubicFeet;
  const bagCount = Math.ceil(exactBags);
  const totalVolumeSupplied = bagCount * bagYieldCubicFeet;
  const surplusCubicFeet = totalVolumeSupplied - totalVolumeCubicFeet;

  return {
    bagCount,
    exactBags: roundTo(exactBags, 2),
    surplusCubicFeet: roundTo(surplusCubicFeet, 3),
  };
}
