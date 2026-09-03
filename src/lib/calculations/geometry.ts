import { convertVolume } from "../units/converter";
import type { VolumeUnit } from "@/types/units";
import type { CalculationResult, SlopeResult } from "@/types/calculations";

/**
 * Calculates area of a rectangle.
 */
export function calculateRectangleArea(length: number, width: number): number {
  if (length < 0 || width < 0) {
    throw new RangeError("Length and width must be non-negative");
  }
  return length * width;
}

/**
 * Calculates perimeter of a rectangle.
 */
export function calculateRectanglePerimeter(length: number, width: number): number {
  if (length < 0 || width < 0) {
    throw new RangeError("Length and width must be non-negative");
  }
  return 2 * (length + width);
}

/**
 * Calculates area of a triangle.
 */
export function calculateTriangleArea(base: number, height: number): number {
  if (base < 0 || height < 0) {
    throw new RangeError("Base and height must be non-negative");
  }
  return 0.5 * base * height;
}

/**
 * Calculates area of a circle.
 */
export function calculateCircleArea(radius: number): number {
  if (radius < 0) {
    throw new RangeError("Radius must be non-negative");
  }
  return Math.PI * radius * radius;
}

/**
 * Calculates circumference of a circle.
 */
export function calculateCircleCircumference(radius: number): number {
  if (radius < 0) {
    throw new RangeError("Radius must be non-negative");
  }
  return 2 * Math.PI * radius;
}

/**
 * Calculates area of a trapezoid (useful for lot grading, footing trenches).
 */
export function calculateTrapezoidArea(
  base1: number,
  base2: number,
  height: number
): number {
  if (base1 < 0 || base2 < 0 || height < 0) {
    throw new RangeError("Trapezoid dimensions must be non-negative");
  }
  return 0.5 * (base1 + base2) * height;
}

/**
 * Calculates volume of a rectangular prism / box.
 */
export function calculateRectangularVolume(
  length: number,
  width: number,
  heightOrDepth: number
): number {
  if (length < 0 || width < 0 || heightOrDepth < 0) {
    throw new RangeError("Dimensions must be non-negative");
  }
  return length * width * heightOrDepth;
}

/**
 * Calculates volume of a cylinder (e.g., sonotube, round pier, pipe).
 */
export function calculateCylinderVolume(radius: number, height: number): number {
  if (radius < 0 || height < 0) {
    throw new RangeError("Radius and height must be non-negative");
  }
  return Math.PI * radius * radius * height;
}

/**
 * Calculates volume of a right pyramid.
 */
export function calculatePyramidVolume(
  baseLength: number,
  baseWidth: number,
  height: number
): number {
  if (baseLength < 0 || baseWidth < 0 || height < 0) {
    throw new RangeError("Dimensions must be non-negative");
  }
  return (baseLength * baseWidth * height) / 3;
}

/**
 * Calculates volume of a cone (e.g., aggregate stockpile).
 */
export function calculateConeVolume(radius: number, height: number): number {
  if (radius < 0 || height < 0) {
    throw new RangeError("Radius and height must be non-negative");
  }
  return (Math.PI * radius * radius * height) / 3;
}

/**
 * Standard concrete / earthwork slab volume calculation helper with mixed units:
 * Length (ft), Width (ft), Thickness/Depth (inches) -> Output in Cubic Yards.
 */
export function calculateSlabVolume(
  lengthFeet: number,
  widthFeet: number,
  thicknessInches: number,
  targetUnit: VolumeUnit = "cubic-yard"
): CalculationResult<number> {
  if (lengthFeet < 0 || widthFeet < 0 || thicknessInches < 0) {
    throw new RangeError("Slab dimensions must be non-negative");
  }

  const thicknessFeet = thicknessInches / 12;
  const volumeCubicFeet = lengthFeet * widthFeet * thicknessFeet;
  const volumeTarget = convertVolume(volumeCubicFeet, "cubic-foot", targetUnit);

  const steps = [
    {
      label: "Convert thickness to feet",
      formula: "thickness (inches) ÷ 12",
      values: `${thicknessInches}" ÷ 12`,
      result: `${thicknessFeet.toFixed(4)} ft`,
    },
    {
      label: "Calculate volume in cubic feet",
      formula: "length × width × thickness",
      values: `${lengthFeet} ft × ${widthFeet} ft × ${thicknessFeet.toFixed(4)} ft`,
      result: `${volumeCubicFeet.toFixed(3)} cu ft`,
    },
    {
      label: `Convert to ${targetUnit}`,
      formula: "cu ft to target unit conversion",
      values: `${volumeCubicFeet.toFixed(3)} cu ft`,
      result: `${volumeTarget.toFixed(3)} ${targetUnit}`,
    },
  ];

  return {
    value: volumeTarget,
    unit: targetUnit,
    steps,
    rawValue: volumeTarget,
  };
}

/**
 * Calculates true rafter length (hypotenuse) based on horizontal run and vertical rise,
 * plus optional eave overhang.
 */
export function calculateRafterLength(
  runFeet: number,
  riseFeet: number,
  overhangFeet: number = 0
): number {
  if (runFeet < 0 || riseFeet < 0 || overhangFeet < 0) {
    throw new RangeError("Rafter dimensions must be non-negative");
  }
  const baseRafter = Math.sqrt(runFeet * runFeet + riseFeet * riseFeet);
  if (overhangFeet === 0) return baseRafter;

  // Slope factor = rafter / run
  const slopeFactor = baseRafter / runFeet;
  return baseRafter + overhangFeet * slopeFactor;
}

/**
 * Calculates pitch, slope percentage, and slope angle in degrees from rise and run.
 */
export function calculateSlope(rise: number, run: number = 12): SlopeResult {
  if (run === 0) {
    throw new RangeError("Run cannot be zero");
  }
  const ratio = Math.abs(rise) / Math.abs(run);
  const radians = Math.atan(ratio);
  const degrees = radians * (180 / Math.PI);
  const percentGrade = ratio * 100;

  const normalizedRise = Math.round(ratio * 12 * 100) / 100;

  return {
    degrees,
    radians,
    percentGrade,
    pitchRatio: {
      rise: normalizedRise,
      run: 12,
    },
    pitchNotation: `${normalizedRise}:12`,
  };
}
