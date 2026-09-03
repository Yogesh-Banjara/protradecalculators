"use client";

import React from "react";
import type { BoxFillResult } from "@/types/box-fill";

export interface BoxFillDiagramProps {
  result: BoxFillResult;
}

export function BoxFillDiagram({ result }: BoxFillDiagramProps) {
  const {
    totalRequiredVolumeCuIn,
    totalAvailableVolumeCuIn,
    fillPercentage,
    isCompliant,
    breakdown,
    selectedBox,
    recommendedBox,
  } = result;

  const boxName = selectedBox?.name ?? recommendedBox.name;
  const statusColor = isCompliant ? "#10b981" : "#ef4444";
  const statusText = isCompliant
    ? `WITHIN CAPACITY (${fillPercentage}% Fill)`
    : `OVERFILL (${fillPercentage}% - EXCEEDS CAPACITY)`;

  const svgWidth = 320;
  const svgHeight = 240;

  // Box rectangle bounds
  const boxX = 60;
  const boxY = 40;
  const boxW = 200;
  const boxH = 160;

  const hasDevice = breakdown.deviceYokeAllowanceCount > 0;
  const hasClamps = breakdown.clampAllowanceCount > 0;
  const hasGrounds = breakdown.groundAllowanceCount > 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
          Enclosure Cross-Section &amp; Volume Blueprint
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
            {totalRequiredVolumeCuIn} / {totalAvailableVolumeCuIn} cu in
          </span>
        </div>
      </div>

      {/* SVG Canvas and Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Electrical Enclosure Graphic */}
        <div className="w-full overflow-hidden bg-slate-950 rounded-md p-3 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[280px] h-48 select-none font-mono"
            aria-label="Electrical box fill cross-section blueprint"
          >
            {/* Knockout / Conduit Entrances on Top & Left */}
            <rect x={boxX + 30} y={15} width={24} height={25} fill="#334155" stroke="#64748b" strokeWidth="1" />
            <rect x={boxX + 140} y={15} width={24} height={25} fill="#334155" stroke="#64748b" strokeWidth="1" />
            <rect x={35} y={boxY + 60} width={25} height={24} fill="#334155" stroke="#64748b" strokeWidth="1" />

            {/* Main Electrical Box Body */}
            <rect
              x={boxX}
              y={boxY}
              width={boxW}
              height={boxH}
              rx={6}
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="3"
            />

            {/* Corner Mounting Ears / Screw Holes */}
            <circle cx={boxX + 10} cy={boxY + 10} r={3} fill="#475569" />
            <circle cx={boxX + boxW - 10} cy={boxY + 10} r={3} fill="#475569" />
            <circle cx={boxX + 10} cy={boxY + boxH - 10} r={3} fill="#475569" />
            <circle cx={boxX + boxW - 10} cy={boxY + boxH - 10} r={3} fill="#475569" />

            {/* Internal Cable Clamp Bracket (if active) */}
            {hasClamps && (
              <g>
                <rect x={boxX + 15} y={boxY + 8} width={45} height={10} rx={2} fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                <circle cx={boxX + 37} cy={boxY + 13} r={2} fill="#e2e8f0" />
                <text x={boxX + 18} y={boxY + 28} fill="#94a3b8" fontSize="7" fontSans-serif="true">
                  Internal Clamp (1×)
                </text>
              </g>
            )}

            {/* Equipment Grounding Screw & Pigtail (if active) */}
            {hasGrounds && (
              <g>
                <circle cx={boxX + boxW - 20} cy={boxY + boxH - 20} r={5} fill="#15803d" stroke="#86efac" strokeWidth="1" />
                <path
                  d={`M ${boxX + boxW - 20} ${boxY + boxH - 20} Q ${boxX + boxW - 50} ${boxY + boxH - 40} ${boxX + 100} ${boxY + boxH - 30}`}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <text x={boxX + boxW - 55} y={boxY + boxH - 8} fill="#4ade80" fontSize="7">
                  Ground Screw ({breakdown.groundAllowanceCount}×)
                </text>
              </g>
            )}

            {/* Conductor Lines entering from knockouts */}
            {/* Phase Conductor (Hot - Black) */}
            <path
              d={`M ${boxX + 42} 15 L ${boxX + 42} ${boxY + 50} Q ${boxX + 42} ${boxY + 80} ${boxX + 80} ${boxY + 80}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Neutral Conductor (White) */}
            <path
              d={`M ${boxX + 152} 15 L ${boxX + 152} ${boxY + 50} Q ${boxX + 152} ${boxY + 80} ${boxX + 120} ${boxY + 80}`}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="2.5"
            />

            {/* Center Device Yoke (Receptacle / Switch) */}
            {hasDevice && (
              <g>
                <rect
                  x={boxX + 70}
                  y={boxY + 35}
                  width={60}
                  height={90}
                  rx={4}
                  fill="#1e293b"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                {/* Receptacle Outlets / Slots */}
                <rect x={boxX + 85} y={boxY + 48} width={8} height={14} rx={1} fill="#020617" />
                <rect x={boxX + 107} y={boxY + 48} width={8} height={14} rx={1} fill="#020617" />
                <circle cx={boxX + 100} cy={boxY + 70} r={3} fill="#020617" />

                <rect x={boxX + 85} y={boxY + 90} width={8} height={14} rx={1} fill="#020617" />
                <rect x={boxX + 107} y={boxY + 90} width={8} height={14} rx={1} fill="#020617" />
                <circle cx={boxX + 100} cy={boxY + 112} r={3} fill="#020617" />

                <text x={boxX + 100} y={boxY + 135} fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="middle">
                  Device Yoke (2× Allowance)
                </text>
              </g>
            )}

            {/* Box Trade Dimensions Label */}
            <text x={boxX + 100} y={boxY + boxH - 4} fill="#cbd5e1" fontSize="8" textAnchor="middle">
              {selectedBox?.tradeDimensions || '4" × 4" × 1-1/2"'}
            </text>
          </svg>
        </div>

        {/* Numerical Blueprint Readout */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans block uppercase">
              Current Box Configuration
            </span>
            <span className="text-sm font-bold text-slate-900 font-sans">
              {boxName}
            </span>
          </div>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans block uppercase">
              Volume Fill vs. Listed Capacity
            </span>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-base font-bold font-sans" style={{ color: statusColor }}>
                {fillPercentage}% Fill
              </span>
              <span className="text-xs text-slate-600 font-sans">
                {totalRequiredVolumeCuIn} of {totalAvailableVolumeCuIn} cu in
              </span>
            </div>
            {/* Progress Fill Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, fillPercentage)}%`,
                  backgroundColor: statusColor,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">
                Conductor Fill
              </span>
              <span className="font-bold text-amber-800 font-sans">
                {breakdown.conductorVolumeCuIn} cu in ({result.totalConductorCount} wires)
              </span>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">
                Free Remaining Space
              </span>
              <span
                className={`font-bold font-sans ${
                  result.remainingVolumeCuIn >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {result.remainingVolumeCuIn} cu in
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
