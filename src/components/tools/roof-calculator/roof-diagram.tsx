"use client";

import React, { useState } from "react";
import type { RafterGeometryResult } from "@/types/roof";
import { Triangle } from "lucide-react";

export interface RoofDiagramProps {
  geometry: RafterGeometryResult;
}

export function RoofDiagram({ geometry }: RoofDiagramProps) {
  const [viewMode, setViewMode] = useState<"profile" | "birdsmouth">("profile");

  const {
    pitchIn12,
    pitchAngleDegrees,
    runFt,
    runInches,
    riseFt,
    riseInches,
    rafterLineLengthFormatted,
    rafterLineLengthFt,
    overhangRunInches,
    birdsmouth,
    cutAngles,
  } = geometry;

  // Visual SVG parameters for Full Profile
  const svgWidth = 600;
  const svgHeight = 320;

  // Geometry math for responsive SVG slope
  // Constrain visual angle between 14° and 44° for optimal rendering within canvas
  const visualAngleRad = Math.max(0.24, Math.min(0.77, (pitchAngleDegrees * Math.PI) / 180));
  const plateX = 120;
  const plateY = 240;
  const ridgeX = 480;
  const runSpanPx = ridgeX - plateX; // 360px
  const risePx = Math.round(runSpanPx * Math.tan(visualAngleRad));
  const ridgeY = plateY - risePx;

  // Overhang tail point
  const overhangPx = 45;
  const tailX = plateX - overhangPx;
  const tailY = plateY + Math.round(overhangPx * Math.tan(visualAngleRad));

  // Perpendicular rafter thickness vector
  const rafterThickPx = 16;
  const perpDx = Math.round(rafterThickPx * Math.sin(visualAngleRad));
  const perpDy = Math.round(rafterThickPx * Math.cos(visualAngleRad));

  // Slope triangle positioning (at approx 60% of run)
  const triangleX = plateX + 180;
  const triangleY = plateY - Math.round(180 * Math.tan(visualAngleRad));
  const triBase = 40;
  const triHeight = Math.round(triBase * (pitchIn12 / 12));

  return (
    <div className="instrument-canvas p-5 shadow-xl text-white space-y-4">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Triangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Roof Profile &amp; Rafter Geometry Layout
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Pitch {pitchIn12}:12 &bull; {pitchAngleDegrees}° Angle &bull; {geometry.buildingSpanFt}′ Span ({runFt}′ Run)
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode("profile")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === "profile"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Full Profile
          </button>
          <button
            type="button"
            onClick={() => setViewMode("birdsmouth")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === "birdsmouth"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Birdsmouth Detail
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        {viewMode === "profile" ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid & Center Reference Line */}
            <line
              x1={ridgeX}
              y1={20}
              x2={ridgeX}
              y2={plateY + 40}
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={ridgeX}
              y={16}
              fill="#64748b"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
            >
              RIDGE CENTER LINE
            </text>

            {/* Base Horizontal Baseline (Top Plate Line) */}
            <line
              x1={tailX - 20}
              y1={plateY}
              x2={ridgeX + 40}
              y2={plateY}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Wall Top Plate Box */}
            <rect
              x={plateX - 35}
              y={plateY}
              width={35}
              height={45}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={plateX - 17.5}
              y={plateY + 26}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              2x4 WALL
            </text>

            {/* Ridge Board Box */}
            <rect
              x={ridgeX - 12}
              y={ridgeY - perpDy - 10}
              width={12}
              height={perpDy + 40}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={ridgeX - 6}
              y={ridgeY - perpDy - 16}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              RIDGE
            </text>

            {/* Common Rafter Polygon */}
            {/* Bottom edge: Tail -> Plate Notch -> Ridge */}
            {/* Top edge: Ridge top -> Tail top */}
            <polygon
              points={`
                ${tailX},${tailY} 
                ${plateX - 5},${plateY + 5} 
                ${plateX},${plateY} 
                ${ridgeX - 12},${ridgeY} 
                ${ridgeX - 12},${ridgeY - perpDy} 
                ${tailX - perpDx},${tailY - perpDy}
              `}
              fill="#f59e0b"
              fillOpacity="0.2"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Birdsmouth Notch Accent */}
            <polyline
              points={`${plateX - 25},${plateY} ${plateX},${plateY} ${plateX},${plateY - Math.round(15 * Math.tan(visualAngleRad))}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Plumb Cut Accent (Top) */}
            <line
              x1={ridgeX - 12}
              y1={ridgeY - perpDy}
              x2={ridgeX - 12}
              y2={ridgeY}
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Slope Triangle */}
            <polygon
              points={`${triangleX},${triangleY} ${triangleX + triBase},${triangleY} ${triangleX + triBase},${triangleY - triHeight}`}
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text
              x={triangleX + triBase / 2}
              y={triangleY + 11}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              12
            </text>
            <text
              x={triangleX + triBase + 6}
              y={triangleY - triHeight / 2 + 3}
              fill="#f59e0b"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              {pitchIn12}
            </text>

            {/* Rafter Line Length Dimension Leader Line */}
            <g transform={`translate(${-perpDx * 1.8}, ${-perpDy * 1.8})`}>
              <line
                x1={plateX}
                y1={plateY}
                x2={ridgeX}
                y2={ridgeY}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x={(plateX + ridgeX) / 2}
                y={(plateY + ridgeY) / 2 - 8}
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(${-visualAngleRad * (180 / Math.PI)}, ${(plateX + ridgeX) / 2}, ${(plateY + ridgeY) / 2 - 8})`}
              >
                Line Length: {rafterLineLengthFormatted} ({rafterLineLengthFt}′)
              </text>
            </g>

            {/* Horizontal Run Dimension Line */}
            <line
              x1={plateX}
              y1={plateY + 50}
              x2={ridgeX}
              y2={plateY + 50}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <line
              x1={plateX}
              y1={plateY + 44}
              x2={plateX}
              y2={plateY + 56}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX}
              y1={plateY + 44}
              x2={ridgeX}
              y2={plateY + 56}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <text
              x={(plateX + ridgeX) / 2}
              y={plateY + 66}
              fill="#f8fafc"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              Horizontal Run: {runFt} ft ({runInches}″)
            </text>

            {/* Vertical Rise Dimension Line */}
            <line
              x1={ridgeX + 45}
              y1={plateY}
              x2={ridgeX + 45}
              y2={ridgeY}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX + 39}
              y1={plateY}
              x2={ridgeX + 51}
              y2={plateY}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX + 39}
              y1={ridgeY}
              x2={ridgeX + 51}
              y2={ridgeY}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <text
              x={ridgeX + 55}
              y={(plateY + ridgeY) / 2 + 4}
              fill="#f8fafc"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              Rise: {riseFt} ft ({riseInches}″)
            </text>

            {/* Overhang Callout */}
            {overhangRunInches > 0 && (
              <g>
                <line
                  x1={tailX}
                  y1={plateY + 25}
                  x2={plateX}
                  y2={plateY + 25}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <text
                  x={(tailX + plateX) / 2}
                  y={plateY + 38}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {overhangRunInches}″ Overhang
                </text>
              </g>
            )}

            {/* Pitch Angle Badge */}
            <g transform={`translate(${plateX + 15}, ${plateY - 8})`}>
              <text
                x="0"
                y="0"
                fill="#34d399"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ∠ {pitchAngleDegrees}°
              </text>
            </g>
          </svg>
        ) : (
          /* Birdsmouth Notch Close-Up Detail */
          <svg
            viewBox="0 0 500 260"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Plate Wall (Close Up) */}
            <rect
              x="160"
              y="150"
              width="140"
              height="90"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
              rx="3"
            />
            <text
              x="230"
              y="205"
              fill="#94a3b8"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              WALL TOP PLATE
            </text>
            <text
              x="230"
              y="222"
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {birdsmouth.seatCutLengthInches}″ Nominal Bearing
            </text>

            {/* Enlarged Rafter with Birdsmouth Cut */}
            <polygon
              points="40,240 160,150 240,150 460,40 460,0 240,105 40,200"
              fill="#f59e0b"
              fillOpacity="0.2"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Seat Cut Highlight (Green) */}
            <line
              x1="160"
              y1="150"
              x2="240"
              y2="150"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text
              x="200"
              y="142"
              fill="#10b981"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              Seat Cut: {birdsmouth.seatCutLengthInches}″ ({cutAngles.seatCutAngleDegrees}°)
            </text>

            {/* Plumb Notch Cut Highlight (Cyan) */}
            <line
              x1="240"
              y1="150"
              x2="240"
              y2="105"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text
              x="255"
              y="130"
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              Plumb Depth: {birdsmouth.plumbCutDepthInches}″ ({cutAngles.plumbCutAngleDegrees}°)
            </text>

            {/* Height Above Plate (HAP / Stand) Leader */}
            <line
              x1="240"
              y1="105"
              x2="240"
              y2="0"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text
              x="255"
              y="55"
              fill="#fbbf24"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              HAP (Stand): {birdsmouth.heightAbovePlateInches}″
            </text>

            {/* Overhang Rafter Tail */}
            <text
              x="90"
              y="225"
              fill="#94a3b8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              Tail to Eave →
            </text>
          </svg>
        )}

        {/* Floating Pitch Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 backdrop-blur">
            Slope Multiplier: {geometry.slopeFactor}x
          </span>
        </div>
      </div>

      {/* Quick Geometry Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Triangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Pitch / Angle</span>
            <span className="text-xs font-bold text-amber-300">
              {pitchIn12}:12 ({pitchAngleDegrees}°)
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-cyan-400">∥</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Line Length</span>
            <span className="text-xs font-bold text-white">
              {rafterLineLengthFormatted}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-emerald-400">✂</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Plumb / Seat</span>
            <span className="text-xs font-bold text-white">
              {cutAngles.plumbCutAngleDegrees}° / {cutAngles.seatCutAngleDegrees}°
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <span className="font-bold text-xs text-amber-400">▲</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Total Rise</span>
            <span className="text-xs font-bold text-white">
              {riseFt}′ ({riseInches}″)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
