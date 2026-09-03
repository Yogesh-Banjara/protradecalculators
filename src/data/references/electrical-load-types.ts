import type { StandardServiceRatingAmps } from "@/types/electrical-load";

/**
 * Standard residential service panel main breaker ratings in Amperes.
 */
export const STANDARD_RESIDENTIAL_SERVICE_SIZES: readonly StandardServiceRatingAmps[] = [
  100, 125, 150, 200, 225, 400,
] as const;

/**
 * NEC Article 220.82 Optional Calculation Method Constants.
 * Source: NFPA 70 (National Electrical Code) Article 220, Part IV.
 */
export const NEC_220_82_CONSTANTS = {
  // General Lighting & Receptacle Load (NEC 220.82(B)(1))
  generalLightingVaPerSqFt: 3.0,

  // Small Appliance & Laundry Branch Circuits (NEC 220.82(B)(2))
  smallApplianceCircuitVa: 1500,
  laundryCircuitVa: 1500,
  minSmallApplianceCircuits: 2,
  minLaundryCircuits: 1,

  // General Load Demand Factor Thresholds (NEC 220.82(B))
  generalDemandThresholdVa: 10000,
  generalDemandFirstTierPercent: 1.0, // 100% of first 10 kVA
  generalDemandRemainderPercent: 0.4, // 40% of all VA over 10 kVA

  // Electric Vehicle Supply Equipment Continuous Duty Multiplier (NEC 625 & Article 100)
  evContinuousLoadMultiplier: 1.25, // 125% continuous duty rating

  // Standard Default Nameplate Ratings (Watts/VA) for Common Residential Appliances
  defaultApplianceRatings: {
    electricRange: 8000, // Standard 8.0 kW range (or actual nameplate)
    electricDryer: 5000, // Standard 5.0 kW dryer (min 5,000 VA per NEC 220.54)
    electricWaterHeater: 4500, // Standard 4.5 kW residential dual-element water heater
    dishwasher: 1500, // Standard 1.5 kW motor & heating element
    garbageDisposal: 900, // Standard 0.75 HP motor (~900 VA)
    microwave: 1500, // Standard 1.5 kW countertop/over-range microwave
    wellPump: 1500, // Standard 1.0 HP submersible well pump
    hotTubSpa: 6000, // Standard 240V 50A spa heater (6.0 kW)
    poolPumpHeater: 4000, // Standard 240V pool filtration & heater pump
  },
} as const;

/**
 * Finds the smallest standard service panel rating that satisfies the calculated amperage.
 */
export function findRecommendedServiceRating(calculatedAmps: number): StandardServiceRatingAmps {
  for (const rating of STANDARD_RESIDENTIAL_SERVICE_SIZES) {
    if (rating >= calculatedAmps) {
      return rating;
    }
  }
  return 400; // Cap at 400A standard residential class
}
