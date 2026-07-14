import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration, { FeedbackPopup } from '../components/Celebration';
import { generateMathProblem, encouragementMessages } from '../data/gameData';
import { GameProgress, PlayerProfile } from '../store/gameStore';

interface MathGameProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const MathGame: React.FC<MathGameProps> = ({ profile, progress, onBack, onAnswer, onComplete }) => {
  const difficulty = profile.difficulty === 'easy' ? 'easy' : profile.difficulty === 'medium' ? 'medium' : 'hard';
  const totalQuestions = 10;

  const [currentQ, setCurrentQ] = useState(0);
  const [problem, setProblem] = useState(() => generateMathProblem(difficulty));
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = useCallback((answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === problem.answer;
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

      if (currentQ < totalQuestions - 1) {
        setCurrentQ((q) => q + 1);
        setProblem(generateMathProblem(difficulty));
      } else {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= totalQuestions * 0.8 ? 3 : finalScore >= totalQuestions * 0.5 ? 2 : 1;
        setIsFinished(true);
        setShowCelebration(true);
        onComplete(stars);
      }
    }, 1500);
  }, [selectedAnswer, problem, currentQ, score, difficulty, onAnswer, onComplete]);

  const optionColors = [
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-orange-400 to-amber-500',
    'from-purple-400 to-violet-500',
  ];

  if (isFinished) {
    const stars = score >= totalQuestions * 0.8 ? 3 : score >= totalQuestions * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={showCelebration} message={stars === 3 ? 'Math Genius!' : 'Great Work!'} stars={stars} />
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="text-6xl mb-3">🧮</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Math Complete! 🎉
            </h2>
            <p className="text-2xl font-bold text-purple-600 mb-2">{score} / {totalQuestions}</p>
            <p className="text-gray-500 mb-6">
              Difficulty: {difficulty === 'easy' ? '🌱 Easy' : difficulty === 'medium' ? '🌿 Medium' : '🌳 Hard'}
            </p>
            <div className="flex gap-3">
              <motion.button onClick={onBack} className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 font-bold" whileTap={{ scale: 0.98 }}>
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => { setCurrentQ(0); setScore(0); setIsFinished(false); setShowCelebration(false); setProblem(generateMathProblem(difficulty)); }}
                className="flex-1 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-2xl py-3 font-bold shadow-lg"
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
          title="🧮 Math Adventure"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={((currentQ + 1) / totalQuestions) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl max-w-lg w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <p className="text-gray-400 text-sm mb-4">
                Question {currentQ + 1} of {totalQuestions} • Score: {score}
              </p>

              {/* Math problem display */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 text-4xl md:text-6xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  <motion.span
                    className="text-blue-600"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    {problem.num1}
                  </motion.span>
                  <motion.span
                    className="text-purple-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {problem.operator}
                  </motion.span>
                  <motion.span
                    className="text-pink-600"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {problem.num2}
                  </motion.span>
                  <motion.span
                    className="text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    =
                  </motion.span>
                  <motion.span
                    className="text-yellow-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.4 }}
                  >
                    ?
                  </motion.span>
                </div>

                {/* Visual counting aids for easy mode */}
                {difficulty === 'easy' && problem.operator === '+' && (
                  <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(problem.num1, 10) }).map((_, i) => (
                        <span key={`a-${i}`} className="text-lg">🟢</span>
                      ))}
                    </div>
                    <span className="text-xl font-bold text-gray-400">+</span>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(problem.num2, 10) }).map((_, i) => (
                        <span key={`b-${i}`} className="text-lg">🔵</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-2 gap-3">
                {problem.options.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === problem.answer;
                  const showResult = selectedAnswer !== null;

                  let bgClass = `bg-gradient-to-r ${optionColors[i]} text-white`;
                  if (showResult) {
                    if (isCorrect) {
                      bgClass = 'bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300';
                    } else if (isSelected) {
                      bgClass = 'bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300';
                    } else {
                      bgClass = 'bg-gray-200 text-gray-400';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className={`${bgClass} rounded-2xl p-4 text-2xl md:text-3xl font-bold shadow-md`}
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      whileHover={!showResult ? { scale: 1.05 } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      disabled={selectedAnswer !== null}
                    >
                      {showResult && isCorrect ? '✓ ' : showResult && isSelected ? '✗ ' : ''}{option}
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

export default MathGame;
