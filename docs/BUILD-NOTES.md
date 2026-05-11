# BUILD NOTES — oskarmarketing.bio

## Stack
- **Vite 5** + Vanilla TypeScript 5.6 (strict).
- **three** ^0.169 — Hero WebGL background (lazy-loaded, separate chunk).
- **gsap** ^3.12 + **ScrollTrigger** — page-load timeline + scroll choreography.
- **lenis** ^1.1 — global smooth scroll (lerp 0.08).
- **split-type** ^0.3 — character-by-character text splitting.
- Build target ES2022. Manual chunks for `three` and `gsap` so the critical path stays lean.

## Skills consulted
Installed via `npx skills add <repo> --skill <name>`:
- `find-skills` (vercel-labs/skills) — discovery helper.
- `frontend-design` (anthropics/skills) — anti-AI-slop playbook.

Both skills validate the executed approach: distinctive non-Inter typography, dominant
gold accent on layered obsidian, page-load timeline with staggered reveals, asymmetric
12-column grid, custom cursor + grain overlays + atmospheric WebGL background.

## Five design decisions (the "what is unforgettable" cuts)

1. **Editorial archive numbering (00 — INDEX, 01 — PROOF, …).** Every section announces
   itself as a numbered chapter. Borrowed from Obys / Simon Holm Larsen — signals
   curatorial restraint, not hype-marketing.

2. **Cormorant Garamond at clamp(72px, 13vw, 200px), italic accent set to gold.**
   Editorial serif this large is a deliberate refusal of the "tall sans-serif hero"
   default. The italic line aligns flex-end and on mobile extends past the viewport
   (margin-right: -12vw) — intentional grid-break.

3. **Custom WebGL fragment shader (gold mesh-noise + mouse warp).** Three.js plane,
   `fbm` noise field, mouse position drives a `smoothstep` displacement. CSS radial
   mesh fallback renders instantly; shader fades in only after init succeeds. Shader
   pauses via IntersectionObserver when hero leaves viewport.

4. **Two-stage cursor (gold dot + lagging ring) with mix-blend-mode: difference.**
   Dot follows cursor at 0.5 lerp, ring trails at 0.18 lerp. Hover state shrinks dot,
   expands ring to 56px. Auto-disabled on touch / coarse-pointer / reduced-motion.

5. **Magnetic CTA buttons (`data-magnetic`).** Pointer-distance-driven translate, max
   ±14px, eased at 0.18 lerp. Combined with the shimmer sweep (CSS keyframe) and the
   ::before fill-up on hover (translateY 101% → 0) — three layered animations on one
   button without feeling busy.

## Performance posture
- Critical path (HTML + CSS + main.ts + gsap chunk): **~185 KB / 65 KB gzipped**.
- WebGL (three): **459 KB / 115 KB gzipped**, dynamically imported in
  `requestAnimationFrame` after page-load timeline starts. Never blocks first paint.
- Fonts loaded via Google Fonts with `display=swap` + preconnect.
- DPR capped at 1.5 for the WebGL renderer.
- Hero shader pauses when offscreen (IntersectionObserver).

## Accessibility
- `prefers-reduced-motion`: GSAP timeline skipped, items revealed statically; Lenis
  disabled; cursor lerp set to 1 (snap); shader skipped entirely. Layout intact.
- Skip-link to `#hero`.
- `aria-label` on every social card and the brand link.
- `:focus-visible` outline (gold, offset 4px).
- `aria-hidden="true"` on decorative background layers and SVG arrows.
- Custom cursor only activates on `(hover: hover) and (pointer: fine)`.

## Anti-AI-look acceptance check
- [x] Two display fonts in distinct roles (Cormorant + JetBrains Mono).
- [x] At least one left/right asymmetric area on desktop (Hero name italic right-aligned).
- [x] Extreme typo size hierarchy (200px headline next to 11px label).
- [x] WebGL hero — not pure CSS.
- [x] Custom cursor.
- [x] Magnetic hover.
- [x] Editorial numbering 00–04.
- [x] No fake stats. Tagline says "Tag 14".
- [x] `prefers-reduced-motion` respected.

## Deployment
Single GitHub Action (`.github/workflows/deploy.yml`) on push-to-main:
1. `npm ci`
2. `npm run build` with `VITE_BASE=/<repo-name>/` so asset URLs resolve under
   the GitHub Pages user-subpath (e.g. `https://oskar778838.github.io/<repo>/`).
   For a custom domain, override `VITE_BASE=/` in repo Variables.
3. Touches `dist/.nojekyll` belt-and-braces (already shipped in `public/`).
4. Uploads dist/ as Pages artifact, `actions/deploy-pages` publishes.

GitHub Pages Settings: **Source = GitHub Actions** (not "Deploy from branch").

## Local dev
```
npm install
npm run dev          # http://127.0.0.1:5173
npm run build        # outputs dist/
npm run preview      # serves dist/ at :4173
```

## What's next (only after first sales / first traction)
- Replace OG-image SVG with a 1200×630 PNG render — many crawlers prefer raster.
- Lead-magnet block (5-Tage-Reels-Plan PDF) above the Academy CTA.
- Social-proof testimonial block — only with real screenshots, real handles.
- Subset Cormorant to Latin glyphs only (saves ~40 KB woff2).
- Self-host fonts (eliminate Google Fonts roundtrip; +5 Lighthouse Performance).
- A/B test CTA copy ("Affiliate Academy" vs "Mein Setup ansehen") via plausible.
- Consider swapping `three` for `ogl` if WebGL bundle ever becomes critical
  (drops the 459 KB chunk by ~80%).
- Custom domain `oskarmarketing.de` with CNAME + base reverted to `/`.
