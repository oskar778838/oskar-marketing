# Lane 3 — Instagram Presence Audit

**Subject:** https://www.instagram.com/oskarmarketing (handle @oskarmarketing)
**Sibling channel noted:** Threads @oskarmarketing (https://www.threads.net/@oskarmarketing)
**Date of audit:** 2026-05-30
**Verdict:** PARTIAL — the live Instagram profile could not be inspected (anti-scraping block). All profile-content judgments below are explicitly marked "needs human verification." What I *could* verify is how the website links out to Instagram, and that is where the concrete findings sit.

---

## HONESTY MODE — what I could and could not see

**Could NOT see (blocked):**
- I attempted a direct fetch of `https://www.instagram.com/oskarmarketing` and `https://www.instagram.com/oskarmarketing/`. Both returned **HTTP 429 Too Many Requests** (Instagram aggressively blocks logged-out / automated requests). The response body was never delivered — I saw zero profile bytes.
- Google/web search for the exact handle (`"oskarmarketing Instagram"`, `site:instagram.com oskarmarketing`) returned **only unrelated accounts** — e.g. `oskarmarketing.com` (a separate agency), `@oskarg`, `@oskny`, `@osk_market`, `@osumaremarketingsolutions`. **No index entry for @oskarmarketing surfaced at all.**

**Therefore, the following are NOT verifiable by me and need human verification (open Instagram while logged in):**
- Profile photo / display name / whether the bio matches the site's "Indigo-Watercolor, anti-Hype" brand.
- Follower count, post count, engagement. (I have invented **no** numbers.)
- Grid first-impression: visual consistency, indigo (#5B5BD6) palette adherence, Cormorant/JetBrains-Mono usage in graphics.
- Whether **Story Highlights** exist and how they're labelled.
- The **bio-link strategy** as it currently appears *on Instagram* (Linktree vs direct to oskarmarketing.de) — this is the single most important unknown; see Finding I-3.
- **Reels-vs-static mix** and posting cadence.

**Specific reason it's blocked:** Instagram serves a login/consent wall + rate-limits logged-out automated clients (HTTP 429). This is the same limitation flagged for the TikTok lane; it is a platform behavior, not a site problem.

> The absence of any search-engine index entry for @oskarmarketing is itself a weak signal that the profile may be new, set to private, or very low-volume — but I cannot confirm which, and a non-indexed profile can still be perfectly healthy. Treat as "needs human verification," not as a finding.

---

## What IS verifiable — how the site treats Instagram

The codebase is the authoritative source here. Findings are evidenced by file:line.

### Finding I-1 (strength) — Instagram is linked direct, not via Linktree
The website's outbound links go **straight to the Instagram profile**, never to an intermediary like Linktree. Evidence:
- `index.html:611` DM button → `https://www.instagram.com/oskarmarketing`
- `index.html:753` social-matrix card → `https://www.instagram.com/oskarmarketing`
- `index.html:62` JSON-LD `sameAs` → `"https://www.instagram.com/oskarmarketing"`

This is the correct direction for a vitrine site (site → social is fine via direct link). The *reverse* direction (Instagram bio-link → site) is the part I cannot see and is the real lever — see I-3.

### Finding I-2 (strength) — handle is consistent across all four channels
Every channel uses the identical handle `@oskarmarketing`: TikTok (`index.html:733`), Instagram (`index.html:753`), YouTube (`index.html:773`), Threads (`index.html:793`). The social-matrix cards render the handle as on-screen text (`social-card__handle`, e.g. `index.html:763`). Consistent handle = easy cross-platform discovery. No fix needed.

### Finding I-3 (important) — the Instagram→site bio-link is unverified, and the site offers no UTM-tagged target for it
The team's own ops docs assume a UTM'd bio link exists: `agents/AGENT-TEAM-MASTER.md:197` specifies `?utm_source=instagram&utm_medium=bio&utm_campaign=organic`, and `docs/MORNING-STEPS.md:50` is a daily step "Instagram-App → Profil bearbeiten → Website". But I cannot confirm the live bio link actually points to `oskarmarketing.de` (vs a Linktree, a dead link, or nothing). **For a traffic ramp-up this is the #1 conversion path and it is currently a black box.** 
*Concrete fix:* (a) Human verifies the live IG bio link resolves to `https://oskarmarketing.de/?utm_source=instagram&utm_medium=bio&utm_campaign=organic` exactly. (b) Decide direct-vs-Linktree intentionally — for a single-destination vitrine, a **direct** UTM'd link beats Linktree (one less hop, no third-party cookie/DSGVO surface, consistent with the site's self-hosted-everything stance per CLAUDE.md). If multiple destinations are ever needed, the in-house `/playbook.html` already functions as a hub, so Linktree is still avoidable.

### Finding I-4 (important) — Instagram is positioned as a *secondary/backup* channel; expectations should match
Project docs are explicit that Instagram is **not** the primary growth engine: `PRODUCT.md:24` "TikTok primär, Instagram/YouTube/Threads sekundär"; the playbook teaches `playbook.html:961` "Crossposting zu Instagram Reels" as bonus reach; `MASTER-BLUEPRINT.md:318` even labels Instagram "Instagram Backup". This is a **sound** strategy for a solo 13-year-old founder (concentrate on the one platform that pushes 0-follower accounts — TikTok). The risk during a traffic ramp-up: a half-populated, crossposted-only IG grid can read as low-effort to anyone who clicks `index.html:753` from the site. 
*Concrete fix:* before driving site traffic to the IG card, ensure the grid has a minimum baseline (the human should confirm there are enough posts + a brand-consistent first row). If the grid is thin, consider temporarily de-emphasizing the Instagram social-card (it currently has equal visual weight to TikTok's `social-card--primary` only by virtue of TikTok carrying the `--primary` modifier — IG is already correctly secondary at `index.html:754`). No code change required unless the grid is embarrassing.

### Finding I-5 (nice) — DM-as-CTA is wired to Instagram; make sure the account can receive DMs
`index.html:609-624` exposes an "Instagram DM" button ("Lieber per Chat? Schreib mir auf", `index.html:606`) pointing at the profile root. Instagram does not deep-link to a DM compose for logged-out users, so this lands on the profile, which is acceptable. 
*Concrete fix (verify):* confirm the IG account has DMs open to non-followers and that a 13-year-old founder's parental-safety setup (per the minor-founder context) permits inbound DMs from strangers — this is a safeguarding check, not just a marketing one.

---

## Threads (@oskarmarketing) — noted, same blocker
Threads shares Instagram's infrastructure and the same logged-out wall; I did not fetch it (would 429 identically). The site links it at `index.html:793` with the consistent handle. Threads is listed as the lowest-priority card (`social-card--small`, `index.html:794`), which matches `PRODUCT.md:24`. No further verifiable finding. Engagement/cadence = needs human verification.

---

## Summary of evidence sources
- HTTP 429 on two direct Instagram fetches (logged-out block).
- Web/Google search: no index entry for @oskarmarketing; only unrelated lookalike accounts returned.
- `index.html:62, 64, 611, 753, 793` — outbound link/handle evidence.
- `pro/index.html:12, 204, 209, 224-228` — confirmed the Pro offer is Mark Janzen's Digistore24 affiliate product (`aff=Bestproducts99978`), with `rel="...sponsored"` + visible disclosure (relevant context, not an IG finding).
- `agents/AGENT-TEAM-MASTER.md:197`, `docs/MORNING-STEPS.md:50` — intended IG bio-link UTM scheme.
- `PRODUCT.md:24`, `MASTER-BLUEPRINT.md:318`, `playbook.html:961` — Instagram = secondary/backup positioning.
