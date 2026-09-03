"use client";

import React, { useState } from "react";
import type { PlumbingDfuResult } from "@/types/plumbing-dfu";
import { Droplets } from "lucide-react";

export interface PlumbingDfuDiagramProps {
  result: PlumbingDfuResult | null;
}

export function PlumbingDfuDiagram({ result }: PlumbingDfuDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "stack" | "branches" | "drain">("all");

  const totalDfu = result?.totalCalculatedDfu ?? 6.0;
  const buildingDrainSize = result?.recommendedPipeSizeInches ?? "3";
  const branchSize = result?.minPermittedPipeSizeInches ?? "2";
  const stackSize = buildingDrainSize;
  const slope = result?.pipeSlope === "1_2" ? "1/2" : result?.pipeSlope === "1_8" ? "1/8" : "1/4";
  const standard = result?.codeStandard ?? "IPC";

  // SVG parameters
  const svgWidth = 600;
  const svgHeight = 260;

  // Dynamic slope tilt calculation
  const slopeTiltY = slope === "1/2" ? 36 : slope === "1/4" ? 22 : 12;

  return (
    <div className="instrument-canvas p-5 shadow-xl text-white space-y-4">
      {/* Top Header & Layer Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-400">
              Sanitary Drainage &amp; Soil Stack Layout
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {totalDfu} Total DFU &bull; {slope}″/ft Fall &bull; {standard} Chapter 7 Prescriptive Sizing
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "all" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            All Systems
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("stack")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "stack" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Soil Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("drain")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "drain" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Main Drain
          </button>
        </div>
      </div>

      {/* SVG Drainage Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Roof Vent Stack (Top) */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "stack" ? 1 : 0.25}
          >
            <rect x="230" y="16" width="28" height="44" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="2" />
            <text x="244" y="10" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ROOF VENT (VTR)
            </text>
          </g>

          {/* Upper Fixture Horizontal Branch */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "branches" ? 1 : 0.25}
          >
            <rect x="50" y="60" width="180" height="20" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" rx="2" />
            <text x="140" y="74" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Upper Fixtures ({branchSize}″ Branch)
            </text>

            {/* Fixture drop arrows */}
            <circle cx="90" cy="50" r="6" fill="#38bdf8" />
            <line x1="90" y1="50" x2="90" y2="60" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="170" cy="50" r="6" fill="#38bdf8" />
            <line x1="170" y1="50" x2="170" y2="60" stroke="#38bdf8" strokeWidth="2" />
          </g>

          {/* Main Vertical Soil Stack */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "stack" ? 1 : 0.25}
          >
            <rect x="230" y="60" width="28" height="110" fill="#0f172a" stroke="#0284c7" strokeWidth="2.5" rx="2" />
            <text x="268" y="120" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="start" fontFamily="monospace">
              Vertical Soil Stack ({stackSize}″ Min)
            </text>
          </g>

          {/* Lower Fixture Branch */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "branches" ? 1 : 0.25}
          >
            <rect x="70" y="130" width="160" height="20" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" rx="2" />
            <text x="150" y="144" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Lower Fixtures ({branchSize}″ Branch)
            </text>
          </g>

          {/* Dynamic Horizontal Building Drain with Pitch */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "drain" ? 1 : 0.25}
          >
            <polygon
              points={`230,170 520,${170 + slopeTiltY} 520,${196 + slopeTiltY} 230,196`}
              fill="#1e293b"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <text
              x="375"
              y={185 + slopeTiltY / 2}
              fill="#fde68a"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Building Drain ({buildingDrainSize}″ @ {slope}″/ft Fall)
            </text>
          </g>

          {/* Sewer Outfall Arrow */}
          <path
            d={`M 520 ${183 + slopeTiltY} L 550 ${183 + slopeTiltY} L 542 ${177 + slopeTiltY} M 550 ${183 + slopeTiltY} L 542 ${189 + slopeTiltY}`}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text
            x="555"
            y={186 + slopeTiltY}
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            To Sewer / Septic
          </text>
        </svg>

        {/* Floating Drain Size Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800 backdrop-blur">
            Min Main Drain: {buildingDrainSize}″
          </span>
        </div>
      </div>

      {/* Quick DFU Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Total DFU</span>
            <span className="text-xs font-bold text-cyan-300">
              {totalDfu} DFU
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-amber-400">Ø</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Main Drain</span>
            <span className="text-xs font-bold text-white">
              {buildingDrainSize}″ Pipe
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-cyan-400">∠</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Slope Fall</span>
            <span className="text-xs font-bold text-white">
              {slope}″ / ft
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-emerald-400">IPC</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Standard</span>
            <span className="text-xs font-bold text-white">
              {standard} 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
