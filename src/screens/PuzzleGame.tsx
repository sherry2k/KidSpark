import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration from '../components/Celebration';
import { GameProgress } from '../store/gameStore';

interface PuzzleGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type PuzzleType = 'shape-match' | 'pattern' | 'size-sort' | null;

// Shape matching data
const SHAPE_MATCH_LEVELS = [
  { items: [
    { id: '1', emoji: '🐶', shadow: '🐕' },
    { id: '2', emoji: '🐱', shadow: '🐈' },
    { id: '3', emoji: '🐰', shadow: '🐇' },
    { id: '4', emoji: '🦊', shadow: '🦊' },
  ]},
  { items: [
    { id: '1', emoji: '🍎', shadow: '🍎' },
    { id: '2', emoji: '🍌', shadow: '🍌' },
    { id: '3', emoji: '🍇', shadow: '🍇' },
    { id: '4', emoji: '🍓', shadow: '🍓' },
  ]},
  { items: [
    { id: '1', emoji: '🚗', shadow: '🚗' },
    { id: '2', emoji: '✈️', shadow: '✈️' },
    { id: '3', emoji: '🚂', shadow: '🚂' },
    { id: '4', emoji: '⛵', shadow: '⛵' },
  ]},
];

// Pattern puzzles
const PATTERN_LEVELS = [
  { pattern: ['🔴', '🟡', '🔴', '🟡'], next: '🔴', options: ['🔴', '🟢', '🔵'] },
  { pattern: ['⭐', '🌙', '⭐', '🌙'], next: '⭐', options: ['⭐', '☀️', '💫'] },
  { pattern: ['🐶', '🐱', '🐶', '🐱'], next: '🐶', options: ['🐶', '🐰', '🦊'] },
  { pattern: ['🍎', '🍌', '🍎', '🍌'], next: '🍎', options: ['🍎', '🍇', '🍓'] },
  { pattern: ['🔺', '🔵', '🔺', '🔵'], next: '🔺', options: ['🔺', '⬛', '❤️'] },
];

