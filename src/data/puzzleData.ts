/**
 * puzzleData.ts — four puzzle games as data.
 *
 * The big addition is a real JIGSAW. "Puzzle" means jigsaw to a child and to a
 * parent reading your store listing, and there wasn't one. It costs no art
 * assets: the colouring pages are SVG, so a tile is just the same drawing with
 * a cropped viewBox — crisp at any size, on any device.
 */

import { COLORING_PAGES, ColoringPage } from './coloringPages';

/* ================================================================ */
/* JIGSAW                                                            */
/* ================================================================ */

export interface JigsawPicture {
  id: string;
  name: string;
  /** which colouring page to use as the picture */
  pageId: string;
  /** pre-coloured so the finished puzzle is worth looking at */
  fills: Record<string, string>;
}

export const JIGSAW_PICTURES: JigsawPicture[] = [
  {
    id: 'butterfly',
    name: 'Butterfly',
    pageId: 'butterfly',
    fills: { wingTL: '#7B2CBF', wingTR: '#7B2CBF', wingBL: '#FF6BA9', wingBR: '#FF6BA9', body: '#8B5A3C' },
  },
  {
    id: 'cat',
    name: 'Cat',
    pageId: 'cat',
    fills: { body: '#F0A017', head: '#FFD23F', earL: '#FF6BA9', earR: '#FF6BA9', eyeL: '#2C7BE5', eyeR: '#2C7BE5', nose: '#E5383B' },
  },
  {
    id: 'rocket',
    name: 'Rocket',
    pageId: 'rocket',
    fills: { body: '#E5383B', window: '#BDE0FE', finL: '#2C7BE5', finR: '#2C7BE5', flame: '#F0A017' },
  },
  {
    id: 'flower',
    name: 'Flower',
    pageId: 'flower',
    fills: { petal0: '#FF6BA9', petal1: '#FF6BA9', petal2: '#FF6BA9', petal3: '#FF6BA9', petal4: '#FF6BA9', petal5: '#FF6BA9', centre: '#FFD23F' },
  },
  {
    id: 'fish',
    name: 'Fish',
    pageId: 'fish',
    fills: { body: '#2CB5AF', tail: '#F0A017', finTop: '#F0A017', eye: '#FFFFFF' },
  },
  {
    id: 'house',
    name: 'House',
    pageId: 'house',
    fills: { wall: '#FFE5B4', roof: '#E5383B', door: '#8B5A3C', winL: '#BDE0FE', winR: '#BDE0FE', chimney: '#6B7280' },
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    pageId: 'rainbow',
    fills: { band0: '#E5383B', band1: '#F77F00', band2: '#FFD23F', band3: '#57CC5B', band4: '#2C7BE5', band5: '#7B2CBF' },
  },
  {
    id: 'cupcake',
    name: 'Cupcake',
    pageId: 'cupcake',
    fills: { case: '#8B5A3C', icingL: '#FF6BA9', icingR: '#FF6BA9', icingTop: '#FF6BA9', cherry: '#E5383B' },
  },
];

/** 2×2 for the youngest, 4×4 for the oldest — one dial, no settings screen. */
export const JIGSAW_GRIDS = [2, 3, 4] as const;
export type JigsawGrid = (typeof JIGSAW_GRIDS)[number];

export const pageFor = (pageId: string): ColoringPage | undefined =>
  COLORING_PAGES.find((p) => p.id === pageId);

/* ================================================================ */
/* SHADOW MATCH                                                      */
/* ================================================================ */

/**
 * The old "Shape Match" paired an emoji with the SAME emoji in greyscale, and
 * in one level paired 🐶 with 🐕 — two different dogs, so the "correct" answer
 * was arbitrary. These are real silhouettes: the identical SVG shape filled
 * solid black, which is a genuine visual puzzle.
 */
export interface ShadowRound {
  id: string;
  pages: { pageId: string; name: string; fills: Record<string, string> }[];
}

export const SHADOW_ROUNDS: ShadowRound[] = [
  {
    id: 'animals',
    pages: [
      { pageId: 'cat', name: 'cat', fills: { head: '#FFD23F', body: '#F0A017', earL: '#FF6BA9', earR: '#FF6BA9' } },
      { pageId: 'fish', name: 'fish', fills: { body: '#2CB5AF', tail: '#F0A017', finTop: '#F0A017' } },
      { pageId: 'butterfly', name: 'butterfly', fills: { wingTL: '#7B2CBF', wingTR: '#7B2CBF', wingBL: '#FF6BA9', wingBR: '#FF6BA9' } },
      { pageId: 'tree', name: 'tree', fills: { leaves1: '#57CC5B', leaves2: '#57CC5B', leaves3: '#3FA34D', trunk: '#8B5A3C' } },
    ],
  },
  {
    id: 'things',
    pages: [
      { pageId: 'house', name: 'house', fills: { wall: '#FFE5B4', roof: '#E5383B', door: '#8B5A3C' } },
      { pageId: 'rocket', name: 'rocket', fills: { body: '#E5383B', window: '#BDE0FE', flame: '#F0A017' } },
      { pageId: 'cupcake', name: 'cupcake', fills: { case: '#8B5A3C', icingTop: '#FF6BA9', cherry: '#E5383B' } },
      { pageId: 'star', name: 'star', fills: { star: '#FFD23F', inner: '#F0A017' } },
    ],
  },
  {
    id: 'nature',
    pages: [
      { pageId: 'flower', name: 'flower', fills: { petal0: '#FF6BA9', petal3: '#FF6BA9', centre: '#FFD23F' } },
      { pageId: 'sun', name: 'sun', fills: { face: '#FFD23F', ray0: '#F0A017', ray2: '#F0A017' } },
      { pageId: 'rainbow', name: 'rainbow', fills: { band0: '#E5383B', band3: '#57CC5B' } },
      { pageId: 'heart', name: 'heart', fills: { left: '#E5383B', right: '#E5383B' } },
    ],
  },
];

