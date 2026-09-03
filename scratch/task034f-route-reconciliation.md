# Task 034F: Platform Route Reconciliation & Inventory

**Document Version**: 1.0  
**Status**: Exact Reconciliation Completed

---

## 1. Executive Reconciliation Summary

In Task 034E, the Next.js compiler output reported `Generating static pages (31/31)`. This document reconciles the exact mathematical difference between **Public Indexable User-Facing Pages** (26 URLs), **Protocol / Framework Endpoints** (3 URLs), and **App Router Route Templates** (2 artifacts).

$$\underbrace{6\text{ Platform Core} + 5\text{ Active Suite Hubs} + 15\text{ Calculators}}_{26\text{ Public Indexable URLs in Sitemap}} + \underbrace{2\text{ Protocol Endpoints} (/robots.txt, /sitemap.xml) + 1\text{ Error Route} (/\_not-found)}_{3\text{ Protocol / System Endpoints}} + \underbrace{2\text{ Compiler Base Templates}}_{31\text{ Build Outputs}}$$

---

## 2. Full Public Route Inventory (26 Canonical URLs)

| # | Route Path | Route Type | Indexable | Included in Sitemap | Canonical URL | Inclusion Reason |
| :-: | :--- | :--- | :-: | :-: | :--- | :--- |
| **1** | `/` | Root / Landing | **YES** | **YES** | `https://itradehub.com/` | Digital Trade Workbench Homepage |
| **2** | `/tools` | Platform Utility | **YES** | **YES** | `https://itradehub.com/tools` | Searchable Directory of all 15 active tools |
| **3** | `/about` | Platform Utility | **YES** | **YES** | `https://itradehub.com/about` | Physics, accuracy standards & methodology |
| **4** | `/contact` | Platform Utility | **YES** | **YES** | `https://itradehub.com/contact` | User feedback & bug reporting |
| **5** | `/privacy` | Legal | **YES** | **YES** | `https://itradehub.com/privacy` | Privacy policy compliance |
| **6** | `/terms` | Legal | **YES** | **YES** | `https://itradehub.com/terms` | Terms of service & liability disclaimers |
| **7** | `/categories/construction` | Trade Suite Hub | **YES** | **YES** | `https://itradehub.com/categories/construction` | Construction suite (5 tools) |
| **8** | `/categories/electrical` | Trade Suite Hub | **YES** | **YES** | `https://itradehub.com/categories/electrical` | Electrical suite (4 tools) |
| **9** | `/categories/plumbing` | Trade Suite Hub | **YES** | **YES** | `https://itradehub.com/categories/plumbing` | Plumbing suite (2 tools) |
| **10** | `/categories/hvac` | Trade Suite Hub | **YES** | **YES** | `https://itradehub.com/categories/hvac` | HVAC suite (2 tools) |
| **11** | `/categories/materials` | Trade Suite Hub | **YES** | **YES** | `https://itradehub.com/categories/materials` | Materials & aggregate suite (2 tools) |
| **12** | `/construction/concrete-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/construction/concrete-calculator` | Ready-mix yardage & bag counts |
| **13** | `/construction/framing-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/construction/framing-calculator` | Studs (16/24 OC) & plate takeoff |
| **14** | `/construction/stair-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/construction/stair-calculator` | Stringer cuts, rise/run & headroom |
| **15** | `/construction/deck-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/construction/deck-calculator` | Deck boards, joists, beams & piers |
| **16** | `/construction/roof-pitch-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/construction/roof-pitch-calculator` | Pitch angles, rafters & roofing squares |
| **17** | `/materials/gravel-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/materials/gravel-calculator` | Aggregate tonnage & truckloads |
| **18** | `/materials/drywall-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/materials/drywall-calculator` | Sheet counts (4x8/12), mud & tape |
| **19** | `/electrical/voltage-drop-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/electrical/voltage-drop-calculator` | Conductor gauge & percentage drop |
| **20** | `/electrical/conduit-fill-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/electrical/conduit-fill-calculator` | Mixed wire fill & raceway trade size |
| **21** | `/electrical/box-fill-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/electrical/box-fill-calculator` | NEC 314.16 cubic inch capacity |
| **22** | `/electrical/residential-load-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/electrical/residential-load-calculator` | NEC 220.82 service panel sizing |
| **23** | `/hvac/btu-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/hvac/btu-calculator` | Heating/cooling BTU & AC tonnage |
| **24** | `/hvac/duct-sizing-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/hvac/duct-sizing-calculator` | Round duct CFM & rectangular equiv |
| **25** | `/plumbing/dfu-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/plumbing/dfu-calculator` | Drainage fixture units & branch sizing |
| **26** | `/plumbing/wsfu-calculator` | Calculator | **YES** | **YES** | `https://itradehub.com/plumbing/wsfu-calculator` | Potable water supply fixture units |

---

## 3. Protocol & System Route Inventory

| Path | Type | Indexable | In Sitemap | Notes |
| :--- | :--- | :-: | :-: | :--- |
| `/sitemap.xml` | XML Feed | **YES** | NO (Self) | Protocol sitemap indexing the 26 canonical URLs |
| `/robots.txt` | Text Directives | **YES** | NO | Crawler indexing rules referencing sitemap.xml |
| `/_not-found` | HTTP 404 Page | **NO** | NO | Fallback error boundary for dead URLs |
