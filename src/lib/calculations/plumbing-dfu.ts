import type {
  FixtureCalculationSubtotal,
  PipeSlope,
  PlumbingDfuInput,
  PlumbingDfuResult,
  StandardDrainPipeSizeInches,
} from "@/types/plumbing-dfu";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import {
  IPC_DRAIN_CAPACITIES,
  PIPE_SIZE_NUMERIC_MAP,
  STANDARD_DRAIN_PIPE_SIZES,
  UPC_DRAIN_CAPACITIES,
} from "@/data/references/plumbing-dfu-types";
import { roundTo } from "./rounding";

/**
 * Pure deterministic calculation engine for Plumbing Drainage Fixture Unit (DFU) & Pipe Sizing per IPC and UPC.
 */
export function calculatePlumbingDfu(input: PlumbingDfuInput): PlumbingDfuResult {
  const {
    codeStandard = "IPC",
    systemType = "horizontal_branch",
    pipeSlope = "1_4",
    fixtures = [],
    continuousPumpGpm = 0,
  } = input;

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  let totalFixtureCount = 0;
  let rawFixtureDfu = 0;
  let containsWaterCloset = false;
  let waterClosetCount = 0;
  let maxIndividualTrapNumeric = 1.25;
  let largestTrapSize: StandardDrainPipeSizeInches = "1-1/4";

  const fixtureBreakdown: FixtureCalculationSubtotal[] = [];

  // 1. Process Fixture Schedule
  for (const item of fixtures) {
    const qty = Math.max(0, item.quantity);
    if (qty > 0) {
      totalFixtureCount += qty;
      const subtotalDfu = roundTo(qty * item.dfuEach, 2);
      rawFixtureDfu += subtotalDfu;

      const isWc = Boolean(item.isWaterCloset || item.fixtureId.includes("water_closet") || item.fixtureId.includes("bathroom_group"));
      if (isWc) {
        containsWaterCloset = true;
        waterClosetCount += qty;
      }

      const trapNumeric = PIPE_SIZE_NUMERIC_MAP[item.minTrapSizeInches] || 1.25;
      if (trapNumeric > maxIndividualTrapNumeric) {
        maxIndividualTrapNumeric = trapNumeric;
        largestTrapSize = item.minTrapSizeInches;
      }

      fixtureBreakdown.push({
        fixtureId: item.fixtureId,
        name: item.name,
        quantity: qty,
        dfuEach: item.dfuEach,
        subtotalDfu,
        minTrapSizeInches: item.minTrapSizeInches,
        isWaterCloset: isWc,
      });
    }
  }

  // 2. Continuous Flow / Pump Discharge (1 GPM = 2 DFU per IPC 709.3 & UPC 702.2)
  let continuousPumpDfu = 0;
  if (continuousPumpGpm > 0) {
    continuousPumpDfu = roundTo(continuousPumpGpm * 2, 1);
    steps.push({
      label: "Continuous Flow / Pump Discharge Load (1 GPM = 2 DFU)",
      formula: "Pump DFU = Continuous GPM × 2 DFU/GPM",
      values: `${continuousPumpGpm} GPM × 2`,
      result: `${continuousPumpDfu} DFU`,
    });
  }

  const totalCalculatedDfu = roundTo(rawFixtureDfu + continuousPumpDfu, 1);

  if (totalCalculatedDfu <= 0 && totalFixtureCount <= 0) {
    throw new RangeError("Plumbing fixture schedule must contain at least one active fixture or continuous discharge pump");
  }

  steps.push({
    label: "Total Drainage Fixture Unit (DFU) Aggregation",
    formula: "Total DFU = Σ (Fixture Qty × DFU Each) + Continuous Pump DFU",
    values: `${rawFixtureDfu} Fixture DFU + ${continuousPumpDfu} Pump DFU`,
    result: `${totalCalculatedDfu} Total DFU (${totalFixtureCount} total fixtures)`,
  });

  // 3. Determine Minimum Permitted Pipe Size Floor
  let minPermittedPipeSizeInches: StandardDrainPipeSizeInches = largestTrapSize;
  let governingCodeRule = "";

  if (containsWaterCloset) {
    // The Mandatory 3-Inch Water Closet Rule (IPC 710.1 / UPC 703.1)
    minPermittedPipeSizeInches = "3";
    governingCodeRule = `Governed by the 3-Inch Water Closet Rule (IPC 710.1 / UPC 703.1): Minimum 3\" diameter required for any drain line serving one or more water closets.`;
    steps.push({
      label: "Mandatory Water Closet Minimum Pipe Floor",
      formula: "Minimum Size = 3\" for all lines serving water closets",
      values: `${waterClosetCount} Water Closet(s) present in schedule`,
      result: `3\" Minimum Pipe Floor Enforced`,
    });
  } else {
    governingCodeRule = `Governed by largest individual fixture trap size (${largestTrapSize}\") and calculated DFU load (${totalCalculatedDfu} DFU).`;
  }

  // 4. Determine Pipe Capacity by Selected Code Standard & System Type
  let capacitiesMap: Record<StandardDrainPipeSizeInches, number>;
  let tableNameLabel = "";

  if (codeStandard === "IPC") {
    if (systemType === "horizontal_branch") {
      capacitiesMap = IPC_DRAIN_CAPACITIES.horizontalBranch;
      tableNameLabel = "IPC Table 710.1(2) - Horizontal Fixture Branch Maximum DFU";
    } else if (systemType === "vertical_stack") {
      capacitiesMap = IPC_DRAIN_CAPACITIES.verticalStackTotal;
      tableNameLabel = "IPC Table 710.1(2) - Vertical Drainage Stack Maximum DFU (<= 3 Stories)";
    } else {
      // Building drain or sewer
      const slopeMap = IPC_DRAIN_CAPACITIES.buildingDrainBySlope[pipeSlope] || IPC_DRAIN_CAPACITIES.buildingDrainBySlope["1_4"];
      capacitiesMap = slopeMap as Record<StandardDrainPipeSizeInches, number>;
      tableNameLabel = `IPC Table 710.1(1) - Building Drain & Sewer (${getSlopeLabel(pipeSlope)} Slope)`;
    }
  } else {
    // UPC
    if (systemType === "horizontal_branch") {
      capacitiesMap = UPC_DRAIN_CAPACITIES.horizontalBranch;
      tableNameLabel = "UPC Table 703.2 - Horizontal Drainage Branch Maximum DFU";
    } else if (systemType === "vertical_stack") {
      capacitiesMap = UPC_DRAIN_CAPACITIES.verticalStackTotal;
      tableNameLabel = "UPC Table 703.2 - Vertical Drainage Stack Maximum DFU";
    } else {
      // Building drain or sewer
      const slopeMap = UPC_DRAIN_CAPACITIES.buildingDrainBySlope[pipeSlope] || UPC_DRAIN_CAPACITIES.buildingDrainBySlope["1_4"];
      capacitiesMap = slopeMap as Record<StandardDrainPipeSizeInches, number>;
      tableNameLabel = `UPC Table 703.2 - Building Drain & Sewer (${getSlopeLabel(pipeSlope)} Slope)`;
    }
  }

  // 5. Select Smallest Compliant Pipe Size
  const minPermittedNumeric = PIPE_SIZE_NUMERIC_MAP[minPermittedPipeSizeInches];
  let recommendedPipeSizeInches: StandardDrainPipeSizeInches = "8";
  let maxCapacityDfuForSelectedSize = 0;

  for (const size of STANDARD_DRAIN_PIPE_SIZES) {
    const sizeNumeric = PIPE_SIZE_NUMERIC_MAP[size];
    if (sizeNumeric >= minPermittedNumeric) {
      const cap = capacitiesMap[size] || 0;
      if (cap >= totalCalculatedDfu) {
        recommendedPipeSizeInches = size;
        maxCapacityDfuForSelectedSize = cap;
        break;
      }
    }
  }

  if (maxCapacityDfuForSelectedSize === 0) {
    // Sizing exceeds 8" or is outside standard residential table range
    recommendedPipeSizeInches = "8";
    maxCapacityDfuForSelectedSize = capacitiesMap["8"] || 1400;
  }

  if (codeStandard === "IPC" && systemType === "horizontal_branch" && recommendedPipeSizeInches === "3" && waterClosetCount > 2) {
    warnings.push({
      code: "IPC_3IN_BRANCH_MAX_2_WC",
      field: "recommendedPipeSizeInches",
      message: `IPC Table 710.1(2) restricts a 3\" horizontal branch drain to a maximum of 2 water closets. Because your schedule contains ${waterClosetCount} water closets, a 4\" horizontal branch is required by code.`,
    });
    recommendedPipeSizeInches = "4";
    maxCapacityDfuForSelectedSize = capacitiesMap["4"];
  }

  if (codeStandard === "UPC" && systemType === "horizontal_branch" && recommendedPipeSizeInches === "3" && waterClosetCount > 3) {
    warnings.push({
      code: "UPC_3IN_BRANCH_MAX_3_WC",
      field: "recommendedPipeSizeInches",
      message: `UPC Table 703.2 restricts a 3\" horizontal drainage branch to a maximum of 3 water closets. Because your schedule contains ${waterClosetCount} water closets, a 4\" branch drain is required.`,
    });
    recommendedPipeSizeInches = "4";
    maxCapacityDfuForSelectedSize = capacitiesMap["4"];
  }

  const capacityUtilizationPct = roundTo(
    (totalCalculatedDfu / maxCapacityDfuForSelectedSize) * 100,
    1
  );

  steps.push({
    label: `Pipe Sizing Table Lookup (${tableNameLabel})`,
    formula: `Selected Size = Smallest size where Table Capacity >= ${totalCalculatedDfu} DFU and Size >= ${minPermittedPipeSizeInches}\"`,
    values: `${totalCalculatedDfu} DFU on ${systemType.replace("_", " ")} under ${codeStandard}`,
    result: `${recommendedPipeSizeInches}\" Pipe (${maxCapacityDfuForSelectedSize} DFU Max Capacity, ${capacityUtilizationPct}% Utilized)`,
  });

  if ((systemType === "building_drain" || systemType === "building_sewer") && pipeSlope === "1_8") {
    if (!containsWaterCloset && totalCalculatedDfu <= 21) {
      warnings.push({
        code: "SLOPE_1_8_PROHIBITED_UNDER_3IN",
        field: "pipeSlope",
        message: `Both IPC 704.1 and UPC 708.0 prohibit a 1/8\" per foot slope for drainage pipes smaller than 3\". Because 1/8\" slope was selected, the line was upsized to 3\" (or switch to 1/4\" slope to allow 2\"/2-1/2\" pipe).`,
      });
    } else if (codeStandard === "UPC" && recommendedPipeSizeInches === "3") {
      warnings.push({
        code: "UPC_3IN_SLOPE_AHJ_APPROVAL",
        field: "pipeSlope",
        message: `UPC Section 708.1 requires 1/4\" per foot slope for 3\" building drains unless specific practical difficulty is demonstrated and approved by the local plumbing inspector / AHJ.`,
      });
    }
  }

  if (capacityUtilizationPct > 85) {
    warnings.push({
      code: "HIGH_DFU_CAPACITY_UTILIZATION",
      message: `Calculated load (${totalCalculatedDfu} DFU) utilizes ${capacityUtilizationPct}% of the ${recommendedPipeSizeInches}\" pipe's maximum rated capacity. For heavy-use systems or future fixture additions, consider upsizing to the next diameter.`,
    });
  }

  // Technical Disclaimer
  warnings.push({
    code: "PLUMBING_CODE_DISCLAIMER",
    message: `Calculated per ${codeStandard} sanitary drainage standards. Plumbing codes and local amendments vary significantly by municipality. This calculator is an engineering estimation aid and does not substitute for on-site verification, official isometric plan submittals, or licensed master plumber sign-off.`,
  });

  return {
    codeStandard,
    systemType,
    pipeSlope,
    totalFixtureCount,
    totalCalculatedDfu,
    continuousPumpDfu,
    recommendedPipeSizeInches,
    minPermittedPipeSizeInches,
    maxCapacityDfuForSelectedSize,
    capacityUtilizationPct,
    governingCodeRule,
    containsWaterCloset,
    waterClosetCount,
    fixtureBreakdown,
    warnings,
    steps,
  };
}

function getSlopeLabel(slope: PipeSlope): string {
  switch (slope) {
    case "1_16":
      return "1/16\" per ft (0.5%)";
    case "1_8":
      return "1/8\" per ft (1.0%)";
    case "1_4":
      return "1/4\" per ft (2.0%)";
    case "1_2":
      return "1/2\" per ft (4.0%)";
    default:
      return "1/4\" per ft";
  }
}
