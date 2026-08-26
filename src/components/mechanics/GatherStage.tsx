import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { GatherStep, Ingredient } from '../../data/cookingRecipes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playCorrect, playWrong } from '../../utils/sounds';

/**
 * GATHER — drag ingredients into the bowl.
 *
 * Replaces "tap the tiles in a fixed order". Order does not matter here;
 * what matters is that the child physically moves the thing into the thing,
 * and the bowl visibly fills up.
 */

interface Props {
  step: GatherStep;
  onDone: () => void;
}

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const GatherStage: React.FC<Props> = ({ step, onDone }) => {
  const vesselRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState<Ingredient[]>([]);
  const [quip, setQuip] = useState<string | null>(null);
  const [shakeIcon, setShakeIcon] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const doneRef = useRef(false);

  const tray = useMemo(() => shuffle([...step.need, ...step.decoys]), [step]);

  // Speak the instruction when the step opens.
  useEffect(() => {
    speak(step.say);
  }, [step]);

  // Nudge after 7 seconds of nothing happening.
  useEffect(() => {
    setHint(false);
    const t = setTimeout(() => setHint(true), 7000);
    return () => clearTimeout(t);
  }, [added.length, step]);

  const isAdded = (ing: Ingredient) => added.some((a) => a.icon === ing.icon);

  const overVessel = (x: number, y: number) => {
    const r = vesselRef.current?.getBoundingClientRect();
    if (!r) return false;
    const pad = 28; // generous — small fingers, small screens
    return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
  };

  const handleDrop = (ing: Ingredient, x: number, y: number) => {
    if (doneRef.current) return;
    if (!overVessel(x, y)) return;

    const needed = step.need.some((n) => n.icon === ing.icon);

    if (needed && !isAdded(ing)) {
      playCorrect();
      buzz('soft');
      speak(ing.name);
      const next = [...added, ing];
      setAdded(next);

      if (next.length === step.need.length) {
        doneRef.current = true;
        setTimeout(() => {
          speak('All in! Well done.');
          onDone();
        }, 800);
      }
    } else if (!needed) {
      playWrong();
      buzz('oops');
      const q = step.decoyQuip || 'That does not go in there!';
      setQuip(q);
      speak(q);
      setShakeIcon(ing.icon);
      setTimeout(() => setShakeIcon(null), 600);
      setTimeout(() => setQuip(null), 2200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ---------------- the vessel ---------------- */}
      <motion.div
        ref={vesselRef}
        className="relative rounded-[2rem] bg-white/95 border-4 border-dashed border-orange-300 flex items-center justify-center"
        style={{ width: 240, height: 190, boxShadow: 'inset 0 6px 18px rgba(0,0,0,.06)' }}
        animate={{ scale: added.length ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <ItemIcon icon={step.vessel.icon} size={110} label={step.vessel.label} />
        </motion.div>

        {/* things already in the bowl, tucked around the rim */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {added.map((ing, i) => {
              const angle = (i / Math.max(step.need.length, 1)) * Math.PI * 2 - Math.PI / 2;
              return (
                <motion.div
                  key={ing.icon}
                  className="absolute left-1/2 top-1/2"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: Math.cos(angle) * 62 - 20,
                    y: Math.sin(angle) * 46 - 20,
                  }}
                  transition={POP}
                >
                  <ItemIcon icon={ing.icon} size={40} label={ing.name} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* counter */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full border-4 border-white shadow"
          style={{ fontFamily: "'Bubblegum One', cursive" }}
        >
          {added.length} / {step.need.length}
        </div>
      </motion.div>

      {/* ---------------- the quip ---------------- */}
      <div className="h-8 flex items-center">
        <AnimatePresence>
          {quip && (
            <motion.div
              key={quip}
              initial={{ scale: 0, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={POP}
              className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-1 rounded-2xl text-sm"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              😄 {quip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- the tray ---------------- */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full max-w-md">
        {tray.map((ing) => {
          const used = isAdded(ing);
          const nudge = hint && !used && step.need.some((n) => n.icon === ing.icon);

          return (
            <motion.div
              key={ing.icon}
              drag={!used}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.14}
              onDragStart={() => {
                buzz('tick');
                setHint(false);
              }}
              onDragEnd={(_, info) => handleDrop(ing, info.point.x, info.point.y)}
              whileDrag={{ scale: 1.28, zIndex: 60, cursor: 'grabbing' }}
              animate={
                shakeIcon === ing.icon
                  ? { x: [-6, 6, -6, 6, 0] }
                  : nudge
                  ? { scale: [1, 1.12, 1], y: [0, -6, 0] }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={
                nudge ? { duration: 1, repeat: Infinity } : { duration: 0.35 }
              }
              className={`aspect-square rounded-2xl flex items-center justify-center border-4 bg-white touch-none ${
                used ? 'opacity-25 border-gray-200' : 'border-white cursor-grab'
              }`}
              style={{
                boxShadow: used ? 'none' : '0 6px 0 rgba(0,0,0,.13)',
                minHeight: 74,
                touchAction: 'none',
              }}
              aria-label={ing.name}
            >
              <ItemIcon icon={ing.icon} size={40} label={ing.name} />
            </motion.div>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm font-semibold">👆 Drag them into the {step.vessel.label}</p>
    </div>
  );
};

export default GatherStage;
