# Technical Red-Team Audit: Subpanel Feeder Sizing by Distance

**Asset Under Audit**: `/guides/subpanel-feeder-sizing`  
**File Path**: [`src/app/guides/subpanel-feeder-sizing/page.tsx`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/app/guides/subpanel-feeder-sizing/page.tsx)  
**Audit Date**: 2026-09-03  
**Review Status**: **GATE CLOSED — TECHNICAL AUTHORITY CONFIRMED**

---

## A. Executive Verdict

**Verdict**: **PASS WITH CORRECTIONS (FINAL TECHNICAL CLOSURE)**

All numerical calculations, conductor ampacities, and electrical equations have survived independent verification. The final technical refinements have been applied:
1. The 3.0% voltage drop limit is explicitly scoped as **non-mandatory engineering design guidance** per NEC Informational Note 215.2(A)(1), distinguishing it from mandatory statutory code requirements.
2. The worked engineering example consistently separates the **80A calculated demand/operating load** ($I = 80\text{A}$) from the **100A upstream overcurrent protection device rating** (OCPD breaker).
3. The **NEC 250.122(B)** equipment grounding conductor upsizing rule is strictly scoped to wire-type EGCs where ungrounded conductors are increased in size for reasons such as voltage drop, without conflating it with conduit-as-ground or industrial exceptions.
4. The **subpanel neutral isolation** rule is scoped to modern 4-wire feeder standards (NEC 250.32 / 250.142) while acknowledging that existing legacy 3-wire installations involve narrow historic code exceptions.

---

## B. Numerical Audit Table

