import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface HalfHalfProps {
  onBack: () => void;
}

interface HalfItem {
  id: number;
  emoji: string;
  name: string;
  leftHalf: string;
  rightHalf: string;
}

const items: HalfItem[] = [
  { id: 0, emoji: '🐘', name: 'Elephant', leftHalf: '🐘', rightHalf: '🐘' },
  { id: 1, emoji: '🦋', name: 'Butterfly', leftHalf: '🦋', rightHalf: '🦋' },
  { id: 2, emoji: '🚂', name: 'Train', leftHalf: '🚂', rightHalf: '🚂' },
  { id: 3, emoji: '🦖', name: 'Dinosaur', leftHalf: '🦖', rightHalf: '🦖' },
  { id: 4, emoji: '🏠', name: 'House', leftHalf: '🏠', rightHalf: '🏠' },
  { id: 5, emoji: '🐱', name: 'Cat', leftHalf: '🐱', rightHalf: '🐱' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HalfHalf({ onBack }: HalfHalfProps) {
  const [gameItems] = useState(() => shuffle(items).slice(0, 4));
  const [shuffledRights] = useState(() => shuffle([...gameItems]));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  const handleLeftClick = (id: number) => {
    if (matched.includes(id)) return;
    playClick();
    setSelectedLeft(id);
  };

  const handleRightClick = useCallback(
    (id: number) => {
      if (matched.includes(id) || selectedLeft === null) return;
      if (selectedLeft === id) {
        playCorrect();
        const newMatched = [...matched, id];
        setMatched(newMatched);
        setSelectedLeft(null);
        setStars((s) => s + 1);
        if (newMatched.length === gameItems.length) {
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        playWrong();
        setWrongRight(id);
        setTimeout(() => setWrongRight(null), 600);
      }
    },
    [selectedLeft, matched, gameItems.length]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Perfect Match! 🎯"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          setMatched([]);
          setSelectedLeft(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Half & Half"
        emoji="🧩"
        subtitle={`Matched ${matched.length}/${gameItems.length}`}
        onBack={onBack}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-blue to-candy-green h-full rounded-full transition-all duration-500"
            style={{ width: `${(matched.length / gameItems.length) * 100}%` }}
          />
        </div>

        <p className="text-white text-center mb-4 font-bold text-lg">
          Connect the matching halves! 🧩
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* Left halves */}
          <div className="space-y-3">
            <p className="text-white/70 text-center text-sm font-bold">Left Half ⬅️</p>
            {gameItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                disabled={matched.includes(item.id)}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                  matched.includes(item.id)
                    ? 'bg-candy-green/20 opacity-60'
                    : selectedLeft === item.id
                    ? 'bg-candy-yellow/30 ring-4 ring-candy-yellow scale-105 animate-wiggle'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                }`}
              >
                <span className="text-4xl" style={{ clipPath: 'inset(0 50% 0 0)', display: 'inline-block', width: '1.2em', overflow: 'hidden' }}>
                  {item.emoji}
                </span>
                <span className="text-3xl border-r-2 border-dashed border-white/50 pr-1">
                  {item.leftHalf}
                </span>
                <span className="text-white/50 text-xs">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right halves */}
          <div className="space-y-3">
            <p className="text-white/70 text-center text-sm font-bold">➡️ Right Half</p>
            {shuffledRights.map((item) => (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={matched.includes(item.id)}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                  matched.includes(item.id)
                    ? 'bg-candy-green/20 opacity-60'
                    : wrongRight === item.id
                    ? 'bg-candy-red/20 animate-shake'
                    : selectedLeft !== null
                    ? 'bg-white/20 hover:bg-candy-yellow/10 hover:scale-105 border-2 border-dashed border-candy-yellow/50'
                    : 'bg-white/20'
                }`}
              >
                <span className="text-3xl border-l-2 border-dashed border-white/50 pl-1">
                  {item.rightHalf}
                </span>
                <span className="text-white/50 text-xs">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Matched display */}
        {matched.length > 0 && (
          <div className="mt-6 bg-white/10 rounded-2xl p-4">
            <p className="text-white/70 text-center text-sm mb-2">✅ Matched:</p>
            <div className="flex justify-center gap-4">
              {matched.map((id) => {
                const item = gameItems.find((i) => i.id === id);
                return (
                  <div key={id} className="text-center animate-pop-in">
                    <span className="text-3xl">{item?.emoji}</span>
                    <p className="text-white/60 text-xs">{item?.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
