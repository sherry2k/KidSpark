import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration, { FeedbackPopup } from '../components/Celebration';
import { encouragementMessages } from '../data/gameData';
import { useContent } from '../context/ContentContext';
import { GameProgress } from '../store/gameStore';

interface WordBuilderProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const WordBuilder: React.FC<WordBuilderProps> = ({ progress, onBack, onComplete }) => {
  const { wordBuilderWords } = useContent();
  const totalWords = 8;
  const [words] = useState(() => {
    const shuffled = [...wordBuilderWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalWords);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>(() => {
    const word = words[0].word;
    return [...word].sort(() => Math.random() - 0.5);
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentWord = words[currentIndex];
  // built word used for display and checking

  const handleLetterClick = useCallback((index: number) => {
    if (selectedLetters.includes(index)) {
      // Remove letter
      setSelectedLetters((prev) => prev.filter((i) => i !== index));
      return;
    }

    const newSelected = [...selectedLetters, index];
    setSelectedLetters(newSelected);

    // Check if word is complete
    if (newSelected.length === currentWord.word.length) {
      const built = newSelected.map((i) => availableLetters[i]).join('');
      const correct = built === currentWord.word;

      setFeedbackCorrect(correct);
      if (correct) {
        setScore((s) => s + 1);
        const msgs = encouragementMessages.correct;
        setFeedbackMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      } else {
        const msgs = encouragementMessages.incorrect;
        setFeedbackMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      }

      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);

        if (correct) {
          if (currentIndex < words.length - 1) {
            const nextWord = words[currentIndex + 1].word;
            setAvailableLetters([...nextWord].sort(() => Math.random() - 0.5));
            setSelectedLetters([]);
            setCurrentIndex((i) => i + 1);
            setShowHint(false);
          } else {
            const finalScore = score + 1;
            const stars = finalScore >= totalWords * 0.8 ? 3 : finalScore >= totalWords * 0.5 ? 2 : 1;
            setIsFinished(true);
            setShowCelebration(true);
            onComplete(stars);
          }
        } else {
          setSelectedLetters([]);
        }
      }, 1500);
    }
  }, [selectedLetters, availableLetters, currentWord, currentIndex, words, score, onComplete]);

  if (isFinished) {
    const stars = score >= totalWords * 0.8 ? 3 : score >= totalWords * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={showCelebration} message="Word Master!" stars={stars} />
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="text-6xl mb-3">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              All Words Built! 🎉
            </h2>
            <p className="text-2xl font-bold text-purple-600 mb-6">{score} / {totalWords}</p>
            <div className="flex gap-3">
              <motion.button onClick={onBack} className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 font-bold" whileTap={{ scale: 0.98 }}>
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => {
                  const shuffled = [...wordBuilderWords].sort(() => Math.random() - 0.5).slice(0, totalWords);
                  setCurrentIndex(0);
                  setScore(0);
                  setIsFinished(false);
                  setShowCelebration(false);
                  setAvailableLetters([...shuffled[0].word].sort(() => Math.random() - 0.5));
                  setSelectedLetters([]);
                }}
                className="flex-1 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-2xl py-3 font-bold shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                🔄 New Words
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
          title="📝 Word Builder"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={((currentIndex + 1) / words.length) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full text-center"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring' }}
            >
              <p className="text-gray-400 text-sm mb-2">
                Word {currentIndex + 1} of {words.length} • Score: {score}
              </p>

              {/* Emoji hint */}
              <motion.div
                className="text-6xl md:text-7xl mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentWord.emoji}
              </motion.div>

              {/* Hint */}
              <motion.button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-blue-400 mb-4 hover:text-blue-600"
              >
                {showHint ? `💡 ${currentWord.hint}` : '💡 Need a hint?'}
              </motion.button>

              {/* Word slots */}
              <div className="flex justify-center gap-2 mb-6">
                {currentWord.word.split('').map((_letter, i) => {
                  const filled = i < selectedLetters.length;
                  const displayLetter = filled ? availableLetters[selectedLetters[i]] : '';

                  return (
                    <motion.div
                      key={i}
                      className={`w-12 h-14 md:w-16 md:h-18 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold border-3 ${
                        filled
                          ? 'bg-blue-100 border-blue-400 text-blue-700'
                          : 'bg-gray-50 border-gray-200 border-dashed text-gray-300'
                      }`}
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        if (filled) {
                          // Remove this and all after
                          setSelectedLetters((prev) => prev.slice(0, i));
                        }
                      }}
                    >
                      {filled ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          {displayLetter}
                        </motion.span>
                      ) : (
                        '_'
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Available letters */}
              <div className="flex justify-center gap-2 flex-wrap">
                {availableLetters.map((letter, i) => {
                  const isUsed = selectedLetters.includes(i);

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleLetterClick(i)}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl text-xl md:text-2xl font-bold shadow-md transition-all ${
                        isUsed
                          ? 'bg-gray-100 text-gray-300 cursor-default'
                          : 'bg-gradient-to-b from-yellow-300 to-orange-400 text-white hover:shadow-lg cursor-pointer'
                      }`}
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                      whileHover={!isUsed ? { scale: 1.1, y: -4 } : {}}
                      whileTap={!isUsed ? { scale: 0.9 } : {}}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                    >
                      {letter}
                    </motion.button>
                  );
                })}
              </div>

              {/* Clear button */}
              {selectedLetters.length > 0 && (
                <motion.button
                  onClick={() => setSelectedLetters([])}
                  className="mt-4 text-sm text-red-400 hover:text-red-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  🗑️ Clear all
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GameBackground>
  );
};

export default WordBuilder;
