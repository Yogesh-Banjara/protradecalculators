"use client";

import React from "react";
import { PackageCheck } from "lucide-react";

export interface TakeoffItem {
  name: string;
  quantity: string | number;
  unit: string;
  notes?: string;
  badge?: string;
}

export interface TakeoffTableProps {
  title?: string;
  items: readonly TakeoffItem[];
  wasteIncludedPercent?: number;
  className?: string;
}

export function TakeoffTable({
  title = "Itemized Jobsite Materials Takeoff",
  items,
  wasteIncludedPercent,
  className = "",
}: TakeoffTableProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs ${className}`}>
      {/* Header */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <PackageCheck className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>

        {wasteIncludedPercent !== undefined && (
          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
            Includes {wasteIncludedPercent}% safety waste
          </span>
        )}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100 overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] uppercase font-bold text-slate-400">
              <th className="py-2.5 px-4">Material / Item</th>
              <th className="py-2.5 px-4 text-right">Quantity</th>
              <th className="py-2.5 px-4 text-left">Unit</th>
              <th className="py-2.5 px-4 text-left hidden sm:table-cell">Jobsite Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200/60 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-black font-mono text-slate-900 text-base">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-slate-600 font-semibold">
                  {item.unit}
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs hidden sm:table-cell">
                  {item.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
