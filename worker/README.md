# oskarmarketing-booking — Cloudflare Worker

Tiny worker that handles bookings for the bio-site's `/termin` section.

## Endpoints

- `GET  /booked-slots` → `{ ok: true, slots: ["YYYY-MM-DDTHH:MM", ...] }`
- `POST /`             → body `{ slot_key, email, phone, message?, consent }`,
  returns `{ ok: true }` or `{ ok: false, error }` with 4xx status.

## Storage

KV namespace `BOOKINGS`. Each reservation lives at `slot:<key>` with a
30-day TTL. After that, the entry vanishes and the slot is reusable.

## Notifications (per booking)

Run in parallel via `Promise.allSettled` — partial provider failure does
not break the user-facing flow.

1. **Email to Oskar** (Resend) — full booking details.
2. **SMS to Oskar** (Twilio) — compact `Termin · email · phone`.
3. **Email to visitor** (Resend) — confirmation with the chosen slot.

Toggle SMS off via `SMS_ENABLED = "false"` in `wrangler.toml` if Twilio
trial limits become annoying.

## Setup

See `../docs/MORNING-SETUP.md` for the step-by-step (account creation +
secrets + first deploy). Short version:

```bash
cd worker
npm install
npx wrangler login
npx wrangler kv:namespace create BOOKINGS    # paste returned id into wrangler.toml
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler deploy
```

Then put the deployed URL into `../src/config.ts → BOOKING_API_URL`,
commit, push, and the GitHub Action redeploys the frontend.

## Local dev

```bash
npm run dev   # starts wrangler dev on http://127.0.0.1:8787
```

Use `.dev.vars` for local-only secrets:

```
RESEND_API_KEY=re_xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
```
