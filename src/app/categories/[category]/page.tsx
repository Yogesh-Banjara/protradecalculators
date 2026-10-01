import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryNav } from "@/components/layout/category-nav";
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
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { ToolCategoryId } from "@/types/tools";

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
    construction: <HardHat className="h-8 w-8 text-amber-500" />,
    materials: <Layers className="h-8 w-8 text-amber-500" />,
    electrical: <Zap className="h-8 w-8 text-amber-500" />,
    hvac: <Wind className="h-8 w-8 text-amber-500" />,
    plumbing: <Droplets className="h-8 w-8 text-cyan-500" />,
    landscaping: <Trees className="h-8 w-8 text-amber-500" />,
    "pallet-freight": <Box className="h-8 w-8 text-amber-500" />,
    woodworking: <Axe className="h-8 w-8 text-amber-500" />,
  };

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-10 pb-20 space-y-8">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <CategoryNav currentCategorySlug={category.slug} />

          <div className="space-y-4 my-8">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 shrink-0">
                {categoryIcons[category.slug] ?? <HardHat className="h-7 w-7 text-amber-600" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {category.name}
                  </h1>
                  <Badge variant={category.status === "active" ? "brand" : "outline"} className="text-xs">
                    {tools.length} {tools.length === 1 ? "Calculator" : "Calculators"}
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {category.slug === "plumbing" && (
            <div className="p-6 rounded-2xl border border-cyan-200/80 bg-white shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800">
                <Droplets className="h-4 w-4 text-cyan-600" />
                <span>Sanitary Drainage &amp; Potable Supply Design</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Sizing Sanitary Drainage Lines by Fixture Units
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gravity drainage requires converting fixture discharge into cumulative units. Sizing horizontal branches, vertical soil stacks, and building drains is governed by IPC Chapter 7 (Table 710.1) and UPC Chapter 7 (Table 703.2).
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/plumbing/dfu-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition-colors"
                    >
                      Calculate Drainage Fixture Units (DFU) &amp; Drain Pipe Sizes
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                  <h3 className="font-bold text-slate-900 text-base">
                    Potable Water Supply &amp; Velocity Control
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sizing potable water mains and distribution branches requires converting fixture units to peak design flow (GPM) via Hunter&apos;s Curve and maintaining velocity under 8.0 FPS.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/plumbing/wsfu-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition-colors"
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
            <div className="p-6 rounded-2xl border border-amber-200/80 bg-white shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <HardHat className="h-4 w-4 text-amber-600" />
                <span>Structural Framing &amp; Code Compliance</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Stair Stringer Cuts &amp; IRC Rise and Run Layout
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Residential stairs must satisfy IRC Section R311.7 (max 7-3/4&quot; rise, min 10&quot; run, 80&quot; headroom). Calculate exact 2x12 stringer cut patterns and bottom riser deductions before sawing lumber.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/construction/stair-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      Calculate Stair Stringer Layout &amp; Riser Heights
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                  <h3 className="font-bold text-slate-900 text-base">
                    Deck Framing, Joist Spans &amp; Pier Footings
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Complete material takeoff for composite or wood decking, 12&quot; vs 16&quot; on-center joists per IRC Table R507.6, support beams, concrete pier footings, and structural hardware.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/construction/deck-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      Calculate Deck Surface Boards, Joists &amp; Pier Footings
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">Available Calculators in Suite</h2>
              <span className="text-xs text-slate-500 font-mono">
                {tools.length} active
              </span>
            </div>

            {tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.path ?? `/${tool.categoryId}/${tool.slug}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl active:scale-[0.99] transition-transform"
                  >
                    <Card interactive={true} className="h-full flex flex-col justify-between">
                      <CardHeader className="space-y-2.5 p-5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                            Deterministic Engine
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {tool.inputs?.length ?? 0} Inputs
                          </Badge>
                        </div>
                        <CardTitle className="text-base sm:text-lg font-bold group-hover:text-amber-800 flex items-center justify-between transition-colors">
                          <span>{tool.title}</span>
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-amber-600 group-hover:translate-x-1" />
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 p-5">
                        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            SVG Visualizer
                          </span>
                          <span className="font-semibold text-amber-700 group-hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Launch Tool →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Roadmap Scheduled
                  </div>
                  <CardTitle className="text-lg">
                    Trade Specification Under Design
                  </CardTitle>
                  <CardDescription>
                    Standard formulas and requirements for {category.name.toLowerCase()} are currently being mapped.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
