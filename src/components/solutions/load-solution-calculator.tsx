"use client";

import React, { useState, useMemo } from "react";
import { Zap, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export interface LoadSolutionCalculatorProps {
  initialInputs?: {
    wattage?: number;
    voltage?: number;
    continuous?: boolean;
  };
}

const STANDARD_BREAKER_SIZES = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 125, 150];

export function LoadSolutionCalculator({ initialInputs }: LoadSolutionCalculatorProps) {
  const defaultWattage = initialInputs?.wattage ?? 7000;
  const defaultVoltage = initialInputs?.voltage ?? 240;
  const defaultContinuous = initialInputs?.continuous ?? true;

  const [wattage, setWattage] = useState<number>(defaultWattage);
  const [voltage, setVoltage] = useState<number>(defaultVoltage);
  const [continuous, setContinuous] = useState<boolean>(defaultContinuous);

  const results = useMemo(() => {
    const validWattage = Math.max(0, wattage || 0);
    const validVoltage = Math.max(1, voltage || 240);

    const baseAmps = validWattage / validVoltage;
    const factor = continuous ? 1.25 : 1.0;
    const designAmps = baseAmps * factor;

    // Standard overcurrent protection sizing
    const minBreaker = STANDARD_BREAKER_SIZES.find((b) => b >= designAmps) ?? Math.ceil(designAmps / 10) * 10;

    let wireRecommendation = "14 AWG Copper";
    if (minBreaker > 100) wireRecommendation = "1 AWG Copper";
    else if (minBreaker > 70) wireRecommendation = "3 AWG Copper";
    else if (minBreaker > 60) wireRecommendation = "4 AWG Copper";
    else if (minBreaker > 50) wireRecommendation = "6 AWG Copper";
    else if (minBreaker > 30) wireRecommendation = "8 AWG Copper";
    else if (minBreaker > 20) wireRecommendation = "10 AWG Copper";
    else if (minBreaker > 15) wireRecommendation = "12 AWG Copper";

    return {
      baseAmps: Number(baseAmps.toFixed(2)),
      factor,
      designAmps: Number(designAmps.toFixed(2)),
      minBreaker,
      wireRecommendation,
    };
  }, [wattage, voltage, continuous]);

  const handleReset = () => {
    setWattage(defaultWattage);
    setVoltage(defaultVoltage);
    setContinuous(defaultContinuous);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Interactive Electric Load Calculator</h3>
            <p className="text-xs text-slate-400">Pre-loaded with NEC 220.51 &amp; 424.3(B) parameters</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
        </Button>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-4">
          <FormField id="load-wattage" label="Equipment Rated Power (Watts)" helperText="Nameplate wattage of the heating unit or load">
            <Input
              id="load-wattage"
              type="number"
              min={100}
              max={100000}
              step={100}
              value={wattage || ""}
              onChange={(e) => setWattage(parseFloat(e.target.value) || 0)}
              className="font-mono text-base"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="load-voltage" label="Supply Voltage (Volts)" helperText="Line-to-line or line-to-neutral">
              <select
                id="load-voltage"
                value={voltage}
                onChange={(e) => setVoltage(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              >
                <option value={120}>120 V (Standard Branch)</option>
                <option value={208}>208 V (Commercial Single-Phase)</option>
                <option value={240}>240 V (Residential Baseboard/Range)</option>
                <option value={277}>277 V (Commercial Lighting)</option>
                <option value={480}>480 V (Industrial)</option>
              </select>
            </FormField>

            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={continuous}
                  onChange={(e) => setContinuous(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Continuous Load (125% per NEC 424.3(B))
                </span>
              </label>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p>
              NEC 424.3(B) mandates that fixed electric space heating equipment branch circuits must be sized at 125% of the total load current.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calculated Output</span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Live Recalculation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-500 block">Base Running Current</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {results.baseAmps} <span className="text-sm font-normal text-slate-500">A</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{wattage}W ÷ {voltage}V</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 shadow-sm">
                <span className="text-[11px] font-bold text-amber-800 block">Required Ampacity (125%)</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-950">
                  {results.designAmps} <span className="text-sm font-normal text-amber-700">A</span>
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5 font-mono">
                  {results.baseAmps}A × {results.factor}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Minimum Circuit Breaker:</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                  {results.minBreaker} Ampere
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Recommended Conductor (75°C Cu):</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                  {results.wireRecommendation}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5">
                <span className="text-slate-600 font-medium">Overcurrent Protection Rule:</span>
                <span className="font-medium text-slate-700 text-right">
                  NEC 240.4 &amp; 424.3(B)
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic text-center pt-2">
            Adjust wattage or voltage on the left to recalculate continuous service loads instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
