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
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,mp3,wav,woff,woff2,ttf}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      includeAssets: [
        "icons/*.png",
        "sounds/*.mp3",
        "image/*.png",
      ],
      manifest: {
        name: "KidSpark",
        short_name: "KidSpark",
        description: "A educational game for children aged 6-9. Learn letters, numbers, shapes, colors, animals and more through fun interactive games! Features quizzes, memory games, puzzles, coloring, math adventures, and real-world skills.",
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
            purpose: "any"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        screenshots: [
          {
            src: "/image/screenshot-1.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Home Screen"
          }
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
                type: "image/png"
              }
            ]
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
