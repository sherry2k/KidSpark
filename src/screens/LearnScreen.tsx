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

const LearnScreen: React.FC<LearnScreenProps> = ({ progress, onBack, onCompleteLesson }) => {
  const learnCategories = useLearnCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);

  const category = learnCategories.find((c) => c.id === selectedCategory);
  const currentItem = category?.items[currentIndex];

  const handleNext = () => {
    if (category && currentIndex < category.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFunFact(false);
    } else if (category) {
      // Complete this category
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
          <Navigation title="📚 Learn Mode" onBack={onBack} stars={progress.stars} coins={progress.coins} />
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.p
              className="text-center text-gray-600 mb-4 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Choose what you want to learn! 🎓
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {learnCategories.map((cat, i) => {
                const isCompleted = progress.completedLessons.includes(cat.id);
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentIndex(0);
                      setShowFunFact(false);
                    }}
                    className="game-card p-4 md:p-6 text-center relative overflow-hidden"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted && (
                      <motion.div
                        className="absolute top-2 right-2 text-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✅
                      </motion.div>
                    )}
                    <motion.span
                      className="text-4xl md:text-5xl block mb-2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
                    >
                      {cat.emoji}
                    </motion.span>
                    <h4 className="font-bold text-gray-800 text-sm md:text-base">{cat.name}</h4>
                    <p className="text-gray-400 text-xs mt-1">{cat.items.length} items</p>
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

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={currentItem.id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl max-w-md w-full text-center"
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {/* Counter */}
                <p className="text-gray-400 text-sm mb-2">
                  {currentIndex + 1} of {category?.items.length}
                </p>

                {/* Emoji */}
                <motion.div
                  className="text-7xl md:text-9xl mb-4 cursor-pointer"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileTap={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                  onClick={() => setShowFunFact(!showFunFact)}
                >
                  {currentItem.emoji}
                </motion.div>

                {/* Name */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentItem.name}
                </motion.h2>

                {/* Color swatch for colors category */}
                {currentItem.color && selectedCategory === 'colors' && (
                  <motion.div
                    className="w-20 h-20 rounded-full mx-auto mb-3 shadow-lg border-4 border-white"
                    style={{ backgroundColor: currentItem.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  />
                )}

                {/* Fun Fact */}
                <AnimatePresence>
                  {showFunFact && currentItem.funFact && (
                    <motion.div
                      className="bg-yellow-50 rounded-2xl p-3 mt-3 border-2 border-yellow-200"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="text-yellow-700 text-sm font-medium">
                        💡 {currentItem.funFact}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tap hint */}
                <p className="text-gray-300 text-xs mt-3">Tap the picture for a fun fact! ✨</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex items-center gap-4 mt-6">
            <motion.button
              onClick={handlePrev}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                currentIndex > 0
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
              disabled={currentIndex === 0}
            >
              ◀️
            </motion.button>

            <motion.button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full px-8 py-3 text-lg font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category && currentIndex === category.items.length - 1 ? '🎉 Complete!' : 'Next ▶️'}
            </motion.button>

            <motion.button
              onClick={handleNext}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                category && currentIndex < category.items.length - 1
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={
                category && currentIndex < category.items.length - 1 ? { scale: 1.1 } : {}
              }
              whileTap={
                category && currentIndex < category.items.length - 1 ? { scale: 0.9 } : {}
              }
            >
              ▶️
            </motion.button>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default LearnScreen;
