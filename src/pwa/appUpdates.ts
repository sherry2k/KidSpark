/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from 'virtual:pwa-register';

/**
 * appUpdates.ts — makes the app actually update on testers' phones.
 *
 * WHY THEY WERE STUCK ON THE OLD VERSION
 *
 * `vite-plugin-pwa` defaults to `registerType: 'prompt'`. In that mode a new
 * service worker downloads and installs, then sits in the WAITING state and
 * refuses to take over until every tab controlled by the old worker is closed.
 *
 * On a phone — and especially on an installed PWA or a Play Store TWA — that
 * moment basically never comes. The app is suspended in the background rather
 * than closed, so the old worker keeps serving the old bundle for weeks. This
 * is exactly why uninstalling and reinstalling fixed it for your tester: that
 * is the only thing that reliably kills the old worker.
 *
 * WHAT THIS DOES
 *
 * With `registerType: 'autoUpdate'` in vite.config, the new worker calls
 * skipWaiting and clientsClaim, takes over immediately and reloads the page.
 * But a worker only gets *checked for* on navigation, or roughly once a day.
 * A TWA that stays resident for a week may not navigate at all — so this also
 * checks every minute while the app is visible, and whenever the app comes
 * back to the foreground. That's the difference between "updates eventually"
 * and "updates on the next launch".
 */

const CHECK_EVERY_MS = 60 * 1000;

export function startAppUpdates() {
  if (typeof window === 'undefined') return;

  registerSW({
    immediate: true,

    onRegisteredSW(swUrl, registration) {
      if (!registration) return;

      const check = async () => {
        // don't fight an install already in flight, or check while offline
        if (registration.installing) return;
        if ('onLine' in navigator && !navigator.onLine) return;

        try {
          /* Fetch the worker with cache: 'no-store'. Browsers will happily
             serve sw.js from the HTTP cache for up to 24 hours otherwise —
             which means the update check itself gets a stale answer, and the
             app stays stale for another day. The vercel.json in this bundle
             sets the matching no-cache headers server-side. */
          const res = await fetch(swUrl, {
            cache: 'no-store',
            headers: { 'cache-control': 'no-cache' },
          });
          if (res?.status === 200) await registration.update();
        } catch {
          /* offline or blocked — try again on the next tick */
        }
      };

      window.setInterval(check, CHECK_EVERY_MS);

      // the important one for an installed app: it resumes rather than reloads
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void check();
      });

      window.addEventListener('online', () => void check());

      void check();
    },

    onRegisterError(error) {
      // never let a service-worker problem break the app itself
      console.warn('[kidspark] service worker registration failed', error);
    },
  });
}

/**
 * Shows once after an update has been applied, so you can tell from a tester's
 * screenshot which build they're actually on.
 *
 * Set VITE_APP_VERSION in Vercel (or use the commit SHA) and this survives as a
 * one-line answer to "are you on the latest?".
 */
const VERSION_KEY = 'kidspark.version';

export function checkVersionChanged(): boolean {
  try {
    const current = import.meta.env.VITE_APP_VERSION || 'dev';
    const seen = localStorage.getItem(VERSION_KEY);
    if (seen !== current) {
      localStorage.setItem(VERSION_KEY, String(current));
      return seen !== null; // false on a first-ever install, true on a real update
    }
  } catch {
    /* storage blocked */
  }
  return false;
}

export const appVersion = (): string => String(import.meta.env.VITE_APP_VERSION || 'dev');
