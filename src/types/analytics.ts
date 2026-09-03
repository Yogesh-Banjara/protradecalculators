/**
 * Typed Analytics Event System
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Privacy-first, zero-cookie, vendor-neutral product measurement foundation.
 */

export type AnalyticsEventType =
  | "calculator_started"
  | "calculator_completed"
  | "result_viewed"
  | "result_generated"
  | "share_link_created"
  | "print_requested"
  | "print_clicked"
  | "copy_result"
  | "reference_asset_viewed"
  | "unit_changed"
  | "preset_selected"
  | "related_tool_clicked"
  | "category_viewed";

export interface BaseEventPayload {
  readonly timestamp: number;
  readonly path: string;
}

export interface CalculatorEventPayload extends BaseEventPayload {
  readonly toolSlug: string;
  readonly category: string;
  readonly calculationDurationMs?: number;
}

export interface ResultGeneratedPayload extends CalculatorEventPayload {
  readonly hasWarnings?: boolean;
  readonly primaryUnit?: string;
}

export interface ShareLinkCreatedPayload extends CalculatorEventPayload {
  readonly shareMethod?: "clipboard" | "native_share";
}

export interface PrintRequestedPayload extends CalculatorEventPayload {
  readonly printSource: "result_panel" | "worksheet" | "reference_sheet";
}

export interface ReferenceAssetViewedPayload extends BaseEventPayload {
  readonly assetId: string;
  readonly assetType: "blueprint" | "cut_list" | "table" | "worksheet";
  readonly tradeCategory: string;
}

export interface UnitChangedPayload extends CalculatorEventPayload {
  readonly fromUnit: string;
  readonly toUnit: string;
}

export interface PresetSelectedPayload extends CalculatorEventPayload {
  readonly presetName: string;
}

export interface CopyResultPayload extends CalculatorEventPayload {
  readonly resultField: string;
}

export interface RelatedToolClickedPayload extends BaseEventPayload {
  readonly currentToolSlug: string;
  readonly targetToolSlug: string;
}

export interface CategoryViewedPayload extends BaseEventPayload {
  readonly categorySlug: string;
}

export type EventPayloadMap = {
  calculator_started: CalculatorEventPayload;
  calculator_completed: CalculatorEventPayload;
  result_viewed: ResultGeneratedPayload;
  result_generated: ResultGeneratedPayload;
  share_link_created: ShareLinkCreatedPayload;
  print_requested: PrintRequestedPayload;
  print_clicked: PrintRequestedPayload;
  copy_result: CopyResultPayload;
  reference_asset_viewed: ReferenceAssetViewedPayload;
  unit_changed: UnitChangedPayload;
  preset_selected: PresetSelectedPayload;
  related_tool_clicked: RelatedToolClickedPayload;
  category_viewed: CategoryViewedPayload;
};

export type AnalyticsHandler = <T extends AnalyticsEventType>(
  event: T,
  payload: EventPayloadMap[T]
) => void;
