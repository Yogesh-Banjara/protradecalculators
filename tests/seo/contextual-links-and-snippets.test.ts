import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SITE_CATALOG, findCatalogPage } from "@/lib/seo/site-catalog";
import { REGISTERED_TOOLS, getToolBySlug } from "@/lib/tools/registry";

describe("GSC Grounded SEO & Contextual Linking Verification", () => {
  describe("Site Catalog and Registry Snippet Synchronization", () => {
    it("synchronizes Deck Calculator title and description with high-intent search terms", () => {
      const catalogEntry = findCatalogPage("/construction/deck-calculator");
      expect(catalogEntry).toBeDefined();
      expect(catalogEntry?.title).toBe(
        "Deck Calculator - Material, Board Count & Framing Takeoff | ProTrade Calculators"
      );

      const registryEntry = getToolBySlug("deck-calculator");
      expect(registryEntry).toBeDefined();
      expect(registryEntry?.seo?.title).toBe(
        "Deck Calculator - Material, Board Count & Framing Takeoff"
      );
      expect(registryEntry?.seo?.description).toContain("Estimate deck boards");
      expect(registryEntry?.seo?.description).toContain("12\" and 16\" OC joists");
    });

    it("synchronizes Conduit Fill Calculator title with NEC Chapter 9 intent", () => {
      const catalogEntry = findCatalogPage("/electrical/conduit-fill-calculator");
      expect(catalogEntry).toBeDefined();
      expect(catalogEntry?.title).toBe(
        "Conduit Fill Calculator - NEC Chapter 9 Wire Capacity | ProTrade Calculators"
      );

      const registryEntry = getToolBySlug("conduit-fill-calculator");
      expect(registryEntry).toBeDefined();
      expect(registryEntry?.seo?.title).toBe(
        "Conduit Fill Calculator - NEC Chapter 9 Wire Capacity"
      );
    });

    it("synchronizes Voltage Drop Calculator title with NEC 3% sizing intent", () => {
      const catalogEntry = findCatalogPage("/electrical/voltage-drop-calculator");
      expect(catalogEntry).toBeDefined();
      expect(catalogEntry?.title).toBe(
        "Voltage Drop & Wire Size Calculator - NEC 3% Sizing | ProTrade Calculators"
      );

      const registryEntry = getToolBySlug("voltage-drop-calculator");
      expect(registryEntry).toBeDefined();
      expect(registryEntry?.seo?.title).toBe(
        "Voltage Drop & Wire Size Calculator - NEC 3% Sizing"
      );
    });

    it("synchronizes Residential Load Calculator title with NEC 220 sizing intent", () => {
      const catalogEntry = findCatalogPage("/electrical/residential-load-calculator");
      expect(catalogEntry).toBeDefined();
      expect(catalogEntry?.title).toBe(
        "Residential Electrical Load Calculator - NEC 220 Sizing | ProTrade Calculators"
      );

      const registryEntry = getToolBySlug("residential-load-calculator");
      expect(registryEntry).toBeDefined();
      expect(registryEntry?.seo?.title).toBe(
        "Residential Electrical Load Calculator - NEC 220 Sizing"
      );
    });

    it("synchronizes Box Fill Calculator title with NEC 314.16 volume sizing intent", () => {
      const catalogEntry = findCatalogPage("/electrical/box-fill-calculator");
      expect(catalogEntry).toBeDefined();
      expect(catalogEntry?.title).toBe(
        "Electrical Box Fill Calculator - NEC 314.16 Volume Sizing | ProTrade Calculators"
      );

      const registryEntry = getToolBySlug("box-fill-calculator");
      expect(registryEntry).toBeDefined();
      expect(registryEntry?.seo?.title).toBe(
        "Electrical Box Fill Calculator - NEC 314.16 Volume Sizing"
      );
    });
  });

  describe("Contextual Internal Link Integrity", () => {
    it("verifies Plumbing Hub includes contextual link pointing to /plumbing/dfu-calculator", () => {
      const categoryPagePath = path.resolve(process.cwd(), "src/app/categories/[category]/page.tsx");
      const content = fs.readFileSync(categoryPagePath, "utf-8");

      expect(content).toContain('category.slug === "plumbing"');
      expect(content).toContain('href="/plumbing/dfu-calculator"');
      expect(content).toContain("Calculate Drainage Fixture Units (DFU) &amp; Drain Pipe Sizes");
    });

    it("verifies Construction Hub includes contextual link pointing to /construction/stair-calculator", () => {
      const categoryPagePath = path.resolve(process.cwd(), "src/app/categories/[category]/page.tsx");
      const content = fs.readFileSync(categoryPagePath, "utf-8");

      expect(content).toContain('category.slug === "construction"');
      expect(content).toContain('href="/construction/stair-calculator"');
      expect(content).toContain("Calculate Stair Stringer Layout &amp; Riser Heights");
    });

    it("verifies WSFU Calculator page links contextually to /plumbing/dfu-calculator", () => {
      const wsfuPagePath = path.resolve(process.cwd(), "src/app/plumbing/wsfu-calculator/page.tsx");
      const content = fs.readFileSync(wsfuPagePath, "utf-8");

      expect(content).toContain('href="/plumbing/dfu-calculator"');
      expect(content).toContain("Plumbing Drainage Fixture Unit (DFU) &amp; Pipe Sizing Calculator");
    });

    it("verifies Deck Calculator page links contextually to /construction/stair-calculator", () => {
      const deckPagePath = path.resolve(process.cwd(), "src/app/construction/deck-calculator/page.tsx");
      const content = fs.readFileSync(deckPagePath, "utf-8");

      expect(content).toContain('href="/construction/stair-calculator"');
      expect(content).toContain("Stair Stringer &amp; Riser Calculator");
    });
  });
});
