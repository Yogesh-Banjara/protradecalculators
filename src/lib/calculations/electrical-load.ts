import type {
  ElectricalLoadDetailedBreakdown,
  ElectricalLoadInput,
  ElectricalLoadResult,
  ServiceCapacityStatus,
} from "@/types/electrical-load";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  NEC_220_82_CONSTANTS,
  findRecommendedServiceRating,
} from "@/data/references/electrical-load-types";
import { roundTo } from "./rounding";

/**
 * Pure deterministic calculation engine for Residential Electrical Service Panel Load per NEC Article 220.82.
 */
export function calculateResidentialElectricalLoad(
  input: ElectricalLoadInput
): ElectricalLoadResult {
  const {
    dwellingFloorAreaSqFt,
    existingServiceRatingAmps = 100,
    proposedServiceRatingAmps = 200,
    serviceVoltage = 240,
    smallApplianceCircuitsCount = 2,
    laundryCircuitsCount = 1,
    includeElectricRange = true,
    electricRangeWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.electricRange,
    includeElectricDryer = true,
    electricDryerWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.electricDryer,
    includeElectricWaterHeater = true,
    electricWaterHeaterWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.electricWaterHeater,
    includeDishwasher = true,
    dishwasherWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.dishwasher,
    includeGarbageDisposal = true,
    garbageDisposalWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.garbageDisposal,
    includeMicrowave = true,
    microwaveWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.microwave,
    includeHotTubSpa = false,
    hotTubSpaWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.hotTubSpa,
    includePoolPumpHeater = false,
    poolPumpHeaterWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.poolPumpHeater,
    includeWellPump = false,
    wellPumpWatts = NEC_220_82_CONSTANTS.defaultApplianceRatings.wellPump,
    customAppliances = [],
    includeEvCharger = false,
    evChargerAmps = 32,
    evChargerWatts,
    isEvContinuous125Pct = true,
    includeAirConditioning = true,
    airConditioningWatts = 3500, // 3.0-Ton modern central AC (~3.5 kW)
    hvacHeatingType = "none",
    heatingWatts = 10000, // 10 kW standard electric furnace / supplemental strip
  } = input;

  if (dwellingFloorAreaSqFt <= 0) {
    throw new RangeError("Dwelling floor area must be greater than zero square feet");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // 1. General Lighting & Receptacle Load (NEC 220.82(B)(1))
  const generalLightingVa = roundTo(
    dwellingFloorAreaSqFt * NEC_220_82_CONSTANTS.generalLightingVaPerSqFt,
    0
  );

  steps.push({
    label: "General Lighting & Receptacle Load (NEC 220.82(B)(1))",
    formula: "VA = Floor Area × 3 VA/sq ft",
    values: `${dwellingFloorAreaSqFt} sq ft × 3 VA/sq ft`,
    result: `${generalLightingVa} VA`,
  });

  // 2. Small Appliance & Laundry Circuits (NEC 220.82(B)(2))
  const actualSmallAppCircuits = Math.max(
    NEC_220_82_CONSTANTS.minSmallApplianceCircuits,
    smallApplianceCircuitsCount
  );
  const actualLaundryCircuits = Math.max(
    NEC_220_82_CONSTANTS.minLaundryCircuits,
    laundryCircuitsCount
  );
  const smallApplianceLaundryVa =
    actualSmallAppCircuits * NEC_220_82_CONSTANTS.smallApplianceCircuitVa +
    actualLaundryCircuits * NEC_220_82_CONSTANTS.laundryCircuitVa;

  steps.push({
    label: "Small Appliance & Laundry Circuits (NEC 220.82(B)(2))",
    formula: "VA = (Small Appliance Circuits × 1,500 VA) + (Laundry Circuits × 1,500 VA)",
    values: `(${actualSmallAppCircuits} × 1,500) + (${actualLaundryCircuits} × 1,500)`,
    result: `${smallApplianceLaundryVa} VA`,
  });

  // 3. Fixed Household Appliances
  let fixedAppliancesTotalVa = 0;
  if (includeElectricRange) fixedAppliancesTotalVa += Math.max(0, electricRangeWatts);
  if (includeElectricDryer) {
    // Electric dryer minimum 5,000 VA or nameplate (NEC 220.54)
    fixedAppliancesTotalVa += Math.max(
      NEC_220_82_CONSTANTS.defaultApplianceRatings.electricDryer,
      electricDryerWatts
    );
  }
  if (includeElectricWaterHeater) fixedAppliancesTotalVa += Math.max(0, electricWaterHeaterWatts);
  if (includeDishwasher) fixedAppliancesTotalVa += Math.max(0, dishwasherWatts);
  if (includeGarbageDisposal) fixedAppliancesTotalVa += Math.max(0, garbageDisposalWatts);
  if (includeMicrowave) fixedAppliancesTotalVa += Math.max(0, microwaveWatts);
  if (includeHotTubSpa) fixedAppliancesTotalVa += Math.max(0, hotTubSpaWatts);
  if (includePoolPumpHeater) fixedAppliancesTotalVa += Math.max(0, poolPumpHeaterWatts);
  if (includeWellPump) fixedAppliancesTotalVa += Math.max(0, wellPumpWatts);

  if (customAppliances && customAppliances.length > 0) {
    for (const app of customAppliances) {
      if (app.watts > 0) {
        fixedAppliancesTotalVa += app.watts;
      }
    }
  }

  steps.push({
    label: "Fixed Household Appliances Sum (NEC 220.82(B)(3))",
    formula: "VA = Σ (Electric Range, Dryer, Water Heater, Dishwasher, Disposal, Microwave, Spas, Pumps)",
    values: `Fixed appliances included: ${fixedAppliancesTotalVa} W nameplate sum`,
    result: `${fixedAppliancesTotalVa} VA`,
  });

  // 4. General Load Demand Calculation (NEC 220.82(B))
  const grossGeneralLoadVa = generalLightingVa + smallApplianceLaundryVa + fixedAppliancesTotalVa;
  let generalDemandFirst10kVa = 0;
  let generalDemandRemainderVa = 0;
  let calculatedGeneralDemandVa = 0;

  if (grossGeneralLoadVa <= NEC_220_82_CONSTANTS.generalDemandThresholdVa) {
    generalDemandFirst10kVa = grossGeneralLoadVa;
    generalDemandRemainderVa = 0;
    calculatedGeneralDemandVa = grossGeneralLoadVa;
  } else {
    generalDemandFirst10kVa = NEC_220_82_CONSTANTS.generalDemandThresholdVa;
    const remainder = grossGeneralLoadVa - NEC_220_82_CONSTANTS.generalDemandThresholdVa;
    generalDemandRemainderVa = roundTo(
      remainder * NEC_220_82_CONSTANTS.generalDemandRemainderPercent,
      0
    );
    calculatedGeneralDemandVa = generalDemandFirst10kVa + generalDemandRemainderVa;
  }

  steps.push({
    label: "General Load Demand Factor Application (NEC 220.82(B))",
    formula: "Demand VA = First 10,000 VA @ 100% + Remainder @ 40%",
    values: `${grossGeneralLoadVa} Gross VA → (10,000 × 1.0) + (${grossGeneralLoadVa - 10000 > 0 ? grossGeneralLoadVa - 10000 : 0} × 0.40)`,
    result: `${calculatedGeneralDemandVa} VA Calculated General Demand`,
  });

  // 5. Electric Vehicle Supply Equipment (EVSE per NEC 625 & Article 220)
  let evChargerConnectedVa = 0;
  let evChargerDemandVa = 0;

  if (includeEvCharger) {
    const rawEvWatts = evChargerWatts && evChargerWatts > 0 ? evChargerWatts : evChargerAmps * serviceVoltage;
    evChargerConnectedVa = rawEvWatts;
    if (isEvContinuous125Pct) {
      evChargerDemandVa = roundTo(
        rawEvWatts * NEC_220_82_CONSTANTS.evContinuousLoadMultiplier,
        0
      );
    } else {
      evChargerDemandVa = rawEvWatts;
    }

    steps.push({
      label: "Electric Vehicle Charger (EVSE per NEC 625.42 Continuous Duty)",
      formula: isEvContinuous125Pct
        ? "EV Demand VA = EV Connected Watts × 125% Continuous Duty"
        : "EV Demand VA = EV Connected Watts @ 100%",
      values: `${evChargerConnectedVa} W connected (${evChargerAmps}A @ ${serviceVoltage}V)${isEvContinuous125Pct ? " × 1.25" : ""}`,
      result: `${evChargerDemandVa} VA`,
    });
  }

  // 6. HVAC Heating & Cooling Non-Coincident Load (NEC 220.82(C))
  const airConditioningVa = includeAirConditioning ? Math.max(0, airConditioningWatts) : 0;
  let heatingVa = 0;

  if (hvacHeatingType === "electric_furnace") {
    heatingVa = Math.max(0, heatingWatts);
  } else if (hvacHeatingType === "heat_pump_with_strip") {
    // Heat pump compressor @ 100% + supplemental electric strip heat @ 100%
    heatingVa = airConditioningVa + Math.max(0, heatingWatts);
  } else if (hvacHeatingType === "heat_pump_no_strip") {
    heatingVa = airConditioningVa;
  } else if (hvacHeatingType === "electric_baseboard") {
    heatingVa = Math.max(0, heatingWatts);
  } else {
    heatingVa = 0;
  }

  let selectedHvacLoadVa = 0;
  let hvacSelectionReason = "";

  if (airConditioningVa >= heatingVa) {
    selectedHvacLoadVa = airConditioningVa;
    hvacSelectionReason = `Air Conditioning load (${airConditioningVa.toLocaleString()} VA) is greater than or equal to Heating load (${heatingVa.toLocaleString()} VA). Smaller heating load is omitted per NEC 220.82(C).`;
  } else {
    selectedHvacLoadVa = heatingVa;
    hvacSelectionReason = `Heating load (${heatingVa.toLocaleString()} VA) is greater than Air Conditioning load (${airConditioningVa.toLocaleString()} VA). Smaller cooling load is omitted per NEC 220.82(C).`;
  }

  steps.push({
    label: "HVAC Non-Coincident Load Selection (NEC 220.82(C))",
    formula: "Selected HVAC VA = MAX(Air Conditioning VA, Heating VA)",
    values: `Cooling: ${airConditioningVa} VA vs Heating: ${heatingVa} VA`,
    result: `${selectedHvacLoadVa} VA (${selectedHvacLoadVa === airConditioningVa ? "Cooling Selected" : "Heating Selected"})`,
  });

  // 7. Total Service Load & Amperage
  const totalCalculatedDemandVa = roundTo(
    calculatedGeneralDemandVa + selectedHvacLoadVa + evChargerDemandVa,
    0
  );
  const totalCalculatedDemandKva = roundTo(totalCalculatedDemandVa / 1000, 2);
  const calculatedServiceAmps = roundTo(totalCalculatedDemandVa / serviceVoltage, 1);

  steps.push({
    label: "Total Service Load & Current Calculation",
    formula: "Total Demand VA = General Demand + Selected HVAC + EV Demand; Amps = Total VA / 240V",
    values: `${calculatedGeneralDemandVa} (General) + ${selectedHvacLoadVa} (HVAC) + ${evChargerDemandVa} (EV) = ${totalCalculatedDemandVa} VA / ${serviceVoltage}V`,
    result: `${calculatedServiceAmps} Amps (${totalCalculatedDemandKva} kVA)`,
  });

  // 8. Service Capacity & Upgrade Assessments
  const recommendedMinimumServiceAmps = findRecommendedServiceRating(calculatedServiceAmps);

  const existingServiceUtilizationPct = roundTo(
    (calculatedServiceAmps / existingServiceRatingAmps) * 100,
    1
  );
  const proposedServiceUtilizationPct = roundTo(
    (calculatedServiceAmps / proposedServiceRatingAmps) * 100,
    1
  );

  function getStatus(utilization: number): ServiceCapacityStatus {
    if (utilization <= 70) return "well_within_capacity";
    if (utilization <= 100) return "approaching_capacity";
    return "service_upgrade_required";
  }

  const existingServiceStatus = getStatus(existingServiceUtilizationPct);
  const proposedServiceStatus = getStatus(proposedServiceUtilizationPct);

  const remainingCapacityAmps = roundTo(
    existingServiceRatingAmps - calculatedServiceAmps,
    1
  );

  // 9. Warnings & Safety Disclosures
  if (calculatedServiceAmps > existingServiceRatingAmps) {
    warnings.push({
      code: "EXISTING_SERVICE_OVERLOADED_UPGRADE_RECOMMENDED",
      field: "existingServiceRatingAmps",
      message: `Calculated service demand load (${calculatedServiceAmps}A) exceeds your existing ${existingServiceRatingAmps}A electrical service panel rating. A service panel upgrade to at least ${recommendedMinimumServiceAmps}A is recommended prior to energizing new high-draw electrical equipment.`,
    });
  }

  if (includeEvCharger && calculatedServiceAmps > 100 && existingServiceRatingAmps <= 100) {
    warnings.push({
      code: "EV_CHARGER_EXCEEDS_100A_PANEL",
      field: "includeEvCharger",
      message: `Adding a Level 2 EV charger (${evChargerAmps}A continuous) pushes total calculated demand past standard 100A service capacity. Consider upgrading to a 200A service panel or installing an intelligent Energy Management System (EMS) / load shedder.`,
    });
  }

  if (hvacHeatingType === "electric_furnace" && heatingWatts >= 15000) {
    warnings.push({
      code: "LARGE_ELECTRIC_FURNACE_LOAD",
      field: "heatingWatts",
      message: `Electric resistance furnace (${heatingWatts / 1000} kW) draws a massive ${roundTo(heatingWatts / serviceVoltage, 1)}A continuous load during cold snaps. A high-efficiency cold-climate heat pump can deliver equivalent heating capacity at 60%–70% lower electrical amperage.`,
    });
  }

  // Technical Disclaimer
  warnings.push({
    code: "NEC_220_82_DISCLAIMER",
    message: "Calculated using the NEC Article 220.82 Optional Calculation methodology for single-family dwellings. This calculator is an educational estimation aid and does not replace an on-site inspection, official permit plan, or stamped engineering calculation by a licensed electrical contractor or professional engineer.",
  });

  const breakdown: ElectricalLoadDetailedBreakdown = {
    generalLightingVa,
    smallApplianceLaundryVa,
    fixedAppliancesTotalVa,
    grossGeneralLoadVa,
    generalDemandFirst10kVa,
    generalDemandRemainderVa,
    calculatedGeneralDemandVa,
    airConditioningVa,
    heatingVa,
    selectedHvacLoadVa,
    hvacSelectionReason,
    evChargerConnectedVa,
    evChargerDemandVa,
    totalCalculatedDemandVa,
    totalCalculatedDemandKva,
    calculatedServiceAmps,
  };

  return {
    totalCalculatedDemandVa,
    totalCalculatedDemandKva,
    calculatedServiceAmps,
    existingServiceRatingAmps,
    proposedServiceRatingAmps,
    recommendedMinimumServiceAmps,
    existingServiceUtilizationPct,
    proposedServiceUtilizationPct,
    existingServiceStatus,
    proposedServiceStatus,
    remainingCapacityAmps,
    breakdown,
    warnings,
    steps,
  };
}
