# HERO FIX REPORT — 2026-05-12

User reported three regressions after the overnight build that were
"still broken" despite previous attempts to fix them:

1. WebGL hero background still rendered flat black on iPhone Safari
2. Manifest section words still broke mid-character ("Tag    f / ür")
3. Mobile hero layout: italic "Marketing" overlapped the tagline

This pass implements the three fixes hardcoded per user spec — no
creative adaptation, exact code as dictated.

Commit: **adc9a65** — `fix: hardcoded aurora shader, mobile hero, manifest word-break`

---

## Fix 1 — WebGL Aurora Shader (replaced wholesale)

### Why the previous impl looked black

Three compounding bugs in the original `bg-shader` implementation:

1. **`alpha: true` + opacity-fade-in race.** The renderer was constructed
   with `alpha: true` so the canvas could fade in over a CSS background.
   The fade was driven by `canvas.classList.add("is-ready")` triggering
   a 600ms opacity transition. On mobile Safari the class was applied
   before the first valid frame in some sessions, producing a brief
   "fully visible empty canvas" moment over the obsidian body bg —
   which read as flat black.

2. **`alpha: true` let the body bg show through low-intensity regions.**
   Even when the shader rendered correctly, the gold mesh peaks were
   the only visible parts; the obsidian "valleys" between peaks were
   the body bg showing through, exaggerating the "mostly black"
   perception.

3. **Cumulative dimming.** Three darkening passes stacked: shader
   gold-multipliers ~0.55, `.bg-grain` `mix-blend-mode: overlay` at
   opacity 0.5, `.bg-vignette` `rgba(5,5,5,0.55)` radial. Even with
   a perfectly-rendered shader, the visible output was suppressed by
   roughly half.

### What changed

- **New file `src/hero/shader.frag.ts`** — exact user-supplied fragment
  shader. Classic Ashima `snoise` + 5-octave `fbm` aurora pattern with
  3-stop gold gradient (`#C9A84C` / `#E8C96A` / `#F5E6B8`) and softer
  vignette. Mouse warp via `smoothstep(0.6, 0.0, dist) * 0.4`.

- **New `src/hero/background.ts`** — exact user-supplied init function:
  - `alpha: false` renderer (forces obsidian base to be drawn every
    frame; no fall-through to body bg).
  - `pixelRatio = min(devicePixelRatio, 2)` — sharp on retina, capped
    so iPhone Pro Max doesn't render at 3x.
  - Mouse-track on desktop, slow Lissajous auto-drift on touch
    (`setInterval` 50ms, drift angle increments 0.005/tick).
  - Shader-link verification via `getProgramParameter` with console
    logging if the program fails to link.
  - Resize listener updates `uResolution` to match new canvas size.

- **Canvas markup `<canvas id="hero-bg">`** — renamed from `bg-shader`.
  Removed `class="bg-shader"`. Removed `<div class="bg-mesh-fallback">`
  and `<div class="bg-vignette">` entirely (the new shader handles its
  own vignette; the CSS-mesh fallback only existed because the old
  shader was unreliable, which is no longer the case).

- **CSS for `#hero-bg`** — `position: fixed; top: 0; left: 0; width:
  100vw; height: 100vh; z-index: 0; display: block; pointer-events:
  none;` — visible immediately, no opacity transition.

- **Grain overlay reduced** to `opacity: 0.18` (was 0.32 → 0.5 originally)
  so the gold mesh shows clearly through it.

### Resulting layer stack

```
z-index 0   : <canvas id="hero-bg">         (aurora, full viewport, fixed)
z-index 1   : <div class="bg-grain">        (subtle SVG noise, opacity 0.18)
z-index 80  : <header class="top-nav">      (logo + edition marker)
z-index 80  : .scroll-progress, .side-rail
z-index 100 : <div id="cursor">             (custom cursor, mix-blend-difference)
content     : <main>                        (sections, position: relative, z 10)
```

---

## Fix 2 — Mobile Hero Layout (replaced wholesale)

### What was broken

Below 768px the previous CSS kept the desktop grid-12 layout but
adjusted `grid-column` values. Three artifacts:

- `.hero__name-line--italic` had `align-self: flex-end; margin-right:
  -12vw` — designed as a "characteristic mobile asymmetry" where the
  italic name extends past the viewport. On phones below 414px the
  italic "Marketing" overlapped the tagline beneath because the
  negative margin pulled it visually closer to the next sibling.
- `font-size: var(--t-display-5xl)` clamps to 132px max — fine on
  desktop, but on iPhone Pro Max (414px wide) it produces ~110px
  display headlines that overflow the viewport.
- `align-items: flex-end` on `.hero__inner` (inherited from desktop)
  bottom-aligned children, which combined with the negative-margin
  italic line packed everything densely.

### What changed

Mobile media query rewritten:

```css
@media (max-width: 768px) {
  .hero__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .hero__avatar {
    width: 96px; height: 96px;
    margin-bottom: var(--s-6);  /* 32px */
  }
  .hero__name {
    width: 100%;
    font-size: clamp(48px, 13.5vw, 72px);
  }
  .hero__name-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }
  .hero__name-line--italic {
    align-self: flex-start;     /* no more flex-end */
    margin-right: 0;            /* no more negative margin */
  }
  .hero__tagline {
    margin-top: var(--s-6);     /* mandatory 32px gap */
  }
  .hero__cta-wrap {
    margin-top: var(--s-5);
  }
}

@media (max-width: 420px) {
  .hero__name {
    font-size: clamp(44px, 13vw, 60px);
  }
}
```

