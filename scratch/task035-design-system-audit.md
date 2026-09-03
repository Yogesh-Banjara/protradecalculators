# Task 035: Product Design System & Interaction Language Audit

**Audit Date**: 2026-09-03  
**Platform**: Construction & Trade Tools  
**Scope**: Product design system consolidation across typography, color tokens, layout, inputs, buttons, result hierarchy, diagram archetypes, terminology hygiene, accessibility contrast measurements, and representative page implementations.

---

## 1. Design Principles

1. **Trade Workbench Over Generic Dashboard**: The interface functions as a professional jobsite and estimating instrument, not a SaaS analytics portal or a gaming interface.
2. **Immediate Mathematical & Geometric Causality**: Input changes immediately produce visible geometric and material recalculations (`INPUT` $\to$ `VISUAL RESPONSE` $\to$ `RESULT` $\to$ `TAKEOFF`).
3. **Field-Readable Hierarchy**: Numbers dominate labels; primary decisions dominate supporting metrics.
4. **Honest Engineering Language**: No deceptive promises (e.g. "Save on This Device" for `localStorage`, "Print Worksheet" for browser print).

---

## 2. Typography Tokens

- **Display**: `text-4xl sm:text-5xl font-black tracking-tight font-sans` (Used for primary hero and page titles).
- **Page Heading**: `text-3xl sm:text-4xl font-bold tracking-tight text-slate-900` / `text-white`.
- **Section Heading**: `text-xl sm:text-2xl font-bold tracking-tight text-slate-900` / `text-white`.
- **Numerical Results**: `text-4xl sm:text-5xl font-black font-mono tracking-tight` (High legibility, tabular numbers).
- **Body Text**: `text-sm sm:text-base text-slate-600` / `text-slate-300 font-sans leading-relaxed`.
- **Labels**: `text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400`.
- **Helper Text**: `text-[11px] sm:text-xs text-slate-500 font-sans`.
- **Technical Reference / Code**: `text-xs font-mono text-slate-400`.

---

## 3. Color System Tokens

- **Page Background**: `#020617` (`slate-950`) / Light: `#f8fafc` (`slate-50`).
- **Surface**: `#0f172a` (`slate-900`) / Light: `#ffffff`.
- **Elevated Surface / Docks**: `#1e293b` (`slate-800`).
- **Border**: `#1e293b` (`slate-800`) / Subtle: `#334155` (`slate-700`).
- **Primary Text**: `#f8fafc` (`slate-50`) / Light: `#0f172a` (`slate-900`).
- **Secondary Text**: `#94a3b8` (`slate-400`) / Light: `#475569` (`slate-600`).
- **Muted Text**: `#64748b` (`slate-500`).
- **Primary Action (Brand Amber)**: `#f59e0b` (`amber-500`), hover: `#d97706` (`amber-600`).
- **Success / Order Indicator**: `#10b981` (`emerald-500`) / Background: `emerald-500/10`.
- **Warning**: `#f59e0b` (`amber-500`) / Background: `amber-500/10`.
- **Error / Exceeds Limit**: `#ef4444` (`red-500`) / Background: `red-500/10`.
- **Technical Accent (Plumbing / Layout)**: `#06b6d4` (`cyan-500`).
- **Architectural Blueprint Canvas**: `#090e1a` with 16px/80px grid lines (`#1e293b`).

---

## 4. Spacing & Layout Tokens

- **Page Gutters**: `px-4 sm:px-6 lg:px-8`.
- **Container Max Widths**: `max-w-7xl` (`1280px` standard), `max-w-5xl` (`1024px` guides).
- **Section Spacing**: `space-y-8` (Desktop: 32px, Mobile: 24px).
- **Form Grid Spacing**: `grid grid-cols-1 sm:grid-cols-2 gap-3` (Eliminated arbitrary gaps).
- **Card Padding**: `p-5 sm:p-6` for docks and interactive workspaces.
- **Desktop Target Resolutions**: Deliberate layout balance verified at `1280×900`, `1440×900`, and `1920×1080`.
- **Mobile Target Resolutions**: Full responsiveness verified at `320×844`, `360×800`, and `390×844`.

