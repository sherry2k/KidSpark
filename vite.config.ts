import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      workbox: {
        // ── CHANGED ──────────────────────────────────────────────────
        // mp3/wav removed from the PRECACHE list. They're cached at
        // runtime instead (see runtimeCaching below), so they still work
        // offline after first play — but they no longer have to download
        // in full before a new service worker is allowed to install.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf}"],

        // ── CHANGED ── 10MB was letting large audio into the precache
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,

        // ── ADDED ── delete precaches from previous builds.
        // Without this, every deploy leaves a full copy of the old app in
        // storage forever. On a cheap Android that fills the origin quota,
        // and once it's full the NEW service worker can't finish installing
        // — so the old one keeps serving. This is the most likely reason
        // your testers were frozen on an old build.
        cleanupOutdatedCaches: true,

        // ── ADDED ── autoUpdate normally implies these, but setting them
        // explicitly means the behaviour can't change under you on a
        // plugin upgrade.
        clientsClaim: true,
        skipWaiting: true,

        // ── ADDED ── every route serves the freshly precached index.html
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],

        // ── ADDED ──
        runtimeCaching: [
          {
            // sounds: fetched on demand, then kept
            urlPattern: /\/sounds\/.*\.(?:mp3|wav|ogg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "kidspark-sounds",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // ── CHANGED ── sounds removed; they're runtime-cached now
      includeAssets: ["icons/*.png"],

      manifest: {
        name: "KidSpark",
        short_name: "KidSpark",
        description:
          "A educational game for children aged 6-9. Learn letters, numbers, shapes, colors, animals and more through fun interactive games! Features quizzes, memory games, puzzles, coloring, math adventures, and real-world skills.",
        start_url: "/",
        id: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#a855f7",
        orientation: "portrait",
        scope: "/",
        lang: "en",
        dir: "ltr",
        categories: ["education", "kids", "games"],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        shortcuts: [
          {
            name: "Start Learning",
            short_name: "Learn",
            description: "Jump into learning mode",
            url: "/",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // ── ADDED ── stamps the build id so a tester's screenshot tells you
  // exactly which version they're running.
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
        new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")
    ),
  },
});
