import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import {
  MEMORY_CATEGORIES,
  MemoryCategory,
  MemItem,
  BOARD_SIZES,
  MISSING_POOL,
  ODD_SETS,
  HIDDEN_TREASURES,
  TAP_TARGET,
  TAP_DECOYS,
  COLOR_PADS,
} from '../data/memoryData';
import { unlockAudio, playPad, playWin, playOops, playBlip } from '../utils/tones';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete, playFlip } from '../utils/sounds';

/**
 * MemoryGame — six games instead of three, and four real bugs fixed.
 *
 * BUGS
 *
 * 1. QUICK TAP'S TIMER RESET ON EVERY TAP. The interval effect listed
 *    `quickTapScore` as a dependency, so scoring tore the interval down and
 *    built a new one — restarting the one-second tick. Tap fast enough and the
 *    clock barely moved. It also called `onComplete` from inside a state
 *    updater, which must be pure.
 *
 * 2. QUICK TAP COULD SPAWN A BOARD WITH NO STARS. Each tile rolled
 *    `Math.random() > 0.6` independently, so roughly one board in fifty had
 *    nothing to tap at all, and the whole grid reshuffled after every correct
 *    tap — the tile you were reaching for moved.
 *
 * 3. COLOR MEMORY LEAKED TIMERS. `playSequence` fired nested setTimeouts with
 *    no cleanup, so leaving mid-sequence kept them running and setting state
 *    on an unmounted component.
 *
 * 4. CARD STATE WAS MUTATED IN PLACE. `const newCards = [...cards]` is a
 *    shallow copy — `newCards[i].flipped = true` writes straight through to
 *    the original object.
 *
 * THE ALPHABET © BUG is fixed in memoryData.ts: letters are text now.
 */

interface MemoryGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type GameId = 'match' | 'tap' | 'color' | 'missing' | 'cups' | 'odd';

const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const rnd = (n: number) => Math.floor(Math.random() * n);
const starsFor = (mistakes: number) => (mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1);

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/** Renders an item as art or as a real character — never as a letter emoji. */
const Face: React.FC<{ item: MemItem; size: number }> = ({ item, size }) =>
  item.text ? (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: '#3B3F5C',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {item.text}
    </span>
  ) : (
    <ItemIcon icon={item.icon || '❓'} size={size} label={item.name} />
  );

const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`bg-white/95 rounded-3xl border-4 border-white ${className}`}
    style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}
  >
    {children}
  </div>
);

const WinCard: React.FC<{
  title: string;
  stars: number;
  detail?: string;
  learned: string;
  onAgain: () => void;
  onMenu: () => void;
}> = ({ title, stars, detail, learned, onAgain, onMenu }) => (
  <div className="flex-1 overflow-y-auto px-5 pb-8">
    <div className="max-w-md mx-auto text-center">
      <div className="text-6xl mt-4">🎉</div>
      <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: FONT }}>
        {title}
      </p>
      {detail && <p className="text-gray-500 font-semibold mt-1">{detail}</p>}

      <div className="flex justify-center gap-1 mt-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-4xl"
            style={{ opacity: i < stars ? 1 : 0.2 }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.12 + i * 0.13, type: 'spring' }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
        <p className="text-sm text-gray-600 font-semibold">{learned}</p>
      </div>

      <div className="flex gap-3 mt-5 justify-center">
        <motion.button
          onClick={onAgain}
          className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          🔄 Again
        </motion.button>
        <motion.button
          onClick={onMenu}
          className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
          style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', boxShadow: '0 5px 0 #4C1D95', fontFamily: FONT }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          🧠 More games
        </motion.button>
      </div>
    </div>
  </div>
);

interface GameProps {
  onWin: (stars: number) => void;
  onExit: () => void;
}

/* ================================================================== */
/* 1. MEMORY MATCH — with a peek, and real board sizes                 */
/* ================================================================== */

interface Card {
  key: string;
  pairId: string;
  item: MemItem;
  flipped: boolean;
  matched: boolean;
}

