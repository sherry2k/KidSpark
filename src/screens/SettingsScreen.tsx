import React from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { GameSettings, GameProgress } from '../store/gameStore';
import { useContent } from '../context/ContentContext';

interface SettingsScreenProps {
  settings: GameSettings;
  progress: GameProgress;
  onBack: () => void;
  onUpdateSettings: (settings: GameSettings) => void;
  onResetProgress: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  progress,
  onBack,
  onUpdateSettings,
  onResetProgress,
}) => {
  const { isAirtable, lastUpdated, refreshContent, isLoading } = useContent();

  const toggleSetting = (key: keyof GameSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const AboutSection = () => (
    <motion.div
      className="bg-white/60 rounded-2xl p-4 text-center mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-3xl mb-2">✨</p>
      <p className="font-bold text-gray-700" style={{ fontFamily: "'Bubblegum One', cursive" }}>
        KidSpark
      </p>
      <p className="text-xs text-gray-400">Fun Learning Adventure for Kids</p>
      <p className="text-xs text-gray-300 mt-1">Made with ❤️ for little learners</p>
      
      {/* Content source indicator */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${isAirtable ? 'bg-green-400' : 'bg-gray-300'}`} />
          <span className="text-gray-400">
            {isAirtable ? 'Connected to Airtable' : 'Using offline content'}
          </span>
        </div>
        {isAirtable && lastUpdated && (
          <p className="text-xs text-gray-300 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        {isAirtable && (
          <motion.button
            onClick={refreshContent}
            disabled={isLoading}
            className="mt-2 text-xs text-blue-400 hover:text-blue-600 disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? '🔄 Refreshing...' : '🔄 Refresh content'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  const SettingToggle: React.FC<{
    label: string;
    emoji: string;
    description: string;
    value: boolean;
    onToggle: () => void;
  }> = ({ label, emoji, description, value, onToggle }) => (
    <motion.div
      className="flex items-center justify-between bg-white/80 rounded-2xl p-4 shadow-md"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full p-1 transition-colors ${
          value ? 'bg-green-400' : 'bg-gray-300'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: value ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );

  return (
    <GameBackground variant="learn">
      <div className="h-full flex flex-col">
        <Navigation title="⚙️ Settings" onBack={onBack} />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
          <div className="max-w-lg mx-auto space-y-3">
            {/* Sound Settings */}
            <motion.h3
              className="text-lg font-bold text-gray-700 mt-2"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🔊 Sound
            </motion.h3>

            <SettingToggle
              label="Sound Effects"
              emoji="🔔"
              description="Game sounds and feedback"
              value={settings.soundEnabled}
              onToggle={() => toggleSetting('soundEnabled')}
            />

            <SettingToggle
              label="Background Music"
              emoji="🎵"
              description="Relaxing background music"
              value={settings.musicEnabled}
              onToggle={() => toggleSetting('musicEnabled')}
            />

            {/* Accessibility */}
            <motion.h3
              className="text-lg font-bold text-gray-700 mt-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ♿ Accessibility
            </motion.h3>

            <SettingToggle
              label="High Contrast"
              emoji="🔲"
              description="Stronger colors and borders"
              value={settings.highContrast}
              onToggle={() => toggleSetting('highContrast')}
            />

            <SettingToggle
              label="Dyslexia Font"
              emoji="📖"
              description="Easier to read text"
              value={settings.dyslexiaFont}
              onToggle={() => toggleSetting('dyslexiaFont')}
            />

            {/* Data */}
            <motion.h3
              className="text-lg font-bold text-gray-700 mt-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              💾 Data
            </motion.h3>

            <motion.div
              className="bg-white/80 rounded-2xl p-4 shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-gray-600 mb-3">
                Your progress: {progress.stars} ⭐ • {progress.gamesPlayed} games • {progress.lessonsCompleted} lessons
              </p>
              <motion.button
                onClick={() => {
                  if (confirm('Are you sure? This will reset ALL your progress! ⚠️')) {
                    onResetProgress();
                  }
                }}
                className="w-full bg-red-50 text-red-500 rounded-xl py-3 font-bold text-sm border-2 border-red-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                🗑️ Reset All Progress
              </motion.button>
            </motion.div>

            {/* About */}
            <AboutSection />
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default SettingsScreen;
