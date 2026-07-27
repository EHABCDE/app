// WICHTIG: Diese Nummer bei jedem Update der App erhöhen (v2, v3, ...),
// sonst bekommen Nutzer mit installierter App nie deine neuen Dateien!
const CACHE_NAME = 'eh-abc-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './logo.jpg'
];

// Dateien beim ersten Laden in den Speicher des Handys laden
self.addEventListener('install', (e) => {
  self.skipWaiting(); // neuer Service Worker übernimmt sofort, statt zu warten
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Alte Caches von früheren Versionen aufräumen
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // sofort alle offenen Tabs übernehmen
  );
});

// Network-First: erst versuchen, frische Version aus dem Netz zu holen,
// nur bei Netzwerk-Ausfall aus dem Speicher laden (so kommen Updates sofort an)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
