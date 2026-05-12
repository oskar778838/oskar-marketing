// Apple-style scroll pinning for the hero section.
// User scrolls → hero stays fixed for 200% viewport-height worth of scroll
// → 3D spiral animates IN PLACE through 4 stages → after that range, the
// scroll continues normally to Section 01 (Status Quo).
//
// Mounted from main.ts after the lamellae handle is ready.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import type { LamellaeHandle } from "../hero/lamellae";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Mobile uses a less-aggressive pin distance — keeps scrolling responsive,
// users on touch can't easily power-scroll through huge pin ranges.
const HAS_FINE_POINTER = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

export interface HeroPinOptions {
  triggerSelector?: string;
  /** Pin scroll distance as a string GSAP accepts: "+=200%" etc. */
  endDistance?: string;
  /** Scrub lag in seconds — higher = silkier but lazier. */
  scrub?: number;
}

export function initHeroPin(
  lamellae: LamellaeHandle,
  lenis: Lenis | null,
  opts: HeroPinOptions = {}
): ScrollTrigger | null {
  if (PREFERS_REDUCED_MOTION) {
    // Reduced motion: leave the page in normal scroll, drive lamellae
    // progress directly from window.scrollY without any pinning.
    return null;
  }

  const trigger = opts.triggerSelector ?? "#hero";
  const end = opts.endDistance ?? (HAS_FINE_POINTER ? "+=200%" : "+=140%");
  const scrub = opts.scrub ?? (HAS_FINE_POINTER ? 1 : 0.6);

  // Sync Lenis with ScrollTrigger so scrubbed animations stay buttery.
  // Without this, the two scroll loops fight each other and you get
  // micro-judder during fast scrolls.
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end,
    pin: true,
    pinSpacing: true,
    scrub,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      lamellae.setProgress(self.progress);
    },
  });

  return st;
}

/**
 * Reduced-motion fallback: drive lamellae progress directly from page
 * scroll position, no pinning. Used only when ScrollTrigger pin is skipped.
 */
export function initHeroProgressOnly(lamellae: LamellaeHandle): void {
  let raf = 0;
  function update(): void {
    const docH =
      document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? Math.min(1, window.scrollY / (window.innerHeight * 1.5)) : 0;
    lamellae.setProgress(p);
    raf = 0;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
}
