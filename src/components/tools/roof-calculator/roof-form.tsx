"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  RafterNominalDepth,
  RoofCalculatorInput,
  RoofCalculatorResult,
} from "@/types/roof";
import {
  STANDARD_PITCHES,
  RAFTER_LUMBER_SIZES,
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
} from "lucide-react";

const WASTE_PRESETS = [
  { label: "0% (Net)", value: 0 },
  { label: "5% (Clean Gable)", value: 5 },
  { label: "10% (Standard)", value: 10 },
  { label: "15% (Hips & Valleys)", value: 15 },
];

export function RoofCalculatorForm() {
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
    const val = e.target.value;
    setCustomWasteInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setWastePercent(num);
    }
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const { geometry, materials, costEstimate } = calculationResult.result;

    const summaryLines = [
      "ROOF PITCH & RAFTER GEOMETRY TAKEOFF",
      "====================================",
      `Building Dimensions: ${geometry.buildingSpanFt}' Span (${geometry.runFt}' Run) x ${materials.ridgeLengthFt}' Length`,
      `Roof Pitch: ${geometry.pitchIn12}:12 (${geometry.pitchAngleDegrees}° angle, ${geometry.slopeFactor}x slope multiplier)`,
      `Rise & Run: ${geometry.riseFt}' Rise (${geometry.riseInches}") / ${geometry.runFt}' Run (${geometry.runInches}")`,
      `Common Rafter Line Length: ${geometry.rafterLineLengthFormatted} (${geometry.rafterLineLengthFt} ft)`,
      `Total Practical Cut Length: ${geometry.totalCutRafterLengthFormatted} (${geometry.totalCutRafterLengthFt} ft)`,
      `Rafter Cut Angles: Plumb Cut ${geometry.cutAngles.plumbCutAngleDegrees}° / Seat Cut ${geometry.cutAngles.seatCutAngleDegrees}°`,
      `Birdsmouth Geometry: ${geometry.birdsmouth.seatCutLengthInches}" Seat Bearing, ${geometry.birdsmouth.plumbCutDepthInches}" Plumb Depth, ${geometry.birdsmouth.heightAbovePlateInches}" HAP Stand`,
      "",
      "ROOFING SURFACE & MATERIALS:",
      `Sloped Roof Surface Area: ${materials.roofSurfaceAreaSqFt} sq ft (${materials.roofingSquares} squares)`,
      `Adjusted Squares (+${materials.wastePercent}% waste): ${materials.adjustedSquares} SQ (${materials.adjustedAreaSqFt} sq ft)`,
      `Shingle Bundles (3/sq): ${materials.shingleBundlesCount} bundles`,
      `Synthetic Underlayment: ${materials.underlaymentRollsSynthetic} rolls (4-sq rolls)`,
      `Drip Edge Flashing: ${materials.dripEdgePieces10Ft} pieces (10' lengths / ${materials.dripEdgeLinearFt} linear ft)`,
      `Ridge Cap Shingles: ${materials.ridgeCapBundlesCount} bundles (${materials.ridgeLengthFt} linear ft)`,
      ...(costEstimate
        ? [`Estimated Material Cost: $${costEstimate.totalEstimatedCost.toFixed(2)}`]
        : []),
      "",
      "Reference: International Residential Code (IRC R802 / R905 Prescriptive Geometry)",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("roof-pitch-calculator", "construction", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem(
        "saved_roof_config",
        JSON.stringify({
          buildingWidthFt,
          buildingLengthFt,
          pitchIn12,
          eaveOverhangInches,
          gableOverhangInches,
          ridgeBoardThicknessInches,
          rafterDepthNominal,
          seatCutBearingInches,
          wastePercent,
        })
      );
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
        title="Roof Pitch & Rafter Geometry Worksheet"
        category="Construction & Framing"
      />

      {/* 2-PANE SPLIT VISUAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Dynamic Roof Layout Visualizer (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && <RoofDiagram geometry={result.geometry} />}
        </div>

        {/* RIGHT PANE: Variable Controls & Primary Results (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Essential Geometry Inputs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Roof Dimensions &amp; Pitch
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

            {/* Quick Pitch Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Standard Pitch Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                {STANDARD_PITCHES.slice(1, 6).map((p) => (
                  <button
                    key={p.pitchIn12}
                    type="button"
                    onClick={() => setPitchIn12(p.pitchIn12)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                      pitchIn12 === p.pitchIn12
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-500"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                    }`}
                  >
                    {p.pitchIn12}:12 ({p.angleDegrees}°)
                  </button>
                ))}
              </div>
            </div>

            {/* Core Dimension Inputs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Building Span */}
              <div>
                <label htmlFor="roof-span" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Building Span / Width:
                </label>
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 h-10 focus-within:border-amber-500">
                  <input
                    id="roof-span"
                    type="number"
                    min="2"
                    step="0.5"
                    value={buildingWidthFt || ""}
                    onChange={(e) => setBuildingWidthFt(parseFloat(e.target.value) || 0)}
                    aria-label="Building Span Width in Feet"
                    className="w-full bg-transparent text-sm font-mono font-bold text-white outline-none"
                    placeholder="24"
                  />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1">ft</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  Run: {(buildingWidthFt / 2).toFixed(1)} ft
                </span>
              </div>

              {/* Building Length */}
              <div>
                <label htmlFor="roof-length" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Building Length:
                </label>
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 h-10 focus-within:border-amber-500">
                  <input
                    id="roof-length"
                    type="number"
                    min="2"
                    step="0.5"
                    value={buildingLengthFt || ""}
                    onChange={(e) => setBuildingLengthFt(parseFloat(e.target.value) || 0)}
                    aria-label="Building Length in Feet"
                    className="w-full bg-transparent text-sm font-mono font-bold text-white outline-none"
                    placeholder="36"
                  />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1">ft</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  Ridge: {buildingLengthFt} ft
                </span>
              </div>

              {/* Roof Pitch Rise */}
              <div>
                <label htmlFor="roof-pitch" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Roof Pitch (Rise / 12″):
                </label>
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 h-10 focus-within:border-amber-500">
                  <input
                    id="roof-pitch"
                    type="number"
                    min="0.5"
                    max="36"
                    step="0.5"
                    value={pitchIn12 || ""}
                    onChange={(e) => setPitchIn12(parseFloat(e.target.value) || 6)}
                    aria-label="Roof Pitch Rise in 12 inches"
                    className="w-full bg-transparent text-sm font-mono font-bold text-amber-400 outline-none"
                    placeholder="6"
                  />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1">: 12</span>
                </div>
              </div>

              {/* Rafter Stock Lumber */}
              <div>
                <label htmlFor="rafter-lumber" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rafter Lumber Stock:
                </label>
                <select
                  id="rafter-lumber"
                  value={rafterDepthNominal}
                  onChange={(e) => setRafterDepthNominal(e.target.value as RafterNominalDepth)}
                  aria-label="Rafter Lumber Stock Size"
                  className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  {RAFTER_LUMBER_SIZES.map((r) => (
                    <option key={r.nominal} value={r.nominal}>
                      {r.nominal} ({r.actualDepthInches}″ depth)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Overhangs, Birdsmouth & Waste */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm text-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Overhangs, Seat Cut Bearing &amp; Waste Factor ({wastePercent}%)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-4 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="eave-overhang" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Eave Overhang:
                    </label>
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-2.5 h-9">
                      <input
                        id="eave-overhang"
                        type="number"
                        min="0"
                        step="1"
                        value={eaveOverhangInches}
                        onChange={(e) => setEaveOverhangInches(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-mono text-white outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">in</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gable-overhang" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Gable Rake Overhang:
                    </label>
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-2.5 h-9">
                      <input
                        id="gable-overhang"
                        type="number"
                        min="0"
                        step="1"
                        value={gableOverhangInches}
                        onChange={(e) => setGableOverhangInches(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-mono text-white outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">in</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ridge-thick" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Ridge Board Thickness:
                    </label>
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-2.5 h-9">
                      <input
                        id="ridge-thick"
                        type="number"
                        min="0"
                        step="0.25"
                        value={ridgeBoardThicknessInches}
                        onChange={(e) => setRidgeBoardThicknessInches(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-mono text-white outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">in</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="seat-bearing" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Seat Cut Bearing:
                    </label>
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-2.5 h-9">
                      <input
                        id="seat-bearing"
                        type="number"
                        min="1"
                        step="0.5"
                        value={seatCutBearingInches}
                        onChange={(e) => setSeatCutBearingInches(parseFloat(e.target.value) || 3.5)}
                        className="w-full bg-transparent font-mono text-white outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">in</span>
                    </div>
                  </div>
                </div>

                {/* Waste Presets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Roofing Waste Allowance:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {WASTE_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleWastePresetChange(preset.value)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          !isCustomWaste && wastePercent === preset.value
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCustomWaste(true)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                        isCustomWaste
                          ? "bg-amber-500 text-slate-950 border-amber-500"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-700"
                      }`}
                    >
                      Custom %
                    </button>
                    {isCustomWaste && (
                      <div className="flex items-center gap-1 w-20">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={customWasteInput}
                          onChange={handleCustomWasteChange}
                          aria-label="Custom Waste Percent"
                          className="h-7 w-full rounded border border-slate-700 bg-slate-900 px-1 text-xs text-center font-mono font-bold text-white outline-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              <span className="font-bold block">Input Invalid:</span>
              {error}
            </div>
          )}

          {/* 3. Primary Calculated Results & Takeoff Schedule */}
          {result && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Rafter Geometry &amp; Layout Schedule
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  {result.geometry.pitchIn12}:12 Pitch ({result.geometry.pitchAngleDegrees}°)
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
                    Common Rafter Line Length (Theoretical Ridge Center to Wall Line)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight tabular-nums">
                      {result.geometry.rafterLineLengthFormatted}
                    </span>
                    <span className="text-sm font-mono text-slate-300">
                      ({result.geometry.rafterLineLengthFt} ft)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Estimated Rafter Cut Length (under stated ridge &amp; overhang assumptions):{" "}
                    <strong className="text-white">{result.geometry.totalCutRafterLengthFormatted}</strong> ({result.geometry.totalCutRafterLengthFt} ft)
                  </span>
                </div>

                {/* Cut Geometry Schedule */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Rafter Cutting Angles &amp; Birdsmouth
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Plumb Cut (Top Ridge):</span>
                    <span className="font-bold text-cyan-400">{result.geometry.cutAngles.plumbCutAngleDegrees}° ({result.geometry.cutAngles.plumbCutPitchString})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Seat Cut (Birdsmouth):</span>
                    <span className="font-bold text-emerald-400">{result.geometry.cutAngles.seatCutAngleDegrees}° ({result.geometry.cutAngles.seatCutPitchString})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Seat Bearing &bull; HAP Stand:</span>
                    <span className="font-bold text-white">{result.geometry.birdsmouth.seatCutLengthInches}″ bearing &bull; {result.geometry.birdsmouth.heightAbovePlateInches}″ HAP</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Total Vertical Rise:</span>
                    <span className="font-bold text-white">{result.geometry.riseFt} ft ({result.geometry.riseInches}″)</span>
                  </div>
                </div>

                {/* Roofing Material Takeoff Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Roofing Squares &amp; Materials
                    </span>
                    <span className="text-[10px] font-bold text-amber-400">
                      +{result.materials.wastePercent}% Waste
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Roofing Squares:</span>
                    <span className="font-bold text-amber-400">{result.materials.adjustedSquares} SQ ({result.materials.adjustedAreaSqFt} sq ft)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Shingle Bundles (3/sq):</span>
                    <span className="font-bold text-white">{result.materials.shingleBundlesCount} bundles</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Synthetic Underlayment:</span>
                    <span className="font-bold text-white">{result.materials.underlaymentRollsSynthetic} rolls (4-sq rolls)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Drip Edge Perimeter:</span>
                    <span className="font-bold text-white">{result.materials.dripEdgePieces10Ft} pcs ({result.materials.dripEdgeLinearFt} ft)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Ridge Cap Shingles:</span>
                    <span className="font-bold text-white">{result.materials.ridgeCapBundlesCount} bundles ({result.materials.ridgeLengthFt} ft)</span>
                  </div>
                </div>

                {/* Warnings / IRC Notes */}
                {result.warnings.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {result.warnings.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-lg text-[11px] text-amber-200 leading-snug"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{w.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 no-print">
                  <button
                    type="button"
                    onClick={copySummaryToClipboard}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-slate-900" />}
                    <span>{copied ? "Copied Takeoff!" : "Copy Takeoff"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveConfiguration}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer active:scale-[0.98] border ${
                      saved
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-semibold"
                        : "bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700/80"
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Saved ✓</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 text-slate-400" />
                        <span>Save Config</span>
                      </>
                    )}
                  </button>

                  <PrintButton
                    toolSlug="roof-pitch-calculator"
                    category="construction"
                    label="Print Worksheet"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 cursor-pointer active:scale-[0.98]"
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
