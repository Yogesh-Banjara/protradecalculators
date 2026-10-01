import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "utility";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-amber-400 text-slate-950 font-semibold hover:bg-amber-500 active:bg-amber-600 shadow-xs border border-amber-400",
      secondary:
        "bg-slate-900 text-white font-medium hover:bg-slate-800 active:bg-slate-950 border border-slate-900 shadow-xs",
      tertiary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 shadow-2xs",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium shadow-2xs",
      ghost:
        "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-medium",
      utility:
        "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 text-xs font-semibold shadow-2xs",
    };

    const sizeStyles = {
      sm: "min-h-[36px] sm:min-h-[32px] h-9 sm:h-8 px-3 text-xs gap-1.5 rounded-lg",
      md: "min-h-[44px] sm:min-h-[40px] h-11 sm:h-10 px-4 text-sm gap-2 rounded-xl",
      lg: "min-h-[48px] h-12 px-6 text-base gap-2.5 font-bold rounded-xl",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
