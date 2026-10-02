"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ConcreteSectionInput, ConcreteProjectResult } from "@/types/concrete";
import { calculateConcreteProject } from "@/lib/calculations/concrete";
import { SectionRow } from "./section-row";
import { ConcreteDiagram } from "./concrete-diagram";
import { UnitSystemToggle } from "@/components/ui/unit-system-toggle";
import { convertLength } from "@/lib/units/converter";
import type { UnitSystem, LengthUnit } from "@/types/units";
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
  Truck,
  ChevronDown,
  ChevronUp,
  Sliders,
  HelpCircle,
  Save,
} from "lucide-react";

const DEFAULT_SECTION: ConcreteSectionInput = {
  id: "sec-1",
  name: "Main Slab",
  shape: "rectangular-slab",
  quantity: 1,
  length: 10,
  width: 10,
  depth: 4,
  lengthUnit: "foot",
  depthUnit: "inch",
};

const WASTE_PRESETS = [
  { label: "0% (Net)", value: 0 },
  { label: "5% (Clean Forms)", value: 5 },
  { label: "10% (Standard)", value: 10 },
  { label: "15% (Rough Footings)", value: 15 },
];

export function ConcreteCalculatorForm() {
  const [sections, setSections] = useState<ConcreteSectionInput[]>([DEFAULT_SECTION]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [isCustomWaste, setIsCustomWaste] = useState<boolean>(false);
  const [customWasteInput, setCustomWasteInput] = useState<string>("10");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const handleUnitSystemChange = (sys: UnitSystem) => {
    setUnitSystem(sys);
    setSections((prev) =>
      prev.map((sec) => {
        const isCirc = sec.shape === "round-column" || sec.shape === "circular-slab" || sec.shape === "circular-footing";
        if (sys === "metric") {
          return {
            ...sec,
            length: sec.length ? Math.round(convertLength(sec.length, sec.lengthUnit, "meter") * 100) / 100 : undefined,
            width: sec.width ? Math.round(convertLength(sec.width, sec.lengthUnit, "meter") * 100) / 100 : undefined,
            diameter: sec.diameter ? Math.round(convertLength(sec.diameter, (sec.diameterUnit || sec.lengthUnit) as LengthUnit, isCirc && sec.shape === "round-column" ? "centimeter" : "meter") * 10) / 10 : undefined,
            depth: sec.depth ? Math.round(convertLength(sec.depth, sec.depthUnit, "centimeter") * 10) / 10 : undefined,
            lengthUnit: "meter" as LengthUnit,
            depthUnit: "centimeter" as LengthUnit,
            diameterUnit: (isCirc && sec.shape === "round-column" ? "centimeter" : "meter") as LengthUnit,
          };
        } else {
          return {
            ...sec,
            length: sec.length ? Math.round(convertLength(sec.length, sec.lengthUnit, "foot") * 10) / 10 : undefined,
            width: sec.width ? Math.round(convertLength(sec.width, sec.lengthUnit, "foot") * 10) / 10 : undefined,
            diameter: sec.diameter ? Math.round(convertLength(sec.diameter, (sec.diameterUnit || sec.lengthUnit) as LengthUnit, isCirc && sec.shape === "round-column" ? "inch" : "foot") * 10) / 10 : undefined,
            depth: sec.depth ? Math.round(convertLength(sec.depth, sec.depthUnit, "inch") * 10) / 10 : undefined,
            lengthUnit: "foot" as LengthUnit,
            depthUnit: "inch" as LengthUnit,
            diameterUnit: (isCirc && sec.shape === "round-column" ? "inch" : "foot") as LengthUnit,
          };
        }
      })
    );
  };

  useEffect(() => {
    trackCalculatorStarted("concrete-calculator", "construction");
  }, []);

  const calculationResult: {
    result?: ConcreteProjectResult;
    error?: string;
  } = useMemo(() => {
    try {
      const res = calculateConcreteProject({
        sections,
        wastePercent,
      });
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [sections, wastePercent]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("concrete-calculator", "construction", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "cubic-yard",
      });
    }
  }, [calculationResult.result]);

  const addSection = () => {
    const nextIndex = sections.length + 1;
    const newSection: ConcreteSectionInput = {
      id: `sec-${Date.now()}`,
      name: `Section ${nextIndex}`,
      shape: "rectangular-slab",
      quantity: 1,
      length: 10,
      width: 10,
      depth: 4,
      lengthUnit: unitSystem === "metric" ? "meter" : "foot",
      depthUnit: unitSystem === "metric" ? "centimeter" : "inch",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updated: ConcreteSectionInput) => {
    const next = [...sections];
    next[index] = updated;
    setSections(next);
  };

  const removeSection = (index: number) => {
    if (sections.length <= 1) return;
    const next = sections.filter((_, i) => i !== index);
    setSections(next);
  };

  const resetAll = () => {
    setSections([DEFAULT_SECTION]);
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
    const r = calculationResult.result;

    const summaryLines = [
      "CONCRETE TAKEOFF & ORDERING SPECIFICATION",
      "=========================================",
      `Recommended Order: ${r.recommendedOrderYards} yd³ Ready-Mix Truck`,
      `Net Physical Volume: ${r.netVolumeCuYd} yd³ (${r.netVolumeCuFt} cu ft / ${r.netVolumeCuMeters} m³)`,
      `Waste Allowance: ${r.wastePercent}% (+${r.wasteVolumeCuYd} yd³)`,
      `Total Volume with Waste: ${r.totalVolumeCuYd} yd³ (${r.totalVolumeCuFt} cu ft)`,
      "",
      "MATERIALS TAKEOFF:",
      ` - Ready-Mix Concrete: ${r.recommendedOrderYards} yd³`,
      ` - 80-lb Concrete Bags: ${r.bagEstimates.find((b) => b.bagWeightLbs === 80)?.bagsRequired || 0} bags`,
      ` - 60-lb Concrete Bags: ${r.bagEstimates.find((b) => b.bagWeightLbs === 60)?.bagsRequired || 0} bags`,
      "",
      "Reference: ACI 318 Ready-Mix & Bagged Sizing Formulas",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("concrete-calculator", "construction", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem(
        "saved_concrete_config",
        JSON.stringify({ sections, wastePercent, unitSystem })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Ignore storage errors
    }
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="Concrete Volume Takeoff & Ordering Worksheet"
        category="Construction & Framing"
      />

      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please verify all dimension values.
        </Alert>
      )}

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Live CAD Blueprint Canvas (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <ConcreteDiagram
              sections={sections}
              result={result}
              wastePercent={wastePercent}
            />
          )}
        </div>

        {/* RIGHT PANE: Variable Controls & Takeoff (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Job Variable Controls */}
          <div className="instrument-dock p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Job Dimensions &amp; Geometry
                </h2>
              </div>
              <UnitSystemToggle
                system={unitSystem}
                onChange={handleUnitSystemChange}
              />
            </div>

            {/* Project Quick Mode Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Quick Setup:</span>
              <button
                type="button"
                onClick={() =>
                  setSections([
                    {
                      id: "sec-1",
                      name: "Main Slab",
                      shape: "rectangular-slab",
                      quantity: 1,
                      length: 10,
                      width: 10,
                      depth: 4,
                      lengthUnit: "foot",
                      depthUnit: "inch",
                    },
                  ])
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  sections.length === 1 && sections[0].shape === "rectangular-slab"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Slab / Patio
              </button>
              <button
                type="button"
                onClick={() =>
                  setSections([
                    {
                      id: "sec-1",
                      name: "Sonotube Pier Footings",
                      shape: "round-column",
                      quantity: 4,
                      diameter: 12,
                      depth: 48,
                      lengthUnit: "inch",
                      depthUnit: "inch",
                      diameterUnit: "inch",
                    },
                  ])
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  sections.length === 1 && sections[0].shape === "round-column"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Sonotube / Footings
              </button>
              <button
                type="button"
                onClick={() =>
                  setSections([
                    {
                      id: "sec-1",
                      name: "Grade Beam Footing",
                      shape: "continuous-footing",
                      quantity: 1,
                      length: 40,
                      width: 16,
                      depth: 12,
                      lengthUnit: "foot",
                      depthUnit: "inch",
                    },
                  ])
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  sections.length === 1 && sections[0].shape === "continuous-footing"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Continuous Footing
              </button>
            </div>

            {/* Section Rows */}
            <div className="space-y-3">
              {sections.map((section, idx) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  index={idx}
                  canRemove={sections.length > 1}
                  onChange={(updated) => updateSection(idx, updated)}
                  onRemove={() => removeSection(idx)}
                />
              ))}
            </div>

            {/* Add Section & Reset */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={addSection}
                className="text-xs font-bold text-slate-300 hover:text-white border-slate-700 bg-slate-900/80"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-amber-400" />
                Add Slab / Section
              </Button>

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

          {/* 2. Progressive Disclosure: Waste & Subgrade Options */}
          <div className="instrument-dock overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Jobsite Waste Allowance (+{wastePercent}% Safety Factor)</span>
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
                  <label className="font-mono font-bold text-slate-300 block text-[11px] uppercase">
                    Safety Waste Allowance Factor:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {WASTE_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleWastePresetChange(preset.value)}
                        className={`p-2 rounded-lg text-left text-[11px] font-semibold transition-colors border cursor-pointer ${
                          !isCustomWaste && wastePercent === preset.value
                            ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomWaste(true)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border cursor-pointer ${
                        isCustomWaste
                          ? "bg-amber-500 text-slate-950 border-amber-500"
                          : "bg-slate-900 text-slate-400 border-slate-700"
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
                          className="h-7 w-full rounded border border-slate-600 bg-slate-900 px-2 text-xs text-center font-mono font-bold text-white"
                        />
                        <span className="text-slate-400 font-mono">%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    10% standard waste compensates for uneven subgrade grade depressions, form bowing, and pump line washout.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Decision & Takeoff Ordering Takeoff */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden space-y-0 text-white">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Concrete Volume &amp; Order Takeoff
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
                    Calculated Concrete Volume
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.totalVolumeCuYd}
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      yd³
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Net: {result.netVolumeCuYd} yd³ ({result.totalVolumeCuFt} cu ft / {result.totalVolumeCuMeters} m³)
                  </span>
                </div>

                {/* Jobsite Order Callout Banner */}
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block tracking-wider">
                    Recommended Ready-Mix Order
                  </span>
                  <div className="text-xl font-black text-white font-mono flex items-center gap-2">
                    <Truck className="h-5 w-5 text-emerald-400" />
                    <span>{result.recommendedOrderYards} yd³</span>
                    <span className="text-xs text-slate-300 font-sans font-normal">Ready-Mix Truck</span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    Rounded up to nearest 0.25 yd³ for ready-mix dispatch.
                  </p>
                </div>

                {/* Material Takeoff Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Material Takeoff
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Ready-Mix Truck:</span>
                    <span className="font-bold text-amber-400">{result.recommendedOrderYards} yd³</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">80-lb Premix Bags:</span>
                    <span className="font-bold text-white">
                      {result.bagEstimates.find((b) => b.bagWeightLbs === 80)?.bagsRequired || Math.ceil(result.recommendedOrderYards * 45)} bags
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">60-lb Premix Bags:</span>
                    <span className="font-bold text-white">
                      {result.bagEstimates.find((b) => b.bagWeightLbs === 60)?.bagsRequired || Math.ceil(result.recommendedOrderYards * 60)} bags
                    </span>
                  </div>
                </div>

                {/* Copy, Save & Print Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 no-print">
                  <button
                    type="button"
                    onClick={copySummaryToClipboard}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied Takeoff!" : "Copy Summary"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveConfiguration}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-[0.98] border ${
                      saved
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Saved on this device ✓</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 text-amber-400" />
                        <span>Save on This Device</span>
                      </>
                    )}
                  </button>

                  <PrintButton
                    toolSlug="concrete-calculator"
                    category="construction"
                    label="Print Worksheet"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer active:scale-[0.98]"
                  />
                </div>
              </div>

              {/* Progressive Formula Breakdown */}
              {result.steps.length > 0 && (
                <div className="border-t border-slate-800 bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setShowFormulas(!showFormulas)}
                    className="w-full px-5 py-2.5 text-[11px] font-mono font-bold text-slate-400 hover:text-slate-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>Calculation Methodology ({result.steps.length})</span>
                    {showFormulas ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {showFormulas && (
                    <div className="p-4 space-y-1.5 border-t border-slate-800 text-[11px] font-mono bg-slate-950/90">
                      {result.steps.map((s, i) => (
                        <div key={i} className="text-slate-300 flex justify-between gap-2">
                          <span className="truncate">{s.label}:</span>
                          <span className="text-amber-400 font-bold shrink-0">{s.result}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
