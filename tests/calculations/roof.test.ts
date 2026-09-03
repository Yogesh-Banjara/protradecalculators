import { describe, it, expect } from "vitest";
import {
  calculatePitchProperties,
  calculateRafterGeometry,
  calculateRoofMaterials,
  calculateRoofProject,
  formatFeetAndInches,
} from "@/lib/calculations/roof";
import type { RoofCalculatorInput } from "@/types/roof";

describe("Roof Pitch & Rafter Calculation Engine (TASK 006 Accuracy Suite)", () => {
  // Test Case 1: Standard pitch angle conversions
  it("calculates pitch slope angles and grade percentages accurately", () => {
    // 4/12 pitch -> 18.43°, 33.33% grade, 1.0541 multiplier
    const p4 = calculatePitchProperties(4);
    expect(p4.pitchAngleDegrees).toBeCloseTo(18.43, 2);
    expect(p4.gradePercent).toBeCloseTo(33.33, 2);
    expect(p4.slopeFactor).toBeCloseTo(1.0541, 4);

    // 6/12 pitch -> 26.57°, 50.00% grade, 1.1180 multiplier
    const p6 = calculatePitchProperties(6);
    expect(p6.pitchAngleDegrees).toBeCloseTo(26.57, 2);
    expect(p6.gradePercent).toBeCloseTo(50.0, 2);
    expect(p6.slopeFactor).toBeCloseTo(1.1180, 4);

    // 8/12 pitch -> 33.69°, 66.67% grade, 1.2019 multiplier
    const p8 = calculatePitchProperties(8);
    expect(p8.pitchAngleDegrees).toBeCloseTo(33.69, 2);
    expect(p8.slopeFactor).toBeCloseTo(1.2019, 4);

    // 12/12 pitch -> 45.00°, 100.00% grade, 1.4142 multiplier
    const p12 = calculatePitchProperties(12);
    expect(p12.pitchAngleDegrees).toBe(45.0);
    expect(p12.slopeFactor).toBeCloseTo(1.4142, 4);
  });

  // Test Case 2: Common rafter line length (24 ft span, 6/12 pitch)
  it("calculates common rafter line length for 24 ft span at 6/12 pitch", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24, // 12 ft run
      pitchIn12: 6,        // 6 ft rise
      eaveOverhangInches: 12,
      gableOverhangInches: 12,
      ridgeBoardThicknessInches: 1.5,
      rafterDepthNominal: "2x6",
      seatCutBearingInches: 3.5,
      wastePercent: 10,
    };

    const geom = calculateRafterGeometry(input);
    // Run = 12 ft (144 in)
    expect(geom.runFt).toBe(12.0);
    expect(geom.runInches).toBe(144.0);
    // Rise = 6 ft (72 in)
    expect(geom.riseFt).toBe(6.0);
    expect(geom.riseInches).toBe(72.0);
    // Line length = 12 * 1.118034 = 13.416 ft = 161.00 inches
    expect(geom.rafterLineLengthFt).toBeCloseTo(13.416, 2);
    expect(geom.rafterLineLengthInches).toBeCloseTo(161.0, 1);
  });

  // Test Case 3: Overhang and Ridge Deduction
  it("calculates overhang and ridge deduction accurately", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6, // multiplier 1.1180
      eaveOverhangInches: 12,
      ridgeBoardThicknessInches: 1.5,
    };

    const geom = calculateRafterGeometry(input);
    // Overhang: 12 * 1.1180 = 13.42 inches
    expect(geom.overhangRafterLengthInches).toBeCloseTo(13.42, 2);
    // Ridge deduction: (1.5 / 2) * 1.1180 = 0.84 inches
    expect(geom.ridgeDeductionInches).toBeCloseTo(0.84, 2);
    // Total cut inches: 161.00 - 0.84 + 13.42 = 173.58 inches -> 14.465 ft
    expect(geom.totalCutRafterLengthFt).toBeCloseTo(14.465, 2);
  });

  // Test Case 4: Birdsmouth Cut Angles and Geometry
  it("calculates birdsmouth seat and plumb cuts accurately", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6, // 26.57°
      rafterDepthNominal: "2x6", // 5.5" actual depth
      seatCutBearingInches: 3.5,
    };

    const geom = calculateRafterGeometry(input);
    // Plumb cut angle = 26.57°
    expect(geom.cutAngles.plumbCutAngleDegrees).toBeCloseTo(26.57, 2);
    // Seat cut angle = 90 - 26.57 = 63.43°
    expect(geom.cutAngles.seatCutAngleDegrees).toBeCloseTo(63.43, 2);
    // Plumb cut depth = 3.5 * (6/12) = 1.75 inches
    expect(geom.birdsmouth.plumbCutDepthInches).toBe(1.75);
    // HAP = 5.5 - 1.75 = 3.75 inches
    expect(geom.birdsmouth.heightAbovePlateInches).toBe(3.75);
  });

  // Test Case 5: Ridge Height above wall plate
  it("calculates ridge top height above wall plate", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24, // 6 ft rise
      pitchIn12: 6,
      rafterDepthNominal: "2x6",
      seatCutBearingInches: 3.5, // 3.75" HAP = 0.3125 ft
    };

    const geom = calculateRafterGeometry(input);
    // Ridge Height = 6.0 + (3.75 / 12) = 6.31 ft
    expect(geom.ridgeHeightAbovePlateFt).toBeCloseTo(6.31, 2);
  });

  // Test Case 6: Sloped roof surface area and squares
  it("calculates roof surface area and roofing squares accurately", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6, // slope multiplier 1.1180
      eaveOverhangInches: 12,  // +2 ft total width -> 26 ft
      gableOverhangInches: 12, // +2 ft total length -> 38 ft
      wastePercent: 10,
    };

    const materials = calculateRoofMaterials(input, 1.1180);
    // Flat footprint = 38 * 26 = 988 sq ft
    expect(materials.flatFootprintAreaSqFt).toBe(988);
    // Sloped area = 988 * 1.1180 = 1104.58 sq ft
    expect(materials.roofSurfaceAreaSqFt).toBeCloseTo(1104.58, 2);
    // Roofing squares = 1104.58 / 100 = 11.05 SQ
    expect(materials.roofingSquares).toBeCloseTo(11.05, 2);
    // With 10% waste: 1104.58 * 1.10 = 1215.04 sq ft -> 12.15 SQ
    expect(materials.adjustedAreaSqFt).toBeCloseTo(1215.04, 1);
    expect(materials.adjustedSquares).toBeCloseTo(12.15, 2);
  });

  // Test Case 7: Shingle bundles takeoff (3 per square)
  it("calculates shingle bundles required (3 bundles per square)", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6,
      wastePercent: 10,
    };

    const res = calculateRoofProject(input);
    // 12.15 adjusted squares * 3 = 36.45 -> 37 bundles
    expect(res.materials.shingleBundlesCount).toBe(37);
  });

  // Test Case 8: Synthetic underlayment rolls (400 sq ft per roll)
  it("calculates synthetic underlayment rolls", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6,
      wastePercent: 10,
    };

    const res = calculateRoofProject(input);
    // 1215.04 sq ft / 400 = 3.04 -> 4 rolls
    expect(res.materials.underlaymentRollsSynthetic).toBe(4);
  });

  // Test Case 9: Drip edge linear feet (2 eaves + 4 rakes)
  it("calculates perimeter drip edge linear footage and 10 ft pieces", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6,
      eaveOverhangInches: 12,  // 26 ft total width
      gableOverhangInches: 12, // 38 ft total length
    };

    const materials = calculateRoofMaterials(input, 1.1180);
    // Eaves = 2 * 38 = 76 ft
    expect(materials.eavesLengthFt).toBe(76);
    // Rakes = 4 * (13 * 1.1180) = 58.14 ft
    expect(materials.rakesLengthFt).toBeCloseTo(58.14, 1);
    // Drip edge total = 76 + 58.14 = 134.14 linear ft
    expect(materials.dripEdgeLinearFt).toBeCloseTo(134.14, 1);
    // 134.14 / 10 = 13.41 -> 14 pieces (10 ft)
    expect(materials.dripEdgePieces10Ft).toBe(14);
  });

  // Test Case 10: Ridge cap shingles bundles (33 linear ft per bundle)
  it("calculates ridge cap bundles", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6,
      gableOverhangInches: 12, // 38 ft ridge length
    };

    const materials = calculateRoofMaterials(input, 1.1180);
    expect(materials.ridgeLengthFt).toBe(38);
    // 38 / 33 = 1.15 -> 2 bundles
    expect(materials.ridgeCapBundlesCount).toBe(2);
  });

  // Test Case 11: Steep pitch (12/12 pitch)
  it("calculates steep 12/12 pitch roof geometry correctly", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 20,
      buildingWidthFt: 20, // 10 ft run, 10 ft rise
      pitchIn12: 12,
    };

    const res = calculateRoofProject(input);
    expect(res.geometry.pitchAngleDegrees).toBe(45.0);
    expect(res.geometry.slopeFactor).toBeCloseTo(1.4142, 4);
    // Line length = 10 * 1.4142 = 14.142 ft
    expect(res.geometry.rafterLineLengthFt).toBeCloseTo(14.142, 2);
  });

  // Test Case 12: Low slope warning (below 4/12)
  it("generates warning for low slope pitches (< 4/12)", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 20,
      buildingWidthFt: 20,
      pitchIn12: 3, // 3/12 low slope
    };

    const res = calculateRoofProject(input);
    expect(
      res.warnings.some((w) => w.code === "LOW_SLOPE_SHINGLE_LIMITATION")
    ).toBe(true);
  });

  // Test Case 13: Deep birdsmouth notch warning
  it("generates warning when birdsmouth notch depth exceeds 1/3 rafter depth", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 20,
      buildingWidthFt: 20,
      pitchIn12: 10, // 10/12 pitch
      rafterDepthNominal: "2x4", // 3.5" depth
      seatCutBearingInches: 3.5,  // notch = 3.5 * (10/12) = 2.92" > 1.17" (1/3 of 3.5")
    };

    const res = calculateRoofProject(input);
    expect(
      res.warnings.some((w) => w.code === "DEEP_BIRDSMOUTH_NOTCH")
    ).toBe(true);
  });

  // Test Case 14: Structural disclaimer is always present
  it("always includes structural rafter code disclaimer warning", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 20,
      buildingWidthFt: 20,
      pitchIn12: 6,
    };

    const res = calculateRoofProject(input);
    expect(
      res.warnings.some((w) => w.code === "STRUCTURAL_RAFTER_DISCLAIMER")
    ).toBe(true);
  });

  // Test Case 15: Optional cost calculation
  it("computes itemized material cost estimate when pricing rates are supplied", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 36,
      buildingWidthFt: 24,
      pitchIn12: 6,
      wastePercent: 10,
      costRates: {
        pricePerShingleBundle: 40.0,
        pricePerUnderlaymentRoll: 80.0,
        pricePerDripEdgePiece: 10.0,
        pricePerRidgeCapBundle: 50.0,
      },
    };

    const res = calculateRoofProject(input);
    expect(res.costEstimate).toBeDefined();
    // Shingles: 37 bundles * $40 = $1,480
    expect(res.costEstimate?.shinglesCost).toBe(1480);
    // Underlayment: 4 rolls * $80 = $320
    expect(res.costEstimate?.underlaymentCost).toBe(320);
    // Drip Edge: 14 pcs * $10 = $140
    expect(res.costEstimate?.dripEdgeCost).toBe(140);
    // Ridge Cap: 2 bdls * $50 = $100
    expect(res.costEstimate?.ridgeCapCost).toBe(100);
    expect(res.costEstimate?.totalEstimatedCost).toBe(1480 + 320 + 140 + 100);
  });

  // Test Case 16: Invalid inputs rejection
  it("rejects zero or negative dimensions with RangeError", () => {
    expect(() =>
      calculatePitchProperties(0)
    ).toThrow(RangeError);

    expect(() =>
      calculatePitchProperties(-5)
    ).toThrow(RangeError);

    expect(() =>
      calculatePitchProperties(40)
    ).toThrow(RangeError);

    expect(() =>
      calculateRoofProject({
        buildingLengthFt: 0,
        buildingWidthFt: 24,
        pitchIn12: 6,
      })
    ).toThrow(RangeError);

    expect(() =>
      calculateRoofProject({
        buildingLengthFt: 36,
        buildingWidthFt: -10,
        pitchIn12: 6,
      })
    ).toThrow(RangeError);
  });

  // Test Case 17: Format feet and inches helper accuracy
  it("formats decimal inches to clean fractional feet-inches strings", () => {
    // 144 inches = 12 ft
    expect(formatFeetAndInches(144)).toBe("12' 0\"");
    // 161.0 inches = 13' 5"
    expect(formatFeetAndInches(161.0)).toBe("13' 5\"");
    // 161.4375 inches = 13' 5-7/16"
    expect(formatFeetAndInches(161.4375)).toBe("13' 5-7/16\"");
    // 6.5 inches = 6-1/2"
    expect(formatFeetAndInches(6.5)).toBe("6-1/2\"");
  });

  // Test Case 18: Low slope 2/12 pitch properties
  it("calculates 2/12 low slope pitch angle and multiplier correctly", () => {
    const p2 = calculatePitchProperties(2);
    expect(p2.pitchAngleDegrees).toBeCloseTo(9.46, 2);
    expect(p2.gradePercent).toBeCloseTo(16.67, 2);
    expect(p2.slopeFactor).toBeCloseTo(1.0138, 4);
  });

  // Test Case 19: Rafter lumber stock depth variations and HAP calculation
  it("calculates HAP across 2x4, 2x8, 2x10, and 2x12 nominal lumber sizes", () => {
    // 2x8 actual depth = 7.25", 6/12 pitch, 3.5" bearing -> plumb cut = 3.5 * (6/12) = 1.75"
    // HAP = 7.25 - 1.75 = 5.50"
    const geom2x8 = calculateRafterGeometry({
      buildingLengthFt: 30,
      buildingWidthFt: 20,
      pitchIn12: 6,
      rafterDepthNominal: "2x8",
      seatCutBearingInches: 3.5,
    });
    expect(geom2x8.birdsmouth.heightAbovePlateInches).toBe(5.5);

    // 2x10 actual depth = 9.25", HAP = 9.25 - 1.75 = 7.50"
    const geom2x10 = calculateRafterGeometry({
      buildingLengthFt: 30,
      buildingWidthFt: 20,
      pitchIn12: 6,
      rafterDepthNominal: "2x10",
      seatCutBearingInches: 3.5,
    });
    expect(geom2x10.birdsmouth.heightAbovePlateInches).toBe(7.5);
  });

  // Test Case 20: 0% waste net takeoff
  it("computes exact net takeoff without waste when 0% waste is selected", () => {
    const input: RoofCalculatorInput = {
      buildingLengthFt: 24,
      buildingWidthFt: 20,
      pitchIn12: 6, // multiplier 1.1180
      eaveOverhangInches: 0,
      gableOverhangInches: 0,
      wastePercent: 0,
    };
    const res = calculateRoofProject(input);
    expect(res.materials.wasteAreaSqFt).toBe(0);
    expect(res.materials.adjustedAreaSqFt).toBe(res.materials.roofSurfaceAreaSqFt);
  });
});

