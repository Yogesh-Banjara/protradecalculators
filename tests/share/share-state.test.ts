import { describe, it, expect } from "vitest";
import {
  encodeCalculatorState,
  decodeCalculatorState,
  buildShareUrl,
  stripShareQueryParams,
  CURRENT_SHARE_VERSION,
} from "@/lib/share/state-serializer";
import { calculateConcreteSection } from "@/lib/calculations/concrete";
import { calculateConduitFillProject } from "@/lib/calculations/conduit";

describe("Shareable Calculator State Serialization", () => {
  describe("encodeCalculatorState & decodeCalculatorState", () => {
    it("round-trips standard calculator parameters accurately", () => {
      const toolSlug = "concrete-calculator";
      const originalValues = {
        length: 24,
        width: 12,
        depth: 4,
        depthUnit: "in",
        wastePercentage: 10,
      };

      const encoded = encodeCalculatorState(toolSlug, originalValues);
      expect(typeof encoded).toBe("string");
      expect(encoded.length).toBeGreaterThan(10);

      const decoded = decodeCalculatorState<typeof originalValues>(toolSlug, encoded);
      expect(decoded.isValid).toBe(true);
      expect(decoded.version).toBe(CURRENT_SHARE_VERSION);
      expect(decoded.toolSlug).toBe(toolSlug);
      expect(decoded.data.length).toBe(24);
      expect(decoded.data.width).toBe(12);
      expect(decoded.data.depth).toBe(4);
      expect(decoded.data.depthUnit).toBe("in");
      expect(decoded.data.wastePercentage).toBe(10);
    });

    it("safely handles malformed, random, and non-base64 input strings without crashing", () => {
      const toolSlug = "roof-pitch-calculator";

      const r1 = decodeCalculatorState(toolSlug, "not_valid_base64!!!");
      expect(r1.isValid).toBe(false);
      expect(r1.warnings.length).toBeGreaterThan(0);

      const r2 = decodeCalculatorState(toolSlug, "");
      expect(r2.isValid).toBe(false);

      const r3 = decodeCalculatorState(toolSlug, "{ malformed json: true }");
      expect(r3.isValid).toBe(false);
    });

    it("rejects excessively large payloads over 2KB to prevent memory spikes", () => {
      const hugeString = "A".repeat(3000);
      const result = decodeCalculatorState("framing-calculator", hugeString);
      expect(result.isValid).toBe(false);
      expect(result.warnings[0]).toContain("exceeds maximum allowed size");
    });

    it("neutralizes prototype pollution keys", () => {
      const toolSlug = "voltage-drop-calculator";
      const dirtyValues = {
        voltage: 120,
        __proto__: { isAdmin: true },
        prototype: { corrupted: true },
        constructor: { evil: true },
      };

      const encoded = encodeCalculatorState(toolSlug, dirtyValues as any);
      const decoded = decodeCalculatorState(toolSlug, encoded);

      expect(decoded.isValid).toBe(true);
      expect(decoded.data.voltage).toBe(120);
      expect((decoded.data as any).isAdmin).toBeUndefined();
      expect((Object.prototype as any).isAdmin).toBeUndefined();
    });

    it("detects tool slug mismatch and attaches informational warning", () => {
      const encoded = encodeCalculatorState("concrete-calculator", { length: 20 });
      const decoded = decodeCalculatorState("deck-calculator", encoded);

      expect(decoded.isValid).toBe(true);
      expect(decoded.warnings.some((w) => w.includes("Tool slug mismatch"))).toBe(true);
    });
  });

  describe("URL Generation & Canonical Cleanliness", () => {
    it("builds clean query parameter URLs", () => {
      const url = buildShareUrl(
        "/construction/concrete-calculator",
        "concrete-calculator",
        { length: 24, width: 24 }
      );
      expect(url).toContain("/construction/concrete-calculator?cfg=");
    });

    it("strips share query parameters to preserve canonical URLs", () => {
      const shareUrl = "https://protradecalculators.com/construction/concrete-calculator?cfg=ey...&other=1";
      const clean = stripShareQueryParams(shareUrl);
      expect(clean).toBe("/construction/concrete-calculator?other=1");

      const pureShare = "https://protradecalculators.com/electrical/conduit-fill-calculator?cfg=abc123";
      expect(stripShareQueryParams(pureShare)).toBe("/electrical/conduit-fill-calculator");
    });
  });

  describe("Calculation Integrity with Deserialized State", () => {
    it("feeds deserialized state into Concrete Slab calculation engine accurately", () => {
      const rawInputs = { length: 30, width: 15, depth: 6, depthUnit: "inch" as const, lengthUnit: "foot" as const };
      const encoded = encodeCalculatorState("concrete-calculator", rawInputs);
      const decoded = decodeCalculatorState<typeof rawInputs>("concrete-calculator", encoded);

      expect(decoded.isValid).toBe(true);

      const calc = calculateConcreteSection({
        id: "1",
        name: "Main Slab",
        shape: "rectangular-slab",
        quantity: 1,
        length: decoded.data.length!,
        width: decoded.data.width!,
        depth: decoded.data.depth!,
        depthUnit: decoded.data.depthUnit || "inch",
        lengthUnit: decoded.data.lengthUnit || "foot",
      });

      expect(calc.volumeCuFt).toBe(225);
      expect(calc.volumeCuYd).toBeCloseTo(8.33, 2);
    });

    it("feeds deserialized state into Conduit Fill calculation engine accurately", () => {
      const rawInputs = {
        conduitType: "emt" as const,
        isNippleOrShortRun: false,
        conductors: [
          { id: "1", size: "6 AWG" as const, insulation: "thhn" as const, count: 3 },
          { id: "2", size: "10 AWG" as const, insulation: "thhn" as const, count: 1 },
        ],
      };

      const encoded = encodeCalculatorState("conduit-fill-calculator", {
        conduitType: rawInputs.conduitType,
        isNippleOrShortRun: rawInputs.isNippleOrShortRun,
      });
      const decoded = decodeCalculatorState<{ conduitType: "emt"; isNippleOrShortRun: boolean }>(
        "conduit-fill-calculator",
        encoded
      );

      const result = calculateConduitFillProject({
        conduitType: decoded.data.conduitType || "emt",
        isNippleOrShortRun: decoded.data.isNippleOrShortRun || false,
        conductors: rawInputs.conductors,
      });

      expect(result.recommendedTradeSize).toBe("3/4");
      expect(result.actualFillPercentage).toBe(32.5);
      expect(result.totalConductorCount).toBe(4);
    });
  });
});
