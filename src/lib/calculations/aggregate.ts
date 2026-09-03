import type {
  AggregateBagEstimate,
  AggregateProjectInput,
  AggregateProjectResult,
  AggregateSectionInput,
  AggregateSectionResult,
  TruckloadEstimate,
} from "@/types/aggregate";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import { getAggregateMaterial } from "@/data/materials/aggregate-types";
import { convertLength, convertVolume } from "../units/converter";
import { roundTo } from "./rounding";

/** Standard bulk bag weights in pounds for optional bagged takeoff */
export const STANDARD_AGGREGATE_BAG_WEIGHTS = [80, 60, 50, 40] as const;

/**
 * Calculates volume for an individual aggregate section.
 */
export function calculateAggregateSection(
  section: AggregateSectionInput
): AggregateSectionResult {
  const quantity = Math.max(1, Math.floor(section.quantity || 1));
  let singleVolumeCuFt = 0;
  const steps: CalculationStep[] = [];

  if (section.shape === "circular") {
    const diameter = section.diameter;
    const depth = section.depth;

    if (diameter === undefined || diameter === null || diameter <= 0) {
      throw new RangeError(
        `Diameter for section "${section.name}" must be greater than zero`
      );
    }
    if (depth === undefined || depth === null || depth <= 0) {
      throw new RangeError(
        `Depth/Thickness for section "${section.name}" must be greater than zero`
      );
    }

    const diameterUnit = section.diameterUnit ?? section.lengthUnit;
    const diameterFeet = convertLength(diameter, diameterUnit, "foot");
    const radiusFeet = diameterFeet / 2;
    const depthFeet = convertLength(depth, section.depthUnit, "foot");

    singleVolumeCuFt = Math.PI * radiusFeet * radiusFeet * depthFeet;

    steps.push({
      label: "Convert dimensions to feet",
      formula: "radius = (diameter in ft) ÷ 2; depth in ft",
      values: `r = ${radiusFeet.toFixed(4)} ft, depth = ${depthFeet.toFixed(4)} ft`,
      result: `r = ${radiusFeet.toFixed(4)} ft, depth = ${depthFeet.toFixed(4)} ft`,
    });

    steps.push({
      label: "Calculate circular cylinder volume",
      formula: "π × radius² × depth",
      values: `π × (${radiusFeet.toFixed(4)} ft)² × ${depthFeet.toFixed(4)} ft`,
      result: `${singleVolumeCuFt.toFixed(3)} cu ft`,
    });
  } else {
    // Rectangular area
    const length = section.length;
    const width = section.width;
    const depth = section.depth;

    if (length === undefined || length === null || length <= 0) {
      throw new RangeError(
        `Length for section "${section.name}" must be greater than zero`
      );
    }
    if (width === undefined || width === null || width <= 0) {
      throw new RangeError(
        `Width for section "${section.name}" must be greater than zero`
      );
    }
    if (depth === undefined || depth === null || depth <= 0) {
      throw new RangeError(
        `Depth/Thickness for section "${section.name}" must be greater than zero`
      );
    }

    const lengthFeet = convertLength(length, section.lengthUnit, "foot");
    const widthFeet = convertLength(width, section.lengthUnit, "foot");
    const depthFeet = convertLength(depth, section.depthUnit, "foot");

    singleVolumeCuFt = lengthFeet * widthFeet * depthFeet;

    steps.push({
      label: "Convert dimensions to feet",
      formula: "length (ft), width (ft), depth (ft)",
      values: `L = ${lengthFeet.toFixed(4)} ft, W = ${widthFeet.toFixed(4)} ft, D = ${depthFeet.toFixed(4)} ft`,
      result: `L = ${lengthFeet.toFixed(4)} ft, W = ${widthFeet.toFixed(4)} ft, D = ${depthFeet.toFixed(4)} ft`,
    });

    steps.push({
      label: "Calculate rectangular volume",
      formula: "length × width × depth",
      values: `${lengthFeet.toFixed(4)} ft × ${widthFeet.toFixed(4)} ft × ${depthFeet.toFixed(4)} ft`,
      result: `${singleVolumeCuFt.toFixed(3)} cu ft`,
    });
  }

  const totalVolumeCuFt = singleVolumeCuFt * quantity;
  if (quantity > 1) {
    steps.push({
      label: "Multiply by section quantity",
      formula: "single volume × quantity",
      values: `${singleVolumeCuFt.toFixed(3)} cu ft × ${quantity}`,
      result: `${totalVolumeCuFt.toFixed(3)} cu ft`,
    });
  }

  const volumeCuYd = convertVolume(totalVolumeCuFt, "cubic-foot", "cubic-yard");
  const volumeCuMeters = convertVolume(totalVolumeCuFt, "cubic-foot", "cubic-meter");

  steps.push({
    label: "Convert to cubic yards",
    formula: "cubic feet ÷ 27",
    values: `${totalVolumeCuFt.toFixed(3)} cu ft ÷ 27`,
    result: `${volumeCuYd.toFixed(3)} cu yd`,
  });

  return {
    id: section.id,
    name: section.name,
    shape: section.shape,
    quantity,
    volumeCuFt: roundTo(totalVolumeCuFt, 3),
    volumeCuYd: roundTo(volumeCuYd, 3),
    volumeCuMeters: roundTo(volumeCuMeters, 3),
    steps,
  };
}

