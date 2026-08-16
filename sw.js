// WICHTIG: Version auf v23 erhöht, um das Update bei allen Nutzern zu erzwingen!
const CACHE_NAME = 'eh-abc-v23';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './lang.js',
  './manifest.json',
  './logo.jpg',
  './datenschutz.html',
  './impressum.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

// Dateien beim ersten Laden in den Speicher des Handys laden
self.addEventListener('install', (e) => {
  self.skipWaiting();
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
    ).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate: IMMER sofort aus dem Cache laden für maximale Geschwindigkeit.
// Gleichzeitig im Hintergrund prüfen, ob es im Netz eine neuere Version gibt.
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

// =========================================================
// PUSH-BENACHRICHTIGUNGEN (Verbandkasten-Erinnerungen etc.)
// =========================================================

self.addEventListener('push', (e) => {
  let payload = { title: '🩹 Erste Hilfe ABC', body: 'Du hast eine neue Erinnerung.' };
  try {
    if (e.data) payload = e.data.json();
  } catch (err) {
    if (e.data) payload.body = e.data.text();
  }

  e.waitUntil(
    self.registration.showNotification(payload.title || '🩹 Erste Hilfe ABC', {
      body: payload.body || '',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: 'eh-abc-erinnerung'
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
