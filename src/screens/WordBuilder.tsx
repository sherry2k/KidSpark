import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration, { FeedbackPopup } from '../components/Celebration';
import { encouragementMessages } from '../data/gameData';
import { useContent } from '../context/ContentContext';
import { GameProgress, PlayerProfile } from '../store/gameStore';
import { wordsForLevel } from '../utils/difficulty';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
import SparkResult from '../components/SparkResult';
import MissingLetter from './MissingLetter';

/**
 * Words — now a small hub with two games:
 *
 *   Build the Word   the game you already had: tap the scrambled letters in order.
 *   Missing Letter   NEW: a picture and its word with one letter missing (see MissingLetter.tsx).
 *
 * Both use the same word list (wordBuilderWords) and the same age level.
 * The NEW ribbon on Missing Letter goes away by itself after NEW_UNTIL.
 */

interface WordBuilderProps {
  profile?: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

/* ================================================================== */
/* Build the Word — unchanged, except that "Home" now returns to the   */
/* Words menu                                                          */
/* ================================================================== */

const BuildGame: React.FC<WordBuilderProps> = ({ progress, onBack, onComplete, profile }) => {
  const { wordBuilderWords: allWords } = useContent();
  const wordBuilderWords = wordsForLevel(allWords, profile?.difficulty);
  const totalWords = 8;
  const [words, setWords] = useState(() => {
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

  const handleLetterClick = useCallback((index: number) => {
    if (selectedLetters.includes(index)) {
      // 🎵 Play click when removing letter
      playClick();
      setSelectedLetters((prev) => prev.filter((i) => i !== index));
      return;
    }

    // 🎵 Play click when adding letter
    playClick();

    const newSelected = [...selectedLetters, index];
    setSelectedLetters(newSelected);

    if (newSelected.length === currentWord.word.length) {
      const built = newSelected.map((i) => availableLetters[i]).join('');
      const correct = built === currentWord.word;

      setFeedbackCorrect(correct);
      if (correct) {
        // 🎵 Correct word built!
        playCorrect();
        setScore((s) => s + 1);
        const msgs = encouragementMessages.correct;
        setFeedbackMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      } else {
        // 🎵 Wrong word built!
        playWrong();
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

            // 🎵 All words complete!
            playComplete();

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
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border-4 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <SparkResult stars={stars} />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              All Words Built! 🎉
            </h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-6 text-white">
              <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {score} / {totalWords}
              </p>
              <p className="text-sm mt-1 opacity-90">Words Correct</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => { playClick(); onBack(); }}
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #374151, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
              >
                📝 Words
              </motion.button>
              <motion.button
                onClick={() => {
                  playClick();
                  const shuffled = [...wordBuilderWords].sort(() => Math.random() - 0.5).slice(0, totalWords);
                  setWords(shuffled);
                  setCurrentIndex(0);
                  setScore(0);
                  setIsFinished(false);
                  setShowCelebration(false);
                  setAvailableLetters([...shuffled[0].word].sort(() => Math.random() - 0.5));
                  setSelectedLetters([]);
                }}
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #1E40AF, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
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
          title="📝 Build the Word"
          onBack={() => { playClick(); onBack(); }}
          stars={progress.stars}
          showProgress
          progress={((currentIndex + 1) / words.length) * 100}
        />

        <FeedbackPopup show={showFeedback} correct={feedbackCorrect} message={feedbackMessage} />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="max-w-2xl mx-auto"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring' }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Word</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {currentIndex + 1}/{words.length}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Score</p>
                  <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    ⭐ {score}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <motion.div
                  className="text-8xl md:text-9xl mb-3 text-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentWord.emoji}
                </motion.div>

                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2
                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "'Bubblegum One', cursive" }}
                  >
                    Build the Word!
                  </h2>
                </motion.div>

                {/* Hint Button */}
                <motion.div className="text-center mb-4">
                  <motion.button
                    onClick={() => { playClick(); setShowHint(!showHint); }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-6 py-3 font-bold shadow-lg border-4 border-white text-base md:text-lg"
                    style={{
                      boxShadow: '0 4px 0 #B45309, 0 6px 15px rgba(0,0,0,0.15)',
                      fontFamily: "'Bubblegum One', cursive"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, y: 3 }}
                  >
                    💡 {showHint ? currentWord.hint : 'Need a Hint?'}
                  </motion.button>
                </motion.div>

                {/* Word Slots */}
                <div className="flex justify-center gap-2 md:gap-3 mb-6 flex-wrap">
                  {currentWord.word.split('').map((_letter, i) => {
                    const filled = i < selectedLetters.length;
                    const displayLetter = filled ? availableLetters[selectedLetters[i]] : '';

                    return (
                      <motion.button
                        key={i}
                        onClick={() => {
                          if (filled) {
                            playClick();
                            setSelectedLetters((prev) => prev.slice(0, i));
                          }
                        }}
                        className={`rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold border-4 shadow-lg ${
                          filled
                            ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-white text-white'
                            : 'bg-gray-100 border-gray-300 border-dashed text-gray-400'
                        }`}
                        style={{
                          fontFamily: "'Bubblegum One', cursive",
                          width: '65px',
                          height: '75px',
                          boxShadow: filled
                            ? '0 6px 0 #1E40AF, 0 8px 15px rgba(0,0,0,0.15)'
                            : 'inset 0 2px 4px rgba(0,0,0,0.05)',
                          textShadow: filled ? '2px 2px 0 rgba(0,0,0,0.15)' : 'none'
                        }}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={filled ? { scale: 0.95, y: 3 } : {}}
                      >
                        {filled ? (
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring' }}
                          >
                            {displayLetter}
                          </motion.span>
                        ) : (
                          '_'
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <p
                  className="text-center text-base md:text-lg font-bold text-gray-700 mb-3"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  👆 Tap the letters:
                </p>

                {/* Available Letters */}
                <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                  {availableLetters.map((letter, i) => {
                    const isUsed = selectedLetters.includes(i);

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleLetterClick(i)}
                        disabled={isUsed}
                        className={`rounded-2xl text-3xl md:text-4xl font-bold border-4 border-white transition-all ${
                          isUsed
                            ? 'bg-gray-200 text-gray-400 cursor-default'
                            : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white cursor-pointer'
                        }`}
                        style={{
                          fontFamily: "'Bubblegum One', cursive",
                          width: '65px',
                          height: '70px',
                          boxShadow: isUsed
                            ? 'none'
                            : '0 6px 0 #C2410C, 0 8px 15px rgba(0,0,0,0.15)',
                          textShadow: !isUsed ? '2px 2px 0 rgba(0,0,0,0.2)' : 'none'
                        }}
                        whileHover={!isUsed ? { scale: 1.1, y: -3 } : {}}
                        whileTap={!isUsed ? {
                          scale: 0.95,
                          y: 3,
                          boxShadow: '0 2px 0 #C2410C, 0 4px 10px rgba(0,0,0,0.15)'
                        } : {}}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                      >
                        {letter}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Clear button */}
                {selectedLetters.length > 0 && (
                  <motion.div className="mt-6 text-center">
                    <motion.button
                      onClick={() => { playClick(); setSelectedLetters([]); }}
                      className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl px-6 py-3 font-bold shadow-lg border-4 border-white"
                      style={{
                        boxShadow: '0 4px 0 #B91C1C, 0 6px 15px rgba(0,0,0,0.15)',
                        fontFamily: "'Bubblegum One', cursive"
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.95, y: 3 }}
                    >
                      🗑️ Clear All
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GameBackground>
  );
};

/* ================================================================== */
/* The Words menu                                                      */
/* ================================================================== */

/** the NEW ribbon on Missing Letter disappears by itself after this day */
const NEW_UNTIL = '2026-12-03';
const FRESH = Date.now() < Date.parse(NEW_UNTIL);

const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";

type Mode = 'menu' | 'build' | 'missing';

const CARDS: {
  id: Exclude<Mode, 'menu'>;
  title: string;
  sub: string;
  icon: string;
  grad: string;
  shadow: string;
  stars: number;
  isNew: boolean;
}[] = [
  { id: 'missing', title: 'Missing Letter', sub: 'Find the missing letter!', icon: '🔍', grad: 'from-sky-400 to-blue-500', shadow: '#1D4ED8', stars: 1, isNew: FRESH },
  { id: 'build', title: 'Build the Word', sub: 'Put the letters in order!', icon: '🧩', grad: 'from-purple-500 to-pink-500', shadow: '#6B21A8', stars: 2, isNew: false },
];

const WordBuilder: React.FC<WordBuilderProps> = (props) => {
  const [mode, setMode] = useState<Mode>('menu');

  if (mode === 'build') return <BuildGame {...props} onBack={() => setMode('menu')} />;
  if (mode === 'missing') return <MissingLetter {...props} onBack={() => setMode('menu')} />;

  /* NEW cards first */
  const cards = [...CARDS].sort((a, b) => Number(b.isNew) - Number(a.isNew));

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation title="📝 Words" onBack={() => { playClick(); props.onBack(); }} stars={props.progress.stars} />
        <div className="flex-1 overflow-y-auto" style={{ padding: '8px 16px 32px' }}>
          <h2 className="font-bold text-gray-800 text-center" style={{ fontFamily: FONT, fontSize: 20, marginBottom: 14 }}>
            Choose a word game! 📝
          </h2>

          <div className="grid grid-cols-2 max-w-lg mx-auto" style={{ gap: 12 }}>
            {cards.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => { playClick(); setMode(c.id); }}
                className={`relative overflow-hidden text-white border-white bg-gradient-to-br ${c.grad}`}
                style={{
                  borderRadius: 24,
                  borderWidth: 4,
                  borderStyle: 'solid',
                  boxShadow: `0 8px 0 ${c.shadow}, 0 12px 22px rgba(0,0,0,.18)`,
                  minHeight: 160,
                  padding: '16px 8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, type: 'spring' }}
                whileTap={{ scale: 0.94, y: 4 }}
              >
                {c.isNew && (
                  <div
                    className="absolute text-center text-white font-bold bg-gradient-to-r from-red-500 to-pink-500 shadow-md"
                    style={{ top: 14, right: -28, width: 92, transform: 'rotate(40deg)', fontSize: 11, letterSpacing: '1px', padding: '2px 0', borderTop: '1.5px solid #fff', borderBottom: '1.5px solid #fff' }}
                  >
                    NEW
                  </div>
                )}
                <span style={{ fontSize: 52, lineHeight: 1 }}>{c.icon}</span>
                <span className="font-bold" style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.1, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                  {c.title}
                </span>
                <span style={{ fontSize: 12, opacity: 0.92, lineHeight: 1.15 }}>{c.sub}</span>
                <span className="flex" style={{ gap: 2, marginTop: 2 }}>
                  {[1, 2, 3].map((d) => (
                    <span key={d} style={{ fontSize: 11, opacity: d <= c.stars ? 1 : 0.28 }}>⭐</span>
                  ))}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default WordBuilder;
