import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/cursor.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/booking.css";
import "./styles/journal.css";

import { getBuildDay } from "./config";
import { initCursor } from "./lib/cursor";
import { initMagnetic } from "./lib/magnetic";
import { initSmoothScroll } from "./lib/smoothScroll";
import { runChoreography } from "./lib/choreography";
import { initScrollProgress } from "./lib/scrollProgress";
import { initPlaybookForm } from "./lib/playbookForm";
import { initCounters } from "./lib/counters";
import { initProofStrip } from "./lib/proofStrip";
import { initJournal } from "./lib/journal";
import { initBookingGate } from "./lib/bookingGate";
import { initCalLoaders } from "./lib/calEmbed";
import { initEasterEgg, updateDayCounter } from "./lib/easter-egg";
import { initEditorialHero } from "./lib/editorialHero";
import { initSectionIndicator } from "./lib/sectionIndicator";
import { initNavMenu } from "./lib/navMenu";
import type Lenis from "lenis";

// Init order matters: cursor + smooth scroll first (cheap), then choreography
// (which uses ScrollTrigger and needs the DOM measured), then async WebGL.

let lenisInstance: Lenis | null = null;

function boot(): void {
  initCursor();
  lenisInstance = initSmoothScroll();
  initMagnetic();
  initScrollProgress();
  initBookingGate();
  initCalLoaders();
  initPlaybookForm();
  initCounters();
  initProofStrip();
  initJournal();
  initEasterEgg();
  updateDayCounter();
  writePivotDayCopy();
  initEditorialHero(lenisInstance);
  initSectionIndicator();
  initNavMenu(lenisInstance);
  runChoreography();
  registerServiceWorker();

  // WebGL hero background (Aurora): lazy import, never blocks first paint.
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

// Pivot eyebrow + any other [data-pivot-day] consumer gets the live Tag-N
// value derived from PROJECT_START_DATE. Single source of truth — never
// hard-code a Tag value in markup.
function writePivotDayCopy(): void {
  const tag = getBuildDay();
  document.querySelectorAll<HTMLElement>("[data-pivot-day]").forEach((el) => {
    el.textContent = `— TAG ${tag} / BRAND PIVOTED —`;
  });
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
