import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { PALETTE } from '../data/coloringPages';
import { floodFill } from '../utils/floodFill';
import { saveKeepsake } from '../utils/keepsakes';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playComplete } from '../utils/sounds';

/**
 * CreativeStudio — rebuilt.
 *
 * The five real bugs this fixes:
 *
 * 1. THE FILL TOOL DESTROYED THE PICTURE. `fillArea(x, y)` ignored x and y and
 *    ran fillRect over the whole canvas, so one tap on the bucket painted over
 *    everything. It now flood-fills only the area you tapped.
 * 2. THERE WAS NO UNDO FOR DRAWING. handleUndo only popped stickers and
 *    shapes, so strokes, fills and erases could never be taken back — and the
 *    bucket bug had no way out. Undo now covers every action.
 * 3. SAVING CRASHED AFTER A FEW PICTURES. Full-size PNG data URLs were pushed
 *    into localStorage, which holds about 5MB. Roughly the third save threw an
 *    uncaught QuotaExceededError. Pictures are now downscaled, and storage
 *    drops the oldest instead of throwing.
 * 4. RESIZING WIPED THE CANVAS. Setting canvas.width resets the bitmap, and the
 *    resize handler did exactly that — rotating the phone or opening the
 *    keyboard erased the drawing. The image is now carried across.
 * 5. TWO IDENTICAL 🗑️ BUTTONS sat side by side; one deleted a sticker, the
 *    other wiped the whole picture. Now one contextual delete, and a small
 *    "start again" with a proper in-app confirm rather than browser confirm().
 *
 * Positions are stored as percentages of the canvas, which is what makes
 * resize safe and removes all the display↔canvas coordinate maths.
 */

interface CreativeStudioProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type Tool = 'draw' | 'fill' | 'sticker' | 'shape' | 'eraser' | 'move';
type Shape = 'circle' | 'square' | 'triangle' | 'line' | 'arrow' | 'star';

interface PlacedItem {
  id: string;
  type: 'sticker' | 'shape';
  /** percentages of the canvas — resize-safe */
  x: number;
  y: number;
  /** size as a percentage of canvas width */
  size: number;
  emoji?: string;
  shape?: Shape;
  color?: string;
  stroke?: number;
}

interface Snapshot {
  img: ImageData | null;
  items: PlacedItem[];
}

const TOOLS: { id: Tool; icon: string; label: string; color: string }[] = [
  { id: 'draw', icon: '🖌️', label: 'Draw', color: '#7B2CBF' },
  { id: 'fill', icon: '🪣', label: 'Fill', color: '#2CB5AF' },
  { id: 'sticker', icon: '⭐', label: 'Stickers', color: '#F0A017' },
  { id: 'shape', icon: '🔷', label: 'Shapes', color: '#2C7BE5' },
  { id: 'eraser', icon: '🧽', label: 'Rub out', color: '#F0522B' },
  { id: 'move', icon: '👆', label: 'Move', color: '#57CC5B' },
];

const SHAPES: { id: Shape; icon: string; label: string }[] = [
  { id: 'circle', icon: '⭕', label: 'circle' },
  { id: 'square', icon: '⬜', label: 'square' },
  { id: 'triangle', icon: '🔺', label: 'triangle' },
  { id: 'star', icon: '⭐', label: 'star' },
  { id: 'line', icon: '➖', label: 'line' },
  { id: 'arrow', icon: '➡️', label: 'arrow' },
];

const STICKERS = [
  '⭐', '❤️', '😊', '🎈', '🌈', '✨', '🌟', '💫',
  '🐶', '🐱', '🐰', '🦊', '🦁', '🐼', '🦄', '🐝',
  '🌸', '🌻', '🌷', '🌳', '🍀', '🍄', '☀️', '🌙',
  '🚗', '✈️', '🚀', '⚽', '🏆', '👑', '💎', '🎁',
];

