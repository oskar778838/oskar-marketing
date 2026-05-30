// Click-to-load wrapper for the Cal.eu inline booking embed.
//
// Loading Cal eagerly pulled ~1.6 MB / 80+ requests from app.cal.com (US), set
// third-party cookies, and tanked mobile Lighthouse (LCP/TBT) — all before the
// visitor did anything. This defers the entire embed until an explicit click on
// a "Termin laden" button: a performance win and a DSGVO click-to-load consent
// gate at once. embed.js + the iframe only touch the network on click.

// Cal's window global is untyped third-party glue; a localized `any` is the
// pragmatic choice over a fragile hand-written port of their published snippet.

interface CalLoaderConfig {
  target: string;
  namespace: string;
  calLink: string;
  origin: string;
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";
const BRAND = "#5B5BD6";

// Official Cal.com bootstrap — defines window.Cal and injects embed.js on the
// first call. Verbatim logic from Cal's published snippet, run on demand.
function bootstrapCal(): any {
  const w = window as any;
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any): void {
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function (): void {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function (): void {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
  })(w, EMBED_SRC, "init");
  return w.Cal;
}

function loadCalInline(cfg: CalLoaderConfig): void {
  const Cal = bootstrapCal();
  Cal("init", cfg.namespace, { origin: cfg.origin });
  Cal.ns[cfg.namespace]("inline", {
    elementOrSelector: cfg.target,
    calLink: cfg.calLink,
    config: { layout: "month_view", theme: "light" },
  });
  Cal.ns[cfg.namespace]("ui", {
    cssVarsPerTheme: {
      light: { "cal-brand": BRAND },
      dark: { "cal-brand": BRAND },
    },
    hideEventTypeDetails: false,
    layout: "month_view",
  });
}

/** Wire every [data-cal-loader] button to load its Cal embed on click. */
export function initCalLoaders(): void {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>("[data-cal-loader]");
  buttons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        const target = btn.dataset.calTarget ?? "";
        const calLink = btn.dataset.calLink ?? "";
        if (!target || !calLink) return;
        const mount = document.querySelector<HTMLElement>(target);
        if (mount) mount.hidden = false;
        btn.hidden = true;
        loadCalInline({
          target,
          calLink,
          namespace: btn.dataset.calNamespace ?? "booking",
          origin: btn.dataset.calOrigin ?? "https://cal.eu",
        });
      },
      { once: true }
    );
  });
}