/**
 * Helper to determine standard truck name from capacity.
 */
function getTruckTypeName(capacityTons: number): string {
  if (Math.abs(capacityTons - 10) < 0.1) return "Single-Axle Dump Truck (approx 10 tons)";
  if (Math.abs(capacityTons - 15) < 0.1) return "Tandem-Axle Dump Truck (approx 15 tons)";
  if (Math.abs(capacityTons - 20) < 0.1) return "Tri-Axle / End Dump Truck (approx 20 tons)";
  return `Custom Dump Truck (${capacityTons} tons capacity)`;
}

/**
 * Calculates complete aggregate project takeoff across multiple sections,
 * applying compaction/waste factors, material density to tonnage conversions,
 * and truckload estimates.
 */
export function calculateAggregateProject(
  project: AggregateProjectInput
): AggregateProjectResult {
  const {
    sections,
    materialId = "gravel",
    customDensityLbsPerCuFt,
    adjustmentMode = "waste",
    adjustmentPercent = 10,
    truckCapacityTons = 15,
  } = project;

  if (!sections || sections.length === 0) {
    throw new RangeError("Project must contain at least one section");
  }

  if (adjustmentPercent < 0 || adjustmentPercent > 100) {
    throw new RangeError("Adjustment percentage must be between 0% and 100%");
  }

  if (truckCapacityTons <= 0) {
    throw new RangeError("Truck capacity must be greater than zero");
  }

  const materialInfo = getAggregateMaterial(materialId);

  let effectiveDensity = materialInfo.densityLbsPerCuFt;
  if (
    customDensityLbsPerCuFt !== undefined &&
    customDensityLbsPerCuFt !== null &&
    customDensityLbsPerCuFt > 0
  ) {
    effectiveDensity = customDensityLbsPerCuFt;
  } else if (materialId === "custom") {
    if (!customDensityLbsPerCuFt || customDensityLbsPerCuFt <= 0) {
      throw new RangeError("Custom material requires a valid density in lbs/cu ft");
    }
    effectiveDensity = customDensityLbsPerCuFt;
  }

  if (effectiveDensity <= 0) {
    throw new RangeError("Material density must be greater than zero");
  }

  const effectiveTonsPerCuYd = (effectiveDensity * 27) / 2000;

  const calculatedSections: AggregateSectionResult[] = [];
  const warnings: CalculationWarning[] = [];
  const projectSteps: CalculationStep[] = [];

  let totalNetCuFt = 0;

  for (const section of sections) {
    const sectionRes = calculateAggregateSection(section);
    calculatedSections.push(sectionRes);
    totalNetCuFt += sectionRes.volumeCuFt;

    // Check for shallow driveway depth warning (< 3 inches)
    if (section.depth !== undefined) {
      const depthInches = convertLength(section.depth, section.depthUnit, "inch");
      if (depthInches < 2.5) {
        warnings.push({
          code: "SHALLOW_GRAVEL_DEPTH",
          field: section.name,
          message: `Section "${section.name}" depth (${depthInches.toFixed(1)}") is thin. Vehicle driveways and parking pads generally require at least 3" to 4" surface course over a 4" to 6" compacted base.`,
        });
      }
    }
  }

  const totalNetCuYd = totalNetCuFt / 27;
  const totalNetCuMeters = convertVolume(totalNetCuFt, "cubic-foot", "cubic-meter");

  projectSteps.push({
    label: "Aggregate total net volume",
    formula: "Sum of all section volumes",
    values: calculatedSections.map((s) => `${s.volumeCuFt.toFixed(2)} cu ft (${s.name})`).join(" + "),
    result: `${totalNetCuFt.toFixed(2)} cu ft (${totalNetCuYd.toFixed(2)} cu yd)`,
  });

  // Apply adjustment (compaction, waste, or combined)
  const isAdjustmentApplied = adjustmentMode !== "none" && adjustmentPercent > 0;
  const multiplier = isAdjustmentApplied ? 1 + adjustmentPercent / 100 : 1.0;

  const adjustedVolumeCuFt = totalNetCuFt * multiplier;
  const adjustedVolumeCuYd = adjustedVolumeCuFt / 27;
  const adjustedVolumeCuMeters = convertVolume(adjustedVolumeCuFt, "cubic-foot", "cubic-meter");

  if (isAdjustmentApplied) {
    const adjustmentLabel =
      adjustmentMode === "compaction"
        ? "Compaction / Shrinkage"
        : adjustmentMode === "waste"
        ? "Waste / Spillage"
        : "Combined Adjustment";

    projectSteps.push({
      label: `Apply ${adjustmentPercent}% ${adjustmentLabel}`,
      formula: "net volume × (1 + adjustment% ÷ 100)",
      values: `${totalNetCuYd.toFixed(2)} cu yd × ${multiplier.toFixed(2)}`,
      result: `${adjustedVolumeCuYd.toFixed(2)} cu yd (${adjustedVolumeCuFt.toFixed(2)} cu ft)`,
    });
  }

  // Weight and Tonnage calculations
  const totalWeightLbs = adjustedVolumeCuFt * effectiveDensity;
  const totalTons = totalWeightLbs / 2000;

  projectSteps.push({
    label: `Calculate weight using ${effectiveDensity} lb/cu ft density`,
    formula: "volume (cu ft) × density (lb/cu ft)",
    values: `${adjustedVolumeCuFt.toFixed(2)} cu ft × ${effectiveDensity} lb/cu ft`,
    result: `${totalWeightLbs.toFixed(1)} lbs (${totalTons.toFixed(2)} short tons)`,
  });

  // Truckload estimation
  const exactLoads = totalTons / truckCapacityTons;
  const loadsRequired = totalTons > 0 ? Math.ceil(exactLoads) : 0;
  const leftoverTons = loadsRequired * truckCapacityTons - totalTons;

  const truckloadEstimate: TruckloadEstimate = {
    truckCapacityTons,
    truckType: getTruckTypeName(truckCapacityTons),
    loadsRequired,
    exactLoads: roundTo(exactLoads, 2),
    leftoverTons: roundTo(leftoverTons, 2),
  };

  projectSteps.push({
    label: `Estimate truckloads at ${truckCapacityTons} tons/load`,
    formula: "total tons ÷ truck capacity (rounded UP)",
    values: `${totalTons.toFixed(2)} tons ÷ ${truckCapacityTons} tons`,
    result: `${loadsRequired} loads (${exactLoads.toFixed(2)} exact loads)`,
  });

  // Trade Warnings
  if (!isAdjustmentApplied && (materialId === "crusher-run" || materialId === "topsoil")) {
    warnings.push({
      code: "NO_COMPACTION_ADJUSTMENT",
      message: `You have 0% adjustment selected for ${materialInfo.name}. Dense-graded base materials and topsoil settle and compact by 10%–15% when rolled or wetted. We recommend including a compaction allowance to avoid shallow depth.`,
    });
  }

  if (totalTons > 0 && totalTons < 3.0) {
    warnings.push({
      code: "SMALL_AGGREGATE_ORDER",
      message: `Total weight is ${totalTons.toFixed(2)} tons (${totalWeightLbs.toFixed(0)} lbs). Bulk delivery trucks often charge high short-load fees or have 5-ton minimums. Consider pickup truck bed hauling or bagged material for small quantities.`,
    });
  }

  // Bag Estimations (optional bulk bags)
  const bagEstimates: AggregateBagEstimate[] = STANDARD_AGGREGATE_BAG_WEIGHTS.map((bagWeight) => {
    const exactBags = totalWeightLbs / bagWeight;
    const bagsRequired = Math.ceil(exactBags);
    const surplusLbs = bagsRequired * bagWeight - totalWeightLbs;

    return {
      bagWeightLbs: bagWeight,
      bagsRequired,
      exactBags: roundTo(exactBags, 1),
      surplusLbs: roundTo(surplusLbs, 1),
    };
  });

  return {
    netVolumeCuFt: roundTo(totalNetCuFt, 2),
    netVolumeCuYd: roundTo(totalNetCuYd, 2),
    netVolumeCuMeters: roundTo(totalNetCuMeters, 2),
    adjustmentMode,
    adjustmentPercent,
    adjustedVolumeCuFt: roundTo(adjustedVolumeCuFt, 2),
    adjustedVolumeCuYd: roundTo(adjustedVolumeCuYd, 2),
    adjustedVolumeCuMeters: roundTo(adjustedVolumeCuMeters, 2),
    effectiveDensityLbsPerCuFt: roundTo(effectiveDensity, 2),
    effectiveTonsPerCuYd: roundTo(effectiveTonsPerCuYd, 2),
    totalWeightLbs: roundTo(totalWeightLbs, 1),
    totalTons: roundTo(totalTons, 2),
    truckloadEstimate,
    bagEstimates,
    sections: calculatedSections,
    warnings,
    steps: projectSteps,
  };
}
