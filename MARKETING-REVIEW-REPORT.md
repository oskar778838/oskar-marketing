# Marketing Ultra-Review — 2026-05-30 (Tag 32)

**Audit-Ziel:** lokaler Production-Build (`vite preview`) von Branch `fix/ultra-review-autonomous` — exakt das, was beim nächsten Deploy live geht. 6 Routen × Desktop (1920×1080) + Mobile (375×812), plus die 4 Story-Frames des Generators (`affiliate_autopilot/make_slides.py`) und 5 Wettbewerber per Live-Fetch.
**Methode:** 10 parallele Sub-Agents (eine Lane je Thema), jede Behauptung mit Beleg (Screenshot-Datei, `Datei:Zeile`, Wettbewerber-URL). Befunde der Kern-Lanes (Impressum-Platzhalter, Verbotswort, Gold-Story-Palette, Metriken, „Imperium.", Affiliate-Setup) wurden vom Orchestrator **eigenhändig gegen den Quellcode gegengeprüft** — sie stimmen.
**Honesty-Mode:** TikTok & Instagram waren maschinell **nicht** auditierbar (TikTok JS-gated + SocialBlade 403; Instagram HTTP 429). Alle On-Platform-Aussagen sind als „needs human verification" markiert — **keine** Follower-/Engagement-Zahlen wurden erfunden.

---

## Executive Summary

**Top-3-Risiken vor dem Traffic-Ramp-up**

1. **Das Impressum ist live mit Platzhaltern** (`[PLATZHALTER]`, `Oskar [Nachname]`, `[Straße + Hausnummer]`). Das ist sowohl ein §5-TMG-Compliance- als auch ein direktes Vertrauensproblem — ausgerechnet auf einer Seite, die mit „ehrlich" wirbt.
2. **Die einzige einsehbare Social-Ausgabe (Story-Frames) ist Gold-auf-Schwarz** — also genau die Tate/Gadzhi-Ästhetik, von der das Web-Brand laut eigenem Journal *weg*pivotet ist. Da der Ramp-up über Social läuft, untergräbt **jede** Story-Impression die Web-Positionierung.
3. **Die zwei „Pro"-Dinge kollidieren:** Oskars kostenloses „Pro-Beratung"-Gespräch und Mark Janzens kostenpflichtiges „Pro Mentoring" (997 €, Affiliate) teilen sich fast denselben Namen *und* denselben Cal-Slug — daneben eine ungeklärte 5 €-vs-997 €-Preisleiter. Die Differenzierung lebt nur im Wrapper; am Punkt, wo Geld fließt, verkauft die anti-Hype-Marke ein Gold-Cluster-Produkt.

**Gesamtzustand: 🟠 ORANGE** — Das visuelle System, die Stimme und der Build-in-Public-Zähler sind echte, seltene Assets; die Marke ist *dort am stärksten, wo sie nichts kostet (Look, Voice, Tag-N) und am schwächsten, wo sie konvertieren muss.* Kein struktureller Totalschaden, aber drei Defekte müssen vor dem Skalieren weg.

**Wenn Oskar nur EINE Sache fixt:** Den **Story-Generator von Gold-auf-Schwarz auf Indigo-auf-Snow umfärben** (`make_slides.py:65-66`, drei RGB-Konstanten). Es ist einzeilig-billig, voll verifiziert (nicht hinter unscrapebaren Plattformen versteckt) und schließt die größte Marken-Bruchstelle: Solange die Social-Oberfläche die Web-Oberfläche kontert, arbeitet jede TikTok-Impression im Ramp-up *gegen* die Marke, die der Rest mühsam aufgebaut hat.

---

## 🔴 Critical (vor Traffic-Skalierung)

| # | Finding | Wo | Evidenz | Vorschlag |
|---|---------|-----|---------|-----------|
| C1 | **Impressum rendert öffentlich Platzhalter statt echter Pflichtangaben** — §5-TMG-Verstoß + sichtbarer Vertrauensdefekt | `public/impressum.html:155-179`; `impressum-desktop-fold.png`, `impressum-mobile-fold.png` | Sichtbarer rosa Block: `[PLATZHALTER] Oskar trägt die fehlenden Felder … ein und committed.`; Adresse zeigt `Oskar [Nachname]` / `[Straße + Hausnummer]` / `[PLZ] [Stadt]` / `Telefon: [optional eintragen]`. | Vor jedem Traffic echte Pflichtangaben eintragen, Dev-Note entfernen. **⚠️ Minor-Safety:** Oskar ist 13 — eine öffentliche Privatadresse eines Minderjährigen ist selbst ein Schutzproblem. Das ist eine **Eltern-Entscheidung** (Elternteil als Verantwortlicher / ladungsfähige Adresse). Templates existieren bereits (`IMPRESSUM-FILL-TEMPLATE.md`, `DATENSCHUTZ-VERANTWORTLICHER-TEMPLATE.md`) → der Schritt ist bekannt, aber **noch nicht ausgeführt**. |
| C2 | **Story-Frames sind Gold-auf-Schwarz — die Ästhetik, von der das Web-Brand explizit weg-pivotet ist** | `make_slides.py:65-66` vs `tokens.css:3,8,10`; `story_hook.png`, `story_cta.png`, `story_value.png` | Frames nutzen `COLOR_DARK_BG=(5,5,5)` + `COLOR_GOLD=(201,168,76)`. Web-Brand = `--color-base #F5F7F8` + `--color-accent #5B5BD6`. `journal.ts` Tag 17: „Gold ist nicht mehr Distinktion sondern Tarnung"; CLAUDE.md: „pivot … gold-cluster → premium-tech indigo". Eigenhändig im PNG bestätigt: schwarzer Grund, goldes „TAG 55"/„OM". | 3 RGB-Konstanten tauschen und neu rendern: BG → Snow `#F5F7F8`, Text → Ink `#0E1116`, Gold → Accent `#5B5BD6` (große Statzahlen `#4444B8` für Kontrast). Falls bewusster Light-Web/Dark-Social-Split gewollt: **dokumentieren** und Indigo-Hue als geteilten Akzent behalten — sonst sind es zwei Marken. |
| C3 | **Lead-Magnet-Body ist ohne Scroll-JS unsichtbar — und die #1-Traffic-Quelle ist der riskanteste Browser dafür** | `public/playbook.html:233` (`.reveal{opacity:0}`) + `:1122-1131` (IntersectionObserver); `playbook-desktop-full.png` | Alle 4 Step-Sektionen sind `.reveal` (opacity:0), erst per Observer beim Scrollen sichtbar. Die Bio warnt selbst, dass TikTok/Instagram-In-App-Browser JS brechen (`index.html:71-78`), und TikTok ist die erklärte #1-Quelle (`playbook.html:932`). Im Full-Page-Screenshot: Hero + Footer, dazwischen leer. | `.reveal` standardmäßig **sichtbar** machen, Animation als Progressive Enhancement (Reveal via `js`-Klasse auf `<html>` / No-IO-Fallback). Inhalt darf nie vom Observer abhängen. **Auf echtem Gerät im TikTok-In-App-Browser verifizieren** — ist die konditionale Annahme falsch, sinkt das auf 🟠. |

---

## 🟠 Important (diese Woche)

| # | Finding | Wo | Evidenz | Vorschlag |
|---|---------|-----|---------|-----------|
| I1 | **Zwei „Pro"-Angebote kollidieren in Name & Buchung** — Oskars *kostenlose* „Pro-Beratung" vs Mark Janzens *997-€-*„Pro Mentoring" (Affiliate) | `index.html:266,476` vs `pro/index.html:12,92-93`; gleicher Cal-Slug `index.html:571` + `pro/index.html:341` | Homepage verkauft Oskars Gratis-Call „Pro-Beratung"; `/pro/` ist betitelt `Mark Janzen Pro Mentoring`, 997 €, CTA → `digistore24.com/product/583561?aff=Bestproducts99978`. Beide Buchungen treffen denselben Slug `opheck-gmx.de/pro-beratung`. FAQ erwähnt das 997-€-Mentoring nie. | Homepage-CTA umbenennen (z. B. „Kostenloses Strategie-Gespräch · 30 Min"), „Pro" nur für `/pro/` reservieren. **Affiliate-Wahrheit zur Position machen, nicht zur Fußnote:** „Mark Janzens Programm — meine Empfehlung, und so verdiene ich daran." Radikale Transparenz ist in dieser Nische der einzige Move, den das Cluster nicht kopieren kann. |
| I2 | **5 €-vs-997 €-Preisleiter wird nie erklärt** — wirkt wie Köderpreis | `playbook.html:1085,1090` (Produkt 583562, „Ab 5€") vs `pro/index.html:201,204` (Produkt 583561, „997 €") | Zwei verschiedene Digistore-Produkte, beide als „das System" framebar, 200×-Sprung ohne Tripwire→Core-Erklärung. | Leiter explizit benennen (5 € Einstieg → 997 € Pro) in einem Satz, oder nur ein Produkt verkaufen. |
| I3 | **Verbotswort „Günstiger" auf dem Geld-CTA** | `public/playbook.html:1086` | „Günstiger als ein Mittagessen …". CLAUDE.md verbietet „günstig" ausdrücklich. Einziger Live-Treffer (der in `reference/` ist Archiv). | Ohne Preis-Vergleichswort umschreiben: „5 € Einstieg — du entscheidest selbst, ob du dabei bleibst." |
| I4 | **„Imperium." als Schluss beider Manifeste** — der kanonische Gold-Cluster-Marker | `index.html:963`, `pro/index.html:373` | Beide enden „Tag für Tag bauen. Stein für Stein. *Imperium.*" — Tate/Gadzhi-Register, gegen das `index.html:353` „System statt Hype" antritt. | Ein Wort tauschen → Build-Register (z. B. „Etwas Echtes." / „Stück für Stück."). Höchstes Signal pro Aufwand. |
| I5 | **Home-Hero kommuniziert in den ersten 3 Sek. einen Namen, kein Angebot** | `home-desktop-fold.png`, `home-mobile-fold.png`; `index.html:233-251` | Fold zeigt riesiges „Oskar / Marketing" über Aquarell; die Differenzierungs-Zeile „Affiliate-Marketing das nicht aussieht wie Affiliate-Marketing." steht klein unten links. | Differenzierungs-Zeile als größere, kontraststarke Sub-Headline direkt unter „Marketing" hochziehen — der 3-Sek-Test muss das *Angebot* gewinnen, nicht den Namen. |
| I6 | **Kein Foto/Gesicht von Oskar + fast kein Drittparteien-Beweis** — Vertrauenslücke für eine Personenmarke | `index.html:216-223` (Hero-Avatar nur deko-Ringe, `aria-hidden`); `:283,328` (Stats) | Null Body-Raster-Bilder; stärkste Zahl „100 Sales bis Q3 2026" ist als „Ziel" gelabelt; keine Testimonials/Logos. „Build-in-Public/ehrlich" — aber gesichtslos. | Ein echtes Foto + Ein-Zeilen-Who/Why nahe Hero; reale Resultate als Beweis zeigen, *sobald* sie existieren. **⚠️ Minor-Safety:** Gesicht eines 13-Jährigen online ist Eltern-Entscheidung — Alternative: illustriertes Porträt / Build-Log-Timeline als Vertrauensanker statt Foto. |
| I7 | **997-€-Pro-Seite ist verwaist + die versprochenen 3 Nurture-Mails fehlen im Repo** | `pro/index.html:10` (noindex,nofollow); `docs/brevo-doi-template.html:159-163` | DOI-Mail verspricht „in den nächsten Tagen drei Mails"; einziges E-Mail-Asset ist die DOI-Vorlage. `/pro/` wird von Bio/Playbook nie verlinkt → 997-€-Angebot hat keinen Inbound-Pfad. Zusatz: Der Buchungs-Gate speichert die 3 Antworten **nur in localStorage** (`bookingGate.ts:8-13`) — sie werden nie an Oskar übertragen. | Die 3 Mails bauen (oder nicht mehr versprechen), mindestens eine führt zu Pro/Booking; Link Playbook/Bio → `/pro/`. **Human-Verify:** Liegt die Sequenz nur im Brevo-Dashboard? |
| I8 | **Buchungs-Gate erzwingt Pflicht-Freitext, bevor irgendein Slot sichtbar wird** | `index.html:533-539` (required textarea), `:548` | Höchste-Intent-Aktion (Slots sehen) ist hinter „Was willst du in 90 Tagen erreichen?" + 2 Radiogruppen verriegelt — für kalten/frühen Funnel viel Friktion. | Qualifizierung behalten, aber Freitext **optional** machen, damit der Kalender nicht hinter einem Satz verschwindet. |
| I9 | **Selbstgemeldete TikTok-Zahlen sind hartkodiert — neben „Hardcoded Lügen: 0"** (Anti-Hype-Risiko) + 0,66 % View-to-Profile als messbarer Hebel | `public/data/metrics.json:5-35` | `TikTok Views (60 Tage): 28000` und `Profile Views: 185` (= ~0,66 %) sind statisch (`"updated":"2026-05-17"`), direkt neben `Hardcoded Lügen: 0`. *(Nuance: `Tage gebaut` ist `computed:"buildDay"` → rendert live Tag 32, ist also korrekt derived; nur die TikTok-Zahlen sind statisch.)* | TikTok-Zahlen aus TikTok-Analytics auf Kadenz ziehen oder exakte Werte droppen. Wenn 0,66 % real: Videos mit explizitem „Profil in Bio"-CTA beenden, First-Frame-Hook A/B-testen. |
| I10 | **Social-Präsenz (TikTok/IG) ist nicht auditierbar — muss vor dem Ramp menschlich geprüft werden; der IG-Bio-Link ist der unbestätigte #1-Conversion-Pfad** | TikTok JS-gated + SocialBlade 403; IG HTTP 429; `AGENT-TEAM-MASTER.md:197`, `MORNING-STEPS.md:50` | WebFetch lieferte nur Page-Chrome; kein Google-Index für `@oskarmarketing`. Ops-Docs *nehmen an*, der IG-Bio-Link zeige auf `oskarmarketing.de/?utm_source=instagram…` — unbestätigt. | **Mensch (eingeloggt)** prüft: Bio-Link-Ziel, Grid-Konsistenz (Indigo/Cormorant), Highlights, Hook-Qualität, Kadenz. Direkt-Link (kein Linktree) beibehalten. **⚠️** DM-Buttons (`index.html:609-624`): prüfen, ob Stranger-DMs an einen 13-Jährigen elterlich freigegeben sind. |

*Zurückgestuft, um „Important" diszipliniert zu halten (Details in den Fragmenten):* „+142 neue Follower"-Platzhalter in der Demo-Render-Funktion (`make_slides.py:1284`, verletzt die No-Invented-Data-Regel, aber nur bei versehentlichem Demo-Pfad live) · Italic-Cormorant-Akzent auf *jeder* Überschrift überstrapaziert (`base.css:83` — Betonung wird Tapete) · DM Sans ist das echte Body-Font (`tokens.css:45`), aber CLAUDE.md nennt nur „Cormorant + JetBrains" (Doc-vs-Code-Drift).

---

## 🟡 Nice-to-have (Backlog)

- **`.glass-subtle`-Tier nahezu unsichtbar** auf Snow-Grund (`pro-glass.css:23-31`) — Drei-Tier-Glas kollabiert auf zwei; Border-Kontrast anheben oder Tier streichen.
- **Periwinkle `--color-glow #A8A8FF` als Text** fällt unter ~32 px durch AA (`tokens.css:10`) — Text-Akzente auf `--color-accent-deep` halten.
- **„Mark's"** englischer Genitiv-Apostroph (`playbook.html:1063`) → „Marks".
- **Inkonsistente Mark-Kadenz:** „fast jeden Tag" (`playbook.html:1071`) vs „3× pro Woche" (`pro/index.html:148`) — auf den wahren Wert angleichen.
- **„Vom Gold-Cluster" in OG/Twitter-Meta** (`index.html:22,30`) pflanzt kalten Besuchern genau die Assoziation, die der Pivot löschen will — aus Share-Preview entfernen, im Journal behalten.
- **Journal stale:** letzter Eintrag Tag 19 (`journal.ts`), live ist Tag 32 — Story-Auto-Frame stempelt sonst „TAG 19" gegen die Website.
- **Legacy `--gold`/`--pearl`/`--obsidian`-Aliase** funktionieren sauber, aber langfristig auf `--color-*` umstellen, damit `--gold` Contributor nicht in die Irre führt (malt Indigo).
- **OM-Monogramm** (`make_slides.py:1860`) ein paar px hochnudgen, damit es nie einen Ecken-Sticker anschneidet.

---

## 🟢 What's done well (mit Beleg)

- **Kohärentes Indigo-Watercolor-System über alle 6 Routen + poliertes 404.** Accent `#5B5BD6`, Periwinkle-Wash `#A8A8FF`, Snow `#F5F7F8`, Ink `#0E1116` rendern konsistent, keine Off-Palette-Farbe, kein Mobile-Overflow (`home-desktop-fold.png`, `404-desktop-fold.png`, `tokens.css:3-10`). **Das größte Asset der Marke — beschützen.**
- **Diszipliniertes Drei-Tier-Token-System, WCAG-kontrastgeprüft.** Fluid-Type-Scale per `clamp()`, 8-pt-Spacing, Kommentare dokumentieren AA-Fixes (z. B. `--muted` „5.8:1 on snow … (was … sub-AA)", `tokens.css:38`). Legacy-Alias-Migration ohne Drift.
- **`.glass-highlight` liest premium** — kristalline Lavendel-Frostpanel mit visionOS-Specular-Highlight (`pro-glass.css:33-69`, `pro-mobile-full.png`); das teuerst wirkende Element der Seite.
- **Eine echte, wiedererkennbare „Oskar-Stimme" — kein Guru-/AI-Template.** Disqualifizierende FAQ „Für wen ist das ausdrücklich *nicht*?" (`index.html:900`), gegen-das-eigene-Interesse-Aussagen („Ehrlich: wenn ich keinen Fit sehe, sag ich's." `:558`; „Mark garantiert dir nichts." `pro:303`). Macht Claims gegen sich selbst — das Eine, was Template-Guru-Copy nie tut. Native, flüssiges Deutsch.
- **Build-in-Public-„Tag N" ist an einen echten, abgeleiteten Zähler gebunden** (`getBuildDay()`, `config.ts:31-36` → heute Tag 32), nichts hartkodiert. **Ein echter Burggraben — kein profilierter Wettbewerber (Janzen, Gadzhi, Przybylski, Shiripour, Slusarek) publiziert einen Live-Tageszähler.**
- **Affiliate-Compliance + DSGVO-DOI-Haltung sind vorbildlich.** Beide Paid-CTAs `rel="sponsored noopener"` + sichtbare Offenlegung („Ich erhalte eine Provision", `pro:225`, `playbook:1096`); Worker lehnt Submits ohne Consent ab (`worker.ts:51`). Impressum nennt „Mark Janzen Affiliate Academy via Digistore24" (`:194-196`). **Ehrlicher als die meisten *erwachsenen* Marketer.**
- **Story-Frame-Handwerk ist stark** — zentrierte Italic-Cormorant-Komposition, code-erzwungene Sticker-Safe-Zone (240 px unten, `make_slides.py:53` + `assert_safe_zone()`), handgezeichneter Vektorpfeil (weil Cormorant U+2193 fehlt). **Nur die Farben sind falsch, nicht das Craft** — beim Umfärben 1:1 übernehmen.
- **Visuelle Achse (hell + indigo + editorial) ist echt off-axis** vom Gold/Schwarz-Cluster. Live-gefetchte Paletten: Finest Audience = Schwarz/Weiß + Gold-Kronen; Iman Gadzhi = Schwarz/Weiß-High-Contrast. Auf einem Thumbnail-Grid liest Oskars Look wie eine andere Spezies. **Die Light-Indigo-Lane ist in DACH-Affiliate-Coaching aktuell unbesetzt.**

---

## Strategische Position (in einem Paragraphen)

Oskars Marke ist eine helle, indigo-editoriale **„Build-in-Public"-Identität für kalte, affiliate-neugierige DACH-Einsteiger**, die ehrliche, anti-Hype-Affiliate-Orientierung verspricht („Affiliate-Marketing das nicht aussieht wie Affiliate-Marketing", `index.html:12`), **differenziert vom Gold/Schwarz-Guru-Cluster durch ein echt off-axis visuelles System** (`#F5F7F8` + `#5B5BD6`) **und einen live, code-abgeleiteten „Tag N"-Bauzähler** (heute Tag 32), den kein Wettbewerber publiziert — beides in Code verifiziert, nicht in Copy behauptet. **Stresstest:** Die Marke lebt auf drei Oberflächen, die *eine* Geschichte erzählen sollten, es aber nicht tun. **Web hält** (konsistentes System, echte Stimme). **Social bricht** (jeder Story-Frame Gold-auf-Schwarz — exakt das, was `journal.ts` Tag 17 verworfen hat; die Live-Grids sind unprüfbar). **Der Funnel punktiert die Position**, wo Geld fließt: das Flaggschiff-997-€-Tier *ist* Mark Janzens Digistore-Affiliate-Produkt — ein Produkt des Clusters, dem die Marke zu entkommen behauptet —, erreicht über eine nie erklärte 5 €→997 €-Lücke und ein Verbotswort am Geld-CTA. **Größte Bruchstelle:** Das ehrliche, anti-Hype-Indigo-Versprechen wird genau am einzigen Ort kontert, wo gezahlt wird. **Risiko: 🟠 ORANGE** — distinkt genug, um nicht im Cluster zu verschwinden (Look + Build-Log tragen), aber die *Glaubwürdigkeit* ist fragil und am Funnel punktiert. Die drei schärfenden Moves (Social umfärben · Affiliate-Wahrheit zur Position machen · „Imperium."/„Günstiger" tilgen) sind allesamt billig.

---

## Stats

- **Kanäle/Oberflächen reviewt:** Web-Build (6 Routen × 2 Viewports = 24 Screenshots), 4 Story-Frames + `make_slides.py`, 5 Wettbewerber live-gefetcht (Gadzhi, Przybylski/Finest-Audience bestätigt; Janzen/Shiripour/Slusarek teils gated). TikTok/Instagram/Threads: **Zugriff blockiert → human-verify**.
- **Screenshots:** 24 PNGs in `.marketing-review-artifacts/screenshots/` (Fold + Full, Desktop + Mobile je Route) + 4 Story-Frames in `.marketing-review-artifacts/story-output/`.
- **Sub-Agents:** 10 (9 Lanes parallel → 1 Synthese). Fragmente: `01-…10-*.md` (10 Dateien, je 1.038–2.121 Wörter, ~13.300 Wörter Rohmaterial).
- **Findings gesamt:** 57 roh → konsolidiert auf 3 🔴 / 10 🟠 (+ 3 zurückgestuft) / 8 🟡 / 8 🟢.
- **Token-Verbrauch (grob):** ~700k Sub-Agent-Output-Tokens + Orchestrator-Scouting/Verifikation ≈ **~780-820k Output-Tokens** gesamt.
- **Wall-Clock:** Workflow ~15,1 min; inkl. Scouting/Screenshot/Verifikation **~30 min** End-to-End.
- **Setup-Notiz (wichtig):** Ein verirrter Keilmann-Demo-Server belegte Port 4174 — die erste Screenshot-Charge traf versehentlich die *falsche* Seite. Erkannt (Titel „Keilmann GmbH"), korrigiert: alle 24 Shots auf verifiziertem Oskar-Server (Port 4191, Titel-Check je Route) neu erstellt.

---

## Deep-Dive-Kandidaten (lohnende Folgeläufe)

1. **Live-Social-Audit auf echtem Gerät (eingeloggt)** — der größte blinde Fleck. TikTok & IG: Grid-Konsistenz, Bio-Link-Ziel + UTM, Hook-Stärke der letzten 10-20 Posts, Kadenz, Talking-Head-vs-Slide-Mix, Story-Highlights. Plus Safeguarding-Check (Stranger-DMs an Minderjährigen).
2. **Playbook-Mid-Page-Render im TikTok-/IG-In-App-Browser** (echtes Gerät) — verifizieren, ob C3 real beißt oder konditional bleibt.
3. **Live `oskarmarketing.de` mit JS-Browser** — WebFetch lieferte „TAG ·" ohne Zahl (kein JS); bestätigen, dass live „TAG 32" rendert, nicht der leere Fallback. (Audit-Ziel war der lokale Branch-Build; `main`-Deploy kann abweichen.)
4. **Brevo-Nurture-Sequenz** — liegt (vermutlich) nur im Dashboard, nicht im Repo; gegen das „3 Mails"-Versprechen der DOI-Mail prüfen.
5. **Content-Seiten mit erzwungenem Reveal neu screenshotten** — für eine saubere Hierarchie-/Rhythmus-Bewertung des Playbook-Bodys (in dieser Charge durch `.reveal{opacity:0}` verdeckt).

---

*Working Tree: nur `MARKETING-REVIEW-REPORT.md` + `.marketing-review-artifacts/` neu. Keine Web-/Code-Dateien editiert. Nicht gepusht.*
