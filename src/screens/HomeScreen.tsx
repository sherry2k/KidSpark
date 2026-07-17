import React from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import { gameModes, dailyChallenges } from '../data/gameData';
import { PlayerProfile, GameProgress } from '../store/gameStore';

interface HomeScreenProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onSelectMode: (mode: string) => void;
  onOpenProfile: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
}

// Custom gradients and difficulty for each game mode
const GAME_MODE_STYLES: Record<string, {
  gradient: string;
  shadow: string;
  difficulty: string;
  stars: string;
}> = {
  'learn': {
    gradient: 'from-blue-400 to-cyan-500',
    shadow: '#0369A1',
    difficulty: 'Easy',
    stars: '⭐'
  },
  'quiz': {
    gradient: 'from-purple-500 to-pink-500',
    shadow: '#6B21A8',
    difficulty: 'Medium',
    stars: '⭐⭐'
  },
  'memory': {
    gradient: 'from-green-500 to-emerald-500',
    shadow: '#047857',
    difficulty: 'Easy',
    stars: '⭐'
  },
  'match': {
    gradient: 'from-orange-400 to-yellow-500',
    shadow: '#B45309',
    difficulty: 'Easy',
    stars: '⭐'
  },
  'math': {
    gradient: 'from-red-500 to-pink-500',
    shadow: '#B91C1C',
    difficulty: 'Medium',
    stars: '⭐⭐'
  },
  'wordbuilder': {
    gradient: 'from-sky-400 to-blue-500',
    shadow: '#1E40AF',
    difficulty: 'Medium',
    stars: '⭐⭐'
  },
  'coloring': {
    gradient: 'from-pink-400 to-rose-500',
    shadow: '#BE185D',
    difficulty: 'Easy',
    stars: '⭐'
  },
  'puzzle': {
    gradient: 'from-violet-500 to-purple-500',
    shadow: '#6D28D9',
    difficulty: 'Medium',
    stars: '⭐⭐'
  },
  'skills': {
    gradient: 'from-amber-400 to-orange-500',
    shadow: '#C2410C',
    difficulty: 'Fun',
    stars: '⭐⭐⭐'
  },
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  progress,
  onSelectMode,
  onOpenProfile,
  onOpenProgress,
  onOpenSettings,
  onOpenAchievements,
}) => {
  const todayIndex = new Date().getDay() % dailyChallenges.length;
  const todayChallenge = dailyChallenges[todayIndex];
  const challengeCompleted = progress.dailyChallengesCompleted.includes(
    new Date().toDateString() + '_' + todayChallenge.id
  );

  return (
    <GameBackground variant="home">
      <div className="h-full flex flex-col overflow-y-auto pb-6">
        {/* Top Bar */}
        <motion.div
          className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-2"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.button
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl pl-2 pr-4 py-3 shadow-lg border-4 border-white"
            style={{ minHeight: '65px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-4xl md:text-5xl">{profile.avatar}</span>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm md:text-base leading-tight" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {profile.name || 'Little Star'}
              </p>
              <p className="text-xs text-gray-500 font-semibold">🔥 {progress.streak} day streak</p>
            </div>
          </motion.button>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              onClick={onOpenProgress}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
              style={{ minHeight: '65px', minWidth: '75px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <motion.span
                className="text-2xl md:text-3xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🌟
              </motion.span>
              <span className="font-bold text-white text-lg md:text-xl" style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                {progress.stars}
              </span>
            </motion.button>

            <motion.button
              onClick={onOpenProgress}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
              style={{ minHeight: '65px', minWidth: '75px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-2xl md:text-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                🪙
              </motion.span>
              <span className="font-bold text-white text-lg md:text-xl" style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                {progress.coins}
              </span>
            </motion.button>

            <motion.button
              onClick={onOpenSettings}
              className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg border-4 border-white"
              style={{ minHeight: '65px', minWidth: '65px' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                className="text-3xl md:text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                ⚙️
              </motion.span>
            </motion.button>
          </div>
        </motion.div>

        {/* Welcome Banner */}
        <motion.div
          className="mx-4 md:mx-6 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20 rotate-12">🎓</div>
            <motion.div
              className="absolute bottom-2 right-4 text-4xl"
              animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🦄
            </motion.div>
            <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Welcome back, {profile.name || 'Little Star'}! 🎉
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              Ready to learn and play today?
            </p>
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          className="mx-4 md:mx-6 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => !challengeCompleted && onSelectMode(todayChallenge.gameMode)}
            className={'w-full text-left bg-gradient-to-r ' + (challengeCompleted ? 'from-green-100 to-emerald-100 border-green-300' : 'from-yellow-50 to-orange-50 border-orange-200') + ' rounded-2xl p-4 border-2 shadow-md'}
            whileHover={!challengeCompleted ? { scale: 1.01 } : {}}
            whileTap={!challengeCompleted ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{challengeCompleted ? '✅' : '🎯'}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Daily Challenge</p>
                  <p className="text-gray-500 text-xs">{todayChallenge.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1">
                <span>⭐</span>
                <span className="font-bold text-yellow-600 text-sm">+{todayChallenge.reward}</span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Game Modes Grid - NEW COLORFUL DESIGN */}
        <div className="px-4 md:px-6 mb-4">
          <h3
            className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            🎮 Choose Your Game!
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            {gameModes.map((mode, index) => {
              const style = GAME_MODE_STYLES[mode.id] || {
                gradient: 'from-gray-400 to-gray-500',
                shadow: '#374151',
                difficulty: 'Fun',
                stars: '⭐'
              };
              
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-4 md:p-5 text-white shadow-xl border-4 border-white relative overflow-hidden`}
                  style={{
                    boxShadow: `0 8px 0 ${style.shadow}, 0 12px 25px rgba(0,0,0,0.2)`,
                    minHeight: '160px',
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 4,
                    boxShadow: `0 4px 0 ${style.shadow}, 0 6px 15px rgba(0,0,0,0.2)`
                  }}
                >
                  {/* Decorative sparkle */}
                  <motion.div
                    className="absolute top-2 right-2 text-yellow-200 text-lg opacity-70"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    ✨
                  </motion.div>

                  {/* Big Emoji Icon */}
                  <motion.div
                    className="text-5xl md:text-6xl mb-2 text-center"
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, -3, 3, 0]
                    }}
                    transition={{ 
                      duration: 2 + index * 0.3, 
                      repeat: Infinity 
                    }}
                  >
                    {mode.emoji}
                  </motion.div>

                  {/* Game Name */}
                  <h4 
                    className="text-lg md:text-xl font-bold mb-1 text-center"
                    style={{ 
                      fontFamily: "'Bubblegum One', cursive",
                      textShadow: '2px 2px 0 rgba(0,0,0,0.15)'
                    }}
                  >
                    {mode.name}
                  </h4>

                  {/* Description */}
                  <p className="text-white/90 text-xs md:text-sm text-center mb-2 leading-tight">
                    {mode.description}
                  </p>

                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-center gap-1 mt-auto">
                    <span className="text-sm md:text-base">{style.stars}</span>
                    <span className="text-xs md:text-sm text-white/90 font-semibold">
                      {style.difficulty}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 md:px-6 mb-4">
          <h3
            className="text-lg md:text-xl font-bold text-gray-700 mb-3"
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            📊 Your Journey
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              onClick={onOpenProgress}
              className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl p-4 text-center shadow-lg border-4 border-white text-white"
              style={{
                boxShadow: '0 6px 0 #0F766E, 0 8px 20px rgba(0,0,0,0.15)',
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ 
                scale: 0.95, 
                y: 4,
                boxShadow: '0 2px 0 #0F766E, 0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <span className="text-3xl block mb-1">📈</span>
              <span className="text-xs md:text-sm font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                Progress
              </span>
            </motion.button>
            
            <motion.button
              onClick={onOpenAchievements}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-center shadow-lg border-4 border-white text-white relative"
              style={{
                boxShadow: '0 6px 0 #C2410C, 0 8px 20px rgba(0,0,0,0.15)',
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ 
                scale: 0.95, 
                y: 4,
                boxShadow: '0 2px 0 #C2410C, 0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <span className="text-3xl block mb-1">🏆</span>
              <span className="text-xs md:text-sm font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                Badges
              </span>
              {progress.earnedBadges.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white">
                  {progress.earnedBadges.length}
                </span>
              )}
            </motion.button>
            
            <motion.button
              onClick={onOpenProfile}
              className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-4 text-center shadow-lg border-4 border-white text-white"
              style={{
                boxShadow: '0 6px 0 #BE185D, 0 8px 20px rgba(0,0,0,0.15)',
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ 
                scale: 0.95, 
                y: 4,
                boxShadow: '0 2px 0 #BE185D, 0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <span className="text-3xl block mb-1">👤</span>
              <span className="text-xs md:text-sm font-bold" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                Profile
              </span>
            </motion.button>
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          className="mx-4 md:mx-6 mb-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border-4 border-white">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {progress.lessonsCompleted}
                </p>
                <p className="text-xs text-gray-500 font-semibold">Lessons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {progress.quizzesCompleted}
                </p>
                <p className="text-xs text-gray-500 font-semibold">Quizzes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {progress.gamesPlayed}
                </p>
                <p className="text-xs text-gray-500 font-semibold">Games</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {progress.totalAnswers > 0 ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 font-semibold">Accuracy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </GameBackground>
  );
};

export default HomeScreen;
