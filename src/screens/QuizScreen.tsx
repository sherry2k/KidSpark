import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import AnswerArt from '../components/AnswerArt';
import { useContent } from '../context/ContentContext';
import { GameProgress } from '../store/gameStore';
import { faceFor, categoryOf } from '../data/answerIcons';
import { buzz, speak, stopSpeaking, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';

/**
 * QuizScreen — rebuilt for four- to eight-year-olds.
 *
 * THE MAIN PROBLEM
 *
 * Every answer was a WORD. "Which fruit is this?" offered Cherry / Raspberry /
 * Strawberry / Apple as text with A/B/C/D badges. A four-year-old cannot read
 * "Raspberry", so for the younger half of your audience this wasn't a quiz —
 * it was a reading test they couldn't pass, and they'd tap at random.
 *
 * Every option now shows a PICTURE with the word underneath, and a small
 * speaker button that reads the word aloud without answering. A pre-reader
 * answers from the picture; a child learning to read sees the word attached to
 * the thing every time, and can hear it. That's how early reading is taught.
 *
 * THREE BUGS
 *
 * 1. THE SCORE WAS ALWAYS PERFECT. A wrong answer kept the child on the same
 *    question and greyed out that option, so with four options they always
 *    reached the right one — `score` hit 10/10 every single time and the star
 *    rating was decorative. Score is now first-try accuracy. Retrying is still
 *    encouraged; it just doesn't pretend the child knew it.
 *
 * 2. `onAnswer(correct)` FIRED ON EVERY ATTEMPT, so one question could log
 *    three wrong answers into the profile stats. The accuracy percentage on
 *    your home screen was being corrupted by the retry loop. It now reports
 *    once per question.
 *
 * 3. RETRY REPLAYED THE SAME TEN QUESTIONS IN THE SAME ORDER — the shuffle
 *    lived in a `useState` initialiser, and Retry only reset the index.
 */

interface QuizScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (starsEarned: number) => void;
}

interface QuizQ {
  question: string;
  emoji: string;
  options: string[];
  correct: number;
  category?: string;
}

const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";
const TOTAL = 8; // ten was long enough that children finished on autopilot

