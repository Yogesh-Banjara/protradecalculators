import type { MudRingData, StandardBoxData } from "@/types/box-fill";
import type { WireGaugeSize } from "@/types/electrical";

/**
 * NEC Table 314.16(B): Volume Allowance Required per Conductor (in cubic inches).
 */
export const NEC_TABLE_314_16_B: Record<WireGaugeSize, number> = {
  "14 AWG": 2.0,
  "12 AWG": 2.25,
  "10 AWG": 2.5,
  "8 AWG": 3.0,
  "6 AWG": 5.0,
  "4 AWG": 7.0,
  "3 AWG": 8.0,
  "2 AWG": 9.0,
  "1 AWG": 11.0,
  "1/0 AWG": 13.0,
  "2/0 AWG": 15.0,
  "3/0 AWG": 18.0,
  "4/0 AWG": 22.0,
  "250 kcmil": 27.0,
  "300 kcmil": 31.0,
  "350 kcmil": 35.0,
  "400 kcmil": 39.0,
  "500 kcmil": 47.0,
  "600 kcmil": 55.0,
  "750 kcmil": 67.0,
  "1000 kcmil": 87.0,
};

export const WIRE_GAUGE_VOLUME_RANK: readonly WireGaugeSize[] = [
  "14 AWG",
  "12 AWG",
  "10 AWG",
  "8 AWG",
  "6 AWG",
  "4 AWG",
  "3 AWG",
  "2 AWG",
  "1 AWG",
  "1/0 AWG",
  "2/0 AWG",
  "3/0 AWG",
  "4/0 AWG",
  "250 kcmil",
  "300 kcmil",
  "350 kcmil",
  "400 kcmil",
  "500 kcmil",
  "600 kcmil",
  "750 kcmil",
  "1000 kcmil",
];

export function getConductorVolumeAllowance(size: WireGaugeSize): number {
  return NEC_TABLE_314_16_B[size] ?? 2.25;
}

export function compareWireGauges(a: WireGaugeSize, b: WireGaugeSize): number {
  const indexA = WIRE_GAUGE_VOLUME_RANK.indexOf(a);
  const indexB = WIRE_GAUGE_VOLUME_RANK.indexOf(b);
  return indexA - indexB;
}

/**
 * NEC Table 314.16(A) Standard Metal Boxes and Common Listed Nonmetallic Plastic Boxes.
 */
export const STANDARD_BOXES: readonly StandardBoxData[] = [
  {
    id: "handy-1-1-2",
    name: '1-Gang Handy / Utility Box (4" × 2-1/8" × 1-1/2")',
    tradeDimensions: '4" × 2-1/8" × 1-1/2"',
    material: "metal",
    mountType: "handy_utility",
    standardVolumeCuIn: 10.3,
    description: "Surface-mount utility box for switches or single receptacles in garages/basements.",
  },
  {
    id: "handy-1-7-8",
    name: '1-Gang Handy / Utility Box (4" × 2-1/8" × 1-7/8")',
    tradeDimensions: '4" × 2-1/8" × 1-7/8"',
    material: "metal",
    mountType: "handy_utility",
    standardVolumeCuIn: 13.0,
    description: "Standard depth utility box for surface-mount conduits.",
  },
  {
    id: "handy-2-1-8",
    name: '1-Gang Handy Deep Box (4" × 2-1/8" × 2-1/8")',
    tradeDimensions: '4" × 2-1/8" × 2-1/8"',
    material: "metal",
    mountType: "handy_utility",
    standardVolumeCuIn: 14.5,
    description: "Deep utility box for single devices with multiple splices.",
  },
  {
    id: "round-oct-1-1-2",
    name: '4" Round / Octagonal Box (4" × 1-1/2")',
    tradeDimensions: '4" × 1-1/2"',
    material: "metal",
    mountType: "octagonal_4",
    standardVolumeCuIn: 15.5,
    description: "Ceiling fixture and wall sconce junction box.",
  },
  {
    id: "oct-deep-2-1-8",
    name: '4" Octagonal Deep Box (4" × 2-1/8")',
    tradeDimensions: '4" × 2-1/8"',
    material: "metal",
    mountType: "octagonal_4",
    standardVolumeCuIn: 21.5,
    description: "Deep octagonal box for ceiling fans and heavier lighting fixtures.",
  },
  {
    id: "plastic-1g-18",
    name: "1-Gang Plastic Box (18.0 cu in)",
    tradeDimensions: '3-3/4" × 2-1/4" × 2-3/4"',
    material: "plastic_nonmetallic",
    mountType: "single_gang_device",
    standardVolumeCuIn: 18.0,
    description: "Standard single-gang nail-on or old-work plastic box (e.g. Carlon B118R).",
  },
  {
    id: "plastic-1g-20",
    name: "1-Gang Plastic Box (20.3 cu in)",
    tradeDimensions: '3-3/4" × 2-1/4" × 3-1/4"',
    material: "plastic_nonmetallic",
    mountType: "single_gang_device",
    standardVolumeCuIn: 20.3,
    description: "Standard residential single-gang box (e.g. Carlon B120A).",
  },
  {
    id: "plastic-1g-22-5",
    name: "1-Gang Plastic Deep Box (22.5 cu in)",
    tradeDimensions: '3-3/4" × 2-1/4" × 3-1/2"',
    material: "plastic_nonmetallic",
    mountType: "single_gang_device",
    standardVolumeCuIn: 22.5,
    description: "Deep single-gang box for GFCI, smart dimmers, and USB outlets.",
  },
  {
    id: "square-4-1-1-4",
    name: '4" Square Box (4" × 4" × 1-1/4")',
    tradeDimensions: '4" × 4" × 1-1/4"',
    material: "metal",
    mountType: "square_4",
    standardVolumeCuIn: 18.0,
    description: "Shallow 4-square commercial junction and device box.",
  },
  {
    id: "square-4-1-1-2",
    name: '4" Square Box (4" × 4" × 1-1/2" - Standard 1900 Box)',
    tradeDimensions: '4" × 4" × 1-1/2"',
    material: "metal",
    mountType: "square_4",
    standardVolumeCuIn: 21.0,
    description: "Most common commercial metal junction box (NEC Table 314.16(A)).",
  },
  {
    id: "square-4-2-1-8",
    name: '4" Square Deep Box (4" × 4" × 2-1/8" - Deep 1900 Box)',
    tradeDimensions: '4" × 4" × 2-1/8"',
    material: "metal",
    mountType: "square_4",
    standardVolumeCuIn: 30.3,
    description: "Deep 4-square box for multiple branch splices, feed-through circuits, and heavy devices.",
  },
  {
    id: "plastic-2g-32",
    name: "2-Gang Plastic Box (32.0 cu in)",
    tradeDimensions: '3-3/4" × 4" × 3"',
    material: "plastic_nonmetallic",
    mountType: "two_gang_device",
    standardVolumeCuIn: 32.0,
    description: "Standard 2-gang nonmetallic nail-on box (e.g. Carlon B232A).",
  },
  {
    id: "plastic-2g-34",
    name: "2-Gang Plastic Deep Box (34.0 cu in)",
    tradeDimensions: '3-3/4" × 4" × 3-1/4"',
    material: "plastic_nonmetallic",
    mountType: "two_gang_device",
    standardVolumeCuIn: 34.0,
    description: "Deep 2-gang box for multi-circuit smart switches and dual GFCIs.",
  },
  {
    id: "square-4-11-16-1-1-2",
    name: '4-11/16" Square Box (4-11/16" × 1-1/2")',
    tradeDimensions: '4-11/16" × 4-11/16" × 1-1/2"',
    material: "metal",
    mountType: "square_4_11_16",
    standardVolumeCuIn: 29.5,
    description: 'Large commercial square box for up to 1" conduit entries.',
  },
  {
    id: "square-4-11-16-2-1-8",
    name: '4-11/16" Square Deep Box (4-11/16" × 2-1/8")',
    tradeDimensions: '4-11/16" × 4-11/16" × 2-1/8"',
    material: "metal",
    mountType: "square_4_11_16",
    standardVolumeCuIn: 42.0,
    description: "High-capacity commercial junction box for large feeder splices and power distribution.",
  },
  {
    id: "plastic-3g-44",
    name: "3-Gang Plastic Box (44.0 cu in)",
    tradeDimensions: '3-3/4" × 5-3/4" × 3"',
    material: "plastic_nonmetallic",
    mountType: "three_gang_device",
    standardVolumeCuIn: 44.0,
    description: "3-gang residential switch bank box.",
  },
  {
    id: "plastic-4g-58",
    name: "4-Gang Plastic Box (58.0 cu in)",
    tradeDimensions: '3-3/4" × 7-1/2" × 3"',
    material: "plastic_nonmetallic",
    mountType: "four_gang_device",
    standardVolumeCuIn: 58.0,
    description: "4-gang residential main lighting switch bank.",
  },
];

