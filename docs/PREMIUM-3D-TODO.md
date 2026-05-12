# Premium 3D Refinement — Live TODO

Status legend: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked
Started 2026-05-12. Target: AIR-reference-level visual quality. Min 3.5h.

Critical pivots:
- Low-poly icosahedron Crystal → high-poly spiral lamellae (200 plates)
- Background-only animation → Apple-style scroll-pin with scrubbed transform
- Mouse-only interaction → touch + (optional) gyroscope
- Quality bar: AIR-site-reference. Iterate, don't rush.

---

## Phase 0 — Installs
- [ ]  0.1  npm install three-stdlib (GLTFLoader fallback)
- [ ]  0.2  npm install @react-three/drei  (try; skip if too React-coupled)
- [ ]  0.3  Try HDRI download (polyhaven studio + garden, 1k each)
- [ ]  0.4  Create scaffold files (lamellae.ts, scroll-effects.ts)

## Phase 1 — High-poly lamellae spiral
- [ ]  1.1  src/hero/lamellae.ts skeleton (group + 200 RingGeometry instances)
- [ ]  1.2  Spiral math: 1.8° per lamella, sin-waist outer radius, Y range -1..+1
- [ ]  1.3  MeshPhysicalMaterial premium gold (metalness 0.95, clearcoat 1.0, iridescence 0.5)
- [ ]  1.4  Scene: PerspectiveCamera 35° FOV, key+fill+rim lights, HDRI env
- [ ]  1.5  Performance tier: 200 lamellae desktop / 100 mobile, segments 64/32
- [ ]  1.6  Replace crystal canvas in index.html (canvas full-bleed in hero)
- [ ]  1.7  Build + commit `feat: high-poly lamellae spiral hero`

## Phase 2 — Scroll-pinning with scrubbed timeline
- [ ]  2.1  Lenis already wired; verify ScrollTrigger sync via lenis.on('scroll', ScrollTrigger.update)
- [ ]  2.2  ScrollTrigger.create({trigger:'#hero', pin: true, scrub: 1, end: '+=200%'})
- [ ]  2.3  setProgress(p) on lamellae handle: 4 stages (rotate → camera tilt → spacing open → shrink+text)
- [ ]  2.4  Aurora uIntensity coupled to scroll-pin progress
- [ ]  2.5  Mobile touch-scroll verifies cleanly (no Lenis conflict with native overscroll)
- [ ]  2.6  Build + commit `feat: apple-style scroll pinning with gsap scrubbed animation`

## Phase 3 — Mobile interactivity
- [ ]  3.1  Touch-drag → mouseTarget shared with mouse path
- [ ]  3.2  DeviceOrientation gyroscope (with iOS permission gate, optional, fallback to touch)
- [ ]  3.3  Verify CTA tap targets ≥44×44px
- [ ]  3.4  Build + commit `feat: mobile touch interactivity for 3d hero`

## Phase 4 — Visual quality deep pass
- [ ]  4.1  AA verified (antialias true, FXAA fallback if banding)
- [ ]  4.2  Shadow casting decision (PerformanceCheck — likely skip on mobile)
- [ ]  4.3  Color-grading pass (subtle warm/cool split; skip LUT if too heavy)
- [ ]  4.4  Compare visual output to AIR-reference notes in TODO
- [ ]  4.5  Build + commit `polish: visual quality deep pass`

## Phase 5 — Scroll-driven typography
- [ ]  5.1  Hero re-layout: "OSKAR" top-left, "MARKETING" bottom-right, spiral between
- [ ]  5.2  Per-char scroll-driven scale + opacity tween via setProgress
- [ ]  5.3  Mobile fallback: static layout, no scroll-tied typography
- [ ]  5.4  Build + commit `feat: scroll-driven hero typography`

## Phase 6 — Performance & mobile pass
- [ ]  6.1  Mobile-tier detection (iOS Safari, Android Chrome, Desktop)
- [ ]  6.2  Lazy init via IntersectionObserver
- [ ]  6.3  Memory cleanup (dispose paths)
- [ ]  6.4  Bundle audit
- [ ]  6.5  Programmatic perf audit + recommendations (no headless lighthouse)
- [ ]  6.6  Build + commit `perf: mobile-tier system + lazy hero + audit`

## Phase 7 — Deploy + report
- [ ]  7.1  Final build (both bio + pro entries)
- [ ]  7.2  Push origin main
- [ ]  7.3  Live verify via WebFetch
- [ ]  7.4  docs/PREMIUM-3D-REPORT.md

---

## Pragmatic decisions log

(Will be filled in as decisions are made — per spec "wenn unklar: konservative Option + log".)
