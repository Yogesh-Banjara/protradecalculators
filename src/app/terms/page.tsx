import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description: "Terms and conditions governing the use of ProTrade Calculators.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbs = [{ name: "Terms of Service", url: "/terms" }];
  const pageSchema = buildWebPageSchema(
    "Terms of Service",
    "Terms and conditions governing the use of ProTrade Calculators.",
    "/terms",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-10">
        <Container size="md">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
            <p className="text-sm text-slate-500">Last updated: September 1, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using ProTrade Calculators (&quot;the website&quot;), you agree to be
                bound by these Terms of Service. If you do not agree to these terms, please do not
                use the website.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                2. Estimating &amp; Engineering Disclaimer
              </h2>
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-950 font-medium text-xs">
                IMPORTANT NOTICE: The calculators, formulas, data tables, and estimating outputs
                provided on this website are for preliminary informational and planning purposes
                only.
              </div>
              <p>
                Construction projects are subject to numerous variable conditions including site
                soil bearing capacity, structural loads, temperature variations, building codes,
                material quality, and contractor installation practices.
              </p>
              <p>
                <strong>No Professional Advice:</strong> The tools on this website do not constitute
                licensed structural engineering, architectural design, electrical engineering, or
                legal contracting advice. Always consult licensed structural engineers, registered
                architects, and certified trade professionals prior to ordering materials, pouring
                concrete, or modifying load-bearing structures.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Limitation of Liability</h2>
              <p>
                In no event shall ProTrade Calculators, its contributors, or maintainers be
                liable for any direct, indirect, incidental, special, consequential, or exemplary
                damages resulting from material shortages, material overages, project delays, structural
                failures, or inaccuracies in calculations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. Modifications</h2>
              <p>
                We reserve the right to revise or modify these terms at any time without prior notice.
                Continued use of the website following any changes constitutes acceptance of the
                revised terms.
              </p>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
