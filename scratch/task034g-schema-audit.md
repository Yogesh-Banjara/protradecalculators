# Task 034G: Structured Data (JSON-LD) Integrity Audit

**Document Version**: 1.0  
**Audit Scope**: Verification of Schema.org JSON-LD structured data accuracy and 1-to-1 parity with visible on-page content across all 26 canonical routes.

---

## 1. Schema Types & Verification Standards

| Schema Type | Target Routes | Parity Verification Criterion | Audit Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`WebSite`** | `/` (Root Layout) | Matches platform branding, base URL, and description. | Exact match with `siteConfig`. | **PASS** |
| **`Organization`** | `/` (Root Layout) | Clean publisher entity without unsupported claims. | Valid name and origin. | **PASS** |
| **`BreadcrumbList`** | All 15 Calculators & 5 Suite Hubs | URLs match real, crawlable canonical URLs. | 100% resolve to valid active routes. | **PASS** |
| **`SoftwareApplication`** | All 15 Calculators | `applicationCategory: "CalculatorApplication"`, `operatingSystem: "All"`, `offers: { price: "0" }`. | Accurate zero-cost browser utility. | **PASS** |
| **`FAQPage`** | All 15 Calculators | Every FAQ question and answer in JSON-LD must be verbatim visible in the on-page accordion / FAQ section. | 100% text match; 0 hidden questions. | **PASS** |
| **`HowTo`** | Calculators with Step-by-Step guides | Every step in JSON-LD must reflect visible step-by-step calculation workflow on page. | Matches on-page methodology steps. | **PASS** |

---

## 2. Integrity Safeguards

1. **Zero Unsupported Rating / Review Schemas**: No `AggregateRating` or fabricated user reviews exist anywhere in the codebase.
2. **Zero Hidden Text / Keyword Injection**: All JSON-LD arrays are sourced directly from visible TypeScript data structures rendered into the React DOM.
3. **Realistic SEO Expectations**: Structured data provides semantic machine-readability per Schema.org standards; it does not guarantee search engine ranking, rich snippet display, or indexing priority.
