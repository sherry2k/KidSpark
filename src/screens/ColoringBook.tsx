import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import PageArt from '../components/PageArt';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { COLORING_PAGES, WINTER_PAGE_IDS, PALETTE, ColoringPage } from '../data/coloringPages';
import { isWinter } from '../components/WinterDecor';
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
 * 6. TWO TABS on the picker: "Classic" (all the older pictures) and "Winter"
 *    (the winter pictures, with NEW ribbons). The Winter tab opens first while
 *    winter is on. Which picture belongs to which tab is decided by
 *    WINTER_PAGE_IDS in data/coloringPages.ts.
 * 7. THE EDITOR USES THE CREATIVE STUDIO LAYOUT: a slim action bar on top
 *    (Undo, Start again, Save), one row of tools, the picture in the middle
 *    taking all the free room, and a compact colour palette at the bottom
 *    (the same small swatches as Creative Studio). Everything fits on one screen.
 */

interface ColoringBookProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const BRUSHES = [1.6, 3.2, 6, 10];
const MAX_HISTORY = 40;

/* remembers that the child has opened the Winter tab, so its NEW badge can go away */
const WINTER_TAB_KEY = 'kidspark_winter_tab_seen';
const readWinterTabSeen = () => {
  try { return localStorage.getItem(WINTER_TAB_KEY) === '1'; } catch { return false; }
};
const writeWinterTabSeen = () => {
  try { localStorage.setItem(WINTER_TAB_KEY, '1'); } catch { /* ignore */ }
};

const CLASSIC_PAGES = COLORING_PAGES.filter((p) => !WINTER_PAGE_IDS.has(p.id));
const WINTER_PAGES = COLORING_PAGES.filter((p) => WINTER_PAGE_IDS.has(p.id));

interface Snapshot {
  fills: Record<string, string>;
  strokes: Stroke[];
}

