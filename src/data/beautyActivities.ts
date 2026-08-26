/**
 * beautyActivities.ts — Beauty & Fashion Studio.
 *
 * The old Dress Up had four taps in one correct order. This has no correct
 * answer: any outfit works, it stays on the character, and it saves to the
 * lookbook. Challenge modes ("dress for the rain") add a goal without
 * collapsing back to a single right answer.
 */

import { Activity, DressSlot } from './activityTypes';

/* Shared wardrobe. Tags drive challenge modes. */
const SLOTS: DressSlot[] = [
  {
    id: 'outfit',
    label: '👗 Outfit',
    y: 52,
    size: 0.34,
    options: [
      { icon: '👗', name: 'a party dress', tags: ['party', 'warm'] },
      { icon: '👕', name: 'a t-shirt', tags: ['warm', 'play'] },
      { icon: '🧥', name: 'a raincoat', tags: ['rain', 'cold'] },
      { icon: '🧣', name: 'a woolly scarf', tags: ['cold', 'snow'] },
      { icon: '👘', name: 'a robe', tags: ['party'] },
      { icon: '🩱', name: 'a swimsuit', tags: ['beach', 'warm'] },
      { icon: '🦺', name: 'a hi-vis vest', tags: ['work', 'rain'] },
      { icon: '👚', name: 'a blouse', tags: ['party', 'work'] },
    ],
  },
  {
    id: 'shoes',
    label: '👟 Shoes',
    y: 78,
    size: 0.2,
    options: [
      { icon: '👟', name: 'trainers', tags: ['play', 'warm'] },
      { icon: '👠', name: 'high heels', tags: ['party'] },
      { icon: '🥾', name: 'walking boots', tags: ['rain', 'cold', 'snow'] },
      { icon: '🩴', name: 'flip flops', tags: ['beach', 'warm'] },
      { icon: '🥿', name: 'flat shoes', tags: ['work', 'party'] },
      { icon: '🧦', name: 'cosy socks', tags: ['cold', 'snow'] },
    ],
  },
  {
    id: 'head',
    label: '🎩 Head',
    y: 22,
    size: 0.22,
    options: [
      { icon: '👒', name: 'a sun hat', tags: ['beach', 'warm'] },
      { icon: '🧢', name: 'a cap', tags: ['play', 'warm'] },
      { icon: '🎩', name: 'a top hat', tags: ['party'] },
      { icon: '⛑️', name: 'a safety helmet', tags: ['work'] },
      { icon: '👑', name: 'a crown', tags: ['party'] },
      { icon: '🪖', name: 'a woolly hat', tags: ['cold', 'snow'] },
    ],
  },
  {
    id: 'extra',
    label: '👜 Extra',
    y: 62,
    size: 0.17,
    options: [
      { icon: '👜', name: 'a handbag', tags: ['party', 'work'] },
      { icon: '🎒', name: 'a backpack', tags: ['play', 'work'] },
      { icon: '☂️', name: 'an umbrella', tags: ['rain'] },
      { icon: '🕶️', name: 'sunglasses', tags: ['beach', 'warm'] },
      { icon: '🧤', name: 'gloves', tags: ['cold', 'snow'] },
      { icon: '💐', name: 'flowers', tags: ['party'] },
    ],
  },
];

const hairColours = [
  { name: 'sunny blonde', color: '#F2CE73' },
  { name: 'chocolate brown', color: '#7A4B2B' },
  { name: 'fiery red', color: '#D9552F' },
  { name: 'midnight black', color: '#2B2B33' },
  { name: 'bubblegum pink', color: '#FF8FC4' },
  { name: 'ocean blue', color: '#4FA8E0' },
];

