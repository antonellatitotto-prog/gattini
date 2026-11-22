/* Funziona anche senza internet: la pagina si prende dalla rete quando c'Ã¨, altrimenti dalla memoria. */
var CACHE = "sito-gattini-v1";
var SHELL = ["./","./index.html","./manifest.webmanifest","./icona-192.png","./icona-512.png","./icona-maskable-512.png","./apple-touch-icon.png"];
self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return Promise.all(SHELL.map(function(u){ return c.add(u).catch(function(){}); })); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ return k===CACHE ? null : caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(function(res){
    if(res && res.status===200){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){ return caches.match(req).then(function(r){ return r || caches.match("./"); }); }));
});