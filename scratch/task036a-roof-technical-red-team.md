# Task 036A: Roof Calculation Technical Red-Team & Claim Hardening Report

**Audit Date**: 2026-09-03  
**Target**: `/construction/roof-pitch-calculator`  
**Archetype**: Geometric Layout Tool  
**Audited Files**:
- `src/lib/calculations/roof.ts`
- `tests/calculations/roof.test.ts`
- `src/components/tools/roof-calculator/roof-form.tsx`
- `src/components/tools/roof-calculator/roof-diagram.tsx`
- `src/app/construction/roof-pitch-calculator/page.tsx`
- `src/data/materials/roofing-types.ts`

---

## 1. Executive Verdict

**FINAL VERDICT**:
> **PASS** — Mathematical geometry verified under documented conventions and stated framing assumptions.  
> **CONDITIONAL** — Construction layout and code interpretation require verification against project-specific framing details, roofing assembly specifications, applicable building code editions, structural design loads, and local Authority Having Jurisdiction (AHJ) requirements.

Passing this unit-test and geometric verification suite confirms mathematical accuracy of right-triangle trigonometry and standard framing layout formulas under stated assumptions. It **DOES NOT** constitute:
- Structural engineering or load-path verification;
- Member span-table sizing or lumber species/grade certification;
- Wind uplift, seismic, or dead/live load deflection design;
- Rafter-to-plate connection or hurricane tie design;
- Building permit approval or official code compliance certification.

---

## 2. Explicit Documentation of Geometric Conventions

The roof calculator operates under the following strictly defined geometric conventions:

### A. Run
- **Definition**: Horizontal distance from the outside face of the exterior wall top plate to the plumb centerline of the roof ridge board.
- **Formula**: $\text{Run (ft)} = \frac{\text{Building Span (ft)}}{2}$.

### B. Theoretical Common Rafter Line Length
- **Definition**: The hypotenuse of the right triangle formed by the horizontal run and the vertical rise, measured along the rafter measuring line from the ridge centerline plumb line to the exterior wall top plate plumb line.
- **Formula**: $\text{Line Length} = \text{Run} \times \text{Slope Factor} = \sqrt{\text{Run}^2 + \text{Rise}^2}$.

### C. Ridge-Board Shortening Deduction
- **Definition**: Because rafters butt against the vertical face of a central ridge board rather than meeting at the apex centerline, each rafter must be shortened horizontally by half the ridge board thickness ($T_{\text{ridge}}/2$).
- **Slope Projection**: When measured along the rafter slope line, the shortening deduction is:
  $$\Delta L_{\text{ridge}} = \left(\frac{T_{\text{ridge}}}{2}\right) \times \text{Slope Factor}$$

### D. Eave Overhang Projection
- **Definition**: Entered as the **horizontal projection** (soffit depth) from the exterior wall sheathing line to the subfascia.
- **Slope Projection**: Converted to rafter tail length along the pitch slope:
  $$L_{\text{tail}} = \text{Overhang Run} \times \text{Slope Factor}$$

### E. Estimated Rafter Cut Length
- **Definition**: Estimated total timber length from the plumb cut at the ridge to the plumb cut at the eave tail under the selected ridge and overhang assumptions:
  $$\text{Estimated Cut Length} = \text{Line Length} - \Delta L_{\text{ridge}} + L_{\text{tail}}$$

### F. Birdsmouth & Height Above Plate (HAP / Stand)
- **Seat Cut Bearing ($W_{\text{seat}}$)**: Horizontal level bearing cut resting on the wall plate (typically $3.5\text{″}$ on $2\times4$ walls or $5.5\text{″}$ on $2\times6$ walls).
- **Plumb Notch Depth ($D_{\text{plumb}}$)**: Vertical notch depth cut into the rafter: $D_{\text{plumb}} = W_{\text{seat}} \times (P/12)$.
- **Height Above Plate (HAP)**: Remaining vertical wood depth above the top plate measured along the plumb line:
  $$\text{HAP} = D_{\text{actual lumber depth}} - D_{\text{plumb}}$$

