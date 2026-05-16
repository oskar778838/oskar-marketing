# Master Project Blueprint — Affiliate Marketing Funnel Setup

Vollständiger Build-Prompt für neue Affiliate-Accounts. Pase als Master-Prompt in Claude Code (Web oder Terminal) für jedes neue Projekt. Variablen am Anfang anpassen, dann ausführen.

---

## Wie du diesen Blueprint nutzt

1. **Neues Projekt-Repo erstellen** (lokal oder auf GitHub)
2. **Diesen ganzen Blueprint** in Claude Code Session pasten
3. **Variablen-Block oben anpassen** (Brand, Niche, Affiliate-Programm)
4. **Bypass-Permissions aktivieren** (oder Plan-Mode für Review-first)
5. **Claude Code arbeitet ~6-10h** durch alle Phasen
6. **Manuelle Account-Setups danach**: GitHub Pages aktivieren, Brevo + Cloudflare + Anthropic API-Keys konfigurieren

---

## Der Blueprint-Prompt

```
MASTER PROJECT BLUEPRINT — Affiliate-Marketing-Funnel Setup

Du baust einen vollständigen Affiliate-Marketing-Funnel: Bio-Site + Playbook-Subpage + Email-Funnel + NSSM-Service-Stack + Operations-Agents.

═══════════════════════════════════════════════════════
VARIABLEN — VOR DEM START ANPASSEN
═══════════════════════════════════════════════════════

PROJECT_NAME = "[z.B. oskar-marketing oder neuer-account]"
GITHUB_USER = "[z.B. oskar778838]"
GITHUB_REPO = "[z.B. oskar-marketing]"
ACCOUNT_HANDLE = "[z.B. @oskarmarketing]"
BUILD_DAY = "[Tag X im Build, z.B. 1]"

BRAND_COLOR_BG = "[z.B. #050505 für obsidian schwarz]"
BRAND_COLOR_GOLD = "[z.B. #C9A84C]"
BRAND_COLOR_LIGHT = "[z.B. #E8C96A]"
BRAND_FONT_DISPLAY = "[z.B. Cormorant Garamond - Serif für Headlines]"
BRAND_FONT_MONO = "[z.B. JetBrains Mono]"

AFFILIATE_PROGRAM = "[z.B. Mark Janzen Affiliate Academy]"
AFFILIATE_TIER_LOW = "[z.B. Plus 397€]"
AFFILIATE_TIER_HIGH = "[z.B. Pro 830€]"
AFFILIATE_LINK = "[z.B. https://www.checkout-ds24.com/product/xxx?aff=xxx]"

NICHE = "[z.B. Affiliate Marketing für 18-25 Build-in-Public]"
TARGET_AUDIENCE = "[z.B. 18-25 mit scharfem Bullshit-Filter]"
TONE = "[z.B. Build-in-Public, anti-Hype, ehrlich]"

CONTABO_PATH = "[z.B. C:\\Users\\Oskar\\affiliate_autopilot — falls Automation-Stack auf separater Server]"

═══════════════════════════════════════════════════════
PHASE 0 — SETUP + SKILLS (15 Min)
═══════════════════════════════════════════════════════

Installs:
- npm install -g wrangler
- npm install -g vite
- npm install three @types/three gsap lenis split-type postprocessing
- npm install -D vite-bundle-visualizer typescript

VS Code Extensions (via "code --install-extension"):
- slevesque.shader (GLSL highlighting)
- slevesque.vscode-3dviewer
- usernamehw.errorlens
- christian-kohler.path-intellisense
- christian-kohler.npm-intellisense
- dbaeumer.vscode-eslint
- esbenp.prettier-vscode
- eamodio.gitlens

Anthropic Skills (via "npx skills add"):
- anthropics/skills (includes frontend-design + skill-creator)
- pbakaus/impeccable (design polish commands)
- nextlevelbuilder/ui-ux-pro-max-skill (Awwwards-Level)
- vercel-labs/skills (web-design-guidelines)
- leonxlnx/taste-skill (high-end visual design)
- emilkowalski/skill (premium motion design)

HDRIs für 3D-Elemente (optional, ~500KB each):
- https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr → public/hdri/studio.hdr

CLAUDE.md im Repo-Root anlegen mit:
- Stack-Übersicht
- Brand-Conventions (Farben, Fonts, verbotene/erlaubte Wörter)
- File-Architecture
- Operating-Notes (Affiliate-Disclosure-Pflicht, DSGVO-Setup, Build-in-Public Tonality)

═══════════════════════════════════════════════════════
PHASE 1 — BIO-SITE BUILD (3-4h)
═══════════════════════════════════════════════════════

Stack: Vite + TypeScript + Three.js + GSAP + Lenis + SplitType

File-Structure:
project-root/
├── index.html (Bio-Page mit 6-7 Sections)
├── vite.config.ts (Multi-Page-Setup falls Sub-Pages)
├── package.json
├── tsconfig.json
├── public/
│   ├── playbook.html (Lead-Magnet Subpage)
│   ├── datenschutz.html (DSGVO)
│   ├── impressum.html
│   ├── logo.svg (Brand-Logo)
│   ├── og-image.svg (Open Graph)
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── main.ts (Entry-Point)
│   ├── config.ts (URLs + Constants)
│   ├── styles/
│   │   ├── tokens.css (CSS-Variablen für Farben, Fonts, Spacings)
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── hero.css
│   │   ├── sections.css
│   │   └── booking.css
│   ├── hero/
│   │   ├── background.ts (Aurora-Shader / 3D-Element)
│   │   └── shader.frag.ts (GLSL Fragment-Shader)
│   ├── lib/
│   │   ├── cursor.ts (Custom Magnetic Cursor)
│   │   ├── sectionIndicator.ts (Scroll-Position-Indikator)
│   │   ├── playbookForm.ts (Email-Capture-Submit-Handler)
│   │   └── easterEgg.ts (Konami-Code optional)
│   └── sections/
│       ├── statusQuo.ts (4 Stat-Cards mit Animated-Counters)
│       └── manifest.ts (Editorial Closing)
└── docs/
    └── PROJECT-STATUS.md

Sections der Bio-Site (in dieser Reihenfolge):

1. HERO (100vh, full-bleed)
   - OV-Logo mit Dual-Ring-Animation (top-left)
   - Nav-Dropdown (klick auf Chevron → 7 Section-Links)
   - Display-Headline: BRAND_NAME (serif, 200-280px Desktop, 60-100px Mobile, asymmetric placement)
   - Aurora-Background via WebGL Shader (subtle gold mesh-noise on obsidian)
   - 2 CTAs:
     a) Primary: "Affiliate Academy →" (Gold-Fill-Button, magnetic-hover)
     b) Secondary "Playbook lesen →" (Ghost-Button mit gold border, links zu #playbook section)

2. STATUS QUO (Build-in-Public Numbers)
   - Header: "— 01 / STATUS QUO" mono caps
   - Headline: "Build in Public" / "in Zahlen" (asymmetric)
   - 2×2 Grid mit 4 Stat-Cards: konkrete Zahlen aus User-Realität
   - Animated Counters mit GSAP power3.out beim Scroll-In

3. PROOF
   - Header: "— 02 / PROOF"  
   - Headline: "Was du nicht findest / Was du findest" (Strike-through + Italic)
   - 3 Columns: System statt Hype, Schritt für Schritt, Echte Zahlen

4. ACADEMY (Affiliate-Pitch)
   - Header: "— 03 / ACADEMY"
   - Headline: AFFILIATE_PROGRAM-Name (massive serif italic)
   - EINE Karte (NICHT zwei Tracks öffentlich — Plus-Track only auf Bio, Pro-Track auf hidden /pro subpage)
   - Card mit 5 Bullets + Preis "AB ${AFFILIATE_TIER_LOW}" + CTA + Affiliate-Disclosure
   - rel="sponsored noopener" am Affiliate-Link

5. TERMIN (Pro-Beratung-Booking) - optional
   - Header: "— 04 / TERMIN"
   - Cal.com Embed oder Custom Slot-Selector
   - Booking-Form mit Email + Phone + Message

6. PLAYBOOK (Email-Capture)
   - Header: "— 05 / PLAYBOOK"
   - Headline: "Bevor du buchst / nimm das Playbook" (asymmetric)
   - Form: Email + GDPR-Consent-Checkbox + Submit
   - Submit POSTed an Cloudflare Worker /subscribe endpoint
   - Success-State: "Check deine Inbox. Das Playbook ist unterwegs."
   - Placeholder-Guard: wenn SUBSCRIBE_API_URL noch null, zeigt Fallback "Schreib mir direkt"

7. CHANNELS (Social-Matrix)
   - Header: "— 06 / CHANNELS"
   - Headline: "Folge dem Build"
   - 4 Cards: TikTok, Instagram, YouTube, Threads — alle mit ACCOUNT_HANDLE

8. MANIFEST (Editorial Closing)
   - Header: "— 07 / MANIFEST"
   - Massive serif: "Tag für Tag bauen. / Stein für Stein. / Imperium." (per-Wort Reveal-Animation)

Footer:
- Edition meta (z.B. "EDITION 01 / 2026")
- Links: Impressum, Datenschutz
- ACCOUNT_HANDLE

Mobile-Responsive:
- Breakpoints: 480, 768, 1024, 1440
- Mobile-first CSS
- Section-renumbering konsistent in: section-vlabel, section-label, sectionIndicator.ts, nav-dropdown

═══════════════════════════════════════════════════════
PHASE 2 — PLAYBOOK SUBPAGE (1-2h)
═══════════════════════════════════════════════════════

File: public/playbook.html (single-file HTML, inline CSS+JS, Vite copies verbatim)

Struktur:
- Hero mit mesh-gradient background (subtle, weniger luxuriös als Bio-Site)
- 4 Schritt-Cards:
  1. Grundlagen — Was ist Affiliate Marketing (mit DU → PRODUKT → PROVISION Diagramm + 3 Stat-Cards)
  2. Positionierung — Nische wählen (mit 3-Fragen-Filter Mini-List)
  3. Reichweite — Richtige Plattform (mit TikTok/Insta/YouTube Comparison-Chart-Visual)
  4. Content — Hook-Formel (mit 0s/3s/15s/30s Timeline-Visual)
- Bridge-Section: "Aber wie geht es weiter?"
- CTA-Section: AFFILIATE_PROGRAM-Pitch mit Benefits + Price-Box + großer Button
- Affiliate-Disclosure unter CTA: "Werbe-Hinweis: Affiliate-Link..."
- Footer mit Back-Link zur Bio-Site

Color-Migration in :root CSS Variables auf Brand-Tokens (BRAND_COLOR_*).

Background-Differenzierung: 
- Multi-Layer Mesh-Gradient (5 radial-gradients in Gold-Tönen)
- SVG-Noise-Overlay opacity 0.035
- Vignette an Rändern
- Animation 30s smooth drift

SEO + Meta:
- og:title, og:description, canonical
- JSON-LD HowTo Schema mit den 4 Schritten

═══════════════════════════════════════════════════════
PHASE 3 — EMAIL-FUNNEL (Cloudflare Worker + Brevo) (2-3h)
═══════════════════════════════════════════════════════

Architektur:
Visitor Bio-Site Form → Cloudflare Worker /subscribe → Brevo API → DOI-Mail → 3-Mail-Sequenz

Cloudflare Worker (worker/ Folder):
- wrangler.toml mit:
  - name = "${PROJECT_NAME}-booking"
  - main = "src/worker.ts"
  - compatibility_date = "2025-01-01"
  - [vars]:
    - BREVO_LIST_ID = "[wird beim Setup gesetzt]"
    - BREVO_DOI_TEMPLATE_ID = "[wird beim Setup gesetzt]"
    - BREVO_REDIRECT_URL = "https://${GITHUB_USER}.github.io/${GITHUB_REPO}/playbook.html"
    - ALLOWED_ORIGINS = "https://${GITHUB_USER}.github.io"
  - [secrets via wrangler]: BREVO_API_KEY
- src/types.ts: Env + SubscribeRequest/Response types
- src/brevo.ts: brevoCreateDoiContact() Funktion mit Error-Mapping (400/422/429/5xx)
- src/worker.ts: POST /subscribe Endpoint mit Validation + CORS

Frontend (src/lib/playbookForm.ts):
- SUBSCRIBE_API_URL aus src/config.ts laden
- Placeholder-Guard wenn URL null (zeigt Fallback-Error)
- POST als JSON: { email, consent, source }
- mode: 'no-cors' nicht nötig wenn Worker eigener CORS handelt
- Success/Error-States toggeln

3-Mail-Sequenz als Markdown-Drafts:
docs/email-sequence/
├── mail-1.md (Sofort nach DOI: Welcome + Playbook-Link + Mini-Tip)
├── mail-2.md (Tag 2: Update + qualitative Insight)
└── mail-3.md (Tag 5: Academy-Pitch + Disclosure + Affiliate-Link)

Brevo Setup-Anleitung in docs/BREVO-SETUP.md:
Step-by-step User-Aktionen (kann nicht autonomous):
1. brevo.com Sign Up
2. Liste erstellen mit Name "Affiliate Funnel"
3. DOI Template erstellen (Transactional Type)
4. Template-ID notieren, in worker/wrangler.toml setzen
5. Sender-Email verifizieren
6. Automation aufsetzen: Trigger "added to list" → Mail 1 → Wait 2d → Mail 2 → Wait 3d → Mail 3
7. End-to-end-Test mit eigener Email

DSGVO:
- public/datenschutz.html mit Brevo als Sub-Auftragsverarbeiter
- "Drei Fälle"-Struktur (Termin-Booking + Playbook + Standard-Navigation)
- 24-Monate-Speicherdauer dokumentiert
- DPA-Reference

═══════════════════════════════════════════════════════
PHASE 4 — NSSM AUTOMATION STACK (5-8h, optional aber massiv differenzierend)
═══════════════════════════════════════════════════════

Falls separater Contabo-Windows-Server oder VPS verfügbar:

Pfad: ${CONTABO_PATH}/

10 NSSM Services für 24/7 Automation:

1. ${BRAND}Generator — Content Brain
   - generator_v2.py mit Hook-Rotation (4 Typen: Kontrast, FOMO, Zahlen, Save-Worthy)
   - Anti-Cluster-Wörter-Filter
   - Daily 08:00: erstellt Slot 1+2+3 Content
   - Output: posts.db + output/slides/DATUM/

2. ${BRAND}Poster — Posting Daemon
   - blotato_poster.py via Blotato API
   - Postet auf TikTok + Instagram + YouTube
   - Slot-Times: 09:00 / 18:25 / 19:00 (Sa+So) / 23:30 (Mi/Fr/Sa)
   - Lock-Files verhindern Doppel-Posts

3. ${BRAND}Monitor — DM/Comment Watcher
   - monitor.py beobachtet TikTok + Instagram + YouTube
   - Schreibt neue Messages in cowork_input.txt
   - 24/7 Loop, 5-Min-Check

4. ${BRAND}Agent — Self-Learning Brain
   - agent.py lernt aus Performance
   - Holt neue Pinterest-Bilder
   - Bilder-Pool-Management mit used_images.db
   - KI-Foto-Filter

5. ${BRAND}Chatbot — Emotional Sales Bot
   - chatbot.py generiert menschliche DM-Antworten via Claude API
   - Input: cowork_input.txt → Output: cowork_reply.txt
   - chatbot_memory.db für Konversations-Verlauf
   - 3-Phasen-Sales: Rapport → Problem → Affiliate-Link

6. ${BRAND}Uploader — TikTok Selenium Backup
   - tiktok_uploader.py als Fallback wenn Blotato fail
   - Headless Chrome/Edge

7. ${BRAND}Instagram — Instagram Backup
   - instagram_poster.py Selenium-basiert

8. ${BRAND}Comments — Human-like Comment Responder
   - comment_bot.py antwortet auf Comments
   - Random Delay 30s-15min
   - Nachtpause 00:00-07:00
   - Response-Rate 60-80%

9. ${BRAND}Story — Story Poster
   - story_poster.py mit 4-Type-Rotation:
     - 35% Engagement-Polls/Fragen
     - 30% Reel-Teaser
     - 20% Build-in-Public-Updates
     - 15% Direct-CTA
   - Daily 08:00 / 14:00 / 21:00
   - WICHTIG: mediaType="Story" für Instagram (NICHT Feed!)

10. ${BRAND}Watcher — Backup Posting Watcher (optional, oft STOPPED weil redundant)

Wichtige Python-Files:
- generator_v2.py — Slideshow-Text-Generierung
- make_slides.py — Bilder + Text → 1080x1920 JPGs
- orchestrator.py — Koordiniert alles
- chatbot.py — Sales-Bot
- monitor.py — Multi-Platform-Monitoring
- comment_bot.py — Auto-Comments
- story_poster.py — Stories
- pinterest_downloader.py — Bild-Pool

Datenbanken (SQLite):
- posts.db — alle generierten Posts
- used_images.db — Foto-Duplikat-Schutz
- agent_memory.db — Performance-Lerndaten
- chatbot_memory.db — DM-Gesprächs-Verlauf
- stories.db — Story-History

.env Setup:
- ANTHROPIC_API_KEY (Claude Sonnet)
- BLOTATO_TOKEN + Platform-IDs
- ACADEMY_LINK_LOW + ACADEMY_LINK_HIGH (Affiliate-Programme)

Content-Logik (in generator_v2.py):
- Hook-Rotation (nie 2× hintereinander)
- Verbotene Wörter (Anti-Cluster): Sparen, günstig, billig, Rabatt
- Power-Wörter: Investment, Skalieren, System, Cashflow
- Hook-Pflicht: Start mit "Du" oder "Dein" in ersten 5 Wörtern
- Caption mit Frage am Ende, KEINE Hashtags

Slide-Struktur (make_slides.py):
- 7 Slides Format
- Slide 1-3: Everyday-Bilder (relatable)
- Slide 4-6: Luxury-Bilder (Aspiration)
- Slide 7: Everyday + CTA "Link in Bio"
- 1080x1920 (9:16) mit schwarzen Rändern
- Schrift: BRAND_FONT_DISPLAY, weiß, 85px, zentriert
- Anti-KI-Filter

═══════════════════════════════════════════════════════
PHASE 5 — OPERATIONS AGENTS (1-2h, später nutzen)
═══════════════════════════════════════════════════════

Im Repo unter agents/ Folder:

agents/
├── README.md
├── 01-content-strategist/
│   ├── SYSTEM-PROMPT.md (Rolle, Stil, Outputs)
│   ├── daily-workflow.md (Tägliche Content-Generierung)
│   ├── weekly-review.md
│   ├── tier-1-cluster-escape.md
│   └── tier-2-multi-platform.md
├── 02-funnel-analyst/
│   ├── SYSTEM-PROMPT.md
│   ├── tracking-setup.md
│   ├── conversion-audit.md
│   └── monthly-funnel-review.md
├── 03-tech-affiliate-manager/
│   ├── SYSTEM-PROMPT.md
│   ├── multi-affiliate-onboarding.md
│   ├── service-offer-setup.md
│   └── system-health-check.md
├── orchestrator/
│   ├── phase-1-foundation.md
│   ├── phase-2-cluster-escape.md
│   ├── phase-3-diversification.md
│   ├── phase-4-service-layer.md
│   └── phase-5-scaling.md
└── shared/
    ├── context.md (Live-Daten: Tag-X, Subscriber-Count, Reichweite)
    └── brand-voice.md (Tonality, Power-Wörter, verbotene Wörter)

Each agent is a self-contained prompt template invoked on-demand via:
"Read agents/01-content-strategist/SYSTEM-PROMPT.md and daily-workflow.md and shared/context.md. Act as Content Strategist. Run today's workflow."

═══════════════════════════════════════════════════════
PHASE 6 — DEPLOYMENT (30 Min)
═══════════════════════════════════════════════════════

GitHub Pages:
- Repo auf github.com/${GITHUB_USER}/${GITHUB_REPO} push
- Settings → Pages → Source: "GitHub Actions" wählen
- .github/workflows/deploy.yml mit Vite-Build + Pages-Deploy

Cloudflare Worker:
- npx wrangler login
- npx wrangler kv namespace create BOOKINGS (falls KV gebraucht)
- npx wrangler secret put BREVO_API_KEY
- npx wrangler deploy

Domain (optional, später wenn erste Sales):
- Custom Domain bei Cloudflare/Namecheap (~12€/Jahr)
- DNS-Setup für GitHub Pages
- HTTPS via Cloudflare automatisch

═══════════════════════════════════════════════════════
PHASE 7 — POST-LAUNCH CHECKLIST
═══════════════════════════════════════════════════════

Day 0 (sobald alles deployed):
1. End-to-End-Test mit eigener Email
2. iPhone Safari + Desktop Chrome verifizieren
3. Lighthouse-Run (Mobile + Desktop)
4. /ultrareview im Terminal für finale Quality-Sicherung

Day 0-7:
1. TikTok/IG/YouTube/Threads Bio-Links updaten
2. Daily 1-2 manuelle Slide-Posts (KEINE Reels in Cluster-Escape-Phase)
3. 30 Min Comment-Engagement auf 5 Premium-Affiliate-Accounts/Tag
4. Reply auf jeden Comment unter eigenen Posts in ersten 60 Min

Day 7-30:
1. Story-Poster automatisch via NSSM
2. Pattern-Recognition: was funktioniert (Engagement-Rate ≥ 5%)
3. Agent-Setup mit echten Daten in shared/context.md
4. Multi-Affiliate-Anmeldungen (Tool-Stack)

Day 30-60:
1. Service-Layer auf Bio-Site (DFY-Angebote)
2. Erste 100-500 Email-Subscribers
3. Brand-Partnership-Outreach
4. Long-Form YouTube starten

Day 60+:
1. Paid-Traffic-Tests wenn Funnel konvertiert
2. Custom Domain registrieren
3. Newsletter-Sponsorships

═══════════════════════════════════════════════════════
ACCEPTANCE CRITERIA (Build ist DONE wenn):
═══════════════════════════════════════════════════════

1. Bio-Site live unter https://${GITHUB_USER}.github.io/${GITHUB_REPO}/
2. Playbook-Subpage unter /playbook.html erreichbar
3. Email-Form auf Bio-Site posted erfolgreich an Worker → Brevo → DOI-Mail kommt
4. 3-Mail-Sequenz aktiv in Brevo Automation
5. NSSM Services laufen (falls Phase 4 implementiert)
6. Agents-Folder existiert (falls Phase 5)
7. CLAUDE.md im Repo mit allen Conventions
8. Lighthouse Mobile Performance ≥ 80
9. DSGVO-Compliance (Datenschutz + Impressum + Affiliate-Disclosure)
10. End-to-End-Test grün mit eigener Email

═══════════════════════════════════════════════════════
WICHTIGE PRINZIPIEN
═══════════════════════════════════════════════════════

- Build-in-Public-Tonality durchgehend (keine fake Zahlen)
- Affiliate-Disclosure rechtlich Pflicht (rel="sponsored noopener")
- DSGVO: DOI für Email-Capture, Datenschutz-Sub-Page, 24-Monate-Retention
- Mobile-First (alle Sections müssen auf 375px sauber rendern)
- Anti-Cluster-Wörter im Content (Sparen, billig, etc. raus)
- Premium-Wörter im Content (Asset, System, Skalieren etc.)
- KEINE Hashtags auf TikTok-Posts (Algorithmus-mäßig irrelevant 2026)
- Sauber strukturierte Commits, niemals API-Keys committen

═══════════════════════════════════════════════════════
GO
═══════════════════════════════════════════════════════

Variablen am Anfang anpassen, dann durch Phasen arbeiten. Erst Phase 0+1 für minimales Live-System, dann inkrementell Phase 2-5.

Manueller User-Aktionen die NICHT autonomous gehen:
- GitHub Account + Pages aktivieren
- Cloudflare Account + Email-Verification
- Brevo Account + DOI-Template UI-Setup + Automation aufsetzen
- Anthropic API-Key generieren
- Affiliate-Programm-Anmeldungen (Mark Janzen, Blotato Partner etc.)
- Cal.com Account (falls Termin-Booking)
- Sender-Email-Verifizierung in Brevo

Output am Ende: docs/PROJECT-COMPLETE.md mit Live-URLs + verbleibenden manuellen Schritten + Time-Investment-Tracker.
```

