import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
import SparkResult from '../components/SparkResult';
import {
  SoundWord,
  DIGRAPH_PATTERNS,
  VOWEL_TEAM_OPTIONS,
  chWords,
  shWords,
  thWords,
  oaWords,
  eeWords,
  ooWords,
  oiWords,
  arWords,
  urWords,
  allDigraphWords,
  OO_OPTIONS,
  OI_OPTIONS,
  AR_OPTIONS,
  UR_OPTIONS,
} from '../data/soundWords';
import { RHYME_FAMILIES, RhymeWord } from '../data/rhymeWords';
import { FIRST_WORDS, FIRST_LETTERS, CONFUSABLE, FirstWord } from '../data/firstSounds';

/**
 * SoundGame — "which letters are missing?" and "which word rhymes?"
 *
 * FIRST SOUND. The child sees one picture (a cat) and three letters (B, C, M)
 * and taps the letter the word starts with. The word is only spelled out AFTER
 * the answer, so the child has to listen and think, not read. The words live in
 * src/data/firstSounds.ts.
 *
 * LETTER ROUNDS. The child sees a picture and the word with a gap, e.g. a ship
 * and "__ip", and taps the missing letter pair (ch / sh / th, the vowel teams
 * oa / ee / oo / oi, or the vowel-with-R pairs ar / ur). Tapping the picture
 * says the word aloud. The word is always shown together with a picture so the
 * child is never guessing between two real words.
 *
 * RHYME TIME. The child sees one picture and its word (a cat) and three picture
 * cards (a hat, a dog, a sun). Tap the one that rhymes. Every card has a small
 * speaker so the child can hear each word before choosing, because most
 * children at this age can't read the labels yet. The rhyme families live in
 * src/data/rhymeWords.ts.
 */

