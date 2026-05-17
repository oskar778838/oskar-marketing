// Qualifying gate that intercepts the Cal.eu embed.
//
// 3-question form gates the calendar. The friction itself is the value:
// it filters tire-kickers and commits serious leads to a 90-day goal
// statement before they see a slot. Answers persist in localStorage so
// returning visitors skip the gate for 7 days.
//
// Why not POST to the Brevo Worker?
//   The existing /subscribe endpoint expects {email, consent} for the
//   playbook DOI list and would reject the gate's payload. Wiring a new
//   Worker route is out of scope for the brand-pivot ship — the gate
//   currently keeps answers client-side. Oskar references them in the
//   Cal-booking follow-up email (the user typed them, they remember).

const STORAGE_KEY = "oskar-booking-gate";
const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

interface GateAnswers {
  stage: string;
  time: string;
  goal: string;
  savedAt: number;
}

export function initBookingGate(): void {
  const stage = document.querySelector<HTMLElement>("[data-booking-stage]");
  const gate = document.querySelector<HTMLElement>("[data-booking-gate]");
  const calendar = document.querySelector<HTMLElement>("[data-booking-calendar]");
  if (!stage || !gate || !calendar) return;

  // Returning visitor with fresh saved answers — skip gate.
  if (hasFreshAnswers()) {
    revealCalendar(gate, calendar, /* animated */ false);
    return;
  }

  const form = gate.querySelector<HTMLFormElement>("[data-booking-gate-form]");
  if (!form) return;

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const answers: GateAnswers = {
      stage: String(data.get("stage") ?? ""),
      time: String(data.get("time") ?? ""),
      goal: String(data.get("goal") ?? "").trim(),
      savedAt: Date.now(),
    };
    saveAnswers(answers);
    revealCalendar(gate, calendar, /* animated */ true);
  });
}

function hasFreshAnswers(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw) as GateAnswers;
    if (!obj?.savedAt) return false;
    return Date.now() - obj.savedAt < STORAGE_TTL_MS;
  } catch {
    return false;
  }
}

function saveAnswers(answers: GateAnswers): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* private mode / quota — gate still reveals, just won't persist */
  }
}

function revealCalendar(
  gate: HTMLElement,
  calendar: HTMLElement,
  animated: boolean
): void {
  if (!animated || PREFERS_REDUCED_MOTION) {
    gate.hidden = true;
    calendar.hidden = false;
    focusFirstCalSlot(calendar);
    return;
  }

  gate.style.transition = "opacity 320ms var(--ease-default), transform 320ms var(--ease-default)";
  gate.style.opacity = "0";
  gate.style.transform = "translateY(-12px)";

  window.setTimeout(() => {
    gate.hidden = true;
    calendar.hidden = false;
    calendar.style.opacity = "0";
    calendar.style.transform = "translateY(12px)";
    // Force reflow so the transition catches.
    void calendar.offsetWidth;
    calendar.style.transition = "opacity 420ms var(--ease-emphasis), transform 420ms var(--ease-emphasis)";
    calendar.style.opacity = "1";
    calendar.style.transform = "translateY(0)";
    focusFirstCalSlot(calendar);
  }, 320);
}

function focusFirstCalSlot(calendar: HTMLElement): void {
  // Cal injects its iframe asynchronously — wait a tick and focus into it
  // so keyboard users land in the calendar rather than the dismissed gate.
  window.setTimeout(() => {
    const iframe = calendar.querySelector<HTMLIFrameElement>("iframe");
    if (iframe) iframe.focus();
  }, 600);
}
