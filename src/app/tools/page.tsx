"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/breadcrumb";
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
  SlidersHorizontal,
} from "lucide-react";

export default function ToolsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("" );

  const breadcrumbs = [{ name: "Tools Directory", url: "/tools" }];

  const categoryIcons: Record<string, React.ReactNode> = {
    construction: <HardHat className="h-5 w-5 text-amber-500" />,
    materials: <Layers className="h-5 w-5 text-amber-500" />,
    electrical: <Zap className="h-5 w-5 text-amber-500" />,
    hvac: <Wind className="h-5 w-5 text-amber-500" />,
    plumbing: <Droplets className="h-5 w-5 text-cyan-500" />,
  };

  const categories = [
    { id: "all", name: "All Tools (15)" },
    { id: "construction", name: "Construction & Framing" },
    { id: "electrical", name: "Electrical & Conduit" },
    { id: "plumbing", name: "Plumbing & Piping" },
    { id: "hvac", name: "HVAC & Airflow" },
    { id: "materials", name: "Materials & Aggregate" },
  ];

  // Filter tools
  const activeTools = React.useMemo(() => {
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
    <div className="py-10 pb-20 space-y-8">
      <Container>
        <Breadcrumb items={breadcrumbs} />

        {/* Directory Hero */}
        <div className="my-8 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <span>15 Active Deterministic Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Trade Tools &amp; Calculators Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Instant material takeoffs, geometric layouts, and code-prescriptive reference calculations for construction, electrical, mechanical, and plumbing trades.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword (e.g., concrete, wire, stair stringer, WSFU, DFU, duct, drywall)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>Showing {activeTools.length} {activeTools.length === 1 ? "tool" : "tools"}</span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-amber-700 hover:underline cursor-pointer"
            >
              Reset to All Tools
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {activeTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTools.map((tool) => {
              const category = TOOL_CATEGORIES.find((c) => c.id === tool.categoryId);

              return (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl active:scale-[0.99] transition-transform"
                >
                  <Card interactive={true} className="h-full flex flex-col justify-between">
                    <CardHeader className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-amber-50 border border-slate-200 transition-colors">
                          {categoryIcons[tool.categoryId] || <HardHat className="h-5 w-5 text-amber-500" />}
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                          {category?.name ?? tool.categoryId}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Interactive Diagram
                        </span>
                        <span className="font-bold text-amber-700 group-hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Open Tool <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Search className="h-8 w-8 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              No calculators found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching for common terms like &ldquo;concrete&rdquo;, &ldquo;framing&rdquo;, &ldquo;pipe&rdquo;, &ldquo;voltage&rdquo;, or reset the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center text-xs font-bold text-amber-700 hover:underline pt-2"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
