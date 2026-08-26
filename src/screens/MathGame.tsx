import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import TenFrame from '../components/TenFrame';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress, PlayerProfile } from '../store/gameStore';
import { MATH_MODES, MathMode, ModeId, Band, Question, frameSize, maxFor } from '../data/mathModes';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * MathGame — rebuilt as four modes, with every quantity made visible.
 *
 * The old screen was one multiple-choice quiz. Its only visual support was a
 * row of emoji dots, and those appeared solely for `easy` addition — so
 * subtraction and every harder band were pure symbols with nothing to hold on
 * to. A child who couldn't do it in their head had no route in.
 *
 * Every mode here shows the quantity as counters in a ten-frame, and every
 * question has a "Count with me" button that walks the dots one at a time,
 * out loud. That's the actual teaching.
 *
 * TYPOGRAPHY: numerals now use Fredoka with tabular figures rather than
 * Bubblegum One. See src/styles/kidspark-type.css — Bubblegum One's `1` is a
 * thin flagged stroke with no foot, which is the hardest glyph in the face and
 * the first number a child meets.
 */

interface MathGameProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";

const numStyle = (size: string): React.CSSProperties => ({
  fontFamily: NUM,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums lining-nums',
  fontFeatureSettings: "'tnum' 1, 'lnum' 1",
});

/* ------------------------------------------------------------------ */
/* A big teaching numeral                                              */
/* ------------------------------------------------------------------ */

const NumberTile: React.FC<{ value: number | string; color: string; size?: number }> = ({
  value,
  color,
  size = 64,
}) => (
  <div
    className="bg-white rounded-2xl flex items-center justify-center border-4"
    style={{
      borderColor: color,
      minWidth: size * 1.15,
      height: size * 1.3,
      padding: '0 .5rem',
      boxShadow: `0 5px 0 ${color}`,
    }}
  >
    <span style={{ ...numStyle(`${size}px`), color }}>{value}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Shared: counters with a count-along helper                          */
/* ------------------------------------------------------------------ */

const useCountAlong = (total: number) => {
  const [lit, setLit] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setLit(null);
  };

  const run = () => {
    stop();
    let i = 0;
    setLit(0);
    speak('1');
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= total) {
        stop();
        window.setTimeout(() => speak(`${total}!`), 60);
        return;
      }
      setLit(i);
      speak(String(i + 1));
    }, 700);
  };

  useEffect(() => stop, []);
  return { lit, run, stop };
};

const CountAlongButton: React.FC<{ onRun: () => void }> = ({ onRun }) => (
  <motion.button
    onClick={() => {
      playClick();
      buzz('tick');
      onRun();
    }}
    className="rounded-2xl px-4 py-2 bg-white text-gray-700 font-bold border-4 border-white text-sm"
    style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: NUM }}
    whileTap={{ scale: 0.94, y: 2 }}
  >
    🔢 Count with me
  </motion.button>
);

/* ------------------------------------------------------------------ */
/* Answer buttons                                                      */
/* ------------------------------------------------------------------ */

const OPTION_COLORS = [
  { bg: '#2C7BE5', sh: '#1E40AF' },
  { bg: '#57CC5B', sh: '#047857' },
  { bg: '#F0522B', sh: '#C2410C' },
  { bg: '#7B2CBF', sh: '#5B21B6' },
];

const Options: React.FC<{
  options: number[];
  answer: number;
  picked: number | null;
  onPick: (n: number) => void;
}> = ({ options, answer, picked, onPick }) => (
  <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
    {options.map((opt, i) => {
      const done = picked !== null;
      const isRight = opt === answer;
      const isPicked = picked === opt;
      const c = OPTION_COLORS[i % 4];

      const bg = !done ? c.bg : isRight ? '#22C55E' : isPicked ? '#DC2626' : '#D8DCE8';
      const sh = !done ? c.sh : isRight ? '#047857' : isPicked ? '#991B1B' : '#9AA0A6';

      return (
        <motion.button
          key={`${opt}-${i}`}
          onClick={() => onPick(opt)}
          disabled={done}
          className="rounded-2xl border-4 border-white flex items-center justify-center gap-1"
          style={{ background: bg, boxShadow: `0 6px 0 ${sh}`, minHeight: 74, color: '#fff' }}
          initial={{ scale: 0, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05, ...POP }}
          whileTap={!done ? { scale: 0.95, y: 3 } : {}}
        >
          {done && isRight && <span className="text-2xl">✓</span>}
          {done && isPicked && !isRight && <span className="text-2xl">✗</span>}
          <span style={numStyle('34px')}>{opt}</span>
        </motion.button>
      );
    })}
  </div>
);

