import { describe, it, expect } from "vitest";
import {
  calculateCommonStudCount,
  calculateOpeningFraming,
  calculateWallSection,
  calculateFramingProject,
} from "@/lib/calculations/framing";
import type {
  FramingProjectInput,
  WallOpeningInput,
  WallSectionInput,
} from "@/types/framing";

describe("Wall Framing & Stud Calculation Engine (TASK 004 Accuracy Suite)", () => {
  // Test Case 1: 16" OC standard stud calculation
  it("calculates common studs at 16 inches on center accurately", () => {
    // 16 ft wall = 192 inches -> 192 / 16 = 12 spaces + 1 start = 13 studs
    expect(calculateCommonStudCount(16, 16)).toBe(13);

    // 8 ft wall = 96 inches -> 96 / 16 = 6 spaces + 1 start = 7 studs
    expect(calculateCommonStudCount(8, 16)).toBe(7);

    // 10 ft wall = 120 inches -> 120 / 16 = 7.5 -> 8 spaces + 1 start = 9 studs
    expect(calculateCommonStudCount(10, 16)).toBe(9);
  });

  // Test Case 2: 24" OC stud calculation
  it("calculates common studs at 24 inches on center accurately", () => {
    // 20 ft wall = 240 inches -> 240 / 24 = 10 spaces + 1 start = 11 studs
    expect(calculateCommonStudCount(20, 24)).toBe(11);

    // 10 ft wall = 120 inches -> 120 / 24 = 5 spaces + 1 start = 6 studs
    expect(calculateCommonStudCount(10, 24)).toBe(6);
  });

  // Test Case 3: 12" OC heavy load stud calculation
  it("calculates common studs at 12 inches on center accurately", () => {
    // 10 ft wall = 120 inches -> 120 / 12 = 10 spaces + 1 start = 11 studs
    expect(calculateCommonStudCount(10, 12)).toBe(11);
  });

  // Test Case 4: 19.2" OC modular stud calculation
  it("calculates common studs at 19.2 inches on center accurately", () => {
    // 8 ft wall = 96 inches -> 96 / 19.2 = 5 spaces + 1 start = 6 studs
    expect(calculateCommonStudCount(8, 19.2)).toBe(6);
  });

  // Test Case 5: Exact spacing boundary conditions
  it("handles fractional vs exact boundary lengths correctly", () => {
    // 10.667 ft (128 in) at 16" OC = exactly 8 spaces + 1 = 9 studs
    expect(calculateCommonStudCount(128 / 12, 16)).toBe(9);

    // 10.75 ft (129 in) at 16" OC = 129/16 = 8.0625 -> 9 spaces + 1 = 10 studs
    expect(calculateCommonStudCount(129 / 12, 16)).toBe(10);
  });

  // Test Case 6: Door opening takeoff (King, Jack, Header, Cripples)
  it("calculates door opening framing components accurately", () => {
    const doorOpening: WallOpeningInput = {
      id: "op-door",
      name: "3068 Entry Door",
      type: "door",
      widthFt: 3.0,
      heightFt: 6.833,
      count: 1,
      headerLumberSize: "2x10",
    };

    const res = calculateOpeningFraming(doorOpening, 8, 16, "2x4");
    // 1 door -> 2 King studs, 2 Jack studs
    expect(res.kingStuds).toBe(2);
    expect(res.jackStuds).toBe(2);
    // Header length = 3.0 + 0.5 (bearing) = 3.5 ft. 2x4 wall -> 2 plies = 7.0 linear ft
    expect(res.headerLinearFt).toBe(7.0);
    expect(res.headerPieceCount).toBe(2);
    // 3 ft width = 36 inches -> 36 / 16 = 2 top cripples
    expect(res.crippleStudsTop).toBe(2);
    expect(res.crippleStudsBottom).toBe(0); // No bottom cripples for doors
  });

  // Test Case 7: Window opening takeoff (King, Jack, Header, Sill, Top & Bottom Cripples)
  it("calculates window opening framing components accurately", () => {
    const windowOpening: WallOpeningInput = {
      id: "op-win",
      name: "3050 Window",
      type: "window",
      widthFt: 3.0,
      heightFt: 5.0,
      count: 1,
      headerLumberSize: "2x8",
    };

    const res = calculateOpeningFraming(windowOpening, 8, 16, "2x6");
    expect(res.kingStuds).toBe(2);
    expect(res.jackStuds).toBe(2);
    // 2x6 wall -> 3-ply header -> 3.5 ft * 3 = 10.5 linear ft
    expect(res.headerLinearFt).toBe(10.5);
    expect(res.headerPieceCount).toBe(3);
    // Cripples: 36 in / 16 in = 2 top cripples and 2 bottom cripples
    expect(res.crippleStudsTop).toBe(2);
    expect(res.crippleStudsBottom).toBe(2);
    expect(res.sillPlatesLinearFt).toBe(3.0);
  });

  // Test Case 8: Wide opening (> 6 ft) doubling jack studs
  it("assigns 4 jack studs for openings 6 ft or wider", () => {
    const patioDoor: WallOpeningInput = {
      id: "op-wide",
      name: "6068 French Door",
      type: "door",
      widthFt: 6.0,
      heightFt: 6.833,
      count: 1,
    };

    const res = calculateOpeningFraming(patioDoor, 8, 16, "2x4");
    expect(res.kingStuds).toBe(2);
    expect(res.jackStuds).toBe(4); // 4 jack studs for >= 6ft span
  });

  // Test Case 9: Wall section with corners, double top plate, and openings
  it("calculates full wall section takeoff accurately", () => {
    const wall: WallSectionInput = {
      id: "w1",
      name: "North Wall",
      lengthFt: 20,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 2, // 2 corners -> 4 studs
      intersectionCount: 1, // 1 T-wall -> 2 studs
      openings: [
        {
          id: "op1",
          name: "Window",
          type: "window",
          widthFt: 3.0,
          heightFt: 4.0,
          count: 1,
          headerLumberSize: "2x8",
        },
      ],
    };

    const res = calculateWallSection(wall, 16);
    // Common: 20 ft (240 in) @ 16" OC = 15 spaces + 1 = 16 common studs
    expect(res.commonStuds).toBe(16);
    expect(res.cornerStuds).toBe(4);
    expect(res.intersectionStuds).toBe(2);
    // Opening: 2 king + 2 jack + 2 top cripple + 2 bottom cripple = 8 opening studs
    expect(res.kingStuds + res.jackStuds + res.crippleStuds).toBe(8);
    // Total studs = 16 + 4 + 2 + 8 = 30 studs
    expect(res.totalStuds).toBe(30);

    // Double top plate + 1 bottom plate = 3 plate rows
    // Plate linear ft = 20 ft * 3 = 60 ft
    expect(res.plateLinearFt).toBe(60);
    // 20 ft / 16 ft stock = 2 boards per row * 3 rows = 6 stock plate boards
    expect(res.totalPlateBoards).toBe(6);
  });

  // Test Case 10: Single top plate vs Double top plate
  it("adjusts plate count between single and double top plate", () => {
    const doubleTopWall: WallSectionInput = {
      id: "w-dbl",
      name: "Double",
      lengthFt: 16,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    };

    const singleTopWall: WallSectionInput = {
      id: "w-sgl",
      name: "Single",
      lengthFt: 16,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: false,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    };

    const resDbl = calculateWallSection(doubleTopWall, 16);
    const resSgl = calculateWallSection(singleTopWall, 16);

    expect(resDbl.plateLinearFt).toBe(48); // 16 * 3
    expect(resDbl.totalPlateBoards).toBe(3);

    expect(resSgl.plateLinearFt).toBe(32); // 16 * 2
    expect(resSgl.totalPlateBoards).toBe(2);
  });

  // Test Case 11: Multi-wall project aggregation
  it("aggregates multiple wall runs with waste factor correctly", () => {
    const wallA: WallSectionInput = {
      id: "w-a",
      name: "Wall A",
      lengthFt: 20,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 2,
      intersectionCount: 0,
      openings: [],
    }; // 16 common + 4 corner = 20 studs, 6 plates

    const wallB: WallSectionInput = {
      id: "w-b",
      name: "Wall B",
      lengthFt: 16,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 2,
      intersectionCount: 0,
      openings: [],
    }; // 13 common + 4 corner = 17 studs, 3 plates

    const project: FramingProjectInput = {
      walls: [wallA, wallB],
      wastePercent: 10,
      stockPlateLengthFt: 16,
    };

    const res = calculateFramingProject(project);
    expect(res.walls.length).toBe(2);
    expect(res.netStuds).toBe(37);
    // 37 * 10% = 3.7 -> 4 waste studs -> 41 total studs
    expect(res.wasteStuds).toBe(4);
    expect(res.totalStudsWithWaste).toBe(41);
    expect(res.totalPlateBoards).toBe(9); // 6 + 3
  });

  // Test Case 12: Board-Foot (BF) calculation accuracy
  it("computes board feet accurately for 2x4 and 2x6 framing", () => {
    const wall2x4: WallSectionInput = {
      id: "w-bf",
      name: "BF Test",
      lengthFt: 10,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: false,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    }; // 9 studs * 8 ft = 72 linear ft studs + 20 linear ft plates = 92 linear ft
    // 2x4 BF = 92 * (2*4/12) = 92 * 0.6667 = 61.33 BF

    const res = calculateWallSection(wall2x4, 10);
    expect(res.totalLinearFt).toBe(92);
    expect(res.boardFeet).toBeCloseTo(61.33, 1);
  });

  // Test Case 13: Optional cost estimation
  it("calculates material cost breakdown when cost rates are supplied", () => {
    const wall: WallSectionInput = {
      id: "w-cost",
      name: "Cost Wall",
      lengthFt: 16,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [
        {
          id: "op-c",
          name: "Window",
          type: "window",
          widthFt: 3.0,
          heightFt: 4.0,
          count: 1,
        },
      ],
    };

    const project: FramingProjectInput = {
      walls: [wall],
      wastePercent: 10,
      stockPlateLengthFt: 16,
      costRates: {
        pricePerStud: 5.0,
        pricePerPlateBoard: 10.0,
        pricePerHeaderPiece: 15.0,
      },
    };

    const res = calculateFramingProject(project);
    expect(res.costEstimate).toBeDefined();
    // Verify math
    const studsExpected = res.totalStudsWithWaste * 5.0;
    const platesExpected = res.totalPlateBoards * 10.0;
    const headersExpected = res.headerPieces * 15.0;
    expect(res.costEstimate?.studsCost).toBe(studsExpected);
    expect(res.costEstimate?.platesCost).toBe(platesExpected);
    expect(res.costEstimate?.headersCost).toBe(headersExpected);
    expect(res.costEstimate?.totalEstimatedCost).toBe(
      studsExpected + platesExpected + headersExpected
    );
  });

  // Test Case 14: Invalid dimensions rejection (Zero and Negative values)
  it("rejects zero or negative dimensions with RangeError", () => {
    const zeroLenWall: WallSectionInput = {
      id: "w-bad",
      name: "Zero Length",
      lengthFt: 0,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    };
    expect(() => calculateWallSection(zeroLenWall)).toThrow(RangeError);

    const negHeightWall: WallSectionInput = {
      id: "w-bad2",
      name: "Negative Height",
      lengthFt: 10,
      heightFt: -8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    };
    expect(() => calculateWallSection(negHeightWall)).toThrow(RangeError);
  });

  // Test Case 15: Warning generated when opening meets or exceeds wall length
  it("generates warning when openings meet or exceed wall length", () => {
    const smallWall: WallSectionInput = {
      id: "w-small",
      name: "Short Wall with Big Door",
      lengthFt: 4,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [
        {
          id: "op-huge",
          name: "Large Door",
          type: "door",
          widthFt: 4.5,
          heightFt: 7.0,
          count: 1,
        },
      ],
    };

    const project: FramingProjectInput = {
      walls: [smallWall],
      wastePercent: 10,
    };

    const res = calculateFramingProject(project);
    expect(res.warnings.some((w) => w.code === "OPENINGS_EXCEED_WALL")).toBe(true);
  });

  // Test Case 16: Structural header sizing disclaimer is always included
  it("always includes structural header code disclaimer warning", () => {
    const wall: WallSectionInput = {
      id: "w-disc",
      name: "Disclaimer Test",
      lengthFt: 10,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 0,
      intersectionCount: 0,
      openings: [],
    };

    const res = calculateFramingProject({
      walls: [wall],
      wastePercent: 10,
    });

    expect(
      res.warnings.some((w) => w.code === "STRUCTURAL_HEADER_DISCLAIMER")
    ).toBe(true);
  });
});
