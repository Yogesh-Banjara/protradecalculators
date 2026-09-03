import { describe, it, expect } from "vitest";
import {
  convertLength,
  convertArea,
  convertVolume,
  convertWeight,
  convertAngle,
  convertSlope,
  convertMeasurement,
} from "@/lib/units/converter";
import { formatFractionalInches, formatUnit, getUnitSymbol } from "@/lib/units/formatting";

describe("Unit Converter", () => {
  describe("Length Conversions", () => {
    it("converts feet to inches and yards accurately", () => {
      expect(convertLength(1, "foot", "inch")).toBe(12);
      expect(convertLength(3, "foot", "yard")).toBe(1);
      expect(convertLength(36, "inch", "yard")).toBe(1);
    });

    it("converts metric to imperial length with exact SI factors", () => {
      // 1 meter = 1000 mm = 39.37007874... inches
      expect(convertLength(1, "meter", "millimeter")).toBe(1000);
      expect(convertLength(1, "meter", "centimeter")).toBe(100);
      expect(convertLength(0.0254, "meter", "inch")).toBeCloseTo(1, 6);
      expect(convertLength(0.3048, "meter", "foot")).toBeCloseTo(1, 6);
    });

    it("returns same value when converting to same unit", () => {
      expect(convertLength(42, "foot", "foot")).toBe(42);
    });

    it("throws for non-finite values", () => {
      expect(() => convertLength(NaN, "foot", "inch")).toThrow(TypeError);
      expect(() => convertLength(Infinity, "foot", "inch")).toThrow(TypeError);
    });
  });

  describe("Area Conversions", () => {
    it("converts square feet to square yards and square inches", () => {
      expect(convertArea(9, "square-foot", "square-yard")).toBe(1);
      expect(convertArea(1, "square-foot", "square-inch")).toBe(144);
    });

    it("converts square meters to square feet", () => {
      // 1 sq m ≈ 10.7639 sq ft
      expect(convertArea(1, "square-meter", "square-foot")).toBeCloseTo(10.76391, 4);
    });
  });

  describe("Volume Conversions", () => {
    it("converts cubic feet to cubic yards (27 cu ft = 1 cu yd)", () => {
      expect(convertVolume(27, "cubic-foot", "cubic-yard")).toBe(1);
      expect(convertVolume(54, "cubic-foot", "cubic-yard")).toBe(2);
    });

    it("converts gallons and liters", () => {
      // 1 US gallon ≈ 3.78541 liters
      expect(convertVolume(1, "gallon", "liter")).toBeCloseTo(3.78541, 4);
      expect(convertVolume(1, "cubic-foot", "gallon")).toBeCloseTo(7.48052, 4);
    });
  });

  describe("Weight Conversions", () => {
    it("converts pounds to ounces and tons", () => {
      expect(convertWeight(1, "pound", "ounce")).toBe(16);
      expect(convertWeight(2000, "pound", "short-ton")).toBe(1);
      expect(convertWeight(1000, "kilogram", "metric-ton")).toBe(1);
    });

    it("converts kilograms to pounds (1 kg ≈ 2.20462 lbs)", () => {
      expect(convertWeight(1, "kilogram", "pound")).toBeCloseTo(2.20462, 4);
    });
  });

  describe("Angle and Slope Conversions", () => {
    it("converts degrees to radians and vice-versa", () => {
      expect(convertAngle(180, "degrees", "radians")).toBeCloseTo(Math.PI, 6);
      expect(convertAngle(Math.PI / 2, "radians", "degrees")).toBeCloseTo(90, 6);
    });

    it("calculates 4:12 standard roof pitch correctly", () => {
      const result = convertSlope(4, 12);
      expect(result.pitchNotation).toBe("4:12");
      expect(result.degrees).toBeCloseTo(18.43, 2);
      expect(result.percentGrade).toBeCloseTo(33.33, 2);
    });

    it("calculates 45-degree slope (12:12 pitch, 100% grade)", () => {
      const result = convertSlope(12, 12);
      expect(result.pitchNotation).toBe("12:12");
      expect(result.degrees).toBe(45);
      expect(result.percentGrade).toBe(100);
    });

    it("throws when run is zero", () => {
      expect(() => convertSlope(4, 0)).toThrow("Slope run cannot be zero");
    });
  });

  describe("Generic Measurement Converter", () => {
    it("converts measurement object correctly", () => {
      const input = { value: 36, unit: "inch" as const };
      const output = convertMeasurement(input, "foot");
      expect(output.value).toBe(3);
      expect(output.unit).toBe("foot");
    });
  });

  describe("Formatting Utilities", () => {
    it("formats fractional inches accurately", () => {
      expect(formatFractionalInches(3.5, 16)).toBe('3 1/2"');
      expect(formatFractionalInches(3.625, 16)).toBe('3 5/8"');
      expect(formatFractionalInches(0.75, 16)).toBe('3/4"');
      expect(formatFractionalInches(4.0, 16)).toBe('4"');
    });

    it("formats units with symbols", () => {
      expect(formatUnit(14.5, "cubic-yard")).toBe("14.5 cu yd");
      expect(formatUnit(45, "degrees")).toBe("45°");
      expect(formatUnit(2.5, "percent-grade")).toBe("2.5%");
    });

    it("retrieves unit symbols properly", () => {
      expect(getUnitSymbol("square-foot")).toBe("sq ft");
      expect(getUnitSymbol("short-ton")).toBe("tons");
      expect(getUnitSymbol("millimeter")).toBe("mm");
    });
  });
});