/* ================================================================ */
/* PATTERNS                                                          */
/* ================================================================ */

/**
 * The old pattern game was six levels of ABAB — the same puzzle six times, and
 * the answer sat in the same position every play because the options were a
 * fixed array. These progress through real pattern types, and the options are
 * shuffled at runtime.
 */
export type PatternKind = 'ABAB' | 'AAB' | 'ABC' | 'ABB' | 'AABB';

export interface PatternLevel {
  kind: PatternKind;
  seq: string[];
  answer: string;
  distractors: string[];
}

export const PATTERN_LEVELS: PatternLevel[] = [
  { kind: 'ABAB', seq: ['🔴', '🟡', '🔴', '🟡'], answer: '🔴', distractors: ['🟢', '🔵'] },
  { kind: 'ABAB', seq: ['⭐', '🌙', '⭐', '🌙'], answer: '⭐', distractors: ['☀️', '💫'] },
  { kind: 'ABAB', seq: ['🐱', '🐶', '🐱', '🐶'], answer: '🐱', distractors: ['🐰', '🦊'] },

  { kind: 'AAB', seq: ['🍎', '🍎', '🍌', '🍎', '🍎'], answer: '🍌', distractors: ['🍎', '🍇'] },
  { kind: 'AAB', seq: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', distractors: ['🔵', '🟡'] },

  { kind: 'ABB', seq: ['🌻', '🌷', '🌷', '🌻', '🌷'], answer: '🌷', distractors: ['🌻', '🌹'] },

  { kind: 'ABC', seq: ['🔺', '🔵', '🟨', '🔺', '🔵'], answer: '🟨', distractors: ['🔺', '🔵'] },
  { kind: 'ABC', seq: ['🐝', '🦋', '🐞', '🐝', '🦋'], answer: '🐞', distractors: ['🐝', '🐜'] },

  { kind: 'AABB', seq: ['🍊', '🍊', '🍇', '🍇', '🍊', '🍊'], answer: '🍇', distractors: ['🍊', '🍓'] },
  { kind: 'AABB', seq: ['☀️', '☀️', '🌧️', '🌧️', '☀️', '☀️'], answer: '🌧️', distractors: ['☀️', '⛅'] },

  { kind: 'ABC', seq: ['🚗', '🚌', '🚂', '🚗', '🚌'], answer: '🚂', distractors: ['🚗', '✈️'] },
  { kind: 'AABB', seq: ['💚', '💚', '💙', '💙', '💚', '💚'], answer: '💙', distractors: ['💚', '💜'] },
];

/** Human-readable hint, spoken when a child gets it wrong. */
export const patternHint = (kind: PatternKind): string => {
  switch (kind) {
    case 'ABAB':
      return 'Look — it goes one, then the other, then one again!';
    case 'AAB':
      return 'Look — two the same, then a different one!';
    case 'ABB':
      return 'Look — one, then two the same!';
    case 'ABC':
      return 'Look — three different ones, then it starts again!';
    case 'AABB':
      return 'Look — two the same, then two of another!';
  }
};

/* ================================================================ */
/* SIZE SORT                                                         */
/* ================================================================ */

export interface SizeItem {
  icon: string;
  name: string;
  /** 1 is smallest */
  rank: number;
}

export interface SizeRound {
  id: string;
  title: string;
  items: SizeItem[];
}

export const SIZE_ROUNDS: SizeRound[] = [
  {
    id: 'animals',
    title: 'Animals',
    items: [
      { icon: '🐭', name: 'a mouse', rank: 1 },
      { icon: '🐕', name: 'a dog', rank: 2 },
      { icon: '🦁', name: 'a lion', rank: 3 },
      { icon: '🐘', name: 'an elephant', rank: 4 },
    ],
  },
  {
    id: 'plants',
    title: 'Growing',
    items: [
      { icon: '🌱', name: 'a sprout', rank: 1 },
      { icon: '🌷', name: 'a flower', rank: 2 },
      { icon: '🌲', name: 'a pine tree', rank: 3 },
      { icon: '🌳', name: 'a big tree', rank: 4 },
    ],
  },
  {
    id: 'sea',
    title: 'In the Sea',
    items: [
      { icon: '🐠', name: 'a little fish', rank: 1 },
      { icon: '🐟', name: 'a fish', rank: 2 },
      { icon: '🐬', name: 'a dolphin', rank: 3 },
      { icon: '🐳', name: 'a whale', rank: 4 },
    ],
  },
  {
    id: 'travel',
    title: 'Getting Around',
    items: [
      { icon: '🛴', name: 'a scooter', rank: 1 },
      { icon: '🚲', name: 'a bike', rank: 2 },
      { icon: '🚗', name: 'a car', rank: 3 },
      { icon: '🚌', name: 'a bus', rank: 4 },
      { icon: '✈️', name: 'a plane', rank: 5 },
    ],
  },
];
