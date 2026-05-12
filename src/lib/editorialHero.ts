// Editorial Hero — char-by-char reveal + entry animations for the meta blocks.
// Phase 2: reveal. Phase 3 will add ScrollTrigger pin choreography on top.

import gsap from "gsap";
import SplitType from "split-type";
import type Lenis from "lenis";

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

  return {
    refresh: () => {
      oskarSplit?.revert();
      marketingSplit?.revert();
      if (oskar) oskarSplit = new SplitType(oskar, { types: "chars" });
      if (marketing) marketingSplit = new SplitType(marketing, { types: "chars" });
    },
  };
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
