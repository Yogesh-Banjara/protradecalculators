"use client";

import React, { useState, useMemo } from "react";
import {
  PLUMBING_FIXTURE_CATALOG,
} from "@/data/references/plumbing-dfu-types";
import { calculatePlumbingDfu } from "@/lib/calculations/plumbing-dfu";
import type {
  DrainageSystemType,
  FixtureScheduleItem,
  PipeSlope,
  PlumbingCodeStandard,
  PlumbingDfuInput,
} from "@/types/plumbing-dfu";
import { PlumbingDfuDiagram } from "./plumbing-dfu-diagram";
import { Button } from "@/components/ui/button";
import { PrintButton, JobsitePrintHeader } from "@/components/ui/print-view";
import {
  Droplets,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PresetScenario {
  readonly name: string;
  readonly description: string;
  readonly codeStandard: PlumbingCodeStandard;
  readonly systemType: DrainageSystemType;
  readonly pipeSlope: PipeSlope;
  readonly continuousPumpGpm?: number;
  readonly fixtures: readonly { readonly fixtureId: string; readonly quantity: number }[];
}

const PRESET_SCENARIOS: readonly PresetScenario[] = [
  {
    name: "Single Family 2-Bath Home",
    description: "2 Toilets, 2 Sinks, 1 Tub, 1 Shower, Kitchen Sink, Dishwasher, Clothes Washer",
    codeStandard: "IPC",
    systemType: "building_drain",
    pipeSlope: "1_4",
    fixtures: [
      { fixtureId: "water_closet_16", quantity: 2 },
      { fixtureId: "lavatory", quantity: 2 },
      { fixtureId: "bathtub", quantity: 1 },
      { fixtureId: "shower_stall", quantity: 1 },
      { fixtureId: "kitchen_sink", quantity: 1 },
      { fixtureId: "clothes_washer", quantity: 1 },
    ],
  },
  {
    name: "Bathroom Group Branch",
    description: "1 WC, 1 Lavatory sink, and 1 Bathtub (5 DFU group discount)",
    codeStandard: "IPC",
    systemType: "horizontal_branch",
    pipeSlope: "1_4",
    fixtures: [
      { fixtureId: "bathroom_group", quantity: 1 },
    ],
  },
  {
    name: "Commercial Restroom",
    description: "4 Public Flushometer Toilets, 2 Urinals, 4 Lavatories, 1 Mop Sink",
    codeStandard: "UPC",
    systemType: "horizontal_branch",
    pipeSlope: "1_4",
    fixtures: [
      { fixtureId: "water_closet_public", quantity: 4 },
      { fixtureId: "urinal", quantity: 2 },
      { fixtureId: "lavatory", quantity: 4 },
      { fixtureId: "mop_service_sink", quantity: 1 },
    ],
  },
];

function createFixtureItem(fixtureId: string, quantity: number, codeStandard: PlumbingCodeStandard): FixtureScheduleItem {
  const def = PLUMBING_FIXTURE_CATALOG.find((f) => f.id === fixtureId) || PLUMBING_FIXTURE_CATALOG[0];
  const dfuEach = codeStandard === "IPC" ? def.ipcDfu : def.upcDfu;
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fixtureId: def.id,
    name: def.name,
    quantity,
    dfuEach,
    minTrapSizeInches: def.minTrapSizeInches,
    isWaterCloset: def.isWaterCloset,
  };
}

