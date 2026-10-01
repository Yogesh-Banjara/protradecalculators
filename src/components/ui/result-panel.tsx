"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { AlertTriangle, Check, Copy, Printer, ChevronDown, ChevronUp, Calculator } from "lucide-react";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
}

export interface ResultPanelProps {
  title: string;
  primaryResult: {
    value: string | number;
    unit: string;
    label?: string;
  };
  secondaryMetrics?: readonly MetricItem[];
  steps?: readonly CalculationStep[];
  warnings?: readonly CalculationWarning[];
  takeawayText?: string;
  className?: string;
}

export function ResultPanel({
  title,
  primaryResult,
  secondaryMetrics,
  steps,
  warnings,
  takeawayText,
  className,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const handleCopy = () => {
    const lines = [
      `=== ${title.toUpperCase()} ===`,
      `${primaryResult.label ?? "Primary Result"}: ${primaryResult.value} ${primaryResult.unit}`,
      ...(secondaryMetrics
        ? secondaryMetrics.map((m) => `${m.label}: ${m.value} ${m.unit ?? ""}`)
        : []),
      takeawayText ? `Takeaway: ${takeawayText}` : "",
      "",
      `Calculated with: ${siteConfig.name}`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm overflow-hidden transition-all",
        className
      )}
    >
      {/* Header Bar */}
      <div className="bg-slate-50/80 px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Calculator className="h-4 w-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
            {title}
          </h4>
        </div>

        {/* Action Controls (Copy & Print) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer no-print"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Result Hero */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="bg-slate-50/60 rounded-xl p-5 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {primaryResult.label ?? "Primary Output"}
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
              {primaryResult.value}
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-600">
              {primaryResult.unit}
            </span>
          </div>
          {takeawayText && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-2 font-medium">
              {takeawayText}
            </p>
          )}
        </div>

        {/* Secondary Parameter Metrics Grid */}
        {secondaryMetrics && secondaryMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {secondaryMetrics.map((metric) => (
              <div
                key={metric.label}
                className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="text-[11px] font-semibold text-slate-500 truncate mb-1">
                  {metric.label}
                </div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 flex items-baseline gap-1">
                  <span>{metric.value}</span>
                  {metric.unit && (
                    <span className="text-xs text-slate-500 font-normal">
                      {metric.unit}
                    </span>
                  )}
                </div>
                {metric.subtext && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {metric.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Calculation Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium border bg-amber-50 border-amber-200 text-amber-900"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold mr-1">{w.code}:</span>
                  <span>{w.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Engineering Steps */}
        {steps && steps.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowSteps(!showSteps)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1 transition-colors cursor-pointer"
            >
              <span>Mathematical Calculation Steps ({steps.length})</span>
              {showSteps ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showSteps && (
              <div className="mt-3 space-y-2 text-xs animate-in fade-in duration-150">
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{s.label}</span>
                      <span className="text-amber-600">{s.result}</span>
                    </div>
                    {s.formula && (
                      <div className="text-[11px] text-slate-500">
                        Formula: {s.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
