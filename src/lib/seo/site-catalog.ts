/**
 * Site Catalog Ground Truth for SEO & GSC Opportunity Analysis
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Provides verified metadata (URL, Title, H1, Cluster, Type, Keywords)
 * for all canonical indexable pages to detect zero-impression pages,
 * title/snippet mismatches, and content gaps against actual site architecture.
 */

import necProblems from "@/data/nec-problems.json";

export interface CatalogPage {
  readonly url: string;
  readonly title: string;
  readonly h1: string;
  readonly cluster: "electrical" | "construction" | "hvac" | "materials" | "plumbing" | "general" | "trust";
  readonly type: "calculator" | "guide" | "solution" | "hub" | "legal" | "directory";
  readonly primaryKeywords: readonly string[];
}

export const SITE_CATALOG: readonly CatalogPage[] = [
  // Core & Hubs
  {
    url: "/",
    title: "Free Construction & Trade Calculators | ProTrade Calculators",
    h1: "Professional Construction & Trade Calculators",
    cluster: "general",
    type: "hub",
    primaryKeywords: ["construction calculators", "trade calculators", "contractor calculations"],
  },
  {
    url: "/tools",
    title: "All Construction & Trade Tools | ProTrade Calculators",
    h1: "Construction & Trade Calculators Directory",
    cluster: "general",
    type: "directory",
    primaryKeywords: ["trade calculator directory", "all trade tools"],
  },
  {
    url: "/categories/construction",
    title: "Construction & Framing Calculators | ProTrade Calculators",
    h1: "Construction & Framing Calculators",
    cluster: "construction",
    type: "hub",
    primaryKeywords: ["construction framing calculators", "lumber calculators"],
  },
  {
    url: "/categories/electrical",
    title: "Electrical & Conduit Calculators | ProTrade Calculators",
    h1: "Electrical & Conduit Sizing Calculators",
    cluster: "electrical",
    type: "hub",
    primaryKeywords: ["electrical calculators", "conduit sizing tools"],
  },
  {
    url: "/categories/hvac",
    title: "HVAC & Airflow Calculators | ProTrade Calculators",
    h1: "HVAC & Airflow Calculators",
    cluster: "hvac",
    type: "hub",
    primaryKeywords: ["hvac calculators", "duct sizing tools", "btu calculators"],
  },
  {
    url: "/categories/materials",
    title: "Materials & Takeoff Calculators | ProTrade Calculators",
    h1: "Materials & Takeoff Calculators",
    cluster: "materials",
    type: "hub",
    primaryKeywords: ["materials calculators", "aggregate takeoff tools"],
  },
  {
    url: "/categories/plumbing",
    title: "Plumbing & Drainage Calculators | ProTrade Calculators",
    h1: "Plumbing & Drainage Calculators",
    cluster: "plumbing",
    type: "hub",
    primaryKeywords: ["plumbing calculators", "pipe sizing tools", "dfu wsfu"],
  },
  {
    url: "/guides",
    title: "Electrical & Trade Technical Master Guides | ProTrade Calculators",
    h1: "Electrical & Trade Technical Master Guides",
    cluster: "electrical",
    type: "hub",
    primaryKeywords: ["electrical guides", "nec technical guides"],
  },
  {
    url: "/solutions",
    title: "NEC Worked Solutions & Step-by-Step Code Calculations | ProTrade Calculators",
    h1: "National Electrical Code (NEC) Worked Solutions",
    cluster: "electrical",
    type: "hub",
    primaryKeywords: ["nec worked solutions", "electrical code calculations"],
  },

  // Primary Calculators
  {
    url: "/construction/concrete-calculator",
    title: "Concrete Calculator - Slab, Footing & Bag Estimator | ProTrade Calculators",
    h1: "Concrete Slab & Footing Volume Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["concrete calculator", "concrete slab yardage", "how many bags of concrete"],
  },
  {
    url: "/construction/deck-calculator",
    title: "Deck Calculator - Material, Board Count & Framing Takeoff | ProTrade Calculators",
    h1: "Deck Material & Framing Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["deck calculator", "deck joist spacing", "deck board estimator", "deck framing calculator"],
  },
  {
    url: "/construction/framing-calculator",
    title: "Wall Framing & Stud Calculator | ProTrade Calculators",
    h1: "Wall Framing & Stud Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["framing calculator", "wall stud calculator", "lumber takeoff"],
  },
  {
    url: "/construction/roof-pitch-calculator",
    title: "Roof Pitch & Rafter Calculator | ProTrade Calculators",
    h1: "Roof Pitch & Rafter Length Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["roof pitch calculator", "rafter length calculator", "roof angle"],
  },
  {
    url: "/construction/rafter-calculator",
    title: "Roof Rafter Calculator - Length & Cut Schedule | ProTrade Calculators",
    h1: "Roof Rafter Length & Cut Schedule Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["rafter calculator", "roof rafter length calculator", "birdsmouth cut calculator", "common rafter calculator"],
  },
  {
    url: "/construction/stair-calculator",
    title: "Stair Stringer & Riser Calculator | ProTrade Calculators",
    h1: "Stair Stringer & Riser Calculator",
    cluster: "construction",
    type: "calculator",
    primaryKeywords: ["stair calculator", "stair stringer layout", "stair riser height"],
  },
  {
    url: "/electrical/conduit-fill-calculator",
    title: "Conduit Fill Calculator - NEC Chapter 9 Wire Capacity | ProTrade Calculators",
    h1: "Electrical Conduit Fill & Wire Sizing Calculator",
    cluster: "electrical",
    type: "calculator",
    primaryKeywords: ["conduit fill calculator", "emt conduit fill", "nec chapter 9 table 4"],
  },
  {
    url: "/electrical/voltage-drop-calculator",
    title: "Voltage Drop & Wire Size Calculator - NEC 3% Sizing | ProTrade Calculators",
    h1: "Electrical Voltage Drop & Wire Sizing Calculator",
    cluster: "electrical",
    type: "calculator",
    primaryKeywords: ["voltage drop calculator", "wire size calculator", "subpanel wire size"],
  },
  {
    url: "/electrical/residential-load-calculator",
    title: "Residential Electrical Load Calculator - NEC 220 Sizing | ProTrade Calculators",
    h1: "Residential Electrical Service Load Calculator",
    cluster: "electrical",
    type: "calculator",
    primaryKeywords: ["residential load calculator", "service load calculator", "nec 220.82"],
  },
  {
    url: "/electrical/box-fill-calculator",
    title: "Electrical Box Fill Calculator - NEC 314.16 Volume Sizing | ProTrade Calculators",
    h1: "Electrical Box Fill Calculator (NEC 314.16)",
    cluster: "electrical",
    type: "calculator",
    primaryKeywords: ["box fill calculator", "nec 314.16", "junction box cubic inches"],
  },
  {
    url: "/hvac/btu-calculator",
    title: "Heating & Cooling BTU Calculator - AC Tonnage | ProTrade Calculators",
    h1: "Heating & Cooling BTU Calculator",
    cluster: "hvac",
    type: "calculator",
    primaryKeywords: ["btu calculator", "ac tonnage calculator", "heating load"],
  },
  {
    url: "/hvac/duct-sizing-calculator",
    title: "HVAC Duct Sizing Calculator - CFM & Friction Rate | ProTrade Calculators",
    h1: "HVAC Duct Sizing Calculator",
    cluster: "hvac",
    type: "calculator",
    primaryKeywords: ["duct sizing calculator", "cfm duct sizing", "friction rate"],
  },
  {
    url: "/materials/drywall-calculator",
    title: "Drywall Sheet & Mud Calculator | ProTrade Calculators",
    h1: "Drywall Sheet & Joint Compound Estimator",
    cluster: "materials",
    type: "calculator",
    primaryKeywords: ["drywall calculator", "sheetrock estimator", "drywall mud"],
  },
  {
    url: "/materials/gravel-calculator",
    title: "Gravel & Crushed Stone Calculator - Tonnage & Yards | ProTrade Calculators",
    h1: "Gravel & Crushed Stone Tonnage Calculator",
    cluster: "materials",
    type: "calculator",
    primaryKeywords: ["gravel calculator", "crushed stone tonnage", "gravel tons"],
  },
  {
    url: "/plumbing/dfu-calculator",
    title: "Plumbing DFU Calculator - Drainage Fixture Units | ProTrade Calculators",
    h1: "Plumbing Drainage Fixture Unit (DFU) Calculator",
    cluster: "plumbing",
    type: "calculator",
    primaryKeywords: ["dfu calculator", "drainage fixture units", "drain pipe sizing"],
  },
  {
    url: "/plumbing/wsfu-calculator",
    title: "Plumbing WSFU Calculator - Water Supply Fixture Units | ProTrade Calculators",
    h1: "Plumbing Water Supply Fixture Unit (WSFU) Calculator",
    cluster: "plumbing",
    type: "calculator",
    primaryKeywords: ["wsfu calculator", "water supply fixture units", "water pipe sizing"],
  },

  // Technical Master Guides
  {
    url: "/guides/nec-conduit-fill-rules-and-tables",
    title: "NEC Conduit Fill Rules, Chapter 9 Tables & Sizing | ProTrade Calculators",
    h1: "The Complete NEC Conduit Fill Guide: Chapter 9 Tables, Jam Ratios & Conductor Sizing",
    cluster: "electrical",
    type: "guide",
    primaryKeywords: ["nec conduit fill rules", "chapter 9 table 4", "conduit jam ratio"],
  },
  {
    url: "/guides/electricians-guide-to-voltage-drop-calculations",
    title: "Electrician's Guide to Voltage Drop Formulas & Code Limits | ProTrade Calculators",
    h1: "The Electrician's Guide to Voltage Drop: Formulas, Code Limits & Conductor Sizing",
    cluster: "electrical",
    type: "guide",
    primaryKeywords: ["voltage drop formula", "nec 210.19 voltage drop", "single phase voltage drop"],
  },
  {
    url: "/guides/subpanel-feeder-sizing",
    title: "Subpanel Feeder Conductor Sizing by Distance | ProTrade Calculators",
    h1: "Subpanel Feeder Conductor Sizing by Distance",
    cluster: "electrical",
    type: "guide",
    primaryKeywords: ["subpanel wire size by distance", "100a subpanel feeder", "feeder voltage drop"],
  },

  // Legal & Trust
  {
    url: "/about",
    title: "About ProTradeCalculators & Engineering Standards | ProTrade Calculators",
    h1: "About ProTradeCalculators",
    cluster: "trust",
    type: "legal",
    primaryKeywords: ["about protradecalculators", "engineering standards"],
  },
  {
    url: "/contact",
    title: "Contact & Technical Corrections | ProTrade Calculators",
    h1: "Contact Engineering & Auditing Team",
    cluster: "trust",
    type: "legal",
    primaryKeywords: ["contact protradecalculators", "technical corrections"],
  },
  {
    url: "/privacy-policy",
    title: "Privacy Policy & AdSense Disclosures | ProTrade Calculators",
    h1: "Privacy Policy & Data Disclosures",
    cluster: "trust",
    type: "legal",
    primaryKeywords: ["privacy policy", "adsense disclosure"],
  },
  {
    url: "/terms",
    title: "Terms of Service | ProTrade Calculators",
    h1: "Terms of Service",
    cluster: "trust",
    type: "legal",
    primaryKeywords: ["terms of service", "trade liability"],
  },
  {
    url: "/methodology",
    title: "Calculation Methodology & Verification | ProTrade Calculators",
    h1: "Calculation Methodology & Verification Standards",
    cluster: "trust",
    type: "legal",
    primaryKeywords: ["calculation methodology", "verification standards"],
  },

  // 20 NEC Worked Solutions (dynamically derived from nec-problems.json ground truth)
  ...necProblems.map((prob) => ({
    url: `/solutions/${prob.slug}`,
    title: `${prob.seoTitle || prob.title} | ProTrade Calculators`,
    h1: prob.title,
    cluster: "electrical" as const,
    type: "solution" as const,
    primaryKeywords: [
      prob.title.toLowerCase(),
      prob.necReference.toLowerCase(),
      prob.calculatorType,
    ],
  })),
];

