import { describe, it, expect } from "vitest";
import {
  calculateRectangleArea,
  calculateRectanglePerimeter,
  calculateTriangleArea,
  calculateCircleArea,
  calculateCircleCircumference,
  calculateTrapezoidArea,
  calculateRectangularVolume,
  calculateCylinderVolume,
  calculateSlabVolume,
  calculateRafterLength,
  calculateSlope,
} from "@/lib/calculations/geometry";

describe("Geometry Calculations", () => {
  describe("2D Area & Perimeter", () => {
    it("calculates rectangle area and perimeter", () => {
      expect(calculateRectangleArea(10, 20)).toBe(200);
      expect(calculateRectanglePerimeter(10, 20)).toBe(60);
    });

    it("calculates triangle area", () => {
      expect(calculateTriangleArea(10, 5)).toBe(25);
    });

    it("calculates circle area and circumference", () => {
      expect(calculateCircleArea(7)).toBeCloseTo(153.938, 3);
      expect(calculateCircleCircumference(7)).toBeCloseTo(43.982, 3);
    });

    it("calculates trapezoid area", () => {
      expect(calculateTrapezoidArea(10, 20, 6)).toBe(90);
    });

    it("throws RangeError on negative inputs", () => {
      expect(() => calculateRectangleArea(-5, 10)).toThrow(RangeError);
      expect(() => calculateCircleArea(-1)).toThrow(RangeError);
    });
  });

  describe("3D Volume", () => {
    it("calculates rectangular box volume", () => {
      expect(calculateRectangularVolume(10, 10, 10)).toBe(1000);
    });

    it("calculates cylinder volume", () => {
      // radius = 2, height = 10 -> pi * 4 * 10 ≈ 125.6637
      expect(calculateCylinderVolume(2, 10)).toBeCloseTo(125.6637, 3);
    });

    it("calculates standard concrete slab volume (20ft x 20ft x 4in slab)", () => {
      // 20 * 20 * (4/12) = 133.333 cu ft -> 133.333 / 27 ≈ 4.938 cu yd
      const result = calculateSlabVolume(20, 20, 4, "cubic-yard");
      expect(result.value).toBeCloseTo(4.938, 3);
      expect(result.unit).toBe("cubic-yard");
      expect(result.steps).toBeDefined();
      expect(result.steps?.length).toBe(3);
    });
  });

  describe("Slopes & Rafters", () => {
    it("calculates rafter length with and without overhang", () => {
      // 12ft run, 9ft rise -> 3-4-5 triangle -> base rafter = 15ft
      const baseRafter = calculateRafterLength(12, 9, 0);
      expect(baseRafter).toBe(15);

      // Overhang of 1 ft -> slope factor is 15/12 = 1.25 -> 15 + 1.25 = 16.25 ft
      const withOverhang = calculateRafterLength(12, 9, 1);
      expect(withOverhang).toBe(16.25);
    });

    it("calculates slope properties", () => {
      const slope = calculateSlope(6, 12);
      expect(slope.pitchNotation).toBe("6:12");
      expect(slope.degrees).toBeCloseTo(26.57, 2);
      expect(slope.percentGrade).toBe(50);
    });
  });
});
