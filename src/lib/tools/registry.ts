import type { ToolCategoryInfo, ToolDefinition, ToolCategoryId } from "@/types/tools";

export const TOOL_CATEGORIES: readonly ToolCategoryInfo[] = [
  {
    id: "construction",
    name: "Construction & Framing",
    slug: "construction",
    description:
      "Calculators for concrete slabs, footings, lumber framing, roof pitch, rafters, stairs, and decks.",
    iconName: "HardHat",
    status: "active",
  },
  {
    id: "materials",
    name: "Materials & Takeoff",
    slug: "materials",
    description:
      "Estimating bulk aggregate, gravel tonnage, crushed stone, drywall sheets, joint compound, sand, topsoil, and waste allowances.",
    iconName: "Layers",
    status: "active",
  },
  {
    id: "electrical",
    name: "Electrical & Conduit",
    slug: "electrical",
    description:
      "Wire gauge sizing, voltage drop, conduit fill, and electrical box fill calculations.",
    iconName: "Zap",
    status: "active",
  },
  {
    id: "hvac",
    name: "HVAC & Airflow",
    slug: "hvac",
    description:
      "BTU sizing, heating & cooling loads, AC tonnage, duct sizing, CFM airflow, and ventilation calculators.",
    iconName: "Wind",
    status: "active",
  },
  {
    id: "plumbing",
    name: "Plumbing & Drainage",
    slug: "plumbing",
    description:
      "Drainage fixture units (DFU), sanitary drain pipe sizing, soil stacks, building drains, and venting calculators.",
    iconName: "Droplets",
    status: "active",
  },
  {
    id: "landscaping",
    name: "Landscaping & Outdoor",
    slug: "landscaping",
    description:
      "Mulch, topsoil, paver base, retaining wall blocks, and lot grading calculators.",
    iconName: "Trees",
    status: "planned",
  },
  {
    id: "pallet-freight",
    name: "Pallet & Freight",
    slug: "pallet-freight",
    description:
      "Pallet stacking patterns, container utilization, freight density, and dimensional weight.",
    iconName: "Box",
    status: "planned",
  },
  {
    id: "woodworking",
    name: "Woodworking & Joinery",
    slug: "woodworking",
    description:
      "Board footage, miter cuts, drawer slide spacing, and sheet good cut optimization.",
    iconName: "Axe",
    status: "planned",
  },
] as const;

/**
 * Registry of tool definitions.
 */
