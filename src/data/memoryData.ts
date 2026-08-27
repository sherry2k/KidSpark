/**
 * memoryData.ts — content for all six memory games.
 *
 * ONE BUG FIXED AT THE SOURCE
 *
 * Your Alphabet category renders 🅰️ 🅱️ ©️ — that third glyph is the
 * COPYRIGHT SYMBOL, not the letter C. There is no "circled C" letter emoji, so
 * whatever built that list fell back to ©. A child learning their letters is
 * being shown © as C.
 *
 * Letters and numbers are `text` here, not emoji. They render as real
 * characters in the app font, which also means they're crisp, they scale, and
 * they can never fall back to something wrong.
 */

export interface MemItem {
  id: string;
  /** an emoji/asset key — OR use `text` for letters and numbers */
  icon?: string;
  text?: string;
  name: string;
}

export interface MemoryCategory {
  key: string;
  label: string;
  gradient: string;
  shadow: string;
  items: MemItem[];
}

const L = (ch: string) => ({ id: `l-${ch}`, text: ch, name: `the letter ${ch}` });
const N = (n: number) => ({ id: `n-${n}`, text: String(n), name: `the number ${n}` });

export const MEMORY_CATEGORIES: MemoryCategory[] = [
  {
    key: 'animals',
    label: 'Animals',
    gradient: 'from-green-500 to-emerald-500',
    shadow: '#047857',
    items: [
      { id: 'lion', icon: '🦁', name: 'a lion' },
      { id: 'ele', icon: '🐘', name: 'an elephant' },
      { id: 'monkey', icon: '🐵', name: 'a monkey' },
      { id: 'frog', icon: '🐸', name: 'a frog' },
      { id: 'panda', icon: '🐼', name: 'a panda' },
      { id: 'fox', icon: '🦊', name: 'a fox' },
      { id: 'owl', icon: '🦉', name: 'an owl' },
      { id: 'bee', icon: '🐝', name: 'a bee' },
    ],
  },
  {
    key: 'fruits',
    label: 'Fruits',
    gradient: 'from-red-500 to-pink-500',
    shadow: '#B91C1C',
    items: [
      { id: 'apple', icon: '🍎', name: 'an apple' },
      { id: 'banana', icon: '🍌', name: 'a banana' },
      { id: 'grapes', icon: '🍇', name: 'grapes' },
      { id: 'straw', icon: '🍓', name: 'a strawberry' },
      { id: 'melon', icon: '🍉', name: 'a watermelon' },
      { id: 'pear', icon: '🍐', name: 'a pear' },
      { id: 'cherry', icon: '🍒', name: 'cherries' },
      { id: 'kiwi', icon: '🥝', name: 'a kiwi' },
    ],
  },
  {
    key: 'letters',
    label: 'Letters',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: '#0369A1',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(L),
  },
  {
    key: 'numbers',
    label: 'Numbers',
    gradient: 'from-amber-400 to-orange-500',
    shadow: '#C2410C',
    items: [1, 2, 3, 4, 5, 6, 7, 8].map(N),
  },
  {
    key: 'vehicles',
    label: 'Vehicles',
    gradient: 'from-violet-500 to-purple-500',
    shadow: '#6D28D9',
    items: [
      { id: 'car', icon: '🚗', name: 'a car' },
      { id: 'bus', icon: '🚌', name: 'a bus' },
      { id: 'train', icon: '🚂', name: 'a train' },
      { id: 'plane', icon: '✈️', name: 'a plane' },
      { id: 'boat', icon: '⛵', name: 'a boat' },
      { id: 'rocket', icon: '🚀', name: 'a rocket' },
      { id: 'bike', icon: '🚲', name: 'a bike' },
      { id: 'tractor', icon: '🚜', name: 'a tractor' },
    ],
  },
  {
    key: 'nature',
    label: 'Nature',
    gradient: 'from-teal-400 to-emerald-500',
    shadow: '#0F766E',
    items: [
      { id: 'sun', icon: '☀️', name: 'the sun' },
      { id: 'moon', icon: '🌙', name: 'the moon' },
      { id: 'star', icon: '⭐', name: 'a star' },
      { id: 'tree', icon: '🌳', name: 'a tree' },
      { id: 'flower', icon: '🌻', name: 'a sunflower' },
      { id: 'rainbow', icon: '🌈', name: 'a rainbow' },
      { id: 'cloud', icon: '☁️', name: 'a cloud' },
      { id: 'leaf', icon: '🍀', name: 'a clover' },
    ],
  },
];

