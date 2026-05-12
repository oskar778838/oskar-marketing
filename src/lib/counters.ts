// Animated counters for the Status Quo section. Triggered by GSAP
// ScrollTrigger when each [data-counter] element enters the viewport;
// runs once, then leaves the final value in the DOM.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

interface CounterEl extends HTMLElement {
  dataset: DOMStringMap & { target?: string; format?: string; counter?: string };
}

export function initCounters(): void {
  const els = document.querySelectorAll<CounterEl>("[data-counter]");
  if (!els.length) return;

  els.forEach((el, i) => {
    const target = parseInt(el.dataset.target ?? "0", 10);
    const format = el.dataset.format === "comma";

    if (PREFERS_REDUCED_MOTION) {
      // Skip animation, write final value immediately.
      el.textContent = formatValue(target, format);
      return;
    }

    // Initial state: zero, but width-stable via tabular-nums in CSS.
    el.textContent = "0";

    const tween = { v: 0 };
    const tweenInstance = gsap.to(tween, {
      v: target,
      duration: 1.4,
      delay: i * 0.15,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = formatValue(Math.floor(tween.v), format);
      },
      onComplete: () => {
        // Final exact value — Math.floor can leave us 1 short.
        el.textContent = formatValue(target, format);
      },
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => tweenInstance.play(),
    });
  });
}

function formatValue(n: number, withComma: boolean): string {
  if (!withComma) return String(n);
  // German thousands separator (period) per the brand voice.
  return n.toLocaleString("de-DE");
}
