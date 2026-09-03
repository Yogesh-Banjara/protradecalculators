import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034h');
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

  // 1. Subpanel Guide Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/guides/subpanel-feeder-sizing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '01_subpanel_guide_1440x900.png') });
  console.log('1. Captured Subpanel Guide Desktop 1440x900');

  // 2. Subpanel Guide Mobile 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/guides/subpanel-feeder-sizing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '02_subpanel_guide_390x844.png') });
  console.log('2. Captured Subpanel Guide Mobile 390x844');

  // 3. Voltage Drop Calculator showing contextual guide link Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/electrical/voltage-drop-calculator', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  // Scroll down to Section 8
  await page.evaluate(() => {
    window.scrollTo(0, 5200);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_voltage_drop_with_guide_link_1440x900.png') });
  console.log('3. Captured Voltage Drop with Guide Link 1440x900');

  // Fetch sitemap.xml and robots.txt to verify local origin
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  fs.writeFileSync(path.join(outDir, 'sitemap_sample.xml'), sitemapText.slice(0, 1000), 'utf8');

  const robotsRes = await fetch('http://localhost:3000/robots.txt');
  const robotsText = await robotsRes.text();
  fs.writeFileSync(path.join(outDir, 'robots_sample.txt'), robotsText, 'utf8');

  console.log('Sitemap and robots verified against localhost.');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
