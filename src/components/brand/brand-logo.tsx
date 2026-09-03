import React from "react";
import { cn } from "@/lib/utils";

export interface BrandMarkProps {
  size?: number | string;
  className?: string;
  variant?: "brand" | "monochrome-dark" | "monochrome-light";
}

/**
 * Precision Brand Mark:
 * Geometric combination square & structural dimensional gauge.
 * High-legibility trade calculation symbol scalable from 16px to 64px+.
 */
export function BrandMark({
  size = 32,
  className,
  variant = "brand",
}: BrandMarkProps) {
  const primaryColor =
    variant === "monochrome-light"
      ? "#ffffff"
      : variant === "monochrome-dark"
      ? "#0f172a"
      : "#f59e0b"; // brand amber-500

  const secondaryColor =
    variant === "monochrome-light"
      ? "#94a3b8"
      : variant === "monochrome-dark"
      ? "#334155"
      : "#0f172a"; // slate-900

  const accentColor =
    variant === "monochrome-light"
      ? "#cbd5e1"
      : variant === "monochrome-dark"
      ? "#64748b"
      : "#fbbf24"; // amber-400

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-hidden="true"
    >
      {/* Precision Square Base Plate */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="7"
        fill={primaryColor}
      />

      {/* Structural Steel I-Core & Drafting Gauge Inset */}
      <path
        d="M8 8H24V13H18.5V19H24V24H8V19H13.5V13H8V8Z"
        fill={secondaryColor}
      />

      {/* Center Precision Caliper Tick / Alignment Crosshair */}
      <circle cx="16" cy="16" r="2" fill={accentColor} />
      <rect x="7" y="10" width="3" height="1.5" rx="0.5" fill={accentColor} />
      <rect x="7" y="14" width="2" height="1.5" rx="0.5" fill={accentColor} />
      <rect x="7" y="18" width="3" height="1.5" rx="0.5" fill={accentColor} />
      <rect x="7" y="22" width="2" height="1.5" rx="0.5" fill={accentColor} />
    </svg>
  );
}

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "monochrome-dark" | "monochrome-light";
  showSubtitle?: boolean;
}

export function BrandLogo({
  className,
  size = "md",
  variant = "brand",
  showSubtitle = true,
}: BrandLogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const subtitleColor =
    variant === "monochrome-light"
      ? "text-slate-400"
      : "text-amber-700";

  const titleColor =
    variant === "monochrome-light"
      ? "text-white"
      : "text-slate-900";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none shrink-0", className)}>
      <BrandMark size={iconSizes[size]} variant={variant} />
      <div className="flex flex-col shrink-0 text-left">
        {showSubtitle && (
          <span
            className={cn(
              "leading-none font-bold uppercase tracking-wider text-[10px]",
              subtitleColor
            )}
          >
            Trade Platform
          </span>
        )}
        <span
          className={cn(
            "leading-tight font-black tracking-tight whitespace-nowrap",
            titleColor,
            titleSizes[size]
          )}
        >
          ProTrade Calculators
        </span>
      </div>
    </div>
  );
}
