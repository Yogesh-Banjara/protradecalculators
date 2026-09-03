"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  AirflowInputMode,
  DuctMaterial,
  DuctSizingInput,
  DuctSizingResult,
  RoomAirflowEntry,
  SizingMethod,
} from "@/types/duct";
import {
  DUCT_MATERIAL_REGISTRY,
  STANDARD_RECTANGULAR_HEIGHTS,
} from "@/data/references/duct-types";
import { calculateDuctSizingProject } from "@/lib/calculations/duct";
import { DuctDiagram } from "./duct-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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
  Sliders,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Wind,
  Plus,
  Trash2,
  Maximize2,
} from "lucide-react";

const PRESETS = [
  {
    label: "2.0-Ton System (800 CFM)",
    mode: "tonnage" as AirflowInputMode,
    tons: 2.0,
    cfmPerTon: 400,
    directCfm: 800,
    material: "sheet_metal" as DuctMaterial,
    method: "equal_friction" as SizingMethod,
    friction: 0.08,
    height: 8,
  },
  {
    label: "3.0-Ton System (1,200 CFM)",
    mode: "tonnage" as AirflowInputMode,
    tons: 3.0,
    cfmPerTon: 400,
    directCfm: 1200,
    material: "sheet_metal" as DuctMaterial,
    method: "equal_friction" as SizingMethod,
    friction: 0.08,
    height: 8,
  },
  {
    label: "4.0-Ton System (1,600 CFM)",
    mode: "tonnage" as AirflowInputMode,
    tons: 4.0,
    cfmPerTon: 400,
    directCfm: 1600,
    material: "sheet_metal" as DuctMaterial,
    method: "equal_friction" as SizingMethod,
    friction: 0.08,
    height: 10,
  },
  {
    label: "Flex Duct Attic Run (600 CFM)",
    mode: "direct_cfm" as AirflowInputMode,
    tons: 1.5,
    cfmPerTon: 400,
    directCfm: 600,
    material: "flexible_duct" as DuctMaterial,
    method: "equal_friction" as SizingMethod,
    friction: 0.05,
    height: 8,
  },
  {
    label: "Quiet Velocity Design (700 FPM)",
    mode: "direct_cfm" as AirflowInputMode,
    tons: 2.5,
    cfmPerTon: 400,
    directCfm: 1000,
    material: "sheet_metal" as DuctMaterial,
    method: "velocity_reduction" as SizingMethod,
    friction: 0.08,
    height: 8,
  },
];

const INITIAL_ROOMS: RoomAirflowEntry[] = [
  { id: "r-1", roomName: "Living Room / Great Room", targetCfm: 350 },
  { id: "r-2", roomName: "Primary Bedroom Suite", targetCfm: 250 },
  { id: "r-3", roomName: "Bedroom 2", targetCfm: 150 },
  { id: "r-4", roomName: "Kitchen / Dining", targetCfm: 250 },
  { id: "r-5", roomName: "Bathroom / Hall", targetCfm: 75 },
];

