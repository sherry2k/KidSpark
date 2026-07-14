import React, { useState, useCallback } from 'react';
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

const PUZZLE_SETS = [
  { id: 'animals', name: 'Animals', emojis: ['🦁', '🐘', '🐒', '🐧', '🐬', '🦒', '🐻', '🐯', '🐼', '🦊', '🐨', '🐰', '🦉', '🐱', '🐶', '🦋'] },
  { id: 'ocean', name: 'Ocean', emojis: ['🐙', '🐠', '🐳', '🦀', '🐬', '🐡', '🦈', '🐚', '🪸', '🦭', '🐟', '🦑', '🪼', '🐢', '🌊', '⚓'] },
  { id: 'space', name: 'Space', emojis: ['🚀', '🌙', '⭐', '🪐', '☄️', '🌎', '🛸', '👽', '🌟', '🔭', '🛰️', '🌌', '☀️', '💫', '🌠', '🌕'] },
  { id: 'food', name: 'Food', emojis: ['🍎', '🍕', '🍔', '🌮', '🍦', '🧁', '🍩', '🍪', '🎂', '🍇', '🍌', '🍉', '🥕', '🌽', '🍓', '🥝'] },
  { id: 'nature', name: 'Nature', emojis: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌳', '🍀', '🌿', '🍂', '🍁', '🌵', '🌴', '🎋', '🍄', '🌾', '🪻'] },
  { id: 'vehicles', name: 'Vehicles', emojis: ['🚗', '🚌', '🚂', '✈️', '🚁', '🚀', '⛵', '🚲', '🚒', '🚑', '🚜', '🏎️', '🛻', '🚎', '🛩️', '🚢'] },
];

const GRID_SIZES = [
  { label: '2×2', size: 4, cols: 2 },
  { label: '3×3', size: 9, cols: 3 },
  { label: '4×4', size: 16, cols: 4 },
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ progress, onBack, onComplete }) => {
  const [selectedSet, setSelectedSet] = useState<typeof PUZZLE_SETS[0] | null>(null);
  const [gridSize, setGridSize] = useState<typeof GRID_SIZES[0] | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const initPuzzle = useCallback((set: typeof PUZZLE_SETS[0], grid: typeof GRID_SIZES[0]) => {
    setSelectedSet(set);
    setGridSize(grid);
    setMoves(0);
    setShowCelebration(false);
    setSelectedTile(null);

    // Create shuffled tiles (0 to size-1, where order is the solution)
    const ordered = Array.from({ length: grid.size }, (_, i) => i);
    const shuffled = [...ordered];
    // Fisher-Yates shuffle, ensure it's not already solved
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((v, i) => v === i));

    setTiles(shuffled);
  }, []);

  const handleTileClick = useCallback((index: number) => {
    if (showCelebration) return;

    if (selectedTile === null) {
      setSelectedTile(index);
    } else {
      // Swap tiles
      const newTiles = [...tiles];
      [newTiles[selectedTile], newTiles[index]] = [newTiles[index], newTiles[selectedTile]];
      setTiles(newTiles);
      setSelectedTile(null);
      setMoves((m) => m + 1);

      // Check if solved
      if (newTiles.every((v, i) => v === i)) {
        setShowCelebration(true);
        const stars = moves < gridSize!.size * 2 ? 3 : moves < gridSize!.size * 4 ? 2 : 1;
        onComplete(stars);
      }
    }
  }, [selectedTile, tiles, showCelebration, moves, gridSize, onComplete]);

  // Selection screen
  if (!selectedSet || !gridSize) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🧩 Puzzle Game" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col items-center justify-center">
            {!selectedSet ? (
              <>
                <motion.h2
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-4"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Choose a puzzle! 🧩
                </motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg w-full">
                  {PUZZLE_SETS.map((set, i) => (
                    <motion.button
                      key={set.id}
                      onClick={() => setSelectedSet(set)}
                      className="game-card p-4 text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex justify-center gap-0.5 text-xl mb-2 flex-wrap">
                        {set.emojis.slice(0, 4).map((e, j) => (
                          <span key={j}>{e}</span>
                        ))}
                      </div>
                      <span className="font-bold text-gray-700 text-sm">{set.name}</span>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <motion.h2
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-4"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Choose difficulty! 📐
                </motion.h2>
                <div className="flex gap-4">
                  {GRID_SIZES.map((g, i) => (
                    <motion.button
                      key={g.label}
                      onClick={() => initPuzzle(selectedSet, g)}
                      className="game-card p-6 text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl block mb-2">{['🌱', '🌿', '🌳'][i]}</span>
                      <span className="font-bold text-gray-700">{g.label}</span>
                      <span className="text-xs text-gray-400 block">{g.size} pieces</span>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  onClick={() => setSelectedSet(null)}
                  className="mt-4 text-gray-400 text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  ← Choose another set
                </motion.button>
              </>
            )}
          </div>
        </div>
      </GameBackground>
    );
  }

  if (showCelebration) {
    const stars = moves < gridSize.size * 2 ? 3 : moves < gridSize.size * 4 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <Celebration show={true} message="Puzzle Complete!" stars={stars} />
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              🧩 Solved! 🎉
            </h2>
            <p className="text-gray-500 mb-6">Moves: {moves}</p>
            <div className="flex gap-3">
              <motion.button onClick={onBack} className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 font-bold" whileTap={{ scale: 0.98 }}>
                🏠 Home
              </motion.button>
              <motion.button
                onClick={() => initPuzzle(selectedSet, gridSize)}
                className="flex-1 bg-gradient-to-r from-violet-400 to-purple-400 text-white rounded-2xl py-3 font-bold shadow-lg"
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

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation title="🧩 Puzzle" onBack={onBack} stars={progress.stars} />

        <div className="text-center mb-2">
          <span className="bg-white/80 rounded-full px-4 py-1 text-sm font-bold text-gray-600 shadow-sm">
            Moves: {moves} • Tap two tiles to swap!
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div
            className="grid gap-2 w-full max-w-sm"
            style={{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)` }}
          >
            {tiles.map((tileIndex, i) => {
              const emoji = selectedSet.emojis[tileIndex];
              const isSelected = selectedTile === i;
              const isCorrect = tileIndex === i;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  className={`aspect-square rounded-2xl flex items-center justify-center shadow-lg text-3xl md:text-5xl transition-all ${
                    isSelected
                      ? 'bg-yellow-200 ring-4 ring-yellow-400 scale-105'
                      : isCorrect
                      ? 'bg-green-100 border-2 border-green-300'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  initial={{ scale: 0, rotate: Math.random() * 20 - 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.03, type: 'spring' }}
                  whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {emoji}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default PuzzleGame;
