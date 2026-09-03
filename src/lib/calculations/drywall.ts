import type {
  DrywallAccessoryEstimate,
  DrywallCostEstimate,
  DrywallOpeningInput,
  DrywallOpeningResult,
  DrywallProjectInput,
  DrywallProjectResult,
  DrywallRoomInput,
  DrywallRoomResult,
} from "@/types/drywall";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import { DRYWALL_CONSTANTS, getDrywallSheetInfo } from "@/data/materials/drywall-types";
import { roundTo } from "./rounding";

/**
 * Calculates surface area deduction for an individual door or window opening.
 */
export function calculateOpeningArea(opening: DrywallOpeningInput): DrywallOpeningResult {
  const count = Math.max(1, Math.floor(opening.count || 1));
  const widthFt = opening.widthFt;
  const heightFt = opening.heightFt;

  if (widthFt <= 0 || heightFt <= 0) {
    throw new RangeError(
      `Dimensions for opening "${opening.name}" must be greater than zero`
    );
  }

  const singleArea = widthFt * heightFt;
  const totalAreaSqFt = singleArea * count;

  return {
    id: opening.id,
    name: opening.name,
    type: opening.type,
    widthFt,
    heightFt,
    count,
    totalAreaSqFt: roundTo(totalAreaSqFt, 2),
  };
}

/**
 * Calculates net surface area for a single room, including perimeter walls,
 * ceiling area, and opening deductions.
 */
export function calculateRoomDrywall(room: DrywallRoomInput): DrywallRoomResult {
  const {
    lengthFt,
    widthFt,
    heightFt,
    includeWalls = true,
    includeCeiling = true,
    openings = [],
  } = room;

  if (lengthFt <= 0) {
    throw new RangeError(`Length for room "${room.name}" must be greater than zero`);
  }
  if (widthFt <= 0) {
    throw new RangeError(`Width for room "${room.name}" must be greater than zero`);
  }
  if (heightFt <= 0) {
    throw new RangeError(`Ceiling height for room "${room.name}" must be greater than zero`);
  }

  const steps: CalculationStep[] = [];

  // 1. Gross Wall Area: Perimeter * Height
  let grossWallAreaSqFt = 0;
  if (includeWalls) {
    const perimeter = 2 * (lengthFt + widthFt);
    grossWallAreaSqFt = perimeter * heightFt;
    steps.push({
      label: "Gross Perimeter Wall Area",
      formula: "2 × (Length + Width) × Ceiling Height",
      values: `2 × (${lengthFt} ft + ${widthFt} ft) × ${heightFt} ft`,
      result: `${roundTo(grossWallAreaSqFt, 2)} sq ft`,
    });
  }

  // 2. Ceiling Area: Length * Width
  let ceilingAreaSqFt = 0;
  if (includeCeiling) {
    ceilingAreaSqFt = lengthFt * widthFt;
    steps.push({
      label: "Ceiling Surface Area",
      formula: "Length × Width",
      values: `${lengthFt} ft × ${widthFt} ft`,
      result: `${roundTo(ceilingAreaSqFt, 2)} sq ft`,
    });
  }

  // 3. Opening Deductions
  const calculatedOpenings: DrywallOpeningResult[] = [];
  let openingsAreaSqFt = 0;

  for (const op of openings) {
    const opRes = calculateOpeningArea(op);
    calculatedOpenings.push(opRes);
    openingsAreaSqFt += opRes.totalAreaSqFt;
  }

  if (calculatedOpenings.length > 0) {
    steps.push({
      label: "Total Openings Deduction",
      formula: "Sum of door and window areas",
      values: `${calculatedOpenings.length} openings`,
      result: `-${roundTo(openingsAreaSqFt, 2)} sq ft`,
    });
  }

  // 4. Net Room Area
  const grossTotal = grossWallAreaSqFt + ceilingAreaSqFt;
  const netAreaSqFt = Math.max(0, grossTotal - openingsAreaSqFt);

  steps.push({
    label: "Net Room Drywall Area",
    formula: "Gross Walls + Ceiling - Openings",
    values: `${grossWallAreaSqFt} + ${ceilingAreaSqFt} - ${openingsAreaSqFt}`,
    result: `${roundTo(netAreaSqFt, 2)} sq ft`,
  });

  return {
    id: room.id,
    name: room.name,
    lengthFt,
    widthFt,
    heightFt,
    includeWalls,
    includeCeiling,
    grossWallAreaSqFt: roundTo(grossWallAreaSqFt, 2),
    ceilingAreaSqFt: roundTo(ceilingAreaSqFt, 2),
    openingsAreaSqFt: roundTo(openingsAreaSqFt, 2),
    netAreaSqFt: roundTo(netAreaSqFt, 2),
    openings: calculatedOpenings,
    steps,
  };
}

