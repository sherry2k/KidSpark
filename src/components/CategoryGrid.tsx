import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from './mechanics/ItemIcon';
import {
  getCategoryState,
  orderCategories,
  shadowFor,
  nextUnlock,
  CATEGORY_SHORT_NAME,
} from '../data/categoryTiers';
import { getUnseenUnlocks, acknowledgeUnlock } from '../utils/skillProgress';
import { buzz, speak, POP } from '../utils/kidJuice';
import { playClick, playWrong, playComplete } from '../utils/sounds';

/**
 * CategoryGrid — the Skills hub.
 *
 * Three groups, in this order:
 *   OPEN        four rebuilt categories, playable now
 *   GOALS       locked, with a stated condition and a progress bar
 *   COMING SOON honestly labelled, not pretending to be broken
 *
 * The rule this enforces: a locked card always answers three questions —
 * why is it locked, what opens it, and how close am I? Your Factory
 * Simulator currently answers none of them, which is why it reads as a bug.
 */

export interface CatLike {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** tailwind gradient classes, e.g. "from-orange-400 to-red-500" */
  gradient: string;
  items: { id: string }[];
}

interface Props {
  categories: CatLike[];
  /** ids of completed skills — pass the persisted list */
  completedSkills: string[];
  onSelect: (cat: CatLike) => void;
}

/* ------------------------------------------------------------------ */
/* One card                                                            */
/* ------------------------------------------------------------------ */

interface CardProps {
  cat: CatLike;
  index: number;
  completedInCat: number;
  state: ReturnType<typeof getCategoryState>;
  onPlay: () => void;
  onBlocked: (msg: string) => void;
}

