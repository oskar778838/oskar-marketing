# Datenschutz: Verantwortlicher + Auftragsverarbeiter — Vorlage

> **Worum es geht:** Die Datenschutzerklärung muss (1) einen **Verantwortlichen
> im Sinne der DSGVO** nennen und (2) die **tatsächlich genutzten**
> Dienstleister korrekt auflisten. Nach den Code-Fixes vom Mai 2026 stimmt die
> bisherige Liste **nicht mehr** — sie nennt Resend + Twilio, die es im Code
> nicht mehr gibt, und Google Fonts, das jetzt self-hosted ist.
>
> ⚠️ **Keine Rechtsberatung.** Mit einem Erwachsenen ausfüllen, im Zweifel
> anwaltlich / über die IHK prüfen lassen.

## 1. Verantwortlicher (DSGVO Art. 4 Nr. 7)

Da der Betreiber 13 ist (beschränkt geschäftsfähig), sollte ein **volljähriger
gesetzlicher Vertreter** als Verantwortlicher genannt werden. Vorlagetext:

```
Verantwortlich im Sinne der DSGVO:

[Vorname Nachname des Elternteils]        ← AUSFÜLLEN (Eltern)
gesetzlicher Vertreter von Oskar [Nachname]
[Straße + Hausnummer]                      ← AUSFÜLLEN
[PLZ] [Stadt]
E-Mail: opheck@gmx.de
```

| Feld | Aktuell | Was rein muss | Wer entscheidet |
|---|---|---|---|
| Verantwortlicher | nur „Oskar" | Volljähriger Elternteil als gesetzl. Vertreter | **Eltern — rechtlich entscheidend** |

## 2. Auftragsverarbeiter — Liste auf den IST-Stand bringen

**Tatsächlich genutzte Dienste (nach den Code-Fixes):**

| Dienst | Zweck | Sitz / Transfer | AVV nötig? | In Policy? |
|---|---|---|---|---|
| **Brevo** (Sendinblue / Brevo SAS) | Newsletter / Playbook Double-Opt-In | Frankreich (EU) | ja | prüfen/ergänzen |
| **Cal.com / Cal.eu** | Terminbuchung (Embed) | EU-Instanz `cal.eu`; `embed.js` von `app.cal.com` (US) | ja | **ergänzen** |
| **Cloudflare** | Worker für `/subscribe` | US-Konzern, Edge weltweit | ja | prüfen/ergänzen |
| **GitHub Pages** (Microsoft) | Hosting der Website | US | ja | prüfen/ergänzen |

**NICHT mehr genutzt — aus der Policy ENTFERNEN:**

| Dienst | Warum raus | Status im Code |
|---|---|---|
| **Resend** (E-Mail) | War nur im alten Booking-Pfad | ❌ in Phase 2 gelöscht (`notify.ts`) |
| **Twilio** (SMS) | War nur im alten Booking-Pfad | ❌ in Phase 2 gelöscht |
| **Google Fonts** | Schriften jetzt self-hosted | ✅ keine Verbindung zu Google mehr |

## 3. Schon korrekt im Code (als Pluspunkte erwähnbar)

- **Double-Opt-In** für den Newsletter (Brevo `doubleOptinConfirmation`) — kein Single-Opt-In.
- **Keine Tracker / kein Analytics / keine eigenen Cookies.**
- **Google Fonts self-hosted** → keine IP-Übermittlung an Google mehr (war ein Abmahn-Risiko, LG München I).
- **Cal-Embed lädt erst nach Klick** („Termin laden") → kein US-Skript / keine Cal-Cookies vor einer aktiven Nutzer-Handlung (Click-to-Load-Consent).

## 4. To-Dos im Code (Entwickler, sobald Eltern bestätigt haben)

1. `public/datenschutz.html`: Verantwortlicher-Block mit Elternteil ausfüllen.
2. Resend- + Twilio-Abschnitte entfernen; Cal.eu sauber als Auftragsverarbeiter beschreiben.
3. `Stand:`-Datum aktualisieren.
4. (Google-Fonts-Hinweis ist bereits korrigiert: „self-hosted, keine Verbindung zu Google".)
