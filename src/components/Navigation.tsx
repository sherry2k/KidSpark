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
      {/* 🎯 BIG Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-5 py-3 md:px-6 md:py-4 shadow-lg border-4 border-white"
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

      {/* 🎯 BIGGER TITLE with Gradient Background */}
      <motion.div
        className="flex-1 text-center mx-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
      >
        <motion.h1
          className="inline-block bg-gradient-to-r from-white to-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-8 md:py-4 shadow-lg border-4 border-white"
          style={{ 
            fontFamily: "'Bubblegum One', cursive",
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            color: '#7B2CBF',
            textShadow: '2px 2px 0 rgba(0,0,0,0.05)',
            boxShadow: '0 6px 0 rgba(139, 92, 246, 0.3), 0 8px 20px rgba(0,0,0,0.15)',
            minHeight: '55px',
            lineHeight: '1.2'
          }}
          animate={{
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {title}
        </motion.h1>
      </motion.div>

      {/* Stats - BIG BUTTONS */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {stars !== undefined && (
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-lg border-4 border-white"
            style={{
              minHeight: '55px',
              minWidth: '70px',
              boxShadow: '0 6px 0 #7B2CBF, 0 8px 20px rgba(0,0,0,0.15)',
            }}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <motion.span 
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌟
            </motion.span>
            <span 
              className="font-bold text-white text-base md:text-lg"
              style={{ 
                fontFamily: "'Bubblegum One', cursive",
                textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            >
              {stars}
            </span>
          </motion.div>
        )}
        {coins !== undefined && (
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-lg border-4 border-white"
            style={{
              minHeight: '55px',
              minWidth: '70px',
              boxShadow: '0 6px 0 #B91C1C, 0 8px 20px rgba(0,0,0,0.15)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              🪙
            </motion.span>
            <span 
              className="font-bold text-white text-base md:text-lg"
              style={{ 
                fontFamily: "'Bubblegum One', cursive",
                textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
              }}
            >
              {coins}
            </span>
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
