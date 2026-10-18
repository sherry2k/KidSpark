/**
 * answerIcons.ts — a picture for every answer.
 *
 * The quiz asked "Which fruit is this?" and offered Cherry / Raspberry /
 * Strawberry / Apple as WORDS. For a four-year-old that is not a quiz, it's a
 * reading test they cannot pass — and half your audience is four to six.
 *
 * The fix isn't to remove the words. It's to show BOTH: a picture a pre-reader
 * can answer from, with the word underneath in large type. The child who can't
 * read yet succeeds; the child who is learning sees the word attached to the
 * thing every single time. That's how early reading is actually taught.
 *
 * Faces are resolved in this order, all of them font-proof where it matters:
 *   color  → a drawn circle    (never depends on a font)
 *   shape  → a drawn SVG       (never depends on a font)
 *   text   → real characters   (numbers and letters — never letter-emoji)
 *   icon   → emoji             (last resort, and swappable for real art)
 */

export interface AnswerFace {
  icon?: string;
  color?: string;
  shape?: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'rectangle' | 'oval' | 'diamond';
  text?: string;
}

const map: Record<string, AnswerFace> = {};
const add = (words: string, face: AnswerFace) => {
  words.split('|').forEach((w) => (map[w.trim()] = face));
};

/* ---------------- fruit & food ---------------- */
add('apple', { icon: '🍎' });
add('banana', { icon: '🍌' });
add('grape|grapes', { icon: '🍇' });
add('strawberry|strawberries', { icon: '🍓' });
add('cherry|cherries', { icon: '🍒' });
add('raspberry|raspberries', { icon: '🫐' });
add('orange', { icon: '🍊' });
add('pear', { icon: '🍐' });
add('watermelon|melon', { icon: '🍉' });
add('lemon', { icon: '🍋' });
add('peach', { icon: '🍑' });
add('pineapple', { icon: '🍍' });
add('kiwi', { icon: '🥝' });
add('mango', { icon: '🥭' });
add('blueberry|blueberries', { icon: '🫐' });
add('carrot', { icon: '🥕' });
add('corn', { icon: '🌽' });
add('broccoli', { icon: '🥦' });
add('tomato', { icon: '🍅' });
add('potato', { icon: '🥔' });
add('cucumber', { icon: '🥒' });
add('bread', { icon: '🍞' });
add('cheese', { icon: '🧀' });
add('egg', { icon: '🥚' });
add('milk', { icon: '🥛' });
add('cake', { icon: '🎂' });
add('cookie|biscuit', { icon: '🍪' });
add('pizza', { icon: '🍕' });
add('ice cream', { icon: '🍦' });

/* ---------------- animals ---------------- */
add('lion', { icon: '🦁' });
add('tiger', { icon: '🐯' });
add('elephant', { icon: '🐘' });
add('monkey', { icon: '🐵' });
add('giraffe', { icon: '🦒' });
add('zebra', { icon: '🦓' });
add('bear', { icon: '🐻' });
add('panda', { icon: '🐼' });
add('dog|puppy', { icon: '🐶' });
add('cat|kitten', { icon: '🐱' });
add('rabbit|bunny', { icon: '🐰' });
add('mouse', { icon: '🐭' });
add('horse', { icon: '🐴' });
add('cow', { icon: '🐄' });
add('pig', { icon: '🐷' });
add('sheep', { icon: '🐑' });
add('chicken|hen', { icon: '🐔' });
add('duck', { icon: '🦆' });
add('bird', { icon: '🐦' });
add('owl', { icon: '🦉' });
add('penguin', { icon: '🐧' });
add('fish', { icon: '🐟' });
add('shark', { icon: '🦈' });
add('whale', { icon: '🐳' });
add('dolphin', { icon: '🐬' });
add('octopus', { icon: '🐙' });
add('frog', { icon: '🐸' });
add('turtle|tortoise', { icon: '🐢' });
add('snake', { icon: '🐍' });
add('bee', { icon: '🐝' });
add('butterfly', { icon: '🦋' });
add('ant', { icon: '🐜' });
add('ladybird|ladybug', { icon: '🐞' });
add('spider', { icon: '🕷️' });
add('fox', { icon: '🦊' });
add('wolf', { icon: '🐺' });
add('deer', { icon: '🦌' });
add('kangaroo', { icon: '🦘' });
add('crocodile|alligator', { icon: '🐊' });

/* ---------------- colours (drawn, never a font) ---------------- */
add('red', { color: '#E5383B' });
add('blue', { color: '#2C7BE5' });
add('green', { color: '#3FA34D' });
add('yellow', { color: '#F5C518' });
add('orange colour|orange color', { color: '#F77F00' });
add('purple|violet', { color: '#7B2CBF' });
add('pink', { color: '#FF6BA9' });
add('brown', { color: '#8B5A3C' });
add('black', { color: '#1B1B1F' });
add('white', { color: '#FFFFFF' });
add('grey|gray', { color: '#9AA0A6' });