/**
 * Normalizes an arbitrary URL path or full URL into a canonical relative pathname.
 * e.g. "https://protradecalculators.com/electrical/conduit-fill-calculator/" -> "/electrical/conduit-fill-calculator"
 */
export function normalizeCatalogPath(url: string): string {
  let clean = url.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\/[^/]+/i, "");
  clean = clean.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  return clean || "/";
}

/**
 * Finds a page entry in the site catalog by pathname.
 */
export function findCatalogPage(url: string): CatalogPage | undefined {
  const norm = normalizeCatalogPath(url);
  return SITE_CATALOG.find((p) => p.url === norm);
}

/**
 * Identifies whether an incoming query is strongly associated with an existing tool/guide
 * or represents an unserved content gap.
 */
export function matchQueryToCluster(query: string): {
  readonly cluster: "electrical" | "construction" | "hvac" | "materials" | "plumbing" | "unmatched";
  readonly matchedPage?: CatalogPage;
  readonly confidence: number;
} {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);

  let bestMatch: CatalogPage | undefined;
  let maxScore = 0;

  for (const page of SITE_CATALOG) {
    let score = 0;
    for (const kw of page.primaryKeywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    for (const token of tokens) {
      if (page.url.includes(token)) score += 1;
      if (page.h1.toLowerCase().includes(token)) score += 1;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = page;
    }
  }

  if (bestMatch && maxScore >= 2) {
    const cl = bestMatch.cluster === "trust" || bestMatch.cluster === "general" ? "unmatched" : bestMatch.cluster;
    return {
      cluster: cl,
      matchedPage: bestMatch,
      confidence: Math.min(1.0, maxScore / 5),
    };
  }

  // Fallback cluster matching by keyword tokens
  if (/conduit|wire|amp|volt|feeder|breaker|panel|nec|thhn|kcmil|grounding|box fill|motor/i.test(q)) {
    return { cluster: "electrical", confidence: 0.4 };
  }
  if (/concrete|slab|footing|deck|stud|framing|rafter|roof pitch|stair|riser/i.test(q)) {
    return { cluster: "construction", confidence: 0.4 };
  }
  if (/btu|cfm|duct|tonnage|airflow|cooling|heat pump/i.test(q)) {
    return { cluster: "hvac", confidence: 0.4 };
  }
  if (/gravel|drywall|sheetrock|crushed stone|aggregate|topsoil/i.test(q)) {
    return { cluster: "materials", confidence: 0.4 };
  }
  if (/dfu|wsfu|drainage|fixture unit|pipe sizing|sanitary drain/i.test(q)) {
    return { cluster: "plumbing", confidence: 0.4 };
  }

  return { cluster: "unmatched", confidence: 0 };
}
