import { describe, it, expect } from "vitest";
import { validateIntentPageDefinition } from "@/lib/intent/validator";
import { getPublishedIntentPages, INTENT_PAGE_REGISTRY } from "@/lib/intent/registry";
import type { IntentPageDefinition } from "@/types/intent";

describe("Search Intent Page Architecture & Quality Gates", () => {
  const validIntentSample: IntentPageDefinition = {
    id: "concrete-24x24-garage-slab",
    path: "/construction/24x24-garage-slab-concrete-calculator",
    categorySlug: "construction",
    baseToolSlug: "concrete-calculator",
    primaryQuery: "24x24 garage slab concrete calculator",
    secondaryQueries: ["how much concrete for 24x24 slab 4 inches thick"],
    title: "24x24 Garage Slab Concrete Calculator - Yards & Bags",
    metaDescription: "Calculate exact cubic yards and 80lb bags for a 24x24 garage slab with 4-inch depth and 10% subgrade waste factor.",
    h1: "24x24 Garage Slab Concrete Calculator",
    scenarioDescription: "Standard residential 2-car detached garage slab with monolithic thickened edge footing specifications.",
    prefilledInputs: {
      length: 24,
      width: 24,
      depth: 4,
      depthUnit: "in",
      wastePercentage: 10,
    },
    staticTakeoffSummary: [
      { label: "Surface Slab Area", value: "576", unit: "sq ft" },
      { label: "Net Concrete Volume", value: "7.11", unit: "cu yd" },
      { label: "Order Volume (+10% Waste)", value: "7.82", unit: "cu yd" },
      { label: "Ready-Mix Delivery Equivalent", value: "1 Truckload", note: "Standard 8-10 yd ready-mix drum" },
    ],
    technicalGuidance: `
      Pouring a 24x24 foot monolithic garage slab requires careful preparation of sub-base compaction, vapor barriers, and perimeter footing depth.
      For standard passenger vehicles, a 4-inch (3,500 to 4,000 PSI) concrete slab reinforced with #4 rebar on 18-inch centers or 6x6 W2.9/W2.9 welded wire mesh provides adequate compressive and tensile load capacity.
      A 24x24 slab contains exactly 576 square feet of surface area. At 4 inches nominal depth (0.333 ft), the net geometric volume is 192 cubic feet or 7.11 cubic yards.
      Accounting for typical 10% subgrade irregularities and screeding loss, the recommended order quantity is 8.0 cubic yards delivered by ready-mix truck.
      Proper site grading must include at least 4 inches of crushed stone or gravel aggregate base compacted in 2-inch lifts to ensure uniform subgrade support.
      A 10-mil or 15-mil polyethylene vapor barrier should be installed directly under the slab to eliminate moisture migration through the concrete floor.
      Ensure control joints are saw-cut to a depth of 1 inch in 12x12 foot quadrants within 12 hours of pouring to prevent uncontrolled shrinkage cracking.
      Allow a minimum 7-day wet cure period before placing light vehicle traffic on the newly finished garage floor surface.
    `,
    codeCitations: [
      {
        codeBody: "IRC",
        section: "Section R506.1",
        summary: "Concrete slab-on-ground floors shall be a minimum 3.5 inches thick with minimum 2,500 PSI compressive strength.",
      },
    ],
    status: "published",
  };

  it("passes validation for complete, high-quality intent definitions", () => {
    const result = validateIntentPageDefinition(validIntentSample);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("rejects thin pages with insufficient technical guidance (<150 words)", () => {
    const thinPage: IntentPageDefinition = {
      ...validIntentSample,
      technicalGuidance: "This page calculates a 24x24 concrete slab. Enter inputs and see results.",
    };

    const result = validateIntentPageDefinition(thinPage);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("Technical guidance is too thin"))).toBe(true);
  });

  it("rejects intent pages missing prefilled inputs", () => {
    const invalidInputsPage: IntentPageDefinition = {
      ...validIntentSample,
      prefilledInputs: {},
    };

    const result = validateIntentPageDefinition(invalidInputsPage);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("at least 2 non-trivial prefilled calculator parameters"))).toBe(true);
  });

  it("rejects intent pages missing SEO title, meta description, or primary query", () => {
    const missingSeoPage: IntentPageDefinition = {
      ...validIntentSample,
      title: "",
      metaDescription: "",
      primaryQuery: "",
    };

    const result = validateIntentPageDefinition(missingSeoPage);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("ensures the current production registry contains zero generated pages", () => {
    expect(INTENT_PAGE_REGISTRY.length).toBe(0);
    expect(getPublishedIntentPages().length).toBe(0);
  });
});
