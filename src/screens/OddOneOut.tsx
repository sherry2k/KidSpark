import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
import { PIC, ROUNDS, OddLevel, OddRound } from '../data/oddOneOutData';

/**
 * OddOneOut: four pictures, three belong together, one does not.
 *
 * The child taps the one that is different. A right answer shows (and says) why;
 * a wrong answer lets the child try again, and after two wrong tries the right
 * picture starts to glow. A game is 8 rounds. Rounds are hand-written in
 * data/oddOneOutData.ts so there is always exactly one right answer.
 *
 * Scores are kept in refs, not state, so the timers never read an old value.
 */

type Band = 'easy' | 'medium' | 'hard';

interface OddOneOutProps {
  defaultBand: Band;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const ROUNDS_PER_GAME = 8;
const NUM = "'Fredoka', ui-rounded, system-ui, sans-serif";

interface Level {
  id: OddLevel;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
}

const LEVELS: Level[] = [
  { id: 'easy', title: 'Easy', sub: 'One is from a different group', icon: '🍎', grad: 'from-lime-400 to-green-500', shadow: '#15803D', diff: 1 },
  { id: 'medium', title: 'Medium', sub: 'Same family, one is different', icon: '🐘', grad: 'from-sky-400 to-blue-500', shadow: '#1D4ED8', diff: 2 },
  { id: 'hard', title: 'Think hard', sub: 'Colour, legs, hot or cold ...', icon: '🦉', grad: 'from-fuchsia-500 to-purple-600', shadow: '#7E22CE', diff: 3 },
];

interface Card {
  name: string;
  emoji: string;
  isOdd: boolean;
}

interface Round {
  src: OddRound;
  cards: Card[]; // always four, shuffled
}

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeRound = (src: OddRound): Round => ({
  src,
  cards: shuffle<Card>([
    ...src.group.map((name) => ({ name, emoji: PIC[name], isOdd: false })),
    { name: src.odd, emoji: PIC[src.odd], isOdd: true },
  ]),
});

const makeGame = (level: OddLevel): Round[] => shuffle(ROUNDS[level]).slice(0, ROUNDS_PER_GAME).map(makeRound);

const CARD_COLORS = [
  { edge: '#BFD4F5' },
  { edge: '#C7F0D2' },
  { edge: '#FFD9B5' },
  { edge: '#E3D1F7' },
];

const OddOneOut: React.FC<OddOneOutProps> = ({ defaultBand, progress, onBack, onAnswer, onComplete }) => {
  const [level, setLevel] = useState<Level | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ri, setRi] = useState(0);
  const [wrongNames, setWrongNames] = useState<string[]>([]); // cards tried and wrong in this round
  const [shake, setShake] = useState<{ name: string; tick: number } | null>(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
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

  const sayPrompt = (round?: Round) => {
    const r = round ?? rounds[ri];
    if (!r) return;
    speak(`Which one is different? ${r.cards.map((c) => c.name).join(', ')}.`);
  };

  const startLevel = (l: Level) => {
    clearTimers();
    playClick();
    buzz('tick');
    const rs = makeGame(l.id);
    setLevel(l);
    setRounds(rs);
    setRi(0);
    setWrongNames([]);
    setShake(null);
    setSolved(false);
    setDone(false);
    setFeedback(null);
    rights.current = 0;
    wrongs.current = 0;
    setTally({ right: 0, wrong: 0 });
    awarded.current = false;
    sayPrompt(rs[0]);
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

  const goNext = () => {
    clearTimers();
    setFeedback(null);
    if (ri + 1 >= rounds.length) {
      finishGame();
      return;
    }
    const next = ri + 1;
    setRi(next);
    setWrongNames([]);
    setShake(null);
    setSolved(false);
    sayPrompt(rounds[next]);
  };

  const round = rounds[ri];

  const pick = (card: Card) => {
    if (!round || solved || wrongNames.includes(card.name)) return;

    if (card.isOdd) {
      rights.current += 1;
      onAnswer(true);
      setSolved(true);
      playCorrect();
      buzz('soft');
      setFeedback(null);
      speak(round.src.reason);
      // long enough to read and hear the reason; the Next button can skip the wait
      timer.current = window.setTimeout(goNext, 3800);
      return;
    }

    wrongs.current += 1;
    onAnswer(false);
    playWrong();
    buzz('oops');
    setWrongNames((w) => [...w, card.name]);
    setShake((s) => ({ name: card.name, tick: (s?.tick ?? 0) + 1 }));
    flash('Not that one. Try again!', 1500);
    speak('Try again.');
  };

  /* ---------------- level picker ---------------- */
  if (!level) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🔍 Odd One Out" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: NUM }}>
              Which one is different? 🔍
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">
              Three pictures belong together. Find the odd one out!
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
                      {l.id === defaultBand && <span className="ml-2 text-xs opacity-90">★ for you</span>}
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
          <Navigation title={`🔍 ${level.title}`} onBack={() => { playClick(); leaveToMenu(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">🦉</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: NUM }}>
                {stars === 3 ? 'Super detective!' : 'Good looking!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex flex-col items-center bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 44, lineHeight: 1, color: '#2C7BE5' }}>{tally.right}</span>
                <span className="text-gray-500 text-xs font-bold mt-1" style={{ fontFamily: NUM }}>
                  odd ones found
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
                  Finding the odd one out teaches sorting and reasoning. After each round, ask your child why the others belong
                  together, then try making your own: pick three things from one group and one from another.
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
                  🔍 New level
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (!round) return null;

  const glowName = !solved && wrongNames.length >= 2 ? round.cards.find((c) => c.isOdd)?.name ?? null : null;

  /* ---------------- playing ---------------- */
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🔍 ${level.title}`}
          onBack={() => { playClick(); leaveToMenu(); }}
          stars={progress.stars}
          showProgress
          progress={((ri + (solved ? 1 : 0)) / rounds.length) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {/* progress dots */}
          <div className="flex items-center gap-1.5 w-full max-w-sm mt-1 mb-2">
            {rounds.map((_, i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: 11,
                  height: 11,
                  background: i < ri || (i === ri && solved) ? '#22C55E' : i === ri ? '#F97316' : 'rgba(0,0,0,.14)',
                }}
              />
            ))}
            <span className="text-xs text-gray-500 font-bold ml-1" style={{ fontFamily: NUM }}>
              {ri + 1} of {rounds.length}
            </span>
          </div>

          {/* prompt: tap to hear */}
          <motion.button
            key={`p-${ri}`}
            onClick={() => sayPrompt()}
            className={`w-full max-w-sm rounded-2xl px-4 py-2.5 mb-3 text-white border-4 border-white bg-gradient-to-r ${level.grad}`}
            style={{ boxShadow: `0 5px 0 ${level.shadow}`, fontFamily: NUM }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              Which one is different?
            </span>
            <span className="opacity-80 text-xs ml-2">🔊</span>
          </motion.button>

          {/* the four pictures */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm" data-kind="board">
            {round.cards.map((card, i) => {
              const wrong = wrongNames.includes(card.name);
              const right = solved && card.isOdd;
              const dim = (solved && !card.isOdd) || wrong;
              const glow = glowName === card.name;
              const shaking = shake !== null && shake.name === card.name;
              const edge = CARD_COLORS[i % CARD_COLORS.length].edge;

              return (
                <motion.button
                  key={`${ri}-${card.name}`}
                  type="button"
                  data-kind="card"
                  data-odd={card.isOdd ? 'true' : 'false'}
                  data-name={card.name}
                  onClick={() => pick(card)}
                  className="rounded-3xl flex flex-col items-center justify-center"
                  style={{
                    height: 150,
                    background: right ? '#DCFCE7' : '#fff',
                    border: `4px solid ${right ? '#22C55E' : glow ? '#FBBF24' : edge}`,
                    boxShadow: right
                      ? '0 6px 0 #22C55E'
                      : glow
                      ? `0 6px 0 ${edge}, 0 0 18px #FBBF24`
                      : `0 6px 0 ${edge}`,
                    opacity: dim ? 0.38 : 1,
                  }}
                  initial={{ scale: 0 }}
                  animate={
                    shaking
                      ? { scale: 1, x: [0, -8, 8, -5, 5, 0] }
                      : glow
                      ? { scale: [1, 1.06, 1] }
                      : right
                      ? { scale: [1, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    shaking
                      ? { duration: 0.35 }
                      : glow
                      ? { duration: 0.9, repeat: Infinity }
                      : { delay: i * 0.06, ...POP }
                  }
                  whileTap={{ scale: 0.94 }}
                >
                  <ItemIcon icon={card.emoji} size={72} label={card.name} />
                  <span className="mt-1 text-sm font-bold text-gray-600" style={{ fontFamily: NUM }}>
                    {card.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* why it is different, then Next */}
          <div className="min-h-[88px] w-full max-w-sm mt-3 flex flex-col items-center justify-start">
            <AnimatePresence>
              {solved && (
                <motion.div
                  key="why"
                  className="w-full flex items-center gap-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={POP}
                >
                  <p
                    data-kind="reason"
                    className="flex-1 bg-green-100 border-4 border-green-300 text-green-800 font-bold px-3 py-2 rounded-2xl text-sm"
                    style={{ fontFamily: NUM }}
                  >
                    🎉 {round.src.reason}
                  </p>
                  <motion.button
                    type="button"
                    data-kind="next"
                    onClick={() => { playClick(); goNext(); }}
                    className="rounded-2xl px-4 py-3 text-white font-bold border-4 border-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 4px 0 #1E40AF', fontFamily: NUM }}
                    whileTap={{ scale: 0.95, y: 3 }}
                  >
                    ▶
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {feedback && !solved && (
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

export default OddOneOut;
