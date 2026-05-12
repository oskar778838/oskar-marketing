// Lenis smooth scroll, bridged to GSAP ScrollTrigger so pinned sections
// stay in sync. Disabled when prefers-reduced-motion.

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export function initSmoothScroll(): Lenis | null {
  if (PREFERS_REDUCED_MOTION) return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // syncTouch:false → kein "smoothing" auf Touch-Devices (iOS Safari). Native
    // momentum scrolling auf iPhone bleibt erhalten, ScrollTrigger.update bekommt
    // trotzdem das pull-from-scroll-Event und Pins funktionieren.
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    lerp: 0.08,
  });

  // ── ScrollTrigger-Bridge ──────────────────────────────────
  // Lenis-Scroll → ScrollTrigger.update bei jedem scroll-Tick.
  // Plus: scrollerProxy registriert Lenis als die "echte" Scroll-Quelle, sodass
  // ScrollTrigger korrekt den Lenis-Wert liest statt nativem window.scrollY.
  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
        return value;
      }
      return window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.documentElement.style.transform ? "transform" : "fixed",
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger after fonts loaded — typography height shifts can
  // change scroll-distances by hundreds of px.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
  }

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
