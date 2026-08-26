import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { PourStep } from '../../data/cookingRecipes';
import { buzz, speak } from '../../utils/kidJuice';
import { playCorrect, playWrong } from '../../utils/sounds';

/**
 * POUR — hold to fill, let go at the line.
 *
 * This is where real measuring lives: the jug has a marked line, an amount
 * spoken out loud ("half a cup"), and overfilling spills (funny, retryable).
 *
 * Reused later by: watering plants (Garden), fuel (Garage), test tubes
 * (Science), paint pots (Art).
 */

interface Props {
  step: PourStep;
  onDone: () => void;
}

const JUG_H = 250;
const JUG_W = 150;
const FILL_RATE = 26; // % per second — slow enough to aim, fast enough not to bore

const PourStage: React.FC<Props> = ({ step, onDone }) => {
  const [level, setLevel] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [verdict, setVerdict] = useState<'none' | 'good' | 'under' | 'spill'>('none');

  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const levelRef = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    speak(`${step.say} We need ${step.amountLabel}.`);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [step]);

  const tick = (t: number) => {
    if (!last.current) last.current = t;
    const dt = (t - last.current) / 1000;
    last.current = t;

    levelRef.current = Math.min(112, levelRef.current + FILL_RATE * dt);
    setLevel(levelRef.current);

    if (levelRef.current >= 108) {
      spill();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (done.current || verdict !== 'none') return;
    setPouring(true);
    buzz('tick');
    last.current = 0;
    raf.current = requestAnimationFrame(tick);
  };

  const stopRaf = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    last.current = 0;
    setPouring(false);
  };

  const spill = () => {
    stopRaf();
    playWrong();
    buzz('oops');
    setVerdict('spill');
    speak('Whoops! It spilled everywhere. Let us try again.');
    setTimeout(() => {
      levelRef.current = 0;
      setLevel(0);
      setVerdict('none');
    }, 2000);
  };

  const release = () => {
    if (!pouring || done.current) return;
    stopRaf();

    const diff = Math.abs(levelRef.current - step.target);

    if (diff <= step.tolerance) {
      done.current = true;
      playCorrect();
      buzz('success');
      setVerdict('good');
      speak('Perfect! Right on the line.');
      setTimeout(onDone, 1300);
    } else if (levelRef.current < step.target) {
      setVerdict('under');
      speak('Not quite enough. Keep going!');
      buzz('tick');
      setTimeout(() => setVerdict('none'), 1400);
    } else {
      playWrong();
      buzz('oops');
      setVerdict('spill');
      speak('That is too much! Start again.');
      setTimeout(() => {
        levelRef.current = 0;
        setLevel(0);
        setVerdict('none');
      }, 1800);
    }
  };

  const inBand = Math.abs(level - step.target) <= step.tolerance;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* amount card */}
      <div
        className="bg-white/95 border-4 border-white rounded-2xl px-5 py-2 shadow font-bold text-gray-700"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
      >
        Fill to: <span className="text-orange-500">{step.amountLabel}</span>
      </div>

      {/* the jug */}
      <div className="relative" style={{ width: JUG_W, height: JUG_H }}>
        {/* pouring stream */}
        <AnimatePresence>
          {pouring && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{ top: -46, width: 12, height: 52, background: step.liquid.color, opacity: 0.9 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
            />
          )}
        </AnimatePresence>

        <div
          className="absolute inset-0 rounded-b-[2.2rem] rounded-t-xl bg-white/70 border-4 border-white overflow-hidden"
          style={{ boxShadow: 'inset 0 6px 20px rgba(0,0,0,.07), 0 8px 0 rgba(0,0,0,.08)' }}
        >
          {/* liquid */}
          <motion.div
            className="absolute left-0 right-0 bottom-0"
            style={{ background: step.liquid.color, height: `${Math.min(level, 100)}%` }}
            transition={{ type: 'tween', duration: 0.05 }}
          >
            <div
              className="absolute -top-2 left-0 right-0 h-4 opacity-70"
              style={{
                background: step.liquid.color,
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
            />
          </motion.div>

          {/* target band */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              bottom: `${step.target - step.tolerance}%`,
              height: `${step.tolerance * 2}%`,
              background: inBand ? 'rgba(34,197,94,.22)' : 'rgba(0,0,0,.05)',
            }}
          />
          {/* the line itself */}
          <div
            className="absolute left-0 right-0 pointer-events-none flex items-center"
            style={{ bottom: `${step.target}%` }}
          >
            <div className="h-1 flex-1" style={{ background: inBand ? '#16A34A' : '#9CA3AF' }} />
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: inBand ? '#16A34A' : '#9CA3AF' }}
            >
              LINE
            </span>
          </div>
        </div>
      </div>

      {/* the big pour button */}
      <motion.button
        onPointerDown={start}
        onPointerUp={release}
        onPointerLeave={() => pouring && release()}
        onPointerCancel={() => pouring && release()}
        disabled={verdict === 'good' || verdict === 'spill'}
        className="rounded-3xl px-8 py-5 text-white font-bold border-4 border-white flex items-center gap-3 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg,#F97316,#EF4444)',
          boxShadow: '0 8px 0 #C2410C, 0 12px 22px rgba(0,0,0,.18)',
          fontFamily: "'Bubblegum One', cursive",
          fontSize: '1.15rem',
          touchAction: 'none',
        }}
        animate={pouring ? { scale: 0.94, y: 5 } : { scale: 1, y: 0 }}
      >
        <ItemIcon icon={step.liquid.icon} size={30} label={step.liquid.name} />
        {pouring ? 'Pouring…' : 'Hold to pour'}
      </motion.button>

      {/* feedback */}
      <div className="h-9 flex items-center">
        <AnimatePresence>
          {verdict !== 'none' && (
            <motion.div
              key={verdict}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`px-5 py-1.5 rounded-2xl font-bold border-4 ${
                verdict === 'good'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : verdict === 'under'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-yellow-100 border-yellow-300 text-yellow-800'
              }`}
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              {verdict === 'good' && '🎉 Right on the line!'}
              {verdict === 'under' && '👍 Nearly — a bit more!'}
              {verdict === 'spill' && '😄 Whoops, it spilled!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PourStage;
