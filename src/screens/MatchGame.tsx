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
  const categoryEmojis: Record<string, string> = { 
    Fruit: '🍎', 
    Animal: '🦁', 
    Vehicle: '🚗', 
    Vegetable: '🥕' 
  };
  
  // Colorful gradients for each category
  const categoryStyles: Record<string, { 
    gradient: string; 
    shadow: string; 
    lightBg: string;
    textColor: string;
  }> = {
    Fruit: { 
      gradient: 'from-red-500 to-pink-500', 
      shadow: '#B91C1C',
      lightBg: 'from-red-100 to-pink-100',
      textColor: 'text-red-700'
    },
    Animal: { 
      gradient: 'from-green-500 to-emerald-500', 
      shadow: '#047857',
      lightBg: 'from-green-100 to-emerald-100',
      textColor: 'text-green-700'
    },
    Vehicle: { 
      gradient: 'from-blue-500 to-cyan-500', 
      shadow: '#0369A1',
      lightBg: 'from-blue-100 to-cyan-100',
      textColor: 'text-blue-700'
    },
    Vegetable: { 
      gradient: 'from-orange-500 to-amber-500', 
      shadow: '#C2410C',
      lightBg: 'from-orange-100 to-amber-100',
      textColor: 'text-orange-700'
    },
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
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border-4 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <motion.div 
              className="text-7xl mb-3"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Perfect Sorting! 🎉
            </h2>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-4 text-white">
              <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {items.length - mistakes}/{items.length}
              </p>
              <p className="text-sm mt-1 opacity-90">Perfect Matches</p>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Mistakes: <span className="font-bold text-red-500">{mistakes}</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button 
                onClick={onBack} 
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #374151, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => { 
                  setMatched([]); 
                  setMistakes(0); 
                  setShowCelebration(false); 
                  setSelectedItem(null); 
                  setSelectedCategory(null); 
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #C2410C, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
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
          title="🎯 Match"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={(matched.length / items.length) * 100}
        />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="max-w-2xl mx-auto">
            {/* Score Bar */}
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="text-center flex-1">
                <p className="text-xs opacity-90">Matched</p>
                <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {matched.length}/{items.length}
                </p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center flex-1">
                <p className="text-xs opacity-90">Mistakes</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  ❌ {mistakes}
                </p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center flex-1">
                <p className="text-xs opacity-90">Stars</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  ⭐ {progress.stars}
                </p>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p 
                className={`inline-block px-6 py-3 rounded-2xl font-bold shadow-lg border-4 border-white text-base md:text-lg ${
                  wrongMatch 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-700'
                }`}
                style={{ 
                  fontFamily: "'Bubblegum One', cursive",
                  boxShadow: wrongMatch 
                    ? '0 6px 0 #B91C1C, 0 8px 15px rgba(0,0,0,0.15)' 
                    : '0 6px 0 rgba(0,0,0,0.1), 0 8px 15px rgba(0,0,0,0.05)'
                }}
              >
                {wrongMatch ? '❌ Try Again!' : '👆 Tap item, then tap category!'}
              </p>
            </motion.div>

            {/* Categories - BIGGER AND MORE COLORFUL */}
            <div className="mb-4">
              <p 
                className="text-center text-base md:text-lg font-bold text-gray-700 mb-3"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                🎯 Categories
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const catItemCount = items.filter((i) => i.category === cat).length;
                  const catMatchedCount = matched.filter((id) => items.find((i) => i.id === id)?.category === cat).length;
                  const isSelected = selectedCategory === cat;
                  const isComplete = catMatchedCount === catItemCount;
                  const style = categoryStyles[cat];
                  
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      disabled={isComplete}
                      className={`rounded-3xl p-4 text-center relative overflow-hidden shadow-lg border-4 ${
                        isComplete
                          ? `bg-gradient-to-br ${style.gradient} text-white border-white opacity-60`
                          : isSelected 
                            ? `bg-gradient-to-br ${style.gradient} text-white border-yellow-400 ring-4 ring-yellow-300 scale-105`
                            : `bg-gradient-to-br ${style.gradient} text-white border-white`
                      }`}
                      style={{
                        boxShadow: isComplete 
                          ? 'none'
                          : isSelected
                            ? `0 8px 0 ${style.shadow}, 0 12px 25px rgba(0,0,0,0.2)`
                            : `0 6px 0 ${style.shadow}, 0 8px 20px rgba(0,0,0,0.15)`,
                        minHeight: '100px',
                      }}
                      whileHover={!isComplete ? { scale: 1.05, y: -3 } : {}}
                      whileTap={!isComplete ? { 
                        scale: 0.95, 
                        y: 3,
                        boxShadow: `0 2px 0 ${style.shadow}, 0 4px 10px rgba(0,0,0,0.15)`
                      } : {}}
                    >
                      {/* Sparkle */}
                      {!isComplete && (
                        <motion.div
                          className="absolute top-1 right-1 text-yellow-200 text-sm opacity-70"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✨
                        </motion.div>
                      )}
                      
                      {/* Check mark when complete */}
                      {isComplete && (
                        <motion.div
                          className="absolute top-1 right-1 bg-white text-green-500 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-green-400"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      
                      <motion.span 
                        className="text-4xl md:text-5xl block mb-1"
                        animate={isSelected ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        } : { y: [0, -3, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity 
                        }}
                      >
                        {categoryEmojis[cat]}
                      </motion.span>
                      <span 
                        className="text-base md:text-lg font-bold block"
                        style={{ 
                          fontFamily: "'Bubblegum One', cursive",
                          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                        }}
                      >
                        {cat}
                      </span>
                      <span className="text-xs md:text-sm opacity-90 font-semibold bg-white/20 rounded-full px-2 py-0.5 mt-1 inline-block">
                        {catMatchedCount}/{catItemCount}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Items Header */}
            <p 
              className="text-center text-base md:text-lg font-bold text-gray-700 mb-3"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              🎨 Items to Sort
            </p>

            {/* Items grid - BIGGER */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {items.map((item, i) => {
                  const isMatched = matched.includes(item.id);
                  const isSelected = selectedItem === item.id;
                  const style = categoryStyles[item.category];

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      disabled={isMatched}
                      className={`rounded-2xl p-3 md:p-4 text-center shadow-lg border-4 transition-all ${
                        isMatched
                          ? `bg-gradient-to-br ${style.lightBg} border-white opacity-70`
                          : isSelected
                            ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 border-yellow-500 ring-4 ring-yellow-200 scale-105'
                            : 'bg-white border-white'
                      }`}
                      style={{
                        boxShadow: isMatched 
                          ? '0 3px 0 rgba(0,0,0,0.1)'
                          : isSelected
                            ? '0 8px 0 #D97706, 0 12px 25px rgba(0,0,0,0.2)'
                            : '0 6px 0 rgba(0,0,0,0.15), 0 8px 15px rgba(0,0,0,0.1)',
                        minHeight: '110px',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={!isMatched ? { scale: 1.05, y: -3 } : {}}
                      whileTap={!isMatched ? { 
                        scale: 0.95, 
                        y: 3,
                        boxShadow: '0 2px 0 rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)'
                      } : {}}
                    >
                      {isMatched && (
                        <motion.div
                          className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      <motion.span
                        className="text-4xl md:text-5xl block mb-1"
                        animate={isMatched ? { 
                          scale: [1, 1.3, 1],
                          rotate: [0, 360]
                        } : isSelected ? {
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={isMatched ? { duration: 0.5 } : { duration: 1, repeat: Infinity }}
                      >
                        {item.emoji}
                      </motion.span>
                      <span 
                        className={`text-xs md:text-sm font-bold mt-1 block ${
                          isSelected ? 'text-yellow-900' : 'text-gray-700'
                        }`}
                        style={{ fontFamily: "'Bubblegum One', cursive" }}
                      >
                        {item.name}
                      </span>
                      {isMatched && (
                        <span className={`text-xs ${style.textColor} font-bold mt-1 block bg-white/50 rounded-full px-2 py-0.5`}>
                          {item.category}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MatchGame;
