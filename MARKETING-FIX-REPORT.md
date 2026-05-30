# Marketing-Fix-Report — 2026-05-30 (Tag 32)

Umsetzung der freigegebenen Findings aus `MARKETING-REVIEW-REPORT.md`.

- **Web-Branch:** `fix/marketing-review-autonomous` (von `fix/ultra-review-autonomous` = auditierter Stand, nach deiner Entscheidung — nicht von `main`, das 8 Commits dahinter lag).
- **Story-Generator:** Schwester-Repo `affiliate_autopilot`, Branch `feat/story-frame-types` (separate Repo, dort liegt die Story-Frame-Arbeit).
- **Build-Gate:** `npm run build` (`tsc --noEmit && vite build`) **grün** (16,53 s, 44 Module) vor den Commits. Python-Render der 4 Frames **fehlerfrei** als Gate für C2.
- **Nicht gepusht.** Beide Repos lokal.

---

## ✅ Fixed

| # | Finding | Datei(en) | Vorher → Nachher | Verifikation | Commit |
|---|---------|-----------|------------------|--------------|--------|
| **C2** | Story-Frames Gold-auf-Schwarz | `affiliate_autopilot/make_slides.py:64-70,1052,857-862,1071-1078,92` | BG `#050505`→`#F5F7F8` · Text Weiß→`#0E1116` Ink · Akzent Gold `#C9A84C`→`#5B5BD6` · **Statzahl eigene Farbe `#4444B8`** (Accent-Deep) · Glow warm→**kühl** (Periwinkle statt Creme) · Monogramm-Margin 32→48 px | Alle 4 Demo-Frames neu gerendert + visuell geprüft (siehe `.marketing-review-artifacts/story-output-after/`). Stat `+142` rendert sichtbar tiefer als das TAG-Label = Kontrast wie gewünscht. | `461e176` (Schwester) |
| **C3** | Playbook-Body ohne JS unsichtbar | `public/playbook.html:8,238-239` | `.reveal{opacity:0}` → `html.js .reveal{opacity:0}` + früh `document.documentElement.classList.add('js')`. Reveal nur noch als Progressive Enhancement. | **Headless ohne JS:** 19/20 `.reveal` sichtbar (vorher 0). No-JS-Full-Page zeigt **kompletten** Body (4 Steps, Benefits, Price-Box, CTA). Siehe `screenshots-after/playbook-{desktop,mobile}-nojs-full.png`. | `71dceca` |
| **I3** | Verbotswort „Günstiger" am Geld-CTA | `public/playbook.html:1086` | „Günstiger als ein Mittagessen …" → „**Du startest mit Modul 01** — und entscheidest danach selbst, ob du dabei bleibst." | Kein Forbidden-Word mehr; im gelieferten HTML bestätigt. | `71dceca` |
| **I4** | „Imperium."-Schluss (Gold-Cluster-Marker) | `index.html:963`, `pro/index.html:373` | „Imperium." → „**Etwas Echtes.**" (beide Manifeste). „Stück für Stück." bewusst vermieden — würde die Zeile davor doppeln. | Im gelieferten HTML + im After-Screenshot des Pro-Footers bestätigt. | `87ff8ee` |
| **NTH** | „Mark's" Apostroph | `public/playbook.html:1063` | „Mark's" → „Marks" (dt. Genitiv) | HTML bestätigt. | `71dceca` |
| **NTH** | „Vom Gold-Cluster" im Share-Preview | `index.html:22,30` | Aus `og:description` + `twitter:description` entfernt → führt jetzt mit „Build in Public, dokumentiert mit echten Zahlen …". **Body-/Journal-Erwähnung (`:250`) bewusst behalten** (Insider-Narrativ, laut Audit). | Meta-Treffer 3→1 (verbleibend = Body). | `87ff8ee` |
| **NTH** | `.glass-subtle` zu schwach | `src/styles/pro-glass.css:23-34` | Grauer Border `@0.6` auf Snow → **hellere weiße Fläche `rgba(255,255,255,.55)` + Indigo-Hairline `rgba(91,91,214,.15)`** + leicht tieferer Schatten. | After-Screenshot `pro-{desktop,mobile}-after-full.png`: Fit-/Nicht-Fit-Karten lesen jetzt als eigene Flächen. | `b2fc363` |
| **NTH** | OM-Monogramm zu nah an der Ecke | `affiliate_autopilot/make_slides.py:92` | `MONO_MARGIN_PX` 32→48 (rückt Monogramm hoch + nach innen, weg vom Ecken-Sticker). | In den re-renderten Frames sichtbar weiter von der Ecke. | `461e176` (Schwester) |
| **Re-Shoot** | Playbook-Hierarchie unverifizierbar | — | No-JS-Full-Page (= reveals forced visible) Desktop + Mobile neu erstellt. | `screenshots-after/playbook-*-nojs-full.png` zeigen den vollständigen Mittelteil. | — |

**Build-Status:** ✅ `tsc --noEmit` ohne Fehler · `vite build` ✅ 44 Module · 4 Story-Frames gerendert ✅.

