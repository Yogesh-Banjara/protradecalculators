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
  ShieldCheck,
  BookOpen,
  Calculator,
  AlertTriangle,
  Mail,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Calculation Methodology & NEC Standards Compliance",
  description:
    "Editorial guidelines, mathematical validation protocols, and National Electrical Code (NFPA 70) reference standards.",
  path: "/methodology",
  keywords: [
    "nec calculation methodology",
    "electrical standards compliance",
    "nfpa 70 calculations",
    "trade calculator accuracy",
    "voltage drop formula verification",
    "conduit fill compliance",
  ],
});

export default function MethodologyPage() {
  const breadcrumbs = [
    { name: "Methodology & Compliance", url: "/methodology" },
  ];

  const pageSchema = buildWebPageSchema(
    "Calculation Methodology & NEC Standards Compliance",
    "Editorial guidelines, mathematical validation protocols, and National Electrical Code (NFPA 70) reference standards.",
    "/methodology",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />
      <div className="py-8 sm:py-12">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              YMYL Engineering Standards &amp; Quality Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Calculation Methodology &amp; Standards Compliance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Every calculator, worked scenario, and reference table on ProTradeCalculators is
              governed by strict mathematical validation protocols, published national codes, and
              uncompromising engineering standards.
            </p>
          </div>

          <div className="space-y-12">
            {/* Section 1: Official Reference Sources */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-amber-600" />
                1. Official Reference Sources &amp; Code Baselines
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Our mathematical models and algorithmic lookup tables are anchored directly to
                recognized national standard specifications, primarily published by the National Fire
                Protection Association (NFPA) and the Institute of Electrical and Electronics Engineers (IEEE):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      NFPA 70® National Electrical Code (NEC)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p>
                      Formulas and schedules are cross-referenced across the <strong>2020, 2023, and 2026 NEC Editions</strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-xs">
                      <li><strong>NEC Chapter 9, Tables 1, 4 &amp; 5:</strong> Conductor dimensions and raceway fill cross-sections.</li>
                      <li><strong>NEC Table 310.16 &amp; 310.12:</strong> Allowable conductor ampacities and residential 83% service factor.</li>
                      <li><strong>NEC Article 220:</strong> Branch, feeder, and service load calculation methods.</li>
                      <li><strong>NEC Article 430 &amp; Table 430.250:</strong> Full-load motor current and inverse-time breaker sizing.</li>
                      <li><strong>NEC Article 250 &amp; Table 250.66:</strong> Grounding electrode conductor sizing.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      IEEE 141 &amp; Engineering Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p>
                      Industrial physics standards for thermal and electrical performance:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-xs">
                      <li><strong>IEEE Standard 141 (Red Book):</strong> Recommended Practice for Electric Power Distribution for Industrial Plants.</li>
                      <li><strong>Resistivity Constants (K):</strong> Copper (K = 12.9 ohms-cmil/ft) and Aluminum (K = 21.2 ohms-cmil/ft) at 75&deg;C.</li>
                      <li><strong>Square Root of 3 Constant:</strong> Exact &radic;3 &approx; 1.73205 multiplier applied for 3-phase line-to-line balanced systems.</li>
                      <li><strong>Circular Mil Standards:</strong> Exact circular mil areas from ASTM B258 standards.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2: Mathematical Verification Protocol */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Calculator className="h-6 w-6 text-amber-600" />
                2. Mathematical Verification &amp; Testing Protocols
              </h2>
              <p className="text-slate-700 leading-relaxed">
                To guarantee zero silent calculation failure and absolute mathematical repeatability, our tool algorithms undergo automated multi-tier regression tests before reaching production:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Automated Test Suites
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 430 unit and integration tests execute on every build to verify edge cases, boundary values, zero-division safety, and decimal precision.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Deterministic Logic
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero heuristic guessing, probabilistic AI outputs, or hidden magic multipliers. Every intermediate result is derived strictly from public mathematical equations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Conservative Rounding
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Where safety margins are concerned (such as conduit fill or breaker trip thresholds), algorithms favor standard next-size-up rules per NEC 240.6(A).
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Safety & Legal Disclaimer */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                3. Safety, Professional Disclaimer &amp; AHJ Authority
              </h2>
              <div className="p-6 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-slate-800 leading-relaxed">
                    <p className="font-bold text-slate-900">
                      Mandatory Professional Notice
                    </p>
                    <p>
                      Calculations, formulas, and worked examples provided on ProTradeCalculators are designed exclusively for <strong>preliminary design estimation, trade instructional reference, and engineering exam preparation</strong>.
                    </p>
                    <p>
                      Physical installation of electrical systems carries severe risk of electrocution, fire, arc flash, and equipment damage. All electrical branch circuits, service equipment, and feeders must be designed, verified, and installed by a <strong>licensed master electrician or registered professional engineer (PE)</strong>.
                    </p>
                    <p>
                      Local jurisdictions adopt model codes with specific local amendments. The local <strong>Authority Having Jurisdiction (AHJ)</strong> maintains final legal authority over code interpretation, permit issuance, and inspection approval.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Corrections & Feedback Channel */}
            <section className="space-y-5 pt-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Mail className="h-6 w-6 text-amber-600" />
                4. Peer Review, Corrections &amp; Technical Inquiries
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We welcome technical scrutiny from licensed electricians, electrical inspectors, engineers, and educators. If you identify a code revision discrepancy, table discrepancy, or formula edge case, our engineering review team conducts immediate audits.
              </p>

              <div className="p-6 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    Submit a Technical Correction or Code Suggestion
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Cite specific NEC edition, article, and table numbers for expedited editorial review.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shrink-0 shadow-sm"
                >
                  Contact Engineering Review <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
