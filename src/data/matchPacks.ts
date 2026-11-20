/**
 * matchPacks.ts — Match, as seven sorting games instead of one.
 *
 * The old Match had exactly one set of items (fruit / vegetable / animal /
 * vehicle), and "Again" didn't even reshuffle them, so the second play was
 * identical to the first. A child finished it once and never went back.
 *
 * Bin count doubles as the difficulty dial: two bins for the youngest, four
 * for the oldest, no separate settings needed.
 *
 * EMOJI RULE: every emoji here is Unicode 11 or older, so it shows on older
 * Android phones too (newer ones like 🫐 🪙 🪟 🪥 🩹 🧊 show as empty boxes there).
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
      { icon: '🍒', name: 'cherries', bin: 'small' },
      { icon: '🐁', name: 'a mouse', bin: 'small' },
    ],
  },

  /* NEW — replaces "Hot or Cold?" (kept the 2-bin, easiest level) */
  {
    id: 'sinkfloat',
    title: 'Sink or Float?',
    question: 'Does it sink, or does it float?',
    icon: '🌊',
    learned: 'Sinking and floating · predicting · early science',
    bins: [
      { id: 'float', label: 'Floats', icon: '🌊', color: '#2CB5AF' },
      { id: 'sink', label: 'Sinks', icon: '⬇️', color: '#4C4A8F' },
    ],
    items: [
      { icon: '🦆', name: 'a duck', bin: 'float' },
      { icon: '🛶', name: 'a canoe', bin: 'float' },
      { icon: '🚢', name: 'a ship', bin: 'float' },
      { icon: '🍃', name: 'a leaf', bin: 'float' },
      { icon: '🏀', name: 'a ball', bin: 'float' },
      { icon: '🔑', name: 'a key', bin: 'sink' },
      { icon: '⚓', name: 'an anchor', bin: 'sink' },
      { icon: '🔨', name: 'a hammer', bin: 'sink' },
      { icon: '🥄', name: 'a spoon', bin: 'sink' },
      { icon: '🧲', name: 'a magnet', bin: 'sink' },
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
      { icon: '🧻', name: 'a used tissue', bin: 'bin' },
      { icon: '🎈', name: 'a popped balloon', bin: 'bin' },
      { icon: '🖍️', name: 'a broken crayon', bin: 'bin' },
    ],
  },

  /* NEW — replaces "Shape Sort" (kept the 3-bin, middle level) */
  {
    id: 'rooms',
    title: 'Rooms at Home',
    question: 'Which room is it for?',
    icon: '🏠',
    learned: 'Rooms of the house · what things are used for · everyday vocabulary',
    bins: [
      { id: 'kitchen', label: 'Kitchen', icon: '🍳', color: '#F0A017' },
      { id: 'bathroom', label: 'Bathroom', icon: '🛁', color: '#2C7BE5' },
      { id: 'bedroom', label: 'Bedroom', icon: '🛏️', color: '#7B2CBF' },
    ],
    items: [
      { icon: '🥣', name: 'a bowl', bin: 'kitchen' },
      { icon: '🍴', name: 'a fork and knife', bin: 'kitchen' },
      { icon: '🍽️', name: 'a plate', bin: 'kitchen' },
      { icon: '🥄', name: 'a spoon', bin: 'kitchen' },
      { icon: '🚿', name: 'a shower', bin: 'bathroom' },
      { icon: '🧼', name: 'soap', bin: 'bathroom' },
      { icon: '🚽', name: 'a toilet', bin: 'bathroom' },
      { icon: '🧻', name: 'toilet paper', bin: 'bathroom' },
      { icon: '🛏️', name: 'a bed', bin: 'bedroom' },
      { icon: '🧸', name: 'a teddy bear', bin: 'bedroom' },
      { icon: '⏰', name: 'an alarm clock', bin: 'bedroom' },
      { icon: '🧦', name: 'socks', bin: 'bedroom' },
    ],
  },

  /* NEW — replaces "Colour Sort" (kept the 4-bin, hardest level) */
  {
    id: 'helpers',
    title: 'Who Helps Us?',
    question: 'Who uses it?',
    icon: '🦸',
    learned: 'Community helpers · linking tools to jobs · early social studies',
    bins: [
      { id: 'doctor', label: 'Doctor', icon: '👩‍⚕️', color: '#2CB5AF' },
      { id: 'fire', label: 'Firefighter', icon: '👨‍🚒', color: '#E5383B' },
      { id: 'police', label: 'Police', icon: '👮', color: '#2C7BE5' },
      { id: 'chef', label: 'Chef', icon: '👨‍🍳', color: '#F0A017' },
    ],
    items: [
      { icon: '🩺', name: 'a stethoscope', bin: 'doctor' },
      { icon: '🚑', name: 'an ambulance', bin: 'doctor' },
      { icon: '💊', name: 'medicine', bin: 'doctor' },
      { icon: '🚒', name: 'a fire truck', bin: 'fire' },
      { icon: '🧯', name: 'a fire extinguisher', bin: 'fire' },
      { icon: '🔥', name: 'a fire to put out', bin: 'fire' },
      { icon: '🚓', name: 'a police car', bin: 'police' },
      { icon: '🚨', name: 'a police siren', bin: 'police' },
      { icon: '🧢', name: 'a police cap', bin: 'police' },
      { icon: '🍳', name: 'a frying pan', bin: 'chef' },
      { icon: '🥘', name: 'a cooking pot', bin: 'chef' },
      { icon: '🍰', name: 'a cake', bin: 'chef' },
    ],
  },
];

export const getPack = (id: string): MatchPack | undefined =>
  MATCH_PACKS.find((p) => p.id === id);

/** Bin count is the difficulty: 2 is easiest, 4 the hardest. */
export const difficultyOf = (pack: MatchPack): 1 | 2 | 3 =>
  pack.bins.length <= 2 ? 1 : pack.bins.length === 3 ? 2 : 3;
