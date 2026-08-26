/**
 * artActivities.ts — Art & Design Studio.
 *
 * The Colour Book is the piece to watch: ten discoveries with empty slots,
 * saved between visits. Children will chase every blank square, and it
 * teaches real colour theory while they do it.
 */

import { Activity } from './activityTypes';

const PAINTS = [
  { name: 'red', color: '#E5383B' },
  { name: 'yellow', color: '#FFD23F' },
  { name: 'blue', color: '#2C7BE5' },
  { name: 'white', color: '#FFFFFF' },
  { name: 'black', color: '#1B1B1F' },
];

const DISCOVERIES = [
  { a: 'red', b: 'yellow', name: 'orange', color: '#F97316' },
  { a: 'blue', b: 'yellow', name: 'green', color: '#3FA34D' },
  { a: 'red', b: 'blue', name: 'purple', color: '#7B2CBF' },
  { a: 'red', b: 'white', name: 'pink', color: '#FF9FB6' },
  { a: 'blue', b: 'white', name: 'sky blue', color: '#8FCDF0' },
  { a: 'yellow', b: 'white', name: 'cream', color: '#FBEFC0' },
  { a: 'red', b: 'black', name: 'maroon', color: '#7A1F27' },
  { a: 'blue', b: 'black', name: 'navy', color: '#1B2A4A' },
  { a: 'yellow', b: 'black', name: 'olive', color: '#6E6B23' },
  { a: 'white', b: 'black', name: 'grey', color: '#9AA0A6' },
];

const RAINBOW = ['#E5383B', '#F77F00', '#FFD23F', '#38B000', '#2C7BE5', '#7B2CBF', '#FF8FC4', '#1B1B1F'];

