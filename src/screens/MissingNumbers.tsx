import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * MissingNumbers — "which number is missing?"
 *
 * A row of five counting numbers with a gap, e.g. 14, 15, __, 17, 18.
 * Questions are generated in code (no data to maintain) at three levels:
 * 1–10, 1–20 and 1–50.
 *
 *   1–10  one number missing in every question
 *   1–20  one missing, then two missing in the second half of the round
 *   1–50  one missing, then two missing from the third question on
 *
 * With one gap the child picks from three choices. With two gaps there are
 * four choices and the child taps the numbers in order, left to right.
 *
 * The wrong choices are numbers just outside the row (and, on the 1–50 level,
 * the number ten away), so the child has to check that the number really fits
 * between its neighbours instead of picking one that merely looks close.
 */

type Band = 'easy' | 'medium' | 'hard';

interface MissingNumbersProps {
  defaultBand: Band;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const ROW = 5;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";

const numStyle = (size: string): React.CSSProperties => ({
  fontFamily: NUM,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums lining-nums',
  fontFeatureSettings: "'tnum' 1, 'lnum' 1",
});

interface Level {
  max: number;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
  band: Band;
  plan: number[]; // how many numbers are hidden in each of the TOTAL questions
}

const LEVELS: Level[] = [
  { max: 10, title: '1 to 10', sub: 'One missing number', icon: '🌱', grad: 'from-lime-400 to-green-500', shadow: '#15803D', diff: 1, band: 'easy', plan: [1, 1, 1, 1, 1, 1, 1, 1] },
  { max: 20, title: '1 to 20', sub: 'Sometimes two missing', icon: '🌳', grad: 'from-sky-400 to-blue-500', shadow: '#1D4ED8', diff: 2, band: 'medium', plan: [1, 1, 1, 1, 2, 2, 2, 2] },
  { max: 50, title: '1 to 50', sub: 'Big numbers, two missing!', icon: '🚀', grad: 'from-fuchsia-500 to-purple-600', shadow: '#7E22CE', diff: 3, band: 'hard', plan: [1, 1, 2, 2, 2, 2, 2, 2] },
];

interface Question {
  start: number; // first number in the row
  blanks: number[]; // indexes (0–4) of the hidden numbers, left to right
  answers: number[]; // the hidden numbers, left to right
  options: number[];
}

const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeQuestions = (max: number, plan: number[]): Question[] => {
  const seen = new Set<string>();
  const out: Question[] = [];

  for (const count of plan) {
    let q: Question | null = null;
    let guard = 0;

    while (!q && guard < 200) {
      guard += 1;
      const start = randInt(1, max - (ROW - 1));
      const blanks = shuffle([0, 1, 2, 3, 4])
        .slice(0, count)
        .sort((a, b) => a - b);
      const key = `${start}-${blanks.join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const answers = blanks.map((b) => start + b);
      const inRow = (n: number) => n >= start && n < start + ROW;

      // wrong choices: numbers just outside the row, plus the number ten away on the big level
      const pool = [start - 1, start - 2, start + ROW, start + ROW + 1];
      if (max >= 50) answers.forEach((a) => pool.push(a - 10, a + 10));
      const wrong = shuffle(
        Array.from(new Set(pool)).filter((n) => n >= 1 && n <= max && !inRow(n))
      ).slice(0, 2);

      q = { start, blanks, answers, options: shuffle([...answers, ...wrong]) };
    }
    if (q) out.push(q);
  }
  return out;
};

const OPTION_COLORS = [
  { bg: '#2C7BE5', sh: '#1E40AF' },
  { bg: '#57CC5B', sh: '#047857' },
  { bg: '#F0522B', sh: '#C2410C' },
];

/* ------------------------------------------------------------------ */
/* One number in the row                                               */
/* ------------------------------------------------------------------ */

const Tile: React.FC<{ value: number | string; tone: 'normal' | 'blank' | 'active' | 'right' | 'wrong' }> = ({ value, tone }) => {
  const amber = tone === 'blank' || tone === 'active';
  const color = amber ? '#F59E0B' : tone === 'right' ? '#16A34A' : tone === 'wrong' ? '#DC2626' : '#2C7BE5';
  const bg = amber ? '#FFFBEB' : tone === 'right' ? '#DCFCE7' : tone === 'wrong' ? '#FEE2E2' : '#fff';
  return (
    <div
      className="rounded-2xl flex items-center justify-center"
      style={{
        width: 54,
        height: 68,
        background: bg,
        border: `4px ${tone === 'blank' ? 'dashed' : 'solid'} ${color}`,
        boxShadow: tone === 'active' ? `0 5px 0 ${color}, 0 0 14px #FBBF24` : `0 5px 0 ${color}`,
      }}
    >
      <span style={{ ...numStyle(String(value).length > 1 ? '26px' : '32px'), color }}>{value}</span>
    </div>
  );
};

