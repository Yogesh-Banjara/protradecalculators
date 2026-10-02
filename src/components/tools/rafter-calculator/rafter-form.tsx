"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  RafterCalculatorInput,
  RafterCalculatorResult,
  RafterNominalDepth,
  RafterSpacingInches,
} from "@/types/rafter";
import { calculateRafterProject } from "@/lib/calculations/rafter";
import { RAFTER_LUMBER_SIZES } from "@/data/materials/roofing-types";
import { RafterDiagram } from "./rafter-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
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
  Triangle,
  Ruler,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PRESETS = [
  {
    label: "24′ Garage / Workshop (4:12 Pitch)",
    span: 24,
    pitch: 4,
    overhang: 12,
    ridge: 1.5,
    depth: "2x6" as RafterNominalDepth,
    bearing: 3.5,
  },
  {
    label: "28′ Ranch Home (6:12 Pitch)",
    span: 28,
    pitch: 6,
    overhang: 12,
    ridge: 1.5,
    depth: "2x8" as RafterNominalDepth,
    bearing: 3.5,
  },
  {
    label: "16′ Shed / Cabin (8:12 Pitch)",
    span: 16,
    pitch: 8,
    overhang: 12,
    ridge: 1.5,
    depth: "2x6" as RafterNominalDepth,
    bearing: 3.5,
  },
  {
    label: "32′ Two-Story House (10:12 Pitch)",
    span: 32,
    pitch: 10,
    overhang: 16,
    ridge: 1.5,
    depth: "2x10" as RafterNominalDepth,
    bearing: 5.5,
  },
];

