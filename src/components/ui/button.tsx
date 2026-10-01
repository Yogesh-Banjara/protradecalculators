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
      "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:bg-amber-600 shadow-2xs border border-amber-600/30",
      secondary:
        "bg-slate-900 text-slate-100 hover:bg-slate-800 active:bg-slate-950 border border-slate-700 shadow-2xs",
      tertiary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 shadow-2xs",
      outline:
        "border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 shadow-2xs",
      ghost:
        "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700",
      utility:
        "bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700 text-xs font-semibold shadow-2xs",
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
