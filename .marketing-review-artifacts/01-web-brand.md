# Lane 1 — Web-Brand Visual Audit

Audited: local production build (vite preview) of branch `fix/ultra-review-autonomous`, screenshots in
`.marketing-review-artifacts/screenshots/`. Desktop 1920x1080, mobile 375x812. Live comparison via
WebFetch of https://oskarmarketing.de (static HTML, JS NOT executed — see caveat in F8).

Verdict in one line: the visual system is genuinely strong and coherent — editorial indigo-watercolor,
Cormorant display, real restraint — but it ships with a **placeholder-filled Impressum** (legal/trust
risk) and one undocumented body font, and several first-impression / hierarchy weaknesses cost conversion.

---

## Per-page first-3-seconds + hierarchy + type + whitespace + colour

### HOME (`home-desktop-fold.png`, `home-mobile-fold.png`, `home-desktop-full.png`, `home-mobile-full.png`)
- **First 3 s:** Giant Cormorant "Oskar" / italic indigo "Marketing" split across a periwinkle watercolour
  cloud. Looks premium and on-brand. BUT the hero communicates a *name*, not a *value proposition* — what
  Oskar does is buried in small italic body copy lower-left: "Affiliate-Marketing das nicht aussieht wie
  Affiliate-Marketing." (`home-desktop-fold.png`). A cold visitor in 3 s sees a stylish name and a cloud,
  not "what's in it for me." See F2.
- **Hierarchy:** Desktop fold is well balanced — name top-left, "Marketing" mid-right, CTAs bottom-right
  ("Playbook lesen" filled indigo + "Pro-Beratung →" outline, `home-desktop-fold.png`). Mobile stacks
  cleanly: Oskar / Marketing / tagline / two stacked CTAs (`home-mobile-fold.png`). No breakage.
- **Typography:** Cormorant Garamond renders correctly at display sizes (elegant, high-contrast serif).
  JetBrains Mono used for eyebrows/labels ("EDITION 01 / 2026", "TAG 32 / BRAND PIVOTED",
  `home-desktop-fold.png`). Rhythm is good. The proof-strip numbers ("7.600", "10", "60", "100") in the
  full view (`home-desktop-full.png`) are large indigo Cormorant — clean.
- **Whitespace:** Generous, editorial, confident. Full-page (`home-desktop-full.png`) shows consistent
  large section gaps — the strongest page for breathing room.
- **Colour:** On-spec. Snow base `#F5F7F8`, indigo `#5B5BD6` ink + periwinkle `#A8A8FF` watercolour wash
  match tokens.css (`src/styles/tokens.css:3,8,10`). The mesh/cloud background is the signature element.

### PRO (`pro-desktop-fold.png`, `pro-mobile-fold.png`, `pro-desktop-full.png`, `pro-mobile-full.png`)
- **First 3 s:** "Mark Janzen / *Pro Mentoring*" in big Cormorant (`pro-desktop-fold.png`). This is the
  single most important brand-coherence issue: the hero of Oskar's site headlines **someone else's name**
  (Mark Janzen). Confirmed in `pro/index.html:12` `<title>Mark Janzen Pro Mentoring</title>` and `:92-93`.
  See F1.
- **Hierarchy:** Strong. Mono tagline "Für ernsthafte Umsetzung · Direkter Zugang · 4 Monate"
  (`pro-desktop-fold.png`), single indigo CTA "Pro ansehen". The offer card mid-page ("Pro Mentoring",
  "ab 997 €", feature bullets) is well-defined glass card (`pro-desktop-full.png`, `pro-mobile-full.png`).
- **Affiliate compliance is actually CORRECT (a strength):** the digistore24 affiliate link
  (`pro/index.html:204` `?aff=Bestproducts99978`) carries `rel="noopener noreferrer sponsored"`
  (`:209`) AND a visible disclosure directly under the price: "Du wirst auf Digistore24 weitergeleitet.
  Ich erhalte eine Provision wenn du startest." (`pro/index.html:225-227`, visible in
  `pro-mobile-full.png`). This meets the CLAUDE.md affiliate rule. See F7 (strength).
- **Typography / whitespace / colour:** Consistent with home. "Pro ist für dich wenn" vs "Pro ist NICHT
  für dich wenn" two-column qualifier grid (`pro-desktop-full.png`) is a nice anti-hype editorial move.
  On-spec indigo.

### PLAYBOOK (`playbook-desktop-fold.png`, `playbook-mobile-fold.png`, `playbook-desktop-full.png`, `playbook-mobile-full.png`)
- **First 3 s:** "Dein *Start* in *4 Schritten*." with eyebrow "AFFILIATE MARKETING GUIDE" and a meta strip
  "SCHRITTE 4 / LESEDAUER 6 min / NIVEAU Start" (`playbook-desktop-fold.png`). Clear, honest, on-brand.
  Strongest *fold* of the three content pages for value clarity.
- **CAVEAT — body NOT assessable from screenshots:** `playbook-desktop-full.png` and
  `playbook-mobile-full.png` show the hero + footer and a vast BLANK middle. This is a scroll-reveal
  capture artifact, NOT a real content gap: `public/playbook.html:233` sets `.reveal{opacity:0}` until an
  IntersectionObserver adds `.visible` (`:1131`). The full-page screenshot fired before scroll, so all
  4 step cards / stats / diagrams (present in source, `public/playbook.html:835-867`) are invisible.
  I therefore CANNOT judge the playbook's mid-page hierarchy, rhythm, or mobile layout from these images —
  **needs human verification** (scroll the live page or re-screenshot with reveals forced visible). See F3.
