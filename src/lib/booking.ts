// Booking section client. Vanilla DOM, no framework.
//
// Lifecycle: loading → (slots | notice) → form → (success | error)
// State machine driven by `data-state` on the booking root and `[hidden]`
// on each `[data-step]` child.

import {
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
  WEB3FORMS_RECIPIENT,
  WEB3FORMS_PLACEHOLDER_PREFIX,
  SLOT_HOURS_BERLIN,
  TZ_BERLIN,
  WORKDAYS_AHEAD,
  SUCCESS_RESET_MS,
  MAX_MESSAGE_CHARS,
} from "../config";

const RESERVATION_TTL_MS = 24 * 60 * 60 * 1000;
const RESERVATION_KEY = "oskar-booked-slots";

const isPlaceholderKey = WEB3FORMS_ACCESS_KEY.startsWith(WEB3FORMS_PLACEHOLDER_PREFIX);

interface Slot {
  /** ISO Z timestamp, e.g. "2026-05-13T08:00:00.000Z" (10:00 Berlin) */
  iso: string;
  /** Display key Berlin time: "2026-05-13T10:00" — used as the booked-slot key */
  key: string;
  /** Human label "10:00" */
  label: string;
}

interface DayBlock {
  date: Date;
  /** "Mo", "Di" etc. */
  weekday: string;
  /** "12.05" */
  short: string;
  slots: Slot[];
}

interface BookingResponse {
  ok: boolean;
  error?: string;
}

const CONFIRMATION_FORMAT = new Intl.DateTimeFormat("de-DE", {
  timeZone: TZ_BERLIN,
  weekday: "long",
  day: "2-digit",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

const WEEKDAY_SHORT_FORMAT = new Intl.DateTimeFormat("de-DE", {
  timeZone: TZ_BERLIN,
  weekday: "short",
});

const DATE_SHORT_FORMAT = new Intl.DateTimeFormat("de-DE", {
  timeZone: TZ_BERLIN,
  day: "2-digit",
  month: "2-digit",
});

export function initBooking(): void {
  const root = document.getElementById("booking-app");
  if (!root) return;
  void renderSlots(root)
  if (isPlaceholderKey) markPlaceholderState(root)
}

function markPlaceholderState(root: HTMLElement): void {
  // Add a subtle banner in the booking root that signals "noch nicht final
  // scharf". Avoids hiding the whole UI; user can still see the slot grid.
  const banner = document.createElement("div")
  banner.className = "booking__placeholder-note t-mono"
  banner.setAttribute("role", "status")
  banner.style.cssText = "margin: 0 0 12px; padding: 10px 14px; border:1px solid rgba(201,168,76,.35); border-radius: 8px; background: rgba(201,168,76,.06); font-size: 12px; color: var(--gold-warm); letter-spacing: .08em;"
  banner.textContent = "Booking-API noch nicht aktiviert. Submit funktioniert nicht — bitte direkt opheck@gmx.de schreiben."
  root.prepend(banner)
}

// ── State helpers ──────────────────────────────────────────

function setState(
  root: HTMLElement,
  state: "loading" | "slots" | "form" | "success" | "notice"
): void {
  root.dataset.state = state;
  root.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
    el.hidden = el.dataset.step !== state;
  });
}

// ── Slot generation (client-side, validated by worker) ─────

function generateDays(): DayBlock[] {
  const days: DayBlock[] = [];
  const cursor = new Date();
  let added = 0;

  // Walk forward from today, picking only Mon-Fri, until we have N weekdays.
  while (added < WORKDAYS_AHEAD) {
    cursor.setDate(cursor.getDate() + (added === 0 ? 0 : 1));
    const dayOfWeek = berlinDayOfWeek(cursor);
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      days.push(buildDayBlock(cursor));
      added++;
      if (added < WORKDAYS_AHEAD) continue;
    } else if (added === 0) {
      // Today is weekend — don't count it but advance.
      continue;
    }
  }
  return days;
}

function berlinDayOfWeek(d: Date): number {
  // 1 = Mon, 7 = Sun (ISO).
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_BERLIN,
    weekday: "short",
  }).format(d);
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return map[wd] ?? 0;
}

function buildDayBlock(date: Date): DayBlock {
  const slots: Slot[] = SLOT_HOURS_BERLIN.map((h) => buildSlot(date, h));
  return {
    date: new Date(date),
    weekday: WEEKDAY_SHORT_FORMAT.format(date).replace(".", ""),
    short: DATE_SHORT_FORMAT.format(date).replace(/\./g, "."),
    slots,
  };
}

