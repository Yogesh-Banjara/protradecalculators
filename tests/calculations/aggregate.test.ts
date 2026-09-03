import { describe, it, expect } from "vitest";
import {
  calculateAggregateSection,
  calculateAggregateProject,
} from "@/lib/calculations/aggregate";
import type {
  AggregateProjectInput,
  AggregateSectionInput,
} from "@/types/aggregate";

describe("Aggregate & Gravel Calculation Engine (TASK 003 Accuracy Suite)", () => {
  // Test Case 1: Rectangular gravel area (50 ft × 12 ft × 4 in driveway)
  it("calculates 50 ft × 12 ft × 4 in gravel driveway with 10% waste accurately", () => {
    const section: AggregateSectionInput = {
      id: "sec-1",
      name: "Main Driveway",
      shape: "rectangular",
      quantity: 1,
      length: 50,
      width: 12,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const sectionRes = calculateAggregateSection(section);
    // 50 * 12 * (4/12) = 200 cu ft -> 7.407 cu yd
    expect(sectionRes.volumeCuFt).toBe(200);
    expect(sectionRes.volumeCuYd).toBeCloseTo(7.407, 3);

    const project: AggregateProjectInput = {
      sections: [section],
      materialId: "gravel", // 100 lb/cu ft -> 1.35 tons/yd³
      adjustmentMode: "waste",
      adjustmentPercent: 10,
      truckCapacityTons: 15,
    };

    const result = calculateAggregateProject(project);
    expect(result.netVolumeCuYd).toBeCloseTo(7.41, 2);
    // 200 * 1.10 = 220 cu ft -> 8.148 cu yd
    expect(result.adjustedVolumeCuFt).toBe(220);
    expect(result.adjustedVolumeCuYd).toBeCloseTo(8.15, 2);
    // 220 cu ft * 100 lb/cu ft = 22,000 lbs -> 11.00 tons
    expect(result.totalWeightLbs).toBe(22000);
    expect(result.totalTons).toBe(11.0);
    // 11 tons / 15 ton truck = 1 load
    expect(result.truckloadEstimate.loadsRequired).toBe(1);
    expect(result.truckloadEstimate.exactLoads).toBeCloseTo(0.73, 2);
  });

  // Test Case 2: Circular gravel area (14 ft diameter × 3 in depth round patio)
  it("calculates circular patio area (14 ft diameter × 3 in depth)", () => {
    const section: AggregateSectionInput = {
      id: "sec-circle",
      name: "Round Firepit Ring",
      shape: "circular",
      quantity: 1,
      diameter: 14,
      depth: 3,
      lengthUnit: "foot",
      diameterUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateAggregateSection(section);
    // radius = 7 ft, depth = 3/12 = 0.25 ft
    // volume = pi * 49 * 0.25 = 38.4845 cu ft -> 1.425 cu yd
    expect(res.volumeCuFt).toBeCloseTo(38.485, 2);
    expect(res.volumeCuYd).toBeCloseTo(1.425, 2);

    const projectRes = calculateAggregateProject({
      sections: [section],
      materialId: "pea-gravel", // 100 lb/cu ft
      adjustmentMode: "waste",
      adjustmentPercent: 10,
    });

    // 38.485 * 1.10 = 42.333 cu ft -> 4,233.3 lbs = 2.12 tons
    expect(projectRes.adjustedVolumeCuFt).toBeCloseTo(42.33, 1);
    expect(projectRes.totalTons).toBeCloseTo(2.12, 2);
  });

  // Test Case 3: Multiple project sections (Driveway 20x50x4 in + Side path 3x40x3 in)
  it("aggregates multiple project sections with crusher run compaction", () => {
    const driveway: AggregateSectionInput = {
      id: "sec-1",
      name: "Driveway",
      shape: "rectangular",
      quantity: 1,
      length: 50,
      width: 20,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const sidePath: AggregateSectionInput = {
      id: "sec-2",
      name: "Side Walkway",
      shape: "rectangular",
      quantity: 1,
      length: 40,
      width: 3,
      depth: 3,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const projectRes = calculateAggregateProject({
      sections: [driveway, sidePath],
      materialId: "crusher-run", // 115 lb/cu ft
      adjustmentMode: "compaction",
      adjustmentPercent: 12,
      truckCapacityTons: 15,
    });

    // Driveway: 50 * 20 * (4/12) = 333.33 cu ft
    // Side path: 40 * 3 * (3/12) = 30.00 cu ft
    // Net total = 363.33 cu ft = 13.46 cu yd
    expect(projectRes.sections.length).toBe(2);
    expect(projectRes.netVolumeCuFt).toBeCloseTo(363.33, 1);
    expect(projectRes.netVolumeCuYd).toBeCloseTo(13.46, 2);

    // Adjusted (+12% compaction): 363.33 * 1.12 = 406.93 cu ft = 15.07 cu yd
    expect(projectRes.adjustedVolumeCuFt).toBeCloseTo(406.93, 1);
    expect(projectRes.adjustedVolumeCuYd).toBeCloseTo(15.07, 2);

    // Weight: 406.93 cu ft * 115 lb/cu ft = 46,797.3 lbs = 23.40 tons
    expect(projectRes.totalWeightLbs).toBeCloseTo(46797.3, 0);
    expect(projectRes.totalTons).toBeCloseTo(23.40, 2);

    // Truckloads: 23.40 tons / 15 = 2 loads (exact 1.56)
    expect(projectRes.truckloadEstimate.loadsRequired).toBe(2);
    expect(projectRes.truckloadEstimate.exactLoads).toBeCloseTo(1.56, 2);
  });

  // Test Case 4: Inches to Feet conversion
  it("converts dimension units accurately (inches -> feet)", () => {
    const section: AggregateSectionInput = {
      id: "sec-inches",
      name: "Small Trench",
      shape: "rectangular",
      quantity: 1,
      length: 120, // 10 ft
      width: 24,  // 2 ft
      depth: 6,   // 0.5 ft
      lengthUnit: "inch",
      depthUnit: "inch",
    };

    const res = calculateAggregateSection(section);
    // 10 * 2 * 0.5 = 10 cu ft
    expect(res.volumeCuFt).toBe(10);
    expect(res.volumeCuYd).toBeCloseTo(0.370, 3);
  });

  // Test Case 5: Feet to Meters conversion
  it("handles metric dimension inputs accurately (meters and cm)", () => {
    const section: AggregateSectionInput = {
      id: "sec-metric",
      name: "Metric Base Layer",
      shape: "rectangular",
      quantity: 1,
      length: 6,
      width: 4,
      depth: 10,
      lengthUnit: "meter",
      depthUnit: "centimeter",
    };

    const res = calculateAggregateSection(section);
    // 6m * 4m * 0.1m = 2.4 m³
    // 2.4 m³ = 84.755 cu ft -> 3.139 cu yd
    expect(res.volumeCuMeters).toBeCloseTo(2.4, 2);
    expect(res.volumeCuFt).toBeCloseTo(84.76, 1);
    expect(res.volumeCuYd).toBeCloseTo(3.14, 2);
  });

  // Test Case 6: Volume conversions consistency
  it("converts between cu ft, cu yd, and cubic meters with high precision", () => {
    const section: AggregateSectionInput = {
      id: "sec-vol",
      name: "Volume Check",
      shape: "rectangular",
      quantity: 1,
      length: 27,
      width: 1,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateAggregateSection(section);
    expect(res.volumeCuFt).toBe(27);
    expect(res.volumeCuYd).toBe(1.0);
    expect(res.volumeCuMeters).toBeCloseTo(0.7646, 3);
  });

  // Test Case 7: Density to weight conversion
  it("applies material density correctly to calculate total weight", () => {
    const section: AggregateSectionInput = {
      id: "sec-w",
      name: "Weight Check",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // exactly 100 cu ft

    // #57 Stone (95 lb/cu ft) with 0% adjustment
    const res57 = calculateAggregateProject({
      sections: [section],
      materialId: "stone-57",
      adjustmentMode: "none",
      adjustmentPercent: 0,
    });
    expect(res57.totalWeightLbs).toBe(9500);
    expect(res57.totalTons).toBe(4.75);

    // Limestone (105 lb/cu ft) with 0% adjustment
    const resLime = calculateAggregateProject({
      sections: [section],
      materialId: "limestone",
      adjustmentMode: "none",
      adjustmentPercent: 0,
    });
    expect(resLime.totalWeightLbs).toBe(10500);
    expect(resLime.totalTons).toBe(5.25);
  });

  // Test Case 8: Pounds to Tons conversion
  it("converts pounds to short tons (2,000 lbs = 1 ton)", () => {
    const section: AggregateSectionInput = {
      id: "sec-t",
      name: "Tonnage Check",
      shape: "rectangular",
      quantity: 1,
      length: 20,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 200 cu ft

    const res = calculateAggregateProject({
      sections: [section],
      materialId: "gravel", // 100 lb/cu ft -> 20,000 lbs
      adjustmentMode: "none",
      adjustmentPercent: 0,
    });

    expect(res.totalWeightLbs).toBe(20000);
    expect(res.totalTons).toBe(10.0);
  });

  // Test Case 9: Waste adjustment mode
  it("calculates waste allowances correctly across preset percentages", () => {
    const section: AggregateSectionInput = {
      id: "sec-waste",
      name: "Waste Check",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 100 cu ft

    // 5% waste
    const res5 = calculateAggregateProject({
      sections: [section],
      materialId: "gravel",
      adjustmentMode: "waste",
      adjustmentPercent: 5,
    });
    expect(res5.adjustedVolumeCuFt).toBe(105);

    // 15% waste
    const res15 = calculateAggregateProject({
      sections: [section],
      materialId: "gravel",
      adjustmentMode: "waste",
      adjustmentPercent: 15,
    });
    expect(res15.adjustedVolumeCuFt).toBe(115);
  });

  // Test Case 10: Compaction adjustment mode
  it("calculates compaction allowance for dense grade aggregate", () => {
    const section: AggregateSectionInput = {
      id: "sec-comp",
      name: "Compaction Check",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 100 cu ft

    const res = calculateAggregateProject({
      sections: [section],
      materialId: "crusher-run",
      adjustmentMode: "compaction",
      adjustmentPercent: 15,
    });

    expect(res.adjustedVolumeCuFt).toBe(115);
    expect(res.adjustmentMode).toBe("compaction");
    expect(res.adjustmentPercent).toBe(15);
  });

  // Test Case 11: Truckload ceiling rounding
  it("rounds up truckload requirements to whole loads correctly", () => {
    const section: AggregateSectionInput = {
      id: "sec-truck",
      name: "Truck Sizing",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 100 cu ft * 100 lb = 10,000 lbs = 5 tons

    // 5 tons with 10 ton truck -> 1 load (exact 0.5)
    const res1 = calculateAggregateProject({
      sections: [section],
      materialId: "gravel",
      adjustmentMode: "none",
      adjustmentPercent: 0,
      truckCapacityTons: 10,
    });
    expect(res1.truckloadEstimate.loadsRequired).toBe(1);
    expect(res1.truckloadEstimate.exactLoads).toBe(0.5);
    expect(res1.truckloadEstimate.leftoverTons).toBe(5);

    // 16 tons with 15 ton truck -> 2 loads (exact 1.07)
    const sectionBig: AggregateSectionInput = {
      id: "sec-big",
      name: "Big",
      shape: "rectangular",
      quantity: 1,
      length: 32,
      width: 10,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 320 cu ft * 100 = 32,000 lbs = 16 tons

    const res2 = calculateAggregateProject({
      sections: [sectionBig],
      materialId: "gravel",
      adjustmentMode: "none",
      adjustmentPercent: 0,
      truckCapacityTons: 15,
    });
    expect(res2.truckloadEstimate.loadsRequired).toBe(2);
    expect(res2.truckloadEstimate.exactLoads).toBeCloseTo(1.07, 2);
    expect(res2.truckloadEstimate.leftoverTons).toBeCloseTo(14.0, 1);
  });

  // Test Case 12: Invalid dimensions rejection
  it("rejects zero or negative dimensions with RangeError", () => {
    const zeroLen: AggregateSectionInput = {
      id: "s1",
      name: "Zero Length",
      shape: "rectangular",
      quantity: 1,
      length: 0,
      width: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };
    expect(() => calculateAggregateSection(zeroLen)).toThrow(RangeError);

    const negDiam: AggregateSectionInput = {
      id: "s2",
      name: "Negative Diameter",
      shape: "circular",
      quantity: 1,
      diameter: -10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };
    expect(() => calculateAggregateSection(negDiam)).toThrow(RangeError);
  });

  // Test Case 13: Invalid density rejection
  it("rejects zero or negative custom density with RangeError", () => {
    const section: AggregateSectionInput = {
      id: "s1",
      name: "Test",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    expect(() =>
      calculateAggregateProject({
        sections: [section],
        materialId: "custom",
        customDensityLbsPerCuFt: 0,
        adjustmentMode: "waste",
        adjustmentPercent: 10,
      })
    ).toThrow(RangeError);
  });

  // Test Case 14: Invalid truck capacity rejection
  it("rejects non-positive truck capacity with RangeError", () => {
    const section: AggregateSectionInput = {
      id: "s1",
      name: "Test",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    expect(() =>
      calculateAggregateProject({
        sections: [section],
        materialId: "gravel",
        adjustmentMode: "waste",
        adjustmentPercent: 10,
        truckCapacityTons: -5,
      })
    ).toThrow(RangeError);
  });

  // Test Case 15: Decimal dimensions
  it("calculates decimal dimension inputs accurately", () => {
    const section: AggregateSectionInput = {
      id: "sec-dec",
      name: "Decimal Layer",
      shape: "rectangular",
      quantity: 1,
      length: 32.5,
      width: 11.25,
      depth: 2.75,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateAggregateSection(section);
    // 32.5 * 11.25 * (2.75/12) = 83.789 cu ft = 3.103 cu yd
    expect(res.volumeCuFt).toBeCloseTo(83.789, 2);
    expect(res.volumeCuYd).toBeCloseTo(3.103, 2);
  });

  // Test Case 16: Very large commercial scale dimensions
  it("handles very large commercial projects without overflow", () => {
    const section: AggregateSectionInput = {
      id: "sec-commercial",
      name: "Commercial Lot Base",
      shape: "rectangular",
      quantity: 1,
      length: 1000,
      width: 200,
      depth: 6,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateAggregateSection(section);
    // 1000 * 200 * (6/12) = 100,000 cu ft = 3,703.70 cu yd
    expect(res.volumeCuFt).toBe(100000);
    expect(res.volumeCuYd).toBeCloseTo(3703.7, 1);

    const projectRes = calculateAggregateProject({
      sections: [section],
      materialId: "crusher-run", // 115 lb/cu ft
      adjustmentMode: "none",
      adjustmentPercent: 0,
      truckCapacityTons: 20,
    });

    // 100,000 * 115 = 11,500,000 lbs = 5,750 tons
    expect(projectRes.totalWeightLbs).toBe(11500000);
    expect(projectRes.totalTons).toBe(5750);
    // 5750 / 20 = 288 loads (exact 287.5)
    expect(projectRes.truckloadEstimate.loadsRequired).toBe(288);
  });

  // Test Case 17: Unit consistency
  it("produces identical volume and tonnage across equivalent unit inputs", () => {
    const inFeet: AggregateSectionInput = {
      id: "s1",
      name: "Feet Section",
      shape: "rectangular",
      quantity: 1,
      length: 20,
      width: 10,
      depth: 1,
      lengthUnit: "foot",
      depthUnit: "foot",
    };

    const inInches: AggregateSectionInput = {
      id: "s2",
      name: "Inches Section",
      shape: "rectangular",
      quantity: 1,
      length: 240,
      width: 120,
      depth: 12,
      lengthUnit: "inch",
      depthUnit: "inch",
    };

    const resFeet = calculateAggregateSection(inFeet);
    const resInches = calculateAggregateSection(inInches);

    expect(resFeet.volumeCuFt).toBe(200);
    expect(resInches.volumeCuFt).toBe(200);
    expect(resFeet.volumeCuYd).toBeCloseTo(resInches.volumeCuYd, 4);
  });

  // Test Case 18: Optional bagged aggregate estimation
  it("calculates retail bag equivalents (50 lb and 80 lb) correctly", () => {
    const section: AggregateSectionInput = {
      id: "s-bag",
      name: "Small Garden Patch",
      shape: "rectangular",
      quantity: 1,
      length: 10,
      width: 2,
      depth: 6,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 10 cu ft * 100 lb/cu ft = 1,000 lbs

    const projectRes = calculateAggregateProject({
      sections: [section],
      materialId: "gravel",
      adjustmentMode: "none",
      adjustmentPercent: 0,
    });

    expect(projectRes.totalWeightLbs).toBe(1000);

    const bag50 = projectRes.bagEstimates.find((b) => b.bagWeightLbs === 50);
    expect(bag50?.bagsRequired).toBe(20);
    expect(bag50?.exactBags).toBe(20);

    const bag80 = projectRes.bagEstimates.find((b) => b.bagWeightLbs === 80);
    // 1000 / 80 = 12.5 -> 13 bags
    expect(bag80?.bagsRequired).toBe(13);
    expect(bag80?.exactBags).toBe(12.5);
  });
});
