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
import { initCounters } from "./lib/counters";
import { initEasterEgg, updateDayCounter } from "./lib/easter-egg";

// Init order matters: cursor + smooth scroll first (cheap), then choreography
// (which uses ScrollTrigger and needs the DOM measured), then async WebGL.

function boot(): void {
  initCursor();
  initSmoothScroll();
  initMagnetic();
  initScrollProgress();
  initBooking();
  initCounters();
  initEasterEgg();
  updateDayCounter();
  runChoreography();
  registerServiceWorker();

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

  // High-poly lamellae spiral — separate chunk so its three.js footprint
  // doesn't block first paint. Lazily instantiated when the hero scrolls
  // into view (saves init cost for direct-deep-link hits to a section).
  const lamellaeCanvas = document.getElementById(
    "lamellae"
  ) as HTMLCanvasElement | null;
  if (lamellaeCanvas) {
    initLamellaeWhenVisible(lamellaeCanvas);
  }
}

/**
 * Lazy-mount the lamellae module the first time the canvas enters the
 * viewport (with a 50px rootMargin so it pre-warms slightly before the
 * user reaches it). Handle is held in module scope so Phase 2's scroll-pin
 * can call setProgress on it.
 */
let lamellaeHandle: import("./hero/lamellae").LamellaeHandle | null = null;

function initLamellaeWhenVisible(canvas: HTMLCanvasElement): void {
  if (!("IntersectionObserver" in window)) {
    void mountLamellae(canvas);
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          obs.disconnect();
          void mountLamellae(canvas);
          return;
        }
      }
    },
    { rootMargin: "50px" }
  );
  obs.observe(canvas);
}

async function mountLamellae(canvas: HTMLCanvasElement): Promise<void> {
  try {
    const { initLamellae } = await import("./hero/lamellae");
    lamellaeHandle = initLamellae(canvas);
    // Phase 2: ScrollTrigger pin will call lamellaeHandle.setProgress.
    // For now, expose on window for debugging.
    (window as unknown as { __lamellae?: typeof lamellaeHandle }).__lamellae =
      lamellaeHandle;
  } catch (err) {
    console.warn("[hero/lamellae] init failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;
  // Resolve sw.js relative to the document so it works under any base path
  // (root-domain deploy and GitHub Pages user-subpath both supported).
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(new URL("sw.js", document.baseURI).toString(), {
        scope: new URL("./", document.baseURI).pathname,
      })
      .catch((err) => console.warn("[sw] register failed:", err));
  });
}