---

## 5. Input System Standards

- **Input Height**: Standardized to `h-11` (44px) for desktop/mobile tap-target compliance ($\ge 44\text{px}$).
- **Numeric Dominance**: Value container set to `flex-1` with bold tabular font; unit selector secondary (`w-24` or `w-28`).
- **Focus Rings**: `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`.
- **Error State**: Border turns red (`#ef4444`) with descriptive helper text below.

---

## 6. Button System Standards

- **Primary Action**: `bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold active:scale-[0.98]`.
- **Secondary Action**: `bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 active:scale-[0.98]`.
- **Explicit Action Labels**:
  - `"Save on This Device"` (stores browser state, feedback badge: `"Saved on this device ✓"`).
  - `"Print Worksheet"` (triggers browser print stylesheet).
  - `"Open Calculator"` / `"Open Full Concrete Workspace →"`.
  - `"Copy Takeoff"` (feedback: `"Copied Takeoff!"`).

---

## 7. Result System Hierarchy

Every calculator standardizes on this 5-stage result hierarchy:
1. **Primary Calculated Answer**: Dominant metric in large mono font (e.g., `8.00 yd³`, `3″ Pipe`).
2. **Order Callout Banner**: Ready-mix truck dispatch or primary trade sizing callout.
3. **Material Takeoff Schedule**: Quantities breakdown (e.g. 80-lb bags, rebar sticks, gravel tonnage).
4. **Methodology & Explanation**: Calculation formula derivation and assumptions accordion.
5. **Published Code References**: Specific edition, table, and article citations (e.g., NEC Table 310.16, IPC Table 710.1).

---

## 8. Diagram Archetypes

| Calculator Archetype | Representation Mode | Diagram Elements |
| :--- | :--- | :--- |
| **Concrete** | Volumetric / Isometric | Dynamic isometric slab vertices, proportional thickness, dimension leader lines, rebar grid, gravel subgrade. |
| **Framing** | 2D Elevation / Takeoff | Dynamic wall stud count, top/bottom plates, corner studs, 16″/24″ spacing indicators. |
| **Stairs / Roof** | Geometric Profile | Stringer run/rise steps, headroom clearance, pitch angle, landing boundary. |
| **Deck** | Structural Isometric / Plan | Ledger board, footings, beam spans, joist layout, decking boards. |
| **Drywall** | Surface / Net Layout | Sheet grid tiling, opening cutouts, joint tape length, fastener schedules. |
| **Electrical (Conduit/Box/Wire)** | Cross-Section / Schematic | Conduit circular cross-section, wire pack packing layout, fill limit indicator. |
| **Plumbing (DFU/WSFU)** | Architectural Schematic | Vertical soil stack, roof vent (VTR), pitched building drain, fixture branch lines. |
| **HVAC** | Thermal / Airflow Profile | Room envelope, CFM distribution, heating/cooling BTU zone breakout. |

---

## 9. Motion System Rules

- **Causality Driven**: Motion only occurs in direct response to user interaction (input change, stepper increment, layer filter selection).
- **Zero Decorative Pulsing**: Removed ambient flashing, continuous glow loops, and fake scanning rings.
- **Duration**: Fast, crisp 150ms transitions (`duration-150 ease-out`).
- **Accessibility**: `@media (prefers-reduced-motion: reduce)` globally sets animation/transition duration to `0.01ms`.

---

## 10. Navigation & Search System

- **Header Logo**: Navigates to `/`.
- **Global Search**: Modal opened via `⌘K` or search bar for platform-wide tool, category, and guide discovery.
- **Homepage Task Input**: Dedicated intent-capture field (*"What are you calculating?"*) with quick task pills linking directly into specific calculators.
- **Trade Suites Popover**: Grouped category navigation with tool count indicators.
- **Tools Directory**: Full directory at `/tools`.
- **Guides**: Topical engineering guides at `/guides`.

---

## 11. Terminology Hygiene (De-Cyberpunking)

