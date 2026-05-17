// Above-fold live-metrics strip. Loads real numbers from
// public/data/metrics.json — Oskar maintains the file by hand once a
// week (no API/secret to operate). Site degrades silently if the fetch
// fails: the strip hides itself instead of showing zeros or an error.
//
// The shipped-days metric is special: its JSON value is ignored and
// overridden with getBuildDay() so the number stays current without a
// weekly file edit.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBuildDay } from "../config";

interface Metric {
  key: string;
  label: string;
  value: number;
  delta: number | null;
  deltaUnit: string | null;
  computed?: "buildDay";
  format?: "comma" | "plain";
}

interface MetricsPayload {
  updated: string;
  metrics: Metric[];
}

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export function initProofStrip(): void {
  const section = document.querySelector<HTMLElement>(".proof-strip");
  if (!section) return;
  const list = section.querySelector<HTMLElement>("[data-metrics-list]");
  const updatedEl = section.querySelector<HTMLTimeElement>(
    "[data-metrics-updated]"
  );
  if (!list) return;

  // Resolve the data URL the same way the service-worker does — relative
  // to the document so it works under the GH Pages user-subpath deploy.
  const url = new URL("data/metrics.json", document.baseURI).toString();

  void fetch(url, { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<MetricsPayload>;
    })
    .then((payload) => {
      section.hidden = false;
      render(section, list, updatedEl, payload);
    })
    .catch((err) => {
      console.warn("[proofStrip] fetch failed, hiding strip:", err);
      section.hidden = true;
    });
}

function render(
  section: HTMLElement,
  list: HTMLElement,
  updatedEl: HTMLTimeElement | null,
  payload: MetricsPayload
): void {
  if (updatedEl) {
    updatedEl.dateTime = payload.updated;
    updatedEl.textContent = humanRelative(payload.updated);
  }

  list.innerHTML = payload.metrics
    .map((m) => {
      const targetValue = m.computed === "buildDay" ? getBuildDay() : m.value;
      const deltaChip = renderDelta(m);
      return `
        <li class="proof-strip__item">
          <span class="proof-strip__value" data-strip-value data-target="${targetValue}" data-format="${m.format ?? "plain"}">0</span>
          <span class="proof-strip__meta">
            <span class="proof-strip__label">${m.label}</span>
            ${deltaChip}
          </span>
        </li>
      `;
    })
    .join("");

  animateCounters(list);
  section.classList.add("is-ready");
}

function renderDelta(m: Metric): string {
  if (m.delta === null) return "";
  const sign = m.delta > 0 ? "+" : m.delta < 0 ? "−" : "±";
  const tone =
    m.delta > 0 ? "is-up" : m.delta < 0 ? "is-down" : "is-flat";
  const unit = m.deltaUnit ? ` ${escapeHtml(m.deltaUnit)}` : "";
  return `<span class="proof-strip__delta ${tone}">${sign}${Math.abs(m.delta)}${unit}</span>`;
}

function animateCounters(list: HTMLElement): void {
  const els = list.querySelectorAll<HTMLElement>("[data-strip-value]");
  els.forEach((el, i) => {
    const target = parseInt(el.dataset.target ?? "0", 10);
    const fmt = el.dataset.format === "comma";
    if (PREFERS_REDUCED_MOTION || target === 0) {
      el.textContent = formatValue(target, fmt);
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target,
      duration: 1.4,
      delay: i * 0.12,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = formatValue(Math.floor(obj.v), fmt);
      },
      onComplete: () => {
        el.textContent = formatValue(target, fmt);
      },
    });
    ScrollTrigger.create({
      trigger: el,
      start: "top 95%",
      once: true,
      onEnter: () => tween.play(),
    });
  });
}

function formatValue(n: number, withComma: boolean): string {
  if (!withComma) return String(n);
  return n.toLocaleString("de-DE");
}

function humanRelative(isoDate: string): string {
  const then = new Date(isoDate + "T00:00:00Z").getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / 86_400_000);
  if (days <= 0) return "heute";
  if (days === 1) return "vor 1 Tag";
  if (days < 7) return `vor ${days} Tagen`;
  if (days < 14) return "vor 1 Woche";
  return `vor ${Math.floor(days / 7)} Wochen`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
