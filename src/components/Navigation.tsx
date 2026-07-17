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
      className="flex items-center justify-between px-3 py-3 md:px-6 md:py-4 gap-2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🎯 BIG Back Button - Kid Friendly! */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-5 py-3 md:px-6 md:py-4 shadow-lg hover:shadow-xl transition-all border-4 border-white"
        style={{
          minWidth: '90px',
          minHeight: '55px',
          boxShadow: '0 6px 0 #7B2CBF, 0 8px 20px rgba(0,0,0,0.2)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ 
          scale: 0.95, 
          y: 4,
          boxShadow: '0 2px 0 #7B2CBF, 0 4px 10px rgba(0,0,0,0.2)'
        }}
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <motion.span 
          className="text-2xl md:text-3xl font-bold"
          animate={{ x: [-2, 0, -2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⬅️
        </motion.span>
        <span 
          className="font-bold text-base md:text-lg" 
          style={{ fontFamily: "'Bubblegum One', cursive" }}
        >
          Back
        </span>
      </motion.button>

      {/* Title */}
      <motion.h1
        className="text-base md:text-2xl font-bold text-gray-800 bg-white/70 backdrop-blur-sm rounded-full px-3 py-2 md:px-8 md:py-3 shadow-md font-heading flex-shrink"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
      >
        {title}
      </motion.h1>

      {/* Stats */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {stars !== undefined && (
          <motion.div
            className="flex items-center gap-1 bg-yellow-100/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg">⭐</span>
            <span className="font-bold text-yellow-700 text-sm md:text-base">{stars}</span>
          </motion.div>
        )}
        {coins !== undefined && (
          <motion.div
            className="flex items-center gap-1 bg-amber-100/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-md"
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
