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
import { ElectricalLoadCalculatorForm } from "@/components/tools/electrical-load-calculator/electrical-load-form";
import {
  Zap,
  HelpCircle,
  AlertTriangle,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
  Gauge,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Residential Electrical Load Calculator",
  description:
    "Free NEC 220.82 residential electrical load calculator. Estimate service panel capacity in amps and VA for 100A to 200A/400A upgrades, EV chargers, and heat pumps.",
  path: "/electrical/residential-load-calculator",
  keywords: [
    "electrical load calculator",
    "residential electrical load calculator",
    "electrical panel load calculator",
    "nec 220 load calculator",
    "200 amp service load calculator",
    "home electrical load calculation",
    "service load calculation",
    "ev charger electrical panel capacity",
  ],
});

export default function ResidentialLoadCalculatorPage() {
  const breadcrumbs = [
    { name: "Electrical & Conduit", url: "/categories/electrical" },
    {
      name: "Residential Electrical Service Load Calculator",
      url: "/electrical/residential-load-calculator",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "Residential Electrical Service Load Calculator",
    "Free NEC 220.82 residential electrical load calculator. Estimate service panel capacity in amps and VA for 100A to 200A/400A upgrades, EV chargers, and heat pumps.",
    "/electrical/residential-load-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Residential Electrical Service Load Calculator",
    description:
      "Electrical engineering trade calculation utility for single-family residential service panel load calculations per NEC Article 220.82 Optional Method.",
    url: "/electrical/residential-load-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Residential Electrical Service Load (NEC 220.82)",
    "Step-by-step methodology for calculating single-family electrical service demand amperage using the NEC 220.82 Optional Calculation method.",
    [
      {
        name: "Calculate General Lighting & Small Appliance Load",
        text: "Multiply conditioned floor area by 3 VA/sq ft. Add 1,500 VA for each small appliance branch circuit (minimum 2 circuits = 3,000 VA) and 1,500 VA for the laundry circuit.",
      },
      {
        name: "Sum Fixed Household Appliances",
        text: "Add nameplate ratings for electric range (8,000+ W), electric dryer (minimum 5,000 W), water heater (4,500 W), dishwasher, disposal, and microwave.",
      },
      {
        name: "Apply General Load Demand Factors",
        text: "Take the first 10,000 VA of the gross general load at 100%, and apply a 40% demand factor to all remaining volt-amperes over 10,000 VA.",
      },
      {
        name: "Select Non-Coincident HVAC Load",
        text: "Compare total air conditioning load against heating load. Select the largest load at 100% and omit the smaller non-coincident load per NEC 220.82(C).",
      },
      {
        name: "Add Continuous EVSE & Compute Service Amps",
        text: "Add Level 2 EV charger load at 125% continuous rating. Sum total demand VA and divide by 240V to determine required service panel amperage.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do you calculate residential electrical service load?",
      answer:
        "Under the NEC Article 220.82 Optional Method: calculate general lighting at 3 VA/sq ft, add 4,500 VA for small appliance and laundry circuits, and add fixed appliance nameplates (range, dryer, water heater). Apply demand factors: the first 10,000 VA at 100% and the remainder at 40%. Next, add the largest of heating or cooling at 100%, and add EV chargers at 125%. Divide total calculated VA by 240 volts to find service amperage.",
    },
    {
      question: "What is the difference between connected load and calculated demand load?",
      answer:
        "Connected load is the raw arithmetic sum of all electrical appliances operating at 100% maximum capacity simultaneously. Calculated demand load applies NEC statistical demand factors (such as the 40% reduction on general loads over 10 kVA and the non-coincident rule between heating and cooling) because household appliances are never all energized at peak draw at the exact same moment.",
    },
    {
      question: "When is a 100-amp service panel upgrade to 200-amp required?",
      answer:
        "A service upgrade is required when the calculated NEC demand load exceeds 100 amps (24,000 VA). Upgrades to 200A are typically triggered when adding a Level 2 EV charger (32A–48A), converting from gas to a whole-house heat pump with electric resistance backup (40A–60A), installing an induction range (40A), or adding a hot tub/spa (50A).",
    },
    {
      question: "How does an EV charger impact electrical panel load?",
      answer:
        "Under NEC Article 625, electric vehicle supply equipment (EVSE) is classified as a continuous load. A standard 32-amp Level 2 charger requires a 40-amp circuit and contributes 9,600 VA (32A × 240V × 1.25) to the service calculation. A 48-amp charger contributes 14,400 VA (60A continuous load), consuming over 60% of a 100-amp panel's total capacity.",
    },
    {
      question: "What is the NEC 220.82 non-coincident HVAC load rule?",
      answer:
        "Because residential air conditioning and central heating do not operate simultaneously at full peak capacity, NEC 220.82(C) requires calculating both cooling and heating loads and including only the larger of the two in the final service calculation. The smaller load is completely dropped.",
    },
    {
      question: "Can I add a heat pump to a 100-amp electrical panel?",
      answer:
        "It depends on other household appliances. If cooking, clothes drying, and water heating use natural gas, a modern 2.0-to-3.0-ton inverter heat pump (drawing 15A–20A compressor load) often fits on a 100A panel. However, if the home has an electric range, electric water heater, and 10 kW supplemental heat strips, total demand will almost certainly exceed 100A and require a 200A service upgrade.",
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
              NEC Article 220.82 Optional Calculation Method
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Residential Electrical Service Load Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate residential electrical service demand load (Amps and kVA) per <strong>NEC Article 220.82</strong>. Evaluate existing 100A panels against proposed 200A/400A service upgrades for EV chargers, heat pumps, electric ranges, and home additions.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <ElectricalLoadCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: NEC 220.82 Optional Method Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. NEC Article 220.82 Optional Calculation Method
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                The National Electrical Code (NEC) provides two calculation methods for single-family residential service sizing: the <strong>Standard Method (Part III)</strong> and the <strong>Optional Method (NEC 220.82, Part IV)</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Zap className="h-4 w-4" />
                    <h3>NEC 220.82 Optional Method (Recommended)</h3>
                  </div>
                  <p className="text-slate-600">
                    Permitted for single-family homes with 100A or larger service. It aggregates general lighting (3 VA/sq ft), small appliance circuits, and all fixed appliances into a single general pool, taking the first 10 kVA at 100% and remainder at 40%, plus the largest non-coincident HVAC load.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Scale className="h-4 w-4" />
                    <h3>Standard Method (Part III, NEC 220.40–220.55)</h3>
                  </div>
                  <p className="text-slate-600">
                    A multi-table line-by-line method with separate demand factors for general lighting (Table 220.42), electric dryers (Table 220.54), and ranges (Table 220.55). It is more complex and typically produces slightly higher calculated amperage.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: General Demand Factor Math Breakdown */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                2. General Load Demand Tiering (10 kVA @ 100% + Remainder @ 40%)
              </h2>
              <div className="bg-slate-900 text-slate-100 p-5 rounded-lg space-y-3 font-mono text-xs sm:text-sm">
                <p className="text-amber-400 font-bold uppercase font-sans">
                  General Load Demand Equation (NEC 220.82(B)):
                </p>
                <div className="text-base sm:text-lg font-bold text-white bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  Calculated Demand VA = 10,000 + 0.40 &times; (Gross General VA &minus; 10,000)
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">
                  Where Gross General VA includes General Lighting (3 VA/sq ft) + Small Appliance Circuits (3,000 VA) + Laundry (1,500 VA) + Range + Dryer + Water Heater + Dishwasher + Disposal + Microwave. The 40% factor reflects real-world residential diversity where appliances do not run concurrently.
                </p>
              </div>
            </section>

            {/* Section 3: Non-Coincident HVAC Sizing Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Gauge className="h-6 w-6 text-amber-600" />
                3. Non-Coincident HVAC Loads (Heating vs. Cooling)
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Under <strong>NEC 220.82(C)</strong>, heating and air conditioning are treated as non-coincident loads because they do not operate at peak capacity simultaneously. The calculation evaluates:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">HVAC Equipment Configuration</th>
                      <th className="p-3">NEC 220.82(C) Rule</th>
                      <th className="p-3 text-right">Typical Nameplate (Watts)</th>
                      <th className="p-3 text-right">Calculated Load (Amps @ 240V)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Central Air Conditioner</td>
                      <td className="p-3 text-slate-600">100% nameplate rating</td>
                      <td className="p-3 text-right font-mono text-amber-800">3,500 W (3-Ton)</td>
                      <td className="p-3 text-right font-mono">14.6 A</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Heat Pump (No Strip Heat)</td>
                      <td className="p-3 text-slate-600">100% compressor heating rating</td>
                      <td className="p-3 text-right font-mono text-amber-800">3,500 W</td>
                      <td className="p-3 text-right font-mono">14.6 A</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Heat Pump + 10 kW Electric Strip</td>
                      <td className="p-3 text-slate-600">100% compressor + 100% supplemental strip</td>
                      <td className="p-3 text-right font-mono text-amber-800">13,500 W</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-800">56.3 A</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Central Electric Furnace</td>
                      <td className="p-3 text-slate-600">100% nameplate heating rating</td>
                      <td className="p-3 text-right font-mono text-amber-800">15,000 W (15 kW)</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-800">62.5 A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: EV Charger Continuous Load Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                4. EV Charger Continuous Load Rules (NEC 625 &amp; 125% Factor)
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  Why Level 2 EV Chargers Draw 125% Continuous Duty
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Electric vehicle chargers operate continuously for 3 hours or more, subjecting electrical breakers, feeder conductors, and panel bus bars to sustained thermal buildup:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>32-Amp Charger (40A Breaker):</strong> Draws 32A continuous = 7,680 W &times; 1.25 = <strong>9,600 VA (40A Load)</strong>.</li>
                  <li><strong>40-Amp Charger (50A Breaker):</strong> Draws 40A continuous = 9,600 W &times; 1.25 = <strong>12,000 VA (50A Load)</strong>.</li>
                  <li><strong>48-Amp Charger (60A Breaker):</strong> Draws 48A continuous = 11,520 W &times; 1.25 = <strong>14,400 VA (60A Load)</strong>.</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Real-World NEC Calculation Scenarios */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-600" />
                5. Real-World NEC Calculation Scenarios
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Step-by-step mathematical solutions and code citations for fixed heating and branch service loads:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/solutions/baseboard-heater-7000w-240v-service-load"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC 220.51
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Baseboard Heater 7,000W 240V
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Step-by-step NEC calculation for a 7,000W, 240V electric baseboard heater continuous load.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Direct Result:</span>
                      36.46 A (40A Overcurrent Protection)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/solutions/range-service-load-12kw-household-single-phase"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC Table 220.55
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      12 kW Electric Range Demand
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Calculate minimum service demand for a 12 kW household range using Table 220.55 Column C.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Direct Result:</span>
                      8 kW Demand / 33.33 A Load (Min 40A)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/solutions/residential-dryer-feeder-load-5000w-240v"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC Article 220.54
                      </span>
                      <span className="text-xs font-mono text-slate-500">Solved</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      5,000W Electric Clothes Dryer
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Calculate service feeder load for an electric clothes dryer under NEC 220.54 minimums.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Direct Result:</span>
                      20.83 A Load (Requires 30A with 10 AWG)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </div>
            </section>

            {/* Reciprocal Electrical Ecosystem Hub */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    The 4-Node Electrical &amp; HVAC Authority Hub
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Complete Your Electrical Service Design Workflow
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Once service amperage is calculated, size your service entrance feeders, conduit raceways, junction boxes, and HVAC circuits:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/electrical/voltage-drop-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 2: Feeder Wire Size
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Wire Size &amp; Voltage Drop Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Size 2/0 copper or 4/0 aluminum conductors for 200A service feeders and subpanels.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Feeder Wire <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/conduit-fill-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 3: Service Conduit
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Conduit Fill &amp; Trade Size Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Size 2&quot; or 2-1/2&quot; EMT / PVC Schedule 80 mast raceways for service entrance cables.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Conduit <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/box-fill-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 4: Box Capacity
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Electrical Box Fill Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Verify cubic-inch volume for panel gutters, subpanel tap boxes, and disconnects.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Box Fill <ArrowRight className="h-4 w-4 ml-1" />
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
