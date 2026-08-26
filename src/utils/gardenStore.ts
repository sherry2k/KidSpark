/**
 * gardenStore.ts — the only mechanic that needs tomorrow.
 *
 * A plant advances a stage when TWO things are true: it has been watered
 * since the last stage, and enough real time has passed. That means a child
 * cannot rush it in one sitting, and every return visit has something new —
 * which is the behaviour Google's closed test is actually measuring.
 *
 * Default gap is 2 hours, so a seed planted in the morning is a sprout by
 * lunch and ready to pick by evening: two or three natural return visits a
 * day without ever feeling like a wait.
 *
 * TESTING: run `localStorage.setItem('kidspark.fastGrow','1')` in the
 * console and the gap drops to 15 seconds so you can walk the whole loop.
 */

const KEY = 'kidspark.garden.v1';
const FAST_KEY = 'kidspark.fastGrow';

export const PLOT_COUNT = 6;
const NORMAL_GAP_MS = 2 * 60 * 60 * 1000;
const FAST_GAP_MS = 15 * 1000;

export function growthGapMs(): number {
  try {
    return localStorage.getItem(FAST_KEY) === '1' ? FAST_GAP_MS : NORMAL_GAP_MS;
  } catch {
    return NORMAL_GAP_MS;
  }
}

/** 0 seed · 1 sprout · 2 growing · 3 ready to pick */
export type GrowthStage = 0 | 1 | 2 | 3;
export const READY: GrowthStage = 3;

export interface Plot {
  index: number;
  seedId: string | null;
  stage: GrowthStage;
  /** when the current stage started */
  stageSince: number;
  wateredThisStage: boolean;
  /** lifetime count, shown as a small stat */
  harvested: number;
}

const emptyPlot = (index: number): Plot => ({
  index,
  seedId: null,
  stage: 0,
  stageSince: 0,
  wateredThisStage: false,
  harvested: 0,
});

function read(): Plot[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return Array.from({ length: PLOT_COUNT }, (_, i) => emptyPlot(i));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('bad');
    return Array.from({ length: PLOT_COUNT }, (_, i) => ({ ...emptyPlot(i), ...(parsed[i] || {}), index: i }));
  } catch {
    return Array.from({ length: PLOT_COUNT }, (_, i) => emptyPlot(i));
  }
}

function write(plots: Plot[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(plots));
  } catch {
    /* storage blocked — the garden just won't persist */
  }
}

/**
 * Advance any plot whose time has come. Call this on every load — that's how
 * the child finds the garden changed since last time.
 */
export function settleGarden(now = Date.now()): { plots: Plot[]; grewCount: number } {
  const gap = growthGapMs();
  let grew = 0;

  const plots = read().map((p) => {
    if (!p.seedId || p.stage >= READY) return p;
    if (p.wateredThisStage && now - p.stageSince >= gap) {
      grew++;
      return {
        ...p,
        stage: Math.min(READY, p.stage + 1) as GrowthStage,
        stageSince: now,
        wateredThisStage: false,
      };
    }
    return p;
  });

  write(plots);
  return { plots, grewCount: grew };
}

export const getPlots = (): Plot[] => settleGarden().plots;

export function plantSeed(index: number, seedId: string): Plot[] {
  const plots = read().map((p) =>
    p.index === index && !p.seedId
      ? { ...p, seedId, stage: 0 as GrowthStage, stageSince: Date.now(), wateredThisStage: false }
      : p
  );
  write(plots);
  return plots;
}

export function waterPlot(index: number): Plot[] {
  const plots = read().map((p) =>
    p.index === index && p.seedId && p.stage < READY ? { ...p, wateredThisStage: true } : p
  );
  write(plots);
  return plots;
}

export function harvestPlot(index: number): Plot[] {
  const plots = read().map((p) =>
    p.index === index && p.stage >= READY
      ? { ...emptyPlot(p.index), harvested: p.harvested + 1 }
      : p
  );
  write(plots);
  return plots;
}

/** How long until this plot could next advance. null = watering needed first. */
export function timeUntilGrow(p: Plot, now = Date.now()): number | null {
  if (!p.seedId || p.stage >= READY) return null;
  if (!p.wateredThisStage) return null;
  return Math.max(0, p.stageSince + growthGapMs() - now);
}

/** "in about 2 hours" — spoken and shown, never a raw countdown. */
export function friendlyWait(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins <= 1) return 'any second now';
  if (mins < 60) return `in about ${mins} minutes`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? 'in about an hour' : `in about ${hrs} hours`;
}

export const totalHarvested = (): number => read().reduce((n, p) => n + p.harvested, 0);
