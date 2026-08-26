import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import PageArt from '../components/PageArt';
import { GameProgress } from '../store/gameStore';
import {
  JIGSAW_PICTURES,
  JIGSAW_GRIDS,
  JigsawGrid,
  JigsawPicture,
  pageFor,
  SHADOW_ROUNDS,
  PATTERN_LEVELS,
  patternHint,
  SIZE_ROUNDS,
  SizeItem,
} from '../data/puzzleData';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * PuzzleGame — rebuilt, with a real jigsaw added.
 *
 * The bug that mattered most: Shape Match called
 *
 *   if (allMatched && !showQuickSuccess) setTimeout(handleLevelComplete, 500)
 *
 * *during render*. Every re-render while `allMatched` was true scheduled
 * another timer, so `handleLevelComplete` — and `onComplete`, which awards
 * stars — fired repeatedly. Levels skipped and stars multiplied. All
 * completion now runs from effects and guarded refs.
 *
 * Content-wise: "puzzle" means jigsaw to a child, and there wasn't one. The
 * colouring pages are SVG, so a jigsaw tile is the same drawing with a cropped
 * viewBox — no image assets, crisp on every device.
 */

interface PuzzleGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type Which = 'jigsaw' | 'shadow' | 'pattern' | 'size' | null;

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const starsFor = (mistakes: number) => (mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1);

/* ================================================================== */
/* Shared win card                                                     */
/* ================================================================== */

const WinCard: React.FC<{
  title: string;
  stars: number;
  learned: string;
  onAgain: () => void;
  onMenu: () => void;
  children?: React.ReactNode;
}> = ({ title, stars, learned, onAgain, onMenu, children }) => (
  <div className="flex-1 overflow-y-auto px-5 pb-8">
    <div className="max-w-md mx-auto text-center">
      {children}
      <motion.p
        className="text-2xl font-bold text-gray-800 mt-3"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {title}
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
      <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
        <p className="text-sm text-gray-600 font-semibold">{learned}</p>
      </div>
      <div className="flex gap-3 mt-5 justify-center">
        <motion.button
          onClick={onAgain}
          className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          🔄 Again
        </motion.button>
        <motion.button
          onClick={onMenu}
          className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
          style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', boxShadow: '0 5px 0 #4C1D95', fontFamily: "'Bubblegum One', cursive" }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          🧩 More puzzles
        </motion.button>
      </div>
    </div>
  </div>
);

/* ================================================================== */
/* 1. JIGSAW                                                           */
/* ================================================================== */

