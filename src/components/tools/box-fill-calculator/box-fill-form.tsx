"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  BoxFillInput,
  BoxFillResult,
  ConductorFillRow,
  DeviceYokeEntry,
} from "@/types/box-fill";
import type { WireGaugeSize } from "@/types/electrical";
import {
  STANDARD_BOXES,
  STANDARD_MUD_RINGS,
} from "@/data/references/box-fill-types";
import { calculateBoxFillProject } from "@/lib/calculations/box-fill";
import { BoxFillDiagram } from "./box-fill-diagram";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
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
  Zap,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
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
];

const PRESETS = [
  {
    label: "Single Switch (14 AWG)",
    conductors: [{ id: "1", size: "14 AWG" as WireGaugeSize, count: 2, isPigtail: false }],
    devices: [{ id: "dev-1", name: "Single-Pole Switch", largestConnectedSize: "14 AWG" as WireGaugeSize, gangCount: 1 }],
    grounds: 1,
    clamps: 1,
    boxId: "plastic-1g-18",
  },
  {
    label: "Duplex Receptacle (12 AWG)",
    conductors: [{ id: "1", size: "12 AWG" as WireGaugeSize, count: 4, isPigtail: false }],
    devices: [{ id: "dev-1", name: "Duplex Outlet", largestConnectedSize: "12 AWG" as WireGaugeSize, gangCount: 1 }],
    grounds: 2,
    clamps: 0,
    boxId: "plastic-1g-20",
  },
  {
    label: "3-Way Switch (14 AWG)",
    conductors: [
      { id: "1", size: "14 AWG" as WireGaugeSize, count: 3, isPigtail: false },
      { id: "2", size: "14 AWG" as WireGaugeSize, count: 2, isPigtail: false },
    ],
    devices: [{ id: "dev-1", name: "3-Way Switch", largestConnectedSize: "14 AWG" as WireGaugeSize, gangCount: 1 }],
    grounds: 2,
    clamps: 1,
    boxId: "plastic-1g-20",
  },
  {
    label: '4" Square Junction Box (12 AWG)',
    conductors: [{ id: "1", size: "12 AWG" as WireGaugeSize, count: 8, isPigtail: false }],
    devices: [],
    grounds: 2,
    clamps: 0,
    boxId: "square-4-1-1-2",
  },
  {
    label: "Mixed-Gauge (12 + 14 AWG)",
    conductors: [
      { id: "1", size: "12 AWG" as WireGaugeSize, count: 4, isPigtail: false },
      { id: "2", size: "14 AWG" as WireGaugeSize, count: 2, isPigtail: false },
    ],
    devices: [{ id: "dev-1", name: "GFCI Receptacle", largestConnectedSize: "12 AWG" as WireGaugeSize, gangCount: 1 }],
    grounds: 2,
    clamps: 1,
    boxId: "square-4-1-1-2",
  },
];

