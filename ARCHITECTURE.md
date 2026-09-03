# Architecture Decision Record: I Trade Hub Platform

## 1. Modular Monolith Strategy

We adhere to a **Modular Monolith** architecture. By centralizing core calculation math, conversion tables, validation rules, and tool definitions in a single clean repository, all calculators share the same battle-tested engineering layer without microservice network overhead.

```mermaid
graph TD
    Client[Browser / Jobsite Client] --> AppRouter[Next.js App Router]
    AppRouter --> CategoryHubs[Category Hubs: /categories/[category]]
    AppRouter --> ToolRoutes[Tool Routes]
    ToolRoutes --> ToolRunner[Tool Runner: executeTool]
    ToolRunner --> ToolDef[Tool Definitions & Input Schemas]
    ToolRunner --> Domain[Pure Domain Calculation Engine]
    subgraph Domain [Pure Domain Layer]
        Units[Unit Converter: 10 Physical Dimensions]
        Geometry[2D / 3D Geometry & Slope Engine]
        CostEngine[Cost & Waste Estimation Engine]
        Validation[Strict Input Validation Rules]
    end
    ToolRoutes --> Analytics[Vendor-Agnostic Analytics Bus]
    ToolRoutes --> SEO[Structured Data & Metadata Generator]
    ToolRoutes --> Print[Jobsite Worksheet Print System]
```

---

## 2. Calculation Engine First

1. **Separation from UI:** Domain calculation functions contain zero imports from React, JSX, or browser APIs.
2. **Determinism:** Pure functions produce identical results for identical inputs with no hidden state.
3. **Unit Safety:** Inputs are normalized to canonical SI base units before arithmetic, then converted to requested display units.
4. **Boundary Rounding:** IEEE-754 binary floating-point noise is cleaned up at output boundaries using epsilon-safe half-up rounding and trade purchasing increments.

---

## 3. Physical & Dimensional Units System

The unit converter (`src/lib/units/converter.ts`) implements exact international conversion constants across 10 categories:

| Category | SI Base Unit | Supported Conversion Units |
|---|---|---|
| **Length** | Meter ($m$) | Inch ($0.0254m$), Foot ($0.3048m$), Yard ($0.9144m$), Millimeter, Centimeter |
| **Area** | Square Meter ($m^2$) | Square Inch, Square Foot, Square Yard |
| **Volume** | Cubic Meter ($m^3$) | Cubic Inch, Cubic Foot, Cubic Yard, Liter, Gallon (US Liquid) |
| **Weight** | Kilogram ($kg$) | Ounce, Pound ($0.45359237kg$), Kilogram, Metric Ton, Short Ton ($2000\text{ lbs}$) |
| **Angle / Slope** | Radian ($rad$) | Degrees, Radians, Percent Grade, Standard $x:12$ Roof Pitch |
| **Temperature** | Kelvin ($K$) | Celsius, Fahrenheit, Kelvin |
| **Pressure** | Pascal ($Pa$) | PSI ($6894.757\text{ Pa}$), Bar ($100\text{ kPa}$), Pascal, kPa, Atmosphere |
| **Energy** | Joule ($J$) | Joule, Kilojoule, BTU ($1055.056\text{ J}$), Kilowatt-hour ($3.6\text{ MJ}$), Calorie |
| **Power** | Watt ($W$) | Watt, Kilowatt, Horsepower ($745.7\text{ W}$), BTU/hour |
| **Currency** | USD ($) | USD, CAD, EUR, GBP, AUD |

---

## 4. Declarative Tool Architecture

Every tool declares its entire specification using `ToolDefinition<TInput, TOutput>`:
- **Inputs Schema:** Strongly typed field definitions with min/max, default values, and allowed unit systems.
- **Pure Calculation:** Isolated mathematical transformation producing raw results, calculation steps, and practical jobsite warnings.
- **Output Fields:** Display formatting, unit associations, and hero metric flags.
- **Search Intent & FAQ:** Targeted FAQs matching user search intent for organic search relevance.
- **Related Tools:** Contextual clustering for semantic internal linking.

---

## 5. Analytics Abstraction

The platform uses a decoupled analytics bus (`src/lib/analytics/events.ts`). No vendor-specific SDK is hard-coded into UI components. The dispatcher dispatches structured events:
- `calculator_started`
- `calculator_completed`
- `result_generated`
- `print_clicked`
- `copy_result`
- `related_tool_clicked`
- `category_viewed`

---

## 6. Jobsite-Ready UI & Print Worksheet System

- **Accessible Components:** High-contrast buttons, inputs with unit addons, accessible select dropdowns, and data tables.
- **Print Optimization:** Dedicated `@media print` rules hide navigation, headers, and footer, transforming calculation outputs into clean, ink-friendly worksheets with project name and estimator signature lines.

---

## 7. SEO & URL Hierarchy

- **Category Hubs:** `/categories/[category]` (e.g. `/categories/construction`, `/categories/electrical`).
- **Dynamic Sitemap:** `src/app/sitemap.ts` dynamically indexes static routes, category hubs, and active registered tools.
- **JSON-LD Structured Data:** Automated `WebSite`, `Organization`, `WebPage`, `BreadcrumbList`, and `SoftwareApplication` schemas.
