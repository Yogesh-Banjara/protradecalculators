import { describe, it, expect } from "vitest";
import {
  calculateMaxDistance,
  calculateVoltageDrop,
  calculateVoltageDropProject,
  evaluateCandidateConductors,
} from "@/lib/calculations/electrical";
import type { VoltageDropCalculatorInput } from "@/types/electrical";

describe("Electrical Wire Sizing & Voltage Drop Engine (TASK 011 Accuracy Suite)", () => {
  // Test Case 1: Standard 120V 15A circuit at 100 ft
  it("calculates 120V 15A branch circuit voltage drop and recommends upsized conductor", () => {
    // 14 AWG (4110 CM): Vdrop = (2 * 12.9 * 15 * 100) / 4110 = 9.416V -> 9.42V (7.85% drop)
    const raw = calculateVoltageDrop(120, 15, 100, 4110, "copper", "single_phase");
    expect(raw.voltageDropVolts).toBeCloseTo(9.42, 2);
    expect(raw.voltageDropPercent).toBeCloseTo(7.85, 2);
    expect(raw.voltageAtLoad).toBeCloseTo(110.58, 2);

    // Full project: target 3% drop -> 14 AWG (7.85% FAIL), 12 AWG (4.94% FAIL), 10 AWG (3.11% FAIL), 8 AWG (1.95% PASS)
    const res = calculateVoltageDropProject({
      voltage: 120,
      loadCurrentAmps: 15,
      distanceFt: 100,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    });

    // 8 AWG drop is 1.95% <= 3%
    expect(res.recommendedSize).toBe("8 AWG");
    expect(res.voltageDropPercent).toBeLessThanOrEqual(3.0);
  });

  // Test Case 2: Standard 240V 50A circuit at 100 ft
  it("calculates 240V 50A EV/range circuit accurately", () => {
    const input: VoltageDropCalculatorInput = {
      voltage: 240,
      loadCurrentAmps: 50,
      distanceFt: 100,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    };

    const res = calculateVoltageDropProject(input);
    // 6 AWG (26240 CM): Vdrop = (2 * 12.9 * 50 * 100) / 26240 = 4.916V -> 4.92V (2.05% drop <= 3% PASS)
    // 6 AWG copper 75C ampacity is 65A (>= 50A PASS)
    expect(res.recommendedSize).toBe("6 AWG");
    expect(res.voltageDropVolts).toBeCloseTo(4.92, 2);
    expect(res.voltageDropPercent).toBeCloseTo(2.05, 2);
    expect(res.voltageAtLoad).toBeCloseTo(235.08, 2);
    expect(res.is3PctCompliant).toBe(true);
  });

  // Test Case 3: 240V 100A Subpanel Feeder at 150 ft (80A Operating Load vs 100A Design Load)
  it("sizes 100A subpanel feeder and compares Copper vs Aluminum for Guide Worked Example", () => {
    // 80A Operating Load @ 150 ft on #3 AWG Cu (52,620 CM)
    const cu80 = calculateVoltageDrop(240, 80, 150, 52620, "copper", "single_phase");
    expect(cu80.voltageDropVolts).toBeCloseTo(5.88, 2);
    expect(cu80.voltageDropPercent).toBeCloseTo(2.45, 2);
    expect(cu80.voltageAtLoad).toBeCloseTo(234.12, 2);

    // 80A Operating Load @ 150 ft on #1 AWG Al (83,690 CM)
    const al80 = calculateVoltageDrop(240, 80, 150, 83690, "aluminum", "single_phase");
    expect(al80.voltageDropVolts).toBeCloseTo(6.08, 2);
    expect(al80.voltageDropPercent).toBeCloseTo(2.53, 2);
    expect(al80.voltageAtLoad).toBeCloseTo(233.92, 2);

    // 80A Operating Load @ 200 ft on #1 AWG Al (83,690 CM) -> 3.38% drop (exceeds 3%)
    const al200 = calculateVoltageDrop(240, 80, 200, 83690, "aluminum", "single_phase");
    expect(al200.voltageDropVolts).toBeCloseTo(8.11, 2);
    expect(al200.voltageDropPercent).toBeCloseTo(3.38, 2);

    // 80A Operating Load @ 200 ft on 1/0 AWG Al (105,600 CM) -> 2.68% drop (compliant)
    const al200Upsized = calculateVoltageDrop(240, 80, 200, 105600, "aluminum", "single_phase");
    expect(al200Upsized.voltageDropVolts).toBeCloseTo(6.42, 2);
    expect(al200Upsized.voltageDropPercent).toBeCloseTo(2.68, 2);

    // 100A Design Load @ 150 ft Project Evaluation
    const res = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 100,
      distanceFt: 150,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    });

    // Copper: 2 AWG (66360 CM, 115A ampacity): Vdrop = (2 * 12.9 * 100 * 150) / 66360 = 5.83V (2.43% drop <= 3% PASS)
    expect(res.recommendedSize).toBe("2 AWG");
    expect(res.copperVsAluminumComparison.copperRecommendedSize).toBe("2 AWG");
    expect(res.copperVsAluminumComparison.copperDropPercent).toBeLessThanOrEqual(3.0);

    // Aluminum: 1/0 AWG (105600 CM, 120A ampacity): Vdrop = (2 * 21.2 * 100 * 150) / 105600 = 6.02V (2.51% drop)
    expect(res.copperVsAluminumComparison.aluminumRecommendedSize).toBe("1/0 AWG");
  });

  // Test Case 4: 208V 3-Phase Commercial Circuit (sqrt(3) multiplier)
  it("calculates 208V 3-phase circuit with sqrt(3) phase factor", () => {
    // 40A @ 120 ft on 8 AWG (16510 CM): Vdrop = (sqrt(3) * 12.9 * 40 * 120) / 16510 = 6.495V -> 6.50V (3.13% drop)
    const raw = calculateVoltageDrop(208, 40, 120, 16510, "copper", "three_phase");
    expect(raw.voltageDropVolts).toBeCloseTo(6.50, 2);
    expect(raw.voltageDropPercent).toBeCloseTo(3.13, 2);

    const res = calculateVoltageDropProject({
      voltage: 208,
      phase: "three_phase",
      loadCurrentAmps: 40,
      distanceFt: 120,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    });

    // To get under 3% on 40A, upsize to 6 AWG (26240 CM -> Vdrop = 4.09V, 1.97% drop)
    expect(res.recommendedSize).toBe("6 AWG");
    expect(res.voltageDropPercent).toBeLessThanOrEqual(3.0);
  });

  // Test Case 5: 480V 3-Phase Industrial Circuit
  it("calculates 480V 3-phase 100A feeder over 300 ft", () => {
    const res = calculateVoltageDropProject({
      voltage: 480,
      phase: "three_phase",
      loadCurrentAmps: 100,
      distanceFt: 300,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    });

    // 3 AWG (52620 CM, 100A ampacity): Vdrop = (sqrt(3) * 12.9 * 100 * 300) / 52620 = 12.73V (2.65% drop <= 3% PASS)
    expect(res.recommendedSize).toBe("3 AWG");
    expect(res.voltageDropPercent).toBeLessThanOrEqual(3.0);
  });

  // Test Case 6: 12V / 24V DC Low Voltage Circuit
  it("calculates 12V DC circuit and accurately reflects low-voltage sensitivity", () => {
    // 12V, 10A, 30 ft, 10 AWG copper (10380 CM): Vdrop = (2 * 12.9 * 10 * 30) / 10380 = 0.745V -> 0.75V (6.25% drop)
    const raw = calculateVoltageDrop(12, 10, 30, 10380, "copper", "dc");
    expect(raw.voltageDropVolts).toBeCloseTo(0.75, 2);
    expect(raw.voltageDropPercent).toBeCloseTo(6.25, 2);
  });

  // Test Case 7: Maximum Distance Calculation
  it("calculates exact maximum circuit distance for 3% and 5% voltage drop", () => {
    // 240V, 50A, 6 AWG copper (26240 CM), 3% drop = 7.2V limit
    // Dmax = (7.2 * 26240) / (2 * 12.9 * 50) = 188928 / 1290 = 146.45 ft -> 146.5 ft
    const maxDist3 = calculateMaxDistance(240, 50, 26240, "copper", "single_phase", 3.0);
    expect(maxDist3).toBeCloseTo(146.5, 1);

    const maxDist5 = calculateMaxDistance(240, 50, 26240, "copper", "single_phase", 5.0);
    expect(maxDist5).toBeCloseTo(244.1, 1);
  });

  // Test Case 8: Continuous Load 125% Sizing Rule
  it("applies 125% continuous load design current factor", () => {
    const normal = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 40,
      distanceFt: 50,
      isContinuousLoad: false,
    });
    expect(normal.designCurrentAmps).toBe(40);

    const continuous = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 40,
      distanceFt: 50,
      isContinuousLoad: true,
    });
    expect(continuous.designCurrentAmps).toBe(50); // 40 * 1.25
  });

  // Test Case 9: Ambient Temperature Derating
  it("derates conductor ampacity under high ambient temperature (122°F / 50°C)", () => {
    const res = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 50,
      distanceFt: 50,
      ambientTempF: 122, // 50°C -> factor 0.75 for 75°C wire
    });

    // 6 AWG 75C base ampacity is 65A; derated = 65 * 0.75 = 48.75A -> < 50A design current
    // Requires upsize to 4 AWG (85A * 0.75 = 63.75A >= 50A PASS)
    expect(res.recommendedSize).toBe("4 AWG");
  });

  // Test Case 10: Conduit Fill Derating (7–9 Conductors = 70%)
  it("derates conductor ampacity when more than 3 conductors are in raceway", () => {
    const res = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 50,
      distanceFt: 50,
      conductorsInConduit: 8, // 7-9 conductors -> 0.70 factor
    });

    // 6 AWG (65A * 0.70 = 45.5A < 50A) -> upsized to 4 AWG (85A * 0.70 = 59.5A >= 50A)
    expect(res.recommendedSize).toBe("4 AWG");
  });

  // Test Case 11: Small Aluminum Conductor Warning
  it("generates warning when aluminum is selected for small gauge circuits", () => {
    const res = calculateVoltageDropProject({
      voltage: 120,
      loadCurrentAmps: 15,
      distanceFt: 50,
      material: "aluminum",
    });

    expect(
      res.warnings.some((w) => w.code === "SMALL_ALUMINUM_CONDUCTOR_RESTRICTION")
    ).toBe(true);
  });

  // Test Case 12: Candidate Evaluation Completeness
  it("returns complete candidate list spanning 14 AWG to 1000 kcmil", () => {
    const { candidates } = evaluateCandidateConductors(240, 50, 50, 100, "copper");
    expect(candidates.length).toBeGreaterThan(15);
    expect(candidates[0].size).toBe("14 AWG");
    expect(candidates[candidates.length - 1].size).toBe("1000 kcmil");
  });

  // Test Case 13: Invalid Input Rejection
  it("rejects zero or negative electrical inputs with RangeError", () => {
    expect(() => calculateVoltageDrop(0, 50, 100, 26240)).toThrow(RangeError);
    expect(() => calculateVoltageDrop(240, -10, 100, 26240)).toThrow(RangeError);
    expect(() => calculateVoltageDrop(240, 50, 0, 26240)).toThrow(RangeError);
    expect(() =>
      calculateVoltageDropProject({
        voltage: 240,
        loadCurrentAmps: 50,
        distanceFt: 100,
        targetMaxVoltageDropPercent: 0,
      })
    ).toThrow(RangeError);
  });

  // Test Case 14: Electrical Disclaimer is Always Present
  it("always includes electrical engineering and NEC disclaimer", () => {
    const res = calculateVoltageDropProject({
      voltage: 240,
      loadCurrentAmps: 50,
      distanceFt: 100,
    });

    expect(
      res.warnings.some((w) => w.code === "ELECTRICAL_ENGINEERING_DISCLAIMER")
    ).toBe(true);
  });

  // Test Case 15: 12V DC Marine / Solar Circuit Sizing
  it("accurately calculates 12V DC circuit voltage drop and sizes conductor for 3% critical limit", () => {
    // 12V DC, 20A load, 25 ft run, 10 AWG copper (10,380 CM)
    // VD = (2 * 12.9 * 20 * 25) / 10380 = 1.2427V -> 1.24V (10.36% drop)
    const raw = calculateVoltageDrop(12, 20, 25, 10380, "copper", "dc");
    expect(raw.voltageDropVolts).toBeCloseTo(1.24, 2);
    expect(raw.voltageDropPercent).toBeCloseTo(10.36, 1);
    expect(raw.voltageAtLoad).toBeCloseTo(10.76, 2);

    // Full project: target 3% drop on 12V (<= 0.36V drop)
    // 4 AWG (41,740 CM): VD = 12,900 / 41,740 = 0.309V -> 2.58% drop (PASS <= 3%)
    const res = calculateVoltageDropProject({
      voltage: 12,
      phase: "dc",
      loadCurrentAmps: 20,
      distanceFt: 25,
      material: "copper",
      targetMaxVoltageDropPercent: 3.0,
    });

    expect(res.recommendedSize).toBe("4 AWG");
    expect(res.voltageDropPercent).toBeLessThanOrEqual(3.0);
    expect(res.is3PctCompliant).toBe(true);
  });
});
