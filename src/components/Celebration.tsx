import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationProps {
  show: boolean;
  message?: string;
  stars?: number;
  onComplete?: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ show, message = '🎉 Amazing!', stars = 3, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const emojis = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🎈', '🎁', '🏆', '🌈', '💎', '🦋'];
      const newParticles = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      if (onComplete) {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-2xl md:text-3xl"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                y: [0, -100 - Math.random() * 200],
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              {p.emoji}
            </motion.div>
          ))}

          {/* Main celebration message */}
          <motion.div
            className="text-center pointer-events-auto"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-yellow-300"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="text-4xl md:text-6xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                🏆
              </motion.div>
              <h2
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4 font-heading"
              >
                {message}
              </h2>
              {/* Stars */}
              <div className="flex justify-center gap-2 mb-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl md:text-5xl"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                      opacity: i < stars ? 1 : 0.3,
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Small inline feedback for correct/incorrect answers
export const FeedbackPopup: React.FC<{
  show: boolean;
  correct: boolean;
  message: string;
}> = ({ show, correct, message }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl text-xl md:text-2xl font-bold text-center ${
          correct
            ? 'bg-green-100 text-green-700 border-2 border-green-300'
            : 'bg-orange-100 text-orange-700 border-2 border-orange-300'
        }`}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// Stars earned display
export const StarsEarned: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.span
        key={i}
        className={`text-2xl ${i < count ? 'opacity-100' : 'opacity-20'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.15 }}
      >
        ⭐
      </motion.span>
    ))}
  </div>
);

export default Celebration;
