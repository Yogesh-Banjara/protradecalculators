import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkFailedRequests() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const failed = [];
  page.on('response', resp => {
    if (resp.status() >= 400) {
      failed.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.goto('http://localhost:3000/guides/subpanel-feeder-sizing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 300));
  console.log('Failed requests on guide page:', failed);
  await browser.close();
}

checkFailedRequests();
