# MORNING SETUP — Booking-Backend live nehmen

**Du wachst auf, schaust auf die Bio-Site, da steht "Buchungs-Backend wird gerade
noch eingerichtet" in der Termin-Section. Diese Anleitung bringt das in ~25 Minuten
auf "live" — inklusive echter Email + SMS pro Buchung.**

Status nach dem Overnight-Build:
- ✅ Frontend Booking-Section ist live (Slot-Grid, Form, Success-State, GDPR-Pages)
- ✅ Worker-Code ist fertig in `worker/`, bereit zum Deploy
- ✅ Datenschutz + Impressum existieren (Impressum hat Platzhalter — siehe Schritt 7)
- ⏳ **Du musst:** Cloudflare + Resend + Twilio Accounts anlegen, Worker deployen,
     Frontend mit Worker-URL verbinden

---

## Schritt 0 — Voraussetzungen

```bash
# Im Projektroot:
cd worker
npm install
```

(Installiert wrangler + types lokal in worker/node_modules.)

---

## Schritt 1 — Cloudflare Account + wrangler login (5 min)

1. Geh auf **https://dash.cloudflare.com/sign-up** — Email + Passwort.
   Verify the email (kommt sofort).

2. Im Terminal:
   ```bash
   cd worker
   npx wrangler login
   ```
   Öffnet einen Browser → "Allow Wrangler" klicken → Terminal sagt "Successfully
   logged in".

3. Test: `npx wrangler whoami` → zeigt deine Email.

---

## Schritt 2 — KV-Namespace anlegen (2 min)

```bash
npx wrangler kv:namespace create BOOKINGS
```

Output sieht so aus:
```
🌀 Creating namespace with title "oskarmarketing-booking-BOOKINGS"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
[[kv_namespaces]]
binding = "BOOKINGS"
id = "abc123def456..."
```

**Kopiere die `id`** und ersetze damit den Platzhalter in `worker/wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "BOOKINGS"
id = "abc123def456..."   # ← deine ID hier rein
```

---

## Schritt 3 — Resend für Emails (5 min)

1. **https://resend.com/signup** — Email + Passwort, GitHub-Login funktioniert auch.

2. **Domain (optional aber empfohlen):**
   - Wenn du `oskarmarketing.de` (oder eine andere) hast: Domains → Add Domain →
     DNS-Records eintragen (TXT + MX + DKIM) → "Verify".
     Dauert beim ersten Mal ~10 min wegen DNS-Propagation.
   - **Skip möglich:** Resend stellt für Tests `onboarding@resend.dev` als Sender
     zur Verfügung. Funktioniert ohne Domain-Verify, aber Mails landen häufiger
     im Spam. Für die ersten 1-2 Bookings okay, langfristig eigene Domain
     empfohlen.

3. **API-Key:** Resend Dashboard → **API Keys** → "Create API Key" → Permission
   "Sending access" → kopieren (`re_...`). Wird nur **einmal** angezeigt!

4. Im Terminal:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
   Wenn der Prompt kommt: API-Key reinpasten + Enter.

5. **Wenn du eine eigene Domain verifiziert hast**, in `worker/wrangler.toml`
   den Sender ersetzen:
   ```toml
   RESEND_FROM = "Oskar Marketing <noreply@oskarmarketing.de>"
   ```
   Sonst lassen wie es ist (`onboarding@resend.dev`).

---

## Schritt 4 — Twilio für SMS (10 min · optional)

**Wenn dir SMS zu nervig sind:** Skip diesen Schritt komplett. Setze in
`worker/wrangler.toml` `SMS_ENABLED = "false"` und mach mit Schritt 5 weiter.
Du bekommst dann nur die Email-Benachrichtigung pro Buchung.

**Mit SMS:**

1. **https://www.twilio.com/try-twilio** — Sign-Up. Bekommst $15 Trial-Credit.
   Verify deine eigene Telefonnummer (+491797035662) im Sign-Up-Flow — Trial-
   Accounts können nur an verifizierte Nummern senden.

2. **Konsole → Phone Numbers → Manage → Buy a number:**
   - Suche nach DE oder US Nummer mit "SMS" capability.
   - Trial-Accounts können kostenlos eine Nummer wählen.
   - Nach Kauf: kopiere die Nummer (E.164 Format, z.B. `+15005550006`).

3. **In `worker/wrangler.toml`** ersetzen:
   ```toml
   TWILIO_FROM = "+15005550006"   # ← deine gekaufte Nummer
   ```

4. **Account SID + Auth Token** holen: Konsole-Startseite → "Account Info" →
   beide Werte sichtbar.

5. Im Terminal:
   ```bash
   npx wrangler secret put TWILIO_ACCOUNT_SID
   # paste: AC...
   npx wrangler secret put TWILIO_AUTH_TOKEN
   # paste: ...
   ```

6. Verify dass deine eigene Nummer (+491797035662) als verified caller_id
   registriert ist:
   - Twilio Konsole → Phone Numbers → Manage → Verified Caller IDs
   - Falls nicht: "Add a new caller ID" → Nummer eintragen → SMS-Code bekommen
     → eintippen → done.
   - **Nur Trial-Accounts brauchen das.** Bei einem Paid-Account kannst du an
     jede Nummer senden.

---

## Schritt 5 — Worker deployen (1 min)

```bash
cd worker
npx wrangler deploy
```