interface SoundGameProps {
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";

interface SoundMode {
  id: string;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
  pool: SoundWord[];
  options: string[];
  learned: string;
  /** 'rhyme' = the picture-card rhyming round, 'first' = the first-letter round; leave out for the missing-letters rounds */
  kind?: 'rhyme' | 'first';
  /** shows a NEW ribbon on the card */
  isNew?: boolean;
}

/** the NEW ribbon on Rhyme Time and First Sound disappears by itself after this day */
const NEW_UNTIL = '2026-12-01';
const FRESH = Date.now() < Date.parse(NEW_UNTIL);

const MODES: SoundMode[] = [
  {
    id: 'mix',
    title: 'Sound Detective',
    sub: 'ch, sh or th?',
    icon: '🔍',
    grad: 'from-indigo-500 to-purple-500',
    shadow: '#4338CA',
    diff: 2,
    pool: allDigraphWords,
    options: DIGRAPH_PATTERNS,
    learned:
      'A digraph is two letters that make one sound. This round mixes ch (cheese), sh (ship) and th (thumb). Ask your child to say the word out loud and listen for the sound before choosing.',
  },
  {
    id: 'ch',
    title: 'CH words',
    sub: 'chair, cheese, cherry',
    icon: '🧀',
    grad: 'from-amber-400 to-orange-500',
    shadow: '#C2410C',
    diff: 1,
    pool: chWords,
    options: DIGRAPH_PATTERNS,
    learned:
      'Practice with ch, the sound at the start of chair and cheese. Every word in this round starts with ch.',
  },
  {
    id: 'sh',
    title: 'SH words',
    sub: 'ship, shoe, sheep',
    icon: '🐑',
    grad: 'from-sky-400 to-blue-500',
    shadow: '#1D4ED8',
    diff: 1,
    pool: shWords,
    options: DIGRAPH_PATTERNS,
    learned:
      'Practice with sh, the "quiet" sound we make for ship and shoe. Every word in this round starts with sh.',
  },
  {
    id: 'th',
    title: 'TH words',
    sub: 'thumb, three, bath',
    icon: '🦷',
    grad: 'from-pink-400 to-rose-500',
    shadow: '#BE185D',
    diff: 2,
    pool: thWords,
    options: DIGRAPH_PATTERNS,
    learned:
      'Practice with th, made with the tongue between the teeth. Most words start with th, and a few (bath, mouth, earth, tooth) end with it.',
  },
  {
    id: 'oa',
    title: 'OA team',
    sub: 'goat, boat, coat',
    icon: '🐐',
    grad: 'from-emerald-400 to-teal-500',
    shadow: '#0F766E',
    diff: 2,
    pool: oaWords,
    options: VOWEL_TEAM_OPTIONS,
    learned:
      'A vowel team is two vowels that work together. When o and a sit side by side they usually say the long "o" sound, as in goat and boat.',
  },
  {
    id: 'ee',
    title: 'EE team',
    sub: 'bee, tree, sheep',
    icon: '🐝',
    grad: 'from-lime-400 to-green-500',
    shadow: '#15803D',
    diff: 1,
    pool: eeWords,
    options: VOWEL_TEAM_OPTIONS,
    learned:
      'When two e letters sit side by side they say the long "ee" sound, as in bee and tree. Ask your child to say the word out loud, stretch the "eee" sound, and then pick the letters.',
  },
  {
    id: 'oo',
    title: 'OO team',
    sub: 'moon, spoon, book',
    icon: '🌙',
    grad: 'from-violet-500 to-purple-600',
    shadow: '#6D28D9',
    diff: 2,
    pool: ooWords,
    options: OO_OPTIONS,
    learned:
      'The letters oo make two different sounds: a long "oo" as in moon and spoon, and a short "oo" as in book and foot. Both are in this round, because the spelling is the same. Say each word out loud together.',
  },
  {
    id: 'oi',
    title: 'OI team',
    sub: 'coin, oil, point',
    icon: '🛢️',
    grad: 'from-rose-400 to-red-500',
    shadow: '#B91C1C',
    diff: 2,
    pool: oiWords,
    options: OI_OPTIONS,
    learned:
      'The letters oi make the "oy" sound in coin, oil and point. Ask your child to listen for that sound in the middle of the word before choosing.',
  },
  {
    id: 'ar',
    title: 'AR words',
    sub: 'car, star, shark',
    icon: '🚗',
    grad: 'from-cyan-400 to-sky-500',
    shadow: '#0369A1',
    diff: 2,
    pool: arWords,
    options: AR_OPTIONS,
    learned:
      'When a is followed by r, the vowel changes: ar says "ah" as in car and star. This round mixes ar with or and er so your child learns to tell them apart. Say the word out loud and listen for the "ah".',
  },
  {
    id: 'ur',
    title: 'UR words',
    sub: 'turtle, burger, hurt',
    icon: '🐢',
    grad: 'from-fuchsia-500 to-pink-500',
    shadow: '#A21CAF',
    diff: 3,
    pool: urWords,
    options: UR_OPTIONS,
    learned:
      'The letters ur make the "er" sound, as in turtle and burger. The same sound can also be spelled er and ir (as in bird), which come later, so this round only asks ur against ar and or.',
  },
  {
    id: 'rhyme',
    title: 'Rhyme Time',
    sub: 'cat, hat, bat',
    icon: '🎵',
    grad: 'from-orange-400 to-pink-500',
    shadow: '#C2410C',
    diff: 1,
    pool: [],
    options: [],
    kind: 'rhyme',
    isNew: FRESH,
    learned:
      'Rhyming words end with the same sound, like cat and hat. Hearing rhymes trains the ear to notice the sounds inside words, which is a first step towards reading. Say each word out loud together, and have fun making up silly rhymes at home. The spelling can differ (feet and meat rhyme), so listen rather than look.',
  },
  {
    id: 'first',
    title: 'First Sound',
    sub: 'cat starts with C',
    icon: '🔡',
    grad: 'from-teal-400 to-cyan-500',
    shadow: '#0E7490',
    diff: 1,
    pool: [],
    options: [],
    kind: 'first',
    isNew: FRESH,
    learned:
      'Hearing the first sound of a word is one of the strongest early-reading skills. Ask your child to say the word slowly ("c-c-cat"), listen to the very first sound, and then find the letter that makes it. A few letters sound alike (c and k, for example); those are never offered together.',
  },
];

/** how the mode cards are grouped on the picker; a mode not listed here goes into a last group */
const SECTIONS: { title: string; hint: string; ids: string[] }[] = [
  { title: 'Digraphs', hint: 'ch · sh · th', ids: ['mix', 'ch', 'sh', 'th'] },
  { title: 'Vowel teams', hint: 'oa · ee · oo · oi', ids: ['oa', 'ee', 'oo', 'oi'] },
  { title: 'Vowels with R', hint: 'ar · ur', ids: ['ar', 'ur'] },
  { title: 'Rhymes & first sounds', hint: 'cat · hat · b · c', ids: ['rhyme', 'first'] },
];

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

interface LetterQuestion {
  kind: 'letters';
  entry: SoundWord;
  options: string[];
}

interface RhymeQuestion {
  kind: 'rhyme';
  target: RhymeWord; // the word shown at the top
  answer: string; // the word that rhymes with it
  choices: RhymeWord[]; // three cards, one of them is the answer
}

interface FirstQuestion {
  kind: 'first';
  entry: FirstWord; // the picture
  letter: string; // the right letter (lower case)
  options: string[]; // three letters, one of them is the answer
}

type Question = LetterQuestion | RhymeQuestion | FirstQuestion;

const buildRhymeQuestions = (): RhymeQuestion[] => {
  // one question per family, so no round repeats the same rhyme
  const families = shuffle(RHYME_FAMILIES).slice(0, TOTAL);
  return families.map((family) => {
    const [target, answer] = shuffle(family);
    // two wrong cards from two DIFFERENT other families
    const others = shuffle(RHYME_FAMILIES.filter((f) => f !== family)).slice(0, 2);
    const wrong = others.map((f) => f[Math.floor(Math.random() * f.length)]);
    return {
      kind: 'rhyme' as const,
      target,
      answer: answer.word,
      choices: shuffle([answer, ...wrong]),
    };
  });
};

const buildFirstQuestions = (): FirstQuestion[] => {
  // eight different letters, so a round never repeats a letter
  const seen = new Set<string>();
  const picked: FirstWord[] = [];
  for (const entry of shuffle(FIRST_WORDS)) {
    if (seen.has(entry.letter)) continue;
    seen.add(entry.letter);
    picked.push(entry);
    if (picked.length === TOTAL) break;
  }
  return picked.map((entry) => {
    const banned = new Set([entry.letter, ...(CONFUSABLE[entry.letter] ?? [])]);
    const wrong: string[] = [];
    for (const l of shuffle(FIRST_LETTERS)) {
      if (banned.has(l)) continue;
      // two wrong letters that don't sound alike each other either
      if (wrong.some((x) => (CONFUSABLE[x] ?? []).includes(l))) continue;
      wrong.push(l);
      if (wrong.length === 2) break;
    }
    return { kind: 'first' as const, entry, letter: entry.letter, options: shuffle([entry.letter, ...wrong]) };
  });
};

const buildQuestions = (mode: SoundMode): Question[] =>
  mode.kind === 'rhyme'
    ? buildRhymeQuestions()
    : mode.kind === 'first'
    ? buildFirstQuestions()
    : shuffle(mode.pool)
        .slice(0, TOTAL)
        .map((entry) => ({ kind: 'letters' as const, entry, options: shuffle(mode.options) }));

/** what Spark's voice says when a question appears */
const promptFor = (q: Question): string =>
  q.kind === 'rhyme'
    ? `Which word rhymes with ${q.target.word}?`
    : q.kind === 'first'
    ? `What does ${q.entry.word} start with?`
    : q.entry.word;

/** Splits "ship" around "sh" -> ["", "ip"]. The pattern appears once per word. */
const splitWord = (w: SoundWord): [string, string] => {
  const i = w.word.indexOf(w.pattern);
  return [w.word.slice(0, i), w.word.slice(i + w.pattern.length)];
};

const OPTION_COLORS = [
  { bg: '#2C7BE5', sh: '#1E40AF' },
  { bg: '#57CC5B', sh: '#047857' },
  { bg: '#F0522B', sh: '#C2410C' },
];

/* ------------------------------------------------------------------ */
/* Pictures: emoji, or drawn SVG where no good emoji exists            */
/* ------------------------------------------------------------------ */

const WordPicture: React.FC<{ entry: { word: string; emoji: string; draw?: SoundWord['draw'] }; size: number }> = ({
  entry,
  size,
}) => {
  if (entry.draw === 'chair') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="chair">
        <rect x="28" y="8" width="44" height="36" rx="6" fill="#C98A4B" stroke="#7A4A21" strokeWidth="3" />
        <line x1="42" y1="12" x2="42" y2="40" stroke="#7A4A21" strokeWidth="3" />
        <line x1="58" y1="12" x2="58" y2="40" stroke="#7A4A21" strokeWidth="3" />
        <rect x="20" y="46" width="60" height="12" rx="5" fill="#E0A15F" stroke="#7A4A21" strokeWidth="3" />
        <rect x="26" y="58" width="9" height="32" rx="3" fill="#C98A4B" stroke="#7A4A21" strokeWidth="3" />
        <rect x="65" y="58" width="9" height="32" rx="3" fill="#C98A4B" stroke="#7A4A21" strokeWidth="3" />
      </svg>
    );
  }
  if (entry.draw === 'board') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="board">
        <rect x="6" y="14" width="88" height="62" rx="6" fill="#8B5A2B" />
        <rect x="12" y="20" width="76" height="50" rx="3" fill="#2F6B4F" />
        <path d="M22 36 q7 -9 14 0 t14 0 t14 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 54 h30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M58 54 h14" fill="none" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
        <rect x="10" y="76" width="80" height="6" rx="2" fill="#6B4423" />
        <rect x="64" y="72" width="12" height="4" rx="1.5" fill="#fff" />
      </svg>
    );
  }
  if (entry.draw === 'coin') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="coin">
        <ellipse cx="50" cy="86" rx="30" ry="5" fill="rgba(0,0,0,.12)" />
        <circle cx="50" cy="48" r="38" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
        <circle cx="50" cy="48" r="29" fill="#FCD34D" stroke="#D97706" strokeWidth="3" />
        <path d="M50 28 L55 42 L70 42 L58 51 L62 66 L50 57 L38 66 L42 51 L30 42 L45 42 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (entry.draw === 'soil') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="soil">
        <path d="M6 88 Q 50 22 94 88 Z" fill="#7C4A21" stroke="#4A2C10" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="34" cy="76" r="3" fill="#4A2C10" />
        <circle cx="62" cy="70" r="3.5" fill="#4A2C10" />
        <circle cx="48" cy="82" r="2.5" fill="#4A2C10" />
        <path d="M50 52 L50 30" fill="none" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 34 Q 36 32 32 20 Q 46 20 50 34 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M50 38 Q 64 36 68 24 Q 54 24 50 38 Z" fill="#86EFAC" stroke="#15803D" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return <ItemIcon icon={entry.emoji} size={size} label={entry.word} />;
};

