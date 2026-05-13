# Feedback Iteration TODO

Tracking the 8 feedback groups (A–H) and 13 acceptance criteria.

## Phases

### A — Scroll-Animationen langsamer & smoother
- [ ] Lenis `duration` 1.2 → 2.5
- [ ] ScrollTrigger `scrub` 1.2 → 2.5 (hero pin)
- [ ] Hero pin `end: "+=180%"` (was 150%)
- [ ] Section reveals: duration 1.8s, ease `power4.out`
- [ ] Reveal stagger 80ms (was 25–40ms)

### B — Hero Bewegung verstärken
- [ ] Letter-spacing spread `-0.02em → +0.15em` (Oskar) / `+0.01em → +0.15em` (Marketing)
- [ ] At 60% progress: Oskar x:-80px, Marketing x:+80px (already partially there; tighten + lengthen)
- [ ] At 80%: y:-40px, opacity → 0.4
- [ ] At 100%: fully out of viewport
- [ ] Aurora `uIntensity` 0.6 → 1.0 during hero, fade after
- [ ] Mouse trail decay 1.5s → 2.5s, glow radius doubled

### C — OSKAR · MKTG entfernen
- [ ] Remove `OV · OSKAR · MKTG` text from `hero__meta--tl`
- [ ] Remove `OSKAR · MKTG` from top-nav brand
- [ ] Add chevron `▾` next to OV logo for dropdown trigger

### D — Dropdown Navigationsmenü
- [ ] Click OV-Logo / Chevron opens menu
- [ ] Backdrop-blur 12px
- [ ] 7 items: 00/INDEX, 01/STATUS QUO, 02/PROOF, 03/ACADEMY, 04/TERMIN, 05/CHANNELS, 06/MANIFEST
- [ ] Smooth scroll to section on click
- [ ] Active section highlighted gold
- [ ] Outside click + Escape closes
- [ ] Mobile fullscreen variant

### E — Bewegungs-Animationen auf anderen Sections
- [ ] Status Quo stat numbers letter-spacing-spread on scroll
- [ ] Proof italic "Was du findest" letter-spacing 0 → 0.08em
- [ ] Academy headline split-words, drift on further scroll
- [ ] Channels cards rotate ±1.5° on scroll-velocity
- [ ] Manifest enhanced letter-spread

### F — Slot-Konfig
- [ ] Werktage: 14:00 + 19:00
- [ ] Wochenende: 10:00 + 14:00 + 19:00
- [ ] Header: "Werktags 14:00 + 19:00 · Wochenende flexibel"
- [ ] Generate 7 days mixed (Mon–Sun where applicable)

### G — 21st.dev-inspired effects
- [ ] Card border-gradient hover (Academy + Channels)
- [ ] Spotlight cursor radial 400px @ 10% opacity
- [ ] Hero grid pattern opacity 0.04
- [ ] Text-generate effect on section headlines (char reveal already covers, polish)
- [ ] CTA sparkles (subtle)

### H — DM-Sales-Link
- [ ] Sub-action under slot selector: IG + TikTok DM buttons
- [ ] `docs/SALES-FLOW.md` documenting strategy

### Final
- [ ] Build verifies (`npm run build`)
- [ ] `docs/FEEDBACK-ITERATION-REPORT.md` with all 13 acceptance criteria
- [ ] Commits per feature group
