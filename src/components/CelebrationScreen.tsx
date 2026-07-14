import { useEffect } from 'react';
import { fireConfetti, fireStars } from '../utils/confetti';
import { playComplete } from '../utils/sounds';

interface CelebrationScreenProps {
  message?: string;
  starsEarned?: number;
  onNext?: () => void;
  onHome?: () => void;
  onReplay?: () => void;
}

export default function CelebrationScreen({
  message = "Amazing Job!",
  starsEarned = 3,
  onNext,
  onHome,
  onReplay,
}: CelebrationScreenProps) {
  useEffect(() => {
    playComplete();
    fireConfetti();
    setTimeout(() => fireStars(), 500);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-bounce-in bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl">
        <div className="text-6xl mb-4 animate-float">🎉</div>
        <h2 className="text-3xl font-bold text-purple-600 font-[Bubblegum_Sans] mb-2">{message}</h2>
        <div className="flex justify-center gap-2 my-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-4xl transition-all ${i < starsEarned ? 'animate-pop-in' : 'opacity-30 grayscale'}`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>
        <p className="text-gray-500 mb-6">
          You earned {starsEarned} star{starsEarned !== 1 ? 's' : ''}!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {onHome && (
            <button
              onClick={onHome}
              className="btn-bounce bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl text-lg transition-all flex items-center gap-2"
            >
              🏠 Home
            </button>
          )}
          {onReplay && (
            <button
              onClick={onReplay}
              className="btn-bounce bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 px-6 rounded-xl text-lg transition-all flex items-center gap-2"
            >
              🔄 Replay
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="btn-bounce bg-gradient-to-r from-candy-pink to-candy-purple text-white font-bold py-3 px-6 rounded-xl text-lg transition-all flex items-center gap-2 shadow-lg"
            >
              Next ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
