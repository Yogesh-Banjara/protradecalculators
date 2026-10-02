import type {
  PipeSlope,
  StandardDrainPipeSizeInches,
} from "@/types/plumbing-dfu";

export interface StandardFixtureDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: "bathroom" | "kitchen_laundry" | "commercial_utility" | "groups";
  readonly ipcDfu: number;
  readonly upcDfu: number;
  readonly minTrapSizeInches: StandardDrainPipeSizeInches;
  readonly isWaterCloset: boolean;
  readonly notes: string;
}

/**
 * Standard Plumbing Fixture Catalog with IPC (Table 709.1) and UPC (Table 702.1) DFU ratings.
 */
export const PLUMBING_FIXTURE_CATALOG: readonly StandardFixtureDefinition[] = [
  {
    id: "water_closet_16",
    name: "Water Closet / Toilet (1.6 gpf gravity tank)",
    category: "bathroom",
    ipcDfu: 3.0,
    upcDfu: 3.0,
    minTrapSizeInches: "3",
    isWaterCloset: true,
    notes: "Private residential installation. Min 3\" drain required by IPC 710.1 and UPC 703.1.",
  },
  {
    id: "water_closet_public",
    name: "Water Closet / Toilet (Public / Flushometer)",
    category: "bathroom",
    ipcDfu: 4.0,
    upcDfu: 4.0,
    minTrapSizeInches: "3",
    isWaterCloset: true,
    notes: "Public or commercial flushometer water closet.",
  },
  {
    id: "bathroom_group",
    name: "Bathroom Group (1.6 gpf WC + Lavatory + Tub/Shower)",
    category: "groups",
    ipcDfu: 5.0,
    upcDfu: 5.0,
    minTrapSizeInches: "3",
    isWaterCloset: true,
    notes: "Private bathroom group discount per IPC Table 709.2 / UPC Table 702.1.",
  },
  {
    id: "lavatory",
    name: "Bathroom Sink / Lavatory",
    category: "bathroom",
    ipcDfu: 1.0,
    upcDfu: 1.0,
    minTrapSizeInches: "1-1/4",
    isWaterCloset: false,
    notes: "Single private lavatory (1-1/4\" trap, 1-1/2\" drain typical).",
  },
  {
    id: "bathtub",
    name: "Bathtub (with or without overhead shower)",
    category: "bathroom",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "1-1/2",
    isWaterCloset: false,
    notes: "Standard residential bathtub.",
  },
  {
    id: "shower_stall",
    name: "Shower Stall (Standard single head <= 5.7 gpm)",
    category: "bathroom",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "2", // 1.5" in IPC, 2" in UPC; 2" standard across modern trade
    isWaterCloset: false,
    notes: "Standard residential shower. UPC mandates 2\" minimum trap.",
  },
  {
    id: "bidet",
    name: "Bidet",
    category: "bathroom",
    ipcDfu: 1.0,
    upcDfu: 1.0,
    minTrapSizeInches: "1-1/4",
    isWaterCloset: false,
    notes: "Private residential bidet.",
  },
  {
    id: "kitchen_sink",
    name: "Kitchen Sink (with or without food waste disposer)",
    category: "kitchen_laundry",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "1-1/2",
    isWaterCloset: false,
    notes: "Standard domestic kitchen sink.",
  },
  {
    id: "dishwasher",
    name: "Dishwasher (Domestic direct drain)",
    category: "kitchen_laundry",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "1-1/2",
    isWaterCloset: false,
    notes: "Direct connection to drainage system.",
  },
  {
    id: "clothes_washer",
    name: "Clothes Washer (Residential standpipe)",
    category: "kitchen_laundry",
    ipcDfu: 2.0,
    upcDfu: 3.0,
    minTrapSizeInches: "2",
    isWaterCloset: false,
    notes: "Requires 2\" standpipe (18\"-42\" height). 2 DFU under IPC, 3 DFU under UPC.",
  },
  {
    id: "laundry_tray",
    name: "Laundry Tray / Utility Tub (1 or 2 compartment)",
    category: "kitchen_laundry",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "1-1/2",
    isWaterCloset: false,
    notes: "Standard laundry tub.",
  },
  {
    id: "floor_drain",
    name: "Floor Drain (2-inch emergency trap)",
    category: "commercial_utility",
    ipcDfu: 0.0, // 0 DFU in IPC for non-continuous emergency floor drains
    upcDfu: 2.0, // 2 DFU in UPC
    minTrapSizeInches: "2",
    isWaterCloset: false,
    notes: "Emergency basement/mechanical floor drain. 0 DFU in IPC, 2 DFU in UPC.",
  },
  {
    id: "mop_service_sink",
    name: "Mop Sink / Service Sink",
    category: "commercial_utility",
    ipcDfu: 2.0,
    upcDfu: 3.0,
    minTrapSizeInches: "2",
    isWaterCloset: false,
    notes: "Janitorial service sink / mop basin. 2 DFU in IPC, 3 DFU in UPC.",
  },
  {
    id: "urinal",
    name: "Urinal (1.0 gpf or less)",
    category: "commercial_utility",
    ipcDfu: 2.0,
    upcDfu: 2.0,
    minTrapSizeInches: "2",
    isWaterCloset: false,
    notes: "Wall-hung urinal with 2\" trap.",
  },
] as const;

