import {clientsClaim as workbox_core_clientsClaim} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-core/clientsClaim.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {registerRoute as workbox_routing_registerRoute} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-routing/registerRoute.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from 'C:/Users/goura/OneDrive/Desktop/New Projects/attendence maneger/frontend/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */




self.skipWaiting();
workbox_core_clientsClaim();
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  },
  {
    "url": "pwa-icon.svg",
    "revision": "27d4d6cc3626d2267c412e4990fde914"
  },
  {
    "url": "index.html",
    "revision": "a75a5292812cf026ab2b4e78a463b1f0"
  },
  {
    "url": "favicon.svg",
    "revision": "27d4d6cc3626d2267c412e4990fde914"
  },
  {
    "url": "assets/index-DwaGzUA2.css",
    "revision": null
  },
  {
    "url": "assets/index-Djeg6RbM.js",
    "revision": null
  },
  {
    "url": "favicon.svg",
    "revision": "27d4d6cc3626d2267c412e4990fde914"
  },
  {
    "url": "pwa-icon.svg",
    "revision": "27d4d6cc3626d2267c412e4990fde914"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "fa035260f7b7ec5d4952ded2b7fbae41"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("index.html")));


