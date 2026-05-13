# Sales Flow — Calendar vs DM

## Strategie

Zwei parallele Eingangskanäle in der Termin-Section, bewusst getrennt:

### Calendar — ernsthafte Leads
Slot-Selector + Form. Mit Email/Telefon + Datenschutz-Consent.
- Friction beabsichtigt: nur wer einen konkreten Termin will, geht durch
- Output: Mail in opheck@gmx.de mit `[TERMIN]`-Prefix, manuelle Bestätigung
- Werktags 14:00 + 19:00 · Wochenende 10:00 + 14:00 + 19:00

### DM — Quick Questions / Niedrigschwellig
Sub-Action unter Slot-Selector mit IG + TikTok DM-Buttons.
- Zielgruppe: Wer nur kurz was fragen will, "wie funktioniert das eigentlich"
- Klick öffnet die jeweilige App / Web-Profil
- Kein eigenes Tracking — pures Open-Web

## Warum getrennt?

1. **Calendar-Funnel bleibt sauber.** Wer einen Slot wählt, ist bereit für ein Gespräch. Würde DM oben prominenter stehen, würden Termine zu DMs konvertieren — und DMs zu Verzettelung.
2. **DM-Kanal generiert Touch-Points.** Auch wer am Ende keinen Termin bucht, weiß: "Ich kann dem Oskar einfach schreiben." Das öffnet Build-in-Public-Konversation.
3. **Optionen reduzieren Conversion-Anxiety.** Wer Termin scheut, hat sichtbar einen B-Pfad. Anti-Pattern wäre: nur Termin oder gar nichts.

## Hierarchie

Calendar visuell dominant (Slot-Grid + Form), DM-Block darunter mit dashed-border getrennt, Lead-Text "Lieber per Chat?". Klare visuelle Sub-Aktion, nicht gleichberechtigt.

## Tracking / Iteration

Aktuell kein eigenes Tracking — Calendar-Sends laufen über web3forms, DM-Klicks gehen out-of-band. Bei Bedarf: `data-analytics` Attribute auf DM-Buttons, GA-Event "termin_dm_click" mit Platform-Label.
