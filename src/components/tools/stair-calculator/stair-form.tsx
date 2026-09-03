"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  StairCalculatorInput,
  StairCalculatorResult,
  StairCodeStandard,
  StairCostRates,
  StairStringerLumber,
} from "@/types/stairs";
import {
  STRINGER_LUMBER_OPTIONS,
} from "@/data/materials/stair-types";
import { calculateStairProject } from "@/lib/calculations/stairs";
import { StairDiagram } from "./stair-diagram";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
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
  Ruler,
  Sliders,
  DollarSign,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const QUICK_RISE_PRESETS = [
  { label: "8′ Ceiling (108″ Rise)", value: 108 },
  { label: "9′ Ceiling (120″ Rise)", value: 120 },
  { label: "Basement (96″ Rise)", value: 96 },
  { label: "Porch (35″ Rise)", value: 35 },
  { label: "Deck (21″ Rise)", value: 21 },
];

export function StairCalculatorForm() {
  const [totalRiseInches, setTotalRiseInches] = useState<number>(108);
  const [targetRiserHeightInches, setTargetRiserHeightInches] = useState<number>(7.5);
  const [targetTreadDepthInches, setTargetTreadDepthInches] = useState<number>(10.5);
  const [treadThicknessInches, setTreadThicknessInches] = useState<number>(1.0);
  const [finishedFloorLowerInches, setFinishedFloorLowerInches] = useState<number>(0.75);
  const [finishedFloorUpperInches, setFinishedFloorUpperInches] = useState<number>(0.75);
  const [stairWidthInches, setStairWidthInches] = useState<number>(36);
  const [maxStringerSpacingInches, setMaxStringerSpacingInches] = useState<number>(16);
  const [stringerStock, setStringerStock] = useState<StairStringerLumber>("2x12");
  const [wellholeLengthInches, setWellholeLengthInches] = useState<number>(120);
  const [upperFloorThicknessInches, setUpperFloorThicknessInches] = useState<number>(11.25);
  const [codeStandard, setCodeStandard] = useState<StairCodeStandard>("irc");

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Optional Cost Estimator state
  const [isCostEnabled, setIsCostEnabled] = useState<boolean>(false);
  const [costRates, setCostRates] = useState<StairCostRates>({
    pricePerStringerBoard: 32.0,
    pricePerTreadBoard: 18.0,
    pricePerRiserBoard: 12.0,
    pricePerHangerBracket: 8.5,
  });

  useEffect(() => {
    trackCalculatorStarted("stair-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: StairCalculatorResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: StairCalculatorInput = {
        totalRiseInches,
        targetRiserHeightInches,
        targetTreadDepthInches,
        treadThicknessInches,
        finishedFloorLowerInches,
        finishedFloorUpperInches,
        stairWidthInches,
        maxStringerSpacingInches,
        stringerStock,
        wellholeLengthInches,
        upperFloorThicknessInches,
        codeStandard,
        costRates: isCostEnabled ? costRates : undefined,
      };
      const res = calculateStairProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    totalRiseInches,
    targetRiserHeightInches,
    targetTreadDepthInches,
    treadThicknessInches,
    finishedFloorLowerInches,
    finishedFloorUpperInches,
    stairWidthInches,
    maxStringerSpacingInches,
    stringerStock,
    wellholeLengthInches,
    upperFloorThicknessInches,
    codeStandard,
    isCostEnabled,
    costRates,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("stair-calculator", "construction", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "risers",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    try { localStorage.removeItem("saved_stair_config"); } catch {}
    setTotalRiseInches(108);
    setTargetRiserHeightInches(7.5);
    setTargetTreadDepthInches(10.5);
    setTreadThicknessInches(1.0);
    setFinishedFloorLowerInches(0.75);
    setFinishedFloorUpperInches(0.75);
    setStairWidthInches(36);
    setMaxStringerSpacingInches(16);
    setStringerStock("2x12");
    setWellholeLengthInches(120);
    setUpperFloorThicknessInches(11.25);
    setCodeStandard("irc");
    setIsCostEnabled(false);
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const { geometry, materials } = calculationResult.result;

    const summaryLines = [
      "STAIR STRINGER & CUT GEOMETRY TAKEOFF",
      "=====================================",
      `Total Rise: ${geometry.totalRiseFormatted}`,
      `Total Run: ${geometry.totalRunFormatted}`,
      `Risers: ${geometry.riserCount} risers @ ${geometry.exactRiserHeightFormatted} each`,
      `Treads: ${geometry.treadCount} treads @ ${geometry.exactTreadDepthFormatted} each`,
      `Stair Pitch / Angle: ${geometry.stairAngleDegrees}°`,
      `Stringer Board Length: ${materials.stringerStockLengthFt}' stock (${materials.stringerLumberStock})`,
      `Stringers Required: ${materials.stringerBoardCount} pieces (${stairWidthInches}" stair width @ ${maxStringerSpacingInches}" max spacing)`,
      `Bottom Riser Cut Deduction: ${geometry.bottomRiserDeductionInches.toFixed(2)}"`,
      `Minimum Stringer Throat Depth: ${geometry.stringerThroatDepthInches.toFixed(2)}" (min 3.5" required)`,
      "",
      `Code Status: ${geometry.codeCompliance.overallCompliant ? "Meets standard IRC limits" : "Check local code limits"}`,
      "",
      "Reference: IRC 2024 Section R311.7 Prescriptive Sizing Limits",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("stair-calculator", "construction", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_stair_config", JSON.stringify({ totalRiseInches, targetRiserHeightInches, targetTreadDepthInches, stairWidthInches }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Ignore
    }
  };

  const { result } = calculationResult;

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="Stair Stringer Layout & Cut Worksheet"
        category="Construction & Framing"
      />

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Dynamic Stringer CAD Blueprint (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <StairDiagram geometry={result.geometry} />
          )}
        </div>

        {/* RIGHT PANE: Variable Hub & Stair Takeoff Dock (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Dimension Inputs Dock */}
          <div className="glass-dock rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Stair Height &amp; Step Targets
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
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quick Story Height Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_RISE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTotalRiseInches(p.value)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      totalRiseInches === p.value
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <FormField id="total-rise" label="Total Rise (Inches)" required className="space-y-1">
                <Input
                  id="total-rise"
                  type="number"
                  min="6"
                  max="360"
                  step="0.125"
                  value={totalRiseInches}
                  onChange={(e) => setTotalRiseInches(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <FormField id="target-riser" label="Target Riser (Inches)" required className="space-y-1">
                <Input
                  id="target-riser"
                  type="number"
                  min="4"
                  max="9"
                  step="0.125"
                  value={targetRiserHeightInches}
                  onChange={(e) => setTargetRiserHeightInches(parseFloat(e.target.value) || 7.5)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <FormField id="target-tread" label="Target Tread (Inches)" required className="space-y-1">
                <Input
                  id="target-tread"
                  type="number"
                  min="8"
                  max="14"
                  step="0.125"
                  value={targetTreadDepthInches}
                  onChange={(e) => setTargetTreadDepthInches(parseFloat(e.target.value) || 10.5)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <FormField id="stair-width" label="Stair Width (Inches)" required className="space-y-1">
                <Input
                  id="stair-width"
                  type="number"
                  min="24"
                  max="96"
                  step="1"
                  value={stairWidthInches}
                  onChange={(e) => setStairWidthInches(parseFloat(e.target.value) || 36)}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Floor Finishes & Headroom */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Floor Finishes, Stringer Stock &amp; Lumber Pricing</span>
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
                  <div className="space-y-1">
                    <label htmlFor="tread-thick" className="font-mono font-bold text-slate-400 block text-[10px] uppercase">
                      Tread Thickness:
                    </label>
                    <input
                      id="tread-thick"
                      type="number"
                      step="0.125"
                      value={treadThicknessInches}
                      onChange={(e) => setTreadThicknessInches(parseFloat(e.target.value) || 1.0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="stringer-stock" className="font-mono font-bold text-slate-400 block text-[10px] uppercase">
                      Stringer Stock:
                    </label>
                    <select
                      id="stringer-stock"
                      value={stringerStock}
                      onChange={(e) => setStringerStock(e.target.value as StairStringerLumber)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      {STRINGER_LUMBER_OPTIONS.map((opt) => (
                        <option key={opt.stock} value={opt.stock}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Cost Estimator */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-300 flex items-center gap-1 text-[11px] uppercase">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      Stair Lumber Cost Estimator
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCostEnabled(!isCostEnabled)}
                      className="text-[11px] font-bold text-amber-400 hover:underline"
                    >
                      {isCostEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                  {isCostEnabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="cost-stringer" className="text-[10px] text-slate-400 block font-mono">$/Stringer Board</label>
                        <input
                          id="cost-stringer"
                          type="number"
                          step="1.0"
                          value={costRates.pricePerStringerBoard ?? 32.0}
                          onChange={(e) => setCostRates({ ...costRates, pricePerStringerBoard: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="cost-tread" className="text-[10px] text-slate-400 block font-mono">$/Tread Board</label>
                        <input
                          id="cost-tread"
                          type="number"
                          step="1.0"
                          value={costRates.pricePerTreadBoard ?? 18.0}
                          onChange={(e) => setCostRates({ ...costRates, pricePerTreadBoard: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Decision & Stair Takeoff Dock */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Cut Geometry Schedule
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {result.geometry.stairAngleDegrees}° Pitch
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                      Exact Unit Rise
                    </span>
                    <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                      {result.geometry.exactRiserHeightFormatted}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {result.geometry.riserCount} Total Risers
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                      Exact Unit Tread
                    </span>
                    <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                      {result.geometry.exactTreadDepthFormatted}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {result.geometry.treadCount} Total Treads
                    </span>
                  </div>
                </div>

                {/* Stringer Board Order Recommendation */}
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block tracking-wider">
                    Stringer Stock Order
                  </span>
                  <div className="text-xl font-black text-white font-mono flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-emerald-400" />
                    <span>{result.materials.stringerBoardCount} Stringers</span>
                    <span className="text-xs text-slate-300 font-sans font-normal">({result.materials.stringerLumberStock} × {result.materials.stringerStockLengthFt}′)</span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    {result.geometry.stringerLineLengthFormatted} diagonal stringer cut line. Bottom riser deduction: {result.geometry.bottomRiserDeductionInches.toFixed(2)}″.
                  </p>
                </div>

                {/* Geometry Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Total Stair Dimensions
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Total Run:</span>
                    <span className="font-bold text-white">{result.geometry.totalRunFormatted}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Throat Depth:</span>
                    <span className="font-bold text-white">{result.geometry.stringerThroatDepthInches.toFixed(2)}″</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Total Treads Needed:</span>
                    <span className="font-bold text-amber-400">{result.materials.treadBoardPieces} pieces</span>
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
                    toolSlug="stair-calculator"
                    category="construction"
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
