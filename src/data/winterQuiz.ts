// ============================================================
// WINTER QUIZ QUESTIONS
// Added to the Quiz only while the winter theme is on (same switch as the
// Winter Learn category). Same shape as every other quiz question.
// Every picture is an emoji from Unicode 11 or older, and every answer
// word has a picture in answerIcons.ts, so pre-readers can answer.
// ============================================================

import type { QuizQuestion } from './gameData';
import { isWinter } from '../components/WinterDecor';

const winterList: QuizQuestion[] = [
  { question: 'What is this?', emoji: '⛄', options: ['Snowman', 'Pumpkin', 'Rocket', 'Cake'], correct: 0, category: 'winter' },
  { question: 'What falls from the sky when it is very cold?', emoji: '🌨️', options: ['Rain', 'Snow', 'Sun', 'Rainbow'], correct: 1, category: 'winter' },
  { question: 'What colour is snow?', emoji: '❄️', options: ['Green', 'Red', 'White', 'Black'], correct: 2, category: 'winter' },
  { question: 'Which animal lives where it is icy and cold?', emoji: '🏔️', options: ['Lion', 'Monkey', 'Giraffe', 'Penguin'], correct: 3, category: 'winter' },
  { question: 'How many legs does a penguin have?', emoji: '🐧', options: ['2', '4', '6', '8'], correct: 0, category: 'winter' },
  { question: 'Which animal is white and lives in the snow?', emoji: '🏔️', options: ['Panda', 'Polar Bear', 'Zebra', 'Tiger'], correct: 1, category: 'winter' },
  { question: 'What do you wear on your hands when it is cold?', emoji: '🧤', options: ['Socks', 'Boots', 'Gloves', 'Sunglasses'], correct: 2, category: 'winter' },
  { question: 'What do you wear around your neck to stay warm?', emoji: '🧣', options: ['Scarf', 'Boots', 'Sunglasses', 'Socks'], correct: 0, category: 'winter' },
  { question: 'What do you wear on your feet in the snow?', emoji: '👢', options: ['Hat', 'Gloves', 'Boots', 'Scarf'], correct: 2, category: 'winter' },
  { question: 'What should we wear when it is snowy?', emoji: '🌨️', options: ['Sandals', 'Coat', 'Sunglasses', 'Umbrella'], correct: 1, category: 'winter' },
  { question: 'Which one do you ride down a snowy hill?', emoji: '🏔️', options: ['Bus', 'Bicycle', 'Train', 'Sled'], correct: 3, category: 'winter' },
  { question: 'What is this?', emoji: '🎿', options: ['Skis', 'Sled', 'Bicycle', 'Boat'], correct: 0, category: 'winter' },
  { question: 'Which drink is warm and yummy on a cold day?', emoji: '☕', options: ['Ice Cream', 'Hot Cocoa', 'Juice', 'Water'], correct: 1, category: 'winter' },
  { question: 'Which one feels cold?', emoji: '🥶', options: ['Sun', 'Tea', 'Snow', 'Soup'], correct: 2, category: 'winter' },
];

/** Empty outside winter, so the Quiz is unchanged the rest of the year. */
export const winterQuizQuestions: QuizQuestion[] = isWinter() ? winterList : [];
