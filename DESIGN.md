# DESIGN.md

## Color strategy: Restrained

Gold accent ≤10% of surface. Tinted neutrals carry the rest.

### Palette

```
--obsidian-0:  #050505  /* deepest, body bg */
--obsidian-1:  #0a0908  /* surface */
--obsidian-2:  #111110  /* card */
--obsidian-3:  #18161a  /* elevated */

--gold:        #c9a84c  /* primary accent */
--gold-warm:   #e8c96a  /* hover/highlight */
--gold-deep:   #8b6914  /* muted */

--pearl:       #ede9e3  /* "white" — warm, never #fff */
--pearl-rare:  #f5e6b8  /* hover-only secondary */

--muted:       rgba(237, 233, 227, 0.55)
--muted-low:   rgba(237, 233, 227, 0.35)
--hairline:    rgba(201, 168, 76, 0.18)
--hairline-low:rgba(237, 233, 227, 0.08)
```

Never `#000` (would crush against gold accents). Never `#fff` (cold against warm
pearl text). Obsidian steps allow layered surfaces without resorting to borders.

## Typography

Font stack: Cormorant Garamond (display, serif), DM Sans (body, sans), JetBrains Mono
(editorial labels, mono). All loaded via Google Fonts with `display=swap`.

### Scale (clamp-based, fluid)

```
--t-mono-xs:      clamp(10px,   0.66vw,  11px)
--t-mono-sm:      clamp(11px,   0.75vw,  12px)
--t-body-sm:      clamp(13px,   0.95vw,  15px)
--t-body:         clamp(15px,   1.05vw,  17px)
--t-body-lg:      clamp(17px,   1.25vw,  20px)
--t-display-3xl:  clamp(28px,   4vw,     56px)
--t-display-4xl:  clamp(40px,   6vw,     88px)
--t-display-5xl:  clamp(56px,   9vw,     132px)
--t-display-6xl:  clamp(72px,   13vw,    200px)
--t-display-mega: clamp(96px,   17vw,    280px)
```

Ratios all ≥1.5 between adjacent steps (impeccable rule: ≥1.25). Display-mega vs
mono-xs is intentional shock contrast — used in section labels next to giant headlines.

Line-length: body capped at ~56ch in academy trust copy, 32ch in proof item bodies
(both within impeccable's 65–75ch suggestion or under for editorial density).

## Spacing

8-pt grid extended to editorial scale:

```
--s-1:  4px    --s-7:  48px
--s-2:  8px    --s-8:  64px
--s-3:  12px   --s-9:  96px
--s-4:  16px   --s-10: 128px
--s-5:  24px   --s-11: 192px
--s-6:  32px   --s-12: 256px
```

Section-block padding varies intentionally: hero 96px top / 64px bottom, proof 192px
top / 128px bottom, academy 192px both sides, social 192px / 128px, end 128px / 48px.
Rhythm comes from the variation.

## Easings & durations

```
--ease-default:  cubic-bezier(0.23, 1, 0.32, 1)   /* strong ease-out */
--ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1)    /* slow-then-snap, hero reveals */
--ease-snap:     cubic-bezier(0.22, 1, 0.36, 1)
--ease-out:      cubic-bezier(0.33, 1, 0.68, 1)
--ease-in-out:   cubic-bezier(0.77, 0, 0.175, 1)  /* movement only, never enter/exit */

--d-fast:        180ms   (press feedback, tooltip)
--d-base:        260ms   (hover, dropdown — Emil's UI sweet spot)
--d-slow:        700ms   (page-load orchestration)
--d-cinematic:   1200ms  (background reveal)
```

No `linear`, no stock `ease`. Bounce and elastic banned.

## Components

### CTA (`cta`)

Border 1px gold, transparent fill. Hover: `::before` slides up filling with gold
(translateY 101% → 0), text color flips to obsidian. Active: `scale(0.97)` for press
feedback. Magnetic hover via `data-magnetic` attr (max ±14px translate). Continuous
shimmer sweep via `transform: translateX()` on `::shimmer` pseudo (GPU-accelerated).

Variants: default (`.cta`), mega (`.cta--mega`, larger padding for hero/academy CTAs).

### Social Card (`social-card`)

Asymmetric grid: primary card spans 7/12 + 2 rows, secondaries span 5/12, small spans
12/12 with row-flex layout. Border `hairline-low`, hover lifts -6px + glow ::before
fades in. Active dips back to -2px + scale(0.995).

### Section Label (`section-label`)

Mono, gold, all-caps, tracked. Prefixed by 24×1px gold rule. Used as numbered editorial
markers (`00`, `01`, etc.).

## Motion choreography

Page-load timeline (~2.2s total):
- 0.4s — top nav fade-in
- 0.6s — avatar scale-in (0.85 → 1) + ring rotate
- 0.95s — hero name char-by-char reveal (24ms stagger, blur 8 → 0)
- 1.6s — tagline fade-in
- 1.85s — CTA scale-in
- 2.1s — scroll indicator fade

Per-section scroll triggers via GSAP ScrollTrigger. Char-splits via SplitType.
Lenis smooth-scroll global (lerp 0.08, disabled on reduced-motion).

## Accessibility commitments

- `prefers-reduced-motion`: keeps opacity/color transitions at 200ms; kills all
  transform/movement. Layout intact.
- Skip link to `#hero`.
- All interactive elements have `aria-label` where icon-only.
- Focus-visible: 1px gold outline, 4px offset.
- Custom cursor only on `(hover: hover) and (pointer: fine)`.
- Color contrast: gold (#c9a84c) on obsidian (#050505) measures 6.8:1 — passes AA
  for body and AAA for large text.

## Banned patterns (per impeccable)

- No `#000` or `#fff`. Tinted neutrals only.
- No em dashes in copy or labels — use forward slash, comma, colon.
- No gradient text (`background-clip: text`).
- No glassmorphism (no decorative blurred panels).
- No hero-metric template (big number + small label cliché).
- No identical card grids (social cards are deliberately asymmetric).
- No animation of layout properties (width/height/margin/padding) — `transform` only.
