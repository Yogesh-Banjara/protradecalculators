"use client";

import React, { useState, useEffect } from "react";
import { Code, Copy, Check, X, ExternalLink, ShieldCheck } from "lucide-react";

export interface EmbedModalProps {
  toolSlug: string;
  toolName: string;
  buttonLabel?: string;
  variant?: "default" | "compact" | "outline";
  className?: string;
}

export function EmbedModal({
  toolSlug,
  toolName,
  buttonLabel = "Embed on Your Website",
  variant = "default",
  className = "",
}: EmbedModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedSnippet = `<iframe src="https://protradecalculators.com/embed/${toolSlug}" width="100%" height="600" style="border:1px solid #e2e8f0;border-radius:8px;" title="${toolName} - ProTradeCalculators"></iframe><p style="font-size:12px;color:#64748b;text-align:right;">Calculator provided by <a href="https://protradecalculators.com" target="_blank" rel="noopener">ProTradeCalculators.com</a></p>`;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(embedSnippet);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = embedSnippet;
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
      console.error("Failed to copy embed snippet:", err);
    }
  };

  const getButtonClasses = () => {
    if (variant === "compact") {
      return "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer";
    }
    if (variant === "outline") {
      return "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer";
    }
    return "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300 transition-all cursor-pointer shadow-xs";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${getButtonClasses()} ${className}`}
        aria-label={`Open embed snippet modal for ${toolName}`}
      >
        <Code className="h-3.5 w-3.5 text-amber-500" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="embed-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[11px] font-semibold">
                  <Code className="h-3 w-3 text-amber-600" />
                  Embeddable Trade Widget
                </div>
                <h2 id="embed-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
                  Embed {toolName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Add this fully functional calculation tool directly to your website or blog.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close embed modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Permission statement */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Usage Permission:</strong> Free to embed on educational, trade, school, and contractor websites.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>HTML Embed Code</span>
                  <a
                    href={`/embed/${toolSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:underline"
                  >
                    Preview Widget <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={embedSnippet}
                    rows={4}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 selection:bg-amber-500 selection:text-slate-950 resize-none"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500 text-center sm:text-left">
                  Paste this snippet into any HTML page, WordPress block, or CMS.
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                    copied
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied Embed Code!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Embed Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
