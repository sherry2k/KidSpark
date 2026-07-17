import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsReady(true); // 🎯 Show tap button instead of auto-completing
          return 100;
        }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleTapToStart = () => {
    // 🎵 User interaction happens here - music can now play!
    onComplete();
  };

  const letters = 'KidSpark'.split('');

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer" 
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #f5576c 100%)' }}
      onClick={isReady ? handleTapToStart : undefined}
    >
      {/* Background stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Logo */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        {/* Mascot */}
        <motion.div
          className="text-7xl md:text-9xl mb-4"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🦄
        </motion.div>

        {/* Title */}
        <div className="flex justify-center gap-1 mb-3">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="text-4xl md:text-7xl font-bold text-white drop-shadow-lg font-heading"
              initial={{ y: 50, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.3 + i * 0.08,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-white/90 text-lg md:text-xl font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          ✨ Fun Learning Adventure! ✨
        </motion.p>
      </motion.div>

      {/* Loading bar (only shows while loading) */}
      {!isReady && (
        <>
          <motion.div
            className="w-64 md:w-80 h-4 bg-white/30 rounded-full overflow-hidden shadow-inner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-300 via-green-300 to-cyan-300 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          <motion.p
            className="text-white/80 mt-3 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {progress < 30 ? '🎮 Loading games...' : progress < 60 ? '📚 Preparing lessons...' : progress < 90 ? '🎨 Getting colors ready...' : '🚀 Almost there!'}
          </motion.p>
        </>
      )}

      {/* 🎯 TAP TO START BUTTON (shows when loading is done) */}
      {isReady && (
        <motion.button
          onClick={handleTapToStart}
          className="mt-4 px-10 py-5 bg-yellow-300 text-purple-900 rounded-full font-bold text-2xl md:text-3xl shadow-2xl"
          style={{ 
            fontFamily: "'Bubblegum One', cursive",
            boxShadow: '0 8px 0 #F59E0B, 0 15px 30px rgba(0,0,0,0.3)' 
          }}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.05, 1],
            y: 0 
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 0.5, type: 'spring' }
          }}
          whileTap={{ scale: 0.95, y: 4, boxShadow: '0 4px 0 #F59E0B, 0 10px 20px rgba(0,0,0,0.3)' }}
        >
          🎮 Tap to Play!
        </motion.button>
      )}

      {/* Bottom decorations */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-4 opacity-40">
        {['🌸', '🌻', '🌺', '🌷', '🌼', '🌸', '🌻', '🌺'].map((f, i) => (
          <motion.span
            key={i}
            className="text-2xl md:text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {f}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
