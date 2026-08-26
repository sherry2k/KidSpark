import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { ScrubStep } from '../../data/cookingRecipes';
import { buzz, speak } from '../../utils/kidJuice';
import { playCorrect } from '../../utils/sounds';

/**
 * SCRUB — rub back and forth to clean.
 *
 * Dirt is drawn as blobs and each one literally disappears under the finger.
 * Effort producing a visible change is the entire point, and it is the single
 * most satisfying mechanic for 3-5s.
 *
 * Reused later by: washing the car (Garage), sanding wood (Builder), brushing
 * teeth and the 20-second handwash (Clinic).
 */

interface Props {
  step: ScrubStep;
  onDone: () => void;
}

const W = 260;
const H = 220;
const BLOBS = 14;

interface Blob {
  x: number;
  y: number;
  r: number;
  gone: boolean;
}

const ScrubStage: React.FC<Props> = ({ step, onDone }) => {
  const padRef = useRef<HTMLDivElement>(null);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const travelled = useRef(0);
  const lastBuzz = useRef(0);
  const finished = useRef(false);

  const [blobs, setBlobs] = useState<Blob[]>(() =>
    Array.from({ length: BLOBS }, (_, i) => ({
      // deterministic-ish spread so it never clumps in one corner
      x: 26 + ((i * 61) % (W - 60)),
      y: 26 + ((i * 43) % (H - 60)),
      r: 16 + ((i * 7) % 14),
      gone: false,
    }))
  );
  const [progress, setProgress] = useState(0);
  const [rubbing, setRubbing] = useState(false);

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const local = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent) => {
    if (finished.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    lastPt.current = local(e);
    setRubbing(true);
    buzz('tick');
  };

  const onMove = (e: React.PointerEvent) => {
    if (!rubbing || finished.current) return;
    const p = local(e);
    const prev = lastPt.current;
    lastPt.current = p;
    if (!prev) return;

    travelled.current += Math.hypot(p.x - prev.x, p.y - prev.y);
    const pr = Math.min(1, travelled.current / step.distance);
    setProgress(pr);

    // wipe any dirt under the finger
    setBlobs((bs) => {
      let changed = false;
      const next = bs.map((b) => {
        if (!b.gone && Math.hypot(b.x - p.x, b.y - p.y) < b.r + 26) {
          changed = true;
          return { ...b, gone: true };
        }
        return b;
      });
      return changed ? next : bs;
    });

    if (travelled.current - lastBuzz.current > 90) {
      lastBuzz.current = travelled.current;
      buzz('tick');
    }

    if (pr >= 1 && !finished.current) {
      finished.current = true;
      setRubbing(false);
      setBlobs((bs) => bs.map((b) => ({ ...b, gone: true })));
      playCorrect();
      buzz('success');
      speak('Sparkling clean! Great scrubbing.');
      setTimeout(onDone, 1200);
    }
  };

  const onUp = () => {
    setRubbing(false);
    lastPt.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        ref={padRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        className="relative rounded-[2rem] bg-white/95 border-4 border-white overflow-hidden"
        style={{ width: W, height: H, touchAction: 'none', boxShadow: '0 8px 0 rgba(0,0,0,.10)' }}
      >
        {/* soapy water backdrop appears as you go */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg,#DFF4FF,#B9E6FF)',
            opacity: progress * 0.8,
            transition: 'opacity .2s',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ rotate: rubbing ? [-3, 3, -3] : 0 }} transition={{ duration: 0.3, repeat: Infinity }}>
            <ItemIcon icon={progress >= 1 ? step.cleanIcon : step.dirtyIcon} size={104} label="item" />
          </motion.div>
        </div>

        {/* the dirt */}
        <svg width={W} height={H} className="absolute inset-0 pointer-events-none">
          {blobs.map((b, i) =>
            b.gone ? null : (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#8B6B45" opacity="0.55" />
            )
          )}
        </svg>

        {/* bubbles while rubbing */}
        {rubbing &&
          [0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/80 pointer-events-none"
              style={{ width: 12 + i * 4, height: 12 + i * 4, left: 30 + i * 55, bottom: 10 }}
              animate={{ y: [-4, -60], opacity: [0.9, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
      </div>

      {/* clean-o-meter */}
      <div className="w-64 h-5 rounded-full bg-white/70 border-4 border-white overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#38BDF8,#22C55E)', width: `${progress * 100}%` }}
        />
      </div>

      <p className="text-gray-600 font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
        {progress >= 1 ? '✨ Sparkling clean!' : '👆 Rub back and forth!'}
      </p>
    </div>
  );
};

export default ScrubStage;
