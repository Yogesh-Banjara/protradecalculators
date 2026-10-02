export interface ToolCategory {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly status: "active" | "planned";
}

export interface ToolDefinition {
  readonly id: string;
  readonly title: string;
  readonly shortTitle?: string;
  readonly slug: string;
  readonly categoryId: string;
  readonly path: string;
  readonly description: string;
  readonly searchIntent?: string;
  readonly status: "active" | "planned";
  readonly lastModified?: string;
}

export const TOOL_CATEGORIES: readonly ToolCategory[] = [
  {
    id: "construction",
    name: "Construction & Framing",
    slug: "construction",
    description:
      "Calculators for concrete slabs, footings, lumber framing, roof pitch, rafters, stairs, and decks.",
    status: "active",
  },
  {
    id: "materials",
    name: "Materials & Takeoff",
    slug: "materials",
    description:
      "Estimating weights, bulk volume, gravel tonnage, drywall sheets, joint compound, and waste allowances.",
    status: "active",
  },
  {
    id: "electrical",
    name: "Electrical & Conduit",
    slug: "electrical",
    description:
      "Wire gauge sizing, voltage drop, conduit fill, electrical box fill, and service panel load calculations.",
    status: "active",
  },
  {
    id: "hvac",
    name: "HVAC & Airflow",
    slug: "hvac",
    description:
      "BTU sizing, heating & cooling loads, AC tonnage, duct sizing, CFM airflow, and ventilation calculators.",
    status: "active",
  },
  {
    id: "plumbing",
    name: "Plumbing & Drainage",
    slug: "plumbing",
    description:
      "Drainage fixture units (DFU), sanitary drain pipe sizing, soil stacks, building drains, and venting calculators.",
    status: "active",
  },
  {
    id: "landscaping",
    name: "Landscaping & Outdoor",
    slug: "landscaping",
    description:
      "Mulch, topsoil, paver base, retaining wall blocks, and lot grading calculators.",
    status: "planned",
  },
  {
    id: "pallet-freight",
    name: "Pallet & Freight",
    slug: "pallet-freight",
    description:
      "Pallet stacking patterns, container utilization, freight density, and dimensional weight.",
    status: "planned",
  },
  {
    id: "woodworking",
    name: "Woodworking & Joinery",
    slug: "woodworking",
    description:
      "Board footage, miter cuts, drawer slide spacing, and sheet good cut optimization.",
    status: "planned",
  },
] as const;

/**
 * Registry of tool definitions.
 */
