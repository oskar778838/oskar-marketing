// oskarmarketing-booking — Cloudflare Worker
//
// Routes:
//   GET  /booked-slots → list of reserved slot keys for the next 30 days
//   POST /             → reserve a slot + send notifications
//   OPTIONS *          → CORS preflight
//
// Storage: KV namespace BOOKINGS, key `slot:<slot_key>`, TTL 30 days.
// Notifications: Resend (email) + Twilio (SMS), parallel via allSettled.

import type {
  BookingRequest,
  BookingResponse,
  Env,
  SlotsResponse,
  StoredBooking,
  SubscribeRequest,
  SubscribeResponse,
} from "./types";
import { handlePreflight, jsonResponse } from "./cors";
import { sendAllNotifications } from "./notify";
import {
  isValidEmail,
  isValidPhone,
  isValidSlotKey,
  sanitizeMessage,
} from "./validate";
import { brevoCreateDoiContact } from "./brevo";

const SLOT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const KV_PREFIX = "slot:";

const HUMAN_FORMAT = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  weekday: "long",
  day: "2-digit",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return handlePreflight(req, env);

    if (req.method === "GET" && url.pathname === "/booked-slots") {
      return handleGetSlots(req, env);
    }

    if (req.method === "POST" && (url.pathname === "/" || url.pathname === "")) {
      return handlePost(req, env);
    }

    if (req.method === "POST" && url.pathname === "/subscribe") {
      return handleSubscribe(req, env);
    }

    return jsonResponse({ ok: false, error: "Not found" }, 404, req, env);
  },
};

// ── POST /subscribe ────────────────────────────────────────
// Body: { email, consent }
// Forwards to Brevo's doubleOptinConfirmation endpoint. Brevo sends the DOI
// email; on click the contact is confirmed + added to BREVO_LIST_ID + the
// browser is redirected to BREVO_REDIRECT_URL.

async function handleSubscribe(req: Request, env: Env): Promise<Response> {
  let payload: Partial<SubscribeRequest>;
  try {
    payload = (await req.json()) as Partial<SubscribeRequest>;
  } catch {
    return subscribeError("Ungültiger Request-Body.", 400, req, env);
  }

  const email = String(payload.email ?? "").trim().toLowerCase();
  const consent = payload.consent === true;

  if (!isValidEmail(email)) {
    return subscribeError("Email ungültig", 400, req, env);
  }
  if (!consent) {
    return subscribeError("Datenschutz-Zustimmung fehlt.", 400, req, env);
  }

  const outcome = await brevoCreateDoiContact(env, email);

  switch (outcome.kind) {
    case "ok": {
      const body: SubscribeResponse = { ok: true };
      return jsonResponse(body, 200, req, env);
    }
    case "disabled": {
      console.warn("[/subscribe] Brevo disabled (list/template id = 0)");
      return subscribeError(
        "Anmeldung gerade nicht möglich. Bitte später erneut versuchen.",
        503,
        req,
        env
      );
    }
    case "invalid": {
      console.warn(
        `[/subscribe] Brevo ${outcome.status}: ${outcome.detail}`
      );
      return subscribeError("Email ungültig", 400, req, env);
    }
    case "rate-limited": {
      return subscribeError("Zu viele Anfragen", 429, req, env);
    }
    case "server-error": {
      console.error(
        `[/subscribe] Brevo ${outcome.status}: ${outcome.detail}`
      );
      return subscribeError("Server-Fehler", 500, req, env);
    }
  }
}

function subscribeError(
  message: string,
  status: number,
  req: Request,
  env: Env
): Response {
  const body: SubscribeResponse = { ok: false, error: message };
  return jsonResponse(body, status, req, env);
}

// ── GET /booked-slots ──────────────────────────────────────

async function handleGetSlots(req: Request, env: Env): Promise<Response> {
  try {
    const list = await env.BOOKINGS.list({ prefix: KV_PREFIX, limit: 200 });
    const slots = list.keys
      .map((k) => k.name.slice(KV_PREFIX.length))
      .filter((k) => isValidSlotKey(k)); // hide expired/past automatically
    const body: SlotsResponse = { ok: true, slots };
    return jsonResponse(body, 200, req, env);
  } catch (err) {
    console.error("[GET /booked-slots]", err);
    // Don't leak — return an empty list so the UI keeps working.
    const body: SlotsResponse = { ok: true, slots: [] };
    return jsonResponse(body, 200, req, env);
  }
}

// ── POST / ─────────────────────────────────────────────────

async function handlePost(req: Request, env: Env): Promise<Response> {
  let payload: Partial<BookingRequest>;
  try {
    payload = (await req.json()) as Partial<BookingRequest>;
  } catch {
    return jsonResponse(
      { ok: false, error: "Ungültiger Request-Body." },
      400,
      req,
      env
    );
  }

  const slotKey = String(payload.slot_key ?? "").trim();
  const email = String(payload.email ?? "").trim().toLowerCase();
  const phone = String(payload.phone ?? "").trim();
  const message = sanitizeMessage(payload.message);
  const consent = payload.consent === true;

  if (!isValidSlotKey(slotKey)) {
    return validation("Ungültiger oder abgelaufener Slot.", req, env);
  }
  if (!isValidEmail(email)) {
    return validation("Ungültige Email-Adresse.", req, env);
  }
  if (!isValidPhone(phone)) {
    return validation("Ungültige Telefonnummer.", req, env);
  }
  if (!consent) {
    return validation("Datenschutz-Zustimmung fehlt.", req, env);
  }

  // Atomic-ish reservation: read first, then write only if absent.
  // KV doesn't have CAS, so under high contention two near-simultaneous
  // requests could both write. Acceptable for a single-creator booking
  // page — the second user gets an apologetic followup.
  const kvKey = `${KV_PREFIX}${slotKey}`;
  const existing = await env.BOOKINGS.get(kvKey);
  if (existing) {
    const body: BookingResponse = {
      ok: false,
      error: "Dieser Slot wurde gerade vergeben.",
    };
    return jsonResponse(body, 409, req, env);
  }

  const stored: StoredBooking = {
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
    status: "reserved",
  };

  try {
    await env.BOOKINGS.put(kvKey, JSON.stringify(stored), {
      expirationTtl: SLOT_TTL_SECONDS,
    });
  } catch (err) {
    console.error("[POST /] KV put failed", err);
    return jsonResponse(
      { ok: false, error: "Speicher-Fehler. Versuche es bitte gleich nochmal." },
      500,
      req,
      env
    );
  }

  const slotHumanBerlin = formatSlotHuman(slotKey);
  const notif = await sendAllNotifications(env, {
    slotKey,
    slotHumanBerlin,
    email,
    phone,
    message,
  });

  console.log(
    `[booking] reserved ${slotKey} for ${email} — notif=${JSON.stringify(notif)}`
  );

  const body: BookingResponse = { ok: true };
  return jsonResponse(body, 200, req, env);
}

function validation(message: string, req: Request, env: Env): Response {
  return jsonResponse({ ok: false, error: message }, 400, req, env);
}

function formatSlotHuman(slotKey: string): string {
  // slotKey is "YYYY-MM-DDTHH:MM" Berlin wall-time; build a Date that maps
  // to the same wall-time in Europe/Berlin and let Intl print it.
  try {
    const wallUtc = new Date(`${slotKey}:00Z`);
    const offsetMin = berlinOffsetMinutes(wallUtc);
    const real = new Date(wallUtc.getTime() - offsetMin * 60_000);
    return HUMAN_FORMAT.format(real);
  } catch {
    return slotKey;
  }
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
