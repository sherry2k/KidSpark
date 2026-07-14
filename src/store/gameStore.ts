// ============================================================
// GAME STORE - State management using localStorage
// ============================================================

export interface PlayerProfile {
  name: string;
  avatar: string;
  age: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameProgress {
  stars: number;
  coins: number;
  quizzesCompleted: number;
  gamesPlayed: number;
  lessonsCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  lastPlayDate: string;
  completedLessons: string[];
  unlockedAvatars: string[];
  earnedBadges: string[];
  dailyChallengesCompleted: string[];
  categoryProgress: Record<string, number>;
  totalTimeSeconds: number;
}

const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  avatar: '🐻',
  age: 5,
  difficulty: 'easy',
};

const DEFAULT_PROGRESS: GameProgress = {
  stars: 0,
  coins: 0,
  quizzesCompleted: 0,
  gamesPlayed: 0,
  lessonsCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  streak: 0,
  lastPlayDate: '',
  completedLessons: [],
  unlockedAvatars: ['bear', 'bunny', 'fox'],
  earnedBadges: [],
  dailyChallengesCompleted: [],
  categoryProgress: {},
  totalTimeSeconds: 0,
};

const PROFILE_KEY = 'kidspark_profile';
const PROGRESS_KEY = 'kidspark_progress';
const SETTINGS_KEY = 'kidspark_settings';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  volume: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  highContrast: false,
  dyslexiaFont: false,
  volume: 0.7,
};

// Load from localStorage
export function loadProfile(): PlayerProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProgress(): GameProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    const progress = data ? { ...DEFAULT_PROGRESS, ...JSON.parse(data) } : DEFAULT_PROGRESS;
    
    // Check streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (progress.lastPlayDate !== today && progress.lastPlayDate !== yesterday) {
      progress.streak = 0;
    }
    
    return progress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: GameProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Progress update helpers
export function addStars(progress: GameProgress, count: number): GameProgress {
  return { ...progress, stars: progress.stars + count };
}

export function addCoins(progress: GameProgress, count: number): GameProgress {
  return { ...progress, coins: progress.coins + count };
}

export function recordQuiz(progress: GameProgress, correct: boolean): GameProgress {
  const updated = { ...progress };
  updated.totalAnswers += 1;
  if (correct) {
    updated.correctAnswers += 1;
    updated.stars += 1;
  }
  return updated;
}

export function completeQuiz(progress: GameProgress): GameProgress {
  const today = new Date().toDateString();
  const updated = { ...progress };
  updated.quizzesCompleted += 1;
  updated.gamesPlayed += 1;
  
  if (updated.lastPlayDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (updated.lastPlayDate === yesterday) {
      updated.streak += 1;
    } else {
      updated.streak = 1;
    }
    updated.lastPlayDate = today;
  }
  
  return updated;
}

export function completeLesson(progress: GameProgress, lessonId: string): GameProgress {
  const updated = { ...progress };
  if (!updated.completedLessons.includes(lessonId)) {
    updated.completedLessons.push(lessonId);
    updated.lessonsCompleted += 1;
    updated.stars += 2;
    updated.coins += 1;
  }
  return updated;
}

export function completeGame(progress: GameProgress, starsEarned: number): GameProgress {
  const today = new Date().toDateString();
  const updated = { ...progress };
  updated.gamesPlayed += 1;
  updated.stars += starsEarned;
  updated.coins += Math.floor(starsEarned / 2);
  
  if (updated.lastPlayDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (updated.lastPlayDate === yesterday) {
      updated.streak += 1;
    } else {
      updated.streak = 1;
    }
    updated.lastPlayDate = today;
  }
  
  return updated;
}

export function updateCategoryProgress(progress: GameProgress, category: string, percent: number): GameProgress {
  const updated = { ...progress };
  updated.categoryProgress = { ...updated.categoryProgress, [category]: Math.max(updated.categoryProgress[category] || 0, percent) };
  return updated;
}

export function resetProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}
