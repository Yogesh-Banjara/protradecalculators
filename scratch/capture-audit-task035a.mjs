import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task035a');
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

  // 1. Homepage 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '01_homepage_1440x900.png') });
  console.log('1. Homepage 1440x900');

  // 2. Homepage 1920x1080
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '02_homepage_1920x1080.png') });
  console.log('2. Homepage 1920x1080');

  // 3. Homepage 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_homepage_390x844.png') });
  console.log('3. Homepage 390x844');

  // 4. Trade Suites Dropdown Open
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  const suiteBtn = await page.$('button[aria-haspopup="true"]');
  if (suiteBtn) {
    await suiteBtn.click();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(outDir, '04_trade_suites_dropdown_open.png') });
    console.log('4. Trade Suites Dropdown Open');
  }

  // 5. Tools Directory 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/tools', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '05_tools_directory_1440x900.png') });
  console.log('5. Tools Directory 1440x900');

  // 6. Concrete Calculator 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '06_concrete_calculator_1440x900.png') });
  console.log('6. Concrete Calculator 1440x900');

  // 7. Concrete Calculator 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '07_concrete_calculator_390x844.png') });
  console.log('7. Concrete Calculator 390x844');

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
