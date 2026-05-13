// Editorial Hero — char-by-char reveal + scroll-driven letter-spread/word-drift.
// Phase 2: reveal. Phase 3: scrub-only ScrollTrigger (NO pin), Lenis-bridged.
//
// Update (aggressive-fix B): pin removed. The pin felt jarring and broke the
// natural scroll cadence at the top of the page. We keep the letter-spread +
// word-drift animation but drive it through normal page scroll: the hero is in
// the viewport from `top top` until `bottom 20%` of the hero, and the scrub
// runs over that range.

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

  // ── Phase 3: scroll-driven choreography (NO pin) ─────────
  // Hero stays in normal document flow; the letter-spread + word-drift play
  // through scrub as the user scrolls past it. No pinned frames, no layout
  // hijack — premium scroll feel without locking the page.
  setupHeroScroll(hero, oskar, marketing);

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

function setupHeroScroll(
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
    // bottom 20% = animation finishes when 80% of the hero has scrolled out.
    // No pin, no pinSpacing — normal document flow continues into Status Quo.
    end: "bottom 20%",
    scrub: 1.5,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;

      // Letter-spread runs through the whole range, accelerating: -0.02em → +0.15em
      // ────────────────────────────────────────────────────────────────────
      // Phase B (0.40–0.70): Words split — Oskar -80px left, Marketing +80px right
      // Phase C (0.70–0.85): y:-40px, opacity 1 → 0.4
      // Phase D (0.85–1.00): full exit, opacity → 0
      const spread = p;                                         // 0..1
      const segB = clamp01((p - 0.40) / 0.30);
      const segC = clamp01((p - 0.70) / 0.15);
      const segD = clamp01((p - 0.85) / 0.15);

      // letter-spacing: oskar -0.02em → +0.15em ; marketing +0.01em → +0.15em
      const oskarLS = -0.02 + spread * 0.17;
      const marketingLS = 0.01 + spread * 0.14;

      // y/opacity: 80% → -40px + 0.4 opacity, 100% → off-screen + 0 opacity
      const yMid = -segC * 40;
      const yLate = -segD * 280;                                // full viewport exit
      const oMid = 1 - segC * 0.6;                              // 1 → 0.4
      const oLate = 1 - segD * 1.0;                             // 0.4 → 0

      if (oskar) {
        gsap.set(oskar, {
          letterSpacing: oskarLS + "em",
          x: -segB * 80,
          y: yMid + yLate,
          opacity: oMid * oLate,
        });
      }
      if (marketing) {
        gsap.set(marketing, {
          letterSpacing: marketingLS + "em",
          x: segB * 80,
          y: yMid + yLate,
          opacity: oMid * oLate,
        });
      }
      if (tagline) gsap.set(tagline, { y: -segD * 80, opacity: 1 - segD });
      if (cta) gsap.set(cta, { y: -segD * 80, opacity: 1 - segD });
      if (scroll) gsap.set(scroll, { opacity: 1 - clamp01(p * 4) });

      // Expose hero scroll progress so the aurora background can intensify
      // (0.6 → 1.0 mid-hero → fade back). background.ts reads window.__heroP.
      (window as unknown as { __heroP?: number }).__heroP = p;
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
