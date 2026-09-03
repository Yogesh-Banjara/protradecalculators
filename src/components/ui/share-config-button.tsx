"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { buildShareUrl } from "@/lib/share/state-serializer";
import { trackShareLinkClicked } from "@/lib/analytics/events";
import { siteConfig } from "@/config/site";

export interface ShareConfigButtonProps {
  readonly toolSlug: string;
  readonly categorySlug?: string;
  readonly state: Record<string, string | number | boolean>;
  readonly label?: string;
  readonly className?: string;
}

export function ShareConfigButton({
  toolSlug,
  categorySlug = "tools",
  state,
  label = "Share",
  className = "",
}: ShareConfigButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = async () => {
    try {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/${toolSlug}`;
      const relativeShareUrl = buildShareUrl(currentPath, toolSlug, state);
      const fullUrl = `${siteConfig.url}${relativeShareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }

      trackShareLinkClicked(toolSlug, categorySlug);
    } catch {
      // Graceful fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${toolSlug} configuration link`}
      title="Copy shareable link with current configuration"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-amber-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
