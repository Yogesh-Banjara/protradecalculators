# Task 034J: Human-First UX Correction & Navigation Rebuild Audit

**Document Version**: 1.0  
**Audit Date**: 2026-09-02  
**Directives**: Product-Quality UX Correction & Navigation Rebuild (Non-engineer usability, input legibility, honest Save/Print actions, clean typography & card rhythm).

---

## 1. Problems Found

1. **Numeric Input Squeeze**: Standard number inputs on narrow viewports were constrained by browser-native spinner controls and unit selector dropdowns, clipping decimal figures and large numbers.
2. **Ambiguous Action Terminology**: "Save" lacked clarity on storage location, while browser printing was misleadingly labeled "PDF Blueprint" on multiple calculators.
3. **Navigational Redundancy**: Header included competing destinations ("Trade Suites", "Tools Directory", and a redundant "All 15 Tools →" button) and generic placeholder phrasing.
4. **Search UI Confusion**: Homepage had overlapping search prompts ("Quick search 15 calculators" vs "What are you calculating?") that competed for user focus.
5. **Hero Scale**: Homepage hero had an oversized title taking up critical viewport space before the user could see useful tools.
6. **Card Spacing & Rhythm**: Unbalanced vertical padding and mandatory border dividers in standard card containers created awkward layout gaps.
7. **Heading Color Contrast**: Heading elements in global CSS defaulted to pure white (`text-white`), requiring manual overrides on light-themed surfaces.

---

## 2. Problems Fixed

1. **Global Input Legibility Rule**: Enforced `flex-1 min-w-0 w-full` with number spinner removal (`[appearance:textfield]`) on all `UnitInput` and `Input` components. Value field now occupies 70–80% of width; unit selector is secondary and compact.
2. **Honest Save & Print Actions**: Renamed buttons to **"Save on This Device"** (with local browser storage transparency) and **"Print Worksheet"**. Removed misleading "PDF Blueprint" labels.
3. **Streamlined Navigation**: Removed redundant "All 15 Tools" button from header. Unified quick search modal to index calculators, trade suites, and technical guides.
4. **Distinct Search Roles**: Header search clearly serves global tool discovery (*"Search tools, calculations, and guides..."*), while homepage search serves project task input (*"What are you building or calculating?"*).
5. **Compact Workbench Hero**: Reduced headline scale, tightened vertical whitespace, and brought interactive live instruments above the fold.
6. **Card System Normalization**: Standardized card padding (`p-4 sm:p-5`), removed forced internal dividers, and added restrained hover/focus interaction states.
7. **Accessible Typography & Contrast**: Ensured explicit high-contrast text hierarchies (`text-slate-900` for titles/inputs, `text-slate-600` for body, `text-slate-400` for muted labels).

---

## 3. Global Components Changed

- `src/components/ui/unit-input.tsx`: Enforced dominant input width, minimum 44px touch height, and removed WebKit spinners.
- `src/components/ui/input.tsx`: Added `[appearance:textfield]`, tabular figures, and responsive font size (`text-base sm:text-sm`).
- `src/components/ui/card.tsx`: Normalized padding and standardized typography across headers, bodies, and footers.
- `src/components/ui/print-view.tsx`: Standardized default label to `"Print Worksheet"`.
- `src/components/ui/result-panel.tsx`: Updated print button label to `"Print Worksheet"`.
- `src/components/workspace/result-hero.tsx`: Updated print button label to `"Print Worksheet"`.
- `src/components/layout/header.tsx`: Updated search placeholder to `"Search tools, calculations, and guides..."` and removed duplicate "All 15 Tools" button.
- `src/components/layout/quick-search-modal.tsx`: Indexed calculators, trade suites, and technical guides with unified placeholder and footer link.
- `src/app/globals.css`: Added universal number input spinner removal rules.
- Calculator form components: Updated Save and Print button labels across Deck, Framing, HVAC, Plumbing DFU, Stairs, and Conduit tools.

---

## 4. Navigation Changes

- **Header Structure**:
  - `Logo` $\to$ `/`
  - `Global Search` $\to$ Modal searching all tools, suites, and guides
  - `Trade Suites` $\to$ Dropdown linking to 5 category hubs
  - `Tools Directory` $\to$ `/tools`
  - `About & Methodology` $\to$ `/about`
  - `Contact` $\to$ `/contact`
