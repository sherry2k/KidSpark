import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface SpotDifferenceProps {
  onBack: () => void;
}

interface DiffLevel {
  name: string;
  grid1: string[][];
  grid2: string[][];
  differences: [number, number][];
}

const levels: DiffLevel[] = [
  {
    name: 'Garden',
    grid1: [
      ['🌸', '🌻', '🌺', '🌸'],
      ['🌿', '🐝', '🌿', '🦋'],
      ['🌻', '🌺', '🌸', '🌻'],
      ['🐛', '🌿', '🌻', '🌺'],
    ],
    grid2: [
      ['🌸', '🌻', '🌺', '🌸'],
      ['🌿', '🐝', '🌿', '🐝'],
      ['🌻', '🌸', '🌸', '🌻'],
      ['🐛', '🌿', '🌻', '🌺'],
    ],
    differences: [[1, 3], [2, 1]],
  },
  {
    name: 'Ocean',
    grid1: [
      ['🐠', '🌊', '🐙', '🦀'],
      ['🌊', '🐳', '🌊', '🐠'],
      ['🐚', '🌊', '🦑', '🌊'],
      ['🌊', '🐠', '🌊', '🐚'],
    ],
    grid2: [
      ['🐠', '🌊', '🐙', '🦀'],
      ['🌊', '🐠', '🌊', '🐠'],
      ['🐚', '🌊', '🦑', '🌊'],
      ['🌊', '🐠', '🌊', '🦀'],
    ],
    differences: [[1, 1], [3, 3]],
  },
  {
    name: 'Farm',
    grid1: [
      ['🐄', '🌾', '🐔', '🌾'],
      ['🌾', '🐷', '🌾', '🐑'],
      ['🐴', '🌾', '🐶', '🌾'],
      ['🌾', '🐱', '🌾', '🐰'],
    ],
    grid2: [
      ['🐄', '🌾', '🐔', '🌾'],
      ['🌾', '🐷', '🌾', '🐷'],
      ['🐴', '🌾', '🐱', '🌾'],
      ['🌾', '🐱', '🌾', '🐰'],
    ],
    differences: [[1, 3], [2, 2]],
  },
  {
    name: 'Space',
    grid1: [
      ['⭐', '🌙', '🚀', '⭐'],
      ['🪐', '⭐', '🌙', '🛸'],
      ['⭐', '🌍', '⭐', '🌙'],
      ['🛸', '⭐', '🪐', '⭐'],
    ],
    grid2: [
      ['⭐', '🌙', '🚀', '⭐'],
      ['🪐', '⭐', '🌙', '🚀'],
      ['⭐', '🌍', '⭐', '🌙'],
      ['🪐', '⭐', '🪐', '⭐'],
    ],
    differences: [[1, 3], [3, 0]],
  },
];

export default function SpotDifference({ onBack }: SpotDifferenceProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [found, setFound] = useState<[number, number][]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongCell, setWrongCell] = useState<string | null>(null);

  const level = levels[levelIndex];

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const isDiff = level.differences.some(([r, c]) => r === row && c === col);
      const alreadyFound = found.some(([r, c]) => r === row && c === col);
      if (alreadyFound) return;

      playClick();
      if (isDiff) {
        playCorrect();
        const newFound = [...found, [row, col] as [number, number]];
        setFound(newFound);
        setStars((s) => s + 1);
        if (newFound.length === level.differences.length) {
          setTimeout(() => setShowCelebration(true), 800);
        }
      } else {
        playWrong();
        setWrongCell(`${row}-${col}`);
        setTimeout(() => setWrongCell(null), 500);
      }
    },
    [found, level]
  );

  const nextLevel = () => {
    setShowCelebration(false);
    if (levelIndex < levels.length - 1) {
      setLevelIndex((l) => l + 1);
      setFound([]);
    }
  };

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Eagle Eyes! 🦅"
        starsEarned={3}
        onHome={onBack}
        onNext={levelIndex < levels.length - 1 ? nextLevel : undefined}
        onReplay={() => {
          setShowCelebration(false);
          setFound([]);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Spot the Difference"
        emoji="🔍"
        subtitle={`${level.name} - Found ${found.length}/${level.differences.length}`}
        onBack={onBack}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-pink to-candy-orange h-full rounded-full transition-all duration-500"
            style={{ width: `${(found.length / level.differences.length) * 100}%` }}
          />
        </div>

        <p className="text-white text-center mb-4 font-bold text-lg">
          Find {level.differences.length} differences! Tap on picture 2 👇
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Picture 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <p className="text-white/80 text-center mb-2 font-bold text-sm">Picture 1 (Original)</p>
            <div className="grid grid-cols-4 gap-1">
              {level.grid1.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`1-${r}-${c}`}
                    className="aspect-square flex items-center justify-center text-2xl sm:text-3xl bg-white/10 rounded-lg"
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Picture 2 - Clickable */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <p className="text-white/80 text-center mb-2 font-bold text-sm">Picture 2 (Find differences!)</p>
            <div className="grid grid-cols-4 gap-1">
              {level.grid2.map((row, r) =>
                row.map((cell, c) => {
                  const isFound = found.some(([fr, fc]) => fr === r && fc === c);
                  const isWrong = wrongCell === `${r}-${c}`;
                  return (
                    <button
                      key={`2-${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl rounded-lg transition-all duration-300 ${
                        isFound
                          ? 'bg-candy-green/40 ring-2 ring-candy-green animate-pop-in'
                          : isWrong
                          ? 'bg-candy-red/30 animate-shake'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {cell}
                      {isFound && <span className="absolute text-xs">✅</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
