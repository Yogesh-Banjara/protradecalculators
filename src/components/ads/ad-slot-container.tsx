"use client";

import React from "react";
import { ADS_CONFIG, type AdSlotDefinition } from "@/config/ads";

export interface AdSlotContainerProps {
  readonly slotKey: "below_calculator" | "in_article_reference" | "sidebar_takeoff";
  readonly className?: string;
}

/**
 * Reusable layout container reserving predictable aspect-ratio and min-height space.
 * When ads are disabled (current state), renders an inert, invisible spacer to guarantee 0 CLS.
 * Zero fake ad graphics or simulated advertising is rendered.
 */
export function AdSlotContainer({ slotKey, className = "" }: AdSlotContainerProps) {
  const slotDef: AdSlotDefinition | undefined = ADS_CONFIG.slots[slotKey];

  if (!ADS_CONFIG.enabled || !slotDef) {
    // When monetization is inactive, render an empty zero-overhead placeholder
    return <div data-ad-slot={slotKey} className="hidden" aria-hidden="true" />;
  }

  // Future active state: Reserved layout container with fixed minimum bounds
  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={slotDef.id}
      className={`ad-slot-container my-6 mx-auto flex items-center justify-center overflow-hidden border border-slate-200/50 bg-slate-50/50 rounded-lg ${className}`}
      style={{
        minHeight: `${slotDef.minHeightPx}px`,
        maxWidth: `${slotDef.desktopDimensions.width}px`,
      }}
    >
      {/* Future Ad Unit Tag will be injected here upon approval */}
    </aside>
  );
}
