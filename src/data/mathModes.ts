/**
 * mathModes.ts — Math as four games instead of one worksheet.
 *
 * The old screen was a single multiple-choice quiz: ten questions, four
 * coloured buttons, tap one. The only visual support was a row of emoji dots,
 * and those only appeared for `easy` addition — so subtraction, and every
 * problem above the easiest band, was pure symbols with nothing to hold onto.
 *
 * These four modes each teach a different piece of early number sense, and
 * every one of them shows the quantity, not just the numeral.
 */

export type Band = 'easy' | 'medium' | 'hard';

export interface Question {
  /** what the child is asked, spoken aloud */
  prompt: string;
  answer: number;
  options: number[];
  /** the two quantities being worked with, for the counters */
  a: number;
  b: number;
  op: '+' | '-' | 'count' | 'compare';
  /** for compare mode: true when the bigger group is the answer */
  wantBigger?: boolean;
  /** objects to count in Count It */
  icon?: string;
}

const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

/**
 * Distractors that are *near* the answer, and never impossible.
 *
 * The old generator could offer 0 and 5 as choices for 1 + 1 — a child who
 * can't add still knows the answer isn't zero, so those options teach nothing
 * and make the quiz easier than it looks. Near-misses (one more, one less,
 * the two numbers swapped) are the mistakes children actually make, so getting
 * it right means something.
 */
const optionsFor = (answer: number, max: number): number[] => {
  const set = new Set<number>([answer]);
  const candidates = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10];
  for (const c of candidates) {
    if (set.size >= 4) break;
    if (c >= 0 && c <= max + 4 && c !== answer) set.add(c);
  }
  while (set.size < 4) set.add(rnd(0, max + 2));
  return shuffle([...set]).slice(0, 4);
};

const RANGE: Record<Band, { max: number; frame: 5 | 10 }> = {
  easy: { max: 5, frame: 5 },
  medium: { max: 10, frame: 10 },
  hard: { max: 20, frame: 10 },
};

const COUNT_ICONS = ['🍎', '⭐', '🐟', '🌸', '🚗', '🍓', '🦋', '🍪'];

/* ------------------------------------------------------------------ */

export const makeCount = (band: Band): Question => {
  const { max } = RANGE[band];
  const n = rnd(1, max);
  return {
    prompt: 'How many are there?',
    answer: n,
    options: optionsFor(n, max),
    a: n,
    b: 0,
    op: 'count',
    icon: COUNT_ICONS[rnd(0, COUNT_ICONS.length - 1)],
  };
};

export const makeAdd = (band: Band): Question => {
  const { max } = RANGE[band];
  const a = rnd(1, Math.max(1, Math.floor(max / 2)));
  const b = rnd(1, Math.max(1, max - a));
  return {
    prompt: `What is ${a} plus ${b}?`,
    answer: a + b,
    options: optionsFor(a + b, max),
    a,
    b,
    op: '+',
  };
};

export const makeSubtract = (band: Band): Question => {
  const { max } = RANGE[band];
  const a = rnd(2, max);
  const b = rnd(1, a - 1);
  return {
    prompt: `What is ${a} take away ${b}?`,
    answer: a - b,
    options: optionsFor(a - b, max),
    a,
    b,
    op: '-',
  };
};

export const makeCompare = (band: Band): Question => {
  const { max } = RANGE[band];
  let a = rnd(1, max);
  let b = rnd(1, max);
  while (a === b) b = rnd(1, max);
  const wantBigger = Math.random() < 0.5;
  const answer = wantBigger ? Math.max(a, b) : Math.min(a, b);
  return {
    prompt: wantBigger ? 'Which group has MORE?' : 'Which group has FEWER?',
    answer,
    options: [a, b],
    a,
    b,
    op: 'compare',
    wantBigger,
  };
};

/** Add & Take Away mixes both, so a child can't answer on autopilot. */
export const makeAddOrSubtract = (band: Band): Question =>
  Math.random() < 0.5 ? makeAdd(band) : makeSubtract(band);

/* ------------------------------------------------------------------ */

export type ModeId = 'count' | 'sums' | 'line' | 'compare';

export interface MathMode {
  id: ModeId;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: number;
  learned: string;
  make: (band: Band) => Question;
}

export const MATH_MODES: MathMode[] = [
  {
    id: 'count',
    title: 'Count It',
    sub: 'How many do you see?',
    icon: '🍎',
    grad: 'from-green-500 to-emerald-600',
    shadow: '#047857',
    diff: 1,
    learned: 'Counting one by one · matching a quantity to its numeral',
    make: makeCount,
  },
  {
    id: 'sums',
    title: 'Add & Take Away',
    sub: 'Put together, take apart',
    icon: '➕',
    grad: 'from-blue-500 to-indigo-600',
    shadow: '#1E40AF',
    diff: 2,
    learned: 'Adding and subtracting with counters · number bonds',
    make: makeAddOrSubtract,
  },
  {
    id: 'line',
    title: 'Number Line',
    sub: 'Hop to the answer!',
    icon: '🐸',
    grad: 'from-purple-500 to-fuchsia-600',
    shadow: '#6B21A8',
    diff: 2,
    learned: 'Numbers in order · counting on and back · estimating',
    make: makeAddOrSubtract,
  },
  {
    id: 'compare',
    title: 'More or Fewer',
    sub: 'Which group is bigger?',
    icon: '⚖️',
    grad: 'from-orange-400 to-red-500',
    shadow: '#C2410C',
    diff: 1,
    learned: 'Comparing quantities · more, fewer and equal',
    make: makeCompare,
  },
];

export const frameSize = (band: Band): 5 | 10 => RANGE[band].frame;
export const maxFor = (band: Band): number => RANGE[band].max;
