import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { SortStep } from '../../data/activityTypes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playCorrect, playWrong } from '../../utils/sounds';

/**
 * SORT — one item at a time, into the right bin.
 *
 * Deliberately not a timed conveyor yet: this version teaches the categories
 * first. Turning it into the speeding factory belt later is a matter of
 * animating the incoming item and adding a clock — the bins and hit-testing
 * are already here.
 */

interface Props {
  step: SortStep;
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

const SortStage: React.FC<Props> = ({ step, onDone }) => {
  const binRefs = useRef<(HTMLDivElement | null)[]>([]);
  const queue = useMemo(() => shuffle(step.items), [step]);
  const [index, setIndex] = useState(0);
  const [wrongBin, setWrongBin] = useState<number | null>(null);
  const [scored, setScored] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const done = useRef(false);

  const current = queue[index];

  useEffect(() => {
    speak(step.say);
  }, [step]);

  useEffect(() => {
    if (current) speak(current.name);
  }, [index, current]);

  const drop = (x: number, y: number) => {
    if (done.current || !current) return;

    const hit = binRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const pad = 26;
      return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    });
    if (hit < 0) return;

    const bin = step.bins[hit];
    if (bin.id === current.bin) {
      playCorrect();
      buzz('soft');
      setScored((s) => s + 1);
      setFlash(bin.label);
      window.setTimeout(() => setFlash(null), 900);

      if (index + 1 >= queue.length) {
        done.current = true;
        setTimeout(() => {
          speak('All sorted! Brilliant.');
          onDone();
        }, 800);
      } else {
        setIndex((i) => i + 1);
      }
    } else {
      playWrong();
      buzz('oops');
      speak(`Not the ${bin.label}. Try another bin!`);
      setWrongBin(hit);
      window.setTimeout(() => setWrongBin(null), 650);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* score */}
      <div
        className="bg-white/95 border-4 border-white rounded-2xl px-5 py-2 font-bold text-gray-700 tabular-nums"
        style={{ fontFamily: "'Bubblegum One', cursive", boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
      >
        {scored} / {queue.length} sorted
      </div>

      {/* the item to sort */}
      <div className="h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={`${current.icon}-${index}`}
              drag
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.15}
              onDragStart={() => buzz('tick')}
              onDragEnd={(_, info) => drop(info.point.x, info.point.y)}
              whileDrag={{ scale: 1.22, zIndex: 60 }}
              initial={{ scale: 0, y: -40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={POP}
              className="rounded-3xl bg-white border-4 border-white flex flex-col items-center justify-center px-5 py-3"
              style={{ boxShadow: '0 7px 0 rgba(0,0,0,.14)', touchAction: 'none', cursor: 'grab' }}
            >
              <ItemIcon icon={current.icon} size={56} label={current.name} />
              <span className="text-xs font-bold text-gray-600 mt-1">{current.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-gray-500 text-sm font-semibold -mt-1">👆 Drag it to the right bin</p>

      {/* bins */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-md">
        {step.bins.map((b, i) => (
          <motion.div
            key={b.id}
            ref={(el) => {
              binRefs.current[i] = el;
            }}
            className="rounded-2xl border-4 border-white flex flex-col items-center justify-center p-3"
            style={{ background: b.color, minHeight: 108, boxShadow: '0 6px 0 rgba(0,0,0,.16)' }}
            animate={wrongBin === i ? { x: [-6, 6, -6, 6, 0] } : flash === b.label ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <ItemIcon icon={b.icon} size={40} label={b.label} />
            <span
              className="text-white text-[11px] font-bold mt-1 text-center leading-tight"
              style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '1px 1px 0 rgba(0,0,0,.25)' }}
            >
              {b.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SortStage;
