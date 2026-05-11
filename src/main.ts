import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/cursor.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/sections.css";

import { initCursor } from "./lib/cursor";
import { initMagnetic } from "./lib/magnetic";
import { initSmoothScroll } from "./lib/smoothScroll";
import { runChoreography } from "./lib/choreography";

// Init order matters: cursor + smooth scroll first (cheap), then choreography
// (which uses ScrollTrigger and needs the DOM measured), then async WebGL.

function boot(): void {
  initCursor();
  initSmoothScroll();
  initMagnetic();
  runChoreography();

  // WebGL hero: lazy import, never blocks first paint.
  const canvas = document.getElementById("bg-shader") as HTMLCanvasElement | null;
  if (canvas) {
    // Defer to next frame so we don't compete with the page-load timeline.
    requestAnimationFrame(() => {
      import("./hero/background")
        .then(({ initHeroBackground }) => initHeroBackground(canvas))
        .catch(() => {
          // CSS fallback already visible — silent fail is fine.
        });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
