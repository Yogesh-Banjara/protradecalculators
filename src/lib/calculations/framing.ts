import type {
  FramingCostEstimate,
  FramingProjectInput,
  FramingProjectResult,
  LumberNominalSize,
  StudSpacing,
  WallOpeningInput,
  WallOpeningResult,
  WallSectionInput,
  WallSectionResult,
} from "@/types/framing";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import { getLumberSizeInfo } from "@/data/materials/lumber-types";
import { roundTo } from "./rounding";

/**
 * Computes standard common stud count for a continuous wall run.
 * Formula: Math.ceil(lengthInches / spacingInches) + 1
 */
export function calculateCommonStudCount(
  lengthFt: number,
  spacingInches: StudSpacing
): number {
  if (lengthFt <= 0) return 0;
  const lengthInches = lengthFt * 12;
  const spaces = Math.ceil(lengthInches / spacingInches);
  return spaces + 1;
}

/**
 * Calculates framing components for a single window or door opening.
 */
export function calculateOpeningFraming(
  opening: WallOpeningInput,
  wallHeightFt: number,
  spacingInches: StudSpacing,
  wallLumberSize: LumberNominalSize
): WallOpeningResult {
  const count = Math.max(1, Math.floor(opening.count || 1));
  const widthFt = opening.widthFt;
  const heightFt = opening.heightFt;

  if (widthFt <= 0 || heightFt <= 0) {
    throw new RangeError(
      `Dimensions for opening "${opening.name}" must be greater than zero`
    );
  }

  // King studs: 2 per opening (one on each side)
  const kingStuds = 2 * count;

  // Jack / Trimmer studs: 2 per opening (or 4 if opening is wide >= 6 ft)
  const jacksPerOpening = widthFt >= 6.0 ? 4 : 2;
  const jackStuds = jacksPerOpening * count;

  // Header dimensions: Rough opening width + 3" bearing on each jack (6" = 0.5 ft total)
  const headerLengthFt = widthFt + 0.5;
  const headerPlies = wallLumberSize === "2x6" ? 3 : 2;
  const headerPieceCount = headerPlies * count;
  const headerLinearFt = headerLengthFt * headerPieceCount;
  const headerLumberSize = opening.headerLumberSize ?? (widthFt > 5.0 ? "2x10" : "2x8");

  // Cripple studs calculation
  const widthInches = widthFt * 12;
  const cripplesPerBay = Math.max(0, Math.floor(widthInches / spacingInches));
  const crippleStudsTop = cripplesPerBay * count;
  const crippleStudsBottom = opening.type === "window" ? cripplesPerBay * count : 0;

  // Sill plates for windows
  const sillPlatesLinearFt = opening.type === "window" ? widthFt * count : 0;

  return {
    id: opening.id,
    name: opening.name,
    type: opening.type,
    count,
    widthFt,
    heightFt,
    kingStuds,
    jackStuds,
    crippleStudsTop,
    crippleStudsBottom,
    sillPlatesLinearFt: roundTo(sillPlatesLinearFt, 2),
    headerLinearFt: roundTo(headerLinearFt, 2),
    headerPieceCount,
    headerLumberSize,
  };
}

/**
 * Calculates complete lumber framing takeoff for an individual wall section.
 */
