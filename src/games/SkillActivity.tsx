import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemIcon from '../components/mechanics/ItemIcon';
import KeepsakeView from '../components/KeepsakeView';
import GatherStage from '../components/mechanics/GatherStage';
import StirStage from '../components/mechanics/StirStage';
import PourStage from '../components/mechanics/PourStage';
import TimeStage from '../components/mechanics/TimeStage';
import ScrubStage from '../components/mechanics/ScrubStage';
import DecorateStage from '../components/mechanics/DecorateStage';
import MixStage from '../components/mechanics/MixStage';
import DressStage from '../components/mechanics/DressStage';
import DrawStage from '../components/mechanics/DrawStage';
import SortStage from '../components/mechanics/SortStage';
import AnimalStage from '../components/mechanics/AnimalStage';
import GardenPlotStage from '../components/mechanics/GardenPlotStage';
import { Activity, StagePayload, STEP_LABEL } from '../data/activityTypes';
import { saveKeepsake } from '../utils/keepsakes';
import { buzz, speak, stopSpeaking, isVoiceEnabled, setVoiceEnabled, POP } from '../utils/kidJuice';
import { playClick, playComplete } from '../utils/sounds';
import SkillActivity from '../games/SkillActivity';
import { getActivity, isRebuilt } from '../data/skillActivities';
import { shadowFor } from '../data/categoryTiers';


/**
 * SkillActivity — runs any rebuilt activity, in any category.
 *
 * Replaces CookingActivity: same structure (intro → steps → result), but it
 * speaks every step kind, so Garden, Beauty and Art come for free.
 *
 * The intro card is load-bearing, not decoration: mobile browsers only allow
 * audio and speech after a real tap, so the big start button is what unlocks
 * the voice-over for the whole activity.
 */

interface Props {
  activity: Activity;
  categoryId: string;
  /** tailwind gradient classes from your category */
  gradient: string;
  /** the solid drop-shadow colour you already use per category */
  shadow: string;
  stars: number;
  onBack: () => void;
  onComplete: (stars: number) => void;
  ageBand?: 'young' | 'mid' | 'older';
}

type Phase = 'intro' | 'playing' | 'result';

