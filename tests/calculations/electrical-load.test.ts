import { describe, it, expect } from "vitest";
import { calculateResidentialElectricalLoad } from "@/lib/calculations/electrical-load";
import { findRecommendedServiceRating } from "@/data/references/electrical-load-types";
import type { ElectricalLoadInput } from "@/types/electrical-load";

describe("Residential Electrical Service Panel Load Engine (TASK 021 - NEC 220.82)", () => {
  // Test Case 1: Standard 1,800 sq ft Home (Typical Baseline)
  it("calculates accurate demand load and service amps for a standard 1,800 sq ft home", () => {
    // 1,800 sq ft @ 3 VA = 5,400 VA lighting
    // 2 small app + 1 laundry = 4,500 VA
    // Range (8,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) + Disposal (900) + Microwave (1,500) = 21,400 VA
    // Gross General = 5,400 + 4,500 + 21,400 = 31,300 VA
    // Demand General = 10,000 + (21,300 * 0.40) = 10,000 + 8,520 = 18,520 VA
    // AC = 3,500 VA (Heating = 0) -> Largest HVAC = 3,500 VA
    // Total Demand = 18,520 + 3,500 = 22,020 VA
    // Amps @ 240V = 22,020 / 240 = 91.75 -> 91.8 Amps
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 1800,
      existingServiceRatingAmps: 100,
      proposedServiceRatingAmps: 200,
      includeElectricRange: true,
      includeElectricDryer: true,
      includeElectricWaterHeater: true,
      includeDishwasher: true,
      includeGarbageDisposal: true,
      includeMicrowave: true,
      includeAirConditioning: true,
      airConditioningWatts: 3500,
      hvacHeatingType: "none",
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.generalLightingVa).toBe(5400);
    expect(res.breakdown.smallApplianceLaundryVa).toBe(4500);
    expect(res.breakdown.grossGeneralLoadVa).toBe(31300);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(18520);
    expect(res.breakdown.selectedHvacLoadVa).toBe(3500);
    expect(res.totalCalculatedDemandVa).toBe(22020);
    expect(res.calculatedServiceAmps).toBeCloseTo(91.8, 1);
    expect(res.recommendedMinimumServiceAmps).toBe(100);
    expect(res.existingServiceStatus).toBe("approaching_capacity"); // 91.8% of 100A
  });

  // Test Case 2: 100A to 200A Upgrade Triggered by Level 2 EV Charger Addition
  it("triggers a service panel upgrade recommendation when adding a 40A EV charger", () => {
    // Base 1,800 sq ft home (22,020 VA = 91.8A)
    // Add 40A EV Charger @ 125% continuous = 40 * 240 * 1.25 = 12,000 VA (50A continuous)
    // New Total = 22,020 + 12,000 = 34,020 VA
    // Amps @ 240V = 34,020 / 240 = 141.75 -> 141.8 Amps
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 1800,
      existingServiceRatingAmps: 100,
      proposedServiceRatingAmps: 200,
      includeElectricRange: true,
      includeElectricDryer: true,
      includeElectricWaterHeater: true,
      includeDishwasher: true,
      includeGarbageDisposal: true,
      includeMicrowave: true,
      includeAirConditioning: true,
      airConditioningWatts: 3500,
      includeEvCharger: true,
      evChargerAmps: 40,
      isEvContinuous125Pct: true,
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.evChargerDemandVa).toBe(12000);
    expect(res.totalCalculatedDemandVa).toBe(34020);
    expect(res.calculatedServiceAmps).toBeCloseTo(141.8, 1);
    expect(res.existingServiceStatus).toBe("service_upgrade_required"); // 141.8% of 100A
    expect(res.recommendedMinimumServiceAmps).toBe(150);
    expect(res.proposedServiceUtilizationPct).toBeCloseTo(70.9, 1);
    expect(
      res.warnings.some((w) => w.code === "EXISTING_SERVICE_OVERLOADED_UPGRADE_RECOMMENDED")
    ).toBe(true);
    expect(
      res.warnings.some((w) => w.code === "EV_CHARGER_EXCEEDS_100A_PANEL")
    ).toBe(true);
  });

  // Test Case 3: All-Electric Home with Heat Pump & Supplemental Strip Heat
  it("calculates accurate HVAC non-coincident load for heat pump with electric strip heat", () => {
    // 2,200 sq ft home
    // Heat pump AC = 4,000 W; Supplemental Strip = 10,000 W -> Total Heating = 14,000 VA
    // Non-coincident rule selects 14,000 VA heating over 4,000 VA cooling
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 2200,
      includeAirConditioning: true,
      airConditioningWatts: 4000,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 10000,
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.airConditioningVa).toBe(4000);
    expect(res.breakdown.heatingVa).toBe(14000);
    expect(res.breakdown.selectedHvacLoadVa).toBe(14000);
    expect(res.breakdown.hvacSelectionReason).toContain("Heating load");
  });

  // Test Case 4: Non-Coincident Cooling Greater than Heating
  it("selects cooling load when air conditioning exceeds space heating", () => {
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 2000,
      includeAirConditioning: true,
      airConditioningWatts: 6000, // Large 5-ton AC
      hvacHeatingType: "none", // Gas furnace
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.airConditioningVa).toBe(6000);
    expect(res.breakdown.heatingVa).toBe(0);
    expect(res.breakdown.selectedHvacLoadVa).toBe(6000);
    expect(res.breakdown.hvacSelectionReason).toContain("Air Conditioning load");
  });

  // Test Case 5: Large 3,600 sq ft Estate with Hot Tub and 48A EV Charger
  it("correctly sizes a 200A or 400A service for large multi-appliance dwellings", () => {
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 3600,
      existingServiceRatingAmps: 200,
      proposedServiceRatingAmps: 400,
      includeElectricRange: true,
      electricRangeWatts: 12000, // Commercial induction range
      includeElectricDryer: true,
      electricDryerWatts: 6000,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 5500,
      includeHotTubSpa: true,
      hotTubSpaWatts: 8000,
      includePoolPumpHeater: true,
      poolPumpHeaterWatts: 5000,
      includeAirConditioning: true,
      airConditioningWatts: 7000,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 15000,
      includeEvCharger: true,
      evChargerAmps: 48,
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.totalCalculatedDemandKva).toBeGreaterThan(45);
    expect(res.calculatedServiceAmps).toBeGreaterThan(180);
    expect([200, 225, 400]).toContain(res.recommendedMinimumServiceAmps);
  });

  // Test Case 6: Minimal Dwelling (Sub-10k VA General Load)
  it("handles small ADUs where gross general load is under 10,000 VA without remainder error", () => {
    // 500 sq ft ADU (1,500 VA lighting) + 4,500 VA small app/laundry + 1,500 VA microwave = 7,500 VA gross
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 500,
      includeElectricRange: false,
      includeElectricDryer: false,
      includeElectricWaterHeater: false,
      includeDishwasher: false,
      includeGarbageDisposal: false,
      includeMicrowave: true,
      microwaveWatts: 1500,
      includeAirConditioning: true,
      airConditioningWatts: 1500,
      hvacHeatingType: "none",
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.grossGeneralLoadVa).toBe(7500);
    expect(res.breakdown.generalDemandFirst10kVa).toBe(7500);
    expect(res.breakdown.generalDemandRemainderVa).toBe(0);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(7500);
    expect(res.calculatedServiceAmps).toBeCloseTo(37.5, 1);
    expect(res.recommendedMinimumServiceAmps).toBe(100);
    expect(res.existingServiceStatus).toBe("well_within_capacity");
  });

  // Test Case 7: Electric Clothes Dryer Minimum 5,000 VA Floor (NEC 220.54)
  it("enforces minimum 5,000 VA rating for electric clothes dryers per NEC", () => {
    const inputWithLowWatts: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 1000,
      includeElectricRange: false,
      includeElectricDryer: true,
      electricDryerWatts: 3000, // Below 5,000 VA code minimum
      includeElectricWaterHeater: false,
      includeDishwasher: false,
      includeGarbageDisposal: false,
      includeMicrowave: false,
    };

    const res = calculateResidentialElectricalLoad(inputWithLowWatts);
    // Fixed appliances must include 5,000 VA minimum for dryer
    expect(res.breakdown.fixedAppliancesTotalVa).toBe(5000);
  });

  // Test Case 8: Custom Appliances Dynamic Array
  it("adds custom fixed equipment and workshop machinery to general load", () => {
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 1500,
      customAppliances: [
        { id: "1", name: "Table Saw", watts: 2000 },
        { id: "2", name: "Air Compressor", watts: 3000 },
      ],
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(res.breakdown.fixedAppliancesTotalVa).toBeGreaterThanOrEqual(5000);
  });

  // Test Case 9: EV Charger 100% Non-Continuous Factor Override
  it("calculates EV load at 100% when continuous duty factor is disabled", () => {
    const contRes = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeEvCharger: true,
      evChargerAmps: 32, // 32 * 240 = 7,680 W
      isEvContinuous125Pct: true,
    });

    const nonContRes = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeEvCharger: true,
      evChargerAmps: 32,
      isEvContinuous125Pct: false,
    });

    expect(contRes.breakdown.evChargerDemandVa).toBe(7680 * 1.25); // 9,600 VA
    expect(nonContRes.breakdown.evChargerDemandVa).toBe(7680); // 7,680 VA
  });

  // Test Case 10: Standard Service Rating Lookup Helper
  it("maps calculated amperages to standard factory main breaker sizes correctly", () => {
    expect(findRecommendedServiceRating(85)).toBe(100);
    expect(findRecommendedServiceRating(105)).toBe(125);
    expect(findRecommendedServiceRating(135)).toBe(150);
    expect(findRecommendedServiceRating(165)).toBe(200);
    expect(findRecommendedServiceRating(215)).toBe(225);
    expect(findRecommendedServiceRating(310)).toBe(400);
  });

  // Test Case 11: Electric Resistance Furnace Warning (> 15 kW)
  it("flags large electric resistance furnace warning", () => {
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 2500,
      hvacHeatingType: "electric_furnace",
      heatingWatts: 20000, // 20 kW furnace
    };

    const res = calculateResidentialElectricalLoad(input);
    expect(
      res.warnings.some((w) => w.code === "LARGE_ELECTRIC_FURNACE_LOAD")
    ).toBe(true);
  });

  // Test Case 12: Invalid Input Rejection (Zero or Negative Area)
  it("throws RangeError for invalid or negative dwelling area", () => {
    expect(() =>
      calculateResidentialElectricalLoad({ dwellingFloorAreaSqFt: 0 })
    ).toThrow(RangeError);

    expect(() =>
      calculateResidentialElectricalLoad({ dwellingFloorAreaSqFt: -500 })
    ).toThrow(RangeError);
  });

  // Test Case 13: Deterministic Repeatability
  it("produces strictly identical results for identical input runs", () => {
    const input: ElectricalLoadInput = {
      dwellingFloorAreaSqFt: 2400,
      existingServiceRatingAmps: 150,
      proposedServiceRatingAmps: 200,
      includeElectricRange: true,
      includeElectricDryer: true,
      includeElectricWaterHeater: true,
      includeEvCharger: true,
      evChargerAmps: 40,
      includeAirConditioning: true,
      airConditioningWatts: 4500,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 10000,
    };

    const run1 = calculateResidentialElectricalLoad(input);
    const run2 = calculateResidentialElectricalLoad(input);

    expect(run1.calculatedServiceAmps).toBe(run2.calculatedServiceAmps);
    expect(run1.totalCalculatedDemandVa).toBe(run2.totalCalculatedDemandVa);
    expect(run1.breakdown).toEqual(run2.breakdown);
    expect(run1.warnings).toEqual(run2.warnings);
  });

  // Test Case 14: Submersible Well Pump Addition
  it("adds 1,500 VA for a residential well pump", () => {
    const resNoWell = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeWellPump: false,
    });
    const resWithWell = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeWellPump: true,
      wellPumpWatts: 1500,
    });

    expect(resWithWell.breakdown.fixedAppliancesTotalVa).toBe(
      resNoWell.breakdown.fixedAppliancesTotalVa + 1500
    );
  });

  // Test Case 15: Swimming Pool Pump / Heater Addition
  it("adds 4,000 VA for pool filtration pump and electric heater", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includePoolPumpHeater: true,
      poolPumpHeaterWatts: 4000,
    });

    expect(res.breakdown.fixedAppliancesTotalVa).toBeGreaterThanOrEqual(4000);
  });

  // Test Case 16: Custom Small Appliance Circuit Counts
  it("scales small appliance circuits above code minimum of 2", () => {
    const res2Circuits = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      smallApplianceCircuitsCount: 2,
    });
    const res4Circuits = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      smallApplianceCircuitsCount: 4,
    });

    // 2 extra circuits * 1,500 = 3,000 VA
    expect(res4Circuits.breakdown.smallApplianceLaundryVa).toBe(
      res2Circuits.breakdown.smallApplianceLaundryVa + 3000
    );
  });

  // Test Case 17: Heat Pump No Strip Heat Equivalence
  it("sizes heat pump heating equal to cooling when no strip heat is present", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1800,
      includeAirConditioning: true,
      airConditioningWatts: 3500,
      hvacHeatingType: "heat_pump_no_strip",
    });

    expect(res.breakdown.heatingVa).toBe(3500);
    expect(res.breakdown.airConditioningVa).toBe(3500);
    expect(res.breakdown.selectedHvacLoadVa).toBe(3500);
  });

  // Test Case 18: Electric Baseboard Room Heaters Summation
  it("adds electric baseboard heaters to heating load", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1800,
      includeAirConditioning: true,
      airConditioningWatts: 3000,
      hvacHeatingType: "electric_baseboard",
      heatingWatts: 8000,
    });

    expect(res.breakdown.heatingVa).toBe(8000);
    expect(res.breakdown.selectedHvacLoadVa).toBe(8000);
  });

  // Test Case 19: Remaining Capacity Amperes Exact Calculation
  it("calculates exact headroom and remaining amperes on existing panel", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      existingServiceRatingAmps: 100,
    });

    const expectedHeadroom = Math.round((100 - res.calculatedServiceAmps) * 10) / 10;
    expect(res.remainingCapacityAmps).toBe(expectedHeadroom);
  });

  // Test Case 20: Proposed Service Utilization Percentage Precision
  it("calculates accurate proposed service utilization percentage", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      proposedServiceRatingAmps: 200,
    });

    const expectedUtil = Math.round((res.calculatedServiceAmps / 200) * 1000) / 10;
    expect(res.proposedServiceUtilizationPct).toBe(expectedUtil);
  });

  // Test Case 21: Full Electric Kitchen Baseline (Range + Dishwasher + Disposal + Microwave)
  it("sums full electric kitchen suite accurately into fixed appliance pool", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeElectricRange: true,
      electricRangeWatts: 8000,
      includeElectricDryer: false,
      includeElectricWaterHeater: false,
      includeDishwasher: true,
      dishwasherWatts: 1500,
      includeGarbageDisposal: true,
      garbageDisposalWatts: 900,
      includeMicrowave: true,
      microwaveWatts: 1500,
    });

    // 8,000 + 1,500 + 900 + 1,500 = 11,900 VA
    expect(res.breakdown.fixedAppliancesTotalVa).toBe(11900);
  });

  // Test Case 22: EV Charger 80A Commercial / High-Power Level 2
  it("handles high-capacity 80A EV chargers (19.2 kW) with 125% continuous duty", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      includeEvCharger: true,
      evChargerAmps: 80, // 80 * 240 = 19,200 W * 1.25 = 24,000 VA (100A continuous load)
      isEvContinuous125Pct: true,
    });

    expect(res.breakdown.evChargerDemandVa).toBe(24000);
    expect(res.calculatedServiceAmps).toBeGreaterThan(150);
  });

  // Test Case 23: Step-by-Step Calculation Trace Length & Label Integrity
  it("generates complete step-by-step mathematical trace for auditability", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      includeEvCharger: true,
      includeAirConditioning: true,
    });

    expect(res.steps.length).toBeGreaterThanOrEqual(6);
    expect(res.steps.some((s) => s.label.includes("General Lighting"))).toBe(true);
    expect(res.steps.some((s) => s.label.includes("General Load Demand Factor"))).toBe(true);
    expect(res.steps.some((s) => s.label.includes("HVAC Non-Coincident"))).toBe(true);
  });

  // Test Case 24: Direct EV Charger Wattage Specification
  it("accepts direct EV charger wattage input over amperage derivation", () => {
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeEvCharger: true,
      evChargerWatts: 11500, // 11.5 kW hardwired
      isEvContinuous125Pct: true,
    });

    expect(res.breakdown.evChargerConnectedVa).toBe(11500);
    expect(res.breakdown.evChargerDemandVa).toBe(Math.round(11500 * 1.25));
  });

  // Test Case 25: 120V / 208V Custom Voltage Support
  it("computes service current accurately for 208V single-phase systems", () => {
    const res240 = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      serviceVoltage: 240,
    });

    const res208 = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      serviceVoltage: 208,
    });

    // Same VA divided by 208V yields higher current than 240V
    expect(res208.calculatedServiceAmps).toBeGreaterThan(res240.calculatedServiceAmps);
  });

  // Test Case 26: Independent Benchmark Comparison (Official NEC 220.82 Example)
  it("matches independent standard NEC 220.82 textbook calculation benchmark", () => {
    // Standard NEC 220.82 Textbook Example:
    // 1,500 sq ft dwelling = 4,500 VA lighting
    // 2 small app + 1 laundry = 4,500 VA
    // Range (8,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) = 19,000 VA
    // Gross General = 4,500 + 4,500 + 19,000 = 28,000 VA
    // Demand General = 10,000 + (18,000 * 0.40) = 10,000 + 7,200 = 17,200 VA
    // AC = 3,000 VA (Heating = 0) -> Total Demand = 17,200 + 3,000 = 20,200 VA
    // Amps @ 240V = 20,200 / 240 = 84.166 -> 84.2 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1500,
      includeElectricRange: true,
      electricRangeWatts: 8000,
      includeElectricDryer: true,
      electricDryerWatts: 5000,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 4500,
      includeDishwasher: true,
      dishwasherWatts: 1500,
      includeGarbageDisposal: false,
      includeMicrowave: false,
      includeAirConditioning: true,
      airConditioningWatts: 3000,
      hvacHeatingType: "none",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(28000);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(17200);
    expect(res.totalCalculatedDemandVa).toBe(20200);
    expect(res.calculatedServiceAmps).toBe(84.2);
    expect(res.recommendedMinimumServiceAmps).toBe(100);
  });

  // =========================================================================
  // TASK 022: INDEPENDENT FIRST-PRINCIPLES BENCHMARK SUITE (10 Scenarios)
  // Tested against manually calculated NEC 220.82 equations without production helpers.
  // =========================================================================

  // Benchmark Scenario 1: Typical 2,000 sq ft Gas-Heated Home
  it("Benchmark 1: 2,000 sq ft Gas-Heated Home matches manual first-principles calculation", () => {
    // Math:
    // Lighting: 2,000 * 3 = 6,000 VA
    // Small App & Laundry: (2 * 1,500) + (1 * 1,500) = 4,500 VA
    // Appliances (Gas cooking/dryer/water heater): Dishwasher (1,500) + Disposal (900) + Microwave (1,500) = 3,900 VA
    // Gross General = 6,000 + 4,500 + 3,900 = 14,400 VA
    // General Demand = 10,000 + (4,400 * 0.40) = 10,000 + 1,760 = 11,760 VA
    // AC = 4,000 VA, Heating = 0 VA -> Largest HVAC = 4,000 VA
    // Total Demand = 11,760 + 4,000 = 15,760 VA
    // Amps @ 240V = 15,760 / 240 = 65.666 -> 65.7 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      includeElectricRange: false,
      includeElectricDryer: false,
      includeElectricWaterHeater: false,
      includeDishwasher: true,
      dishwasherWatts: 1500,
      includeGarbageDisposal: true,
      garbageDisposalWatts: 900,
      includeMicrowave: true,
      microwaveWatts: 1500,
      includeAirConditioning: true,
      airConditioningWatts: 4000,
      hvacHeatingType: "none",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(14400);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(11760);
    expect(res.totalCalculatedDemandVa).toBe(15760);
    expect(res.calculatedServiceAmps).toBe(65.7);
    expect(res.recommendedMinimumServiceAmps).toBe(100);
  });

  // Benchmark Scenario 2: Typical 2,000 sq ft All-Electric Home
  it("Benchmark 2: 2,000 sq ft All-Electric Home (Heat pump + Range + Dryer + Water Heater)", () => {
    // Math:
    // Lighting: 6,000 VA + Small App/Laundry: 4,500 VA
    // Fixed: Range (8,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) + Disposal (900) + Micro (1,500) = 21,400 VA
    // Gross General = 6,000 + 4,500 + 21,400 = 31,900 VA
    // General Demand = 10,000 + (21,900 * 0.40) = 10,000 + 8,760 = 18,760 VA
    // Heat pump: AC 4,000 VA + 10,000 VA strip = 14,000 VA heating vs 4,000 VA AC -> 14,000 VA selected
    // Total Demand = 18,760 + 14,000 = 32,760 VA
    // Amps @ 240V = 32,760 / 240 = 136.5 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      includeElectricRange: true,
      electricRangeWatts: 8000,
      includeElectricDryer: true,
      electricDryerWatts: 5000,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 4500,
      includeDishwasher: true,
      dishwasherWatts: 1500,
      includeGarbageDisposal: true,
      garbageDisposalWatts: 900,
      includeMicrowave: true,
      microwaveWatts: 1500,
      includeAirConditioning: true,
      airConditioningWatts: 4000,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 10000,
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(31900);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(18760);
    expect(res.breakdown.selectedHvacLoadVa).toBe(14000);
    expect(res.totalCalculatedDemandVa).toBe(32760);
    expect(res.calculatedServiceAmps).toBe(136.5);
    expect(res.recommendedMinimumServiceAmps).toBe(150);
  });

  // Benchmark Scenario 3: 200A Service with Electric Cooking, Drying, Water Heating
  it("Benchmark 3: 200A Service with Electric Range, Dryer, Water Heater", () => {
    // 2,500 sq ft dwelling = 7,500 VA lighting + 4,500 VA small app/laundry
    // Fixed: Range (8,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) + Disposal (900) + Micro (1,500) = 21,400 VA
    // Gross General = 7,500 + 4,500 + 21,400 = 33,400 VA
    // General Demand = 10,000 + (23,400 * 0.40) = 10,000 + 9,360 = 19,360 VA
    // AC = 4,500 VA (Heating = 0) -> Total Demand = 19,360 + 4,500 = 23,860 VA
    // Amps @ 240V = 23,860 / 240 = 99.416 -> 99.4 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2500,
      existingServiceRatingAmps: 200,
      includeAirConditioning: true,
      airConditioningWatts: 4500,
      hvacHeatingType: "none",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(33400);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(19360);
    expect(res.totalCalculatedDemandVa).toBe(23860);
    expect(res.calculatedServiceAmps).toBe(99.4);
    expect(res.existingServiceUtilizationPct).toBe(49.7); // 99.4 / 200
  });

  // Benchmark Scenario 4: EV Charger Addition on 100A vs 200A Panel
  it("Benchmark 4: Adding a 48A (11.5 kW) Level 2 EV Charger with 125% continuous duty", () => {
    // Base 2,000 sq ft home general demand = 18,760 VA + AC = 4,000 VA -> Subtotal = 22,760 VA
    // EV Charger: 48A * 240V = 11,520 W * 1.25 continuous = 14,400 VA (60A load)
    // Total Demand = 22,760 + 14,400 = 37,160 VA
    // Amps @ 240V = 37,160 / 240 = 154.833 -> 154.8 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2000,
      includeAirConditioning: true,
      airConditioningWatts: 4000,
      hvacHeatingType: "none",
      includeEvCharger: true,
      evChargerAmps: 48,
      isEvContinuous125Pct: true,
    });

    expect(res.breakdown.evChargerDemandVa).toBe(14400);
    expect(res.totalCalculatedDemandVa).toBe(37160);
    expect(res.calculatedServiceAmps).toBe(154.8);
    expect(res.recommendedMinimumServiceAmps).toBe(200);
  });

  // Benchmark Scenario 5: Heat-Pump Home with 15 kW Supplemental Heat
  it("Benchmark 5: Large Heat-Pump with 15 kW Supplemental Heat Strips", () => {
    // AC 5,000 VA + 15,000 VA strip = 20,000 VA heating load
    // General Demand for 2,400 sq ft = 19,240 VA
    // Total Demand = 19,240 + 20,000 = 39,240 VA
    // Amps @ 240V = 39,240 / 240 = 163.5 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 2400,
      includeAirConditioning: true,
      airConditioningWatts: 5000,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 15000,
    });

    expect(res.breakdown.selectedHvacLoadVa).toBe(20000);
    expect(res.totalCalculatedDemandVa).toBe(39240);
    expect(res.calculatedServiceAmps).toBe(163.5);
    expect(res.recommendedMinimumServiceAmps).toBe(200);
  });

  // Benchmark Scenario 6: Heavy Luxury Load (Induction Range 12 kW + Spa 8 kW + Pool Pump 5 kW)
  it("Benchmark 6: Heavy Luxury Equipment (Commercial Induction + Hot Tub + Pool)", () => {
    // Lighting: 3,000 * 3 = 9,000 VA + Small App: 4,500 VA
    // Fixed: Range (12,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) + Disposal (900) + Micro (1,500) + Spa (8,000) + Pool (5,000) = 38,400 VA
    // Gross General = 9,000 + 4,500 + 38,400 = 51,900 VA
    // General Demand = 10,000 + (41,900 * 0.40) = 10,000 + 16,760 = 26,760 VA
    // AC = 6,000 VA
    // Total Demand = 26,760 + 6,000 = 32,760 VA
    // Amps @ 240V = 32,760 / 240 = 136.5 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 3000,
      includeElectricRange: true,
      electricRangeWatts: 12000,
      includeElectricDryer: true,
      electricDryerWatts: 5000,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 4500,
      includeDishwasher: true,
      dishwasherWatts: 1500,
      includeGarbageDisposal: true,
      garbageDisposalWatts: 900,
      includeMicrowave: true,
      microwaveWatts: 1500,
      includeHotTubSpa: true,
      hotTubSpaWatts: 8000,
      includePoolPumpHeater: true,
      poolPumpHeaterWatts: 5000,
      includeAirConditioning: true,
      airConditioningWatts: 6000,
      hvacHeatingType: "none",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(51900);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(26760);
    expect(res.totalCalculatedDemandVa).toBe(32760);
    expect(res.calculatedServiceAmps).toBe(136.5);
  });

  // Benchmark Scenario 7: Small ADU / Cottage (600 sq ft)
  it("Benchmark 7: Small 600 sq ft ADU / Cottage (Sub-10k general load)", () => {
    // Lighting: 600 * 3 = 1,800 VA
    // Small App: (2 * 1,500) + (1 * 1,500) = 4,500 VA
    // Fixed: Water Heater (3,000) + Microwave (1,200) = 4,200 VA (No range, no dryer)
    // Gross General = 1,800 + 4,500 + 4,200 = 10,500 VA
    // General Demand = 10,000 + (500 * 0.40) = 10,000 + 200 = 10,200 VA
    // Mini-Split Heat Pump = 2,000 VA
    // Total Demand = 10,200 + 2,000 = 12,200 VA
    // Amps @ 240V = 12,200 / 240 = 50.833 -> 50.8 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 600,
      includeElectricRange: false,
      includeElectricDryer: false,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 3000,
      includeDishwasher: false,
      includeGarbageDisposal: false,
      includeMicrowave: true,
      microwaveWatts: 1200,
      includeAirConditioning: true,
      airConditioningWatts: 2000,
      hvacHeatingType: "heat_pump_no_strip",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(10500);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(10200);
    expect(res.totalCalculatedDemandVa).toBe(12200);
    expect(res.calculatedServiceAmps).toBe(50.8);
    expect(res.recommendedMinimumServiceAmps).toBe(100);
  });

  // Benchmark Scenario 8: Large 4,000 sq ft Home with Dual EV Charging (80A total)
  it("Benchmark 8: Large 4,000 sq ft Home with Dual EV Chargers and 15 kW Heat Pump", () => {
    // Lighting: 4,000 * 3 = 12,000 VA + Small App: 4,500 VA
    // Fixed: Range (10,000) + Dryer (5,000) + Water Heater (4,500) + Dishwasher (1,500) + Disposal (900) + Micro (1,500) = 23,400 VA
    // Gross General = 12,000 + 4,500 + 23,400 = 39,900 VA
    // General Demand = 10,000 + (29,900 * 0.40) = 10,000 + 11,960 = 21,960 VA
    // HVAC: Heat pump 6,000 VA + 15,000 VA strip = 21,000 VA heating
    // EVSE: 80A * 240V * 1.25 = 24,000 VA (100A continuous)
    // Total Demand = 21,960 + 21,000 + 24,000 = 66,960 VA
    // Amps @ 240V = 66,960 / 240 = 279.0 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 4000,
      includeElectricRange: true,
      electricRangeWatts: 10000,
      includeAirConditioning: true,
      airConditioningWatts: 6000,
      hvacHeatingType: "heat_pump_with_strip",
      heatingWatts: 15000,
      includeEvCharger: true,
      evChargerAmps: 80,
      isEvContinuous125Pct: true,
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(39900);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(21960);
    expect(res.breakdown.selectedHvacLoadVa).toBe(21000);
    expect(res.breakdown.evChargerDemandVa).toBe(24000);
    expect(res.totalCalculatedDemandVa).toBe(66960);
    expect(res.calculatedServiceAmps).toBe(279.0);
    expect(res.recommendedMinimumServiceAmps).toBe(400);
  });

  // Benchmark Scenario 9: Demand-Factor Boundary at Exactly 10,000 VA
  it("Benchmark 9: Demand-factor boundary at exactly 10,000 VA gross general load", () => {
    // Floor area 1,000 sq ft = 3,000 VA lighting
    // Small App: (2 * 1,500) + (1 * 1,500) = 4,500 VA
    // Fixed: Water Heater (2,500 VA)
    // Gross General = 3,000 + 4,500 + 2,500 = 10,000 VA exactly
    // Demand General = 10,000 VA (0 remainder)
    // AC = 2,000 VA
    // Total Demand = 12,000 VA -> 50.0 Amps
    const res = calculateResidentialElectricalLoad({
      dwellingFloorAreaSqFt: 1000,
      includeElectricRange: false,
      includeElectricDryer: false,
      includeElectricWaterHeater: true,
      electricWaterHeaterWatts: 2500,
      includeDishwasher: false,
      includeGarbageDisposal: false,
      includeMicrowave: false,
      includeAirConditioning: true,
      airConditioningWatts: 2000,
      hvacHeatingType: "none",
    });

    expect(res.breakdown.grossGeneralLoadVa).toBe(10000);
    expect(res.breakdown.generalDemandFirst10kVa).toBe(10000);
    expect(res.breakdown.generalDemandRemainderVa).toBe(0);
    expect(res.breakdown.calculatedGeneralDemandVa).toBe(10000);
    expect(res.totalCalculatedDemandVa).toBe(12000);
    expect(res.calculatedServiceAmps).toBe(50.0);
  });

  // Benchmark Scenario 10: Service Recommendation Boundary (100.1A Demand)
  it("Benchmark 10: Service recommendation boundary just above 100A (100.1A triggers 125A)", () => {
    // 24,024 VA / 240V = 100.1 Amps -> triggers 125A recommended service size
    expect(findRecommendedServiceRating(100.0)).toBe(100);
    expect(findRecommendedServiceRating(100.1)).toBe(125);
    expect(findRecommendedServiceRating(125.0)).toBe(125);
    expect(findRecommendedServiceRating(125.1)).toBe(150);
    expect(findRecommendedServiceRating(200.0)).toBe(200);
    expect(findRecommendedServiceRating(200.1)).toBe(225);
    expect(findRecommendedServiceRating(225.1)).toBe(400);
  });
});

