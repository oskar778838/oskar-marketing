// Magnetic hover for CTAs. Element follows the cursor by up to ±12px,
// proportional to distance from element center, within an activation zone.

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const HAS_FINE_POINTER = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

const STRENGTH = 0.32;
const MAX_TRANSLATE = 14;

export function initMagnetic(): void {
  if (PREFERS_REDUCED_MOTION || !HAS_FINE_POINTER) return;

  const targets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  targets.forEach((el) => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function move(e: PointerEvent): void {
      const rect = el.getBoundingClientRect();
      const cxAbs = rect.left + rect.width / 2;
      const cyAbs = rect.top + rect.height / 2;
      tx = clamp((e.clientX - cxAbs) * STRENGTH, -MAX_TRANSLATE, MAX_TRANSLATE);
      ty = clamp((e.clientY - cyAbs) * STRENGTH, -MAX_TRANSLATE, MAX_TRANSLATE);

      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop(): void {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    }

    function leave(): void {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
  });
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
