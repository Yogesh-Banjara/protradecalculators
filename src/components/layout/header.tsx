"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "../ui/container";
import { QuickSearchModal } from "./quick-search-modal";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Search,
  Menu,
  X,
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close Category Menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-shadow">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl p-1 shrink-0 active:scale-[0.98] transition-transform"
            >
              <BrandLogo variant="brand" size="md" showSubtitle={true} />
            </Link>

            {/* Center Global Search Trigger */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 bg-slate-100/80 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all shadow-2xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  <span className="font-normal text-slate-500 group-hover:text-slate-700">
                    Search tools, calculations, and guides...
                  </span>
                </div>
                <kbd className="inline-flex items-center gap-0.5 text-[11px] font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-1"
            >
              {/* Category Dropdown */}
              <div
                ref={categoryMenuRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  aria-expanded={isCategoryMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-[0.98] ${
                    isCategoryMenuOpen
                      ? "bg-slate-100 text-slate-950 font-bold"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <span>Trade Suites</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-150 ${
                      isCategoryMenuOpen ? "rotate-180 text-amber-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Select Specialized Suite
                      </div>
                      <Link
                        href="/categories/construction"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <HardHat className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-950">Construction &amp; Framing</div>
                            <div className="text-[10px] text-slate-400 font-normal">Concrete, Framing, Stairs, Roof, Deck</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          5
                        </span>
                      </Link>

                      <Link
                        href="/categories/electrical"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Zap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-950">Electrical &amp; Conduit</div>
                            <div className="text-[10px] text-slate-400 font-normal">Voltage Drop, Conduit, Box Fill</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          4
                        </span>
                      </Link>

                      <Link
                        href="/categories/plumbing"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                            <Droplets className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-cyan-950">Plumbing &amp; Piping</div>
                            <div className="text-[10px] text-slate-400 font-normal">DFU Drainage, WSFU Potable Supply</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-100/60 px-1.5 py-0.5 rounded">
                          2
                        </span>
                      </Link>

                      <Link
                        href="/categories/hvac"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Wind className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-950">HVAC &amp; Airflow</div>
                            <div className="text-[10px] text-slate-400 font-normal">BTU Loads, Duct Sizing &amp; CFM</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          2
                        </span>
                      </Link>

                      <Link
                        href="/categories/materials"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-950">Materials &amp; Earthwork</div>
                            <div className="text-[10px] text-slate-400 font-normal">Drywall Takeoff, Aggregate Tonnage</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          2
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-[0.98]"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Mobile Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-slate-500 bg-slate-100 rounded-xl border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <span>Search tools, calculations, and guides...</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                ⌘K
              </span>
            </button>

            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Trade Suites
              </div>
              <Link
                href="/categories/construction"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <HardHat className="h-4 w-4 text-amber-500" />
                <span>Construction &amp; Framing (5 tools)</span>
              </Link>
              <Link
                href="/categories/electrical"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Electrical &amp; Conduit (4 tools)</span>
              </Link>
              <Link
                href="/categories/plumbing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Droplets className="h-4 w-4 text-cyan-500" />
                <span>Plumbing &amp; Piping (2 tools)</span>
              </Link>
              <Link
                href="/categories/hvac"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Wind className="h-4 w-4 text-amber-500" />
                <span>HVAC &amp; Airflow (2 tools)</span>
              </Link>
              <Link
                href="/categories/materials"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Layers className="h-4 w-4 text-amber-500" />
                <span>Materials &amp; Aggregate (2 tools)</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <Link
                href="/tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-900 bg-amber-50 hover:bg-amber-100"
              >
                Tools Directory (15 Calculators) →
              </Link>
              <Link
                href="/solutions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-100"
              >
                <BookOpen className="h-4 w-4 text-amber-700" />
                <span>NEC Solutions (20 Worked Problems)</span>
              </Link>
              <Link
                href="/guides/subpanel-feeder-sizing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Technical Guides
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                About &amp; Methodology
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Contact &amp; Feedback
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
