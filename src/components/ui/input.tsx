import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, prefixAddon, suffixAddon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-stretch w-full rounded-md shadow-sm">
        {prefixAddon && (
          <div className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-md select-none">
            {prefixAddon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          className={cn(
            "flex min-h-[44px] sm:min-h-[40px] h-11 sm:h-10 w-full rounded-xl border bg-white px-3.5 py-2.5 text-base sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all shadow-xs",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300",
            prefixAddon ? "rounded-l-none" : undefined,
            suffixAddon ? "rounded-r-none" : undefined,
            className
          )}
          {...props}
        />
        {suffixAddon && (
          <div className="inline-flex items-center px-3 text-sm font-medium text-slate-600 bg-slate-100 border border-l-0 border-slate-300 rounded-r-md select-none">
            {suffixAddon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
