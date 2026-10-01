"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";

export interface CalculatorShellProps {
  categoryName: string;
  categorySlug: string;
  categoryIcon: React.ReactNode;
  title: string;
  subtitle: string;
  referenceStandard?: string;
  breadcrumbs: readonly { name: string; url: string }[];
  children: React.ReactNode;
  guideContent?: React.ReactNode;
}

export function CalculatorShell({
  categoryName,
  categorySlug: _categorySlug,
  categoryIcon,
  title,
  subtitle,
  referenceStandard,
  breadcrumbs,
  children,
  guideContent,
}: CalculatorShellProps) {
  return (
    <div className="py-8 sm:py-10 pb-24 space-y-10">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* Calculator Header Hero */}
        <header className="my-6 space-y-3 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand" className="gap-1.5 py-1 px-2.5 text-xs">
              {categoryIcon}
              <span>{categoryName}</span>
            </Badge>
            {referenceStandard && (
              <Badge variant="outline" className="text-xs font-mono font-medium text-slate-600 bg-white">
                {referenceStandard}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Primary Interactive Form & Results Workspace */}
        <div className="my-8">
          {children}
        </div>

        {/* Optional Technical Guide Content */}
        {guideContent && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            {guideContent}
          </div>
        )}
      </Container>
    </div>
  );
}
