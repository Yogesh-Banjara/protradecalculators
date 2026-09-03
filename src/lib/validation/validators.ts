import type {
  NumberValidationOptions,
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from "@/types/validation";

/**
 * Validates that a field is provided and not empty/null/undefined.
 */
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): ValidationResult<T> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) {
    errors.push({
      field: fieldName,
      code: "REQUIRED_FIELD",
      message: `${fieldName} is required`,
    });
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, value: value as T, errors, warnings };
}

/**
 * Validates a strictly positive numeric input (> 0).
 */
export function validatePositiveNumber(
  value: unknown,
  options: NumberValidationOptions
): ValidationResult<number> {
  const { fieldName, max, integerOnly, warningThresholds } = options;
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (value === null || value === undefined || value === "") {
    errors.push({
      field: fieldName,
      code: "REQUIRED",
      message: `${fieldName} is required`,
    });
    return { isValid: false, errors, warnings };
  }

  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) {
    errors.push({
      field: fieldName,
      code: "INVALID_NUMBER",
      message: `${fieldName} must be a valid number`,
    });
    return { isValid: false, errors, warnings };
  }

  if (num <= 0) {
    errors.push({
      field: fieldName,
      code: "NOT_POSITIVE",
      message: `${fieldName} must be greater than zero`,
    });
    return { isValid: false, errors, warnings };
  }

  if (integerOnly && !Number.isInteger(num)) {
    errors.push({
      field: fieldName,
      code: "NOT_INTEGER",
      message: `${fieldName} must be a whole number`,
    });
    return { isValid: false, errors, warnings };
  }

  if (max !== undefined && num > max) {
    errors.push({
      field: fieldName,
      code: "EXCEEDS_MAX",
      message: `${fieldName} cannot exceed ${max}`,
    });
    return { isValid: false, errors, warnings };
  }

  // Check warnings
  if (warningThresholds) {
    if (
      warningThresholds.min !== undefined &&
      num < warningThresholds.min
    ) {
      warnings.push({
        field: fieldName,
        code: "UNUSUALLY_LOW",
        message:
          warningThresholds.message ??
          `${fieldName} (${num}) is unusually small for typical construction work.`,
      });
    }
    if (
      warningThresholds.max !== undefined &&
      num > warningThresholds.max
    ) {
      warnings.push({
        field: fieldName,
        code: "UNUSUALLY_HIGH",
        message:
          warningThresholds.message ??
          `${fieldName} (${num}) is unusually large. Please verify your measurements.`,
      });
    }
  }

  return { isValid: true, value: num, errors, warnings };
}

/**
 * Validates a non-negative numeric input (>= 0).
 */
export function validateNonNegativeNumber(
  value: unknown,
  options: NumberValidationOptions
): ValidationResult<number> {
  const { fieldName, max, integerOnly } = options;
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (value === null || value === undefined || value === "") {
    errors.push({
      field: fieldName,
      code: "REQUIRED",
      message: `${fieldName} is required`,
    });
    return { isValid: false, errors, warnings };
  }

  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) {
    errors.push({
      field: fieldName,
      code: "INVALID_NUMBER",
      message: `${fieldName} must be a valid number`,
    });
    return { isValid: false, errors, warnings };
  }

  if (num < 0) {
    errors.push({
      field: fieldName,
      code: "NEGATIVE_NUMBER",
      message: `${fieldName} cannot be negative`,
    });
    return { isValid: false, errors, warnings };
  }

  if (integerOnly && !Number.isInteger(num)) {
    errors.push({
      field: fieldName,
      code: "NOT_INTEGER",
      message: `${fieldName} must be a whole number`,
    });
    return { isValid: false, errors, warnings };
  }

  if (max !== undefined && num > max) {
    errors.push({
      field: fieldName,
      code: "EXCEEDS_MAX",
      message: `${fieldName} cannot exceed ${max}`,
    });
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, value: num, errors, warnings };
}

/**
 * Validates waste or tax percentage (0% to 100%).
 */
export function validatePercentage(
  value: unknown,
  fieldName: string = "Waste percentage"
): ValidationResult<number> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (value === null || value === undefined || value === "") {
    return { isValid: true, value: 0, errors, warnings }; // Defaults to 0% if optional
  }

  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) {
    errors.push({
      field: fieldName,
      code: "INVALID_PERCENTAGE",
      message: `${fieldName} must be a valid percentage`,
    });
    return { isValid: false, errors, warnings };
  }

  if (num < 0 || num > 100) {
    errors.push({
      field: fieldName,
      code: "PERCENTAGE_OUT_OF_BOUNDS",
      message: `${fieldName} must be between 0% and 100%`,
    });
    return { isValid: false, errors, warnings };
  }

  if (num > 30) {
    warnings.push({
      field: fieldName,
      code: "HIGH_WASTE_WARNING",
      message: `${fieldName} of ${num}% is unusually high. Standard trade waste is typically 5% to 15%.`,
    });
  }

  return { isValid: true, value: num, errors, warnings };
}

/**
 * Validates a physical dimension with reasonable jobsite limits.
 */
export function validateDimension(
  value: unknown,
  fieldName: string,
  maxLimitFeet: number = 10000
): ValidationResult<number> {
  return validatePositiveNumber(value, {
    fieldName,
    max: maxLimitFeet,
    warningThresholds: {
      min: 0.1, // e.g. under 1.2 inches
      max: 1000,
      message: `${fieldName} seems outside normal residential/commercial project scope.`,
    },
  });
}