function buildSlot(date: Date, hourBerlin: number): Slot {
  // Build a Date that represents `hourBerlin:00` Europe/Berlin on that day.
  // Using formatToParts to compute the correct UTC offset for that wall-time.
  const yyyy = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_BERLIN,
    year: "numeric",
  }).format(date);
  const mm = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_BERLIN,
    month: "2-digit",
  }).format(date);
  const dd = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_BERLIN,
    day: "2-digit",
  }).format(date);

  const key = `${yyyy}-${mm}-${dd}T${String(hourBerlin).padStart(2, "0")}:00`;
  // Approx ISO — for display/transmission only; backend re-validates.
  // Build the wall-time as if it were UTC, then offset by Berlin's offset.
  const wallTimeUTC = new Date(`${key}:00Z`);
  const offsetMin = berlinOffsetMinutes(wallTimeUTC);
  const iso = new Date(wallTimeUTC.getTime() - offsetMin * 60_000).toISOString();
  return { iso, key, label: `${String(hourBerlin).padStart(2, "0")}:00` };
}

function berlinOffsetMinutes(d: Date): number {
  // +60 in winter (CET), +120 in summer (CEST).
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_BERLIN,
    timeZoneName: "shortOffset",
  });
  const parts = dtf.formatToParts(d);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  // tz looks like "GMT+2" or "GMT+1"
  const m = tz.match(/GMT([+-]\d+)/);
  if (!m) return 60;
  return parseInt(m[1], 10) * 60;
}

// ── Rendering ──────────────────────────────────────────────

