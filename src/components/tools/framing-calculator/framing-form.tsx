"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  FramingCostRates,
  FramingProjectResult,
  WallSectionInput,
} from "@/types/framing";
import { STANDARD_STOCK_PLATE_LENGTHS } from "@/data/materials/lumber-types";
import { calculateFramingProject } from "@/lib/calculations/framing";
import { WallRow } from "./wall-row";
import { FramingDiagram } from "./framing-diagram";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { PrintButton, JobsitePrintHeader } from "@/components/ui/print-view";
import {
  trackCalculatorStarted,
  trackResultGenerated,
  trackCopyResult,
} from "@/lib/analytics/events";
import {
  Plus,
  RotateCcw,
  Copy,
  Check,
  Hammer,
  Sliders,
  Save,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DEFAULT_WALL: WallSectionInput = {
  id: "wall-1",
  name: "North Wall (Exterior)",
  lengthFt: 20,
  heightFt: 8,
  studSpacingInches: 16,
  lumberSize: "2x4",
  hasDoubleTopPlate: true,
  cornerCount: 2,
  intersectionCount: 0,
  openings: [
    {
      id: "op-1",
      name: "3050 Window",
      type: "window",
      widthFt: 3.0,
      heightFt: 5.0,
      count: 1,
      headerLumberSize: "2x8",
    },
  ],
};

const WASTE_PRESETS = [0, 5, 10, 15];

export function FramingCalculatorForm() {
  const [walls, setWalls] = useState<WallSectionInput[]>([DEFAULT_WALL]);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [isCustomWaste, setIsCustomWaste] = useState<boolean>(false);
  const [stockPlateLengthFt, setStockPlateLengthFt] = useState<number>(16);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Optional Cost Estimator state
  const [isCostEnabled, setIsCostEnabled] = useState<boolean>(false);
  const [costRates, setCostRates] = useState<FramingCostRates>({
    pricePerStud: 4.5,
    pricePerPlateBoard: 9.5,
    pricePerHeaderPiece: 14.0,
  });

  useEffect(() => {
    trackCalculatorStarted("framing-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: FramingProjectResult;
    error?: string;
  } = useMemo(() => {
    try {
      const res = calculateFramingProject({
        walls,
        wastePercent,
        stockPlateLengthFt,
        costRates: isCostEnabled ? costRates : undefined,
      });
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [walls, wastePercent, stockPlateLengthFt, isCostEnabled, costRates]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("framing-calculator", "construction", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "studs",
      });
    }
  }, [calculationResult.result]);

  const addWall = () => {
    const nextIndex = walls.length + 1;
    const newWall: WallSectionInput = {
      id: `wall-${Date.now()}`,
      name: `Wall ${nextIndex}`,
      lengthFt: 16,
      heightFt: 8,
      studSpacingInches: 16,
      lumberSize: "2x4",
      hasDoubleTopPlate: true,
      cornerCount: 1,
      intersectionCount: 0,
      openings: [],
    };
    setWalls([...walls, newWall]);
  };

  const updateWall = (index: number, updated: WallSectionInput) => {
    const next = [...walls];
    next[index] = updated;
    setWalls(next);
  };

  const removeWall = (index: number) => {
    if (walls.length <= 1) return;
    setWalls(walls.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    try { localStorage.removeItem("saved_framing_config"); } catch {}
    setWalls([DEFAULT_WALL]);
    setWastePercent(10);
    setIsCustomWaste(false);
    setStockPlateLengthFt(16);
    setIsCostEnabled(false);
  };

  const handleWastePresetChange = (preset: number) => {
    setIsCustomWaste(false);
    setWastePercent(preset);
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const r = calculationResult.result;

    const summaryLines = [
      "WALL FRAMING & LUMBER ESTIMATE TAKEOFF",
      "=====================================",
      `Total Studs (with ${r.wasteStuds} culling/waste): ${r.totalStudsWithWaste} studs`,
      `Net Studs (Exact Layout): ${r.netStuds} studs (${r.totalCommonStuds} common, ${r.totalCornerAndIntersectionStuds} corners/backing, ${r.totalOpeningStuds} openings)`,
      `Total Stock Plate Boards (${r.stockPlateLengthFt}' stock): ${r.totalPlateBoards} boards (${r.plateLinearFt} linear ft)`,
      `Header Lumber Pieces: ${r.headerPieces} pieces (${r.headerLinearFt} linear ft)`,
      `Total Linear Footage: ${r.totalLinearFt} ft`,
      `Total Board Footage: ${r.totalBoardFeet} BF`,
      ...(r.costEstimate
        ? [`Estimated Lumber Cost: $${r.costEstimate.totalEstimatedCost.toFixed(2)}`]
        : []),
      "",
      "Reference: Prescriptive Wall Stud & Plate Takeoff Standards",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("framing-calculator", "construction", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_framing_config", JSON.stringify({ walls, wastePercent, stockPlateLengthFt }));
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
        title="Wall Framing & Lumber Takeoff Worksheet"
        category="Construction & Framing"
      />

      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check all wall dimensions.
        </Alert>
      )}

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Live CAD Blueprint Canvas (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <FramingDiagram
              walls={walls}
              result={result}
              wastePercent={wastePercent}
            />
          )}
        </div>

        {/* RIGHT PANE: Variable Hub & Lumber Takeoff Dock (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Wall Variable Controls */}
          <div className="glass-dock rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Wall Geometry &amp; Openings
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addWall}
                className="text-xs font-bold text-slate-300 hover:text-white border-slate-700 bg-slate-900/80"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-amber-400" />
                Add Wall
              </Button>
            </div>

            {/* Wall Rows */}
            <div className="space-y-3">
              {walls.map((wall, idx) => (
                <WallRow
                  key={wall.id}
                  wall={wall}
                  index={idx}
                  canRemove={walls.length > 1}
                  onChange={(updated) => updateWall(idx, updated)}
                  onRemove={() => removeWall(idx)}
                />
              ))}
            </div>

            <div className="flex items-center justify-end pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Defaults
              </button>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Plate Stock & Waste Options */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Plate Stock &amp; Culling Waste (+{wastePercent}% Extra)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-4 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="space-y-1.5">
                  <label htmlFor="stock-plate-len" className="font-mono font-bold text-slate-300 block text-[11px] uppercase">
                    Stock Plate Board Length:
                  </label>
                  <select
                    id="stock-plate-len"
                    value={stockPlateLengthFt}
                    onChange={(e) => setStockPlateLengthFt(parseInt(e.target.value, 10))}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                  >
                    {STANDARD_STOCK_PLATE_LENGTHS.map((len) => (
                      <option key={len} value={len}>
                        {len} ft Stock Boards
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="font-mono font-bold text-slate-300 block text-[11px] uppercase">
                    Culling &amp; Waste Allowance:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {WASTE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleWastePresetChange(preset)}
                        className={`p-1.5 rounded-lg text-center text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                          !isCustomWaste && wastePercent === preset
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Cost Estimator */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-300 flex items-center gap-1 text-[11px] uppercase">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      Lumber Cost Estimator
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
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label htmlFor="cost-stud" className="text-[10px] text-slate-400 block font-mono">$/Stud</label>
                        <input
                          id="cost-stud"
                          type="number"
                          step="0.25"
                          value={costRates.pricePerStud ?? 4.5}
                          onChange={(e) => setCostRates({ ...costRates, pricePerStud: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="cost-plate" className="text-[10px] text-slate-400 block font-mono">$/Plate</label>
                        <input
                          id="cost-plate"
                          type="number"
                          step="0.5"
                          value={costRates.pricePerPlateBoard ?? 9.5}
                          onChange={(e) => setCostRates({ ...costRates, pricePerPlateBoard: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="cost-header" className="text-[10px] text-slate-400 block font-mono">$/Header</label>
                        <input
                          id="cost-header"
                          type="number"
                          step="0.5"
                          value={costRates.pricePerHeaderPiece ?? 14.0}
                          onChange={(e) => setCostRates({ ...costRates, pricePerHeaderPiece: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Decision & Lumber Takeoff Dock */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hammer className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Lumber Takeoff Schedule
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  +{result.wastePercent}% Waste
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                    Total Studs Required
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.totalStudsWithWaste}
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      pcs
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Net: {result.netStuds} studs ({result.totalCommonStuds} common, {result.totalCornerAndIntersectionStuds} corners, {result.totalOpeningStuds} openings)
                  </span>
                </div>

                {/* Jobsite Plate Lumber Recommendation */}
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block tracking-wider">
                    Plate Stock Recommendation
                  </span>
                  <div className="text-xl font-black text-white font-mono flex items-center gap-2">
                    <Hammer className="h-5 w-5 text-emerald-400" />
                    <span>{result.totalPlateBoards} Boards</span>
                    <span className="text-xs text-slate-300 font-sans font-normal">({result.stockPlateLengthFt}′ Stock)</span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    {result.plateLinearFt} LF total plate coverage (double top + single sole).
                  </p>
                </div>

                {/* Material Takeoff Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Lumber Material Takeoff
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Framing Studs:</span>
                    <span className="font-bold text-amber-400">{result.totalStudsWithWaste} pcs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Plate Stock ({result.stockPlateLengthFt}′):</span>
                    <span className="font-bold text-white">{result.totalPlateBoards} boards</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Header Lumber:</span>
                    <span className="font-bold text-white">{result.headerPieces} pcs ({result.headerLinearFt} LF)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Total Board Feet:</span>
                    <span className="font-bold text-white">{result.totalBoardFeet} BF</span>
                  </div>
                  {result.costEstimate && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60 text-emerald-400">
                      <span>Estimated Material Cost:</span>
                      <span className="font-bold">${result.costEstimate.totalEstimatedCost.toFixed(2)}</span>
                    </div>
                  )}
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
                    toolSlug="framing-calculator"
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
