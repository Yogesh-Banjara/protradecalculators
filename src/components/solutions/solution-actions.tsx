"use client";

import React, { useState } from "react";
import { Copy, Check, Printer } from "lucide-react";

export interface SolutionActionsProps {
  title: string;
  necReference: string;
  formula: string;
  answer: string;
  slug: string;
}

export function SolutionActions({
  title,
  necReference,
  formula,
  answer,
  slug,
}: SolutionActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const summaryText = [
      `Problem: ${title}`,
      `NEC Reference: ${necReference}`,
      `Governing Formula: ${formula}`,
      `Calculated Solution: ${answer}`,
      `Source: https://protradecalculators.com/solutions/${slug}`,
    ].join("\n");

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(summaryText);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = summaryText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy solution summary:", err);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1 pb-1 no-print">
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border shadow-xs cursor-pointer ${
          copied
            ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/40"
            : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 hover:text-slate-950 hover:border-slate-400"
        }`}
        aria-label="Copy solution summary to clipboard"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-600" />
            <span>Copy Solution Summary</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 hover:text-slate-950 hover:border-slate-400 transition-all shadow-xs cursor-pointer"
        aria-label="Print or save solution worksheet as PDF"
      >
        <Printer className="h-4 w-4 text-slate-600" />
        <span>Print / Save PDF</span>
      </button>
    </div>
  );
}
