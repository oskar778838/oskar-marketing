# Brevo Setup — Playbook Lead-Funnel (Worker-based)

End-to-end Lead-Funnel über einen eigenen Cloudflare Worker.
Der Worker spricht Brevo's Double-Opt-In-API direkt an — kein hosted Brevo-Form,
keine sibforms-URL, kein no-cors-Workaround.

```
Bio-Site Formular
  → JSON POST  /subscribe  (Cloudflare Worker)
    → POST /v3/contacts/doubleOptinConfirmation  (Brevo API)
      → DOI-Mail an User  (Brevo Template)
        → Klick "Bestätigen"
          → Brevo confirmed contact + added to list 3
            → Redirect zur Playbook-Page
              → Automation "Playbook 3-Mail-Sequence" fires
                → Mail 1 sofort
                → Mail 2 +2 Tage
                → Mail 3 +5 Tage
```

---

## 0. Prerequisites Checklist

- [ ] **Cloudflare Account** (free) — https://dash.cloudflare.com
- [ ] **Brevo Account** (free, 300 Mails/Tag) — https://www.brevo.com
- [ ] **Brevo API-Key** — Brevo Dashboard → *SMTP & API* → *API keys* → *Generate a new API key* → Kopieren
- [ ] **Brevo List "Affiliate Funnel"** existiert und hat **ID = 3**
  (Sidebar → *Contacts* → *Lists*. URL-Segment `/list/3` muss matchen.)
- [ ] **Brevo Sender verifiziert** (siehe Schritt 6 unten)
- [ ] Node 18+ + npm lokal installiert

---

## 1. Worker initial deployen

```bash
cd worker
npm install

npx wrangler login                          # öffnet Browser, Cloudflare-Auth

npx wrangler kv namespace create BOOKINGS
# Output: { binding = "BOOKINGS", id = "abc123..." }
# → ID aus dem Output in wrangler.toml einsetzen
# (Zeile mit id = "REPLACE_AFTER_wrangler_kv_namespace_create" ersetzen)

# Secrets setzen (interaktiver Prompt fragt nach dem Wert):
npx wrangler secret put RESEND_API_KEY      # Resend-Key   (für /booking)
npx wrangler secret put TWILIO_ACCOUNT_SID  # Twilio       (für /booking)
npx wrangler secret put TWILIO_AUTH_TOKEN   # Twilio       (für /booking)
npx wrangler secret put BREVO_API_KEY       # Brevo-Key    (für /subscribe)

npx wrangler deploy
```

Wrangler-Output zeigt die deployed URL, z. B.:

```
Uploaded oskarmarketing-booking
Deployed oskarmarketing-booking
  https://oskarmarketing-booking.<dein-subdomain>.workers.dev
```

**URL kopieren** — wird in Schritt 4 + 5 gebraucht.

---

## 2. Brevo DOI-Template anlegen

Brevo's `doubleOptinConfirmation`-Endpoint braucht eine **Template-ID**,
die auf eine "Transactional"-Vorlage in Brevo zeigt. Diese Vorlage
enthält den Bestätigungs-Button mit der Magic-Link-Variable.

1. Brevo Dashboard → **Campaigns** → **Templates** → **+ New template**.
2. **Template type:** *Transactional* (NICHT *Marketing*).
3. **Template name (intern):** `Playbook DOI Confirmation`.
4. **Subject:** `Bitte bestätige deine Anmeldung`.
5. **From name:** `Oskar Marketing`.
6. **From email:** `opheck@gmx.de` (muss aus Schritt 6 verifiziert sein).
7. **Reply-to:** `opheck@gmx.de`.
8. **Editor:** *Code your own* → *Paste your code*.
9. Inhalt aus [`docs/brevo-doi-template.html`](./brevo-doi-template.html)
   1:1 reinkopieren. Wichtig ist der Platzhalter:

   ```
   {{ params.DOUBLE_OPT-IN }}
   ```

   Brevo ersetzt das **automatisch** durch den signierten Bestätigungs-Link.
   Der Bindestrich-Underscore-Mix ist Brevo-Doku-Standard, nicht ändern.
10. **Save & Activate.**
11. In der Template-Liste die **numerische Template-ID** notieren
    (steht in der URL: `/template/<ID>/edit` — z. B. `42`).

