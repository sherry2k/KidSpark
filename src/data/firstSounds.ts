// ============================================================
// FIRST SOUNDS — for the "First Sound" round in the Sounds game
// ============================================================
//
// A round shows ONE picture (a cat) and three letters (B, C, M). The child
// taps the letter the word STARTS with.
//
// SAFETY RULES for adding a word:
//   1. The picture must be instantly obvious, and the word must be the only
//      natural name for it (no "puppy / dog", no "bug / caterpillar").
//   2. Pick words that start with the letter's MAIN sound: cat (c = k),
//      goat (g = hard g). No cs/sc/ph tricks, and no digraphs (sh, ch, th, wh)
//      because those have their own rounds.
//   3. Emoji must be Unicode 11 or older (older Android phones show a box).
//   4. A word may only appear once. Letters x, q, y, j and i are left out on
//      purpose: they have no clear Unicode-11 picture.
//
// c and k sound the same, so a c-word never gets "K" as a wrong answer
// (and the other way round). See CONFUSABLE below.

export interface FirstWord {
  word: string;
  emoji: string;
  /** lower-case first letter */
  letter: string;
}

const w = (word: string, emoji: string): FirstWord => ({ word, emoji, letter: word[0].toLowerCase() });

export const FIRST_WORDS: FirstWord[] = [
  w('apple', '🍎'), w('ant', '🐜'),
  w('bee', '🐝'), w('banana', '🍌'), w('bear', '🐻'), w('bus', '🚌'),
  w('cat', '🐱'), w('cow', '🐄'), w('car', '🚗'), w('carrot', '🥕'),
  w('dog', '🐶'), w('duck', '🦆'), w('drum', '🥁'), w('dinosaur', '🦖'),
  w('egg', '🥚'), w('elephant', '🐘'),
  w('fish', '🐟'), w('frog', '🐸'), w('fox', '🦊'), w('flower', '🌸'),
  w('grapes', '🍇'), w('goat', '🐐'), w('gift', '🎁'), w('guitar', '🎸'),
  w('hat', '🎩'), w('horse', '🐴'), w('house', '🏠'), w('heart', '❤️'),
  w('key', '🔑'), w('koala', '🐨'), w('kangaroo', '🦘'),
  w('lion', '🦁'), w('leaf', '🍃'), w('lemon', '🍋'), w('ladybug', '🐞'),
  w('moon', '🌙'), w('monkey', '🐒'), w('mouse', '🐭'), w('mushroom', '🍄'),
  w('nose', '👃'), w('note', '🎵'),
  w('orange', '🍊'), w('octopus', '🐙'), w('ox', '🐂'),
  w('pig', '🐷'), w('pizza', '🍕'), w('panda', '🐼'), w('pear', '🍐'), w('penguin', '🐧'),
  w('rabbit', '🐰'), w('rainbow', '🌈'), w('robot', '🤖'), w('rocket', '🚀'), w('ring', '💍'),
  w('sun', '☀️'), w('star', '⭐'), w('snake', '🐍'), w('sock', '🧦'),
  w('tree', '🌳'), w('turtle', '🐢'), w('tiger', '🐯'), w('tent', '⛺'),
  w('umbrella', '🌂'),
  w('van', '🚐'), w('violin', '🎻'), w('volcano', '🌋'),
  w('watch', '⌚'), w('wolf', '🐺'), w('watermelon', '🍉'),
  w('zebra', '🦓'),
];

/** every letter that has at least one word — the wrong answers come from here */
export const FIRST_LETTERS: string[] = Array.from(new Set(FIRST_WORDS.map((x) => x.letter))).sort();

/** letters that can sound the same as the answer, so they are never offered together */
export const CONFUSABLE: Record<string, string[]> = {
  c: ['k', 's'],
  k: ['c'],
  s: ['c'],
  g: ['j'],
  f: ['v'],
  v: ['f'],
};
