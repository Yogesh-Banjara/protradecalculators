import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildHowToSchema,
  buildFaqSchema,
} from "@/lib/seo/schema";
import { ConduitFillCalculatorForm } from "@/components/tools/conduit-fill-calculator/conduit-form";
import { EmbedModal } from "@/components/tools/embed-modal";
import {
  Layers,
  HelpCircle,
  AlertTriangle,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Conduit Fill Calculator - NEC Chapter 9",
  description:
    "Calculate conduit fill percentage and trade size for mixed wire gauges in EMT, PVC, RMC, and FMC. Calibrated to NEC Chapter 9 Tables 1, 4, and 5.",
  path: "/electrical/conduit-fill-calculator",
  keywords: [
    "conduit fill calculator",
    "emt conduit fill calculator",
    "pvc conduit fill calculator",
    "mixed wire conduit fill",
    "nec conduit fill table",
    "how many wires in conduit",
    "wire fill calculator",
    "conduit sizing calculator",
  ],
});

export default function ConduitFillCalculatorPage() {
  const breadcrumbs = [
    { name: "Electrical & Conduit", url: "/categories/electrical" },
    {
      name: "Electrical Conduit Fill Calculator",
      url: "/electrical/conduit-fill-calculator",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "Conduit Fill Calculator - NEC Chapter 9 Wire Capacity",
    "Calculate conduit fill percentage and trade size for mixed wire gauges in EMT, PVC, RMC, and FMC. Calibrated to NEC Chapter 9 Tables 1, 4, and 5.",
    "/electrical/conduit-fill-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Electrical Conduit Fill & Wire Sizing Calculator",
    description:
      "Trade utility for calculating conduit fill percentage and trade size for mixed-conductor bundles in EMT, PVC Sch 40/80, RMC, FMC, and LFMC per NEC Chapter 9.",
    url: "/electrical/conduit-fill-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Conduit Fill for Mixed Wire Gauges",
    "A builder and electrician guide to calculating conduit fill percentage and minimum trade size using NEC Chapter 9 Tables 1, 4, and 5.",
    [
      {
        name: "List All Circuit Conductors in Raceway",
        text: "Identify all phase, neutral, and equipment grounding conductors to be installed in the raceway.",
      },
      {
        name: "Look Up Cross-Sectional Areas in NEC Chapter 9 Table 5",
        text: "Determine the square-inch cross-sectional area for each wire gauge and insulation type (e.g. 14 AWG to 1000 kcmil in THHN, XHHW, or bare copper).",
      },
      {
        name: "Sum Total Conductor Cross-Sectional Area",
        text: "Multiply the area of each conductor by its quantity and sum all values to find total conductor square inches.",
      },
      {
        name: "Apply Allowable Fill Percentage from NEC Table 1",
        text: "Apply 53% for 1 wire, 31% for 2 wires, 40% for 3 or more wires, or 60% for short nipples 24 inches or less.",
      },
      {
        name: "Select Minimum Compliant Conduit Trade Size from Table 4",
        text: "Compare total conductor area against the allowable internal area of candidate trade sizes (1/2\" to 4\") in EMT, PVC, or RMC.",
      },
    ]
  );

  const faqItems = [
    {
      question: "What is the maximum allowable conduit fill percentage according to the National Electrical Code (NEC)?",
      answer:
        "Under NEC Chapter 9 Table 1: 1 conductor allows 53% maximum fill; 2 conductors allow 31% maximum fill; and 3 or more conductors allow 40% maximum fill. For short conduit nipples 24 inches or less in length installed between enclosures, Note 4 permits up to 60% fill.",
    },
    {
      question: "How do I calculate conduit fill for mixed wire sizes?",
      answer:
        "When installing different wire gauges in the same conduit (such as three 4 AWG power conductors and one 8 AWG ground wire), you must find the exact cross-sectional area of each conductor in square inches from NEC Chapter 9 Table 5, add the areas together, and select a conduit trade size from Table 4 where the 40% allowable area meets or exceeds your total wire area.",
    },
    {
      question: "Why does PVC Schedule 80 hold fewer wires than EMT or Schedule 40?",
      answer:
        "PVC Schedule 80 has a much thicker outer wall designed to withstand severe physical damage. Because its outside diameter remains fixed for conduit fittings, its internal diameter is significantly smaller, reducing available internal cross-sectional area by up to 25% compared to EMT or Schedule 40.",
    },
    {
      question: "What is the 24-inch conduit nipple 60% fill exception?",
      answer:
        "NEC Chapter 9 Table 1, Note 4 allows conduit sections 24 inches (600 mm) or less installed between panels, switchgear, or pull boxes to be filled up to 60% of their total internal cross-sectional area. In addition, ampacity derating factors (NEC 310.15(C)(1)) do not apply to nipples 24 inches or less.",
    },
    {
      question: "What is the conduit jam ratio and why does it cause wire binding?",
      answer:
        "Jam ratio is the ratio of conduit inside diameter to conductor outside diameter (Conduit ID / Wire OD). When pulling 3 conductors into a raceway and the ratio falls between 2.8 and 3.2, the wires can roll side-by-side into a flat cross-section and wedge tightly against the conduit wall during a 90-degree bend, causing severe cable damage. Upsizing to the next trade size prevents jamming.",
    },
    {
      question: "Does the equipment ground wire count toward conduit fill?",
      answer:
        "Yes. All conductors installed inside the raceway—including insulated equipment grounding conductors and bare copper ground wires—must be included in the total cross-sectional area calculation per NEC Chapter 9 Table 1.",
    },
  ];

  const faqSchema = buildFaqSchema(faqItems);

  return (
    <>
      <JsonLd schema={[pageSchema, softwareAppSchema, howToSchema, faqSchema]} />

      <div className="py-8 sm:py-10 space-y-12">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumb items={breadcrumbs} />

          {/* Above the Fold: Header & Intro */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                <Layers className="h-3.5 w-3.5" />
                NEC Chapter 9 Conduit Fill &amp; Capacity Utility
              </div>
              <span className="text-xs text-slate-500 font-medium">
                40% Multi-Wire • 53% 1-Wire • 31% 2-Wire • 60% Nipple (&le;24&quot;) • Jam Ratio Safety
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Electrical Conduit Fill Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate mixed-conductor <strong>conduit fill percentage</strong>, <strong>trade size capacity</strong>, and <strong>jam ratio risks</strong> for EMT, PVC Schedule 40/80, RMC, FMC, and LFMC raceways per <strong>NEC Chapter 9 Tables 1, 4 &amp; 5</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 no-print">
              <EmbedModal
                toolSlug="conduit-fill-calculator"
                toolName="Electrical Conduit Fill Calculator"
              />
            </div>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <ConduitFillCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: NEC Table 1 Fill Limits */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. NEC Chapter 9 Table 1 Allowable Fill Percentages
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                The National Electrical Code specifies maximum percentage raceway fill to prevent excessive pulling friction, jacket damage, and heat buildup:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">1 Conductor</span>
                  <h3 className="text-lg font-black text-slate-900">53% Max Fill</h3>
                  <p className="text-slate-600 text-xs">Single conductor pulls, large service entrance cables.</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">2 Conductors</span>
                  <h3 className="text-lg font-black text-slate-900">31% Max Fill</h3>
                  <p className="text-slate-600 text-xs">Restricted because oval 2-wire twisting binds in bends.</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">3+ Conductors</span>
                  <h3 className="text-lg font-black text-slate-900">40% Max Fill</h3>
                  <p className="text-slate-600 text-xs">Standard rule for 3-phase and multi-wire branch circuits.</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">Nipple (&le; 24&quot;)</span>
                  <h3 className="text-lg font-black text-slate-900">60% Max Fill</h3>
                  <p className="text-slate-600 text-xs">Short conduit sections between enclosures (Note 4).</p>
                </div>
              </div>
            </section>

            {/* Section 2: Conduit Material Differences */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Conduit Types &amp; Internal Diameter Comparison (Table 4)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Even with the same nominal trade size, different raceway materials have distinct internal diameters and usable cross-sectional areas:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Conduit Type</th>
                      <th className="p-3">3/4&quot; Total Area</th>
                      <th className="p-3">3/4&quot; 40% Fill Area</th>
                      <th className="p-3">1&quot; 40% Fill Area</th>
                      <th className="p-3">Key Trade Characteristic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">EMT (Thinwall Steel)</td>
                      <td className="p-3">0.533 sq in</td>
                      <td className="p-3 text-amber-800 font-bold">0.213 sq in</td>
                      <td className="p-3">0.346 sq in</td>
                      <td className="p-3 font-sans text-slate-600">Largest internal area; standard indoor choice</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">PVC Schedule 40</td>
                      <td className="p-3">0.508 sq in</td>
                      <td className="p-3 text-amber-800 font-bold">0.203 sq in</td>
                      <td className="p-3">0.333 sq in</td>
                      <td className="p-3 font-sans text-slate-600">Underground trenching, direct burial, slab work</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">PVC Schedule 80</td>
                      <td className="p-3">0.409 sq in</td>
                      <td className="p-3 text-rose-800 font-bold">0.164 sq in</td>
                      <td className="p-3">0.275 sq in</td>
                      <td className="p-3 font-sans text-slate-600">Thick wall for physical protection; 23% smaller area</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">RMC (Rigid Metal)</td>
                      <td className="p-3">0.549 sq in</td>
                      <td className="p-3 text-amber-800 font-bold">0.220 sq in</td>
                      <td className="p-3">0.355 sq in</td>
                      <td className="p-3 font-sans text-slate-600">Threaded heavy steel; industrial service masts</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">LFMC (Liquidtight Flex)</td>
                      <td className="p-3">0.528 sq in</td>
                      <td className="p-3 text-amber-800 font-bold">0.211 sq in</td>
                      <td className="p-3">0.340 sq in</td>
                      <td className="p-3 font-sans text-slate-600">Outdoor A/C compressors, generators, pool pumps</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Understanding Jam Ratio */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                3. The 3-Conductor Jam Ratio Warning (2.8 to 3.2)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                When pulling exactly 3 conductors into a conduit, the ratio of conduit inside diameter to conductor outside diameter (Jam Ratio = Conduit ID / Wire OD) is a critical physical factor:
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Why Conductor Jamming Occurs in Bends
                </p>
                <p className="text-slate-700">
                  In a straight run, 3 conductors nest in a triangular formation. However, when pulled around a 90° bend under tension, the wires attempt to align side-by-side. If the conduit diameter is between <strong>2.8 and 3.2 times the wire diameter</strong>, the three wires wedge tightly against the raceway walls, creating extreme friction that can break pull ropes and tear insulation.
                </p>
              </div>
            </section>

            {/* Section 4: Common Circuit Conduit Sizing Schedules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                4. Common Trade Conduit Sizing Quick Reference
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Standard conduit sizes for common residential and commercial electrical circuits:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>15A/20A Branch Circuit (3× #12 THHN):</strong> 1/2&quot; EMT (13.1% fill) or 1/2&quot; PVC-40 (14.0% fill).</li>
                <li><strong>50A EV Charger / Range (3× #6 THHN + 1× #10 Ground):</strong> 3/4&quot; EMT (33.5% fill) or 1&quot; PVC Sch 80 (25.2% fill).</li>
                <li><strong>60A Hardwired EV (3× #4 THHN + 1× #8 Ground):</strong> 1&quot; EMT (32.9% fill) or 1&quot; PVC-40 (34.1% fill).</li>
                <li><strong>100A Subpanel Feeder (3× #1 THHN + 1× #6 Ground):</strong> 1-1/4&quot; EMT (34.7% fill) or 1-1/2&quot; PVC-40 (26.1% fill).</li>
                <li><strong>200A Service Entrance (3× 4/0 Al XHHW + 1× #2 Al Ground):</strong> 2&quot; EMT (32.0% fill) or 2&quot; PVC-40 (32.6% fill).</li>
              </ul>
            </section>

            {/* Technical Master Guide Callout */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> Technical Master Reference
                </span>
                <h3 className="text-lg font-bold text-white">
                  NEC Conduit Fill Rules, Chapter 9 Tables &amp; Jam Ratios
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Deep-dive engineering guide covering Chapter 9 Table 1 percentage limits (53%, 31%, 40%), Table 4 raceway dimensions, Table 5 conductor areas, and the 3-wire jam ratio trap.
                </p>
              </div>
              <Link
                href="/guides/nec-conduit-fill-rules-and-tables"
                className="shrink-0 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm inline-flex items-center gap-1.5 transition-colors shadow"
              >
                Read Master Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Section 5: Real-World NEC Calculation Scenarios */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-600" />
                5. Real-World NEC Raceway Calculation Scenarios
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Explore step-by-step mathematical solutions and code citations for raceway fill problems:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/solutions/conduit-fill-three-4awg-thhn-in-emt"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC Table 4 (EMT)
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Three 4 AWG THHN in EMT
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Calculate minimum EMT trade size for three 4 AWG THHN copper conductors.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Result:</span>
                      1-inch EMT (0.2472 vs 0.346 sq. in.)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/solutions/conduit-fill-six-10awg-thhn-in-half-inch-emt"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC Table 4 (1/2&quot; EMT)
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Six 10 AWG THHN in 1/2&quot; EMT
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Determine if six 10 AWG THHN conductors fit within 1/2-inch EMT 40% fill limit.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Result:</span>
                      Fails: 0.1266 sq. in. &gt; 0.122 sq. in.
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/solutions/conduit-fill-four-500kcmil-thhn-in-rigid-metal-conduit"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC Table 4 (RMC)
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Four 500 kcmil THHN in RMC
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Size Rigid Metal Conduit (RMC) for four 500 kcmil THHN copper conductors.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Result:</span>
                      3-inch RMC (2.8292 vs 2.95 sq. in.)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/guides/nec-conduit-fill-rules-and-tables"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                        Technical Guide
                      </span>
                      <span className="text-xs font-mono text-slate-500">Master Reference</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      NEC Conduit Fill Rules &amp; Tables
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Complete guide to Chapter 9 Table 1 limits (53%, 31%, 40%), Table 4 dimensions, and 60% nipple exemption.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Coverage:</span>
                      NEC Chapter 9 Tables 1, 4 &amp; 5
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    Read Master Guide <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </div>
            </section>

            {/* Reciprocal Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interconnected Electrical &amp; Construction Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Complete Your Electrical Run &amp; Structural Planning
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Connect your conduit sizing with wire gauge voltage drop, outdoor deck power, and concrete slab trenching tools:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/electrical/voltage-drop-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Wire Gauge Sizing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Voltage Drop &amp; Wire Size Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate exact AWG wire sizes and voltage drop before sizing conduit.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Wire Size <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/deck-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Outdoor Power
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Deck Material &amp; Framing Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Plan deck joist spacing and low-voltage lighting conduit paths.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Decks <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/concrete-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Under-Slab Conduits
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Concrete Slab &amp; Footing Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate ready-mix concrete yardage for utility trenches and equipment pads.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Concrete <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 6: Frequently Asked Questions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                6. Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-lg border border-slate-200 bg-white space-y-2 shadow-sm"
                  >
                    <h3 className="text-base font-bold text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
