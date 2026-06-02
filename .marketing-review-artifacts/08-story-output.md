# Lane 8 — Story-Generator Output Review

Scope: the four rendered story frames in
`.marketing-review-artifacts/story-output/` (`story_hook.png`,
`story_value.png`, `story_value_auto.png`, `story_cta.png`) and the generator
source `C:\Users\Oskar\affiliate_autopilot\make_slides.py`. Read-only.

---

## What the frames actually are

These are the `--story-demo` outputs of `make_slides.py`
(`render_story_demo()`, lines 1267-1302). Three are hard-coded demos at
`day=55`; the fourth (`story_value_auto.png`) is the auto-fill path that reads
the real `journal.ts` and rendered **TAG 19 / 10 / Commits**.

Format is 9:16, 1080x1920 (`STORY_W, STORY_H`, line 45). Palette:
`COLOR_DARK_BG = (5,5,5)` = `#050505`, `COLOR_GOLD = (201,168,76)` = `#C9A84C`
(lines 65-66). Display font Cormorant Garamond, mono DM Mono, sub-copy DM Sans
(lines 494-518). So the frames are **gold-on-near-black**.

---

## STRATEGIC CALL: the gold-on-black frames contradict the live web brand

This is the headline finding and I rate it **critical** — not because any single
pixel is wrong, but because the whole asset set is painted in the exact palette
the site spent a documented pivot escaping.

Evidence, both sides:

- **Web brand (verified):** `src/styles/tokens.css` line 8
  `--color-accent: #5B5BD6` (Electric Twilight indigo), line 3
  `--color-base: #F5F7F8` (Off-White Snow), line 10 `--color-glow: #A8A8FF`
  (Periwinkle). The site is light indigo-watercolor.
- **Story frames (verified):** `make_slides.py` line 65-66 — gold `#C9A84C` on
  black `#050505`. Zero indigo. Zero off-white. The accent is gold, the ground
  is black — the literal inverse of the web on both the hue axis and the
  light/dark axis.

Why this is not a defensible "dual-brand" split but an accident:

1. **The site's own journal frames the gold look as the enemy.** `journal.ts`
   Tag 17: `"Davon dark+gold": "11"` out of 12 competitors, lesson
   *"Gold ist nicht mehr Distinktion sondern Tarnung"* (gold is no longer
   distinction but camouflage). Tag 18-19 record the pivot to "Indigo + Snow"
   as the deliberate counter-move. The story generator paints every frame in
   the precise aesthetic the founder publicly declared he was abandoning. A
   visitor who reads the journal on the site and then sees the gold-black story
   will read it as either a relapse or a second person's brand.
2. **CLAUDE.md confirms the direction:** "pivot from Tate/Gadzhi-coded
   gold-cluster to premium-tech indigo (Tag 19)". The frames are still
   Tag-17-era.
3. The `make_slides.py` docstring (line 2) still describes the target as
   *"@oskarmarketing Stil … Dunkle Luxury-Fotos"* and lines 16-26 of tokens.css
   call the old gold system "dark-gold" that the site is inverting away from.
   The generator was simply never migrated when the web pivoted.

Concrete fix (cheap, because the generator is already token-driven): change
three constants in `make_slides.py` and re-render. `COLOR_DARK_BG` → the snow
base `#F5F7F8`, text ink → `#0E1116`, and `COLOR_GOLD` → `#5B5BD6` (or
`--color-accent-deep #4444B8` for the large stat numbers so they stay legible —
tokens.css line 32 already makes exactly that "emphasis = darker, not brighter"
argument for light grounds). The monogram, safe-zone, highlight-word logic, and
layout all carry over unchanged. This is a find-and-replace of ~3 RGB tuples,
not a rewrite. Note the gold-on-snow contrast would need a check (gold `#C9A84C`
on snow is low-contrast — that is *why* the fix should swap to indigo, not just
re-ground the existing gold).

If Oskar *wants* a deliberate two-surface system (light web / dark social), that
is a legitimate strategy — but then it must be **decided and documented**, the
social accent should still be the indigo `#5B5BD6` (shared hue = shared brand),
and the journal copy disowning gold needs reconciling. Right now nothing in the
repo declares the split, so it reads as drift, not design.

---

## Per-frame craft notes (these are good; the palette is the only real problem)

### `story_hook.png` — TAG 55 + italic Cormorant quote
- Composition is clean and genuinely on-brand-for-editorial: centered italic
  Cormorant *"Mehr Reichweite als gestern."*, gold `TAG 55` mono-caps header,
  1px gold hairline under it (lines 1010-1012, drawn at y=290). Typography
  spacing reads well; vertical centering via `(STORY_H - total_h)//2 - 20`
  (line 1018) lands the quote in the optical center.
- **OM monogram**: bottom-right, faint, correct (lines 1022, 572-587 — italic
  Cormorant, 60% gold opacity). Visible in the frame at far bottom-right.
- Nit (nice-to-have): there is a very large empty band between the hairline
  (y≈290) and the quote (y≈830). Intentional whitespace, defensible for an
  editorial look, but on a phone the header and quote feel disconnected.

### `story_value.png` — TAG 55 + "+142" + sub-label
- Big auto-fitted gold `+142`, sub-label *"neue Follower diese Woche · ohne
  Ads"* in muted grey (`_render_frame_value`, lines 1026-1062). The auto-fit
  (`_fit_font`, lines 969-978) sized the number to fill `STORY_W-160` nicely;
  the middle-dot separator in the sub-label is a tasteful editorial touch.
