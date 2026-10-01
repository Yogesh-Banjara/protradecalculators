/**
 * Evidence-First Google Search Console (GSC) Opportunity Analyzer
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Implements strict mathematical metrics, period-over-period deltas,
 * opportunity classification, content gap detection, and ranking
 * based exclusively on empirical search telemetry without arbitrary scores.
 */

import type {
  GscQueryPageRecord,
  GscAnalysisInput,
  GscAnalysisReport,
  ActionableOpportunity,
  OpportunityClassification,
  SearchIntentType,
  ZeroImpressionPage,
  ContentGapItem,
  InternalLinkCandidate,
} from "@/types/gsc";
import {
  SITE_CATALOG,
  findCatalogPage,
  normalizeCatalogPath,
  matchQueryToCluster,
} from "./site-catalog";

/**
 * Expected baseline CTR curve by SERP position range.
 * Used empirically to detect High-Impression / Low-CTR title/snippet mismatches.
 */
const CTR_BENCHMARKS = [
  { minPos: 1.0, maxPos: 3.9, expectedMinCtr: 0.10 },
  { minPos: 4.0, maxPos: 10.9, expectedMinCtr: 0.018 },
  { minPos: 11.0, maxPos: 20.9, expectedMinCtr: 0.008 },
  { minPos: 21.0, maxPos: 60.0, expectedMinCtr: 0.003 },
];

export const EXPECTED_GSC_DOMAIN = "protradecalculators.com";

/**
 * Validates that an exported GSC telemetry dataset belongs to the expected domain.
 * Strictly prevents cross-property contamination (e.g. ingesting BijliWise into ProTrade).
 */
