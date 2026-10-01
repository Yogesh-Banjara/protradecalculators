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
import { BoxFillCalculatorForm } from "@/components/tools/box-fill-calculator/box-fill-form";
import {
  Layers,
  HelpCircle,
  AlertTriangle,
  Scale,
  CheckCircle2,
  ArrowRight,
  Compass,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Electrical Box Fill Calculator - NEC 314.16",
  description:
    "Calculate electrical box fill cubic inches per NEC 314.16. Size standard metal and plastic boxes for mixed wire gauges, device yokes, clamps, and grounds.",
  path: "/electrical/box-fill-calculator",
  keywords: [
    "electrical box fill calculator",
    "box fill calculator",
    "nec box fill calculator",
    "nec 314.16 calculator",
    "how to calculate box fill",
    "4x4 box fill capacity",
    "junction box volume calculator",
    "device yoke allowance",
  ],
});

export default function BoxFillCalculatorPage() {
  const breadcrumbs = [
    { name: "Electrical & Conduit", url: "/categories/electrical" },
    {
      name: "Electrical Box Fill Calculator",
      url: "/electrical/box-fill-calculator",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "Electrical Box Fill Calculator - NEC 314.16 Volume Sizing",
    "Calculate electrical box fill cubic inches per NEC 314.16. Size standard metal and plastic boxes for mixed wire gauges, device yokes, clamps, and grounds.",
    "/electrical/box-fill-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Electrical Box Fill & Enclosure Sizing Calculator",
    description:
      "Trade utility for calculating electrical junction and device box volume requirements per NEC 314.16 for mixed conductor gauges, device yokes, clamps, and grounds.",
    url: "/electrical/box-fill-calculator",
    applicationCategory: "CalculatorApplication",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Electrical Box Fill (NEC 314.16)",
    "An electrician guide to calculating cubic-inch enclosure volume requirements using NEC Article 314.16 rules.",
    [
      {
        name: "Count All Circuit Conductors",
        text: "Count each conductor that originates outside the box and terminates or is spliced inside (1 allowance each). Internal pigtails count as 0.",
      },
      {
        name: "Apply Internal Cable Clamp Allowance",
        text: "If one or more internal cable clamps are present, add 1 volume allowance based on the largest conductor in the box.",
      },
      {
        name: "Calculate Support Fittings / Fixture Studs",
        text: "Add 1 volume allowance per fixture stud or hickey based on the largest conductor in the box.",
      },
      {
        name: "Calculate Device or Equipment Yoke Deductions",
        text: "Add 2 volume allowances for each single-gang device yoke (receptacle, switch, GFCI) based on the largest conductor connected to that device.",
      },
      {
        name: "Calculate Equipment Grounding Conductors",
        text: "Add 1 volume allowance for up to 4 equipment grounds plus 0.25 allowance for each additional ground beyond 4 (NEC 2020/2023 rule).",
      },
      {
        name: "Sum Total Volume and Select Standard Box",
        text: "Add all cubic-inch allowances together and select a standard metal or plastic box whose total listed volume meets or exceeds the required volume allowance.",
      },
    ]
  );

  const faqItems = [
    {
      question: "How do you calculate electrical box fill under NEC 314.16?",
      answer:
        "Box fill is calculated by adding volume allowances in cubic inches for five categories: (1) 1 allowance per active circuit conductor; (2) 1 allowance for all internal clamps combined based on the largest wire; (3) 1 allowance per fixture stud; (4) 2 allowances per single-gang device yoke based on the largest wire connected; and (5) 1 allowance for 1 to 4 equipment grounds (plus 0.25 per additional ground) based on the largest ground wire.",
    },
    {
      question: "How many volume allowances does a switch or receptacle yoke count?",
      answer:
        "Under NEC 314.16(B)(4), each single-gang device yoke (whether a standard light switch, duplex outlet, GFCI, or USB receptacle) counts as 2 volume allowances based on the largest conductor connected to that device. A double-gang device counts as 4 allowances.",
    },
    {
      question: "How are equipment grounding conductors counted in box fill calculations?",
      answer:
        "Per NEC 314.16(B)(5), all equipment grounding conductors entering the box are grouped together. One volume allowance is deducted for the first 1 to 4 ground wires based on the largest ground wire. Under the 2020 and 2023 NEC, each additional ground wire beyond 4 adds 0.25 (one-quarter) of a volume allowance.",
    },
    {
      question: "Do internal cable clamps and external connectors count the same?",
      answer:
        "No. Internal cable clamps (clamps built into the metal or plastic box) deduct 1 volume allowance based on the largest conductor in the box. External cable connectors, conduit locknuts, and external push-in connectors mounted on the outside of the box deduct 0 volume allowances.",
    },
    {
      question: "Can a mud ring or plaster ring increase box cubic-inch capacity?",
      answer:
        "Yes. Listed plaster rings and extension mud rings have stamped cubic-inch capacities (typically 2.5 to 12.0 cu in depending on depth and gang count). This volume is added directly to the base box volume to determine total usable enclosure capacity per NEC 314.16(A).",
    },
    {
      question: "What happens if an electrical box is overfilled?",
      answer:
        "Overfilling an electrical box is a major code violation. It causes conductor insulation damage during device installation, prevents heat dissipation, creates severe short circuit and fire risks, and will result in a failed electrical rough-in inspection.",
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
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                <Layers className="h-3.5 w-3.5" />
                NEC Article 314.16 Enclosure Sizing Utility
              </div>
              <span className="text-xs text-slate-500 font-medium">
                NEC Table 314.16(B) • Conductor Allowances • Device Yoke Deductions • Ground Wire Rules
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Electrical Box Fill Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Calculate electrical box fill cubic-inch capacity per <strong>NEC 314.16</strong> for mixed wire gauges, device yokes, internal clamps, grounds, and mud rings. Select the smallest standard metal or plastic box meeting volume allowance.
            </p>
          </div>

          {/* Interactive Calculator Form Component */}
          <div className="mb-16">
            <BoxFillCalculatorForm />
          </div>

          {/* Technical Supporting Guide Content */}
          <div className="space-y-12 pt-8 border-t border-slate-200">
            {/* Section 1: NEC 314.16 Conductor Volume Allowances */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-amber-600" />
                1. NEC Table 314.16(B) Conductor Volume Allowances
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                The National Electrical Code assigns a specific cubic-inch volume allowance to each conductor gauge to ensure adequate physical space and prevent thermal buildup:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">14 AWG</span>
                  <h3 className="text-lg font-black text-slate-900">2.00 cu in</h3>
                  <p className="text-slate-600 text-xs">Standard 15A lighting &amp; branch circuits.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">12 AWG</span>
                  <h3 className="text-lg font-black text-slate-900">2.25 cu in</h3>
                  <p className="text-slate-600 text-xs">Standard 20A commercial &amp; kitchen circuits.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">10 AWG</span>
                  <h3 className="text-lg font-black text-slate-900">2.50 cu in</h3>
                  <p className="text-slate-600 text-xs">30A dryer, water heater &amp; A/C circuits.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">8 AWG</span>
                  <h3 className="text-lg font-black text-slate-900">3.00 cu in</h3>
                  <p className="text-slate-600 text-xs">40A range &amp; EV charging circuits.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase block">6 AWG</span>
                  <h3 className="text-lg font-black text-slate-900">5.00 cu in</h3>
                  <p className="text-slate-600 text-xs">50A–60A subpanels &amp; heavy feeders.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Deduction Accounting Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-6 w-6 text-amber-600" />
                2. Summary of NEC 314.16(B) Volume Deductions
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Component Category</th>
                      <th className="p-3">NEC Code Rule</th>
                      <th className="p-3">Allowance Multiplier</th>
                      <th className="p-3">Basis of Sizing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Circuit Conductors</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(1)</td>
                      <td className="p-3 font-bold text-amber-800">1× per wire</td>
                      <td className="p-3 text-slate-600">Each wire&apos;s individual AWG size</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Internal Cable Clamps</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(2)</td>
                      <td className="p-3 font-bold text-amber-800">1× total</td>
                      <td className="p-3 text-slate-600">Largest conductor present in box</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Support Fittings / Studs</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(3)</td>
                      <td className="p-3 font-bold text-amber-800">1× per stud</td>
                      <td className="p-3 text-slate-600">Largest conductor present in box</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Device Yokes (Switch/Outlet)</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(4)</td>
                      <td className="p-3 font-bold text-amber-800">2× per gang</td>
                      <td className="p-3 text-slate-600">Largest wire connected to that device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Equipment Ground Wires</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(5)</td>
                      <td className="p-3 font-bold text-amber-800">1× (&le; 4) + 0.25/ea</td>
                      <td className="p-3 text-slate-600">Largest ground wire present in box</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Internal Pigtails</td>
                      <td className="p-3 font-mono text-xs">314.16(B)(1) Exp.</td>
                      <td className="p-3 font-bold text-emerald-800">0× (No deduction)</td>
                      <td className="p-3 text-slate-600">Wires originating &amp; remaining inside</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Ground Counting & NEC 2020 Update */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                3. The NEC 2020 / 2023 Equipment Grounding Conductor Rule
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs sm:text-sm text-amber-950 space-y-2">
                <p className="font-bold text-amber-900">
                  How Multiple Ground Wires are Counted (NEC 314.16(B)(5))
                </p>
                <p className="text-slate-700 leading-relaxed">
                  In older code editions (pre-2020), all equipment grounding conductors counted as only 1 single volume allowance regardless of whether 1 or 10 ground wires entered the box. 
                  Under the <strong>2020 and 2023 NEC</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>1 to 4 grounds:</strong> 1 volume allowance based on the largest ground wire.</li>
                  <li><strong>Each ground wire beyond 4:</strong> Adds <strong>0.25 (1/4) volume allowance</strong>. For example, 6 ground wires = 1 + (2 &times; 0.25) = 1.5 volume allowances.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Common Standard Box Capacities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-amber-600" />
                4. Standard Metal Box Capacities Quick Reference (Table 314.16(A))
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li><strong>1-Gang Handy Box (4&quot; &times; 2-1/8&quot; &times; 1-7/8&quot;):</strong> 13.0 cu in (Fits 1 switch + 2&times; #14 wires).</li>
                <li><strong>4&quot; Round / Octagonal Ceiling Box (4&quot; &times; 1-1/2&quot;):</strong> 15.5 cu in (Ceiling fixtures and light sconces).</li>
                <li><strong>4&quot; Square Standard Box (4&quot; &times; 4&quot; &times; 1-1/2&quot; - 1900 Box):</strong> 21.0 cu in (Fits up to 9&times; #12 AWG wires).</li>
                <li><strong>4&quot; Square Deep Box (4&quot; &times; 4&quot; &times; 2-1/8&quot; - Deep 1900 Box):</strong> 30.3 cu in (Fits up to 13&times; #12 AWG wires).</li>
                <li><strong>4-11/16&quot; Large Square Box (4-11/16&quot; &times; 2-1/8&quot;):</strong> 42.0 cu in (Heavy commercial feeders and subpanel taps).</li>
              </ul>
            </section>

            {/* Section 5: Reciprocal Electrical Ecosystem Cross-Links */}
            <section className="space-y-4 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interconnected Electrical &amp; Construction Ecosystem
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Complete Your Electrical Design &amp; Construction Plan
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl">
                    Connect your box fill sizing with wire gauge voltage drop, conduit trade sizing, and wall framing tools:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    href="/electrical/voltage-drop-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 1: Wire Gauge
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Voltage Drop &amp; Wire Size Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Calculate exact AWG wire sizes and voltage drop across long feeder runs.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Wire Size <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/electrical/conduit-fill-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Step 2: Raceway Sizing
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Electrical Conduit Fill Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Size EMT, PVC, and RMC conduit for mixed wire bundles.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Conduit <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    href="/construction/framing-calculator"
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Wall Enclosures
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-amber-300">
                        Wall Framing &amp; Stud Calculator
                      </span>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Estimate 16&quot; OC wall studs and plan rough-in box nail-on locations.
                      </p>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold pt-3 group-hover:translate-x-1 transition-transform">
                      Calculate Framing <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* Section: Worked Code Solutions & Step-by-Step Examples */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-amber-600" />
                    Worked Code Solutions &amp; Step-by-Step NEC Calculations
                  </h2>
                  <p className="text-xs text-slate-500">
                    Step-by-step mathematical solutions and code citations for real-world junction box and device enclosure problems:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/solutions/box-fill-4x4-square-box-deep-device-capacity"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC 314.16(A)
                      </span>
                      <span className="text-xs font-mono text-slate-500">Worked Solution</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      4″ x 1-1/2″ Square Box Capacity
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Determine maximum conductor and device volume capacity for standard 21.0 cu in square metal boxes.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Allowance:</span>
                      21.0 cu in &bull; Up to 9 #12 AWG
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Step-by-Step Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>

                <Link
                  href="/solutions/box-fill-six-12awg-two-clamps-one-receptacle"
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        NEC 314.16(B)
                      </span>
                      <span className="text-xs font-mono text-slate-500">Worked Solution</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Six 12 AWG, Two Clamps &amp; Receptacle
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Calculate total cubic inches required for 6 conductors, internal clamps, equipment grounding, and device yoke.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Total Volume:</span>
                      22.5 cu in required (Deep box needed)
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-600 pt-3 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                    View Step-by-Step Solution <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
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
