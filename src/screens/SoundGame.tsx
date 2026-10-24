import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
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

/**
 * SoundGame — "which letters are missing?"
 *
 * The child sees a picture and the word with a gap, e.g. a ship and "__ip",
 * and taps the missing letter pair (ch / sh / th, the vowel teams oa / ee / oo / oi,
 * or the vowel-with-R pairs ar / ur).
 * Tapping the picture says the word aloud. The word is always shown together
 * with a picture so the child is never guessing between two real words.
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
  /** shows a NEW ribbon on the card */
  isNew?: boolean;
}

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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
    learned:
      'The letters ur make the "er" sound, as in turtle and burger. The same sound can also be spelled er and ir (as in bird), which come later, so this round only asks ur against ar and or.',
  },
];

/** how the mode cards are grouped on the picker; a mode not listed here goes into a last group */
const SECTIONS: { title: string; hint: string; ids: string[] }[] = [
  { title: 'Digraphs', hint: 'ch · sh · th', ids: ['mix', 'ch', 'sh', 'th'] },
  { title: 'Vowel teams', hint: 'oa · ee · oo · oi', ids: ['oa', 'ee', 'oo', 'oi'] },
  { title: 'Vowels with R', hint: 'ar · ur', ids: ['ar', 'ur'] },
];

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface Question {
  entry: SoundWord;
  options: string[];
}

const buildQuestions = (mode: SoundMode): Question[] =>
  shuffle(mode.pool)
    .slice(0, TOTAL)
    .map((entry) => ({ entry, options: shuffle(mode.options) }));

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

const WordPicture: React.FC<{ entry: SoundWord; size: number }> = ({ entry, size }) => {
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
    speak(`${m.title}. ${qs[0].entry.word}`);
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
    timer.current = window.setTimeout(() => speak(next.entry.word), 120);
  };

  const resolve = (value: string) => {
    if (picked !== null || !questions[qIndex]) return;
    const entry = questions[qIndex].entry;
    setPicked(value);
    const right = value === entry.pattern;
    onAnswer(right);

    if (right) {
      playCorrect();
      buzz('soft');
      scoreRef.current += 1;
      setScore(scoreRef.current);
      const st = streak + 1;
      setStreak(st);
      const msg = st >= 3 ? `${st} in a row! 🔥` : `Yes! ${entry.word}.`;
      setFeedback(msg);
      speak(st >= 3 ? `${st} in a row!` : `Yes! ${entry.word}.`);
      timer.current = window.setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, 1100);
    } else {
      playWrong();
      buzz('oops');
      setStreak(0);
      const msg = `${entry.word} has ${entry.pattern.toUpperCase()}.`;
      setFeedback(msg);
      speak(msg);
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
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: FONT }}>
              Find the missing letters! 🔤
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Look at the picture, then pick the letters that fit.
            </p>

            {(() => {
              const unlisted = MODES.filter((m) => !SECTIONS.some((sec) => sec.ids.includes(m.id)));
              const sections = unlisted.length
                ? [...SECTIONS, { title: 'More', hint: '', ids: unlisted.map((m) => m.id) }]
                : SECTIONS;
              let n = 0; // running card number, for the entrance delay
              return sections.map((sec) => (
                <div key={sec.title} className="max-w-lg mx-auto mb-4" data-kind="section">
                  <h3
                    className="text-sm font-bold text-gray-600 mb-2 px-1 flex items-baseline gap-2"
                    style={{ fontFamily: FONT }}
                  >
                    {sec.title}
                    {sec.hint && <span className="text-xs font-semibold text-gray-400">{sec.hint}</span>}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {sec.ids
                      .map((id) => MODES.find((m) => m.id === id))
                      .filter((m): m is SoundMode => !!m)
                      .map((m) => {
                        const i = n++;
                        return (
                          <motion.button
                            key={m.id}
                            data-kind="mode"
                            data-id={m.id}
                            onClick={() => startMode(m)}
                            className={`relative overflow-hidden rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${m.grad}`}
                            style={{ boxShadow: `0 8px 0 ${m.shadow}, 0 12px 22px rgba(0,0,0,.18)`, minHeight: 150 }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: Math.min(i, 8) * 0.05, ...POP }}
                            whileTap={{ scale: 0.94, y: 4 }}
                          >
                            {m.isNew && (
                              <div
                                data-kind="new"
                                className="absolute text-center text-white font-bold bg-gradient-to-r from-red-500 to-pink-500 shadow-md"
                                style={{ top: 14, right: -30, width: 100, transform: 'rotate(40deg)', fontSize: 13, letterSpacing: '1px', padding: '2px 0', borderTop: '2px solid #fff', borderBottom: '2px solid #fff' }}
                              >
                                NEW
                              </div>
                            )}
                            <div className="flex justify-center mb-2">
                              <ItemIcon icon={m.icon} size={44} label={m.title} />
                            </div>
                            <h3 className="text-lg font-bold" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                              {m.title}
                            </h3>
                            <p className="text-xs opacity-90">{m.sub}</p>
                            <div className="flex justify-center gap-0.5 mt-1.5">
                              {[1, 2, 3].map((d) => (
                                <span key={d} className="text-[11px]" style={{ opacity: d <= m.diff ? 1 : 0.28 }}>
                                  ⭐
                                </span>
                              ))}
                            </div>
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
              <div className="text-6xl mt-4">🔤</div>
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
  const { entry, options } = current;
  const [before, after] = splitWord(entry);
  const answered = picked !== null;

  /* ---------------- playing ---------------- */
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
          {/* progress dots + streak */}
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

          {/* feedback */}
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
        </div>
      </div>
    </GameBackground>
  );
};

export default SoundGame;
