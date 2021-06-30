'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "favicon.png": "5dcef449791fa27946b3d35ad8803796",
"version.json": "7e5ea53bdcf96bfd088b297ddba04472",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "8ddc799010ef98110f5aed3879345d06",
"/": "8ddc799010ef98110f5aed3879345d06",
"manifest.json": "419f712c8d71b42868318202587d705c",
"main.dart.js": "5609cb305c24b403c09b0102a16a4e93",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "bde9ee889e7cdb2c908965b81d635c52",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.json": "8dbed0827c161c5b0cd8a2693f3a106a",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/heart8.png": "f35d9f5e90c3200060f569342f0dacc8",
"assets/assets/sergio2.jpg": "366ef82d4a06ce2caab9d82b5689521e",
"assets/assets/heart10.png": "285736c79d0dbf278cc44b040eb76e86",
"assets/assets/heart.gif": "001ff0e8221b1a521bb2895f6ab1f4ba",
"assets/assets/heart13.png": "1cd28bde48683718c5a78112d119c70f",
"assets/assets/freddy.jpg": "f7128f9f9dceb37417373a976dfeb076",
"assets/assets/heart4.png": "e97186cd5a0784c27ca9152c64051f0d",
"assets/assets/heart12.png": "359ad5b0e174458ef5646a1451b034b8",
"assets/assets/heart11.png": "50bdf46660f110813b73f51f0c87592b",
"assets/assets/heart5.png": "80889d044e16c92168ebee84cd116fb3",
"assets/assets/heart6.png": "1725be52e07a3c58a5ce3fe9f1cc8a9a",
"assets/assets/heart1.png": "7d66c6d7bf95280748be1271ca2e0114",
"assets/assets/heart14.png": "f3e38e992e08acc079114d16bcb70ad2",
"assets/assets/heart2.png": "1b848bab726bfb5c11dd988e01d15d64",
"assets/assets/heart7.png": "e82041f772f855d8aa81eb39b392289b",
"assets/assets/heart.png": "2810eeb1c5b756578617a5b2ff101b86",
"assets/assets/heart3.png": "58a3e97610cdeacf5bd619dbbfc6f66b",
"assets/assets/heart9.png": "0cc45ecc84a166db3da6acc48f3c08df",
"assets/assets/aztic/jose_leon.jpg": "f06307121bbb4781f520a930edb4bcb7",
"assets/assets/aztic/sergio.jpg": "8f8595d611a2ef9823f1e3214fc68b46",
"assets/assets/aztic/sebas.jpg": "991664689cd1a9c0f37c890afc8fd25b",
"assets/assets/aztic/carlos.jpg": "952e12de91ffcfdfaae914fd9e4c6a54",
"assets/assets/aztic/jose_perez.jpg": "0c6fe1a5ceda10cb5d10eb5d59c6dbf1",
"assets/assets/aztic/eudes.jpg": "49e10b59ad6cc126730a1ae1aa6d26f6",
"assets/assets/aztic/roberto.jpg": "1da272d5778962d28ef3a799dbc4c7cd",
"assets/assets/aztic/yo.jpg": "7c54a3571bdc350d724c1ce3ea701aa3",
"assets/assets/aztic/laura.jpg": "8dc03eb15618a592f2acf9016fbbc677",
"assets/assets/aztic/yanira.jpg": "340290fa2c509db140c0536cfccfd5e1",
"assets/assets/aztic/ruth.jpg": "618243f765382f48ed56d2dcea86d546",
"assets/assets/aztic/ricardo.jpg": "ad63ae929f048c33fc79d9fd38c60404",
"assets/assets/aztic/imo.jpg": "5b4dc0d99b7b77a9d88d698184036b1b",
"assets/assets/aztic/santi.jpg": "5efd16b2ef02daa74f78da8484f13f93"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
