import type {
  DeckCalculatorInput,
  DeckCalculatorResult,
  DeckConcreteTakeoffResult,
  DeckCostEstimate,
  DeckFramingTakeoffResult,
  DeckHardwareTakeoffResult,
  DeckingTakeoffResult,
} from "@/types/deck";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  DECKING_CONSTANTS,
  getDeckBoardInfo,
  getMaxAllowableJoistSpan,
} from "@/data/materials/decking-types";
import { roundTo } from "./rounding";

/**
 * Calculates decking surface board quantities, rows, linear footage, and stock board counts.
 */
export function calculateDeckingTakeoff(input: DeckCalculatorInput): DeckingTakeoffResult {
  const {
    lengthFt,
    widthFt,
    boardType = "5/4x6_composite",
    boardStockLengthFt = 16,
    boardOrientation = "perpendicular",
    boardGapInches = 0.1875,
    pictureFrame = "none",
    wastePercent = 10,
  } = input;

  if (lengthFt <= 0) {
    throw new RangeError("Deck length must be greater than zero");
  }
  if (widthFt <= 0) {
    throw new RangeError("Deck width / projection must be greater than zero");
  }
  if (wastePercent < 0 || wastePercent > 100) {
    throw new RangeError("Waste percentage must be between 0% and 100%");
  }

  const boardInfo = getDeckBoardInfo(boardType);
  const deckSurfaceAreaSqFt = roundTo(lengthFt * widthFt, 2);
  const wasteAreaSqFt = roundTo(deckSurfaceAreaSqFt * (wastePercent / 100), 2);
  const adjustedAreaSqFt = roundTo(deckSurfaceAreaSqFt + wasteAreaSqFt, 2);

  // Effective coverage width (actual width + gap)
  const effectiveCoverageWidthInches = roundTo(
    boardInfo.actualWidthInches + boardGapInches,
    4
  );
  const effectiveCoverageWidthFt = effectiveCoverageWidthInches / 12;

  // Picture frame border calculations (3 exposed sides: 2 sides + front)
  let pictureFrameLinearFeet = 0;
  let borderDeductionFt = 0;

  if (pictureFrame === "single") {
    pictureFrameLinearFeet = roundTo(2 * widthFt + lengthFt, 1);
    borderDeductionFt = boardInfo.actualWidthInches / 12;
  } else if (pictureFrame === "double") {
    pictureFrameLinearFeet = roundTo(2 * (2 * widthFt + lengthFt), 1);
    borderDeductionFt = (2 * boardInfo.actualWidthInches) / 12;
  }

  const pictureFrameBoardCount =
    pictureFrameLinearFeet > 0
      ? Math.ceil(pictureFrameLinearFeet / boardStockLengthFt)
      : 0;

  // Net field run after picture frame border deduction
  const netFieldWidthFt = Math.max(0, widthFt - borderDeductionFt);
  const netFieldLengthFt = Math.max(0, lengthFt - 2 * borderDeductionFt);

  // Board rows across field projection
  const totalBoardRows = Math.ceil(netFieldWidthFt / effectiveCoverageWidthFt);

  // Diagonal layout multiplier (1.414x for 45° angle)
  const orientationFactor = boardOrientation === "diagonal" ? 1.414 : 1.0;
  const rawFieldLinearFeet = roundTo(
    totalBoardRows * netFieldLengthFt * orientationFactor,
    1
  );

  // Waste adjusted field boards in chosen stock length
  const fieldBoardCount = Math.ceil(
    (rawFieldLinearFeet / boardStockLengthFt) * (1 + wastePercent / 100)
  );

  const totalLinearFeet = roundTo(
    rawFieldLinearFeet * (1 + wastePercent / 100) + pictureFrameLinearFeet,
    1
  );
  const totalStockBoardsRequired = fieldBoardCount + pictureFrameBoardCount;

  return {
    deckSurfaceAreaSqFt,
    wastePercent,
    wasteAreaSqFt,
    adjustedAreaSqFt,
    boardActualWidthInches: boardInfo.actualWidthInches,
    boardGapInches,
    effectiveCoverageWidthInches,
    totalBoardRows,
    totalLinearFeet,
    pictureFrameLinearFeet,
    pictureFrameBoardCount,
    fieldBoardCount,
    totalStockBoardsRequired,
    stockLengthFt: boardStockLengthFt,
  };
}

