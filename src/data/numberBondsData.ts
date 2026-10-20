// ============================================================
// NUMBER BONDS: levels and question maker
// ============================================================
//
// A number bond is a pair of numbers that make a total: 7 and 3 make 10.
// Every question shows   [first] + [second] = [total]   with ONE of the two
// parts hidden. The child taps the missing part.
//
//   easy    "Make 5"            dots are shown, both orders (2 + ? = 5, ? + 3 = 5)
//   medium  "Make 10"           dots are shown (a ten frame), missing part is second
//   hard    "Make 10: think!"   no dots at first, both orders. The dots appear
//                               as a hint after the first wrong answer.
//
// To add a level (for example "Make 20") add ONE line to BOND_LEVELS. Nothing
// else needs to change: the dots frame works for totals up to 20.
//
// Pure functions only, so they can be tested without React.

export type BondBand = 'easy' | 'medium' | 'hard';

export interface BondLevel {
  id: string;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
  band: BondBand;
  /** the total the two parts make */
  total: number;
  /** show the dots from the start (otherwise only after a wrong answer) */
  dots: boolean;
  /** the hidden part can be the first number as well as the second */
  bothOrders: boolean;
}

export const BOND_LEVELS: BondLevel[] = [
  { id: '5', title: 'Make 5', sub: 'Friends that make 5', icon: '✋', grad: 'from-yellow-400 to-orange-500', shadow: '#C2410C', diff: 1, band: 'easy', total: 5, dots: true, bothOrders: true },
  { id: '10', title: 'Make 10', sub: 'Friends that make 10', icon: '🔟', grad: 'from-pink-400 to-rose-500', shadow: '#BE123C', diff: 2, band: 'medium', total: 10, dots: true, bothOrders: false },
  { id: '10h', title: 'Make 10: think!', sub: 'No dots, any order', icon: '🧠', grad: 'from-indigo-500 to-purple-600', shadow: '#4338CA', diff: 3, band: 'hard', total: 10, dots: false, bothOrders: true },
];

export interface BondQuestion {
  total: number;
  first: number;
  second: number;
  /** which part the child has to find */
  hide: 'first' | 'second';
  /** the missing number */
  answer: number;
  /** the number that is showing */
  known: number;
  /** four answer buttons, smallest first, always contains the answer */
  choices: number[];
}

export const QUESTIONS_PER_GAME = 8;

export const shuffle = <T,>(items: T[], rng: () => number = Math.random): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Four buttons: the answer, the number already showing (the classic wrong
 * answer: "7 and 7?"), and random others from 0 to total. Smallest first.
 */
export const makeChoices = (total: number, answer: number, known: number, rng: () => number = Math.random): number[] => {
  const picked = new Set<number>([answer]);
  if (known !== answer && known >= 0 && known <= total) picked.add(known);
  const rest = shuffle(
    Array.from({ length: total + 1 }, (_, i) => i).filter((n) => !picked.has(n)),
    rng
  );
  for (const n of rest) {
    if (picked.size >= 4) break;
    picked.add(n);
  }
  return [...picked].sort((a, b) => a - b);
};

const build = (total: number, first: number, hide: 'first' | 'second', rng: () => number): BondQuestion => {
  const second = total - first;
  const answer = hide === 'first' ? first : second;
  const known = hide === 'first' ? second : first;
  return { total, first, second, hide, answer, known, choices: makeChoices(total, answer, known, rng) };
};

/** the same two numbers in a row would feel like a repeat (2+3 then 3+2) */
const pairKey = (q: BondQuestion) => `${Math.min(q.first, q.second)}-${Math.max(q.first, q.second)}`;
const repeatsInRow = (list: BondQuestion[]) => list.reduce((n, q, i) => (i > 0 && pairKey(q) === pairKey(list[i - 1]) ? n + 1 : n), 0);

export const buildQuestions = (level: BondLevel, count: number = QUESTIONS_PER_GAME, rng: () => number = Math.random): BondQuestion[] => {
  // every question the level can ask. first runs 1..total-1, so there is no "0 and 10"
  const all: BondQuestion[] = [];
  for (let first = 1; first < level.total; first++) {
    all.push(build(level.total, first, 'second', rng));
    if (level.bothOrders) all.push(build(level.total, first, 'first', rng));
  }

  // shuffle a few times and keep the order with the fewest "same pair twice in a row"
  let best: BondQuestion[] = [];
  let bestScore = Infinity;
  for (let attempt = 0; attempt < 30 && bestScore > 0; attempt++) {
    // when a level has fewer questions than `count`, go round again
    let pool: BondQuestion[] = [];
    while (pool.length < count) pool = pool.concat(shuffle(all, rng));
    const list = pool.slice(0, count);
    const score = repeatsInRow(list);
    if (score < bestScore) {
      best = list;
      bestScore = score;
    }
  }
  return best;
};

/** what is said out loud at the start of a question */
export const promptFor = (q: BondQuestion): string =>
  q.hide === 'second' ? `${q.first} and what make ${q.total}?` : `What and ${q.second} make ${q.total}?`;

/** what is said after a right answer */
export const rightFor = (q: BondQuestion): string => `${q.first} and ${q.second} make ${q.total}!`;
