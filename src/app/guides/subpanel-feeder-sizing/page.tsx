import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import {
  Zap,
  ArrowRight,
  Calculator,
  ShieldAlert,
  FileText,
  Sliders,
  AlertTriangle,
  Workflow,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Subpanel Feeder Conductor Sizing by Distance",
  description:
    "Technical guide for sizing subpanel feeder conductors across distance. Learn how continuous load, NEC Table 310.16, and 3% voltage drop limits interact.",
  path: "/guides/subpanel-feeder-sizing",
  keywords: [
    "subpanel feeder sizing",
    "subpanel wire size by distance",
    "feeder voltage drop",
    "100 amp subpanel wire size",
    "aluminum vs copper feeder",
    "nec 215.2 voltage drop",
    "feeder conductor ampacity",
  ],
});

export default function SubpanelFeederSizingGuide() {
  const breadcrumbs = [
    { name: "Electrical & Conduit", url: "/categories/electrical" },
    { name: "Subpanel Feeder Sizing by Distance", url: "/guides/subpanel-feeder-sizing" },
  ];

  const pageSchema = buildWebPageSchema(
    "Subpanel Feeder Conductor Sizing by Distance",
    "Technical electrical guide for sizing subpanel feeder conductors across distance. Learn how continuous load, NEC Table 310.16 ampacity, and 3% voltage drop limits interact.",
    "/guides/subpanel-feeder-sizing",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header & Quick Summary */}
          <header className="space-y-4 mb-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-amber-700" />
              Electrical Engineering Reference Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Subpanel Feeder Conductor Sizing by Distance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Sizing an electrical feeder to a detached garage, outbuilding, workshop, or second-floor subpanel
              requires balancing two independent electrical constraints: <strong>thermal conductor ampacity</strong> (safety)
              and <strong>cumulative voltage drop over distance</strong> (equipment performance).
            </p>
          </header>

          {/* Quick Decision Framework Card */}
          <div className="mb-10 p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-base sm:text-lg">
              <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <span>Core Sizing Principle</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              On short runs (under 50 feet), conductor gauge is governed strictly by the overcurrent protection device (breaker rating)
              per <strong>NEC Table 310.16</strong>. On longer feeder runs (75 to 300+ feet), conductor resistance causes voltage drop;
              conductors are frequently <strong>upsized 1 to 2 gauge sizes</strong> to meet the recommended
              <strong> 3% engineering design guidance</strong> (NEC Informational Note 215.2(A)(1)) at the subpanel terminals.
            </p>
          </div>

          {/* Technical Architecture Schematic (SVG / Visual Model) */}
          <section className="mb-12">
            <Card className="border-slate-300 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-900 text-white pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-white">
                    <Sliders className="h-5 w-5 text-amber-400" />
                    Feeder Circuit Topology &amp; Loss Model
                  </CardTitle>
                  <span className="text-xs font-mono text-slate-400">NEC 215.2(A)(1) Feeder Sizing Model</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-slate-950 text-slate-100">
                <div className="w-full overflow-x-auto py-2">
                  <svg
                    viewBox="0 0 800 220"
                    className="w-full min-w-[640px] max-w-full h-auto text-slate-200 select-none font-sans"
                  >
                    {/* Background Grid Accent */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="800" height="220" fill="url(#grid)" rx="8" />

                    {/* Source Panel */}
                    <g transform="translate(40, 30)">
                      <rect width="140" height="150" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                      <text x="70" y="30" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">MAIN PANEL</text>
                      <text x="70" y="50" textAnchor="middle" fill="#94a3b8" fontSize="10">240V Single-Phase</text>
                      <rect x="25" y="65" width="90" height="30" rx="4" fill="#334155" />
                      <text x="70" y="84" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">OCPD Breaker</text>
                      <text x="70" y="115" textAnchor="middle" fill="#38bdf8" fontSize="10">e.g., 100A Breaker</text>
                      <text x="70" y="135" textAnchor="middle" fill="#cbd5e1" fontSize="9">75°C Terminals</text>
                    </g>

                    {/* Feeder Run Transmission Line */}
                    <g transform="translate(180, 75)">
                      {/* Feeder Pipe / Line */}
                      <line x1="0" y1="35" x2="380" y2="35" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
                      <line x1="0" y1="35" x2="380" y2="35" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />

                      {/* Info Callouts */}
                      <rect x="110" y="0" width="160" height="26" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                      <text x="190" y="17" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
                        Feeder Run: Distance L (ft)
                      </text>

                      {/* Formula label below */}
                      <rect x="70" y="48" width="240" height="38" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                      <text x="190" y="64" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        Vd = (2 × K × I × L) / CM
                      </text>
                      <text x="190" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9">
                        Resistance (K) • Load (I) • Length (L) • Area (CM)
                      </text>
                    </g>

                    {/* Subpanel Destination */}
                    <g transform="translate(600, 30)">
                      <rect width="150" height="150" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      <text x="75" y="30" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">SUBPANEL</text>
                      <text x="75" y="50" textAnchor="middle" fill="#94a3b8" fontSize="10">Distribution Board</text>
                      <rect x="25" y="65" width="100" height="30" rx="4" fill="#334155" />
                      <text x="75" y="84" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">V_load ≥ 232.8V</text>
                      <text x="75" y="115" textAnchor="middle" fill="#fbbf24" fontSize="10">Max Drop ≤ 3.0%</text>
                      <text x="75" y="135" textAnchor="middle" fill="#94a3b8" fontSize="9">Continuous + Non-cont.</text>
                    </g>
                  </svg>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold block">1. Source Overcurrent Device</span>
                    <span className="text-slate-400">Feeder wire ampacity must equal or exceed breaker size.</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold block">2. One-Way Distance (L)</span>
                    <span className="text-slate-400">Measured from main breaker lugs to subpanel main lugs.</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">3. Terminal Voltage</span>
                    <span className="text-slate-400">Maintain &gt;97% nominal voltage under calculated load.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Core Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Section 1: What Determines Feeder Size */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">01.</span>
                  What Determines Feeder Conductor Size?
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  A subpanel feeder conductor must safely transport total demand current without overheating
                  insulation or causing excessive voltage sag. Four primary factors dictate conductor selection:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-600 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 min-w-[130px]">• Overcurrent Rating:</span>
                    <span>The feeder conductor ampacity must match or exceed the upstream breaker rating (e.g., 60A, 100A, 150A, 200A).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 min-w-[130px]">• Continuous Loads:</span>
                    <span>Loads operating for 3 hours or more (EV chargers, electric heating) require a 125% multiplier per NEC 215.2(A)(1)(a).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 min-w-[130px]">• Terminal Ratings:</span>
                    <span>Most modern residential circuit breakers and panel lugs are rated at <strong>75°C</strong>. Even if using 90°C wire (THHN/XHHW-2), ampacity is sized from the 75°C column of NEC Table 310.16.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 min-w-[130px]">• One-Way Distance:</span>
                    <span>As length increases, resistance accumulates linearly, necessitating upsized circular mil area to prevent voltage drop.</span>
                  </li>
                </ul>
              </section>

              {/* Section 2: Ampacity vs Voltage Drop */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">02.</span>
                  Thermal Ampacity vs. Voltage Drop
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  A common point of confusion is treating thermal ampacity and voltage drop as the same calculation.
                  They represent two distinct engineering constraints:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      Thermal Ampacity (Mandatory Code Sizing)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Governed by <strong>NEC Table 310.16</strong> and Section 215.2(A)(1). Specifies the allowable continuous current a conductor can carry
                      without exceeding its insulation temperature rating (e.g., 75°C THWN-2). Ampacity is independent of distance.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-600" />
                      Voltage Drop (Engineering Design Guidance)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Governed by <strong>Ohm&apos;s Law</strong> and <strong>NEC Informational Note 215.2(A)(1)</strong>.
                      Provides non-mandatory design guidance recommending limiting feeder voltage drop to <strong>3.0%</strong> (and 5.0% total branch + feeder) for equipment efficiency and motor protection, unless mandated by local energy codes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Why Distance Governs Long Feeder Runs */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">03.</span>
                  Why Distance Governs Long Feeder Runs
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Electrical resistance in a conductor is proportional to length and inversely proportional to cross-sectional area:
                </p>
                <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm text-center space-y-1">
                  <div className="text-amber-400 font-bold">V_drop = (2 × K × I × L) / CM</div>
                  <div className="text-slate-400 text-xs">
                    Where K = 12.9 (Copper @ 75°C) or 21.2 (Aluminum @ 75°C), I = Operating Load Current (Amps), L = One-Way Distance (Feet), CM = Circular Mils
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For an 80A calculated operating load on a 100A feeder breaker at 25 feet, a #3 AWG Copper conductor exhibits only <strong>0.98V (0.41%)</strong> voltage drop.
                  However, when that same 80A load spans 200 feet to an outbuilding, voltage drop on #3 AWG Copper accumulates to <strong>7.84V (3.27%)</strong>,
                  exceeding the recommended 3.0% design target. Sizing is therefore upsized to <strong>#2 AWG Copper (5.83V, 2.43% drop)</strong> or <strong>1/0 AWG Aluminum (6.42V, 2.68% drop)</strong>.
                </p>
              </section>

              {/* Section 4: Copper vs Aluminum */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">04.</span>
                  Copper vs. Aluminum Feeder Conductors
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  For subpanel feeders, aluminum conductors (specifically <strong>AA-8000 series aluminum alloy</strong>)
                  are standard in residential installations due to significant cost savings on large wire gauges:
                </p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-xs sm:text-sm border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 font-bold text-left">
                        <th className="p-3">Characteristic</th>
                        <th className="p-3">Copper (Cu) Feeder</th>
                        <th className="p-3">Aluminum (Al) AA-8000</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Conductivity &amp; Gauge</td>
                        <td className="p-3">Higher conductivity; smaller wire gauge for same ampacity.</td>
                        <td className="p-3">Requires ~1 to 2 gauge sizes larger than copper for equivalent rating.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Material Cost</td>
                        <td className="p-3">Significantly higher cost on large feeder sizes (2 AWG to 4/0).</td>
                        <td className="p-3">High cost efficiency; often 60–75% less expensive per foot.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Conduit Trade Size</td>
                        <td className="p-3">Smaller outer diameter allows smaller conduit trade sizes.</td>
                        <td className="p-3">Larger conductor bundle may require upsizing conduit (e.g., 1-1/2″ to 2″).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Lug Terminations</td>
                        <td className="p-3">Compatible with standard Cu/Al marked lugs.</td>
                        <td className="p-3">Requires AL7CU/AL9CU rated lugs and anti-oxidant joint compound where specified.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 5: Worked Example */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">05.</span>
                  Worked Engineering Example: 100A Feeder at 150 Feet
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Consider a residential subpanel installation with the following baseline design parameters:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">System Voltage:</span>
                    <strong className="text-slate-900">240V (1-Phase)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Breaker Rating (OCPD):</span>
                    <strong className="text-slate-900">100 Amps</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Calculated Demand Load:</span>
                    <strong className="text-slate-900">80 Amps (Operating Load)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">One-Way Run:</span>
                    <strong className="text-slate-900">150 Feet</strong>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-700">
                    Step 1: Determine Minimum Code Ampacity for 100A OCPD (NEC Table 310.16 @ 75°C)
                  </h3>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-5">
                    <li>Minimum Copper Conductor: <strong>#3 AWG Copper</strong> (rated 100A @ 75°C, 52,620 CM).</li>
                    <li>Minimum Aluminum Conductor: <strong>#1 AWG Aluminum</strong> (rated 100A @ 75°C, 83,690 CM).</li>
                  </ul>

                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-700 pt-2">
                    Step 2: Calculate Voltage Drop at 150 Feet (80A Operating Load)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3 rounded bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900">On #3 AWG Copper (52,620 CM):</div>
                      <div className="text-slate-600 mt-1 font-mono text-xs">
                        Vd = (2 × 12.9 × 80A × 150 ft) ÷ 52,620 CM<br />
                        Vd = 309,600 ÷ 52,620 = <strong>5.88V (2.45% drop)</strong><br />
                        V_terminal = 240V - 5.88V = <strong>234.12V</strong><br />
                        <span className="text-emerald-700 font-semibold font-sans">✓ Meets &lt;3% design guidance.</span>
                      </div>
                    </div>
                    <div className="p-3 rounded bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900">On #1 AWG Aluminum (83,690 CM):</div>
                      <div className="text-slate-600 mt-1 font-mono text-xs">
                        Vd = (2 × 21.2 × 80A × 150 ft) ÷ 83,690 CM<br />
                        Vd = 508,800 ÷ 83,690 = <strong>6.08V (2.53% drop)</strong><br />
                        V_terminal = 240V - 6.08V = <strong>233.92V</strong><br />
                        <span className="text-emerald-700 font-semibold font-sans">✓ Meets &lt;3% design guidance.</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <em>Distance &amp; Full-Capacity Sensitivity:</em> If the 80A operating load distance increases to 200 feet, #1 AWG Aluminum voltage drop reaches <strong>8.11V (3.38%)</strong>, requiring an upsize to <strong>1/0 AWG Aluminum</strong> (6.42V, 2.68% drop). If the feeder were operated at its full 100A nameplate continuous design capacity at 150 feet, #1 AWG Aluminum would produce 7.60V (3.17% drop), requiring <strong>1/0 AWG Aluminum</strong> (6.02V, 2.51% drop).
                  </p>
                </div>
              </section>

              {/* Section 6: Common Mistakes & Code Nuances */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-base">06.</span>
                  Common Feeder Sizing Mistakes &amp; Critical Code Nuances
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                    <strong className="text-rose-900 block">1. Doubling One-Way Distance in Calculations</strong>
                    <p className="text-slate-600 text-xs">
                      Single-phase formulas already include the multiplier of 2 (<em>2 × K × I × L ÷ CM</em>) to account for both supply and return conductors. Always input the single-point <em>one-way distance</em> between panels.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                    <strong className="text-rose-900 block">2. Sizing Ampacity from 90°C Column without 90°C Terminations</strong>
                    <p className="text-slate-600 text-xs">
                      Although conductors like THHN/THWN-2 carry a 90°C insulation rating, circuit breaker lugs on residential panels are typically rated for 75°C. Under NEC 110.14(C), the conductor ampacity must be selected from the 75°C column of Table 310.16. The 90°C rating may only be used as a starting point for ambient temperature or conduit fill derating calculations.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                    <strong className="text-rose-900 block">3. Proportionate Grounding Conductor Upsizing (NEC 250.122(B))</strong>
                    <p className="text-slate-600 text-xs">
                      Under NEC 250.122(B), where ungrounded feeder conductors are increased in size for reasons such as voltage drop (rather than standard ambient or conduit fill derating adjustments), wire-type equipment grounding conductors (EGC) must be increased proportionately in circular mil area based on the ratio of the upsized conductor circular mils to the minimum code-required conductor circular mils. Note that specific metallic conduit raceways serving as equipment grounding paths or specialized qualified industrial systems follow distinct statutory provisions.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">4. Modern Subpanel Neutral Isolation (NEC 250.32 / 250.142)</strong>
                    <p className="text-slate-600 text-xs">
                      Under modern NEC standards, subpanels require a dedicated 4-wire feeder where the grounded neutral bus remains completely isolated (floating) from the equipment grounding bus and enclosure (main bonding jumper removed). Detached outbuildings also require a local grounding electrode system bonded to the EGC bus. Note that historic existing 3-wire feeders installed under pre-2008 code editions are subject to narrow legacy exceptions that must be evaluated on-site by a licensed electrician.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Code & Authority Notice */}
              <section className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 space-y-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Local Code Adoptions &amp; AHJ Verification
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Electrical installations must conform to the edition of the National Electrical Code (NEC) adopted by your
                  local Authority Having Jurisdiction (AHJ), including regional amendments. Voltage drop limits (3% feeder, 5% total)
                  are published as informational design recommendations in NEC Informational Note 215.2(A)(1) rather than mandatory prescriptive statutes in base NEC,
                  though certain local energy conservation codes mandate them. Always verify your specific feeder, raceway fill, and grounding schedule with a licensed electrical contractor and municipal building department.
                </p>
              </section>
            </div>

            {/* Sidebar CTA & Related Tools */}
            <div className="space-y-6">
              {/* Primary Interactive CTA Card */}
              <Card className="border-2 border-amber-500 bg-slate-950 text-slate-100 shadow-lg">
                <CardHeader className="pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Interactive Instrument
                  </span>
                  <CardTitle className="text-xl text-white">
                    Calculate Feeder Wire Size &amp; Drop
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <p>
                    Run real-time voltage drop calculations across 120V, 240V, and 208V circuits with instant copper vs. aluminum comparisons:
                  </p>
                  <Link
                    href="/electrical/voltage-drop-calculator"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-md"
                  >
                    <Calculator className="h-4 w-4" />
                    Open Voltage Drop Calculator
                  </Link>
                </CardContent>
              </Card>

              {/* Related Electrical Tools Card */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-amber-600" />
                    Related Electrical Sizing Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href="/electrical/residential-load-calculator"
                    className="p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-colors block group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                      Residential Service Load Calculator
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Calculate whole-house demand load (Amps &amp; kVA) per NEC 220.82 to determine spare panel capacity.
                    </p>
                  </Link>

                  <Link
                    href="/electrical/conduit-fill-calculator"
                    className="p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-colors block group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                      Electrical Conduit Fill Calculator
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Verify EMT, PVC, and RMC raceway trade sizes for upsized feeder wire bundles per NEC Chapter 9 tables.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/voltage-drop-250ft-6awg-50a-240v-subpanel"
                    className="p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-colors block group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                      Solution: 250ft 6 AWG 50A Subpanel Feeder
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Complete mathematical proof showing why 6 AWG exceeds 3% drop and requires #4 AWG upsizing.
                    </p>
                  </Link>

                  <Link
                    href="/solutions/feeder-ampacity-single-family-dwelling-200a-service"
                    className="p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition-colors block group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                      Solution: 200A Dwelling Service Feeder
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Step-by-step application of NEC 310.12 83% dwelling demand factor for 200A service feeders.
                    </p>
                  </Link>
                </CardContent>
              </Card>

              {/* Reference Standards Card */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    Published Code References
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block">NEC 2023 Table 310.16</strong>
                    <span>Allowable conductor ampacities of insulated conductors rated 0–2000V.</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block">NEC Chapter 9 Table 8</strong>
                    <span>Conductor properties, circular mil area, and DC resistance schedules.</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block">NEC Informational Note 215.2(A)(1)</strong>
                    <span>Maximum 3% feeder and 5% total branch circuit voltage drop recommendations.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
