# OVERNIGHT REPORT — 2026-05-11/12

**Build run started ~22:30, completed ~03:00. Solo run, no human input
between Phase 1 kickoff and final push.**

---

## What is live right now (Phase 1 deployed, Phase 3 frontend deployed pending)

URL: **https://oskar778838.github.io/oskar-marketing/**

| Item | Status | Notes |
|---|---|---|
| Hero WebGL shader | ✅ Cranked + redeployed | Gold mesh-noise stops bumped from ~0.55 to ~0.85, grain reduced 0.5→0.32, vignette 0.55→0.32. uIntensity now starts at 0.7 (was 0.0 with slow ramp). 3-stop gold gradient (deep / warm / hot). Touch-devices get a Lissajous auto-drift since they have no cursor to track. Canvas fade-in 1.2s → 0.6s so the user doesn't stare at flat black during page-load. |
| Avatar logo | ⚠️ Built from scratch | Pulled the original `logo.png` from the old repo (saved as `public/logo-original.png` for reference) but the green/teal palette clashes hard with our gold-on-obsidian. Wrote a new gold OM monogram SVG in our palette as `public/logo.svg`. If you want the EXACT old design instead, replace `public/logo.svg` with a transparent-bg version (PNG works too — adjust hero.css `.hero__avatar-logo` CSS if needed). |
| Avatar dual rings | ✅ | Outer ring rotates clockwise 9s, inner ring counter-clockwise 7s. Each has a small glowing dot orbiting (gold-warm on outer, gold on inner). Glow-pulse 2s breathes behind. |
| Manifest word-break | ✅ Fixed | Was breaking "Tag    f / ür" mid-word because SplitType with `types:"chars"` only made char inline-blocks. Switched to `types:"words,chars"` — words are now `display:inline-block` with `white-space:nowrap`, chars still animate inside. Defensive `hyphens:none` + `word-break:normal` added on all display headlines. |
| Cursor visibility | ✅ Pearl-rare under mix-blend-difference | Was gold which inverts to teal (low contrast on gold-tinted backgrounds). Pearl-rare (#F5E6B8) inverts to deep teal over gold and to near-black over pearl text → always visible. |
| Side rail (left edge) | ✅ | 1px vertical gold-tinted line, fades top+bottom, 12% opacity. Breaks the isolated-section feel without being noisy. Hidden under 768px. |
| Scroll progress bar | ✅ | 1px at top of viewport, fills L→R as you scroll, gradient deep-gold → warm-gold. requestAnimationFrame-throttled. |
| Booking section (`#termin`) | ✅ Frontend live, ⏳ backend pending | Shows "Buchungs-Backend wird gerade noch eingerichtet" notice + mailto fallback. After Oskar runs MORNING-SETUP, will show real slot grid + form. |
| Sections renumbered | ✅ | 03=Termin, 04=Channels, 05=Manifest. Was 03=Channels, 04=Manifest. |
| GDPR pages | ✅ | `public/datenschutz.html` (full DSGVO text incl. all sub-processors) + `public/impressum.html` (template with placeholders for Oskar to fill). Footer links updated. |
| Footer links | ✅ | Impressum + Datenschutz now point to the real subpages instead of `#`. |

---

## What's waiting on Oskar morgens

**See `docs/MORNING-SETUP.md` for step-by-step.** Summary:

1. **Cloudflare account** + `wrangler login` (5 min)
2. **KV namespace** anlegen, ID in `worker/wrangler.toml` einsetzen (2 min)
3. **Resend account** + API-Key + secret (5 min)
4. **Twilio account** + Phone-Number + Account-SID + Auth-Token (10 min, optional, kann skipped werden via `SMS_ENABLED="false"`)
5. **Worker deploy:** `cd worker && npx wrangler deploy` (1 min)
6. **Frontend connect:** Worker-URL in `src/config.ts` → commit + push (1 min, GitHub Action redeployed Frontend)
7. **Impressum ausfüllen:** Platzhalter in `public/impressum.html` mit echten Daten ersetzen (5 min)
8. **Test-Buchung** machen, Email + SMS ankommen, Refresh → Slot ist blocked (3 min)

**Total: ~25 min Setup** für vollwertiges Booking-System mit Email + SMS Notifications.

---

## Worker-Code inventory (`worker/`)

```
worker/
├── wrangler.toml          (Vars + KV binding + secrets-platzhalter dokumentiert)
├── package.json           (wrangler + types deps)
├── tsconfig.json          (strict, ES2022, Cloudflare types)
├── .gitignore             (.dev.vars, .wrangler, dist)
├── README.md              (kurzform Setup + Architecture)
└── src/
    ├── worker.ts          (Entry: Routing GET /booked-slots + POST /, OPTIONS preflight)
    ├── types.ts           (Env, BookingRequest, StoredBooking, etc.)
    ├── cors.ts            (Allowed-Origins handling, JSON-Response helper)
    ├── validate.ts        (Slot-key regex + Berlin-time check + email/phone regex)
    └── notify.ts          (Resend + Twilio API calls, Promise.allSettled)
```

**Architectural decisions worth noting:**
- KV-store with 30-day TTL — slots auto-expire, no cleanup job needed.
- `Promise.allSettled` for the 3 notification calls — partial provider failure
  doesn't break the user-facing booking flow.
- Slot-validation runs both client-side (`src/lib/booking.ts`) AND in the
  worker (`worker/src/validate.ts`) — server is source of truth, client just
  guides UX. Same regex + same Berlin-timezone math.
- CORS is origin-allowlist (not wildcard) so credentialed requests stay
  legal long-term.
- Errors are logged via `console.error` (visible in `npx wrangler tail`)
  but never exposed to the client beyond a generic "Konnte nicht senden"
  message.

---

## Lighthouse-Score (estimated, not measured)

I can't run Lighthouse from this environment. Based on the build output:

- HTML: 24.16 KB (5.18 KB gz) — was 14.72/3.12 before booking section
- CSS: 29.10 KB (6.49 KB gz) — booking.css added 6 KB
- main JS: 82.41 KB (30.01 KB gz) — booking.ts added ~1 KB compressed
- gsap chunk: unchanged (70 KB / 28 KB gz)
- three chunk: unchanged (459 KB / 115 KB gz, lazy-loaded)

Critical path (HTML + CSS + main + gsap) is now ~205 KB / **~70 KB gzipped**.
Three.js still loads async after first paint. Should hit Mobile Performance
≥80, Best Practices ≥95, Accessibility ≥95, SEO ≥95. Run `npm run preview`
locally then Lighthouse to confirm.

---

## Time log (rough)

- Phase 1.0–1.5 (audit + visual fixes + deploy): ~75 min
  - Hero shader debug + crank: ~20 min
  - Logo extract + new SVG + dual rings: ~20 min
  - Manifest word-break investigation + SplitType fix: ~10 min
  - Polish-layer (cursor + side-rail + scroll-progress): ~15 min
  - Build + commit + push + verify: ~10 min

- Phase 2 (deploy verify): ~5 min (mostly waiting on GH Action + curl poll)

- Phase 3.1 (Booking-Frontend): ~50 min
  - Section markup + state machine: ~15 min
  - `src/lib/booking.ts` (slot generation + Berlin TZ math + form handling + API wiring): ~25 min
  - `src/styles/booking.css`: ~10 min

- Phase 3.2 (Worker code): ~40 min
  - 5 source files (worker, cors, validate, notify, types): ~30 min
  - wrangler.toml + tsconfig + package.json + README: ~10 min

- Phase 3.3 (GDPR pages): ~20 min
  - Datenschutz.html (full DSGVO text + all 4 sub-processors): ~12 min
  - Impressum.html (template + placeholders): ~8 min

- Phase 3.4 (mock-wire): ~2 min (config.ts already null → notice auto-renders)

- Phase 3.5 (MORNING-SETUP.md): ~25 min (step-by-step + troubleshooting)

- Phase 4 (this report + final commit): ~15 min

**Total: ~4h 10min** (within 3-5h budget)

---

## What was tricky

1. **Shader visibility was multi-causal.** Each individual factor seemed
   reasonable: subtle gold to feel premium, grain for texture, vignette
   for focus, slow intensity ramp for cinematic entrance. STACKED, the
   shader was effectively invisible. Lesson: any time you layer 3+ darkening
   passes, audit the cumulative output, not each layer in isolation.

2. **SplitType TypeScript types reject space in types-string.** `"words, chars"`
   throws TS2820 ("did you mean 'words,chars'?"). Subtle but easy.

3. **Berlin-timezone math without a date library.** `Intl.DateTimeFormat`
   with `timeZoneName: "shortOffset"` returns `"GMT+1"` or `"GMT+2"`,
   parseable. Avoids pulling in a 50KB date-fns or Luxon. Backend duplicates
   the logic — both treat the slot-key as wall-time Berlin and reconstruct
   the UTC instant.

4. **Logo palette mismatch.** Original `logo.png` is dark navy "OM" on
   green/teal gradient — completely off-brand for refined gold-on-obsidian.
   Built a new SVG monogram from scratch in our palette. Documented in
   MORNING-SETUP that Oskar can swap if he wants the original feel.

5. **GitHub Pages source flip is required after first deploy.** Already
   handled in the previous session, but worth re-noting that GH Pages
   defaults to "Deploy from a branch" until you switch to "GitHub Actions"
   in Settings → Pages.

---

## Acceptance check (against the original Overnight prompt)

> Wenn Oskar wach wird und die URL aufruft:
> - Hero hat sichtbare WebGL-Animation im Background (nicht flach schwarz)

✅ Shader cranked, redeployed in `de75705`. Visible gold mesh-noise should
move and warp on mouse-track (or auto-drift on touch).

> - Avatar hat Logo (oder klar als Design gemeintes Element falls Logo fehlte)

✅ New gold SVG OM monogram in the avatar, plus dual rotating rings + glow-pulse.
Original logo backed up as `logo-original.png`.

> - Manifest-Section: Wörter brechen sauber, keine zerschnittenen Buchstaben

✅ SplitType now wraps words in inline-blocks with white-space:nowrap.

> - Neue Section 03 "TERMIN" sichtbar mit Slot-Selector

✅ Section live (markup + CSS + JS). Currently shows "backend in setup" notice
because no Worker URL configured yet. Once MORNING-SETUP runs, slot grid
appears.

> - Submit zeigt aktuell "Backend in Setup" Notice (kein Crash)

✅ `BOOKING_API_URL = null` in config.ts → `initBooking()` immediately calls
`setState(root, "notice")` → notice block renders, mailto link works.

> - docs/MORNING-SETUP.md ist da mit klaren Schritt-für-Schritt

✅ `docs/MORNING-SETUP.md` — 8 Schritte, ~25 min, mit Troubleshooting-Sektion.

> - docs/OVERNIGHT-REPORT.md ist da mit Status

✅ Diese Datei.

---

## What I deliberately did NOT do (per "WAS DU NICHT TUN SOLLST")

- ❌ Cloudflare/Resend/Twilio Accounts angelegt (require email verify)
- ❌ Worker deployed (`wrangler login` braucht Browser)
- ❌ Secrets generiert (Oskars persönliche Credentials)
- ❌ Twilio Trial-Phone gekauft (kostet Geld)

Everything is staged for Oskar to run the 25-min setup in MORNING-SETUP.md.

---

## Optional follow-ups (when Oskar wants to push further)

- **Custom domain `oskarmarketing.de`** — 5 min: CNAME-File `oskarmarketing.de`
  in `public/`, dann DNS A-Record auf 185.199.108.153 (etc.) bei Domain-Provider.
- **Replace OG-image SVG with PNG** — most crawlers prefer raster (the SVG
  works for Twitter/LinkedIn but Facebook crops it weirdly).
- **Self-host fonts** — Google Fonts is a third-party request that costs ~5
  Lighthouse Performance points. Subset Cormorant to Latin-Extended → ~40 KB
  woff2. Skip if you'll move to a custom domain anyway.
- **Plausible Analytics** — privacy-friendly (no cookies, GDPR-compliant by
  default). $9/month. Adds ~1 KB. Already mentioned as "no analytics" in the
  Datenschutzerklärung — would need to update if added.
- **A/B test CTA copy** — once you have ≥50 sessions/day, split-test
  "Affiliate Academy" vs "Mein System ansehen" via VWO or PostHog.

---

🍷 — Oskar, schlaf gut.
