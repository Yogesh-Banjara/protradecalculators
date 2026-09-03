/**
 * Central Canonical Route & Indexation Registry
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Single source of truth for all indexable canonical URLs.
 * Strictly guarantees that dynamic share parameters, query strings,
 * or unapproved drafts never enter the XML sitemap.
 */

import { TOOL_CATEGORIES, REGISTERED_TOOLS } from "@/lib/tools/registry";
import { getPublishedIntentPages } from "@/lib/intent/registry";

export interface CanonicalRouteEntry {
  readonly path: string;
  readonly changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  readonly priority: number;
  readonly type: "core" | "category" | "tool" | "guide" | "intent";
}

/**
 * Core static site routes.
 */
export const CORE_STATIC_ROUTES: readonly CanonicalRouteEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0, type: "core" },
  { path: "/tools", changeFrequency: "daily", priority: 0.9, type: "core" },
  { path: "/about", changeFrequency: "monthly", priority: 0.7, type: "core" },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5, type: "core" },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, type: "core" },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, type: "core" },
  { path: "/guides/subpanel-feeder-sizing", changeFrequency: "monthly", priority: 0.8, type: "guide" },
];

/**
 * Generates all canonical category hub routes.
 */
export function getCategoryRoutes(): readonly CanonicalRouteEntry[] {
  return TOOL_CATEGORIES.filter((c) => c.status === "active").map((c) => ({
    path: `/categories/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    type: "category" as const,
  }));
}

/**
 * Generates all canonical tool routes from registry.
 */
export function getActiveToolRoutes(): readonly CanonicalRouteEntry[] {
  return REGISTERED_TOOLS.filter((t) => t.status === "active").map((t) => ({
    path: `/${t.categoryId}/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    type: "tool" as const,
  }));
}

/**
 * Generates all approved, published search-intent landing page routes.
 */
export function getActiveIntentRoutes(): readonly CanonicalRouteEntry[] {
  return getPublishedIntentPages().map((page) => ({
    path: page.path,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    type: "intent" as const,
  }));
}

/**
 * Returns the complete array of all approved canonical route entries.
 */
export function getAllCanonicalRoutes(): readonly CanonicalRouteEntry[] {
  return [
    ...CORE_STATIC_ROUTES,
    ...getCategoryRoutes(),
    ...getActiveToolRoutes(),
    ...getActiveIntentRoutes(),
  ];
}

/**
 * Validates whether a given path is an approved canonical route.
 */
export function isCanonicalRoute(path: string): boolean {
  // Normalize path (strip query params and trailing slash)
  const cleanPath = path.split("?")[0].replace(/\/$/, "");
  const all = getAllCanonicalRoutes();
  return all.some((r) => r.path === cleanPath || (r.path === "" && cleanPath === ""));
}

/**
 * Returns the exact count of approved indexable routes (currently exactly 27).
 */
export function getIndexableRouteCount(): number {
  return getAllCanonicalRoutes().length;
}
