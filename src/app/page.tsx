"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOOL_CATEGORIES, TOOL_REGISTRY } from "@/data/references/tool-registry";
import {
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  ArrowRight,
  Search,
  CheckCircle2,
  Cpu,
  Ruler,
  PackageCheck,
  Truck,
  Plus,
  Minus,
} from "lucide-react";

export default function HomePage() {
  const [taskQuery, setTaskQuery] = useState("");

  // 1. Interactive Mini-Concrete Instrument State
  const [miniConcUnit, setMiniConcUnit] = useState<"imperial" | "metric">("imperial");
  const [miniConcLen, setMiniConcLen] = useState<number>(24);
  const [miniConcWid, setMiniConcWid] = useState<number>(14);
  const [miniConcDep, setMiniConcDep] = useState<number>(6);

  const miniConcreteTakeoff = useMemo(() => {
    if (miniConcUnit === "imperial") {
      const netCuFt = miniConcLen * miniConcWid * (miniConcDep / 12);
      const netCuYd = netCuFt / 27;
      const withWaste = netCuYd * 1.1; // 10% waste
      const truckOrder = Math.ceil(withWaste * 4) / 4; // Round up to nearest 0.25 yd
      const bags80 = Math.ceil(withWaste * 45);
      return {
        unit: "yd³",
        netVolume: netCuYd.toFixed(2),
        withWaste: withWaste.toFixed(2),
        truckOrder: truckOrder.toFixed(2),
        truckUnit: "yd³",
        bags80,
      };
    } else {
      // Metric: Length (m), Width (m), Depth (cm)
      const netM3 = miniConcLen * miniConcWid * (miniConcDep / 100);
      const withWaste = netM3 * 1.1;
      const truckOrder = Math.ceil(withWaste * 2) / 2; // Round up to nearest 0.5 m3
      const bags25kg = Math.ceil(withWaste * 88);
      return {
        unit: "m³",
        netVolume: netM3.toFixed(2),
        withWaste: withWaste.toFixed(2),
        truckOrder: truckOrder.toFixed(2),
        truckUnit: "m³",
        bags80: bags25kg,
      };
    }
  }, [miniConcLen, miniConcWid, miniConcDep, miniConcUnit]);

  // Mini-Concrete SVG geometry calculations
  const miniLenScale = Math.min(1.4, Math.max(0.6, miniConcLen / 16));
  const miniWidScale = Math.min(1.4, Math.max(0.6, miniConcWid / 16));
  const miniDepthDrop = Math.min(45, Math.max(14, Math.round(miniConcDep * 4.5)));
  const miniRightDx = Math.round(75 * miniLenScale);
  const miniRightDy = Math.round(24 * miniLenScale);
  const miniLeftDx = Math.round(75 * miniWidScale);
  const miniLeftDy = Math.round(24 * miniWidScale);
  const miniCenterX = 140;
  const miniTopY = 32;

  // 2. Interactive Mini-Framing Instrument State
  const [miniWallLen, setMiniWallLen] = useState<number>(24);
  const [miniStudSpacing, setMiniStudSpacing] = useState<number>(16);

  const miniFramingTakeoff = useMemo(() => {
    const totalInches = miniWallLen * 12;
    const intervals = Math.floor(totalInches / miniStudSpacing);
    const studCount = Math.ceil((intervals + 1 + 2) * 1.1); // + lead/end + corners + 10% waste
    const plateLf = miniWallLen * 3; // Double top + single bottom
    return { studCount, plateLf };
  }, [miniWallLen, miniStudSpacing]);

  // Mini-Framing stud lines
  const miniStudCount = Math.floor((miniWallLen * 12) / miniStudSpacing);

  // 3. Interactive Mini-Conduit Instrument State
  const [miniWireCount, setMiniWireCount] = useState<number>(9);
  const [miniWireGauge, setMiniWireGauge] = useState<string>("12");

  const miniConduitTakeoff = useMemo(() => {
    const areaMap: Record<string, number> = {
      "14": 0.0097,
      "12": 0.0133,
      "10": 0.0211,
      "8": 0.0437,
      "6": 0.0507,
    };
    const wireArea = areaMap[miniWireGauge] || 0.0133;
    const totalWireArea = miniWireCount * wireArea;
    let recSize = "1/2″";
    let fillPct = (totalWireArea / 0.304) * 100;

    if (totalWireArea > 0.122) {
      recSize = "3/4″";
      fillPct = (totalWireArea / 0.533) * 100;
    }
    if (totalWireArea > 0.213) {
      recSize = "1″";
      fillPct = (totalWireArea / 0.864) * 100;
    }
    return {
      recSize,
      fillPct: Math.min(100, Math.round(fillPct * 10) / 10),
      totalWireArea: totalWireArea.toFixed(3),
    };
  }, [miniWireCount, miniWireGauge]);

  const quickTasks = [
    { label: "Concrete Slab", href: "/construction/concrete-calculator" },
    { label: "Wall Framing", href: "/construction/framing-calculator" },
    { label: "Stair Stringers", href: "/construction/stair-calculator" },
    { label: "Conduit Fill", href: "/electrical/conduit-fill-calculator" },
    { label: "Wire Voltage Drop", href: "/electrical/voltage-drop-calculator" },
    { label: "Plumbing DFU", href: "/plumbing/dfu-calculator" },
    { label: "HVAC BTU Load", href: "/hvac/btu-calculator" },
  ];

  const categoryIcons: Record<string, React.ReactNode> = {
    construction: <HardHat className="h-5 w-5 text-amber-500" />,
    materials: <Layers className="h-5 w-5 text-amber-500" />,
    electrical: <Zap className="h-5 w-5 text-amber-500" />,
    hvac: <Wind className="h-5 w-5 text-amber-500" />,
    plumbing: <Droplets className="h-5 w-5 text-cyan-500" />,
  };

  const filteredTools = useMemo(() => {
    const q = taskQuery.trim().toLowerCase();
    if (!q) return [];
    return TOOL_REGISTRY.filter(
      (t) =>
        t.status === "active" &&
        (t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.searchIntent && t.searchIntent.toLowerCase().includes(q)) ||
          t.categoryId.toLowerCase().includes(q))
    );
  }, [taskQuery]);

  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      {/* Compact Workbench Hero (~280px total height) */}
      <section className="bg-slate-950 text-slate-100 py-6 sm:py-8 border-b border-slate-800">
        <Container className="max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-3.5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <span>Digital Trade Calculation Workbench</span>
            </div>

            {/* Direct Task Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Tell us what you&apos;re building.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Adjust dimensions to see live geometric blueprints, published code references, and material order takeoffs.
            </p>

            {/* Single Dominant Task Search Input */}
            <div className="pt-1 max-w-xl mx-auto relative">
              <div className="relative flex items-center bg-slate-900 rounded-xl border-2 border-slate-700 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 shadow-xl transition-all">
                <Search className="h-4 w-4 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={taskQuery}
                  onChange={(e) => setTaskQuery(e.target.value)}
                  placeholder="What are you calculating? (e.g. 24x24 concrete slab, wall studs, wire size)..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none font-medium"
                />
                {taskQuery && (
                  <button
                    type="button"
                    onClick={() => setTaskQuery("")}
                    className="mr-3 text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Instant Search Dropdown */}
              {filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 text-left overflow-hidden z-40 divide-y divide-slate-100 animate-in fade-in duration-100">
                  <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                    {filteredTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.path}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                            {tool.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">
                            {tool.searchIntent ?? tool.description}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Task Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
              <span className="text-xs text-slate-400 font-semibold mr-1">Quick Tasks:</span>
              {quickTasks.map((task) => (
                <Link
                  key={task.href}
                  href={task.href}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-800 text-xs font-medium transition-all"
                >
                  <span>{task.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3 LIVE INTERACTIVE MINIATURE INSTRUMENTS (ABOVE THE FOLD DEMONSTRATION) */}
      <section>
        <Container className="max-w-7xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-slate-200 pb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Live Product Demonstrations
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Interactive Estimating Instruments (Try Changing Inputs Below)
                </h2>
              </div>
              <Link
                href="/tools"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Tools Directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* LIVE MINI-INSTRUMENT 1: CONCRETE */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-950 p-4 text-white shadow-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" className="text-[10px]">
                      Concrete Slab Takeoff
                    </Badge>
                    <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setMiniConcUnit("imperial")}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          miniConcUnit === "imperial"
                            ? "bg-amber-500 text-slate-950 font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        IMP
                      </button>
                      <button
                        type="button"
                        onClick={() => setMiniConcUnit("metric")}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          miniConcUnit === "metric"
                            ? "bg-amber-500 text-slate-950 font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        MET
                      </button>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {miniConcLen}{miniConcUnit === "imperial" ? "′" : "m"} × {miniConcWid}{miniConcUnit === "imperial" ? "′" : "m"} × {miniConcDep}{miniConcUnit === "imperial" ? "″" : "cm"}
                  </span>
                </div>

                {/* Interactive Numeric Dials */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Length ({miniConcUnit === "imperial" ? "ft" : "m"})
                    </label>
                    <div className="flex items-center mt-1 bg-slate-900 rounded border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMiniConcLen(Math.max(miniConcUnit === "imperial" ? 6 : 2, miniConcLen - (miniConcUnit === "imperial" ? 2 : 1)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-full text-center font-mono font-bold text-white text-xs">
                        {miniConcLen}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMiniConcLen(Math.min(miniConcUnit === "imperial" ? 40 : 15, miniConcLen + (miniConcUnit === "imperial" ? 2 : 1)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Width ({miniConcUnit === "imperial" ? "ft" : "m"})
                    </label>
                    <div className="flex items-center mt-1 bg-slate-900 rounded border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMiniConcWid(Math.max(miniConcUnit === "imperial" ? 6 : 2, miniConcWid - (miniConcUnit === "imperial" ? 2 : 1)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-full text-center font-mono font-bold text-white text-xs">
                        {miniConcWid}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMiniConcWid(Math.min(miniConcUnit === "imperial" ? 30 : 10, miniConcWid + (miniConcUnit === "imperial" ? 2 : 1)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Depth ({miniConcUnit === "imperial" ? "in" : "cm"})
                    </label>
                    <div className="flex items-center mt-1 bg-slate-900 rounded border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMiniConcDep(Math.max(miniConcUnit === "imperial" ? 3 : 8, miniConcDep - (miniConcUnit === "imperial" ? 1 : 2)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-full text-center font-mono font-bold text-white text-xs">
                        {miniConcDep}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMiniConcDep(Math.min(miniConcUnit === "imperial" ? 12 : 30, miniConcDep + (miniConcUnit === "imperial" ? 1 : 2)))}
                        className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer active:scale-95"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Morphing SVG Isometric Slab */}
                <div className="bg-slate-900/90 rounded-xl p-2 h-28 flex items-center justify-center border border-slate-800 overflow-hidden">
                  <svg viewBox="0 0 280 110" className="w-full h-full select-none">
                    {/* Top Face */}
                    <polygon
                      points={`${miniCenterX},${miniTopY} ${miniCenterX + miniRightDx},${miniTopY + miniRightDy} ${miniCenterX + miniRightDx - miniLeftDx},${miniTopY + miniRightDy + miniLeftDy} ${miniCenterX - miniLeftDx},${miniTopY + miniLeftDy}`}
                      fill="#475569"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    {/* Left Drop Face */}
                    <polygon
                      points={`${miniCenterX - miniLeftDx},${miniTopY + miniLeftDy} ${miniCenterX + miniRightDx - miniLeftDx},${miniTopY + miniRightDy + miniLeftDy} ${miniCenterX + miniRightDx - miniLeftDx},${miniTopY + miniRightDy + miniLeftDy + miniDepthDrop} ${miniCenterX - miniLeftDx},${miniTopY + miniLeftDy + miniDepthDrop}`}
                      fill="#1e293b"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    {/* Right Drop Face */}
                    <polygon
                      points={`${miniCenterX + miniRightDx - miniLeftDx},${miniTopY + miniRightDy + miniLeftDy} ${miniCenterX + miniRightDx},${miniTopY + miniRightDy} ${miniCenterX + miniRightDx},${miniTopY + miniRightDy + miniDepthDrop} ${miniCenterX + miniRightDx - miniLeftDx},${miniTopY + miniRightDy + miniLeftDy + miniDepthDrop}`}
                      fill="#334155"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    {/* Dimension Text */}
                    <text x="140" y="104" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {miniConcLen}{miniConcUnit === "imperial" ? "′" : "m"} × {miniConcWid}{miniConcUnit === "imperial" ? "′" : "m"} × {miniConcDep}{miniConcUnit === "imperial" ? "″" : "cm"} Slab
                    </text>
                  </svg>
                </div>

                {/* Live Takeoff Result Readout */}
                <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Volume</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {miniConcreteTakeoff.withWaste} {miniConcreteTakeoff.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Ready-Mix Truck</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Truck className="h-3 w-3" /> {miniConcreteTakeoff.truckOrder} {miniConcreteTakeoff.truckUnit}
                    </span>
                  </div>
                </div>

                <Link
                  href="/construction/concrete-calculator"
                  className="w-full text-center text-xs font-bold text-amber-400 hover:text-amber-300 py-1 flex items-center justify-center gap-1 border-t border-slate-800 group"
                >
                  <span>Open Full Concrete Workspace</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* LIVE MINI-INSTRUMENT 2: WALL FRAMING */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-950 p-4 text-white shadow-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <Badge variant="brand" className="text-[10px]">
                    Wall Stud Takeoff
                  </Badge>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {miniWallLen} ft @ {miniStudSpacing}″ OC
                  </span>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Wall Length (ft)</label>
                    <div className="flex items-center mt-1 bg-slate-900 rounded border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMiniWallLen(Math.max(10, miniWallLen - 4))}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-full text-center font-mono font-bold text-white text-xs">
                        {miniWallLen}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMiniWallLen(Math.min(48, miniWallLen + 4))}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Stud Spacing</label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setMiniStudSpacing(16)}
                        className={`py-1 rounded text-xs font-bold border transition-colors ${
                          miniStudSpacing === 16
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-900 text-slate-300 border-slate-700"
                        }`}
                      >
                        16″ OC
                      </button>
                      <button
                        type="button"
                        onClick={() => setMiniStudSpacing(24)}
                        className={`py-1 rounded text-xs font-bold border transition-colors ${
                          miniStudSpacing === 24
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-900 text-slate-300 border-slate-700"
                        }`}
                      >
                        24″ OC
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Dynamic Wall Elevation SVG */}
                <div className="bg-slate-900/90 rounded-xl p-2 h-28 flex items-center justify-center border border-slate-800 overflow-hidden">
                  <svg viewBox="0 0 280 80" className="w-full h-full select-none">
                    {/* Top and Bottom Plates */}
                    <rect x="20" y="10" width="240" height="4" fill="#f59e0b" />
                    <rect x="20" y="14" width="240" height="4" fill="#d97706" />
                    <rect x="20" y="66" width="240" height="6" fill="#f59e0b" />

                    {/* Dynamic Studs */}
                    {Array.from({ length: miniStudCount + 1 }).map((_, i) => {
                      const x = 20 + (i / miniStudCount) * 236;
                      return <rect key={i} x={x} y="18" width="4" height="48" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />;
                    })}

                    <text x="140" y="78" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {miniWallLen} ft Wall Elevation ({miniStudSpacing}″ Spacing)
                    </text>
                  </svg>
                </div>

                {/* Live Takeoff Result Readout */}
                <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Studs</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {miniFramingTakeoff.studCount} pcs
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Plate Lumber</span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {miniFramingTakeoff.plateLf} LF (2x4)
                    </span>
                  </div>
                </div>

                <Link
                  href="/construction/framing-calculator"
                  className="w-full text-center text-xs font-bold text-amber-400 hover:text-amber-300 py-1 flex items-center justify-center gap-1 border-t border-slate-800"
                >
                  <span>Open Full Framing Workspace</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* LIVE MINI-INSTRUMENT 3: CONDUIT FILL */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-950 p-4 text-white shadow-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <Badge variant="brand" className="text-[10px]">
                    Conduit Trade Sizing
                  </Badge>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {miniWireCount}× #{miniWireGauge} AWG
                  </span>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Wire Count</label>
                    <div className="flex items-center mt-1 bg-slate-900 rounded border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMiniWireCount(Math.max(2, miniWireCount - 1))}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-full text-center font-mono font-bold text-white text-xs">
                        {miniWireCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMiniWireCount(Math.min(16, miniWireCount + 1))}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Wire Gauge (AWG)</label>
                    <select
                      value={miniWireGauge}
                      onChange={(e) => setMiniWireGauge(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded p-1 text-xs font-bold"
                    >
                      <option value="14">14 AWG</option>
                      <option value="12">12 AWG</option>
                      <option value="10">10 AWG</option>
                      <option value="8">8 AWG</option>
                      <option value="6">6 AWG</option>
                    </select>
                  </div>
                </div>

                {/* Live Conduit Cross-Section SVG */}
                <div className="bg-slate-900/90 rounded-xl p-2 h-28 flex items-center justify-center border border-slate-800 overflow-hidden">
                  <svg viewBox="0 0 280 80" className="w-full h-full select-none">
                    {/* Conduit Ring */}
                    <circle cx="140" cy="40" r="32" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                    {/* 40% limit dotted circle */}
                    <circle cx="140" cy="40" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />

                    {/* Packed Wire Circles */}
                    {Array.from({ length: miniWireCount }).map((_, i) => {
                      const angle = (i * 2 * Math.PI) / miniWireCount;
                      const r = i === 0 ? 0 : 12;
                      const cx = 140 + r * Math.cos(angle);
                      const cy = 40 + r * Math.sin(angle);
                      const wireR = miniWireGauge === "14" ? 3.5 : miniWireGauge === "12" ? 4.5 : 5.5;
                      return <circle key={i} cx={cx} cy={cy} r={wireR} fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />;
                    })}

                    <text x="140" y="78" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {miniConduitTakeoff.recSize} EMT Conduit ({miniConduitTakeoff.fillPct}% Fill)
                    </text>
                  </svg>
                </div>

                {/* Live Takeoff Result Readout */}
                <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Recommended Size</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {miniConduitTakeoff.recSize} EMT
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Fill Percentage</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {miniConduitTakeoff.fillPct}% (Limit 40%)
                    </span>
                  </div>
                </div>

                <Link
                  href="/electrical/conduit-fill-calculator"
                  className="w-full text-center text-xs font-bold text-amber-400 hover:text-amber-300 py-1 flex items-center justify-center gap-1 border-t border-slate-800"
                >
                  <span>Open Full Conduit Workspace</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5 Trade Suite Hubs Matrix */}
      <section>
        <Container className="max-w-7xl">
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Disciplines
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Five Specialized Trade Suites
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOL_CATEGORIES.filter((c) => c.status === "active").map((category) => {
                const activeTools = TOOL_REGISTRY.filter(
                  (t) => t.categoryId === category.id && t.status === "active"
                );

                return (
                  <Card
                    key={category.id}
                    className="flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all rounded-2xl"
                  >
                    <CardHeader className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                          {categoryIcons[category.slug] ?? <HardHat className="h-5 w-5 text-amber-500" />}
                        </div>
                        <Badge variant={category.status === "active" ? "brand" : "outline"} className="text-[10px]">
                          {activeTools.length} {activeTools.length === 1 ? "Calculator" : "Calculators"}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          {category.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 p-4 space-y-2.5">
                      <div className="space-y-1 border-t border-slate-100 pt-2">
                        {activeTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={tool.path}
                            className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-amber-700 py-0.5 px-1.5 rounded hover:bg-slate-50 transition-colors"
                          >
                            <span className="truncate">{tool.title}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Live Schematic
                        </span>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="font-bold text-amber-700 hover:underline text-xs"
                        >
                          Suite Hub →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust & Engineering Rigor Pillars */}
      <section>
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Deterministic Mathematical Rigor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero heuristic drift. Every calculation uses exact physical formulas with verified unit conversions.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                <Ruler className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Published Code Reference Schedules</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calibrated against standard published trade reference schedules: NEC 2023 Tables, IPC/UPC 2024, and IRC 2024.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                <PackageCheck className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">100% Free &amp; Transparent Takeoffs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No paywalls, no email gates, no subscriptions. Transparent step-by-step math breakdowns and print-ready worksheets.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
