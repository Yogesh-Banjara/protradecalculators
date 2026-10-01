"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  ConductorMaterial,
  ConductorTemperatureRating,
  ElectricalPhase,
  VoltageDropCalculatorInput,
  VoltageDropCalculationResult,
} from "@/types/electrical";
import { calculateVoltageDropProject } from "@/lib/calculations/electrical";
import { VoltageDropDiagram } from "./voltage-drop-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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
  Zap,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const QUICK_VOLTAGE_PRESETS = [
  { label: "120V Single-Phase", voltage: 120, phase: "single_phase" as const },
  { label: "240V Single-Phase (Feeder / EV)", voltage: 240, phase: "single_phase" as const },
  { label: "208V 3-Phase", voltage: 208, phase: "three_phase" as const },
  { label: "480V 3-Phase Commercial", voltage: 480, phase: "three_phase" as const },
  { label: "12V / 24V DC", voltage: 12, phase: "dc" as const },
];

const QUICK_AMPERAGE_PRESETS = [15, 20, 30, 40, 50, 60, 100, 200];

export interface VoltageDropCalculatorFormProps {
  initialVoltage?: number;
  initialPhase?: ElectricalPhase;
  initialLoadCurrentAmps?: number;
  initialDistanceFt?: number;
  initialMaterial?: ConductorMaterial;
  initialTemperatureRating?: ConductorTemperatureRating;
  initialTargetMaxVoltageDropPercent?: number;
  initialIsContinuousLoad?: boolean;
  initialAmbientTempF?: number;
  initialConductorsInConduit?: number;
}

