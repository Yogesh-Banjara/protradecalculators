import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/lib/seo/schema";
import { CalculatorEmbed } from "@/components/solutions/calculator-embed";
import { SolutionActions } from "@/components/solutions/solution-actions";
import necProblems from "@/data/nec-problems.json";
import {
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calculator,
  ShieldCheck,
} from "lucide-react";

export function generateStaticParams() {
  return necProblems.map((problem) => ({
    slug: problem.slug,
  }));
}

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = necProblems.find((p) => p.slug === slug);

  if (!problem) {
    return { title: "Solution Not Found" };
  }

  const seoTitle = (problem as { seoTitle?: string }).seoTitle || problem.title;

  return generatePageMetadata({
    title: seoTitle,
    description: problem.metaDescription,
    path: `/solutions/${problem.slug}`,
    keywords: [
      problem.title.toLowerCase(),
      problem.necReference.toLowerCase(),
      "nec calculation",
      "electrical code solution",
      "step-by-step electrical calculation",
    ],
  });
}

const PARENT_CALCULATOR_MAP: Record<string, { name: string; url: string }> = {
  "load-calculator": {
    name: "Residential Electrical Service Load Calculator",
    url: "/electrical/residential-load-calculator",
  },
  "motor-calculator": {
    name: "Electrical Wire Size & Voltage Drop Calculator",
    url: "/electrical/voltage-drop-calculator",
  },
  "voltage-drop-calculator": {
    name: "Electrical Wire Size & Voltage Drop Calculator",
    url: "/electrical/voltage-drop-calculator",
  },
  "conduit-fill-calculator": {
    name: "Electrical Conduit Fill Calculator",
    url: "/electrical/conduit-fill-calculator",
  },
};

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const problem = necProblems.find((p) => p.slug === slug);

  if (!problem) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Solutions", url: "/solutions" },
    { name: problem.title, url: `/solutions/${problem.slug}` },
  ];

  const parentTool = PARENT_CALCULATOR_MAP[problem.calculatorType] ?? {
    name: "Electrical & Conduit Calculators",
    url: "/categories/electrical",
  };

  const pageSchema = buildWebPageSchema(
    problem.title,
    problem.metaDescription,
    `/solutions/${problem.slug}`,
    breadcrumbs
  );

  const faqSchema = buildFaqSchema([
    {
      question: problem.title,
      answer: `${problem.steps.join(" ")} Answer: ${problem.answer}`,
    },
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  const otherProblems = (necProblems as Array<{
    slug: string;
    title: string;
    metaDescription: string;
    category: string;
    calculatorType: string;
    necReference: string;
    formula: string;
    steps: string[];
    answer: string;
  }>).filter((p) => p.slug !== problem.slug);

  const sameCalculatorType = otherProblems.filter((p) => p.calculatorType === problem.calculatorType);
  const sameCategoryOnly = otherProblems.filter(
    (p) => p.category === problem.category && p.calculatorType !== problem.calculatorType
  );
  const differentCategory = otherProblems.filter((p) => p.category !== problem.category);

  const relatedProblems = [
    ...sameCalculatorType,
    ...sameCategoryOnly,
    ...differentCategory,
  ].slice(0, 3);

  return (
    <>
      <JsonLd schema={[pageSchema, faqSchema, breadcrumbSchema]} />

      <div className="py-8 sm:py-10 space-y-10">
        <Container>
          {/* Breadcrumbs: Home > Solutions > [Problem Title] */}
          <div className="no-print">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* Above the fold header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="text-xs px-3 py-1 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {problem.necReference}
              </Badge>
              <Badge variant="neutral" className="text-xs px-2.5 py-0.5">
                {problem.category}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {problem.title}
            </h1>

            {/* Utility action buttons: Copy Solution & Print Worksheet */}
            <SolutionActions
              title={problem.title}
              necReference={problem.necReference}
              formula={problem.formula}
              answer={problem.answer}
              slug={problem.slug}
            />

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {problem.metaDescription}
            </p>
          </div>

          {/* Direct Answer Callout Banner */}
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-amber-500/40 print:bg-slate-50 print:border-slate-300 shadow-sm mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-800 print:text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 print:text-slate-800" />
                  Direct Answer
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {problem.answer}
                </div>
                <p className="text-xs text-slate-600">
                  Calculated strictly in accordance with {problem.necReference}.
                </p>
              </div>

              <div className="shrink-0 no-print">
                <Link
                  href={parentTool.url}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <Calculator className="h-4 w-4" />
                  Open Full Calculator
                </Link>
              </div>
            </div>
          </div>

          {/* Embedded Interactive Calculator */}
          <section className="mb-12 space-y-4 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-amber-600" />
                  Interactive Scenario Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Adjust values below to test custom variations of this NEC problem.
                </p>
              </div>
            </div>

            <CalculatorEmbed
              calculatorType={problem.calculatorType}
              inputs={problem.inputs}
            />
          </section>

          {/* Step-by-Step Mathematical Solution */}
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-600" />
                Step-by-Step Mathematical Solution
              </h2>
              <p className="text-sm text-slate-600">
                Detailed calculation derivation citing applicable National Electrical Code articles.
              </p>
            </div>

            {/* Given Scenario Parameters */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Given Scenario Parameters:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                {Object.entries(problem.inputs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-medium text-slate-500 block capitalize">
                      {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                      {Array.isArray(val)
                        ? `${val.length} conductors`
                        : typeof val === "boolean"
                        ? val ? "Continuous (125%)" : "Non-continuous"
                        : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Callout */}
            <div className="p-4 sm:p-5 rounded-lg bg-slate-900 text-white print:bg-slate-100 print:text-slate-950 print:border-slate-300 font-mono border border-slate-800 shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-amber-400 print:text-slate-700 uppercase tracking-wider block font-sans">
                Governing Equation:
              </span>
              <div className="text-base sm:text-lg text-amber-300 print:text-slate-950 font-bold">
                {problem.formula}
              </div>
              <span className="text-[11px] text-slate-400 print:text-slate-600 block font-sans">
                Citing {problem.necReference}
              </span>
            </div>

            {/* Numbered Steps */}
            <div className="space-y-3">
              {problem.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-4 print:shadow-none print:border-slate-300"
                >
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-900 print:bg-slate-200 print:text-slate-900 font-bold text-sm shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 pt-0.5">
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Conclusion Box */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-center justify-between print:border-slate-300">
              <div>
                <span className="font-semibold text-slate-900">Final Recommendation: </span>
                <span>{problem.answer}</span>
              </div>
              <Badge variant="outline" className="text-xs font-mono shrink-0">
                {problem.necReference}
              </Badge>
            </div>
          </section>

          {/* Link back to parent calculator tool */}
          <div className="pt-10 no-print">
            <Link
              href={parentTool.url}
              className="group p-6 rounded-xl bg-slate-900 text-white border border-slate-800 hover:border-amber-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 block shadow-md"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Comprehensive Takeoff Tool
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Open full {parentTool.name} for custom calculations &rarr;
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Perform full project sizing, multi-circuit analysis, and printable jobsite schedules.
                </p>
              </div>
              <div className="flex items-center text-amber-400 font-bold text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                Go to Calculator <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </Link>
          </div>

          {/* Related NEC Calculations */}
          <section className="pt-10 border-t border-slate-200 space-y-6 no-print">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Related NEC Calculations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Explore companion worked examples, code compliance proofs, and sizing derivations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProblems.map((item) => (
                <div
                  key={item.slug}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="brand" className="text-[11px] px-2.5 py-0.5 font-semibold">
                        {item.necReference}
                      </Badge>
                      <Badge variant="neutral" className="text-[11px] px-2 py-0.5">
                        {item.category}
                      </Badge>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      <Link href={`/solutions/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.metaDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href={`/solutions/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      View Worked Solution &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
