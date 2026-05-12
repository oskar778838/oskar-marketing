# Path C — Editorial Pivot · Overnight Build

Status: `[ ]` todo · `[⏳]` in_progress · `[✅]` done · `[⚠️]` blocked/note

---

## Pre-Start Reality-Check

- [✅] Repo gefunden: `c:\Users\Oskar\Desktop\oskar-bio-website` (Vite + TS + GSAP + Lenis + Three.js + Postprocessing + SplitType)
- [⚠️] **Spec vs. Realität — Filename-Diff:**
  - Spec: `crystal.ts`, `cluster.ts`, `lamellae.ts`
  - Realität: nur `src/hero/lamellae.ts` + `src/hero/background.ts` + `src/hero/shader.frag.ts`
  - **Konservative Aktion:** lamellae.ts löschen (das ist die explizit erwähnte Spirale); background.ts erst inspizieren — wenn es Aurora ist, behalten; wenn es 3D-Cluster ist, löschen
- [⚠️] **Test-Limitierung:** keine Browser-Tests möglich diesen Run. TypeScript-Check + `vite build` als nächstbeste Proxies.

---

## Phase 1 — 3D komplett raus

- [ ] 1.1 lamellae.ts + ggf. background.ts (3D-Anteile) löschen
- [ ] 1.2 index.html + pro/index.html: 3D-Canvas + 3D-Script-Imports raus
- [ ] 1.3 src/main.ts: 3D-Init-Calls raus
- [ ] 1.4 npm uninstall postprocessing (nur wenn für 3D-Bloom)
- [ ] 1.5 Bundle-Verify (vite build → kein Three.js-Crystal/Lamellae-Code mehr)

**Commit:** _tba_

---

## Phase 2 — Editorial Hero Redesign

- [ ] 2.1 Layout-Stack (Aurora-WebGL + Noise + Typo + Logo/Meta + Cursor)
- [ ] 2.2 Desktop-Typo: "Oskar" 280px / "Marketing" italic 220px asymmetrisch
- [ ] 2.3 Mobile-Stack
- [ ] 2.4 OV-Logo bleibt
- [ ] 2.5 SplitType Char-by-Char Reveal

**Commit:** _tba_

---

## Phase 3 — Scroll-Pin fixen

- [ ] 3.1 Debugging-Pass (ScrollTrigger events, Lenis-Bridge, z-index)
- [ ] 3.2 Lenis + ScrollTrigger.update bridge, smoothTouch: false
- [ ] 3.3 Hero-Choreographie (4 Progress-Phasen)
- [ ] 3.4 iOS-Verify (per TS/build proxy nur)
- [ ] 3.5 Pro-Page gleiche Mechanik

**Commit:** _tba_

---

## Phase 4 — Section-Choreographie

- [ ] 4.1 Status Quo (counter staggered)
- [ ] 4.2 Proof (split-reveal + strike-through)
- [ ] 4.3 Academy (slide-in + price count)
- [ ] 4.4 Termin (asymmetric + slot stagger)
- [ ] 4.5 Channels (4 cards stagger)
- [ ] 4.6 Manifest (word-by-word reveals)
- [ ] 4.7 Globale: connecting line, progress bar, section indicator
- [ ] 4.8 Reduced-Motion-Fallback

**Commit:** _tba_

---

## Phase 5 — Web3Forms Calendar

- [ ] 5.1 Form-Struktur (slot + email + tel + message + consent)
- [ ] 5.2 POST zu Web3Forms (Placeholder-Key)
- [ ] 5.3 LocalStorage-Slot-Reservation
- [ ] 5.4 Success-State
- [ ] 5.5 Error-Handling
- [ ] 5.6 docs/MORNING-STEPS.md

**Commit:** _tba_

---

## Phase 6 — Polish + Performance

- [ ] 6.1 Cursor (8px inner + 32px outer, lerp 0.15, mix-blend difference)
- [ ] 6.2 Selection + focus-visible
- [ ] 6.3 Custom Scrollbar
- [ ] 6.4 Bundle-Analyse (Critical < 70KB gzip, total < 250KB)
- [ ] 6.5 Lighthouse (Proxy: kein Run möglich nachts — Build-Size + Audit-Heuristik)
- [ ] 6.6 Font-Subset + preload
- [ ] 6.7 Loader-Easing cubic-bezier(0.23, 1, 0.32, 1)

**Commit:** _tba_

---

## Phase 7 — Deploy + Report

- [ ] 7.1 Final build
- [ ] 7.2 git push
- [ ] 7.3 docs/PATH-C-REPORT.md
