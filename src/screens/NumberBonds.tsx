import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
import { BOND_LEVELS, BondLevel, BondQuestion, buildQuestions, promptFor, rightFor, QUESTIONS_PER_GAME } from '../data/numberBondsData';

/**
 * NumberBonds: pairs that make 5 or 10.
 *
 * The child sees   [7] + [?] = [10]   and a row (or ten frame) of circles with
 * the known part filled in. They tap the missing number from four buttons.
 *
 *   right      the empty circles fill up, "7 and 3 make 10!", next question
 *   wrong      the button greys out and the child tries again. After two wrong
 *              tries the right button glows. Hard level: the dots appear after
 *              the first wrong try, as a hint.
 *
 * A game is 8 questions. Stars come from accuracy (right taps / all taps).
 * Questions are made in code (see data/numberBondsData.ts), nothing to maintain.
 */

interface NumberBondsProps {
  defaultBand: 'easy' | 'medium' | 'hard';
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";
const COLS = 5;

const numStyle = (size: string): React.CSSProperties => ({
  fontFamily: NUM,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums lining-nums',
  fontFeatureSettings: "'tnum' 1, 'lnum' 1",
});

const CHOICE_COLORS = [
  { bg: '#2C7BE5', sh: '#1E40AF' },
  { bg: '#57CC5B', sh: '#047857' },
  { bg: '#F0522B', sh: '#C2410C' },
  { bg: '#7B2CBF', sh: '#5B21B6' },
];

type Part = 'known' | 'hidden' | 'solved' | 'total';

const partStyle = (part: Part): React.CSSProperties => {
  switch (part) {
    case 'hidden':
      return { background: '#FFFBEB', border: '3px dashed #F59E0B', color: '#F59E0B', boxShadow: '0 3px 0 #FCD34D' };
    case 'solved':
      return { background: '#DCFCE7', border: '3px solid #22C55E', color: '#15803D', boxShadow: '0 3px 0 #22C55E' };
    case 'total':
      return { background: '#EEF2FF', border: '3px solid #A5B4FC', color: '#4338CA', boxShadow: '0 3px 0 #A5B4FC' };
    default:
      return { background: '#fff', border: '3px solid #BFD4F5', color: '#2C7BE5', boxShadow: '0 3px 0 #BFD4F5' };
  }
};

/* ------------------------------------------------------------------ */
/* One number box in the sum                                           */
/* ------------------------------------------------------------------ */

const Box: React.FC<{ part: Part; value: number | null; kind: string }> = ({ part, value, kind }) => (
  <div
    data-kind={kind}
    data-part={part}
    className="rounded-2xl flex items-center justify-center"
    style={{ ...partStyle(part), width: 64, height: 64 }}
  >
    <span style={numStyle(value !== null && value >= 10 ? '28px' : '34px')}>{value === null ? '?' : value}</span>
  </div>
);

/* ================================================================== */
/* The screen                                                          */
/* ================================================================== */

const NumberBonds: React.FC<NumberBondsProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [level, setLevel] = useState<BondLevel | null>(null);
  const [questions, setQuestions] = useState<BondQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [solved, setSolved] = useState(false);
  const [tried, setTried] = useState<number[]>([]); // wrong buttons already tapped
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [tally, setTally] = useState({ right: 0, wrong: 0 });

  const rights = useRef(0);
  const wrongs = useRef(0);
  const awarded = useRef(false);
  const locked = useRef(false); // true from the right answer until the next question
  const qiRef = useRef(0);
  const questionsRef = useRef<BondQuestion[]>([]);

