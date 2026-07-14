import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  title: string;
  onBack: () => void;
  stars?: number;
  coins?: number;
  showProgress?: boolean;
  progress?: number;
}

const Navigation: React.FC<NavigationProps> = ({ title, onBack, stars, coins, showProgress, progress }) => {
  return (
    <motion.div
      className="flex items-center justify-between px-3 py-2 md:px-6 md:py-3"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 md:px-5 md:py-3 shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">◀️</span>
        <span className="hidden md:inline font-semibold text-gray-700">Back</span>
      </motion.button>

      {/* Title */}
      <motion.h1
        className="text-lg md:text-2xl font-bold text-gray-800 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 md:px-8 md:py-3 shadow-md"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
      >
        {title}
      </motion.h1>

      {/* Stats */}
      <div className="flex items-center gap-2 md:gap-4">
        {stars !== undefined && (
          <motion.div
            className="flex items-center gap-1 bg-yellow-100/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg">⭐</span>
            <span className="font-bold text-yellow-700 text-sm md:text-base">{stars}</span>
          </motion.div>
        )}
        {coins !== undefined && (
          <motion.div
            className="flex items-center gap-1 bg-amber-100/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg">🪙</span>
            <span className="font-bold text-amber-700 text-sm md:text-base">{coins}</span>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && progress !== undefined && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Navigation;
