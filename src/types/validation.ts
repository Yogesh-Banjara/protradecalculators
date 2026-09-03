export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

export interface ValidationWarning {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

export interface ValidationResult<T> {
  readonly isValid: boolean;
  readonly value?: T;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
}

export interface NumberValidationOptions {
  readonly fieldName: string;
  readonly min?: number;
  readonly max?: number;
  readonly allowZero?: boolean;
  readonly integerOnly?: boolean;
  readonly warningThresholds?: {
    readonly min?: number;
    readonly max?: number;
    readonly message?: string;
  };
}
