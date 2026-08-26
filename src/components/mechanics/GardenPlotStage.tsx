import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './ItemIcon';
import { GardenStep } from '../../data/activityTypes';
import {
  Plot,
  READY,
  settleGarden,
  plantSeed,
  waterPlot,
  harvestPlot,
  timeUntilGrow,
  friendlyWait,
  totalHarvested,
} from '../../utils/gardenStore';
import { buzz, speak, POP } from '../../utils/kidJuice';
import { playClick, playCorrect, playComplete } from '../../utils/sounds';

/**
 * GARDEN — plant it today, it has grown by tomorrow.
 *
 * The only screen in the app that is different when you come back, and the
 * reason to come back at all. Everything else can be finished in one sitting;
 * this one cannot, on purpose.
 */

interface Props {
  step: GardenStep;
  onDone: () => void;
}

const STAGE_LABEL = ['a seed', 'a little sprout', 'growing nicely', 'ready to pick!'];

const GardenPlotStage: React.FC<Props> = ({ step, onDone }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [grewCount, setGrewCount] = useState(0);
  const [picking, setPicking] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pouring, setPouring] = useState<number | null>(null);
  const [basket, setBasket] = useState(0);

  useEffect(() => {
    const { plots: p, grewCount: g } = settleGarden();
    setPlots(p);
    setGrewCount(g);
    setBasket(totalHarvested());

    if (g > 0) {
      playComplete();
      buzz('success');
      speak(`Look! ${g} of your plants grew while you were away.`);
    } else {
      speak(step.say);
    }
  }, [step]);

  const say = (msg: string) => {
    setToast(msg);
    speak(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const seedFor = (id: string | null) => step.seeds.find((s) => s.id === id) || step.seeds[0];

  const iconFor = (p: Plot) => {
    if (!p.seedId) return null;
    const s = seedFor(p.seedId);
    if (p.stage === 0) return '🌱';
    if (p.stage === 1) return s.sprout;
    if (p.stage === 2) return s.sprout;
    return s.grown;
  };

  const doPlant = (index: number, seedId: string) => {
    setPlots(plantSeed(index, seedId));
    setPicking(null);
    playCorrect();
    buzz('soft');
    const s = seedFor(seedId);
    say(`You planted ${s.name}! Give it a drink.`);
  };

  const doWater = (index: number) => {
    setPouring(index);
    playCorrect();
    buzz('soft');
    setTimeout(() => setPouring(null), 900);

    const next = waterPlot(index);
    setPlots(next);
    const p = next[index];
    const wait = timeUntilGrow(p);
    say(wait === null ? 'All watered!' : `Watered! It will grow ${friendlyWait(wait)}.`);
  };

  const doHarvest = (index: number) => {
    const s = seedFor(plots[index].seedId);
    setPlots(harvestPlot(index));
    setBasket((b) => b + 1);
    playComplete();
    buzz('success');
    say(`You picked ${s.name}! Into the basket.`);
  };

  const anyPlanted = plots.some((p) => p.seedId);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* what changed since last visit */}
      <AnimatePresence>
        {grewCount > 0 && (
          <motion.div
            className="w-full rounded-2xl px-4 py-3 bg-green-100 border-4 border-green-300 flex items-center gap-3"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ boxShadow: '0 5px 0 #16A34A' }}
          >
            <motion.span className="text-3xl" animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
              🌱
            </motion.span>
            <p className="text-green-800 font-bold text-sm leading-tight" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              {grewCount} plant{grewCount === 1 ? '' : 's'} grew while you were away!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* basket */}
      <div className="flex items-center gap-2 bg-white/95 border-4 border-white rounded-2xl px-4 py-2" style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}>
        <ItemIcon icon="🧺" size={26} label="basket" />
        <span className="font-bold text-gray-700 tabular-nums" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          {basket} picked
        </span>
      </div>

      {/* the plots */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm">
        {plots.map((p) => {
          const wait = timeUntilGrow(p);
          const ready = p.stage >= READY;
          const needsWater = !!p.seedId && !ready && !p.wateredThisStage;
          const icon = iconFor(p);

          return (
            <motion.div
              key={p.index}
              className="relative rounded-2xl border-4 border-white overflow-hidden flex flex-col items-center justify-end"
              style={{
                background: p.seedId ? 'linear-gradient(180deg,#CDEFB0,#8B5E3C)' : 'linear-gradient(180deg,#E7D3B8,#8B5E3C)',
                minHeight: 116,
                boxShadow: ready ? '0 6px 0 #16A34A' : '0 6px 0 rgba(0,0,0,.16)',
              }}
              animate={ready ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 1.4, repeat: ready ? Infinity : 0 }}
            >
              {/* empty plot */}
              {!p.seedId && (
                <button
                  onClick={() => {
                    playClick();
                    buzz('tick');
                    setPicking(p.index);
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-white/90"
                  aria-label="Plant something here"
                >
                  <span className="text-3xl font-bold">＋</span>
                  <span className="text-[10px] font-bold">plant</span>
                </button>
              )}

              {/* growing plant */}
              {p.seedId && (
                <>
                  <motion.div
                    className="flex-1 flex items-end justify-center pb-1"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    <ItemIcon icon={icon || '🌱'} size={p.stage >= 2 ? 46 : 34} label={STAGE_LABEL[p.stage]} />
                  </motion.div>

                  {/* water droplets */}
                  <AnimatePresence>
                    {pouring === p.index &&
                      [0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="absolute text-lg"
                          style={{ left: `${28 + d * 20}%`, top: 6 }}
                          initial={{ y: 0, opacity: 1 }}
                          animate={{ y: 60, opacity: 0 }}
                          transition={{ duration: 0.7, delay: d * 0.1 }}
                        >
                          💧
                        </motion.span>
                      ))}
                  </AnimatePresence>

                  {/* action strip */}
                  {ready ? (
                    <button
                      onClick={() => doHarvest(p.index)}
                      className="w-full bg-green-500 text-white text-[11px] font-bold py-1.5"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      🧺 Pick it!
                    </button>
                  ) : needsWater ? (
                    <button
                      onClick={() => doWater(p.index)}
                      className="w-full bg-sky-500 text-white text-[11px] font-bold py-1.5"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      💧 Water
                    </button>
                  ) : (
                    <div className="w-full bg-white/85 text-gray-600 text-[9px] font-bold py-1.5 text-center leading-tight px-1">
                      {wait !== null && wait > 0 ? `grows ${friendlyWait(wait)}` : 'growing…'}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* seed picker */}
      <AnimatePresence>
        {picking !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPicking(null)}
          >
            <motion.div
              className="bg-white rounded-t-[2rem] w-full max-w-md p-5 pb-8"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={POP}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-center font-bold text-gray-700 mb-3 text-lg" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                What shall we plant?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {step.seeds.map((s) => (
                  <motion.button
                    key={s.id}
                    onClick={() => doPlant(picking, s.id)}
                    className="rounded-2xl border-4 border-white bg-green-50 p-2 flex flex-col items-center"
                    style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
                    whileTap={{ scale: 0.92, y: 3 }}
                  >
                    <ItemIcon icon={s.grown} size={34} label={s.name} />
                    <span className="text-[10px] font-bold text-gray-600 mt-1 leading-tight text-center">{s.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40 px-5 py-3 rounded-2xl bg-gray-900/92 text-white font-bold text-sm text-center max-w-xs"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          playClick();
          onDone();
        }}
        className="mt-1 rounded-2xl px-7 py-3.5 text-white font-bold border-4 border-white"
        style={{
          background: 'linear-gradient(135deg,#22C55E,#0E9F6E)',
          boxShadow: '0 5px 0 #047857',
          fontFamily: "'Bubblegum One', cursive",
        }}
        whileTap={{ scale: 0.95, y: 3 }}
      >
        {anyPlanted ? '✅ See you tomorrow!' : 'Done'}
      </motion.button>

      {anyPlanted && (
        <p className="text-xs text-gray-500 font-semibold text-center max-w-xs">
          Come back later — your plants keep growing even when the app is closed.
        </p>
      )}
    </div>
  );
};

export default GardenPlotStage;
