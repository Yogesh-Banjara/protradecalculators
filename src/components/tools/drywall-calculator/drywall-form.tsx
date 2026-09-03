"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  DrywallCostRates,
  DrywallProjectResult,
  DrywallRoomInput,
  DrywallSheetSize,
  DrywallThickness,
} from "@/types/drywall";
import {
  DRYWALL_SHEET_SIZES,
  DRYWALL_THICKNESSES,
} from "@/data/materials/drywall-types";
import { calculateDrywallProject } from "@/lib/calculations/drywall";
import { DrywallRoomRow } from "./room-row";
import { DrywallDiagram } from "./drywall-diagram";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Layers,
  AlertTriangle,
  Info,
  DollarSign,
  Paintbrush,
  ScrollText,
} from "lucide-react";

const DEFAULT_ROOM: DrywallRoomInput = {
  id: "room-1",
  name: "Living Area",
  lengthFt: 16,
  widthFt: 12,
  heightFt: 8,
  includeWalls: true,
  includeCeiling: true,
  openings: [
    {
      id: "op-1",
      name: "Entry Door",
      type: "door",
      widthFt: 3.0,
      heightFt: 6.833,
      count: 1,
    },
    {
      id: "op-2",
      name: "Window",
      type: "window",
      widthFt: 3.0,
      heightFt: 4.0,
      count: 1,
    },
  ],
};

const WASTE_PRESETS = [0, 5, 10, 15];

