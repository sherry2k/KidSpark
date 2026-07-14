import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAllContent,
  isAirtableConfigured,
  AirtableLearnItem,
  AirtableQuizQuestion,
  AirtableWordBuilderWord,
} from '../services/airtable';
import {
  animalsData,
  fruitsData,
  vegetablesData,
  shapesData,
  colorsData,
  vehiclesData,
  birdsData,
  bodyPartsData,
  alphabetData,
  numbersData,
  quizQuestions as localQuizQuestions,
  wordBuilderWords as localWordBuilderWords,
  LearnItem,
  QuizQuestion,
  WordBuilderWord,
} from '../data/gameData';

// ============================================================
// CONTENT CONTEXT - Manages dynamic content from Airtable
// ============================================================

interface ContentState {
  isLoading: boolean;
  isAirtable: boolean;
  animals: LearnItem[];
  fruits: LearnItem[];
  vegetables: LearnItem[];
  shapes: LearnItem[];
  colors: LearnItem[];
  vehicles: LearnItem[];
  birds: LearnItem[];
  bodyParts: LearnItem[];
  alphabet: LearnItem[];
  numbers: LearnItem[];
  quizQuestions: QuizQuestion[];
  wordBuilderWords: WordBuilderWord[];
  refreshContent: () => Promise<void>;
  lastUpdated: Date | null;
}

const ContentContext = createContext<ContentState | null>(null);

// Convert Airtable item to local LearnItem format
function convertLearnItem(item: AirtableLearnItem, category: string): LearnItem {
  return {
    id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
    name: item.name,
    emoji: item.emoji,
    category: category,
    funFact: item.funFact,
    color: item.color,
  };
}

// Convert Airtable quiz question to local format
function convertQuizQuestion(q: AirtableQuizQuestion): QuizQuestion {
  return {
    question: q.question,
    emoji: q.emoji,
    options: [q.option1, q.option2, q.option3, q.option4],
    correct: q.correctAnswer - 1, // Convert 1-4 to 0-3
    category: q.category,
  };
}

// Convert Airtable word to local format
function convertWordBuilderWord(w: AirtableWordBuilderWord): WordBuilderWord {
  return {
    word: w.word.toUpperCase(),
    emoji: w.emoji,
    hint: w.hint,
  };
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAirtable, setIsAirtable] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Content state - starts with local fallback data
  const [animals, setAnimals] = useState<LearnItem[]>(animalsData);
  const [fruits, setFruits] = useState<LearnItem[]>(fruitsData);
  const [vegetables, setVegetables] = useState<LearnItem[]>(vegetablesData);
  const [shapes, setShapes] = useState<LearnItem[]>(shapesData);
  const [colors, setColors] = useState<LearnItem[]>(colorsData);
  const [vehicles, setVehicles] = useState<LearnItem[]>(vehiclesData);
  const [birds, setBirds] = useState<LearnItem[]>(birdsData);
  const [bodyParts, setBodyParts] = useState<LearnItem[]>(bodyPartsData);
  const [alphabet, setAlphabet] = useState<LearnItem[]>(alphabetData);
  const [numbers, setNumbers] = useState<LearnItem[]>(numbersData);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(localQuizQuestions);
  const [wordBuilderWords, setWordBuilderWords] = useState<WordBuilderWord[]>(localWordBuilderWords);

  const loadContent = useCallback(async () => {
    if (!isAirtableConfigured()) {
      console.log('Using local fallback data (Airtable not configured)');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const content = await fetchAllContent();

      if (content) {
        // Only update if we got data from Airtable
        if (content.animals.length > 0) {
          setAnimals(content.animals.map(a => convertLearnItem(a, 'animals')));
        }
        if (content.fruits.length > 0) {
          setFruits(content.fruits.map(f => convertLearnItem(f, 'fruits')));
        }
        if (content.vegetables.length > 0) {
          setVegetables(content.vegetables.map(v => convertLearnItem(v, 'vegetables')));
        }
        if (content.shapes.length > 0) {
          setShapes(content.shapes.map(s => convertLearnItem(s, 'shapes')));
        }
        if (content.colors.length > 0) {
          setColors(content.colors.map(c => convertLearnItem(c, 'colors')));
        }
        if (content.vehicles.length > 0) {
          setVehicles(content.vehicles.map(v => convertLearnItem(v, 'vehicles')));
        }
        if (content.birds.length > 0) {
          setBirds(content.birds.map(b => convertLearnItem(b, 'birds')));
        }
        if (content.bodyParts.length > 0) {
          setBodyParts(content.bodyParts.map(b => convertLearnItem(b, 'body')));
        }
        if (content.alphabet.length > 0) {
          setAlphabet(content.alphabet.map(a => convertLearnItem(a, 'alphabet')));
        }
        if (content.numbers.length > 0) {
          setNumbers(content.numbers.map(n => convertLearnItem(n, 'numbers')));
        }
        if (content.quizQuestions.length > 0) {
          setQuizQuestions(content.quizQuestions.map(convertQuizQuestion));
        }
        if (content.wordBuilderWords.length > 0) {
          setWordBuilderWords(content.wordBuilderWords.map(convertWordBuilderWord));
        }

        setIsAirtable(true);
        setLastUpdated(new Date());
        console.log('Content loaded from Airtable');
      }
    } catch (error) {
      console.error('Failed to load Airtable content, using fallback:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const value: ContentState = {
    isLoading,
    isAirtable,
    animals,
    fruits,
    vegetables,
    shapes,
    colors,
    vehicles,
    birds,
    bodyParts,
    alphabet,
    numbers,
    quizQuestions,
    wordBuilderWords,
    refreshContent: loadContent,
    lastUpdated,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export function useContent(): ContentState {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Hook to get learn categories with dynamic data
export function useLearnCategories() {
  const content = useContent();

  return [
    { id: 'alphabet', name: 'Alphabet', emoji: '🔤', color: '#4fc3f7', gradient: 'from-blue-400 to-cyan-400', items: content.alphabet },
    { id: 'numbers', name: 'Numbers', emoji: '🔢', color: '#ff7043', gradient: 'from-orange-400 to-red-400', items: content.numbers },
    { id: 'animals', name: 'Animals', emoji: '🦁', color: '#66bb6a', gradient: 'from-green-400 to-emerald-400', items: content.animals },
    { id: 'fruits', name: 'Fruits', emoji: '🍎', color: '#ef5350', gradient: 'from-red-400 to-pink-400', items: content.fruits },
    { id: 'vegetables', name: 'Vegetables', emoji: '🥕', color: '#8bc34a', gradient: 'from-lime-400 to-green-400', items: content.vegetables },
    { id: 'shapes', name: 'Shapes', emoji: '🔺', color: '#ab47bc', gradient: 'from-purple-400 to-violet-400', items: content.shapes },
    { id: 'colors', name: 'Colors', emoji: '🌈', color: '#ffa726', gradient: 'from-yellow-400 to-orange-400', items: content.colors },
    { id: 'vehicles', name: 'Vehicles', emoji: '🚗', color: '#29b6f6', gradient: 'from-sky-400 to-blue-400', items: content.vehicles },
    { id: 'birds', name: 'Birds', emoji: '🦅', color: '#f06292', gradient: 'from-pink-400 to-rose-400', items: content.birds },
    { id: 'body', name: 'Body Parts', emoji: '🧠', color: '#7e57c2', gradient: 'from-violet-400 to-purple-400', items: content.bodyParts },
  ];
}
