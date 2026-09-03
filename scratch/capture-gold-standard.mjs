import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser for Gold Standard visual verification...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Homepage at 1440x900
  console.log('1. Capturing Homepage at 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '01_homepage_1440x900.png') });

  // 2. Homepage at 1920x1080
  console.log('2. Capturing Homepage at 1920x1080...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.screenshot({ path: path.join(screenshotDir, '02_homepage_1920x1080.png') });

  // 3. Homepage at 390x844 (Mobile)
  console.log('3. Capturing Homepage at 390x844 (Mobile)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.screenshot({ path: path.join(screenshotDir, '03_homepage_mobile_390.png'), fullPage: false });

  // 4. Concrete Calculator Initial State (10x10x4") at 1440x900
  console.log('4. Capturing Concrete Initial State (10x10x4") at 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '04_concrete_initial_1440.png') });

  // 5. Concrete Calculator Dimension Change (24x14x6")
  console.log('5. Setting dimensions to exactly 24x14x6" and capturing...');
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    if (inputs.length >= 3) {
      // Set native value and trigger input events
      const setVal = (el, val) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setVal(inputs[0], '24');
      setVal(inputs[1], '14');
      setVal(inputs[2], '6');
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '05_concrete_changed_24x14x6_1440.png') });

  // 6. Concrete Unit Conversion to Metric
  console.log('6. Switching Concrete to Metric...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const metricBtn = btns.find(b => b.textContent.includes('Metric (SI)') || b.textContent.includes('Metric (m, cm'));
    if (metricBtn) metricBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '06_concrete_unit_conversion_metric.png') });

  // Switch back to Imperial
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const imperialBtn = btns.find(b => b.textContent.includes('Imperial (US)') || b.textContent.includes('Imperial (ft, in'));
    if (imperialBtn) imperialBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 7. Concrete Advanced Options Opened
  console.log('7. Opening Advanced Options and capturing...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const advBtn = btns.find(b => b.textContent.includes('Jobsite Waste'));
    if (advBtn) advBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(screenshotDir, '07_concrete_advanced_options.png') });

  // 8. Concrete Result / Takeoff HUD Detail
  console.log('8. Capturing Takeoff & Result HUD...');
  await page.screenshot({ path: path.join(screenshotDir, '08_concrete_takeoff_result_hud.png') });

  // 9. Concrete on Mobile 390x844
  console.log('9. Capturing Concrete on Mobile (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '09_concrete_mobile_390.png') });
  await page.screenshot({ path: path.join(screenshotDir, '10_concrete_mobile_fullpage.png'), fullPage: true });

  await browser.close();
  console.log('All Gold Standard screenshots captured successfully!');
}

run().catch(console.error);
