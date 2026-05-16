# Brevo Setup — Playbook Lead-Funnel

Diese Anleitung führt durch die Brevo-Web-Dashboard-Schritte, die Claude
nicht automatisieren kann. Nach Abschluss läuft der Lead-Funnel:

```
Bio-Site Formular  →  Brevo DOI-Bestätigung  →  Mail 1 sofort
                                                Mail 2 +2 Tage
                                                Mail 3 +5 Tage
```

Voraussetzung: ein Brevo-Account (Free Tier reicht — 300 Mails/Tag,
unbegrenzt Kontakte).

---

## 1. Account anlegen

1. https://www.brevo.com → "Sign Up Free".
2. Email: `opheck@gmx.de`. Passwort setzen.
3. Email-Verifizierung: Brevo schickt einen Code, eintragen.
4. Beim ersten Login: "Was möchtest du tun?" → **Email Marketing**.
5. Sender-Profil-Onboarding überspringen (machen wir in Schritt 5).

---

## 2. Liste anlegen

1. Sidebar: **Contacts** → **Lists** → **+ Create a list**.
2. Name: `Affiliate Funnel`.
3. Save. (List-ID merken — wird automatisch beim Form-Bau referenziert.)

---

## 3. Web-Form bauen

1. Sidebar: **Forms** → **+ Create a form** → **Subscription form**
   → **Embed**.
2. Form-Name (intern): `Playbook Capture`.
3. **Fields:**
   - `Email` (Required, schon vorhanden).
   - Alle anderen Default-Felder löschen oder als optional belassen.
4. **Target list:** `Affiliate Funnel`.
5. **Double Opt-In:** ✅ aktivieren (Pflicht für DE-Recht).
6. **DOI-Template anpassen:**
   - Sender: `Oskar Marketing <opheck@gmx.de>` (nach Schritt 5 setzbar).
   - Subject: `Bitte bestätige deine Anmeldung`.
   - Body: ein kurzer Satz plus den Bestätigungs-Button.
7. **Confirmation page (nach Bestätigung):** Redirect to
   `https://oskar778838.github.io/oskar-marketing/playbook.html` —
   so landet der User direkt am Playbook nach DOI-Klick.
8. **Save & publish.**
9. Brevo zeigt einen `<form action="https://...sibforms.com/serve/...">`-
   Snippet. **Nur die `action`-URL** kopieren — den Rest des Markups
   ignorieren wir, wir haben eigenes Markup.

---

## 4. Form-URL in den Code einsetzen

In `index.html`, im Playbook-Form (`<form id="playbook-form" ...>`),
ersetze den Placeholder:

```html
action="{{BREVO_FORM_ACTION}}"
```

durch die echte URL aus Schritt 3.9, z.B.:

```html
action="https://sibforms.com/serve/MUIFAJ..."
```

Committen, pushen. GitHub Action deployt automatisch.

---

## 5. Sender-Verifizierung

Damit Brevo nicht über generische Brevo-Adresse versendet:

1. Sidebar: **Senders & IP** → **Senders** → **+ Add a sender**.
2. From-Name: `Oskar Marketing`.
3. From-Email: `opheck@gmx.de`.
4. Brevo schickt einen Bestätigungs-Link an die Adresse — bestätigen.

Bei eigener Domain (optional, später): SPF + DKIM in der DNS-Zone
hinterlegen (Brevo zeigt die Records). Bei `gmx.de` reicht die
Default-Verifizierung.

---

## 6. Automation bauen

1. Sidebar: **Automations** → **+ Create a new automation** → **From
   scratch**.
2. Name: `Playbook 3-Mail-Sequence`.
3. **Trigger:** `A contact is added to a list` → `Affiliate Funnel`.
   (Das feuert NACH DOI, nicht beim ersten Form-Submit — sehr wichtig.)
4. **Step 1 — Send email:**
   - Subject: kopieren aus `docs/email-sequence/mail-1.md`.
   - Body: Plain-Text Body kopieren.
   - Sender: dein verifizierter Sender aus Schritt 5.
5. **Step 2 — Wait:** `2 days`.
6. **Step 3 — Send email:**
   - Subject + Body aus `docs/email-sequence/mail-2.md`.
7. **Step 4 — Wait:** `3 days`. (= T+5 ab Anmeldung)
8. **Step 5 — Send email:**
   - Subject + Body aus `docs/email-sequence/mail-3.md`.
9. **Save → Activate.**

---

## 7. End-to-End-Test

1. Eigene Email (z.B. zweites Postfach) ins Playbook-Formular eintragen.
2. Consent-Checkbox setzen, absenden.
3. Browser: Erfolgs-Meldung "Check deine Inbox" muss erscheinen.
4. Inbox: DOI-Mail in ≤2 Min.
5. DOI-Link klicken → Redirect zur Playbook-Subpage.
6. Mail 1 sollte innerhalb 1-2 Min eintreffen.
7. Brevo-Automation-UI: Contact in der "Currently running"-Liste
   sichtbar mit Schritt-Indikator.
8. Mail 2 + Mail 3 lassen sich nicht künstlich beschleunigen — am
   einfachsten: zweiter Test mit anderer Email zum Live-Validieren der
   Wartezeiten oder Brevo's Step-Skipping nutzen falls verfügbar.

---

## 8. Going-Live-Checklist

- [ ] Sender verifiziert (Schritt 5).
- [ ] DOI aktiviert auf dem Form (Schritt 3.5).
- [ ] Form-URL in `index.html` eingesetzt (Schritt 4).
- [ ] Automation aktiv (Schritt 6.9).
- [ ] End-to-End mit eigener Email durchlaufen (Schritt 7).
- [ ] Brevo-Eintrag in `public/datenschutz.html` ist live deployt.
- [ ] Mail 3 enthält Affiliate-Disclosure ohne Edit-Drift.

---

## Wartungs-Hinweise

- **Preisänderung bei Mark Janzen** → Mail 3 in Brevo direkt anpassen
  (Pakete-Block). Eigene `docs/email-sequence/mail-3.md` ebenfalls
  aktualisieren als Single-Source-of-Truth.
- **Spam-Quote prüfen:** Brevo Statistics → Bounces + Spam-Reports.
  Bei >0.1 % Spam-Rate Subject-Line von Mail 3 abschwächen.
- **Re-Engagement:** nach 6 Monaten Inaktivität automatisch
  unsubscriben (Brevo bietet Re-Engagement-Workflows).
