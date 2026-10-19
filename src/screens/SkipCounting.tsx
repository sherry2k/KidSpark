import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * SkipCounting — a number chart that counts in jumps of 10, 5 or 2.
 *
 * Same idea as MissingNumbers: a chart in lines of five boxes with some boxes
 * left blank. The child taps a blank box, then taps the number that belongs
 * there from the tray underneath. The next blank is selected automatically.
 *
 *   Count by 10s   10, 20, 30 ... 100   two lines, one or two gaps per line
 *   Count by 5s    5, 10, 15 ... 100    four lines, one or two gaps per line
 *   Count by 2s    2, 4, 6 ... 40       four lines, two gaps per line
 *
 * A game is three charts. Wrong answers can be retried; after two wrong tries
 * on the same box the right number in the tray starts to glow. Charts are
 * generated in code, so there is no data to maintain.
 */

type Band = 'easy' | 'medium' | 'hard';

interface SkipCountingProps {
  defaultBand: Band;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const COLS = 5;
const CHARTS = 3;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";
// three-digit numbers (100) get a slightly smaller size so they fit the box
const sizeFor = (v: number) => (v >= 100 ? '21px' : '26px');

const numStyle = (size: string): React.CSSProperties => ({
  fontFamily: NUM,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums lining-nums',
  fontFeatureSettings: "'tnum' 1, 'lnum' 1",
});

interface Level {
  id: string;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
  band: Band;
  step: number; // the jump between neighbouring boxes
  rows: number; // lines of five numbers
  perRow: [number, number]; // min and max gaps in each line
}

// the first box of every chart holds `step`, then 2 x step, 3 x step ...
const LEVELS: Level[] = [
  { id: '10', title: 'Count by 10s', sub: '10, 20, 30 ... 100', icon: '🔟', grad: 'from-lime-400 to-green-500', shadow: '#15803D', diff: 1, band: 'easy', step: 10, rows: 2, perRow: [1, 2] },
  { id: '5', title: 'Count by 5s', sub: '5, 10, 15 ... 100', icon: '🖐️', grad: 'from-sky-400 to-blue-500', shadow: '#1D4ED8', diff: 2, band: 'medium', step: 5, rows: 4, perRow: [1, 2] },
  { id: '2', title: 'Count by 2s', sub: '2, 4, 6 ... 40', icon: '🐸', grad: 'from-fuchsia-500 to-purple-600', shadow: '#7E22CE', diff: 3, band: 'hard', step: 2, rows: 4, perRow: [2, 2] },
];

interface Chart {
  step: number; // jump between boxes; the box at position p holds (p + 1) x step
  rows: number;
  blanks: number[]; // box positions (0 = first box), ascending
  tray: number[]; // the missing numbers, shuffled
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

const valueAt = (chart: Chart, idx: number) => (idx + 1) * chart.step;

const makeCharts = (level: Level): Chart[] => {
  const out: Chart[] = [];

  for (let c = 0; c < CHARTS; c++) {
    const blanks: number[] = [];

    for (let r = 0; r < level.rows; r++) {
      // the very first box always stays visible so the child can see where the chart begins
      const cols = Array.from({ length: COLS }, (_, i) => i).filter((i) => !(r === 0 && i === 0));
      const count = randInt(level.perRow[0], level.perRow[1]);
      shuffle(cols)
        .slice(0, count)
        .forEach((col) => blanks.push(r * COLS + col));
    }

    blanks.sort((a, b) => a - b);
    out.push({ step: level.step, rows: level.rows, blanks, tray: shuffle(blanks.map((b) => (b + 1) * level.step)) });
  }
  return out;
};

const TRAY_COLORS = [
  { bg: '#2C7BE5', sh: '#1E40AF' },
  { bg: '#57CC5B', sh: '#047857' },
  { bg: '#F0522B', sh: '#C2410C' },
  { bg: '#7B2CBF', sh: '#5B21B6' },
];

/* ------------------------------------------------------------------ */
/* One box in the chart                                                */
/* ------------------------------------------------------------------ */

type Tone = 'normal' | 'blank' | 'active' | 'right';

const toneStyle = (tone: Tone): React.CSSProperties => {
  switch (tone) {
    case 'blank':
      return { background: '#FFFBEB', border: '3px dashed #F59E0B', color: '#F59E0B', boxShadow: '0 3px 0 #FCD34D' };
    case 'active':
      return { background: '#FEF3C7', border: '3px solid #F59E0B', color: '#D97706', boxShadow: '0 3px 0 #F59E0B, 0 0 14px #FBBF24' };
    case 'right':
      return { background: '#DCFCE7', border: '3px solid #22C55E', color: '#15803D', boxShadow: '0 3px 0 #22C55E' };
    default:
      return { background: '#fff', border: '3px solid #BFD4F5', color: '#2C7BE5', boxShadow: '0 3px 0 #BFD4F5' };
  }
};

/* ================================================================== */
/* The screen                                                          */
/* ================================================================== */

const SkipCounting: React.FC<SkipCountingProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [level, setLevel] = useState<Level | null>(null);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [ci, setCi] = useState(0); // which chart
  const [filled, setFilled] = useState<number[]>([]); // box positions filled correctly
  const [active, setActive] = useState<number | null>(null); // selected blank
  const [misses, setMisses] = useState<Record<number, number>>({}); // wrong tries per box
  const [shakeCell, setShakeCell] = useState<{ idx: number; tick: number } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [chartDone, setChartDone] = useState(false);
  const [done, setDone] = useState(false);
  const [tally, setTally] = useState({ right: 0, wrong: 0 });

