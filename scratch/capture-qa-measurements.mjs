import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034g');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = chromePaths.find(p => fs.existsSync(p));

if (!executablePath) {
  console.error("Chrome executable not found!");
  process.exit(1);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const routes = [
    { name: '01_homepage', url: 'http://localhost:3000/' },
    { name: '02_construction_suite', url: 'http://localhost:3000/categories/construction' },
    { name: '03_electrical_suite', url: 'http://localhost:3000/categories/electrical' },
    { name: '04_plumbing_suite', url: 'http://localhost:3000/categories/plumbing' },
    { name: '05_materials_suite', url: 'http://localhost:3000/categories/materials' },
    { name: '06_tools_directory', url: 'http://localhost:3000/tools' },
  ];

  const measurements = {};

  // 1. Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  for (const r of routes) {
    let totalBytes = 0;
    let jsBytes = 0;
    let imgBytes = 0;
    let docBytes = 0;

    const reqHandler = (res) => {
      const size = parseInt(res.headers()['content-length'] || '0', 10);
      totalBytes += size;
      const url = res.url();
      if (url.endsWith('.js') || url.includes('/_next/static/chunks/')) jsBytes += size;
      else if (url.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)) imgBytes += size;
      else if (url === r.url || url === r.url.slice(0, -1)) docBytes += size;
    };
    page.on('response', reqHandler);

    await page.goto(r.url, { waitUntil: 'networkidle0' });
    await new Promise(res => setTimeout(res, 800));
    await page.screenshot({ path: path.join(outDir, `${r.name}_1440x900.png`) });

    measurements[r.name] = {
      docBytes,
      jsBytes,
      imgBytes,
      totalBytes,
      consoleErrorsCount: consoleErrors.length
    };

    page.off('response', reqHandler);
    console.log(`Captured Desktop: ${r.name}`);
  }

  // 2. Mobile 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  for (const r of routes) {
    await page.goto(r.url, { waitUntil: 'networkidle0' });
    await new Promise(res => setTimeout(res, 800));
    await page.screenshot({ path: path.join(outDir, `${r.name}_390x844.png`) });
    console.log(`Captured Mobile: ${r.name}`);
  }

  fs.writeFileSync('scratch/measurements.json', JSON.stringify(measurements, null, 2), 'utf8');
  console.log('Saved measurements to scratch/measurements.json');

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
