/**
 * keepsakes.ts — "My Stuff".
 *
 * The single biggest reason a kid reopens an app is that something they made
 * is still in there. Every finished activity saves a keepsake; the shelf shows
 * them all; a "Show a grown-up" button makes one full screen.
 *
 * Stored as data (not a screenshot) so it re-renders crisply at any size and
 * costs a few hundred bytes.
 */

export interface Sticker {
  icon: string;
  /** percentage position within the item, 0-100 */
  x: number;
  y: number;
  rot: number;
  scale: number;
}

export interface Keepsake {
  id: string;
  /** skill id it came from, e.g. 'baking' */
  skillId: string;
  /** category id, e.g. 'cooking' */
  categoryId: string;
  title: string;
  /** the base emoji/asset key, e.g. '🎂' */
  base: string;
  /** frosting / sauce colour chosen by the child */
  color: string;
  stickers: Sticker[];
  /** epoch ms */
  madeAt: number;
}

const KEY = 'kidspark.keepsakes.v1';
const MAX = 60; // keep the newest 60; plenty, and bounded storage

function readAll(): Keepsake[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Keepsake[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Keepsake[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* storage full or blocked — the session still works, it just won't persist */
  }
}

export function saveKeepsake(k: Omit<Keepsake, 'id' | 'madeAt'>): Keepsake {
  const full: Keepsake = {
    ...k,
    id: `${k.skillId}-${Date.now().toString(36)}`,
    madeAt: Date.now(),
  };
  writeAll([full, ...readAll()]);
  return full;
}

export function getKeepsakes(): Keepsake[] {
  return readAll();
}

export function getKeepsakesFor(categoryId: string): Keepsake[] {
  return readAll().filter((k) => k.categoryId === categoryId);
}

export function deleteKeepsake(id: string) {
  writeAll(readAll().filter((k) => k.id !== id));
}

export function keepsakeCount(): number {
  return readAll().length;
}
