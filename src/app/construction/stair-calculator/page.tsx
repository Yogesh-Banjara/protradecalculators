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
import { StairCalculatorForm } from "@/components/tools/stair-calculator/stair-form";
import {
  TrendingUp,
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
  title: "Stair Calculator - Rise & Run Layout",
  description:
    "Free stair calculator to calculate exact riser height, tread depth, total run, stringer cut layout, bottom riser drop, headroom, and IRC code rules.",
  path: "/construction/stair-calculator",
  keywords: [
    "stair calculator",
    "stair stringer calculator",
    "how to calculate stair risers",
    "stair rise and run calculator",
    "stair stringer layout",
    "stair headroom calculator",
    "2x12 stringer length",
    "stair riser height",
  ],
});

export default function StairCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Stair Stringer & Riser Calculator", url: "/construction/stair-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Stair Calculator - Stringer Layout, Rise & Run, Riser Height",
    "Free stair calculator to calculate exact riser height, tread depth, total run, stringer cut layout, bottom riser drop, headroom, and IRC code rules.",
    "/construction/stair-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Stair Stringer & Riser Layout Calculator",
    description:
      "Contractor stair framing utility for calculating exact riser heights, tread depths, stringer cut layouts, bottom tread drops, headroom clearance, and IRC building code prescriptive limits.",
    url: "/construction/stair-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate and Cut Stair Stringers",
    "A carpenter guide to laying out stair stringers, calculating rise and run, making bottom riser deductions, and checking building code limits.",
    [
      {
        name: "Measure Total Vertical Rise",
        text: "Measure the exact vertical distance from the finished lower floor surface to the finished upper floor level.",
      },
      {
        name: "Calculate Number of Risers and Exact Riser Height",
        text: "Divide total rise by your target riser height (typically 7.5 inches) and round to the nearest whole integer. Divide total rise by this riser count to find the exact riser height.",
      },
      {
        name: "Determine Tread Depth and Total Run",
        text: "Select a standard tread depth meeting typical IRC provisions (minimum 10 inches, standard 10.5 inches). Multiply tread depth by number of treads (risers minus 1) to calculate total stair run.",
      },
      {
        name: "Cut the Bottom of the Stringer (Tread Drop)",
        text: "Deduct the thickness of one tread board (minus lower finished flooring thickness) from the bottom of the stringer so the first step matches all intermediate steps.",
      },
      {
        name: "Layout Stringer with Framing Square and Stair Gauges",
        text: "Clamp stair gauges onto your framing square at the exact riser height on the tongue and exact tread depth on the blade, tracing each sawtooth step along the 2x12 lumber.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do I calculate the number of risers for stairs?",
      answer:
        "Measure your total vertical rise in inches (finished floor to finished floor). Divide total rise by 7.5 (the standard target riser height) and round to the nearest whole number. For example, a 108-inch rise divided by 7.5 equals 14.4, which rounds to 14 risers. Dividing 108 inches by 14 risers gives an exact riser height of 7.714 inches (7-11/16\").",
    },
    {
      question: "What is the maximum riser height allowed by residential building codes?",
      answer:
        "Under the International Residential Code (IRC Section R311.7.5.1), the maximum riser height for residential stairs is 7-3/4 inches (7.75\"). The minimum riser height is 4 inches. Additionally, the greatest riser height within any flight of stairs must not exceed the smallest riser height by more than 3/8 inch (0.375\"). Commercial stairs under the IBC limit risers to 7.0 inches maximum.",
    },
    {
      question: "Why do you cut the bottom of a stair stringer?",
      answer:
        "When you install tread boards onto a notched stringer, the tread thickness adds height to every step. If you do not cut the thickness of the tread off the very bottom of the stringer, your first bottom step will be too tall by the tread thickness (e.g. 1 inch higher), while your top step will be too short. Deducting tread thickness (minus lower finished flooring) from the stringer base ensures every single step is identical.",
    },
    {
      question: "What is the 2R + T stair comfort rule (Blondel's Rule)?",
      answer:
        "The 2R + T rule (originating from architect François Blondel) states that two times the riser height plus one tread depth should equal between 24 and 25 inches (2R + T = 24\" to 25\"). This formula mirrors natural human walking ergonomics. For example: 2 × 7.5\" riser + 10\" tread = 25\" (ideal comfort).",
    },
    {
      question: "How much headroom clearance is required over stairs?",
      answer:
        "The IRC (Section R311.7.2) requires a minimum vertical headroom clearance of 80 inches (6 feet 8 inches). Headroom is measured vertically from the sloped plane connecting all tread nosings to the lowest point of the ceiling or wellhole opening header above.",
    },
    {
      question: "How many stair stringers do I need for a 36-inch or 48-inch wide staircase?",
      answer:
        "For standard 2x lumber or 5/4 wood treads, stringers should be spaced no more than 16 inches on center. A standard 36-inch wide staircase requires 3 stringers (left, center, right). A 48-inch wide staircase requires 4 stringers. For composite decking treads, stringers must be spaced at 12 inches on center.",
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
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <TrendingUp className="h-3.5 w-3.5" />
              Stair Framing &amp; Stringer Layout Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Stair Stringer &amp; Riser Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate exact <strong>riser height</strong>, <strong>tread depth</strong>, <strong>total run</strong>, <strong>stringer board lengths (2x12)</strong>, <strong>bottom riser drop cuts</strong>, <strong>headroom clearance</strong>, and <strong>IRC building code prescriptive limits</strong>.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <StairCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: The Stair Rise and Run Formula */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. The Golden Formula for Stair Rise and Run
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Stair layout begins with an exact measurement of the total vertical rise from finished lower floor to finished upper floor. The step-by-step mathematical algorithm is:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">1. Riser Count Formula:</p>
                  <p>Riser Count = round(Total Rise ÷ 7.5&quot;)</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">2. Exact Riser Height Formula:</p>
                  <p>Exact Riser Height = Total Rise ÷ Riser Count</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                For a standard 9-foot ceiling with joists and subfloor (108-inch total rise): 108 ÷ 7.5 = 14.4 → <strong>14 risers</strong>. The exact riser height is 108 ÷ 14 = <strong>7.714 inches (7-11/16&quot;)</strong>.
              </p>
            </section>

            {/* Section 2: IRC Building Code Standards Table */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Residential Stair Building Code Rules (IRC Section R311.7)
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Stair Parameter</th>
                      <th className="p-3">IRC Residential Code</th>
                      <th className="p-3">IBC Commercial Code</th>
                      <th className="p-3">Trade Purpose / Safety Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Maximum Riser Height</td>
                      <td className="p-3 text-amber-800 font-bold">7-3/4&quot; (7.75&quot;)</td>
                      <td className="p-3 text-slate-700">7.0&quot; Max</td>
                      <td className="p-3 font-sans text-slate-600">Prevents fatigue and tripping hazards when ascending</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Minimum Riser Height</td>
                      <td className="p-3 text-slate-700">4.0&quot; Min</td>
                      <td className="p-3 text-slate-700">4.0&quot; Min</td>
                      <td className="p-3 font-sans text-slate-600">Ensures visible step transitions</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Minimum Tread Depth</td>
                      <td className="p-3 text-amber-800 font-bold">10.0&quot; Min</td>
                      <td className="p-3 text-slate-700">11.0&quot; Min</td>
                      <td className="p-3 font-sans text-slate-600">Ensures full adult foot support when descending</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Minimum Headroom</td>
                      <td className="p-3 text-amber-800 font-bold">80.0&quot; (6&apos; 8&quot;)</td>
                      <td className="p-3 text-slate-700">84.0&quot; (7&apos; 0&quot;)</td>
                      <td className="p-3 font-sans text-slate-600">Prevents head impact on ceiling wellhole header</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Maximum Step Variation</td>
                      <td className="p-3 text-slate-700">3/8&quot; (0.375&quot;)</td>
                      <td className="p-3 text-slate-700">3/8&quot; Max</td>
                      <td className="p-3 font-sans text-slate-600">Uniform step rhythm across the entire flight of stairs</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Minimum Clear Width</td>
                      <td className="p-3 text-slate-700">36.0&quot; Min</td>
                      <td className="p-3 text-slate-700">44.0&quot; Min</td>
                      <td className="p-3 font-sans text-slate-600">Emergency egress clearance for occupants</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Reference Table: Common Ceiling & Deck Heights */}
            <section className="space-y-4 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Ruler className="h-4 w-4 text-amber-600" />
                  <span>Jobsite Layout Quick Reference</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Common Ceiling &amp; Deck Height Stair Stringer Table
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pre-calculated stringer cut specifications, riser counts, tread runs, and 2x12 lumber lengths for standard residential floor and outdoor deck heights:
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Application / Floor Height</th>
                      <th className="p-3">Total Rise</th>
                      <th className="p-3">Riser Count</th>
                      <th className="p-3">Riser Height</th>
                      <th className="p-3">Tread Depth</th>
                      <th className="p-3">Treads (Run Steps)</th>
                      <th className="p-3">Total Run</th>
                      <th className="p-3">2x12 Stringer Stock</th>
                      <th className="p-3">IRC Code Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">3 ft Porch / Low Deck</td>
                      <td className="p-3">36.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">5 Risers</td>
                      <td className="p-3">7.20&quot; (7-3/16&quot;)</td>
                      <td className="p-3">10.5&quot;</td>
                      <td className="p-3">4 Treads</td>
                      <td className="p-3">42.0&quot; (3&apos; 6&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">6 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (&le; 7-3/4&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">4 ft Deck / Landing</td>
                      <td className="p-3">48.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">7 Risers</td>
                      <td className="p-3">6.86&quot; (6-7/8&quot;)</td>
                      <td className="p-3">10.5&quot;</td>
                      <td className="p-3">6 Treads</td>
                      <td className="p-3">63.0&quot; (5&apos; 3&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">8 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (&le; 7-3/4&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">5 ft Elevated Deck</td>
                      <td className="p-3">60.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">8 Risers</td>
                      <td className="p-3">7.50&quot; (7-1/2&quot;)</td>
                      <td className="p-3">10.5&quot;</td>
                      <td className="p-3">7 Treads</td>
                      <td className="p-3">73.5&quot; (6&apos; 1-1/2&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">10 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (&le; 7-3/4&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">8 ft Ceiling (Standard Story)</td>
                      <td className="p-3">108.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">14 Risers</td>
                      <td className="p-3">7.71&quot; (7-11/16&quot;)</td>
                      <td className="p-3">10.0&quot;</td>
                      <td className="p-3">13 Treads</td>
                      <td className="p-3">130.0&quot; (10&apos; 10&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">16 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (&le; 7-3/4&quot;)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">9 ft Modern Ceiling</td>
                      <td className="p-3">120.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">16 Risers</td>
                      <td className="p-3">7.50&quot; (7-1/2&quot;)</td>
                      <td className="p-3">10.5&quot;</td>
                      <td className="p-3">15 Treads</td>
                      <td className="p-3">157.5&quot; (13&apos; 1-1/2&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">18 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (Optimal Comfort)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans text-slate-900">10 ft Tall Ceiling</td>
                      <td className="p-3">132.0&quot;</td>
                      <td className="p-3 text-amber-800 font-bold">18 Risers</td>
                      <td className="p-3">7.33&quot; (7-5/16&quot;)</td>
                      <td className="p-3">10.5&quot;</td>
                      <td className="p-3">17 Treads</td>
                      <td className="p-3">178.5&quot; (14&apos; 10-1/2&quot;)</td>
                      <td className="p-3 font-sans text-slate-700">20 ft 2x12</td>
                      <td className="p-3 font-sans text-emerald-700 font-bold">Compliant (Optimal Comfort)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Why Cut the Bottom of the Stringer */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                3. Why You Must Cut the Bottom of a Stair Stringer
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                The most common mistake made in stair framing is forgetting to deduct the tread thickness from the bottom of the stringer:
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Bottom Stringer Cut (The Drop) = Tread Thickness − Lower Finished Flooring Thickness
                </p>
                <p className="text-slate-700">
                  When you attach a 1-inch tread board onto a cut stringer, it raises the height of that step by 1 inch. For all middle steps, the tread above and the tread below both increase by 1 inch, canceling out. But for the very first step, the floor beneath it doesn&apos;t move! Therefore, you must saw <strong>1 inch off the bottom of the stringer</strong> before setting it on the floor.
                </p>
              </div>
            </section>

            {/* Section 4: The 2R + T Comfort Rule */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                4. The 2R + T Stair Ergonomics &amp; Comfort Rule
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Stairs with risers and treads within prescriptive code limits can still feel awkward if the proportion does not match human gait stride:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Comfort Rule: 2 × Riser Height + Tread Depth = 24&quot; to 25&quot;
              </div>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 pt-2">
                <li><strong>7.5&quot; Riser + 10&quot; Tread:</strong> 2(7.5) + 10 = 25.0&quot; (Ideal standard residential stair).</li>
                <li><strong>7.0&quot; Riser + 11&quot; Tread:</strong> 2(7.0) + 11 = 25.0&quot; (Ideal commercial / gentle slope stair).</li>
                <li><strong>6.0&quot; Riser + 12&quot; Tread:</strong> 2(6.0) + 12 = 24.0&quot; (Outdoor garden / shallow porch stair).</li>
              </ul>
            </section>

            {/* Section 5: Stringer Spacing & Sizing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                5. How Many Stringers Do You Need? (Spacing &amp; Sizing)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Stringer quantity is dictated by stair width and tread material deflection:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">36&quot; Standard Stair</h3>
                  <p className="text-amber-800 font-bold font-mono">3 Stringers (16&quot; OC)</p>
                  <p className="text-slate-600">
                    Two outer stringers and one center supporting stringer for 5/4 or 2x wood treads.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">48&quot; Wide Stair</h3>
                  <p className="text-amber-800 font-bold font-mono">4 Stringers (16&quot; OC)</p>
                  <p className="text-slate-600">
                    Prevents center tread flexing when two people pass on the stairs simultaneously.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">Composite Deck Treads</h3>
                  <p className="text-amber-800 font-bold font-mono">12&quot; OC Spacing</p>
                  <p className="text-slate-600">
                    Composite materials are more flexible than wood and require 12-inch maximum spacing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Headroom Clearance Math */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. How to Calculate Ceiling Wellhole Headroom Clearance
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                To guarantee 80 inches of vertical headroom, the ceiling opening length must be calculated properly:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Minimum Wellhole Length = Total Run − (Steps Required to Reach 80&quot; Clearance × Tread Depth)
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                As you descend, your head must clear the overhead floor header. For standard 9-foot ceilings, the opening typically requires at least <strong>10 to 11 feet (120&quot; to 132&quot;)</strong> of clear wellhole length.
              </p>
            </section>

            {/* Section 7: Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Complete Construction Lifecycle Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Calculate Your Complete Structural Framing Project
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Connect your stair stringer layout seamlessly with wall framing, roof pitch, and concrete foundation tools:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/construction/framing-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Wall Framing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Wall Stud &amp; Plate Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate 16&quot;/24&quot; OC studs, top plates, headers, and board feet.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Framing <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/roof-pitch-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Roof Framing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Roof Pitch &amp; Rafter Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate pitch angles, common rafter lengths, birdsmouth cuts, and squares.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Roof <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/materials/drywall-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Interior Finishing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Drywall &amp; Sheet Goods Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Estimate 4x8/4x12 sheets, joint compound mud, tape, and screws for stairwells.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Drywall <ArrowRight className="h-4 w-4 ml-1" />
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
