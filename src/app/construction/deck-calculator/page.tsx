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
import { DeckCalculatorForm } from "@/components/tools/deck-calculator/deck-form";
import {
  Maximize2,
  Ruler,
  HelpCircle,
  AlertTriangle,
  Layers,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Deck Calculator - Material & Board Takeoff",
  description:
    "Calculate deck boards, 12\" & 16\" OC joists, beams, concrete footings, and hardware. Instant composite and wood material takeoff with IRC span tables.",
  path: "/construction/deck-calculator",
  keywords: [
    "deck calculator",
    "deck material calculator",
    "deck board calculator",
    "how many deck boards do i need",
    "deck framing calculator",
    "deck joist calculator",
    "deck footing calculator",
    "deck lumber estimator",
    "composite decking calculator",
  ],
});

export default function DeckCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Deck Material & Framing Calculator", url: "/construction/deck-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Deck Calculator - Material, Board Count & Framing Takeoff",
    "Estimate deck boards, 12\" and 16\" OC joists, beams, concrete pier footings, and hardware. Calculate composite or wood decking material needs with instant takeoff.",
    "/construction/deck-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Deck Material & Framing Takeoff Calculator",
    description:
      "Contractor estimation tool for calculating deck surface boards, field joists, ledger boards, support beams, concrete sonotube pier footings, and fasteners.",
    url: "/construction/deck-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Deck Boards and Framing Lumber",
    "A builder guide to calculating deck boards, joist spacing, beam sizing, concrete pier footings, and hardware fasteners.",
    [
      {
        name: "Measure Deck Length and Projection",
        text: "Determine deck length along the house wall (ledger) and width/projection extending out into the yard.",
      },
      {
        name: "Select Decking Material and Board Stock Length",
        text: "Choose between composite (5.5\" actual) or wood (5/4x6 or 2x6) and choose 12', 16', or 20' stock lengths to minimize butt joints.",
      },
      {
        name: "Calculate Joist Spacing and Joist Count",
        text: "Select 12\" OC for composite or diagonal layouts, or 16\" OC for standard wood. Divide deck length by joist spacing to find total field joists.",
      },
      {
        name: "Determine Beam Plies and Concrete Pier Footings",
        text: "Calculate support posts and sonotube pier concrete volumes (12\" diameter below frost line) based on beam span.",
      },
      {
        name: "Take Off Hardware and Fasteners",
        text: "Estimate joist hangers, ledger lag screws, hidden clip fastener boxes (1 box per 100 sq ft), and ledger flashing tape.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do I calculate how many deck boards I need?",
      answer:
        "First, determine your deck width (projection). Find the effective coverage width of one board (e.g. 5.5\" actual width + 3/16\" gap = 5.6875\" or 0.474 ft). Divide the deck projection by 0.474 ft to find the number of board rows. Multiply the rows by your deck length to get total linear feet. Finally, divide total linear feet by your chosen stock board length (12', 16', or 20') and add 10% for cutting waste.",
    },
    {
      question: "What is the difference between 12-inch OC and 16-inch OC joist spacing?",
      answer:
        "16-inch on-center (OC) joist spacing is standard for 5/4x6 and 2x6 natural wood decking installed perpendicular to joists. 12-inch OC spacing is required for composite decking (Trex, TimberTech) to prevent sagging and bounce, as well as for any deck where surface boards are laid diagonally at a 45-degree angle.",
    },
    {
      question: "How many concrete bags do I need for deck pier footings?",
      answer:
        "For a standard 12-inch diameter sonotube footing poured 36 inches deep (below frost line), the volume is 2.36 cubic feet per pier. This requires 5.2 bags of 60lb concrete or 3.9 bags of 80lb concrete per footing. A deck with 4 support posts requires approximately 16 bags of 80lb concrete (~0.35 cubic yards).",
    },
    {
      question: "What size joists do I need for a 12-foot, 14-foot, or 16-foot deck?",
      answer:
        "Under the International Residential Code (IRC Table R507.6): A 12-foot projection typically requires 2x8 joists at 16\" OC (max clear span 12'10\"). A 14-foot projection requires 2x10 joists at 16\" OC (max clear span 16'5\"). A 16-foot projection requires 2x10 joists at 12\" OC or 2x12 joists at 16\" OC (max clear span 19'5\").",
    },
    {
      question: "How many boxes of hidden fasteners or screws do I need?",
      answer:
        "For composite grooved decking, hidden fastener clips are typically packaged in 100 sq ft boxes (approx. 175–190 clips per box with drive screws). A 280 sq ft deck requires 3 boxes of hidden fasteners. For face-screwed wood decks, estimate 3.5 screws per square foot (approx. 1,000 screws or two 5lb boxes for a 280 sq ft deck).",
    },
    {
      question: "What is a picture frame border on a deck?",
      answer:
        "A picture frame border is a perimeter band of deck boards that wraps around the outer edge of the deck, enclosing the field boards. It conceals cut board ends, provides a clean finished look, and requires perimeter blocking between the outer joists to support the border boards.",
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
                <Maximize2 className="h-3.5 w-3.5" />
                Deck Material &amp; Framing Takeoff Utility
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Composite &amp; Wood • 12&quot; &amp; 16&quot; OC Joists • Sonotube Footings • IRC R507 Spans
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Deck Material &amp; Framing Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate composite and wood <strong>deck surface boards</strong>, <strong>field joists (12&quot;/16&quot; OC)</strong>, <strong>ledger boards</strong>, <strong>support beams</strong>, <strong>sonotube concrete pier footings</strong>, and <strong>fastener hardware</strong>.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-slate-700 max-w-3xl flex items-start gap-2.5">
              <span className="font-bold text-amber-900 shrink-0">Deck Stairs:</span>
              <span>
                Planning outdoor access steps from your deck to grade? Calculate 2x12 stringer cuts, riser drops, and IRC step ergonomics with our companion{" "}
                <Link
                  href="/construction/stair-calculator"
                  className="font-bold text-amber-900 underline hover:text-amber-950 transition-colors"
                >
                  Stair Stringer &amp; Riser Calculator
                </Link>.
              </span>
            </div>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <DeckCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How to Calculate Deck Boards */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. How to Calculate Deck Boards &amp; Linear Footage
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Deck surface boards are calculated by dividing the deck projection (width out from the house) by the effective width of one board plus its expansion gap:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">1. Effective Coverage Width:</p>
                  <p>Effective Width = Actual Width (5.5&quot;) + Gap (3/16&quot;)</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">2. Total Stock Boards Needed:</p>
                  <p>Boards = ⌈(Rows × Length × [1 + Waste]) ÷ Stock Length⌉</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                For a 20&apos; × 14&apos; deck with 16-foot composite boards: 14&apos; projection ÷ 0.474&apos; = <strong>30 rows</strong>. 30 rows × 20&apos; length = 600 linear feet. With 10% waste (660 lin ft) divided by 16&apos; boards = <strong>42 stock boards</strong>.
              </p>
            </section>

            {/* Section 2: Joist Spacing Table */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. IRC Maximum Joist Span Reference Table (IRC Table R507.6)
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Joist Lumber Size</th>
                      <th className="p-3">12&quot; OC Spacing</th>
                      <th className="p-3">16&quot; OC Spacing (Standard)</th>
                      <th className="p-3">24&quot; OC Spacing</th>
                      <th className="p-3">Recommended Deck Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x6 Lumber</td>
                      <td className="p-3">10&apos; 6&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">9&apos; 9&quot;</td>
                      <td className="p-3 text-slate-600">8&apos; 6&quot;</td>
                      <td className="p-3 font-sans text-slate-600">Ground-level small platforms, porches</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x8 Lumber</td>
                      <td className="p-3">13&apos; 10&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">12&apos; 10&quot;</td>
                      <td className="p-3 text-slate-600">11&apos; 2&quot;</td>
                      <td className="p-3 font-sans text-slate-600">Standard 10&apos;–12&apos; projection residential decks</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x10 Lumber</td>
                      <td className="p-3">17&apos; 6&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">16&apos; 5&quot;</td>
                      <td className="p-3 text-slate-600">14&apos; 3&quot;</td>
                      <td className="p-3 font-sans text-slate-600">Large 14&apos;–16&apos; projections, second-story decks</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x12 Lumber</td>
                      <td className="p-3">21&apos; 0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">19&apos; 4&quot;</td>
                      <td className="p-3 text-slate-600">17&apos; 0&quot;</td>
                      <td className="p-3 font-sans text-slate-600">Extra long spans, commercial decks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: 12" OC vs 16" OC Joist Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                3. 12&quot; OC vs. 16&quot; OC Joist Spacing Rules
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Choosing the wrong joist spacing can cause bouncy, sagging deck boards and void manufacturer warranties:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">16&quot; OC (Standard Wood)</h3>
                  <p className="text-slate-600">
                    Standard for pressure-treated pine, cedar, or redwood 5/4x6 and 2x6 boards laid perpendicular ($90^\circ$).
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">12&quot; OC (Composite / Diagonal)</h3>
                  <p className="text-slate-600">
                    Mandatory for composite decking (Trex, TimberTech) and any deck with boards installed at a 45° angle.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">24&quot; OC (Heavy 2x6 Only)</h3>
                  <p className="text-slate-600">
                    Only permitted with structural 2x6 dimensional lumber; strictly prohibited for composite boards.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Sonotube Pier Footings */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                4. Sizing Concrete Pier Footings &amp; Frost Depth
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Deck footings must extend below the regional frost line (typically 36&quot; to 48&quot;) to prevent frost heave:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Pier Concrete Volume = Post Count × [π × (Diameter ÷ 24)² × (Depth ÷ 12)]
              </div>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 pt-2">
                <li><strong>10&quot; Sonotube (36&quot; deep):</strong> 1.64 cu ft per pier (approx. 2.7 bags of 80lb concrete).</li>
                <li><strong>12&quot; Sonotube (36&quot; deep):</strong> 2.36 cu ft per pier (approx. 3.9 bags of 80lb concrete).</li>
                <li><strong>12&quot; Sonotube (48&quot; deep):</strong> 3.14 cu ft per pier (approx. 5.2 bags of 80lb concrete).</li>
              </ul>
            </section>

            {/* Section 5: Picture Frame Border & Blocking */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                5. Picture Frame Borders &amp; Perimeter Blocking
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                A picture frame border gives decks a clean, professional finish but requires additional framing preparation:
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Perimeter Blocking Requirement
                </p>
                <p className="text-slate-700">
                  Because border boards run perpendicular to the field joists on the sides, you must install solid 2x8/2x10 wood blocking between the outer rim joist and the first interior joist to support the picture frame boards.
                </p>
              </div>
            </section>

            {/* Section 6: Hardware & Fasteners */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. Fastener Takeoff: Hidden Clips vs. Face Screws
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Hardware quantities depend on decking material and ledger connections:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>Hidden Fastener Clips:</strong> Sold in 100 sq ft boxes (175–190 clips per box with stainless screws).</li>
                <li><strong>Face Screws (Wood):</strong> Estimate 3.5 screws per sq ft (approx. 350 screws per 5lb box).</li>
                <li><strong>Ledger Lag Screws:</strong> 1/2&quot; × 4-1/2&quot; structural wood screws installed 2 per joist bay staggered 16&quot; OC.</li>
                <li><strong>Joist Hangers:</strong> 1 metal hanger (Simpson LUS28/LUS210) for every field joist attached to the ledger.</li>
              </ul>
            </section>

            {/* Section 7: Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Complete Construction Lifecycle Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Calculate Your Complete Structural Deck Project
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Connect your deck material takeoff seamlessly with footings, stairs, framing, and gravel drainage tools:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/construction/concrete-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Pier Footings
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Concrete Slab &amp; Pier Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate exact ready-mix yards and 60lb/80lb bags for sonotube piers.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Concrete <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/stair-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Deck Stairs
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Stair Stringer &amp; Riser Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate 2x12 stringer cuts, riser heights, and tread depths for deck steps.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Stairs <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/materials/gravel-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Ground Drainage
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Gravel &amp; Aggregate Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Estimate gravel tonnage for drainage under ground-level decks.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Gravel <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                8. Frequently Asked Questions
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
