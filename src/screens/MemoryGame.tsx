import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration from '../components/Celebration';
import { memoryGameSets } from '../data/gameData';
import { GameProgress } from '../store/gameStore';

interface MemoryCard {
  id: string;
  pairId: string;
  emoji: string;
  name: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type GameType = 'menu' | 'memory' | 'quicktap' | 'colormemory';

// Color Memory game data
const COLOR_SEQUENCE = [
  { color: '#ef4444', name: 'Red', emoji: '🔴' },
  { color: '#3b82f6', name: 'Blue', emoji: '🔵' },
  { color: '#22c55e', name: 'Green', emoji: '🟢' },
  { color: '#eab308', name: 'Yellow', emoji: '🟡' },
];

// Quick Tap items
const QUICK_TAP_ITEMS = [
  { emoji: '⭐', target: true },
  { emoji: '🎈', target: false },
  { emoji: '🎨', target: false },
  { emoji: '🎁', target: false },
  { emoji: '🎯', target: false },
];

const MemoryGame: React.FC<MemoryGameProps> = ({ progress, onBack, onComplete }) => {
  const [gameType, setGameType] = useState<GameType>('menu');
  
  // Memory Game state
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [totalPairs, setTotalPairs] = useState(0);
  
  // Shared state
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Quick Tap state
  const [quickTapItems, setQuickTapItems] = useState<any[]>([]);
  const [quickTapScore, setQuickTapScore] = useState(0);
  const [quickTapTimeLeft, setQuickTapTimeLeft] = useState(30);
  const [quickTapActive, setQuickTapActive] = useState(false);
  
  // Color Memory state
  const [colorSequence, setColorSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [currentColorLevel, setCurrentColorLevel] = useState(1);
  const [showingSequence, setShowingSequence] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [colorGameActive, setColorGameActive] = useState(false);

  // ============================================
  // MEMORY GAME FUNCTIONS
  // ============================================
  const initMemoryGame = useCallback((setKey: string) => {
    const items = memoryGameSets[setKey as keyof typeof memoryGameSets];
    const pairsCount = Math.min(6, items.length);
    const selected = items.slice(0, pairsCount);
    
    const cardPairs: MemoryCard[] = [];
    selected.forEach((item) => {
      cardPairs.push(
        { id: `${item.id}-a`, pairId: item.id, emoji: item.emoji, name: item.name, flipped: false, matched: false },
        { id: `${item.id}-b`, pairId: item.id, emoji: item.emoji, name: item.name, flipped: false, matched: false }
      );
    });

    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTotalPairs(pairsCount);
    setShowCelebration(false);
    setIsLocked(false);
    setSelectedSet(setKey);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (isLocked || cards[index].flipped || cards[index].matched || flippedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      if (newCards[first].pairId === newCards[second].pairId) {
        setTimeout(() => {
          const matched = [...newCards];
          matched[first].matched = true;
          matched[second].matched = true;
          setCards(matched);
          setFlippedCards([]);
          setIsLocked(false);

          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          if (newMatchedPairs === totalPairs) {
            setShowCelebration(true);
            const stars = moves < totalPairs * 2 ? 3 : moves < totalPairs * 3 ? 2 : 1;
            onComplete(stars);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const reset = [...newCards];
          reset[first].flipped = false;
          reset[second].flipped = false;
          setCards(reset);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isLocked, matchedPairs, totalPairs, moves, onComplete]);

  // ============================================
  // QUICK TAP FUNCTIONS
  // ============================================
  const generateQuickTapItems = () => {
    const items = [];
    for (let i = 0; i < 9; i++) {
      const isTarget = Math.random() > 0.6;
      items.push({
        id: Date.now() + i,
        emoji: isTarget ? '⭐' : QUICK_TAP_ITEMS[Math.floor(Math.random() * QUICK_TAP_ITEMS.length)].emoji,
        target: isTarget,
        tapped: false,
      });
    }
    return items;
  };

  const startQuickTap = () => {
    setQuickTapScore(0);
    setQuickTapTimeLeft(30);
    setQuickTapActive(true);
    setQuickTapItems(generateQuickTapItems());
  };

  const handleQuickTap = (index: number) => {
    if (!quickTapActive) return;
    const newItems = [...quickTapItems];
    if (newItems[index].tapped) return;
    
    if (newItems[index].target) {
      setQuickTapScore(s => s + 1);
      newItems[index].tapped = true;
      setQuickTapItems(newItems);
      
      setTimeout(() => {
        setQuickTapItems(generateQuickTapItems());
      }, 200);
    } else {
      setQuickTapScore(s => Math.max(0, s - 1));
      newItems[index].tapped = true;
      setQuickTapItems(newItems);
      
      setTimeout(() => {
        newItems[index].tapped = false;
        setQuickTapItems([...newItems]);
      }, 300);
    }
  };

  // Quick Tap timer
  useEffect(() => {
    if (!quickTapActive) return;
    const timer = setInterval(() => {
      setQuickTapTimeLeft((t) => {
        if (t <= 1) {
          setQuickTapActive(false);
          setShowCelebration(true);
          const stars = quickTapScore >= 20 ? 3 : quickTapScore >= 10 ? 2 : 1;
          onComplete(stars);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quickTapActive, quickTapScore, onComplete]);

  // ============================================
  // COLOR MEMORY FUNCTIONS
  // ============================================
  const startColorMemory = () => {
    setColorGameActive(true);
    setCurrentColorLevel(1);
    setPlayerSequence([]);
    const initial = [Math.floor(Math.random() * 4)];
    setColorSequence(initial);
    playSequence(initial);
  };

  const playSequence = (sequence: number[]) => {
    setShowingSequence(true);
    setPlayerSequence([]);
    
    sequence.forEach((color, i) => {
      setTimeout(() => {
        setActiveColorIndex(color);
        setTimeout(() => {
          setActiveColorIndex(null);
          if (i === sequence.length - 1) {
            setShowingSequence(false);
          }
        }, 500);
      }, (i + 1) * 800);
    });
  };

  const handleColorTap = (index: number) => {
    if (showingSequence || !colorGameActive) return;
    
    setActiveColorIndex(index);
    setTimeout(() => setActiveColorIndex(null), 300);
    
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);
    
    // Check if wrong
    if (newPlayerSeq[newPlayerSeq.length - 1] !== colorSequence[newPlayerSeq.length - 1]) {
      setTimeout(() => {
        setColorGameActive(false);
        setShowCelebration(true);
        const stars = currentColorLevel >= 8 ? 3 : currentColorLevel >= 5 ? 2 : 1;
        onComplete(stars);
      }, 500);
      return;
    }
    
    // Check if complete sequence
    if (newPlayerSeq.length === colorSequence.length) {
      setTimeout(() => {
        setCurrentColorLevel(l => l + 1);
        const newSeq = [...colorSequence, Math.floor(Math.random() * 4)];
        setColorSequence(newSeq);
        playSequence(newSeq);
      }, 500);
    }
  };

  // ============================================
  // GAME MENU
  // ============================================
  if (gameType === 'menu') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🧠 Memory Games" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Choose a Game! 🎮
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
              {/* Memory Match */}
              <motion.button
                onClick={() => setGameType('memory')}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white relative overflow-hidden"
                style={{
                  boxShadow: '0 8px 0 #6B21A8, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '200px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #6B21A8, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="absolute top-2 right-2 text-yellow-200 text-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="text-6xl md:text-7xl mb-3 text-center"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🧠
                </motion.div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-2 text-center"
                  style={{ 
                    fontFamily: "'Bubblegum One', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                  }}
                >
                  Memory Match
                </h3>
                <p className="text-white/90 text-sm text-center">
                  Flip cards to find matching pairs!
                </p>
                <div className="mt-3 text-center">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                    ⭐ Easy
                  </span>
                </div>
              </motion.button>

              {/* Quick Tap */}
              <motion.button
                onClick={() => setGameType('quicktap')}
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white relative overflow-hidden"
                style={{
                  boxShadow: '0 8px 0 #C2410C, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '200px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #C2410C, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="absolute top-2 right-2 text-yellow-200 text-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="text-6xl md:text-7xl mb-3 text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-2 text-center"
                  style={{ 
                    fontFamily: "'Bubblegum One', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                  }}
                >
                  Quick Tap
                </h3>
                <p className="text-white/90 text-sm text-center">
                  Tap ⭐ stars fast as you can!
                </p>
                <div className="mt-3 text-center">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                    ⭐⭐ Medium
                  </span>
                </div>
              </motion.button>

              {/* Color Memory */}
              <motion.button
                onClick={() => setGameType('colormemory')}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-xl border-4 border-white relative overflow-hidden"
                style={{
                  boxShadow: '0 8px 0 #0369A1, 0 12px 25px rgba(0,0,0,0.2)',
                  minHeight: '200px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                  boxShadow: '0 4px 0 #0369A1, 0 6px 15px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="absolute top-2 right-2 text-yellow-200 text-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="text-6xl md:text-7xl mb-3 text-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🌈
                </motion.div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-2 text-center"
                  style={{ 
                    fontFamily: "'Bubblegum One', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                  }}
                >
                  Color Memory
                </h3>
                <p className="text-white/90 text-sm text-center">
                  Watch and repeat the color pattern!
                </p>
                <div className="mt-3 text-center">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                    ⭐⭐⭐ Hard
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ============================================
  // CELEBRATION SCREEN
  // ============================================
  if (showCelebration) {
    const stars = gameType === 'memory' 
      ? (moves < totalPairs * 2 ? 3 : moves < totalPairs * 3 ? 2 : 1)
      : gameType === 'quicktap'
        ? (quickTapScore >= 20 ? 3 : quickTapScore >= 10 ? 2 : 1)
        : (currentColorLevel >= 8 ? 3 : currentColorLevel >= 5 ? 2 : 1);
    
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={true} message="Great Job!" stars={stars} />
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
              🎉
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Well Done! 🌟
            </h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-4 text-white">
              {gameType === 'memory' && (
                <>
                  <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {moves}
                  </p>
                  <p className="text-sm mt-1 opacity-90">Total Moves</p>
                </>
              )}
              {gameType === 'quicktap' && (
                <>
                  <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {quickTapScore}
                  </p>
                  <p className="text-sm mt-1 opacity-90">Stars Tapped!</p>
                </>
              )}
              {gameType === 'colormemory' && (
                <>
                  <p className="text-4xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    Level {currentColorLevel}
                  </p>
                  <p className="text-sm mt-1 opacity-90">Reached!</p>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => {
                  setGameType('menu');
                  setSelectedSet(null);
                  setShowCelebration(false);
                  setColorGameActive(false);
                  setQuickTapActive(false);
                }}
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
                onClick={() => {
                  setShowCelebration(false);
                  if (gameType === 'memory' && selectedSet) initMemoryGame(selectedSet);
                  else if (gameType === 'quicktap') startQuickTap();
                  else if (gameType === 'colormemory') startColorMemory();
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #047857, 0 6px 15px rgba(0,0,0,0.2)',
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

  // ============================================
  // MEMORY MATCH GAME
  // ============================================
  if (gameType === 'memory' && !selectedSet) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🧠 Memory Match" onBack={() => setGameType('menu')} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Choose a Category! 🎯
            </motion.h2>
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              {Object.entries(memoryGameSets).map(([key, items], i) => {
                const categoryColors: Record<string, { gradient: string; shadow: string }> = {
                  animals: { gradient: 'from-green-500 to-emerald-500', shadow: '#047857' },
                  fruits: { gradient: 'from-red-500 to-pink-500', shadow: '#B91C1C' },
                  shapes: { gradient: 'from-purple-500 to-violet-500', shadow: '#6D28D9' },
                  alphabet: { gradient: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
                };
                const style = categoryColors[key] || { gradient: 'from-purple-500 to-pink-500', shadow: '#7B2CBF' };
                
                return (
                  <motion.button
                    key={key}
                    onClick={() => initMemoryGame(key)}
                    className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-6 text-white shadow-xl border-4 border-white`}
                    style={{
                      boxShadow: `0 8px 0 ${style.shadow}, 0 12px 25px rgba(0,0,0,0.2)`,
                      minHeight: '160px',
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 4,
                      boxShadow: `0 4px 0 ${style.shadow}, 0 6px 15px rgba(0,0,0,0.2)`
                    }}
                  >
                    <div className="flex justify-center gap-1 text-4xl mb-3">
                      {items.slice(0, 3).map((item) => (
                        <span key={item.id}>{item.emoji}</span>
                      ))}
                    </div>
                    <h4 
                      className="font-bold text-xl capitalize text-center"
                      style={{ 
                        fontFamily: "'Bubblegum One', cursive",
                        textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                      }}
                    >
                      {key}
                    </h4>
                    <p className="text-white/90 text-xs mt-2 text-center">{items.length} pairs</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // Memory game board
  if (gameType === 'memory' && selectedSet) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation
            title="🧠 Memory Match"
            onBack={() => { setSelectedSet(null); }}
            stars={progress.stars}
            showProgress
            progress={(matchedPairs / totalPairs) * 100}
          />

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="max-w-2xl mx-auto">
              {/* Score Bar */}
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Moves</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {moves}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center flex-1">
                  <p className="text-xs opacity-90">Matched</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    {matchedPairs}/{totalPairs}
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

              {/* Cards Grid */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {cards.map((card, index) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className="aspect-square"
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring' }}
                    whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                    whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                  >
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center shadow-lg border-4 border-white ${
                      card.matched 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                        : card.flipped
                          ? 'bg-white'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}
                    style={{
                      boxShadow: card.matched 
                        ? '0 6px 0 #047857, 0 8px 15px rgba(0,0,0,0.15)'
                        : card.flipped
                          ? '0 6px 0 rgba(0,0,0,0.15), 0 8px 15px rgba(0,0,0,0.1)'
                          : '0 6px 0 #6B21A8, 0 8px 15px rgba(0,0,0,0.15)',
                    }}>
                      {card.flipped || card.matched ? (
                        <motion.span 
                          className="text-4xl md:text-5xl"
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                        >
                          {card.emoji}
                        </motion.span>
                      ) : (
                        <span className="text-4xl md:text-5xl text-white">❓</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ============================================
  // QUICK TAP GAME
  // ============================================
  if (gameType === 'quicktap') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="⚡ Quick Tap" onBack={() => { setGameType('menu'); setQuickTapActive(false); }} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="max-w-2xl mx-auto">
              {!quickTapActive && quickTapItems.length === 0 ? (
                <motion.div
                  className="bg-white/95 rounded-3xl p-8 shadow-xl border-4 border-white text-center mt-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <motion.div
                    className="text-8xl mb-4"
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚡
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    Quick Tap Challenge!
                  </h2>
                  <p className="text-gray-600 mb-2 text-base md:text-lg">
                    Tap the ⭐ stars as fast as you can!
                  </p>
                  <p className="text-gray-500 mb-6 text-sm">
                    You have 30 seconds. Avoid other items!
                  </p>
                  <motion.button
                    onClick={startQuickTap}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl px-8 py-4 font-bold shadow-lg border-4 border-white text-xl"
                    style={{
                      boxShadow: '0 6px 0 #C2410C, 0 8px 20px rgba(0,0,0,0.2)',
                      fontFamily: "'Bubblegum One', cursive"
                    }}
                    whileTap={{ scale: 0.95, y: 3 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🚀 Start Game!
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* Score Bar */}
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="text-center flex-1">
                      <p className="text-xs opacity-90">Score</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                        ⭐ {quickTapScore}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-white/30" />
                    <div className="text-center flex-1">
                      <p className="text-xs opacity-90">Time Left</p>
                      <p className={`text-2xl font-bold ${quickTapTimeLeft <= 5 ? 'text-yellow-300' : ''}`} style={{ fontFamily: "'Bubblegum One', cursive" }}>
                        ⏱️ {quickTapTimeLeft}s
                      </p>
                    </div>
                  </motion.div>

                  {/* Instruction */}
                  <div className="text-center mb-3">
                    <p 
                      className="inline-block px-6 py-3 rounded-2xl bg-white/95 text-gray-700 font-bold shadow-lg border-4 border-white text-lg"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      👆 Tap the ⭐ stars only!
                    </p>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {quickTapItems.map((item, i) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleQuickTap(i)}
                        disabled={item.tapped}
                        className={`aspect-square rounded-2xl flex items-center justify-center text-5xl md:text-6xl shadow-lg border-4 ${
                          item.tapped
                            ? item.target
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-white'
                              : 'bg-gradient-to-br from-red-400 to-red-500 border-white'
                            : 'bg-white border-white'
                        }`}
                        style={{
                          boxShadow: item.tapped 
                            ? item.target
                              ? '0 4px 0 #047857'
                              : '0 4px 0 #B91C1C'
                            : '0 6px 0 rgba(0,0,0,0.15), 0 8px 15px rgba(0,0,0,0.1)',
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={!item.tapped ? { scale: 1.1 } : {}}
                        whileTap={!item.tapped ? { scale: 0.9 } : {}}
                      >
                        {item.tapped && item.target ? '✅' : item.tapped ? '❌' : item.emoji}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // ============================================
  // COLOR MEMORY GAME
  // ============================================
  if (gameType === 'colormemory') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🌈 Color Memory" onBack={() => { setGameType('menu'); setColorGameActive(false); }} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="max-w-2xl mx-auto">
              {!colorGameActive ? (
                <motion.div
                  className="bg-white/95 rounded-3xl p-8 shadow-xl border-4 border-white text-center mt-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <motion.div
                    className="text-8xl mb-4"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌈
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                    Color Memory!
                  </h2>
                  <p className="text-gray-600 mb-2 text-base md:text-lg">
                    Watch the colors and repeat them!
                  </p>
                  <p className="text-gray-500 mb-6 text-sm">
                    Each level adds one more color
                  </p>
                  <motion.button
                    onClick={startColorMemory}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl px-8 py-4 font-bold shadow-lg border-4 border-white text-xl"
                    style={{
                      boxShadow: '0 6px 0 #0369A1, 0 8px 20px rgba(0,0,0,0.2)',
                      fontFamily: "'Bubblegum One', cursive"
                    }}
                    whileTap={{ scale: 0.95, y: 3 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎬 Start Game!
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* Score Bar */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-3 mb-3 text-white shadow-lg border-4 border-white flex items-center justify-between"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="text-center flex-1">
                      <p className="text-xs opacity-90">Level</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                        {currentColorLevel}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-white/30" />
                    <div className="text-center flex-1">
                      <p className="text-xs opacity-90">Sequence</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                        {playerSequence.length}/{colorSequence.length}
                      </p>
                    </div>
                  </motion.div>

                  {/* Instruction */}
                  <div className="text-center mb-4">
                    <p 
                      className="inline-block px-6 py-3 rounded-2xl bg-white/95 text-gray-700 font-bold shadow-lg border-4 border-white text-lg"
                      style={{ fontFamily: "'Bubblegum One', cursive" }}
                    >
                      {showingSequence ? '👀 Watch carefully!' : '👆 Your turn - repeat!'}
                    </p>
                  </div>

                  {/* Color Buttons */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {COLOR_SEQUENCE.map((color, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleColorTap(i)}
                        disabled={showingSequence}
                        className={`aspect-square rounded-3xl flex items-center justify-center text-6xl md:text-7xl shadow-lg border-4 border-white transition-all ${
                          activeColorIndex === i ? 'scale-110 ring-4 ring-yellow-300' : ''
                        }`}
                        style={{
                          backgroundColor: color.color,
                          boxShadow: activeColorIndex === i
                            ? `0 8px 0 rgba(0,0,0,0.3), 0 0 30px ${color.color}`
                            : '0 6px 0 rgba(0,0,0,0.3), 0 8px 15px rgba(0,0,0,0.15)',
                          opacity: activeColorIndex === i ? 1 : 0.7,
                        }}
                        whileTap={!showingSequence ? { scale: 0.95, y: 3 } : {}}
                        animate={activeColorIndex === i ? { 
                          scale: [1, 1.15, 1],
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {color.emoji}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  return null;
};

export default MemoryGame;
