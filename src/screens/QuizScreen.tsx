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

  const optionColors = [
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-orange-400 to-orange-500',
    'from-purple-400 to-purple-500',
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
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Quiz Complete! 🎉
            </h2>
            <div className="text-6xl mb-4">
              {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '⭐' : '💪'}
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-2">
              {score} / {questions.length}
            </p>
            <p className="text-gray-500 mb-6">
              {score >= questions.length * 0.8
                ? 'You are amazing!'
                : score >= questions.length * 0.5
                ? 'Keep it up!'
                : 'Practice makes perfect!'}
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 text-lg font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl py-3 text-lg font-bold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
          title="❓ Quiz Time!"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={((currentQ + 1) / questions.length) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Question counter */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 font-medium">
                  Question {currentQ + 1}/{questions.length}
                </span>
                <span className="text-sm font-bold text-green-500">
                  Score: {score}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-center mb-4">
                {question.question}
              </h3>

              {/* Emoji */}
              <motion.div
                className="text-6xl md:text-8xl text-center mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {question.emoji}
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === question.correct;
                  const showResult = selectedAnswer !== null;

                  let bgClass = `bg-gradient-to-r ${optionColors[i]} text-white`;
                  if (showResult) {
                    if (isCorrect) {
                      bgClass = 'bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300';
                    } else {
                      bgClass = 'bg-gray-200 text-gray-400';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`${bgClass} rounded-2xl p-3 md:p-4 text-left flex items-center gap-2 shadow-md transition-all`}
                      whileHover={!showResult ? { scale: 1.03 } : {}}
                      whileTap={!showResult ? { scale: 0.97 } : {}}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold">
                        {showResult
                          ? isCorrect
                            ? '✓'
                            : isSelected
                            ? '✗'
                            : optionLetters[i]
                          : optionLetters[i]}
                      </span>
                      <span className="font-bold text-sm md:text-base">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GameBackground>
  );
};

export default QuizScreen;