  const rights = useRef(0);
  const wrongs = useRef(0);
  const awarded = useRef(false);
  const timer = useRef<number | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    timer.current = null;
    feedbackTimer.current = null;
  };

  useEffect(
    () => () => {
      clearTimers();
      stopSpeaking();
    },
    []
  );

  const flash = (msg: string, ms = 1600) => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    setFeedback(msg);
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), ms);
  };

  const beginChart = (chart: Chart) => {
    setFilled([]);
    setMisses({});
    setShakeCell(null);
    setChartDone(false);
    setActive(chart.blanks[0] ?? null);
  };

  const startLevel = (l: Level) => {
    clearTimers();
    playClick();
    buzz('tick');
    const cs = makeCharts(l);
    setLevel(l);
    setCharts(cs);
    setCi(0);
    setDone(false);
    setFeedback(null);
    rights.current = 0;
    wrongs.current = 0;
    setTally({ right: 0, wrong: 0 });
    awarded.current = false;
    beginChart(cs[0]);
    speak(`${l.title}. Fill in the missing numbers.`);
  };

  const leaveToMenu = () => {
    clearTimers();
    stopSpeaking();
    setFeedback(null);
    setLevel(null);
  };

  const finishGame = () => {
    setDone(true);
    setTally({ right: rights.current, wrong: wrongs.current });
    playComplete();
    buzz('success');
    if (!awarded.current) {
      awarded.current = true;
      const total = rights.current + wrongs.current;
      const accuracy = total === 0 ? 1 : rights.current / total;
      onComplete(accuracy >= 0.8 ? 3 : accuracy >= 0.5 ? 2 : 1);
    }
  };

  const chart = charts[ci];

  const pickTray = (value: number) => {
    if (!chart || chartDone) return;

    if (active === null) {
      flash('Tap an empty box first 👆', 1400);
      speak('Tap an empty box first.');
      return;
    }

    const expected = valueAt(chart, active);

    if (value === expected) {
      rights.current += 1;
      onAnswer(true);
      const nextFilled = [...filled, active];
      setFilled(nextFilled);
      speak(String(value));

      const remaining = chart.blanks.filter((b) => !nextFilled.includes(b));
      if (remaining.length > 0) {
        playClick();
        buzz('soft');
        // move on to the next empty box, reading left to right
        const after = remaining.find((b) => b > active);
        setActive(after !== undefined ? after : remaining[0]);
        return;
      }

      // chart complete
      playCorrect();
      buzz('soft');
      setActive(null);
      setChartDone(true);
      flash('Great job! 🎉', 1300);
      timer.current = window.setTimeout(() => {
        if (ci + 1 >= charts.length) {
          finishGame();
        } else {
          setCi(ci + 1);
          beginChart(charts[ci + 1]);
          speak(`${level ? level.title : 'Count'}. Fill in the missing numbers.`);
        }
      }, 1400);
      return;
    }

    // wrong number: try again
    wrongs.current += 1;
    onAnswer(false);
    playWrong();
    buzz('oops');
    setMisses((m) => ({ ...m, [active]: (m[active] || 0) + 1 }));
    setShakeCell((s) => ({ idx: active, tick: (s?.tick ?? 0) + 1 }));
    flash('Try again! Look at the numbers next to the box.', 1800);
    speak('Try again.');
  };

  const tapCell = (idx: number, isBlank: boolean, isFilled: boolean) => {
    if (!chart || chartDone) return;
    if (isBlank && !isFilled) {
      playClick();
      buzz('tick');
      setActive(idx);
      return;
    }
    // a number that is already showing: say it
    buzz('tick');
    speak(String(valueAt(chart, idx)));
  };

  /* ---------------- level picker ---------------- */
  if (!level) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🐸 Skip Counting" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: NUM }}>
              How do you count? 🐸
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Hop along the chart! Some numbers are missing. Can you find them?
            </p>

            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {LEVELS.map((l, i) => (
                <motion.button
                  key={l.id}
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
    const total = tally.right + tally.wrong;
    const accuracy = total === 0 ? 1 : tally.right / total;
    const stars = accuracy >= 0.8 ? 3 : accuracy >= 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title={`🐸 ${level.title}`} onBack={() => { playClick(); leaveToMenu(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">🐸</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: NUM }}>
                {stars === 3 ? 'Super hopper!' : 'Good work!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex flex-col items-center bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ ...numStyle('44px'), color: '#2C7BE5' }}>{tally.right}</span>
                <span className="text-gray-500 text-xs font-bold mt-1" style={{ fontFamily: NUM }}>
                  numbers found
                </span>
                <span className="text-gray-400 text-xs font-semibold mt-0.5" style={{ fontFamily: NUM }}>
                  {tally.wrong === 0 ? 'no mistakes!' : `${tally.wrong} ${tally.wrong === 1 ? 'mistake' : 'mistakes'}`}
                </span>
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
                  Skip counting is the first step towards the times tables. Ask your child to count along each line out loud
                  in jumps ({level.step}, {level.step * 2}, {level.step * 3} ...) and to say which number comes before and after each gap.
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
                  🐸 New level
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (!chart) return null;

  const cells = Array.from({ length: chart.rows * COLS }, (_, i) => i);
  const trayLeft = chart.tray.filter((v) => !filled.includes(v / chart.step - 1));
  const glowValue = active !== null && (misses[active] || 0) >= 2 ? valueAt(chart, active) : null;

  /* ---------------- playing ---------------- */
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🐸 ${level.title}`}
          onBack={() => { playClick(); leaveToMenu(); }}
          stars={progress.stars}
          showProgress
          progress={((ci + (chartDone ? 1 : 0)) / charts.length) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {/* progress dots */}
          <div className="flex items-center justify-between w-full max-w-sm mt-1 mb-2">
            <div className="flex gap-1.5 items-center">
              {charts.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 11,
                    height: 11,
                    background: i < ci || (i === ci && chartDone) ? '#22C55E' : i === ci ? '#F97316' : 'rgba(0,0,0,.14)',
                  }}
                />
              ))}
              <span className="text-xs text-gray-500 font-bold ml-1" style={{ fontFamily: NUM }}>
                chart {ci + 1} of {charts.length}
              </span>
            </div>
          </div>

          {/* prompt, tap to hear */}
          <motion.button
            key={`p-${ci}`}
            onClick={() => speak(`${level.title}. Fill in the missing numbers.`)}
            className={`w-full max-w-sm rounded-2xl px-4 py-2.5 mb-3 text-white border-4 border-white bg-gradient-to-r ${level.grad}`}
            style={{ boxShadow: `0 5px 0 ${level.shadow}`, fontFamily: NUM }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              {level.title}: fill in the gaps
            </span>
            <span className="opacity-80 text-xs ml-2">🔊</span>
          </motion.button>

          {/* the chart */}
          <div
            className="bg-white/95 rounded-3xl p-3 border-4 border-white w-full max-w-sm"
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}
            data-kind="chart"
          >
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
              {cells.map((idx) => {
                const isBlank = chart.blanks.includes(idx);
                const isFilled = filled.includes(idx);
                const isActive = active === idx && isBlank && !isFilled;
                const tone: Tone = !isBlank ? 'normal' : isFilled ? 'right' : isActive ? 'active' : 'blank';
                const shaking = shakeCell !== null && shakeCell.idx === idx;

                return (
                  <motion.button
                    key={shaking && isActive ? `s${idx}-${shakeCell?.tick}` : `c${idx}`}
                    type="button"
                    data-kind="cell"
                    data-idx={idx}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => tapCell(idx, isBlank, isFilled)}
                    className="rounded-xl flex items-center justify-center"
                    style={{ ...toneStyle(tone), height: 56 }}
                    initial={shaking && isActive ? { x: 0 } : false}
                    animate={shaking && isActive ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.35 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <span style={numStyle(sizeFor(valueAt(chart, idx)))}>{isBlank && !isFilled ? '?' : valueAt(chart, idx)}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* the tray */}
          <p className="text-xs text-gray-500 font-semibold mt-3 mb-2 text-center" style={{ fontFamily: NUM }}>
            {chartDone ? '🎉 All done!' : `🐸 Each box adds ${chart.step}. Tap a box, then tap the number that fits`}
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center w-full max-w-sm min-h-[64px]">
            {trayLeft.map((value, i) => {
              const c = TRAY_COLORS[i % TRAY_COLORS.length];
              const glow = glowValue === value;
              return (
                <motion.button
                  key={`${ci}-${value}`}
                  type="button"
                  data-kind="tray"
                  onClick={() => pickTray(value)}
                  className="rounded-2xl border-4 border-white flex items-center justify-center text-white"
                  style={{
                    background: c.bg,
                    width: 58,
                    height: 58,
                    boxShadow: glow ? `0 5px 0 ${c.sh}, 0 0 0 4px #FBBF24, 0 0 16px #FBBF24` : `0 5px 0 ${c.sh}`,
                  }}
                  initial={{ scale: 0 }}
                  animate={glow ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={glow ? { duration: 0.9, repeat: Infinity } : { delay: i * 0.04, ...POP }}
                  whileTap={{ scale: 0.92, y: 3 }}
                >
                  <span style={numStyle(sizeFor(value))}>{value}</span>
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

export default SkipCounting;
