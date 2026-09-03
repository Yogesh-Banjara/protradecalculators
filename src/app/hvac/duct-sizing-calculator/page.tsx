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
import { DuctCalculatorForm } from "@/components/tools/duct-calculator/duct-form";
import {
  Wind,
  HelpCircle,
  AlertTriangle,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
  Maximize2,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "HVAC Duct Sizing Calculator - CFM",
  description:
    "Free HVAC duct sizing calculator. Calculate round duct diameters, rectangular equivalents (Huebscher), air velocity (FPM), friction loss, and room branch CFM schedules.",
  path: "/hvac/duct-sizing-calculator",
  keywords: [
    "duct sizing calculator",
    "duct size calculator",
    "duct cfm calculator",
    "hvac duct sizing calculator",
    "air duct sizing calculator",
    "round duct size calculator",
    "rectangular duct sizing calculator",
    "cfm to duct size chart",
  ],
});

export default function DuctSizingCalculatorPage() {
  const breadcrumbs = [
    { name: "HVAC & Airflow", url: "/categories/hvac" },
    {
      name: "HVAC Duct Sizing & CFM Airflow Calculator",
      url: "/hvac/duct-sizing-calculator",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "HVAC Duct Sizing & CFM Airflow Calculator",
    "Free HVAC duct sizing calculator. Calculate round duct diameters, rectangular equivalents (Huebscher), air velocity (FPM), friction loss, and room branch CFM schedules.",
    "/hvac/duct-sizing-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "HVAC Duct Sizing & CFM Airflow Calculator",
    description:
      "Trade calculation utility for sizing residential and commercial HVAC round ducts and rectangular equivalents using equal-friction and velocity reduction hydrodynamic principles.",
    url: "/hvac/duct-sizing-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Size HVAC Air Ducts (CFM & Equal Friction)",
    "A practical engineering guide for HVAC contractors and apprentices to size supply trunks and branch runouts.",
    [
      {
        name: "Determine System Airflow (CFM)",
        text: "Calculate total required airflow in cubic feet per minute (CFM) based on cooling equipment tonnage (typically 400 CFM per ton of AC) or individual room heat load requirements.",
      },
      {
        name: "Select Sizing Method & Design Friction Rate",
        text: "Choose the equal friction method with a standard residential design friction loss rate (0.08 in. w.g. per 100 ft of duct length) or a velocity limit (500 to 900 FPM).",
      },
      {
        name: "Calculate Theoretical & Standard Round Duct Diameter",
        text: "Compute the hydrodynamic round diameter and select the nearest standard factory round duct size (e.g. 6\", 8\", 10\", 12\", 14\").",
      },
      {
        name: "Convert to Rectangular Equivalent (Huebscher Formula)",
        text: "If joist bay height is restricted, calculate rectangular width for a fixed height (e.g. 8\" or 10\" deep) using Huebscher's equivalent diameter formula.",
      },
      {
        name: "Verify Velocity & Acoustic Noise Thresholds",
        text: "Check that actual air velocity remains below 900 FPM in residential trunks and below 700 FPM in branch runouts to avoid whistling and register noise.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do you calculate duct size from CFM?",
      answer:
        "Duct size is calculated using the equal friction method or velocity equation (CFM = Area × Velocity). Under the standard residential equal friction rate of 0.08 in. w.g. per 100 ft, 400 CFM requires an 8\" round duct (or 10\" × 6\" rectangular), 800 CFM requires a 12\" round duct (or 14\" × 8\" rectangular), and 1,200 CFM requires a 14\" round duct (or 20\" × 8\" rectangular).",
    },
    {
      question: "What is the standard CFM per ton of air conditioning?",
      answer:
        "The standard industry baseline is 400 CFM per ton of nominal cooling capacity. In humid climates where extra moisture removal is desired, airflow is often reduced to 350 CFM/ton to maximize latent dehumidification. In arid desert climates, airflow is increased to 450 CFM/ton to maximize sensible cooling efficiency.",
    },
    {
      question: "What is the equal friction method for duct sizing?",
      answer:
        "The equal friction method sizes ductwork so that every 100 feet of duct length experiences the exact same frictional resistance and static pressure drop (typically 0.08 in. w.g. per 100 ft for residential supply ducts). As air is diverted into branch runs, duct dimensions automatically reduce to maintain constant pressure gradient.",
    },
    {
      question: "How do you convert a round duct to a rectangular duct?",
      answer:
        "Rectangular ducts cannot be sized purely by matching cross-sectional square inches because rectangular ducts have more surface perimeter, creating higher friction. Engineers use Huebscher's formula: De = 1.30 × (a × b)^0.625 / (a + b)^0.250. For example, a 12\" round duct (113 sq in) requires a 14\" × 8\" rectangular duct (112 sq in) for identical pressure drop.",
    },
    {
      question: "What is the maximum recommended air velocity in residential ducts?",
      answer:
        "To prevent acoustic air turbulence and whistling at supply registers, residential main supply trunks should stay between 700 and 900 FPM, branch runouts between 500 and 700 FPM, and return air grilles below 400 to 500 FPM.",
    },
    {
      question: "Why does flexible duct require larger sizing than sheet metal?",
      answer:
        "Flexible duct has an internal spiral wire rib helix that creates significant surface turbulence. Even when installed fully stretched, flex duct exhibits roughly 30% to 50% higher friction resistance than smooth galvanized sheet metal. For equal airflow and pressure drop, flex duct requires roughly a 1\" larger nominal diameter.",
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
              <Wind className="h-3.5 w-3.5" />
              HVAC Hydrodynamic Airflow Sizing Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              HVAC Duct Sizing &amp; CFM Airflow Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate round duct diameters, rectangular equivalent dimensions (Huebscher), air velocity (FPM), friction loss, and room branch distribution schedules using standard <strong>equal friction</strong> and velocity reduction methods.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <DuctCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: Equal Friction vs Velocity Method */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. Equal Friction vs. Velocity Reduction Sizing Methods
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Proper duct sizing balances fan static pressure against acoustic comfort. Two primary hydrodynamic sizing methods are used in HVAC engineering:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Wind className="h-4 w-4" />
                    <h3>Equal Friction Method (Standard Design)</h3>
                  </div>
                  <p className="text-slate-600">
                    Sizes all duct sections for a constant pressure drop per 100 ft of equivalent length (typically 0.08 in. w.g. for residential systems). As air is delivered to rooms, duct sizes reduce automatically to maintain constant pressure.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-bold">
                    <Maximize2 className="h-4 w-4" />
                    <h3>Velocity Reduction Method (Acoustic Control)</h3>
                  </div>
                  <p className="text-slate-600">
                    Sizes ducts based on target maximum air velocity (FPM). Starting at the fan discharge with 700–900 FPM, velocity is stepped down to 500–600 FPM in branch runs to ensure quiet operation in sound-sensitive bedrooms.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: CFM to Round Duct Size Quick Reference */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Standard Round Duct Airflow Capacity Table (0.08 in. w.g.)
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Standard galvanized sheet metal round duct capacities at 0.08 in. w.g. friction rate and residential velocity limits:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Round Duct Diameter</th>
                      <th className="p-3 text-right">Airflow Range (CFM)</th>
                      <th className="p-3 text-right">Air Velocity (FPM)</th>
                      <th className="p-3">Rectangular Equivalent (8&quot; Depth)</th>
                      <th className="p-3">Typical Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">5&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">40 &ndash; 65 CFM</td>
                      <td className="p-3 text-right font-mono">450 FPM</td>
                      <td className="p-3 text-slate-600">6&quot; &times; 4&quot;</td>
                      <td className="p-3 text-slate-600">Small bathroom, powder room, walk-in closet</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">6&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">75 &ndash; 110 CFM</td>
                      <td className="p-3 text-right font-mono">530 FPM</td>
                      <td className="p-3 text-slate-600">8&quot; &times; 6&quot;</td>
                      <td className="p-3 text-slate-600">Standard secondary bedroom branch run</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">7&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">120 &ndash; 165 CFM</td>
                      <td className="p-3 text-right font-mono">600 FPM</td>
                      <td className="p-3 text-slate-600">10&quot; &times; 6&quot;</td>
                      <td className="p-3 text-slate-600">Medium bedroom, kitchen supply branch</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">8&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">180 &ndash; 260 CFM</td>
                      <td className="p-3 text-right font-mono">680 FPM</td>
                      <td className="p-3 text-slate-600">10&quot; &times; 8&quot;</td>
                      <td className="p-3 text-slate-600">Primary master bedroom, living room zone</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">10&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">350 &ndash; 500 CFM</td>
                      <td className="p-3 text-right font-mono">780 FPM</td>
                      <td className="p-3 text-slate-600">14&quot; &times; 8&quot;</td>
                      <td className="p-3 text-slate-600">1.0-Ton zone, open great room trunk</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">12&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">600 &ndash; 850 CFM</td>
                      <td className="p-3 text-right font-mono">870 FPM</td>
                      <td className="p-3 text-slate-600">18&quot; &times; 8&quot;</td>
                      <td className="p-3 text-slate-600">2.0-Ton main trunk line</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">14&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">900 &ndash; 1,300 CFM</td>
                      <td className="p-3 text-right font-mono">920 FPM</td>
                      <td className="p-3 text-slate-600">22&quot; &times; 8&quot; (or 18&quot; &times; 10&quot;)</td>
                      <td className="p-3 text-slate-600">3.0-Ton whole-house main supply trunk</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">16&quot; Round</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-800">1,400 &ndash; 1,800 CFM</td>
                      <td className="p-3 text-right font-mono">980 FPM</td>
                      <td className="p-3 text-slate-600">26&quot; &times; 10&quot;</td>
                      <td className="p-3 text-slate-600">4.0-Ton whole-house main supply trunk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Huebscher Equivalent Diameter Equation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                3. Converting Round to Rectangular Ducts (Huebscher Formula)
              </h2>
              <div className="bg-slate-900 text-slate-100 p-5 rounded-lg space-y-3 font-mono text-xs sm:text-sm">
                <p className="text-amber-400 font-bold uppercase font-sans">
                  Huebscher&apos;s Equivalent Diameter Equation (ASHRAE Fundamentals):
                </p>
                <div className="text-base sm:text-lg font-bold text-white bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  D<sub>e</sub> = 1.30 &times; (a &times; b)<sup>0.625</sup> / (a + b)<sup>0.250</sup>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">
                  Where <em>a</em> is duct width (inches), <em>b</em> is duct height (inches), and <em>D<sub>e</sub></em> is the equivalent round diameter. A rectangular duct must always have slightly more internal cross-sectional area than a round duct because its perimeter-to-area ratio creates higher air friction.
                </p>
              </div>
            </section>

            {/* Section 4: Flexible Duct vs Sheet Metal Sag Penalties */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                4. Flexible Duct Friction &amp; Installation Sag Penalties
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Why Flex Duct Requires a +15% Diameter Allowance
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Flexible wire-helix duct has internal corrugated ribs that increase air friction by <strong>30% to 50%</strong> compared to smooth galvanized sheet metal:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Pull Tight:</strong> Flex duct must be pulled tight with maximum 4% sag between supports. A 7% sag increases pressure drop by more than 100%.</li>
                  <li><strong>Use Rigid Elbows:</strong> Sharp 90&deg; bends in flex duct severely pinch airflow. Always use rigid sheet metal elbows for turns.</li>
                  <li><strong>Size Up:</strong> If a room calculation requires a 7&quot; round metal duct, install an <strong>8&quot; flex duct</strong> to deliver the same CFM.</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Reciprocal Trade Ecosystem Hub */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interconnected HVAC, Construction &amp; Electrical Hub
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Connect Duct Sizing to Equipment Loads, Framing &amp; Power
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Duct airflow distribution connects directly with heating/cooling BTU loads, wall stud framing chases, and blower motor electrical circuits:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/hvac/btu-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 1: System Capacity
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        HVAC BTU Heating &amp; Cooling Load Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate room-by-room heating/cooling loads and determine required system CFM (400 CFM/ton).
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Thermal Load <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/framing-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Wall Framing Chases
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Wall Framing &amp; Stud Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Plan 16&quot; and 24&quot; OC wall stud bays for return air panning and supply riser ducts.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Framing <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/voltage-drop-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Blower Motor Circuit
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Voltage Drop &amp; Wire Size Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Size 120V/240V dedicated electrical circuits for air handler ECM blower fans.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Wire Size <ArrowRight className="h-4 w-4 ml-1" />
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
