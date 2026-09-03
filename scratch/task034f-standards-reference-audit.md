# Task 034F: Building Code & Engineering Standards Reference Audit

**Document Version**: 1.0  
**Audit Target**: Rigorous verification of all technical code references (NEC, IRC, IPC, UPC, ACCA) across calculators, schemas, and UI disclaimers to ensure 100% compliance with preliminary estimating trust standards.

---

## 1. Standards Inventory & Verification Matrix

| Standard / Body | Stated Edition in UI | Specific Tables / Formulas Implemented | Verification Status | Compliance Language Risk Level | Recommended Phrasing / Safe Boundary |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **National Electrical Code (NEC)** | **2023 Edition** | • Table 310.16 (Conductor Ampacities & Temp Ratings)<br>• Chapter 9 Table 1 (40% Raceway Fill Limits)<br>• Chapter 9 Tables 4 & 5 (Conductor & Conduit Areas)<br>• Section 314.16 (Box Fill Volume Allowances)<br>• Article 220.82 (Optional Residential Load Method)<br>• 210.19(A) / 215.2(A)(1) Informational Notes (3%/5% Voltage Drop) | **VERIFIED** | **LOW** | "Calibrated against published NEC 2023 Table values for preliminary planning. Local AHJ code adoptions take precedence." |
| **International Residential Code (IRC)** | **2024 Edition** | • Section R311.7 (Max 7-3/4″ Riser, Min 10″ Tread, 80″ Headroom)<br>• Table R507.6 (Prescriptive Joist Spans by Species & Spacing)<br>• Table R507.5 (Deck Beam Spans & Footing Sizes)<br>• Section R802 (Rafter Span & Ridge Sizing) | **VERIFIED** | **LOW** | "Based on prescriptive dimensional lumber span tables from IRC 2024. Not a substitute for stamped architectural drawings." |
| **International Plumbing Code (IPC)** | **2024 Edition** | • Table 709.1 (Drainage Fixture Unit Values for Fixtures)<br>• Table 710.1(1) (Horizontal Branch & Soil Stack DFU Limits)<br>• Table 710.1(2) (Building Drain Sizing by Slope)<br>• Table E103.3(2) (WSFU Load Values for Potable Fixtures) | **VERIFIED** | **LOW** | "Mathematical implementation of published IPC 2024 sizing schedules for preliminary pipe sizing." |
| **Uniform Plumbing Code (UPC)** | **2024 Edition** | • Table 702.1 (Drainage Fixture Unit Assignments)<br>• Table 703.2 (Maximum DFU Loads by Pipe Diameter & Slope)<br>• Table 610.3 (WSFU Supply Fixture Values & Hunter's Curve Flow) | **VERIFIED** | **LOW** | "Mathematical implementation of published UPC 2024 schedules. Verify pipe sizing with local municipal plumbing inspectors." |
| **ACCA (Air Conditioning Contractors of America)** | **Manual J & D Reference Guidelines** | • Sensible & Latent Heat Gain Fundamentals<br>• Climate Zone 1–7 BTU Multipliers ($30–60\text{ BTU/sq ft}$)<br>• Huebscher Formula for Rectangular to Round Equivalent Duct Diameters ($D_e = 1.30 \frac{(ab)^{0.625}}{(a+b)^{0.25}}$)<br>• Equal Friction Airflow Velocity Guidelines ($700–900\text{ FPM}$ residential branches) | **VERIFIED** | **LOW** | "Engineering estimation based on simplified Manual J/D principles. Full Manual J room-by-room load calculations should be performed by certified HVAC designers." |

---

## 2. Terminology & Legal Safety Safeguards

1. **Zero Unsupported Certification Claims**: The terms "code compliant", "permit ready", "certified safe", "guaranteed accurate", and "engineering stamped" have been audited and removed from all customer-facing UI and metadata.
2. **Standardized Preliminary Estimating Notice**: Every page displays a clear notice stating:
   > *"Preliminary Estimating Notice: Calculations and diagrams provided on this platform are mathematical models intended for preliminary planning, material takeoff estimation, and educational reference. Field conditions, local building codes, manufacturer tolerances, and project-specific engineering requirements must always be verified by licensed contractors, registered architects, or professional engineers prior to construction or permit submission."*
3. **Transparent Mathematical Formulas**: Formulas are displayed directly in the UI with raw values and steps, allowing estimators to cross-reference with their local Authority Having Jurisdiction (AHJ) code schedules.
