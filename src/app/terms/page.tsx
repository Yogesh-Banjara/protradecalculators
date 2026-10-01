import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { ShieldAlert, FileText, Scale, AlertTriangle, Copyright } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | ProTradeCalculators",
  description:
    "Terms of service, preliminary calculation estimation limitations, intellectual property rights, and trade liability disclaimers.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbs = [{ name: "Terms of Service", url: "/terms" }];
  const pageSchema = buildWebPageSchema(
    "Terms of Service | ProTradeCalculators",
    "Terms of service, preliminary calculation estimation limitations, intellectual property rights, and trade liability disclaimers.",
    "/terms",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-8 sm:py-12">
        <Container size="md">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <Scale className="h-3.5 w-3.5 text-amber-600" />
              Legal Agreement &amp; Estimating Conditions
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              Last Updated: October 1, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-700 leading-relaxed">
            {/* 1. Acceptance of Terms */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                1. Acceptance of Agreement
              </h2>
              <p>
                By accessing, browsing, or utilizing the web applications, mathematical calculators, formula schedules,
                or worked solutions on ProTradeCalculators (&quot;we&quot;, &quot;us&quot;, or &quot;the Service&quot;),
                you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service
                and our Privacy Policy. If you do not agree to these terms, you must discontinue use immediately.
              </p>
            </section>

            {/* 2. Estimating & Calculation Limitations */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                2. Calculation Estimation Limitations &amp; Educational Purpose
              </h2>
              <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 font-medium text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
                  MANDATORY PRELIMINARY ESTIMATING NOTICE
                </div>
                <p>
                  Calculators, code tables, and formula derivations on this platform are deterministic mathematical models
                  intended strictly for <strong>preliminary takeoff estimating, educational reference, and trade exam preparation</strong>.
                </p>
              </div>
              <p>
                Construction, electrical, and structural installations involve dynamic real-world variables that cannot be
                modeled by a web application alone. These include, but are not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>Ambient temperature fluctuations and solar exposure conduit deratings;</li>
                <li>Manufacturer specific equipment tolerances, terminal lug ratings, and internal resistance variances;</li>
                <li>Soil bearing capacities, excavation compaction rates, and concrete batch water-cement ratios;</li>
                <li>Local municipal building code amendments adopted by the local Authority Having Jurisdiction (AHJ).</li>
              </ul>
            </section>

            {/* 3. Trade Liability Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                3. Trade Liability &amp; No Professional Advice Disclaimer
              </h2>
              <p>
                The outputs and solutions provided on this website do <strong>not</strong> constitute licensed engineering,
                architectural, master electrical contracting, or legal building compliance advice. All structural loads,
                service panel calculations, raceway fill schedules, and feeder wire sizes must be independently verified
                on-site by a <strong>licensed master electrician, registered professional engineer (PE), or licensed general contractor</strong>{" "}
                prior to material procurement, installation, or building permit submittal.
              </p>
              <p>
                Under no circumstances shall ProTradeCalculators, its creators, authors, contributors, or hosting providers
                be held liable for material shortages, material overages, equipment damage, arc flash incidents, structural
                failures, inspection rejections, financial losses, or personal injury resulting from reliance on website
                calculations.
              </p>
            </section>

            {/* 4. Intellectual Property */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Copyright className="h-4 w-4 text-indigo-600" />
                4. Intellectual Property &amp; Permitted Use
              </h2>
              <p>
                All original software code, UI designs, brand logos, explanatory diagrams, editorial guide texts, and
                software architecture are the intellectual property of ProTradeCalculators and protected under international
                copyright laws.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>
                  <strong>Permitted Use:</strong> Users are granted a revocable, non-exclusive license to use the calculators
                  for personal, jobsite, and commercial estimating purposes.
                </li>
                <li>
                  <strong>Prohibited Use:</strong> Automated scraping, programmatic mirroring, bulk extraction of worked
                  solutions, or redistributing the calculation engine as a competing service without written authorization is
                  strictly prohibited.
                </li>
                <li>
                  <strong>Statutory Reference Attribution:</strong> Citations to the National Electrical Code (NFPA 70®) are
                  fair-use references to published public safety standards. NFPA 70® is a registered trademark of the National
                  Fire Protection Association.
                </li>
              </ul>
            </section>

            {/* 5. Contact & Dispute Resolution */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                5. Technical Questions &amp; Legal Notices
              </h2>
              <p>
                For questions regarding these terms, please contact our legal and administrative desk:
              </p>
              <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
                Email:{" "}
                <span className="text-amber-400 font-bold select-all">
                  legal@protradecalculators.com
                </span>{" "}
                &bull; Contact Form:{" "}
                <Link href="/contact" className="text-amber-300 underline font-sans">
                  protradecalculators.com/contact
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
