// ============================================================
// SOUND WORDS — digraphs (CH, SH, TH) and vowel teams (OA)
// ============================================================
//
// Every word contains its pattern exactly once, so blanking it out never
// leaves a second copy of the pattern behind (that's why CHURCH, which has
// CH at both ends, is not here).
//
// Every picture is an emoji from Unicode 11 or older, so it renders on old
// Android phones. CHAIR and BOARD have no good emoji, so they are drawn as
// SVG by SoundGame (the `draw` field).

export interface SoundWord {
  word: string; // lowercase
  emoji: string;
  pattern: string; // lowercase digraph / vowel team inside the word
  draw?: 'chair' | 'board'; // draw an SVG instead of the emoji
}

export const DIGRAPH_PATTERNS = ['ch', 'sh', 'th'];
export const VOWEL_TEAM_OPTIONS = ['oa', 'ee', 'ai']; // OA is live; EE / AI are wrong-answer choices for now

export const chWords: SoundWord[] = [
  { word: 'chair', emoji: '🪑', pattern: 'ch', draw: 'chair' },
  { word: 'cherry', emoji: '🍒', pattern: 'ch' },
  { word: 'chain', emoji: '⛓️', pattern: 'ch' },
  { word: 'cheese', emoji: '🧀', pattern: 'ch' },
  { word: 'chicken', emoji: '🐔', pattern: 'ch' },
  { word: 'chick', emoji: '🐤', pattern: 'ch' },
  { word: 'chocolate', emoji: '🍫', pattern: 'ch' },
  { word: 'chestnut', emoji: '🌰', pattern: 'ch' },
];

export const shWords: SoundWord[] = [
  { word: 'shower', emoji: '🚿', pattern: 'sh' },
  { word: 'ship', emoji: '🚢', pattern: 'sh' },
  { word: 'shoe', emoji: '👟', pattern: 'sh' },
  { word: 'shirt', emoji: '👕', pattern: 'sh' },
  { word: 'sheep', emoji: '🐑', pattern: 'sh' },
  { word: 'shell', emoji: '🐚', pattern: 'sh' },
  { word: 'shark', emoji: '🦈', pattern: 'sh' },
  { word: 'shield', emoji: '🛡️', pattern: 'sh' },
  { word: 'shop', emoji: '🏪', pattern: 'sh' },
];

export const thWords: SoundWord[] = [
  { word: 'three', emoji: '3️⃣', pattern: 'th' },
  { word: 'thumb', emoji: '👍', pattern: 'th' },
  { word: 'thread', emoji: '🧵', pattern: 'th' },
  { word: 'thermometer', emoji: '🌡️', pattern: 'th' },
  { word: 'thunder', emoji: '⛈️', pattern: 'th' },
  { word: 'think', emoji: '💭', pattern: 'th' },
  { word: 'bath', emoji: '🛁', pattern: 'th' },
  { word: 'mouth', emoji: '👄', pattern: 'th' },
  { word: 'earth', emoji: '🌍', pattern: 'th' },
  { word: 'tooth', emoji: '🦷', pattern: 'th' },
];

export const oaWords: SoundWord[] = [
  { word: 'goat', emoji: '🐐', pattern: 'oa' },
  { word: 'boat', emoji: '⛵', pattern: 'oa' },
  { word: 'road', emoji: '🛣️', pattern: 'oa' },
  { word: 'coat', emoji: '🧥', pattern: 'oa' },
  { word: 'goal', emoji: '🥅', pattern: 'oa' },
  { word: 'loaf', emoji: '🍞', pattern: 'oa' },
  { word: 'soap', emoji: '🧼', pattern: 'oa' },
  { word: 'board', emoji: '📋', pattern: 'oa', draw: 'board' },
];

export const allDigraphWords: SoundWord[] = [...chWords, ...shWords, ...thWords];
