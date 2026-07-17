import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration from '../components/Celebration';
import { careerCategories, SkillCategory, SkillItem } from '../data/gameData';
import { GameProgress } from '../store/gameStore';

interface SkillsScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type View = 'career-select' | 'skill-list' | 'skill-detail';
type ActivityType = 'steps' | 'quiz' | 'match' | 'drag' | 'complete';

const SkillsScreen: React.FC<SkillsScreenProps> = ({ progress, onBack, onComplete }) => {
  const [view, setView] = useState<View>('career-select');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>('steps');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [starsEarned, setStarsEarned] = useState(0);

  // Generate mini-activities for each step
  const getActivityForStep = (skill: SkillItem, stepIndex: number): ActivityType => {
    const activities: ActivityType[] = ['steps', 'quiz', 'match', 'drag'];
    if (stepIndex === 0) return 'steps'; // Always start with intro
    return activities[stepIndex % activities.length];
  };

  // Generate quiz for skill step
  const getQuizForStep = (skill: SkillItem, stepText: string) => {
    // Generate simple quiz based on step
    const quizzes: Record<string, any> = {
      'cook': {
        question: 'What should you always do before cooking?',
        options: ['🧼 Wash hands', '🎮 Play games', '📺 Watch TV'],
        correct: '🧼 Wash hands'
      },
      'clean': {
        question: 'Where do we put trash?',
        options: ['🗑️ Trash bin', '🛏️ Bed', '🍽️ Plate'],
        correct: '🗑️ Trash bin'
      },
      'brush': {
        question: 'How many times a day should we brush?',
        options: ['1️⃣ Once', '2️⃣ Twice', '5️⃣ Five times'],
        correct: '2️⃣ Twice'
      },
      'draw': {
        question: 'What do we use to draw?',
        options: ['✏️ Pencil', '🍴 Fork', '👕 Shirt'],
        correct: '✏️ Pencil'
      },
      'default': {
        question: 'Is this skill important?',
        options: ['✅ Yes!', '❌ No', '🤔 Maybe'],
        correct: '✅ Yes!'
      }
    };
    
    // Find matching quiz
    const skillLower = skill.name.toLowerCase();
    for (const key in quizzes) {
      if (skillLower.includes(key)) return quizzes[key];
    }
    return quizzes.default;
  };

  const handleCategorySelect = (cat: SkillCategory) => {
    setSelectedCategory(cat);
    setView('skill-list');
  };

  const handleSkillSelect = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setCurrentStep(0);
    setStarsEarned(0);
    setCompletedActions([]);
    setActivityType(getActivityForStep(skill, 0));
    setView('skill-detail');
  };

  const handleNextStep = () => {
    if (!selectedSkill?.steps) return;
    
    // Reset activity states
    setQuizAnswer(null);
    setQuizCorrect(null);
    
    if (currentStep < selectedSkill.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActivityType(getActivityForStep(selectedSkill, nextStep));
    } else {
      // Skill complete
      if (!completedSkills.includes(selectedSkill.id)) {
        setCompletedSkills((prev) => [...prev, selectedSkill.id]);
      }
      setShowCelebration(true);
      onComplete(3);
      setTimeout(() => {
        setShowCelebration(false);
        setView('skill-list');
        setSelectedSkill(null);
        setCurrentStep(0);
      }, 2500);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (!selectedSkill) return;
    const quiz = getQuizForStep(selectedSkill, '');
    setQuizAnswer(answer);
    const correct = answer === quiz.correct;
    setQuizCorrect(correct);
    
    if (correct) {
      setStarsEarned(s => s + 1);
      setTimeout(() => handleNextStep(), 1200);
    } else {
      setTimeout(() => {
        setQuizAnswer(null);
        setQuizCorrect(null);
      }, 1500);
    }
  };

  const handleActionComplete = (index: number) => {
    if (completedActions.includes(index)) return;
    setCompletedActions([...completedActions, index]);
    setStarsEarned(s => s + 0.5);
    
    // If all actions completed, move to next
    if (selectedSkill?.steps && completedActions.length + 1 >= 3) {
      setTimeout(() => {
        setCompletedActions([]);
        handleNextStep();
      }, 800);
    }
  };

  const goBackOne = () => {
    switch (view) {
      case 'skill-list':
        setView('career-select');
        setSelectedCategory(null);
        break;
      case 'skill-detail':
        setView('skill-list');
        setSelectedSkill(null);
        setCurrentStep(0);
        break;
      default:
        onBack();
    }
  };

  // =============================================
  // CAREER SELECTION (Main menu)
  // =============================================
  if (view === 'career-select') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🌟 Skills & Careers" onBack={onBack} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.div
              className="text-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2
                className="text-xl md:text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                Choose Your Adventure! 🚀
              </h2>
              <p className="text-gray-500 text-sm mt-1">Fun activities & real skills for boys and girls!</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              {careerCategories.map((cat, i) => {
                const completedInCat = cat.items.filter((s) => completedSkills.includes(s.id)).length;
                const progressPercent = (completedInCat / cat.items.length) * 100;

                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="game-card p-4 md:p-5 text-center relative overflow-hidden group"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {completedInCat > 0 && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {completedInCat}/{cat.items.length}
                      </div>
                    )}

                    <motion.span
                      className="text-4xl md:text-5xl block mb-2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
                    >
                      {cat.emoji}
                    </motion.span>

                    <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{cat.name}</h4>
                    <p className="text-gray-400 text-xs mt-1 hidden md:block">{cat.description}</p>

                    {completedInCat > 0 && (
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-4 bg-white/80 rounded-full px-6 py-3 shadow-md">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{completedSkills.length}</p>
                  <p className="text-xs text-gray-400">Skills Learned</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{careerCategories.length}</p>
                  <p className="text-xs text-gray-400">Career Paths</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // =============================================
  // SKILL LIST (Skills in a category)
  // =============================================
  if (view === 'skill-list' && selectedCategory) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation
            title={`${selectedCategory.emoji} ${selectedCategory.name}`}
            onBack={goBackOne}
            stars={progress.stars}
          />

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.div
              className={`bg-gradient-to-r ${selectedCategory.gradient} rounded-2xl p-4 mb-4 text-white text-center shadow-lg`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <span className="text-4xl">{selectedCategory.emoji}</span>
              <h3 className="text-lg font-bold mt-1">{selectedCategory.name}</h3>
              <p className="text-white/80 text-sm">{selectedCategory.description}</p>
              <p className="text-white/60 text-xs mt-1">
                {completedSkills.filter((id) => selectedCategory.items.some((s) => s.id === id)).length} / {selectedCategory.items.length} completed
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {selectedCategory.items.map((skill, i) => {
                const isCompleted = completedSkills.includes(skill.id);
                return (
                  <motion.button
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill)}
                    className={`game-card p-4 text-center relative overflow-hidden ${
                      isCompleted ? 'ring-2 ring-green-300 bg-green-50/50' : ''
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isCompleted && (
                      <motion.div
                        className="absolute top-1 right-1 text-green-500 text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✅
                      </motion.div>
                    )}

                    <motion.span
                      className="text-3xl md:text-4xl block mb-1"
                      animate={isCompleted ? {} : { y: [0, -3, 0] }}
                      transition={{ duration: 2 + i * 0.15, repeat: Infinity }}
                    >
                      {skill.emoji}
                    </motion.span>

                    <h4 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{skill.name}</h4>
                    <p className="text-gray-400 text-xs mt-1 hidden md:block line-clamp-2">{skill.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // =============================================
  // SKILL DETAIL - INTERACTIVE ACTIVITIES!
  // =============================================
  if (view === 'skill-detail' && selectedSkill && selectedCategory) {
    const steps = selectedSkill.steps || [];
    const totalSteps = steps.length;
    const currentStepText = steps[currentStep] || '';

    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation
            title={`${selectedSkill.emoji} ${selectedSkill.name}`}
            onBack={goBackOne}
            stars={progress.stars}
            showProgress
            progress={totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 100}
          />

          <Celebration show={showCelebration} message="Amazing Skill!" stars={3} />

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${currentStep}-${activityType}`}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-2xl max-w-2xl mx-auto border-4 border-white"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {/* Category badge */}
                <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${selectedCategory.gradient} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
                  <span>{selectedCategory.emoji}</span>
                  <span>{selectedCategory.name}</span>
                </div>

                {/* Skill emoji */}
                <motion.div
                  className="text-6xl md:text-7xl mb-3 text-center"
                  animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {selectedSkill.emoji}
                </motion.div>

                {/* Skill name */}
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 text-center"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  {selectedSkill.name}
                </h2>

                {/* Step counter */}
                <p className="text-center text-sm text-gray-500 mb-4">
                  Activity {currentStep + 1} of {totalSteps}
                </p>

                {/* Fun fact on first step */}
                {currentStep === 0 && (
                  <motion.div
                    className="bg-yellow-50 rounded-2xl p-3 mb-4 border-2 border-yellow-200"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <p className="text-yellow-700 text-sm font-medium text-center">
                      💡 {selectedSkill.funFact}
                    </p>
                  </motion.div>
                )}

                {/* ================================ */}
                {/* ACTIVITY 1: STEP READING */}
                {/* ================================ */}
                {activityType === 'steps' && (
                  <motion.div
                    className={`bg-gradient-to-br ${selectedCategory.gradient} rounded-3xl p-6 mb-4 text-white shadow-lg`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">📖</div>
                      <p className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                        Let's Learn!
                      </p>
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <p className="text-base md:text-lg font-medium">
                          {currentStepText}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ================================ */}
                {/* ACTIVITY 2: QUIZ */}
                {/* ================================ */}
                {activityType === 'quiz' && (() => {
                  const quiz = getQuizForStep(selectedSkill, currentStepText);
                  return (
                    <motion.div
                      className="mb-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="bg-purple-100 rounded-2xl p-4 mb-4 text-center">
                        <div className="text-4xl mb-2">🤔</div>
                        <p 
                          className="text-lg md:text-xl font-bold text-purple-900"
                          style={{ fontFamily: "'Bubblegum One', cursive" }}
                        >
                          {quiz.question}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {quiz.options.map((option: string, i: number) => {
                          const isSelected = quizAnswer === option;
                          const showResult = isSelected && quizCorrect !== null;
                          
                          return (
                            <motion.button
                              key={i}
                              onClick={() => handleQuizAnswer(option)}
                              disabled={quizAnswer !== null}
                              className={`p-4 rounded-2xl text-lg font-bold shadow-lg border-4 transition-all ${
                                showResult
                                  ? quizCorrect
                                    ? 'bg-green-400 text-white border-green-600'
                                    : 'bg-red-400 text-white border-red-600'
                                  : quizAnswer && !isSelected
                                    ? 'bg-gray-200 text-gray-400 border-gray-300'
                                    : 'bg-white text-gray-800 border-purple-300 hover:border-purple-500'
                              }`}
                              style={{
                                fontFamily: "'Bubblegum One', cursive",
                                minHeight: '65px',
                              }}
                              whileHover={quizAnswer === null ? { scale: 1.03 } : {}}
                              whileTap={quizAnswer === null ? { scale: 0.97 } : {}}
                            >
                              {option}
                              {showResult && quizCorrect && ' ✅'}
                              {showResult && !quizCorrect && ' ❌'}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })()}

                {/* ================================ */}
                {/* ACTIVITY 3: MATCH THE ACTIONS */}
                {/* ================================ */}
                {activityType === 'match' && (
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="bg-blue-100 rounded-2xl p-4 mb-4 text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <p 
                        className="text-lg md:text-xl font-bold text-blue-900"
                        style={{ fontFamily: "'Bubblegum One', cursive" }}
                      >
                        Tap all the right things! ({completedActions.length}/3)
                      </p>
                      <p className="text-sm text-blue-700 mt-2">{currentStepText}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {['✅', '⭐', '🎯', '❌', '💫', '🎊'].map((emoji, i) => {
                        const isCompleted = completedActions.includes(i);
                        const isCorrect = i < 3; // First 3 are correct
                        
                        return (
                          <motion.button
                            key={i}
                            onClick={() => isCorrect && handleActionComplete(i)}
                            disabled={isCompleted}
                            className={`aspect-square rounded-2xl text-4xl md:text-5xl flex items-center justify-center shadow-lg border-4 transition-all ${
                              isCompleted 
                                ? 'bg-green-200 border-green-500 scale-95' 
                                : 'bg-white border-white hover:scale-105'
                            }`}
                            style={{
                              boxShadow: isCompleted 
                                ? '0 4px 0 #047857' 
                                : '0 6px 0 rgba(0,0,0,0.15)'
                            }}
                            whileHover={!isCompleted ? { scale: 1.1 } : {}}
                            whileTap={!isCompleted ? { scale: 0.9 } : {}}
                          >
                            {isCompleted ? '✅' : emoji}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ================================ */}
                {/* ACTIVITY 4: DRAG TO COMPLETE */}
                {/* ================================ */}
                {activityType === 'drag' && (
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="bg-orange-100 rounded-2xl p-4 mb-4 text-center">
                      <div className="text-4xl mb-2">🎪</div>
                      <p 
                        className="text-lg md:text-xl font-bold text-orange-900"
                        style={{ fontFamily: "'Bubblegum One', cursive" }}
                      >
                        Practice Time!
                      </p>
                      <p className="text-sm text-orange-700 mt-2">{currentStepText}</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-4 border-4 border-dashed border-orange-300">
                      <p className="text-center text-gray-600 mb-3 font-bold">Tap 3 times to practice!</p>
                      <div className="flex justify-center gap-3">
                        {[0, 1, 2].map((i) => {
                          const isCompleted = completedActions.includes(i);
                          return (
                            <motion.button
                              key={i}
                              onClick={() => handleActionComplete(i)}
                              className={`w-20 h-20 md:w-24 md:h-24 rounded-full text-4xl flex items-center justify-center shadow-lg border-4 ${
                                isCompleted 
                                  ? 'bg-green-400 border-green-600' 
                                  : 'bg-gradient-to-br from-orange-400 to-red-500 border-white'
                              }`}
                              style={{
                                boxShadow: isCompleted 
                                  ? '0 4px 0 #047857' 
                                  : '0 6px 0 #C2410C'
                              }}
                              whileHover={!isCompleted ? { scale: 1.1 } : {}}
                              whileTap={!isCompleted ? { scale: 0.9, y: 3 } : {}}
                              animate={!isCompleted ? { 
                                scale: [1, 1.05, 1],
                              } : {}}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            >
                              {isCompleted ? '✅' : selectedSkill.emoji}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step dots */}
                {totalSteps > 0 && (
                  <div className="flex justify-center gap-2 mb-4">
                    {steps.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-3 rounded-full transition-all ${
                          i < currentStep
                            ? 'bg-green-400 w-3'
                            : i === currentStep
                            ? `bg-gradient-to-r ${selectedCategory.gradient} w-8`
                            : 'bg-gray-200 w-3'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action button - only for steps activity or when quiz is answered */}
            {(activityType === 'steps') && (
              <motion.button
                onClick={handleNextStep}
                className={`mt-5 mx-auto block px-10 py-4 rounded-2xl text-white text-lg font-bold shadow-xl border-4 border-white ${
                  currentStep >= totalSteps - 1
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : `bg-gradient-to-r ${selectedCategory.gradient}`
                }`}
                style={{
                  boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 4 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentStep >= totalSteps - 1 ? '🎉 Complete Skill!' : 'Next Activity ▶️'}
              </motion.button>
            )}

            {/* Skip button for interactive activities */}
            {activityType !== 'steps' && (
              <motion.button
                onClick={handleNextStep}
                className="mt-4 mx-auto block text-gray-500 text-sm underline"
                whileTap={{ scale: 0.95 }}
              >
                Skip this activity →
              </motion.button>
            )}
          </div>
        </div>
      </GameBackground>
    );
  }

  return null;
};

export default SkillsScreen;
