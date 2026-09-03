import React from "react";
import Link from "next/link";
import { TOOL_CATEGORIES } from "@/lib/tools/registry";
import { HardHat, Layers, Zap, Wind, Droplets } from "lucide-react";

const categoryIconMap: Record<string, React.ReactNode> = {
  construction: <HardHat className="h-4 w-4" />,
  materials: <Layers className="h-4 w-4" />,
  electrical: <Zap className="h-4 w-4" />,
  hvac: <Wind className="h-4 w-4" />,
  plumbing: <Droplets className="h-4 w-4" />,
};

export interface CategoryNavProps {
  currentCategorySlug?: string;
}

export function CategoryNav({ currentCategorySlug }: CategoryNavProps) {
  const activeCategories = TOOL_CATEGORIES.filter((c) => c.status === "active");

  return (
    <nav
      aria-label="Trade Categories Navigation"
      className="flex flex-wrap gap-2 py-4 border-b border-slate-200"
    >
      {activeCategories.map((category) => {
        const isActive = category.slug === currentCategorySlug;
        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isActive
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className={isActive ? "text-amber-400" : "text-slate-500"}>
              {categoryIconMap[category.slug] ?? <HardHat className="h-4 w-4" />}
            </span>
            <span>{category.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
