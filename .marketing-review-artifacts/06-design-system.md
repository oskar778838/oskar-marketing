# Lane 6 — Visual Design-System Quality

Scope: `src/styles/tokens.css` (read in full) + skim of `base.css`, `hero.css`,
`sections.css`, `nav.css`, `pro-glass.css`. Compared the token system against the
rendered screenshots in `.marketing-review-artifacts/screenshots/`. Read: home
(desktop fold/full, mobile fold), pro (desktop fold/full, mobile fold/full),
playbook (desktop fold), 404 (desktop fold).

---

## 1. Token system is genuinely well-built (STRENGTH)

This is not a thrown-together palette. `tokens.css` has a real three-tier design
system that most adult freelancers never reach:

- **Fluid type scale** with `clamp()` from `--t-mono-xs: clamp(10px, 0.66vw, 11px)`
  through `--t-display-mega: clamp(96px, 17vw, 280px)` (tokens.css:49–58). Every
  heading in `sections.css` reads from these tokens, not hard-coded px.
- **8-pt spacing scale** `--s-1: 4px` … `--s-12: 256px` (tokens.css:61–72), used
  consistently for padding-block / gaps across every section rule.
- **Documented, accessibility-aware colour decisions.** The comments aren't decorative:
  `--muted: #5b606a` is annotated `5.8:1 on snow base (was rgba .75 ≈ 4.06:1, sub-AA)`
  (tokens.css:38) and `--muted-low` `4.65:1 ... (was ... 2.14:1, sub-AA)` (tokens.css:39).
  Someone actually checked contrast ratios against WCAG and fixed sub-AA values.

The rendered output matches the spec: `home-desktop-fold.png` shows the off-white
snow base (#F5F7F8), black "Oskar" in Cormorant, and the indigo italic "Marketing"
in the accent-deep tone — exactly what `--color-base` / `--pearl` / `--gold-warm`
prescribe. No drift between token intent and paint here.

## 2. Display / Body / Mono hierarchy IS applied consistently (STRENGTH)

The three-font system holds across every route I checked:

- **Display = Cormorant Garamond** for all H1/H2/stat numbers. `404-desktop-fold.png`
  is the cleanest demonstration: huge "Seite *nicht* gefunden." with the italic accent
  word, exactly as `.t-display` (base.css:75–81, `font-weight: 300`, `line-height: 0.92`)
  + `.t-display-italic` (base.css:83–88) define.
- **Mono = JetBrains Mono** for all eyebrows/labels: "ERROR · 404" (404 fold),
  "SECTION 01 / 2026" and "TAG 32 / BRAND PIVOT" (home folds), "OSKARMARKETING ·
  BUILD IN PUBLIC" footer. All match `.t-mono` / `.section-label` (base.css:90–97,
  209–219) with the 0.18–0.32em letter-spacing + uppercase.
- **Body = DM Sans** for running copy — visible in the FAQ body and stat notes.

One genuine inconsistency to flag: `tokens.css:45` declares
`--font-body: "DM Sans", "Inter", system-ui...`, but `CLAUDE.md` Brand section says
the body/display pairing is "Cormorant Garamond + JetBrains Mono" with no mention of
DM Sans. DM Sans is actually loaded and used as body — so the CLAUDE.md fonts line
is *out of date*, not the CSS. Worth one-line fixing the doc so the canonical fonts
list names all three (Cormorant / DM Sans / JetBrains Mono). Evidence: DM Sans is
the body var (tokens.css:45) and is preloaded/used in `playbook` and FAQ copy.

## 3. The "italic accent word" device is overused (IMPORTANT)

The signature move — black phrase + one indigo italic Cormorant word — appears on
nearly every heading: "Oskar *Marketing*" (home), "Mark Janzen *Pro Mentoring*" (pro),
"Dein *Start* in *4 Schritten*" (playbook-desktop-fold.png — note: TWO italic
accents in one 6-word headline), "Seite *nicht* gefunden" (404), "Erst gemeinsam
*klären*", "Pro ist *NICHT* für dich" (pro-mobile-full.png), "Tag für Tag bauen.
Stein für Stein. *Imperium.*" (home/pro footer). When the same typographic trick lands
on every single heading it stops being emphasis and becomes wallpaper — the eye no
longer registers which word is actually important. Concrete fix: reserve the
italic-accent treatment for ONE heading per page (the hero), and let secondary
section heads use plain Cormorant or weight contrast instead. The mechanism is in
`.t-display-italic` (base.css:83) + per-section `color: var(--gold-warm)` rules
(e.g. sections.css:170–174, 1165–1169) — no token change needed, just fewer uses.

## 4. Glass effects read PREMIUM, not muddy — with one caveat (STRENGTH + nice)

Concern going in was that stacking `backdrop-filter: blur(24–36px) saturate(180–220%)`
on a near-white base would produce flat grey mush. It does not. In
`pro-mobile-full.png` the `.glass-highlight` Pro-Mentoring card (pro-glass.css:33–52)
reads as a crisp, slightly-lavender frosted panel: the indigo top-edge specular
highlight (`::before` radial white at top, pro-glass.css:54–69) gives it real
visionOS depth, the `rgba(91,91,214,0.32)` border (pro-glass.css:42) separates it
cleanly from the snow background, and the "997 €" price + bullet list stay legible.
This is the most "expensive-looking" element on the site.