export function VoltageDropCalculatorForm({
  initialVoltage = 240,
  initialPhase = "single_phase",
  initialLoadCurrentAmps = 50,
  initialDistanceFt = 100,
  initialMaterial = "copper",
  initialTemperatureRating = "75C",
  initialTargetMaxVoltageDropPercent = 3.0,
  initialIsContinuousLoad = false,
  initialAmbientTempF = 86,
  initialConductorsInConduit = 3,
}: VoltageDropCalculatorFormProps = {}) {
  const [voltage, setVoltage] = useState<number>(initialVoltage);
  const [phase, setPhase] = useState<ElectricalPhase>(initialPhase);
  const [loadCurrentAmps, setLoadCurrentAmps] = useState<number>(initialLoadCurrentAmps);
  const [distanceFt, setDistanceFt] = useState<number>(initialDistanceFt);
  const [material, setMaterial] = useState<ConductorMaterial>(initialMaterial);
  const [temperatureRating, setTemperatureRating] = useState<ConductorTemperatureRating>(initialTemperatureRating);
  const [targetMaxVoltageDropPercent, setTargetMaxVoltageDropPercent] = useState<number>(initialTargetMaxVoltageDropPercent);
  const [isContinuousLoad, setIsContinuousLoad] = useState<boolean>(initialIsContinuousLoad);
  const [ambientTempF, setAmbientTempF] = useState<number>(initialAmbientTempF);
  const [conductorsInConduit, setConductorsInConduit] = useState<number>(initialConductorsInConduit);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("voltage-drop-calculator", "electrical");
  }, []);

  const calculationResult: {
    result?: VoltageDropCalculationResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: VoltageDropCalculatorInput = {
        voltage,
        phase,
        loadCurrentAmps,
        distanceFt,
        material,
        temperatureRating,
        targetMaxVoltageDropPercent,
        isContinuousLoad,
        ambientTempF,
        conductorsInConduit,
      };
      const res = calculateVoltageDropProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    voltage,
    phase,
    loadCurrentAmps,
    distanceFt,
    material,
    temperatureRating,
    targetMaxVoltageDropPercent,
    isContinuousLoad,
    ambientTempF,
    conductorsInConduit,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("voltage-drop-calculator", "electrical", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "AWG/kcmil",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    setVoltage(initialVoltage);
    setPhase(initialPhase);
    setLoadCurrentAmps(initialLoadCurrentAmps);
    setDistanceFt(initialDistanceFt);
    setMaterial(initialMaterial);
    setTemperatureRating(initialTemperatureRating);
    setTargetMaxVoltageDropPercent(initialTargetMaxVoltageDropPercent);
    setIsContinuousLoad(initialIsContinuousLoad);
    setAmbientTempF(initialAmbientTempF);
    setConductorsInConduit(initialConductorsInConduit);
    setShowAdvanced(false);
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const res = calculationResult.result;

    const summaryLines = [
      "ELECTRICAL WIRE SIZING & VOLTAGE DROP TAKEOFF",
      "==============================================",
      `Circuit Voltage: ${res.systemVoltage}V (${res.phase.replace("_", " ").toUpperCase()})`,
      `Load Current: ${res.loadCurrentAmps}A (Design: ${res.designCurrentAmps}A${res.isContinuousLoad ? " - 125% Continuous" : ""})`,
      `One-Way Run Distance: ${res.oneWayDistanceFt} ft`,
      `Recommended Conductor: ${res.recommendedSize} (${res.conductorMaterial.toUpperCase()})`,
      `Voltage Drop: ${res.voltageDropVolts}V (${res.voltageDropPercent}% drop)`,
      `Voltage Delivered at Load: ${res.voltageAtLoad}V`,
      `Conductor Base Ampacity: ${res.baseAmpacity}A (Derated: ${res.deratedAmpacity}A)`,
      `Max 3% Distance: ${res.maxDistanceFor3PctDropFt} ft | Max 5% Distance: ${res.maxDistanceFor5PctDropFt} ft`,
      `Copper Alternative: ${res.copperVsAluminumComparison.copperRecommendedSize} (${res.copperVsAluminumComparison.copperDropPercent}%)`,
      `Aluminum Alternative: ${res.copperVsAluminumComparison.aluminumRecommendedSize} (${res.copperVsAluminumComparison.aluminumDropPercent}%)`,
      "",
      "Reference: NEC 2023 Table 310.16 & Conductor Resistance Schedules",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("voltage-drop-calculator", "electrical", "projectSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print Header */}
      <JobsitePrintHeader
        title="Electrical Wire Size & Voltage Drop Worksheet"
        category="Electrical & Conduit"
      />

      {/* Main Form Section */}
      <div className="space-y-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Circuit Parameters &amp; Electrical Load
            </h2>
            <p className="text-xs text-slate-300">
              Calculate wire gauge, voltage drop, and NEC 310.16 ampacity for single-phase, 3-phase, and DC circuits.
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

        {/* Primary Inputs Grid */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* System Voltage */}
            <FormField id="sys-voltage" label="System Voltage (V)" required>
              <Input
                id="sys-voltage"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={voltage || ""}
                onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
                placeholder="240"
              />
            </FormField>

            {/* Load Current (Amps) */}
            <FormField id="load-amps" label="Load Current (Amps)" required>
              <Input
                id="load-amps"
                type="number"
                min="1"
                max="2000"
                step="0.5"
                value={loadCurrentAmps || ""}
                onChange={(e) => setLoadCurrentAmps(parseFloat(e.target.value) || 0)}
                placeholder="50"
              />
            </FormField>

            {/* One-Way Distance (ft) */}
            <FormField id="run-dist" label="One-Way Distance (ft)" required>
              <Input
                id="run-dist"
                type="number"
                min="1"
                max="5000"
                step="1"
                value={distanceFt || ""}
                onChange={(e) => setDistanceFt(parseFloat(e.target.value) || 0)}
                placeholder="100"
              />
            </FormField>

            {/* Conductor Material */}
            <FormField id="cond-material" label="Conductor Material" required>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMaterial("copper")}
                  className={`py-1 text-xs font-bold rounded transition-colors ${
                    material === "copper"
                      ? "bg-slate-900 text-amber-400 shadow-sm"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Copper (Cu)
                </button>
                <button
                  type="button"
                  onClick={() => setMaterial("aluminum")}
                  className={`py-1 text-xs font-bold rounded transition-colors ${
                    material === "aluminum"
                      ? "bg-slate-900 text-amber-400 shadow-sm"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Aluminum (Al)
                </button>
              </div>
            </FormField>
          </div>

          {/* Quick Voltage & Phase Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 font-bold mr-1">Quick Voltages:</span>
            {QUICK_VOLTAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setVoltage(preset.voltage);
                  setPhase(preset.phase);
                }}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  voltage === preset.voltage && phase === preset.phase
                    ? "bg-slate-900 text-amber-400 border-slate-900 font-bold"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Quick Amperage Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 font-bold mr-1">Standard Breaker Sizes:</span>
            {QUICK_AMPERAGE_PRESETS.map((amp) => (
              <button
                key={amp}
                type="button"
                onClick={() => setLoadCurrentAmps(amp)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  loadCurrentAmps === amp
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {amp}A
              </button>
            ))}
          </div>

          {/* Secondary Circuit Configuration Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            {/* Phase Selector */}
            <div>
              <label htmlFor="elec-phase" className="font-bold text-slate-600 block mb-1">
                Circuit Phase &amp; Waveform
              </label>
              <select
                id="elec-phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value as ElectricalPhase)}
                aria-label="Electrical Phase"
                className="w-full rounded border border-slate-300 bg-white px-2 py-2 font-semibold text-slate-800 focus:outline-none"
              >
                <option value="single_phase">Single-Phase AC (120V / 240V)</option>
                <option value="three_phase">Three-Phase AC (208V / 480V)</option>
                <option value="dc">Direct Current DC (Solar / Battery)</option>
              </select>
            </div>

            {/* Target Voltage Drop % */}
            <div>
              <label htmlFor="target-drop" className="font-bold text-slate-600 block mb-1">
                Target Max Voltage Drop (%)
              </label>
              <select
                id="target-drop"
                value={targetMaxVoltageDropPercent}
                onChange={(e) => setTargetMaxVoltageDropPercent(parseFloat(e.target.value))}
                aria-label="Target Voltage Drop Percentage"
                className="w-full rounded border border-slate-300 bg-white px-2 py-2 font-semibold text-slate-800 focus:outline-none"
              >
                <option value={3.0}>3.0% (NEC Branch Circuit Standard)</option>
                <option value={5.0}>5.0% (NEC Feeder + Branch Total)</option>
                <option value={2.0}>2.0% (Sensitive Audio / Lab Equipment)</option>
                <option value={1.5}>1.5% (Solar PV DC Strings)</option>
              </select>
            </div>

            {/* Continuous Load Toggle */}
            <div>
              <label htmlFor="cont-load" className="font-bold text-slate-600 block mb-1">
                Load Continuity (NEC 125% Rule)
              </label>
              <button
                id="cont-load"
                type="button"
                onClick={() => setIsContinuousLoad(!isContinuousLoad)}
                className={`w-full py-2 px-3 rounded border text-xs font-bold text-left flex items-center justify-between transition-colors ${
                  isContinuousLoad
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : "bg-white border-slate-300 text-slate-700"
                }`}
              >
                <span>{isContinuousLoad ? "Continuous Load (125% Sizing)" : "Non-Continuous (100%)"}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {isContinuousLoad ? "EV / Solar" : "Standard"}
                </span>
              </button>
            </div>
          </div>

          {/* Advanced Derating Discloser Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Sliders className="h-3.5 w-3.5 text-amber-600" />
              {showAdvanced ? "Hide" : "Show"} Advanced NEC Derating Factors (Ambient Temp &amp; Conduit Fill)
              {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 mt-2 rounded bg-slate-50 border border-slate-200 text-xs">
                {/* Conductor Temperature Rating */}
                <div>
                  <label htmlFor="temp-rating" className="font-bold text-slate-700 block mb-1">
                    Insulation Rating
                  </label>
                  <select
                    id="temp-rating"
                    value={temperatureRating}
                    onChange={(e) => setTemperatureRating(e.target.value as ConductorTemperatureRating)}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="75C">75°C (THHN / THWN-2 Standard Terminals)</option>
                    <option value="60C">60°C (NM-B / Romex, UF-B)</option>
                    <option value="90C">90°C (THHN Derating Baseline)</option>
                  </select>
                </div>

                {/* Ambient Temperature */}
                <div>
                  <label htmlFor="amb-temp" className="font-bold text-slate-700 block mb-1">
                    Ambient Temperature (°F)
                  </label>
                  <select
                    id="amb-temp"
                    value={ambientTempF}
                    onChange={(e) => setAmbientTempF(parseInt(e.target.value, 10))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value={86}>86°F / 30°C (Standard)</option>
                    <option value={104}>104°F / 40°C (Hot Climate / Garage)</option>
                    <option value={122}>122°F / 50°C (Attic / Roof Raceway)</option>
                    <option value={140}>140°F / 60°C (Extreme Solar Heat Gain)</option>
                  </select>
                </div>

                {/* Conductors in Raceway */}
                <div>
                  <label htmlFor="cond-conduit" className="font-bold text-slate-700 block mb-1">
                    Conductors in Conduit
                  </label>
                  <select
                    id="cond-conduit"
                    value={conductorsInConduit}
                    onChange={(e) => setConductorsInConduit(parseInt(e.target.value, 10))}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value={3}>1 to 3 Conductors (100% Ampacity)</option>
                    <option value={6}>4 to 6 Conductors (80% Derating)</option>
                    <option value={9}>7 to 9 Conductors (70% Derating)</option>
                    <option value={20}>10 to 20 Conductors (50% Derating)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check your electrical circuit parameters.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Primary Hero Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Recommended Conductor &amp; Voltage Drop Sizing
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.systemVoltage}V &bull; {result.loadCurrentAmps}A Load &bull; {result.oneWayDistanceFt} ft run
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Conductor Size Hero */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Recommended Minimum Conductor Size ({result.conductorMaterial.toUpperCase()}):
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight">
                    {result.recommendedSize}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {result.conductorMaterial.toUpperCase()} ({result.recommendedCircularMils.toLocaleString()} CM)
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Delivers{" "}
                  <span className="text-amber-400 font-mono font-semibold">
                    {result.voltageAtLoad}V
                  </span>{" "}
                  at load terminal with{" "}
                  <span className="text-emerald-400 font-mono font-bold">
                    {result.voltageDropPercent}% voltage drop
                  </span>{" "}
                  (-{result.voltageDropVolts}V drop).
                </p>
              </div>

              {/* Electrical Specs Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Actual Voltage Drop</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {result.voltageDropVolts}V{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      ({result.voltageDropPercent}%)
                    </span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Voltage at Load</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.voltageAtLoad}V{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">delivered</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">NEC Base Ampacity</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.baseAmpacity}A{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      ({result.deratedAmpacity}A derated)
                    </span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Max 3% Distance</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.maxDistanceFor3PctDropFt} ft{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">limit</span>
                  </span>
                </div>
              </div>

              {/* Copper vs Aluminum Comparison Card */}
              <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider">
                    Copper vs. Aluminum Conductor Comparison
                  </span>
                  <span className="text-slate-400">At {result.oneWayDistanceFt} ft run</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-400 font-bold block">Copper (Cu) Recommendation</span>
                      <span className="text-base font-bold font-mono text-white">
                        {result.copperVsAluminumComparison.copperRecommendedSize}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400 font-bold block">
                        {result.copperVsAluminumComparison.copperDropPercent}% Drop
                      </span>
                      <span className="text-[10px] text-slate-400">Higher conductivity</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-300 font-bold block">Aluminum (Al) Recommendation</span>
                      <span className="text-base font-bold font-mono text-white">
                        {result.copperVsAluminumComparison.aluminumRecommendedSize}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-amber-400 font-bold block">
                        {result.copperVsAluminumComparison.aluminumDropPercent}% Drop
                      </span>
                      <span className="text-[10px] text-slate-400">Lower material weight/cost</span>
                    </div>
                  </div>
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
                <div className="flex flex-wrap items-center gap-2">
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
                    toolSlug="voltage-drop-calculator"
                    category="electrical"
                    label="Print Electrical Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />

                  <EmbedModal
                    toolSlug="voltage-drop-calculator"
                    toolName="Electrical Wire Size & Voltage Drop Calculator"
                    buttonLabel="Embed on Your Website"
                    variant="outline"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  Target &le; {result.targetMaxVoltageDropPercent}% &bull; K = {result.conductorMaterial === "copper" ? "12.9" : "21.2"} &Omega;&middot;cmil/ft
                </span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Electrical Schematic */}
          <VoltageDropDiagram result={result} />

          {/* Candidate Size Comparison Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                Conductor Candidate Sizing &amp; Voltage Drop Comparison Table
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {result.conductorMaterial.toUpperCase()} Conductors
              </span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conductor Size</TableHead>
                  <TableHead className="text-right">Circular Mils</TableHead>
                  <TableHead className="text-right">Base / Derated Ampacity</TableHead>
                  <TableHead className="text-right">Voltage Drop</TableHead>
                  <TableHead className="text-right">Voltage at Load</TableHead>
                  <TableHead className="text-right">Max 3% Distance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.candidates.map((cand) => {
                  const isRec = cand.overallStatus === "recommended";
                  return (
                    <TableRow
                      key={cand.size}
                      className={isRec ? "bg-amber-50/80 font-semibold" : undefined}
                    >
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                        {cand.size}
                        {isRec && (
                          <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        {cand.circularMils.toLocaleString()} CM
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        {cand.baseAmpacity}A / {cand.deratedAmpacity}A
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold">
                        <span
                          className={
                            cand.voltageDropPercent <= 3.0
                              ? "text-emerald-700"
                              : cand.voltageDropPercent <= 5.0
                              ? "text-amber-700"
                              : "text-rose-700"
                          }
                        >
                          {cand.voltageDropVolts}V ({cand.voltageDropPercent}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-900 text-xs">
                        {cand.voltageAtLoad}V
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-600 text-xs">
                        {cand.maxDistanceFor3PctDropFt} ft
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            cand.overallStatus === "recommended"
                              ? "bg-amber-500 text-slate-950"
                              : cand.overallStatus === "pass"
                              ? "bg-emerald-100 text-emerald-800"
                              : cand.overallStatus === "warning"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {cand.overallStatus.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Safety & Engineering Notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-950 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>NEC Electrical Code &amp; Safety Disclaimer:</strong> This calculation is for design and reference estimation only. Final conductor sizing must comply with the National Electrical Code (NEC Article 310, Table 310.16), local electrical amendments, terminal temperature ratings (typically 75°C), and equipment manufacturer specifications. High-voltage and feeder installations should be verified by a licensed electrical contractor.
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
