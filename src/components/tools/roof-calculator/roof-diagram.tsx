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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-slate-900 space-y-4">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Triangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Roof Profile &amp; Rafter Layout
            </h3>
            <p className="text-xs text-slate-500">
              Pitch {pitchIn12}:12 &bull; {pitchAngleDegrees}° Angle &bull; {geometry.buildingSpanFt}′ Span ({runFt}′ Run)
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setViewMode("profile")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "profile"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Full Profile
          </button>
          <button
            type="button"
            onClick={() => setViewMode("birdsmouth")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "birdsmouth"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Birdsmouth Detail
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-center justify-center p-2 overflow-hidden">
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
              stroke="#94a3b8"
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
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Wall Top Plate Box (Natural Timber Tone) */}
            <rect
              x={plateX - 35}
              y={plateY}
              width={35}
              height={45}
              fill="#e2b36c"
              stroke="#a16207"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={plateX - 17.5}
              y={plateY + 26}
              fill="#78350f"
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
              fill="#e2b36c"
              stroke="#a16207"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={ridgeX - 6}
              y={ridgeY - perpDy - 16}
              fill="#78350f"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              RIDGE
            </text>

            {/* Common Rafter Polygon (Natural Pine Lumber Tone) */}
            <polygon
              points={`
                ${tailX},${tailY} 
                ${plateX - 5},${plateY + 5} 
                ${plateX},${plateY} 
                ${ridgeX - 12},${ridgeY} 
                ${ridgeX - 12},${ridgeY - perpDy} 
                ${tailX - perpDx},${tailY - perpDy}
              `}
              fill="#fef3c7"
              stroke="#d97706"
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
              stroke="#0284c7"
              strokeWidth="3"
            />

            {/* Slope Triangle */}
            <polygon
              points={`${triangleX},${triangleY} ${triangleX + triBase},${triangleY} ${triangleX + triBase},${triangleY - triHeight}`}
              fill="#ffffff"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <text
              x={triangleX + triBase / 2}
              y={triangleY + 11}
              fill="#475569"
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
              fill="#d97706"
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
                stroke="#b45309"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x={(plateX + ridgeX) / 2}
                y={(plateY + ridgeY) / 2 - 8}
                fill="#92400e"
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
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={plateX}
              y1={plateY + 44}
              x2={plateX}
              y2={plateY + 56}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX}
              y1={plateY + 44}
              x2={ridgeX}
              y2={plateY + 56}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text
              x={(plateX + ridgeX) / 2}
              y={plateY + 66}
              fill="#0f172a"
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
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX + 39}
              y1={plateY}
              x2={ridgeX + 51}
              y2={plateY}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={ridgeX + 39}
              y1={ridgeY}
              x2={ridgeX + 51}
              y2={ridgeY}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text
              x={ridgeX + 55}
              y={(plateY + ridgeY) / 2 + 4}
              fill="#0f172a"
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
                  stroke="#64748b"
                  strokeWidth="1"
                />
                <text
                  x={(tailX + plateX) / 2}
                  y={plateY + 38}
                  fill="#475569"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {overhangRunInches}″ Overhang
                </text>
              </g>
            )}
          </svg>
        ) : (
          /* Birdsmouth Notch View */
          <svg
            viewBox="0 0 500 300"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Plate 2x4 Lumber */}
            <rect
              x="140"
              y="160"
              width="140"
              height="110"
              fill="#e2b36c"
              stroke="#a16207"
              strokeWidth="2"
              rx="3"
            />
            <text
              x="210"
              y="220"
              fill="#78350f"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              WALL TOP PLATE
            </text>
            <text
              x="210"
              y="238"
              fill="#92400e"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              Bearing: {birdsmouth.seatCutLengthInches}″
            </text>

            {/* Sloped Rafter Stock with Birdsmouth Notch */}
            <path
              d="M 40 230 L 140 190 L 140 160 L 280 160 L 460 70 L 440 25 L 260 115 L 120 115 L 20 185 Z"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2.5"
            />

            {/* Horizontal Seat Cut Line (Green) */}
            <line
              x1="140"
              y1="160"
              x2="280"
              y2="160"
              stroke="#10b981"
              strokeWidth="4"
            />
            <text
              x="210"
              y="152"
              fill="#065f46"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              Seat Cut (Bearing): {birdsmouth.seatCutLengthInches}″
            </text>

            {/* Vertical Plumb Cut / Heel Line */}
            <line
              x1="140"
              y1="160"
              x2="140"
              y2="190"
              stroke="#0284c7"
              strokeWidth="3"
            />
            <text
              x="132"
              y="178"
              fill="#0369a1"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              Plumb Cut
            </text>
          </svg>
        )}
      </div>

      {/* Birdsmouth & Cut Angle Specs Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Plumb Cut</span>
          <span className="font-bold font-mono text-slate-900">{cutAngles.plumbCutAngleDegrees}°</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Seat / Level Cut</span>
          <span className="font-bold font-mono text-slate-900">{cutAngles.seatCutAngleDegrees}°</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">HAP Stand</span>
          <span className="font-bold font-mono text-slate-900">{birdsmouth.heightAbovePlateInches}″</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Seat Bearing</span>
          <span className="font-bold font-mono text-slate-900">{birdsmouth.seatCutLengthInches}″</span>
        </div>
      </div>
    </div>
  );
}
