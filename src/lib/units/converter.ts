import type {
  LengthUnit,
  AreaUnit,
  VolumeUnit,
  WeightUnit,
  AngleUnit,
  TemperatureUnit,
  PressureUnit,
  EnergyUnit,
  PowerUnit,
  AnyUnit,
} from "@/types/units";
import type { Measurement, SlopeResult } from "@/types/calculations";
import {
  LENGTH_DEFINITIONS,
  AREA_DEFINITIONS,
  VOLUME_DEFINITIONS,
  WEIGHT_DEFINITIONS,
  ANGLE_DEFINITIONS,
  TEMPERATURE_DEFINITIONS,
  PRESSURE_DEFINITIONS,
  ENERGY_DEFINITIONS,
  POWER_DEFINITIONS,
} from "./definitions";

function assertFiniteNumber(value: number, context: string): void {
  if (!Number.isFinite(value)) {
    throw new TypeError(
      `Cannot convert non-finite value (${value}) in ${context}`
    );
  }
}

/**
 * Eliminates binary floating point noise (e.g. 12.000000000000002 -> 12)
 * without sacrificing true decimal precision.
 */
function cleanPrecision(val: number): number {
  const rounded = Math.round(val);
  if (Math.abs(val - rounded) < 1e-12) {
    return rounded;
  }
  return parseFloat(val.toPrecision(12));
}

/**
 * Converts a length measurement between supported length units.
 */
export function convertLength(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit
): number {
  assertFiniteNumber(value, "convertLength");
  if (fromUnit === toUnit) return value;

  const fromDef = LENGTH_DEFINITIONS[fromUnit];
  const toDef = LENGTH_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid length units: ${fromUnit} -> ${toUnit}`);
  }

  const inMeters = value * fromDef.toBase;
  return cleanPrecision(inMeters / toDef.toBase);
}

/**
 * Converts an area measurement between supported area units.
 */
export function convertArea(
  value: number,
  fromUnit: AreaUnit,
  toUnit: AreaUnit
): number {
  assertFiniteNumber(value, "convertArea");
  if (fromUnit === toUnit) return value;

  const fromDef = AREA_DEFINITIONS[fromUnit];
  const toDef = AREA_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid area units: ${fromUnit} -> ${toUnit}`);
  }

  const inSqMeters = value * fromDef.toBase;
  return cleanPrecision(inSqMeters / toDef.toBase);
}

/**
 * Converts a volume measurement between supported volume units.
 */
export function convertVolume(
  value: number,
  fromUnit: VolumeUnit,
  toUnit: VolumeUnit
): number {
  assertFiniteNumber(value, "convertVolume");
  if (fromUnit === toUnit) return value;

  const fromDef = VOLUME_DEFINITIONS[fromUnit];
  const toDef = VOLUME_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid volume units: ${fromUnit} -> ${toUnit}`);
  }

  const inCuMeters = value * fromDef.toBase;
  return cleanPrecision(inCuMeters / toDef.toBase);
}

/**
 * Converts a weight measurement between supported weight units.
 */
export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  assertFiniteNumber(value, "convertWeight");
  if (fromUnit === toUnit) return value;

  const fromDef = WEIGHT_DEFINITIONS[fromUnit];
  const toDef = WEIGHT_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid weight units: ${fromUnit} -> ${toUnit}`);
  }

  const inKg = value * fromDef.toBase;
  return cleanPrecision(inKg / toDef.toBase);
}

/**
 * Converts an angle measurement between supported angle units.
 */
export function convertAngle(
  value: number,
  fromUnit: AngleUnit,
  toUnit: AngleUnit
): number {
  assertFiniteNumber(value, "convertAngle");
  if (fromUnit === toUnit) return value;

  if (fromUnit === "percent-grade") {
    const radians = Math.atan(value / 100);
    if (toUnit === "radians") return cleanPrecision(radians);
    if (toUnit === "degrees") return cleanPrecision(radians * (180 / Math.PI));
  }

  if (toUnit === "percent-grade") {
    const fromDef = ANGLE_DEFINITIONS[fromUnit];
    const radians = value * fromDef.toBase;
    return cleanPrecision(Math.tan(radians) * 100);
  }

  const fromDef = ANGLE_DEFINITIONS[fromUnit];
  const toDef = ANGLE_DEFINITIONS[toUnit];

  const inRadians = value * fromDef.toBase;
  return cleanPrecision(inRadians / toDef.toBase);
}

/**
 * Converts a temperature measurement (Celsius, Fahrenheit, Kelvin).
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit
): number {
  assertFiniteNumber(value, "convertTemperature");
  if (fromUnit === toUnit) return value;

  // First convert to Kelvin
  let kelvin = value;
  if (fromUnit === "celsius") {
    kelvin = value + 273.15;
  } else if (fromUnit === "fahrenheit") {
    kelvin = (value - 32) * (5 / 9) + 273.15;
  }

  if (kelvin < 0) {
    throw new RangeError("Temperature cannot be below absolute zero (0 K)");
  }

  // Convert Kelvin to target
  let target = kelvin;
  if (toUnit === "celsius") {
    target = kelvin - 273.15;
  } else if (toUnit === "fahrenheit") {
    target = (kelvin - 273.15) * (9 / 5) + 32;
  }

  return cleanPrecision(target);
}

/**
 * Converts a pressure measurement (psi, bar, pascal, kPa, atm).
 */
