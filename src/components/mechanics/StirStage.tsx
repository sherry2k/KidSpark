import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { StirStep } from '../../data/cookingRecipes';
import { buzz, speak } from '../../utils/kidJuice';
import { playCorrect } from '../../utils/sounds';

/**
 * STIR — circle your finger to mix.
 *
 * The contents change colour and thicken as you go, the spoon follows your
 * finger, and a ring meter fills. Deliberately forgiving: any circular-ish
 * movement counts, because four-year-olds do not draw neat circles.
 *
 * Reused later by: paint mixing (Art), the cauldron (Science), screwing a
 * bolt (Builder), winding a crank (Engineering).
 */

interface Props {
  step: StirStep;
  onDone: () => void;
}

const SIZE = 240;
const R = 104;
const CIRC = 2 * Math.PI * R;

const mixColor = (from: string, to: string, t: number) => {
  const hex = (h: string) => {
    const s = h.replace('#', '');
    return [
      parseInt(s.slice(0, 2), 16),
      parseInt(s.slice(2, 4), 16),
      parseInt(s.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = hex(from);
  const [r2, g2, b2] = hex(to);
  const m = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`;
};

const StirStage: React.FC<Props> = ({ step, onDone }) => {
  const padRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number | null>(null);
  const travelled = useRef(0);
  const lastBuzz = useRef(0);
  const finished = useRef(false);

  const [progress, setProgress] = useState(0); // 0-1
  const [spoonAngle, setSpoonAngle] = useState(0);
  const [active, setActive] = useState(false);

  const goal = step.turns * Math.PI * 2;

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const angleAt = (clientX: number, clientY: number) => {
    const r = padRef.current!.getBoundingClientRect();
    return Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2));
  };

  const onDown = (e: React.PointerEvent) => {
    if (finished.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    lastAngle.current = angleAt(e.clientX, e.clientY);
    setActive(true);
    buzz('tick');
  };

  const onMove = (e: React.PointerEvent) => {
    if (!active || finished.current || lastAngle.current === null) return;

    const a = angleAt(e.clientX, e.clientY);
    let d = a - lastAngle.current;
    // wrap to -PI..PI so crossing the top doesn't jump a whole turn
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    lastAngle.current = a;

    setSpoonAngle((a * 180) / Math.PI + 90);
    travelled.current += Math.abs(d);

    const p = Math.min(1, travelled.current / goal);
    setProgress(p);

    // a tiny tick every ~quarter turn — this is what makes it feel physical
    if (travelled.current - lastBuzz.current > Math.PI / 2) {
      lastBuzz.current = travelled.current;
      buzz('tick');
    }

    if (p >= 1 && !finished.current) {
      finished.current = true;
      setActive(false);
      playCorrect();
      buzz('success');
      speak(`Look! It turned into ${step.becomes}.`);
      setTimeout(onDone, 1100);
    }
  };

  const onUp = () => {
    setActive(false);
    lastAngle.current = null;
  };

  const color = mixColor(step.fromColor, step.toColor, progress);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        ref={padRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        className="relative rounded-full bg-white/95 border-4 border-white flex items-center justify-center cursor-grab"
        style={{
          width: SIZE,
          height: SIZE,
          touchAction: 'none',
          boxShadow: '0 8px 0 rgba(0,0,0,.10), 0 12px 26px rgba(0,0,0,.12)',
        }}
      >
        {/* progress ring */}
        <svg width={SIZE} height={SIZE} className="absolute inset-0 -rotate-90 pointer-events-none">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(0,0,0,.07)" strokeWidth="12" />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            style={{ transition: 'stroke-dashoffset .08s linear' }}
          />
        </svg>

        {/* the mixture */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 152, height: 152, background: color }}
          animate={{ rotate: spoonAngle, scale: active ? 1.03 : 1 }}
          transition={{ type: 'tween', duration: 0.06 }}
        >
          {/* swirl marks so you can SEE it turning */}
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background:
                'repeating-conic-gradient(rgba(255,255,255,.55) 0deg 12deg, transparent 12deg 40deg)',
            }}
          />
        </motion.div>

        {/* spoon follows the finger */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ transformOrigin: '50% 50%' }}
          animate={{ rotate: spoonAngle }}
          transition={{ type: 'tween', duration: 0.06 }}
        >
          <div style={{ transform: 'translateY(-34px)' }}>
            <ItemIcon icon="🥄" size={54} label="spoon" />
          </div>
        </motion.div>

        {/* the bowl rim on top */}
        <div className="absolute -bottom-6 pointer-events-none">
          <ItemIcon icon={step.vesselIcon} size={64} label="bowl" />
        </div>
      </div>

      <motion.p
        className="text-gray-600 font-bold text-base mt-4"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
        animate={active ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        {progress >= 1 ? `✨ ${step.becomes}!` : '👆 Draw circles with your finger'}
      </motion.p>
    </div>
  );
};

export default StirStage;
