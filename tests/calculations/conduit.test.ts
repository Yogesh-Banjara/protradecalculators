import { describe, it, expect } from "vitest";
import {
  calculateConduitFillProject,
  calculateTotalConductorArea,
  evaluateConduitTradeSizes,
  getAllowableFillPercentage,
} from "@/lib/calculations/conduit";
import type { ConductorInputRow, ConduitFillInput } from "@/types/conduit";

describe("Electrical Conduit Fill Calculation Engine (TASK 012 Accuracy Suite)", () => {
  // Test Case 1: Single conductor 53% fill rule (NEC Chapter 9 Table 1)
  it("applies 53% fill limit for single conductor pulls", () => {
    expect(getAllowableFillPercentage(1, false)).toBe(53);

    const input: ConduitFillInput = {
      conduitType: "emt",
      isNippleOrShortRun: false,
      conductors: [{ id: "1", size: "4/0 AWG", insulation: "thhn", count: 1 }],
    };

    const res = calculateConduitFillProject(input);
    expect(res.allowableFillPercentage).toBe(53);
    expect(res.totalConductorCount).toBe(1);
    expect(res.totalConductorAreaSqIn).toBe(0.3237); // 4/0 THHN area = 0.3237 sq in
  });

  // Test Case 2: Two conductors 31% fill rule (NEC Chapter 9 Table 1)
  it("applies 31% fill limit for two conductor pulls", () => {
    expect(getAllowableFillPercentage(2, false)).toBe(31);

    const input: ConduitFillInput = {
      conduitType: "emt",
      isNippleOrShortRun: false,
      conductors: [{ id: "1", size: "1/0 AWG", insulation: "thhn", count: 2 }],
    };

    const res = calculateConduitFillProject(input);
    expect(res.allowableFillPercentage).toBe(31);
    expect(res.totalConductorCount).toBe(2);
    // 2x 1/0 THHN (0.1855 sq in) = 0.371 sq in -> requires 1-1/4" EMT (31% allowable area = 0.464 sq in)
    expect(res.recommendedTradeSize).toBe("1-1/4");
  });

  // Test Case 3: Three or more conductors 40% fill rule (NEC Chapter 9 Table 1)
  it("applies 40% fill limit for 3 or more conductors", () => {
    expect(getAllowableFillPercentage(3, false)).toBe(40);
    expect(getAllowableFillPercentage(6, false)).toBe(40);
  });

  // Test Case 4: 24-inch Nipple 60% fill rule (NEC Chapter 9 Note 4)
  it("applies 60% fill limit for short conduit nipples 24 inches or less", () => {
    expect(getAllowableFillPercentage(4, true)).toBe(60);

    const input: ConduitFillInput = {
      conduitType: "emt",
      isNippleOrShortRun: true,
      conductors: [{ id: "1", size: "12 AWG", insulation: "thhn", count: 9 }],
    };

    const res = calculateConduitFillProject(input);
    expect(res.allowableFillPercentage).toBe(60);
    expect(res.isNipple).toBe(true);
  });

  // Test Case 5: Standard 15A/20A branch circuit: 3x 12 AWG THHN in 1/2" EMT
  it("calculates 3x 12 AWG THHN in 1/2\" EMT accurately", () => {
    const input: ConduitFillInput = {
      conduitType: "emt",
      conductors: [{ id: "1", size: "12 AWG", insulation: "thhn", count: 3 }],
    };

    const res = calculateConduitFillProject(input);
    // 3x 0.0133 sq in = 0.0399 sq in. 1/2" EMT internal area = 0.304 sq in. Actual fill = 13.13% <= 40%
    expect(res.totalConductorAreaSqIn).toBeCloseTo(0.0399, 4);
    expect(res.recommendedTradeSize).toBe("1/2");
    expect(res.actualFillPercentage).toBeCloseTo(13.13, 2);
    expect(res.isCompliant).toBe(true);
  });

  // Test Case 6: 50A EV circuit: 3x 6 AWG THHN + 1x 10 AWG THHN in 3/4" EMT
  it("calculates mixed-gauge 50A EV circuit accurately in 3/4\" EMT", () => {
    const input: ConduitFillInput = {
      conduitType: "emt",
      conductors: [
        { id: "1", size: "6 AWG", insulation: "thhn", count: 3 },
        { id: "2", size: "10 AWG", insulation: "thhn", count: 1 },
      ],
    };

    const res = calculateConduitFillProject(input);
    // Area: 3 * 0.0507 + 0.0211 = 0.1521 + 0.0211 = 0.1732 sq in
    // 1/2" EMT (40% area = 0.122 sq in) -> FAIL
    // 3/4" EMT (40% area = 0.213 sq in) -> PASS (0.1732 / 0.533 = 32.5% fill)
    expect(res.totalConductorAreaSqIn).toBeCloseTo(0.1732, 4);
    expect(res.recommendedTradeSize).toBe("3/4");
    expect(res.actualFillPercentage).toBeCloseTo(32.49, 1);
    expect(res.isCompliant).toBe(true);
  });

  // Test Case 7: 100A subpanel feeder: 3x 1 AWG THHN + 1x 6 AWG THHN in 1-1/4" EMT
  it("calculates 100A subpanel feeder in 1-1/4\" EMT", () => {
    const input: ConduitFillInput = {
      conduitType: "emt",
      conductors: [
        { id: "1", size: "1 AWG", insulation: "thhn", count: 3 },
        { id: "2", size: "6 AWG", insulation: "thhn", count: 1 },
      ],
    };

    const res = calculateConduitFillProject(input);
    // Area: 3 * 0.1562 + 0.0507 = 0.4686 + 0.0507 = 0.5193 sq in
    // 1" EMT (40% area = 0.346) -> FAIL
    // 1-1/4" EMT (40% area = 0.598) -> PASS (0.5193 / 1.496 = 34.71% fill)
    expect(res.totalConductorAreaSqIn).toBeCloseTo(0.5193, 4);
    expect(res.recommendedTradeSize).toBe("1-1/4");
  });

  // Test Case 8: PVC Schedule 80 vs EMT comparison
  it("upsizes conduit trade size for PVC Schedule 80 due to thicker walls", () => {
    const conductors: ConductorInputRow[] = [
      { id: "1", size: "6 AWG", insulation: "thhn", count: 3 },
      { id: "2", size: "10 AWG", insulation: "thhn", count: 1 },
    ]; // Total area = 0.1732 sq in

    const emt = calculateConduitFillProject({ conduitType: "emt", conductors });
    const pvc80 = calculateConduitFillProject({ conduitType: "pvc_sch80", conductors });

    // 3/4" EMT has 0.213 sq in allowable -> 3/4" EMT PASSES
    // 3/4" PVC-80 has 0.164 sq in allowable (< 0.1732) -> requires 1" PVC-80!
    expect(emt.recommendedTradeSize).toBe("3/4");
    expect(pvc80.recommendedTradeSize).toBe("1");
    expect(
      pvc80.warnings.some((w) => w.code === "PVC_SCHEDULE_80_THICK_WALL_NOTICE")
    ).toBe(true);
  });

  // Test Case 9: Jam Ratio Risk Detection for 3 Conductors
  it("detects Jam Ratio risk (2.8 to 3.2) on 3-conductor runs", () => {
    // 3x 1/0 AWG THHN (OD = 0.486 in) in 1-1/4" EMT (ID = 1.380 in):
    // Jam Ratio = 1.380 / 0.486 = 2.84 -> within 2.8 to 3.2 hazard window!
    const { candidates } = evaluateConduitTradeSizes("emt", 0.5565, 3, false, 0.486);
    const candidate1_14 = candidates.find((c) => c.tradeSize === "1-1/4");
    expect(candidate1_14?.hasJamRatioRisk).toBe(true);
    expect(candidate1_14?.jamRatio).toBeCloseTo(2.84, 2);
  });

  // Test Case 10: Mixed Conductor Rows with Bare Copper Ground
  it("accurately calculates area for bare copper ground conductors", () => {
    const { totalAreaSqIn } = calculateTotalConductorArea([
      { id: "1", size: "10 AWG", insulation: "thhn", count: 3 },
      { id: "2", size: "10 AWG", insulation: "bare_copper", count: 1 },
    ]);
    // 3 * 0.0211 (THHN) + 1 * 0.0082 (Bare Copper) = 0.0633 + 0.0082 = 0.0715 sq in
    expect(totalAreaSqIn).toBeCloseTo(0.0715, 4);
  });

  // Test Case 11: Candidate Evaluation Completeness
  it("evaluates all 10 standard trade sizes (1/2\" to 4\")", () => {
    const res = calculateConduitFillProject({
      conduitType: "emt",
      conductors: [{ id: "1", size: "12 AWG", insulation: "thhn", count: 3 }],
    });

    expect(res.candidates.length).toBe(10);
    expect(res.candidates[0].tradeSize).toBe("1/2");
    expect(res.candidates[9].tradeSize).toBe("4");
  });

  // Test Case 12: Invalid Input Rejection
  it("rejects empty or zero conductor inputs with RangeError", () => {
    expect(() =>
      calculateConduitFillProject({ conduitType: "emt", conductors: [] })
    ).toThrow(RangeError);

    expect(() =>
      calculateConduitFillProject({
        conduitType: "emt",
        conductors: [{ id: "1", size: "12 AWG", insulation: "thhn", count: 0 }],
      })
    ).toThrow(RangeError);
  });

  // Test Case 13: Safety & Code Disclaimer is Always Present
  it("always includes NEC conduit fill disclaimer", () => {
    const res = calculateConduitFillProject({
      conduitType: "emt",
      conductors: [{ id: "1", size: "12 AWG", insulation: "thhn", count: 3 }],
    });

    expect(
      res.warnings.some((w) => w.code === "CONDUIT_FILL_CODE_DISCLAIMER")
    ).toBe(true);
  });
});
