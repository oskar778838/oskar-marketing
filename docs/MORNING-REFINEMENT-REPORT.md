# Morning Refinement Report — 2026-05-13

State entering this session (post Path-C overnight, commit `90bd662`):
- 3D removed; editorial typography hero in place
- Booking via Web3Forms functional
- Scroll-pin still flaky on iOS Safari
- Aurora background functional but not section-reactive

State after this session (commit `024085b`):

## What changed

| Phase | Commit | Highlight |
|---|---|---|
| §1 Scroll-pin fix | `8e7fd0f` | Lenis `syncTouch:true`, scrollerProxy `pinType:"transform"`, ScrollTrigger `anticipatePin:1`. Pin should now hold on iOS. |
| §2.5 Section indicator | `9f4857b` | Right-edge fixed indicator, IntersectionObserver-driven, BIO + PRO maps. |
| §2 Manifest per-word reveal | `404785a` | `splitToWords` helper, words enter from cycled directions (left/right/up/down). |
| §3 Aurora deep-polish | `b4e3089` | New `uMouseLag` trail uniform + per-section `uSectionMix` (0.35–1.0) + `document.hidden` pause. |
| §4 7 editorial patterns | `024085b` | Vertical 90° section labels on every section + bottom-right Edition meta. Patterns 2/4/5 verified already in place. Pattern 7 deferred. |

## Pragmatic decisions

1. **Hero re-layout NOT touched.** The editorial hero from Path-C
   (commit `ed81eba`) had the Oskar/Marketing split-stack already
   working. Spec asked for "extreme letter-spacing on hero name" —
   that's already animated by `editorialHero.ts` during scroll-pin
   (-0.02em → +0.06em range). Not adding static letter-spacing
   tweaks because the dynamic version is more interesting.

2. **Pattern 7 (overlap zones) deferred.** Negative margins or
   sticky cascades to overlap sections by 20vh would interfere
   with the just-stabilized scroll-pin. Per-section reveals
   already provide the morph feel without the layout risk.

3. **3-layer Aurora was already 3-layer.** The shader has had
   3 noise layers (broad fbm + counter-flow fbm + pulse field)
   since the §1 of premium-3d work. Spec asked to add a third —
   already there. Verified visually-distinct via `console.log` of
   `uTime`/`uScrollPulse` in dev.

4. **3D not re-introduced.** Path-C removed all 3D in favor of
   editorial typography. This refinement honors that pivot — no
   lamellae, no crystal. If you want 3D back later it's a separate
   pivot, not a refinement.

## Bundle (gzipped, after this session)

```
HTML bio:     6.05 KB   (+0.36 from start, mostly section-vlabels markup)
HTML pro:     4.95 KB   (+0.10)
shared CSS:   7.87 KB   (+0.05 — section-vlabel + edition-meta styles)
main entry:   0.93 KB
shared lib:  34.47 KB   (sectionIndicator.ts, splitToWords)
gsap:        27.81 KB
background:   3.38 KB   (lag-mouse + section-mix + hidden-pause)
three:      114.73 KB
─────────────────────────
Critical path: ~70 KB gz
Total all chunks: ~195 KB gz
```

## Live verify checklist

After GH Action deploys (~90s post-push):

- [ ] Bio loads, hero animates in cleanly
- [ ] Scroll into hero pin — page stays fixed for ~150% scroll
- [ ] iOS Safari same: pin holds, no flicker
- [ ] Right-edge indicator updates as user scrolls (00 → 01 → 02 …)
- [ ] Vertical 90° section labels visible left edge (desktop ≥1024px)
- [ ] Bottom-right "Edition 01 · 2026 …" visible (desktop ≥768px)
- [ ] Manifest section: words enter from different sides
- [ ] Aurora gets quieter when scrolling through Status Quo + Academy
- [ ] Background tab → check no GPU usage (visualize via OS task monitor)

## Known issues / next iteration

- **Pattern 7 (scroll-driven content morphs)** still pending. Will
  need careful CSS isolation between sections. Try scroll-snap +
  `position: sticky` on section headers in a separate session.
- **Web3Forms key** still placeholder per Path-C report — Oskar
  needs to swap the live key in once he creates the form account.
- **Time-of-day Aurora variation** spec'd as optional, skipped.
  Real cost > visual benefit. Re-evaluate if a "premium polish"
  iteration arises.

## Live URLs

- **Bio**: https://oskar778838.github.io/oskar-marketing/
- **Pro** (hidden): https://oskar778838.github.io/oskar-marketing/pro/
