import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { useLearnCategories } from '../context/ContentContext';
import { GameProgress } from '../store/gameStore';

interface LearnScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onCompleteLesson: (lessonId: string) => void;
}

// Custom gradients and shadows for each category
const CATEGORY_STYLES: Record<string, { gradient: string; shadow: string }> = {
  'alphabet': { gradient: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
  'numbers': { gradient: 'from-orange-500 to-red-500', shadow: '#C2410C' },
  'animals': { gradient: 'from-green-500 to-emerald-500', shadow: '#047857' },
  'fruits': { gradient: 'from-red-500 to-pink-500', shadow: '#B91C1C' },
  'vegetables': { gradient: 'from-lime-500 to-green-500', shadow: '#4D7C0F' },
  'shapes': { gradient: 'from-purple-500 to-violet-500', shadow: '#6D28D9' },
  'colors': { gradient: 'from-yellow-400 to-orange-500', shadow: '#D97706' },
  'vehicles': { gradient: 'from-sky-500 to-blue-500', shadow: '#1E40AF' },
  'birds': { gradient: 'from-pink-500 to-rose-500', shadow: '#BE185D' },
  'body': { gradient: 'from-violet-500 to-purple-500', shadow: '#7B2CBF' },
};

const LearnScreen: React.FC<LearnScreenProps> = ({ progress, onBack, onCompleteLesson }) => {
  const learnCategories = useLearnCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);

  const category = learnCategories.find((c) => c.id === selectedCategory);
  const currentItem = category?.items[currentIndex];
  const style = category ? (CATEGORY_STYLES[category.id] || { gradient: 'from-purple-500 to-pink-500', shadow: '#7B2CBF' }) : { gradient: 'from-purple-500 to-pink-500', shadow: '#7B2CBF' };

  const handleNext = () => {
    if (category && currentIndex < category.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFunFact(false);
    } else if (category) {
      onCompleteLesson(category.id);
      setSelectedCategory(null);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFunFact(false);
    }
  };

  // Category selection view
  if (!selectedCategory) {
    return (
      <GameBackground variant="learn">
        <div className="h-full flex flex-col">
          <Navigation title="📚 Learn" onBack={onBack} stars={progress.stars} coins={progress.coins} />
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.div
              className="text-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2 
                className="text-xl md:text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                Choose What to Learn! 🎓
              </h2>
              <p className="text-gray-500 text-sm mt-1">Pick a category and explore!</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              {learnCategories.map((cat, i) => {
                const isCompleted = progress.completedLessons.includes(cat.id);
                const catStyle = CATEGORY_STYLES[cat.id] || { gradient: 'from-gray-400 to-gray-500', shadow: '#374151' };
                
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentIndex(0);
                      setShowFunFact(false);
                    }}
                    className={`bg-gradient-to-br ${catStyle.gradient} rounded-3xl p-4 md:p-5 text-white shadow-xl border-4 border-white relative overflow-hidden`}
                    style={{
                      boxShadow: `0 8px 0 ${catStyle.shadow}, 0 12px 25px rgba(0,0,0,0.2)`,
                      minHeight: '160px',
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 4,
                      boxShadow: `0 4px 0 ${catStyle.shadow}, 0 6px 15px rgba(0,0,0,0.2)`
                    }}
                  >
                    {/* Completed Badge */}
                    {isCompleted && (
                      <motion.div
                        className="absolute top-2 right-2 bg-white text-green-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg border-2 border-green-400"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        ✓
                      </motion.div>
                    )}

                    {/* Sparkle */}
                    <motion.div
                      className="absolute top-2 left-2 text-yellow-200 text-lg opacity-70"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >
                      ✨
                    </motion.div>

                    {/* Big Emoji */}
                    <motion.div
                      className="text-5xl md:text-6xl mb-2 text-center"
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, -3, 3, 0]
                      }}
                      transition={{ 
                        duration: 2 + i * 0.3, 
                        repeat: Infinity 
                      }}
                    >
                      {cat.emoji}
                    </motion.div>

                    {/* Category Name */}
                    <h4 
                      className="text-lg md:text-xl font-bold mb-1 text-center"
                      style={{ 
                        fontFamily: "'Bubblegum One', cursive",
                        textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                      }}
                    >
                      {cat.name}
                    </h4>

                    {/* Items Count */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-xs md:text-sm text-white/90 font-semibold bg-white/20 rounded-full px-3 py-1">
                        {cat.items.length} items
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // Learning view
  return (
    <GameBackground variant="learn">
      <div className="h-full flex flex-col">
        <Navigation
          title={`${category?.emoji} ${category?.name}`}
          onBack={() => {
            setSelectedCategory(null);
            setCurrentIndex(0);
          }}
          stars={progress.stars}
          showProgress
          progress={category ? ((currentIndex + 1) / category.items.length) * 100 : 0}
        />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <motion.div
              className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="text-center flex-1">
                <p className="text-xs opacity-90">Item</p>
                <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {currentIndex + 1}/{category?.items.length}
                </p>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center flex-1">
                <p className="text-xs opacity-90">Category</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {category?.emoji}
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

            <AnimatePresence mode="wait">
              {currentItem && (
                <motion.div
                  key={currentItem.id}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white text-center"
                  initial={{ x: 100, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -100, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {/* HUGE Emoji */}
                  <motion.div
                    className="text-9xl md:text-[10rem] mb-4 cursor-pointer"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -3, 3, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileTap={{ scale: 1.3, rotate: [0, -15, 15, 0] }}
                    onClick={() => setShowFunFact(!showFunFact)}
                  >
                    {currentItem.emoji}
                  </motion.div>

                  {/* Name in Colorful Box */}
                  <motion.div
                    className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-4 md:p-5 mb-4 shadow-lg border-4 border-white`}
                    style={{
                      boxShadow: `0 6px 0 ${style.shadow}, 0 8px 20px rgba(0,0,0,0.15)`,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2
                      className="text-3xl md:text-5xl font-bold text-white"
                      style={{ 
                        fontFamily: "'Bubblegum One', cursive",
                        textShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                      }}
                    >
                      {currentItem.name}
                    </h2>
                  </motion.div>

                  {/* Color Swatch for Colors */}
                  {currentItem.color && selectedCategory === 'colors' && (
                    <motion.div
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 shadow-2xl border-8 border-white"
                      style={{ 
                        backgroundColor: currentItem.color,
                        boxShadow: `0 8px 0 rgba(0,0,0,0.15), 0 12px 25px rgba(0,0,0,0.2)`,
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                    />
                  )}

                  {/* Fun Fact */}
                  <AnimatePresence>
                    {showFunFact && currentItem.funFact && (
                      <motion.div
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mt-4 border-4 border-yellow-300 shadow-lg"
                        style={{
                          boxShadow: '0 4px 0 #F59E0B, 0 6px 15px rgba(0,0,0,0.1)',
                        }}
                        initial={{ height: 0, opacity: 0, scale: 0.8 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.8 }}
                      >
                        <div className="flex items-start gap-2">
                          <motion.span 
                            className="text-2xl"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            💡
                          </motion.span>
                          <p 
                            className="text-yellow-800 text-sm md:text-base font-bold text-left flex-1"
                            style={{ fontFamily: "'Bubblegum One', cursive" }}
                          >
                            {currentItem.funFact}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tap hint */}
                  <motion.p 
                    className="text-gray-500 text-sm mt-4 font-semibold flex items-center justify-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👆 Tap the picture for a fun fact! ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons - BIGGER */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-6">
              {/* Previous Button */}
              <motion.button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`rounded-2xl flex items-center justify-center shadow-lg border-4 border-white ${
                  currentIndex > 0
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{
                  minWidth: '60px',
                  minHeight: '60px',
                  boxShadow: currentIndex > 0 
                    ? '0 6px 0 #374151, 0 8px 15px rgba(0,0,0,0.15)' 
                    : 'none',
                }}
                whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
                whileTap={currentIndex > 0 ? { 
                  scale: 0.9, 
                  y: 4,
                  boxShadow: '0 2px 0 #374151, 0 4px 10px rgba(0,0,0,0.15)'
                } : {}}
              >
                <span className="text-3xl">⬅️</span>
              </motion.button>

              {/* Next/Complete Button */}
              <motion.button
                onClick={handleNext}
                className={`rounded-2xl px-6 md:px-10 py-4 text-white font-bold shadow-lg border-4 border-white flex items-center gap-2 ${
                  category && currentIndex === category.items.length - 1
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : `bg-gradient-to-r ${style.gradient}`
                }`}
                style={{
                  minHeight: '60px',
                  boxShadow: category && currentIndex === category.items.length - 1
                    ? '0 6px 0 #047857, 0 8px 15px rgba(0,0,0,0.2)'
                    : `0 6px 0 ${style.shadow}, 0 8px 15px rgba(0,0,0,0.2)`,
                  fontFamily: "'Bubblegum One', cursive",
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: category && currentIndex === category.items.length - 1
                    ? '0 2px 0 #047857, 0 4px 10px rgba(0,0,0,0.2)'
                    : `0 2px 0 ${style.shadow}, 0 4px 10px rgba(0,0,0,0.2)`
                }}
              >
                {category && currentIndex === category.items.length - 1 ? (
                  <>🎉 Complete!</>
                ) : (
                  <>Next ➡️</>
                )}
              </motion.button>

              {/* Next Arrow (only shown when not last) */}
              {category && currentIndex < category.items.length - 1 && (
                <motion.button
                  onClick={handleNext}
                  className="rounded-2xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-4 border-white"
                  style={{
                    minWidth: '60px',
                    minHeight: '60px',
                    boxShadow: '0 6px 0 #7B2CBF, 0 8px 15px rgba(0,0,0,0.15)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ 
                    scale: 0.9, 
                    y: 4,
                    boxShadow: '0 2px 0 #7B2CBF, 0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  <span className="text-3xl">➡️</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default LearnScreen;
