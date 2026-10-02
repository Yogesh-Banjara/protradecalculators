import { describe, it, expect } from "vitest";
import { calculateRafterProject } from "@/lib/calculations/rafter";
import type { RafterCalculatorInput } from "@/types/rafter";

describe("Rafter Framing & Geometry Calculation Engine", () => {
  it("calculates accurate geometry for a 24ft span gable roof with 6/12 pitch", () => {
    const input: RafterCalculatorInput = {
      buildingSpanFt: 24,
      pitchIn12: 6,
      eaveOverhangInches: 12,
      ridgeBoardThicknessInches: 1.5,
      rafterDepthNominal: "2x6",
      seatCutBearingInches: 3.5,
    };

    const res = calculateRafterProject(input);

    expect(res.geometry.runFt).toBe(12);
    expect(res.geometry.runInches).toBe(144);
    expect(res.geometry.riseFt).toBe(6);
    expect(res.geometry.riseInches).toBe(72);
    expect(res.geometry.pitchAngleDegrees).toBeCloseTo(26.57, 1);
    expect(res.geometry.slopeFactor).toBeCloseTo(1.118, 3);

    // Line Length: 144" * 1.11803 = 160.996" -> 161.0"
    expect(res.geometry.rafterLineLengthInches).toBeCloseTo(161.0, 1);
    expect(res.geometry.rafterLineLengthFormatted).toContain("13' 5");

    // Ridge deduction: 0.75" * 1.11803 = 0.84"
    expect(res.geometry.ridgeDeductionInches).toBe(0.84);

    // Overhang: 12" * 1.11803 = 13.42"
    expect(res.geometry.overhangRafterLengthInches).toBe(13.42);

    // Total cut length: 161.0 - 0.84 + 13.42 = 173.58" (14.46 ft)
    expect(res.geometry.totalCutRafterLengthFt).toBeCloseTo(14.47, 1);
    expect(res.recommendedStockLumberFt).toBe(16);

    // Birdsmouth: 3.5" * (6/12) = 1.75" plumb cut
    expect(res.geometry.birdsmouth.seatCutLengthInches).toBe(3.5);
    expect(res.geometry.birdsmouth.plumbCutDepthInches).toBe(1.75);
    expect(res.geometry.birdsmouth.heightAbovePlateInches).toBe(3.75);

    // 2x6 actual depth = 5.5". Max 1/4 notch = 1.375". 1.75" exceeds IRC limit!
    expect(res.ircCompliance.isNotchCompliant).toBe(false);
    expect(res.warnings.some((w) => w.code === "BIRDSMOUTH_NOTCH_EXCEEDS_IRC_LIMIT")).toBe(true);
  });

  it("verifies IRC R802.7.1 notch compliance with 2x8 lumber on 4/12 pitch", () => {
    const input: RafterCalculatorInput = {
      buildingSpanFt: 20,
      pitchIn12: 4,
      eaveOverhangInches: 12,
      ridgeBoardThicknessInches: 1.5,
      rafterDepthNominal: "2x8",
      seatCutBearingInches: 3.5,
    };

    const res = calculateRafterProject(input);

    expect(res.geometry.runFt).toBe(10);
    expect(res.geometry.riseFt).toBeCloseTo(3.33, 1);
    expect(res.geometry.pitchAngleDegrees).toBeCloseTo(18.43, 1);

    // 2x8 actual depth = 7.25". Max notch allowed = 7.25 / 4 = 1.81".
    // Plumb cut = 3.5" * (4/12) = 1.17". 1.17" <= 1.81" -> Compliant!
    expect(res.geometry.birdsmouth.plumbCutDepthInches).toBe(1.17);
    expect(res.ircCompliance.isNotchCompliant).toBe(true);
    expect(res.ircCompliance.isBearingCompliant).toBe(true);
    expect(res.warnings.some((w) => w.code === "BIRDSMOUTH_NOTCH_EXCEEDS_IRC_LIMIT")).toBe(false);
  });

  it("calculates common rafter quantities for 32ft roof length at 16in on center", () => {
    const input: RafterCalculatorInput = {
      buildingSpanFt: 24,
      pitchIn12: 6,
      roofLengthFt: 32,
      rafterSpacingInches: 16,
    };

    const res = calculateRafterProject(input);
    // 32 ft / (16/12 = 1.333 ft) = 24 spaces + 1 = 25 pairs -> 50 rafters
    expect(res.totalRafterPairs).toBe(25);
    expect(res.totalCommonRafters).toBe(50);
  });

  it("handles extreme spans exceeding solid lumber with a warning", () => {
    const input: RafterCalculatorInput = {
      buildingSpanFt: 44,
      pitchIn12: 8,
    };

    const res = calculateRafterProject(input);
    expect(res.geometry.totalCutRafterLengthFt).toBeGreaterThan(24);
    expect(res.warnings.some((w) => w.code === "RAFTER_LENGTH_EXCEEDS_STOCK_LUMBER")).toBe(true);
  });

  it("throws appropriate RangeErrors for invalid parameters", () => {
    expect(() =>
      calculateRafterProject({ buildingSpanFt: 0, pitchIn12: 6 })
    ).toThrow(RangeError);

    expect(() =>
      calculateRafterProject({ buildingSpanFt: 20, pitchIn12: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateRafterProject({ buildingSpanFt: 20, pitchIn12: 40 })
    ).toThrow(RangeError);
  });
});
