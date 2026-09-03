import { describe, it, expect } from "vitest";
import { calculatePlumbingWsfu } from "@/lib/calculations/wsfu";
import type { PlumbingWsfuInput, WsfuScheduleItem } from "@/types/plumbing-wsfu";

describe("Water Supply Fixture Unit (WSFU) & Potable Pipe Sizing Engine", () => {
  // 1. Basic Fixture Schedule Calculations
  it("calculates total WSFU correctly for single flush tank toilet in IPC (2.2 WSFU)", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 50,
      highestFixtureElevationFeet: 0,
      fixtures: [
        {
          id: "1",
          fixtureId: "water_closet_tank",
          name: "Toilet",
          quantity: 1,
          wsfuTotalEach: 2.2,
          wsfuColdEach: 2.2,
          wsfuHotEach: 0.0,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalFixtureCount).toBe(1);
    expect(res.totalCalculatedWsfu).toBe(2.2);
    expect(res.totalColdWsfu).toBe(2.2);
    expect(res.totalHotWsfu).toBe(0.0);
    expect(res.peakDemandGpm).toBe(5.3); // Linear interpolation between 2 WSFU (5.0 GPM) and 3 WSFU (6.5 GPM)
    expect(res.recommendedMainPipeSizeInches).toBe("1/2");
  });

  // 2. Cold vs Hot Separation (Dishwasher is 100% Hot, Hose Bibb is 100% Cold)
  it("correctly separates cold and hot fixture unit loads", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 50,
      highestFixtureElevationFeet: 0,
      fixtures: [
        {
          id: "1",
          fixtureId: "dishwasher",
          name: "Dishwasher",
          quantity: 1,
          wsfuTotalEach: 1.4,
          wsfuColdEach: 0.0,
          wsfuHotEach: 1.4,
          minBranchSizeInches: "1/2",
        },
        {
          id: "2",
          fixtureId: "hose_bibb_first",
          name: "Hose Bibb",
          quantity: 1,
          wsfuTotalEach: 2.5,
          wsfuColdEach: 2.5,
          wsfuHotEach: 0.0,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(3.9);
    expect(res.totalColdWsfu).toBe(2.5);
    expect(res.totalHotWsfu).toBe(1.4);
  });

  // 3. Elevation Head Loss Calculation (0.433 PSI/ft)
  it("calculates static elevation pressure reduction accurately", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 20, // 20 ft * 0.433 = 8.66 -> 8.7 PSI
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group_flush_tank",
          name: "Bathroom Group",
          quantity: 1,
          wsfuTotalEach: 3.6,
          wsfuColdEach: 2.7,
          wsfuHotEach: 1.5,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.elevationLossPsi).toBe(8.7);
    expect(res.equivalentLengthFeet).toBe(72.0); // 60 ft * 1.2 = 72 ft
  });

  // 4. Hunter's Curve Interpolation
  it("interpolates Hunter's Curve accurately at exact table points", () => {
    // 40 WSFU should return exactly 30.0 GPM per IPC Table E103.3(3)
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [
        {
          id: "1",
          fixtureId: "custom_load",
          name: "Custom 40 WSFU Load",
          quantity: 1,
          wsfuTotalEach: 40.0,
          wsfuColdEach: 30.0,
          wsfuHotEach: 20.0,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.peakDemandGpm).toBe(30.0);
    expect(res.totalDesignFlowGpm).toBe(30.0);
  });

  // 5. Commercial Flushometer 1" Minimum Pipe Floor
  it("enforces minimum 1\" main pipe floor when commercial flushometer is present", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 40,
      highestFixtureElevationFeet: 0,
      fixtures: [
        {
          id: "1",
          fixtureId: "water_closet_flushometer",
          name: "Flushometer Toilet",
          quantity: 1,
          wsfuTotalEach: 5.0,
          wsfuColdEach: 5.0,
          wsfuHotEach: 0.0,
          minBranchSizeInches: "1",
          isFlushometer: true,
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.recommendedMainPipeSizeInches).toBe("1");
  });

  // 6. High Static Pressure PRV Warning (> 80 PSI)
  it("generates warning when static pressure exceeds 80 PSI per IPC 604.8 and UPC 608.2", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 95, // Exceeds 80 PSI
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group_flush_tank",
          name: "Bath",
          quantity: 2,
          wsfuTotalEach: 3.6,
          wsfuColdEach: 2.7,
          wsfuHotEach: 1.5,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.warnings.some((w) => w.code === "HIGH_STATIC_PRESSURE_PRV_REQUIRED")).toBe(true);
  });

  // 7. Insufficient Static Pressure Warning
  it("generates warning when static pressure is insufficient to overcome elevation & residual pressure", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 20, // Low pressure
      highestFixtureElevationFeet: 35, // 35 * 0.433 = 15.2 PSI loss + 5 PSI meter + 15 PSI residual = 35.2 PSI needed
      developedLengthFeet: 100,
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group_flush_tank",
          name: "Bath",
          quantity: 1,
          wsfuTotalEach: 3.6,
          wsfuColdEach: 2.7,
          wsfuHotEach: 1.5,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.warnings.some((w) => w.code === "INSUFFICIENT_STATIC_PRESSURE")).toBe(true);
  });

  // 8. Continuous Flow Demand (Irrigation / Process)
  it("adds continuous flow demand GPM to Hunter's Curve peak flow", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group_flush_tank",
          name: "Bath",
          quantity: 1,
          wsfuTotalEach: 3.6,
          wsfuColdEach: 2.7,
          wsfuHotEach: 1.5,
          minBranchSizeInches: "1/2",
        },
      ],
      continuousDemandGpm: 8.0, // 8 GPM continuous
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.peakDemandGpm).toBe(7.4);
    expect(res.continuousDemandGpm).toBe(8.0);
    expect(res.totalDesignFlowGpm).toBe(15.4); // 7.4 + 8.0 = 15.4 GPM
  });

  // 9. Input Validation Error Handling
  it("throws RangeError if schedule is completely empty with no continuous demand", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [],
    };

    expect(() => calculatePlumbingWsfu(input)).toThrow(RangeError);
  });

  it("throws RangeError if static pressure is non-positive", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 0,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [
        {
          id: "1",
          fixtureId: "bathroom_group_flush_tank",
          name: "Bath",
          quantity: 1,
          wsfuTotalEach: 3.6,
          wsfuColdEach: 2.7,
          wsfuHotEach: 1.5,
          minBranchSizeInches: "1/2",
        },
      ],
    };

    expect(() => calculatePlumbingWsfu(input)).toThrow(RangeError);
  });

  // =========================================================================
  // 10 INDEPENDENT FIRST-PRINCIPLES BENCHMARK TESTS
  // =========================================================================

  it("Benchmark 1: Typical 2-Bath Single Family Home (First-Principles Derivation)", () => {
    // 2 Bath Groups (7.2) + 1 Kitchen (1.4) + 1 DW (1.4) + 1 Washer (1.4) + 1 Hose 1st (2.5) + 1 Hose 2nd (1.0) = 14.9 WSFU
    // Hunter's Curve for 14.9 WSFU: ~18.1 GPM
    // In Copper Type L @ 60 ft run (72 ft equiv) @ 60 PSI: 3/4" pipe ID=0.785"
    // Velocity = 0.4085 * 18.1 / (0.785^2) = 12.0 FPS (exceeds 8 FPS max copper cold) -> Engine must select 1" pipe (Vel 7.0 FPS)
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 2, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "3", fixtureId: "dishwasher", name: "Dishwasher", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 0.0, wsfuHotEach: 1.4, minBranchSizeInches: "1/2" },
      { id: "4", fixtureId: "clothes_washer", name: "Washer", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "5", fixtureId: "hose_bibb_first", name: "Hose 1", quantity: 1, wsfuTotalEach: 2.5, wsfuColdEach: 2.5, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
      { id: "6", fixtureId: "hose_bibb_additional", name: "Hose 2", quantity: 1, wsfuTotalEach: 1.0, wsfuColdEach: 1.0, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalFixtureCount).toBe(7);
    expect(res.totalCalculatedWsfu).toBe(14.9);
    expect(res.peakDemandGpm).toBe(18.1);
    expect(res.recommendedMainPipeSizeInches).toBe("1");
    expect(res.velocityAtRecommendedSizeFps).toBe(7.0);
    expect(res.actualResidualPressurePsi).toBeGreaterThan(45);
  });

  it("Benchmark 2: 3-Story Townhouse with High Elevation Rise (24 ft elevation)", () => {
    // 3 Bath Groups (10.8) + 1 Kitchen (1.4) + 1 DW (1.4) + 1 Washer (1.4) = 15.0 WSFU
    // Elevation loss = 24 * 0.433 = 10.4 PSI
    // Design flow = 18.0 GPM.
    // In Copper Type L, requires 1" pipe (velocity 7.0 FPS <= 8.0 FPS).
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 3, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "3", fixtureId: "dishwasher", name: "Dishwasher", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 0.0, wsfuHotEach: 1.4, minBranchSizeInches: "1/2" },
      { id: "4", fixtureId: "clothes_washer", name: "Washer", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 55,
      developedLengthFeet: 90,
      highestFixtureElevationFeet: 24,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(15.0);
    expect(res.elevationLossPsi).toBe(10.4);
    expect(res.recommendedMainPipeSizeInches).toBe("1");
    expect(res.actualResidualPressurePsi).toBeGreaterThan(35);
  });

  it("Benchmark 3: Commercial Restroom with Flushometer Toilets (3 WCs, 15 WSFU)", () => {
    // 3 Flushometer WCs (15 WSFU) in IPC. Flushometer requires min 1" pipe.
    // Design Flow = 18.0 GPM.
    // Sizing: 1" Copper Type L (Vel 7.0 FPS).
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_flushometer", name: "WC Flushometer", quantity: 3, wsfuTotalEach: 5.0, wsfuColdEach: 5.0, wsfuHotEach: 0.0, minBranchSizeInches: "1", isFlushometer: true },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 65,
      developedLengthFeet: 75,
      highestFixtureElevationFeet: 12,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(15.0);
    expect(res.recommendedMainPipeSizeInches).toBe("1");
    expect(res.velocityAtRecommendedSizeFps).toBe(7.1);
  });

  it("Benchmark 4: Luxury Residential Estate (4 Baths, 2 Kitchens, 2 Laundries, 3 Hose Bibbs)", () => {
    // 4 Baths (14.4) + 2 Kitchens (2.8) + 2 DW (2.8) + 2 Washers (2.8) + 1 Hose 1st (2.5) + 2 Hose add (2.0) = 27.3 WSFU
    // Hunter's curve for 27.3 WSFU: ~24.7 GPM.
    // 1" Copper Type L (ID=1.025") velocity = 0.4085 * 24.7 / (1.025^2) = 9.6 FPS (> 8 FPS limit) -> requires 1-1/4" pipe (ID=1.265", vel 6.3 FPS)
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 4, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 2, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "3", fixtureId: "dishwasher", name: "Dishwasher", quantity: 2, wsfuTotalEach: 1.4, wsfuColdEach: 0.0, wsfuHotEach: 1.4, minBranchSizeInches: "1/2" },
      { id: "4", fixtureId: "clothes_washer", name: "Washer", quantity: 2, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "5", fixtureId: "hose_bibb_first", name: "Hose 1", quantity: 1, wsfuTotalEach: 2.5, wsfuColdEach: 2.5, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
      { id: "6", fixtureId: "hose_bibb_additional", name: "Hose 2", quantity: 2, wsfuTotalEach: 1.0, wsfuColdEach: 1.0, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 70,
      developedLengthFeet: 120,
      highestFixtureElevationFeet: 18,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(27.3);
    expect(res.totalDesignFlowGpm).toBe(24.7);
    expect(res.recommendedMainPipeSizeInches).toBe("1-1/4");
    expect(res.velocityAtRecommendedSizeFps).toBe(6.3);
  });

  it("Benchmark 5: Low Municipal Pressure Sizing Evaluation (35 PSI Static)", () => {
    // 1 Bath Group + 1 Kitchen = 5.0 WSFU -> 9.4 GPM
    // Low pressure requires larger diameter to conserve pressure drop
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 1, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 35,
      developedLengthFeet: 50,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(5.0);
    expect(res.recommendedMainPipeSizeInches).toBe("3/4");
    expect(res.actualResidualPressurePsi).toBeGreaterThan(20);
  });

  it("Benchmark 6: High Static Pressure PRV Requirement (90 PSI Static)", () => {
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 2, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 90,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.warnings.some((w) => w.code === "HIGH_STATIC_PRESSURE_PRV_REQUIRED")).toBe(true);
  });

  it("Benchmark 7: PEX vs Copper Velocity Limits Comparison", () => {
    // 8 WSFU = 12.8 GPM.
    // In Copper Type L (max vel 8 FPS), 3/4" ID=0.785" has vel = 0.4085 * 12.8 / (0.785^2) = 8.5 FPS (> 8.0 FPS limit -> requires 1" Copper)
    // In PEX (max vel 10 FPS), 3/4" ID=0.671" has vel = 0.4085 * 12.8 / (0.671^2) = 11.6 FPS (> 10 FPS -> requires 1" PEX)
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_tank", name: "WC", quantity: 2, wsfuTotalEach: 2.2, wsfuColdEach: 2.2, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "bathtub_shower", name: "Tub", quantity: 2, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "3", fixtureId: "lavatory", name: "Lav", quantity: 1, wsfuTotalEach: 0.8, wsfuColdEach: 0.5, wsfuHotEach: 0.5, minBranchSizeInches: "1/2" },
    ]; // 4.4 + 2.8 + 0.8 = 8.0 WSFU -> 12.8 GPM

    const resCopper = calculatePlumbingWsfu({
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures,
    });
    expect(resCopper.recommendedMainPipeSizeInches).toBe("1");

    const resPex = calculatePlumbingWsfu({
      codeStandard: "IPC",
      pipeMaterial: "pex",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures,
    });
    expect(resPex.recommendedMainPipeSizeInches).toBe("1");
  });

  it("Benchmark 8: Small Accessory Dwelling Unit (ADU) Sizing", () => {
    // 1 Toilet (2.2) + 1 Lav (0.7) + 1 Shower (1.4) + 1 Kitchen (1.4) = 5.7 WSFU -> ~10.2 GPM
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_tank", name: "WC", quantity: 1, wsfuTotalEach: 2.2, wsfuColdEach: 2.2, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "lavatory", name: "Lav", quantity: 1, wsfuTotalEach: 0.7, wsfuColdEach: 0.5, wsfuHotEach: 0.5, minBranchSizeInches: "1/2" },
      { id: "3", fixtureId: "shower_stall", name: "Shower", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      { id: "4", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 40,
      highestFixtureElevationFeet: 8,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(5.7);
    expect(res.recommendedMainPipeSizeInches).toBe("3/4");
  });

  it("Benchmark 9: Commercial Irrigation Continuous Flow Combination", () => {
    // 1 Bathroom Group (3.6 WSFU = 7.4 GPM) + 15 GPM Continuous Irrigation = 22.4 GPM Total Design Flow
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 1, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 65,
      developedLengthFeet: 80,
      highestFixtureElevationFeet: 5,
      fixtures,
      continuousDemandGpm: 15.0,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.peakDemandGpm).toBe(7.4);
    expect(res.totalDesignFlowGpm).toBe(22.4);
    expect(res.recommendedMainPipeSizeInches).toBe("1-1/4"); // 22.4 GPM in 1" copper has vel = 8.7 FPS (>8.0 limit) -> 1-1/4" required
  });

  it("Benchmark 10: Exact Hunter's Curve 50 WSFU Boundary Test", () => {
    // 50 WSFU is exactly 34.0 GPM per IPC Table E103.3(3)
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "custom_50", name: "50 WSFU Load", quantity: 1, wsfuTotalEach: 50.0, wsfuColdEach: 35.0, wsfuHotEach: 25.0, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 80,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(50.0);
    expect(res.peakDemandGpm).toBe(34.0);
    expect(res.totalDesignFlowGpm).toBe(34.0);
    expect(res.recommendedMainPipeSizeInches).toBe("1-1/2"); // 34 GPM in 1-1/4" has vel 8.7 FPS (>8.0 limit) -> 1-1/2" required (vel 6.1 FPS)
  });

  // 21. CPVC Pipe Material Sizing
  it("sizes CPVC piping correctly with C=150 roughness factor", () => {
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 2, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "cpvc",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.pipeMaterial).toBe("cpvc");
    expect(res.recommendedMainPipeSizeInches).toBe("1");
    expect(res.velocityAtRecommendedSizeFps).toBeLessThanOrEqual(8.0);
  });

  // 22. UPC vs IPC Rating Difference (Toilet 2.5 in UPC vs 2.2 in IPC)
  it("handles UPC fixture rating difference for standard tank toilet", () => {
    const fixturesIpc: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_tank", name: "Toilet", quantity: 4, wsfuTotalEach: 2.2, wsfuColdEach: 2.2, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
    ];
    const fixturesUpc: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "water_closet_tank", name: "Toilet", quantity: 4, wsfuTotalEach: 2.5, wsfuColdEach: 2.5, wsfuHotEach: 0.0, minBranchSizeInches: "1/2" },
    ];

    const resIpc = calculatePlumbingWsfu({ codeStandard: "IPC", pipeMaterial: "copper_l", staticPressurePsi: 60, developedLengthFeet: 60, highestFixtureElevationFeet: 10, fixtures: fixturesIpc });
    expect(resIpc.totalCalculatedWsfu).toBe(8.8);

    const resUpc = calculatePlumbingWsfu({ codeStandard: "UPC", pipeMaterial: "copper_l", staticPressurePsi: 60, developedLengthFeet: 60, highestFixtureElevationFeet: 10, fixtures: fixturesUpc });
    expect(resUpc.totalCalculatedWsfu).toBe(10.0);
  });

  // 23. Deterministic Invariance
  it("produces identical deterministic results across repeated invocations", () => {
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 60,
      highestFixtureElevationFeet: 10,
      fixtures: [
        { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath", quantity: 2, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
        { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
      ],
    };

    const run1 = calculatePlumbingWsfu(input);
    const run2 = calculatePlumbingWsfu(input);
    expect(run1).toEqual(run2);
  });

  // 24. High Demand Multi-Family (100 WSFU -> 52.0 GPM)
  it("sizes large multi-family building with 100 WSFU", () => {
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath Group", quantity: 25, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "kitchen_sink", name: "Kitchen", quantity: 7, wsfuTotalEach: 1.4, wsfuColdEach: 1.0, wsfuHotEach: 1.0, minBranchSizeInches: "1/2" },
    ]; // 90 + 9.8 = 99.8 -> 100 WSFU = 52.0 GPM
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 75,
      developedLengthFeet: 150,
      highestFixtureElevationFeet: 25,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.totalCalculatedWsfu).toBe(99.8);
    expect(res.peakDemandGpm).toBe(51.9);
    expect(res.recommendedMainPipeSizeInches).toBe("2"); // 52 GPM in 2" copper (ID=1.985", vel 5.4 FPS)
  });

  // 25. Cold and Hot Water Branch Sizing
  it("recommends separate compliant branch sizes for cold and hot trunks", () => {
    const fixtures: WsfuScheduleItem[] = [
      { id: "1", fixtureId: "bathroom_group_flush_tank", name: "Bath", quantity: 2, wsfuTotalEach: 3.6, wsfuColdEach: 2.7, wsfuHotEach: 1.5, minBranchSizeInches: "1/2" },
      { id: "2", fixtureId: "dishwasher", name: "DW", quantity: 1, wsfuTotalEach: 1.4, wsfuColdEach: 0.0, wsfuHotEach: 1.4, minBranchSizeInches: "1/2" },
    ];
    const input: PlumbingWsfuInput = {
      codeStandard: "IPC",
      pipeMaterial: "copper_l",
      staticPressurePsi: 60,
      developedLengthFeet: 50,
      highestFixtureElevationFeet: 10,
      fixtures,
    };

    const res = calculatePlumbingWsfu(input);
    expect(res.minColdBranchSizeInches).toBeDefined();
    expect(res.minHotBranchSizeInches).toBeDefined();
  });
});
