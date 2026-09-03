"use client";

import React from "react";
import type { UnitSystem } from "@/types/units";

export interface UnitSystemToggleProps {
  system: UnitSystem;
  onChange: (system: UnitSystem) => void;
  className?: string;
}

export function UnitSystemToggle({
  system,
  onChange,
  className = "",
}: UnitSystemToggleProps) {
  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Unit System Selection"
    >
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          system === "imperial"
            ? "bg-slate-900 text-white font-bold shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        Imperial (ft, in, yd³)
      </button>
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          system === "metric"
            ? "bg-slate-900 text-white font-bold shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        Metric (m, cm, m³)
      </button>
    </div>
  );
}