/* ================================================================== */
/* The screen                                                          */
/* ================================================================== */

const MissingNumbers: React.FC<MissingNumbersProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [filled, setFilled] = useState<number[]>([]); // numbers placed so far, left to right
  const [outcome, setOutcome] = useState<'right' | 'wrong' | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
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

  const spokenRow = (q: Question) =>
    Array.from({ length: ROW }, (_, i) => (q.blanks.includes(i) ? 'what number?' : String(q.start + i))).join(', ');

  const resetAnswer = () => {
    setFilled([]);
    setOutcome(null);
    setWrongPick(null);
  };

  const startLevel = (l: Level) => {
    clearTimer();
    playClick();
    buzz('tick');
    const qs = makeQuestions(l.max, l.plan);
    setLevel(l);
    setQuestions(qs);
    setQIndex(0);
    scoreRef.current = 0;
    setScore(0);
    setStreak(0);
    resetAnswer();
    setFeedback(null);
    setDone(false);
    awarded.current = false;
    speak(`${qs[0].blanks.length > 1 ? 'Which numbers are missing?' : 'Which number is missing?'} ${spokenRow(qs[0])}`);
  };

  const leaveToMenu = () => {
    clearTimer();
    stopSpeaking();
    setFeedback(null);
    setLevel(null);
  };

  const nextQuestion = () => {
    if (!level) return;
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
    resetAnswer();
    const next = questions[qIndex + 1];
    timer.current = window.setTimeout(
      () => speak(`${next.blanks.length > 1 ? 'Which numbers are missing?' : 'Which number is missing?'} ${spokenRow(next)}`),
      120
    );
  };

  const resolve = (value: number) => {
    const q = questions[qIndex];
    if (!q || outcome !== null || filled.includes(value)) return;

    const expected = q.answers[filled.length];

    if (value === expected) {
      const next = [...filled, value];
      setFilled(next);

      // one gap filled, more to go
      if (next.length < q.answers.length) {
        playClick();
        buzz('tick');
        speak(String(value));
        return;
      }

      // all gaps filled
      setOutcome('right');
      onAnswer(true);
      playCorrect();
      buzz('soft');
      scoreRef.current += 1;
      setScore(scoreRef.current);
      const st = streak + 1;
      setStreak(st);
      setFeedback(st >= 3 ? `${st} in a row! 🔥` : 'Yes! Well done.');
      speak(st >= 3 ? `${st} in a row!` : 'Yes! Well done.');
      timer.current = window.setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, 1100);
      return;
    }

    // wrong number: one try per question, then show the answer
    setOutcome('wrong');
    setWrongPick(value);
    onAnswer(false);
    playWrong();
    buzz('oops');
    setStreak(0);
    const msg =
      q.answers.length > 1
        ? `The missing numbers are ${q.answers.join(' and ')}.`
        : `The missing number is ${q.answers[0]}.`;
    setFeedback(msg);
    speak(`${msg} ${Array.from({ length: ROW }, (_, i) => q.start + i).join(', ')}.`);
    timer.current = window.setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 3000);
  };

  /* ---------------- level picker ---------------- */
  if (!level) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🔢 Missing Numbers" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: NUM }}>
              Which numbers? 🔢
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Find the number that is missing from the row.
            </p>

            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {LEVELS.map((l, i) => (
                <motion.button
                  key={l.max}
                  onClick={() => startLevel(l)}
                  className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-r ${l.grad} flex items-center gap-4 text-left`}
                  style={{ boxShadow: `0 8px 0 ${l.shadow}, 0 12px 22px rgba(0,0,0,.18)` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, ...POP }}
                  whileTap={{ scale: 0.96, y: 4 }}
                >
                  <ItemIcon icon={l.icon} size={44} label={l.title} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold" style={{ fontFamily: NUM, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                      {l.title}
                      {l.band === defaultBand && <span className="ml-2 text-xs opacity-90">★ for you</span>}
                    </h3>
                    <p className="text-xs opacity-90">{l.sub}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((d) => (
                      <span key={d} className="text-[11px]" style={{ opacity: d <= l.diff ? 1 : 0.28 }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
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
          <Navigation title={`🔢 ${level.title}`} onBack={() => { playClick(); leaveToMenu(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">🔢</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: NUM }}>
                {stars === 3 ? 'Number star!' : 'Good work!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ ...numStyle('44px'), color: '#2C7BE5' }}>{score}</span>
                <span className="text-gray-400" style={numStyle('22px')}>/{TOTAL}</span>
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
                <p className="text-sm text-gray-600 font-semibold">
                  Missing numbers builds number order: knowing what comes just before and just after a number. It is the
                  step that comes before adding and subtracting. Try counting the row out loud together.
                </p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={() => startLevel(level)}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); leaveToMenu(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 5px 0 #1E40AF', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔢 New level
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  const q = questions[qIndex];
  if (!q) return null;
  const two = q.blanks.length > 1;
  const question = two ? 'Which numbers are missing?' : 'Which number is missing?';

  /* ---------------- playing ---------------- */
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🔢 ${level.title}`}
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
              <span className="text-xs text-gray-500 font-bold">
                <span style={numStyle('14px')}>{score}</span> right
              </span>
              {streak >= 2 && (
                <motion.span className="text-xs font-bold text-orange-500" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  🔥<span style={numStyle('12px')}>{streak}</span>
                </motion.span>
              )}
            </div>
          </div>

          {/* prompt, tap to hear the row */}
          <motion.button
            key={`p-${qIndex}`}
            onClick={() => speak(`${question} ${spokenRow(q)}`)}
            className={`w-full max-w-sm rounded-2xl px-4 py-3 mb-4 text-white border-4 border-white bg-gradient-to-r ${level.grad}`}
            style={{ boxShadow: `0 5px 0 ${level.shadow}`, fontFamily: NUM }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              {question}
            </span>
            <span className="opacity-80 text-xs ml-2">🔊</span>
          </motion.button>

          {/* the row */}
          <div className="bg-white/95 rounded-3xl p-4 border-4 border-white" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: ROW }, (_, i) => {
                const k = q.blanks.indexOf(i);
                if (k === -1) return <Tile key={i} value={q.start + i} tone="normal" />;
                if (k < filled.length) return <Tile key={i} value={filled[k]} tone="right" />;
                if (outcome === 'wrong') {
                  // reveal the answers; the one the child missed is red
                  return <Tile key={i} value={q.answers[k]} tone={k === filled.length ? 'wrong' : 'normal'} />;
                }
                return <Tile key={i} value="?" tone={k === filled.length ? 'active' : 'blank'} />;
              })}
            </div>
          </div>

          {two && outcome === null && (
            <p className="text-xs text-gray-500 font-semibold mt-2" style={{ fontFamily: NUM }}>
              👆 Tap the numbers in order, left to right
            </p>
          )}

          {/* answer buttons */}
          <div className={`grid gap-3 w-full max-w-sm mt-5 ${q.options.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {q.options.map((opt, i) => {
              const used = filled.includes(opt);
              const isAnswer = q.answers.includes(opt);
              const isWrongPick = wrongPick === opt;
              const c = OPTION_COLORS[i % OPTION_COLORS.length];

              let bg = c.bg;
              let sh = c.sh;
              if (used) {
                bg = '#22C55E';
                sh = '#047857';
              } else if (outcome === 'wrong') {
                if (isWrongPick) {
                  bg = '#DC2626';
                  sh = '#991B1B';
                } else if (isAnswer) {
                  bg = '#22C55E';
                  sh = '#047857';
                } else {
                  bg = '#D8DCE8';
                  sh = '#9AA0A6';
                }
              }

              return (
                <motion.button
                  key={`${qIndex}-${opt}`}
                  onClick={() => resolve(opt)}
                  disabled={outcome !== null || used}
                  className="rounded-2xl border-4 border-white flex items-center justify-center"
                  style={{ background: bg, boxShadow: `0 6px 0 ${sh}`, minHeight: 74, color: '#fff', opacity: used && outcome === null ? 0.55 : 1 }}
                  initial={{ scale: 0, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, ...POP }}
                  whileTap={outcome === null && !used ? { scale: 0.95, y: 3 } : {}}
                >
                  <span style={numStyle('32px')}>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* feedback */}
          <div className="h-12 flex items-center mt-3">
            <AnimatePresence>
              {feedback && (
                <motion.p
                  className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-2xl text-sm text-center max-w-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={POP}
                  style={{ fontFamily: NUM }}
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

export default MissingNumbers;
