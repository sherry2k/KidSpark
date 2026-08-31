/**
 * The VitePWA block to use in your vite.config.ts.
 *
 * Copy the `VitePWA({ ... })` call into your existing config — keep whatever
 * else you already have (react(), aliases, build options).
 *
 * THE ONE LINE THAT MATTERS
 *
 *   registerType: 'autoUpdate'
 *
 * The default is 'prompt', which installs a new service worker and then leaves
 * it WAITING until every tab under the old worker closes. On a phone that
 * moment never arrives, so testers keep getting the old bundle. That's the bug.
 */

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    // ...your existing plugins, e.g. react(),

    VitePWA({
      // take over immediately instead of waiting for every tab to close
      registerType: 'autoUpdate',

      // we register manually in main.tsx so we can add periodic checks
      injectRegister: null,

      /* Note: there is no plugin option for `updateViaCache`. The browser is
         stopped from serving a stale sw.js by the Cache-Control headers in
         vercel.json instead — that's the correct place for it. */

      workbox: {
        // the two that make an update apply straight away
        skipWaiting: true,
        clientsClaim: true,

        // delete caches from previous builds so storage doesn't grow forever
        cleanupOutdatedCaches: true,

        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],

        /* index.html must NEVER come from cache-first, or the app keeps
           booting the old bundle even after the new files are downloaded */
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          {
            // Google Fonts stylesheet — check the network, fall back to cache
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            // the font files themselves are immutable, cache them hard
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      manifest: {
        name: 'KidSpark - Learn & Play',
        short_name: 'KidSpark',
        theme_color: '#a855f7',
        background_color: '#F4F6FC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],

  define: {
    // stamp the build so a tester's screenshot tells you which version they're on
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
        new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
    ),
  },
});
