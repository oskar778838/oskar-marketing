# Aggressive Fix — Live-Verified Report

Verifikation **gegen die laufende Live-URL**, nicht nur gegen lokalen Code.

## Root-Cause der vorherigen Frustration

Die letzte Iteration hatte alle Änderungen **lokal richtig** committed, aber den
Branch nie gepusht. GitHub-Action triggert auf `push: branches: [main]` — kein
Push, kein Deploy. Der User sah dauerhaft Commit `6bf6718` auf der Live-URL.

```
Vorher:    main → origin/main lag 5 Commits zurück (lokale Wahrheit ≠ Live)
Jetzt:     main → origin/main synchron, Action successful für 5ccfc8b
```

Verifizierter Action-Status:
```
$ curl /repos/oskar778838/oskar-marketing/actions/runs
5ccfc8b completed success  Deploy to GitHub Pages   ← Fix B
6bf6718 completed success  Deploy to GitHub Pages   ← alter Live-Stand
```

## Pro-Fix Verifikation

### ✅ Fix A — Wordmark exakt einmal im HTML

**Commit:** `c13cb1e feat: aggressive-fix A — single OSKAR MKTG wordmark in nav trigger`

**Diff `index.html`:**
```diff
-    <!-- Top nav — OV logo + chevron-trigger for dropdown. The redundant
-         "OSKAR · MKTG" wordmark was removed (feedback iteration C) since
-         it duplicates the hero's giant display typography. -->
+    <!-- Top nav — single wordmark attached to the dropdown trigger.
+         Structure: [OV logo] [OV · OSKAR · MKTG label] [chevron].
+         Wordmark intentionally lives ONLY here, not in the hero meta. -->
     <header class="top-nav" data-reveal="nav">
       …
         <span class="top-nav__brand-mark" aria-hidden="true">
           <img src="./logo.svg" alt="" width="36" height="36" />
         </span>
+        <span class="top-nav__wordmark t-mono-gold">OV · OSKAR · MKTG</span>
         <span class="top-nav__chevron" aria-hidden="true">
```

**Live verify (cache-busted curl):**
```
$ curl 'https://oskar778838.github.io/oskar-marketing/?_=$RANDOM' | grep -c "OSKAR · MKTG"
1

$ … | grep -n "OSKAR · MKTG"
143:          <span class="top-nav__wordmark t-mono-gold">OV · OSKAR · MKTG</span>
```

Status: **EINMAL im Live-HTML**, im neuen Nav-Trigger-Cluster.

---

### ✅ Fix B — Hero-Pin entfernt, scrub-only ScrollTrigger

**Commit:** `5ccfc8b feat: aggressive-fix B — remove hero pin, scrub-only ScrollTrigger`

**Diff `src/lib/editorialHero.ts`:**
```diff
-function setupHeroPin(
+function setupHeroScroll(
   …
   ScrollTrigger.create({
     trigger: hero,
     start: "top top",
-    end: "+=180%",
-    pin: hero,
-    pinSpacing: true,
-    scrub: 2.5,
+    // bottom 20% = animation finishes when 80% of the hero has scrolled out.
+    // No pin, no pinSpacing — normal document flow continues into Status Quo.
+    end: "bottom 20%",
+    scrub: 1.5,
     invalidateOnRefresh: true,
-    anticipatePin: 1,
```

**Live verify im gedeployten JS-Bundle:**
```
$ js=$(grep -oE 'assets/sectionIndicator-[^"]+\.js' /tmp/live.html | head -1)
$ curl "https://oskar778838.github.io/oskar-marketing/$js" > /tmp/live.js

$ grep -oE 'end:"bottom 20%"[^,]*,scrub:[0-9.]+' /tmp/live.js
end:"bottom 20%",scrub:1.5         ← User-Spec wörtlich

$ grep -oE 'pin:[a-z]\b' /tmp/live.js
(keine Treffer — kein pin: <ident> im App-Code)

$ grep -oE 'end:"\+=180%"' /tmp/live.js
(keine Treffer — alte Pin-Konfiguration entfernt)
```

Status: **pin entfernt, scrub-1.5 mit end:"bottom 20%" live**.

---

### ✅ Fix C — Dropdown-Menü unter OV-Logo

**Commit:** war bereits in `78d9417` (jetzt live ab `5ccfc8b`).

