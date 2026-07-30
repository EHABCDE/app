// WICHTIG: Version auf v3 erhöht, um das Update zu erzwingen!
const CACHE_NAME = 'eh-abc-v3';
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

// Stale-While-Revalidate: IMMER sofort aus dem Cache laden für maximale Geschwindigkeit.
// Gleichzeitig im Hintergrund prüfen, ob es im Netz eine neuere Version gibt, und diese in den Cache legen.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Netzwerk-Fehler ignorieren, da wir die Offline-Dateien haben
      });
      
      // Liefere sofort die Offline-Version, wenn vorhanden. Sonst warte aufs Netz.
      return cachedResponse || fetchPromise;
    })
  );
});
