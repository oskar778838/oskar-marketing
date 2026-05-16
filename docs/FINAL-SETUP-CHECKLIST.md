# Final Setup Checklist — Email-Funnel scharfschalten

Frontend ist live verdrahtet (`SUBSCRIBE_API_URL` → Worker `/subscribe`).
Worker ist deployed, antwortet aber aktuell mit `503 disabled` weil
`BREVO_DOI_TEMPLATE_ID="0"` in `worker/wrangler.toml`. Diese Checklist
schaltet den Funnel scharf.

**Gesamtdauer:** ca. 25–30 Min (5 + 2 + 15 + 3 Min).

---

## A) Brevo DOI Template anlegen — ca. 5 Min

1. Brevo Dashboard → **Campaigns** → **Email** → **Templates** → **+ New template**.
2. **Template type:** *Transactional* (NICHT *Marketing*).
3. **Template name (intern):** `DOI Confirmation Affiliate`.
4. **Subject:** `Bitte bestätige deine Anmeldung für das Playbook`.
5. **From name:** `Oskar Marketing`.
6. **From email:** `opheck@gmx.de` (muss vorher als Sender verifiziert sein —
   Brevo *Senders & IP* → *+ Add a sender*).
7. **Reply-to:** `opheck@gmx.de`.
8. **Editor:** *Code your own* → *Paste your code*.
9. Inhalt aus [`docs/brevo-doi-template.html`](./brevo-doi-template.html)
   1:1 reinkopieren. **Wichtig:** der Platzhalter

   ```
   {{ params.DOUBLE_OPT-IN }}
   ```

   bleibt 1:1 stehen — Brevo ersetzt ihn beim Versand mit dem signierten
   Bestätigungs-Link.
10. **Save & Activate.**
11. **Template-ID notieren** — steht in der URL (`/template/<ID>/edit`,
    z. B. `42`).

---

## B) Worker mit Template-ID aktivieren — ca. 2 Min

```bash
cd worker
```

1. `wrangler.toml` öffnen.
2. Zeile finden:
   ```toml
   BREVO_DOI_TEMPLATE_ID = "0"
   ```
3. `"0"` durch die echte ID aus Schritt A.11 ersetzen, z. B.:
   ```toml
   BREVO_DOI_TEMPLATE_ID = "42"
   ```
4. Falls noch nicht passiert: Brevo-API-Key als Secret setzen
   (Brevo → *SMTP & API* → *API keys* → *Generate*):
   ```bash
   npx wrangler secret put BREVO_API_KEY
   ```
5. Deployen:
   ```bash
   npx wrangler deploy
   ```
6. Smoke-Test:
   ```bash
   bash scripts/post-deploy-check.sh https://oskarmarketing-booking.opheck.workers.dev
   ```
   Erwartung: `[3/3] POST /subscribe` → status `200`. (Falls noch `503`:
   Template-ID falsch oder `BREVO_API_KEY` nicht gesetzt.)

---

## C) Brevo Automation (3-Mail-Sequenz) — ca. 15 Min

1. Brevo → **Automations** → **+ Create a new automation** → **From scratch**.
2. Name: `Playbook 3-Mail-Sequence`.
3. **Trigger:** *A contact is added to a list* → `Affiliate Funnel` (List-ID **3**).
   Feuert nach DOI-Bestätigung — vor dem Klick passiert nichts.
4. **Step 1 — Send email:**
   - Subject + Body aus [`docs/email-sequence/mail-1.md`](./email-sequence/mail-1.md).
   - Sender: dein verifizierter Sender.
5. **Step 2 — Wait:** `2 days`.
6. **Step 3 — Send email:** Inhalt aus [`mail-2.md`](./email-sequence/mail-2.md).
7. **Step 4 — Wait:** `3 days` (T+5 ab Confirmation).
8. **Step 5 — Send email:** Inhalt aus [`mail-3.md`](./email-sequence/mail-3.md).
9. **Save → Activate.**

---

## D) End-to-End-Test — ca. 3 Min

1. Browser öffnen: <https://oskar778838.github.io/oskar-marketing/>
2. Zur Playbook-Capture-Section scrollen.
3. Eigene Email (am besten zweites Postfach) eintragen.
4. Consent-Checkbox setzen → submit.
5. Erwartung: UI zeigt **"Check deine Inbox. Das Playbook ist unterwegs."**
6. Inbox prüfen: **DOI-Confirmation-Mail** in ≤2 Min (Absender: *Oskar Marketing*).
7. Bestätigungs-Button klicken → Redirect auf `playbook.html?confirmed=1`.
8. **Mail 1** trifft innerhalb 1–2 Min ein (Welcome + Playbook-Link).
9. Brevo Dashboard → **Contacts** → Liste *Affiliate Funnel*: dein Eintrag
   mit Status *Confirmed* sichtbar.
10. Brevo → **Automations** → laufender Contact im Step-Indikator.

Mail 2 (+2 Tage) und Mail 3 (+5 Tage) lassen sich nicht beschleunigen
ohne die Wait-Steps in der Automation kurzzeitig umzuschrauben.

---

## Troubleshooting

| Symptom | Ursache | Fix |
|---|---|---|
| Form-Submit zeigt "Email ungültig" trotz valider Mail | Brevo `400` weiter unten — meist `templateId` invalid | Schritt B.3 prüfen, Template-Type *Transactional* |
| Form zeigt "Anmeldung gerade nicht möglich" | Worker antwortet `503 disabled` | `BREVO_DOI_TEMPLATE_ID` ist noch `"0"` oder `BREVO_API_KEY` fehlt |
| DOI-Mail kommt nicht | Sender nicht verifiziert | Brevo *Senders* → verifizieren |
| 401 in `wrangler tail`-Output | `BREVO_API_KEY` falsch oder gerollt | `npx wrangler secret put BREVO_API_KEY` |
| 429 unter Last | Brevo Free 10 req/s | Backoff oder Plan upgraden |

Live-Logs: `cd worker && npx wrangler tail`.

---

## Going-Live-Confirmation

Sobald D.9 grün ist, ist der Funnel scharf. Falls du wiederum die
Sender-Mail wechselst (z. B. auf `hi@oskarmarketing.de` nach Custom-Domain),
in Brevo neuen Sender verifizieren, Template-`From`-Adresse anpassen,
nichts am Worker ändern.
