# ProTrade Calculators — Growth Infrastructure Architecture & Standards

**Platform**: ProTrade Calculators  
**Production Domain**: `https://protradecalculators.com`  
**Standard**: Modular, scalable, anti-thin-content growth infrastructure.

---

## 1. Architecture Implemented

The Growth Infrastructure Sprint establishes the modular foundations necessary to scale ProTrade Calculators toward long-term organic authority and future sustainable monetization without requiring future architectural rewrites.

```
src/
├── types/
│   ├── share.ts              # Shareable calculator state payload contracts
│   ├── intent.ts             # Curated search-intent page definitions & schemas
│   ├── analytics.ts          # Typed analytics event taxonomy
│   └── visuals.ts            # Visual reference asset & diagram metadata
├── lib/
│   ├── share/
│   │   ├── sanitizer.ts       # Robust security sanitization (XSS, NaN, bounds)
│   │   └── state-serializer.ts# Base64URL encoder/decoder with fallback defense
│   ├── intent/
│   │   ├── validator.ts       # Anti-thin-content validation & quality gates
│   │   └── registry.ts        # Central curated search-intent page registry
│   └── analytics/
│       └── events.ts          # Provider-neutral analytics dispatcher
├── components/
│   ├── ui/
│   │   └── share-config-button.tsx  # Interactive share link generator
│   ├── print/
│   │   └── printable-reference-sheet.tsx # Standardized jobsite worksheets
│   ├── visuals/
│   │   └── visual-reference-card.tsx # Standalone CAD blueprint cards
│   └── ads/
│       └── ad-slot-container.tsx    # Reserved CLS-safe ad layout slots
└── config/
    ├── routes.ts             # Central canonical route & sitemap registry
    └── ads.ts                # AdSense slot dimensions (currently disabled)
```

---

## 2. Shareable State & URL Model

### URL Structure & Canonical Rule
- **Shareable State URL**: `${baseUrl}/${category}/${toolSlug}?cfg=${base64urlPayload}`
- **Canonical Defense**: The `<link rel="canonical">` tag **ALWAYS** resolves to the clean, parameter-free base tool URL (e.g. `https://protradecalculators.com/construction/concrete-calculator`).
- **Indexation Rule**: Search engines will never index parameter combinations because all share URLs declare the root tool as canonical, and `robots.txt` / `sitemap.xml` strictly exclude query strings.

### Payload Schema
```json
{
  "version": 1,
  "toolSlug": "concrete-calculator",
  "values": {
    "length": 24,
    "width": 24,
    "depth": 4,
    "depthUnit": "inch",
    "lengthUnit": "foot",
    "wastePercentage": 10
  },
  "timestamp": 1788375800000
}
```

### Security & Sanitization
1. **Size Limit**: Payloads over 2KB are rejected immediately to prevent memory attacks.
2. **Prototype Pollution Guard**: Keys matching `__proto__`, `prototype`, or `constructor` are stripped.
3. **Numeric Clamping**: Numbers are verified as finite, not NaN, and clamped within physical bounds (`sanitizeNumber`).
4. **HTML Stripping**: String parameters are sanitized to remove `<script>` and HTML markup (`sanitizeString`).
5. **Zero-Crash Resilience**: Deserialization errors return a fallback empty state with structured warnings, never throwing unhandled runtime exceptions.

---

## 3. Future Search-Intent Page Architecture

### Clear Separation of 3 Page Classes

| Page Class | URL Pattern | Canonical Strategy | Sitemap Inclusion |
| :--- | :--- | :--- | :---: |
| **1. Canonical Core Calculators** | `/{category}/{tool-slug}` | Self-referential | **YES** (15 Core Tools) |
| **2. Shareable Dynamic Configurations** | `/{category}/{tool-slug}?cfg=...` | Points to Core Calculator | **NO** (Strictly Excluded) |
| **3. Curated High-Value Intent Pages** | `/{category}/{specific-intent-slug}` | Self-referential | **YES** (Only when Published & Validated) |

