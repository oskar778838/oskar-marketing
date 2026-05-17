# Oskar Marketing — Project Context

Auto-loaded by Claude Code at the start of every session in this repo. Keep
short and high-signal. Anything that's already self-evident from the file
tree or `package.json` belongs there, not here.

## Stack
- Vite + TypeScript + Three.js + GSAP + Lenis
- Cloudflare Worker for backend calls (`worker/`)
- Brevo for email + DOI flow
- GitHub Pages deploy (push to `main` → Action builds with `VITE_BASE=/<repo>/`)

## Brand
- Background: `#F5F7F8` (Off-White Snow)
- Accent: `#5B5BD6` Electric Twilight · `#A8A8FF` Periwinkle Halo (decorative only)
- Text: `#0E1116` Twilight Black
- Canonical tokens: `--color-base` / `--color-accent` / `--color-ink` etc. in `src/styles/tokens.css`.
  Legacy `--gold` / `--pearl` / `--obsidian-*` names still resolve via aliases — keep working but new code uses `--color-*`.
- Fonts: Cormorant Garamond + JetBrains Mono
- Tonality: Build-in-Public, anti-Hype, ehrlich · pivot from Tate/Gadzhi-coded gold-cluster to premium-tech indigo (Tag 19, see brand-pivot commits)

## Architecture
- `index.html` — bio page with sections
- `public/playbook.html` — lead-magnet subpage
- `public/datenschutz.html`, `public/impressum.html` — legal
- `worker/` — Cloudflare Worker (booking + Brevo subscribe)
- `agents/` — operations prompts

## Editorial Conventions
- **No hashtags** in captions.
- **Forbidden words:** Sparen, günstig, billig, Rabatt, Schnäppchen.
- **Affiliate links:** must have `rel="sponsored noopener"` + visible disclosure
  near the link or in the section footer.
- **All forms:** DSGVO-compliant with Double-Opt-In. No single-opt-in flows.

## Operating Notes
- Setup walkthrough for the Brevo + Worker pipeline: [`docs/BREVO-SETUP.md`](docs/BREVO-SETUP.md).
- DOI email template: [`docs/brevo-doi-template.html`](docs/brevo-doi-template.html).
- Status copy ("Tag N") is derived from `getBuildDay()` in `src/config.ts` (anchored to `PROJECT_START_DATE = "2026-04-29"`). The hero pivot eyebrow, journal LIVE marker, and proof-strip "Tage gebaut" all read the same number. **Never** invent numbers and **never** hard-code a Tag value in copy, markup, or this document — derive from the helper instead.
