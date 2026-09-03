import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("./out");

const EXPECTED_ROUTES = [
  { path: "/", file: "index.html" },
  { path: "/tools", file: "tools.html" },
  { path: "/about", file: "about.html" },
  { path: "/contact", file: "contact.html" },
  { path: "/privacy", file: "privacy.html" },
  { path: "/terms", file: "terms.html" },
  { path: "/guides/subpanel-feeder-sizing", file: "guides/subpanel-feeder-sizing.html" },
  { path: "/categories/construction", file: "categories/construction.html" },
  { path: "/categories/materials", file: "categories/materials.html" },
  { path: "/categories/electrical", file: "categories/electrical.html" },
  { path: "/categories/hvac", file: "categories/hvac.html" },
  { path: "/categories/plumbing", file: "categories/plumbing.html" },
  { path: "/construction/concrete-calculator", file: "construction/concrete-calculator.html" },
  { path: "/materials/gravel-calculator", file: "materials/gravel-calculator.html" },
  { path: "/construction/framing-calculator", file: "construction/framing-calculator.html" },
  { path: "/materials/drywall-calculator", file: "materials/drywall-calculator.html" },
  { path: "/construction/roof-pitch-calculator", file: "construction/roof-pitch-calculator.html" },
  { path: "/construction/stair-calculator", file: "construction/stair-calculator.html" },
  { path: "/construction/deck-calculator", file: "construction/deck-calculator.html" },
  { path: "/electrical/voltage-drop-calculator", file: "electrical/voltage-drop-calculator.html" },
  { path: "/electrical/conduit-fill-calculator", file: "electrical/conduit-fill-calculator.html" },
  { path: "/electrical/box-fill-calculator", file: "electrical/box-fill-calculator.html" },
  { path: "/hvac/btu-calculator", file: "hvac/btu-calculator.html" },
  { path: "/hvac/duct-sizing-calculator", file: "hvac/duct-sizing-calculator.html" },
  { path: "/electrical/residential-load-calculator", file: "electrical/residential-load-calculator.html" },
  { path: "/plumbing/dfu-calculator", file: "plumbing/dfu-calculator.html" },
  { path: "/plumbing/wsfu-calculator", file: "plumbing/wsfu-calculator.html" }
];

console.log("--- AUDITING STATIC EXPORT IN out/ ---");

let allFilesExist = true;
let canonicalPass = true;
let ogPass = true;
let forbiddenFound = 0;

for (const route of EXPECTED_ROUTES) {
  const filePath = path.join(OUT_DIR, route.file);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING FILE: ${route.file}`);
    allFilesExist = false;
    continue;
  }
  const content = fs.readFileSync(filePath, "utf8");
  
  // Check canonical
  const expectedCanonical = route.path === "/" 
    ? "https://protradecalculators.com" 
    : `https://protradecalculators.com${route.path}`;
  if (!content.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    console.error(`CANONICAL MISMATCH on ${route.path}: expected ${expectedCanonical}`);
    canonicalPass = false;
  }

  // Check og:url
  if (!content.includes(`property="og:url" content="${expectedCanonical}"`)) {
    console.error(`OG:URL MISMATCH on ${route.path}: expected ${expectedCanonical}`);
    ogPass = false;
  }

  // Check forbidden strings
  const forbidden = ["localhost:3000", "adventurous-shannon", "trade-hub", "itradehub", "vercel.app"];
  for (const f of forbidden) {
    if (content.toLowerCase().includes(f.toLowerCase())) {
      console.error(`FORBIDDEN STRING '${f}' found in ${route.file}`);
      forbiddenFound++;
    }
  }
}

// Check sitemap.xml and robots.txt
const sitemapExists = fs.existsSync(path.join(OUT_DIR, "sitemap.xml"));
const robotsExists = fs.existsSync(path.join(OUT_DIR, "robots.txt"));
const headersExists = fs.existsSync(path.join(OUT_DIR, "_headers"));
const error404Exists = fs.existsSync(path.join(OUT_DIR, "404.html"));

console.log(`Routes Checked: ${EXPECTED_ROUTES.length}`);
console.log(`All 27 Route Files Exist on Disk: ${allFilesExist ? "PASS (27/27)" : "FAIL"}`);
console.log(`Canonical Integrity: ${canonicalPass ? "PASS (27/27)" : "FAIL"}`);
console.log(`OpenGraph Integrity: ${ogPass ? "PASS (27/27)" : "FAIL"}`);
console.log(`Forbidden Strings Count: ${forbiddenFound}`);
console.log(`Sitemap.xml Exists: ${sitemapExists ? "PASS" : "FAIL"}`);
console.log(`Robots.txt Exists: ${robotsExists ? "PASS" : "FAIL"}`);
console.log(`_headers Exists: ${headersExists ? "PASS" : "FAIL"}`);
console.log(`404.html Exists: ${error404Exists ? "PASS" : "FAIL"}`);
