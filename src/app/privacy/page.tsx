import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "Read our privacy policy regarding data handling, cookies, and website usage.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const breadcrumbs = [{ name: "Privacy Policy", url: "/privacy" }];
  const pageSchema = buildWebPageSchema(
    "Privacy Policy",
    "Read our privacy policy regarding data handling, cookies, and website usage.",
    "/privacy",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-10">
        <Container size="md">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Last updated: September 1, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Overview</h2>
              <p>
                Construction &amp; Trade Tools (&quot;we&quot;, &quot;our&quot;, or &quot;the website&quot;) operates as a free,
                public utility website offering calculation and estimating tools. We are committed
                to respecting your privacy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. Information We Do Not Collect</h2>
              <p>
                Our calculation tools execute locally in your browser. We do not require user
                accounts, passwords, phone numbers, or credit card details. Numerical inputs entered
                into calculator fields are processed purely to provide calculation results and are not
                stored on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Log Files &amp; Standard Analytics</h2>
              <p>
                Like most websites, our web hosting infrastructure automatically logs standard technical
                requests (such as IP address, browser type, referring page, and timestamp) for server
                maintenance, security, and uptime monitoring.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. Cookies &amp; Advertising</h2>
              <p>
                The website may display third-party advertisements (such as Google AdSense) to fund
                free access to our tools. Third-party vendors, including Google, use cookies to serve
                ads based on prior visits to this website or other websites. You may opt out of
                personalized advertising by visiting Google Ads Settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">5. Contact</h2>
              <p>
                If you have questions regarding this privacy policy, you may reach out through our{" "}
                <a href="/contact" className="text-amber-700 underline">
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
