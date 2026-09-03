import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task036');
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

const viewports = [
  { name: '01_roof_desktop_1280x900.png', width: 1280, height: 900, isMobile: false },
  { name: '02_roof_desktop_1440x900.png', width: 1440, height: 900, isMobile: false },
  { name: '03_roof_desktop_1920x1080.png', width: 1920, height: 1080, isMobile: false },
  { name: '04_roof_mobile_320x844.png', width: 320, height: 844, isMobile: true },
  { name: '05_roof_mobile_360x800.png', width: 360, height: 800, isMobile: true },
  { name: '06_roof_mobile_390x844.png', width: 390, height: 844, isMobile: true },
  { name: '07_roof_mobile_430x932.png', width: 430, height: 932, isMobile: true },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: vp.isMobile ? 2 : 1
    });

    await page.goto('http://localhost:3000/construction/roof-pitch-calculator', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, vp.name) });
    console.log(`Captured: ${vp.name}`);
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
