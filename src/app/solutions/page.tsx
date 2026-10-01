import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import necProblems from "@/data/nec-problems.json";
import { BookOpen, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "NEC Electrical Solutions & Step-by-Step Calculations",
  description:
    "Explore 20 solved National Electrical Code (NEC) calculation problems with step-by-step derivations, code references, and interactive calculation tools.",
  path: "/solutions",
  keywords: [
    "nec calculation solutions",
    "electrical code problems",
    "step by step electrical calculations",
    "nec wire sizing problems",
    "conduit fill examples",
    "box fill calculation examples",
    "motor branch circuit sizing",
  ],
});

interface ProblemCategory {
  title: string;
  description: string;
  slugs: string[];
}

const SOLUTION_CATEGORIES: ProblemCategory[] = [
  {
    title: "1. Service Entrance & Feeder Sizing",
    description:
      "NEC Table 310.12 dwelling factors, service load ampacities, transformer ratings, and grounding electrode conductor rules.",
    slugs: [
      "feeder-ampacity-single-family-dwelling-200a-service",
      "grounding-electrode-conductor-sizing-200a-service",
      "transformer-full-load-amps-45kva-480v-to-208v",
    ],
  },
  {
    title: "2. Voltage Drop & Conductor Optimization",
    description:
      "Single-phase and three-phase line-to-line voltage loss calculations under NEC 3% and 5% threshold recommendations.",
    slugs: [
      "voltage-drop-100ft-12awg-20a-120v",
      "voltage-drop-250ft-6awg-50a-240v-subpanel",
      "voltage-drop-500ft-480v-3phase-100a-feeder",
    ],
  },
  {
    title: "3. Conduit Fill & Box Volume Sizing",
    description:
      "NEC Chapter 9 raceway percentage fill schedules, jam ratio risk factors, and Article 314 metal box unit allowances.",
    slugs: [
      "conduit-fill-three-4awg-thhn-in-emt",
      "conduit-fill-four-500kcmil-thhn-in-rigid-metal-conduit",
      "conduit-fill-six-10awg-thhn-in-half-inch-emt",
      "box-fill-six-12awg-two-clamps-one-receptacle",
      "box-fill-4x4-square-box-deep-device-capacity",
    ],
  },
  {
    title: "4. Motor & HVAC Branch Circuit Sizing",
    description:
      "NEC Table 430.250 full-load running current, inverse-time breaker sizing, and Article 440 MCA/MOP equipment coordination.",
    slugs: [
      "3-phase-20hp-230v-hvac-service-demand",
      "motor-branch-circuit-sizing-15hp-460v-3phase",
      "minimum-wire-size-ac-unit-mca-mop-nameplate",
    ],
  },
  {
    title: "5. Residential Appliance Loads & Solar PV",
    description:
      "Continuous space heating factors, Table 220.55 range demand, neutral derating, dedicated appliance circuits, and solar inverter continuous outputs.",
    slugs: [
      "baseboard-heater-7000w-240v-service-load",
      "range-service-load-12kw-household-single-phase",
      "neutral-sizing-electric-range-unbalanced-load",
      "residential-dryer-feeder-load-5000w-240v",
      "kitchen-small-appliance-branch-circuits-demand",
      "solar-pv-inverter-output-circuit-conductor-sizing",
    ],
  },
];

export default function SolutionsIndexPage() {
  const breadcrumbs = [{ name: "Solutions", url: "/solutions" }];

  const pageSchema = buildWebPageSchema(
    "NEC Electrical Solutions & Step-by-Step Calculations",
    "Explore 20 solved National Electrical Code (NEC) calculation problems with step-by-step derivations and interactive calculators.",
    "/solutions",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  const problemMap = new Map(necProblems.map((p) => [p.slug, p]));

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />

      <div className="py-8 sm:py-12 space-y-12">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          {/* Page Hero */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                <BookOpen className="h-3.5 w-3.5" />
                20 Verified NEC Worked Solutions
              </div>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Standards &amp; Methodology Compliance &rarr;
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Real-World NEC Calculation Solutions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Step-by-step mathematical solutions and code citations for 20 common electrical
              engineering, contractor licensing, and master electrician exam scenarios. Each
              problem provides exact formulas, step derivations, direct answers, and pre-loaded
              interactive tools.
            </p>
          </div>

          {/* Grouped Scenarios by Category */}
          <div className="space-y-12">
            {SOLUTION_CATEGORIES.map((cat, catIdx) => {
              const categoryProblems = cat.slugs
                .map((slug) => problemMap.get(slug))
                .filter((p): p is (typeof necProblems)[number] => Boolean(p));

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
                      <Link
                        key={problem.slug}
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
                            <span className="font-bold text-slate-900 line-clamp-1">
                              {problem.answer}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                          View Worked Derivation <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Compliance & Methodology Footer Banner */}
          <div className="p-6 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-12">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Verification &amp; Standards
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Learn How ProTrade Validates NEC Formulas
              </h3>
              <p className="text-xs text-slate-300">
                Read our engineering validation protocols, editorial standards, and AHJ safety notices.
              </p>
            </div>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shrink-0 shadow-sm"
            >
              Calculation Methodology <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