---

## 3. Independent Geometry Verification

| Benchmark Case | Parameter | Existing Engine Result | Independent Mathematical Result | Difference | Status |
| :--- | :--- | ---:| ---:| ---:| :---: |
| **Run = 12 ft, 2:12 Pitch** | Slope Factor | 1.0138 | $\sqrt{1 + (2/12)^2} = 1.0137937... \approx 1.0138$ | 0.0000 | PASS |
| | Pitch Angle | 9.46° | $\arctan(2/12) \times \frac{180}{\pi} = 9.4623...^\circ \approx 9.46^\circ$ | 0.00° | PASS |
| | Vertical Rise | 2.00 ft (24.0″) | $12 \times (2/12) = 2.00\text{ ft}$ ($24.0\text{″}$) | 0.00 ft | PASS |
| | Line Length | 12.166 ft (146.0″) | $12 \times 1.0137937 = 12.1655\text{ ft}$ ($145.99\text{″}$) | 0.001 ft | PASS |
| **Run = 12 ft, 4:12 Pitch** | Slope Factor | 1.0541 | $\sqrt{1 + (4/12)^2} = 1.0540925... \approx 1.0541$ | 0.0000 | PASS |
| | Pitch Angle | 18.43° | $\arctan(4/12) \times \frac{180}{\pi} = 18.4349...^\circ \approx 18.43^\circ$ | 0.00° | PASS |
| | Vertical Rise | 4.00 ft (48.0″) | $12 \times (4/12) = 4.00\text{ ft}$ ($48.0\text{″}$) | 0.00 ft | PASS |
| | Line Length | 12.649 ft (151.8″) | $12 \times 1.0540925 = 12.6491\text{ ft}$ ($151.79\text{″}$) | 0.000 ft | PASS |
| **Run = 12 ft, 6:12 Pitch** | Slope Factor | 1.1180 | $\sqrt{1 + (6/12)^2} = 1.1180339... \approx 1.1180$ | 0.0000 | PASS |
| | Pitch Angle | 26.57° | $\arctan(6/12) \times \frac{180}{\pi} = 26.5650...^\circ \approx 26.57^\circ$ | 0.00° | PASS |
| | Vertical Rise | 6.00 ft (72.0″) | $12 \times (6/12) = 6.00\text{ ft}$ ($72.0\text{″}$) | 0.00 ft | PASS |
| | Line Length | 13.416 ft (161.0″) | $12 \times 1.1180339 = 13.4164\text{ ft}$ ($161.00\text{″}$) | 0.000 ft | PASS |
| **Run = 12 ft, 8:12 Pitch** | Slope Factor | 1.2019 | $\sqrt{1 + (8/12)^2} = 1.2018504... \approx 1.2019$ | 0.0000 | PASS |
| | Pitch Angle | 33.69° | $\arctan(8/12) \times \frac{180}{\pi} = 33.6900...^\circ \approx 33.69^\circ$ | 0.00° | PASS |
| | Vertical Rise | 8.00 ft (96.0″) | $12 \times (8/12) = 8.00\text{ ft}$ ($96.0\text{″}$) | 0.00 ft | PASS |
| | Line Length | 14.422 ft (173.1″) | $12 \times 1.2018504 = 14.4222\text{ ft}$ ($173.07\text{″}$) | 0.000 ft | PASS |
| **Run = 12 ft, 12:12 Pitch** | Slope Factor | 1.4142 | $\sqrt{1 + (12/12)^2} = \sqrt{2} = 1.4142135... \approx 1.4142$ | 0.0000 | PASS |
| | Pitch Angle | 45.00° | $\arctan(1) \times \frac{180}{\pi} = 45.00^\circ$ | 0.00° | PASS |
| | Vertical Rise | 12.00 ft (144.0″) | $12 \times (12/12) = 12.00\text{ ft}$ ($144.0\text{″}$) | 0.00 ft | PASS |
| | Line Length | 16.971 ft (203.6″) | $12 \times 1.4142135 = 16.9705\text{ ft}$ ($203.65\text{″}$) | 0.000 ft | PASS |

