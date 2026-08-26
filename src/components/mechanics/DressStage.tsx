import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { DressStep } from '../../data/activityTypes';
import { Layer } from '../../utils/keepsakes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playClick, playCorrect } from '../../utils/sounds';

/**
 * DRESS — layered free build.
 *
 * The old Dress Up had one correct order of four taps. This has no correct
 * answer at all: any combination is valid, it stays on the character, and it
 * saves to the lookbook.
 *
 * Challenge mode ("dress for the rain") gives it a goal without giving it a
 * single answer — several outfits satisfy it, which is the whole difference
 * between a puzzle and a toy.
 */

interface Props {
  step: DressStep;
  onDone: (payload: { kind: 'dress'; base: string; color: string; layers: Layer[] }) => void;
}

const DressStage: React.FC<Props> = ({ step, onDone }) => {
  const [slotIndex, setSlotIndex] = useState(0);
  const [worn, setWorn] = useState<Record<string, { icon: string; name: string; tags?: string[] }>>({});
  const [cheer, setCheer] = useState<string | null>(null);

  const slot = step.slots[slotIndex];

  useEffect(() => {
    speak(step.challenge ? `${step.say} ${step.challenge.prompt}` : step.say);
  }, [step]);

  const wear = (opt: { icon: string; name: string; tags?: string[] }) => {
    playClick();
    buzz('tick');
    speak(opt.name);
    setWorn((w) => ({ ...w, [slot.id]: w[slot.id]?.icon === opt.icon ? undefined : opt } as typeof w));
  };

  const layers: Layer[] = step.slots
    .filter((s) => worn[s.id])
    .map((s) => ({ slot: s.id, icon: worn[s.id]!.icon, y: s.y, size: s.size }));

  const tagHits = step.challenge
    ? Object.values(worn).filter((o) => o?.tags?.includes(step.challenge!.requireTag)).length
    : 0;
  const challengeMet = !step.challenge || tagHits >= 2;
  const wornCount = Object.values(worn).filter(Boolean).length;

  const finish = () => {
    if (step.challenge && !challengeMet) {
      speak(`Not quite ready. ${step.challenge.prompt}`);
      buzz('oops');
      setCheer(step.challenge.prompt);
      window.setTimeout(() => setCheer(null), 2200);
      return;
    }
    playCorrect();
    buzz('success');
    speak(step.challenge ? step.challenge.rewardLine : 'What a great look!');
    onDone({ kind: 'dress', base: step.character, color: step.background, layers });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* the brief */}
      {step.challenge && (
        <div
          className={`rounded-2xl px-4 py-2 border-4 font-bold text-sm text-center ${
            challengeMet ? 'bg-green-100 border-green-300 text-green-700' : 'bg-yellow-100 border-yellow-300 text-yellow-800'
          }`}
          style={{ fontFamily: "'Bubblegum One', cursive" }}
        >
          {challengeMet ? '✅ Perfect for it!' : `🎯 ${step.challenge.prompt}`}
        </div>
      )}

      {/* the character */}
      <div
        className="relative rounded-[2rem] border-4 border-white overflow-hidden"
        style={{ width: 240, height: 260, background: step.background, boxShadow: '0 8px 0 rgba(0,0,0,.12)' }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ItemIcon icon={step.character} size={120} label="your character" />
        </motion.div>

        <AnimatePresence>
          {layers.map((l) => (
            <motion.div
              key={l.slot + l.icon}
              className="absolute left-1/2"
              style={{ top: `${l.y}%`, translate: '-50% -50%' }}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={POP}
            >
              <ItemIcon icon={l.icon} size={240 * l.size} label={l.slot} />
            </motion.div>
          ))}
        </AnimatePresence>

        {wornCount === 0 && (
          <p className="absolute bottom-3 left-0 right-0 text-center text-white/90 text-xs font-bold">
            pick something below ↓
          </p>
        )}
      </div>

      {/* slot tabs */}
      <div className="flex gap-2 flex-wrap justify-center">
        {step.slots.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => {
              setSlotIndex(i);
              playClick();
              buzz('tick');
            }}
            className={`rounded-2xl px-4 py-2 font-bold text-xs border-4 ${
              i === slotIndex ? 'bg-pink-500 text-white border-white' : 'bg-white text-gray-600 border-white'
            }`}
            style={{ boxShadow: '0 4px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
            whileTap={{ scale: 0.94, y: 2 }}
          >
            {s.label}
            {worn[s.id] && ' ✓'}
          </motion.button>
        ))}
      </div>

      {/* options for the active slot */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full max-w-md">
        {slot.options.map((o) => {
          const on = worn[slot.id]?.icon === o.icon;
          return (
            <motion.button
              key={o.icon + o.name}
              onClick={() => wear(o)}
              className={`aspect-square rounded-2xl flex items-center justify-center border-4 bg-white ${
                on ? 'border-pink-400' : 'border-white'
              }`}
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', minHeight: 66 }}
              whileTap={{ scale: 0.9, y: 3 }}
              aria-label={o.name}
            >
              <ItemIcon icon={o.icon} size={34} label={o.name} />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {cheer && (
          <motion.p
            className="text-yellow-700 font-bold text-sm text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            {cheer}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        onClick={finish}
        disabled={wornCount === 0}
        className="rounded-2xl px-8 py-4 text-white font-bold border-4 border-white disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg,#EC4899,#BE185D)',
          boxShadow: '0 6px 0 #9D174D',
          fontFamily: "'Bubblegum One', cursive",
          fontSize: '1.05rem',
        }}
        whileTap={{ scale: 0.95, y: 3 }}
      >
        ✨ Show the look!
      </motion.button>
    </div>
  );
};

export default DressStage;
