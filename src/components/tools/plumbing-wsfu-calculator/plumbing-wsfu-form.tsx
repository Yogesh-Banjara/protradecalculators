"use client";

import React, { useState, useMemo } from "react";
import { calculatePlumbingWsfu } from "@/lib/calculations/wsfu";
import { POTABLE_FIXTURE_CATALOG } from "@/data/references/plumbing-wsfu-types";
import type {
  PlumbingCodeStandard,
  PotablePipeMaterial,
  WsfuScheduleItem,
} from "@/types/plumbing-wsfu";
import { PlumbingWsfuDiagram } from "./plumbing-wsfu-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Copy,
  Info,
  Layers,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";

interface ScheduleStateItem {
  id: string;
  catalogId: string;
  quantity: number;
}

export function PlumbingWsfuForm() {
  const [codeStandard, setCodeStandard] = useState<PlumbingCodeStandard>("IPC");
  const [pipeMaterial, setPipeMaterial] = useState<PotablePipeMaterial>("copper_l");
  const [staticPressurePsi, setStaticPressurePsi] = useState<number>(60);
  const [developedLengthFeet, setDevelopedLengthFeet] = useState<number>(60);
  const [highestFixtureElevationFeet, setHighestFixtureElevationFeet] = useState<number>(10);
  const [minResidualPressurePsi, setMinResidualPressurePsi] = useState<number>(15);
  const [meterPressureDropPsi, setMeterPressureDropPsi] = useState<number>(5);
  const [continuousDemandGpm, setContinuousDemandGpm] = useState<number>(0);

  // Fixture Schedule State
  const [schedule, setSchedule] = useState<ScheduleStateItem[]>([
    { id: "1", catalogId: "bathroom_group_flush_tank", quantity: 2 },
    { id: "2", catalogId: "kitchen_sink", quantity: 1 },
    { id: "3", catalogId: "dishwasher", quantity: 1 },
    { id: "4", catalogId: "clothes_washer", quantity: 1 },
    { id: "5", catalogId: "hose_bibb_first", quantity: 1 },
    { id: "6", catalogId: "hose_bibb_additional", quantity: 1 },
  ]);

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("water_closet_tank");
  const [copiedTakeoff, setCopiedTakeoff] = useState<boolean>(false);

  // Map state to calculations
  const evaluatedSchedule: WsfuScheduleItem[] = useMemo(() => {
    const list: WsfuScheduleItem[] = [];
    for (const item of schedule) {
      const cat = POTABLE_FIXTURE_CATALOG.find((c) => c.id === item.catalogId);
      if (cat) {
        const wsfuTotalEach = codeStandard === "IPC" ? cat.ipcWsfuTotal : cat.upcWsfuTotal;
        const wsfuColdEach = codeStandard === "IPC" ? cat.ipcWsfuCold : cat.upcWsfuCold;
        const wsfuHotEach = codeStandard === "IPC" ? cat.ipcWsfuHot : cat.upcWsfuHot;

        list.push({
          id: item.id,
          fixtureId: cat.id,
          name: cat.name,
          quantity: item.quantity,
          wsfuTotalEach,
          wsfuColdEach,
          wsfuHotEach,
          minBranchSizeInches: cat.minBranchSizeInches,
          isFlushometer: cat.isFlushometer,
        });
      }
    }
    return list;
  }, [schedule, codeStandard]);

  // Execute pure calculation engine
  const calculationResult = useMemo(() => {
    try {
      return calculatePlumbingWsfu({
        codeStandard,
        pipeMaterial,
        staticPressurePsi: Math.max(1, staticPressurePsi || 60),
        developedLengthFeet: Math.max(1, developedLengthFeet || 60),
        highestFixtureElevationFeet: Math.max(0, highestFixtureElevationFeet || 0),
        minResidualPressurePsi: Math.max(5, minResidualPressurePsi || 15),
        meterPressureDropPsi: Math.max(0, meterPressureDropPsi || 0),
        fixtures: evaluatedSchedule,
        continuousDemandGpm: Math.max(0, continuousDemandGpm || 0),
      });
    } catch {
      return null;
    }
  }, [
    codeStandard,
    pipeMaterial,
    staticPressurePsi,
    developedLengthFeet,
    highestFixtureElevationFeet,
    minResidualPressurePsi,
    meterPressureDropPsi,
    evaluatedSchedule,
    continuousDemandGpm,
  ]);

  // Handlers
  const handleAddFixture = () => {
    const existingIndex = schedule.findIndex((s) => s.catalogId === selectedCatalogId);
    if (existingIndex >= 0) {
      const updated = [...schedule];
      updated[existingIndex].quantity += 1;
      setSchedule(updated);
    } else {
      setSchedule([
        ...schedule,
        {
          id: Math.random().toString(36).substring(2, 9),
          catalogId: selectedCatalogId,
          quantity: 1,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setSchedule((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSetQuantity = (id: string, qty: number) => {
    if (isNaN(qty)) return;
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const handleRemoveRow = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  };

  // Presets
  const applyPreset = (presetKey: string) => {
    if (presetKey === "single_family_2bath") {
      setSchedule([
        { id: "1", catalogId: "bathroom_group_flush_tank", quantity: 2 },
        { id: "2", catalogId: "kitchen_sink", quantity: 1 },
        { id: "3", catalogId: "dishwasher", quantity: 1 },
        { id: "4", catalogId: "clothes_washer", quantity: 1 },
        { id: "5", catalogId: "hose_bibb_first", quantity: 1 },
        { id: "6", catalogId: "hose_bibb_additional", quantity: 1 },
      ]);
      setStaticPressurePsi(60);
      setDevelopedLengthFeet(60);
      setHighestFixtureElevationFeet(10);
    } else if (presetKey === "townhouse_3story") {
      setSchedule([
        { id: "1", catalogId: "bathroom_group_flush_tank", quantity: 3 },
        { id: "2", catalogId: "kitchen_sink", quantity: 1 },
        { id: "3", catalogId: "dishwasher", quantity: 1 },
        { id: "4", catalogId: "clothes_washer", quantity: 1 },
      ]);
      setStaticPressurePsi(55);
      setDevelopedLengthFeet(90);
      setHighestFixtureElevationFeet(24);
    } else if (presetKey === "commercial_restroom") {
      setSchedule([
        { id: "1", catalogId: "water_closet_flushometer", quantity: 3 },
        { id: "2", catalogId: "lavatory", quantity: 3 },
        { id: "3", catalogId: "laundry_tub", quantity: 1 },
      ]);
      setStaticPressurePsi(65);
      setDevelopedLengthFeet(75);
      setHighestFixtureElevationFeet(12);
    } else if (presetKey === "luxury_estate") {
      setSchedule([
        { id: "1", catalogId: "bathroom_group_flush_tank", quantity: 4 },
        { id: "2", catalogId: "kitchen_sink", quantity: 2 },
        { id: "3", catalogId: "dishwasher", quantity: 2 },
        { id: "4", catalogId: "clothes_washer", quantity: 2 },
        { id: "5", catalogId: "bar_sink", quantity: 1 },
        { id: "6", catalogId: "hose_bibb_first", quantity: 1 },
        { id: "7", catalogId: "hose_bibb_additional", quantity: 2 },
      ]);
      setStaticPressurePsi(70);
      setDevelopedLengthFeet(120);
      setHighestFixtureElevationFeet(18);
    }
  };

  const handleReset = () => {
    applyPreset("single_family_2bath");
    setCodeStandard("IPC");
    setPipeMaterial("copper_l");
    setMinResidualPressurePsi(15);
    setMeterPressureDropPsi(5);
    setContinuousDemandGpm(0);
  };

  const handleCopyTakeoff = () => {
    if (!calculationResult) return;
    const text = [
      `POTABLE WATER SUPPLY & WSFU PIPE SIZING REPORT`,
      `Governing Code: ${calculationResult.codeStandard} | Pipe Material: ${calculationResult.pipeMaterial.toUpperCase()}`,
      `Static Pressure: ${calculationResult.staticPressurePsi} PSI | Developed Length: ${calculationResult.equivalentLengthFeet} ft equiv`,
      `Highest Elevation: ${calculationResult.highestFixtureElevationFeet} ft (Loss: ${calculationResult.elevationLossPsi} PSI)`,
      `--------------------------------------------------`,
      `Total Load: ${calculationResult.totalCalculatedWsfu} WSFU (${calculationResult.totalColdWsfu} Cold / ${calculationResult.totalHotWsfu} Hot)`,
      `Peak Design Flow: ${calculationResult.totalDesignFlowGpm} GPM (Hunter's Curve)`,
      `RECOMMENDED MAIN PIPE SIZE: ${calculationResult.recommendedMainPipeSizeInches}"`,
      `Water Velocity: ${calculationResult.velocityAtRecommendedSizeFps} FPS`,
      `Residual Pressure at Highest Fixture: ${calculationResult.actualResidualPressurePsi} PSI`,
      `--------------------------------------------------`,
      `FIXTURE SCHEDULE:`,
      ...calculationResult.fixtureBreakdown.map(
        (f) => `• ${f.quantity}x ${f.name}: ${f.subtotalTotalWsfu} WSFU (${f.subtotalColdWsfu}C / ${f.subtotalHotWsfu}H)`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedTakeoff(true);
    setTimeout(() => setCopiedTakeoff(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:m-0 print:p-0">
      {/* Visual Dynamic Supply Diagram */}
      <PlumbingWsfuDiagram result={calculationResult} />

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Buttons */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Quick Sizing Presets</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("single_family_2bath")}
                className="p-2.5 text-xs font-medium text-left rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="font-bold text-slate-900">2-Bath Home</div>
                <div className="text-[11px] text-slate-500">Standard Single Family</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("townhouse_3story")}
                className="p-2.5 text-xs font-medium text-left rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="font-bold text-slate-900">3-Story Townhome</div>
                <div className="text-[11px] text-slate-500">24 ft Elevation Rise</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("commercial_restroom")}
                className="p-2.5 text-xs font-medium text-left rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="font-bold text-slate-900">Flushometer Restroom</div>
                <div className="text-[11px] text-slate-500">High-Flow Commercial</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("luxury_estate")}
                className="p-2.5 text-xs font-medium text-left rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="font-bold text-slate-900">Luxury Estate</div>
                <div className="text-[11px] text-slate-500">4 Baths + 2 Laundries</div>
              </button>
            </div>
          </div>

          {/* System & Hydraulic Parameters Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Wrench className="h-4 w-4 text-cyan-600" />
              <span>1. Hydraulic & Pipe System Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Code Standard Toggle */}
              <div>
                <label htmlFor="codeStandard" className="text-xs font-bold text-slate-700">
                  Plumbing Code Standard
                </label>
                <select
                  id="codeStandard"
                  value={codeStandard}
                  onChange={(e) => setCodeStandard(e.target.value as PlumbingCodeStandard)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm font-medium text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="IPC">IPC (International Plumbing Code)</option>
                  <option value="UPC">UPC (Uniform Plumbing Code)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Governs fixture WSFU ratings & tables
                </span>
              </div>

              {/* Pipe Material Selector */}
              <div>
                <label htmlFor="pipeMaterial" className="text-xs font-bold text-slate-700">
                  Potable Pipe Material
                </label>
                <select
                  id="pipeMaterial"
                  value={pipeMaterial}
                  onChange={(e) => setPipeMaterial(e.target.value as PotablePipeMaterial)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm font-medium text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="copper_l">Copper Type L (Tubing, C=130)</option>
                  <option value="pex">PEX (Cross-Linked Polyethylene, C=150)</option>
                  <option value="cpvc">CPVC (Chlorinated PVC, C=150)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Determines internal ID & velocity limits
                </span>
              </div>

              {/* Static Pressure Input */}
              <div>
                <label htmlFor="staticPressurePsi" className="text-xs font-bold text-slate-700">
                  Static Available Pressure (PSI)
                </label>
                <Input
                  id="staticPressurePsi"
                  type="number"
                  min="20"
                  max="120"
                  value={staticPressurePsi}
                  onChange={(e) => setStaticPressurePsi(parseFloat(e.target.value) || 0)}
                  className="mt-1 text-sm font-medium"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Street meter or well pressure (typical: 50–70 PSI)
                </span>
              </div>

              {/* Developed Length Input */}
              <div>
                <label htmlFor="developedLengthFeet" className="text-xs font-bold text-slate-700">
                  Developed Pipe Length (Feet)
                </label>
                <Input
                  id="developedLengthFeet"
                  type="number"
                  min="5"
                  max="500"
                  value={developedLengthFeet}
                  onChange={(e) => setDevelopedLengthFeet(parseFloat(e.target.value) || 0)}
                  className="mt-1 text-sm font-medium"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Physical pipe distance to furthest fixture
                </span>
              </div>

              {/* Highest Fixture Elevation Input */}
              <div>
                <label htmlFor="highestFixtureElevationFeet" className="text-xs font-bold text-slate-700">
                  Highest Fixture Elevation (Feet)
                </label>
                <Input
                  id="highestFixtureElevationFeet"
                  type="number"
                  min="0"
                  max="150"
                  value={highestFixtureElevationFeet}
                  onChange={(e) => setHighestFixtureElevationFeet(parseFloat(e.target.value) || 0)}
                  className="mt-1 text-sm font-medium"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Height above water meter (0.433 PSI loss/ft)
                </span>
              </div>

              {/* Continuous Irrigation / Fire Demand (GPM) */}
              <div>
                <label htmlFor="continuousDemandGpm" className="text-xs font-bold text-slate-700">
                  Continuous Demand (GPM, Optional)
                </label>
                <Input
                  id="continuousDemandGpm"
                  type="number"
                  min="0"
                  max="50"
                  value={continuousDemandGpm}
                  onChange={(e) => setContinuousDemandGpm(parseFloat(e.target.value) || 0)}
                  className="mt-1 text-sm font-medium"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Irrigation or commercial process flow
                </span>
              </div>
            </div>
          </div>

          {/* Fixture Schedule Builder Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Layers className="h-4 w-4 text-cyan-600" />
              <span>2. Fixture Schedule Builder</span>
            </h3>

            {/* Add Fixture Control */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 bg-white p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {POTABLE_FIXTURE_CATALOG.map((fix) => {
                  const rating = codeStandard === "IPC" ? fix.ipcWsfuTotal : fix.upcWsfuTotal;
                  return (
                    <option key={fix.id} value={fix.id}>
                      {fix.name} — {rating} WSFU
                    </option>
                  );
                })}
              </select>
              <Button
                type="button"
                variant="primary"
                className="gap-1.5 whitespace-nowrap bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={handleAddFixture}
              >
                <Plus className="h-4 w-4" />
                <span>Add Fixture</span>
              </Button>
            </div>

            {/* Fixture Schedule Table */}
            {evaluatedSchedule.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Fixture Description</th>
                      <th className="p-3 text-center">WSFU (T/C/H)</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Subtotal WSFU</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {evaluatedSchedule.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Min Branch: {item.minBranchSizeInches}&quot;</span>
                            {item.isFlushometer && (
                              <span className="font-semibold text-rose-700 bg-rose-50 px-1 rounded">
                                Flushometer
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono font-semibold text-slate-700">
                          {item.wsfuTotalEach} / {item.wsfuColdEach} / {item.wsfuHotEach}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-7 w-7 p-0 rounded flex items-center justify-center font-bold"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={item.quantity}
                              onChange={(e) => handleSetQuantity(item.id, parseInt(e.target.value, 10))}
                              className="h-7 w-12 text-center p-0 font-bold font-mono text-xs"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="h-7 w-7 p-0 rounded flex items-center justify-center font-bold"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {(item.quantity * item.wsfuTotalEach).toFixed(1)} WSFU
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 flex items-center justify-center"
                            onClick={() => handleRemoveRow(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-300 rounded-lg text-slate-500 text-xs">
                No fixtures in schedule. Select a fixture above or click a preset.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Results Hero & Hydraulic Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {calculationResult ? (
            <>
              {/* Primary Results Hero Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                  <span>Recommended Main Sizing</span>
                  <span>{calculationResult.codeStandard} Method</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black font-mono text-white">
                    {calculationResult.recommendedMainPipeSizeInches}&quot;
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    Main Water Supply Line
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/80 text-xs">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Total Load (WSFU)</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">
                      {calculationResult.totalCalculatedWsfu} WSFU
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {calculationResult.totalColdWsfu} Cold / {calculationResult.totalHotWsfu} Hot
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Peak Design Flow</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">
                      {calculationResult.totalDesignFlowGpm} GPM
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Hunter&apos;s Curve Demand
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Water Velocity</span>
                    <span className="text-lg font-bold font-mono text-white">
                      {calculationResult.velocityAtRecommendedSizeFps} FPS
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Limit: 8.0 FPS (Copper) / 10.0 (PEX)
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Residual Pressure</span>
                    <span className="text-lg font-bold font-mono text-amber-400">
                      {calculationResult.actualResidualPressurePsi} PSI
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Min Req: {calculationResult.minResidualPressurePsi} PSI
                    </span>
                  </div>
                </div>

                {/* Branch Sizing Summary */}
                <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <div className="font-bold text-slate-300 mb-1">Recommended Branch Lines:</div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cold Water Main Branch:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {calculationResult.minColdBranchSizeInches}&quot;
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 mt-1">
                    <span>Hot Water Main Branch:</span>
                    <span className="font-mono font-bold text-rose-400">
                      {calculationResult.minHotBranchSizeInches}&quot;
                    </span>
                  </div>
                </div>

                {/* Copy & Print Action Buttons */}
                <div className="flex items-center gap-2 mt-5">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border-slate-600 text-white"
                    onClick={handleCopyTakeoff}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedTakeoff ? "Copied Report!" : "Copy Summary"}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border-slate-600 text-white"
                    onClick={handlePrint}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print</span>
                  </Button>
                </div>
              </div>

              {/* Warnings Card */}
              {calculationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  {calculationResult.warnings.map((warn, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                        warn.code.includes("INSUFFICIENT") || warn.code.includes("HIGH_STATIC")
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-blue-50 border-blue-200 text-blue-900"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <div className="font-bold">{warn.code.replace(/_/g, " ")}</div>
                        <div className="text-[11px] leading-relaxed mt-0.5">{warn.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Candidate Evaluation Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pipe Diameter Comparison Table</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2 text-right">Vel (FPS)</th>
                        <th className="p-2 text-right">Loss (PSI)</th>
                        <th className="p-2 text-right">Residual</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculationResult.candidateEvaluations.map((cand) => (
                        <tr
                          key={cand.sizeInches}
                          className={
                            cand.sizeInches === calculationResult.recommendedMainPipeSizeInches
                              ? "bg-cyan-50 font-bold"
                              : ""
                          }
                        >
                          <td className="p-2 font-mono">{cand.sizeInches}&quot;</td>
                          <td className="p-2 text-right font-mono">{cand.velocityFps}</td>
                          <td className="p-2 text-right font-mono">{cand.totalFrictionLossPsi}</td>
                          <td className="p-2 text-right font-mono">{cand.residualPressureAtFixturePsi}</td>
                          <td className="p-2 text-center">
                            {cand.isCompliant ? (
                              <span className="text-emerald-600 font-semibold text-[11px]">Pass</span>
                            ) : (
                              <span className="text-rose-600 font-semibold text-[11px]">Fail</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-100 rounded-xl p-8 text-center text-slate-500 text-sm">
              Enter fixture schedule to generate water supply sizing calculation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
