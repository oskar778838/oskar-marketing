// Editorial Hero — char-by-char reveal + scrubbed scroll-pin choreography.
// Phase 2: reveal. Phase 3: ScrollTrigger pin (Lenis-bridged in smoothScroll.ts).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export interface EditorialHeroHandle {
  /** Refresh after layout changes (e.g. window resize) */
  refresh: () => void;
}

let mounted = false;

export function initEditorialHero(_lenis: Lenis | null): EditorialHeroHandle | null {
  if (mounted) return null;
  const hero = document.querySelector<HTMLElement>(".hero--editorial");
  if (!hero) return null;
  mounted = true;

  // Animated day-counter token
  fillDayCounter(hero);

  if (PREFERS_REDUCED_MOTION) {
    // Reduced-motion: render everything to final state immediately.
    settleStaticReveal(hero);
    return { refresh: () => {} };
  }

  const oskar = hero.querySelector<HTMLElement>(".hero__word--oskar");
  const marketing = hero.querySelector<HTMLElement>(".hero__word--marketing");

  let oskarSplit: SplitType | null = null;
  let marketingSplit: SplitType | null = null;

  if (oskar) oskarSplit = new SplitType(oskar, { types: "chars" });
  if (marketing) marketingSplit = new SplitType(marketing, { types: "chars" });

  // Initial state: meta blocks hidden; chars hidden (CSS handles)
  gsap.set(".hero--editorial .hero__meta", { opacity: 0, y: -8 });
  gsap.set(".hero--editorial .hero__tagline", { opacity: 0, y: 8 });
  gsap.set(".hero--editorial .hero__cta-wrap", { opacity: 0, y: 12 });
  gsap.set(".hero--editorial .hero__scroll", { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

  // 0.0: noise overlay fades up (still subtle)
  // 0.2: meta-tl + meta-tr stagger
  tl.to(".hero--editorial .hero__meta", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
  }, 0.0);

  // 0.6: tagline + cta + scroll
  tl.to(".hero--editorial .hero__tagline", { opacity: 1, y: 0, duration: 0.7 }, 0.5)
    .to(".hero--editorial .hero__cta-wrap", { opacity: 1, y: 0, duration: 0.7 }, 0.6)
    .to(".hero--editorial .hero__scroll", { opacity: 1, duration: 0.6 }, 0.8);

  // 1.2: Oskar char-by-char (60ms stagger, 1.2s duration each)
  if (oskarSplit?.chars) {
    tl.to(
      oskarSplit.chars,
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.06,
      },
      1.0,
    );
  }

  // 1.8: Marketing char-by-char
  if (marketingSplit?.chars) {
    tl.to(
      marketingSplit.chars,
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.06,
      },
      1.6,
    );
  }

  // ── Phase 3: scroll-pin + scrubbed choreography ─────────
  // Hero stays fixed for 150% scroll-distance while the choreography plays
  // through 4 progress-phases. After that, normal flow continues to Status Quo.
  setupHeroPin(hero, oskar, marketing);

  return {
    refresh: () => {
      oskarSplit?.revert();
      marketingSplit?.revert();
      if (oskar) oskarSplit = new SplitType(oskar, { types: "chars" });
      if (marketing) marketingSplit = new SplitType(marketing, { types: "chars" });
      ScrollTrigger.refresh();
    },
  };
}

function setupHeroPin(
  hero: HTMLElement,
  oskar: HTMLElement | null,
  marketing: HTMLElement | null,
): void {
  const tagline = hero.querySelector<HTMLElement>(".hero__tagline");
  const cta = hero.querySelector<HTMLElement>(".hero__cta-wrap");
  const scroll = hero.querySelector<HTMLElement>(".hero__scroll");

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=150%",
    pin: hero,
    pinSpacing: true,
    scrub: 1.2,
    invalidateOnRefresh: true,
    // anticipatePin pre-warms the pin one frame before it hits — kills the
    // 1-frame jump on iOS Safari that used to happen when the user reached
    // the trigger from a fast scroll.
    anticipatePin: 1,
    onUpdate: (self) => {
      const p = self.progress;

      // Phase A (0.00–0.30): Tighten/loosen letter-spacing
      // Phase B (0.30–0.60): Parallax — Oskar drifts left, Marketing drifts right
      // Phase C (0.60–0.85): Shrink + fade
      // Phase D (0.85–1.00): Tagline + CTA exit up
      const segA = clamp01((p - 0.00) / 0.30);
      const segB = clamp01((p - 0.30) / 0.30);
      const segC = clamp01((p - 0.60) / 0.25);
      const segD = clamp01((p - 0.85) / 0.15);

      if (oskar) {
        gsap.set(oskar, {
          letterSpacing: (-0.02 + segA * 0.04) + "em",
          x: -segB * 100,
          scale: 1 - segC * 0.2,
          opacity: 1 - segC * 0.7,
        });
      }
      if (marketing) {
        gsap.set(marketing, {
          letterSpacing: (0.01 + segA * 0.05) + "em",
          x: segB * 100,
          scale: 1 - segC * 0.2,
          opacity: 1 - segC * 0.7,
        });
      }
      if (tagline) gsap.set(tagline, { y: -segD * 80, opacity: 1 - segD });
      if (cta) gsap.set(cta, { y: -segD * 80, opacity: 1 - segD });
      if (scroll) gsap.set(scroll, { opacity: 1 - clamp01(p * 4) });
    },
  });
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function settleStaticReveal(hero: HTMLElement): void {
  // For reduced-motion: ensure final state.
  const allRevealed = hero.querySelectorAll<HTMLElement>("[data-reveal]");
  allRevealed.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  hero.querySelectorAll<HTMLElement>(".hero__word .char").forEach((c) => {
    c.style.transform = "none";
    c.style.opacity = "1";
    c.style.filter = "none";
  });
}

/**
 * Replaces "TAG —" with "TAG NNN" based on a fixed start-date
 * (29.04.2026 = day 1 of Build-in-Public). Keeps the format constant width.
 */
function fillDayCounter(hero: HTMLElement): void {
  const el = hero.querySelector<HTMLElement>("[data-day-counter]");
  if (!el) return;
  const START = new Date(Date.UTC(2026, 3, 29)); // 29.04.2026 = day 1
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const days = Math.max(1, Math.round((today.getTime() - START.getTime()) / 86_400_000) + 1);
  el.textContent = `TAG ${days.toString().padStart(3, "0")}`;
}
