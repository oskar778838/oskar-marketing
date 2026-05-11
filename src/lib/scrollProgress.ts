// Scroll progress indicator: thin gold bar at top, fills L→R as you scroll.
// 1 rAF read per frame, debounced via the browser's natural scroll event throttle.

export function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>(".scroll-progress__bar");
  if (!bar) return;

  let ticking = false;

  function update(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    if (bar) bar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initial paint + after-load recalc (in case images shift the layout)
  update();
  window.addEventListener("load", update, { once: true });
}
