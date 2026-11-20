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
 * ClockTime — "What time is it?"
 *
 * Level 1 is o'clock only: the child reads the SHORT hand (the hour) and picks
 * the matching time. The long hand always points at 12, so there is exactly one
 * thing to learn. Half past / quarter past can be added later as extra levels
 * by letting `makeQuestion` return a `minute` as well (the Clock already draws
 * any hour + minute).
 *
 * Props match the other Math games (MissingNumbers, SkipCounting, NumberBonds).
 *
 * NOTE: spacing is done with inline styles / gap on purpose — on phones the
 * global `* { margin:0; padding:0 }` rule in index.css overrides Tailwind
 * margin/padding utilities.
 */

interface ClockTimeProps {
  defaultBand: Band;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";
const NAVY = '#1E2A4A';

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

interface ClockQ {
  hour: number; // 1..12
  options: number[]; // four different hours, one of them is `hour`
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

/** Younger children start with the easy hours; everyone else gets all 12. */
const poolFor = (band: Band): number[] =>
  band === 'easy' ? [12, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const makeQuestion = (band: Band, prev: number | null): ClockQ => {
  const pool = poolFor(band);
  let hour = pool[rand(pool.length)];
  while (hour === prev) hour = pool[rand(pool.length)];

  const set = new Set<number>([hour]);
  // one "close" wrong answer (an hour either side) — the classic mix-up
  const near = Math.random() < 0.5 ? (hour % 12) + 1 : ((hour + 10) % 12) + 1;
  if (pool.includes(near)) set.add(near);
  while (set.size < 4) set.add(pool[rand(pool.length)]);

  return { hour, options: shuffle([...set]) };
};

const say = (h: number) => `${h} o'clock`;

/* ------------------------------------------------------------------ */
/* The clock face                                                      */
/* ------------------------------------------------------------------ */

const Clock: React.FC<{ hourAngle: number; minuteAngle: number; glow: boolean }> = ({
  hourAngle,
  minuteAngle,
  glow,
}) => {
  const ease = 'transform .9s cubic-bezier(.34,1.4,.5,1)';
  return (
    <svg
      viewBox="0 0 300 300"
      width="100%"
      height="100%"
      role="img"
      aria-label="A clock"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 5px rgba(60,20,110,.22))' }}
    >
      <defs>
        <linearGradient id="clockRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="146" fill="url(#clockRing)" />
      <circle cx="150" cy="150" r="136" fill="#fff" />

      {/* minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const a = (i * 6 * Math.PI) / 180;
        const r1 = big ? 118 : 121;
        const r2 = 130;
        return (
          <line
            key={i}
            x1={150 + r1 * Math.sin(a)}
            y1={150 - r1 * Math.cos(a)}
            x2={150 + r2 * Math.sin(a)}
            y2={150 - r2 * Math.cos(a)}
            stroke={big ? '#8B7DB5' : '#CFC6E6'}
            strokeWidth={big ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}

      {/* numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return (
          <text
            key={n}
            x={150 + 96 * Math.sin(a)}
            y={150 - 96 * Math.cos(a)}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Fredoka, sans-serif"
            fontWeight={700}
            fontSize={30}
            fill={NAVY}
          >
            {n}
          </text>
        );
      })}

      {/* long hand = minutes (blue) */}
      <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '150px 150px', transition: ease }}>
        <line x1="150" y1="162" x2="150" y2="56" stroke="#2F9BF0" strokeWidth={9} strokeLinecap="round" />
      </g>

      {/* short hand = hour (coral) — glows when the child asks for a hint */}
      <g
        style={{
          transform: `rotate(${hourAngle}deg)`,
          transformOrigin: '150px 150px',
          transition: ease,
          filter: glow ? 'drop-shadow(0 0 6px #FACC15)' : 'none',
        }}
      >
        <line
          x1="150"
          y1="158"
          x2="150"
          y2="96"
          stroke="#FF5A4F"
          strokeWidth={glow ? 19 : 15}
          strokeLinecap="round"
        >
          {glow && <animate attributeName="opacity" values="1;.55;1" dur="1s" repeatCount="indefinite" />}
        </line>
      </g>

      <circle cx="150" cy="150" r="13" fill={NAVY} />
      <circle cx="150" cy="150" r="5" fill="#fff" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Answer card                                                         */
/* ------------------------------------------------------------------ */

const AnswerCard: React.FC<{
  hour: number;
  index: number;
  answer: number;
  picked: number | null;
  onPick: (h: number) => void;
}> = ({ hour, index, answer, picked, onPick }) => {
  const done = picked !== null;
  const isRight = hour === answer;
  const isPicked = picked === hour;

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
      onClick={() => onPick(hour)}
      disabled={done}
      aria-label={say(hour)}
      style={{
        position: 'relative',
        background: bg,
        border: `4px solid ${border}`,
        borderRadius: 22,
        boxShadow: `0 6px 0 ${shadow}`,
        minHeight: 92,
        opacity: done && !isRight && !isPicked ? 0.5 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
      initial={{ scale: 0, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, ...POP }}
      whileTap={!done ? { scale: 0.95, y: 3 } : {}}
    >
      {done && isRight && (
        <span style={{ position: 'absolute', left: 8, top: 4, fontSize: 20, lineHeight: 1 }}>✅</span>
      )}
      {done && isPicked && !isRight && (
        <span style={{ position: 'absolute', left: 10, top: 4, fontSize: 20, lineHeight: 1, color: '#DC2626' }}>✗</span>
      )}

      {/* hear this answer */}
      <span
        role="button"
        tabIndex={0}
        aria-label={`Hear ${say(hour)}`}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          speak(say(hour));
        }}
        style={{ position: 'absolute', right: 8, top: 5, fontSize: 15, lineHeight: 1, opacity: 0.55, cursor: 'pointer' }}
      >
        🔊
      </span>

      <span
        style={{
          fontFamily: NUM,
          fontWeight: 700,
          fontSize: 38,
          lineHeight: 1,
          color: NAVY,
          fontVariantNumeric: 'tabular-nums lining-nums',
        }}
      >
        {hour}:00
      </span>
      <span style={{ fontFamily: NUM, fontWeight: 600, fontSize: 15, color: '#4B5675' }}>{say(hour)}</span>
    </motion.button>
  );
};

/* ================================================================== */
/* The game                                                            */
/* ================================================================== */

const ClockTime: React.FC<ClockTimeProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [q, setQ] = useState<ClockQ>(() => makeQuestion(defaultBand, null));
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; kind: 'good' | 'oops' | 'hint' } | null>(null);
  const [hintOn, setHintOn] = useState(false);
  const [done, setDone] = useState(false);

