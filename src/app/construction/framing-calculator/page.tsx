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
import { FramingCalculatorForm } from "@/components/tools/framing-calculator/framing-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Hammer,
  Ruler,
  HelpCircle,
  AlertTriangle,
  Layers,
  Scale,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Wall Framing & Stud Calculator",
  description:
    "Free wall framing calculator to estimate 16\" and 24\" on-center studs, top and bottom plates, door/window headers, cripples, linear feet, and board feet.",
  path: "/construction/framing-calculator",
  keywords: [
    "framing calculator",
    "stud calculator",
    "wall stud calculator",
    "16 inch on center calculator",
    "how many studs for wall",
    "framing lumber calculator",
    "board feet calculator",
    "wall framing takeoff",
  ],
});

export default function FramingCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Wall Framing & Stud Calculator", url: "/construction/framing-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Wall Framing & Stud Calculator - Studs, Plates & Headers",
    "Free wall framing calculator to estimate 16\" and 24\" on-center studs, top and bottom plates, door/window headers, cripples, linear feet, and board feet.",
    "/construction/framing-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Wall Framing & Stud Takeoff Calculator",
    description:
      "Precision calculator for estimating residential wall framing lumber, studs on-center, top and bottom plates, window/door headers, cripples, and board footage.",
    url: "/construction/framing-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Wall Studs and Framing Lumber",
    "A step-by-step contractor guide to laying out studs on center, adding opening framing, and calculating total lumber requirements.",
    [
      {
        name: "Measure Total Wall Length in Feet",
        text: "Measure the total length of your wall run in feet using a tape measure.",
      },
      {
        name: "Calculate Common Studs on Center",
        text: "Divide wall length in inches by your stud spacing (e.g. 16 inches or 24 inches) and add 1 for the starting end stud.",
      },
      {
        name: "Add Corner and Intersection Framing",
        text: "Add 2 studs for each 90-degree corner (California 3-stud corner) and 2 studs for each intersecting T-wall drywall backing.",
      },
      {
        name: "Add Opening Framing (King, Jack, Cripple Studs & Headers)",
        text: "Add 2 king studs and 2 jack studs per opening, plus cripple studs above headers and below window sills.",
      },
      {
        name: "Calculate Top & Bottom Plates and Waste",
        text: "Multiply wall length by 3 for a double top plate plus bottom plate, divide into 16-foot stock boards, and add 10% culling waste.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How many studs do I need for a 10 ft, 12 ft, or 20 ft wall?",
      answer:
        "For a straight wall with no openings framed at 16 inches on center (OC): A 10-foot wall requires 9 studs; a 12-foot wall requires 10 studs; a 16-foot wall requires 13 studs; a 20-foot wall requires 16 studs. If you have corners or openings, add 2 studs per corner plus king and jack studs for each door or window.",
    },
    {
      question: "What is the common rule of thumb for estimating studs?",
      answer:
        "The standard contractor rule of thumb for quick budgeting is 1 stud per linear foot of wall. While a 16-inch OC layout mathematically uses 0.75 studs per foot, the extra 0.25 studs per foot naturally accounts for corners, intersecting partition backing, window/door king and jack studs, and culling warped boards.",
    },
    {
      question: "What is the difference between 16-inch OC and 24-inch OC stud spacing?",
      answer:
        "16 inches on center is the standard for load-bearing exterior walls, multi-story construction, and walls supporting tile or heavy siding. 24 inches on center (also known as Advanced Framing or Optimum Value Engineering) uses 30% less lumber, reduces thermal bridging, and increases wall insulation cavity space, but is typically restricted to single-story roofs, top floors, or non-bearing interior partitions.",
    },
    {
      question: "How do window and door openings change the stud count?",
      answer:
        "Each opening replaces common studs with dedicated structural framing members: 2 full-length King Studs (one on each side), 2 Jack/Trimmer Studs (supporting the header ends), 2 or 3 plies of Header lumber, top Cripple Studs (between the header and top plate), and for windows, a horizontal Sill Plate and bottom Cripple Studs.",
    },
    {
      question: "Why does standard residential framing require a double top plate?",
      answer:
        "A double top plate serves two critical structural purposes: 1) It ties intersecting walls and corners together by overlapping joints by at least 24 inches, providing building shear strength; and 2) It distributes heavy concentrated loads from roof trusses or floor joists evenly across the wall studs below, even when trusses do not land directly over studs.",
    },
    {
      question: "What is the difference between nominal and actual lumber dimensions?",
      answer:
        "Nominal dimensions represent the rough green cut of the log before kiln-drying and planing. A nominal '2x4' actually measures 1.5 inches by 3.5 inches; a '2x6' measures 1.5 inches by 5.5 inches; a '2x8' measures 1.5 inches by 7.25 inches; and a '2x10' measures 1.5 inches by 9.25 inches. All architectural layout math must use actual dimensions.",
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
              <Hammer className="h-3.5 w-3.5" />
              Lumber &amp; Wall Framing Takeoff Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Wall Framing &amp; Stud Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate residential wall framing lumber in <strong>total studs</strong>, <strong>top &amp; bottom plate boards</strong>, <strong>window/door headers</strong>, <strong>linear feet</strong>, and <strong>board feet (BF)</strong> for 16&quot; and 24&quot; on-center layouts with corner packs and opening takeoffs.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <FramingCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How Stud Spacing Works */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                1. How Wall Stud Spacing Works (On-Center Layout)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                In building construction, <strong>On-Center (OC)</strong> spacing measures the distance from the physical center of one stud to the center of the next stud.
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Common Studs = ⌈(Wall Length in Inches ÷ Spacing in Inches)⌉ + 1 (Start Stud)
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                For a 16-foot wall framed at 16&quot; OC: (192&quot; ÷ 16&quot;) = 12 spaces + 1 = <strong>13 common studs</strong>. The extra stud is required to close the end of the wall.
              </p>
            </section>

            {/* Section 2: 16" OC vs 24" OC */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. 16&quot; OC vs. 24&quot; OC: Code &amp; Application Differences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      16 Inches On-Center (Standard)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Primary Applications:</strong> Exterior load-bearing walls, multi-story homes, walls supporting heavy tile or stone veneer, and standard drywall.</p>
                    <p><strong>Pros:</strong> Stiffer walls, maximum nailing support for exterior siding, and universal structural code acceptance under IRC Table R602.3(5).</p>
                    <p><strong>Lumber Usage:</strong> Uses approximately 25% to 30% more studs than 24&quot; OC.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      24 Inches On-Center (Advanced Framing)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Primary Applications:</strong> Interior non-bearing partitions, single-story 2x6 exterior walls (where roof trusses align directly over studs).</p>
                    <p><strong>Pros:</strong> Reduces lumber costs by ~30%, lowers labor, and creates larger wall cavity spaces for higher R-value fiberglass or cellulose insulation.</p>
                    <p><strong>Considerations:</strong> Requires 5/8&quot; drywall or sag-resistant 1/2&quot; drywall to prevent bowing between studs.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 3: Openings Anatomy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                3. Anatomy of Window and Door Framing Openings
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                When you cut an opening in a wall, structural vertical loads from above must be routed around the opening. Each rough opening requires four dedicated framing components:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">1. King Studs (2x)</h3>
                  <p className="text-slate-600">
                    Full-height studs running from the bottom plate to top plate on either side of the opening, providing lateral stiffness.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">2. Jack / Trimmer Studs (2x)</h3>
                  <p className="text-slate-600">
                    Shorter studs fastened inside the king studs that directly bear the downward weight of the horizontal header beam.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">3. Header Beam (2-Ply / 3-Ply)</h3>
                  <p className="text-slate-600">
                    Heavy horizontal beam (2x8, 2x10, or 2x12) spanning across the opening to transfer roof and floor loads to the jack studs.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">4. Cripple Studs</h3>
                  <p className="text-slate-600">
                    Short vertical studs maintaining 16&quot; or 24&quot; OC spacing above the header and below the window sill plate for drywall nailing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Corner Framing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                4. Corner Framing &amp; Drywall Backing Assemblies
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Where two walls meet at a 90-degree outside corner, you need framing to connect the exterior sheathing while providing solid drywall backing inside:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>California 3-Stud Corner (Recommended):</strong> Two standard studs face outward, with a third stud turned flat to provide an interior drywall nailer. This leaves the corner open from the inside, allowing full fiberglass batt insulation into the corner cavity.
                </li>
                <li>
                  <strong>Traditional 3-Stud Post:</strong> Three full-length studs nailed solidly together with 2x4 blocking. Extremely strong, but creates an uninsulated thermal bridge through the wall.
                </li>
                <li>
                  <strong>T-Wall Partition Intersections:</strong> Where an interior partition meets an exterior wall, add 2 extra studs (or horizontal ladder blocking) to provide drywall backing for the interior ceiling and wallboard.
                </li>
              </ul>
            </section>

            {/* Section 5: Nominal vs Actual Dimensions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                5. Nominal vs. Actual Lumber Dimension Reference Table
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nominal Size</th>
                      <th className="p-3">Actual Thickness × Width</th>
                      <th className="p-3">Board Feet per Linear Foot</th>
                      <th className="p-3">Standard Framing Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x4</td>
                      <td className="p-3 text-amber-800 font-bold">1-1/2&quot; × 3-1/2&quot;</td>
                      <td className="p-3">0.667 BF/ft</td>
                      <td className="p-3 font-sans text-slate-600">Interior walls, plates, cripples</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x6</td>
                      <td className="p-3 text-amber-800 font-bold">1-1/2&quot; × 5-1/2&quot;</td>
                      <td className="p-3">1.000 BF/ft</td>
                      <td className="p-3 font-sans text-slate-600">Exterior load-bearing walls, wet walls</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x8</td>
                      <td className="p-3 text-amber-800 font-bold">1-1/2&quot; × 7-1/4&quot;</td>
                      <td className="p-3">1.333 BF/ft</td>
                      <td className="p-3 font-sans text-slate-600">Window headers (spans up to 6 ft)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x10</td>
                      <td className="p-3 text-amber-800 font-bold">1-1/2&quot; × 9-1/4&quot;</td>
                      <td className="p-3">1.667 BF/ft</td>
                      <td className="p-3 font-sans text-slate-600">Door headers (spans up to 8 ft)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2x12</td>
                      <td className="p-3 text-amber-800 font-bold">1-1/2&quot; × 11-1/4&quot;</td>
                      <td className="p-3">2.000 BF/ft</td>
                      <td className="p-3 font-sans text-slate-600">Patio/garage door headers (spans 8&apos;+)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Double Top Plate */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. Why Walls Require a Double Top Plate
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                A single top plate is only permitted under strict Advanced Framing codes where every roof truss lands directly over a stud within 1 inch of alignment. In conventional residential construction:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Overlapping Corner Ties:</strong> The second (upper) top plate overlaps the lower plate at all wall corners and intersections by at least 24 inches, locking the wall frames into a rigid 3D box.
                </li>
                <li>
                  <strong>Tension Tie Staggering:</strong> Splices in the top and bottom layers are staggered by at least 4 feet to prevent weak failure points along long continuous wall runs.
                </li>
              </ul>
            </section>

            {/* Section 7: Culling Waste Factor */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                7. Why You Must Add 10% to 15% Lumber Culling Waste
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                When you order a bundle of 100 framing studs from a lumber supplier, approximately <strong>5 to 10 boards will be warped, bowed, twisted, or have excessive bark wane</strong> that prevents them from being used as straight wall studs.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-slate-800 space-y-1">
                <p className="font-bold text-amber-950">Contractor Jobsite Practice:</p>
                <p>
                  Never throw culled warped studs away. Set them aside to cut down into short cripple studs, fire blocking, window sill plates, and corner backing blocks.
                </p>
              </div>
            </section>

            {/* Section 8: Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Foundation &amp; Sub-Base Takeoff Tools
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Building the Foundation Under Your Framing?
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Our interconnected construction calculation ecosystem helps you estimate your complete build from site excavation to roof rafters:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/materials/drywall-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Drywall &amp; Finish
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Drywall &amp; Sheet Goods Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate 4x8/4x12 sheets, joint compound mud, tape, and screws for framed walls.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Drywall <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/concrete-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Concrete Estimator
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Concrete Slab &amp; Footing Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate ready-mix cubic yards and bag counts for slab foundations.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Concrete <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/materials/gravel-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Aggregate Estimator
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Gravel &amp; Crusher Run Base Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Estimate tons and dump truckloads for sub-base gravel cushions.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Gravel <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </div>
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
