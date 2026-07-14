import React from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { achievements } from '../data/gameData';
import { GameProgress } from '../store/gameStore';

interface AchievementsScreenProps {
  progress: GameProgress;
  onBack: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ progress, onBack }) => {
  const getAchievementProgress = (achievement: typeof achievements[0]): number => {
    switch (achievement.type) {
      case 'quizzes': return Math.min(progress.quizzesCompleted / achievement.requirement, 1);
      case 'stars': return Math.min(progress.stars / achievement.requirement, 1);
      case 'streak': return Math.min(progress.streak / achievement.requirement, 1);
      case 'lessons': return Math.min(progress.lessonsCompleted / achievement.requirement, 1);
      case 'games': return Math.min(progress.gamesPlayed / achievement.requirement, 1);
      default: return 0;
    }
  };

  const getCurrentValue = (achievement: typeof achievements[0]): number => {
    switch (achievement.type) {
      case 'quizzes': return progress.quizzesCompleted;
      case 'stars': return progress.stars;
      case 'streak': return progress.streak;
      case 'lessons': return progress.lessonsCompleted;
      case 'games': return progress.gamesPlayed;
      default: return 0;
    }
  };

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation title="🏆 Achievements" onBack={onBack} stars={progress.stars} coins={progress.coins} />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
          <motion.p
            className="text-center text-gray-500 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Earn badges by learning and playing! 🌟
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {achievements.map((badge, i) => {
              const prog = getAchievementProgress(badge);
              const earned = prog >= 1;
              const current = getCurrentValue(badge);

              return (
                <motion.div
                  key={badge.id}
                  className={`rounded-2xl p-4 shadow-md border-2 ${
                    earned
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-white/80 border-gray-100'
                  }`}
                  initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`text-4xl ${earned ? '' : 'opacity-30 grayscale'}`}
                      animate={earned ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {badge.emoji}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">{badge.name}</h4>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                      <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${earned ? 'bg-yellow-400' : 'bg-blue-400'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${prog * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {current}/{badge.requirement}
                      </p>
                    </div>
                    {earned && (
                      <motion.span
                        className="text-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        ✅
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default AchievementsScreen;
