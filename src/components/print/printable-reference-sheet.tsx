"use client";

import React from "react";
import { Printer } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackPrintRequested } from "@/lib/analytics/events";

export interface ReferenceSheetItem {
  readonly label: string;
  readonly value: string | number;
  readonly unit?: string;
  readonly specOrNote?: string;
}

export interface PrintableReferenceSheetProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly tradeCategory: string;
  readonly toolSlug: string;
  readonly codeReference?: string;
  readonly items: readonly ReferenceSheetItem[];
  readonly notes?: readonly string[];
  readonly className?: string;
}

export function PrintableReferenceSheet({
  title,
  subtitle,
  tradeCategory,
  toolSlug,
  codeReference,
  items,
  notes,
  className = "",
}: PrintableReferenceSheetProps) {
  const handlePrint = () => {
    trackPrintRequested(toolSlug, tradeCategory, "reference_sheet");
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`printable-sheet-container bg-white text-slate-900 rounded-xl border border-slate-200 p-6 shadow-sm print:shadow-none print:border-none print:p-0 ${className}`}>
      {/* Header Bar */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
            {tradeCategory} Field Reference Sheet
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="text-right text-xs font-mono space-y-0.5">
          <p className="font-bold text-slate-900">{siteConfig.name}</p>
          <p className="text-slate-600">Date: {currentDate}</p>
          {codeReference && (
            <p className="text-amber-800 font-semibold">{codeReference}</p>
          )}
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print this reference worksheet"
            className="print:hidden inline-flex items-center gap-1 mt-2 px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer"
          >
            <Printer className="h-3 w-3" />
            Print Sheet
          </button>
        </div>
      </div>

      {/* Field Metadata Form for Jobsite Use */}
      <div className="grid grid-cols-3 gap-3 p-2.5 mb-5 bg-slate-50 border border-slate-200 rounded text-xs font-mono print:bg-white print:border-slate-400">
        <div>
          <span className="text-slate-500 block text-[10px]">PROJECT / JOBSITE</span>
          <span className="font-medium text-slate-800">____________________</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">LEAD TRADESPERSON</span>
          <span className="font-medium text-slate-800">____________________</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">AHJ / PERMIT #</span>
          <span className="font-medium text-slate-800">____________________</span>
        </div>
      </div>

      {/* Items & Schedule Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs text-slate-800 border-collapse">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100 print:bg-slate-200 text-slate-900 font-mono font-bold">
              <th className="p-2">Item / Specification</th>
              <th className="p-2 text-right">Quantity / Value</th>
              <th className="p-2">Units</th>
              <th className="p-2">Engineering / Layout Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 print:hover:bg-transparent">
                <td className="p-2 font-bold text-slate-900 font-sans">{item.label}</td>
                <td className="p-2 text-right font-bold text-amber-900">{item.value}</td>
                <td className="p-2 text-slate-600">{item.unit || "—"}</td>
                <td className="p-2 text-slate-600 text-[11px] font-sans">{item.specOrNote || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes & Standards Disclaimer */}
      {notes && notes.length > 0 && (
        <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1 font-sans">
          <span className="font-bold text-slate-900 block text-[11px] font-mono uppercase tracking-wider">
            Jobsite Notes &amp; Verification Guidance:
          </span>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            {notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
