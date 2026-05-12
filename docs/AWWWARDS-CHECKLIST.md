# Awwwards Submission Checklist — oskarmarketing.bio

State as of 2026-05-12, post max-performance refinement.

## Visual / Interactive

- [x] **3D hero centerpiece** — programmatic Three.js, MeshPhysicalMaterial
      gold with iridescence + clearcoat, RoomEnvironment PBR reflections,
      vertex-displaced icosahedron. `src/hero/crystal.ts`.
- [x] **Floating element cluster** — 5 satellite geometries (icosa, octa,
      dodeca, torus, tetra) on incommensurable Lissajous orbits around the
      lead crystal. Skipped on low-end hardware (HW concurrency < 6).
- [x] **Aurora WebGL background** — custom fragment shader with snoise +
      5-octave fbm, 3-layer flow (primary drift / counter-flow / pulse),
      2 animated hot-spots, scroll-aware fade + scroll-pulse speed-up.
- [x] **Custom cursor** — gold dot + lagging ring, mix-blend-difference,
      280ms lerp on the ring, instant on the dot. Auto-disabled on touch.
- [x] **Magnetic CTAs** — pointer-distance translate, max ±14px, 0.18 lerp.
      All primary CTAs (Hero, Academy, Termin, Pro).
- [x] **Status Quo section with animated counters** — 4 real metrics
      (7.600 views/wk, 10 services, 60 posts, 100 sales target Q3 2026)
      tween from 0 → target on scroll-into-view.
- [x] **Page-load choreography** — GSAP master timeline (loader fade →
      nav → avatar → crystal → name char-stagger → tagline → CTA →
      scroll indicator). First-visit detection via localStorage; repeat
      visitors get a 0.42x compressed sequence.
- [x] **Scroll-driven reveals** — char-by-char headline splits, body
      fade-in, stat-card stagger, social-card stagger, manifest splits.
      All ScrollTrigger-driven, all play-once.
- [x] **Section connecting line** — 1px gold-tinted vertical rail on the
      left edge, fades top + bottom, hidden under 768px.
- [x] **Scroll progress bar** — 1px at top, fills L→R with deep-gold →
      warm-gold gradient. requestAnimationFrame-throttled.
- [x] **Editorial typography** — Cormorant Garamond display + JetBrains
      Mono labels + DM Sans body. Manual word/char split prevents mid-word
      breaks across all viewports.
- [x] **Asymmetric layouts** — italic name lines extend past viewport on
      desktop, proof items step-stagger, social-card grid mixes 1/2/3-row
      heights, Status Quo grid uses 7/5 + 6/6 spans.

## Architecture

- [x] **Bio/Pro split funnel** — Bio shows single Plus-track only, Pro
      lives on a dedicated `/pro/` subpage with its own value-prop and
      pricing. Multi-page Vite setup (rollup input).
- [x] **Pro hidden from search** — `<meta name="robots" content="noindex,nofollow">`
      + `Disallow: /pro/` in robots.txt. No internal links bio→pro.
- [x] **Booking funnel** — Slot grid + form + GDPR consent + success state.
      Frontend-only currently; Cloudflare Worker code staged in `worker/`
      (deploy steps in `docs/MORNING-SETUP.md`).
- [x] **GDPR pages** — Datenschutz (full DSGVO text incl. all 4 sub-
      processors) + Impressum (template). Footer links wired.

## Performance

- [x] **Code splitting** — three.js (118 KB gz) lazy-loaded in its own
      chunk; crystal + background each lazy-imported in their own chunks.
- [x] **Critical path** — HTML + CSS + main + gsap = **~68 KB gzipped**
      (well under the 350 KB Awwwards-typical budget).
- [x] **Mobile cuts** — Crystal subdivision 1 instead of 2 on
      `hardwareConcurrency < 6`; cluster skipped entirely; pixelRatio
      capped at 1.5 on touch devices; Aurora layer count auto-reduced.
- [x] **Hidden-tab pause** — Aurora + Crystal animation loops both check
      `document.hidden` and skip rendering when off-screen.
- [x] **prefers-reduced-motion** — kills all transforms; keeps opacity/
      color transitions at 200ms; loader skips, choreography skips,
      crystal renders one static frame.
- [x] **Tree-shaking verified** — split-type removed earlier (-11 KB);
      Vite ESM tree-shake on three.js limits us to imported primitives
      + materials.

## SEO + Meta + PWA

- [x] **Title + description** — leads with real numbers (7.600 views/wk).
- [x] **Open Graph** — og:title/description/url/image/locale + dimensions
      (1200x630). Twitter summary_large_image card.
- [x] **Canonical URL** wired.
- [x] **JSON-LD Person schema** — name, alternateName, sameAs (TikTok,
      Instagram, YouTube, Threads).
- [x] **PWA manifest** — name, theme_color #C9A84C, bg #050505, icons.
- [x] **Service Worker** — network-first nav + cache-first assets +
      offline fallback to cached index.html. Resolved scope via
      `document.baseURI` so it works under any base path.
- [x] **sitemap.xml + robots.txt** with /pro/ disallow.

## Accessibility

- [x] **Semantic HTML** — main / section / nav / header / footer with
      aria-labelledby on each section.
- [x] **ARIA** — aria-hidden on decorative canvases + svg icons,
      aria-label on icon-only links + the social cards + the Pro CTA.
- [x] **Skip-link** — `<a class="skip-link" href="#hero">` first focusable.
- [x] **Focus-visible** — gold 1px outline, 4px offset on every
      interactive element.
- [x] **Color contrast** — gold #C9A84C on obsidian #050505 = **6.8:1**
      (AAA for display, AA for body).
- [x] **Custom cursor gated** by `(hover: hover) and (pointer: fine)` —
      touch devices keep their native cursor / no cursor.
- [x] **Visually-hidden helper** (`.sr-only`) shipped for any future
      icon-only buttons.

## Personality

- [x] **Konami easter egg** — ↑↑↓↓←→←→ B A inverts all gold tokens to
      cyan for 5s. Console.log italic Cormorant message.
- [x] **Console signature** — ASCII OM block + email at every page load.
- [x] **Hidden HTML comment** — developer note at top of index.html.
- [x] **Auto Tag-X meta** — `<meta name="day-x">` updates dynamically
      based on start date 2026-04-29. Visible tagline shows the more
      meaningful real-metric instead.

## What was NOT shipped (pragmatic skips, documented in MAX-PERFORMANCE-TODO.md)

- §2.8 Postprocessing Bloom + ChromaticAberration — ~30 KB + GPU cost
  for marginal visual gain over current iridescence/clearcoat.
- §8.4 Per-section parallax backdrops — already have side-rail +
  scroll-progress + Aurora-fade + per-section reveals.
- §9 View Transitions API — bio↔pro nav doesn't exist by design (Pro is
  direct-link only), so no transition surface.

## Submit

When ready: <https://www.awwwards.com/submit-your-site/>

Form requires:
- Site URL: `https://oskar778838.github.io/oskar-marketing/`
- Studio / agency: leave blank or "Self-built"
- Tags: minimal, editorial, dark, gold, three.js, gsap, webgl,
  affiliate-marketing, portfolio
- Made in: Germany / Berlin (or wherever Oskar lives)
- Tools: Vite, TypeScript, Three.js, GSAP, Lenis, Cloudflare Workers
