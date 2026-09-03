import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034d';
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

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Deck 1440x900 Initial
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/construction/deck-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '01_deck_1440_initial.png') });
  console.log('1. Captured deck 1440 initial');

  // 2. Deck Dimensions Changed (16' × 24' preset -> 384 sq ft)
  const buttonsForSize = await page.$$('button');
  for (const b of buttonsForSize) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes("16′ × 24′")) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '02_deck_1440_dimensions_changed.png') });
  console.log('2. Captured deck dimensions changed');

  // 3. Changed Joist Spacing (12" OC)
  const joistSelect = await page.$('#joist-spacing');
  if (joistSelect) {
    await joistSelect.select('12');
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_deck_1440_spacing_changed.png') });
  console.log('3. Captured deck spacing changed');

  // 4. Unit Conversion (Metric)
  const metricBtn = await page.$('button::-p-text(Metric)');
  if (metricBtn) {
    await metricBtn.click();
  } else {
    // Fallback search buttons
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Metric')) {
        await b.click();
        break;
      }
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '04_deck_1440_metric.png') });
  console.log('4. Captured deck metric');

  // Switch back to Imperial
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Imperial')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));

  // 5. Expand Drawers / Populated Takeoff
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Pattern Orientation') || text.includes('Support Beam') || text.includes('Optional Material Cost'))) {
      await b.click();
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '05_deck_1440_takeoff_populated.png') });
  console.log('5. Captured deck populated takeoff');

  // 6. Desktop 1920x1080
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/construction/deck-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_deck_1920x1080.png') });
  console.log('6. Captured deck 1920x1080');

  // 7. Mobile 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/construction/deck-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_deck_390x844.png') });
  console.log('7. Captured deck 390x844');

  await browser.close();
  console.log('All deck screenshots successfully captured.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
