# Cal.eu Config Reference

Short reference for the Pro-Beratung booking embed. **Not a setup guide** —
account + event-type are already live. This doc just documents the values
so we don't lose them.

---

## Account

| Field | Value |
|---|---|
| Provider | Cal.com Inc., EU-Datenresidenz via cal.eu |
| Account email | `opheck@gmx.de` |
| Username | `opheck-gmx.de` |

## Event-Type

| Field | Value |
|---|---|
| Name | Pro-Beratung Affiliate Setup |
| Duration | 30 min |
| Public URL | https://cal.eu/opheck-gmx.de/pro-beratung |
| `calLink` (embed API) | `opheck-gmx.de/pro-beratung` |
| Slot interval | 60 min (only on the hour, not `:30`) |
| Buffer after | 15 min |
| Minimum notice | 12 hours |
| Video | Google Meet (auto-generated per booking) |

## Availability

| Day | Window |
|---|---|
| Mo | 14:00–15:30 |
| Di | 14:00–16:30 |
| Mi | 16:30–18:00 |
| Do | 17:00–17:30 |
| Fr | 17:00–19:30 |
| Sa | 14:00–16:30 |
| So | 14:00–16:30 |

## Embed config (in `index.html`, termin section)

```js
Cal("init", "pro-beratung", { origin: "https://cal.eu" });

Cal.ns["pro-beratung"]("inline", {
  elementOrSelector: "#cal-inline",
  config: { layout: "month_view", theme: "dark" },
  calLink: "opheck-gmx.de/pro-beratung",
});

Cal.ns["pro-beratung"]("ui", {
  cssVarsPerTheme: { dark: { "cal-brand": "#C9A84C" } },
  hideEventTypeDetails: false,
  layout: "month_view",
});
```

Notes:

- `origin: "https://cal.eu"` is the data-residency switch. Without it Cal
  defaults to the US instance.
- The embed script src stays canonical `https://app.cal.com/embed/embed.js`
  even when targeting cal.eu — the loader file is platform-agnostic and
  uses the origin we pass.
- `cal-brand: "#C9A84C"` matches the project's primary gold token
  (`--gold` in `src/styles/tokens.css`). Change that token to keep the
  embed in sync.

## Changing schedule or buffers

All schedule/buffer/notice tweaks happen in the Cal dashboard
(`https://cal.eu/event-types`). **No code change needed** — the embed
pulls the latest config on each load.

## Privacy

Cal is listed as a sub-processor in `public/datenschutz.html` §5 along
with Google Ireland (for Meet). When schedule windows change, that doc
does not need an update — only when the provider stack itself changes
do you have to touch it.