---

## Variablen-Reset für neue Accounts

Wenn du den Blueprint für einen NEUEN Account nutzt, ändere nur diese Werte oben:

```
PROJECT_NAME = "[neuer-name]"
GITHUB_USER = "[dein-github]"
GITHUB_REPO = "[neuer-repo-name]"
ACCOUNT_HANDLE = "[@neuer-handle]"
BUILD_DAY = "1"
BRAND_COLOR_BG = "[neue Hauptfarbe]"
BRAND_COLOR_GOLD = "[neue Akzentfarbe]"
NICHE = "[neue Nische]"
AFFILIATE_PROGRAM = "[neues Programm]"
AFFILIATE_LINK = "[neuer Affiliate-Link]"
```

Rest des Blueprints bleibt gleich. Claude Code baut alles neu mit den neuen Variablen.

## Realistische Build-Zeit für komplettes Setup

| Phase | Zeit | Was |
|-------|------|-----|
| Phase 0 — Setup + Skills | 15 Min | Installs + CLAUDE.md |
| Phase 1 — Bio-Site | 3-4h | Komplette Webseite mit 7 Sections |
| Phase 2 — Playbook | 1-2h | Lead-Magnet-Subpage |
| Phase 3 — Email-Funnel | 2-3h | Worker + Brevo + 3 Mails |
| Phase 4 — NSSM Stack | 5-8h | Optional, 10 Services |
| Phase 5 — Agents | 1-2h | Operations-Templates |
| Phase 6 — Deployment | 30 Min | Push + Configs |
| Total ohne NSSM | 8-12h | Reine Build-Zeit |
| Manual-Tasks danach | 1-2h | Brevo-UI, Cloudflare, etc. |

## Speichere diesen Blueprint

1. Im Bio-Site-Repo: `MASTER-BLUEPRINT.md` im Repo-Root
2. Plus Kopie in deinem persönlichen Notes-Tool (Obsidian, Notion)
3. Jeder neue Affiliate-Account = neuer Repo + dieser Blueprint einmal pasten

So baust du jeden neuen Account in 1-2 Tagen statt 4 Wochen.

[Master-Project-Blueprint](computer://C:\Users\oskar\AppData\Roaming\Claude\local-agent-mode-sessions\8fb0241d-e50f-4f10-af52-67378e837bbe\dcc72cc3-be1b-4832-9847-bf2f848e19ef\local_79b38b17-c35d-4ad9-8c7f-e27008ca99bc\outputs\MASTER-PROJECT-BLUEPRINT.md)