export function calculateWallSection(
  wall: WallSectionInput,
  stockPlateLengthFt: number = 16
): WallSectionResult {
  const {
    lengthFt,
    heightFt,
    studSpacingInches = 16,
    lumberSize = "2x4",
    hasDoubleTopPlate = true,
    cornerCount = 0,
    intersectionCount = 0,
    openings = [],
  } = wall;

  if (lengthFt <= 0) {
    throw new RangeError(`Length for wall "${wall.name}" must be greater than zero`);
  }
  if (heightFt <= 0) {
    throw new RangeError(`Height for wall "${wall.name}" must be greater than zero`);
  }
  if (stockPlateLengthFt <= 0) {
    throw new RangeError("Stock plate length must be greater than zero");
  }

  const steps: CalculationStep[] = [];

  // 1. Common studs
  const commonStuds = calculateCommonStudCount(lengthFt, studSpacingInches);
  steps.push({
    label: `Common studs at ${studSpacingInches}" OC`,
    formula: "⌈(length in inches ÷ spacing)⌉ + 1",
    values: `⌈(${lengthFt * 12}" ÷ ${studSpacingInches}")⌉ + 1`,
    result: `${commonStuds} studs`,
  });

  // 2. Corner and intersection studs
  const cornerStuds = Math.max(0, cornerCount) * 2;
  if (cornerStuds > 0) {
    steps.push({
      label: "Outside corner framing (California 3-stud)",
      formula: "cornerCount × 2 studs",
      values: `${cornerCount} corners × 2`,
      result: `${cornerStuds} studs`,
    });
  }

  const intersectionStuds = Math.max(0, intersectionCount) * 2;
  if (intersectionStuds > 0) {
    steps.push({
      label: "T-wall drywall backing studs",
      formula: "intersectionCount × 2 studs",
      values: `${intersectionCount} intersections × 2`,
      result: `${intersectionStuds} studs`,
    });
  }

  // 3. Openings calculation
  const calculatedOpenings: WallOpeningResult[] = [];
  let totalKing = 0;
  let totalJack = 0;
  let totalCripple = 0;
  let totalHeaderLinearFt = 0;
  let totalHeaderPieces = 0;
  let totalSillLinearFt = 0;

  for (const op of openings) {
    const opRes = calculateOpeningFraming(op, heightFt, studSpacingInches, lumberSize);
    calculatedOpenings.push(opRes);
    totalKing += opRes.kingStuds;
    totalJack += opRes.jackStuds;
    totalCripple += opRes.crippleStudsTop + opRes.crippleStudsBottom;
    totalHeaderLinearFt += opRes.headerLinearFt;
    totalHeaderPieces += opRes.headerPieceCount;
    totalSillLinearFt += opRes.sillPlatesLinearFt;
  }

  if (calculatedOpenings.length > 0) {
    steps.push({
      label: "Opening studs (King + Jack + Cripple)",
      formula: "sum of king, jack, and cripples for all openings",
      values: `${totalKing} king + ${totalJack} jack + ${totalCripple} cripple`,
      result: `${totalKing + totalJack + totalCripple} opening studs`,
    });
  }

  // Total studs for this wall
  const totalStuds =
    commonStuds + cornerStuds + intersectionStuds + totalKing + totalJack + totalCripple;

  // 4. Top & Bottom Plates
  const topPlatesCount = hasDoubleTopPlate ? 2 : 1;
  const bottomPlatesCount = 1;
  const totalPlateRows = topPlatesCount + bottomPlatesCount;
  const plateLinearFt = lengthFt * totalPlateRows;

  // Number of stock plate boards
  const boardsPerRow = Math.ceil(lengthFt / stockPlateLengthFt);
  const totalPlateBoards = boardsPerRow * totalPlateRows;

  steps.push({
    label: `Plates (${hasDoubleTopPlate ? "Double" : "Single"} Top + 1 Bottom)`,
    formula: "wall length × plate rows",
    values: `${lengthFt} ft × ${totalPlateRows} rows = ${plateLinearFt} linear ft`,
    result: `${totalPlateBoards} boards (${stockPlateLengthFt} ft stock)`,
  });

  // 5. Total linear feet & Board feet
  const studsLinearFt = totalStuds * heightFt;
  const wallLumberInfo = getLumberSizeInfo(lumberSize);

  const totalLinearFt =
    studsLinearFt + plateLinearFt + totalHeaderLinearFt + totalSillLinearFt;

  // Board feet = (studs & plates BF) + (header BF)
  const studsAndPlatesBF =
    (studsLinearFt + plateLinearFt + totalSillLinearFt) *
    wallLumberInfo.boardFeetPerLinearFt;

  // Headers may have a different nominal size (e.g. 2x8 or 2x10)
  let headerBF = 0;
  for (const op of calculatedOpenings) {
    const headerInfo = getLumberSizeInfo(op.headerLumberSize);
    headerBF += op.headerLinearFt * headerInfo.boardFeetPerLinearFt;
  }

  const totalBoardFeet = studsAndPlatesBF + headerBF;

  return {
    id: wall.id,
    name: wall.name,
    lengthFt,
    heightFt,
    studSpacingInches,
    lumberSize,
    commonStuds,
    cornerStuds,
    intersectionStuds,
    kingStuds: totalKing,
    jackStuds: totalJack,
    crippleStuds: totalCripple,
    totalStuds,
    topPlatesCount,
    bottomPlatesCount,
    totalPlateBoards,
    plateLinearFt: roundTo(plateLinearFt, 2),
    headerLinearFt: roundTo(totalHeaderLinearFt, 2),
    headerPieces: totalHeaderPieces,
    sillLinearFt: roundTo(totalSillLinearFt, 2),
    totalLinearFt: roundTo(totalLinearFt, 2),
    boardFeet: roundTo(totalBoardFeet, 2),
    openings: calculatedOpenings,
    steps,
  };
}

/**
 * Calculates project-wide wall framing takeoff, aggregating multiple wall runs,
 * applying culling/waste factors, and optional lumber cost estimation.
 */