---

## 4. Cut-Length & Deductions Verification

| Case (Run 12 ft, 6:12 Pitch, Ridge 1.5″, Overhang 12″) | Existing Engine | Independent Math | Difference | Status |
| :--- | ---:| ---:| ---:| :---: |
| Line Length | 161.00″ (13.416 ft) | $144 \times 1.118034 = 161.00\text{″}$ | 0.00″ | PASS |
| Ridge Deduction | 0.84″ | $0.75 \times 1.118034 = 0.8385\text{″} \approx 0.84\text{″}$ | 0.00″ | PASS |
| Overhang Length | 13.42″ | $12 \times 1.118034 = 13.416\text{″} \approx 13.42\text{″}$ | 0.00″ | PASS |
| Estimated Cut Length | 173.58″ (14.465 ft / 14′ 5-9/16″) | $161.00 - 0.8385 + 13.4164 = 173.578\text{″} \approx 173.58\text{″}$ | 0.00″ | PASS |

---

## 5. Birdsmouth & Height Above Plate (HAP) Verification

| Lumber Nominal Size | Actual Depth | Pitch | Bearing Width | Plumb Notch Depth | Height Above Plate (HAP) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **2x4** | 3.50″ | 6:12 | 3.50″ | $3.5 \times (6/12) = 1.75\text{″}$ | $3.50 - 1.75 = 1.75\text{″}$ | PASS (Warns: $>1/3$ depth) |
| **2x6** | 5.50″ | 6:12 | 3.50″ | $3.5 \times (6/12) = 1.75\text{″}$ | $5.50 - 1.75 = 3.75\text{″}$ | PASS |
| **2x8** | 7.25″ | 6:12 | 3.50″ | $3.5 \times (6/12) = 1.75\text{″}$ | $7.25 - 1.75 = 5.50\text{″}$ | PASS |
| **2x10** | 9.25″ | 6:12 | 3.50″ | $3.5 \times (6/12) = 1.75\text{″}$ | $9.25 - 1.75 = 7.50\text{″}$ | PASS |
| **2x12** | 11.25″ | 6:12 | 3.50″ | $3.5 \times (6/12) = 1.75\text{″}$ | $11.25 - 1.75 = 9.50\text{″}$ | PASS |
| **2x6** | 5.50″ | 4:12 | 3.50″ | $3.5 \times (4/12) = 1.17\text{″}$ | $5.50 - 1.1667 = 4.33\text{″}$ | PASS |
| **2x6** | 5.50″ | 8:12 | 3.50″ | $3.5 \times (8/12) = 2.33\text{″}$ | $5.50 - 2.3333 = 3.17\text{″}$ | PASS (Warns: $>1/3$ depth) |

---

## 6. Cut-Angle Verification

- **Plumb Cut Angle**: Angle from the vertical plane $= \theta = \arctan(P/12)$.
- **Seat Cut Angle**: Angle from the horizontal bearing plane $= 90^\circ - \theta$.
- **Sum**: $\theta + (90^\circ - \theta) = 90.00^\circ$ (Exact right angle).

| Pitch | Plumb Cut Angle | Seat Cut Angle | Sum | Verification |
| :---: | :---: | :---: | :---: | :---: |
| **2:12** | 9.46° | 80.54° | 90.00° | PASS |
| **4:12** | 18.43° | 71.57° | 90.00° | PASS |
| **6:12** | 26.57° | 63.43° | 90.00° | PASS |
| **8:12** | 33.69° | 56.31° | 90.00° | PASS |
| **12:12** | 45.00° | 45.00° | 90.00° | PASS |

---

## 7. Overhang & Ridge Verification

- **Overhang**: Modeled as horizontal projection and projected along the slope: $L_{\text{tail}} = L_{\text{overhang}} \times \text{Slope Factor}$.
- **Ridge Deduction**: Modeled as horizontal half-thickness projected along the slope: $\Delta L_{\text{ridge}} = (T_{\text{ridge}}/2) \times \text{Slope Factor}$.