const Jigsaw: React.FC<{ onWin: (s: number) => void; onExit: () => void }> = ({ onWin, onExit }) => {
  const [picture, setPicture] = useState<JigsawPicture | null>(null);
  const [grid, setGrid] = useState<JigsawGrid>(3);
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [tray, setTray] = useState<number[]>([]);
  const [fails, setFails] = useState<Record<number, number>>({});
  const [mistakes, setMistakes] = useState(0);
  const [peek, setPeek] = useState(false);
  const [won, setWon] = useState(false);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const awarded = useRef(false);

  const page = picture ? pageFor(picture.pageId) : undefined;
  const cells = grid * grid;
  const board = 300;
  const cellPx = board / grid;

  const start = (p: JigsawPicture, g: JigsawGrid) => {
    playClick();
    buzz('tick');
    setPicture(p);
    setGrid(g);
    setPlaced({});
    setFails({});
    setMistakes(0);
    setWon(false);
    awarded.current = false;
    setTray(shuffle(Array.from({ length: g * g }, (_, i) => i)));
    speak(`Build the ${p.name}! Drag the pieces into place.`);
  };

  useEffect(() => {
    if (!picture || won) return;
    if (Object.keys(placed).length === cells && cells > 0) {
      setWon(true);
      playComplete();
      buzz('success');
      speak('You did it! What a lovely picture.');
      if (!awarded.current) {
        awarded.current = true;
        onWin(starsFor(mistakes));
      }
    }
  }, [placed, cells, picture, won, mistakes, onWin]);

  const drop = (tile: number, x: number, y: number) => {
    const hit = slotRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x > r.left && x < r.right && y > r.top && y < r.bottom;
    });
    if (hit < 0) return;

    if (hit === tile) {
      playCorrect();
      buzz('soft');
      setPlaced((p) => ({ ...p, [tile]: true }));
      setTray((t) => t.filter((n) => n !== tile));
    } else {
      playWrong();
      buzz('oops');
      setMistakes((m) => m + 1);
      setFails((f) => ({ ...f, [tile]: (f[tile] || 0) + 1 }));
    }
  };

  /* ---- picture picker ---- */
  if (!picture) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          Pick a jigsaw! 🧩
        </h2>

        <div className="flex justify-center gap-2 mb-3">
          {JIGSAW_GRIDS.map((g) => (
            <motion.button
              key={g}
              onClick={() => { setGrid(g); playClick(); buzz('tick'); }}
              className={`rounded-2xl px-4 py-2 font-bold border-4 border-white text-sm ${
                grid === g ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'
              }`}
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              {g}×{g} {'⭐'.repeat(g - 1)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {JIGSAW_PICTURES.map((p, i) => {
            const pg = pageFor(p.pageId);
            if (!pg) return null;
            return (
              <motion.button
                key={p.id}
                onClick={() => start(p, grid)}
                className="bg-white rounded-3xl p-2 border-4 border-white flex flex-col items-center"
                style={{ boxShadow: '0 6px 0 rgba(139,92,246,.35)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03, ...POP }}
                whileTap={{ scale: 0.94, y: 3 }}
              >
                <PageArt page={pg} fills={p.fills} size={70} />
                <span className="text-xs font-bold text-gray-700 mt-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {p.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <button onClick={onExit} className="mt-5 mx-auto block text-gray-500 font-semibold text-sm underline">
          ← Back to puzzles
        </button>
      </div>
    );
  }

  if (!page) return null;

  if (won) {
    return (
      <WinCard
        title={`You built the ${picture.name}! 🎉`}
        stars={starsFor(mistakes)}
        learned="Spatial reasoning · matching part to whole · persistence"
        onAgain={() => start(picture, grid)}
        onMenu={() => setPicture(null)}
      >
        <motion.div className="flex justify-center mt-3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP}>
          <PageArt page={page} fills={picture.fills} size={200} />
        </motion.div>
      </WinCard>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-3 pb-3 min-h-0 items-center">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <span className="bg-white/95 border-4 border-white rounded-full px-3 py-1 text-xs font-bold text-gray-600 tabular-nums" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          {Object.keys(placed).length} / {cells}
        </span>
        <motion.button
          onPointerDown={() => { setPeek(true); playClick(); }}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          className="bg-white/95 border-4 border-white rounded-full px-3 py-1 text-xs font-bold text-purple-600"
          style={{ fontFamily: "'Bubblegum One', cursive", touchAction: 'none' }}
          whileTap={{ scale: 0.93 }}
        >
          👀 Hold to peek
        </motion.button>
      </div>

      {/* the board */}
      <div
        className="relative bg-white rounded-2xl border-4 border-white shrink-0"
        style={{ width: board, height: board, boxShadow: '0 8px 0 rgba(0,0,0,.12)' }}
      >
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}>
          {Array.from({ length: cells }, (_, i) => {
            const r = Math.floor(i / grid);
            const c = i % grid;
            const isPlaced = placed[i];
            const glow = !isPlaced && Object.entries(fails).some(([t, n]) => Number(t) === i && n >= 3);
            return (
              <div
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="relative"
                style={{
                  outline: '1px dashed rgba(0,0,0,.14)',
                  outlineOffset: -1,
                  background: glow ? 'rgba(250,204,21,.35)' : 'transparent',
                }}
              >
                {isPlaced && (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={POP}>
                    <PageArt
                      page={page}
                      fills={picture.fills}
                      size={cellPx}
                      crop={{ x: c * (100 / grid), y: r * (100 / grid), w: 100 / grid, h: 100 / grid }}
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {peek && (
            <motion.div
              className="absolute inset-0 bg-white rounded-xl flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.94 }}
              exit={{ opacity: 0 }}
            >
              <PageArt page={page} fills={picture.fills} size={board - 20} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-gray-500 text-xs font-semibold my-2 shrink-0">👆 Drag each piece into the right square</p>

      {/* the tray */}
      <div className="flex-1 min-h-0 overflow-y-auto w-full">
        <div className="flex flex-wrap gap-2 justify-center pb-2">
          {tray.map((tile) => {
            const r = Math.floor(tile / grid);
            const c = tile % grid;
            return (
              <motion.div
                key={tile}
                drag
                dragSnapToOrigin
                dragMomentum={false}
                dragElastic={0.14}
                onDragStart={() => buzz('tick')}
                onDragEnd={(_, info) => drop(tile, info.point.x, info.point.y)}
                whileDrag={{ scale: 1.18, zIndex: 60 }}
                className="rounded-xl bg-white border-4 border-white overflow-hidden"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.16)', touchAction: 'none', cursor: 'grab' }}
              >
                <PageArt
                  page={page}
                  fills={picture.fills}
                  size={Math.min(70, cellPx)}
                  crop={{ x: c * (100 / grid), y: r * (100 / grid), w: 100 / grid, h: 100 / grid }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================================================================== */
/* 2. SHADOW MATCH                                                     */
/* ================================================================== */

const ShadowMatch: React.FC<{ onWin: (s: number) => void; onExit: () => void }> = ({ onWin, onExit }) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const awarded = useRef(false);

  const round = SHADOW_ROUNDS[roundIndex];
  const shadows = useMemo(() => shuffle(round.pages), [round]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    speak('Drag each picture onto its shadow!');
  }, [roundIndex]);

  useEffect(() => {
    if (won || matched.length !== round.pages.length) return;
    if (roundIndex + 1 < SHADOW_ROUNDS.length) {
      playCorrect();
      const t = window.setTimeout(() => {
        setRoundIndex((r) => r + 1);
        setMatched([]);
      }, 900);
      return () => window.clearTimeout(t);
    }
    setWon(true);
    playComplete();
    buzz('success');
    speak('All the shadows found! Well done.');
    if (!awarded.current) {
      awarded.current = true;
      onWin(starsFor(mistakes));
    }
  }, [matched, round, roundIndex, won, mistakes, onWin]);

  const silhouette = (pageId: string) => {
    const pg = pageFor(pageId);
    if (!pg) return {};
    return Object.fromEntries(pg.regions.map((r) => [r.id, '#1B1B1F']));
  };

  const drop = (pageId: string, x: number, y: number) => {
    const hit = shadowRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const pad = 18;
      return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    });
    if (hit < 0) return;

    const target = shadows[hit];
    if (target.pageId === pageId) {
      playCorrect();
      buzz('soft');
      speak(target.name);
      setMatched((m) => [...m, pageId]);
    } else {
      playWrong();
      buzz('oops');
      setMistakes((m) => m + 1);
      setShake(target.pageId);
      window.setTimeout(() => setShake(null), 600);
    }
  };

  if (won) {
    return (
      <WinCard
        title="Every shadow found! 🎉"
        stars={starsFor(mistakes)}
        learned="Recognising shapes by outline · visual matching"
        onAgain={() => { setRoundIndex(0); setMatched([]); setMistakes(0); setWon(false); awarded.current = false; }}
        onMenu={onExit}
      >
        <div className="text-6xl mt-3">🌑</div>
      </WinCard>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-4 min-h-0 overflow-y-auto">
      <div className="flex gap-1 my-2">
        {SHADOW_ROUNDS.map((_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{ width: 10, height: 10, background: i < roundIndex ? '#22C55E' : i === roundIndex ? '#F97316' : 'rgba(0,0,0,.15)' }}
          />
        ))}
      </div>

      <p className="text-gray-600 font-bold text-sm mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
        👆 Drag each picture onto its shadow
      </p>

      {/* the pictures */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-4">
        {round.pages.map((p) => {
          const pg = pageFor(p.pageId);
          const done = matched.includes(p.pageId);
          if (!pg) return null;
          return (
            <motion.div
              key={p.pageId}
              drag={!done}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.14}
              onDragStart={() => buzz('tick')}
              onDragEnd={(_, info) => drop(p.pageId, info.point.x, info.point.y)}
              whileDrag={{ scale: 1.25, zIndex: 60 }}
              className={`rounded-2xl bg-white border-4 flex items-center justify-center ${done ? 'opacity-25 border-gray-200' : 'border-white'}`}
              style={{ boxShadow: done ? 'none' : '0 5px 0 rgba(0,0,0,.14)', aspectRatio: '1', touchAction: 'none' }}
            >
              <PageArt page={pg} fills={p.fills} size={54} />
            </motion.div>
          );
        })}
      </div>

      {/* the shadows */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md">
        {shadows.map((p, i) => {
          const pg = pageFor(p.pageId);
          const done = matched.includes(p.pageId);
          if (!pg) return null;
          return (
            <motion.div
              key={`sh-${p.pageId}`}
              ref={(el) => {
                shadowRefs.current[i] = el;
              }}
              className={`rounded-2xl flex items-center justify-center border-4 ${done ? 'bg-green-50 border-green-300' : 'bg-gray-100 border-white'}`}
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.14)', aspectRatio: '1' }}
              animate={shake === p.pageId ? { x: [-6, 6, -6, 6, 0] } : done ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {done ? (
                <PageArt page={pg} fills={p.fills} size={54} />
              ) : (
                <PageArt page={pg} fills={silhouette(p.pageId)} size={54} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================== */
/* 3. PATTERNS                                                         */
/* ================================================================== */

const Patterns: React.FC<{ onWin: (s: number) => void; onExit: () => void }> = ({ onWin, onExit }) => {
  const levels = useMemo(() => shuffle(PATTERN_LEVELS).slice(0, 6), []);
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const awarded = useRef(false);

  const level = levels[index];
  // options are shuffled per level — the old version kept them in a fixed
  // array, so the answer sat in the same position on every replay
  const options = useMemo(() => shuffle([level.answer, ...level.distractors]), [level]);

  useEffect(() => {
    speak('What comes next?');
  }, [index]);

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);

    if (opt === level.answer) {
      playCorrect();
      buzz('soft');
      speak('Yes! That is the pattern.');
      window.setTimeout(() => {
        if (index + 1 >= levels.length) {
          setWon(true);
          playComplete();
          buzz('success');
          if (!awarded.current) {
            awarded.current = true;
            onWin(starsFor(mistakes));
          }
        } else {
          setIndex((i) => i + 1);
          setPicked(null);
        }
      }, 900);
    } else {
      playWrong();
      buzz('oops');
      setMistakes((m) => m + 1);
      const h = patternHint(level.kind);
      setHint(h);
      speak(h);
      window.setTimeout(() => {
        setPicked(null);
        setHint(null);
      }, 2200);
    }
  };

  if (won) {
    return (
      <WinCard
        title="Pattern master! 🎉"
        stars={starsFor(mistakes)}
        learned="Spotting patterns · predicting what comes next · early algebra"
        onAgain={() => { setIndex(0); setMistakes(0); setPicked(null); setWon(false); awarded.current = false; }}
        onMenu={onExit}
      >
        <div className="text-6xl mt-3">🌈</div>
      </WinCard>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 min-h-0">
      <div className="flex gap-1 mb-3">
        {levels.map((_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{ width: 10, height: 10, background: i < index ? '#22C55E' : i === index ? '#F97316' : 'rgba(0,0,0,.15)' }}
          />
        ))}
      </div>

      <p className="text-lg font-bold text-gray-700 mb-3" style={{ fontFamily: "'Bubblegum One', cursive" }}>
        What comes next? 🤔
      </p>

      {/* the sequence */}
      <div className="bg-white/95 rounded-3xl p-4 border-4 border-white mb-5 w-full max-w-md overflow-x-auto" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
        <div className="flex items-center justify-center gap-2 min-w-max">
          {level.seq.map((s, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.07 }}>
              <ItemIcon icon={s} size={40} />
            </motion.div>
          ))}
          <motion.div
            className="rounded-2xl bg-yellow-200 border-4 border-yellow-400 flex items-center justify-center"
            style={{ width: 52, height: 52 }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <span className="text-2xl font-bold text-yellow-700">?</span>
          </motion.div>
        </div>
      </div>

      <div className="h-10 flex items-center mb-1">
        <AnimatePresence>
          {hint && (
            <motion.p
              className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-2xl text-sm text-center max-w-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={POP}
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              💡 {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {options.map((opt, i) => {
          const isPicked = picked === opt;
          const right = isPicked && opt === level.answer;
          const wrong = isPicked && opt !== level.answer;
          return (
            <motion.button
              key={`${opt}-${i}`}
              onClick={() => choose(opt)}
              disabled={!!picked}
              className={`aspect-square rounded-3xl flex items-center justify-center border-4 ${
                right ? 'bg-green-100 border-green-400' : wrong ? 'bg-red-100 border-red-400' : 'bg-white border-white'
              }`}
              style={{ boxShadow: right ? '0 6px 0 #047857' : wrong ? '0 6px 0 #B91C1C' : '0 6px 0 rgba(0,0,0,.15)' }}
              animate={wrong ? { x: [-6, 6, -6, 6, 0] } : {}}
              whileTap={!picked ? { scale: 0.9, y: 4 } : {}}
            >
              <ItemIcon icon={opt} size={40} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================== */
/* 4. SIZE SORT                                                        */
/* ================================================================== */

const SizeSort: React.FC<{ onWin: (s: number) => void; onExit: () => void }> = ({ onWin, onExit }) => {
  const rounds = useMemo(() => shuffle(SIZE_ROUNDS).slice(0, 3), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [placedItems, setPlacedItems] = useState<SizeItem[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [wrongIcon, setWrongIcon] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const awarded = useRef(false);

  const round = rounds[roundIndex];
  const pool = useMemo(() => shuffle(round.items), [round]);
  const remaining = pool.filter((p) => !placedItems.some((s) => s.icon === p.icon));

  useEffect(() => {
    speak('Put them in order, smallest first!');
  }, [roundIndex]);

  const pick = (item: SizeItem) => {
    const expected = placedItems.length + 1;

    if (item.rank === expected) {
      playCorrect();
      buzz('soft');
      speak(item.name);
      const next = [...placedItems, item];
      setPlacedItems(next);

      if (next.length === round.items.length) {
        window.setTimeout(() => {
          if (roundIndex + 1 < rounds.length) {
            playCorrect();
            setRoundIndex((r) => r + 1);
            setPlacedItems([]);
          } else {
            setWon(true);
            playComplete();
            buzz('success');
            speak('Perfectly sorted!');
            if (!awarded.current) {
              awarded.current = true;
              onWin(starsFor(mistakes));
            }
          }
        }, 800);
      }
    } else {
      // teach, don't wipe the board — the old version reshuffled everything
      playWrong();
      buzz('oops');
      setMistakes((m) => m + 1);
      setWrongIcon(item.icon);
      const msg = placedItems.length === 0 ? 'Find the smallest one first!' : 'Look for the next size up!';
      setHint(msg);
      speak(msg);
      window.setTimeout(() => {
        setWrongIcon(null);
        setHint(null);
      }, 1800);
    }
  };

  const undo = () => {
    if (!placedItems.length) return;
    playClick();
    buzz('tick');
    setPlacedItems((s) => s.slice(0, -1));
  };

  if (won) {
    return (
      <WinCard
        title="Perfectly sorted! 🎉"
        stars={starsFor(mistakes)}
        learned="Comparing sizes · ordering · smallest to biggest"
        onAgain={() => { setRoundIndex(0); setPlacedItems([]); setMistakes(0); setWon(false); awarded.current = false; }}
        onMenu={onExit}
      >
        <div className="text-6xl mt-3">📏</div>
      </WinCard>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 min-h-0">
      <div className="flex gap-1 mb-2">
        {rounds.map((_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{ width: 10, height: 10, background: i < roundIndex ? '#22C55E' : i === roundIndex ? '#F97316' : 'rgba(0,0,0,.15)' }}
          />
        ))}
      </div>

      <p className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
        {round.title}: smallest first! 📏
      </p>

      {/* the ramp — slots visibly grow, so the idea is in the picture */}
      <div className="bg-white/95 rounded-3xl p-3 border-4 border-white w-full max-w-md mb-3" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
        <div className="flex items-end justify-center gap-2">
          {round.items.map((_, i) => {
            const it = placedItems[i];
            const h = 46 + i * 12;
            return (
              <div
                key={i}
                className={`rounded-2xl flex items-center justify-center border-4 ${
                  it ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-dashed border-gray-300'
                }`}
                style={{ width: h, height: h }}
              >
                {it && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP}>
                    <ItemIcon icon={it.icon} size={h * 0.6} label={it.name} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1 px-1">
          <span>SMALL</span>
          <span>BIG</span>
        </div>
      </div>

      <div className="h-9 flex items-center">
        <AnimatePresence>
          {hint && (
            <motion.p
              className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-1.5 rounded-2xl text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={POP}
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              💡 {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 w-full max-w-md mt-1">
        {remaining.map((item) => (
          <motion.button
            key={item.icon}
            onClick={() => pick(item)}
            className="rounded-2xl bg-white border-4 border-white flex flex-col items-center justify-center py-2"
            style={{ boxShadow: '0 5px 0 rgba(0,0,0,.14)' }}
            animate={wrongIcon === item.icon ? { x: [-6, 6, -6, 6, 0] } : {}}
            whileTap={{ scale: 0.92, y: 3 }}
          >
            {/* drawn at its true relative size — the clue is visual, not verbal */}
            <ItemIcon icon={item.icon} size={22 + item.rank * 7} label={item.name} />
          </motion.button>
        ))}
      </div>

      {placedItems.length > 0 && (
        <motion.button
          onClick={undo}
          className="mt-3 rounded-2xl px-5 py-2.5 bg-white text-gray-600 font-bold border-4 border-white text-sm"
          style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.94, y: 2 }}
        >
          ↩️ Take one back
        </motion.button>
      )}
    </div>
  );
};

/* ================================================================== */
/* Shell                                                               */
/* ================================================================== */

const GAMES: { id: Exclude<Which, null>; icon: string; title: string; sub: string; diff: number; grad: string; shadow: string }[] = [
  { id: 'jigsaw', icon: '🧩', title: 'Jigsaw', sub: 'Build the picture!', diff: 2, grad: 'from-purple-500 to-indigo-500', shadow: '#4C1D95' },
  { id: 'shadow', icon: '🌑', title: 'Shadow Match', sub: 'Find each shadow!', diff: 1, grad: 'from-blue-400 to-cyan-500', shadow: '#0369A1' },
  { id: 'pattern', icon: '🌈', title: 'Pattern Fun', sub: 'What comes next?', diff: 2, grad: 'from-pink-500 to-rose-500', shadow: '#9D174D' },
  { id: 'size', icon: '📏', title: 'Size Sort', sub: 'Small to big!', diff: 2, grad: 'from-orange-400 to-red-500', shadow: '#C2410C' },
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ progress, onBack, onComplete }) => {
  const [which, setWhich] = useState<Which>(null);

  useEffect(() => () => stopSpeaking(), []);

  const exit = () => {
    playClick();
    stopSpeaking();
    setWhich(null);
  };

  const title = which ? GAMES.find((g) => g.id === which)!.title : 'Puzzle Games';

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🧩 ${title}`}
          onBack={() => { if (which) exit(); else { playClick(); onBack(); } }}
          stars={progress.stars}
        />

        {!which && (
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Choose a puzzle! 🧩
            </h2>

            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {GAMES.map((g, i) => (
                <motion.button
                  key={g.id}
                  onClick={() => { playClick(); buzz('tick'); setWhich(g.id); }}
                  className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${g.grad}`}
                  style={{ boxShadow: `0 8px 0 ${g.shadow}, 0 12px 22px rgba(0,0,0,.18)`, minHeight: 148 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06, ...POP }}
                  whileTap={{ scale: 0.94, y: 4 }}
                >
                  <motion.div
                    className="flex justify-center mb-2"
                    animate={{ y: [0, -5, 0], rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 2.4 + i * 0.3, repeat: Infinity }}
                  >
                    <ItemIcon icon={g.icon} size={48} label={g.title} />
                  </motion.div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                    {g.title}
                  </h3>
                  <p className="text-xs opacity-90">{g.sub}</p>
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

        {which === 'jigsaw' && <Jigsaw onWin={onComplete} onExit={exit} />}
        {which === 'shadow' && <ShadowMatch onWin={onComplete} onExit={exit} />}
        {which === 'pattern' && <Patterns onWin={onComplete} onExit={exit} />}
        {which === 'size' && <SizeSort onWin={onComplete} onExit={exit} />}
      </div>
    </GameBackground>
  );
};

export default PuzzleGame;