// Size sorting puzzles
const SIZE_SORT_LEVELS = [
  { items: [
    { emoji: '🐘', size: 4, label: 'Elephant' },
    { emoji: '🐕', size: 2, label: 'Dog' },
    { emoji: '🐭', size: 1, label: 'Mouse' },
    { emoji: '🦁', size: 3, label: 'Lion' },
  ]},
  { items: [
    { emoji: '🌳', size: 4, label: 'Tree' },
    { emoji: '🌷', size: 2, label: 'Flower' },
    { emoji: '🌱', size: 1, label: 'Sprout' },
    { emoji: '🌲', size: 3, label: 'Pine' },
  ]},
  { items: [
    { emoji: '🐳', size: 4, label: 'Whale' },
    { emoji: '🐬', size: 3, label: 'Dolphin' },
    { emoji: '🐟', size: 2, label: 'Fish' },
    { emoji: '🐠', size: 1, label: 'Small Fish' },
  ]},
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ progress, onBack, onComplete }) => {
  const [puzzleType, setPuzzleType] = useState<PuzzleType>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Shape match state
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Pattern state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Size sort state
  const [sortedItems, setSortedItems] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);

  // Reset states when changing puzzle
  useEffect(() => {
    setMatches({});
    setSelectedItem(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSortedItems([]);
    if (puzzleType === 'size-sort') {
      const shuffled = [...SIZE_SORT_LEVELS[currentLevel].items].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled);
    }
  }, [puzzleType, currentLevel]);

  const handleLevelComplete = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => {
      onComplete(3);
    }, 500);
  }, [onComplete]);

  const nextLevel = () => {
    setShowCelebration(false);
    const levels = puzzleType === 'shape-match' ? SHAPE_MATCH_LEVELS.length :
                   puzzleType === 'pattern' ? PATTERN_LEVELS.length :
                   SIZE_SORT_LEVELS.length;
    
    if (currentLevel < levels - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setPuzzleType(null);
      setCurrentLevel(0);
    }
  };

  // ========================================
  // PUZZLE TYPE SELECTION SCREEN
  // ========================================
  if (!puzzleType) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🧩 Puzzle Games" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto py-4">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Choose a Puzzle! 🎯
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
              {/* Shape Match */}
              <motion.button
                onClick={() => { setPuzzleType('shape-match'); setCurrentLevel(0); }}
                className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white"
                style={{
                  boxShadow: '0 8px 0 #0369A1, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '180px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #0369A1, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.div>
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  Shape Match
                </h3>
                <p className="text-sm opacity-90">
                  Match pictures to their pairs!
                </p>
                <div className="mt-3 flex justify-center gap-1">
                  <span>⭐</span>
                  <span className="text-xs opacity-75">Easy</span>
                </div>
              </motion.button>

              {/* Pattern Puzzle */}
              <motion.button
                onClick={() => { setPuzzleType('pattern'); setCurrentLevel(0); }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white"
                style={{
                  boxShadow: '0 8px 0 #6B21A8, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '180px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #6B21A8, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🌈
                </motion.div>
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  Pattern Fun
                </h3>
                <p className="text-sm opacity-90">
                  Complete the pattern!
                </p>
                <div className="mt-3 flex justify-center gap-1">
                  <span>⭐⭐</span>
                  <span className="text-xs opacity-75">Medium</span>
                </div>
              </motion.button>

              {/* Size Sort */}
              <motion.button
                onClick={() => { setPuzzleType('size-sort'); setCurrentLevel(0); }}
                className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white"
                style={{
                  boxShadow: '0 8px 0 #991B1B, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '180px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #991B1B, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  📏
                </motion.div>
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  Size Sort
                </h3>
                <p className="text-sm opacity-90">
                  Arrange from small to big!
                </p>
                <div className="mt-3 flex justify-center gap-1">
                  <span>⭐⭐</span>
                  <span className="text-xs opacity-75">Medium</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ========================================
  // CELEBRATION SCREEN
  // ========================================
  if (showCelebration) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={true} message="Great Job!" stars={3} />
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border-4 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2 
              className="text-3xl font-bold text-gray-800 mb-4" 
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              🎉 Awesome! 🎉
            </h2>
            <p className="text-gray-600 mb-6">You solved it perfectly!</p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button 
                onClick={() => { setPuzzleType(null); setCurrentLevel(0); }}
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #374151, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Menu
              </motion.button>
              <motion.button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #047857, 0 6px 15px rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileTap={{ scale: 0.95 }}
              >
                ➡️ Next
              </motion.button>
            </div>
          </motion.div>
        </div>
      </GameBackground>
    );
  }

  // ========================================
  // SHAPE MATCH PUZZLE
  // ========================================
  if (puzzleType === 'shape-match') {
    const level = SHAPE_MATCH_LEVELS[currentLevel];
    const allMatched = Object.keys(matches).length === level.items.length;

    if (allMatched && !showCelebration) {
      setTimeout(() => handleLevelComplete(), 500);
    }

    const handleItemClick = (id: string) => {
      if (matches[id]) return;
      setSelectedItem(id === selectedItem ? null : id);
    };

    const handleShadowClick = (shadowId: string) => {
      if (!selectedItem) return;
      if (Object.values(matches).includes(shadowId)) return;
      
      if (selectedItem === shadowId) {
        setMatches({ ...matches, [selectedItem]: shadowId });
        setSelectedItem(null);
      } else {
        setSelectedItem(null);
      }
    };

    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation 
            title={`🎯 Match ${currentLevel + 1}/${SHAPE_MATCH_LEVELS.length}`} 
            onBack={() => setPuzzleType(null)} 
            stars={progress.stars} 
          />
          
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            <motion.p
              className="text-lg md:text-xl font-bold text-gray-700 mb-6 bg-white/80 rounded-full px-6 py-2 shadow-md"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Tap picture, then tap matching pair! 👆
            </motion.p>

            <div className="w-full max-w-md space-y-6">
              {/* Items */}
              <div>
                <p className="text-center text-sm font-bold text-gray-600 mb-2">Pictures:</p>
                <div className="grid grid-cols-4 gap-3">
                  {level.items.map((item) => {
                    const isMatched = matches[item.id];
                    const isSelected = selectedItem === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg border-4 transition-all ${
                          isMatched 
                            ? 'bg-green-100 border-green-400 opacity-50' 
                            : isSelected 
                              ? 'bg-yellow-200 border-yellow-500 scale-110' 
                              : 'bg-white border-white'
                        }`}
                        style={{
                          boxShadow: isSelected 
                            ? '0 6px 0 #F59E0B' 
                            : '0 4px 0 rgba(0,0,0,0.1)'
                        }}
                        whileHover={!isMatched ? { scale: 1.05 } : {}}
                        whileTap={!isMatched ? { scale: 0.95 } : {}}
                        disabled={!!isMatched}
                      >
                        {isMatched ? '✅' : item.emoji}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Shadows */}
              <div>
                <p className="text-center text-sm font-bold text-gray-600 mb-2">Match with:</p>
                <div className="grid grid-cols-4 gap-3">
                  {level.items.map((item) => {
                    const isUsed = Object.values(matches).includes(item.id);
                    return (
                      <motion.button
                        key={`shadow-${item.id}`}
                        onClick={() => handleShadowClick(item.id)}
                        className={`aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg border-4 transition-all ${
                          isUsed 
                            ? 'bg-green-100 border-green-400' 
                            : 'bg-gray-200 border-white'
                        }`}
                        style={{
                          filter: isUsed ? 'none' : 'grayscale(100%) opacity(0.4)',
                          boxShadow: '0 4px 0 rgba(0,0,0,0.15)'
                        }}
                        whileHover={!isUsed ? { scale: 1.05 } : {}}
                        whileTap={!isUsed ? { scale: 0.95 } : {}}
                        disabled={!!isUsed}
                      >
                        {isUsed ? '✅' : item.shadow}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Progress */}
              <div className="text-center">
                <p className="text-gray-600 font-bold">
                  Matched: {Object.keys(matches).length} / {level.items.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ========================================
  // PATTERN PUZZLE
  // ========================================
  if (puzzleType === 'pattern') {
    const level = PATTERN_LEVELS[currentLevel];

    const handleAnswerClick = (answer: string) => {
      setSelectedAnswer(answer);
      const correct = answer === level.next;
      setIsCorrect(correct);
      
      if (correct) {
        setTimeout(() => handleLevelComplete(), 800);
      } else {
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsCorrect(null);
        }, 1000);
      }
    };

    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation 
            title={`🌈 Pattern ${currentLevel + 1}/${PATTERN_LEVELS.length}`} 
            onBack={() => setPuzzleType(null)} 
            stars={progress.stars} 
          />
          
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            <motion.p
              className="text-lg md:text-xl font-bold text-gray-700 mb-6 bg-white/80 rounded-full px-6 py-2 shadow-md"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              What comes next? 🤔
            </motion.p>

            {/* Pattern Display */}
            <div className="bg-white/95 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white mb-8 w-full max-w-md">
              <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                {level.pattern.map((item, i) => (
                  <motion.div
                    key={i}
                    className="text-5xl md:text-6xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item}
                  </motion.div>
                ))}
                <motion.div
                  className="text-5xl md:text-6xl bg-yellow-200 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border-4 border-yellow-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ❓
                </motion.div>
              </div>
            </div>

            {/* Options */}
            <p 
              className="text-lg font-bold text-gray-700 mb-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Choose your answer:
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {level.options.map((option, i) => {
                const isSelected = selectedAnswer === option;
                const showResult = isSelected && isCorrect !== null;
                
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswerClick(option)}
                    disabled={selectedAnswer !== null}
                    className={`aspect-square rounded-3xl flex items-center justify-center text-5xl md:text-6xl shadow-xl border-4 transition-all ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-200 border-green-500 scale-110'
                          : 'bg-red-200 border-red-500'
                        : 'bg-white border-white'
                    }`}
                    style={{
                      boxShadow: showResult && isCorrect
                        ? '0 6px 0 #047857'
                        : showResult && !isCorrect
                          ? '0 6px 0 #B91C1C'
                          : '0 6px 0 rgba(0,0,0,0.15)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={selectedAnswer === null ? { scale: 1.1, y: -5 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.9, y: 4 } : {}}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ========================================
  // SIZE SORT PUZZLE
  // ========================================
  if (puzzleType === 'size-sort') {
    const level = SIZE_SORT_LEVELS[currentLevel];

    const handleItemPick = (item: any) => {
      setSortedItems([...sortedItems, item]);
      setAvailableItems(availableItems.filter(i => i.emoji !== item.emoji));
      
      if (sortedItems.length + 1 === level.items.length) {
        // Check if sorted correctly (smallest to largest)
        const sorted = [...sortedItems, item];
        const isCorrect = sorted.every((item, i) => 
          i === 0 || item.size >= sorted[i - 1].size
        );
        
        if (isCorrect) {
          setTimeout(() => handleLevelComplete(), 500);
        } else {
          // Reset and try again
          setTimeout(() => {
            const shuffled = [...level.items].sort(() => Math.random() - 0.5);
            setAvailableItems(shuffled);
            setSortedItems([]);
          }, 1500);
        }
      }
    };

    const handleReset = () => {
      const shuffled = [...level.items].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled);
      setSortedItems([]);
    };

    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation 
            title={`📏 Sort ${currentLevel + 1}/${SIZE_SORT_LEVELS.length}`} 
            onBack={() => setPuzzleType(null)} 
            stars={progress.stars} 
          />
          
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            <motion.p
              className="text-lg md:text-xl font-bold text-gray-700 mb-4 bg-white/80 rounded-full px-6 py-2 shadow-md text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Tap items from Small to BIG! 📏
            </motion.p>

            {/* Sorted Items (Answer Row) */}
            <div className="bg-white/95 rounded-3xl p-4 md:p-6 shadow-xl border-4 border-white mb-4 w-full max-w-md">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 font-bold">
                <span>SMALL</span>
                <span className="flex-1 text-center">→</span>
                <span>BIG</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: level.items.length }).map((_, i) => {
                  const item = sortedItems[i];
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-2xl flex items-center justify-center border-4 border-dashed ${
                        item 
                          ? 'bg-green-100 border-green-400' 
                          : 'bg-gray-100 border-gray-300'
                      }`}
                      style={{ minHeight: '60px' }}
                    >
                      {item && (
                        <motion.span 
                          className="text-4xl md:text-5xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {item.emoji}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Items */}
            <p 
              className="text-lg font-bold text-gray-700 mb-3"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              Pick the smallest first:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-md">
              {availableItems.map((item, i) => (
                <motion.button
                  key={item.emoji}
                  onClick={() => handleItemPick(item)}
                  className="bg-white rounded-2xl p-3 shadow-lg border-4 border-white flex flex-col items-center"
                  style={{
                    boxShadow: '0 6px 0 rgba(0,0,0,0.15)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95, y: 4 }}
                >
                  <span 
                    className="text-5xl md:text-6xl"
                    style={{ fontSize: `${2 + item.size * 0.5}rem` }}
                  >
                    {item.emoji}
                  </span>
                  <span className="text-xs font-bold text-gray-600 mt-1">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Reset button */}
            {sortedItems.length > 0 && (
              <motion.button
                onClick={handleReset}
                className="mt-4 bg-orange-400 text-white rounded-2xl px-6 py-3 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #C2410C',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Try Again
              </motion.button>
            )}
          </div>
        </div>
      </GameBackground>
    );
  }

  return null;
};

export default PuzzleGame;
