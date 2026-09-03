# Task 034F: Platform Internal Link Graph Audit

**Document Version**: 1.0  
**Audit Scope**: Complete 15-Calculator Internal Linking & Discoverability Matrix

---

## 1. Executive Summary & Graph Health

- **Total Orphan Pages**: **0** (All 15 calculators possess minimum 4 distinct inbound pathways).
- **Navigation Tiers**:
  1. `Tier 1`: Homepage Quick-Task Jump Links, Demonstrations, and Discipline Suite Hubs.
  2. `Tier 2`: Global Header (`Trade Suites` dropdown, `⌘K` Quick Search, `All 15 Tools →`).
  3. `Tier 3`: Tools Directory (`/tools`) with category filter chips and keyword search.
  4. `Tier 4`: Trade Suite Category Hubs (`/categories/[category]`).
  5. `Tier 5`: Direct contextual cross-links between complementary tools with descriptive anchor text.

---

## 2. Calculator Link Graph Matrix

| Calculator Route | Parent Suite Link (Breadcrumb) | Inbound From Suite Hub | Contextual Related Links (Outbound) | Methodology Anchor Links | Homepage Discoverable | Tools Directory Discoverable | Orphan Status |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: | :---: |
| `/construction/concrete-calculator` | `/categories/construction` | YES | Gravel, Deck, Stairs | "How to Calculate Concrete Volume" | YES | YES | **HEALTHY** |
| `/construction/framing-calculator` | `/categories/construction` | YES | Drywall, Deck, Concrete | "Wall Stud Spacing & Lumber Math" | YES | YES | **HEALTHY** |
| `/construction/stair-calculator` | `/categories/construction` | YES | Deck, Framing, Concrete | "Stair Stringer Cut Layout & Drop" | YES | YES | **HEALTHY** |
| `/construction/deck-calculator` | `/categories/construction` | YES | Concrete, Framing, Stairs | "Deck Boards & Joist Span Rules" | YES | YES | **HEALTHY** |
| `/construction/roof-pitch-calculator` | `/categories/construction` | YES | Framing, Stairs | "Rafter Length & Pitch Geometry" | YES | YES | **HEALTHY** |
| `/materials/gravel-calculator` | `/categories/materials` | YES | Concrete, Deck | "Aggregate Tonnage & Compaction" | YES | YES | **HEALTHY** |
| `/materials/drywall-calculator` | `/categories/materials` | YES | Framing, Gravel | "Sheetrock & Mud Estimating" | YES | YES | **HEALTHY** |
| `/electrical/voltage-drop-calculator` | `/electrical/conduit-fill-calculator` | YES | Conduit Fill, Residential Load | "NEC Wire Sizing & 3% Limit" | YES | YES | **HEALTHY** |
| `/electrical/conduit-fill-calculator` | `/categories/electrical` | YES | Voltage Drop, Box Fill | "NEC Chapter 9 Table 1 40% Fill" | YES | YES | **HEALTHY** |
| `/electrical/box-fill-calculator` | `/categories/electrical` | YES | Conduit Fill, Residential Load | "NEC 314.16 Volume Allowances" | YES | YES | **HEALTHY** |
| `/electrical/residential-load-calculator`| `/categories/electrical` | YES | Voltage Drop, Conduit Fill | "NEC 220.82 Standard Method" | YES | YES | **HEALTHY** |
| `/hvac/btu-calculator` | `/categories/hvac` | YES | Duct Sizing | "Manual J Heat Gain/Loss" | YES | YES | **HEALTHY** |
| `/hvac/duct-sizing-calculator` | `/categories/hvac` | YES | HVAC BTU | "Equal Friction Duct Method" | YES | YES | **HEALTHY** |
| `/plumbing/dfu-calculator` | `/categories/plumbing` | YES | WSFU | "IPC/UPC Drainage Fixture Units" | YES | YES | **HEALTHY** |
| `/plumbing/wsfu-calculator` | `/categories/plumbing` | YES | DFU | "Hunter's Curve Peak Demand GPM" | YES | YES | **HEALTHY** |

---

## 3. Contextual Anchor Text Standardization

All cross-tool links avoid generic filler ("Click here", "Related tool") in favor of descriptive task-oriented anchors:
- `Calculate gravel volume for the subgrade base`
- `Verify conduit fill for upsized conductors`
- `Estimate wall framing studs and plate lumber`
- `Calculate water supply fixture unit (WSFU) demand`
- `Size 2x12 stair stringer cuts for deck steps`
- `Calculate residential service entrance panel load`
