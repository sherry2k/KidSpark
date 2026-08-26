import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { DrawStep } from '../../data/activityTypes';
import { Stroke } from '../../utils/keepsakes';
import { buzz, speak } from '../../utils/kidJuice';
import { playClick, playCorrect } from '../../utils/sounds';

/**
 * DRAW — finger painting, with a mirror.
 *
 * Points are stored as percentages so a drawing re-renders crisply at any
 * size — thumbnail on the shelf, full screen for a grown-up.
 *
 * Symmetry mode is the cheapest magic in the whole app: a child scribbles
 * down one side and a butterfly appears. Costs one extra polyline.
 */

interface Props {
  step: DrawStep;
  onDone: (payload: { kind: 'drawing'; base: string; color: string; strokes: Stroke[] }) => void;
}

const SIZE = 280;
const WIDTHS = [3, 6, 11];

const DrawStage: React.FC<Props> = ({ step, onDone }) => {
  const padRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(step.colors[0]);
  const [width, setWidth] = useState(WIDTHS[1]);

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const pt = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
    };
  };

  const down = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    buzz('tick');
    setStrokes((s) => [...s, { color, width, pts: [pt(e)] }]);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const p = pt(e);
    setStrokes((s) => {
      if (!s.length) return s;
      const last = s[s.length - 1];
      const prev = last.pts[last.pts.length - 1];
      // skip micro-moves so the stored path stays small
      if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) < 0.8) return s;
      return [...s.slice(0, -1), { ...last, pts: [...last.pts, p] }];
    });
  };

  const up = () => {
    drawing.current = false;
  };

  const undo = () => {
    if (!strokes.length) return;
    playClick();
    buzz('tick');
    setStrokes((s) => s.slice(0, -1));
  };

  const clear = () => {
    playClick();
    setStrokes([]);
  };

  const finish = () => {
    playCorrect();
    buzz('success');
    speak('What a lovely picture!');
    // bake the mirrored half into the saved record so it looks right on the shelf
    const baked = step.symmetry
      ? [...strokes, ...strokes.map((s) => ({ ...s, pts: s.pts.map((p) => ({ x: 100 - p.x, y: p.y })) }))]
      : strokes;
    onDone({ kind: 'drawing', base: step.guide, color: step.background, strokes: baked });
  };

  const renderStroke = (s: Stroke, key: string, mirrored = false) => (
    <polyline
      key={key}
      points={s.pts.map((p) => `${mirrored ? 100 - p.x : p.x},${p.y}`).join(' ')}
      fill="none"
      stroke={s.color}
      strokeWidth={s.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        ref={padRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
        className="relative rounded-[2rem] border-4 border-white overflow-hidden"
        style={{ width: SIZE, height: SIZE, background: step.background, touchAction: 'none', boxShadow: '0 8px 0 rgba(0,0,0,.12)' }}
      >
        {/* faint guide underneath */}
        {step.guide && step.guide !== 'blank' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <ItemIcon icon={step.guide} size={SIZE * 0.7} />
          </div>
        )}

        {/* mirror line */}
        {step.symmetry && (
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/15 pointer-events-none" />
        )}

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
          {strokes.map((s, i) => renderStroke(s, `s${i}`))}
          {step.symmetry && strokes.map((s, i) => renderStroke(s, `m${i}`, true))}
        </svg>

        {strokes.length === 0 && (
          <motion.p
            className="absolute bottom-3 left-0 right-0 text-center text-gray-400 font-bold text-sm pointer-events-none"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            👆 draw with your finger
          </motion.p>
        )}
      </div>

      {/* colours */}
      <div className="flex gap-2 flex-wrap justify-center max-w-sm">
        {step.colors.map((c) => (
          <motion.button
            key={c}
            onClick={() => {
              setColor(c);
              playClick();
              buzz('tick');
            }}
            className={`rounded-full border-4 ${color === c ? 'border-gray-800' : 'border-white'}`}
            style={{ width: 42, height: 42, background: c, boxShadow: '0 4px 0 rgba(0,0,0,.13)' }}
            whileTap={{ scale: 0.88 }}
            aria-label={`colour ${c}`}
          />
        ))}
      </div>

      {/* brush sizes */}
      <div className="flex gap-2 items-center">
        {WIDTHS.map((w) => (
          <motion.button
            key={w}
            onClick={() => {
              setWidth(w);
              playClick();
            }}
            className={`rounded-2xl bg-white flex items-center justify-center border-4 ${
              width === w ? 'border-purple-400' : 'border-white'
            }`}
            style={{ width: 46, height: 40, boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
            whileTap={{ scale: 0.9 }}
            aria-label={`brush size ${w}`}
          >
            <span className="rounded-full bg-gray-700 block" style={{ width: w + 4, height: w + 4 }} />
          </motion.button>
        ))}
        <motion.button
          onClick={undo}
          className="rounded-2xl px-3 py-2.5 bg-white text-gray-700 font-bold border-4 border-white"
          style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
          whileTap={{ scale: 0.9 }}
        >
          ↩️
        </motion.button>
        <motion.button
          onClick={clear}
          className="rounded-2xl px-3 py-2.5 bg-white text-gray-700 font-bold border-4 border-white"
          style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
          whileTap={{ scale: 0.9 }}
        >
          🗑️
        </motion.button>
      </div>

      <motion.button
        onClick={finish}
        disabled={strokes.length < step.minStrokes}
        className="rounded-2xl px-8 py-4 text-white font-bold border-4 border-white disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
          boxShadow: '0 6px 0 #4C1D95',
          fontFamily: "'Bubblegum One', cursive",
          fontSize: '1.05rem',
        }}
        whileTap={{ scale: 0.95, y: 3 }}
      >
        {strokes.length < step.minStrokes ? 'Keep drawing…' : '✅ All done!'}
      </motion.button>
    </div>
  );
};

export default DrawStage;
