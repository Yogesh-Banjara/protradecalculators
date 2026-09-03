import type { CurrencyCode } from "@/types/units";
import type { CostEstimationResult, CostItem } from "@/types/calculations";
import { roundTo } from "./rounding";
import { calculateWithWaste } from "./waste";

/**
 * Calculates material cost given quantity and unit price.
 */
export function calculateMaterialCost(quantity: number, unitPrice: number): number {
  if (quantity < 0 || unitPrice < 0) {
    throw new RangeError("Quantity and unit price must be non-negative");
  }
  return roundTo(quantity * unitPrice, 2);
}

/**
 * Calculates labor cost given labor hours and hourly billing rate.
 */
export function calculateLaborCost(laborHours: number, hourlyRate: number): number {
  if (laborHours < 0 || hourlyRate < 0) {
    throw new RangeError("Labor hours and hourly rate must be non-negative");
  }
  return roundTo(laborHours * hourlyRate, 2);
}

/**
 * Calculates comprehensive project cost breakdown including materials,
 * labor, waste overhead, subtotal, sales tax, and grand total.
 */
export function calculateTotalProjectCost(options: {
  materialItems?: readonly CostItem[];
  baseMaterialCost?: number;
  laborCost?: number;
  wastePercent?: number;
  taxPercent?: number;
  currency?: CurrencyCode;
}): CostEstimationResult {
  const {
    materialItems = [],
    baseMaterialCost = 0,
    laborCost = 0,
    wastePercent = 0,
    taxPercent = 0,
    currency = "USD",
  } = options;

  if (baseMaterialCost < 0 || laborCost < 0) {
    throw new RangeError("Costs cannot be negative");
  }
  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percent must be between 0 and 100");
  }
  if (taxPercent < 0 || taxPercent > 100) {
    throw new RangeError("Tax percent must be between 0 and 100");
  }

  // Calculate items sum if items are provided, otherwise use baseMaterialCost
  const itemMaterialSum = materialItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  const netMaterialCost =
    materialItems.length > 0 ? itemMaterialSum : baseMaterialCost;

  // Material waste cost overhead
  const wasteResult = calculateWithWaste(netMaterialCost, wastePercent);
  const materialCostWithWaste = roundTo(wasteResult.totalQuantity, 2);
  const wasteCost = roundTo(wasteResult.wasteQuantity, 2);

  // Subtotal = (Material + Waste) + Labor
  const subtotal = roundTo(materialCostWithWaste + laborCost, 2);

  // Tax on taxable subtotal (typically materials only or full subtotal depending on jurisdiction)
  const taxAmount = roundTo(subtotal * (taxPercent / 100), 2);
  const totalCost = roundTo(subtotal + taxAmount, 2);

  return {
    materialCost: netMaterialCost,
    wasteCost,
    laborCost,
    subtotal,
    taxAmount,
    totalCost,
    currency,
    items: materialItems,
  };
}

/**
 * Calculates unit cost / unit rate (e.g. Cost per sq ft, Cost per cu yd).
 */
export function calculateCostPerUnit(
  totalCost: number,
  totalUnits: number
): number {
  if (totalCost < 0 || totalUnits <= 0) {
    throw new RangeError("Total cost must be non-negative and total units greater than zero");
  }
  return roundTo(totalCost / totalUnits, 2);
}
