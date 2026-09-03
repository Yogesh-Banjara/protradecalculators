"use client";

import React from "react";
import type { VoltageDropCalculationResult } from "@/types/electrical";

export interface VoltageDropDiagramProps {
  result: VoltageDropCalculationResult;
}

export function VoltageDropDiagram({ result }: VoltageDropDiagramProps) {
  const {
    systemVoltage,
    loadCurrentAmps,
    oneWayDistanceFt,
    recommendedSize,
    conductorMaterial,
    voltageDropVolts,
    voltageDropPercent,
    voltageAtLoad,
    targetMaxVoltageDropPercent,
    phase,
  } = result;

  const svgWidth = 520;
  const svgHeight = 220;
  const sourceX = 60;
  const sourceY = 90;
  const loadX = 460;
  const loadY = 90;

  // Status color determination
  const isPass = voltageDropPercent <= targetMaxVoltageDropPercent;
  const isWarning = !isPass && voltageDropPercent <= 5.0;
  const statusColor = isPass ? "#10b981" : isWarning ? "#f59e0b" : "#ef4444";
  const statusText = isPass ? "PASS (< 3%)" : isWarning ? "WARNING (3%–5%)" : "FAIL (> 5%)";

  const phaseLabel =
    phase === "three_phase"
      ? "3-Phase AC"
      : phase === "dc"
      ? "Direct Current (DC)"
      : "Single-Phase AC";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
          Circuit Voltage Drop &amp; Conductor Schematic
        </h4>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
            style={{
              color: statusColor,
              backgroundColor: `${statusColor}15`,
              borderColor: `${statusColor}40`,
            }}
          >
            {statusText}
          </span>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {phaseLabel}
          </span>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="w-full overflow-hidden bg-slate-950 rounded-md p-4 text-amber-400">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-56 select-none font-mono"
          aria-label="Electrical voltage drop circuit diagram"
        >
          {/* Source Panel Box */}
          <rect
            x={sourceX - 45}
            y={sourceY - 50}
            width={70}
            height={100}
            rx="4"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text
            x={sourceX - 10}
            y={sourceY - 32}
            fill="#38bdf8"
            fontSize="9"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            SOURCE
          </text>
          <text
            x={sourceX - 10}
            y={sourceY - 12}
            fill="#f8fafc"
            fontSize="14"
            textAnchor="middle"
            fontWeight="bold"
          >
            {systemVoltage}V
          </text>
          <text
            x={sourceX - 10}
            y={sourceY + 8}
            fill="#94a3b8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Main Panel
          </text>
          <text
            x={sourceX - 10}
            y={sourceY + 32}
            fill="#fbbf24"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            {loadCurrentAmps}A
          </text>

          {/* Load / Subpanel Box */}
          <rect
            x={loadX - 25}
            y={loadY - 50}
            width={70}
            height={100}
            rx="4"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text
            x={loadX + 10}
            y={loadY - 32}
            fill="#38bdf8"
            fontSize="9"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            LOAD
          </text>
          <text
            x={loadX + 10}
            y={loadY - 12}
            fill="#f8fafc"
            fontSize="14"
            textAnchor="middle"
            fontWeight="bold"
          >
            {voltageAtLoad}V
          </text>
          <text
            x={loadX + 10}
            y={loadY + 8}
            fill="#94a3b8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Equipment / Sub
          </text>
          <text
            x={loadX + 10}
            y={loadY + 32}
            fill="#cbd5e1"
            fontSize="9"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Delivered
          </text>

          {/* Conductor Line (Top Wire) */}
          <line
            x1={sourceX + 25}
            y1={sourceY - 15}
            x2={loadX - 25}
            y2={loadY - 15}
            stroke={statusColor}
            strokeWidth="3.5"
          />

          {/* Conductor Line (Return / Neutral Wire) */}
          <line
            x1={sourceX + 25}
            y1={sourceY + 15}
            x2={loadX - 25}
            y2={loadY + 15}
            stroke={statusColor}
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />

          {/* Distance Dimension Bar */}
          <line
            x1={sourceX + 35}
            y1={sourceY + 50}
            x2={loadX - 35}
            y2={loadY + 50}
            stroke="#64748b"
            strokeWidth="1"
          />
          <circle cx={sourceX + 35} cy={sourceY + 50} r="2" fill="#64748b" />
          <circle cx={loadX - 35} cy={loadY + 50} r="2" fill="#64748b" />
          <text
            x={(sourceX + loadX) / 2}
            y={sourceY + 64}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {oneWayDistanceFt} ft One-Way Run ({oneWayDistanceFt * 2} ft Loop)
          </text>

          {/* Center Callout: Voltage Drop Details */}
          <rect
            x={(sourceX + loadX) / 2 - 85}
            y={sourceY - 42}
            width={170}
            height={36}
            rx="4"
            fill="#0f172a"
            stroke={statusColor}
            strokeWidth="1.5"
          />
          <text
            x={(sourceX + loadX) / 2}
            y={sourceY - 26}
            fill="#f8fafc"
            fontSize="11"
            textAnchor="middle"
            fontWeight="bold"
          >
            {recommendedSize} {conductorMaterial.toUpperCase()}
          </text>
          <text
            x={(sourceX + loadX) / 2}
            y={sourceY - 12}
            fill={statusColor}
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            &Delta;V = -{voltageDropVolts}V ({voltageDropPercent}% drop)
          </text>
        </svg>
      </div>

      {/* Numerical Blueprint Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Conductor Size</span>
          <span className="font-bold text-amber-800 font-sans">
            {recommendedSize} ({conductorMaterial})
          </span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Voltage at Load</span>
          <span className="font-bold text-slate-900 font-sans">
            {voltageAtLoad} Volts (-{voltageDropVolts}V)
          </span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Voltage Drop %</span>
          <span className="font-bold font-sans" style={{ color: statusColor }}>
            {voltageDropPercent}% (Target &le; {targetMaxVoltageDropPercent}%)
          </span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Max Distance (3%)</span>
          <span className="font-bold text-slate-900 font-sans">
            {result.maxDistanceFor3PctDropFt} ft limit
          </span>
        </div>
      </div>
    </div>
  );
}