- **Duplicate Removal**: Eliminated redundant `"All 15 Tools →"` button from desktop header.

---

## 5. Input Field Changes

- **Value vs. Unit Ratio**: Value input field is now dominant (`flex-1 min-w-0 w-full`), unit selector is secondary (`shrink-0`).
- **Spinner Elimination**: Added cross-browser CSS rules removing inner/outer number spinners.
- **Mobile Touch Target**: Enforced `min-h-[44px]` container height and `text-base` font size on mobile to prevent iOS Safari auto-zooming.
- **Decimal Legibility**: Monospace tabular numerals (`tabular-nums`) prevent character jitter and text truncation.

---

## 6. Save Behavior

- **Label**: **"Save on This Device"** $\to$ **"Saved on this device"** (with check icon).
- **Transparency**: User is explicitly notified that inputs and settings are stored locally in the browser (`localStorage`).
- **Reset Support**: Resetting the form clears the corresponding `localStorage` key.

---

## 7. Print Behavior

- **Label**: **"Print Worksheet"**.
- **Print Optimization**: Clean `@media print` rules strip header, footer, search bars, and interactive buttons, leaving an unencumbered jobsite takeoff sheet with date, inputs, results, and code references.

---

## 8. Typography Changes

- Compact display headlines replacing oversized posters.
- Dominant numeric readouts in results and tables using `font-mono tabular-nums`.
- Explicit high-contrast text styles (`text-slate-900` for primary content, `text-slate-700` for secondary descriptions).

---

## 9. Contrast Changes

- Light-themed cards use high-contrast dark text (`text-slate-900` / `text-slate-800`).
- Dark CAD blueprint panels use high-contrast amber (`text-amber-400`), cyan (`text-cyan-400`), and emerald (`text-emerald-400`) text against `bg-slate-950`.
- All form labels and validation messages meet WCAG AA contrast standards.

---

## 10. Card Interaction Changes

- Default: Clean border with subtle shadow (`shadow-2xs` / `border-slate-200/90`).
- Hover: Subtle elevation shift and border highlight (`hover:border-amber-400/80` or `hover:bg-slate-50`).
- Focus: High-contrast focus rings (`focus-visible:ring-amber-500`).

---

## 11. Mobile Findings (320px – 430px)

- Tested across 320px, 360px, 390px, and 430px viewports.
- Zero horizontal overflow.
- Inputs remain comfortably readable with both value and unit visible simultaneously.
- Touch targets exceed 44px height.

---

## 12. Google / AdSense Quality Guardrails

- **Zero Ads**: No live ad slots or fake ad placeholders.
- **Zero Doorway Pages**: No programmatic keyword-stuffed landing pages.
- **High Information Density**: Every calculator and guide page provides original mathematical engines, assumptions, and referenced standards.

---

## 13. Content Architecture Classification (27 URLs)

- **Tier A (High Standalone Utility)**: 17 URLs (63.0%)
- **Tier B (Foundational Hubs, Directory & Legal)**: 10 URLs (37.0%)
- **Tier C (Potentially Thin)**: 0 URLs (0%)
- **Tier D (Non-Indexable)**: 0 URLs (0%)

---

## 14. Remaining Known Issues / Future Work

- Expanding remaining calculators (HVAC BTU, WSFU) into the full 2-Pane Split CAD / Material Takeoff workspace layout in subsequent planned tasks.

---

## 15. Screenshot Inventory (Task 034J)

- `01_homepage_1440x900.png`
- `02_homepage_1920x1080.png`
- `03_homepage_390x844.png`
- `04_tools_directory_1440x900.png`
- `05_tools_directory_390x844.png`
- `06_concrete_calculator_1440x900.png`
- `07_concrete_calculator_390x844.png`
- `08_construction_suite_1440x900.png`

---

## 16. ESLint Result

- `✔ No ESLint warnings or errors`

---

## 17. TypeScript Result

- `tsc --noEmit` exited with code `0` (0 errors).

---

## 18. Vitest Test Count

- `392 / 392 passed` across 25 test files.

---

## 19. Production Build Result

- `32 static build outputs` generated successfully (27 public canonical URLs).