export function BoxFillCalculatorForm() {
  const [conductors, setConductors] = useState<ConductorFillRow[]>([
    { id: "c-1", size: "12 AWG", count: 4, isPigtail: false },
  ]);
  const [devices, setDevices] = useState<DeviceYokeEntry[]>([
    { id: "dev-1", name: "Duplex Receptacle", largestConnectedSize: "12 AWG", gangCount: 1 },
  ]);
  const [equipmentGroundsCount, setEquipmentGroundsCount] = useState<number>(2);
  const [largestGroundSize, setLargestGroundSize] = useState<WireGaugeSize>("12 AWG");
  const [internalClampsCount, setInternalClampsCount] = useState<number>(0);
  const [supportFittingsCount, setSupportFittingsCount] = useState<number>(0);
  const [isolatedGroundsCount, setIsolatedGroundsCount] = useState<number>(0);

  const [selectedBoxId, setSelectedBoxId] = useState<string>("square-4-1-1-2");
  const [selectedMudRingId, setSelectedMudRingId] = useState<string>("none");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    trackCalculatorStarted("box-fill-calculator", "electrical");
  }, []);

  const calculationResult: {
    result?: BoxFillResult;
    error?: string;
  } = useMemo(() => {
    try {
      const input: BoxFillInput = {
        conductors,
        internalClampsCount,
        supportFittingsCount,
        devices,
        equipmentGroundsCount,
        largestGroundSize,
        isolatedGroundsCount,
        selectedBoxId,
        selectedMudRingId,
      };
      const res = calculateBoxFillProject(input);
      return { result: res };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Calculation error";
      return { error: msg };
    }
  }, [
    conductors,
    internalClampsCount,
    supportFittingsCount,
    devices,
    equipmentGroundsCount,
    largestGroundSize,
    isolatedGroundsCount,
    selectedBoxId,
    selectedMudRingId,
  ]);

  useEffect(() => {
    if (calculationResult.result) {
      trackResultGenerated("box-fill-calculator", "electrical", {
        hasWarnings: calculationResult.result.warnings.length > 0,
        primaryUnit: "cubic_inches",
      });
    }
  }, [calculationResult.result]);

  const resetAll = () => {
    setConductors([{ id: "c-1", size: "12 AWG", count: 4, isPigtail: false }]);
    setDevices([{ id: "dev-1", name: "Duplex Receptacle", largestConnectedSize: "12 AWG", gangCount: 1 }]);
    setEquipmentGroundsCount(2);
    setLargestGroundSize("12 AWG");
    setInternalClampsCount(0);
    setSupportFittingsCount(0);
    setIsolatedGroundsCount(0);
    setSelectedBoxId("square-4-1-1-2");
    setSelectedMudRingId("none");
    setShowAdvanced(false);
  };

  const addConductorRow = () => {
    const newId = `c-${Date.now()}`;
    setConductors([...conductors, { id: newId, size: "14 AWG", count: 2, isPigtail: false }]);
  };

  const removeConductorRow = (id: string) => {
    if (conductors.length <= 1) return;
    setConductors(conductors.filter((c) => c.id !== id));
  };

  const updateConductorRow = (
    id: string,
    field: keyof ConductorFillRow,
    val: string | number | boolean
  ) => {
    setConductors(
      conductors.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const addDevice = () => {
    const newId = `dev-${Date.now()}`;
    setDevices([
      ...devices,
      { id: newId, name: "Switch / Outlet", largestConnectedSize: "12 AWG", gangCount: 1 },
    ]);
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const updateDevice = (
    id: string,
    field: keyof DeviceYokeEntry,
    val: string | number
  ) => {
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, [field]: val } : d))
    );
  };

  const copySummaryToClipboard = () => {
    if (!calculationResult.result) return;
    const res = calculationResult.result;

    const summaryLines = [
      "ELECTRICAL BOX FILL TAKEOFF (NEC 314.16)",
      "========================================",
      `Total Required Box Volume: ${res.totalRequiredVolumeCuIn} cu in`,
      `Selected Box: ${res.selectedBox?.name ?? "Custom Box"} (${res.baseBoxVolumeCuIn} cu in)`,
      `Mud Ring Addition: ${res.selectedMudRing?.name ?? "None"} (+${res.mudRingVolumeCuIn} cu in)`,
      `Total Available Capacity: ${res.totalAvailableVolumeCuIn} cu in`,
      `Status: ${res.isCompliant ? "COMPLIANT (PASS)" : "NON-COMPLIANT (OVERFILL)"} (${res.fillPercentage}% Fill)`,
      `Recommended Smallest Box: ${res.recommendedBox.name} (${res.recommendedTotalAvailableVolumeCuIn} cu in)`,
      "Detailed NEC 314.16(B) Deductions:",
      `  • Conductor Fill: ${res.breakdown.conductorVolumeCuIn} cu in (${res.totalConductorCount} wires)`,
      `  • Device Yokes: ${res.breakdown.deviceVolumeCuIn} cu in (${res.breakdown.deviceYokeAllowanceCount} allowances)`,
      `  • Equipment Grounds: ${res.breakdown.groundVolumeCuIn} cu in (${res.breakdown.groundAllowanceCount} allowance)`,
      `  • Internal Clamps: ${res.breakdown.clampVolumeCuIn} cu in (${res.breakdown.clampAllowanceCount} allowance)`,
      ...(res.breakdown.fittingVolumeCuIn > 0 ? [`  • Support Fittings: ${res.breakdown.fittingVolumeCuIn} cu in`] : []),
      "",
      "Reference: NEC 2023 Section 314.16 Box Volume Allowances",
    ];

    navigator.clipboard.writeText(summaryLines.join("\n"));
    setCopied(true);
    trackCopyResult("box-fill-calculator", "electrical", "projectSummary");
    setTimeout(() => setCopied(false), 2500);
  };

  const { result, error } = calculationResult;

  return (
    <div className="space-y-8">
      {/* Print Header */}
      <JobsitePrintHeader
        title="Electrical Box Fill & Rough-In Inspection Worksheet"
        category="Electrical & Conduit"
      />

      {/* Main Form Section */}
      <div className="space-y-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-slate-100 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              Conductors, Devices &amp; Box Configuration
            </h2>
            <p className="text-xs text-slate-300">
              Calculate cubic-inch box fill under NEC 314.16 for mixed wire sizes, device yokes, clamps, and grounds.
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

        {/* Quick Circuit Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg border border-slate-200 bg-white text-xs">
          <span className="text-slate-500 font-bold mr-1">Quick Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setConductors(
                  preset.conductors.map((c, i) => ({ ...c, id: `c-${Date.now()}-${i}` }))
                );
                setDevices(
                  preset.devices.map((d, i) => ({ ...d, id: `dev-${Date.now()}-${i}` }))
                );
                setEquipmentGroundsCount(preset.grounds);
                setInternalClampsCount(preset.clamps);
                setSelectedBoxId(preset.boxId);
              }}
              className="text-[11px] px-2 py-0.5 rounded border bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Dynamic Mixed Conductor Schedule */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-600" />
              1. Conductor Schedule (Circuit Wires Entering Box)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addConductorRow}
              className="text-xs text-slate-800 border-slate-300 bg-slate-50 hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Wire Row
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Wire Gauge (AWG)</th>
                  <th className="p-2.5 w-28">Wire Count</th>
                  <th className="p-2.5 w-32 text-center">Pigtail / Origin</th>
                  <th className="p-2.5 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conductors.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2">
                      <select
                        value={row.size}
                        onChange={(e) =>
                          updateConductorRow(row.id, "size", e.target.value as WireGaugeSize)
                        }
                        aria-label="Wire Gauge"
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                      >
                        {WIRE_GAUGE_OPTIONS.map((gauge) => (
                          <option key={gauge} value={gauge}>
                            {gauge}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={row.count || ""}
                        onChange={(e) =>
                          updateConductorRow(
                            row.id,
                            "count",
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        aria-label="Wire Quantity"
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                      />
                    </td>

                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateConductorRow(row.id, "isPigtail", !row.isPigtail)
                        }
                        className={`text-[11px] px-2 py-1 rounded font-bold transition-colors ${
                          row.isPigtail
                            ? "bg-slate-200 text-slate-700 border border-slate-300"
                            : "bg-amber-50 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {row.isPigtail ? "Pigtail (0 cu in)" : "Active Wire (1×)"}
                      </button>
                    </td>

                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeConductorRow(row.id)}
                        disabled={conductors.length <= 1}
                        aria-label="Delete Wire Row"
                        className={`p-1.5 rounded text-slate-400 hover:text-rose-600 transition-colors ${
                          conductors.length <= 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
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

        {/* Device Yokes & Grounding Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Device Yokes Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                2. Device Yokes (NEC 314.16(B)(4) - 2× Allowance)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addDevice}
                className="text-[11px] py-0.5 px-2 border-slate-300 bg-slate-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Device
              </Button>
            </div>

            {devices.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded">
                No devices installed (e.g. blank junction box or pull box).
              </p>
            ) : (
              <div className="space-y-2">
                {devices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">
                          Device Type / Gang
                        </label>
                        <select
                          value={dev.gangCount}
                          onChange={(e) =>
                            updateDevice(dev.id, "gangCount", parseInt(e.target.value, 10))
                          }
                          aria-label="Device Gang Count"
                          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                        >
                          <option value={1}>Single-Gang (2×)</option>
                          <option value={2}>Double-Gang (4×)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-0.5">
                          Largest Connected Wire
                        </label>
                        <select
                          value={dev.largestConnectedSize}
                          onChange={(e) =>
                            updateDevice(
                              dev.id,
                              "largestConnectedSize",
                              e.target.value as WireGaugeSize
                            )
                          }
                          aria-label="Largest Connected Conductor"
                          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                        >
                          {WIRE_GAUGE_OPTIONS.map((gauge) => (
                            <option key={gauge} value={gauge}>
                              {gauge}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDevice(dev.id)}
                      aria-label="Remove Device"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grounds, Clamps & Fittings Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              3. Grounds &amp; Internal Hardware
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Equipment Grounds Count */}
              <div>
                <label htmlFor="grounds-count" className="font-bold text-slate-700 block mb-1">
                  Equipment Grounds
                </label>
                <input
                  id="grounds-count"
                  type="number"
                  min="0"
                  max="20"
                  value={equipmentGroundsCount}
                  onChange={(e) => setEquipmentGroundsCount(parseInt(e.target.value, 10) || 0)}
                  aria-label="Equipment Grounds Count"
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                />
                <span className="text-[10px] text-slate-500 block pt-0.5">
                  1 allowance for &le; 4 grounds
                </span>
              </div>

              {/* Largest Ground Size */}
              <div>
                <label htmlFor="largest-ground" className="font-bold text-slate-700 block mb-1">
                  Largest Ground Size
                </label>
                <select
                  id="largest-ground"
                  value={largestGroundSize}
                  onChange={(e) => setLargestGroundSize(e.target.value as WireGaugeSize)}
                  aria-label="Largest Ground Conductor Size"
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                >
                  {WIRE_GAUGE_OPTIONS.map((gauge) => (
                    <option key={gauge} value={gauge}>
                      {gauge}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Cable Clamps */}
              <div>
                <label htmlFor="internal-clamps" className="font-bold text-slate-700 block mb-1">
                  Internal Cable Clamps
                </label>
                <select
                  id="internal-clamps"
                  value={internalClampsCount}
                  onChange={(e) => setInternalClampsCount(parseInt(e.target.value, 10))}
                  aria-label="Internal Cable Clamps"
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800"
                >
                  <option value={0}>0 (External Connectors / Conduit)</option>
                  <option value={1}>1 or More Clamps (1× Allowance)</option>
                </select>
              </div>

              {/* Support Fittings / Fixture Studs */}
              <div>
                <label htmlFor="support-fittings" className="font-bold text-slate-700 block mb-1">
                  Fixture Studs / Hickeys
                </label>
                <input
                  id="support-fittings"
                  type="number"
                  min="0"
                  max="4"
                  value={supportFittingsCount}
                  onChange={(e) => setSupportFittingsCount(parseInt(e.target.value, 10) || 0)}
                  aria-label="Support Fittings Count"
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Box & Mud Ring Selection Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box Type Selector */}
            <div>
              <label htmlFor="box-select" className="text-xs font-bold text-slate-700 block mb-1">
                4. Select Electrical Box (NEC Table 314.16(A) &amp; Listed Nonmetallic)
              </label>
              <select
                id="box-select"
                value={selectedBoxId}
                onChange={(e) => setSelectedBoxId(e.target.value)}
                aria-label="Electrical Box Type"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                {STANDARD_BOXES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.standardVolumeCuIn} cu in
                  </option>
                ))}
              </select>
            </div>

            {/* Mud / Plaster Ring Selector */}
            <div>
              <label htmlFor="ring-select" className="text-xs font-bold text-slate-700 block mb-1">
                Mud / Plaster Ring Extension (Listed Volume Addition)
              </label>
              <select
                id="ring-select"
                value={selectedMudRingId}
                onChange={(e) => setSelectedMudRingId(e.target.value)}
                aria-label="Mud Ring Extension"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                {STANDARD_MUD_RINGS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Disclosure for Isolated Grounds */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Layers className="h-3.5 w-3.5 text-amber-600" />
              {showAdvanced ? "Hide" : "Show"} Advanced Options (Isolated Grounds &amp; Commercial Equipment)
              {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showAdvanced && (
              <div className="p-3 mt-2 rounded bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="max-w-xs">
                  <label htmlFor="ig-grounds" className="font-bold text-slate-700 block mb-1">
                    Isolated Equipment Ground Conductors (IG Circuits)
                  </label>
                  <input
                    id="ig-grounds"
                    type="number"
                    min="0"
                    max="10"
                    value={isolatedGroundsCount}
                    onChange={(e) => setIsolatedGroundsCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    Counted as a separate grounding set per NEC 314.16(B)(5).
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" title="Input Incomplete or Invalid">
          {error}. Please check your conductor quantities.
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          {/* Primary Hero Results Panel */}
          <div className="rounded-xl border-2 border-amber-500/50 bg-slate-950 text-slate-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Required Box Volume &amp; Capacity Evaluation
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                NEC 314.16 Calibrated &bull; {result.totalConductorCount} Conductors
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Volume Hero */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Total Required Enclosure Volume:
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight">
                    {result.totalRequiredVolumeCuIn} cu in
                  </span>
                  <span
                    className={`text-xl sm:text-2xl font-bold ${
                      result.isCompliant ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {result.isCompliant ? "(WITHIN VOLUME CAPACITY)" : "(EXCEEDS VOLUME CAPACITY)"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Selected box provides{" "}
                  <span className="text-slate-100 font-mono font-semibold">
                    {result.totalAvailableVolumeCuIn} cu in
                  </span>{" "}
                  ({result.baseBoxVolumeCuIn} cu in box + {result.mudRingVolumeCuIn} cu in ring) &bull;{" "}
                  <span
                    className={
                      result.isCompliant ? "text-emerald-400 font-bold font-mono" : "text-rose-400 font-bold font-mono"
                    }
                  >
                    {result.fillPercentage}% volume filled
                  </span>.
                </p>
              </div>

              {/* Specs Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Conductor Fill</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {result.breakdown.conductorVolumeCuIn}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">cu in</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Device Yokes</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {result.breakdown.deviceVolumeCuIn}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">cu in</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Grounds &amp; Clamps</span>
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {(
                      result.breakdown.groundVolumeCuIn +
                      result.breakdown.clampVolumeCuIn +
                      result.breakdown.fittingVolumeCuIn
                    ).toFixed(2)}{" "}
                    <span className="text-xs font-sans text-slate-400 font-normal">cu in</span>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Recommended Min Box</span>
                  <span className="text-sm font-bold text-amber-300 block truncate">
                    {result.recommendedBox.tradeDimensions}
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
                    toolSlug="box-fill-calculator"
                    category="electrical"
                    label="Print Box Fill Worksheet"
                    className="text-slate-200 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  />
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  NEC Article 314.16 (2020/2023) Calibrated
                </span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Box Blueprint */}
          <BoxFillDiagram result={result} />

          {/* Candidate Standard Box Comparison Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-600" />
                Standard Box Capacity Comparison Matrix (NEC Table 314.16(A))
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {result.totalRequiredVolumeCuIn} cu in Required
              </span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Box Description</TableHead>
                  <TableHead className="text-right">Base Box Volume</TableHead>
                  <TableHead className="text-right">Ring Volume</TableHead>
                  <TableHead className="text-right">Total Available</TableHead>
                  <TableHead className="text-right">Fill %</TableHead>
                  <TableHead className="text-right">Remaining Space</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.candidates.map((cand) => {
                  const isRec = cand.status === "recommended";
                  return (
                    <TableRow
                      key={cand.box.id}
                      className={isRec ? "bg-amber-50/80 font-semibold" : undefined}
                    >
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                        {cand.box.name}
                        {isRec && (
                          <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        {cand.baseVolumeCuIn} cu in
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700 text-xs">
                        +{cand.mudRingVolumeCuIn} cu in
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-900 text-xs font-bold">
                        {cand.totalAvailableVolumeCuIn} cu in
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold">
                        <span
                          className={
                            cand.fillPercentage <= 100
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }
                        >
                          {cand.fillPercentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-900 text-xs">
                        {cand.remainingVolumeCuIn >= 0
                          ? `+${cand.remainingVolumeCuIn} cu in`
                          : `${cand.remainingVolumeCuIn} cu in`}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            cand.status === "recommended"
                              ? "bg-amber-500 text-slate-950"
                              : cand.status === "pass"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {cand.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Safety & NEC Code Notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-950 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>NEC 314.16 Electrical Code &amp; Safety Disclaimer:</strong> This calculation is for design and rough-in planning only. Metallic and nonmetallic boxes marked with manufacturer-listed cubic-inch capacities take precedence over generic table estimates. Final rough-in inspection compliance must be verified by the local electrical inspector / Authority Having Jurisdiction (AHJ).
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
