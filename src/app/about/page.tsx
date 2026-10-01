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
  ShieldCheck,
  Cpu,
  Scale,
  BookOpen,
  GraduationCap,
  Wrench,
  Users,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "About ProTradeCalculators | Engineering & Trade Calculation Precision",
  description:
    "Learn about ProTradeCalculators: our mission, editorial review standards, focus on National Electrical Code (NEC) compliance, and who our deterministic tools are built for.",
  path: "/about",
  keywords: [
    "about protrade calculators",
    "trade calculation precision",
    "nec calculation standards",
    "electrical estimating tools",
    "contractor math engine",
  ],
});

export default function AboutPage() {
  const breadcrumbs = [{ name: "About & Methodology", url: "/about" }];
  const pageSchema = buildWebPageSchema(
    "About ProTradeCalculators | Engineering & Trade Calculation Precision",
    "Learn about ProTradeCalculators: our mission, editorial review standards, focus on National Electrical Code (NEC) compliance, and who our deterministic tools are built for.",
    "/about",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-8 sm:py-12">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              Engineering Integrity &amp; Open Trade Science
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              About ProTradeCalculators
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              ProTradeCalculators was engineered to provide trade professionals, master electricians,
              estimators, contractors, and vocational students with deterministic, jobsite-accurate mathematical
              takeoff instruments—free from paywalls, forced logins, or heuristic approximations.
            </p>
          </div>

          <div className="space-y-12">
            {/* Mission Statement */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Cpu className="h-6 w-6 text-amber-600" />
                Our Core Mission
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Modern construction estimating and electrical design have become cluttered by ad-bloated,
                thin-content web pages that hide proprietary math behind paywalls or use opaque, generic formulas.
                Our mission is to establish the open standard for trade calculations: pure, transparent,
                and mathematically rigorous tools built directly on published engineering physics and national building codes.
              </p>
            </section>

            {/* Who Our Tools Are Built For */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Users className="h-6 w-6 text-amber-600" />
                Who We Build For
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Our suite of 15+ calculators and 20+ worked NEC problem scenarios is specifically designed for:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Wrench className="h-4 w-4 text-amber-600" />
                    Licensed Electricians
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Rapid on-site sizing for raceway fill, motor feeder branch protection, subpanel voltage drops, and box volume capacities.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Scale className="h-4 w-4 text-amber-600" />
                    General Contractors
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Accurate material takeoffs for concrete yardage, framing lumber counts, stair stringer dimensions, and drywall sheets.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Cpu className="h-4 w-4 text-amber-600" />
                    Professional Estimators
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Deterministic figures with waste factor models to prevent costly bid overruns and procurement shortages.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <GraduationCap className="h-4 w-4 text-amber-600" />
                    Apprentices &amp; Students
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Step-by-step mathematical derivations citing exact code articles for journeyman and master electrician exam preparation.
                  </p>
                </div>
              </div>
            </section>

            {/* Focus on National Electrical Code (NEC) Compliance */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-amber-600" />
                Focus on National Electrical Code (NEC / NFPA 70®)
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Electrical installations represent significant life-safety and fire-prevention responsibilities.
                Our electrical suite is anchored directly in the National Electrical Code published by the NFPA:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Coded Engineering Equations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                    <p>
                      Every conductor ampacity, derating multiplier, and raceway calculation strictly implements:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-xs">
                      <li>NEC Chapter 9 Tables 1, 4, 5 (Raceway dimensions &amp; 40% fill limits)</li>
                      <li>NEC Article 310 &amp; Table 310.16 (Allowable ampacities at 60°C, 75°C, 90°C)</li>
                      <li>NEC Article 220 (Dwelling unit service loads &amp; 83% Table 310.12 factor)</li>
                      <li>NEC Article 430 &amp; Table 430.250 (3-phase motor FLC &amp; breaker sizing)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Transparent Editorial Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                    <p>
                      We uphold rigorous peer-review and testing standards:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-xs">
                      <li>Automated test suites covering 430+ unit test scenarios on every deployment</li>
                      <li>Explicit step-by-step mathematical disclosure for all worked solutions</li>
                      <li>Formal peer-review channel for code revisions and AHJ amendments</li>
                      <li>Zero algorithmic black-boxes or heuristic AI estimations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Editorial Review & Methodology Notice */}
            <section className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  Standards Compliance
                </div>
                <h3 className="text-lg font-bold text-white">
                  Read Our Formal Calculation Methodology
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Review IEEE 141 physics constants, rounding conventions, and safety notices.
                </p>
              </div>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shrink-0 shadow-sm"
              >
                View Full Methodology &rarr;
              </Link>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
