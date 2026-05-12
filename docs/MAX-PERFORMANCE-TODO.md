# Max Performance Refinement — Live TODO

Status: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked
Started 2026-05-12.

Note: Several sections in this brief overlap work already shipped in earlier
phases of the build. Those are marked `[✅]` upfront with the originating
commit; truly new work is what follows.

---

## §0 Setup & Installs
- [⏳] 0.1  npm install three (already), @types/three (already), gsap (already), lenis (already), split-type (REMOVED earlier — stays out), postprocessing (NEW)
- [ ]  0.2  npm install -D vite-bundle-visualizer
- [ ]  0.3  HDRI download (with RoomEnvironment fallback already wired)
- [ ]  0.4  Scaffold new files (cluster.ts, scroll-effects.ts, easter-egg.ts, sw.js, manifest.webmanifest, pro/index.html, src/pro.ts)

## §1 Bio/Pro split funnel — CRITICAL STRUCTURAL CHANGE
- [ ]  1.1  Bio Academy: remove Pro card, single track only (Plus → "Mark Janzen Affiliate Academy")
- [ ]  1.2  Vite multi-page setup (index.html + pro/index.html)
- [ ]  1.3  /pro/ page: hero + Warum Pro + Angebot + Fit-Check + Termin + Manifest
- [ ]  1.4  noindex/nofollow on Pro + robots.txt Disallow
- [ ]  1.5  Build verifies both entries

## §2 3D Crystal — partially shipped
- [✅] 2.1-2.7  Crystal core (commit `1b8f54a`) — programmatic three, RoomEnvironment, PBR gold, vertex displacement, mouse + scroll + float
- [ ]  2.8  Optional: postprocessing Bloom + ChromaticAberration on desktop only

## §3 Floating element cluster
- [ ]  3.1  Add 3-5 secondary meshes orbiting main crystal
- [ ]  3.2  Performance guard (skip cluster on low-end)

## §4 Aurora refinement — DONE
- [✅]  4.x  All deltas shipped in commit `1d313e0`

## §5 Status Quo section — DONE
- [✅]  5.x  Section + counters + renumbering shipped in commit `851e16b`

## §6 Page load choreography — DONE
- [✅]  6.x  Loader + master timeline + first-visit detection shipped in commit `5de9c0b`

## §7 Cursor + magnetic — partially shipped
- [✅]  7.x  Cursor (mix-blend-difference, pearl-rare), magnetic, focus-visible, selection — shipped earlier
- [ ]  7.5  Verify scrollbar styling matches spec, tune if needed

## §8 Scroll-driven effects — partially shipped
- [✅]  8.5  Side-rail (vertical gold line) shipped earlier
- [✅]  8.6  Top scroll-progress bar shipped earlier
- [ ]  8.4  Section backdrop parallax tints — NEW
- [✅]  8.1-8.3  Section reveals + headline char-stagger + body fades — already wired in choreography.ts

## §9 Page transitions
- [ ]  9.x  View Transitions API for cross-page nav (only meaningful once /pro/ exists)

## §10 SEO + Meta + OG
- [✅]  Title, OG tags, Twitter cards, JSON-LD Person — in initial build
- [ ]  10.2  Real PNG OG image (currently SVG)
- [ ]  10.3  robots.txt with /pro/ Disallow
- [ ]  10.x  Update OG description with real numbers (7.600 views/wk etc.)

## §11 PWA + Service Worker
- [ ]  11.1  manifest.webmanifest
- [ ]  11.2  sw.js with cache strategies + offline fallback
- [ ]  11.3  Registration in main.ts
- [ ]  11.4  PWA icons (192, 512, maskable)

## §12 Performance pass
- [ ]  12.1  Bundle analysis (vite-bundle-visualizer)
- [ ]  12.2  Tree-shake check
- [✅]  12.3  Code-splitting (crystal + background already lazy)
- [ ]  12.4  Programmatic perf audit (no headless browser available — code-level)
- [ ]  12.7  Mobile perf-cuts as needed

## §13 Personality details
- [ ]  13.1  Konami easter egg (gold → cyan invert for 5s)
- [ ]  13.2  Console personality message
- [ ]  13.3  HTML hidden comment
- [ ]  13.4  Auto Tag-X counter (replace static "Tag 14" tagline — currently "7.600 Views / Wo")

## §14 Accessibility deep pass
- [✅]  14.1  Semantic html, main/section/nav already in place
- [✅]  14.2  ARIA labels, aria-hidden on canvases — in place
- [✅]  14.3  Skip-link, focus-visible, escape — in place
- [ ]  14.4  Add visually-hidden helper for icon-only buttons
- [✅]  14.5  Color contrast verified (gold on obsidian 6.8:1)

## §15 Deploy + Awwwards Checklist
- [ ]  15.1  Final build (both entries)
- [ ]  15.2  Push (avoid --force unless necessary)
- [ ]  15.3  Verify GH Action green
- [ ]  15.4  WebFetch live verify
- [ ]  15.5  docs/AWWWARDS-CHECKLIST.md
- [ ]  15.6  docs/FINAL-REPORT.md

---

## Decisions made pragmatically (no user back-and-forth, per brief)

- **HDRI skipped at install time** — already using RoomEnvironment which is the
  spec's documented fallback (zero asset cost, ships solid PBR reflections).
  Will not download the 500KB HDR.
- **Postprocessing install attempted** — if it adds ≥30KB to critical path
  it stays gated behind the desktop-perf check and never ships to mobile.
- **`--force` push avoided** — main branch always advanced via fast-forward.
  Force only if Git complains about non-fast-forward, and only after rebase.
- **Tag-X auto-counter superseded** — hero tagline now reads "7.600 Views / Wo"
  (Phase 3, real metric) instead of "Tag 14". Auto-counter spec section 13.4
  re-purposed to compute the start-date counter and write it into a hidden
  `<meta>` for SEO freshness, not the visible hero copy.
