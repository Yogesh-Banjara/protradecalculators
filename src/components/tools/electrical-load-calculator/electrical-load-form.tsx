"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  CustomApplianceEntry,
  ElectricalLoadInput,
  ElectricalLoadResult,
  HvacHeatingType,
  StandardServiceRatingAmps,
} from "@/types/electrical-load";
import {
  NEC_220_82_CONSTANTS,
  STANDARD_RESIDENTIAL_SERVICE_SIZES,
} from "@/data/references/electrical-load-types";
import { calculateResidentialElectricalLoad } from "@/lib/calculations/electrical-load";
import { ElectricalLoadDiagram } from "./electrical-load-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PrintButton, JobsitePrintHeader } from "@/components/ui/print-view";
import { EmbedModal } from "@/components/tools/embed-modal";
import {
  trackCalculatorStarted,
  trackResultGenerated,
  trackCopyResult,
} from "@/lib/analytics/events";
import {
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Plus,
  Trash2,
  Gauge,
  Flame,
  Snowflake,
  Car,
} from "lucide-react";

const PRESETS = [
  {
    label: "Standard 1,800 sq ft Home (100A Panel / Gas Heat)",
    sqft: 1800,
    existingService: 100 as StandardServiceRatingAmps,
    proposedService: 200 as StandardServiceRatingAmps,
    range: true,
    dryer: true,
    waterHeater: true,
    ac: true,
    acWatts: 3500,
    heatingType: "none" as HvacHeatingType,
    heatingWatts: 0,
    ev: false,
    evAmps: 32,
    spa: false,
  },
  {
    label: "100A to 200A Upgrade (EV Charger Added)",
    sqft: 2000,
    existingService: 100 as StandardServiceRatingAmps,
    proposedService: 200 as StandardServiceRatingAmps,
    range: true,
    dryer: true,
    waterHeater: true,
    ac: true,
    acWatts: 4000,
    heatingType: "none" as HvacHeatingType,
    heatingWatts: 0,
    ev: true,
    evAmps: 40,
    spa: false,
  },
  {
    label: "All-Electric Home (Heat Pump + EV + Induction)",
    sqft: 2400,
    existingService: 150 as StandardServiceRatingAmps,
    proposedService: 200 as StandardServiceRatingAmps,
    range: true,
    dryer: true,
    waterHeater: true,
    ac: true,
    acWatts: 4500,
    heatingType: "heat_pump_with_strip" as HvacHeatingType,
    heatingWatts: 10000,
    ev: true,
    evAmps: 48,
    spa: false,
  },
  {
    label: "Large 3,400 sq ft Estate (Hot Tub + Dual EV)",
    sqft: 3400,
    existingService: 200 as StandardServiceRatingAmps,
    proposedService: 400 as StandardServiceRatingAmps,
    range: true,
    dryer: true,
    waterHeater: true,
    ac: true,
    acWatts: 7000,
    heatingType: "heat_pump_with_strip" as HvacHeatingType,
    heatingWatts: 15000,
    ev: true,
    evAmps: 80,
    spa: true,
  },
  {
    label: "Small 900 sq ft ADU / Cottage",
    sqft: 900,
    existingService: 100 as StandardServiceRatingAmps,
    proposedService: 100 as StandardServiceRatingAmps,
    range: true,
    dryer: false,
    waterHeater: true,
    ac: true,
    acWatts: 2000,
    heatingType: "heat_pump_no_strip" as HvacHeatingType,
    heatingWatts: 2000,
    ev: false,
    evAmps: 32,
    spa: false,
  },
];