---

## 3. Template-ID in `wrangler.toml` eintragen

```toml
# worker/wrangler.toml
BREVO_DOI_TEMPLATE_ID = "42"   # ← Wert aus Schritt 2.11
```

Re-deploy:

```bash
cd worker
npx wrangler deploy
```

Solange `BREVO_DOI_TEMPLATE_ID = "0"` steht, antwortet `/subscribe` mit
`503 "Anmeldung gerade nicht möglich"` — das ist der fail-closed-Schutz,
damit niemand ins Leere submitted.

---

## 4. Frontend mit Worker-URL verdrahten

In [`src/config.ts`](../src/config.ts):

```ts
export const SUBSCRIBE_API_URL: string | null =
  "https://oskarmarketing-booking.<dein-subdomain>.workers.dev";
```

Build + Push:

```bash
npm run build         # lokal validieren
git add src/config.ts
git commit -m "feat: wire SUBSCRIBE_API_URL to deployed worker"
git push              # GitHub Action redeployt Pages
```

Bis die URL gesetzt ist, blendet das Formular die Fallback-Meldung ein
("Formular noch nicht konfiguriert. Schreib mir direkt: …").

---

## 5. Brevo-Automation (3-Mail-Sequenz)

**Trigger ist `Contact added to list 3` — feuert NACH der DOI-Bestätigung**,
nicht beim ersten Submit. Wichtig für Recht + Inbox-Reputation.

1. Sidebar: **Automations** → **+ Create a new automation** → **From scratch**.
2. Name: `Playbook 3-Mail-Sequence`.
3. **Trigger:** *A contact is added to a list* → *Affiliate Funnel* (id 3).
4. **Step 1 — Send email:** Subject + Body aus `docs/email-sequence/mail-1.md`.
5. **Step 2 — Wait:** `2 days`.
6. **Step 3 — Send email:** aus `mail-2.md`.
7. **Step 4 — Wait:** `3 days` (= T+5 ab Bestätigung).
8. **Step 5 — Send email:** aus `mail-3.md`.
9. **Save → Activate.**

---

## 6. Sender-Verifizierung (einmalig)

Damit Brevo nicht über generische Brevo-Adresse versendet:

1. Brevo Sidebar: **Senders & IP** → **Senders** → **+ Add a sender**.
2. From-Name: `Oskar Marketing`.
3. From-Email: `opheck@gmx.de`.
4. Brevo schickt einen Bestätigungs-Link an die Adresse — bestätigen.

Bei eigener Domain (optional, später): SPF + DKIM in der DNS-Zone
hinterlegen (Brevo zeigt die Records).

---

## 7. End-to-End-Test

Smoke-Test direkt nach `wrangler deploy`:

```bash
cd worker
bash scripts/post-deploy-check.sh https://oskarmarketing-booking.<sub>.workers.dev
```

Erwartung: HTTP 200 + `{"ok":true}` (oder `400 "Email ungültig"` falls
du den Test-Payload änderst). Bei `503 disabled` ist `BREVO_DOI_TEMPLATE_ID`
noch nicht gesetzt.

Voller E2E-Test:

- [ ] Eigene Email (zweites Postfach) ins Playbook-Formular eintragen.
- [ ] Consent setzen → submit.
- [ ] UI: "Check deine Inbox" sichtbar.
- [ ] Inbox: DOI-Mail kommt in ≤2 Min, Absender = "Oskar Marketing".
- [ ] DOI-Link klicken → Redirect auf Playbook-Subpage `?confirmed=1`.
- [ ] Brevo Dashboard → *Contacts* → Liste *Affiliate Funnel* → neuer
      Eintrag mit Status *Confirmed*.
- [ ] Mail 1 trifft innerhalb 1–2 Min ein.
- [ ] Brevo *Automations* → laufender Contact im Step-Indikator sichtbar.
- [ ] Mail 2 + Mail 3 nicht künstlich beschleunigbar — zweite Test-Email
      einplanen oder Brevo's Step-Skipping in der Automation-UI nutzen.

---

## 8. Troubleshooting