/**
 * Calculates deck framing elements: ledger board, rim joists, field joists, beams, and posts.
 */
export function calculateDeckFramingTakeoff(input: DeckCalculatorInput): DeckFramingTakeoffResult {
  const {
    lengthFt,
    widthFt,
    joistSpacingInches = 16,
    joistLumber = "2x8",
    beamType = "drop",
    beamLumber = "2-ply 2x10",
    postCount,
  } = input;

  if (lengthFt <= 0 || widthFt <= 0) {
    throw new RangeError("Deck dimensions must be greater than zero");
  }

  // Ledger board along house
  const ledgerLengthFt = lengthFt;
  const ledgerBoardPieces = Math.ceil(ledgerLengthFt / 16);

  // Rim joists (2 side rims + 1 front rim)
  const rimLinearFt = 2 * widthFt + lengthFt;
  const rimJoistPieces = Math.ceil(rimLinearFt / 16);

  // Field joists count across length: length * 12 / spacing + 1
  const fieldJoistsCount = Math.ceil((lengthFt * 12) / joistSpacingInches) + 1;

  // Joist stock length: smallest in [8, 10, 12, 14, 16, 20] that covers width
  const joistStockLengthFt =
    DECKING_CONSTANTS.STANDARD_JOIST_STOCK_LENGTHS.find((len) => len >= widthFt) ?? 20;

  // Max allowable joist span check
  const maxAllowableJoistSpanFt = getMaxAllowableJoistSpan(
    joistLumber,
    joistSpacingInches
  );

  // Beam calculations
  const beamLengthFt = lengthFt;
  const beamPlies = beamLumber.startsWith("3-ply") ? 3 : 2;
  const beamBoardPieces = beamPlies * Math.ceil(beamLengthFt / 16);

  // Support posts: max 8 ft span between posts along beam
  const supportPostsCount =
    postCount && postCount >= 2
      ? postCount
      : Math.max(2, Math.ceil(beamLengthFt / 8) + 1);

  const postLumberStock = "6x6"; // Standard IRC requirement for stability

  return {
    ledgerLengthFt,
    ledgerBoardPieces,
    rimJoistPieces,
    fieldJoistsCount,
    joistSpacingInches,
    joistStockLengthFt,
    joistLumber,
    maxAllowableJoistSpanFt,
    beamLengthFt,
    beamBoardPieces,
    beamLumber,
    beamType,
    supportPostsCount,
    postLumberStock,
  };
}

/**
 * Calculates concrete volume and 60lb/80lb bag counts for sonotube pier footings.
 */
export function calculateDeckConcreteTakeoff(
  postCount: number,
  pierDiameterInches: number = 12,
  pierDepthInches: number = 36
): DeckConcreteTakeoffResult {
  if (postCount <= 0) {
    throw new RangeError("Post count must be at least 1");
  }
  if (pierDiameterInches <= 0 || pierDepthInches <= 0) {
    throw new RangeError("Pier dimensions must be greater than zero");
  }

  // Sonotube cylinder volume = π * r² * h (in cubic feet)
  const radiusFt = pierDiameterInches / 2 / 12;
  const depthFt = pierDepthInches / 12;
  const volumePerPierCuFt = roundTo(Math.PI * Math.pow(radiusFt, 2) * depthFt, 3);

  const totalConcreteVolumeCuFt = roundTo(volumePerPierCuFt * postCount, 2);
  const totalConcreteVolumeCuYd = roundTo(
    totalConcreteVolumeCuFt / DECKING_CONSTANTS.CU_FT_PER_CU_YD,
    2
  );

  const concreteBags60Lb = Math.ceil(
    totalConcreteVolumeCuFt / DECKING_CONSTANTS.BAG_60LB_YIELD_CU_FT
  );
  const concreteBags80Lb = Math.ceil(
    totalConcreteVolumeCuFt / DECKING_CONSTANTS.BAG_80LB_YIELD_CU_FT
  );

  return {
    pierFootingCount: postCount,
    pierDiameterInches,
    pierDepthInches,
    volumePerPierCuFt,
    totalConcreteVolumeCuFt,
    totalConcreteVolumeCuYd,
    concreteBags60Lb,
    concreteBags80Lb,
  };
}

