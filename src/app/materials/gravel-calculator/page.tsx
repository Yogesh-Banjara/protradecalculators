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
import { GravelCalculatorForm } from "@/components/tools/gravel-calculator/gravel-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
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
  title: "Gravel & Aggregate Calculator - Tons",
  description:
    "Free gravel and aggregate calculator to calculate tons, cubic yards, and dump truckloads for driveways, paths, and sub-bases with compaction and waste allowances.",
  path: "/materials/gravel-calculator",
  keywords: [
    "gravel calculator",
    "gravel tonnage calculator",
    "calculate gravel tons",
    "crushed stone calculator",
    "how many tons of gravel",
    "crusher run calculator",
    "gravel driveway calculator",
    "cubic yards to tons gravel",
  ],
});

export default function GravelCalculatorPage() {
  const breadcrumbs = [
    { name: "Materials & Takeoff", url: "/categories/materials" },
    { name: "Gravel & Aggregate Calculator", url: "/materials/gravel-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Gravel & Aggregate Calculator - Tons, Yards & Truckloads",
    "Free gravel and aggregate calculator to calculate tons, cubic yards, and dump truckloads for driveways, paths, and sub-bases with compaction and waste allowances.",
    "/materials/gravel-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Gravel & Aggregate Tonnage Calculator",
    description:
      "Precision calculator for estimating aggregate volume in cubic yards and short tons, dump truckloads, and compaction allowances for driveways, paths, and civil earthworks.",
    url: "/materials/gravel-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Gravel Volume and Tonnage",
    "A step-by-step contractor guide to measuring jobsite dimensions, converting volume to tons, and accounting for compaction.",
    [
      {
        name: "Measure Area Dimensions in Feet",
        text: "Measure the length and width of your driveway, pathway, or patio base in feet.",
      },
      {
        name: "Measure Layer Depth in Inches",
        text: "Determine your layer thickness in inches (e.g. 4 inches) and divide by 12 to convert to feet (4 ÷ 12 = 0.333 ft).",
      },
      {
        name: "Calculate Volume in Cubic Yards",
        text: "Multiply Length (ft) × Width (ft) × Depth (ft) to find cubic feet, then divide by 27 to obtain cubic yards.",
      },
      {
        name: "Convert Cubic Yards to Tons",
        text: "Multiply cubic yards by the material's bulk density (typically 1.35 to 1.55 tons per cubic yard depending on aggregate grade).",
      },
      {
        name: "Add Compaction or Waste Allowance",
        text: "Add 10% to 15% for dense-graded road base that compresses under mechanical rolling, or 5% to 10% for loose gravel spillage.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How many tons of gravel do I need for a standard driveway?",
      answer:
        "For a standard two-car driveway measuring 20 ft wide by 50 ft long with a 4-inch layer of crushed stone, you have 1,000 sq ft × 0.333 ft = 333.3 cu ft (12.35 cu yd). At a typical density of 1.35 tons per cubic yard plus 10% compaction allowance, you will need approximately 18.3 tons of gravel (about 1 tandem dump truckload plus a partial load).",
    },
    {
      question: "How many cubic yards are in a ton of gravel?",
      answer:
        "On average, 1 ton of gravel equals approximately 0.74 cubic yards (or 1 cubic yard equals 1.35 to 1.40 tons). For denser crusher run base with stone dust fines, 1 cubic yard weighs about 1.55 tons (0.65 cu yd per ton). For loose topsoil, 1 cubic yard weighs about 1.08 tons (0.93 cu yd per ton).",
    },
    {
      question: "What is the difference between compaction allowance and waste allowance?",
      answer:
        "Compaction allowance accounts for internal volume loss when dense-graded aggregate (like crusher run or road base) is compacted with a plate tamper or heavy roller, forcing air voids out between particles. Waste allowance accounts for physical material lost on site (gravel spreading beyond borders, pressing into soft uncompacted subgrade, or spillage).",
    },
    {
      question: "How many tons of gravel fit in a standard dump truck?",
      answer:
        "A single-axle dump truck typically hauls 8 to 10 tons (approx. 6 to 7 cubic yards). A standard tandem-axle dump truck hauls 14 to 16 tons (approx. 10 to 12 cubic yards). A tri-axle or large end-dump truck carries 20 to 22 tons (approx. 15 to 17 cubic yards).",
    },
    {
      question: "How deep should gravel be for a driveway vs a walking path?",
      answer:
        "A durable vehicle gravel driveway requires an 8-inch total cross-section: 4 to 6 inches of compacted crusher run / dense grade aggregate sub-base, topped with 2 to 3 inches of clean #57 stone. A walking or garden path requires only 2 to 3 inches of pea gravel or crushed stone over a compacted soil base with geotextile fabric.",
    },
    {
      question: "What is the difference between #57 stone and crusher run?",
      answer:
        "#57 stone is clean, washed crushed rock (about 1/2 inch to 1 inch in size) with zero stone dust fines, providing maximum drainage and a clean surface. Crusher run (also known as DGA, ABC, or road base) contains angular stone mixed with stone dust, allowing it to pack into a hard, cement-like monolithic base for driveways and paver patios.",
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
              <Scale className="h-3.5 w-3.5" />
              Aggregate &amp; Earthwork Takeoff Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Gravel &amp; Aggregate Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate bulk material requirements in <strong>short tons</strong>, <strong>cubic yards</strong>, <strong>cubic feet</strong>, and <strong>dump truckloads</strong> for gravel driveways, crusher run base courses, #57 clean stone, pea gravel paths, and sand beds. Includes material density adjustments and compaction factors.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <GravelCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How to Calculate Gravel Volume */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                1. How to Calculate Gravel Volume
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Calculating bulk aggregate begins with finding the geometric volume of your project area. For rectangular spaces (driveways, walkways, parking areas), use the volume formula:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Volume (cu yd) = [Length (ft) × Width (ft) × Depth (ft)] ÷ 27
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Because depth is almost always specified in inches, divide the depth by 12 first. For example, a 3-inch layer is 3 ÷ 12 = 0.25 feet.
              </p>
            </section>

            {/* Section 2: How Cubic Yards Convert to Tons */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. How Cubic Yards Convert to Tons (The Density Multiplier)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Unlike ready-mix concrete which is ordered by volume (cubic yards), commercial quarries and aggregate suppliers sell gravel, stone, and sand by the <strong>ton (2,000 lbs)</strong> weighed on drive-over scale tickets.
              </p>
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-lg text-sm text-slate-800 space-y-2">
                <p className="font-bold text-amber-950">Standard Conversion Multiplier:</p>
                <p>
                  As a general rule of thumb in civil construction, <strong>1 cubic yard of gravel weighs approximately 1.35 to 1.55 tons</strong> (2,700 to 3,100 lbs). To convert cubic yards to tons, multiply your total cubic yardage by the specific gravity multiplier of your selected material.
                </p>
              </div>
            </section>

            {/* Section 3: Why Aggregate Density Varies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                3. Why Aggregate Density Varies
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                No single density value applies universally across every quarry. Three primary physical factors cause aggregate weight to vary:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">1. Rock Mineralogy</h3>
                  <p className="text-slate-600">
                    Basalt and granite aggregates are significantly denser (~105–115 lb/cu ft) than sedimentary limestone or sandstone (~90–100 lb/cu ft).
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">2. Moisture Content</h3>
                  <p className="text-slate-600">
                    Saturated sand or wet crushed stone holds water within surface voids, increasing scale weight by 5% to 12% compared to dry stockpiles.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">3. Gradation &amp; Fines</h3>
                  <p className="text-slate-600">
                    Clean #57 stone has void spaces between angular rocks, lowering density. Crusher run fills those voids with stone dust, increasing density.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Recommended Depth Standards */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                4. Recommended Depth Standards by Application
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Application</th>
                      <th className="p-3">Recommended Material</th>
                      <th className="p-3">Recommended Depth</th>
                      <th className="p-3">Compaction Needed?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Driveway Sub-Base (Foundation)</td>
                      <td className="p-3 text-slate-600">Crusher Run / Dense Grade Base</td>
                      <td className="p-3 font-mono font-bold text-amber-700">4&quot; – 6&quot;</td>
                      <td className="p-3 text-emerald-700 font-bold">Yes (12–15% allowance)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Driveway Surface Wearing Course</td>
                      <td className="p-3 text-slate-600">#57 Clean Stone or 3/4&quot; Gravel</td>
                      <td className="p-3 font-mono font-bold text-amber-700">2&quot; – 3&quot;</td>
                      <td className="p-3 text-slate-600">Moderate (5–8% waste)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Walking Paths &amp; Garden Walkways</td>
                      <td className="p-3 text-slate-600">Pea Gravel / River Rock / Decomposed Granite</td>
                      <td className="p-3 font-mono font-bold text-amber-700">2&quot; – 3&quot;</td>
                      <td className="p-3 text-slate-600">Low (5% waste)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Concrete Slab Sub-Base Cushion</td>
                      <td className="p-3 text-slate-600">#57 Clean Crushed Stone or Sand</td>
                      <td className="p-3 font-mono font-bold text-amber-700">4&quot;</td>
                      <td className="p-3 text-emerald-700 font-bold">Yes (Compacted base)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Waste vs Compaction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                5. Compaction vs. Waste: The Crucial Difference
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Compaction Allowance (Shrinkage)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p>
                      When dense graded road base or crusher run is delivered loose in a truck, it contains 20% to 30% air voids. When spread and compacted with a vibratory roller, the fine particles settle into empty spaces, <strong>shrinking loose volume by 10% to 15%</strong>.
                    </p>
                    <p className="text-slate-800 font-semibold pt-1">
                      If you order without a compaction allowance, your final base will end up thinner than planned.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Waste &amp; Spillage Allowance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p>
                      Clean washed rock (like pea gravel or #57 stone) does not compact significantly. However, material is lost during spreading: stones get pressed into soft dirt subgrade, spill over landscape borders, and get trapped in corners.
                    </p>
                    <p className="text-slate-800 font-semibold pt-1">
                      Add a 5% to 10% waste allowance to ensure complete surface coverage.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 6: Dump Truckload Sizing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="h-6 w-6 text-amber-600" />
                6. How to Estimate Dump Truckloads
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Quarries and haulers deliver bulk aggregate using three standard dump truck configurations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Single-Axle Dump Truck</h3>
                  <p className="text-slate-600 font-mono font-bold text-amber-700">8 – 10 Tons Capacity</p>
                  <p className="text-slate-500">
                    Ideal for tight residential driveways and small alleyways where heavy trucks cannot maneuver.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Tandem-Axle Dump Truck</h3>
                  <p className="text-slate-600 font-mono font-bold text-amber-700">14 – 16 Tons Capacity</p>
                  <p className="text-slate-500">
                    The industry standard residential workhorse. Most common truck for driveways and home projects.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Tri-Axle / End Dump Truck</h3>
                  <p className="text-slate-600 font-mono font-bold text-amber-700">20 – 22 Tons Capacity</p>
                  <p className="text-slate-500">
                    Best price per ton for large commercial parking lots, agricultural roads, and long driveways.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Gravel vs Crushed Stone */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                7. Natural Gravel vs. Crushed Stone
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Although often used interchangeably, natural gravel and crushed stone perform very differently under load:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Crushed Stone (Angular):</strong> Mechanically crushed bedrock resulting in sharp, jagged edges. When rolled, the angular faces interlock tightly, creating a stable, unshifting surface suitable for vehicles.
                </li>
                <li>
                  <strong>Natural Gravel / Pea Gravel (Rounded):</strong> Eroded naturally by river or glacial action, resulting in smooth rounded surfaces. Rounded stones slide past each other like ball bearings under car tires, making them ideal for decorative paths and drainage, but poor for heavy vehicle traction.
                </li>
              </ul>
            </section>

            {/* Section 8: Common Driveway Mistakes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                8. Common Driveway Calculation Mistakes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">1. Forgetting Geotextile Fabric</h3>
                  <p className="text-red-900/80">
                    Placing crushed stone directly on soft mud allows stone to sink over time, requiring double the material within two years.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">2. Layering Too Deep at Once</h3>
                  <p className="text-red-900/80">
                    Compacting more than 4 inches of base material in a single lift prevents bottom compaction. Spread in 3-inch lifts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
                  <h3 className="font-bold text-red-950">3. Buying Retail Bags for Large Pours</h3>
                  <p className="text-red-900/80">
                    Purchasing 40 bags of stone at home centers costs 3× more than ordering 1 ton delivered in bulk by a local hauler.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Irregular Area Measuring */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                9. How to Measure Irregular or Curving Paths
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                For meandering garden walkways or curved driveways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Centerline Length:</strong> Measure along the centerline curve using a rolling measuring wheel or flexible garden hose.
                </li>
                <li>
                  <strong>Average Width:</strong> Measure width at 5 to 10 equal intervals along the path and calculate the average width.
                </li>
                <li>
                  <strong>Decompose Multi-Section Layouts:</strong> Enter the main parking turn-around as Section 1, the driveway lane as Section 2, and side walkways as Section 3 in the calculator above.
                </li>
              </ul>
            </section>

            {/* Section 10: Concrete Sub-Base Cross-Link */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Related Trade Calculator
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Pouring a Concrete Slab Over Your Compacted Base?
                  </h3>
                  <p className="text-sm text-slate-300 max-w-2xl">
                    Use our precision <strong>Concrete Calculator</strong> to estimate ready-mix cubic yards, multi-section slab volumes, and 80 lb bag counts with trade waste allowances.
                  </p>
                </div>
                <Link
                  href="/construction/concrete-calculator"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shrink-0 transition-colors shadow"
                >
                  Concrete Calculator <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Section 11: Frequently Asked Questions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                11. Frequently Asked Questions
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
