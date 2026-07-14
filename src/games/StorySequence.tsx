import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick, playPop } from '../utils/sounds';

interface StorySequenceProps {
  onBack: () => void;
}

interface Story {
  title: string;
  emoji: string;
  steps: { emoji: string; text: string }[];
}

const stories: Story[] = [
  {
    title: 'Growing a Flower',
    emoji: '🌸',
    steps: [
      { emoji: '🌱', text: 'Plant a seed' },
      { emoji: '💧', text: 'Water the seed' },
      { emoji: '🌿', text: 'A sprout grows' },
      { emoji: '🌸', text: 'A flower blooms' },
    ],
  },
  {
    title: 'Making a Sandwich',
    emoji: '🥪',
    steps: [
      { emoji: '🍞', text: 'Get bread slices' },
      { emoji: '🧈', text: 'Spread butter' },
      { emoji: '🥬', text: 'Add lettuce & tomato' },
      { emoji: '🥪', text: 'Put bread on top' },
    ],
  },
  {
    title: 'Butterfly Life Cycle',
    emoji: '🦋',
    steps: [
      { emoji: '🥚', text: 'An egg is laid' },
      { emoji: '🐛', text: 'A caterpillar hatches' },
      { emoji: '🫘', text: 'It makes a cocoon' },
      { emoji: '🦋', text: 'A butterfly emerges' },
    ],
  },
  {
    title: 'Washing Hands',
    emoji: '🧼',
    steps: [
      { emoji: '🚰', text: 'Turn on water' },
      { emoji: '🧼', text: 'Add soap' },
      { emoji: '🫧', text: 'Scrub hands' },
      { emoji: '🧻', text: 'Dry with towel' },
    ],
  },
  {
    title: 'Baking a Cake',
    emoji: '🎂',
    steps: [
      { emoji: '🥚', text: 'Mix ingredients' },
      { emoji: '🫗', text: 'Pour into pan' },
      { emoji: '🔥', text: 'Bake in oven' },
      { emoji: '🎂', text: 'Decorate the cake' },
    ],
  },
  {
    title: 'Going to School',
    emoji: '🏫',
    steps: [
      { emoji: '⏰', text: 'Wake up early' },
      { emoji: '🥣', text: 'Eat breakfast' },
      { emoji: '🎒', text: 'Pack your bag' },
      { emoji: '🚌', text: 'Take the school bus' },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StorySequence({ onBack }: StorySequenceProps) {
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [shuffledSteps, setShuffledSteps] = useState<{ emoji: string; text: string; originalIndex: number }[]>([]);
  const [placedSteps, setPlacedSteps] = useState<number[]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongStep, setWrongStep] = useState<number | null>(null);

  const startStory = useCallback((idx: number) => {
    const story = stories[idx];
    setStoryIndex(idx);
    setShuffledSteps(shuffle(story.steps.map((s, i) => ({ ...s, originalIndex: i }))));
    setPlacedSteps([]);
    playClick();
  }, []);

  const handleStepClick = useCallback(
    (originalIndex: number) => {
      if (placedSteps.includes(originalIndex)) return;
      const nextExpected = placedSteps.length;
      if (originalIndex === nextExpected) {
        playCorrect();
        playPop();
        const newPlaced = [...placedSteps, originalIndex];
        setPlacedSteps(newPlaced);
        setStars((s) => s + 1);
        if (storyIndex !== null && newPlaced.length === stories[storyIndex].steps.length) {
          setTimeout(() => setShowCelebration(true), 800);
        }
      } else {
        playWrong();
        setWrongStep(originalIndex);
        setTimeout(() => setWrongStep(null), 600);
      }
    },
    [placedSteps, storyIndex]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Story Complete! 📚"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          if (storyIndex !== null) startStory(storyIndex);
        }}
      />
    );
  }

  if (storyIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Story Sequence" emoji="📚" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Put the story in the right order! Choose a story:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {stories.map((story, i) => (
              <button
                key={i}
                onClick={() => startStory(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-5xl mb-3">{story.emoji}</div>
                <div className="text-white font-bold">{story.title}</div>
                <div className="text-white/50 text-sm mt-1">{story.steps.length} steps</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const story = stories[storyIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Story Sequence"
        emoji="📚"
        subtitle={`${story.title} - ${placedSteps.length}/${story.steps.length}`}
        onBack={() => setStoryIndex(null)}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-blue to-candy-purple h-full rounded-full transition-all duration-500"
            style={{ width: `${(placedSteps.length / story.steps.length) * 100}%` }}
          />
        </div>

        {/* Placed timeline */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/80 text-center mb-3 font-bold">📖 Story so far:</p>
          <div className="space-y-2">
            {placedSteps.map((stepIdx, i) => (
              <div key={i} className="animate-slide-up flex items-center gap-3 bg-candy-green/20 rounded-xl p-3">
                <span className="bg-candy-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <span className="text-3xl">{story.steps[stepIdx].emoji}</span>
                <span className="text-white font-bold">{story.steps[stepIdx].text}</span>
              </div>
            ))}
            {placedSteps.length < story.steps.length && (
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border-2 border-dashed border-white/30">
                <span className="bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {placedSteps.length + 1}
                </span>
                <span className="text-white/50">What comes next?</span>
              </div>
            )}
          </div>
        </div>

        {/* Available steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/80 text-center mb-3 font-bold">
            👆 Tap what happens {placedSteps.length === 0 ? 'first' : 'next'}:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {shuffledSteps
              .filter((s) => !placedSteps.includes(s.originalIndex))
              .map((step) => (
                <button
                  key={step.originalIndex}
                  onClick={() => handleStepClick(step.originalIndex)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                    wrongStep === step.originalIndex
                      ? 'bg-candy-red/30 animate-shake'
                      : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  <span className="text-4xl">{step.emoji}</span>
                  <span className="text-white text-sm font-bold text-center">{step.text}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
