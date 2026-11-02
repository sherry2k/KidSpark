// src/utils/difficulty.ts
// One place that turns the child's saved difficulty ('easy' | 'medium' | 'hard',
// set from the age on the profile screen: 3-5 easy, 6 medium, 7-10 hard)
// into the settings each game needs.

export type Level = 'easy' | 'medium' | 'hard';

export const levelOf = (d?: string): Level => (d === 'easy' ? 'easy' : d === 'hard' ? 'hard' : 'medium');

/** Words: easy = 3-4 letters, medium = 4-5 letters, hard = 5+ letters. Falls back to all words if too few. */
export function wordsForLevel<T extends { word: string }>(list: readonly T[], d?: string, min = 8): T[] {
  const L = levelOf(d);
  const [lo, hi] = L === 'easy' ? [3, 4] : L === 'medium' ? [4, 5] : [5, 99];
  const picked = list.filter((w) => w.word.length >= lo && w.word.length <= hi);
  return picked.length >= min ? picked : [...list];
}

/** Jigsaw starting grid: 2x2 easy, 3x3 medium, 4x4 hard (the child can still change it). */
export const jigsawGridFor = (d?: string): 2 | 3 | 4 => {
  const L = levelOf(d);
  return L === 'easy' ? 2 : L === 'hard' ? 4 : 3;
};

/** Memory Match starting board (index in BOARD_SIZES): 0 = 2x2, 1 = 3x4, 2 = 4x4. */
export const memorySizeFor = (d?: string): number => {
  const L = levelOf(d);
  return L === 'easy' ? 0 : L === 'hard' ? 2 : 1;
};

/** Pattern levels: easy = ABAB / AAB / ABB, hard = ABC / AABB, medium = everything. */
export function patternsForLevel<T extends { kind: string }>(list: readonly T[], d?: string, min = 6): T[] {
  const L = levelOf(d);
  if (L === 'medium') return [...list];
  const kinds = L === 'easy' ? ['ABAB', 'AAB', 'ABB'] : ['ABC', 'AABB'];
  const picked = list.filter((p) => kinds.includes(p.kind));
  return picked.length >= min ? picked : [...list];
}
