// Outgoing notifications: Email via Resend, SMS via Twilio.
// All three calls run via Promise.allSettled so a single provider failure
// doesn't kill the booking — partial success is logged but the user still
// gets an OK response.

import type { Env } from "./types";

interface NotifyArgs {
  slotKey: string;
  slotHumanBerlin: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendAllNotifications(
  env: Env,
  args: NotifyArgs
): Promise<{ ownerEmail: boolean; ownerSms: boolean; visitorEmail: boolean }> {
  const tasks = [
    sendOwnerEmail(env, args),
    env.SMS_ENABLED === "true"
      ? sendOwnerSms(env, args)
      : Promise.resolve("sms-disabled" as const),
    sendVisitorEmail(env, args),
  ];

  const [r1, r2, r3] = await Promise.allSettled(tasks);
  if (r1.status === "rejected") console.error("[notify] owner email:", r1.reason);
  if (r2.status === "rejected") console.error("[notify] owner sms:", r2.reason);
  if (r3.status === "rejected") console.error("[notify] visitor email:", r3.reason);

  return {
    ownerEmail: r1.status === "fulfilled",
    ownerSms: r2.status === "fulfilled",
    visitorEmail: r3.status === "fulfilled",
  };
}

// ── Resend (Email) ─────────────────────────────────────────

interface ResendBody {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text: string;
}

async function resendSend(env: Env, body: ResendBody): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${t.slice(0, 300)}`);
  }
}

function sendOwnerEmail(env: Env, args: NotifyArgs): Promise<void> {
  const subject = `Neuer Termin · ${args.slotHumanBerlin}`;
  const text = [
    "Neuer Termin gebucht",
    "",
    `Termin: ${args.slotHumanBerlin}`,
    `Email:  ${args.email}`,
    `Phone:  ${args.phone}`,
    args.message ? `Nachricht:\n${args.message}` : "(keine Nachricht)",
    "",
    `Slot-Key: ${args.slotKey}`,
  ].join("\n");
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
      <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px;">Neuer Termin gebucht</p>
      <p><strong>Termin:</strong> ${escapeHtml(args.slotHumanBerlin)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeAttr(args.email)}">${escapeHtml(args.email)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeAttr(args.phone)}">${escapeHtml(args.phone)}</a></p>
      ${
        args.message
          ? `<p><strong>Nachricht:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;">${escapeHtml(args.message)}</pre>`
          : `<p style="color:#666;">(keine Nachricht)</p>`
      }
      <hr style="margin:24px 0;border:0;border-top:1px solid #eee;">
      <p style="font-size:12px;color:#888;">Slot-Key: ${escapeHtml(args.slotKey)}</p>
    </div>
  `;
  return resendSend(env, {
    from: env.RESEND_FROM,
    to: [env.NOTIFY_EMAIL],
    reply_to: args.email,
    subject,
    html,
    text,
  });
}

function sendVisitorEmail(env: Env, args: NotifyArgs): Promise<void> {
  const subject = `Termin bestätigt · ${args.slotHumanBerlin}`;
  const text = [
    `Hi,`,
    ``,
    `dein Termin steht: ${args.slotHumanBerlin} (Europe/Berlin).`,
    ``,
    `Du bekommst kurz vorher noch einen Call-Link / Telefon-Hinweis von mir.`,
    `Wenn etwas dazwischen kommt, antworte einfach auf diese Mail.`,
    ``,
    `Bis dann,`,
    `Oskar`,
    ``,
    `--`,
    `oskarmarketing`,
    `https://oskarmarketing.de/`,
  ].join("\n");
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
      <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px;">Termin bestätigt</p>
      <p>Hi,</p>
      <p>dein Termin steht: <strong>${escapeHtml(args.slotHumanBerlin)}</strong> (Europe/Berlin).</p>
      <p>Du bekommst kurz vorher noch einen Call-Link / Telefon-Hinweis von mir.
         Wenn etwas dazwischen kommt, antworte einfach auf diese Mail.</p>
      <p>Bis dann,<br>Oskar</p>
      <hr style="margin:24px 0;border:0;border-top:1px solid #eee;">
      <p style="font-size:12px;color:#888;">oskarmarketing · <a href="https://oskarmarketing.de/" style="color:#888;">Bio</a></p>
    </div>
  `;
  return resendSend(env, {
    from: env.RESEND_FROM,
    to: [args.email],
    reply_to: env.NOTIFY_EMAIL,
    subject,
    html,
    text,
  });
}

// ── Twilio (SMS) ───────────────────────────────────────────

async function sendOwnerSms(env: Env, args: NotifyArgs): Promise<void> {
  const body = [
    `Neuer Termin ${args.slotHumanBerlin}`,
    `${args.email}`,
    `${args.phone}`,
  ].join(" · ");

  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(env.TWILIO_ACCOUNT_SID)}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

  const form = new URLSearchParams();
  form.set("To", env.NOTIFY_PHONE);
  form.set("From", env.TWILIO_FROM);
  form.set("Body", body.slice(0, 320));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Twilio ${res.status}: ${t.slice(0, 300)}`);
  }
}

// ── helpers ────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
