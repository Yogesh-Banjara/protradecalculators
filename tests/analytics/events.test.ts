import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  registerAnalyticsHandler,
  clearAnalyticsHandlers,
  trackCalculatorStarted,
  trackCalculatorCompleted,
  trackResultGenerated,
  trackPrintRequested,
  trackPrintClicked,
  trackCopyResult,
  trackShareLinkClicked,
  trackReferenceAssetViewed,
  trackUnitChanged,
  trackPresetSelected,
  trackRelatedToolClicked,
  trackCategoryViewed,
} from "@/lib/analytics/events";

describe("Analytics Abstraction Layer", () => {
  beforeEach(() => {
    clearAnalyticsHandlers();
  });

  it("dispatches calculator_started event to registered listeners", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackCalculatorStarted("concrete-slab", "construction");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      "calculator_started",
      expect.objectContaining({
        toolSlug: "concrete-slab",
        category: "construction",
      })
    );
  });

  it("dispatches calculator_completed event", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackCalculatorCompleted("roof-pitch", "construction", 120);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      "calculator_completed",
      expect.objectContaining({
        toolSlug: "roof-pitch",
        calculationDurationMs: 120,
      })
    );
  });

  it("dispatches result_generated and result_viewed events with metrics", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackResultGenerated("concrete-slab", "construction", {
      hasWarnings: false,
      primaryUnit: "cu yd",
      durationMs: 45,
    });

    expect(listener).toHaveBeenCalledTimes(2); // result_generated and result_viewed
  });

  it("dispatches share_link_created event", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackShareLinkClicked("voltage-drop", "electrical");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      "share_link_created",
      expect.objectContaining({
        toolSlug: "voltage-drop",
        shareMethod: "clipboard",
      })
    );
  });

  it("dispatches print_requested and copy_result events", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackPrintRequested("concrete-slab", "construction", "worksheet");
    trackCopyResult("concrete-slab", "construction", "totalWithWaste");

    expect(listener).toHaveBeenCalledTimes(3); // print_requested + print_clicked + copy_result
  });

  it("dispatches reference_asset_viewed event", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackReferenceAssetViewed("conduit-fill-cad", "blueprint", "electrical");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      "reference_asset_viewed",
      expect.objectContaining({
        assetId: "conduit-fill-cad",
        assetType: "blueprint",
        tradeCategory: "electrical",
      })
    );
  });

  it("dispatches unit_changed and preset_selected events", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackUnitChanged("deck-calculator", "construction", "imperial", "metric");
    trackPresetSelected("conduit-fill", "electrical", "100A Subpanel Feeder");

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("dispatches related_tool_clicked and category_viewed", () => {
    const listener = vi.fn();
    registerAnalyticsHandler(listener);

    trackRelatedToolClicked("concrete-slab", "rebar-calculator");
    trackCategoryViewed("electrical");

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("allows unregistering listeners", () => {
    const listener = vi.fn();
    const unregister = registerAnalyticsHandler(listener);

    trackCalculatorStarted("concrete-slab", "construction");
    expect(listener).toHaveBeenCalledTimes(1);

    unregister();

    trackCalculatorStarted("concrete-slab", "construction");
    expect(listener).toHaveBeenCalledTimes(1); // Not called again
  });

  it("safely handles failing handler without crashing dispatch loop", () => {
    const faultyListener = vi.fn().mockImplementation(() => {
      throw new Error("Analytics service unavailable");
    });
    const goodListener = vi.fn();

    registerAnalyticsHandler(faultyListener);
    registerAnalyticsHandler(goodListener);

    expect(() => {
      trackCalculatorStarted("concrete-slab", "construction");
    }).not.toThrow();

    expect(faultyListener).toHaveBeenCalledTimes(1);
    expect(goodListener).toHaveBeenCalledTimes(1);
  });
});