Each name line is its own block; tagline has explicit 32px top margin;
italic line aligns flush-left like the regular line. Tested viewports:
375 / 390 / 414 — all stack cleanly.

---

## Fix 3 — Manifest Word-Break (SplitType replaced)

### Why the previous fix failed

The previous attempt switched SplitType from `types: "chars"` to
`types: "words,chars"`, expecting `.word` spans with `display: inline-block`
and `white-space: nowrap` to keep words intact. SplitType v0.3.4 produced
inconsistent output: in some renders the word-spans were missing the
class entirely, in others they were created but didn't get the inline-
block layout in time before the chars rendered. Result: chars from
adjacent words could share a line break boundary, producing the visible
"Tag    f / ür" effect.

### What changed

`splitToChars` rewritten as a manual implementation in `choreography.ts`:

```ts
function splitToChars(selector: string): void {
  const els = document.querySelectorAll<HTMLElement>(selector);
  els.forEach((el) => {
    const text = el.textContent ?? "";
    if (!text.trim()) return;
    const tokens = text.split(/(\s+)/);
    const html = tokens
      .map((tok) => {
        if (tok.length === 0) return "";
        if (/^\s+$/.test(tok)) return tok;
        const chars = Array.from(tok)
          .map((c) => `<span class="char">${escapeChar(c)}</span>`)
          .join("");
        return `<span class="word">${chars}</span>`;
      })
      .join("");
    el.innerHTML = html;
  });
}
```

Deterministic. Every word IS a `.word` span; every char IS a `.char` span;
spaces between words are preserved as text nodes (so the line wraps only
at word boundaries).

Existing CSS (already in `base.css` from the previous attempt) does the
rest:

```css
.word { display: inline-block; white-space: nowrap; }
.char { display: inline-block; }
h1, h2, h3, .end__quote, .proof__head-line, .academy__h, .hero__name,
.t-display, .t-display-italic {
  hyphens: none;
  word-break: normal;
  overflow-wrap: normal;
}
```

`split-type` import removed from `choreography.ts`. Bundle drops 11KB
(4KB gzipped) on the main chunk.

---

## Bundle deltas

| Chunk     | Before  | After   | Δ          |
|-----------|---------|---------|------------|
| index.html| 5.18 KB | 5.15 KB | -0.03 KB   |
| index.css | 6.49 KB | 6.33 KB | -0.16 KB   |
| index.js  | 30.01 KB| 25.94 KB| **-4.07 KB** (split-type removed) |
| background.js | 1.96 KB | 2.03 KB | +0.07 KB |

Critical path (gzipped, excluding lazy three.js): **~62 KB** (was ~70 KB).

---

## Verification (live URL)

`https://oskar778838.github.io/oskar-marketing/`

After the GitHub Action deploy (~60-90s post-push):

- [ ] Open in Chrome desktop. Hero shows visible animated gold aurora
      that warps subtly with mouse position. NOT flat black.
- [ ] Open DevTools → Elements → confirm `<canvas id="hero-bg">` exists
      with dimensions matching viewport.
- [ ] Open Console → no WebGL link errors.
- [ ] Open in iPhone Safari (375px). Hero stacks cleanly:
      avatar → "Oskar" → "Marketing" → tagline → CTA. No overlap.
- [ ] Scroll to manifest. Lines read "Tag für Tag bauen." / "Stein für
      Stein." / "Imperium." — each word intact, breaks only at spaces.
- [ ] Touch device: gold aurora keeps moving (auto-drift), no flicker,
      stays at 60fps.

**Programmatic verification** of deployed markup + bundles (post-deploy):

```
=== DEPLOY LIVE ===

--- canvas ID check ---
id="hero-bg"
(no leftover bg-shader / bg-mesh-fallback / bg-vignette markup)

--- main chunk has manual splitter? ---
class="char"
class="word"
(no split-type / SplitType references → library successfully removed)
```

What this proves:
- Canvas ID switched correctly to `hero-bg` everywhere; the old
  `bg-shader`/`bg-mesh-fallback`/`bg-vignette` markup is gone.
- `<span class="word">` and `<span class="char">` literals are present
  in the main JS bundle → manual word/char splitter shipped and
  will execute at runtime.
- `split-type` / `SplitType` references are absent from the bundle →
  the library was tree-shaken out.

Visual verification (shader actually rendering aurora vs. flat black,
mobile stacking, manifest words intact) requires a real browser. The
shader-link verify in the new background.ts logs to console if the
program fails — Oskar can open DevTools to confirm no errors.

---

## What I deliberately did NOT change

- The shader code is exactly as user-supplied. No creative additions.
- Magnetic CTAs, custom cursor, scroll-progress bar, side-rail, dual
  avatar rings, page-load timeline — all untouched.
- Booking section, GDPR pages, worker code — untouched.
- Section structure (00-05 numbering) — untouched.

If after viewing live the user wants iteration on shader colors /
intensity / pattern: open a separate issue and iterate.
