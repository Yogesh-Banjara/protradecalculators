"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";

export interface WorkspaceShellProps {
  categoryName: string;
  categorySlug: string;
  categoryIcon: React.ReactNode;
  standardReference?: string;
  title: string;
  subtitle: string;
  breadcrumbs: readonly { name: string; url: string }[];
  inputContent: React.ReactNode;
  visualContent: React.ReactNode;
  resultContent: React.ReactNode;
  takeoffContent?: React.ReactNode;
  methodologyContent?: React.ReactNode;
  guideContent?: React.ReactNode;
}

export function WorkspaceShell({
  categoryName,
  categorySlug: _categorySlug,
  categoryIcon,
  standardReference,
  title,
  subtitle,
  breadcrumbs,
  inputContent,
  visualContent,
  resultContent,
  takeoffContent,
  methodologyContent,
  guideContent,
}: WorkspaceShellProps) {
  return (
    <div className="py-8 sm:py-10 pb-28 space-y-10">
      <Container>
        {/* Navigation Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} />

        {/* Task-First Header */}
        <header className="my-6 space-y-3 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand" className="gap-1.5 py-1 px-3">
              {categoryIcon}
              <span>{categoryName}</span>
            </Badge>
            {standardReference && (
              <Badge
                variant="outline"
                className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border-slate-300"
              >
                {standardReference}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        </header>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
          {/* Left Column: Job & Parameters Inputs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-6">
              {inputContent}
            </div>

            {/* Optional Takeoff / BOM Table on Left or below */}
            {takeoffContent && (
              <div className="pt-2">
                {takeoffContent}
              </div>
            )}
          </div>

          {/* Right Column: Live Schematic Visualizer + Decision HUD (Sticky on Desktop) */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-20">
            {/* Live Interactive Blueprint */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
              {visualContent}
            </div>

            {/* Decision-First Result HUD */}
            <div>
              {resultContent}
            </div>

            {/* Methodology & Derivation Steps */}
            {methodologyContent && (
              <div>
                {methodologyContent}
              </div>
            )}
          </div>
        </div>

        {/* Supporting Guide & Reference Material */}
        {guideContent && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            {guideContent}
          </div>
        )}
      </Container>
    </div>
  );
}
