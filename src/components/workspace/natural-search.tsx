"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { TOOL_REGISTRY } from "@/data/references/tool-registry";

export interface NaturalTaskPreset {
  query: string;
  targetPath: string;
  tag: string;
  category: "concrete" | "framing" | "electrical" | "hvac" | "plumbing" | "materials" | "stairs";
}

const NATURAL_TASK_PRESETS: NaturalTaskPreset[] = [
  {
    query: "How much concrete for a slab or patio?",
    targetPath: "/construction/concrete-calculator",
    tag: "Slabs & Footings",
    category: "concrete",
  },
  {
    query: "How many wall studs and plates do I need?",
    targetPath: "/construction/framing-calculator",
    tag: "16″/24″ Studs",
    category: "framing",
  },
  {
    query: "What size wire do I need for voltage drop?",
    targetPath: "/electrical/voltage-drop-calculator",
    tag: "NEC 3% Rule",
    category: "electrical",
  },
  {
    query: "How many risers and treads for stairs?",
    targetPath: "/construction/stair-calculator",
    tag: "IRC R311.7",
    category: "stairs",
  },
  {
    query: "What size conduit for my wire bundle?",
    targetPath: "/electrical/conduit-fill-calculator",
    tag: "40% Fill",
    category: "electrical",
  },
  {
    query: "What size drain pipe for bathroom fixtures?",
    targetPath: "/plumbing/dfu-calculator",
    tag: "IPC/UPC Ch. 7",
    category: "plumbing",
  },
  {
    query: "How many tons of AC or BTUs for this room?",
    targetPath: "/hvac/btu-calculator",
    tag: "Manual J",
    category: "hvac",
  },
  {
    query: "How many drywall sheets and buckets of mud?",
    targetPath: "/materials/drywall-calculator",
    tag: "Sheets & Mud",
    category: "materials",
  },
  {
    query: "How many tons of gravel for a driveway?",
    targetPath: "/materials/gravel-calculator",
    tag: "Tonnage",
    category: "materials",
  },
];

export function NaturalTaskSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Smart natural matching
  const matchingTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Check direct matching against active tools
    return TOOL_REGISTRY.filter((tool) => {
      if (tool.status !== "active") return false;
      const t = tool.title.toLowerCase();
      const d = tool.description.toLowerCase();
      const s = tool.searchIntent ? tool.searchIntent.toLowerCase() : "";
      const cat = tool.categoryId.toLowerCase();
      return t.includes(q) || d.includes(q) || s.includes(q) || cat.includes(q);
    });
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingTools.length > 0) {
      router.push(matchingTools[0].path);
    } else {
      router.push(`/tools?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-slate-900/95 rounded-2xl border-2 border-slate-700 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 shadow-2xl transition-all">
          <Search className="h-5 w-5 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your job (e.g. concrete slab, 24ft wall studs, wire size, stair stringer)..."
            className="w-full bg-transparent px-4 py-4 text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-3 text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          ) : (
            <button
              type="submit"
              className="mr-2.5 inline-flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Calculate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Live Matching Dropdown */}
        {matchingTools.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-left overflow-hidden z-40 divide-y divide-slate-100 animate-in fade-in duration-100">
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching Estimating Workspaces ({matchingTools.length})
              </div>
              {matchingTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 group transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-amber-900">
                      {tool.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-md">
                      {tool.searchIntent || tool.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Popular Task Shortcuts */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Quick-Launch Common Jobsite Tasks:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {NATURAL_TASK_PRESETS.map((preset, idx) => (
            <Link
              key={idx}
              href={preset.targetPath}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-800 text-xs transition-all shadow-2xs group"
            >
              <span className="font-medium">{preset.query}</span>
              <span className="text-[10px] font-mono text-amber-500/80 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {preset.tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
