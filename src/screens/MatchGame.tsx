import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { MATCH_PACKS, MatchPack, MatchItem, difficultyOf } from '../data/matchPacks';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * MatchGame — rebuilt as drag-into-bins, one item at a time.
 *
 * What was wrong with tap-item-then-tap-category:
 *
 * - SIXTEEN TAP TARGETS AT ONCE. Four categories plus twelve items didn't fit
 *   on a phone, so the child had to scroll between the thing they'd picked and
 *   the place it goes — and forget which they'd chosen on the way.
 * - IT WASN'T PHYSICAL. A child's instinct with a lion and a box of animals is
 *   to put the lion in the box. Two taps is an abstraction on top of that.
 * - A MISTAKES COUNTER with a big ❌ sat at the top of the screen the whole
 *   time. Counting a four-year-old's failures back at them is the opposite of
 *   encouraging. Wrong answers now teach ("a lion goes in Animals!") and the
 *   score is a streak, not a tally of failures.
 * - ONE SET OF ITEMS, and "Again" didn't even reshuffle. Second play was
 *   identical to the first. There are now eight packs.
 * - The matched ✓ badge was positioned `absolute` on a button with no
 *   `relative`, so ticks landed somewhere else on the page entirely.
 */

interface MatchGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const MatchGame: React.FC<MatchGameProps> = ({ progress, onBack, onComplete }) => {
  const [pack, setPack] = useState<MatchPack | null>(null);
  const [queue, setQueue] = useState<MatchItem[]>([]);
  const [index, setIndex] = useState(0);
  const [sorted, setSorted] = useState<Record<string, MatchItem[]>>({});
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [wrongs, setWrongs] = useState(0);
  const [shakeBin, setShakeBin] = useState<string | null>(null);
  const [popBin, setPopBin] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const binRefs = useRef<(HTMLDivElement | null)[]>([]);
  const awarded = useRef(false);

  useEffect(() => () => stopSpeaking(), []);

  const current = queue[index];
  const total = queue.length;

  const startPack = (p: MatchPack) => {
    playClick();
    buzz('tick');
    setPack(p);
    setQueue(shuffle(p.items));
    setIndex(0);
    setSorted(Object.fromEntries(p.bins.map((b) => [b.id, [] as MatchItem[]])));
    setStreak(0);
    setBest(0);
    setWrongs(0);
    setDone(false);
    awarded.current = false;
    speak(`${p.title}. ${p.question}`);
  };

  const again = () => {
    if (pack) startPack(pack);
  };

  // announce each new item so a pre-reader can play it
  useEffect(() => {
    if (current && !done) speak(current.name);
  }, [index, current, done]);

