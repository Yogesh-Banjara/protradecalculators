# Keyword Cannibalization Prevention & Canonical Architecture Report

**Audit Date**: 2026-09-03  
**Platform**: Construction & Trade Tools (`adventurous-shannon`)  
**Objective**: Establish a strict canonical keyword architecture that prevents duplicate/near-duplicate doorway pages, avoids internal keyword competition, and consolidates topical authority onto high-value primary URLs.

---

## 1. Executive Principles: Why Fewer, Authoritative Pages Win

Under modern search engine quality guidelines (specifically Google Spam Policies regarding Doorway Pages and Scaled Content Abuse), creating multiple thin variations of a calculator (e.g., `concrete-yard-calculator`, `concrete-slab-calculator`, `concrete-volume-calculator`, `concrete-estimate-calculator`) leads to:
1. **Keyword Cannibalization**: Search engines split ranking signals across 4+ shallow URLs instead of ranking 1 comprehensive, authoritative tool.
2. **Poor User Experience**: Users find near-identical UI layouts with minor text differences.
3. **Thin Content & Indexing Drops**: Algorithmic de-indexing of doorway pages.

**Core Architectural Rule**:
> **One Primary Canonical URL per Distinct Technical Search Intent.**  
> Synonymous search queries, sub-features, and unit variants are captured within the primary tool's multi-mode workspace, comprehensive result schedules, and answer-first on-page guides.

---

## 2. Cluster-by-Cluster Cannibalization Audit & Decisions

### Cluster 1: Concrete & Masonry

| Synonymous / Related Keywords | Search Intent | Proposed Action | Canonical Destination | Architectural Rationale |
|---|---|:---:|---|---|
| `concrete calculator`<br>`concrete yard calculator`<br>`concrete slab calculator`<br>`concrete volume calculator`<br>`concrete estimate calculator`<br>`concrete quantity calculator`<br>`concrete material calculator` | Calculate ready-mix volume, bags, slab depth, and footing quantities | **CONSOLIDATE** onto 1 URL | `/construction/concrete-calculator` | The existing tool provides dedicated modes (`Slab / Rectangle`, `Footing / Trench`, `Round Pier / Column`) and displays results in cubic yards, cubic feet, and 40lb/60lb/80lb bags. Splitting into 7 pages would produce near-identical calculators. |
| `cement calculator` | Informal search for concrete OR specific cement powder ratio | **DO NOT TARGET YET** | None (Informational notice on concrete page) | Cement is a powder binding ingredient; concrete is the hardened composite of cement, sand, and gravel. Targeting "cement calculator" with a concrete yardage tool creates technical confusion. |
| `concrete mix calculator` | Batch mixing ratios (1:2:3 cement:sand:gravel) | **NEW TOOL OPPORTUNITY** (P2) | `/construction/concrete-mix-calculator` (Future) | Distinct mechanical intent from bulk ready-mix yardage. Justifies a separate tool only when dedicated mix ratio math is built. |

---

### Cluster 2: Framing, Lumber & Rafters

| Synonymous / Related Keywords | Search Intent | Proposed Action | Canonical Destination | Architectural Rationale |
|---|---|:---:|---|---|
| `framing calculator`<br>`stud calculator`<br>`wall stud calculator`<br>`lumber calculator`<br>`wall framing calculator`<br>`stud spacing calculator` | Wall framing stud counts (16″/24″ OC), top/bottom plates, headers, and dimensional board footage | **CONSOLIDATE** onto 1 URL | `/construction/framing-calculator` | All wall framing intents share identical geometric inputs (wall length, height, stud spacing, opening count). |
| `rafter calculator`<br>`rafter length calculator`<br>`roof rafter calculator`<br>`roof rafter length calculator`<br>`roof angle calculator`<br>`roof rise run calculator` | Common rafter line length, slope angles, birdsmouth seat cuts, and ridge deductions | **ROUTE TO ROOF INSTRUMENT** | `/construction/roof-pitch-calculator` | Rafter layout is fundamentally a roof pitch geometry problem. Creating a separate "rafter length calculator" competing with "roof pitch calculator" would severely cannibalize rankings. `/construction/roof-pitch-calculator` serves both seamlessly. |
| `board feet calculator` | Hardwood volume tally ($T \times W \times L / 12$) | **NEW TOOL OPPORTUNITY** (P2) | `/woodworking/board-feet-calculator` (Future) | While the framing tool outputs total framing board feet, woodworkers and hardwood buyers search for a multi-board tally tool with price-per-board-foot calculations. |

---

### Cluster 3: Roofing & Shingle Takeoffs

