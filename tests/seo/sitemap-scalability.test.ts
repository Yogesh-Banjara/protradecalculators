import { describe, it, expect } from "vitest";
import {
  getAllCanonicalRoutes,
  getIndexableRouteCount,
  isCanonicalRoute,
  CORE_STATIC_ROUTES,
  getCategoryRoutes,
  getActiveToolRoutes,
} from "@/config/routes";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/config/site";

describe("Sitemap & Canonical Indexation Scalability", () => {
  it("maintains exactly 27 canonical indexable routes in baseline production", () => {
    const allRoutes = getAllCanonicalRoutes();
    expect(allRoutes.length).toBe(27);
    expect(getIndexableRouteCount()).toBe(27);
  });

  it("verifies composition of the 27 production routes", () => {
    const coreCount = CORE_STATIC_ROUTES.length; // 7 (home, tools, about, contact, privacy, terms, guide)
    const catCount = getCategoryRoutes().length; // 5 (construction, materials, electrical, plumbing, hvac)
    const toolCount = getActiveToolRoutes().length; // 15 active calculators

    expect(coreCount).toBe(7);
    expect(catCount).toBe(5);
    expect(toolCount).toBe(15);
    expect(coreCount + catCount + toolCount).toBe(27);
  });

  it("generates sitemap entries in sitemap.xml including solutions", () => {
    const sitemapEntries = sitemap();
    // 27 baseline canonical routes + 1 /solutions hub + 10 programmatic worked solutions
    expect(sitemapEntries.length).toBe(38);

    // Verify all URLs begin with official production domain
    for (const entry of sitemapEntries) {
      expect(entry.url.startsWith("https://protradecalculators.com")).toBe(true);
      expect(entry.url).not.toContain("localhost");
      expect(entry.url).not.toContain("constructionandtradetools.com");
      expect(entry.url).not.toContain("?");
      expect(entry.url).not.toContain("#");
    }
  });

  it("ensures zero duplicate paths in canonical registry", () => {
    const allRoutes = getAllCanonicalRoutes();
    const paths = allRoutes.map((r) => r.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it("validates isCanonicalRoute helper accurately", () => {
    expect(isCanonicalRoute("/construction/concrete-calculator")).toBe(true);
    expect(isCanonicalRoute("/electrical/voltage-drop-calculator")).toBe(true);
    expect(isCanonicalRoute("/categories/hvac")).toBe(true);
    expect(isCanonicalRoute("/")).toBe(true);

    // Query strings and non-existent paths must be identified as non-canonical
    expect(isCanonicalRoute("/construction/concrete-calculator?cfg=123")).toBe(true); // normalizes path
    expect(isCanonicalRoute("/non-existent-tool")).toBe(false);
    expect(isCanonicalRoute("/scratch/test")).toBe(false);
  });
});
