import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface OddOneOutProps {
  onBack: () => void;
}

interface Level {
  items: string[];
  oddIndex: number;
  hint: string;
  category: string;
}

const allLevels: Level[] = [
  { items: ['🐶', '🐱', '🐰', '🚗'], oddIndex: 3, hint: 'One is not an animal!', category: 'Animals vs Vehicle' },
  { items: ['🍎', '🍌', '🍇', '🏀'], oddIndex: 3, hint: 'One is not a fruit!', category: 'Fruits vs Sport' },
  { items: ['🚗', '🚌', '✈️', '🌳'], oddIndex: 3, hint: 'One is not a vehicle!', category: 'Vehicles vs Nature' },
  { items: ['🔴', '🟡', '🔵', '🐱'], oddIndex: 3, hint: 'One is not a color!', category: 'Colors vs Animal' },
  { items: ['☀️', '🌙', '⭐', '🍕'], oddIndex: 3, hint: 'One is not in the sky!', category: 'Sky vs Food' },
  { items: ['👕', '👖', '🧥', '🎸'], oddIndex: 3, hint: 'One is not clothing!', category: 'Clothes vs Music' },
  { items: ['🏠', '🏢', '🏫', '🐟'], oddIndex: 3, hint: 'One is not a building!', category: 'Buildings vs Animal' },
  { items: ['📕', '📗', '📘', '🎂'], oddIndex: 3, hint: 'One is not a book!', category: 'Books vs Food' },
  { items: ['🌺', '🌻', '🌹', '🍔'], oddIndex: 3, hint: 'One is not a flower!', category: 'Flowers vs Food' },
  { items: ['🎹', '🎸', '🥁', '🌈'], oddIndex: 3, hint: 'One is not an instrument!', category: 'Music vs Nature' },
  { items: ['🐘', '🦁', '🐯', '🍕'], oddIndex: 3, hint: 'One is not an animal!', category: 'Animals vs Food' },
  { items: ['⚽', '🏀', '🎾', '🐸'], oddIndex: 3, hint: 'One is not a ball!', category: 'Sports vs Animal' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OddOneOut({ onBack }: OddOneOutProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [shuffledLevels] = useState(() => shuffle(allLevels).slice(0, 6));

  const level = shuffledLevels[currentLevel];

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null && isCorrect === true) return;
      playClick();
      setSelectedIndex(index);
      if (index === level.oddIndex) {
        setIsCorrect(true);
        playCorrect();
        setStars((s) => s + 1);
        setTimeout(() => {
          if (currentLevel < shuffledLevels.length - 1) {
            setCurrentLevel((l) => l + 1);
            setSelectedIndex(null);
            setIsCorrect(null);
            setShowHint(false);
          } else {
            setShowCelebration(true);
          }
        }, 1200);
      } else {
        setIsCorrect(false);
        playWrong();
        setTimeout(() => {
          setSelectedIndex(null);
          setIsCorrect(null);
          setShowHint(true);
        }, 800);
      }
    },
    [selectedIndex, isCorrect, level, currentLevel, shuffledLevels.length]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Sharp Eyes! 👀"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          setCurrentLevel(0);
          setSelectedIndex(null);
          setIsCorrect(null);
          setShowHint(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Odd One Out"
        emoji="🔍"
        subtitle={`Level ${currentLevel + 1} of ${shuffledLevels.length}`}
        onBack={onBack}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-pink to-candy-purple h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentLevel / shuffledLevels.length) * 100}%` }}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <p className="text-white text-center text-xl font-bold mb-2">
            Which one doesn't belong? 🤔
          </p>
          <p className="text-white/60 text-center text-sm mb-6">{level.category}</p>

          {/* Items */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
            {level.items.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`text-5xl sm:text-6xl p-6 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  selectedIndex === i
                    ? isCorrect === true
                      ? 'bg-candy-green/40 ring-4 ring-candy-green scale-110 animate-pop-in'
                      : isCorrect === false
                      ? 'bg-candy-red/40 ring-4 ring-candy-red animate-shake'
                      : 'bg-white/30'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Hint */}
          {showHint && (
            <div className="animate-slide-up bg-candy-yellow/20 rounded-2xl p-4 text-center">
              <span className="text-2xl">💡</span>
              <p className="text-candy-yellow font-bold mt-1">{level.hint}</p>
            </div>
          )}

          {isCorrect === true && (
            <div className="animate-bounce-in text-center">
              <span className="text-4xl">🎉</span>
              <p className="text-candy-green font-bold text-xl">Correct!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
