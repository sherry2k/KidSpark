/**
 * matchPacks.ts — Match, as eight sorting games instead of one.
 *
 * The old Match had exactly one set of items (fruit / vegetable / animal /
 * vehicle), and "Again" didn't even reshuffle them, so the second play was
 * identical to the first. A child finished it once and never went back.
 *
 * Bin count doubles as the difficulty dial: two bins for the youngest, four
 * for the oldest, no separate settings needed.
 */

export interface Bin {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface MatchItem {
  icon: string;
  name: string;
  bin: string;
}

export interface MatchPack {
  id: string;
  title: string;
  /** spoken at the start — the actual question the child is answering */
  question: string;
  icon: string;
  bins: Bin[];
  items: MatchItem[];
  /** one line for the parent on the end card */
  learned: string;
}

export const MATCH_PACKS: MatchPack[] = [
  {
    id: 'food-friends',
    title: 'Sort it Out',
    question: 'Where does each one belong?',
    icon: '🎯',
    learned: 'Grouping by kind · naming everyday things',
    bins: [
      { id: 'fruit', label: 'Fruit', icon: '🍎', color: '#E5383B' },
      { id: 'veg', label: 'Vegetables', icon: '🥕', color: '#57CC5B' },
      { id: 'animal', label: 'Animals', icon: '🦁', color: '#F0A017' },
      { id: 'vehicle', label: 'Vehicles', icon: '🚗', color: '#2C7BE5' },
    ],
    items: [
      { icon: '🍎', name: 'an apple', bin: 'fruit' },
      { icon: '🍌', name: 'a banana', bin: 'fruit' },
      { icon: '🍇', name: 'grapes', bin: 'fruit' },
      { icon: '🥕', name: 'a carrot', bin: 'veg' },
      { icon: '🌽', name: 'corn', bin: 'veg' },
      { icon: '🥦', name: 'broccoli', bin: 'veg' },
      { icon: '🦁', name: 'a lion', bin: 'animal' },
      { icon: '🐘', name: 'an elephant', bin: 'animal' },
      { icon: '🐵', name: 'a monkey', bin: 'animal' },
      { icon: '🚂', name: 'a train', bin: 'vehicle' },
      { icon: '🚌', name: 'a bus', bin: 'vehicle' },
      { icon: '🚗', name: 'a car', bin: 'vehicle' },
    ],
  },

  {
    id: 'daynight',
    title: 'Day or Night?',
    question: 'Do you see it in the day, or at night?',
    icon: '🌗',
    learned: 'Day and night · noticing patterns in the world',
    bins: [
      { id: 'day', label: 'Daytime', icon: '☀️', color: '#F0A017' },
      { id: 'night', label: 'Night-time', icon: '🌙', color: '#4C4A8F' },
    ],
    items: [
      { icon: '☀️', name: 'the sun', bin: 'day' },
      { icon: '🌈', name: 'a rainbow', bin: 'day' },
      { icon: '🦋', name: 'a butterfly', bin: 'day' },
      { icon: '🐝', name: 'a bee', bin: 'day' },
      { icon: '🏖️', name: 'the beach', bin: 'day' },
      { icon: '⭐', name: 'a star', bin: 'night' },
      { icon: '🦉', name: 'an owl', bin: 'night' },
      { icon: '🌙', name: 'the moon', bin: 'night' },
      { icon: '🦇', name: 'a bat', bin: 'night' },
      { icon: '🛏️', name: 'a bed', bin: 'night' },
    ],
  },

  {
    id: 'bigsmall',
    title: 'Big or Small?',
    question: 'Is it big, or is it small?',
    icon: '📏',
    learned: 'Comparing size · big and small · sorting by one property',
    bins: [
      { id: 'big', label: 'Big', icon: '🐘', color: '#7B2CBF' },
      { id: 'small', label: 'Small', icon: '🐜', color: '#FF6BA9' },
    ],
    items: [
      { icon: '🐘', name: 'an elephant', bin: 'big' },
      { icon: '🐋', name: 'a whale', bin: 'big' },
      { icon: '🚌', name: 'a bus', bin: 'big' },
      { icon: '🏔️', name: 'a mountain', bin: 'big' },
      { icon: '🦒', name: 'a giraffe', bin: 'big' },
      { icon: '🐜', name: 'an ant', bin: 'small' },
      { icon: '🐞', name: 'a ladybird', bin: 'small' },
      { icon: '🔑', name: 'a key', bin: 'small' },
      { icon: '🫐', name: 'a blueberry', bin: 'small' },
      { icon: '🐁', name: 'a mouse', bin: 'small' },
    ],
  },

  {
    id: 'hotcold',
    title: 'Hot or Cold?',
    question: 'Is it hot, or is it cold?',
    icon: '🌡️',
    learned: 'Hot and cold · everyday safety · opposites',
    bins: [
      { id: 'hot', label: 'Hot', icon: '🔥', color: '#F0522B' },
      { id: 'cold', label: 'Cold', icon: '❄️', color: '#2CB5AF' },
    ],
    items: [
      { icon: '🔥', name: 'a fire', bin: 'hot' },
      { icon: '☕', name: 'a hot drink', bin: 'hot' },
      { icon: '🌋', name: 'a volcano', bin: 'hot' },
      { icon: '🍲', name: 'hot soup', bin: 'hot' },
      { icon: '🏜️', name: 'the desert', bin: 'hot' },
      { icon: '❄️', name: 'a snowflake', bin: 'cold' },
      { icon: '🍦', name: 'ice cream', bin: 'cold' },
      { icon: '⛄', name: 'a snowman', bin: 'cold' },
      { icon: '🧊', name: 'an ice cube', bin: 'cold' },
      { icon: '🐧', name: 'a penguin', bin: 'cold' },
    ],
  },

  {
    id: 'home',
    title: 'Where Do They Live?',
    question: 'Land, water, or sky?',
    icon: '🏞️',
    learned: 'Animal habitats · land, water and sky · early science',
    bins: [
      { id: 'land', label: 'On land', icon: '🌳', color: '#57CC5B' },
      { id: 'water', label: 'In water', icon: '🌊', color: '#2C7BE5' },
      { id: 'sky', label: 'In the sky', icon: '☁️', color: '#7EC8F0' },
    ],
    items: [
      { icon: '🦁', name: 'a lion', bin: 'land' },
      { icon: '🐘', name: 'an elephant', bin: 'land' },
      { icon: '🐄', name: 'a cow', bin: 'land' },
      { icon: '🐰', name: 'a rabbit', bin: 'land' },
      { icon: '🐟', name: 'a fish', bin: 'water' },
      { icon: '🐙', name: 'an octopus', bin: 'water' },
      { icon: '🦈', name: 'a shark', bin: 'water' },
      { icon: '🐬', name: 'a dolphin', bin: 'water' },
      { icon: '🦅', name: 'an eagle', bin: 'sky' },
      { icon: '🦋', name: 'a butterfly', bin: 'sky' },
      { icon: '🐝', name: 'a bee', bin: 'sky' },
      { icon: '🦜', name: 'a parrot', bin: 'sky' },
    ],
  },

  {
    id: 'recycle',
    title: 'Tidy Up Time',
    question: 'Which bin does it go in?',
    icon: '♻️',
    learned: 'Recycling · looking after the planet · sorting by material',
    bins: [
      { id: 'recycle', label: 'Recycling', icon: '♻️', color: '#2C7BE5' },
      { id: 'food', label: 'Food waste', icon: '🌱', color: '#57CC5B' },
      { id: 'bin', label: 'Rubbish', icon: '🗑️', color: '#6B7280' },
    ],
    items: [
      { icon: '📰', name: 'a newspaper', bin: 'recycle' },
      { icon: '🥫', name: 'a tin can', bin: 'recycle' },
      { icon: '📦', name: 'a cardboard box', bin: 'recycle' },
      { icon: '🍾', name: 'a glass bottle', bin: 'recycle' },
      { icon: '🍌', name: 'a banana peel', bin: 'food' },
      { icon: '🍎', name: 'an apple core', bin: 'food' },
      { icon: '🥬', name: 'old lettuce', bin: 'food' },
      { icon: '🍞', name: 'stale bread', bin: 'food' },
      { icon: '🧦', name: 'an odd sock', bin: 'bin' },
      { icon: '🪥', name: 'an old toothbrush', bin: 'bin' },
      { icon: '🎈', name: 'a popped balloon', bin: 'bin' },
      { icon: '🩹', name: 'a used plaster', bin: 'bin' },
    ],
  },

  {
    id: 'colours',
    title: 'Colour Sort',
    question: 'What colour is it?',
    icon: '🎨',
    learned: 'Colour names · sorting by one property · looking closely',
    bins: [
      { id: 'red', label: 'Red', icon: '🔴', color: '#E5383B' },
      { id: 'yellow', label: 'Yellow', icon: '🟡', color: '#F0A017' },
      { id: 'green', label: 'Green', icon: '🟢', color: '#57CC5B' },
      { id: 'blue', label: 'Blue', icon: '🔵', color: '#2C7BE5' },
    ],
    items: [
      { icon: '🍓', name: 'a strawberry', bin: 'red' },
      { icon: '🌹', name: 'a rose', bin: 'red' },
      { icon: '🍒', name: 'cherries', bin: 'red' },
      { icon: '🍌', name: 'a banana', bin: 'yellow' },
      { icon: '🌻', name: 'a sunflower', bin: 'yellow' },
      { icon: '🧀', name: 'cheese', bin: 'yellow' },
      { icon: '🥦', name: 'broccoli', bin: 'green' },
      { icon: '🐸', name: 'a frog', bin: 'green' },
      { icon: '🌿', name: 'a leaf', bin: 'green' },
      { icon: '🫐', name: 'blueberries', bin: 'blue' },
      { icon: '🐳', name: 'a whale', bin: 'blue' },
      { icon: '💙', name: 'a blue heart', bin: 'blue' },
    ],
  },

  {
    id: 'shapes',
    title: 'Shape Sort',
    question: 'What shape is it?',
    icon: '🔷',
    learned: 'Shape names · seeing shapes in real objects · geometry',
    bins: [
      { id: 'round', label: 'Round', icon: '⭕', color: '#F0522B' },
      { id: 'square', label: 'Square', icon: '⬜', color: '#7B2CBF' },
      { id: 'triangle', label: 'Triangle', icon: '🔺', color: '#2CB5AF' },
    ],
    items: [
      { icon: '⚽', name: 'a football', bin: 'round' },
      { icon: '🍪', name: 'a cookie', bin: 'round' },
      { icon: '🕐', name: 'a clock', bin: 'round' },
      { icon: '🪙', name: 'a coin', bin: 'round' },
      { icon: '🎁', name: 'a present', bin: 'square' },
      { icon: '🪟', name: 'a window', bin: 'square' },
      { icon: '📺', name: 'a television', bin: 'square' },
      { icon: '🍕', name: 'a pizza slice', bin: 'triangle' },
      { icon: '⛺', name: 'a tent', bin: 'triangle' },
      { icon: '🏔️', name: 'a mountain', bin: 'triangle' },
    ],
  },
];

export const getPack = (id: string): MatchPack | undefined =>
  MATCH_PACKS.find((p) => p.id === id);

/** Bin count is the difficulty: 2 is easiest, 4 the hardest. */
export const difficultyOf = (pack: MatchPack): 1 | 2 | 3 =>
  pack.bins.length <= 2 ? 1 : pack.bins.length === 3 ? 2 : 3;
