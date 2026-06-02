# Lane 09 — Pivot-Coherence Check

**Audited:** `index.html`, `pro/index.html`, `public/playbook.html`, `public/impressum.html`, `src/config.ts`, plus desktop folds for home and pro. Build day on 2026-05-30 derives to **Tag 32** (`PROJECT_START_DATE = "2026-04-29"`, `src/config.ts:31` → floor((May 30 − Apr 29)/86400000)+1 = 32).

**Verdict:** The site reads as **authentic "finding my path"** at the surface — the brand voice is consistent (anti-Hype, indigo, "Echte Arbeit, kein Schmuck", `index.html:250`) — BUT there is one genuine identity confusion the visitor *can* trip over, and it is the exact thing this lane exists to catch: **the offer Oskar presents as his consulting ("Pro-Beratung") is structurally tangled with Mark Janzen's affiliate product ("Pro Mentoring"), and they share the same booking funnel.** That is a trust risk, not a vibe problem. Webdesign-for-Handwerker is invisible on the site, so it is not currently a coherence problem — it is simply absent.

---

## 1. The three identities, as the site actually presents them (verified)

**(a) Affiliate marketer FOR Mark Janzen — DOMINANT and explicit.**
- JSON-LD self-description: `"Affiliate Marketing Creator — Mark Janzen Academy"` (`index.html:59`).
- Homepage's only "system" track is literally named **"Mark Janzen Affiliate Academy"** (`index.html:425`).
- FAQ openly frames the role: he "übersetzt sein System" — same method, different tone (`index.html:856-860`).
- Impressum confirms the commercial relationship: links to "Mark Janzen Affiliate Academy via Digistore24", "erhalte ich eine Provision" (`impressum.html:194-196`).
- This is honest and well-disclosed. Good.

**(b) "Pro" mentor at 997 € — NOT Oskar's own offer. CONFIRMED affiliate.**
- `pro/index.html` title renders **"Mark Janzen Pro Mentoring"** (`pro/index.html:12`, H1 at `:92-93`).
- The 997 € CTA links to `digistore24.com/product/583561?aff=Bestproducts99978` (`pro/index.html:204`) with `rel="...sponsored"` (`:209`) and the disclosure "Ich erhalte eine Provision wenn du startest" (`pro/index.html:226`).
- The page even says **"Mark garantiert dir nichts"** (`pro/index.html:306`) and "direkter WhatsApp-Zugang zu **Mark**" (`:15`, `:195`) — so the 997 € product is unambiguously *Mark's*, sold by Oskar as affiliate. **This confirms the lane hypothesis: the "Pro" offer is Mark Janzen's affiliate product, not Oskar's own consulting.**

**(c) Webdesigner for local Handwerker — ABSENT from the public site.**
- Grep across all `*.html` for `webdesign|webseite|website|handwerk|lokal/local` returns **zero** customer-facing mentions. It appears only in internal planning docs (`MASTER-BLUEPRINT.md`, `agents/`), never in `index.html`, `pro/`, or `playbook.html`.
- So this identity does not yet create on-site contradiction — but it confirms Oskar is *internally* juggling a third direction.

---

## 2. The real contradiction: "Pro-Beratung" (Oskar's) vs "Pro Mentoring" (Mark's) collapse into one funnel

This is the heart of the lane. The homepage sells a **personal 30-minute consult by Oskar**, and the /pro/ page sells **Mark's 997 € product** — and the two are wired to the **same calendar and overlapping wording**, so a visitor cannot tell whose offer is whose.

- Homepage hero CTA: **"Pro-Beratung"** (`index.html:266`). The Termin section: "Pro-Beratung. 30 Min. Persönlich." (`index.html:476`) and an honest gate "wenn ich keinen Fit sehe, sag ich's" (`:558`) — clearly **Oskar's own** consult.
- The /pro/ page is titled **"Pro Mentoring"** and is **Mark's 997 € product** (above).
- Both book the **identical Cal link** `opheck-gmx.de/pro-beratung` (`index.html:571` and `pro/index.html:341`). So "Pro-Beratung" (Oskar, free chat) and "Pro Mentoring" (Mark, 997 €) resolve to the *same booking slug*. A visitor who clicked "Pro-Beratung" on the homepage and a visitor sent to the 997 € /pro/ page land on the same calendar with no disambiguation.
- The FAQ tries to patch this — "Pro-Beratung = ich schaue mir deine konkrete Situation an, 30 Min, persönlich" (`index.html:884-887`) — but it never mentions that there is *also* a separately-named "Pro **Mentoring**" 997 € product. The two "Pro" things are never reconciled in one place.

