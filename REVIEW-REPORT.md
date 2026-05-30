# Ultra-Review Report — 2026-05-29

Read-only, evidence-based pre-traffic audit of the oskarmarketing bio-site. 10 parallel lanes (Opus 4.8 sub-agents) + inline verification by the orchestrator. Every claim below is backed by a `file:line`, a command output, a Lighthouse/axe number, or an HTTP probe. No code was changed — see `git status` at the end. Lane fragments live in `.review-artifacts/`.

---

## Executive Summary

**Overall: 🟠 — engineering is strong; the legal layer and one perf decision are launch-blockers.**

The *code* is in genuinely good shape: strict TypeScript with one `as any` in 4,000 LOC, zero TODO/FIXME, clean `npm audit` on production deps, allowlist CORS, true Double-Opt-In, best-in-class `prefers-reduced-motion`, excellent CLS, and a correctly lazy/DPR-capped WebGL hero. What is **not** ready for traffic is the compliance surface and one third-party loading decision.

**Top 3 Critical findings:**
1. **The live Impressum is an unfilled placeholder** — `[PLATZHALTER]`, `Oskar [Nachname]`, `[Straße + Hausnummer]` are served right now at `oskarmarketing.de/impressum.html`, while a commercial **997 €** offer is live. A missing § 5 DDG Impressum on a commercial site is a textbook Abmahnung trigger.
2. **A 13-year-old operator with no responsible adult / gesetzlicher Vertreter named** anywhere, while money (997 € + Digistore affiliate) is changing hands. This is a real legal-capacity risk, not a cosmetic one.
3. **The Cal.eu booking embed loads eagerly at parse → mobile home Lighthouse perf = 59, LCP = 3186 ms.** Measured: Cal is **1648 kB across 82 requests = 82 % of page weight**. three.js (the assumed culprit) is only 113 kB / 5.6 %. The same eager `<script>` also transfers data to a US origin before consent (a legal finding too).

**Recommended fix order** (do not ramp traffic until 1–5 are done):
1. Fill the Impressum (real name + address) and name a parent/guardian as Verantwortlicher in both legal pages.
2. Correct the Datenschutz: remove the wrong processors (Resend/Twilio), disclose the real Cal.eu flow, fix the stale `.bio` domain, bump the *Stand* date.
3. **Lazy-load / click-to-load the Cal embed** — single highest-leverage change: fixes the mobile perf failure, the pre-consent US transfer, *and* the best-practices cookie hits at once.
4. Self-host Google Fonts (removes the unconsented Google transfer + improves the `/playbook.html` LCP).
5. Ship a raster `og-image.png` (social cards are blank on every platform today).
6. Then: retire the dead booking stack, fix the two AA contrast failures, work the backlog.

---

## 🔴 Critical (must fix before traffic ramp-up)

| # | Finding | Location | Evidence | Suggested fix |
|---|---------|----------|----------|---------------|
| C1 | **Impressum is an unfilled placeholder, live in production** | `public/impressum.html:160-185` | Source + cache-busted `curl https://oskarmarketing.de/impressum.html` both show `[PLATZHALTER]`, `Oskar [Nachname]`, `[Straße + Hausnummer]`, `[PLZ] [Stadt]`, phone `[optional eintragen]`. Also cites the **repealed § 5 TMG** and **§ 55 RStV** — should be § 5 DDG and § 18 MStV. § 5 DDG requires a real surname + ladungsfähige Anschrift; a commercial 997 € offer is shown. | Fill real surname, full street address, PLZ/Stadt; delete `.placeholder` block; update statute references to DDG/MStV; resolve USt-IdNr vs. § 19 UStG Kleinunternehmer. **Needs legal verification.** |
| C2 | **Minor (13) operator — no responsible adult / gesetzlicher Vertreter named while commercial offer + affiliate run** | `public/datenschutz.html:179`, `pro/index.html:206,208` | "Verantwortlicher" names only "Oskar". Pro page shows **997 €** (`pro/index.html:206`) + a Digistore `aff=` affiliate link (`:208`). Per project record the operator is 13 → limited Geschäftsfähigkeit (§§ 106 ff. BGB); no parent/guardian named as Verantwortlicher anywhere. | Name the parent/guardian as Verantwortlicher / gesetzlicher Vertreter in Impressum + Datenschutz. **Needs legal verification with parental involvement** — real risk because money is involved. |
| C3 | **Cal.eu embed loads eagerly → mobile home perf 59, LCP 3186 ms, TBT 2187 ms** | `index.html:591-633` (and `pro/index.html:345-386`) | `home-mobile.json`: perf **59**, LCP **3186 ms**, TBT **2187 ms**, main-thread work 8.9 s, bootup 3.9 s. Network: **Cal.eu = 1648 kB / 82 requests = 82 %** of the 2003 kB page; three.js only 113 kB. `Cal("init")` fires inline at parse with no gate. Desktop hits 86 with identical code → the gap is mobile main-thread, all Cal. | Lazy-load Cal via IntersectionObserver on the Termin section, or click-to-load ("Termin laden"). Removes ~1648 kB/82 requests + most TBT + the third-party-cookie BP hits. Mobile perf should recover toward 85+. Fixes L8 consent finding simultaneously. |