export function validateGscDomain(
  rawContentOrUrls: string | string[],
  expectedDomain = EXPECTED_GSC_DOMAIN
): { isValid: boolean; detectedDomain?: string; errorMessage?: string } {
  const content = Array.isArray(rawContentOrUrls)
    ? rawContentOrUrls.join(" ")
    : rawContentOrUrls;

  // Find all domain names mentioned in http(s) URLs
  const urlMatches = content.matchAll(/https?:\/\/([^/\s,"]+)/gi);
  const detectedDomains = new Set<string>();

  for (const match of urlMatches) {
    const rawHost = match[1].toLowerCase().replace(/^www\./, "");
    detectedDomains.add(rawHost);
  }

  // If no domains found (e.g. relative URLs or pure query lists), it passes domain check
  if (detectedDomains.size === 0) {
    return { isValid: true };
  }

  const expectedClean = expectedDomain.toLowerCase().replace(/^www\./, "");

  for (const domain of detectedDomains) {
    if (domain !== expectedClean && domain !== "localhost") {
      return {
        isValid: false,
        detectedDomain: domain,
        errorMessage: `WRONG GSC PROPERTY — EXPECTED ${expectedDomain} (found: ${domain})`,
      };
    }
  }

  return { isValid: true, detectedDomain: expectedClean };
}

/**
 * Parses raw CSV content exported from Google Search Console Performance report.
 * Supports standard GSC headers: "Top queries" / "Query", "Pages" / "Page", "Clicks", "Impressions", "CTR", "Position".
 */
export function parseGscCsv(
  csvContent: string,
  expectedDomain = EXPECTED_GSC_DOMAIN
): GscQueryPageRecord[] {
  if (!csvContent || !csvContent.trim()) {
    return [];
  }

  const domainCheck = validateGscDomain(csvContent, expectedDomain);
  if (!domainCheck.isValid) {
    throw new Error(domainCheck.errorMessage);
  }

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return [];
  }

  // 1. Identify all table sections in the CSV
  interface SectionHeader {
    lineIndex: number;
    colMap: ReturnType<typeof mapHeaders>;
    type: "queries" | "pages" | "combined";
  }

  const sections: SectionHeader[] = [];

  for (let i = 0; i < lines.length; i++) {
    const tokens = parseCsvLine(lines[i]);
    const colMap = mapHeaders(tokens);

    if (colMap.query !== -1 && colMap.page !== -1) {
      sections.push({ lineIndex: i, colMap, type: "combined" });
    } else if (colMap.query !== -1 && colMap.impressions !== -1) {
      sections.push({ lineIndex: i, colMap, type: "queries" });
    } else if (colMap.page !== -1 && colMap.impressions !== -1) {
      sections.push({ lineIndex: i, colMap, type: "pages" });
    }
  }

  if (sections.length === 0) {
    throw new Error(
      "Invalid GSC CSV: could not locate 'Query' or 'Page' column in any table header."
    );
  }

  // 2. Parse parsed pages first if available
  interface ParsedPageItem {
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }
  const parsedPages: ParsedPageItem[] = [];

  const pagesSection = sections.find((s) => s.type === "pages");
  if (pagesSection) {
    const startIdx = pagesSection.lineIndex + 1;
    // Find next section boundary
    const nextSection = sections.find((s) => s.lineIndex > pagesSection.lineIndex);
    const endIdx = nextSection ? nextSection.lineIndex : lines.length;

    for (let i = startIdx; i < endIdx; i++) {
      const tokens = parseCsvLine(lines[i]);
      if (tokens.length < 2) continue;

      const rawPage = tokens[pagesSection.colMap.page] || "/";
      const page = normalizeCatalogPath(rawPage);
      const clicks = parseMetric(tokens[pagesSection.colMap.clicks]);
      const impressions = parseMetric(tokens[pagesSection.colMap.impressions]);
      let ctr = 0;
      if (pagesSection.colMap.ctr !== -1 && tokens[pagesSection.colMap.ctr]) {
        const rawCtr = tokens[pagesSection.colMap.ctr].replace("%", "").trim();
        ctr = parseFloat(rawCtr);
        if (tokens[pagesSection.colMap.ctr].includes("%") || ctr > 1.0) {
          ctr = ctr / 100;
        }
      } else if (impressions > 0) {
        ctr = clicks / impressions;
      }
      const position = parseFloat(tokens[pagesSection.colMap.position]) || 0;

      if (page) {
        parsedPages.push({
          page,
          clicks,
          impressions,
          ctr: Number.isFinite(ctr) ? Math.round(ctr * 10000) / 10000 : 0,
          position: Number.isFinite(position) ? Math.round(position * 10) / 10 : 0,
        });
      }
    }
  }

  // 3. Parse queries or combined records
  const records: GscQueryPageRecord[] = [];

  const combinedSection = sections.find((s) => s.type === "combined");
  if (combinedSection) {
    const startIdx = combinedSection.lineIndex + 1;
    const nextSection = sections.find((s) => s.lineIndex > combinedSection.lineIndex);
    const endIdx = nextSection ? nextSection.lineIndex : lines.length;

    for (let i = startIdx; i < endIdx; i++) {
      const tokens = parseCsvLine(lines[i]);
      if (tokens.length < 2) continue;

      const query = tokens[combinedSection.colMap.query] || "";
      const rawPage = tokens[combinedSection.colMap.page] || "/";
      const page = normalizeCatalogPath(rawPage);
      const clicks = parseMetric(tokens[combinedSection.colMap.clicks]);
      const impressions = parseMetric(tokens[combinedSection.colMap.impressions]);
      let ctr = 0;
      if (combinedSection.colMap.ctr !== -1 && tokens[combinedSection.colMap.ctr]) {
        const rawCtr = tokens[combinedSection.colMap.ctr].replace("%", "").trim();
        ctr = parseFloat(rawCtr);
        if (tokens[combinedSection.colMap.ctr].includes("%") || ctr > 1.0) {
          ctr = ctr / 100;
        }
      } else if (impressions > 0) {
        ctr = clicks / impressions;
      }
      const position = parseFloat(tokens[combinedSection.colMap.position]) || 0;

      if (query || page) {
        records.push({
          query: query.trim(),
          page,
          clicks,
          impressions,
          ctr: Number.isFinite(ctr) ? Math.round(ctr * 10000) / 10000 : 0,
          position: Number.isFinite(position) ? Math.round(position * 10) / 10 : 0,
        });
      }
    }
    return records;
  }

  const queriesSection = sections.find((s) => s.type === "queries");
  if (queriesSection) {
    const startIdx = queriesSection.lineIndex + 1;
    const nextSection = sections.find((s) => s.lineIndex > queriesSection.lineIndex);
    const endIdx = nextSection ? nextSection.lineIndex : lines.length;

    for (let i = startIdx; i < endIdx; i++) {
      const tokens = parseCsvLine(lines[i]);
      if (tokens.length < 2) continue;

      const query = tokens[queriesSection.colMap.query] || "";
      if (!query.trim()) continue;

      const clicks = parseMetric(tokens[queriesSection.colMap.clicks]);
      const impressions = parseMetric(tokens[queriesSection.colMap.impressions]);
      let ctr = 0;
      if (queriesSection.colMap.ctr !== -1 && tokens[queriesSection.colMap.ctr]) {
        const rawCtr = tokens[queriesSection.colMap.ctr].replace("%", "").trim();
        ctr = parseFloat(rawCtr);
        if (tokens[queriesSection.colMap.ctr].includes("%") || ctr > 1.0) {
          ctr = ctr / 100;
        }
      } else if (impressions > 0) {
        ctr = clicks / impressions;
      }
      const position = parseFloat(tokens[queriesSection.colMap.position]) || 0;

      // Associate query with the best matching page from parsedPages
      const matchedPage = matchQueryToPage(query, parsedPages);

      records.push({
        query: query.trim(),
        page: matchedPage,
        clicks,
        impressions,
        ctr: Number.isFinite(ctr) ? Math.round(ctr * 10000) / 10000 : 0,
        position: Number.isFinite(position) ? Math.round(position * 10) / 10 : 0,
      });
    }
  } else if (parsedPages.length > 0) {
    // Only pages section existed
    for (const p of parsedPages) {
      records.push({
        query: `(page) ${p.page}`,
        page: p.page,
        clicks: p.clicks,
        impressions: p.impressions,
        ctr: p.ctr,
        position: p.position,
      });
    }
  }

  return records;
}

/**
 * Associates a query with the most appropriate landing page from the GSC export.
 */
function matchQueryToPage(
  query: string,
  pages: Array<{ page: string; impressions: number; position: number }>
): string {
  if (pages.length === 0) return "/";

  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const qTokens = q.split(/\s+/).filter((t) => t.length >= 2);

  let bestPage = pages[0].page;
  let bestScore = -1;

  for (const p of pages) {
    const pLower = p.page.toLowerCase();
    let score = 0;

    for (const token of qTokens) {
      if (pLower.includes(token)) {
        score += token.length >= 4 ? 4 : 2;
      }
    }

    if (score > 0) {
      // Add slight bonus for page impression volume
      score += Math.min(2, Math.log10(Math.max(p.impressions, 1)));
    }

    if (score > bestScore) {
      bestScore = score;
      bestPage = p.page;
    }
  }

  if (bestScore <= 0) {
    return pages[0].page;
  }

  return bestPage;
}

/**
 * Parses JSON array of GSC records.
 */
export function parseGscJson(
  jsonData: unknown,
  expectedDomain = EXPECTED_GSC_DOMAIN
): GscQueryPageRecord[] {
  if (!Array.isArray(jsonData)) {
    return [];
  }

  const domainCheck = validateGscDomain(JSON.stringify(jsonData), expectedDomain);
  if (!domainCheck.isValid) {
    throw new Error(domainCheck.errorMessage);
  }

  const records: GscQueryPageRecord[] = [];

  for (const item of jsonData) {
    if (typeof item !== "object" || item === null) continue;
    const obj = item as Record<string, unknown>;

    const keys = Array.isArray(obj.keys) ? (obj.keys as unknown[]) : [];
    const query = String(obj.query || keys[0] || "").trim();
    const rawPage = String(obj.page || keys[1] || "/");
    const page = normalizeCatalogPath(rawPage);
    const clicks = Number(obj.clicks || 0);
    const impressions = Number(obj.impressions || 0);
    let ctr = Number(obj.ctr || 0);
    if (ctr > 1.0) ctr = ctr / 100;
    const position = Number(obj.position || 0);

    records.push({
      query,
      page,
      clicks,
      impressions,
      ctr: Number.isFinite(ctr) ? ctr : impressions > 0 ? clicks / impressions : 0,
      position: Number.isFinite(position) ? position : 0,
    });
  }

  return records;
}

/**
 * Determines search intent based on vocabulary patterns.
 */
export function determineSearchIntent(query: string): SearchIntentType {
  const q = query.toLowerCase();

  if (/\bnec\b|\barticle\b|\btable\b|\bcode\b|\brule\b|\bcompliance\b/i.test(q)) {
    return "code_compliance";
  }
  if (/\bformula\b|\bhow to calculate\b|\bderivation\b|\bequation\b|\btheory\b/i.test(q)) {
    return "formula_derivation";
  }
  if (/\bwire size\b|\bconduit size\b|\bduct size\b|\btrade size\b|\bampacity\b/i.test(q)) {
    return "dimensional_sizing";
  }
  if (/\bcalculator\b|\bestimator\b|\byardage\b|\bhow many\b|\btonnage\b|\bcost\b/i.test(q)) {
    return "commercial_calculation";
  }

  return "informational_overview";
}

/**
 * Classifies an individual query/page pair into opportunity categories.
 */
export function classifyRecord(
  rec: GscQueryPageRecord,
  prev?: GscQueryPageRecord
): OpportunityClassification[] {
  const categories: OpportunityClassification[] = [];

  if (rec.impressions > 0) {
    if (rec.position >= 4.0 && rec.position <= 15.0) {
      categories.push("POSITION_4_15_STRIKING");
    } else if (rec.position > 15.0 && rec.position <= 30.0) {
      categories.push("POSITION_16_30_SECOND_PAGE");
    } else if (rec.position > 30.0 && rec.position <= 60.0) {
      categories.push("POSITION_31_60_EARLY_DISCOVERY");
    }
  }

  // High Impression / Low CTR Detection
  if (rec.impressions >= 15) {
    const benchmark = CTR_BENCHMARKS.find(
      (b) => rec.position >= b.minPos && rec.position <= b.maxPos
    );
    if (benchmark && rec.ctr < benchmark.expectedMinCtr) {
      categories.push("HIGH_IMPRESSION_LOW_CTR");
    }
  }

  // Momentum Comparison
  if (prev && prev.impressions > 0) {
    const deltaImp = rec.impressions - prev.impressions;
    const deltaClicks = rec.clicks - prev.clicks;
    const growthRate = deltaImp / prev.impressions;

    if (growthRate >= 0.2 || (deltaClicks > 0 && growthRate > 0)) {
      categories.push("RISING_QUERY");
    } else if (growthRate <= -0.2 || (deltaClicks < 0 && growthRate < 0)) {
      categories.push("DECLINING_QUERY");
    }
  }

  return categories;
}

/**
 * Formulates the smallest justified on-page optimization.
 */
function formulateSmallestOptimization(
  query: string,
  categories: readonly OpportunityClassification[],
  currentTitle: string,
  currentH1: string,
  url: string
): string {
  const isGuide = url.includes("/guides/");
  const isSolution = url.includes("/solutions/");

  if (categories.includes("HIGH_IMPRESSION_LOW_CTR")) {
    return `Align meta description and snippet hook directly to query "${query}" without truncation; current Title: "${currentTitle}".`;
  }
  if (categories.includes("POSITION_4_15_STRIKING")) {
    if (isSolution) {
      return `Ensure direct mathematical result for "${query}" is highlighted in above-fold summary box.`;
    }
    return `Add prominent H2 or quick answer block explicitly addressing "${query}" above the fold and link internally from category hub.`;
  }
  if (categories.includes("POSITION_16_30_SECOND_PAGE")) {
    if (isGuide) {
      return `Expand technical code citation table to include explicit row and values for "${query}".`;
    }
    return `Add worked example card and tabular reference directly matching query parameters for "${query}".`;
  }
  if (categories.includes("POSITION_31_60_EARLY_DISCOVERY")) {
    return `Incorporate "${query}" semantic terms into FAQ accordion and Schema.org FAQPage structured data.`;
  }
  if (categories.includes("RISING_QUERY")) {
    return `Elevate "${query}" topic in primary sidebar and cross-link from adjacent cluster calculators to capture momentum.`;
  }

  return `Maintain content freshness and monitor ranking trajectory.`;
}

/**
 * Main analysis function that ingests GSC records and outputs complete opportunity report.
 */
export function analyzeGscData(input: GscAnalysisInput): GscAnalysisReport {
  const { currentRecords, previousRecords, period } = input;

  if (!currentRecords || currentRecords.length === 0) {
    return {
      dataAvailable: false,
      period,
      totalQueries: 0,
      totalImpressions: 0,
      totalClicks: 0,
      siteWideCtr: 0,
      averagePosition: 0,
      top20Opportunities: [],
      classificationsBreakdown: {
        POSITION_4_15_STRIKING: 0,
        POSITION_16_30_SECOND_PAGE: 0,
        POSITION_31_60_EARLY_DISCOVERY: 0,
        HIGH_IMPRESSION_LOW_CTR: 0,
        RISING_QUERY: 0,
        DECLINING_QUERY: 0,
        ZERO_IMPRESSION_PAGE: SITE_CATALOG.length,
      },
      zeroImpressionPages: SITE_CATALOG.map((p) => ({
        url: p.url,
        title: p.title,
        cluster: p.cluster,
        type: p.type,
      })),
      contentGaps: [],
      internalLinkCandidates: [],
    };
  }

  // Build previous lookup map: key = `${query}::${page}`
  const prevMap = new Map<string, GscQueryPageRecord>();
  if (previousRecords) {
    for (const pr of previousRecords) {
      prevMap.set(`${pr.query.toLowerCase()}::${pr.page.toLowerCase()}`, pr);
    }
  }

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalWeightedPosition = 0;

  const analyzedOpportunities: ActionableOpportunity[] = [];
  const activePagesSet = new Set<string>();

  const breakdown: Record<OpportunityClassification, number> = {
    POSITION_4_15_STRIKING: 0,
    POSITION_16_30_SECOND_PAGE: 0,
    POSITION_31_60_EARLY_DISCOVERY: 0,
    HIGH_IMPRESSION_LOW_CTR: 0,
    RISING_QUERY: 0,
    DECLINING_QUERY: 0,
    ZERO_IMPRESSION_PAGE: 0,
  };

  const contentGaps: ContentGapItem[] = [];
  const internalLinkMap = new Map<string, { impressions: number; bestPos: number }>();

  for (const rec of currentRecords) {
    totalImpressions += rec.impressions;
    totalClicks += rec.clicks;
    totalWeightedPosition += rec.position * rec.impressions;

    activePagesSet.add(rec.page);

    const prev = prevMap.get(`${rec.query.toLowerCase()}::${rec.page.toLowerCase()}`);
    const classifications = classifyRecord(rec, prev);

    for (const cat of classifications) {
      breakdown[cat] = (breakdown[cat] || 0) + 1;
    }

    const catalogPage = findCatalogPage(rec.page);
    const currentTitle = catalogPage ? catalogPage.title : "Unregistered Page";
    const currentH1 = catalogPage ? catalogPage.h1 : "Unregistered H1";

    const clusterMatch = matchQueryToCluster(rec.query);
    const isContentGap =
      clusterMatch.confidence < 0.35 &&
      !rec.page.includes("/solutions/") &&
      rec.impressions >= 10;

    if (isContentGap) {
      contentGaps.push({
        query: rec.query,
        impressions: rec.impressions,
        position: rec.position,
        suggestedCluster: clusterMatch.cluster,
        reason: `Query has impressions (${rec.impressions}) at position ${rec.position} but no dedicated tool or solution directly solves this exact calculation.`,
      });
    }

    // Track internal link candidate metrics for pages with impressions
    if (rec.page !== "/" && rec.position >= 4.0 && rec.position <= 25.0) {
      const existing = internalLinkMap.get(rec.page) || { impressions: 0, bestPos: 999 };
      internalLinkMap.set(rec.page, {
        impressions: existing.impressions + rec.impressions,
        bestPos: Math.min(existing.bestPos, rec.position),
      });
    }

    const searchIntent = determineSearchIntent(rec.query);
    const smallestOpt = formulateSmallestOptimization(
      rec.query,
      classifications,
      currentTitle,
      currentH1,
      rec.page
    );

    // Deterministic Opportunity Weight = impressions / max(position, 1.0)
    // Reflects expected incremental search traffic without arbitrary scores
    const opportunityWeight =
      Math.round((rec.impressions / Math.max(rec.position, 1.0)) * 100) / 100;

    let previousMetrics: ActionableOpportunity["previousMetrics"];
    if (prev) {
      previousMetrics = {
        previousClicks: prev.clicks,
        previousImpressions: prev.impressions,
        previousCtr: prev.ctr,
        previousPosition: prev.position,
        deltaClicks: rec.clicks - prev.clicks,
        deltaImpressions: rec.impressions - prev.impressions,
        deltaCtr: Math.round((rec.ctr - prev.ctr) * 10000) / 10000,
        deltaPosition: Math.round((rec.position - prev.position) * 10) / 10,
      };
    }

    const deservesInternalLinkStrengthening =
      rec.position >= 4.0 && rec.position <= 20.0 && rec.impressions >= 10;

    analyzedOpportunities.push({
      url: rec.page,
      query: rec.query,
      impressions: rec.impressions,
      clicks: rec.clicks,
      ctr: rec.ctr,
      position: rec.position,
      previousMetrics,
      classifications,
      currentTitle,
      currentH1,
      searchIntent,
      smallestJustifiedOptimization: smallestOpt,
      isContentGap,
      deservesInternalLinkStrengthening,
      opportunityWeight,
    });
  }

  // Sort opportunities deterministically: highest opportunity weight first
  analyzedOpportunities.sort((a, b) => b.opportunityWeight - a.opportunityWeight);

  // Top 20 actionable opportunities
  const top20Opportunities = analyzedOpportunities.slice(0, 20);

  // Identify Zero Impression Pages
  const zeroImpressionPages: ZeroImpressionPage[] = [];
  for (const page of SITE_CATALOG) {
    if (!activePagesSet.has(page.url)) {
      zeroImpressionPages.push({
        url: page.url,
        title: page.title,
        cluster: page.cluster,
        type: page.type,
      });
    }
  }
  breakdown.ZERO_IMPRESSION_PAGE = zeroImpressionPages.length;

  // Build Internal Link Candidates (pages already receiving impressions deserving stronger incoming internal links)
  const internalLinkCandidates: InternalLinkCandidate[] = [];
  for (const [url, data] of internalLinkMap.entries()) {
    const page = findCatalogPage(url);
    if (page && data.impressions >= 15) {
      internalLinkCandidates.push({
        url,
        title: page.title,
        impressions: data.impressions,
        position: data.bestPos,
        rationale: `Ranking at average position ${data.bestPos} with ${data.impressions} impressions. Adding 2-3 prominent contextual links from top cluster hubs will push it into the Top 3.`,
      });
    }
  }
  internalLinkCandidates.sort((a, b) => b.impressions - a.impressions);

  const siteWideCtr =
    totalImpressions > 0
      ? Math.round((totalClicks / totalImpressions) * 10000) / 10000
      : 0;
  const averagePosition =
    totalImpressions > 0
      ? Math.round((totalWeightedPosition / totalImpressions) * 10) / 10
      : 0;

  return {
    dataAvailable: true,
    period,
    totalQueries: currentRecords.length,
    totalImpressions,
    totalClicks,
    siteWideCtr,
    averagePosition,
    top20Opportunities,
    classificationsBreakdown: breakdown,
    zeroImpressionPages,
    contentGaps: contentGaps.slice(0, 10),
    internalLinkCandidates: internalLinkCandidates.slice(0, 10),
  };
}

/**
 * Formats the analysis results into a clean, markdown report.
 */
export function formatGscReportMarkdown(report: GscAnalysisReport): string {
  if (report.domainValid === false || report.domainError) {
    return `# Google Search Console Opportunity Analysis Report
**Status**: REJECTED — WRONG GSC PROPERTY  
**Error**: ${report.domainError || "WRONG GSC PROPERTY — EXPECTED protradecalculators.com"}  

> [!CAUTION]
> **Data Rejection Notice**: Telemetry from another Google Search Console property was detected and rejected.
> Zero external metrics, queries, or rankings have been applied to ProTrade Calculators.

### Action Required:
Provide a genuine Google Search Console export for property **protradecalculators.com**.
`;
  }

  if (!report.dataAvailable) {
    return `# Google Search Console Opportunity Analysis Report
**Status**: DATA UNAVAILABLE  
**Analyzed Period**: ${report.period}  

> [!NOTE]
> **No live Google Search Console export data is currently present in the repository.**
> To preserve 100% telemetry integrity, zero impressions, rankings, or CTR values have been fabricated.

### How to Ingest GSC Telemetry:
1. Export the Performance Report from Google Search Console (Date Range: 7 days, 28 days, or 90 days) as CSV or JSON.
2. Save the export file to \`data/gsc/gsc-${report.period}.csv\` (or provide via CLI).
3. Re-run: \`npx tsx scripts/analyze-gsc.ts --file=data/gsc/gsc-${report.period}.csv\`.

### Monitored Architecture Status:
- Total Canonical Monitored URLs: **${report.zeroImpressionPages.length}**
- All ${report.zeroImpressionPages.length} pages are currently tracked in the catalog awaiting search console impression feedback.
`;
  }

  let md = `# Google Search Console Opportunity Analysis Report
**Status**: DATA AVAILABLE  
**Analyzed Period**: ${report.period}  
**Total Queries**: ${report.totalQueries} | **Total Impressions**: ${report.totalImpressions.toLocaleString()} | **Total Clicks**: ${report.totalClicks.toLocaleString()}  
**Site-Wide Average CTR**: ${(report.siteWideCtr * 100).toFixed(2)}% | **Average Position**: ${report.averagePosition}

---

## 1. Opportunity Classification Breakdown
- **Position 4–15 (Striking Distance)**: ${report.classificationsBreakdown.POSITION_4_15_STRIKING} queries
- **Position 16–30 (Second/Third Page Opportunities)**: ${report.classificationsBreakdown.POSITION_16_30_SECOND_PAGE} queries
- **Position 31–60 (Early Discovery / Relevance)**: ${report.classificationsBreakdown.POSITION_31_60_EARLY_DISCOVERY} queries
- **High-Impression / Low-CTR (Snippet Optimization)**: ${report.classificationsBreakdown.HIGH_IMPRESSION_LOW_CTR} queries
- **Rising Queries (Positive Velocity)**: ${report.classificationsBreakdown.RISING_QUERY} queries
- **Declining Queries**: ${report.classificationsBreakdown.DECLINING_QUERY} queries
- **Zero-Impression Indexed Pages**: ${report.classificationsBreakdown.ZERO_IMPRESSION_PAGE} pages

---

## 2. TOP 20 Actionable Query/Page Opportunities
*Ranked deterministically by Empirical Opportunity Weight (Impressions / Position) — No arbitrary SEO scores.*

| Rank | Query | URL | Impr | Clicks | CTR | Pos | Opp Weight | Intent | Smallest Justified Optimization |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
`;

  report.top20Opportunities.forEach((opp, idx) => {
    md += `| ${idx + 1} | **${opp.query}** | \`${opp.url}\` | ${opp.impressions.toLocaleString()} | ${opp.clicks} | ${(opp.ctr * 100).toFixed(1)}% | ${opp.position} | ${opp.opportunityWeight.toFixed(1)} | ${opp.searchIntent} | ${opp.smallestJustifiedOptimization} |\n`;
  });

  md += `\n---

## 3. Pages Deserving Internal-Link Strengthening (Before Any New Page Creation)
*These pages already generate live impressions in striking distance (pos 4–25). Boosting internal link equity will compound their rankings without diluting crawl budget.*

| Page URL | Current Best Pos | Total Impressions | Rationale |
|---|:---:|:---:|---|
`;

  report.internalLinkCandidates.forEach((cand) => {
    md += `| \`${cand.url}\` | ${cand.position} | ${cand.impressions.toLocaleString()} | ${cand.rationale} |\n`;
  });

  if (report.contentGaps.length > 0) {
    md += `\n---

## 4. Genuine Content Gaps vs Existing Page Optimization
*These search queries generate impressions but do not cleanly match any existing tool or solution calculation.*

| Query | Impressions | Position | Suggested Cluster | Rationale |
|---|:---:|:---:|---|---|
`;
    report.contentGaps.forEach((gap) => {
      md += `| **${gap.query}** | ${gap.impressions} | ${gap.position} | ${gap.suggestedCluster} | ${gap.reason} |\n`;
    });
  }

  if (report.zeroImpressionPages.length > 0) {
    md += `\n---

## 5. Zero-Impression Pages
*Indexed canonical pages that registered zero impressions during this ${report.period} period.*

Total Zero-Impression Pages: **${report.zeroImpressionPages.length}**
`;
    const preview = report.zeroImpressionPages.slice(0, 10);
    preview.forEach((p) => {
      md += `- \`${p.url}\` (${p.cluster} / ${p.type}): *${p.title}*\n`;
    });
    if (report.zeroImpressionPages.length > 10) {
      md += `*...and ${report.zeroImpressionPages.length - 10} more pages.*\n`;
    }
  }

  return md;
}

// Helpers
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      insideQuotes = !insideQuotes;
    } else if (c === "," && !insideQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function mapHeaders(headers: string[]): {
  query: number;
  page: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
} {
  const map = {
    query: -1,
    page: -1,
    clicks: -1,
    impressions: -1,
    ctr: -1,
    position: -1,
  };

  headers.forEach((h, idx) => {
    const low = h.toLowerCase().replace(/[^a-z]/g, "");
    if (low === "topqueries" || low === "query" || low === "queries") {
      map.query = idx;
    } else if (low === "toppages" || low === "page" || low === "pages" || low === "url") {
      map.page = idx;
    } else if (low === "clicks") {
      map.clicks = idx;
    } else if (low === "impressions") {
      map.impressions = idx;
    } else if (low === "ctr") {
      map.ctr = idx;
    } else if (low === "position" || low === "averageposition") {
      map.position = idx;
    }
  });

  return map;
}

function parseMetric(val: string | undefined): number {
  if (!val) return 0;
  const clean = val.replace(/,/g, "").trim();
  const num = parseFloat(clean);
  return Number.isFinite(num) ? num : 0;
}