const MemoryMatch: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [cat, setCat] = useState<MemoryCategory | null>(null);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [locked, setLocked] = useState(true);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [peeking, setPeeking] = useState(false);
  const [won, setWon] = useState(false);

  const timers = useRef<number[]>([]);
  const awarded = useRef(false);
  const size = BOARD_SIZES[sizeIdx];

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const deal = useCallback((c: MemoryCategory, sIdx: number) => {
    const s = BOARD_SIZES[sIdx];
    const chosen = shuffle(c.items).slice(0, s.pairs);
    const deck: Card[] = shuffle(
      chosen.flatMap((item) => [
        { key: `${item.id}-a`, pairId: item.id, item, flipped: false, matched: false },
        { key: `${item.id}-b`, pairId: item.id, item, flipped: false, matched: false },
      ])
    );

    setCards(deck.map((d) => ({ ...d, flipped: true })));
    setPicked([]);
    setMoves(0);
    setMatched(0);
    setWon(false);
    awarded.current = false;

    /* THE PEEK — every card face-up, then they turn over.
       Standard in toddler memory apps, and it's what turns the first minute
       from blind guessing into actual remembering. */
    setPeeking(true);
    setLocked(true);
    speak('Look carefully!');
    clearTimers();
    timers.current.push(
      window.setTimeout(() => {
        setCards((cs) => cs.map((c2) => ({ ...c2, flipped: false })));
        setPeeking(false);
        setLocked(false);
        speak('Now find the pairs!');
      }, 2200)
    );
  }, []);

  const flip = (i: number) => {
    if (locked || cards[i].flipped || cards[i].matched || picked.length >= 2) return;
    playFlip();
    buzz('tick');

    /* immutable — the old code shallow-copied the array and wrote through
       to the original card objects */
    const next = cards.map((c, idx) => (idx === i ? { ...c, flipped: true } : c));
    setCards(next);
    const nowPicked = [...picked, i];
    setPicked(nowPicked);
    if (nowPicked.length < 2) return;

    setMoves((m) => m + 1);
    setLocked(true);
    const [a, b] = nowPicked;

    if (next[a].pairId === next[b].pairId) {
      timers.current.push(
        window.setTimeout(() => {
          playCorrect();
          buzz('soft');
          speak(next[a].item.name);
          setCards((cs) => cs.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c)));
          setPicked([]);
          setLocked(false);
          setMatched((m) => {
            const total = m + 1;
            if (total === size.pairs) {
              timers.current.push(
                window.setTimeout(() => {
                  playComplete();
                  playWin();
                  buzz('success');
                  setWon(true);
                  if (!awarded.current) {
                    awarded.current = true;
                    onWin(moves + 1 <= size.pairs * 2 ? 3 : moves + 1 <= size.pairs * 3 ? 2 : 1);
                  }
                }, 400)
              );
            }
            return total;
          });
        }, 420)
      );
    } else {
      timers.current.push(
        window.setTimeout(() => {
          playWrong();
          setCards((cs) => cs.map((c, idx) => (idx === a || idx === b ? { ...c, flipped: false } : c)));
          setPicked([]);
          setLocked(false);
        }, 850)
      );
    }
  };

  if (!cat) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center" style={{ fontFamily: FONT }}>
          Choose a category! 🎯
        </h2>

        <div className="flex justify-center gap-2 mb-3">
          {BOARD_SIZES.map((s, i) => (
            <motion.button
              key={s.label}
              onClick={() => { setSizeIdx(i); playClick(); buzz('tick'); }}
              className={`rounded-2xl px-4 py-2 font-bold border-4 border-white text-sm ${
                sizeIdx === i ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'
              }`}
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              {s.label} {'⭐'.repeat(s.diff)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
          {MEMORY_CATEGORIES.map((c, i) => (
            <motion.button
              key={c.key}
              onClick={() => { playClick(); unlockAudio(); setCat(c); deal(c, sizeIdx); }}
              className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${c.gradient}`}
              style={{ boxShadow: `0 7px 0 ${c.shadow}`, minHeight: 128 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04, ...POP }}
              whileTap={{ scale: 0.94, y: 4 }}
            >
              <div className="flex justify-center gap-1 mb-2">
                {c.items.slice(0, 3).map((it) => (
                  <span key={it.id} className="bg-white/25 rounded-lg px-1.5 py-1 flex items-center justify-center">
                    <Face item={it} size={22} />
                  </span>
                ))}
              </div>
              <h4 className="font-bold text-lg text-center" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,.15)' }}>
                {c.label}
              </h4>
              <p className="text-white/90 text-xs text-center mt-0.5">{BOARD_SIZES[sizeIdx].pairs} pairs</p>
            </motion.button>
          ))}
        </div>

        <button onClick={onExit} className="mt-5 mx-auto block text-gray-500 font-semibold text-sm underline">
          ← Back to games
        </button>
      </div>
    );
  }

  if (won) {
    return (
      <WinCard
        title="All pairs found! 🎉"
        detail={`${moves} moves`}
        stars={moves <= size.pairs * 2 ? 3 : moves <= size.pairs * 3 ? 2 : 1}
        learned="Visual memory · concentration · matching pairs"
        onAgain={() => deal(cat, sizeIdx)}
        onMenu={() => setCat(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 my-2">
          <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1 text-sm font-bold text-gray-600" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
            {matched} / {size.pairs} pairs
          </span>
          <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1 text-sm font-bold text-gray-600" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
            {moves} moves
          </span>
        </div>

        <AnimatePresence>
          {peeking && (
            <motion.p
              className="text-center font-bold text-purple-600 mb-2"
              style={{ fontFamily: FONT }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              👀 Look carefully…
            </motion.p>
          )}
        </AnimatePresence>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size.cols}, minmax(0,1fr))` }}>
          {cards.map((card, i) => {
            const open = card.flipped || card.matched;
            return (
              <motion.button
                key={card.key}
                onClick={() => flip(i)}
                className="aspect-square"
                style={{ perspective: 600 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.min(i, 6) * 0.03, ...POP }}
                whileTap={!open ? { scale: 0.94 } : {}}
              >
                {/* a real 3-D flip rather than swapping the contents */}
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: open ? 180 : 0 }}
                  transition={{ duration: 0.34 }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center border-4 border-white bg-gradient-to-br from-purple-500 to-pink-500"
                    style={{ backfaceVisibility: 'hidden', boxShadow: '0 5px 0 #6B21A8' }}
                  >
                    <span className="text-3xl text-white/90">❓</span>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-2xl flex items-center justify-center border-4 border-white ${
                      card.matched ? 'bg-gradient-to-br from-green-300 to-emerald-400' : 'bg-white'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      boxShadow: card.matched ? '0 5px 0 #047857' : '0 5px 0 rgba(0,0,0,.14)',
                    }}
                  >
                    <Face item={card.item} size={34} />
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================================================================== */
/* 2. QUICK TAP — timer fixed, always something to tap                 */
/* ================================================================== */

interface Tile {
  id: number;
  icon: string;
  target: boolean;
  hit: null | boolean;
}

let tileSeq = 0;

const makeTile = (forceTarget?: boolean): Tile => {
  const target = forceTarget ?? Math.random() < 0.34;
  return {
    id: ++tileSeq,
    icon: target ? TAP_TARGET : TAP_DECOYS[rnd(TAP_DECOYS.length)],
    target,
    hit: null,
  };
};

/** Guarantees the board is never empty of stars. */
const ensureTargets = (tiles: Tile[], min = 2): Tile[] => {
  const have = tiles.filter((t) => t.target).length;
  if (have >= min) return tiles;
  const out = [...tiles];
  const idxs = shuffle(out.map((_, i) => i)).slice(0, min - have);
  idxs.forEach((i) => (out[i] = makeTile(true)));
  return out;
};

const QuickTap: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [left, setLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const awarded = useRef(false);

  const start = () => {
    playClick();
    unlockAudio();
    setScore(0);
    setCombo(0);
    setBest(0);
    setLeft(30);
    setOver(false);
    awarded.current = false;
    setTiles(ensureTargets(Array.from({ length: 9 }, () => makeTile())));
    setRunning(true);
    speak('Tap the stars, quick!');
  };

  /* the interval no longer depends on the score, so scoring can't restart it */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((t) => t - 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  /* completion lives in its own effect, not inside a state updater */
  useEffect(() => {
    if (!running || left > 0) return;
    setRunning(false);
    setOver(true);
    playComplete();
    buzz('success');
    if (!awarded.current) {
      awarded.current = true;
      onWin(score >= 22 ? 3 : score >= 12 ? 2 : 1);
    }
  }, [left, running, score, onWin]);

  const tap = (i: number) => {
    if (!running || tiles[i].hit !== null) return;

    if (tiles[i].target) {
      playBlip(true);
      buzz('tick');
      setScore((s) => s + 1);
      setCombo((c) => {
        const n = c + 1;
        setBest((b) => Math.max(b, n));
        return n;
      });
      /* replace ONLY the tapped tile — the old code reshuffled all nine, so
         the star you were reaching for jumped away */
      setTiles((ts) => {
        const next = ts.map((t, idx) => (idx === i ? { ...t, hit: true } : t));
        window.setTimeout(() => {
          setTiles((cur) => ensureTargets(cur.map((t, idx) => (idx === i ? makeTile() : t))));
        }, 180);
        return next;
      });
    } else {
      playOops();
      buzz('oops');
      setCombo(0);
      setTiles((ts) => ts.map((t, idx) => (idx === i ? { ...t, hit: false } : t)));
      window.setTimeout(() => {
        setTiles((cur) => cur.map((t, idx) => (idx === i ? { ...t, hit: null } : t)));
      }, 320);
    }
  };

  if (over) {
    return (
      <WinCard
        title="Time's up! ⚡"
        detail={`${score} stars · best combo ${best}`}
        stars={score >= 22 ? 3 : score >= 12 ? 2 : 1}
        learned="Fast looking · focus under pressure · ignoring distractions"
        onAgain={start}
        onMenu={onExit}
      />
    );
  }

  if (!running) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="text-7xl ks-bob-tilt">⚡</div>
        <h2 className="text-2xl font-bold text-gray-800 mt-3" style={{ fontFamily: FONT }}>
          Quick Tap!
        </h2>
        <p className="text-gray-600 mt-1">Tap every ⭐ you can in 30 seconds.</p>
        <p className="text-gray-400 text-sm mt-1">Watch out — the other things cost you your combo!</p>
        <motion.button
          onClick={start}
          className="mt-6 rounded-3xl px-9 py-5 text-white font-bold border-4 border-white"
          style={{
            background: 'linear-gradient(135deg,#F97316,#EF4444)',
            boxShadow: '0 8px 0 #C2410C',
            fontFamily: FONT,
            fontSize: '1.25rem',
          }}
          whileTap={{ scale: 0.95, y: 4 }}
        >
          🚀 Start!
        </motion.button>
        <button onClick={onExit} className="mt-4 text-gray-500 font-semibold text-sm underline">
          ← Back to games
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between gap-2 my-2">
          <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold text-gray-700" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
            ⭐ {score}
          </span>
          {combo >= 3 && (
            <motion.span className="text-sm font-bold text-orange-500" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontFamily: FONT }}>
              🔥 {combo} combo
            </motion.span>
          )}
          <span
            className={`border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold ${left <= 5 ? 'bg-red-500 text-white' : 'bg-white/95 text-gray-700'}`}
            style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}
          >
            ⏱️ {left}s
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map((t, i) => (
            <motion.button
              key={t.id}
              onClick={() => tap(i)}
              className={`aspect-square rounded-2xl flex items-center justify-center border-4 border-white ${
                t.hit === true ? 'bg-green-300' : t.hit === false ? 'bg-red-200' : 'bg-white'
              }`}
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.14)' }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: t.hit === false ? [-5, 5, -5, 0] : 0 }}
              transition={{ duration: 0.18 }}
              whileTap={{ scale: 0.9 }}
            >
              <ItemIcon icon={t.hit === true ? '✅' : t.icon} size={38} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================================================================== */
/* 3. COLOR MEMORY — with musical notes and lives                      */
/* ================================================================== */

const ColorMemory: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'watch' | 'play' | 'over'>('idle');
  const [lit, setLit] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  const timers = useRef<number[]>([]);
  const awarded = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  /* the old version left these running after you navigated away */
  useEffect(() => clearTimers, [clearTimers]);

  const show = useCallback(
    (s: number[]) => {
      clearTimers();
      setPhase('watch');
      setStep(0);
      s.forEach((pad, i) => {
        timers.current.push(
          window.setTimeout(() => {
            setLit(pad);
            playPad(pad);
            buzz('tick');
            timers.current.push(window.setTimeout(() => setLit(null), 330));
          }, 400 + i * 620)
        );
      });
      timers.current.push(
        window.setTimeout(() => {
          setPhase('play');
          speak('Your turn!');
        }, 400 + s.length * 620 + 180)
      );
    },
    [clearTimers]
  );

  const start = () => {
    playClick();
    unlockAudio();
    const first = [rnd(4)];
    setSeq(first);
    setLevel(1);
    setLives(3);
    awarded.current = false;
    speak('Watch the colours, then copy them!');
    show(first);
  };

  const finish = (l: number) => {
    setPhase('over');
    playComplete();
    if (!awarded.current) {
      awarded.current = true;
      onWin(l >= 8 ? 3 : l >= 5 ? 2 : 1);
    }
  };

  const tap = (pad: number) => {
    if (phase !== 'play') return;
    setLit(pad);
    playPad(pad);
    buzz('tick');
    window.setTimeout(() => setLit(null), 220);

    if (seq[step] !== pad) {
      const remaining = lives - 1;
      setLives(remaining);
      playOops();
      buzz('oops');

      if (remaining <= 0) {
        finish(level);
        return;
      }
      /* a life left means another go at the SAME sequence — the old game
         ended instantly on one slip, which at level six is brutal */
      speak('Oops! Try that one again.');
      timers.current.push(window.setTimeout(() => show(seq), 900));
      return;
    }

    const next = step + 1;
    if (next < seq.length) {
      setStep(next);
      return;
    }

    playCorrect();
    playWin();
    const grown = [...seq, rnd(4)];
    setLevel((l) => l + 1);
    timers.current.push(
      window.setTimeout(() => {
        setSeq(grown);
        show(grown);
      }, 900)
    );
  };

  if (phase === 'over') {
    return (
      <WinCard
        title="Good memory! 🌈"
        detail={`Level ${level}`}
        stars={level >= 8 ? 3 : level >= 5 ? 2 : 1}
        learned="Sequence memory · listening · concentration"
        onAgain={start}
        onMenu={onExit}
      />
    );
  }

  if (phase === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="text-7xl ks-bob-tilt">🌈</div>
        <h2 className="text-2xl font-bold text-gray-800 mt-3" style={{ fontFamily: FONT }}>
          Colour Memory
        </h2>
        <p className="text-gray-600 mt-1">Watch the colours light up, then copy them.</p>
        <p className="text-gray-400 text-sm mt-1">🎵 Each colour sings its own note — listen to the tune!</p>
        <motion.button
          onClick={start}
          className="mt-6 rounded-3xl px-9 py-5 text-white font-bold border-4 border-white"
          style={{
            background: 'linear-gradient(135deg,#2C7BE5,#22D3EE)',
            boxShadow: '0 8px 0 #0369A1',
            fontFamily: FONT,
            fontSize: '1.25rem',
          }}
          whileTap={{ scale: 0.95, y: 4 }}
        >
          🎬 Start!
        </motion.button>
        <button onClick={onExit} className="mt-4 text-gray-500 font-semibold text-sm underline">
          ← Back to games
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-4 min-h-0">
      <div className="flex items-center gap-2 my-2">
        <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold text-gray-700" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
          Level {level}
        </span>
        <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold">
          {'❤️'.repeat(lives)}
          <span style={{ opacity: 0.2 }}>{'🖤'.repeat(3 - lives)}</span>
        </span>
      </div>

      <p
        className={`px-5 py-2 rounded-2xl font-bold border-4 border-white mb-3 ${
          phase === 'watch' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}
        style={{ fontFamily: FONT }}
      >
        {phase === 'watch' ? '👀 Watch and listen!' : '👆 Your turn — copy it!'}
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {COLOR_PADS.map((pad, i) => {
          const on = lit === i;
          return (
            <motion.button
              key={pad.name}
              onClick={() => tap(i)}
              disabled={phase !== 'play'}
              className="aspect-square rounded-3xl border-4 border-white"
              style={{
                background: on ? pad.bright : pad.color,
                boxShadow: on ? `0 0 34px ${pad.bright}, 0 6px 0 rgba(0,0,0,.28)` : '0 6px 0 rgba(0,0,0,.28)',
                filter: on ? 'brightness(1.25)' : 'brightness(.92)',
              }}
              animate={{ scale: on ? 1.09 : 1 }}
              transition={{ duration: 0.14 }}
              whileTap={phase === 'play' ? { scale: 0.94 } : {}}
              aria-label={pad.name}
            />
          );
        })}
      </div>

      {phase === 'play' && (
        <motion.button
          onClick={() => { playClick(); show(seq); }}
          className="mt-4 rounded-2xl px-5 py-2.5 bg-white text-gray-600 font-bold border-4 border-white text-sm"
          style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
          whileTap={{ scale: 0.94, y: 2 }}
        >
          🔁 Show me again
        </motion.button>
      )}
    </div>
  );
};

/* ================================================================== */
/* 4. WHAT'S MISSING? — Kim's Game                                     */
/* ================================================================== */

const MISSING_ROUNDS = 5;

const WhatsMissing: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [round, setRound] = useState(0);
  const [items, setItems] = useState<MemItem[]>([]);
  const [gone, setGone] = useState<MemItem | null>(null);
  const [phase, setPhase] = useState<'look' | 'cover' | 'ask' | 'done'>('look');
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const awarded = useRef(false);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const newRound = useCallback((r: number) => {
    clear();
    const count = Math.min(3 + Math.floor(r / 2), 6);
    const chosen = shuffle(MISSING_POOL).slice(0, count);
    setItems(chosen);
    setGone(null);
    setPicked(null);
    setPhase('look');
    speak('Look at these carefully!');

    timers.current.push(
      window.setTimeout(() => {
        setPhase('cover');
        playBlip();
      }, 2600)
    );
    timers.current.push(
      window.setTimeout(() => {
        const missing = chosen[rnd(chosen.length)];
        setGone(missing);
        setPhase('ask');
        speak('Which one is missing?');
      }, 3800)
    );
  }, []);

  useEffect(() => {
    newRound(0);
  }, [newRound]);

  const guess = (item: MemItem) => {
    if (phase !== 'ask' || picked) return;
    setPicked(item.id);

    if (gone && item.id === gone.id) {
      playCorrect();
      playWin();
      buzz('soft');
      speak(`Yes! ${item.name} was missing.`);
      timers.current.push(
        window.setTimeout(() => {
          if (round + 1 >= MISSING_ROUNDS) {
            setPhase('done');
            playComplete();
            if (!awarded.current) {
              awarded.current = true;
              onWin(starsFor(mistakes));
            }
          } else {
            setRound((r) => r + 1);
            newRound(round + 1);
          }
        }, 1200)
      );
    } else {
      playOops();
      buzz('oops');
      setMistakes((m) => m + 1);
      speak(gone ? `No — ${gone.name} was missing.` : 'Not that one!');
      timers.current.push(window.setTimeout(() => setPicked(null), 1600));
    }
  };

  if (phase === 'done') {
    return (
      <WinCard
        title="Sharp eyes! 👀"
        stars={starsFor(mistakes)}
        learned="Short-term memory · noticing detail · naming objects"
        onAgain={() => { setRound(0); setMistakes(0); awarded.current = false; newRound(0); }}
        onMenu={onExit}
      />
    );
  }

  const visible = phase === 'ask' && gone ? items.filter((i) => i.id !== gone.id) : items;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: MISSING_ROUNDS }, (_, i) => (
          <span key={i} className="rounded-full" style={{ width: 10, height: 10, background: i < round ? '#22C55E' : i === round ? '#F97316' : 'rgba(0,0,0,.15)' }} />
        ))}
      </div>

      <p className="text-lg font-bold text-gray-700 mb-3" style={{ fontFamily: FONT }}>
        {phase === 'look' && '👀 Look carefully!'}
        {phase === 'cover' && '🫣 Close your eyes…'}
        {phase === 'ask' && '🤔 Which one is missing?'}
      </p>

      <Panel className="p-4 w-full max-w-sm min-h-[132px] flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'cover' ? (
            <motion.div
              key="blanket"
              className="absolute inset-0 flex items-center justify-center text-5xl"
              style={{ background: 'linear-gradient(135deg,#7B2CBF,#4C1D95)' }}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.35 }}
            >
              🫣
            </motion.div>
          ) : (
            <motion.div key="items" className="flex flex-wrap gap-3 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {visible.map((it) => (
                <motion.div key={it.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP}>
                  <Face item={it} size={44} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>

      {phase === 'ask' && (
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-4">
          {items.map((it) => {
            const isPick = picked === it.id;
            const right = gone && it.id === gone.id;
            return (
              <motion.button
                key={it.id}
                onClick={() => guess(it)}
                className={`aspect-square rounded-2xl flex items-center justify-center border-4 ${
                  isPick && right ? 'bg-green-200 border-green-400' : isPick ? 'bg-red-100 border-red-300' : 'bg-white border-white'
                }`}
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.14)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={POP}
                whileTap={{ scale: 0.92 }}
              >
                <Face item={it} size={34} />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ================================================================== */
/* 5. WHERE DID IT GO? — cup shuffle                                   */
/* ================================================================== */

const CUP_ROUNDS = 5;

const CupShuffle: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [round, setRound] = useState(0);
  const [cups, setCups] = useState<number[]>([0, 1, 2]); // cups[slot] = cup id
  const [ballCup, setBallCup] = useState(0);
  const [treasure, setTreasure] = useState(HIDDEN_TREASURES[0]);
  const [phase, setPhase] = useState<'reveal' | 'shuffle' | 'pick' | 'result' | 'done'>('reveal');
  const [chosenSlot, setChosenSlot] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const timers = useRef<number[]>([]);
  const awarded = useRef(false);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const cupCount = round >= 3 ? 4 : 3;
  const SLOT = 74;
  const GAP = 10;

  const newRound = useCallback((r: number) => {
    clear();
    const count = r >= 3 ? 4 : 3;
    const order = Array.from({ length: count }, (_, i) => i);
    setCups(order);
    setBallCup(rnd(count));
    setTreasure(HIDDEN_TREASURES[rnd(HIDDEN_TREASURES.length)]);
    setChosenSlot(null);
    setPhase('reveal');
    speak('Watch where it goes!');

    const swaps = 4 + r;
    timers.current.push(
      window.setTimeout(() => {
        setPhase('shuffle');
        for (let s = 0; s < swaps; s++) {
          timers.current.push(
            window.setTimeout(() => {
              playBlip(s % 2 === 0);
              setCups((cur) => {
                const next = [...cur];
                const a = rnd(next.length);
                let b = rnd(next.length);
                while (b === a) b = rnd(next.length);
                [next[a], next[b]] = [next[b], next[a]];
                return next;
              });
            }, s * Math.max(300, 520 - r * 40))
          );
        }
        timers.current.push(
          window.setTimeout(() => {
            setPhase('pick');
            speak('Where is it now?');
          }, swaps * Math.max(300, 520 - r * 40) + 250)
        );
      }, 1400)
    );
  }, []);

  useEffect(() => {
    newRound(0);
  }, [newRound]);

  const pick = (slot: number) => {
    if (phase !== 'pick') return;
    setChosenSlot(slot);
    setPhase('result');
    const right = cups[slot] === ballCup;

    if (right) {
      playCorrect();
      playWin();
      buzz('soft');
      speak('You found it!');
    } else {
      playOops();
      buzz('oops');
      setMistakes((m) => m + 1);
      speak('Not there! Look again next time.');
    }

    timers.current.push(
      window.setTimeout(() => {
        if (round + 1 >= CUP_ROUNDS) {
          setPhase('done');
          playComplete();
          if (!awarded.current) {
            awarded.current = true;
            onWin(starsFor(mistakes + (right ? 0 : 1)));
          }
        } else {
          setRound((r) => r + 1);
          newRound(round + 1);
        }
      }, 1700)
    );
  };

  if (phase === 'done') {
    return (
      <WinCard
        title="Great tracking! 🥤"
        stars={starsFor(mistakes)}
        learned="Following a moving object · attention · patience"
        onAgain={() => { setRound(0); setMistakes(0); awarded.current = false; newRound(0); }}
        onMenu={onExit}
      />
    );
  }

  const lifted = phase === 'reveal' || (phase === 'result' && true);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: CUP_ROUNDS }, (_, i) => (
          <span key={i} className="rounded-full" style={{ width: 10, height: 10, background: i < round ? '#22C55E' : i === round ? '#F97316' : 'rgba(0,0,0,.15)' }} />
        ))}
      </div>

      <p className="text-lg font-bold text-gray-700 mb-4" style={{ fontFamily: FONT }}>
        {phase === 'reveal' && '👀 Watch where it goes!'}
        {phase === 'shuffle' && '🔀 Follow it…'}
        {phase === 'pick' && '🤔 Which cup?'}
        {phase === 'result' && (chosenSlot !== null && cups[chosenSlot] === ballCup ? '🎉 Found it!' : '😄 It was there!')}
      </p>

      <div className="relative" style={{ width: cupCount * SLOT + (cupCount - 1) * GAP, height: 130 }}>
        {cups.map((cupId, slot) => {
          const hasBall = cupId === ballCup;
          const showBall = hasBall && (phase === 'reveal' || phase === 'result');
          return (
            <motion.button
              key={cupId}
              onClick={() => pick(slot)}
              className="absolute bottom-0 flex flex-col items-center justify-end"
              style={{ width: SLOT, touchAction: 'manipulation' }}
              animate={{ x: slot * (SLOT + GAP) }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              whileTap={phase === 'pick' ? { scale: 0.94 } : {}}
            >
              <div className="h-9 flex items-end justify-center">
                {showBall && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP}>
                    <ItemIcon icon={treasure} size={30} />
                  </motion.div>
                )}
              </div>
              <motion.div animate={{ y: showBall ? -6 : 0, rotate: showBall ? -12 : 0 }} transition={{ duration: 0.25 }}>
                <ItemIcon icon="🥤" size={66} label="cup" />
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {phase === 'pick' && <p className="text-xs text-gray-500 font-semibold mt-3">👆 Tap the cup hiding it</p>}
    </div>
  );
};

/* ================================================================== */
/* 6. ODD ONE OUT                                                      */
/* ================================================================== */

const OddOneOut: React.FC<GameProps> = ({ onWin, onExit }) => {
  const [set, setSet] = useState(() => ODD_SETS[rnd(ODD_SETS.length)]);
  const [grid, setGrid] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(45);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [wrongAt, setWrongAt] = useState<number | null>(null);
  const awarded = useRef(false);

  const build = useCallback((round: number) => {
    const s = ODD_SETS[rnd(ODD_SETS.length)];
    const count = Math.min(6 + Math.floor(round / 3) * 3, 12);
    const oddIndex = rnd(count);
    setSet(s);
    setGrid(Array.from({ length: count }, (_, i) => i === oddIndex));
  }, []);

  const start = () => {
    playClick();
    unlockAudio();
    setScore(0);
    setLeft(45);
    setOver(false);
    awarded.current = false;
    build(0);
    setRunning(true);
    speak('Find the one that is different!');
  };

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((t) => t - 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || left > 0) return;
    setRunning(false);
    setOver(true);
    playComplete();
    if (!awarded.current) {
      awarded.current = true;
      onWin(score >= 14 ? 3 : score >= 7 ? 2 : 1);
    }
  }, [left, running, score, onWin]);

  const tap = (i: number) => {
    if (!running) return;
    if (grid[i]) {
      playCorrect();
      buzz('soft');
      setScore((s) => {
        build(s + 1);
        return s + 1;
      });
    } else {
      playOops();
      buzz('oops');
      setWrongAt(i);
      window.setTimeout(() => setWrongAt(null), 400);
    }
  };

  if (over) {
    return (
      <WinCard
        title="Eagle eyes! 🔍"
        detail={`${score} found`}
        stars={score >= 14 ? 3 : score >= 7 ? 2 : 1}
        learned="Visual discrimination · spotting small differences"
        onAgain={start}
        onMenu={onExit}
      />
    );
  }

  if (!running) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="text-7xl ks-bob-tilt">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mt-3" style={{ fontFamily: FONT }}>
          Odd One Out
        </h2>
        <p className="text-gray-600 mt-1">One of them is different. Find it!</p>
        <p className="text-gray-400 text-sm mt-1">45 seconds — how many can you spot?</p>
        <motion.button
          onClick={start}
          className="mt-6 rounded-3xl px-9 py-5 text-white font-bold border-4 border-white"
          style={{ background: 'linear-gradient(135deg,#14B8A6,#0E9F6E)', boxShadow: '0 8px 0 #0F766E', fontFamily: FONT, fontSize: '1.25rem' }}
          whileTap={{ scale: 0.95, y: 4 }}
        >
          🔎 Start!
        </motion.button>
        <button onClick={onExit} className="mt-4 text-gray-500 font-semibold text-sm underline">
          ← Back to games
        </button>
      </div>
    );
  }

  const cols = grid.length <= 6 ? 3 : 4;

  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-4">
      <div className="flex items-center justify-between gap-3 w-full max-w-sm my-2">
        <span className="bg-white/95 border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold text-gray-700" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
          🔍 {score}
        </span>
        <span
          className={`border-4 border-white rounded-full px-4 py-1.5 text-sm font-bold ${left <= 5 ? 'bg-red-500 text-white' : 'bg-white/95 text-gray-700'}`}
          style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}
        >
          ⏱️ {left}s
        </span>
      </div>

      <p className="text-sm font-bold text-gray-500 mb-3" style={{ fontFamily: FONT }}>
        👆 Tap the different one
      </p>

      <div className="grid gap-2 w-full max-w-sm" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {grid.map((isOdd, i) => (
          <motion.button
            key={`${score}-${i}`}
            onClick={() => tap(i)}
            className="aspect-square rounded-2xl bg-white border-4 border-white flex items-center justify-center"
            style={{ boxShadow: '0 5px 0 rgba(0,0,0,.14)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: wrongAt === i ? [-5, 5, -5, 0] : 0 }}
            transition={{ delay: Math.min(i, 6) * 0.02, duration: 0.2 }}
            whileTap={{ scale: 0.92 }}
          >
            <Face item={isOdd ? set.odd : set.same} size={34} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ================================================================== */
/* Shell                                                               */
/* ================================================================== */

const GAMES: { id: GameId; icon: string; title: string; sub: string; diff: number; grad: string; shadow: string }[] = [
  { id: 'match', icon: '🧠', title: 'Memory Match', sub: 'Find the pairs!', diff: 1, grad: 'from-purple-500 to-pink-500', shadow: '#6B21A8' },
  { id: 'missing', icon: '🫣', title: "What's Missing?", sub: 'One has vanished!', diff: 1, grad: 'from-fuchsia-500 to-purple-600', shadow: '#6B21A8' },
  { id: 'cups', icon: '🥤', title: 'Where Did It Go?', sub: 'Follow the cup!', diff: 2, grad: 'from-amber-400 to-orange-500', shadow: '#C2410C' },
  { id: 'color', icon: '🌈', title: 'Colour Memory', sub: 'Copy the tune!', diff: 3, grad: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
  { id: 'odd', icon: '🔍', title: 'Odd One Out', sub: 'Spot the different one!', diff: 2, grad: 'from-teal-400 to-emerald-500', shadow: '#0F766E' },
  { id: 'tap', icon: '⚡', title: 'Quick Tap', sub: 'Tap the stars fast!', diff: 2, grad: 'from-orange-500 to-red-500', shadow: '#C2410C' },
];

const MemoryGame: React.FC<MemoryGameProps> = ({ progress, onBack, onComplete }) => {
  const [which, setWhich] = useState<GameId | null>(null);

  useEffect(() => () => stopSpeaking(), []);

  const exit = () => {
    playClick();
    stopSpeaking();
    setWhich(null);
  };

  const current = useMemo(() => GAMES.find((g) => g.id === which), [which]);

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🧠 ${current ? current.title : 'Memory Games'}`}
          onBack={() => { if (which) exit(); else { playClick(); onBack(); } }}
          stars={progress.stars}
        />

        {!which && (
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center" style={{ fontFamily: FONT }}>
              Choose a game! 🎮
            </h2>

            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {GAMES.map((g, i) => (
                <motion.button
                  key={g.id}
                  onClick={() => { playClick(); unlockAudio(); buzz('tick'); setWhich(g.id); }}
                  className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${g.grad}`}
                  style={{ boxShadow: `0 8px 0 ${g.shadow}, 0 12px 22px rgba(0,0,0,.18)`, minHeight: 150 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.24, delay: Math.min(i, 5) * 0.035 }}
                  whileTap={{ scale: 0.94, y: 4 }}
                >
                  <div className="flex justify-center mb-2">
                    <ItemIcon icon={g.icon} size={46} label={g.title} />
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                    {g.title}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">{g.sub}</p>
                  <div className="flex justify-center gap-0.5 mt-1.5">
                    {[1, 2, 3].map((d) => (
                      <span key={d} className="text-[11px]" style={{ opacity: d <= g.diff ? 1 : 0.28 }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {which === 'match' && <MemoryMatch onWin={onComplete} onExit={exit} />}
        {which === 'tap' && <QuickTap onWin={onComplete} onExit={exit} />}
        {which === 'color' && <ColorMemory onWin={onComplete} onExit={exit} />}
        {which === 'missing' && <WhatsMissing onWin={onComplete} onExit={exit} />}
        {which === 'cups' && <CupShuffle onWin={onComplete} onExit={exit} />}
        {which === 'odd' && <OddOneOut onWin={onComplete} onExit={exit} />}
      </div>
    </GameBackground>
  );
};

export default MemoryGame;
