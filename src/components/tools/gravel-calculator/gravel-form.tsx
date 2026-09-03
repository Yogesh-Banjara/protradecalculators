"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  AdjustmentMode,
  AggregateMaterialId,
  AggregateProjectResult,
  AggregateSectionInput,
} from "@/types/aggregate";
import {
  getAllAggregateMaterials,
  getAggregateMaterial,
} from "@/data/materials/aggregate-types";
import { calculateAggregateProject } from "@/lib/calculations/aggregate";
import { SectionRow } from "./section-row";
import { GravelDiagram } from "./gravel-diagram";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from "@/components/ui/table";
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
  Package,
  Layers,
  AlertTriangle,
  Info,
  Scale,
} from "lucide-react";

const DEFAULT_SECTION: AggregateSectionInput = {
  id: "sec-1",
  name: "Main Driveway",
  shape: "rectangular",
  quantity: 1,
  length: 50,
  width: 12,
  depth: 4,
  lengthUnit: "foot",
  depthUnit: "inch",
};

const TRUCK_PRESETS = [
  { label: "10 Tons (Single-Axle)", value: 10 },
  { label: "15 Tons (Tandem-Axle)", value: 15 },
  { label: "20 Tons (Tri-Axle / End Dump)", value: 20 },
];

const ADJUSTMENT_PRESETS = [0, 5, 8, 10, 12, 15];