export function PlumbingDfuForm() {
  const [codeStandard, setCodeStandard] = useState<PlumbingCodeStandard>("IPC");
  const [systemType, setSystemType] = useState<DrainageSystemType>("building_drain");
  const [pipeSlope, setPipeSlope] = useState<PipeSlope>("1_4");
  const [continuousPumpGpm, setContinuousPumpGpm] = useState<number>(0);
  const [fixtures, setFixtures] = useState<FixtureScheduleItem[]>([
    createFixtureItem("water_closet_16", 2, "IPC"),
    createFixtureItem("lavatory", 2, "IPC"),
    createFixtureItem("bathtub", 1, "IPC"),
    createFixtureItem("kitchen_sink", 1, "IPC"),
    createFixtureItem("clothes_washer", 1, "IPC"),
  ]);

  const [selectedAddFixtureId, setSelectedAddFixtureId] = useState<string>("shower_stall");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const input: PlumbingDfuInput = useMemo(
    () => ({
      codeStandard,
      systemType,
      pipeSlope,
      fixtures,
      continuousPumpGpm: continuousPumpGpm > 0 ? continuousPumpGpm : undefined,
    }),
    [codeStandard, systemType, pipeSlope, fixtures, continuousPumpGpm]
  );

  const result = useMemo(() => {
    try {
      return calculatePlumbingDfu(input);
    } catch {
      return null;
    }
  }, [input]);

  const handleFixtureQuantityChange = (fixtureId: string, qty: number) => {
    if (qty <= 0) {
      setFixtures(fixtures.filter((f) => f.fixtureId !== fixtureId));
    } else {
      setFixtures(
        fixtures.map((f) => (f.fixtureId === fixtureId ? { ...f, quantity: qty } : f))
      );
    }
  };

  const handleAddFixture = () => {
    const existing = fixtures.find((f) => f.fixtureId === selectedAddFixtureId);
    if (existing) {
      handleFixtureQuantityChange(selectedAddFixtureId, existing.quantity + 1);
    } else {
      setFixtures([...fixtures, createFixtureItem(selectedAddFixtureId, 1, codeStandard)]);
    }
  };

  const handleApplyPreset = (preset: PresetScenario) => {
    setCodeStandard(preset.codeStandard);
    setSystemType(preset.systemType);
    setPipeSlope(preset.pipeSlope);
    setContinuousPumpGpm(preset.continuousPumpGpm ?? 0);
    setFixtures(preset.fixtures.map((f) => createFixtureItem(f.fixtureId, f.quantity, preset.codeStandard)));
  };

  const resetAll = () => {
    try { localStorage.removeItem("saved_dfu_config"); } catch {}
    setCodeStandard("IPC");
    setSystemType("building_drain");
    setPipeSlope("1_4");
    setContinuousPumpGpm(0);
    setFixtures([
      createFixtureItem("water_closet_16", 2, "IPC"),
      createFixtureItem("lavatory", 2, "IPC"),
      createFixtureItem("bathtub", 1, "IPC"),
      createFixtureItem("kitchen_sink", 1, "IPC"),
    ]);
  };

  const copySummaryToClipboard = () => {
    if (!result) return;
    const summaryLines = [
      "PLUMBING DFU & DRAINAGE SIZING TAKEOFF",
      "=====================================",
      `Total Drainage Load: ${result.totalCalculatedDfu} DFU`,
      `Recommended Building Drain Size: ${result.recommendedPipeSizeInches}″ Pipe`,
      `Minimum Branch Drain Size: ${result.minPermittedPipeSizeInches}″ Pipe`,
      `Drainage Slope: ${pipeSlope === "1_2" ? "1/2" : pipeSlope === "1_8" ? "1/8" : "1/4"}″ per ft Fall`,
      `Standard Reference: ${codeStandard} 2024 Chapter 7 Table 709.1 / 710.1`,
      "",
      "FIXTURE SCHEDULE:",
      ...result.fixtureBreakdown.map(
        (f) => ` • ${f.quantity}× ${f.name}: ${f.subtotalDfu} DFU (${f.minTrapSizeInches}″ trap)`
      ),
      "",
      "Reference: IPC 2024 Table 709 / UPC 2024 Table 702 Drainage Fixture Units",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem("saved_dfu_config", JSON.stringify({ codeStandard, systemType, pipeSlope, fixtures }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <JobsitePrintHeader
        title="Sanitary Drainage & DFU Sizing Worksheet"
        category="Plumbing & Piping"
      />

      {/* 2-PANE SPLIT VISUAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Dynamic Sanitary Stack Layout (7 Cols on Desktop / 58%) */}
        <div className="lg:col-span-7 space-y-4">
          <PlumbingDfuDiagram result={result} />
        </div>

        {/* RIGHT PANE: Variable Controls & Sizing (5 Cols on Desktop / 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Fixture Schedule Input */}
          <div className="instrument-dock p-5 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Fixture Schedule &amp; Slope
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
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quick Scenarios:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESET_SCENARIOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Slope Selector */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="drain-slope" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Horizontal Drain Slope:
                </label>
                <select
                  id="drain-slope"
                  value={pipeSlope}
                  onChange={(e) => setPipeSlope(e.target.value as PipeSlope)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value="1_8">1/8″ per foot (1% Fall)</option>
                  <option value="1_4">1/4″ per foot (2% Fall - Standard)</option>
                  <option value="1_2">1/2″ per foot (4% Fall - High Velocity)</option>
                </select>
              </div>

              <div>
                <label htmlFor="system-type" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  System Drainage Type:
                </label>
                <select
                  id="system-type"
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value as DrainageSystemType)}
                  className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono font-bold text-white focus:outline-none"
                >
                  <option value="building_drain">Main Building Drain</option>
                  <option value="horizontal_branch">Horizontal Fixture Branch</option>
                  <option value="vertical_stack">Vertical Soil Stack</option>
                </select>
              </div>
            </div>

            {/* Fixture Schedule List */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Connected Fixtures ({fixtures.length})
                </span>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {fixtures.map((item) => {
                  const fixtureDef = PLUMBING_FIXTURE_CATALOG.find((f) => f.id === item.fixtureId);
                  if (!fixtureDef) return null;
                  const unitDfu = codeStandard === "IPC" ? fixtureDef.ipcDfu : fixtureDef.upcDfu;
                  const totalItemDfu = unitDfu * item.quantity;

                  return (
                    <div key={item.fixtureId} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div className="flex-1 pr-2">
                        <span className="font-bold text-slate-200 block text-xs">{fixtureDef.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {unitDfu} DFU each &bull; {fixtureDef.minTrapSizeInches}″ trap
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.quantity}
                          onChange={(e) => handleFixtureQuantityChange(item.fixtureId, parseInt(e.target.value, 10) || 1)}
                          aria-label={`Quantity of ${fixtureDef.name}`}
                          className="w-12 h-8 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-mono font-bold text-white"
                        />
                        <span className="text-xs font-mono font-bold text-cyan-400 w-14 text-right">
                          {totalItemDfu.toFixed(1)} DFU
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFixtureQuantityChange(item.fixtureId, 0)}
                          aria-label={`Remove ${fixtureDef.name}`}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Fixture Picker */}
              <div className="flex items-center gap-1.5 pt-2 min-w-0">
                <select
                  aria-label="Select fixture to add to drainage schedule"
                  value={selectedAddFixtureId}
                  onChange={(e) => setSelectedAddFixtureId(e.target.value)}
                  className="flex-1 min-w-0 h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs font-mono text-slate-200 focus:outline-none"
                >
                  {PLUMBING_FIXTURE_CATALOG.map((f) => (
                    <option key={f.id} value={f.id}>
                      + {f.name} ({codeStandard === "IPC" ? f.ipcDfu : f.upcDfu} DFU)
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddFixture}
                  className="h-9 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* 2. Progressive Disclosure: Code Standard & Pump GPM */}
          <div className="instrument-dock overflow-hidden shadow-xl text-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-3 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Plumbing Code Standard ({codeStandard}) &amp; Continuous Pump</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-3 border-t border-slate-800 text-xs bg-slate-950/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="code-standard" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Governing Code:
                    </label>
                    <select
                      id="code-standard"
                      value={codeStandard}
                      onChange={(e) => setCodeStandard(e.target.value as PlumbingCodeStandard)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    >
                      <option value="IPC">International Plumbing Code (IPC 2024)</option>
                      <option value="UPC">Uniform Plumbing Code (UPC 2024)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pump-gpm" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Pump Discharge GPM:
                    </label>
                    <input
                      id="pump-gpm"
                      type="number"
                      min="0"
                      step="1"
                      value={continuousPumpGpm}
                      onChange={(e) => setContinuousPumpGpm(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                      placeholder="0 GPM"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Decision & Pipe Sizing Section */}
          {result && (
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-slate-950 shadow-2xl overflow-hidden text-white space-y-0">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Recommended Drain Size &amp; Sizing Schedule
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {codeStandard} 2024 Sizing
                </span>
              </div>

              {/* Primary Calculated Answer */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block tracking-wider">
                    Recommended Building Drain Size
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight">
                      {result.recommendedPipeSizeInches}″
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-300">
                      Pipe
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Total Load: {result.totalCalculatedDfu} DFU @ {pipeSlope === "1_2" ? "1/2" : pipeSlope === "1_8" ? "1/8" : "1/4"}″/ft Fall (Capacity: {result.maxCapacityDfuForSelectedSize} DFU)
                  </span>
                </div>

                {/* Sizing Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Drainage System Schedule
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Total Drainage DFU:</span>
                    <span className="font-bold text-cyan-400">{result.totalCalculatedDfu} DFU</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Min Horizontal Branch:</span>
                    <span className="font-bold text-white">{result.minPermittedPipeSizeInches}″ Pipe</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">Capacity Utilization:</span>
                    <span className="font-bold text-white">{result.capacityUtilizationPct.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-1 no-print">
                  <button
                    type="button"
                    onClick={copySummaryToClipboard}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveConfiguration}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                  >
                    {saved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5 text-cyan-400" />}
                    <span>{saved ? "Saved on this device" : "Save on This Device"}</span>
                  </button>

                  <PrintButton
                    toolSlug="dfu-calculator"
                    category="plumbing"
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
