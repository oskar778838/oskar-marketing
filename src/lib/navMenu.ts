// Dropdown navigation menu — open/close, ESC + outside-click handling,
// scroll-to-section via Lenis, active-section highlight via IntersectionObserver.
//
// HTML contract:
//   - #nav-trigger (button with aria-expanded)
//   - #nav-dropdown  [hidden] + .is-open class
//   - .nav-dropdown__item[data-nav-target="<sectionId>"]
//
// Lenis (smoothScroll.ts) already intercepts in-page hash links for smooth-scroll.
// We only need to close the menu before the click bubbles through.

import type Lenis from "lenis";

const SECTION_IDS = ["hero", "status", "proof", "academy", "termin", "social", "end"] as const;

let bound = false;

export function initNavMenu(lenis: Lenis | null): void {
  if (bound) return;
  const trigger = document.getElementById("nav-trigger") as HTMLButtonElement | null;
  const dropdown = document.getElementById("nav-dropdown") as HTMLElement | null;
  if (!trigger || !dropdown) return;
  bound = true;

  const setOpen = (open: boolean): void => {
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      dropdown.hidden = false;
      // double-rAF so the [hidden] removal commits before the transition class
      requestAnimationFrame(() => requestAnimationFrame(() => dropdown.classList.add("is-open")));
      trigger.setAttribute("aria-label", "Navigation schließen");
    } else {
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-label", "Navigation öffnen");
      // wait for transition before hiding (matches CSS 320ms)
      window.setTimeout(() => {
        if (!dropdown.classList.contains("is-open")) dropdown.hidden = true;
      }, 340);
    }
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    setOpen(!expanded);
  });

  // Outside click
  document.addEventListener("click", (e) => {
    if (trigger.getAttribute("aria-expanded") !== "true") return;
    const target = e.target as Node;
    if (dropdown.contains(target) || trigger.contains(target)) return;
    setOpen(false);
  });

  // Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      trigger.focus();
    }
  });

  // Item click — close + scroll. Lenis-anchor handler intercepts hash links
  // already; we just need to close the menu. Use lenis.scrollTo if available
  // so the menu's close-animation and the scroll start in the same frame.
  dropdown.querySelectorAll<HTMLAnchorElement>(".nav-dropdown__item").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.dataset.navTarget;
      if (id && lenis) {
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 2.0 });
        }
      }
      setOpen(false);
    });
  });

  // Active section highlight — Intersection Observer driven.
  // Item with the largest visible ratio gets .is-active.
  if ("IntersectionObserver" in window) {
    const items = new Map<string, HTMLElement>();
    dropdown.querySelectorAll<HTMLElement>(".nav-dropdown__item").forEach((el) => {
      const id = el.dataset.navTarget;
      if (id) items.set(id, el);
    });
    const ratios = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          const id = (ent.target as HTMLElement).id;
          ratios.set(id, ent.isIntersecting ? ent.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestR = -1;
        for (const id of SECTION_IDS) {
          const r = ratios.get(id) ?? 0;
          if (r > bestR) { bestR = r; best = id; }
        }
        items.forEach((el, id) => el.classList.toggle("is-active", id === best));
      },
      { threshold: [0, 0.25, 0.5, 0.75] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }
}
