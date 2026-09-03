"use client";

import React, { useState } from "react";
import type { DrywallRoomInput, DrywallProjectResult, DrywallSheetSize } from "@/types/drywall";
import { Layers, Paintbrush, ScrollText } from "lucide-react";

interface DrywallDiagramProps {
  rooms: DrywallRoomInput[];
  result: DrywallProjectResult;
  sheetSize: DrywallSheetSize;
  wastePercent: number;
}

export function DrywallDiagram({ rooms, result, sheetSize, _wastePercent }: DrywallDiagramProps & { _wastePercent?: number }) {
  const [activeLayer, setActiveLayer] = useState<"all" | "walls" | "ceiling" | "taping">("all");

  const primaryRoom = rooms[0] || {
    name: "Main Room",
    lengthFt: 16,
    widthFt: 12,
    heightFt: 8,
    includeWalls: true,
    includeCeiling: true,
    openings: [],
  };

  const len = primaryRoom.lengthFt || 16;
  const wid = primaryRoom.widthFt || 12;
  const ht = primaryRoom.heightFt || 8;

  const totalSheets = result.sheetsRequired;
  const compoundGallons = result.accessories.jointCompoundGallons;
  const compoundBuckets = result.accessories.compoundBuckets4_5Gal;
  const tapeRolls = result.accessories.tapeRolls500Ft;
  const screwsBoxes = result.accessories.screwBoxes5Lb;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl text-white space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Interactive Drywall Panel &amp; Seam Layout</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing {sheetSize} sheet grid, corner joints &amp; mud/tape allowances
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
            All Surfaces
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("walls")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "walls" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Walls
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("ceiling")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "ceiling" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Ceiling
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("taping")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeLayer === "taping" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Taping Seams
          </button>
        </div>
      </div>

      {/* SVG Isometric Room View */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[300px] bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-center p-3 overflow-hidden">
        <svg
          viewBox="0 0 600 240"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ceiling Polygon (Top) */}
          {(activeLayer === "all" || activeLayer === "ceiling") && (
            <g className="transition-opacity duration-300">
              <polygon
                points="300,30 490,75 300,120 110,75"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Ceiling Grid Lines */}
              <line x1="205" y1="52" x2="395" y2="98" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="205" y1="98" x2="395" y2="52" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
              <text x="300" y="78" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                Ceiling Drywall ({len}′ × {wid}′)
              </text>
            </g>
          )}

          {/* Left Wall Polygon */}
          {(activeLayer === "all" || activeLayer === "walls") && (
            <g className="transition-opacity duration-300">
              <polygon
                points="110,75 300,120 300,215 110,170"
                fill="#334155"
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Horizontal Staggered Sheet Seams */}
              <line x1="110" y1="122" x2="300" y2="167" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Vertical Butt Joints */}
              <line x1="205" y1="98" x2="205" y2="145" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Window Cutout */}
              <polygon
                points="150,110 200,122 200,150 150,138"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x="175" y="133" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                Window
              </text>
              <text x="170" y="190" fill="#e2e8f0" fontSize="9" fontWeight="bold">
                Left Wall ({len}′ × {ht}′)
              </text>
            </g>
          )}

          {/* Right Wall Polygon */}
          {(activeLayer === "all" || activeLayer === "walls") && (
            <g className="transition-opacity duration-300">
              <polygon
                points="300,120 490,75 490,170 300,215"
                fill="#475569"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Horizontal Staggered Sheet Seams */}
              <line x1="300" y1="167" x2="490" y2="122" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Vertical Butt Joints */}
              <line x1="395" y1="145" x2="395" y2="192" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Door Cutout */}
              <polygon
                points="340,157 380,147 380,205 340,215"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x="360" y="185" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                Door
              </text>
              <text x="430" y="190" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">
                Right Wall ({wid}′ × {ht}′)
              </text>
            </g>
          )}

          {/* Taping & Joint Compound Lines Layer */}
          {(activeLayer === "all" || activeLayer === "taping") && (
            <g className="transition-opacity duration-300" stroke="#f59e0b" strokeWidth="2.5" opacity="0.9">
              {/* Inside Corner Seam */}
              <line x1="300" y1="120" x2="300" y2="215" stroke="#ef4444" strokeWidth="3" />
              {/* Ceiling Perimeter Tape */}
              <line x1="110" y1="75" x2="300" y2="120" strokeDasharray="4,2" />
              <line x1="300" y1="120" x2="490" y2="75" strokeDasharray="4,2" />
              {/* Corner Tag */}
              <circle cx="300" cy="165" r="5" fill="#ef4444" />
              <text x="312" y="168" fill="#fca5a5" fontSize="9" fontWeight="bold">
                Inside Corner Bead &amp; Joint Tape
              </text>
            </g>
          )}

          {/* Room Dimension Callouts */}
          <g fill="#fde68a" fontSize="10" fontWeight="bold">
            {/* Height Callout (Right Corner) */}
            <line x1="505" y1="75" x2="505" y2="170" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="515" y="125" fill="#38bdf8" textAnchor="start">
              Ht: {ht} ft
            </text>
          </g>
        </svg>

        {/* HUD Pill */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-amber-500/40 rounded-md px-2.5 py-1 text-[11px] font-mono text-amber-300">
          Room: <span className="text-white font-bold">{primaryRoom.name}</span> ({len}′L × {wid}′W × {ht}′H)
        </div>
      </div>

      {/* Practical Jobsite Takeoff Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Drywall Sheets</div>
            <div className="text-base font-black text-amber-400">
              {totalSheets} <span className="text-xs font-medium text-slate-300">({sheetSize})</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Paintbrush className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Joint Compound</div>
            <div className="text-base font-black text-cyan-300">
              {compoundGallons} <span className="text-xs font-medium text-slate-300">gal ({compoundBuckets} buckets)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ScrollText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Joint Tape (500′)</div>
            <div className="text-base font-black text-emerald-300">
              {tapeRolls} <span className="text-xs font-medium text-slate-300">rolls</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Drywall Screws (5 lb)</div>
            <div className="text-base font-black text-purple-300">
              {screwsBoxes} <span className="text-xs font-medium text-slate-300">boxes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
