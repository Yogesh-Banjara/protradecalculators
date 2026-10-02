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
import { ConcreteCalculatorForm } from "@/components/tools/concrete-calculator/concrete-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Ruler,
  HelpCircle,
  AlertTriangle,
  Layers,
  Scale,
  CheckCircle2,
  Truck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Concrete Calculator - Slabs, Sonotubes & Footings in Yards",
  description:
    "Free concrete calculator for slabs, Sonotubes, cylindrical piers, and footings. Calculate cubic yards, cubic feet, and 60lb/80lb bag counts with multi-section takeoff.",
  path: "/construction/concrete-calculator",
  keywords: [
    "concrete calculator",
    "calculator for concrete footings",
    "concrete footing calculator",
    "sonotube concrete calculator",
    "concrete yardage for sonotube",
    "sonotube yardage calculator",
    "concrete slab calculator",
    "how many bags of concrete",
    "concrete yardage calculator",
    "concrete weight calculator",
  ],
});

export default function ConcreteCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Concrete Calculator", url: "/construction/concrete-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Concrete Calculator - Slabs, Footings & Columns in Yards",
    "Free concrete calculator to calculate cubic yards, cubic feet, and 40lb/60lb/80lb bags for slabs, footings, and round piers with multi-section project takeoff and custom waste factors.",
    "/construction/concrete-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Concrete Calculator & Multi-Section Estimator",
    description:
      "Precision calculator for estimating ready-mix concrete volume in cubic yards, cubic feet, cubic meters, and premixed bag counts for slabs, footings, and columns.",
    url: "/construction/concrete-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Concrete Volume in Cubic Yards",
    "A step-by-step guide to measuring your jobsite dimensions and calculating total ready-mix concrete required.",
    [
      {
        name: "Measure Slab Length and Width",
        text: "Measure the length and width of your pour area in feet using a tape measure.",
      },
      {
        name: "Measure Thickness and Convert to Feet",
        text: "Measure the thickness in inches and divide by 12 to convert to feet (e.g. 4 inches ÷ 12 = 0.333 feet).",
      },
      {
        name: "Calculate Volume in Cubic Feet",
        text: "Multiply Length (ft) × Width (ft) × Thickness (ft) to calculate volume in cubic feet.",
      },
      {
        name: "Convert Cubic Feet to Cubic Yards",
        text: "Divide total cubic feet by 27 (the number of cubic feet in 1 cubic yard).",
      },
      {
        name: "Add 10% Waste Factor",
        text: "Multiply by 1.10 to add a 10% safety margin for uneven subgrade and form deflection.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do I calculate how many cubic yards of concrete I need?",
      answer:
        "Multiply the length (in feet) by the width (in feet) by the thickness (in feet) to find total cubic feet, then divide by 27. For example, a 10 ft × 10 ft slab at 4 inches thick (0.333 ft) is 10 × 10 × 0.333 = 33.33 cubic feet. Dividing by 27 gives 1.23 cubic yards. Adding 10% waste equals approximately 1.35 cubic yards.",
    },
    {
      question: "How many 80 lb bags of concrete make 1 cubic yard?",
      answer:
        "It takes 45 bags of 80 lb concrete mix to yield 1 cubic yard (27 cu ft ÷ 0.60 cu ft per bag = 45 bags). For 60 lb bags (0.45 cu ft yield), it requires 60 bags per cubic yard. For 50 lb bags (0.375 cu ft yield), it requires 72 bags per cubic yard.",
    },
    {
      question: "How thick should a concrete patio, sidewalk, or driveway slab be?",
      answer:
        "Standard sidewalks and residential patios are typically poured 4 inches thick (using 2×4 form boards). Residential driveways and garage slabs supporting passenger vehicles should be 4 to 5 inches thick with rebar or wire mesh reinforcement. Heavy-duty truck driveways, RV pads, and equipment slabs should be 6 inches thick.",
    },
    {
      question: "Why should I add 5% to 10% waste to my concrete order?",
      answer:
        "Excavations are rarely laser-flat. Sub-base variations of just 1/4 inch across a large slab, formwork bowing outward under the hydrostatic pressure of wet concrete, spillage, and concrete left in pump truck lines will quickly consume 5% to 10% more material than nominal plan dimensions. Running short during a pour results in costly cold joints.",
    },
    {
      question: "When should I order ready-mix concrete instead of mixing bags?",
      answer:
        "As a rule of thumb, projects requiring 1 cubic yard (approx. 45 eighty-pound bags) or more are significantly faster, more consistent, and structurally superior when ordered from a ready-mix batch plant. Projects under 1 cubic yard (such as mailbox posts, small steps, or minor footing patches) are usually more economical with premixed bags due to truck short-load delivery fees.",
    },
    {
      question: "How do I calculate concrete for round post holes or sonotubes?",
      answer:
        "Use the cylinder volume formula: π × radius² × depth. Divide the diameter in inches by 2 to get the radius, convert all dimensions to feet, multiply π × r² × depth in feet, and divide by 27 for cubic yards. For example, a 12-inch diameter hole (radius = 0.5 ft) that is 3 feet deep requires 3.1416 × 0.25 × 3 = 2.36 cubic feet (about 0.087 cubic yards, or 4 eighty-pound bags).",
    },
  ];

  const faqSchema = buildFaqSchema(faqItems);

  return (
    <>
      <JsonLd schema={[pageSchema, softwareAppSchema, howToSchema, faqSchema]} />

      <div className="py-8 sm:py-10 space-y-12">
        <Container>
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={breadcrumbs} />

          {/* Above the Fold: Header & Intro */}
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <Calculator className="h-3.5 w-3.5" />
              Construction Material Takeoff Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Concrete Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate ready-mix concrete volume in <strong>cubic yards</strong>, <strong>cubic feet</strong>, and <strong>cubic meters</strong>, plus premixed bag counts (40lb, 50lb, 60lb, 80lb) for slabs, footings, and round piers. Add multiple project sections to compute a complete combined jobsite takeoff.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <ConcreteCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: What the Calculator Does */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                1. What the Concrete Calculator Does
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                This utility solves one of the most common and expensive trade problems: accurately estimating ready-mix concrete delivery volume and bagged concrete counts without running short on the jobsite or over-ordering costly surplus.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Unlike simple single-rectangle calculators, our engine allows you to model <strong>complex multi-section projects</strong> in a single worksheet. For example, you can calculate a patio slab (Section 1), a continuous perimeter footing (Section 2), and four round post piers (Section 3) simultaneously to produce a single combined ready-mix order recommendation.
              </p>
            </section>

            {/* Section 2: Mathematical Formulas */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                2. How to Calculate Concrete Volume: Core Formulas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rectangular Slabs &amp; Continuous Footings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <p className="font-mono bg-slate-100 p-2 rounded font-bold text-slate-900">
                      Volume (cu ft) = Length (ft) × Width (ft) × Thickness (ft)
                    </p>
                    <p className="font-mono bg-slate-100 p-2 rounded font-bold text-slate-900">
                      Volume (cu yd) = Volume (cu ft) ÷ 27
                    </p>
                    <p className="text-slate-600 text-xs pt-1">
                      Always convert thickness from inches to feet first by dividing by 12 (e.g. 4&quot; ÷ 12 = 0.333 ft).
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Round Columns, Post Holes &amp; Sonotubes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <p className="font-mono bg-slate-100 p-2 rounded font-bold text-slate-900">
                      Volume (cu ft) = π × Radius² (ft) × Depth (ft)
                    </p>
                    <p className="font-mono bg-slate-100 p-2 rounded font-bold text-slate-900">
                      Radius = Diameter (ft) ÷ 2
                    </p>
                    <p className="text-slate-600 text-xs pt-1">
                      For a 12&quot; hole (1 ft diameter, 0.5 ft radius), radius squared is 0.25 sq ft.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 3: Cubic Feet vs Cubic Yards */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                3. Cubic Feet vs. Cubic Yards: The 27 Rule
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                In North American construction, commercial ready-mix concrete is sold exclusively by the <strong>cubic yard (yd³)</strong>, while measurements are taken in feet and inches.
              </p>
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-lg text-sm text-slate-800 space-y-2">
                <p className="font-bold text-amber-950">Why do you divide cubic feet by 27?</p>
                <p>
                  1 linear yard = 3 feet. Therefore, a 1-yard cube measures 3 ft × 3 ft × 3 ft = <strong>27 cubic feet</strong>. When you calculate volume in cubic feet, you must always divide by 27 to determine how many cubic yards to order from the concrete supplier.
                </p>
              </div>
            </section>

            {/* Section 4: Recommended Waste Factor Table */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                4. How Much Waste Percentage Should You Add?
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Ordering the exact mathematical volume almost always leads to a shortage. Physical jobsite conditions require ordering surplus based on your project type:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Project Type &amp; Condition</th>
                      <th className="p-3">Recommended Waste</th>
                      <th className="p-3">Reasoning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Standard Slab on Laser-Graded Base</td>
                      <td className="p-3 font-mono font-bold text-amber-700">5%</td>
                      <td className="p-3 text-slate-600">Smooth, well-compacted crushed stone base with stiff form boards.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Driveways, Patios, Garage Floors (Standard)</td>
                      <td className="p-3 font-mono font-bold text-amber-700">10%</td>
                      <td className="p-3 text-slate-600">Standard trade rule. Compensates for uneven subgrade and form deflection.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Earthen Trenches &amp; Rough Footings</td>
                      <td className="p-3 font-mono font-bold text-amber-700">12% – 15%</td>
                      <td className="p-3 text-slate-600">Irregular trench sidewalls, soil over-excavation, and root voids.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Long Pump Line or Boom Placements</td>
                      <td className="p-3 font-mono font-bold text-amber-700">+0.5 to 1.0 yd³</td>
                      <td className="p-3 text-slate-600">Concrete retained inside pump hopper and delivery pipelines.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Sonotube & Cylindrical Footing Reference Table */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                5. Sonotube &amp; Cylindrical Footing Yardage Chart (Per Tube)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Use this reference table to quickly determine the exact volume in cubic feet, cubic yards, and 80lb/60lb premixed bags required per Sonotube or drilled pier footing across standard frost-line depths ($V = \pi \times r^2 \times h$):
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tube Diameter</th>
                      <th className="p-3">Depth (Frost Line)</th>
                      <th className="p-3 font-mono">Volume (Cu Ft)</th>
                      <th className="p-3 font-mono">Volume (Cu Yd)</th>
                      <th className="p-3 font-mono">80 lb Bags</th>
                      <th className="p-3 font-mono">60 lb Bags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold">8″ (0.67 ft)</td>
                      <td className="p-3">36″ (3.0 ft)</td>
                      <td className="p-3 font-mono">1.05 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.039 yd³</td>
                      <td className="p-3 font-mono">2 bags</td>
                      <td className="p-3 font-mono">3 bags</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">8″ (0.67 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">1.40 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.052 yd³</td>
                      <td className="p-3 font-mono">3 bags</td>
                      <td className="p-3 font-mono">4 bags</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">10″ (0.83 ft)</td>
                      <td className="p-3">36″ (3.0 ft)</td>
                      <td className="p-3 font-mono">1.64 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.061 yd³</td>
                      <td className="p-3 font-mono">3 bags</td>
                      <td className="p-3 font-mono">4 bags</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">10″ (0.83 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">2.18 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.081 yd³</td>
                      <td className="p-3 font-mono">4 bags</td>
                      <td className="p-3 font-mono">5 bags</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-900">12″ (1.00 ft)</td>
                      <td className="p-3">36″ (3.0 ft)</td>
                      <td className="p-3 font-mono">2.36 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.087 yd³</td>
                      <td className="p-3 font-mono">4 bags</td>
                      <td className="p-3 font-mono">6 bags</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-900">12″ (1.00 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">3.14 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.116 yd³</td>
                      <td className="p-3 font-mono">6 bags</td>
                      <td className="p-3 font-mono">7 bags</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold">14″ (1.17 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">4.28 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.158 yd³</td>
                      <td className="p-3 font-mono">8 bags</td>
                      <td className="p-3 font-mono">10 bags</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold">16″ (1.33 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">5.59 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.207 yd³</td>
                      <td className="p-3 font-mono">10 bags</td>
                      <td className="p-3 font-mono">13 bags</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">18″ (1.50 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">7.07 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.262 yd³</td>
                      <td className="p-3 font-mono">12 bags</td>
                      <td className="p-3 font-mono">16 bags</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">24″ (2.00 ft)</td>
                      <td className="p-3">48″ (4.0 ft)</td>
                      <td className="p-3 font-mono">12.57 cu ft</td>
                      <td className="p-3 font-mono font-bold text-amber-700">0.465 yd³</td>
                      <td className="p-3 font-mono">21 bags</td>
                      <td className="p-3 font-mono">28 bags</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Measuring Irregular Shapes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. How to Measure an Irregular Project Layout
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                If your patio or driveway is L-shaped, T-shaped, or curved:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Decompose into Simple Rectangles:</strong> Divide complex shapes into individual rectangular blocks. Add each block as a separate section in the calculator above.
                </li>
                <li>
                  <strong>Curved Borders:</strong> Treat curved edges as partial circles or approximate with average width across equal intervals (Simpson&apos;s rule).
                </li>
                <li>
                  <strong>Thickened Edges / Monolithic Slabs:</strong> Calculate the main slab area as Section 1 (e.g. 4&quot; thick), and calculate the thickened perimeter footing trench as Section 2.
                </li>
              </ul>
            </section>

            {/* Section 7: Common Measurement Mistakes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                7. Common Concrete Takeoff Mistakes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">1. Mixed Unit Multiplying</h3>
                  <p className="text-red-900/80">
                    Multiplying 10 ft × 10 ft × 4 inches = 400 (wrong!). Thickness must always be converted to feet (4 ÷ 12 = 0.333 ft) first.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">2. Formwork Bowing</h3>
                  <p className="text-red-900/80">
                    Wet concrete exerts heavy lateral hydraulic pressure. Inadequately staked 2×4 forms bulge outward, increasing required volume.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">3. Ignoring Slope &amp; Swales</h3>
                  <p className="text-red-900/80">
                    If subgrade isn&apos;t graded at the same slope as finished top concrete, slab thickness will vary, requiring extra material.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Ready-Mix vs Bagged Concrete */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="h-6 w-6 text-amber-600" />
                8. Ready-Mix Truck Delivery vs. Bagged Concrete Mix
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-600" />
                      Ready-Mix Concrete (Truck Delivery)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Best for:</strong> Pours 1.0 cubic yard or larger (patios, driveways, foundations).</p>
                    <p><strong>Pros:</strong> Consistent ASTM C94 mix quality, poured in minutes, minimal manual mixing labor.</p>
                    <p><strong>Watch out for:</strong> Short-load delivery fees on orders under 4–5 cubic yards, and rigid 90-minute discharge time windows.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-600" />
                      Premixed Bagged Concrete (Quikrete / Sakrete)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Best for:</strong> Pours under 1.0 cubic yard (fence posts, deck footings, small steps).</p>
                    <p><strong>Pros:</strong> Available on demand from home centers, mix only what you need, no truck access required.</p>
                    <p><strong>Watch out for:</strong> Physical labor (mixing 45 eighty-pound bags by hand equals 3,600 lbs of lifting).</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 8: Sub-Base Aggregate Cross-Link */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Related Trade Estimator
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Need Crushed Stone or Gravel for Your Slab Base?
                  </h3>
                  <p className="text-sm text-slate-300 max-w-2xl">
                    Every long-lasting slab requires a 4-inch compacted gravel or #57 crushed stone cushion. Use our <strong>Gravel &amp; Aggregate Calculator</strong> to estimate tons, cubic yards, and dump truckloads with compaction factors.
                  </p>
                </div>
                <Link
                  href="/materials/gravel-calculator"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shrink-0 transition-colors shadow"
                >
                  Gravel Calculator <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                9. Frequently Asked Questions
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
