import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface ShapeBuilderProps {
  onBack: () => void;
}

interface ShapeSlot {
  id: number;
  shape: string;
  placed: boolean;
  x: number;
  y: number;
  label: string;
}

interface BuildLevel {
  name: string;
  emoji: string;
  slots: ShapeSlot[];
  availableShapes: string[];
  bg: string;
}

const levels: BuildLevel[] = [
  {
    name: 'House',
    emoji: '🏠',
    bg: 'from-sky-400 to-green-300',
    slots: [
      { id: 0, shape: '🔺', placed: false, x: 50, y: 20, label: 'Roof' },
      { id: 1, shape: '🟧', placed: false, x: 50, y: 55, label: 'Wall' },
      { id: 2, shape: '🟫', placed: false, x: 50, y: 80, label: 'Door' },
    ],
    availableShapes: ['🔺', '🟧', '🟫', '⭕', '💎'],
  },
  {
    name: 'Rocket',
    emoji: '🚀',
    bg: 'from-indigo-900 to-purple-800',
    slots: [
      { id: 0, shape: '🔺', placed: false, x: 50, y: 15, label: 'Nose' },
      { id: 1, shape: '🟧', placed: false, x: 50, y: 45, label: 'Body' },
      { id: 2, shape: '🔺', placed: false, x: 35, y: 75, label: 'Left Fin' },
      { id: 3, shape: '🔺', placed: false, x: 65, y: 75, label: 'Right Fin' },
    ],
    availableShapes: ['🔺', '🟧', '⭕', '💎', '🟦'],
  },
  {
    name: 'Tree',
    emoji: '🌲',
    bg: 'from-sky-300 to-green-200',
    slots: [
      { id: 0, shape: '🔺', placed: false, x: 50, y: 15, label: 'Top' },
      { id: 1, shape: '🔺', placed: false, x: 50, y: 40, label: 'Middle' },
      { id: 2, shape: '🟫', placed: false, x: 50, y: 70, label: 'Trunk' },
    ],
    availableShapes: ['🔺', '🟫', '⭕', '🟧', '💎'],
  },
  {
    name: 'Fish',
    emoji: '🐟',
    bg: 'from-blue-400 to-cyan-300',
    slots: [
      { id: 0, shape: '⭕', placed: false, x: 45, y: 45, label: 'Body' },
      { id: 1, shape: '🔺', placed: false, x: 75, y: 45, label: 'Tail' },
      { id: 2, shape: '⚫', placed: false, x: 35, y: 40, label: 'Eye' },
    ],
    availableShapes: ['⭕', '🔺', '⚫', '🟧', '💎'],
  },
];

export default function ShapeBuilder({ onBack }: ShapeBuilderProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [placedSlots, setPlacedSlots] = useState<number[]>([]);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);

  const level = levels[currentLevel];

  const handleShapeSelect = (shape: string) => {
    playClick();
    setSelectedShape(shape);
  };

  const handleSlotClick = useCallback(
    (slotId: number) => {
      if (!selectedShape || placedSlots.includes(slotId)) return;
      const slot = level.slots.find((s) => s.id === slotId);
      if (!slot) return;

      if (selectedShape === slot.shape) {
        playCorrect();
        const newPlaced = [...placedSlots, slotId];
        setPlacedSlots(newPlaced);
        setSelectedShape(null);
        setStars((s) => s + 1);
        if (newPlaced.length === level.slots.length) {
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        playWrong();
        setWrongSlot(slotId);
        setTimeout(() => setWrongSlot(null), 600);
      }
    },
    [selectedShape, placedSlots, level]
  );

  const nextLevel = () => {
    setShowCelebration(false);
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((l) => l + 1);
      setPlacedSlots([]);
      setSelectedShape(null);
    }
  };

  if (showCelebration) {
    return (
      <CelebrationScreen
        message={`${level.emoji} Built! 🏗️`}
        starsEarned={3}
        onHome={onBack}
        onNext={currentLevel < levels.length - 1 ? nextLevel : undefined}
        onReplay={() => {
          setShowCelebration(false);
          setPlacedSlots([]);
          setSelectedShape(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Shape Builder"
        emoji="🧱"
        subtitle={`Build a ${level.name} - ${placedSlots.length}/${level.slots.length}`}
        onBack={onBack}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-orange to-candy-yellow h-full rounded-full transition-all duration-500"
            style={{ width: `${(placedSlots.length / level.slots.length) * 100}%` }}
          />
        </div>

        {/* Build area */}
        <div className={`bg-gradient-to-b ${level.bg} rounded-3xl p-6 mb-4 relative`} style={{ minHeight: '280px' }}>
          <div className="text-center mb-2">
            <span className="text-white font-bold text-lg bg-black/20 px-4 py-1 rounded-full">
              Build: {level.emoji} {level.name}
            </span>
          </div>
          <div className="relative" style={{ height: '220px' }}>
            {level.slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 rounded-xl p-2 ${
                  placedSlots.includes(slot.id)
                    ? 'scale-110'
                    : wrongSlot === slot.id
                    ? 'bg-candy-red/30 animate-shake border-2 border-dashed border-candy-red'
                    : 'bg-white/20 border-2 border-dashed border-white/60 hover:bg-white/30 hover:scale-110'
                }`}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  minWidth: '60px',
                  minHeight: '50px',
                }}
              >
                {placedSlots.includes(slot.id) ? (
                  <span className="text-3xl animate-pop-in">{slot.shape}</span>
                ) : (
                  <span className="text-xs text-white/80 font-bold">{slot.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Shape palette */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/80 text-center mb-3 font-bold">
            {selectedShape ? `Selected: ${selectedShape} → Tap a slot!` : '👆 Pick a shape:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {level.availableShapes.map((shape, i) => (
              <button
                key={i}
                onClick={() => handleShapeSelect(shape)}
                className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${
                  selectedShape === shape
                    ? 'bg-candy-yellow/40 ring-4 ring-candy-yellow scale-110 animate-wiggle'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
