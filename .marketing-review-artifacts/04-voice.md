# Lane 4 — Tonality & Voice Analysis

**Scope:** Written voice across `index.html`, `pro/index.html`, `public/playbook.html`,
and `docs/brevo-doi-template.html` (the Brevo DOI email). Cross-checked against
`src/config.ts` (Tag-N derivation) and CLAUDE.md editorial conventions.
Read-only. No web/code/markdown source files edited.

---

## 1. Sentence length & rhythm

The dominant pattern is the **clipped fragment** — short, verbless, period-terminated
phrases stacked for cadence. This is consistent across all four files and is the single
strongest signature of the voice.

- `index.html:476` — "Pro-Beratung. 30 Min. Persönlich." (three fragments, 4 words total)
- `index.html:250` — "Echte Arbeit, kein Schmuck." (`hero__pivot-note`)
- `pro/index.html:177` — "Alles aus dem Standard-Programm. Plus persönlich."
- `playbook.html:849` — "Kein eigenes Produkt, kein Lager, kein Risiko."
- `playbook.html:807` — "Schritt für Schritt. Ohne Theorie. Ohne Hype." (`hero-subtitle`)

Full sentences appear mostly in the FAQ and the academy/track pitches, where the
register lengthens to explain (e.g. `index.html:938-944`, the "Was passiert nach dem
Buchen?" answer is ~55 words across coherent sentences). So the rhythm is: **fragments
for punch, full sentences for trust/explanation.** That is a deliberate, recognisable
contrast, not accidental. Typical body sentence is ~8-15 words; headline fragments are
2-5 words.

The DOI email is the outlier — it relaxes into normal prose: `brevo-doi-template.html:157-163`
runs a single ~30-word sentence ("ein Klick und das ... Playbook 2026 ist unterwegs ...
drei Mails mit den Schritten, Stacks und Zahlen"). Appropriate for the medium; email
fragments would read curt.

## 2. Register — casual-direct, "du", lightly profane

Uniformly informal **"du"** address, never "Sie." Direct, second-person, imperative.
This matches a 13-year-old founder talking to a peer audience of beginners and is
internally consistent across bio, pro, playbook and email.

Markers of the casual register:
- Anglicisms woven into German throughout: `index.html:362` "YouTube-Bullshit-Hooks",
  `pro/index.html:249` "Du committest", `playbook.html:940` "Anfänger-friendly",
  `playbook.html:946` "Audience-Build", `index.html:427` "Group-Coaching-Calls".
- Mild profanity used as an anti-hype signal: `index.html:362` "Statt
  YouTube-Bullshit-Hooks", `playbook.html:1050` "ohne Bullshit". Twice is on-brand
  edge; it is not overused.
- Conversational asides: `pro/index.html:306-307` "Wenn du Garantien suchst, geh in
  einen Festanstellungs-Job." — blunt, almost confrontational. This is the boldest
  voice moment and it lands as confident rather than rude.

## 3. German-native quality

Reads as **native, fluent German** — not machine-translated. Idiom, compound nouns and
particle usage are correct ("Spart uns beiden Zeit", "woran hängst du", "mal
reinschnuppern"). A few intentional **neologisms** show authorial voice rather than
error: `index.html:914` "das ungold-igere Branding" (invented comparative) and
`index.html:912` "Schnelle-Sieg" / `pro/index.html:288` "Du suchst Schnelle-Sieg" — the
latter is slightly awkward grammar (a noun phrase used adjectivally) but reads as
stylistic shorthand, not incompetence.

One genuine **inconsistency**, not an error: apostrophe-S anglicism. `playbook.html:1063`
"Mark's persönlicher WhatsApp-Support" and `:1071` "mit Mark" — the English genitive
apostrophe ("Mark's") is non-standard German (should be "Marks"). Minor, but it is the
kind of thing a careful native editor would catch.

## 4. Is the "anti-Hype / ehrlich / Build-in-Public" claim upheld?

**Mostly yes, and impressively so for the genre — with one self-inflicted contradiction
on the playbook page.**

Evidence the claim IS upheld (this is the strength of the writing):
- `index.html:355` — "Kein '5-stelliger Monat in 30 Tagen'." Explicitly names and
  rejects the guru trope. Repeated at `pro/index.html:290`.
- `index.html:369` — "Keine fake Screenshots." Direct anti-hype.
- `index.html:558` — "Ehrlich: wenn ich keinen Fit sehe, sag ich's. Spart Zeit."
  (booking gate honesty line) — anti-sell, rare and credible.
- `index.html:900-916` — an entire FAQ titled "Für wen ist das ausdrücklich nicht?"
  that disqualifies buyers. This is textbook ehrlich/anti-hype and very hard to fake.
- `pro/index.html:303-307` — "Du brauchst Garantie / Mark garantiert dir nichts."
  De-risking by removing the promise rather than adding one.
- `index.html:943` — "Kein Upsell, keine Folge-Pitches." Names the funnel behaviour
  it refuses to do.
- DOI email `brevo-doi-template.html:66-67` preheader — "kein Spam, kein Verkauf,
  einfach das Dokument." On-brand restraint in the email channel too.
- Build-in-Public is structurally real: the "Tag N" eyebrow is derived from
  `getBuildDay()` in `src/config.ts:33` (PROJECT_START_DATE 2026-04-29; today = Tag 32,
  computed), not hardcoded — so the BiP claim is wired to truth, not decoration.

Where the claim is CONTRADICTED:
- **The playbook CTA undercuts the whole anti-hype frame.** `playbook.html:1050`
  "Vom ersten Setup bis zum 4-stelligen Monat" is an income-implication headline — the
  exact category the bio page brags about *not* doing ("Kein '5-stelliger Monat'").
  Bio says no-numbers-promises; playbook dangles "4-stelligen Monat." That is an
  internal voice contradiction between the two surfaces a visitor sees in one session.
- `playbook.html:1091` "Jetzt für 5€ starten" + `:1085` "Ab 5€" — a low-anchor
  price hook on a 583562 Digistore product, which is classic funnel mechanics, not
  the "Substance über Style" posture of the bio (`index.html:860`).
- The hero closer on BOTH bio and pro is `index.html:960-963` / `pro/index.html:370-373`
  "Tag für Tag bauen. Stein für Stein. **Imperium.**" — "Imperium" is a hype/guru
  word (empire-building, Tate/Gadzhi-coded) that sits oddly against the explicitly
  anti-guru body copy and the documented brand pivot *away* from that aesthetic.
  Not fatal, but it is the one headline that still smells of the old gold-cluster voice.

## 5. Forbidden discount-word — CONFIRMED VIOLATION (critical for brand discipline)

CLAUDE.md "Editorial Conventions" lists **"Forbidden words: Sparen, günstig, billig,
Rabatt, Schnäppchen."** A grep of all HTML found one live hit in production copy:

- `public/playbook.html:1086` — **"Günstiger als ein Mittagessen — und du entscheidest
  selbst ob du dabei bleibst."** ("Günstiger" is the comparative of the forbidden
  "günstig.")

(The same string also exists in `reference/playbook_original.html:768`, but that is a
reference archive, not a shipped page — the live violation is the `public/` copy.)
This is the user's own self-authored rule, so flagging it is on-brand for the review,
not pedantry. Easy fix; high signal that the rule is being broken on the one page that
asks for money.

**Hashtags:** none found in any of the four files. Compliant.

## 6. Is there a recognisable "Oskar voice"?

**Yes — there is a genuine, distinctive voice, which is rare for this niche.** It is:
clipped German fragments + selective English jargon + aggressive disqualification of
the reader + named rejection of guru tropes. The "wer das *nicht* ist" framing
(`index.html:900`, `pro/index.html:282`), the "sag ich's" honesty asides
(`index.html:558`), and the editorial-magazine scaffolding ("Edition 01 / 2026",
chapter numbers, "Manifest") combine into something that does **not** read like generic
ChatGPT-marketing or Gadzhi-template copy. The proof: it makes claims *against its own
interest* (telling people not to buy), which template guru copy never does.

The voice wobbles only where money enters: the playbook CTA (`:1050`, `:1091`) and the
"Imperium" closer slip back toward the hype register the rest of the copy earns the
right to reject. Tightening those two spots would make the voice fully coherent.

## 7. Cross-channel check — web voice vs. social aesthetic (NEEDS HUMAN VERIFICATION)

I **cannot see the social captions or the gold-on-black social grid** — TikTok/Instagram/
YouTube/Threads cannot be scraped here, and no caption assets exist in the repo I read.
The only social-facing copy in-repo is the channel-card labels (`index.html:742-803`:
"TikTok / Instagram / YouTube / Threads", "@oskarmarketing", "Zum Profil") and the
`sameAs` JSON-LD (`index.html:60-65`). So this is a structural inference, flagged as
such, **not** a verified finding:

- The *site* voice is explicitly an indigo/anti-gold pivot — `index.html:250` "Vom
  Gold-Cluster ins Indigo-Future", `index.html:914` mentions visitors who "das
  ungold-igere Branding hier hassen … du bist gerade auf Indigo statt Gold." The copy
  itself **admits a tension** between the new editorial voice and the prior gold
  aesthetic.
- If the live social grid is still gold-on-black (per the brief's note), a visitor
  who clicks from a gold TikTok to this off-white/indigo editorial site experiences a
  brand-identity whiplash the copy half-acknowledges but does not resolve.
- **What I could see:** all four social URLs are present and consistently handled as
  `@oskarmarketing`. **What I could not see:** the actual captions, hashtag usage on
  social (the no-hashtag rule applies to captions per CLAUDE.md, and I cannot verify
  compliance off-site), follower counts, or the visual palette of the profiles.
  Human verification required for the on-channel half of the consistency question.

---

## Severity summary
- **important** — Forbidden discount-word "Günstiger" live in `playbook.html:1086`
  (own-rule violation, on the money page).
- **important** — Anti-hype voice contradicted by playbook CTA "Vom ersten Setup bis
  zum 4-stelligen Monat" (`:1050`) + "Jetzt für 5€ starten" (`:1091`) vs. the bio's
  explicit "Kein '5-stelliger Monat'" (`index.html:355`).
- **nice** — "Imperium." closer (`index.html:963`, `pro/index.html:373`) is a residual
  guru-register word against an otherwise anti-guru voice.
- **nice** — "Mark's" English genitive apostrophe, non-standard German
  (`playbook.html:1063`).
- **strength** — Genuinely distinctive, native-fluent, anti-hype "Oskar voice" that
  disqualifies buyers and names guru tropes to reject them; BiP claim wired to a real
  derived day counter, not hardcoded.
- **not-accessible** — Cross-channel match to the gold-on-black social aesthetic:
  needs human verification (captions/profiles not scrapable, none in repo).