/**
 * Calculates fasteners, hangers, ledger lag screws, and flashing hardware.
 */
export function calculateDeckHardwareTakeoff(
  surfaceAreaSqFt: number,
  fieldJoistsCount: number,
  ledgerLengthFt: number,
  postCount: number,
  isComposite: boolean
): DeckHardwareTakeoffResult {
  // Joist hangers for ledger connection
  const joistHangersCount = fieldJoistsCount;

  // Ledger lag screws (2 screws every 16" OC staggered)
  const ledgerLagScrewsCount = Math.ceil((ledgerLengthFt * 12) / 16) * 2;

  // Post to beam brackets and post base anchors
  const postToBeamBracketsCount = postCount;
  const postBaseAnchorsCount = postCount;

  // Fasteners: Hidden clips for composite, face screws for wood
  const hiddenFastenerBoxes = isComposite
    ? Math.ceil(surfaceAreaSqFt / DECKING_CONSTANTS.SQ_FT_PER_HIDDEN_FASTENER_BOX)
    : 0;

  const faceScrewPounds = !isComposite
    ? Math.ceil((surfaceAreaSqFt * DECKING_CONSTANTS.SCREWS_PER_SQ_FT) / 350) * 5
    : 5; // 5 lbs for perimeter/framing

  const ledgerFlashingTapeRolls = Math.max(1, Math.ceil(ledgerLengthFt / 50));

  return {
    joistHangersCount,
    ledgerLagScrewsCount,
    postToBeamBracketsCount,
    postBaseAnchorsCount,
    hiddenFastenerBoxes,
    faceScrewPounds,
    ledgerFlashingTapeRolls,
  };
}

/**
 * Master deck material and framing project calculation orchestrator.
 */
