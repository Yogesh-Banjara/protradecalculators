import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
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
  Check,
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

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  const faqSchema = buildFaqSchema([
    {
      question: `How do you calculate ${problem.title}?`,
      answer: `This scenario is solved using the governing equation: ${problem.formula}. Following ${problem.necReference}, the calculated result is ${problem.answer}.`,
    },
    {
      question: `What NEC code applies to ${problem.title}?`,
      answer: `This calculation is governed by ${problem.necReference}. Specific rules include thermal conductor limits, derating adjustments, and standard overcurrent device sizing.`,
    },
  ]);

  // Find up to 3 related problem cards (preferring same category)
  const relatedProblems = necProblems
    .filter((p) => p.slug !== problem.slug)
    .sort((a, b) => {
      const aMatch = (a.category === problem.category || a.calculatorType === problem.calculatorType) ? 1 : 0;
      const bMatch = (b.category === problem.category || b.calculatorType === problem.calculatorType) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 3);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema, faqSchema]} />

      <div className="py-8 sm:py-10 bg-slate-50 min-h-screen">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          {/* Solution Header & Badges */}
          <div className="space-y-4 my-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                {problem.necReference}
              </span>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                Worked Example
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {problem.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {problem.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {problem.metaDescription}
            </p>

            {/* Utility action buttons: Copy Solution & Print Worksheet */}
            <SolutionActions
              title={problem.title}
              necReference={problem.necReference}
              formula={problem.formula}
              answer={problem.answer}
              slug={problem.slug}
            />
          </div>

          {/* Green Direct Answer Banner matching Showcase */}
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 shadow-xs mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    Direct Answer
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-0.5">
                    {problem.answer}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Calculated strictly in accordance with {problem.necReference}.
                  </p>
                </div>
              </div>

              <Link
                href={parentTool.url}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
              >
                <Calculator className="h-4 w-4" />
                <span>Open Calculator</span>
              </Link>
            </div>
          </div>

          {/* Two-Column Layout: Left = Sticky Sidebar, Right = Interactive Tool & Derivations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Sticky "On This Page" Sidebar (4 Cols on Desktop) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  On This Page
                </h3>
                <nav className="space-y-1.5 text-xs font-semibold">
                  <a
                    href="#problem-statement"
                    className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    1. Problem Statement &amp; Givens
                  </a>
                  <a
                    href="#interactive-calculator"
                    className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    2. Interactive Calculator (Pre-filled)
                  </a>
                  <a
                    href="#step-by-step-solution"
                    className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    3. Step-by-Step Mathematical Solution
                  </a>
                  <a
                    href="#nec-references"
                    className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    4. NEC Code References
                  </a>
                  <a
                    href="#related-calculations"
                    className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    5. Related NEC Calculations
                  </a>
                </nav>
              </div>

              {/* Quick Calculator Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calculator className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Full Engineering Suite
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Need custom loads or multi-circuit runs?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Use the full {parentTool.name} for deratings and printable worksheets.
                </p>
                <Link
                  href={parentTool.url}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1"
                >
                  <span>Launch Full Instrument</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Pre-filled Calculator & Derivations (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Problem Statement & Given Parameters */}
              <section id="problem-statement" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Given Scenario Parameters
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(problem.inputs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-[11px] font-semibold text-slate-500 block capitalize truncate">
                        {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {Array.isArray(val)
                          ? `${val.length} conductors`
                          : typeof val === "boolean"
                          ? val ? "Continuous (125%)" : "Non-continuous"
                          : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Embedded Pre-Filled Calculator */}
              <section id="interactive-calculator" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Interactive Calculator (Pre-filled)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Adjust inputs to evaluate variations of this NEC code scenario.
                    </p>
                  </div>
                </div>

                <CalculatorEmbed
                  calculatorType={problem.calculatorType}
                  inputs={problem.inputs}
                />
              </section>

              {/* 3. Step-by-Step Mathematical Derivation */}
              <section id="step-by-step-solution" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                    <span>Step-by-Step Solution</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Formal engineering derivation citing applicable National Electrical Code articles.
                  </p>
                </div>

                {/* Formula Highlight Banner */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                    Governing Code Equation
                  </span>
                  <div className="text-base sm:text-lg font-bold font-mono text-blue-950">
                    {problem.formula}
                  </div>
                  <span className="text-xs text-blue-800 font-medium block">
                    Citing {problem.necReference}
                  </span>
                </div>

                {/* Numbered Steps */}
                <div className="space-y-4">
                  {problem.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3.5"
                    >
                      <span className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final Recommendation Box */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-emerald-950">Conclusion: </span>
                    <span className="text-emerald-900 font-semibold">{problem.answer}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {problem.necReference}
                  </span>
                </div>
              </section>

              {/* 4. Related NEC Calculations */}
              <section id="related-calculations" className="pt-4 space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Related NEC Calculations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedProblems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/solutions/${item.slug}`}
                      className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                          {item.necReference}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                      </div>

                      <span className="text-xs font-bold text-amber-600 group-hover:text-amber-700 inline-flex items-center gap-1 pt-2 border-t border-slate-100">
                        <span>View Solution</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
