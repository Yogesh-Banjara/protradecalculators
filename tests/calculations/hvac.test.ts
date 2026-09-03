import { describe, it, expect } from "vitest";
import { calculateHvacLoadProject } from "@/lib/calculations/hvac";
import type { HvacLoadInput } from "@/types/hvac";

describe("HVAC BTU Heating & Cooling Load Calculation Engine (TASK 016 Accuracy Suite)", () => {
  // Test Case 1: Standard Suburban Home (1800 sq ft, Zone 4)
  it("calculates realistic cooling load and AC tonnage for a standard 1,800 sq ft home", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 1800,
      ceilingHeightFt: 8,
      climateZone: "zone_4",
      insulationGrade: "average",
      sunExposure: "moderate",
      occupantsCount: 4,
      includeKitchen: true,
      windowAreaPercentage: 15,
      ductworkLocation: "unconditioned_attic",
    };

    const res = calculateHvacLoadProject(input);
    expect(res.conditionedAreaSqFt).toBe(1800);
    expect(res.conditionedVolumeCuFt).toBe(14400);
    // Typical realistic residential load in Zone 4 for 1800 sq ft is ~22k-30k BTU/hr (2.0 to 2.5 tons)
    expect(res.coolingLoadBtuHr).toBeGreaterThan(20000);
    expect(res.coolingLoadBtuHr).toBeLessThan(35000);
    expect([2.0, 2.5, 3.0]).toContain(res.recommendedCoolingTons);
    expect(res.breakdown.envelopeCoolingBtu).toBeGreaterThan(0);
    expect(res.breakdown.windowSolarCoolingBtu).toBeGreaterThan(0);
    expect(res.breakdown.infiltrationCoolingBtu).toBeGreaterThan(0);
  });

  // Test Case 2: Small Room (400 sq ft Master Bedroom Suite)
  it("calculates accurate single-room load and mini-split sizing", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 400,
      ceilingHeightFt: 8,
      climateZone: "zone_4",
      insulationGrade: "average",
      sunExposure: "moderate",
      occupantsCount: 2,
      includeKitchen: false,
      ductworkLocation: "conditioned_space",
    };

    const res = calculateHvacLoadProject(input);
    // 400 sq ft room in Zone 4 requires ~6k-10k BTU/hr
    expect(res.coolingLoadBtuHr).toBeGreaterThan(5000);
    expect(res.coolingLoadBtuHr).toBeLessThan(12000);
    expect(res.recommendedCoolingTons).toBe(1.5); // Minimum nominal standard size is 1.5 tons
    expect(res.miniSplitZoneRecommendation).toContain("Mini-Split");
  });

  // Test Case 3: Large Home (3,600 sq ft) Triggers Multi-System Warning
  it("handles large buildings and flags multi-zone commercial/residential capacity warnings", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 3600,
      ceilingHeightFt: 9,
      climateZone: "zone_2", // Hot zone
      insulationGrade: "average",
      sunExposure: "high",
      occupantsCount: 6,
      includeKitchen: true,
    };

    const res = calculateHvacLoadProject(input);
    expect(res.coolingLoadBtuHr).toBeGreaterThan(60000);
    expect(res.recommendedCoolingTons).toBe(5.0); // Caps at 5.0 single system
    expect(
      res.warnings.some((w) => w.code === "LARGE_COMMERCIAL_RESIDENTIAL_LOAD")
    ).toBe(true);
  });

  // Test Case 4: Climate Zone Sensitivity (Zone 1 Hot vs Zone 7 Extreme Cold)
  it("reflects higher cooling in Zone 1 and massive heating load in Zone 7", () => {
    const baseInput = {
      floorAreaSqFt: 1500,
      ceilingHeightFt: 8,
      insulationGrade: "average" as const,
      sunExposure: "moderate" as const,
      occupantsCount: 3,
      includeKitchen: true,
    };

    const zone1Res = calculateHvacLoadProject({ ...baseInput, climateZone: "zone_1" });
    const zone7Res = calculateHvacLoadProject({ ...baseInput, climateZone: "zone_7" });

    // Zone 1 has higher summer ΔT (+20°F) and latent humidity -> higher cooling
    expect(zone1Res.coolingLoadBtuHr).toBeGreaterThan(zone7Res.coolingLoadBtuHr);
    // Zone 7 has huge winter ΔT (+94°F vs +22°F) -> massive heating
    expect(zone7Res.heatingLoadBtuHr).toBeGreaterThan(zone1Res.heatingLoadBtuHr * 2.5);
    expect(
      zone7Res.warnings.some((w) => w.code === "HEATING_DOMINATED_CLIMATE_NOTICE")
    ).toBe(true);
  });

  // Test Case 5: Ceiling Height Sensitivity (8 ft vs 12 ft)
  it("scales thermal loads proportionally with ceiling height expansion", () => {
    const res8ft = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      ceilingHeightFt: 8,
      climateZone: "zone_4",
    });

    const res12ft = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      ceilingHeightFt: 12,
      climateZone: "zone_4",
    });

    expect(res12ft.conditionedVolumeCuFt).toBe(1500 * 12);
    expect(res12ft.coolingLoadBtuHr).toBeGreaterThan(res8ft.coolingLoadBtuHr);
    expect(res12ft.heatingLoadBtuHr).toBeGreaterThan(res8ft.heatingLoadBtuHr);
  });

  // Test Case 6: Insulation Quality Sensitivity (Poor vs Good)
  it("demonstrates significant load reduction from superior insulation and tight envelope", () => {
    const poorRes = calculateHvacLoadProject({
      floorAreaSqFt: 2000,
      climateZone: "zone_4",
      insulationGrade: "poor",
    });

    const goodRes = calculateHvacLoadProject({
      floorAreaSqFt: 2000,
      climateZone: "zone_4",
      insulationGrade: "good",
    });

    expect(poorRes.coolingLoadBtuHr).toBeGreaterThan(goodRes.coolingLoadBtuHr);
    expect(poorRes.heatingLoadBtuHr).toBeGreaterThan(goodRes.heatingLoadBtuHr * 1.5);
    expect(
      poorRes.warnings.some((w) => w.code === "POOR_INSULATION_HIGH_HEAT_LOAD")
    ).toBe(true);
  });

  // Test Case 7: Solar Exposure & Window Glazing Sensitivity
  it("adjusts window solar radiation cooling loads based on exposure", () => {
    const shadedRes = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      sunExposure: "low",
      windowAreaPercentage: 20,
    });

    const sunnyRes = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      sunExposure: "high",
      windowAreaPercentage: 20,
    });

    expect(sunnyRes.breakdown.windowSolarCoolingBtu).toBeGreaterThan(
      shadedRes.breakdown.windowSolarCoolingBtu
    );
  });

  // Test Case 8: Occupant Load Calculation (Sensible + Latent)
  it("adds sensible (230 BTU) and latent (200 BTU) body heat per occupant", () => {
    const res2People = calculateHvacLoadProject({
      floorAreaSqFt: 1000,
      occupantsCount: 2,
    });

    const res6People = calculateHvacLoadProject({
      floorAreaSqFt: 1000,
      occupantsCount: 6,
    });

    const occupantDiffSensible =
      res6People.breakdown.occupantSensibleBtu - res2People.breakdown.occupantSensibleBtu;
    const occupantDiffLatent =
      res6People.breakdown.occupantLatentBtu - res2People.breakdown.occupantLatentBtu;

    // 4 extra people * 230 = 920 BTU sensible
    expect(occupantDiffSensible).toBe(920);
    // 4 extra people * 200 = 800 BTU latent
    expect(occupantDiffLatent).toBe(800);
  });

  // Test Case 9: Kitchen / Appliance Load Toggle
  it("adds 1,200 BTU/hr kitchen allowance when active", () => {
    const resNoKitchen = calculateHvacLoadProject({
      floorAreaSqFt: 1200,
      includeKitchen: false,
    });

    const resWithKitchen = calculateHvacLoadProject({
      floorAreaSqFt: 1200,
      includeKitchen: true,
    });

    expect(resNoKitchen.breakdown.internalAppliancesSensibleBtu).toBe(0);
    expect(resWithKitchen.breakdown.internalAppliancesSensibleBtu).toBe(1200);
  });

  // Test Case 10: Duct Location Thermal Loss
  it("applies zero duct loss inside conditioned space and 12% in attic", () => {
    const resInside = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      ductworkLocation: "conditioned_space",
    });

    const resAttic = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      ductworkLocation: "unconditioned_attic",
    });

    expect(resInside.breakdown.ductLossCoolingBtu).toBe(0);
    expect(resAttic.breakdown.ductLossCoolingBtu).toBeGreaterThan(0);
    expect(resAttic.coolingLoadBtuHr).toBeGreaterThan(resInside.coolingLoadBtuHr);
  });

  // Test Case 11: Electric Heat Strip kW Equivalent
  it("calculates accurate electric resistance heat strip kW requirement", () => {
    const res = calculateHvacLoadProject({
      floorAreaSqFt: 1800,
      climateZone: "zone_4",
    });

    // 1 kW = 3412.142 BTU/hr
    const expectedKw = Math.round((res.heatingLoadBtuHr / 3412.142) * 10) / 10;
    expect(res.heatingKwEquivalent).toBe(expectedKw);
  });

  // Test Case 12: Invalid Input Rejection
  it("throws RangeError for invalid or zero floor area", () => {
    expect(() =>
      calculateHvacLoadProject({ floorAreaSqFt: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateHvacLoadProject({ floorAreaSqFt: -100 })
    ).toThrow(RangeError);

    expect(() =>
      calculateHvacLoadProject({ floorAreaSqFt: 1000, ceilingHeightFt: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateHvacLoadProject({ floorAreaSqFt: 1000, occupantsCount: -1 })
    ).toThrow(RangeError);
  });

  // Test Case 13: Deterministic Repeatability
  it("produces strictly identical results for identical input runs", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 2150,
      ceilingHeightFt: 9,
      climateZone: "zone_3",
      insulationGrade: "average",
      sunExposure: "high",
      occupantsCount: 5,
      includeKitchen: true,
      windowAreaPercentage: 18,
      ductworkLocation: "unconditioned_attic",
    };

    const run1 = calculateHvacLoadProject(input);
    const run2 = calculateHvacLoadProject(input);

    expect(run1.coolingLoadBtuHr).toBe(run2.coolingLoadBtuHr);
    expect(run1.heatingLoadBtuHr).toBe(run2.heatingLoadBtuHr);
    expect(run1.recommendedCoolingTons).toBe(run2.recommendedCoolingTons);
    expect(run1.breakdown).toEqual(run2.breakdown);
  });

  // Test Case 14: Thermodynamic Infiltration Sensible Constant (1.08 = rho * cp * 60)
  it("verifies infiltration sensible heat equation matches standard thermodynamic constant 1.08", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 1000,
      ceilingHeightFt: 10, // Volume = 10,000 cu ft
      climateZone: "zone_4", // Summer ΔT = 17°F
      insulationGrade: "average", // ACH = 0.5 -> CFM = (10,000 * 0.5) / 60 = 83.333 CFM
      ductworkLocation: "conditioned_space",
    };

    const res = calculateHvacLoadProject(input);
    const cfm = (10000 * 0.5) / 60;
    const expectedSensibleInfil = Math.round(1.08 * cfm * 17);
    expect(res.breakdown.infiltrationCoolingBtu).toBe(expectedSensibleInfil);
  });

  // Test Case 15: Humid Climate Latent Infiltration (Zone 1 & 2 vs Other Zones)
  it("computes psychrometric latent moisture load in humid climate zones 1 and 2", () => {
    const humidRes = calculateHvacLoadProject({
      floorAreaSqFt: 1000,
      ceilingHeightFt: 8,
      climateZone: "zone_1", // Miami / Subtropical Humid
      ductworkLocation: "conditioned_space",
    });

    const dryRes = calculateHvacLoadProject({
      floorAreaSqFt: 1000,
      ceilingHeightFt: 8,
      climateZone: "zone_5", // Cool Continental
      ductworkLocation: "conditioned_space",
    });

    expect(humidRes.breakdown.totalLatentCoolingBtu).toBeGreaterThan(
      dryRes.breakdown.totalLatentCoolingBtu
    );
  });

  // Test Case 16: AC Sizing Margin Calculation Precision
  it("calculates accurate equipment sizing margin percentage", () => {
    const res = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      climateZone: "zone_4",
    });

    const nominalCapacityBtu = res.recommendedCoolingTons * 12000;
    const expectedMargin =
      Math.round(((nominalCapacityBtu - res.coolingLoadBtuHr) / res.coolingLoadBtuHr) * 1000) / 10;
    expect(res.coolingSizingMarginPct).toBe(expectedMargin);
    expect(res.coolingSizingMarginPct).toBeGreaterThanOrEqual(0);
  });

  // Test Case 17: Envelope Fourier Conduction (Q = U * A * ΔT) Manual Verification
  it("verifies envelope conduction against independent manual Fourier conduction summation", () => {
    const input: HvacLoadInput = {
      floorAreaSqFt: 1600, // 40x40 ft floor -> perimeter = 160 ft
      ceilingHeightFt: 8, // Gross wall = 1,280 sq ft
      windowAreaPercentage: 10, // Window area = 160 sq ft -> Net wall = 1,120 sq ft
      insulationGrade: "good", // Wall U = 0.048 (R-21), Ceiling U = 0.020 (R-49)
      climateZone: "zone_4", // Summer ΔT = 17°F
      ductworkLocation: "conditioned_space",
    };

    const res = calculateHvacLoadProject(input);
    const manualWallCond = 1120 * 0.048 * 17; // 913.92 BTU
    const manualCeilCond = 1600 * 0.020 * 17; // 544.00 BTU
    const expectedEnvelopeCooling = Math.round(manualWallCond + manualCeilCond); // 1,458 BTU

    expect(res.breakdown.envelopeCoolingBtu).toBe(expectedEnvelopeCooling);
  });

  // Test Case 18: Extreme Boundary - Tiny 100 sq ft Structure (Shed / Cabin)
  it("correctly handles small 100 sq ft tiny structures without mathematical errors", () => {
    const res = calculateHvacLoadProject({
      floorAreaSqFt: 100,
      ceilingHeightFt: 7,
      occupantsCount: 1,
      includeKitchen: false,
    });

    expect(res.coolingLoadBtuHr).toBeGreaterThan(1000);
    expect(res.coolingLoadBtuHr).toBeLessThan(6000);
    expect(res.recommendedCoolingTons).toBe(1.5); // Baseline nominal minimum
    expect(res.miniSplitZoneRecommendation).toContain("9,000 BTU");
  });

  // Test Case 19: Extreme Boundary - Large 8,000 sq ft Commercial/Residential Facility
  it("handles large 8,000 sq ft buildings and flags multi-system capacity warnings", () => {
    const res = calculateHvacLoadProject({
      floorAreaSqFt: 8000,
      ceilingHeightFt: 12,
      occupantsCount: 12,
    });

    expect(res.coolingLoadBtuHr).toBeGreaterThan(60000);
    expect(res.recommendedCoolingTons).toBe(5.0);
    expect(res.miniSplitZoneRecommendation).toContain("Dual-System");
    expect(
      res.warnings.some((w) => w.code === "LARGE_COMMERCIAL_RESIDENTIAL_LOAD")
    ).toBe(true);
  });

  // Test Case 20: Poor vs Good Insulation Reduction Potential
  it("verifies good insulation yields over 30% reduction in envelope conduction compared to poor", () => {
    const poorRes = calculateHvacLoadProject({
      floorAreaSqFt: 2000,
      insulationGrade: "poor",
      ductworkLocation: "conditioned_space",
    });

    const goodRes = calculateHvacLoadProject({
      floorAreaSqFt: 2000,
      insulationGrade: "good",
      ductworkLocation: "conditioned_space",
    });

    expect(goodRes.breakdown.envelopeCoolingBtu).toBeLessThan(
      poorRes.breakdown.envelopeCoolingBtu * 0.6
    );
  });

  // Test Case 21: Solar Orientation Multiplier Sensitivity
  it("scales window solar radiation based on high vs low orientation exposure", () => {
    const lowSun = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      sunExposure: "low",
    });

    const highSun = calculateHvacLoadProject({
      floorAreaSqFt: 1500,
      sunExposure: "high",
    });

    expect(highSun.breakdown.windowSolarCoolingBtu).toBeGreaterThan(
      lowSun.breakdown.windowSolarCoolingBtu
    );
  });

  // Test Case 22: Sensible + Latent Summation Invariance
  it("ensures total cooling load equals the sum of sensible, latent, and duct loss components", () => {
    const res = calculateHvacLoadProject({
      floorAreaSqFt: 2200,
      climateZone: "zone_1",
      ductworkLocation: "unconditioned_attic",
    });

    const calculatedSum =
      res.breakdown.totalSensibleCoolingBtu +
      res.breakdown.totalLatentCoolingBtu +
      res.breakdown.ductLossCoolingBtu;

    expect(res.coolingLoadBtuHr).toBe(calculatedSum);
  });
});
