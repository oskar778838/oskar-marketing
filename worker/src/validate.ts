// Slot + payload validation. Mirrors the rules in the frontend's config.ts:
// 3 slots/day (10/14/18 Berlin), Mon-Fri only, future-only, 30-day window.

const ALLOWED_HOURS = [10, 14, 18];
const SLOT_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose E.164-ish — at least 8 digits after optional +, allow spaces/dashes.
const PHONE_RE = /^\+?[\d][\d\s\-/]{6,24}$/;

export function isValidSlotKey(key: string): boolean {
  const m = SLOT_RE.exec(key);
  if (!m) return false;
  const [, y, mo, d, h, mi] = m;
  const year = +y;
  const month = +mo;
  const day = +d;
  const hour = +h;
  const minute = +mi;

  if (minute !== 0) return false;
  if (!ALLOWED_HOURS.includes(hour)) return false;
  if (year < 2026 || year > 2030) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Must parse as a real Berlin date, must be Mon-Fri, must be future.
  // We construct the wall-time as if it were UTC, then offset to Berlin.
  const wallUtc = new Date(`${key}:00Z`);
  if (Number.isNaN(wallUtc.getTime())) return false;
  const offsetMin = berlinOffsetMinutes(wallUtc);
  const realUtc = new Date(wallUtc.getTime() - offsetMin * 60_000);

  if (realUtc.getTime() < Date.now()) return false;
  // 30 days max ahead
  if (realUtc.getTime() > Date.now() + 30 * 24 * 3600 * 1000) return false;

  // Mon=1 ... Fri=5
  const wd = berlinWeekday(realUtc);
  return wd >= 1 && wd <= 5;
}

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s) && s.length <= 254;
}

export function isValidPhone(s: string): boolean {
  return PHONE_RE.test(s);
}

function berlinOffsetMinutes(d: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    timeZoneName: "shortOffset",
  });
  const parts = dtf.formatToParts(d);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const m = tz.match(/GMT([+-]\d+)/);
  if (!m) return 60;
  return parseInt(m[1], 10) * 60;
}

function berlinWeekday(d: Date): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
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

/** Truncate + sanitize for a free-text message field. */
export function sanitizeMessage(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").slice(0, 500);
}
