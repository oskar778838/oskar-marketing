# Impressum ausfüllen — Vorlage fürs Eltern-Gespräch

> **Worum es geht:** Das Live-Impressum auf `oskarmarketing.de/impressum.html`
> enthält aktuell nur Platzhalter (`[PLATZHALTER]`, `Oskar [Nachname]`,
> `[Straße + Hausnummer]`). Eine kommerzielle Seite mit einem 997-€-Angebot
> **darf so nicht online sein** — fehlendes/fehlerhaftes Impressum ist der
> klassische Abmahn-Grund (§ 5 DDG). Diese Tabelle listet jedes Pflichtfeld.
>
> ⚠️ **Keine Rechtsberatung.** Bitte mit einem Erwachsenen ausfüllen und im
> Zweifel anwaltlich oder bei der **IHK-Gründungsberatung** gegenchecken.
> Hinweis: Das alte Impressum zitiert die **abgelösten** Paragraphen
> „§ 5 TMG" und „§ 55 RStV" — korrekt sind heute **§ 5 DDG** (Digitale-Dienste-Gesetz,
> seit Mai 2024) und **§ 18 MStV** (Medienstaatsvertrag).

## Pflichtangaben nach § 5 DDG

| Feld | Aktuell auf der Seite | Was rein muss | Wer entscheidet |
|---|---|---|---|
| Voller Name | `Oskar [Nachname]` | Vor- **und** Nachname (real) | Eltern |
| Anschrift | `[Straße + Hausnummer]`, `[PLZ] [Stadt]` | Ladungsfähige Anschrift (echte Straße, kein Postfach) | Eltern |
| E-Mail | `opheck@gmx.de` ✅ vorhanden | bleibt | — |
| Telefon / schnelle Kontaktmöglichkeit | `[optional eintragen]` | Telefon **oder** ein zweiter schneller elektronischer Kontakt (z. B. Kontaktformular) ist Pflicht | Eltern |
| Umsatzsteuer-ID | `[Falls vorhanden:]` | USt-IdNr. **falls vorhanden**; sonst Zeile streichen. Bei Kleinunternehmer ggf. Hinweis nach **§ 19 UStG** | Eltern + ggf. Steuerberater |
| Berufsbezeichnung / Aufsichtsbehörde | (nicht vorhanden) | Nur nötig bei reglementierten Berufen — hier i. d. R. **nicht** relevant | Eltern |

## Der wichtigste Punkt: minderjähriger Betreiber

| Thema | Befund | Was zu klären ist | Wer entscheidet |
|---|---|---|---|
| Geschäftsfähigkeit | Betreiber ist 13 → **beschränkt geschäftsfähig** (§§ 106 ff. BGB) | Ein kommerzielles Angebot (997 €) + Affiliate-Einnahmen brauchen i. d. R. einen **gesetzlichen Vertreter** (Elternteil), der als Verantwortlicher genannt wird | **Eltern — rechtlich entscheidend** |
| Verantwortlicher i. S. d. § 18 Abs. 2 MStV | nur „Oskar" genannt | Name eines **volljährigen Verantwortlichen** (Elternteil) ergänzen | Eltern |

## Konkrete To-Dos im Code (macht ein Entwickler in 5 Min, sobald die Daten da sind)

1. Block `<div class="placeholder">…</div>` in `public/impressum.html` löschen.
2. `Oskar [Nachname]` → echter Name; `[Straße + Hausnummer]` / `[PLZ] [Stadt]` → echte Adresse.
3. `Telefon: [optional eintragen]` → echte Nummer oder Zeile entfernen.
4. „§ 5 TMG" → „§ 5 DDG"; „§ 55 Abs. 2 RStV" → „§ 18 Abs. 2 MStV".
5. USt-Zeile: ID eintragen **oder** Kleinunternehmer-Hinweis (§ 19 UStG) **oder** Zeile streichen.
6. `Stand:`-Datum aktualisieren.

→ Sobald die Felder von den Eltern bestätigt sind, trägt ein Entwickler sie ein.
   **Vorher kein Traffic auf die Seite leiten.**
