# Fix-Workflow-Report — 2026-05-30

Autonomous implementation of the fixable findings from `REVIEW-REPORT.md`, on
branch **`fix/ultra-review-autonomous`** (7 commits, **not pushed**). Human-
required items (legal text, real DOI send, major dep bumps) were skipped and
turned into parent-conversation templates instead. Every phase passed a build
gate; the final working tree is clean.

## Abgearbeitet

| Phase | Findings | Commit | Build / Verify |
|---|---|---|---|
| 0 | Branch + baseline | `7705c18` | build exit 0 |
| 1 | I4, I5, I10, I12, I13 | `3fe6950` | build 0; contrast math verified; OG PNG rendered |
| 2 | I6, I7, I8 | `d4e245a` | frontend 0 + worker `tsc` 0; wrangler parsed config |
| 3a | **C3**, I3 | `e5d12bf` | build 0; Playwright: 0 Cal requests on load |
| 3b | I2 | `5b3ac79` | build 0; Playwright: 0 Google requests, local woff2 |
| 4 | I15 | `0f3ba76` | build 0; before/after screenshots, layout intact |
| 6 | Templates (for C1/C2/I1) | `6db4238` | docs |

**Net diff:** 56 files, +965 / −1233 (mostly dead-code removal; +28 self-hosted woff2).

### What each fix did
- **I5** — `oskarmarketing.bio` → `.de` in impressum + datenschutz (3 refs).
- **I10** — removed dead `three-stdlib` dependency (never bundled; build unchanged).
- **I12** — `--muted` 4.06:1 → 5.8:1, `--muted-low` 2.14:1 → 4.65:1 (solid, AA); `.playbook__privacy` legal text → `--color-ink-muted` (7.64:1).
- **I13** — playbook footer back-link 1.55:1 → `var(--accent)` 4.74:1 (hover via color+underline, not opacity).
- **I4** — real `og-image.png` (1200×630, brand fonts) via `scripts/gen-og-image.mjs`; absolute `https://…/og-image.png` in og + twitter tags on index + playbook.
- **I6/I7/I8** — deleted the pre-Cal.eu booking stack (`booking.ts` 462 LOC, worker `POST /` + `GET /booked-slots`, `notify.ts` Resend/Twilio, the PII email log); trimmed `validate.ts`/`types.ts`/`wrangler.toml`. Worker name kept (live `*.workers.dev` URL unchanged). `/subscribe` handler is byte-identical to before.
- **C3/I3** — `src/lib/calEmbed.ts` defers the Cal embed behind a "Termin laden" click-to-load button on index + /pro/.
- **I2** — self-hosted Cormorant Garamond + DM Sans + JetBrains Mono (`scripts/fetch-fonts.mjs` → `public/fonts/` + `public/fonts.css`); removed every Google Fonts `<link>`; corrected the Datenschutz §7 disclosure.
- **I15** — playbook migrated off Fraunces → Cormorant Garamond and off the forked `--orange*` tokens → `--accent*`; bumped local `--text-muted` to AA.

### Opportunistic extras (low-risk, in the spirit of the review)
- `.review-artifacts/` + `scripts/diagnose-output.json` gitignored (Lane-10 backlog item) — clean tree.
- **The entire `dist/` is now Google-Fonts-free** (not just the listed pages).
- playbook footer-copy contrast (~4.2:1 → AA) via the `--text-muted` bump.

## Skipped (with reason)

| Finding | Reason |
|---|---|
| **C1** | Impressum content — needs real name/address → `IMPRESSUM-FILL-TEMPLATE.md` (parents). |
| **C2** | Minor operator / Verantwortlicher — needs an adult named → `DATENSCHUTZ-VERANTWORTLICHER-TEMPLATE.md`. |
| **I1** | Datenschutz Verantwortlicher text — follows the parent update. *Code half is done:* Resend/Twilio removed, Google-Fonts disclosure corrected, so the policy now only needs the human edits in the template. |
| **I9** | Rate-limit — **deferred**: (a) its gate ("local brute-test → 429") is unrunnable — `wrangler dev`/workerd fails with `write EOF` in this sandbox; (b) the worst vector (unauth `POST /` firing **paid** Resend email + Twilio SMS) was already removed in Phase 2; (c) a real fix needs a provisioned KV namespace or Turnstile (deploy-time infra). See "next steps" for the spec. |
| **I11** | Major dep bumps (vite 5→8, wrangler 3→4, TS 5→6) — explicitly out of scope; high break risk; separate session. |
| **I14** | Full DOI happy-path — needs a real email send + Brevo dashboard check; not autonomously verifiable. |

