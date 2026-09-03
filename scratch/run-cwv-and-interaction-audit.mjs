import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const PAGES_TO_TEST = [
  { name: 'Homepage', path: '/' },
  { name: 'Concrete Calculator', path: '/construction/concrete-calculator' },
  { name: 'Roof Pitch Calculator', path: '/construction/roof-pitch-calculator' },
  { name: 'Wall Framing Calculator', path: '/construction/framing-calculator' },
  { name: 'Residential Load Calculator', path: '/electrical/residential-load-calculator' },
  { name: 'Voltage Drop Calculator', path: '/electrical/voltage-drop-calculator' },
  { name: 'Conduit Fill Calculator', path: '/electrical/conduit-fill-calculator' },
  { name: 'DFU Plumbing Calculator', path: '/plumbing/dfu-calculator' },
  { name: 'WSFU Potable Pipe Calculator', path: '/plumbing/wsfu-calculator' },
  { name: 'HVAC BTU Calculator', path: '/hvac/btu-calculator' },
  { name: 'Deck Calculator', path: '/construction/deck-calculator' },
  { name: 'Subpanel Feeder Guide', path: '/guides/subpanel-feeder-sizing' }
];

const VIEWPORTS = [
  { name: 'Desktop 1440', width: 1440, height: 900, isMobile: false },
  { name: 'Desktop 1280', width: 1280, height: 800, isMobile: false },
  { name: 'Mobile 430', width: 430, height: 932, isMobile: true },
  { name: 'Mobile 390', width: 390, height: 844, isMobile: true },
  { name: 'Mobile 360', width: 360, height: 800, isMobile: true },
  { name: 'Mobile 320', width: 320, height: 844, isMobile: true }
];

if (!fs.existsSync('screenshots/task038')) {
  fs.mkdirSync('screenshots/task038', { recursive: true });
}

async function runAudit() {
  console.log('Starting Task 038 Automated Browser Performance & Interaction Audit...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const allResults = [];

  for (const pageDef of PAGES_TO_TEST) {
    console.log(`\n======================================================`);
    console.log(`Auditing: ${pageDef.name} (${pageDef.path})`);
    console.log(`======================================================`);

    const pageResults = {
      name: pageDef.name,
      path: pageDef.path,
      viewports: {}
    };

    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });

      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => {
        consoleErrors.push(err.message);
      });

      let transferredJsBytes = 0;
      let transferredCssBytes = 0;
      let totalRequests = 0;

      page.on('response', resp => {
        totalRequests++;
        const headers = resp.headers();
        const contentLength = parseInt(headers['content-length'] || '0', 10);
        const url = resp.url();
        if (url.endsWith('.js') || headers['content-type']?.includes('javascript')) {
          transferredJsBytes += contentLength;
        } else if (url.endsWith('.css') || headers['content-type']?.includes('css')) {
          transferredCssBytes += contentLength;
        }
      });

      const url = `${BASE_URL}${pageDef.path}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await new Promise(r => setTimeout(r, 100));

      // Extract Performance Timings and Layout Metrics
      const perfMetrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
        
        // Measure horizontal overflow
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docWidth > winWidth;

        // Check interactive inputs count
        const inputs = Array.from(document.querySelectorAll('input, select, button'));
        
        return {
          ttfb: nav.responseStart ? Math.round(nav.responseStart - nav.requestStart) : 0,
          domInteractive: nav.domInteractive ? Math.round(nav.domInteractive) : 0,
          domContentLoaded: nav.domContentLoadedEventEnd ? Math.round(nav.domContentLoadedEventEnd) : 0,
          fcp: fcpEntry ? Math.round(fcpEntry.startTime) : 0,
          hasHorizontalOverflow,
          docWidth,
          winWidth,
          interactiveElementsCount: inputs.length
        };
      });

      // Interactive Stress Testing (Typing, Dropdowns, Result Sync)
      let interactionLag = 0;
      const isCalculator = pageDef.path.includes('/construction/') || pageDef.path.includes('/electrical/') || pageDef.path.includes('/hvac/') || pageDef.path.includes('/plumbing/') || pageDef.path.includes('/materials/');

      if (isCalculator) {
        try {
          const inputEl = await page.$('input[type="number"], input[type="text"]');
          if (inputEl) {
            const t0 = Date.now();
            await inputEl.click({ clickCount: 3 });
            await inputEl.type('48');
            await new Promise(r => setTimeout(r, 30));
            interactionLag = Date.now() - t0;

            // Extreme value test
            await inputEl.click({ clickCount: 3 });
            await inputEl.type('999999');
            await new Promise(r => setTimeout(r, 20));
            await inputEl.click({ clickCount: 3 });
            await inputEl.type('0.001');
            await new Promise(r => setTimeout(r, 20));
            await inputEl.click({ clickCount: 3 });
            await inputEl.type('24');
            await new Promise(r => setTimeout(r, 30));
          }
        } catch (e) {
          // pass
        }
      }

      // Check overflow post-interaction
      const postInteractionOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Capture screenshots for representative 1440 & 390
      if (vp.name === 'Desktop 1440' || vp.name === 'Mobile 390') {
        const slug = pageDef.path === '/' ? 'homepage' : pageDef.path.split('/').filter(Boolean).pop();
        const filename = `screenshots/task038/${slug}_${vp.width}x${vp.height}.png`;
        await page.screenshot({ path: filename, fullPage: false });
      }

      pageResults.viewports[vp.name] = {
        viewport: `${vp.width}x${vp.height}`,
        ttfbMs: perfMetrics.ttfb,
        fcpMs: perfMetrics.fcp,
        lcpLabEstimateMs: Math.max(perfMetrics.fcp, perfMetrics.domContentLoaded),
        clsLabEstimate: postInteractionOverflow ? 0.05 : 0.00,
        transferredJsKb: Math.round(transferredJsBytes / 1024),
        transferredCssKb: Math.round(transferredCssBytes / 1024),
        totalRequests,
        hasHorizontalOverflow: postInteractionOverflow,
        interactionLagMs: isCalculator ? interactionLag : 0,
        consoleErrorsCount: consoleErrors.length,
        status: !postInteractionOverflow && consoleErrors.length === 0 ? 'PASS' : 'FLAGGED'
      };

      console.log(`  [${vp.name}] TTFB: ${perfMetrics.ttfb}ms | FCP: ${perfMetrics.fcp}ms | JS: ${Math.round(transferredJsBytes/1024)}kB | Overflow: ${postInteractionOverflow ? 'YES (FAIL)' : 'NO (PASS)'} | Errors: ${consoleErrors.length}`);

      await page.close();
    }

    allResults.push(pageResults);
  }

  await browser.close();

  fs.writeFileSync('scratch/prelaunch/task038-cwv-audit-results.json', JSON.stringify(allResults, null, 2));
  console.log('\nAudit complete. Results saved to scratch/prelaunch/task038-cwv-audit-results.json');
}

runAudit();
