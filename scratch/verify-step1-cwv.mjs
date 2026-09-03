import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Concrete Calculator', path: '/construction/concrete-calculator' },
  { name: 'Roof Pitch Calculator', path: '/construction/roof-pitch-calculator' },
  { name: 'Wall Framing Calculator', path: '/construction/framing-calculator' },
  { name: 'Deck Calculator', path: '/construction/deck-calculator' },
  { name: 'Voltage Drop Calculator', path: '/electrical/voltage-drop-calculator' },
  { name: 'Conduit Fill Calculator', path: '/electrical/conduit-fill-calculator' },
  { name: 'Residential Load Calculator', path: '/electrical/residential-load-calculator' },
  { name: 'Plumbing DFU Calculator', path: '/plumbing/dfu-calculator' },
  { name: 'Plumbing WSFU Calculator', path: '/plumbing/wsfu-calculator' },
  { name: 'HVAC BTU Calculator', path: '/hvac/btu-calculator' },
  { name: 'HVAC Duct Sizing Calculator', path: '/hvac/duct-sizing-calculator' }
];

const VIEWPORTS = [
  { name: 'Desktop 1440', width: 1440, height: 900, isMobile: false },
  { name: 'Mobile 390', width: 390, height: 844, isMobile: true },
  { name: 'Mobile 320', width: 320, height: 844, isMobile: true }
];

const RUNS_PER_PAGE = 3;

async function runCwvAudit() {
  console.log('--- RUNNING STEP 1: CWV & PERFORMANCE MEASUREMENT VALIDATION ---');
  console.log(`Environment: Chrome 133+ (${CHROME_PATH}), Headless`);
  console.log(`Server: Local Next.js 15.5 Production Server (${BASE_URL})`);
  console.log(`Throttling: None (Unthrottled Lab Baseline)`);
  console.log(`Runs per page: ${RUNS_PER_PAGE} (Reporting Median, Min, Max)\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const fullReport = [];

  for (const pageDef of PAGES) {
    console.log(`Measuring: ${pageDef.name} (${pageDef.path})`);
    const pageMetrics = {
      name: pageDef.name,
      path: pageDef.path,
      viewports: {}
    };

    for (const vp of VIEWPORTS) {
      const runsData = [];

      for (let run = 1; run <= RUNS_PER_PAGE; run++) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });

        let transferredBytes = 0;
        let jsBytes = 0;
        let totalRequests = 0;

        page.on('response', resp => {
          totalRequests++;
          const headers = resp.headers();
          const cl = parseInt(headers['content-length'] || '0', 10);
          transferredBytes += cl;
          const url = resp.url();
          if (url.endsWith('.js') || headers['content-type']?.includes('javascript')) {
            jsBytes += cl;
          }
        });

        // Collect performance entries directly from browser performance observer
        await page.evaluateOnNewDocument(() => {
          window.__metrics = {
            lcp: 0,
            cls: 0,
            longTasksCount: 0,
            totalLongTaskTime: 0,
          };

          // LCP Observer
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              window.__metrics.lcp = Math.round(lastEntry.startTime);
            }
          });
          try {
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          } catch {}

          // CLS Observer
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__metrics.cls += entry.value;
              }
            }
          });
          try {
            clsObserver.observe({ type: 'layout-shift', buffered: true });
          } catch {}

          // Long Tasks Observer
          const ltObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              window.__metrics.longTasksCount++;
              window.__metrics.totalLongTaskTime += entry.duration;
            }
          });
          try {
            ltObserver.observe({ type: 'longtask', buffered: true });
          } catch {}
        });

        const url = `${BASE_URL}${pageDef.path}`;
        const navStart = Date.now();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await new Promise(r => setTimeout(r, 200));

        // Evaluate timings & interaction proxy
        const result = await page.evaluate(async () => {
          const nav = performance.getEntriesByType('navigation')[0] || {};
          const paint = performance.getEntriesByType('paint');
          const fcpEntry = paint.find(e => e.name === 'first-contentful-paint');

          const ttfb = nav.responseStart ? Math.round(nav.responseStart - nav.requestStart) : 0;
          const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0;
          const domContentLoaded = nav.domContentLoadedEventEnd ? Math.round(nav.domContentLoadedEventEnd) : 0;

          // Laboratory interaction proxy test
          let interactionProxyMs = 0;
          let calcLatencyMs = 0;
          const inputEl = document.querySelector('input[type="number"], input[type="text"]');
          if (inputEl) {
            const t0 = performance.now();
            inputEl.value = '42';
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            const tCalc = performance.now();
            calcLatencyMs = Math.round((tCalc - t0) * 100) / 100;

            // Wait for next animation frame
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            interactionProxyMs = Math.round((performance.now() - t0) * 100) / 100;
          }

          return {
            ttfb,
            fcp,
            lcp: window.__metrics.lcp || fcp || domContentLoaded,
            cls: Math.round(window.__metrics.cls * 1000) / 1000,
            longTasksCount: window.__metrics.longTasksCount,
            totalLongTaskTime: Math.round(window.__metrics.totalLongTaskTime),
            calcLatencyMs,
            interactionProxyMs,
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
          };
        });

        runsData.push({
          ...result,
          transferredKb: Math.round(transferredBytes / 1024),
          jsKb: Math.round(jsBytes / 1024),
          totalRequests
        });

        await page.close();
      }

      // Calculate Median, Min, Max
      const getStats = (arr, key) => {
        const vals = arr.map(x => x[key]).sort((a, b) => a - b);
        const mid = Math.floor(vals.length / 2);
        const median = vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
        return {
          median: Math.round(median * 100) / 100,
          min: vals[0],
          max: vals[vals.length - 1]
        };
      };

      pageMetrics.viewports[vp.name] = {
        viewport: `${vp.width}x${vp.height}`,
        ttfb: getStats(runsData, 'ttfb'),
        fcp: getStats(runsData, 'fcp'),
        lcp: getStats(runsData, 'lcp'),
        cls: getStats(runsData, 'cls'),
        longTasks: getStats(runsData, 'longTasksCount'),
        calcLatency: getStats(runsData, 'calcLatencyMs'),
        interactionProxy: getStats(runsData, 'interactionProxyMs'),
        jsKb: getStats(runsData, 'jsKb'),
        totalTransferredKb: getStats(runsData, 'transferredKb'),
        horizontalOverflow: runsData.some(r => r.docWidth > r.winWidth)
      };

      console.log(`  [${vp.name}] TTFB: ${pageMetrics.viewports[vp.name].ttfb.median}ms | FCP: ${pageMetrics.viewports[vp.name].fcp.median}ms | LCP: ${pageMetrics.viewports[vp.name].lcp.median}ms | CLS: ${pageMetrics.viewports[vp.name].cls.median} | Calc: ${pageMetrics.viewports[vp.name].calcLatency.median}ms | Proxy: ${pageMetrics.viewports[vp.name].interactionProxy.median}ms | JS: ${pageMetrics.viewports[vp.name].jsKb.median}kB`);
    }

    fullReport.push(pageMetrics);
  }

  await browser.close();

  fs.writeFileSync('scratch/prelaunch/task038-step1-cwv-report.json', JSON.stringify(fullReport, null, 2));
  console.log('\nStep 1 Complete. Saved to scratch/prelaunch/task038-step1-cwv-report.json');
}

runCwvAudit();