async function renderSlots(root: HTMLElement): Promise<void> {
  const grid = root.querySelector<HTMLElement>("#slot-grid");
  if (!grid) return;

  const days = generateDays();
  const blocked = await fetchBookedSlots();

  grid.innerHTML = days
    .map(
      (day) => `
        <div class="slot-day" role="listitem">
          <header class="slot-day__head">
            <span class="slot-day__weekday t-mono-gold">${day.weekday}</span>
            <span class="slot-day__date t-mono">${day.short}</span>
          </header>
          <div class="slot-day__slots">
            ${day.slots
              .map((slot) => {
                const isBlocked = blocked.has(slot.key);
                const isPast = new Date(slot.iso).getTime() < Date.now();
                const disabled = isBlocked || isPast;
                return `<button
                  type="button"
                  class="slot${disabled ? " slot--blocked" : ""}"
                  data-slot-key="${slot.key}"
                  data-slot-iso="${slot.iso}"
                  data-cursor-hover
                  ${disabled ? "disabled aria-disabled=\"true\"" : ""}
                  ${disabled ? "" : "data-magnetic"}
                >${slot.label}</button>`;
              })
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  bindSlotClicks(root);
  bindFormHandlers(root);
  setState(root, "slots");
}

function bindSlotClicks(root: HTMLElement): void {
  const grid = root.querySelector<HTMLElement>("#slot-grid");
  if (!grid) return;
  grid.addEventListener("click", (ev) => {
    const target = (ev.target as HTMLElement).closest<HTMLButtonElement>(".slot");
    if (!target || target.disabled) return;

    grid
      .querySelectorAll<HTMLElement>(".slot--selected")
      .forEach((el) => el.classList.remove("slot--selected"));
    target.classList.add("slot--selected");

    const key = target.dataset.slotKey ?? "";
    const iso = target.dataset.slotIso ?? "";
    const chosen = root.querySelector<HTMLElement>("#chosen-slot");
    if (chosen) {
      chosen.textContent = formatSlotForHumans(iso);
    }
    const form = root.querySelector<HTMLFormElement>("[data-step=\"form\"]");
    if (form) {
      let hidden = form.querySelector<HTMLInputElement>(
        "input[name=\"slot_key\"]"
      );
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "slot_key";
        form.appendChild(hidden);
      }
      hidden.value = key;
    }

    setState(root, "form");
  });
}

function bindFormHandlers(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>("[data-step=\"form\"]");
  if (!form) return;

  // Back to slots
  form
    .querySelector<HTMLButtonElement>("[data-action=\"back-to-slots\"]")
    ?.addEventListener("click", () => setState(root, "slots"));

  // Message char counter
  const message = form.querySelector<HTMLTextAreaElement>("#bk-message");
  const counter = form.querySelector<HTMLElement>(
    '[data-counter-for="bk-message"]'
  );
  if (message && counter) {
    message.addEventListener("input", () => {
      counter.textContent = `${message.value.length} / ${MAX_MESSAGE_CHARS}`;
    });
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    void submitBooking(root, form);
  });
}

function formatSlotForHumans(iso: string): string {
  try {
    return CONFIRMATION_FORMAT.format(new Date(iso));
  } catch {
    return iso;
  }
}

// ── Client-side slot reservation (LocalStorage) ─────────────
//
// Web3Forms is a fire-and-forget submission service — kein echtes Backend
// das Slots blockieren kann. Pragmatischer Kompromiss: jeder Browser merkt
// sich seine eigenen Submissions 24h lang lokal. Oskar koordiniert
// Doppelbuchungen manuell aus seiner Inbox (sieht beide).
//
// Format: { [slotKey: string]: { reservedAt: number } }

async function fetchBookedSlots(): Promise<Set<string>> {
  try {
    const raw = localStorage.getItem(RESERVATION_KEY);
    if (!raw) return new Set();
    const obj = JSON.parse(raw) as Record<string, { reservedAt: number }>;
    const now = Date.now();
    const live = new Set<string>();
    let changed = false;
    for (const [key, val] of Object.entries(obj)) {
      if (now - val.reservedAt < RESERVATION_TTL_MS) {
        live.add(key);
      } else {
        delete obj[key];
        changed = true;
      }
    }
    if (changed) localStorage.setItem(RESERVATION_KEY, JSON.stringify(obj));
    return live;
  } catch {
    return new Set();
  }
}

function markSlotReserved(slotKey: string): void {
  try {
    const raw = localStorage.getItem(RESERVATION_KEY);
    const obj = (raw ? JSON.parse(raw) : {}) as Record<string, { reservedAt: number }>;
    obj[slotKey] = { reservedAt: Date.now() };
    localStorage.setItem(RESERVATION_KEY, JSON.stringify(obj));
  } catch {
    // ignore — best-effort
  }
}

async function submitBooking(
  root: HTMLElement,
  form: HTMLFormElement
): Promise<void> {
  const errorEl = form.querySelector<HTMLElement>("[data-error]");
  if (errorEl) {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  // Native validation — bail with focus on first invalid field.
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const consent = (data.get("consent") as string | null) === "on";
  if (!consent) {
    showError(form, "Bitte stimme der Datenverarbeitung zu.");
    return;
  }

  const submit = form.querySelector<HTMLButtonElement>("button[type=\"submit\"]");
  const labelSpan = submit?.querySelector<HTMLElement>(".cta__label");
  if (submit) submit.disabled = true;
  if (labelSpan) labelSpan.textContent = "Sende …";

  const slotKey = String(data.get("slot_key") ?? "");
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  // Wenn der Access-Key noch Placeholder ist: nur lokal markieren + Fehler
  // mit klarer Direkt-Mail-CTA. Kein Web-Request, damit Web3Forms keinen
  // 'Invalid Key'-Error sieht und Oskar's Inbox spammt.
  if (isPlaceholderKey) {
    showError(
      form,
      "Booking ist morgen früh aktiv (Access-Key fehlt noch). Schreib mir direkt: opheck@gmx.de",
    );
    restoreSubmit(submit, labelSpan);
    console.warn("[booking] WEB3FORMS_ACCESS_KEY is still placeholder");
    return;
  }

  // Web3Forms erwartet flat JSON mit access_key + named fields. Subject + from
  // werden in der Mail-Format für Oskar's Inbox-Filter ('[TERMIN]'-Prefix).
  const slotHuman = formatSlotForHumans(slotKeyToIso(slotKey));
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `[TERMIN] ${slotHuman}`,
    from_name: "Oskar Marketing Bio",
    to: WEB3FORMS_RECIPIENT,
    slot: slotKey,
    slot_human: slotHuman,
    email,
    phone,
    message,
    botcheck: "", // honeypot — Web3Forms default
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as BookingResponse & { success?: boolean; message?: string };
    if (!res.ok || body.success === false) {
      throw new Error(body.message || body.error || `HTTP ${res.status}`);
    }
    // Lokale Slot-Reservation 24h — verhindert dass derselbe Visitor den
    // Slot in Folge nochmal anklickt; doppelte Buchungen zwischen
    // verschiedenen Visitors löst Oskar manuell.
    markSlotReserved(slotKey);
    showSuccess(root);
  } catch (err) {
    showError(
      form,
      "Konnte den Termin gerade nicht senden. Schreib mir bitte direkt: opheck@gmx.de",
    );
    restoreSubmit(submit, labelSpan);
    console.warn("[booking] submit failed:", err);
  }
}

/** Slot-Key "2026-05-13T14:00" → grobes ISO mit Berlin-Zeitannahme.
 *  Nur für die Mail-Subject-Formatierung — exakte Validierung ist nicht nötig
 *  weil der Slot-Key 1:1 reicht (Oskar liest beide Felder). */
function slotKeyToIso(slotKey: string): string {
  return slotKey ? `${slotKey}:00` : "";
}

function showError(form: HTMLFormElement, message: string): void {
  const el = form.querySelector<HTMLElement>("[data-error]");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function restoreSubmit(
  btn: HTMLButtonElement | null | undefined,
  label: HTMLElement | null | undefined
): void {
  if (btn) btn.disabled = false;
  if (label) {
    label.textContent = label.dataset.defaultLabel ?? "Termin bestätigen";
  }
}

function showSuccess(root: HTMLElement): void {
  setState(root, "success");
  window.setTimeout(() => {
    // Reset back to slot selection so the page is re-usable
    setState(root, "slots");
    const form = root.querySelector<HTMLFormElement>("[data-step=\"form\"]");
    form?.reset();
    root
      .querySelectorAll<HTMLElement>(".slot--selected")
      .forEach((el) => el.classList.remove("slot--selected"));
  }, SUCCESS_RESET_MS);
}
