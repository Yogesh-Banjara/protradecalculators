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
import { DrywallCalculatorForm } from "@/components/tools/drywall-calculator/drywall-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ScrollText,
  Ruler,
  HelpCircle,
  AlertTriangle,
  Layers,
  Scale,
  CheckCircle2,
  ArrowRight,
  Paintbrush,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Drywall & Sheet Goods Calculator",
  description:
    "Free drywall calculator to estimate 4x8, 4x10, and 4x12 sheets, joint compound buckets, joint tape rolls, and drywall screws with room and opening deductions.",
  path: "/materials/drywall-calculator",
  keywords: [
    "drywall calculator",
    "sheetrock calculator",
    "how many drywall sheets",
    "drywall mud calculator",
    "drywall joint tape calculator",
    "drywall screw calculator",
    "sheet goods estimator",
    "wallboard calculator",
  ],
});

export default function DrywallCalculatorPage() {
  const breadcrumbs = [
    { name: "Materials & Takeoff", url: "/categories/materials" },
    { name: "Drywall & Sheet Goods Calculator", url: "/materials/drywall-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Drywall Calculator - Sheet Count, Mud, Tape & Screws",
    "Free drywall calculator to estimate 4x8, 4x10, and 4x12 sheets, joint compound buckets, joint tape rolls, and drywall screws with room and opening deductions.",
    "/materials/drywall-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Drywall & Sheet Goods Takeoff Calculator",
    description:
      "Contractor estimation utility for calculating 4x8, 4x10, and 4x12 drywall sheets, joint compound mud, paper tape, and fastener counts with opening deductions.",
    url: "/materials/drywall-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Drywall Sheets and Finishing Materials",
    "A step-by-step contractor guide to measuring room walls and ceilings, deducting openings, and calculating sheetrock boards, joint compound mud, and paper tape.",
    [
      {
        name: "Measure Room Perimeter and Ceiling Height",
        text: "Calculate perimeter length (2 × [Length + Width]) and multiply by ceiling height to determine gross perimeter wall surface area.",
      },
      {
        name: "Calculate Ceiling Square Footage",
        text: "Multiply room length by room width to determine ceiling surface area if ceilings are being drywalled.",
      },
      {
        name: "Deduct Door and Window Openings",
        text: "Multiply the width and height of each door, window, or large opening and subtract total opening area from gross wall area.",
      },
      {
        name: "Select Sheet Size and Add Cutting Waste",
        text: "Divide total net square footage by sheet size area (32 sq ft for 4x8, 40 sq ft for 4x10, or 48 sq ft for 4x12) and add 10% cutting waste.",
      },
      {
        name: "Estimate Joint Mud, Tape, and Drywall Screws",
        text: "Multiply adjusted square footage by 0.053 for compound gallons (approx 1 bucket per 85 sq ft) and 0.053 for tape footage (500-ft rolls).",
      },
    ]
  );

  const faqItems = [
    {
      question: "How many drywall sheets do I need for a 12x12 room with 8-foot ceilings?",
      answer:
        "A standard 12x12 room with 8-foot ceilings has 384 sq ft of walls and 144 sq ft of ceiling (528 sq ft gross). Deducting 35 sq ft for a standard door and window gives 493 sq ft net. With a standard 10% cutting waste factor (542 sq ft total), you need 17 sheets of 4x8 drywall (or 12 sheets of 4x12 drywall). You will also need 2 buckets (4.5 gal) of joint compound and 1 roll of 500-ft paper tape.",
    },
    {
      question: "What size drywall sheet should I buy (4x8, 4x10, or 4x12)?",
      answer:
        "Use 4x8 sheets for small rooms, tight hallways, staircases, or when working solo because they are lightweight (~51 lbs) and maneuverable. Use 4x10 sheets for 9-foot or 10-foot ceilings hung vertically to eliminate horizontal mid-wall seams. Use 4x12 sheets for large rooms and long walls to reduce taped butt joints by 25%, resulting in a flatter, smoother finish.",
    },
    {
      question: "How much joint compound (mud) and tape do I need per sheet of drywall?",
      answer:
        "As an industry rule of thumb, each 4x8 sheet (32 sq ft) requires approximately 1.7 gallons of ready-mixed joint compound across three finishing coats (tape coat, fill coat, finish skim) and about 12 to 14 linear feet of paper joint tape. For a 500 sq ft room, plan for two 4.5-gallon buckets of all-purpose mud and one 500-foot roll of tape.",
    },
    {
      question: "When should I use 1/2-inch vs 5/8-inch drywall?",
      answer:
        "1/2-inch drywall is the universal standard for interior walls and residential ceilings framed at 16 inches on center. 5/8-inch Type X drywall is thicker, heavier (~70 lbs per sheet), and fire-rated; building codes mandate 5/8-inch drywall on garage-to-house shared walls, furnace/utility rooms, commercial assemblies, and ceilings framed at 24 inches on center to prevent sagging.",
    },
    {
      question: "Should drywall sheets be installed vertically or horizontally on walls?",
      answer:
        "In residential construction, hanging sheets horizontally across wall studs is strongly recommended. Horizontal installation bridges across irregular framing studs to create a flatter wall, reduces the total linear footage of seams by up to 25%, and places the main tapered joint at comfortable chest height (48 inches) for easier taping and sanding.",
    },
    {
      question: "How many drywall screws do I need per sheet of drywall?",
      answer:
        "Plan for approximately 32 to 36 screws per 4x8 sheet (about 1 screw per square foot). Fasteners should be spaced 12 inches on center on ceilings and 16 inches on center on wall studs. Use 1-1/4 inch #6 coarse-thread drywall screws for 1/2-inch drywall on wood studs.",
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
              <ScrollText className="h-3.5 w-3.5" />
              Sheet Goods &amp; Drywall Finishing Takeoff
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Drywall &amp; Sheet Goods Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate residential and commercial drywall requirements in <strong>total sheets (4x8, 4x10, 4x12)</strong>, <strong>joint compound mud buckets</strong>, <strong>paper tape rolls</strong>, and <strong>fastener screws</strong> for multi-room walls and ceilings with opening deductions.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <DrywallCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How Drywall Area is Calculated */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                1. How Drywall Surface Area is Calculated
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Estimating sheetrock begins with finding the total gross square footage of all perimeter walls plus the ceiling surface area, then deducting window and door rough openings:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Wall Area Formula:</p>
                  <p>Gross Walls = 2 × (Length + Width) × Ceiling Height</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Ceiling Area Formula:</p>
                  <p>Ceiling Area = Length × Width</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Total Net Area = (Gross Walls + Ceiling Area) − Total Opening Deductions.
              </p>
            </section>

            {/* Section 2: Sheet Size Comparison */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                2. Choosing Between 4x8, 4x10, and 4x12 Drywall Sheets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">4 ft × 8 ft (32 sq ft)</h3>
                  <p className="text-amber-700 font-bold font-mono">Weight: ~51 lbs (1/2&quot;)</p>
                  <p className="text-slate-600">
                    The DIY standard. Fits in pickup trucks and through standard doorways and stairwells. Creates more butt joints on walls longer than 8 feet.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">4 ft × 10 ft (40 sq ft)</h3>
                  <p className="text-amber-700 font-bold font-mono">Weight: ~64 lbs (1/2&quot;)</p>
                  <p className="text-slate-600">
                    Perfect for modern 9-foot and 10-foot ceilings. Installed vertically or horizontally, eliminating awkward narrow filler strips at the top of walls.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">4 ft × 12 ft (48 sq ft)</h3>
                  <p className="text-amber-700 font-bold font-mono">Weight: ~77 lbs (1/2&quot;)</p>
                  <p className="text-slate-600">
                    Professional contractor choice. Spans entire residential rooms up to 12 feet without a single non-tapered butt joint. Requires a 2-person hanging crew.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: 1/2" vs 5/8" Thickness */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                3. 1/2-Inch vs. 5/8-Inch Drywall Thickness Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      1/2-Inch Regular Drywall
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Primary Use:</strong> Standard residential interior partition walls and ceilings framed at 16 inches on center.</p>
                    <p><strong>Pros:</strong> Lighter weight (~51 lbs/sheet), easy to cut and snap, lower material cost.</p>
                    <p><strong>Limitations:</strong> Not rated for 1-hour commercial firewall assemblies; can sag on 24&quot; OC ceiling framing without specialty ceiling board.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      5/8-Inch Type X Fire-Rated Drywall
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Primary Use:</strong> Attached garage separation walls/ceilings, utility rooms, multi-family common walls, 24&quot; OC ceilings.</p>
                    <p><strong>Pros:</strong> Contains glass fibers that maintain structural integrity during fire; superior sound-deadening (STC rating); resists ceiling sagging.</p>
                    <p><strong>Limitations:</strong> Heavy (~70 lbs/sheet); requires heavy-duty drywall lifts for ceiling installation.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 4: Estimating Mud, Tape & Fasteners */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Paintbrush className="h-6 w-6 text-amber-600" />
                4. Estimating Joint Compound (Mud), Tape, and Screws
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Material Component</th>
                      <th className="p-3">Consumption Rate</th>
                      <th className="p-3">Standard Packaging</th>
                      <th className="p-3">Contractor Rule of Thumb</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Premixed Joint Compound (Mud)</td>
                      <td className="p-3 text-amber-800">0.053 gal / sq ft</td>
                      <td className="p-3 font-sans text-slate-600">4.5-Gallon Bucket (~60 lbs)</td>
                      <td className="p-3 font-sans text-slate-600">1 bucket per 8 to 10 sheets (4x8)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Drywall Paper Joint Tape</td>
                      <td className="p-3 text-amber-800">0.053 linear ft / sq ft</td>
                      <td className="p-3 font-sans text-slate-600">500 ft / 250 ft Rolls</td>
                      <td className="p-3 font-sans text-slate-600">1 x 500&apos; roll per 35 to 40 sheets</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Drywall Screws (1-1/4&quot; #6 Coarse)</td>
                      <td className="p-3 text-amber-800">1.0 screw / sq ft</td>
                      <td className="p-3 font-sans text-slate-600">5 lb Box (~1,500 screws)</td>
                      <td className="p-3 font-sans text-slate-600">1 box per 35 to 40 sheets (32 screws/sheet)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Why Waste Factor is Critical */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                5. Why You Must Add a 10% to 15% Waste Allowance
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Drywall boards are rigid rectangular sheets. When cutting around doors, windows, electrical boxes, and ceiling corners, significant offcut material cannot be reused:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Simple Rectangular Rooms</h3>
                  <p className="text-amber-700 font-bold font-mono">5% to 8% Waste</p>
                  <p className="text-slate-600">
                    Straight walls with standard 8 ft ceilings and minimal window cutouts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Standard Residential Remodels</h3>
                  <p className="text-amber-700 font-bold font-mono">10% Waste (Recommended)</p>
                  <p className="text-slate-600">
                    Typical floor plans with closets, doors, windows, and ceiling cuts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Complex Custom Layouts</h3>
                  <p className="text-amber-700 font-bold font-mono">15% to 20% Waste</p>
                  <p className="text-slate-600">
                    Vaulted cathedral ceilings, angled soffits, arched openings, and dormers.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Limitations of Area Math */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. Limitations of Area-Based Estimation vs. 2D Layouts
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Area-based mathematical estimation provides accurate budget quantities for purchasing materials. However, on the jobsite:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Joint Placement Rules:</strong> Drywall joints should never align with the corners of doors or windows (which causes future cracking). Boards should span past opening corners.
                </li>
                <li>
                  <strong>Butt Joint Staggering:</strong> Adjoining horizontal rows must stagger butt joints by at least 4 feet.
                </li>
                <li>
                  <strong>Ceilings First:</strong> Always install ceiling drywall before hanging wall sheets so the wallboards support the ceiling edges.
                </li>
              </ul>
            </section>

            {/* Section 7: Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Complete Construction Takeoff Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Calculate Your Entire Build Workflow
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Our interconnected construction tool suite covers every phase of your project from excavation to wall finish:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/construction/framing-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Framing &amp; Studs
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Wall Framing Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate wall studs (16&quot;/24&quot; OC), plates, headers, and board feet.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Framing <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/concrete-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Concrete Slabs
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Concrete Volume Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Estimate ready-mix cubic yards and bag counts for slab foundations.
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
                        Sub-Base Aggregate
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Gravel &amp; Stone Calculator
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
