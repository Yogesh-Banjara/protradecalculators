import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConduitFillCalculatorForm } from "@/components/tools/conduit-fill-calculator/conduit-form";
import { VoltageDropCalculatorForm } from "@/components/tools/voltage-drop-calculator/voltage-drop-form";
import { ElectricalLoadCalculatorForm } from "@/components/tools/electrical-load-calculator/electrical-load-form";
import { ShieldCheck, ExternalLink } from "lucide-react";

interface EmbedPageProps {
  params: Promise<{
    tool: string;
  }>;
}

export function generateStaticParams() {
  return [
    { tool: "conduit-fill-calculator" },
    { tool: "voltage-drop-calculator" },
    { tool: "residential-load-calculator" },
  ];
}

const EMBED_CONFIG: Record<
  string,
  {
    title: string;
    canonicalPath: string;
    description: string;
  }
> = {
  "conduit-fill-calculator": {
    title: "Electrical Conduit Fill Calculator Widget",
    canonicalPath: "/electrical/conduit-fill-calculator",
    description: "Embeddable NEC Chapter 9 conduit fill and raceway capacity calculator widget.",
  },
  "voltage-drop-calculator": {
    title: "Electrical Voltage Drop Calculator Widget",
    canonicalPath: "/electrical/voltage-drop-calculator",
    description: "Embeddable single-phase and 3-phase wire sizing and voltage drop calculator widget.",
  },
  "residential-load-calculator": {
    title: "Residential Electrical Load Calculator Widget",
    canonicalPath: "/electrical/residential-load-calculator",
    description: "Embeddable NEC Article 220.82 residential service load calculator widget.",
  },
};

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { tool } = await params;
  const config = EMBED_CONFIG[tool];

  if (!config) {
    return { title: "Calculator Widget Not Found" };
  }

  return {
    title: `${config.title} | ProTradeCalculators`,
    description: config.description,
    alternates: {
      canonical: `https://protradecalculators.com${config.canonicalPath}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function EmbedToolPage({ params }: EmbedPageProps) {
  const { tool } = await params;
  const config = EMBED_CONFIG[tool];

  if (!config) {
    notFound();
  }

  return (
    <div className="w-full min-h-[480px] flex flex-col justify-between space-y-4">
      <div className="w-full flex-1">
        {tool === "conduit-fill-calculator" && <ConduitFillCalculatorForm />}
        {tool === "voltage-drop-calculator" && <VoltageDropCalculatorForm />}
        {tool === "residential-load-calculator" && <ElectricalLoadCalculatorForm />}
      </div>

      {/* Subtle, permanent attribution banner for passive backlinks */}
      <div className="pt-3 pb-1 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-white">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Powered by</span>
          <a
            href="https://protradecalculators.com"
            target="_blank"
            rel="noopener"
            className="font-bold text-slate-900 hover:text-amber-600 underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
          >
            ProTrade Calculators
            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-60" />
          </a>
          <span className="text-slate-500 hidden sm:inline">(Free Trade Tools &amp; NEC Solutions)</span>
        </div>

        <div>
          <a
            href={`https://protradecalculators.com${config.canonicalPath}`}
            target="_blank"
            rel="noopener"
            className="text-[11px] text-slate-500 hover:text-amber-600 transition-colors"
          >
            Full Calculator &amp; Code Notes &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
