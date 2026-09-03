import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034b';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser for Task 034B audit visual capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

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

  const setSelectValue = async (selector, index, val) => {
    await page.evaluate((sel, idx, v) => {
      const selects = document.querySelectorAll(sel);
      if (selects[idx]) {
        selects[idx].value = v;
        selects[idx].dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, selector, index, val);
  };

  // 1. HOMEPAGE
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

  // 2. CONCRETE
  console.log('4. Capturing Concrete Initial 1440x900 (10x10x4")...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '04_concrete_1440_initial.png') });

  console.log('5. Capturing Concrete after 24x14x6"...');
  await setInputValue('input[type="number"]', 0, '24');
  await setInputValue('input[type="number"]', 1, '14');
  await setInputValue('input[type="number"]', 2, '6');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '05_concrete_1440_after_24x14x6.png') });

  console.log('6. Capturing Concrete after thickness changes 6in -> 10in...');
  await setInputValue('input[type="number"]', 2, '10');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '06_concrete_1440_after_thickness_10in.png') });

  console.log('7. Capturing Concrete 1440 Metric...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const metricBtn = buttons.find(b => b.textContent && b.textContent.includes('Metric'));
    if (metricBtn) metricBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '07_concrete_1440_metric.png') });

  console.log('8. Capturing Concrete 390x844 Mobile...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/construction/concrete-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '08_concrete_390x844.png') });

  // 3. CONDUIT
  console.log('9. Capturing Conduit Initial...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/electrical/conduit-fill-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '09_conduit_initial.png') });

  console.log('10. Capturing Conduit wire count changed...');
  await setInputValue('input[type="number"]', 0, '7');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '10_conduit_wire_count_changed.png') });

  // 4. FRAMING
  console.log('11. Capturing Framing Initial...');
  await page.goto('http://localhost:3000/construction/framing-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '11_framing_initial.png') });

  console.log('12. Capturing Framing spacing changed to 24"...');
  await setSelectValue('select', 0, '24');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '12_framing_spacing_changed.png') });

  // 5. STAIRS
  console.log('13. Capturing Stair Initial...');
  await page.goto('http://localhost:3000/construction/stair-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '13_stair_initial.png') });

  console.log('14. Capturing Stair rise changed...');
  await setInputValue('input[type="number"]', 0, '120');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '14_stair_rise_changed.png') });

  // 6. PLUMBING DFU
  console.log('15. Capturing Plumbing DFU Initial...');
  await page.goto('http://localhost:3000/plumbing/dfu-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '15_dfu_initial.png') });

  console.log('16. Capturing Plumbing DFU fixtures changed...');
  await setInputValue('input[type="number"]', 0, '6');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '16_dfu_fixtures_changed.png') });

  // 7. HVAC BTU
  console.log('17. Capturing HVAC BTU Initial...');
  await page.goto('http://localhost:3000/hvac/btu-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '17_hvac_initial.png') });

  console.log('18. Capturing HVAC BTU area changed...');
  await setInputValue('input[type="number"]', 0, '3200');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '18_hvac_area_changed.png') });

  // 8. MOBILE FLAGSHIPS
  console.log('19. Capturing Framing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/construction/framing-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '19_framing_390x844.png') });

  console.log('20. Capturing Stair Mobile 390x844...');
  await page.goto('http://localhost:3000/construction/stair-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '20_stair_390x844.png') });

  console.log('21. Capturing DFU Mobile 390x844...');
  await page.goto('http://localhost:3000/plumbing/dfu-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '21_dfu_390x844.png') });

  console.log('22. Capturing HVAC Mobile 390x844...');
  await page.goto('http://localhost:3000/hvac/btu-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotDir, '22_hvac_390x844.png') });

  await browser.close();
  console.log('ALL AUDIT SCREENSHOTS COMPLETED!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
