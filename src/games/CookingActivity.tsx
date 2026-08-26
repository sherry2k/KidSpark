import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from '../components/mechanics/ItemIcon';
import GatherStage from '../components/mechanics/GatherStage';
import StirStage from '../components/mechanics/StirStage';
import PourStage from '../components/mechanics/PourStage';
import TimeStage from '../components/mechanics/TimeStage';
import ScrubStage from '../components/mechanics/ScrubStage';
import DecorateStage, { DecoratedItem } from '../components/mechanics/DecorateStage';
import { Recipe } from '../data/cookingRecipes';
import { Sticker, saveKeepsake } from '../utils/keepsakes';
import { buzz, speak, stopSpeaking, isVoiceEnabled, setVoiceEnabled, POP } from '../utils/kidJuice';
import { playClick, playComplete } from '../utils/sounds';

/**
 * CookingActivity — runs one recipe end to end.
 *
 * Structure: intro card → one stage per step → result card with a keepsake.
 *
 * The intro card is not decoration: mobile browsers only allow audio and
 * speech after a real tap, so the big "Let's cook!" button is what unlocks
 * the voice-over for the whole activity.
 */

interface Props {
  recipe: Recipe;
  categoryId: string;
  /** tailwind gradient classes from your category, e.g. "from-orange-400 to-red-500" */
  gradient: string;
  /** the solid drop-shadow colour you already use per category */
  shadow: string;
  stars: number;
  onBack: () => void;
  onComplete: (stars: number) => void;
  /** 'young' widens timing zones for 3-5s */
  ageBand?: 'young' | 'mid' | 'older';
}

type Phase = 'intro' | 'playing' | 'result';

