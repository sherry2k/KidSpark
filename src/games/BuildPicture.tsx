import { useState, useCallback } from 'react';
import Header from '../components/Header';
import CelebrationScreen from '../components/CelebrationScreen';
import { playCorrect, playWrong, playClick } from '../utils/sounds';

interface BuildPictureProps {
  onBack: () => void;
}

interface PuzzlePiece {
  id: number;
  content: string[];
  placed: boolean;
}

interface PictureLevel {
  name: string;
  emoji: string;
  pieces: PuzzlePiece[];
}

const pictureLevels: PictureLevel[] = [
  {
    name: 'Dinosaur',
    emoji: '🦕',
    pieces: [
      { id: 0, content: ['🌿', '☁️', '☀️'], placed: false },
      { id: 1, content: ['🌿', '🦕', '🌿'], placed: false },
      { id: 2, content: ['🌳', '🪨', '🌳'], placed: false },
      { id: 3, content: ['🌺', '🌿', '🌺'], placed: false },
    ],
  },
  {
    name: 'Fire Truck',
    emoji: '🚒',
    pieces: [
      { id: 0, content: ['🏢', '🏢', '☁️'], placed: false },
      { id: 1, content: ['🔥', '🏠', '💨'], placed: false },
      { id: 2, content: ['🚒', '🚒', '🚒'], placed: false },
      { id: 3, content: ['🛣️', '🛣️', '🛣️'], placed: false },
    ],
  },
  {
    name: 'Princess Castle',
    emoji: '🏰',
    pieces: [
      { id: 0, content: ['🚩', '🏰', '🚩'], placed: false },
      { id: 1, content: ['🧱', '🚪', '🧱'], placed: false },
      { id: 2, content: ['🌹', '🛤️', '🌹'], placed: false },
      { id: 3, content: ['🌳', '⛲', '🌳'], placed: false },
    ],
  },
  {
    name: 'Zoo',
    emoji: '🦁',
    pieces: [
      { id: 0, content: ['🌤️', '🎪', '🌤️'], placed: false },
      { id: 1, content: ['🦁', '🐘', '🦒'], placed: false },
      { id: 2, content: ['🌿', '🛤️', '🌿'], placed: false },
      { id: 3, content: ['🎈', '👨‍👩‍👧', '🍦'], placed: false },
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

export default function BuildPicture({ onBack }: BuildPictureProps) {
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [placedPieces, setPlacedPieces] = useState<(number | null)[]>([null, null, null, null]);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([]);

  const startLevel = useCallback((idx: number) => {
    setLevelIndex(idx);
    setShuffledPieces(shuffle(pictureLevels[idx].pieces));
    setPlacedPieces([null, null, null, null]);
    setSelectedPiece(null);
    playClick();
  }, []);

  const handlePieceSelect = (pieceId: number) => {
    if (placedPieces.includes(pieceId)) return;
    playClick();
    setSelectedPiece(pieceId);
  };

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (selectedPiece === null || placedPieces[slotIndex] !== null) return;
      if (selectedPiece === slotIndex) {
        playCorrect();
        const newPlaced = [...placedPieces];
        newPlaced[slotIndex] = selectedPiece;
        setPlacedPieces(newPlaced);
        setSelectedPiece(null);
        setStars((s) => s + 1);
        if (newPlaced.every((p) => p !== null)) {
          setTimeout(() => setShowCelebration(true), 600);
        }
      } else {
        playWrong();
        setWrongSlot(slotIndex);
        setTimeout(() => setWrongSlot(null), 600);
      }
    },
    [selectedPiece, placedPieces]
  );

  if (showCelebration) {
    return (
      <CelebrationScreen
        message="Picture Perfect! 🖼️"
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
        <Header title="Build the Picture" emoji="🖼️" onBack={onBack} stars={stars} />
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-center mb-6 text-lg">
            Put the picture pieces in the right order! Choose a picture:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {pictureLevels.map((level, i) => (
              <button
                key={i}
                onClick={() => startLevel(i)}
                className="game-card bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center hover:bg-white/30 transition-all"
              >
                <div className="text-5xl mb-3">{level.emoji}</div>
                <div className="text-white font-bold">{level.name}</div>
                <div className="text-white/50 text-sm mt-1">{level.pieces.length} pieces</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = pictureLevels[levelIndex];

  return (
    <div className="min-h-screen p-4">
      <Header
        title="Build the Picture"
        emoji="🖼️"
        subtitle={`${level.name} - ${placedPieces.filter((p) => p !== null).length}/${level.pieces.length}`}
        onBack={() => setLevelIndex(null)}
        stars={stars}
      />
      <div className="max-w-md mx-auto">
        <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-candy-purple to-candy-pink h-full rounded-full transition-all duration-500"
            style={{ width: `${(placedPieces.filter((p) => p !== null).length / level.pieces.length) * 100}%` }}
          />
        </div>

        {/* Build area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/80 text-center mb-3 font-bold">🖼️ Picture (top to bottom):</p>
          <div className="space-y-2">
            {level.pieces.map((_piece, slotIdx) => (
              <button
                key={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                className={`w-full rounded-xl p-3 transition-all duration-300 ${
                  placedPieces[slotIdx] !== null
                    ? 'bg-white/20'
                    : wrongSlot === slotIdx
                    ? 'bg-candy-red/20 animate-shake border-2 border-dashed border-candy-red'
                    : selectedPiece !== null
                    ? 'bg-white/10 border-2 border-dashed border-candy-yellow hover:bg-candy-yellow/10 hover:scale-[1.02]'
                    : 'bg-white/5 border-2 border-dashed border-white/20'
                }`}
              >
                {placedPieces[slotIdx] !== null ? (
                  <div className="flex justify-center gap-2 text-3xl animate-pop-in">
                    {level.pieces[placedPieces[slotIdx]!].content.map((c, ci) => (
                      <span key={ci}>{c}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/40 text-sm font-bold text-center py-2">
                    Row {slotIdx + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Piece palette */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/80 text-center mb-3 font-bold">
            {selectedPiece !== null ? '👆 Tap where it goes!' : '👇 Pick a piece:'}
          </p>
          <div className="space-y-2">
            {shuffledPieces.map((piece) => {
              const isPlaced = placedPieces.includes(piece.id);
              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceSelect(piece.id)}
                  disabled={isPlaced}
                  className={`w-full rounded-xl p-3 transition-all duration-300 ${
                    isPlaced
                      ? 'opacity-20 scale-95'
                      : selectedPiece === piece.id
                      ? 'bg-candy-yellow/30 ring-4 ring-candy-yellow scale-[1.02] animate-wiggle'
                      : 'bg-white/20 hover:bg-white/30 hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex justify-center gap-2 text-2xl">
                    {piece.content.map((c, ci) => (
                      <span key={ci}>{c}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