/* ------------------------------------------------------------------ */
/* A tile for one letter                                               */
/* ------------------------------------------------------------------ */

const Letter: React.FC<{ ch: string }> = ({ ch }) => (
  <div
    className="bg-white rounded-xl flex items-center justify-center border-4"
    style={{
      borderColor: '#CBD5E1',
      width: 40,
      height: 54,
      boxShadow: '0 4px 0 #CBD5E1',
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 30,
      color: '#334155',
      lineHeight: 1,
    }}
  >
    {ch}
  </div>
);

/* ------------------------------------------------------------------ */
/* A picture card in Rhyme Time                                        */
/* ------------------------------------------------------------------ */

const RhymeCard: React.FC<{
  word: RhymeWord;
  index: number;
  answer: string;
  picked: string | null;
  onPick: (w: string) => void;
}> = ({ word, index, answer, picked, onPick }) => {
  const done = picked !== null;
  const isRight = word.word === answer;
  const isPicked = picked === word.word;

  let bg = '#fff';
  let border = '#fff';
  let shadow = '#D8CFE6';
  if (done && isRight) {
    bg = '#DCFCE7';
    border = '#22C55E';
    shadow = '#15803D';
  } else if (done && isPicked) {
    bg = '#FEE2E2';
    border = '#EF4444';
    shadow = '#B91C1C';
  }

  return (
    <motion.button
      onClick={() => onPick(word.word)}
      disabled={done}
      aria-label={word.word}
      style={{
        position: 'relative',
        background: bg,
        border: `4px solid ${border}`,
        borderRadius: 22,
        boxShadow: `0 6px 0 ${shadow}`,
        minHeight: 128,
        opacity: done && !isRight && !isPicked ? 0.5 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
      initial={{ scale: 0, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, ...POP }}
      whileTap={!done ? { scale: 0.95, y: 3 } : {}}
    >
      {done && isRight && (
        <span style={{ position: 'absolute', left: 6, top: 3, fontSize: 18, lineHeight: 1 }}>✅</span>
      )}
      {done && isPicked && !isRight && (
        <span style={{ position: 'absolute', left: 8, top: 3, fontSize: 18, lineHeight: 1, color: '#DC2626' }}>✗</span>
      )}

      {/* hear this word without choosing it */}
      <span
        role="button"
        tabIndex={0}
        aria-label={`Hear ${word.word}`}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          speak(word.word);
        }}
        style={{ position: 'absolute', right: 6, top: 4, fontSize: 16, lineHeight: 1, opacity: 0.6, cursor: 'pointer' }}
      >
        🔊
      </span>

      <div style={{ marginTop: 10 }}>
        <WordPicture entry={word} size={58} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, color: '#1E2A4A', lineHeight: 1 }}>
        {word.word}
      </span>
    </motion.button>
  );
};