  /* every pending timeout lives here, so leaving the game cancels them all */
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const feedbackTimer = useRef<number | null>(null);
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = null;
  };

  useEffect(
    () => () => {
      clearTimers();
      stopSpeaking();
    },
    []
  );

  // one message at a time: a new message cancels the hiding timer of the old one
  const flash = (msg: string, ms = 1800) => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    setFeedback(msg);
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), ms);
  };

  const showQuestion = (q: BondQuestion) => {
    setSolved(false);
    setTried([]);
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    setFeedback(null);
    locked.current = false;
    speak(promptFor(q));
  };

  const startLevel = (l: BondLevel) => {
    clearTimers();
    playClick();
    buzz('tick');
    const qs = buildQuestions(l, QUESTIONS_PER_GAME);
    questionsRef.current = qs;
    qiRef.current = 0;
    rights.current = 0;
    wrongs.current = 0;
    awarded.current = false;
    setLevel(l);
    setQuestions(qs);
    setQi(0);
    setDone(false);
    setTally({ right: 0, wrong: 0 });
    setSolved(false);
    setTried([]);
    setFeedback(null);
    locked.current = false;
    speak(`${l.title}. ${promptFor(qs[0])}`);
  };

  const leaveToMenu = () => {
    clearTimers();
    stopSpeaking();
    locked.current = true;
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

  const nextQuestion = () => {
    const next = qiRef.current + 1;
    if (next >= questionsRef.current.length) {
      finishGame();
      return;
    }
    qiRef.current = next;
    setQi(next);
    showQuestion(questionsRef.current[next]);
  };

  const q = questions[qi];

  const pick = (value: number) => {
    if (!q || locked.current || tried.includes(value)) return;

    if (value === q.answer) {
      locked.current = true;
      rights.current += 1;
      onAnswer(true);
      playCorrect();
      buzz('soft');
      setSolved(true);
      flash('Yes! 🎉', 2000);
      speak(rightFor(q));
      later(nextQuestion, 2000);
      return;
    }

    // wrong: grey the button out and let the child try again
    wrongs.current += 1;
    onAnswer(false);
    playWrong();
    buzz('oops');
    const nowTried = [...tried, value];
    setTried(nowTried);
    const showingDots = level ? level.dots || nowTried.length >= 1 : true;
    flash(level && !level.dots && nowTried.length === 1 ? 'Try again! The dots can help you.' : 'Try again! Count the empty circles.', 2000);
    speak(showingDots ? 'Try again. Count the empty circles.' : 'Try again.');
  };

  /* ---------------- level picker ---------------- */
  if (!level) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🤝 Number Bonds" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: NUM }}>
              Which numbers are friends? 🤝
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Two numbers that fit together to make a total. Can you find the missing friend?
            </p>

            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {BOND_LEVELS.map((l, i) => (
                <motion.button
                  key={l.id}
                  data-kind="level"
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
          <Navigation title={`🤝 ${level.title}`} onBack={() => { playClick(); leaveToMenu(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">🤝</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: NUM }}>
                {stars === 3 ? 'Super friends!' : 'Good work!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex flex-col items-center bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span data-kind="result-count" style={{ ...numStyle('44px'), color: '#2C7BE5' }}>{tally.right}</span>
                <span className="text-gray-500 text-xs font-bold mt-1" style={{ fontFamily: NUM }}>
                  pairs found
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
                  Number bonds are pairs that make a total, like 7 and 3 make 10. Knowing them by heart makes adding and taking away much
                  faster. Try it out loud: &quot;I have 6. How many more to make {level.total}?&quot;
                </p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  data-kind="again"
                  onClick={() => startLevel(level)}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  data-kind="newlevel"
                  onClick={() => { playClick(); leaveToMenu(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 5px 0 #1E40AF', fontFamily: NUM }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🤝 New level
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (!q) return null;

  const showDots = level.dots || tried.length >= 1 || solved;
  const rows = Math.ceil(q.total / COLS);
  const circles = Array.from({ length: q.total }, (_, i) => i);
  const glowValue = tried.length >= 2 ? q.answer : null;

  const firstPart: Part = q.hide === 'first' ? (solved ? 'solved' : 'hidden') : 'known';
  const secondPart: Part = q.hide === 'second' ? (solved ? 'solved' : 'hidden') : 'known';
  const firstValue = q.hide === 'first' && !solved ? null : q.first;
  const secondValue = q.hide === 'second' && !solved ? null : q.second;

  /* ---------------- playing ---------------- */
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🤝 ${level.title}`}
          onBack={() => { playClick(); leaveToMenu(); }}
          stars={progress.stars}
          showProgress
          progress={((qi + (solved ? 1 : 0)) / questions.length) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {/* progress dots */}
          <div className="flex items-center justify-between w-full max-w-sm mt-1 mb-2">
            <div className="flex gap-1.5 items-center">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 11,
                    height: 11,
                    background: i < qi || (i === qi && solved) ? '#22C55E' : i === qi ? '#F97316' : 'rgba(0,0,0,.14)',
                  }}
                />
              ))}
              <span className="text-xs text-gray-500 font-bold ml-1" style={{ fontFamily: NUM }}>
                {qi + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* prompt, tap to hear */}
          <motion.button
            key={`p-${qi}`}
            data-kind="prompt"
            onClick={() => speak(promptFor(q))}
            className={`w-full max-w-sm rounded-2xl px-4 py-2.5 mb-3 text-white border-4 border-white bg-gradient-to-r ${level.grad}`}
            style={{ boxShadow: `0 5px 0 ${level.shadow}`, fontFamily: NUM }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              Make {q.total}: what is missing?
            </span>
            <span className="opacity-80 text-xs ml-2">🔊</span>
          </motion.button>

          {/* the sum and the dots */}
          <div
            className="bg-white/95 rounded-3xl p-3 border-4 border-white w-full max-w-sm"
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}
            data-kind="board"
          >
            <div className="flex items-center justify-center gap-2" data-kind="sum">
              <Box part={firstPart} value={firstValue} kind="first" />
              <span style={{ ...numStyle('30px'), color: '#9CA3AF' }}>+</span>
              <Box part={secondPart} value={secondValue} kind="second" />
              <span style={{ ...numStyle('30px'), color: '#9CA3AF' }}>=</span>
              <Box part="total" value={q.total} kind="total" />
            </div>

            <div className="mt-3">
              {showDots ? (
                <div
                  className="grid gap-2 mx-auto"
                  style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, maxWidth: 300 }}
                  data-kind="frame"
                  data-rows={rows}
                >
                  {circles.map((i) => {
                    const isKnown = i < q.known;
                    const isFilled = isKnown || solved;
                    return (
                      <motion.div
                        key={`${qi}-${i}-${solved ? 's' : 'e'}`}
                        data-kind="dot"
                        data-state={isKnown ? 'known' : solved ? 'solved' : 'empty'}
                        className="rounded-full w-full"
                        style={{
                          aspectRatio: '1 / 1',
                          background: isKnown ? '#2C7BE5' : isFilled ? '#F59E0B' : '#FFFBEB',
                          border: isFilled ? '3px solid #fff' : '3px dashed #F59E0B',
                          boxShadow: isFilled ? `0 3px 0 ${isKnown ? '#1E40AF' : '#B45309'}` : 'none',
                        }}
                        initial={solved && !isKnown ? { scale: 0.4 } : false}
                        animate={{ scale: 1 }}
                        transition={{ delay: solved && !isKnown ? (i - q.known) * 0.07 : 0, ...POP }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center" style={{ minHeight: rows * 50 }}>
                  <p className="text-center text-xs text-gray-400 font-semibold" style={{ fontFamily: NUM }}>
                    Think! You can do it without dots 🧠
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* answers */}
          <p className="text-xs text-gray-500 font-semibold mt-3 mb-2 text-center" style={{ fontFamily: NUM }}>
            {solved ? `🎉 ${q.first} and ${q.second} make ${q.total}!` : `🤝 Tap the number that makes ${q.total}`}
          </p>

          <div className="flex gap-2.5 justify-center w-full max-w-sm min-h-[64px]">
            {q.choices.map((value, i) => {
              const c = CHOICE_COLORS[i % CHOICE_COLORS.length];
              const wasTried = tried.includes(value);
              const glow = glowValue === value && !solved;
              return (
                <motion.button
                  key={`${qi}-${value}`}
                  type="button"
                  data-kind="choice"
                  data-value={value}
                  data-answer={value === q.answer ? 'true' : 'false'}
                  aria-label={String(value)}
                  disabled={wasTried}
                  onClick={() => pick(value)}
                  className="rounded-2xl border-4 border-white flex items-center justify-center text-white"
                  style={{
                    background: wasTried ? '#9CA3AF' : c.bg,
                    width: 62,
                    height: 62,
                    opacity: wasTried ? 0.5 : 1,
                    boxShadow: glow
                      ? `0 5px 0 ${c.sh}, 0 0 0 4px #FBBF24, 0 0 16px #FBBF24`
                      : wasTried
                      ? '0 2px 0 #6B7280'
                      : `0 5px 0 ${c.sh}`,
                  }}
                  initial={{ scale: 0 }}
                  animate={glow ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={glow ? { duration: 0.9, repeat: Infinity } : { delay: i * 0.04, ...POP }}
                  whileTap={{ scale: 0.92, y: 3 }}
                >
                  <span style={numStyle('28px')}>{value}</span>
                </motion.button>
              );
            })}
          </div>

          {/* feedback */}
          <div className="h-12 flex items-center mt-2">
            <AnimatePresence>
              {feedback && (
                <motion.p
                  data-kind="feedback"
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

export default NumberBonds;
