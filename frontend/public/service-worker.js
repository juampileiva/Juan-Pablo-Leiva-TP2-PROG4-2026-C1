const CACHE_NAME = 'red-social-tp2-v1';
const ARCHIVOS_BASE = ['/', '/index.html', '/favicon.ico', '/favicon.png', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_BASE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respuesta) => {
      return respuesta || fetch(event.request).catch(() => caches.match('/index.html'));
    }),
  );
});
