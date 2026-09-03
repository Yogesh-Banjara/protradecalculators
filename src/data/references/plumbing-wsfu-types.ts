import type {
  PotablePipeMaterial,
  StandardWaterPipeSizeInches,
} from "@/types/plumbing-wsfu";

export interface FixtureCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly category: "bathroom" | "kitchen" | "laundry" | "outdoor" | "commercial";
  readonly ipcWsfuTotal: number;
  readonly ipcWsfuCold: number;
  readonly ipcWsfuHot: number;
  readonly upcWsfuTotal: number;
  readonly upcWsfuCold: number;
  readonly upcWsfuHot: number;
  readonly minBranchSizeInches: StandardWaterPipeSizeInches;
  readonly description: string;
  readonly isFlushometer?: boolean;
}

export const POTABLE_FIXTURE_CATALOG: readonly FixtureCatalogEntry[] = [
  {
    id: "bathroom_group_flush_tank",
    name: "Bathroom Group (Tank Toilet + Lavatory + Tub/Shower)",
    category: "bathroom",
    ipcWsfuTotal: 3.6,
    ipcWsfuCold: 2.7,
    ipcWsfuHot: 1.5,
    upcWsfuTotal: 3.6,
    upcWsfuCold: 2.7,
    upcWsfuHot: 1.5,
    minBranchSizeInches: "1/2",
    description: "Complete residential 3-piece bathroom group discount (IPC Table E103.3(2) / UPC Table A 103.1)",
  },
  {
    id: "water_closet_tank",
    name: "Water Closet / Toilet (Flush Tank - 1.6 gpf)",
    category: "bathroom",
    ipcWsfuTotal: 2.2,
    ipcWsfuCold: 2.2,
    ipcWsfuHot: 0.0,
    upcWsfuTotal: 2.5,
    upcWsfuCold: 2.5,
    upcWsfuHot: 0.0,
    minBranchSizeInches: "1/2",
    description: "Standard gravity flush tank residential toilet (3/8\" fixture supply tube)",
  },
  {
    id: "water_closet_flushometer",
    name: "Water Closet / Toilet (Flushometer Valve)",
    category: "commercial",
    ipcWsfuTotal: 5.0,
    ipcWsfuCold: 5.0,
    ipcWsfuHot: 0.0,
    upcWsfuTotal: 8.0,
    upcWsfuCold: 8.0,
    upcWsfuHot: 0.0,
    minBranchSizeInches: "1",
    description: "Commercial high-velocity flushometer valve toilet (minimum 1\" supply required)",
    isFlushometer: true,
  },
  {
    id: "lavatory",
    name: "Lavatory / Bathroom Sink",
    category: "bathroom",
    ipcWsfuTotal: 0.7,
    ipcWsfuCold: 0.5,
    ipcWsfuHot: 0.5,
    upcWsfuTotal: 1.0,
    upcWsfuCold: 0.75,
    upcWsfuHot: 0.75,
    minBranchSizeInches: "1/2",
    description: "Residential or commercial hand washing basin (3/8\" supply tube)",
  },
  {
    id: "bathtub_shower",
    name: "Bathtub (with or without showerhead)",
    category: "bathroom",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 1.0,
    upcWsfuHot: 1.0,
    minBranchSizeInches: "1/2",
    description: "Standard residential bathtub filler / combination tub-shower valve",
  },
  {
    id: "shower_stall",
    name: "Shower Stall (Single Head <= 2.5 GPM)",
    category: "bathroom",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 1.0,
    upcWsfuHot: 1.0,
    minBranchSizeInches: "1/2",
    description: "Standard stall shower with thermostatic / pressure-balanced mixing valve",
  },
  {
    id: "kitchen_sink",
    name: "Kitchen Sink (Domestic)",
    category: "kitchen",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 1.0,
    upcWsfuHot: 1.0,
    minBranchSizeInches: "1/2",
    description: "Single or double compartment domestic kitchen faucet",
  },
  {
    id: "dishwasher",
    name: "Dishwasher (Automatic Domestic)",
    category: "kitchen",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 0.0,
    ipcWsfuHot: 1.4,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 0.0,
    upcWsfuHot: 1.5,
    minBranchSizeInches: "1/2",
    description: "Domestic automatic dishwasher (hot water supply connection only)",
  },
  {
    id: "clothes_washer",
    name: "Clothes Washer (Automatic 8 lb)",
    category: "laundry",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 1.0,
    upcWsfuHot: 1.0,
    minBranchSizeInches: "1/2",
    description: "Standard residential washing machine outlet box",
  },
  {
    id: "laundry_tub",
    name: "Laundry Tub / Utility Sink",
    category: "laundry",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.5,
    upcWsfuCold: 1.0,
    upcWsfuHot: 1.0,
    minBranchSizeInches: "1/2",
    description: "Deep utility tub or service sink in laundry or basement",
  },
  {
    id: "hose_bibb_first",
    name: "Hose Bibb / Sillcock (First Exterior Outlet)",
    category: "outdoor",
    ipcWsfuTotal: 2.5,
    ipcWsfuCold: 2.5,
    ipcWsfuHot: 0.0,
    upcWsfuTotal: 2.5,
    upcWsfuCold: 2.5,
    upcWsfuHot: 0.0,
    minBranchSizeInches: "1/2",
    description: "Primary outdoor hose faucet (frost-free sillcock)",
  },
  {
    id: "hose_bibb_additional",
    name: "Hose Bibb / Sillcock (Each Additional)",
    category: "outdoor",
    ipcWsfuTotal: 1.0,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 0.0,
    upcWsfuTotal: 1.0,
    upcWsfuCold: 1.0,
    upcWsfuHot: 0.0,
    minBranchSizeInches: "1/2",
    description: "Secondary or tertiary outdoor hose bibbs",
  },
  {
    id: "bidet",
    name: "Bidet (Domestic)",
    category: "bathroom",
    ipcWsfuTotal: 1.4,
    ipcWsfuCold: 1.0,
    ipcWsfuHot: 1.0,
    upcWsfuTotal: 1.0,
    upcWsfuCold: 0.75,
    upcWsfuHot: 0.75,
    minBranchSizeInches: "1/2",
    description: "Dedicated bidet fixture with hot/cold controls",
  },
  {
    id: "bar_sink",
    name: "Bar / Prep Sink",
    category: "kitchen",
    ipcWsfuTotal: 0.7,
    ipcWsfuCold: 0.5,
    ipcWsfuHot: 0.5,
    upcWsfuTotal: 1.0,
    upcWsfuCold: 0.75,
    upcWsfuHot: 0.75,
    minBranchSizeInches: "1/2",
    description: "Secondary wet bar or kitchen prep sink",
  },
];

