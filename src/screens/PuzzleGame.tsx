import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { GameProgress } from '../store/gameStore';

// Import all 14 mini-games
import ShadowMatch from '../games/ShadowMatch';
import MemoryMatch from '../games/MemoryMatch';
import PatternPuzzle from '../games/PatternPuzzle';
import OddOneOut from '../games/OddOneOut';
import ShapeBuilder from '../games/ShapeBuilder';
import StorySequence from '../games/StorySequence';
import ObjectSorting from '../games/ObjectSorting';
import SpotDifference from '../games/SpotDifference';
import MissingItem from '../games/MissingItem';
import MazeAdventure from '../games/MazeAdventure';
import CompleteScene from '../games/CompleteScene';
import BuildPicture from '../games/BuildPicture';
import HalfHalf from '../games/HalfHalf';
import ConnectDots from '../games/ConnectDots';

interface PuzzleGameProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type GameType =
  | 'shadow-match'
  | 'memory-match'
  | 'pattern-puzzle'
  | 'odd-one-out'
  | 'shape-builder'
  | 'story-sequence'
  | 'object-sorting'
  | 'spot-difference'
  | 'missing-item'
  | 'maze-adventure'
  | 'complete-scene'
  | 'build-picture'
  | 'half-half'
  | 'connect-dots';

interface GameInfo {
  id: GameType;
  name: string;
  emoji: string;
  description: string;
  color: string;
  skills: string[];
}

const games: GameInfo[] = [
  {
    id: 'shadow-match',
    name: 'Shadow Match',
    emoji: '🔦',
    description: 'Match objects to their shadows',
    color: 'from-violet-500 to-purple-600',
    skills: ['Observation', 'Shape Recognition'],
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    emoji: '🧠',
    description: 'Find matching card pairs',
    color: 'from-pink-500 to-rose-600',
    skills: ['Memory', 'Concentration'],
  },
  {
    id: 'pattern-puzzle',
    name: 'Pattern Puzzle',
    emoji: '🔢',
    description: 'Complete the pattern sequence',
    color: 'from-amber-500 to-orange-600',
    skills: ['Logic', 'Pattern Recognition'],
  },
  {
    id: 'odd-one-out',
    name: 'Odd One Out',
    emoji: '🔍',
    description: 'Find what doesn\'t belong',
    color: 'from-emerald-500 to-green-600',
    skills: ['Critical Thinking', 'Classification'],
  },
  {
    id: 'shape-builder',
    name: 'Shape Builder',
    emoji: '🧱',
    description: 'Build objects with shapes',
    color: 'from-blue-500 to-indigo-600',
    skills: ['Spatial Reasoning', 'Creativity'],
  },
  {
    id: 'story-sequence',
    name: 'Story Sequence',
    emoji: '📚',
    description: 'Arrange the story in order',
    color: 'from-teal-500 to-cyan-600',
    skills: ['Sequencing', 'Comprehension'],
  },
  {
    id: 'object-sorting',
    name: 'Object Sorting',
    emoji: '📦',
    description: 'Sort items into groups',
    color: 'from-lime-500 to-green-600',
    skills: ['Classification', 'Logic'],
  },
  {
    id: 'spot-difference',
    name: 'Spot Difference',
    emoji: '👀',
    description: 'Find differences between pictures',
    color: 'from-red-500 to-pink-600',
    skills: ['Attention to Detail', 'Observation'],
  },
  {
    id: 'missing-item',
    name: 'Missing Item',
    emoji: '🔎',
    description: 'Find the missing piece',
    color: 'from-sky-500 to-blue-600',
    skills: ['Deduction', 'Pattern Recognition'],
  },
  {
    id: 'maze-adventure',
    name: 'Maze Adventure',
    emoji: '🧭',
    description: 'Navigate through the maze',
    color: 'from-yellow-500 to-amber-600',
    skills: ['Problem Solving', 'Planning'],
  },
  {
    id: 'complete-scene',
    name: 'Complete Scene',
    emoji: '🎨',
    description: 'Add missing items to the scene',
    color: 'from-fuchsia-500 to-purple-600',
    skills: ['Visual Perception', 'Association'],
  },
  {
    id: 'build-picture',
    name: 'Build Picture',
    emoji: '🖼️',
    description: 'Assemble the picture pieces',
    color: 'from-orange-500 to-red-600',
    skills: ['Spatial Reasoning', 'Sequencing'],
  },
  {
    id: 'half-half',
    name: 'Half & Half',
    emoji: '🧩',
    description: 'Connect matching halves',
    color: 'from-cyan-500 to-teal-600',
    skills: ['Matching', 'Visual Perception'],
  },
  {
    id: 'connect-dots',
    name: 'Connect Dots',
    emoji: '✏️',
    description: 'Connect numbered dots to reveal pictures',
    color: 'from-indigo-500 to-violet-600',
    skills: ['Number Order', 'Fine Motor'],
  },
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ progress, onBack, onComplete: _onComplete }) => {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const goBackToPuzzleHub = () => setCurrentGame(null);

  // If a mini-game is selected, render it
  if (currentGame) {
    const gameMap: Record<GameType, React.ReactNode> = {
      'shadow-match': <ShadowMatch onBack={goBackToPuzzleHub} />,
      'memory-match': <MemoryMatch onBack={goBackToPuzzleHub} />,
      'pattern-puzzle': <PatternPuzzle onBack={goBackToPuzzleHub} />,
      'odd-one-out': <OddOneOut onBack={goBackToPuzzleHub} />,
      'shape-builder': <ShapeBuilder onBack={goBackToPuzzleHub} />,
      'story-sequence': <StorySequence onBack={goBackToPuzzleHub} />,
      'object-sorting': <ObjectSorting onBack={goBackToPuzzleHub} />,
      'spot-difference': <SpotDifference onBack={goBackToPuzzleHub} />,
      'missing-item': <MissingItem onBack={goBackToPuzzleHub} />,
      'maze-adventure': <MazeAdventure onBack={goBackToPuzzleHub} />,
      'complete-scene': <CompleteScene onBack={goBackToPuzzleHub} />,
      'build-picture': <BuildPicture onBack={goBackToPuzzleHub} />,
      'half-half': <HalfHalf onBack={goBackToPuzzleHub} />,
      'connect-dots': <ConnectDots onBack={goBackToPuzzleHub} />,
    };

    // The individual games handle their own state, stars, and celebration screens.
    // They are fully self-contained. 
    // If you want them to talk to the global store, you'd modify them to call onComplete.
    // But since they are wrapped here, we just render them over the background.
    return (
      <div className="absolute inset-0 z-50 overflow-auto bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        {gameMap[currentGame]}
      </div>
    );
  }

  // Otherwise, render the Hub selection screen
  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col pb-8">
        <Navigation title="🧩 Puzzle World" onBack={onBack} stars={progress.stars} />
        
        <div className="flex-1 overflow-y-auto px-4 mt-2 max-w-5xl mx-auto w-full">
          <div className="text-center mb-6">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-800 font-heading mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Choose a mini-game! 🎮
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-sm md:text-base font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              14 fun ways to build your brain power 🧠
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                onClick={() => setCurrentGame(game.id)}
                className="game-card p-4 sm:p-5 text-left relative overflow-hidden group"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-2 group-hover:animate-wiggle transition-all">
                    {game.emoji}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-1">
                    {game.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-tight mb-2 hidden sm:block">
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {game.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default PuzzleGame;