export function calculateDeckProject(input: DeckCalculatorInput): DeckCalculatorResult {
  const {
    lengthFt,
    widthFt,
    boardType = "5/4x6_composite",
    joistSpacingInches = 16,
    joistLumber = "2x8",
    boardOrientation = "perpendicular",
    pierDiameterInches = 12,
    pierDepthInches = 36,
    costRates,
  } = input;

  if (lengthFt <= 0) {
    throw new RangeError("Deck length must be greater than zero");
  }
  if (widthFt <= 0) {
    throw new RangeError("Deck width / projection must be greater than zero");
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  const boardInfo = getDeckBoardInfo(boardType);

  // 1. Decking Surface Takeoff
  const decking = calculateDeckingTakeoff(input);

  steps.push({
    label: "Calculate Deck Surface Area & Adjusted Square Footage",
    formula: "Length × Width + (Area × Waste %)",
    values: `${lengthFt}' × ${widthFt}' = ${decking.deckSurfaceAreaSqFt} sq ft (+${decking.wastePercent}% waste)`,
    result: `${decking.adjustedAreaSqFt} sq ft adjusted area`,
  });

  steps.push({
    label: `Calculate Deck Boards (${decking.stockLengthFt}' Stock)`,
    formula: "⌈(Linear Feet ÷ Stock Length) × (1 + Waste)⌉ + Border Boards",
    values: `⌈(${decking.totalLinearFeet} lin ft ÷ ${decking.stockLengthFt}')⌉`,
    result: `${decking.totalStockBoardsRequired} deck boards (${decking.stockLengthFt}' lengths)`,
  });

  // 2. Framing Takeoff
  const framing = calculateDeckFramingTakeoff(input);

  steps.push({
    label: `Calculate Field Joists (${joistSpacingInches}" OC Spacing)`,
    formula: "⌈(Length × 12) ÷ Joist Spacing⌉ + 1",
    values: `⌈(${lengthFt}' × 12) ÷ ${joistSpacingInches}"⌉ + 1`,
    result: `${framing.fieldJoistsCount} joists (${framing.joistStockLengthFt}' ${joistLumber} boards)`,
  });

  // Check joist span limits (IRC Table R507.6)
  if (widthFt > framing.maxAllowableJoistSpanFt) {
    warnings.push({
      code: "DECK_JOIST_SPAN_EXCEEDED",
      field: "joistLumber",
      message: `Deck projection (${widthFt}') exceeds maximum allowable clear span (${framing.maxAllowableJoistSpanFt}') for ${joistLumber} at ${joistSpacingInches}" OC (IRC Table R507.6). Upsize to deeper joists (e.g. 2x10 / 2x12) or install a drop beam support.`,
    });
  }

  // Check composite decking joist spacing rule
  if (boardInfo.isComposite && joistSpacingInches > 16) {
    warnings.push({
      code: "COMPOSITE_JOIST_SPACING_TOO_WIDE",
      field: "joistSpacingInches",
      message: `Composite decking requires maximum 16" OC joist spacing (12" OC for diagonal layout). 24" OC spacing will cause surface sagging and void manufacturer warranties.`,
    });
  }

  if (boardInfo.isComposite && boardOrientation === "diagonal" && joistSpacingInches > 12) {
    warnings.push({
      code: "DIAGONAL_COMPOSITE_12OC_REQUIRED",
      field: "joistSpacingInches",
      message: `Diagonal composite decking requires 12" OC joist spacing per manufacturer standards (Trex, TimberTech) to prevent bounce.`,
    });
  }

  // 3. Concrete Pier Footings
  const concrete = calculateDeckConcreteTakeoff(
    framing.supportPostsCount,
    pierDiameterInches,
    pierDepthInches
  );

  steps.push({
    label: `Calculate Concrete Pier Footings (${concrete.pierFootingCount} Piers)`,
    formula: "Posts × π × (D/24)² × (H/12)",
    values: `${concrete.pierFootingCount} piers × ${concrete.volumePerPierCuFt} cu ft/pier`,
    result: `${concrete.totalConcreteVolumeCuYd} cu yds (${concrete.concreteBags80Lb} × 80lb bags)`,
  });

  // 4. Hardware & Fasteners
  const hardware = calculateDeckHardwareTakeoff(
    decking.deckSurfaceAreaSqFt,
    framing.fieldJoistsCount,
    framing.ledgerLengthFt,
    framing.supportPostsCount,
    boardInfo.isComposite
  );

  // 5. Optional Cost Estimation
  let costEstimate: DeckCostEstimate | undefined;
  if (costRates) {
    const priceDeckBoard = costRates.pricePerDeckBoard ?? 0;
    const priceJoist = costRates.pricePerJoistBoard ?? 0;
    const priceBeam = costRates.pricePerBeamBoard ?? 0;
    const pricePost = costRates.pricePerPostBoard ?? 0;
    const priceConcrete = costRates.pricePerConcreteBag ?? 0;
    const priceHardware = costRates.pricePerHardwarePack ?? 0;

    const deckingCost = decking.totalStockBoardsRequired * priceDeckBoard;
    const framingCost =
      (framing.fieldJoistsCount + framing.rimJoistPieces + framing.ledgerBoardPieces) * priceJoist +
      framing.beamBoardPieces * priceBeam +
      framing.supportPostsCount * pricePost;
    const concreteCost = concrete.concreteBags80Lb * priceConcrete;
    const hardwareCost =
      hardware.joistHangersCount * 2.5 +
      hardware.ledgerLagScrewsCount * 1.5 +
      hardware.hiddenFastenerBoxes * 65.0 +
      priceHardware;
    const totalEstimatedCost = deckingCost + framingCost + concreteCost + hardwareCost;

    costEstimate = {
      deckingCost: roundTo(deckingCost, 2),
      framingCost: roundTo(framingCost, 2),
      concreteCost: roundTo(concreteCost, 2),
      hardwareCost: roundTo(hardwareCost, 2),
      totalEstimatedCost: roundTo(totalEstimatedCost, 2),
    };
  }

  // Code & Safety Disclaimer
  warnings.push({
    code: "STRUCTURAL_DECK_CODE_DISCLAIMER",
    message: "Material takeoff and framing geometry estimate only. Soil bearing capacity, frost line depth, ledger attachment to house band joists, guardrail post attachment (500 lb load), and continuous load paths must comply with IRC Section R507 and local building department codes.",
  });

  return {
    lengthFt,
    widthFt,
    decking,
    framing,
    concrete,
    hardware,
    costEstimate,
    warnings,
    steps,
  };
}
