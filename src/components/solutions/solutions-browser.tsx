"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Search, X, ArrowRight, BookOpen, Filter } from "lucide-react";

export interface NecProblemItem {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  calculatorType: string;
  necReference: string;
  inputs: Record<string, unknown>;
  formula: string;
  steps: string[];
  answer: string;
}

export interface ProblemCategory {
  title: string;
  description: string;
  slugs: string[];
}

interface SolutionsBrowserProps {
  problems: NecProblemItem[];
  categories: ProblemCategory[];
}

const QUICK_FILTERS = ["All", "Voltage Drop", "Conduit Fill", "Motors", "Service / Feeders", "Box Fill", "Solar"];

export function SolutionsBrowser({ problems, categories }: SolutionsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const problemMap = useMemo(() => new Map(problems.map((p) => [p.slug, p])), [problems]);

  const filteredProblems = useMemo(() => {
    let result = problems;

    if (activeFilter !== "All") {
      const lowerFilter = activeFilter.toLowerCase();
      result = result.filter((p) => {
        if (lowerFilter === "voltage drop") return p.calculatorType === "voltage-drop-calculator";
        if (lowerFilter === "conduit fill") return p.slug.includes("conduit-fill");
        if (lowerFilter === "motors") return p.calculatorType === "motor-calculator";
        if (lowerFilter === "service / feeders") {
          return (
            p.slug.includes("feeder") ||
            p.slug.includes("service") ||
            p.slug.includes("grounding")
          );
        }
        if (lowerFilter === "box fill") return p.slug.includes("box-fill");
        if (lowerFilter === "solar") return p.slug.includes("solar");
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.metaDescription.toLowerCase().includes(q) ||
          p.necReference.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.answer.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [problems, activeFilter, searchQuery]);

  const isFiltering = searchQuery.trim().length > 0 || activeFilter !== "All";

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter scenarios by keyword (e.g., motor, 200A, voltage, conduit, dryer)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 font-mono">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing <strong className="text-slate-900">{filteredProblems.length}</strong> of{" "}
              {problems.length}
            </span>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 font-mono">
            Tags:
          </span>
          {QUICK_FILTERS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tag
                  ? "bg-amber-500 text-slate-950 shadow-2xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {tag}
            </button>
          ))}
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Render Mode: Flat List when Filtering, Grouped by Category when Not Filtering */}
      {isFiltering ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              Matching Calculation Scenarios ({filteredProblems.length})
            </h2>
            {searchQuery && (
              <span className="text-xs text-slate-500">
                Searching for &quot;<span className="font-semibold text-slate-800">{searchQuery}</span>&quot;
              </span>
            )}
          </div>

          {filteredProblems.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching calculation scenarios found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try searching for broader keywords like <strong>&quot;motor&quot;</strong>,{" "}
                <strong>&quot;200A&quot;</strong>, <strong>&quot;voltage&quot;</strong>,{" "}
                <strong>&quot;conduit&quot;</strong>, or <strong>&quot;range&quot;</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                className="mt-2 inline-flex items-center px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.slug} problem={problem} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat, catIdx) => {
            const categoryProblems = cat.slugs
              .map((slug) => problemMap.get(slug))
              .filter((p): p is NecProblemItem => Boolean(p));

            return (
              <section key={catIdx} className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {cat.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryProblems.map((problem) => (
                    <ProblemCard key={problem.slug} problem={problem} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProblemCard({ problem }: { problem: NecProblemItem }) {
  return (
    <Link
      href={`/solutions/${problem.slug}`}
      className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand" className="text-[11px] truncate max-w-[200px]">
            {problem.necReference}
          </Badge>
          <span className="text-[11px] font-mono font-semibold text-slate-500">
            {problem.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
          {problem.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2">
          {problem.metaDescription}
        </p>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
            Direct Answer:
          </span>
          <span className="font-bold text-slate-900 line-clamp-1">{problem.answer}</span>
        </div>
      </div>

      <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
        View Worked Derivation <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </div>
    </Link>
  );
}