export const STANDARD_WATER_PIPE_SIZES: readonly StandardWaterPipeSizeInches[] = [
  "1/2",
  "3/4",
  "1",
  "1-1/4",
  "1-1/2",
  "2",
  "2-1/2",
  "3",
];

export const WATER_PIPE_SIZE_NUMERIC_MAP: Record<StandardWaterPipeSizeInches, number> = {
  "1/2": 0.5,
  "3/4": 0.75,
  "1": 1.0,
  "1-1/4": 1.25,
  "1-1/2": 1.5,
  "2": 2.0,
  "2-1/2": 2.5,
  "3": 3.0,
};

/**
 * Internal Diameters in Inches (ID) for Hydraulic Calculations
 */
export const PIPE_INTERNAL_DIAMETERS: Record<PotablePipeMaterial, Record<StandardWaterPipeSizeInches, number>> = {
  copper_l: {
    "1/2": 0.545,
    "3/4": 0.785,
    "1": 1.025,
    "1-1/4": 1.265,
    "1-1/2": 1.505,
    "2": 1.985,
    "2-1/2": 2.465,
    "3": 2.945,
  },
  pex: {
    "1/2": 0.485,
    "3/4": 0.671,
    "1": 0.862,
    "1-1/4": 1.054,
    "1-1/2": 1.244,
    "2": 1.629,
    "2-1/2": 2.012,
    "3": 2.404,
  },
  cpvc: {
    "1/2": 0.489,
    "3/4": 0.715,
    "1": 0.921,
    "1-1/4": 1.125,
    "1-1/2": 1.330,
    "2": 1.734,
    "2-1/2": 2.140,
    "3": 2.540,
  },
};

/**
 * Hazen-Williams Roughness Coefficient (C)
 */
export const HAZEN_WILLIAMS_C: Record<PotablePipeMaterial, number> = {
  copper_l: 130, // Smooth copper tubing
  pex: 150, // Smooth extruded cross-linked polyethylene
  cpvc: 150, // Smooth thermoplastic
};

/**
 * Maximum Permitted Velocity (FPS) per Plumbing Codes to avoid water hammer & erosion corrosion
 */
export const MAX_VELOCITY_FPS: Record<PotablePipeMaterial, { cold: number; hot: number }> = {
  copper_l: { cold: 8.0, hot: 5.0 }, // Copper erosion limits (IPC Table E103.3(1) / CDA guidelines)
  pex: { cold: 10.0, hot: 8.0 }, // PEX manufacturer limits (PPI TR-3)
  cpvc: { cold: 8.0, hot: 8.0 },
};

/**
 * Hunter's Curve Interpolation Table: WSFU -> Demand Flow in GPM (Flush Tank Dominant)
 * Source: IPC Table E103.3(3) & UPC Table A 103.1
 */
export const HUNTERS_CURVE_FLUSH_TANK_POINTS: readonly { wsfu: number; gpm: number }[] = [
  { wsfu: 0, gpm: 0.0 },
  { wsfu: 1, gpm: 3.0 },
  { wsfu: 2, gpm: 5.0 },
  { wsfu: 3, gpm: 6.5 },
  { wsfu: 4, gpm: 8.0 },
  { wsfu: 5, gpm: 9.4 },
  { wsfu: 6, gpm: 10.5 },
  { wsfu: 7, gpm: 11.8 },
  { wsfu: 8, gpm: 12.8 },
  { wsfu: 9, gpm: 13.7 },
  { wsfu: 10, gpm: 14.7 },
  { wsfu: 12, gpm: 16.0 },
  { wsfu: 14, gpm: 17.5 },
  { wsfu: 16, gpm: 18.8 },
  { wsfu: 18, gpm: 20.0 },
  { wsfu: 20, gpm: 21.0 },
  { wsfu: 25, gpm: 23.5 },
  { wsfu: 30, gpm: 26.0 },
  { wsfu: 35, gpm: 28.0 },
  { wsfu: 40, gpm: 30.0 },
  { wsfu: 45, gpm: 32.0 },
  { wsfu: 50, gpm: 34.0 },
  { wsfu: 60, gpm: 38.0 },
  { wsfu: 70, gpm: 41.5 },
  { wsfu: 80, gpm: 45.0 },
  { wsfu: 90, gpm: 48.5 },
  { wsfu: 100, gpm: 52.0 },
  { wsfu: 125, gpm: 59.0 },
  { wsfu: 150, gpm: 66.0 },
  { wsfu: 175, gpm: 72.0 },
  { wsfu: 200, gpm: 77.0 },
  { wsfu: 250, gpm: 87.0 },
  { wsfu: 300, gpm: 96.0 },
  { wsfu: 400, gpm: 112.0 },
  { wsfu: 500, gpm: 127.0 },
];