export const TOOL_REGISTRY: readonly ToolDefinition[] = [
  {
    id: "concrete-calculator",
    title: "Concrete Calculator",
    slug: "concrete-calculator",
    categoryId: "construction",
    path: "/construction/concrete-calculator",
    description:
      "Calculate ready-mix concrete volume (cubic yards, cubic feet, cubic meters) and 40lb/60lb/80lb bags for slabs, footings, and round columns with waste allowance.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "gravel-calculator",
    title: "Gravel & Aggregate Calculator",
    slug: "gravel-calculator",
    categoryId: "materials",
    path: "/materials/gravel-calculator",
    description:
      "Calculate gravel, crushed stone, crusher run, and sand in tons, cubic yards, and truckloads with compaction and waste adjustments.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "framing-calculator",
    title: "Wall Framing & Stud Calculator",
    slug: "framing-calculator",
    categoryId: "construction",
    path: "/construction/framing-calculator",
    description:
      "Calculate wall studs (16\"/24\" OC), top and bottom plates, headers, king/jack studs, cripples, linear feet, and board feet for residential framing projects.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "drywall-calculator",
    title: "Drywall & Sheet Goods Calculator",
    slug: "drywall-calculator",
    categoryId: "materials",
    path: "/materials/drywall-calculator",
    description:
      "Calculate drywall sheets (4x8, 4x10, 4x12), 1/2\" and 5/8\" thickness, joint tape, joint compound/mud, and drywall screws with room and opening deductions.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "roof-pitch-calculator",
    title: "Roof Pitch & Rafter Calculator",
    slug: "roof-pitch-calculator",
    categoryId: "construction",
    path: "/construction/roof-pitch-calculator",
    description:
      "Calculate roof pitch (X/12, angle, grade), common rafter line length, overhang, ridge height, birdsmouth seat cuts, roof surface area, and roofing squares.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "rafter-calculator",
    title: "Roof Rafter Calculator",
    slug: "rafter-calculator",
    categoryId: "construction",
    path: "/construction/rafter-calculator",
    description:
      "Calculate common rafter length, theoretical line length, ridge board deductions, eave overhang, birdsmouth seat cuts, and IRC Section R802.7.1 notch limits.",
    status: "active",
    lastModified: "2026-10-02",
  },
  {
    id: "stair-calculator",
    title: "Stair Stringer & Riser Calculator",
    slug: "stair-calculator",
    categoryId: "construction",
    path: "/construction/stair-calculator",
    description:
      "Calculate stair riser height, tread depth, total run, stringer board length, bottom riser deduction, headroom clearance, and IRC prescriptive limits.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "deck-calculator",
    title: "Deck Material & Framing Calculator",
    slug: "deck-calculator",
    categoryId: "construction",
    path: "/construction/deck-calculator",
    description:
      "Calculate deck surface boards (composite and wood), joists (12\"/16\" OC), beams, sonotube pier footings, concrete bags, and hardware fasteners.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "voltage-drop-calculator",
    title: "Electrical Wire Size & Voltage Drop Calculator",
    slug: "voltage-drop-calculator",
    categoryId: "electrical",
    path: "/electrical/voltage-drop-calculator",
    description:
      "Calculate single-phase, 3-phase, and DC voltage drop, recommended AWG/kcmil wire gauge, copper vs aluminum comparisons, and NEC Table 310.16 ampacity derating.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "conduit-fill-calculator",
    title: "Electrical Conduit Fill Calculator",
    slug: "conduit-fill-calculator",
    categoryId: "electrical",
    path: "/electrical/conduit-fill-calculator",
    description:
      "Calculate mixed conductor conduit fill percentage (EMT, PVC Sch 40/80, RMC, FMC, LFMC), NEC Chapter 9 Table 1 limits, and jam ratio warnings.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "box-fill-calculator",
    title: "Electrical Box Fill Calculator",
    slug: "box-fill-calculator",
    categoryId: "electrical",
    path: "/electrical/box-fill-calculator",
    description:
      "Calculate electrical box fill cubic-inch capacity per NEC 314.16 for mixed wire gauges, devices, clamps, and grounds with candidate box recommendations.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "residential-load-calculator",
    title: "Residential Electrical Service Load Calculator",
    slug: "residential-load-calculator",
    categoryId: "electrical",
    path: "/electrical/residential-load-calculator",
    description:
      "Calculate total residential electrical service load (VA and Amps) per NEC Article 220.82 for 100A, 150A, 200A, and 400A service panel sizing with EV chargers and heat pumps.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "btu-calculator",
    title: "HVAC BTU Heating & Cooling Load Calculator",
    slug: "btu-calculator",
    categoryId: "hvac",
    path: "/hvac/btu-calculator",
    description:
      "Calculate heating and cooling BTU/hr loads, recommended AC tonnage (1.5 to 5 tons), mini-split sizing, and sensible/latent heat gains across climate zones.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "duct-sizing-calculator",
    title: "HVAC Duct Sizing & CFM Airflow Calculator",
    slug: "duct-sizing-calculator",
    categoryId: "hvac",
    path: "/hvac/duct-sizing-calculator",
    description:
      "Calculate round duct diameters, rectangular equivalent dimensions, air velocity (FPM), friction loss, and room branch distribution for HVAC systems.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "dfu-calculator",
    title: "Plumbing DFU & Drainage Pipe Sizing Calculator",
    slug: "dfu-calculator",
    categoryId: "plumbing",
    path: "/plumbing/dfu-calculator",
    description:
      "Calculate total drainage fixture units (DFU) and size horizontal branch drains, vertical soil stacks, and building drains/sewers per IPC and UPC standards.",
    status: "active",
    lastModified: "2026-09-01",
  },
  {
    id: "wsfu-calculator",
    title: "Water Supply Fixture Unit (WSFU) & Potable Pipe Sizing Calculator",
    slug: "wsfu-calculator",
    categoryId: "plumbing",
    path: "/plumbing/wsfu-calculator",
    description:
      "Calculate total water supply fixture units (WSFU), peak design flow (GPM) via Hunter's Curve, and size copper, PEX, and CPVC potable water main lines and branches per IPC and UPC.",
    status: "active",
    lastModified: "2026-09-01",
  },
] as const;