describe("TASK 036A — Roof Calculation Technical Red-Team Benchmark Suite", () => {
  // Independent Benchmark Matrix: Pitch & Run
  it("independently verifies line lengths across pitch/run matrix", () => {
    // Run 12 ft @ 4/12
    const g1 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 4 });
    expect(g1.runFt).toBe(12.0);
    expect(g1.riseFt).toBe(4.0);
    expect(g1.slopeFactor).toBeCloseTo(1.0541, 4);
    expect(g1.rafterLineLengthFt).toBeCloseTo(12.649, 2);

    // Run 16 ft @ 6/12 (32 ft span)
    const g2 = calculateRafterGeometry({ buildingLengthFt: 40, buildingWidthFt: 32, pitchIn12: 6 });
    expect(g2.runFt).toBe(16.0);
    expect(g2.riseFt).toBe(8.0);
    expect(g2.slopeFactor).toBeCloseTo(1.1180, 4);
    expect(g2.rafterLineLengthFt).toBeCloseTo(17.889, 2);

    // Run 20 ft @ 8/12 (40 ft span)
    const g3 = calculateRafterGeometry({ buildingLengthFt: 50, buildingWidthFt: 40, pitchIn12: 8 });
    expect(g3.runFt).toBe(20.0);
    expect(g3.riseFt).toBeCloseTo(13.33, 2);
    expect(g3.slopeFactor).toBeCloseTo(1.2019, 4);
    expect(g3.rafterLineLengthFt).toBeCloseTo(24.037, 2);

    // Run 12 ft @ 12/12
    const g4 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 12 });
    expect(g4.runFt).toBe(12.0);
    expect(g4.riseFt).toBe(12.0);
    expect(g4.slopeFactor).toBeCloseTo(1.4142, 4);
    expect(g4.rafterLineLengthFt).toBeCloseTo(16.971, 2);
  });

  // Overhang Matrix on 6/12 Pitch
  it("independently verifies overhang projection lengths (0, 6, 12, 24 inches)", () => {
    const p6 = calculatePitchProperties(6); // 1.118034 multiplier

    const g0 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, eaveOverhangInches: 0 });
    expect(g0.overhangRafterLengthInches).toBe(0);

    const g6 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, eaveOverhangInches: 6 });
    expect(g6.overhangRafterLengthInches).toBeCloseTo(6 * p6.slopeFactor, 2);

    const g12 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, eaveOverhangInches: 12 });
    expect(g12.overhangRafterLengthInches).toBeCloseTo(12 * p6.slopeFactor, 2);

    const g24 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, eaveOverhangInches: 24 });
    expect(g24.overhangRafterLengthInches).toBeCloseTo(24 * p6.slopeFactor, 2);
  });

  // Ridge Thickness Deduction Matrix
  it("independently verifies ridge deduction across thickness variations (0, 1.5, 3.5 inches)", () => {
    const p6 = calculatePitchProperties(6);

    const g0 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, ridgeBoardThicknessInches: 0 });
    expect(g0.ridgeDeductionInches).toBe(0);

    const g1_5 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, ridgeBoardThicknessInches: 1.5 });
    expect(g1_5.ridgeDeductionInches).toBeCloseTo(0.75 * p6.slopeFactor, 2);

    const g3_5 = calculateRafterGeometry({ buildingLengthFt: 30, buildingWidthFt: 24, pitchIn12: 6, ridgeBoardThicknessInches: 3.5 });
    expect(g3_5.ridgeDeductionInches).toBeCloseTo(1.75 * p6.slopeFactor, 2);
  });

  // Lumber Depth HAP Matrix on 4/12 Pitch
  it("independently verifies HAP across all 5 standard lumber sizes on 4/12 pitch", () => {
    // 4/12 pitch, 3.5" bearing -> plumb notch = 3.5 * (4/12) = 1.17"
    const sizes = [
      { nominal: "2x4" as const, actual: 3.5, expectedHap: 2.33 },
      { nominal: "2x6" as const, actual: 5.5, expectedHap: 4.33 },
      { nominal: "2x8" as const, actual: 7.25, expectedHap: 6.08 },
      { nominal: "2x10" as const, actual: 9.25, expectedHap: 8.08 },
      { nominal: "2x12" as const, actual: 11.25, expectedHap: 10.08 },
    ];

    for (const item of sizes) {
      const g = calculateRafterGeometry({
        buildingLengthFt: 30,
        buildingWidthFt: 24,
        pitchIn12: 4,
        rafterDepthNominal: item.nominal,
        seatCutBearingInches: 3.5,
      });
      expect(g.birdsmouth.heightAbovePlateInches).toBeCloseTo(item.expectedHap, 2);
    }
  });

  // Boundary Conditions & Extreme Valid Pitches (0.5/12 to 36/12)
  it("computes accurate geometry for boundary pitches (0.5/12 and 36/12)", () => {
    // 0.5/12 pitch: angle = arctan(0.5/12) = 2.39°, slope factor = sqrt(1 + (0.5/12)^2) = 1.000868
    const low = calculatePitchProperties(0.5);
    expect(low.pitchAngleDegrees).toBeCloseTo(2.39, 2);
    expect(low.slopeFactor).toBeCloseTo(1.0009, 4);

    // 36/12 pitch: angle = arctan(36/12) = arctan(3) = 71.57°, slope factor = sqrt(1 + 9) = sqrt(10) = 3.162277
    const high = calculatePitchProperties(36);
    expect(high.pitchAngleDegrees).toBeCloseTo(71.57, 2);
    expect(high.slopeFactor).toBeCloseTo(3.1623, 4);
  });

  // Unit Conversion & Fractional String Display Consistency
  it("formats fractional feet and inches consistently without internal precision loss", () => {
    // Exactly 161 inches -> 13' 5"
    expect(formatFeetAndInches(161)).toBe('13\' 5"');
    // 173.578 inches -> 14' 5-9/16"
    expect(formatFeetAndInches(173.578)).toBe('14\' 5-9/16"');
    // 5.5 inches -> 5-1/2"
    expect(formatFeetAndInches(5.5)).toBe('5-1/2"');
  });
});