export const BEAUTY_ACTIVITIES: Record<string, Activity> = {
  dressup: {
    id: 'dressup',
    title: 'Dress Up',
    hook: 'Your own wardrobe. Wear anything you like!',
    result: { icon: '💃', name: 'a brilliant look' },
    learned: 'Making choices · putting things together · no wrong answers',
    funFact: 'Pockets used to be little bags people tied on with string!',
    steps: [
      {
        kind: 'dress',
        say: 'Pick anything you like. It is your look!',
        character: '🧍',
        background: '#FFE3F0',
        slots: SLOTS,
      },
    ],
  },

  colorcoord: {
    id: 'colorcoord',
    title: 'Dress for the Weather',
    hook: 'It is pouring outside. What should we wear?',
    result: { icon: '☔', name: 'a rainy-day outfit' },
    learned: 'Matching clothes to weather · thinking ahead · many right answers',
    funFact: 'The first raincoats were made from rubber and smelled terrible!',
    steps: [
      {
        kind: 'dress',
        say: 'Get ready to go outside.',
        character: '🧍',
        background: '#CFE4F5',
        slots: SLOTS,
        challenge: {
          prompt: 'It is raining! Pick things that keep you dry.',
          requireTag: 'rain',
          rewardLine: 'Perfectly dry! Well chosen.',
        },
      },
    ],
  },

  accessory: {
    id: 'accessory',
    title: 'Beach Day',
    hook: 'We are off to the beach!',
    result: { icon: '🏖️', name: 'a beach outfit' },
    learned: 'Planning for a place · sun safety · choosing for a purpose',
    funFact: 'Sunglasses were first worn by judges so nobody could see their eyes!',
    steps: [
      {
        kind: 'dress',
        say: 'Pack yourself for a sunny beach day.',
        character: '🧍',
        background: '#FFE9B8',
        slots: SLOTS,
        challenge: {
          prompt: 'It is hot and sunny! Pick beach things.',
          requireTag: 'beach',
          rewardLine: 'Ready for the sand and sea!',
        },
      },
    ],
  },

  fashiondesign: {
    id: 'fashiondesign',
    title: 'Party Look',
    hook: 'There is a party tonight!',
    result: { icon: '🎉', name: 'a party outfit' },
    learned: 'Dressing for an occasion · style choices · confidence',
    funFact: 'Designers draw about a hundred sketches before choosing one!',
    steps: [
      {
        kind: 'dress',
        say: 'Design something special for the party.',
        character: '🧍',
        background: '#EBDDFF',
        slots: SLOTS,
        challenge: {
          prompt: 'It is a party! Pick your fanciest things.',
          requireTag: 'party',
          rewardLine: 'You look amazing. Enjoy the party!',
        },
      },
    ],
  },

  hairstyle: {
    id: 'hairstyle',
    title: 'Hair Salon',
    hook: 'Wash, dry and colour — you are the stylist!',
    result: { icon: '💇', name: 'a new hairstyle' },
    learned: 'Steps in order · scrubbing · colour choices',
    funFact: 'Hair grows about as fast as your fingernails!',
    steps: [
      { kind: 'scrub', say: 'Wash the hair. Rub it all over!', distance: 900, dirtyIcon: '💇', cleanIcon: '💇' },
      {
        kind: 'decorate',
        say: 'Now pick a colour and add pretty things!',
        base: '👱‍♀️',
        frostings: hairColours,
        toppings: [
          { icon: '🎀', name: 'a bow' },
          { icon: '🌸', name: 'a flower' },
          { icon: '👑', name: 'a tiara' },
          { icon: '⭐', name: 'a star clip' },
          { icon: '🦋', name: 'a butterfly clip' },
          { icon: '💎', name: 'a gem' },
        ],
      },
    ],
  },

  braiding: {
    id: 'braiding',
    title: 'Braids & Bows',
    hook: 'Time for beautiful braids!',
    result: { icon: '👧', name: 'braided hair' },
    learned: 'Patterns · patience · gentle hands',
    funFact: 'People have been braiding hair for over five thousand years!',
    steps: [
      {
        kind: 'decorate',
        say: 'Braid it and add bows wherever you like!',
        base: '👧',
        frostings: hairColours,
        toppings: [
          { icon: '🎀', name: 'a bow' },
          { icon: '🌺', name: 'a flower' },
          { icon: '💍', name: 'a hair ring' },
          { icon: '✨', name: 'sparkles' },
          { icon: '🦋', name: 'a butterfly' },
        ],
      },
    ],
  },

  facepainting: {
    id: 'facepainting',
    title: 'Face Painting',
    hook: 'Turn yourself into anything!',
    result: { icon: '🎭', name: 'a painted face' },
    learned: 'Symmetry · brush control · imagination',
    funFact: 'Face paint is one of the oldest kinds of art in the world!',
    steps: [
      {
        kind: 'draw',
        say: 'Paint one side — the mirror does the other!',
        guide: '😊',
        background: '#FFF3E6',
        symmetry: true,
        minStrokes: 3,
        colors: ['#E5383B', '#F77F00', '#FCBF49', '#38B000', '#0077B6', '#7B2CBF', '#FFFFFF', '#1B1B1F'],
      },
    ],
  },

  nailart: {
    id: 'nailart',
    title: 'Nail Art',
    hook: 'Ten tiny canvases!',
    result: { icon: '💅', name: 'painted nails' },
    learned: 'Small careful movements · colour and pattern',
    funFact: 'Nail polish was invented from car paint!',
    steps: [
      {
        kind: 'draw',
        say: 'Paint the nails any way you like!',
        guide: '🖐️',
        background: '#FFEEF6',
        minStrokes: 4,
        colors: ['#FF4D80', '#FF8FB1', '#C77DFF', '#4CC9F0', '#80ED99', '#FFD166', '#FFFFFF', '#2B2B33'],
      },
    ],
  },

  jewelry: {
    id: 'jewelry',
    title: 'Make Jewellery',
    hook: 'Thread a necklace, bead by bead!',
    result: { icon: '📿', name: 'a necklace' },
    learned: 'Patterns and repeats · colour choices · fine motor control',
    funFact: 'The oldest necklace ever found was made from tiny sea shells!',
    steps: [
      {
        kind: 'decorate',
        say: 'Add beads and gems in any pattern you like!',
        base: '📿',
        frostings: [
          { name: 'gold thread', color: '#E8B830' },
          { name: 'silver thread', color: '#C6CBD4' },
          { name: 'red thread', color: '#D93A5B' },
        ],
        toppings: [
          { icon: '💎', name: 'a diamond' },
          { icon: '🔴', name: 'a red bead' },
          { icon: '🔵', name: 'a blue bead' },
          { icon: '🟡', name: 'a yellow bead' },
          { icon: '🟢', name: 'a green bead' },
          { icon: '⭐', name: 'a star' },
          { icon: '🐚', name: 'a shell' },
        ],
      },
    ],
  },

  sewing: {
    id: 'sewing',
    title: 'Design a T-shirt',
    hook: 'A plain white t-shirt. Make it yours!',
    result: { icon: '👕', name: 'your own t-shirt' },
    learned: 'Design from scratch · planning a layout · ownership',
    funFact: 'T-shirts got their name because they are shaped like the letter T!',
    steps: [
      {
        kind: 'draw',
        say: 'Draw anything you want on the shirt!',
        guide: '👕',
        background: '#F7F7FB',
        minStrokes: 3,
        colors: ['#E5383B', '#F77F00', '#38B000', '#0077B6', '#7B2CBF', '#FF8FC4', '#1B1B1F'],
      },
    ],
  },
};
