import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface PatternPuzzleProps {
  onBack: () => void;
}

interface PatternLevel {
  pattern: string[];
  missingIndex: number;
  options: string[];
  correct: string;
}

const levels: PatternLevel[] = [
  { pattern: ['🟥', '🟦', '🟥', '🟦', '❓'], missingIndex: 4, options: ['🟥', '🟦', '🟩'], correct: '🟥' },
  { pattern: ['⭐', '🌙', '⭐', '🌙', '❓'], missingIndex: 4, options: ['⭐', '☀️', '🌙'], correct: '⭐' },
  { pattern: ['🐶', '🐱', '🐶', '🐱', '❓'], missingIndex: 4, options: ['🐰', '🐶', '🐱'], correct: '🐶' },
  { pattern: ['🔴', '🟡', '🔵', '🔴', '🟡', '❓'], missingIndex: 5, options: ['🔴', '🟡', '🔵'], correct: '🔵' },
  { pattern: ['🍎', '🍎', '🍌', '🍎', '🍎', '❓'], missingIndex: 5, options: ['🍎', '🍌', '🍇'], correct: '🍌' },
  { pattern: ['🌸', '🌸', '🌻', '🌸', '🌸', '❓'], missingIndex: 5, options: ['🌻', '🌸', '🌹'], correct: '🌻' },
  { pattern: ['🚗', '🚌', '🚗', '🚌', '🚗', '❓'], missingIndex: 5, options: ['🚌', '✈️', '🚗'], correct: '🚌' },
  { pattern: ['❤️', '💛', '💙', '❤️', '💛', '❓'], missingIndex: 5, options: ['💙', '💚', '❤️'], correct: '💙' },
  { pattern: ['🐸', '🐸', '🐛', '🐸', '🐸', '❓'], missingIndex: 5, options: ['🐛', '🐸', '🐝'], correct: '🐛' },
  { pattern: ['🌈', '☁️', '🌈', '☁️', '🌈', '❓'], missingIndex: 5, options: ['🌈', '☁️', '⛅'], correct: '☁️' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PatternPuzzle({ onBack }: PatternPuzzleProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledLevels] = useState(() => shuffle(levels).slice(0, 5));

  const level = shuffledLevels[currentLevel];

  const handleSelect = useCallback(
    (answer: string) => {
      if (selectedAnswer) return;
      playClick();
      setSelectedAnswer(answer);
      if (answer === level.correct) {
        setIsCorrect(true);
        playCorrect();
        setStars((s) => s + 1);
        setTimeout(() => {
          if (currentLevel < shuffledLevels.length - 1) {
            setCurrentLevel((l) => l + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
          } else {
            setShowCelebration(true);
          }
        }, 1000);
      } else {
        setIsCorrect(false);
        playWrong();
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsCorrect(null);
        }, 800);
      }
    },
    [selectedAnswer, level, currentLevel, shuffledLevels.length]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Pattern Pro! 🎨"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          setCurrentLevel(0);
          setSelectedAnswer(null);
          setIsCorrect(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Pattern Puzzle"
        emoji="🔢"
        subtitle={`Level ${currentLevel + 1} of ${shuffledLevels.length}`}
        onBack={onBack}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-yellow to-candy-orange h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentLevel) / shuffledLevels.length) * 100}%` }}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
          <p className="text-white text-center text-lg font-bold mb-6">
            What comes next? Complete the pattern! 🤔
          </p>
          {/* Pattern display */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {level.pattern.map((item, i) => (
              <div
                key={i}
                className={`text-4xl sm:text-5xl p-3 rounded-2xl transition-all duration-300 ${
                  item === '❓'
                    ? isCorrect === true
                      ? 'bg-candy-green/30 animate-pop-in'
                      : 'bg-white/20 animate-pulse-glow border-2 border-dashed border-white/50'
                    : 'bg-white/10'
                }`}
              >
                {item === '❓' && isCorrect === true ? selectedAnswer : item}
              </div>
            ))}
          </div>

          {/* Options */}
          <p className="text-white/80 text-center mb-4 font-bold">Choose the correct answer:</p>
          <div className="flex justify-center gap-4">
            {level.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={selectedAnswer !== null && isCorrect === true}
                className={`text-4xl sm:text-5xl p-4 rounded-2xl transition-all duration-300 ${
                  selectedAnswer === option
                    ? isCorrect === true
                      ? 'bg-candy-green/40 ring-4 ring-candy-green scale-110'
                      : isCorrect === false
                      ? 'bg-candy-red/40 ring-4 ring-candy-red animate-shake'
                      : 'bg-white/30'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-110'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
