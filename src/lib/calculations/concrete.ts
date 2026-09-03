import type {
  ConcreteBagEstimate,
  ConcreteProjectInput,
  ConcreteProjectResult,
  ConcreteSectionInput,
  ConcreteSectionResult,
} from "@/types/concrete";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import { convertLength, convertVolume } from "../units/converter";
import { roundTo, roundToTradeIncrement } from "./rounding";

/** Standard premixed bag specifications and typical yields */
export const STANDARD_CONCRETE_BAGS = [
  { weightLbs: 80, defaultYieldCuFt: 0.60 },
  { weightLbs: 60, defaultYieldCuFt: 0.45 },
  { weightLbs: 50, defaultYieldCuFt: 0.375 },
  { weightLbs: 40, defaultYieldCuFt: 0.30 },
] as const;

/**
 * Calculates concrete volume for an individual project section.
 */
export function calculateConcreteSection(
  section: ConcreteSectionInput
): ConcreteSectionResult {
  const quantity = Math.max(1, Math.floor(section.quantity || 1));

  let singleVolumeCuFt = 0;
  const steps: CalculationStep[] = [];

  const isCircular =
    section.shape === "round-column" ||
    section.shape === "circular-slab" ||
    section.shape === "circular-footing";

  if (isCircular) {
    const diameter = section.diameter;
    const depthOrHeight = section.depth;

    if (diameter === undefined || diameter === null || diameter <= 0) {
      throw new RangeError(`Diameter for section "${section.name}" must be greater than zero`);
    }
    if (depthOrHeight === undefined || depthOrHeight === null || depthOrHeight <= 0) {
      throw new RangeError(`Depth/Height for section "${section.name}" must be greater than zero`);
    }

    const diameterUnit = section.diameterUnit ?? section.lengthUnit;
    const diameterFeet = convertLength(diameter, diameterUnit, "foot");
    const radiusFeet = diameterFeet / 2;
    const depthFeet = convertLength(depthOrHeight, section.depthUnit, "foot");

    singleVolumeCuFt = Math.PI * radiusFeet * radiusFeet * depthFeet;

    steps.push({
      label: "Convert dimensions to feet",
      formula: "radius = (diameter in ft) ÷ 2; depth in ft",
      values: `r = ${radiusFeet.toFixed(4)} ft, depth = ${depthFeet.toFixed(4)} ft`,
      result: `radius = ${radiusFeet.toFixed(4)} ft, depth = ${depthFeet.toFixed(4)} ft`,
    });

    steps.push({
      label: "Calculate circular cylinder volume",
      formula: "π × radius² × depth",
      values: `π × (${radiusFeet.toFixed(4)} ft)² × ${depthFeet.toFixed(4)} ft`,
      result: `${singleVolumeCuFt.toFixed(3)} cu ft`,
    });
  } else {
    // Rectangular Slab or Continuous Footing
    const length = section.length;
    const width = section.width;
    const depth = section.depth;

    if (length === undefined || length === null || length <= 0) {
      throw new RangeError(`Length for section "${section.name}" must be greater than zero`);
    }
    if (width === undefined || width === null || width <= 0) {
      throw new RangeError(`Width for section "${section.name}" must be greater than zero`);
    }
    if (depth === undefined || depth === null || depth <= 0) {
      throw new RangeError(`Depth/Thickness for section "${section.name}" must be greater than zero`);
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
      label: "Multiply by quantity",
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
 * Calculates complete concrete project requirements across multiple sections,
 * applying waste factors, trade ordering rounding, and bag count estimates.
 */
export function calculateConcreteProject(
  project: ConcreteProjectInput
): ConcreteProjectResult {
  const { sections, wastePercent = 10, customBagYieldCuFt } = project;

  if (!sections || sections.length === 0) {
    throw new RangeError("Project must contain at least one section");
  }

  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percentage must be between 0% and 100%");
  }

  const calculatedSections: ConcreteSectionResult[] = [];
  const warnings: CalculationWarning[] = [];
  const projectSteps: CalculationStep[] = [];

  let totalNetCuFt = 0;

  for (const section of sections) {
    const sectionRes = calculateConcreteSection(section);
    calculatedSections.push(sectionRes);
    totalNetCuFt += sectionRes.volumeCuFt;

    // Check for unusually thin slab warning (< 2 inches)
    if (
      (section.shape === "rectangular-slab" || section.shape === "circular-slab") &&
      section.depth !== undefined
    ) {
      const depthInInches = convertLength(section.depth, section.depthUnit, "inch");
      if (depthInInches < 2) {
        warnings.push({
          code: "SLAB_TOO_THIN",
          field: section.name,
          message: `Section "${section.name}" thickness (${depthInInches.toFixed(1)}") is under 2 inches. Standard residential structural slabs require at least 3.5" to 4" thickness.`,
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

  // Calculate waste adjustment
  const wasteCuFt = totalNetCuFt * (wastePercent / 100);
  const wasteCuYd = wasteCuFt / 27;
  const totalWithWasteCuFt = totalNetCuFt + wasteCuFt;
  const totalWithWasteCuYd = totalWithWasteCuFt / 27;
  const totalWithWasteCuMeters = convertVolume(totalWithWasteCuFt, "cubic-foot", "cubic-meter");

  projectSteps.push({
    label: `Apply ${wastePercent}% waste factor`,
    formula: "net volume × (1 + waste% ÷ 100)",
    values: `${totalNetCuYd.toFixed(2)} cu yd × ${(1 + wastePercent / 100).toFixed(2)}`,
    result: `${totalWithWasteCuYd.toFixed(2)} cu yd (${totalWithWasteCuFt.toFixed(2)} cu ft)`,
  });

  // Ready-mix order recommendation: Round up to nearest 0.25 cu yd
  const recommendedOrderYards = totalWithWasteCuYd > 0
    ? roundToTradeIncrement(totalWithWasteCuYd, 0.25)
    : 0;

  // Add trade warnings
  if (wastePercent === 0) {
    warnings.push({
      code: "ZERO_WASTE_WARNING",
      message: "You have selected 0% waste. Jobsite conditions typically require 5% to 10% extra concrete to account for uneven sub-base excavation, formwork deflection, and spillage.",
    });
  }

  if (totalWithWasteCuYd > 0 && totalWithWasteCuYd < 1.0) {
    warnings.push({
      code: "SMALL_PROJECT_READYMIX",
      message: `Total project volume is ${totalWithWasteCuYd.toFixed(2)} cu yd. Ready-mix transit trucks typically have a 1–2 cu yd minimum or charge short-load fees. Consider using bagged concrete mix for this volume.`,
    });
  }

  // Calculate bag counts
  const bagEstimates: ConcreteBagEstimate[] = STANDARD_CONCRETE_BAGS.map((bag) => {
    const yieldCuFt = bag.defaultYieldCuFt;
    const exactBags = totalWithWasteCuFt / yieldCuFt;
    const bagsRequired = Math.ceil(exactBags);
    const surplusCuFt = bagsRequired * yieldCuFt - totalWithWasteCuFt;

    return {
      bagWeightLbs: bag.weightLbs,
      bagYieldCuFt: yieldCuFt,
      bagsRequired,
      exactBags: roundTo(exactBags, 2),
      surplusCuFt: roundTo(surplusCuFt, 2),
    };
  });

  // If user provided a custom bag yield
  if (customBagYieldCuFt && customBagYieldCuFt > 0) {
    const exactBags = totalWithWasteCuFt / customBagYieldCuFt;
    const bagsRequired = Math.ceil(exactBags);
    const surplusCuFt = bagsRequired * customBagYieldCuFt - totalWithWasteCuFt;
    bagEstimates.push({
      bagWeightLbs: 0,
      bagYieldCuFt: customBagYieldCuFt,
      bagsRequired,
      exactBags: roundTo(exactBags, 2),
      surplusCuFt: roundTo(surplusCuFt, 2),
    });
  }

  return {
    netVolumeCuFt: roundTo(totalNetCuFt, 2),
    netVolumeCuYd: roundTo(totalNetCuYd, 2),
    netVolumeCuMeters: roundTo(totalNetCuMeters, 2),
    wastePercent,
    wasteVolumeCuFt: roundTo(wasteCuFt, 2),
    wasteVolumeCuYd: roundTo(wasteCuYd, 2),
    totalVolumeCuFt: roundTo(totalWithWasteCuFt, 2),
    totalVolumeCuYd: roundTo(totalWithWasteCuYd, 2),
    totalVolumeCuMeters: roundTo(totalWithWasteCuMeters, 2),
    recommendedOrderYards: roundTo(recommendedOrderYards, 2),
    sections: calculatedSections,
    bagEstimates,
    warnings,
    steps: projectSteps,
  };
}
