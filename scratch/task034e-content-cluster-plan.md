# Task 034E: Content Architecture & Topical Cluster Plan

**Document Version**: 1.0  
**Strategic Purpose**: Map high-value trade content clusters to support organic authority and high-engagement calculation workflows without mass-producing thin programmatic SEO pages.

---

## 1. Existing Content & Methodology Inventory

Every calculator page currently contains an integrated, on-page, long-form technical methodology section:
- **Calculation Formula & Mathematical Derivation**: Transparent physical equations (e.g. $V = \frac{L \times W \times D}{27}$, Single-phase $V_d = \frac{2KIL}{CM}$, Hunter's curve demand conversions).
- **Prescriptive Reference Tables**: Standard published schedules (IRC R507/R311, NEC Chapter 9 Tables 1/4/5, IPC/UPC Chapter 7 & 6 tables).
- **Step-by-Step Measurement Guides**: Practical jobsite guides embedded via Schema.org `HowTo` structured data.
- **Frequently Asked Questions (FAQ)**: 4 to 8 high-intent user queries per calculator backed by Schema.org `FAQPage` structured data.

---

## 2. Topical Cluster Architecture Model

Rather than creating hundreds of low-quality programmatic pages, each trade suite will be anchored around a 4-Tier Hub & Spoke Cluster:

$$\text{Trade Suite Hub} \longleftrightarrow \text{Flagship Calculation Instrument} \longleftrightarrow \text{Technical Field Guide} \longleftrightarrow \text{Material Takeoff Checklist}$$

---

## 3. High-Value Priority Content Clusters (Recommended Roadmap)

### Cluster 1: Concrete & Structural Sub-Base
- **Core Calculator**: `/construction/concrete-calculator`
- **Supporting Tool**: `/materials/gravel-calculator`
- **High-Value Technical Guide Topics (Future)**:
  1. *Subgrade Preparation & Compacted Gravel Depth for Slabs*: Why 4 inches of compacted #57 stone prevents slab cracking and frost heave.
  2. *Ready-Mix Batch Ordering vs Bagged Concrete Break-Even Guide*: When does physical labor and cost justify ordering a ready-mix truck over mixing 80-lb bags by hand?
  3. *Rebar Grid Sizing (#3 vs #4 vs #5) and Chair Spacing*: Structural reinforcement guidelines for residential driveways and patio slabs.

### Cluster 2: Residential Framing & Deck Building
- **Core Calculators**: `/construction/deck-calculator` & `/construction/framing-calculator` & `/construction/stair-calculator`
- **High-Value Technical Guide Topics (Future)**:
  1. *IRC Table R507 Deck Joist and Beam Span Selection Guide*: How joist overhang cantilevers and wood species (Southern Pine vs Douglas Fir) alter allowable spans.
  2. *Stair Stringer Layout & Bottom Riser Drop Formula*: Compensating for finished floor thicknesses and tread depths to ensure uniform step heights.
  3. *Lumber Culling & Jobsite Waste Allowances*: Understanding standard 10% framing waste factors for twisted studs, crowning, and header trimmers.

### Cluster 3: Electrical Service & Long-Distance Feeders
- **Core Calculators**: `/electrical/voltage-drop-calculator` & `/electrical/conduit-fill-calculator` & `/electrical/residential-load-calculator`
- **High-Value Technical Guide Topics (Future)**:
  1. *Subpanel Feeder Sizing (100A / 150A / 200A) Over Distance*: Sizing conductors for outbuildings, detached garages, and shops while maintaining $<3\%$ voltage drop.
  2. *NEC 40% Raceway Fill vs 60% Nipple Exemptions*: Understanding NEC Chapter 9 Table 1 limits and conductor jamming ratios during wire pulls.
  3. *EV Charger & Heat Pump Residential Load Calculations (NEC 220.82)*: Determining whether an existing 100A or 150A panel requires a 200A/400A service upgrade.

### Cluster 4: Potable Water & Sanitary DWV Hydraulics
- **Core Calculators**: `/plumbing/dfu-calculator` & `/plumbing/wsfu-calculator`
- **High-Value Technical Guide Topics (Future)**:
  1. *IPC vs UPC Sanitary Drain Sizing & Fall Gradients*: Why 1/4″ per foot slope provides self-scouring velocity and prevents solids settling.
  2. *Hunter’s Curve & Peak Water Supply Demand (WSFU $\to$ GPM)*: Sizing water service main lines and meters for multi-bathroom additions.

---

## 4. Prioritization Matrix for Content Creation

| Priority | Cluster | Proposed Title | Primary Search Intent | Commercial Value |
| :-: | :--- | :--- | :--- | :-: |
| **1** | Electrical | *Subpanel Wire Sizing Guide for 100A/150A/200A Feeders* | `wire size for 100 amp subpanel 150 feet away` | **HIGH** |
| **2** | Construction | *Deck Joist & Beam Span Guide (IRC Table R507)* | `deck joist span table 2x8 2x10` | **HIGH** |
| **3** | Construction | *Ready-Mix Concrete vs Bagged Concrete Cost & Yardage* | `how many bags of concrete in a yard cost comparison` | **HIGH** |
| **4** | Electrical | *EV Charger Home Electrical Load Calculation Guide* | `do i need 200 amp service for ev charger` | **HIGH** |
| **5** | Construction | *Stair Stringer Math: Riser, Tread, and Bottom Drop* | `how to calculate stair stringer cuts` | **HIGH** |

*Note: No thin or placeholder pages will be generated in this task. Content guides will be introduced alongside dedicated calculation instruments in future milestones.*
