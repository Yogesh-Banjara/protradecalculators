import type {
  AnalyticsEventType,
  AnalyticsHandler,
  EventPayloadMap,
  ReferenceAssetViewedPayload,
} from "@/types/analytics";

const handlers = new Set<AnalyticsHandler>();

/**
 * Registers an analytics subscriber (e.g. Google Tag, Plausible, or custom logger).
 */
export function registerAnalyticsHandler(handler: AnalyticsHandler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

/**
 * Clears all analytics handlers (useful for testing).
 */
export function clearAnalyticsHandlers(): void {
  handlers.clear();
}

/**
 * Dispatches a typed analytics event to all registered handlers safely without crashing.
 */
export function trackEvent<T extends AnalyticsEventType>(
  event: T,
  payload: EventPayloadMap[T]
): void {
  for (const handler of handlers) {
    try {
      handler(event, payload);
    } catch (err) {
      // Prevent analytics listener failures from blocking application flow
      console.error(`[Analytics Error] Failed in handler for event '${event}':`, err);
    }
  }
}

/**
 * Tracks when a user first interacts with a calculator form.
 */
export function trackCalculatorStarted(
  toolSlug: string,
  category: string
): void {
  trackEvent("calculator_started", {
    toolSlug,
    category,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a user completes a calculation flow successfully.
 */
export function trackCalculatorCompleted(
  toolSlug: string,
  category: string,
  durationMs?: number
): void {
  trackEvent("calculator_completed", {
    toolSlug,
    category,
    calculationDurationMs: durationMs,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a calculation produces or views a valid result.
 */
export function trackResultGenerated(
  toolSlug: string,
  category: string,
  options?: { hasWarnings?: boolean; primaryUnit?: string; durationMs?: number }
): void {
  const payload = {
    toolSlug,
    category,
    hasWarnings: options?.hasWarnings,
    primaryUnit: options?.primaryUnit,
    calculationDurationMs: options?.durationMs,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  };
  trackEvent("result_generated", payload);
  trackEvent("result_viewed", payload);
}

/**
 * Tracks when a share configuration link is created or copied.
 */
export function trackShareLinkClicked(
  toolSlug: string,
  category: string,
  shareMethod: "clipboard" | "native_share" = "clipboard"
): void {
  trackEvent("share_link_created", {
    toolSlug,
    category,
    shareMethod,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a user requests a printout or jobsite worksheet.
 */
export function trackPrintRequested(
  toolSlug: string,
  category: string,
  printSource: "result_panel" | "worksheet" | "reference_sheet" = "worksheet"
): void {
  const payload = {
    toolSlug,
    category,
    printSource,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  };
  trackEvent("print_requested", payload);
  trackEvent("print_clicked", payload);
}

// Backward compatibility alias for print
export const trackPrintClicked = trackPrintRequested;

/**
 * Tracks when a user views or downloads a standalone visual reference asset.
 */
export function trackReferenceAssetViewed(
  assetId: string,
  assetType: ReferenceAssetViewedPayload["assetType"],
  tradeCategory: string
): void {
  trackEvent("reference_asset_viewed", {
    assetId,
    assetType,
    tradeCategory,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a user switches units (imperial/metric, AWG/kcmil).
 */
export function trackUnitChanged(
  toolSlug: string,
  category: string,
  fromUnit: string,
  toUnit: string
): void {
  trackEvent("unit_changed", {
    toolSlug,
    category,
    fromUnit,
    toUnit,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a quick circuit or material preset is applied.
 */
export function trackPresetSelected(
  toolSlug: string,
  category: string,
  presetName: string
): void {
  trackEvent("preset_selected", {
    toolSlug,
    category,
    presetName,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks when a user copies a calculation output value to clipboard.
 */
export function trackCopyResult(
  toolSlug: string,
  category: string,
  resultField: string
): void {
  trackEvent("copy_result", {
    toolSlug,
    category,
    resultField,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks navigation to a related tool within the same cluster.
 */
export function trackRelatedToolClicked(
  currentToolSlug: string,
  targetToolSlug: string
): void {
  trackEvent("related_tool_clicked", {
    currentToolSlug,
    targetToolSlug,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}

/**
 * Tracks category hub page views.
 */
export function trackCategoryViewed(categorySlug: string): void {
  trackEvent("category_viewed", {
    categorySlug,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  });
}