const CookingActivity: React.FC<Props> = ({
  recipe,
  categoryId,
  gradient,
  shadow,
  stars,
  onBack,
  onComplete,
  ageBand = 'mid',
}) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [deco, setDeco] = useState<{ base: string; color: string; stickers: Sticker[] } | null>(null);
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled());
  const [showOff, setShowOff] = useState(false);
  const awarded = useRef(false);

  const forgiveness = ageBand === 'young' ? 1.7 : ageBand === 'older' ? 0.8 : 1;
  const step = recipe.steps[stepIndex];

  useEffect(() => () => stopSpeaking(), []);

  const start = () => {
    playClick();
    buzz('soft');
    // first real user gesture — this is what unlocks speech on iOS/Android
    speak(recipe.hook);
    setPhase('playing');
  };

  const nextStep = (payload?: { base: string; color: string; stickers: Sticker[] }) => {
    if (payload) setDeco(payload);

    if (stepIndex + 1 < recipe.steps.length) {
      setStepIndex((i) => i + 1);
      buzz('soft');
    } else {
      finish(payload ?? deco);
    }
  };

  const finish = (finalDeco: { base: string; color: string; stickers: Sticker[] } | null) => {
    playComplete();
    buzz('success');

    saveKeepsake({
      skillId: recipe.id,
      categoryId,
      title: recipe.title,
      base: finalDeco?.base ?? recipe.result.icon,
      color: finalDeco?.color ?? '#FFD1A6',
      stickers: finalDeco?.stickers ?? [],
    });

    if (!awarded.current) {
      awarded.current = true;
      onComplete(3);
    }

    setPhase('result');
    setTimeout(() => speak(`You made ${recipe.result.name}! ${recipe.funFact}`), 500);
  };

  const replay = () => {
    playClick();
    stopSpeaking();
    awarded.current = true; // stars are awarded once per visit, not per replay
    setDeco(null);
    setStepIndex(0);
    setPhase('playing');
    speak(recipe.hook);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
    playClick();
    if (next) speak('Voice on!');
  };

  const stage = useMemo(() => {
    if (!step) return null;
    switch (step.kind) {
      case 'gather':
        return <GatherStage key={stepIndex} step={step} onDone={() => nextStep()} />;
      case 'stir':
        return <StirStage key={stepIndex} step={step} onDone={() => nextStep()} />;
      case 'pour':
        return <PourStage key={stepIndex} step={step} onDone={() => nextStep()} />;
      case 'time':
        return <TimeStage key={stepIndex} step={step} onDone={() => nextStep()} forgiveness={forgiveness} />;
      case 'scrub':
        return <ScrubStage key={stepIndex} step={step} onDone={() => nextStep()} />;
      case 'decorate':
        return <DecorateStage key={stepIndex} step={step} onDone={(d) => nextStep(d)} />;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, step]);

  /* ---------------------------------------------------------------- */
  /* INTRO                                                            */
  /* ---------------------------------------------------------------- */
  if (phase === 'intro') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={POP}>
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <ItemIcon icon={recipe.result.icon} size={130} label={recipe.result.name} />
          </motion.div>
        </motion.div>

        <h2
          className="text-2xl md:text-3xl font-bold text-gray-800 mt-4"
          style={{ fontFamily: "'Bubblegum One', cursive" }}
        >
          {recipe.title}
        </h2>
        <p className="text-gray-600 mt-1 max-w-xs">{recipe.hook}</p>

        {/* what's coming — a real map, not a mystery */}
        <div className="flex gap-2 mt-5 flex-wrap justify-center max-w-xs">
          {recipe.steps.map((s, i) => (
            <div
              key={i}
              className="bg-white/90 border-4 border-white rounded-2xl px-3 py-2 text-xs font-bold text-gray-600 capitalize"
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
            >
              {s.kind === 'gather' && '🧺 collect'}
              {s.kind === 'pour' && '🥛 pour'}
              {s.kind === 'stir' && '🥄 stir'}
              {s.kind === 'time' && '⏱️ time it'}
              {s.kind === 'scrub' && '🧽 scrub'}
              {s.kind === 'decorate' && '🎨 decorate'}
            </div>
          ))}
        </div>

        <motion.button
          onClick={start}
          className={`mt-8 rounded-3xl px-10 py-5 text-white font-bold border-4 border-white bg-gradient-to-r ${gradient}`}
          style={{
            boxShadow: `0 8px 0 ${shadow}, 0 12px 24px rgba(0,0,0,.2)`,
            fontFamily: "'Bubblegum One', cursive",
            fontSize: '1.35rem',
            textShadow: '2px 2px 0 rgba(0,0,0,.18)',
          }}
          whileTap={{ scale: 0.94, y: 5 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          👩‍🍳 Let&apos;s cook!
        </motion.button>

        <button onClick={() => { playClick(); onBack(); }} className="mt-4 text-gray-500 font-semibold text-sm underline">
          Maybe later
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* RESULT                                                           */
  /* ---------------------------------------------------------------- */
  if (phase === 'result') {
    return (
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <div className="max-w-md mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP} className="mt-4">
            <DecoratedItem
              base={deco?.base ?? recipe.result.icon}
              color={deco?.color ?? '#FFD1A6'}
              stickers={deco?.stickers ?? []}
              size={230}
            />
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mt-2"
            style={{ fontFamily: "'Bubblegum One', cursive" }}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            You made {recipe.result.name}! 🎉
          </motion.h2>

          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-4xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 + i * 0.14, type: 'spring' }}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <motion.button
            onClick={() => { playClick(); setShowOff(true); }}
            className="mt-5 rounded-2xl px-7 py-4 text-white font-bold border-4 border-white"
            style={{
              background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
              boxShadow: '0 6px 0 #4C1D95',
              fontFamily: "'Bubblegum One', cursive",
              fontSize: '1.05rem',
            }}
            whileTap={{ scale: 0.95, y: 3 }}
          >
            👨‍👩‍👧 Show a grown-up!
          </motion.button>

          {/* fun fact — kid units, and spoken */}
          <div
            className="mt-5 bg-yellow-100 border-4 border-yellow-300 rounded-2xl p-4 flex items-start gap-2 text-left"
            style={{ boxShadow: '0 4px 0 #F59E0B' }}
          >
            <span className="text-2xl">💡</span>
            <p className="text-yellow-800 font-bold text-sm flex-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              {recipe.funFact}
            </p>
          </div>

          {/* the line that sells the app to the person who pays */}
          <div className="mt-3 bg-white/90 border-4 border-white rounded-2xl p-3 text-left w-full">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
            <p className="text-sm text-gray-600 font-semibold">{recipe.learned}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              onClick={replay}
              className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.95, y: 3 }}
            >
              🔄 Make another
            </motion.button>
            <motion.button
              onClick={() => { playClick(); stopSpeaking(); onBack(); }}
              className={`rounded-2xl px-6 py-4 text-white font-bold border-4 border-white bg-gradient-to-r ${gradient}`}
              style={{ boxShadow: `0 5px 0 ${shadow}`, fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.95, y: 3 }}
            >
              ✅ Done
            </motion.button>
          </div>
        </div>

        {/* full-screen "show a grown-up" */}
        <AnimatePresence>
          {showOff && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOff(false)}
            >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={POP}>
                <DecoratedItem
                  base={deco?.base ?? recipe.result.icon}
                  color={deco?.color ?? '#FFD1A6'}
                  stickers={deco?.stickers ?? []}
                  size={Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 60 : 300)}
                />
              </motion.div>
              <p className="mt-4 text-2xl font-bold text-gray-800" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                I made this! 🎉
              </p>
              <p className="mt-2 text-gray-400 text-sm">tap anywhere to close</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* PLAYING                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-8">
      <div className="max-w-md mx-auto">
        {/* step dots + voice toggle */}
        <div className="flex items-center justify-between gap-3 mb-3 mt-1">
          <div className="flex gap-1.5">
            {recipe.steps.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === stepIndex ? 30 : 12,
                  backgroundColor: i < stepIndex ? '#22C55E' : i === stepIndex ? '#F97316' : 'rgba(0,0,0,.15)',
                }}
                style={{ height: 12 }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">⭐ {stars}</span>
            <button
              onClick={toggleVoice}
              className="rounded-full bg-white/90 border-4 border-white w-11 h-11 flex items-center justify-center text-lg"
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
              aria-label={voiceOn ? 'Turn voice off' : 'Turn voice on'}
            >
              {voiceOn ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* the instruction — big, and tappable to hear it again */}
        <motion.button
          key={`say-${stepIndex}`}
          onClick={() => step && speak(step.say)}
          className={`w-full text-left rounded-3xl p-4 mb-4 text-white border-4 border-white bg-gradient-to-r ${gradient}`}
          style={{ boxShadow: `0 6px 0 ${shadow}` }}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={POP}
        >
          <p className="text-[11px] uppercase tracking-widest opacity-80 font-bold">
            Step {stepIndex + 1} of {recipe.steps.length}
          </p>
          <p
            className="text-lg md:text-xl font-bold leading-tight"
            style={{ fontFamily: "'Bubblegum One', cursive", textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}
          >
            {step?.say}
          </p>
          <p className="text-xs opacity-80 mt-1">🔊 tap to hear it again</p>
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {stage}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CookingActivity;
