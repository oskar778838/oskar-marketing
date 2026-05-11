// Page-load + scroll choreography. GSAP + ScrollTrigger + SplitType.
// Honors prefers-reduced-motion (skips animations, leaves layout intact).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const EASE_DEFAULT = "power3.out";
const EASE_EMPHASIS = "expo.out";

function splitToChars(selector: string): SplitType[] {
  const els = document.querySelectorAll<HTMLElement>(selector);
  const splits: SplitType[] = [];
  els.forEach((el) => {
    const split = new SplitType(el, { types: "chars", tagName: "span" });
    if (split.chars) {
      split.chars.forEach((c) => c.classList.add("char"));
    }
    splits.push(split);
  });
  return splits;
}

export function runChoreography(): void {
  if (PREFERS_REDUCED_MOTION) {
    // Reveal everything statically, no motion.
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll<HTMLElement>(".hero__name .char").forEach((c) => {
      c.style.opacity = "1";
      c.style.transform = "none";
      c.style.filter = "none";
    });
    document.querySelector(".top-nav")?.classList.add("is-revealed");
    return;
  }

  // Pre-split hero name characters
  splitToChars(".hero__name [data-split]");

  // ── Page-load timeline ─────────────────────────────────────
  const tl = gsap.timeline({ defaults: { ease: EASE_DEFAULT } });

  tl.add(() => {
    document.querySelector(".top-nav")?.classList.add("is-revealed");
  }, 0.4);

  tl.to(
    ".hero__avatar",
    {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: EASE_EMPHASIS,
    },
    0.6
  );

  tl.to(
    ".hero__name .char",
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.95,
      ease: EASE_EMPHASIS,
      stagger: { each: 0.024, from: "start" },
    },
    0.95
  );

  tl.to(
    ".hero__tagline",
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
    },
    1.6
  );

  tl.to(
    ".hero__cta-wrap",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: EASE_EMPHASIS,
    },
    1.85
  );

  tl.to(
    ".hero__scroll",
    {
      opacity: 1,
      duration: 0.6,
    },
    2.1
  );

  // ── Section 01 — Proof ─────────────────────────────────────
  splitToChars(".proof__head-line [data-split]");
  splitToChars(".academy__h [data-split]");
  splitToChars(".end__quote [data-split]");

  ScrollTrigger.create({
    trigger: ".proof",
    start: "top 75%",
    onEnter: () => document.querySelector(".proof")?.classList.add("is-in-view"),
  });

  gsap.from(".proof__head-line .char", {
    scrollTrigger: {
      trigger: ".proof__head-line",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 60,
    opacity: 0,
    filter: "blur(6px)",
    duration: 0.9,
    ease: EASE_EMPHASIS,
    stagger: 0.014,
  });

  gsap.to(".proof__item", {
    scrollTrigger: {
      trigger: ".proof__list",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: (i) => (i === 1 ? 0 : 0),
    duration: 1,
    ease: EASE_EMPHASIS,
    stagger: 0.12,
  });

  // ── Section 02 — Academy ───────────────────────────────────
  gsap.from(".academy__h .char", {
    scrollTrigger: {
      trigger: ".academy__h",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 80,
    opacity: 0,
    filter: "blur(8px)",
    duration: 1,
    ease: EASE_EMPHASIS,
    stagger: 0.018,
  });

  gsap.from(
    [".academy__meta", ".academy .cta--mega", ".academy__trust"],
    {
      scrollTrigger: {
        trigger: ".academy__inner",
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: EASE_EMPHASIS,
      stagger: 0.18,
    }
  );

  // ── Section 03 — Social ────────────────────────────────────
  gsap.from(".social__h", {
    scrollTrigger: {
      trigger: ".social__head",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: EASE_EMPHASIS,
  });

  gsap.from(".social-card", {
    scrollTrigger: {
      trigger: ".social__grid",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 50,
    rotateZ: (i) => (i % 2 === 0 ? -1.5 : 1.5),
    duration: 0.95,
    ease: EASE_EMPHASIS,
    stagger: 0.1,
  });

  // ── Section 04 — End ───────────────────────────────────────
  gsap.from(".end__quote .char", {
    scrollTrigger: {
      trigger: ".end__quote",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    y: 60,
    opacity: 0,
    filter: "blur(8px)",
    duration: 1.1,
    ease: EASE_EMPHASIS,
    stagger: 0.02,
  });

  gsap.from(".end__foot", {
    scrollTrigger: {
      trigger: ".end__foot",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 16,
    duration: 0.7,
  });
}
