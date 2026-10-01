import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import necProblems from "@/data/nec-problems.json";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "NEC Electrical Solutions & Step-by-Step Calculations",
  description:
    "Explore solved National Electrical Code (NEC) calculation problems with step-by-step derivations, code references, and interactive calculation tools.",
  path: "/solutions",
  keywords: [
    "nec calculation solutions",
    "electrical code problems",
    "step by step electrical calculations",
    "nec wire sizing problems",
    "conduit fill examples",
  ],
});

export default function SolutionsIndexPage() {
  const breadcrumbs = [{ name: "Solutions", url: "/solutions" }];

  const pageSchema = buildWebPageSchema(
    "NEC Electrical Solutions & Step-by-Step Calculations",
    "Explore solved National Electrical Code (NEC) calculation problems with step-by-step derivations and interactive calculators.",
    "/solutions",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />

      <div className="py-8 sm:py-10 space-y-10">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <BookOpen className="h-3.5 w-3.5" />
              Verified NEC Reference Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Real-World NEC Calculation Solutions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Step-by-step mathematical solutions and code citations for common electrical engineering and trade exam scenarios. Each scenario includes direct answers, mathematical derivations, and pre-loaded interactive calculation instruments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {necProblems.map((problem) => (
              <Link
                key={problem.slug}
                href={`/solutions/${problem.slug}`}
                className="p-6 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="brand" className="text-xs">
                      {problem.necReference}
                    </Badge>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {problem.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {problem.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {problem.metaDescription}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                      Direct Result:
                    </span>
                    <span className="font-bold text-slate-900">{problem.answer}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-amber-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                  View Full Step-by-Step Solution <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
