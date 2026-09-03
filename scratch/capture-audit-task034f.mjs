import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots\\task034f');
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

  // 1. Homepage 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '01_homepage_1440x900.png') });
  console.log('1. Captured homepage 1440x900');

  // 2. Construction Suite 1440x900
  await page.goto('http://localhost:3000/categories/construction', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '02_construction_suite_1440x900.png') });
  console.log('2. Captured construction suite 1440x900');

  // 3. Electrical Suite 1440x900
  await page.goto('http://localhost:3000/categories/electrical', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_electrical_suite_1440x900.png') });
  console.log('3. Captured electrical suite 1440x900');

  // 4. Plumbing Suite 1440x900
  await page.goto('http://localhost:3000/categories/plumbing', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_plumbing_suite_1440x900.png') });
  console.log('4. Captured plumbing suite 1440x900');

  // 5. Tools Directory 1440x900
  await page.goto('http://localhost:3000/tools', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_tools_directory_1440x900.png') });
  console.log('5. Captured tools directory 1440x900');

  // Mobile Viewport (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  // 6. Homepage 390x844
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_homepage_390x844.png') });
  console.log('6. Captured homepage 390x844');

  // 7. Plumbing Suite 390x844
  await page.goto('http://localhost:3000/categories/plumbing', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_plumbing_suite_390x844.png') });
  console.log('7. Captured plumbing suite 390x844');

  // 8. Tools Directory 390x844
  await page.goto('http://localhost:3000/tools', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '08_tools_directory_390x844.png') });
  console.log('8. Captured tools directory 390x844');

  await browser.close();
  console.log('All Task 034F visual QA screenshots captured successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