| Symptom | Ursache | Fix |
|---|---|---|
| Worker antwortet `401 Unauthorized` von Brevo | `BREVO_API_KEY`-Secret fehlt oder gerollt | `npx wrangler secret put BREVO_API_KEY` |
| Worker antwortet `503 "disabled"` | `BREVO_DOI_TEMPLATE_ID="0"` oder `BREVO_LIST_ID="0"` | Werte in `wrangler.toml` setzen, `deploy` |
| Brevo antwortet `400 "templateId is not valid"` | Template ist *Marketing* statt *Transactional* | Template neu anlegen mit Typ *Transactional* |
| Brevo antwortet `400 "redirectionUrl"` | `BREVO_REDIRECT_URL` kein gültiges HTTPS | `https://` voranstellen, `deploy` |
| `429 Too Many Requests` | Brevo Free: 10 req/s API, 300 Mails/Tag | Backoff im Frontend (vorhanden) oder Plan upgraden |
| DOI-Mail kommt nicht | Sender nicht verifiziert (Schritt 6) | Sender in Brevo verifizieren |
| Contact landet nicht in Liste 3 | User hat DOI-Link nicht geklickt | Brevo zeigt "Unconfirmed" — ist erwartetes Verhalten |
| CORS-Error im Browser | Origin nicht in `ALLOWED_ORIGINS` | `wrangler.toml` → `[vars] ALLOWED_ORIGINS` erweitern |
| Form zeigt "noch nicht konfiguriert" | `SUBSCRIBE_API_URL = null` | Schritt 4 |

Worker-Logs live mitschneiden:

```bash
cd worker
npx wrangler tail
```

---

## 9. Kosten

**Cloudflare Workers (Free Plan):**
- 100 000 Requests / Tag
- 10 ms CPU / Request
- KV: 100 000 reads/day, 1 000 writes/day

Bei realistischen Playbook-Conversions (< 100/Tag) bleibst du
mehrere Größenordnungen unter dem Limit.

**Brevo (Free Plan):**
- 300 Mails / Tag (alle Mails summiert: DOI + Sequenz)
- Unbegrenzt Kontakte
- API: ~10 req/s

Bei 3-Mail-Sequenz = 4 Mails pro neuem Lead (DOI + 3 Funnel). Free Plan
trägt also ca. **75 neue Leads/Tag**. Falls überschritten: Brevo *Starter*
ab €9/Monat (20 000 Mails).

---

## 10. Going-Live-Checklist

- [ ] Worker deployed (`wrangler deploy` ohne Fehler)
- [ ] KV-Namespace-ID in `wrangler.toml` real (kein `REPLACE_AFTER_…`)
- [ ] Alle 4 Secrets gesetzt (`wrangler secret list` zeigt RESEND_API_KEY,
      TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, BREVO_API_KEY)
- [ ] `BREVO_LIST_ID = "3"` in `wrangler.toml`
- [ ] `BREVO_DOI_TEMPLATE_ID` ≠ `"0"` in `wrangler.toml`
- [ ] DOI-Template in Brevo aktiv (Type: Transactional)
- [ ] Sender verifiziert
- [ ] Automation aktiv (Trigger: List 3)
- [ ] `SUBSCRIBE_API_URL` in `src/config.ts` gesetzt + deployed
- [ ] `bash worker/scripts/post-deploy-check.sh <url>` grün
- [ ] E2E mit eigener Email erfolgreich (Schritt 7)
- [ ] Brevo-Eintrag in `public/datenschutz.html` live

---

## Wartungs-Hinweise

- **Preisänderung bei Mark Janzen** → Mail 3 in Brevo direkt anpassen,
  `docs/email-sequence/mail-3.md` als Single-Source-of-Truth nachziehen.
- **Spam-Quote prüfen:** Brevo *Statistics* → Bounces + Spam-Reports.
  Bei > 0.1 % Spam-Rate Subject-Line von Mail 3 abschwächen.
- **Re-Engagement:** nach 6 Monaten Inaktivität automatisch
  unsubscriben (Brevo Re-Engagement-Workflows).
- **API-Key-Rotation:** alle 6–12 Monate `BREVO_API_KEY` in Brevo neu
  generieren, alten löschen, `wrangler secret put` + `deploy`.
