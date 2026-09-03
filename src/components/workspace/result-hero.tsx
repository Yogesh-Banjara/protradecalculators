"use client";

import React, { useState } from "react";
import { Copy, Check, Printer, ChevronDown, ChevronUp, Calculator, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";

export interface MetricTile {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
}

export interface ResultHeroProps {
  title: string;
  primaryValue: string | number;
  primaryUnit: string;
  primaryLabel?: string;
  decisionTakeaway?: string;
  secondaryMetrics?: readonly MetricTile[];
  warnings?: readonly CalculationWarning[];
  steps?: readonly CalculationStep[];
  className?: string;
}

export function ResultHero({
  title,
  primaryValue,
  primaryUnit,
  primaryLabel = "Primary Answer",
  decisionTakeaway,
  secondaryMetrics,
  warnings,
  steps,
  className = "",
}: ResultHeroProps) {
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const handleCopy = () => {
    const lines = [
      `=== ${title.toUpperCase()} ===`,
      `${primaryLabel}: ${primaryValue} ${primaryUnit}`,
      ...(decisionTakeaway ? [`Jobsite Takeaway: ${decisionTakeaway}`] : []),
      ...(secondaryMetrics
        ? secondaryMetrics.map((m) => `${m.label}: ${m.value} ${m.unit ?? ""}`)
        : []),
      "",
      `Calculated with: ${siteConfig.name}`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`rounded-2xl border-2 border-amber-500/40 bg-slate-950 text-slate-100 shadow-xl overflow-hidden transition-all ${className}`}
    >
      {/* Header Bar */}
      <div className="bg-slate-900/95 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calculator className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            {title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied Takeoff!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Worksheet</span>
          </button>
        </div>
      </div>

      {/* Primary Hero Metric Callout */}
      <div className="p-6 sm:p-7 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 space-y-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
            {primaryLabel}:
          </span>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-5xl sm:text-6xl font-black text-amber-400 tracking-tight font-mono">
              {primaryValue}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-200">
              {primaryUnit}
            </span>
          </div>
        </div>

        {/* Practical Jobsite Decision Takeaway */}
        {decisionTakeaway && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
            <div className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ℹ
            </div>
            <div className="leading-relaxed">
              <strong className="text-amber-300 font-semibold">Jobsite Takeaway: </strong>
              {decisionTakeaway}
            </div>
          </div>
        )}

        {/* Secondary Metrics Grid */}
        {secondaryMetrics && secondaryMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            {secondaryMetrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <span className="text-[11px] text-slate-400 block truncate">{m.label}</span>
                <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5 truncate">
                  {m.value}{" "}
                  {m.unit && (
                    <span className="text-xs font-sans text-slate-400 font-normal">
                      {m.unit}
                    </span>
                  )}
                </div>
                {m.subtext && (
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {m.subtext}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warnings & Advisories */}
      {warnings && warnings.length > 0 && (
        <div className="bg-amber-950/40 border-t border-amber-900/50 p-4 space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-amber-200 leading-relaxed">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progressive Disclosure: Step Breakdown */}
      {steps && steps.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            className="w-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Formula Methodology &amp; Mathematical Steps ({steps.length})</span>
            {showSteps ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {showSteps && (
            <div className="p-6 pt-0 space-y-2 border-t border-slate-900 animate-in fade-in duration-150">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <div className="text-slate-300">
                    <span className="text-amber-500 font-bold mr-2">{idx + 1}.</span>
                    <span className="font-sans font-medium text-slate-200">{step.label}:</span>{" "}
                    <span className="text-slate-400">{step.values}</span>
                  </div>
                  <div className="text-amber-400 font-bold sm:text-right">
                    = {step.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