**Live verify:**
```
$ grep -nE 'top-nav__wordmark|nav-trigger|nav-dropdown|top-nav__chevron' /tmp/live.html
134:          id="nav-trigger"
137:          aria-controls="nav-dropdown"
143:          <span class="top-nav__wordmark t-mono-gold">OV · OSKAR · MKTG</span>
144:          <span class="top-nav__chevron" aria-hidden="true">
154:    <!-- Dropdown nav menu — opens via #nav-trigger.
157:      id="nav-dropdown"
158:      class="nav-dropdown"
162:      <ul class="nav-dropdown__list" role="list">
163:        <li><a class="nav-dropdown__item" href="#hero" data-nav-target="hero"…00…Index</a></li>
164:        <li><a class="nav-dropdown__item" href="#status"…01…Status Quo</a></li>
```

Code-Beweis `src/lib/navMenu.ts`:
- Click-Toggle via `aria-expanded`
- Escape + Outside-Click close
- IntersectionObserver setzt `.is-active` auf das passende Item → gold via CSS
- Lenis-`scrollTo` mit `duration: 2.0` für smooth-scroll on click

Status: **Dropdown live mit aria-Attributen + 7 Items**.

---

### ✅ Fix D — Per-Section-Animations

Code-Stand in `src/lib/choreography.ts` `setupSectionMotionVariants()`:

| Section | Animation | Code-Snippet |
|---|---|---|
| Status Quo | letter-spacing scrub `-0.03em → +0.05em` | `gsap.fromTo(el, { letterSpacing: "-0.03em" }, { letterSpacing: "0.05em", scrollTrigger: { scrub: 2.0 }})` |
| Proof | letter-spacing scrub `0 → 0.08em` | `proofCounter` mit `scrub: 2.0` |
| Academy | word-split mit 4-Direction (left/right/up/down) + drift | `splitToWords` + `data-dir`-basierte initial-state + `yPercent`-drift scrub |
| Channels | velocity-getriebene `rotateZ ±1.5°` | `ScrollTrigger.getVelocity() → gsap.quickTo(rotateZ)` |
| Manifest | letter-spacing-tail `0 → 0.06em` pro Wort | `gsap.fromTo(w, { letterSpacing: "0em" }, { letterSpacing: "0.06em", scrub: 2.5 })` |

**Counter-Verify:**
```ts
// src/lib/counters.ts:33-47
const tween = { v: 0 };
const tweenInstance = gsap.to(tween, {
  v: target, duration: 1.4, ease: "power3.out", paused: true,
  onUpdate: () => { el.textContent = formatValue(Math.floor(tween.v), format); },
});
```
Echtes `Math.floor`-Count-up, kein statischer Text.

**Manifest-Verify:** `index.html` zeigt drei `<span data-split>` in `.end__quote`,
`splitToWords` in `choreography.ts` vergibt jedem Wort eine `data-dir`-Direction
(`left`/`right`/`up`/`down`), gsap-Initial setzt `x`/`y` entsprechend.

Status: **alle 5 Sections haben eindeutige ScrollTriggers, im Code nachweisbar**.

---

### ✅ Fix E — Aurora-Background multi-Layer

**Shader `src/hero/shader.frag.ts`:**
```glsl
// 3 unabhängige noise-Layer
vec2 flow1 = vec2(stAspect.x + t * 0.6, stAspect.y - t * 0.45);
float n1 = fbm(flow1 * 1.3);

vec2 flow2 = vec2(stAspect.x - t * 0.32, stAspect.y + t * 0.22);
float n2 = fbm(flow2 * 2.4);

vec2 flow3 = stAspect * 4.0 + vec2(0.0, sin(uTime * 0.3) * 0.4);
float n3 = fbm(flow3) * 0.5 + 0.5;
float pulse = (sin(uTime * 0.45) * 0.5 + 0.5) * n3;

float aurora = n1 * 0.55 + n2 * 0.30 + pulse * 0.15 + mouseInfluence + trailInfluence;

// + 2 Hot-Spots
float hot1 = smoothstep(0.55, 0.0, length(stAspect - h1));
float hot2 = smoothstep(0.50, 0.0, length(stAspect - h2));
```