- **Whitespace/colour (fold only):** On-spec snow + periwinkle wash top, indigo "OM" monogram top-right.

### IMPRESSUM (`impressum-desktop-fold.png`, `impressum-mobile-fold.png`)
- **First 3 s:** Large Cormorant "Impressum", mono "STAND: 11. MAI 2026" — visually clean and on-brand.
- **CRITICAL CONTENT BUG:** a pink-bordered note block is publicly rendered reading
  "[PLATZHALTER] Oskar trägt die fehlenden Felder ... morgens manuell ein und committed."
  (`impressum-desktop-fold.png`, `impressum-mobile-fold.png`), and the legal address shows literal
  placeholders "Oskar [Nachname]", "[Straße + Hausnummer]", "[PLZ] [Stadt]", plus "Telefon: [optional
  eintragen]". A German Impressum with placeholder name/address is non-compliant (§5 TMG) and reads as
  unfinished to any visitor. See F4. (Legal-compliance depth is Lane-3's call; flagged here as a
  *visible* brand/trust defect.)
- **Typography:** Section headings ("Angaben gemäß § 5 TMG", "Kontakt") are indigo Cormorant — but at
  this size the italic-ish serif headings sit oddly close in weight to body; legibility fine. Whitespace
  generous.

### DATENSCHUTZ (`datenschutz-desktop-fold.png`, `datenschutz-mobile-fold.png`)
- **First 3 s:** Big two-line Cormorant "Datenschutz erklärung" — clean, matches Impressum styling.
- **Hierarchy/content:** Well structured — numbered indigo headings "1. Verantwortlicher", "2. Welche
  Daten erhebe ich?", responsible-party card, GitHub-Pages server-log disclosure with DSGVO Art. 6
  reference (`datenschutz-desktop-fold.png`). Reads finished and competent (contrast with Impressum).
- **Typography:** Body is the sans (DM Sans, see F5) — comfortable line length on desktop; mobile sets
  long body lines with good measure (`datenschutz-mobile-fold.png`). On-spec colour.

### 404 (`404-desktop-fold.png`, `404-mobile-fold.png`)
- **First 3 s:** Centred "Seite *nicht* gefunden." (italic indigo "nicht"), eyebrow "ERROR · 404", two
  CTAs "ZUR STARTSEITE" (filled indigo) + "PLAYBOOK" (outline), footer "OSKARMARKETING · BUILD IN PUBLIC"
  (`404-desktop-fold.png`, `404-mobile-fold.png`). This is the most *polished* page — perfectly centred,
  on-brand, recovery paths present. A genuine strength. See F6.

---

## Brand-coherence hunt

- **Indigo spec vs rendered:** consistent across all 6 pages. Accent `#5B5BD6`, periwinkle `#A8A8FF`
  decorative wash, snow `#F5F7F8`, ink `#0E1116` all match `src/styles/tokens.css:3-10`. No off-palette
  colours spotted. Strong.
- **Cormorant vs rendered:** Cormorant Garamond confirmed on every display heading (home/pro/404 heroes,
  legal H1s). JetBrains Mono confirmed on eyebrows/labels/meta strips. On-spec.
- **Undocumented third font (F5):** spec/CLAUDE.md say only "Cormorant Garamond + JetBrains Mono", but
  `src/styles/tokens.css:45` sets `--font-body: "DM Sans", "Inter", system-ui...`. Body copy across the
  site is therefore DM Sans, a third typeface the brand doc never names. Not visually wrong (DM Sans pairs
  fine with Cormorant), but it's a brand-governance gap: doc and code disagree.
- **Spacing/rhythm:** even and editorial on home/pro/legal/404. Playbook mid-page not assessable (F3).
- **Mobile breakage:** none found. All folds stack cleanly, no horizontal overflow, no cramped/clipped
  type, no broken hero in any `*-mobile-*.png`.

---

## Live (main) vs audited build — F8

WebFetch of https://oskarmarketing.de returned hero "Oskar Marketing", tagline "Affiliate-Marketing das
nicht aussieht wie Affiliate-Marketing.", same nav (00 Index … 09 Manifest), and same eyebrow STRING
"— TAG · / BRAND PIVOTED —" with **no number**. The audited build screenshot (`home-mobile-fold.png`)
clearly shows "TAG 32". This is NOT proof the live site is broken: WebFetch reads static HTML and does
not run JS; the number is injected by JS into `[data-pivot-day]` (`index.html:233-234`), so a blank "TAG ·"
in a no-JS fetch is EXPECTED. Today's derived value (PROJECT_START_DATE 2026-04-29 → 2026-05-30) = Tag 32,
matching the screenshot. Conclusion: live copy/structure MATCHES the audited build; whether the Tag number
actually renders for real (JS-enabled) visitors on production is **needs human verification** — open the
live site in a browser and confirm "TAG 32" appears, not "TAG ·". No other live-vs-build divergence found
in the fetched content.
