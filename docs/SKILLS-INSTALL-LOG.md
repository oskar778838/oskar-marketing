# Skills Install Log — 2026-05-11

## Install-Status

Alle 7 angeforderten Installs erfolgreich, **0 Fehler**. Da mehrere Pakete Sub-Skills enthielten,
sind insgesamt **74 neue Skills** global installiert (`~/.agents/skills/`, symlinked in `~/.claude/skills/`).

| Repo | Erfolgreich? | Sub-Skills |
|---|---|---|
| `pbakaus/impeccable` | ✓ | 1 (impeccable) |
| `nextlevelbuilder/ui-ux-pro-max-skill` | ✓ | 8 (ckm-design-system, ckm-slides, ckm-ui-styling, ckm-design, ckm-brand, ckm-banner-design, ui-ux-pro-max, brandkit) |
| `leonxlnx/taste-skill` | ✓ | 7 (high-end-visual-design, stitch-design-taste, design-taste-frontend, gpt-taste, minimalist-ui, industrial-brutalist-ui, redesign-existing-projects) |
| `heygen-com/hyperframes` | ✓ | ~14 (hyperframes + adapters: gsap, three, css-animations, waapi, animejs, lottie, tailwind, hyperframes-cli, hyperframes-media, hyperframes-registry, website-to-hyperframes, remotion-to-hyperframes, contribute-catalog, full-output-enforcement) |
| `emilkowalski/skill` | ✓ | 1 (emil-design-eng) |
| `coreyhaines31/marketingskills` | ✓ | ~40 (komplette Marketing-Suite — siehe unten) |
| `arvindrk/extract-design-system` | ✓ | 2 (extract-design-system + image-to-code, imagegen-frontend-web, imagegen-frontend-mobile) |

Lock-File: aktualisiert in `c:/Users/Oskar/Desktop/oskar-bio-website/skills-lock.json`.

---

## Vollständige Skill-Liste mit 1-Satz-Beschreibung

### 🎨 Design / UI / Aesthetic (Kerngruppe für Polish)

| Skill | Was es tut |
|---|---|
| `impeccable` | Broad polish/audit/critique skill für Frontend — covers typography, layout, color, motion, micro-interactions, a11y; verlangt PRODUCT.md + DESIGN.md vor dem Arbeiten. |
| `emil-design-eng` | Emil Kowalskis Design-Engineering-Philosophie als Before/After-Review-Tabelle — invisible details, transition-curves, micro-interactions. |
| `high-end-visual-design` | Definiert exakte Fonts/Spacing/Shadows/Card-Strukturen die "expensive" wirken; blockt generische AI-Defaults. |
| `design-taste-frontend` | Senior UI/UX Engineer Skill — metric-based rules, strict component architecture, CSS hardware acceleration. |
| `gpt-taste` | Awwwards-Level GSAP Motion Engineer — AIDA-Struktur, Python-driven layout-randomization, gapless bento, ScrollTrigger pinning. (⚠ erzwingt Satoshi/Cabinet Grotesk Fonts.) |
| `stitch-design-taste` | Generiert agent-friendly DESIGN.md files mit premium anti-generic UI standards (typography, color, asymmetric layouts). |
| `redesign-existing-projects` | Upgraded existierende Sites/Apps zu Premium-Quality — auditet generische AI-Patterns, applied high-end standards ohne zu brechen. |
| `minimalist-ui` | Clean editorial style — warm monochrome, typographic contrast, flat bento grids, muted pastels (KEINE gradients/heavy shadows). |
| `industrial-brutalist-ui` | Raw mechanical Swiss/military terminal aesthetic — rigid grids, extreme type scale, utilitarian color, analog degradation. |
| `ui-ux-pro-max` | Reference-Library: 50+ Styles, 161 Color-Palettes, 57 Font-Pairings, 99 UX-Guidelines. |
| `ckm-design` | Comprehensive Design-Skill — brand identity, design tokens, UI styling, logo gen (55 styles), corporate identity (50 deliverables). |
| `ckm-design-system` | Token-Architektur, Component-Specs, Three-Layer Tokens (primitive→semantic→component), Slide-Generation. |
| `ckm-ui-styling` | Beautiful accessible UIs mit shadcn/ui, Tailwind, canvas-based visuals. |
| `ckm-banner-design` | Banner-Design für Social/Ads/Web-Heroes mit AI-generated visuals (multiple art directions). |
| `ckm-brand` | Brand voice, visual identity, messaging frameworks, asset management, brand consistency. |
| `ckm-slides` | Strategic HTML Presentations mit Chart.js + design tokens + responsive layouts. |
| `extract-design-system` | Extrahiert Design-Primitives aus public website + generiert starter token files. |
| `image-to-code` | Visual web tasks: generiert zuerst Design-Image(s), analysiert tief, implementiert dann passend. |
| `imagegen-frontend-web` | Premium conversion-aware website design references (1 horizontal image pro section). |
| `imagegen-frontend-mobile` | Premium app-native screen concepts/flows für iOS/Android/cross-platform. |
| `brandkit` | Premium brand-kit image generation (brand-guidelines boards, logo systems, identity decks, visual-world presentations). |

### 🎬 Animation / Motion / Video

