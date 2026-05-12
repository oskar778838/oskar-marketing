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

// Init order matters: cursor + smooth scroll first (cheap), then choreography
// (which uses ScrollTrigger and needs the DOM measured), then async WebGL.

function boot(): void {
  initCursor();
  initSmoothScroll();
  initMagnetic();
  initScrollProgress();
  initBooking();
  runChoreography();

  // WebGL hero: lazy import, never blocks first paint.
  const auroraCanvas = document.getElementById(
    "hero-bg"
  ) as HTMLCanvasElement | null;
  if (auroraCanvas) {
    requestAnimationFrame(() => {
      import("./hero/background")
        .then(({ initHeroBackground }) => initHeroBackground(auroraCanvas))
        .catch((err) => {
          console.warn("[hero/background] WebGL init failed:", err);
        });
    });
  }

  // 3D crystal centerpiece — separate chunk so its three.js footprint
  // doesn't block first paint of the rest of the page.
  const crystalCanvas = document.getElementById(
    "crystal"
  ) as HTMLCanvasElement | null;
  if (crystalCanvas) {
    requestAnimationFrame(() => {
      import("./hero/crystal")
        .then(({ initCrystal }) => initCrystal(crystalCanvas))
        .catch((err) => {
          console.warn("[hero/crystal] init failed:", err);
        });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
