// Page-load orchestration — fades out the loader overlay once the boot
// sequence is mounted. Called explicitly from main.ts after init runs.
//
// First-visit detection via localStorage so repeat visitors don't sit
// through the full hero choreography again.

const FIRST_VISIT_KEY = "om:visited";

export function isFirstVisit(): boolean {
  try {
    if (window.localStorage.getItem(FIRST_VISIT_KEY)) return false;
    window.localStorage.setItem(FIRST_VISIT_KEY, String(Date.now()));
    return true;
  } catch {
    // SSR / private mode — treat as first visit, don't crash.
    return true;
  }
}

export function dismissLoader(delayMs = 0): void {
  const loader = document.getElementById("loader");
  if (!loader) return;
  window.setTimeout(() => {
    loader.classList.add("is-leaving");
    // After the CSS transition finishes, fully remove the loader from
    // the layout so it can't catch pointer events even with z-index 200.
    window.setTimeout(() => {
      loader.setAttribute("hidden", "");
    }, 700);
  }, delayMs);
}
