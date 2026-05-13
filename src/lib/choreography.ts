// Page-load + scroll choreography. GSAP + ScrollTrigger + SplitType.
// Honors prefers-reduced-motion (skips animations, leaves layout intact).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dismissLoader, isFirstVisit } from "./loader";

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const EASE_DEFAULT = "power3.out";
const EASE_EMPHASIS = "expo.out";

// Repeat visitors get a compressed sequence — overall ratio 0.42 of the
// first-visit timeline. They don't need to be re-onboarded every time.
const TIMING_SCALE = isFirstVisit() ? 1.0 : 0.42;
const TS = (s: number) => s * TIMING_SCALE;

// Manual word + char split. Replaces SplitType because v0.3.4 produced
// inconsistent word-wrappers across browsers, leaving chars free to break
// across lines mid-word ("Tag    f / ür"). Manual is deterministic:
// each word becomes a `.word` span (display:inline-block, white-space:nowrap),
// each char inside is a `.char` span (display:inline-block) for animation.
// Spaces between words are preserved as text nodes so the line wraps
// at word boundaries only.
function splitToChars(selector: string): void {
  const els = document.querySelectorAll<HTMLElement>(selector);
  els.forEach((el) => {
    const text = el.textContent ?? "";
    if (!text.trim()) return;
    // split keeping the whitespace runs as separate tokens
    const tokens = text.split(/(\s+)/);
    const html = tokens
      .map((tok) => {
        if (tok.length === 0) return "";
        if (/^\s+$/.test(tok)) return tok; // preserve original whitespace
        const chars = Array.from(tok)
          .map((c) => `<span class="char">${escapeChar(c)}</span>`)
          .join("");
        return `<span class="word">${chars}</span>`;
      })
      .join("");
    el.innerHTML = html;
  });
}

function escapeChar(c: string): string {
  if (c === "&") return "&amp;";
  if (c === "<") return "&lt;";
  if (c === ">") return "&gt;";
  if (c === '"') return "&quot;";
  if (c === "'") return "&#39;";
  return c;
}

// Words-only splitter — wraps each token in <span class="word"> with a
// data-dir attribute for per-word direction reveals (manifest pattern).
function splitToWords(selector: string): void {
  const els = document.querySelectorAll<HTMLElement>(selector);
  const dirs = ["left", "right", "up", "down"] as const;
  let cursor = 0;
  els.forEach((el) => {
    const text = el.textContent ?? "";
    if (!text.trim()) return;
    const tokens = text.split(/(\s+)/);
    const html = tokens
      .map((tok) => {
        if (tok.length === 0) return "";
        if (/^\s+$/.test(tok)) return tok;
        const dir = dirs[cursor++ % dirs.length];
        return `<span class="word" data-dir="${dir}">${tok
          .split("")
          .map((c) => escapeChar(c))
          .join("")}</span>`;
      })
      .join("");
    el.innerHTML = html;
  });
}

export function runChoreography(): void {
  if (PREFERS_REDUCED_MOTION) {
    // Reveal everything statically, no motion.
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll<HTMLElement>(".hero__word .char").forEach((c) => {
      c.style.opacity = "1";
      c.style.transform = "none";
      c.style.filter = "none";
    });
    document.querySelector(".top-nav")?.classList.add("is-revealed");
    dismissLoader();
    return;
  }

  // Hero reveal + scroll-pin are owned by editorialHero.ts (Phase 2+3).
  // Choreography here only handles loader dismiss + top-nav reveal +
  // subsequent section choreography. Avoids double-animating the hero.

  const tl = gsap.timeline({ defaults: { ease: EASE_DEFAULT } });
  tl.add(() => dismissLoader(0), 0);
  tl.add(() => {
    document.querySelector(".top-nav")?.classList.add("is-revealed");
  }, TS(0.4));

  void tl; // hero reveal + char-stagger handled by editorialHero.ts now

  // ── Section 01 — Status Quo ────────────────────────────────
  splitToChars(".status__h [data-split]");

  gsap.from(".status__h .char", {
    scrollTrigger: {
      trigger: ".status__h",
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

  gsap.from(".stat", {
    scrollTrigger: {
      trigger: ".status__grid",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 32,
    duration: 0.85,
    ease: EASE_EMPHASIS,
    stagger: 0.12,
  });

  // ── Section 02 — Proof ─────────────────────────────────────
  splitToChars(".proof__head-line [data-split]");
  splitToChars(".academy__h [data-split]");
  splitToWords(".end__quote [data-split]");

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

  gsap.from(".academy__lead", {
    scrollTrigger: {
      trigger: ".academy__head",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 16,
    duration: 0.7,
    delay: 0.3,
  });

  gsap.from(".academy__tracks .track", {
    scrollTrigger: {
      trigger: ".academy__tracks",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 40,
    duration: 0.95,
    ease: EASE_EMPHASIS,
    stagger: 0.14,
  });

  gsap.from(".academy__trust", {
    scrollTrigger: {
      trigger: ".academy__trust",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 12,
    duration: 0.7,
  });

  // ── Section 03 — Termin (Booking) ──────────────────────────
  splitToChars(".termin__h [data-split]");

  gsap.from(".termin__h .char", {
    scrollTrigger: {
      trigger: ".termin__h",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 60,
    opacity: 0,
    filter: "blur(6px)",
    duration: 0.9,
    ease: EASE_EMPHASIS,
    stagger: 0.018,
  });

  gsap.from(".termin__sub", {
    scrollTrigger: {
      trigger: ".termin__sub",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 16,
    duration: 0.7,
    delay: 0.25,
  });

  gsap.from(".booking", {
    scrollTrigger: {
      trigger: ".booking",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 24,
    duration: 0.9,
    ease: EASE_EMPHASIS,
    delay: 0.35,
  });

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

  // ── Section 04 — End / Manifest ────────────────────────────
  // Per-word direction reveal: each word enters from a different side
  // (left, right, up, down — cycled). data-dir set during splitToWords.
  gsap.set(".end__quote .word", {
    opacity: 0,
    filter: "blur(8px)",
    x: (_, el) => {
      const dir = (el as HTMLElement).dataset.dir;
      return dir === "left" ? -80 : dir === "right" ? 80 : 0;
    },
    y: (_, el) => {
      const dir = (el as HTMLElement).dataset.dir;
      return dir === "up" ? -80 : dir === "down" ? 80 : 0;
    },
  });

  gsap.to(".end__quote .word", {
    scrollTrigger: {
      trigger: ".end__quote",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    x: 0,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.1,
    ease: EASE_EMPHASIS,
    stagger: 0.18,
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