- **DATA-HONESTY FLAG (important):** `+142 neue Follower diese Woche` is a
  **fabricated demo number**, hard-coded in `render_story_demo()` line 1284. It
  is *not* sourced from `journal.ts`. If this template is ever shipped with the
  placeholder still in it, it publishes an invented follower stat — which both
  breaks the site's own "real numbers only" rule (`journal.ts` line 12
  *"`metrics` are real numbers from the real source. No invented data."*) and is
  a trust risk for a build-in-public account. The auto-fill frame exists
  precisely to avoid this; the danger is a human running the hard-coded demo
  values by mistake. Fix: make `value`/`hook` frames also refuse to render
  without either real `--metric` args or a journal pull, the same way the
  auto-path does.

### `story_value_auto.png` — TAG 19 / 10 / "Commits"
- This is the **honest** frame: `make_story(frame_type="value")` with no args
  (line 1295-1298) pulled the real latest entry. Verified against
  `src/data/journal.ts`: last entry is `day: 19`, first metric
  `{ label: "Commits", value: "10" }`. The render matches exactly — the
  journal-reader regex (lines 922-947) works.
- **STALE-DAY FLAG (important):** `getBuildDay()` for today (2026-05-30,
  anchored to `PROJECT_START_DATE 2026-04-29`) computes to **Tag 32** (verified
  by running the formula). But the newest journal entry is Tag 19. So the
  auto-frame proudly stamps "TAG 19" while the live site's hero/journal show Tag
  32 — a 13-day gap. This is a *content-freshness* problem in `journal.ts`, not
  a generator bug, but it surfaces here: an auto-generated story would announce
  a day that contradicts the website. And the three demo frames hard-code
  `day=55` (lines 1278/1283/1290), a day that does not exist yet — fine for a
  demo, dangerous as a copy-paste template.

### `story_cta.png` — TAG 55 + "Reels oder Stories?" + arrow
- Strongest composition of the four. Subtle gold radial glow top-right
  (`_render_frame_cta` glow loop lines 1071-1081), bold white Cormorant headline
  in the upper third, muted sub-line, and a hand-drawn gold down-arrow
  (`_draw_down_arrow`, lines 989-998) pointing at the safe-zone where the real
  IG sticker goes. The arrow-as-vector (not a font glyph) is a smart call — the
  comment at line 991-992 notes Cormorant has no ↓ glyph so it'd render tofu.
- The lower ~55% of the frame is empty. That is **deliberate and correct** here:
  it is the landing space for the interactive IG poll/question sticker the user
  adds in-app. Good system thinking.

---

## Sticker-safe-zone verification (PASS)

`STICKER_SAFE_ZONE_BOTTOM = 240` (line 53) → protected band is the bottom 240px,
i.e. everything below y=1680 on the 1920-tall canvas. `assert_safe_zone()`
(lines 56-62) throws if any content element's bottom exceeds 1680.

- All four frames rendered without raising — every content `_draw_*` call is
  followed by an `assert_safe_zone()` guard (e.g. lines 1020, 1053, 1059, 1091,
  1099, 1103). The CTA arrow is the lowest content element: drawn at `top_y=1500`
  with `length=110` (line 1102) → bottom y=1610, which is **70px clear** of the
  1680 line. Verified visually: in `story_cta.png` the arrow tip sits well above
  the bottom quarter.
- **One deliberate exception, correctly documented:** the OM monogram is placed
  *inside* the safe zone at `y = STORY_H - margin - size = 1920 - 32 - 28 = 1860`
  (line 583, `_draw_monogram_corner`). The source explicitly calls this out as
  "die einzige bewusste Brand-Ausnahme (60% Opacity, extreme Ecke)" (lines
  51-52). It is faint and corner-pinned, so real-world sticker collision risk is
  low. Acceptable — but worth knowing it technically sits in the reserved band,
  so if a user drops a sticker into the very bottom-right corner it could clip
  the "M".

Net: safe-zone discipline is real, enforced in code, and holds in all four
renders. This is a genuine strength.

---

## Cross-check on the broader brand fracture (context the task flagged)

The task context noted `pro/index.html` is a **Mark Janzen affiliate** page.
Verified: line 12 `<title>Mark Janzen Pro Mentoring</title>`, line 204
`href="https://www.digistore24.com/product/583561?aff=Bestproducts99978"`, line
201 price `997 €`, with `rel="noopener noreferrer sponsored"` (line 209) and an
aria-label disclosing "externes Angebot via Digistore24" (line 210). So the
disclosure/rel hygiene on that page is correct. I flag it here only because it
compounds the identity question: the brand surface is already split three ways —
indigo web, gold social frames, and an affiliated 997€ offer under a different
person's name. The gold story frames make the founder's *own* voice look like
yet another gold-affiliate clone, which is the specific trap `journal.ts` Tag 17
says he diagnosed. Tightening the social palette to the indigo system is the
single cheapest way to keep Oskar's own channel visibly distinct from both the
competitors and the affiliate offer.

---

## Honesty / limits

- I could fully read all four PNGs, the generator, `tokens.css`, `journal.ts`,
  `config.ts`, and `pro/index.html`. All colour/line/day claims above are from
  source or the rendered pixels, not assumed.
- I did **not** verify any live social-platform rendering (how IG actually crops
  1080x1920, where the sticker tray lands on a specific device). The 240px
  reserve is a sensible convention but device-specific safe areas
  **need human verification** on a real phone before a posting cadence ramps up.
- No real follower/engagement numbers were available or invented; `+142` is
  identified as a hard-coded demo placeholder, not a measured stat.