export const ART_ACTIVITIES: Record<string, Activity> = {
  artpainting: {
    id: 'artpainting',
    title: 'Colour Mixing Lab',
    hook: 'Two colours go in. What comes out?',
    result: { icon: '🎨', name: 'new colours' },
    learned: 'Primary and secondary colours · predicting · experimenting',
    funFact: 'You can make every colour in the world from just red, yellow and blue!',
    steps: [
      {
        kind: 'mix',
        say: 'Pick two colours and mix them!',
        palette: PAINTS,
        discoveries: DISCOVERIES,
        goal: 3,
      },
      {
        kind: 'draw',
        say: 'Now paint something with your new colours!',
        guide: 'blank',
        background: '#FFFFFF',
        minStrokes: 3,
        colors: RAINBOW,
      },
    ],
  },

  drawing: {
    id: 'drawing',
    title: 'Free Drawing',
    hook: 'A blank page. Draw whatever you want!',
    result: { icon: '🖼️', name: 'a drawing' },
    learned: 'Imagination · brush control · finishing something',
    funFact: 'The oldest drawing ever found is on a cave wall, older than 40,000 years!',
    steps: [
      {
        kind: 'draw',
        say: 'Draw anything at all. There is no wrong answer!',
        guide: 'blank',
        background: '#FFFFFF',
        minStrokes: 3,
        colors: RAINBOW,
      },
    ],
  },

  poster: {
    id: 'poster',
    title: 'Make a Poster',
    hook: 'Design a poster for your bedroom door!',
    result: { icon: '📃', name: 'a poster' },
    learned: 'Filling a space · big bold shapes · design choices',
    funFact: 'The very first posters were used to advertise circuses!',
    steps: [
      {
        kind: 'draw',
        say: 'Make it big and bright!',
        guide: 'blank',
        background: '#FFF8E7',
        minStrokes: 4,
        colors: RAINBOW,
      },
    ],
  },

  tiedye: {
    id: 'tiedye',
    title: 'Tie-Dye',
    hook: 'Mix wild colours and splash them everywhere!',
    result: { icon: '🌈', name: 'a tie-dye shirt' },
    learned: 'Colour mixing · patterns · happy accidents',
    funFact: 'Tie-dye works because the tight knots stop the colour getting in!',
    steps: [
      { kind: 'mix', say: 'Mix two dyes to make a new colour!', palette: PAINTS, discoveries: DISCOVERIES, goal: 2 },
      {
        kind: 'draw',
        say: 'Swirl the colour onto the shirt!',
        guide: '👕',
        background: '#FDFDFD',
        symmetry: true,
        minStrokes: 3,
        colors: RAINBOW,
      },
    ],
  },

  pottery: {
    id: 'pottery',
    title: 'Pottery Wheel',
    hook: 'Spin the wheel and shape the clay!',
    result: { icon: '🏺', name: 'a clay pot' },
    learned: 'Round-and-round motion · shaping · painting a 3D object',
    funFact: 'The potter’s wheel is over 5,000 years old — one of the oldest machines!',
    steps: [
      {
        kind: 'stir',
        say: 'Spin the wheel! Circle your finger to shape the clay.',
        turns: 5,
        vesselIcon: '🏺',
        fromColor: '#C8A882',
        toColor: '#A9714B',
        becomes: 'a smooth clay pot',
      },
      {
        kind: 'decorate',
        say: 'Now paint your pot!',
        base: '🏺',
        frostings: [
          { name: 'terracotta', color: '#C1663F' },
          { name: 'ocean blue', color: '#3A86B8' },
          { name: 'forest green', color: '#4C8B54' },
          { name: 'cream', color: '#EFE1C6' },
        ],
        toppings: [
          { icon: '⭐', name: 'a star' },
          { icon: '🌸', name: 'a flower' },
          { icon: '🌀', name: 'a swirl' },
          { icon: '❤️', name: 'a heart' },
          { icon: '🔶', name: 'a diamond shape' },
        ],
      },
    ],
  },

  sculpting: {
    id: 'sculpting',
    title: 'Clay Sculpting',
    hook: 'Squish, roll and shape!',
    result: { icon: '🗿', name: 'a sculpture' },
    learned: 'Working with your hands · 3D shapes · patience',
    funFact: 'Sculptors say they are just removing the bits that are not the statue!',
    steps: [
      {
        kind: 'stir',
        say: 'Knead the clay! Round and round.',
        turns: 4,
        vesselIcon: '🗿',
        fromColor: '#D3C4AE',
        toColor: '#A08A6E',
        becomes: 'soft, ready clay',
      },
      {
        kind: 'decorate',
        say: 'Give your sculpture some details!',
        base: '🗿',
        frostings: [
          { name: 'stone grey', color: '#A8A29A' },
          { name: 'clay brown', color: '#A9714B' },
          { name: 'marble white', color: '#EFEDE6' },
        ],
        toppings: [
          { icon: '👀', name: 'eyes' },
          { icon: '👃', name: 'a nose' },
          { icon: '👑', name: 'a crown' },
          { icon: '🌿', name: 'leaves' },
          { icon: '⭐', name: 'a star' },
        ],
      },
    ],
  },

  collage: {
    id: 'collage',
    title: 'Make a Collage',
    hook: 'Stick everything together into one picture!',
    result: { icon: '🖼️', name: 'a collage' },
    learned: 'Arranging · composition · seeing a whole from parts',
    funFact: 'Collage comes from a French word that just means "to glue"!',
    steps: [
      {
        kind: 'decorate',
        say: 'Stick things anywhere you like!',
        base: '🖼️',
        frostings: [
          { name: 'sky blue', color: '#9BD9F5' },
          { name: 'sunset orange', color: '#FFB07C' },
          { name: 'grass green', color: '#A8D98A' },
          { name: 'night purple', color: '#8E7BC7' },
        ],
        toppings: [
          { icon: '⭐', name: 'a star' },
          { icon: '🌙', name: 'the moon' },
          { icon: '🌳', name: 'a tree' },
          { icon: '🏠', name: 'a house' },
          { icon: '🐦', name: 'a bird' },
          { icon: '☁️', name: 'a cloud' },
          { icon: '🚗', name: 'a car' },
          { icon: '🌈', name: 'a rainbow' },
        ],
      },
    ],
  },

  crafts: {
    id: 'crafts',
    title: 'Craft Time',
    hook: 'Let us make something with our hands!',
    result: { icon: '🎁', name: 'a handmade gift' },
    learned: 'Making something for someone else · decorating · giving',
    funFact: 'Wrapping paper was invented by accident when a shop ran out of envelopes!',
    steps: [
      {
        kind: 'decorate',
        say: 'Decorate a present for someone you love!',
        base: '🎁',
        frostings: [
          { name: 'red wrapping', color: '#D93A2B' },
          { name: 'gold wrapping', color: '#E8B830' },
          { name: 'blue wrapping', color: '#3A86B8' },
          { name: 'pink wrapping', color: '#FF8FC4' },
        ],
        toppings: [
          { icon: '🎀', name: 'a ribbon' },
          { icon: '⭐', name: 'a star' },
          { icon: '❤️', name: 'a heart' },
          { icon: '🌸', name: 'a flower' },
          { icon: '✨', name: 'sparkles' },
        ],
      },
    ],
  },

  stickers: {
    id: 'stickers',
    title: 'Sticker Scene',
    hook: 'Build a whole little world!',
    result: { icon: '🏞️', name: 'a sticker scene' },
    learned: 'Storytelling · arranging a scene · imagination',
    funFact: 'The first stickers were used to label fruit crates!',
    steps: [
      {
        kind: 'decorate',
        say: 'Make a scene. Tell a little story!',
        base: '🏞️',
        frostings: [
          { name: 'daytime', color: '#9BD9F5' },
          { name: 'sunset', color: '#FFB07C' },
          { name: 'night time', color: '#5C6BC0' },
          { name: 'snowy', color: '#E8F1F8' },
        ],
        toppings: [
          { icon: '🐶', name: 'a dog' },
          { icon: '🐱', name: 'a cat' },
          { icon: '🌳', name: 'a tree' },
          { icon: '🏠', name: 'a house' },
          { icon: '🚗', name: 'a car' },
          { icon: '🦋', name: 'a butterfly' },
          { icon: '⛰️', name: 'a mountain' },
          { icon: '🌞', name: 'the sun' },
        ],
      },
    ],
  },

  origami: {
    id: 'origami',
    title: 'Paper Folding',
    hook: 'Fold a flat paper into a bird!',
    result: { icon: '🦢', name: 'a paper swan' },
    learned: 'Following folds in order · symmetry · turning flat into 3D',
    funFact: 'There is a story that folding a thousand paper cranes grants a wish!',
    steps: [
      {
        kind: 'draw',
        say: 'Draw your fold lines — one side, mirrored!',
        guide: '📄',
        background: '#FFFFFF',
        symmetry: true,
        minStrokes: 3,
        colors: ['#2C7BE5', '#E5383B', '#38B000', '#1B1B1F'],
      },
      {
        kind: 'decorate',
        say: 'Now decorate your paper bird!',
        base: '🦢',
        frostings: [
          { name: 'white paper', color: '#F7F7FB' },
          { name: 'gold paper', color: '#E8B830' },
          { name: 'pink paper', color: '#FF8FC4' },
        ],
        toppings: [
          { icon: '⭐', name: 'a star' },
          { icon: '🌸', name: 'a flower' },
          { icon: '👀', name: 'eyes' },
          { icon: '✨', name: 'sparkles' },
        ],
      },
    ],
  },
};
