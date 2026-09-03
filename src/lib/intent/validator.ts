/**
 * Intent Page Anti-Thin-Content Validator
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Enforces Google Helpful Content & Quality Evaluator standards
 * on any future programmatic or curated search-intent landing page.
 */

import type { IntentPageDefinition, IntentValidationResult } from "@/types/intent";

export const MIN_TECHNICAL_GUIDANCE_WORDS = 150;
export const MIN_TAKEOFF_SUMMARY_ITEMS = 2;

/**
 * Validates an intent landing page definition against strict quality & indexation gates.
 */
export function validateIntentPageDefinition(
  def: IntentPageDefinition
): IntentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Path & Identifier
  if (!def.id || def.id.trim().length === 0) {
    errors.push("Missing required unique identifier 'id'");
  }
  if (!def.path || !def.path.startsWith("/")) {
    errors.push("Path must start with '/'");
  }
  if (!def.categorySlug || !def.baseToolSlug) {
    errors.push("Missing categorySlug or baseToolSlug reference");
  }

  // 2. SEO Metadata & Title Quality
  if (!def.title || def.title.length < 25) {
    errors.push("Title is too short (<25 chars)");
  } else if (def.title.length > 70) {
    warnings.push(`Title length ${def.title.length} exceeds 70 chars (may truncate on SERP)`);
  }

  if (!def.metaDescription || def.metaDescription.length < 80) {
    errors.push("Meta description is too short (<80 chars)");
  } else if (def.metaDescription.length > 175) {
    warnings.push(`Meta description length ${def.metaDescription.length} exceeds 175 chars`);
  }

  if (!def.h1 || def.h1.trim().length === 0) {
    errors.push("Missing primary H1");
  }

  // 3. Search Intent Defense
  if (!def.primaryQuery || def.primaryQuery.trim().length === 0) {
    errors.push("Missing primaryQuery search intent target");
  }

  // 4. Calculator Prefill Integrity
  if (!def.prefilledInputs || Object.keys(def.prefilledInputs).length < 2) {
    errors.push("Intent page must specify at least 2 non-trivial prefilled calculator parameters");
  }

  // 5. Pre-Rendered Takeoff Summary
  if (!def.staticTakeoffSummary || def.staticTakeoffSummary.length < MIN_TAKEOFF_SUMMARY_ITEMS) {
    errors.push(`Static takeoff summary must have at least ${MIN_TAKEOFF_SUMMARY_ITEMS} items`);
  }

  // 6. Anti-Thin-Content Guidance Gate
  const wordCount = def.technicalGuidance
    ? def.technicalGuidance.trim().split(/\s+/).filter(Boolean).length
    : 0;

  if (wordCount < MIN_TECHNICAL_GUIDANCE_WORDS) {
    errors.push(
      `Technical guidance is too thin (${wordCount} words). Minimum ${MIN_TECHNICAL_GUIDANCE_WORDS} words required.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
