import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = chromePaths.find(p => fs.existsSync(p));

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const routes = [
    '/',
    '/tools',
    '/categories/construction',
    '/categories/electrical',
    '/categories/plumbing',
    '/categories/hvac',
    '/categories/materials',
    '/construction/concrete-calculator',
    '/construction/deck-calculator',
    '/construction/framing-calculator',
    '/construction/roof-pitch-calculator',
    '/construction/stair-calculator',
    '/materials/gravel-calculator',
    '/materials/drywall-calculator',
    '/electrical/voltage-drop-calculator',
    '/electrical/conduit-fill-calculator',
    '/electrical/box-fill-calculator',
    '/electrical/residential-load-calculator',
    '/hvac/btu-calculator',
    '/hvac/duct-sizing-calculator',
    '/plumbing/dfu-calculator',
    '/plumbing/wsfu-calculator',
  ];

  const inDegree = {};
  routes.forEach(r => inDegree[r] = 0);

  for (const r of routes) {
    await page.goto(`http://localhost:3000${r}`, { waitUntil: 'networkidle0' });
    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(Boolean);
    });

    const uniqueHrefs = [...new Set(hrefs)];
    uniqueHrefs.forEach(target => {
      const cleanTarget = target.split('#')[0].split('?')[0];
      if (inDegree[cleanTarget] !== undefined && cleanTarget !== r) {
        inDegree[cleanTarget]++;
      }
    });
  }

  console.log('=== HTML CRAWLABLE INBOUND LINK COUNT PER ROUTE ===');
  Object.entries(inDegree).forEach(([route, count]) => {
    console.log(`${route}: ${count} inbound crawlable HTML links`);
  });

  const orphans = Object.entries(inDegree).filter(([r, count]) => count === 0);
  if (orphans.length === 0) {
    console.log('\nVERIFICATION SUCCESS: 0 Orphan Routes! Every page has crawlable inbound links.');
  } else {
    console.log('\nWARNING: Found orphans:', orphans);
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
