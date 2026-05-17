// Konami easter egg: ↑↑↓↓←→←→ B A → invert all indigo accents to cyan for 5s.
// Plus a small console personality message at boot, and the meta day-x counter.

import { getBuildDay } from "../config";

const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function initEasterEgg(): void {
  printConsoleSignature();

  let buffer: string[] = [];
  window.addEventListener("keydown", (e) => {
    buffer.push(e.code);
    if (buffer.length > CODE.length) buffer = buffer.slice(-CODE.length);
    if (
      buffer.length === CODE.length &&
      buffer.every((c, i) => c === CODE[i])
    ) {
      trigger();
      buffer = [];
    }
  });
}

function trigger(): void {
  const html = document.documentElement;
  html.classList.add("easter-egg-active");
  // eslint-disable-next-line no-console
  console.log(
    "%c✦ Geheime Welt entdeckt.",
    "color:#22d3ee;font-family:'Cormorant Garamond',serif;font-size:24px;font-style:italic;"
  );
  // eslint-disable-next-line no-console
  console.log(
    "Schreib mir bei @oskarmarketing wenn du das siehst — du bekommst was."
  );
  window.setTimeout(() => html.classList.remove("easter-egg-active"), 5000);
}

function printConsoleSignature(): void {
  // eslint-disable-next-line no-console
  console.log(
    `
   ███████╗
   ██╔══██╗
   ██████╔╝   Hi.
   ██╔═══╝    Bist du Developer? Schreib mir.
   ██║        @oskarmarketing  ·  opheck@gmx.de
   ╚═╝
`
  );
}

/**
 * Auto-update Tag-X based on the canonical project start date. Writes the
 * day count into <meta name="day-x" content="N"> for SEO/analytics
 * freshness. Anchored to `PROJECT_START_DATE` in src/config.ts so the
 * pivot eyebrow, journal LIVE marker, and proof-strip "Tage gebaut" all
 * read the same number.
 */
export function updateDayCounter(): void {
  const days = getBuildDay();
  let meta = document.querySelector<HTMLMetaElement>('meta[name="day-x"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "day-x";
    document.head.appendChild(meta);
  }
  meta.content = String(days);
}