> Note on C3 severity: this is a conversion/trust risk on a site whose purpose is conversion and which is about to take traffic — not a crash. Graded critical for that reason; if the perf bar is informal, treat as high-important.

---

## 🟠 Important (this week)

| # | Finding | Location | Evidence | Suggested fix |
|---|---------|----------|----------|---------------|
| I1 | Datenschutz discloses **wrong processors** (Resend + Twilio) and a superseded booking flow | `public/datenschutz.html:282-296` | Policy lists Resend + Twilio as Auftragsverarbeiter, but live booking is the Cal.eu embed (`index.html:615`); commit `967e280` replaced the slot grid. Resend/Twilio exist only in the **dead** worker POST path (`notify.ts`). Live curl still shows them. | Reconcile policy with the single real flow: drop Resend/Twilio, add Cal.eu (Cal.com, EU/US), retire the dead worker path. **Needs human verification of prod wiring.** |
| I2 | **Google Fonts hot-linked** from `fonts.googleapis.com` on every page (unconsented IP transfer to Google US) | `index.html:48-58`, `pro/index.html:20-25`, all legal/404/playbook pages | All HTML loads `fonts.googleapis.com/css2?...` at parse. `datenschutz.html:367-371` itself admits the IP goes to Google. Matches the LG München I Google-Fonts Abmahnung pattern; disclosure does not cure an unconsented transfer. | Self-host WOFF2 (`public/fonts/` + `@font-face`), remove the Google preconnect/preload. **Needs legal verification, strongly recommended.** |
| I3 | **Cal `embed.js` (US origin) runs on load before any consent** | `index.html:615`, `pro/index.html:336-339,373` | Loader injects `https://app.cal.com/embed/embed.js` into `<head>` immediately and mounts the iframe; origin override points data at cal.eu but the script is fetched from US `app.cal.com` on every visit, no consent gate. | Same fix as C3 (click-to-load / consent gate) resolves this. **Needs legal verification of Cal cookie behaviour.** |
| I4 | **OG image is an SVG with no raster fallback** — social share cards blank everywhere | `index.html:24,31`, `public/playbook.html:18` | `og:image`/`twitter:image` = `./og-image.svg`. Live: `og-image.svg` → 200 `image/svg+xml`; `og-image.png` → **404**. FB/LinkedIn/X/WhatsApp/Slack ignore SVG OG images. | Export a 1200×630 PNG and point `og:image`/`twitter:image` at the **absolute** `https://oskarmarketing.de/og-image.png`. |
| I5 | **Stale `.bio` domain in DSGVO legal text** (production is `.de`) | `public/datenschutz.html:11,189`, `public/impressum.html:11` | Both legal pages name `oskarmarketing.bio`; canonical/og/production everywhere is `oskarmarketing.de`. Wrong domain in compliance copy is a trust/legal smell. | Replace `.bio` → `.de` (3 occurrences). |
| I6 | **Dead pre-Cal.eu booking module still ships in production `main.js`** | `src/lib/booking.ts:1-462` (imported `src/main.ts:16,38`) | `initBooking()` early-returns unless `#booking-app` exists; `index.html` has no `#booking-app`/`#slot-grid` (grep: no matches) — live booking uses `data-booking-gate` handled by `bookingGate.ts`. Yet all 462 LOC are minified into `dist/assets/main-DRerspbr.js` and parsed on every load. | Delete `booking.ts` + its `main.ts` import/call, or document it as intentionally retained for a planned revert. |
| I7 | **Dead worker routes**: `POST /` + `GET /booked-slots` + `notify.ts` (Resend/Twilio) unreachable from the live front-end | `worker/src/worker.ts:52,134-148,152-235`; `worker/src/notify.ts:1-187` | Only worker call from `src/` is `playbookForm.ts:66` → `/subscribe`. `booking.ts` reads LocalStorage / posts to Web3Forms, not the worker. The entire Resend+Twilio integration (187 LOC) is invoked only by the dead `handlePost`. | Remove the POST `/` + `GET /booked-slots` routes and `notify.ts`, or mark as documented future feature. Shrinks attack surface + secret wiring. |
| I8 | **Worker logs visitor email (PII) in cleartext** | `worker/src/worker.ts:229-231` | `console.log(`[booking] reserved ${slotKey} for ${email} …`)` writes the visitor email to Worker tail/Logpush retention. DSGVO data-minimization issue. **Mitigation: this line sits inside the dead `handlePost`, so it does not fire on the live site today** — latent until/if booking reverts. | Drop `${email}` (log only `slotKey` or a hash), or delete `handlePost` (folds into I7). |
| I9 | **No rate-limiting / bot protection on public Worker endpoints** | `worker/src/worker.ts:42-61` | No `turnstile|recaptcha|rate.?limit` anywhere in `worker/`. `POST /subscribe` fires a Brevo DOI mail per request; `POST /` (if revived) fires paid Resend+Twilio. Worker URL is shipped in the bundle (`src/config.ts:77`). CORS does not block server-side `curl`, so quota/spam abuse is scriptable. | Add Cloudflare Turnstile or a per-IP KV/Durable-Object throttle in front of `/subscribe` (and `/` if kept). If the booking route is dead (I7), removing it eliminates most of the surface. |
| I10 | **`three-stdlib` is a dead production dependency** | `package.json:25` | Declared `^2.36.1` but `grep -rn three-stdlib src/` and `RoomEnvironment` → no matches; not in any `dist/assets/*.js`. 29 MB in `node_modules`. Only reference is a checked-off TODO in `docs/PREMIUM-3D-TODO.md`. | `npm uninstall three-stdlib` + remove from `package.json` — risk-free, never bundled. |
| I11 | **Several direct deps 1+ majors behind** | `package.json:13-26`, `worker/package.json` | `npm outdated`: vite 5.4.21 → 8.0.14 (3 majors), wrangler 3.114 → 4.95 (1), typescript 5.9 → 6.0 (1), three 0.169 → 0.184. Pinned via `^` + `npm ci`, so prod is reproducible — upgrade debt, not a live break. | Bump wrangler 3→4 first (also clears the worker dev-vulns, I-backlog). Defer vite/TS majors to a dedicated pass. |
| I12 | **Two WCAG-AA contrast failures on the most-readable-critical text** | `src/styles/sections.css:1186-1191` (`.playbook__privacy`); `src/styles/tokens.css:39` (`--muted-low`) | axe + independent computation: DSGVO privacy fine print `#a8abb1` on `#F5F7F8` = **2.14:1** (FAIL, at 10px). `--muted-low` = `#757982` = **4.06:1** (just under 4.5) and is reused by `label[for=pb-email]`, `.consent__text`, `.playbook__sub`, `/pro/` fit-check body (14 nodes on `/`, 7 on `/pro/`). | Darken `--muted-low` to ≥ `#6a6f78` (≥ 4.6:1) or use the existing `--color-ink-muted` `#4A4F5A` (7.64:1) for legal/reading text. |
| I13 | **`/playbook.html` footer still uses pre-pivot ORANGE tokens — back-link 1.55:1, effectively invisible** | `public/playbook.html:754-767` | axe color-contrast serious: `.footer-back` ("Zur Hauptseite") = `#bdbefc` on `#eef1f5` = **1.55:1** (FAIL even at 3:1 UI). Footer still references `var(--orange)`, `var(--text-muted)` — legacy tokens never migrated. | Migrate the footer to `--color-*` tokens; raise link/copy to ≥ 4.5:1. (Pairs with brand finding B1.) |
| I14 | **Full DOI happy path + Brevo redirect not verified; template redirect can silently diverge** | `worker/wrangler.toml:36-40`, `worker/src/brevo.ts:46` | `wrangler.toml:36-39` warns the Brevo template (ID 1) has its **own** redirect field that wins over `BREVO_REDIRECT_URL` if it diverges. Audit stayed non-destructive (invalid-payload probes only), so real DOI-mail delivery, `BREVO_API_KEY` validity, and the post-confirm redirect are **unverified**. | Run the manual happy path once: real opt-in → confirm DOI mail arrives + contains the playbook link → click → lands on `/playbook.html` → contact confirmed in Brevo list 3. Confirm `BREVO_API_KEY` is set on the deployed worker. **Needs human verification.** |
| I15 | **`/playbook.html` is a pre-pivot design island** (different display font + forked token system) | `public/playbook.html:23,43-57` | Loads **Fraunces** (`:23`, ~25 inline uses) while index+pro use Cormorant Garamond. Declares its own `:root` with the indigo palette pasted under stale names: `--orange:#5B5BD6`, `--orange-light:#A8A8FF` (`:53-56`), ~50 refs. Visitors crossing index → playbook see a typeface + architecture switch. | Migrate `playbook.html` onto `tokens.css`; at minimum rename `--orange*` → `--accent*`. Confirm the fork is intentional. |
| I16 | **Main bio page bypasses the `.glass-*` system** — two parallel glass implementations | `index.html` (0 `.glass-*` uses) vs `src/styles/pro-glass.css:11-52`, `sections.css:1330-1437`, `hero.css:759-899` | `.glass-heavy/.glass-subtle/.glass-highlight` defined in `pro-glass.css`, used 5× on `/pro/`, **0× on the bio page**, which hand-codes the same frosted look with hardcoded `blur(8/9/10/11/12/14/16px)` instead of the system's 12/24/36px tiers. | Promote glass variants to a shared sheet + apply on the bio page, or consolidate blur radii into `--glass-blur-*` tokens. Maintainability, not a bug. |

