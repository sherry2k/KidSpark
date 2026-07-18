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
        <>
          {/* Confetti particles - full screen but non-blocking */}
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
          </motion.div>

          {/* 🎯 SMALL Top Notification - Doesn't block content */}
          <motion.div
            className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ y: -100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full px-6 py-3 md:px-8 md:py-4 shadow-2xl border-4 border-white flex items-center gap-3"
              style={{
                boxShadow: '0 8px 0 rgba(217, 119, 6, 0.5), 0 12px 25px rgba(0,0,0,0.3)',
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.span
                className="text-3xl md:text-4xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                🏆
              </motion.span>
              <div className="flex flex-col items-start">
                <h2
                  className="text-lg md:text-2xl font-black text-white"
                  style={{ 
                    fontFamily: "'Fredoka', 'Arial Black', sans-serif",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  {message}
                </h2>
                {/* Small stars */}
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-base md:text-lg"
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{
                        opacity: i < stars ? 1 : 0.3,
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
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
