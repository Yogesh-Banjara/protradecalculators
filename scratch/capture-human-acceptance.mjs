import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const screenshotDir = "C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\89b1342c-fe1a-4575-aba8-42eae9d0a9a6\\screenshots";

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log("Using browser:", chromePath);

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  
  // Set Desktop Viewport
  await page.setViewport({ width: 1280, height: 900 });

  console.log("1. Capturing Homepage Desktop...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "01_homepage_desktop.png"), fullPage: false });

  console.log("2. Capturing Homepage Mobile (390px)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "02_homepage_mobile_390.png"), fullPage: false });

  // Reset to Desktop
  await page.setViewport({ width: 1280, height: 950 });

  // 3. Concrete Interaction Test
  console.log("3. Concrete Interaction Test...");
  await page.goto("http://localhost:3000/construction/concrete-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "03_concrete_initial.png"), fullPage: false });

  // Change Length to 24, Width to 14, Depth to 6
  await page.waitForSelector('input[id*="length"]');
  
  // Clear and type Length
  const lengthInput = await page.$('input[id*="length"]');
  await lengthInput.click({ clickCount: 3 });
  await lengthInput.press('Backspace');
  await lengthInput.type('24');

  // Clear and type Width
  const widthInput = await page.$('input[id*="width"]');
  await widthInput.click({ clickCount: 3 });
  await widthInput.press('Backspace');
  await widthInput.type('14');

  // Clear and type Depth
  const depthInput = await page.$('input[id*="depth"]');
  await depthInput.click({ clickCount: 3 });
  await depthInput.press('Backspace');
  await depthInput.type('6');

  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "04_concrete_after_dimensions_change.png"), fullPage: false });

  // 4. Unit Conversion Test on Concrete
  console.log("4. Unit Conversion Test on Concrete...");
  // Click Metric toggle button
  const metricBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Metric'));
  });
  if (metricBtn) {
    await metricBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotDir, "05_concrete_switched_to_metric.png"), fullPage: false });

    // Switch back to Imperial
    const imperialBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Imperial'));
    });
    if (imperialBtn) {
      await imperialBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: path.join(screenshotDir, "06_concrete_switched_back_imperial.png"), fullPage: false });
    }
  }

  // 5. Framing Interaction Test
  console.log("5. Framing Interaction Test...");
  await page.goto("http://localhost:3000/construction/framing-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "07_framing_initial.png"), fullPage: false });

  // Change Wall Length to 32, Stud spacing to 24" OC
  const wallLenInput = await page.$('input[type="number"]');
  if (wallLenInput) {
    await wallLenInput.click({ clickCount: 3 });
    await wallLenInput.press('Backspace');
    await wallLenInput.type('32');
  }

  // Find select for stud spacing
  const selects = await page.$$('select');
  for (const s of selects) {
    const val = await page.evaluate(el => el.value, s);
    if (val === "16") {
      await s.select("24");
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "08_framing_after_length_spacing_change.png"), fullPage: false });

  // 6. Stairs Interaction Test
  console.log("6. Stairs Interaction Test...");
  await page.goto("http://localhost:3000/construction/stair-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "09_stairs_initial.png"), fullPage: false });

  const stairsRiseInput = await page.$('input[type="number"]');
  if (stairsRiseInput) {
    await stairsRiseInput.click({ clickCount: 3 });
    await stairsRiseInput.press('Backspace');
    await stairsRiseInput.type('112.5');
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "10_stairs_after_rise_change.png"), fullPage: false });

  // 7. Conduit Fill Interaction Test
  console.log("7. Conduit Fill Interaction Test...");
  await page.goto("http://localhost:3000/electrical/conduit-fill-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "11_conduit_initial.png"), fullPage: false });

  const conduitNumInput = await page.$('input[type="number"]');
  if (conduitNumInput) {
    await conduitNumInput.click({ clickCount: 3 });
    await conduitNumInput.press('Backspace');
    await conduitNumInput.type('9');
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "12_conduit_after_wire_count_change.png"), fullPage: false });

  // 8. WSFU Interaction Test
  console.log("8. WSFU Interaction Test...");
  await page.goto("http://localhost:3000/plumbing/wsfu-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "13_wsfu_initial.png"), fullPage: false });

  // Increment first fixture quantity
  const plusBtns = await page.$$('button');
  for (const b of plusBtns) {
    const label = await page.evaluate(el => el.getAttribute('aria-label') || el.textContent, b);
    if (label && label.includes('Increase') || label === "+") {
      await b.click();
      await b.click();
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "14_wsfu_after_fixtures_change.png"), fullPage: false });

  // 9. HVAC BTU Interaction Test
  console.log("9. HVAC BTU Interaction Test...");
  await page.goto("http://localhost:3000/hvac/btu-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "15_hvac_initial.png"), fullPage: false });

  const hvacSqFtInput = await page.$('input[type="number"]');
  if (hvacSqFtInput) {
    await hvacSqFtInput.click({ clickCount: 3 });
    await hvacSqFtInput.press('Backspace');
    await hvacSqFtInput.type('3600');
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotDir, "16_hvac_after_sqft_change.png"), fullPage: false });

  // 10. Mobile Calculator View (390px)
  console.log("10. Capturing Mobile Calculator View (390px)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/construction/concrete-calculator", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(screenshotDir, "17_concrete_mobile_390.png"), fullPage: false });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