const SkillActivity: React.FC<Props> = ({
  activity,
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
  const [made, setMade] = useState<StagePayload | null>(null);
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled());
  const [showOff, setShowOff] = useState(false);
  const awarded = useRef(false);

  const forgiveness = ageBand === 'young' ? 1.7 : ageBand === 'older' ? 0.8 : 1;
  const step = activity.steps[stepIndex];

  /** A garden-only activity has no single artefact — don't clutter the shelf. */
  const skipKeepsake = activity.steps.every((s) => s.kind === 'garden');

  useEffect(() => () => stopSpeaking(), []);

  const start = () => {
    playClick();
    buzz('soft');
    speak(activity.hook); // first real gesture — unlocks speech on iOS/Android
    setPhase('playing');
  };

  const advance = (payload?: StagePayload) => {
    const carried = payload ?? made;
    if (payload) setMade(payload);

    if (stepIndex + 1 < activity.steps.length) {
      setStepIndex((i) => i + 1);
      buzz('soft');
    } else {
      finish(carried);
    }
  };

  const finish = (final: StagePayload | null) => {
    playComplete();
    buzz('success');

    if (!skipKeepsake) {
      saveKeepsake({
        skillId: activity.id,
        categoryId,
        title: activity.title,
        kind: final?.kind || 'decorated',
        base: final?.base ?? activity.result.icon,
        color: final?.color ?? '#FFD1A6',
        stickers: final?.stickers ?? [],
        strokes: final?.strokes,
        layers: final?.layers,
      });
    }

    if (!awarded.current) {
      awarded.current = true;
      onComplete(3);
    }

    setPhase('result');
    setTimeout(() => speak(`You made ${activity.result.name}! ${activity.funFact}`), 500);
  };

  const replay = () => {
    playClick();
    stopSpeaking();
    awarded.current = true; // stars once per visit, not per replay
    setMade(null);
    setStepIndex(0);
    setPhase('playing');
    speak(activity.hook);
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
    const k = `step-${stepIndex}`;
    switch (step.kind) {
      case 'gather':
        return <GatherStage key={k} step={step} onDone={() => advance()} />;
      case 'stir':
        return <StirStage key={k} step={step} onDone={() => advance()} />;
      case 'pour':
        return <PourStage key={k} step={step} onDone={() => advance()} />;
      case 'time':
        return <TimeStage key={k} step={step} onDone={() => advance()} forgiveness={forgiveness} />;
      case 'scrub':
        return <ScrubStage key={k} step={step} onDone={() => advance()} />;
      case 'decorate':
        return <DecorateStage key={k} step={step} onDone={(d) => advance({ ...d, kind: 'decorated' })} />;
      case 'mix':
        return <MixStage key={k} step={step} onDone={(d) => advance({ color: d.color })} />;
      case 'dress':
        return <DressStage key={k} step={step} onDone={(d) => advance(d)} />;
      case 'draw':
        return <DrawStage key={k} step={step} onDone={(d) => advance(d)} />;
      case 'sort':
        return <SortStage key={k} step={step} onDone={() => advance()} />;
      case 'animals':
        return <AnimalStage key={k} step={step} onDone={() => advance()} />;
      case 'garden':
        return <GardenPlotStage key={k} step={step} onDone={() => advance()} />;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, step]);

  const keepsakeShape = {
    kind: made?.kind || 'decorated',
    base: made?.base ?? activity.result.icon,
    color: made?.color ?? '#FFD1A6',
    stickers: made?.stickers ?? [],
    strokes: made?.strokes,
    layers: made?.layers,
  } as const;

  /* ---------------------------------------------------------------- */
  if (phase === 'intro') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={POP}>
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <ItemIcon icon={activity.result.icon} size={130} label={activity.result.name} />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4" style={{ fontFamily: "'Bubblegum One', cursive" }}>
          {activity.title}
        </h2>
        <p className="text-gray-600 mt-1 max-w-xs">{activity.hook}</p>

        <div className="flex gap-2 mt-5 flex-wrap justify-center max-w-xs">
          {activity.steps.map((s, i) => (
            <div
              key={i}
              className="bg-white/90 border-4 border-white rounded-2xl px-3 py-2 text-xs font-bold text-gray-600"
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,.10)' }}
            >
              {STEP_LABEL[s.kind]}
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
          ✨ Let&apos;s start!
        </motion.button>

        <button onClick={() => { playClick(); onBack(); }} className="mt-4 text-gray-500 font-semibold text-sm underline">
          Maybe later
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  if (phase === 'result') {
    return (
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <div className="max-w-md mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={POP} className="mt-4">
            {skipKeepsake ? (
              <ItemIcon icon={activity.result.icon} size={150} label={activity.result.name} />
            ) : (
              <KeepsakeView item={keepsakeShape} size={230} />
            )}
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mt-2"
            style={{ fontFamily: "'Bubblegum One', cursive" }}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            You made {activity.result.name}! 🎉
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

          {!skipKeepsake && (
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
          )}

          <div className="mt-5 bg-yellow-100 border-4 border-yellow-300 rounded-2xl p-4 flex items-start gap-2 text-left" style={{ boxShadow: '0 4px 0 #F59E0B' }}>
            <span className="text-2xl">💡</span>
            <p className="text-yellow-800 font-bold text-sm flex-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
              {activity.funFact}
            </p>
          </div>

          <div className="mt-3 bg-white/90 border-4 border-white rounded-2xl p-3 text-left w-full">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
            <p className="text-sm text-gray-600 font-semibold">{activity.learned}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              onClick={replay}
              className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: "'Bubblegum One', cursive" }}
              whileTap={{ scale: 0.95, y: 3 }}
            >
              🔄 Again
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
                <KeepsakeView
                  item={keepsakeShape}
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
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3 mt-1">
          <div className="flex gap-1.5">
            {activity.steps.map((_, i) => (
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
            Step {stepIndex + 1} of {activity.steps.length}
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

export default SkillActivity;
