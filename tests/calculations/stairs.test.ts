import { describe, it, expect } from "vitest";
import {
  calculateRiserAndTreadCounts,
  calculateStairGeometry,
  calculateStairMaterials,
  calculateStairProject,
  evaluateCodeCompliance,
  evaluateHeadroomClearance,
} from "@/lib/calculations/stairs";
import type { StairCalculatorInput } from "@/types/stairs";

describe("Stair Stringer & Riser Calculation Engine (TASK 008 Accuracy Suite)", () => {
  // Test Case 1: Standard 9 ft residential ceiling (108" rise)
  it("calculates 108-inch rise (9 ft ceiling) accurately", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      targetRiserHeightInches: 7.5,
      targetTreadDepthInches: 10.5,
      treadThicknessInches: 1.0,
      finishedFloorLowerInches: 0.75,
      stairWidthInches: 36,
      stringerStock: "2x12",
      wellholeLengthInches: 120,
      codeStandard: "irc",
    };

    const res = calculateStairProject(input);
    const geom = res.geometry;

    // 108 / 7.5 = 14.4 -> 14 risers
    expect(geom.riserCount).toBe(14);
    // Exact riser = 108 / 14 = 7.714 inches
    expect(geom.exactRiserHeightInches).toBeCloseTo(7.714, 3);
    // Treads = 13
    expect(geom.treadCount).toBe(13);
    // Total run = 13 * 10.5 = 136.5 inches
    expect(geom.totalRunInches).toBe(136.5);
    // Incline angle: arctan(7.714 / 10.5) = 36.30°
    expect(geom.stairAngleDegrees).toBeCloseTo(36.3, 1);
    // 2R + T = 2(7.714) + 10.5 = 25.93"
    expect(geom.comfortRuleValueInches).toBeCloseTo(25.93, 2);
  });

  // Test Case 2: Standard 8 ft residential ceiling (96" rise)
  it("calculates 96-inch rise (8 ft ceiling) accurately", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 96,
      targetRiserHeightInches: 7.5,
      targetTreadDepthInches: 10.5,
      stairWidthInches: 36,
    };

    const res = calculateStairProject(input);
    const geom = res.geometry;

    // 96 / 7.5 = 12.8 -> 13 risers
    expect(geom.riserCount).toBe(13);
    // Exact riser = 96 / 13 = 7.385 inches
    expect(geom.exactRiserHeightInches).toBeCloseTo(7.385, 3);
    // Treads = 12
    expect(geom.treadCount).toBe(12);
    // Total run = 12 * 10.5 = 126.0 inches
    expect(geom.totalRunInches).toBe(126.0);
    // 2R + T = 2(7.385) + 10.5 = 25.27"
    expect(geom.comfortRuleValueInches).toBeCloseTo(25.27, 2);
  });

  // Test Case 3: Deck / Porch 5-step stairs (35" rise)
  it("calculates 35-inch rise porch stairs accurately", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 35,
      targetRiserHeightInches: 7.0,
      targetTreadDepthInches: 11.0,
      stairWidthInches: 48,
    };

    const res = calculateStairProject(input);
    const geom = res.geometry;

    // 35 / 7.0 = 5 risers
    expect(geom.riserCount).toBe(5);
    expect(geom.exactRiserHeightInches).toBe(7.0);
    // Treads = 4
    expect(geom.treadCount).toBe(4);
    // Total run = 4 * 11.0 = 44.0 inches
    expect(geom.totalRunInches).toBe(44.0);
    // 2R + T = 2(7.0) + 11.0 = 25.0"
    expect(geom.comfortRuleValueInches).toBe(25.0);
  });

  // Test Case 4: Short 3-step stairs (21" rise)
  it("calculates short 21-inch rise stairs", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 21,
      targetRiserHeightInches: 7.0,
      targetTreadDepthInches: 11.0,
    };

    const res = calculateStairProject(input);
    expect(res.geometry.riserCount).toBe(3);
    expect(res.geometry.exactRiserHeightInches).toBe(7.0);
    expect(res.geometry.treadCount).toBe(2);
    expect(res.geometry.totalRunInches).toBe(22.0);
  });

  // Test Case 5: Bottom riser drop deduction
  it("computes bottom stringer cut (tread thickness minus lower floor finish)", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      treadThicknessInches: 1.0,
      finishedFloorLowerInches: 0.75,
    };

    const geom = calculateStairGeometry(input);
    // Bottom deduction = 1.0 - 0.75 = 0.25 inches
    expect(geom.bottomRiserDeductionInches).toBe(0.25);

    // Thick 2x tread with no finished floor (subfloor only)
    const geom2 = calculateStairGeometry({
      totalRiseInches: 108,
      treadThicknessInches: 1.5,
      finishedFloorLowerInches: 0.0,
    });
    expect(geom2.bottomRiserDeductionInches).toBe(1.5);
  });

  // Test Case 6: Stringer Line Length & Board Selection
  it("calculates stringer hypotenuse length and selects standard stock lumber length", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      targetRiserHeightInches: 7.5,
      targetTreadDepthInches: 10.5,
    };

    const geom = calculateStairGeometry(input);
    // Line length = √(108² + 136.5²) = √(11664 + 18632.25) = √30296.25 = 174.06 inches (14.50 ft)
    expect(geom.stringerLineLengthInches).toBeCloseTo(174.06, 1);
    expect(geom.stringerLineLengthFt).toBeCloseTo(14.5, 1);
    // With 6" margin, requires 16 ft stock board
    expect(geom.stringerMinBoardLengthFt).toBe(16);
  });

  // Test Case 7: Stringer Throat Depth on 2x12 lumber
  it("calculates solid wood throat depth remaining beneath notch", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      targetRiserHeightInches: 7.5,
      targetTreadDepthInches: 10.5,
      stringerStock: "2x12", // 11.25" actual depth
    };

    const geom = calculateStairGeometry(input);
    // Incline angle ~36.3°
    // Throat = 11.25 - 7.714 * cos(36.3°) = 11.25 - 6.216 = 5.03 inches
    expect(geom.stringerThroatDepthInches).toBeCloseTo(5.03, 1);
    expect(geom.stringerThroatDepthInches).toBeGreaterThanOrEqual(3.5);
  });

  // Test Case 8: Headroom clearance evaluation (Passing)
  it("evaluates headroom clearance for generous wellhole opening", () => {
    const clearance = evaluateHeadroomClearance(
      108,  // total rise
      7.714, // riser
      10.5,  // tread
      13,    // tread count
      136.5, // total run
      120,   // wellhole length
      11.25, // upper floor thickness
      1.0    // tread thickness
    );

    // Wellhole header at X = 136.5 - 120 = 16.5 inches (Step 2)
    // Step 1: X = 10.5, Y = 7.714 + 1 = 8.714"
    // Ceiling = 108 - 11.25 = 96.75" -> Clearance = 96.75 - 8.714 = 88.0" (Pass)
    expect(clearance.headroomClearanceInches).toBeGreaterThanOrEqual(80);
  });

  // Test Case 9: Headroom clearance evaluation (Failing)
  it("flags headroom warning when wellhole opening is too small", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      wellholeLengthInches: 60, // Short 5 ft opening
    };

    const res = calculateStairProject(input);
    expect(res.geometry.codeCompliance.isHeadroomCompliant).toBe(false);
    expect(
      res.warnings.some((w) => w.code === "STAIR_HEADROOM_INSUFFICIENT")
    ).toBe(true);
  });

  // Test Case 10: Riser code non-compliance warning (> 7.75" for IRC)
  it("generates warning when riser height exceeds IRC maximum (7.75\")", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108,
      targetRiserHeightInches: 8.5, // Intentionally steep
      codeStandard: "irc",
    };

    const res = calculateStairProject(input);
    // 108 / 8.5 = 12.7 -> 13 risers -> 108 / 13 = 8.308" > 7.75"
    expect(res.geometry.exactRiserHeightInches).toBeCloseTo(8.308, 2);
    expect(res.geometry.codeCompliance.isRiserCompliant).toBe(false);
    expect(
      res.warnings.some((w) => w.code === "STAIR_RISER_EXCEEDS_CODE")
    ).toBe(true);
  });

  // Test Case 11: Tread depth code non-compliance warning (< 10.0" for IRC)
  it("generates warning when tread depth is below IRC minimum (10.0\")", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 96,
      targetTreadDepthInches: 9.0, // Narrow tread
      codeStandard: "irc",
    };

    const res = calculateStairProject(input);
    expect(res.geometry.codeCompliance.isTreadCompliant).toBe(false);
    expect(
      res.warnings.some((w) => w.code === "STAIR_TREAD_BELOW_CODE")
    ).toBe(true);
  });

  // Test Case 12: Commercial / IBC standard compliance (7.0" max riser, 11.0" min tread)
  it("evaluates commercial IBC/ADA compliance standards correctly", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 105,
      targetRiserHeightInches: 7.0, // 15 risers @ 7.0"
      targetTreadDepthInches: 11.0, // 14 treads @ 11.0"
      stairWidthInches: 48,
      codeStandard: "commercial",
    };

    const res = calculateStairProject(input);
    expect(res.geometry.riserCount).toBe(15);
    expect(res.geometry.exactRiserHeightInches).toBe(7.0);
    expect(res.geometry.codeCompliance.isRiserCompliant).toBe(true);
    expect(res.geometry.codeCompliance.isTreadCompliant).toBe(true);
    expect(res.geometry.codeCompliance.isWidthCompliant).toBe(true);
  });

  // Test Case 13: Stringer board count calculation based on stair width
  it("calculates correct number of stringers for 36-inch and 48-inch stair widths", () => {
    // 36" width @ 16" spacing -> ceil(36/16) + 1 = 3 + 1 = 4? 36/16 = 2.25 -> ceil = 3 -> 3+1 = 4 or max(2, ceil(36/16)+1)
    const res36 = calculateStairMaterials(
      calculateStairGeometry({ totalRiseInches: 96 }),
      36,
      16
    );
    expect(res36.materials.stringerBoardCount).toBe(4); // Left, 2 centers, Right (or 16" max spacing ensures <= 12" centers)

    // 48" width @ 16" spacing -> ceil(48/16) + 1 = 3 + 1 = 4 stringers
    const res48 = calculateStairMaterials(
      calculateStairGeometry({ totalRiseInches: 96 }),
      48,
      16
    );
    expect(res48.materials.stringerBoardCount).toBe(4);
  });

  // Test Case 14: Step-by-step layout cut schedule
  it("generates exact step-by-step cumulative cut coordinates", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 21,
      targetRiserHeightInches: 7.0,
      targetTreadDepthInches: 11.0,
    };

    const geom = calculateStairGeometry(input);
    expect(geom.cutSchedule.length).toBe(3);

    // Step 1: Rise 7", Run 11"
    expect(geom.cutSchedule[0].cumulativeRiseInches).toBe(7.0);
    expect(geom.cutSchedule[0].cumulativeRunInches).toBe(11.0);

    // Step 2: Rise 14", Run 22"
    expect(geom.cutSchedule[1].cumulativeRiseInches).toBe(14.0);
    expect(geom.cutSchedule[1].cumulativeRunInches).toBe(22.0);

    // Step 3 (Top landing): Rise 21", Run 22"
    expect(geom.cutSchedule[2].cumulativeRiseInches).toBe(21.0);
    expect(geom.cutSchedule[2].cumulativeRunInches).toBe(22.0);
  });

  // Test Case 15: Optional cost calculation
  it("computes itemized material cost estimate when pricing rates are supplied", () => {
    const input: StairCalculatorInput = {
      totalRiseInches: 108, // 14 risers, 13 treads, 4 stringers
      stairWidthInches: 36,
      costRates: {
        pricePerStringerBoard: 35.0,
        pricePerTreadBoard: 20.0,
        pricePerRiserBoard: 15.0,
        pricePerHangerBracket: 10.0,
      },
    };

    const res = calculateStairProject(input);
    expect(res.costEstimate).toBeDefined();
    // 4 stringers * 35 = 140
    expect(res.costEstimate?.stringersCost).toBe(140);
    // 13 treads * 20 = 260
    expect(res.costEstimate?.treadsCost).toBe(260);
    // 14 risers * 15 = 210
    expect(res.costEstimate?.risersCost).toBe(210);
    // 4 hangers * 10 = 40
    expect(res.costEstimate?.hangersCost).toBe(40);
    expect(res.costEstimate?.totalEstimatedCost).toBe(140 + 260 + 210 + 40);
  });

  // Test Case 16: Invalid inputs rejection
  it("rejects zero or negative dimensions with RangeError", () => {
    expect(() =>
      calculateRiserAndTreadCounts(0, 7.5, 10.5)
    ).toThrow(RangeError);

    expect(() =>
      calculateRiserAndTreadCounts(-50, 7.5, 10.5)
    ).toThrow(RangeError);

    expect(() =>
      calculateRiserAndTreadCounts(108, 0, 10.5)
    ).toThrow(RangeError);

    expect(() =>
      calculateStairProject({ totalRiseInches: 0 })
    ).toThrow(RangeError);
  });

  // Test Case 17: Structural disclaimer is always present
  it("always includes structural stair building code disclaimer", () => {
    const res = calculateStairProject({ totalRiseInches: 96 });
    expect(
      res.warnings.some((w) => w.code === "STRUCTURAL_STAIR_DISCLAIMER")
    ).toBe(true);
  });
});
