/**
 * Google Search Console (GSC) Opportunity Analysis Types
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Strict types for evidence-based SEO telemetry without fabricated metrics.
 */

export type GscPeriod = "7d" | "28d" | "90d";

export interface GscQueryPageRecord {
  readonly query: string;
  readonly page: string;
  readonly clicks: number;
  readonly impressions: number;
  readonly ctr: number; // Decimal (e.g., 0.042 for 4.2%)
  readonly position: number; // 1-indexed average SERP position
}

export type OpportunityClassification =
  | "POSITION_4_15_STRIKING"
  | "POSITION_16_30_SECOND_PAGE"
  | "POSITION_31_60_EARLY_DISCOVERY"
  | "HIGH_IMPRESSION_LOW_CTR"
  | "RISING_QUERY"
  | "DECLINING_QUERY"
  | "ZERO_IMPRESSION_PAGE";

export type SearchIntentType =
  | "commercial_calculation"
  | "code_compliance"
  | "formula_derivation"
  | "dimensional_sizing"
  | "informational_overview";

export interface OpportunityMetricsDelta {
  readonly previousClicks: number;
  readonly previousImpressions: number;
  readonly previousCtr: number;
  readonly previousPosition: number;
  readonly deltaClicks: number;
  readonly deltaImpressions: number;
  readonly deltaCtr: number;
  readonly deltaPosition: number;
}

export interface ActionableOpportunity {
  readonly url: string;
  readonly query: string;
  readonly impressions: number;
  readonly clicks: number;
  readonly ctr: number;
  readonly position: number;
  readonly previousMetrics?: OpportunityMetricsDelta;
  readonly classifications: readonly OpportunityClassification[];
  readonly currentTitle: string;
  readonly currentH1: string;
  readonly searchIntent: SearchIntentType;
  readonly smallestJustifiedOptimization: string;
  readonly isContentGap: boolean;
  readonly deservesInternalLinkStrengthening: boolean;
  readonly opportunityWeight: number; // Deterministic weight: impressions / position
}

export interface ZeroImpressionPage {
  readonly url: string;
  readonly title: string;
  readonly cluster: string;
  readonly type: string;
}

export interface ContentGapItem {
  readonly query: string;
  readonly impressions: number;
  readonly position: number;
  readonly suggestedCluster: string;
  readonly reason: string;
}

export interface InternalLinkCandidate {
  readonly url: string;
  readonly title: string;
  readonly impressions: number;
  readonly position: number;
  readonly rationale: string;
}

export interface GscAnalysisReport {
  readonly dataAvailable: boolean;
  readonly domainValid?: boolean;
  readonly domainError?: string;
  readonly period: GscPeriod;
  readonly totalQueries: number;
  readonly totalImpressions: number;
  readonly totalClicks: number;
  readonly siteWideCtr: number;
  readonly averagePosition: number;
  readonly top20Opportunities: readonly ActionableOpportunity[];
  readonly classificationsBreakdown: Record<OpportunityClassification, number>;
  readonly zeroImpressionPages: readonly ZeroImpressionPage[];
  readonly contentGaps: readonly ContentGapItem[];
  readonly internalLinkCandidates: readonly InternalLinkCandidate[];
}

export interface GscAnalysisInput {
  readonly period: GscPeriod;
  readonly currentRecords: readonly GscQueryPageRecord[];
  readonly previousRecords?: readonly GscQueryPageRecord[];
}