---

## 🟡 Nice-to-have (backlog)

- **WebGL plasma has no FPS cap, no off-screen pause, no mobile/low-power disable** — renders a 5-octave fbm × 3-layer shader every RAF tick at up to 2× DPR; only `document.hidden` pauses it (`src/hero/background.ts:150-164,191-244`). Add an IntersectionObserver guard + a reduced/static variant on touch. (Per-frame mobile GPU cost *needs human verification* — recommend a mid-range Android trace.)
- **`three.js` → raw-WebGL reduction (~110 kB gzip saveable)** — `background.ts` imports `* as THREE` but uses only 7 symbols for one fullscreen shader quad; `WebGLRenderer` drags in the whole backend (458 kB raw). *But measurement shows three is NOT the bottleneck (5.6 % of wire weight, lazy-loaded)* — backlog, not urgent. Interim: gate the dynamic `import()` on `!reduced-motion && !touch` so those users skip the 114 kB download entirely.
- **`/pro/` ships `sectionIndicator` (~44 kB gzip JS+CSS) for a single-purpose funnel** (`src/pro.ts:14-21`) — evaluate a lighter pro-only build.
- **553 KB unused `public/logo-original.png`** committed but referenced nowhere (`grep logo-original` → 0); largest committed blob. `git rm` it (keep an off-repo backup).
- **Two fully-merged stale branches** (`feature/funnel-fixes`, `feature/brand-pivot-indigo`) — 0 commits ahead of main; `git branch -d` + delete on origin.
- **`scripts/diagnose-output.json` untracked and not gitignored** — generated artifact; add to `.gitignore`.
- **`docs/` bloat: ~26 stale one-off process reports** (OVERNIGHT-REPORT, MORNING-*, PATH-C-*, etc.) — move to `docs/archive/` or delete; zero prod impact, navigation noise.
- **README drift** — omits `build/preview/lint/diagnose:pro` scripts + the worker/Brevo backend + `/pro/` route; pre-pivot framing.
- **`pro/index.html` missing self-canonical** (noindex, so nil SEO impact) — cheap best practice.
- **Person JSON-LD lacks `url`/`image`; no Organization/WebSite schema** (`index.html:61-75`); the 4 `sameAs` handles return 200/302, *unverified ownership — needs human verification* before launch.
- **Two oversized functions**: `runChoreography` 314 LOC (`choreography.ts:90-403`), `initHeroBackground` 244 LOC / nesting depth 6 (`background.ts:4-247`). Split into helpers.
- **~117 brand `rgba()` literals duplicate canonical hex** across stylesheets — a palette change touches ~117 sites vs. 10 tokens. Add an alpha-token layer or `color-mix()`. Plus un-tokenized error-red (`rgba(245,87,87)` ×5) and inline `#A8A8FF` (`index.html:113-114`).
- **`CLAUDE.md` font list is wrong/incomplete** — actual stack is Cormorant Garamond (display) + **DM Sans** (body, `tokens.css:45`) + JetBrains Mono; docs say only "Cormorant + JetBrains Mono", the audit brief said "Fraunces + Inter" (also wrong for the main site).
- **Worker dev-only vulns** (undici high, esbuild moderate — transitive via wrangler 3.x devDeps; never shipped to the edge). Cleared by I11's wrangler 3→4.
- **`/playbook.html` has no `<main>` landmark**; 7 regions outside any landmark; `role=listitem` on non-list elements + an aside nested in a landmark (axe moderate/minor).
- **Legal "Stand: 11. Mai 2026" date will be stale** once flow/processors are corrected — bump it.
- **No `.env.example` / `.dev.vars.example`** documenting required secret names (only in `wrangler.toml` comments).
- **Subscribe form lives at `/#playbook` (index.html), not `/playbook.html`** — the post-confirm redirect to `/playbook.html` (the content page, no form) is intentional, but a cold visitor landing on `/playbook.html` finds no opt-in; add a back-link.
- **Legacy Web3Forms booking module retains a placeholder key** (`config.ts:53`) — folds into I6 dead-code removal.
- **GSAP license awareness** — GSAP 3.15 is free for commercial use but governed by GreenSock's "no charge" license, not an irrevocable OSI grant; re-check on future upgrades.

