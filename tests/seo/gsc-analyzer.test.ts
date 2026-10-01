import { describe, it, expect } from "vitest";
import {
  parseGscCsv,
  parseGscJson,
  determineSearchIntent,
  classifyRecord,
  analyzeGscData,
  formatGscReportMarkdown,
} from "@/lib/seo/gsc-analyzer";
import type { GscQueryPageRecord } from "@/types/gsc";

describe("GSC Opportunity Analyzer Engine", () => {
  describe("CSV and JSON Ingestion", () => {
    it("parses standard Google Search Console export CSV with quotes and commas", () => {
      const csv = `Top queries,Top pages,Clicks,Impressions,CTR,Position
"conduit fill calculator",https://protradecalculators.com/electrical/conduit-fill-calculator,45,"1,200",3.75%,6.2
"voltage drop formula",https://protradecalculators.com/guides/electricians-guide-to-voltage-drop-calculations,12,800,1.5%,11.4
"how many bags of concrete for 10x10 slab",https://protradecalculators.com/construction/concrete-calculator,85,"2,500",3.4%,4.1`;

      const records = parseGscCsv(csv);
      expect(records).toHaveLength(3);

      expect(records[0]).toEqual({
        query: "conduit fill calculator",
        page: "/electrical/conduit-fill-calculator",
        clicks: 45,
        impressions: 1200,
        ctr: 0.0375,
        position: 6.2,
      });

      expect(records[1].page).toBe("/guides/electricians-guide-to-voltage-drop-calculations");
      expect(records[1].clicks).toBe(12);
      expect(records[1].impressions).toBe(800);
      expect(records[1].ctr).toBe(0.015);
      expect(records[1].position).toBe(11.4);
    });

    it("throws clear error on malformed CSV missing query/page columns", () => {
      const invalidCsv = `ColA,ColB,ColC\n1,2,3`;
      expect(() => parseGscCsv(invalidCsv)).toThrow(/Invalid GSC CSV/);
    });

    it("parses GSC JSON telemetry array", () => {
      const json = [
        {
          query: "subpanel wire size 100 amp 150 ft",
          page: "https://protradecalculators.com/guides/subpanel-feeder-sizing",
          clicks: 30,
          impressions: 450,
          ctr: 0.0667,
          position: 5.8,
        },
      ];

      const records = parseGscJson(json);
      expect(records).toHaveLength(1);
      expect(records[0].query).toBe("subpanel wire size 100 amp 150 ft");
      expect(records[0].page).toBe("/guides/subpanel-feeder-sizing");
      expect(records[0].position).toBe(5.8);
    });
  });

  describe("Search Intent Categorization", () => {
    it("identifies code compliance queries", () => {
      expect(determineSearchIntent("nec 220.55 table demand")).toBe("code_compliance");
      expect(determineSearchIntent("conduit fill nec 40 percent rule")).toBe("code_compliance");
    });

    it("identifies formula derivation queries", () => {
      expect(determineSearchIntent("how to calculate voltage drop single phase")).toBe("formula_derivation");
      expect(determineSearchIntent("voltage drop formula derivation")).toBe("formula_derivation");
    });

    it("identifies dimensional sizing queries", () => {
      expect(determineSearchIntent("wire size for 200 amp service")).toBe("dimensional_sizing");
      expect(determineSearchIntent("conduit size for three 4 awg")).toBe("dimensional_sizing");
    });

    it("identifies commercial calculation queries", () => {
      expect(determineSearchIntent("concrete calculator yardage")).toBe("commercial_calculation");
      expect(determineSearchIntent("how many yards of concrete for slab")).toBe("commercial_calculation");
    });
  });

  describe("Opportunity Classification Rules", () => {
    it("classifies Position 4-15 as STRIKING distance", () => {
      const rec: GscQueryPageRecord = {
        query: "wire fill calculator",
        page: "/electrical/conduit-fill-calculator",
        clicks: 20,
        impressions: 500,
        ctr: 0.04,
        position: 7.5,
      };
      const cats = classifyRecord(rec);
      expect(cats).toContain("POSITION_4_15_STRIKING");
      expect(cats).not.toContain("POSITION_16_30_SECOND_PAGE");
    });

    it("classifies Position 16-30 as SECOND_PAGE", () => {
      const rec: GscQueryPageRecord = {
        query: "3 phase voltage drop formula",
        page: "/electrical/voltage-drop-calculator",
        clicks: 5,
        impressions: 300,
        ctr: 0.016,
        position: 18.2,
      };
      const cats = classifyRecord(rec);
      expect(cats).toContain("POSITION_16_30_SECOND_PAGE");
    });

    it("classifies Position 31-60 as EARLY_DISCOVERY", () => {
      const rec: GscQueryPageRecord = {
        query: "aluminum vs copper feeder sizing",
        page: "/guides/subpanel-feeder-sizing",
        clicks: 2,
        impressions: 150,
        ctr: 0.013,
        position: 34.0,
      };
      const cats = classifyRecord(rec);
      expect(cats).toContain("POSITION_31_60_EARLY_DISCOVERY");
    });

    it("flags High-Impression / Low-CTR title-snippet mismatch", () => {
      // Position 6 with only 0.5% CTR (benchmark is >= 1.8%)
      const rec: GscQueryPageRecord = {
        query: "how many 10 awg in half inch emt",
        page: "/solutions/conduit-fill-six-10awg-thhn-in-half-inch-emt",
        clicks: 5,
        impressions: 1000,
        ctr: 0.005,
        position: 6.1,
      };
      const cats = classifyRecord(rec);
      expect(cats).toContain("HIGH_IMPRESSION_LOW_CTR");
    });

    it("detects rising and declining query momentum against previous period", () => {
      const current: GscQueryPageRecord = {
        query: "solar inverter output wire sizing",
        page: "/solutions/solar-pv-inverter-output-circuit-conductor-sizing",
        clicks: 40,
        impressions: 600,
        ctr: 0.0667,
        position: 4.5,
      };

      const prevRising: GscQueryPageRecord = {
        query: "solar inverter output wire sizing",
        page: "/solutions/solar-pv-inverter-output-circuit-conductor-sizing",
        clicks: 20,
        impressions: 400,
        ctr: 0.05,
        position: 7.2,
      };

      const risingCats = classifyRecord(current, prevRising);
      expect(risingCats).toContain("RISING_QUERY");

      const prevDeclining: GscQueryPageRecord = {
        query: "solar inverter output wire sizing",
        page: "/solutions/solar-pv-inverter-output-circuit-conductor-sizing",
        clicks: 80,
        impressions: 1000,
        ctr: 0.08,
        position: 3.1,
      };

      const decliningCats = classifyRecord(current, prevDeclining);
      expect(decliningCats).toContain("DECLINING_QUERY");
    });
  });

  describe("TOP 20 Mathematical Ranking (Zero Arbitrary Scores)", () => {
    it("sorts strictly by empirical opportunity weight (impressions / position)", () => {
      const records: GscQueryPageRecord[] = [
        {
          query: "low impression top 3",
          page: "/electrical/conduit-fill-calculator",
          clicks: 5,
          impressions: 20,
          ctr: 0.25,
          position: 2.0, // Weight = 20 / 2 = 10
        },
        {
          query: "high impression striking",
          page: "/electrical/voltage-drop-calculator",
          clicks: 30,
          impressions: 900,
          ctr: 0.033,
          position: 5.0, // Weight = 900 / 5 = 180 (Should rank #1)
        },
        {
          query: "deep page 4 query",
          page: "/construction/deck-calculator",
          clicks: 1,
          impressions: 400,
          ctr: 0.0025,
          position: 40.0, // Weight = 400 / 40 = 10
        },
        {
          query: "moderate striking",
          page: "/construction/concrete-calculator",
          clicks: 15,
          impressions: 500,
          ctr: 0.03,
          position: 8.0, // Weight = 500 / 8 = 62.5 (Should rank #2)
        },
      ];

      const report = analyzeGscData({
        period: "28d",
        currentRecords: records,
      });

      expect(report.top20Opportunities[0].query).toBe("high impression striking");
      expect(report.top20Opportunities[1].query).toBe("moderate striking");
      expect(report.top20Opportunities[0].opportunityWeight).toBe(180);
      expect(report.top20Opportunities[1].opportunityWeight).toBe(62.5);
    });
  });

  describe("Telemetry Integrity & Missing Data Reporting", () => {
    it("reports DATA UNAVAILABLE and 0 fabricated metrics when dataset is empty", () => {
      const report = analyzeGscData({
        period: "28d",
        currentRecords: [],
      });

      expect(report.dataAvailable).toBe(false);
      expect(report.totalImpressions).toBe(0);
      expect(report.totalClicks).toBe(0);
      expect(report.top20Opportunities).toHaveLength(0);
      // Confirms all site catalog pages are reported as zero impressions awaiting real GSC telemetry
      expect(report.zeroImpressionPages.length).toBeGreaterThan(30);

      const md = formatGscReportMarkdown(report);
      expect(md).toContain("DATA UNAVAILABLE");
      expect(md).toContain("No live Google Search Console export data is currently present");
    });

    it("identifies unindexed/zero-impression pages by diffing active URLs against site catalog", () => {
      const singlePageRecord: GscQueryPageRecord[] = [
        {
          query: "concrete calculator",
          page: "/construction/concrete-calculator",
          clicks: 100,
          impressions: 3000,
          ctr: 0.033,
          position: 4.2,
        },
      ];

      const report = analyzeGscData({
        period: "7d",
        currentRecords: singlePageRecord,
      });

      expect(report.dataAvailable).toBe(true);
      expect(report.totalImpressions).toBe(3000);
      // All other pages in the catalog must be in zeroImpressionPages
      expect(report.zeroImpressionPages.some((p) => p.url === "/construction/concrete-calculator")).toBe(false);
      expect(report.zeroImpressionPages.some((p) => p.url === "/electrical/conduit-fill-calculator")).toBe(true);
    });

    it("identifies internal link strengthening candidates without diluting crawl budget", () => {
      const records: GscQueryPageRecord[] = [
        {
          query: "100 amp subpanel wire size",
          page: "/guides/subpanel-feeder-sizing",
          clicks: 25,
          impressions: 800,
          ctr: 0.031,
          position: 6.4,
        },
        {
          query: "subpanel voltage drop 150 feet",
          page: "/guides/subpanel-feeder-sizing",
          clicks: 10,
          impressions: 350,
          ctr: 0.028,
          position: 8.1,
        },
      ];

      const report = analyzeGscData({
        period: "28d",
        currentRecords: records,
      });

      expect(report.internalLinkCandidates).toHaveLength(1);
      expect(report.internalLinkCandidates[0].url).toBe("/guides/subpanel-feeder-sizing");
      expect(report.internalLinkCandidates[0].impressions).toBe(1150);
      expect(report.internalLinkCandidates[0].position).toBe(6.4);
    });
  });

  describe("Mandatory Property & Domain Verification (Rejection of Cross-Domain Telemetry)", () => {
    it("rejects CSV data belonging to alien domains like bijliwise.in with explicit error", () => {
      const alienCsv = `Top pages,Clicks,Impressions,CTR,Position
https://www.bijliwise.in/tariffs/tripura/tsecl,1,507,0.2%,8.08
https://www.bijliwise.in/tools/meter-reading-calculator,1,39,2.56%,7`;

      expect(() => parseGscCsv(alienCsv)).toThrow(
        /WRONG GSC PROPERTY — EXPECTED protradecalculators\.com/
      );
    });

    it("rejects JSON data belonging to an unapproved property", () => {
      const alienJson = [
        {
          query: "random query",
          page: "https://unknown-domain.org/calculator",
          clicks: 10,
          impressions: 100,
          ctr: 0.1,
          position: 5,
        },
      ];

      expect(() => parseGscJson(alienJson)).toThrow(
        /WRONG GSC PROPERTY — EXPECTED protradecalculators\.com/
      );
    });

    it("accepts genuine protradecalculators.com telemetry", () => {
      const validCsv = `Top pages,Clicks,Impressions,CTR,Position
https://protradecalculators.com/electrical/residential-load-calculator,1,228,0.44%,38.39
https://protradecalculators.com/electrical/voltage-drop-calculator,1,227,0.44%,37.56`;

      const records = parseGscCsv(validCsv);
      expect(records).toHaveLength(2);
      expect(records[0].page).toBe("/electrical/residential-load-calculator");
      expect(records[0].impressions).toBe(228);
      expect(records[1].page).toBe("/electrical/voltage-drop-calculator");
      expect(records[1].impressions).toBe(227);
    });
  });
});
