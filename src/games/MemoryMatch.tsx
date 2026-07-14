import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playFlip } from '../utils/sounds';

interface MemoryMatchProps {
  onBack: () => void;
}

const themes = [
  {
    name: 'Animals',
    icon: '🐾',
    cards: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐸'],
  },
  {
    name: 'Fruits',
    icon: '🍎',
    cards: ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝'],
  },
  {
    name: 'Space',
    icon: '🚀',
    cards: ['🚀', '⭐', '🌙', '🪐', '👽', '🛸'],
  },
  {
    name: 'Ocean',
    icon: '🌊',
    cards: ['🐠', '🐙', '🦀', '🐳', '🦑', '🐚'],
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

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryMatch({ onBack }: MemoryMatchProps) {
  const [themeIndex, setThemeIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const startTheme = useCallback((idx: number) => {
    const theme = themes[idx];
    const picked = theme.cards.slice(0, 6);
    const doubled = shuffle([...picked, ...picked]);
    setCards(
      doubled.map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      }))
    );
    setThemeIndex(idx);
    setFlippedCards([]);
    setMoves(0);
  }, []);

  const handleFlip = (id: number) => {
    if (isChecking) return;
    const card = cards[id];
    if (card.flipped || card.matched || flippedCards.length >= 2) return;

    playFlip();
    const newCards = [...cards];
    newCards[id] = { ...newCards[id], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match!
        setTimeout(() => {
          playCorrect();
          setCards((prev) => {
            const updated = [...prev];
            updated[first] = { ...updated[first], matched: true };
            updated[second] = { ...updated[second], matched: true };
            return updated;
          });
          setStars((s) => s + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          playWrong();
          setCards((prev) => {
            const updated = [...prev];
            updated[first] = { ...updated[first], flipped: false };
            updated[second] = { ...updated[second], flipped: false };
            return updated;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setTimeout(() => setShowCelebration(true), 600);
    }
  }, [cards]);

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Memory Master! 🧠"
        starsEarned={moves <= 10 ? 3 : moves <= 15 ? 2 : 1}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          if (themeIndex !== null) startTheme(themeIndex);
        }}
      />
    );
  }

  if (themeIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Memory Match" emoji="🧠" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Find matching pairs! Choose a theme:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme, i) => (
              <button
                key={theme.name}
                onClick={() => startTheme(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-5xl mb-3">{theme.icon}</div>
                <div className="text-white font-bold text-lg">{theme.name}</div>
                <div className="text-white/60 text-sm mt-1">
                  {theme.cards.join(' ')}
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
        title="Memory Match"
        emoji="🧠"
        subtitle={`${themes[themeIndex].name} - Moves: ${moves}`}
        onBack={() => setThemeIndex(null)}
        stars={stars}
      />
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 transform ${
                card.matched
                  ? 'bg-candy-green/30 scale-90 opacity-60'
                  : card.flipped
                  ? 'bg-white shadow-lg scale-105'
                  : 'bg-gradient-to-br from-candy-purple to-candy-pink hover:scale-105 shadow-md'
              }`}
              style={{
                perspective: '1000px',
              }}
            >
              {card.flipped || card.matched ? (
                <span className="animate-pop-in">{card.emoji}</span>
              ) : (
                <span className="text-white text-2xl">❓</span>
              )}
            </button>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="text-white/60">Pairs found: {cards.filter((c) => c.matched).length / 2} / {cards.length / 2}</span>
        </div>
      </div>
    </div>
  );
}
