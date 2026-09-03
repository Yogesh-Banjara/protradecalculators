"use client";

import React, { useState } from "react";
import type { AggregateSectionInput, AggregateProjectResult } from "@/types/aggregate";
import { Truck, Scale, Layers, Package } from "lucide-react";

interface GravelDiagramProps {
  sections: AggregateSectionInput[];
  result: AggregateProjectResult;
  materialName: string;
}

export function GravelDiagram({ sections, result, materialName }: GravelDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "compacted" | "loose" | "subgrade">("all");

  const primarySection = sections[0] || {
    name: "Main Area",
    length: 50,
    width: 12,
    depth: 4,
    lengthUnit: "foot",
    depthUnit: "inch",
  };

  const len = primarySection.length || 50;
  const wid = primarySection.width || 12;
  const dep = primarySection.depth || 4;

  const totalTons = result.totalTons;
  const totalYards = result.adjustedVolumeCuYd;
  const totalTrucks = result.truckloadEstimate.loadsRequired;
  const bag50 = result.bagEstimates.find((b) => b.bagWeightLbs === 50);
  const totalBags50 = bag50 ? bag50.bagsRequired : Math.ceil(result.totalWeightLbs / 50);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl text-white space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Interactive Aggregate &amp; Tonnage Cross-Section</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing compacted depth vs loose fill ordering for {materialName}
            </p>
          </div>
        </div>

        {/* Layer Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "all" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            All Layers
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("compacted")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "compacted" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Compacted Grade
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("loose")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "loose" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Loose Screed Line
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("subgrade")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "subgrade" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Subgrade Soil
          </button>
        </div>
      </div>

      {/* SVG Isometric Trench & Cross Section */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[300px] bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-center p-3 overflow-hidden">
        <svg
          viewBox="0 0 600 240"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gravel Stipple Pattern */}
            <pattern id="gravelFill" width="18" height="18" patternUnits="userSpaceOnUse">
              <rect width="18" height="18" fill="#475569" />
              <polygon points="3,3 8,4 6,9" fill="#334155" />
              <polygon points="12,11 16,13 14,16" fill="#1e293b" />
              <polygon points="14,2 17,6 12,5" fill="#64748b" />
              <circle cx="5" cy="14" r="1.5" fill="#94a3b8" />
            </pattern>
            {/* Earth Subgrade Pattern */}
            <pattern id="earthFill" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#1e293b" />
              <line x1="0" y1="0" x2="20" y2="20" stroke="#0f172a" strokeWidth="1" />
              <line x1="20" y1="0" x2="0" y2="20" stroke="#0f172a" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 1. Subgrade Native Earth (Base) */}
          {(activeLayer === "all" || activeLayer === "subgrade") && (
            <g className="transition-opacity duration-300">
              <polygon
                points="110,135 300,180 300,215 110,170"
                fill="url(#earthFill)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <polygon
                points="300,180 490,135 490,170 300,215"
                fill="url(#earthFill)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <text x="300" y="205" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                Compacted Native Subgrade Earth
              </text>
            </g>
          )}

          {/* 2. Compacted Gravel Layer */}
          {(activeLayer === "all" || activeLayer === "compacted") && (
            <g className="transition-opacity duration-300">
              {/* Top Compacted Face */}
              <polygon
                points="300,100 490,55 300,10 110,55"
                fill="url(#gravelFill)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {/* Front-Left Face */}
              <polygon
                points="110,55 300,100 300,145 110,100"
                fill="#334155"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              {/* Front-Right Face */}
              <polygon
                points="300,100 490,55 490,100 300,145"
                fill="#475569"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x="300" y="60" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
                {materialName} ({dep}″ Compacted Finish)
              </text>
            </g>
          )}

          {/* 3. Loose Screed Line Layer (Compaction Allowance) */}
          {(activeLayer === "all" || activeLayer === "loose") && (
            <g className="transition-opacity duration-300" stroke="#38bdf8" strokeWidth="2" opacity="0.9">
              {/* Dotted lines above surface showing extra loose gravel before mechanical rolling */}
              <polygon
                points="300,85 490,40 300,-5 110,40"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <text x="300" y="32" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                Loose Spread Level (+{dep * 0.15 + dep}″ Pre-Compaction)
              </text>
            </g>
          )}

          {/* Dimension Callouts */}
          <g fill="#fde68a" fontSize="11" fontWeight="bold">
            {/* Length (Left) */}
            <line x1="95" y1="50" x2="285" y2="95" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="170" y="80" fill="#fbbf24" textAnchor="middle">
              L: {len} ft
            </text>

            {/* Width (Right) */}
            <line x1="315" y1="95" x2="505" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="430" y="80" fill="#fbbf24" textAnchor="middle">
              W: {wid} ft
            </text>

            {/* Depth (Front Corner) */}
            <line x1="305" y1="100" x2="305" y2="145" stroke="#38bdf8" strokeWidth="2" />
            <text x="315" y="128" fill="#38bdf8" textAnchor="start">
              Depth: {dep} in
            </text>
          </g>
        </svg>

        {/* HUD Pill */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-amber-500/40 rounded-md px-2.5 py-1 text-[11px] font-mono text-amber-300">
          Area: <span className="text-white font-bold">{primarySection.name}</span> ({len}′ × {wid}′ × {dep}″)
        </div>
      </div>

      {/* Practical Jobsite Takeoff Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Weight</div>
            <div className="text-base font-black text-amber-400">
              {totalTons} <span className="text-xs font-medium text-slate-300">tons</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Volume Required</div>
            <div className="text-base font-black text-cyan-300">
              {totalYards} <span className="text-xs font-medium text-slate-300">yd³</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Dump Trucks</div>
            <div className="text-base font-black text-emerald-300">
              {totalTrucks} <span className="text-xs font-medium text-slate-300">loads</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">50 lb Pre-Pack Bags</div>
            <div className="text-base font-black text-purple-300">
              {totalBags50} <span className="text-xs font-medium text-slate-300">bags</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
