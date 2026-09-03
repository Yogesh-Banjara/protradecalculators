"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  DeckBoardOrientation,
  DeckBoardStockLength,
  DeckBoardType,
  DeckCostRates,
  DeckJoistLumber,
  DeckJoistSpacing,
  DeckPictureFrame,
  DeckBeamLumber,
  DeckCalculatorInput,
  DeckCalculatorResult,
} from "@/types/deck";
import { DECK_BOARD_REGISTRY } from "@/data/materials/decking-types";
import { calculateDeckProject } from "@/lib/calculations/deck";
import { DeckDiagram } from "./deck-diagram";
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
  Hammer,
  Sliders,
  Save,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";

const QUICK_SIZE_PRESETS = [
  { label: "10′ × 12′ (120 sq ft)", length: 12, width: 10 },
  { label: "12′ × 16′ (192 sq ft)", length: 16, width: 12 },
  { label: "14′ × 20′ (280 sq ft)", length: 20, width: 14 },
  { label: "16′ × 24′ (384 sq ft)", length: 24, width: 16 },
];

export function DeckCalculatorForm() {
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  const [lengthFt, setLengthFt] = useState<number>(20);
  const [widthFt, setWidthFt] = useState<number>(14);
  const [boardType, setBoardType] = useState<DeckBoardType>("5/4x6_composite");
  const [boardStockLengthFt, setBoardStockLengthFt] = useState<DeckBoardStockLength>(16);
  const [boardOrientation, setBoardOrientation] = useState<DeckBoardOrientation>("perpendicular");
  const [pictureFrame, setPictureFrame] = useState<DeckPictureFrame>("none");
  const [joistSpacingInches, setJoistSpacingInches] = useState<DeckJoistSpacing>(16);
  const [joistLumber, setJoistLumber] = useState<DeckJoistLumber>("2x8");
  const [beamLumber, setBeamLumber] = useState<DeckBeamLumber>("2-ply 2x10");
  const [pierDiameterInches, setPierDiameterInches] = useState<number>(12);
  const [pierDepthInches, setPierDepthInches] = useState<number>(36);
  const [wastePercent, setWastePercent] = useState<number>(10);

  // Progressive Disclosure Drawers
  const [showFramingDetails, setShowFramingDetails] = useState<boolean>(false);
  const [showDeckingDetails, setShowDeckingDetails] = useState<boolean>(false);
  const [showCostEstimator, setShowCostEstimator] = useState<boolean>(false);

  // Cost rates state
  const [isCostEnabled, setIsCostEnabled] = useState<boolean>(false);
  const [costRates, setCostRates] = useState<DeckCostRates>({
    pricePerDeckBoard: 45.0,
    pricePerJoistBoard: 18.0,
    pricePerBeamBoard: 28.0,
    pricePerPostBoard: 35.0,
    pricePerConcreteBag: 6.5,
    pricePerHardwarePack: 120.0,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("deck-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: DeckCalculatorResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: DeckCalculatorInput = {
        lengthFt,
        widthFt,
        boardType,
        boardStockLengthFt,
        boardOrientation,
        pictureFrame,
        joistSpacingInches,
        joistLumber,
        beamLumber,
        pierDiameterInches,
        pierDepthInches,
        wastePercent,
        costRates: isCostEnabled ? costRates : undefined,
      };
      const res = calculateDeckProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    lengthFt,
    widthFt,
    boardType,
    boardStockLengthFt,
    boardOrientation,
    pictureFrame,
    joistSpacingInches,
    joistLumber,
    beamLumber,
    pierDiameterInches,
    pierDepthInches,
    wastePercent,
    isCostEnabled,
    costRates,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("deck-calculator", "construction", {
        primaryUnit: "sqft",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    try { localStorage.removeItem("saved_deck_config"); } catch {}
    setLengthFt(20);
    setWidthFt(14);
    setBoardType("5/4x6_composite");
    setBoardStockLengthFt(16);
    setBoardOrientation("perpendicular");
    setPictureFrame("none");
    setJoistSpacingInches(16);
    setJoistLumber("2x8");
    setBeamLumber("2-ply 2x10");
    setPierDiameterInches(12);
    setPierDepthInches(36);
    setWastePercent(10);
    setIsCostEnabled(false);
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const { lengthFt: len, widthFt: wid, decking, framing, concrete, hardware, costEstimate } = calculationResult.result;

    const summaryLines = [
      "DECK MATERIAL & STRUCTURAL FRAMING TAKEOFF",
      "==========================================",
      `Deck Footprint: ${len}′ Length × ${wid}′ Projection (${decking.deckSurfaceAreaSqFt} sq ft)`,
      `Decking Surface: ${decking.totalStockBoardsRequired} Boards (${decking.stockLengthFt}′ Stock) • ${decking.totalLinearFeet} Linear Ft`,
      `Joist Framing: ${framing.fieldJoistsCount} Field Joists (${framing.joistLumber} × ${framing.joistStockLengthFt}′ Stock @ ${framing.joistSpacingInches}″ OC)`,
      `Ledger Board: 1 Board (${framing.joistLumber} × ${framing.ledgerLengthFt}′)`,
      `Rim Joists: ${framing.rimJoistPieces} Pieces (${framing.joistLumber})`,
      `Support Beam: ${framing.beamBoardPieces} Boards (${framing.beamLumber} × ${framing.beamLengthFt}′)`,
      `Footing Piers: ${concrete.pierFootingCount} Piers (${concrete.pierDiameterInches}″ × ${concrete.pierDepthInches}″ depth) = ${concrete.concreteBags80Lb} bags 80-lb (${concrete.totalConcreteVolumeCuYd} yd³)`,
      `Hardware: ${hardware.joistHangersCount} Joist Hangers, ${hardware.ledgerLagScrewsCount} Ledger Screws, ${hardware.hiddenFastenerBoxes} Boxes Clips`,
      costEstimate ? `Estimated Material Cost: $${costEstimate.totalEstimatedCost.toLocaleString()}` : "",
      "",
      "Reference: IRC 2024 Table R507 Prescriptive Deck Sizing",
    ].filter(Boolean);

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("deck-calculator", "construction", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_deck_config", JSON.stringify({ lengthFt, widthFt, boardType, joistSpacingInches }));
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
        title="Deck Material & Structural Takeoff Worksheet"
        category="Construction & Framing"
      />

      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check deck dimensions and framing parameters.
        </Alert>
      )}

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Interactive Structural Deck CAD Blueprint (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <DeckDiagram result={result} />
          )}
        </div>

        {/* RIGHT PANE: Variable Hub & Takeoff Dock (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Dimensions & Unit Selector */}
          <div className="glass-dock rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Deck Dimensions &amp; Geometry
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Unit Switcher */}
                <div className="bg-slate-900 rounded-lg p-0.5 border border-slate-800 flex text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setUnitSystem("imperial")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      unitSystem === "imperial" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"
                    }`}
                  >
                    Imperial (ft)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem("metric")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      unitSystem === "metric" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"
                    }`}
                  >
                    Metric (m)
                  </button>
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  aria-label="Reset deck inputs to default"
                  title="Reset inputs"
                  className="text-xs text-slate-400 hover:text-slate-200 font-mono inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Quick Size Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quick Sizes:
              </span>
              <div className="flex flex-wrap gap-1">
                {QUICK_SIZE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setLengthFt(p.length);
                      setWidthFt(p.width);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <FormField
                id="deck-length"
                label={`Length along house (${unitSystem === "imperial" ? "ft" : "m"})`}
                required
                className="space-y-1"
              >
                <Input
                  id="deck-length"
                  type="number"
                  min="4"
                  max="100"
                  step={unitSystem === "imperial" ? "1" : "0.1"}
                  value={unitSystem === "imperial" ? lengthFt : Number((lengthFt * 0.3048).toFixed(2))}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setLengthFt(unitSystem === "imperial" ? v : Number((v / 0.3048).toFixed(1)));
                  }}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <FormField
                id="deck-width"
                label={`Projection from house (${unitSystem === "imperial" ? "ft" : "m"})`}
                required
                className="space-y-1"
              >
                <Input
                  id="deck-width"
                  type="number"
                  min="4"
                  max="50"
                  step={unitSystem === "imperial" ? "1" : "0.1"}
                  value={unitSystem === "imperial" ? widthFt : Number((widthFt * 0.3048).toFixed(2))}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setWidthFt(unitSystem === "imperial" ? v : Number((v / 0.3048).toFixed(1)));
                  }}
                  className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
                />
              </FormField>

              <div>
                <label htmlFor="board-type" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Decking Material:
                </label>
                <select
                  id="board-type"
                  value={boardType}
                  onChange={(e) => {
                    const newType = e.target.value as DeckBoardType;
                    setBoardType(newType);
                    if (newType === "5/4x6_composite") {
                      setJoistSpacingInches(16);
                    }
                  }}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  {DECK_BOARD_REGISTRY.map((b) => (
                    <option key={b.type} value={b.type}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="board-stock" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Stock Board Length:
                </label>
                <select
                  id="board-stock"
                  value={boardStockLengthFt}
                  onChange={(e) => setBoardStockLengthFt(parseInt(e.target.value, 10) as DeckBoardStockLength)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value={12}>12′ Stock Boards</option>
                  <option value={16}>16′ Stock Boards (Standard)</option>
                  <option value={20}>20′ Stock Boards (Long Span)</option>
                </select>
              </div>

              <div>
                <label htmlFor="joist-spacing" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Joist Spacing OC:
                </label>
                <select
                  id="joist-spacing"
                  value={joistSpacingInches}
                  onChange={(e) => setJoistSpacingInches(parseInt(e.target.value, 10) as DeckJoistSpacing)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value={12}>12″ On-Center (Rigid / Composite)</option>
                  <option value={16}>16″ On-Center (Standard Residential)</option>
                  <option value={24}>24″ On-Center (2x6 Wood Only)</option>
                </select>
              </div>

              <div>
                <label htmlFor="joist-lumber" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Joist Lumber Size:
                </label>
                <select
                  id="joist-lumber"
                  value={joistLumber}
                  onChange={(e) => setJoistLumber(e.target.value as DeckJoistLumber)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value="2x6">2x6 Lumber (Spans to 9.75′)</option>
                  <option value="2x8">2x8 Lumber (Spans to 12.8′ - Typical)</option>
                  <option value="2x10">2x10 Lumber (Spans to 16.4′)</option>
                  <option value="2x12">2x12 Lumber (Spans to 19.4′)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Layout & Picture Frame */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowDeckingDetails(!showDeckingDetails)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Pattern Orientation, Picture Frame &amp; Waste</span>
              </div>
              {showDeckingDetails ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showDeckingDetails && (
              <div className="p-4 space-y-3 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pattern-orientation" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Board Angle:
                    </label>
                    <select
                      id="pattern-orientation"
                      value={boardOrientation}
                      onChange={(e) => setBoardOrientation(e.target.value as DeckBoardOrientation)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value="perpendicular">Perpendicular (90° Straight)</option>
                      <option value="diagonal">Diagonal (45° Herringbone)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="picture-frame" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Picture Frame Border:
                    </label>
                    <select
                      id="picture-frame"
                      value={pictureFrame}
                      onChange={(e) => setPictureFrame(e.target.value as DeckPictureFrame)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value="none">None (Standard Ends)</option>
                      <option value="single">Single Board Border</option>
                      <option value="double">Double Board Border</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="waste-slider" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Jobsite Waste &amp; Culling Factor: {wastePercent}%
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="waste-slider"
                        type="range"
                        min="0"
                        max="25"
                        step="5"
                        value={wastePercent}
                        onChange={(e) => setWastePercent(parseInt(e.target.value, 10))}
                        className="flex-1 accent-amber-500"
                      />
                      <span className="text-xs font-mono font-bold text-amber-400 w-10 text-right">
                        +{wastePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Progressive Disclosure: Beams & Concrete Footings */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowFramingDetails(!showFramingDetails)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Support Beam, Posts &amp; Footing Piers</span>
              </div>
              {showFramingDetails ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showFramingDetails && (
              <div className="p-4 space-y-3 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="beam-select" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Support Beam Lumber:
                    </label>
                    <select
                      id="beam-select"
                      value={beamLumber}
                      onChange={(e) => setBeamLumber(e.target.value as DeckBeamLumber)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value="2-ply 2x8">2-ply 2x8 Built-Up</option>
                      <option value="2-ply 2x10">2-ply 2x10 Built-Up (Standard)</option>
                      <option value="2-ply 2x12">2-ply 2x12 Heavy-Duty</option>
                      <option value="3-ply 2x10">3-ply 2x10 Long Span</option>
                      <option value="3-ply 2x12">3-ply 2x12 Maximum</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pier-dia" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Pier Diameter (in):
                    </label>
                    <select
                      id="pier-dia"
                      value={pierDiameterInches}
                      onChange={(e) => setPierDiameterInches(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value={8}>8″ Sonotube</option>
                      <option value={10}>10″ Sonotube</option>
                      <option value={12}>12″ Sonotube (Standard)</option>
                      <option value={16}>16″ Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pier-depth" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Frost Depth (in):
                    </label>
                    <input
                      id="pier-depth"
                      type="number"
                      min="12"
                      max="72"
                      step="6"
                      value={pierDepthInches}
                      onChange={(e) => setPierDepthInches(parseInt(e.target.value, 10) || 36)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Progressive Disclosure: Optional Lumber & Material Cost Estimator */}
          <div className="glass-dock rounded-2xl overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowCostEstimator(!showCostEstimator)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                <span>Optional Material Cost Estimator</span>
              </div>
              {showCostEstimator ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showCostEstimator && (
              <div className="p-4 space-y-3 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300 font-mono text-[11px]">Enable Cost Calculation</span>
                  <button
                    type="button"
                    onClick={() => setIsCostEnabled(!isCostEnabled)}
                    className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                  >
                    {isCostEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
                {isCostEnabled && (
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <label className="text-[10px] text-slate-400 block">$/Deck Board</label>
                      <input
                        type="number"
                        value={costRates.pricePerDeckBoard ?? 45}
                        onChange={(e) => setCostRates({ ...costRates, pricePerDeckBoard: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">$/Joist Board</label>
                      <input
                        type="number"
                        value={costRates.pricePerJoistBoard ?? 18}
                        onChange={(e) => setCostRates({ ...costRates, pricePerJoistBoard: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Decision & Material Ordering HUD */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hammer className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Deck Material Ordering Takeoff
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  +{wastePercent}% Waste Factor
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                    Total Deck Surface Area
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.decking.deckSurfaceAreaSqFt}
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      sq ft
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Adjusted for +{wastePercent}% waste: {result.decking.adjustedAreaSqFt} sq ft &bull; {result.decking.totalLinearFeet} Linear Ft
                  </span>
                </div>

                {/* Primary Takeoff Highlights */}
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block tracking-wider">
                    Primary Lumber Purchase
                  </span>
                  <div className="text-xl font-black text-white font-mono flex items-center gap-2">
                    <span className="text-amber-400">{result.decking.totalStockBoardsRequired} Boards</span>
                    <span className="text-xs text-slate-300 font-sans font-normal">({result.decking.stockLengthFt}′ Stock Decking)</span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    {result.framing.fieldJoistsCount} Field Joists ({result.framing.joistLumber} × {result.framing.joistStockLengthFt}′) + {result.concrete.pierFootingCount} Footing Piers ({result.concrete.concreteBags80Lb} bags 80-lb).
                  </p>
                </div>

                {/* Itemized Bill of Materials (BOM) Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Categorized Material Takeoff
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Decking Surface ({result.decking.stockLengthFt}′):</span>
                    <span className="font-bold text-amber-400">{result.decking.totalStockBoardsRequired} boards</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Field Joists ({result.framing.joistLumber} × {result.framing.joistStockLengthFt}′):</span>
                    <span className="font-bold text-white">{result.framing.fieldJoistsCount} pieces</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Support Beam ({result.framing.beamLumber}):</span>
                    <span className="font-bold text-white">{result.framing.beamBoardPieces} pieces ({result.framing.beamLengthFt}′)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Concrete for Footings (80-lb bags):</span>
                    <span className="font-bold text-cyan-400">{result.concrete.concreteBags80Lb} bags ({result.concrete.totalConcreteVolumeCuYd} yd³)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Joist Hangers &amp; Fasteners:</span>
                    <span className="font-bold text-white">{result.hardware.joistHangersCount} hangers / {result.hardware.hiddenFastenerBoxes} boxes clips</span>
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
                    toolSlug="deck-calculator"
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
