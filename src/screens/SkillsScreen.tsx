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

const SkillsScreen: React.FC<SkillsScreenProps> = ({ progress, onBack, onComplete }) => {
  const [view, setView] = useState<View>('career-select');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCategorySelect = (cat: SkillCategory) => {
    setSelectedCategory(cat);
    setView('skill-list');
  };

  const handleSkillSelect = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setCurrentStep(0);
    setView('skill-detail');
  };

  const handleNextStep = () => {
    if (!selectedSkill?.steps) return;
    if (currentStep < selectedSkill.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Skill complete
      if (!completedSkills.includes(selectedSkill.id)) {
        setCompletedSkills((prev) => [...prev, selectedSkill.id]);
        setShowCelebration(true);
        onComplete(2);
        setTimeout(() => {
          setShowCelebration(false);
          setView('skill-list');
          setSelectedSkill(null);
          setCurrentStep(0);
        }, 2500);
      } else {
        setView('skill-list');
        setSelectedSkill(null);
        setCurrentStep(0);
      }
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
          <Navigation title="🌟 Skills & Careers" onBack={onBack} stars={progress.stars} coins={progress.coins} />

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
              <p className="text-gray-500 text-sm mt-1">Learn real-world skills and discover careers!</p>
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
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Completed badge */}
                    {completedInCat > 0 && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {completedInCat}/{cat.items.length}
                      </div>
                    )}

                    {/* Emoji */}
                    <motion.span
                      className="text-4xl md:text-5xl block mb-2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
                    >
                      {cat.emoji}
                    </motion.span>

                    {/* Name */}
                    <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{cat.name}</h4>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-xs mt-1 hidden md:block">{cat.description}</p>

                    {/* Progress bar */}
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

            {/* Stats summary */}
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
            {/* Category header */}
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

            {/* Skills grid */}
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
                    {/* Completed check */}
                    {isCompleted && (
                      <motion.div
                        className="absolute top-1 right-1 text-green-500 text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✅
                      </motion.div>
                    )}

                    {/* Emoji */}
                    <motion.span
                      className="text-3xl md:text-4xl block mb-1"
                      animate={isCompleted ? {} : { y: [0, -3, 0] }}
                      transition={{ duration: 2 + i * 0.15, repeat: Infinity }}
                    >
                      {skill.emoji}
                    </motion.span>

                    {/* Name */}
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{skill.name}</h4>
                    
                    {/* Description (desktop) */}
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
  // SKILL DETAIL (Step-by-step learning)
  // =============================================
  if (view === 'skill-detail' && selectedSkill && selectedCategory) {
    const steps = selectedSkill.steps || [];
    const totalSteps = steps.length;
    const isLastStep = currentStep >= totalSteps - 1;
    const isAlreadyCompleted = completedSkills.includes(selectedSkill.id);

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

          <Celebration show={showCelebration} message="Skill Learned!" stars={2} />

          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${currentStep}`}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full text-center"
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
                  className="text-6xl md:text-8xl mb-3"
                  animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {selectedSkill.emoji}
                </motion.div>

                {/* Skill name */}
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-1"
                  style={{ fontFamily: "'Bubblegum One', cursive" }}
                >
                  {selectedSkill.name}
                </h2>

                <p className="text-gray-500 text-sm mb-3">{selectedSkill.description}</p>

                {/* Fun fact (show on first step) */}
                {currentStep === 0 && (
                  <motion.div
                    className="bg-yellow-50 rounded-2xl p-3 mb-4 border-2 border-yellow-200"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-yellow-700 text-sm font-medium">
                      💡 {selectedSkill.funFact}
                    </p>
                  </motion.div>
                )}

                {/* Step display */}
                {totalSteps > 0 && currentStep < totalSteps && (
                  <div className="mt-2">
                    <p className="text-gray-400 text-xs mb-2">
                      Step {currentStep + 1} of {totalSteps}
                    </p>

                    <motion.div
                      className={`bg-gradient-to-br ${selectedCategory.gradient} bg-opacity-10 rounded-2xl p-5 mb-4 border-2`}
                      style={{ borderColor: selectedCategory.color + '40', backgroundColor: selectedCategory.color + '10' }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                        >
                          {currentStep + 1}
                        </motion.div>
                        <p className="text-gray-700 font-medium text-left text-sm md:text-base">
                          {steps[currentStep]}
                        </p>
                      </div>
                    </motion.div>

                    {/* Step dots */}
                    <div className="flex justify-center gap-2 mb-3">
                      {steps.map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-2.5 rounded-full transition-all ${
                            i < currentStep
                              ? 'bg-green-400 w-2.5'
                              : i === currentStep
                              ? `bg-gradient-to-r ${selectedCategory.gradient} w-6`
                              : 'bg-gray-200 w-2.5'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Already completed badge */}
                {isAlreadyCompleted && (
                  <motion.p
                    className="text-green-500 text-sm font-bold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✅ You already learned this skill!
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action button */}
            <motion.button
              onClick={handleNextStep}
              className={`mt-5 px-10 py-4 rounded-full text-white text-lg font-bold shadow-xl ${
                isLastStep
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : `bg-gradient-to-r ${selectedCategory.gradient}`
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLastStep ? '🎉 Complete Skill!' : 'Next Step ▶️'}
            </motion.button>

            {/* Previous step button */}
            {currentStep > 0 && (
              <motion.button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="mt-2 text-gray-400 text-sm hover:text-gray-600"
                whileTap={{ scale: 0.95 }}
              >
                ◀️ Previous step
              </motion.button>
            )}
          </div>
        </div>
      </GameBackground>
    );
  }

  // Fallback
  return null;
};

export default SkillsScreen;
