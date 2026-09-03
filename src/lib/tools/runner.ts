import type { ToolDefinition, ToolExecutionResult } from "@/types/tools";
import type { AnyUnit } from "@/types/units";
import { formatUnit } from "../units/formatting";
import { validatePositiveNumber, validateNonNegativeNumber, validateRequired } from "../validation/validators";

/**
 * Validates raw user inputs against a tool's declared schema and executes its calculation function.
 */
export function executeTool<
  TInput extends Record<string, unknown>,
  TOutput extends Record<string, unknown>,
>(
  tool: ToolDefinition<TInput, TOutput>,
  rawInputs: Record<string, unknown>
): ToolExecutionResult<TOutput> {
  const errors: Record<string, string> = {};
  const validatedInput: Record<string, unknown> = {};

  // Validate each declared input field
  for (const field of tool.inputs) {
    const rawVal = rawInputs[field.id] !== undefined ? rawInputs[field.id] : field.defaultValue;

    if (field.required && (rawVal === undefined || rawVal === null || rawVal === "")) {
      const res = validateRequired(rawVal, field.label);
      if (!res.isValid && res.errors.length > 0) {
        errors[field.id] = res.errors[0].message;
        continue;
      }
    }

    if (field.type === "number") {
      if (rawVal === undefined || rawVal === null || rawVal === "") {
        if (field.required) {
          errors[field.id] = `${field.label} is required`;
        }
        continue;
      }

      const numVal = typeof rawVal === "number" ? rawVal : Number(rawVal);
      if (!Number.isFinite(numVal)) {
        errors[field.id] = `${field.label} must be a valid number`;
        continue;
      }

      if (field.min !== undefined && field.min > 0) {
        const res = validatePositiveNumber(numVal, {
          fieldName: field.label,
          max: field.max,
        });
        if (!res.isValid && res.errors.length > 0) {
          errors[field.id] = res.errors[0].message;
          continue;
        }
      } else {
        const res = validateNonNegativeNumber(numVal, {
          fieldName: field.label,
          max: field.max,
        });
        if (!res.isValid && res.errors.length > 0) {
          errors[field.id] = res.errors[0].message;
          continue;
        }
      }

      validatedInput[field.id] = numVal;
    } else if (field.type === "boolean") {
      validatedInput[field.id] = Boolean(rawVal);
    } else {
      // select or text
      validatedInput[field.id] = rawVal !== undefined ? String(rawVal) : "";
    }
  }

  // If there are validation errors, return early
  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  try {
    const result = tool.calculate(validatedInput as TInput);
    const formattedOutputs: Record<string, string> = {};

    // Format outputs according to output field specifications
    for (const outField of tool.outputs) {
      const rawOut = result.values[outField.id];
      if (typeof rawOut === "number") {
        if (outField.unit) {
          formattedOutputs[outField.id] = formatUnit(
            rawOut,
            outField.unit as AnyUnit,
            { precision: outField.precision ?? 2 }
          );
        } else {
          formattedOutputs[outField.id] = rawOut.toLocaleString("en-US", {
            maximumFractionDigits: outField.precision ?? 2,
          });
        }
      } else if (rawOut !== undefined && rawOut !== null) {
        formattedOutputs[outField.id] = String(rawOut);
      }
    }

    return {
      isValid: true,
      values: result.values,
      formattedOutputs,
      steps: result.steps,
      warnings: result.warnings,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Calculation failed";
    return {
      isValid: false,
      errors: { _calculation: errorMessage },
    };
  }
}
