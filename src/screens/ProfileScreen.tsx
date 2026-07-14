import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { avatarOptions } from '../data/gameData';
import { PlayerProfile, GameProgress } from '../store/gameStore';

interface ProfileScreenProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
  onUpdateProfile: (profile: PlayerProfile) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, progress, onBack, onUpdateProfile }) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(profile.name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveName = () => {
    onUpdateProfile({ ...profile, name: name || 'Little Star' });
    setEditingName(false);
  };

  const handleSelectAvatar = (emoji: string) => {
    onUpdateProfile({ ...profile, avatar: emoji });
    setShowAvatarPicker(false);
  };

  const level = progress.stars < 20 ? 1 : progress.stars < 50 ? 2 : progress.stars < 100 ? 3 : progress.stars < 200 ? 4 : 5;
  const levelNames = ['Beginner', 'Explorer', 'Adventurer', 'Scholar', 'Master'];
  const levelEmojis = ['🌱', '🌿', '🌲', '🏔️', '👑'];

  return (
    <GameBackground variant="home">
      <div className="h-full flex flex-col">
        <Navigation title="👤 Profile" onBack={onBack} />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
          <div className="max-w-md mx-auto">
            {/* Avatar & Name */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl text-center mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <motion.button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="text-7xl mb-3 block mx-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {profile.avatar}
              </motion.button>

              {showAvatarPicker && (
                <motion.div
                  className="grid grid-cols-6 gap-2 mb-4 bg-gray-50 rounded-2xl p-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                >
                  {avatarOptions.map((opt) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelectAvatar(opt.emoji)}
                      className={`text-2xl p-2 rounded-xl ${
                        profile.avatar === opt.emoji ? 'bg-purple-100 ring-2 ring-purple-400' : 'hover:bg-gray-100'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {opt.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {editingName ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 text-center text-xl font-bold border-2 border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400"
                    autoFocus
                    maxLength={20}
                  />
                  <motion.button
                    onClick={handleSaveName}
                    className="bg-green-400 text-white rounded-xl px-4 font-bold"
                    whileTap={{ scale: 0.95 }}
                  >
                    ✓
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setEditingName(true)}
                  className="text-2xl font-bold text-gray-800 mb-1"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                  whileHover={{ scale: 1.02 }}
                >
                  {profile.name || 'Little Star'} ✏️
                </motion.button>
              )}

              <p className="text-gray-400 text-sm">
                Age {profile.age} • Level {level} {levelEmojis[level - 1]} {levelNames[level - 1]}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-gray-700 mb-3" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                📊 Your Stats
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-yellow-600">{progress.stars}</p>
                  <p className="text-xs text-gray-500">⭐ Stars</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-amber-600">{progress.coins}</p>
                  <p className="text-xs text-gray-500">🪙 Coins</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-orange-600">{progress.streak}</p>
                  <p className="text-xs text-gray-500">🔥 Streak</p>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Level {level}</span>
                  <span>Level {level + 1}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((progress.stars % 50) / 50) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Achievements summary */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-gray-700 mb-3" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                🏆 Badges Earned
              </h3>
              {progress.earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {progress.earnedBadges.map((badge) => (
                    <span key={badge} className="bg-yellow-100 rounded-full px-3 py-1 text-sm font-bold text-yellow-700">
                      {badge}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  🎯 Keep playing to earn badges!
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default ProfileScreen;
