# Lane 02 — TikTok Presence Audit (@oskarmarketing)

**Status: PARTIAL — the TikTok channel itself is NOT machine-accessible. Most of this lane needs human verification.**

This audit was performed by an automated agent without a logged-in browser. TikTok
serves an empty JS shell to non-interactive fetchers, and the public stat aggregators
either blocked the request or returned no record. Everything below is split into
(A) what I could verify and (B) what a human (Oskar / parent) must check by opening the
TikTok app.

---

## A. What I attempted, and the exact walls I hit

| Method | Target | Result |
|---|---|---|
| WebFetch profile | `https://www.tiktok.com/@oskarmarketing` | Returned only the page chrome — literally `"TikTok - Make Your Day"`. No bio, no name, no counts, no videos. TikTok renders the profile client-side; a server fetch sees nothing. |
| Google search | `oskarmarketing tiktok` | Zero results for `@oskarmarketing`. Top TikTok hit was an unrelated handle `@oskarmt1`; the rest were generic "TikTok marketing guide" articles. |
| Google search | `"@oskarmarketing" tiktok oskar marketing` | Still no match. Surfaced unrelated `@oskar..o`, `@_oskarmedk`, `@iam.oskar`, and a Polish channel "Oskar z Marketingu". |
| Google search | `oskarmarketing.de TikTok Oskar 13 marketing affiliate` | No match for the German handle/domain. |
| SocialBlade | `socialblade.com/tiktok/user/oskarmarketing` | **HTTP 403 Forbidden** — blocked the automated fetch entirely. |
| Exolyt | `exolyt.com/user/oskarmarketing` | 308 redirect → `app.exolyt.com/user/oskarmarketing` → **HTTP 404**. No public record resolved. |

**Honest conclusion:** I could NOT read the bio, follower count, following count, total
likes, video count, posting cadence, hook quality, video format (talking-head /
slide-reveal / screen-rec), or any engagement number. I will not invent any of these.

The fact that organic Google search returns no `@oskarmarketing` result is **not proof
the account is empty or doesn't exist** — small/new TikTok accounts are routinely
un-indexed by Google. It is, however, a soft signal that the account currently has a
near-zero external/search footprint. Needs human verification.

---

## B. Verified on-site evidence (the TikTok-adjacent funnel)

The TikTok bio link is the entry point of the whole funnel, so I verified what a TikTok
visitor actually lands on and what the site itself claims about TikTok.

### B1. The site links to @oskarmarketing in 3 places (consistent)
- `index.html:61` — JSON-LD `sameAs`: `https://www.tiktok.com/@oskarmarketing`
- `index.html:627` — TikTok DM button under the booking block
- `index.html:733` — primary social card, label `"@oskarmarketing"`, CTA `"Zum Profil"`

