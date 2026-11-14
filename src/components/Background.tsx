import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { isWinter, SnowFall, SnowDrift } from './WinterDecor';

// Floating decorative elements for the background
const FloatingElement: React.FC<{
  emoji: string;
  style: React.CSSProperties;
  delay?: number;
}> = ({ emoji, style, delay = 0 }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-2xl md:text-3xl opacity-20"
    style={style}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  >
    {emoji}
  </motion.div>
);

const Cloud: React.FC<{ top: string; delay: number; size: string }> = ({ top, delay, size }) => (
  <div
    className="absolute pointer-events-none opacity-30"
    style={{ top, animationDelay: `${delay}s`, fontSize: size }}
  >
    <div className="animate-cloud">☁️</div>
  </div>
);

/* ---- winter look (only used while isWinter() is true) ---- */

/* icy blue -> lavender, one tint per variant so each kind of screen still feels a little different */
const WINTER_GRADIENTS = {
  home: 'linear-gradient(180deg,#CFE4FF 0%,#DCD3FF 45%,#EADBFF 100%)',
  game: 'linear-gradient(180deg,#DCD9FF 0%,#E6DCFF 50%,#F3E3FF 100%)',
  learn: 'linear-gradient(180deg,#CDEBFF 0%,#D7E6FF 50%,#E4E2FF 100%)',
};

/* snowy replacements for the summer decorations (same spots, same soft look) */
const WINTER_DECORATIONS = [
  { emoji: '❄️', style: { top: '5%', left: '5%' }, delay: 0 },
  { emoji: '⭐', style: { top: '15%', right: '8%' }, delay: 1 },
  { emoji: '✨', style: { top: '30%', left: '3%' }, delay: 2 },
  { emoji: '❄️', style: { top: '60%', right: '5%' }, delay: 1.5 },
  { emoji: '⛄', style: { top: '75%', left: '8%' }, delay: 0.5 },
  { emoji: '🎿', style: { bottom: '10%', right: '10%' }, delay: 3 },
  { emoji: '🌨️', style: { top: '8%', left: '50%' }, delay: 2.5 },
  { emoji: '💫', style: { top: '45%', right: '3%' }, delay: 1.8 },
];

export const GameBackground: React.FC<{ children: React.ReactNode; variant?: 'home' | 'game' | 'learn' }> = ({
  children,
  variant = 'home',
}) => {
  const winter = useMemo(() => isWinter(), []);

  const gradients = {
    home: 'bg-gradient-to-b from-sky-200 via-blue-100 to-purple-100',
    game: 'bg-gradient-to-b from-purple-100 via-pink-50 to-orange-50',
    learn: 'bg-gradient-to-b from-green-100 via-emerald-50 to-cyan-50',
  };

  const decorations = [
    { emoji: '⭐', style: { top: '5%', left: '5%' }, delay: 0 },
    { emoji: '🌟', style: { top: '15%', right: '8%' }, delay: 1 },
    { emoji: '✨', style: { top: '30%', left: '3%' }, delay: 2 },
    { emoji: '🎈', style: { top: '60%', right: '5%' }, delay: 1.5 },
    { emoji: '🦋', style: { top: '75%', left: '8%' }, delay: 0.5 },
    { emoji: '🌸', style: { bottom: '10%', right: '10%' }, delay: 3 },
    { emoji: '🌈', style: { top: '8%', left: '50%' }, delay: 2.5 },
    { emoji: '💫', style: { top: '45%', right: '3%' }, delay: 1.8 },
  ];

  const items = winter ? WINTER_DECORATIONS : decorations;

  return (
    <div
      className={`fixed inset-0 ${winter ? '' : gradients[variant]} overflow-hidden`}
      style={winter ? { background: WINTER_GRADIENTS[variant] } : undefined}
    >
      {/* Background dots pattern */}
      <div className="absolute inset-0 bg-dots" />

      {/* Clouds */}
      <Cloud top="8%" delay={0} size="3rem" />
      <Cloud top="20%" delay={15} size="2.5rem" />
      <Cloud top="35%" delay={8} size="2rem" />

      {/* Floating decorations */}
      {items.map((dec, i) => (
        <FloatingElement key={i} {...dec} />
      ))}

      {/* Sun (winter: a slowly turning snowflake instead) */}
      <motion.div
        className="absolute top-4 right-4 md:top-8 md:right-8 text-5xl md:text-6xl pointer-events-none opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {winter ? '❄️' : '☀️'}
      </motion.div>

      {/* Winter: soft snowy ground + a little falling snow. Both sit BEHIND the content
          (content is z-10) and ignore taps, so games play exactly as before.
          Only the Home-style background gets the snowman. */}
      {winter && (
        <>
          <SnowFall count={variant === 'home' ? 16 : 12} zIndex={2} />
          <SnowDrift snowman={variant === 'home'} trees={variant === 'home'} zIndex={1} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GameBackground;
