// ============================================================
// SOUND WORDS — digraphs (CH, SH, TH), vowel teams (OA, EE, OO, OI)
// and vowels with R (AR, UR)
// ============================================================
//
// Every word contains its pattern exactly once, so blanking it out never
// leaves a second copy of the pattern behind (that's why CHURCH, which has
// CH at both ends, is not here).
//
// Every picture is an emoji from Unicode 11 or older, so it renders on old
// Android phones. CHAIR, BOARD, COIN and SOIL have no good emoji, so they are
// drawn as SVG by SoundGame (the `draw` field).
//
// WRONG ANSWERS. Each round offers three choices. A wrong choice must never be
// another way of spelling the same sound (ee/ea, oi/oy, ur/er/ir, oo/ue/ew),
// or the child would be marked wrong for a spelling that sounds right. The
// option lists below are chosen with that in mind.
//
// TO ADD A WORD: add one line to the right list. The pattern must appear
// exactly once in the word, and the emoji must be Unicode 11 or older.

export interface SoundWord {
  word: string; // lowercase
  emoji: string;
  pattern: string; // lowercase digraph / vowel team inside the word
  draw?: 'chair' | 'board' | 'coin' | 'soil'; // draw an SVG instead of the emoji
}

export const DIGRAPH_PATTERNS = ['ch', 'sh', 'th'];
export const VOWEL_TEAM_OPTIONS = ['oa', 'ee', 'ai']; // used by the OA and EE rounds
export const OO_OPTIONS = ['oo', 'oa', 'ee'];
export const OI_OPTIONS = ['oi', 'oa', 'oo']; // not "oy": it sounds the same as oi
export const AR_OPTIONS = ['ar', 'or', 'er'];
export const UR_OPTIONS = ['ur', 'ar', 'or']; // not "er" or "ir": they sound the same as ur

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

export const eeWords: SoundWord[] = [
  { word: 'tree', emoji: '🌳', pattern: 'ee' },
  { word: 'bee', emoji: '🐝', pattern: 'ee' },
  { word: 'sheep', emoji: '🐑', pattern: 'ee' },
  { word: 'feet', emoji: '🦶', pattern: 'ee' },
  { word: 'teeth', emoji: '🦷', pattern: 'ee' },
  { word: 'cheese', emoji: '🧀', pattern: 'ee' },
  { word: 'green', emoji: '💚', pattern: 'ee' },
  { word: 'jeep', emoji: '🚙', pattern: 'ee' },
  { word: 'queen', emoji: '👸', pattern: 'ee' },
  { word: 'sleep', emoji: '😴', pattern: 'ee' },
  { word: 'sweet', emoji: '🍬', pattern: 'ee' },
];

// OO says two sounds (moon, book). Both are in this round: the spelling is the same.
export const ooWords: SoundWord[] = [
  { word: 'moon', emoji: '🌙', pattern: 'oo' },
  { word: 'spoon', emoji: '🥄', pattern: 'oo' },
  { word: 'boot', emoji: '🥾', pattern: 'oo' },
  { word: 'book', emoji: '📖', pattern: 'oo' },
  { word: 'broom', emoji: '🧹', pattern: 'oo' },
  { word: 'balloon', emoji: '🎈', pattern: 'oo' },
  { word: 'kangaroo', emoji: '🦘', pattern: 'oo' },
  { word: 'school', emoji: '🏫', pattern: 'oo' },
  { word: 'tooth', emoji: '🦷', pattern: 'oo' },
  { word: 'cool', emoji: '😎', pattern: 'oo' },
  { word: 'foot', emoji: '🦶', pattern: 'oo' },
  { word: 'raccoon', emoji: '🦝', pattern: 'oo' },
];

export const oiWords: SoundWord[] = [
  { word: 'coin', emoji: '💰', pattern: 'oi', draw: 'coin' },
  { word: 'oil', emoji: '🛢️', pattern: 'oi' },
  { word: 'point', emoji: '👉', pattern: 'oi' },
  { word: 'join', emoji: '🤝', pattern: 'oi' },
  { word: 'voice', emoji: '🗣️', pattern: 'oi' },
  { word: 'noise', emoji: '🔊', pattern: 'oi' },
  { word: 'toilet', emoji: '🚽', pattern: 'oi' },
  { word: 'soil', emoji: '🌱', pattern: 'oi', draw: 'soil' },
];

export const arWords: SoundWord[] = [
  { word: 'car', emoji: '🚗', pattern: 'ar' },
  { word: 'star', emoji: '⭐', pattern: 'ar' },
  { word: 'shark', emoji: '🦈', pattern: 'ar' },
  { word: 'arm', emoji: '💪', pattern: 'ar' },
  { word: 'park', emoji: '🏞️', pattern: 'ar' },
  { word: 'cart', emoji: '🛒', pattern: 'ar' },
  { word: 'scarf', emoji: '🧣', pattern: 'ar' },
  { word: 'carrot', emoji: '🥕', pattern: 'ar' },
  { word: 'party', emoji: '🎉', pattern: 'ar' },
];

export const urWords: SoundWord[] = [
  { word: 'turtle', emoji: '🐢', pattern: 'ur' },
  { word: 'purple', emoji: '💜', pattern: 'ur' },
  { word: 'hurt', emoji: '🤕', pattern: 'ur' },
  { word: 'burger', emoji: '🍔', pattern: 'ur' },
  { word: 'surf', emoji: '🏄', pattern: 'ur' },
  { word: 'purse', emoji: '👛', pattern: 'ur' },
  { word: 'church', emoji: '⛪', pattern: 'ur' },
  { word: 'turkey', emoji: '🦃', pattern: 'ur' },
];

export const allDigraphWords: SoundWord[] = [...chWords, ...shWords, ...thWords];