/* ================================================================== */
/* The screen                                                          */
/* ================================================================== */

const MathGame: React.FC<MathGameProps> = ({ profile, progress, onBack, onAnswer, onComplete }) => {
  const band: Band =
    profile.difficulty === 'easy' ? 'easy' : profile.difficulty === 'hard' ? 'hard' : 'medium';

  const [mode, setMode] = useState<MathMode | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [q, setQ] = useState<Question | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /* number-line state */
  const trackRef = useRef<HTMLDivElement>(null);
  const [hop, setHop] = useState(0);

  const awarded = useRef(false);
  const max = maxFor(band);
  const frame = frameSize(band);

  const counters = q ? (q.op === '-' ? q.a : q.a + q.b) : 0;
  const { lit, run, stop } = useCountAlong(Math.max(1, q?.op === 'count' ? q.a : counters));

  useEffect(() => () => stopSpeaking(), []);

  const startMode = (m: MathMode) => {
    playClick();
    buzz('tick');
    setMode(m);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    setDone(false);
    setHop(0);
    awarded.current = false;
    const first = m.make(band);
    setQ(first);
    speak(`${m.title}. ${first.prompt}`);
  };

  const nextQuestion = () => {
    stop();
    if (!mode) return;
    if (qIndex + 1 >= TOTAL) {
      setDone(true);
      playComplete();
      buzz('success');
      if (!awarded.current) {
        awarded.current = true;
        onComplete(score >= TOTAL * 0.8 ? 3 : score >= TOTAL * 0.5 ? 2 : 1);
      }
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
    setHop(0);
    const nq = mode.make(band);
    setQ(nq);
    window.setTimeout(() => speak(nq.prompt), 120);
  };

  const resolve = (value: number) => {
    if (!q || picked !== null) return;
    setPicked(value);
    const right = value === q.answer;
    onAnswer(right);

    if (right) {
      playCorrect();
      buzz('soft');
      setScore((s) => s + 1);
      const st = streak + 1;
      setStreak(st);
      setFeedback(st >= 3 ? `${st} in a row! 🔥` : 'Yes! Well done.');
      speak(st >= 3 ? `${st} in a row!` : 'Yes! Well done.');
      window.setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, 1100);
    } else {
      playWrong();
      buzz('oops');
      setStreak(0);
      const msg =
        q.op === 'count'
          ? `Let's count them. There are ${q.answer}.`
          : q.op === 'compare'
          ? `${q.answer} is the one!`
          : `${q.a} ${q.op === '+' ? 'and' : 'take away'} ${q.b} makes ${q.answer}.`;
      setFeedback(msg);
      speak(msg);
      // longer pause on a wrong answer — this is the moment to look at the dots
      window.setTimeout(() => {
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
          <Navigation title="🧮 Math" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: NUM }}>
              Choose a number game! 🧮
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Numbers up to <span style={numStyle('13px')}>{max}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {MATH_MODES.map((m, i) => (
                <motion.button
                  key={m.id}
                  onClick={() => startMode(m)}
                  className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${m.grad}`}
                  style={{ boxShadow: `0 8px 0 ${m.shadow}, 0 12px 22px rgba(0,0,0,.18)`, minHeight: 150 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06, ...POP }}
                  whileTap={{ scale: 0.94, y: 4 }}
                >
                  <motion.div
                    className="flex justify-center mb-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.4 + i * 0.3, repeat: Infinity }}
                  >
                    <ItemIcon icon={m.icon} size={44} label={m.title} />
                  </motion.div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: NUM, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
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
          <Navigation title={`🧮 ${mode.title}`} onBack={() => { playClick(); setMode(null); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">🧮</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: NUM }}>
                {stars === 3 ? 'Number star!' : 'Good work!'} 🎉
              </p>

              <div className="mt-3 inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl px-6 py-3" style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}>
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
                <p className="text-sm text-gray-600 font-semibold">{mode.learned}</p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={() => startMode(mode)}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); setMode(null); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 5px 0 #1E40AF', fontFamily: NUM }}
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

  if (!q) return null;

  /* ---------------- playing ---------------- */
  const isLine = mode.id === 'line';
  const target = q.op === '+' ? q.a + q.b : q.a - q.b;

  const trackTap = (clientX: number) => {
    const el = trackRef.current;
    if (!el || picked !== null) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const n = Math.round(ratio * max);
    if (n !== hop) buzz('tick');
    setHop(n);
  };

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🧮 ${mode.title}`}
          onBack={() => { playClick(); stopSpeaking(); setMode(null); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / TOTAL) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {/* progress + streak */}
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

          {/* the question, tappable to repeat */}
          <motion.button
            key={qIndex}
            onClick={() => speak(q.prompt)}
            className={`w-full max-w-sm rounded-2xl px-4 py-3 mb-3 text-white border-4 border-white bg-gradient-to-r ${mode.grad}`}
            style={{ boxShadow: `0 5px 0 ${mode.shadow}`, fontFamily: NUM }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              {q.prompt}
            </span>
            <span className="opacity-80 text-xs ml-2">🔊</span>
          </motion.button>

          {/* ---------- COUNT IT ---------- */}
          {q.op === 'count' && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="bg-white/95 rounded-3xl p-4 border-4 border-white" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
                <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                  {Array.from({ length: q.a }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: lit === i ? 1.3 : 1 }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 460, damping: 18 }}
                      style={{ filter: lit === i ? 'drop-shadow(0 0 8px #FACC15)' : 'none' }}
                    >
                      <ItemIcon icon={q.icon || '🍎'} size={38} />
                    </motion.div>
                  ))}
                </div>
              </div>
              <CountAlongButton onRun={run} />
            </div>
          )}

          {/* ---------- ADD & TAKE AWAY ---------- */}
          {(q.op === '+' || q.op === '-') && !isLine && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="bg-white/95 rounded-3xl p-4 border-4 border-white flex flex-col items-center gap-3" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <NumberTile value={q.a} color="#2C7BE5" size={44} />
                  <span style={{ ...numStyle('34px'), color: '#7B2CBF' }}>{q.op}</span>
                  <NumberTile value={q.b} color="#E5383B" size={44} />
                  <span style={{ ...numStyle('30px'), color: '#9AA0A6' }}>=</span>
                  <NumberTile value="?" color="#F0A017" size={44} />
                </div>

                {/* the quantity, always — not just on easy addition */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <TenFrame count={q.a} color="#2C7BE5" size={frame} cell={26} highlight={lit} />
                  {q.op === '+' ? (
                    <>
                      <span style={{ ...numStyle('22px'), color: '#7B2CBF' }}>+</span>
                      <TenFrame count={q.b} color="#E5383B" size={frame} cell={26} />
                    </>
                  ) : (
                    <span className="text-xs font-bold text-gray-500" style={{ fontFamily: NUM }}>
                      take away <span style={numStyle('16px')}>{q.b}</span>
                    </span>
                  )}
                </div>
              </div>
              <CountAlongButton onRun={run} />
            </div>
          )}

          {/* ---------- MORE OR FEWER ---------- */}
          {q.op === 'compare' && (
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {[q.a, q.b].map((n, i) => {
                const doneNow = picked !== null;
                const isRight = n === q.answer;
                const isPicked = picked === n;
                return (
                  <motion.button
                    key={i}
                    onClick={() => resolve(n)}
                    disabled={doneNow}
                    className="rounded-3xl p-3 border-4 flex flex-col items-center gap-2 bg-white"
                    style={{
                      borderColor: doneNow ? (isRight ? '#22C55E' : isPicked ? '#DC2626' : '#fff') : '#fff',
                      boxShadow: '0 6px 0 rgba(0,0,0,.14)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08, ...POP }}
                    whileTap={!doneNow ? { scale: 0.95, y: 3 } : {}}
                  >
                    <TenFrame count={n} color={i === 0 ? '#2C7BE5' : '#F0522B'} size={frame} cell={22} />
                    {doneNow && <span style={{ ...numStyle('26px'), color: '#5B6079' }}>{n}</span>}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ---------- NUMBER LINE ---------- */}
          {isLine && (
            <div className="w-full max-w-sm flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <NumberTile value={q.a} color="#2C7BE5" size={36} />
                <span style={{ ...numStyle('26px'), color: '#7B2CBF' }}>{q.op}</span>
                <NumberTile value={q.b} color="#E5383B" size={36} />
              </div>

              <div
                ref={trackRef}
                className="relative w-full bg-white/95 rounded-2xl border-4 border-white"
                style={{ height: 84, boxShadow: '0 6px 0 rgba(0,0,0,.10)', touchAction: 'none' }}
                onPointerDown={(e) => trackTap(e.clientX)}
                onPointerMove={(e) => e.buttons && trackTap(e.clientX)}
              >
                {/* the line */}
                <div className="absolute left-3 right-3 bg-gray-300 rounded-full" style={{ top: 52, height: 4 }} />

                {/* ticks */}
                {Array.from({ length: max + 1 }, (_, i) => {
                  const pctPos = (i / max) * 100;
                  const labelled = max <= 10 || i % 5 === 0;
                  return (
                    <div key={i} className="absolute" style={{ left: `calc(12px + ${pctPos}% - ${(24 * pctPos) / 100}px)`, top: 44 }}>
                      <div className="bg-gray-400 rounded-full" style={{ width: 2, height: labelled ? 14 : 8 }} />
                      {labelled && (
                        <span className="absolute left-1/2 -translate-x-1/2" style={{ ...numStyle('11px'), top: 16, color: '#6B7280' }}>
                          {i}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* start marker */}
                <div
                  className="absolute rounded-full bg-blue-400"
                  style={{
                    width: 12,
                    height: 12,
                    top: 48,
                    left: `calc(12px + ${(q.a / max) * 100}% - ${(24 * ((q.a / max) * 100)) / 100}px - 5px)`,
                  }}
                />

                {/* the frog */}
                <motion.div
                  className="absolute"
                  style={{ top: 6, left: `calc(12px + ${(hop / max) * 100}% - ${(24 * ((hop / max) * 100)) / 100}px - 18px)` }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <ItemIcon icon="🐸" size={36} label="frog" />
                  <div className="text-center" style={{ ...numStyle('13px'), color: '#16A34A' }}>{hop}</div>
                </motion.div>
              </div>

              <p className="text-xs text-gray-500 font-semibold">👆 Tap or slide the frog to the answer</p>

              <motion.button
                onClick={() => resolve(hop)}
                disabled={picked !== null}
                className="rounded-2xl px-8 py-4 text-white font-bold border-4 border-white disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg,#22C55E,#0E9F6E)',
                  boxShadow: '0 6px 0 #047857',
                  fontFamily: NUM,
                  fontSize: '1.1rem',
                }}
                whileTap={{ scale: 0.95, y: 3 }}
              >
                🐸 Hop!
              </motion.button>

              {picked !== null && (
                <p className="text-sm font-bold" style={{ fontFamily: NUM, color: hop === target ? '#16A34A' : '#DC2626' }}>
                  The answer was <span style={numStyle('18px')}>{q.answer}</span>
                </p>
              )}
            </div>
          )}

          {/* options — every mode except compare and line */}
          {q.op !== 'compare' && !isLine && (
            <div className="mt-4 w-full flex justify-center">
              <Options options={q.options} answer={q.answer} picked={picked} onPick={resolve} />
            </div>
          )}

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

export default MathGame;
