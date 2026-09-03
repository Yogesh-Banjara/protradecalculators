# Task 034G: Content Implementation Priority & Reference Roadmap

**Document Version**: 1.0  
**Strategic Principle**: Prioritize high-utility, jobsite-relevant technical references and decision guides. Strictly reject thin, keyword-variant programmatic articles.

---

## 1. Prioritized Roadmap Matrix

| Priority | Technical Topic / Guide | Parent Calculator | Format Decision (Own URL vs On-Page Methodology) | User Problem Solved | Inbound Links | Outbound Links |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **P1** | **Subpanel Feeder Conductor Sizing Reference (100A, 150A, 200A by Distance)** | `/electrical/voltage-drop-calculator` | **Dedicated Reference URL** (`/guides/subpanel-feeder-sizing`) | Selecting between copper and aluminum AWG/kcmil wire gauges for detached garages, barns, and workshops over 100+ ft runs. | • Voltage Drop Calc<br>• Res. Load Calc<br>• Electrical Hub | • Conduit Fill Calc<br>• Voltage Drop Calc |
| **P1** | **IRC Table R507 Prescriptive Deck Beam & Joist Span Reference** | `/construction/deck-calculator` | **On-Page Calculator Methodology Section** | Understanding joist cantilever limits and multi-ply beam spans across lumber species (Southern Pine vs SPF vs Cedar). | • Deck Calc<br>• Framing Calc | • Deck Calc<br>• Stair Calc |
| **P1** | **IPC vs UPC Drain Pipe Sizing: Maximum DFU Schedules by Slope** | `/plumbing/dfu-calculator` | **On-Page Calculator Methodology Section** | Determining when a 3″ horizontal branch can carry 3 or more toilets vs requiring a 4″ building drain. | • DFU Calc<br>• WSFU Calc | • DFU Calc<br>• WSFU Calc |
| **P2** | **Ready-Mix Truck Delivery vs Bagged Concrete Hand-Mixing (Cost & Labor Break-Even)** | `/construction/concrete-calculator` | **On-Page Calculator Methodology Section** | Deciding whether a 1.5 yd³ pour justifies ready-mix short-load truck fees vs hand-mixing 68 80-lb bags. | • Concrete Calc<br>• Gravel Calc | • Concrete Calc<br>• Gravel Calc |
| **P2** | **Home EV Charger Electrical Load Calculation (NEC 220.82)** | `/electrical/residential-load-calculator` | **Dedicated Reference URL** (`/guides/ev-charger-panel-sizing`) | Calculating remaining service panel ampacity before adding a 48A or 80A Level 2 EV charging station. | • Res. Load Calc<br>• Electrical Hub | • Voltage Drop Calc<br>• Res. Load Calc |
| **P2** | **Stair Stringer Layout & Framing Square Gauge Setup Guide** | `/construction/stair-calculator` | **On-Page Calculator Methodology Section** | Step-by-step layout of 2x12 stringer sawtooth cuts, bottom riser tread thickness deduction, and top landing drop. | • Stair Calc<br>• Deck Calc | • Stair Calc<br>• Deck Calc |
| **P3** | **Wall Framing: 2x4 vs 2x6 Exterior Wall Insulation & Structural Spans** | `/construction/framing-calculator` | **On-Page Calculator Methodology Section** | Choosing between 2x4 @ 16″ OC and 2x6 @ 24″ OC for exterior wall framing cavity depth (R-20 insulation). | • Framing Calc<br>• Drywall Calc | • Drywall Calc<br>• Framing Calc |
| **P3** | **Equal Friction Duct Design vs Velocity Reduction Method** | `/hvac/duct-sizing-calculator` | **On-Page Calculator Methodology Section** | Comparing 0.08 vs 0.10 in. wg/100 ft static friction loss rates across residential trunk and branch lines. | • Duct Sizing Calc<br>• HVAC Hub | • HVAC BTU Calc<br>• Duct Sizing Calc |

---

## 2. Content Quality & Architectural Guidelines

1. **Preference for On-Page Methodology**: Wherever possible, rich technical documentation is embedded directly into the calculator workspace under collapsible methodology panels. This maximizes on-page dwell time and provides instant context without forcing user navigation.
2. **Dedicated URLs for Deep Multi-Step Guides Only**: Only complex, multi-table topics that require comprehensive walkthroughs (such as Subpanel Feeder Sizing and EV Charger Panel Upgrades) warrant standalone URLs.
3. **Rejection of Pure Keyword Variants**: Queries like *"how much concrete for 10x10 slab"* or *"how many 60lb bags in a yard"* are handled by the core interactive calculator inputs, not by churning out dozens of thin programmatic sub-pages.
