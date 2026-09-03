import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser for Task 034 Gold Standard acceptance verification...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Homepage Initial (1440x900)
  console.log('1. Capturing Homepage Initial at 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '01_homepage_initial_1440.png') });

  // 2. Homepage After Mini-Instrument Interaction (Change 24x14x6 -> 32x20x8)
  console.log('2. Interacting with Homepage Mini-Instrument...');
  await page.evaluate(() => {
    // Select the mini-concrete container (first mini-instrument in the grid)
    const miniCards = document.querySelectorAll('section:nth-of-type(2) .grid > div');
    if (miniCards.length >= 1) {
      const concCard = miniCards[0];
      const buttons = concCard.querySelectorAll('button');
      // In mini concrete: [L-, L+, W-, W+, D-, D+]
      if (buttons.length >= 6) {
        buttons[1].click(); // L+ (26)
        buttons[1].click(); // L+ (28)
        buttons[1].click(); // L+ (30)
        buttons[3].click(); // W+ (16)
        buttons[3].click(); // W+ (18)
        buttons[5].click(); // D+ (7)
        buttons[5].click(); // D+ (8)
      }
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '02_homepage_after_interaction_1440.png') });

  // 3. Homepage at 1920x1080 (Widescreen)
  console.log('3. Capturing Homepage at 1920x1080...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '03_homepage_1920x1080.png') });

  // 4. Homepage at 390x844 (Mobile)
  console.log('4. Capturing Homepage at 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '04_homepage_mobile_390.png') });

  // 5. Concrete Calculator Initial State (10x10x4") at 1440x900
  console.log('5. Capturing Concrete Initial State (10x10x4") at 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '05_concrete_initial_1440.png') });

  // 6. Concrete Dimensions Changed (24x14x6")
  console.log('6. Setting Concrete to 24x14x6" and capturing...');
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    if (inputs.length >= 3) {
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
  await page.screenshot({ path: path.join(screenshotDir, '06_concrete_dimensions_changed_24x14x6_1440.png') });

  // 7. Concrete Thickness Changed (24x14x10") - Explicit Thickness Demonstration
  console.log('7. Setting Thickness to 10" and capturing thickness morphing...');
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    if (inputs.length >= 3) {
      const setVal = (el, val) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setVal(inputs[2], '10');
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '07_concrete_thickness_changed_24x14x10_1440.png') });

  // Reset to 24x14x6 for remaining captures
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    if (inputs.length >= 3) {
      const setVal = (el, val) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setVal(inputs[2], '6');
    }
  });
  await new Promise(r => setTimeout(r, 400));

  // 8. Concrete Unit Conversion to Metric
  console.log('8. Switching Concrete to Metric (SI)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const metricBtn = btns.find(b => b.textContent.includes('Metric (SI)') || b.textContent.includes('Metric (m, cm'));
    if (metricBtn) metricBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '08_concrete_unit_conversion_metric.png') });

  // Switch back to Imperial
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const imperialBtn = btns.find(b => b.textContent.includes('Imperial (US)') || b.textContent.includes('Imperial (ft, in'));
    if (imperialBtn) imperialBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 9. Concrete Advanced Options Opened
  console.log('9. Opening Advanced Options and capturing...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const advBtn = btns.find(b => b.textContent.includes('Jobsite Waste'));
    if (advBtn) advBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(screenshotDir, '09_concrete_advanced_options_open.png') });

  // 10. Concrete Result / Takeoff HUD Detail
  console.log('10. Capturing Takeoff & Result HUD...');
  await page.screenshot({ path: path.join(screenshotDir, '10_concrete_result_takeoff_hud.png') });

  // 11. Concrete on Mobile 390x844
  console.log('11. Capturing Concrete on Mobile (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '11_concrete_mobile_390.png') });
  await page.screenshot({ path: path.join(screenshotDir, '12_concrete_mobile_fullpage.png'), fullPage: true });

  await browser.close();
  console.log('All Task 034 screenshots captured successfully!');
}

run().catch(console.error);
