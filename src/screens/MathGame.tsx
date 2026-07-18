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

  // Colorful gradients for answer buttons
  const optionStyles = [
    { gradient: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
    { gradient: 'from-green-500 to-emerald-500', shadow: '#047857' },
    { gradient: 'from-orange-500 to-red-500', shadow: '#C2410C' },
    { gradient: 'from-purple-500 to-pink-500', shadow: '#7B2CBF' },
  ];

  if (isFinished) {
    const stars = score >= totalQuestions * 0.8 ? 3 : score >= totalQuestions * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={showCelebration} message={stars === 3 ? 'Math Genius!' : 'Great Work!'} stars={stars} />
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
              🧮
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Math Complete! 🎉
            </h2>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 mb-4 text-white">
              <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {score} / {totalQuestions}
              </p>
              <p className="text-sm mt-1 opacity-90">Correct Answers</p>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Difficulty: {difficulty === 'easy' ? '🌱 Easy' : difficulty === 'medium' ? '🌿 Medium' : '🌳 Hard'}
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
                onClick={() => { setCurrentQ(0); setScore(0); setIsFinished(false); setShowCelebration(false); setProblem(generateMathProblem(difficulty)); }}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #B91C1C, 0 6px 15px rgba(0,0,0,0.2)',
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
          title="🧮 Math"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={((currentQ + 1) / totalQuestions) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              className="max-w-2xl mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {/* Score Bar */}
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Question</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {currentQ + 1}/{totalQuestions}
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
                  <p className="text-xs opacity-90">Level</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {difficulty === 'easy' ? '🌱' : difficulty === 'medium' ? '🌿' : '🌳'}
                  </p>
                </div>
              </motion.div>

              {/* Main Card */}
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {/* Title */}
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                    style={{ fontFamily: "'Bubblegum One', cursive" }}
                  >
                    Solve the Problem! 🧠
                  </h2>
                </motion.div>

                {/* BIG Math Problem Display */}
                <motion.div 
                  className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-6 md:p-8 mb-6 border-4 border-white shadow-lg"
                  style={{
                    boxShadow: '0 6px 0 rgba(139, 92, 246, 0.2), 0 8px 20px rgba(0,0,0,0.1)',
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {/* First Number */}
                    <motion.div
                      className="bg-white rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border-4 border-blue-400"
                      style={{
                        boxShadow: '0 4px 0 #1E40AF, 0 6px 15px rgba(0,0,0,0.1)',
                      }}
                      initial={{ x: -30, opacity: 0, rotate: -10 }}
                      animate={{ x: 0, opacity: 1, rotate: 0 }}
                      transition={{ type: 'spring' }}
                    >
                      <span 
                        className="text-blue-600"
                        style={{ 
                          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                          textShadow: '2px 2px 0 rgba(0,0,0,0.1)'
                        }}
                      >
                        {problem.num1}
                      </span>
                    </motion.div>

                    {/* Operator */}
                    <motion.div
                      className="bg-purple-500 text-white rounded-full w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-lg border-4 border-white"
                      style={{
                        boxShadow: '0 4px 0 #7B2CBF, 0 6px 15px rgba(0,0,0,0.15)',
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                    >
                      <span 
                        style={{ 
                          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                        }}
                      >
                        {problem.operator}
                      </span>
                    </motion.div>

                    {/* Second Number */}
                    <motion.div
                      className="bg-white rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border-4 border-pink-400"
                      style={{
                        boxShadow: '0 4px 0 #BE185D, 0 6px 15px rgba(0,0,0,0.1)',
                      }}
                      initial={{ x: 30, opacity: 0, rotate: 10 }}
                      animate={{ x: 0, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <span 
                        className="text-pink-600"
                        style={{ 
                          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                          textShadow: '2px 2px 0 rgba(0,0,0,0.1)'
                        }}
                      >
                        {problem.num2}
                      </span>
                    </motion.div>

                    {/* Equals */}
                    <motion.span
                      className="text-gray-500 text-4xl md:text-5xl font-bold"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      =
                    </motion.span>

                    {/* Question Mark */}
                    <motion.div
                      className="bg-yellow-400 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border-4 border-white"
                      style={{
                        boxShadow: '0 4px 0 #D97706, 0 6px 15px rgba(0,0,0,0.15)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.3, 1],
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ 
                        delay: 0.4,
                        rotate: { duration: 1, repeat: Infinity, delay: 0.5 }
                      }}
                    >
                      <span 
                        className="text-white font-bold"
                        style={{ 
                          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                        }}
                      >
                        ?
                      </span>
                    </motion.div>
                  </div>

                  {/* Visual counting aids for easy mode */}
                  {difficulty === 'easy' && problem.operator === '+' && (
                    <motion.div 
                      className="mt-6 bg-white/70 rounded-2xl p-4 flex items-center justify-center gap-3 md:gap-4 flex-wrap"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex gap-1 flex-wrap justify-center">
                        {Array.from({ length: Math.min(problem.num1, 10) }).map((_, i) => (
                          <motion.span 
                            key={`a-${i}`} 
                            className="text-2xl md:text-3xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.05 }}
                          >
                            🟢
                          </motion.span>
                        ))}
                      </div>
                      <span className="text-2xl md:text-3xl font-bold text-gray-500">+</span>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {Array.from({ length: Math.min(problem.num2, 10) }).map((_, i) => (
                          <motion.span 
                            key={`b-${i}`} 
                            className="text-2xl md:text-3xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 + i * 0.05 }}
                          >
                            🔵
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Answer Section Header */}
                <p 
                  className="text-center text-base md:text-lg font-bold text-gray-700 mb-3"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  👆 Choose your answer:
                </p>

                {/* Answer options - BIGGER */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {problem.options.map((option, i) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === problem.answer;
                    const showResult = selectedAnswer !== null;
                    const style = optionStyles[i];

                    let bgClass = `bg-gradient-to-br ${style.gradient} text-white border-white`;
                    let currentShadow = style.shadow;
                    
                    if (showResult) {
                      if (isCorrect) {
                        bgClass = 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-white ring-4 ring-green-300';
                        currentShadow = '#047857';
                      } else if (isSelected) {
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
                        onClick={() => handleAnswer(option)}
                        className={`${bgClass} rounded-2xl border-4 shadow-lg`}
                        style={{ 
                          fontFamily: "'Bubblegum One', cursive",
                          fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                          minHeight: '80px',
                          boxShadow: `0 6px 0 ${currentShadow}, 0 8px 15px rgba(0,0,0,0.15)`,
                          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                        }}
                        initial={{ y: 20, opacity: 0, scale: 0 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.05, type: 'spring' }}
                        whileHover={!showResult ? { scale: 1.05, y: -3 } : {}}
                        whileTap={!showResult ? { 
                          scale: 0.95, 
                          y: 3,
                          boxShadow: `0 2px 0 ${currentShadow}, 0 4px 10px rgba(0,0,0,0.15)`
                        } : {}}
                        disabled={selectedAnswer !== null}
                      >
                        {showResult && isCorrect && '✓ '}
                        {showResult && isSelected && !isCorrect && '✗ '}
                        {option}
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

export default MathGame;
