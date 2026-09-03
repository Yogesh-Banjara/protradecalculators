import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ArrowRight, Wrench } from "lucide-react";
import type { ToolDefinition } from "@/types/tools";

export interface RelatedToolsProps {
  tools: readonly ToolDefinition[];
  title?: string;
}

export function RelatedTools({
  tools,
  title = "Related Trade Calculators",
}: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="space-y-4 pt-8 border-t border-slate-200" aria-label={title}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-600" />
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.path ?? `/${tool.categoryId}/${tool.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            <Card className="h-full transition-all group-hover:border-amber-400 group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base group-hover:text-amber-700 flex items-center justify-between">
                  <span>{tool.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
