import { describe, it, expect } from "vitest";
import {
  calculateConcreteSection,
  calculateConcreteProject,
} from "@/lib/calculations/concrete";
import type { ConcreteProjectInput, ConcreteSectionInput } from "@/types/concrete";

describe("Concrete Calculation Engine (TASK 002 Accuracy Suite)", () => {
  // Test Case 1: 10 ft × 10 ft × 4 in slab
  it("calculates 10 ft × 10 ft × 4 in slab with 10% waste accurately", () => {
    const section: ConcreteSectionInput = {
      id: "sec-1",
      name: "10x10 Patio Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const sectionRes = calculateConcreteSection(section);
    // 10 * 10 * (4/12) = 33.333 cu ft -> 1.235 cu yd
    expect(sectionRes.volumeCuFt).toBeCloseTo(33.333, 2);
    expect(sectionRes.volumeCuYd).toBeCloseTo(1.235, 2);

    const project: ConcreteProjectInput = {
      sections: [section],
      wastePercent: 10,
    };

    const result = calculateConcreteProject(project);
    expect(result.netVolumeCuYd).toBeCloseTo(1.23, 2);
    // 1.235 * 1.10 = 1.358 cu yd -> total 36.67 cu ft
    expect(result.totalVolumeCuYd).toBeCloseTo(1.36, 2);
    expect(result.totalVolumeCuFt).toBeCloseTo(36.67, 2);
    // Ready mix rounds up to 0.25 increment: 1.36 -> 1.50 cu yd
    expect(result.recommendedOrderYards).toBe(1.50);

    // 80lb bag check (0.60 cu ft yield): 36.67 / 0.60 = 61.11 -> 62 bags
    const bag80 = result.bagEstimates.find((b) => b.bagWeightLbs === 80);
    expect(bag80?.bagsRequired).toBe(62);
    expect(bag80?.exactBags).toBeCloseTo(61.11, 1);
  });

  // Test Case 2: 12 ft × 20 ft × 4 in slab
  it("calculates 12 ft × 20 ft × 4 in slab accurately", () => {
    const section: ConcreteSectionInput = {
      id: "sec-1",
      name: "Driveway Section",
      shape: "rectangular-slab",
      quantity: 1,
      length: 12,
      width: 20,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const sectionRes = calculateConcreteSection(section);
    // 12 * 20 * (4/12) = 80 cu ft = 2.963 cu yd
    expect(sectionRes.volumeCuFt).toBe(80);
    expect(sectionRes.volumeCuYd).toBeCloseTo(2.963, 3);

    const projectRes = calculateConcreteProject({
      sections: [section],
      wastePercent: 10,
    });

    // 80 * 1.10 = 88 cu ft -> 88 / 27 = 3.259 cu yd
    expect(projectRes.totalVolumeCuFt).toBe(88);
    expect(projectRes.totalVolumeCuYd).toBeCloseTo(3.26, 2);
    // Ready mix recommendation: 3.26 -> 3.50 cu yd
    expect(projectRes.recommendedOrderYards).toBe(3.50);
  });

  // Test Case 3: Circular slab
  it("calculates circular slab (10 ft diameter × 4 in thickness)", () => {
    const section: ConcreteSectionInput = {
      id: "sec-circle",
      name: "Round Firepit Pad",
      shape: "circular-slab",
      quantity: 1,
      diameter: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
      diameterUnit: "foot",
    };

    const res = calculateConcreteSection(section);
    // radius = 5 ft, depth = 4/12 = 0.3333 ft
    // volume = pi * 25 * 0.3333 = 26.180 cu ft -> 26.180 / 27 = 0.970 cu yd
    expect(res.volumeCuFt).toBeCloseTo(26.18, 1);
    expect(res.volumeCuYd).toBeCloseTo(0.97, 2);
  });

  // Test Case 4: Footing
  it("calculates continuous footing (50 ft length × 1.5 ft width × 1 ft depth)", () => {
    const section: ConcreteSectionInput = {
      id: "sec-footing",
      name: "Wall Footing",
      shape: "continuous-footing",
      quantity: 1,
      length: 50,
      width: 1.5,
      depth: 1,
      lengthUnit: "foot",
      depthUnit: "foot",
    };

    const res = calculateConcreteSection(section);
    // 50 * 1.5 * 1 = 75 cu ft -> 75 / 27 = 2.778 cu yd
    expect(res.volumeCuFt).toBe(75);
    expect(res.volumeCuYd).toBeCloseTo(2.778, 3);
  });

  // Test Case 5: Multiple project sections combined
  it("aggregates multiple project sections (Patio Slab + Footing + 4 Round Posts)", () => {
    const slab: ConcreteSectionInput = {
      id: "sec-1",
      name: "Patio Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 12,
      width: 20,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const footing: ConcreteSectionInput = {
      id: "sec-2",
      name: "Perimeter Footing",
      shape: "continuous-footing",
      quantity: 1,
      length: 20,
      width: 1,
      depth: 8,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const posts: ConcreteSectionInput = {
      id: "sec-3",
      name: "Deck Post Piers",
      shape: "round-column",
      quantity: 4,
      diameter: 12,
      depth: 3,
      lengthUnit: "inch",
      diameterUnit: "inch",
      depthUnit: "foot",
    };

    const projectRes = calculateConcreteProject({
      sections: [slab, footing, posts],
      wastePercent: 10,
    });

    // Slab = 80 cu ft
    // Footing = 20 * 1 * (8/12) = 13.33 cu ft
    // Posts (4x): r = 0.5 ft, depth = 3 ft -> pi * 0.25 * 3 * 4 = 9.42 cu ft
    // Net total = 80 + 13.33 + 9.42 = 102.75 cu ft = 3.81 cu yd
    expect(projectRes.sections.length).toBe(3);
    expect(projectRes.netVolumeCuFt).toBeCloseTo(102.75, 1);
    expect(projectRes.netVolumeCuYd).toBeCloseTo(3.81, 1);

    // With 10% waste: 102.75 * 1.10 = 113.03 cu ft = 4.19 cu yd
    expect(projectRes.totalVolumeCuYd).toBeCloseTo(4.19, 1);
    // Ready-mix recommendation: 4.25 cu yd
    expect(projectRes.recommendedOrderYards).toBe(4.25);
  });

  // Test Case 6: Unit conversions (Metric input -> Yards/Cu Ft)
  it("handles metric dimension inputs accurately", () => {
    const section: ConcreteSectionInput = {
      id: "sec-metric",
      name: "Metric Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 3,
      width: 2,
      depth: 10,
      lengthUnit: "meter",
      depthUnit: "centimeter",
    };

    const res = calculateConcreteSection(section);
    // 3m * 2m * 0.1m = 0.6 m³
    // 0.6 m³ = 21.1888 cu ft -> 0.7848 cu yd
    expect(res.volumeCuMeters).toBeCloseTo(0.6, 2);
    expect(res.volumeCuFt).toBeCloseTo(21.19, 1);
    expect(res.volumeCuYd).toBeCloseTo(0.785, 3);
  });

  // Test Case 7: Waste calculations (0%, 5%, 10%, 15%, custom)
  it("calculates various waste allowances correctly", () => {
    const section: ConcreteSectionInput = {
      id: "sec-w",
      name: "Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 27,
      width: 1,
      depth: 12,
      lengthUnit: "foot",
      depthUnit: "inch",
    }; // 27 cu ft = exactly 1.0 cu yd net

    // 0% waste
    const res0 = calculateConcreteProject({ sections: [section], wastePercent: 0 });
    expect(res0.netVolumeCuYd).toBe(1.0);
    expect(res0.totalVolumeCuYd).toBe(1.0);
    expect(res0.warnings.some((w) => w.code === "ZERO_WASTE_WARNING")).toBe(true);

    // 5% waste
    const res5 = calculateConcreteProject({ sections: [section], wastePercent: 5 });
    expect(res5.totalVolumeCuYd).toBe(1.05);

    // 15% waste
    const res15 = calculateConcreteProject({ sections: [section], wastePercent: 15 });
    expect(res15.totalVolumeCuYd).toBe(1.15);

    // Custom 8% waste
    const res8 = calculateConcreteProject({ sections: [section], wastePercent: 8 });
    expect(res8.totalVolumeCuYd).toBe(1.08);
  });

  // Test Case 8: Zero and Negative input rejection
  it("rejects zero or negative dimensions with RangeError", () => {
    const invalidZeroLength: ConcreteSectionInput = {
      id: "sec-inv-1",
      name: "Bad Length",
      shape: "rectangular-slab",
      quantity: 1,
      length: 0,
      width: 10,
      depth: 4,
      lengthUnit: "foot",
      depthUnit: "inch",
    };
    expect(() => calculateConcreteSection(invalidZeroLength)).toThrow(RangeError);

    const invalidNegDiameter: ConcreteSectionInput = {
      id: "sec-inv-2",
      name: "Bad Diameter",
      shape: "round-column",
      quantity: 1,
      diameter: -12,
      depth: 3,
      lengthUnit: "inch",
      depthUnit: "foot",
    };
    expect(() => calculateConcreteSection(invalidNegDiameter)).toThrow(RangeError);
  });

  // Test Case 9: Missing input rejection
  it("rejects missing inputs with RangeError", () => {
    const missingDepth: ConcreteSectionInput = {
      id: "sec-inv-3",
      name: "Missing Depth",
      shape: "rectangular-slab",
      quantity: 1,
      length: 10,
      width: 10,
      lengthUnit: "foot",
      depthUnit: "inch",
    };
    expect(() => calculateConcreteSection(missingDepth)).toThrow(RangeError);
  });

  // Test Case 10: Decimal inputs
  it("calculates decimal inputs precisely", () => {
    const section: ConcreteSectionInput = {
      id: "sec-dec",
      name: "Decimal Dimensions Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 14.5,
      width: 8.25,
      depth: 3.5,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateConcreteSection(section);
    // 14.5 * 8.25 * (3.5/12) = 34.8906 cu ft = 1.2922 cu yd
    expect(res.volumeCuFt).toBeCloseTo(34.89, 2);
    expect(res.volumeCuYd).toBeCloseTo(1.29, 2);
  });

  // Test Case 11: Very large inputs (Commercial scale)
  it("handles very large commercial slabs without overflow", () => {
    const section: ConcreteSectionInput = {
      id: "sec-warehouse",
      name: "Warehouse Floor Slab",
      shape: "rectangular-slab",
      quantity: 1,
      length: 500,
      width: 500,
      depth: 6,
      lengthUnit: "foot",
      depthUnit: "inch",
    };

    const res = calculateConcreteSection(section);
    // 500 * 500 * (6/12) = 125,000 cu ft = 4,629.63 cu yd
    expect(res.volumeCuFt).toBe(125000);
    expect(res.volumeCuYd).toBeCloseTo(4629.63, 1);
  });

  // Test Case 12: Unit consistency
  it("produces identical volume when dimensions are supplied in equivalent units", () => {
    // 10 ft x 10 ft x 1 ft in feet
    const inFeet: ConcreteSectionInput = {
      id: "s1",
      name: "Feet",
      shape: "rectangular-slab",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 1,
      lengthUnit: "foot",
      depthUnit: "foot",
    };

    // 120 in x 120 in x 12 in in inches
    const inInches: ConcreteSectionInput = {
      id: "s2",
      name: "Inches",
      shape: "rectangular-slab",
      quantity: 1,
      length: 120,
      width: 120,
      depth: 12,
      lengthUnit: "inch",
      depthUnit: "inch",
    };

    const resFeet = calculateConcreteSection(inFeet);
    const resInches = calculateConcreteSection(inInches);

    expect(resFeet.volumeCuFt).toBe(100);
    expect(resInches.volumeCuFt).toBe(100);
    expect(resFeet.volumeCuYd).toBeCloseTo(resInches.volumeCuYd, 4);
  });

  // Test Case 13: Sonotube Pier Footing (12-inch diameter, 48-inch depth, 4 tubes)
  it("accurately calculates 4 Sonotubes of 12-inch diameter at 48-inch depth", () => {
    const sonotubeSection: ConcreteSectionInput = {
      id: "sono-1",
      name: "Sonotube Deck Piers",
      shape: "round-column",
      quantity: 4,
      diameter: 12,
      depth: 48,
      lengthUnit: "inch",
      depthUnit: "inch",
      diameterUnit: "inch",
    };

    const sectionRes = calculateConcreteSection(sonotubeSection);
    // 4 tubes * (pi * 0.5^2 * 4) = 4 * 3.14159 = 12.566 cu ft -> 12.566 / 27 = 0.4654 cu yd
    expect(sectionRes.volumeCuFt).toBeCloseTo(12.566, 2);
    expect(sectionRes.volumeCuYd).toBeCloseTo(0.4654, 3);

    const project: ConcreteProjectInput = {
      sections: [sonotubeSection],
      wastePercent: 10,
    };
    const projectRes = calculateConcreteProject(project);
    // Total with 10% waste: 12.566 * 1.10 = 13.823 cu ft -> 0.512 cu yd
    expect(projectRes.totalVolumeCuFt).toBeCloseTo(13.82, 1);
    // 80lb bags (0.60 cu ft): 13.82 / 0.60 = 23.03 -> 24 bags
    const bag80 = projectRes.bagEstimates.find((b) => b.bagWeightLbs === 80);
    expect(bag80?.bagsRequired).toBe(24);
  });
});
