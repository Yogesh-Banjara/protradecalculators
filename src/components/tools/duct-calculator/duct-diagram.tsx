"use client";

import React from "react";
import type { DuctSizingResult } from "@/types/duct";

export interface DuctDiagramProps {
  result: DuctSizingResult;
}

export function DuctDiagram({ result }: DuctDiagramProps) {
  const { mainTrunk, totalCfm, sizingMethod } = result;

  const svgWidth = 320;
  const svgHeight = 220;

  // Velocity status colors
  let velocityBadgeBg = "#065f46";
  let velocityBadgeText = "#34d399";
  let velocityLabel = "OPTIMAL RESIDENTIAL VELOCITY";

  if (mainTrunk.velocityStatus === "quiet") {
    velocityBadgeBg = "#1e293b";
    velocityBadgeText = "#38bdf8";
    velocityLabel = "QUIET / SOUND-SENSITIVE";
  } else if (mainTrunk.velocityStatus === "high_velocity") {
    velocityBadgeBg = "#78350f";
    velocityBadgeText = "#fbbf24";
    velocityLabel = "HIGH VELOCITY / COMMERCIAL TRUNK";
  } else if (mainTrunk.velocityStatus === "excessive_noise") {
    velocityBadgeBg = "#881337";
    velocityBadgeText = "#f43f5e";
    velocityLabel = "EXCESSIVE VELOCITY / NOISE RISK";
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
          Duct Profile Geometry &amp; Airflow Cross-Section
        </h4>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border"
            style={{
              backgroundColor: `${velocityBadgeBg}30`,
              color: velocityBadgeText,
              borderColor: `${velocityBadgeText}40`,
            }}
          >
            {velocityLabel}
          </span>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {totalCfm} CFM
          </span>
        </div>
      </div>

      {/* SVG Canvas and Numerical Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Graphic Canvas */}
        <div className="w-full overflow-hidden bg-slate-950 rounded-md p-3 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[280px] h-48 select-none font-mono"
            aria-label="HVAC duct cross-section geometry schematic"
          >
            {/* Left: Round Duct Cross Section */}
            <circle
              cx={75}
              cy={95}
              r={42}
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Round Airflow Motion Vector Arrows */}
            <circle cx={75} cy={95} r={28} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="75,67 71,73 79,73" fill="#38bdf8" />
            <polygon points="75,123 71,117 79,117" fill="#38bdf8" />

            {/* Round Duct Diameter Callout Line */}
            <line x1={33} y1={95} x2={117} y2={95} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx={33} cy={95} r={2} fill="#f59e0b" />
            <circle cx={117} cy={95} r={2} fill="#f59e0b" />
            <text x={75} y={91} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
              {mainTrunk.recommendedStandardDiameterInches}&quot; Ø
            </text>

            <text x={75} y={155} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              Standard Round Duct
            </text>
            <text x={75} y={167} fill="#38bdf8" fontSize="8" textAnchor="middle">
              {mainTrunk.actualRoundVelocityFpm} FPM
            </text>

            {/* Divider Line */}
            <line x1={155} y1={25} x2={155} y2={185} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

            {/* Right: Rectangular Duct Equivalent */}
            <rect
              x={185}
              y={65}
              width={95}
              height={60}
              rx={3}
              fill="#0f172a"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            {/* Rectangular Airflow Vectors */}
            <line x1={200} y1={95} x2={265} y2={95} stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
            <polygon points="265,95 258,91 258,99" fill="#c084fc" />

            {/* Width Dimension Callout Top */}
            <text x={232.5} y={56} fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">
              {mainTrunk.rectangularWidthInches}&quot; W
            </text>

            {/* Height Dimension Callout Right */}
            <text x={290} y={98} fill="#c084fc" fontSize="9" fontWeight="bold">
              {mainTrunk.rectangularHeightInches}&quot; H
            </text>

            <text x={232.5} y={155} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              Rectangular Equivalent
            </text>
            <text x={232.5} y={167} fill="#c084fc" fontSize="8" textAnchor="middle">
              {mainTrunk.actualRectangularVelocityFpm} FPM ({mainTrunk.rectangularAspectRatio}:1 AR)
            </text>

            {/* Bottom Total CFM Footer */}
            <text x={160} y={205} fill="#64748b" fontSize="8" textAnchor="middle">
              Airflow: {totalCfm} CFM &bull; {sizingMethod === "equal_friction" ? "Equal Friction" : "Velocity Limit"}
            </text>
          </svg>
        </div>

        {/* Numerical Blueprint Readout */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans block uppercase">
              Recommended Main Supply Trunk
            </span>
            <span className="text-base font-bold text-slate-900 font-sans">
              {mainTrunk.recommendedStandardDiameterInches}&quot; Round ({mainTrunk.theoreticalDiameterInches}&quot; exact)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">
                Round Air Velocity
              </span>
              <span className="text-sm font-bold text-amber-800 font-sans">
                {mainTrunk.actualRoundVelocityFpm} FPM
              </span>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">
                Friction Drop Rate
              </span>
              <span className="text-sm font-bold text-slate-800 font-sans">
                {mainTrunk.roundFrictionLossInWgPer100Ft} in. w.g./100&apos;
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans block uppercase">
              Rectangular Equivalent Profile
            </span>
            <div className="flex items-baseline justify-between pt-0.5 font-sans">
              <span className="text-sm font-bold text-purple-900">
                {mainTrunk.rectangularWidthInches}&quot; W &times; {mainTrunk.rectangularHeightInches}&quot; H
              </span>
              <span className="text-xs text-slate-600">
                {mainTrunk.actualRectangularVelocityFpm} FPM ({mainTrunk.rectangularAspectRatio}:1 Aspect Ratio)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
