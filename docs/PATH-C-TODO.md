# Path C — Editorial Pivot · Overnight Build

Status: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked/note

---

## Pre-Start Reality-Check

- [✅] Repo gefunden: `c:\Users\Oskar\Desktop\oskar-bio-website`
- [✅] Filename-Diff Spec vs Realität dokumentiert (`lamellae.ts` statt `crystal.ts` etc.)
- [✅] Test-Limitierung: no browser test → TS + vite build als Proxy

---

## Phase 1 — 3D komplett raus ✅

- [✅] 1.1 lamellae.ts + heroPin.ts gelöscht
- [✅] 1.2 index.html + pro/index.html: `<canvas id="lamellae">` block raus
- [✅] 1.3 src/main.ts + src/pro.ts: lamellae-Init-Calls raus
- [✅] 1.4 npm uninstall postprocessing
- [✅] 1.5 Bundle-Verify: 33 Module, 6.5s, clean

**Commit:** `8aea967`

---

## Phase 2 — Editorial Hero Redesign ✅

- [✅] 2.1 Layer-Stack: Aurora + Noise-Overlay + Typo + Meta + Cursor
- [✅] 2.2 Desktop-Typo: Oskar 280px pearl, Marketing 220px italic gold, asymmetrisch
- [✅] 2.3 Mobile-Stack: zentriert, ~110px/88px
- [✅] 2.4 OV-Logo + Dual-Ring im meta-tl block
- [✅] 2.5 SplitType Char-by-Char Reveal (60ms stagger, blur 8px→0, Y 110%→0)

**Commit:** `ed81eba`

---

## Phase 3 — Scroll-Pin fixen ✅

- [✅] 3.1 Debugging-Pass: Root-Cause war fehlender Lenis↔ScrollTrigger-Bridge
- [✅] 3.2 lenis.on('scroll', ScrollTrigger.update) + scrollerProxy + gsap.ticker + syncTouch:false
- [✅] 3.3 4-Phase progress-driven choreography (letter-spacing → parallax → scale-fade → exit)
- [✅] 3.4 iOS-Verify: per syncTouch:false + native momentum-safe (kein Live-Test möglich)
- [✅] 3.5 Pro-Page nutzt gleiche initEditorialHero(lenis)

**Commit:** `cf4cfce`

---

## Phase 4 — Section-Choreographie ✅ (großteils pre-existing)

- [✅] 4.1 Status Quo: counter staggered fade-in (bereits in counters.ts + choreography.ts)
- [✅] 4.2 Proof: char-split + 3-Punkte-Stagger (bereits da)
- [✅] 4.3 Academy: slide-in + Preis-Count 0→397 (Preis-Count NEU per data-counter)
- [✅] 4.4 Termin: h-chars + sub + booking-form (bereits da)
- [✅] 4.5 Channels: grid + ±rotation (bereits da)
- [✅] 4.6 Manifest: quote-chars (bereits da; word-by-direction skipped als optional polish)
- [✅] 4.7 Global Top-Progress-Bar (bereits in scrollProgress.ts)
- [✅] 4.8 Reduced-Motion-Fallback (bereits + auf `.hero__word .char` umgestellt)

**Commit:** `f34dd5d`

**Skipped als optional polish (in REPORT.md als Backlog notiert):** rotierte Sidebar-Labels, SVG-strike-through, Section-Number-Indicator, Connecting-Line links.

---

## Phase 5 — Web3Forms Calendar ✅ (Placeholder-Key)

- [✅] 5.1 Form-Struktur war schon da, behalten
- [✅] 5.2 submitBooking komplett rewrite → POST zu WEB3FORMS_ENDPOINT
- [✅] 5.3 LocalStorage-Slot-Reservation (RESERVATION_KEY, 24h TTL, prune on read)
- [✅] 5.4 Success-State bleibt unverändert
- [✅] 5.5 Error-Handling: Placeholder-Key → kein Request, Inline-Error mit mailto
- [✅] 5.6 docs/MORNING-STEPS.md geschrieben — 2-Min-Anleitung für Access-Key-Setup

**Commit:** `de6f4f6`
**⚠️ User-Action erforderlich:** WEB3FORMS_ACCESS_KEY in src/config.ts morgens einsetzen.

---

## Phase 6 — Polish ✅

- [✅] 6.1 Cursor war schon spec-konform — keine Änderung
- [✅] 6.2 ::selection → rgba(201,168,76,0.4); :focus-visible → 2px dashed gold
- [✅] 6.3 Custom Scrollbar (6px gold, hover-only devices)
- [✅] 6.4 Bundle: Critical-First-Paint 79KB gzip, Total 196KB gzip (Spec <250KB ✓)
- [⚠️] 6.5 Lighthouse Live-Run nicht möglich nachts — Estimate in REPORT.md (Mobile ~88-92, Desktop ~95-98)
- [✅] 6.6 Fonts: Cormorant per Google-Fonts preconnect + preload (war schon da), font-display:swap ist GF-Default
- [✅] 6.7 Loader-Easing cubic-bezier(0.23, 1, 0.32, 1) ist als --ease-emphasis in tokens.css schon vorhanden

**Commit:** `ab2d181`

---

## Phase 7 — Deploy + Report ✅

- [✅] 7.1 Final build clean (6.91s)
- [✅] 7.2 git push origin main → erfolgreich (d291cde..ab2d181)
- [✅] 7.3 docs/PATH-C-REPORT.md geschrieben mit vorher/nachher, bundle-breakdown, lighthouse-estimate, morgen-checkliste
- [✅] 7.4 docs/MORNING-STEPS.md mit Web3Forms-Aktivierungs-Anleitung

**Gesamt:** 7 Commits + 1 TODO-Init + 1 Doc-Commit (dieser).
