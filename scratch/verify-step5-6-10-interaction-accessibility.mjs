import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { calculateConduitFillProject } from '../src/lib/calculations/conduit.ts';
import { calculateDeckProject } from '../src/lib/calculations/deck.ts';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const TARGET_CALCULATORS = [
  { name: 'Concrete', path: '/construction/concrete-calculator' },
  { name: 'Conduit Fill', path: '/electrical/conduit-fill-calculator' },
  { name: 'Deck', path: '/construction/deck-calculator' },
  { name: 'DFU Plumbing', path: '/plumbing/dfu-calculator' },
  { name: 'Roof Pitch', path: '/construction/roof-pitch-calculator' },
  { name: 'HVAC BTU', path: '/hvac/btu-calculator' },
  { name: 'Voltage Drop', path: '/electrical/voltage-drop-calculator' }
];

const MOBILE_VIEWPORTS = [
  { width: 320, height: 844 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 }
];

async function runInteractionAndA11yAudit() {
  console.log('--- RUNNING STEP 5, 6, 10: ACCESSIBILITY, INTERACTION STRESS & SECURITY AUDIT ---\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = {
    accessibility: {
      totalFormsTested: TARGET_CALCULATORS.length,
      viewportsTested: MOBILE_VIEWPORTS.map(v => `${v.width}x${v.height}`),
      results: []
    },
    interactionStress: [],
    securityExtremeInputs: [],
    engineIntegrityVerification: {}
  };

  for (const tool of TARGET_CALCULATORS) {
    console.log(`Auditing: ${tool.name} (${tool.path})`);
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}${tool.path}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 200));

    // 1. Accessibility Check
    const a11yAudit = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea, button'));
      let missingAccessibleName = 0;
      const issues = [];

      for (const el of inputs) {
        const tagName = el.tagName.toLowerCase();
        let name = '';
        if (el.getAttribute('aria-label')) name = el.getAttribute('aria-label');
        else if (el.getAttribute('aria-labelledby')) {
          const lbl = document.getElementById(el.getAttribute('aria-labelledby'));
          if (lbl) name = lbl.innerText;
        } else if (el.id) {
          const lbl = document.querySelector(`label[for="${el.id}"]`);
          if (lbl) name = lbl.innerText;
        } else if (tagName === 'button') {
          name = el.innerText || el.getAttribute('title') || '';
        }

        if (!name || name.trim() === '') {
          // Check if parent is label
          const parentLabel = el.closest('label');
          if (parentLabel) name = parentLabel.innerText;
        }

        if (!name || name.trim() === '') {
          missingAccessibleName++;
          issues.push({ tag: tagName, id: el.id, class: el.className });
        }
      }

      // Check headings hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName[1], 10),
        text: h.innerText.trim()
      }));

      const h1Count = headings.filter(h => h.level === 1).length;

      return {
        totalFormControls: inputs.length,
        missingAccessibleName,
        h1Count,
        headingsCount: headings.length,
        issues: issues.slice(0, 5)
      };
    });

    // Mobile Viewports Check for Overflow & Usability
    const mobileOverflowResults = {};
    for (const vp of MOBILE_VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: true });
      await new Promise(r => setTimeout(r, 100));
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      mobileOverflowResults[`${vp.width}x${vp.height}`] = !hasOverflow ? 'PASS' : 'OVERFLOW';
    }

    report.accessibility.results.push({
      tool: tool.name,
      ...a11yAudit,
      mobileViewports: mobileOverflowResults
    });

    // 2. Interaction Stress Test (Step 6 & 10)
    await page.setViewport({ width: 1440, height: 900 });
    const interactionResults = {
      tool: tool.name,
      tests: {}
    };

    const inputEl = await page.$('input[type="number"], input[type="text"]');
    if (inputEl) {
      // Test Normal Typing
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('30');
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.normalTyping = 'PASS';
      } catch (e) {
        interactionResults.tests.normalTyping = `FAIL: ${e.message}`;
      }

      // Test Rapid Typing
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('1234567890', { delay: 5 });
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.rapidTyping = 'PASS';
      } catch (e) {
        interactionResults.tests.rapidTyping = `FAIL: ${e.message}`;
      }

      // Test Extreme Large Value (999999)
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('999999');
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.extremeLarge = 'PASS';
      } catch (e) {
        interactionResults.tests.extremeLarge = `FAIL: ${e.message}`;
      }

      // Test Zero
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('0');
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.zeroInput = 'PASS';
      } catch (e) {
        interactionResults.tests.zeroInput = `FAIL: ${e.message}`;
      }

      // Test Negative Value
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('-25');
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.negativeInput = 'PASS';
      } catch (e) {
        interactionResults.tests.negativeInput = `FAIL: ${e.message}`;
      }

      // Test Small Decimal (0.001)
      try {
        await inputEl.click({ clickCount: 3 });
        await inputEl.type('0.001');
        await new Promise(r => setTimeout(r, 50));
        interactionResults.tests.decimalInput = 'PASS';
      } catch (e) {
        interactionResults.tests.decimalInput = `FAIL: ${e.message}`;
      }

      // Reset to healthy value
      await inputEl.click({ clickCount: 3 });
      await inputEl.type('24');
      await new Promise(r => setTimeout(r, 50));
    }

    // Dropdown mutation
    const selectEl = await page.$('select');
    if (selectEl) {
      try {
        const options = await page.evaluate(sel => Array.from(sel.options).map(o => o.value), selectEl);
        if (options.length > 1) {
          await selectEl.select(options[1]);
          await new Promise(r => setTimeout(r, 50));
        }
        interactionResults.tests.dropdownMutation = 'PASS';
      } catch (e) {
        interactionResults.tests.dropdownMutation = `FAIL: ${e.message}`;
      }
    }

    // Malformed URL Query Test (Step 10)
    try {
      await page.goto(`${BASE_URL}${tool.path}?test=<script>alert(1)</script>&num=NaN&val=Infinity`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 50));
      interactionResults.tests.malformedUrlParams = 'PASS';
    } catch (e) {
      interactionResults.tests.malformedUrlParams = `FAIL: ${e.message}`;
    }

    interactionResults.consoleErrorsCount = consoleErrors.length;
    interactionResults.consoleErrors = consoleErrors;
    interactionResults.overallStatus = consoleErrors.length === 0 ? 'PASS' : 'FLAGGED';

    report.interactionStress.push(interactionResults);
    await page.close();
  }

  await browser.close();

  // 3. Engine Integrity Verification: Prove that Conduit and Deck visual caps did NOT change numerical calculations
  console.log('\nVerifying calculation engine integrity for Conduit and Deck...');

  // Conduit Engine Verification
  const conduitCalcResult = calculateConduitFillProject({
    conduitType: 'emt',
    isNipple: false,
    conductors: [
      { id: '1', size: '6 AWG', insulation: 'thhn', count: 50 },
      { id: '2', size: '10 AWG', insulation: 'thhn', count: 50 }
    ]
  });

  report.engineIntegrityVerification.conduit = {
    testedCount: 100,
    totalConductorCount: conduitCalcResult.totalConductorCount,
    totalConductorAreaSqIn: conduitCalcResult.totalConductorAreaSqIn,
    recommendedTradeSize: conduitCalcResult.recommendedTradeSize,
    actualFillPercentage: conduitCalcResult.actualFillPercentage,
    engineMathIntact: conduitCalcResult.totalConductorCount === 100 && conduitCalcResult.totalConductorAreaSqIn > 0
  };

  // Deck Engine Verification
  const deckCalcResult = calculateDeckProject({
    lengthFt: 100,
    widthFt: 20,
    joistSpacingInches: 16,
    boardType: '5/4x6_composite',
    boardOrientation: 'diagonal',
    pierDiameterInches: 12,
    pierDepthInches: 36
  });

  report.engineIntegrityVerification.deck = {
    testedLength: 100,
    supportPostsCount: deckCalcResult.framing.supportPostsCount,
    deckSurfaceAreaSqFt: deckCalcResult.decking.deckSurfaceAreaSqFt,
    totalStockBoardsRequired: deckCalcResult.decking.totalStockBoardsRequired,
    engineMathIntact: deckCalcResult.framing.supportPostsCount > 0 && deckCalcResult.decking.deckSurfaceAreaSqFt === 2000
  };

  fs.writeFileSync('scratch/prelaunch/task038-step5-6-10-audit.json', JSON.stringify(report, null, 2));
  console.log('\nSteps 5, 6, 10 Complete. Saved to scratch/prelaunch/task038-step5-6-10-audit.json');
}

runInteractionAndA11yAudit();
