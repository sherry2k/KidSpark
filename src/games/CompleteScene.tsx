import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface CompleteSceneProps {
  onBack: () => void;
}

interface SceneSlot {
  id: number;
  correct: string;
  x: number;
  y: number;
  placed: boolean;
  label: string;
}

interface SceneLevel {
  name: string;
  emoji: string;
  bg: string;
  bgEmojis: { emoji: string; x: number; y: number }[];
  slots: SceneSlot[];
  distractors: string[];
}

const scenes: SceneLevel[] = [
  {
    name: 'Farm',
    emoji: '🌾',
    bg: 'from-sky-400 to-green-400',
    bgEmojis: [
      { emoji: '☀️', x: 85, y: 8 },
      { emoji: '☁️', x: 20, y: 10 },
      { emoji: '☁️', x: 60, y: 5 },
      { emoji: '🌿', x: 10, y: 85 },
      { emoji: '🌿', x: 90, y: 90 },
    ],
    slots: [
      { id: 0, correct: '🐄', x: 20, y: 60, placed: false, label: 'Cow' },
      { id: 1, correct: '🏠', x: 70, y: 35, placed: false, label: 'Barn' },
      { id: 2, correct: '🚜', x: 50, y: 70, placed: false, label: 'Tractor' },
      { id: 3, correct: '🌳', x: 85, y: 55, placed: false, label: 'Tree' },
    ],
    distractors: ['🐙', '🚀'],
  },
  {
    name: 'Ocean',
    emoji: '🌊',
    bg: 'from-blue-400 to-blue-700',
    bgEmojis: [
      { emoji: '☀️', x: 80, y: 8 },
      { emoji: '🌊', x: 10, y: 50 },
      { emoji: '🌊', x: 90, y: 60 },
    ],
    slots: [
      { id: 0, correct: '🐠', x: 25, y: 55, placed: false, label: 'Fish' },
      { id: 1, correct: '🐙', x: 60, y: 70, placed: false, label: 'Octopus' },
      { id: 2, correct: '🚢', x: 50, y: 25, placed: false, label: 'Ship' },
      { id: 3, correct: '🐚', x: 80, y: 85, placed: false, label: 'Shell' },
    ],
    distractors: ['🐄', '🌳'],
  },
  {
    name: 'Space',
    emoji: '🚀',
    bg: 'from-gray-900 to-indigo-900',
    bgEmojis: [
      { emoji: '✨', x: 10, y: 10 },
      { emoji: '✨', x: 30, y: 20 },
      { emoji: '✨', x: 70, y: 15 },
      { emoji: '✨', x: 90, y: 30 },
      { emoji: '✨', x: 50, y: 5 },
    ],
    slots: [
      { id: 0, correct: '🚀', x: 25, y: 40, placed: false, label: 'Rocket' },
      { id: 1, correct: '🌙', x: 75, y: 20, placed: false, label: 'Moon' },
      { id: 2, correct: '⭐', x: 50, y: 55, placed: false, label: 'Star' },
      { id: 3, correct: '🪐', x: 80, y: 65, placed: false, label: 'Planet' },
    ],
    distractors: ['🐟', '🌸'],
  },
  {
    name: 'Playground',
    emoji: '🎪',
    bg: 'from-sky-300 to-green-300',
    bgEmojis: [
      { emoji: '☀️', x: 85, y: 8 },
      { emoji: '☁️', x: 25, y: 8 },
    ],
    slots: [
      { id: 0, correct: '🎡', x: 20, y: 40, placed: false, label: 'Ferris Wheel' },
      { id: 1, correct: '🎢', x: 60, y: 35, placed: false, label: 'Roller Coaster' },
      { id: 2, correct: '🎪', x: 40, y: 65, placed: false, label: 'Tent' },
      { id: 3, correct: '🎈', x: 80, y: 50, placed: false, label: 'Balloon' },
    ],
    distractors: ['🦀', '🌙'],
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

export default function CompleteScene({ onBack }: CompleteSceneProps) {
  const [sceneIndex, setSceneIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [placedSlots, setPlacedSlots] = useState<number[]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [shuffledPalette, setShuffledPalette] = useState<string[]>([]);

  const startScene = useCallback((idx: number) => {
    const scene = scenes[idx];
    setSceneIndex(idx);
    setPlacedSlots([]);
    setSelectedItem(null);
    setShuffledPalette(shuffle([...scene.slots.map((s) => s.correct), ...scene.distractors]));
    playClick();
  }, []);

  const handleItemSelect = (item: string) => {
    playClick();
    setSelectedItem(item);
  };

  const handleSlotClick = useCallback(
    (slotId: number) => {
      if (!selectedItem || placedSlots.includes(slotId) || sceneIndex === null) return;
      const scene = scenes[sceneIndex];
      const slot = scene.slots.find((s) => s.id === slotId);
      if (!slot) return;

      if (selectedItem === slot.correct) {
        playCorrect();
        const newPlaced = [...placedSlots, slotId];
        setPlacedSlots(newPlaced);
        setSelectedItem(null);
        setStars((s) => s + 1);
        if (newPlaced.length === scene.slots.length) {
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        playWrong();
        setWrongSlot(slotId);
        setTimeout(() => setWrongSlot(null), 600);
      }
    },
    [selectedItem, placedSlots, sceneIndex]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Scene Complete! 🎨"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          if (sceneIndex !== null) startScene(sceneIndex);
        }}
      />
    );
  }

  if (sceneIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Complete the Scene" emoji="🎨" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Add the missing items to complete the picture!
          </p>
          <div className="grid grid-cols-2 gap-4">
            {scenes.map((scene, i) => (
              <button
                key={i}
                onClick={() => startScene(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-5xl mb-3">{scene.emoji}</div>
                <div className="text-white font-bold">{scene.name}</div>
                <div className="text-white/50 text-sm mt-1">{scene.slots.length} items</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const scene = scenes[sceneIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Complete the Scene"
        emoji="🎨"
        subtitle={`${scene.name} - ${placedSlots.length}/${scene.slots.length}`}
        onBack={() => setSceneIndex(null)}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-green to-candy-yellow h-full rounded-full transition-all duration-500"
            style={{ width: `${(placedSlots.length / scene.slots.length) * 100}%` }}
          />
        </div>

        {/* Scene area */}
        <div
          className={`bg-gradient-to-b ${scene.bg} rounded-3xl relative overflow-hidden mb-4`}
          style={{ height: '300px' }}
        >
          {/* Background emojis */}
          {scene.bgEmojis.map((be, i) => (
            <span
              key={i}
              className="absolute text-2xl"
              style={{ left: `${be.x}%`, top: `${be.y}%` }}
            >
              {be.emoji}
            </span>
          ))}

          {/* Slots */}
          {scene.slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                placedSlots.includes(slot.id)
                  ? ''
                  : wrongSlot === slot.id
                  ? 'animate-shake'
                  : selectedItem
                  ? 'hover:scale-110'
                  : ''
              }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {placedSlots.includes(slot.id) ? (
                <span className="text-4xl animate-pop-in">{slot.correct}</span>
              ) : (
                <div
                  className={`w-14 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center text-xs font-bold transition-all ${
                    wrongSlot === slot.id
                      ? 'border-candy-red bg-candy-red/20 text-candy-red'
                      : 'border-white/60 bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  {slot.label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Item palette */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/80 text-center mb-3 font-bold">
            {selectedItem ? `Selected: ${selectedItem} → Tap a slot!` : '👆 Pick an item:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffledPalette.map((item, i) => {
              const isPlaced = scene.slots.some(
                (s) => s.correct === item && placedSlots.includes(s.id)
              );
              return (
                <button
                  key={i}
                  onClick={() => !isPlaced && handleItemSelect(item)}
                  disabled={isPlaced}
                  className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${
                    isPlaced
                      ? 'opacity-20 scale-75'
                      : selectedItem === item
                      ? 'bg-candy-yellow/40 ring-4 ring-candy-yellow scale-110 animate-wiggle'
                      : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
