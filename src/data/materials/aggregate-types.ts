import type { AggregateDensityInfo, AggregateMaterialId } from "@/types/aggregate";

export const AGGREGATE_MATERIALS: readonly AggregateDensityInfo[] = [
  {
    id: "gravel",
    name: "General Clean Gravel (Bank Run)",
    densityLbsPerCuFt: 100,
    tonsPerCuYd: 1.35,
    densityKgPerM3: 1600,
    sourceNote: "Typical natural uncrushed/semi-crushed gravel mix. Loose density ranges from 95–105 lbs/cu ft depending on moisture content.",
    defaultAdjustmentPercent: 10,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "crushed-stone",
    name: "Clean Crushed Stone",
    densityLbsPerCuFt: 100,
    tonsPerCuYd: 1.35,
    densityKgPerM3: 1600,
    sourceNote: "Uniform angular crushed rock (3/4\" to 1-1/2\"). High void ratio allows excellent drainage.",
    defaultAdjustmentPercent: 5,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "stone-57",
    name: "#57 Crushed Stone (Angular 1/2\" to 1\")",
    densityLbsPerCuFt: 95,
    tonsPerCuYd: 1.28,
    densityKgPerM3: 1520,
    sourceNote: "Industry standard ASTM C33 size #57 clean stone for driveway top-dressing, French drains, and concrete slab sub-bases.",
    defaultAdjustmentPercent: 5,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "crusher-run",
    name: "Crusher Run / Dense Grade Base (DGA / ABC)",
    densityLbsPerCuFt: 115,
    tonsPerCuYd: 1.55,
    densityKgPerM3: 1840,
    sourceNote: "Blend of crushed stone and stone dust fines. Compacts densely for driveway sub-bases and road foundations. Shrinks 10%–15% upon mechanical rolling.",
    defaultAdjustmentPercent: 12,
    defaultAdjustmentMode: "compaction",
  },
  {
    id: "limestone",
    name: "Crushed Limestone",
    densityLbsPerCuFt: 105,
    tonsPerCuYd: 1.42,
    densityKgPerM3: 1680,
    sourceNote: "Heavy dense sedimentary limestone aggregate commonly used for durable driveway surfacing and structural base courses.",
    defaultAdjustmentPercent: 10,
    defaultAdjustmentMode: "compaction",
  },
  {
    id: "pea-gravel",
    name: "Pea Gravel (3/8\" Rounded)",
    densityLbsPerCuFt: 100,
    tonsPerCuYd: 1.35,
    densityKgPerM3: 1600,
    sourceNote: "Smooth, naturally rounded small river pebbles for walkways, decorative landscaping, and patio perimeters.",
    defaultAdjustmentPercent: 8,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "river-rock",
    name: "River Rock (1\" to 3\" Rounded)",
    densityLbsPerCuFt: 105,
    tonsPerCuYd: 1.42,
    densityKgPerM3: 1680,
    sourceNote: "Large rounded decorative stones for swales, dry creek beds, and garden borders.",
    defaultAdjustmentPercent: 10,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "sand",
    name: "Masonry / Concrete Sand (Dry)",
    densityLbsPerCuFt: 100,
    tonsPerCuYd: 1.35,
    densityKgPerM3: 1600,
    sourceNote: "Washed concrete sand or bedding sand for paver installations and mortar blends.",
    defaultAdjustmentPercent: 10,
    defaultAdjustmentMode: "waste",
  },
  {
    id: "topsoil",
    name: "Screened Topsoil / Garden Loam (Loose)",
    densityLbsPerCuFt: 80,
    tonsPerCuYd: 1.08,
    densityKgPerM3: 1280,
    sourceNote: "Screened organic topsoil for lawn establishment and planting beds. Settle rate is 10%–15% after watering.",
    defaultAdjustmentPercent: 12,
    defaultAdjustmentMode: "compaction",
  },
  {
    id: "custom",
    name: "Custom Density (User Defined)",
    densityLbsPerCuFt: 100,
    tonsPerCuYd: 1.35,
    densityKgPerM3: 1600,
    sourceNote: "Enter the specific density from your local aggregate quarry scale ticket or supplier specification sheet.",
    defaultAdjustmentPercent: 10,
    defaultAdjustmentMode: "waste",
  },
] as const;

/**
 * Retrieves aggregate material info by ID.
 */
export function getAggregateMaterial(
  id: AggregateMaterialId
): AggregateDensityInfo {
  const found = AGGREGATE_MATERIALS.find((m) => m.id === id);
  return (
    found ?? {
      id: "custom",
      name: "Custom Material",
      densityLbsPerCuFt: 100,
      tonsPerCuYd: 1.35,
      densityKgPerM3: 1600,
      sourceNote: "Custom aggregate material density.",
      defaultAdjustmentPercent: 10,
      defaultAdjustmentMode: "waste",
    }
  );
}

/**
 * Retrieves all registered aggregate materials.
 */
export function getAllAggregateMaterials(): readonly AggregateDensityInfo[] {
  return AGGREGATE_MATERIALS;
}
