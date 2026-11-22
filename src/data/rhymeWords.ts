// ============================================================
// RHYME WORDS — for the "Rhyme Time" round in the Sounds game
// ============================================================
//
// Each inner list is one rhyme family: every word in it rhymes with every
// other word in it. A round shows one word as the question, then three picture
// cards: one word from the SAME family (the answer) and two words from two
// OTHER families (the wrong answers).
//
// SAFETY RULES for adding a family:
//   1. Every word in the family must really rhyme with the others. Spelling may
//      differ (feet / meat / seat / sweet) — it is the SOUND that counts.
//   2. No word in one family may rhyme with a word in another family, or the
//      child could be marked wrong for a rhyme that is actually right.
//   3. Use an emoji from Unicode 11 or older so it shows on old Android phones.
//      If there is no good emoji, add a `draw` shape in SoundGame's WordPicture
//      (only 'chair' is drawn for rhymes so far).
//   4. Keep at least 3 words per family (the question, the answer, and a spare).

export interface RhymeWord {
  word: string; // lowercase
  emoji: string;
  draw?: 'chair' | 'board' | 'coin' | 'soil';
}

export const RHYME_FAMILIES: RhymeWord[][] = [
  // -at
  [
    { word: 'cat', emoji: '🐱' },
    { word: 'hat', emoji: '🎩' },
    { word: 'bat', emoji: '🦇' },
    { word: 'rat', emoji: '🐀' },
  ],
  // -og
  [
    { word: 'dog', emoji: '🐶' },
    { word: 'frog', emoji: '🐸' },
    { word: 'fog', emoji: '🌫️' },
  ],
  // -ee
  [
    { word: 'bee', emoji: '🐝' },
    { word: 'tree', emoji: '🌳' },
    { word: 'key', emoji: '🔑' },
    { word: 'tea', emoji: '🍵' },
  ],
  // -oat
  [
    { word: 'boat', emoji: '⛵' },
    { word: 'goat', emoji: '🐐' },
    { word: 'coat', emoji: '🧥' },
  ],
  // -oon
  [
    { word: 'moon', emoji: '🌙' },
    { word: 'spoon', emoji: '🥄' },
    { word: 'balloon', emoji: '🎈' },
  ],
  // -ox
  [
    { word: 'box', emoji: '📦' },
    { word: 'fox', emoji: '🦊' },
    { word: 'socks', emoji: '🧦' },
    { word: 'ox', emoji: '🐂' },
  ],
  // -ouse
  [
    { word: 'house', emoji: '🏠' },
    { word: 'mouse', emoji: '🐭' },
    { word: 'blouse', emoji: '👚' },
  ],
  // -ain
  [
    { word: 'train', emoji: '🚂' },
    { word: 'rain', emoji: '🌧️' },
    { word: 'brain', emoji: '🧠' },
    { word: 'chain', emoji: '⛓️' },
  ],
  // -ook
  [
    { word: 'book', emoji: '📖' },
    { word: 'cook', emoji: '👨‍🍳' },
    { word: 'look', emoji: '👀' },
  ],
  // -ar
  [
    { word: 'car', emoji: '🚗' },
    { word: 'star', emoji: '⭐' },
    { word: 'guitar', emoji: '🎸' },
  ],
  // -own
  [
    { word: 'crown', emoji: '👑' },
    { word: 'clown', emoji: '🤡' },
    { word: 'frown', emoji: '🙁' },
  ],
  // -eet
  [
    { word: 'feet', emoji: '🦶' },
    { word: 'meat', emoji: '🍖' },
    { word: 'seat', emoji: '💺' },
    { word: 'sweet', emoji: '🍬' },
  ],
  // -air
  [
    { word: 'bear', emoji: '🐻' },
    { word: 'pear', emoji: '🍐' },
    { word: 'chair', emoji: '🪑', draw: 'chair' },
  ],
  // -all
  [
    { word: 'ball', emoji: '⚽' },
    { word: 'wall', emoji: '🧱' },
    { word: 'fall', emoji: '🍂' },
    { word: 'call', emoji: '📞' },
  ],
  // -eep
  [
    { word: 'sheep', emoji: '🐑' },
    { word: 'sleep', emoji: '😴' },
    { word: 'jeep', emoji: '🚙' },
  ],
  // -an
  [
    { word: 'van', emoji: '🚐' },
    { word: 'man', emoji: '👨' },
    { word: 'can', emoji: '🥫' },
  ],
];
