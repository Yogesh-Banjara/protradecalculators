"use client";

import React, { useState } from "react";
import type { ConcreteSectionInput, ConcreteProjectResult } from "@/types/concrete";
import { Truck, Package, Layers } from "lucide-react";

interface ConcreteDiagramProps {
  sections: ConcreteSectionInput[];
  result: ConcreteProjectResult;
  wastePercent: number;
}

export function ConcreteDiagram({ sections, result }: ConcreteDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "concrete" | "rebar" | "gravel">("all");
  const [viewMode, setViewMode] = useState<"isometric" | "top">("isometric");

  const primarySection = sections[0] || {
    length: 10,
    width: 10,
    depth: 4,
    shape: "rectangular-slab",
    lengthUnit: "foot",
    depthUnit: "inch",
  };

  const len = Math.max(1, primarySection.length || 10);
  const wid = Math.max(1, primarySection.width || 10);
  const dep = Math.max(1, primarySection.depth || 4);

  const cubicYardsOrdered = result.recommendedOrderYards;
  const bag80 = result.bagEstimates.find((b) => b.bagWeightLbs === 80);
  const totalBags80 = bag80 ? bag80.bagsRequired : Math.ceil(cubicYardsOrdered * 45);

  // Dynamic 3D Isometric Geometry Calculations
  const centerX = 300;
  const topY = 60;

  const lenScale = Math.min(1.4, Math.max(0.55, len / 16));
  const widScale = Math.min(1.4, Math.max(0.55, wid / 16));

  const rightDx = Math.round(155 * lenScale);
  const rightDy = Math.round(52 * lenScale);
  const leftDx = Math.round(155 * widScale);
  const leftDy = Math.round(52 * widScale);

  const depthScale = Math.min(68, Math.max(16, Math.round(dep * 5.5)));
  const gravelThickness = 22;

  // 4 Top Vertices
  const topVertex = { x: centerX, y: topY };
  const rightVertex = { x: centerX + rightDx, y: topY + rightDy };
  const bottomVertex = { x: centerX + rightDx - leftDx, y: topY + rightDy + leftDy };
  const leftVertex = { x: centerX - leftDx, y: topY + leftDy };

  // Bottom Vertices of Slab
  const leftBottom = { x: leftVertex.x, y: leftVertex.y + depthScale };
  const centerBottom = { x: bottomVertex.x, y: bottomVertex.y + depthScale };
  const rightBottom = { x: rightVertex.x, y: rightVertex.y + depthScale };

  // Gravel Subgrade Vertices
  const gravelLeftBottom = { x: leftVertex.x, y: leftBottom.y + gravelThickness };
  const gravelCenterBottom = { x: bottomVertex.x, y: centerBottom.y + gravelThickness };
  const gravelRightBottom = { x: rightVertex.x, y: rightBottom.y + gravelThickness };

  // Dynamic Rebar Grid
  const rebarCountLength = Math.min(8, Math.max(2, Math.floor(len / 3)));
  const rebarCountWidth = Math.min(8, Math.max(2, Math.floor(wid / 3)));

  return (
    <div className="instrument-canvas p-5 shadow-xl space-y-4">
      {/* Top Controls & Dimension Readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
                Interactive Slab Geometry
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live Scale: {len}′ Length × {wid}′ Width × {dep}″ Thickness
            </p>
          </div>
        </div>

        {/* View & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("isometric")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === "isometric" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Isometric View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("top")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === "top" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Plan View
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeLayer === "all" ? "bg-slate-700 text-amber-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("concrete")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeLayer === "concrete" ? "bg-slate-700 text-amber-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Slab
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("rebar")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeLayer === "rebar" ? "bg-slate-700 text-amber-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Rebar
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("gravel")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeLayer === "gravel" ? "bg-slate-700 text-amber-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Sub-Base
          </button>
        </div>
      </div>

      {/* Blueprint Vector Display */}
      <div className="relative w-full aspect-[16/10] max-h-[350px] bg-slate-950/95 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        {viewMode === "isometric" ? (
          <svg
            viewBox="0 0 600 290"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="cadConcretePattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#334155" />
                <circle cx="3" cy="3" r="1.2" fill="#1e293b" />
                <circle cx="11" cy="9" r="1.5" fill="#475569" />
                <circle cx="7" cy="14" r="1" fill="#1e293b" />
              </pattern>
              <pattern id="cadGravelPattern" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="#0f172a" />
                <polygon points="2,2 5,4 3,7" fill="#334155" />
                <polygon points="8,8 11,10 9,13" fill="#475569" />
              </pattern>
            </defs>

            {/* 1. Gravel Subgrade Layer */}
            {(activeLayer === "all" || activeLayer === "gravel") && (
              <g className="transition-all duration-300">
                <polygon
                  points={`${leftBottom.x},${leftBottom.y} ${centerBottom.x},${centerBottom.y} ${rightBottom.x},${rightBottom.y} ${topVertex.x},${topVertex.y + depthScale}`}
                  fill="url(#cadGravelPattern)"
                  stroke="#334155"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <polygon
                  points={`${leftBottom.x},${leftBottom.y} ${centerBottom.x},${centerBottom.y} ${gravelCenterBottom.x},${gravelCenterBottom.y} ${gravelLeftBottom.x},${gravelLeftBottom.y}`}
                  fill="#090d16"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${centerBottom.x},${centerBottom.y} ${rightBottom.x},${rightBottom.y} ${gravelRightBottom.x},${gravelRightBottom.y} ${gravelCenterBottom.x},${gravelCenterBottom.y}`}
                  fill="#0f172a"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <text
                  x={centerBottom.x}
                  y={gravelCenterBottom.y + 14}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Compacted Gravel Subgrade (4″ Base)
                </text>
              </g>
            )}

            {/* 2. Concrete Slab Layer */}
            {(activeLayer === "all" || activeLayer === "concrete") && (
              <g className="transition-all duration-300">
                {/* Top Face */}
                <polygon
                  points={`${topVertex.x},${topVertex.y} ${rightVertex.x},${rightVertex.y} ${bottomVertex.x},${bottomVertex.y} ${leftVertex.x},${leftVertex.y}`}
                  fill="url(#cadConcretePattern)"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                {/* Front Left Vertical Shaded Face */}
                <polygon
                  points={`${leftVertex.x},${leftVertex.y} ${bottomVertex.x},${bottomVertex.y} ${centerBottom.x},${centerBottom.y} ${leftBottom.x},${leftBottom.y}`}
                  fill="#1e293b"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                {/* Front Right Vertical Highlighted Face */}
                <polygon
                  points={`${bottomVertex.x},${bottomVertex.y} ${rightVertex.x},${rightVertex.y} ${rightBottom.x},${rightBottom.y} ${centerBottom.x},${centerBottom.y}`}
                  fill="#334155"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* 3. Rebar Mesh Grid Layer */}
            {(activeLayer === "all" || activeLayer === "rebar") && (
              <g stroke="#ef4444" strokeWidth="2" opacity="0.95" className="transition-all duration-300">
                {/* Lengthwise Bars */}
                {Array.from({ length: rebarCountLength }).map((_, i) => {
                  const frac = (i + 1) / (rebarCountLength + 1);
                  const x1 = topVertex.x - leftDx * frac;
                  const y1 = topVertex.y + leftDy * frac;
                  const x2 = rightVertex.x - leftDx * frac;
                  const y2 = rightVertex.y + leftDy * frac;
                  return <line key={`rebar-len-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray="5,2.5" />;
                })}

                {/* Widthwise Bars */}
                {Array.from({ length: rebarCountWidth }).map((_, i) => {
                  const frac = (i + 1) / (rebarCountWidth + 1);
                  const x1 = topVertex.x + rightDx * frac;
                  const y1 = topVertex.y + rightDy * frac;
                  const x2 = leftVertex.x + rightDx * frac;
                  const y2 = leftVertex.y + rightDy * frac;
                  return <line key={`rebar-wid-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray="5,2.5" />;
                })}

                <circle cx={bottomVertex.x} cy={bottomVertex.y - 14} r="4" fill="#ef4444" />
                <text x={bottomVertex.x + 10} y={bottomVertex.y - 11} fill="#fca5a5" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  #4 Rebar (18″ OC Grid)
                </text>
              </g>
            )}

            {/* Drafting Dimension Arrows & Extension Lines */}
            <g fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="monospace">
              {/* Length Vector */}
              <path
                d={`M ${topVertex.x + 12},${topVertex.y - 6} L ${rightVertex.x + 12},${rightVertex.y - 6}`}
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <line x1={topVertex.x + 6} y1={topVertex.y - 12} x2={topVertex.x + 18} y2={topVertex.y} stroke="#f59e0b" strokeWidth="2" />
              <line x1={rightVertex.x + 6} y1={rightVertex.y - 12} x2={rightVertex.x + 18} y2={rightVertex.y} stroke="#f59e0b" strokeWidth="2" />
              <text
                x={(topVertex.x + rightVertex.x) / 2 + 18}
                y={(topVertex.y + rightVertex.y) / 2 - 12}
                fill="#fbbf24"
                textAnchor="middle"
              >
                Length: {len} {primarySection.lengthUnit === "foot" ? "ft" : "m"}
              </text>

              {/* Width Vector */}
              <path
                d={`M ${leftVertex.x - 12},${leftVertex.y - 6} L ${topVertex.x - 12},${topVertex.y - 6}`}
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <line x1={leftVertex.x - 18} y1={leftVertex.y} x2={leftVertex.x - 6} y2={leftVertex.y - 12} stroke="#f59e0b" strokeWidth="2" />
              <line x1={topVertex.x - 18} y1={topVertex.y} x2={topVertex.x - 6} y2={topVertex.y - 12} stroke="#f59e0b" strokeWidth="2" />
              <text
                x={(leftVertex.x + topVertex.x) / 2 - 18}
                y={(leftVertex.y + topVertex.y) / 2 - 12}
                fill="#fbbf24"
                textAnchor="middle"
              >
                Width: {wid} {primarySection.lengthUnit === "foot" ? "ft" : "m"}
              </text>

              {/* Thickness Drop */}
              <line
                x1={bottomVertex.x + 12}
                y1={bottomVertex.y}
                x2={centerBottom.x + 12}
                y2={centerBottom.y}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <line x1={bottomVertex.x + 6} y1={bottomVertex.y} x2={bottomVertex.x + 18} y2={bottomVertex.y} stroke="#38bdf8" strokeWidth="2" />
              <line x1={centerBottom.x + 6} y1={centerBottom.y} x2={centerBottom.x + 18} y2={centerBottom.y} stroke="#38bdf8" strokeWidth="2" />
              <text
                x={centerBottom.x + 24}
                y={(bottomVertex.y + centerBottom.y) / 2 + 4}
                fill="#38bdf8"
                textAnchor="start"
              >
                Depth: {dep} {primarySection.depthUnit === "inch" ? "in" : "cm"}
              </text>
            </g>
          </svg>
        ) : (
          /* 2D Plan View Blueprint */
          <svg viewBox="0 0 600 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="40" width="440" height="200" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Rebar grid lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`pv-rl-${i}`} x1="80" y1={40 + (i + 1) * 28} x2="520" y2={40 + (i + 1) * 28} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`pv-rw-${i}`} x1={80 + (i + 1) * 33} y1="40" x2={80 + (i + 1) * 33} y2="240" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            ))}
            <text x="300" y="25" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Plan View Length: {len} ft
            </text>
            <text x="60" y="145" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 60 145)" fontFamily="monospace">
              Width: {wid} ft
            </text>
            <text x="300" y="145" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {len}′ × {wid}′ × {dep}″ Slab Plan
            </text>
          </svg>
        )}

        {/* Section Overlay Badge */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-amber-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-amber-300">
          Section: <span className="text-white font-bold">{primarySection.name || "Main Slab"}</span> ({len}′ × {wid}′ × {dep}″)
        </div>
      </div>

      {/* Quick Takeoff Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Ready-Mix Order</span>
            <span className="text-xs font-bold font-mono text-amber-300">
              {cubicYardsOrdered} yd³
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">80-lb Premix</span>
            <span className="text-xs font-bold font-mono text-slate-200">
              {totalBags80} bags
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Subgrade Gravel</span>
            <span className="text-xs font-bold font-mono text-slate-200">
              {result.totalVolumeCuYd ? (result.totalVolumeCuYd * 1.3).toFixed(1) : "—"} tons
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-amber-400 font-mono">#4</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Rebar Sticks</span>
            <span className="text-xs font-bold font-mono text-slate-200">
              {Math.ceil((len * wid * 1.4) / 20)} pcs (20ft)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
