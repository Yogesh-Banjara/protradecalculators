import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: readonly SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, options, disabled, ...props }, ref) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        className={cn(
          "flex h-11 sm:h-10 w-full rounded-xl border bg-white px-3.5 py-2 text-sm font-medium text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/15 focus-visible:border-amber-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 shadow-2xs transition-all",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-slate-200 hover:border-slate-300",
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "Select";