Handle is consistent across the site. Good. (Verification that the handle actually
resolves to Oskar's account = human check.)

### B2. Self-reported TikTok metrics are hardcoded in the repo — and slightly stale
`public/data/metrics.json` (file says `"updated": "2026-05-17"`):
- `"label": "TikTok Views (60 Tage)", "value": 28000`
- `"label": "Profile Views (60 Tage)", "value": 185`
- `"label": "Hardcoded Lügen", "value": 0`

Two issues, both evidenced:
1. **I cannot confirm these numbers against TikTok** (wall above). They are author-entered,
   not pulled live. If they appear on the public bio page, they are a trust surface.
2. **28,000 views → 185 profile views** is a ~0.66% view-to-profile rate. That is a weak
   top-of-funnel-to-profile conversion and the single most actionable on-platform metric
   to improve (the hook/CTA isn't pushing viewers to the profile). This is the strongest
   evidence-based lever I can offer without seeing the videos.
3. Minor integrity nit: the file ships a metric literally labelled `"Hardcoded Lügen": 0`
   (hardcoded lies) in a file that is 100% hardcoded values. The label is a cute
   anti-hype flex, but if a sharp visitor notices the numbers can't be independently
   verified, the "0 lies" claim becomes a liability rather than a proof point.

### B3. What a TikTok visitor reads in the first 5 seconds (offer clarity)
The TikTok bio link points at the homepage hero, not the TikTok bio (which I can't read).
Hero copy, verified at `index.html:233-251`:
- Eyebrow: `"— TAG · / BRAND PIVOTED —"` (Tag N injected via JS)
- H1: `"Oskar Marketing"`
- Sub: `"Affiliate-Marketing das nicht aussieht wie Affiliate-Marketing."`
- Note: `"Vom Gold-Cluster ins Indigo-Future. Echte Arbeit, kein Schmuck."`

5-second-offer test: **partial pass.** A cold TikTok viewer learns the *category*
(affiliate marketing, anti-hype) but not the *offer* — there's no "I help you do X"
or "free playbook to start affiliate marketing." `"Vom Gold-Cluster ins Indigo-Future"`
is insider language referencing the brand's own pivot history; it means nothing to a
first-time TikTok visitor and burns part of the 5-second window. The two CTAs
(`index.html:256-268`) — `"Playbook lesen"` and `"Pro-Beratung"` — are clearer than the
headline. **Whatever the actual TikTok bio text says still needs human verification**, but
the destination's headline could carry the offer more directly for a cold swipe-in.

### B4. The "Pro" CTA from TikTok ultimately routes to a competitor's affiliate product
Relevant because TikTok bio → site → "Pro-Beratung" is a real path.
- `pro/index.html:12` — `<title>Mark Janzen Pro Mentoring</title>`
- `pro/index.html:204` — `href="https://www.digistore24.com/product/583561?aff=Bestproducts99978"`

The 997-EUR "Pro" tier is **Mark Janzen's product via an affiliate link**, not Oskar's
own consulting. For a TikTok traffic ramp this matters: per the project's own editorial
rule (CLAUDE.md — affiliate links need `rel="sponsored noopener"` + visible disclosure),
any TikTok caption/bio that drives to this offer must disclose the affiliate relationship.
TikTok also has its own branded-content/affiliate disclosure rules. **Whether the TikTok
posts disclose this = human verification.** This is flagged for Lane(s) covering the
/pro/ page; here it's noted only as the TikTok→offer trust risk.

---

## C. Concrete, evidence-backed next steps (no platitudes)
1. **Improve view→profile rate.** The 0.66% (28k views → 185 profile views, B2) is the
   one on-platform number we have. End videos with an explicit "profile in bio" CTA and
   A/B the first-frame hook. Re-measure in TikTok Analytics.
2. **Make the bio offer literal.** Whatever the bio currently says (unverified), the
   landing hero (B3) leads with brand-history poetry, not an offer. A cold TikTok viewer
   should see "Free affiliate-marketing playbook →" within the first line.
3. **Decide how TikTok metrics are sourced.** If `28000 / 185` appear on the public page,
   either pull them from TikTok Analytics on a cadence or drop the exact figures — a
   page that brags `"Hardcoded Lügen: 0"` while showing unverifiable hardcoded numbers
   undercuts its own anti-hype positioning.
4. **Affiliate disclosure on TikTok.** Any TikTok content pushing the /pro/ offer must
   disclose that it's Mark Janzen's affiliate product (B4) — both for the project's own
   rules and TikTok policy.

## D. For the human reviewer — checklist to fill the gaps I could not
Open the TikTok app → @oskarmarketing and record:
- [ ] Bio text (verbatim) + does the link work and point to oskarmarketing.de?
- [ ] Follower / following / total-likes counts
- [ ] Number of posts + posting cadence (posts/week, last 30 days)
- [ ] Dominant format: slide-reveal vs talking-head vs screen-rec
- [ ] Hook quality of the 3 most recent posts (does the first 1s state a benefit?)
- [ ] Median views / likes / comments on the last ~10 posts
- [ ] Do any posts driving to /pro/ carry an affiliate disclosure?