export function RafterCalculatorForm() {
  const [buildingSpanFt, setBuildingSpanFt] = useState<number>(24);
  const [pitchIn12, setPitchIn12] = useState<number>(6);
  const [eaveOverhangInches, setEaveOverhangInches] = useState<number>(12);
  const [ridgeBoardThicknessInches, setRidgeBoardThicknessInches] = useState<number>(1.5);
  const [rafterDepthNominal, setRafterDepthNominal] = useState<RafterNominalDepth>("2x6");
  const [seatCutBearingInches, setSeatCutBearingInches] = useState<number>(3.5);
  const [rafterSpacingInches, setRafterSpacingInches] = useState<RafterSpacingInches>(16);
  const [roofLengthFt, setRoofLengthFt] = useState<number>(32);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("rafter-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: RafterCalculatorResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: RafterCalculatorInput = {
        buildingSpanFt,
        pitchIn12,
        eaveOverhangInches,
        ridgeBoardThicknessInches,
        rafterDepthNominal,
        seatCutBearingInches,
        rafterSpacingInches,
        roofLengthFt: roofLengthFt > 0 ? roofLengthFt : undefined,
      };
      const res = calculateRafterProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    buildingSpanFt,
    pitchIn12,
    eaveOverhangInches,
    ridgeBoardThicknessInches,
    rafterDepthNominal,
    seatCutBearingInches,
    rafterSpacingInches,
    roofLengthFt,
  ]);

  const { result, error } = calculationResult;

  useEffect(() => {
    if (result) {
      trackResultGenerated("rafter-calculator", "construction", {
        hasWarnings: result.warnings.length > 0,
        primaryUnit: "Feet/Inches",
      });
    }
  }, [result]);

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setBuildingSpanFt(preset.span);
    setPitchIn12(preset.pitch);
    setEaveOverhangInches(preset.overhang);
    setRidgeBoardThicknessInches(preset.ridge);
    setRafterDepthNominal(preset.depth);
    setSeatCutBearingInches(preset.bearing);
  };

  const resetDefaults = () => {
    setBuildingSpanFt(24);
    setPitchIn12(6);
    setEaveOverhangInches(12);
    setRidgeBoardThicknessInches(1.5);
    setRafterDepthNominal("2x6");
    setSeatCutBearingInches(3.5);
    setRafterSpacingInches(16);
    setRoofLengthFt(32);
  };

  const copySummaryToClipboard = async () => {
    if (!result) return;
    const g = result.geometry;
    const summary = [
      "=== PROTRADE RAFTER CUT SCHEDULE ===",
      `Span: ${buildingSpanFt} ft | Run: ${g.runFt} ft (${g.runInches}") | Rise: ${g.riseFt} ft (${g.riseInches}")`,
      `Pitch: ${g.pitchIn12}:12 (${g.pitchAngleDegrees}° Plumb Cut)`,
      `Rafter Line Length: ${g.rafterLineLengthFormatted} (${g.rafterLineLengthInches}")`,
      `Ridge Deduction: ${g.ridgeDeductionInches}"`,
      `Overhang: ${g.overhangRunInches}" run -> ${g.overhangRafterLengthInches}" cut along slope`,
      `Total Practical Cut Length: ${g.totalCutRafterLengthFormatted} (${g.totalCutRafterLengthFt} ft)`,
      `Recommended Stock Lumber: ${result.recommendedStockLumberFt} ft boards`,
      `Birdsmouth: Seat Cut ${g.birdsmouth.seatCutLengthInches}" | Plumb Cut ${g.birdsmouth.plumbCutDepthInches}" | H.A.P. ${g.birdsmouth.heightAbovePlateInches}"`,
      result.totalCommonRafters
        ? `Materials Count: ${result.totalCommonRafters} common rafters (${result.totalRafterPairs} pairs for ${roofLengthFt} ft length)`
        : "",
      "Calculated via ProTrade Calculators (https://protradecalculators.com/construction/rafter-calculator)",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      trackCopyResult("rafter-calculator", "construction", "full_cut_list");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="Common Rafter Framing & Cut Worksheet"
        category="Construction & Framing"
      />

      {/* Preset Buttons */}
      <div className="space-y-2 no-print">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Quick Setup Framing Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer inline-flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Inputs (Left 5 cols) vs Diagram & Hero Takeoff (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT FORM DOCK (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Triangle className="h-4 w-4 text-amber-600" />
              1. Roof Span &amp; Pitch Geometry
            </h3>

            {/* Building Span */}
            <FormField id="span" label="Building Total Span (Feet)" required>
              <Input
                id="span"
                type="number"
                min="4"
                max="80"
                step="0.5"
                value={buildingSpanFt || ""}
                onChange={(e) => setBuildingSpanFt(parseFloat(e.target.value) || 0)}
                placeholder="24"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Total exterior wall-to-wall framing width (Half-span = Run: {(buildingSpanFt / 2).toFixed(1)}′)
              </span>
            </FormField>

            {/* Roof Pitch */}
            <div className="space-y-1.5">
              <label htmlFor="pitch" className="text-xs font-bold text-slate-700 block">
                Roof Pitch (Rise / 12″ Run)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="pitch"
                  type="number"
                  min="1"
                  max="24"
                  step="0.25"
                  value={pitchIn12 || ""}
                  onChange={(e) => setPitchIn12(parseFloat(e.target.value) || 0)}
                  placeholder="6"
                  className="font-bold"
                />
                <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
                  in 12″ ({result?.geometry.pitchAngleDegrees}° Plumb)
                </span>
              </div>

              {/* Quick Pitch Presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[3, 4, 5, 6, 7, 8, 10, 12].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPitchIn12(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                      pitchIn12 === p
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {p}:12
                  </button>
                ))}
              </div>
            </div>

            {/* Overhang & Lumber Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <FormField id="overhang" label="Eave Overhang (Inches)">
                <Input
                  id="overhang"
                  type="number"
                  min="0"
                  max="48"
                  step="1"
                  value={eaveOverhangInches}
                  onChange={(e) => setEaveOverhangInches(parseFloat(e.target.value) || 0)}
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Horizontal soffit depth
                </span>
              </FormField>

              <div>
                <label htmlFor="rafter-depth" className="text-xs font-bold text-slate-700 block mb-1">
                  Rafter Lumber Size
                </label>
                <select
                  id="rafter-depth"
                  value={rafterDepthNominal}
                  onChange={(e) => setRafterDepthNominal(e.target.value as RafterNominalDepth)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800"
                >
                  {RAFTER_LUMBER_SIZES.map((sz) => (
                    <option key={sz.nominal} value={sz.nominal}>
                      {sz.nominal} ({sz.actualDepthInches}″ net)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Dimensional lumber depth
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Parameters */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-600" />
                <span>Ridge Thickness, Wall Seat &amp; Material Count</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-3 border-t border-slate-200 text-xs bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <FormField id="ridge" label="Ridge Board Thickness (Inches)">
                    <Input
                      id="ridge"
                      type="number"
                      min="0"
                      max="6"
                      step="0.25"
                      value={ridgeBoardThicknessInches}
                      onChange={(e) => setRidgeBoardThicknessInches(parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-[10px] text-slate-500 block">
                      1.5″ for 2x stock, 0.75″ for 1x
                    </span>
                  </FormField>

                  <FormField id="bearing" label="Seat Cut Bearing (Inches)">
                    <Input
                      id="bearing"
                      type="number"
                      min="1.5"
                      max="8"
                      step="0.25"
                      value={seatCutBearingInches}
                      onChange={(e) => setSeatCutBearingInches(parseFloat(e.target.value) || 3.5)}
                    />
                    <span className="text-[10px] text-slate-500 block">
                      3.5″ for 2x4 wall, 5.5″ for 2x6
                    </span>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <FormField id="roof-length" label="Roof Length (Feet) - Optional">
                    <Input
                      id="roof-length"
                      type="number"
                      min="4"
                      max="200"
                      step="1"
                      value={roofLengthFt || ""}
                      onChange={(e) => setRoofLengthFt(parseFloat(e.target.value) || 0)}
                      placeholder="32"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Building ridge length
                    </span>
                  </FormField>

                  <div>
                    <label htmlFor="spacing" className="text-xs font-bold text-slate-700 block mb-1">
                      Rafter On-Center Spacing
                    </label>
                    <select
                      id="spacing"
                      value={rafterSpacingInches}
                      onChange={(e) =>
                        setRafterSpacingInches(parseInt(e.target.value, 10) as RafterSpacingInches)
                      }
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                    >
                      <option value={12}>12″ On Center</option>
                      <option value={16}>16″ On Center (Standard)</option>
                      <option value={24}>24″ On Center (Truss/Light)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT VISUAL WORKBENCH (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <Alert variant="error" title="Input Incomplete or Invalid">
              {error}
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              {/* PRIMARY HERO CUT SCHEDULE CARD */}
              <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
                <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-amber-400" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Rafter Cut Length &amp; Lumber Order
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {result.geometry.pitchIn12}:12 ({result.geometry.pitchAngleDegrees}°)
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Practical Cutting Length */}
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                        Total Practical Cut Length:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                          {result.geometry.totalCutRafterLengthFormatted}
                        </span>
                        <span className="text-xs text-slate-300 font-sans">
                          ({result.geometry.totalCutRafterLengthFt}′)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 pt-0.5">
                        Tip of plumb cut to tail end cut
                      </p>
                    </div>

                    {/* Stock Lumber Order */}
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold block">
                        Recommended Stock Board:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-sky-400 font-mono tracking-tight">
                          {result.recommendedStockLumberFt}′
                        </span>
                        <span className="text-xs text-slate-300 font-sans">
                          {rafterDepthNominal} Stock
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 pt-0.5">
                        Order {result.recommendedStockLumberFt}-foot boards for cutting
                      </p>
                    </div>
                  </div>

                  {/* Secondary Geometry Takeoffs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Line Length:</span>
                      <span className="font-bold text-slate-100">
                        {result.geometry.rafterLineLengthFormatted}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ridge Deduct:</span>
                      <span className="font-bold text-slate-100">
                        {result.geometry.ridgeDeductionInches}″
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Overhang Tail:</span>
                      <span className="font-bold text-slate-100">
                        {result.geometry.overhangRafterLengthInches}″ cut
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Seat Cut Bearing:</span>
                      <span className="font-bold text-emerald-400">
                        {result.geometry.birdsmouth.seatCutLengthInches}″
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Plumb Notch Depth:</span>
                      <span className={`font-bold ${result.ircCompliance.isNotchCompliant ? "text-slate-100" : "text-amber-400"}`}>
                        {result.geometry.birdsmouth.plumbCutDepthInches}″
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">H.A.P. Heel Stand:</span>
                      <span className="font-bold text-sky-400">
                        {result.geometry.birdsmouth.heightAbovePlateInches}″
                      </span>
                    </div>
                  </div>

                  {/* Materials Count (If roof length set) */}
                  {result.totalCommonRafters && (
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">
                          Framing Takeoff for {roofLengthFt}′ Roof ({rafterSpacingInches}″ O.C.):
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {result.totalRafterPairs} Rafter Pairs &bull; {result.totalCommonRafters} Total Common Rafters
                        </div>
                      </div>
                      <span className="text-base font-mono font-bold text-amber-400">
                        {result.totalCommonRafters} pcs ({rafterDepthNominal} × {result.recommendedStockLumberFt}′)
                      </span>
                    </div>
                  )}

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {result.warnings.map((w, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 bg-amber-950/60 border border-amber-800/80 p-2.5 rounded-md text-xs text-amber-200"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{w.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 no-print">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copySummaryToClipboard}
                        className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
                            Copied Cut List!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Copy Cut Schedule
                          </>
                        )}
                      </Button>

                      <PrintButton
                        toolSlug="rafter-calculator"
                        category="construction"
                        label="Print Worksheet"
                        className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
                      />

                      <EmbedModal
                        toolSlug="rafter-calculator"
                        toolName="Roof Rafter Length & Cut Calculator"
                        buttonLabel="Embed"
                        variant="outline"
                      />
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      Calibrated to IRC R802 Rafter Framing Standards
                    </span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SVG RAFTER DIAGRAM */}
              <RafterDiagram result={result} />

              {/* STEP-BY-STEP MATHEMATICAL STEPS */}
              {result.steps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                    Carpentry Calculation Steps &amp; Trigonometric Proofs
                  </h4>
                  <div className="space-y-2">
                    {result.steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                      >
                        <div className="text-slate-700">
                          <span className="text-amber-800 font-bold mr-1.5">{idx + 1}.</span>
                          <span className="font-sans font-semibold text-slate-900">{st.label}:</span>{" "}
                          <span>{st.values}</span>
                        </div>
                        <div className="text-amber-900 font-bold sm:text-right shrink-0">
                          = {st.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
