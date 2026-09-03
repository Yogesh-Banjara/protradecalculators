import type { CalculationStep, CalculationWarning } from "./calculations";

export type ServiceVoltage = 240 | 208 | 120;

export type StandardServiceRatingAmps = 100 | 125 | 150 | 200 | 225 | 400;

export type HvacHeatingType =
  | "none" // Gas/Propane heat or no heating equipment
  | "electric_furnace" // Central electric resistance furnace
  | "heat_pump_with_strip" // Heat pump compressor + supplemental electric strip heat
  | "heat_pump_no_strip" // Heat pump cooling & heating without electric resistance
  | "electric_baseboard"; // Electric baseboard / room space heaters

export interface CustomApplianceEntry {
  readonly id: string;
  readonly name: string;
  readonly watts: number;
}

export interface ElectricalLoadInput {
  // Dwelling Dimensions & Service Ratings
  readonly dwellingFloorAreaSqFt: number;
  readonly existingServiceRatingAmps?: StandardServiceRatingAmps;
  readonly proposedServiceRatingAmps?: StandardServiceRatingAmps;
  readonly serviceVoltage?: ServiceVoltage; // Default: 240V 1-phase

  // General Circuits
  readonly smallApplianceCircuitsCount?: number; // Default: 2 (min per NEC)
  readonly laundryCircuitsCount?: number; // Default: 1 (min per NEC)

  // Standard Fixed Kitchen & Laundry Appliances
  readonly includeElectricRange?: boolean;
  readonly electricRangeWatts?: number; // Default: 8,000 W (or nameplate)

  readonly includeElectricDryer?: boolean;
  readonly electricDryerWatts?: number; // Default: 5,000 W (min per NEC)

  readonly includeElectricWaterHeater?: boolean;
  readonly electricWaterHeaterWatts?: number; // Default: 4,500 W

  readonly includeDishwasher?: boolean;
  readonly dishwasherWatts?: number; // Default: 1,500 W

  readonly includeGarbageDisposal?: boolean;
  readonly garbageDisposalWatts?: number; // Default: 900 W

  readonly includeMicrowave?: boolean;
  readonly microwaveWatts?: number; // Default: 1,500 W

  // Fixed Heavy / Luxury Loads
  readonly includeHotTubSpa?: boolean;
  readonly hotTubSpaWatts?: number; // Default: 6,000 W

  readonly includePoolPumpHeater?: boolean;
  readonly poolPumpHeaterWatts?: number; // Default: 4,000 W

  readonly includeWellPump?: boolean;
  readonly wellPumpWatts?: number; // Default: 1,500 W

  readonly customAppliances?: readonly CustomApplianceEntry[];

  // EV Charging (Continuous Load per NEC 625)
  readonly includeEvCharger?: boolean;
  readonly evChargerAmps?: number; // e.g. 32A, 40A, 48A, 80A
  readonly evChargerWatts?: number; // Default derived from Amps * 240V
  readonly isEvContinuous125Pct?: boolean; // Default: true (125% continuous rating)

  // HVAC Cooling & Heating (Non-Coincident Load Selection per NEC 220.82(C))
  readonly includeAirConditioning?: boolean;
  readonly airConditioningWatts?: number; // e.g. 3,500 W (3-Ton AC ~ 3.5 kW)

  readonly hvacHeatingType?: HvacHeatingType;
  readonly heatingWatts?: number; // e.g. 10,000 W (10 kW electric furnace / strip)
}

export interface ElectricalLoadDetailedBreakdown {
  readonly generalLightingVa: number; // 3 VA/sq ft
  readonly smallApplianceLaundryVa: number; // 1,500 VA per circuit
  readonly fixedAppliancesTotalVa: number;
  readonly grossGeneralLoadVa: number; // Sum of lighting + small appliances + fixed appliances
  readonly generalDemandFirst10kVa: number; // 100% of first 10,000 VA
  readonly generalDemandRemainderVa: number; // 40% of remainder
  readonly calculatedGeneralDemandVa: number; // First 10k + 40% of remainder

  readonly airConditioningVa: number;
  readonly heatingVa: number;
  readonly selectedHvacLoadVa: number;
  readonly hvacSelectionReason: string;

  readonly evChargerConnectedVa: number;
  readonly evChargerDemandVa: number; // with 125% factor if continuous

  readonly totalCalculatedDemandVa: number;
  readonly totalCalculatedDemandKva: number;
  readonly calculatedServiceAmps: number;
}

export type ServiceCapacityStatus =
  | "well_within_capacity" // <= 70% utilization (Ample spare capacity for future loads)
  | "approaching_capacity" // 71% - 100% utilization (Acceptable, but limited future expansion)
  | "service_upgrade_required"; // > 100% utilization (Calculated load exceeds service rating)

export interface ElectricalLoadResult {
  readonly totalCalculatedDemandVa: number;
  readonly totalCalculatedDemandKva: number;
  readonly calculatedServiceAmps: number;
  readonly existingServiceRatingAmps: StandardServiceRatingAmps;
  readonly proposedServiceRatingAmps: StandardServiceRatingAmps;
  readonly recommendedMinimumServiceAmps: StandardServiceRatingAmps;
  readonly existingServiceUtilizationPct: number;
  readonly proposedServiceUtilizationPct: number;
  readonly existingServiceStatus: ServiceCapacityStatus;
  readonly proposedServiceStatus: ServiceCapacityStatus;
  readonly remainingCapacityAmps: number;
  readonly breakdown: ElectricalLoadDetailedBreakdown;
  readonly warnings: readonly CalculationWarning[];
  readonly steps: readonly CalculationStep[];
}
