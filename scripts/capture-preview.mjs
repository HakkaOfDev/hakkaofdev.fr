import { chromium } from "playwright";

const URL = process.env.PREVIEW_URL ?? "http://127.0.0.1:3100/";
const OUT = process.env.PREVIEW_OUT ?? "public/preview.png";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  locale: "en-US",
});
const page = await context.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

// Ensure web fonts are fully loaded before snapshotting.
await page.evaluate(() => document.fonts.ready);
// Ensure the avatar image has decoded.
await page
  .locator('img[alt="Alexandre Gossard"]')
  .first()
  .waitFor({ state: "visible" });
// Let entry animations settle.
await page.waitForTimeout(1200);

await page.screenshot({ path: OUT });
console.log(`Saved ${OUT}`);

await browser.close();
