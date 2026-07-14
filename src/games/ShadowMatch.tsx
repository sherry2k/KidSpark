import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface ShadowMatchProps {
  onBack: () => void;
}

interface ShadowItem {
  id: string;
  emoji: string;
  name: string;
}

const categories = [
  {
    name: 'Animals',
    icon: '🐾',
    items: [
      { id: 'lion', emoji: '🦁', name: 'Lion' },
      { id: 'elephant', emoji: '🐘', name: 'Elephant' },
      { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
      { id: 'dog', emoji: '🐶', name: 'Dog' },
      { id: 'cat', emoji: '🐱', name: 'Cat' },
    ],
  },
  {
    name: 'Fruits',
    icon: '🍎',
    items: [
      { id: 'apple', emoji: '🍎', name: 'Apple' },
      { id: 'banana', emoji: '🍌', name: 'Banana' },
      { id: 'grapes', emoji: '🍇', name: 'Grapes' },
      { id: 'orange', emoji: '🍊', name: 'Orange' },
      { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    ],
  },
  {
    name: 'Vehicles',
    icon: '🚗',
    items: [
      { id: 'car', emoji: '🚗', name: 'Car' },
      { id: 'bus', emoji: '🚌', name: 'Bus' },
      { id: 'plane', emoji: '✈️', name: 'Airplane' },
      { id: 'ship', emoji: '🚢', name: 'Ship' },
      { id: 'train', emoji: '🚂', name: 'Train' },
    ],
  },
  {
    name: 'Birds',
    icon: '🐦',
    items: [
      { id: 'eagle', emoji: '🦅', name: 'Eagle' },
      { id: 'parrot', emoji: '🦜', name: 'Parrot' },
      { id: 'penguin', emoji: '🐧', name: 'Penguin' },
      { id: 'owl', emoji: '🦉', name: 'Owl' },
      { id: 'duck', emoji: '🦆', name: 'Duck' },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShadowMatch({ onBack }: ShadowMatchProps) {
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [_round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shuffledShadows, setShuffledShadows] = useState<ShadowItem[]>([]);
  const [items, setItems] = useState<ShadowItem[]>([]);

  const startCategory = useCallback((idx: number) => {
    const cat = categories[idx];
    const picked = shuffle(cat.items).slice(0, 4);
    setCategoryIndex(idx);
    setItems(picked);
    setShuffledShadows(shuffle(picked));
    setRound(0);
    setMatched([]);
    setSelected(null);
    playClick();
  }, []);

  const handleSelectItem = (id: string) => {
    if (matched.includes(id)) return;
    playClick();
    setSelected(id);
    setWrongId(null);
  };

  const handleDropOnShadow = (shadowId: string) => {
    if (!selected) return;
    if (selected === shadowId) {
      playCorrect();
      const newMatched = [...matched, selected];
      setMatched(newMatched);
      setSelected(null);
      setStars((s) => s + 1);
      if (newMatched.length === items.length) {
        setTimeout(() => setShowCelebration(true), 500);
      }
    } else {
      playWrong();
      setWrongId(shadowId);
      setTimeout(() => setWrongId(null), 600);
    }
  };

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Shadow Master! 🌟"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          if (categoryIndex !== null) startCategory(categoryIndex);
        }}
      />
    );
  }

  if (categoryIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Shadow Match" emoji="🔦" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Match each object to its shadow! Choose a category:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => startCategory(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-5xl mb-3">{cat.icon}</div>
                <div className="text-white font-bold text-lg">{cat.name}</div>
                <div className="text-white/60 text-sm mt-1">
                  {cat.items.map((it) => it.emoji).join(' ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Shadow Match"
        emoji="🔦"
        subtitle={`${categories[categoryIndex].name} - Match ${matched.length}/${items.length}`}
        onBack={() => setCategoryIndex(null)}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-green to-candy-blue h-full rounded-full transition-all duration-500"
            style={{ width: `${(matched.length / items.length) * 100}%` }}
          />
        </div>

        {/* Objects to select */}
        <div className="mb-4">
          <p className="text-white/80 text-center mb-3 font-bold">👆 Tap an object:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                disabled={matched.includes(item.id)}
                className={`text-5xl p-3 rounded-2xl transition-all duration-300 ${
                  matched.includes(item.id)
                    ? 'opacity-30 scale-75'
                    : selected === item.id
                    ? 'bg-candy-yellow/40 ring-4 ring-candy-yellow scale-110 animate-wiggle'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                }`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        {selected && (
          <div className="text-center text-3xl text-white animate-bounce my-2">⬇️</div>
        )}

        {/* Shadow targets */}
        <div className="mt-4">
          <p className="text-white/80 text-center mb-3 font-bold">👇 Then tap its shadow:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffledShadows.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDropOnShadow(item.id)}
                disabled={matched.includes(item.id)}
                className={`text-5xl p-4 rounded-2xl transition-all duration-300 ${
                  matched.includes(item.id)
                    ? 'opacity-30 scale-75 bg-candy-green/20'
                    : wrongId === item.id
                    ? 'bg-candy-red/30 animate-shake'
                    : 'bg-gray-800/60 hover:bg-gray-800/80 hover:scale-105'
                }`}
                style={{
                  filter: matched.includes(item.id) ? 'none' : 'brightness(0) invert(0)',
                  textShadow: '0 0 0 transparent',
                }}
              >
                <span
                  style={{
                    filter: matched.includes(item.id) ? 'none' : 'brightness(0)',
                    opacity: matched.includes(item.id) ? 0.3 : 1,
                  }}
                >
                  {item.emoji}
                </span>
                {matched.includes(item.id) && (
                  <span className="block text-xs text-green-300 mt-1">✅ {item.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
