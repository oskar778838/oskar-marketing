# Design References — oskarmarketing Bio

## Skill-Discovery Status
- **skills.sh** (Plural) ist der echte Katalog. **skill.sh** (Singular) ist eine geparkte Domain — Redirect zu park.io. Hatte ich initial verwechselt.
- CLI: `npx skills add <repo> --skill <name>`.
- **Installiert für dieses Projekt** (Pfad: `.agents/skills/`):
  - `find-skills` (vercel-labs/skills) — Skill-Discovery-Helper.
  - `frontend-design` (anthropics/skills) — Anti-AI-slop Frontend-Design-Playbook.

### Übernommen aus `frontend-design` SKILL.md
- "Bold aesthetic direction, executed with precision" → wir gehen **refined editorial minimalism**.
- "Distinctive font choices" → Cormorant Garamond + JetBrains Mono (KEIN Inter/Roboto). ✅
- "Dominant colors with sharp accents" → Gold dominant auf 4-Stufen-Obsidian. ✅
- "One well-orchestrated page load with staggered reveals" → 2.2s Sequence Cursor → Avatar → Name → Tagline → CTA → Scroll. ✅
- "Asymmetry, overlap, grid-breaking" → Hero Italic-Name extends past viewport (mobile), Proof items stagger vertical (item 2 +48px). ✅
- "Backgrounds with atmosphere" → WebGL noise-mesh + grain + vignette + radial mesh fallback. ✅
- "Custom cursors, grain overlays" → both ✅

## Analysierte Awwwards SOTD Sites

### obys.agency
- **Restraint dominiert.** Achromatische Hochkontrast-Palette, keine Gradient-Spielereien.
- **Archival numbering** (01–32) — Projekte als nummerierte Einträge, nicht als beworbene Highlights.
- **Strikte Kolumnen, intentionale Asymmetrie** (Vertical/Horizontal/Grid Toggle).
- **Hover-Reveals statt aggressiver Animationen** — Bewegung ist Belohnung, nicht Standard.

### exoape.com
- **Cinematic-First.** Hero-Imagery in 2400px+, Portfolio = visuelles Erlebnis.
- **Sparse Copy mit Atemraum** — "Digital / Design / Experience" gestackt vertikal.
- **Motion ist nicht supplementär**, sondern strukturell (Reel-Play als CTA).
- **Storytelling-Sub-Titel** unter Client-Namen ("Frontier Health Innovation").

### simonholm.studio
- **Numerierte Featured-Projekte (01–05)** — wieder editorial-archival.
- **HTML5-Video als Hover-Reveal**, nicht autoplay-spam.
- **Konsistente 12-col Grid** mit Prev/Next-Navigation.
- **Minimalistisch + multimedia-rich** = luxury positioning.

## Übertragene Prinzipien für oskarmarketing.bio

### Layout
1. **Sektionen nummeriert 00–05** mit Mono-Labels ("00 — INDEX", "01 — PROOF").
2. **Asymmetrische 12-col Grid**, Hauptelemente span 2–7 oder 6–11, niemals 4–8 (langweilig).
3. **Hero-Name half-aus-dem-Viewport** (Cormorant Display 200px+, übersteht den Rand).
4. **Mobile bekommt eigene Layout-Eigenheiten** pro Section, kein blindes Stacking.

### Typografie
- **Cormorant Garamond** (Display, ital für Akzent-Quote)
- **JetBrains Mono Light** (Editorial-Labels, all-caps, 11px tracked +0.2em)
- **DM Sans** (Body, 400/500)
- Größenverhältnis 200:11 (extrem) — visuelles Schock-Element.

### Farbpalette (4-Step Schwarz + Gold + Pearl-Cream)
```
--obsidian-0:  #050505    /* deepest */
--obsidian-1:  #0A0908    /* surface */
--obsidian-2:  #111110    /* card */
--obsidian-3:  #18161A    /* elevated */
--gold:        #C9A84C    /* primary accent */
--gold-warm:   #E8C96A    /* hover/highlight */
--gold-deep:   #8B6914    /* muted */
--pearl:       #EDE9E3    /* "white" — warm */
--pearl-rare:  #F5E6B8    /* hover-only secondary */
```
NIEMALS reines Weiß (#FFF). NIEMALS reines Schwarz für UI-Elemente außer Hintergrund.

### Motion
- **Easing default**: `cubic-bezier(0.65, 0, 0.35, 1)` — sanfter Ein-/Ausstieg, schneller Mittelteil.
- **Easing emphasis**: `cubic-bezier(0.16, 1, 0.3, 1)` — slow-then-snap (CTA Reveals).
- **Lenis** für globalen Smooth-Scroll, lerp 0.08.
- **GSAP + ScrollTrigger** für Sektion-Choreographie.
- **SplitType** für char-by-char Reveals.
- **Custom Cursor** klein (8px), gold, Trail-Lag 100ms; auto-off auf Touch.
- **Magnetic CTA** max 12px Translate.
- **Page-Load-Sequence** total 2.2s, gestaffelt: BG → Cursor → Logo → Avatar → Name → Tagline → CTA → Scroll-Indicator.

### 3D / WebGL
- **Three.js Plane mit Custom Fragment-Shader** für Hero-Background.
- Gold-Noise-Mesh auf Schwarz, Mausposition beeinflusst uOffset im Shader.
- Async geladen via `import()`, CSS-Mesh-Fallback rendert sofort.

### Texturen
- **SVG Grain Overlay** (fractalNoise feTurbulence, opacity 0.04, mix-blend overlay).
- **Vignette** als inset-radial-gradient am Viewport-Rand.

### Anti-AI-Look Checks
- [ ] Mind. 2 Display-Schriften (Cormorant + Mono accent)
- [ ] Mind. ein left/right asymmetrischer Bereich auf Desktop
- [ ] Zahlen-Hierarchie: 200px neben 11px
- [ ] WebGL-Hero (nicht reines CSS)
- [ ] Custom Cursor
- [ ] Magnetic Hover
- [ ] Editorial-Numbering (00–05)
- [ ] KEINE fake Stats ("50K+" etc.)
- [ ] Reduced-Motion respektiert
