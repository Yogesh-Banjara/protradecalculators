import type { AnyUnit, UnitCategory } from "./units";
import type { CalculationStep, CalculationWarning } from "./calculations";
import type { FaqItem, PageSeoProps } from "./seo";

export type ToolCategoryId =
  | "construction"
  | "electrical"
  | "hvac"
  | "plumbing"
  | "landscaping"
  | "pallet-freight"
  | "woodworking"
  | "materials";

export interface ToolCategoryInfo {
  readonly id: ToolCategoryId;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly iconName?: string;
  readonly status: "active" | "planned";
}

export type InputFieldType = "number" | "select" | "text" | "boolean";

export interface ToolInputField {
  readonly id: string;
  readonly label: string;
  readonly type: InputFieldType;
  readonly required?: boolean;
  readonly defaultValue?: number | string | boolean;
  readonly unitCategory?: UnitCategory;
  readonly defaultUnit?: AnyUnit;
  readonly allowedUnits?: readonly AnyUnit[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly helperText?: string;
  readonly placeholder?: string;
  readonly options?: readonly { readonly label: string; readonly value: string }[];
}

export interface ToolOutputField {
  readonly id: string;
  readonly label: string;
  readonly unit?: AnyUnit | string;
  readonly isPrimary?: boolean;
  readonly precision?: number;
  readonly description?: string;
}

export interface ToolDefinition<
  TInput extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly id: string;
  readonly slug: string;
  readonly categoryId: ToolCategoryId;
  readonly path?: string;
  readonly title: string;
  readonly shortTitle?: string;
  readonly description: string;
  readonly searchIntent: string;
  readonly status: "active" | "planned";
  readonly inputs: readonly ToolInputField[];
  readonly outputs: readonly ToolOutputField[];
  readonly calculate: (
    input: TInput
  ) => {
    values: TOutput;
    steps?: readonly CalculationStep[];
    warnings?: readonly CalculationWarning[];
  };
  readonly faqContent?: readonly FaqItem[];
  readonly seo: Omit<PageSeoProps, "path">;
  readonly relatedToolSlugs?: readonly string[];
  readonly lastModified?: string;
}

export interface ToolExecutionResult<
  TOutput extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly isValid: boolean;
  readonly values?: TOutput;
  readonly formattedOutputs?: Record<string, string>;
  readonly steps?: readonly CalculationStep[];
  readonly warnings?: readonly CalculationWarning[];
  readonly errors?: Record<string, string>;
}
