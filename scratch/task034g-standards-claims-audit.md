# Task 034G: Standards Claims & Engineering Terminology Audit

**Document Version**: 1.0  
**Objective**: Establish precise technical terminology that transparently distinguishes between direct table implementations, simplified engineering estimations, and full prescriptive procedures—without claiming stamped certification or full code compliance.

---

## 1. Classification Categories

Every technical calculation on the platform is classified under one of four explicit implementation tiers:

- **Tier A (Direct Published Table / Value)**: Uses standardized values directly transcribed from published code schedules (e.g., NEC conductor cross-sectional areas, IPC drainage fixture unit values).
- **Tier B (Simplified Engineering Estimation)**: Uses fundamental thermodynamic, geometric, or empirical formulas inspired by industry guidelines for preliminary sizing (e.g., square-footage BTU cooling multipliers, equal friction duct airflow sizing).
- **Tier C (Specific Prescriptive Rule)**: Implements explicit dimensional thresholds established in residential codes (e.g., IRC maximum 7-3/4″ stair riser, IRC minimum 10″ tread depth, NEC 40% raceway fill limit).
- **Tier D (Full Code Compliance / Stamped Certification)**: **STRICTLY PROHIBITED**. The platform does not claim stamped architectural, structural, or mechanical compliance.

---

## 2. Standards Audit & Wording Classification

| Standard Body | Code Edition Reference | Implemented Tables / Procedures | Classification Tier | Approved UI Phrasing | Prohibited Phrasing |
| :--- | :---: | :--- | :---: | :--- | :--- |
| **National Electrical Code (NEC)** | **NEC 2023** | • Table 310.16 (Ampacity)<br>• Chapter 9 Tables 1, 4, 5 (Raceway Area & 40% Fill)<br>• Section 314.16 (Box Volume Allowances)<br>• Article 220.82 (Optional Residential Load Calculation) | **Tier A & C** | "Reference: NEC 2023, Table 310.16"<br>"Based on published values in NEC Chapter 9 Table 1" | "NEC 2023 compliant"<br>"Certified safe wire sizing"<br>"Permit-approved calculation" |
| **International Residential Code (IRC)** | **IRC 2024** | • Section R311.7 (Max 7-3/4″ Riser, Min 10″ Tread, 80″ Headroom)<br>• Table R507.6 (Prescriptive Joist Spans by Species & Spacing)<br>• Section R802 (Rafter Geometry) | **Tier C** | "Reference: IRC 2024, Section R311.7"<br>"Based on prescriptive IRC span schedules" | "IRC code-compliant stair design"<br>"Architecturally certified deck" |
| **International Plumbing Code (IPC)** | **IPC 2024** | • Table 709.1 (Drainage Fixture Units)<br>• Table 710.1(1) & (2) (Drain Pipe Capacities by Slope)<br>• Table E103.3(2) (Water Supply Fixture Units) | **Tier A** | "Reference: IPC 2024, Table 709.1"<br>"Based on published IPC fixture schedules" | "IPC approved plumbing layout"<br>"Certified drainage design" |
| **Uniform Plumbing Code (UPC)** | **UPC 2024** | • Table 702.1 (Drainage Unit Assignments)<br>• Table 703.2 (Maximum DFU Loads)<br>• Table 610.3 (WSFU Values & Hunter's Curve Flow) | **Tier A** | "Reference: UPC 2024, Table 702.1"<br>"Based on published UPC fixture schedules" | "UPC compliant pipe sizing" |
| **ACCA (Air Conditioning Contractors of America)** | **Manual J & Manual D Principles** | • Climate Zone sensible/latent heat multipliers<br>• Huebscher formula for round-to-rectangular equivalent duct dimensions<br>• Equal friction airflow rate schedules | **Tier B** | "Preliminary estimate based on selected inputs and published design principles."<br>"Based on simplified ACCA Manual J/D reference principles." | "Full ACCA Manual J load calculation"<br>"Certified Manual D duct layout"<br>"Code-approved HVAC sizing" |

---

## 3. HVAC Manual J & Manual D Specific Clarification

A full ACCA Manual J calculation requires exhaustive room-by-room architectural modeling (fenestration solar heat gain coefficients, insulation R-values, blower door ACH50 infiltration rates, internal equipment loads).

The platform's HVAC calculators are transparently presented as:
> *"Preliminary estimate based on selected inputs and published design principles. For permit submissions and complete equipment specification, room-by-room ACCA Manual J & Manual D calculations should be performed by a licensed HVAC professional."*

Ordinary mathematical formulas (e.g. $\text{Volume} = \text{Length} \times \text{Width} \times \text{Depth}$, $\text{Area} = \pi r^2$, $\text{Ohm's Law } V = IR$) remain exact mathematical formulations.
