/**
 * Curated Search-Intent Page Registry
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Central registry for validated high-value search intent landing pages.
 * Currently contains ZERO generated pages to preserve exact 27-route release state.
 */

import type { IntentPageDefinition } from "@/types/intent";
import { validateIntentPageDefinition } from "./validator";

export const INTENT_PAGE_REGISTRY: readonly IntentPageDefinition[] = [];

/**
 * Returns only validated and published intent pages for sitemap inclusion.
 */
export function getPublishedIntentPages(): readonly IntentPageDefinition[] {
  return INTENT_PAGE_REGISTRY.filter((page) => {
    if (page.status !== "published") return false;
    const validation = validateIntentPageDefinition(page);
    return validation.isValid;
  });
}

/**
 * Finds a registered intent page by path.
 */
export function getIntentPageByPath(path: string): IntentPageDefinition | undefined {
  return INTENT_PAGE_REGISTRY.find((page) => page.path === path);
}
