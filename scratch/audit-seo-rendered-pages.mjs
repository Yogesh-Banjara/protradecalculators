import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

const URLS_TO_AUDIT = [
  '/',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/categories/construction',
  '/categories/materials',
  '/categories/electrical',
  '/categories/hvac',
  '/categories/plumbing',
  '/construction/concrete-calculator',
  '/construction/deck-calculator',
  '/construction/framing-calculator',
  '/construction/roof-pitch-calculator',
  '/construction/stair-calculator',
  '/materials/drywall-calculator',
  '/materials/gravel-calculator',
  '/electrical/box-fill-calculator',
  '/electrical/conduit-fill-calculator',
  '/electrical/residential-load-calculator',
  '/electrical/voltage-drop-calculator',
  '/guides/subpanel-feeder-sizing',
  '/hvac/btu-calculator',
  '/hvac/duct-sizing-calculator',
  '/plumbing/dfu-calculator',
  '/plumbing/wsfu-calculator'
];

async function runAudit() {
  console.log(`Starting Page-Level SEO Implementation Verification on ${URLS_TO_AUDIT.length} HTML routes...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const path of URLS_TO_AUDIT) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const url = `${BASE_URL}${path}`;
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      const statusCode = response ? response.status() : 0;

      const data = await page.evaluate((currentPath) => {
        const titleEl = document.querySelector('title');
        const title = titleEl ? titleEl.innerText : '';

        const metaDescEl = document.querySelector('meta[name="description"]');
        const metaDescription = metaDescEl ? metaDescEl.getAttribute('content') : '';

        const canonicalEl = document.querySelector('link[rel="canonical"]');
        const canonical = canonicalEl ? canonicalEl.getAttribute('href') : '';

        const robotsEl = document.querySelector('meta[name="robots"]');
        const robots = robotsEl ? robotsEl.getAttribute('content') : '';

        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
        const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';

        const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim());
        const h2s = Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim());
        const h3s = Array.from(document.querySelectorAll('h3')).map(el => el.innerText.trim());

        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const schemas = jsonLdScripts.map(s => {
          try {
            return JSON.parse(s.innerText);
          } catch (e) {
            return { error: 'Invalid JSON', raw: s.innerText };
          }
        });

        const breadcrumbNav = !!document.querySelector('nav[aria-label="Breadcrumb"]');
        const internalLinks = Array.from(document.querySelectorAll('a[href^="/"]')).map(a => a.getAttribute('href'));

        // Text & Word Count
        const bodyText = document.body.innerText || '';
        const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

        // Check for suspicious claims
        const bannedHypeTerms = ['#1', 'world-class', 'guaranteed to rank', 'guaranteed permit', 'certified compliant', 'licensed contractor', 'official government'];
        const foundBannedTerms = bannedHypeTerms.filter(term => bodyText.toLowerCase().includes(term.toLowerCase()));

        // Check viewport overflow
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

        return {
          path: currentPath,
          title,
          titleLength: title.length,
          metaDescription,
          metaDescLength: metaDescription.length,
          canonical,
          robots,
          ogTitle,
          ogDesc,
          ogUrl,
          ogType,
          h1Count: h1s.length,
          h1: h1s[0] || '',
          h2Count: h2s.length,
          h3Count: h3s.length,
          schemaTypes: schemas.map(s => Array.isArray(s) ? s.map(item => item['@type']) : s['@type']).flat(),
          breadcrumbNav,
          internalLinksCount: internalLinks.length,
          wordCount,
          foundBannedTerms,
          hasHorizontalScroll
        };
      }, path);

      results.push({
        ...data,
        statusCode,
        status: statusCode === 200 && data.h1Count === 1 && data.titleLength > 10 && data.metaDescLength > 30 ? 'PASS' : 'FLAGGED'
      });

      console.log(`[${statusCode}] ${path} - Title: "${data.title.slice(0, 40)}..." (H1: ${data.h1Count}, Words: ${data.wordCount})`);
    } catch (err) {
      console.error(`Error auditing ${path}:`, err.message);
      results.push({
        path,
        error: err.message,
        status: 'ERROR'
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync('scratch/seo/page-implementation-audit-results.json', JSON.stringify(results, null, 2));
  console.log(`Audit complete. Results written to scratch/seo/page-implementation-audit-results.json`);
}

runAudit();
