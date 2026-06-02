# Lane 7 — Conversion-Psychology Audit

Scope: funnel trace across `index.html` (bio) → playbook capture form → Brevo DOI mail
(`docs/brevo-doi-template.html`) → `public/playbook.html` (lead magnet) → Pro booking
(cal.eu) / `pro/index.html` (digistore24). Backend skimmed: `worker/src/worker.ts`,
`worker/src/brevo.ts`. Evidence = screenshots in `.marketing-review-artifacts/screenshots/`
+ file:line + short quotes (<15 words). Where I could not observe behaviour I say so.

---

## Funnel map as built (what actually links to what)

1. **Bio hero** (`index.html:256`) primary CTA → `#playbook` ("Playbook lesen"); secondary
   ghost CTA → `#termin` ("Pro-Beratung").
2. **#academy** (`index.html:443`) CTA → `#playbook` again ("Playbook lesen") — it does NOT
   link to `/pro/`. The Pro page is reachable only by direct link (it is `noindex,nofollow`,
   `pro/index.html:10`).
3. **#termin** (`index.html:486`) → 3-question gate → cal.eu embed `opheck-gmx.de/pro-beratung`.
4. **#playbook** (`index.html:663`) → email form → Worker `/subscribe` → Brevo DOI.
5. **DOI mail** → after-confirm redirect to `https://oskarmarketing.de/playbook.html`
   (`brevo-doi-template.html:30`).
6. **playbook.html** bridge → CTA → `checkout-ds24.com/product/583562` at **"Ab 5€"**
   (`playbook.html:1085`, `:1090`).
7. **pro/index.html** → CTA → `digistore24.com/product/583561` at **"ab 997 €"**
   (`pro/index.html:201`, `:204`).

The single biggest structural problem: there are **two different paid endpoints** at two
wildly different prices (5€ product 583562 vs 997€ product 583561), and the visitor reaches
them through different doors with no shared narrative. See CRITICAL-1.

---

## CRITICAL — price/offer contradiction across the funnel (trust risk)

The bio's "Das System" section names the offer **"Mark Janzen Affiliate Academy"**
(`index.html:425`) and routes to the Playbook. The Playbook's terminal CTA sells a **5€**
entry (`playbook.html:1085` "Ab *5€*", button `playbook.html:1091` "Jetzt für 5€ starten")
into digistore product **583562**. Meanwhile `/pro/` sells **"ab 997 €"** (`pro/index.html:201`)
into a *different* product **583561**. That is a 200× price gap between two pages that both
claim to be "das komplette System" / "das System, das ich nutze."

Why this is a conversion + trust risk during a traffic ramp: a visitor who reads
"Ab 5€" on the playbook page and later lands on `/pro/` sees 997€ for what looks like the
same thing (both say WhatsApp-Zugang, Live-Calls, Community — compare `playbook.html:1063`
"Mark's persönlicher WhatsApp-Support" vs `pro/index.html:195` "Direkter 1:1 WhatsApp zu Mark").
The 5€ → 997€ jump is never explained as a tripwire→core ladder. It reads as a bait price.
This is the kind of inconsistency that kills trust precisely when you scale traffic.

**Fix:** make the ladder explicit and consistent. Either (a) state on the playbook page that
5€ is the entry module and Pro (997€) is the full mentoring, with one sentence naming both
tiers, or (b) stop selling two products. Right now the funnel sells two unconnected things.

---

## CRITICAL — editorial-convention breach in the money moment ("Günstiger")