export const REGISTERED_TOOLS: readonly ToolDefinition[] = [
  {
    id: "concrete-calculator",
    slug: "concrete-calculator",
    categoryId: "construction",
    title: "Concrete Calculator",
    shortTitle: "Concrete",
    description:
      "Calculate ready-mix concrete volume (cubic yards, cubic feet, cubic meters) and 40lb/60lb/80lb bags for slabs, footings, and round columns with waste allowance.",
    searchIntent: "Calculate concrete volume in cubic yards for slabs, footings, and columns",
    status: "active",
    relatedToolSlugs: ["gravel-calculator", "deck-calculator"],
    inputs: [
      {
        id: "length",
        label: "Length",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "width",
        label: "Width",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "depth",
        label: "Thickness / Depth",
        type: "number",
        required: true,
        defaultUnit: "inch",
      },
    ],
    outputs: [
      {
        id: "totalVolumeCuYd",
        label: "Recommended Ready-Mix Concrete",
        unit: "cu yd",
        isPrimary: true,
        precision: 2,
      },
      {
        id: "totalVolumeCuFt",
        label: "Total Volume",
        unit: "cu ft",
        precision: 2,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Concrete Calculator - Slabs, Footings & Columns in Yards",
      description:
        "Free concrete calculator to estimate ready-mix cubic yards, cubic feet, and 40lb/60lb/80lb bags for slabs, footings, and round piers with custom waste factors.",
      keywords: [
        "concrete calculator",
        "calculate concrete yards",
        "concrete slab calculator",
        "concrete footing calculator",
        "how many bags of concrete",
        "cubic yards concrete",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "gravel-calculator",
    slug: "gravel-calculator",
    categoryId: "materials",
    title: "Gravel & Aggregate Calculator",
    shortTitle: "Gravel & Aggregate",
    description:
      "Calculate gravel, crushed stone, #57 stone, crusher run, and sand in tons, cubic yards, and truckloads with compaction and waste adjustments.",
    searchIntent: "Calculate gravel and aggregate tonnage, cubic yards, and truckloads for driveways and paths",
    status: "active",
    relatedToolSlugs: ["concrete-calculator"],
    inputs: [
      {
        id: "length",
        label: "Length",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "width",
        label: "Width",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "depth",
        label: "Depth / Thickness",
        type: "number",
        required: true,
        defaultUnit: "inch",
      },
    ],
    outputs: [
      {
        id: "totalTons",
        label: "Total Weight (Short Tons)",
        unit: "tons",
        isPrimary: true,
        precision: 2,
      },
      {
        id: "adjustedVolumeCuYd",
        label: "Order Volume",
        unit: "cu yd",
        precision: 2,
      },
      {
        id: "loadsRequired",
        label: "Estimated Truckloads",
        unit: "loads",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Gravel & Aggregate Calculator - Tons, Yards & Truckloads",
      description:
        "Free gravel and aggregate calculator to estimate tons, cubic yards, and dump truckloads for driveways, paths, and sub-bases with compaction allowance.",
      keywords: [
        "gravel calculator",
        "gravel tonnage calculator",
        "calculate gravel tons",
        "crushed stone calculator",
        "how many tons of gravel",
        "crusher run calculator",
        "gravel driveway calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "framing-calculator",
    slug: "framing-calculator",
    categoryId: "construction",
    title: "Wall Framing & Stud Calculator",
    shortTitle: "Framing & Studs",
    description:
      "Calculate wall studs (16\"/24\" OC), top and bottom plates, headers, king/jack studs, cripples, linear feet, and board feet for residential framing projects.",
    searchIntent: "Calculate wall studs on center, framing lumber, plates, and headers for room framing",
    status: "active",
    relatedToolSlugs: ["drywall-calculator", "roof-pitch-calculator"],
    inputs: [
      {
        id: "lengthFt",
        label: "Wall Length",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "heightFt",
        label: "Wall Height",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "totalStudsWithWaste",
        label: "Total Studs (with Waste)",
        unit: "studs",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "totalPlateBoards",
        label: "Total Plate Boards",
        unit: "boards",
        precision: 0,
      },
      {
        id: "totalBoardFeet",
        label: "Total Board Feet",
        unit: "BF",
        precision: 1,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Wall Framing & Stud Calculator - Studs, Plates & Headers",
      description:
        "Free wall framing calculator to estimate 16\" and 24\" on-center studs, top/bottom plates, door/window headers, cripples, linear feet, and board feet.",
      keywords: [
        "framing calculator",
        "stud calculator",
        "wall stud calculator",
        "16 inch on center calculator",
        "how many studs for wall",
        "framing lumber calculator",
        "board feet calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "drywall-calculator",
    slug: "drywall-calculator",
    categoryId: "materials",
    title: "Drywall & Sheet Goods Calculator",
    shortTitle: "Drywall & Mud",
    description:
      "Calculate drywall sheets (4x8, 4x10, 4x12), 1/2\" and 5/8\" thickness, joint tape, joint compound/mud, and drywall screws with room and opening deductions.",
    searchIntent: "Calculate drywall sheets, joint tape, joint compound mud, and screws for rooms and ceilings",
    status: "active",
    relatedToolSlugs: ["framing-calculator"],
    inputs: [
      {
        id: "lengthFt",
        label: "Room Length",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "widthFt",
        label: "Room Width",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "heightFt",
        label: "Ceiling Height",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "sheetsRequired",
        label: "Drywall Sheets Needed",
        unit: "sheets",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "compoundBuckets4_5Gal",
        label: "Joint Compound Buckets (4.5 gal)",
        unit: "buckets",
        precision: 0,
      },
      {
        id: "tapeRolls500Ft",
        label: "Joint Tape Rolls (500 ft)",
        unit: "rolls",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Drywall Calculator - Sheet Count, Mud, Tape & Screws",
      description:
        "Free drywall calculator to estimate 4x8, 4x10, and 4x12 sheets, joint compound buckets, joint tape rolls, and drywall screws with opening deductions.",
      keywords: [
        "drywall calculator",
        "sheetrock calculator",
        "how many drywall sheets",
        "drywall mud calculator",
        "drywall joint tape calculator",
        "drywall screw calculator",
        "sheet goods estimator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "roof-pitch-calculator",
    slug: "roof-pitch-calculator",
    categoryId: "construction",
    title: "Roof Pitch & Slope Calculator",
    shortTitle: "Roof Pitch & Slope",
    description:
      "Calculate roof pitch (X/12, angle, grade), slope factor, roof surface area, and roofing squares with shingle bundle counts.",
    searchIntent: "Calculate roof pitch slope angle, rise per foot, roof surface area, and roofing squares",
    status: "active",
    relatedToolSlugs: ["rafter-calculator", "framing-calculator"],
    inputs: [
      {
        id: "buildingWidthFt",
        label: "Building Span (Width)",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "buildingLengthFt",
        label: "Building Length",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "pitchIn12",
        label: "Roof Pitch (X/12)",
        type: "number",
        required: true,
      },
    ],
    outputs: [
      {
        id: "roofPitchAngleFormatted",
        label: "Roof Pitch Angle",
        unit: "deg",
        isPrimary: true,
      },
      {
        id: "roofingSquares",
        label: "Roofing Squares (100 sq ft)",
        unit: "sq",
        precision: 2,
      },
      {
        id: "shingleBundlesCount",
        label: "Shingle Bundles Needed",
        unit: "bundles",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Roof Pitch Calculator - Pitch Angles, Slope Factor & Squares",
      description:
        "Free roof pitch calculator to calculate slope angle, roof grade percentage, pitch multiplier, roof surface area, and roofing squares.",
      keywords: [
        "roof pitch calculator",
        "roof slope calculator",
        "roof angle calculator",
        "calculate roof slope",
        "roof grade percentage",
        "roofing squares calculator",
        "how many bundles of shingles",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "rafter-calculator",
    slug: "rafter-calculator",
    categoryId: "construction",
    title: "Roof Rafter Length & Cut Calculator",
    shortTitle: "Rafter Length & Cut",
    description:
      "Calculate common rafter length, theoretical line length, ridge deduction, eave overhang, birdsmouth seat/plumb cuts, and IRC R802.7.1 notching limits.",
    searchIntent: "Calculate common rafter length, birdsmouth cuts, ridge deduction, and rafter cut schedule",
    status: "active",
    relatedToolSlugs: ["roof-pitch-calculator", "framing-calculator"],
    inputs: [
      {
        id: "buildingSpanFt",
        label: "Building Span",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "pitchIn12",
        label: "Roof Pitch (X/12)",
        type: "number",
        required: true,
      },
      {
        id: "eaveOverhangInches",
        label: "Eave Overhang",
        type: "number",
        defaultUnit: "inch",
      },
      {
        id: "seatCutBearingInches",
        label: "Top Plate Bearing",
        type: "number",
        defaultUnit: "inch",
      },
    ],
    outputs: [
      {
        id: "totalCutRafterLengthFt",
        label: "Total Rafter Cut Length",
        unit: "ft",
        isPrimary: true,
        precision: 2,
      },
      {
        id: "rafterLineLengthInches",
        label: "Line Length",
        unit: "in",
        precision: 2,
      },
      {
        id: "birdsmouthPlumbCut",
        label: "Birdsmouth Plumb Cut",
        unit: "in",
        precision: 2,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Rafter Calculator - Roof Rafter Length & Cut Schedule",
      description:
        "Free rafter calculator to calculate common rafter length, line length, ridge deduction, eave overhang, birdsmouth cuts, and IRC R802.7.1 notching limits.",
      keywords: [
        "rafter calculator",
        "roof rafter length calculator",
        "common rafter calculator",
        "how to calculate rafter length",
        "birdsmouth cut calculator",
        "rafter pitch calculator",
        "rafter angle calculator",
        "framing square rafter table",
        "IRC rafter notch limits",
        "roof framing calculator",
      ],
    },
    lastModified: "2026-10-02",
  },
  {
    id: "stair-calculator",
    slug: "stair-calculator",
    categoryId: "construction",
    title: "Stair Stringer & Riser Calculator",
    shortTitle: "Stair Stringers & Risers",
    description:
      "Calculate stair riser height, tread depth, total run, stringer board length, bottom riser deduction, headroom clearance, and IRC prescriptive limits.",
    searchIntent: "Calculate stair stringer cuts, riser height, tread depth, and stair run layout",
    status: "active",
    relatedToolSlugs: ["deck-calculator", "framing-calculator"],
    inputs: [
      {
        id: "totalRiseInches",
        label: "Total Rise (Vertical Height)",
        type: "number",
        required: true,
        defaultUnit: "inch",
      },
      {
        id: "targetRiserHeightInches",
        label: "Target Riser Height",
        type: "number",
        defaultUnit: "inch",
      },
      {
        id: "targetTreadDepthInches",
        label: "Target Tread Depth",
        type: "number",
        defaultUnit: "inch",
      },
    ],
    outputs: [
      {
        id: "exactRiserHeightFormatted",
        label: "Exact Riser Height",
        unit: "in",
        isPrimary: true,
      },
      {
        id: "totalRunFormatted",
        label: "Total Stair Run",
        unit: "ft/in",
      },
      {
        id: "stringerMinBoardLengthFt",
        label: "Stringer Stock Board Length",
        unit: "ft",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Stair Calculator - Stringer Layout, Rise & Run, Riser Height",
      description:
        "Free stair calculator to calculate exact riser height, tread depth, total run, stringer cut layout, bottom riser drop, headroom, and IRC code rules.",
      keywords: [
        "stair calculator",
        "stair stringer calculator",
        "how to calculate stair risers",
        "stair rise and run calculator",
        "stair stringer layout",
        "stair headroom calculator",
        "2x12 stringer length",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "deck-calculator",
    slug: "deck-calculator",
    categoryId: "construction",
    title: "Deck Material & Framing Calculator",
    shortTitle: "Decking & Framing",
    description:
      "Calculate deck surface boards (composite and wood), joists (12\"/16\" OC), beams, sonotube pier footings, concrete bags, and hardware fasteners.",
    searchIntent: "Calculate deck boards, joists, beams, concrete pier footings, and hardware takeoff",
    status: "active",
    relatedToolSlugs: ["concrete-calculator", "framing-calculator", "stair-calculator"],
    inputs: [
      {
        id: "lengthFt",
        label: "Deck Length (along house)",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "widthFt",
        label: "Deck Width (projection)",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "totalStockBoardsRequired",
        label: "Deck Surface Boards",
        unit: "boards",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "fieldJoistsCount",
        label: "Field Joists Needed",
        unit: "joists",
        precision: 0,
      },
      {
        id: "concreteBags80Lb",
        label: "Concrete Bags for Footings (80 lb)",
        unit: "bags",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Deck Calculator - Material, Board Count & Framing Takeoff",
      description:
        "Estimate deck boards, 12\" and 16\" OC joists, beams, concrete pier footings, and hardware. Calculate composite or wood decking material needs with instant takeoff.",
      keywords: [
        "deck calculator",
        "deck material calculator",
        "deck board calculator",
        "how many deck boards do i need",
        "deck framing calculator",
        "deck joist calculator",
        "deck footing calculator",
        "deck lumber estimator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "voltage-drop-calculator",
    slug: "voltage-drop-calculator",
    categoryId: "electrical",
    title: "Electrical Wire Size & Voltage Drop Calculator",
    shortTitle: "Voltage Drop & Wire Size",
    description:
      "Calculate single-phase, 3-phase, and DC voltage drop, recommended AWG/kcmil wire gauge, copper vs aluminum comparisons, and NEC Table 310.16 ampacity derating.",
    searchIntent: "Calculate voltage drop percentage, recommended wire gauge size, and conductor ampacity",
    status: "active",
    relatedToolSlugs: ["conduit-fill-calculator", "residential-load-calculator"],
    inputs: [
      {
        id: "voltage",
        label: "Voltage (V)",
        type: "number",
        required: true,
        defaultUnit: "volt",
      },
      {
        id: "loadCurrentAmps",
        label: "Load Current (Amps)",
        type: "number",
        required: true,
        defaultUnit: "ampere",
      },
      {
        id: "distanceFt",
        label: "One-Way Distance (ft)",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "recommendedSize",
        label: "Recommended Conductor Size",
        unit: "AWG/kcmil",
        isPrimary: true,
      },
      {
        id: "voltageDropPercent",
        label: "Voltage Drop (%)",
        unit: "%",
        precision: 2,
      },
      {
        id: "voltageAtLoad",
        label: "Voltage at Load",
        unit: "V",
        precision: 2,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Voltage Drop & Wire Size Calculator - NEC 3% Sizing",
      description:
        "Calculate single-phase, 3-phase, and DC voltage drop, percent loss, and recommended AWG wire size. Sized for NEC 3% branch limits and copper vs aluminum.",
      keywords: [
        "voltage drop calculator",
        "wire size calculator",
        "wire gauge calculator",
        "electrical wire size calculator",
        "120v voltage drop calculator",
        "240v voltage drop calculator",
        "wire size for 100 amp subpanel",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "conduit-fill-calculator",
    slug: "conduit-fill-calculator",
    categoryId: "electrical",
    title: "Electrical Conduit Fill Calculator",
    shortTitle: "Conduit Fill & Capacity",
    description:
      "Calculate mixed conductor conduit fill percentage (EMT, PVC Sch 40/80, RMC, FMC, LFMC), NEC Chapter 9 Table 1 limits, and jam ratio warnings.",
    searchIntent: "Calculate conduit fill percentage, trade size, and maximum wire capacity for mixed conductor bundles",
    status: "active",
    relatedToolSlugs: ["voltage-drop-calculator", "box-fill-calculator"],
    inputs: [
      {
        id: "conduitType",
        label: "Conduit Type",
        type: "select",
        required: true,
      },
    ],
    outputs: [
      {
        id: "recommendedTradeSize",
        label: "Recommended Conduit Trade Size",
        unit: "in",
        isPrimary: true,
      },
      {
        id: "actualFillPercentage",
        label: "Actual Fill Percentage",
        unit: "%",
        precision: 2,
      },
      {
        id: "totalConductorAreaSqIn",
        label: "Total Conductor Area",
        unit: "sq in",
        precision: 4,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Conduit Fill Calculator - NEC Chapter 9 Wire Capacity",
      description:
        "Calculate conduit fill percentage and trade size for mixed wire gauges in EMT, PVC, RMC, and FMC. Calibrated to NEC Chapter 9 Tables 1, 4, and 5.",
      keywords: [
        "conduit fill calculator",
        "emt conduit fill calculator",
        "pvc conduit fill calculator",
        "mixed wire conduit fill",
        "nec conduit fill table",
        "how many wires in conduit",
        "wire fill calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "box-fill-calculator",
    slug: "box-fill-calculator",
    categoryId: "electrical",
    title: "Electrical Box Fill Calculator",
    shortTitle: "Box Fill & Capacity",
    description:
      "Calculate electrical box fill cubic-inch capacity per NEC 314.16 for mixed wire gauges, devices, clamps, and grounds with candidate box recommendations.",
    searchIntent: "Calculate electrical box fill volume in cubic inches, device yoke allowances, and box size recommendations per NEC 314.16",
    status: "active",
    relatedToolSlugs: ["conduit-fill-calculator", "voltage-drop-calculator"],
    inputs: [
      {
        id: "selectedBoxId",
        label: "Box Type",
        type: "select",
        required: true,
      },
    ],
    outputs: [
      {
        id: "totalRequiredVolumeCuIn",
        label: "Total Required Box Volume",
        unit: "cu in",
        isPrimary: true,
        precision: 2,
      },
      {
        id: "totalAvailableVolumeCuIn",
        label: "Total Available Box Volume",
        unit: "cu in",
        precision: 2,
      },
      {
        id: "fillPercentage",
        label: "Box Fill Percentage",
        unit: "%",
        precision: 1,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Electrical Box Fill Calculator - NEC 314.16 Volume Sizing",
      description:
        "Calculate electrical box fill cubic inches per NEC 314.16. Size standard metal and plastic boxes for mixed wire gauges, device yokes, clamps, and grounds.",
      keywords: [
        "electrical box fill calculator",
        "box fill calculator",
        "nec box fill calculator",
        "nec 314.16 calculator",
        "how to calculate box fill",
        "4x4 box fill capacity",
        "junction box volume calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "btu-calculator",
    slug: "btu-calculator",
    categoryId: "hvac",
    title: "HVAC BTU Heating & Cooling Load Calculator",
    shortTitle: "BTU & AC Tonnage",
    description:
      "Calculate heating and cooling BTU/hr loads, recommended AC tonnage (1.5 to 5 tons), mini-split sizing, and sensible/latent heat gains across climate zones.",
    searchIntent: "Calculate cooling and heating BTU/hr, AC tonnage, and mini-split heat pump capacity for rooms and homes",
    status: "active",
    relatedToolSlugs: ["duct-sizing-calculator"],
    inputs: [
      {
        id: "floorAreaSqFt",
        label: "Floor Area",
        type: "number",
        required: true,
        defaultUnit: "foot",
      },
      {
        id: "ceilingHeightFt",
        label: "Ceiling Height",
        type: "number",
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "coolingLoadBtuHr",
        label: "Total Cooling Load",
        unit: "BTU/hr",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "recommendedCoolingTons",
        label: "Recommended AC Tonnage",
        unit: "Tons",
        precision: 1,
      },
      {
        id: "heatingLoadBtuHr",
        label: "Total Heating Load",
        unit: "BTU/hr",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "HVAC BTU Calculator - Heating & Cooling Load, AC Tonnage",
      description:
        "Free HVAC BTU calculator to estimate heating and cooling BTU loads, AC tonnage (1.5 to 5 tons), mini-split capacity, and sensible/latent heat gains by climate zone.",
      keywords: [
        "hvac btu calculator",
        "btu calculator",
        "ac btu calculator",
        "heating and cooling load calculator",
        "ac tonnage calculator",
        "mini split sizing calculator",
        "how many btu for house",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "duct-sizing-calculator",
    slug: "duct-sizing-calculator",
    categoryId: "hvac",
    title: "HVAC Duct Sizing & CFM Airflow Calculator",
    shortTitle: "Duct Sizing & CFM",
    description:
      "Calculate round duct diameters, rectangular equivalent dimensions, air velocity (FPM), friction loss, and room branch distribution for HVAC systems.",
    searchIntent: "Calculate HVAC duct size, round duct diameter, rectangular equivalent dimensions, and CFM airflow velocity",
    status: "active",
    relatedToolSlugs: ["btu-calculator"],
    inputs: [
      {
        id: "targetCfm",
        label: "Airflow (CFM)",
        type: "number",
        required: true,
      },
    ],
    outputs: [
      {
        id: "recommendedStandardDiameterInches",
        label: "Recommended Round Duct Size",
        unit: "in",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "actualRoundVelocityFpm",
        label: "Air Velocity",
        unit: "FPM",
        precision: 0,
      },
      {
        id: "rectangularDimensions",
        label: "Rectangular Equivalent",
        unit: "in × in",
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "HVAC Duct Sizing Calculator - CFM, Round & Rectangular Size",
      description:
        "Free HVAC duct sizing calculator. Calculate round duct diameters, rectangular equivalents (Huebscher), velocity (FPM), friction loss, and room branch CFM schedules.",
      keywords: [
        "duct sizing calculator",
        "duct size calculator",
        "duct cfm calculator",
        "hvac duct sizing calculator",
        "air duct sizing calculator",
        "round duct size calculator",
        "rectangular duct sizing calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "residential-load-calculator",
    slug: "residential-load-calculator",
    categoryId: "electrical",
    title: "Residential Electrical Service Load Calculator",
    shortTitle: "Panel Load & Service Sizing",
    description:
      "Calculate total residential electrical service load (VA and Amps) per NEC Article 220.82 for 100A, 150A, 200A, and 400A service panel sizing with EV chargers and heat pumps.",
    searchIntent: "Calculate home electrical service load in amps and VA per NEC 220 for 100A, 200A panel upgrades and EV chargers",
    status: "active",
    relatedToolSlugs: ["voltage-drop-calculator", "conduit-fill-calculator"],
    inputs: [
      {
        id: "dwellingFloorAreaSqFt",
        label: "Floor Area",
        type: "number",
        required: true,
        defaultUnit: "square-foot",
      },
      {
        id: "existingServiceRatingAmps",
        label: "Existing Service Size",
        type: "select",
        required: true,
      },
    ],
    outputs: [
      {
        id: "calculatedServiceAmps",
        label: "Calculated Service Load",
        unit: "A",
        isPrimary: true,
        precision: 1,
      },
      {
        id: "totalCalculatedDemandKva",
        label: "Total Demand Load",
        unit: "kVA",
        precision: 2,
      },
      {
        id: "recommendedMinimumServiceAmps",
        label: "Recommended Minimum Service",
        unit: "A",
        precision: 0,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Residential Electrical Load Calculator - NEC 220 Sizing",
      description:
        "Calculate home electrical service load in Amps and kVA per NEC 220.82. Size 100A, 200A, or 400A panels for EV chargers, heat pumps, and home additions.",
      keywords: [
        "electrical load calculator",
        "residential electrical load calculator",
        "electrical panel load calculator",
        "nec 220 load calculator",
        "200 amp service load calculator",
        "home electrical load calculation",
        "service load calculation",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "dfu-calculator",
    slug: "dfu-calculator",
    categoryId: "plumbing",
    title: "Plumbing DFU & Drainage Pipe Sizing Calculator",
    shortTitle: "Plumbing DFU & Pipe Sizing",
    description:
      "Calculate total drainage fixture units (DFU) and size horizontal branch drains, vertical soil stacks, and building drains/sewers per IPC and UPC standards.",
    searchIntent: "Calculate total plumbing drainage fixture units (DFU) and size sanitary branch drains, soil stacks, and building sewers per IPC and UPC",
    status: "active",
    relatedToolSlugs: ["wsfu-calculator"],
    inputs: [
      {
        id: "codeStandard",
        label: "Plumbing Code Standard",
        type: "select",
        defaultValue: "IPC",
        options: [
          { label: "IPC (International Plumbing Code)", value: "IPC" },
          { label: "UPC (Uniform Plumbing Code)", value: "UPC" },
        ],
      },
      {
        id: "systemType",
        label: "Drainage System Type",
        type: "select",
        defaultValue: "horizontal_branch",
        options: [
          { label: "Horizontal Fixture Branch Drain", value: "horizontal_branch" },
          { label: "Vertical Drainage / Soil Stack", value: "vertical_stack" },
          { label: "Building Drain (Inside Foundation)", value: "building_drain" },
          { label: "Building Sewer (Outside Foundation)", value: "building_sewer" },
        ],
      },
      {
        id: "pipeSlope",
        label: "Pipe Slope",
        type: "select",
        defaultValue: "1_4",
        options: [
          { label: "1/4 in. per ft (2.0% - Standard)", value: "1_4" },
          { label: "1/8 in. per ft (1.0% - 3\" or larger)", value: "1_8" },
          { label: "1/2 in. per ft (4.0% - Steep)", value: "1_2" },
          { label: "1/16 in. per ft (0.5% - 8\" only)", value: "1_16" },
        ],
      },
    ],
    outputs: [
      {
        id: "recommendedPipeSizeInches",
        label: "Recommended Pipe Diameter",
        unit: "in",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "totalCalculatedDfu",
        label: "Total Drainage Load",
        unit: "DFU",
        precision: 1,
      },
      {
        id: "maxCapacityDfuForSelectedSize",
        label: "Rated Pipe Capacity",
        unit: "DFU",
        precision: 0,
      },
      {
        id: "capacityUtilizationPct",
        label: "Capacity Utilized",
        unit: "%",
        precision: 1,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Plumbing DFU & Drainage Pipe Sizing Calculator - IPC & UPC",
      description:
        "Free plumbing drainage fixture unit (DFU) and drain pipe sizing calculator. Calculate total fixture units and size horizontal branches, vertical stacks, and building drains per IPC and UPC codes.",
      keywords: [
        "plumbing dfu calculator",
        "drainage fixture unit calculator",
        "dfu pipe sizing calculator",
        "drain pipe sizing calculator",
        "plumbing fixture unit calculator",
        "ipc dfu calculator",
        "upc dfu calculator",
        "soil stack sizing calculator",
        "building drain sizing calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
  {
    id: "wsfu-calculator",
    slug: "wsfu-calculator",
    categoryId: "plumbing",
    title: "Water Supply Fixture Unit (WSFU) & Potable Pipe Sizing Calculator",
    shortTitle: "WSFU & Potable Pipe Sizing",
    description:
      "Calculate total water supply fixture units (WSFU), peak flow (GPM) via Hunter's Curve, and size copper, PEX, and CPVC main supply trunks and branches per IPC and UPC.",
    searchIntent: "Calculate plumbing water supply fixture units (WSFU), peak GPM flow, and size copper and PEX water lines per IPC and UPC",
    status: "active",
    relatedToolSlugs: ["dfu-calculator"],
    inputs: [
      {
        id: "codeStandard",
        label: "Plumbing Code Standard",
        type: "select",
        defaultValue: "IPC",
        options: [
          { label: "IPC (International Plumbing Code)", value: "IPC" },
          { label: "UPC (Uniform Plumbing Code)", value: "UPC" },
        ],
      },
      {
        id: "pipeMaterial",
        label: "Potable Pipe Material",
        type: "select",
        defaultValue: "copper_l",
        options: [
          { label: "Copper Type L (Tubing)", value: "copper_l" },
          { label: "PEX (Cross-Linked Polyethylene)", value: "pex" },
          { label: "CPVC (Chlorinated PVC)", value: "cpvc" },
        ],
      },
      {
        id: "staticPressurePsi",
        label: "Static Supply Pressure",
        type: "number",
        required: true,
        defaultValue: 60,
        defaultUnit: "psi",
      },
      {
        id: "developedLengthFeet",
        label: "Developed Pipe Length",
        type: "number",
        required: true,
        defaultValue: 60,
        defaultUnit: "foot",
      },
      {
        id: "highestFixtureElevationFeet",
        label: "Highest Fixture Elevation",
        type: "number",
        required: true,
        defaultValue: 10,
        defaultUnit: "foot",
      },
    ],
    outputs: [
      {
        id: "recommendedMainPipeSizeInches",
        label: "Recommended Main Pipe Size",
        unit: "in",
        isPrimary: true,
        precision: 0,
      },
      {
        id: "totalCalculatedWsfu",
        label: "Total Water Supply Load",
        unit: "WSFU",
        precision: 1,
      },
      {
        id: "totalDesignFlowGpm",
        label: "Peak Design Flow",
        unit: "GPM",
        precision: 1,
      },
      {
        id: "velocityAtRecommendedSizeFps",
        label: "Water Velocity",
        unit: "FPS",
        precision: 1,
      },
      {
        id: "actualResidualPressurePsi",
        label: "Residual Pressure at Highest Fixture",
        unit: "PSI",
        precision: 1,
      },
    ],
    calculate: (_input: Record<string, unknown>) => ({ values: {}, steps: [] }),
    seo: {
      title: "Water Supply Fixture Unit (WSFU) & Potable Pipe Sizing Calculator - IPC & UPC",
      description:
        "Free WSFU water supply fixture unit and potable water pipe sizing calculator. Calculate peak GPM with Hunter's Curve, pressure drop, and size Copper, PEX, and CPVC water pipes per IPC and UPC codes.",
      keywords: [
        "wsfu calculator",
        "water supply fixture unit calculator",
        "plumbing pipe sizing calculator",
        "water pipe size calculator",
        "potable water sizing calculator",
        "hunters curve calculator",
        "pex pipe sizing calculator",
        "copper pipe sizing calculator",
        "ipc wsfu calculator",
        "upc water supply calculator",
      ],
    },
    lastModified: "2026-09-01",
  },
];

/**
 * Retrieves category info by ID or slug.
 */
export function getCategoryById(idOrSlug: string): ToolCategoryInfo | undefined {
  return TOOL_CATEGORIES.find(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );
}

/**
 * Retrieves all tools belonging to a category.
 */
export function getToolsByCategory(categoryId: ToolCategoryId): readonly ToolDefinition[] {
  return REGISTERED_TOOLS.filter((t) => t.categoryId === categoryId);
}

/**
 * Retrieves a tool definition by slug.
 */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return REGISTERED_TOOLS.find((t) => t.slug === slug);
}

/**
 * Retrieves related tools for a given tool slug.
 */
export function getRelatedTools(toolSlug: string): readonly ToolDefinition[] {
  const current = getToolBySlug(toolSlug);
  if (!current) return [];

  if (current.relatedToolSlugs && current.relatedToolSlugs.length > 0) {
    return REGISTERED_TOOLS.filter((t) =>
      current.relatedToolSlugs?.includes(t.slug)
    );
  }

  return REGISTERED_TOOLS.filter(
    (t) => t.categoryId === current.categoryId && t.slug !== toolSlug
  ).slice(0, 4);
}