/**
 * Calculates project-wide drywall sheets, finishing compound, joint tape,
 * fasteners, waste factor, and optional pricing.
 */
export function calculateDrywallProject(
  project: DrywallProjectInput
): DrywallProjectResult {
  const {
    rooms,
    sheetSize = "4x8",
    thickness = "1/2",
    wastePercent = 10,
    costRates,
  } = project;

  if (!rooms || rooms.length === 0) {
    throw new RangeError("Drywall project must contain at least one room or wall section");
  }

  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percentage must be between 0% and 100%");
  }

  const sheetInfo = getDrywallSheetInfo(sheetSize);
  const calculatedRooms: DrywallRoomResult[] = [];
  const warnings: CalculationWarning[] = [];
  const projectSteps: CalculationStep[] = [];

  let totalGrossArea = 0;
  let totalOpeningsArea = 0;
  let totalNetArea = 0;

  for (const room of rooms) {
    const roomRes = calculateRoomDrywall(room);
    calculatedRooms.push(roomRes);

    totalGrossArea += roomRes.grossWallAreaSqFt + roomRes.ceilingAreaSqFt;
    totalOpeningsArea += roomRes.openingsAreaSqFt;
    totalNetArea += roomRes.netAreaSqFt;

    if (roomRes.openingsAreaSqFt >= roomRes.grossWallAreaSqFt && roomRes.includeWalls) {
      warnings.push({
        code: "OPENINGS_EXCEED_WALLS",
        field: room.name,
        message: `Total opening deductions (${roomRes.openingsAreaSqFt} sq ft) meet or exceed gross wall area (${roomRes.grossWallAreaSqFt} sq ft) in "${room.name}". Check opening dimensions.`,
      });
    }
  }

  // Apply waste allowance
  const wasteAreaSqFt = roundTo(totalNetArea * (wastePercent / 100), 2);
  const adjustedAreaSqFt = roundTo(totalNetArea + wasteAreaSqFt, 2);

  // Sheet counts
  const exactSheets = roundTo(adjustedAreaSqFt / sheetInfo.areaSqFt, 2);
  const sheetsRequired = Math.ceil(adjustedAreaSqFt / sheetInfo.areaSqFt);

  projectSteps.push({
    label: "Net Project Surface Area",
    formula: "Sum of all room walls and ceilings minus openings",
    values: `${totalGrossArea} gross - ${totalOpeningsArea} openings`,
    result: `${roundTo(totalNetArea, 2)} sq ft`,
  });

  projectSteps.push({
    label: `Apply ${wastePercent}% cutting waste & edge allowance`,
    formula: "Net Area × (1 + Waste % ÷ 100)",
    values: `${totalNetArea} sq ft + ${wasteAreaSqFt} sq ft waste`,
    result: `${adjustedAreaSqFt} sq ft adjusted`,
  });

  projectSteps.push({
    label: `Calculate ${sheetInfo.label} sheet count`,
    formula: "⌈Adjusted Area ÷ Sheet Area⌉",
    values: `⌈${adjustedAreaSqFt} sq ft ÷ ${sheetInfo.areaSqFt} sq ft⌉ = ${exactSheets}`,
    result: `${sheetsRequired} sheets`,
  });

  // Calculate Accessories
  const tapeLinearFt = roundTo(adjustedAreaSqFt * DRYWALL_CONSTANTS.TAPE_FT_PER_SQ_FT, 1);
  const tapeRolls500Ft = Math.max(1, Math.ceil(tapeLinearFt / DRYWALL_CONSTANTS.STANDARD_TAPE_ROLL_500_FT));
  const tapeRolls250Ft = Math.max(1, Math.ceil(tapeLinearFt / DRYWALL_CONSTANTS.STANDARD_TAPE_ROLL_250_FT));

  const compoundGallons = roundTo(adjustedAreaSqFt * DRYWALL_CONSTANTS.COMPOUND_GAL_PER_SQ_FT, 1);
  const compoundBuckets4_5Gal = Math.max(1, Math.ceil(compoundGallons / DRYWALL_CONSTANTS.STANDARD_BUCKET_GAL));

  const drywallScrewsCount = Math.ceil(adjustedAreaSqFt * DRYWALL_CONSTANTS.SCREWS_PER_SQ_FT);
  const screwPounds = Math.max(1, Math.ceil(drywallScrewsCount / DRYWALL_CONSTANTS.SCREWS_PER_LB));
  const screwBoxes5Lb = Math.max(1, Math.ceil(drywallScrewsCount / DRYWALL_CONSTANTS.SCREWS_PER_5LB_BOX));

  const accessories: DrywallAccessoryEstimate = {
    jointTapeLinearFt: tapeLinearFt,
    tapeRolls500Ft,
    tapeRolls250Ft,
    jointCompoundGallons: compoundGallons,
    compoundBuckets4_5Gal,
    drywallScrewsCount,
    screwPounds,
    screwBoxes5Lb,
  };

  // Optional Cost Estimation
  let costEstimate: DrywallCostEstimate | undefined;
  if (costRates) {
    const priceSheet = costRates.pricePerSheet ?? 0;
    const priceTape = costRates.pricePerTapeRoll ?? 0;
    const priceCompound = costRates.pricePerCompoundBucket ?? 0;
    const priceScrews = costRates.pricePerScrewBox ?? 0;

    const sheetsCost = sheetsRequired * priceSheet;
    const tapeCost = tapeRolls500Ft * priceTape;
    const compoundCost = compoundBuckets4_5Gal * priceCompound;
    const screwsCost = screwBoxes5Lb * priceScrews;
    const totalEstimatedCost = sheetsCost + tapeCost + compoundCost + screwsCost;

    costEstimate = {
      sheetsCost: roundTo(sheetsCost, 2),
      tapeCost: roundTo(tapeCost, 2),
      compoundCost: roundTo(compoundCost, 2),
      screwsCost: roundTo(screwsCost, 2),
      totalEstimatedCost: roundTo(totalEstimatedCost, 2),
    };
  }

  // Domain & Safety Disclaimer
  warnings.push({
    code: "MATERIAL_ESTIMATE_DISCLAIMER",
    message: "Material quantity estimate only. Sheet count is calculated from net surface area plus cutting waste. This tool does not certify fire-resistance ratings (ASTM E119), acoustic STC ratings, or local building code structural assembly compliance.",
  });

  return {
    sheetSize,
    thickness,
    sheetAreaSqFt: sheetInfo.areaSqFt,
    grossAreaSqFt: roundTo(totalGrossArea, 2),
    openingsAreaSqFt: roundTo(totalOpeningsArea, 2),
    netAreaSqFt: roundTo(totalNetArea, 2),
    wastePercent,
    wasteAreaSqFt,
    adjustedAreaSqFt,
    exactSheets,
    sheetsRequired,
    accessories,
    costEstimate,
    rooms: calculatedRooms,
    warnings,
    steps: projectSteps,
  };
}