export function ElectricalLoadCalculatorForm() {
  // Dwelling Geometry & Service Ratings
  const [dwellingFloorAreaSqFt, setDwellingFloorAreaSqFt] = useState<number>(2000);
  const [existingServiceRatingAmps, setExistingServiceRatingAmps] = useState<StandardServiceRatingAmps>(100);
  const [proposedServiceRatingAmps, setProposedServiceRatingAmps] = useState<StandardServiceRatingAmps>(200);

  // General Circuits
  const [smallApplianceCircuitsCount, setSmallApplianceCircuitsCount] = useState<number>(2);
  const [laundryCircuitsCount, setLaundryCircuitsCount] = useState<number>(1);

  // Standard Fixed Appliances
  const [includeElectricRange, setIncludeElectricRange] = useState<boolean>(true);
  const [electricRangeWatts, setElectricRangeWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.electricRange
  );

  const [includeElectricDryer, setIncludeElectricDryer] = useState<boolean>(true);
  const [electricDryerWatts, setElectricDryerWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.electricDryer
  );

  const [includeElectricWaterHeater, setIncludeElectricWaterHeater] = useState<boolean>(true);
  const [electricWaterHeaterWatts, setElectricWaterHeaterWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.electricWaterHeater
  );

  const [includeDishwasher, setIncludeDishwasher] = useState<boolean>(true);
  const [dishwasherWatts, setDishwasherWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.dishwasher
  );

  const [includeGarbageDisposal, setIncludeGarbageDisposal] = useState<boolean>(true);
  const [garbageDisposalWatts, setGarbageDisposalWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.garbageDisposal
  );

  const [includeMicrowave, setIncludeMicrowave] = useState<boolean>(true);
  const [microwaveWatts, setMicrowaveWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.microwave
  );

  // Heavy / Special Fixed Loads
  const [includeHotTubSpa, setIncludeHotTubSpa] = useState<boolean>(false);
  const [hotTubSpaWatts, setHotTubSpaWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.hotTubSpa
  );

  const [includePoolPumpHeater, setIncludePoolPumpHeater] = useState<boolean>(false);
  const [poolPumpHeaterWatts, setPoolPumpHeaterWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.poolPumpHeater
  );

  const [includeWellPump, setIncludeWellPump] = useState<boolean>(false);
  const [wellPumpWatts, setWellPumpWatts] = useState<number>(
    NEC_220_82_CONSTANTS.defaultApplianceRatings.wellPump
  );

  const [customAppliances, setCustomAppliances] = useState<CustomApplianceEntry[]>([]);

  // EV Charger Load
  const [includeEvCharger, setIncludeEvCharger] = useState<boolean>(false);
  const [evChargerAmps, setEvChargerAmps] = useState<number>(40);
  const [isEvContinuous125Pct, setIsEvContinuous125Pct] = useState<boolean>(true);

  // HVAC Cooling & Heating Loads
  const [includeAirConditioning, setIncludeAirConditioning] = useState<boolean>(true);
  const [airConditioningWatts, setAirConditioningWatts] = useState<number>(3500);

  const [hvacHeatingType, setHvacHeatingType] = useState<HvacHeatingType>("none");
  const [heatingWatts, setHeatingWatts] = useState<number>(10000);

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("residential-load-calculator", "electrical");
  }, []);

  const calculationResult: {
    result?: ElectricalLoadResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: ElectricalLoadInput = {
        dwellingFloorAreaSqFt,
        existingServiceRatingAmps,
        proposedServiceRatingAmps,
        serviceVoltage: 240,
        smallApplianceCircuitsCount,
        laundryCircuitsCount,
        includeElectricRange,
        electricRangeWatts,
        includeElectricDryer,
        electricDryerWatts,
        includeElectricWaterHeater,
        electricWaterHeaterWatts,
        includeDishwasher,
        dishwasherWatts,
        includeGarbageDisposal,
        garbageDisposalWatts,
        includeMicrowave,
        microwaveWatts,
        includeHotTubSpa,
        hotTubSpaWatts,
        includePoolPumpHeater,
        poolPumpHeaterWatts,
        includeWellPump,
        wellPumpWatts,
        customAppliances,
        includeEvCharger,
        evChargerAmps,
        isEvContinuous125Pct,
        includeAirConditioning,
        airConditioningWatts,
        hvacHeatingType,
        heatingWatts,
      };
      const res = calculateResidentialElectricalLoad(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    dwellingFloorAreaSqFt,
    existingServiceRatingAmps,
    proposedServiceRatingAmps,
    smallApplianceCircuitsCount,
    laundryCircuitsCount,
    includeElectricRange,
    electricRangeWatts,
    includeElectricDryer,
    electricDryerWatts,
    includeElectricWaterHeater,
    electricWaterHeaterWatts,
    includeDishwasher,
    dishwasherWatts,
    includeGarbageDisposal,
    garbageDisposalWatts,
    includeMicrowave,
    microwaveWatts,
    includeHotTubSpa,
    hotTubSpaWatts,
    includePoolPumpHeater,
    poolPumpHeaterWatts,
    includeWellPump,
    wellPumpWatts,
    customAppliances,
    includeEvCharger,
    evChargerAmps,
    isEvContinuous125Pct,
    includeAirConditioning,
    airConditioningWatts,
    hvacHeatingType,
    heatingWatts,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("residential-load-calculator", "electrical", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "Amps",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    setDwellingFloorAreaSqFt(2000);
    setExistingServiceRatingAmps(100);
    setProposedServiceRatingAmps(200);
    setSmallApplianceCircuitsCount(2);
    setLaundryCircuitsCount(1);
    setIncludeElectricRange(true);
    setElectricRangeWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.electricRange);
    setIncludeElectricDryer(true);
    setElectricDryerWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.electricDryer);
    setIncludeElectricWaterHeater(true);
    setElectricWaterHeaterWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.electricWaterHeater);
    setIncludeDishwasher(true);
    setDishwasherWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.dishwasher);
    setIncludeGarbageDisposal(true);
    setGarbageDisposalWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.garbageDisposal);
    setIncludeMicrowave(true);
    setMicrowaveWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.microwave);
    setIncludeHotTubSpa(false);
    setHotTubSpaWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.hotTubSpa);
    setIncludePoolPumpHeater(false);
    setPoolPumpHeaterWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.poolPumpHeater);
    setIncludeWellPump(false);
    setWellPumpWatts(NEC_220_82_CONSTANTS.defaultApplianceRatings.wellPump);
    setCustomAppliances([]);
    setIncludeEvCharger(false);
    setEvChargerAmps(40);
    setIsEvContinuous125Pct(true);
    setIncludeAirConditioning(true);
    setAirConditioningWatts(3500);
    setHvacHeatingType("none");
    setHeatingWatts(10000);
  };

  const addCustomAppliance = () => {
    const newId = `app-${Date.now()}`;
    setCustomAppliances([
      ...customAppliances,
      { id: newId, name: "Workshop Tool / Equipment", watts: 2000 },
    ]);
  };

  const removeCustomAppliance = (id: string) => {
    setCustomAppliances(customAppliances.filter((a) => a.id !== id));
  };

  const updateCustomAppliance = (id: string, field: "name" | "watts", value: string | number) => {
    setCustomAppliances(
      customAppliances.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const res = calculationResult.result;

    const summaryLines = [
      "RESIDENTIAL ELECTRICAL SERVICE LOAD TAKEOFF (NEC 220.82)",
      "=========================================================",
      `Dwelling Floor Area: ${dwellingFloorAreaSqFt} sq ft`,
      `Existing Service Rating: ${res.existingServiceRatingAmps}A (${res.existingServiceUtilizationPct}% Utilized - ${res.existingServiceStatus.toUpperCase()})`,
      `Proposed Service Rating: ${res.proposedServiceRatingAmps}A (${res.proposedServiceUtilizationPct}% Utilized)`,
      `Minimum Recommended Service: ${res.recommendedMinimumServiceAmps}A Panel`,
      "",
      "CALCULATED DEMAND LOAD SUMMARY:",
      `  • Calculated Service Current: ${res.calculatedServiceAmps} Amps @ 240V`,
      `  • Total Calculated Demand: ${res.totalCalculatedDemandKva} kVA (${res.totalCalculatedDemandVa.toLocaleString()} VA)`,
      `  • General Demand Load (NEC 220.82(B)): ${res.breakdown.calculatedGeneralDemandVa.toLocaleString()} VA`,
      `  • Selected HVAC Load (NEC 220.82(C)): ${res.breakdown.selectedHvacLoadVa.toLocaleString()} VA (${res.breakdown.airConditioningVa >= res.breakdown.heatingVa ? "Cooling" : "Heating"} Selected)`,
      ...(res.breakdown.evChargerDemandVa > 0
        ? [`  • EV Charger Demand (NEC 625): ${res.breakdown.evChargerDemandVa.toLocaleString()} VA`]
        : []),
      "",
      "Reference: NEC 2023 Article 220.82 Optional Residential Load Method",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("residential-load-calculator", "electrical", "panelLoadSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print Header */}
      <JobsitePrintHeader
        title="Residential Electrical Service Load Calculation Worksheet (NEC 220.82)"
        category="Electrical & Conduit"
      />

      {/* Main Form Section */}
      <div className="space-y-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Dwelling Service &amp; Appliance Electrical Parameters
            </h2>
            <p className="text-xs text-slate-300">
              Calculate residential service demand load in Amps and VA using the NEC Article 220.82 Optional Method.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="text-slate-300 hover:text-white border-slate-700 bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg border border-slate-200 bg-white text-xs">
          <span className="text-slate-500 font-bold mr-1">Quick Scenarios:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setDwellingFloorAreaSqFt(preset.sqft);
                setExistingServiceRatingAmps(preset.existingService);
                setProposedServiceRatingAmps(preset.proposedService);
                setIncludeElectricRange(preset.range);
                setIncludeElectricDryer(preset.dryer);
                setIncludeElectricWaterHeater(preset.waterHeater);
                setIncludeAirConditioning(preset.ac);
                setAirConditioningWatts(preset.acWatts);
                setHvacHeatingType(preset.heatingType);
                setHeatingWatts(preset.heatingWatts);
                setIncludeEvCharger(preset.ev);
                setEvChargerAmps(preset.evAmps);
                setIncludeHotTubSpa(preset.spa);
              }}
              className="text-[11px] px-2 py-0.5 rounded border bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Section 1: Dwelling Geometry & Service Ratings */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Gauge className="h-4 w-4 text-amber-600" />
            1. Dwelling Floor Area &amp; Service Panel Ratings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField id="floor-area" label="Living Floor Area (sq ft)" required>
              <Input
                id="floor-area"
                type="number"
                min="200"
                max="25000"
                step="50"
                value={dwellingFloorAreaSqFt || ""}
                onChange={(e) => setDwellingFloorAreaSqFt(parseFloat(e.target.value) || 0)}
                placeholder="2000"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Conditioned living area (3 VA/sq ft per NEC 220.82(B)(1))
              </span>
            </FormField>

            <div>
              <label htmlFor="existing-service" className="text-xs font-bold text-slate-700 block mb-1">
                Existing Service Panel Rating
              </label>
              <select
                id="existing-service"
                value={existingServiceRatingAmps}
                onChange={(e) =>
                  setExistingServiceRatingAmps(parseInt(e.target.value, 10) as StandardServiceRatingAmps)
                }
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              >
                {STANDARD_RESIDENTIAL_SERVICE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}A Service (Main Breaker)
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Current electrical main breaker capacity
              </span>
            </div>

            <div>
              <label htmlFor="proposed-service" className="text-xs font-bold text-slate-700 block mb-1">
                Proposed Upgrade Service Rating
              </label>
              <select
                id="proposed-service"
                value={proposedServiceRatingAmps}
                onChange={(e) =>
                  setProposedServiceRatingAmps(parseInt(e.target.value, 10) as StandardServiceRatingAmps)
                }
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              >
                {STANDARD_RESIDENTIAL_SERVICE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}A Service Panel
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target panel size if upgrading
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Major Fixed Household Appliances */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Zap className="h-4 w-4 text-amber-600" />
            2. Fixed Household Appliances (NEC 220.82(B)(3))
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {/* Range */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeElectricRange}
                  onChange={(e) => setIncludeElectricRange(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Electric Range / Cooktop
              </label>
              {includeElectricRange && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="1000"
                    max="20000"
                    step="500"
                    value={electricRangeWatts}
                    onChange={(e) => setElectricRangeWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Dryer */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeElectricDryer}
                  onChange={(e) => setIncludeElectricDryer(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Electric Clothes Dryer
              </label>
              {includeElectricDryer && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="3000"
                    max="12000"
                    step="500"
                    value={electricDryerWatts}
                    onChange={(e) => setElectricDryerWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Water Heater */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeElectricWaterHeater}
                  onChange={(e) => setIncludeElectricWaterHeater(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Electric Water Heater
              </label>
              {includeElectricWaterHeater && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="1000"
                    max="10000"
                    step="500"
                    value={electricWaterHeaterWatts}
                    onChange={(e) => setElectricWaterHeaterWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Dishwasher */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDishwasher}
                  onChange={(e) => setIncludeDishwasher(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Dishwasher
              </label>
              {includeDishwasher && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="500"
                    max="3000"
                    step="100"
                    value={dishwasherWatts}
                    onChange={(e) => setDishwasherWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Garbage Disposal */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGarbageDisposal}
                  onChange={(e) => setIncludeGarbageDisposal(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Garbage Disposal
              </label>
              {includeGarbageDisposal && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="300"
                    max="2000"
                    step="100"
                    value={garbageDisposalWatts}
                    onChange={(e) => setGarbageDisposalWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Microwave */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMicrowave}
                  onChange={(e) => setIncludeMicrowave(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Microwave (Fixed/Over-Range)
              </label>
              {includeMicrowave && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="500"
                    max="2500"
                    step="100"
                    value={microwaveWatts}
                    onChange={(e) => setMicrowaveWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: EV Charging & Heavy Equipment */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Car className="h-4 w-4 text-emerald-600" />
            3. EV Charging &amp; Special Continuous Loads (NEC 625)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* EV Charger */}
            <div className="p-3 rounded border border-emerald-200 bg-emerald-50/50 space-y-2 col-span-1 sm:col-span-2">
              <label className="flex items-center gap-2 font-bold text-emerald-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEvCharger}
                  onChange={(e) => setIncludeEvCharger(e.target.checked)}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                Level 2 Electric Vehicle (EV) Charger
              </label>
              {includeEvCharger && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-600 font-bold block mb-1">Breaker Size / Amps</span>
                      <select
                        value={evChargerAmps}
                        onChange={(e) => setEvChargerAmps(parseInt(e.target.value, 10))}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-900"
                      >
                        <option value={16}>16A (3.8 kW)</option>
                        <option value={24}>24A (5.8 kW)</option>
                        <option value={32}>32A (7.7 kW - Standard L2)</option>
                        <option value={40}>40A (9.6 kW - High Power)</option>
                        <option value={48}>48A (11.5 kW - Hardwired)</option>
                        <option value={80}>80A (19.2 kW - Dual Motor)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-600 font-bold block mb-1">Continuous Duty Factor</span>
                      <label className="flex items-center gap-1.5 text-xs text-slate-800 pt-1">
                        <input
                          type="checkbox"
                          checked={isEvContinuous125Pct}
                          onChange={(e) => setIsEvContinuous125Pct(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600"
                        />
                        125% Continuous (NEC 625)
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hot Tub / Spa */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHotTubSpa}
                  onChange={(e) => setIncludeHotTubSpa(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Hot Tub / Spa
              </label>
              {includeHotTubSpa && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="1500"
                    max="12000"
                    step="500"
                    value={hotTubSpaWatts}
                    onChange={(e) => setHotTubSpaWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>

            {/* Pool Pump */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePoolPumpHeater}
                  onChange={(e) => setIncludePoolPumpHeater(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Pool Pump / Heater
              </label>
              {includePoolPumpHeater && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="1000"
                    max="15000"
                    step="500"
                    value={poolPumpHeaterWatts}
                    onChange={(e) => setPoolPumpHeaterWatts(parseInt(e.target.value, 10) || 0)}
                    className="h-7 text-xs font-bold text-right"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                </div>
              )}
            </div>
          </div>

          {/* Custom Fixed Appliances Builder */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Custom Fixed Equipment / Workshop</span>
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomAppliance}
                className="text-xs text-slate-800 border-slate-300 bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Custom Load
              </Button>
            </div>

            {customAppliances.length > 0 && (
              <div className="space-y-2">
                {customAppliances.map((app) => (
                  <div key={app.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => updateCustomAppliance(app.id, "name", e.target.value)}
                      className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                      placeholder="e.g. Table Saw / Welder"
                    />
                    <div className="flex items-center gap-1 w-32">
                      <input
                        type="number"
                        min="100"
                        max="25000"
                        step="100"
                        value={app.watts || ""}
                        onChange={(e) =>
                          updateCustomAppliance(app.id, "watts", parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-right text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">W</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomAppliance(app.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      aria-label="Remove Custom Load"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: HVAC Heating & Cooling (Non-Coincident Load Selection) */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Snowflake className="h-4 w-4 text-sky-600" />
            4. HVAC Heating &amp; Cooling (Non-Coincident Selection - NEC 220.82(C))
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Cooling Side */}
            <div className="p-3 rounded border border-sky-200 bg-sky-50/50 space-y-2">
              <label className="flex items-center gap-2 font-bold text-sky-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAirConditioning}
                  onChange={(e) => setIncludeAirConditioning(e.target.checked)}
                  className="rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                />
                Central Air Conditioning
              </label>
              {includeAirConditioning && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min="500"
                      max="15000"
                      step="500"
                      value={airConditioningWatts}
                      onChange={(e) => setAirConditioningWatts(parseInt(e.target.value, 10) || 0)}
                      className="h-7 text-xs font-bold text-right"
                    />
                    <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    ~3,500 W for typical 3.0-Ton AC (~14.5A @ 240V)
                  </span>
                </div>
              )}
            </div>

            {/* Heating Side */}
            <div className="p-3 rounded border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Flame className="h-4 w-4 text-amber-600" />
                Space Heating System
              </div>

              <div>
                <select
                  value={hvacHeatingType}
                  onChange={(e) => setHvacHeatingType(e.target.value as HvacHeatingType)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-900 mb-1.5"
                >
                  <option value="none">None (Gas / Propane Furnace)</option>
                  <option value="heat_pump_with_strip">Heat Pump + Supplemental Electric Strip Heat</option>
                  <option value="heat_pump_no_strip">Heat Pump Only (No Electric Resistance)</option>
                  <option value="electric_furnace">Central Electric Resistance Furnace</option>
                  <option value="electric_baseboard">Electric Baseboard Heaters</option>
                </select>

                {hvacHeatingType !== "none" && hvacHeatingType !== "heat_pump_no_strip" && (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min="1000"
                      max="30000"
                      step="1000"
                      value={heatingWatts}
                      onChange={(e) => setHeatingWatts(parseInt(e.target.value, 10) || 0)}
                      className="h-7 text-xs font-bold text-right"
                    />
                    <span className="text-[11px] text-slate-500 font-mono">Watts</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check your dwelling parameters.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Primary Hero Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Residential Electrical Service Load Results (NEC 220.82)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {dwellingFloorAreaSqFt} sq ft Dwelling
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Amps & kVA Hero Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calculated Service Amperage */}
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                    Calculated Service Demand Load:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.calculatedServiceAmps}
                    </span>
                    <span className="text-lg text-slate-300 font-sans">
                      Amps @ 240V 1-Phase
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Total Demand:{" "}
                    <span className="text-slate-100 font-mono font-bold">
                      {result.totalCalculatedDemandKva} kVA
                    </span>{" "}
                    ({result.totalCalculatedDemandVa.toLocaleString()} VA)
                  </p>
                </div>

                {/* Minimum Recommended Service Panel Size */}
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block">
                    Recommended Minimum Service Panel:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-sky-400 font-mono tracking-tight">
                      {result.recommendedMinimumServiceAmps}A
                    </span>
                    <span className="text-lg text-slate-300 font-sans">
                      Main Service Panel
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Existing {result.existingServiceRatingAmps}A panel is{" "}
                    <span
                      className={`font-bold ${
                        result.existingServiceStatus === "well_within_capacity"
                          ? "text-emerald-400"
                          : result.existingServiceStatus === "approaching_capacity"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {result.existingServiceUtilizationPct}% utilized
                    </span>
                  </p>
                </div>
              </div>

              {/* Service Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Existing Service</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.existingServiceRatingAmps}A{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">Panel</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Existing Utilization</span>
                  <span
                    className={`text-xl font-black font-mono ${
                      result.existingServiceStatus === "well_within_capacity"
                        ? "text-emerald-400"
                        : result.existingServiceStatus === "approaching_capacity"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {result.existingServiceUtilizationPct}%
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Proposed Upgrade</span>
                  <span className="text-xl font-bold text-sky-400 font-mono">
                    {result.proposedServiceRatingAmps}A{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">Panel</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Proposed Utilization</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {result.proposedServiceUtilizationPct}%
                  </span>
                </div>
              </div>

              {/* Warnings Callout */}
              {result.warnings.length > 0 && (
                <div className="space-y-2 pt-2">
                  {result.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-amber-950/60 border border-amber-800/80 p-3 rounded-md text-xs text-amber-200"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{w.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800 no-print">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySummaryToClipboard}
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400 mr-1.5" />
                        Copied Load Takeoff!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy Summary
                      </>
                    )}
                  </Button>

                  <PrintButton
                    toolSlug="residential-load-calculator"
                    category="electrical"
                    label="Print Permit Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />

                  <EmbedModal
                    toolSlug="residential-load-calculator"
                    toolName="Residential Electrical Service Load Calculator"
                    buttonLabel="Embed on Your Website"
                    variant="outline"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  Calibrated to NEC Article 220.82 Optional Method
                </span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Panel Blueprint */}
          <ElectricalLoadDiagram result={result} />

          {/* Detailed Demand Load Tabular Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              NEC Article 220.82 Detailed Demand Load Breakdown
            </h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NEC Load Category</TableHead>
                  <TableHead className="text-right">Connected Load</TableHead>
                  <TableHead className="text-right">Demand Factor</TableHead>
                  <TableHead className="text-right">Calculated Demand Load</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    General Lighting &amp; Receptacles (3 VA/sq ft)
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    {result.breakdown.generalLightingVa.toLocaleString()} VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-500">
                    Subject to 10k/40% general tier
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    &mdash;
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    Small Appliance &amp; Laundry Circuits
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    {result.breakdown.smallApplianceLaundryVa.toLocaleString()} VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-500">
                    Subject to 10k/40% general tier
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    &mdash;
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    Fixed Household Appliances Sum
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    {result.breakdown.fixedAppliancesTotalVa.toLocaleString()} VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-500">
                    Subject to 10k/40% general tier
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    &mdash;
                  </TableCell>
                </TableRow>

                <TableRow className="bg-slate-50 font-bold">
                  <TableCell className="text-slate-900">
                    Gross General Load (First 10k @ 100%, Remainder @ 40%)
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-900 text-xs">
                    {result.breakdown.grossGeneralLoadVa.toLocaleString()} VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-amber-700 font-bold">
                    NEC 220.82(B) Demand Applied
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-900 text-xs font-bold">
                    {result.breakdown.calculatedGeneralDemandVa.toLocaleString()} VA
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    HVAC Heating vs Cooling (Non-Coincident Largest Load)
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-700 text-xs">
                    Cooling: {result.breakdown.airConditioningVa.toLocaleString()} VA | Heating: {result.breakdown.heatingVa.toLocaleString()} VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-sky-700 font-bold">
                    Largest Load @ 100% (NEC 220.82(C))
                  </TableCell>
                  <TableCell className="text-right font-mono text-sky-900 text-xs font-bold">
                    {result.breakdown.selectedHvacLoadVa.toLocaleString()} VA
                  </TableCell>
                </TableRow>

                {result.breakdown.evChargerDemandVa > 0 && (
                  <TableRow>
                    <TableCell className="font-bold text-slate-900">
                      Level 2 EV Charger (EVSE Continuous Duty)
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-700 text-xs">
                      {result.breakdown.evChargerConnectedVa.toLocaleString()} VA
                    </TableCell>
                    <TableCell className="text-right text-xs text-emerald-700 font-bold">
                      125% Continuous Factor
                    </TableCell>
                    <TableCell className="text-right font-mono text-emerald-900 text-xs font-bold">
                      {result.breakdown.evChargerDemandVa.toLocaleString()} VA
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                  <TableCell>
                    TOTAL CALCULATED SERVICE DEMAND LOAD
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {(
                      result.breakdown.grossGeneralLoadVa +
                      Math.max(result.breakdown.airConditioningVa, result.breakdown.heatingVa) +
                      result.breakdown.evChargerConnectedVa
                    ).toLocaleString()}{" "}
                    VA
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-600">
                    Total Demand Applied
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-900 text-sm font-black">
                    {result.totalCalculatedDemandVa.toLocaleString()} VA ({result.calculatedServiceAmps}A)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Safety & Design Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-950 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Electrical Engineering Disclaimer:</strong> This calculator provides planning load estimates based on the NEC Article 220.82 Optional Method for single-family residential dwellings. It does not replace a stamped permit plan, utility company transformer service evaluation, or on-site load calculation by a licensed electrical contractor. Always consult your local Authority Having Jurisdiction (AHJ).
            </div>
          </div>

          {/* Step-by-Step Mathematical Methodology */}
          {result.steps.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Calculation Methodology &amp; Mathematical Steps
              </h3>
              <div className="space-y-2">
                {result.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="text-xs font-mono bg-slate-100 p-3 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <div className="text-slate-700">
                      <span className="text-amber-700 font-bold mr-2">{idx + 1}.</span>
                      <span className="font-sans font-semibold text-slate-900">{step.label}:</span>{" "}
                      <span>{step.values}</span>
                    </div>
                    <div className="text-amber-800 font-bold sm:text-right">
                      = {step.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
