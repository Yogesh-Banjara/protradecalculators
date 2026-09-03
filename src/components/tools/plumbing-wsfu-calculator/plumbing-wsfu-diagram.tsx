"use client";

import React from "react";
import type { PlumbingWsfuResult } from "@/types/plumbing-wsfu";

interface PlumbingWsfuDiagramProps {
  result: PlumbingWsfuResult | null;
}

export function PlumbingWsfuDiagram({ result }: PlumbingWsfuDiagramProps) {
  const mainSize = result?.recommendedMainPipeSizeInches || "3/4";
  const coldBranchSize = result?.minColdBranchSizeInches || "1/2";
  const hotBranchSize = result?.minHotBranchSizeInches || "1/2";
  const totalWsfu = result?.totalCalculatedWsfu ?? 18.0;
  const peakGpm = result?.totalDesignFlowGpm ?? 20.0;
  const staticPsi = result?.staticPressurePsi ?? 60;
  const residualPsi = result?.actualResidualPressurePsi ?? 48.5;
  const elevationFt = result?.highestFixtureElevationFeet ?? 10;
  const velocityFps = result?.velocityAtRecommendedSizeFps ?? 5.4;
  const material = result?.pipeMaterial === "pex" ? "PEX" : result?.pipeMaterial === "cpvc" ? "CPVC" : "Copper Type L";

  return (
    <div className="w-full bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-800 text-white shadow-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Potable Water Supply Schematic
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Hydraulic Pressure & Pipe Distribution</span>
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-300">Cold Supply</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-300">Hot Supply</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-slate-300">Main Trunk</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] max-h-[420px] min-h-[260px] bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 flex items-center justify-center">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="coldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="hotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <g opacity="0.08" stroke="#94a3b8" strokeWidth="1">
            <line x1="0" y1="90" x2="800" y2="90" strokeDasharray="4 4" />
            <line x1="0" y1="180" x2="800" y2="180" strokeDasharray="4 4" />
            <line x1="0" y1="270" x2="800" y2="270" strokeDasharray="4 4" />
            <line x1="0" y1="360" x2="800" y2="360" strokeDasharray="4 4" />
            <line x1="200" y1="0" x2="200" y2="450" strokeDasharray="4 4" />
            <line x1="400" y1="0" x2="400" y2="450" strokeDasharray="4 4" />
            <line x1="600" y1="0" x2="600" y2="450" strokeDasharray="4 4" />
          </g>

          {/* Elevation Datum Line (Highest Fixture Riser) */}
          <g>
            <line x1="560" y1="380" x2="560" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="560" cy="110" r="4" fill="#f59e0b" />
            <rect x="570" y="230" width="110" height="28" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x="625" y="248" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">
              Δh = {elevationFt} ft Elevation
            </text>
          </g>

          {/* Ground Floor / Foundation Line */}
          <line x1="30" y1="380" x2="770" y2="380" stroke="#475569" strokeWidth="2" strokeDasharray="8 4" />
          <text x="45" y="372" fill="#64748b" fontSize="10" fontWeight="bold">
            FOUNDATION / SLAB DATUM
          </text>

          {/* Water Meter & Municipal Service Entrance */}
          <g transform="translate(40, 310)">
            <rect x="0" y="0" width="80" height="60" rx="8" fill="url(#meterGradient)" stroke="#0ea5e9" strokeWidth="2" />
            <text x="40" y="24" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              METER / PRV
            </text>
            <text x="40" y="44" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {staticPsi} PSI Static
            </text>
            <circle cx="40" cy="0" r="5" fill="#0284c7" />
          </g>

          {/* Water Service Pipe from Street */}
          <line x1="10" y1="340" x2="40" y2="340" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

          {/* Main Potable Supply Trunk */}
          <g>
            {/* Meter out to Water Heater & Main Split */}
            <path
              d="M 120 340 L 250 340"
              stroke="url(#coldGradient)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Flow Direction Arrow */}
            <polygon points="180,335 190,340 180,345" fill="#38bdf8" />

            {/* Main Pipe Sizing Callout Badge */}
            <g transform="translate(140, 275)" filter="url(#glowEffect)">
              <rect x="0" y="0" width="105" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="52" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                MAIN TRUNK: {mainSize}&quot;
              </text>
              <text x="52" y="33" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                {peakGpm} GPM | {velocityFps} FPS
              </text>
            </g>
          </g>

          {/* Water Heater Unit */}
          <g transform="translate(250, 260)">
            <rect x="0" y="0" width="60" height="90" rx="10" fill="#1e293b" stroke="#e11d48" strokeWidth="2" />
            <text x="30" y="35" fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="middle">
              WATER
            </text>
            <text x="30" y="50" fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="middle">
              HEATER
            </text>
            <circle cx="20" cy="0" r="4" fill="#0284c7" />
            <circle cx="40" cy="0" r="4" fill="#e11d48" />
          </g>

          {/* Cold Water Distribution Network */}
          <g>
            {/* Cold Header along 1st floor */}
            <path
              d="M 250 340 L 400 340 L 400 220 L 560 220 L 560 110 L 680 110"
              stroke="#0284c7"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 1st Floor Cold Fixture Drops */}
            <line x1="360" y1="340" x2="360" y2="300" stroke="#38bdf8" strokeWidth="3" />
            <line x1="460" y1="220" x2="460" y2="180" stroke="#38bdf8" strokeWidth="3" />
          </g>

          {/* Hot Water Distribution Network */}
          <g>
            {/* Hot Header from Water Heater */}
            <path
              d="M 290 260 L 290 200 L 420 200 L 420 230 L 540 230 L 540 125 L 680 125"
              stroke="#e11d48"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
            />
          </g>

          {/* Fixture Symbols */}
          {/* Fixture 1: Kitchen Sink / Dishwasher (1st Floor) */}
          <g transform="translate(340, 270)">
            <rect x="0" y="0" width="40" height="25" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <text x="20" y="16" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
              Kitchen
            </text>
          </g>

          {/* Fixture 2: Laundry Washer / Utility (1st Floor) */}
          <g transform="translate(440, 150)">
            <rect x="0" y="0" width="42" height="25" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <text x="21" y="16" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
              Laundry
            </text>
          </g>

          {/* Fixture 3: Upper Bathroom / Highest Fixture (2nd Floor) */}
          <g transform="translate(680, 95)">
            <rect x="0" y="0" width="95" height="55" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="47" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              UPPER BATH
            </text>
            <text x="47" y="33" fill="#fcd34d" fontSize="9" fontWeight="bold" textAnchor="middle">
              {residualPsi} PSI Residual
            </text>
            <text x="47" y="47" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Branch: {coldBranchSize}&quot; C / {hotBranchSize}&quot; H
            </text>
          </g>

          {/* Bottom Live HUD Status Banner */}
          <g transform="translate(40, 395)">
            <rect x="0" y="0" width="720" height="42" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="20" y="26" fill="#94a3b8" fontSize="10">
              TOTAL LOAD: <tspan fill="#38bdf8" fontWeight="bold">{totalWsfu} WSFU</tspan>
            </text>
            <text x="170" y="26" fill="#94a3b8" fontSize="10">
              PEAK FLOW: <tspan fill="#38bdf8" fontWeight="bold">{peakGpm} GPM</tspan>
            </text>
            <text x="310" y="26" fill="#94a3b8" fontSize="10">
              MATERIAL: <tspan fill="#e2e8f0" fontWeight="bold">{material}</tspan>
            </text>
            <text x="475" y="26" fill="#94a3b8" fontSize="10">
              RECOMMENDED MAIN: <tspan fill="#22c55e" fontWeight="bold">{mainSize}&quot;</tspan>
            </text>
            <text x="640" y="26" fill="#94a3b8" fontSize="10">
              RESIDUAL: <tspan fill="#f59e0b" fontWeight="bold">{residualPsi} PSI</tspan>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
