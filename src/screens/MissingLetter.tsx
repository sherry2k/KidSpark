import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { useContent } from '../context/ContentContext';
import { GameProgress, PlayerProfile } from '../store/gameStore';
import { wordsForLevel } from '../utils/difficulty';
import { buzz, POP } from '../utils/kidJuice';
import { playClick, playCorrect, playWrong, playComplete } from '../utils/sounds';
import SparkResult from '../components/SparkResult';

/**
 * MissingLetter — the second game inside Words.
 *
 * A picture and its word with ONE letter missing (a cat and "C _ T"), plus three
 * letters to choose from. The child taps the letter that finishes the word.
 *
 *  - It uses the SAME word list and the SAME age level as Build the Word
 *    (wordBuilderWords from ContentContext, filtered by wordsForLevel), so a new
 *    word added there shows up here too.
 *  - The wrong letters are never a trick. They are the same kind as the right one
 *    (a vowel for a missing vowel, a consonant for a missing consonant), and a
 *    letter that would spell ANOTHER word from the list is never offered
 *    ("C _ T" never offers U if CUT were a word in the list), so there is exactly
 *    one right answer.
 *  - A wrong tap crosses that letter out and the child tries again. Stars count
 *    the words got right on the first try.
 */

interface MissingLetterProps {
  profile?: PlayerProfile;
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const TOTAL = 8;
const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";
const BUBBLE = "'Bubblegum One', cursive";
const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPRSTVWZ'.split(''); // no Q, X, Y: too confusing for this age

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface Question {
  word: string; // upper case
  emoji: string;
  hint: string;
  gap: number; // which letter is missing
  answer: string;
  options: string[]; // three letters
}

interface Entry {
  word: string;
  emoji: string;
  hint: string;
}

const buildQuestions = (pool: Entry[], all: Entry[]): Question[] => {
  const known = new Set(all.map((w) => w.word.toUpperCase()));
  return shuffle(pool)
    .slice(0, TOTAL)
    .map((w) => {
      const word = w.word.toUpperCase();
      const gap = Math.floor(Math.random() * word.length);
      const answer = word[gap];
      const sameKind = VOWELS.includes(answer) ? VOWELS.split('') : CONSONANTS;
      const spellsAnother = (l: string) => {
        const t = word.slice(0, gap) + l + word.slice(gap + 1);
        return t !== word && known.has(t);
      };
      let wrong = shuffle(sameKind).filter((l) => l !== answer && !spellsAnother(l)).slice(0, 2);
      if (wrong.length < 2) {
        // very rare: top up from any other letters
        const extra = shuffle([...VOWELS.split(''), ...CONSONANTS]).filter((l) => l !== answer && !wrong.includes(l) && !spellsAnother(l));
        wrong = [...wrong, ...extra].slice(0, 2);
      }
      return { word, emoji: w.emoji, hint: w.hint, gap, answer, options: shuffle([answer, ...wrong]) };
    });
};

const MissingLetter: React.FC<MissingLetterProps> = ({ profile, progress, onBack, onComplete }) => {
  const { wordBuilderWords: allWords } = useContent();
  const pool = wordsForLevel(allWords, profile?.difficulty);

  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(pool, allWords));
  const [qIndex, setQIndex] = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const scoreRef = useRef(0);
  const triedWrong = useRef(false); // this word already had a wrong tap
  const awarded = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const q = questions[qIndex];

  const restart = () => {
    clearTimers();
    playClick();
    setQuestions(buildQuestions(pool, allWords));
    setQIndex(0);
    setWrongLetters([]);
    setSolved(false);
    setScore(0);
    scoreRef.current = 0;
    triedWrong.current = false;
    setShowHint(false);
    setMessage(null);
    setDone(false);
    awarded.current = false;
  };

  const starsFor = (s: number) => (s >= TOTAL * 0.8 ? 3 : s >= TOTAL * 0.5 ? 2 : 1);

  const pick = (letter: string) => {
    if (!q || solved || wrongLetters.includes(letter)) return;

    if (letter === q.answer) {
      playCorrect();
      buzz('soft');
      setSolved(true);
      setMessage(`Yes! ${q.word} 🎉`);
      if (!triedWrong.current) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
      timers.current.push(
        window.setTimeout(() => {
          setMessage(null);
          if (qIndex + 1 >= questions.length) {
            setDone(true);
            playComplete();
            buzz('success');
            if (!awarded.current) {
              awarded.current = true;
              onComplete(starsFor(scoreRef.current));
            }
          } else {
            setQIndex((i) => i + 1);
            setWrongLetters([]);
            setSolved(false);
            setShowHint(false);
            triedWrong.current = false;
          }
        }, 1300)
      );
    } else {
      playWrong();
      buzz('oops');
      triedWrong.current = true;
      setWrongLetters((w) => [...w, letter]);
      setMessage('Not that one. Try again! 💪');
      timers.current.push(window.setTimeout(() => setMessage(null), 1300));
    }
  };

