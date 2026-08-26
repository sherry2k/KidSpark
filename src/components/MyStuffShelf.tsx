import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KeepsakeView from './KeepsakeView';
import { Keepsake, getKeepsakes } from '../utils/keepsakes';
import { playClick } from '../utils/sounds';
import { buzz, speak, POP } from '../utils/kidJuice';

/**
 * MyStuffShelf — everything the child has made, still here tomorrow.
 *
 * Drop this anywhere: its own tab on the home screen, or a button on the
 * Skills hub. It reads from localStorage, so it costs you no backend.
 */

interface Props {
  onBack: () => void;
  /** show only one category's makes, e.g. 'cooking' */
  categoryId?: string;
}

const MyStuffShelf: React.FC<Props> = ({ onBack, categoryId }) => {
  const [items] = useState<Keepsake[]>(() => {
    const all = getKeepsakes();
    return categoryId ? all.filter((k) => k.categoryId === categoryId) : all;
  });
  const [big, setBig] = useState<Keepsake | null>(null);

  if (!items.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-7xl">
          🗄️
        </motion.div>
        <h3 className="mt-4 text-xl font-bold text-gray-700" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          Your shelf is empty
        </h3>
        <p className="text-gray-500 mt-1 text-sm">Finish an activity and whatever you make will live here!</p>
        <button
          onClick={() => { playClick(); onBack(); }}
          className="mt-6 rounded-2xl px-6 py-3 bg-white border-4 border-white font-bold text-gray-700"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-10">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-2xl font-bold text-gray-800 text-center mt-2 mb-1"
          style={{ fontFamily: "'Bubblegum One', cursive" }}
        >
          🗄️ My Stuff
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          {items.length} thing{items.length === 1 ? '' : 's'} you made
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((k, i) => (
            <motion.button
              key={k.id}
              onClick={() => { playClick(); buzz('tick'); setBig(k); speak(`Your ${k.title}`); }}
              className="bg-white/95 rounded-3xl border-4 border-white p-2 flex flex-col items-center"
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,.12)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04, ...POP }}
              whileTap={{ scale: 0.94, y: 3 }}
            >
              <KeepsakeView item={k} size={110} />
              <span className="text-xs font-bold text-gray-600 mt-1 leading-tight text-center">{k.title}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => { playClick(); onBack(); }}
          className="mt-6 mx-auto block rounded-2xl px-6 py-3 bg-white border-4 border-white font-bold text-gray-700"
          style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
        >
          ← Back
        </button>
      </div>

      <AnimatePresence>
        {big && (
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBig(null)}
          >
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={POP}>
              <KeepsakeView
                item={big}
                size={Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 60 : 300)}
              />
            </motion.div>
            <p className="mt-3 text-2xl font-bold text-gray-800" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              {big.title}
            </p>
            <p className="mt-1 text-gray-400 text-sm">tap anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyStuffShelf;
