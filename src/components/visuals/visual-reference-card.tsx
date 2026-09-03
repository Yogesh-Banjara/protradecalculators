"use client";

import React, { useEffect } from "react";
import type { VisualAssetMetadata } from "@/types/visuals";
import { trackReferenceAssetViewed } from "@/lib/analytics/events";
import { Layers, ShieldCheck } from "lucide-react";

export interface VisualReferenceCardProps {
  readonly metadata: VisualAssetMetadata;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly footerNotes?: string;
}

export function VisualReferenceCard({
  metadata,
  children,
  className = "",
  footerNotes,
}: VisualReferenceCardProps) {
  useEffect(() => {
    trackReferenceAssetViewed(metadata.id, "blueprint", metadata.tradeCategory);
  }, [metadata.id, metadata.tradeCategory]);

  return (
    <div className={`visual-reference-card glass-canvas rounded-2xl p-5 shadow-2xl text-white space-y-4 ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400">
              {metadata.title}
            </h3>
            {metadata.subtitle && (
              <p className="text-xs text-slate-400 font-mono">{metadata.subtitle}</p>
            )}
          </div>
        </div>

        {metadata.codeCitation && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{metadata.codeCitation}</span>
          </div>
        )}
      </div>

      {/* Visual Canvas Container */}
      <div className="relative w-full aspect-[16/10] max-h-[360px] bg-slate-950/95 rounded-xl border border-slate-800 flex items-center justify-center p-3 overflow-hidden bg-blueprint-grid">
        {children}
      </div>

      {/* Key Takeaways & Annotations */}
      {metadata.keyTakeaways && metadata.keyTakeaways.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-mono">
          {metadata.keyTakeaways.map((takeaway, idx) => (
            <div key={idx} className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
              <span className="text-xs text-slate-300">{takeaway}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer Notes */}
      {footerNotes && (
        <p className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          {footerNotes}
        </p>
      )}
    </div>
  );
}