---

## ⏭️ Skipped — bewusst nicht angefasst (per deiner Anweisung)

| # | Finding | Warum | Owner |
|---|---------|-------|-------|
| **C1** | Impressum-Platzhalter (Name/Adresse) | Adresse eines Minderjährigen — Schutz-Entscheidung | Du + Eltern (heute Abend) |
| **I1** | „Pro"-Namens-Kollision (frei vs. Mark Janzen 997 €) | Strategische Entscheidung (Mark-Janzen-Pivot) | Du |
| **I6** | Kein Foto/Gesicht | Eltern-Entscheidung (13 J.) | Du + Eltern |
| **I7** | 3 Nurture-Mails fehlen | Hängt von I1 ab | Du (nach I1) |
| **I8/I9/I10** | Gate-Friktion · hartkodierte Metriken · Social-Audit | Braucht deinen Input bzw. echte Daten | Du |

## 🤔 Deferred — ich halte zurück, brauche dein Urteil

| # | Finding | Warum zurückgehalten |
|---|---------|----------------------|
| **NTH** | Italic-Cormorant-Akzent überstrapaziert | **Kein sicherer mechanischer Edit.** „Ein Heading pro Seite behält den Akzent" ist eine Design-Entscheidung über 3 Seiten mit **zwei** verschiedenen Mechanismen (`.t-display-italic` in Bio/Pro vs. `.section-number` im Playbook). Risiko, den austarierten Look flacher zu machen. Sag mir pro Seite, welches Heading den Akzent behält — dann setze ich es um. |

---

## Vorher / Nachher

- **Story-Frames:** `.marketing-review-artifacts/story-output/` (vorher, Gold-auf-Schwarz) ↔ `…/story-output-after/` (nachher, Indigo-auf-Snow). Der `cta`-Frame zeigt den Unterschied Creme-Glow → kühler Periwinkle-Glow am deutlichsten.
- **Playbook:** Audit-Full-Page (`screenshots/playbook-desktop-full.png`, leerer Mittelteil) ↔ `screenshots-after/playbook-desktop-nojs-full.png` (kompletter Body, **ganz ohne JS**).
- **Pro-Footer / Karten:** `screenshots-after/pro-desktop-after-full.png` zeigt „Etwas Echtes."-Schluss + die jetzt sichtbaren `glass-subtle`-Karten.

⚠️ **Wichtig zu C2:** Der Repaint betrifft nur die **Palette**. Die Demo-Frames zeigen weiter `TAG 55` und `+142 neue Follower` — das sind Platzhalter in `render_story_demo()` (die separaten Daten-Honesty-Findings aus dem Review, **nicht** Teil dieses Auftrags). Beim echten Posten mit realen `--day`/`--metric`-Werten rendern.

---

## Empfehlungen für dich

1. **C1 heute Abend mit Eltern** — die Templates (`IMPRESSUM-FILL-TEMPLATE.md`, `DATENSCHUTZ-VERANTWORTLICHER-TEMPLATE.md`) liegen bereit; das ist der einzige echte Blocker vor Traffic.
2. **I1 entscheiden** (das „Pro"-Naming) — daran hängt I7 (Nurture-Mails). Bis dahin sind beide bewusst offen.
3. **Frames auf echtem Handy gegenchecken** vor Posting-Ramp: Sticker-Safe-Zone live in der IG-App, und reale Journal-Daten statt der Demo-Platzhalter rendern.
4. **Italic-Cormorant:** sag mir pro Seite das eine Akzent-Heading → ich setze die Zurückhaltung um (5 min).
5. **Live-Check** (aus dem Review offen): `oskarmarketing.de` in echtem Browser öffnen und prüfen, dass die Hero-Eyebrow „TAG 32" rendert (nicht der leere Fallback).
6. **Integration/Push:** Web-Fixes liegen auf `fix/marketing-review-autonomous`, der Story-Repaint auf `affiliate_autopilot @ feat/story-frame-types`. Beide **nicht gepusht** — du entscheidest, wann gemerged/gepusht wird.

---

## Git-Status (Endstand, nicht gepusht)

**Web-Repo** `oskar-bio-website` @ `fix/marketing-review-autonomous`:
```
71dceca fix(playbook): render lead-magnet body without JS + de-risk CTA copy
87ff8ee fix(brand): swap 'Imperium.' closer for 'Etwas Echtes.' + drop Gold-Cluster from share meta
b2fc363 fix(pro): strengthen glass-subtle so cards read as a distinct tier
```
Working Tree: nur untracked Artefakte (`MARKETING-REVIEW-REPORT.md`, `MARKETING-FIX-REPORT.md`, `.marketing-review-artifacts/`). Keine weiteren Quellcode-Änderungen offen.

**Schwester-Repo** `affiliate_autopilot` @ `feat/story-frame-types`:
```
461e176 refactor(stories): repaint frames gold->indigo-snow to match web brand (C2)
```
Working Tree: keine offenen tracked Änderungen (re-renderte PNGs sind untracked).
