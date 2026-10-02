"use client";

import React, { useState } from "react";
import type { RafterCalculatorResult } from "@/types/rafter";
import { Triangle } from "lucide-react";

export interface RafterDiagramProps {
  result: RafterCalculatorResult;
}

export function RafterDiagram({ result }: RafterDiagramProps) {
  const [viewMode, setViewMode] = useState<"profile" | "birdsmouth">("profile");

  const { geometry, ircCompliance, recommendedStockLumberFt } = result;
  const {
    pitchIn12,
    pitchAngleDegrees,
    buildingSpanFt,
    runFt,
    runInches,
    riseFt,
    riseInches,
    rafterLineLengthFormatted,
    overhangRunInches,
    overhangRafterLengthInches,
    ridgeDeductionInches,
    totalCutRafterLengthFormatted,
    birdsmouth,
    cutAngles,
  } = geometry;

  // SVG parameters
  const svgWidth = 600;
  const svgHeight = 320;
  const visualAngleRad = Math.max(0.24, Math.min(0.77, (pitchAngleDegrees * Math.PI) / 180));
  const plateX = 120;
  const plateY = 240;
  const ridgeX = 490;
  const runSpanPx = ridgeX - plateX;
  const risePx = Math.round(runSpanPx * Math.tan(visualAngleRad));
  const ridgeY = plateY - risePx;

  // Overhang tail point
  const overhangPx = 50;
  const tailX = plateX - overhangPx;
  const tailY = plateY + Math.round(overhangPx * Math.tan(visualAngleRad));

  // Rafter thickness vector
  const rafterThickPx = 18;
  const perpDx = Math.round(rafterThickPx * Math.sin(visualAngleRad));
  const perpDy = Math.round(rafterThickPx * Math.cos(visualAngleRad));

  // Slope triangle positioning
  const triangleX = plateX + 170;
  const triangleY = plateY - Math.round(170 * Math.tan(visualAngleRad));
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
              {viewMode === "profile" ? "Common Rafter Framing Blueprint" : "Birdsmouth Seat & Plate Detail"}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Pitch {pitchIn12}:12 &bull; {pitchAngleDegrees}° Plumb Angle &bull; {buildingSpanFt}′ Span ({runFt}′ Run)
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode("profile")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "profile"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rafter Profile
          </button>
          <button
            type="button"
            onClick={() => setViewMode("birdsmouth")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "birdsmouth"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Birdsmouth Cut Detail
          </button>
        </div>
      </div>

      {/* SVG Blueprint Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        {viewMode === "profile" ? (
          /* PROFILE VIEW: Complete Rafter Cut Layout */
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Plate Wall Bearing Block */}
            <rect
              x={plateX - 25}
              y={plateY}
              width="35"
              height="40"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x={plateX - 22} y={plateY + 24} fill="#64748b" fontSize="9" fontFamily="monospace">
              2x4 Plate
            </text>

            {/* Ridge Board Cross-Section */}
            <rect
              x={ridgeX}
              y={ridgeY - 15}
              width="15"
              height="75"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text x={ridgeX - 5} y={ridgeY - 22} fill="#94a3b8" fontSize="9" fontFamily="monospace">
              Ridge (Deduct {ridgeDeductionInches}″)
            </text>

            {/* Rafter Timber Body (Polygon) */}
            <polygon
              points={`
                ${ridgeX},${ridgeY}
                ${ridgeX},${ridgeY + perpDy}
                ${plateX + 10},${plateY}
                ${plateX - 25},${plateY}
                ${tailX - perpDx},${tailY - perpDy}
                ${tailX},${tailY}
                ${ridgeX},${ridgeY}
              `}
              fill="rgba(245, 158, 11, 0.2)"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Theoretical Rafter Pitch Line (Centerline) */}
            <line
              x1={ridgeX}
              y1={ridgeY}
              x2={plateX}
              y2={plateY}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Overhang Rafter Tail Dimension */}
            <line
              x1={plateX}
              y1={plateY}
              x2={tailX}
              y2={tailY}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <text
              x={tailX - 20}
              y={tailY + 18}
              fill="#fbbf24"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Overhang: {overhangRunInches}″ ({overhangRafterLengthInches}″ cut)
            </text>

            {/* Line Length Dimension Callout */}
            <text
              x={plateX + (ridgeX - plateX) / 2 - 40}
              y={ridgeY + (plateY - ridgeY) / 2 - 12}
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Line Length: {rafterLineLengthFormatted}
            </text>

            {/* Horizontal Run Dimension Line */}
            <line
              x1={plateX}
              y1={plateY + 50}
              x2={ridgeX}
              y2={plateY + 50}
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            <line x1={plateX} y1={plateY + 45} x2={plateX} y2={plateY + 55} stroke="#94a3b8" strokeWidth="1.2" />
            <line x1={ridgeX} y1={plateY + 45} x2={ridgeX} y2={plateY + 55} stroke="#94a3b8" strokeWidth="1.2" />
            <text
              x={plateX + runSpanPx / 2}
              y={plateY + 65}
              fill="#cbd5e1"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              Run: {runFt}′ ({runInches}″) &bull; Span: {buildingSpanFt}′
            </text>

            {/* Vertical Rise Dimension Line */}
            <line
              x1={ridgeX + 30}
              y1={plateY}
              x2={ridgeX + 30}
              y2={ridgeY}
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            <line x1={ridgeX + 25} y1={plateY} x2={ridgeX + 35} y2={plateY} stroke="#94a3b8" strokeWidth="1.2" />
            <line x1={ridgeX + 25} y1={ridgeY} x2={ridgeX + 35} y2={ridgeY} stroke="#94a3b8" strokeWidth="1.2" />
            <text
              x={ridgeX + 42}
              y={ridgeY + risePx / 2 + 4}
              fill="#cbd5e1"
              fontSize="10"
              fontFamily="monospace"
            >
              Rise: {riseFt}′ ({riseInches}″)
            </text>

            {/* Pitch Slope Triangle */}
            <polygon
              points={`
                ${triangleX},${triangleY}
                ${triangleX + triBase},${triangleY}
                ${triangleX + triBase},${triangleY - triHeight}
              `}
              fill="rgba(56, 189, 248, 0.25)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text x={triangleX + triBase / 2 - 8} y={triangleY + 12} fill="#38bdf8" fontSize="9" fontFamily="monospace">
              12
            </text>
            <text x={triangleX + triBase + 4} y={triangleY - triHeight / 2 + 3} fill="#38bdf8" fontSize="9" fontFamily="monospace">
              {pitchIn12}
            </text>
          </svg>
        ) : (
          /* BIRDSMOUTH DETAIL VIEW: Zoomed Notch Layout */
          <svg
            viewBox="0 0 500 280"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Plate Wall Bearing */}
            <rect x="180" y="160" width="140" height="90" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <text x="215" y="215" fill="#64748b" fontSize="12" fontFamily="monospace" fontWeight="bold">
              TOP PLATE (3.5″)
            </text>

            {/* Sloped Rafter Passing Over Wall */}
            <polygon
              points="40,240 460,70 480,120 320,160 180,160 180,95 60,280"
              fill="rgba(245, 158, 11, 0.25)"
              stroke="#f59e0b"
              strokeWidth="3"
            />

            {/* Birdsmouth Notch Highlight */}
            {/* Horizontal Seat Cut */}
            <line x1="180" y1="160" x2="320" y2="160" stroke="#10b981" strokeWidth="3.5" />
            <text x="200" y="152" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
              Seat Cut Bearing: {birdsmouth.seatCutLengthInches}″
            </text>

            {/* Vertical Plumb Cut */}
            <line x1="180" y1="95" x2="180" y2="160" stroke="#ef4444" strokeWidth="3.5" />
            <text x="65" y="132" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
              Plumb Cut: {birdsmouth.plumbCutDepthInches}″
            </text>

            {/* Height Above Plate (H.A.P.) / Heel Stand */}
            <line x1="180" y1="95" x2="200" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <text x="205" y="70" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              H.A.P. Heel Stand: {birdsmouth.heightAbovePlateInches}″
            </text>

            {/* IRC Notch Warning / Pass Indicator */}
            <text x="20" y="25" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              IRC R802.7.1 End Notch Limit: Plumb Cut ≤ {ircCompliance.maxAllowedPlumbCutInches}″ (1/4 Depth)
            </text>
          </svg>
        )}

        {/* Floating IRC Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border backdrop-blur ${
              ircCompliance.isNotchCompliant
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-400 border-amber-500/40"
            }`}
          >
            {ircCompliance.isNotchCompliant ? "✓ IRC Notch Compliant" : "⚠ Notch Exceeds 1/4 Depth"}
          </span>
        </div>
      </div>

      {/* Geometry Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono text-xs">
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Total Cut Length</span>
          <span className="font-bold text-slate-900">{totalCutRafterLengthFormatted}</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Stock Board Order</span>
          <span className="font-bold text-amber-800">{recommendedStockLumberFt}′ Stock Lumber</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Plumb Cut Pitch</span>
          <span className="font-bold text-slate-900">{cutAngles.plumbCutPitchString} ({cutAngles.plumbCutAngleDegrees}°)</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
          <span className="text-[10px] text-slate-500 block">Seat Cut Bearing</span>
          <span className="font-bold text-slate-900">{birdsmouth.seatCutLengthInches}″ ({cutAngles.seatCutAngleDegrees}°)</span>
        </div>
      </div>
    </div>
  );
}
