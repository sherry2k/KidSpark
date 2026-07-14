import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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

const MemoryGame: React.FC<MemoryGameProps> = ({ progress, onBack, onComplete }) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [totalPairs, setTotalPairs] = useState(0);

  const initGame = useCallback((setKey: string) => {
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

    // Shuffle
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
        // Match!
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
        // No match
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

  // Category selection
  if (!selectedSet) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🧠 Memory Game" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Choose a category! 🎯
            </motion.h2>
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              {Object.entries(memoryGameSets).map(([key, items], i) => (
                <motion.button
                  key={key}
                  onClick={() => initGame(key)}
                  className="game-card p-6 text-center"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex justify-center gap-1 text-3xl mb-2">
                    {items.slice(0, 3).map((item) => (
                      <span key={item.id}>{item.emoji}</span>
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-800 capitalize">{key}</h4>
                  <p className="text-xs text-gray-400">{items.length} pairs</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // Game finished
  if (showCelebration) {
    const stars = moves < totalPairs * 2 ? 3 : moves < totalPairs * 3 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={true} message="All Matched!" stars={stars} />
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Well Done! 🎉
            </h2>
            <p className="text-gray-500 mb-2">Moves: {moves}</p>
            <p className="text-gray-500 mb-6">Pairs: {totalPairs}</p>
            <div className="flex gap-3">
              <motion.button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 font-bold"
                whileTap={{ scale: 0.98 }}
              >
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => initGame(selectedSet)}
                className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl py-3 font-bold shadow-lg"
                whileTap={{ scale: 0.98 }}
              >
                🔄 Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </GameBackground>
    );
  }

  // Game board
  const cols = cards.length <= 8 ? 4 : 4;

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation
          title="🧠 Memory Game"
          onBack={onBack}
          stars={progress.stars}
          showProgress
          progress={(matchedPairs / totalPairs) * 100}
        />

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-3">
          <div className="bg-white/80 rounded-full px-4 py-1 shadow-sm">
            <span className="text-sm font-bold text-gray-600">Moves: {moves}</span>
          </div>
          <div className="bg-white/80 rounded-full px-4 py-1 shadow-sm">
            <span className="text-sm font-bold text-green-600">Matched: {matchedPairs}/{totalPairs}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div
            className="grid gap-2 md:gap-3 w-full max-w-md"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
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
                <div className="card-flip w-full h-full">
                  <div className={`card-flip-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
                    {/* Back (hidden) */}
                    <div className="card-flip-front bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer">
                      <span className="text-3xl md:text-4xl">❓</span>
                    </div>
                    {/* Front (shown) */}
                    <div
                      className={`card-flip-back rounded-2xl flex flex-col items-center justify-center shadow-lg ${
                        card.matched ? 'bg-green-100 border-2 border-green-300' : 'bg-white'
                      }`}
                    >
                      <span className="text-3xl md:text-5xl">{card.emoji}</span>
                      <span className="text-xs font-bold text-gray-500 mt-1 hidden md:block">{card.name}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MemoryGame;
