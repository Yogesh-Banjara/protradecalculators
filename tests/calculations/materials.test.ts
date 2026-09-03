import { describe, it, expect } from "vitest";
import {
  calculateMaterialWeight,
  calculateMaterialVolumeFromWeight,
  calculateAggregateTonnage,
} from "@/lib/calculations/materials";
import { calculateBagCount, roundTo, roundToTradeIncrement } from "@/lib/calculations/rounding";

describe("Materials & Rounding Calculations", () => {
  describe("Material Weight & Density", () => {
    it("calculates weight of 2 cu yd of concrete (145 lb/cu ft density)", () => {
      // 2 cu yd = 54 cu ft * 145 = 7830 lbs = 3.915 short tons
      const weightLbs = calculateMaterialWeight(2, "cubic-yard", 145, "pound");
      expect(weightLbs).toBe(7830);

      const weightTons = calculateMaterialWeight(2, "cubic-yard", 145, "short-ton");
      expect(weightTons).toBe(3.915);
    });

    it("calculates volume from weight", () => {
      const volumeCuYd = calculateMaterialVolumeFromWeight(7830, "pound", 145, "cubic-yard");
      expect(volumeCuYd).toBeCloseTo(2.0, 4);
    });

    it("calculates aggregate tonnage with waste factor", () => {
      // 10 cu yd at 1.35 tons/yd = 13.5 net tons + 10% waste = 14.85 total tons
      const result = calculateAggregateTonnage(10, 1.35, 10);
      expect(result.netTons).toBe(13.5);
      expect(result.wasteTons).toBeCloseTo(1.35, 2);
      expect(result.totalTons).toBeCloseTo(14.85, 2);
    });
  });

  describe("Trade Rounding & Bag Counts", () => {
    it("rounds ready mix concrete to 0.25 cu yd trade increment", () => {
      expect(roundToTradeIncrement(4.12, 0.25)).toBe(4.25);
      expect(roundToTradeIncrement(4.26, 0.25)).toBe(4.50);
      expect(roundToTradeIncrement(0, 0.25)).toBe(0);
    });

    it("calculates whole bag count for 80lb premixed concrete bags (0.60 cu ft yield)", () => {
      // Need 10 cu ft -> 10 / 0.6 = 16.666 -> 17 bags
      const result = calculateBagCount(10, 0.60);
      expect(result.bagCount).toBe(17);
      expect(result.exactBags).toBe(16.67);
      expect(result.surplusCubicFeet).toBeCloseTo(0.2, 2);
    });

    it("rounds numbers with standard half-up policy", () => {
      expect(roundTo(1.234, 2)).toBe(1.23);
      expect(roundTo(1.235, 2)).toBe(1.24);
      expect(roundTo(1.234, 2, "trade-up")).toBe(1.24);
      expect(roundTo(1.239, 2, "trade-down")).toBe(1.23);
    });
  });
});