const BRUSHES = [4, 10, 20, 34];
const STICKER_SIZES = [10, 16, 24, 34];
const SHAPE_SIZES = [14, 24, 36, 50];
const MAX_HISTORY = 8;
const MAX_CANVAS = 900;

/* ------------------------------------------------------------------ */
/* Shape drawing — one definition, used by both the overlay and save   */
/* ------------------------------------------------------------------ */

const starPoints = (r: number): [number, number][] =>
  Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = (-90 + i * 36) * (Math.PI / 180);
    return [rad * Math.cos(a), rad * Math.sin(a)];
  });

const ShapeSvg: React.FC<{ shape: Shape; px: number; color: string; stroke: number; ghost?: boolean }> = ({
  shape,
  px,
  color,
  stroke,
  ghost,
}) => {
  const h = px / 2;
  const common = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={px + stroke * 2} height={px + stroke * 2} style={{ opacity: ghost ? 0.55 : 1, display: 'block', pointerEvents: 'none' }}>
      <g transform={`translate(${(px + stroke * 2) / 2}, ${(px + stroke * 2) / 2})`}>
        {shape === 'circle' && <circle cx={0} cy={0} r={h} {...common} />}
        {shape === 'square' && <rect x={-h} y={-h} width={px} height={px} rx={px * 0.08} {...common} />}
        {shape === 'triangle' && <polygon points={`0,${-h} ${-h},${h} ${h},${h}`} {...common} />}
        {shape === 'star' && <polygon points={starPoints(h).map((p) => p.join(',')).join(' ')} {...common} />}
        {shape === 'line' && <line x1={-h} y1={0} x2={h} y2={0} {...common} />}
        {shape === 'arrow' && (
          <g {...common}>
            <line x1={-h} y1={0} x2={h} y2={0} />
            <line x1={h} y1={0} x2={h - px * 0.22} y2={-px * 0.18} />
            <line x1={h} y1={0} x2={h - px * 0.22} y2={px * 0.18} />
          </g>
        )}
      </g>
    </svg>
  );
};

const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  cx: number,
  cy: number,
  px: number,
  color: string,
  stroke: number
) => {
  const h = px / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  if (shape === 'circle') ctx.arc(cx, cy, h, 0, Math.PI * 2);
  else if (shape === 'square') ctx.rect(cx - h, cy - h, px, px);
  else if (shape === 'triangle') {
    ctx.moveTo(cx, cy - h);
    ctx.lineTo(cx - h, cy + h);
    ctx.lineTo(cx + h, cy + h);
    ctx.closePath();
  } else if (shape === 'star') {
    starPoints(h).forEach(([x, y], i) => (i === 0 ? ctx.moveTo(cx + x, cy + y) : ctx.lineTo(cx + x, cy + y)));
    ctx.closePath();
  } else if (shape === 'line') {
    ctx.moveTo(cx - h, cy);
    ctx.lineTo(cx + h, cy);
  } else if (shape === 'arrow') {
    ctx.moveTo(cx - h, cy);
    ctx.lineTo(cx + h, cy);
    ctx.moveTo(cx + h, cy);
    ctx.lineTo(cx + h - px * 0.22, cy - px * 0.18);
    ctx.moveTo(cx + h, cy);
    ctx.lineTo(cx + h - px * 0.22, cy + px * 0.18);
  }

  ctx.stroke();
  ctx.restore();
};

const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Android Emoji",sans-serif';

/* ------------------------------------------------------------------ */

