import type { AnyUnit, CurrencyCode, UnitDisplayOptions } from "@/types/units";
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
  CURRENCY_SYMBOLS,
} from "./definitions";

const ALL_DEFINITIONS: Record<string, { symbol: string; name: string; plural: string }> = {
  ...LENGTH_DEFINITIONS,
  ...AREA_DEFINITIONS,
  ...VOLUME_DEFINITIONS,
  ...WEIGHT_DEFINITIONS,
  ...ANGLE_DEFINITIONS,
  ...TEMPERATURE_DEFINITIONS,
  ...PRESSURE_DEFINITIONS,
  ...ENERGY_DEFINITIONS,
  ...POWER_DEFINITIONS,
};

/**
 * Returns the standard unit symbol (e.g. "in", "sq ft", "cu yd", "lbs", "°F", "psi", "kW").
 */
export function getUnitSymbol(unit: AnyUnit): string {
  if (unit in CURRENCY_SYMBOLS) {
    return CURRENCY_SYMBOLS[unit as CurrencyCode].symbol;
  }
  return ALL_DEFINITIONS[unit]?.symbol ?? unit;
}

/**
 * Returns the human-readable label for a unit (e.g. "cubic yard" or "cubic yards").
 */
export function getUnitLabel(unit: AnyUnit, plural: boolean = false): string {
  if (unit in CURRENCY_SYMBOLS) {
    return CURRENCY_SYMBOLS[unit as CurrencyCode].name;
  }
  const def = ALL_DEFINITIONS[unit];
  if (!def) return unit;
  return plural ? def.plural : def.name;
}

/**
 * Formats a currency amount with standard currency code formatting.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a numeric value with unit and optional precision.
 */
export function formatUnit(
  value: number,
  unit: AnyUnit,
  options?: UnitDisplayOptions
): string {
  if (!Number.isFinite(value)) return "—";

  if (unit in CURRENCY_SYMBOLS) {
    return formatCurrency(value, unit as CurrencyCode);
  }

  const precision = options?.precision ?? 2;
  const showSymbol = options?.showSymbol ?? true;

  const formattedNum = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(value);

  if (!showSymbol) return formattedNum;

  const symbol = getUnitSymbol(unit);
  if (symbol === "°" || symbol === "%" || symbol === "°C" || symbol === "°F") {
    return `${formattedNum}${symbol}`;
  }

  return `${formattedNum} ${symbol}`;
}

/**
 * Converts a decimal inch value to an architectural fraction representation
 * (e.g., 3.625 -> 3 5/8").
 */
export function formatFractionalInches(
  inches: number,
  denominator: 2 | 4 | 8 | 16 | 32 = 16
): string {
  if (!Number.isFinite(inches)) return "—";

  const whole = Math.floor(Math.abs(inches));
  const decimal = Math.abs(inches) - whole;
  const numerator = Math.round(decimal * denominator);

  const sign = inches < 0 ? "-" : "";

  if (numerator === 0) {
    return `${sign}${whole}"`;
  }

  if (numerator === denominator) {
    return `${sign}${whole + 1}"`;
  }

  // Reduce fraction
  let n = numerator;
  let d = denominator;

  while (n % 2 === 0 && d % 2 === 0) {
    n /= 2;
    d /= 2;
  }

  if (whole === 0) {
    return `${sign}${n}/${d}"`;
  }

  return `${sign}${whole} ${n}/${d}"`;
}
