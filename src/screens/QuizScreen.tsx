import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration, { FeedbackPopup } from '../components/Celebration';
import { encouragementMessages } from '../data/gameData';
import { useContent } from '../context/ContentContext';
import { GameProgress } from '../store/gameStore';

interface QuizScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (starsEarned: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ progress, onBack, onAnswer, onComplete }) => {
  const { quizQuestions } = useContent();
  const [questions] = useState(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentQ];

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === question.correct;
    setFeedbackCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      const msgs = encouragementMessages.correct;
      setFeedbackMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    } else {
      const msgs = encouragementMessages.incorrect;
      setFeedbackMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    }

    onAnswer(correct);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        const starsEarned = correct ? score + 1 : score;
        const starRating = starsEarned >= questions.length * 0.8 ? 3 : starsEarned >= questions.length * 0.5 ? 2 : 1;
        setIsFinished(true);
        setShowCelebration(true);
        onComplete(starRating);
      }
    }, 1500);
  }, [selectedAnswer, question, currentQ, questions.length, score, onAnswer, onComplete]);

  // Colorful gradients for answer buttons
  const optionStyles = [
    { gradient: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
    { gradient: 'from-green-500 to-emerald-500', shadow: '#047857' },
    { gradient: 'from-orange-500 to-red-500', shadow: '#C2410C' },
    { gradient: 'from-purple-500 to-pink-500', shadow: '#7B2CBF' },
  ];

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (isFinished) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration
            show={showCelebration}
            message={score >= questions.length * 0.8 ? 'SUPERSTAR!' : score >= questions.length * 0.5 ? 'Great Job!' : 'Good Try!'}
            stars={score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1}
          />
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
              {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '⭐' : '💪'}
            </motion.div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Quiz Complete! 🎉
            </h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-4 text-white">
              <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {score} / {questions.length}
              </p>
              <p className="text-sm mt-1 opacity-90">Correct Answers</p>
            </div>
            <p className="text-gray-600 mb-6 text-base font-semibold">
              {score >= questions.length * 0.8
                ? '🌟 You are amazing!'
                : score >= questions.length * 0.5
                ? '💪 Keep it up!'
                : '📚 Practice makes perfect!'}
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
                  setCurrentQ(0);
                  setScore(0);
                  setIsFinished(false);
                  setShowCelebration(false);
                  setSelectedAnswer(null);
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #7B2CBF, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Retry
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
          title="❓ Quiz"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={((currentQ + 1) / questions.length) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              className="max-w-2xl mx-auto"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Score Bar */}
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Question</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {currentQ + 1}/{questions.length}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Score</p>
                  <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    ⭐ {score}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Category</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {question.category === 'animals' ? '🦁' :
                     question.category === 'fruits' ? '🍎' :
                     question.category === 'colors' ? '🎨' :
                     question.category === 'numbers' ? '🔢' :
                     question.category === 'shapes' ? '🔺' :
                     question.category === 'vehicles' ? '🚗' :
                     question.category === 'math' ? '🧮' : '❓'}
                  </p>
                </div>
              </motion.div>

              {/* Main Card */}
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {/* BIG Emoji */}
                <motion.div
                  className="text-8xl md:text-9xl text-center mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {question.emoji}
                </motion.div>

                {/* Question in Colorful Box */}
                <motion.div
                  className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl p-4 md:p-6 mb-6 border-4 border-white shadow-lg"
                  style={{
                    boxShadow: '0 6px 0 rgba(251, 146, 60, 0.3), 0 8px 20px rgba(0,0,0,0.1)',
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 
                    className="text-xl md:text-2xl font-bold text-gray-800 text-center"
                    style={{ 
                      fontFamily: "'Bubblegum One', cursive",
                      textShadow: '2px 2px 0 rgba(0,0,0,0.05)'
                    }}
                  >
                    {question.question}
                  </h3>
                </motion.div>

                {/* Answer Section Header */}
                <p 
                  className="text-center text-base md:text-lg font-bold text-gray-700 mb-3"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  👆 Choose your answer:
                </p>

                {/* Options - BIGGER and MORE COLORFUL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {question.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === question.correct;
                    const showResult = selectedAnswer !== null;
                    const style = optionStyles[i];

                    let bgClass = `bg-gradient-to-br ${style.gradient} text-white border-white`;
                    let currentShadow = style.shadow;
                    
                    if (showResult) {
                      if (isCorrect) {
                        bgClass = 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-white ring-4 ring-green-300';
                        currentShadow = '#047857';
                      } else if (isSelected && !isCorrect) {
                        bgClass = 'bg-gradient-to-br from-red-500 to-red-600 text-white border-white ring-4 ring-red-300';
                        currentShadow = '#B91C1C';
                      } else {
                        bgClass = 'bg-gray-200 text-gray-400 border-gray-300';
                        currentShadow = '#9CA3AF';
                      }
                    }

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className={`${bgClass} rounded-2xl p-4 md:p-5 flex items-center gap-3 shadow-lg border-4 transition-all`}
                        style={{ 
                          fontFamily: "'Bubblegum One', cursive",
                          minHeight: '75px',
                          boxShadow: `0 6px 0 ${currentShadow}, 0 8px 15px rgba(0,0,0,0.15)`,
                        }}
                        initial={{ y: 20, opacity: 0, scale: 0 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                        whileHover={!showResult ? { scale: 1.03, y: -3 } : {}}
                        whileTap={!showResult ? { 
                          scale: 0.95, 
                          y: 3,
                          boxShadow: `0 2px 0 ${currentShadow}, 0 4px 10px rgba(0,0,0,0.15)`
                        } : {}}
                        disabled={selectedAnswer !== null}
                      >
                        {/* Letter/Result Badge */}
                        <motion.div
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 border-3 ${
                            showResult && isCorrect ? 'bg-white text-green-500' :
                            showResult && isSelected ? 'bg-white text-red-500' :
                            'bg-white/30 border-white/50'
                          }`}
                          style={{
                            textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
                          }}
                          animate={showResult && isCorrect ? { 
                            scale: [1, 1.3, 1],
                            rotate: [0, 360]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {showResult
                            ? isCorrect
                              ? '✓'
                              : isSelected
                              ? '✗'
                              : optionLetters[i]
                            : optionLetters[i]}
                        </motion.div>

                        {/* Option Text */}
                        <span 
                          className="font-bold text-base md:text-xl text-left flex-1"
                          style={{ 
                            textShadow: showResult && (isCorrect || (isSelected && !isCorrect)) 
                              ? '2px 2px 0 rgba(0,0,0,0.2)' 
                              : 'none'
                          }}
                        >
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GameBackground>
  );
};

export default QuizScreen;
