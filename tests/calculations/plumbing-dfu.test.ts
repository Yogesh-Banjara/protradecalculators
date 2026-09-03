import { describe, it, expect } from "vitest";
import { calculatePlumbingDfu } from "@/lib/calculations/plumbing-dfu";
import type { FixtureScheduleItem, PlumbingDfuInput } from "@/types/plumbing-dfu";

describe("Plumbing DFU & Drainage Pipe Sizing Engine", () => {
  // 1. Basic Fixture Schedule Calculations
  it("calculates total DFU correctly for single lavatory sink (1 DFU, 1-1/4\" trap)", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "lavatory",
          name: "Lavatory Sink",
          quantity: 1,
          dfuEach: 1.0,
          minTrapSizeInches: "1-1/4",
          isWaterCloset: false,
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalFixtureCount).toBe(1);
    expect(res.totalCalculatedDfu).toBe(1.0);
    expect(res.recommendedPipeSizeInches).toBe("1-1/4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(1);
    expect(res.capacityUtilizationPct).toBe(100);
    expect(res.containsWaterCloset).toBe(false);
  });

  it("calculates multiple fixture quantities and subtotals accurately", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "lavatory",
          name: "Lavatory Sink",
          quantity: 3,
          dfuEach: 1.0,
          minTrapSizeInches: "1-1/4",
          isWaterCloset: false,
        },
        {
          id: "2",
          fixtureId: "bathtub",
          name: "Bathtub",
          quantity: 2,
          dfuEach: 2.0,
          minTrapSizeInches: "1-1/2",
          isWaterCloset: false,
        },
      ],
    };

    // 3*1 + 2*2 = 7 DFU on horizontal branch -> IPC 2" branch max is 6 DFU -> requires 2-1/2" (or 3")
    const res = calculatePlumbingDfu(input);
    expect(res.totalFixtureCount).toBe(5);
    expect(res.totalCalculatedDfu).toBe(7.0);
    expect(res.recommendedPipeSizeInches).toBe("2-1/2");
    expect(res.maxCapacityDfuForSelectedSize).toBe(12);
  });

  // 2. The Mandatory 3-Inch Water Closet Rule
  it("enforces mandatory 3-inch minimum pipe floor for single water closet even though DFU is only 3.0", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "water_closet_16",
          name: "Toilet",
          quantity: 1,
          dfuEach: 3.0,
          minTrapSizeInches: "3",
          isWaterCloset: true,
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(3.0);
    expect(res.containsWaterCloset).toBe(true);
    expect(res.minPermittedPipeSizeInches).toBe("3");
    expect(res.recommendedPipeSizeInches).toBe("3");
  });

  // 3. Horizontal Branch Sizing
  it("sizes horizontal branch correctly per IPC Table 710.1(2)", () => {
    // 2 Toilets (6 DFU) + 2 Lavs (2 DFU) + 1 Tub (2 DFU) + Kitchen (2 DFU) = 12 DFU
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "water_closet_16",
          name: "Toilet",
          quantity: 2,
          dfuEach: 3.0,
          minTrapSizeInches: "3",
          isWaterCloset: true,
        },
        {
          id: "2",
          fixtureId: "lavatory",
          name: "Lavatory",
          quantity: 2,
          dfuEach: 1.0,
          minTrapSizeInches: "1-1/4",
        },
        {
          id: "3",
          fixtureId: "bathtub",
          name: "Bathtub",
          quantity: 1,
          dfuEach: 2.0,
          minTrapSizeInches: "1-1/2",
        },
        {
          id: "4",
          fixtureId: "kitchen_sink",
          name: "Kitchen",
          quantity: 1,
          dfuEach: 2.0,
          minTrapSizeInches: "1-1/2",
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(12.0);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.maxCapacityDfuForSelectedSize).toBe(20);
    expect(res.capacityUtilizationPct).toBe(60.0);
  });

  // 4. Vertical Stack Sizing
  it("sizes vertical drainage stack with higher DFU capacity than horizontal branch", () => {
    // 24 DFU on vertical stack -> in IPC 2" stack carries up to 24 DFU on 3-story stack
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "vertical_stack",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "lavatory",
          name: "Lavatories",
          quantity: 10,
          dfuEach: 1.0,
          minTrapSizeInches: "1-1/4",
        },
        {
          id: "2",
          fixtureId: "bathtub",
          name: "Bathtubs",
          quantity: 7,
          dfuEach: 2.0,
          minTrapSizeInches: "1-1/2",
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(24.0);
    expect(res.recommendedPipeSizeInches).toBe("3"); // In IPC Table 710.1(2), 2-1/2" stack = 20 DFU, 3" stack = 48 DFU
  });

  // 5. Building Drain Sizing with Slope
  it("sizes building drain correctly under 1/4\" slope vs 1/8\" slope", () => {
    const fixtures: FixtureScheduleItem[] = [
      {
        id: "1",
        fixtureId: "water_closet_16",
        name: "Toilet",
        quantity: 6,
        dfuEach: 3.0,
        minTrapSizeInches: "3",
        isWaterCloset: true,
      },
      {
        id: "2",
        fixtureId: "lavatory",
        name: "Lavatory",
        quantity: 6,
        dfuEach: 1.0,
        minTrapSizeInches: "1-1/4",
      },
      {
        id: "3",
        fixtureId: "bathtub",
        name: "Bathtub",
        quantity: 6,
        dfuEach: 2.0,
        minTrapSizeInches: "1-1/2",
      },
      {
        id: "4",
        fixtureId: "kitchen_sink",
        name: "Kitchen",
        quantity: 2,
        dfuEach: 2.0,
        minTrapSizeInches: "1-1/2",
      },
    ]; // Total = 18 + 6 + 12 + 4 = 40 DFU

    // Under IPC 1/4" slope: 3" carries 42 DFU -> 3" pipe is sufficient
    const resQuarter = calculatePlumbingDfu({
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
    });
    expect(resQuarter.totalCalculatedDfu).toBe(40.0);
    expect(resQuarter.recommendedPipeSizeInches).toBe("3");
    expect(resQuarter.maxCapacityDfuForSelectedSize).toBe(42);

    // Under IPC 1/8" slope: 3" carries 36 DFU -> 40 DFU exceeds 36 -> requires 4" pipe
    const resEighth = calculatePlumbingDfu({
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_8",
      fixtures,
    });
    expect(resEighth.recommendedPipeSizeInches).toBe("4");
    expect(resEighth.maxCapacityDfuForSelectedSize).toBe(180);
  });

  // 6. IPC vs UPC Code Standard Differences
  it("correctly handles Clothes Washer rating difference: 2 DFU in IPC vs 3 DFU in UPC", () => {
    const fixturesIpc = [
      {
        id: "1",
        fixtureId: "clothes_washer",
        name: "Clothes Washer",
        quantity: 2,
        dfuEach: 2.0, // IPC rate
        minTrapSizeInches: "2" as const,
      },
    ];
    const fixturesUpc = [
      {
        id: "1",
        fixtureId: "clothes_washer",
        name: "Clothes Washer",
        quantity: 2,
        dfuEach: 3.0, // UPC rate
        minTrapSizeInches: "2" as const,
      },
    ];

    const resIpc = calculatePlumbingDfu({
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: fixturesIpc,
    });
    expect(resIpc.totalCalculatedDfu).toBe(4.0);

    const resUpc = calculatePlumbingDfu({
      codeStandard: "UPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: fixturesUpc,
    });
    expect(resUpc.totalCalculatedDfu).toBe(6.0);
  });

  // 7. Continuous Flow / Pump Discharge (1 GPM = 2 DFU)
  it("adds 2 DFU per 1 GPM for continuous sewage ejector pump flow", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group",
          name: "Bathroom Group",
          quantity: 1,
          dfuEach: 5.0,
          minTrapSizeInches: "3",
          isWaterCloset: true,
        },
      ],
      continuousPumpGpm: 15, // 15 GPM * 2 = 30 DFU
    };

    const res = calculatePlumbingDfu(input);
    expect(res.continuousPumpDfu).toBe(30.0);
    expect(res.totalCalculatedDfu).toBe(35.0); // 5 + 30 = 35 DFU
    expect(res.recommendedPipeSizeInches).toBe("3");
  });

  // 8. Water Closet Limits on 3" Horizontal Branch
  it("upsizes 3\" horizontal branch to 4\" when more than 2 water closets exist under IPC", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [
        {
          id: "1",
          fixtureId: "water_closet_16",
          name: "Toilet",
          quantity: 3, // 3 toilets * 3 DFU = 9 DFU (fits 20 DFU numerical limit, but exceeds 2 WC limit)
          dfuEach: 3.0,
          minTrapSizeInches: "3",
          isWaterCloset: true,
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(9.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.warnings.some((w) => w.code === "IPC_3IN_BRANCH_MAX_2_WC")).toBe(true);
  });

  // 9. Slope Warning for Small Pipes (< 3")
  it("generates warning when 1/8\" slope is selected for small drain pipes (< 3\")", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_8",
      fixtures: [
        {
          id: "1",
          fixtureId: "lavatory",
          name: "Lavatory",
          quantity: 2,
          dfuEach: 1.0,
          minTrapSizeInches: "1-1/4",
        },
      ],
    };

    const res = calculatePlumbingDfu(input);
    expect(res.warnings.some((w) => w.code === "SLOPE_1_8_PROHIBITED_UNDER_3IN")).toBe(true);
  });

  // 10. Empty Schedule Error Handling
  it("throws RangeError if fixture schedule is completely empty with no pump", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures: [],
    };

    expect(() => calculatePlumbingDfu(input)).toThrow(RangeError);
  });

  // =========================================================================
  // INDEPENDENT FIRST-PRINCIPLES BENCHMARK TESTS (Derived without helper calls)
  // =========================================================================

  it("Benchmark 1: Typical 2-Bath Single Family Home (First-Principles derivation)", () => {
    // 2 WCs (6) + 2 Lavs (2) + 1 Tub (2) + 1 Shower (2) + 1 Kitchen (2) + 1 DW (2) + 1 Washer (2) = 18 DFU
    // Building drain @ 1/4" slope: IPC 3" capacity is 42 DFU.
    // Expected: 18 DFU, 3" pipe, 42.9% utilization.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 2, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 2, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
      { id: "3", fixtureId: "bathtub", name: "TUB", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "4", fixtureId: "shower_stall", name: "SHOWER", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "5", fixtureId: "kitchen_sink", name: "KITCHEN", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "6", fixtureId: "dishwasher", name: "DW", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "7", fixtureId: "clothes_washer", name: "WASHER", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalFixtureCount).toBe(9);
    expect(res.totalCalculatedDfu).toBe(18.0);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.maxCapacityDfuForSelectedSize).toBe(42);
    expect(res.capacityUtilizationPct).toBe(42.9);
  });

  it("Benchmark 2: 4-Story Multi-Family Soil Stack (First-Principles derivation)", () => {
    // 8 Toilets (24 DFU) + 8 Lavs (8 DFU) + 8 Tubs (16 DFU) + 4 Kitchens (8 DFU) = 56 DFU
    // In IPC Table 710.1(2), 3" vertical stack limit is 48 DFU.
    // Because 56 DFU > 48 DFU, the engine correctly selects a 4" stack (rated up to 240 DFU).
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 8, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 8, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
      { id: "3", fixtureId: "bathtub", name: "TUB", quantity: 8, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "4", fixtureId: "kitchen_sink", name: "KITCHEN", quantity: 4, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "vertical_stack",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(56.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(240);
    expect(res.capacityUtilizationPct).toBe(23.3);
  });

  it("Benchmark 3: Heavy Commercial Building Drain with 200 DFU", () => {
    // 30 Public WCs (120) + 20 Lavs (20) + 10 Urinals (20) + 2 Mop Sinks (4) + 18 GPM Ejector (36) = 200 DFU
    // Building drain @ 1/4" slope: 4" capacity is 216 DFU.
    // Expected: 200 DFU, 4" pipe, 92.6% utilization with High Capacity Utilization warning.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_public", name: "WC Public", quantity: 30, dfuEach: 4.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 20, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
      { id: "3", fixtureId: "urinal", name: "URINAL", quantity: 10, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "4", fixtureId: "mop_service_sink", name: "MOP", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
      continuousPumpGpm: 18,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(200.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(216);
    expect(res.capacityUtilizationPct).toBe(92.6);
    expect(res.warnings.some((w) => w.code === "HIGH_DFU_CAPACITY_UTILIZATION")).toBe(true);
  });

  it("Benchmark 4: Kitchen Island Branch Drain (No WC, 2\" Trap)", () => {
    // Kitchen sink (2 DFU, 1.5" trap) + Dishwasher (2 DFU, 1.5" trap) = 4 DFU
    // Horizontal branch under IPC: 1-1/2" max is 3 DFU -> 4 DFU requires 2" pipe (max 6 DFU).
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "2", fixtureId: "dishwasher", name: "Dishwasher", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(4.0);
    expect(res.containsWaterCloset).toBe(false);
    expect(res.recommendedPipeSizeInches).toBe("2");
    expect(res.maxCapacityDfuForSelectedSize).toBe(6);
    expect(res.capacityUtilizationPct).toBe(66.7);
  });

  it("Benchmark 5: Large Sewer Main at 1/8\" Slope exceeding 4\" Capacity", () => {
    // 60 WCs (180 DFU) + 60 Lavs (60 DFU) = 240 DFU
    // Building sewer @ 1/8" slope: 4" capacity is 180 DFU -> 240 DFU requires 5" sewer (capacity 390 DFU).
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 60, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 60, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_sewer",
      pipeSlope: "1_8",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(240.0);
    expect(res.recommendedPipeSizeInches).toBe("5");
    expect(res.maxCapacityDfuForSelectedSize).toBe(390);
    expect(res.capacityUtilizationPct).toBe(61.5);
  });

  // 11. UPC Horizontal Branch 3 WC Max Rule
  it("upsizes 3\" horizontal branch to 4\" when more than 3 water closets exist under UPC", () => {
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 4, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "UPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(12.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.warnings.some((w) => w.code === "UPC_3IN_BRANCH_MAX_3_WC")).toBe(true);
  });

  // 12. Bathroom Group Discount (5 DFU)
  it("applies 5 DFU bathroom group package correctly", () => {
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group", name: "Bathroom Group", quantity: 2, dfuEach: 5.0, minTrapSizeInches: "3", isWaterCloset: true },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(10.0);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.containsWaterCloset).toBe(true);
  });

  // 13. Floor Drain Code Difference (0 DFU in IPC vs 2 DFU in UPC)
  it("handles Floor Drain difference: 0 DFU in IPC vs 2 DFU in UPC", () => {
    const fixturesIpc: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "floor_drain", name: "Floor Drain", quantity: 2, dfuEach: 0.0, minTrapSizeInches: "2" },
      { id: "2", fixtureId: "lavatory", name: "Lavatory", quantity: 1, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ];
    const fixturesUpc: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "floor_drain", name: "Floor Drain", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "2", fixtureId: "lavatory", name: "Lavatory", quantity: 1, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ];

    const resIpc = calculatePlumbingDfu({ codeStandard: "IPC", systemType: "horizontal_branch", fixtures: fixturesIpc });
    expect(resIpc.totalCalculatedDfu).toBe(1.0);
    expect(resIpc.minPermittedPipeSizeInches).toBe("2"); // Governed by 2" floor drain trap
    expect(resIpc.recommendedPipeSizeInches).toBe("2");

    const resUpc = calculatePlumbingDfu({ codeStandard: "UPC", systemType: "horizontal_branch", fixtures: fixturesUpc });
    expect(resUpc.totalCalculatedDfu).toBe(5.0);
    expect(resUpc.recommendedPipeSizeInches).toBe("2");
  });

  // 14. Mop Sink Code Difference (2 DFU in IPC vs 3 DFU in UPC)
  it("handles Mop / Service Sink difference: 2 DFU in IPC vs 3 DFU in UPC", () => {
    const fixturesIpc: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "mop_service_sink", name: "Mop Sink", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "2" },
    ];
    const fixturesUpc: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "mop_service_sink", name: "Mop Sink", quantity: 2, dfuEach: 3.0, minTrapSizeInches: "2" },
    ];

    const resIpc = calculatePlumbingDfu({ codeStandard: "IPC", systemType: "horizontal_branch", fixtures: fixturesIpc });
    expect(resIpc.totalCalculatedDfu).toBe(4.0);

    const resUpc = calculatePlumbingDfu({ codeStandard: "UPC", systemType: "horizontal_branch", fixtures: fixturesUpc });
    expect(resUpc.totalCalculatedDfu).toBe(6.0);
  });

  // 15. Large Commercial Sump Pump Discharge
  it("sizes heavy commercial pump discharge accurately", () => {
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "lavatory", name: "Lav", quantity: 2, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ];
    // 50 GPM pump = 100 DFU
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
      continuousPumpGpm: 50,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(102.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(216);
  });

  // 16. UPC Building Drain Slope (1/4" vs 1/2" slope)
  it("sizes UPC building drain with 1/2\" slope accurately", () => {
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 12, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 4, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ]; // 36 + 4 = 40 DFU
    // In UPC building drain: 3" @ 1/4" slope carries 35 DFU (40 > 35 -> requires 4").
    // In UPC building drain: 3" @ 1/2" slope carries 42 DFU (40 <= 42 -> fits 3").
    const resQuarter = calculatePlumbingDfu({ codeStandard: "UPC", systemType: "building_drain", pipeSlope: "1_4", fixtures });
    expect(resQuarter.recommendedPipeSizeInches).toBe("4");

    const resHalf = calculatePlumbingDfu({ codeStandard: "UPC", systemType: "building_drain", pipeSlope: "1_2", fixtures });
    expect(resHalf.recommendedPipeSizeInches).toBe("3");
    expect(resHalf.maxCapacityDfuForSelectedSize).toBe(42);
  });

  // 17. High Capacity Utilization (> 85%) Warning
  it("triggers high capacity utilization warning when load exceeds 85% of pipe rating", () => {
    // 2 WCs (6 DFU) + 6 Tubs (12 DFU) = 18 DFU on horizontal branch (max 20 DFU for 3" in IPC) -> 18/20 = 90%
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 2, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "bathtub", name: "Tub", quantity: 6, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.capacityUtilizationPct).toBe(90.0);
    expect(res.warnings.some((w) => w.code === "HIGH_DFU_CAPACITY_UTILIZATION")).toBe(true);
  });

  // 18. Deterministic Calculation Invariance
  it("produces identical deterministic outputs across repeated invocations", () => {
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures: [
        { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 4, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
        { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 4, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
        { id: "3", fixtureId: "kitchen_sink", name: "KITCHEN", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      ],
    };

    const run1 = calculatePlumbingDfu(input);
    const run2 = calculatePlumbingDfu(input);
    expect(run1).toEqual(run2);
  });

  // 19. Large Luxury Residential Estate Scenario
  it("sizes large luxury residence (5 Baths, 2 Kitchens, 2 Laundries, Pool Shower)", () => {
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 5, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "LAV", quantity: 7, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
      { id: "3", fixtureId: "bathtub", name: "TUB", quantity: 3, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "4", fixtureId: "shower_stall", name: "SHOWER", quantity: 3, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "5", fixtureId: "kitchen_sink", name: "KITCHEN", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "6", fixtureId: "dishwasher", name: "DW", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
      { id: "7", fixtureId: "clothes_washer", name: "WASHER", quantity: 2, dfuEach: 2.0, minTrapSizeInches: "2" },
    ]; // 15 + 7 + 6 + 6 + 4 + 4 + 4 = 46 DFU
    // Building drain @ 1/4" slope: 3" carries 42 DFU -> 46 DFU triggers 4" building drain (capacity 216 DFU).
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalFixtureCount).toBe(24);
    expect(res.totalCalculatedDfu).toBe(46.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(216);
    expect(res.capacityUtilizationPct).toBe(21.3);
  });

  it("Benchmark 6: Single Toilet Branch with 3 DFU enforcing Mandatory 3\" Pipe Floor", () => {
    // 1 WC (3 DFU, 3" min trap). Numerical 3 DFU fits 1-1/2" (3 DFU) or 2" (6 DFU), but WC mandates 3" floor.
    // 3" horizontal branch in IPC carries 20 DFU -> 3/20 = 15.0% utilization.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 1, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(3.0);
    expect(res.containsWaterCloset).toBe(true);
    expect(res.minPermittedPipeSizeInches).toBe("3");
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.maxCapacityDfuForSelectedSize).toBe(20);
    expect(res.capacityUtilizationPct).toBe(15.0);
  });

  it("Benchmark 7: UPC Multi-WC Branch exceeding 3 WC Max Limit (4 WCs = 12 DFU)", () => {
    // 4 WCs (12 DFU). Fits 35 DFU rating of 3" branch, but exceeds UPC 3 WC max limit on 3" branch.
    // Engine must upsize to 4" branch (capacity 216 DFU) and calculate 12/216 = 5.6% utilization.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 4, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "UPC",
      systemType: "horizontal_branch",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(12.0);
    expect(res.recommendedPipeSizeInches).toBe("4");
    expect(res.maxCapacityDfuForSelectedSize).toBe(216);
    expect(res.capacityUtilizationPct).toBe(5.6);
    expect(res.warnings.some((w) => w.code === "UPC_3IN_BRANCH_MAX_3_WC")).toBe(true);
  });

  it("Benchmark 8: Small ADU Sanitary Drain at 1/4\" Slope (1 WC + 1 Lav + 1 Shower + 1 Kitchen = 8 DFU)", () => {
    // 1 WC (3) + 1 Lav (1) + 1 Shower (2) + 1 Kitchen (2) = 8 DFU.
    // Building drain @ 1/4" slope: 3" capacity is 42 DFU -> 8/42 = 19.0% utilization.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 1, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "lavatory", name: "Lav", quantity: 1, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
      { id: "3", fixtureId: "shower_stall", name: "Shower", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "4", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, dfuEach: 2.0, minTrapSizeInches: "1-1/2" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(8.0);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.maxCapacityDfuForSelectedSize).toBe(42);
    expect(res.capacityUtilizationPct).toBe(19.0);
  });

  it("Benchmark 9: Commercial Restroom Soil Stack (6 Public WCs + 4 Urinals + 6 Lavs = 38 DFU)", () => {
    // 6 Public WCs (24) + 4 Urinals (8) + 6 Lavs (6) = 38 DFU.
    // Vertical stack in IPC: 3" carries up to 48 DFU -> 38/48 = 79.2% utilization.
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_public", name: "WC Public", quantity: 6, dfuEach: 4.0, minTrapSizeInches: "3", isWaterCloset: true },
      { id: "2", fixtureId: "urinal", name: "Urinal", quantity: 4, dfuEach: 2.0, minTrapSizeInches: "2" },
      { id: "3", fixtureId: "lavatory", name: "Lav", quantity: 6, dfuEach: 1.0, minTrapSizeInches: "1-1/4" },
    ];
    const input: PlumbingDfuInput = {
      codeStandard: "IPC",
      systemType: "vertical_stack",
      pipeSlope: "1_4",
      fixtures,
    };

    const res = calculatePlumbingDfu(input);
    expect(res.totalCalculatedDfu).toBe(38.0);
    expect(res.recommendedPipeSizeInches).toBe("3");
    expect(res.maxCapacityDfuForSelectedSize).toBe(48);
    expect(res.capacityUtilizationPct).toBe(79.2);
  });

  it("Benchmark 10: Slope Capacity Boundary: Exactly 42 DFU Building Drain under IPC", () => {
    // 14 WCs (42 DFU).
    // IPC Building drain @ 1/4" slope: 3" capacity is exactly 42 DFU -> fits 3" (100% utilization).
    // IPC Building drain @ 1/8" slope: 3" capacity is 36 DFU -> 42 DFU triggers 4" pipe (capacity 180 DFU, 23.3% utilization).
    const fixtures: FixtureScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_16", name: "WC", quantity: 14, dfuEach: 3.0, minTrapSizeInches: "3", isWaterCloset: true },
    ];

    const resQuarter = calculatePlumbingDfu({
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_4",
      fixtures,
    });
    expect(resQuarter.totalCalculatedDfu).toBe(42.0);
    expect(resQuarter.recommendedPipeSizeInches).toBe("3");
    expect(resQuarter.maxCapacityDfuForSelectedSize).toBe(42);
    expect(resQuarter.capacityUtilizationPct).toBe(100.0);

    const resEighth = calculatePlumbingDfu({
      codeStandard: "IPC",
      systemType: "building_drain",
      pipeSlope: "1_8",
      fixtures,
    });
    expect(resEighth.totalCalculatedDfu).toBe(42.0);
    expect(resEighth.recommendedPipeSizeInches).toBe("4");
    expect(resEighth.maxCapacityDfuForSelectedSize).toBe(180);
    expect(resEighth.capacityUtilizationPct).toBe(23.3);
  });
});