Caveat (nice-to-have): because the base is so light AND the glass fills are so light
(`.glass-subtle` = `rgba(250,251,252,0.5)`, pro-glass.css:24), the `.glass-subtle`
cards in the "Pro ist für dich / NICHT für dich" grid (pro-mobile-full.png) are
almost invisible against the page — they read as plain text blocks with a hairline
top border, not as cards. That's arguably fine editorially, but it means the
three-tier glass system (heavy/subtle/highlight) collapses visually to basically
two tiers: "the highlight card" and "everything else." If the subtle tier is meant
to read as a distinct surface, it needs a touch more border contrast
(`rgba(214,219,226,0.6)` border at pro-glass.css:27 is too faint on #F5F7F8).

## 5. Legacy --gold / --pearl / --obsidian aliases: clean, NO drift (STRENGTH)

This was the headline risk to check and it's handled correctly. tokens.css:16–41
re-points every legacy name at a new canonical token rather than leaving a parallel
palette:

- `--gold: var(--color-accent)` (#5B5BD6 indigo) — tokens.css:25
- `--gold-warm: var(--color-accent-deep)` (#4444B8) — tokens.css:32, with a 6-line
  comment explaining *why* "warm/brighter" inverts to "darker" on a light base. This
  is exactly the kind of reasoning that prevents drift.
- `--pearl: var(--color-ink)` (#0E1116) — tokens.css:35
- `--obsidian-0/1/3` alias to base/surface/line-subtle — tokens.css:20–23

I found **no** stale literal gold/obsidian hex values bleeding through in the
screenshots — every "gold" reference (rings in hero.css:76, strike line
sections.css:317, section-label bars base.css:225) renders indigo, confirming the
aliases resolve. The only non-aliased legacy literals are `--gold-deep: #2D2D8A`
(tokens.css:33) and `--pearl-rare` → `--color-glow-soft`, both intentional. This is
a textbook-clean palette migration. The one cost: a new contributor reading
`background: var(--gold)` in hero.css will be confused that it paints indigo —
the alias names actively mislead future-you. Long-term, a find-replace to
`--color-*` everywhere would remove the foot-gun, but nothing is broken today.

## 6. NO photo of Oskar anywhere — trust gap for a traffic ramp (IMPORTANT)

Verified in markup: `index.html` contains **zero** raster images in the body — the
only three `<img` string matches are all inside an HTML comment (index.html:216,
"the inline `<img src="logo.svg">` ... was dropped") plus OG-meta `content=` URLs.
The hero "avatar" is purely decorative: spinning ring divs + a radial glow, marked
`aria-hidden="true"` (index.html:220–223, styled hero.css:67–123). There is no face,
no founder photo, no real-world object anywhere — the entire visual world is
typography + the WebGL lamellae spiral + indigo watercolour gradient
(home-desktop-fold.png background).

Why this matters specifically here: the whole positioning is "Build-in-Public,
anti-Hype, ehrlich" (CLAUDE.md Brand) and the proof strip leans on real live numbers.
"Build in Public" with a faceless brand is a contradiction a skeptical visitor will
feel even if they can't name it — and the founder is a 13-year-old, which (handled
right, with parental framing) is the single most *differentiating, trust-building*
fact available and is currently invisible. This is not "add a stock photo" advice.
Concrete fix: one real, candid founder photo (or even a tasteful illustrated
portrait if a real photo raises minor-safety concerns) in the hero or an About
block would do more for conversion than any animation. Right now a first-time
visitor from TikTok has literally no human to attach trust to. Flagging as IMPORTANT
not critical because the brand is deliberately abstract/editorial — but for a
*traffic ramp-up* the absence of any human is a real cold-traffic conversion drag.
NEEDS HUMAN DECISION given the minor-safety dimension — this is Oskar + parents' call,
not a pure design fix.

## 7. Minor: periwinkle accent occasionally too light for text (nice)

`--color-glow: #A8A8FF` periwinkle is spec'd "decorative only" (CLAUDE.md), and the
code mostly respects that. But the italic accent word "nicht" in `404-desktop-fold.png`
renders in a very light indigo that sits low-contrast against the snow base at large
size it's fine, but the same light tone on smaller accent text would fail AA. Not a
current failure (the big 404 word passes by size), just a watch-item: keep text
accents on `--gold-warm`/`--color-accent-deep` (the darker 8.6:1 tone per
tokens.css:30) and never on `--color-glow` for anything below ~32px.

---

### Summary
The design *system* is excellent for a solo build — disciplined tokens, clean
legacy-alias migration with zero drift, consistent tri-font hierarchy, and glass
that genuinely reads premium. The weaknesses are editorial-restraint (italic accent
on every heading), one collapsed glass tier (subtle ≈ invisible), and the strategic
absence of any human face on a "Build-in-Public" brand entering a traffic ramp.
