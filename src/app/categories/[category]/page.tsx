import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { TOOL_CATEGORIES, getCategoryById, getToolsByCategory } from "@/lib/tools/registry";
import {
  HardHat,
  Layers,
  Zap,
  Wind,
  Droplets,
  Trees,
  Box,
  Axe,
  Clock,
  ArrowRight,
  Calculator,
  BookOpen,
  FileText,
} from "lucide-react";
import type { ToolCategoryId } from "@/types/tools";

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

export function generateStaticParams() {
  return TOOL_CATEGORIES.filter((category) => category.status === "active").map(
    (category) => ({
      category: category.slug,
    })
  );
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryById(slug);

  if (!category || category.status !== "active") {
    return { title: "Category Not Found" };
  }

  return generatePageMetadata({
    title: `${category.name} Calculators`,
    description: category.description,
    path: `/categories/${category.slug}`,
    keywords: [
      `${category.name.toLowerCase()} calculators`,
      `${category.name.toLowerCase()} trade tools`,
      "construction estimating",
    ],
  });
}

export default async function CategoryHubPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryById(slug);

  if (!category || category.status !== "active") {
    notFound();
  }

  const breadcrumbs = [
    { name: "Tools Directory", url: "/tools" },
    { name: category.name, url: `/categories/${category.slug}` },
  ];

  const pageSchema = buildWebPageSchema(
    `${category.name} Calculators & Tools`,
    category.description,
    `/categories/${category.slug}`,
    breadcrumbs
  );

  const tools = getToolsByCategory(category.id as ToolCategoryId);

  const categoryIcons: Record<string, React.ReactNode> = {
    construction: <HardHat className="h-6 w-6 text-amber-600" />,
    materials: <Layers className="h-6 w-6 text-amber-600" />,
    electrical: <Zap className="h-6 w-6 text-blue-600" />,
    hvac: <Wind className="h-6 w-6 text-emerald-600" />,
    plumbing: <Droplets className="h-6 w-6 text-cyan-600" />,
    landscaping: <Trees className="h-6 w-6 text-amber-600" />,
    "pallet-freight": <Box className="h-6 w-6 text-amber-600" />,
    woodworking: <Axe className="h-6 w-6 text-amber-600" />,
  };

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-8 sm:py-12 pb-20 bg-slate-50 min-h-screen">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <div className="my-6 max-w-4xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                {categoryIcons[category.id] ?? <Calculator className="h-5 w-5 text-amber-600" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Specialized Engineering Suite
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {category.name} Calculators
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {category.description}
            </p>
          </div>

          {/* Feature Callouts */}
          {category.slug === "plumbing" && (
            <div className="p-5 sm:p-6 rounded-2xl border border-cyan-200/80 bg-white shadow-xs space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800">
                <Droplets className="h-4 w-4 text-cyan-600" />
                <span>Plumbing &amp; Sanitary Engineering Architecture</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Sizing Sanitary Drainage Lines by Fixture Units
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gravity drainage requires converting fixture discharge into cumulative units. Sizing horizontal branches, vertical soil stacks, and building drains is governed by IPC Chapter 7 (Table 710.1) and UPC Chapter 7 (Table 703.2).
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/plumbing/dfu-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
                    >
                      Calculate Drainage Fixture Units (DFU) &amp; Drain Pipe Sizes
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 pt-3 md:pt-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Potable Water Supply &amp; Velocity Control
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sizing potable water mains and distribution branches requires converting fixture units to peak design flow (GPM) via Hunter&apos;s Curve and maintaining velocity under 8.0 FPS.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/plumbing/wsfu-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
                    >
                      Calculate Water Supply Fixture Units (WSFU) &amp; Water Lines
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {category.slug === "construction" && (
            <div className="p-5 sm:p-6 rounded-2xl border border-amber-200/80 bg-white shadow-xs space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <HardHat className="h-4 w-4 text-amber-600" />
                <span>Structural Framing &amp; Code Compliance</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Stair Stringer Cuts &amp; IRC Rise and Run Layout
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Residential stairs must satisfy IRC Section R311.7 (max 7-3/4&quot; rise, min 10&quot; run, 80&quot; headroom). Calculate exact 2x12 stringer cut patterns and bottom riser deductions before sawing lumber.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/construction/stair-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      Calculate Stair Stringer Layout &amp; Riser Heights
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 pt-3 md:pt-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Deck Framing, Joist Spans &amp; Pier Footings
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Complete material takeoff for composite or wood decking, 12&quot; vs 16&quot; on-center joists per IRC Table R507.6, support beams, concrete pier footings, and structural hardware.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/construction/deck-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      Calculate Deck Surface Boards, Joists &amp; Pier Footings
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {category.slug === "hvac" && (
            <div className="p-5 sm:p-6 rounded-2xl border border-emerald-200/80 bg-white shadow-xs space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Wind className="h-4 w-4 text-emerald-600" />
                <span>HVAC &amp; Mechanical Engineering Suite</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Equal Friction Duct Sizing &amp; CFM Airflow
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Size supply ducts, return air trunks, and branch runs using Huebscher rectangular conversion and standard friction loss rates (0.05 to 0.1 in. wg/100 ft).
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/hvac/duct-sizing-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      Calculate HVAC Duct Sizing &amp; Branch CFM
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 pt-3 md:pt-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Manual J Thermal Load &amp; AC Tonnage
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estimate whole-house or room heating and cooling loads (BTU/hr) and size residential split systems and heat pumps across climate zones 1 through 7.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/hvac/btu-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      Calculate Heating &amp; Cooling BTU Load &amp; Tonnage
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Available Calculators in Suite</h2>
              <span className="text-xs text-slate-500 font-mono">
                {tools.length} active tools
              </span>
            </div>

            {tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                  const imageSrc = TOOL_IMAGES[tool.slug] || "/images/trade/hero-modern-house.jpg";
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.path ?? `/${tool.categoryId}/${tool.slug}`}
                      className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Code Verified
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug mb-1">
                          {tool.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {tool.description}
                        </p>

                        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-2">
                          <Image
                            src={imageSrc}
                            alt={tool.title}
                            width={260}
                            height={160}
                            className="object-contain max-h-28 w-auto group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600 pt-3 border-t border-slate-100 transition-colors">
                        <span>Launch Calculator</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="border border-slate-200 bg-white rounded-2xl p-8 text-center text-slate-500">
                <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Tools Under Development
                </h3>
                <p className="text-xs text-slate-500">
                  Standard models and calculations for {category.name.toLowerCase()} are currently being mapped.
                </p>
              </div>
            )}
          </div>

          {/* Electrical Suite Exclusive: NEC Solutions & Guides */}
          {category.slug === "electrical" && (
            <div className="space-y-8 pt-8 border-t border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                      NEC Worked Solutions &amp; Code Case Studies
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Step-by-step mathematical proofs and code citations for real-world electrical design problems:
                    </p>
                  </div>
                  <Link
                    href="/solutions"
                    className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                  >
                    View All 20 Solutions <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    href="/solutions/voltage-drop-100ft-12awg-20a-120v"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 210.19(A)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      100ft 12 AWG at 20A 120V Voltage Drop
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate voltage loss and upsize conductor to 10 AWG to maintain the NEC 3% branch circuit threshold.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/conduit-fill-three-4awg-thhn-in-emt"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC Chapter 9 Table 1
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Three 4 AWG THHN in EMT Raceway
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Determine minimum EMT trade size using Table 4 dimensions and 40% fill maximums.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/box-fill-six-12awg-two-clamps-one-receptacle"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 314.16(B)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Six 12 AWG, Two Clamps &amp; Receptacle Box Fill
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate cubic inch volume requirements for conductor counts, internal clamps, and device yokes.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/feeder-ampacity-single-family-dwelling-200a-service"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 310.12
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      200A Single-Family Dwelling Feeder Sizing
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Apply the 83% residential service conductor demand factor to size copper or aluminum entrance conductors.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/solar-pv-inverter-output-circuit-conductor-sizing"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 690.8(B)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Solar PV Inverter Output Conductor Sizing
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate 125% continuous output current and minimum OCPD protection for grid-tied solar systems.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/grounding-electrode-conductor-sizing-200a-service"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC Table 250.66
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      200A Service Grounding Electrode Conductor
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Size copper and aluminum grounding electrode conductors based on ungrounded service entrance size.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/box-fill-4x4-square-box-deep-device-capacity"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC Table 314.16(A)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      4x4 Deep Square Box Conductor Capacity
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      30.3 cu in volume allowances, conductor fill deductions, and device volume sizing.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/conduit-fill-six-10awg-thhn-in-half-inch-emt"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC Chapter 9 Table 4
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Six 10 AWG THHN in 1/2&quot; EMT Fill Check
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate cross-sectional area and 40% fill capacity limit (0.122 sq in threshold).
                    </p>
                  </Link>

                  <Link
                    href="/solutions/kitchen-small-appliance-branch-circuits-demand"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 220.52(A)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Kitchen Small Appliance Branch Circuits
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate 1,500 VA demand factors for two kitchen circuits and dedicated laundry branch.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/minimum-wire-size-ac-unit-mca-mop-nameplate"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 440.32
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      AC Unit Wire Sizing (MCA &amp; MOP)
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Determine branch circuit ampacity for 28.5A MCA and maximum 45A overcurrent protection.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/motor-branch-circuit-sizing-15hp-460v-3phase"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 430.22
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      15 HP 460V 3-Phase Motor Branch Circuit
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate 125% FLC conductor rating (26.25A) and inverse time breaker sizing (50A).
                    </p>
                  </Link>

                  <Link
                    href="/solutions/neutral-sizing-electric-range-unbalanced-load"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 220.61(B)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Electric Range Feeder Neutral Sizing
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Apply the 70% unbalanced neutral demand factor for household cooking appliances.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/residential-dryer-feeder-load-5000w-240v"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 220.54
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Residential Clothes Dryer 5,000W Feeder
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate minimum 5 kW dryer demand or nameplate rating under Table 220.54.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/transformer-full-load-amps-45kva-480v-to-208v"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEC 450.3(B)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      45 kVA 480V-208V Transformer Full-Load Amps
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Calculate 54.13A primary FLC, 124.91A secondary FLC, and 70A primary breaker sizing.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Technical Electrical Master Guides */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    Technical Electrical Master Guides
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Comprehensive code walkthroughs and engineering derivations:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/guides/electricians-guide-to-voltage-drop-calculations"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Master Guide
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Electrician&apos;s Guide to Voltage Drop
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Formulas, resistance constants, NEC 3% vs 5% thresholds, and distance derating tables.
                    </p>
                  </Link>

                  <Link
                    href="/guides/nec-conduit-fill-rules-and-tables"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Master Guide
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      NEC Conduit Fill Rules &amp; Tables
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Chapter 9 Table 1 percentages, 60% nipple exemptions, Table 4 dimensions, and jam ratios.
                    </p>
                  </Link>

                  <Link
                    href="/guides/subpanel-feeder-sizing"
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Master Guide
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mt-2">
                      Subpanel Feeder Conductor Sizing
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      Continuous load factors, Table 310.16 ampacity, and long-run voltage drop calculations.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
