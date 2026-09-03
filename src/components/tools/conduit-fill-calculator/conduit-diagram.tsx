"use client";

import React from "react";
import type { ConduitFillResult } from "@/types/conduit";
import { Zap, AlertTriangle, ShieldCheck } from "lucide-react";

interface ConduitDiagramProps {
  result: ConduitFillResult;
}

export function ConduitDiagram({ result }: ConduitDiagramProps) {
  const {
    conduitType,
    recommendedTradeSize,
    actualFillPercentage,
    allowableFillPercentage,
    totalConductorAreaSqIn,
    recommendedConduitAreaSqIn,
    totalConductorCount,
  } = result;

  const isOverfilled = actualFillPercentage > allowableFillPercentage;
  const isWarning = actualFillPercentage > 35 && actualFillPercentage <= allowableFillPercentage;
  const statusColor = isOverfilled ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981";
  const glowShadow = isOverfilled
    ? "drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))"
    : isWarning
    ? "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))"
    : "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))";

  const ringRadius = 80;
  const allowedRadius = ringRadius * Math.sqrt(allowableFillPercentage / 100);

  return (
    <div className="glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Conduit Cross-Section CAD Blueprint
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Trade Size: {recommendedTradeSize}″ {conduitType.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Dynamic Safety Threshold Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border"
          style={{
            backgroundColor: `${statusColor}15`,
            borderColor: `${statusColor}50`,
            color: statusColor,
          }}
        >
          {isOverfilled ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          <span>
            {isOverfilled
              ? "OVERFILLED (VIOLATION)"
              : isWarning
              ? "NEAR MAX (WARNING)"
              : "SAFE CODE CAPACITY"}
          </span>
        </div>
      </div>

      {/* Dynamic SVG Conduit Cross Section */}
      <div className="relative w-full aspect-[16/10] max-h-[300px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-3 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: glowShadow }}
        >
          {/* Conduit Outer & Inner Wall */}
          <circle cx="200" cy="120" r={ringRadius + 8} fill="#0f172a" stroke="#475569" strokeWidth="4" />
          <circle cx="200" cy="120" r={ringRadius} fill="#020617" stroke={statusColor} strokeWidth="3" />

          {/* Max Allowable Fill Limit Boundary Ring */}
          <circle
            cx="200"
            cy="120"
            r={allowedRadius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />

          {/* Dynamically Packed Conductors (Capped at 36 for rendering performance) */}
          {Array.from({ length: Math.min(Math.max(0, totalConductorCount), 36) }).map((_, i) => {
            const displayCount = Math.min(totalConductorCount, 36);
            const angle = (i * 2 * Math.PI) / Math.max(1, displayCount);
            const r = i === 0 && displayCount > 1 ? 0 : Math.min(allowedRadius - 12, 14 + (i % 3) * 16);
            const cx = 200 + r * Math.cos(angle);
            const cy = 120 + r * Math.sin(angle);
            return (
              <g key={i}>
                {/* Conductor Insulation */}
                <circle cx={cx} cy={cy} r="10" fill="#1e293b" stroke={statusColor} strokeWidth="1.5" />
                {/* Copper Core */}
                <circle cx={cx} cy={cy} r="5.5" fill="#f59e0b" />
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Dimension & Telemetry Labels */}
          <text x="200" y="25" fill={statusColor} fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            Fill: {actualFillPercentage}% (NEC Max {allowableFillPercentage}%)
          </text>
          <text x="200" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Wire Area: {totalConductorAreaSqIn} in² / Total Area: {recommendedConduitAreaSqIn} in²
          </text>
        </svg>

        {/* Overlay Telemetry Badge */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300">
          Conductors: <span className="text-amber-400 font-bold">{totalConductorCount} Total</span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Conduit Size</span>
          <span className="text-xs font-bold text-white">{recommendedTradeSize}″ {conduitType.toUpperCase()}</span>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Fill Area</span>
          <span className="text-xs font-bold text-amber-400">{totalConductorAreaSqIn} in²</span>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Fill %</span>
          <span className="text-xs font-bold" style={{ color: statusColor }}>{actualFillPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