/** Board sizes. The old game was always six pairs for everyone. */
export const BOARD_SIZES = [
  { pairs: 2, cols: 2, label: '2×2', diff: 1 },
  { pairs: 6, cols: 4, label: '3×4', diff: 2 },
  { pairs: 8, cols: 4, label: '4×4', diff: 3 },
] as const;

/* ------------------------------------------------------------------ */
/* What's Missing? — Kim's Game                                        */
/* ------------------------------------------------------------------ */

export const MISSING_POOL: MemItem[] = [
  { id: 'ball', icon: '⚽', name: 'the football' },
  { id: 'cake', icon: '🎂', name: 'the cake' },
  { id: 'key', icon: '🔑', name: 'the key' },
  { id: 'hat', icon: '🎩', name: 'the hat' },
  { id: 'book', icon: '📕', name: 'the book' },
  { id: 'bell', icon: '🔔', name: 'the bell' },
  { id: 'gift', icon: '🎁', name: 'the present' },
  { id: 'shell', icon: '🐚', name: 'the shell' },
  { id: 'candle', icon: '🕯️', name: 'the candle' },
  { id: 'balloon', icon: '🎈', name: 'the balloon' },
  { id: 'umbrella', icon: '☂️', name: 'the umbrella' },
  { id: 'guitar', icon: '🎸', name: 'the guitar' },
];

/* ------------------------------------------------------------------ */
/* Odd One Out                                                         */
/* ------------------------------------------------------------------ */

export interface OddSet {
  same: MemItem;
  odd: MemItem;
}

export const ODD_SETS: OddSet[] = [
  { same: { id: 'cat', icon: '🐱', name: 'a cat' }, odd: { id: 'dog', icon: '🐶', name: 'a dog' } },
  { same: { id: 'apple', icon: '🍎', name: 'an apple' }, odd: { id: 'pear', icon: '🍐', name: 'a pear' } },
  { same: { id: 'star', icon: '⭐', name: 'a star' }, odd: { id: 'sparkle', icon: '✨', name: 'a sparkle' } },
  { same: { id: 'car', icon: '🚗', name: 'a car' }, odd: { id: 'taxi', icon: '🚕', name: 'a taxi' } },
  { same: { id: 'sun', icon: '☀️', name: 'the sun' }, odd: { id: 'moon', icon: '🌙', name: 'the moon' } },
  { same: { id: 'fish', icon: '🐟', name: 'a fish' }, odd: { id: 'octo', icon: '🐙', name: 'an octopus' } },
  { same: { id: 'red', icon: '🔴', name: 'a red circle' }, odd: { id: 'blue', icon: '🔵', name: 'a blue circle' } },
  { same: { id: 'tree', icon: '🌳', name: 'a tree' }, odd: { id: 'pine', icon: '🌲', name: 'a pine tree' } },
  { same: { id: 'heart', icon: '❤️', name: 'a red heart' }, odd: { id: 'bheart', icon: '💙', name: 'a blue heart' } },
  { same: { id: 'ball', icon: '⚽', name: 'a football' }, odd: { id: 'basket', icon: '🏀', name: 'a basketball' } },
];

/* ------------------------------------------------------------------ */
/* Where Did It Go? — cup shuffle                                      */
/* ------------------------------------------------------------------ */

export const HIDDEN_TREASURES = ['⭐', '🍓', '🐞', '💎', '🍬', '🐥'];

/* ------------------------------------------------------------------ */
/* Quick Tap                                                           */
/* ------------------------------------------------------------------ */

export const TAP_TARGET = '⭐';
export const TAP_DECOYS = ['🎈', '🎨', '🎁', '🎯', '🔔', '🍬', '🌸', '🐞'];

/* ------------------------------------------------------------------ */

export const COLOR_PADS = [
  { color: '#E5383B', bright: '#FF7A7C', name: 'red' },
  { color: '#2C7BE5', bright: '#7FB2FF', name: 'blue' },
  { color: '#3FA34D', bright: '#7FDA8C', name: 'green' },
  { color: '#F0A017', bright: '#FFD066', name: 'yellow' },
];
