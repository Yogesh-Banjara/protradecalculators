import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
  title?: string;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const icons = {
    info: <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />,
  };

  const variantStyles = {
    info: "bg-sky-50 text-sky-950 border-sky-200",
    warning: "bg-amber-50 text-amber-950 border-amber-200",
    error: "bg-red-50 text-red-950 border-red-200",
    success: "bg-emerald-50 text-emerald-950 border-emerald-200",
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 rounded-lg border text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="space-y-1">
        {title && <h5 className="font-semibold">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
