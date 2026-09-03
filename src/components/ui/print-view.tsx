"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "./button";
import { trackPrintClicked } from "@/lib/analytics/events";

export interface PrintButtonProps {
  toolSlug?: string;
  category?: string;
  label?: string;
  className?: string;
}

/**
 * Accessible client button triggering browser print with analytics event tracking.
 */
export function PrintButton({
  toolSlug = "calculator",
  category = "trade",
  label = "Print Worksheet",
  className,
}: PrintButtonProps) {
  const handlePrint = () => {
    trackPrintClicked(toolSlug, category, "worksheet");
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className={className}
      aria-label="Print or export calculation worksheet"
    >
      <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
      {label}
    </Button>
  );
}

export interface JobsitePrintHeaderProps {
  title: string;
  category?: string;
}

/**
 * Print-only header displayed when printing calculation sheets for jobsite records.
 */
export function JobsitePrintHeader({ title, category }: JobsitePrintHeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-slate-950">
      <div className="flex justify-between items-baseline">
        <div>
          <div role="heading" aria-level={2} className="text-2xl font-black uppercase tracking-tight">{title}</div>
          {category && (
            <p className="text-xs uppercase font-bold text-slate-600 tracking-wider">
              {category} Takeoff Worksheet
            </p>
          )}
        </div>
        <div className="text-right text-xs font-mono">
          <p>Date: {currentDate}</p>
          <p>Source: ProTrade Calculators</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-300 text-xs">
        <div>
          <strong>Project / Job Name:</strong> ______________________
        </div>
        <div>
          <strong>Estimator:</strong> ______________________
        </div>
        <div>
          <strong>Approved By:</strong> ______________________
        </div>
      </div>
    </div>
  );
}