**Why this matters for a traffic ramp-up:** when traffic increases, more cold visitors will hit the word "Pro" in two meanings (free Oskar consult vs paid Mark product) within two clicks. The near-identical naming ("Pro-Beratung" / "Pro Mentoring") plus the shared calendar reads as "doesn't fully know what he sells here," and at worst looks like a bait-funnel (book a free chat → routed to a 997 € affiliate product). The honest disclaimers exist, but the *naming architecture* undercuts them.

---

## 3. Two concrete copy defects found while tracing the funnel (report up-lane, but evidence here)

These are not strictly identity, but they directly damage the "honest, real-numbers" identity that the whole brand rests on:

- **Forbidden word + price contradiction in the playbook bridge.** `playbook.html:1085-1086` advertises the Academy entry as **"Ab 5€"** with the line **"Günstiger als ein Mittagessen"**. "Günstiger" is on the project's forbidden-words list (CLAUDE.md editorial conventions). Worse, this **5 €** entry (`checkout-ds24.com/product/583562`, `:1090`) contradicts the /pro/ page's **997 €** for what a casual reader will think is "the Mark Janzen system." Same brand, two wildly different prices for "the system," no explanation of the ladder (5 € starter vs 997 € Pro). That looks incoherent.
- The playbook benefit copy "fast jeden Tag" live calls with Mark (`playbook.html:1071`) vs the /pro/ page's precise "3× pro Woche" (`pro/index.html:148`) — minor, but inconsistent claims about the *same* product erode the "echte Zahlen" promise.

---

## 4. Authentic vs indecisive — the honest call

**On the public site alone:** 75% authentic. The voice, palette, and "build in public" framing are coherent and genuinely likeable for a 13-year-old founder. The affiliate role is disclosed better than most adult marketers manage (`impressum.html:194`, `pro/index.html:226`, `playbook.html:1096`). It does **not** read as "doesn't know what he sells" on first scroll.

**The crack** is the "Pro" naming collision (Section 2) and the 5 € vs 997 € ladder with no map (Section 3). Those are fixable with renaming + one clarifying sentence — they are not a deep strategic confusion, just an information-architecture smudge on an otherwise consistent story.

The webdesign idea is a *future* fork that is correctly kept off the public site. Keep it off until/unless it becomes the primary.

---

## 5. Recommendation — ONE primary identity for the next 60 days

**Commit to: "I'm publicly learning + teaching affiliate marketing, and I recommend Mark Janzen's program as the paid path."** i.e. **build-in-public creator whose monetisation is the Mark Janzen affiliate.** This is what the site already is and does best; lean in rather than diversify.

Demote the other two cleanly:
1. **Demote "Pro" (the 997 € Mark product)** from a co-equal "offer" to a clearly-labelled *affiliate recommendation*. Concrete fix: **rename the homepage "Pro-Beratung" CTA** (`index.html:266`, `:476`) to something that cannot be confused with Mark's product, e.g. "Kostenloses Kennenlern-Gespräch" or "30-Min Strategie-Call (gratis)". Reserve the word "Pro" exclusively for Mark's `pro/` page. Add one line in the FAQ "Pro-Beratung" answer (`index.html:884`) stating plainly: the free call is *with Oskar*; the paid "Pro Mentoring" is *Mark's program, I'm an affiliate*. This kills the collision without removing either offer.
2. **Sort the price ladder.** Either drop the "Ab 5€ / Günstiger als ein Mittagessen" framing (`playbook.html:1085-1086`) — it also breaks the forbidden-word rule — or show the ladder explicitly (5 € starter → 997 € Pro) so the two prices stop looking like a contradiction.
3. **Keep webdesign-for-Handwerker entirely off the public site for these 60 days.** It currently lives only in internal docs; that is the right place. Revisit only after the affiliate identity has a measurable funnel.

**One-sentence positioning to commit to:** "Oskar baut in public ein Affiliate-Business — du kannst kostenlos lernen (Playbook), dich mit ihm austauschen (Gespräch), oder direkt Marks System starten (Affiliate-Empfehlung)." Three tiers, one identity, no naming collision.
