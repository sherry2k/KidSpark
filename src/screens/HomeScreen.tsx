import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import { gameModes, dailyChallenges } from '../data/gameData';
import { PlayerProfile, GameProgress } from '../store/gameStore';
import { playClick } from '../utils/sounds';

/**
 * HomeScreen — same screen, without the main-thread tax.
 *
 * WHAT WAS SLOW
 *
 * 1. ~35 framer-motion loops with `repeat: Infinity` ran at once, forever,
 *    including every card scrolled off the bottom of the phone. Twenty of them
 *    were in the game grid alone — each card had a spinning sparkle and a
 *    bobbing emoji. All of that is JavaScript writing inline styles every
 *    frame. They're now CSS keyframes on transform/opacity, which the browser
 *    runs on the compositor without waking JavaScript at all.
 *
 * 2. The streak banner animated `boxShadow` on a loop. `box-shadow` can't be
 *    composited, so that repainted the banner every frame of every second the
 *    app was open. Gone.
 *
 * 3. The grid staggered with `delay: 0.1 + index * 0.05` on a spring. Ten
 *    cards means the last one starts at 0.55s and settles around 1.2s — that
 *    is the slow cascade you're seeing. The stagger is now capped, so the last
 *    card lands at ~0.25s however many games you add.
 *
 * 4. `new Date()` ran five times per render. Once now, memoised.
 *
 * Everything on screen looks the same. Nothing about the layout changed.
 */

interface HomeScreenProps {
  profile: PlayerProfile;
  progress: GameProgress;
  onSelectMode: (mode: string) => void;
  onOpenProfile: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
}

const FONT = "'Fredoka', 'Arial Black', sans-serif";

const GAME_MODE_STYLES: Record<string, { gradient: string; shadow: string; difficulty: string; stars: string }> = {
  learn: { gradient: 'from-blue-400 to-cyan-500', shadow: '#0369A1', difficulty: 'Easy', stars: '⭐' },
  quiz: { gradient: 'from-purple-500 to-pink-500', shadow: '#6B21A8', difficulty: 'Medium', stars: '⭐⭐' },
  memory: { gradient: 'from-green-500 to-emerald-500', shadow: '#047857', difficulty: 'Easy', stars: '⭐' },
  match: { gradient: 'from-orange-400 to-yellow-500', shadow: '#B45309', difficulty: 'Easy', stars: '⭐' },
  math: { gradient: 'from-red-500 to-pink-500', shadow: '#B91C1C', difficulty: 'Medium', stars: '⭐⭐' },
  wordbuilder: { gradient: 'from-sky-400 to-blue-500', shadow: '#1E40AF', difficulty: 'Medium', stars: '⭐⭐' },
  coloring: { gradient: 'from-pink-400 to-rose-500', shadow: '#BE185D', difficulty: 'Easy', stars: '⭐' },
  puzzle: { gradient: 'from-violet-500 to-purple-500', shadow: '#6D28D9', difficulty: 'Medium', stars: '⭐⭐' },
  skills: { gradient: 'from-amber-400 to-orange-500', shadow: '#C2410C', difficulty: 'Fun', stars: '⭐⭐⭐' },
  creative: { gradient: 'from-pink-400 to-purple-500', shadow: '#7a2ec9', difficulty: 'Fun', stars: '⭐⭐' },
};

const getStreakMessage = (streak: number) => {
  if (streak === 0) return { message: 'Start your learning journey!', emoji: '🚀', color: 'from-blue-400 to-purple-500' };
  if (streak === 1) return { message: 'Great start! Keep going!', emoji: '🌱', color: 'from-green-400 to-emerald-500' };
  if (streak < 3) return { message: "You're doing amazing!", emoji: '✨', color: 'from-yellow-400 to-orange-500' };
  if (streak < 7) return { message: "You're on fire! 🔥", emoji: '🔥', color: 'from-orange-500 to-red-500' };
  if (streak < 14) return { message: 'Wow! Super Learner!', emoji: '⭐', color: 'from-purple-500 to-pink-500' };
  if (streak < 30) return { message: "Amazing! You're a Star!", emoji: '🌟', color: 'from-pink-500 to-red-500' };
  return { message: 'LEGENDARY! Master Learner!', emoji: '👑', color: 'from-yellow-400 to-yellow-600' };
};

