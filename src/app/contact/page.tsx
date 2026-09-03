import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { Mail, MessageSquare, Bug } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact & Feedback",
  description: "Get in touch with the ProTrade Calculators team for tool suggestions, formula corrections, or inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumbs = [{ name: "Contact", url: "/contact" }];
  const pageSchema = buildWebPageSchema(
    "Contact & Feedback",
    "Get in touch with the ProTrade Calculators team for tool suggestions, formula corrections, or inquiries.",
    "/contact",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-10">
        <Container size="md">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Contact &amp; Feedback</h1>
            <p className="text-base text-slate-600 leading-relaxed">
              We welcome suggestions for new calculators, trade standard references, and formula
              verification from contractors, estimators, and tradespeople.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bug className="h-4 w-4 text-amber-600" />
                    Formula Corrections &amp; Bugs
                  </CardTitle>
                  <CardDescription>
                    If you identify an edge case, mathematical discrepancy, or regional code difference.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Please provide the exact inputs, expected result, and relevant trade reference standard.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                    Tool Requests
                  </CardTitle>
                  <CardDescription>
                    Suggest a new calculator for our upcoming trade suites.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Let us know what trade takeoff problem you want to automate next.
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 text-slate-100 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-amber-400" />
                  Electronic Communication
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Direct all technical feedback and inquiries to our project maintainers.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-300">
                <p>
                  You can reach the maintenance team at:{" "}
                  <span className="font-mono text-amber-400 font-semibold select-all">
                    contact@protradecalculators.com
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  We strive to review all technical feedback within 2 business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
}
