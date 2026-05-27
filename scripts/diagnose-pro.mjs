import { chromium } from "playwright";

const URL = process.env.PRO_URL || "http://127.0.0.1:5173/pro/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleLogs = [];
page.on("console", (msg) =>
  consoleLogs.push({ type: msg.type(), text: msg.text() })
);
page.on("pageerror", (err) =>
  consoleLogs.push({ type: "pageerror", text: err.message + "\n" + err.stack })
);

await page.goto(URL, { waitUntil: "networkidle", timeout: 20000 });

// Scroll to bottom in small steps so ScrollTriggers can fire en route.
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = 400;
    const i = setInterval(() => {
      window.scrollBy(0, step);
      y += step;
      if (y >= document.body.scrollHeight) {
        clearInterval(i);
        setTimeout(resolve, 1200);
      }
    }, 140);
  });
});

await page.waitForTimeout(1500);

const items = await page.$$eval(".proof__item", (els) =>
  els.map((el, idx) => {
    const cs = getComputedStyle(el);
    return {
      idx,
      text: el.textContent?.trim().slice(0, 60),
      opacity: cs.opacity,
      transform: cs.transform,
      visibility: cs.visibility,
      display: cs.display,
      classList: Array.from(el.classList),
      parentSection: el.closest("section")?.id ?? null,
    };
  })
);

const card = await page
  .$eval(".track--accent.glass-highlight", (el) => {
    const cs = getComputedStyle(el);
    return {
      backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
      borderRadius: cs.borderRadius,
      backgroundColor: cs.backgroundColor,
      transform: cs.transform,
      boxShadow: cs.boxShadow,
    };
  })
  .catch(() => ({ note: "Selector nicht gefunden" }));

const globals = await page.evaluate(() => ({
  hasGSAP: typeof window.gsap !== "undefined",
  hasScrollTrigger: typeof window.ScrollTrigger !== "undefined",
  hasLenis: typeof window.Lenis !== "undefined" || typeof window.lenis !== "undefined",
  hasCal: typeof window.Cal !== "undefined",
  scrollY: window.scrollY,
  bodyScrollHeight: document.body.scrollHeight,
}));

console.log(JSON.stringify({ url: URL, consoleLogs, items, card, globals }, null, 2));

await browser.close();
