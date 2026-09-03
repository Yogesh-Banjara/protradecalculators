# Task 034E: Performance & Core Web Vitals Audit

**Document Version**: 1.0  
**Audit Target**: Ultra-low Time to Interactive (TTI), zero Cumulative Layout Shift (CLS), and lean JavaScript bundles.

---

## 1. Visual Asset Architecture

- **Vector-First Strategy**: 100% of interactive diagrams (Concrete isometric slab, Framing wall elevation, Stair sawtooth stringer, Conduit circular packing, Plumbing sanitary stack, HVAC building envelope, Deck structural framing) are constructed using pure **Inline SVG**.
- **Raster Image Footprint**: The production application uses **0 raster bitmap images (JPEG/PNG/WebP)** for UI rendering. Zero heavy image assets are downloaded over the wire during standard calculation workflows.
- **Payload Benefits**:
  - Total first-load shared JS across all routes: **103 kB** (gzip ~33 kB).
  - Average calculator page size: **11.5 kB – 14 kB**.
  - Total static build size: **<1.5 MB** across the entire platform.

---

## 2. Font Loading & Typography

- **System & Native Font Stack**: Inter and JetBrains Mono loaded via Next.js `next/font` with `font-display: swap`.
- **Zero External Third-Party Web Fonts**: No Google Fonts or Adobe Typekit render-blocking HTTP requests.
- **Layout Shift (CLS)**: Zero font-swap shift because fallbacks are matched in metric height.

---

## 3. Client-Side JavaScript & Component Hydration

- **Hydration Boundary Optimization**:
  - Route wrapper pages (`page.tsx`) remain **React Server Components (RSC)** where possible, delivering static pre-rendered HTML and SEO schema directly from the server.
  - Interactive forms (`*-form.tsx`) and diagrams (`*-diagram.tsx`) are isolated client boundaries (`"use client"`).
- **Zero Heavy Graphing / 3D Libraries**: No Three.js, Canvas2D bloat, Chart.js, or heavyweight graphing engines. All parametric visualizations run on native React state and SVG DOM attributes.

---

## 4. Layout Shift (CLS) Risk Assessment

- **Aspect Ratio Boxes**: All SVG blueprint viewports define explicit aspect ratios (e.g. `aspect-[16/10] max-h-[360px]`) and fixed `viewBox` coordinates (`viewBox="0 0 600 360"`), preventing content reflow or jumping during client hydration.
- **Input Docks**: Pre-calculated min-height containers ensure that progressive disclosure drawers expand gracefully without causing sudden viewport shifts.

---

## 5. AdSense-Safe Layout Architecture & Zone Preparation

To prepare for future Google AdSense integration without compromising Core Web Vitals, user utility, or calculator performance:
- **Dedicated Non-Intrusive Ad Slots**:
  - `Zone A`: Below the primary calculation workspace and above the methodology section.
  - `Zone B`: Within long-form technical explanation sections with reserved height containers.
  - `Zone C`: Below related tools and FAQ sections.
- **Zero Layout Shift Guaranteed**: Future ad units must be wrapped in fixed min-height containers (`min-h-[250px]`) to eliminate CLS when ads render.
- **Current State**: The newly designed `<AdSlot />` and `<ContentAdSlot />` components remain **completely disabled (`return null`)** in production. No fake ads, no placeholder images, and no third-party ad scripts are active.
