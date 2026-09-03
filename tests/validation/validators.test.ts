import { describe, it, expect } from "vitest";
import {
  validateRequired,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validatePercentage,
  validateDimension,
} from "@/lib/validation/validators";

describe("Validation Primitives", () => {
  describe("validateRequired", () => {
    it("validates present values", () => {
      expect(validateRequired("test", "Name").isValid).toBe(true);
      expect(validateRequired(123, "Age").isValid).toBe(true);
    });

    it("rejects null, undefined, empty string", () => {
      expect(validateRequired(null, "Field").isValid).toBe(false);
      expect(validateRequired(undefined, "Field").isValid).toBe(false);
      expect(validateRequired("   ", "Field").isValid).toBe(false);
    });
  });

  describe("validatePositiveNumber", () => {
    it("accepts valid positive numbers", () => {
      const result = validatePositiveNumber("24.5", { fieldName: "Length" });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(24.5);
      expect(result.errors.length).toBe(0);
    });

    it("rejects zero and negative numbers", () => {
      expect(validatePositiveNumber(0, { fieldName: "Length" }).isValid).toBe(false);
      expect(validatePositiveNumber(-5, { fieldName: "Length" }).isValid).toBe(false);
    });

    it("rejects non-numeric and NaN strings", () => {
      expect(validatePositiveNumber("abc", { fieldName: "Length" }).isValid).toBe(false);
    });

    it("generates warnings when value exceeds warning thresholds", () => {
      const result = validatePositiveNumber(5000, {
        fieldName: "Length",
        warningThresholds: { max: 1000, message: "Length is unusually large" },
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].message).toBe("Length is unusually large");
    });
  });

  describe("validateNonNegativeNumber", () => {
    it("accepts 0 as a valid value", () => {
      const result = validateNonNegativeNumber(0, { fieldName: "Overhang" });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });

    it("rejects negative numbers", () => {
      const result = validateNonNegativeNumber(-1, { fieldName: "Overhang" });
      expect(result.isValid).toBe(false);
    });
  });

  describe("validatePercentage", () => {
    it("validates 0% to 100%", () => {
      expect(validatePercentage(10).isValid).toBe(true);
      expect(validatePercentage(0).isValid).toBe(true);
      expect(validatePercentage(100).isValid).toBe(true);
    });

    it("rejects values < 0 or > 100", () => {
      expect(validatePercentage(-1).isValid).toBe(false);
      expect(validatePercentage(101).isValid).toBe(false);
    });

    it("flags unusually high waste with a warning", () => {
      const result = validatePercentage(35);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBe(1);
    });
  });

  describe("validateDimension", () => {
    it("validates normal dimensions", () => {
      const result = validateDimension(12.5, "Width");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(12.5);
    });
  });
});
