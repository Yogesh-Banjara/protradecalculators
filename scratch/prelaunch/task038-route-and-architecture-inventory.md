# Task 038: Route & Architecture Pre-Launch Inventory

**Platform**: ProTrade Calculators  
**Production Domain**: `https://protradecalculators.com`  
**Audit Standard**: Production Build SSG / React 19 / Next.js 15.5 App Router  
**Audit Date**: 2026-09-03  

---

## 1. Public Route Inventory (33 Static Endpoints)

| Route Path | Route Type | Purpose & Search Intent | Rendering Strategy | Key Components |
| :--- | :---: | :--- | :---: | :--- |
| `/` | Core Static | Homepage, interactive multi-trade quick demonstrator, category index | SSG (Static) | `HomepageHero`, `InteractiveHeroDemo`, `CategoryGrid` |
| `/tools` | Core Static | Complete 15-tool trade directory with search & filter | SSG (Static) | `ToolsDirectoryFilter`, `ToolCard` |
| `/about` | Legal / Trust | Engineering methodology, deterministic calculation standards | SSG (Static) | `Container`, `AboutContent` |
| `/contact` | Legal / Trust | Editorial and calculation corrections contact form / details | SSG (Static) | `ContactForm`, `Container` |
| `/privacy` | Legal / Trust | Privacy policy, cookie-free notice, data handling terms | SSG (Static) | `LegalDocument` |
| `/terms` | Legal / Trust | Terms of service, engineering disclaimer, preliminary estimation notice | SSG (Static) | `LegalDocument` |
| `/categories/construction` | Category Hub | Construction & framing tools suite index | SSG (Static) | `CategorySuiteLayout`, `ToolCardGrid` |
| `/categories/materials` | Category Hub | Bulk materials, aggregates, drywall takeoff suite index | SSG (Static) | `CategorySuiteLayout`, `ToolCardGrid` |
| `/categories/electrical` | Category Hub | Wire sizing, conduit fill, box fill, residential load suite index | SSG (Static) | `CategorySuiteLayout`, `ToolCardGrid` |
| `/categories/hvac` | Category Hub | BTU loads, AC tonnage, duct sizing suite index | SSG (Static) | `CategorySuiteLayout`, `ToolCardGrid` |
| `/categories/plumbing` | Category Hub | DFU drainage and WSFU water supply pipe sizing suite index | SSG (Static) | `CategorySuiteLayout`, `ToolCardGrid` |
| `/construction/concrete-calculator` | Calculator Tool | Slabs, footings, columns volume & bag takeoff (40/60/80 lb) | SSG + Client Form | `ConcreteCalculatorForm`, `ConcreteIsometricDiagram` |
| `/construction/deck-calculator` | Calculator Tool | Decking surface boards, joists (12/16 OC), beams, pier footings | SSG + Client Form | `DeckCalculatorForm`, `DeckFramingDiagram` |
| `/construction/framing-calculator` | Calculator Tool | Wall studs (16/24 OC), top/bottom plates, headers, board feet | SSG + Client Form | `FramingCalculatorForm`, `FramingElevationDiagram` |
| `/construction/roof-pitch-calculator` | Calculator Tool | Rafter line length, birdsmouth cuts, pitch angles, roofing squares | SSG + Client Form | `RoofCalculatorForm`, `RoofDiagram` |
| `/construction/stair-calculator` | Calculator Tool | Rise & run, stringer board length, riser height, IRC compliance checks | SSG + Client Form | `StairCalculatorForm`, `StairCrossSectionDiagram` |
| `/materials/drywall-calculator` | Calculator Tool | 4x8 / 4x12 drywall sheets, joint compound mud buckets, screws, tape | SSG + Client Form | `DrywallCalculatorForm`, `DrywallRoomDiagram` |
| `/materials/gravel-calculator` | Calculator Tool | Gravel, crushed stone, crusher run tonnage, cubic yards & truckloads | SSG + Client Form | `GravelCalculatorForm`, `GravelCrossSectionDiagram` |
| `/electrical/box-fill-calculator` | Calculator Tool | NEC 314.16 cubic-inch volume allowance for conductors, devices, clamps | SSG + Client Form | `BoxFillCalculatorForm`, `BoxFillVisualizer` |
| `/electrical/conduit-fill-calculator` | Calculator Tool | NEC Ch. 9 mixed wire fill percentage across EMT, PVC, RMC, FMC | SSG + Client Form | `ConduitFillCalculatorForm`, `ConduitCrossSectionVisualizer` |
| `/electrical/residential-load-calculator` | Calculator Tool | NEC 220.82 service panel sizing (100A, 200A, 400A) & demand factors | SSG + Client Form | `ResidentialLoadCalculatorForm`, `ServiceDemandHUD` |
| `/electrical/voltage-drop-calculator` | Calculator Tool | 1-phase, 3-phase & DC voltage drop, conductor gauge, NEC 310.16 | SSG + Client Form | `VoltageDropCalculatorForm`, `ConductorGaugeVisualizer` |
| `/guides/subpanel-feeder-sizing` | Authority Guide | Worked engineering example for 100A subpanel feeder conductor sizing | SSG (Static) | `GuideArticleLayout`, `CalloutBox`, `CodeTable` |
| `/hvac/btu-calculator` | Calculator Tool | Manual J heating & cooling BTU/hr loads, AC tonnage (1.5–5 tons) | SSG + Client Form | `BtuCalculatorForm`, `ZoneHeatLoadHUD` |
| `/hvac/duct-sizing-calculator` | Calculator Tool | Equal friction round diameter, Huebscher rectangular size, FPM velocity | SSG + Client Form | `DuctSizingCalculatorForm`, `DuctProfileVisualizer` |
| `/plumbing/dfu-calculator` | Calculator Tool | IPC/UPC drainage fixture units, horizontal drain & stack pipe sizing | SSG + Client Form | `DfuCalculatorForm`, `DrainProfileVisualizer` |
| `/plumbing/wsfu-calculator` | Calculator Tool | IPC/UPC WSFU, Hunter's Curve GPM peak flow, copper/PEX supply lines | SSG + Client Form | `WsfuCalculatorForm`, `HydraulicGradeVisualizer` |
| `/robots.txt` | Technical Route | Crawler indexing directives & XML sitemap reference | Static Plaintext | Next.js Metadata Route (`src/app/robots.ts`) |
| `/sitemap.xml` | Technical Route | Complete XML index of 33 canonical URLs with priorities | Static XML | Next.js Metadata Route (`src/app/sitemap.ts`) |
| `/icon.svg` | Static Asset | Multi-resolution brand vector favicon | Static SVG | Next.js Vector Favicon (`src/app/icon.svg`) |
| `/_not-found` | Utility Route | Custom 404 error page with trade directory search link | SSG (Static) | `NotFoundLayout`, `Container` |

