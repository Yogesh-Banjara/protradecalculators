import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Electrical & Trade Technical Master Guides",
  description:
    "Comprehensive technical guides for electricians and estimators: NEC conduit fill tables, voltage drop derivations, and subpanel feeder sizing.",
  path: "/guides",
  keywords: [
    "electrical trade guides",
    "nec calculation guides",
    "conduit fill master guide",
    "voltage drop formulas guide",
    "subpanel feeder sizing guide",
  ],
});

interface GuideEntry {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  codeReference: string;
  description: string;
  keyTopics: string[];
}

const GUIDES_LIST: GuideEntry[] = [
  {
    slug: "nec-conduit-fill-rules-and-tables",
    title: "The Complete NEC Conduit Fill Guide: Chapter 9 Tables, Jam Ratios & Sizing",
    category: "Electrical & Raceway",
    readTime: "8 min read",
    codeReference: "NEC Chapter 9 Tables 1, 4, 5",
    description:
      "Master NEC raceway sizing: learn Chapter 9 Table 1 percentage limits (53%, 31%, 40%), Table 4 dimensions, Table 5 conductor areas, and how to avoid the 3-wire jam ratio.",
    keyTopics: ["40% Fill Limit", "Jam Ratio (2.8 to 3.2)", "24-inch Nipple Exception", "Mixed Gauge Takeoff"],
  },
  {
    slug: "electricians-guide-to-voltage-drop-calculations",
    title: "The Electrician's Guide to Voltage Drop: Formulas, Code Limits & Conductor Sizing",
    category: "Electrical & Feeders",
    readTime: "9 min read",
    codeReference: "NEC 210.19(A) & NEC 215.2",
    description:
      "Understand AC/DC single-phase and 3-phase voltage drop formulas, NEC recommendations (3% branch, 5% total), and circular mil resistance constants.",
    keyTopics: ["Single-Phase Formula", "Three-Phase Formula", "K Resistance Constants", "Distance Upsizing Table"],
  },
  {
    slug: "subpanel-feeder-sizing",
    title: "Subpanel Feeder Conductor Sizing by Distance",
    category: "Electrical & Service Panels",
    readTime: "10 min read",
    codeReference: "NEC 310.16 & NEC 215.2",
    description:
      "Technical electrical guide for sizing subpanel feeder conductors across distance. Learn how continuous load, NEC Table 310.16 ampacity, and 3% voltage drop limits interact.",
    keyTopics: ["100A & 200A Feeders", "Copper vs Aluminum", "75°C Terminal Ratings", "3% Distance Limits"],
  },
];

export default function GuidesHubPage() {
  const breadcrumbs = [{ name: "Technical Guides", url: "/guides" }];
  const pageSchema = buildWebPageSchema(
    "Electrical & Trade Technical Master Guides | ProTradeCalculators",
    "Comprehensive technical guides for electricians and estimators: NEC conduit fill tables, voltage drop derivations, and subpanel feeder sizing.",
    "/guides",
    breadcrumbs
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    ...breadcrumbs,
  ]);

  return (
    <>
      <JsonLd schema={[pageSchema, breadcrumbSchema]} />
      <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />

          {/* Header */}
          <div className="space-y-4 mb-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
              <BookOpen className="h-3.5 w-3.5 text-amber-600" />
              Contractor &amp; Engineering Field Manuals
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Trade Technical Master Guides
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              In-depth engineering references and code-compliance manuals designed for master electricians,
              field estimators, and project managers. Each guide pairs real-world trade physics with interactive
              calculation tools and NEC citations.
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {GUIDES_LIST.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                      {guide.codeReference}
                    </span>
                    <span className="text-slate-400 font-mono text-xs">{guide.readTime}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {guide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>

                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {guide.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 font-medium border border-slate-200/80"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs font-semibold text-amber-700 group-hover:text-amber-800 pt-4 mt-4 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                  Read Technical Guide <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Cross-Link to Solutions & Methodology */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/solutions"
              className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 hover:border-amber-400 transition-colors group flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Worked Problem Library
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300">
                  20 Real-World NEC Worked Solutions &rarr;
                </h3>
                <p className="text-xs text-slate-400">
                  Explore step-by-step derivations for motors, ranges, dryers, and feeders.
                </p>
              </div>
            </Link>

            <Link
              href="/methodology"
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors group flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Engineering Standards
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600">
                  Calculation Methodology &amp; Compliance &rarr;
                </h3>
                <p className="text-xs text-slate-500">
                  Review IEEE 141 constants, rounding safety margins, and verification suites.
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
