import { useState, useCallback, useRef } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playPop, playClick } from '../utils/sounds';

interface ConnectDotsProps {
  onBack: () => void;
}

interface DotLevel {
  name: string;
  reveal: string;
  dots: { x: number; y: number }[];
}

const dotLevels: DotLevel[] = [
  {
    name: 'Star',
    reveal: '⭐',
    dots: [
      { x: 50, y: 5 },
      { x: 62, y: 38 },
      { x: 95, y: 38 },
      { x: 68, y: 58 },
      { x: 80, y: 92 },
      { x: 50, y: 72 },
      { x: 20, y: 92 },
      { x: 32, y: 58 },
      { x: 5, y: 38 },
      { x: 38, y: 38 },
    ],
  },
  {
    name: 'House',
    reveal: '🏠',
    dots: [
      { x: 50, y: 10 },
      { x: 80, y: 35 },
      { x: 80, y: 85 },
      { x: 60, y: 85 },
      { x: 60, y: 60 },
      { x: 40, y: 60 },
      { x: 40, y: 85 },
      { x: 20, y: 85 },
      { x: 20, y: 35 },
    ],
  },
  {
    name: 'Fish',
    reveal: '🐟',
    dots: [
      { x: 50, y: 50 },
      { x: 65, y: 30 },
      { x: 80, y: 30 },
      { x: 90, y: 50 },
      { x: 80, y: 70 },
      { x: 65, y: 70 },
      { x: 50, y: 50 },
      { x: 30, y: 25 },
      { x: 15, y: 50 },
      { x: 30, y: 75 },
    ],
  },
  {
    name: 'Heart',
    reveal: '❤️',
    dots: [
      { x: 50, y: 90 },
      { x: 20, y: 55 },
      { x: 15, y: 35 },
      { x: 25, y: 18 },
      { x: 40, y: 18 },
      { x: 50, y: 30 },
      { x: 60, y: 18 },
      { x: 75, y: 18 },
      { x: 85, y: 35 },
      { x: 80, y: 55 },
    ],
  },
];

export default function ConnectDots({ onBack }: ConnectDotsProps) {
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [currentDot, setCurrentDot] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completed, setCompleted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const startLevel = useCallback((idx: number) => {
    setLevelIndex(idx);
    setCurrentDot(0);
    setCompleted(false);
    playClick();
  }, []);

  const handleDotClick = useCallback(
    (dotIndex: number) => {
      if (levelIndex === null || completed) return;
      if (dotIndex === currentDot) {
        playPop();
        const nextDot = currentDot + 1;
        setCurrentDot(nextDot);
        if (nextDot === dotLevels[levelIndex].dots.length) {
          setCompleted(true);
          playCorrect();
          setStars((s) => s + 3);
          setTimeout(() => setShowCelebration(true), 1000);
        }
      }
    },
    [currentDot, levelIndex, completed]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message={`${dotLevels[levelIndex!].reveal} Connected!`}
        starsEarned={3}
        onHome={onBack}
        onNext={
          levelIndex! < dotLevels.length - 1
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
        <Header title="Connect the Dots" emoji="🔢" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Connect the dots in order to reveal a picture!
          </p>
          <div className="grid grid-cols-2 gap-4">
            {dotLevels.map((level, i) => (
              <button
                key={i}
                onClick={() => startLevel(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-5xl mb-3">❓</div>
                <div className="text-white font-bold">{level.name}</div>
                <div className="text-white/50 text-sm mt-1">{level.dots.length} dots</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = dotLevels[levelIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Connect the Dots"
        emoji="🔢"
        subtitle={`${level.name} - ${currentDot}/${level.dots.length}`}
        onBack={() => setLevelIndex(null)}
        stars={stars}
      />
      <div className="max-w-md mx-auto">
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-yellow to-candy-green h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentDot / level.dots.length) * 100}%` }}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 relative">
          {completed && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-8xl animate-bounce-in">{level.reveal}</span>
            </div>
          )}
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full aspect-square"
            style={{ opacity: completed ? 0.3 : 1 }}
          >
            {/* Connected lines */}
            {level.dots.map((dot, i) => {
              if (i >= currentDot || i === 0) return null;
              const prev = level.dots[i - 1];
              return (
                <line
                  key={`line-${i}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={dot.x}
                  y2={dot.y}
                  stroke="#57d467"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="animate-pop-in"
                />
              );
            })}

            {/* Close the shape if completed */}
            {completed && level.dots.length > 2 && (
              <line
                x1={level.dots[level.dots.length - 1].x}
                y1={level.dots[level.dots.length - 1].y}
                x2={level.dots[0].x}
                y2={level.dots[0].y}
                stroke="#57d467"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Dots */}
            {level.dots.map((dot, i) => {
              const isConnected = i < currentDot;
              const isCurrent = i === currentDot;
              return (
                <g key={i} onClick={() => handleDotClick(i)} style={{ cursor: isCurrent ? 'pointer' : 'default' }}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={isCurrent ? 4 : 3}
                    fill={isConnected ? '#57d467' : isCurrent ? '#ffd93d' : 'rgba(255,255,255,0.4)'}
                    stroke={isCurrent ? '#ffd93d' : 'transparent'}
                    strokeWidth={isCurrent ? 1.5 : 0}
                    className={isCurrent ? 'animate-pulse' : ''}
                  />
                  <text
                    x={dot.x}
                    y={dot.y - 5}
                    textAnchor="middle"
                    fill={isConnected ? '#57d467' : isCurrent ? '#ffd93d' : 'rgba(255,255,255,0.6)'}
                    fontSize="3.5"
                    fontWeight="bold"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className="text-white/70 text-center mt-3 text-sm">
          {completed ? '🎉 Picture revealed!' : `Tap dot #${currentDot + 1} to connect!`}
        </p>
      </div>
    </div>
  );
}
