/**
 * gardenActivities.ts — Garden & Farm.
 *
 * The important one. Four of these open the real garden plot, which grows in
 * real time whether the app is open or not. That is the only thing in
 * KidSpark that gives a child a reason to come back tomorrow.
 */

import { Activity } from './activityTypes';

const SEEDS = [
  { id: 'sunflower', icon: '🌻', name: 'sunflower', sprout: '🌿', grown: '🌻' },
  { id: 'tulip', icon: '🌷', name: 'tulip', sprout: '🌿', grown: '🌷' },
  { id: 'rose', icon: '🌹', name: 'rose', sprout: '🌿', grown: '🌹' },
  { id: 'carrot', icon: '🥕', name: 'carrot', sprout: '🌱', grown: '🥕' },
  { id: 'tomato', icon: '🍅', name: 'tomato', sprout: '🌱', grown: '🍅' },
  { id: 'corn', icon: '🌽', name: 'corn', sprout: '🌱', grown: '🌽' },
  { id: 'strawberry', icon: '🍓', name: 'strawberry', sprout: '🌱', grown: '🍓' },
  { id: 'pumpkin', icon: '🎃', name: 'pumpkin', sprout: '🌱', grown: '🎃' },
];

const FLOWERS = SEEDS.filter((s) => ['sunflower', 'tulip', 'rose'].includes(s.id));
const VEG = SEEDS.filter((s) => ['carrot', 'tomato', 'corn', 'pumpkin'].includes(s.id));
const HERBS = [
  { id: 'basil', icon: '🌿', name: 'basil', sprout: '🌱', grown: '🌿' },
  { id: 'mint', icon: '🍃', name: 'mint', sprout: '🌱', grown: '🍃' },
  { id: 'clover', icon: '☘️', name: 'clover', sprout: '🌱', grown: '☘️' },
];
const TREES = [
  { id: 'apple', icon: '🍎', name: 'apple tree', sprout: '🌱', grown: '🌳' },
  { id: 'palm', icon: '🌴', name: 'palm tree', sprout: '🌱', grown: '🌴' },
  { id: 'pine', icon: '🌲', name: 'pine tree', sprout: '🌱', grown: '🌲' },
];

