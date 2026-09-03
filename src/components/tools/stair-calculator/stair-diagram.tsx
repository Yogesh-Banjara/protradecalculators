"use client";

import React, { useState } from "react";
import type { StairGeometryResult } from "@/types/stairs";
import { Ruler, Layers } from "lucide-react";

export interface StairDiagramProps {
  geometry: StairGeometryResult;
}

export function StairDiagram({ geometry }: StairDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "stringer" | "treads" | "headroom">("all");

  const {
    totalRiseFormatted,
    totalRunFormatted,
    riserCount,
    exactRiserHeightFormatted,
    treadCount,
    exactTreadDepthFormatted,
    stairAngleDegrees,
    stringerLineLengthFormatted,
    bottomRiserDeductionInches,
    stringerThroatDepthInches,
    codeCompliance,
  } = geometry;

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 280;
  const originX = 60;
  const originY = 230;

  // Dynamic step scale calculation
  const stepsToDraw = Math.min(18, Math.max(2, riserCount));
  const runWidthAvailable = svgWidth - 140;
  const riseHeightAvailable = svgHeight - 70;

  const stepDx = Math.round(runWidthAvailable / Math.max(1, treadCount));
  const stepDy = Math.round(riseHeightAvailable / Math.max(1, riserCount));

  // Dynamic Sawtooth Stringer Path
  let pathD = `M ${originX} ${originY}`;
  let currentX = originX;
  let currentY = originY;

  for (let i = 1; i <= stepsToDraw; i++) {
    const nextY = originY - i * stepDy;
    pathD += ` L ${currentX} ${nextY}`;
    currentY = nextY;

    if (i < stepsToDraw) {
      const nextX = originX + i * stepDx;
      pathD += ` L ${nextX} ${currentY}`;
      currentX = nextX;
    }
  }

  // Back diagonal stringer throat line
  const stringerBackX = currentX - 30;
  const stringerBackY = currentY + 22;
  const stringerBottomX = originX + 22;
  const stringerBottomY = originY + 22;
  pathD += ` L ${stringerBackX} ${stringerBackY} L ${stringerBottomX} ${stringerBottomY} Z`;

  return (
    <div className="glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4">
      {/* Top Header & Layer Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Sawtooth Stringer Cut CAD Profile
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {riserCount} Risers @ {exactRiserHeightFormatted} &bull; {treadCount} Treads @ {exactTreadDepthFormatted} &bull; {stairAngleDegrees}° Pitch
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "all" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            All Layers
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("stringer")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "stringer" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Stringer
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("treads")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "treads" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Treads
          </button>
        </div>
      </div>

      {/* SVG Stair Blueprint Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Floor Baseline */}
          <line x1="20" y1={originY} x2={svgWidth - 20} y2={originY} stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="25" y={originY + 16} fill="#64748b" fontSize="10" fontFamily="monospace">
            Lower Finished Floor
          </text>

          {/* Upper Floor Baseline */}
          <line x1="20" y1={currentY} x2={svgWidth - 20} y2={currentY} stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={currentX + 15} y={currentY - 6} fill="#64748b" fontSize="10" fontFamily="monospace">
            Upper Finished Floor
          </text>

          {/* Sawtooth Solid Stringer Body */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "stringer" ? 1 : 0.25}
          >
            <path
              d={pathD}
              fill="rgba(245, 158, 11, 0.15)"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>

          {/* Finished Tread Overhangs */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "treads" ? 1 : 0.25}
          >
            {Array.from({ length: Math.max(1, stepsToDraw - 1) }).map((_, i) => {
              const tx = originX + (i + 1) * stepDx - stepDx;
              const ty = originY - (i + 1) * stepDy;
              return (
                <g key={`tread-${i}`}>
                  <rect
                    x={tx - 4}
                    y={ty - 3}
                    width={stepDx + 6}
                    height="4"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="0.8"
                    rx="1"
                  />
                </g>
              );
            })}
          </g>

          {/* Slope Triangle & Angle Arc */}
          <line x1={originX} y1={originY} x2={currentX} y2={currentY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={originX + (currentX - originX) / 2 + 10} y={originY - (originY - currentY) / 2 - 10} fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {stairAngleDegrees}° Slope ({stringerLineLengthFormatted} Line)
          </text>

          {/* Total Rise Callout on Right */}
          <g>
            <line x1={currentX + 45} y1={originY} x2={currentX + 45} y2={currentY} stroke="#f59e0b" strokeWidth="1.5" />
            <line x1={currentX + 38} y1={originY} x2={currentX + 52} y2={originY} stroke="#f59e0b" strokeWidth="1.5" />
            <line x1={currentX + 38} y1={currentY} x2={currentX + 52} y2={currentY} stroke="#f59e0b" strokeWidth="1.5" />
            <text x={currentX + 55} y={originY - (originY - currentY) / 2 + 4} fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
              Total Rise: {totalRiseFormatted}
            </text>
          </g>

          {/* Total Run Callout on Bottom */}
          <g>
            <line x1={originX} y1={originY + 32} x2={currentX} y2={originY + 32} stroke="#f59e0b" strokeWidth="1.5" />
            <line x1={originX} y1={originY + 25} x2={originX} y2={originY + 39} stroke="#f59e0b" strokeWidth="1.5" />
            <line x1={currentX} y1={originY + 25} x2={currentX} y2={originY + 39} stroke="#f59e0b" strokeWidth="1.5" />
            <text x={originX + (currentX - originX) / 2} y={originY + 46} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Total Run: {totalRunFormatted} ({treadCount} Treads @ {exactTreadDepthFormatted})
            </text>
          </g>
        </svg>

        {/* Floating IRC Compliance Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border backdrop-blur ${
              codeCompliance.overallCompliant
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-400 border-amber-500/40"
            }`}
          >
            {codeCompliance.overallCompliant ? "✓ IRC Prescriptive Limits Met" : "⚠ Review Local Code Limits"}
          </span>
        </div>
      </div>

      {/* Quick Geometry Takeoff Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs">R</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Unit Rise</span>
            <span className="text-xs font-bold text-amber-300">
              {exactRiserHeightFormatted}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs">T</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Unit Tread</span>
            <span className="text-xs font-bold text-white">
              {exactTreadDepthFormatted}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Throat Depth</span>
            <span className="text-xs font-bold text-white">
              {stringerThroatDepthInches.toFixed(2)}″
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-emerald-400">Δ</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Bottom Deduct</span>
            <span className="text-xs font-bold text-white">
              {bottomRiserDeductionInches.toFixed(2)}″
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
