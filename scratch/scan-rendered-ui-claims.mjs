import puppeteer from "puppeteer-core";
import fs from "fs";

const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const routes = [
  "/",
  "/tools",
  "/categories/construction",
  "/categories/materials",
  "/categories/electrical",
  "/categories/hvac",
  "/categories/plumbing",
  "/construction/concrete-calculator",
  "/construction/deck-calculator",
  "/construction/framing-calculator",
  "/construction/roof-pitch-calculator",
  "/construction/stair-calculator",
  "/electrical/box-fill-calculator",
  "/electrical/conduit-fill-calculator",
  "/electrical/residential-load-calculator",
  "/electrical/voltage-drop-calculator",
  "/hvac/btu-calculator",
  "/hvac/duct-sizing-calculator",
  "/materials/drywall-calculator",
  "/materials/gravel-calculator",
  "/plumbing/dfu-calculator",
  "/plumbing/wsfu-calculator",
  "/about",
  "/privacy",
  "/terms",
  "/contact"
];

const targetKeywords = [
  "code compliant",
  "compliance",
  "compliant",
  "permit-ready",
  "professional-grade",
  "certified",
  "legally safeguarded"
];

async function scan() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const findings = [];

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    await page.goto(url, { waitUntil: "networkidle0" });

    const bodyText = await page.evaluate(() => document.body.innerText);

    for (const kw of targetKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      const matches = bodyText.match(regex);
      if (matches && matches.length > 0) {
        // Extract surrounding sentences
        const lines = bodyText.split("\n").filter(line => regex.test(line));
        findings.push({
          route,
          keyword: kw,
          count: matches.length,
          contexts: lines.slice(0, 3)
        });
      }
    }
  }

  await browser.close();

  console.log("=== RENDERED UI CLAIMS AUDIT FINDINGS ===");
  if (findings.length === 0) {
    console.log("No risky terms found in rendered body text across all 26 routes!");
  } else {
    console.log(`Found ${findings.length} keyword occurrences across pages:`);
    for (const f of findings) {
      console.log(`\nRoute: ${f.route} | Keyword: "${f.keyword}" (${f.count}x)`);
      for (const c of f.contexts) {
        console.log(`  > "${c.trim()}"`);
      }
    }
  }
}

scan().catch(console.error);
