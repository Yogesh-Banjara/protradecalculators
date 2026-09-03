"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOL_REGISTRY, TOOL_CATEGORIES } from "@/data/references/tool-registry";
import {
  Search,
  X,
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  ArrowRight,
  Calculator,
} from "lucide-react";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  construction: <HardHat className="h-4 w-4 text-amber-500" />,
  materials: <Layers className="h-4 w-4 text-amber-500" />,
  electrical: <Zap className="h-4 w-4 text-amber-500" />,
  hvac: <Wind className="h-4 w-4 text-amber-500" />,
  plumbing: <Droplets className="h-4 w-4 text-cyan-500" />,
};

interface SearchableItem {
  title: string;
  path: string;
  description: string;
  type: "calculator" | "guide" | "category";
  categoryName?: string;
  categoryId?: string;
  keywords?: string[];
}

const STATIC_GUIDES: SearchableItem[] = [
  {
    title: "Subpanel Feeder Conductor Sizing by Distance",
    path: "/guides/subpanel-feeder-sizing",
    description: "Sizing feeder wire gauges across 50–300+ ft runs with continuous load, breaker ratings, and 3% voltage drop limits.",
    type: "guide",
    categoryName: "Electrical Guide",
    categoryId: "electrical",
    keywords: ["subpanel", "feeder", "wire size", "voltage drop", "100 amp", "200 amp", "aluminum", "copper"],
  },
];

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Unified searchable items (Calculators + Guides)
  const searchableItems: SearchableItem[] = React.useMemo(() => {
    const calcItems: SearchableItem[] = TOOL_REGISTRY.filter((t) => t.status === "active").map((t) => {
      const cat = TOOL_CATEGORIES.find((c) => c.id === t.categoryId);
      return {
        title: t.title,
        path: t.path,
        description: t.searchIntent ?? t.description,
        type: "calculator",
        categoryName: cat?.name || t.categoryId,
        categoryId: t.categoryId,
        keywords: [t.shortTitle || "", t.categoryId],
      };
    });
    return [...calcItems, ...STATIC_GUIDES];
  }, []);

  // Filter tools based on query
  const filteredTools = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return searchableItems;
    }
    return searchableItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.categoryName?.toLowerCase().includes(q) || false;
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q)) || false;
      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [query, searchableItems]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTools.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
        e.preventDefault();
        router.push(filteredTools[selectedIndex].path);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick Search Calculators"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools, calculations, and guides..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Results ({filteredTools.length})</span>
                <span className="hidden sm:inline text-[10px] normal-case text-slate-400 font-normal">Use ↑↓ arrows to navigate, Enter to select</span>
              </div>
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const category = TOOL_CATEGORIES.find((c) => c.id === tool.categoryId);

                return (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      isSelected
                        ? "bg-amber-50 border border-amber-300/80 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 shadow-sm"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {(tool.categoryId && CATEGORY_ICONS[tool.categoryId]) || (
                          <Calculator className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {tool.title}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize shrink-0">
                            {category?.name || tool.categoryName || "Tool"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-md">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-amber-600 translate-x-0.5"
                          : "text-slate-300 opacity-0 sm:opacity-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Calculator className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                No calculators found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-400">
                Try searching for &ldquo;concrete&rdquo;, &ldquo;wire&rdquo;, &ldquo;stairs&rdquo;, &ldquo;plumbing&rdquo;, or &ldquo;duct&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-2xs font-bold">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-2xs font-bold">↑</kbd>
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-2xs font-bold">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 shadow-2xs font-bold">ESC</kbd> Close
            </span>
          </div>
          <Link
            href="/tools"
            onClick={onClose}
            className="text-amber-700 font-bold hover:underline"
          >
            Tools Directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
