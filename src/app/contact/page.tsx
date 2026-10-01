import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { Mail, MessageSquare, Bug, ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact & Technical Corrections | ProTradeCalculators",
  description:
    "Submit code discrepancy audits, mathematical formula corrections, tool suggestions, or general technical inquiries to the ProTradeCalculators engineering team.",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumbs = [{ name: "Contact & Corrections", url: "/contact" }];
  const pageSchema = buildWebPageSchema(
    "Contact & Technical Corrections | ProTradeCalculators",
    "Submit code discrepancy audits, mathematical formula corrections, tool suggestions, or general technical inquiries to the ProTradeCalculators engineering team.",
    "/contact",
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
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              Engineering Peer Review &amp; Inquiries
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Contact &amp; Code Corrections
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              We welcome peer review from master electricians, electrical engineers, licensed contractors,
              building inspectors, and vocational instructors. If you spot a formula edge case, local code variance,
              or want to suggest a new tool, reach out below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bug className="h-4 w-4 text-amber-600" />
                    Code Discrepancies &amp; Bug Reports
                  </CardTitle>
                  <CardDescription>
                    Report potential discrepancies in NEC tables, formulas, or rounding logic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    Please include the specific calculator URL, input values, expected result, and cite the
                    applicable <strong>NEC Edition (2020, 2023, 2026), Article, or Table</strong>.
                  </p>
                  <div className="p-2.5 rounded bg-slate-100 font-mono text-xs text-slate-800">
                    corrections@protradecalculators.com
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                    Tool Requests &amp; Trade Features
                  </CardTitle>
                  <CardDescription>
                    Suggest new calculators or trade takeoff schedules for upcoming development.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    Tell us what takeoff challenge or calculation slowdown you encounter most frequently on the
                    jobsite or in the estimating trailer.
                  </p>
                  <div className="p-2.5 rounded bg-slate-100 font-mono text-xs text-slate-800">
                    feedback@protradecalculators.com
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* General Inquiries Box */}
            <Card className="bg-slate-900 text-slate-100 border-slate-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-amber-400" />
                  General &amp; Editorial Inquiries
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Direct communication with our editorial and development maintainers.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-3">
                <p>
                  Primary Email:{" "}
                  <span className="font-mono text-amber-400 font-semibold select-all">
                    contact@protradecalculators.com
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Response Time: Typically within 24-48 business hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Audits reviewed by certified engineering staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <span>Looking for validation protocols and code citations?</span>
              <Link
                href="/methodology"
                className="text-amber-700 hover:text-amber-800 font-bold underline"
              >
                Read our Calculation Methodology &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
