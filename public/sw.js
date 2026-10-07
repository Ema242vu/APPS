const CACHE_NAME = "persons-v3";
const STATIC_CACHE = "persons-static-v3";
const HTML_CACHE = "persons-html-v3";

const PRECACHE_URLS = ["/"];

// Dominios de anuncios - NUNCA cachear
const AD_DOMAINS = [
  "bellnewyork",
  "al5sm",
  "omg10",
  "ardance",
  "googlesyndication",
  "doubleclick",
  "googleadservices",
];

function isAdRequest(url) {
  return AD_DOMAINS.some((domain) => url.includes(domain));
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => ![STATIC_CACHE, HTML_CACHE, CACHE_NAME].includes(n))
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo GET
  if (request.method !== "GET") return;

  // Ignorar anuncios
  if (isAdRequest(request.url)) return;

  // Ignorar extensiones de Chrome
  if (request.url.startsWith("chrome-extension")) return;

  const url = new URL(request.url);
  const isHTML = request.headers.get("accept")?.includes("text/html");
  const isSameOrigin = url.origin === self.location.origin;

  // HTML: network-first (para que siempre tengas contenido fresco)
  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(HTML_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Static assets: cache-first
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          // Solo cachear respuestas OK
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return response;
        });
      })
    );
  }
});
