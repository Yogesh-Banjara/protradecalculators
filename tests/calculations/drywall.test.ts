import { describe, it, expect } from "vitest";
import {
  calculateOpeningArea,
  calculateRoomDrywall,
  calculateDrywallProject,
} from "@/lib/calculations/drywall";
import type {
  DrywallOpeningInput,
  DrywallProjectInput,
  DrywallRoomInput,
} from "@/types/drywall";

describe("Drywall & Sheet Goods Calculation Engine (TASK 005 Accuracy Suite)", () => {
  // Test Case 1: Single wall section (8 ft height × 10 ft width)
  it("calculates single wall section area accurately", () => {
    const room: DrywallRoomInput = {
      id: "r1",
      name: "Single Wall",
      lengthFt: 10,
      widthFt: 0, // When modeling a single wall length, perimeter formula handles rooms, but let's test straight room
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [],
    };
    // Gross walls for length 10, width 0 = 2 * (10 + 0) * 8 = 160 sq ft (two 10x8 faces)
    const res = calculateRoomDrywall({
      ...room,
      widthFt: 5,
    });
    // 2 * (10 + 5) * 8 = 240 sq ft
    expect(res.grossWallAreaSqFt).toBe(240);
    expect(res.netAreaSqFt).toBe(240);
  });

  // Test Case 2: Multiple walls (4 perimeter walls in a 12x10 room with 8 ft ceiling)
  it("calculates 4 perimeter walls in a 12x10 room accurately", () => {
    const room: DrywallRoomInput = {
      id: "r-box",
      name: "Standard Box",
      lengthFt: 12,
      widthFt: 10,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [],
    };

    const res = calculateRoomDrywall(room);
    // Perimeter = 2 * (12 + 10) = 44 ft * 8 ft = 352 sq ft
    expect(res.grossWallAreaSqFt).toBe(352);
    expect(res.ceilingAreaSqFt).toBe(0);
    expect(res.netAreaSqFt).toBe(352);
  });

  // Test Case 3: Door opening deduction
  it("deducts standard 3068 entry door opening accurately", () => {
    const door: DrywallOpeningInput = {
      id: "op-door",
      name: "3068 Door",
      type: "door",
      widthFt: 3.0,
      heightFt: 6.833,
      count: 1,
    };

    const opRes = calculateOpeningArea(door);
    // 3.0 * 6.833 = 20.50 sq ft
    expect(opRes.totalAreaSqFt).toBeCloseTo(20.5, 1);

    const room: DrywallRoomInput = {
      id: "r-door",
      name: "Room with Door",
      lengthFt: 10,
      widthFt: 10,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [door],
    };

    const res = calculateRoomDrywall(room);
    // Gross walls = 2 * (10 + 10) * 8 = 320 sq ft
    // Net = 320 - 20.50 = 299.50 sq ft
    expect(res.netAreaSqFt).toBeCloseTo(299.5, 1);
  });

  // Test Case 4: Window opening deduction
  it("deducts standard window opening accurately", () => {
    const windowOp: DrywallOpeningInput = {
      id: "op-win",
      name: "3040 Window",
      type: "window",
      widthFt: 3.0,
      heightFt: 4.0,
      count: 1,
    };

    const opRes = calculateOpeningArea(windowOp);
    expect(opRes.totalAreaSqFt).toBe(12.0);
  });

  // Test Case 5: Multiple openings in a single room
  it("deducts multiple doors and windows accurately", () => {
    const room: DrywallRoomInput = {
      id: "r-multi-op",
      name: "Room Multi Openings",
      lengthFt: 16,
      widthFt: 12,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [
        {
          id: "d1",
          name: "Entry Door",
          type: "door",
          widthFt: 3.0,
          heightFt: 7.0,
          count: 1, // 21 sq ft
        },
        {
          id: "w1",
          name: "Windows",
          type: "window",
          widthFt: 3.0,
          heightFt: 5.0,
          count: 2, // 30 sq ft
        },
      ],
    };

    const res = calculateRoomDrywall(room);
    // Gross: 2 * (16 + 12) * 8 = 448 sq ft
    // Openings: 21 + 30 = 51 sq ft
    // Net: 448 - 51 = 397 sq ft
    expect(res.grossWallAreaSqFt).toBe(448);
    expect(res.openingsAreaSqFt).toBe(51);
    expect(res.netAreaSqFt).toBe(397);
  });

  // Test Case 6: Ceiling calculation
  it("calculates ceiling square footage when toggled", () => {
    const room: DrywallRoomInput = {
      id: "r-ceiling",
      name: "Ceiling Only",
      lengthFt: 20,
      widthFt: 15,
      heightFt: 8,
      includeWalls: false,
      includeCeiling: true,
      openings: [],
    };

    const res = calculateRoomDrywall(room);
    expect(res.grossWallAreaSqFt).toBe(0);
    expect(res.ceilingAreaSqFt).toBe(300); // 20 * 15
    expect(res.netAreaSqFt).toBe(300);
  });

  // Test Case 7: 4x8 sheet sizing (32 sq ft/sheet)
  it("calculates 4x8 sheet requirements with rounding", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8", // 32 sq ft
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    expect(res.sheetAreaSqFt).toBe(32);
    expect(res.netAreaSqFt).toBe(320);
    expect(res.exactSheets).toBe(10.0);
    expect(res.sheetsRequired).toBe(10);
  });

  // Test Case 8: 4x10 sheet sizing (40 sq ft/sheet)
  it("calculates 4x10 sheet requirements", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x10", // 40 sq ft
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    expect(res.sheetAreaSqFt).toBe(40);
    expect(res.exactSheets).toBe(8.0);
    expect(res.sheetsRequired).toBe(8);
  });

  // Test Case 9: 4x12 sheet sizing (48 sq ft/sheet)
  it("calculates 4x12 sheet requirements", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x12", // 48 sq ft
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    expect(res.sheetAreaSqFt).toBe(48);
    // 320 / 48 = 6.67 -> 7 sheets
    expect(res.exactSheets).toBeCloseTo(6.67, 2);
    expect(res.sheetsRequired).toBe(7);
  });

  // Test Case 10: 1/2-inch drywall specification
  it("supports 1/2-inch drywall specification", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ],
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    expect(res.thickness).toBe("1/2");
  });

  // Test Case 11: 5/8-inch drywall specification
  it("supports 5/8-inch Type X drywall specification", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r-garage",
          name: "Garage Firewall",
          lengthFt: 20,
          widthFt: 20,
          heightFt: 9,
          includeWalls: true,
          includeCeiling: true,
          openings: [],
        },
      ],
      sheetSize: "4x8",
      thickness: "5/8",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    expect(res.thickness).toBe("5/8");
  });

  // Test Case 12: 0% waste
  it("calculates exact minimum with 0% waste", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ],
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    expect(res.wasteAreaSqFt).toBe(0);
    expect(res.adjustedAreaSqFt).toBe(320);
  });

  // Test Case 13: 5% waste
  it("applies 5% waste accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 5,
    };

    const res = calculateDrywallProject(project);
    // 320 * 0.05 = 16 sq ft waste -> 336 sq ft adjusted
    expect(res.wasteAreaSqFt).toBe(16);
    expect(res.adjustedAreaSqFt).toBe(336);
    // 336 / 32 = 10.5 -> 11 sheets
    expect(res.sheetsRequired).toBe(11);
  });

  // Test Case 14: 10% waste
  it("applies standard 10% waste accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    // 320 * 0.10 = 32 sq ft waste -> 352 sq ft adjusted
    expect(res.wasteAreaSqFt).toBe(32);
    expect(res.adjustedAreaSqFt).toBe(352);
    // 352 / 32 = 11 sheets
    expect(res.sheetsRequired).toBe(11);
  });

  // Test Case 15: 15% waste
  it("applies 15% waste accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 15,
    };

    const res = calculateDrywallProject(project);
    // 320 * 0.15 = 48 sq ft waste -> 368 sq ft adjusted
    expect(res.wasteAreaSqFt).toBe(48);
    expect(res.adjustedAreaSqFt).toBe(368);
    // 368 / 32 = 11.5 -> 12 sheets
    expect(res.sheetsRequired).toBe(12);
  });

  // Test Case 16: Custom waste (e.g. 12%)
  it("applies custom waste percentage accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 12,
    };

    const res = calculateDrywallProject(project);
    // 320 * 0.12 = 38.4 sq ft waste -> 358.4 sq ft adjusted
    expect(res.wasteAreaSqFt).toBe(38.4);
    expect(res.adjustedAreaSqFt).toBe(358.4);
    // 358.4 / 32 = 11.2 -> 12 sheets
    expect(res.sheetsRequired).toBe(12);
  });

  // Test Case 17: Multiple rooms aggregation
  it("aggregates multiple rooms with walls, ceilings, and openings", () => {
    const livingRoom: DrywallRoomInput = {
      id: "r-living",
      name: "Living Room",
      lengthFt: 20,
      widthFt: 15,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: true,
      openings: [
        {
          id: "d1",
          name: "Door",
          type: "door",
          widthFt: 3,
          heightFt: 7,
          count: 1,
        }, // 21 sq ft
      ],
    }; // Walls: 2*(20+15)*8 = 560; Ceiling: 300; Gross: 860; Net: 839 sq ft

    const bedroom: DrywallRoomInput = {
      id: "r-bed",
      name: "Bedroom",
      lengthFt: 12,
      widthFt: 10,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: true,
      openings: [],
    }; // Walls: 2*(12+10)*8 = 352; Ceiling: 120; Gross/Net: 472 sq ft

    const project: DrywallProjectInput = {
      rooms: [livingRoom, bedroom],
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    expect(res.rooms.length).toBe(2);
    // Total Net: 839 + 472 = 1311 sq ft
    expect(res.netAreaSqFt).toBe(1311);
    // Adjusted (+10%): 1311 * 1.10 = 1442.10 sq ft
    expect(res.adjustedAreaSqFt).toBeCloseTo(1442.1, 1);
    // Sheets: 1442.1 / 32 = 45.06 -> 46 sheets
    expect(res.sheetsRequired).toBe(46);
  });

  // Test Case 18: Zero/negative dimensions rejection
  it("rejects zero or negative room dimensions with RangeError", () => {
    const badRoom: DrywallRoomInput = {
      id: "r-bad",
      name: "Bad Room",
      lengthFt: 0,
      widthFt: 10,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [],
    };
    expect(() => calculateRoomDrywall(badRoom)).toThrow(RangeError);

    const badOpening: DrywallOpeningInput = {
      id: "op-bad",
      name: "Bad Op",
      type: "door",
      widthFt: -3,
      heightFt: 7,
      count: 1,
    };
    expect(() => calculateOpeningArea(badOpening)).toThrow(RangeError);
  });

  // Test Case 19: Opening larger than wall warning
  it("generates warning when opening deduction meets or exceeds wall area", () => {
    const smallRoom: DrywallRoomInput = {
      id: "r-small",
      name: "Tiny Closet with Huge Door",
      lengthFt: 3,
      widthFt: 3,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: false,
      openings: [
        {
          id: "op-huge",
          name: "Massive Opening",
          type: "door",
          widthFt: 10,
          heightFt: 10,
          count: 1, // 100 sq ft
        },
      ],
    }; // Walls: 2*(3+3)*8 = 96 sq ft. Opening: 100 sq ft

    const project: DrywallProjectInput = {
      rooms: [smallRoom],
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    expect(res.warnings.some((w) => w.code === "OPENINGS_EXCEED_WALLS")).toBe(true);
  });

  // Test Case 20: Correct rounding of fractional sheets
  it("rounds up fractional sheets to the nearest whole sheet", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Small Patch",
          lengthFt: 5,
          widthFt: 5,
          heightFt: 8,
          includeWalls: false,
          includeCeiling: true,
          openings: [],
        },
      ], // 25 sq ft
      sheetSize: "4x8", // 32 sq ft
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    expect(res.exactSheets).toBeCloseTo(0.78, 2);
    expect(res.sheetsRequired).toBe(1);
  });

  // Test Case 21: Joint tape calculation
  it("calculates joint tape linear feet and roll requirements accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft -> with 0% waste = 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    // 320 sq ft * 0.053 ft/sq ft = 16.96 -> 17.0 linear ft
    expect(res.accessories.jointTapeLinearFt).toBe(17.0);
    expect(res.accessories.tapeRolls500Ft).toBe(1);
    expect(res.accessories.tapeRolls250Ft).toBe(1);
  });

  // Test Case 22: Joint compound / mud calculation
  it("calculates joint compound gallons and 4.5-gallon buckets accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 15,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 2*(15+10)*8 = 400 sq ft -> with 0% waste = 400 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    // 400 sq ft * 0.053 gal/sq ft = 21.2 gal
    expect(res.accessories.jointCompoundGallons).toBe(21.2);
    // 21.2 / 4.5 = 4.71 -> 5 buckets
    expect(res.accessories.compoundBuckets4_5Gal).toBe(5);
  });

  // Test Case 23: Drywall screws calculation
  it("calculates drywall screws count, pounds, and 5 lb boxes accurately", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 0,
    };

    const res = calculateDrywallProject(project);
    // 320 sq ft * 1.0 = 320 screws
    expect(res.accessories.drywallScrewsCount).toBe(320);
    // 320 / 300 = 1.06 -> 2 lbs
    expect(res.accessories.screwPounds).toBe(2);
    // 320 / 1500 = 1 box (5 lb)
    expect(res.accessories.screwBoxes5Lb).toBe(1);
  });

  // Test Case 24: Optional cost calculation
  it("computes itemized material cost estimate when pricing rates are provided", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Room",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ], // 320 sq ft -> 10 sheets
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 0,
      costRates: {
        pricePerSheet: 15.0,
        pricePerTapeRoll: 8.0,
        pricePerCompoundBucket: 20.0,
        pricePerScrewBox: 12.0,
      },
    };

    const res = calculateDrywallProject(project);
    expect(res.costEstimate).toBeDefined();
    // 10 sheets * 15 = 150
    expect(res.costEstimate?.sheetsCost).toBe(150);
    // 1 tape roll * 8 = 8
    expect(res.costEstimate?.tapeCost).toBe(8);
    // 4 buckets * 20 = 80 (320 * 0.053 = 16.96 gal / 4.5 = 3.76 -> 4 buckets)
    expect(res.costEstimate?.compoundCost).toBe(80);
    // 1 screw box * 12 = 12
    expect(res.costEstimate?.screwsCost).toBe(12);
    expect(res.costEstimate?.totalEstimatedCost).toBe(150 + 8 + 80 + 12);
  });

  // Test Case 25: Domain & safety disclaimer warning is always included
  it("always includes material estimate code disclaimer warning", () => {
    const project: DrywallProjectInput = {
      rooms: [
        {
          id: "r1",
          name: "Disclaimer Test",
          lengthFt: 10,
          widthFt: 10,
          heightFt: 8,
          includeWalls: true,
          includeCeiling: false,
          openings: [],
        },
      ],
      sheetSize: "4x8",
      thickness: "1/2",
      wastePercent: 10,
    };

    const res = calculateDrywallProject(project);
    expect(
      res.warnings.some((w) => w.code === "MATERIAL_ESTIMATE_DISCLAIMER")
    ).toBe(true);
  });
});
