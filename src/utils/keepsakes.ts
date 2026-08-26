/**
 * keepsakes.ts — "My Stuff" (v2)
 *
 * v2 adds drawings and dress-up looks alongside decorated food. Old v1
 * records still load: anything without a `kind` is treated as 'decorated'.
 */

export interface Sticker {
  icon: string;
  /** percentage position within the item, 0-100 */
  x: number;
  y: number;
  rot: number;
  scale: number;
}

export interface Stroke {
  color: string;
  width: number;
  /** points as percentages of the canvas, so it re-renders at any size */
  pts: { x: number; y: number }[];
}

export interface Layer {
  slot: string;
  icon: string;
  /** vertical placement as a percentage — lets a hat sit above a dress */
  y: number;
  size: number;
}

export type KeepsakeKind = 'decorated' | 'drawing' | 'dress' | 'garden';

export interface Keepsake {
  id: string;
  skillId: string;
  categoryId: string;
  title: string;
  kind: KeepsakeKind;
  /** base emoji/asset key, e.g. '🎂' or the character for a dress-up */
  base: string;
  /** frosting / background colour */
  color: string;
  stickers: Sticker[];
  strokes?: Stroke[];
  layers?: Layer[];
  madeAt: number;
}

export type KeepsakeInput = Omit<Keepsake, 'id' | 'madeAt' | 'kind'> & {
  kind?: KeepsakeKind;
};

const KEY = 'kidspark.keepsakes.v1';
const MAX = 60;

function readAll(): Keepsake[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Keepsake[]).map((k) => ({
      ...k,
      kind: k.kind || 'decorated',
      stickers: k.stickers || [],
    }));
  } catch {
    return [];
  }
}

function writeAll(list: Keepsake[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* storage full or blocked */
  }
}

export function saveKeepsake(k: KeepsakeInput): Keepsake {
  const full: Keepsake = {
    ...k,
    kind: k.kind || 'decorated',
    stickers: k.stickers || [],
    id: `${k.skillId}-${Date.now().toString(36)}`,
    madeAt: Date.now(),
  };
  writeAll([full, ...readAll()]);
  return full;
}

export const getKeepsakes = (): Keepsake[] => readAll();

export const getKeepsakesFor = (categoryId: string): Keepsake[] =>
  readAll().filter((k) => k.categoryId === categoryId);

export const deleteKeepsake = (id: string) => writeAll(readAll().filter((k) => k.id !== id));

export const keepsakeCount = (): number => readAll().length;
