# Eltern-Gespräch — Checkliste (≈ 30 Min)

Vor dem Traffic-Start auf `oskarmarketing.de` gibt es ein paar Punkte, die ein
Erwachsener entscheiden/bestätigen muss. Code-Seitig ist alles vorbereitet —
es fehlen nur eure echten Daten und ein paar rechtliche Ja/Nein.

> ⚠️ Das hier ist **keine Rechtsberatung**, sondern eine Gesprächs-Hilfe.
> Für die rechtlichen Punkte im Zweifel **Anwalt** oder **IHK-Gründungsberatung**
> (oft kostenlos) gegenchecken.

## Die 5 Punkte

1. **Impressum-Daten** — Voller Name, echte Anschrift, Telefon/Kontakt.
   → Details in `IMPRESSUM-FILL-TEMPLATE.md`. *Pflicht nach § 5 DDG.*

2. **Wer ist verantwortlich?** — Da Oskar 13 ist, sollte ein Elternteil als
   **gesetzlicher Vertreter / Verantwortlicher** in Impressum + Datenschutz
   stehen. *Wichtig, weil Geld im Spiel ist (997-€-Angebot + Affiliate).*
   → `DATENSCHUTZ-VERANTWORTLICHER-TEMPLATE.md`.

3. **Datenschutz-Dienstleister** — Bestätigen, dass die Liste stimmt:
   Brevo, Cal.eu, Cloudflare, GitHub Pages. (Resend/Twilio/Google Fonts sind
   raus.) → gleiche Vorlage wie Punkt 2.

4. **Geld & Steuer** — Ist das 997-€-Angebot wirklich live geplant? Wenn ja:
   USt-IdNr. vorhanden, oder Kleinunternehmer (§ 19 UStG)? Affiliate-Einnahmen
   (Digistore) anmelden? → ggf. Steuerberater / IHK.

5. **DOI-Mail einmal echt testen** — Eine echte Anmeldung über das Formular,
   prüfen ob die Bestätigungs-Mail ankommt und der Link auf `/playbook.html`
   führt. (Kann nur ein Mensch testen — siehe `FIX-WORKFLOW-REPORT.md`, I14.)

## Was schon erledigt ist (kein Eltern-Input nötig)

- Domain `.bio` → `.de` in den Rechtstexten korrigiert.
- Toter Code + Resend/Twilio entfernt; Datenschutz-Aussagen entsprechend ehrlicher.
- Google Fonts self-hosted → keine Daten mehr an Google.
- Cal-Buchung lädt erst nach Klick (DSGVO-freundlich).
- Kontraste, Social-Vorschaubild (PNG), Marken-Schrift vereinheitlicht.

## Was als nächstes passiert

1. Eltern füllen Punkte 1–4 (Daten + Ja/Nein) aus.
2. Entwickler trägt die Daten in Impressum + Datenschutz ein (5–10 Min).
3. DOI-Happy-Path einmal manuell testen (Punkt 5).
4. **Erst dann**: `fix/ultra-review-autonomous` mergen → live → Traffic.