export function DuctCalculatorForm() {
  const [inputMode, setInputMode] = useState<AirflowInputMode>("direct_cfm");
  const [targetCfm, setTargetCfm] = useState<number>(1200);
  const [coolingTons, setCoolingTons] = useState<number>(3.0);
  const [cfmPerTon, setCfmPerTon] = useState<number>(400);
  const [rooms, setRooms] = useState<RoomAirflowEntry[]>(INITIAL_ROOMS);

  const [ductMaterial, setDuctMaterial] = useState<DuctMaterial>("sheet_metal");
  const [sizingMethod, setSizingMethod] = useState<SizingMethod>("equal_friction");
  const [frictionRateInWgPer100Ft, setFrictionRateInWgPer100Ft] = useState<number>(0.08);
  const [targetVelocityFpm, setTargetVelocityFpm] = useState<number>(700);
  const [fixedRectangularHeightInches, setFixedRectangularHeightInches] = useState<number>(8);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("duct-sizing-calculator", "hvac");
  }, []);

  const calculationResult: {
    result?: DuctSizingResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: DuctSizingInput = {
        inputMode,
        targetCfm,
        coolingTons,
        cfmPerTon,
        rooms,
        ductMaterial,
        sizingMethod,
        frictionRateInWgPer100Ft,
        targetVelocityFpm,
        fixedRectangularHeightInches,
      };
      const res = calculateDuctSizingProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    inputMode,
    targetCfm,
    coolingTons,
    cfmPerTon,
    rooms,
    ductMaterial,
    sizingMethod,
    frictionRateInWgPer100Ft,
    targetVelocityFpm,
    fixedRectangularHeightInches,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("duct-sizing-calculator", "hvac", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "CFM",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    setInputMode("direct_cfm");
    setTargetCfm(1200);
    setCoolingTons(3.0);
    setCfmPerTon(400);
    setRooms(INITIAL_ROOMS);
    setDuctMaterial("sheet_metal");
    setSizingMethod("equal_friction");
    setFrictionRateInWgPer100Ft(0.08);
    setTargetVelocityFpm(700);
    setFixedRectangularHeightInches(8);
    setShowAdvanced(false);
  };

  const addRoom = () => {
    const newId = `r-${Date.now()}`;
    setRooms([...rooms, { id: newId, roomName: "New Room Branch", targetCfm: 150 }]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const updateRoom = (id: string, field: keyof RoomAirflowEntry, val: string | number) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const res = calculationResult.result;

    const summaryLines = [
      "HVAC DUCT SIZING & AIRFLOW TAKEOFF",
      "==================================",
      `Total Airflow: ${res.totalCfm} CFM (${res.sizingMethod === "equal_friction" ? "Equal Friction: " + res.frictionRateInWgPer100Ft + " in. w.g." : "Velocity Method: " + res.targetVelocityFpm + " FPM"})`,
      `Duct Material: ${DUCT_MATERIAL_REGISTRY[res.ductMaterial].name}`,
      "",
      "MAIN SUPPLY TRUNK SIZING:",
      `  • Recommended Round Duct: ${res.mainTrunk.recommendedStandardDiameterInches}" Ø (${res.mainTrunk.theoreticalDiameterInches}" exact) @ ${res.mainTrunk.actualRoundVelocityFpm} FPM`,
      `  • Rectangular Equivalent: ${res.mainTrunk.rectangularWidthInches}" W × ${res.mainTrunk.rectangularHeightInches}" H (${res.mainTrunk.rectangularAreaSqIn} sq in) @ ${res.mainTrunk.actualRectangularVelocityFpm} FPM`,
      `  • Aspect Ratio: ${res.mainTrunk.rectangularAspectRatio}:1`,
      `  • Friction Loss Rate: ${res.mainTrunk.roundFrictionLossInWgPer100Ft} in. w.g. per 100 ft`,
      ...(res.branchRuns.length > 0
        ? [
            "",
            "BRANCH RUNOUT SCHEDULE:",
            ...res.branchRuns.map(
              (b) =>
                `  • ${b.roomName} (${b.cfm} CFM): ${b.recommendedStandardDiameterInches}" Round @ ${b.actualRoundVelocityFpm} FPM | ${b.rectangularWidthInches}" × ${b.rectangularHeightInches}" Rect`
            ),
          ]
        : []),
      "",
      "Reference: Equal Friction Airflow & Huebscher Duct Equivalence Formulations",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("duct-sizing-calculator", "hvac", "projectSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print Header */}
      <JobsitePrintHeader
        title="HVAC Duct Sizing & Airflow Schedule Worksheet"
        category="HVAC & Airflow"
      />

      {/* Main Form Section */}
      <div className="space-y-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wind className="h-5 w-5 text-amber-400" />
              Airflow &amp; Duct Dimension Parameters
            </h2>
            <p className="text-xs text-slate-300">
              Calculate round duct diameters and rectangular equivalents (Huebscher) using equal friction or velocity reduction.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="text-slate-300 hover:text-white border-slate-700 bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg border border-slate-200 bg-white text-xs">
          <span className="text-slate-500 font-bold mr-1">Quick Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setInputMode(preset.mode);
                setCoolingTons(preset.tons);
                setCfmPerTon(preset.cfmPerTon);
                setTargetCfm(preset.directCfm);
                setDuctMaterial(preset.material);
                setSizingMethod(preset.method);
                setFrictionRateInWgPer100Ft(preset.friction);
                setFixedRectangularHeightInches(preset.height);
              }}
              className="text-[11px] px-2 py-0.5 rounded border bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Mode Tab Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => setInputMode("direct_cfm")}
            className={`py-2 px-3 rounded transition-colors ${
              inputMode === "direct_cfm"
                ? "bg-slate-900 text-amber-400 font-bold shadow-sm"
                : "hover:bg-slate-200"
            }`}
          >
            1. Direct Airflow (CFM)
          </button>
          <button
            type="button"
            onClick={() => setInputMode("tonnage")}
            className={`py-2 px-3 rounded transition-colors ${
              inputMode === "tonnage"
                ? "bg-slate-900 text-amber-400 font-bold shadow-sm"
                : "hover:bg-slate-200"
            }`}
          >
            2. AC Tonnage (Tons)
          </button>
          <button
            type="button"
            onClick={() => setInputMode("room_schedule")}
            className={`py-2 px-3 rounded transition-colors ${
              inputMode === "room_schedule"
                ? "bg-slate-900 text-amber-400 font-bold shadow-sm"
                : "hover:bg-slate-200"
            }`}
          >
            3. Room Branch Schedule
          </button>
        </div>

        {/* Primary Controls Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          {/* Mode 1: Direct CFM */}
          {inputMode === "direct_cfm" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField id="direct-cfm" label="Total System Airflow (CFM)" required>
                <Input
                  id="direct-cfm"
                  type="number"
                  min="50"
                  max="10000"
                  step="25"
                  value={targetCfm || ""}
                  onChange={(e) => setTargetCfm(parseFloat(e.target.value) || 0)}
                  placeholder="1200"
                />
              </FormField>

              <div>
                <label htmlFor="material-select" className="text-xs font-bold text-slate-700 block mb-1">
                  Duct Material
                </label>
                <select
                  id="material-select"
                  value={ductMaterial}
                  onChange={(e) => setDuctMaterial(e.target.value as DuctMaterial)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="sheet_metal">Galvanized Sheet Metal (Smooth)</option>
                  <option value="flexible_duct">Wire-Helix Flexible Duct (+15% Size Penalty)</option>
                  <option value="duct_board">Duct Board (Fibrous Glass)</option>
                </select>
              </div>

              <div>
                <label htmlFor="method-select" className="text-xs font-bold text-slate-700 block mb-1">
                  Duct Sizing Method
                </label>
                <select
                  id="method-select"
                  value={sizingMethod}
                  onChange={(e) => setSizingMethod(e.target.value as SizingMethod)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="equal_friction">Equal Friction (0.08 in. w.g. standard)</option>
                  <option value="velocity_reduction">Velocity Limit (700 FPM standard)</option>
                </select>
              </div>
            </div>
          )}

          {/* Mode 2: Tonnage */}
          {inputMode === "tonnage" && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <FormField id="cooling-tons" label="Cooling Tonnage (Tons)" required>
                <select
                  id="cooling-tons"
                  value={coolingTons}
                  onChange={(e) => setCoolingTons(parseFloat(e.target.value))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value={1.5}>1.5 Tons (18,000 BTU)</option>
                  <option value={2.0}>2.0 Tons (24,000 BTU)</option>
                  <option value={2.5}>2.5 Tons (30,000 BTU)</option>
                  <option value={3.0}>3.0 Tons (36,000 BTU)</option>
                  <option value={3.5}>3.5 Tons (42,000 BTU)</option>
                  <option value={4.0}>4.0 Tons (48,000 BTU)</option>
                  <option value={5.0}>5.0 Tons (60,000 BTU)</option>
                </select>
              </FormField>

              <FormField id="cfm-per-ton" label="Airflow Factor (CFM/Ton)" required>
                <select
                  id="cfm-per-ton"
                  value={cfmPerTon}
                  onChange={(e) => setCfmPerTon(parseInt(e.target.value, 10))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value={350}>350 CFM/Ton (Humid / High Dehumidification)</option>
                  <option value={400}>400 CFM/Ton (Standard Residential Baseline)</option>
                  <option value={450}>450 CFM/Ton (Dry / Desert Climate Airflow)</option>
                </select>
              </FormField>

              <div>
                <label htmlFor="material-select-2" className="text-xs font-bold text-slate-700 block mb-1">
                  Duct Material
                </label>
                <select
                  id="material-select-2"
                  value={ductMaterial}
                  onChange={(e) => setDuctMaterial(e.target.value as DuctMaterial)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="sheet_metal">Galvanized Sheet Metal (Smooth)</option>
                  <option value="flexible_duct">Wire-Helix Flexible Duct</option>
                  <option value="duct_board">Duct Board (Fibrous Glass)</option>
                </select>
              </div>

              <div>
                <label htmlFor="method-select-2" className="text-xs font-bold text-slate-700 block mb-1">
                  Sizing Method
                </label>
                <select
                  id="method-select-2"
                  value={sizingMethod}
                  onChange={(e) => setSizingMethod(e.target.value as SizingMethod)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="equal_friction">Equal Friction (0.08 in. w.g.)</option>
                  <option value="velocity_reduction">Velocity Limit (700 FPM)</option>
                </select>
              </div>
            </div>
          )}

          {/* Mode 3: Room Schedule */}
          {inputMode === "room_schedule" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                  Room Airflow &amp; Branch Runout Schedule
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRoom}
                  className="text-xs text-slate-800 border-slate-300 bg-slate-50"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Room
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Room / Zone Name</th>
                      <th className="p-2.5 w-36">Airflow (CFM)</th>
                      <th className="p-2.5 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={room.roomName}
                            onChange={(e) => updateRoom(room.id, "roomName", e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="20"
                            max="2000"
                            step="10"
                            value={room.targetCfm || ""}
                            onChange={(e) =>
                              updateRoom(room.id, "targetCfm", parseInt(e.target.value, 10) || 0)
                            }
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeRoom(room.id)}
                            disabled={rooms.length <= 1}
                            aria-label="Remove Room Branch"
                            className={`p-1.5 rounded text-slate-400 hover:text-rose-600 transition-colors ${
                              rooms.length <= 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rectangular Depth & Advanced Disclosures */}
          <div className="pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label htmlFor="height-select" className="font-bold text-slate-700 block mb-1">
                  Fixed Rectangular Height Constraint (Joist Bay Depth)
                </label>
                <select
                  id="height-select"
                  value={fixedRectangularHeightInches}
                  onChange={(e) => setFixedRectangularHeightInches(parseInt(e.target.value, 10))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  {STANDARD_RECTANGULAR_HEIGHTS.map((h) => (
                    <option key={h} value={h}>
                      {h}&quot; Height (e.g. {h}&quot; floor joist space)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-6"
                >
                  <Sliders className="h-3.5 w-3.5 text-amber-600" />
                  {showAdvanced ? "Hide" : "Show"} Advanced Friction &amp; Velocity Settings
                  {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 mt-3 rounded bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <label htmlFor="friction-rate" className="font-bold text-slate-700 block mb-1">
                    Friction Loss Rate (in. w.g. per 100 ft)
                  </label>
                  <select
                    id="friction-rate"
                    value={frictionRateInWgPer100Ft}
                    onChange={(e) => setFrictionRateInWgPer100Ft(parseFloat(e.target.value))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value={0.05}>0.05 in. w.g. (Quiet / Low Static Resistance)</option>
                    <option value={0.08}>0.08 in. w.g. (Standard Residential Baseline)</option>
                    <option value={0.10}>0.10 in. w.g. (Commercial Main Trunk)</option>
                    <option value={0.15}>0.15 in. w.g. (High Static / Compact Run)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="target-velocity" className="font-bold text-slate-700 block mb-1">
                    Target Velocity (FPM for Velocity Method)
                  </label>
                  <input
                    id="target-velocity"
                    type="number"
                    min="300"
                    max="1500"
                    step="50"
                    value={targetVelocityFpm}
                    onChange={(e) => setTargetVelocityFpm(parseInt(e.target.value, 10) || 700)}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check your airflow values.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Primary Hero Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Maximize2 className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Recommended Duct Dimensions &amp; Air Velocity
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.totalCfm} CFM Total Airflow
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Round & Rectangular Sizes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Round Duct Hero */}
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                    Recommended Round Duct Size:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.mainTrunk.recommendedStandardDiameterInches}&quot;
                    </span>
                    <span className="text-lg text-slate-300 font-sans">
                      Diameter ({result.mainTrunk.theoreticalDiameterInches}&quot; exact)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Air velocity:{" "}
                    <span className="text-slate-100 font-mono font-bold">
                      {result.mainTrunk.actualRoundVelocityFpm} FPM
                    </span>{" "}
                    &bull; Cross-section:{" "}
                    <span className="text-slate-300 font-mono">
                      {result.mainTrunk.roundDuctAreaSqIn} sq in
                    </span>
                  </p>
                </div>

                {/* Rectangular Equivalent Hero */}
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-purple-400 font-bold block">
                    Rectangular Equivalent (Huebscher):
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-purple-400 font-mono tracking-tight">
                      {result.mainTrunk.rectangularWidthInches}&quot; &times; {result.mainTrunk.rectangularHeightInches}&quot;
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Air velocity:{" "}
                    <span className="text-slate-100 font-mono font-bold">
                      {result.mainTrunk.actualRectangularVelocityFpm} FPM
                    </span>{" "}
                    &bull; Aspect ratio:{" "}
                    <span className="text-purple-300 font-mono">
                      {result.mainTrunk.rectangularAspectRatio}:1
                    </span>
                  </p>
                </div>
              </div>

              {/* Specs Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Airflow</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {result.totalCfm}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">CFM</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Friction Drop Rate</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.mainTrunk.roundFrictionLossInWgPer100Ft}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">in. w.g./100&apos;</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Velocity Status</span>
                  <span
                    className={`text-sm font-bold block truncate uppercase ${
                      result.mainTrunk.velocityStatus === "optimal" || result.mainTrunk.velocityStatus === "quiet"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {result.mainTrunk.velocityStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Duct Material</span>
                  <span className="text-xs font-bold text-slate-300 block truncate">
                    {DUCT_MATERIAL_REGISTRY[result.ductMaterial].name.split("(")[0]}
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
                        Copy Summary
                      </>
                    )}
                  </Button>

                  <PrintButton
                    toolSlug="duct-sizing-calculator"
                    category="hvac"
                    label="Print Duct Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  ASHRAE Equal Friction &amp; Huebscher Formula Calibrated
                </span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Duct Profile Diagram */}
          <DuctDiagram result={result} />

          {/* Branch Runout Table (if room_schedule is active) */}
          {result.branchRuns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wind className="h-4 w-4 text-amber-600" />
                  Room-by-Room Branch Duct Sizing Takeoff
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {result.branchRuns.length} Branch Runs &bull; {result.totalCfm} CFM
                </span>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room / Zone</TableHead>
                    <TableHead className="text-right">Airflow (CFM)</TableHead>
                    <TableHead className="text-right">Round Duct Size</TableHead>
                    <TableHead className="text-right">Round Velocity</TableHead>
                    <TableHead className="text-right">Rectangular Equivalent</TableHead>
                    <TableHead className="text-center">Velocity Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.branchRuns.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-bold text-slate-900">
                        {b.roomName}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        {b.cfm} CFM
                      </TableCell>
                      <TableCell className="text-right font-mono text-amber-900 text-xs font-bold">
                        {b.recommendedStandardDiameterInches}&quot; Round
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        {b.actualRoundVelocityFpm} FPM
                      </TableCell>
                      <TableCell className="text-right font-mono text-purple-900 text-xs font-bold">
                        {b.rectangularWidthInches}&quot; &times; {b.rectangularHeightInches}&quot;
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            b.velocityStatus === "optimal" || b.velocityStatus === "quiet"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.velocityStatus.replace("_", " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Safety & Design Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-950 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>HVAC Duct Engineering Disclaimer:</strong> This calculator provides hydrodynamic equal-friction and velocity sizing estimations based on ASHRAE fundamentals. It does not replace a professional Manual D duct design calculation. Total external static pressure (ESP), equivalent length of fittings (TEL), fire dampers, and blower curves must be verified by a licensed mechanical contractor.
            </div>
          </div>

          {/* Step-by-Step Mathematical Methodology */}
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
