/**
 * skillProgress.ts
 *
 * Fixes a real bug first: `completedSkills` in SkillsScreen is plain
 * useState, so every completed activity is forgotten the moment the page
 * reloads. On a web app that means a tester closes the tab and comes back to
 * zero — which is exactly the kind of thing that shows up as "low
 * engagement". This persists it.
 *
 * It also tracks which unlocks the child has already been shown, so the
 * "New! The Workshop is open!" celebration fires once, not every launch.
 */

import { unlockedAt } from '../data/categoryTiers';

const DONE_KEY = 'kidspark.completedSkills.v1';
const SEEN_KEY = 'kidspark.seenUnlocks.v1';

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage blocked (private mode) — the session still works */
  }
}

/* ------------------------------------------------------------------ */
/* Completed skills                                                    */
/* ------------------------------------------------------------------ */

export function getCompletedSkills(): string[] {
  return readList(DONE_KEY);
}

export function completedCount(): number {
  return readList(DONE_KEY).length;
}

/** Returns the full list after adding. Safe to call twice for the same id. */
export function markSkillComplete(skillId: string): string[] {
  const list = readList(DONE_KEY);
  if (list.includes(skillId)) return list;
  const next = [...list, skillId];
  writeList(DONE_KEY, next);
  return next;
}

/** For a "start over" button in settings. */
export function resetProgress() {
  writeList(DONE_KEY, []);
  writeList(SEEN_KEY, []);
}

/* ------------------------------------------------------------------ */
/* Unlock celebrations                                                 */
/* ------------------------------------------------------------------ */

/**
 * Categories that just became playable and haven't been celebrated yet.
 * Call on mount of the category screen; celebrate, then acknowledge.
 */
export function getUnseenUnlocks(count = completedCount()): string[] {
  const open = unlockedAt(count);
  const seen = readList(SEEN_KEY);
  return open.filter((id) => !seen.includes(id));
}

export function acknowledgeUnlock(categoryId: string) {
  const seen = readList(SEEN_KEY);
  if (!seen.includes(categoryId)) writeList(SEEN_KEY, [...seen, categoryId]);
}

/**
 * Mark everything currently open as already seen. Call this ONCE for an
 * existing player so they aren't shown four unlock popups in a row on the
 * first launch after you ship this.
 */
export function primeSeenUnlocks() {
  const open = unlockedAt(completedCount());
  const seen = readList(SEEN_KEY);
  writeList(SEEN_KEY, Array.from(new Set([...seen, ...open])));
}

const PRIMED_KEY = 'kidspark.primed.v1';

/**
 * Call this on mount of the Skills screen. It primes ONCE, ever — so an
 * existing player doesn't get three unlock popups the first time you ship
 * this, but a genuine unlock later in the session still celebrates.
 */
export function primeSeenUnlocksOnce() {
  try {
    if (localStorage.getItem(PRIMED_KEY)) return;
    primeSeenUnlocks();
    localStorage.setItem(PRIMED_KEY, '1');
  } catch {
    /* storage blocked — celebrations may repeat, nothing breaks */
  }
}