---

## 8. Unit Conversion & Precision

- Internal math executes on 64-bit IEEE 754 floats.
- Fractional formatting rounds decimal inches to nearest $1/16\text{″}$ at the UI boundary.
- Zero compounding truncation observed.

---

## 9. Boundary Conditions & Edge Cases

| Condition | Input | Expected Handling | Output | Status |
| :--- | :--- | :--- | :--- | :---: |
| Pitch $\le 0$ | $0$ or $-3$ | Reject with RangeError | Throws `RangeError("Roof pitch must be greater than zero")` | PASS |
| Pitch $> 36:12$ | $40$ | Reject with RangeError | Throws `RangeError("Roof pitch must be 36/12 (71.6°) or less")` | PASS |
| Span $\le 0$ | $0$ | Reject with RangeError | Throws `RangeError("Building width / span must be greater than zero")` | PASS |
| Boundary Low Pitch | $0.5:12$ | Valid Calculation | Angle $2.39^\circ$, Slope factor $1.0009$ | PASS |
| Boundary High Pitch | $36:12$ | Valid Calculation | Angle $71.57^\circ$, Slope factor $3.1623$ | PASS |

---

## 10. Code Reference Scoping & Source Verification

All code references have been strictly audited and scoped to model building codes:

| Code Citation | Topic | Exact Section / Table Identifier | Scoped Production Language |
| :--- | :--- | :--- | :--- |
| **IRC 2024 / 2021** | Birdsmouth Notch Depth | Section R802.5.2 | *"Reference note: Birdsmouth plumb notch depth exceeds 1/3 of rafter stock depth. Model building codes (e.g. IRC Section R802.5.2) commonly restrict notch depth to limit cross-grain splitting. This check is informational only and does not constitute structural approval."* |
| **IRC 2024 / 2021** | Low Slope Underlayment | Table R905.1.1 | *"Roofing material reference: Roof pitch is below 4/12. Standard asphalt shingles generally require double-layer underlayment on 2/12 to 4/12 slopes (e.g. IRC Table R905.1.1) and are prohibited below 2/12. Verify applicable roofing assembly specifications separately."* |
| **IRC 2024 / 2021** | Structural Sizing Disclaimer | Table R802.5.1 | *"Geometric layout and material estimation reference only. Structural rafter sizing, lumber species/grades, allowable clear spans, collar tie spacing, and snow/wind load deflection criteria must be verified against applicable building codes (such as IRC Table R802.5.1) or project engineering."* |

---

## 11. Supported Scope & Exclusions

### Supported:
- Symmetrical gable roof geometry;
- Common rafter layout (theoretical line length, estimated practical cut length, overhang projection, ridge deduction);
- Birdsmouth notch geometry (seat bearing, plumb depth, Height Above Plate / Stand);
- Sloped surface area and material takeoff (roofing squares, shingle bundles, underlayment rolls, drip edge perimeter, ridge caps).

### Excluded:
- Hip, valley, and jack rafter compound cuts;
- Structural ridge beam engineering calculations (point loads, post loads, deflection limits);
- Structural rafter species / span selection (governed by IRC Table R802.5.1);
- Wind uplift, seismic tie-downs, and hurricane bracket engineering.

---

## 12. Regression Test Inventory (401 Tests Total)

- **26 tests** dedicated specifically to `tests/calculations/roof.test.ts` (17 accuracy tests + 3 edge-case tests + 4 red-team matrix benchmarks + 2 boundary/unit conversion tests).
- **401 total tests passing** across all 25 test files on the platform.

---

## 13. Quality Gate Summary

```
ESLint:       ✔ No ESLint warnings or errors
TypeScript:   tsc --noEmit (Exit code: 0, 0 errors)
Vitest:       401 / 401 passed across 25 test suites
Build:        33 static outputs compiled successfully
```

---

## 14. Final Recommendation

**ACCEPT TASK 036A AS CLAIM-HARDENED, TECHNICALLY SCOPED, AND CLOSED.**
