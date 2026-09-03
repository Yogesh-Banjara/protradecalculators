/**
 * Search Intent Page Architecture Type Definitions
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Defines the contract for legitimate, high-value, curated intent landing pages.
 * Enforces strict anti-thin-content validation rules.
 */

export interface IntentPagePrefilledInput {
  readonly [paramKey: string]: string | number | boolean;
}

export interface IntentCodeCitation {
  readonly codeBody: "NEC" | "IRC" | "IPC" | "UPC" | "ASTM" | "Manual_J";
  readonly section: string;
  readonly summary: string;
}

export interface IntentTakeoffSummaryItem {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly note?: string;
}

export interface IntentPageDefinition {
  /** Unique semantic identifier, e.g. "concrete-24x24-slab-garage" */
  readonly id: string;
  /** URL path segment under category, e.g. "/construction/24x24-slab-concrete-calculator" */
  readonly path: string;
  /** Primary category slug, e.g. "construction" */
  readonly categorySlug: string;
  /** Underlying calculation engine tool slug, e.g. "concrete-calculator" */
  readonly baseToolSlug: string;
  /** Primary search intent target query from Keyword Planner */
  readonly primaryQuery: string;
  /** Secondary high-intent search queries */
  readonly secondaryQueries?: readonly string[];
  /** Page SEO Title */
  readonly title: string;
  /** Page SEO Meta Description */
  readonly metaDescription: string;
  /** Page Primary H1 */
  readonly h1: string;
  /** Introduction / Scenario Description */
  readonly scenarioDescription: string;
  /** Prefilled inputs to initialize the calculator instrument */
  readonly prefilledInputs: IntentPagePrefilledInput;
  /** Pre-calculated static takeoff takeaways for fast above-the-fold utility */
  readonly staticTakeoffSummary: readonly IntentTakeoffSummaryItem[];
  /** In-depth technical construction/trade guidance */
  readonly technicalGuidance: string;
  /** Applicable building code standards & citations */
  readonly codeCitations?: readonly IntentCodeCitation[];
  /** Whether page is active and approved for indexation */
  readonly status: "draft" | "review" | "published";
  /** Date published / updated */
  readonly lastModified?: string;
}

export interface IntentValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}