/* ================================================================== */
/* The screen                                                          */
/* ================================================================== */

const SoundGame: React.FC<SoundGameProps> = ({ progress, onBack, onAnswer, onComplete }) => {
  const [mode, setMode] = useState<SoundMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const awarded = useRef(false);
  const scoreRef = useRef(0); // always current, so the last answer counts toward the stars
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(
    () => () => {
      clearTimer();
      stopSpeaking();
    },
    []
  );

  const startMode = (m: SoundMode) => {
    clearTimer();
    playClick();
    buzz('tick');
    const qs = buildQuestions(m);
    setMode(m);
    setQuestions(qs);
    setQIndex(0);
    scoreRef.current = 0;
    setScore(0);
    setStreak(0);
    setPicked(null);
    setFeedback(null);
    setDone(false);
    awarded.current = false;
    speak(`${m.title}. ${promptFor(qs[0])}`);
  };

  const leaveToMenu = () => {
    clearTimer();
    stopSpeaking();
    setFeedback(null);
    setMode(null);
  };

  const nextQuestion = () => {
    if (!mode) return;
    if (qIndex + 1 >= questions.length) {
      setDone(true);
      playComplete();
      buzz('success');
      if (!awarded.current) {
        awarded.current = true;
        const finalScore = scoreRef.current;
        onComplete(finalScore >= TOTAL * 0.8 ? 3 : finalScore >= TOTAL * 0.5 ? 2 : 1);
      }
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
    const next = questions[qIndex + 1];
    timer.current = window.setTimeout(() => speak(promptFor(next)), 120);
  };

  const resolve = (value: string) => {
    const q = questions[qIndex];
    if (picked !== null || !q) return;
    setPicked(value);

    const right =
      q.kind === 'rhyme' ? value === q.answer : q.kind === 'first' ? value === q.letter : value === q.entry.pattern;
    onAnswer(right);

    // what we say and show
    let yes: string;
    let yesSpoken: string;
    let no: string;
    if (q.kind === 'rhyme') {
      yes = `Yes! ${q.target.word} rhymes with ${q.answer}.`;
      yesSpoken = yes;
      no = `${q.target.word} rhymes with ${q.answer}.`;
    } else if (q.kind === 'first') {
      yes = `Yes! ${q.entry.word} starts with ${q.letter.toUpperCase()}.`;
      yesSpoken = yes;
      no = `${q.entry.word} starts with ${q.letter.toUpperCase()}.`;
    } else {
      yes = `Yes! ${q.entry.word}.`;
      yesSpoken = yes;
      no = `${q.entry.word} has ${q.entry.pattern.toUpperCase()}.`;
    }

    if (right) {
      playCorrect();
      buzz('soft');
      scoreRef.current += 1;
      setScore(scoreRef.current);
      const st = streak + 1;
      setStreak(st);
      setFeedback(st >= 3 ? `${st} in a row! 🔥` : yes);
      speak(st >= 3 ? `${st} in a row!` : yesSpoken);
      timer.current = window.setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, q.kind === 'rhyme' ? 1700 : q.kind === 'first' ? 1500 : 1100);
    } else {
      playWrong();
      buzz('oops');
      setStreak(0);
      setFeedback(no);
      speak(no);
      timer.current = window.setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, 2600);
    }
  };

  /* ---------------- mode picker ---------------- */
  if (!mode) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🔤 Sounds" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto pb-4 pt-1" style={{ padding: '4px 12px 16px' }}>
            <h2 className="font-bold text-gray-800 text-center" style={{ fontFamily: FONT, fontSize: 18, marginBottom: 8 }}>
              Pick a sound game! 🔤
            </h2>

            {(() => {
              const unlisted = MODES.filter((m) => !SECTIONS.some((sec) => sec.ids.includes(m.id)));
              const all = unlisted.length
                ? [...SECTIONS, { title: 'More', hint: '', ids: unlisted.map((m) => m.id) }]
                : SECTIONS;
              // NEW cards go to the top: a section that holds a NEW card comes first,
              // and inside a section the NEW cards come first.
              const modesOf = (sec: { ids: string[] }) =>
                sec.ids
                  .map((id) => MODES.find((m) => m.id === id))
                  .filter((m): m is SoundMode => !!m)
                  .sort((x, y) => Number(!!y.isNew) - Number(!!x.isNew));
              const sections = all
                .map((sec) => ({ sec, modes: modesOf(sec) }))
                .sort((x, y) => Number(y.modes.some((m) => m.isNew)) - Number(x.modes.some((m) => m.isNew)));
              let n = 0; // running card number, for the entrance delay
              return sections.map(({ sec, modes }) => (
                <div key={sec.title} className="max-w-lg mx-auto" data-kind="section" style={{ marginBottom: 10 }}>
                  <h3
                    className="font-bold text-gray-600 flex items-baseline gap-2"
                    style={{ fontFamily: FONT, fontSize: 13, padding: '0 2px', marginBottom: 5 }}
                  >
                    {sec.title}
                    {sec.hint && <span className="font-semibold text-gray-400" style={{ fontSize: 11 }}>{sec.hint}</span>}
                  </h3>
                  {/* four cards per row, so the whole picker still fits on one phone screen */}
                  <div className="flex flex-wrap" style={{ gap: 6 }}>
                    {modes.map((m) => {
                      const i = n++;
                      return (
                        <motion.button
                          key={m.id}
                          data-kind="mode"
                          data-id={m.id}
                          onClick={() => startMode(m)}
                          className={`relative overflow-hidden text-white border-white bg-gradient-to-br ${m.grad}`}
                          style={{
                            width: 'calc((100% - 18px) / 4)',
                            minHeight: 114,
                            borderRadius: 18,
                            borderWidth: 3,
                            borderStyle: 'solid',
                            boxShadow: `0 5px 0 ${m.shadow}, 0 8px 14px rgba(0,0,0,.16)`,
                            padding: '10px 3px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: Math.min(i, 10) * 0.04, ...POP }}
                          whileTap={{ scale: 0.94, y: 3 }}
                        >
                          {m.isNew && (
                            <div
                              data-kind="new"
                              className="absolute text-center text-white font-bold bg-gradient-to-r from-red-500 to-pink-500 shadow-md"
                              style={{ top: 7, right: -22, width: 70, transform: 'rotate(40deg)', fontSize: 9, letterSpacing: '1px', padding: '1px 0', borderTop: '1.5px solid #fff', borderBottom: '1.5px solid #fff' }}
                            >
                              NEW
                            </div>
                          )}
                          <ItemIcon icon={m.icon} size={40} label={m.title} />
                          <span
                            className="font-bold text-center"
                            style={{ fontFamily: FONT, fontSize: 13, lineHeight: 1.05, textShadow: '1px 1px 0 rgba(0,0,0,.18)' }}
                          >
                            {m.title}
                          </span>
                          <span className="flex" style={{ gap: 1 }}>
                            {[1, 2, 3].map((d) => (
                              <span key={d} style={{ fontSize: 9, opacity: d <= m.diff ? 1 : 0.28 }}>
                                ⭐
                              </span>
                            ))}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ---------------- result ---------------- */
  if (done) {
    const stars = score >= TOTAL * 0.8 ? 3 : score >= TOTAL * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title={`🔤 ${mode.title}`} onBack={() => { playClick(); leaveToMenu(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <SparkResult stars={stars} />
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: FONT }}>
                {stars === 3 ? 'Sound star!' : 'Good work!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT, fontWeight: 700 }}
              >
                <span style={{ fontSize: 44, color: '#2C7BE5' }}>{score}</span>
                <span className="text-gray-400" style={{ fontSize: 22 }}>/{TOTAL}</span>
              </div>

              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-4xl"
                    style={{ opacity: i < stars ? 1 : 0.2 }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.14, type: 'spring' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
                <p className="text-sm text-gray-600 font-semibold">{mode.learned}</p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={() => startMode(mode)}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); leaveToMenu(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 5px 0 #1E40AF', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔤 New game
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  const current = questions[qIndex];
  if (!current) return null;
  const answered = picked !== null;

  /* the progress dots + streak row, shared by both kinds of round */
  const progressRow = (
    <div className="flex items-center justify-between w-full max-w-sm mt-1 mb-2">
      <div className="flex gap-1">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: 9,
              height: 9,
              background: i < qIndex ? '#22C55E' : i === qIndex ? '#F97316' : 'rgba(0,0,0,.14)',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: FONT }}>
          {score} right
        </span>
        {streak >= 2 && (
          <motion.span className="text-xs font-bold text-orange-500" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            🔥{streak}
          </motion.span>
        )}
      </div>
    </div>
  );

  const feedbackRow = (
    <div className="h-12 flex items-center mt-2">
      <AnimatePresence>
        {feedback && (
          <motion.p
            className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-2xl text-sm text-center max-w-xs"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={POP}
            style={{ fontFamily: FONT }}
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  /* ---------------- playing: Rhyme Time ---------------- */
  if (current.kind === 'rhyme') {
    const { target, choices, answer } = current;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation
            title={`🔤 ${mode.title}`}
            onBack={() => { playClick(); leaveToMenu(); }}
            stars={progress.stars}
            showProgress
            progress={(qIndex / TOTAL) * 100}
          />

          <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
            {progressRow}

            {/* prompt */}
            <motion.div
              key={`p-${qIndex}`}
              className={`w-full max-w-sm rounded-2xl px-4 py-3 mb-3 text-white border-4 border-white text-center bg-gradient-to-r ${mode.grad}`}
              style={{ boxShadow: `0 5px 0 ${mode.shadow}`, fontFamily: FONT }}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={POP}
            >
              <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
                Which word rhymes? 🎵
              </span>
            </motion.div>

            {/* the word to rhyme with — tap to hear */}
            <motion.button
              key={`t-${qIndex}`}
              onClick={() => { buzz('tick'); speak(`Which word rhymes with ${target.word}?`); }}
              className="bg-white/95 rounded-3xl border-4 border-white flex flex-col items-center"
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', padding: '12px 28px 10px', gap: 2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={POP}
              whileTap={{ scale: 0.95, y: 2 }}
            >
              <WordPicture entry={target} size={88} />
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#1E2A4A', lineHeight: 1 }}>
                {target.word}
              </span>
              <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: FONT }}>
                🔊 tap to hear
              </span>
            </motion.button>

            <p
              className="font-bold"
              style={{ fontFamily: FONT, fontSize: 15, color: '#7C3AED', margin: '10px 0 8px' }}
            >
              🎵 rhymes with… 🎵
            </p>

            {/* three picture cards */}
            <div className="grid grid-cols-3 w-full max-w-sm" style={{ gap: 10 }}>
              {choices.map((c, i) => (
                <RhymeCard key={`${qIndex}-${c.word}`} word={c} index={i} answer={answer} picked={picked} onPick={resolve} />
              ))}
            </div>

            {feedbackRow}
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ---------------- playing: First Sound ---------------- */
  if (current.kind === 'first') {
    const { entry, options, letter } = current;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation
            title={`🔤 ${mode.title}`}
            onBack={() => { playClick(); leaveToMenu(); }}
            stars={progress.stars}
            showProgress
            progress={(qIndex / TOTAL) * 100}
          />

          <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
            {progressRow}

            <motion.div
              key={`p-${qIndex}`}
              className={`w-full max-w-sm rounded-2xl px-4 py-3 mb-3 text-white border-4 border-white text-center bg-gradient-to-r ${mode.grad}`}
              style={{ boxShadow: `0 5px 0 ${mode.shadow}`, fontFamily: FONT }}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={POP}
            >
              <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
                What does it start with?
              </span>
            </motion.div>

            {/* picture — tap to hear the word; the spelling only appears after the answer */}
            <motion.button
              key={`pic-${qIndex}`}
              onClick={() => { buzz('tick'); speak(entry.word); }}
              className="bg-white/95 rounded-3xl border-4 border-white flex flex-col items-center"
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', padding: '14px 32px 10px', gap: 4, minWidth: 168 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={POP}
              whileTap={{ scale: 0.95, y: 2 }}
            >
              <WordPicture entry={entry} size={104} />
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 26,
                  lineHeight: 1,
                  height: 26,
                  color: '#1E2A4A',
                }}
              >
                {answered ? entry.word : ''}
              </span>
              <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: FONT }}>
                🔊 tap to hear
              </span>
            </motion.button>

            <p className="font-bold" style={{ fontFamily: FONT, fontSize: 15, color: '#0E7490', margin: '12px 0 8px' }}>
              🔤 it starts with… 🔤
            </p>

            {/* three letters */}
            <div className="grid grid-cols-3 w-full max-w-sm" style={{ gap: 12 }}>
              {options.map((opt, i) => {
                const isRight = opt === letter;
                const isPicked = picked === opt;
                const c = OPTION_COLORS[i % OPTION_COLORS.length];
                const bg = !answered ? c.bg : isRight ? '#22C55E' : isPicked ? '#DC2626' : '#D8DCE8';
                const sh = !answered ? c.sh : isRight ? '#047857' : isPicked ? '#991B1B' : '#9AA0A6';
                return (
                  <motion.button
                    key={`${qIndex}-${opt}`}
                    onClick={() => resolve(opt)}
                    disabled={answered}
                    aria-label={opt}
                    className="rounded-2xl border-4 border-white flex items-center justify-center"
                    style={{
                      background: bg,
                      boxShadow: `0 6px 0 ${sh}`,
                      minHeight: 84,
                      color: '#fff',
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 40,
                      lineHeight: 1,
                    }}
                    initial={{ scale: 0, y: 16 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, ...POP }}
                    whileTap={!answered ? { scale: 0.95, y: 3 } : {}}
                  >
                    {opt.toUpperCase()}
                    <span style={{ fontSize: 28, opacity: 0.85, marginLeft: 2 }}>{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {feedbackRow}
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ---------------- playing: missing letters ---------------- */
  const { entry, options } = current;
  const [before, after] = splitWord(entry);

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🔤 ${mode.title}`}
          onBack={() => { playClick(); leaveToMenu(); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / TOTAL) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {progressRow}

          {/* prompt */}
          <motion.div
            key={`p-${qIndex}`}
            className={`w-full max-w-sm rounded-2xl px-4 py-3 mb-3 text-white border-4 border-white text-center bg-gradient-to-r ${mode.grad}`}
            style={{ boxShadow: `0 5px 0 ${mode.shadow}`, fontFamily: FONT }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              Which letters are missing?
            </span>
          </motion.div>

          {/* picture — tap to hear the word */}
          <motion.button
            key={`pic-${qIndex}`}
            onClick={() => { buzz('tick'); speak(entry.word); }}
            className="bg-white/95 rounded-3xl p-4 border-4 border-white flex flex-col items-center gap-1"
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={POP}
            whileTap={{ scale: 0.95, y: 2 }}
          >
            <WordPicture entry={entry} size={104} />
            <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: FONT }}>
              🔊 tap to hear
            </span>
          </motion.button>

          {/* the word with a gap */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-4">
            {before.split('').map((c, i) => (
              <Letter key={`b${i}`} ch={c} />
            ))}

            <div
              className="rounded-xl flex items-center justify-center border-4"
              style={{
                borderStyle: answered ? 'solid' : 'dashed',
                borderColor: !answered ? '#F59E0B' : picked === entry.pattern ? '#22C55E' : '#DC2626',
                background: !answered ? '#FFFBEB' : picked === entry.pattern ? '#DCFCE7' : '#FEE2E2',
                minWidth: 76,
                height: 54,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 30,
                color: !answered ? '#F59E0B' : picked === entry.pattern ? '#15803D' : '#B91C1C',
                lineHeight: 1,
              }}
            >
              {!answered ? '?' : picked === entry.pattern ? entry.pattern : picked}
            </div>

            {after.split('').map((c, i) => (
              <Letter key={`a${i}`} ch={c} />
            ))}
          </div>

          {/* when wrong, show the right letters under the gap */}
          {answered && picked !== entry.pattern && (
            <p className="text-sm font-bold mt-2" style={{ fontFamily: FONT, color: '#15803D' }}>
              {before}
              <span style={{ background: '#DCFCE7', borderRadius: 6, padding: '0 4px' }}>{entry.pattern}</span>
              {after}
            </p>
          )}

          {/* answer buttons */}
          <div className={`grid gap-3 w-full max-w-sm mt-4 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {options.map((opt, i) => {
              const isRight = opt === entry.pattern;
              const isPicked = picked === opt;
              const c = OPTION_COLORS[i % OPTION_COLORS.length];
              const bg = !answered ? c.bg : isRight ? '#22C55E' : isPicked ? '#DC2626' : '#D8DCE8';
              const sh = !answered ? c.sh : isRight ? '#047857' : isPicked ? '#991B1B' : '#9AA0A6';
              return (
                <motion.button
                  key={`${qIndex}-${opt}`}
                  onClick={() => resolve(opt)}
                  disabled={answered}
                  className="rounded-2xl border-4 border-white flex items-center justify-center"
                  style={{
                    background: bg,
                    boxShadow: `0 6px 0 ${sh}`,
                    minHeight: 70,
                    color: '#fff',
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: 1,
                  }}
                  initial={{ scale: 0, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, ...POP }}
                  whileTap={!answered ? { scale: 0.95, y: 3 } : {}}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {feedbackRow}
        </div>
      </div>
    </GameBackground>
  );
};

export default SoundGame;
