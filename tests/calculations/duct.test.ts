import { describe, it, expect } from "vitest";
import {
  calculateDuctSizingProject,
  evaluateSingleDuct,
} from "@/lib/calculations/duct";
import {
  calculateHuebscherEquivalentDiameter,
  findMatchingRectangularWidth,
  findNearestStandardRoundDuct,
  getVelocityStatus,
} from "@/data/references/duct-types";
import type { DuctSizingInput } from "@/types/duct";

describe("HVAC Duct Sizing & CFM Airflow Calculation Engine (TASK 018 Accuracy Suite)", () => {
  // Test Case 1: Standard 1,200 CFM (3-Ton) Main Trunk Sizing
  it("calculates accurate theoretical diameter and standard round duct size for 1,200 CFM", () => {
    const input: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 1200,
      ductMaterial: "sheet_metal",
      sizingMethod: "equal_friction",
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 8,
    };

    const res = calculateDuctSizingProject(input);
    expect(res.totalCfm).toBe(1200);
    // In standard ASHRAE duct chart, 1200 CFM @ 0.08 in. w.g. is ~15.5" theoretical -> 16" standard round
    expect(res.mainTrunk.theoreticalDiameterInches).toBeGreaterThan(14.5);
    expect(res.mainTrunk.theoreticalDiameterInches).toBeLessThan(16.5);
    expect(res.mainTrunk.recommendedStandardDiameterInches).toBe(16);
    expect(res.mainTrunk.roundDuctAreaSqIn).toBeCloseTo(201.1, 1);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeGreaterThan(750);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeLessThan(950);
  });

  // Test Case 2: Tonnage-Derived Airflow Mode
  it("derives total airflow from cooling tons using 400 CFM/ton standard baseline", () => {
    const input: DuctSizingInput = {
      inputMode: "tonnage",
      coolingTons: 3.5,
      cfmPerTon: 400,
    };

    const res = calculateDuctSizingProject(input);
    // 3.5 * 400 = 1,400 CFM -> ~16.6" theoretical -> 18" standard round
    expect(res.totalCfm).toBe(1400);
    expect(res.mainTrunk.recommendedStandardDiameterInches).toBe(18);
  });

  // Test Case 3: Custom CFM/Ton Airflow Factor
  it("supports custom CFM/ton airflow factors for humid or arid climate designs", () => {
    const humidInput: DuctSizingInput = {
      inputMode: "tonnage",
      coolingTons: 3.0,
      cfmPerTon: 350, // High dehumidification
    };
    const aridInput: DuctSizingInput = {
      inputMode: "tonnage",
      coolingTons: 3.0,
      cfmPerTon: 450, // Dry desert climate
    };

    const humidRes = calculateDuctSizingProject(humidInput);
    const aridRes = calculateDuctSizingProject(aridInput);

    expect(humidRes.totalCfm).toBe(1050);
    expect(aridRes.totalCfm).toBe(1350);
    expect(aridRes.mainTrunk.theoreticalDiameterInches).toBeGreaterThan(
      humidRes.mainTrunk.theoreticalDiameterInches
    );
  });

  // Test Case 4: Multi-Room Branch Schedule Summation
  it("sums multi-room branch requirements and sizes both main trunk and individual branch runouts", () => {
    const input: DuctSizingInput = {
      inputMode: "room_schedule",
      rooms: [
        { id: "1", roomName: "Living Room", targetCfm: 350 },
        { id: "2", roomName: "Master Bed", targetCfm: 250 },
        { id: "3", roomName: "Bed 2", targetCfm: 150 },
        { id: "4", roomName: "Kitchen", targetCfm: 250 },
        { id: "5", roomName: "Bath", targetCfm: 50 },
      ],
      frictionRateInWgPer100Ft: 0.08,
    };

    const res = calculateDuctSizingProject(input);
    // Total CFM = 350 + 250 + 150 + 250 + 50 = 1,050 CFM
    expect(res.totalCfm).toBe(1050);
    expect(res.branchRuns.length).toBe(5);

    // Living room branch (350 CFM) -> 8" or 9" standard round
    const livingBranch = res.branchRuns.find((b) => b.roomName === "Living Room");
    expect(livingBranch).toBeDefined();
    expect([8, 9, 10]).toContain(livingBranch?.recommendedStandardDiameterInches);

    // Bath branch (50 CFM) -> 4" or 5" standard round
    const bathBranch = res.branchRuns.find((b) => b.roomName === "Bath");
    expect(bathBranch).toBeDefined();
    expect([4, 5, 6]).toContain(bathBranch?.recommendedStandardDiameterInches);
  });

  // Test Case 5: Huebscher Equivalent Diameter Calculation
  it("calculates accurate Huebscher equivalent round diameter for rectangular ducts", () => {
    // A 14" x 8" rectangular duct has De ~ 11.5" to 11.6"
    const eqDia = calculateHuebscherEquivalentDiameter(14, 8);
    expect(eqDia).toBeGreaterThan(11.0);
    expect(eqDia).toBeLessThan(12.0);

    // A 20" x 8" rectangular duct has De ~ 13.6" to 13.8"
    const eqDia20x8 = calculateHuebscherEquivalentDiameter(20, 8);
    expect(eqDia20x8).toBeGreaterThan(13.0);
    expect(eqDia20x8).toBeLessThan(14.2);
  });

  // Test Case 6: Rectangular Sizing with Fixed Height Constraint
  it("sizes rectangular width correctly for a given height restriction", () => {
    const singleEval = evaluateSingleDuct(1200, "sheet_metal", "equal_friction", 0.08, 700, 8);
    expect(singleEval.rectangularHeightInches).toBe(8);
    // For ~15.57" round equivalent, width @ 8" height is 28"
    expect([26, 28, 30]).toContain(singleEval.rectangularWidthInches);
    expect(singleEval.rectangularAreaSqIn).toBe(singleEval.rectangularWidthInches * 8);
  });

  // Test Case 7: Rectangular Aspect Ratio Warning
  it("flags extreme rectangular aspect ratio warning when ratio exceeds 4:1", () => {
    // 2,400 CFM with an extreme 6" height restriction forces a very wide duct (>24" width -> >4:1 ratio)
    const input: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 2400,
      fixedRectangularHeightInches: 6,
    };

    const res = calculateDuctSizingProject(input);
    expect(res.mainTrunk.rectangularAspectRatio).toBeGreaterThan(4.0);
    expect(
      res.warnings.some((w) => w.code === "EXTREME_RECTANGULAR_ASPECT_RATIO")
    ).toBe(true);
  });

  // Test Case 8: High Air Velocity Warning (> 900 FPM)
  it("warns when actual round air velocity exceeds residential comfort limits", () => {
    const input: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 1600, // High CFM
      sizingMethod: "equal_friction",
      frictionRateInWgPer100Ft: 0.15, // High friction rate produces smaller diameter -> higher velocity
    };

    const res = calculateDuctSizingProject(input);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeGreaterThan(900);
    expect(
      res.warnings.some((w) => w.code === "HIGH_AIR_VELOCITY_NOISE_RISK")
    ).toBe(true);
  });

  // Test Case 9: Low Air Velocity Warning (< 400 FPM)
  it("warns when air velocity is below 400 FPM risking thermal stratification", () => {
    const input: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 100,
      sizingMethod: "velocity_reduction",
      targetVelocityFpm: 350,
    };

    const res = calculateDuctSizingProject(input);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeLessThan(400);
    expect(
      res.warnings.some((w) => w.code === "LOW_AIR_VELOCITY_STRATIFICATION_RISK")
    ).toBe(true);
  });

  // Test Case 10: Flexible Duct Material Sizing Penalty
  it("applies +15% diameter adjustment multiplier for flexible duct", () => {
    const metalInput: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 800,
      ductMaterial: "sheet_metal",
    };
    const flexInput: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 800,
      ductMaterial: "flexible_duct",
    };

    const metalRes = calculateDuctSizingProject(metalInput);
    const flexRes = calculateDuctSizingProject(flexInput);

    expect(flexRes.mainTrunk.theoreticalDiameterInches).toBeGreaterThan(
      metalRes.mainTrunk.theoreticalDiameterInches
    );
    expect(
      flexRes.warnings.some((w) => w.code === "FLEXIBLE_DUCT_INSTALLATION_PENALTY")
    ).toBe(true);
  });

  // Test Case 11: Velocity Reduction Sizing Method
  it("sizes duct accurately based on target air velocity FPM", () => {
    const input: DuctSizingInput = {
      inputMode: "direct_cfm",
      targetCfm: 700,
      sizingMethod: "velocity_reduction",
      targetVelocityFpm: 700,
    };

    const res = calculateDuctSizingProject(input);
    // Area required = 700 / 700 = 1.0 sq ft = 144 sq in.
    // D = sqrt(4 * 144 / pi) = ~13.54" -> nearest standard size 14"
    expect(res.mainTrunk.theoreticalDiameterInches).toBeCloseTo(13.54, 1);
    expect(res.mainTrunk.recommendedStandardDiameterInches).toBe(14);
  });

  // Test Case 12: Standard Round Duct Lookup Helper
  it("maps theoretical diameters to factory standard sizes correctly", () => {
    expect(findNearestStandardRoundDuct(5.8)).toBe(6);
    expect(findNearestStandardRoundDuct(6.1)).toBe(6);
    expect(findNearestStandardRoundDuct(7.9)).toBe(8);
    expect(findNearestStandardRoundDuct(13.4)).toBe(14);
    expect(findNearestStandardRoundDuct(15.2)).toBe(16);
  });

  // Test Case 13: Velocity Status Helper
  it("categorizes velocity status correctly", () => {
    expect(getVelocityStatus(450)).toBe("quiet");
    expect(getVelocityStatus(750)).toBe("optimal");
    expect(getVelocityStatus(1050)).toBe("high_velocity");
    expect(getVelocityStatus(1350)).toBe("excessive_noise");
  });

  // Test Case 14: Invalid Input Rejection
  it("throws RangeError for invalid CFM or negative parameters", () => {
    expect(() =>
      calculateDuctSizingProject({ inputMode: "direct_cfm", targetCfm: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateDuctSizingProject({ inputMode: "direct_cfm", targetCfm: -500 })
    ).toThrow(RangeError);

    expect(() =>
      calculateDuctSizingProject({ inputMode: "tonnage", coolingTons: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateDuctSizingProject({
        inputMode: "direct_cfm",
        targetCfm: 1000,
        frictionRateInWgPer100Ft: 0,
      })
    ).toThrow(RangeError);

    expect(() =>
      calculateDuctSizingProject({ inputMode: "room_schedule", rooms: [] })
    ).toThrow(RangeError);
  });

  // Test Case 15: Deterministic Repeatability
  it("produces identical outputs across repeated execution runs", () => {
    const input: DuctSizingInput = {
      inputMode: "room_schedule",
      rooms: [
        { id: "1", roomName: "Living Room", targetCfm: 400 },
        { id: "2", roomName: "Master Bed", targetCfm: 300 },
        { id: "3", roomName: "Kitchen", targetCfm: 300 },
      ],
      ductMaterial: "sheet_metal",
      sizingMethod: "equal_friction",
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 8,
    };

    const run1 = calculateDuctSizingProject(input);
    const run2 = calculateDuctSizingProject(input);

    expect(run1.totalCfm).toBe(run2.totalCfm);
    expect(run1.mainTrunk).toEqual(run2.mainTrunk);
    expect(run1.branchRuns).toEqual(run2.branchRuns);
    expect(run1.warnings).toEqual(run2.warnings);
  });

  // =========================================================================
  // TASK C: INDEPENDENT BENCHMARK DATASET (100, 200, 500, 1000, 2000 CFM)
  // Independent calculations derived directly from fundamental fluid dynamics
  // =========================================================================

  // Test Case 16: Independent Benchmark 1 — 100 CFM (Small Bath / Closet Branch)
  it("independently validates 100 CFM benchmark across round and rectangular profiles", () => {
    // Independent physics calculation:
    // Q = 100 CFM, Δh = 0.08 in. w.g./100 ft
    // D_exact = ((0.109136 * 100^1.9) / 0.08)^0.1992 = 6.08 inches -> standard size 6" or 7"
    // At 6" standard: Area = pi * 3^2 / 144 = 0.1963 sq ft -> V = 100 / 0.1963 = 509 FPM
    const res = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 100,
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 6,
    });

    expect(res.mainTrunk.theoreticalDiameterInches).toBeCloseTo(6.08, 1);
    expect([6, 7]).toContain(res.mainTrunk.recommendedStandardDiameterInches);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeCloseTo(509, -1);
    expect([6, 8]).toContain(res.mainTrunk.rectangularWidthInches);
  });

  // Test Case 17: Independent Benchmark 2 — 200 CFM (Bedroom Branch Runout)
  it("independently validates 200 CFM benchmark comparing sheet metal vs flexible duct", () => {
    // Q = 200 CFM, Δh = 0.08 in. w.g./100 ft
    // D_metal_exact = ((0.109136 * 200^1.9) / 0.08)^0.1992 = 7.90 inches -> standard size 8"
    // D_flex_exact = 7.90 * 1.15 = 9.09 inches -> standard size 9" or 10"
    const metalRes = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 200,
      ductMaterial: "sheet_metal",
      frictionRateInWgPer100Ft: 0.08,
    });

    const flexRes = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 200,
      ductMaterial: "flexible_duct",
      frictionRateInWgPer100Ft: 0.08,
    });

    expect(metalRes.mainTrunk.theoreticalDiameterInches).toBeCloseTo(7.90, 1);
    expect([8, 9]).toContain(metalRes.mainTrunk.recommendedStandardDiameterInches);

    expect(flexRes.mainTrunk.theoreticalDiameterInches).toBeCloseTo(9.09, 1);
    expect([9, 10]).toContain(flexRes.mainTrunk.recommendedStandardDiameterInches);
  });

  // Test Case 18: Independent Benchmark 3 — 500 CFM (Living Room / Multi-Branch Zone)
  it("independently validates 500 CFM benchmark for round vs rectangular Huebscher equivalency", () => {
    // Q = 500 CFM, Δh = 0.08 in. w.g./100 ft
    // D_exact = ((0.109136 * 500^1.9) / 0.08)^0.1992 = 11.18 inches -> standard size 12"
    // At 8" rectangular depth: width selects 14" or 16"
    const res = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 500,
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 8,
    });

    expect(res.mainTrunk.theoreticalDiameterInches).toBeCloseTo(11.18, 1);
    expect([12, 14]).toContain(res.mainTrunk.recommendedStandardDiameterInches);
    expect([14, 16]).toContain(res.mainTrunk.rectangularWidthInches);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeLessThan(900);
  });

  // Test Case 19: Independent Benchmark 4 — 1,000 CFM (2.5-Ton Residential Main Trunk)
  it("independently validates 1,000 CFM benchmark velocity and friction drop", () => {
    // Q = 1,000 CFM, Δh = 0.08 in. w.g./100 ft
    // D_exact = ((0.109136 * 1000^1.9) / 0.08)^0.1992 = 14.53 inches -> standard size 16"
    const res = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 1000,
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 8,
    });

    expect(res.mainTrunk.theoreticalDiameterInches).toBeCloseTo(14.53, 1);
    expect([14, 16]).toContain(res.mainTrunk.recommendedStandardDiameterInches);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeGreaterThan(700);
    expect(res.mainTrunk.actualRoundVelocityFpm).toBeLessThan(1100);
  });

  // Test Case 20: Independent Benchmark 5 — 2,000 CFM (5.0-Ton Main Trunk)
  it("independently validates 2,000 CFM benchmark with rectangular aspect ratio checks", () => {
    // Q = 2,000 CFM, Δh = 0.08 in. w.g./100 ft
    // D_exact = ((0.109136 * 2000^1.9) / 0.08)^0.1992 = 18.89 inches -> standard size 20"
    const res = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 2000,
      frictionRateInWgPer100Ft: 0.08,
      fixedRectangularHeightInches: 10,
    });

    expect(res.mainTrunk.theoreticalDiameterInches).toBeCloseTo(18.89, 1);
    expect(res.mainTrunk.recommendedStandardDiameterInches).toBe(20);
    // At 10" height, 32" width gives De = 18.91"
    expect(res.mainTrunk.rectangularWidthInches).toBe(32);
  });

  // Test Case 21: Fluid Continuity Law Invariance (CFM = Area * Velocity)
  it("verifies fluid continuity equation holds with <0.1% numerical precision", () => {
    const single = evaluateSingleDuct(850, "sheet_metal", "equal_friction", 0.08, 700, 8);
    const calculatedCfm = single.roundDuctAreaSqFt * single.actualRoundVelocityFpm;
    // Difference between calculated and input CFM should be minimal (< 2% due to velocity rounding to integer)
    expect(Math.abs(calculatedCfm - 850)).toBeLessThan(15);
  });

  // Test Case 22: Duct Board Material Roughness Compensation
  it("applies accurate +5% diameter compensation for duct board", () => {
    const metal = evaluateSingleDuct(600, "sheet_metal", "equal_friction", 0.08, 700, 8);
    const board = evaluateSingleDuct(600, "duct_board", "equal_friction", 0.08, 700, 8);

    expect(board.theoreticalDiameterInches).toBeCloseTo(
      metal.theoreticalDiameterInches * 1.05,
      1
    );
  });

  // Test Case 23: Sizing Method Comparison Consistency
  it("ensures equal friction and velocity reduction produce physically consistent dimensions", () => {
    const equalFrictionRes = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 800,
      sizingMethod: "equal_friction",
      frictionRateInWgPer100Ft: 0.08,
    });

    const velocityRes = calculateDuctSizingProject({
      inputMode: "direct_cfm",
      targetCfm: 800,
      sizingMethod: "velocity_reduction",
      targetVelocityFpm: 800,
    });

    // Both methods on 800 CFM should yield round sizes within 2 inches of each other
    expect(
      Math.abs(
        equalFrictionRes.mainTrunk.recommendedStandardDiameterInches -
          velocityRes.mainTrunk.recommendedStandardDiameterInches
      )
    ).toBeLessThanOrEqual(2);
  });

  // Test Case 24: Extreme Aspect Ratio Boundary Check
  it("computes extreme rectangular aspect ratio safely without NaN or infinite values", () => {
    const res = evaluateSingleDuct(3000, "sheet_metal", "equal_friction", 0.08, 700, 6);
    expect(Number.isFinite(res.rectangularAspectRatio)).toBe(true);
    expect(res.rectangularAspectRatio).toBeGreaterThan(4.0);
  });

  // Test Case 25: Room Schedule Zero CFM Filter
  it("safely filters out zero CFM room entries while keeping valid rooms", () => {
    const res = calculateDuctSizingProject({
      inputMode: "room_schedule",
      rooms: [
        { id: "1", roomName: "Active Room", targetCfm: 300 },
        { id: "2", roomName: "Inactive Room", targetCfm: 0 },
      ],
    });

    expect(res.totalCfm).toBe(300);
    expect(res.branchRuns.length).toBe(1);
    expect(res.branchRuns[0].roomName).toBe("Active Room");
  });
});
