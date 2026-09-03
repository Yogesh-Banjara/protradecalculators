/**
 * Shareable Calculator State Type Definitions
 * ProTrade Calculators (https://protradecalculators.com)
 */

export interface ShareStatePayload {
  readonly version: number;
  readonly toolSlug: string;
  readonly values: Record<string, string | number | boolean>;
  readonly timestamp?: number;
}

export interface ShareStateResult<T = Record<string, unknown>> {
  readonly isValid: boolean;
  readonly version: number;
  readonly toolSlug: string;
  readonly data: Partial<T>;
  readonly warnings: string[];
}

export interface ShareConfigButtonProps {
  readonly toolSlug: string;
  readonly state: Record<string, string | number | boolean>;
  readonly className?: string;
  readonly label?: string;
}
