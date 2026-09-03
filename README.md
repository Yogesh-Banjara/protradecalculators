# I Trade Hub (Construction & Trade Tools)

A free, open, and deterministic web application providing precision calculators, material takeoff estimators, and jobsite worksheets for contractors, tradespeople, engineers, and DIY builders.

---

## 🏗️ Project Overview & Business Model

- **Primary Monetization:** Google AdSense (Target: $500+/month within 12 months; zero ads during foundation phase).
- **Primary Acquisition:** Organic search via topical authority and search intent satisfaction.
- **Explicit Constraints:**
  - No paid traffic or artificial backlink outreach.
  - No user accounts, authentication, or paywalls.
  - Pure domain calculation engine decoupled from React UI.
  - Zero placeholder implementations or premature microservices.

---

## 📁 Modular Monolith Architecture

```
src/
├── app/                      # Next.js App Router (Server Components by default)
│   ├── categories/           # Category Hubs (/categories/construction, etc.)
│   ├── about/                # Standards, methodology, and transparency
│   ├── contact/              # Feedback and bug reporting
│   ├── privacy/              # Neutral privacy policy
│   ├── terms/                # Terms of Service & trade disclaimers
│   ├── tools/                # All Tools Directory
│   ├── globals.css           # Tailwind base styles, focus rings & print styles
│   ├── layout.tsx            # Global layout with schema and header/footer
│   ├── not-found.tsx         # Accessible 404 handler
│   ├── page.tsx              # Platform Homepage
│   ├── robots.ts             # Dynamic robots.txt
│   └── sitemap.ts            # Dynamic sitemap.xml with static & category routes
├── components/
│   ├── layout/               # Header, Footer, Breadcrumbs, CategoryNav, RelatedTools
│   ├── seo/                  # JsonLd structured data injector
│   └── ui/                   # Reusable accessible design system primitives
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── container.tsx
│       ├── form-field.tsx
│       ├── input.tsx
│       ├── print-view.tsx
│       ├── result-panel.tsx
│       ├── select.tsx
│       └── table.tsx
├── config/                   # Site-wide settings (siteConfig, URLs, nav)
├── data/                     # Typed static datasets
│   ├── materials/            # Densities (concrete, aggregate, soil, lumber)
│   └── references/           # Slopes, roof pitches, tool registry
├── lib/                      # Pure domain layer (Decoupled from UI)
│   ├── analytics/            # Vendor-agnostic event bus (calculator_started, print, etc.)
│   ├── calculations/         # Pure geometry, volume, area, waste, rounding, cost
│   ├── seo/                  # OpenGraph, metadata, and JSON-LD builders
│   ├── tools/                # Tool definition registry & execution runner
│   ├── units/                # SI base unit converters & formatters (all categories)
│   └── validation/           # Input validation rules & error handling
└── types/                    # Strict TypeScript definitions
```

---

## 🧮 Calculation Engine & Physical Dimensions

The calculation engine supports 10 distinct physical and dimensional measurement categories:

| Dimension | Supported Units |
|---|---|
| **Length** | Inch, Foot, Yard, Millimeter, Centimeter, Meter |
| **Area** | Square Inch, Square Foot, Square Yard, Square Meter |
| **Volume** | Cubic Inch, Cubic Foot, Cubic Yard, Liter, Gallon (US Liquid) |
| **Weight** | Ounce, Pound, Kilogram, Metric Ton, Short Ton |
| **Slope / Angle** | Degrees, Radians, Percent Grade, Standard $x:12$ Roof Pitch |
| **Temperature** | Celsius (°C), Fahrenheit (°F), Kelvin (K) |
| **Pressure** | PSI, Bar, Pascal, Kilopascal (kPa), Atmosphere (atm) |
| **Energy** | Joule, Kilojoule, BTU (IT), Kilowatt-hour (kWh), Calorie |
| **Power** | Watt, Kilowatt, Horsepower (HP), BTU/hour |
| **Currency & Cost**| USD, CAD, EUR, GBP, AUD, Material Unit Cost, Labor, Tax, Waste Overhead |

---

## 🛠️ Tool Architecture System

Tools are declared using the declarative `ToolDefinition<TInput, TOutput>` interface:
1. **Inputs Declaration:** Field ID, label, input type (`number`, `select`, `boolean`), min/max bounds, default units, and allowed unit conversions.
2. **Deterministic Calculation:** Pure function `(input: TInput) => { values: TOutput, steps: CalculationStep[], warnings: CalculationWarning[] }`.
3. **Outputs Declaration:** Field ID, label, display units, hero metric designation, and precision formatting.
4. **Search Intent & SEO:** Integrated FAQs, keywords, and JSON-LD structured data.
5. **Execution Runner (`executeTool`):** Type-safe input validation and execution pipeline.

---

## 📊 Analytics Abstraction

The analytics bus dispatches typed lifecycle events to pluggable handlers:
- `calculator_started`
- `calculator_completed`
- `result_generated`
- `print_clicked`
- `copy_result`
- `related_tool_clicked`
- `category_viewed`

---

## 🚀 Development & Validation Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server |
| `npm run typecheck` | Runs `tsc --noEmit` for strict type checking |
| `npm run lint` | Runs ESLint validation |
| `npm run test` | Runs Vitest unit and integration test suite |
| `npm run build` | Produces production build with 100% static generation |
| `npm run start` | Starts production server |