const CreativeStudio: React.FC<CreativeStudioProps> = ({ progress, onBack, onComplete }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const dragId = useRef<string | null>(null);

  const [tool, setTool] = useState<Tool>('draw');
  const [color, setColor] = useState(PALETTE[0].color);
  const [brush, setBrush] = useState(BRUSHES[1]);
  const [stickerSize, setStickerSize] = useState(STICKER_SIZES[1]);
  const [shapeSize, setShapeSize] = useState(SHAPE_SIZES[1]);
  const [sticker, setSticker] = useState(STICKERS[0]);
  const [shape, setShape] = useState<Shape>('circle');

  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [wrapW, setWrapW] = useState(320);

  const [toast, setToast] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => () => stopSpeaking(), []);

  /* ---------------- canvas setup, resize-safe ---------------- */
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    if (!cssW || !cssH) return;
    setWrapW(cssW);

    const scale = Math.min(1, MAX_CANVAS / Math.max(cssW, cssH));
    const w = Math.round(cssW * scale);
    const h = Math.round(cssH * scale);
    if (canvas.width === w && canvas.height === h) return;

    // carry the existing picture across — setting width/height wipes the bitmap
    const old = document.createElement('canvas');
    const hadContent = canvas.width > 0 && canvas.height > 0;
    if (hadContent) {
      old.width = canvas.width;
      old.height = canvas.height;
      old.getContext('2d')?.drawImage(canvas, 0, 0);
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    if (hadContent && old.width) ctx.drawImage(old, 0, 0, w, h);
  }, []);

  useEffect(() => {
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [sizeCanvas]);

  /* ---------------- history ---------------- */
  const snapshot = (): Snapshot => {
    const ctx = canvasRef.current?.getContext('2d');
    const c = canvasRef.current;
    return {
      img: ctx && c && c.width ? ctx.getImageData(0, 0, c.width, c.height) : null,
      items: items.map((i) => ({ ...i })),
    };
  };

  const push = () => setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), snapshot()]);

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && prev.img) ctx.putImageData(prev.img, 0, 0);
    setItems(prev.items);
    setSelected(null);
    playClick();
    buzz('tick');
  };

  /* ---------------- pointer helpers ---------------- */
  const pct = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  const toCanvas = (p: { x: number; y: number }) => {
    const c = canvasRef.current!;
    return { x: (p.x / 100) * c.width, y: (p.y / 100) * c.height };
  };

  const flash = (msg: string) => {
    setToast(msg);
    speak(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  /* ---------------- drawing ---------------- */
  const down = (e: React.PointerEvent) => {
    if (tool === 'move') {
      setSelected(null);
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = pct(e);
    const cp = toCanvas(p);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (tool === 'sticker') {
      push();
      setItems((s) => [
        ...s,
        { id: `s${Date.now()}`, type: 'sticker', x: p.x, y: p.y, size: stickerSize, emoji: sticker },
      ]);
      playCorrect();
      buzz('soft');
      return;
    }

    if (tool === 'shape') {
      push();
      setItems((s) => [
        ...s,
        { id: `h${Date.now()}`, type: 'shape', x: p.x, y: p.y, size: shapeSize, shape, color, stroke: brush * 0.6 },
      ]);
      playCorrect();
      buzz('soft');
      return;
    }

    if (tool === 'fill') {
      push();
      const changed = floodFill(ctx, cp.x, cp.y, color);
      if (changed) {
        playCorrect();
        buzz('soft');
      } else {
        setPast((h) => h.slice(0, -1)); // nothing happened — don't waste an undo step
      }
      return;
    }

    // draw / eraser
    push();
    drawing.current = true;
    last.current = cp;
    buzz('tick');
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, brush / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.fill();
  };

  const move = (e: React.PointerEvent) => {
    if (dragId.current) {
      const p = pct(e);
      setItems((s) => s.map((i) => (i.id === dragId.current ? { ...i, x: p.x, y: p.y } : i)));
      return;
    }
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !last.current) return;

    const cp = toCanvas(pct(e));
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(cp.x, cp.y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brush;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    last.current = cp;
  };

  const up = () => {
    drawing.current = false;
    last.current = null;
    dragId.current = null;
  };

  /* ---------------- items ---------------- */
  const grabItem = (e: React.PointerEvent, id: string) => {
    if (tool !== 'move') return;
    e.stopPropagation();
    push();
    setSelected(id);
    dragId.current = id;
    buzz('tick');
  };

  const deleteSelected = () => {
    if (!selected) return;
    push();
    setItems((s) => s.filter((i) => i.id !== selected));
    setSelected(null);
    playClick();
    buzz('soft');
  };

  const clearAll = () => {
    push();
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (c && ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    setItems([]);
    setSelected(null);
    setConfirmClear(false);
    playClick();
    buzz('soft');
    speak('All clean! Start again.');
  };

  /* ---------------- flatten for saving ---------------- */
  const flatten = (maxWidth = 640): string => {
    const c = canvasRef.current;
    if (!c) return '';
    const out = document.createElement('canvas');
    const scale = Math.min(1, maxWidth / c.width);
    out.width = Math.round(c.width * scale);
    out.height = Math.round(c.height * scale);
    const ctx = out.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(c, 0, 0, out.width, out.height);

    items.forEach((it) => {
      const x = (it.x / 100) * out.width;
      const y = (it.y / 100) * out.height;
      const px = (it.size / 100) * out.width;
      if (it.type === 'sticker' && it.emoji) {
        ctx.font = `${px}px ${EMOJI_FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.emoji, x, y);
      } else if (it.type === 'shape' && it.shape) {
        drawShape(ctx, it.shape, x, y, px, it.color || '#000', Math.max(1, (it.stroke || 4) * scale));
      }
    });

    // JPEG at 0.72 keeps a picture around 60KB instead of a 2MB PNG
    return out.toDataURL('image/jpeg', 0.72);
  };

  const save = () => {
    const dataUrl = flatten();
    if (!dataUrl) return;
    saveKeepsake({
      skillId: 'creative-studio',
      categoryId: 'creative',
      title: `My picture ${savedCount + 1}`,
      kind: 'image',
      base: '🎨',
      color: '#FFFFFF',
      stickers: [],
      dataUrl,
    });
    setSavedCount((n) => n + 1);
    playComplete();
    buzz('success');
    flash('Saved to My Stuff!');
    onComplete(2);
  };

  const download = () => {
    const dataUrl = flatten(1200);
    if (!dataUrl) return;
    try {
      const a = document.createElement('a');
      a.download = `kidspark-picture.jpg`;
      a.href = dataUrl;
      a.click();
      playCorrect();
      flash('Picture downloaded!');
    } catch {
      flash('Could not download — it is saved in My Stuff instead');
    }
  };

  /* ---------------- render ---------------- */
  const active = TOOLS.find((t) => t.id === tool)!;
  const canUndo = past.length > 0;

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title="🎨 Creative Studio"
          onBack={() => { playClick(); stopSpeaking(); onBack(); }}
          stars={progress.stars}
        />

        {/* action bar */}
        <div className="px-3 shrink-0">
          <div className="bg-white/95 rounded-2xl p-2 border-4 border-white flex items-center gap-2" style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}>
            <motion.button
              onClick={undo}
              disabled={!canUndo}
              className="rounded-xl px-3 py-2 font-bold text-white disabled:opacity-35 flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)', boxShadow: '0 4px 0 #0369A1', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              <span className="text-lg">↩️</span>
              <span className="text-sm">Undo</span>
            </motion.button>

            <AnimatePresence>
              {selected && (
                <motion.button
                  onClick={deleteSelected}
                  className="rounded-xl px-3 py-2 font-bold text-white flex items-center gap-1"
                  style={{ background: 'linear-gradient(135deg,#F87171,#DC2626)', boxShadow: '0 4px 0 #991B1B', fontFamily: "'Bubblegum One', cursive" }}
                  initial={{ scale: 0, width: 0 }}
                  animate={{ scale: 1, width: 'auto' }}
                  exit={{ scale: 0, width: 0 }}
                  whileTap={{ scale: 0.93, y: 2 }}
                >
                  <span className="text-lg">🗑️</span>
                  <span className="text-sm">Remove</span>
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex-1" />

            <motion.button
              onClick={save}
              className="rounded-xl px-3 py-2 font-bold text-white flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg,#22C55E,#0E9F6E)', boxShadow: '0 4px 0 #047857', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              <span className="text-lg">💾</span>
              <span className="text-sm">Save</span>
            </motion.button>

            <motion.button
              onClick={download}
              className="rounded-xl px-3 py-2 font-bold text-white flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg,#FB923C,#EA580C)', boxShadow: '0 4px 0 #C2410C', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.93, y: 2 }}
            >
              <span className="text-lg">📥</span>
            </motion.button>
          </div>
        </div>

        {/* tools */}
        <div className="px-3 mt-2 shrink-0">
          <div className="grid grid-cols-6 gap-1.5">
            {TOOLS.map((t) => {
              const on = tool === t.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => {
                    playClick();
                    buzz('tick');
                    setTool(t.id);
                    if (t.id !== 'move') setSelected(null);
                    speak(t.label);
                  }}
                  className="rounded-2xl py-1.5 flex flex-col items-center border-4 border-white"
                  style={{
                    background: on ? t.color : 'rgba(255,255,255,.95)',
                    color: on ? '#fff' : '#5B6079',
                    boxShadow: on ? `0 4px 0 rgba(0,0,0,.25)` : '0 3px 0 rgba(0,0,0,.10)',
                  }}
                  whileTap={{ scale: 0.92, y: 2 }}
                >
                  <ItemIcon icon={t.icon} size={20} label={t.label} />
                  <span className="text-[9px] font-bold mt-0.5 leading-none" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {t.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* canvas */}
        <div
          ref={wrapRef}
          className="flex-1 mx-3 my-2 bg-white rounded-3xl border-4 border-white relative overflow-hidden"
          style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', minHeight: 200 }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block absolute inset-0"
            style={{ touchAction: 'none' }}
          />

          {items.map((it) => {
            const px = (it.size / 100) * wrapW;
            const isSel = selected === it.id;
            return (
              <div
                key={it.id}
                className="absolute"
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  transform: 'translate(-50%,-50%)',
                  zIndex: isSel ? 20 : 10,
                  pointerEvents: tool === 'move' ? 'auto' : 'none',
                  cursor: tool === 'move' ? 'move' : 'default',
                  filter: isSel ? 'drop-shadow(0 0 6px #22C55E)' : 'none',
                  touchAction: 'none',
                }}
                onPointerDown={(e) => grabItem(e, it.id)}
              >
                {it.type === 'sticker' && it.emoji && <ItemIcon icon={it.emoji} size={px} />}
                {it.type === 'shape' && it.shape && (
                  <ShapeSvg shape={it.shape} px={px} color={it.color || '#000'} stroke={it.stroke || 4} />
                )}
              </div>
            );
          })}

          {tool === 'move' && items.length === 0 && (
            <p className="absolute bottom-3 left-0 right-0 text-center text-gray-400 text-xs font-bold">
              Put a sticker or shape down first, then move it
            </p>
          )}
        </div>

        {/* bottom panel */}
        <div className="px-3 pb-3 shrink-0">
          <div className="bg-white/95 rounded-3xl p-3 border-4 border-white" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
            {/* sticker picker */}
            {tool === 'sticker' && (
              <div className="mb-2">
                <div className="grid grid-cols-8 gap-1.5 max-h-28 overflow-y-auto mb-2">
                  {STICKERS.map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => { setSticker(s); playClick(); buzz('tick'); }}
                      className={`aspect-square rounded-xl flex items-center justify-center border-4 ${
                        sticker === s ? 'border-orange-400 bg-orange-50' : 'border-white bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.88 }}
                    >
                      <ItemIcon icon={s} size={22} />
                    </motion.button>
                  ))}
                </div>
                <SizeRow values={STICKER_SIZES} value={stickerSize} onChange={setStickerSize} preview={sticker} />
              </div>
            )}

            {/* shape picker */}
            {tool === 'shape' && (
              <div className="mb-2">
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  {SHAPES.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => { setShape(s.id); playClick(); buzz('tick'); speak(s.label); }}
                      className={`aspect-square rounded-xl flex items-center justify-center border-4 ${
                        shape === s.id ? 'border-blue-400 bg-blue-50' : 'border-white bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.88 }}
                      aria-label={s.label}
                    >
                      <ItemIcon icon={s.icon} size={24} label={s.label} />
                    </motion.button>
                  ))}
                </div>
                <SizeRow values={SHAPE_SIZES} value={shapeSize} onChange={setShapeSize} />
              </div>
            )}

            {/* brush sizes — dots at true size, no letters */}
            {(tool === 'draw' || tool === 'eraser') && (
              <div className="flex items-center justify-center gap-2 mb-2">
                {BRUSHES.map((w) => (
                  <motion.button
                    key={w}
                    onClick={() => { setBrush(w); playClick(); buzz('tick'); }}
                    className={`rounded-2xl flex items-center justify-center border-4 ${
                      brush === w ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 border-white'
                    }`}
                    style={{ width: 54, height: 44, boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={`brush size ${w}`}
                  >
                    <span
                      className="rounded-full block"
                      style={{
                        width: Math.min(w, 26),
                        height: Math.min(w, 26),
                        background: tool === 'eraser' ? '#C7CCDA' : color,
                        border: '1px solid rgba(0,0,0,.18)',
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* colours */}
            {tool !== 'sticker' && tool !== 'move' && (
              <div className="grid grid-cols-9 gap-1.5">
                {PALETTE.map((s) => (
                  <motion.button
                    key={s.color}
                    onClick={() => { setColor(s.color); playClick(); buzz('tick'); speak(s.name); }}
                    className="rounded-full aspect-square"
                    style={{
                      background: s.color,
                      border: color === s.color ? '4px solid #1B1B1F' : '3px solid #D8DCE8',
                      boxShadow: '0 3px 0 rgba(0,0,0,.12)',
                    }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={s.name}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => { playClick(); setConfirmClear(true); }}
              className="w-full rounded-2xl py-1.5 mt-2 text-xs font-bold text-red-500 bg-red-50 border-2 border-red-200"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              🗑️ Start again
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-500 font-semibold mt-1.5">
            {tool === 'fill' && '👆 Tap an area to fill just that bit'}
            {tool === 'draw' && '👆 Drag to draw'}
            {tool === 'eraser' && '👆 Drag to rub out'}
            {tool === 'sticker' && '👆 Tap the picture to stick it on'}
            {tool === 'shape' && '👆 Tap the picture to add the shape'}
            {tool === 'move' && '👆 Drag a sticker or shape to move it'}
          </p>
        </div>

        {/* toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50 px-5 py-3 rounded-2xl bg-gray-900/92 text-white font-bold text-sm text-center max-w-xs"
              initial={{ y: 16, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={POP}
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

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
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-5xl mb-2">🗑️</p>
                <p className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  Start this picture again?
                </p>
                <p className="text-sm text-gray-500 mt-1">Everything on the page will go.</p>
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
      </div>
    </GameBackground>
  );
};

/* small shared size picker */
const SizeRow: React.FC<{
  values: number[];
  value: number;
  onChange: (v: number) => void;
  preview?: string;
}> = ({ values, value, onChange, preview }) => (
  <div className="flex items-center justify-center gap-2">
    {values.map((v) => (
      <motion.button
        key={v}
        onClick={() => onChange(v)}
        className={`rounded-2xl flex items-center justify-center border-4 ${
          value === v ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 border-white'
        }`}
        style={{ width: 52, height: 44, boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
        whileTap={{ scale: 0.92 }}
        aria-label={`size ${v}`}
      >
        {preview ? (
          <ItemIcon icon={preview} size={Math.min(v, 26)} />
        ) : (
          <span
            className="rounded-full block bg-gray-500"
            style={{ width: Math.min(v / 2, 24), height: Math.min(v / 2, 24) }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

export default CreativeStudio;