export function GravelCalculatorForm() {
  const materials = useMemo(() => getAllAggregateMaterials(), []);

  const [sections, setSections] = useState<AggregateSectionInput[]>([DEFAULT_SECTION]);
  const [materialId, setMaterialId] = useState<AggregateMaterialId>("gravel");
  const [isCustomDensity, setIsCustomDensity] = useState<boolean>(false);
  const [customDensityInput, setCustomDensityInput] = useState<string>("100");
  const [adjustmentMode, setAdjustmentMode] = useState<AdjustmentMode>("waste");
  const [adjustmentPercent, setAdjustmentPercent] = useState<number>(10);
  const [isCustomAdjustment, setIsCustomAdjustment] = useState<boolean>(false);
  const [customAdjustmentInput, setCustomAdjustmentInput] = useState<string>("10");
  const [truckCapacityTons, setTruckCapacityTons] = useState<number>(15);
  const [isCustomTruck, setIsCustomTruck] = useState<boolean>(false);
  const [customTruckInput, setCustomTruckInput] = useState<string>("15");
  const [copied, setCopied] = useState<boolean>(false);

  // Track initial interaction
  useEffect(() => {
    trackCalculatorStarted("gravel-calculator", "materials");
  }, []);

  const selectedMaterial = useMemo(() => getAggregateMaterial(materialId), [materialId]);

  // When material changes, update default adjustment mode & percent if not manually customized
  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value as AggregateMaterialId;
    setMaterialId(newId);
    if (newId === "custom") {
      setIsCustomDensity(true);
    } else {
      const mat = getAggregateMaterial(newId);
      setAdjustmentMode(mat.defaultAdjustmentMode);
      setAdjustmentPercent(mat.defaultAdjustmentPercent);
      setCustomAdjustmentInput(mat.defaultAdjustmentPercent.toString());
      setCustomDensityInput(mat.densityLbsPerCuFt.toString());
    }
  };

  // Compute live aggregate project result
  const calculationResult: {
    result?: AggregateProjectResult;
    error?: string;
  } = useMemo(() => {
    try {
      const parsedCustomDensity = isCustomDensity
        ? parseFloat(customDensityInput) || 100
        : undefined;

      const res = calculateAggregateProject({
        sections,
        materialId,
        customDensityLbsPerCuFt: parsedCustomDensity,
        adjustmentMode,
        adjustmentPercent: adjustmentMode === "none" ? 0 : adjustmentPercent,
        truckCapacityTons: isCustomTruck
          ? parseFloat(customTruckInput) || 15
          : truckCapacityTons,
      });
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    sections,
    materialId,
    isCustomDensity,
    customDensityInput,
    adjustmentMode,
    adjustmentPercent,
    isCustomTruck,
    customTruckInput,
    truckCapacityTons,
  ]);

  // Track calculation results
  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("gravel-calculator", "materials", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "ton",
      });
    }
  }, [calculationResult.result]);

  const addSection = () => {
    const nextIndex = sections.length + 1;
    const newSection: AggregateSectionInput = {
      id: `sec-${Date.now()}`,
      name: `Section ${nextIndex}`,
      shape: "rectangular",
      quantity: 1,
      length: 20,
      width: 10,
      depth: 3,
      lengthUnit: "foot",
      depthUnit: "inch",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updated: AggregateSectionInput) => {
    const next = [...sections];
    next[index] = updated;
    setSections(next);
  };

  const removeSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setSections([DEFAULT_SECTION]);
    setMaterialId("gravel");
    setIsCustomDensity(false);
    setCustomDensityInput("100");
    setAdjustmentMode("waste");
    setAdjustmentPercent(10);
    setIsCustomAdjustment(false);
    setCustomAdjustmentInput("10");
    setTruckCapacityTons(15);
    setIsCustomTruck(false);
    setCustomTruckInput("15");
  };

  const handleAdjustmentPresetChange = (preset: number) => {
    setIsCustomAdjustment(false);
    setAdjustmentPercent(preset);
  };

  const handleCustomAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAdjustmentInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setAdjustmentPercent(num);
    }
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const r = calculationResult.result;

    const summaryLines = [
      "GRAVEL & AGGREGATE ESTIMATE TAKEOFF",
      "==================================",
      `Material: ${selectedMaterial.name} (${r.effectiveDensityLbsPerCuFt} lbs/cu ft / ${r.effectiveTonsPerCuYd} tons/yd³)`,
      `Total Weight: ${r.totalTons} short tons (${r.totalWeightLbs.toLocaleString()} lbs)`,
      `Order Volume: ${r.adjustedVolumeCuYd} cu yd (${r.adjustedVolumeCuFt} cu ft / ${r.adjustedVolumeCuMeters} m³)`,
      `Estimated Truckloads: ${r.truckloadEstimate.loadsRequired} loads (${r.truckloadEstimate.truckType})`,
      `Adjustment Applied: +${r.adjustmentPercent}% (${r.adjustmentMode.toUpperCase()})`,
      `Net Volume (No Adjustment): ${r.netVolumeCuYd} cu yd (${r.netVolumeCuFt} cu ft)`,
      "",
      "SECTION DETAILS:",
      ...r.sections.map(
        (s, i) =>
          ` ${i + 1}. ${s.name} (${s.shape}): Qty ${s.quantity} -> ${s.volumeCuYd} cu yd (${s.volumeCuFt} cu ft)`
      ),
      "",
      "OPTIONAL BAGGED TAKEOFF:",
      ...r.bagEstimates.map(
        (b) =>
          ` - ${b.bagWeightLbs} lb bags: ${b.bagsRequired} bags (${b.exactBags.toFixed(1)} exact)`
      ),
      "",
      "Reference: Bulk Aggregate Density & Compaction Schedules",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("gravel-calculator", "materials", "projectSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print-only jobsite takeoff header */}
      <JobsitePrintHeader
        title="Gravel & Aggregate Takeoff Worksheet"
        category="Materials & Takeoff"
      />

      {/* Material Selection & Density Settings Card */}
      <Card className="border-amber-200/80 bg-amber-50/20">
        <CardHeader className="py-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <Scale className="h-4 w-4 text-amber-700" />
            Material &amp; Density Reference
          </div>
          <CardTitle className="text-base font-bold text-slate-900">
            Select Aggregate Material Type
          </CardTitle>
          <CardDescription className="text-xs">
            Density directly dictates tons per cubic yard. Verify with your local quarry or supplier scale ticket.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="mat-select" className="text-xs font-bold text-slate-700 block">
                Material Grade / Type
              </label>
              <select
                id="mat-select"
                value={materialId}
                onChange={handleMaterialChange}
                aria-label="Material Type"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (~{m.densityLbsPerCuFt} lb/cu ft &bull; {m.tonsPerCuYd} tons/yd³)
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                {selectedMaterial.sourceNote}
              </p>
            </div>

            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <label htmlFor="density-override" className="text-xs font-bold text-slate-800">
                  Density Override
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomDensity(!isCustomDensity)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline"
                >
                  {isCustomDensity ? "Use Preset" : "Custom Density"}
                </button>
              </div>

              {isCustomDensity ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      id="density-override"
                      type="number"
                      min="10"
                      max="300"
                      step="any"
                      value={customDensityInput}
                      onChange={(e) => setCustomDensityInput(e.target.value)}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">lb/cu ft</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    = {((parseFloat(customDensityInput) || 100) * 0.0135).toFixed(2)} tons/yd³
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {selectedMaterial.densityLbsPerCuFt}{" "}
                    <span className="text-xs font-sans font-medium text-slate-500">lb/cu ft</span>
                  </div>
                  <div className="text-xs font-semibold text-amber-800">
                    {selectedMaterial.tonsPerCuYd} tons / cu yd ({selectedMaterial.densityKgPerM3} kg/m³)
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Sections Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              Project Areas / Sections
            </h2>
            <p className="text-xs text-slate-300">
              Model driveways, walkways, parking pads, or round firepit rings. Volumes combine automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              className="text-slate-300 hover:text-white border-slate-700 bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={addSection}
              className="bg-amber-500 text-slate-950 font-bold"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Section Rows List */}
        <div className="space-y-4">
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

        {/* Adjustment & Compaction / Waste Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compaction / Waste Mode Selector */}
          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                1. Adjustment Mode (Compaction vs Waste)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentMode("compaction")}
                  className={`p-2.5 rounded-md text-xs font-bold text-left transition-colors border ${
                    adjustmentMode === "compaction"
                      ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <span className="block font-black">Compaction Allowance</span>
                  <span className="text-[10px] font-normal block opacity-80">
                    Volume shrinkage when rolled (Road base, Crusher run)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentMode("waste")}
                  className={`p-2.5 rounded-md text-xs font-bold text-left transition-colors border ${
                    adjustmentMode === "waste"
                      ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <span className="block font-black">Waste &amp; Spillage</span>
                  <span className="text-[10px] font-normal block opacity-80">
                    Edge runoff &amp; subgrade unevenness (Clean stone, Pea gravel)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentMode("combined")}
                  className={`p-2.5 rounded-md text-xs font-bold text-left transition-colors border ${
                    adjustmentMode === "combined"
                      ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <span className="block font-black">Combined (Both)</span>
                  <span className="text-[10px] font-normal block opacity-80">
                    Rough terrain with mechanical rolling
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentMode("none")}
                  className={`p-2.5 rounded-md text-xs font-bold text-left transition-colors border ${
                    adjustmentMode === "none"
                      ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                  }`}
                >
                  <span className="block font-black">No Adjustment (0%)</span>
                  <span className="text-[10px] font-normal block opacity-80">
                    Exact geometric volume
                  </span>
                </button>
              </div>

              {adjustmentMode !== "none" && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600 mr-1">Percentage:</span>
                  {ADJUSTMENT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAdjustmentPresetChange(preset)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                        !isCustomAdjustment && adjustmentPercent === preset
                          ? "bg-amber-500 text-slate-950 border-amber-600"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomAdjustment(true)}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                      isCustomAdjustment
                        ? "bg-amber-500 text-slate-950 border-amber-600"
                        : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                    }`}
                  >
                    Custom
                  </button>
                  {isCustomAdjustment && (
                    <div className="flex items-center gap-1 w-20">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={customAdjustmentInput}
                        onChange={handleCustomAdjustmentChange}
                        className="h-7 w-full rounded border border-slate-300 px-1.5 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dump Truck Capacity Sizing */}
          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                2. Dump Truck Capacity Sizing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                {TRUCK_PRESETS.map((truck) => (
                  <label
                    key={truck.value}
                    className={`flex items-center justify-between p-2.5 rounded-md border text-xs font-semibold cursor-pointer transition-colors ${
                      !isCustomTruck && truckCapacityTons === truck.value
                        ? "bg-slate-900 text-amber-400 border-slate-900"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="truck-cap"
                        checked={!isCustomTruck && truckCapacityTons === truck.value}
                        onChange={() => {
                          setIsCustomTruck(false);
                          setTruckCapacityTons(truck.value);
                        }}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{truck.label}</span>
                    </div>
                    <span className="text-[11px] font-mono opacity-80">
                      ~{(truck.value / 1.35).toFixed(1)} yd³ capacity
                    </span>
                  </label>
                ))}

                <label
                  className={`flex items-center justify-between p-2.5 rounded-md border text-xs font-semibold cursor-pointer transition-colors ${
                    isCustomTruck
                      ? "bg-slate-900 text-amber-400 border-slate-900"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="truck-cap"
                      checked={isCustomTruck}
                      onChange={() => setIsCustomTruck(true)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Custom Truck Capacity</span>
                  </div>
                  {isCustomTruck && (
                    <div className="flex items-center gap-1 w-24">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={customTruckInput}
                        onChange={(e) => setCustomTruckInput(e.target.value)}
                        className="h-6 w-full rounded border border-slate-600 bg-slate-800 text-amber-300 px-1 text-xs text-center font-bold focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400">tons</span>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calculation Error Alert */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check all dimension values.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Interactive Aggregate Tonnage Schematic */}
          <GravelDiagram
            sections={sections}
            result={result}
            materialName={selectedMaterial.name}
          />

          {/* Primary Hero Takeoff Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Total Aggregate &amp; Tonnage Estimate
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedMaterial.name} ({result.effectiveDensityLbsPerCuFt} lb/cu ft)
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Tonnage Hero Readout */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Total Estimated Material Weight (with {result.adjustmentPercent}% {result.adjustmentMode} adjustment):
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight">
                    {result.totalTons.toFixed(2)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    Short Tons (US)
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Total weight: <span className="text-slate-200 font-mono font-semibold">{result.totalWeightLbs.toLocaleString()} lbs</span> &bull; Required Order Volume: <span className="text-slate-200 font-mono font-semibold">{result.adjustedVolumeCuYd} cu yd</span> ({result.adjustedVolumeCuFt} cu ft / {result.adjustedVolumeCuMeters} m³).
                </p>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Truckloads Needed</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {result.truckloadEstimate.loadsRequired}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      ({result.truckloadEstimate.exactLoads} exact)
                    </span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Cubic Yards</span>
                  <span className="text-lg font-bold text-slate-100 font-mono">
                    {result.adjustedVolumeCuYd} <span className="text-xs font-sans text-slate-400">cu yd</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Cubic Feet</span>
                  <span className="text-lg font-bold text-slate-100 font-mono">
                    {result.adjustedVolumeCuFt} <span className="text-xs font-sans text-slate-400">cu ft</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Net Volume (0% Adj)</span>
                  <span className="text-lg font-bold text-slate-300 font-mono">
                    {result.netVolumeCuYd} <span className="text-xs font-sans text-slate-400">cu yd</span>
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySummaryToClipboard}
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400 mr-1.5" />
                        Copied Takeoff!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy Estimate
                      </>
                    )}
                  </Button>

                  <PrintButton
                    toolSlug="gravel-calculator"
                    category="materials"
                    label="Print Takeoff Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {result.truckloadEstimate.truckType}
                </span>
              </div>
            </div>
          </div>

          {/* Section Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-600" />
              Itemized Section Takeoff Breakdown
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section Name</TableHead>
                  <TableHead>Shape</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead className="text-right">Volume (cu ft)</TableHead>
                  <TableHead className="text-right">Volume (cu yd)</TableHead>
                  <TableHead className="text-right">Volume (m³)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.sections.map((sec) => (
                  <TableRow key={sec.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {sec.name}
                    </TableCell>
                    <TableCell className="text-xs capitalize text-slate-600">
                      {sec.shape}
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium">
                      {sec.quantity}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {sec.volumeCuFt.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-amber-700">
                      {sec.volumeCuYd.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-500">
                      {sec.volumeCuMeters.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Net Volume (No Adjustment)</TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {result.netVolumeCuFt.toFixed(2)} cu ft
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-800">
                    {result.netVolumeCuYd.toFixed(2)} cu yd
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {result.netVolumeCuMeters.toFixed(2)} m³
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Optional Bagged Material Takeoff Cards */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-600" />
                Dry Bagged Equivalents (Optional Retail Bags)
              </h3>
              <span className="text-xs text-slate-500">
                For small path repairs, garden borders, or DIY projects ({result.totalWeightLbs.toLocaleString()} lbs total)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {result.bagEstimates.map((bag) => (
                <div
                  key={bag.bagWeightLbs}
                  className="rounded-lg border border-slate-200 bg-white p-4 text-center space-y-1 shadow-sm hover:border-amber-400 transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block">
                    {bag.bagWeightLbs} lb Bags
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    {bag.bagsRequired}
                  </div>
                  <span className="text-xs font-semibold text-amber-700 block">
                    {bag.exactBags} bags exact
                  </span>
                  <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-100">
                    Surplus: {bag.surplusLbs.toFixed(1)} lbs
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Bulk vs. Bagged Note:</strong> Ordering bulk material delivered by dump truck is almost always 60%–80% cheaper per ton than purchasing individual 50 lb retail bags for projects exceeding 1 ton (approx. 40 fifty-pound bags).
              </span>
            </div>
          </div>

          {/* Mathematical Step-by-Step Breakdown */}
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
