var CACHE='urm-cache-v1';
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req=e.request;
  if(req.method!=='GET'||req.url.indexOf(self.location.origin)!==0)return;
  e.respondWith(caches.match(req).then(function(hit){
    if(hit)return hit;
    return fetch(req).then(function(res){
      var copy=res.clone();
      caches.open(CACHE).then(function(c){ c.put(req,copy); });
      return res;
    }).catch(function(){ return caches.match('./index.html'); });
  }));
});