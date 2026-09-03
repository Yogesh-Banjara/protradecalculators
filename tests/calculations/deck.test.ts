import { describe, it, expect } from "vitest";
import {
  calculateDeckConcreteTakeoff,
  calculateDeckFramingTakeoff,
  calculateDeckHardwareTakeoff,
  calculateDeckProject,
  calculateDeckingTakeoff,
} from "@/lib/calculations/deck";
import type { DeckCalculatorInput } from "@/types/deck";

describe("Deck Material & Framing Calculation Engine (TASK 010 Accuracy Suite)", () => {
  // Test Case 1: Standard 20' x 14' rectangular composite deck
  it("calculates 20' x 14' composite deck accurately", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 14,
      boardType: "5/4x6_composite",
      boardStockLengthFt: 16,
      boardOrientation: "perpendicular",
      joistSpacingInches: 16,
      joistLumber: "2x8",
      wastePercent: 10,
    };

    const res = calculateDeckProject(input);
    const { decking, framing, concrete, hardware } = res;

    // Surface area: 20 * 14 = 280 sq ft
    expect(decking.deckSurfaceAreaSqFt).toBe(280);
    // +10% waste = 308 sq ft
    expect(decking.adjustedAreaSqFt).toBe(308);
    // Effective width = 5.5 + 0.1875 = 5.6875" (0.474 ft) -> 14 / 0.474 = 30 rows
    expect(decking.totalBoardRows).toBe(30);
    // Total boards (16' stock): ceil((30 * 20 * 1.10) / 16) = ceil(660 / 16) = 42 boards
    expect(decking.totalStockBoardsRequired).toBe(42);

    // Field joists: ceil(20 * 12 / 16) + 1 = 15 + 1 = 16 joists
    expect(framing.fieldJoistsCount).toBe(16);
    expect(framing.joistStockLengthFt).toBe(14); // 14 ft stock covers 14 ft width

    // Support posts: max(2, ceil(20 / 8) + 1) = 3 + 1 = 4 posts
    expect(framing.supportPostsCount).toBe(4);
    expect(concrete.pierFootingCount).toBe(4);

    // Hardware: 16 joist hangers, 3 boxes hidden clips (280 sq ft / 100)
    expect(hardware.joistHangersCount).toBe(16);
    expect(hardware.hiddenFastenerBoxes).toBe(3);
  });

  // Test Case 2: 12' x 16' wood deck with 2x6 boards
  it("calculates 12' x 16' wood deck accurately", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 16,
      widthFt: 12,
      boardType: "2x6_wood",
      boardStockLengthFt: 16,
      joistSpacingInches: 16,
      wastePercent: 10,
    };

    const res = calculateDeckProject(input);
    expect(res.decking.deckSurfaceAreaSqFt).toBe(192);
    // 16' length matches 16' stock board length exactly
    expect(res.decking.stockLengthFt).toBe(16);
  });

  // Test Case 3: 12" OC vs 16" OC Joist Count Calculation
  it("calculates correct joist counts for 12\" OC vs 16\" OC", () => {
    // 24 ft deck length @ 12" OC -> ceil(24*12/12) + 1 = 25 joists
    const framing12 = calculateDeckFramingTakeoff({
      lengthFt: 24,
      widthFt: 12,
      joistSpacingInches: 12,
    });
    expect(framing12.fieldJoistsCount).toBe(25);

    // 24 ft deck length @ 16" OC -> ceil(24*12/16) + 1 = 18 + 1 = 19 joists
    const framing16 = calculateDeckFramingTakeoff({
      lengthFt: 24,
      widthFt: 12,
      joistSpacingInches: 16,
    });
    expect(framing16.fieldJoistsCount).toBe(19);
  });

  // Test Case 4: Single Picture Frame Border Calculation
  it("calculates single picture frame border linear footage and board deduction", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 14,
      boardType: "5/4x6_composite",
      boardStockLengthFt: 16,
      pictureFrame: "single",
      wastePercent: 10,
    };

    const decking = calculateDeckingTakeoff(input);
    // Border linear feet = 2 * 14 + 20 = 48 linear ft
    expect(decking.pictureFrameLinearFeet).toBe(48);
    // Picture frame boards = ceil(48 / 16) = 3 boards
    expect(decking.pictureFrameBoardCount).toBe(3);
    expect(decking.totalStockBoardsRequired).toBeGreaterThan(decking.fieldBoardCount);
  });

  // Test Case 5: Double Picture Frame Border Calculation
  it("calculates double picture frame border linear footage", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 14,
      boardType: "5/4x6_composite",
      boardStockLengthFt: 16,
      pictureFrame: "double",
      wastePercent: 10,
    };

    const decking = calculateDeckingTakeoff(input);
    // Double border = 2 * 48 = 96 linear ft
    expect(decking.pictureFrameLinearFeet).toBe(96);
    // Picture frame boards = ceil(96 / 16) = 6 boards
    expect(decking.pictureFrameBoardCount).toBe(6);
  });

  // Test Case 6: Diagonal Board Orientation (1.414x Multiplier)
  it("scales surface board linear footage for diagonal 45° installation", () => {
    const perp = calculateDeckingTakeoff({
      lengthFt: 20,
      widthFt: 14,
      boardOrientation: "perpendicular",
      wastePercent: 0,
    });

    const diag = calculateDeckingTakeoff({
      lengthFt: 20,
      widthFt: 14,
      boardOrientation: "diagonal",
      wastePercent: 0,
    });

    expect(diag.totalLinearFeet).toBeGreaterThan(perp.totalLinearFeet);
    expect(diag.totalStockBoardsRequired).toBeGreaterThan(perp.totalStockBoardsRequired);
  });

  // Test Case 7: Concrete Pier Footing Volume & Bag Count
  it("calculates concrete volume and 80lb/60lb bags for 12\" sonotubes", () => {
    // 4 piers, 12" diameter, 36" depth
    const concrete = calculateDeckConcreteTakeoff(4, 12, 36);

    // Radius = 0.5 ft, Depth = 3 ft -> Vol = π * 0.25 * 3 = 2.356 cu ft per pier
    expect(concrete.volumePerPierCuFt).toBeCloseTo(2.356, 2);
    // Total = 4 * 2.356 = 9.42 cu ft -> 9.42 / 27 = 0.35 cu yd
    expect(concrete.totalConcreteVolumeCuYd).toBeCloseTo(0.35, 2);
    // 80lb bags (0.60 cu ft/bag) = ceil(9.42 / 0.60) = 16 bags
    expect(concrete.concreteBags80Lb).toBe(16);
    // 60lb bags (0.45 cu ft/bag) = ceil(9.42 / 0.45) = 21 bags
    expect(concrete.concreteBags60Lb).toBe(21);
  });

  // Test Case 8: IRC Joist Span Warning (Projection Exceeds Clear Span)
  it("generates warning when deck projection exceeds IRC max joist span", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 16, // 16 ft projection
      joistLumber: "2x6", // 2x6 max span is 9.75 ft @ 16" OC
      joistSpacingInches: 16,
    };

    const res = calculateDeckProject(input);
    expect(
      res.warnings.some((w) => w.code === "DECK_JOIST_SPAN_EXCEEDED")
    ).toBe(true);
  });

  // Test Case 9: Composite Decking on 24" OC Joist Spacing Warning
  it("generates warning when composite decking is paired with 24\" OC joists", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 12,
      boardType: "5/4x6_composite",
      joistSpacingInches: 24,
    };

    const res = calculateDeckProject(input);
    expect(
      res.warnings.some((w) => w.code === "COMPOSITE_JOIST_SPACING_TOO_WIDE")
    ).toBe(true);
  });

  // Test Case 10: Diagonal Composite Decking on 16" OC Joist Spacing Warning
  it("generates warning when diagonal composite decking is paired with 16\" OC joists", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 12,
      boardType: "5/4x6_composite",
      boardOrientation: "diagonal",
      joistSpacingInches: 16,
    };

    const res = calculateDeckProject(input);
    expect(
      res.warnings.some((w) => w.code === "DIAGONAL_COMPOSITE_12OC_REQUIRED")
    ).toBe(true);
  });

  // Test Case 11: Hardware Takeoff Schedule
  it("calculates structural hardware items accurately", () => {
    // 280 sq ft, 16 joists, 20 ft ledger, 4 posts, composite
    const hardware = calculateDeckHardwareTakeoff(280, 16, 20, 4, true);

    expect(hardware.joistHangersCount).toBe(16);
    // Ledger lag screws: ceil(20*12/16) * 2 = 15 * 2 = 30 screws
    expect(hardware.ledgerLagScrewsCount).toBe(30);
    expect(hardware.hiddenFastenerBoxes).toBe(3);
    expect(hardware.ledgerFlashingTapeRolls).toBe(1);
  });

  // Test Case 12: Optional Cost Estimation
  it("computes itemized material cost estimate when pricing rates are supplied", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 20,
      widthFt: 14,
      costRates: {
        pricePerDeckBoard: 40.0,
        pricePerJoistBoard: 20.0,
        pricePerBeamBoard: 30.0,
        pricePerPostBoard: 35.0,
        pricePerConcreteBag: 7.0,
        pricePerHardwarePack: 100.0,
      },
    };

    const res = calculateDeckProject(input);
    expect(res.costEstimate).toBeDefined();
    expect(res.costEstimate?.deckingCost).toBeGreaterThan(0);
    expect(res.costEstimate?.framingCost).toBeGreaterThan(0);
    expect(res.costEstimate?.concreteCost).toBeGreaterThan(0);
    expect(res.costEstimate?.totalEstimatedCost).toBeGreaterThan(0);
  });

  // Test Case 13: Waste Percentage Application
  it("applies waste percentage correctly to board quantities", () => {
    const zeroWaste = calculateDeckingTakeoff({
      lengthFt: 20,
      widthFt: 14,
      wastePercent: 0,
    });

    const tenWaste = calculateDeckingTakeoff({
      lengthFt: 20,
      widthFt: 14,
      wastePercent: 10,
    });

    expect(tenWaste.adjustedAreaSqFt).toBe(308);
    expect(zeroWaste.adjustedAreaSqFt).toBe(280);
    expect(tenWaste.totalStockBoardsRequired).toBeGreaterThanOrEqual(
      zeroWaste.totalStockBoardsRequired
    );
  });

  // Test Case 14: Invalid Inputs Rejection
  it("rejects zero or negative dimensions with RangeError", () => {
    expect(() =>
      calculateDeckingTakeoff({ lengthFt: 0, widthFt: 14 })
    ).toThrow(RangeError);

    expect(() =>
      calculateDeckingTakeoff({ lengthFt: 20, widthFt: -5 })
    ).toThrow(RangeError);

    expect(() =>
      calculateDeckProject({ lengthFt: -20, widthFt: 14 })
    ).toThrow(RangeError);
  });

  // Test Case 15: Structural Disclaimer is Always Present
  it("always includes structural deck building code disclaimer", () => {
    const res = calculateDeckProject({ lengthFt: 20, widthFt: 14 });
    expect(
      res.warnings.some((w) => w.code === "STRUCTURAL_DECK_CODE_DISCLAIMER")
    ).toBe(true);
  });

  // Test Case 16: Double Picture Frame Takeoff
  it("computes double picture frame border linear footage and board quantities", () => {
    const input: DeckCalculatorInput = {
      lengthFt: 24,
      widthFt: 16,
      boardType: "5/4x6_composite",
      boardStockLengthFt: 16,
      pictureFrame: "double",
      wastePercent: 10,
    };

    const decking = calculateDeckingTakeoff(input);
    // Double border linear feet = 2 * (2 * 16 + 24) = 2 * 56 = 112 LF
    expect(decking.pictureFrameLinearFeet).toBe(112);
    // Picture frame boards = ceil(112 / 16) = 7 boards
    expect(decking.pictureFrameBoardCount).toBe(7);
    expect(decking.totalStockBoardsRequired).toBeGreaterThan(decking.fieldBoardCount);
  });

  // Test Case 17: Minimal Compact Deck (4' x 4')
  it("handles minimal 4' x 4' landing deck safely", () => {
    const res = calculateDeckProject({ lengthFt: 4, widthFt: 4, joistSpacingInches: 16 });
    expect(res.decking.deckSurfaceAreaSqFt).toBe(16);
    expect(res.framing.fieldJoistsCount).toBe(4); // ceil(4*12/16) + 1 = 3 + 1 = 4
    expect(res.framing.supportPostsCount).toBe(2); // Minimum 2 posts
    expect(res.concrete.pierFootingCount).toBe(2);
  });

  // Test Case 18: 24" OC Joist Spacing with 2x6 Heavy-Duty Wood
  it("handles 24\" OC joists with 2x6 dimensional wood decking", () => {
    const res = calculateDeckProject({
      lengthFt: 20,
      widthFt: 12,
      boardType: "2x6_wood",
      joistSpacingInches: 24,
    });
    // 20 ft @ 24" OC -> ceil(20*12/24) + 1 = 10 + 1 = 11 joists
    expect(res.framing.fieldJoistsCount).toBe(11);
    expect(res.framing.joistSpacingInches).toBe(24);
  });
});
