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
  gsap.set(".hero--editorial .hero__cta-wrap", { opacity: 0, y: 12 });
  gsap.set(".hero--editorial .hero__scroll", { opacity: 0 });
  gsap.set(".hero--editorial .hero__pivot-eyebrow", { opacity: 0, y: -6 });
  gsap.set(".hero--editorial .hero__pivot-text", { opacity: 0, y: 16 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

  // 0.0: noise overlay fades up (still subtle)
  // 0.2: meta-tl + meta-tr stagger
  tl.to(".hero--editorial .hero__meta", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
  }, 0.0);

  // 0.3: pivot eyebrow — announces TAG-N before the H1 reveal so the
  // viewer reads the "TAG · / BRAND PIVOTED" frame before the brand
  // name lands.
  tl.to(".hero--editorial .hero__pivot-eyebrow", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  }, 0.3);

  // 0.6: cta + scroll
  tl.to(".hero--editorial .hero__cta-wrap", { opacity: 1, y: 0, duration: 0.7 }, 0.6)
    .to(".hero--editorial .hero__scroll", { opacity: 1, duration: 0.6 }, 0.8);

  // 2.4: pivot subhead + note — lands after the H1 char-stagger completes
  // (Marketing finishes ~2.2s in). Quiet entrance, the H1 stays the focal
  // point. pointer-events flips back on once visible so links/copy are
  // selectable.
  tl.to(".hero--editorial .hero__pivot-text", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power2.out",
    onStart: () => {
      const t = document.querySelector<HTMLElement>(".hero--editorial .hero__pivot-text");
      if (t) t.style.pointerEvents = "auto";
    },
  }, 2.4);

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
  const cta = hero.querySelector<HTMLElement>(".hero__cta-wrap");
  const scroll = hero.querySelector<HTMLElement>(".hero__scroll");

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    // bottom top = animation completes exactly when the bottom of the hero
    // reaches the top of the viewport (i.e. hero is fully scrolled past).
    // After that the page scrolls normally into Status Quo with no lingering
    // scroll-bound transforms on the hero typography.
    end: "bottom top",
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
  // Pivot subhead must be interactive even in reduced-motion (CSS sets
  // pointer-events: none until the GSAP onStart hook flips it).
  const pivotText = hero.querySelector<HTMLElement>(".hero__pivot-text");
  if (pivotText) pivotText.style.pointerEvents = "auto";
}

