/* 仅在 http/https 下由 app.js 注册。file:// 双击打开不会走这里。
 * 联网时先拉 GitHub Pages 上的新文件（日榜/简报），失败再用缓存。
 * 主屏幕全屏没有系统下拉刷新，必须靠「刷新」按钮或重新进入页面。
 */
var CACHE = "ashare-us-screener-v0.1.19";
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/app.css",
  "./js/app.js",
  "./js/store.js",
  "./js/data/mapping.js",
  "./js/data/sample-board.js",
  "./js/data/market-context.js",
  "./js/data/sample-analysis.js",
  "./js/data/briefings.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    fetch(new Request(req.url, {
      method: "GET",
      cache: "no-store",
      credentials: req.credentials
    })).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(req, copy);
        });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (cached) {
        return cached || new Response("离线且无缓存", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      });
    })
  );
});
