/// <reference types="@sveltejs/kit" />
import { build, files, version } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `cache-3-8-${version}`;

const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
];
const counts = [9, 6, 2, 17, 1, 1, 1];
const Tags = ["AR", "EN"];
const url = "https://fra1.digitaloceanspaces.com/ekaterra-test/Lebanon";
for (let index = 0; index < counts.length; index++) {
  const count = counts[index];
  for (let imgg = 1; imgg < count + 1; imgg++) {
    ASSETS.push(`${url}/AR/${index + 1}/${imgg}.png`);
    ASSETS.push(`${url}/EN/${index + 1}/${imgg}.png`);
  }
}

ASSETS.push(`${url}/AR/0.png`);
ASSETS.push(`${url}/EN/0.png`);

self.addEventListener("install", (event) => {
  console.log({ version });
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    // await cache.addAll(ASSETS);
    await addToCache(ASSETS);
  }
  // console.log("service worker ", ASSETS);
  event.waitUntil(addFilesToCache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // ignore POST requests etc
  if (event.request.method !== "GET") return;
  // console.log("Ad ", event.request.url);
  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache

    if (
      url.origin === "https://fra1.digitaloceanspaces.com" &&
      url.pathname.startsWith("/ekaterra-test")
    ) {
      const response = await cache.match(url);

      if (response) {
        //      console.log("DO Image from cache ", response);
        return response;
      }

      try {
        const response = await fetch(event.request);

        // if we're offline, fetch can return a value that is not a Response
        // instead of throwing - and we can't pass this non-Response to respondWith
        if (!(response instanceof Response)) {
          throw new Error("invalid response from fetch");
        }

        if (response.status === 200) {
          cache.put(event.request, response.clone());
          //   console.log("DO Image Added ", cache);
        }

        return response;
      } catch (err) {
        const response = await cache.match(event.request);

        if (response) {
          return response;
        }

        // if there's no cache, then just error out
        // as there is nothing we can do to respond to this request
        throw err;
      }
    } else {
      if (ASSETS.includes(url.pathname)) {
        const response = await cache.match(url.pathname);

        if (response) {
          return response;
        }
      }
      // for everything else, try the network first, but
      // fall back to the cache if we're offline
      try {
        const response = await fetch(event.request);

        // if we're offline, fetch can return a value that is not a Response
        // instead of throwing - and we can't pass this non-Response to respondWith
        if (!(response instanceof Response)) {
          throw new Error("invalid response from fetch");
        }

        if (response.status === 200) {
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (err) {
        const response = await cache.match(event.request);

        if (response) {
          return response;
        }

        // if there's no cache, then just error out
        // as there is nothing we can do to respond to this request
        throw err;
      }
    }
  }

  event.respondWith(respond());
});

async function addToCache(urls) {
  return new Promise(async (resolve, reject) => {
    const total = urls.length;
    let completed = 0;
    const cache = await caches.open(CACHE);

    const trackProgress = () => {
      completed++;
      const progress = (completed / total) * 100;
      //console.log(`Progress: ${progress.toFixed(2)}%`);

      self.clients
        .matchAll({ includeUncontrolled: true, type: "window" })
        .then((clients) => {
          //console.log({ clients });
          clients.forEach((client) => {
            client.postMessage({
              type: "progress",
              progress: progress.toFixed(2),
            });
          });
        });
    };

    const errorHandler = (error) => {
      console.error("Cache add error:", error);
      reject(error);
    };

    const successHandler = () => {
      console.log("All items added to cache successfully.");
      resolve();
    };

    const cachePromises = urls.map((url) =>
      fetch(url).then((response) => {
        trackProgress();
        return cache.put(url, response);
      })
    );

    caches
      .open(CACHE)
      .then(() => Promise.all(cachePromises))
      .then(successHandler)
      .catch(errorHandler);
  });
}

function dispatchProgress({ client, loaded, total }) {
  client.postMessage({ loaded, total });
}
