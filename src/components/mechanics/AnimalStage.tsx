import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { AnimalStep } from '../../data/activityTypes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playCorrect, playWrong } from '../../utils/sounds';

/**
 * ANIMALS — every animal wants a different thing.
 *
 * Each one shows what it wants in a thought bubble, so a pre-reader can play
 * it from pictures alone. Drag the right thing to the right animal; the wrong
 * one gets a shake and a noise, never a red cross.
 */

interface Props {
  step: AnimalStep;
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

const AnimalStage: React.FC<Props> = ({ step, onDone }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [fed, setFed] = useState<string[]>([]);
  const [wrongOn, setWrongOn] = useState<number | null>(null);
  const [shakeIcon, setShakeIcon] = useState<string | null>(null);
  const done = useRef(false);

  const tray = useMemo(
    () => shuffle([...step.animals.map((a) => ({ icon: a.wantIcon, name: a.wants })), ...step.extras]),
    [step]
  );

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const drop = (icon: string, x: number, y: number) => {
    if (done.current) return;

    const hitIndex = refs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const pad = 24;
      return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    });
    if (hitIndex < 0) return;

    const animal = step.animals[hitIndex];
    if (fed.includes(animal.name)) return;

    if (animal.wantIcon === icon) {
      playCorrect();
      buzz('soft');
      speak(`${animal.sound} Thank you!`);
      const next = [...fed, animal.name];
      setFed(next);
      if (next.length === step.animals.length) {
        done.current = true;
        setTimeout(() => {
          speak('Every animal is happy. Good job!');
          onDone();
        }, 900);
      }
    } else {
      playWrong();
      buzz('oops');
      speak(`The ${animal.name} does not want that.`);
      setWrongOn(hitIndex);
      setShakeIcon(icon);
      setTimeout(() => {
        setWrongOn(null);
        setShakeIcon(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* the animals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-md">
        {step.animals.map((a, i) => {
          const happy = fed.includes(a.name);
          return (
            <motion.div
              key={a.name}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={`relative rounded-2xl border-4 flex flex-col items-center justify-center p-2 ${
                happy ? 'bg-green-50 border-green-300' : 'bg-white/95 border-white'
              }`}
              style={{ minHeight: 112, boxShadow: happy ? '0 5px 0 #16A34A' : '0 5px 0 rgba(0,0,0,.12)' }}
              animate={wrongOn === i ? { x: [-6, 6, -6, 6, 0] } : happy ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* thought bubble — what it wants, in pictures */}
              {!happy && (
                <motion.div
                  className="absolute -top-2 -right-1 bg-white border-2 border-gray-200 rounded-full px-1.5 py-1 flex items-center"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                >
                  <ItemIcon icon={a.wantIcon} size={20} label={a.wants} />
                </motion.div>
              )}
              {happy && <div className="absolute -top-2 -right-1 text-xl">💚</div>}

              <motion.div animate={happy ? { rotate: [0, -8, 8, 0] } : { y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ItemIcon icon={a.icon} size={48} label={a.name} />
              </motion.div>
              <span className="text-[11px] font-bold text-gray-600 mt-1 capitalize">{a.name}</span>
            </motion.div>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm font-semibold">👆 Drag each animal what it wants</p>

      {/* tray */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full max-w-md">
        {tray.map((item, i) => {
          const used = step.animals.some((a) => a.wantIcon === item.icon && fed.includes(a.name));
          return (
            <motion.div
              key={`${item.icon}-${i}`}
              drag={!used}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.14}
              onDragStart={() => buzz('tick')}
              onDragEnd={(_, info) => drop(item.icon, info.point.x, info.point.y)}
              whileDrag={{ scale: 1.28, zIndex: 60 }}
              animate={shakeIcon === item.icon ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
              className={`aspect-square rounded-2xl flex items-center justify-center border-4 bg-white ${
                used ? 'opacity-25 border-gray-200' : 'border-white'
              }`}
              style={{ boxShadow: used ? 'none' : '0 6px 0 rgba(0,0,0,.13)', minHeight: 70, touchAction: 'none' }}
              aria-label={item.name}
            >
              <ItemIcon icon={item.icon} size={36} label={item.name} />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {fed.length === step.animals.length && (
          <motion.p
            className="text-green-600 font-bold text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={POP}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            🎉 Every animal is happy!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimalStage;
