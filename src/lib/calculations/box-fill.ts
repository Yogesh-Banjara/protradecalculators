import type {
  BoxCandidateEvaluation,
  BoxFillDetailedBreakdown,
  BoxFillInput,
  BoxFillResult,
  ConductorFillRow,
} from "@/types/box-fill";
import type { CalculationStep, CalculationWarning } from "@/types/calculations";
import type { WireGaugeSize } from "@/types/electrical";
import {
  STANDARD_BOXES,
  STANDARD_MUD_RINGS,
  compareWireGauges,
  getConductorVolumeAllowance,
  getMudRing,
  getStandardBox,
} from "@/data/references/box-fill-types";
import { roundTo } from "./rounding";

/**
 * Finds the largest conductor size among a set of conductor rows.
 */
export function getLargestConductorSize(
  conductors: readonly ConductorFillRow[],
  fallback: WireGaugeSize = "14 AWG"
): WireGaugeSize {
  let largest = fallback;
  for (const c of conductors) {
    if (c.count > 0 && compareWireGauges(c.size, largest) > 0) {
      largest = c.size;
    }
  }
  return largest;
}

/**
 * Pure deterministic calculation engine for NEC 314.16 Electrical Box Fill.
 */
export function calculateBoxFillProject(input: BoxFillInput): BoxFillResult {
  const {
    conductors = [],
    internalClampsCount = 0,
    supportFittingsCount = 0,
    devices = [],
    equipmentGroundsCount = 0,
    largestGroundSize,
    isolatedGroundsCount = 0,
    selectedBoxId,
    customBoxVolumeCuIn,
    selectedMudRingId,
    customMudRingVolumeCuIn,
  } = input;

  const totalConductorCount = conductors.reduce(
    (acc, c) => (c.isPigtail ? acc : acc + c.count),
    0
  );

  if (
    totalConductorCount === 0 &&
    equipmentGroundsCount === 0 &&
    devices.length === 0
  ) {
    throw new RangeError(
      "At least one circuit conductor, ground wire, or device yoke is required for calculation"
    );
  }

  const warnings: CalculationWarning[] = [];
  const steps: CalculationStep[] = [];

  // Determine the largest conductor in the box for clamp and fitting volume sizing
  const largestConductorOverall = getLargestConductorSize(conductors, "14 AWG");

  // 1. Conductor Fill (NEC 314.16(B)(1))
  let conductorVolumeCuIn = 0;
  const conductorBreakdown: BoxFillDetailedBreakdown["conductorBreakdown"] = [];

  for (const c of conductors) {
    if (c.count <= 0) continue;
    const allowance = getConductorVolumeAllowance(c.size);

    if (c.isPigtail) {
      // Pigtails originating and remaining inside count as 0
      conductorBreakdown.push({
        size: c.size,
        count: c.count,
        allowancePerWireCuIn: 0,
        subtotalCuIn: 0,
      });
      continue;
    }

    const subtotal = c.count * allowance;
    conductorVolumeCuIn += subtotal;
    conductorBreakdown.push({
      size: c.size,
      count: c.count,
      allowancePerWireCuIn: allowance,
      subtotalCuIn: roundTo(subtotal, 2),
    });
  }
  conductorVolumeCuIn = roundTo(conductorVolumeCuIn, 2);

  steps.push({
    label: "Conductor Fill Volume (NEC 314.16(B)(1))",
    formula: "Σ (Conductor Count × Table 314.16(B) Allowance)",
    values: conductorBreakdown
      .filter((b) => b.subtotalCuIn > 0)
      .map((b) => `${b.count}× ${b.size} (${b.allowancePerWireCuIn} cu in) = ${b.subtotalCuIn} cu in`)
      .join(" + ") || "0 cu in",
    result: `${conductorVolumeCuIn} cu in (${totalConductorCount} active conductors)`,
  });

  // 2. Internal Cable Clamps (NEC 314.16(B)(2))
  let clampAllowanceCount = 0;
  let clampVolumeCuIn = 0;
  if (internalClampsCount > 0) {
    clampAllowanceCount = 1; // Exactly 1 allowance regardless of whether 1, 2, or 4 internal clamps exist
    clampVolumeCuIn = roundTo(
      getConductorVolumeAllowance(largestConductorOverall),
      2
    );
  }

  steps.push({
    label: "Internal Cable Clamps Fill (NEC 314.16(B)(2))",
    formula: "1 Allowance based on largest conductor (if internal clamps present)",
    values:
      internalClampsCount > 0
        ? `${internalClampsCount} internal clamp(s) present → 1× ${largestConductorOverall} allowance`
        : "No internal clamps (external connectors or conduit fittings used)",
    result: `${clampVolumeCuIn} cu in (${clampAllowanceCount} allowance)`,
  });

  // 3. Support Fittings / Studs (NEC 314.16(B)(3))
  const fittingAllowanceCount = supportFittingsCount;
  const fittingVolumeCuIn = roundTo(
    supportFittingsCount * getConductorVolumeAllowance(largestConductorOverall),
    2
  );

  if (supportFittingsCount > 0) {
    steps.push({
      label: "Support Fittings / Fixture Studs (NEC 314.16(B)(3))",
      formula: "1 Allowance per fixture stud based on largest conductor",
      values: `${supportFittingsCount} fixture stud(s) × ${getConductorVolumeAllowance(largestConductorOverall)} cu in (${largestConductorOverall})`,
      result: `${fittingVolumeCuIn} cu in`,
    });
  }

  // 4. Device or Equipment Yokes (NEC 314.16(B)(4))
  let deviceVolumeCuIn = 0;
  let deviceYokeAllowanceCount = 0;
  const deviceBreakdown: BoxFillDetailedBreakdown["deviceBreakdown"] = [];

  for (const dev of devices) {
    const multiplier = 2 * (dev.gangCount || 1); // 2 allowances per single-gang yoke
    const allowancePerWire = getConductorVolumeAllowance(dev.largestConnectedSize);
    const subtotal = multiplier * allowancePerWire;

    deviceVolumeCuIn += subtotal;
    deviceYokeAllowanceCount += multiplier;
    deviceBreakdown.push({
      name: dev.name,
      gangCount: dev.gangCount || 1,
      allowanceMultiplier: multiplier,
      largestSize: dev.largestConnectedSize,
      subtotalCuIn: roundTo(subtotal, 2),
    });
  }
  deviceVolumeCuIn = roundTo(deviceVolumeCuIn, 2);

  if (devices.length > 0) {
    steps.push({
      label: "Device & Equipment Yoke Fill (NEC 314.16(B)(4))",
      formula: "2 Allowances per gang based on largest connected conductor",
      values: deviceBreakdown
        .map(
          (d) =>
            `${d.name} (${d.gangCount}-gang): ${d.allowanceMultiplier}× ${d.largestSize} (${getConductorVolumeAllowance(d.largestSize)} cu in) = ${d.subtotalCuIn} cu in`
        )
        .join(" + "),
      result: `${deviceVolumeCuIn} cu in (${deviceYokeAllowanceCount} total yoke allowances)`,
    });
  }

  // 5. Equipment Grounding Conductors (NEC 314.16(B)(5))
  let groundVolumeCuIn = 0;
  let groundAllowanceCount = 0;
  const groundSize =
    largestGroundSize || getLargestConductorSize(conductors, "14 AWG");
  const groundUnitAllowance = getConductorVolumeAllowance(groundSize);

  if (equipmentGroundsCount > 0) {
    if (equipmentGroundsCount <= 4) {
      groundAllowanceCount = 1;
      groundVolumeCuIn = groundUnitAllowance;
    } else {
      // NEC 2020 / 2023 rule: 1 allowance for first 4 grounds + 0.25 allowance for each ground beyond 4
      groundAllowanceCount = 1 + 0.25 * (equipmentGroundsCount - 4);
      groundVolumeCuIn = roundTo(groundAllowanceCount * groundUnitAllowance, 2);
    }
  }

  // Isolated Grounding Conductors (if present)
  let isolatedGroundVolumeCuIn = 0;
  if (isolatedGroundsCount && isolatedGroundsCount > 0) {
    const igAllowanceCount =
      isolatedGroundsCount <= 4
        ? 1
        : 1 + 0.25 * (isolatedGroundsCount - 4);
    isolatedGroundVolumeCuIn = roundTo(igAllowanceCount * groundUnitAllowance, 2);
  }

  if (equipmentGroundsCount > 0 || (isolatedGroundsCount && isolatedGroundsCount > 0)) {
    steps.push({
      label: "Equipment Grounding Conductor Fill (NEC 314.16(B)(5))",
      formula:
        equipmentGroundsCount <= 4
          ? "1 Allowance for 1–4 grounds (based on largest ground wire)"
          : "1 Allowance for first 4 grounds + 0.25 allowance for each additional ground",
      values:
        equipmentGroundsCount <= 4
          ? `${equipmentGroundsCount} ground(s) → 1× ${groundSize} (${groundUnitAllowance} cu in)`
          : `${equipmentGroundsCount} grounds → (1 + 0.25 × ${equipmentGroundsCount - 4}) × ${groundUnitAllowance} cu in (${groundSize}) = ${groundVolumeCuIn} cu in`,
      result: `${groundVolumeCuIn} cu in (${groundAllowanceCount} ground allowance)`,
    });
  }

  // 6. Total Required Box Volume
  const totalRequiredVolumeCuIn = roundTo(
    conductorVolumeCuIn +
      clampVolumeCuIn +
      fittingVolumeCuIn +
      deviceVolumeCuIn +
      groundVolumeCuIn +
      isolatedGroundVolumeCuIn,
    2
  );

  steps.push({
    label: "Total Required Box Volume",
    formula: "Conductors + Clamps + Fittings + Devices + Grounds",
    values: `${conductorVolumeCuIn} (wires) + ${clampVolumeCuIn} (clamps) + ${fittingVolumeCuIn} (fittings) + ${deviceVolumeCuIn} (devices) + ${groundVolumeCuIn} (grounds)${isolatedGroundVolumeCuIn > 0 ? ` + ${isolatedGroundVolumeCuIn} (IG)` : ""}`,
    result: `${totalRequiredVolumeCuIn} cu in minimum capacity required`,
  });

  // 7. Box & Mud Ring Available Volume Evaluation
  const selectedBox = selectedBoxId
    ? getStandardBox(selectedBoxId)
    : STANDARD_BOXES.find((b) => b.standardVolumeCuIn >= totalRequiredVolumeCuIn) ||
      STANDARD_BOXES[0];

  const baseBoxVolumeCuIn =
    customBoxVolumeCuIn && customBoxVolumeCuIn > 0
      ? customBoxVolumeCuIn
      : selectedBox?.standardVolumeCuIn ?? 21.0;

  const selectedMudRing = selectedMudRingId
    ? getMudRing(selectedMudRingId)
    : STANDARD_MUD_RINGS[0];

  const mudRingVolumeCuIn =
    customMudRingVolumeCuIn !== undefined && customMudRingVolumeCuIn >= 0
      ? customMudRingVolumeCuIn
      : selectedMudRing?.additionalVolumeCuIn ?? 0;

  const totalAvailableVolumeCuIn = roundTo(
    baseBoxVolumeCuIn + mudRingVolumeCuIn,
    2
  );
  const remainingVolumeCuIn = roundTo(
    totalAvailableVolumeCuIn - totalRequiredVolumeCuIn,
    2
  );
  const fillPercentage = roundTo(
    (totalRequiredVolumeCuIn / totalAvailableVolumeCuIn) * 100,
    1
  );
  const isCompliant = totalRequiredVolumeCuIn <= totalAvailableVolumeCuIn;

  // 8. Candidate Box Sizing Comparison
  const candidates: BoxCandidateEvaluation[] = [];

  for (const box of STANDARD_BOXES) {
    const totalAvail = roundTo(
      box.standardVolumeCuIn + mudRingVolumeCuIn,
      2
    );
    const remaining = roundTo(totalAvail - totalRequiredVolumeCuIn, 2);
    const pct = roundTo((totalRequiredVolumeCuIn / totalAvail) * 100, 1);
    const status: BoxCandidateEvaluation["status"] =
      totalRequiredVolumeCuIn <= totalAvail ? "pass" : "fail";

    candidates.push({
      box,
      baseVolumeCuIn: box.standardVolumeCuIn,
      mudRingVolumeCuIn,
      totalAvailableVolumeCuIn: totalAvail,
      requiredVolumeCuIn: totalRequiredVolumeCuIn,
      remainingVolumeCuIn: remaining,
      fillPercentage: pct,
      status,
    });
  }

  // Smallest compliant standard box
  const passingBoxes = candidates.filter((c) => c.status === "pass");
  passingBoxes.sort(
    (a, b) => a.totalAvailableVolumeCuIn - b.totalAvailableVolumeCuIn
  );
  const recommendedCandidate = passingBoxes[0] || candidates[candidates.length - 1];

  const finalCandidates = candidates.map((c) =>
    c.box.id === recommendedCandidate?.box.id
      ? { ...c, status: "recommended" as const }
      : c
  );

  // Warnings
  if (!isCompliant) {
    warnings.push({
      code: "BOX_VOLUME_OVERFILL_NON_COMPLIANT",
      field: "selectedBoxId",
      message: `Selected box configuration (${totalAvailableVolumeCuIn} cu in) is insufficient for the required ${totalRequiredVolumeCuIn} cu in of conductor and device fill. Choose a deeper box, a larger mud ring, or an extension ring to avoid code violations and damaged conductors.`,
    });
  }

  if (internalClampsCount > 2) {
    warnings.push({
      code: "MULTIPLE_INTERNAL_CLAMPS_NOTICE",
      field: "internalClampsCount",
      message: "Per NEC 314.16(B)(2), only 1 volume allowance is deducted regardless of how many internal cable clamps are present in the box.",
    });
  }

  if (equipmentGroundsCount > 4) {
    warnings.push({
      code: "NEC_2020_GROUND_COUNT_FACTOR_APPLIED",
      field: "equipmentGroundsCount",
      message: `NEC 314.16(B)(5) (2020/2023 edition): ${equipmentGroundsCount} equipment grounding conductors are present. 1 allowance is applied for the first 4 grounds, plus 0.25 allowance for each additional ground (${groundAllowanceCount} total allowances).`,
    });
  }

  // Safety Disclaimer
  warnings.push({
    code: "BOX_FILL_CODE_DISCLAIMER",
    message: "Planning calculation based on NEC Article 314.16 (2020/2023). Manufacturer listed cubic-inch volume stamped inside metallic or plastic boxes overrides generic table estimates. Verify local code requirements with your Authority Having Jurisdiction (AHJ).",
  });

  const breakdown: BoxFillDetailedBreakdown = {
    conductorVolumeCuIn,
    conductorBreakdown,
    clampAllowanceCount,
    clampAllowanceSize: largestConductorOverall,
    clampVolumeCuIn,
    fittingAllowanceCount,
    fittingAllowanceSize: largestConductorOverall,
    fittingVolumeCuIn,
    deviceYokeAllowanceCount,
    deviceBreakdown,
    deviceVolumeCuIn,
    groundAllowanceCount,
    groundAllowanceSize: groundSize,
    groundVolumeCuIn,
    isolatedGroundVolumeCuIn,
  };

  return {
    totalRequiredVolumeCuIn,
    totalConductorCount,
    breakdown,
    selectedBox,
    selectedMudRing,
    baseBoxVolumeCuIn,
    mudRingVolumeCuIn,
    totalAvailableVolumeCuIn,
    remainingVolumeCuIn,
    fillPercentage,
    isCompliant,
    recommendedBox: recommendedCandidate.box,
    recommendedTotalAvailableVolumeCuIn:
      recommendedCandidate.totalAvailableVolumeCuIn,
    candidates: finalCandidates,
    warnings,
    steps,
  };
}
