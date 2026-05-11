// Lenis smooth scroll. Disabled when prefers-reduced-motion.

import Lenis from "lenis";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export function initSmoothScroll(): Lenis | null {
  if (PREFERS_REDUCED_MOTION) return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    lerp: 0.08,
  });

  function raf(time: number): void {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor-link integration
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
      }
    });
  });

  return lenis;
}
