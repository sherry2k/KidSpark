import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration from '../components/Celebration';
import { matchItems } from '../data/gameData';
import { GameProgress } from '../store/gameStore';

interface MatchGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const MatchGame: React.FC<MatchGameProps> = ({ progress, onBack, onComplete }) => {
  const categories = ['Fruit', 'Animal', 'Vehicle', 'Vegetable'];
  const categoryEmojis: Record<string, string> = { Fruit: '🍎', Animal: '🦁', Vehicle: '🚗', Vegetable: '🥕' };
  const categoryColors: Record<string, string> = {
    Fruit: 'bg-red-100 border-red-300 text-red-700',
    Animal: 'bg-green-100 border-green-300 text-green-700',
    Vehicle: 'bg-blue-100 border-blue-300 text-blue-700',
    Vegetable: 'bg-orange-100 border-orange-300 text-orange-700',
  };

  const [items] = useState(() => [...matchItems].sort(() => Math.random() - 0.5));
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [wrongMatch, setWrongMatch] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const handleItemClick = useCallback((itemId: string) => {
    if (matched.includes(itemId)) return;
    setSelectedItem(itemId);
    setWrongMatch(false);

    if (selectedCategory) {
      const item = items.find((i) => i.id === itemId);
      if (item && item.category === selectedCategory) {
        setMatched((prev) => [...prev, itemId]);
        setSelectedItem(null);
        setSelectedCategory(null);

        if (matched.length + 1 === items.length) {
          setShowCelebration(true);
          const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
          onComplete(stars);
        }
      } else {
        setMistakes((m) => m + 1);
        setWrongMatch(true);
        setTimeout(() => {
          setWrongMatch(false);
          setSelectedItem(null);
          setSelectedCategory(null);
        }, 800);
      }
    }
  }, [matched, selectedCategory, items, mistakes, onComplete]);

  const handleCategoryClick = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setWrongMatch(false);

    if (selectedItem) {
      const item = items.find((i) => i.id === selectedItem);
      if (item && item.category === cat) {
        setMatched((prev) => [...prev, selectedItem]);
        setSelectedItem(null);
        setSelectedCategory(null);

        if (matched.length + 1 === items.length) {
          setShowCelebration(true);
          const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
          onComplete(stars);
        }
      } else {
        setMistakes((m) => m + 1);
        setWrongMatch(true);
        setTimeout(() => {
          setWrongMatch(false);
          setSelectedItem(null);
          setSelectedCategory(null);
        }, 800);
      }
    }
  }, [selectedItem, items, matched, mistakes, onComplete]);

  if (showCelebration) {
    const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={true} message="All Sorted!" stars={stars} />
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Perfect Sorting! 🎉
            </h2>
            <p className="text-gray-500 mb-6">Mistakes: {mistakes}</p>
            <div className="flex gap-3">
              <motion.button onClick={onBack} className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 font-bold" whileTap={{ scale: 0.98 }}>
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => { setMatched([]); setMistakes(0); setShowCelebration(false); setSelectedItem(null); setSelectedCategory(null); }}
                className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-2xl py-3 font-bold shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                🔄 Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </GameBackground>
    );
  }

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation
          title="🎯 Match Game"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={(matched.length / items.length) * 100}
        />

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Instructions */}
          <motion.p
            className="text-center text-gray-600 text-sm mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Tap an item, then tap its category! {wrongMatch && <span className="text-red-500 font-bold">Try again!</span>}
          </motion.p>

          {/* Categories */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {categories.map((cat) => {
              const catItemCount = items.filter((i) => i.category === cat).length;
              const catMatchedCount = matched.filter((id) => items.find((i) => i.id === id)?.category === cat).length;
              
              return (
                <motion.button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`${categoryColors[cat]} border-2 rounded-2xl p-3 text-center transition-all ${
                    selectedCategory === cat ? 'ring-4 ring-offset-2 ring-current scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl block">{categoryEmojis[cat]}</span>
                  <span className="text-xs font-bold block">{cat}</span>
                  <span className="text-xs opacity-60">{catMatchedCount}/{catItemCount}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {items.map((item, i) => {
                const isMatched = matched.includes(item.id);
                const isSelected = selectedItem === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`rounded-2xl p-3 md:p-4 text-center shadow-md transition-all ${
                      isMatched
                        ? `${categoryColors[item.category]} border-2 opacity-60`
                        : isSelected
                        ? 'bg-yellow-100 border-2 border-yellow-400 ring-4 ring-yellow-200'
                        : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    disabled={isMatched}
                  >
                    <motion.span
                      className="text-3xl md:text-4xl block"
                      animate={isMatched ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {item.emoji}
                    </motion.span>
                    <span className="text-xs font-bold text-gray-600 mt-1 block">{item.name}</span>
                    {isMatched && (
                      <span className="text-xs text-gray-400">{item.category}</span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MatchGame;
