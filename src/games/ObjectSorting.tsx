import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface ObjectSortingProps {
  onBack: () => void;
}

interface SortLevel {
  title: string;
  groups: { name: string; emoji: string; items: string[] }[];
  allItems: { emoji: string; group: string }[];
}

const sortLevels: SortLevel[] = [
  {
    title: 'Farm or Ocean?',
    groups: [
      { name: 'Farm', emoji: '🌾', items: [] },
      { name: 'Ocean', emoji: '🌊', items: [] },
    ],
    allItems: [
      { emoji: '🐄', group: 'Farm' },
      { emoji: '🐠', group: 'Ocean' },
      { emoji: '🐔', group: 'Farm' },
      { emoji: '🐙', group: 'Ocean' },
      { emoji: '🐷', group: 'Farm' },
      { emoji: '🦀', group: 'Ocean' },
    ],
  },
  {
    title: 'Fruit or Vegetable?',
    groups: [
      { name: 'Fruits', emoji: '🍎', items: [] },
      { name: 'Veggies', emoji: '🥦', items: [] },
    ],
    allItems: [
      { emoji: '🍌', group: 'Fruits' },
      { emoji: '🥕', group: 'Veggies' },
      { emoji: '🍓', group: 'Fruits' },
      { emoji: '🥦', group: 'Veggies' },
      { emoji: '🍇', group: 'Fruits' },
      { emoji: '🌽', group: 'Veggies' },
    ],
  },
  {
    title: 'Air or Ground?',
    groups: [
      { name: 'Air', emoji: '✈️', items: [] },
      { name: 'Ground', emoji: '🚗', items: [] },
    ],
    allItems: [
      { emoji: '✈️', group: 'Air' },
      { emoji: '🚗', group: 'Ground' },
      { emoji: '🚁', group: 'Air' },
      { emoji: '🚌', group: 'Ground' },
      { emoji: '🎈', group: 'Air' },
      { emoji: '🚂', group: 'Ground' },
    ],
  },
  {
    title: 'Day or Night?',
    groups: [
      { name: 'Day', emoji: '☀️', items: [] },
      { name: 'Night', emoji: '🌙', items: [] },
    ],
    allItems: [
      { emoji: '☀️', group: 'Day' },
      { emoji: '🌙', group: 'Night' },
      { emoji: '🌈', group: 'Day' },
      { emoji: '⭐', group: 'Night' },
      { emoji: '🦋', group: 'Day' },
      { emoji: '🦉', group: 'Night' },
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

export default function ObjectSorting({ onBack }: ObjectSortingProps) {
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [sorted, setSorted] = useState<Map<string, string[]>>(new Map());
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongGroup, setWrongGroup] = useState<string | null>(null);
  const [shuffledItems, setShuffledItems] = useState<{ emoji: string; group: string }[]>([]);

  const startLevel = useCallback((idx: number) => {
    setLevelIndex(idx);
    setShuffledItems(shuffle(sortLevels[idx].allItems));
    setSorted(new Map());
    setSortedIndices([]);
    setSelectedItem(null);
    playClick();
  }, []);

  const handleItemSelect = (idx: number) => {
    if (sortedIndices.includes(idx)) return;
    playClick();
    setSelectedItem(idx);
  };

  const handleGroupDrop = useCallback(
    (groupName: string) => {
      if (selectedItem === null) return;
      const item = shuffledItems[selectedItem];
      if (item.group === groupName) {
        playCorrect();
        const newSorted = new Map(sorted);
        const existing = newSorted.get(groupName) || [];
        newSorted.set(groupName, [...existing, item.emoji]);
        setSorted(newSorted);
        const newIndices = [...sortedIndices, selectedItem];
        setSortedIndices(newIndices);
        setSelectedItem(null);
        setStars((s) => s + 1);
        if (newIndices.length === shuffledItems.length) {
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        playWrong();
        setWrongGroup(groupName);
        setTimeout(() => setWrongGroup(null), 600);
      }
    },
    [selectedItem, shuffledItems, sorted, sortedIndices]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Sorting Star! 🌟"
        starsEarned={3}
        onHome={onBack}
        onReplay={() => {
          setShowCelebration(false);
          if (levelIndex !== null) startLevel(levelIndex);
        }}
      />
    );
  }

  if (levelIndex === null) {
    return (
      <div className="min-h-screen p-4">
        <Header title="Object Sorting" emoji="📦" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Sort items into the right groups! Choose a challenge:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {sortLevels.map((level, i) => (
              <button
                key={i}
                onClick={() => startLevel(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="flex justify-center gap-2 text-4xl mb-3">
                  {level.groups.map((g) => (
                    <span key={g.name}>{g.emoji}</span>
                  ))}
                </div>
                <div className="text-white font-bold">{level.title}</div>
                <div className="text-white/50 text-sm mt-1">{level.allItems.length} items</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = sortLevels[levelIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Object Sorting"
        emoji="📦"
        subtitle={`${level.title} - ${sortedIndices.length}/${shuffledItems.length}`}
        onBack={() => setLevelIndex(null)}
        stars={stars}
      />
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-green to-candy-blue h-full rounded-full transition-all duration-500"
            style={{ width: `${(sortedIndices.length / shuffledItems.length) * 100}%` }}
          />
        </div>

        {/* Groups/Bins */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {level.groups.map((group) => (
            <button
              key={group.name}
              onClick={() => handleGroupDrop(group.name)}
              className={`rounded-2xl p-4 text-center transition-all duration-300 min-h-[140px] ${
                wrongGroup === group.name
                  ? 'bg-candy-red/30 animate-shake border-2 border-candy-red'
                  : selectedItem !== null
                  ? 'bg-white/20 border-2 border-dashed border-candy-yellow hover:bg-candy-yellow/20 hover:scale-105'
                  : 'bg-white/10 border-2 border-white/20'
              }`}
            >
              <div className="text-3xl mb-1">{group.emoji}</div>
              <div className="text-white font-bold text-sm mb-2">{group.name}</div>
              <div className="flex flex-wrap justify-center gap-1">
                {(sorted.get(group.name) || []).map((emoji, i) => (
                  <span key={i} className="text-2xl animate-pop-in">
                    {emoji}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Items to sort */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/80 text-center mb-3 font-bold">
            {selectedItem !== null ? '👆 Now tap the correct group above!' : '👇 Tap an item to sort:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffledItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleItemSelect(i)}
                disabled={sortedIndices.includes(i)}
                className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${
                  sortedIndices.includes(i)
                    ? 'opacity-20 scale-75'
                    : selectedItem === i
                    ? 'bg-candy-yellow/40 ring-4 ring-candy-yellow scale-110 animate-wiggle'
                    : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                }`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
