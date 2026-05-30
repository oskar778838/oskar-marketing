// oskarmarketing-booking — Cloudflare Worker
//
// Routes:
//   POST /subscribe → Brevo double-opt-in newsletter/playbook subscribe
//   OPTIONS *       → CORS preflight
//
// The legacy custom booking flow (POST / slot reservation, GET /booked-slots,
// the BOOKINGS KV namespace, and Resend/Twilio notifications) was removed once
// bookings moved to the Cal.eu inline embed. See git history (notify.ts and the
// handlePost/handleGetSlots handlers) if it ever needs reviving.

import type { Env, SubscribeRequest, SubscribeResponse } from "./types";
import { handlePreflight, jsonResponse } from "./cors";
import { isValidEmail } from "./validate";
import { brevoCreateDoiContact } from "./brevo";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return handlePreflight(req, env);

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
      console.warn(`[/subscribe] Brevo ${outcome.status}: ${outcome.detail}`);
      return subscribeError("Email ungültig", 400, req, env);
    }
    case "rate-limited": {
      return subscribeError("Zu viele Anfragen", 429, req, env);
    }
    case "server-error": {
      console.error(`[/subscribe] Brevo ${outcome.status}: ${outcome.detail}`);
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
