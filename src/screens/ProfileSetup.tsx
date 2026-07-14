import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { avatarOptions } from '../data/gameData';
import { PlayerProfile } from '../store/gameStore';

interface ProfileSetupProps {
  onComplete: (profile: PlayerProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🐻');
  const [age, setAge] = useState(5);

  const handleFinish = () => {
    const difficulty = age <= 5 ? 'easy' : age <= 6 ? 'medium' : 'hard';
    onComplete({ name: name || 'Little Star', avatar, age, difficulty: difficulty as 'easy' | 'medium' | 'hard' });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-300 via-pink-200 to-yellow-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      {['🌟', '⭐', '✨', '🎈', '🦋', '🌸'].map((e, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20 pointer-events-none"
          style={{ left: `${10 + i * 15}%`, top: `${10 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity }}
        >
          {e}
        </motion.div>
      ))}

      <motion.div
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl max-w-lg w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Step 0: Name */}
        {step === 0 && (
          <motion.div
            className="text-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👋
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Hello there!
            </h2>
            <p className="text-gray-500 mb-6">What's your name?</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name..."
              maxLength={20}
              className="w-full text-center text-xl md:text-2xl font-bold text-purple-600 border-3 border-purple-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-purple-50/50 transition-all"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
              autoFocus
            />
            <motion.button
              onClick={() => setStep(1)}
              className="mt-6 w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl py-4 text-xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next ▶️
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Avatar */}
        {step === 1 && (
          <motion.div
            className="text-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              Pick your buddy!
            </h2>
            <p className="text-gray-500 mb-4">Choose your character</p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {avatarOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  onClick={() => setAvatar(opt.emoji)}
                  className={`text-4xl md:text-5xl p-3 rounded-2xl transition-all ${
                    avatar === opt.emoji
                      ? 'bg-purple-100 ring-4 ring-purple-400 scale-110 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {opt.emoji}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setStep(0)}
                className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 text-lg font-bold"
                whileTap={{ scale: 0.98 }}
              >
                ◀️ Back
              </motion.button>
              <motion.button
                onClick={() => setStep(2)}
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl py-3 text-lg font-bold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next ▶️
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <motion.div
            className="text-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {avatar}
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              How old are you, {name || 'Little Star'}?
            </h2>
            <p className="text-gray-500 mb-6">This helps us pick the right games!</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.button
                onClick={() => setAge(Math.max(3, age - 1))}
                className="w-14 h-14 bg-pink-100 rounded-full text-2xl font-bold text-pink-600 flex items-center justify-center shadow-md"
                whileTap={{ scale: 0.9 }}
              >
                −
              </motion.button>
              <motion.div
                className="text-6xl font-bold text-purple-600 w-20 text-center"
                key={age}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                {age}
              </motion.div>
              <motion.button
                onClick={() => setAge(Math.min(10, age + 1))}
                className="w-14 h-14 bg-blue-100 rounded-full text-2xl font-bold text-blue-600 flex items-center justify-center shadow-md"
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Level: {age <= 5 ? '🌱 Beginner' : age <= 6 ? '🌿 Intermediate' : '🌳 Advanced'}
            </p>

            <div className="flex gap-3">
              <motion.button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 text-lg font-bold"
                whileTap={{ scale: 0.98 }}
              >
                ◀️ Back
              </motion.button>
              <motion.button
                onClick={handleFinish}
                className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl py-3 text-lg font-bold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Let's Go! 🚀
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step ? 'bg-purple-400 w-8' : s < step ? 'bg-purple-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
