import { describe, it, expect } from "vitest";
import { calculateWithWaste, calculateRealizedWastePercent } from "@/lib/calculations/waste";

describe("Waste Calculations", () => {
  it("calculates total required material with 10% waste", () => {
    const result = calculateWithWaste(100, 10);
    expect(result.netQuantity).toBe(100);
    expect(result.wastePercent).toBe(10);
    expect(result.wasteQuantity).toBe(10);
    expect(result.totalQuantity).toBe(110);
  });

  it("handles 0% waste properly", () => {
    const result = calculateWithWaste(50, 0);
    expect(result.wasteQuantity).toBe(0);
    expect(result.totalQuantity).toBe(50);
  });

  it("calculates realized waste percent", () => {
    expect(calculateRealizedWastePercent(110, 100)).toBe(10);
    expect(calculateRealizedWastePercent(120, 100)).toBe(20);
  });

  it("throws on invalid bounds", () => {
    expect(() => calculateWithWaste(-10, 5)).toThrow(RangeError);
    expect(() => calculateWithWaste(10, -5)).toThrow(RangeError);
    expect(() => calculateWithWaste(10, 105)).toThrow(RangeError);
    expect(() => calculateRealizedWastePercent(90, 100)).toThrow(RangeError);
  });
});
