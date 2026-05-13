# Feedback Iteration TODO — DONE

All 8 feedback groups (A–H) implemented. See `docs/FEEDBACK-ITERATION-REPORT.md` for the 13-criterion supervisor checklist.

## Phases

### A — Scroll-Animationen langsamer & smoother ✓
- [x] Lenis `duration` 1.2 → 2.5
- [x] Hero pin `scrub: 2.5` (was 1.2)
- [x] Hero pin `end: "+=180%"` (was 150%)
- [x] Section reveals: duration 1.8s, ease `power4.out`
- [x] Reveal stagger 80ms

### B — Hero Bewegung verstärken ✓
- [x] Letter-spacing spread `-0.02em → +0.15em` (Oskar) / `+0.01em → +0.15em` (Marketing)
- [x] Phase B (40–70%): x: ±80px word split
- [x] Phase C (70–85%): y:-40px, opacity → 0.4
- [x] Phase D (85–100%): full viewport exit
- [x] Aurora bell-curve boost during hero pin
- [x] Mouse trail decay 1.5s → 2.5s

### C — OSKAR · MKTG entfernen ✓
- [x] Removed from `hero__meta--tl`
- [x] Removed from top-nav brand
- [x] Chevron `▾` added next to OV logo

### D — Dropdown Navigationsmenü ✓
- [x] Click OV-Logo / Chevron opens
- [x] Backdrop-blur 12px
- [x] 7 items (00/INDEX … 06/MANIFEST)
- [x] Smooth-scroll via Lenis
- [x] Active section highlighted gold
- [x] Outside click + Escape closes
- [x] Mobile fullscreen overlay

### E — Bewegungs-Animationen auf anderen Sections ✓
- [x] Status Quo stat numbers letter-spacing-spread
- [x] Proof italic letter-spacing 0 → 0.08em
- [x] Academy headline split-words + drift
- [x] Channels rotate ±1.5° on scroll-velocity
- [x] Manifest letter-spread tail

### F — Slot-Konfig ✓
- [x] Werktage 14:00 + 19:00
- [x] Wochenende 10:00 + 14:00 + 19:00
- [x] Header "Werktags 14:00 + 19:00 · Wochenende flexibel"
- [x] All 7 calendar days shown

### G — 21st.dev-inspired effects ✓
- [x] Card border-gradient hover (Academy + Channels)
- [x] Spotlight cursor (radial 400px @ ~10%)
- [x] Hero grid pattern @ opacity 0.04
- [x] Sparkles: skipped — covered by existing `.cta__shimmer` + spotlight

### H — DM-Sales-Link ✓
- [x] IG + TikTok DM buttons under slot selector
- [x] `docs/SALES-FLOW.md` strategy doc

### Final ✓
- [x] `npm run build` clean
- [x] `docs/FEEDBACK-ITERATION-REPORT.md` written
- [x] Commits per feature group
