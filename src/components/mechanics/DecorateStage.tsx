import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { DecorateStep } from '../../data/cookingRecipes';
import { Sticker } from '../../utils/keepsakes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playClick, playCorrect } from '../../utils/sounds';

/**
 * DECORATE — the free-play step, and the one that produces the keepsake.
 *
 * No wrong answers, no timer, no score. Pick a frosting, tap toppings onto
 * the cake, and what comes out is THEIRS. This is the bit they'll show a
 * grown-up, and the reason they open the app again tomorrow.
 */

/* ------------------------------------------------------------------ */
/* Shared renderer — also used by the My Stuff shelf                   */
/* ------------------------------------------------------------------ */

export const DecoratedItem: React.FC<{
  base: string;
  color: string;
  stickers: Sticker[];
  size?: number;
}> = ({ base, color, stickers, size = 220 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    {/* frosting puddle behind the item */}
    <div
      className="absolute left-1/2 top-1/2 rounded-[45%]"
      style={{
        width: size * 0.78,
        height: size * 0.6,
        background: color,
        transform: 'translate(-50%,-42%)',
        filter: 'blur(1px)',
        opacity: 0.92,
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <ItemIcon icon={base} size={size * 0.62} label="your creation" />
    </div>
    {stickers.map((s, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          transform: `translate(-50%,-50%) rotate(${s.rot}deg) scale(${s.scale})`,
        }}
      >
        <ItemIcon icon={s.icon} size={size * 0.16} />
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* The stage                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  step: DecorateStep;
  onDone: (deco: { base: string; color: string; stickers: Sticker[] }) => void;
}

const CANVAS = 260;

const DecorateStage: React.FC<Props> = ({ step, onDone }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(step.frostings[0].color);
  const [picked, setPicked] = useState(step.toppings[0].icon);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [pop, setPop] = useState<{ x: number; y: number; k: number } | null>(null);

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const place = (e: React.MouseEvent | React.TouchEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const pt =
      'touches' in e && e.touches.length
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };

    const x = ((pt.x - r.left) / r.width) * 100;
    const y = ((pt.y - r.top) / r.height) * 100;
    if (x < 2 || x > 98 || y < 2 || y > 98) return;

    // a bit of natural scatter so 20 stickers don't look stamped
    const jitter = stickers.length;
    setStickers((s) => [
      ...s,
      { icon: picked, x, y, rot: ((jitter * 37) % 40) - 20, scale: 0.92 + ((jitter * 13) % 20) / 100 },
    ]);
    setPop({ x, y, k: Date.now() });
    playClick();
    buzz('tick');
  };

  const undo = () => {
    if (!stickers.length) return;
    setStickers((s) => s.slice(0, -1));
    playClick();
    buzz('tick');
  };

  const finish = () => {
    playCorrect();
    buzz('success');
    speak('Beautiful! You made that all by yourself.');
    onDone({ base: step.base, color, stickers });
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full max-w-md">
      {/* canvas */}
      <div
        ref={canvasRef}
        onClick={place}
        className="relative rounded-[2rem] bg-white/95 border-4 border-white cursor-pointer"
        style={{ width: CANVAS, height: CANVAS, boxShadow: '0 8px 0 rgba(0,0,0,.10)', touchAction: 'manipulation' }}
      >
        <DecoratedItem base={step.base} color={color} stickers={stickers} size={CANVAS} />

        <AnimatePresence>
          {pop && (
            <motion.div
              key={pop.k}
              className="absolute pointer-events-none rounded-full border-4 border-white"
              style={{ left: `${pop.x}%`, top: `${pop.y}%`, width: 10, height: 10, translate: '-50% -50%' }}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              onAnimationComplete={() => setPop(null)}
            />
          )}
        </AnimatePresence>

        {stickers.length === 0 && (
          <motion.p
            className="absolute bottom-3 left-0 right-0 text-center text-gray-400 font-bold text-sm"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            👆 tap to add
          </motion.p>
        )}
      </div>

      {/* frostings */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Frosting</p>
        <div className="flex gap-2 flex-wrap">
          {step.frostings.map((f) => (
            <motion.button
              key={f.color}
              onClick={() => {
                setColor(f.color);
                playClick();
                buzz('tick');
                speak(f.name);
              }}
              className={`rounded-full border-4 ${color === f.color ? 'border-gray-800' : 'border-white'}`}
              style={{ width: 46, height: 46, background: f.color, boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
              whileTap={{ scale: 0.88 }}
              transition={POP}
              aria-label={f.name}
            />
          ))}
        </div>
      </div>

      {/* toppings */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Toppings</p>
        <div className="flex gap-2 flex-wrap">
          {step.toppings.map((t) => (
            <motion.button
              key={t.icon}
              onClick={() => {
                setPicked(t.icon);
                playClick();
                buzz('tick');
                speak(t.name);
              }}
              className={`rounded-2xl border-4 bg-white flex items-center justify-center ${
                picked === t.icon ? 'border-orange-400' : 'border-white'
              }`}
              style={{ width: 52, height: 52, boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}
              whileTap={{ scale: 0.88 }}
              transition={POP}
              aria-label={t.name}
            >
              <ItemIcon icon={t.icon} size={28} label={t.name} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-3 mt-1">
        <motion.button
          onClick={undo}
          disabled={!stickers.length}
          className="rounded-2xl px-5 py-3 bg-white text-gray-700 font-bold border-4 border-white disabled:opacity-40"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
          whileTap={{ scale: 0.94, y: 3 }}
        >
          ↩️ Undo
        </motion.button>
        <motion.button
          onClick={finish}
          className="rounded-2xl px-7 py-3 text-white font-bold border-4 border-white"
          style={{
            background: 'linear-gradient(135deg,#22C55E,#0E9F6E)',
            boxShadow: '0 5px 0 #047857',
            fontFamily: "'Bubblegum One', cursive",
            fontSize: '1.05rem',
          }}
          whileTap={{ scale: 0.94, y: 3 }}
        >
          ✅ All done!
        </motion.button>
      </div>
    </div>
  );
};

export default DecorateStage;
