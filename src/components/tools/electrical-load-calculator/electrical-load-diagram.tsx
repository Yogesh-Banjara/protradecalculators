"use client";

import React from "react";
import type { ElectricalLoadResult } from "@/types/electrical-load";
import { roundTo } from "@/lib/calculations/rounding";

export interface ElectricalLoadDiagramProps {
  result: ElectricalLoadResult;
}

export function ElectricalLoadDiagram({ result }: ElectricalLoadDiagramProps) {
  const {
    calculatedServiceAmps,
    existingServiceRatingAmps,
    proposedServiceRatingAmps,
    totalCalculatedDemandKva,
    existingServiceUtilizationPct,
    existingServiceStatus,
    breakdown,
  } = result;

  const svgWidth = 340;
  const svgHeight = 240;

  // Status color variables
  let badgeBg = "#065f46";
  let badgeText = "#34d399";
  let statusText = "SAFE CAPACITY (PASS)";

  if (existingServiceStatus === "approaching_capacity") {
    badgeBg = "#78350f";
    badgeText = "#fbbf24";
    statusText = "NEAR CAPACITY (REVIEW)";
  } else if (existingServiceStatus === "service_upgrade_required") {
    badgeBg = "#881337";
    badgeText = "#f43f5e";
    statusText = "OVERLOADED (UPGRADE REQUIRED)";
  }

  // Calculate visual load bar width (capped at 100% of 120px)
  const loadBarWidth = Math.min(120, Math.max(8, (existingServiceUtilizationPct / 100) * 120));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
          Service Panel Load Distribution &amp; Bus Bar Diagram
        </h4>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border"
            style={{
              backgroundColor: `${badgeBg}30`,
              color: badgeText,
              borderColor: `${badgeText}40`,
            }}
          >
            {statusText}
          </span>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {calculatedServiceAmps}A / {existingServiceRatingAmps}A
          </span>
        </div>
      </div>

      {/* SVG Canvas & Numerical Readout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Graphic Canvas */}
        <div className="w-full overflow-hidden bg-slate-950 rounded-md p-3 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[300px] h-52 select-none font-mono"
            aria-label="Electrical panel load distribution blueprint"
          >
            {/* Utility Feed Lines at Top */}
            <line x1={80} y1={10} x2={80} y2={35} stroke="#ef4444" strokeWidth="2.5" />
            <line x1={95} y1={10} x2={95} y2={35} stroke="#3b82f6" strokeWidth="2.5" />
            <line x1={110} y1={10} x2={110} y2={35} stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x={95} y={8} fill="#94a3b8" fontSize="7" textAnchor="middle">
              240V 1-PH UTILITY FEED
            </text>

            {/* Panel Outer Enclosure */}
            <rect
              x={35}
              y={35}
              width={120}
              height={190}
              rx={5}
              fill="#0f172a"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Main Service Breaker */}
            <rect
              x={60}
              y={45}
              width={70}
              height={22}
              rx={3}
              fill="#1e293b"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <text x={95} y={59} fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
              MAIN {existingServiceRatingAmps}A
            </text>

            {/* Interior Bus Bars */}
            <rect x={75} y={75} width={12} height={135} fill="#334155" />
            <rect x={103} y={75} width={12} height={135} fill="#334155" />

            {/* Branch Circuit Breakers (Left Side) */}
            {/* HVAC Breaker */}
            <rect x={42} y={80} width={30} height={14} rx={2} fill={breakdown.selectedHvacLoadVa > 0 ? "#0284c7" : "#1e293b"} stroke="#38bdf8" strokeWidth="0.5" />
            <text x={57} y={90} fill="#ffffff" fontSize="6.5" textAnchor="middle">HVAC</text>

            {/* Range Breaker */}
            <rect x={42} y={98} width={30} height={14} rx={2} fill="#d97706" stroke="#f59e0b" strokeWidth="0.5" />
            <text x={57} y={108} fill="#ffffff" fontSize="6.5" textAnchor="middle">RANGE</text>

            {/* Water Heater Breaker */}
            <rect x={42} y={116} width={30} height={14} rx={2} fill="#b45309" stroke="#fbbf24" strokeWidth="0.5" />
            <text x={57} y={126} fill="#ffffff" fontSize="6.5" textAnchor="middle">WTR HTR</text>

            {/* Dryer Breaker */}
            <rect x={42} y={134} width={30} height={14} rx={2} fill="#059669" stroke="#34d399" strokeWidth="0.5" />
            <text x={57} y={144} fill="#ffffff" fontSize="6.5" textAnchor="middle">DRYER</text>

            {/* General Lighting 1 */}
            <rect x={42} y={152} width={30} height={12} rx={2} fill="#334155" stroke="#64748b" strokeWidth="0.5" />
            <text x={57} y={161} fill="#cbd5e1" fontSize="6" textAnchor="middle">LIGHTS 1</text>

            {/* General Lighting 2 */}
            <rect x={42} y={168} width={30} height={12} rx={2} fill="#334155" stroke="#64748b" strokeWidth="0.5" />
            <text x={57} y={177} fill="#cbd5e1" fontSize="6" textAnchor="middle">LIGHTS 2</text>

            {/* Branch Circuit Breakers (Right Side) */}
            {/* EV Charger Breaker */}
            <rect x={118} y={80} width={30} height={14} rx={2} fill={breakdown.evChargerDemandVa > 0 ? "#16a34a" : "#1e293b"} stroke="#4ade80" strokeWidth="0.5" />
            <text x={133} y={90} fill="#ffffff" fontSize="6.5" textAnchor="middle">
              {breakdown.evChargerDemandVa > 0 ? "EV CHG" : "SPARE"}
            </text>

            {/* Kitchen Small App 1 */}
            <rect x={118} y={98} width={30} height={12} rx={2} fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
            <text x={133} y={107} fill="#ffffff" fontSize="6" textAnchor="middle">S. APP 1</text>

            {/* Kitchen Small App 2 */}
            <rect x={118} y={114} width={30} height={12} rx={2} fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
            <text x={133} y={123} fill="#ffffff" fontSize="6" textAnchor="middle">S. APP 2</text>

            {/* Laundry Circuit */}
            <rect x={118} y={130} width={30} height={12} rx={2} fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
            <text x={133} y={139} fill="#ffffff" fontSize="6" textAnchor="middle">LAUNDRY</text>

            {/* Dishwasher / Disposal */}
            <rect x={118} y={146} width={30} height={12} rx={2} fill="#334155" stroke="#64748b" strokeWidth="0.5" />
            <text x={133} y={155} fill="#cbd5e1" fontSize="6" textAnchor="middle">DISH/DISP</text>

            {/* Spare / Custom */}
            <rect x={118} y={162} width={30} height={12} rx={2} fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
            <text x={133} y={171} fill="#94a3b8" fontSize="6" textAnchor="middle">SPARE</text>

            {/* Right Side: Visual Load Gauge & Legend */}
            {/* Divider */}
            <line x1={175} y1={25} x2={175} y2={215} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

            {/* Capacity Bar Header */}
            <text x={190} y={45} fill="#94a3b8" fontSize="8" fontWeight="bold">
              BUS BAR CAPACITY
            </text>

            {/* Background Capacity Track */}
            <rect x={190} y={55} width={120} height={14} rx={3} fill="#1e293b" stroke="#334155" />
            {/* Active Load Bar */}
            <rect
              x={190}
              y={55}
              width={loadBarWidth}
              height={14}
              rx={3}
              fill={
                existingServiceStatus === "well_within_capacity"
                  ? "#10b981"
                  : existingServiceStatus === "approaching_capacity"
                  ? "#f59e0b"
                  : "#f43f5e"
              }
            />
            <text x={250} y={66} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
              {existingServiceUtilizationPct}% LOAD
            </text>

            {/* Legend Callouts */}
            <text x={190} y={95} fill="#94a3b8" fontSize="7.5">
              &bull; General Load: <tspan fill="#ffffff">{breakdown.calculatedGeneralDemandVa} VA</tspan>
            </text>
            <text x={190} y={115} fill="#94a3b8" fontSize="7.5">
              &bull; HVAC (Largest): <tspan fill="#38bdf8">{breakdown.selectedHvacLoadVa} VA</tspan>
            </text>
            <text x={190} y={135} fill="#94a3b8" fontSize="7.5">
              &bull; EV Charger: <tspan fill="#4ade80">{breakdown.evChargerDemandVa} VA</tspan>
            </text>
            <text x={190} y={155} fill="#94a3b8" fontSize="7.5">
              &bull; Total Demand: <tspan fill="#fbbf24">{totalCalculatedDemandKva} kVA</tspan>
            </text>

            {/* Bottom Recommendation Box */}
            <rect x={185} y={175} width={145} height={45} rx={4} fill="#0f172a" stroke="#334155" />
            <text x={195} y={190} fill="#94a3b8" fontSize="7">
              MINIMUM RECOMMENDED SERVICE:
            </text>
            <text x={195} y={208} fill="#38bdf8" fontSize="13" fontWeight="black">
              {result.recommendedMinimumServiceAmps}A PANEL
            </text>
          </svg>
        </div>

        {/* Numerical Readout Breakdown */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans block uppercase">
              Calculated Demand Amperage (240V 1-Phase)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 font-sans">
                {calculatedServiceAmps} Amps
              </span>
              <span className="text-xs text-slate-600 font-sans">
                ({totalCalculatedDemandKva} kVA / {result.totalCalculatedDemandVa.toLocaleString()} VA)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 font-sans">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">
                Existing {existingServiceRatingAmps}A Panel
              </span>
              <span
                className={`text-sm font-bold block ${
                  existingServiceStatus === "well_within_capacity"
                    ? "text-emerald-700"
                    : existingServiceStatus === "approaching_capacity"
                    ? "text-amber-700"
                    : "text-rose-700"
                }`}
              >
                {existingServiceUtilizationPct}% Utilized
              </span>
              <span className="text-[10px] text-slate-500">
                {result.remainingCapacityAmps >= 0
                  ? `${result.remainingCapacityAmps}A headroom`
                  : `${Math.abs(result.remainingCapacityAmps)}A overload`}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">
                Proposed {proposedServiceRatingAmps}A Panel
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {result.proposedServiceUtilizationPct}% Utilized
              </span>
              <span className="text-[10px] text-slate-500">
                {roundTo(proposedServiceRatingAmps - calculatedServiceAmps, 1)}A spare capacity
              </span>
            </div>
          </div>

          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 font-sans">
            <span className="text-[10px] text-slate-500 block uppercase">
              Service Sizing Verdict
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {calculatedServiceAmps <= existingServiceRatingAmps
                ? `Calculated demand (${calculatedServiceAmps}A) is within existing ${existingServiceRatingAmps}A service rating.`
                : `Calculated demand (${calculatedServiceAmps}A) exceeds existing ${existingServiceRatingAmps}A service. Service upgrade to ${result.recommendedMinimumServiceAmps}A is recommended.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
