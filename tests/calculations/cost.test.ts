import { describe, it, expect } from "vitest";
import {
  calculateMaterialCost,
  calculateLaborCost,
  calculateTotalProjectCost,
  calculateCostPerUnit,
} from "@/lib/calculations/cost";

describe("Cost Calculation Engine", () => {
  describe("calculateMaterialCost", () => {
    it("calculates material cost for quantity and unit price", () => {
      expect(calculateMaterialCost(10, 15.5)).toBe(155.0);
      expect(calculateMaterialCost(0, 50)).toBe(0);
    });

    it("throws RangeError on negative inputs", () => {
      expect(() => calculateMaterialCost(-5, 10)).toThrow(RangeError);
      expect(() => calculateMaterialCost(5, -10)).toThrow(RangeError);
    });
  });

  describe("calculateLaborCost", () => {
    it("calculates labor cost accurately", () => {
      expect(calculateLaborCost(8, 65)).toBe(520.0);
    });
  });

  describe("calculateTotalProjectCost", () => {
    it("calculates total cost with waste overhead and sales tax", () => {
      // Net material = $1000, 10% waste = $100 -> Material with waste = $1100
      // Labor = $500 -> Subtotal = $1600
      // Tax @ 7.5% on $1600 = $120 -> Grand total = $1720
      const result = calculateTotalProjectCost({
        baseMaterialCost: 1000,
        laborCost: 500,
        wastePercent: 10,
        taxPercent: 7.5,
        currency: "USD",
      });

      expect(result.materialCost).toBe(1000);
      expect(result.wasteCost).toBe(100);
      expect(result.laborCost).toBe(500);
      expect(result.subtotal).toBe(1600);
      expect(result.taxAmount).toBe(120);
      expect(result.totalCost).toBe(1720);
      expect(result.currency).toBe("USD");
    });

    it("handles itemized material items list", () => {
      const items = [
        { label: "Concrete (cu yd)", quantity: 5, unit: "cubic-yard", unitCost: 150, totalCost: 750 },
        { label: "Rebar (sticks)", quantity: 20, unit: "pcs", unitCost: 12.5, totalCost: 250 },
      ];

      const result = calculateTotalProjectCost({
        materialItems: items,
        laborCost: 400,
        wastePercent: 5,
        taxPercent: 0,
      });

      expect(result.materialCost).toBe(1000); // 750 + 250
      expect(result.wasteCost).toBe(50);
      expect(result.subtotal).toBe(1450);
      expect(result.totalCost).toBe(1450);
    });
  });

  describe("calculateCostPerUnit", () => {
    it("calculates unit rate accurately", () => {
      // $1500 total cost for 300 sq ft -> $5.00 / sq ft
      expect(calculateCostPerUnit(1500, 300)).toBe(5.0);
    });

    it("throws on zero or negative units", () => {
      expect(() => calculateCostPerUnit(1000, 0)).toThrow(RangeError);
      expect(() => calculateCostPerUnit(1000, -10)).toThrow(RangeError);
    });
  });
});
