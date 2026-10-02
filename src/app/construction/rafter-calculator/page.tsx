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
import { RafterCalculatorForm } from "@/components/tools/rafter-calculator/rafter-form";
import {
  Ruler,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Compass,
  Triangle,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Rafter Calculator - Common Rafter Length & Birdsmouth Cuts",
  description:
    "Free rafter calculator to calculate common rafter line length, theoretical rise & run, ridge board deduction, eave overhang, birdsmouth cuts, and IRC R802 notching limits.",
  path: "/construction/rafter-calculator",
  keywords: [
    "rafter calculator",
    "roof rafter length calculator",
    "common rafter calculator",
    "how to calculate rafter length",
    "birdsmouth cut calculator",
    "rafter pitch calculator",
    "rafter angle calculator",
    "framing square rafter table",
    "IRC rafter notch limits",
    "roof framing calculator",
  ],
});

export default function RafterCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Roof Rafter Calculator", url: "/construction/rafter-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Roof Rafter Length & Cut Schedule Calculator",
    "Free rafter calculator to calculate common rafter length, line length, ridge deduction, eave overhang, birdsmouth cuts, and IRC R802.7.1 notching limits.",
    "/construction/rafter-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Common Rafter Framing & Cut Schedule Calculator",
    description:
      "Professional roof framing utility for calculating exact common rafter cutting lengths, theoretical line lengths, ridge board deductions, birdsmouth seat and plumb cuts, height above plate (HAP), and IRC building code limits.",
    url: "/construction/rafter-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate and Cut Common Roof Rafters",
    "Step-by-step master carpenter guide to calculating rafter run, rise, slope multiplier, ridge deductions, birdsmouth cuts, and laying out lumber on the jobsite.",
    [
      {
        name: "Measure Building Span and Determine Run",
        text: "Measure the total exterior framing width (building span) from the outside of the top plates. Divide total span by 2 to determine the horizontal run of the common rafter.",
      },
      {
        name: "Calculate Theoretical Line Length",
        text: "Multiply the horizontal run by the roof pitch slope factor (sqrt(1 + (pitch/12)^2)). This represents the theoretical centerline distance from the ridge center to the outer wall plate line.",
      },
      {
        name: "Deduct for the Ridge Board",
        text: "Deduct half the thickness of the ridge board along the rafter slope: (Ridge Board Thickness / 2) * Slope Factor. For standard 2x lumber (1.5 inches thick), deduct 0.75 inches multiplied by the slope factor.",
      },
      {
        name: "Calculate Overhang Tail Length",
        text: "Multiply the desired horizontal eave overhang by the pitch slope factor to determine the length of rafter tail to add beyond the wall line.",
      },
      {
        name: "Layout the Birdsmouth Seat and Plumb Cuts",
        text: "Measure the horizontal wall plate bearing (typically 3.5 inches for a 2x4 wall or 5.5 inches for a 2x6 wall). Ensure the plumb cut depth does not exceed 1/4 the rafter depth per IRC Section R802.7.1.",
      },
      {
        name: "Make Practical Cuts on Lumber Stock",
        text: "Using a framing square or speed square set to your pitch angle, cut the top plumb cut, birdsmouth notch, and eave tail cut.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do you calculate the length of a common rafter?",
      answer:
        "To calculate common rafter length: First, find the horizontal run (half the building span). Second, find the slope factor using the Pythagorean theorem: Slope Factor = sqrt(1 + (Pitch/12)^2). Third, multiply Run by the Slope Factor to obtain the theoretical Line Length. Finally, subtract the ridge board deduction (half the ridge board thickness times the slope factor) and add the rafter tail overhang length.",
    },
    {
      question: "Why do you subtract half the ridge board from the rafter length?",
      answer:
        "The theoretical rafter line length is calculated to the geometric centerline of the building roof ridge. In actual construction, a continuous ridge board (typically 1.5 inches thick for 2x dimensional lumber) separates the opposing rafter pairs. Subtracting half the thickness (0.75 inches measured horizontally, or 0.75\" * slope factor along the rafter line) ensures the rafter pairs meet tight against the face of the ridge board without pushing the exterior walls out of plumb.",
    },
    {
      question: "What is a birdsmouth cut and what are the IRC code limits?",
      answer:
        "A birdsmouth is a V-shaped triangular notch cut into a rafter allowing it to rest flat on top of the exterior wall top plate. It consists of two cuts: a horizontal seat cut that bears on the plate (minimum 1.5 inches on wood per IRC R802.7.1), and a vertical plumb cut. Under IRC Section R802.7.1, notches on the ends of rafters cannot exceed 1/4 the actual lumber depth (e.g. 1.375 inches maximum plumb cut on a 2x6, or 1.81 inches on a 2x8) to preserve structural shear strength.",
    },
    {
      question: "What size lumber should I order for my rafters?",
      answer:
        "Always order the next standard even-foot dimensional lumber length that exceeds your Total Cut Rafter Length. For example, if your total cut length (line length minus ridge deduction plus overhang) is 14 feet 5 inches, you must order 16-foot 2x6 or 2x8 lumber stock. Standard dimensional lumber lengths are sold in 2-foot increments (8', 10', 12', 14', 16', 18', 20', 22', 24').",
    },
    {
      question: "What is H.A.P. (Height Above Plate) in roof framing?",
      answer:
        "Height Above Plate (HAP), also known as the heel stand, is the vertical distance of solid, uncut wood remaining directly above the exterior wall top plate after the birdsmouth notch is cut. Maintaining consistent HAP across all rafters is essential because it dictates the exterior wall height, fascia board alignment, and roof plane consistency.",
    },
    {
      question: "How do you read the common rafter table on a framing square?",
      answer:
        "On a standard steel framing square, the first row of numbers on the face of the blade is labeled 'Length of Common Rafters per Foot Run'. Locate the roof pitch mark (e.g. 6 for 6:12 pitch) on the edge ruler. Directly below 6 is the number 13.42. This means that for every 1 foot of horizontal run, the rafter length increases by 13.42 inches. Multiply 13.42 inches by your total run in feet to get the exact rafter line length.",
    },
  ];

  const faqSchema = buildFaqSchema(faqItems);

  return (
    <>
      <JsonLd schema={pageSchema} />
      <JsonLd schema={softwareAppSchema} />
      <JsonLd schema={howToSchema} />
      <JsonLd schema={faqSchema} />

      <main className="py-10 bg-slate-50 min-h-screen">
        <Container>
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* Hero Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Framing &amp; Carpentry Utility
              </span>
              <span className="text-xs text-slate-500 font-mono">IRC Section R802 Calibrated</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
              Roof Rafter Calculator
            </h1>
            <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
              Calculate exact common rafter cutting lengths, theoretical line lengths, ridge board deductions, eave overhang tails, birdsmouth seat cuts, and IRC Section R802.7.1 notching limits.
            </p>
          </div>

          {/* Interactive Calculator Workbench */}
          <div className="mb-14">
            <RafterCalculatorForm />
          </div>

          {/* Editorial Architectural & Engineering Guidance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-12">
              {/* SECTION 1: Trigonometric Principles */}
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <Triangle className="h-6 w-6 text-amber-600" />
                  1. Common Rafter Geometry &amp; Trigonometric Formulas
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Every common roof rafter forms the hypotenuse of a right-angled triangle where the base is the horizontal <strong>run</strong> (half of the total building span), the altitude is the vertical <strong>rise</strong>, and the slope is defined as inches of rise per 12 inches of run ($P/12$).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <span className="text-amber-800 font-bold block">Slope Multiplier Factor</span>
                    <p className="text-slate-900 font-bold text-sm">
                      {"Slope Factor = √(1 + (Pitch / 12)²)"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Used to convert any horizontal distance into its true diagonal sloped length.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <span className="text-amber-800 font-bold block">Rafter Line Length Formula</span>
                    <p className="text-slate-900 font-bold text-sm">
                      {"Line Length = Run (inches) × Slope Factor"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Measures center of ridge board to outside face of top wall plate line.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Ridge Board Deduction */}
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <Ruler className="h-6 w-6 text-amber-600" />
                  2. Ridge Board Thickness Deduction Rules
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  A common framing error made by novice carpenters is forgetting to deduct for the ridge board. Because theoretical rafter line length is calculated to the geometric center of the building span, you must shorten each rafter by half the thickness of the ridge member:
                </p>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                    Ridge Deduction along Rafter Slope:
                  </div>
                  <p className="font-mono text-sm">
                    {"Ridge Deduction = (Ridge Thickness / 2) × Slope Factor"}
                  </p>
                  <p className="leading-relaxed font-sans">
                    For standard 2x dimensional lumber (1.5″ net thickness), the horizontal half-thickness is 0.75″. On a 6:12 pitch (slope factor 1.1180), the deduction along the rafter line is 0.75″ × 1.1180 = 0.84″ (approx 13/16″). For engineered LVL ridge beams (1.75″ thick), deduct 0.875″ × Slope Factor.
                  </p>
                </div>
              </section>

              {/* SECTION 3: Birdsmouth Cuts & IRC Limits */}
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <Compass className="h-6 w-6 text-amber-600" />
                  3. Birdsmouth Cut Layout &amp; IRC Section R802.7.1 Notching Limits
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The birdsmouth notch allows the sloped rafter to transfer roof gravity and snow loads directly down into the vertical wall studs. It is formed by two intersecting cuts:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                    <strong className="text-slate-900 block font-sans text-sm">
                      1. Horizontal Seat Cut Bearing (IRC R802.7.1)
                    </strong>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      The seat cut must bear flat across the top plate. Under IRC building codes, minimum bearing length is <strong>1.5 inches</strong> on wood and <strong>3.0 inches</strong> on masonry or concrete. On a standard 2x4 exterior wall, the seat cut is typically 3.5 inches. On a 2x6 exterior wall, it is typically 5.5 inches.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                    <strong className="text-slate-900 block font-sans text-sm">
                      2. Vertical Plumb Cut Notch Depth Limit (D / 4)
                    </strong>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      To prevent catastrophic split failure along the timber grain under high snow or wind loads, IRC Section R802.7.1 dictates that <strong>end notches shall not exceed one-fourth (1/4) of the actual rafter depth</strong>. For a 2x6 (5.5″ depth), the maximum allowable plumb cut is 1.375″. For a 2x8 (7.25″ depth), the maximum is 1.81″. If a steep pitch creates a plumb cut exceeding this threshold, structural framing screws or engineered rafter ties (such as Simpson Strong-Tie H2.5A) must be specified.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                    <strong className="text-slate-900 block font-sans text-sm">
                      3. Height Above Plate (H.A.P. / Heel Stand)
                    </strong>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      HAP is the remaining uncut vertical wood thickness directly above the top plate: HAP = Actual Depth - Plumb Cut Depth. Maintaining consistent HAP across all rafters ensures straight eave lines and uniform ceiling drywall heights.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Framing Square Rafter Table */}
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                  4. Framing Square Rafter Table Lookup Chart
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Master carpenters use the standard steel framing square rafter tables. Below is the official multiplier and common rafter length per foot of run for standard roof pitches:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs border border-slate-200 bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100 text-left border-b border-slate-200">
                        <th className="py-2.5 px-3 font-bold text-slate-900">Roof Pitch</th>
                        <th className="py-2.5 px-3 font-bold text-slate-900">Plumb Cut Angle</th>
                        <th className="py-2.5 px-3 font-bold text-slate-900">Slope Multiplier</th>
                        <th className="py-2.5 px-3 font-bold text-slate-900">Length Per Ft Run</th>
                        <th className="py-2.5 px-3 font-bold text-slate-900">Standard 24′ Span Line Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-800">3:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">14.04°</td>
                        <td className="py-2 px-3 text-slate-600">1.0308</td>
                        <td className="py-2 px-3 text-slate-600">12.37″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">12′ 4-7/16″</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-800">4:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">18.43°</td>
                        <td className="py-2 px-3 text-slate-600">1.0541</td>
                        <td className="py-2 px-3 text-slate-600">12.65″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">12′ 7-13/16″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-800">5:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">22.62°</td>
                        <td className="py-2 px-3 text-slate-600">1.0833</td>
                        <td className="py-2 px-3 text-slate-600">13.00″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">13′ 0″</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-800">6:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">26.57°</td>
                        <td className="py-2 px-3 text-slate-600">1.1180</td>
                        <td className="py-2 px-3 text-slate-600">13.42″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">13′ 5″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-800">8:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">33.69°</td>
                        <td className="py-2 px-3 text-slate-600">1.2019</td>
                        <td className="py-2 px-3 text-slate-600">14.42″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">14′ 5-1/16″</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-800">10:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">39.81°</td>
                        <td className="py-2 px-3 text-slate-600">1.3017</td>
                        <td className="py-2 px-3 text-slate-600">15.62″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">15′ 7-7/16″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-800">12:12 Pitch</td>
                        <td className="py-2 px-3 text-slate-600">45.00°</td>
                        <td className="py-2 px-3 text-slate-600">1.4142</td>
                        <td className="py-2 px-3 text-slate-600">16.97″ / ft</td>
                        <td className="py-2 px-3 font-bold text-amber-800">16′ 11-11/16″</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 5: Frequently Asked Questions */}
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-amber-600" />
                  5. Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqItems.map((faq, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white space-y-1.5 shadow-2xs">
                      <h3 className="text-sm font-bold text-slate-900">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* SIDEBAR (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Summary Card */}
              <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  Rafter Framing Checklist
                </h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Always verify building span at both gable ends and mid-span.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Deduct half the ridge board along the rafter slope line.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cut one pattern rafter and test-fit before gang-cutting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Crown all rafter boards upwards to resist deflection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Check local ground snow load for maximum allowable spans.</span>
                  </li>
                </ul>
              </div>

              {/* Related Calculators */}
              <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  Related Construction Tools
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/construction/stair-calculator"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-colors text-xs text-slate-800 font-medium group"
                  >
                    <span>Stair Stringer Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/construction/roof-pitch-calculator"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-colors text-xs text-slate-800 font-medium group"
                  >
                    <span>Roof Pitch &amp; Shingle Squares</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/construction/concrete-calculator"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-colors text-xs text-slate-800 font-medium group"
                  >
                    <span>Concrete Slab &amp; Footing Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
