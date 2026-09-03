# Task 034H: Subpanel Feeder Guide Technical & Authority Audit

**Document Version**: 1.0  
**Target Route**: `/guides/subpanel-feeder-sizing`  
**Guide Title**: Subpanel Feeder Conductor Sizing by Distance

---

## 1. Technical Sources & Standard References Used

The technical content on this page is directly calibrated to published national electrical engineering tables and principles:
1. **NEC 2023 Table 310.16**: Allowable conductor ampacities for copper and aluminum conductors rated 0–2000V at 60°C, 75°C, and 90°C.
2. **NEC 2023 Article 110.14(C)**: Terminal temperature limitation rules (requiring sizing against the 75°C column for standard residential breaker and panelboard lugs).
3. **NEC 2023 Article 215.2(A)(1)(a)**: Feeder conductor sizing rules requiring 125% ampacity multiplier for continuous loads + 100% of non-continuous loads.
4. **NEC 2023 Informational Note 215.2(A)(1) & 210.19(A)**: Recommendations to limit voltage drop to 3.0% on feeders and 5.0% total on combined feeder and branch circuits.
5. **NEC Chapter 9 Table 8**: Conductor direct-current resistance ($\Omega / \text{kFT}$) and circular mil ($CM$) cross-sectional area constants.
6. **Ohm's Law Single-Phase Distance Resistance Formula**:
   $$V_{\text{drop}} = \frac{2 \times K \times I \times L}{CM}$$
   Where $K = 12.9\,\Omega\cdot\text{cmil/ft}$ for Copper, $K = 21.2\,\Omega\cdot\text{cmil/ft}$ for Aluminum.

---

## 2. Technical Assumptions

1. **Standard System Voltage**: Assumes nominal 120/240V split-phase 3-wire with separate insulated neutral and equipment grounding conductor (4-wire feeder system to detached or interior subpanels per NEC 250.32).
2. **Terminal Ratings**: Assumes standard 75°C rated lugs and circuit breaker terminations.
3. **Ambient Temperature & Conductor Bundling**: Assumes standard ambient temperature ($30^\circ\text{C} / 86^\circ\text{F}$) and not more than 3 current-carrying conductors in raceway. (Attic runs or high ambient conditions require additional ampacity correction factors per NEC Table 310.15(B)(1)).
4. **Power Factor**: Assumes unity power factor ($1.0$) for direct-current and single-phase resistive/inductive balance approximation.

---

## 3. Explicit Claims Made

- Explains that thermal ampacity and distance voltage drop are two distinct, independent engineering requirements.
- Explains why conductor gauge must be upsized on longer runs (typically exceeding 75–100 ft) to avoid exceeding 3% voltage drop.
- Outlines the physical differences, cost considerations, and trade size implications between copper and AA-8000 series aluminum conductors.
- Provides a step-by-step worked example of a 100A feeder at 150 feet demonstrating mathematical formulas and resulting percentages.

---

## 4. Claims Intentionally Avoided

- **NO Stamped Engineering Certification**: Transparently states that calculations are mathematical models for preliminary estimation.
- **NO Guaranteed Permit Approval**: Avoids claiming any wire size is "code guaranteed" or "permit ready".
- **NO Unsupported Wire Gauges**: Sizing guidance adheres strictly to NEC Table 310.16 and standard circular mil resistance equations.

---

## 5. Bidirectional Internal Links

1. **Inbound Links to Guide**:
   - `/electrical/voltage-drop-calculator` (Prominent Technical Guide Card in Section 8)
   - `/tools` (Directory index listing)
   - `sitemap.xml` (Canonical priority feed)
2. **Outbound Links from Guide**:
   - `/electrical/voltage-drop-calculator` ("Open Voltage Drop Calculator")
   - `/electrical/residential-load-calculator` ("Residential Service Load Calculator")
   - `/electrical/conduit-fill-calculator` ("Electrical Conduit Fill Calculator")

---

## 6. Structured Data & Metadata Verification

- **Metadata**:
  - `Title`: `Subpanel Feeder Conductor Sizing by Distance | Electrical Guide`
  - `Description`: Focused technical description without keyword stuffing.
  - `Canonical URL`: Derived dynamically via `getCanonicalUrl("/guides/subpanel-feeder-sizing")`.
- **JSON-LD Schema**:
  - `WebPage` schema with dynamic `BreadcrumbList` (`Home` $\to$ `Guides` $\to$ `Subpanel Feeder Sizing by Distance`).

---

## 7. Remaining Technical Boundaries

- Complex 3-phase industrial power factor phase angles ($0.85$ PF lagging) and harmonics from high non-linear variable frequency drive (VFD) loads are outside the scope of this residential/commercial single-phase feeder guide. Users with complex industrial loads are advised to consult registered electrical engineering professionals.