---

## 2. Component Architecture Inventory

### Shared UI Primitives (`src/components/ui/`)
- `Container`: Viewport-constrained layout wrapper ($1280\text{px}$ max width with responsive gutters).
- `Button`: Accessible interactive action button with hover, active, focus-visible, and disabled tokens.
- `Badge`: Status and trade category tag with semantic color modes (brand, outline, neutral).
- `Card`: Bordered visual container for forms, summaries, and result HUD panels.
- `Input`: Number and text input primitive with label association and focus rings.
- `Select`: Native and custom dropdown select with keyboard navigation support.
- `Slider`: Stepped numeric range input for interactive parameter tuning.
- `Tabs`: Accessible tabbed navigation interface for multi-mode calculators.
- `Table`: Responsive tabular presentation for takeoff bills of materials.
- `Breadcrumb`: Structured breadcrumb navigation with microdata markup.
- `PrintButton` & `JobsitePrintHeader`: Dedicated clean print styles for field worksheets.

### Shell Layout Wrappers
- `CalculatorShell` (`src/components/ui/calculator-shell.tsx`): Single-column full-width calculator workspace.
- `WorkspaceShell` (`src/components/workspace/workspace-shell.tsx`): 2-pane workbench split layout with sticky visualizer/HUD.

### Client vs Server Component Boundaries
- **Server Components (SSG)**: Root `layout.tsx`, page shell wrappers, category hubs, static marketing content, article guides, JSON-LD injectors.
- **Client Components (`"use client"`)**: Calculator interactive forms (`*-form.tsx`), dynamic Canvas/SVG visualizers (`*-diagram.tsx`), interactive demo widgets (`demo-calculator.tsx`), print buttons.

---

## 3. Dependency, Asset & Runtime Inventory

### JavaScript Dependencies (`package.json`)
- `react` & `react-dom` (`^19.0.0`): React 19 runtime with server component compilation.
- `next` (`^15.1.7`): Next.js 15.5 App Router with static generation.
- `lucide-react` (`^0.475.0`): Tree-shaken SVG iconography.
- `clsx` & `tailwind-merge`: Zero-runtime utility classes merging.
- **Zero Heavy 3D / WebGL Engines**: No Three.js, No Cannon.js, No heavy unoptimized physics engines.

### Typography & Asset Delivery
- System font stack prioritizing native system performance (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- Zero external font network requests ($0\text{ bytes}$ external webfont latency).
- Vector SVG visualizers rendered directly inline with reactive viewBox calculations.

### Structured Data & Analytics
- **Structured Data**: `WebSite`, `Organization`, `WebPage`, `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`.
- **Analytics Abstraction**: Self-contained event dispatcher in `src/lib/analytics/events.ts`. Zero invasive third-party ad-network trackers or unconsented tracking cookies.

---
