/**
 * Standalone CLI runner for Google Search Console Opportunity Analysis
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Usage:
 *   npx tsx scripts/analyze-gsc.ts [--file=path/to/gsc.csv] [--period=7d|28d|90d] [--prev=path/to/prev.csv]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  parseGscCsv,
  parseGscJson,
  analyzeGscData,
  formatGscReportMarkdown,
} from "@/lib/seo/gsc-analyzer";
import type { GscPeriod } from "@/types/gsc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Parse CLI args
const args = process.argv.slice(2);
let filePath = "";
let prevFilePath = "";
let period: GscPeriod = "28d";

for (const arg of args) {
  if (arg.startsWith("--file=")) {
    filePath = arg.split("=")[1];
  } else if (arg.startsWith("--prev=")) {
    prevFilePath = arg.split("=")[1];
  } else if (arg.startsWith("--period=")) {
    const p = arg.split("=")[1] as GscPeriod;
    if (p === "7d" || p === "28d" || p === "90d") {
      period = p;
    }
  }
}

// Check default data location if not specified
if (!filePath) {
  const candidatePath = path.join(projectRoot, "data", "gsc", `gsc-${period}.csv`);
  if (fs.existsSync(candidatePath)) {
    filePath = candidatePath;
  }
}

if (!filePath || !fs.existsSync(filePath)) {
  const report = analyzeGscData({
    period,
    currentRecords: [],
  });
  const reportMarkdown = formatGscReportMarkdown(report);
  console.log(reportMarkdown);

  // Write status artifact to scratch/seo/
  const outDir = path.join(projectRoot, "scratch", "seo");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `gsc-opportunity-report-${period}.md`);
  fs.writeFileSync(outPath, reportMarkdown, "utf8");
  console.log(`\n[Report artifact saved to ${outPath}]`);
  process.exit(0);
}

// Load current data with strict property domain verification
let currentRecords;
try {
  const fileContent = fs.readFileSync(filePath, "utf8");
  currentRecords = filePath.endsWith(".json")
    ? parseGscJson(JSON.parse(fileContent))
    : parseGscCsv(fileContent);
} catch (err: unknown) {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.error("===============================================================================");
  console.error("PROTRADE CALCULATORS — GOOGLE SEARCH CONSOLE PROPERTY VALIDATION FAILURE");
  console.error("===============================================================================\n");
  console.error("STATUS: REJECTED");
  console.error(`ERROR: ${errMsg}\n`);
  console.error("Analysis aborted to prevent cross-property data contamination.");
  console.error("===============================================================================");

  const outDir = path.join(projectRoot, "scratch", "seo");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `gsc-opportunity-report-${period}.md`);
  fs.writeFileSync(
    outPath,
    `# Google Search Console Opportunity Analysis Report\n**Status**: REJECTED — WRONG GSC PROPERTY  \n**Error**: ${errMsg}\n\n> [!CAUTION]\n> Telemetry from another property was rejected. We need a genuine Search Console export for property protradecalculators.com.\n`,
    "utf8"
  );
  console.error(`\n[Rejection record saved to ${outPath}]`);
  process.exit(1);
}

// Load previous data if available
let previousRecords;
if (prevFilePath && fs.existsSync(prevFilePath)) {
  try {
    const prevContent = fs.readFileSync(prevFilePath, "utf8");
    previousRecords = prevFilePath.endsWith(".json")
      ? parseGscJson(JSON.parse(prevContent))
      : parseGscCsv(prevContent);
  } catch (err: unknown) {
    console.warn(`[Warning] Previous period file rejected: ${err instanceof Error ? err.message : String(err)}`);
  }
}

const report = analyzeGscData({
  period,
  currentRecords,
  previousRecords,
});

const reportMarkdown = formatGscReportMarkdown(report);

// Output report
console.log(reportMarkdown);

// Save report artifact to scratch/seo/
const outDir = path.join(projectRoot, "scratch", "seo");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, `gsc-opportunity-report-${period}.md`);
fs.writeFileSync(outPath, reportMarkdown, "utf8");
console.log(`\n[Report successfully saved to ${outPath}]`);
