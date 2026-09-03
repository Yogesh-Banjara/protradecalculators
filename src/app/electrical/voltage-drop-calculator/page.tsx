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
import { VoltageDropCalculatorForm } from "@/components/tools/voltage-drop-calculator/voltage-drop-form";
import {
  Zap,
  HelpCircle,
  AlertTriangle,
  Layers,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Voltage Drop & Wire Size Calculator",
  description:
    "Free wire size and voltage drop calculator for single-phase, 3-phase, and DC circuits. Features NEC Table 310.16 ampacity, copper vs aluminum, and derating.",
  path: "/electrical/voltage-drop-calculator",
  keywords: [
    "voltage drop calculator",
    "wire size calculator",
    "wire gauge calculator",
    "electrical wire size calculator",
    "120v voltage drop calculator",
    "240v voltage drop calculator",
    "wire size for 100 amp subpanel",
    "copper vs aluminum wire size",
    "ampacity derating calculator",
  ],
});

export default function VoltageDropCalculatorPage() {
  const breadcrumbs = [
    { name: "Electrical & Conduit", url: "/categories/electrical" },
    {
      name: "Electrical Wire Size & Voltage Drop Calculator",
      url: "/electrical/voltage-drop-calculator",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "Electrical Wire Size & Voltage Drop Calculator",
    "Free electrical wire size and voltage drop calculator for single-phase, 3-phase, and DC circuits with NEC Table 310.16 ampacity and copper vs aluminum comparisons.",
    "/electrical/voltage-drop-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Electrical Wire Size & Voltage Drop Calculator",
    description:
      "Trade calculator for single-phase, 3-phase, and DC voltage drop, conductor gauge recommendation (14 AWG to 1000 kcmil), copper vs aluminum comparison, and NEC 310.16 derating.",
    url: "/electrical/voltage-drop-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Wire Size and Voltage Drop",
    "A guide for electricians and builders to calculate conductor wire gauge, voltage drop percentage, and NEC Table 310.16 ampacity.",
    [
      {
        name: "Determine System Voltage and Phase",
        text: "Select your nominal voltage (120V, 208V, 240V, 480V, or DC) and system phase (single-phase AC, 3-phase AC, or DC).",
      },
      {
        name: "Calculate Load Current and Continuous Factor",
        text: "Enter the full load current in Amperes. If the circuit runs for 3 or more continuous hours (such as an EV charger or water heater), apply the NEC 125% continuous load sizing factor.",
      },
      {
        name: "Measure One-Way Circuit Distance",
        text: "Measure the one-way distance along the cable run from the electrical source breaker panel to the load terminal in feet.",
      },
      {
        name: "Evaluate Conductor Material and NEC Ampacity",
        text: "Choose copper or aluminum conductors and verify that the derated ampacity (NEC Table 310.16) meets or exceeds the design current.",
      },
      {
        name: "Verify Voltage Drop Under 3% Target",
        text: "Ensure the total voltage drop is within the NEC recommended 3% limit for branch circuits and 5% for total feeder systems.",
      },
    ]
  );

  const faqItems = [
    {
      question: "What is the maximum acceptable voltage drop according to the National Electrical Code (NEC)?",
      answer:
        "The NEC recommends a maximum voltage drop of 3% on branch circuits (NEC 210.19(A) Informational Note 4) and a maximum total voltage drop of 5% across both the feeder and branch circuit combined (NEC 215.2(A)(1) Informational Note 2) to ensure reasonable efficiency of operation.",
    },
    {
      question: "What is the difference between single-phase and 3-phase voltage drop formulas?",
      answer:
        "Single-phase circuits require current to travel out along the hot conductor and return via the neutral (a 2-wire round trip), using the multiplier 2.0: Vdrop = (2 × K × I × D) / CM. Three-phase circuits share return currents among phases 120° apart, reducing effective resistance by using the multiplier √3 (~1.732): Vdrop = (√3 × K × I × D) / CM.",
    },
    {
      question: "When should I use aluminum wire instead of copper?",
      answer:
        "Aluminum (typically 8000-series alloy such as XHHW-2 or USE-2) is commonly used for heavy feeder circuits (100A, 150A, 200A subpanels and main services) because it is significantly lighter and less expensive than copper. However, because aluminum has higher resistivity (K = 21.2 vs 12.9 for copper), it requires upsizing by approximately one to two AWG gauge sizes.",
    },
    {
      question: "Why does voltage drop matter for EV chargers and subpanels?",
      answer:
        "Level 2 EV chargers draw heavy continuous loads (e.g. 48A on a 60A circuit) for 4 to 10 hours continuously. Excessive voltage drop results in power wasted as heat in walls or conduit, slower vehicle charging rates, and potential thermal tripping of breakers.",
    },
    {
      question: "How does ambient temperature affect conductor ampacity?",
      answer:
        "Conductor insulation ratings (60°C, 75°C, 90°C) are calibrated for a 30°C (86°F) ambient baseline. When cables run through hot attics, commercial roofs, or exterior conduit in direct sunlight (temperatures of 104°F to 140°F), NEC Table 310.15(B)(1) requires derating conductor ampacity by 10% to 50% to prevent insulation degradation.",
    },
    {
      question: "What is circular mils (CM) and why is it used to size wire?",
      answer:
        "Circular mils (CM) is a standard unit of cross-sectional area for electrical conductors. One circular mil equals the area of a circle with a diameter of 1 mil (0.001 inch). Larger conductors have higher CM values, which reduces electrical resistance and lowers voltage drop.",
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
              <Zap className="h-3.5 w-3.5" />
              NEC Electrical Engineering &amp; Wire Sizing Utility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Electrical Wire Size &amp; Voltage Drop Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate single-phase, 3-phase, and DC <strong>voltage drop</strong>, <strong>recommended AWG/kcmil wire gauge</strong>, <strong>copper vs aluminum comparisons</strong>, and <strong>NEC Table 310.16 ampacity derating</strong>.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <VoltageDropCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: How Voltage Drop is Calculated */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. How Voltage Drop is Calculated (Engineering Formulas)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Voltage drop occurs when electrical current passes through the inherent resistance of a conductor over distance. The standard IEEE and National Electrical Code formulas calculate voltage drop based on conductor resistivity (K), load current (I), one-way distance (D), and conductor cross-sectional area in circular mils (CM):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Single-Phase AC &amp; DC Circuits:</p>
                  <p>Vdrop = (2 × K × I × D) ÷ CM</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-xs sm:text-sm text-slate-900 font-bold border border-slate-200 space-y-1">
                  <p className="text-slate-500 font-sans font-semibold">Three-Phase AC Circuits:</p>
                  <p>Vdrop = (√3 × K × I × D) ÷ CM</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Where K represents conductor resistivity at 75°C (12.9 &Omega;&middot;cmil/ft for Copper and 21.2 &Omega;&middot;cmil/ft for Aluminum), I is load current in amperes, D is one-way distance in feet, and CM is circular mils.
              </p>
            </section>

            {/* Section 2: Copper vs Aluminum Trade-Offs */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Copper vs. Aluminum Conductors: Performance &amp; Sizing
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Copper is a superior conductor with 64% lower electrical resistance than aluminum, but modern 8000-series aluminum alloy provides substantial cost and weight savings for heavy feeders:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Conductor Material</th>
                      <th className="p-3">Resistivity (K @ 75°C)</th>
                      <th className="p-3">Standard Sizing Advantage</th>
                      <th className="p-3">Typical Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Copper (Cu)</td>
                      <td className="p-3 text-amber-800 font-bold">12.9 &Omega;&middot;cmil/ft</td>
                      <td className="p-3 text-slate-700 font-sans">Smaller conduit fill, higher ampacity per gauge</td>
                      <td className="p-3 font-sans text-slate-600">Branch circuits (15A–50A), EV chargers, tight conduits</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Aluminum (Al)</td>
                      <td className="p-3 text-slate-700 font-bold">21.2 &Omega;&middot;cmil/ft</td>
                      <td className="p-3 text-slate-700 font-sans">Lower material cost, lighter cable pulling weight</td>
                      <td className="p-3 font-sans text-slate-600">Main electrical services, 100A/200A subpanels, long exterior feeders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: 120V vs 240V Voltage Drop Sensitivity */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-6 w-6 text-amber-600" />
                3. 120V vs. 240V Circuits: Why 120V Drops Twice as Fast
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Because voltage drop percentage is relative to system voltage (Drop % = Vdrop ÷ Vsystem), a 120V circuit suffers <strong>twice the percentage drop</strong> of a 240V circuit carrying the exact same current over the same distance:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">120V Circuit (15A @ 100 ft, 14 AWG)</h3>
                  <p className="text-slate-600">
                    Voltage drop is <strong>9.42V</strong>, which equals a severe <strong>7.85% drop</strong> (delivers only 110.58V). Requires upsizing to 10 AWG or 8 AWG to maintain 3% or lower drop.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900">240V Circuit (15A @ 100 ft, 14 AWG)</h3>
                  <p className="text-slate-600">
                    Voltage drop is still <strong>9.42V</strong>, but represents only a <strong>3.92% drop</strong> (delivers 230.58V).
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: NEC 3% and 5% Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
                4. NEC Voltage Drop Recommendations (3% Branch / 5% Total)
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                While the National Electrical Code does not mandate voltage drop limits as a hard violation in all residential installations, it specifies critical engineering recommendations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>NEC 210.19(A) Informational Note 4:</strong> Branch circuits should be sized for a maximum voltage drop of 3% at the furthest outlet.</li>
                <li><strong>NEC 215.2(A)(1) Informational Note 2:</strong> Feeder conductors should not exceed 3% drop, and total drop across both feeder and branch conductors should not exceed 5%.</li>
                <li><strong>Equipment Protection:</strong> Motors subjected to low voltage draw excessive current and overheat; sensitive electronics and LED drivers flicker or shut down when voltage drops below 95% of nominal.</li>
              </ul>
            </section>

            {/* Section 5: EV Charger Wire Sizing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="h-6 w-6 text-amber-600" />
                5. Level 2 EV Charger Wire Sizing &amp; Continuous Loads
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Electric vehicle charging stations are classified as continuous loads under NEC Article 625, requiring circuit conductors and overcurrent devices to be sized at <strong>125% of the charger&apos;s rated amperage</strong>:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">EV Charger Continuous Load</th>
                      <th className="p-3">125% Design Current</th>
                      <th className="p-3">Breaker Size</th>
                      <th className="p-3">Min Copper Wire (Up to 75 ft)</th>
                      <th className="p-3">Long Run Copper (100–150 ft)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">32A Charger</td>
                      <td className="p-3">40A</td>
                      <td className="p-3">40A Breaker</td>
                      <td className="p-3 text-amber-800 font-bold">8 AWG Copper</td>
                      <td className="p-3 font-sans text-slate-600">6 AWG Copper</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">40A Charger</td>
                      <td className="p-3">50A</td>
                      <td className="p-3">50A Breaker</td>
                      <td className="p-3 text-amber-800 font-bold">6 AWG Copper</td>
                      <td className="p-3 font-sans text-slate-600">4 AWG Copper</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">48A Charger (Hardwired)</td>
                      <td className="p-3">60A</td>
                      <td className="p-3">60A Breaker</td>
                      <td className="p-3 text-amber-800 font-bold">6 AWG (90°C) or 4 AWG</td>
                      <td className="p-3 font-sans text-slate-600">4 AWG or 2 AWG Copper</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Subpanel & Long Feeder Runs */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                6. Sizing 100A &amp; 200A Subpanel Feeders for Workshops &amp; Garages
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                When running electrical subpanels to detached garages, workshops, or outbuildings over distances of 100 to 300 feet, voltage drop almost always dictates conductor sizing before thermal ampacity:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>100A Subpanel (50 ft run):</strong> 4 AWG Copper or 2 AWG Aluminum (0.8% drop).</li>
                <li><strong>100A Subpanel (150 ft run):</strong> 1 AWG Copper or 2/0 Aluminum (2.3% drop).</li>
                <li><strong>100A Subpanel (300 ft run):</strong> 3/0 Copper or 250 kcmil Aluminum (2.8% drop).</li>
                <li><strong>200A Service (200 ft run):</strong> 4/0 Copper or 350 kcmil Aluminum (2.4% drop).</li>
              </ul>
            </section>

            {/* Section 7: Common Wire Sizing Mistakes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                7. Common Electrical Wire Sizing Mistakes to Avoid
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Critical Safety &amp; Code Traps
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Ignoring Terminal Temperature Ratings:</strong> Breakers and lugs rated for 75°C must use the 75°C column of NEC Table 310.16, even if using 90°C THHN wire.</li>
                  <li><strong>Forgetting Rooftop Solar Conduit Derating:</strong> Exterior conduits on hot rooftops can reach 140°F+, requiring up to 50% ampacity derating.</li>
                  <li><strong>Using Small Aluminum Conductors:</strong> Aluminum smaller than 8 AWG is restricted in residential branch wiring due to oxidation and thermal expansion hazards.</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Contextual Related Electrical Calculators */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Related Electrical Calculators
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Complete Your Electrical Feeder &amp; Raceway Planning
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Upsizing conductors for distance affects conduit fill and panel capacity. Use our related electrical instruments to complete your takeoff:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/guides/subpanel-feeder-sizing"
                    className="p-4 rounded-lg bg-amber-500/10 border-2 border-amber-500/40 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Technical Guide
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Subpanel Feeder Conductor Sizing by Distance
                      </span>
                      <p className="text-xs text-slate-300 pt-1">
                        Comprehensive guide on how breaker size, copper vs aluminum, and 3% voltage drop interact on 50–300 ft runs.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Read Feeder Sizing Guide <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/conduit-fill-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Raceway Sizing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Electrical Conduit Fill Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Verify EMT, PVC, and RMC conduit trade sizes for upsized wire gauges per NEC Chapter 9 tables.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Check Conduit Fill Capacity <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/residential-load-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Service Panel Load
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Residential Service Load Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate total home electrical load in Amps and VA per NEC 220.82 for 100A, 200A, or 400A panels.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Service Panel Load <ArrowRight className="h-4 w-4 ml-1" />
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