export function calculateFramingProject(
  project: FramingProjectInput
): FramingProjectResult {
  const {
    walls,
    wastePercent = 10,
    stockPlateLengthFt = 16,
    costRates,
  } = project;

  if (!walls || walls.length === 0) {
    throw new RangeError("Framing project must contain at least one wall section");
  }

  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percentage must be between 0% and 100%");
  }

  const calculatedWalls: WallSectionResult[] = [];
  const warnings: CalculationWarning[] = [];
  const projectSteps: CalculationStep[] = [];

  let totalCommon = 0;
  let totalCornerAndIntersection = 0;
  let totalOpeningStuds = 0;
  let totalNetStuds = 0;
  let totalPlateBoards = 0;
  let totalPlateLinearFt = 0;
  let totalHeaderPieces = 0;
  let totalHeaderLinearFt = 0;
  let totalLinearFt = 0;
  let totalBoardFeet = 0;

  for (const wall of walls) {
    const wallRes = calculateWallSection(wall, stockPlateLengthFt);
    calculatedWalls.push(wallRes);

    totalCommon += wallRes.commonStuds;
    totalCornerAndIntersection += wallRes.cornerStuds + wallRes.intersectionStuds;
    totalOpeningStuds += wallRes.kingStuds + wallRes.jackStuds + wallRes.crippleStuds;
    totalNetStuds += wallRes.totalStuds;
    totalPlateBoards += wallRes.totalPlateBoards;
    totalPlateLinearFt += wallRes.plateLinearFt;
    totalHeaderPieces += wallRes.headerPieces;
    totalHeaderLinearFt += wallRes.headerLinearFt;
    totalLinearFt += wallRes.totalLinearFt;
    totalBoardFeet += wallRes.boardFeet;

    // Check for wall length vs opening width warnings
    const totalOpeningWidth = wall.openings.reduce(
      (sum, op) => sum + op.widthFt * op.count,
      0
    );
    if (totalOpeningWidth >= wall.lengthFt) {
      warnings.push({
        code: "OPENINGS_EXCEED_WALL",
        field: wall.name,
        message: `Total opening width (${totalOpeningWidth} ft) in "${wall.name}" meets or exceeds total wall length (${wall.lengthFt} ft). Verify room layout dimensions.`,
      });
    }

    // Check 24" OC exterior bearing warning
    if (wall.studSpacingInches === 24 && wall.lumberSize === "2x4" && wall.heightFt > 10) {
      warnings.push({
        code: "ADVANCED_FRAMING_LIMIT",
        field: wall.name,
        message: `Wall "${wall.name}" uses 2x4 at 24" OC over 10 ft height. Most building codes (IRC Table R602.3(5)) restrict 2x4 at 24" OC to non-bearing walls or maximum 10 ft heights.`,
      });
    }
  }

  // Structural header disclaimer warning
  warnings.push({
    code: "STRUCTURAL_HEADER_DISCLAIMER",
    message: "Header quantities and linear footage are for material takeoff estimating only. Structural header depth, ply thickness, and bearing points must be verified against local building codes (IRC Table R602.7) or an engineered plan based on roof/floor load conditions.",
  });

  // Calculate waste
  const wasteStuds = Math.ceil(totalNetStuds * (wastePercent / 100));
  const totalStudsWithWaste = totalNetStuds + wasteStuds;

  projectSteps.push({
    label: "Aggregate total net studs",
    formula: "Common + Corners/Backing + Openings",
    values: `${totalCommon} common + ${totalCornerAndIntersection} corners + ${totalOpeningStuds} openings`,
    result: `${totalNetStuds} studs`,
  });

  projectSteps.push({
    label: `Apply ${wastePercent}% lumber culling & waste allowance`,
    formula: "net studs + ⌈net studs × (waste% ÷ 100)⌉",
    values: `${totalNetStuds} + ${wasteStuds} extra`,
    result: `${totalStudsWithWaste} total studs`,
  });

  // Cost Estimation if enabled
  let costEstimate: FramingCostEstimate | undefined;
  if (costRates) {
    const priceStud = costRates.pricePerStud ?? 0;
    const pricePlate = costRates.pricePerPlateBoard ?? 0;
    const priceHeader = costRates.pricePerHeaderPiece ?? 0;

    const studsCost = totalStudsWithWaste * priceStud;
    const platesCost = totalPlateBoards * pricePlate;
    const headersCost = totalHeaderPieces * priceHeader;
    const totalEstimatedCost = studsCost + platesCost + headersCost;

    costEstimate = {
      studsCost: roundTo(studsCost, 2),
      platesCost: roundTo(platesCost, 2),
      headersCost: roundTo(headersCost, 2),
      totalEstimatedCost: roundTo(totalEstimatedCost, 2),
    };
  }

  return {
    wastePercent,
    totalCommonStuds: totalCommon,
    totalCornerAndIntersectionStuds: totalCornerAndIntersection,
    totalOpeningStuds,
    netStuds: totalNetStuds,
    wasteStuds,
    totalStudsWithWaste,
    totalPlateBoards,
    plateLinearFt: roundTo(totalPlateLinearFt, 2),
    headerPieces: totalHeaderPieces,
    headerLinearFt: roundTo(totalHeaderLinearFt, 2),
    totalLinearFt: roundTo(totalLinearFt, 2),
    totalBoardFeet: roundTo(totalBoardFeet, 2),
    stockPlateLengthFt,
    costEstimate,
    walls: calculatedWalls,
    warnings,
    steps: projectSteps,
  };
}