/**
 * Standard Listed Mud / Plaster Ring Extension Volumes.
 */
export const STANDARD_MUD_RINGS: readonly MudRingData[] = [
  {
    id: "none",
    name: "No Mud Ring (Flat Box / Blank Cover)",
    depthInches: "Flat",
    additionalVolumeCuIn: 0.0,
  },
  {
    id: "1g-1-4",
    name: '1-Gang 1/4" Raised Plaster Ring (+2.5 cu in)',
    depthInches: '1/4"',
    additionalVolumeCuIn: 2.5,
  },
  {
    id: "1g-1-2",
    name: '1-Gang 1/2" Raised Plaster Ring (+3.5 cu in)',
    depthInches: '1/2"',
    additionalVolumeCuIn: 3.5,
  },
  {
    id: "1g-5-8",
    name: '1-Gang 5/8" Raised Plaster Ring (+4.5 cu in)',
    depthInches: '5/8"',
    additionalVolumeCuIn: 4.5,
  },
  {
    id: "1g-3-4",
    name: '1-Gang 3/4" Raised Plaster Ring (+5.5 cu in)',
    depthInches: '3/4"',
    additionalVolumeCuIn: 5.5,
  },
  {
    id: "1g-1",
    name: '1-Gang 1" Raised Plaster Ring (+7.0 cu in)',
    depthInches: '1"',
    additionalVolumeCuIn: 7.0,
  },
  {
    id: "2g-1-2",
    name: '2-Gang 1/2" Raised Plaster Ring (+6.0 cu in)',
    depthInches: '1/2"',
    additionalVolumeCuIn: 6.0,
  },
  {
    id: "2g-5-8",
    name: '2-Gang 5/8" Raised Plaster Ring (+7.5 cu in)',
    depthInches: '5/8"',
    additionalVolumeCuIn: 7.5,
  },
  {
    id: "2g-3-4",
    name: '2-Gang 3/4" Raised Plaster Ring (+9.0 cu in)',
    depthInches: '3/4"',
    additionalVolumeCuIn: 9.0,
  },
  {
    id: "2g-1",
    name: '2-Gang 1" Raised Plaster Ring (+12.0 cu in)',
    depthInches: '1"',
    additionalVolumeCuIn: 12.0,
  },
];

export function getStandardBox(id: string): StandardBoxData | undefined {
  return STANDARD_BOXES.find((b) => b.id === id);
}

export function getMudRing(id: string): MudRingData | undefined {
  return STANDARD_MUD_RINGS.find((r) => r.id === id);
}
