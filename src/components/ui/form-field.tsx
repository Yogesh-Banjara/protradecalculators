import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  warning?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  helperText,
  error,
  warning,
  children,
  className,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-800 flex items-center gap-1"
        >
          {label}
          {required && (
            <span className="text-amber-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1"
        >
          {error}
        </p>
      ) : warning ? (
        <p
          className="text-xs font-medium text-amber-700 flex items-center gap-1 mt-1"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {warning}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
