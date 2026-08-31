/**
 * appUpdates.ts — makes the app notice a new version while it's already open.
 *
 * WHY THIS IS NEEDED EVEN THOUGH YOU ALREADY HAVE `registerType: 'autoUpdate'`
 *
 * autoUpdate controls what happens WHEN a new service worker is found: it
 * skips the waiting state and takes over. That part of your config was already
 * right.
 *
 * What it does not do is go looking. The browser only checks for a new service
 * worker on a NAVIGATION — a page load or reload — or roughly once every 24
 * hours. An installed PWA or a Play Store TWA is resumed from the background,
 * and resuming is not a navigation. So a tester who opens your app from the
 * home screen every day may go a very long time without the browser ever
 * asking whether a new version exists.
 *
 * This closes that gap: it checks every minute while the app is on screen, and
 * again every time the app comes back to the foreground.
 *
 * Deliberately written with no imports. It does not touch registration — your
 * `injectRegister: 'auto'` keeps doing that — so if anything here fails, the
 * app is exactly as it was.
 */

const CHECK_EVERY_MS = 60 * 1000;

export function startAppUpdates() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  /* When the new worker takes control, reload once so the new bundle is what's
     running. The guard matters: `controllerchange` also fires the very first
     time a worker claims an uncontrolled page, and reloading there would mean
     every brand-new visitor loads the app twice. */
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;
    reloading = true;
    window.location.reload();
  });

  navigator.serviceWorker.ready
    .then((registration) => {
      const check = () => {
        if (registration.installing) return; // one already on the way
        if ('onLine' in navigator && !navigator.onLine) return;
        registration.update().catch(() => {
          /* offline or a bad response — we'll try again on the next tick */
        });
      };

      window.setInterval(check, CHECK_EVERY_MS);

      // the one that matters for an installed app: resuming isn't a navigation
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });

      window.addEventListener('online', check);

      check();
    })
    .catch(() => {
      /* no service worker on this device — nothing to keep fresh */
    });
}

/* ------------------------------------------------------------------ */
/* Version stamp — so a tester's screenshot tells you which build      */
/* ------------------------------------------------------------------ */

const VERSION_KEY = 'kidspark.version';

export const appVersion = (): string =>
  String((import.meta as { env?: Record<string, string> }).env?.VITE_APP_VERSION || 'dev');

/** True only when the version changed on an existing install — not on a first run. */
export function checkVersionChanged(): boolean {
  try {
    const current = appVersion();
    const seen = localStorage.getItem(VERSION_KEY);
    if (seen !== current) {
      localStorage.setItem(VERSION_KEY, current);
      return seen !== null;
    }
  } catch {
    /* storage blocked */
  }
  return false;
}
