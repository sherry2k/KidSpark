// ============================================================
// NEW QUIZ QUESTIONS (batch 1) — match the new Learn categories
// ============================================================
//
// Same shape as quizQuestions in gameData.ts. The right answer is placed in a
// different slot for each question (it rotates 0,1,2,3), so it is not always
// in the same place.
//
// Every picture is an emoji from Unicode 11 or older.

import type { QuizQuestion } from './gameData';

const q = (
  category: string,
  question: string,
  emoji: string,
  right: string,
  wrong: [string, string, string],
  slot: number,
): QuizQuestion => {
  const options = [...wrong];
  options.splice(slot % 4, 0, right);
  return { question, emoji, options, correct: slot % 4, category };
};

// slot counter so the right answer rotates through all four places
let n = 0;
const s = () => n++ * 3 + 1;

export const extraQuizQuestions: QuizQuestion[] = [
  // ---- sea animals ----
  q('sea', 'Which sea animal has 8 arms?', '🐙', 'Octopus', ['Crab', 'Shark', 'Whale'], s()),
  q('sea', 'Which animal walks sideways?', '🦀', 'Crab', ['Fish', 'Turtle', 'Dolphin'], s()),
  q('sea', 'Which sea animal is the biggest?', '🐳', 'Whale', ['Fish', 'Crab', 'Shrimp'], s()),
  q('sea', 'Which sea animal loves to jump and is very clever?', '🐬', 'Dolphin', ['Shark', 'Octopus', 'Lobster'], s()),
  q('sea', 'Which sea animal has lots of teeth?', '🦈', 'Shark', ['Dolphin', 'Turtle', 'Squid'], s()),
  q('sea', 'Which animal puffs up like a ball?', '🐡', 'Pufferfish', ['Whale', 'Crab', 'Octopus'], s()),

  // ---- insects ----
  q('insects', 'Which insect makes honey?', '🐝', 'Bee', ['Ant', 'Ladybug', 'Mosquito'], s()),
  q('insects', 'Which insect is red with black spots?', '🐞', 'Ladybug', ['Bee', 'Ant', 'Cricket'], s()),
  q('insects', 'A caterpillar grows into a...', '🐛', 'Butterfly', ['Bee', 'Ant', 'Snail'], s()),
  q('insects', 'Which one has 8 legs and spins a web?', '🕷️', 'Spider', ['Ant', 'Bee', 'Butterfly'], s()),
  q('insects', 'Which one carries its house on its back?', '🐌', 'Snail', ['Ant', 'Cricket', 'Bee'], s()),
  q('insects', 'Which tiny insect is small but very strong?', '🐜', 'Ant', ['Butterfly', 'Snail', 'Spider'], s()),

  // ---- weather and clothes ----
  q('weather', 'What do you use when it rains?', '☂️', 'Umbrella', ['Sunglasses', 'Scarf', 'Gloves'], s()),
  q('weather', 'What do you wear on your hands when it is cold?', '🧤', 'Gloves', ['Socks', 'Hat', 'Shoes'], s()),
  q('weather', 'What do you wear to protect your eyes from the sun?', '🕶️', 'Sunglasses', ['Gloves', 'Scarf', 'Boots'], s()),
  q('weather', 'What do we sometimes see after the rain?', '🌈', 'Rainbow', ['Snow', 'Fog', 'Thunder'], s()),
  q('weather', 'Which weather has thunder and lightning?', '⛈️', 'Stormy', ['Sunny', 'Snowy', 'Foggy'], s()),
  q('weather', 'Which weather is cold with white snow?', '❄️', 'Snowy', ['Sunny', 'Windy', 'Rainy'], s()),
  q('weather', 'What do you wear on your feet in the rain?', '👢', 'Boots', ['Hat', 'Scarf', 'Sunglasses'], s()),
  q('weather', 'What do you wear to keep your neck warm?', '🧣', 'Scarf', ['Socks', 'Shirt', 'Sunglasses'], s()),

  // ---- feelings ----
  q('feelings', 'How does this face feel?', '😢', 'Sad', ['Happy', 'Angry', 'Sleepy'], s()),
  q('feelings', 'How does this face feel?', '😠', 'Angry', ['Happy', 'Sleepy', 'Surprised'], s()),
  q('feelings', 'How does this face feel?', '😴', 'Sleepy', ['Angry', 'Excited', 'Scared'], s()),
  q('feelings', 'How does this face feel?', '😨', 'Scared', ['Happy', 'Sleepy', 'Silly'], s()),
  q('feelings', 'How does this face feel?', '😮', 'Surprised', ['Sad', 'Sleepy', 'Angry'], s()),
  q('feelings', 'How does this face feel when they are not well?', '🤒', 'Sick', ['Happy', 'Excited', 'Silly'], s()),
  q('feelings', 'How do you feel when you get a big hug?', '😍', 'Loved', ['Angry', 'Scared', 'Sleepy'], s()),

  // ---- opposites ----
  q('opposites', 'What is the opposite of hot?', '🔥', 'Cold', ['Big', 'Fast', 'Happy'], s()),
  q('opposites', 'What is the opposite of big?', '🐘', 'Small', ['Tall', 'Hot', 'Old'], s()),
  q('opposites', 'What is the opposite of up?', '⬆️', 'Down', ['Open', 'Fast', 'Day'], s()),
  q('opposites', 'What is the opposite of day?', '☀️', 'Night', ['Cold', 'Slow', 'Old'], s()),
  q('opposites', 'What is the opposite of fast?', '🐆', 'Slow', ['Small', 'Wet', 'Loud'], s()),
  q('opposites', 'What is the opposite of happy?', '😀', 'Sad', ['Hot', 'Big', 'Dry'], s()),
  q('opposites', 'What is the opposite of old?', '👴', 'Young', ['Cold', 'Loud', 'Slow'], s()),
  q('opposites', 'What is the opposite of loud?', '📣', 'Quiet', ['Small', 'Wet', 'Fast'], s()),

  // ---- days, months and seasons ----
  q('time', 'Which day comes after Monday?', '📅', 'Tuesday', ['Sunday', 'Friday', 'Wednesday'], s()),
  q('time', 'Which day comes before Sunday?', '📅', 'Saturday', ['Monday', 'Friday', 'Thursday'], s()),
  q('time', 'How many months are in a year?', '🗓️', '12', ['10', '11', '13'], s()),
  q('time', 'Which is the first month of the year?', '🗓️', 'January', ['March', 'December', 'June'], s()),
  q('time', 'Which season is the coldest?', '❄️', 'Winter', ['Summer', 'Spring', 'Autumn'], s()),
  q('time', 'Which season is the hottest?', '☀️', 'Summer', ['Winter', 'Spring', 'Autumn'], s()),
  q('time', 'In which season do flowers bloom?', '🌸', 'Spring', ['Winter', 'Summer', 'Autumn'], s()),
  q('time', 'In which season do the leaves fall down?', '🍁', 'Autumn', ['Spring', 'Summer', 'Winter'], s()),

  // ---- food and drinks ----
  q('food', 'Which food is made from milk?', '🧀', 'Cheese', ['Bread', 'Rice', 'Cookie'], s()),
  q('food', 'Which drink comes from cows?', '🥛', 'Milk', ['Tea', 'Juice', 'Water'], s()),
  q('food', 'Which food comes from hens?', '🥚', 'Egg', ['Rice', 'Bread', 'Cake'], s()),
  q('food', 'What do we eat on a birthday?', '🍰', 'Cake', ['Rice', 'Noodles', 'Cheese'], s()),
  q('food', 'Which sweet food is cold?', '🍦', 'Ice Cream', ['Pizza', 'Burger', 'Rice'], s()),
  q('food', 'Who makes honey?', '🍯', 'Bee', ['Ant', 'Cow', 'Hen'], s()),
  q('food', 'Which food is round and cut into slices?', '🍕', 'Pizza', ['Noodles', 'Rice', 'Egg'], s()),
];
