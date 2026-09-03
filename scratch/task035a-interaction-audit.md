# Task 035A: Interaction Design System & Brand Identity Audit

**Audit Date**: 2026-09-02  
**Platform**: Construction & Trade Tools (`NEXT_PUBLIC_SITE_URL`)  
**Scope**: Interaction state primitives, micro-interactions, brand identity, navigation popovers, and interactive product demonstration.

---

## 1. Interaction Design System Architecture

Reusable interaction states are established in [`globals.css`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/app/globals.css) under `@layer utilities`:

- **Default State**: Consistent neutral baseline borders (`border-slate-200` light / `border-slate-800` dark), high-contrast text (`text-slate-900` / `text-slate-100`), and subtle base elevation (`shadow-2xs`).
- **Hover State (`.state-hover-card`, `.state-interactive`)**: 150ms ease-out transitions (`hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5`).
- **Keyboard Focus State**: High-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`).
- **Pressed State**: Subtle tactile feedback (`active:scale-[0.98]` or `active:scale-[0.99]`).
- **Selected State (`.state-pill-selected`)**: `bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-2xs`.
- **Disabled State**: `opacity-40 pointer-events-none cursor-not-allowed select-none`.
- **Success State (`.state-success-badge`)**: `bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold`.
- **Error State (`.state-input-error`)**: `border-red-500 text-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20`.

---

## 2. Micro-Interactions & Motion System

- **Purposeful Causality**: Motion is strictly tied to user action (input change $\to$ SVG geometry morph $\to$ takeoff calculation update).
- **Reduced Motion**: Enforced `@media (prefers-reduced-motion: reduce)` block neutralizing all transitions, pulses, and animations.
- **Suppression of Decorative Artifacts**: Eliminated artificial pulsating pings, neon glow, and parallax effects.

---

## 3. Brand Identity System

A dedicated, precision technical brand mark was created in [`src/components/brand/brand-logo.tsx`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/components/brand/brand-logo.tsx):

- **Brand Concept**: Geometric combination square and structural dimensional gauge intersecting a structural core, representing physical construction + mathematical calculation precision.
- **BrandMark (`<BrandMark />`)**:
  - Scalable vector mark (viewBox 0 0 32 32) operable at 16px, 24px, 32px, 48px, 64px.
  - Colors: Base Plate `#f59e0b` (Amber-500), Core `#0f172a` (Slate-900), Caliper Tick `#fbbf24` (Amber-400).
- **BrandLogo (`<BrandLogo />`)**:
  - Combined mark with trade subline (`TRADE PLATFORM`) and brand title (`Construction & Trade Tools`).
  - Variants: `brand` (high-contrast dark text on light header) and `monochrome-light` (crisp white on dark footer).
- **Native Next.js Favicon & Metadata**:
  - [`src/app/icon.svg`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/app/icon.svg) registered automatically by Next.js as `/icon.svg`.
  - [`src/app/apple-icon.svg`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/app/apple-icon.svg) for iOS / Apple touch devices.

---

## 4. Homepage Hero Live Demonstration

- **Demonstration Flow**: `Input Change` $\to$ `Live Morphing Slab / Studs / Conduit SVG` $\to$ `Instant Takeoff Readout` $\to$ `Direct Tool Link`.
- **Interactive Dimension Steppers**: Users can adjust Length, Width, and Thickness in real-time, observing the mathematical volume update (`2.37 yd³` / `52 pcs` / `1" EMT`).

---

## 5. Search System vs. Hero Task Prompt Differentiation

- **Global Navigation Search**: Header search palette trigger (*"Search tools, calculations, and guides..."* with `⌘K` shortcut modal indexing all 15 calculators, 5 trade suites, and guides).
- **Hero Task Input**: Dedicated in-page project discovery input (*"What are you calculating? (e.g. 24x24 concrete slab, wall studs, wire size)..."*).

---

## 6. Trade Suites Navigation Popover

- **Deliberate Keyboard & Focus Handling**:
  - `onClick` toggle with `aria-expanded` and `aria-haspopup="true"`.
  - `Escape` key listener and click-outside listener for clean closing.
  - Focusable suite links displaying suite title, descriptive subtitle, active calculator count badge, and category icon.

---

## 7. Card Interaction Primitives

- Integrated `interactive={true}` into [`src/components/ui/card.tsx`](file:///c:/Users/LENOVO/Documents/antigravity/adventurous-shannon/src/components/ui/card.tsx).
- Standardized across Homepage Suites, Tools Directory (`/tools`), and Category Hubs (`/categories/[category]`).
- Includes smooth border highlight, subtle elevation, arrow translation (`group-hover:translate-x-1`), and active tactile press state.

---

## 8. Save & Print Feedback Specifications

- **Save Action**: Label `"Save on This Device"`. When clicked, stores configuration in `localStorage` and temporarily transitions to `"Saved on this device ✓"` in emerald feedback.
- **Print Action**: Label `"Print Worksheet"`. Invokes `window.print()` with clean `@media print` styles and disclaimer header.

---

## 9. Accessibility & Programmatic Contrast Ratios

Calculated via WCAG 2.1 relative luminance algorithm:

| Semantic Color Pair | FG Hex | BG Hex | Contrast Ratio | WCAG 2.1 Compliance |
| :--- | :---: | :---: | :---: | :---: |
| Primary Dark Text on White Card | `#0f172a` | `#ffffff` | **17.85 : 1** | PASS (AAA) |
| Secondary Text on White Card | `#334155` | `#ffffff` | **10.35 : 1** | PASS (AAA) |
| Muted Text on White Card | `#475569` | `#ffffff` | **7.58 : 1** | PASS (AAA) |
| Amber Brand Button (Dark on Amber) | `#020617` | `#f59e0b` | **9.39 : 1** | PASS (AAA) |
| Amber Metric on Dark Canvas | `#fbbf24` | `#020617` | **12.08 : 1** | PASS (AAA) |
| Cyan Metric on Dark Canvas | `#22d3ee` | `#020617` | **11.16 : 1** | PASS (AAA) |
| Emerald Metric on Dark Canvas | `#34d399` | `#020617` | **10.49 : 1** | PASS (AAA) |
| Light Text on Slate-900 Surface | `#f8fafc` | `#0f172a` | **17.06 : 1** | PASS (AAA) |

---

## 10. Copy Corrections

- Replaced `"verified code limits"` on the Homepage hero with `"published code references"`.

---

## 11. Engineering Quality Gates

```
ESLint:       ✔ No ESLint warnings or errors
TypeScript:   tsc --noEmit (Exit code: 0, 0 errors)
Vitest:       392 / 392 passed across 25 test files
Build:        33 static outputs compiled successfully (including /icon.svg)
```

---

## 12. Visual QA Screenshot Catalog (Task 035A)

- `01_homepage_1440x900.png` — Desktop homepage showing brand mark, distinct search triggers, and interactive live demonstration instruments.
- `02_homepage_1920x1080.png` — Wide desktop viewport layout.
- `03_homepage_390x844.png` — Mobile viewport showing responsive layout without horizontal clipping.
- `04_trade_suites_dropdown_open.png` — Desktop navigation showing opened Trade Suites popover with tool counts and descriptions.
- `05_tools_directory_1440x900.png` — Tools directory showing interactive filter pills and cards.
- `06_concrete_calculator_1440x900.png` — Concrete calculator showing 2x2 spacious inputs, live slab geometry, and Save on This Device / Print Worksheet actions.
- `07_concrete_calculator_390x844.png` — Mobile concrete calculator layout.
