"use client";

import React from "react";
import type { RafterGeometryResult } from "@/types/roof";

export interface BirdsmouthDiagramProps {
  geometry: RafterGeometryResult;
}

export function BirdsmouthDiagram({ geometry }: BirdsmouthDiagramProps) {
  const {
    pitchIn12,
    pitchAngleDegrees,
    runFt,
    riseFt,
    rafterLineLengthFormatted,
    totalCutRafterLengthFormatted,
    overhangRunInches,
    birdsmouth,
    cutAngles,
  } = geometry;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
          Rafter Geometry &amp; Birdsmouth Cut Blueprint
        </h4>
        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {pitchIn12}/12 ({pitchAngleDegrees}°)
        </span>
      </div>

      {/* SVG Blueprint Illustration */}
      <div className="w-full overflow-hidden bg-slate-950 rounded-md p-4 text-amber-400">
        <svg
          viewBox="0 0 500 240"
          className="w-full h-auto max-h-56 select-none font-mono"
          aria-label="Rafter geometry blueprint diagram"
        >
          {/* Grid lines */}
          <line x1="40" y1="200" x2="460" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="380" y1="40" x2="380" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* Wall plate block */}
          <rect x="140" y="200" width="40" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="160" y="220" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
            Top Plate (2x4)
          </text>

          {/* Ridge Board Block */}
          <rect x="375" y="30" width="10" height="40" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="380" y="22" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
            Ridge Board
          </text>

          {/* Common Rafter Polygon */}
          {/* Points: Overhang bottom -> Birdsmouth notch -> Ridge top -> Ridge bottom -> Overhang top */}
          <polygon
            points="60,240 140,200 180,200 375,50 375,35 180,185 60,225"
            fill="#d97706"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />

          {/* Plumb Cut Top */}
          <line x1="375" y1="35" x2="375" y2="50" stroke="#38bdf8" strokeWidth="3" />

          {/* Birdsmouth Seat Cut */}
          <line x1="140" y1="200" x2="175" y2="200" stroke="#4ade80" strokeWidth="3" />

          {/* Dimensions / Annotations */}
          {/* Rise */}
          <text x="390" y="125" fill="#f8fafc" fontSize="11" fontWeight="bold">
            Rise: {riseFt} ft
          </text>

          {/* Run */}
          <text x="260" y="195" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">
            Run: {runFt} ft
          </text>

          {/* Rafter Line Length */}
          <text
            x="260"
            y="110"
            fill="#fbbf24"
            fontSize="12"
            fontWeight="bold"
            transform="rotate(-23, 260, 110)"
            textAnchor="middle"
          >
            Line Length: {rafterLineLengthFormatted}
          </text>

          {/* Total Cut Length */}
          <text x="70" y="170" fill="#38bdf8" fontSize="10">
            Cut Length: {totalCutRafterLengthFormatted}
          </text>

          {/* Overhang */}
          <text x="95" y="235" fill="#94a3b8" fontSize="9">
            Overhang: {overhangRunInches}&quot;
          </text>

          {/* Angles */}
          <text x="195" y="175" fill="#a7f3d0" fontSize="9">
            Seat Cut: {cutAngles.seatCutAngleDegrees}°
          </text>
          <text x="330" y="45" fill="#bae6fd" fontSize="9">
            Plumb: {cutAngles.plumbCutAngleDegrees}°
          </text>
        </svg>
      </div>

      {/* Numerical Cut Specs Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Plumb Cut (Top)</span>
          <span className="font-bold text-slate-900">{cutAngles.plumbCutAngleDegrees}°</span>{" "}
          <span className="text-slate-500 text-[10px]">({cutAngles.plumbCutPitchString})</span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Seat Cut (Birdsmouth)</span>
          <span className="font-bold text-slate-900">{cutAngles.seatCutAngleDegrees}°</span>{" "}
          <span className="text-slate-500 text-[10px]">({cutAngles.seatCutPitchString})</span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Seat Bearing Width</span>
          <span className="font-bold text-slate-900">{birdsmouth.seatCutLengthInches}&quot;</span>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-sans block uppercase">Height Above Plate (HAP)</span>
          <span className="font-bold text-slate-900">{birdsmouth.heightAbovePlateInches}&quot;</span>
        </div>
      </div>
    </div>
  );
}
