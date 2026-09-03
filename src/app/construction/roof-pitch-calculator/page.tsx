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
import { RoofCalculatorForm } from "@/components/tools/roof-calculator/roof-form";
import {
  Triangle,
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
  title: "Roof Pitch & Rafter Calculator",
  description:
    "Free roof pitch and rafter calculator to calculate pitch angles, common rafter lengths, birdsmouth cuts, roof surface area, and shingle squares.",
  path: "/construction/roof-pitch-calculator",
  keywords: [
    "roof pitch calculator",
    "rafter calculator",
    "roof slope calculator",
    "calculate rafter length",
    "birdsmouth cut calculator",
    "roofing squares calculator",
    "how many bundles of shingles",
    "common rafter length",
  ],
});

export default function RoofPitchCalculatorPage() {
  const breadcrumbs = [
    { name: "Construction & Framing", url: "/categories/construction" },
    { name: "Roof Pitch & Rafter Calculator", url: "/construction/roof-pitch-calculator" },
  ];

  const pageSchema = buildWebPageSchema(
    "Roof Pitch & Rafter Calculator - Length, Angles & Squares",
    "Free roof pitch and rafter calculator to calculate pitch angles, common rafter lengths, birdsmouth cuts, roof surface area, and shingle squares.",
    "/construction/roof-pitch-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Roof Pitch & Rafter Takeoff Calculator",
    description:
      "Contractor estimation utility for calculating roof slope angles, common rafter lengths, overhang tails, birdsmouth seat cuts, sloped surface area, and roofing squares.",
    url: "/construction/roof-pitch-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Roof Pitch and Common Rafter Length",
    "A contractor guide to laying out common rafters, calculating pitch angles, cutting birdsmouth notches, and estimating roofing squares.",
    [
      {
        name: "Measure Building Span and Determine Run",
        text: "Measure total building width (outer wall to outer wall) and divide by 2 to determine the horizontal rafter run.",
      },
      {
        name: "Select Roof Pitch (Rise in 12 Inches)",
        text: "Determine the vertical rise per 12 inches of horizontal run (e.g. 6/12 pitch rises 6 inches vertically for every 12 inches horizontal).",
      },
      {
        name: "Calculate Common Rafter Line Length",
        text: "Multiply the run by the slope multiplier factor (√(1 + [Pitch/12]²)) or use the Pythagorean theorem: √(Run² + Rise²).",
      },
      {
        name: "Deduct Ridge Board and Add Overhang",
        text: "Deduct half of the ridge board thickness along the rafter line and add the sloped overhang length to calculate the total cut rafter length.",
      },
      {
        name: "Calculate Sloped Surface Area and Shingle Squares",
        text: "Multiply flat roof footprint (including overhangs) by the slope multiplier factor, divide by 100 for roofing squares, and multiply by 3 for shingle bundles.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do I calculate the common rafter length for a roof?",
      answer:
        "First, determine your horizontal run (half the building span). Next, find your slope multiplier: Slope Factor = √(1 + [Pitch/12]²). Multiply your run by the slope factor to get the theoretical rafter line length (ridge center to outer wall plate). Finally, subtract half the ridge board thickness along the slope and add your sloped overhang tail length to estimate your rafter cutting length.",
    },
    {
      question: "What is the difference between roof pitch and roof angle (degrees)?",
      answer:
        "Roof pitch is expressed as a ratio of vertical rise over 12 inches of horizontal run (e.g. 6/12 pitch rises 6 inches per foot). Roof angle is the slope measured in degrees from horizontal: Angle (degrees) = arctan(Pitch / 12) × (180 / π). For example, a 4/12 pitch equals 18.43°, a 6/12 pitch equals 26.57°, an 8/12 pitch equals 33.69°, and a 12/12 pitch equals 45.00°.",
    },
    {
      question: "What is a birdsmouth cut on a roof rafter?",
      answer:
        "A birdsmouth cut is an angled notch cut into the bottom edge of a rafter where it rests on the exterior wall top plate. It consists of two cuts: 1) A horizontal Seat Cut (providing bearing on the top plate) and 2) A vertical Plumb Cut (resting against the outer edge of the wall). Model building codes (e.g. IRC Section R802.5.2) commonly restrict notch depth to a maximum of 1/3 rafter stock depth to limit cross-grain splitting. Always verify local framing requirements with your engineer or building official.",
    },
    {
      question: "How do I convert roof pitch to a slope multiplier factor?",
      answer:
        "The slope multiplier factor is calculated as: Multiplier = √(Pitch² + 12²) ÷ 12. For a 4/12 pitch, the multiplier is 1.0541; for 6/12, it is 1.1180; for 8/12, it is 1.2019; and for 12/12, it is 1.4142. Multiply your flat building footprint area (including overhangs) by this factor to estimate sloped roof surface area.",
    },
    {
      question: "How many bundles of shingles do I need per roofing square?",
      answer:
        "One roofing square equals exactly 100 square feet of roof surface. Standard 3-tab and architectural laminated asphalt shingles are packaged 3 bundles per square (each bundle covers 33.33 sq ft). Heavyweight specialty or designer shingles are packaged 4 bundles per square (25 sq ft per bundle). Always add a 10% to 15% waste allowance for starter strips, hips, valleys, and offcuts.",
    },
    {
      question: "What is the minimum roof pitch for asphalt shingles?",
      answer:
        "Under standard building code guidelines (e.g. IRC Table R905.1.1), asphalt shingles generally require a minimum pitch of 2/12. On low slopes between 2/12 and 4/12, shingles typically require double-layer underlayment or specialized self-adhering membranes. Shingles are prohibited on slopes below 2/12, which require continuous low-slope membranes (EPDM, TPO, PVC, or Modified Bitumen). Verify applicable roofing assembly specifications with local building authorities.",
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
              <Triangle className="h-3.5 w-3.5" />
              Roofing Geometry &amp; Rafter Takeoff Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Roof Pitch &amp; Rafter Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate roof pitch in <strong>rise/run</strong>, <strong>slope angles (degrees)</strong>, <strong>common rafter line lengths</strong>, <strong>birdsmouth seat cuts</strong>, <strong>roof surface area</strong>, and <strong>roofing squares (shingle bundles &amp; underlayment)</strong>.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <RoofCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How Roof Pitch Works */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. How Roof Pitch &amp; Slope Multipliers Work
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                In residential roof framing, pitch measures the vertical rise for every 12 inches of horizontal run. The slope multiplier allows you to convert horizontal dimensions directly into sloped lengths:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Pitch Angle Formula:</p>
                  <p>Angle (θ) = arctan(Rise ÷ 12) × (180 ÷ π)</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Slope Multiplier Formula:</p>
                  <p>Slope Factor = √(1 + [Rise/12]²)</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                For example, a 6/12 pitch has an angle of 26.57° and a slope multiplier of 1.1180. A 12-foot horizontal run becomes 12 × 1.1180 = <strong>13.416 ft (13&apos; 5&quot;)</strong> sloped rafter length.
              </p>
            </section>

            {/* Section 2: Standard Roof Pitch Reference Table */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Standard Roof Pitch Reference Table
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Pitch (Rise/12)</th>
                      <th className="p-3">Slope Angle (Degrees)</th>
                      <th className="p-3">Slope Multiplier</th>
                      <th className="p-3">Grade %</th>
                      <th className="p-3">Roofing Material Suitability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2/12</td>
                      <td className="p-3">9.46°</td>
                      <td className="p-3 text-amber-800">1.0138x</td>
                      <td className="p-3">16.67%</td>
                      <td className="p-3 font-sans text-slate-600">Low-slope membrane, double-underlayment shingles</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">4/12</td>
                      <td className="p-3">18.43°</td>
                      <td className="p-3 text-amber-800">1.0541x</td>
                      <td className="p-3">33.33%</td>
                      <td className="p-3 font-sans text-slate-600">Standard ranch, architectural shingles, metal</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">6/12</td>
                      <td className="p-3">26.57°</td>
                      <td className="p-3 text-amber-800">1.1180x</td>
                      <td className="p-3">50.00%</td>
                      <td className="p-3 font-sans text-slate-600">Traditional residential, walkable, excellent drainage</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">8/12</td>
                      <td className="p-3">33.69°</td>
                      <td className="p-3 text-amber-800">1.2019x</td>
                      <td className="p-3">66.67%</td>
                      <td className="p-3 font-sans text-slate-600">Colonial / Cape Cod, rapid snow shedding</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">10/12</td>
                      <td className="p-3">39.81°</td>
                      <td className="p-3 text-amber-800">1.3017x</td>
                      <td className="p-3">83.33%</td>
                      <td className="p-3 font-sans text-slate-600">Steep slope, high architectural visual profile</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">12/12</td>
                      <td className="p-3">45.00°</td>
                      <td className="p-3 text-amber-800">1.4142x</td>
                      <td className="p-3">100.00%</td>
                      <td className="p-3 font-sans text-slate-600">45° steep pitch, A-frames, alpine snow conditions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Anatomy of a Birdsmouth Cut */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                3. Anatomy of a Rafter Birdsmouth Cut
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                A birdsmouth notch transfers downward roof loads onto the exterior wall top plate without creating split failure points:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">1. Seat Cut (Horizontal)</h3>
                  <p className="text-slate-600">
                    The horizontal cut that bears solidly on the wall top plate. Standard bearing width is 3.5 inches for a 2x4 wall or 5.5 inches for a 2x6 wall.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">2. Plumb Cut (Vertical)</h3>
                  <p className="text-slate-600">
                    The vertical cut that rests flush against the exterior sheathing. Its angle matches the roof pitch angle (e.g. 26.57° on a 6/12 pitch).
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">3. Height Above Plate (HAP)</h3>
                  <p className="text-slate-600">
                    The remaining vertical wood depth above the seat cut (also called the &quot;stand&quot;). Never notch more than 1/4 to 1/3 of the rafter depth.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Estimating Roofing Squares & Materials */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="h-6 w-6 text-amber-600" />
                4. How to Calculate Sloped Surface Area &amp; Roofing Squares
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Roofing materials are measured and sold by the <strong>Square (100 sq ft)</strong>. To calculate squares:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-900 font-bold border border-slate-200">
                Roofing Squares = [Flat Footprint with Overhangs (sq ft) × Slope Multiplier] ÷ 100
              </div>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 pt-2">
                <li><strong>Shingle Bundles:</strong> Standard architectural shingles are packaged 3 bundles per square. (10 squares = 30 bundles).</li>
                <li><strong>Synthetic Underlayment:</strong> Standard rolls cover 400 sq ft (4 squares).</li>
                <li><strong>Drip Edge Flashing:</strong> Installed along all eaves and rakes in 10-foot metal pieces with 2-inch overlaps.</li>
                <li><strong>Ridge Cap Shingles:</strong> Installed along the top ridge line (standard bundles cover 33 linear feet).</li>
              </ul>
            </section>

            {/* Section 5: Why Waste Factor is Critical */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                5. Why You Must Add 10% to 15% Roofing Waste
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Unlike paint or siding, roofing installation creates significant cut scrap that cannot be reused:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Simple Gable Roofs</h3>
                  <p className="text-amber-700 font-bold font-mono">10% Waste</p>
                  <p className="text-slate-600">
                    Two rectangular roof planes with starter course cuts and rake edge trimming.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Hip &amp; Valley Roofs</h3>
                  <p className="text-amber-700 font-bold font-mono">15% Waste</p>
                  <p className="text-slate-600">
                    Diagonal cuts along hip ridges and valley flashing channels create 45° offcuts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <h3 className="font-bold text-slate-900">Complex Multi-Dormer</h3>
                  <p className="text-amber-700 font-bold font-mono">20% Waste</p>
                  <p className="text-slate-600">
                    Turrets, intersecting gable dormers, and multiple roof step changes.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Rafter Span vs Geometry */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. Why Structural Rafter Sizing is Separate from Geometry
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                This tool calculates pure geometric lengths and cut angles. However, the physical depth of rafter lumber ($2\times6, 2\times8, 2\times10, 2\times12$) depends on four engineering factors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>Clear Horizontal Span:</strong> Longer spans require deeper lumber (e.g. a 14 ft horizontal run typically requires 2x8 or 2x10 lumber).</li>
                <li><strong>Ground Snow Load:</strong> Northern climates with 50+ PSF snow loads require larger rafters or reduced on-center spacing (16&quot; vs 24&quot; OC).</li>
                <li><strong>Lumber Species &amp; Grade:</strong> Douglas Fir #2 and Southern Yellow Pine span further than Spruce-Pine-Fir (SPF).</li>
                <li><strong>Collar Ties &amp; Ceiling Joists:</strong> Lower ties prevent exterior walls from spreading outward under roof dead load.</li>
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
                    Calculate Your Complete Structural Envelope
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Connect your roof pitch calculations seamlessly with the rest of your build workflow:
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
                        Estimate 4x8/4x12 sheets, joint compound mud, tape, and screws.
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
                        Foundation Slab
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
