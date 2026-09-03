"use client";

import React, { useState } from "react";
import type { WallSectionInput, FramingProjectResult } from "@/types/framing";
import { Hammer, Layers } from "lucide-react";

interface FramingDiagramProps {
  walls: WallSectionInput[];
  result: FramingProjectResult;
  wastePercent: number;
}

export function FramingDiagram({ walls, result }: FramingDiagramProps) {
  const [activeHighlight, setActiveHighlight] = useState<"all" | "studs" | "plates" | "headers" | "corners">("all");

  const primaryWall = walls[0] || {
    name: "Main Wall",
    lengthFt: 20,
    heightFt: 8,
    studSpacingInches: 16,
    lumberSize: "2x4",
    hasDoubleTopPlate: true,
    cornerCount: 2,
    openings: [],
  };

  const wallLen = Math.max(2, primaryWall.lengthFt || 20);
  const wallHt = Math.max(4, primaryWall.heightFt || 8);
  const ocSpacing = primaryWall.studSpacingInches || 16;
  const doubleTop = primaryWall.hasDoubleTopPlate ?? true;
  const hasOpenings = primaryWall.openings && primaryWall.openings.length > 0;
  const firstOpening = hasOpenings ? primaryWall.openings[0] : null;

  // SVG frame coordinates
  const svgWidth = 600;
  const frameLeft = 40;
  const frameRight = 560;
  const frameWidth = frameRight - frameLeft;
  const frameTop = 40;
  const frameBottom = 190;
  const frameHeight = frameBottom - frameTop;

  // Calculate stud count and X coordinates
  const totalInches = wallLen * 12;
  const intervalCount = Math.floor(totalInches / ocSpacing);

  const studPositions: number[] = [];
  studPositions.push(frameLeft); // Lead stud

  for (let i = 1; i <= intervalCount; i++) {
    const inchPos = i * ocSpacing;
    if (inchPos < totalInches - 2) {
      const x = frameLeft + (inchPos / totalInches) * frameWidth;
      studPositions.push(Math.round(x));
    }
  }
  studPositions.push(frameRight); // End stud

  // Opening geometry in SVG
  let opX = 0;
  let opW = 0;
  let opH = 0;
  let opY = 0;

  if (firstOpening) {
    const opWidthRatio = Math.min(0.6, Math.max(0.15, (firstOpening.widthFt || 3) / wallLen));
    opW = Math.round(frameWidth * opWidthRatio);
    opX = Math.round(frameLeft + (frameWidth - opW) / 2);
    const opHeightRatio = Math.min(0.7, Math.max(0.3, (firstOpening.heightFt || 4) / wallHt));
    opH = Math.round(frameHeight * opHeightRatio);
    opY = frameBottom - opH - 20;
  }

  return (
    <div className="glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4">
      {/* Top Header & Layer Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Hammer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Architectural Wall Elevation Blueprint
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {wallLen}′ Length × {wallHt}′ Height @ {ocSpacing}″ OC Spacing &bull; {studPositions.length} visible stud lines
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveHighlight("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeHighlight === "all" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            All Members
          </button>
          <button
            type="button"
            onClick={() => setActiveHighlight("studs")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeHighlight === "studs" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Studs
          </button>
          <button
            type="button"
            onClick={() => setActiveHighlight("plates")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeHighlight === "plates" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Plates
          </button>
          <button
            type="button"
            onClick={() => setActiveHighlight("headers")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeHighlight === "headers" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Headers
          </button>
        </div>
      </div>

      {/* SVG Wall Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox={`0 0 ${svgWidth} 230`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Double Plate */}
          <g
            className="transition-opacity duration-200"
            opacity={activeHighlight === "all" || activeHighlight === "plates" ? 1 : 0.25}
          >
            <rect x={frameLeft} y={frameTop} width={frameWidth} height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            {doubleTop && (
              <rect x={frameLeft} y={frameTop + 6} width={frameWidth} height="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
            )}
            <text x={svgWidth / 2} y={frameTop - 8} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {doubleTop ? "Double Top Plate (2×4 / 2×6)" : "Single Top Plate"}
            </text>
          </g>

          {/* Bottom Sole Plate */}
          <g
            className="transition-opacity duration-200"
            opacity={activeHighlight === "all" || activeHighlight === "plates" ? 1 : 0.25}
          >
            <rect x={frameLeft} y={frameBottom - 8} width={frameWidth} height="8" fill="#d97706" stroke="#78350f" strokeWidth="1" />
            <text x={svgWidth / 2} y={frameBottom + 18} fill="#d97706" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Sole Plate (Continuous Foundation / Floor Anchored)
            </text>
          </g>

          {/* Common Vertical Studs */}
          <g
            className="transition-opacity duration-200"
            opacity={activeHighlight === "all" || activeHighlight === "studs" ? 1 : 0.25}
          >
            {studPositions.map((x, i) => {
              // If opening exists, skip studs that collide with the opening
              if (firstOpening && x > opX + 4 && x < opX + opW - 4) {
                return null;
              }
              const isCorner = i === 0 || i === studPositions.length - 1;
              return (
                <g key={`stud-${i}`}>
                  <rect
                    x={x - 2}
                    y={frameTop + (doubleTop ? 12 : 6)}
                    width="4"
                    height={frameHeight - (doubleTop ? 20 : 14)}
                    fill={isCorner ? "#38bdf8" : "#fbbf24"}
                    stroke={isCorner ? "#0284c7" : "#b45309"}
                    strokeWidth="0.8"
                  />
                  {/* Spacing tick at bottom */}
                  {i < studPositions.length - 1 && (
                    <line
                      x1={x}
                      y1={frameBottom - 3}
                      x2={studPositions[i + 1]}
                      y2={frameBottom - 3}
                      stroke="#64748b"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Window / Door Opening Framework */}
          {firstOpening && (
            <g
              className="transition-opacity duration-200"
              opacity={activeHighlight === "all" || activeHighlight === "headers" ? 1 : 0.3}
            >
              {/* Window Opening Void */}
              <rect x={opX} y={opY} width={opW} height={opH} fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Structural Solid Header */}
              <rect
                x={opX - 6}
                y={opY - 14}
                width={opW + 12}
                height="14"
                fill="#ef4444"
                stroke="#991b1b"
                strokeWidth="1"
              />
              <text x={opX + opW / 2} y={opY - 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Header ({firstOpening.headerLumberSize || "2×8"})
              </text>

              {/* King Studs (Full Height on Left & Right) */}
              <rect x={opX - 8} y={frameTop + 12} width="4" height={frameHeight - 20} fill="#f59e0b" />
              <rect x={opX + opW + 4} y={frameTop + 12} width="4" height={frameHeight - 20} fill="#f59e0b" />

              {/* Jack / Trimmer Studs (Under Header) */}
              <rect x={opX - 4} y={opY} width="4" height={frameBottom - 8 - opY} fill="#38bdf8" />
              <rect x={opX + opW} y={opY} width="4" height={frameBottom - 8 - opY} fill="#38bdf8" />

              {/* Window Sill */}
              <rect x={opX} y={opY + opH} width={opW} height="5" fill="#f59e0b" />

              {/* Opening label */}
              <text x={opX + opW / 2} y={opY + opH / 2 + 3} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {firstOpening.widthFt}′ × {firstOpening.heightFt}′ Opening
              </text>
            </g>
          )}

          {/* Wall Dimension Callout */}
          <line x1={frameLeft} y1="20" x2={frameRight} y2="20" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1={frameLeft} y1="14" x2={frameLeft} y2="26" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1={frameRight} y1="14" x2={frameRight} y2="26" stroke="#f59e0b" strokeWidth="1.5" />
          <text x={svgWidth / 2} y="15" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            Wall Length: {wallLen} ft ({ocSpacing}″ On-Center Stud Spacing)
          </text>
        </svg>

        {/* Section Overlay Badge */}
        <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur border border-amber-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-amber-300">
          Section: <span className="text-white font-bold">{primaryWall.name || "North Wall"}</span> ({wallLen}′L × {wallHt}′H)
        </div>
      </div>

      {/* Quick Lumber Takeoff Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Hammer className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Total Studs</span>
            <span className="text-xs font-bold text-amber-300">
              {result.totalStudsWithWaste} pcs
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Plate Lumber</span>
            <span className="text-xs font-bold text-white">
              {result.plateLinearFt} LF
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-amber-400">BF</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Board Feet</span>
            <span className="text-xs font-bold text-white">
              {result.totalBoardFeet} BF
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-emerald-400">16′</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Plate Stock</span>
            <span className="text-xs font-bold text-white">
              {result.totalPlateBoards} boards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