---

## 🟢 What's done well (with evidence)

- **Secrets discipline is excellent.** No real secret value across 119 commits (`git log --all -p` value-scan returns only sha512 hashes); secrets via `wrangler secret put` (`wrangler.toml:42-47`); the Web3Forms key is a literal `PLACEHOLDER_…` that short-circuits the network call.
- **CORS is allowlist-based, not wildcard, and never reflects bogus origins.** Live-verified: `Origin: evil.example.com` → `ACAO: https://oskar778838.github.io` (fixed fallback), never `*`, no `Allow-Credentials` (`cors.ts:10-18`).
- **Genuine Double-Opt-In, server-side validated.** `brevoCreateDoiContact` → Brevo `doubleOptinConfirmation` (`brevo.ts:21-85`); live curl probes confirm 400s for empty body / bad email / missing consent (`worker.ts:81-86`). No ReDoS in the validation regexes; email is HTML-escaped in templates; message capped at 500 chars.
- **Production deps are vuln-free.** `npm audit --omit=dev` → 0 across all severities (root + worker). Service worker never caches cross-origin/API responses (`public/sw.js:36,41`).
- **`prefers-reduced-motion` is best-in-class.** The WebGL hero renders one frame at t=0 and skips the RAF loop entirely under RM (`background.ts:5-8`); all CSS durations collapse to 1 ms (`tokens.css:113-120`); 10+ JS modules honor the same query.
- **Real, visible focus management.** Global `:focus-visible{outline:2px dashed; offset:4px}` (`base.css:430`); every `outline:none` paired with a visible replacement; working skip-links, keyboard-accessible journal carousel, properly labelled form inputs + consent checkbox. Accent `#5B5BD6` on base = 5.00:1 (passes).
- **Type discipline.** Strict `tsc` passes clean; exactly **one** `as any` in all of `src/` (a Three.js internal, `background.ts:64`), **zero** in `worker/src/`, zero `@ts-ignore`. Zero empty catch blocks across 27 catch sites; `Promise.allSettled` fan-out.
- **Token system + brand pivot.** `tokens.css` is a single, commented source of truth; the gold→indigo pivot is complete on index + pro via a deliberate legacy-alias layer (`tokens.css:20-36`); no leftover gold hex on the live brand surface.
- **SEO fundamentals are clean.** Unique titles, exactly one `<h1>`/page, no skipped heading levels, `lang=de`, valid JSON-LD, valid sitemap with resolving `.de` URLs, and correct `robots.txt` + `noindex` discipline on the hidden `/pro/` funnel (live-verified).
- **Zero trackers/analytics/cookies** (grep across all HTML/JS); the qualifying-gate free-text stays in localStorage and is never transmitted (`bookingGate.ts:64,76`). Affiliate link carries `rel="sponsored"` + visible Werbekennzeichnung + Impressum section.
- **Lean, well-structured build.** 5 prod + 5 dev deps; `manualChunks` isolates three + gsap; the heavy hero is dynamically imported after first paint (`main.ts:58-64`); reproducible `npm ci` + type-check-gated CI. No copyleft licenses.
- **Repo hygiene.** Zero TODO/FIXME/HACK/XXX in shipping code; no tracked `node_modules`/`dist`; well-curated `.gitignore`; active (last commit 2 days before audit).
- **Performance bright spots.** Excellent **CLS 0.00–0.02 on every route/form-factor**; `/playbook.html` is a model fast page (desktop perf **99**, TBT 0, 160 kB, zero framework). three.js is correctly lazy/DPR-capped/tab-paused — not the bottleneck.

