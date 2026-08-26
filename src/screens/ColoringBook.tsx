import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import PageArt from '../components/PageArt';
import { GameProgress } from '../store/gameStore';
import { COLORING_PAGES, PALETTE, ColoringPage } from '../data/coloringPages';
import { Stroke, saveKeepsake, getKeepsakes } from '../utils/keepsakes';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playComplete } from '../utils/sounds';

/**
 * ColoringBook — rebuilt.
 *
 * What changed and why:
 *
 * 1. TAP TO FILL is the default tool. A four-year-old cannot keep a finger
 *    inside a butterfly wing; tapping a region is instant and always looks
 *    tidy. The brush is still there for older children.
 * 2. UNDO exists. Before, the only way back was "Clear All" — one stray tap
 *    and the whole picture was gone, with no way to recover it.
 * 3. SAVE exists. Before, a finished picture could not be kept at all. Now it
 *    goes to My Stuff and can be shown to a grown-up.
 * 4. MIRROR mode: on symmetrical pictures, colouring one wing colours the
 *    other. It costs almost nothing and feels like magic.
 * 5. The pages are SVG, not edge-detected emoji, so they render identically on
 *    every device and have real regions inside them.
 */

interface ColoringBookProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const BRUSHES = [1.6, 3.2, 6, 10];
const MAX_HISTORY = 40;

interface Snapshot {
  fills: Record<string, string>;
  strokes: Stroke[];
}

