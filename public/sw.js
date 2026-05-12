// Service Worker for Oskar Marketing
// Strategy:
//   - Network-first for navigation (HTML) so updates show immediately
//   - Cache-first for static assets (JS, CSS, fonts, images, hdri)
//   - Offline fallback to the cached index.html

const CACHE_VERSION = "om-v3";
const OFFLINE_FALLBACK = "./";
const PRECACHE = ["./", "./logo.svg", "./favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Don't cache cross-origin requests (Google Fonts, Digistore, etc.)
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first with cache fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return resp;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match(OFFLINE_FALLBACK)))
    );
    return;
  }

  // Static assets: cache-first, then network with cache backfill.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          if (!resp.ok) return resp;
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return resp;
        })
        .catch(() => cached);
    })
  );
});