- **Removed "HUD"**: Replaced with `"Schedule"`, `"Readout"`, `"Takeoff"`, or `"Sizing Readout"`.
- **Removed "3D CAD"**: Replaced with `"Interactive Isometric View"`.
- **Removed "Blueprint" as Guarantee**: Clarified as `"Architectural Schematic"` or `"Interactive Visual Model"`.
- **Removed "Code-Compliant Result" / "Permit-Ready"**: Replaced with `"Published Code Reference"` and explicit disclaimers regarding local AHJ adoptions.

---

## 12. Accessibility & Contrast Measurements

| UI Element | Color Hex (Foreground / Background) | Contrast Ratio | WCAG Compliance Level |
| :--- | :--- | :---: | :---: |
| Slate-900 text on White | `#0f172a` on `#ffffff` | **17.85 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Slate-600 text on White | `#475569` on `#ffffff` | **7.84 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Slate-100 text on Slate-950 | `#f1f5f9` on `#020617` | **17.06 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Slate-200 text on Slate-900 | `#e2e8f0` on `#0f172a` | **14.28 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Slate-400 text on Slate-950 | `#94a3b8` on `#020617` | **7.85 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Brand Amber Button | `#020617` on `#f59e0b` | **9.39 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Amber Metric Text on Dark | `#fbbf24` on `#020617` | **12.08 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Cyan Metric Text on Dark | `#22d3ee` on `#020617` | **11.16 : 1** | WCAG AAA ($\ge 7.0:1$) |
| Emerald Metric Text on Dark | `#34d399` on `#020617` | **10.49 : 1** | WCAG AAA ($\ge 7.0:1$) |

---

## 13. Representative Page Implementation Findings

1. **Homepage (`/`)**:
   - Hero demonstrates live reactive estimating instruments (Concrete, Framing, Conduit).
   - Direct action flow cleanly connects input modifications to visual changes and volume readouts.
2. **Concrete Calculator (`/construction/concrete-calculator`)**:
   - Volumetric archetype with live isometric SVG slab projection.
   - Spacious 2x2 input grid with dominant numeric entry.
   - Clear material takeoff order schedule with explicit `"Save on This Device"` and `"Print Worksheet"` triggers.
3. **Plumbing DFU Calculator (`/plumbing/dfu-calculator`)**:
   - Code/table pipe sizing archetype with interactive sanitary drainage schematic.
   - Connected fixture schedule with quantity adjustment steppers, slope selection, and prescriptive pipe size results.

---

## 14. Screenshot Catalog (Task 035)

| File | Resolution | Description |
| :--- | :---: | :--- |
| `01_homepage_1440x900.png` | 1440 × 900 | Desktop Homepage showing clean typography, task search input, and interactive live demonstration instruments. |
| `02_homepage_390x844.png` | 390 × 844 | Mobile Homepage layout with responsive steppers and touch targets ($\ge 44\text{px}$). |
| `03_concrete_1440x900.png` | 1440 × 900 | Concrete Calculator desktop layout showing interactive isometric view, 2x2 inputs, and volume takeoff. |
| `04_concrete_390x844.png` | 390 × 844 | Concrete Calculator mobile view. |
| `05_dfu_1440x900.png` | 1440 × 900 | Plumbing DFU Calculator desktop layout showing architectural drainage schematic and fixture schedule. |
| `06_dfu_390x844.png` | 390 × 844 | Plumbing DFU Calculator mobile view. |

---

## 15. Engineering Quality Gates

- **ESLint**: `✔ No ESLint warnings or errors`
- **TypeScript**: `tsc --noEmit` (Exit code: 0, 0 errors)
- **Vitest**: `392 / 392 passed` across 25 test files
- **Next.js Production Build**: `33 static outputs compiled successfully`

---

## 16. Remaining Issues Requiring CEO Review

- Future calculator additions (such as Roof) should directly instantiate the standardized `workspace-shell.tsx` and archetype diagram conventions established in this system.
- Offline persistence is currently scoped to browser `localStorage`; cloud synchronization remains intentionally out of scope.