/**
 * Standard drain pipe sizes in order of increasing diameter.
 */
export const STANDARD_DRAIN_PIPE_SIZES: readonly StandardDrainPipeSizeInches[] = [
  "1-1/4",
  "1-1/2",
  "2",
  "2-1/2",
  "3",
  "4",
  "5",
  "6",
  "8",
] as const;

/**
 * Numeric inner diameter value for pipe size comparisons.
 */
export const PIPE_SIZE_NUMERIC_MAP: Record<StandardDrainPipeSizeInches, number> = {
  "1-1/4": 1.25,
  "1-1/2": 1.5,
  "2": 2.0,
  "2-1/2": 2.5,
  "3": 3.0,
  "4": 4.0,
  "5": 5.0,
  "6": 6.0,
  "8": 8.0,
};

/**
 * IPC Table 710.1(2) Max DFU Capacities for Horizontal Branches & Vertical Stacks.
 */
export const IPC_DRAIN_CAPACITIES = {
  horizontalBranch: {
    "1-1/4": 1,
    "1-1/2": 3,
    "2": 6,
    "2-1/2": 12,
    "3": 20, // Max 2 water closets per IPC 710.1(2) on horizontal branch
    "4": 160,
    "5": 360,
    "6": 620,
    "8": 1400,
  } as Record<StandardDrainPipeSizeInches, number>,

  verticalStackTotal: {
    "1-1/4": 2,
    "1-1/2": 4, // 8 on multi-story stack, 4 on single interval
    "2": 10, // 24 total on stack <= 3 stories
    "2-1/2": 20, // 42 total on stack
    "3": 48, // 72 total on stack (max 2 WC per branch, 6 WC total)
    "4": 240, // 500 total on stack
    "5": 540,
    "6": 960,
    "8": 2200,
  } as Record<StandardDrainPipeSizeInches, number>,

  buildingDrainBySlope: {
    "1_16": {
      "1-1/4": 0,
      "1-1/2": 0,
      "2": 0,
      "2-1/2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "8": 1400,
    },
    "1_8": {
      "1-1/4": 0,
      "1-1/2": 0,
      "2": 0, // Not permitted under 1/8" slope per IPC 710.1(1)
      "2-1/2": 0,
      "3": 36,
      "4": 180,
      "5": 390,
      "6": 700,
      "8": 2500,
    },
    "1_4": {
      "1-1/4": 1,
      "1-1/2": 3,
      "2": 21,
      "2-1/2": 24,
      "3": 42,
      "4": 216,
      "5": 480,
      "6": 840,
      "8": 2900,
    },
    "1_2": {
      "1-1/4": 1,
      "1-1/2": 3,
      "2": 26,
      "2-1/2": 31,
      "3": 50,
      "4": 250,
      "5": 575,
      "6": 1000,
      "8": 3900,
    },
  } as Record<PipeSlope, Record<StandardDrainPipeSizeInches, number>>,
} as const;

/**
 * UPC Table 703.2 Max DFU Capacities for Horizontal Branches, Vertical Stacks & Building Drains.
 */
export const UPC_DRAIN_CAPACITIES = {
  horizontalBranch: {
    "1-1/4": 1,
    "1-1/2": 1, // 3 for horizontal fixtures
    "2": 8, // Max 1 shower or 2 lavatories
    "2-1/2": 14,
    "3": 35, // Max 3 water closets
    "4": 216,
    "5": 428,
    "6": 720,
    "8": 1400,
  } as Record<StandardDrainPipeSizeInches, number>,

  verticalStackTotal: {
    "1-1/4": 2,
    "1-1/2": 8,
    "2": 24,
    "2-1/2": 32,
    "3": 48,
    "4": 256,
    "5": 600,
    "6": 1380,
    "8": 3600,
  } as Record<StandardDrainPipeSizeInches, number>,

  buildingDrainBySlope: {
    "1_16": {
      "1-1/4": 0,
      "1-1/2": 0,
      "2": 0,
      "2-1/2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "8": 1400,
    },
    "1_8": {
      "1-1/4": 0,
      "1-1/2": 0,
      "2": 0,
      "2-1/2": 0,
      "3": 0, // UPC requires 1/4" slope for 3" unless special AHJ approval
      "4": 180,
      "5": 390,
      "6": 700,
      "8": 2500,
    },
    "1_4": {
      "1-1/4": 1,
      "1-1/2": 1,
      "2": 8,
      "2-1/2": 14,
      "3": 35,
      "4": 216,
      "5": 428,
      "6": 720,
      "8": 2900,
    },
    "1_2": {
      "1-1/4": 1,
      "1-1/2": 1,
      "2": 10,
      "2-1/2": 18,
      "3": 42,
      "4": 250,
      "5": 575,
      "6": 1000,
      "8": 3900,
    },
  } as Record<PipeSlope, Record<StandardDrainPipeSizeInches, number>>,
} as const;

