# MOBILE-FIX-REPORT — Tagline overflow, CTA centering, scroll-pin scope

Date: 2026-05-14
Branch: main

## Context

iPhone screenshot (390px viewport) showed three regressions in the editorial
hero:

1. The 4-line mono tagline (`BUILD IN PUBLIC`, `AFFILIATE MARKETING`, `TAG 015`,
   `VOM SYSTEM ZUM IMPERIUM`) was clipped at the right edge.
2. The `AFFILIATE ACADEMY →` CTA sat off-center to the right with the arrow
   half-hidden.
3. The scroll-driven letter-spread/word-drift animation extended past the hero,
   making sections 01–02 feel "still pinned" even though the hard pin had been
   removed in commit `5ccfc8b`.

All three bugs share a single root cause class: **GSAP overwrites `transform`
when it animates `y` or `opacity`, which destroys any CSS-level
`transform: translateX(-50%)` X-centering trick**. The previous mobile rules
relied on `left: 50%; transform: translateX(-50%)`, so on the very first
GSAP `set({ y: 8 })` the centering was wiped.

## Files changed

- `src/styles/hero.css` — tagline + CTA mobile geometry rewritten to center
  via `left: 0; right: 0` + (for CTA) flex `justify-content: center`, never
  via transform.
- `src/lib/editorialHero.ts` — ScrollTrigger `end` tightened from `"bottom 20%"`
  to `"bottom top"`.

---

## BUG 1 — Tagline right-overflow

### Before — `src/styles/hero.css`

```css
.hero--editorial .hero__tagline {
  position: absolute;
  bottom: clamp(64px, 10vh, 120px);
  left: clamp(20px, 10vw, 96px);
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.6vh, 8px);
  z-index: 8;
  opacity: 0;
  transform: translateY(8px);
  margin-top: 0;
  grid-column: unset;
  grid-row: unset;
}

@media (max-width: 768px) {
  .hero--editorial .hero__tagline {
    left: 50%;
    transform: translateX(-50%);   /* killed by GSAP set({y}) */
    bottom: 26vh;
    text-align: center;
    align-items: center;
  }
}
```

### After

```css
.hero--editorial .hero__tagline {
  position: absolute;
  bottom: clamp(64px, 10vh, 120px);
  left: clamp(20px, 10vw, 96px);
  max-width: calc(100vw - clamp(40px, 20vw, 192px));   /* never wider than viewport minus the two edge clamps */
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.6vh, 8px);
  z-index: 8;
  opacity: 0;
  transform: translateY(8px);
  margin-top: 0;
  grid-column: unset;
  grid-row: unset;
  text-align: left;
}

.hero--editorial .hero__tagline-line {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(10px, 0.75vw, 11px);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold-warm);
  white-space: normal;          /* never force nowrap that pushes past viewport */
  word-break: normal;
  overflow-wrap: normal;
}

@media (max-width: 768px) {
  .hero--editorial .hero__tagline {
    left: 0;
    right: 0;
    transform: translateY(8px);          /* X-centering moved off transform */
    bottom: 26vh;
    max-width: 100%;
    width: 100%;
    padding-inline: 1.5rem;
    text-align: center;
    align-items: center;
  }
}
```

**Why this fixes it:** the tagline now occupies the full viewport width with
1.5rem inset on each side, so its longest line ("VOM SYSTEM ZUM IMPERIUM" at
~280px including 0.3em letter-spacing) sits inside a known container of
`100vw - 48px`. `white-space: normal` makes overlong lines wrap rather than
overflow. The X-centering no longer uses a transform that GSAP will overwrite.

---

## BUG 2 — CTA right-aligned with clipped arrow

### Before — `src/styles/hero.css`

```css
.hero--editorial .hero__cta-wrap {
  position: absolute;
  bottom: clamp(64px, 10vh, 120px);
  right: clamp(20px, 10vw, 96px);
  z-index: 8;
  margin-top: 0;
  grid-column: unset;
  grid-row: unset;
  opacity: 0;
}

@media (max-width: 768px) {
  .hero--editorial .hero__cta-wrap {
    right: auto;
    left: 50%;
    transform: translateX(-50%);   /* killed by GSAP set({y: 12}) */
    bottom: 14vh;
  }
}
```

### After

```css
@media (max-width: 768px) {
  .hero--editorial .hero__cta-wrap {
    left: 0;
    right: 0;
    transform: none;          /* GSAP owns transform for the reveal */
    bottom: 14vh;
    width: 100%;
    padding-inline: 1.5rem;
    display: flex;
    justify-content: center;  /* flex centers the CTA, no transform needed */
  }

  .hero--editorial .hero__cta-wrap .cta {
    max-width: 85vw;
    margin: 0 auto;
  }
}
```

**Why this fixes it:** the wrap is now a full-width centering container that
uses flex (immune to GSAP's transform writes). The CTA itself is capped at
85vw so the `AFFILIATE ACADEMY →` label + arrow combo can never extend past
the viewport at 375px.

---

## BUG 3 — Scroll-driven animation lingered past hero

### Before — `src/lib/editorialHero.ts`

```ts
ScrollTrigger.create({
  trigger: hero,
  start: "top top",
  // bottom 20% = animation finishes when 80% of the hero has scrolled out.
  end: "bottom 20%",
  scrub: 1.5,
  ...
});
```

### After

```ts
ScrollTrigger.create({
  trigger: hero,
  start: "top top",
  // bottom top = animation completes exactly when the bottom of the hero
  // reaches the top of the viewport (i.e. hero is fully scrolled past).
  end: "bottom top",
  scrub: 1.5,
  ...
});
```

**Why this fixes it:** with `end: "bottom 20%"` the scrub range covered only
80% of one viewport-height — but the late-phase transforms (segC/segD) pushed
the words `-280px` upward, which on mobile (where the words are positioned at
~28vh and 42vh) made them feel like they were still moving after the user had
scrolled into Status Quo. With `end: "bottom top"` the entire scrub range maps
cleanly to the hero's own scroll distance, so by the time the user sees the
next section the hero animation is already at progress = 1 and idle.

---

## Verification checklist

- [x] Tagline strings `BUILD IN PUBLIC`, `AFFILIATE MARKETING`, `TAG NNN`,
      `VOM SYSTEM ZUM IMPERIUM` present in DOM (confirmed via WebFetch — strings
      already in index.html, the bug was CSS-only clipping).
- [x] CSS `max-width` on `.hero__tagline` is viewport-relative
      (`calc(100vw - clamp(40px, 20vw, 192px))` desktop, `100%` mobile).
- [x] `ScrollTrigger.create({ end: 'bottom top' })` — no `'+=N%'` anywhere in
      `src/lib/editorialHero.ts`.
- [ ] Build + push, then live re-verify at the three test widths (375 / 390 /
      414).