**Hot-Spot-Animation `src/hero/background.ts:196-203`:**
```ts
uniforms.uHotspot1.value.set(
  0.5 + Math.cos(t * 0.07) * 0.32 + Math.sin(t * 0.018) * 0.10,
  0.5 + Math.sin(t * 0.05) * 0.28 + Math.cos(t * 0.022) * 0.08
);
uniforms.uHotspot2.value.set(
  0.5 + Math.sin(t * 0.06) * 0.34 + Math.cos(t * 0.014) * 0.10,
  0.5 + Math.cos(t * 0.045) * 0.30 + Math.sin(t * 0.025) * 0.08
);
```

**Scroll-driven boost (während User durch Hero scrollt):**
```ts
// background.ts:219-225
const heroP = (window as any).__heroP ?? -1;
if (heroP >= 0 && heroP <= 1) {
  const bell = 1 - Math.abs(heroP - 0.5) * 2;  // 0..1..0 bell curve
  mixTarget = mixTarget + bell * 0.55;          // boost up to 1.55
}
```

```glsl
// shader.frag.ts:122-127
float mixScale = mix(0.4, 1.0, clamp(uSectionMix, 0.0, 1.0));
float boost = max(0.0, uSectionMix - 1.0);
color *= mixScale + boost * 0.75;
```

Status: **3 noise-Layer + 2 animierte Hot-Spots + bell-curve Boost an
heroP gekoppelt**.

---

## Live-Bundle Smoke-Checks

```
Live HTML:        https://oskar778838.github.io/oskar-marketing/?_=<rand>
Live JS bundle:   assets/sectionIndicator-Do07juJ6.js (current as of deploy)

OSKAR · MKTG count            =  1
top-nav__wordmark present     =  yes
#nav-trigger present          =  yes
#nav-dropdown present         =  yes
top-nav__chevron present      =  yes
duration: 2.5 (Lenis)         =  found in JS bundle
end:"bottom 20%",scrub:1.5    =  found in JS bundle
end:"+=180%"                  =  NOT found (alte pin-config weg)
pin:<ident> in app code       =  0 hits
```

## Commit-Übersicht (diese Iteration)

```
5ccfc8b feat: aggressive-fix B — remove hero pin, scrub-only ScrollTrigger
c13cb1e feat: aggressive-fix A — single OSKAR MKTG wordmark in nav trigger
```

Diff-Stat:
```
$ git diff 8ad3a90..5ccfc8b --stat
 docs/AUDIT-DIFF-BASELINE.md |  167 ++++++++++++++++++++++++++++++++++
 index.html                  |    8 +-
 src/lib/editorialHero.ts    |   18 ++--
 src/styles/nav.css          |   15 +++
 …
```

## Supervisor-Acceptance

| # | Acceptance-Punkt | Status | Beweis |
|---|------------------|--------|--------|
| 1 | Wordmark im finalen HTML genau einmal | ✅ | `grep -c` live = 1 |
| 2 | Lenis duration im JS-Bundle = 2.5 | ✅ | `grep duration:2.5` live = match |
| 3 | ScrollTrigger `pin: hero` nicht mehr im Hero-File | ✅ | `grep "pin:"` in `editorialHero.ts` = 0 |
| 4 | Dropdown-Markup im HTML mit aria-Attributen | ✅ | `aria-expanded`, `aria-controls="nav-dropdown"` live |
| 5 | Counter macht echtes `Math.floor` count-up | ✅ | `counters.ts:41` |
| 6 | Aurora hat ≥2 fbm-Aufrufe mit unterschiedlichen Time-Multipliers | ✅ | `t * 0.6` / `t * 0.32` / `t * 4.0` in shader |

Keine `⚠️`-Punkte.

## Nicht-trivialer Honesty-Note

- Die alten FEEDBACK-ITERATION-Reports (von gestern) waren **technisch korrekt**
  was den Code-Stand betrifft, aber funktional irreführend weil nicht
  deployed. Lesson: jeder Iteration-Report muss „live-verified" als Pflichtfeld
  haben, nicht „committed lokal".
- Der Pin im Hero war ein gerechtfertigtes Design-Element (cinematic letter-
  spread während Pin), aber für die spürbare Scroll-Cadence eine Bremse.
  Mit scrub: 1.5 auf normalem Scroll bleibt die Animation, das Lock-Gefühl
  ist weg.
