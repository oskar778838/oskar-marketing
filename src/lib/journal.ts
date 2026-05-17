// Tag-N Journal — horizontal scroll-snap centerpiece.
//
// Responsibilities:
//   1. Render JOURNAL[] entries into the rail (.journal__track).
//   2. Drag-to-scroll with pointer events + light inertia.
//   3. Keyboard nav (← / →) with snap-to-card.
//   4. IntersectionObserver fade-in per card on enter.
//   5. Auto-snap to today's entry on first section enter.
//   6. Drive the shader's uJournalHue uniform from scroll progress,
//      visually linking the journal scrub to the background plasma —
//      this is the Awwwards moment.
//   7. Update .journal__progress-fill width to match scroll progress.

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JOURNAL, currentJournalIndex } from "../data/journal";
import { getBuildDay } from "../config";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Exposed for background.ts to read (set via window so we don't create
// a circular import; the shader is lazy-loaded after journal init).
interface AuroraGlobal {
  __auroraUniforms?: { uJournalHue: { value: number } };
}

export function initJournal(): void {
  const section = document.querySelector<HTMLElement>(".journal");
  if (!section) return;

  const rail = section.querySelector<HTMLElement>("[data-journal-rail]");
  const track = section.querySelector<HTMLElement>("[data-journal-track]");
  const progressFill = section.querySelector<HTMLElement>(
    "[data-journal-progress-fill]"
  );
  if (!rail || !track) return;

  renderCards(track);
  bindReveal(track);
  bindKeyboard(rail);
  bindDrag(rail);
  bindScroll(rail, progressFill);

  // Auto-snap to today's entry once layout has settled.
  requestAnimationFrame(() => {
    const idx = currentJournalIndex(getBuildDay());
    snapToIndex(rail, idx, false);
  });
}

function renderCards(track: HTMLElement): void {
  const today = getBuildDay();
  const liveIdx = currentJournalIndex(today);
  const cards = JOURNAL.map((entry, i) => {
    const isLive = i === liveIdx;
    const dayLabel = String(entry.day).padStart(2, "0");
    const dateLabel = formatDate(entry.date);
    const metricsHtml = (entry.metrics ?? [])
      .map(
        (m) => `
          <li class="journal-card__metric">
            <span class="journal-card__metric-value">${escapeHtml(m.value)}</span>
            <span class="journal-card__metric-label">${escapeHtml(m.label)}</span>
          </li>
        `
      )
      .join("");
    return `
      <li class="journal-card${isLive ? " journal-card--live" : ""}" data-journal-card data-day="${entry.day}">
        <header class="journal-card__head">
          <span class="journal-card__day">${dayLabel}</span>
          <span class="journal-card__date">${dateLabel}</span>
        </header>
        <p class="journal-card__title">${escapeHtml(entry.title)}</p>
        <p class="journal-card__lesson">${escapeHtml(entry.lesson)}</p>
        ${metricsHtml ? `<ul class="journal-card__metrics" role="list">${metricsHtml}</ul>` : ""}
      </li>
    `;
  }).join("");

  // Trailing "in Arbeit" ghost card hints at continuity.
  const ghost = `
    <li class="journal-card journal-card--ghost" aria-hidden="true">
      <p class="journal-card__placeholder">→ Tag ${today + 1} … in Arbeit.</p>
    </li>
  `;

  track.innerHTML = cards + ghost;
}

function bindReveal(track: HTMLElement): void {
  if (PREFERS_REDUCED_MOTION) {
    track
      .querySelectorAll<HTMLElement>("[data-journal-card]")
      .forEach((el) => el.classList.add("is-revealed"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    track
      .querySelectorAll<HTMLElement>(".journal-card")
      .forEach((el) => el.classList.add("is-revealed"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      }
    },
    { root: track.parentElement, threshold: 0.25 }
  );
  track
    .querySelectorAll<HTMLElement>(".journal-card")
    .forEach((el) => obs.observe(el));
}

function bindKeyboard(rail: HTMLElement): void {
  rail.addEventListener("keydown", (ev) => {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    ev.preventDefault();
    const cards = Array.from(
      rail.querySelectorAll<HTMLElement>(".journal-card")
    );
    if (!cards.length) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cards.forEach((c, i) => {
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    const next =
      ev.key === "ArrowRight"
        ? Math.min(cards.length - 1, nearest + 1)
        : Math.max(0, nearest - 1);
    snapToIndex(rail, next, true);
  });
}

function bindDrag(rail: HTMLElement): void {
  // Pointer-event drag with light inertia. Touch devices use native
  // scroll-snap (this only kicks in for pointerType === "mouse").
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let velocity = 0;
  let lastX = 0;
  let lastT = 0;
  let raf = 0;

  rail.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType !== "mouse") return;
    isDown = true;
    startX = ev.clientX;
    lastX = ev.clientX;
    lastT = performance.now();
    startScroll = rail.scrollLeft;
    velocity = 0;
    rail.classList.add("is-dragging");
    rail.setPointerCapture(ev.pointerId);
    cancelAnimationFrame(raf);
  });

  rail.addEventListener("pointermove", (ev) => {
    if (!isDown) return;
    const dx = ev.clientX - startX;
    rail.scrollLeft = startScroll - dx;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      velocity = (ev.clientX - lastX) / dt; // px/ms
    }
    lastX = ev.clientX;
    lastT = now;
  });

  const release = (ev: PointerEvent): void => {
    if (!isDown) return;
    isDown = false;
    rail.classList.remove("is-dragging");
    try {
      rail.releasePointerCapture(ev.pointerId);
    } catch {
      /* no-op */
    }
    // Apply inertia for ~400ms with friction.
    let v = velocity * 16; // scale to per-frame at 60fps
    const friction = 0.92;
    const tick = (): void => {
      if (Math.abs(v) < 0.3) {
        snapToNearest(rail);
        return;
      }
      rail.scrollLeft -= v;
      v *= friction;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  rail.addEventListener("pointerup", release);
  rail.addEventListener("pointercancel", release);
  rail.addEventListener("pointerleave", (ev) => {
    if (isDown) release(ev);
  });
}

function bindScroll(
  rail: HTMLElement,
  progressFill: HTMLElement | null
): void {
  const update = (): void => {
    const max = rail.scrollWidth - rail.clientWidth;
    const p = max > 0 ? rail.scrollLeft / max : 0;
    if (progressFill) {
      progressFill.style.width = `${(p * 100).toFixed(2)}%`;
    }
    const aurora = (window as unknown as AuroraGlobal).__auroraUniforms;
    if (aurora) aurora.uJournalHue.value = p;
  };
  rail.addEventListener("scroll", update, { passive: true });
  update();
}

function snapToIndex(
  rail: HTMLElement,
  idx: number,
  smooth: boolean
): void {
  const cards = rail.querySelectorAll<HTMLElement>(".journal-card");
  const target = cards[idx];
  if (!target) return;
  const left = target.offsetLeft + target.offsetWidth / 2 - rail.clientWidth / 2;
  rail.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
}

function snapToNearest(rail: HTMLElement): void {
  const cards = Array.from(
    rail.querySelectorAll<HTMLElement>(".journal-card")
  );
  if (!cards.length) return;
  const center = rail.scrollLeft + rail.clientWidth / 2;
  let nearest = 0;
  let best = Infinity;
  cards.forEach((c, i) => {
    const mid = c.offsetLeft + c.offsetWidth / 2;
    const dist = Math.abs(mid - center);
    if (dist < best) {
      best = dist;
      nearest = i;
    }
  });
  snapToIndex(rail, nearest, true);
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Touch ScrollTrigger import so it stays in the bundle; the file is
// imported by main.ts but the actual ScrollTrigger animation may be
// added later. Reference is enough to prevent tree-shaking drop.
void ScrollTrigger;
