# Awwwards Refinement — Live TODO

Status legend: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked

Started 2026-05-12. Source: AWWWARDS FINAL REFINEMENT brief from Oskar.

---

## Phase 1 — Aurora Tuning

- [⏳] 1.1  Reduce mix multipliers (0.55→0.35, 0.35→0.22, 0.18→0.12)
- [ ]  1.2  Directional flow: layer 1 SW→NE drift, layer 2 counter-flow, layer 3 pulse
- [ ]  1.3  Hot-spots: 2 animated `vec2 uHotspot1/2` with smoothstep falloff masks
- [ ]  1.4  Scroll-reaction: speed bump on scroll, opacity to 0.6 below 50vh
- [ ]  1.5  Build + commit `refine: aurora subtler + directional flow + hot spots`

## Phase 2 — 3D Hero Crystal

- [ ]  2.1  Setup `src/hero/crystal.ts`, install `postprocessing`
- [ ]  2.2  IcosahedronGeometry(1, 2) + 8% vertex displacement + computeVertexNormals
- [ ]  2.3  MeshPhysicalMaterial: gold, metalness 1.0, roughness 0.15, clearcoat, iridescence 0.3
- [ ]  2.4  Lighting: RoomEnvironment (programmatic, no asset cost) + key/rim lights
- [ ]  2.5  Animation: y-rotation, sin-float, mouse-influence rotation, scroll-shrink
- [ ]  2.6  Postprocessing (optional): UnrealBloom + ChromaticAberration, gated by perf
- [ ]  2.7  Layout: desktop right-of-name, mobile above-name (40vh)
- [ ]  2.8  Mobile perf: low-poly fallback (subdivision 1), pixelRatio cap, hidden-tab pause
- [ ]  2.9  Build + commit `feat: 3d gold crystal hero centerpiece — programmatic threejs`

## Phase 3 — Status Quo Section (real numbers)

- [ ]  3.1  Renumber sections: Status Quo = 01, Proof = 02, Academy = 03, Termin = 04, Channels = 05, Manifest = 06
- [ ]  3.2  Section markup: header + 2x2 asymmetric grid of stat-cards
- [ ]  3.3  4 cards with real numbers (7600 views/wk, 10 services, 60 posts, 100 target)
- [ ]  3.4  Animated counters via GSAP ScrollTrigger (1.4s power3.out, stagger 150ms)
- [ ]  3.5  Update Proof section item C copy (point to Status Quo above)
- [ ]  3.6  Build + commit `feat: status quo section with real numbers + animated counters`

## Phase 4 — Page Load Choreography

- [ ]  4.1  Loader overlay: black fullscreen + centered "OM" pulse, 0.8-1.2s
- [ ]  4.2  Master GSAP timeline (overlay → aurora → cursor → crystal → avatar → name → tagline → cta)
- [ ]  4.3  Reduced-motion path: skip overlay + sequence
- [ ]  4.4  First-visit detection via localStorage flag, shorter sequence on repeat
- [ ]  4.5  Build + commit `feat: page load choreography with gsap master timeline`

## Phase 5 — Cursor + Polish

- [ ]  5.1  Verify custom cursor visible + mix-blend-difference works
- [ ]  5.2  Verify magnetic on all primary CTAs
- [ ]  5.3  Selection color, focus rings, scrollbar styling, Lenis tuning
- [ ]  5.4  Build + commit `polish: cursor + magnetic ctas + selection + focus rings + scrollbar`

## Phase 6 — Performance + Mobile

- [ ]  6.1  Bundle analysis (vite-bundle-visualizer)
- [ ]  6.2  Code splitting: crystal + postprocessing dynamic-imported
- [ ]  6.3  Mobile: low-poly crystal, pixelRatio cap, animation-pause when hidden
- [ ]  6.4  Lighthouse-pass (or programmatic audit since headless not available here)
- [ ]  6.5  Service worker for offline fallback (PWA basics)
- [ ]  6.6  Build + commit `perf: bundle split + mobile optimization + lighthouse pass`

## Final

- [ ]  Deploy verify (WebFetch live, check all changes shipped)
- [ ]  `docs/LIGHTHOUSE-AFTER-REFINEMENT.md` (or programmatic-audit report)
- [ ]  `docs/AWWWARDS-REFINEMENT-REPORT.md` with anti-AI-score, bundle, next steps
- [ ]  Final commit `docs: refinement complete`
