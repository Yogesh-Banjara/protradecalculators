/**
 * Base error class for all domain errors.
 */
export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an input fails validation in calculation pipelines.
 */
export class InvalidInputError extends DomainError {
  constructor(
    message: string,
    public readonly field: string,
    code: string = "INVALID_INPUT"
  ) {
    super(message, code);
    this.name = "InvalidInputError";
  }
}

/**
 * Thrown when arithmetic or physical calculation cannot be computed (e.g., division by zero).
 */
export class DomainCalculationError extends DomainError {
  constructor(message: string, code: string = "CALCULATION_ERROR") {
    super(message, code);
    this.name = "DomainCalculationError";
  }
}

/**
 * Thrown when units are incompatible or unsupported.
 */
export class UnitMismatchError extends DomainError {
  constructor(fromUnit: string, toUnit: string) {
    super(
      `Cannot convert incompatible units: '${fromUnit}' to '${toUnit}'`,
      "UNIT_MISMATCH"
    );
    this.name = "UnitMismatchError";
  }
}