export const GARDEN_ACTIVITIES: Record<string, Activity> = {
  plantflowers: {
    id: 'plantflowers',
    title: 'Plant Flowers',
    hook: 'Plant a flower today and watch it grow!',
    result: { icon: '🌻', name: 'a flower garden' },
    learned: 'Patience · caring for a living thing · what a plant needs to grow',
    funFact: 'A sunflower turns its head to follow the sun all day long!',
    steps: [
      { kind: 'garden', say: 'Tap an empty patch to plant a flower!', seeds: FLOWERS },
    ],
  },

  growveggies: {
    id: 'growveggies',
    title: 'Grow Vegetables',
    hook: 'Grow your own dinner!',
    result: { icon: '🥕', name: 'fresh vegetables' },
    learned: 'Where food comes from · daily care · seed to harvest',
    funFact: 'A carrot is really a root — the part that hides underground!',
    steps: [
      { kind: 'garden', say: 'Plant some vegetables and water them!', seeds: VEG },
    ],
  },

  herbgarden: {
    id: 'herbgarden',
    title: 'Herb Garden',
    hook: 'Herbs smell amazing. Let us grow some!',
    result: { icon: '🌿', name: 'a herb garden' },
    learned: 'Plant names · smells and senses · looking after small plants',
    funFact: 'Rub a mint leaf and your fingers smell minty for ages!',
    steps: [{ kind: 'garden', say: 'Plant your herbs and give them water.', seeds: HERBS }],
  },

  treeplanting: {
    id: 'treeplanting',
    title: 'Plant a Tree',
    hook: 'Trees take the longest — and grow the biggest!',
    result: { icon: '🌳', name: 'a tree' },
    learned: 'Long-term patience · trees make the air we breathe',
    funFact: 'One big tree can make enough air for two whole people every day!',
    steps: [{ kind: 'garden', say: 'Plant a tree and come back to see it grow.', seeds: TREES }],
  },

  watering: {
    id: 'watering',
    title: 'Watering Day',
    hook: 'Everything in the garden is thirsty!',
    result: { icon: '💧', name: 'a watered garden' },
    learned: 'Plants need water · a daily routine · noticing what needs help',
    funFact: 'Plants drink through their roots, not their leaves!',
    steps: [{ kind: 'garden', say: 'Give every thirsty plant a drink!', seeds: SEEDS }],
  },

  harvest: {
    id: 'harvest',
    title: 'Harvest Time',
    hook: 'Anything ready to pick?',
    result: { icon: '🧺', name: 'a full basket' },
    learned: 'Knowing when food is ready · counting the harvest',
    funFact: 'A pumpkin can grow as heavy as a small car!',
    steps: [{ kind: 'garden', say: 'Pick anything that is ready, and plant more!', seeds: SEEDS }],
  },

  feedanimals: {
    id: 'feedanimals',
    title: 'Feed the Animals',
    hook: 'The farm animals are hungry!',
    result: { icon: '🐄', name: 'happy animals' },
    learned: 'Different animals eat different things · caring for others',
    funFact: 'Cows have best friends and get upset when they are apart!',
    steps: [
      {
        kind: 'animals',
        say: 'Give each animal what it wants!',
        animals: [
          { icon: '🐄', name: 'cow', wants: 'hay', wantIcon: '🌾', sound: 'Moo!' },
          { icon: '🐔', name: 'hen', wants: 'corn', wantIcon: '🌽', sound: 'Cluck!' },
          { icon: '🐰', name: 'rabbit', wants: 'a carrot', wantIcon: '🥕', sound: 'Sniff sniff!' },
          { icon: '🐑', name: 'sheep', wants: 'grass', wantIcon: '🍀', sound: 'Baa!' },
          { icon: '🐷', name: 'pig', wants: 'an apple', wantIcon: '🍎', sound: 'Oink!' },
          { icon: '🐴', name: 'horse', wants: 'a sugar cube', wantIcon: '🧊', sound: 'Neigh!' },
        ],
        extras: [
          { icon: '🍫', name: 'chocolate' },
          { icon: '⚽', name: 'a football' },
          { icon: '🧦', name: 'a sock' },
          { icon: '📱', name: 'a phone' },
        ],
      },
    ],
  },

  composting: {
    id: 'composting',
    title: 'Compost Sorting',
    hook: 'Rubbish day! Where does everything go?',
    result: { icon: '♻️', name: 'a tidy farm' },
    learned: 'Recycling · food waste becomes compost · sorting by type',
    funFact: 'Banana peels turn into plant food in about four weeks!',
    steps: [
      {
        kind: 'sort',
        say: 'Put each thing in the right bin!',
        bins: [
          { id: 'compost', label: 'Compost', icon: '🌱', color: '#5B8C3E' },
          { id: 'recycle', label: 'Recycling', icon: '♻️', color: '#2C7BB6' },
          { id: 'rubbish', label: 'Rubbish', icon: '🗑️', color: '#6B7280' },
        ],
        items: [
          { icon: '🍌', name: 'banana peel', bin: 'compost' },
          { icon: '🍎', name: 'apple core', bin: 'compost' },
          { icon: '🥬', name: 'old lettuce', bin: 'compost' },
          { icon: '🍂', name: 'dead leaves', bin: 'compost' },
          { icon: '🥤', name: 'plastic cup', bin: 'recycle' },
          { icon: '📰', name: 'newspaper', bin: 'recycle' },
          { icon: '🥫', name: 'tin can', bin: 'recycle' },
          { icon: '📦', name: 'cardboard box', bin: 'recycle' },
          { icon: '🧦', name: 'odd sock', bin: 'rubbish' },
          { icon: '🪥', name: 'old toothbrush', bin: 'rubbish' },
        ],
      },
    ],
  },

  butterflygarden: {
    id: 'butterflygarden',
    title: 'Butterfly Garden',
    hook: 'Butterflies love bright flowers. Let us call some over!',
    result: { icon: '🦋', name: 'a butterfly garden' },
    learned: 'Which flowers attract insects · why bees and butterflies matter',
    funFact: 'Butterflies taste things with their feet!',
    steps: [
      {
        kind: 'gather',
        say: 'Put bright flowers in the flower bed!',
        vessel: { icon: '🪴', label: 'flower bed' },
        need: [
          { icon: '🌸', name: 'blossom' },
          { icon: '🌺', name: 'hibiscus' },
          { icon: '🌻', name: 'sunflower' },
          { icon: '🌷', name: 'tulip' },
        ],
        decoys: [
          { icon: '🪨', name: 'a rock' },
          { icon: '🧦', name: 'a sock' },
          { icon: '🥾', name: 'a boot' },
        ],
        decoyQuip: 'Butterflies do not like that one!',
      },
      {
        kind: 'decorate',
        say: 'Now add the butterflies and bugs!',
        base: '🌺',
        frostings: [
          { name: 'sunny sky', color: '#9BD9F5' },
          { name: 'sunset', color: '#FFB07C' },
          { name: 'meadow green', color: '#A8D98A' },
        ],
        toppings: [
          { icon: '🦋', name: 'butterfly' },
          { icon: '🐝', name: 'bee' },
          { icon: '🐞', name: 'ladybird' },
          { icon: '🌼', name: 'daisy' },
          { icon: '🍃', name: 'leaf' },
        ],
      },
    ],
  },

  decorategarden: {
    id: 'decorategarden',
    title: 'Decorate the Garden',
    hook: 'Make the garden yours!',
    result: { icon: '🏡', name: 'your own garden' },
    learned: 'Design choices · making a space your own',
    funFact: 'Some gardens are made entirely of stones and sand!',
    steps: [
      {
        kind: 'decorate',
        say: 'Decorate the garden however you like!',
        base: '🏡',
        frostings: [
          { name: 'green lawn', color: '#8FCB6B' },
          { name: 'stone path', color: '#C9C3B6' },
          { name: 'sandy garden', color: '#E8D3A0' },
        ],
        toppings: [
          { icon: '🌳', name: 'tree' },
          { icon: '🌷', name: 'tulip' },
          { icon: '🪴', name: 'pot plant' },
          { icon: '🦋', name: 'butterfly' },
          { icon: '🐦', name: 'bird' },
          { icon: '⛲', name: 'fountain' },
          { icon: '🪑', name: 'bench' },
          { icon: '🍄', name: 'mushroom' },
        ],
      },
    ],
  },
};
