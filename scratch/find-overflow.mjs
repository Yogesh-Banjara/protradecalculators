import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkOverflow() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/plumbing/dfu-calculator', { waitUntil: 'networkidle0' });

  const overflowingElements = await page.evaluate(() => {
    const winWidth = window.innerWidth;
    const all = Array.from(document.querySelectorAll('*'));
    const bad = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > winWidth + 1) {
        bad.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: Math.round(rect.right),
          winWidth
        });
      }
    }
    return bad;
  });

  console.log('Overflowing elements at 1280px:', overflowingElements);
  await browser.close();
}

checkOverflow();