export function DrywallCalculatorForm() {
  const [rooms, setRooms] = useState<DrywallRoomInput[]>([DEFAULT_ROOM]);
  const [sheetSize, setSheetSize] = useState<DrywallSheetSize>("4x8");
  const [thickness, setThickness] = useState<DrywallThickness>("1/2");
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [isCustomWaste, setIsCustomWaste] = useState<boolean>(false);
  const [customWasteInput, setCustomWasteInput] = useState<string>("10");

  // Optional Cost Estimator state
  const [isCostEnabled, setIsCostEnabled] = useState<boolean>(false);
  const [costRates, setCostRates] = useState<DrywallCostRates>({
    pricePerSheet: 14.5,
    pricePerTapeRoll: 8.5,
    pricePerCompoundBucket: 19.0,
    pricePerScrewBox: 12.5,
  });

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("drywall-calculator", "materials");
  }, []);

  // Compute live drywall takeoff
  const calculationResult: {
    result?: DrywallProjectResult;
    error?: string;
  } = useMemo(() => {
    try {
      const res = calculateDrywallProject({
        rooms,
        sheetSize,
        thickness,
        wastePercent,
        costRates: isCostEnabled ? costRates : undefined,
      });
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [rooms, sheetSize, thickness, wastePercent, isCostEnabled, costRates]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("drywall-calculator", "materials", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "sheets",
      });
    }
  }, [calculationResult.result]);

  const addRoom = () => {
    const nextIndex = rooms.length + 1;
    const newRoom: DrywallRoomInput = {
      id: `room-${Date.now()}`,
      name: `Room ${nextIndex}`,
      lengthFt: 14,
      widthFt: 10,
      heightFt: 8,
      includeWalls: true,
      includeCeiling: true,
      openings: [],
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (index: number, updated: DrywallRoomInput) => {
    const next = [...rooms];
    next[index] = updated;
    setRooms(next);
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setRooms([DEFAULT_ROOM]);
    setSheetSize("4x8");
    setThickness("1/2");
    setWastePercent(10);
    setIsCustomWaste(false);
    setCustomWasteInput("10");
    setIsCostEnabled(false);
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
      "DRYWALL & SHEET GOODS MATERIAL TAKEOFF",
      "======================================",
      `Drywall Specification: ${r.sheetSize} (${r.thickness}" Thickness)`,
      `Total Drywall Sheets Needed (with ${r.wastePercent}% waste): ${r.sheetsRequired} sheets (Exact: ${r.exactSheets})`,
      `Surface Coverage: ${r.netAreaSqFt} sq ft net (${r.adjustedAreaSqFt} sq ft adjusted)`,
      `Joint Compound (Mud): ${r.accessories.compoundBuckets4_5Gal} buckets (4.5 gal) / ${r.accessories.jointCompoundGallons} gal`,
      `Joint Tape: ${r.accessories.tapeRolls500Ft} rolls (500 ft) / ${r.accessories.jointTapeLinearFt} linear ft`,
      `Drywall Screws: ${r.accessories.screwBoxes5Lb} boxes (5 lb / 1,500 ct) / approx ${r.accessories.drywallScrewsCount} screws`,
      ...(r.costEstimate
        ? [`Estimated Material Cost: $${r.costEstimate.totalEstimatedCost.toFixed(2)}`]
        : []),
      "",
      "ROOM BREAKDOWN:",
      ...r.rooms.map(
        (rm, i) =>
          ` ${i + 1}. ${rm.name} (${rm.lengthFt}'L x ${rm.widthFt}'W x ${rm.heightFt}'H): ${rm.netAreaSqFt} sq ft net (${rm.openings.length} openings)`
      ),
      "",
      "Reference: Standard Sheet Goods & Joint Compound Takeoff Schedules",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("drywall-calculator", "materials", "projectSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print Header */}
      <JobsitePrintHeader
        title="Drywall & Sheet Goods Takeoff Worksheet"
        category="Materials & Takeoff"
      />

      {/* Main Form Section */}
      <div className="space-y-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-400" />
              Room Dimensions &amp; Opening Deductions
            </h2>
            <p className="text-xs text-slate-300">
              Add rooms or individual wall runs with custom dimensions, ceiling toggles, and door/window deductions.
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
              onClick={addRoom}
              className="bg-amber-500 text-slate-950 font-bold"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Room
            </Button>
          </div>
        </div>

        {/* Rooms List */}
        <div className="space-y-4">
          {rooms.map((room, idx) => (
            <DrywallRoomRow
              key={room.id}
              room={room}
              index={idx}
              canRemove={rooms.length > 1}
              onChange={(updated) => updateRoom(idx, updated)}
              onRemove={() => removeRoom(idx)}
            />
          ))}
        </div>

        {/* Sheet Specification & Waste Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sheet Size, Thickness & Waste Factor */}
          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-600" />
                1. Sheet Size, Thickness &amp; Waste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="drywall-sheet-sz" className="text-xs font-bold text-slate-700 block">
                    Sheet Dimensions
                  </label>
                  <select
                    id="drywall-sheet-sz"
                    value={sheetSize}
                    onChange={(e) => setSheetSize(e.target.value as DrywallSheetSize)}
                    aria-label="Drywall Sheet Dimensions"
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {DRYWALL_SHEET_SIZES.map((sz) => (
                      <option key={sz.size} value={sz.size}>
                        {sz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="drywall-thick" className="text-xs font-bold text-slate-700 block">
                    Sheet Thickness
                  </label>
                  <select
                    id="drywall-thick"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value as DrywallThickness)}
                    aria-label="Drywall Thickness"
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {DRYWALL_THICKNESSES.map((th) => (
                      <option key={th.thickness} value={th.thickness}>
                        {th.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Cutting &amp; Edge Waste Allowance
                  </span>
                  <span className="text-xs font-bold text-amber-700 font-mono">
                    +{wastePercent}% Waste
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {WASTE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleWastePresetChange(preset)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                        !isCustomWaste && wastePercent === preset
                          ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomWaste(true)}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                      isCustomWaste
                        ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
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
                        className="h-7 w-full rounded border border-slate-300 px-1.5 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Cost Estimator */}
          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  2. Optional Material Cost Estimator
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setIsCostEnabled(!isCostEnabled)}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  {isCostEnabled ? "Disable Pricing" : "Enable Pricing"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {isCostEnabled ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label htmlFor="cost-sheet" className="text-[11px] font-bold text-slate-600 block mb-1">
                      $/Sheet
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                      <input
                        id="cost-sheet"
                        type="number"
                        min="0"
                        step="0.5"
                        value={costRates.pricePerSheet ?? 14.5}
                        onChange={(e) =>
                          setCostRates({
                            ...costRates,
                            pricePerSheet: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded border border-slate-300 pl-5 pr-1 py-1 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cost-mud" className="text-[11px] font-bold text-slate-600 block mb-1">
                      $/Bucket (Mud)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                      <input
                        id="cost-mud"
                        type="number"
                        min="0"
                        step="0.5"
                        value={costRates.pricePerCompoundBucket ?? 19.0}
                        onChange={(e) =>
                          setCostRates({
                            ...costRates,
                            pricePerCompoundBucket: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded border border-slate-300 pl-5 pr-1 py-1 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cost-tape" className="text-[11px] font-bold text-slate-600 block mb-1">
                      $/Roll (500&apos; Tape)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                      <input
                        id="cost-tape"
                        type="number"
                        min="0"
                        step="0.5"
                        value={costRates.pricePerTapeRoll ?? 8.5}
                        onChange={(e) =>
                          setCostRates({
                            ...costRates,
                            pricePerTapeRoll: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded border border-slate-300 pl-5 pr-1 py-1 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cost-screws" className="text-[11px] font-bold text-slate-600 block mb-1">
                      $/Box (5lb Screws)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                      <input
                        id="cost-screws"
                        type="number"
                        min="0"
                        step="0.5"
                        value={costRates.pricePerScrewBox ?? 12.5}
                        onChange={(e) =>
                          setCostRates({
                            ...costRates,
                            pricePerScrewBox: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded border border-slate-300 pl-5 pr-1 py-1 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enable pricing to calculate instant material costs for drywall boards, joint compound buckets, paper tape rolls, and screw boxes.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check all room dimensions.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Interactive Drywall Panel Layout Schematic */}
          <DrywallDiagram
            rooms={rooms}
            result={result}
            sheetSize={sheetSize}
            wastePercent={wastePercent}
          />

          {/* Primary Hero Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Drywall &amp; Finishing Material Takeoff
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.rooms.length} {result.rooms.length === 1 ? "Room" : "Rooms"} &bull; {result.sheetSize} ({result.thickness}&quot;)
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Sheet Count Hero */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Recommended Drywall Sheet Purchase (includes {result.wastePercent}% waste):
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight">
                    {result.sheetsRequired}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    Sheets ({result.sheetSize} &bull; {result.sheetAreaSqFt} sq ft/sheet)
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Net surface area: <span className="text-slate-200 font-mono font-semibold">{result.netAreaSqFt} sq ft</span> &bull; Adjusted with waste: <span className="text-amber-400 font-mono font-semibold">{result.adjustedAreaSqFt} sq ft</span> (Exact minimum: {result.exactSheets} sheets).
                </p>
              </div>

              {/* Finishing Accessories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-4 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Joint Compound (Mud)</span>
                    <Paintbrush className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-mono block">
                    {result.accessories.compoundBuckets4_5Gal}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      Buckets (4.5 gal)
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    ~{result.accessories.jointCompoundGallons} gallons premixed mud
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Drywall Joint Tape</span>
                    <ScrollText className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-mono block">
                    {result.accessories.tapeRolls500Ft}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      Rolls (500 ft)
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    ~{result.accessories.jointTapeLinearFt} linear ft (or {result.accessories.tapeRolls250Ft} x 250&apos; rolls)
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Drywall Screws</span>
                    <Layers className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-mono block">
                    {result.accessories.screwBoxes5Lb}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      Boxes (5 lb / 1,500 ct)
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    ~{result.accessories.drywallScrewsCount} screws ({result.accessories.screwPounds} lbs)
                  </span>
                </div>
              </div>

              {/* Estimated Cost Callout if enabled */}
              {result.costEstimate && (
                <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                      Estimated Drywall Material Cost:
                    </span>
                    <span className="text-slate-300">
                      Sheets: ${result.costEstimate.sheetsCost.toFixed(2)} &bull; Mud: ${result.costEstimate.compoundCost.toFixed(2)} &bull; Tape: ${result.costEstimate.tapeCost.toFixed(2)} &bull; Screws: ${result.costEstimate.screwsCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    ${result.costEstimate.totalEstimatedCost.toFixed(2)}
                  </div>
                </div>
              )}

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
                    toolSlug="drywall-calculator"
                    category="materials"
                    label="Print Drywall Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  Area: {result.adjustedAreaSqFt} sq ft adjusted
                </span>
              </div>
            </div>
          </div>

          {/* Section Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-600" />
              Itemized Room Surface Breakdown
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead className="text-right">Gross Walls</TableHead>
                  <TableHead className="text-right">Ceiling</TableHead>
                  <TableHead className="text-right">Openings</TableHead>
                  <TableHead className="text-right">Net Area</TableHead>
                  <TableHead className="text-right">Est. Sheets ({result.sheetSize})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rooms.map((rm) => {
                  const roomSheets = Math.ceil(
                    (rm.netAreaSqFt * (1 + result.wastePercent / 100)) / result.sheetAreaSqFt
                  );
                  return (
                    <TableRow key={rm.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {rm.name}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono">
                        {rm.lengthFt}&apos;L × {rm.widthFt}&apos;W × {rm.heightFt}&apos;H
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700">
                        {rm.grossWallAreaSqFt.toFixed(1)} sq ft
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700">
                        {rm.ceilingAreaSqFt.toFixed(1)} sq ft
                      </TableCell>
                      <TableCell className="text-right font-mono text-amber-800 font-medium">
                        -{rm.openingsAreaSqFt.toFixed(1)} sq ft ({rm.openings.length})
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-slate-900">
                        {rm.netAreaSqFt.toFixed(1)} sq ft
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-amber-800">
                        {roomSheets} sheets
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Project Totals ({result.wastePercent}% waste applied)</TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-900">
                    {result.adjustedAreaSqFt} sq ft
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-900">
                    {result.sheetsRequired} sheets
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Safety & Material Takeoff Scope Callout */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-950 leading-relaxed">
            <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Material Quantity Takeoff Disclaimer:</strong> This tool calculates material quantities (boards, compound, tape, and screws) based on geometric surface area plus cutting waste. It does not certify building code fire-resistance ratings (e.g. Type X drywall assemblies for attached garages or commercial partitions), acoustic STC ratings, or moisture-barrier requirements (e.g. green board or cement backer boards in wet shower enclosures). Always consult local building codes and architectural specifications.
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