---

## Stats

- **Files reviewed:** 110 tracked (excl. `node_modules`, `package-lock.json`).
- **LOC analyzed:** ~11,900 — `src` TS 3,292 · `worker/src` TS 719 · CSS 4,453 · HTML 3,434.
- **Sub-agents run:** 10 (1 per lane), Opus 4.8.
- **Tooling that ran for real:** Lighthouse ×6 (3 routes × mobile/desktop, live site, system Chrome), axe-core 4.10.2 ×3 routes (`.review-artifacts/axe/`), Playwright funnel trace + 2 screenshots (`.review-artifacts/shots/`), `npm audit` ×2, `npm outdated`, `license-checker`, full `git log` history scan. **knip failed** (oxc-resolver native binding missing on win32 — dead-code findings done by manual import-graph tracing instead).
- **TODO/FIXME/HACK/XXX in shipping code:** **0**.
- **`any` / `@ts-ignore`:** 1 `as any`, 0 `@ts-ignore` across `src/` + `worker/src/`.
- **Lighthouse (live, perf / a11y / BP / SEO):**

  | Route | Mobile | Desktop |
  |---|---|---|
  | `/` | 59 / 97 / 77 / 100 | 86 / 97 / 77 / 100 |
  | `/pro/` | 70 / 96 / 77 / 63ⁿ | 83 / 96 / 77 / 63ⁿ |
  | `/playbook.html` | 89 / 88 / 100 / 100 | 99 / 88 / 100 / 100 |

  ⁿ `/pro/` SEO 63 is by design (intentional `noindex` funnel — the only failing audit is `is-crawlable`).
  **Perf averages:** mobile ≈ **73**, desktop ≈ **89**. Best-practices 77 on index/pro is entirely the Cal embed's third-party cookies (resolved by C3).
