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
- Background: `#050505` (obsidian)
- Gold: `#C9A84C` / `#E8C96A`
- Fonts: Cormorant Garamond + JetBrains Mono
- Tonality: Build-in-Public, anti-Hype, ehrlich

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
- Status copy ("Tag 14") reflects real Build-in-Public metrics — **never** invent numbers.
