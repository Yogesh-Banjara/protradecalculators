"use client";

import React, { useState } from "react";
import type { DeckCalculatorResult } from "@/types/deck";
import { Layers, Maximize2, Hammer } from "lucide-react";

export interface DeckDiagramProps {
  result: DeckCalculatorResult;
}

export type DeckViewLayer = "all" | "decking" | "joists" | "beams" | "footings";

export function DeckDiagram({ result }: DeckDiagramProps) {
  const [activeLayer, setActiveLayer] = useState<DeckViewLayer>("all");
  const [viewMode, setViewMode] = useState<"isometric" | "plan">("isometric");

  const { lengthFt, widthFt, decking, framing, concrete } = result;

  const svgWidth = 620;
  const svgHeight = 370;

  // Aspect scaling calculations
  const aspectRatio = lengthFt / Math.max(1, widthFt);

  // Plan view geometry
  const planMarginX = 50;
  const planMarginY = 55;
  const planWidth = 520;
  const planHeight = Math.min(240, Math.max(150, Math.round(planWidth / Math.max(0.7, aspectRatio))));

  // Isometric projection vertices
  // Origin anchor for house ledger (top-right back corner)
  const isoOriginX = 350;
  const isoOriginY = 60;

  // Standard 30° isometric projection with robust dynamic scaling
  const baseLen = Math.min(270, Math.max(150, 160 + (Math.min(50, Math.max(6, lengthFt)) - 10) * 2.8));
  const baseWid = Math.min(200, Math.max(110, 120 + (Math.min(30, Math.max(6, widthFt)) - 8) * 3.2));

  const vecLengthX = -0.866 * baseLen;
  const vecLengthY = 0.5 * baseLen;

  const vecWidthX = 0.866 * baseWid;
  const vecWidthY = 0.5 * baseWid;

  // 4 Top Corners of the Deck Plane in Isometric Space
  // P0 = Back-Right (Ledger Start)
  // P1 = Back-Left (Ledger End)
  // P2 = Front-Left (Outer Corner)
  // P3 = Front-Right (Outer Corner)
  const p0 = { x: isoOriginX, y: isoOriginY };
  const p1 = { x: isoOriginX + vecLengthX, y: isoOriginY + vecLengthY };
  const p2 = { x: p1.x + vecWidthX, y: p1.y + vecWidthY };
  const p3 = { x: p0.x + vecWidthX, y: p0.y + vecWidthY };

  // Drop beam location (~80% of projection)
  const beamFraction = 0.82;
  const beamBackLeft = { x: p1.x + vecWidthX * beamFraction, y: p1.y + vecWidthY * beamFraction };
  const beamBackRight = { x: p0.x + vecWidthX * beamFraction, y: p0.y + vecWidthY * beamFraction };

  // Support Posts & Piers along the beam line (visual capped at 12)
  const postCount = Math.min(12, Math.max(2, framing.supportPostsCount));
  const postHeight = 65;
  const pierHeight = 28;

  const postPositions = Array.from({ length: postCount }).map((_, i) => {
    const t = postCount === 1 ? 0.5 : i / (postCount - 1);
    const topX = beamBackLeft.x + (beamBackRight.x - beamBackLeft.x) * t;
    const topY = beamBackLeft.y + (beamBackRight.y - beamBackLeft.y) * t;
    return { topX, topY, bottomX: topX, bottomY: topY + postHeight };
  });

  // Number of joists to visually display
  const visualJoistCount = Math.min(22, Math.max(6, framing.fieldJoistsCount));
  const joistLines = Array.from({ length: visualJoistCount }).map((_, i) => {
    const t = visualJoistCount === 1 ? 0.5 : i / (visualJoistCount - 1);
    const startX = p1.x + (p0.x - p1.x) * t;
    const startY = p1.y + (p0.y - p1.y) * t;
    const endX = p2.x + (p3.x - p2.x) * t;
    const endY = p2.y + (p3.y - p2.y) * t;
    return { startX, startY, endX, endY };
  });

  // Number of decking surface planks to visually display
  const visualPlankCount = Math.min(28, Math.max(10, decking.totalBoardRows));
  const plankLines = Array.from({ length: visualPlankCount }).map((_, i) => {
    const t = visualPlankCount === 1 ? 0.5 : i / (visualPlankCount - 1);
    const startX = p1.x + (p2.x - p1.x) * t;
    const startY = p1.y + (p2.y - p1.y) * t;
    const endX = p0.x + (p3.x - p0.x) * t;
    const endY = p0.y + (p3.y - p0.y) * t;
    return { startX, startY, endX, endY };
  });

  return (
    <div className="glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4">
      {/* Top Telemetry Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Hammer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              Structural Deck Framing &amp; Footing Blueprint
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {lengthFt}′ Length &times; {widthFt}′ Projection &bull; {decking.deckSurfaceAreaSqFt} sq ft &bull; {framing.joistSpacingInches}″ OC Joists ({framing.joistLumber})
            </p>
          </div>
        </div>

        {/* View Controls & Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {/* 3D vs Plan View Toggle */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode("isometric")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                viewMode === "isometric"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Isometric 3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode("plan")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                viewMode === "plan"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Plan View
            </button>
          </div>

          {/* Layer Filter */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveLayer("all")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                activeLayer === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("decking")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                activeLayer === "decking" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Decking
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("joists")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                activeLayer === "joists" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Joists
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("beams")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                activeLayer === "beams" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Beams &amp; Posts
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Blueprint */}
      <div className="relative w-full aspect-[16/10] max-h-[380px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden bg-blueprint-grid">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {viewMode === "isometric" ? (
            /* ISOMETRIC 3D STRUCTURAL ASSEMBLY */
            <g id="isometric-deck-group">
              {/* 1. House Attachment / Ledger Wall (Background) */}
              <g id="house-wall" opacity={activeLayer === "all" || activeLayer === "joists" ? 1 : 0.25}>
                {/* House Wall Siding Representation */}
                <polygon
                  points={`${p1.x - 30},${p1.y - 45} ${p0.x + 30},${p0.y - 45} ${p0.x + 30},${p0.y + 10} ${p1.x - 30},${p1.y + 10}`}
                  fill="#1e293b"
                  fillOpacity="0.4"
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <rect
                  x={(p0.x + p1.x) / 2 - 95}
                  y={(p0.y + p1.y) / 2 - 28}
                  width="190"
                  height="16"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.85"
                />
                <text
                  x={(p0.x + p1.x) / 2}
                  y={(p0.y + p1.y) / 2 - 16}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  HOUSE WALL (ATTACHED LEDGER)
                </text>

                {/* Ledger Board along P1 to P0 */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p0.x}
                  y2={p0.y}
                  stroke="#cbd5e1"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>

              {/* 2. Concrete Sonotube Footing Piers (Ground Layer) */}
              <g
                id="concrete-piers"
                opacity={activeLayer === "all" || activeLayer === "footings" || activeLayer === "beams" ? 1 : 0.15}
              >
                {postPositions.map((p, idx) => (
                  <g key={`pier-${idx}`}>
                    {/* Footing Pier Cylinder */}
                    <ellipse
                      cx={p.bottomX}
                      cy={p.bottomY + pierHeight}
                      rx="16"
                      ry="8"
                      fill="#334155"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />
                    <rect
                      x={p.bottomX - 16}
                      y={p.bottomY}
                      width="32"
                      height={pierHeight}
                      fill="#1e293b"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx={p.bottomX}
                      cy={p.bottomY}
                      rx="16"
                      ry="8"
                      fill="#475569"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />
                    <text
                      x={p.bottomX}
                      y={p.bottomY + pierHeight + 14}
                      fill="#06b6d4"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {concrete.pierDiameterInches}″ Pier
                    </text>
                  </g>
                ))}
              </g>

              {/* 3. Support Posts (4x4 or 6x6) */}
              <g
                id="support-posts"
                opacity={activeLayer === "all" || activeLayer === "beams" ? 1 : 0.2}
              >
                {postPositions.map((p, idx) => (
                  <g key={`post-${idx}`}>
                    {/* Post column */}
                    <rect
                      x={p.topX - 5}
                      y={p.topY}
                      width="10"
                      height={postHeight}
                      fill="#b45309"
                      stroke="#d97706"
                      strokeWidth="1.5"
                    />
                  </g>
                ))}
              </g>

              {/* 4. Drop Support Beam (2-ply / 3-ply) */}
              <g
                id="support-beam"
                opacity={activeLayer === "all" || activeLayer === "beams" ? 1 : 0.2}
              >
                <line
                  x1={beamBackLeft.x}
                  y1={beamBackLeft.y}
                  x2={beamBackRight.x}
                  y2={beamBackRight.y}
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="square"
                />
                <rect
                  x={(beamBackLeft.x + beamBackRight.x) / 2 - 80}
                  y={(beamBackLeft.y + beamBackRight.y) / 2 - 22}
                  width="160"
                  height="16"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.85"
                />
                <text
                  x={(beamBackLeft.x + beamBackRight.x) / 2}
                  y={(beamBackLeft.y + beamBackRight.y) / 2 - 10}
                  fill="#fbbf24"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {framing.beamLumber} Beam ({framing.beamLengthFt}′)
                </text>
              </g>

              {/* 5. Framing Field Joists & Rim Joists */}
              <g
                id="joist-framing"
                opacity={activeLayer === "all" || activeLayer === "joists" ? 1 : 0.15}
              >
                {/* Joist Lines */}
                {joistLines.map((j, idx) => (
                  <line
                    key={`joist-${idx}`}
                    x1={j.startX}
                    y1={j.startY}
                    x2={j.endX}
                    y2={j.endY}
                    stroke="#38bdf8"
                    strokeWidth={idx === 0 || idx === visualJoistCount - 1 ? "3" : "1.8"}
                    strokeDasharray={idx === 0 || idx === visualJoistCount - 1 ? "none" : "3 3"}
                  />
                ))}

                {/* Front Rim Joist (P2 to P3) */}
                <line
                  x1={p2.x}
                  y1={p2.y}
                  x2={p3.x}
                  y2={p3.y}
                  stroke="#38bdf8"
                  strokeWidth="4"
                />
                {/* Side Rim Joists (P1 to P2 and P0 to P3) */}
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#38bdf8" strokeWidth="3" />
                <line x1={p0.x} y1={p0.y} x2={p3.x} y2={p3.y} stroke="#38bdf8" strokeWidth="3" />
              </g>

              {/* 6. Decking Surface Planks */}
              <g
                id="decking-surface"
                opacity={activeLayer === "all" || activeLayer === "decking" ? 1 : 0.15}
              >
                {/* Semi-transparent surface tint */}
                <polygon
                  points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                  fill="#d97706"
                  fillOpacity="0.14"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />

                {/* Individual Decking Planks */}
                {plankLines.map((plank, idx) => (
                  <line
                    key={`plank-${idx}`}
                    x1={plank.startX}
                    y1={plank.startY}
                    x2={plank.endX}
                    y2={plank.endY}
                    stroke="#fbbf24"
                    strokeWidth="1.4"
                    strokeOpacity="0.8"
                  />
                ))}
              </g>

              {/* 7. Dimension Extension Lines & Callouts with Contrast Backdrops */}
              <g id="dimension-callouts" className="select-none font-mono">
                {/* Length Dimension along Ledger (P1 to P0) */}
                <rect
                  x={(p1.x + p0.x) / 2 - 55}
                  y={(p1.y + p0.y) / 2 - 26}
                  width="110"
                  height="18"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.9"
                  stroke="#fbbf24"
                  strokeWidth="1"
                />
                <text
                  x={(p1.x + p0.x) / 2}
                  y={(p1.y + p0.y) / 2 - 13}
                  fill="#fbbf24"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {lengthFt}′ Length
                </text>

                {/* Width / Projection Dimension along Side Rim (P0 to P3) */}
                <rect
                  x={(p0.x + p3.x) / 2 + 10}
                  y={(p0.y + p3.y) / 2 - 9}
                  width="120"
                  height="18"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.9"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={(p0.x + p3.x) / 2 + 70}
                  y={(p0.y + p3.y) / 2 + 4}
                  fill="#38bdf8"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {widthFt}′ Projection
                </text>

                {/* Joist Spacing Badge at Front */}
                <rect
                  x={(p2.x + p3.x) / 2 - 110}
                  y={(p2.y + p3.y) / 2 + 10}
                  width="220"
                  height="18"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.9"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={(p2.x + p3.x) / 2}
                  y={(p2.y + p3.y) / 2 + 23}
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {framing.fieldJoistsCount} Joists @ {framing.joistSpacingInches}″ OC ({framing.joistLumber})
                </text>
              </g>
            </g>
          ) : (
            /* 2D PLAN VIEW (TOP-DOWN ARCHITECTURAL) */
            <g id="plan-deck-group" transform={`translate(${planMarginX}, ${planMarginY})`}>
              {/* House Wall / Ledger */}
              <rect
                x="0"
                y="-14"
                width={planWidth}
                height="12"
                fill="#334155"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <text
                x={planWidth / 2}
                y="-4"
                fill="#cbd5e1"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                HOUSE ATTACHMENT &bull; {framing.ledgerLengthFt}′ LEDGER BOARD ({framing.joistLumber})
              </text>

              {/* Outer Deck Perimeter */}
              <rect
                x="0"
                y="0"
                width={planWidth}
                height={planHeight}
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Field Joists Lines in Plan */}
              {Array.from({ length: Math.min(24, framing.fieldJoistsCount) }).map((_, i) => {
                const count = Math.min(24, framing.fieldJoistsCount);
                const x = count === 1 ? planWidth / 2 : (i * planWidth) / (count - 1);
                return (
                  <line
                    key={`plan-joist-${i}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2={planHeight}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray={i === 0 || i === count - 1 ? "none" : "3 3"}
                  />
                );
              })}

              {/* Beam Line in Plan */}
              <line
                x1="0"
                y1={planHeight * beamFraction}
                x2={planWidth}
                y2={planHeight * beamFraction}
                stroke="#f59e0b"
                strokeWidth="4"
              />
              <text
                x={planWidth / 2}
                y={planHeight * beamFraction - 6}
                fill="#fbbf24"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {framing.beamLumber} Beam ({framing.beamLengthFt}′)
              </text>

              {/* Support Piers in Plan */}
              {Array.from({ length: postCount }).map((_, idx) => {
                const x = postCount === 1 ? planWidth / 2 : (idx * planWidth) / (postCount - 1);
                return (
                  <g key={`plan-pier-${idx}`}>
                    <circle
                      cx={x}
                      cy={planHeight * beamFraction}
                      r="9"
                      fill="#0891b2"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x}
                      y={planHeight * beamFraction + 18}
                      fill="#06b6d4"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Pier #{idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Plan Dimension Callouts */}
              <text
                x={planWidth / 2}
                y={planHeight + 25}
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {lengthFt}′ Length ({framing.fieldJoistsCount} Joists @ {framing.joistSpacingInches}″ OC)
              </text>
              <text
                x={planWidth + 12}
                y={planHeight / 2}
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="start"
              >
                {widthFt}′ Projection
              </text>
            </g>
          )}
        </svg>

        {/* Live IRC Prescriptive Limit Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono">
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 backdrop-blur">
            Max Joist Span: {framing.maxAllowableJoistSpanFt}′ ({framing.joistLumber} @ {framing.joistSpacingInches}″ OC)
          </span>
        </div>
      </div>

      {/* Quick Structural Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Deck Area</span>
            <span className="text-xs font-bold text-amber-400">
              {decking.deckSurfaceAreaSqFt} sq ft
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-cyan-400">16′</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Deck Boards</span>
            <span className="text-xs font-bold text-white">
              {decking.totalStockBoardsRequired} pcs ({decking.stockLengthFt}′)
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Field Joists</span>
            <span className="text-xs font-bold text-slate-200">
              {framing.fieldJoistsCount} pcs ({framing.joistLumber})
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <span className="font-bold text-xs text-cyan-400">#</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Footing Piers</span>
            <span className="text-xs font-bold text-cyan-300">
              {concrete.pierFootingCount} Piers ({concrete.concreteBags80Lb} bags)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
