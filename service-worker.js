// service-worker.js
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('bold-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/app.js',
          "/js/jquery-3.6.0.min.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "/js/pdfmake.min.js",
          "/js/vfs_fonts.js",
          '/css/app.css',
          "/css/all.min.css",
          "/css/bootstrap.min.css",
          '/manifest.json',
          '/icon/icon.png',
          '/service-worker.js',
          "/webfonts/fa-solid-900.ttf",
          "/webfonts/fa-solid-900.woff2",
          "/webfonts/Poppins-Bold.ttf",

        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