const ColoringBook: React.FC<ColoringBookProps> = ({ progress, onBack, onComplete }) => {
  const [page, setPage] = useState<ColoringPage | null>(null);
  const [tab, setTab] = useState<'classic' | 'winter'>(() => (isWinter() ? 'winter' : 'classic'));
  const [winterTabSeen, setWinterTabSeen] = useState(readWinterTabSeen);

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  /* the picture takes whatever room the middle of the screen has: measure it */
  useEffect(() => {
    if (!page) return;
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [page]);

  /* opening the Winter tab (including when it opens by itself) clears its NEW badge */
  useEffect(() => {
    if (tab === 'winter' && !page && !winterTabSeen) {
      writeWinterTabSeen();
      setWinterTabSeen(true);
    }
  }, [tab, page, winterTabSeen]);

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
    setConfirmClear(false);
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

  const switchTab = (t: 'classic' | 'winter') => {
    if (t === tab) return;
    playClick();
    buzz('tick');
    setTab(t);
  };

  /* ================================================================ */
  /* PICKER                                                           */
  /* ================================================================ */
  if (!page) {
    const pages = tab === 'winter' ? WINTER_PAGES : CLASSIC_PAGES;

    /* one tab button; spacing is inline because the phone reset removes padding/margin classes */
    const tabButton = (id: 'classic' | 'winter', label: string, showNew: boolean) => {
      const on = tab === id;
      return (
        <button
          key={id}
          onClick={() => switchTab(id)}
          aria-pressed={on}
          style={{
            position: 'relative',
            flex: '1 1 0',
            maxWidth: 170,
            padding: '10px 8px',
            borderRadius: 18,
            border: '4px solid #fff',
            cursor: 'pointer',
            fontFamily: "'Bubblegum One', cursive",
            fontWeight: 700,
            fontSize: 16,
            color: on ? '#fff' : '#6B5B95',
            background: on
              ? id === 'winter'
                ? 'linear-gradient(135deg,#60A5FA,#8B5CF6)'
                : 'linear-gradient(135deg,#8B5CF6,#EC4899)'
              : 'rgba(255,255,255,.85)',
            boxShadow: on ? '0 5px 0 rgba(76,29,149,.45)' : '0 4px 0 rgba(0,0,0,.10)',
            transform: on ? 'translateY(0)' : 'translateY(2px)',
          }}
        >
          {label}
          {showNew && (
            <span
              style={{
                position: 'absolute', top: -9, right: -6,
                background: 'linear-gradient(90deg,#EF4444,#EC4899)', color: '#fff',
                fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                padding: '2px 7px', borderRadius: 10, border: '2px solid #fff',
              }}
            >
              NEW
            </span>
          )}
        </button>
      );
    };

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

            {/* two tabs: Classic / Winter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, marginTop: 4 }}>
              {tabButton('classic', '🎨 Classic', false)}
              {tabButton('winter', '❄️ Winter', !winterTabSeen)}
            </div>

            <div key={tab} className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {pages.map((p, i) => {
                const mine = myVersions[p.id];
                const isNew = WINTER_PAGE_IDS.has(p.id) && !mine;

                return (
                  <motion.button
                    key={p.id}
                    onClick={() => openPage(p)}
                    className="bg-white rounded-3xl p-2 text-center border-4 border-white relative"
                    style={{ boxShadow: '0 6px 0 rgba(139,92,246,0.35), 0 8px 18px rgba(0,0,0,0.08)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    /* capped, so a long list never makes the last pictures wait */
                    transition={{ delay: Math.min(i, 8) * 0.03, ...POP }}
                    whileTap={{ scale: 0.94, y: 3 }}
                  >
                    {mine && (
                      <span className="absolute top-1 right-1 text-sm bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        ✓
                      </span>
                    )}
                    {/* NEW ribbon on the winter pictures until the child has coloured them */}
                    {isNew && (
                      <span
                        style={{
                          position: 'absolute', top: 2, left: 2, zIndex: 2, pointerEvents: 'none',
                          background: 'linear-gradient(90deg,#EF4444,#EC4899)', color: '#fff',
                          fontSize: 9, fontWeight: 800, letterSpacing: 0.4, lineHeight: 1.2,
                          padding: '1px 5px', borderRadius: 8, border: '1.5px solid #fff',
                        }}
                      >
                        NEW
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
  /* EDITOR  (same layout as Creative Studio)                         */
  /* Spacing is written as inline styles on purpose: the phone reset  */
  /* in index.css removes Tailwind padding/margin classes on phones.  */
  /* ================================================================ */
  /* the square picture: as big as the middle area allows, never tiny, never huge */
  const fallback = typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 320) : 320;
  const canvasSize = box.w && box.h ? Math.min(560, Math.max(150, Math.min(box.w, box.h) - 8)) : fallback;

  const TOOLS: { id: 'fill' | 'brush' | 'eraser'; icon: string; label: string; color: string; on: boolean }[] = [
    { id: 'fill', icon: '🪣', label: 'Fill', color: '#2CB5AF', on: tool === 'fill' && !eraser },
    { id: 'brush', icon: '🖌️', label: 'Draw', color: '#7B2CBF', on: tool === 'brush' && !eraser },
    { id: 'eraser', icon: '🧽', label: 'Rub out', color: '#F0522B', on: eraser },
  ];
  const canUndo = past.length > 0;
  const canClear = filledCount > 0 || strokes.length > 0;
  const toolCount = TOOLS.length + (page.symmetric ? 1 : 0) + 1; // + Mirror (if any) + Clear

  const SIDE = 12; // the same side gap for every bar and for the picture
  const tileBase: React.CSSProperties = { padding: '6px 0', minWidth: 0 };
  const smallBtn: React.CSSProperties = { padding: '8px 12px' };

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto">
        <Navigation title={`🎨 ${page.name}`} onBack={leavePage} stars={progress.stars} />

        {/* action bar */}
        <div className="shrink-0" style={{ padding: `0 ${SIDE}px` }}>
          <div
            className="bg-white/95 rounded-2xl border-4 border-white flex items-center gap-2"
            style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)', padding: 8 }}
          >
            <motion.button
              onClick={undo}
              disabled={!canUndo}
              className="rounded-xl font-bold text-white disabled:opacity-35 flex items-center gap-1"
              style={{ ...smallBtn, background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)', boxShadow: '0 4px 0 #0369A1', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              <span className="text-lg">↩️</span>
              <span className="text-sm">Undo</span>
            </motion.button>

            {/* how much is coloured */}
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-gray-600 tabular-nums" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {filledCount}/{total} 🎨
              </span>
            </div>

            <motion.button
              onClick={save}
              disabled={filledCount === 0}
              className="rounded-xl font-bold text-white disabled:opacity-40 flex items-center gap-1"
              style={{
                ...smallBtn,
                background: saved ? 'linear-gradient(135deg,#22C55E,#0E9F6E)' : 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                boxShadow: saved ? '0 4px 0 #047857' : '0 4px 0 #4C1D95',
                fontFamily: "'Bubblegum One', cursive",
              }}
              whileTap={{ scale: 0.93, y: 2 }}
              animate={complete && !saved ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 1.2, repeat: complete && !saved ? Infinity : 0 }}
            >
              <span className="text-lg">{saved ? '✅' : '💾'}</span>
              <span className="text-sm">{saved ? 'Saved' : 'Save'}</span>
            </motion.button>

            {saved && (
              <motion.button
                onClick={() => { playClick(); setShowOff(true); }}
                className="rounded-xl font-bold text-white flex items-center gap-1"
                style={{ ...smallBtn, background: 'linear-gradient(135deg,#FB923C,#EA580C)', boxShadow: '0 4px 0 #C2410C', fontFamily: "'Bubblegum One', cursive" }}
                whileTap={{ scale: 0.93, y: 2 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                aria-label="Show a grown-up"
              >
                <span className="text-lg">👨‍👩‍👧</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* tools: Fill, Draw, Rub out, Mirror (symmetrical pictures only), Clear */}
        <div className="shrink-0" style={{ padding: `0 ${SIDE}px`, marginTop: 8 }}>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${toolCount}, minmax(0, 1fr))` }}>
            {TOOLS.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => {
                  playClick();
                  buzz('tick');
                  if (t.id === 'eraser') setEraser((e) => !e);
                  else {
                    setTool(t.id);
                    setEraser(false);
                  }
                }}
                className="rounded-2xl flex flex-col items-center border-4 border-white"
                style={{
                  ...tileBase,
                  background: t.on ? t.color : 'rgba(255,255,255,.95)',
                  color: t.on ? '#fff' : '#5B6079',
                  boxShadow: t.on ? '0 4px 0 rgba(0,0,0,.25)' : '0 3px 0 rgba(0,0,0,.10)',
                }}
                whileTap={{ scale: 0.92, y: 2 }}
              >
                <ItemIcon icon={t.icon} size={20} label={t.label} />
                <span className="text-[9px] font-bold mt-0.5 leading-none" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {t.label}
                </span>
              </motion.button>
            ))}

            {page.symmetric && (
              <motion.button
                onClick={() => { setMirror((m) => !m); playClick(); buzz('tick'); speak(mirror ? 'Mirror off' : 'Mirror on!'); }}
                className="rounded-2xl flex flex-col items-center border-4 border-white"
                style={{
                  ...tileBase,
                  background: mirror ? '#8B5CF6' : 'rgba(255,255,255,.95)',
                  color: mirror ? '#fff' : '#5B6079',
                  boxShadow: mirror ? '0 4px 0 rgba(0,0,0,.25)' : '0 3px 0 rgba(0,0,0,.10)',
                }}
                whileTap={{ scale: 0.92, y: 2 }}
                aria-pressed={mirror}
              >
                <ItemIcon icon="🪞" size={20} label="Mirror" />
                <span className="text-[9px] font-bold mt-0.5 leading-none" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  Mirror {mirror ? 'on' : 'off'}
                </span>
              </motion.button>
            )}

            {/* clear: same look as the other tools, asks before wiping */}
            <motion.button
              onClick={() => { if (!canClear) return; playClick(); setConfirmClear(true); }}
              disabled={!canClear}
              className="rounded-2xl flex flex-col items-center border-4 border-white disabled:opacity-40"
              style={{
                ...tileBase,
                background: 'rgba(255,255,255,.95)',
                color: '#5B6079',
                boxShadow: '0 3px 0 rgba(0,0,0,.10)',
              }}
              whileTap={{ scale: 0.92, y: 2 }}
              aria-label="Start this picture again"
            >
              <ItemIcon icon="🗑️" size={20} label="Clear" />
              <span className="text-[9px] font-bold mt-0.5 leading-none" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                Clear
              </span>
            </motion.button>
          </div>
        </div>

        {/* the picture — in the middle, as big as the free room allows, with the same gap all round */}
        <div
          ref={wrapRef}
          className="flex-1 bg-white rounded-3xl border-4 border-white relative overflow-hidden flex items-center justify-center"
          style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', minHeight: 240, margin: `10px ${SIDE}px` }}
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
                className="absolute top-2 right-2 text-4xl pointer-events-none"
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={POP}
              >
                🌟
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* bottom panel: brush sizes (Draw only) + the small colour swatches, like Creative Studio */}
        <div className="shrink-0" style={{ padding: `0 ${SIDE}px 8px` }}>
          <div className="bg-white/95 rounded-3xl border-4 border-white" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', padding: 8 }}>
            {tool === 'brush' && (
              <div className="flex items-center justify-center gap-2" style={{ marginBottom: 6 }}>
                {BRUSHES.map((w) => (
                  <motion.button
                    key={w}
                    onClick={() => { setBrushW(w); playClick(); buzz('tick'); }}
                    className={`rounded-2xl flex items-center justify-center border-4 ${
                      brushW === w ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 border-white'
                    }`}
                    style={{ width: 54, height: 38, boxShadow: '0 3px 0 rgba(0,0,0,.10)' }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={`brush size ${w}`}
                  >
                    <span
                      className="rounded-full block"
                      style={{ width: Math.min(w * 2.4, 26), height: Math.min(w * 2.4, 26), background: eraser ? '#C7CCDA' : color, border: '1px solid rgba(0,0,0,.18)' }}
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* colours: same small swatches as Creative Studio (seven across) */}
            <div className="grid grid-cols-7 gap-1">
              {PALETTE.map((s) => (
                <motion.button
                  key={s.color}
                  onClick={() => { setColor(s.color); setEraser(false); playClick(); buzz('tick'); speak(s.name); }}
                  className="rounded-xl w-full"
                  style={{
                    height: 30,
                    background: s.color,
                    border: color === s.color && !eraser ? '2px solid #FFFFFF' : '2px solid #D8DCE8',
                    boxShadow: color === s.color && !eraser
                      ? '0 0 0 2px #1B1B1F, 0 2px 0 rgba(0,0,0,.12)'
                      : '0 2px 0 rgba(0,0,0,.12)',
                  }}
                  whileTap={{ scale: 0.88 }}
                  aria-label={s.name}
                />
              ))}
            </div>
          </div>

          <p className="text-center text-[11px] leading-tight text-gray-500 font-semibold" style={{ marginTop: 4 }}>
            {eraser
              ? '👆 Tap a part to take its colour off'
              : tool === 'fill'
              ? '👆 Tap a part to fill it with colour'
              : '👆 Draw — it stays inside the lines!'}
          </p>
        </div>

        {/* in-app confirm — browser confirm() is blocked in some webviews */}
        <AnimatePresence>
          {confirmClear && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmClear(false)}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 text-center border-4 border-white max-w-xs w-full"
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={POP}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <p className="text-5xl mb-2">🗑️</p>
                <p className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  Start this picture again?
                </p>
                <p className="text-sm text-gray-500 mt-1">All the colours will go.</p>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => { playClick(); setConfirmClear(false); }}
                    className="flex-1 rounded-2xl py-3 bg-gray-100 text-gray-700 font-bold border-4 border-white"
                    style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
                  >
                    Keep it
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex-1 rounded-2xl py-3 text-white font-bold border-4 border-white"
                    style={{ background: 'linear-gradient(135deg,#F87171,#DC2626)', boxShadow: '0 4px 0 #991B1B', fontFamily: "'Bubblegum One', cursive" }}
                  >
                    Start again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
