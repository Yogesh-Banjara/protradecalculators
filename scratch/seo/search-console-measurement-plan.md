# Google Search Console Measurement & Organic Tracking Plan

**Planning Date**: 2026-09-03  
**Domain**: Construction & Trade Tools (`adventurous-shannon`)  
**Objective**: Establish a disciplined, data-driven 30 / 60 / 90-day measurement framework for tracking indexation, crawl efficiency, impressions, query demand, click-through rates (CTR), and Core Web Vitals performance post-deployment.

---

## 1. Core Principles of Organic Measurement

- **No Predictive Fabrication**: We do not claim guaranteed CTR percentages, traffic volumes, or keyword ranking positions prior to receiving actual Google Search Console telemetry.
- **Search Console as Source of Truth**: All indexing, impressions, query positions, and CTRs will be measured directly via the Search Console Performance Report and URL Inspection API.
- **Continuous Quality Governance**: Monitor algorithmic feedback, query intent expansion, and mobile usability without keyword stuffing or doorway exploitation.

---

## 2. 30 / 60 / 90-Day Implementation & Measurement Framework

### Phase A: Days 1 – 30 (Indexation & Crawl Health)

#### Goals:
1. Complete verification of domain property in Google Search Console (`DNS TXT` or `HTML meta tag`).
2. Submit XML Sitemap (`/sitemap.xml`) containing all 33 static outputs.
3. Verify that 100% of canonical URLs are discovered, crawled, and indexed without errors or soft-404s.

#### Key Search Console Metrics to Track:
- **Pages / Indexing Report**:
  - Valid Indexed Pages: Target = 33 / 33 static routes.
  - Excluded / Not Indexed Pages: Target = 0 (check for `Duplicate without user-selected canonical`, `Discovered - currently not indexed`, or `Crawled - currently not indexed`).
- **Sitemaps Report**: Status = `Success` with 33 discovered URLs.
- **Crawl Stats**: Average response time $< 200\text{ms}$; 200 OK status codes on all calculator endpoints.
- **Core Web Vitals**:
  - Largest Contentful Paint (LCP): $\le 2.5\text{s}$ (Good).
  - Interaction to Next Paint (INP): $\le 200\text{ms}$ (Good).
  - Cumulative Layout Shift (CLS): $\le 0.1$ (Good).

---

### Phase B: Days 31 – 60 (Initial Query Capture & CTR Baselining)

#### Goals:
1. Identify primary and long-tail query clusters generating impressions.
2. Establish baseline CTR across top-impression tools (Concrete, Roof Pitch, Voltage Drop, Framing, BTU).
3. Evaluate search snippet appearance (Rich Results for SoftwareApplication, FAQPage, and Breadcrumbs).

#### Key Search Console Metrics to Track:
- **Performance Report (Search Results)**:
  - Total Impressions (baseline measurement).
  - Total Clicks and Site-Wide Average CTR.
  - Average Position for Primary Keywords vs Long-Tail Semantic Variants.
- **Search Appearance Report**:
  - `Product snippets` / `Merchant listings` (if applicable).
  - `FAQ rich results` and `How-to` appearances.
- **CTR Optimization Triggers**:
  - High Impression / Low CTR Queries: If a page generates $> 500$ impressions at positions 4–10 with $\text{CTR} < 2.5\%$, review title tag specificity and meta description answer clarity.

---

### Phase C: Days 61 – 90+ (Topical Authority & Revenue Optimization)

#### Goals:
1. Optimize top-performing pages based on real search intent data.
2. Expand high-demand P2 opportunities (e.g., `Concrete Mix Ratio`, `Board Feet Tally`, `Room CFM Airflow`) supported by search queries discovered in Search Console.
3. Monitor engagement and multi-page sessions to build sustainable organic ad impressions.

#### Key Metrics to Track:
- **Query Growth & Expansion**:
  - Number of unique search queries ranking in Top 10 / Top 20.
  - Long-tail phrase volume capturing high-commercial intent (e.g. *"how many bags of concrete for 10x10 slab 4 inches thick"*, *"wire size for 100 amp subpanel 150 feet away"*).
- **Cannibalization Monitoring**:
  - Inspect top queries to ensure impressions are concentrated on the designated canonical URL rather than splitting across multiple URLs.

---

## 3. Revenue Connection & Keyword Role Matrix

| Topical Hub | Strategic Role toward \$500/mo Goal | Commercial Intent | Advertiser Bid Signal | Retention / Repeat-Use Value | Expansion Priority |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Concrete & Masonry** | **HIGH** | High (Ready-mix deliveries, bag purchases) | High (\$1.00 – \$4.00) | Very High (Contractors calculating pours weekly) | P0 (Live) / P2 (`Concrete Mix Ratio`) |
| **Electrical & Wire Sizing** | **HIGH** | High (Conductor purchases, panel upgrades) | Very High (\$1.10 – \$5.50) | High (Electricians, inspectors, solar installers) | P0 (Live) |
| **HVAC & BTU/Duct Sizing** | **HIGH** | High (Heat pump sizing, mini-split installs) | Very High (\$1.20 – \$5.20) | High (HVAC technicians, energy auditors) | P0 (Live) / P2 (`Room CFM Airflow`) |
| **Roofing & Rafter Geometry** | **HIGH** | High (Shingle takeoffs, framing jobs) | High (\$0.90 – \$4.80) | High (Carpenters, roofers, DIY builders) | P0 (Live) |
| **Framing & Wall Lumber** | **MEDIUM** | Medium-High (Lumberyard orders) | Medium (\$0.70 – \$3.20) | High (Framing crews, room additions) | P0 (Live) / P2 (`Board Feet Tally`) |
| **Plumbing DFU & WSFU** | **MEDIUM** | Medium (Pipe sizing, permit applications) | Medium (\$0.60 – \$2.80) | High (Plumbers, plan reviewers) | P0 (Live) |
| **Materials (Drywall & Gravel)** | **MEDIUM** | Medium (Bulk quarry orders, sheetrock) | Medium (\$0.60 – \$3.00) | Medium (Homeowners, remodelers) | P0 (Live) |

---

## 4. Search Console Quality & Maintenance Checklist

- [x] **Canonical Header Matching**: All URLs serve self-referential canonical tags matching the sitemap.
- [x] **Robots.txt Configuration**: Allows crawling of all public routes and points to valid sitemap URL.
- [x] **Clean URL Structure**: Clean descriptive slugs without query parameter duplication or trailing slash redirects.
- [x] **Semantic HTML & Heading Integrity**: Strict $H_1 \to H_2 \to H_3$ hierarchy across all routes.
- [x] **Schema Validation**: Valid JSON-LD schemas matching visible page content.
- [x] **Responsive Mobile Layouts**: Viewport-tested touch targets $\ge 44\text{px}$, zero horizontal overflow.
