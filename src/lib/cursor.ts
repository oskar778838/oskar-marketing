// Custom cursor: gold dot + lagging ring. Desktop / fine-pointer only.
// On touch / coarse-pointer devices it auto-disables (CSS handles display:none too).

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const HAS_FINE_POINTER = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

export function initCursor(): void {
  if (!HAS_FINE_POINTER) return;

  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  const dot = cursor.querySelector<HTMLElement>(".cursor__dot")!;
  const ring = cursor.querySelector<HTMLElement>(".cursor__ring")!;
  const html = document.documentElement;
  html.classList.add("has-custom-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  // Trail lerps. Reduced-motion = snap to mouse exactly.
  const dotLerp = PREFERS_REDUCED_MOTION ? 1 : 0.5;
  const ringLerp = PREFERS_REDUCED_MOTION ? 1 : 0.18;

  window.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  // Spotlight: subtle radial gradient (~400px, 10% gold) follows cursor.
  // Drives a body::after layer via CSS custom properties.
  html.classList.add("has-spotlight");

  function tick(): void {
    dotX += (mouseX - dotX) * dotLerp;
    dotY += (mouseY - dotY) * dotLerp;
    ringX += (mouseX - ringX) * ringLerp;
    ringY += (mouseY - ringY) * ringLerp;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    // Spotlight uses the slower-lerping ring position so the glow trails
    // slightly behind the dot — feels more atmospheric than 1:1 tracking.
    document.body.style.setProperty("--spot-x", `${ringX}px`);
    document.body.style.setProperty("--spot-y", `${ringY}px`);

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Hover state when over interactive elements
  const hoverTargets = document.querySelectorAll<HTMLElement>(
    "[data-cursor-hover], a, button"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("pointerenter", () =>
      html.classList.add("cursor-hover")
    );
    el.addEventListener("pointerleave", () =>
      html.classList.remove("cursor-hover")
    );
  });

  // Hide cursor when leaving viewport
  document.addEventListener("pointerleave", () => {
    cursor.style.opacity = "0";
  });
  document.addEventListener("pointerenter", () => {
    cursor.style.opacity = "1";
  });
}
