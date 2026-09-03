"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  ClimateZone,
  DuctworkLocation,
  HvacLoadInput,
  HvacLoadResult,
  InsulationGrade,
  SunExposure,
} from "@/types/hvac";
import {
  CLIMATE_ZONES_REGISTRY,
  INSULATION_REGISTRY,
} from "@/data/references/hvac-types";
import { calculateHvacLoadProject } from "@/lib/calculations/hvac";
import { HvacDiagram } from "./hvac-diagram";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { PrintButton, JobsitePrintHeader } from "@/components/ui/print-view";
import {
  trackCalculatorStarted,
  trackResultGenerated,
  trackCopyResult,
} from "@/lib/analytics/events";
import {
  RotateCcw,
  Copy,
  Check,
  Wind,
  Snowflake,
  Flame,
  Sliders,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PRESETS = [
  {
    label: "Room / Master Suite (400 sq ft)",
    area: 400,
    ceiling: 9,
    zone: "zone_4" as ClimateZone,
    insulation: "average" as InsulationGrade,
    sun: "moderate" as SunExposure,
    occupants: 2,
    kitchen: false,
  },
  {
    label: "3-Bed Suburban Home (1,800 sq ft)",
    area: 1800,
    ceiling: 8,
    zone: "zone_4" as ClimateZone,
    insulation: "average" as InsulationGrade,
    sun: "moderate" as SunExposure,
    occupants: 4,
    kitchen: true,
  },
  {
    label: "Finished Basement (800 sq ft)",
    area: 800,
    ceiling: 8,
    zone: "zone_5" as ClimateZone,
    insulation: "good" as InsulationGrade,
    sun: "low" as SunExposure,
    occupants: 2,
    kitchen: false,
  },
  {
    label: "High-Efficiency Home (2,400 sq ft)",
    area: 2400,
    ceiling: 9,
    zone: "zone_5" as ClimateZone,
    insulation: "good" as InsulationGrade,
    sun: "moderate" as SunExposure,
    occupants: 4,
    kitchen: true,
  },
];

export function HvacCalculatorForm() {
  const [floorAreaSqFt, setFloorAreaSqFt] = useState<number>(1800);
  const [ceilingHeightFt, setCeilingHeightFt] = useState<number>(8);
  const [climateZone, setClimateZone] = useState<ClimateZone>("zone_4");
  const [insulationGrade, setInsulationGrade] = useState<InsulationGrade>("average");
  const [sunExposure, setSunExposure] = useState<SunExposure>("moderate");
  const [occupantCount, setOccupantCount] = useState<number>(4);
  const [hasKitchen, setHasKitchen] = useState<boolean>(true);
  const [ductLocation, setDuctLocation] = useState<DuctworkLocation>("conditioned_space");

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("hvac-btu-calculator", "hvac");
  }, []);

  const calculationResult: {
    result?: HvacLoadResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: HvacLoadInput = {
        floorAreaSqFt,
        ceilingHeightFt,
        climateZone,
        insulationGrade,
        sunExposure,
        occupantsCount: occupantCount,
        includeKitchen: hasKitchen,
        ductworkLocation: ductLocation,
      };
      const res = calculateHvacLoadProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    floorAreaSqFt,
    ceilingHeightFt,
    climateZone,
    insulationGrade,
    sunExposure,
    occupantCount,
    hasKitchen,
    ductLocation,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("hvac-btu-calculator", "hvac", {
        primaryUnit: "btu",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    try { localStorage.removeItem("saved_hvac_config"); } catch {}
    setFloorAreaSqFt(1800);
    setCeilingHeightFt(8);
    setClimateZone("zone_4");
    setInsulationGrade("average");
    setSunExposure("moderate");
    setOccupantCount(4);
    setHasKitchen(true);
    setDuctLocation("conditioned_space");
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const r = calculationResult.result;
    const airflowCfm = Math.round(r.recommendedCoolingTons * 400);

    const summaryLines = [
      "HVAC HEATING & COOLING LOAD ESTIMATE TAKEOFF",
      "============================================",
      `Estimated Total Cooling Load: ${r.coolingLoadBtuHr.toLocaleString()} BTU/h (${r.recommendedCoolingTons} Tons AC)`,
      `Estimated Heating Load: ${r.heatingLoadBtuHr.toLocaleString()} BTU/h`,
      `Recommended Supply Airflow: ${airflowCfm} CFM`,
      `Conditioned Space: ${floorAreaSqFt} sq ft (${ceilingHeightFt}' ceiling)`,
      `Climate Zone: ${r.climateZoneInfo.name} (${r.climateZoneInfo.exampleCities})`,
      `Insulation Level: ${insulationGrade.toUpperCase()} | Sun Exposure: ${sunExposure.toUpperCase()}`,
      "",
      "LOAD BREAKDOWN:",
      ` • Envelope Cooling: ${r.breakdown.envelopeCoolingBtu.toLocaleString()} BTU/h`,
      ` • Solar Window Gain: ${r.breakdown.windowSolarCoolingBtu.toLocaleString()} BTU/h`,
      ` • Occupants & Internal: ${r.breakdown.occupantSensibleBtu.toLocaleString()} BTU/h`,
      ` • Duct Heat Gain/Loss: ${r.breakdown.ductLossCoolingBtu.toLocaleString()} BTU/h`,
      "",
      "Reference: Simplified ACCA Manual J Design Principles",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("hvac-btu-calculator", "hvac", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_hvac_config", JSON.stringify({ floorAreaSqFt, ceilingHeightFt, climateZone, insulationGrade }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Ignore
    }
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="HVAC Load & Equipment Sizing Worksheet"
        category="HVAC & Airflow"
      />

      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check all HVAC load parameters.
        </Alert>
      )}

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Building Envelope Thermal CAD Blueprint (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <HvacDiagram result={result} />
          )}
        </div>

        {/* RIGHT PANE: Variable Hub & Sizing Dock (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Space & Climate Input Dock */}
          <div className="glass-dock rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Space &amp; Thermal Inputs
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setFloorAreaSqFt(p.area);
                      setCeilingHeightFt(p.ceiling);
                      setClimateZone(p.zone);
                      setInsulationGrade(p.insulation);
                      setSunExposure(p.sun);
                      setOccupantCount(p.occupants);
                      setHasKitchen(p.kitchen);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <FormField id="floor-area" label="Conditioned Area (sq ft)" required className="space-y-1">
                <Input
                  id="floor-area"
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={floorAreaSqFt}
                  onChange={(e) => setFloorAreaSqFt(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <FormField id="ceiling-ht" label="Ceiling Height (ft)" required className="space-y-1">
                <Input
                  id="ceiling-ht"
                  type="number"
                  min="6"
                  max="24"
                  step="1"
                  value={ceilingHeightFt}
                  onChange={(e) => setCeilingHeightFt(parseFloat(e.target.value) || 8)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <div className="col-span-2">
                <label htmlFor="climate-zone" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Climate Zone:
                </label>
                <select
                  id="climate-zone"
                  value={climateZone}
                  onChange={(e) => setClimateZone(e.target.value as ClimateZone)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  {Object.values(CLIMATE_ZONES_REGISTRY).map((z) => (
                    <option key={z.zone} value={z.zone}>
                      {z.name} &bull; {z.exampleCities} (Summer {z.summerOutdoorDesignTempF}°F)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="insulation-select" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Insulation Grade:
                </label>
                <select
                  id="insulation-select"
                  value={insulationGrade}
                  onChange={(e) => setInsulationGrade(e.target.value as InsulationGrade)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  {Object.values(INSULATION_REGISTRY).map((ins) => (
                    <option key={ins.grade} value={ins.grade}>
                      {ins.name} (R-{ins.wallRValue} Walls)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sun-select" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Sun Exposure:
                </label>
                <select
                  id="sun-select"
                  value={sunExposure}
                  onChange={(e) => setSunExposure(e.target.value as SunExposure)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value="low">Heavily Shaded (Low Solar)</option>
                  <option value="moderate">Average Sunlight (Moderate)</option>
                  <option value="high">Full Sun / Unshaded (High Solar)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Ductwork & Internal Gains */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Ductwork Location, Occupants &amp; Windows</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-3 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="duct-loc" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Ductwork Location:
                    </label>
                    <select
                      id="duct-loc"
                      value={ductLocation}
                      onChange={(e) => setDuctLocation(e.target.value as DuctworkLocation)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value="conditioned_space">Inside Conditioned Space (+0%)</option>
                      <option value="unconditioned_attic">Unconditioned Attic (+12%)</option>
                      <option value="crawlspace">Crawlspace (+8%)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="occupants" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Occupant Count:
                    </label>
                    <input
                      id="occupants"
                      type="number"
                      min="1"
                      max="30"
                      value={occupantCount}
                      onChange={(e) => setOccupantCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-mono">
                    <input
                      type="checkbox"
                      checked={hasKitchen}
                      onChange={(e) => setHasKitchen(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                    />
                    <span>Include Kitchen Appliance Heat Gain (+1,200 BTU/h)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 3. Decision & Equipment Sizing HUD */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    HVAC Equipment Sizing Readout
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Preliminary Estimate
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                    Recommended AC Capacity
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.recommendedCoolingTons}
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      Tons AC
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Estimated Cooling Load: {result.coolingLoadBtuHr.toLocaleString()} BTU/h &bull; Supply Airflow: {Math.round(result.recommendedCoolingTons * 400)} CFM
                  </span>
                </div>

                {/* Sizing Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Thermal Load Telemetry
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Snowflake className="h-3.5 w-3.5 text-cyan-400" />
                      Cooling Requirement:
                    </span>
                    <span className="font-bold text-cyan-300">{result.coolingLoadBtuHr.toLocaleString()} BTU/h</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-rose-400" />
                      Heating Requirement:
                    </span>
                    <span className="font-bold text-rose-300">{result.heatingLoadBtuHr.toLocaleString()} BTU/h</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Recommended Airflow:</span>
                    <span className="font-bold text-white">{Math.round(result.recommendedCoolingTons * 400)} CFM</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-1 no-print">
                  <button
                    type="button"
                    onClick={copySummaryToClipboard}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveConfiguration}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                  >
                    {saved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5 text-amber-400" />}
                    <span>{saved ? "Saved on this device" : "Save on This Device"}</span>
                  </button>

                  <PrintButton
                    toolSlug="btu-calculator"
                    category="hvac"
                    label="Print Worksheet"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
