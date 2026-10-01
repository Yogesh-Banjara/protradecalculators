"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export interface MotorSolutionCalculatorProps {
  initialInputs?: {
    horsepower?: number;
    voltage?: number;
    phase?: number;
  };
}

// NEC Table 430.250 Full-Load Current (FLC) for 3-Phase AC Induction Motors
const NEC_TABLE_430_250: Record<number, Record<number, number>> = {
  1: { 208: 4.0, 230: 3.6, 460: 1.8 },
  2: { 208: 7.5, 230: 6.8, 460: 3.4 },
  3: { 208: 10.6, 230: 9.6, 460: 4.8 },
  5: { 208: 16.7, 230: 15.2, 460: 7.6 },
  7.5: { 208: 24.2, 230: 22.0, 460: 11.0 },
  10: { 208: 30.8, 230: 28.0, 460: 14.0 },
  15: { 208: 46.2, 230: 42.0, 460: 21.0 },
  20: { 208: 59.4, 230: 54.0, 460: 27.0 },
  25: { 208: 74.8, 230: 68.0, 460: 34.0 },
  30: { 208: 88.0, 230: 80.0, 460: 40.0 },
  40: { 208: 114.0, 230: 104.0, 460: 52.0 },
  50: { 208: 143.0, 230: 130.0, 460: 65.0 },
};

// Single-phase Table 430.248 fallback
const NEC_TABLE_430_248: Record<number, Record<number, number>> = {
  1: { 115: 16.0, 230: 8.0 },
  2: { 115: 24.0, 230: 12.0 },
  3: { 115: 34.0, 230: 17.0 },
  5: { 115: 56.0, 230: 28.0 },
  7.5: { 115: 80.0, 230: 40.0 },
  10: { 115: 100.0, 230: 50.0 },
};

const STANDARD_BREAKER_SIZES = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250];

export function MotorSolutionCalculator({ initialInputs }: MotorSolutionCalculatorProps) {
  const defaultHp = initialInputs?.horsepower ?? 20;
  const defaultVoltage = initialInputs?.voltage ?? 230;
  const defaultPhase = initialInputs?.phase ?? 3;

  const [horsepower, setHorsepower] = useState<number>(defaultHp);
  const [voltage, setVoltage] = useState<number>(defaultVoltage);
  const [phase, setPhase] = useState<number>(defaultPhase);

  const results = useMemo(() => {
    let flc = 0;
    if (phase === 3) {
      const tableHp = NEC_TABLE_430_250[horsepower];
      if (tableHp) {
        flc = tableHp[voltage] ?? tableHp[230] ?? 54.0;
      } else {
        flc = Number(((horsepower * 746) / (1.732 * voltage * 0.85)).toFixed(1));
      }
    } else {
      const tableHp = NEC_TABLE_430_248[horsepower];
      if (tableHp) {
        flc = tableHp[voltage] ?? tableHp[230] ?? 28.0;
      } else {
        flc = Number(((horsepower * 746) / (voltage * 0.85)).toFixed(1));
      }
    }

    const branchAmpacity = Number((flc * 1.25).toFixed(1));

    // Inverse time breaker (max 250% per NEC Table 430.52)
    const maxBreakerAmps = flc * 2.5;
    const recommendedBreaker =
      STANDARD_BREAKER_SIZES.slice().reverse().find((b) => b <= maxBreakerAmps) ??
      STANDARD_BREAKER_SIZES.find((b) => b >= maxBreakerAmps) ??
      Math.floor(maxBreakerAmps);

    // Conductor sizing based on 75°C Copper (NEC Table 310.16)
    let wireGauge = "14 AWG copper";
    if (branchAmpacity > 200) wireGauge = "4/0 AWG copper";
    else if (branchAmpacity > 175) wireGauge = "3/0 AWG copper";
    else if (branchAmpacity > 150) wireGauge = "2/0 AWG copper";
    else if (branchAmpacity > 130) wireGauge = "1/0 AWG copper";
    else if (branchAmpacity > 115) wireGauge = "1 AWG copper";
    else if (branchAmpacity > 100) wireGauge = "2 AWG copper";
    else if (branchAmpacity > 85) wireGauge = "3 AWG copper";
    else if (branchAmpacity > 65) wireGauge = "4 AWG copper";
    else if (branchAmpacity > 50) wireGauge = "6 AWG copper";
    else if (branchAmpacity > 30) wireGauge = "8 AWG copper";
    else if (branchAmpacity > 20) wireGauge = "10 AWG copper";
    else if (branchAmpacity > 15) wireGauge = "12 AWG copper";

    return {
      flc,
      branchAmpacity,
      wireGauge,
      recommendedBreaker,
    };
  }, [horsepower, voltage, phase]);

  const handleReset = () => {
    setHorsepower(defaultHp);
    setVoltage(defaultVoltage);
    setPhase(defaultPhase);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Interactive Motor Demand &amp; Conductor Sizer</h3>
            <p className="text-xs text-slate-400">Pre-loaded with NEC Table 430.250 &amp; NEC 430.22 values</p>
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
          <FormField id="motor-hp" label="Motor Horsepower (HP)" helperText="Standard NEMA motor rating">
            <select
              id="motor-hp"
              value={horsepower}
              onChange={(e) => setHorsepower(parseFloat(e.target.value))}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            >
              {[1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50].map((hp) => (
                <option key={hp} value={hp}>
                  {hp} HP {hp === 20 ? "(Scenario Target)" : ""}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="motor-voltage" label="Supply Voltage" helperText="Motor operating voltage">
              <select
                id="motor-voltage"
                value={voltage}
                onChange={(e) => setVoltage(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              >
                <option value={208}>208 V</option>
                <option value={230}>230 V (Standard 240V system)</option>
                <option value={460}>460 V (Standard 480V system)</option>
              </select>
            </FormField>

            <FormField id="motor-phase" label="System Phase" helperText="Single or three-phase">
              <select
                id="motor-phase"
                value={phase}
                onChange={(e) => setPhase(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              >
                <option value={3}>3-Phase (Table 430.250)</option>
                <option value={1}>1-Phase (Table 430.248)</option>
              </select>
            </FormField>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p>
              NEC 430.6(A)(1) mandates that conductor ampacity and breaker sizing MUST be based on the NEC table values (Table 430.250), not the motor nameplate current.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">NEC Calculated Results</span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Table 430.250
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-500 block">Table FLC</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {results.flc} <span className="text-sm font-normal text-slate-500">A</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Running Full-Load Current</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 shadow-sm">
                <span className="text-[11px] font-bold text-amber-800 block">Conductor Ampacity (125%)</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-950">
                  {results.branchAmpacity} <span className="text-sm font-normal text-amber-700">A</span>
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5 font-mono">
                  {results.flc}A × 1.25 per NEC 430.22
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Minimum Conductor Gauge (75°C):</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                  {results.wireGauge}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Max Inverse Time Breaker (250%):</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                  {results.recommendedBreaker} Ampere
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5">
                <span className="text-slate-600 font-medium">Code Governing Article:</span>
                <span className="font-medium text-slate-700 text-right">
                  NEC Table 430.250 &amp; NEC 430.22
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic text-center pt-2">
            Select any HP or voltage above to test different motor service and feeder scenarios.
          </div>
        </div>
      </div>
    </div>
  );
}
