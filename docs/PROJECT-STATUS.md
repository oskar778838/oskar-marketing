# Project Status — oskarmarketing

Stand: 2026-05-16. Aktualisierung jeweils beim Wechsel einer Phase.

---

## PHASE 1 — Bio-Website &nbsp;✅ DONE

Single-page Vite/TS-Site mit Three.js-Hero, Editorial-Sections, custom
Cursor, magnetischen CTAs, Lenis-Smooth-Scroll.

- **Key files:** `index.html`, `src/main.ts`, `src/lib/*`, `src/styles/*`,
  Tokens in `DESIGN.md`, Strategie in `PRODUCT.md`.
- **Live:** <https://oskar778838.github.io/oskar-marketing/>.
- **Status:** stable. Polish-Passes (emil-design-eng, impeccable) durchgelaufen.
- **Next:** keiner — Iterations bei realen Metriken / Build-in-Public-Updates.

---

## PHASE 2 — Playbook Subpage &nbsp;✅ DONE

Lead-Magnet-Landing-Page (`/playbook.html`) mit 4-Step-Story, premium
Mesh-Gradient-Background, Stat-Diagrammen, Timeline.

- **Key files:** `public/playbook.html`, mesh-bg + step-cards in
  `src/styles/sections.css`.
- **Live:** <https://oskar778838.github.io/oskar-marketing/playbook.html>.
- **Status:** stable, letzter Commit `406c4fe feat: replace step-card
  body text with visual diagrams, stats, compare-chart, timeline`.
- **Next:** keiner.

---

## PHASE 3 — Email-Funnel (Worker + Brevo) &nbsp;🔵 IN PROGRESS

Cloudflare Worker (`oskarmarketing-booking`) mit POST `/subscribe`-Route,
ruft Brevo `doubleOptinConfirmation` auf. Frontend ist verdrahtet
(`SUBSCRIBE_API_URL` zeigt auf Worker), Worker antwortet derzeit
`503 disabled` weil `BREVO_DOI_TEMPLATE_ID="0"`.

- **Key files:** `worker/src/worker.ts` (handleSubscribe), `worker/src/brevo.ts`,
  `worker/wrangler.toml`, `src/lib/playbookForm.ts`, `src/config.ts`,
  `docs/BREVO-SETUP.md`, `docs/brevo-doi-template.html`,
  `docs/email-sequence/mail-{1,2,3}.md`.
- **Worker:** <https://oskarmarketing-booking.opheck.workers.dev>
- **Status:** Code complete + deployed, Funnel-Wiring **manuell ausstehend**.
- **Next:** [`docs/FINAL-SETUP-CHECKLIST.md`](./FINAL-SETUP-CHECKLIST.md)
  durchgehen (4 Blöcke, ~25–30 Min):
  1. DOI-Template in Brevo anlegen
  2. Template-ID in `wrangler.toml` + redeploy
  3. Brevo-Automation (3 Mails) verdrahten
  4. E2E-Test mit eigener Mail

---

## PHASE 4 — Calendar (Cal.com Embed für Pro-Sales) &nbsp;⏳ NOT STARTED

Geplant: nach erstem qualifizierten Lead aus dem Funnel eine
Cal.com-Embed-Sektion auf der Bio-Site (oder Playbook-Subpage)
freischalten, damit Pro-Sales-Calls direkt buchbar sind.

- **Key files (geplant):** neue Section in `index.html` oder `playbook.html`,
  Cal.com `<iframe>` mit verifiziertem Event-Type, optional Worker-Webhook
  für Notify-on-Booking.
- **Status:** nicht begonnen. Existing booking infra im Worker
  (`POST /` + KV `BOOKINGS`) ist Custom-Build und wird durch Cal.com
  voraussichtlich ersetzt — die Notify-Logik (`worker/src/notify.ts`,
  Resend + Twilio) bleibt aber wiederverwendbar als Cal.com-Webhook-Sink.
- **Next:** Trigger = erster Sales-qualifizierter Lead. Bis dahin keine
  Arbeit nötig.

---

## PHASE 5 — Operations Agents (Content / Funnel / Tech) &nbsp;⏳ NOT STARTED

Drei Operations-Prompts/Agents (siehe `agents/`-Ordner + Plan in
`notes/master-plan-approved.md`):

- **Content-Agent:** Captions + Posts ohne Hashtags, Brand-Voice-konform,
  forbidden-words-frei.
- **Funnel-Agent:** Lead-Scoring + Mail-Sequence-Tuning auf Basis Brevo-Stats.
- **Tech-Agent:** Worker-Maintenance, Dependency-Bumps, Performance-Audits.

- **Key files:** `agents/` (Specs liegen dort, Implementierung steht aus).
- **Status:** nicht begonnen.
- **Next:** sobald Phase 3 live ist und erste Datenpunkte fließen, in
  der Reihenfolge Content → Funnel → Tech aufsetzen.

---

## PHASE 6 — Custom Domain &nbsp;⏸️ DEFERRED

`oskarmarketing.de` als Apex + CNAME auf GitHub Pages, Worker hinter
`api.oskarmarketing.de`. Lohnt sich erst nach erster Revenue (deutsche
Domain ist eh günstig, aber DNS + SSL-Setup verbraucht Stunde, die
besser in Funnel-Optimierung fließt).

- **Key files:** `CNAME` (anzulegen), Cloudflare Worker custom domain
  binding, Brevo-Sender-Domain-Auth (SPF + DKIM).
- **Status:** deferred bis Phase 3 erste Revenue produziert.
- **Trigger:** erste 500€ Affiliate-Commission durch.

---

## Aktuelle Cursor-Position

```
PHASE 3 → Block A (DOI-Template in Brevo anlegen)
```

Genaue Schritte stehen in [`docs/FINAL-SETUP-CHECKLIST.md`](./FINAL-SETUP-CHECKLIST.md).