  // hands only ever turn forwards, so they sweep round to the next time
  const [hourAngle, setHourAngle] = useState(() => (q.hour % 12) * 30);
  const [minuteAngle, setMinuteAngle] = useState(0);
  const hourRef = useRef(q.hour);

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
  useEffect(() => {
    speak('What time is it?');
    return () => {
      clearTimers();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showTime = (nq: ClockQ) => {
    const turn = ((nq.hour - hourRef.current + 12) % 12) * 30;
    hourRef.current = nq.hour;
    setHourAngle((a) => a + turn);
    setMinuteAngle((a) => a + 360);
    setQ(nq);
  };

  const restart = () => {
    clearTimers();
    playClick();
    buzz('tick');
    setQIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    setPicked(null);
    setFeedback(null);
    setHintOn(false);
    setDone(false);
    awarded.current = false;
    showTime(makeQuestion(defaultBand, hourRef.current));
    speak('What time is it?');
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
    setQIndex((i) => i + 1);
    setPicked(null);
    setHintOn(false);
    setFeedback(null);
    showTime(makeQuestion(defaultBand, q.hour));
    later(() => speak('What time is it?'), 500);
  };

  const resolve = (hour: number) => {
    if (picked !== null) return;
    setPicked(hour);
    setHintOn(false);
    const right = hour === q.hour;
    onAnswer(right);

    if (right) {
      playCorrect();
      buzz('soft');
      setScore((s) => s + 1);
      scoreRef.current += 1;
      const st = streak + 1;
      setStreak(st);
      const text = st >= 3 ? `${st} in a row! 🔥 It is ${say(hour)}!` : `🎉 Yes! It is ${say(hour)}!`;
      setFeedback({ text, kind: 'good' });
      speak(`Yes! It is ${say(hour)}!`);
      later(nextQuestion, 1500);
    } else {
      playWrong();
      buzz('oops');
      setStreak(0);
      const text = `It is ${say(q.hour)}. The short hand points to ${q.hour}.`;
      setFeedback({ text, kind: 'oops' });
      speak(text);
      // longer pause on a wrong answer — this is the moment to look at the hands
      later(nextQuestion, 3000);
    }
  };

  const hint = () => {
    if (picked !== null || hintOn) return;
    playClick();
    buzz('tick');
    setHintOn(true);
    const text = 'Look at the short hand. Which number does it point to?';
    setFeedback({ text: `💡 ${text}`, kind: 'hint' });
    speak(text);
  };

  /* ---------------- result ---------------- */
  if (done) {
    const stars = score >= TOTAL * 0.8 ? 3 : score >= TOTAL * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🕐 Clock" onBack={() => { playClick(); stopSpeaking(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto" style={{ padding: '0 20px 32px' }}>
            <div className="max-w-md mx-auto text-center">
              <div className="flex justify-center" style={{ marginTop: 16 }}>
                <SparkMascot mode={stars === 3 ? 'cheer' : 'wave'} className="w-28" />
              </div>
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: NUM, marginTop: 8 }}>
                {stars === 3 ? 'Clock star!' : 'Good work!'} 🎉
              </p>

              <div
                className="inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl"
                style={{ marginTop: 12, padding: '12px 24px', boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 44, lineHeight: 1, color: '#2C7BE5' }}>{score}</span>
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
                  Children learn to tell the time one hand at a time. Here the long hand always points to 12, so they
                  only read the short hand (the hour). Next steps: half past, then quarter past and quarter to.
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
                    background: 'linear-gradient(135deg,#2C7BE5,#6366F1)',
                    boxShadow: '0 5px 0 #1E40AF',
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
      : { background: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D', boxShadow: '0 4px 0 #F59E0B' };

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title="🕐 Clock"
          onBack={() => { playClick(); clearTimers(); stopSpeaking(); onBack(); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / TOTAL) * 100}
        />

        <div
          className="flex-1 flex flex-col items-center min-h-0 overflow-y-auto"
          style={{ padding: '0 12px 12px', gap: 10 }}
        >
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
              <span>🕐 O'clock</span>
            </div>
          </div>

          {/* question card with the clock */}
          <motion.div
            key={qIndex}
            className="w-full bg-white border-4 border-white flex flex-col items-center"
            style={{ maxWidth: 384, borderRadius: 28, boxShadow: '0 6px 0 rgba(0,0,0,.10)', padding: '12px 12px 14px', gap: 8 }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
          >
            <div style={{ width: 'min(56vw, 215px, 32vh)', aspectRatio: '1 / 1' }}>
              <Clock hourAngle={hourAngle} minuteAngle={minuteAngle} glow={hintOn} />
            </div>

            <button
              onClick={() => speak('What time is it?')}
              style={{ fontFamily: NUM, fontWeight: 700, fontSize: 21, color: NAVY, background: 'none', border: 0 }}
            >
              What time is it? <span style={{ fontSize: 16, opacity: 0.7 }}>🔊</span>
            </button>

            <div className="flex justify-center" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span
                className="flex items-center"
                style={{ gap: 5, background: '#FFF0EE', borderRadius: 12, padding: '3px 9px', fontFamily: NUM, fontWeight: 600, fontSize: 12, color: '#8A2A1F' }}
              >
                <i style={{ width: 12, height: 12, borderRadius: 6, background: '#FF5A4F', display: 'inline-block' }} />
                Short hand: hour
              </span>
              <span
                className="flex items-center"
                style={{ gap: 5, background: '#EAF4FF', borderRadius: 12, padding: '3px 9px', fontFamily: NUM, fontWeight: 600, fontSize: 12, color: '#1B568C' }}
              >
                <i style={{ width: 12, height: 12, borderRadius: 6, background: '#2F9BF0', display: 'inline-block' }} />
                Long hand: minutes
              </span>
            </div>
          </motion.div>

          {/* answers */}
          <div className="grid grid-cols-2 w-full" style={{ maxWidth: 384, gap: 12 }}>
            {q.options.map((h, i) => (
              <AnswerCard key={`${qIndex}-${h}`} hour={h} index={i} answer={q.hour} picked={picked} onPick={resolve} />
            ))}
          </div>

          <p style={{ fontFamily: NUM, fontWeight: 600, fontSize: 12, color: '#5B5675', textAlign: 'center' }}>
            👆 Tap your answer · 🔊 to hear a time
          </p>

          {/* feedback (or the hint button) */}
          <div className="flex items-center justify-center" style={{ minHeight: 56 }}>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.p
                  key={feedback.text}
                  className="font-bold text-center border-4"
                  style={{
                    ...fbStyle,
                    fontFamily: NUM,
                    fontSize: 15,
                    borderRadius: 20,
                    padding: '8px 16px',
                    maxWidth: 340,
                  }}
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

export default ClockTime;
