import type { Metadata } from "next";
import Link from "next/link";
import { PlumbingWsfuForm } from "@/components/tools/plumbing-wsfu-calculator/plumbing-wsfu-form";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildHowToSchema,
  buildFaqSchema,
} from "@/lib/seo/schema";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Droplets,
  HelpCircle,
  Layers,
  Scale,
  Workflow,
  Wrench,
} from "lucide-react";

const PAGE_TITLE = "WSFU & Potable Pipe Sizing Calculator";
const PAGE_DESC =
  "Free Water Supply Fixture Unit (WSFU) and potable pipe sizing calculator. Calculate fixture units, peak flow (GPM) via Hunter's Curve, and size supply lines.";

export const metadata: Metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/plumbing/wsfu-calculator",
  keywords: [
    "wsfu calculator",
    "water supply fixture unit calculator",
    "plumbing pipe sizing calculator",
    "water pipe size calculator",
    "potable water sizing calculator",
    "hunters curve calculator",
    "pex pipe sizing calculator",
    "copper pipe sizing calculator",
    "ipc wsfu calculator",
    "upc water supply calculator",
    "water supply pipe size",
  ],
});

const FAQS = [
  {
    question: "What is a Water Supply Fixture Unit (WSFU)?",
    answer:
      "A Water Supply Fixture Unit (WSFU) is a dimensionless numerical rating assigned to plumbing fixtures that represents their relative water demand load and probability of simultaneous operation. Because not all fixtures in a building operate simultaneously, WSFUs allow engineers and plumbers to convert total fixture loads into peak design flow (GPM) using Hunter's Curve.",
  },
  {
    question: "How does Hunter's Curve convert WSFU to Gallons Per Minute (GPM)?",
    answer:
      "Dr. Roy B. Hunter developed statistical binomial distribution models in the 1920s demonstrating that the probability of all plumbing fixtures running simultaneously is extremely low. Hunter's Curve converts intermittent fixture unit loads into realistic continuous peak design flow (GPM). For instance, 18 WSFU in a typical residence generates approximately 20.0 GPM of peak demand rather than the sum of all individual fixture max flow rates.",
  },
  {
    question: "What is the difference between IPC and UPC water supply sizing?",
    answer:
      "The International Plumbing Code (IPC Appendix E) and Uniform Plumbing Code (UPC Appendix A / Table 610.3) assign slightly different fixture unit weights. For example, a standard flush tank toilet is rated 2.2 WSFU in IPC and 2.5 WSFU in UPC. A standard lavatory is 0.7 WSFU in IPC and 1.0 WSFU in UPC. Both codes use Hazen-Williams hydraulic friction gradient methods to select pipe diameters.",
  },
  {
    question: "How does elevation affect water supply pipe sizing?",
    answer:
      "Water exerts a downward static head pressure of 0.433 PSI per vertical foot of elevation. If the highest fixture (such as a 2nd-floor shower or 3rd-story master bathroom) is located 20 feet above the municipal water meter, the system loses 8.66 PSI (20 × 0.433) of static pressure before water even starts flowing.",
  },
  {
    question: "What is the maximum water velocity allowed in potable water piping?",
    answer:
      "Plumbing codes strictly regulate water velocity to prevent water hammer, hydraulic noise, and erosion corrosion of pipe walls. In copper tubing, cold water velocity is limited to 8.0 FPS (feet per second) and hot water to 5.0 FPS. In PEX and CPVC tubing, cold water velocity is permitted up to 10.0 FPS per manufacturer standards (PPI TR-3).",
  },
  {
    question: "When is a Pressure Reducing Valve (PRV) mandatory?",
    answer:
      "Both IPC Section 604.8 and UPC Section 608.2 mandate the installation of an approved Pressure Reducing Valve (PRV) whenever incoming municipal static street water pressure exceeds 80 PSI. High water pressure damages fixture cartridges, bursts flexible supply lines, and voids appliance warranties.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Select Plumbing Code & Pipe Material",
    text: "Choose between IPC (International Plumbing Code) and UPC (Uniform Plumbing Code), and select your piping material (Copper Type L, PEX, or CPVC).",
  },
  {
    name: "Enter Static Pressure and Elevation Head",
    text: "Input the static supply pressure (PSI) at your water meter or well pressure tank, along with the vertical elevation height (ft) to the highest plumbing fixture.",
  },
  {
    name: "Specify Developed Pipe Length",
    text: "Enter the physical pipe distance from the water service entrance to the most remote fixture. The calculator adds a 20% allowance for elbows and valves.",
  },
  {
    name: "Build Your Fixture Schedule",
    text: "Select and add bathroom groups, toilets, sinks, showers, bathtubs, dishwashers, washing machines, and exterior hose bibbs.",
  },
  {
    name: "Review Recommended Pipe Size & Pressure",
    text: "Inspect the recommended main supply pipe diameter, water velocity (FPS), peak design flow (GPM), and residual pressure at the highest fixture.",
  },
];

export default function PlumbingWsfuCalculatorPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Plumbing", url: "/categories/plumbing" },
    {
      name: "Water Supply Fixture Unit (WSFU) Calculator",
      url: "/plumbing/wsfu-calculator",
    },
  ];

  const webpageSchema = buildWebPageSchema(
    PAGE_TITLE,
    PAGE_DESC,
    "/plumbing/wsfu-calculator",
    breadcrumbs
  );

  const softwareSchema = buildSoftwareAppSchema({
    name: "Water Supply Fixture Unit (WSFU) & Potable Pipe Sizing Calculator",
    description: PAGE_DESC,
    url: "/plumbing/wsfu-calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (Web Browser)",
  });

  const faqSchema = buildFaqSchema(FAQS);

  const howToSchema = buildHowToSchema(
    "How to Size Potable Water Supply Pipes Using WSFU",
    "Step-by-step engineering guide to calculating fixture units and sizing potable water supply lines.",
    HOW_TO_STEPS
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <JsonLd schema={webpageSchema} />
      <JsonLd schema={softwareSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={howToSchema} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <li>
            <Link href="/" className="hover:text-cyan-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories/plumbing" className="hover:text-cyan-600 transition-colors">
              Plumbing &amp; Drainage
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-900 font-semibold aria-current-page">
            WSFU &amp; Potable Pipe Sizing
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Droplets className="h-3.5 w-3.5" />
          <span>Plumbing Engineering Authority Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Water Supply Fixture Unit (WSFU) &amp; Potable Pipe Sizing Calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Calculate total water supply fixture units (WSFU), convert intermittent loads to peak design flow (GPM)
          using Hunter&apos;s Curve, evaluate static elevation loss, and evaluate candidate pipe
          diameters for Copper Type L, PEX, and CPVC potable water distribution systems based on selected IPC and UPC tables.
        </p>
      </header>

      {/* Interactive Form Component */}
      <div className="mb-14">
        <PlumbingWsfuForm />
      </div>

      {/* Comprehensive Technical Documentation */}
      <section className="space-y-12 border-t border-slate-200 pt-12 text-slate-800">
        {/* Section 1: What is WSFU? */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-cyan-600" />
            <span>1. What is a Water Supply Fixture Unit (WSFU)?</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            A <strong>Water Supply Fixture Unit (WSFU)</strong> is an engineering metric established by the
            plumbing industry to quantify the simultaneous demand placed on a potable water distribution system.
            Unlike industrial continuous-flow systems where pipes are sized for 100% capacity, residential and
            commercial building plumbing consists of intermittent fixtures that operate intermittently.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            Assigning fixture units allows plumbing designers to aggregate disparate fixtures—such as low-flow lavatories
            (0.7 WSFU), domestic dishwashers (1.4 WSFU), and high-demand commercial flushometer valves (5.0–8.0 WSFU)—into
            a unified design load. This load is then mapped to hydraulic peak demand flow rates in Gallons Per Minute (GPM).
          </p>
        </article>

        {/* Section 2: Hunter's Curve Theory */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-cyan-600" />
            <span>2. Hunter&apos;s Curve &amp; Peak Demand Probability</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            During the 1920s, Dr. Roy B. Hunter of the National Bureau of Standards (now NIST) conducted foundational
            research on plumbing hydraulics. Using probability theory and binomial distribution curves, Hunter demonstrated
            that the likelihood of all water outlets opening simultaneously in a building approaches zero.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Representative WSFU to Flow Conversions:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 block">5 WSFU:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">9.4 GPM</span>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 block">18 WSFU (2-Bath Home):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">20.0 GPM</span>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 block">50 WSFU (Small Multi-Family):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">34.0 GPM</span>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 block">100 WSFU (Commercial):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">52.0 GPM</span>
              </div>
            </div>
          </div>
        </article>

        {/* Section 3: Hydraulic Pressure Budget & Elevation Loss */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Scale className="h-6 w-6 text-cyan-600" />
            <span>3. Available Pressure, Elevation Head Loss &amp; Friction Budgets</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            Correctly sizing a potable water pipe requires establishing a comprehensive pressure budget. The available
            static pressure at the municipal water meter must overcome four distinct pressure reductions:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong>Static Elevation Head Loss:</strong> Water column weight exerts a downward head pressure of{" "}
              <code>0.433 PSI per vertical foot</code>. Sizing a 3-story home with fixtures 24 feet above the meter
              incurs a <code>10.4 PSI</code> static elevation reduction.
            </li>
            <li>
              <strong>Water Meter &amp; Backflow Preventer Loss:</strong> Utility meters and double-check backflow
              assemblies introduce a dynamic pressure drop between 3 and 7 PSI during peak flow conditions.
            </li>
            <li>
              <strong>Minimum Fixture Residual Pressure:</strong> Plumbing fixtures require a minimum operating pressure
              at their supply inlets: <code>15 PSI</code> for standard gravity flush-tank toilets and <code>20–25 PSI</code> for
              commercial flushometer valves or high-end multi-head thermostatic shower systems.
            </li>
            <li>
              <strong>Allowable Friction Loss:</strong> The remaining pressure is the maximum total friction loss available
              for the entire developed pipe run:
              <div className="bg-slate-100 p-3 rounded font-mono text-xs my-2">
                Allowable Friction Loss (PSI) = Static Pressure - Elevation Loss - Meter Loss - Min Residual Pressure
              </div>
            </li>
          </ol>
        </article>

        {/* Section 4: Sizing by Velocity & Hazen-Williams Friction Gradient */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Workflow className="h-6 w-6 text-cyan-600" />
            <span>4. Hazen-Williams Friction Equations &amp; Velocity Limits</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            Our calculation engine uses the empirical <strong>Hazen-Williams hydraulic formula</strong> to evaluate candidate
            pipe diameters:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs space-y-2">
            <div>Friction Loss Gradient: J = 4.52 × Q^1.852 / (C^1.852 × d^4.8655) [PSI per 100 ft]</div>
            <div>Water Velocity: V = 0.4085 × Q / d^2 [Feet per Second (FPS)]</div>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 mt-2">
            Where <code>Q</code> is design flow in GPM, <code>C</code> is the pipe roughness coefficient (130 for Copper,
            150 for PEX and CPVC), and <code>d</code> is the exact internal diameter in inches.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-xs sm:text-sm text-amber-900">
            <strong>Code Velocity Maximums:</strong> IPC Table E103.3(1) and CDA (Copper Development Association) standards
            limit copper cold water velocity to <strong>8.0 FPS</strong> and hot water to <strong>5.0 FPS</strong> to prevent
            cavitation and erosion corrosion. PEX tubing allows velocities up to <strong>10.0 FPS</strong> (PPI TR-3).
          </div>
        </article>

        {/* Section 5: IPC vs UPC Comparison */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-cyan-600" />
            <span>5. IPC vs. UPC Code Standards Comparison</span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr>
                  <th className="p-3">Fixture Type</th>
                  <th className="p-3 text-center">IPC Total WSFU</th>
                  <th className="p-3 text-center">UPC Total WSFU</th>
                  <th className="p-3">Governing Section</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold">Bathroom Group (Tank Toilet)</td>
                  <td className="p-3 text-center font-mono">3.6 WSFU</td>
                  <td className="p-3 text-center font-mono">3.6 WSFU</td>
                  <td className="p-3 text-slate-600">IPC Table E103.3(2) / UPC Table A 103.1</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Gravity Tank Toilet (1.6 gpf)</td>
                  <td className="p-3 text-center font-mono">2.2 WSFU</td>
                  <td className="p-3 text-center font-mono">2.5 WSFU</td>
                  <td className="p-3 text-slate-600">IPC Table E103.3(2) / UPC Table 610.3</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Commercial Flushometer Toilet</td>
                  <td className="p-3 text-center font-mono">5.0 WSFU</td>
                  <td className="p-3 text-center font-mono">8.0 WSFU</td>
                  <td className="p-3 text-slate-600">UPC Table 610.3 (High Instantaneous Flow)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Lavatory / Bathroom Sink</td>
                  <td className="p-3 text-center font-mono">0.7 WSFU</td>
                  <td className="p-3 text-center font-mono">1.0 WSFU</td>
                  <td className="p-3 text-slate-600">IPC Table E103.3(2) / UPC Table 610.3</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Bathtub / Shower Stall</td>
                  <td className="p-3 text-center font-mono">1.4 WSFU</td>
                  <td className="p-3 text-center font-mono">1.5 WSFU</td>
                  <td className="p-3 text-slate-600">IPC Table E103.3(2) / UPC Table 610.3</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Automatic Clothes Washer</td>
                  <td className="p-3 text-center font-mono">1.4 WSFU</td>
                  <td className="p-3 text-center font-mono">1.5 WSFU</td>
                  <td className="p-3 text-slate-600">IPC Table E103.3(2) / UPC Table 610.3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Section 6: Potable Pipe Material Comparison */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Wrench className="h-6 w-6 text-cyan-600" />
            <span>6. Pipe Material Comparison: Copper Type L vs. PEX vs. CPVC</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-base">Copper (Type L Tubing)</h3>
              <p className="text-slate-600 leading-relaxed">
                Traditional rigid copper tubing. Exceptional durability and fire resistance. Internal diameters are
                larger than PEX for the same nominal size, providing superior flow capacity at lower friction losses.
              </p>
              <div className="font-mono text-[11px] text-slate-500">C = 130 | Max Vel = 8.0 FPS (Cold) / 5.0 FPS (Hot)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-base">PEX (Cross-Linked Poly)</h3>
              <p className="text-slate-600 leading-relaxed">
                Flexible thermoplastic tubing with excellent freeze resistance and fast installation. Internal diameters
                are slightly smaller due to thicker walls, but smooth surfaces allow higher velocities without erosion.
              </p>
              <div className="font-mono text-[11px] text-slate-500">C = 150 | Max Vel = 10.0 FPS (Cold) / 8.0 FPS (Hot)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-base">CPVC (Chlorinated PVC)</h3>
              <p className="text-slate-600 leading-relaxed">
                Rigid thermoplastic pipe resistant to acidic water corrosion. Joined via solvent cement. Excellent thermal
                insulation compared to metallic pipe, but requires careful expansion loop design on long hot water runs.
              </p>
              <div className="font-mono text-[11px] text-slate-500">C = 150 | Max Vel = 8.0 FPS (Cold) / 8.0 FPS (Hot)</div>
            </div>
          </div>
        </article>

        {/* Section 7: FAQs */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-cyan-600" />
            <span>7. Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-xl border border-slate-200 p-4 transition-all open:shadow-sm"
              >
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between text-sm sm:text-base select-none">
                  <span>{faq.question}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </article>

        {/* Section 8: Related Trade Workflow Tools */}
        <article className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Workflow className="h-6 w-6 text-cyan-600" />
            <span>8. Related Trade Engineering Calculators</span>
          </h2>
          <p className="text-sm text-slate-600">
            Water supply lines operate as an integrated system alongside sanitary drainage, HVAC heating loads, and
            structural framing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <Link
              href="/plumbing/dfu-calculator"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-500 hover:shadow-md transition-all group"
            >
              <div className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 flex items-center justify-between">
                <span>Plumbing DFU Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Size sanitary horizontal branches, soil stacks, and building sewers.
              </p>
            </Link>

            <Link
              href="/hvac/btu-calculator"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-500 hover:shadow-md transition-all group"
            >
              <div className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 flex items-center justify-between">
                <span>HVAC BTU Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Calculate home heating loads and domestic hot water generation.
              </p>
            </Link>

            <Link
              href="/construction/concrete-calculator"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-500 hover:shadow-md transition-all group"
            >
              <div className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 flex items-center justify-between">
                <span>Concrete Slab Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Estimate slab yardage for rough-in plumbing sleeves and foundation trenches.
              </p>
            </Link>

            <Link
              href="/materials/drywall-calculator"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-500 hover:shadow-md transition-all group"
            >
              <div className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 flex items-center justify-between">
                <span>Drywall &amp; Sheet Goods</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Plan moisture-resistant green board and cement backer board for wet walls.
              </p>
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
