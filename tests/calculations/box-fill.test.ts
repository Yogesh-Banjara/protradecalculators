import { describe, it, expect } from "vitest";
import {
  calculateBoxFillProject,
  getLargestConductorSize,
} from "@/lib/calculations/box-fill";
import type { BoxFillInput } from "@/types/box-fill";

describe("Electrical Box Fill Calculation Engine (TASK 014 Accuracy Suite)", () => {
  // Test Case 1: Basic 14 AWG box (4 conductors @ 2.00 cu in each)
  it("calculates basic 14 AWG conductor fill volume accurately", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "14 AWG", count: 4 }],
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    // 4 * 2.00 = 8.00 cu in
    expect(res.totalRequiredVolumeCuIn).toBe(8.0);
    expect(res.totalConductorCount).toBe(4);
    expect(res.breakdown.conductorVolumeCuIn).toBe(8.0);
  });

  // Test Case 2: Basic 12 AWG box (6 conductors @ 2.25 cu in each)
  it("calculates basic 12 AWG conductor fill volume accurately", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 6 }],
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    // 6 * 2.25 = 13.50 cu in
    expect(res.totalRequiredVolumeCuIn).toBe(13.5);
    expect(res.breakdown.conductorVolumeCuIn).toBe(13.5);
  });

  // Test Case 3: Mixed 12 + 14 AWG conductors
  it("calculates mixed 12 AWG and 14 AWG conductors correctly", () => {
    const input: BoxFillInput = {
      conductors: [
        { id: "1", size: "12 AWG", count: 4 }, // 4 * 2.25 = 9.0 cu in
        { id: "2", size: "14 AWG", count: 2 }, // 2 * 2.00 = 4.0 cu in
      ],
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    // 9.0 + 4.0 = 13.00 cu in
    expect(res.totalRequiredVolumeCuIn).toBe(13.0);
  });

  // Test Case 4: Multiple grounds (1 to 4 grounds = 1 volume allowance)
  it("applies 1 volume allowance for 1 to 4 equipment grounds", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 4 }], // 9.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 3, // 3 grounds -> 1x 12 AWG allowance (2.25 cu in)
    };

    const res = calculateBoxFillProject(input);
    expect(res.breakdown.groundAllowanceCount).toBe(1);
    expect(res.breakdown.groundVolumeCuIn).toBe(2.25);
    expect(res.totalRequiredVolumeCuIn).toBe(11.25); // 9.0 + 2.25
  });

  // Test Case 5: More than 4 grounds (NEC 2020/2023 0.25 additional ground rule)
  it("applies 0.25 allowance for each ground beyond 4 per NEC 2020/2023", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 4 }], // 9.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 6, // 1 + 2 * 0.25 = 1.5 allowances * 2.25 = 3.375 -> 3.38 cu in
    };

    const res = calculateBoxFillProject(input);
    expect(res.breakdown.groundAllowanceCount).toBe(1.5);
    expect(res.breakdown.groundVolumeCuIn).toBe(3.38);
    expect(res.totalRequiredVolumeCuIn).toBe(12.38); // 9.0 + 3.38
    expect(
      res.warnings.some((w) => w.code === "NEC_2020_GROUND_COUNT_FACTOR_APPLIED")
    ).toBe(true);
  });

  // Test Case 6: Single-gang device yoke (2 volume allowances per NEC 314.16(B)(4))
  it("applies double volume allowance (2x) for single-gang device yoke", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "14 AWG", count: 2 }], // 4.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [
        {
          id: "dev-1",
          name: "Single-Pole Switch",
          largestConnectedSize: "14 AWG",
          gangCount: 1,
        }, // 2 * 2.0 = 4.0 cu in
      ],
      equipmentGroundsCount: 1, // 1 * 2.0 = 2.0 cu in
    };

    const res = calculateBoxFillProject(input);
    // 4.0 (wires) + 4.0 (switch) + 2.0 (ground) = 10.0 cu in
    expect(res.breakdown.deviceVolumeCuIn).toBe(4.0);
    expect(res.totalRequiredVolumeCuIn).toBe(10.0);
  });

  // Test Case 7: Internal Cable Clamps (1 volume allowance total)
  it("applies exactly 1 volume allowance for internal cable clamps based on largest wire", () => {
    const input: BoxFillInput = {
      conductors: [
        { id: "1", size: "14 AWG", count: 2 }, // 4.0 cu in
        { id: "2", size: "12 AWG", count: 2 }, // 4.5 cu in
      ],
      internalClampsCount: 2, // 2 clamps -> 1x largest wire (12 AWG = 2.25 cu in)
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    expect(res.breakdown.clampAllowanceCount).toBe(1);
    expect(res.breakdown.clampAllowanceSize).toBe("12 AWG");
    expect(res.breakdown.clampVolumeCuIn).toBe(2.25);
    expect(res.totalRequiredVolumeCuIn).toBe(10.75); // 4.0 + 4.5 + 2.25
  });

  // Test Case 8: Support Fittings / Fixture Studs
  it("calculates support fittings volume correctly", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "14 AWG", count: 2 }], // 4.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 1, // 1 stud * 2.0 = 2.0 cu in
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    expect(res.breakdown.fittingVolumeCuIn).toBe(2.0);
    expect(res.totalRequiredVolumeCuIn).toBe(6.0);
  });

  // Test Case 9: Multiple devices (Two Single-Gang Yokes)
  it("calculates multiple devices in box correctly", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 4 }], // 9.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [
        { id: "1", name: "Switch 1", largestConnectedSize: "12 AWG", gangCount: 1 }, // 4.5 cu in
        { id: "2", name: "Switch 2", largestConnectedSize: "12 AWG", gangCount: 1 }, // 4.5 cu in
      ],
      equipmentGroundsCount: 2, // 2.25 cu in
    };

    const res = calculateBoxFillProject(input);
    // 9.0 + 4.5 + 4.5 + 2.25 = 20.25 cu in
    expect(res.breakdown.deviceVolumeCuIn).toBe(9.0);
    expect(res.totalRequiredVolumeCuIn).toBe(20.25);
  });

  // Test Case 10: Candidate Box Recommendation (Smallest Compliant Standard Box)
  it("recommends the smallest compliant standard box", () => {
    // 20.25 cu in required:
    // 4" Square 1-1/2" (21.0 cu in) -> PASSES and is smaller than 4" Square 2-1/8" (30.3 cu in)
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 4 }],
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [
        { id: "1", name: "Switch 1", largestConnectedSize: "12 AWG", gangCount: 1 },
        { id: "2", name: "Switch 2", largestConnectedSize: "12 AWG", gangCount: 1 },
      ],
      equipmentGroundsCount: 2,
    };

    const res = calculateBoxFillProject(input);
    expect(res.recommendedBox.id).toBe("plastic-1g-20");
    expect(res.recommendedBox.standardVolumeCuIn).toBe(20.3);
  });

  // Test Case 11: Exact Boundary Fit
  it("passes when required volume exactly equals available box volume", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "14 AWG", count: 9 }], // 18.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
      selectedBoxId: "square-4-1-1-4", // 18.0 cu in capacity
    };

    const res = calculateBoxFillProject(input);
    expect(res.totalRequiredVolumeCuIn).toBe(18.0);
    expect(res.totalAvailableVolumeCuIn).toBe(18.0);
    expect(res.fillPercentage).toBe(100.0);
    expect(res.isCompliant).toBe(true);
  });

  // Test Case 12: Insufficient Box (Overfill Warning)
  it("flags overfill warning when required volume exceeds available capacity", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 8 }], // 18.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
      selectedBoxId: "handy-1-1-2", // 10.3 cu in capacity
    };

    const res = calculateBoxFillProject(input);
    expect(res.isCompliant).toBe(false);
    expect(
      res.warnings.some((w) => w.code === "BOX_VOLUME_OVERFILL_NON_COMPLIANT")
    ).toBe(true);
  });

  // Test Case 13: Mud / Plaster Ring Addition
  it("adds listed mud ring volume to base box capacity", () => {
    const input: BoxFillInput = {
      conductors: [{ id: "1", size: "12 AWG", count: 8 }], // 18.0 cu in
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [
        { id: "1", name: "Duplex Receptacle", largestConnectedSize: "12 AWG", gangCount: 1 }, // 4.5 cu in
      ],
      equipmentGroundsCount: 2, // 2.25 cu in
      selectedBoxId: "square-4-1-1-2", // 21.0 cu in base box
      selectedMudRingId: "1g-1-2", // +3.5 cu in 1/2" ring -> 24.5 cu in total
    };

    const res = calculateBoxFillProject(input);
    // Required: 18.0 + 4.5 + 2.25 = 24.75 cu in
    // Available: 21.0 + 3.5 = 24.5 cu in
    expect(res.baseBoxVolumeCuIn).toBe(21.0);
    expect(res.mudRingVolumeCuIn).toBe(3.5);
    expect(res.totalAvailableVolumeCuIn).toBe(24.5);
    expect(res.isCompliant).toBe(false); // 24.75 > 24.5
  });

  // Test Case 14: Pigtails Count as Zero Volume Allowance
  it("does not deduct volume for internal pigtails", () => {
    const input: BoxFillInput = {
      conductors: [
        { id: "1", size: "12 AWG", count: 4, isPigtail: false }, // 9.0 cu in
        { id: "2", size: "12 AWG", count: 2, isPigtail: true }, // 0.0 cu in
      ],
      internalClampsCount: 0,
      supportFittingsCount: 0,
      devices: [],
      equipmentGroundsCount: 0,
    };

    const res = calculateBoxFillProject(input);
    expect(res.totalConductorCount).toBe(4);
    expect(res.totalRequiredVolumeCuIn).toBe(9.0);
  });

  // Test Case 15: Invalid Empty Inputs Rejection
  it("rejects empty inputs with RangeError", () => {
    expect(() =>
      calculateBoxFillProject({
        conductors: [],
        internalClampsCount: 0,
        supportFittingsCount: 0,
        devices: [],
        equipmentGroundsCount: 0,
      })
    ).toThrow(RangeError);
  });

  // Test Case 16: Helper getLargestConductorSize
  it("identifies largest conductor size correctly", () => {
    const largest = getLargestConductorSize([
      { id: "1", size: "14 AWG", count: 2 },
      { id: "2", size: "6 AWG", count: 1 },
      { id: "3", size: "10 AWG", count: 3 },
    ]);
    expect(largest).toBe("6 AWG");
  });
});
