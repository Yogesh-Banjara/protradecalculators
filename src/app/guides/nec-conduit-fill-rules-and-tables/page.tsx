import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import {
  ShieldAlert,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "NEC Conduit Fill Rules & Chapter 9 Guide",
  description:
    "Master NEC raceway sizing: learn Chapter 9 Table 1 limits (53%, 31%, 40%), Table 4 dimensions, Table 5 conductor areas, and the 3-wire jam ratio.",
  path: "/guides/nec-conduit-fill-rules-and-tables",
  keywords: [
    "nec conduit fill guide",
    "chapter 9 table 4 emt",
    "conduit fill 40 percent rule",
    "conductor jam ratio",
    "nec chapter 9 table 1",
    "nipple 60 percent fill exception",
    "wire fill calculation",
  ],
});

export default function NecConduitFillGuidePage() {
  const breadcrumbs = [
    { name: "Guides", url: "/guides" },
    {
      name: "The Complete NEC Conduit Fill Guide",
      url: "/guides/nec-conduit-fill-rules-and-tables",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "The Complete NEC Conduit Fill Guide: Chapter 9 Tables, Jam Ratios & Sizing",
    "Master NEC raceway sizing: learn Chapter 9 Table 1 percentage limits (53%, 31%, 40%), Table 4 dimensions, Table 5 conductor areas, and how to avoid the 3-wire jam ratio.",
    "/guides/nec-conduit-fill-rules-and-tables",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />
      <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <header className="space-y-4 mb-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              Master Technical Electrical Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              The Complete NEC Conduit Fill Guide: Chapter 9 Tables, Jam Ratios &amp; Sizing
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Raceway sizing is not just about physically pulling conductors through a pipe—it is a critical thermal
              dissipation standard governed by NFPA 70® (National Electrical Code). This guide breaks down Chapter 9
              fill limits, manual derivation math, the destructive 3-wire jam ratio, and the 24-inch nipple exception.
            </p>
          </header>

          {/* Interactive Calculator Quick CTA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
                Automated Calculation Instrument
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Need to Calculate Conduit Fill for Your Jobsite Run?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Size EMT, PVC, RMC, and Flex with mixed conductor gauges instantly using our free interactive tool.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                href="/electrical/conduit-fill-calculator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Calculator className="h-4 w-4" />
                Open Conduit Sizer
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <BookOpen className="h-4 w-4 text-amber-400" />
                Worked Solutions
              </Link>
            </div>
          </div>

          <div className="space-y-12 max-w-4xl text-slate-800">
            {/* Section 1: The 40% Fill Rule Explained */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Scale className="h-6 w-6 text-amber-600" />
                1. The 40% Fill Rule Explained: Heat Dissipation &amp; Pull Tension
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                Why does the National Electrical Code prevent electricians from filling more than 40% of a raceway when pulling
                three or more conductors? The rule originates from two physics realities: <strong>joule heating (thermal dissipation)</strong>{" "}
                and <strong>mechanical pulling tension</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">1 Conductor</span>
                    <CardTitle className="text-xl font-black text-slate-900">53% Max Fill</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600">
                    A single cylindrical cable naturally rests centered or on the raceway bottom, allowing convection airflow all around its perimeter.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">2 Conductors</span>
                    <CardTitle className="text-xl font-black text-slate-900">31% Max Fill</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600">
                    Two parallel wires twist in bends, creating an oval cross-section that binds tightly against the pipe walls. The 31% limit prevents severe binding.
                  </CardContent>
                </Card>

                <Card className="border-amber-300 bg-amber-50/50">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase">3+ Conductors</span>
                    <CardTitle className="text-xl font-black text-amber-950">40% Max Fill</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-amber-900">
                    The baseline rule for 3-phase power circuits and multi-wire branch circuits. Keeps 60% of raceway interior open for heat dissipation and pulling lubrication.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2: Step-by-Step Manual Calculation Procedure */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <BookOpen className="h-6 w-6 text-amber-600" />
                2. Step-by-Step Manual Calculation using Tables 4 &amp; 5
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                To size any raceway manually without guesswork, follow this 4-step sequence citing NEC Chapter 9:
              </p>

              <div className="space-y-3 font-sans">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-xs font-bold text-amber-600 uppercase font-mono">Step 1 &bull; Lookup Conductor Areas (Table 5)</span>
                  <p className="text-sm text-slate-700">
                    Locate the approximate cross-sectional area of each conductor based on gauge and insulation type (e.g., THHN, XHHW). For example, one <strong>4 AWG THHN conductor</strong> has an area of <strong>0.0824 sq. in.</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-xs font-bold text-amber-600 uppercase font-mono">Step 2 &bull; Sum Total Conductor Area</span>
                  <p className="text-sm text-slate-700">
                    Multiply each wire type by its quantity and add equipment grounding conductors. For three #4 AWG THHN wires:
                    <span className="font-mono font-bold text-slate-900 block mt-1">
                      Total Area = 3 &times; 0.0824 sq. in. = 0.2472 sq. in.
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-xs font-bold text-amber-600 uppercase font-mono">Step 3 &bull; Select Conduit Material (Table 4)</span>
                  <p className="text-sm text-slate-700">
                    Open NEC Chapter 9, Table 4 under your conduit type (EMT, PVC Schedule 40, PVC Schedule 80, or RMC). Look down the <strong>&quot;Over 2 Wires (40%)&quot;</strong> column.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-xs font-bold text-amber-600 uppercase font-mono">Step 4 &bull; Compare Allowable Area vs Required Area</span>
                  <p className="text-sm text-slate-700">
                    In Table 4 for EMT: 3/4&quot; EMT allows <strong>0.213 sq. in.</strong> (too small for 0.2472 sq. in.). 1&quot; EMT allows <strong>0.346 sq. in.</strong>, which complies with 28.6% fill. Therefore, minimum trade size is <strong>1-inch EMT</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: The Deadly Conductor Jam Ratio */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                3. The Deadly Conductor Jam Ratio: 2.8 to 3.2
              </h2>
              <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-base">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  What Causes Conductor Jamming in Conduit Bends?
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  When exactly 3 conductors are pulled into a raceway around a 90° bend under tension, the wires attempt to align
                  side-by-side across the conduit diameter instead of remaining in a triangular cluster.
                </p>
                <div className="p-3 bg-white rounded-lg border border-rose-200 font-mono text-xs text-rose-900 font-bold">
                  Jam Ratio = Conduit Inside Diameter (ID) &divide; Conductor Outside Diameter (OD)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If the Jam Ratio falls between <strong>2.8 and 3.2</strong>, the center wire wedges tightly between the outer two wires
                  and the pipe wall. Pulling forces spike exponentially, tearing outer nylon jackets, stretching copper strands, and snapping pull ropes.
                </p>
                <p className="text-xs text-slate-800 font-semibold">
                  Prevention Rule: If Jam Ratio is between 2.8 and 3.2, upsize the conduit by one trade size to exceed 3.3 or select a different conductor insulation diameter.
                </p>
              </div>
            </section>

            {/* Section 4: Nipple Exception (NEC Chapter 9 Note 4) */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                4. The Nipple Exception: Conduits 24 Inches or Less (Note 4)
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                Under NEC Chapter 9, Note 4, short conduit sleeves and nipples connecting two enclosures (such as a meter main to an
                interior breaker panel or an auxiliary wireway) are permitted to be filled up to <strong>60% of their total internal cross-sectional area</strong>:
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>The conduit section length must not exceed <strong>24 inches (600 mm)</strong> between boxes, cabinets, or enclosures.</li>
                  <li><strong>Ampacity Derating Exemption:</strong> Conductors in a conduit nipple &le; 24&quot; are exempt from the multiple conductor bundle derating factors of Table 310.15(C)(1).</li>
                  <li>This 60% fill capacity permits significantly more conductors per trade size without violating thermal safety rules.</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Cross-Links and Tool Callouts */}
            <section className="pt-6 border-t border-slate-200 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Explore Conduit Fill Calculation Scenarios
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/solutions/conduit-fill-three-4awg-thhn-in-emt"
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-700">Worked Solution</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 text-sm">
                      Three 4 AWG THHN in EMT &rarr;
                    </h3>
                    <p className="text-xs text-slate-500">
                      Step-by-step mathematical derivation showing why 3/4&quot; EMT fails and 1&quot; EMT passes.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/solutions/conduit-fill-four-500kcmil-thhn-in-rigid-metal-conduit"
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-700">Heavy Feeder Scenario</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 text-sm">
                      Four 500 kcmil THHN in RMC &rarr;
                    </h3>
                    <p className="text-xs text-slate-500">
                      Industrial service raceway takeoff: 2.8292 sq. in. fill requiring 3-inch Rigid Metal Conduit.
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
