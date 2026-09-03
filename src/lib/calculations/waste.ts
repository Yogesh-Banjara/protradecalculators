export interface WasteCalculationResult {
  readonly netQuantity: number;
  readonly wastePercent: number;
  readonly wasteQuantity: number;
  readonly totalQuantity: number;
}

/**
 * Calculates total materials needed including waste percentage allowance.
 * 
 * Formula: total = netQuantity * (1 + wastePercent / 100)
 */
export function calculateWithWaste(
  netQuantity: number,
  wastePercent: number
): WasteCalculationResult {
  if (netQuantity < 0) {
    throw new RangeError("Net quantity cannot be negative");
  }
  if (wastePercent < 0) {
    throw new RangeError("Waste percentage cannot be negative");
  }
  if (wastePercent > 100) {
    throw new RangeError("Waste percentage cannot exceed 100%");
  }

  const wasteQuantity = netQuantity * (wastePercent / 100);
  const totalQuantity = netQuantity + wasteQuantity;

  return {
    netQuantity,
    wastePercent,
    wasteQuantity,
    totalQuantity,
  };
}

/**
 * Calculates the realized waste percentage given total material ordered vs net installed.
 */
export function calculateRealizedWastePercent(
  totalOrdered: number,
  netRequired: number
): number {
  if (netRequired <= 0) {
    throw new RangeError("Net required must be greater than zero");
  }
  if (totalOrdered < netRequired) {
    throw new RangeError("Total ordered cannot be less than net required");
  }

  return ((totalOrdered - netRequired) / netRequired) * 100;
}
