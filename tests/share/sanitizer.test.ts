import { describe, it, expect } from "vitest";
import {
  sanitizeNumber,
  sanitizeString,
  sanitizeEnum,
  sanitizeBoolean,
} from "@/lib/share/sanitizer";

describe("Input Sanitizer & Security Utilities", () => {
  describe("sanitizeNumber", () => {
    it("parses valid numbers correctly", () => {
      expect(sanitizeNumber(24, 0)).toBe(24);
      expect(sanitizeNumber("48.5", 0)).toBe(48.5);
      expect(sanitizeNumber(0, 10)).toBe(0);
    });

    it("clamps numbers within specified min and max bounds", () => {
      expect(sanitizeNumber(150, 10, 0, 100)).toBe(100);
      expect(sanitizeNumber(-25, 10, 0, 100)).toBe(0);
      expect(sanitizeNumber(50, 10, 0, 100)).toBe(50);
    });

    it("returns default value for NaN, Infinity, -Infinity, and invalid types", () => {
      expect(sanitizeNumber(NaN, 12)).toBe(12);
      expect(sanitizeNumber(Infinity, 12)).toBe(12);
      expect(sanitizeNumber(-Infinity, 12)).toBe(12);
      expect(sanitizeNumber("invalid_string", 12)).toBe(12);
      expect(sanitizeNumber(null, 12)).toBe(12);
      expect(sanitizeNumber(undefined, 12)).toBe(12);
      expect(sanitizeNumber({}, 12)).toBe(12);
    });
  });

  describe("sanitizeString", () => {
    it("strips HTML tags and script injections", () => {
      expect(sanitizeString("<script>alert(1)</script>Hello", "")).toBe("alert(1)Hello");
      expect(sanitizeString("<img src=x onerror=alert(1)>", "")).toBe("");
      expect(sanitizeString("<b>2x4 Lumber</b>", "")).toBe("2x4 Lumber");
    });

    it("limits string length to prevent memory abuse", () => {
      const longStr = "A".repeat(500);
      expect(sanitizeString(longStr, "", 50).length).toBe(50);
    });

    it("returns default value on non-string inputs", () => {
      expect(sanitizeString(null, "default")).toBe("default");
      expect(sanitizeString(123, "default")).toBe("default");
      expect(sanitizeString(undefined, "default")).toBe("default");
    });
  });

  describe("sanitizeEnum", () => {
    const ALLOWED = ["emt", "pvc_40", "pvc_80"] as const;

    it("accepts whitelisted enum values", () => {
      expect(sanitizeEnum("emt", ALLOWED, "emt")).toBe("emt");
      expect(sanitizeEnum("pvc_80", ALLOWED, "emt")).toBe("pvc_80");
    });

    it("falls back to default for unlisted or malicious values", () => {
      expect(sanitizeEnum("rmc_unsupported", ALLOWED, "emt")).toBe("emt");
      expect(sanitizeEnum("<script>", ALLOWED, "emt")).toBe("emt");
      expect(sanitizeEnum(null, ALLOWED, "emt")).toBe("emt");
    });
  });

  describe("sanitizeBoolean", () => {
    it("parses boolean equivalents correctly", () => {
      expect(sanitizeBoolean(true)).toBe(true);
      expect(sanitizeBoolean(false)).toBe(false);
      expect(sanitizeBoolean("true")).toBe(true);
      expect(sanitizeBoolean("1")).toBe(true);
      expect(sanitizeBoolean("yes")).toBe(true);
      expect(sanitizeBoolean("false")).toBe(false);
      expect(sanitizeBoolean("0")).toBe(false);
      expect(sanitizeBoolean("no")).toBe(false);
    });

    it("returns default for unrecognized types", () => {
      expect(sanitizeBoolean(null, false)).toBe(false);
      expect(sanitizeBoolean(undefined, true)).toBe(true);
      expect(sanitizeBoolean("random", true)).toBe(true);
    });
  });
});
