"use client";

import React, { useState } from "react";
import type { StairGeometryResult } from "@/types/stairs";
import { Ruler, Layers, Compass, Scissors } from "lucide-react";

export interface StairDiagramProps {
  geometry: StairGeometryResult;
}

export function StairDiagram({ geometry }: StairDiagramProps) {
  const [viewMode, setViewMode] = useState<"elevation" | "stringer_cut">("elevation");
  const [activeLayer, setActiveLayer] = useState<"all" | "stringer" | "treads">("all");

  const {
    totalRiseFormatted,
    totalRunFormatted,
    riserCount,
    exactRiserHeightFormatted,
    exactRiserHeightInches,
    treadCount,
    exactTreadDepthFormatted,
    exactTreadDepthInches,
    stairAngleDegrees,
    stringerLineLengthFormatted,
    bottomRiserDeductionInches,
    topHangerDeductionInches,
    stringerThroatDepthInches,
    codeCompliance,
  } = geometry;

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 280;
  const originX = 60;
  const originY = 230;

  // Dynamic step scale calculation for elevation
  const stepsToDraw = Math.min(18, Math.max(2, riserCount));
  const runWidthAvailable = svgWidth - 140;
  const riseHeightAvailable = svgHeight - 70;

  const stepDx = Math.round(runWidthAvailable / Math.max(1, treadCount));
  const stepDy = Math.round(riseHeightAvailable / Math.max(1, riserCount));

  // Dynamic Sawtooth Stringer Path for Elevation View
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
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            {viewMode === "elevation" ? <Ruler className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              {viewMode === "elevation" ? "Sawtooth Stringer CAD Profile" : "Framing Square & Stringer Cut Blueprint"}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {riserCount} Risers @ {exactRiserHeightFormatted} &bull; {treadCount} Treads @ {exactTreadDepthFormatted} &bull; {stairAngleDegrees}° Pitch
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode("elevation")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                viewMode === "elevation" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Elevation
            </button>
            <button
              type="button"
              onClick={() => setViewMode("stringer_cut")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                viewMode === "stringer_cut" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Cut Layout Mode
            </button>
          </div>

          {viewMode === "elevation" && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveLayer("all")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeLayer === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer("stringer")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeLayer === "stringer" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Stringer
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer("treads")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeLayer === "treads" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Treads
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SVG Stair Blueprint Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        {viewMode === "elevation" ? (
          /* ELEVATION VIEW: Assembled Stair Profile */
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
        ) : (
          /* CUT LAYOUT VIEW: 2x12 Blank with Framing Square & Cut Lines */
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 2x12 Lumber Blank Outline (Angled board) */}
            <defs>
              <pattern id="cutHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1" opacity="0.35" />
              </pattern>
            </defs>

            {/* Uncut Board Boundaries (ghosted 2x12 blank) */}
            <path
              d="M 50 235 L 530 45 L 555 92 L 75 282 Z"
              fill="rgba(51, 65, 85, 0.2)"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="310" y="195" fill="#64748b" fontSize="10" fontFamily="monospace" transform="rotate(-23 310 195)">
              2x12 Lumber Stock (11-1/4″ Net Width)
            </text>

            {/* Sawtooth Cut Stringer Body */}
            <path
              d={pathD}
              fill="rgba(245, 158, 11, 0.2)"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* TOP PLUMB CUT: Red Line & Callout */}
            <line
              x1={currentX}
              y1={currentY}
              x2={currentX - 25}
              y2={currentY + 50}
              stroke="#ef4444"
              strokeWidth="2.5"
            />
            {/* Top Hanger Deduction zone */}
            <rect
              x={currentX - 18}
              y={currentY}
              width="18"
              height="35"
              fill="url(#cutHatch)"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx={currentX} cy={currentY} r="3.5" fill="#ef4444" />
            <text x={currentX - 110} y={currentY - 10} fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Top Plumb Cut (Deduct {topHangerDeductionInches.toFixed(2)}″ Hanger)
            </text>

            {/* BOTTOM LEVEL CUT & RISER DROP (Δ): Red Line & Callout */}
            <line
              x1={originX - 15}
              y1={originY + 12}
              x2={originX + 45}
              y2={originY + 12}
              stroke="#ef4444"
              strokeWidth="2.5"
            />
            {/* Bottom slice to remove */}
            <rect
              x={originX}
              y={originY + 2}
              width="35"
              height="10"
              fill="url(#cutHatch)"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx={originX} cy={originY + 12} r="3.5" fill="#ef4444" />
            <text x={originX - 35} y={originY + 28} fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Bottom Cut (Drop Δ = {bottomRiserDeductionInches.toFixed(2)}″)
            </text>

            {/* THROAT DEPTH (S): Dimension arrow across solid wood */}
            <g>
              {/* Throat measurement line */}
              <line x1="220" y1="170" x2="245" y2="215" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
              <circle cx="220" cy="170" r="3" fill="#38bdf8" />
              <circle cx="245" cy="215" r="3" fill="#38bdf8" />
              <text x="252" y="195" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Throat S = {stringerThroatDepthInches.toFixed(2)}″
              </text>
              <text x="252" y="207" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                (IRC R311.7.5.3 ≥ 3.5″ min)
              </text>
            </g>

            {/* FRAMING SQUARE (L-Square) OVERLAY ON STEP 2 */}
            <g transform="translate(140, 105)">
              {/* Framing Square Body (Blade: 24" side along tread, Tongue: 16" side along riser) */}
              <path
                d="M 0 0 L 75 0 L 75 14 L 14 14 L 14 65 L 0 65 Z"
                fill="rgba(251, 191, 36, 0.85)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              {/* Brass Stair Gauges clamped at rise and run */}
              <circle cx="0" cy="45" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="55" cy="0" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

              {/* Tooltip text labels */}
              <text x="65" y="-6" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Run Blade: {exactTreadDepthFormatted}
              </text>
              <text x="-8" y="80" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Rise Tongue: {exactRiserHeightFormatted}
              </text>
            </g>

            {/* Note watermark */}
            <text x="20" y="20" fill="#475569" fontSize="9" fontFamily="monospace">
              CARPENTER CUT LAYOUT: Set stair gauges on framing square to {exactRiserHeightInches.toFixed(3)}″ (Rise) and {exactTreadDepthInches.toFixed(3)}″ (Tread)
            </text>
          </svg>
        )}

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

      {/* View-Specific Explanatory Callout Box for Cut Layout */}
      {viewMode === "stringer_cut" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200/90 space-y-1.5 font-mono">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Compass className="h-4 w-4" />
            <span>Jobsite Stringer Cut Protocol (IRC R311.7)</span>
          </div>
          <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-300 font-sans">
            <li>
              <strong className="text-amber-200 font-mono">Bottom Riser Drop (Δ = {bottomRiserDeductionInches.toFixed(2)}″):</strong>{" "}
              Cut {bottomRiserDeductionInches.toFixed(2)}″ off the bottom foot of the stringer so that when the finished tread board is installed on top, the first step height matches all others.
            </li>
            <li>
              <strong className="text-amber-200 font-mono">Top Plumb Cut Deduct ({topHangerDeductionInches.toFixed(2)}″):</strong>{" "}
              Deduct {topHangerDeductionInches.toFixed(2)}″ at the top plumb cut to account for the thickness of the rim joist / hanger bracket or finished floor drop.
            </li>
            <li>
              <strong className="text-amber-200 font-mono">Solid Throat S ({stringerThroatDepthInches.toFixed(2)}″):</strong>{" "}
              {stringerThroatDepthInches >= 3.5 ? (
                <span className="text-emerald-400 font-semibold">Exceeds IRC R311.7.5.3 minimum (≥ 3.5″ required). Structural lumber is sound.</span>
              ) : (
                <span className="text-rose-400 font-semibold">Caution: Throat depth is less than 3.5″! Upgrade from 2x12 to 2x14 or add a center carriage.</span>
              )}
            </li>
          </ul>
        </div>
      )}

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
            <span className={`text-xs font-bold ${stringerThroatDepthInches >= 3.5 ? "text-white" : "text-rose-400"}`}>
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
