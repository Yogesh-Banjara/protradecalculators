import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import { SolutionsBrowser, type ProblemCategory } from "@/components/solutions/solutions-browser";
import necProblems from "@/data/nec-problems.json";
import { BookOpen, ShieldCheck, ExternalLink, ArrowRight, Table } from "lucide-react";

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
    "nec code reference table",
  ],
});

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

const CODE_REFERENCE_ROWS = [
  {
    article: "NEC 220.51 & 424.3(B)",
    topic: "Fixed Space Heating",
    application: "7,000W 240V Baseboard Continuous Sizing (125%)",
    linkText: "Baseboard Heating Load",
    href: "/solutions/baseboard-heater-7000w-240v-service-load",
  },
  {
    article: "NEC Table 430.250 & 430.22",
    topic: "3-Phase Induction Motors",
    application: "20 HP 230V Running FLC & Conductor Ampacity",
    linkText: "20 HP HVAC Demand",
    href: "/solutions/3-phase-20hp-230v-hvac-service-demand",
  },
  {
    article: "NEC 210.19(A) Note 4",
    topic: "Voltage Drop Limits",
    application: "100ft 12 AWG 120V 20A Branch Circuit (3% limit)",
    linkText: "100ft 12 AWG Drop",
    href: "/solutions/voltage-drop-100ft-12awg-20a-120v",
  },
  {
    article: "NEC Chapter 9 Table 4",
    topic: "Conduit Area 40% Fill",
    application: "Three 4 AWG THHN Conductors in EMT Sizing",
    linkText: "Three 4 AWG in EMT",
    href: "/solutions/conduit-fill-three-4awg-thhn-in-emt",
  },
  {
    article: "NEC Table 220.55 Col C",
    topic: "Household Electric Ranges",
    application: "12 kW Single-Phase Residential Range Demand",
    linkText: "12 kW Range Demand",
    href: "/solutions/range-service-load-12kw-household-single-phase",
  },
  {
    article: "NEC 310.12 & Table 310.12",
    topic: "Dwelling Service Sizing",
    application: "200A Dwelling Service 83% Conductor Ampacity",
    linkText: "200A Service Sizing",
    href: "/solutions/feeder-ampacity-single-family-dwelling-200a-service",
  },
  {
    article: "NEC Article 314.16(B)",
    topic: "Metal Box Fill Allowances",
    application: "Six 12 AWG Wires, Clamps, & Duplex Receptacle",
    linkText: "Box Fill 6x 12 AWG",
    href: "/solutions/box-fill-six-12awg-two-clamps-one-receptacle",
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

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />

      <div className="py-8 sm:py-12 space-y-10">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          {/* Page Hero */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                <BookOpen className="h-3.5 w-3.5" />
                20 Verified NEC Worked Solutions
              </div>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-amber-700 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Standards &amp; Methodology Compliance &rarr;
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Real-World NEC Calculation Solutions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Step-by-step mathematical solutions and code citations for 20 common electrical
              engineering, contractor licensing, and master electrician exam scenarios. Each
              problem provides exact formulas, step derivations, direct answers, and pre-loaded
              interactive tools.
            </p>
          </div>

          {/* Quick Reference Cheat Sheet Table */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  NEC Code Reference Quick Table
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                Direct Code Articles &rarr; Worked Solutions
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200/90 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3 sm:p-3.5">Code Article</th>
                    <th className="p-3 sm:p-3.5">Topic</th>
                    <th className="p-3 sm:p-3.5">Typical Application</th>
                    <th className="p-3 sm:p-3.5 text-right">Direct Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CODE_REFERENCE_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 sm:p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.article}
                      </td>
                      <td className="p-3 sm:p-3.5 font-semibold text-slate-800">
                        {row.topic}
                      </td>
                      <td className="p-3 sm:p-3.5 text-slate-600">
                        {row.application}
                      </td>
                      <td className="p-3 sm:p-3.5 text-right whitespace-nowrap">
                        <Link
                          href={row.href}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                        >
                          {row.linkText} <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Client-Side Search Filter & Grouped Scenarios */}
          <SolutionsBrowser
            problems={necProblems}
            categories={SOLUTION_CATEGORIES}
          />

          {/* Compliance & Methodology Footer Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-12">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs sm:text-sm hover:bg-amber-400 transition-colors shrink-0 shadow-xs"
            >
              Calculation Methodology <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