  const drop = (x: number, y: number) => {
    if (!pack || !current || done) return;

    const hit = binRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const pad = 22;
      return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    });
    if (hit < 0) return;

    const bin = pack.bins[hit];

    if (bin.id === current.bin) {
      playCorrect();
      buzz('soft');
      setPopBin(bin.id);
      window.setTimeout(() => setPopBin(null), 500);

      setSorted((s) => ({ ...s, [bin.id]: [...(s[bin.id] || []), current] }));
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBest((b) => Math.max(b, nextStreak));

      if (nextStreak >= 3 && nextStreak % 3 === 0) {
        setHint(`${nextStreak} in a row!`);
        speak(`${nextStreak} in a row! Brilliant.`);
        window.setTimeout(() => setHint(null), 1600);
      }

      if (index + 1 >= total) {
        window.setTimeout(() => {
          playComplete();
          buzz('success');
          setDone(true);
          if (!awarded.current) {
            awarded.current = true;
            const stars = wrongs <= 1 ? 3 : wrongs <= 4 ? 2 : 1;
            onComplete(stars);
          }
        }, 500);
      } else {
        setIndex((i) => i + 1);
      }
    } else {
      // wrong: teach, don't tally
      playWrong();
      buzz('oops');
      setWrongs((w) => w + 1);
      setStreak(0);
      setShakeBin(bin.id);
      const correct = pack.bins.find((b) => b.id === current.bin);
      const msg = `${current.name} goes in ${correct?.label}!`;
      setHint(msg);
      speak(msg);
      window.setTimeout(() => setShakeBin(null), 600);
      window.setTimeout(() => setHint(null), 2400);
    }
  };

  /* ================================================================ */
  /* PACK PICKER                                                      */
  /* ================================================================ */
  if (!pack) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🎯 Match" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Pick a sorting game! 🎯
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {MATCH_PACKS.map((p, i) => {
                const diff = difficultyOf(p);
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => startPack(p)}
                    className="bg-white rounded-3xl p-3 text-center border-4 border-white relative"
                    style={{ boxShadow: `0 6px 0 ${p.bins[0].color}55, 0 8px 18px rgba(0,0,0,.08)` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.04, ...POP }}
                    whileTap={{ scale: 0.94, y: 3 }}
                  >
                    <div className="flex justify-center mb-1">
                      <ItemIcon icon={p.icon} size={40} label={p.title} />
                    </div>
                    <span
                      className="text-sm font-bold text-gray-700 block leading-tight"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      {p.title}
                    </span>

                    {/* the bins themselves preview the game */}
                    <div className="flex justify-center gap-1 mt-2">
                      {p.bins.map((b) => (
                        <span
                          key={b.id}
                          className="rounded-full"
                          style={{ width: 12, height: 12, background: b.color }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-center gap-0.5 mt-1.5">
                      {[1, 2, 3].map((d) => (
                        <span key={d} className="text-[10px]" style={{ opacity: d <= diff ? 1 : 0.22 }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ================================================================ */
  /* RESULT                                                           */
  /* ================================================================ */
  if (done) {
    const stars = wrongs <= 1 ? 3 : wrongs <= 4 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title={`🎯 ${pack.title}`} onBack={() => { playClick(); setPack(null); }} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="max-w-md mx-auto text-center">
              <motion.p
                className="text-2xl font-bold text-gray-800 mt-3"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                All sorted! 🎉
              </motion.p>

              <div className="flex justify-center gap-1 mt-2">
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

              {best >= 3 && (
                <p className="mt-2 text-sm font-bold text-orange-500" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  🔥 Best streak: {best} in a row!
                </p>
              )}

              {/* the payoff: every bin, full of what they sorted */}
              <div className="mt-4 space-y-2">
                {pack.bins.map((b) => (
                  <motion.div
                    key={b.id}
                    className="rounded-2xl p-3 border-4 border-white text-left"
                    style={{ background: `${b.color}1A`, boxShadow: `0 4px 0 ${b.color}66` }}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ItemIcon icon={b.icon} size={24} label={b.label} />
                      <span className="font-bold text-sm" style={{ color: b.color, fontFamily: "'Bubblegum One', cursive" }}>
                        {b.label}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {(sorted[b.id] || []).map((it, i) => (
                        <ItemIcon key={i} icon={it.icon} size={26} label={it.name} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
                <p className="text-sm text-gray-600 font-semibold">{pack.learned}</p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={again}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); setPack(null); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{
                    background: 'linear-gradient(135deg,#F97316,#EF4444)',
                    boxShadow: '0 5px 0 #C2410C',
                    fontFamily: "'Bubblegum One', cursive",
                  }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🎯 New game
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ================================================================ */
  /* PLAYING — everything on one screen, no scrolling                 */
  /* ================================================================ */
  const cols = pack.bins.length <= 2 ? 2 : pack.bins.length === 3 ? 3 : 2;

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🎯 ${pack.title}`}
          onBack={() => { playClick(); stopSpeaking(); setPack(null); }}
          stars={progress.stars}
          showProgress
          progress={(index / total) * 100}
        />

        <div className="flex-1 flex flex-col px-3 pb-3 min-h-0">
          {/* progress pips + streak — no mistakes counter */}
          <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
            <div className="flex gap-1 flex-wrap">
              {queue.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 9,
                    height: 9,
                    background: i < index ? '#22C55E' : i === index ? '#F97316' : 'rgba(0,0,0,.14)',
                  }}
                />
              ))}
            </div>
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span
                  className="text-xs font-bold text-orange-500 whitespace-nowrap"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  🔥 {streak} in a row
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* the question */}
          <motion.button
            onClick={() => speak(`${pack.question} This is ${current?.name}.`)}
            className="w-full rounded-2xl px-4 py-2 mb-2 text-white font-bold border-4 border-white shrink-0"
            style={{
              background: `linear-gradient(135deg, ${pack.bins[0].color}, ${pack.bins[pack.bins.length - 1].color})`,
              boxShadow: '0 5px 0 rgba(0,0,0,.18)',
              fontFamily: "'Bubblegum One', cursive",
            }}
            whileTap={{ scale: 0.97, y: 2 }}
          >
            {pack.question} <span className="opacity-80 text-xs">🔊</span>
          </motion.button>

          {/* the item to sort */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={`${current.icon}-${index}`}
                  drag
                  dragSnapToOrigin
                  dragMomentum={false}
                  dragElastic={0.16}
                  onDragStart={() => buzz('tick')}
                  onDragEnd={(_, info) => drop(info.point.x, info.point.y)}
                  whileDrag={{ scale: 1.2, zIndex: 60 }}
                  initial={{ scale: 0, y: -30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={POP}
                  className="rounded-3xl bg-white border-4 border-white flex flex-col items-center justify-center px-6 py-4"
                  style={{ boxShadow: '0 8px 0 rgba(0,0,0,.14)', touchAction: 'none', cursor: 'grab' }}
                >
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                    <ItemIcon icon={current.icon} size={72} label={current.name} />
                  </motion.div>
                  <span
                    className="text-sm font-bold text-gray-600 mt-1 capitalize"
                    style={{ fontFamily: "'Bubblegum One', cursive" }}
                  >
                    {current.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-gray-500 text-xs font-semibold mt-2">👆 Drag it into the right box</p>

            {/* hint / praise */}
            <AnimatePresence>
              {hint && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-2xl text-sm text-center max-w-xs"
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={POP}
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  💡 {hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* the bins */}
          <div className={`grid gap-2 shrink-0`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {pack.bins.map((b, i) => {
              const inBin = sorted[b.id] || [];
              return (
                <motion.div
                  key={b.id}
                  ref={(el) => {
                    binRefs.current[i] = el;
                  }}
                  className="rounded-2xl border-4 border-white flex flex-col items-center justify-center p-2 relative overflow-hidden"
                  style={{ background: b.color, minHeight: 92, boxShadow: `0 6px 0 rgba(0,0,0,.22)` }}
                  animate={
                    shakeBin === b.id
                      ? { x: [-7, 7, -7, 7, 0] }
                      : popBin === b.id
                      ? { scale: [1, 1.09, 1] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <ItemIcon icon={b.icon} size={30} label={b.label} />
                  <span
                    className="text-white text-[11px] font-bold mt-0.5 text-center leading-tight"
                    style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '1px 1px 0 rgba(0,0,0,.28)' }}
                  >
                    {b.label}
                  </span>

                  {/* what's already inside — the bin visibly fills up */}
                  <div className="flex gap-0.5 flex-wrap justify-center mt-1 px-1">
                    {inBin.slice(-6).map((it, k) => (
                      <motion.span key={k} initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={POP}>
                        <ItemIcon icon={it.icon} size={15} />
                      </motion.span>
                    ))}
                  </div>

                  {inBin.length > 0 && (
                    <span className="absolute top-1 right-1 bg-white/95 text-[10px] font-bold rounded-full px-1.5 tabular-nums" style={{ color: b.color }}>
                      {inBin.length}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MatchGame;