| Synonymous / Related Keywords | Search Intent | Proposed Action | Canonical Destination | Architectural Rationale |
|---|---|:---:|---|---|
| `roof pitch calculator`<br>`roofing calculator`<br>`roof area calculator`<br>`roof square calculator`<br>`roofing material calculator`<br>`shingle calculator`<br>`roof angle calculator`<br>`roof rise run calculator` | Pitch in rise/run, slope angles (degrees), common rafter lengths, sloped surface area, roofing squares, and shingle bundle counts | **CONSOLIDATE** onto 1 URL | `/construction/roof-pitch-calculator` | The newly transformed geometric layout instrument directly computes pitch angles, rafter geometry, sloped square footage, roofing squares ($100\text{ sq ft}$), shingle bundles (3/sq), underlayment rolls, and drip edge pieces simultaneously. |

---

### Cluster 4: Electrical & Conduit

| Synonymous / Related Keywords | Search Intent | Proposed Action | Canonical Destination | Architectural Rationale |
|---|---|:---:|---|---|
| `voltage drop calculator`<br>`wire size calculator`<br>`wire ampacity calculator` | Voltage drop percentage, recommended AWG wire gauge, copper vs aluminum ampacity per NEC 310.16 | **CONSOLIDATE** onto 1 URL | `/electrical/voltage-drop-calculator` | Sizing a wire for long runs requires checking BOTH ampacity (thermal limit) and voltage drop (<3%). Housing both on the same tool provides complete technical utility. |
| `conduit fill calculator`<br>`conduit fill calculator electrical` | Trade conduit sizing for mixed wire bundles per NEC Chapter 9 | **CONSOLIDATE** onto 1 URL | `/electrical/conduit-fill-calculator` | "electrical" is simply an unnecessary keyword modifier. Single canonical URL prevents duplicate content. |
| `box fill calculator`<br>`electrical box fill calculator` | Cubic inch volume allowances per NEC 314.16 | **CONSOLIDATE** onto 1 URL | `/electrical/box-fill-calculator` | Pure synonymous keyword variation. One authoritative URL. |
| `electrical load calculator`<br>`residential electrical load calculator` | Dwelling service panel sizing (100A to 400A) per NEC Article 220 | **CONSOLIDATE** onto 1 URL | `/electrical/residential-load-calculator` | Broad keyword "electrical load calculator" is dominated by residential service sizing intent. Consolidate on the comprehensive NEC 220 tool. |

---

### Cluster 5: HVAC & Mechanical

| Synonymous / Related Keywords | Search Intent | Proposed Action | Canonical Destination | Architectural Rationale |
|---|---|:---:|---|---|
| `btu calculator`<br>`hvac btu calculator`<br>`air conditioner sizing calculator`<br>`ac sizing calculator` | Heating and cooling load in BTU/hr and recommended AC tonnage (1.5 to 5 tons) | **CONSOLIDATE** onto 1 URL | `/hvac/btu-calculator` | Sizing cooling capacity in tons ($1\text{ ton} = 12,000\text{ BTU/hr}$) and heating capacity in BTU/hr are identical engineering calculations. |
| `duct sizing calculator`<br>`hvac duct calculator`<br>`ductwork calculator`<br>`airflow calculator` | Round duct diameter, rectangular Huebscher equivalent, friction loss, and air velocity (FPM) | **CONSOLIDATE** onto 1 URL | `/hvac/duct-sizing-calculator` | All air distribution calculations stem from CFM airflow and target friction rate ($Q = V \times A$). |
| `hvac calculator` | Broad search for HVAC calculations | **HUB TARGET** | `/categories/hvac` | Broad umbrella query best served by the HVAC Category Suite routing users to BTU or Duct tools. |
| `cfm calculator` | Room air changes per hour (ACH) or ventilation airflow | **NEW TOOL OPPORTUNITY** (P2) | `/hvac/cfm-calculator` (Future) | Sizing room CFM by volume and required air changes ($V \times \text{ACH} / 60$) has distinct utility from duct friction sizing. |

---

## 3. Cannibalization Prevention Action Plan

1. **Title & Meta Tag Hygiene**:
   - Ensure each calculator page has a distinct title formula that clearly states the primary keyword and secondary co-targets (e.g. `Roof Pitch & Rafter Calculator - Length, Angles & Squares`).
2. **Avoid Near-Duplicate URL Routes**:
   - Do not create `/construction/rafter-calculator` while `/construction/roof-pitch-calculator` exists.
   - Do not create `/electrical/wire-size-calculator` while `/electrical/voltage-drop-calculator` exists.
3. **Internal Linking Precision**:
   - Anchor texts in cross-links must point strictly to the canonical destination without mixing terminology across similar pages.
