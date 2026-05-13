# Forensic Audit — Brutally Honest Baseline

Datum: 2026-05-13

## Root Cause (alles andere ist symptomatisch)

**5 Commits sind lokal aber NICHT auf `origin/main` gepusht.** Damit ist die Live-Site
`https://oskar778838.github.io/oskar-marketing/` immer noch auf Commit
`6bf6718 feat: morning refinement complete …` — alle Behauptungen aus dem letzten
FEEDBACK-ITERATION-REPORT.md sind im lokalen Code **richtig** umgesetzt, aber
für den User unsichtbar weil nie deployed.

```
$ git status
On branch main
Your branch is ahead of 'origin/main' by 5 commits.

$ git log --oneline -8
8ad3a90 feat: feedback iteration G — spotlight, grid pattern, card border-gradient
2703426 feat: feedback iteration E+F+H — section motion, slot reconfig, DM sales
78d9417 feat: feedback iteration C+D — remove redundant wordmark, dropdown nav
9089e64 feat: feedback iteration A+B — slower scroll, intensified hero motion
fe5b5cb checkpoint: pre-feedback-iteration baseline
6bf6718 feat: morning refinement complete — scroll, animations, aurora, patterns   ← Live-Site
024085b feat: 7 editorial design patterns from genre reference
b4e3089 polish: aurora multi-layer + mouse-trail + scroll-reactive
```

GitHub-Action (`.github/workflows/deploy.yml`) triggert auf `push: branches: [main]` —
ohne push, keine Action, keine Deploy. Das ist die komplette Erklärung für „nichts
ist umgesetzt".

## File-by-File Wahrheits-Check

### 1. „OSKAR · MKTG" im Hero — Anzahl der Vorkommen

```
$ rg -n "OSKAR · MKTG|OV · OSKAR" index.html
123:         "OSKAR · MKTG" wordmark was removed (feedback iteration C) since
```

**Befund:** lokal **null** sichtbare Instanzen. Das `123:` ist ein HTML-Kommentar.
Vorher (vor commit 78d9417) gab es genau eine Instanz in
`hero__meta--tl > .hero__meta-label`. Die wurde komplett entfernt — was jetzt zu
weit ging: die neue User-Spec sagt „darf einmal stehen".

### 2. Lenis duration

`src/lib/smoothScroll.ts:22`:
```ts
duration: 2.5,
```
**Befund:** spec-konform 2.5. Vorher 1.2.

### 3. ScrollTrigger pin im Hero

`src/lib/editorialHero.ts:123-131`:
```ts
ScrollTrigger.create({
  trigger: hero,
  start: "top top",
  end: "+=180%",
  pin: hero,                  ← AKTIV — User will das raus (Fix B)
  pinSpacing: true,           ← AKTIV — User will das raus
  scrub: 2.5,
  …
});
```
**Befund:** pin ist noch drin. Fix B verlangt: pin entfernen, scrub-only behalten.

### 4. Dropdown-Nav — existiert?

```
$ rg -l "dropdown|nav-trigger|navMenu" src/
src/main.ts
src/lib/navMenu.ts
src/styles/nav.css
src/styles/tokens.css
```

`src/lib/navMenu.ts` (111 Zeilen, neu in 78d9417):
- toggle via aria-expanded
- Outside-click + Escape close
- IntersectionObserver für active-section gold-highlight
- Lenis-Smooth-Scroll on item-click

HTML in `index.html:125-166`: `top-nav__trigger` button + `#nav-dropdown` mit 7 items.

**Befund:** komplette Implementation existiert lokal. Live: nein, weil nicht
deployed.

### 5. Per-Section Animations

`src/lib/choreography.ts:357-489` `setupSectionMotionVariants()`:
- `.stat__num` letter-spacing scrub `-0.03em → +0.05em`
- `.proof__counter` letter-spacing scrub `0 → 0.08em`
- `.academy__h .word` direction-based reveal (left/right/up/down) + scroll-drift
- `.social-card` velocity-driven `rotateZ ±1.5°`
- `.end__quote .word` letter-spacing-tail
- `.stat`, `.proof__item`, `.academy__tracks .track`, `.social-card`,
  `.termin__h .char` haben jeweils eigene `gsap.from`-ScrollTrigger mit
  `duration: 1.8, ease: power4.out, stagger: 0.08`.

