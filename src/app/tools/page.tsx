"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TOOL_REGISTRY } from "@/data/references/tool-registry";
import {
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  Search,
  ArrowRight,
  Calculator,
} from "lucide-react";

const TOOL_IMAGES: Record<string, string> = {
  "concrete-calculator": "/images/trade/concrete-slab.jpg",
  "gravel-calculator": "/images/trade/gravel-pile.jpg",
  "framing-calculator": "/images/trade/framing-stud.jpg",
  "drywall-calculator": "/images/trade/cinder-block.jpg",
  "roof-pitch-calculator": "/images/trade/roof-truss.jpg",
  "stair-calculator": "/images/trade/stairs-wood.jpg",
  "deck-calculator": "/images/trade/deck-framing.jpg",
  "voltage-drop-calculator": "/images/trade/electrical-wires.jpg",
  "conduit-fill-calculator": "/images/trade/conduit-pipes.jpg",
  "box-fill-calculator": "/images/trade/electrical-box.jpg",
  "residential-load-calculator": "/images/trade/hero-modern-house.jpg",
  "btu-calculator": "/images/trade/hvac-unit.jpg",
  "duct-sizing-calculator": "/images/trade/conduit-pipes.jpg",
  "dfu-calculator": "/images/trade/pvc-pipes.jpg",
  "wsfu-calculator": "/images/trade/pvc-pipes.jpg",
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  construction: {
    label: "Construction & Framing",
    icon: HardHat,
    color: "bg-amber-100 text-amber-800",
  },
  electrical: {
    label: "Electrical & Conduit",
    icon: Zap,
    color: "bg-blue-100 text-blue-800",
  },
  plumbing: {
    label: "Plumbing & Piping",
    icon: Droplets,
    color: "bg-cyan-100 text-cyan-800",
  },
  hvac: {
    label: "HVAC & Airflow",
    icon: Wind,
    color: "bg-emerald-100 text-emerald-800",
  },
  materials: {
    label: "Materials & Takeoff",
    icon: Layers,
    color: "bg-amber-100 text-amber-800",
  },
};

export default function ToolsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const breadcrumbs = [{ name: "Tools Directory", url: "/tools" }];

  const categoryFilters = [
    { id: "all", label: "All Tools (15)" },
    { id: "construction", label: "Construction & Framing (5)" },
    { id: "electrical", label: "Electrical & Conduit (4)" },
    { id: "plumbing", label: "Plumbing & Piping (2)" },
    { id: "hvac", label: "HVAC & Airflow (2)" },
    { id: "materials", label: "Materials & Takeoff (2)" },
  ];

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOL_REGISTRY.filter((tool) => {
      if (tool.status !== "active") return false;
      const matchesCategory =
        selectedCategory === "all" || tool.categoryId === selectedCategory;
      const matchesQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        (tool.shortTitle && tool.shortTitle.toLowerCase().includes(q)) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.searchIntent && tool.searchIntent.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="py-8 pb-20 bg-slate-50 min-h-screen">
      <Container>
        <Breadcrumb items={breadcrumbs} />

        {/* Directory Header matching Showcase */}
        <div className="mt-6 mb-8 max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Trade Tools &amp; Calculators Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Instant material takeoffs, geometric layouts, and code-prescriptive reference calculations.
          </p>
        </div>

        {/* Search Bar Capsule with Gold Action Button */}
        <div className="mb-6 max-w-2xl">
          <div className="flex items-center justify-between bg-white rounded-full border border-slate-200 shadow-sm hover:border-slate-300 px-4 py-2.5 transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, calculations, or topics..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 mr-2"
              >
                Clear
              </button>
            )}
            <div className="h-9 w-9 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs cursor-pointer">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Filter Pills matching Showcase */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
          {categoryFilters.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3-Column Rich Visual Tool Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Calculator className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No matching calculators found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search query or clear the active category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const meta = CATEGORY_META[tool.categoryId] || {
                label: tool.categoryId,
                icon: Calculator,
                color: "bg-slate-100 text-slate-700",
              };
              const Icon = meta.icon;
              const imageSrc =
                TOOL_IMAGES[tool.slug] || "/images/trade/hero-modern-house.jpg";

              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div>
                    {/* Category Icon Badge & Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {meta.label}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug mb-1">
                      {tool.title}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {/* Realistic 3D Trade Render Asset */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                      <Image
                        src={imageSrc}
                        alt={`${tool.title} visual illustration`}
                        width={300}
                        height={200}
                        className="object-contain max-h-32 w-auto group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600 pt-4 mt-3 border-t border-slate-100 transition-colors">
                    <span>Open Calculator</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
