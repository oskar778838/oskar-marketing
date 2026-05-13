// Booking-API configuration.
//
// PATH C PIVOT: Wir nutzen Web3Forms statt eigenem Cloudflare-Worker.
// Web3Forms ist eine Form-Submission-API ohne Account-Setup-Hürde —
// einmal Email registrieren, Access-Key bekommen, fertig.
//
// MORGENDLICHER 2-MIN-STEP (siehe docs/MORNING-STEPS.md):
//   1. https://web3forms.com öffnen
//   2. Email opheck@gmx.de eintragen → Access-Key per Mail bekommen
//   3. Hier WEB3FORMS_ACCESS_KEY den echten Key statt PLACEHOLDER
//   4. git push → live
//
// Solange der Placeholder drinsteht, blendet die UI eine subtile
// Warnung ein, dass Booking noch nicht final scharf ist (mailto-Fallback).

export const WEB3FORMS_ACCESS_KEY = "PLACEHOLDER_PASTE_WEB3FORMS_KEY_HERE";
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_RECIPIENT = "opheck@gmx.de";
export const WEB3FORMS_PLACEHOLDER_PREFIX = "PLACEHOLDER";

/** Legacy — bleibt für Backward-Compat, aber null. */
export const BOOKING_API_URL: string | null = null;

// Slot generation rules (kept on the client so the UI is responsive even
// when offline). The backend re-validates that a chosen slot matches one
// of these candidates.
//
// Werktag-Slots: Oskar ist Schüler, Schule bis ~13:00 — daher Werktags nur
// nachmittags/abends. Wochenende: zusätzlich Vormittag offen.
export const SLOT_HOURS_WEEKDAY: readonly number[] = [14, 19];
export const SLOT_HOURS_WEEKEND: readonly number[] = [10, 14, 19];
/** Legacy export kept for any code still importing it. */
export const SLOT_HOURS_BERLIN: readonly number[] = SLOT_HOURS_WEEKDAY;
export const SLOT_DURATION_MIN = 30;
/** Days shown in the slot grid — counted as calendar days (Mon-Sun) ahead.
 *  Previously this was Mon-Fri only; now includes weekends with different
 *  hour-sets so users see a full week. */
export const DAYS_AHEAD = 7;
/** Legacy alias. */
export const WORKDAYS_AHEAD = DAYS_AHEAD;
export const TZ_BERLIN = "Europe/Berlin";

// UX tunables
export const SUCCESS_RESET_MS = 8000;
export const MAX_MESSAGE_CHARS = 500;
