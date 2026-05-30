// Rasterize public/og-image.svg → public/og-image.png (1200×630) via headless
// Chromium. Social platforms (Facebook/LinkedIn/X/WhatsApp/Slack) ignore SVG
// og:image, so a PNG raster is required. The brand webfonts (Cormorant Garamond
// + JetBrains Mono) are loaded so the rendered text matches the live site.
//
// Run:  node scripts/gen-og-image.mjs
// Deps: playwright (already a devDependency)

import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(resolve(root, "public/og-image.svg"), "utf8");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>html,body{margin:0;padding:0}svg{display:block}</style>
</head><body>${svg}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300); // let the variable-font paint settle
await page.screenshot({
  path: resolve(root, "public/og-image.png"),
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log("Wrote public/og-image.png (1200×630)");
