import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { ShieldCheck, Cpu, Scale, BookOpen } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "About & Calculation Standards",
  description:
    "Learn about our engineering philosophy, calculation accuracy standards, unit models, and transparency methodology.",
  path: "/about",
  keywords: ["calculation methodology", "construction standards", "material takeoff accuracy"],
});

export default function AboutPage() {
  const breadcrumbs = [{ name: "About & Methodology", url: "/about" }];
  const pageSchema = buildWebPageSchema(
    "About & Calculation Standards",
    "Learn about our engineering philosophy, calculation accuracy standards, unit models, and transparency methodology.",
    "/about",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-10">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              About &amp; Calculation Standards
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Construction &amp; Trade Tools was built to provide trade professionals, estimators,
              and builders with free, deterministic, and jobsite-accurate mathematical tools.
            </p>
          </div>

          <div className="space-y-10">
            {/* Mission & Transparency */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
                Our Core Principles
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Many online calculators are designed as thin content vehicles packed with generic text
                and opaque algorithms. We approach tool design from an engineering-first perspective:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-amber-600" />
                      1. Deterministic Calculation Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    All calculation algorithms are written as pure functions with strict unit-awareness,
                    explicit boundary rounding, and IEEE-754 floating-point correction.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber-600" />
                      2. Transparent Formulas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    Every result displays the mathematical step-by-step progression and raw values so
                    estimators can verify numbers against job specifications.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Units & Conversion Methodology */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-amber-600" />
                Dimensional Units &amp; Standards
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Our calculation engine maintains exact conversion factors based on international SI standards:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>
                  <strong>Length:</strong> 1 inch = exactly 0.0254 meters; 1 foot = exactly 0.3048 meters; 1 yard = exactly 0.9144 meters.
                </li>
                <li>
                  <strong>Volume:</strong> 1 cubic yard = 27 cubic feet = 0.764554857984 cubic meters.
                </li>
                <li>
                  <strong>Weight:</strong> 1 avoirdupois pound = exactly 0.45359237 kilograms; 1 short ton = 2,000 lbs.
                </li>
                <li>
                  <strong>Density Reference Data:</strong> Standard normal-weight concrete is modeled at 145 lb/cu ft (2.0 tons/cu yd); clean crushed gravel is modeled at 100 lb/cu ft (1.35 tons/cu yd).
                </li>
              </ul>
            </section>

            {/* Disclaimers & Field Verification */}
            <section className="bg-slate-100 p-6 rounded-lg border border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Field Verification &amp; Engineering Disclaimer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                While all algorithms are rigorously tested against standard engineering formulas and ASTM/trade reference tables, physical site conditions vary. Factors such as excavation overbreak, formwork deflection, compaction shrinkage, and site waste require field verification by licensed contractors and engineers.
              </p>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
