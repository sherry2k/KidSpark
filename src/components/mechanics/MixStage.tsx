import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MixStep } from '../../data/activityTypes';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playClick, playCorrect, playComplete } from '../../utils/sounds';

/**
 * MIX — two colours in, a new one out, into a book with empty slots.
 *
 * Empty slots in a collection are the strongest pull in children's games:
 * a kid will hunt every one. The discoveries persist, so the book is still
 * half-full when they come back.
 */

const KEY = 'kidspark.discoveries.v1';

const loadFound = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
};

const saveFound = (list: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage blocked */
  }
};

interface Props {
  step: MixStep;
  onDone: (payload: { color: string }) => void;
}

const Pot: React.FC<{ color?: string; label: string }> = ({ color, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="rounded-full border-4 border-white flex items-center justify-center"
      style={{
        width: 74,
        height: 74,
        background: color || 'rgba(255,255,255,.7)',
        boxShadow: '0 5px 0 rgba(0,0,0,.14)',
      }}
    >
      {!color && <span className="text-2xl text-gray-300 font-bold">?</span>}
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</span>
  </div>
);

const MixStage: React.FC<Props> = ({ step, onDone }) => {
  const [a, setA] = useState<{ name: string; color: string } | null>(null);
  const [b, setB] = useState<{ name: string; color: string } | null>(null);
  const [result, setResult] = useState<{ name: string; color: string } | null>(null);
  const [mixing, setMixing] = useState(false);
  const [found, setFound] = useState<string[]>(() => loadFound());
  const [newThisRound, setNewThisRound] = useState(0);

  useEffect(() => {
    speak(step.say);
  }, [step]);

  const pick = (c: { name: string; color: string }) => {
    playClick();
    buzz('tick');
    speak(c.name);
    if (!a) setA(c);
    else if (!b) setB(c);
    else {
      setA(c);
      setB(null);
      setResult(null);
    }
  };

  const findDiscovery = () =>
    step.discoveries.find(
      (d) =>
        (d.a === a?.name && d.b === b?.name) || (d.b === a?.name && d.a === b?.name)
    );

  const mix = () => {
    if (!a || !b || mixing) return;
    setMixing(true);
    buzz('soft');

    window.setTimeout(() => {
      const d = findDiscovery();
      setMixing(false);

      if (!d) {
        playClick();
        setResult({ name: 'muddy brown', color: '#7A6046' });
        speak('Ooh, muddy brown! Try two different colours.');
        return;
      }

      setResult({ name: d.name, color: d.color });

      if (found.includes(d.name)) {
        playCorrect();
        speak(`${d.name} again!`);
      } else {
        playComplete();
        buzz('success');
        const next = [...found, d.name];
        setFound(next);
        saveFound(next);
        const n = newThisRound + 1;
        setNewThisRound(n);
        speak(`You discovered ${d.name}!`);

        if (n >= step.goal) {
          window.setTimeout(() => onDone({ color: d.color }), 1600);
        }
      }
    }, 850);
  };

  const reset = () => {
    setA(null);
    setB(null);
    setResult(null);
    playClick();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* the mixing bench */}
      <div className="flex items-center gap-3">
        <Pot color={a?.color} label="colour 1" />
        <span className="text-2xl font-bold text-gray-400">+</span>
        <Pot color={b?.color} label="colour 2" />
        <span className="text-2xl font-bold text-gray-400">=</span>
        <motion.div
          animate={mixing ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.85, ease: 'linear' }}
        >
          <Pot color={result?.color} label="new!" />
        </motion.div>
      </div>

      <AnimatePresence>
        {result && !mixing && (
          <motion.p
            key={result.name}
            className="font-bold text-lg capitalize"
            style={{ color: result.color, fontFamily: "'Bubblegum One', cursive", WebkitTextStroke: '0.6px rgba(0,0,0,.25)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={POP}
          >
            {found.includes(result.name) ? '✨' : '🎉 New!'} {result.name}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <motion.button
          onClick={mix}
          disabled={!a || !b || mixing}
          className="rounded-2xl px-7 py-3.5 text-white font-bold border-4 border-white disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
            boxShadow: '0 5px 0 #4C1D95',
            fontFamily: "'Bubblegum One', cursive",
          }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          🧪 Mix!
        </motion.button>
        <motion.button
          onClick={reset}
          className="rounded-2xl px-5 py-3.5 bg-white text-gray-700 font-bold border-4 border-white"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
          whileTap={{ scale: 0.95, y: 3 }}
        >
          ↩️
        </motion.button>
      </div>

      {/* palette */}
      <div className="flex gap-2 flex-wrap justify-center max-w-sm">
        {step.palette.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => pick(c)}
            className="rounded-full border-4 border-white"
            style={{ width: 48, height: 48, background: c.color, boxShadow: '0 4px 0 rgba(0,0,0,.14)' }}
            whileTap={{ scale: 0.88 }}
            aria-label={c.name}
          />
        ))}
      </div>

      {/* discovery book */}
      <div className="w-full max-w-sm bg-white/95 border-4 border-white rounded-3xl p-4" style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}>
        <p className="text-center font-bold text-gray-700 mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          📕 Colour Book · {found.length}/{step.discoveries.length}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {step.discoveries.map((d) => {
            const got = found.includes(d.name);
            return (
              <div key={d.name} className="flex flex-col items-center">
                <div
                  className="rounded-xl border-4 border-white flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: got ? d.color : '#EEF0F6',
                    boxShadow: 'inset 0 2px 5px rgba(0,0,0,.08)',
                  }}
                >
                  {!got && <span className="text-gray-300 font-bold">?</span>}
                </div>
                <span className="text-[8px] font-bold text-gray-500 mt-0.5 text-center leading-tight">
                  {got ? d.name : '???'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-500 font-semibold">
        Find {Math.max(0, step.goal - newThisRound)} more new colour{step.goal - newThisRound === 1 ? '' : 's'} to finish!
      </p>
    </div>
  );
};

export default MixStage;
