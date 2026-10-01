import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import {
  Zap,
  Calculator,
  BookOpen,
  Scale,
  Gauge,
  Activity,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "The Electrician's Guide to Voltage Drop: Formulas, Code Limits & Conductor Sizing",
  description:
    "Understand AC/DC single-phase and 3-phase voltage drop formulas, NEC 210.19/215.2 recommendations (3% branch, 5% total), and circular mil resistance constants.",
  path: "/guides/electricians-guide-to-voltage-drop-calculations",
  keywords: [
    "voltage drop calculations guide",
    "single phase voltage drop formula",
    "three phase voltage drop formula",
    "nec 210.19 voltage drop",
    "circular mil copper resistance constant",
    "distance wire sizing table",
    "subpanel feeder voltage loss",
  ],
});

export default function VoltageDropCalculationsGuidePage() {
  const breadcrumbs = [
    { name: "Guides", url: "/guides" },
    {
      name: "The Electrician's Guide to Voltage Drop",
      url: "/guides/electricians-guide-to-voltage-drop-calculations",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "The Electrician's Guide to Voltage Drop: Formulas, Code Limits & Conductor Sizing",
    "Understand AC/DC single-phase and 3-phase voltage drop formulas, NEC 210.19/215.2 recommendations (3% branch, 5% total), and circular mil resistance constants.",
    "/guides/electricians-guide-to-voltage-drop-calculations",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />
      <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <header className="space-y-4 mb-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              Master Technical Electrical Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              The Electrician&apos;s Guide to Voltage Drop: Formulas, Code Limits &amp; Sizing
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When electric current flows through a wire, conductor resistance inherently converts electrical energy
              into heat. Over long circuit distances, this loss causes voltage at the load to drop below operating
              tolerances. This master guide covers governing physics, NEC thresholds, formula derivations, and distance
              upsizing thresholds.
            </p>
          </header>

          {/* Interactive Calculator CTA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
                Interactive Calculation Instrument
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Calculate Exact Wire Size and Voltage Drop
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Instantly compute circular mils, percent loss, and recommended AWG conductors for any voltage, current, and distance.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                href="/electrical/voltage-drop-calculator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Calculator className="h-4 w-4" />
                Launch Voltage Drop Tool
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <BookOpen className="h-4 w-4 text-amber-400" />
                Worked Solutions
              </Link>
            </div>
          </div>

          <div className="space-y-12 max-w-4xl text-slate-800">
            {/* Section 1: Why Voltage Drop Matters */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Activity className="h-6 w-6 text-amber-600" />
                1. Why Voltage Drop Matters: Equipment Degradation &amp; Overheating
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                Electrical loads are designed to operate within a tight voltage band (&plusmn;5% of nominal system voltage).
                When excessive voltage drop occurs on branch circuits or subpanel feeders, equipment suffers immediate performance
                and longevity penalties:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-rose-700 uppercase">Motors &amp; Compressors</span>
                    <CardTitle className="text-base font-bold text-slate-900">Torque Loss &amp; Burnout</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600">
                    Induction motor starting torque is proportional to the square of voltage ($T \propto V^2$). A 10% voltage drop results in a 19% reduction in torque, causing motors to stall, draw locked-rotor amps, and overheat.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">Electronic Drivers</span>
                    <CardTitle className="text-base font-bold text-slate-900">Increased Current Draw</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600">
                    Switch-mode power supplies (computers, servers, variable frequency drives) draw constant wattage. When voltage decreases, current increases ($I = P / V$), elevating conductor heat and nuisance breaker trips.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <span className="text-xs font-mono font-bold text-blue-700 uppercase">Electric Heating</span>
                    <CardTitle className="text-base font-bold text-slate-900">Output Reduction</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600">
                    Resistive heating output scales with voltage squared ($P = V^2 / R$). A 5% voltage drop reduces heat output by nearly 10%, causing prolonged baseboard or water heater run cycles.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2: The 3% and 5% NEC Thresholds */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Scale className="h-6 w-6 text-amber-600" />
                2. The 3% and 5% Code Thresholds: Recommendations vs Mandates
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                In the National Electrical Code, voltage drop limits are presented in <strong>Informational Notes</strong>:
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
                <p>
                  <strong>NEC Article 210.19(A) Informational Note 4 &amp; NEC 215.2(A)(1) Informational Note 2:</strong>
                </p>
                <blockquote className="border-l-4 border-amber-500 pl-3 italic text-slate-700">
                  &ldquo;Conductors for branch circuits as defined in Article 100, sized to prevent a voltage drop exceeding 3 percent at the farthest outlet of power, heating, and lighting loads, and where the maximum total voltage drop on both feeders and branch circuits to the farthest outlet does not exceed 5 percent, provide reasonable efficiency of operation.&rdquo;
                </blockquote>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <p>
                  <strong>Are Informational Notes Mandatory?</strong> Under NEC 90.5(C), informational notes are explanatory and not enforceable as code requirements <em>unless</em> adopted as mandatory amendments by the local Authority Having Jurisdiction (AHJ).
                </p>
                <p>
                  <strong>Where It Is Mandatory:</strong> Key standards mandate voltage drop:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>NEC 695.7 (Fire Pumps):</strong> Mandates maximum 15% drop during starting and 5% drop under full running load.</li>
                  <li><strong>Energy Conservation Codes (ASHRAE 90.1 / IECC):</strong> Mandate 2% max feeder drop and 3% max branch circuit drop.</li>
                  <li><strong>Solar PV Interconnections (NEC 690):</strong> Strict voltage drop sizing is required to prevent anti-islanding inverter trips.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: The Mathematical Formulas */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <BookOpen className="h-6 w-6 text-amber-600" />
                3. The Governing Mathematical Equations: 1-Phase &amp; 3-Phase
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                Voltage drop is governed by Ohm&apos;s Law (<em>V = I &times; R</em>), where conductor resistance <em>R = (K &times; L) / CM</em>:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                  <span className="text-amber-400 font-bold uppercase block font-sans">Single-Phase (2-Wire AC &amp; DC)</span>
                  <div className="text-lg text-amber-300 font-black">
                    VD = (2 &times; K &times; L &times; I) &divide; CM
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    The factor &quot;2&quot; accounts for both conductors (the supply and return path across distance L).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                  <span className="text-amber-400 font-bold uppercase block font-sans">Three-Phase Balanced (3-Wire &amp; 4-Wire)</span>
                  <div className="text-lg text-amber-300 font-black">
                    VD = (1.732 &times; K &times; L &times; I) &divide; CM
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    The factor &quot;1.732&quot; ($\sqrt{3}$) accounts for the line-to-line vector relationship in a balanced 3-phase system.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Resistivity Constants (K) &amp; Variables</h3>
                <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-slate-600">
                  <li><strong>K (Copper):</strong> 12.9 ohms-cmil/ft at 75&deg;C (standard industrial design temperature).</li>
                  <li><strong>K (Aluminum):</strong> 21.2 ohms-cmil/ft at 75&deg;C (higher resistance due to material resistivity).</li>
                  <li><strong>L (Length):</strong> One-way circuit distance in feet from source to load.</li>
                  <li><strong>I (Current):</strong> Load design current in Amperes.</li>
                  <li><strong>CM (Circular Mils):</strong> Conductor cross-sectional area from NEC Chapter 9 Table 8.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Sizing Up Conductors Reference Table */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Gauge className="h-6 w-6 text-amber-600" />
                4. Distance Thresholds: When Must You Upsize Conductor Gauge?
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                For a standard 120V 16-amp continuous load (20A branch breaker), here is how circuit distance dictates wire gauge:
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200 font-mono text-xs uppercase">
                    <tr>
                      <th className="p-3">Run Distance</th>
                      <th className="p-3">12 AWG Cu (% Drop)</th>
                      <th className="p-3">10 AWG Cu (% Drop)</th>
                      <th className="p-3">8 AWG Cu (% Drop)</th>
                      <th className="p-3">Compliant Minimum Gauge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    <tr>
                      <td className="p-3 font-bold text-slate-900 font-sans">50 ft</td>
                      <td className="p-3 text-emerald-700 font-bold">2.64V (2.20%)</td>
                      <td className="p-3">1.66V (1.38%)</td>
                      <td className="p-3">1.04V (0.87%)</td>
                      <td className="p-3 font-sans font-bold text-emerald-800">12 AWG Copper</td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-bold text-slate-900 font-sans">75 ft</td>
                      <td className="p-3 text-rose-700 font-bold">3.97V (3.30%) *Fail</td>
                      <td className="p-3 text-emerald-700 font-bold">2.49V (2.07%)</td>
                      <td className="p-3">1.56V (1.30%)</td>
                      <td className="p-3 font-sans font-bold text-amber-900">Upsize to 10 AWG</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900 font-sans">100 ft</td>
                      <td className="p-3 text-rose-700 font-bold">5.29V (4.41%) *Fail</td>
                      <td className="p-3 text-emerald-700 font-bold">3.32V (2.77%)</td>
                      <td className="p-3">2.08V (1.74%)</td>
                      <td className="p-3 font-sans font-bold text-amber-900">10 AWG Copper</td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-bold text-slate-900 font-sans">150 ft</td>
                      <td className="p-3 text-rose-700 font-bold">7.93V (6.61%) *Fail</td>
                      <td className="p-3 text-rose-700 font-bold">4.98V (4.15%) *Fail</td>
                      <td className="p-3 text-emerald-700 font-bold">3.13V (2.61%)</td>
                      <td className="p-3 font-sans font-bold text-rose-900">Upsize to 8 AWG</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Cross-Links */}
            <section className="pt-6 border-t border-slate-200 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Explore Worked Voltage Drop Scenarios
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/solutions/voltage-drop-100ft-12awg-20a-120v"
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-700">120V Branch Scenario</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 text-sm">
                      100ft 12 AWG at 20A 120V &rarr;
                    </h3>
                    <p className="text-xs text-slate-500">
                      Shows why 100ft exceeds the 3% limit (6.58% loss) and requires upsizing to 10 AWG copper.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/solutions/voltage-drop-500ft-480v-3phase-100a-feeder"
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-700">480V Feeder Scenario</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 text-sm">
                      500ft 480V 3-Phase 100A Feeder &rarr;
                    </h3>
                    <p className="text-xs text-slate-500">
                      Three-phase line-to-line derivation resulting in 13.34V drop (2.78% loss, fully compliant).
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