**Not touched (review backlog, out of this run's defined phases):** I16 (glass-system consolidation), the WebGL-plasma perf tuning, repo hygiene (553 KB `logo-original.png`, 2 stale merged branches, ~26 stale `docs/` reports, README drift), JSON-LD `url`/`image`, pro self-canonical. All remain documented in `REVIEW-REPORT.md`.

## Lighthouse — before / after (mobile)

| Route | Metric | Before (live) | After (local preview) |
|---|---|---|---|
| `/` | total transfer | 2003 kB | **372 kB (−81%)** |
| `/` | LCP | 3186 ms | **1786 ms (−44%, now <2s)** |
| `/` | Cal requests on load | 82 (1648 kB) | **0** ✅ |
| `/` | CLS | 0.00 | 0.01 |
| `/` | perf score | 59 | 59 ⚠️ (see note) |
| `/pro/` | total transfer | 1986 kB | **360 kB (−82%)** |
| `/pro/` | LCP | 1749 ms | 1761 ms |

> ⚠️ **Honest caveat on the perf *score*.** The score stayed ~59 on the local
> preview because TBT reads a degenerate ~198,000 ms — a known Lighthouse
> artifact: the WebGL plasma's continuous `requestAnimationFrame` loop never
> lets the main thread idle, and on localhost (no network latency + 4× CPU
> throttle) that inflates TBT pathologically. It is **not** the embed. The
> stated "≥80" target could not be validated in this environment, but the
> decisive, environment-independent wins are real and verified (Playwright):
> weight −81%, LCP −44%, **0 Cal requests on load**. The remaining perf lever
> is now the plasma render loop (review Lane-3 *nice-to-have*), not Cal. The
> true test is a **live Lighthouse run after deploy** (see next steps).

Raw reports: `.review-artifacts/lh/*.json`; verification scripts + screenshots in `.review-artifacts/` (gitignored).

## Token-Verbrauch & Wall-Clock

- This was a single-loop session (no sub-agents) — exact token count isn't directly visible here; rough order ~0.4–0.6 M output tokens across the phases. **Well under the 4-hour wall-clock budget** (no phase hit the 2× time-box trip-wire).
- Phase shape: P1 quick wins → P2 dead-code → P3 the two big levers (Cal + fonts, the longest) → P4 brand → P5 deferred → P6 templates → P7 this report.

## Branch & Commits

`fix/ultra-review-autonomous`, 7 commits, **not pushed**. Frontend `tsc --noEmit && vite build` exit 0; worker `tsc --noEmit` exit 0; working tree clean. Merge after review with:

```
git checkout main && git merge fix/ultra-review-autonomous
```

## Empfohlene nächste Schritte

1. **Eltern-Gespräch** mit den 3 Templates (`ELTERNGESPRAECH-CHECKLISTE.md` als Einstieg) → C1, C2, I1.
2. **Impressum + Datenschutz** mit den bestätigten Daten ausfüllen (Entwickler, ~10 Min).
3. **DOI-Happy-Path** einmal manuell testen (I14): echte Anmeldung → Bestätigungsmail → Link → `/playbook.html`; `BREVO_API_KEY`-Secret am deployten Worker prüfen.
4. Wenn 1–3 durch → **push → merge → live**.
5. **Post-deploy: Live-Lighthouse mobile auf `/`** erneut messen — bestätigt den Cal-Win realistisch (ohne den localhost-Artefakt). Erwartung: deutlich über 59.
6. **Perf-Folgelauf (der jetzige Engpass):** WebGL-Plasma in `src/hero/background.ts` pausieren, wenn der Hero aus dem Viewport scrollt (IntersectionObserver, analog zum `document.hidden`-Guard) und/oder FPS cappen / auf Touch reduzieren. Das ist der verbleibende TBT-Treiber.
7. **I9 Rate-Limit** (wenn gewünscht): Cloudflare **Turnstile** vor `#playbook-form` (einfachster Weg), oder per-IP-KV-Throttle — KV-Namespace anlegen (`wrangler kv namespace create RATE_LIMIT`), Binding in `wrangler.toml`, in `handleSubscribe` zählen (max 5 / 10 Min → 429 + `Retry-After`). Lokal testbar, sobald `wrangler dev` im jeweiligen Umfeld läuft.
8. **Backlog** aus `REVIEW-REPORT.md`: I11 (Dep-Major-Bumps, eigene Session), I16 (Glass-System), Repo-Hygiene, JSON-LD.
