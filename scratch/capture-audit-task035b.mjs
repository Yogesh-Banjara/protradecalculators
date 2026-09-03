import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task035b');
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

  // 1. Homepage 1440x900 (01_homepage_1440x900.png)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '01_homepage_1440x900.png') });
  console.log('1. 01_homepage_1440x900.png');

  // 2. Homepage 1920x1080 (02_homepage_1920x1080.png)
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '02_homepage_1920x1080.png') });
  console.log('2. 02_homepage_1920x1080.png');

  // 3. Homepage 390x844 (03_homepage_390x844.png)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_homepage_390x844.png') });
  console.log('3. 03_homepage_390x844.png');

  // 4. Homepage Interaction Changed (04_homepage_interaction_changed.png)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  // Click '+' on Length 3 times, Depth 2 times
  const plusButtons = await page.$$('button:has(svg.lucide-plus)');
  if (plusButtons && plusButtons.length > 0) {
    for (let i = 0; i < 3; i++) {
      await plusButtons[0].click();
      await new Promise(r => setTimeout(r, 100));
    }
    if (plusButtons.length > 2) {
      await plusButtons[2].click();
      await plusButtons[2].click();
      await new Promise(r => setTimeout(r, 100));
    }
  }
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(outDir, '04_homepage_interaction_changed.png') });
  console.log('4. 04_homepage_interaction_changed.png');

  // 5. Trade Suites Open (05_trade_suites_open.png)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  const suiteBtn = await page.$('button[aria-haspopup="true"]');
  if (suiteBtn) {
    await suiteBtn.click();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(outDir, '05_trade_suites_open.png') });
    console.log('5. 05_trade_suites_open.png');
  }

  // 6. Tools Directory (06_tools_directory_hover.png)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/tools', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  // Click Electrical filter pill (index 2)
  const filterPills = await page.$$('div.flex-wrap button');
  if (filterPills && filterPills.length > 2) {
    await filterPills[2].click(); // Electrical & Conduit
    await new Promise(r => setTimeout(r, 300));
  }
  await page.screenshot({ path: path.join(outDir, '06_tools_directory_hover.png') });
  console.log('6. 06_tools_directory_hover.png');

  // 7. Concrete Before (07_concrete_before.png)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '07_concrete_before.png') });
  console.log('7. 07_concrete_before.png');

  // 8. Concrete After (08_concrete_after.png)
  // Modify inputs: Length -> 24, Width -> 16, Depth -> 6
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="number"]');
    if (inputs.length >= 3) {
      const setVal = (el, val) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setVal(inputs[0], '24');
      setVal(inputs[1], '16');
      setVal(inputs[2], '6');
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '08_concrete_after.png') });
  console.log('8. 08_concrete_after.png');

  // 9. Concrete Mobile (09_concrete_mobile.png)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '09_concrete_mobile.png') });
  console.log('9. 09_concrete_mobile.png');

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