/** Short, capped entrance. Never a spring — springs overshoot and take longer. */
const rise = (i = 0) => ({
  initial: { y: 14, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.26, delay: Math.min(i, 5) * 0.035, ease: [0.2, 0.7, 0.3, 1] as const },
});

const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  progress,
  onSelectMode,
  onOpenProfile,
  onOpenProgress,
  onOpenSettings,
  onOpenAchievements,
}) => {
  /* one Date, not five per render */
  const { todayChallenge, challengeCompleted, isNewDay, dayLabel } = useMemo(() => {
    const now = new Date();
    const key = now.toDateString();
    const challenge = dailyChallenges[now.getDay() % dailyChallenges.length];
    return {
      todayChallenge: challenge,
      challengeCompleted: progress.dailyChallengesCompleted.includes(`${key}_${challenge.id}`),
      isNewDay: progress.lastPlayDate !== key,
      dayLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()],
    };
  }, [progress.dailyChallengesCompleted, progress.lastPlayDate]);

  const streakInfo = getStreakMessage(progress.streak);
  const accuracy = progress.totalAnswers > 0 ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) : 0;

  return (
    <GameBackground variant="home">
      <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden pb-6">
        {/* ---------------- top bar ---------------- */}
        <motion.div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-2" {...rise()}>
          <motion.button
            onClick={() => { playClick(); onOpenProfile(); }}
            className="flex items-center gap-2 bg-white/90 rounded-2xl pl-2 pr-4 py-3 shadow-lg border-4 border-white"
            style={{ minHeight: 65 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-4xl md:text-5xl">{profile.avatar}</span>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm md:text-base leading-tight" style={{ fontFamily: FONT, fontWeight: 900 }}>
                {profile.name || 'Little Star'}
              </p>
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <span className="ks-pulse inline-block">🔥</span>
                {progress.streak} day streak
              </p>
            </div>
          </motion.button>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              onClick={() => { playClick(); onOpenProgress(); }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
              style={{ minHeight: 65, minWidth: 75 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl md:text-3xl ks-wiggle inline-block">🌟</span>
              <span className="font-black text-white text-lg md:text-xl" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
                {progress.stars}
              </span>
            </motion.button>

            <motion.button
              onClick={() => { playClick(); onOpenProgress(); }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-4 py-3 shadow-lg border-4 border-white"
              style={{ minHeight: 65, minWidth: 75 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl md:text-3xl ks-spin inline-block">🪙</span>
              <span className="font-black text-white text-lg md:text-xl" style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>
                {progress.coins}
              </span>
            </motion.button>

            <motion.button
              onClick={() => { playClick(); onOpenSettings(); }}
              className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg border-4 border-white"
              style={{ minHeight: 65, minWidth: 65 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-3xl md:text-4xl ks-spin-slow inline-block">⚙️</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ---------------- streak banner ---------------- */}
        <motion.div className="mx-4 md:mx-6 mb-4" {...rise(1)}>
          <div
            className={`bg-gradient-to-r ${streakInfo.color} rounded-3xl p-4 md:p-5 text-white border-4 border-white relative overflow-hidden`}
            /* static shadow — the animated box-shadow loop repainted this every frame */
            style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.15), 0 12px 25px rgba(0,0,0,0.2)' }}
          >
            <div className="absolute top-2 right-2 text-yellow-200 text-2xl ks-twinkle">✨</div>
            <div className="absolute bottom-2 left-2 text-yellow-200 text-xl ks-twinkle ks-d3">✨</div>

            <div className="flex items-center gap-4">
              <div className="text-5xl md:text-6xl ks-bob-tilt">{streakInfo.emoji}</div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                  {progress.streak === 0 ? 'Welcome!' : `Day ${progress.streak} Streak!`}
                </h3>
                <p className="text-sm md:text-base opacity-95 font-semibold">{streakInfo.message}</p>
                {isNewDay && progress.streak > 0 && (
                  <p className="text-xs md:text-sm mt-1 bg-white/20 rounded-full px-3 py-1 inline-block">
                    🎁 Play today to keep your streak!
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------------- welcome ---------------- */}
        <motion.div className="mx-4 md:mx-6 mb-4" {...rise(2)}>
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20 rotate-12 pointer-events-none">🎓</div>
            <div className="absolute bottom-2 right-4 text-3xl md:text-4xl opacity-70 pointer-events-none ks-bob-tilt ks-d2">🦄</div>

            <div className="relative z-10 pr-16 md:pr-20 text-center">
              <h2 className="text-xl md:text-2xl font-black mb-2" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                Welcome back, {profile.name || 'Little Star'}! 🎉
              </h2>
              <p className="text-white/90 text-sm md:text-base font-semibold" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
                Ready to learn and play today?
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------------- daily challenge ---------------- */}
        <motion.div className="mx-4 md:mx-6 mb-4" {...rise(3)}>
          <motion.button
            onClick={() => !challengeCompleted && onSelectMode(todayChallenge.gameMode)}
            className="w-full text-left"
            whileTap={!challengeCompleted ? { scale: 0.98 } : {}}
            disabled={challengeCompleted}
          >
            <div
              className={`rounded-2xl p-4 border-2 relative overflow-hidden ${
                challengeCompleted
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 border-orange-300'
              }`}
              style={
                challengeCompleted
                  ? { boxShadow: '0 4px 0 #059669, 0 6px 15px rgba(0,0,0,0.1)' }
                  : { boxShadow: '0 6px 0 #C2410C, 0 8px 20px rgba(0,0,0,0.15)' }
              }
            >
              {!challengeCompleted && (
                <>
                  <div className="absolute top-2 right-2 text-yellow-200 text-xl opacity-80 ks-twinkle">✨</div>
                  <div className="absolute bottom-2 left-16 text-yellow-200 text-sm opacity-60 ks-twinkle ks-d3">⭐</div>
                </>
              )}

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl rounded-2xl p-2 ${challengeCompleted ? 'bg-green-200' : 'bg-white/20'} ${challengeCompleted ? '' : 'ks-bob'}`}>
                    {challengeCompleted ? '✅' : todayChallenge.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span
                        className={`text-xs font-black uppercase tracking-wide ${challengeCompleted ? 'text-green-600' : 'text-white/80'}`}
                        style={{ fontFamily: FONT }}
                      >
                        🎯 Daily Challenge
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          challengeCompleted ? 'bg-green-200 text-green-700' : 'bg-white/20 text-white'
                        }`}
                      >
                        {dayLabel}
                      </span>
                    </div>
                    <p
                      className={`font-black text-sm md:text-base leading-tight ${challengeCompleted ? 'text-green-800' : 'text-white'}`}
                      style={{ fontFamily: FONT, textShadow: challengeCompleted ? 'none' : '1px 1px 0 rgba(0,0,0,0.2)' }}
                    >
                      {todayChallenge.title}
                    </p>
                    {todayChallenge.description && (
                      <p className={`text-xs mt-0.5 ${challengeCompleted ? 'text-green-600' : 'text-white/80'}`}>
                        {challengeCompleted ? '🎉 Completed today!' : todayChallenge.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 ml-2">
                  <div
                    className={`flex items-center gap-1 rounded-2xl px-3 py-2 border-2 ${
                      challengeCompleted ? 'bg-green-200 border-green-300' : 'bg-white border-white/50 ks-pulse'
                    }`}
                  >
                    <span className="text-lg">⭐</span>
                    <span
                      className={`font-black text-base ${challengeCompleted ? 'text-green-700' : 'text-yellow-600'}`}
                      style={{ fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}
                    >
                      +{todayChallenge.reward}
                    </span>
                  </div>
                  {!challengeCompleted && <span className="text-white/70 text-xs font-semibold">Tap to play!</span>}
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ---------------- game grid ---------------- */}
        <div className="px-4 md:px-6 mb-4">
          <h3
            className="text-xl md:text-2xl font-black text-center text-gray-800 mb-4 flex items-center justify-center gap-2"
            style={{ fontFamily: FONT }}
          >
            🎮 Choose Your Game!
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            {gameModes.map((mode, index) => {
              const style = GAME_MODE_STYLES[mode.id] || {
                gradient: 'from-gray-400 to-gray-500',
                shadow: '#374151',
                difficulty: 'Fun',
                stars: '⭐',
              };
              /* only the first six sparkle — beyond that it's noise nobody sees at once */
              const sparkles = index < 6;

              return (
                <motion.button
                  key={mode.id}
                  onClick={() => { playClick(); onSelectMode(mode.id); }}
                  className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-4 md:p-5 text-white border-4 border-white relative overflow-hidden`}
                  style={{ boxShadow: `0 8px 0 ${style.shadow}, 0 12px 25px rgba(0,0,0,0.2)`, minHeight: 160 }}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  /* capped: the last card lands at ~0.25s no matter how many games you add */
                  transition={{ duration: 0.26, delay: Math.min(index, 5) * 0.035, ease: [0.2, 0.7, 0.3, 1] }}
                  whileTap={{ scale: 0.95, y: 4 }}
                >
                  {sparkles && (
                    <div className={`absolute top-2 right-2 text-yellow-200 text-lg opacity-70 ks-twinkle ks-d${(index % 5) + 1}`}>
                      ✨
                    </div>
                  )}

                  <div className={`text-5xl md:text-6xl mb-2 text-center ks-bob-tilt ks-d${(index % 5) + 1}`}>{mode.emoji}</div>

                  <h4
                    className="text-lg md:text-xl font-black mb-1 text-center"
                    style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,0.15)' }}
                  >
                    {mode.name}
                  </h4>
                  <p className="text-white/90 text-xs md:text-sm text-center mb-2 leading-tight">{mode.description}</p>
                  <div className="flex items-center justify-center gap-1 mt-auto">
                    <span className="text-sm md:text-base">{style.stars}</span>
                    <span className="text-xs md:text-sm text-white/90 font-semibold">{style.difficulty}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------------- below the fold ---------------- */}
        {/* content-visibility lets the browser skip this work until it scrolls in */}
        <div className="ks-lazy-section">
          <div className="px-4 md:px-6 mb-4">
            <h3 className="text-lg md:text-xl font-black text-gray-700 mb-3" style={{ fontFamily: FONT }}>
              📊 Your Journey
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                onClick={() => { playClick(); onOpenProgress(); }}
                className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl p-4 text-center border-4 border-white text-white"
                style={{ boxShadow: '0 6px 0 #0F766E, 0 8px 20px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95, y: 4 }}
              >
                <span className="text-3xl block mb-1">📈</span>
                <span className="text-xs md:text-sm font-black" style={{ fontFamily: FONT }}>Progress</span>
              </motion.button>

              <motion.button
                onClick={() => { playClick(); onOpenAchievements(); }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-center border-4 border-white text-white relative"
                style={{ boxShadow: '0 6px 0 #C2410C, 0 8px 20px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95, y: 4 }}
              >
                <span className="text-3xl block mb-1">🏆</span>
                <span className="text-xs md:text-sm font-black" style={{ fontFamily: FONT }}>Badges</span>
                {progress.earnedBadges.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white">
                    {progress.earnedBadges.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={() => { playClick(); onOpenProfile(); }}
                className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-4 text-center border-4 border-white text-white"
                style={{ boxShadow: '0 6px 0 #BE185D, 0 8px 20px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95, y: 4 }}
              >
                <span className="text-3xl block mb-1">👤</span>
                <span className="text-xs md:text-sm font-black" style={{ fontFamily: FONT }}>Profile</span>
              </motion.button>
            </div>
          </div>

          <div className="mx-4 md:mx-6 mb-4">
            <div className="bg-white/80 rounded-2xl p-4 border-4 border-white">
              <div className="grid grid-cols-4 gap-3 text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {[
                  { v: progress.lessonsCompleted, label: 'Lessons', c: 'text-purple-600' },
                  { v: progress.quizzesCompleted, label: 'Quizzes', c: 'text-green-600' },
                  { v: progress.gamesPlayed, label: 'Games', c: 'text-blue-600' },
                  { v: `${accuracy}%`, label: 'Accuracy', c: 'text-orange-600' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-2xl font-black ${s.c}`} style={{ fontFamily: FONT }}>{s.v}</p>
                    <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-4 md:mx-6 mb-20">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white border-4 border-white text-center">
              <p className="text-sm md:text-base font-black ks-bob" style={{ fontFamily: FONT }}>
                💡 Play &amp; Learn daily to keep your streak growing! 🔥
              </p>
              <p className="text-xs text-white/80 mt-1">More games unlock coming soon! ✨</p>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default HomeScreen;
