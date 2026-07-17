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

const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  progress,
  onSelectMode,
  onOpenProfile,
  onOpenProgress,
  onOpenSettings,
  onOpenAchievements,
}) => {
  // Get today's daily challenge
  const todayIndex = new Date().getDay() % dailyChallenges.length;
  const todayChallenge = dailyChallenges[todayIndex];
  const challengeCompleted = progress.dailyChallengesCompleted.includes(
    `${new Date().toDateString()}_${todayChallenge.id}`
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
          {/* Top Bar */}
<motion.div
  className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-2"
  initial={{ y: -30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  {/* 👤 BIG Profile Button */}
  <motion.button
    onClick={onOpenProfile}
    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl pl-2 pr-4 py-3 shadow-lg border-4 border-white"
    style={{
      boxShadow: '0 6px 0 rgba(139, 92, 246, 0.5), 0 8px 20px rgba(0,0,0,0.15)',
      minHeight: '65px',
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ 
      scale: 0.95, 
      y: 4,
      boxShadow: '0 2px 0 rgba(139, 92, 246, 0.5), 0 4px 10px rgba(0,0,0,0.15)'
    }}
  >
    <span className="text-4xl md:text-5xl">{profile.avatar}</span>
    <div className="text-left">
      <p 
        className="font-bold text-gray-800 text-sm md:text-base leading-tight"
        style={{ fontFamily: "'Bubblegum One', cursive" }}
      >
        {profile.name || 'Little Star'}
      </p>
      <p className="text-xs text-gray-500 font-semibold">🔥 {progress.streak} day streak</p>
    </div>
  </motion.button>

  {/* Stats & Settings - BIG BUTTONS */}
  <div className="flex items-center gap-2 md:gap-3">
    {/* 🌟 BIG Stars Button - FIXED VISIBILITY */}
    <motion.button
      onClick={onOpenProgress}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
      style={{
        boxShadow: '0 6px 0 #7B2CBF, 0 8px 20px rgba(0,0,0,0.15)',
        minHeight: '65px',
        minWidth: '75px',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.95, 
        y: 4,
        boxShadow: '0 2px 0 #7B2CBF, 0 4px 10px rgba(0,0,0,0.15)'
      }}
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }}
    >
      <motion.span 
        className="text-2xl md:text-3xl"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌟
      </motion.span>
      <span 
        className="font-bold text-white text-lg md:text-xl"
        style={{ 
          fontFamily: "'Bubblegum One', cursive",
          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
        }}
      >
        {progress.stars}
      </span>
    </motion.button>

    {/* 🪙 BIG Coins Button - IMPROVED VISIBILITY */}
    <motion.button
      onClick={onOpenProgress}
      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
      style={{
        boxShadow: '0 6px 0 #B91C1C, 0 8px 20px rgba(0,0,0,0.15)',
        minHeight: '65px',
        minWidth: '75px',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.95, 
        y: 4,
        boxShadow: '0 2px 0 #B91C1C, 0 4px 10px rgba(0,0,0,0.15)'
      }}
    >
      <motion.span 
        className="text-2xl md:text-3xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        🪙
      </motion.span>
      <span 
        className="font-bold text-white text-lg md:text-xl"
        style={{ 
          fontFamily: "'Bubblegum One', cursive",
          textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
        }}
      >
        {progress.coins}
      </span>
    </motion.button>

    {/* ⚙️ BIG Settings Button */}
    <motion.button
      onClick={onOpenSettings}
      className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg border-4 border-white"
      style={{
        boxShadow: '0 6px 0 #4338CA, 0 8px 20px rgba(0,0,0,0.15)',
        minHeight: '65px',
        minWidth: '65px',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ 
        scale: 0.9, 
        y: 4,
        boxShadow: '0 2px 0 #4338CA, 0 4px 10px rgba(0,0,0,0.15)'
      }}
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
            <h2
              className="text-xl md:text-2xl font-bold mb-1"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
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
            className={`w-full text-left bg-gradient-to-r ${
              challengeCompleted
                ? 'from-green-100 to-emerald-100 border-green-300'
                : 'from-yellow-50 to-orange-50 border-orange-200'
            } rounded-2xl p-4 border-2 shadow-md`}
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

        {/* Game Modes Grid */}
        <div className="px-4 md:px-6 mb-4">
          <h3
            className="text-lg md:text-xl font-bold text-gray-700 mb-3"
            style={{ fontFamily: "'Bubblegum One', cursive" }}
          >
            🎮 Let's Play!
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {gameModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className="game-card p-4 md:p-5 text-center relative overflow-hidden group"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <motion.span
                  className="text-4xl md:text-5xl block mb-2"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
                >
                  {mode.emoji}
                </motion.span>
                <h4 className="font-bold text-gray-800 text-sm md:text-base">{mode.name}</h4>
                <p className="text-gray-400 text-xs mt-1 hidden md:block">{mode.description}</p>
              </motion.button>
            ))}
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-3xl block mb-1">📈</span>
              <span className="text-xs font-bold text-gray-600">Progress</span>
            </motion.button>
            <motion.button
              onClick={onOpenAchievements}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-3xl block mb-1">🏆</span>
              <span className="text-xs font-bold text-gray-600">Badges</span>
              {progress.earnedBadges.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {progress.earnedBadges.length}
                </span>
              )}
            </motion.button>
            <motion.button
              onClick={onOpenProfile}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-3xl block mb-1">👤</span>
              <span className="text-xs font-bold text-gray-600">Profile</span>
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">{progress.lessonsCompleted}</p>
                <p className="text-xs text-gray-500">Lessons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{progress.quizzesCompleted}</p>
                <p className="text-xs text-gray-500">Quizzes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{progress.gamesPlayed}</p>
                <p className="text-xs text-gray-500">Games</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {progress.totalAnswers > 0
                    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </GameBackground>
  );
};

export default HomeScreen;