- **Token spend:** ~628 k sub-agent output tokens + orchestrator inline ≈ **~0.7 M total**. **Wall-clock:** workflow 27.1 min + inline build/probe/aggregation ≈ **~35 min**.

---

## Deep-Dive Candidates (worth a focused follow-up run)

1. **Production wiring of the booking flow** — confirm at the deployed `*.workers.dev` URL and live DOM whether `POST /` / `#booking-app` are truly dead. This single answer unblocks I6/I7/I8/I9 (remove the whole stack) vs. keeping it hardened. *Question: is any path other than `/subscribe` reachable in production?*
2. **Full Brevo DOI happy path** (I14) — one manual end-to-end opt-in to verify mail delivery, the playbook link, the post-confirm redirect, and `BREVO_API_KEY` validity. Non-destructive automation can't cover this.
3. **Cal embed lazy-load implementation** (C3) — design the IntersectionObserver/click-to-load and re-measure mobile Lighthouse; this is the highest-ROI engineering change on the site.
4. **Legal pages with a human/lawyer + parent** (C1/C2/I1/I2/I3) — capacity, processor list, and Google-Fonts/Cal transfers need a real legal sign-off, not a code review.
5. **Mobile GPU profile of the plasma shader** — Lighthouse measures CPU, not the per-frame fbm shader cost; a real mid-range Android trace would confirm whether the FPS-cap/off-screen-pause work is needed.

---

*Read-only audit. No source or config files were modified — only `REVIEW-REPORT.md` and `.review-artifacts/` were written. See `git status` below.*
