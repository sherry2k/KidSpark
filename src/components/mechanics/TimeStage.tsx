import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { TimeStep } from '../../data/cookingRecipes';
import { buzz, speak } from '../../utils/kidJuice';
import { playCorrect, playWrong } from '../../utils/sounds';

/**
 * TIME — stop the sweeping marker in the green zone.
 *
 * One component, an instant difficulty dial: widen the zone and slow the
 * sweep for 3-5s, narrow and speed it up for 9+. No content changes needed.
 *
 * Reused later by: hammering a nail (Builder), a perfect flip, catching the
 * bus (anywhere you want a beat of tension).
 */

interface Props {
  step: TimeStep;
  onDone: () => void;
  /** widen the green zone for younger players — pass 1.6 for 3-5 */
  forgiveness?: number;
}

const TimeStage: React.FC<Props> = ({ step, onDone, forgiveness = 1 }) => {
  const zoneWidth = Math.min(step.zoneWidth * forgiveness, 60);
  const zoneStart = Math.max(0, Math.min(step.zoneStart, 100 - zoneWidth));

  const [pos, setPos] = useState(0);
  const [state, setState] = useState<'running' | 'win' | 'miss'>('running');
  const [attempts, setAttempts] = useState(0);

  const posRef = useRef(0);
  const dir = useRef(1);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const stopped = useRef(false);

  useEffect(() => {
    speak(step.say);
  }, [step]);

  useEffect(() => {
    const loop = (t: number) => {
      if (stopped.current) return;
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;

      posRef.current += dir.current * step.speed * dt;
      if (posRef.current >= 100) {
        posRef.current = 100;
        dir.current = -1;
      }
      if (posRef.current <= 0) {
        posRef.current = 0;
        dir.current = 1;
      }
      setPos(posRef.current);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [step.speed, attempts]);

  const halt = () => {
    stopped.current = true;
    if (raf.current) cancelAnimationFrame(raf.current);
  };

  const restart = () => {
    stopped.current = false;
    last.current = 0;
    posRef.current = 0;
    dir.current = 1;
    setPos(0);
    setState('running');
    setAttempts((a) => a + 1);
  };

  const tap = () => {
    if (state !== 'running') return;
    halt();

    const hit = posRef.current >= zoneStart && posRef.current <= zoneStart + zoneWidth;

    if (hit) {
      setState('win');
      playCorrect();
      buzz('success');
      speak('Perfect timing!');
      setTimeout(onDone, 1300);
    } else {
      setState('miss');
      playWrong();
      buzz('oops');
      speak(step.lateQuip);
      setTimeout(restart, 1900);
    }
  };

  const cooking = state === 'running';

  return (
    <div className="flex flex-col items-center gap-5 select-none w-full max-w-md">
      {/* the thing being cooked, browning as the bar sweeps */}
      <motion.div
        className="relative rounded-[2rem] bg-white/95 border-4 border-white flex items-center justify-center"
        style={{ width: 210, height: 170, boxShadow: '0 8px 0 rgba(0,0,0,.10)' }}
        animate={state === 'win' ? { scale: [1, 1.14, 1] } : {}}
      >
        {/* oven glow */}
        <motion.div
          className="absolute inset-3 rounded-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,170,60,.45), transparent 70%)' }}
          animate={{ opacity: cooking ? [0.35, 0.75, 0.35] : 0.2 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.div
          style={{
            // it visibly browns as time passes — the cue kids actually read
            filter: `sepia(${Math.min(pos, 100) * 0.7}%) saturate(${100 + pos * 0.6}%) brightness(${
              100 - Math.max(0, pos - 82) * 0.9
            }%)`,
          }}
          animate={{ y: cooking ? [0, -5, 0] : 0 }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ItemIcon icon={step.sceneIcon} size={96} label="cooking" />
        </motion.div>

        {state === 'win' && (
          <motion.div
            className="absolute -top-3 -right-2 text-4xl"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            ⭐
          </motion.div>
        )}
      </motion.div>

      {/* the bar */}
      <div
        className="relative w-full h-14 rounded-full bg-white/95 border-4 border-white overflow-hidden"
        style={{ boxShadow: 'inset 0 3px 10px rgba(0,0,0,.08)' }}
      >
        {/* raw → perfect → burnt gradient, so the zone MEANS something */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg,#FDE68A 0%,#FCD34D 40%,#F59E0B 70%,#7C2D12 100%)',
            opacity: 0.35,
          }}
        />
        {/* green zone */}
        <div
          className="absolute top-0 bottom-0 border-x-4 border-green-500"
          style={{
            left: `${zoneStart}%`,
            width: `${zoneWidth}%`,
            background: 'rgba(34,197,94,.35)',
          }}
        />
        {/* marker */}
        <motion.div
          className="absolute top-0 bottom-0 w-2 bg-gray-900 rounded-full"
          style={{ left: `calc(${pos}% - 4px)` }}
          animate={state === 'miss' ? { scaleY: [1, 0.7, 1] } : {}}
        />
      </div>

      <motion.button
        onClick={tap}
        disabled={!cooking}
        className="rounded-3xl px-10 py-5 text-white font-bold border-4 border-white disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg,#22C55E,#0E9F6E)',
          boxShadow: '0 8px 0 #047857, 0 12px 22px rgba(0,0,0,.18)',
          fontFamily: "'Bubblegum One', cursive",
          fontSize: '1.2rem',
        }}
        whileTap={{ scale: 0.94, y: 5 }}
        animate={cooking ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {step.actionLabel}
      </motion.button>

      <div className="h-9 flex items-center">
        <AnimatePresence>
          {state !== 'running' && (
            <motion.div
              key={state}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`px-5 py-1.5 rounded-2xl font-bold border-4 ${
                state === 'win'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-yellow-100 border-yellow-300 text-yellow-800'
              }`}
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              {state === 'win' ? '🎉 Perfect timing!' : `😄 ${step.lateQuip}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimeStage;