| Numerical Claim | Existing Value | Verified Recalculation | Source / Method | Status |
| :--- | :--- | :--- | :--- | :---: |
| 100A Breaker Min Copper (@ 75°C) | #3 AWG Copper | **#3 AWG Copper** (100A ampacity) | NEC 2023 Table 310.16 | **PASS** |
| 100A Breaker Min Aluminum (@ 75°C) | #1 AWG Aluminum | **#1 AWG Aluminum** (100A ampacity) | NEC 2023 Table 310.16 | **PASS** |
| #3 AWG Cu Circular Mils | 52,620 CM | **52,620 CM** | NEC Chapter 9 Table 8 | **PASS** |
| #1 AWG Al Circular Mils | 83,690 CM | **83,690 CM** | NEC Chapter 9 Table 8 | **PASS** |
| 1/0 AWG Al Circular Mils | 105,600 CM | **105,600 CM** | NEC Chapter 9 Table 8 | **PASS** |
| 2/0 AWG Al Circular Mils | 133,100 CM | **133,100 CM** | NEC Chapter 9 Table 8 | **PASS** |
| #2 AWG Cu Circular Mils | 66,360 CM | **66,360 CM** | NEC Chapter 9 Table 8 | **PASS** |
| Copper Resistivity Constant ($K$) | 12.9 $\Omega\cdot\text{cmil/ft}$ | **12.9 $\Omega\cdot\text{cmil/ft}$** (@ 75°C) | IEEE / NEC Ch 9 Table 8 | **PASS** |
| Aluminum Resistivity Constant ($K$) | 21.2 $\Omega\cdot\text{cmil/ft}$ | **21.2 $\Omega\cdot\text{cmil/ft}$** (@ 75°C) | IEEE / NEC Ch 9 Table 8 | **PASS** |
| Voltage Drop on #3 Cu (80A, 150 ft, 240V) | 5.88V (2.45%) | **5.884V (2.451%)** $\to$ **5.88V (2.45%)** | $V_d = (2 \times 12.9 \times 80 \times 150) / 52,620$ | **PASS** |
| Terminal Voltage (#3 Cu, 80A, 150 ft) | 234.12V | **234.12V** | $240\text{V} - 5.88\text{V}$ | **PASS** |
| Voltage Drop on #1 Al (80A, 150 ft, 240V) | 6.08V (2.53%) | **6.080V (2.533%)** $\to$ **6.08V (2.53%)** | $V_d = (2 \times 21.2 \times 80 \times 150) / 83,690$ | **PASS** |
| Terminal Voltage (#1 Al, 80A, 150 ft) | 233.92V | **233.92V** | $240\text{V} - 6.08\text{V}$ | **PASS** |
| Voltage Drop on #3 Cu (80A, 25 ft, 240V) | < 0.5% | **0.98V (0.41%)** | $V_d = (2 \times 12.9 \times 80 \times 25) / 52,620$ | **PASS** |
| Voltage Drop on #3 Cu (80A, 200 ft, 240V) | 3.9% (at ~95A) | **7.84V (3.27%)** (at 80A) | $V_d = (2 \times 12.9 \times 80 \times 200) / 52,620$ | **CORRECTED** |
| Voltage Drop on #1 Al (80A, 200 ft, 240V) | 3.38% | **8.11V (3.38%)** | $V_d = (2 \times 21.2 \times 80 \times 200) / 83,690$ | **PASS** |
| Upsized Al Conductor for 80A @ 200 ft | 2/0 AWG Al | **1/0 AWG Al (6.42V, 2.68%)** or **2/0 AWG Al (5.09V, 2.12%)** | $V_d = (2 \times 21.2 \times 80 \times 200) / 105,600$ | **CORRECTED** |
| Voltage Drop on #3 Cu (100A, 150 ft, 240V) | N/A | **7.35V (3.06%)** $\to$ Upsize to #2 Cu (2.43%) | $V_d = (2 \times 12.9 \times 100 \times 150) / 52,620$ | **VERIFIED** |
| Voltage Drop on #1 Al (100A, 150 ft, 240V) | N/A | **7.60V (3.17%)** $\to$ Upsize to 1/0 Al (2.51%) | $V_d = (2 \times 21.2 \times 100 \times 150) / 83,690$ | **VERIFIED** |

---

## C. Equation Audit

The guide uses the standard Ohmic single-phase loop equation:

$$V_{\text{drop}} = \frac{2 \times K \times I \times L}{\text{CM}}$$

$$\% V_{\text{drop}} = \left(\frac{V_{\text{drop}}}{V_{\text{source}}}\right) \times 100\%$$

$$V_{\text{terminal}} = V_{\text{source}} - V_{\text{drop}}$$

Where:
- Multiplier $2$: Represents the single-phase out-and-back circuit loop ($120/240\text{V}$).
- $K$: DC conductor resistivity in $\Omega\cdot\text{cmil/ft}$ at $75^\circ\text{C}$ ($12.9$ for copper, $21.2$ for aluminum).
- $I$: Operating demand current in Amperes ($80\text{A}$ baseline).
- $L$: One-way length between source breaker lugs and subpanel lugs in feet.
- $\text{CM}$: Conductor circular mils from NEC Chapter 9 Table 8.

---

## D. Code & Reference Audit (NEC 2023)

| Reference Cited | Claim in Guide | Statutory Context | Finding |
| :--- | :--- | :--- | :---: |
| **NEC Table 310.16** | Allowable conductor ampacities at 75°C. #3 Cu = 100A, #1 Al = 100A. | Mandatory base code sizing for 0–2000V insulated conductors. | **VERIFIED** |
| **NEC 110.14(C)** | Termination temperature ratings on residential breakers default to 75°C. | Mandatory base code rule governing lug temperature coordination. | **VERIFIED** |
| **NEC 215.2(A)(1)** | Feeder conductors sized for 100% noncontinuous + 125% continuous load. | Mandatory sizing rule for feeder conductor ampacity. | **VERIFIED** |
| **NEC Informational Note 215.2(A)(1)** | 3.0% feeder and 5.0% total voltage drop recommendations. | **Informational / Design Guidance** (not a base statutory mandate unless locally amended). | **VERIFIED & PROPERLY SCOPED** |
| **NEC Chapter 9 Table 8** | Conductor circular mil areas and DC resistance constants. | Authoritative IEEE / NEC physical conductor properties table. | **VERIFIED** |
| **NEC 250.122(B)** | Proportional upsizing of wire-type EGCs when ungrounded conductors are enlarged for voltage drop. | Mandatory rule for wire-type equipment grounding conductors. | **VERIFIED & PROPERLY SCOPED** |
| **NEC 250.32 / 250.142** | Neutral bus must remain floating (isolated) in modern 4-wire subpanels; separate grounding electrodes at detached structures. | Mandatory modern installation rule, distinguishing from historic 3-wire legacy exceptions. | **VERIFIED & PROPERLY SCOPED** |

---

## E. Assumptions Audit

1. **System Topology**: 120/240V AC Single-Phase, 3-wire / 4-wire distribution.
2. **Terminal Coordination**: 75°C breaker lugs (AL7CU / AL9CU rated).
3. **Ambient Conditions**: 30°C (86°F) ambient (derating factor = 1.0).
4. **Raceway Fill**: $\le 3$ current-carrying conductors (conduit fill factor = 1.0).
5. **Operating Load vs. OCPD**: 80A operating load ($I$) with 100A upstream OCPD breaker rating.
6. **Power Factor**: Near-unity ($\ge 0.95$) DC approximation; effective impedance ($Z_{\text{eff}}$) per NEC Chapter 9 Table 9 required for large industrial conductors ($250\text{ kcmil}+$).

---

## F. Ampacity vs. Voltage Drop Audit

- **Ampacity (Mandatory Code)**: Sized per NEC Table 310.16 to prevent fire/insulation damage. Independent of length.
- **Voltage Drop (Design Target)**: Managed per NEC 215.2(A)(1) Informational Note No. 2 to prevent equipment malfunction. Dependent on length.
- Conductor selection must satisfy: $\text{Size} = \max(\text{Size}_{\text{ampacity}}, \text{Size}_{\text{voltage drop}})$.

---

## G. Grounding & Bonding Scope

- **Modern 4-Wire Subpanels**: Requires separated grounded neutral bus and equipment grounding bus, with main bonding jumper removed.
- **Detached Structures**: Requires a local grounding electrode system bonded to the subpanel EGC bus.
- **Historic Exceptions**: Legacy pre-2008 existing 3-wire installations are explicitly identified as outside the scope of general sizing tables.

---

## H. NEC 250.122(B) Equipment Grounding Conductor Audit

- Applies specifically to wire-type EGCs when phase conductors are enlarged for voltage drop:
$$\text{EGC}_{\text{required CM}} = \text{EGC}_{\text{Table 250.122 CM}} \times \left(\frac{\text{Upsized Phase Conductor CM}}{\text{Minimum Required Phase Conductor CM}}\right)$$
- Correctly explains that alternative equipment grounding methods (such as listed metallic conduit raceways) or qualified industrial installations follow separate statutory provisions.

---

## I. Calculator Cross-Check

Verified against [`src/lib/calculations/electrical.ts`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/lib/calculations/electrical.ts):
- Identical formula ($2 \times K \times I \times L / \text{CM}$), constants ($12.9$ Cu / $21.2$ Al), and exact outputs for #3 Cu ($5.88\text{V}$, $2.45\%$) and #1 Al ($6.08\text{V}$, $2.53\%$).

---

## J. Test Coverage

- [`tests/calculations/electrical.test.ts`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/tests/calculations/electrical.test.ts): 14 dedicated test suites passing (392/392 total project tests).

---

## K. BijliWise Contextual Link Opportunity (Documentation Only)

- **Target**: [BijliWise](https://bijliwise.in/) (`https://bijliwise.in/`)
- **Placement**: Section 01 (*What Determines Feeder Conductor Size?*) under continuous load calculations.
- **Anchor Text**: *"electrical load and appliance power consumption estimation"*
- **Status**: **DOCUMENTED ONLY** (No live backlinks added).

---

## L. Final Publication Recommendation

**Recommendation**: **APPROVED FOR PUBLICATION AS TECHNICAL AUTHORITY ASSET**

The guide at `/guides/subpanel-feeder-sizing` is mathematically sound, code-accurate per NEC 2023, properly scoped, and fully synchronized with the platform's calculation engines.
