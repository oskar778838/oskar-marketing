// Tag-N Journal — Build-in-Public timeline.
//
// Single source of truth for every entry shown in the journal section
// (and consumed by the centerpiece scroll-snap rail in src/lib/journal.ts).
//
// Editorial rules — read these before adding an entry:
//   - One entry per real working day. If nothing shipped, still write
//     the card honestly ("Tag 9 — DSGVO Audit, sonst nichts.").
//   - `day` is computed against PROJECT_START_DATE in src/config.ts.
//     Verify before committing: getBuildDay() should equal the last
//     entry's `day` on the day it ships.
//   - `metrics` are real numbers from the real source. No invented data.
//   - `lesson` is one line, max ~120 chars. Plain. No emojis.

export interface JournalMetric {
  label: string;
  value: string;
}

export interface JournalEntry {
  day: number;
  date: string;        // YYYY-MM-DD
  title: string;
  metrics?: JournalMetric[];
  lesson: string;
}

export const JOURNAL: JournalEntry[] = [
  {
    day: 1,
    date: "2026-04-29",
    title: "Tag 0 → 1. Repo init, Vite + Three + GSAP gewählt.",
    metrics: [
      { label: "Views", value: "0" },
      { label: "Liste", value: "0" },
    ],
    lesson: "Mit zero proof gestartet. Das war ehrlicher als jedes 'als ich anfing'-Screenshot.",
  },
  {
    day: 4,
    date: "2026-05-02",
    title: "Brevo + DOI komplett gewired.",
    metrics: [
      { label: "Forms live", value: "1" },
      { label: "DOI rate", value: "100%" },
    ],
    lesson: "Double-Opt-In von Tag 1 — kein nachträgliches DSGVO-Anstückeln. Erspart später viel.",
  },
  {
    day: 8,
    date: "2026-05-06",
    title: "Cal.eu eingebettet, EU-Datenresidenz aktiv.",
    metrics: [
      { label: "Cal embed", value: "live" },
      { label: "Latenz", value: "<300ms" },
    ],
    lesson: "Statt eigenes Buchungs-Backend zu bauen: Cal.eu mit gelabeltem cal-brand. Pragmatisch über perfekt.",
  },
  {
    day: 14,
    date: "2026-05-12",
    title: "Aurora-Shader mit 9 reaktiven Uniforms.",
    metrics: [
      { label: "Uniforms", value: "9" },
      { label: "FPS desktop", value: "60" },
      { label: "FPS mobile", value: "30" },
    ],
    lesson: "Maus-Trail, Scroll-Pulse, Hot-Spot-Drift. Das Hintergrundsystem ist jetzt das Brand-Asset.",
  },
  {
    day: 17,
    date: "2026-05-15",
    title: "Pattern erkannt — alle im Cluster sehen gleich aus.",
    metrics: [
      { label: "Konkurrenz analysiert", value: "12" },
      { label: "Davon dark+gold", value: "11" },
    ],
    lesson: "Tate-/Gadzhi-coded Affiliate-Sites in Endlosschleife. Gold ist nicht mehr Distinktion sondern Tarnung.",
  },
  {
    day: 18,
    date: "2026-05-16",
    title: "Pivot-Entscheidung: Indigo + Snow. Plan geschrieben.",
    metrics: [
      { label: "Tokens neu", value: "10" },
      { label: "Refactor LOC ~", value: "250" },
    ],
    lesson: "Off-White als Konter-Move. Wer Substance statt Style will, kommt zu uns — die anderen können bei Gold bleiben.",
  },
  {
    day: 19,
    date: "2026-05-17",
    title: "Pivot shipped. Indigo plasma live, Journal als Centerpiece.",
    metrics: [
      { label: "Commits", value: "10" },
      { label: "Build time", value: "2.7s" },
      { label: "Lighthouse", value: "TBD" },
    ],
    lesson: "Pattern erkannt am Tag 17, ausgeführt am Tag 19. Schnelle Diagnose, schnelle Adaption — das ist die Skill.",
  },
];

/** Index of the entry whose day equals the current build day, or
 *  the last entry's index if today is past the latest entry. Used to
 *  auto-snap the journal rail to "today" on section enter. */
export function currentJournalIndex(buildDay: number): number {
  let last = 0;
  for (let i = 0; i < JOURNAL.length; i++) {
    if (JOURNAL[i].day <= buildDay) last = i;
  }
  return last;
}
