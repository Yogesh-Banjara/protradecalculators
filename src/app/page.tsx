"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { QuickSearchModal } from "@/components/layout/quick-search-modal";
import {
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  ArrowRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  Calculator,
} from "lucide-react";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  const popularQueries = [
    { label: "Concrete", href: "/construction/concrete-calculator" },
    { label: "Wire Size", href: "/electrical/voltage-drop-calculator" },
    { label: "Conduit Fill", href: "/electrical/conduit-fill-calculator" },
    { label: "Roof Pitch", href: "/construction/roof-pitch-calculator" },
    { label: "DFU", href: "/plumbing/dfu-calculator" },
    { label: "Voltage Drop", href: "/electrical/voltage-drop-calculator" },
  ];

  const trustPillars = [
    {
      title: "NEC & Industry Standards",
      desc: "Code-based calculations",
      icon: ShieldCheck,
    },
    {
      title: "Accurate & Transparent",
      desc: "Formulas & references",
      icon: Calculator,
    },
    {
      title: "Built for Professionals",
      desc: "Contractors, builders, electricians",
      icon: HardHat,
    },
    {
      title: "Free & Easy to Use",
      desc: "No sign up required",
      icon: CheckCircle2,
    },
  ];

  const tradeSuites = [
    {
      title: "Construction & Framing",
      desc: "Concrete, roofing, stairs, deck, wall framing and more.",
      count: "5 Calculators",
      href: "/categories/construction",
      img: "/images/trade/framing-stud.jpg",
      icon: HardHat,
      badgeBg: "bg-amber-100 text-amber-800",
    },
    {
      title: "Electrical & Conduit",
      desc: "Wire size, voltage drop, conduit fill, box fill, load calculations.",
      count: "5 Calculators",
      href: "/categories/electrical",
      img: "/images/trade/electrical-wires.jpg",
      icon: Zap,
      badgeBg: "bg-blue-100 text-blue-800",
    },
    {
      title: "Plumbing & Piping",
      desc: "DFU, WSFU, pipe sizing, water supply and drainage.",
      count: "3 Calculators",
      href: "/categories/plumbing",
      img: "/images/trade/pvc-pipes.jpg",
      icon: Droplets,
      badgeBg: "bg-cyan-100 text-cyan-800",
    },
    {
      title: "HVAC & Airflow",
      desc: "BTU, CFM, duct sizing, heating and cooling.",
      count: "3 Calculators",
      href: "/categories/hvac",
      img: "/images/trade/hvac-unit.jpg",
      icon: Wind,
      badgeBg: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Materials & Takeoff",
      desc: "Gravel, aggregate, drywall, material quantities.",
      count: "1 Calculator",
      href: "/categories/materials",
      img: "/images/trade/cinder-block.jpg",
      icon: Layers,
      badgeBg: "bg-amber-100 text-amber-800",
    },
  ];

  const featuredTools = [
    {
      title: "Concrete Calculator",
      subtitle: "Volume, bags, material estimate",
      href: "/construction/concrete-calculator",
      img: "/images/trade/concrete-slab.jpg",
      category: "Construction",
      badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      title: "Roof Pitch & Rafter Calculator",
      subtitle: "Pitch, rafter length, overhang",
      href: "/construction/roof-pitch-calculator",
      img: "/images/trade/roof-truss.jpg",
      category: "Framing",
      badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      title: "Wire Size & Voltage Drop",
      subtitle: "Conductor size, 3% / 5% drop",
      href: "/electrical/voltage-drop-calculator",
      img: "/images/trade/electrical-wires.jpg",
      category: "Electrical",
      badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    },
    {
      title: "DFU Calculator",
      subtitle: "Drainage fixture units",
      href: "/plumbing/dfu-calculator",
      img: "/images/trade/pvc-pipes.jpg",
      category: "Plumbing",
      badgeClass: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    },
  ];

  const necSolutions = [
    {
      title: "Subpanel Feeder Sizing",
      code: "NEC 220.82, 310.16",
      desc: "Calculate feeder size for a 60A subpanel with 75 ft run.",
      href: "/solutions/voltage-drop-100ft-12awg-20a-120v",
      category: "Electrical Feeder",
    },
    {
      title: "Conduit Fill Example",
      code: "NEC 310.15(C)(1)(a)",
      desc: "How many #12 THHN wires fit in 3/4″ EMT conduit?",
      href: "/solutions/conduit-fill-100a-feeder-thhn",
      category: "Raceway Sizing",
    },
    {
      title: "Motor Full Load Current",
      code: "NEC 430.6",
      desc: "Calculate FLC and OCPD for a 5 HP, 3-phase motor.",
      href: "/solutions/3-phase-20hp-230v-hvac-service-demand",
      category: "Motor Branch",
    },
    {
      title: "Residential Load Calculation",
      code: "NEC 220.82",
      desc: "Complete dwelling unit load calculation example.",
      href: "/solutions/baseboard-heater-7000w-240v-service-load",
      category: "Service Demand",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 border-b border-slate-200/80 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>CALCULATE</span>
                <span className="text-amber-500">•</span>
                <span>PLAN</span>
                <span className="text-amber-500">•</span>
                <span>BUILD</span>
                <span className="text-amber-500">•</span>
                <span>WITH CONFIDENCE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-slate-900 leading-[1.12]">
                Professional Trade Calculators for{" "}
                <span className="text-amber-500">Real World Projects</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Accurate, easy to use calculators, NEC-based solutions and
                practical guides for construction, electrical, plumbing, HVAC
                and more.
              </p>

              {/* High-Precision Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl"
              >
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-between bg-white rounded-full border border-slate-200 shadow-md shadow-slate-200/50 hover:border-slate-300 px-4 py-2.5 sm:py-3 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Search className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search calculators, guides, or topics..."
                      className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none cursor-pointer"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Search"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Popular Query Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 font-semibold mr-1">Popular:</span>
                {popularQueries.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-full transition-colors active:scale-95"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Architectural House Visual with Floating Measurement Callouts */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/40 bg-slate-950">
                <Image
                  src="/images/trade/hero-modern-house.jpg"
                  alt="Modern architectural residential project with live trade engineering measurements"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-auto object-cover"
                />

                {/* Floating Callout 1: Roof Pitch (Top-Right) */}
                <Link
                  href="/construction/roof-pitch-calculator"
                  className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg px-3.5 py-2 hover:scale-105 transition-transform group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Roof Pitch
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    6 / 12
                  </div>
                </Link>

                {/* Floating Callout 2: Wire Size (Middle-Right) */}
                <Link
                  href="/electrical/voltage-drop-calculator"
                  className="absolute top-28 right-4 sm:top-36 sm:right-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg px-3.5 py-2 hover:scale-105 transition-transform group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Wire Size
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    8 AWG
                  </div>
                </Link>

                {/* Floating Callout 3: Conduit Fill (Lower-Right) */}
                <Link
                  href="/electrical/conduit-fill-calculator"
                  className="absolute bottom-16 right-6 sm:bottom-20 sm:right-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg px-3.5 py-2 hover:scale-105 transition-transform group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Conduit Fill
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    40%
                  </div>
                </Link>

                {/* Floating Callout 4: Concrete Volume (Bottom-Left) */}
                <Link
                  href="/construction/concrete-calculator"
                  className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg px-3.5 py-2 hover:scale-105 transition-transform group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Concrete Volume
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    2.6 yd³
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. TRUST PILLARS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-10 border-t border-slate-100">
            {trustPillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. EXPLORE TRADE CALCULATORS SECTION */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore Trade Calculators
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Instant calculations, reference tables and worked examples for every trade.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
            >
              <span>View All 15 Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5-Column Trade Suite Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {tradeSuites.map((suite) => {
              const Icon = suite.icon;
              return (
                <Link
                  key={suite.title}
                  href={suite.href}
                  className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-[0.99]"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${suite.badgeBg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                        {suite.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {suite.desc}
                    </p>

                    {/* Realistic Trade Visual Asset */}
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Image
                        src={suite.img}
                        alt={suite.title}
                        width={280}
                        height={180}
                        className="object-contain max-h-24 w-auto group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600 pt-4 mt-2 border-t border-slate-100 transition-colors">
                    <span>{suite.count}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. FEATURED CALCULATORS (DARK NAVY BENCHMARK SHELF) */}
      <section className="py-6 sm:py-10">
        <Container>
          <div className="rounded-3xl bg-[#0B1528] p-7 sm:p-10 lg:p-12 text-white shadow-xl shadow-slate-900/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Featured Calculators
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-1">
                  Most popular tools used by contractors, builders and trades professionals.
                </p>
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
              >
                <span>View All Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 4 Featured Tool Cards on Clean White Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group bg-white rounded-2xl p-5 text-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {tool.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                    {tool.subtitle}
                  </p>

                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                    <Image
                      src={tool.img}
                      alt={tool.title}
                      width={240}
                      height={160}
                      className="object-contain max-h-24 w-auto group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. NEC WORKED SOLUTIONS SECTION */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                NEC Worked Solutions
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Real-world electrical problems with step-by-step solutions and interactive calculators.
              </p>
            </div>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
            >
              <span>View All Solutions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {necSolutions.map((sol) => (
              <Link
                key={sol.title}
                href={sol.href}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                      {sol.code}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight mb-2">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {sol.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 pt-4 mt-3 border-t border-slate-100">
                  <span>View Worked Solution</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
