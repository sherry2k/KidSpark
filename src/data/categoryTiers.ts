/**
 * categoryTiers.ts
 *
 * Which categories a child can see, and when.
 *
 * Eleven doors that all open onto the same room is worse than four good
 * rooms. This file decides what's open at launch, what opens as a goal, and
 * what's honestly labelled "coming soon".
 *
 * Nothing is deleted — every category still lives in gameData.ts. Change a
 * tier here and it reappears. This is the one file to edit as you rebuild
 * more categories: move it from 'soon' to 'unlockable' to 'launch'.
 */

export type Tier =
  /** playable immediately, rebuilt on the new mechanics */
  | 'launch'
  /** visible, locked, opens on a stated goal */
  | 'unlockable'
  /** visible, not playable, honestly labelled */
  | 'soon';

export interface CategoryTier {
  id: string;
  tier: Tier;
  /** unlockable only: completed activities required to open it */
  requires?: number;
  /** shown on the locked card — what they'll get to do */
  teaser: string;
}

/**
 * DISPLAY ORDER IS THIS ORDER. Launch four first, then the goals, then
 * the coming-soon row.
 */
export const CATEGORY_TIERS: CategoryTier[] = [
  /* ---- open at launch: rebuilt, deep, no lock ------------------- */
  { id: 'cooking', tier: 'launch', teaser: 'Cook, bake and decorate!' },
  { id: 'beauty', tier: 'launch', teaser: 'Style, dress up and design!' },
  { id: 'art', tier: 'launch', teaser: 'Mix colours and make art!' },
  { id: 'garden', tier: 'launch', teaser: 'Plant it today, watch it grow!' },

  /* ---- open as a goal: first one lands inside session one ------- */
  { id: 'builder', tier: 'unlockable', requires: 3, teaser: 'Hammer, saw and build a birdhouse!' },
  { id: 'garage', tier: 'unlockable', requires: 6, teaser: 'Fix cars and paint them your way!' },
  { id: 'medical', tier: 'unlockable', requires: 9, teaser: 'Help patients feel better!' },

  /* ---- coming soon: honest, not broken -------------------------- */
  { id: 'engineer', tier: 'soon', teaser: 'Build bridges that really hold!' },
  { id: 'coding', tier: 'soon', teaser: 'Tell a robot where to go!' },
  { id: 'science', tier: 'soon', teaser: 'Mix potions and make a volcano!' },
  { id: 'factory', tier: 'soon', teaser: 'Run your very own factory!' },
];

/** Friendly names used in unlock messages — keep in sync with gameData. */
export const CATEGORY_SHORT_NAME: Record<string, string> = {
  cooking: 'Cooking Studio',
  beauty: 'Beauty Studio',
  art: 'Art Studio',
  garden: 'Garden',
  builder: 'Workshop',
  garage: 'Garage',
  medical: 'Clinic',
  engineer: 'Engineering Lab',
  coding: 'Robot Lab',
  science: 'Science Lab',
  factory: 'Factory',
};

/** Your per-category drop-shadow colours, defined once instead of three times. */
export const CATEGORY_SHADOWS: Record<string, string> = {
  cooking: '#C2410C',
  beauty: '#BE185D',
  builder: '#B45309',
  engineer: '#1E40AF',
  factory: '#374151',
  garage: '#B91C1C',
  garden: '#047857',
  medical: '#0F766E',
  art: '#7B2CBF',
  coding: '#0F766E',
  science: '#6D28D9',
};

export const shadowFor = (id: string) => CATEGORY_SHADOWS[id] || '#374151';

export const tierFor = (id: string): CategoryTier =>
  CATEGORY_TIERS.find((t) => t.id === id) || { id, tier: 'soon', teaser: 'Coming soon!' };

export interface CategoryState {
  tier: Tier;
  /** can it be played right now? */
  playable: boolean;
  /** unlockable only */
  requires: number;
  remaining: number;
  /** 0-1 toward unlocking */
  progress: number;
  teaser: string;
}

export function getCategoryState(id: string, completedCount: number): CategoryState {
  const t = tierFor(id);

  if (t.tier === 'launch') {
    return { tier: 'launch', playable: true, requires: 0, remaining: 0, progress: 1, teaser: t.teaser };
  }

  if (t.tier === 'unlockable') {
    const requires = t.requires ?? 3;
    const open = completedCount >= requires;
    return {
      tier: 'unlockable',
      playable: open,
      requires,
      remaining: Math.max(0, requires - completedCount),
      progress: Math.min(1, completedCount / requires),
      teaser: t.teaser,
    };
  }

  return { tier: 'soon', playable: false, requires: 0, remaining: 0, progress: 0, teaser: t.teaser };
}

/** Categories in display order, whatever order gameData happens to use. */
export function orderCategories<T extends { id: string }>(cats: T[]): T[] {
  const rank = new Map(CATEGORY_TIERS.map((t, i) => [t.id, i]));
  return [...cats].sort((a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99));
}

/** Every unlockable category open at this count — used to spot new unlocks. */
export function unlockedAt(completedCount: number): string[] {
  return CATEGORY_TIERS.filter(
    (t) => t.tier === 'unlockable' && completedCount >= (t.requires ?? 3)
  ).map((t) => t.id);
}

/** The next goal to dangle, or null when they're all open. */
export function nextUnlock(completedCount: number): { id: string; remaining: number } | null {
  const next = CATEGORY_TIERS.filter((t) => t.tier === 'unlockable')
    .sort((a, b) => (a.requires ?? 0) - (b.requires ?? 0))
    .find((t) => completedCount < (t.requires ?? 3));
  return next ? { id: next.id, remaining: (next.requires ?? 3) - completedCount } : null;
}
