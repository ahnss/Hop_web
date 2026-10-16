// 자동 생성 파일(scripts/build-web-app.mjs). 직접 고치지 마세요.
const VERSION = "a25afab34f17";
const APP_CACHE = 'hop-web-' + VERSION;
const FONT_CACHE = 'hop-web-fonts-v1';
const PRECACHE = [
  "./",
  "./assets/dist-js-CDjNp--g.js",
  "./assets/event-CFbwyvRi.js",
  "./assets/index--u_tGnB6.css",
  "./assets/index-obBvmEL6.js",
  "./assets/rhwp_bg-DB8FleS8.wasm",
  "./assets/webviewWindow-CZKwYcFx.js",
  "./favicon.ico",
  "./icons/apple-touch-icon.png",
  "./icons/hop-256.png",
  "./icons/hop-512.png",
  "./images/icon_small_ko.svg",
  "./images/icon_small_ko_dark.svg",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('hop-web-') && key !== APP_CACHE && key !== FONT_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/fonts/')) {
    event.respondWith(cacheFirst(FONT_CACHE, request));
  } else if (request.mode === 'navigate') {
    // 화면은 새 버전을 먼저 시도하고, 인터넷이 없으면 저장본으로 연다.
    event.respondWith(fetch(request).catch(async () => (await caches.match(request)) ?? caches.match('./')));
  } else {
    event.respondWith(cacheFirst(APP_CACHE, request));
  }
});

async function cacheFirst(cacheName, request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
  return response;
}