`playbook.html:1086`: the price-box subline uses **"Günstiger als ein Mittagessen"**.
`CLAUDE.md` Editorial Conventions explicitly forbids the word **"günstig"** (and "Sparen,
billig, Rabatt, Schnäppchen"). This is the single most prominent persuasion line on the
terminal CTA of the lead magnet — i.e. the breach is at the exact point of conversion, not
buried. It also undercuts the anti-Hype brand ("Echte Arbeit, kein Schmuck", `index.html:250`):
"cheaper than lunch" is classic low-ticket-impulse framing, the opposite of the positioning.

**Fix:** rewrite without the forbidden word and without price-anchoring on a meal. E.g. lead
with what the 5€ module *contains* and "du entscheidest selbst ob du dabei bleibst" (which is
already there, `playbook.html:1086`) rather than a discount frame.

---

## IMPORTANT — 997€ on /pro/ is anchored but the anchor is weak / one-sided

Good: `/pro/` does NOT present 997€ naked. There is value build-up before the price —
section 01 "Warum Pro" lists three concrete deltas vs the base program
(`pro/index.html:148` "3× pro Woche live", `:157` "4 Monate Begleitung", `:141` direct
WhatsApp), and a Fit-Check that pre-frames the spend (`pro/index.html:273-277`
"997 € sind kein Kleingeld… echte Resultate"). The "ist NICHT für dich" block
(`pro/index.html:282`) is strong take-away-selling. The `pro-desktop-full.png` and
`pro-mobile-full.png` show the price card sitting after the benefit list — correct order.

Weaknesses:
- The comparison anchor is only *internal* ("3× statt 1×", "4 statt 2 Monate"). There is no
  external/relative anchor (cost of one bad month, cost of figuring it out alone, value of the
  85+ videos). 997€ floats against a feature list, not against a stakes number.
- The price label is **"ab 997 €"** (`pro/index.html:201`). "ab" implies it can be higher
  but no higher tier or payment plan is shown — that creates a small open loop / unease at the
  decision point. `pro-mobile-full.png` shows "ab 997 €" right above the only button.
- The disclosure (`pro/index.html:227`) says "Preise variieren leicht je nach Land (MwSt)" —
  fine — but combined with "ab" the visitor cannot know what they will actually pay until they
  leave the site for digistore24. Price opacity = friction.

**Fix:** add one stakes/comparison line near the price ("Eine Mark-Janzen-1:1-Stunde kostet
X" or "vier Monate Begleitung = Y € / Monat"), and either drop "ab" or show the payment-plan
that "ab" implies.

---

## IMPORTANT — trust-signal inventory: almost no proof of a *person*

What a visitor wants at the top of this funnel: "who is this, can I trust him, is this real."
Inventory of trust signals actually present:

- **No founder photo / face anywhere.** The hero avatar is a decorative ring + glow only
  (`index.html:220-224`, comment confirms letterforms were removed) — `home-desktop-fold.png`
  shows an empty ring, no human. For a build-in-public *personal* brand this is a notable
  absence; the whole premise is "follow my build."
- **No testimonials / case studies / social proof** on any page. None in `index.html`,
  `playbook.html`, or `pro/index.html`. For a 997€ offer that is a real gap.
- **No partner/platform logos** (no TikTok/Brevo/Cal/digistore trust marks shown as proof).
- **Numbers exist but are self-reported and partly aspirational.** `#status` shows
  "7.600 Views / Wo" (`index.html:310`, `home-desktop-full.png` renders "7.600"), plus a
  **target** stat "100 Sales bis Q3 2026" (`index.html:328`) clearly labelled "Ziel". Honest,
  but a goal is not proof. The live proof-strip that would carry real metrics is
  `hidden` by default and only shows if a fetch succeeds (`index.html:283`
  "Hidden via JS if the fetch fails — never shows 0s"), so first-time visitors likely see
  zero hard third-party-verifiable numbers. **needs human verification** whether
  `public/data/metrics.json` is populated in production.
- **Honesty framing is the main trust lever** and it is used well: FAQ "Für wen ist das
  ausdrücklich nicht?" (`index.html:900`), booking gate "wenn ich keinen Fit sehe, sag ich's"
  (`index.html:558`), "Kein Upsell, keine Folge-Pitches" (`index.html:943`). This is a genuine
  strength and on-brand. But honesty ≠ proof; it reduces fear, it doesn't yet build credibility.

**Fix (cheap, high-impact):** add a real founder photo + one-line "who/why" near the hero or
in a short About, and the moment any real result exists (first sale, a screenshotted view
count) surface it as proof rather than as a "Ziel". Given the founder is 13, the *build-in-
public honesty* angle is the credibility asset — lean on a dated, real timeline rather than
manufactured social proof.

---

## IMPORTANT — DOI mail promises a nurture sequence that does not exist in-repo

`brevo-doi-template.html:159-163`: "…bekommst in den nächsten Tagen **drei Mails** mit den
Schritten, Stacks und Zahlen…". This is an explicit promise of a 3-email nurture sequence.
The only email asset in the repo is this single DOI confirmation template — there are no
follow-up/nurture email files anywhere (confirmed: `docs/` holds only `brevo-doi-template.html`
plus setup docs). So either the sequence lives only in the Brevo dashboard (**needs human
verification**) or the promise is currently unfulfilled.

Why it matters: the nurture is the bridge between "downloaded free playbook" and "books a
997€ call." With only a one-shot DOI → redirect-to-playbook, the funnel has **no mechanism to
warm a lead toward the paid offer over time.** The reader lands on the playbook, hits a 5€ CTA,
and that's the end of the automated journey. The 997€ Pro page is never emailed to them.

**Fix:** build the promised 3 mails (or change the copy to not promise three). The sequence is
the missing middle of this funnel; minimally one mail should introduce the Pro/booking option.

---

## IMPORTANT — playbook page renders blank without scroll-JS (first-impression risk)

`playbook-desktop-full.png` shows the hero, then a near-empty page — all four step sections
render as blank space. Cause: every content block is `class="reveal"` with
`opacity:0` (`playbook.html:233`) and is only revealed by an IntersectionObserver on scroll
(`playbook.html:1122-1131`). A static full-height capture (and any environment where the
observer doesn't fire — JS disabled, some in-app webviews, prefetch/preview) shows an empty
page. The bio site explicitly warns that **TikTok/Instagram in-app browsers** break JS
(`index.html:71-78`), and TikTok is the stated #1 traffic source (`playbook.html:932`
"Start mit TikTok"). So the most likely inbound visitor is on the highest-risk browser for
this exact failure mode.

**Fix:** make `.reveal` content visible by default and animate as enhancement (e.g. reveal
only when JS is present via a `js`-class on `<html>`, or add a `<noscript>`/no-IO fallback).
Content must never depend on the observer to be readable.

---

## CTA-by-CTA analysis (strength / clarity / friction)

- **Hero primary "Playbook lesen"** (`index.html:257`, `home-mobile-fold.png` "PLAYBOOK LESEN"):
  clear, low-friction, free. Good as the lead entry. Strength.
- **Hero ghost "Pro-Beratung"** (`index.html:266`): jumps to the booking gate. Reasonable
  secondary, but "Pro-Beratung" is ambiguous this early — the visitor doesn't yet know what
  Pro is or that a 997€ product sits behind it. Minor clarity friction.
- **#academy "Playbook lesen"** (`index.html:449`): duplicate of the hero CTA. Fine, keeps one
  primary action, but the section is titled "Das System, das ich nutze" yet the only action is
  to read a free PDF — no path to actually *get* the system here. Mild dead-end feel.
- **Booking gate "Slots freischalten"** (`index.html:548`): the gate is a **3-field required
  form before the calendar even appears** (two radio groups + a required free-text "Was willst
  du in 90 Tagen erreichen?", `index.html:533-539`). This is significant friction placed
  *before* value — the visitor must write a sentence before seeing a single open slot. It's
  defensible as qualification, and the intro "Spart uns beiden Zeit" (`index.html:489`) frames
  it, but for a cold/early funnel it will suppress bookings. The required textarea is the
  heaviest single friction point in the funnel. Consider making the textarea optional.
- **Playbook form "Playbook holen"** (`index.html:697`): single email field + one required
  consent checkbox (`index.html:682`). Low friction, correct. Strength.
- **Playbook terminal "Jetzt für 5€ starten"** (`playbook.html:1091`): clear, but see
  CRITICAL-1/2 (forbidden word + price contradiction).
- **Pro "Pro starten"** (`pro/index.html:212`): clear, correctly `target="_blank"` +
  `rel="noopener noreferrer sponsored"` (`pro/index.html:209`) and discloses the affiliate
  relationship right below (`pro/index.html:225` "Ich erhalte eine Provision"). Compliant and
  honest. Strength.
- **DOI button "Anmeldung bestätigen"** (`brevo-doi-template.html:201`): single clear action,
  plain-text fallback link present (`:224`). Good DOI hygiene.

---

## Friction-point list (concrete)

1. **Required free-text booking-gate question before the calendar** (`index.html:533`) — top
   friction; blocks the highest-intent action behind writing a sentence.
2. **Price opacity / "ab 997 €"** with payment terms only revealed off-site on digistore24
   (`pro/index.html:201`).
3. **Playbook page invisible without scroll-JS** (`playbook.html:233`) — risk on TikTok/IG
   in-app browsers, the primary traffic source.
4. **No path from playbook → Pro.** Playbook only offers the 5€ product; the 997€ Pro page is
   orphaned (direct-link only, `pro/index.html:10`). The funnel's premium offer has no inbound
   route from the lead magnet.
5. **Cal embed is click-to-load** (`index.html:564` "Termin laden") — adds one extra click
   before the calendar; justified for DSGVO/perf but is still a step.
6. **Dead-end after DOI:** redirect lands on playbook (`brevo-doi-template.html:30`); from
   there the only forward motion is the 5€ CTA. No nurture (see above).

---

## Strengths worth keeping

- **Anti-hype, expectation-setting copy** is consistent and genuinely differentiating:
  proof section "Was du hier nicht findest" (`index.html:346`), "Kein '5-stelliger Monat in
  30 Tagen'" (`index.html:355`), Pro's negative-fit block (`pro/index.html:282`).
- **Affiliate compliance is correct** on both paid CTAs: `/pro/` (`pro/index.html:209` +
  visible disclosure `:225`) and playbook (`playbook.html:1090` `rel="sponsored noopener"` +
  disclosure `:1096`). Matches `CLAUDE.md` affiliate rule.
- **DOI-only capture** with explicit Brevo consent (`index.html:682-688`) and a clean DOI
  template — DSGVO posture is solid and the worker enforces consent server-side
  (`worker/src/worker.ts:51` "Datenschutz-Zustimmung fehlt").
- **FAQ does real objection-handling** ("warum nicht direkt bei ihm kaufen", "was nach dem
  Buchen", `index.html:845`, `:928`) — reduces fear at the booking step.

---

## Net read for Oskar

The funnel's *voice* is its strongest asset and is well-executed. The conversion problems are
structural, not tonal: (1) two contradictory price points (5€ vs 997€) for what looks like the
same offer; (2) a forbidden discount word at the money moment; (3) the premium 997€ page has no
inbound route from the lead magnet and the promised 3-mail nurture isn't in the repo, so there's
no engine to move a free lead toward the paid call; (4) almost no third-party proof or a human
face to back a personal brand. Fix the offer ladder and the missing nurture first — those gate
everything downstream.