const ColoringBook: React.FC<ColoringBookProps> = ({ progress, onBack, onComplete }) => {
  const [page, setPage] = useState<ColoringPage | null>(null);

  const [fills, setFills] = useState<Record<string, string>>({});
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [past, setPast] = useState<Snapshot[]>([]);

  const [color, setColor] = useState(PALETTE[0].color);
  const [tool, setTool] = useState<'fill' | 'brush'>('fill');
  const [eraser, setEraser] = useState(false);
  const [brushW, setBrushW] = useState(BRUSHES[1]);
  const [mirror, setMirror] = useState(true);

  const [celebrated, setCelebrated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showOff, setShowOff] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  useEffect(() => () => stopSpeaking(), []);

  /* ---------------- picker: show their own coloured versions ------- */
  const myVersions = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    getKeepsakes()
      .filter((k) => k.categoryId === 'coloring' && k.pageId && k.fills)
      .forEach((k) => {
        if (!map[k.pageId!]) map[k.pageId!] = k.fills!;
      });
    return map;
  }, [page]);

  /* ---------------- history ---------------- */
  const push = () => {
    setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), { fills: { ...fills }, strokes: [...strokes] }]);
  };

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFills(prev.fills);
    setStrokes(prev.strokes);
    playClick();
    buzz('tick');
  };

  const clearAll = () => {
    if (!Object.keys(fills).length && !strokes.length) return;
    push();
    setFills({});
    setStrokes([]);
    playClick();
    buzz('soft');
    speak('All clean! Start again.');
  };

  /* ---------------- filling ---------------- */
  const tapRegion = (id: string) => {
    if (!page || tool !== 'fill') return;
    push();

    const region = page.regions.find((r) => r.id === id);
    const targets = [id];
    if (mirror && page.symmetric && region?.mirror) targets.push(region.mirror);

    setFills((f) => {
      const next = { ...f };
      targets.forEach((t) => {
        if (eraser) delete next[t];
        else next[t] = color;
      });
      return next;
    });

    playCorrect();
    buzz('soft');
    if (!eraser) {
      const swatch = PALETTE.find((s) => s.color === color);
      speak(swatch ? swatch.name : 'coloured');
    }
  };

  /* ---------------- brushing ---------------- */
  const svgPoint = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  const brushDown = (e: React.PointerEvent) => {
    if (tool !== 'brush') return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    push();
    buzz('tick');

    const p = svgPoint(e);

    if (eraser) {
      // rub out any stroke passing near the finger
      setStrokes((all) =>
        all.filter((s) => !s.pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < brushW + 3))
      );
      drawing.current = true;
      return;
    }

    drawing.current = true;
    setStrokes((s) => [...s, { color, width: brushW, pts: [p] }]);
  };

  const brushMove = (e: React.PointerEvent) => {
    if (!drawing.current || tool !== 'brush') return;
    const p = svgPoint(e);

    if (eraser) {
      setStrokes((all) =>
        all.filter((s) => !s.pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < brushW + 3))
      );
      return;
    }

    setStrokes((all) => {
      if (!all.length) return all;
      const last = all[all.length - 1];
      const prev = last.pts[last.pts.length - 1];
      if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) < 0.7) return all;
      return [...all.slice(0, -1), { ...last, pts: [...last.pts, p] }];
    });
  };

  const brushUp = () => {
    drawing.current = false;
  };

  /* ---------------- completion ---------------- */
  const filledCount = page ? page.regions.filter((r) => fills[r.id]).length : 0;
  const total = page?.regions.length ?? 0;
  const complete = total > 0 && filledCount === total;

  useEffect(() => {
    if (complete && !celebrated) {
      setCelebrated(true);
      playComplete();
      buzz('success');
      speak('Beautiful! You coloured the whole picture.');
    }
  }, [complete, celebrated]);

  /* ---------------- save ---------------- */
  const save = () => {
    if (!page) return;
    saveKeepsake({
      skillId: page.id,
      categoryId: 'coloring',
      title: page.name,
      kind: 'coloring',
      base: page.id,
      color: '#FFFFFF',
      stickers: [],
      strokes,
      pageId: page.id,
      fills,
    });
    setSaved(true);
    playComplete();
    buzz('success');
    speak('Saved to your shelf!');
    onComplete(3);
  };

  const openPage = (p: ColoringPage) => {
    playClick();
    buzz('tick');
    setPage(p);
    setFills({});
    setStrokes([]);
    setPast([]);
    setCelebrated(false);
    setSaved(false);
    setEraser(false);
    setTool('fill');
    speak(`Let's colour the ${p.name}. Tap a part to fill it in!`);
  };

  const leavePage = () => {
    playClick();
    stopSpeaking();
    setPage(null);
  };

  /* ================================================================ */
  /* PICKER                                                           */
  /* ================================================================ */
  if (!page) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation
            title="🎨 Coloring Book"
            onBack={() => { playClick(); onBack(); }}
            stars={progress.stars}
          />

          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Pick a picture to colour! 🖌️
            </motion.h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {COLORING_PAGES.map((p, i) => {
                const mine = myVersions[p.id];

                return (
                  <motion.button
                    key={p.id}
                    onClick={() => openPage(p)}
                    className="bg-white rounded-3xl p-2 text-center border-4 border-white relative"
                    style={{ boxShadow: '0 6px 0 rgba(139,92,246,0.35), 0 8px 18px rgba(0,0,0,0.08)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.03, ...POP }}
                    whileTap={{ scale: 0.94, y: 3 }}
                  >
                    {mine && (
                      <span className="absolute top-1 right-1 text-sm bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        ✓
                      </span>
                    )}
                    <div className="flex justify-center">
                      {/* their own version if they've coloured it, else the blank outline */}
                      <PageArt page={p} fills={mine || {}} size={72} />
                    </div>
                    <span
                      className="text-sm font-bold text-gray-700 block mt-1"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      {p.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-xs text-gray-500 font-semibold mt-4">
              Pictures you have coloured keep your colours ✨
            </p>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ================================================================ */
  /* EDITOR                                                           */
  /* ================================================================ */
  const canvasSize = typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 360) : 320;

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation title={`🎨 ${page.name}`} onBack={leavePage} stars={progress.stars} />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="max-w-md mx-auto">
            {/* progress */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-white/95 border-4 border-white rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="text-sm font-bold text-gray-600 tabular-nums" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {filledCount} / {total} coloured
                </span>
              </div>
              {page.symmetric && (
                <motion.button
                  onClick={() => { setMirror((m) => !m); playClick(); buzz('tick'); speak(mirror ? 'Mirror off' : 'Mirror on!'); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold border-4 border-white ${
                    mirror ? 'bg-purple-500 text-white' : 'bg-white text-gray-500'
                  }`}
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  whileTap={{ scale: 0.92 }}
                >
                  🪞 Mirror {mirror ? 'on' : 'off'}
                </motion.button>
              )}
            </div>

            {/* canvas */}
            <div
              className="bg-white rounded-3xl border-4 border-white mx-auto flex items-center justify-center relative"
              style={{ boxShadow: '0 8px 0 rgba(0,0,0,.10)', width: canvasSize + 16, height: canvasSize + 16 }}
            >
              <PageArt
                page={page}
                fills={fills}
                strokes={strokes}
                size={canvasSize}
                svgRef={svgRef}
                onRegionTap={tool === 'fill' ? tapRegion : undefined}
                brushHandlers={
                  tool === 'brush'
                    ? { onPointerDown: brushDown, onPointerMove: brushMove, onPointerUp: brushUp }
                    : undefined
                }
              />

              <AnimatePresence>
                {complete && (
                  <motion.div
                    className="absolute -top-3 -right-3 text-4xl pointer-events-none"
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={POP}
                  >
                    🌟
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* save */}
            <div className="flex gap-2 justify-center mt-3">
              <motion.button
                onClick={save}
                disabled={filledCount === 0}
                className="rounded-2xl px-6 py-3.5 text-white font-bold border-4 border-white disabled:opacity-40"
                style={{
                  background: saved
                    ? 'linear-gradient(135deg,#22C55E,#0E9F6E)'
                    : 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                  boxShadow: saved ? '0 5px 0 #047857' : '0 5px 0 #4C1D95',
                  fontFamily: "'Bubblegum One', cursive",
                }}
                whileTap={{ scale: 0.95, y: 3 }}
                animate={complete && !saved ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 1.2, repeat: complete && !saved ? Infinity : 0 }}
              >
                {saved ? '✅ Saved!' : '💾 Save it'}
              </motion.button>

              {saved && (
                <motion.button
                  onClick={() => { playClick(); setShowOff(true); }}
                  className="rounded-2xl px-5 py-3.5 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
                  whileTap={{ scale: 0.95, y: 3 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  👨‍👩‍👧 Show!
                </motion.button>
              )}
            </div>

            {/* toolbar */}
            <div className="bg-white/95 rounded-3xl p-3 mt-3 border-4 border-white" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
              {/* tools */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { id: 'fill', label: 'Fill', icon: '🪣', on: tool === 'fill' && !eraser },
                  { id: 'brush', label: 'Draw', icon: '🖌️', on: tool === 'brush' && !eraser },
                  { id: 'eraser', label: 'Rub out', icon: '🧽', on: eraser },
                  { id: 'undo', label: 'Undo', icon: '↩️', on: false },
                ].map((b) => (
                  <motion.button
                    key={b.id}
                    onClick={() => {
                      if (b.id === 'undo') return undo();
                      playClick();
                      buzz('tick');
                      if (b.id === 'eraser') setEraser((e) => !e);
                      else {
                        setTool(b.id as 'fill' | 'brush');
                        setEraser(false);
                      }
                    }}
                    disabled={b.id === 'undo' && past.length === 0}
                    className={`rounded-2xl py-2.5 flex flex-col items-center border-4 disabled:opacity-35 ${
                      b.on ? 'bg-purple-500 text-white border-white' : 'bg-gray-50 text-gray-600 border-white'
                    }`}
                    style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
                    whileTap={{ scale: 0.93, y: 2 }}
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[10px] font-bold mt-0.5" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                      {b.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* colours — two rows, bigger targets, white has a ring */}
              <div className="grid grid-cols-9 gap-1.5 mb-3">
                {PALETTE.map((s) => (
                  <motion.button
                    key={s.color}
                    onClick={() => { setColor(s.color); setEraser(false); playClick(); buzz('tick'); speak(s.name); }}
                    className="rounded-full aspect-square"
                    style={{
                      background: s.color,
                      border: color === s.color && !eraser ? '4px solid #1B1B1F' : '3px solid #D8DCE8',
                      boxShadow: '0 3px 0 rgba(0,0,0,.12)',
                    }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={s.name}
                  />
                ))}
              </div>

              {/* brush sizes — dots only, no letters (half your users can't read) */}
              {tool === 'brush' && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  {BRUSHES.map((w) => (
                    <motion.button
                      key={w}
                      onClick={() => { setBrushW(w); playClick(); }}
                      className={`rounded-2xl flex items-center justify-center border-4 ${
                        brushW === w ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 border-white'
                      }`}
                      style={{ width: 52, height: 44, boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
                      whileTap={{ scale: 0.92 }}
                      aria-label={`brush size ${w}`}
                    >
                      <span
                        className="rounded-full block"
                        style={{ width: w * 2.4, height: w * 2.4, background: eraser ? '#9AA0A6' : color, border: '1px solid rgba(0,0,0,.15)' }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* clear — small, tucked away, and confirmed */}
              <button
                onClick={clearAll}
                className="w-full rounded-2xl py-2 text-xs font-bold text-red-500 bg-red-50 border-2 border-red-200"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                🗑️ Start this picture again
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 font-semibold mt-3">
              {tool === 'fill' ? '👆 Tap a part to fill it with colour' : '👆 Draw — it stays inside the lines!'}
            </p>
          </div>
        </div>

        {/* show a grown-up */}
        <AnimatePresence>
          {showOff && (
            <motion.div
              className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOff(false)}
            >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={POP}>
                <PageArt
                  page={page}
                  fills={fills}
                  strokes={strokes}
                  size={Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 50 : 300)}
                />
              </motion.div>
              <p className="mt-3 text-2xl font-bold text-gray-800" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                I coloured this! 🎉
              </p>
              <p className="mt-1 text-gray-400 text-sm">tap anywhere to close</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameBackground>
  );
};

export default ColoringBook;
