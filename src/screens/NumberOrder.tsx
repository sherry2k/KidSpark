import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import SparkMascot from '../components/SparkMascot';
import { GameProgress } from '../store/gameStore';
import { Band } from '../data/mathModes';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * NumberOrder — "Put the numbers in order"
 *
 * Mixed-up number tiles sit at the bottom. The child taps them one by one and
 * each tile jumps into the next empty slot at the top. The tile has to be the
 * smallest one left (or the biggest, in "biggest first" rounds), so the child
 * is really doing the comparing — a wrong tap just shakes, nothing is lost.
 *
 *   easy   3 numbers, 1–10,  smallest first
 *   medium 4 numbers, 1–20,  mostly smallest first, sometimes biggest first
 *   hard   5 numbers, 1–50,  smallest first or biggest first
 *
 * A round counts as "right" only if it was finished without a wrong tap, so
 * the stars still mean something. After two wrong taps the correct tile glows.
 *
 * Props match the other Math games (MissingNumbers, SkipCounting, NumberBonds,
 * ClockTime).
 *
 * NOTE: spacing is done with inline styles / gap on purpose — on phones the
 * global `* { margin:0; padding:0 }` rule in index.css overrides Tailwind
 * margin/padding utilities.
 */

interface NumberOrderProps {
  defaultBand: Band;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";
const NAVY = '#1E2A4A';
const TILE_COLORS = ['#A855F7', '#EC4899', '#2F9BF0', '#22C55E', '#F59E0B'];

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

type Dir = 'up' | 'down';

interface OrderQ {
  tiles: { n: number; color: string }[]; // shown order (shuffled)
  target: number[]; // the order the child must build
  dir: Dir;
}

const rand = (n: number) => Math.floor(Math.random() * n);

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const settings = (band: Band): { count: number; max: number; downChance: number } =>
  band === 'easy'
    ? { count: 3, max: 10, downChance: 0 }
    : band === 'medium'
    ? { count: 4, max: 20, downChance: 0.3 }
    : { count: 5, max: 50, downChance: 0.5 };

const makeQuestion = (band: Band, prevKey: string | null): OrderQ => {
  const { count, max, downChance } = settings(band);
  let nums: number[] = [];
  let key = '';
  do {
    const set = new Set<number>();
    while (set.size < count) set.add(1 + rand(max));
    nums = [...set];
    key = [...nums].sort((a, b) => a - b).join(',');
  } while (key === prevKey);

  const dir: Dir = Math.random() < downChance ? 'down' : 'up';
  const sorted = [...nums].sort((a, b) => (dir === 'up' ? a - b : b - a));

  // never show the tiles already in the right order
  let shown = shuffle(nums);
  let guard = 0;
  while (shown.join() === sorted.join() && guard++ < 10) shown = shuffle(nums);

  const colors = shuffle(TILE_COLORS);
  return {
    tiles: shown.map((n, i) => ({ n, color: colors[i % colors.length] })),
    target: sorted,
    dir,
  };
};

const keyOf = (q: OrderQ) => [...q.target].sort((a, b) => a - b).join(',');

/* ------------------------------------------------------------------ */
/* A number tile                                                       */
/* ------------------------------------------------------------------ */

const Tile: React.FC<{
  n: number;
  color: string;
  index: number;
  state: 'idle' | 'placed' | 'glow';
  shake: boolean;
  onTap: () => void;
  size: number;
}> = ({ n, color, index, state, shake, onTap, size }) => (
  <motion.button
    onClick={onTap}
    disabled={state === 'placed'}
    aria-label={`${n}`}
    style={{
      width: size,
      height: size * 1.08,
      background: '#fff',
      border: `4px solid ${color}`,
      borderRadius: 22,
      boxShadow: state === 'glow' ? `0 0 0 5px #FDE047, 0 6px 0 ${color}` : `0 6px 0 ${color}`,
      visibility: state === 'placed' ? 'hidden' : 'visible',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    initial={{ scale: 0, y: 18 }}
    animate={shake ? { x: [0, -9, 9, -7, 7, 0], scale: 1, y: 0 } : { x: 0, scale: state === 'glow' ? [1, 1.08, 1] : 1, y: 0 }}
    transition={shake ? { duration: 0.4 } : state === 'glow' ? { duration: 0.9, repeat: Infinity } : { delay: 0.08 + index * 0.06, ...POP }}
    whileTap={state === 'placed' ? {} : { scale: 0.93, y: 3 }}
  >
    <span
      style={{
        fontFamily: NUM,
        fontWeight: 700,
        fontSize: size * 0.52,
        lineHeight: 1,
        color,
        fontVariantNumeric: 'tabular-nums lining-nums',
      }}
    >
      {n}
    </span>
  </motion.button>
);

/* ================================================================== */
/* The game                                                            */
/* ================================================================== */

const NumberOrder: React.FC<NumberOrderProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [q, setQ] = useState<OrderQ>(() => makeQuestion(defaultBand, null));
  const [qIndex, setQIndex] = useState(0);
  const [placed, setPlaced] = useState<{ n: number; color: string }[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeN, setShakeN] = useState<number | null>(null);
  const [hintOn, setHintOn] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; kind: 'good' | 'oops' | 'hint' } | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const awarded = useRef(false);

  /* every pending timeout lives here, so leaving the game cancels them all */
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const instruction = (d: Dir) =>
    d === 'up' ? 'Put the numbers in order. Smallest first!' : 'Put the numbers in order. Biggest first!';

  useEffect(() => {
    speak(instruction(q.dir));
    return () => {
      clearTimers();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const count = q.target.length;
  const next = q.target[placed.length]; // the number that must be tapped now
  const glowNow = (hintOn || mistakes >= 2) && !locked;

  const restart = () => {
    clearTimers();
    playClick();
    buzz('tick');
    const nq = makeQuestion(defaultBand, null);
    setQ(nq);
    setQIndex(0);
    setPlaced([]);
    setMistakes(0);
    setHintOn(false);
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    setFeedback(null);
    setLocked(false);
    setDone(false);
    awarded.current = false;
    speak(instruction(nq.dir));
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= TOTAL) {
      setDone(true);
      playComplete();
      buzz('success');
      if (!awarded.current) {
        awarded.current = true;
        const s = scoreRef.current;
        onComplete(s >= TOTAL * 0.8 ? 3 : s >= TOTAL * 0.5 ? 2 : 1);
      }
      return;
    }
    const nq = makeQuestion(defaultBand, keyOf(q));
    setQIndex((i) => i + 1);
    setQ(nq);
    setPlaced([]);
    setMistakes(0);
    setHintOn(false);
    setFeedback(null);
    setLocked(false);
    later(() => speak(instruction(nq.dir)), 450);
  };

  const finishRound = (clean: boolean) => {
    setLocked(true);
    setHintOn(false);
    onAnswer(clean);
    if (clean) {
      playCorrect();
      buzz('soft');
      setScore((s) => s + 1);
      scoreRef.current += 1;
      const st = streak + 1;
      setStreak(st);
      setFeedback({ text: st >= 3 ? `${st} in a row! 🔥 Perfect order!` : '🎉 Perfect order!', kind: 'good' });
      speak('Perfect order!');
      later(nextQuestion, 1700);
    } else {
      playComplete();
      buzz('soft');
      setStreak(0);
      const words = q.target.join(', ');
      setFeedback({ text: `Well done! ${words}`, kind: 'oops' });
      speak(`Well done! ${words}`);
      later(nextQuestion, 2600);
    }
  };

  const tap = (n: number, color: string) => {
    if (locked || done) return;
    if (n === next) {
      playClick();
      buzz('tick');
      speak(String(n));
      const np = [...placed, { n, color }];
      setPlaced(np);
      setHintOn(false);
      setFeedback(null);
      if (np.length === count) finishRound(mistakes === 0);
    } else {
      playWrong();
      buzz('oops');
      setMistakes((m) => m + 1);
      setStreak(0);
      setShakeN(n);
      later(() => setShakeN(null), 420);
      const text = q.dir === 'up' ? 'Look for the smallest number left.' : 'Look for the biggest number left.';
      setFeedback({ text: `🤔 ${text}`, kind: 'hint' });
      speak(text);
    }
  };

  const hint = () => {
    if (locked || hintOn) return;
    playClick();
    buzz('tick');
    setHintOn(true);
    const text =
      q.dir === 'up' ? 'Which number is the smallest? Look at the glowing one.' : 'Which number is the biggest? Look at the glowing one.';
    setFeedback({ text: `💡 ${text}`, kind: 'hint' });
    speak(text);
  };

  /* ---------------- result ---------------- */
  if (done) {
    const stars = score >= TOTAL * 0.8 ? 3 : score >= TOTAL * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="📏 Number Order" onBack={() => { playClick(); stopSpeaking(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto" style={{ padding: '0 20px 32px' }}>
            <div className="max-w-md mx-auto text-center">
              <div className="flex justify-center" style={{ marginTop: 16 }}>
                <SparkMascot mode={stars === 3 ? 'cheer' : 'wave'} className="w-28" />
              </div>
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: NUM, marginTop: 8 }}>
                {stars === 3 ? 'Number star!' : 'Good work!'} 🎉
              </p>

              <div
                className="inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl"
                style={{ marginTop: 12, padding: '12px 24px', boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 44, lineHeight: 1, color: '#7C3AED' }}>{score}</span>
                <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 22, lineHeight: 1, color: '#9CA3AF' }}>/{TOTAL}</span>
              </div>

              <div className="flex justify-center gap-1" style={{ marginTop: 12 }}>
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

              <div className="bg-white/90 border-4 border-white rounded-2xl text-left" style={{ marginTop: 16, padding: 12 }}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ marginBottom: 4 }}>
                  For grown-ups
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  Ordering numbers means comparing them: which is smaller, which is bigger. Children start with three
                  numbers up to 10, then four up to 20 and five up to 50, and later also put them biggest first.
                  Try it at home with house numbers, page numbers or toy cars.
                </p>
              </div>

              <div className="flex gap-3 justify-center" style={{ marginTop: 20 }}>
                <motion.button
                  onClick={restart}
                  className="rounded-2xl bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ padding: '16px 24px', boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); stopSpeaking(); onBack(); }}
                  className="rounded-2xl text-white font-bold border-4 border-white"
                  style={{
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
                    boxShadow: '0 5px 0 #4C1D95',
                    fontFamily: NUM,
                  }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🧮 New game
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ---------------- playing ---------------- */
  const fbStyle =
    feedback?.kind === 'good'
      ? { background: 'linear-gradient(180deg,#4ADE80,#16A34A)', color: '#fff', borderColor: '#fff', boxShadow: '0 5px 0 #15803D' }
      : feedback?.kind === 'hint'
      ? { background: '#FEF9C3', color: '#854D0E', borderColor: '#FDE047', boxShadow: '0 4px 0 #FACC15' }
      : { background: '#DCFCE7', color: '#166534', borderColor: '#86EFAC', boxShadow: '0 4px 0 #22C55E' };

  const tileSize = count >= 5 ? 66 : count === 4 ? 76 : 88;
  const slotFont = count >= 5 ? 30 : 38;
  const left = q.dir === 'up' ? '🐜 smallest' : '🐘 biggest';
  const right = q.dir === 'up' ? 'biggest 🐘' : 'smallest 🐜';

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title="📏 Number Order"
          onBack={() => { playClick(); clearTimers(); stopSpeaking(); onBack(); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / TOTAL) * 100}
        />

        <div className="flex-1 flex flex-col items-center min-h-0 overflow-y-auto" style={{ padding: '0 12px 12px', gap: 10 }}>
          {/* progress + streak + level */}
          <div className="flex items-center justify-between w-full" style={{ maxWidth: 384, marginTop: 4 }}>
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
            <div className="flex items-center gap-2" style={{ fontFamily: NUM, fontSize: 12, fontWeight: 600, color: '#5B5675' }}>
              {streak >= 2 && <span style={{ color: '#F97316' }}>🔥 {streak}</span>}
              <span>📏 {count} numbers</span>
            </div>
          </div>

          {/* question card with the empty slots */}
          <motion.div
            key={qIndex}
            className="w-full bg-white border-4 border-white flex flex-col items-center"
            style={{ maxWidth: 384, borderRadius: 28, boxShadow: '0 6px 0 rgba(0,0,0,.10)', padding: '14px 12px 14px', gap: 10 }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
          >
            <button
              onClick={() => speak(instruction(q.dir))}
              style={{ fontFamily: NUM, fontWeight: 700, fontSize: 20, color: NAVY, background: 'none', border: 0, textAlign: 'center' }}
            >
              {q.dir === 'up' ? (
                <>Smallest <span style={{ color: '#7C3AED' }}>→</span> biggest</>
              ) : (
                <>Biggest <span style={{ color: '#7C3AED' }}>→</span> smallest</>
              )}{' '}
              <span style={{ fontSize: 15, opacity: 0.7 }}>🔊</span>
            </button>

            <div className="flex w-full" style={{ gap: 8 }}>
              {Array.from({ length: count }, (_, i) => {
                const p = placed[i];
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 78,
                      borderRadius: 18,
                      border: p ? `4px solid ${p.color}` : '3px dashed #C9BDE8',
                      background: p ? '#fff' : '#F6F2FF',
                      boxShadow: p ? `0 5px 0 ${p.color}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AnimatePresence>
                      {p ? (
                        <motion.span
                          key={`${qIndex}-${p.n}`}
                          initial={{ scale: 0, y: 30 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={POP}
                          style={{
                            fontFamily: NUM,
                            fontWeight: 700,
                            fontSize: slotFont,
                            lineHeight: 1,
                            color: p.color,
                            fontVariantNumeric: 'tabular-nums lining-nums',
                          }}
                        >
                          {p.n}
                        </motion.span>
                      ) : (
                        <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 16, color: '#C9BDE8' }}>{i + 1}</span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between w-full" style={{ fontFamily: NUM, fontWeight: 600, fontSize: 12, color: '#6B5FA0' }}>
              <span>{left}</span>
              <span>{right}</span>
            </div>
          </motion.div>

          {/* the mixed-up tiles */}
          <div className="flex justify-center w-full" style={{ maxWidth: 384, gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
            {q.tiles.map((t, i) => {
              const isPlaced = placed.some((p) => p.n === t.n);
              return (
                <Tile
                  key={`${qIndex}-${t.n}`}
                  n={t.n}
                  color={t.color}
                  index={i}
                  size={tileSize}
                  state={isPlaced ? 'placed' : glowNow && t.n === next ? 'glow' : 'idle'}
                  shake={shakeN === t.n}
                  onTap={() => tap(t.n, t.color)}
                />
              );
            })}
          </div>

          <p style={{ fontFamily: NUM, fontWeight: 600, fontSize: 12, color: '#5B5675', textAlign: 'center' }}>
            👆 Tap the numbers in order
          </p>

          {/* feedback (or the hint button) */}
          <div className="flex items-center justify-center" style={{ minHeight: 56 }}>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.p
                  key={feedback.text}
                  className="font-bold text-center border-4"
                  style={{ ...fbStyle, fontFamily: NUM, fontSize: 15, borderRadius: 20, padding: '8px 16px', maxWidth: 340 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={POP}
                >
                  {feedback.text}
                </motion.p>
              ) : (
                <motion.button
                  key="hint"
                  onClick={hint}
                  className="font-bold border-4 border-white flex items-center"
                  style={{
                    gap: 8,
                    height: 46,
                    padding: '0 20px',
                    borderRadius: 23,
                    background: 'linear-gradient(180deg,#FDE047,#FBBF24)',
                    boxShadow: '0 5px 0 #D97706',
                    fontFamily: NUM,
                    fontSize: 17,
                    color: '#7A3E00',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={POP}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  💡 Need a hint?
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default NumberOrder;
