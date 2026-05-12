# Premium 3D Refinement — Final Report

Run completed 2026-05-12. Total elapsed: ~4h, sequential phases 0–7.

## What changed vs the previous build

| Aspect | Before (post max-perf) | After (premium-3d) |
|---|---|---|
| 3D centerpiece | Low-poly icosahedron crystal (80 faces) | High-poly lamellae spiral (200 plates × 64 segments = 25,600 triangles) |
| 3D scroll behavior | Passive: spiral floats while user scrolls past | Apple-style scroll-pinning: hero stays fixed for 200%vh, spiral transforms in 4 stages, then unpins |
| Material | PBR gold metalness 1.0, roughness 0.18 | Same, plus DoubleSide, plus dynamic-imported postprocessing (Bloom + Chromatic + Vignette) on desktop |
| Mobile interactivity | Mouse-only via global pointermove | Touch + (optional) iOS gyroscope, both feeding the same mouseTarget |
| Mobile pin range | n/a | '+=140%' shorter than desktop's '+=200%' so power-scrolling stays responsive |
| Hero typography | Static char-by-char reveal at page load | Page-load reveal **plus** scroll-driven scale + parallax-out tied to the same pin range |
| Lazy strategy | Both 3D + Aurora loaded after first paint | Same, **plus** postprocessing now in its own dynamic-imported chunk (mobile saves 113 KB gz) |

## Comparison vs the AIR reference

What matched:
- Premium PBR gold material with smooth shading — no visible polygon edges at 200 lamellae × 64 segments.
- Scroll-pinned hero that anchors the user's attention while the 3D form transforms.
- Subtle bloom + chromatic aberration + vignette — the "rendered, not real-time" cinema look.
- Asymmetric editorial typography around the 3D form.

What did not match (intentional):
- AIR uses an external GLB-style sculpture; we built ours programmatically (RingGeometry × 200) so the asset is zero-cost and re-tunable from code.
- AIR's typography splits the wordmark by the 3D object physically. We kept the existing italic-flush-end name layout to avoid a risky re-layout this session — added scroll-coupled typography animation instead. Re-attempt later if you want the literal AIR layout.

## Bundle (gzipped)

```
Critical path (eager):
  index.html        5.69 KB
  pro/index.html    4.85 KB
  shared CSS        7.00 KB
  main entry        1.62 KB
  shared lib       26.53 KB
  gsap             27.81 KB
  ──────────────────────────
  Critical:        ~68 KB

Lazy (after first paint):
  background.js     2.78 KB    Aurora WebGL
  lamellae.js       3.16 KB    3D module gate
  three.js        119.45 KB
  postprocessing  112.66 KB    DESKTOP ONLY

Per-device totals:
  Mobile (iOS / low-end):  ~193 KB
  Desktop:                 ~306 KB
```

Both sides of the 350 KB Awwwards-typical budget.

## Pragmatic decisions

1. **No HDRI ship.** Studio HDR is 1.5 MB. The RoomEnvironment PMREM produces clean PBR reflections without any asset cost. HDRI lives locally in `public/hdri/` (gitignored) for visual reference; switch the env line in `lamellae.ts` to use RGBELoader if Oskar ever wants to ship it.
2. **Hero re-layout deferred.** AIR's "OSKAR" / "MARKETING" letterforms physically intersect the 3D object. Doing this right requires restructuring the hero markup and re-tuning the 4 mobile breakpoints we already finalized. The scroll-driven typography animation provides the dynamic feel without the layout risk.
3. **Postprocessing on desktop only.** The library is 113 KB gzipped — too much for mobile users on 4G. Desktop benefits from bloom + chromatic + vignette; mobile reads the spiral as premium without it thanks to PBR + iridescence + key/rim lighting.

## Known visual debt

- The lamellae plates are flat (RingGeometry has no thickness). At extreme close-ups the edge reads paper-thin. For typical viewing distance, the cumulative reflection of 200 plates creates the impression of a solid form. If objectionable, swap RingGeometry for ExtrudeGeometry with a 2-3px rectangular profile (will roughly double triangle count → check 60fps holds).
- Postprocessing first-frame: while `import("postprocessing")` resolves, the renderer falls back to plain `renderer.render()`. Users on slow desktop connections see ~150ms of "no bloom" before the composer takes over. Acceptable; document so it isn't mistaken for a bug.

## Next iteration ideas

- **Custom GLB sculpture.** Replace the programmatic spiral with an artist-authored mesh. Higher ceiling but ships an extra 200-500 KB asset.
- **Audio reactivity.** Wire Web Audio API to the spiral's rotation speed or bloom intensity.
- **ScrollTrigger pinning on Status Quo.** Pin the section while counter cards fly in.
- **WebGPU render path** when browser support hits ~85%.
- **Hero re-layout (deferred from §5)** — "OSKAR" / "MARKETING" splits with the lamellae passing through.

## Live URLs

- **Bio**: https://oskar778838.github.io/oskar-marketing/
- **Pro** (hidden funnel): https://oskar778838.github.io/oskar-marketing/pro/

## Submission

When ready: <https://www.awwwards.com/submit-your-site/>
Site URL: `https://oskar778838.github.io/oskar-marketing/`
