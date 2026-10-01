"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  ConductorInputRow,
  ConductorInsulation,
  ConduitFillInput,
  ConduitFillResult,
  ConduitType,
} from "@/types/conduit";
import type { WireGaugeSize } from "@/types/electrical";
import { CONDUIT_TYPES } from "@/data/references/conduit-types";
import { calculateConduitFillProject } from "@/lib/calculations/conduit";
import { ConduitDiagram } from "./conduit-diagram";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
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
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const WIRE_GAUGE_OPTIONS: WireGaugeSize[] = [
  "14 AWG",
  "12 AWG",
  "10 AWG",
  "8 AWG",
  "6 AWG",
  "4 AWG",
  "3 AWG",
  "2 AWG",
  "1 AWG",
  "1/0 AWG",
  "2/0 AWG",
  "3/0 AWG",
  "4/0 AWG",
  "250 kcmil",
  "300 kcmil",
  "350 kcmil",
  "400 kcmil",
  "500 kcmil",
  "600 kcmil",
  "750 kcmil",
  "1000 kcmil",
];

const CIRCUIT_PRESETS = [
  {
    label: "15A/20A Branch (3× 12 AWG)",
    conductors: [
      { id: "1", size: "12 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 3 },
    ],
  },
  {
    label: "30A Dryer/AC (3× 10 + 1× 10 Bare)",
    conductors: [
      { id: "1", size: "10 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 3 },
      { id: "2", size: "10 AWG" as WireGaugeSize, insulation: "bare_copper" as ConductorInsulation, count: 1 },
    ],
  },
  {
    label: "50A EV/Range (3× 6 + 1× 10 Ground)",
    conductors: [
      { id: "1", size: "6 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 3 },
      { id: "2", size: "10 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 1 },
    ],
  },
  {
    label: "60A EV Charger (3× 4 + 1× 8 Ground)",
    conductors: [
      { id: "1", size: "4 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 3 },
      { id: "2", size: "8 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 1 },
    ],
  },
  {
    label: "100A Subpanel (3× 1 + 1× 6 Ground)",
    conductors: [
      { id: "1", size: "1 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 3 },
      { id: "2", size: "6 AWG" as WireGaugeSize, insulation: "thhn" as ConductorInsulation, count: 1 },
    ],
  },
];

export interface ConduitFillCalculatorFormProps {
  initialConduitType?: ConduitType;
  initialIsNipple?: boolean;
  initialConductors?: ConductorInputRow[];
}

export function ConduitFillCalculatorForm({
  initialConduitType = "emt",
  initialIsNipple = false,
  initialConductors = [
    { id: "1", size: "6 AWG", insulation: "thhn", count: 3 },
    { id: "2", size: "10 AWG", insulation: "thhn", count: 1 },
  ],
}: ConduitFillCalculatorFormProps = {}) {
  const [conduitType, setConduitType] = useState<ConduitType>(initialConduitType);
  const [isNipple, setIsNipple] = useState<boolean>(initialIsNipple);
  const [conductors, setConductors] = useState<ConductorInputRow[]>(initialConductors);

  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("conduit-fill-calculator", "electrical");
  }, []);

  const calculationResult: {
    result?: ConduitFillResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: ConduitFillInput = {
        conduitType,
        isNippleOrShortRun: isNipple,
        conductors,
      };
      const res = calculateConduitFillProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [conduitType, isNipple, conductors]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("conduit-fill-calculator", "electrical", {
        primaryUnit: "conduitSize",
      });
    }
  }, [calculationResult.result]);

  const addConductorRow = () => {
    const newRow: ConductorInputRow = {
      id: `row-${Date.now()}`,
      size: "12 AWG",
      insulation: "thhn",
      count: 1,
    };
    setConductors([...conductors, newRow]);
  };

  const updateConductorRow = (id: string, field: keyof ConductorInputRow, val: unknown) => {
    setConductors(
      conductors.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const removeConductorRow = (id: string) => {
    if (conductors.length <= 1) return;
    setConductors(conductors.filter((row) => row.id !== id));
  };

  const resetAll = () => {
    setConduitType(initialConduitType);
    setIsNipple(initialIsNipple);
    setConductors(initialConductors);
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const r = calculationResult.result;

    const summaryLines = [
      "CONDUIT FILL & RACEWAY SIZING TAKEOFF",
      "====================================",
      `Recommended Trade Size: ${r.recommendedTradeSize} ${r.conduitType.toUpperCase()}`,
      `Total Conductors: ${r.totalConductorCount} wires`,
      `Total Conductor Cross-Sectional Area: ${r.totalConductorAreaSqIn.toFixed(4)} sq in`,
      `Calculated Fill Percentage: ${r.actualFillPercentage.toFixed(1)}% (Allowable: ${r.allowableFillPercentage}%)`,
      `Raceway Type: ${r.conduitType.toUpperCase()} (${isNipple ? "Short Nipple ≤ 24\"" : "Standard Run"})`,
      "",
      "CONDUCTOR SCHEDULE:",
      ...conductors.map(
        (c) =>
          ` • ${c.count}× ${c.size} (${c.insulation.toUpperCase()})`
      ),
      "",
      "Reference: NEC 2023 Chapter 9 Tables 1, 4 & 5 Raceway Limits",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("conduit-fill-calculator", "electrical", "projectSummary");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_conduit_config", JSON.stringify({ conduitType, isNipple, conductors }));
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
        title="Conduit Fill & Wire Pull Schedule Worksheet"
        category="Electrical & Conduit"
      />

      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check wire sizes and counts.
        </Alert>
      )}

      {/* 2-PANE SPLIT VISUAL CAD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Live Wire Packing Cross-Section Canvas (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <ConduitDiagram result={result} />
          )}
        </div>

        {/* RIGHT PANE: Variable Hub & Sizing Dock (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Raceway & Wire Schedule Input Dock */}
          <div className="glass-dock rounded-2xl p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Conduit &amp; Wire Schedule
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

            {/* Raceway Type & Nipple Selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="conduit-select" className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Raceway Material:
                </label>
                <select
                  id="conduit-select"
                  value={conduitType}
                  onChange={(e) => setConduitType(e.target.value as ConduitType)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  {CONDUIT_TYPES.map((c) => (
                    <option key={c.type} value={c.type}>
                      {c.name} ({c.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Circuit Presets */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1">
                  {CIRCUIT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setConductors(p.conductors.map((c, i) => ({ ...c, id: `preset-${Date.now()}-${i}` })))}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conductor Rows */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Conductor Wire List ({conductors.reduce((acc, c) => acc + (c.count || 0), 0)} Wires)
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addConductorRow}
                    className="text-[11px] h-7 px-2 border-slate-700 bg-slate-950 text-slate-300 hover:text-white"
                  >
                    <Plus className="h-3 w-3 mr-1 text-amber-400" />
                    Add Wire
                  </Button>
                </div>

                <div className="space-y-2">
                  {conductors.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-1.5 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div className="col-span-5">
                        <select
                          value={row.size}
                          onChange={(e) => updateConductorRow(row.id, "size", e.target.value as WireGaugeSize)}
                          aria-label="Wire Gauge"
                          className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs font-mono font-bold text-white focus:outline-none"
                        >
                          {WIRE_GAUGE_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4">
                        <select
                          value={row.insulation}
                          onChange={(e) => updateConductorRow(row.id, "insulation", e.target.value as ConductorInsulation)}
                          aria-label="Insulation Type"
                          className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-1.5 text-[11px] font-mono text-slate-300 focus:outline-none"
                        >
                          <option value="thhn">THHN / THWN-2</option>
                          <option value="xhhw">XHHW / XHHW-2</option>
                          <option value="use_rhw">RHW / USE-2</option>
                          <option value="bare_copper">Bare Copper</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={row.count}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateConductorRow(row.id, "count", isNaN(val) ? 1 : Math.min(Math.max(1, val), 99));
                          }}
                          aria-label="Wire Quantity"
                          className="w-full h-8 rounded border border-slate-700 bg-slate-900 text-center text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        {conductors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeConductorRow(row.id)}
                            aria-label="Delete wire row"
                            className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Decision & Trade Size HUD */}
          {result && (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Conduit Sizing Schedule &amp; Trade Size
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    result.actualFillPercentage <= result.allowableFillPercentage
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  {result.actualFillPercentage.toFixed(1)}% Fill (Limit {result.allowableFillPercentage}%)
                </span>
              </div>

              {/* Primary Calculated Trade Size */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                    Recommended Trade Size
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                      {result.recommendedTradeSize}
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      {result.conduitType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {result.totalConductorCount} Conductors &bull; Total Wire Area: {result.totalConductorAreaSqIn.toFixed(4)} sq in
                  </span>
                </div>

                {/* Sizing Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Raceway Fill Telemetry
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Conduit Internal Area:</span>
                    <span className="font-bold text-white">{result.recommendedConduitAreaSqIn.toFixed(4)} sq in</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Max Code Fill Capacity:</span>
                    <span className="font-bold text-emerald-400">{result.allowableFillPercentage}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Actual Fill Utilization:</span>
                    <span className="font-bold text-amber-400">{result.actualFillPercentage.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 no-print">
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
                    <span>{saved ? "Saved!" : "Save"}</span>
                  </button>

                  <PrintButton
                    toolSlug="conduit-fill-calculator"
                    category="electrical"
                    label="Print Worksheet"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
                  />

                  <EmbedModal
                    toolSlug="conduit-fill-calculator"
                    toolName="Electrical Conduit Fill Calculator"
                    buttonLabel="Embed Tool"
                    variant="compact"
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
