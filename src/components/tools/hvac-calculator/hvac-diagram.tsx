"use client";

import React, { useState } from "react";
import type { HvacLoadResult } from "@/types/hvac";
import { Wind, Snowflake, Flame } from "lucide-react";

export interface HvacDiagramProps {
  result: HvacLoadResult;
}

export function HvacDiagram({ result }: HvacDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "envelope" | "solar" | "airflow">("all");

  const {
    coolingLoadBtuHr,
    recommendedCoolingTons,
    heatingLoadBtuHr,
    climateZoneInfo,
    conditionedAreaSqFt,
  } = result;

  const recommendedAirflowCfm = Math.round(recommendedCoolingTons * 400);

  const svgWidth = 600;
  const svgHeight = 260;

  // Scale building envelope box based on square footage
  const areaScale = Math.min(1.4, Math.max(0.7, conditionedAreaSqFt / 1800));
  const bldgWidth = Math.round(220 * areaScale);
  const bldgHeight = 110;
  const bldgLeft = Math.round(300 - bldgWidth / 2);
  const bldgTop = 110;

  return (
    <div className="glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4">
      {/* Top Header & Layer Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Building Thermal Envelope CAD Blueprint
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {conditionedAreaSqFt} sq ft &bull; Climate Zone {climateZoneInfo.zone} ({climateZoneInfo.summerOutdoorDesignTempF}°F Design) &bull; {recommendedAirflowCfm} CFM
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "all" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            All Systems
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("envelope")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "envelope" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Envelope
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("airflow")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              activeLayer === "airflow" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Airflow CFM
          </button>
        </div>
      </div>

      {/* SVG Building Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun & Solar Radiation Rays */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "solar" ? 1 : 0.25}
          >
            <circle cx="60" cy="45" r="22" fill="#f59e0b" />
            <line x1="60" y1="16" x2="60" y2="4" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="88" y1="45" x2="100" y2="45" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="80" y1="65" x2="90" y2="75" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="60" y="85" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              SOLAR GAIN
            </text>
          </g>

          {/* Roof / Attic Gable Triangle */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "envelope" ? 1 : 0.25}
          >
            <polygon
              points={`${bldgLeft},${bldgTop} ${bldgLeft + bldgWidth / 2},${bldgTop - 55} ${bldgLeft + bldgWidth},${bldgTop}`}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x={bldgLeft + bldgWidth / 2} y={bldgTop - 15} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Attic Thermal Boundary
            </text>
          </g>

          {/* Conditioned Living Space Envelope */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "envelope" ? 1 : 0.25}
          >
            <rect
              x={bldgLeft}
              y={bldgTop}
              width={bldgWidth}
              height={bldgHeight}
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2.5"
              rx="4"
            />

            {/* Window Left */}
            <rect
              x={bldgLeft + 25}
              y={bldgTop + 30}
              width="36"
              height="42"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1.5"
              rx="2"
            />

            {/* Window Right */}
            <rect
              x={bldgLeft + bldgWidth - 61}
              y={bldgTop + 30}
              width="36"
              height="42"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1.5"
              rx="2"
            />

            {/* Center Area Readout */}
            <text x={bldgLeft + bldgWidth / 2} y={bldgTop + 55} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {conditionedAreaSqFt} sq ft
            </text>
            <text x={bldgLeft + bldgWidth / 2} y={bldgTop + 72} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
              Conditioned Space
            </text>
          </g>

          {/* Airflow Supply & Return Streamlines */}
          <g
            className="transition-opacity duration-200"
            opacity={activeLayer === "all" || activeLayer === "airflow" ? 1 : 0.25}
          >
            {/* Supply Duct Line */}
            <path
              d={`M ${bldgLeft + bldgWidth / 2 - 40} ${bldgTop} Q ${bldgLeft + bldgWidth / 2 - 30} ${bldgTop + 25} ${bldgLeft + bldgWidth / 2 - 40} ${bldgTop + 45}`}
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
            />
            {/* Return Duct Line */}
            <path
              d={`M ${bldgLeft + bldgWidth / 2 + 40} ${bldgTop + 45} Q ${bldgLeft + bldgWidth / 2 + 30} ${bldgTop + 25} ${bldgLeft + bldgWidth / 2 + 40} ${bldgTop}`}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
            />
            <text x={bldgLeft + bldgWidth / 2} y={bldgTop + 95} fill="#06b6d4" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {recommendedAirflowCfm} CFM Supply Airflow
            </text>
          </g>
        </svg>

        {/* Floating Tonnage Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 backdrop-blur">
            Recommended: {recommendedCoolingTons} Tons AC
          </span>
        </div>
      </div>

      {/* Quick HVAC Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Snowflake className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Cooling Load</span>
            <span className="text-xs font-bold text-cyan-300">
              {coolingLoadBtuHr.toLocaleString()} BTU/h
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">AC Tonnage</span>
            <span className="text-xs font-bold text-amber-400">
              {recommendedCoolingTons} Tons
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Heating Load</span>
            <span className="text-xs font-bold text-rose-300">
              {heatingLoadBtuHr.toLocaleString()} BTU/h
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-cyan-400">CFM</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Airflow Rate</span>
            <span className="text-xs font-bold text-white">
              {recommendedAirflowCfm} CFM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
