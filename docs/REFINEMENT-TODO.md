# Awwwards Refinement — Live TODO

Status legend: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked

Started 2026-05-12. Source: AWWWARDS FINAL REFINEMENT brief from Oskar.

---

## Phase 1 — Aurora Tuning

- [✅] 1.1  Reduce mix multipliers (0.55→0.35, 0.35→0.22, 0.18→0.12)
- [✅] 1.2  Directional flow: layer 1 SW→NE drift, layer 2 counter-flow, layer 3 pulse
- [✅] 1.3  Hot-spots: 2 animated `vec2 uHotspot1/2` with smoothstep falloff masks
- [✅] 1.4  Scroll-reaction: speed bump on scroll, opacity to 0.6 below 50vh
- [✅] 1.5  Build + commit `refine: aurora subtler + directional flow + hot spots` → `1d313e0`

## Phase 2 — 3D Hero Crystal

- [✅] 2.1  Setup `src/hero/crystal.ts` (postprocessing skipped — mobile perf)
- [✅] 2.2  IcosahedronGeometry(1, 2) + 8% deterministic vertex displacement + computeVertexNormals
- [✅] 2.3  MeshPhysicalMaterial: gold, metalness 1.0, roughness 0.18, clearcoat 0.7, iridescence 0.3
- [✅] 2.4  Lighting: RoomEnvironment (PMREM) + key (warm) + rim (cool) + ambient gold fill
- [✅] 2.5  Animation: y-rotation 0.003/frame, sin-float ±0.05, mouse rotation X/Z, scroll-shrink to 0.85
- [⚠️] 2.6  Postprocessing — SKIPPED. Bloom + ChromaticAberration would add ~30KB + frame budget; current PBR + iridescence reads premium without it. Revisit if a desktop-only nice-to-have.
- [✅] 2.7  Layout: desktop col 8-12 row 2 (next to name), mobile in-flow between avatar and name
- [✅] 2.8  Mobile perf: low-poly fallback (subdivision 1) on <6 cores, pixelRatio cap 1.5 on touch, document.hidden pause
- [✅] 2.9  Build + commit `feat: 3d gold crystal hero centerpiece — programmatic threejs`

## Phase 3 — Status Quo Section (real numbers)

- [✅] 3.1  Renumber sections: 01 Status Quo (new), 02 Proof, 03 Academy, 04 Termin, 05 Channels, 06 Manifest
- [✅] 3.2  Section markup: header + 2x2 asymmetric grid (lg span 7, others span 5/6)
- [✅] 3.3  4 cards with real numbers (7.600 views/wk · 10 services · 60 posts · 100 target Q3 2026)
- [✅] 3.4  Animated counters via GSAP ScrollTrigger (1.4s power3.out, stagger 150ms, tabular-nums for stable width)
- [✅] 3.5  Updated Proof item C to point to Status Quo above (no more "sobald da")
- [✅] 3.6  Plus: hero tagline now reads "7.600 Views / Wo" instead of "Tag 14"
- [✅] 3.7  Build + commit `feat: status quo section with real numbers + animated counters`

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