| Skill | Was es tut |
|---|---|
| `gsap` | GSAP-Reference (gsap.to/from/fromTo, easing, stagger, timelines, performance) — **HyperFrames-spezifisch**. |
| `three` | Three.js/WebGL Adapter-Patterns — deterministische Scenes, AnimationMixer, Camera-Motion, Shader — **HyperFrames-spezifisch**. |
| `css-animations` | CSS-Keyframes Adapter für HyperFrames (animation-delay, fill-mode, play-state, seek-driven motion). |
| `waapi` | Web Animations API Adapter (element.animate(), currentTime seeking) für HyperFrames. |
| `animejs` | Anime.js Adapter für HyperFrames Compositions. |
| `lottie` | Lottie/dotLottie Adapter (lottie-web JSON, .lottie files) für HyperFrames. |
| `hyperframes` | Video-Compositions in HyperFrames HTML — animations, title cards, overlays, captions, voiceovers, scene transitions. |
| `hyperframes-cli` | HyperFrames CLI dev loop (init, lint, inspect, preview, render, doctor, browser, info, upgrade). |
| `hyperframes-media` | Asset-Preprocessing für HyperFrames — TTS (Kokoro), Whisper-Transcription, Background-Removal (u2net). |
| `hyperframes-registry` | Install/Wire registry blocks/components in HyperFrames. |
| `website-to-hyperframes` | Konvertiert eine Website in HyperFrames Video-Composition. |
| `remotion-to-hyperframes` | Portiert Remotion-React-Compositions zu HyperFrames-HTML. |
| `tailwind` | Tailwind CSS v4.2 browser-runtime patterns für HyperFrames Compositions. |
| `contribute-catalog` | Author neue HyperFrames registry blocks/components als upstream PR. |
| `video` | Video-Production via AI tools/programmatische Frameworks (Remotion, HyperFrames). |
| `image` | Marketing-Images: blog heroes, social graphics, product mockups, profile banners, brand assets. |
| `full-output-enforcement` | Override LLM truncation behavior, enforce complete code generation, ban placeholder patterns. |

### 📈 Marketing / CRO / Content

| Skill | Was es tut |
|---|---|
| `page-cro` | Conversions auf Marketing-Pages optimieren (homepage, landing, pricing, features, blog). |
| `form-cro` | Forms optimieren (lead capture, contact, demo, application, survey, checkout — NICHT signup). |
| `popup-cro` | Popups/Modals/Overlays/Slide-Ins/Banners conversion-optimieren. |
| `signup-flow-cro` | Signup/Registration/Account-Creation/Trial-Activation Flows optimieren. |
| `paywall-upgrade-cro` | In-app Paywalls, Upgrade-Screens, Upsell-Modals, Feature-Gates. |
| `onboarding-cro` | Post-signup Onboarding, User-Activation, First-Run-Experience, Time-to-Value. |
| `lead-magnets` | Lead-Magnets für Email-Capture/Lead-Generation (gated content, content upgrades, downloadables). |
| `churn-prevention` | Reduce churn — cancellation flows, save offers, recover failed payments, retention strategies. |
| `referral-program` | Referral/Affiliate/Word-of-Mouth/Ambassador Programme. |
| `copywriting` | Marketing-Copy schreiben (homepage, landing, pricing, feature, about, product). |
| `copy-editing` | Existing copy editieren/reviewen/verbessern, outdated content refreshen. |
| `marketing-psychology` | Psychological principles, mental models, behavioral science auf Marketing applizieren. |
| `marketing-ideas` | Marketing-Ideen, Inspiration, Strategien für SaaS/Software. |
| `content-strategy` | Content-Strategy planen, Topics auswählen. |
| `social-content` | Social-Media Content (LinkedIn, Twitter/X, Instagram, TikTok, Facebook). |
| `email-sequence` | Email-Sequences, Drip-Campaigns, Lifecycle Email-Programme. |
| `cold-email` | B2B Cold Outreach + Follow-Up Sequences. |
| `ad-creative` | Ad-Creative (Headlines, Descriptions, Primary Text, Variations) für Paid-Platforms. |
| `paid-ads` | Paid Ad Campaigns (Google Ads, Meta, LinkedIn, Twitter, etc.). |
| `launch-strategy` | Product Launches, Feature Announcements, Release Strategies (Product Hunt, etc.). |
| `co-marketing` | Co-Marketing Partner finden, Joint Campaigns planen. |
| `community-marketing` | Online Communities aufbauen (Discord, Slack, Forums, Subreddits). |
| `directory-submissions` | Submission zu Startup/SaaS/AI/MCP Directories für Backlinks. |
| `competitor-alternatives` | Competitor Comparison/Alternative Pages für SEO + Sales-Enablement. |
| `competitor-profiling` | Competitors aus URLs analysieren/profilen. |
| `customer-research` | Customer Research, ICP, Interviews, Transcripts analysieren. |
| `product-marketing-context` | Product Marketing Context Document erstellen/updaten. |
| `pricing-strategy` | Pricing Decisions, Packaging, Monetization. |
| `free-tool-strategy` | Free Tools für Lead-Gen/SEO/Brand-Awareness planen. |
| `programmatic-seo` | SEO Pages at scale via templates + data. |
| `seo-audit` | SEO-Audit, technical SEO, on-page SEO. |
| `ai-seo` | AI Search Engine Optimization (AEO, GEO, LLMO). |
| `aso-audit` | App Store / Google Play Listing Optimization. |
| `schema-markup` | Schema Markup / Structured Data / JSON-LD / Rich Snippets. |
| `analytics-tracking` | Analytics Tracking Setup (GA4, Conversion-Tracking, Event-Tracking). |
| `ab-test-setup` | A/B Tests planen/designen/implementieren. |
| `sales-enablement` | Sales Collateral, Pitch Decks, One-Pagers, Demo Scripts. |
| `revops` | Revenue Operations, Lead Lifecycle, Marketing-to-Sales Handoff. |
| `site-architecture` | Page Hierarchy, Navigation, URL Structure, Internal Linking, Sitemaps. |

### 🔧 Misc / Helper

| Skill | Was es tut |
|---|---|
| `find-skills` | Skill-Discovery-Helper (bereits installiert vorher). |
| `frontend-design` | Anti-AI-slop Frontend-Design-Playbook (bereits installiert vorher). |
