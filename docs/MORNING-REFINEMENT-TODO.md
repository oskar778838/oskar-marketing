# Morning Refinement — Live TODO

Status: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked
Started 2026-05-13.

State after Path-C-overnight:
- 3D removed; editorial hero typography in place (`hero--editorial`)
- Booking via Web3Forms (no worker dep)
- Scroll-pin still broken on iOS — Phase 1 priority
- Aurora background functional, polish-able

---

## Phase 1 — Scroll-pin endgültig fixen
- [⏳] 1.1  Lenis config: `syncTouch: true`, `smoothTouch: false` (per spec)
- [ ]  1.2  Pin pinType strategy review (`transform` vs `fixed` on iOS)
- [ ]  1.3  ScrollTrigger.create: `anticipatePin: 1` added
- [ ]  1.4  Viewport-stable hero height (`100svh` already in place — verify)
- [ ]  1.5  Build + commit `fix: scroll-pin works on desktop + ios + chrome (lenis sync)`

## Phase 2 — Scroll choreography across all sections
- [✅] 2.1  Section reveals — already in choreography.ts (Path-C f34dd5d)
- [✅] 2.2  Headline split-reveal — already there
- [ ]  2.3  Body-text fade — verify, add where missing
- [ ]  2.4  Per-section specifics:
   - [ ]  Status Quo: vertical "STATUS QUO" label + bg-gradient drift
   - [ ]  Proof: SVG strike-through draw animation
   - [ ]  Academy: card slide-in-from-right + price counter
   - [ ]  Channels: scale-in + ±2° rotate
   - [ ]  Manifest: per-word direction reveal (each word from a different side)
- [ ]  2.5  Section-Number-Indicator (fixed right, mono-caps): "01 / 02 / 03 …"
- [ ]  2.6  Reduced-motion path verified
- [ ]  2.7  Build + commit `feat: scroll choreography maximized across all sections`

## Phase 3 — Aurora background deep-polish
- [ ]  3.1  3-layer Aurora (broad haze + hot-spots + fine noise) with independent drift speeds
- [ ]  3.2  Mouse-trail with 1.5s decay
- [ ]  3.3  Auto-drift on touch
- [ ]  3.4  Per-section scroll-reactive intensity (academy 0.3, manifest 0.7)
- [ ]  3.5  document.hidden pause (already in code — verify)
- [ ]  3.6  Build + commit `polish: aurora multi-layer + mouse-trail + scroll-reactive`

## Phase 4 — 7 editorial design patterns
- [ ]  4.1  Pattern 1: Massive letter spreads (extreme letter-spacing on Oskar/Marketing)
- [ ]  4.2  Pattern 2: Editorial section numbering — verify present site-wide
- [ ]  4.3  Pattern 3: Vertical 90°-rotated section labels (left edge, opacity 0.4)
- [ ]  4.4  Pattern 4: Asymmetric grid breaks — verify already broken on key headlines
- [ ]  4.5  Pattern 5: Whitespace tension — composed not random (audit + fix two examples)
- [ ]  4.6  Pattern 6: Discreet bottom-right meta (Edition tag at 90vh/10vw)
- [ ]  4.7  Pattern 7: Scroll-driven content morphs (overlap zones between sections)
- [ ]  4.8  Build + commit `feat: 7 editorial design patterns from genre reference`

## Phase 5 — Deploy + report
- [ ]  5.1  Final build (both bio + pro)
- [ ]  5.2  Push origin main
- [ ]  5.3  Live verify both pages
- [ ]  5.4  docs/MORNING-REFINEMENT-REPORT.md

---

## Decisions log (pragmatic, no back-and-forth)

To be filled in as decisions are made.