/* ---------------- shapes (drawn) ---------------- */
add('circle|round', { shape: 'circle' });
add('square', { shape: 'square' });
add('triangle', { shape: 'triangle' });
add('rectangle', { shape: 'rectangle' });
add('star', { shape: 'star' });
add('heart', { shape: 'heart' });
add('oval', { shape: 'oval' });
add('diamond', { shape: 'diamond' });

/* ---------------- vehicles & things ---------------- */
add('car', { icon: '🚗' });
add('bus', { icon: '🚌' });
add('train', { icon: '🚂' });
add('plane|aeroplane|airplane', { icon: '✈️' });
add('boat|ship', { icon: '⛵' });
add('bike|bicycle', { icon: '🚲' });
add('rocket', { icon: '🚀' });
add('helicopter', { icon: '🚁' });
add('truck|lorry', { icon: '🚚' });
add('tractor', { icon: '🚜' });
add('sun', { icon: '☀️' });
add('moon', { icon: '🌙' });
add('cloud', { icon: '☁️' });
add('rain', { icon: '🌧️' });
add('snow', { icon: '❄️' });
add('rainbow', { icon: '🌈' });
add('tree', { icon: '🌳' });
add('flower', { icon: '🌻' });
add('house|home', { icon: '🏠' });
add('ball', { icon: '⚽' });
add('book', { icon: '📕' });
add('clock', { icon: '🕐' });
add('key', { icon: '🔑' });
add('hat', { icon: '🎩' });
add('shoe|shoes', { icon: '👟' });

/* ================================================================== */
/* ADDED IN 1.3 — every answer word in the quiz now has a picture.     */
/* Every emoji below is Unicode 11 or older (works on old Android).    */
/* A later add() with the same word replaces an earlier one.           */
/* ================================================================== */

/* more animals */
add('koala', { icon: '🐨' });
add('rhino|rhinoceros', { icon: '🦏' });
add('raccoon', { icon: '🦝' });
add('lizard', { icon: '🦎' });
add('hippo', { icon: '🦛' });
add('eagle', { icon: '🦅' });
add('parrot', { icon: '🦜' });
add('swan', { icon: '🦢' });
add('dove', { icon: '🕊️' });
add('flamingo', { icon: '🦩' });
add('polar bear', { icon: '🐻' });

/* berries: the berry emoji is too new for many phones, so use a drawn dot */
add('raspberry|raspberries', { color: '#C2185B' });
add('blueberry|blueberries', { color: '#4B55C9' });

/* animal sounds: show the animal that makes them */
add('woof|bark', { icon: '🐶' });
add('meow', { icon: '🐱' });
add('moo', { icon: '🐄' });
add('baa', { icon: '🐑' });
add('oink', { icon: '🐷' });
add('quack', { icon: '🦆' });
add('roar', { icon: '🦁' });
add('neigh', { icon: '🐴' });
add('hiss', { icon: '🐍' });

/* things */
add('cube', { icon: '📦' });
add('pumpkin', { icon: '🎃' });
add('rice', { icon: '🍚' });
add('wheat', { icon: '🌾' });

/* sea animals */
add('crab', { icon: '🦀' });
add('shrimp', { icon: '🦐' });
add('squid', { icon: '🦑' });
add('lobster', { icon: '🦞' });
add('pufferfish', { icon: '🐡' });
add('tropical fish', { icon: '🐠' });

/* insects */
add('mosquito', { icon: '🦟' });
add('cricket', { icon: '🦗' });
add('snail', { icon: '🐌' });
add('caterpillar', { icon: '🐛' });

/* weather and clothes */
add('umbrella', { icon: '☂️' });
add('gloves', { icon: '🧤' });
add('sunglasses', { icon: '🕶️' });
add('scarf', { icon: '🧣' });
add('boots', { icon: '👢' });
add('socks', { icon: '🧦' });
add('shirt', { icon: '👕' });
add('coat', { icon: '🧥' });
add('sunny', { icon: '☀️' });
add('rainy', { icon: '🌧️' });
add('snowy', { icon: '❄️' });
add('windy', { icon: '🌬️' });
add('foggy|fog', { icon: '🌫️' });
add('stormy|thunder', { icon: '⛈️' });

/* feelings */
add('happy', { icon: '😀' });
add('sad', { icon: '😢' });
add('angry', { icon: '😠' });
add('sleepy', { icon: '😴' });
add('scared', { icon: '😨' });
add('surprised', { icon: '😮' });
add('sick', { icon: '🤒' });
add('excited', { icon: '🤩' });
add('silly', { icon: '😜' });
add('loved', { icon: '😍' });