const CategoryCard: React.FC<CardProps> = ({ cat, index, completedInCat, state, onPlay, onBlocked }) => {
  const shadow = shadowFor(cat.id);
  const locked = !state.playable;

  const handle = () => {
    if (state.playable) {
      onPlay();
      return;
    }
    if (state.tier === 'unlockable') {
      const name = CATEGORY_SHORT_NAME[cat.id] || cat.name;
      const n = state.remaining;
      onBlocked(`Finish ${n} more make${n === 1 ? '' : 's'} to open the ${name}!`);
    } else {
      onBlocked(`The ${CATEGORY_SHORT_NAME[cat.id] || cat.name} is coming soon!`);
    }
  };

  return (
    <motion.button
      onClick={handle}
      className={`relative overflow-hidden rounded-3xl p-4 md:p-5 text-white border-4 border-white bg-gradient-to-br ${cat.gradient}`}
      style={{
        boxShadow: locked
          ? `0 5px 0 ${shadow}80, 0 8px 18px rgba(0,0,0,.14)`
          : `0 8px 0 ${shadow}, 0 12px 25px rgba(0,0,0,.2)`,
        minHeight: 186,
        filter: locked ? 'grayscale(.72) brightness(.97)' : 'none',
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, type: 'spring' }}
      whileHover={locked ? { scale: 1.02 } : { scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95, y: 4 }}
      aria-label={locked ? `${cat.name}, locked. ${state.teaser}` : cat.name}
    >
      {/* progress badge (open cards only) */}
      {!locked && completedInCat > 0 && (
        <div className="absolute top-2 right-2 bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full shadow border-2 border-green-400">
          {completedInCat}/{cat.items.length}
        </div>
      )}

      {/* sparkle (open cards only — a locked card shouldn't twinkle) */}
      {!locked && (
        <motion.div
          className="absolute top-2 left-2 text-yellow-200 text-lg opacity-70"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        >
          ✨
        </motion.div>
      )}

      {/* the emoji */}
      <motion.div
        className="mb-2 flex justify-center"
        animate={locked ? {} : { y: [0, -5, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
      >
        <ItemIcon icon={cat.emoji} size={56} label={cat.name} />
      </motion.div>

      <h4
        className="text-lg md:text-xl font-bold mb-1 text-center"
        style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '2px 2px 0 rgba(0,0,0,.15)' }}
      >
        {cat.name}
      </h4>

      <p className="text-white/90 text-xs md:text-sm text-center leading-tight">
        {locked ? state.teaser : cat.description}
      </p>

      {/* completed progress (open) */}
      {!locked && completedInCat > 0 && (
        <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedInCat / cat.items.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}

      {/* ---- LOCKED OVERLAY ---- */}
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/25 backdrop-blur-[1px] p-3">
          <motion.div
            className="absolute top-3 right-3 text-2xl"
            animate={state.tier === 'soon' ? { rotate: [0, -8, 8, 0] } : { y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {state.tier === 'soon' ? '🎁' : '🔒'}
          </motion.div>

          {state.tier === 'unlockable' ? (
            <div className="w-full">
              <p
                className="text-white text-[11px] font-bold text-center mb-1 leading-tight"
                style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '1px 1px 0 rgba(0,0,0,.4)' }}
              >
                {state.remaining} more make{state.remaining === 1 ? '' : 's'} to open!
              </p>
              <div className="h-3 bg-black/35 rounded-full overflow-hidden border border-white/40">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#FDE047,#F59E0B)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                />
              </div>
              <p className="text-white/85 text-[10px] text-center mt-1 font-bold tabular-nums">
                {state.requires - state.remaining} / {state.requires}
              </p>
            </div>
          ) : (
            <span
              className="bg-white/95 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-full"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Coming soon
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/* The grid                                                            */
/* ------------------------------------------------------------------ */

const SectionHead: React.FC<{ label: string; sub?: string }> = ({ label, sub }) => (
  <div className="col-span-full flex items-baseline gap-2 mt-4 mb-1 px-1">
    <h3 className="text-base font-bold text-gray-700" style={{ fontFamily: "'Bubblegum One', cursive" }}>
      {label}
    </h3>
    {sub && <span className="text-xs text-gray-400 font-semibold">{sub}</span>}
  </div>
);

const CategoryGrid: React.FC<Props> = ({ categories, completedSkills, onSelect }) => {
  const count = completedSkills.length;
  const [toast, setToast] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<CatLike | null>(null);

  const ordered = useMemo(() => orderCategories(categories), [categories]);

  const groups = useMemo(() => {
    const open: CatLike[] = [];
    const goals: CatLike[] = [];
    const soon: CatLike[] = [];
    ordered.forEach((c) => {
      const s = getCategoryState(c.id, count);
      if (s.playable) open.push(c);
      else if (s.tier === 'unlockable') goals.push(c);
      else soon.push(c);
    });
    return { open, goals, soon };
  }, [ordered, count]);

  /* ---- unlock celebration ---- */
  useEffect(() => {
    const unseen = getUnseenUnlocks(count);
    if (!unseen.length) return;
    const cat = categories.find((c) => c.id === unseen[0]);
    if (!cat) {
      acknowledgeUnlock(unseen[0]);
      return;
    }
    const t = setTimeout(() => {
      setCelebrate(cat);
      playComplete();
      buzz('success');
      speak(`You opened the ${CATEGORY_SHORT_NAME[cat.id] || cat.name}! Go and have a look.`);
    }, 450);
    return () => clearTimeout(t);
  }, [count, categories]);

  const closeCelebration = () => {
    if (celebrate) acknowledgeUnlock(celebrate.id);
    setCelebrate(null);
  };

  const blocked = (msg: string) => {
    playWrong();
    buzz('oops');
    setToast(msg);
    speak(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const goal = nextUnlock(count);

  const cardsFor = (list: CatLike[], offset: number) =>
    list.map((cat, i) => (
      <CategoryCard
        key={cat.id}
        cat={cat}
        index={offset + i}
        completedInCat={cat.items.filter((s) => completedSkills.includes(s.id)).length}
        state={getCategoryState(cat.id, count)}
        onPlay={() => {
          playClick();
          buzz('tick');
          onSelect(cat);
        }}
        onBlocked={blocked}
      />
    ));

  return (
    <div className="max-w-4xl mx-auto">
      {/* next goal banner — one clear thing to aim at */}
      {goal && (
        <motion.div
          className="mb-3 mx-1 rounded-2xl px-4 py-2.5 flex items-center gap-3 bg-white/95 border-4 border-white"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.10)' }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.span className="text-2xl" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            🔓
          </motion.span>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700 leading-tight" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              {goal.remaining} more make{goal.remaining === 1 ? '' : 's'} opens the{' '}
              {CATEGORY_SHORT_NAME[goal.id] || goal.id}!
            </p>
            <p className="text-[11px] text-gray-400 font-semibold tabular-nums">{count} finished so far</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {cardsFor(groups.open, 0)}

        {groups.goals.length > 0 && <SectionHead label="🔒 Unlock these next" sub="finish makes to open" />}
        {cardsFor(groups.goals, groups.open.length)}

        {groups.soon.length > 0 && <SectionHead label="🎁 Coming soon" sub="we're building these!" />}
        {cardsFor(groups.soon, groups.open.length + groups.goals.length)}
      </div>

      {/* toast for a blocked tap — a locked card must always answer back */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-5 py-3 rounded-2xl bg-gray-900/92 text-white font-bold text-sm text-center max-w-xs"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={POP}
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* unlock celebration */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/55 px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCelebration}
          >
            <motion.div
              className={`rounded-[2rem] p-8 border-4 border-white bg-gradient-to-br ${celebrate.gradient}`}
              style={{ boxShadow: `0 10px 0 ${shadowFor(celebrate.id)}` }}
              initial={{ scale: 0.4, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={POP}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="flex justify-center"
              >
                <ItemIcon icon={celebrate.emoji} size={96} label={celebrate.name} />
              </motion.div>
              <p
                className="text-white text-2xl font-bold mt-3"
                style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '2px 2px 0 rgba(0,0,0,.25)' }}
              >
                Unlocked!
              </p>
              <p className="text-white/95 text-lg font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {celebrate.name}
              </p>
            </motion.div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                acknowledgeUnlock(celebrate.id);
                setCelebrate(null);
                playClick();
                onSelect(celebrate);
              }}
              className="mt-6 rounded-2xl px-8 py-4 bg-white text-gray-800 font-bold border-4 border-white"
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,.3)', fontFamily: "'Bubblegum One', cursive", fontSize: '1.1rem' }}
              whileTap={{ scale: 0.95, y: 3 }}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Let&apos;s go! →
            </motion.button>
            <p className="text-white/70 text-xs mt-3">tap anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryGrid;
