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
        </Container>
      </div>
    </>
  );
}
