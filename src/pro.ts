// Pro page entry. Reuses the bio's CSS and lib modules so the visual
// system stays consistent. Only difference vs main.ts: skips initCounters
// (Pro page has no counters), and the Booking section copy is Pro-specific.

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/cursor.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/booking.css";

import { initCursor } from "./lib/cursor";
import { initMagnetic } from "./lib/magnetic";
import { initSmoothScroll } from "./lib/smoothScroll";
import { runChoreography } from "./lib/choreography";
import { initScrollProgress } from "./lib/scrollProgress";
import { initBooking } from "./lib/booking";

function boot(): void {
  initCursor();
  initSmoothScroll();
  initMagnetic();
  initScrollProgress();
  initBooking();
  runChoreography();

  const auroraCanvas = document.getElementById(
    "hero-bg"
  ) as HTMLCanvasElement | null;
  if (auroraCanvas) {
    requestAnimationFrame(() => {
      import("./hero/background")
        .then(({ initHeroBackground }) => initHeroBackground(auroraCanvas))
        .catch((err) => console.warn("[hero/background] init failed:", err));
    });
  }

  const crystalCanvas = document.getElementById(
    "crystal"
  ) as HTMLCanvasElement | null;
  if (crystalCanvas) {
    requestAnimationFrame(() => {
      import("./hero/crystal")
        .then(({ initCrystal }) => initCrystal(crystalCanvas))
        .catch((err) => console.warn("[hero/crystal] init failed:", err));
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
