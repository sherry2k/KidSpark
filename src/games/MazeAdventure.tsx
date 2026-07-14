import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick, playPop } from '../utils/sounds';

interface MazeAdventureProps {
  onBack: () => void;
}

interface MazeLevel {
  name: string;
  character: string;
  goal: string;
  // 0=path, 1=wall, 2=start, 3=end
  grid: number[][];
}

const mazeLevels: MazeLevel[] = [
  {
    name: 'Dino finds Egg',
    character: '🦕',
    goal: '🥚',
    grid: [
      [2, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 3],
    ],
  },
  {
    name: 'Rocket to Moon',
    character: '🚀',
    goal: '🌙',
    grid: [
      [2, 0, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 3],
    ],
  },
  {
    name: 'Monkey finds Banana',
    character: '🐒',
    goal: '🍌',
    grid: [
      [1, 1, 2, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 3],
    ],
  },
  {
    name: 'Puppy finds Bone',
    character: '🐶',
    goal: '🦴',
    grid: [
      [2, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0],
      [1, 0, 1, 1, 3],
    ],
  },
];

export default function MazeAdventure({ onBack }: MazeAdventureProps) {
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [moves, setMoves] = useState(0);

  const startLevel = useCallback((idx: number) => {
    const level = mazeLevels[idx];
    let startPos: [number, number] = [0, 0];
    for (let r = 0; r < level.grid.length; r++) {
      for (let c = 0; c < level.grid[r].length; c++) {
        if (level.grid[r][c] === 2) startPos = [r, c];
      }
    }
    setLevelIndex(idx);
    setPlayerPos(startPos);
    setPath([startPos]);
    setMoves(0);
    playClick();
  }, []);

  const movePlayer = useCallback(
    (dr: number, dc: number) => {
      if (levelIndex === null) return;
      const level = mazeLevels[levelIndex];
      const [r, c] = playerPos;
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= level.grid.length || nc < 0 || nc >= level.grid[0].length) {
        playWrong();
        return;
      }
      if (level.grid[nr][nc] === 1) {
        playWrong();
        return;
      }

      playPop();
      setPlayerPos([nr, nc]);
      setPath((prev) => [...prev, [nr, nc]]);
      setMoves((m) => m + 1);

      if (level.grid[nr][nc] === 3) {
        playCorrect();
        setStars((s) => s + 3);
        setTimeout(() => setShowCelebration(true), 500);
      }
    },
    [levelIndex, playerPos]
  );

  if (showCelebration) {
    const level = mazeLevels[levelIndex!];
    return (
      <CelebrationScreen
        message={`${level.character} Found ${level.goal}!`}
        starsEarned={moves <= 12 ? 3 : moves <= 18 ? 2 : 1}
        onHome={onBack}
        onNext={
          levelIndex! < mazeLevels.length - 1
            ? () => {
                setShowCelebration(false);
                startLevel(levelIndex! + 1);
              }
            : undefined
        }
        onReplay={() => {
          setShowCelebration(false);
          startLevel(levelIndex!);
        }}
      />
    );
  }

  if (levelIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Maze Adventure" emoji="🧭" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Help the character reach the goal! Choose a maze:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {mazeLevels.map((level, i) => (
              <button
                key={i}
                onClick={() => startLevel(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="flex justify-center gap-2 text-4xl mb-3">
                  <span>{level.character}</span>
                  <span>→</span>
                  <span>{level.goal}</span>
                </div>
                <div className="text-white font-bold text-sm">{level.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = mazeLevels[levelIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Maze Adventure"
        emoji="🧭"
        subtitle={`${level.name} - Moves: ${moves}`}
        onBack={() => setLevelIndex(null)}
        stars={stars}
      />
      <div className="max-w-sm mx-auto">
        {/* Maze grid */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${level.grid[0].length}, 1fr)` }}>
            {level.grid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos[0] === r && playerPos[1] === c;
                const isOnPath = path.some(([pr, pc]) => pr === r && pc === c);
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl sm:text-3xl transition-all duration-200 ${
                      cell === 1
                        ? 'bg-gray-700/80'
                        : cell === 3
                        ? 'bg-candy-yellow/30 animate-pulse-glow'
                        : isOnPath && !isPlayer
                        ? 'bg-candy-green/20'
                        : 'bg-white/20'
                    }`}
                  >
                    {isPlayer ? (
                      <span className="animate-bounce">{level.character}</span>
                    ) : cell === 3 ? (
                      level.goal
                    ) : isOnPath ? (
                      <span className="text-xs opacity-40">•</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="btn-bounce bg-white/20 hover:bg-white/30 text-white text-3xl w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            ⬆️
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => movePlayer(0, -1)}
              className="btn-bounce bg-white/20 hover:bg-white/30 text-white text-3xl w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            >
              ⬅️
            </button>
            <div className="w-16 h-16 flex items-center justify-center text-3xl">
              {level.character}
            </div>
            <button
              onClick={() => movePlayer(0, 1)}
              className="btn-bounce bg-white/20 hover:bg-white/30 text-white text-3xl w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            >
              ➡️
            </button>
          </div>
          <button
            onClick={() => movePlayer(1, 0)}
            className="btn-bounce bg-white/20 hover:bg-white/30 text-white text-3xl w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  );
}