Output:
```
Total Upload: 12.3 KiB / gzip: 4.1 KiB
Uploaded oskarmarketing-booking (1.2 sec)
Deployed oskarmarketing-booking (3.1 sec)
  https://oskarmarketing-booking.<dein-subdomain>.workers.dev
Current Version ID: ...
```

**Kopiere die URL** (`https://oskarmarketing-booking.<...>.workers.dev`).

---

## Schritt 6 — Frontend mit Worker verbinden (1 min)

In `src/config.ts` die URL eintragen:

```ts
export const BOOKING_API_URL: string | null =
  "https://oskarmarketing-booking.<dein-subdomain>.workers.dev";
```

Dann committen + pushen:

```bash
cd ..   # zurück ins Projektroot
git add src/config.ts
git commit -m "config: live booking worker URL"
git push
```

GitHub Action redeployed Frontend automatisch (~60-90s). Nach dem Deploy zeigt
die `/termin` Section die echten Slots statt der "Backend in Setup" Notice.

---

## Schritt 7 — Impressum ausfüllen (5 min)

`public/impressum.html` öffnen. Ganz oben steht ein roter Hinweis-Block. Ersetze
die `[Platzhalter]` Einträge mit deinen echten Daten:

- `[Nachname]` (mehrere Stellen)
- `[Straße + Hausnummer]`
- `[PLZ] [Stadt]`
- `[USt-IdNr.]` (falls vorhanden) ODER lass die Kleinunternehmer-Zeile stehen
- Telefon (optional)

Roten Hinweis-Block (`<div class="placeholder">…</div>`) entfernen wenn fertig.

Committen + pushen wie in Schritt 6.

---

## Schritt 8 — Test-Buchung machen (3 min)

1. Geh auf https://oskar778838.github.io/oskar-marketing/#termin
2. Wähle einen Slot (irgendeinen verfügbaren).
3. Form füllen mit deiner eigenen Email + Telefon. Consent-Box ankreuzen.
4. "Termin bestätigen" → "Bestätigt." Animation sollte erscheinen.
5. Check:
   - Email bei dir (opheck@gmx.de) → Subject "Neuer Termin · …"
   - Email beim Visitor (deine eigene Adresse) → Subject "Termin bestätigt · …"
   - SMS bei +491797035662 → "Neuer Termin … · email · phone"
6. Refresh die Seite → der gerade gebuchte Slot sollte jetzt **blocked** sein
   (40% opacity, nicht klickbar).
7. Versuche denselben Slot nochmal zu buchen → "Dieser Slot wurde gerade
   vergeben" Toast.

Wenn alles ✅: live-ready. 🍷

---

## Troubleshooting

### "Email kommt nicht an"
- Spam-Ordner prüfen (besonders bei `onboarding@resend.dev` Sender).
- Resend Dashboard → Logs → letzter Send sollte mit Status "delivered" stehen.
- Falls "bounced": Empfänger-Adresse falsch oder Mailbox voll.
- Falls "queued" >5 min: Resend hat ein Issue, check status.resend.com.

### "SMS kommt nicht an"
- Trial-Account: nur an verified caller IDs (siehe Schritt 4.6).
- Twilio Console → Monitor → Logs → Error Codes nachschlagen unter
  https://www.twilio.com/docs/api/errors
- Wenn 21608 (unverified number) → Schritt 4.6 nachholen.

### "CORS error im Browser"
- Browser DevTools → Network → die failed request anschauen.
- Prüfen dass `https://oskar778838.github.io` in `worker/wrangler.toml`
  unter `ALLOWED_ORIGINS` steht (sollte schon drin sein).
- Nach Änderung: `npx wrangler deploy` nochmal.

### "Slot bleibt nach Buchung verfügbar (nicht blocked)"
- KV ist eventually consistent — kann 1-2 Sekunden dauern bis ein neuer
  Schreib-Vorgang in `list()` auftaucht. Refresh nach 5 Sek erneut.
- Wenn nach 30 Sek immer noch nicht: `npx wrangler tail` zeigt Live-Logs des
  Workers, da sieht man ob `BOOKINGS.put` gelaufen ist.

### "Build failed beim git push"
- GitHub Action Output anschauen: github.com/oskar778838/oskar-marketing/actions
- Meistens TypeScript-Error → lokal `npm run build` läuft? Wenn ja: pushen.
  Wenn nein: Error fixen, dann pushen.

### Worker komplett resetten
Wenn was schief geht und du noch mal von vorne willst:
```bash
cd worker
npx wrangler kv:key list --binding=BOOKINGS   # listet alle Buchungen
npx wrangler kv:key delete --binding=BOOKINGS "slot:..."   # einzeln löschen
# Oder: gleich den ganzen Namespace neu anlegen (Schritt 2 erneut)
```

---

## Was wenn du KEINE Lust auf Cloudflare/Resend/Twilio Accounts hast?

Dann lösch die Termin-Section komplett. In `index.html` einfach den
`<section id="termin">…</section>` Block entfernen. In `src/main.ts` die
`initBooking()` Zeile auskommentieren. In `index.html` die Section-Labels
04 → 03 (Channels) und 05 → 04 (Manifest) zurückrenamen.

Aber: die Termin-Section konvertiert wahrscheinlich besser als die Academy-
Cards, weil "ein 30-min Gespräch" ist niederschwelliger als 397€. Mein Tipp:
hinrichten. Sind 25 Minuten Setup für eine echte Lead-Capture.
