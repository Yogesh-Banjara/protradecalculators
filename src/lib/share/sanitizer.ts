/**
 * Input Sanitizer & Security Utilities
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Ensures all user-provided or URL-deserialized parameters are strictly sanitized
 * to prevent XSS, memory exhaustion, NaN crashes, and prototype pollution.
 */

/**
 * Safely parses and clamps a numeric input value within allowed bounds.
 */
export function sanitizeNumber(
  val: unknown,
  defaultValue: number,
  min: number = -1e9,
  max: number = 1e9
): number {
  if (val === null || val === undefined || val === "") {
    return defaultValue;
  }

  let num: number;
  if (typeof val === "number") {
    num = val;
  } else if (typeof val === "string") {
    num = parseFloat(val);
  } else {
    return defaultValue;
  }

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return defaultValue;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * Sanitizes string inputs by stripping HTML tags, control characters, and limiting length.
 */
export function sanitizeString(
  val: unknown,
  defaultValue: string = "",
  maxLength: number = 200
): string {
  if (typeof val !== "string") {
    return defaultValue;
  }

  // Strip dangerous script tags and HTML tags
  const clean = val
    .replace(/<[^>]*>/g, "")
    .replace(/[^\x20-\x7E\t\n\r]/g, "") // Printable ASCII only
    .trim();

  if (clean.length === 0) {
    return defaultValue;
  }

  return clean.slice(0, maxLength);
}

/**
 * Validates that an input value exists within a strict whitelist of allowed enum values.
 */
export function sanitizeEnum<T extends string>(
  val: unknown,
  allowedValues: readonly T[],
  defaultValue: T
): T {
  if (typeof val !== "string") {
    return defaultValue;
  }

  return allowedValues.includes(val as T) ? (val as T) : defaultValue;
}

/**
 * Safely converts an input into a boolean.
 */
export function sanitizeBoolean(val: unknown, defaultValue: boolean = false): boolean {
  if (typeof val === "boolean") {
    return val;
  }
  if (typeof val === "string") {
    const lower = val.toLowerCase().trim();
    if (lower === "true" || lower === "1" || lower === "yes") return true;
    if (lower === "false" || lower === "0" || lower === "no") return false;
  }
  if (typeof val === "number") {
    if (val === 1) return true;
    if (val === 0) return false;
  }
  return defaultValue;
}