export interface IpcVentStackRow {
  readonly soilStackSizeInches: StandardDrainPipeSizeInches;
  readonly maxDfu: number;
  readonly maxDevelopedLengthFtByVentSize: Partial<Record<StandardDrainPipeSizeInches, number>>;
}

/**
 * IPC Table 906.1: Size and Maximum Developed Length of Stack Vents and Vent Stacks.
 */
export const IPC_TABLE_906_1_VENT_STACK_SIZING: readonly IpcVentStackRow[] = [
  {
    soilStackSizeInches: "1-1/4",
    maxDfu: 2,
    maxDevelopedLengthFtByVentSize: { "1-1/4": 30 },
  },
  {
    soilStackSizeInches: "1-1/2",
    maxDfu: 8,
    maxDevelopedLengthFtByVentSize: { "1-1/4": 50, "1-1/2": 150 },
  },
  {
    soilStackSizeInches: "1-1/2",
    maxDfu: 10,
    maxDevelopedLengthFtByVentSize: { "1-1/4": 30, "1-1/2": 100 },
  },
  {
    soilStackSizeInches: "2",
    maxDfu: 12,
    maxDevelopedLengthFtByVentSize: { "1-1/4": 30, "1-1/2": 75, "2": 200 },
  },
  {
    soilStackSizeInches: "2",
    maxDfu: 24,
    maxDevelopedLengthFtByVentSize: { "1-1/4": 26, "1-1/2": 50, "2": 150 },
  },
  {
    soilStackSizeInches: "2-1/2",
    maxDfu: 42,
    maxDevelopedLengthFtByVentSize: { "1-1/2": 30, "2": 100, "2-1/2": 300 },
  },
  {
    soilStackSizeInches: "3",
    maxDfu: 10,
    maxDevelopedLengthFtByVentSize: { "1-1/2": 42, "2": 150, "2-1/2": 360, "3": 1040 },
  },
  {
    soilStackSizeInches: "3",
    maxDfu: 21,
    maxDevelopedLengthFtByVentSize: { "1-1/2": 32, "2": 110, "2-1/2": 270, "3": 810 },
  },
  {
    soilStackSizeInches: "3",
    maxDfu: 53,
    maxDevelopedLengthFtByVentSize: { "1-1/2": 27, "2": 94, "2-1/2": 230, "3": 680 },
  },
  {
    soilStackSizeInches: "3",
    maxDfu: 102,
    maxDevelopedLengthFtByVentSize: { "1-1/2": 25, "2": 86, "2-1/2": 210, "3": 620 },
  },
  {
    soilStackSizeInches: "4",
    maxDfu: 43,
    maxDevelopedLengthFtByVentSize: { "2": 35, "2-1/2": 85, "3": 250, "4": 980 },
  },
  {
    soilStackSizeInches: "4",
    maxDfu: 140,
    maxDevelopedLengthFtByVentSize: { "2": 27, "2-1/2": 65, "3": 200, "4": 750 },
  },
  {
    soilStackSizeInches: "4",
    maxDfu: 320,
    maxDevelopedLengthFtByVentSize: { "2": 23, "2-1/2": 55, "3": 170, "4": 640 },
  },
  {
    soilStackSizeInches: "4",
    maxDfu: 530,
    maxDevelopedLengthFtByVentSize: { "2": 21, "2-1/2": 50, "3": 150, "4": 580 },
  },
  {
    soilStackSizeInches: "5",
    maxDfu: 320,
    maxDevelopedLengthFtByVentSize: { "2-1/2": 28, "3": 82, "4": 320, "5": 990 },
  },
  {
    soilStackSizeInches: "5",
    maxDfu: 1000,
    maxDevelopedLengthFtByVentSize: { "2-1/2": 20, "3": 60, "4": 240, "5": 750 },
  },
  {
    soilStackSizeInches: "6",
    maxDfu: 500,
    maxDevelopedLengthFtByVentSize: { "3": 33, "4": 130, "5": 400, "6": 1000 },
  },
  {
    soilStackSizeInches: "6",
    maxDfu: 2000,
    maxDevelopedLengthFtByVentSize: { "3": 22, "4": 87, "5": 270, "6": 700 },
  },
  {
    soilStackSizeInches: "8",
    maxDfu: 1200,
    maxDevelopedLengthFtByVentSize: { "4": 31, "5": 95, "6": 240, "8": 940 },
  },
  {
    soilStackSizeInches: "8",
    maxDfu: 4000,
    maxDevelopedLengthFtByVentSize: { "4": 18, "5": 56, "6": 140, "8": 560 },
  },
] as const;