const shuffle = <T,>(a: T[]): T[] => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const QuizScreen: React.FC<QuizScreenProps> = ({ progress, onBack, onAnswer, onComplete }) => {
  const { quizQuestions } = useContent();

  const [round, setRound] = useState(0); // bump to reshuffle
  const questions = useMemo(
    () => shuffle(quizQuestions as unknown as QuizQ[]).slice(0, TOTAL),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quizQuestions, round]
  );

  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [learned, setLearned] = useState<string[]>([]);

  const reported = useRef(false); // onAnswer fires once per question
  const awarded = useRef(false);
  const timers = useRef<number[]>([]);

  const q = questions[qIndex];
  const cat = categoryOf(q?.category);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => {
    return () => {
      clearTimers();
      stopSpeaking();
    };
  }, []);

  /* read the question aloud whenever a new one appears */
  useEffect(() => {
    if (!q || finished) return;
    reported.current = false;
    const t = window.setTimeout(() => speak(q.question), 220);
    return () => window.clearTimeout(t);
  }, [qIndex, q, finished]);

  const nextQuestion = useCallback(() => {
    setPicked(null);
    setWrong([]);
    setRevealed(false);
    setBanner(null);

    if (qIndex + 1 >= questions.length) {
      setFinished(true);
      playComplete();
      buzz('success');
      if (!awarded.current) {
        awarded.current = true;
        onComplete(score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1);
      }
    } else {
      setQIndex((i) => i + 1);
    }
  }, [qIndex, questions.length, score, onComplete]);

  const choose = (i: number) => {
    if (!q || picked !== null || wrong.includes(i)) return;

    const correct = i === q.correct;
    const firstTry = wrong.length === 0;
    setPicked(i);

    /* report to the profile ONCE — the old code called this on every retry */
    if (!reported.current) {
      reported.current = true;
      onAnswer(correct);
    }

    if (correct) {
      playCorrect();
      buzz('soft');

      if (firstTry) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        setLearned((l) => [...l, q.options[q.correct]]);
      } else {
        setStreak(0);
      }

      const praise = firstTry ? 'Yes! Well done.' : "That's the one!";
      setBanner(praise);
      speak(`${q.options[q.correct]}. ${praise}`);
      timers.current.push(window.setTimeout(nextQuestion, 1150));
    } else {
      playWrong();
      buzz('oops');
      setStreak(0);
      const tried = [...wrong, i];
      setWrong(tried);

      /* after two misses, show them — a four-year-old should never be stuck */
      if (tried.length >= 2) {
        setRevealed(true);
        setBanner(`It's ${q.options[q.correct]}!`);
        speak(`This one is ${q.options[q.correct]}. Tap it!`);
      } else {
        setBanner('Not that one — try again!');
        speak(`${q.options[i]}. Not that one. Try again!`);
      }

      timers.current.push(window.setTimeout(() => setPicked(null), 1200));
    }
  };

  /** Hear an option without answering. */
  const sayOption = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    playClick();
    speak(text);
  };

  const restart = () => {
    playClick();
    clearTimers();
    stopSpeaking();
    setRound((r) => r + 1);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    setWrong([]);
    setRevealed(false);
    setBanner(null);
    setLearned([]);
    setFinished(false);
    awarded.current = false;
    reported.current = false;
  };

  /* ---------------- result ---------------- */
  if (finished) {
    const stars = score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1;
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="❓ Quiz" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">{stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💪'}</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: FONT }}>
                {stars === 3 ? 'Superstar!' : stars === 2 ? 'Great work!' : 'Good try!'}
              </p>

              <div
                className="mt-3 inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)' }}
              >
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#7B2CBF', fontVariantNumeric: 'tabular-nums' }}>
                  {score}
                </span>
                <span className="text-gray-400" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22 }}>
                  /{questions.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-semibold mt-1">right on the first try</p>

              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-4xl"
                    style={{ opacity: i < stars ? 1 : 0.2 }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.12 + i * 0.13, type: 'spring' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              {learned.length > 0 && (
                <div className="mt-5 bg-white/90 border-4 border-white rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-600 mb-2" style={{ fontFamily: FONT }}>
                    🎓 Words you knew straight away
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {learned.map((w, i) => {
                      const face = faceFor(w);
                      return (
                        <span
                          key={`${w}-${i}`}
                          className="flex items-center gap-1 bg-green-50 border-2 border-green-200 rounded-xl px-2 py-1"
                        >
                          {face && <AnswerArt face={face} size={20} />}
                          <span className="text-xs font-bold text-green-700" style={{ fontFamily: FONT }}>
                            {w}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
                <p className="text-sm text-gray-600 font-semibold">
                  Matching pictures to words · vocabulary · listening
                </p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={restart}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 New questions
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); onBack(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', boxShadow: '0 5px 0 #6B21A8', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🏠 Home
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (!q) return null;

  /* ---------------- playing ---------------- */
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title="❓ Quiz"
          onBack={() => { playClick(); stopSpeaking(); onBack(); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / questions.length) * 100}
        />

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="max-w-md mx-auto">
            {/* progress pips + streak + category as a WORD */}
            <div className="flex items-center justify-between gap-2 my-2">
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className="rounded-full"
                    style={{
                      width: 9,
                      height: 9,
                      background: i < qIndex ? '#22C55E' : i === qIndex ? '#F97316' : 'rgba(0,0,0,.14)',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {streak >= 2 && (
                  <motion.span className="text-xs font-bold text-orange-500" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontFamily: FONT }}>
                    🔥 {streak}
                  </motion.span>
                )}
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1" style={{ fontFamily: FONT }}>
                  <ItemIcon icon={cat.icon} size={16} /> {cat.label}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={qIndex}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.24 }}
              >
                {/* the picture + the question, tappable to hear again */}
                <motion.button
                  onClick={() => { playClick(); speak(q.question); }}
                  className="w-full bg-white/95 rounded-3xl border-4 border-white p-4 flex flex-col items-center"
                  style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="ks-bob-tilt">
                    <ItemIcon icon={q.emoji} size={92} label={q.question} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <h3
                      className="text-lg md:text-xl font-bold text-gray-800 text-center"
                      style={{ fontFamily: FONT }}
                    >
                      {q.question}
                    </h3>
                    <span className="text-base opacity-70">🔊</span>
                  </div>
                </motion.button>

                {/* feedback banner */}
                <div className="h-10 flex items-center justify-center">
                  <AnimatePresence>
                    {banner && (
                      <motion.p
                        key={banner}
                        className={`px-4 py-1.5 rounded-2xl font-bold text-sm border-4 ${
                          picked !== null && picked === q.correct
                            ? 'bg-green-100 border-green-300 text-green-700'
                            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
                        }`}
                        style={{ fontFamily: FONT }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={POP}
                      >
                        {banner}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* answers: picture + word, two columns, neutral until answered */}
                <div className="grid grid-cols-2 gap-2.5">
                  {q.options.map((option, i) => {
                    const face = faceFor(option);
                    const isPicked = picked === i;
                    const isRight = i === q.correct;
                    const wasWrong = wrong.includes(i);
                    const showRight = (isPicked && isRight) || (revealed && isRight);

                    let bg = '#FFFFFF';
                    let border = '#FFFFFF';
                    let shadow = 'rgba(0,0,0,.15)';
                    if (showRight) {
                      bg = '#DCFCE7';
                      border = '#4ADE80';
                      shadow = '#047857';
                    } else if (isPicked && !isRight) {
                      bg = '#FEE2E2';
                      border = '#F87171';
                      shadow = '#B91C1C';
                    } else if (wasWrong) {
                      bg = '#F1F3F8';
                      border = '#E2E6EF';
                      shadow = 'rgba(0,0,0,.08)';
                    }

                    return (
                      <motion.button
                        key={`${option}-${i}`}
                        onClick={() => choose(i)}
                        disabled={picked !== null || wasWrong}
                        className="relative rounded-2xl border-4 flex flex-col items-center justify-center gap-1 py-3 px-2"
                        style={{
                          background: bg,
                          borderColor: border,
                          boxShadow: `0 6px 0 ${shadow}`,
                          minHeight: 116,
                          opacity: wasWrong ? 0.45 : 1,
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{
                          scale: showRight && revealed ? [1, 1.06, 1] : 1,
                          opacity: wasWrong ? 0.45 : 1,
                          x: isPicked && !isRight ? [-5, 5, -5, 0] : 0,
                        }}
                        transition={
                          showRight && revealed
                            ? { duration: 1, repeat: Infinity }
                            : { duration: 0.24, delay: Math.min(i, 3) * 0.04 }
                        }
                        whileTap={picked === null && !wasWrong ? { scale: 0.95, y: 3 } : {}}
                      >
                        {/* hear the word without answering */}
                        {!wasWrong && picked === null && (
                          <span
                            role="button"
                            aria-label={`Hear ${option}`}
                            onClick={(e) => sayOption(e, option)}
                            className="absolute top-1 right-1.5 text-sm opacity-45"
                          >
                            🔊
                          </span>
                        )}

                        {face ? <AnswerArt face={face} size={44} /> : <span className="text-3xl">❔</span>}

                        <span
                          className="text-sm md:text-base font-bold text-gray-700 text-center leading-tight"
                          style={{ fontFamily: FONT }}
                        >
                          {option}
                        </span>

                        {showRight && <span className="absolute top-1 left-1.5 text-lg">✅</span>}
                        {isPicked && !isRight && <span className="absolute top-1 left-1.5 text-lg">❌</span>}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-gray-500 font-semibold mt-3">
                  {revealed ? '👆 Tap the green one!' : '👆 Tap your answer · 🔊 to hear a word'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default QuizScreen;