**Befund:** vollständig lokal vorhanden.

### 6. Counter-Animation — echtes Count-up?

`src/lib/counters.ts:33-47`:
```ts
const tween = { v: 0 };
const tweenInstance = gsap.to(tween, {
  v: target,
  duration: 1.4,
  ease: "power3.out",
  paused: true,
  onUpdate: () => {
    el.textContent = formatValue(Math.floor(tween.v), format);
  },
  …
});
```
**Befund:** echtes scrubbed `Math.floor`-Count-up, kein statischer Text. Bestand
schon vor dieser Iteration, war nie Fake.

### 7. Aurora-Shader — multi-Layer?

`src/hero/shader.frag.ts:74-86`:
```glsl
vec2 flow1 = vec2(stAspect.x + t * 0.6, stAspect.y - t * 0.45);
float n1 = fbm(flow1 * 1.3);
vec2 flow2 = vec2(stAspect.x - t * 0.32, stAspect.y + t * 0.22);
float n2 = fbm(flow2 * 2.4);
vec2 flow3 = stAspect * 4.0 + vec2(0.0, sin(uTime * 0.3) * 0.4);
float n3 = fbm(flow3) * 0.5 + 0.5;
float pulse = (sin(uTime * 0.45) * 0.5 + 0.5) * n3;
float aurora = n1 * 0.55 + n2 * 0.30 + pulse * 0.15 + mouseInfluence + trailInfluence;
```
3 unabhängige fbm-Aufrufe, plus 2 hot-spots (`hot1`, `hot2`) via
`uHotspot1`/`uHotspot2`. Die hot-spots werden in `background.ts:196-203` auf
Lissajous-Trajektorien animiert.

Hero-getriebener Boost in `background.ts:219-225` und `shader.frag.ts:122-127`:
bell-curve von `uSectionMix` während des Pins von 1.0 → 1.55 → 1.0.

**Befund:** multi-Layer + animierte Hot-Spots + scroll-getriebener Boost — alles
real im Code.

## Was der User wirklich gesehen hat

Screenshot der Live-Site = Commit `6bf6718`, **vor** jeder Feedback-Iteration:
- Wordmark steht zweimal (alte `hero__meta--tl` + irgendwo zentriert — habe das
  alte Layout in Git geprüft)
- Kein Dropdown, kein navMenu.ts, keine border-gradient cards
- Scrub 1.0/1.2 (alte Choreographie), keine letter-spacing-spread auf scroll
- Aurora-Code identisch — die multi-Layer waren da, aber ohne die bell-curve
  boost-Logik

## Delta zur neuen User-Spec (Phase 2)

| Fix | Letzte Iteration | Neue Spec | Aktion |
|-----|-----------------|-----------|--------|
| A — Wordmark | komplett entfernt | **einmal** behalten | re-add an EINER Stelle (Nav-Trigger) |
| B — Hero pin | aktiv mit `pin: hero` | **pin raus**, scrub-only | refactor zu nicht-pinned ScrollTrigger |
| C — Dropdown | implementiert | bestätigen | verify Funktion |
| D — Per-Section | implementiert | bestätigen | verify, ggf. verstärken |
| E — Aurora multi-Layer | 3 Layer + Hot-Spots | bestätigen | verify, alles da |

## Plan

1. **Fix A** — Wordmark „OV · OSKAR · MKTG" einmalig in den nav-trigger einsetzen
   (zwischen Logo und Chevron). Damit ist es **genau einmal** im Hero-Bereich.
2. **Fix B** — `setupHeroPin` → `setupHeroScroll`: pin entfernen, ScrollTrigger
   mit `trigger: '#hero', start: 'top top', end: 'bottom 20%', scrub: 1.5`
   (User-Spec wörtlich) ohne pin. Die letter-spacing-spread + word-drift
   bleiben — werden jetzt während normalem Scroll durch den Hero angesteuert,
   nicht während eines pinned Frames.
3. **Build + Push + Wait + Verify per WebFetch.**
4. **Final Report** mit Diff-Snippets pro Fix.
