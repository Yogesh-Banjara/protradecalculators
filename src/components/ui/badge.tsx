import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "success" | "neutral" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    brand: "bg-amber-50 text-amber-800 border-amber-200/80 font-medium",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium",
    neutral: "bg-slate-900 text-slate-100 border-slate-800 font-medium",
    outline: "border-slate-200 text-slate-600 bg-white font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
