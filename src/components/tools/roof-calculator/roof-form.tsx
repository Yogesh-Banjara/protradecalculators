"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  RafterNominalDepth,
  RoofCalculatorInput,
  RoofCalculatorResult,
} from "@/types/roof";
import {
  STANDARD_PITCHES,
} from "@/data/materials/roofing-types";
import { calculateRoofProject } from "@/lib/calculations/roof";
import { RoofDiagram } from "./roof-diagram";
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
  AlertTriangle,
  Compass,
  Sliders,
  ChevronDown,
  ChevronUp,
  Save,
  ArrowRight,
  Info,
} from "lucide-react";

const WASTE_PRESETS = [
  { label: "0% (Net)", value: 0 },
  { label: "5% (Clean Gable)", value: 5 },
  { label: "10% (Standard)", value: 10 },
  { label: "15% (Hips & Valleys)", value: 15 },
];

export function RoofCalculatorForm() {
  const [activeTab, setActiveTab] = useState<"calculate" | "diagrams" | "reference" | "guide">("calculate");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");

  const [buildingWidthFt, setBuildingWidthFt] = useState<number>(24);
  const [buildingLengthFt, setBuildingLengthFt] = useState<number>(36);
  const [pitchIn12, setPitchIn12] = useState<number>(6);
  const [eaveOverhangInches, setEaveOverhangInches] = useState<number>(12);
  const [gableOverhangInches, setGableOverhangInches] = useState<number>(12);
  const [ridgeBoardThicknessInches, setRidgeBoardThicknessInches] = useState<number>(1.5);
  const [rafterDepthNominal, setRafterDepthNominal] = useState<RafterNominalDepth>("2x6");
  const [seatCutBearingInches, setSeatCutBearingInches] = useState<number>(3.5);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [isCustomWaste, setIsCustomWaste] = useState<boolean>(false);
  const [customWasteInput, setCustomWasteInput] = useState<string>("10");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("roof-pitch-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: RoofCalculatorResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: RoofCalculatorInput = {
        buildingLengthFt,
        buildingWidthFt,
        pitchIn12,
        eaveOverhangInches,
        gableOverhangInches,
        ridgeBoardThicknessInches,
        rafterDepthNominal,
        seatCutBearingInches,
        wastePercent,
      };
      const res = calculateRoofProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    buildingLengthFt,
    buildingWidthFt,
    pitchIn12,
    eaveOverhangInches,
    gableOverhangInches,
    ridgeBoardThicknessInches,
    rafterDepthNominal,
    seatCutBearingInches,
    wastePercent,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("roof-pitch-calculator", "construction", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "feet-inches",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    try { localStorage.removeItem("saved_roof_config"); } catch {}
    setBuildingWidthFt(24);
    setBuildingLengthFt(36);
    setPitchIn12(6);
    setEaveOverhangInches(12);
    setGableOverhangInches(12);
    setRidgeBoardThicknessInches(1.5);
    setRafterDepthNominal("2x6");
    setSeatCutBearingInches(3.5);
    setWastePercent(10);
    setIsCustomWaste(false);
    setCustomWasteInput("10");
  };

  const handleWastePresetChange = (preset: number) => {
    setIsCustomWaste(false);
    setWastePercent(preset);
  };

  const handleCustomWasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomWasteInput(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setWastePercent(num);
    }
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const r = calculationResult.result;
    const summary = [
      `=== PROTRADE ROOF PITCH & RAFTER TAKEOFF ===`,
      `Pitch: ${r.geometry.pitchIn12}:12 (${r.geometry.pitchAngleDegrees}°)`,
      `Building Span: ${buildingWidthFt} ft | Horizontal Run: ${r.geometry.runFt} ft (${r.geometry.runInches} in)`,
      `Building Length: ${buildingLengthFt} ft (Ridge Length: ${r.materials.ridgeLengthFt} ft)`,
      `Common Rafter Line Length: ${r.geometry.rafterLineLengthFormatted} (${r.geometry.rafterLineLengthFt} ft)`,
      `Total Cut Rafter Length: ${r.geometry.totalCutRafterLengthFormatted} (${r.geometry.totalCutRafterLengthFt} ft)`,
      `Plumb Cut: ${r.geometry.cutAngles.plumbCutAngleDegrees}° | Level/Seat Cut: ${r.geometry.cutAngles.seatCutAngleDegrees}°`,
      `Seat Cut Bearing: ${r.geometry.birdsmouth.seatCutLengthInches} in | HAP Stand: ${r.geometry.birdsmouth.heightAbovePlateInches} in`,
      `Roof Surface Area: ${r.materials.adjustedAreaSqFt} sq ft (${r.materials.adjustedSquares} SQ including ${r.materials.wastePercent}% waste)`,
      `Shingle Bundles (3/sq): ${r.materials.shingleBundlesCount} bundles`,
      `Underlayment: ${r.materials.underlaymentRollsSynthetic} rolls (4-sq rolls)`,
      `Drip Edge: ${r.materials.dripEdgePieces10Ft} pcs (10 ft lengths)`,
      `Calculated with ProTrade Calculators: https://protradecalculators.com`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
    setCopied(true);
    trackCopyResult("roof-pitch-calculator", "construction", "takeoff_summary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      const config = {
        buildingWidthFt,
        buildingLengthFt,
        pitchIn12,
        eaveOverhangInches,
        gableOverhangInches,
        ridgeBoardThicknessInches,
        rafterDepthNominal,
        seatCutBearingInches,
        wastePercent,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("saved_roof_config", JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // Local storage unavailable
    }
  };

  const { result, error } = calculationResult;

  // Run in inches for showcase alignment
  const horizontalRunInches = Math.round((buildingWidthFt / 2) * 12);
  const verticalRiseInches = result ? Math.round(result.geometry.riseInches) : Math.round(horizontalRunInches * (pitchIn12 / 12));

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="Roof Pitch & Rafter Takeoff Worksheet"
        category="Construction & Framing"
      />

      {/* Tabs & Unit Switcher Header matching Showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("calculate")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "calculate"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("diagrams")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "diagrams"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Diagrams
          </button>
          <a
            href="#reference-table"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Reference Table
          </a>
          <a
            href="#framing-guide"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Guide
          </a>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUnitSystem("imperial")}
            className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
              unitSystem === "imperial"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Imperial
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem("metric")}
            className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
              unitSystem === "metric"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Metric
          </button>
        </div>
      </div>

      {/* 2-COLUMN WORKBENCH: Left = Inputs, Right = Live Diagram & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Inputs & Controls (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Roof Inputs
              </h2>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Pitch Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 block">
                Standard Pitch Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STANDARD_PITCHES.slice(1, 6).map((p) => (
                  <button
                    key={p.pitchIn12}
                    type="button"
                    onClick={() => setPitchIn12(p.pitchIn12)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      pitchIn12 === p.pitchIn12
                        ? "bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-2xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    {p.pitchIn12}:12 ({p.angleDegrees}°)
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4 text-xs">
              {/* Horizontal Run */}
              <div>
                <label htmlFor="roof-run" className="text-xs font-semibold text-slate-700 block mb-1">
                  Horizontal Run (Half Span):
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 h-11 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <input
                    id="roof-run"
                    type="number"
                    min="12"
                    step="1"
                    value={horizontalRunInches}
                    onChange={(e) => {
                      const inches = parseFloat(e.target.value) || 0;
                      setBuildingWidthFt((inches * 2) / 12);
                    }}
                    aria-label="Horizontal Run in inches"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                    placeholder="144"
                  />
                  <span className="text-xs font-bold text-slate-500 ml-1">in</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Building Span: {buildingWidthFt} ft ({(buildingWidthFt / 2).toFixed(1)} ft run)
                </span>
              </div>

              {/* Vertical Rise */}
              <div>
                <label htmlFor="roof-rise" className="text-xs font-semibold text-slate-700 block mb-1">
                  Vertical Rise:
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 h-11 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <input
                    id="roof-rise"
                    type="number"
                    min="1"
                    step="1"
                    value={verticalRiseInches}
                    onChange={(e) => {
                      const riseIn = parseFloat(e.target.value) || 0;
                      if (horizontalRunInches > 0) {
                        const calculatedPitch = (riseIn / horizontalRunInches) * 12;
                        setPitchIn12(Math.round(calculatedPitch * 10) / 10);
                      }
                    }}
                    aria-label="Vertical Rise in inches"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                    placeholder="72"
                  />
                  <span className="text-xs font-bold text-slate-500 ml-1">in</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Pitch Ratio: {pitchIn12}:12 ({result?.geometry.pitchAngleDegrees ?? 26.6}°)
                </span>
              </div>

              {/* Rafter Overhang */}
              <div>
                <label htmlFor="roof-overhang" className="text-xs font-semibold text-slate-700 block mb-1">
                  Rafter Overhang (Eave):
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 h-11 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <input
                    id="roof-overhang"
                    type="number"
                    min="0"
                    step="1"
                    value={eaveOverhangInches}
                    onChange={(e) => setEaveOverhangInches(parseFloat(e.target.value) || 0)}
                    aria-label="Rafter Overhang in inches"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                    placeholder="12"
                  />
                  <span className="text-xs font-bold text-slate-500 ml-1">in</span>
                </div>
              </div>

              {/* Calculate For Dropdown */}
              <div>
                <label htmlFor="calculate-for" className="text-xs font-semibold text-slate-700 block mb-1">
                  Calculate For:
                </label>
                <select
                  id="calculate-for"
                  value={rafterDepthNominal}
                  onChange={(e) => setRafterDepthNominal(e.target.value as RafterNominalDepth)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="2x4">Common Rafter Length (2x4 Lumber)</option>
                  <option value="2x6">Common Rafter Length (2x6 Lumber)</option>
                  <option value="2x8">Common Rafter Length (2x8 Lumber)</option>
                  <option value="2x10">Common Rafter Length (2x10 Lumber)</option>
                  <option value="2x12">Common Rafter Length (2x12 Lumber)</option>
                </select>
              </div>

              {/* Action Buttons: Reset + Solid Amber Calculate Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Trigger calculate action / scroll to results if on mobile
                    const el = document.getElementById("diagram-results-dock");
                    if (el && window.innerWidth < 1024) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Calculate</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Progressive Disclosure: Advanced Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-600" />
                <span>Advanced Overhangs, Bearing &amp; Waste ({wastePercent}%)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-4 border-t border-slate-100 text-xs bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gable-overhang" className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Gable Rake Overhang:
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 px-2.5 h-9">
                      <input
                        id="gable-overhang"
                        type="number"
                        min="0"
                        step="1"
                        value={gableOverhangInches}
                        onChange={(e) => setGableOverhangInches(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-slate-900 outline-none"
                      />
                      <span className="text-[11px] font-bold text-slate-400">in</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ridge-thick" className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Ridge Board Thickness:
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 px-2.5 h-9">
                      <input
                        id="ridge-thick"
                        type="number"
                        min="0"
                        step="0.25"
                        value={ridgeBoardThicknessInches}
                        onChange={(e) => setRidgeBoardThicknessInches(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-slate-900 outline-none"
                      />
                      <span className="text-[11px] font-bold text-slate-400">in</span>
                    </div>
                  </div>
                </div>

                {/* Waste Factor Presets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Roofing Waste Allowance:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {WASTE_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleWastePresetChange(preset.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          !isCustomWaste && wastePercent === preset.value
                            ? "bg-amber-400 text-slate-950 border-amber-400 font-bold"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={customWasteInput}
                      onChange={(e) => {
                        setIsCustomWaste(true);
                        handleCustomWasteChange(e);
                      }}
                      aria-label="Custom waste percentage"
                      className="w-16 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="10"
                    />
                    <span className="text-xs text-slate-500">% custom waste</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Diagram & Results (7 Cols on Desktop) */}
        <div id="diagram-results-dock" className="lg:col-span-7 space-y-6">
          {/* 1. Live 2D CAD Diagram */}
          {result && <RoofDiagram geometry={result.geometry} />}

          {/* 2. Key 3 Metrics Cards in a Row */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Metric 1: Roof Pitch */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  Roof Pitch
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {result.geometry.pitchIn12} / 12
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ({result.geometry.pitchAngleDegrees}°)
                </div>
              </div>

              {/* Metric 2: Rafter Length */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  Rafter Length
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {result.geometry.rafterLineLengthFormatted}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ({result.geometry.rafterLineLengthFt} ft)
                </div>
              </div>

              {/* Metric 3: Total Run */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center shadow-xs">
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  Total Run
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {Math.floor((horizontalRunInches + eaveOverhangInches) / 12)}′ {(horizontalRunInches + eaveOverhangInches) % 12}″
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ({horizontalRunInches + eaveOverhangInches} in)
                </div>
              </div>
            </div>
          )}

          {/* 3. Blue/Slate Formula Callout Banner */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-3 text-xs sm:text-sm text-slate-800">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-blue-950 block">
                Formula: Rafter Length = √(Run² + Rise²)
              </span>
              <p className="text-slate-600 text-xs">
                Example: √({horizontalRunInches}² + {verticalRiseInches}²) = {result ? Math.round(result.geometry.rafterLineLengthInches) : 161} in = {result ? result.geometry.rafterLineLengthFormatted : '13\' 5"'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FULL BILL OF MATERIALS & TAKEOFF SCHEDULE (Clean White Surface) */}
      {result && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Comprehensive Takeoff Schedule &amp; Materials
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copySummaryToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Takeoff"}</span>
              </button>

              <button
                type="button"
                onClick={saveConfiguration}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                {saved ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Save className="h-3.5 w-3.5" />}
                <span>{saved ? "Saved ✓" : "Save"}</span>
              </button>

              <PrintButton
                toolSlug="roof-pitch-calculator"
                category="construction"
                label="Print Worksheet"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Column 1: Material Quantities */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Roofing Squares &amp; Coverings
              </h4>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Total Sloped Area:</span>
                <span className="font-bold text-slate-900">{result.materials.adjustedAreaSqFt} sq ft</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Roofing Squares (+{result.materials.wastePercent}% waste):</span>
                <span className="font-bold text-amber-600">{result.materials.adjustedSquares} SQ</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Shingle Bundles (3 per SQ):</span>
                <span className="font-bold text-slate-900">{result.materials.shingleBundlesCount} bundles</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Synthetic Underlayment (4 SQ rolls):</span>
                <span className="font-bold text-slate-900">{result.materials.underlaymentRollsSynthetic} rolls</span>
              </div>
            </div>

            {/* Column 2: Framing & Perimeter */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Framing &amp; Perimeter Trim
              </h4>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Total Cut Rafter Length:</span>
                <span className="font-bold text-slate-900">{result.geometry.totalCutRafterLengthFormatted}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Plumb Cut / Seat Cut:</span>
                <span className="font-bold text-slate-900">{result.geometry.cutAngles.plumbCutAngleDegrees}° / {result.geometry.cutAngles.seatCutAngleDegrees}°</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Ridge Board Length:</span>
                <span className="font-bold text-slate-900">{result.materials.ridgeLengthFt} ft</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 font-mono">
                <span className="text-slate-600">Drip Edge Perimeter (10 ft pcs):</span>
                <span className="font-bold text-slate-900">{result.materials.dripEdgePieces10Ft} pcs ({result.materials.dripEdgeLinearFt} ft)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
