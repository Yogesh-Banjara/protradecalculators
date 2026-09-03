import type {
  HvacLoadDetailedBreakdown,
  HvacLoadInput,
  HvacLoadResult,
} from "@/types/hvac";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  NOMINAL_AC_TONS,
  SUN_EXPOSURE_MULTIPLIERS,
  getClimateZoneInfo,
  getInsulationProperties,
} from "@/data/references/hvac-types";
import { roundTo } from "./rounding";

/**
 * Pure deterministic calculation engine for HVAC BTU Heating & Cooling Load.
 */
export function calculateHvacLoadProject(input: HvacLoadInput): HvacLoadResult {
  const {
    floorAreaSqFt,
    ceilingHeightFt = 8,
    climateZone = "zone_4",
    insulationGrade = "average",
    sunExposure = "moderate",
    occupantsCount = 2,
    includeKitchen = true,
    windowAreaPercentage = 15,
    ductworkLocation = "unconditioned_attic",
  } = input;

  if (floorAreaSqFt <= 0) {
    throw new RangeError("Conditioned floor area must be greater than zero square feet");
  }
  if (ceilingHeightFt <= 0) {
    throw new RangeError("Ceiling height must be greater than zero feet");
  }
  if (occupantsCount < 0) {
    throw new RangeError("Occupant count cannot be negative");
  }

  const climateInfo = getClimateZoneInfo(climateZone);
  const insulation = getInsulationProperties(insulationGrade);
  const sunMultiplier = SUN_EXPOSURE_MULTIPLIERS[sunExposure] ?? 1.0;

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // 1. Building Geometry
  const conditionedVolumeCuFt = roundTo(floorAreaSqFt * ceilingHeightFt, 0);
  const estimatedPerimeterFt = 4 * Math.sqrt(floorAreaSqFt);
  const grossWallAreaSqFt = estimatedPerimeterFt * ceilingHeightFt;
  const windowAreaSqFt = roundTo(
    floorAreaSqFt * (Math.max(5, Math.min(40, windowAreaPercentage)) / 100),
    1
  );
  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - windowAreaSqFt);
  const ceilingAreaSqFt = floorAreaSqFt;

  steps.push({
    label: "Conditioned Envelope Geometry",
    formula: "Volume = Area × Height; Net Wall = (4 × √Area × Height) − Window Area",
    values: `${floorAreaSqFt} sq ft floor, ${ceilingHeightFt} ft ceiling, ${windowAreaSqFt} sq ft windows (${windowAreaPercentage}%)`,
    result: `${conditionedVolumeCuFt} cu ft volume, ${roundTo(netWallAreaSqFt, 0)} sq ft net wall area`,
  });

  // 2. Conduction Envelope Loads (Walls & Ceilings)
  const envelopeCoolingBtu = roundTo(
    (netWallAreaSqFt * insulation.wallUValue +
      ceilingAreaSqFt * insulation.ceilingUValue) *
      climateInfo.summerDeltaTF,
    0
  );

  const envelopeHeatingBtu = roundTo(
    (netWallAreaSqFt * insulation.wallUValue +
      ceilingAreaSqFt * insulation.ceilingUValue) *
      climateInfo.winterDeltaTF,
    0
  );

  steps.push({
    label: "Envelope Thermal Conduction (Walls & Ceilings)",
    formula: "Q_env = (A_wall × U_wall + A_ceiling × U_ceiling) × ΔT",
    values: `Wall U=${insulation.wallUValue} (R-${insulation.wallRValue}), Ceiling U=${insulation.ceilingUValue} (R-${insulation.ceilingRValue}), Summer ΔT=${climateInfo.summerDeltaTF}°F, Winter ΔT=${climateInfo.winterDeltaTF}°F`,
    result: `Cooling: ${envelopeCoolingBtu} BTU/hr | Heating: ${envelopeHeatingBtu} BTU/hr`,
  });

  // 3. Window Loads (Conduction + Solar Radiation Gain)
  const windowConductionCooling =
    windowAreaSqFt * insulation.windowUValue * climateInfo.summerDeltaTF;
  // Peak solar radiation base = 120 BTU/hr-sqft modified by SHGC and solar orientation
  const windowSolarGainCooling =
    windowAreaSqFt * 120 * insulation.windowShgc * sunMultiplier;
  const windowSolarCoolingBtu = roundTo(
    windowConductionCooling + windowSolarGainCooling,
    0
  );

  const windowConductionHeatingBtu = roundTo(
    windowAreaSqFt * insulation.windowUValue * climateInfo.winterDeltaTF,
    0
  );

  steps.push({
    label: "Window Heat Gain & Conduction (Solar SHGC & Orientation)",
    formula: "Q_win_cool = (A_win × U_win × ΔT_summer) + (A_win × 120 × SHGC × SunFactor)",
    values: `${windowAreaSqFt} sq ft glass, U=${insulation.windowUValue}, SHGC=${insulation.windowShgc}, SunFactor=${sunMultiplier} (${sunExposure})`,
    result: `Cooling: ${windowSolarCoolingBtu} BTU/hr | Heating: ${windowConductionHeatingBtu} BTU/hr`,
  });

  // 4. Infiltration Air Leakage
  const infiltrationCfm = (conditionedVolumeCuFt * insulation.airChangesPerHour) / 60;
  const infiltrationCoolingBtu = roundTo(
    1.08 * infiltrationCfm * climateInfo.summerDeltaTF,
    0
  );
  const infiltrationHeatingBtu = roundTo(
    1.08 * infiltrationCfm * climateInfo.winterDeltaTF,
    0
  );

  steps.push({
    label: "Air Infiltration & Leakage Load",
    formula: "CFM = (Volume × ACH) / 60; Q_infil = 1.08 × CFM × ΔT",
    values: `${roundTo(infiltrationCfm, 1)} CFM (${insulation.airChangesPerHour} ACH), 1.08 constant`,
    result: `Cooling: ${infiltrationCoolingBtu} BTU/hr | Heating: ${infiltrationHeatingBtu} BTU/hr`,
  });

  // 5. Internal Heat Gains (Occupants + Appliances)
  const occupantSensibleBtu = occupantsCount * 230;
  const occupantLatentBtu = occupantsCount * 200;
  const internalAppliancesSensibleBtu = includeKitchen ? 1200 : 0;

  steps.push({
    label: "Internal Heat Gains (Occupants & Kitchen/Electronics)",
    formula: "Q_int = (Occupants × 230 Sensible + 200 Latent) + Kitchen/Appliance Allowance",
    values: `${occupantsCount} occupants (430 BTU/ea), Kitchen=${includeKitchen ? "1,200 BTU/hr" : "0 BTU/hr"}`,
    result: `Sensible: ${occupantSensibleBtu + internalAppliancesSensibleBtu} BTU/hr | Latent: ${occupantLatentBtu} BTU/hr`,
  });

  // 6. Duct Loss / Gain Factor
  let ductLossFactor = 0.12; // default unconditioned attic
  if (ductworkLocation === "conditioned_space") ductLossFactor = 0.0;
  else if (ductworkLocation === "crawlspace") ductLossFactor = 0.08;

  // Latent infiltration in humid climates (Zone 1 & Zone 2)
  let latentInfiltrationBtu = 0;
  if (climateZone === "zone_1" || climateZone === "zone_2") {
    latentInfiltrationBtu = roundTo(0.68 * infiltrationCfm * 18, 0); // 18 gr/lb moisture difference
  }

  const totalSensibleCoolingBtu = roundTo(
    envelopeCoolingBtu +
      windowSolarCoolingBtu +
      infiltrationCoolingBtu +
      occupantSensibleBtu +
      internalAppliancesSensibleBtu,
    0
  );
  const totalLatentCoolingBtu = roundTo(
    occupantLatentBtu + latentInfiltrationBtu,
    0
  );

  const ductLossCoolingBtu = roundTo(
    (totalSensibleCoolingBtu + totalLatentCoolingBtu) * ductLossFactor,
    0
  );
  const coolingLoadBtuHr = roundTo(
    totalSensibleCoolingBtu + totalLatentCoolingBtu + ductLossCoolingBtu,
    0
  );

  const rawHeatingLoad =
    envelopeHeatingBtu + windowConductionHeatingBtu + infiltrationHeatingBtu;
  const ductLossHeatingBtu = roundTo(rawHeatingLoad * ductLossFactor, 0);
  const heatingLoadBtuHr = roundTo(rawHeatingLoad + ductLossHeatingBtu, 0);

  steps.push({
    label: "Total Cooling & Heating Loads (with Duct Distribution Allowance)",
    formula: "Q_total = (Sensible + Latent) × (1 + DuctLossFactor)",
    values: `Duct location: ${ductworkLocation.replace("_", " ")} (+${roundTo(ductLossFactor * 100, 0)}%)`,
    result: `Total Cooling: ${coolingLoadBtuHr} BTU/hr | Total Heating: ${heatingLoadBtuHr} BTU/hr`,
  });

  // 7. AC Tonnage & Equipment Recommendation
  const coolingTonsExact = roundTo(coolingLoadBtuHr / 12000, 2);
  let recommendedCoolingTons = NOMINAL_AC_TONS[0];

  for (const tons of NOMINAL_AC_TONS) {
    if (tons * 12000 >= coolingLoadBtuHr) {
      recommendedCoolingTons = tons;
      break;
    }
    recommendedCoolingTons = tons; // cap at highest standard size
  }

  const coolingSizingMarginPct = roundTo(
    ((recommendedCoolingTons * 12000 - coolingLoadBtuHr) / coolingLoadBtuHr) * 100,
    1
  );

  const heatingKwEquivalent = roundTo(heatingLoadBtuHr / 3412.142, 1);
  const recommendedHeatingBtuHr = roundTo(heatingLoadBtuHr * 1.1, 0); // 10% safety factor for heating recovery

  // Mini-Split Recommendation Text
  let miniSplitZoneRecommendation: string;
  if (coolingLoadBtuHr <= 9500) {
    miniSplitZoneRecommendation = "9,000 BTU (0.75-Ton) Single-Zone Mini-Split";
  } else if (coolingLoadBtuHr <= 13000) {
    miniSplitZoneRecommendation = "12,000 BTU (1.0-Ton) Single-Zone Mini-Split";
  } else if (coolingLoadBtuHr <= 19000) {
    miniSplitZoneRecommendation = "18,000 BTU (1.5-Ton) Mini-Split or Central Heat Pump";
  } else if (coolingLoadBtuHr <= 26000) {
    miniSplitZoneRecommendation = "24,000 BTU (2.0-Ton) Multi-Zone or Central Heat Pump";
  } else if (coolingLoadBtuHr <= 38000) {
    miniSplitZoneRecommendation = "36,000 BTU (3.0-Ton) Central Heat Pump / Split System";
  } else if (coolingLoadBtuHr <= 50000) {
    miniSplitZoneRecommendation = "48,000 BTU (4.0-Ton) Central Heat Pump / Split System";
  } else {
    miniSplitZoneRecommendation = "60,000 BTU (5.0-Ton) or Dual-System Zoned Heat Pump";
  }

  // Warnings
  if (insulationGrade === "poor") {
    warnings.push({
      code: "POOR_INSULATION_HIGH_HEAT_LOAD",
      field: "insulationGrade",
      message: "Pre-1980 minimal insulation significantly inflates both heating and cooling requirements. Air sealing attic bypasses and adding R-38 attic insulation could reduce equipment size by up to 25%.",
    });
  }

  if (coolingLoadBtuHr > 60000) {
    warnings.push({
      code: "LARGE_COMMERCIAL_RESIDENTIAL_LOAD",
      field: "floorAreaSqFt",
      message: `Total cooling load (${coolingLoadBtuHr.toLocaleString()} BTU/hr) exceeds standard 5-ton single residential equipment capacity. A multi-zone dual split system or multi-head VRF system is recommended.`,
    });
  }

  if (climateZone === "zone_6" || climateZone === "zone_7" || heatingLoadBtuHr > coolingLoadBtuHr * 1.3) {
    warnings.push({
      code: "HEATING_DOMINATED_CLIMATE_NOTICE",
      field: "climateZone",
      message: `Heating load (${heatingLoadBtuHr.toLocaleString()} BTU/hr) is significantly higher than cooling load. Ensure heat pumps have low-ambient cold-climate ratings (rated down to -5°F/-15°F) or dual-fuel auxiliary heat backup.`,
    });
  }

  // Technical Disclaimer
  warnings.push({
    code: "HVAC_LOAD_ESTIMATION_DISCLAIMER",
    message: "Planning load estimation based on standard ASHRAE thermal physics and DOE climate design criteria. This tool is a transparent estimation and sizing aid; it does not constitute an accredited ACCA Manual J calculation or stamped engineering design. Equipment selection and local code compliance should be verified by a licensed mechanical contractor.",
  });

  const breakdown: HvacLoadDetailedBreakdown = {
    envelopeCoolingBtu,
    envelopeHeatingBtu,
    windowSolarCoolingBtu,
    windowConductionHeatingBtu,
    infiltrationCoolingBtu,
    infiltrationHeatingBtu,
    occupantSensibleBtu,
    occupantLatentBtu,
    internalAppliancesSensibleBtu,
    ductLossCoolingBtu,
    ductLossHeatingBtu,
    totalSensibleCoolingBtu,
    totalLatentCoolingBtu,
  };

  return {
    conditionedAreaSqFt: floorAreaSqFt,
    ceilingHeightFt,
    conditionedVolumeCuFt,
    climateZone,
    climateZoneInfo: climateInfo,
    insulationGrade,
    sunExposure,
    occupantsCount,
    coolingLoadBtuHr,
    coolingTonsExact,
    recommendedCoolingTons,
    coolingSizingMarginPct,
    heatingLoadBtuHr,
    heatingKwEquivalent,
    recommendedHeatingBtuHr,
    miniSplitZoneRecommendation,
    breakdown,
    warnings,
    steps,
  };
}
