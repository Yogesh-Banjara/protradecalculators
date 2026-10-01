import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";
import { ShieldCheck, Lock, Eye, Cookie, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy & AdSense Disclosures",
  description:
    "Comprehensive privacy policy covering data handling, Google AdSense monetization, cookie usage, GDPR compliance, and CCPA privacy disclosures.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const breadcrumbs = [{ name: "Privacy Policy", url: "/privacy-policy" }];
  const pageSchema = buildWebPageSchema(
    "Privacy Policy | ProTradeCalculators",
    "Comprehensive privacy policy covering data handling, Google AdSense monetization, cookie usage, GDPR compliance, and CCPA privacy disclosures.",
    "/privacy-policy",
    breadcrumbs
  );

  return (
    <>
      <JsonLd schema={pageSchema} />
      <div className="py-8 sm:py-12">
        <Container size="md">
          <Breadcrumb items={breadcrumbs} />

          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              User Privacy &amp; Data Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              Effective Date: September 1, 2026 &bull; Last Revised: October 1, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-700 leading-relaxed">
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                1. Overview &amp; Commitment to Privacy
              </h2>
              <p>
                ProTradeCalculators (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;the Service&quot;) operates
                https://protradecalculators.com. We provide deterministic estimating calculators and technical reference
                materials for construction, electrical, plumbing, and mechanical trades. This Privacy Policy details our
                policies regarding the collection, use, disclosure, and protection of personal data and describes your
                privacy rights under applicable laws including the General Data Protection Regulation (GDPR) and the
                California Consumer Privacy Act (CCPA / CPRA).
              </p>
            </section>

            {/* 2. Client-Side Calculation Privacy */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                2. On-Device Calculation Execution
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Zero Server Storage of Calculation Inputs
                </p>
                <p>
                  All numerical inputs, conductor dimensions, circuit lengths, ampacity parameters, and project quantities
                  entered into our calculator forms execute <strong>locally on your client device</strong> (inside your web
                  browser). We do not transmit, log, sell, or retain your proprietary jobsite estimating figures on our
                  servers.
                </p>
              </div>
            </section>

            {/* 3. Advertising & Google AdSense Disclosure */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Cookie className="h-4 w-4 text-amber-600" />
                3. Google AdSense &amp; Third-Party Cookies
              </h2>
              <p>
                To provide free, unhindered access to our professional calculation suite without subscription paywalls,
                we utilize Google AdSense to serve advertisements when you visit our website.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>
                  Third-party vendors, including <strong>Google LLC</strong>, use cookies to serve ads based on your prior
                  visits to this website or other websites across the Internet.
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve targeted ads based on your visit
                  to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting Google&apos;s{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 underline font-medium"
                  >
                    Ads Settings
                  </a>
                  . Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 underline font-medium"
                  >
                    AboutAds.info
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* 4. Analytics & Technical Logs */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                4. Web Analytics &amp; Server Infrastructure Logs
              </h2>
              <p>
                We use privacy-focused website analytics and standard web server logs (via Cloudflare edge infrastructure)
                to monitor system performance, identify broken links, and protect against distributed denial-of-service (DDoS)
                threats. Technical data automatically recorded includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 font-mono">
                <li>Internet Protocol (IP) address (anonymized/truncated)</li>
                <li>Browser user-agent, operating system, and screen resolution</li>
                <li>Timestamp and uniform resource identifier (URI) requested</li>
                <li>Referring URL and network latency metrics</li>
              </ul>
            </section>

            {/* 5. GDPR Compliance */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                5. Rights for European Economic Area (EEA) Residents (GDPR)
              </h2>
              <p>
                If you are a resident of the European Economic Area, you have specific data protection rights under the General
                Data Protection Regulation. These include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li><strong>The right to access:</strong> Request copies of your personal data held by us.</li>
                <li><strong>The right to rectification:</strong> Request correction of inaccurate information.</li>
                <li><strong>The right to erasure:</strong> Request deletion of your personal data under certain conditions.</li>
                <li><strong>The right to object:</strong> Object to processing of personal data for direct marketing or analytics.</li>
              </ul>
            </section>

            {/* 6. CCPA / CPRA Compliance */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                6. Rights for California Residents (CCPA / CPRA)
              </h2>
              <p>
                Under the California Consumer Privacy Act as amended by the California Privacy Rights Act:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>We do not sell personal information as traditionally defined under California law.</li>
                <li>We do not collect sensitive personal information such as social security numbers, health records, or financial account credentials.</li>
                <li>California residents possess the right to know what personal data is collected and the right to request deletion without discrimination.</li>
              </ul>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                7. Privacy Officer Contact
              </h2>
              <p>
                For questions, data access requests, or privacy inquiries regarding this policy, please contact our privacy
                team:
              </p>
              <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
                Email:{" "}
                <span className="text-amber-400 font-bold select-all">
                  privacy@protradecalculators.com
                </span>{" "}
                &bull; Technical Inquiries:{" "}
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
