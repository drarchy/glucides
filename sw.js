const CACHE_NAME = 'glucides-v11';
const ASSETS = ['./', 'index.html', 'aliments-light.js', 'aliments-full.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const NET_TIMEOUT = 5000;

self.addEventListener('install', e => {
  // Tolerate partial failures so a flaky connection can't break the install
  e.waitUntil(
    caches.open(CACHE_NAME).then(c =>
      Promise.allSettled(ASSETS.map(a => c.add(new Request(a, { cache: 'reload' }))))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// The page asks for the new version to take over when the user taps the banner
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// Network fetch that gives up instead of hanging on a slow link
function fetchWithTimeout(request) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), NET_TIMEOUT);
  return fetch(request, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function revalidate(request) {
  return fetchWithTimeout(request)
    .then(res => {
      if (res.ok) return caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
    })
    .catch(() => {});
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  const nav = req.mode === 'navigate';
  const key = nav ? 'index.html' : req;

  e.respondWith(
    caches.match(key, { ignoreSearch: true }).then(cached => {
      if (cached) {
        // Serve instantly, refresh in the background without blocking the response
        e.waitUntil(revalidate(nav ? new Request('index.html') : req));
        return cached;
      }
      return fetchWithTimeout(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE_NAME).then(c => c.put(req, copy)));
        }
        return res;
      });
    })
  );
});