  /* ---------------- result ---------------- */
  if (done) {
    const stars = starsFor(score);
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🔍 Missing Letter" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <SparkResult stars={stars} />
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: FONT }}>
                {stars === 3 ? 'Letter detective!' : 'Good work!'} 🎉
              </p>

              <div
                className="mt-3 inline-flex items-baseline gap-1 bg-white border-4 border-white rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT, fontWeight: 700 }}
              >
                <span style={{ fontSize: 44, color: '#2C7BE5' }}>{score}</span>
                <span className="text-gray-400" style={{ fontSize: 22 }}>/{TOTAL}</span>
              </div>

              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-4xl"
                    style={{ opacity: i < stars ? 1 : 0.2 }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.14, type: 'spring' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
                <p className="text-sm text-gray-600 font-semibold">
                  Finding the missing letter practises spelling and word shape. Ask your child to say the word slowly, listen
                  for each sound, and find the sound that is missing. Stars count the words got right on the first try.
                </p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  onClick={restart}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  onClick={() => { playClick(); onBack(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#2C7BE5,#6366F1)', boxShadow: '0 5px 0 #1E40AF', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  📝 Words
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (!q) return null;

  /* tiles shrink for long words so they stay on one or two lines */
  const letters = q.word.split('');
  const tileW = letters.length <= 4 ? 66 : letters.length <= 6 ? 54 : 40;
  const tileH = Math.round(tileW * 1.15);
  const tileFont = letters.length <= 4 ? 40 : letters.length <= 6 ? 34 : 26;

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title="🔍 Missing Letter"
          onBack={() => { playClick(); onBack(); }}
          stars={progress.stars}
          showProgress
          progress={(qIndex / questions.length) * 100}
        />

        <div className="flex-1 flex flex-col items-center px-3 pb-3 min-h-0 overflow-y-auto">
          {/* progress dots + score */}
          <div className="flex items-center justify-between w-full max-w-sm mt-1 mb-2">
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{ width: 9, height: 9, background: i < qIndex ? '#22C55E' : i === qIndex ? '#F97316' : 'rgba(0,0,0,.14)' }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: FONT }}>⭐ {score}</span>
          </div>

          {/* prompt */}
          <motion.div
            key={`p-${qIndex}`}
            className="w-full max-w-sm rounded-2xl px-4 py-3 mb-3 text-white border-4 border-white text-center bg-gradient-to-r from-sky-400 to-blue-500"
            style={{ boxShadow: '0 5px 0 #1E40AF', fontFamily: FONT }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={POP}
          >
            <span className="text-lg font-bold" style={{ textShadow: '1px 2px 0 rgba(0,0,0,.18)' }}>
              Which letter is missing?
            </span>
          </motion.div>

          {/* picture */}
          <motion.div
            key={`pic-${qIndex}`}
            className="bg-white/95 rounded-3xl border-4 border-white flex items-center justify-center"
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,.10)', width: 168, height: 150, fontSize: 88, lineHeight: 1 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={POP}
          >
            {q.emoji}
          </motion.div>

          {/* the word with a gap */}
          <div className="flex justify-center gap-2 flex-wrap mt-4">
            {letters.map((l, i) => {
              const isGap = i === q.gap;
              const filled = !isGap || solved;
              return (
                <motion.div
                  key={`${qIndex}-${i}`}
                  className="rounded-2xl flex items-center justify-center border-4"
                  style={{
                    width: tileW,
                    height: tileH,
                    fontFamily: BUBBLE,
                    fontSize: tileFont,
                    lineHeight: 1,
                    ...(isGap
                      ? solved
                        ? { background: '#DCFCE7', borderColor: '#22C55E', color: '#15803D', boxShadow: '0 5px 0 #15803D' }
                        : { background: '#FFFBEB', borderColor: '#F59E0B', borderStyle: 'dashed', color: '#F59E0B' }
                      : { background: '#fff', borderColor: '#CBD5E1', color: '#334155', boxShadow: '0 5px 0 #CBD5E1' }),
                  }}
                  animate={isGap && solved ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  {filled ? l : '?'}
                </motion.div>
              );
            })}
          </div>

          {/* hint */}
          <motion.button
            onClick={() => { playClick(); setShowHint((h) => !h); }}
            className="mt-3 rounded-full px-5 py-2 text-white font-bold border-4 border-white text-sm"
            style={{ background: 'linear-gradient(135deg,#FBBF24,#FB923C)', boxShadow: '0 4px 0 #B45309', fontFamily: FONT }}
            whileTap={{ scale: 0.95, y: 3 }}
          >
            💡 {showHint ? q.hint : 'Need a hint?'}
          </motion.button>

          <p className="font-bold" style={{ fontFamily: FONT, fontSize: 15, color: '#0369A1', margin: '12px 0 8px' }}>
            👆 Tap the missing letter
          </p>

          {/* three letters */}
          <div className="grid grid-cols-3 w-full max-w-sm" style={{ gap: 12 }}>
            {q.options.map((opt, i) => {
              const isRight = solved && opt === q.answer;
              const isWrong = wrongLetters.includes(opt);
              return (
                <motion.button
                  key={`${qIndex}-${opt}`}
                  onClick={() => pick(opt)}
                  disabled={solved || isWrong}
                  aria-label={opt}
                  className="rounded-2xl border-4 border-white flex items-center justify-center"
                  style={{
                    background: isRight ? '#22C55E' : isWrong ? '#DC2626' : ['#2C7BE5', '#57CC5B', '#F0522B'][i % 3],
                    boxShadow: `0 6px 0 ${isRight ? '#047857' : isWrong ? '#991B1B' : ['#1E40AF', '#047857', '#C2410C'][i % 3]}`,
                    minHeight: 82,
                    color: '#fff',
                    fontFamily: BUBBLE,
                    fontSize: 42,
                    lineHeight: 1,
                    opacity: solved && !isRight ? 0.45 : isWrong ? 0.6 : 1,
                  }}
                  initial={{ scale: 0, y: 16 }}
                  animate={{ scale: 1, y: 0, x: isWrong ? [-5, 5, -5, 0] : 0 }}
                  transition={{ delay: isWrong ? 0 : 0.1 + i * 0.06, ...POP }}
                  whileTap={!solved && !isWrong ? { scale: 0.95, y: 3 } : {}}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          <div className="h-12 flex items-center mt-2">
            {message && (
              <motion.p
                className="bg-yellow-100 border-4 border-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-2xl text-sm text-center max-w-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={POP}
                style={{ fontFamily: FONT }}
              >
                {message}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MissingLetter;
