// Section number indicator — small fixed element on the right edge.
// Tracks which section is currently most-in-view via IntersectionObserver
// and updates the visible label. Reads as editorial chapter marker.

interface SectionDef {
  selector: string;
  num: string;
  label: string;
}

const SECTIONS_BIO: SectionDef[] = [
  { selector: "#hero", num: "00", label: "Index" },
  { selector: "#status", num: "01", label: "Status Quo" },
  { selector: "#proof", num: "02", label: "Proof" },
  { selector: "#journal", num: "03", label: "Build in Public" },
  { selector: "#academy", num: "04", label: "Das System" },
  { selector: "#termin", num: "05", label: "Termin" },
  { selector: "#playbook", num: "06", label: "Playbook" },
  { selector: "#social", num: "07", label: "Channels" },
  { selector: "#faq", num: "08", label: "FAQ" },
  { selector: "#end", num: "09", label: "Manifest" },
];

const SECTIONS_PRO: SectionDef[] = [
  { selector: "#hero", num: "00", label: "Index" },
  { selector: "#warum", num: "01", label: "Warum Pro" },
  { selector: "#angebot", num: "02", label: "Angebot" },
  { selector: "#fit", num: "03", label: "Fit-Check" },
  { selector: "#termin", num: "04", label: "Gespräch" },
  { selector: "#end", num: "05", label: "Manifest" },
];

export function initSectionIndicator(): void {
  const indicator = document.getElementById("section-indicator");
  if (!indicator) return;
  if (!("IntersectionObserver" in window)) return;

  // Pick the right section list based on which page we're on.
  const sections = document.querySelector("#warum") ? SECTIONS_PRO : SECTIONS_BIO;

  const numEl = indicator.querySelector<HTMLElement>(".section-indicator__num");
  const labelEl = indicator.querySelector<HTMLElement>(".section-indicator__label");

  const elements = sections
    .map((s) => ({ ...s, el: document.querySelector<HTMLElement>(s.selector) }))
    .filter((s) => s.el);

  if (elements.length === 0) return;

  // Track which sections are visible. Pick the one whose top is closest to
  // the viewport's center (so we report the section the user is actually on).
  const visible = new Map<HTMLElement, number>();

  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.set(
            entry.target as HTMLElement,
            entry.intersectionRatio
          );
        } else {
          visible.delete(entry.target as HTMLElement);
        }
      }
      // Among visible sections, pick the one with the highest intersection
      // ratio. Tie-break: earlier in the array (top of page wins).
      let best: typeof elements[number] | null = null;
      let bestRatio = -1;
      for (const s of elements) {
        if (!s.el) continue;
        const r = visible.get(s.el) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          best = s;
        }
      }
      if (best) {
        if (numEl) numEl.textContent = best.num;
        if (labelEl) labelEl.textContent = best.label;
      }
    },
    {
      // Slight rootMargin so a section "claims" the indicator just before
      // it fully enters from below. Avoids flickering on fast scrolls.
      rootMargin: "-30% 0px -30% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  for (const s of elements) {
    if (s.el) obs.observe(s.el);
  }

  // Reveal the indicator after init (CSS keeps it opacity 0 until then)
  indicator.classList.add("is-ready");
}
