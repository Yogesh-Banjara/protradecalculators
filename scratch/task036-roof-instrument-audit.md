# Task 036: Roof Pitch & Rafter Geometry Instrument Audit

**Audit Date**: 2026-09-03  
**Path**: `/construction/roof-pitch-calculator`  
**Archetype**: Geometric Layout Tool  
**Platform**: Construction & Trade Tools  

---

## 1. Existing Calculation Engine

The core calculation engine located at [`src/lib/calculations/roof.ts`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/lib/calculations/roof.ts) was preserved and verified without altering mathematical semantics:

- **Slope Angle & Multiplier**:
  $$\text{Pitch Angle} = \arctan\left(\frac{\text{Pitch}}{12}\right) \times \left(\frac{180}{\pi}\right)$$
  $$\text{Slope Factor} = \sqrt{1 + \left(\frac{\text{Pitch}}{12}\right)^2}$$
- **Run & Rise**:
  $$\text{Run (ft)} = \frac{\text{Building Span}}{2}$$
  $$\text{Rise (ft)} = \text{Run (ft)} \times \left(\frac{\text{Pitch}}{12}\right)$$
- **Common Rafter Line Length**:
  $$\text{Line Length (ft)} = \text{Run (ft)} \times \text{Slope Factor}$$
- **Practical Cutting Length**:
  $$\text{Cut Length (in)} = \text{Line Length (in)} - \left(\frac{\text{Ridge Board Thickness}}{2} \times \text{Slope Factor}\right) + (\text{Overhang Run (in)} \times \text{Slope Factor})$$
- **Birdsmouth Cuts**:
  $$\text{Plumb Cut Angle} = \text{Pitch Angle}$$
  $$\text{Seat Cut Angle} = 90^\circ - \text{Pitch Angle}$$
  $$\text{Plumb Cut Depth (in)} = \text{Seat Bearing (in)} \times \left(\frac{\text{Pitch}}{12}\right)$$
  $$\text{HAP Stand (in)} = \text{Actual Rafter Depth (in)} - \text{Plumb Cut Depth (in)}$$
- **Sloped Surface Area & Takeoff**:
  $$\text{Sloped Area (sq ft)} = (\text{Length} + 2 \times \text{Rake Overhang}) \times (\text{Span} + 2 \times \text{Eave Overhang}) \times \text{Slope Factor}$$
  $$\text{Roofing Squares} = \frac{\text{Sloped Area}}{100}$$

---

## 2. Supported Inputs

| Parameter | Type / Range | Default | Purpose |
| :--- | :--- | :---: | :--- |
| **Building Span (Width)** | Numeric ($\ge 2\text{ ft}$) | `24 ft` | Outer wall to outer wall dimension (determines horizontal run). |
| **Building Length** | Numeric ($\ge 2\text{ ft}$) | `36 ft` | Ridge-parallel dimension (determines ridge board length & roof plane length). |
| **Roof Pitch** | Numeric / Presets ($0.5:12$ to $36:12$) | `6:12` | Vertical rise per 12 inches horizontal run. |
| **Rafter Lumber Stock** | Nominal sizes (`2x4`, `2x6`, `2x8`, `2x10`, `2x12`) | `2x6` | Actual wood depth used to compute birdsmouth plumb depth and HAP. |
| **Eave Overhang** | Numeric ($\ge 0\text{ in}$) | `12 in` | Horizontal soffit / eave projection. |
| **Gable Rake Overhang** | Numeric ($\ge 0\text{ in}$) | `12 in` | Horizontal rake projection at gable ends. |
| **Ridge Board Thickness** | Numeric ($\ge 0\text{ in}$) | `1.5 in` | Ridge stock thickness for shortening deduction along rafter slope. |
| **Seat Cut Bearing** | Numeric ($\ge 1\text{ in}$) | `3.5 in` | Top plate horizontal bearing width. |
| **Waste Allowance** | Presets ($0\%, 5\%, 10\%, 15\%$) or Custom $\%$ | `10%` | Scrap and cutting waste for shingles and underlayment. |

---

## 3. Supported Outputs

1. **Common Rafter Line Length**: Theoretical distance from ridge center to wall plate outer line (e.g., `13′ 5″` / `13.416 ft`).
2. **Total Practical Cut Length**: Exact timber length from top plumb cut to tail plumb cut (e.g., `14′ 5-9/16″`).
3. **Plumb Cut Angle**: Top ridge angle and tail cut angle (e.g., `26.57°` on 6:12).
4. **Seat Cut Angle**: Level cut angle for wall plate bearing (e.g., `63.43°` on 6:12).
5. **Birdsmouth Notch Dimensions**: Seat bearing (`3.5″`), plumb cut depth (`1.75″`), Height Above Plate / Stand (`3.75″`).
6. **Total Vertical Rise**: Elevation change from plate to ridge (`6.0 ft` / `72″`).
7. **Roofing Surface Takeoff**: Net sloped area (`1,104.58 sq ft`), adjusted area (`1,215.04 sq ft`), roofing squares (`12.15 SQ`), shingle bundles (`37 bdls`), synthetic underlayment (`4 rolls`), drip edge (`14 pcs` / `134.14 ft`), ridge cap shingles (`2 bdls`).

---

## 4. Visual Architecture