/* opposites */
add('hot', { icon: '🔥' });
add('cold', { icon: '🥶' });
add('big', { icon: '🐘' });
add('small', { icon: '🐜' });
add('tall', { icon: '🦒' });
add('fast', { icon: '🐆' });
add('slow', { icon: '🐢' });
add('day', { icon: '☀️' });
add('night', { icon: '🌙' });
add('up', { icon: '⬆️' });
add('down', { icon: '⬇️' });
add('open', { icon: '📖' });
add('closed', { icon: '📕' });
add('wet', { icon: '💧' });
add('dry', { icon: '🏜️' });
add('old', { icon: '👴' });
add('young', { icon: '👶' });
add('loud', { icon: '📣' });
add('quiet', { icon: '🤫' });

/* days, months, seasons: real letters, never an emoji */
add('monday', { text: 'Mon' });
add('tuesday', { text: 'Tue' });
add('wednesday', { text: 'Wed' });
add('thursday', { text: 'Thu' });
add('friday', { text: 'Fri' });
add('saturday', { text: 'Sat' });
add('sunday', { text: 'Sun' });
add('january', { text: 'Jan' });
add('february', { text: 'Feb' });
add('march', { text: 'Mar' });
add('april', { text: 'Apr' });
add('june', { text: 'Jun' });
add('july', { text: 'Jul' });
add('august', { text: 'Aug' });
add('september', { text: 'Sep' });
add('october', { text: 'Oct' });
add('november', { text: 'Nov' });
add('december', { text: 'Dec' });
add('spring', { icon: '🌸' });
add('summer', { icon: '☀️' });
add('autumn', { icon: '🍁' });
add('winter', { icon: '❄️' });

/* food and drinks */
add('noodles', { icon: '🍜' });
add('burger', { icon: '🍔' });
add('juice', { icon: '🍹' });
add('tea', { icon: '🍵' });
add('water', { icon: '💧' });
add('honey', { icon: '🍯' });

const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', twenty: '20',
};

/**
 * Resolve an answer string to something drawable.
 * Returns null when we have nothing — the option then shows the word alone,
 * which is still correct, just less helpful.
 */
export function faceFor(answer: string): AnswerFace | null {
  if (!answer) return null;
  const key = answer.trim().toLowerCase().replace(/[.!?]$/, '');

  if (map[key]) return map[key];

  // simple plurals: bananas → banana, berries → berry, boxes → box
  const singulars = [
    key.replace(/ies$/, 'y'),
    key.replace(/(ch|sh|s|x|z)es$/, '$1'),
    key.replace(/s$/, ''),
  ];
  for (const sing of singulars) {
    if (sing !== key && map[sing]) return map[sing];
  }

  // bare numerals and number words render as real characters
  if (/^\d{1,3}$/.test(key)) return { text: key };
  if (NUMBER_WORDS[key]) return { text: NUMBER_WORDS[key] };

  // single letters — never a letter-emoji, which is how © crept in elsewhere
  if (/^[a-z]$/.test(key)) return { text: key.toUpperCase() };

  // "a red apple" → apple ; "the lion" → lion
  const words = key.split(/\s+/);
  for (let i = words.length - 1; i >= 0; i--) {
    if (map[words[i]]) return map[words[i]];
  }

  return null;
}

/** Friendly category names — the old bar showed a bare emoji under "Category". */
export const CATEGORY_LABEL: Record<string, { label: string; icon: string }> = {
  animals: { label: 'Animals', icon: '🦁' },
  fruits: { label: 'Fruits', icon: '🍎' },
  colors: { label: 'Colours', icon: '🎨' },
  colours: { label: 'Colours', icon: '🎨' },
  numbers: { label: 'Numbers', icon: '🔢' },
  shapes: { label: 'Shapes', icon: '🔺' },
  vehicles: { label: 'Vehicles', icon: '🚗' },
  math: { label: 'Maths', icon: '🧮' },
  food: { label: 'Food', icon: '🍽️' },
  nature: { label: 'Nature', icon: '🌳' },
  // added in 1.3
  vegetables: { label: 'Vegetables', icon: '🥕' },
  birds: { label: 'Birds', icon: '🦅' },
  sounds: { label: 'Sounds', icon: '🔊' },
  sea: { label: 'Sea animals', icon: '🐠' },
  insects: { label: 'Insects', icon: '🐞' },
  weather: { label: 'Weather', icon: '⛅' },
  feelings: { label: 'Feelings', icon: '😊' },
  opposites: { label: 'Opposites', icon: '↔️' },
  time: { label: 'Days & seasons', icon: '📅' },
};

export const categoryOf = (c?: string) =>
  (c && CATEGORY_LABEL[c.toLowerCase()]) || { label: 'Quiz', icon: '❓' };
