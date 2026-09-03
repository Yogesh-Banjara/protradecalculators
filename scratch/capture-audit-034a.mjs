import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034a';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser for Task 034A audit visual capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Helper to set input value natively
  const setInputValue = async (selector, index, val) => {
    await page.evaluate((sel, idx, v) => {
      const inputs = document.querySelectorAll(sel);
      if (inputs[idx]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[idx], v);
        inputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, selector, index, val);
  };

  // ==========================================
  // 1. HOMEPAGE CAPTURES
  // ==========================================
  console.log('1. Capturing Homepage 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '01_homepage_1440x900.png') });

  console.log('2. Capturing Homepage 1920x1080...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '02_homepage_1920x1080.png') });

  console.log('3. Capturing Homepage 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '03_homepage_390x844.png') });

  // ==========================================
  // 2. CONCRETE CALCULATOR CAPTURES
  // ==========================================
  console.log('4. Capturing Concrete Initial 1440x900 (10x10x4")...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '04_concrete_1440_initial.png') });

  console.log('5. Capturing Concrete After 24x14x6"...');
  await setInputValue('input[type="number"]', 0, '24');
  await setInputValue('input[type="number"]', 1, '14');
  await setInputValue('input[type="number"]', 2, '6');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '05_concrete_1440_after_24x14x6.png') });

  console.log('6. Capturing Concrete After Thickness 6in -> 10in (24x14x10")...');
  await setInputValue('input[type="number"]', 2, '10');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '06_concrete_1440_after_thickness_10in.png') });

  // Reset to 24x14x6 for metric toggle
  await setInputValue('input[type="number"]', 2, '6');
  await new Promise(r => setTimeout(r, 300));

  console.log('7. Capturing Concrete Metric 1440x900...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const metricBtn = btns.find(b => b.textContent.includes('Metric (m, cm') || b.textContent.includes('Metric (SI)'));
    if (metricBtn) metricBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '07_concrete_1440_metric.png') });

  console.log('8. Capturing Concrete 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotDir, '08_concrete_390x844.png') });

  // ==========================================
  // 3. CONDUIT CALCULATOR CAPTURES
  // ==========================================
  console.log('9. Capturing Conduit Initial 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/electrical/conduit-fill-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '09_conduit_initial.png') });

  console.log('10. Capturing Conduit Wire Count Changed (add conductors)...');
  await setInputValue('input[type="number"]', 0, '12'); // Change conductor count to 12
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '10_conduit_wire_count_changed.png') });

  // ==========================================
  // 4. FRAMING CALCULATOR CAPTURES
  // ==========================================
  console.log('11. Capturing Framing Initial 1440x900...');
  await page.goto('http://localhost:3000/construction/framing-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '11_framing_initial.png') });

  console.log('12. Capturing Framing Spacing Changed (16" -> 24" OC)...');
  // Change wall length or spacing
  await setInputValue('input[type="number"]', 0, '36'); // Change wall length to 36
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    if (selects.length > 0) {
      selects[0].value = '24';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, '12_framing_spacing_changed.png') });

  await browser.close();
  console.log('All Task 034A audit screenshots captured successfully!');
}

run().catch(console.error);
