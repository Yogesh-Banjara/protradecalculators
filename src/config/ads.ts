/**
 * AdSense Layout & Slot Architecture Configuration
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Defines predictable reserved dimensions for future ad placements to guarantee
 * zero Cumulative Layout Shift (CLS) when monetization is activated.
 *
 * Current State: DISABLED (enabled: false). Zero external scripts or ads loaded.
 */

export interface AdSlotDefinition {
  readonly id: string;
  readonly name: string;
  readonly placement: "below_tool" | "in_article" | "footer_top" | "sidebar";
  readonly desktopDimensions: { readonly width: number; readonly height: number };
  readonly mobileDimensions: { readonly width: number; readonly height: number };
  readonly minHeightPx: number;
}

export interface AdsConfig {
  /** Master switch: whether ads are enabled globally (default false) */
  readonly enabled: boolean;
  /** Google AdSense Publisher ID (when enabled in future) */
  readonly publisherId?: string;
  /** Standard reserved ad slots */
  readonly slots: Record<string, AdSlotDefinition>;
}

export const ADS_CONFIG: AdsConfig = {
  enabled: false, // STRICTLY DISABLED FOR INITIAL RELEASE
  publisherId: undefined,
  slots: {
    below_calculator: {
      id: "below_calculator_slot",
      name: "Below Calculator Instrument Banner",
      placement: "below_tool",
      desktopDimensions: { width: 728, height: 90 },
      mobileDimensions: { width: 320, height: 100 },
      minHeightPx: 90,
    },
    in_article_reference: {
      id: "in_article_reference_slot",
      name: "In-Guide Reference Banner",
      placement: "in_article",
      desktopDimensions: { width: 728, height: 90 },
      mobileDimensions: { width: 300, height: 250 },
      minHeightPx: 90,
    },
    sidebar_takeoff: {
      id: "sidebar_takeoff_slot",
      name: "Sidebar Takeoff Rectangle",
      placement: "sidebar",
      desktopDimensions: { width: 300, height: 250 },
      mobileDimensions: { width: 300, height: 250 },
      minHeightPx: 250,
    },
  },
};