### Anti-Thin-Content Quality Gates
Any future search-intent page must satisfy `validateIntentPageDefinition()` before sitemap inclusion:
1. **Minimum Technical Guidance**: $\ge 150$ words of unique, expert trade guidance explaining the physical jobsite scenario.
2. **Non-Trivial Prefilled State**: Must supply $\ge 2$ prefilled parameters addressing a distinct search query.
3. **Static Takeoff Takeaways**: Must provide $\ge 2$ pre-calculated takeaway metrics directly in HTML for immediate above-the-fold utility.
4. **Distinct Search Query**: Must target a high-intent Google Keyword Planner search term, not an arbitrary numerical permutation.

---

## 4. Printable & Reference Asset Framework

### Jobsite Worksheet Component (`PrintableReferenceSheet`)
- `@media print` optimized CSS: hides screen-only navigation, headers, footers, and ad slots.
- High-contrast black & white styling to eliminate color toner waste.
- Complete jobsite metadata block: Project Name, Lead Tradesperson, AHJ Permit #, Date.
- Specification takeoff table with quantities, units, and code notes.
- Code compliance & engineering disclaimer footer.

---

## 5. Visual Reference Asset Framework

### CAD Blueprint Card (`VisualReferenceCard`)
- Clean container displaying interactive SVG diagrams or static trade blueprints.
- Aspect-ratio stability (`aspect-[16/10]`) preventing layout shift.
- Annotated building code citation badge (NEC, IRC, IPC, UPC, ASTM).
- Trade summary annotations and optional export triggers.
- Privacy-first `reference_asset_viewed` event dispatch.

---

## 6. AdSense-Safe Layout Foundation

### CLS-Safe Slot Reservation (`AdSlotContainer`)
- **Default State**: Inactive (`ADS_CONFIG.enabled: false`). Renders zero visual elements and zero external scripts.
- **Reserved Layout Dimensions**:
  - `below_calculator`: 728×90 (Desktop), 320×100 (Mobile)
  - `in_article_reference`: 728×90 (Desktop), 300×250 (Mobile)
  - `sidebar_takeoff`: 300×250 (Desktop & Mobile)
- **Policy Compliance**: Ads are strictly prohibited from floating or sticking over calculator inputs, obscuring buttons, or displacing interactive tools.

---

## 7. Product Analytics & Event System

### Event Taxonomy
- `calculator_started`: First input interaction.
- `calculator_completed`: Successful calculation result generated.
- `result_viewed` / `result_generated`: Metric display with duration telemetry.
- `share_link_created`: Shareable URL generated or copied to clipboard.
- `print_requested`: Jobsite worksheet or sheet printed.
- `reference_asset_viewed`: Standalone visual reference card viewed.
- `unit_changed`: Imperial/Metric or AWG/kcmil unit switcher toggled.
- `preset_selected`: Circuit or material takeoff preset applied.

---

## 8. Sitemap Scalability & Rules Against Thin-Page Generation

### Strict Expansion Rules
1. **No Programmatic Dimensional Matrices**: Never generate hundreds of pages for incremental length/width combinations (e.g. `concrete-slab-10x10`, `concrete-slab-10x11`, `concrete-slab-10x12`).
2. **Central Registry Single Source of Truth**: Only routes exported by `getAllCanonicalRoutes()` in `src/config/routes.ts` are included in `sitemap.xml`.
3. **Current Release State**: Exactly **27 canonical URLs** are maintained in `sitemap.xml` and validated via automated unit tests (`tests/seo/sitemap-scalability.test.ts`).

---

## 9. Verification & Quality Summary

- **Total Test Suites**: 29
- **Total Unit & Regression Tests**: 434 (100% passing)
- **TypeScript Typecheck**: 0 errors (`tsc --noEmit`)
- **ESLint**: 0 warnings or errors (`next lint`)
- **Production Build**: 33 static outputs compiled successfully (`npm run build`)
- **Indexable Route Count**: Exactly 27
- **Sitemap Count**: Exactly 27
