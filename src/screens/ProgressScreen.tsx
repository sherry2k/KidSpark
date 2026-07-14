import React from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { GameProgress, PlayerProfile } from '../store/gameStore';
import { useLearnCategories } from '../context/ContentContext';

interface ProgressScreenProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ profile, progress, onBack }) => {
  const learnCategories = useLearnCategories();
  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  const stats = [
    { label: 'Stars Earned', value: progress.stars, emoji: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Coins Collected', value: progress.coins, emoji: '🪙', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Quizzes Done', value: progress.quizzesCompleted, emoji: '❓', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Games Played', value: progress.gamesPlayed, emoji: '🎮', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Lessons Done', value: progress.lessonsCompleted, emoji: '📚', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Accuracy', value: `${accuracy}%`, emoji: '🎯', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Day Streak', value: progress.streak, emoji: '🔥', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Badges', value: progress.earnedBadges.length, emoji: '🏆', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <GameBackground variant="learn">
      <div className="h-full flex flex-col">
        <Navigation title="📊 Progress" onBack={onBack} stars={progress.stars} coins={progress.coins} />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
          {/* Player card */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{profile.avatar}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                  {profile.name || 'Little Star'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Age {profile.age} • {profile.difficulty === 'easy' ? '🌱 Beginner' : profile.difficulty === 'medium' ? '🌿 Intermediate' : '🌳 Advanced'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={`${stat.bg} rounded-2xl p-4 text-center shadow-md`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <span className="text-2xl block mb-1">{stat.emoji}</span>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Category progress */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3
              className="text-lg font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
            >
              📖 Learning Progress
            </h3>
            <div className="space-y-3">
              {learnCategories.map((cat) => {
                const completed = progress.completedLessons.includes(cat.id);
                const percent = completed ? 100 : (progress.categoryProgress[cat.id] || 0);

                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.emoji} {cat.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {completed ? '✅ Complete' : `${percent}%`}
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </GameBackground>
  );
};

export default ProgressScreen;