export function convertPressure(
  value: number,
  fromUnit: PressureUnit,
  toUnit: PressureUnit
): number {
  assertFiniteNumber(value, "convertPressure");
  if (fromUnit === toUnit) return value;

  const fromDef = PRESSURE_DEFINITIONS[fromUnit];
  const toDef = PRESSURE_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid pressure units: ${fromUnit} -> ${toUnit}`);
  }

  const inPascals = value * fromDef.toBase;
  return cleanPrecision(inPascals / toDef.toBase);
}

/**
 * Converts an energy measurement (joule, kJ, BTU, kWh, calorie).
 */
export function convertEnergy(
  value: number,
  fromUnit: EnergyUnit,
  toUnit: EnergyUnit
): number {
  assertFiniteNumber(value, "convertEnergy");
  if (fromUnit === toUnit) return value;

  const fromDef = ENERGY_DEFINITIONS[fromUnit];
  const toDef = ENERGY_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid energy units: ${fromUnit} -> ${toUnit}`);
  }

  const inJoules = value * fromDef.toBase;
  return cleanPrecision(inJoules / toDef.toBase);
}

/**
 * Converts a power measurement (watt, kW, horsepower, BTU/hr).
 */
export function convertPower(
  value: number,
  fromUnit: PowerUnit,
  toUnit: PowerUnit
): number {
  assertFiniteNumber(value, "convertPower");
  if (fromUnit === toUnit) return value;

  const fromDef = POWER_DEFINITIONS[fromUnit];
  const toDef = POWER_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Invalid power units: ${fromUnit} -> ${toUnit}`);
  }

  const inWatts = value * fromDef.toBase;
  return cleanPrecision(inWatts / toDef.toBase);
}

/**
 * Converts a rise/run slope into multiple standard representations
 * (degrees, radians, percentage grade, and standard x:12 pitch notation).
 */
export function convertSlope(rise: number, run: number = 12): SlopeResult {
  assertFiniteNumber(rise, "convertSlope rise");
  assertFiniteNumber(run, "convertSlope run");

  if (run === 0) {
    throw new Error("Slope run cannot be zero (vertical line)");
  }

  const slopeFraction = Math.abs(rise) / Math.abs(run);
  const radians = Math.atan(slopeFraction);
  const degrees = radians * (180 / Math.PI);
  const percentGrade = slopeFraction * 100;

  const normalizedRise = slopeFraction * 12;
  const roundedRise = Math.round(normalizedRise * 100) / 100;

  return {
    degrees: cleanPrecision(degrees),
    radians: cleanPrecision(radians),
    percentGrade: cleanPrecision(percentGrade),
    pitchRatio: {
      rise: roundedRise,
      run: 12,
    },
    pitchNotation: `${roundedRise}:12`,
  };
}

/**
 * Generic typed measurement converter.
 */
export function convertMeasurement<U extends AnyUnit>(
  measurement: Measurement<U>,
  targetUnit: U
): Measurement<U> {
  const { value, unit } = measurement;
  if (unit === targetUnit) return measurement;

  if (unit in LENGTH_DEFINITIONS && targetUnit in LENGTH_DEFINITIONS) {
    return {
      value: convertLength(value, unit as LengthUnit, targetUnit as LengthUnit),
      unit: targetUnit,
    };
  }

  if (unit in AREA_DEFINITIONS && targetUnit in AREA_DEFINITIONS) {
    return {
      value: convertArea(value, unit as AreaUnit, targetUnit as AreaUnit),
      unit: targetUnit,
    };
  }

  if (unit in VOLUME_DEFINITIONS && targetUnit in VOLUME_DEFINITIONS) {
    return {
      value: convertVolume(value, unit as VolumeUnit, targetUnit as VolumeUnit),
      unit: targetUnit,
    };
  }

  if (unit in WEIGHT_DEFINITIONS && targetUnit in WEIGHT_DEFINITIONS) {
    return {
      value: convertWeight(value, unit as WeightUnit, targetUnit as WeightUnit),
      unit: targetUnit,
    };
  }

  if (unit in ANGLE_DEFINITIONS && targetUnit in ANGLE_DEFINITIONS) {
    return {
      value: convertAngle(value, unit as AngleUnit, targetUnit as AngleUnit),
      unit: targetUnit,
    };
  }

  if (unit in TEMPERATURE_DEFINITIONS && targetUnit in TEMPERATURE_DEFINITIONS) {
    return {
      value: convertTemperature(value, unit as TemperatureUnit, targetUnit as TemperatureUnit),
      unit: targetUnit,
    };
  }

  if (unit in PRESSURE_DEFINITIONS && targetUnit in PRESSURE_DEFINITIONS) {
    return {
      value: convertPressure(value, unit as PressureUnit, targetUnit as PressureUnit),
      unit: targetUnit,
    };
  }

  if (unit in ENERGY_DEFINITIONS && targetUnit in ENERGY_DEFINITIONS) {
    return {
      value: convertEnergy(value, unit as EnergyUnit, targetUnit as EnergyUnit),
      unit: targetUnit,
    };
  }

  if (unit in POWER_DEFINITIONS && targetUnit in POWER_DEFINITIONS) {
    return {
      value: convertPower(value, unit as PowerUnit, targetUnit as PowerUnit),
      unit: targetUnit,
    };
  }

  throw new Error(`Incompatible units: ${unit} and ${targetUnit}`);
}