- **2-Pane Workbench Split Layout**:
  - **Left Column (7 Cols on Desktop / 58%)**: Dedicated `instrument-canvas` with `bg-blueprint-grid` featuring dynamic SVG projection.
  - **Right Column (5 Cols on Desktop / 42%)**: `instrument-dock` containing essential geometry inputs, progressive disclosure accordion, and 5-stage result schedule.
- **Dynamic Geometric Morphing**:
  - Full profile SVG scales proportionally with pitch angle $\theta = \arctan(\text{pitch}/12)$.
  - Slope triangle (`12 : pitch`), dimension leader lines, wall top plate box, ridge board box, and birdsmouth notch adapt synchronously.
- **View Modes**:
  - `Full Profile`: Complete rafter run, rise, line length, ridge center, and overhang tail.
  - `Birdsmouth Detail`: Enlarged view of seat cut bearing, plumb cut depth, and HAP stand.

---

## 5. Interaction Behavior

- **Immediate Causality**: Changing span, length, or pitch immediately triggers live geometry recalculation and SVG re-rendering.
- **Preset Buttons**: Quick-selection chips for standard pitches (`2:12`, `3:12`, `4:12`, `5:12`, `6:12`) and waste factors (`0%`, `5%`, `10%`, `15%`, `Custom %`).
- **Reduced Motion**: All animations and transitions obey `@media (prefers-reduced-motion: reduce)`.

---

## 6. Accessibility & Contrast Measurements

| UI Element | Color Hex (Foreground / Background) | Contrast Ratio | WCAG Compliance Level |
| :--- | :--- | :---: | :---: |
| Page Heading on Dark | `#f8fafc` on `#020617` | **17.06 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Secondary Text on Dark | `#94a3b8` on `#020617` | **7.85 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Brand Amber Button | `#020617` on `#f59e0b` | **9.39 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Primary Number (`13′ 5″`) | `#fbbf24` on `#020617` | **12.08 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Plumb Cut Angle Cyan | `#22d3ee` on `#020617` | **11.16 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Seat Cut Angle Green | `#34d399` on `#020617` | **10.49 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Form Inputs Tap Target | Height $\ge 40\text{px}$ (Desktop), $44\text{px}$ (Mobile) | Met | WCAG 2.5.5 ($\ge 44\text{px}$) |

---

## 7. Terminology Hygiene

- **De-Cyberpunked Copy**:
  - Removed all occurrences of "HUD", "3D CAD Blueprint", "permit-ready", and "guaranteed code-compliant".
  - Standardized on honest trade terminology: *"Roof Profile & Rafter Geometry Layout"*, *"Common Rafter Line Length"*, *"Rafter Geometry & Cutting Schedule"*, *"Roofing Squares & Materials Takeoff"*.
- **Explicit Action Labels**:
  - `"Save on This Device"` $\to$ Stores parameters in `localStorage` with `"Saved on this device ✓"` confirmation.
  - `"Print Worksheet"` $\to$ Triggers clean jobsite printable worksheet.
  - `"Copy Takeoff"` $\to$ Copies formatted text summary with `"Copied Takeoff!"` visual confirmation.

---

## 8. Technical-Scope Limitations & Structural Disclaimers

- **Geometric Calculation vs Structural Design**: The instrument explicitly states that rafter spans, lumber species/grade, collar tie spacing, and snow/wind load deflection criteria must be verified against International Residential Code (IRC Table R802.5.1) or an engineered design.
- **Low Slope Shingle Warning**: Slopes below $4:12$ trigger an informative notice regarding double-underlayment requirements (IRC Table R905.1.1) and flat roof prohibitions below $2:12$.
- **Deep Birdsmouth Notch Warning**: Notches exceeding $1/3$ rafter depth trigger an IRC R802.5.2 warning to prevent splitting under roof dead/live load.

---

## 9. Screenshot Catalog (Task 036)

| Screenshot File | Viewport | Verified Elements |
| :--- | :---: | :--- |
| `01_roof_desktop_1280x900.png` | 1280 × 900 | Desktop layout with balanced 2-column workbench. |
| `02_roof_desktop_1440x900.png` | 1440 × 900 | Standard desktop view with live morphing SVG rafter projection, telemetry chips, and cutting schedule. |
| `03_roof_desktop_1920x1080.png` | 1920 × 1080 | Large desktop display verifying max-width containment (`max-w-7xl`). |
| `04_roof_mobile_320x844.png` | 320 × 844 | Ultra-compact mobile viewport showing vertical stacking without horizontal overflow. |
| `05_roof_mobile_360x800.png` | 360 × 800 | Standard Android mobile viewport. |
| `06_roof_mobile_390x844.png` | 390 × 844 | Modern iOS mobile viewport with clean SVG scaling and touch targets $\ge 44\text{px}$. |
| `07_roof_mobile_430x932.png` | 430 × 932 | Large mobile viewport. |

---

## 10. Engineering Quality Gates

- **ESLint**: `✔ No ESLint warnings or errors`
- **TypeScript**: `tsc --noEmit` (Exit code: 0, 0 errors)
- **Vitest**: `395 / 395 passed` across 25 test suites (20 tests dedicated to roof geometry & edge cases)
- **Next.js Production Build**: `33 static outputs compiled successfully`

---

## 11. Remaining Issues Requiring CEO Review

- No remaining technical defects discovered.
- The roof instrument adheres strictly to the Task 035 design system and Geometric Layout archetype.
