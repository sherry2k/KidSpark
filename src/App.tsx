import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PrivacyPolicy from './PrivacyPolicy';

// Screens
import SplashScreen from './screens/SplashScreen';
import ProfileSetup from './screens/ProfileSetup';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import QuizScreen from './screens/QuizScreen';
import MemoryGame from './screens/MemoryGame';
import MatchGame from './screens/MatchGame';
import MathGame from './screens/MathGame';
import WordBuilder from './screens/WordBuilder';
import ColoringBook from './screens/ColoringBook';
import PuzzleGame from './screens/PuzzleGame';
import ProgressScreen from './screens/ProgressScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SkillsScreen from './screens/SkillsScreen';

// Store
import {
  PlayerProfile,
  GameProgress,
  GameSettings,
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  recordQuiz,
  completeQuiz,
  completeLesson,
  completeGame,
  resetProgress,
} from './store/gameStore';

// Achievement checking
import { achievements } from './data/gameData';

// 🎵 Background Music Hook
import { useBackgroundMusic } from './hooks/useBackgroundMusic';

type Screen =
  | 'splash'
  | 'profile-setup'
  | 'home'
  | 'learn'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'math'
  | 'wordbuilder'
  | 'coloring'
  | 'puzzle'
  | 'progress'
  | 'achievements'
  | 'settings'
  | 'profile'
  | 'skills';

const KidSparkApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  
  // 🎵 Track if user has interacted (required by browsers for autoplay)
  const [hasStarted, setHasStarted] = useState(false);

  // 🎵 Initialize background music
  const { play: playMusic, pause: pauseMusic, fadeIn } = useBackgroundMusic({
    enabled: hasStarted && (settings.musicEnabled ?? true),
    volume: 0.3,
  });

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const checkAchievements = useCallback((prog: GameProgress) => {
    const newBadges = [...prog.earnedBadges];
    let changed = false;

    achievements.forEach((ach) => {
      if (newBadges.includes(ach.id)) return;

      let earned = false;
      switch (ach.type) {
        case 'quizzes': earned = prog.quizzesCompleted >= ach.requirement; break;
        case 'stars': earned = prog.stars >= ach.requirement; break;
        case 'streak': earned = prog.streak >= ach.requirement; break;
        case 'lessons': earned = prog.lessonsCompleted >= ach.requirement; break;
        case 'games': earned = prog.gamesPlayed >= ach.requirement; break;
      }

      if (earned) {
        newBadges.push(ach.id);
        changed = true;
      }
    });

    if (changed) {
      return { ...prog, earnedBadges: newBadges };
    }
    return prog;
  }, []);

  const updateProgress = useCallback((updater: (p: GameProgress) => GameProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      const withBadges = checkAchievements(updated);
      return withBadges;
    });
  }, [checkAchievements]);

  const handleSplashComplete = useCallback(() => {
    // 🎵 Mark that user has interacted - now music can play
    setHasStarted(true);
    
    // 🎵 Start music with fade-in effect
    setTimeout(() => {
      if (settings.musicEnabled ?? true) {
        fadeIn(2000);
      }
    }, 500);

    if (!profile.name) {
      setCurrentScreen('profile-setup');
    } else {
      setCurrentScreen('home');
    }
  }, [profile.name, settings.musicEnabled, fadeIn]);

  const handleProfileSetup = useCallback((newProfile: PlayerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setCurrentScreen('home');
  }, []);

  const handleSelectMode = useCallback((mode: string) => {
    switch (mode) {
      case 'learn': setCurrentScreen('learn'); break;
      case 'quiz': setCurrentScreen('quiz'); break;
      case 'memory': setCurrentScreen('memory'); break;
      case 'match': setCurrentScreen('match'); break;
      case 'math': setCurrentScreen('math'); break;
      case 'wordbuilder': setCurrentScreen('wordbuilder'); break;
      case 'coloring': setCurrentScreen('coloring'); break;
      case 'puzzle': setCurrentScreen('puzzle'); break;
      case 'skills': setCurrentScreen('skills'); break;
      default: setCurrentScreen('home');
    }
  }, []);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    updateProgress((p) => recordQuiz(p, correct));
  }, [updateProgress]);

  const handleQuizComplete = useCallback((_stars: number) => {
    updateProgress((p) => completeQuiz(p));
  }, [updateProgress]);

  const handleCompleteLesson = useCallback((lessonId: string) => {
    updateProgress((p) => completeLesson(p, lessonId));
  }, [updateProgress]);

  const handleGameComplete = useCallback((stars: number) => {
    updateProgress((p) => completeGame(p, stars));
  }, [updateProgress]);

  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleUpdateProfile = useCallback((newProfile: PlayerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  }, []);

  const handleResetProgress = useCallback(() => {
    resetProgress();
    setProgress(loadProgress());
    setCurrentScreen('home');
  }, []);

  const goHome = useCallback(() => setCurrentScreen('home'), []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'profile-setup':
        return <ProfileSetup onComplete={handleProfileSetup} />;
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            progress={progress}
            onSelectMode={handleSelectMode}
            onOpenProfile={() => setCurrentScreen('profile')}
            onOpenProgress={() => setCurrentScreen('progress')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenAchievements={() => setCurrentScreen('achievements')}
          />
        );
      case 'learn':
        return <LearnScreen progress={progress} onBack={goHome} onCompleteLesson={handleCompleteLesson} />;
      case 'quiz':
        return <QuizScreen progress={progress} onBack={goHome} onAnswer={handleQuizAnswer} onComplete={handleQuizComplete} />;
      case 'memory':
        return <MemoryGame progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      case 'match':
        return <MatchGame progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      case 'math':
        return <MathGame profile={profile} progress={progress} onBack={goHome} onAnswer={handleQuizAnswer} onComplete={handleGameComplete} />;
      case 'wordbuilder':
        return <WordBuilder progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      case 'coloring':
        return <ColoringBook progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      case 'puzzle':
        return <PuzzleGame progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      case 'progress':
        return <ProgressScreen profile={profile} progress={progress} onBack={goHome} />;
      case 'achievements':
        return <AchievementsScreen progress={progress} onBack={goHome} />;
      case 'settings':
        return <SettingsScreen settings={settings} progress={progress} onBack={goHome} onUpdateSettings={handleUpdateSettings} onResetProgress={handleResetProgress} />;
      case 'profile':
        return <ProfileScreen profile={profile} progress={progress} onBack={goHome} onUpdateProfile={handleUpdateProfile} />;
      case 'skills':
        return <SkillsScreen progress={progress} onBack={goHome} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-full ${settings.highContrast ? 'contrast-125' : ''}`}
      style={{
        fontFamily: settings.dyslexiaFont
          ? "'OpenDyslexic', 'Fredoka', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          : "'Fredoka', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Main App with routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/*" element={<KidSparkApp />} />
      </Routes>
    </BrowserRouter>
  );
}
