export interface LearnItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  funFact?: string;
  sound?: string;
  color?: string;
}

// ALPHABET DATA
export const alphabetData: LearnItem[] = [
  { id: 'a', name: 'A - Apple', emoji: '🍎', category: 'alphabet', funFact: 'A is the first letter!' },
  { id: 'b', name: 'B - Ball', emoji: '⚽', category: 'alphabet', funFact: 'B makes a "buh" sound!' },
  { id: 'c', name: 'C - Cat', emoji: '🐱', category: 'alphabet', funFact: 'C can sound like K or S!' },
  { id: 'd', name: 'D - Dog', emoji: '🐶', category: 'alphabet', funFact: 'D makes a "duh" sound!' },
  { id: 'e', name: 'E - Elephant', emoji: '🐘', category: 'alphabet', funFact: 'E is the most used letter!' },
  { id: 'f', name: 'F - Fish', emoji: '🐟', category: 'alphabet', funFact: 'F makes a "fff" sound!' },
  { id: 'g', name: 'G - Grapes', emoji: '🍇', category: 'alphabet', funFact: 'G can be hard or soft!' },
  { id: 'h', name: 'H - Hat', emoji: '🎩', category: 'alphabet', funFact: 'H is a breathy sound!' },
  { id: 'i', name: 'I - Ice Cream', emoji: '🍦', category: 'alphabet', funFact: 'I can say its own name!' },
  { id: 'j', name: 'J - Jellyfish', emoji: '🪼', category: 'alphabet', funFact: 'J makes a "juh" sound!' },
  { id: 'k', name: 'K - Kite', emoji: '🪁', category: 'alphabet', funFact: 'K and C can sound alike!' },
  { id: 'l', name: 'L - Lion', emoji: '🦁', category: 'alphabet', funFact: 'L is a smooth sound!' },
  { id: 'm', name: 'M - Moon', emoji: '🌙', category: 'alphabet', funFact: 'M makes a "mmm" sound!' },
  { id: 'n', name: 'N - Nest', emoji: '🪺', category: 'alphabet', funFact: 'N makes a "nnn" sound!' },
  { id: 'o', name: 'O - Orange', emoji: '🍊', category: 'alphabet', funFact: 'O is shaped like a circle!' },
  { id: 'p', name: 'P - Penguin', emoji: '🐧', category: 'alphabet', funFact: 'P makes a "puh" sound!' },
  { id: 'q', name: 'Q - Queen', emoji: '👸', category: 'alphabet', funFact: 'Q always has U after it!' },
  { id: 'r', name: 'R - Rainbow', emoji: '🌈', category: 'alphabet', funFact: 'R makes a "rrr" sound!' },
  { id: 's', name: 'S - Star', emoji: '⭐', category: 'alphabet', funFact: 'S makes a "sss" sound!' },
  { id: 't', name: 'T - Tree', emoji: '🌳', category: 'alphabet', funFact: 'T makes a "tuh" sound!' },
  { id: 'u', name: 'U - Umbrella', emoji: '☂️', category: 'alphabet', funFact: 'U can say "uh" or its name!' },
  { id: 'v', name: 'V - Violin', emoji: '🎻', category: 'alphabet', funFact: 'V makes a buzzy sound!' },
  { id: 'w', name: 'W - Watermelon', emoji: '🍉', category: 'alphabet', funFact: 'W is called double-U!' },
  { id: 'x', name: 'X - Xylophone', emoji: '🎵', category: 'alphabet', funFact: 'X can sound like "ks"!' },
  { id: 'y', name: 'Y - Yacht', emoji: '⛵', category: 'alphabet', funFact: 'Y can be a vowel too!' },
  { id: 'z', name: 'Z - Zebra', emoji: '🦓', category: 'alphabet', funFact: 'Z is the last letter!' },
];

// NUMBERS DATA
export const numbersData: LearnItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `num-${i + 1}`,
  name: `${i + 1}`,
  emoji: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟',
          '1️⃣1️⃣','1️⃣2️⃣','1️⃣3️⃣','1️⃣4️⃣','1️⃣5️⃣','1️⃣6️⃣','1️⃣7️⃣','1️⃣8️⃣','1️⃣9️⃣','2️⃣0️⃣'][i],
  category: 'numbers',
  funFact: `Can you count ${i + 1} things?`,
}));

// ANIMALS DATA
export const animalsData: LearnItem[] = [
  { id: 'lion', name: 'Lion', emoji: '🦁', category: 'animals', funFact: 'Lions are called the King of the Jungle!' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', category: 'animals', funFact: 'Elephants never forget!' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', category: 'animals', funFact: 'Giraffes are the tallest animals!' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒', category: 'animals', funFact: 'Monkeys love bananas!' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', category: 'animals', funFact: 'Penguins can\'t fly but swim great!' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', category: 'animals', funFact: 'Dolphins are very smart!' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', category: 'animals', funFact: 'Rabbits love carrots!' },
  { id: 'bear', name: 'Bear', emoji: '🐻', category: 'animals', funFact: 'Bears sleep all winter!' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', category: 'animals', funFact: 'Every tiger has unique stripes!' },
  { id: 'panda', name: 'Panda', emoji: '🐼', category: 'animals', funFact: 'Pandas eat bamboo all day!' },
  { id: 'koala', name: 'Koala', emoji: '🐨', category: 'animals', funFact: 'Koalas sleep 22 hours a day!' },
  { id: 'fox', name: 'Fox', emoji: '🦊', category: 'animals', funFact: 'Foxes are very clever!' },
  { id: 'dog', name: 'Dog', emoji: '🐶', category: 'animals', funFact: 'Dogs are our best friends!' },
  { id: 'cat', name: 'Cat', emoji: '🐱', category: 'animals', funFact: 'Cats can see in the dark!' },
  { id: 'owl', name: 'Owl', emoji: '🦉', category: 'animals', funFact: 'Owls can turn their heads around!' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'animals', funFact: 'Butterflies taste with their feet!' },
];

// FRUITS DATA
export const fruitsData: LearnItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fruits', funFact: 'An apple a day keeps the doctor away!', color: 'red' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fruits', funFact: 'Bananas are great for energy!', color: 'yellow' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'fruits', funFact: 'Grapes can be red, green, or purple!', color: 'purple' },
  { id: 'orange', name: 'Orange', emoji: '🍊', category: 'fruits', funFact: 'Oranges are full of vitamin C!', color: 'orange' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'fruits', funFact: 'Strawberries have seeds on the outside!', color: 'red' },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'fruits', funFact: 'Watermelons are 92% water!', color: 'green' },
  { id: 'peach', name: 'Peach', emoji: '🍑', category: 'fruits', funFact: 'Peaches are fuzzy on the outside!', color: 'orange' },
  { id: 'cherry', name: 'Cherry', emoji: '🍒', category: 'fruits', funFact: 'Cherries grow in pairs!', color: 'red' },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', category: 'fruits', funFact: 'Pineapples take 2 years to grow!', color: 'yellow' },
  { id: 'mango', name: 'Mango', emoji: '🥭', category: 'fruits', funFact: 'Mango is the king of fruits!', color: 'orange' },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'fruits', funFact: 'Kiwis are fuzzy and green inside!', color: 'green' },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', category: 'fruits', funFact: 'Lemons are very sour!', color: 'yellow' },
];

// VEGETABLES DATA
export const vegetablesData: LearnItem[] = [
  { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'vegetables', funFact: 'Carrots help you see better!' },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'vegetables', funFact: 'Broccoli looks like tiny trees!' },
  { id: 'corn', name: 'Corn', emoji: '🌽', category: 'vegetables', funFact: 'Corn can be popped into popcorn!' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'vegetables', funFact: 'Tomatoes are actually fruits!' },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'vegetables', funFact: 'Potatoes grow underground!' },
  { id: 'pepper', name: 'Pepper', emoji: '🫑', category: 'vegetables', funFact: 'Peppers come in many colors!' },
  { id: 'eggplant', name: 'Eggplant', emoji: '🍆', category: 'vegetables', funFact: 'Eggplants are purple!' },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'vegetables', funFact: 'Cucumbers are mostly water!' },
];

// SHAPES DATA
export const shapesData: LearnItem[] = [
  { id: 'circle', name: 'Circle', emoji: '🔴', category: 'shapes', funFact: 'A circle has no corners!' },
  { id: 'square', name: 'Square', emoji: '🟧', category: 'shapes', funFact: 'A square has 4 equal sides!' },
  { id: 'triangle', name: 'Triangle', emoji: '🔺', category: 'shapes', funFact: 'A triangle has 3 sides!' },
  { id: 'star', name: 'Star', emoji: '⭐', category: 'shapes', funFact: 'Stars twinkle in the sky!' },
  { id: 'heart', name: 'Heart', emoji: '❤️', category: 'shapes', funFact: 'Hearts mean love!' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', category: 'shapes', funFact: 'Diamonds are very sparkly!' },
  { id: 'rectangle', name: 'Rectangle', emoji: '🟩', category: 'shapes', funFact: 'A rectangle has 4 sides!' },
  { id: 'oval', name: 'Oval', emoji: '🥚', category: 'shapes', funFact: 'An oval is like a stretched circle!' },
];

// COLORS DATA
export const colorsData: LearnItem[] = [
  { id: 'red', name: 'Red', emoji: '🔴', category: 'colors', funFact: 'Fire trucks are red!', color: '#ef4444' },
  { id: 'blue', name: 'Blue', emoji: '🔵', category: 'colors', funFact: 'The sky is blue!', color: '#3b82f6' },
  { id: 'yellow', name: 'Yellow', emoji: '🟡', category: 'colors', funFact: 'The sun is yellow!', color: '#eab308' },
  { id: 'green', name: 'Green', emoji: '🟢', category: 'colors', funFact: 'Grass is green!', color: '#22c55e' },
  { id: 'purple', name: 'Purple', emoji: '🟣', category: 'colors', funFact: 'Purple is a royal color!', color: '#a855f7' },
  { id: 'orange', name: 'Orange', emoji: '🟠', category: 'colors', funFact: 'Oranges are orange!', color: '#f97316' },
  { id: 'pink', name: 'Pink', emoji: '🩷', category: 'colors', funFact: 'Flamingos are pink!', color: '#ec4899' },
  { id: 'brown', name: 'Brown', emoji: '🟤', category: 'colors', funFact: 'Chocolate is brown!', color: '#a16207' },
  { id: 'black', name: 'Black', emoji: '⚫', category: 'colors', funFact: 'Night is black!', color: '#1f2937' },
  { id: 'white', name: 'White', emoji: '⚪', category: 'colors', funFact: 'Snow is white!', color: '#f8fafc' },
];

// VEHICLES DATA
export const vehiclesData: LearnItem[] = [
  { id: 'car', name: 'Car', emoji: '🚗', category: 'vehicles', funFact: 'Cars drive on roads!' },
  { id: 'bus', name: 'Bus', emoji: '🚌', category: 'vehicles', funFact: 'Buses carry many people!' },
  { id: 'train', name: 'Train', emoji: '🚂', category: 'vehicles', funFact: 'Trains run on tracks!' },
  { id: 'airplane', name: 'Airplane', emoji: '✈️', category: 'vehicles', funFact: 'Airplanes fly in the sky!' },
  { id: 'boat', name: 'Boat', emoji: '⛵', category: 'vehicles', funFact: 'Boats sail on water!' },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', category: 'vehicles', funFact: 'Bicycles have two wheels!' },
  { id: 'helicopter', name: 'Helicopter', emoji: '🚁', category: 'vehicles', funFact: 'Helicopters can hover!' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', category: 'vehicles', funFact: 'Rockets go to space!' },
  { id: 'firetruck', name: 'Fire Truck', emoji: '🚒', category: 'vehicles', funFact: 'Fire trucks help put out fires!' },
  { id: 'ambulance', name: 'Ambulance', emoji: '🚑', category: 'vehicles', funFact: 'Ambulances help sick people!' },
];

// BIRDS DATA
export const birdsData: LearnItem[] = [
  { id: 'eagle', name: 'Eagle', emoji: '🦅', category: 'birds', funFact: 'Eagles have amazing eyesight!' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', category: 'birds', funFact: 'Parrots can talk!' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', category: 'birds', funFact: 'Penguins can\'t fly!' },
  { id: 'owl', name: 'Owl', emoji: '🦉', category: 'birds', funFact: 'Owls are night birds!' },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', category: 'birds', funFact: 'Flamingos stand on one leg!' },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', category: 'birds', funFact: 'Peacocks have beautiful feathers!' },
  { id: 'duck', name: 'Duck', emoji: '🦆', category: 'birds', funFact: 'Ducks say quack!' },
  { id: 'swan', name: 'Swan', emoji: '🦢', category: 'birds', funFact: 'Swans are very graceful!' },
];

// BODY PARTS DATA
export const bodyPartsData: LearnItem[] = [
  { id: 'eyes', name: 'Eyes', emoji: '👀', category: 'body', funFact: 'We see with our eyes!' },
  { id: 'nose', name: 'Nose', emoji: '👃', category: 'body', funFact: 'We smell with our nose!' },
  { id: 'mouth', name: 'Mouth', emoji: '👄', category: 'body', funFact: 'We eat and talk with our mouth!' },
  { id: 'ear', name: 'Ear', emoji: '👂', category: 'body', funFact: 'We hear with our ears!' },
  { id: 'hand', name: 'Hand', emoji: '✋', category: 'body', funFact: 'We have 5 fingers on each hand!' },
  { id: 'foot', name: 'Foot', emoji: '🦶', category: 'body', funFact: 'We walk with our feet!' },
  { id: 'brain', name: 'Brain', emoji: '🧠', category: 'body', funFact: 'Our brain helps us think!' },
  { id: 'heart', name: 'Heart', emoji: '❤️', category: 'body', funFact: 'Our heart pumps blood!' },
];

// QUIZ QUESTIONS
export interface QuizQuestion {
  question: string;
  emoji: string;
  options: string[];
  correct: number;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Animals
  { question: 'Which animal is this?', emoji: '🦁', options: ['Cat', 'Lion', 'Tiger', 'Dog'], correct: 1, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐘', options: ['Horse', 'Cow', 'Elephant', 'Rhino'], correct: 2, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐧', options: ['Penguin', 'Duck', 'Eagle', 'Owl'], correct: 0, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🦒', options: ['Zebra', 'Horse', 'Giraffe', 'Deer'], correct: 2, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐬', options: ['Shark', 'Whale', 'Fish', 'Dolphin'], correct: 3, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐻', options: ['Dog', 'Bear', 'Wolf', 'Tiger'], correct: 1, category: 'animals' },
  // Fruits
  { question: 'Which fruit is this?', emoji: '🍎', options: ['Cherry', 'Strawberry', 'Apple', 'Tomato'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍌', options: ['Corn', 'Banana', 'Pineapple', 'Mango'], correct: 1, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍇', options: ['Blueberry', 'Plum', 'Grapes', 'Fig'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍊', options: ['Peach', 'Orange', 'Lemon', 'Mango'], correct: 1, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍓', options: ['Cherry', 'Raspberry', 'Strawberry', 'Apple'], correct: 2, category: 'fruits' },
  // Colors
  { question: 'What color is a fire truck?', emoji: '🚒', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2, category: 'colors' },
  { question: 'What color is the sun?', emoji: '☀️', options: ['Red', 'Yellow', 'Orange', 'White'], correct: 1, category: 'colors' },
  { question: 'What color is grass?', emoji: '🌿', options: ['Blue', 'Yellow', 'Green', 'Brown'], correct: 2, category: 'colors' },
  { question: 'What color is the sky?', emoji: '🌤️', options: ['Blue', 'Green', 'Red', 'Purple'], correct: 0, category: 'colors' },
  // Numbers
  { question: 'How many legs does a dog have?', emoji: '🐶', options: ['2', '3', '4', '6'], correct: 2, category: 'numbers' },
  { question: 'How many eyes do you have?', emoji: '👀', options: ['1', '2', '3', '4'], correct: 1, category: 'numbers' },
  { question: 'How many fingers on one hand?', emoji: '✋', options: ['3', '4', '5', '6'], correct: 2, category: 'numbers' },
  // Shapes
  { question: 'How many sides does a triangle have?', emoji: '🔺', options: ['2', '3', '4', '5'], correct: 1, category: 'shapes' },
  { question: 'What shape is a ball?', emoji: '⚽', options: ['Square', 'Triangle', 'Circle', 'Star'], correct: 2, category: 'shapes' },
  // Vehicles
  { question: 'Which vehicle flies?', emoji: '✈️', options: ['Car', 'Boat', 'Airplane', 'Bus'], correct: 2, category: 'vehicles' },
  { question: 'Which vehicle sails on water?', emoji: '⛵', options: ['Boat', 'Car', 'Train', 'Bus'], correct: 0, category: 'vehicles' },
  // Math
  { question: 'What is 1 + 1?', emoji: '🧮', options: ['1', '2', '3', '4'], correct: 1, category: 'math' },
  { question: 'What is 2 + 3?', emoji: '🧮', options: ['4', '5', '6', '7'], correct: 1, category: 'math' },
  { question: 'What is 5 - 2?', emoji: '🧮', options: ['1', '2', '3', '4'], correct: 2, category: 'math' },
  { question: 'What is 3 + 4?', emoji: '🧮', options: ['5', '6', '7', '8'], correct: 2, category: 'math' },
  { question: 'What is 10 - 5?', emoji: '🧮', options: ['3', '4', '5', '6'], correct: 2, category: 'math' },
  { question: 'What is 6 + 2?', emoji: '🧮', options: ['7', '8', '9', '10'], correct: 1, category: 'math' },
];

// MEMORY GAME SETS
export const memoryGameSets = {
  animals: [
    { id: 'lion', emoji: '🦁', name: 'Lion' },
    { id: 'elephant', emoji: '🐘', name: 'Elephant' },
    { id: 'monkey', emoji: '🐒', name: 'Monkey' },
    { id: 'penguin', emoji: '🐧', name: 'Penguin' },
    { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
    { id: 'bear', emoji: '🐻', name: 'Bear' },
  ],
  fruits: [
    { id: 'apple', emoji: '🍎', name: 'Apple' },
    { id: 'banana', emoji: '🍌', name: 'Banana' },
    { id: 'grapes', emoji: '🍇', name: 'Grapes' },
    { id: 'orange', emoji: '🍊', name: 'Orange' },
    { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    { id: 'watermelon', emoji: '🍉', name: 'Watermelon' },
  ],
  shapes: [
    { id: 'circle', emoji: '🔴', name: 'Circle' },
    { id: 'square', emoji: '🟧', name: 'Square' },
    { id: 'triangle', emoji: '🔺', name: 'Triangle' },
    { id: 'star', emoji: '⭐', name: 'Star' },
    { id: 'heart', emoji: '❤️', name: 'Heart' },
    { id: 'diamond', emoji: '💎', name: 'Diamond' },
  ],
  alphabet: [
    { id: 'a', emoji: '🅰️', name: 'A' },
    { id: 'b', emoji: '🅱️', name: 'B' },
    { id: 'c', emoji: '©️', name: 'C' },
    { id: 'd', emoji: '🇩', name: 'D' },
    { id: 'e', emoji: '📧', name: 'E' },
    { id: 'f', emoji: '🎏', name: 'F' },
  ],
};

// WORD BUILDER WORDS
export interface WordBuilderWord {
  word: string;
  emoji: string;
  hint: string;
}

export const wordBuilderWords: WordBuilderWord[] = [
  { word: 'CAT', emoji: '🐱', hint: 'A furry pet that says meow' },
  { word: 'DOG', emoji: '🐶', hint: 'A pet that says woof' },
  { word: 'SUN', emoji: '☀️', hint: 'It shines in the sky' },
  { word: 'HAT', emoji: '🎩', hint: 'You wear it on your head' },
  { word: 'BUS', emoji: '🚌', hint: 'A big vehicle for many people' },
  { word: 'CUP', emoji: '☕', hint: 'You drink from it' },
  { word: 'BED', emoji: '🛏️', hint: 'You sleep in it' },
  { word: 'PIG', emoji: '🐷', hint: 'A pink farm animal' },
  { word: 'MAP', emoji: '🗺️', hint: 'Shows you where to go' },
  { word: 'PEN', emoji: '🖊️', hint: 'You write with it' },
  { word: 'FAN', emoji: '🌀', hint: 'Keeps you cool' },
  { word: 'JAM', emoji: '🫙', hint: 'Sweet spread for bread' },
  { word: 'FISH', emoji: '🐟', hint: 'It swims in water' },
  { word: 'FROG', emoji: '🐸', hint: 'It hops and says ribbit' },
  { word: 'STAR', emoji: '⭐', hint: 'It twinkles at night' },
  { word: 'MOON', emoji: '🌙', hint: 'It glows at night' },
  { word: 'TREE', emoji: '🌳', hint: 'It has leaves and branches' },
  { word: 'CAKE', emoji: '🎂', hint: 'A birthday treat' },
  { word: 'BIRD', emoji: '🐦', hint: 'It flies in the sky' },
  { word: 'BEAR', emoji: '🐻', hint: 'A big fluffy animal' },
];

// MATCH GAME DATA
export interface MatchItem {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

export const matchItems: MatchItem[] = [
  { id: 'apple-m', emoji: '🍎', name: 'Apple', category: 'Fruit' },
  { id: 'banana-m', emoji: '🍌', name: 'Banana', category: 'Fruit' },
  { id: 'grapes-m', emoji: '🍇', name: 'Grapes', category: 'Fruit' },
  { id: 'lion-m', emoji: '🦁', name: 'Lion', category: 'Animal' },
  { id: 'elephant-m', emoji: '🐘', name: 'Elephant', category: 'Animal' },
  { id: 'monkey-m', emoji: '🐒', name: 'Monkey', category: 'Animal' },
  { id: 'car-m', emoji: '🚗', name: 'Car', category: 'Vehicle' },
  { id: 'bus-m', emoji: '🚌', name: 'Bus', category: 'Vehicle' },
  { id: 'train-m', emoji: '🚂', name: 'Train', category: 'Vehicle' },
  { id: 'carrot-m', emoji: '🥕', name: 'Carrot', category: 'Vegetable' },
  { id: 'broccoli-m', emoji: '🥦', name: 'Broccoli', category: 'Vegetable' },
  { id: 'corn-m', emoji: '🌽', name: 'Corn', category: 'Vegetable' },
];

// MATH PROBLEMS
export interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  answer: number;
  options: number[];
}

export function generateMathProblem(difficulty: 'easy' | 'medium' | 'hard'): MathProblem {
  let num1: number, num2: number, operator: '+' | '-' | '×', answer: number;
  
  if (difficulty === 'easy') {
    operator = Math.random() > 0.5 ? '+' : '-';
    if (operator === '+') {
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 5) + 5;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
    }
  } else if (difficulty === 'medium') {
    operator = Math.random() > 0.5 ? '+' : '-';
    if (operator === '+') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 10;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
    }
  } else {
    const rand = Math.random();
    if (rand < 0.4) {
      operator = '+';
      num1 = Math.floor(Math.random() * 20) + 5;
      num2 = Math.floor(Math.random() * 20) + 5;
      answer = num1 + num2;
    } else if (rand < 0.8) {
      operator = '-';
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
    } else {
      operator = '×';
      num1 = Math.floor(Math.random() * 5) + 2;
      num2 = Math.floor(Math.random() * 5) + 2;
      answer = num1 * num2;
    }
  }

  const options = [answer];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = Math.random() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { num1, num2, operator, answer, options };
}

// COLORING BOOK TEMPLATES
export interface ColoringTemplate {
  id: string;
  name: string;
  emoji: string;
  category: string;
  paths: string[];
}

export const coloringTemplates: ColoringTemplate[] = [
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'Animals', paths: [] },
  { id: 'flower', name: 'Flower', emoji: '🌸', category: 'Nature', paths: [] },
  { id: 'star-col', name: 'Star', emoji: '⭐', category: 'Shapes', paths: [] },
  { id: 'heart-col', name: 'Heart', emoji: '❤️', category: 'Shapes', paths: [] },
  { id: 'house', name: 'House', emoji: '🏠', category: 'Objects', paths: [] },
  { id: 'rainbow-col', name: 'Rainbow', emoji: '🌈', category: 'Nature', paths: [] },
];

// ============================================================
// SKILLS & CAREERS DATA - Inclusive career-based categories
// ============================================================

export interface SkillItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  funFact: string;
  steps?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
  items: SkillItem[];
}

// 🍳 COOKING STUDIO
export const cookingStudioSkills: SkillItem[] = [
  { id: 'sandwich', name: 'Sandwich Making', emoji: '🥪', description: 'Stack layers to make lunch', funFact: 'The sandwich was invented by the Earl of Sandwich!', steps: ['Choose your bread', 'Add filling and veggies', 'Put the top slice on!'] },
  { id: 'baking', name: 'Cake Baking', emoji: '🎂', description: 'Bake delicious cakes', funFact: 'The biggest cake ever weighed 15000 pounds!', steps: ['Mix the batter', 'Pour into a pan', 'Bake and decorate!'] },
  { id: 'cupcake', name: 'Cupcake Decorating', emoji: '🧁', description: 'Decorate cupcakes beautifully', funFact: 'Cupcakes were invented in the 1800s!', steps: ['Bake the cupcakes', 'Add colorful frosting', 'Top with sprinkles!'] },
  { id: 'pizza', name: 'Pizza Making', emoji: '🍕', description: 'Create your own pizza', funFact: 'Pizza was first made in Naples Italy!', steps: ['Roll the dough', 'Spread the sauce', 'Add cheese and toppings!'] },
  { id: 'burger', name: 'Burger Building', emoji: '🍔', description: 'Build the perfect burger', funFact: 'Americans eat 50 billion burgers per year!', steps: ['Toast the bun', 'Add the patty', 'Stack veggies and sauce!'] },
  { id: 'juice', name: 'Juice Making', emoji: '🧃', description: 'Squeeze fresh fruit juice', funFact: 'Fresh juice has more vitamins than store juice!', steps: ['Pick ripe fruits', 'Cut them in half', 'Squeeze or blend!'] },
  { id: 'vegwash', name: 'Washing Vegetables', emoji: '🥬', description: 'Clean veggies properly', funFact: 'Washing removes dirt and keeps us healthy!', steps: ['Fill bowl with water', 'Gently scrub veggies', 'Rinse and dry!'] },
  { id: 'mixing', name: 'Mixing Ingredients', emoji: '🥣', description: 'Stir ingredients together', funFact: 'Mixing helps flavors blend together!', steps: ['Add ingredients to bowl', 'Stir round and round', 'Mix until smooth!'] },
  { id: 'safety', name: 'Kitchen Safety', emoji: '🧯', description: 'Learn to be safe in the kitchen', funFact: 'Always ask an adult before using the stove!', steps: ['Wash hands first', 'Use oven mitts', 'Clean up spills quickly!'] },
  { id: 'recipe', name: 'Following Recipes', emoji: '📖', description: 'Read and follow recipes', funFact: 'The oldest recipe is over 4000 years old!', steps: ['Read the whole recipe', 'Gather all ingredients', 'Follow step by step!'] },
  { id: 'salad', name: 'Salad Making', emoji: '🥗', description: 'Mix fresh veggies together', funFact: 'Eating colorful veggies is great for health!', steps: ['Wash the veggies', 'Tear the lettuce', 'Add dressing!'] },
  { id: 'smoothie', name: 'Smoothie Making', emoji: '🥤', description: 'Blend fruits into a drink', funFact: 'Smoothies are a delicious way to eat fruits!', steps: ['Pick your fruits', 'Add milk or yogurt', 'Blend it smooth!'] },
  { id: 'cookie', name: 'Cookie Baking', emoji: '🍪', description: 'Bake crunchy sweet cookies', funFact: 'Americans eat over 2 billion cookies a year!', steps: ['Mix butter and sugar', 'Add flour and chips', 'Scoop and bake!'] },
  { id: 'pancake', name: 'Pancake Flipping', emoji: '🥞', description: 'Make fluffy round pancakes', funFact: 'Pancakes have been made for over 30000 years!', steps: ['Mix the batter', 'Pour on griddle', 'Flip when bubbly!'] },
];

// 💄 BEAUTY & FASHION STUDIO
export const beautyFashionSkills: SkillItem[] = [
  { id: 'dressup', name: 'Dress Up', emoji: '👗', description: 'Choose and match outfits', funFact: 'Fashion designers sketch 100 designs before picking one!', steps: ['Pick a top', 'Choose matching bottom', 'Add accessories!'] },
  { id: 'hairstyle', name: 'Hair Styling', emoji: '💇', description: 'Create beautiful hairstyles', funFact: 'Hair grows about 6 inches per year!', steps: ['Brush your hair', 'Choose a style', 'Add clips or bands!'] },
  { id: 'facepainting', name: 'Face Painting', emoji: '🎭', description: 'Paint fun designs on faces', funFact: 'Face painting has been done for thousands of years!', steps: ['Pick a design', 'Apply base color', 'Add details and sparkles!'] },
  { id: 'nailart', name: 'Nail Art', emoji: '💅', description: 'Create colorful nail designs', funFact: 'Nail polish was invented in China 3000 BC!', steps: ['Apply base coat', 'Paint a color', 'Add fun designs!'] },
  { id: 'accessory', name: 'Accessory Matching', emoji: '👜', description: 'Pick the perfect accessories', funFact: 'Sunglasses were invented in China!', steps: ['Look at your outfit', 'Choose matching items', 'Add hat or bag!'] },
  { id: 'colorcoord', name: 'Color Coordination', emoji: '🎨', description: 'Learn which colors go together', funFact: 'Opposite colors on the color wheel look great together!', steps: ['Learn warm colors', 'Learn cool colors', 'Mix and match!'] },
  { id: 'fashiondesign', name: 'Fashion Design', emoji: '✏️', description: 'Design your own clothes', funFact: 'Fashion week happens 4 times a year!', steps: ['Sketch your design', 'Choose colors', 'Add details!'] },
  { id: 'jewelry', name: 'Jewelry Making', emoji: '📿', description: 'Create necklaces and bracelets', funFact: 'Beads were the first jewelry 75000 years ago!', steps: ['Choose your beads', 'Thread the string', 'Tie a knot!'] },
  { id: 'braiding', name: 'Braiding', emoji: '👧', description: 'Weave beautiful braids', funFact: 'Braiding is one of the oldest hairstyles!', steps: ['Divide hair into 3 parts', 'Cross right over middle', 'Repeat pattern!'] },
  { id: 'sewing', name: 'Basic Sewing', emoji: '🧵', description: 'Stitch fabric together', funFact: 'The sewing needle is one of the oldest tools!', steps: ['Thread the needle', 'Push through fabric', 'Pull and repeat!'] },
];

// 🔨 BUILDER WORKSHOP
export const builderWorkshopSkills: SkillItem[] = [
  { id: 'hammer', name: 'Using Hammer', emoji: '🔨', description: 'Drive nails with a hammer', funFact: 'Hammers have been used for over 3 million years!', steps: ['Hold the nail steady', 'Tap gently first', 'Then hammer firmly!'] },
  { id: 'screwdriver', name: 'Using Screwdriver', emoji: '🪛', description: 'Turn screws in and out', funFact: 'Screws are 4 times stronger than nails!', steps: ['Place screw in hole', 'Put screwdriver in slot', 'Turn to tighten!'] },
  { id: 'wrench', name: 'Using Wrench', emoji: '🔧', description: 'Tighten and loosen bolts', funFact: 'Wrenches come in hundreds of sizes!', steps: ['Find the right size', 'Fit onto the bolt', 'Turn to tighten!'] },
  { id: 'measuring', name: 'Measuring', emoji: '📏', description: 'Measure things accurately', funFact: 'Measure twice cut once is the golden rule!', steps: ['Place ruler at start', 'Read the number', 'Write it down!'] },
  { id: 'sawing', name: 'Safe Sawing', emoji: '🪚', description: 'Learn about cutting wood', funFact: 'Ancient Egyptians invented metal saws!', steps: ['Mark your cut line', 'Hold wood steady', 'Move saw back and forth!'] },
  { id: 'drilling', name: 'Drilling Holes', emoji: '🔩', description: 'Make holes with a drill', funFact: 'The first drills used a string and bow!', steps: ['Mark where to drill', 'Hold drill straight', 'Press gently!'] },
  { id: 'buildchair', name: 'Build a Chair', emoji: '🪑', description: 'Assemble a wooden chair', funFact: 'Chairs have been used for 5000 years!', steps: ['Gather all pieces', 'Connect the legs', 'Attach the seat!'] },
  { id: 'repairbike', name: 'Repair Bike', emoji: '🚲', description: 'Fix a bicycle', funFact: 'Bicycles have been around for 200 years!', steps: ['Find the problem', 'Get the right tool', 'Fix and test!'] },
  { id: 'toolmatch', name: 'Tool Matching', emoji: '🧰', description: 'Match tools to their jobs', funFact: 'A well-organized toolbox saves time!', steps: ['Look at the job', 'Find the right tool', 'Use it safely!'] },
  { id: 'fixtoy', name: 'Fix the Toy', emoji: '🧸', description: 'Repair broken toys', funFact: 'Fixing things helps reduce waste!', steps: ['Find what is broken', 'Get the right parts', 'Put it back together!'] },
  { id: 'birdhouse', name: 'Build Birdhouse', emoji: '🏠', description: 'Build a home for birds', funFact: 'Over 50 bird species use birdhouses!', steps: ['Cut wood pieces', 'Nail walls together', 'Add roof and hole!'] },
  { id: 'painting', name: 'Painting Wood', emoji: '🖌️', description: 'Paint and protect wood', funFact: 'Paint protects wood from weather!', steps: ['Sand the wood', 'Apply primer', 'Paint your color!'] },
];

// ⚙️ ENGINEERING LAB
export const engineeringLabSkills: SkillItem[] = [
  { id: 'bridge', name: 'Bridge Building', emoji: '🌉', description: 'Build a strong bridge', funFact: 'The longest bridge is 102 miles long!', steps: ['Plan the design', 'Build strong supports', 'Test with weight!'] },
  { id: 'house', name: 'House Building', emoji: '🏗️', description: 'Construct a model house', funFact: 'The first houses were built 10000 years ago!', steps: ['Build foundation', 'Add walls', 'Put on the roof!'] },
  { id: 'roads', name: 'Road Design', emoji: '🛣️', description: 'Design roads and paths', funFact: 'The longest road is over 30000 miles!', steps: ['Plan the route', 'Make it flat', 'Add lanes and signs!'] },
  { id: 'tower', name: 'Tower Challenge', emoji: '🗼', description: 'Build the tallest tower', funFact: 'The Eiffel Tower was meant to be temporary!', steps: ['Build a wide base', 'Stack carefully', 'Go as high as you can!'] },
  { id: 'gears', name: 'Gears & Machines', emoji: '⚙️', description: 'Learn how gears work', funFact: 'Gears transfer motion between parts!', steps: ['Connect two gears', 'Turn one gear', 'Watch the other spin!'] },
  { id: 'pulley', name: 'Pulley System', emoji: '🏗️', description: 'Lift heavy things easily', funFact: 'Pulleys make lifting much easier!', steps: ['Attach wheel up high', 'Thread rope through', 'Pull down to lift!'] },
  { id: 'crane', name: 'Crane Operator', emoji: '🏗️', description: 'Learn to operate a crane', funFact: 'Cranes can lift over 20000 tons!', steps: ['Move the crane arm', 'Lower the hook', 'Lift carefully!'] },
  { id: 'pipes', name: 'Pipe Connections', emoji: '🔧', description: 'Connect pipes together', funFact: 'Pipes carry water to every home!', steps: ['Choose the right pipe', 'Connect the ends', 'Test for leaks!'] },
  { id: 'circuit', name: 'Simple Circuits', emoji: '💡', description: 'Light up a bulb', funFact: 'Electricity moves at the speed of light!', steps: ['Connect battery', 'Attach wires', 'Watch bulb light!'] },
  { id: 'solar', name: 'Solar Power', emoji: '☀️', description: 'Learn about solar energy', funFact: 'The sun produces enough energy for millions of years!', steps: ['Place solar panel', 'Connect to device', 'Use sun power!'] },
  { id: 'windmill', name: 'Windmill Making', emoji: '🌬️', description: 'Build a spinning windmill', funFact: 'Windmills have been used for 1000 years!', steps: ['Cut 4 blades', 'Attach to center', 'Spin in the wind!'] },
  { id: 'robot', name: 'Robot Design', emoji: '🤖', description: 'Design your own robot', funFact: 'Robot means forced labor in Czech!', steps: ['Draw the body', 'Add arms and sensors', 'Give it a job!'] },
];

// 🏭 FACTORY SIMULATOR
export const factorySkills: SkillItem[] = [
  { id: 'toyfactory', name: 'Toy Factory', emoji: '🧸', description: 'Make toys on assembly line', funFact: 'The first toy factory opened in Germany!', steps: ['Get the parts', 'Assemble the toy', 'Pack in a box!'] },
  { id: 'chocolate', name: 'Chocolate Factory', emoji: '🍫', description: 'Make delicious chocolate', funFact: 'Chocolate comes from cocoa beans!', steps: ['Melt the chocolate', 'Pour into molds', 'Let it cool!'] },
  { id: 'cookie', name: 'Cookie Factory', emoji: '🍪', description: 'Bake cookies on production line', funFact: 'Factories can make 1000 cookies per minute!', steps: ['Mix the dough', 'Cut shapes', 'Bake and pack!'] },
  { id: 'juice', name: 'Juice Factory', emoji: '🧃', description: 'Make juice bottles', funFact: 'Juice factories squeeze millions of fruits!', steps: ['Wash the fruits', 'Squeeze the juice', 'Fill bottles!'] },
  { id: 'carfactory', name: 'Car Factory', emoji: '🚗', description: 'Assemble cars', funFact: 'One car has about 30000 parts!', steps: ['Build the frame', 'Add the engine', 'Attach wheels!'] },
  { id: 'furniture', name: 'Furniture Workshop', emoji: '🪑', description: 'Build furniture pieces', funFact: 'IKEA sells furniture in 50 countries!', steps: ['Cut the wood', 'Assemble parts', 'Add finishing!'] },
  { id: 'recycle', name: 'Recycling Center', emoji: '♻️', description: 'Sort and recycle materials', funFact: 'Recycling saves trees and energy!', steps: ['Sort by material', 'Clean the items', 'Process for reuse!'] },
  { id: 'assembly', name: 'Assembly Line', emoji: '⚙️', description: 'Work on assembly line', funFact: 'Henry Ford invented the assembly line!', steps: ['Wait for item', 'Add your part', 'Pass it on!'] },
  { id: 'packing', name: 'Package Sorting', emoji: '📦', description: 'Sort and pack boxes', funFact: 'Amazon ships 1.6 million packages per day!', steps: ['Check the label', 'Sort by destination', 'Stack neatly!'] },
  { id: 'quality', name: 'Quality Check', emoji: '✅', description: 'Inspect products for quality', funFact: 'Quality control keeps products safe!', steps: ['Look carefully', 'Check for defects', 'Approve or reject!'] },
];

// 🚗 VEHICLE GARAGE
export const vehicleGarageSkills: SkillItem[] = [
  { id: 'carrepair', name: 'Car Repair', emoji: '🔧', description: 'Fix car problems', funFact: 'A car has about 30000 parts!', steps: ['Find the problem', 'Get the right part', 'Fix and test!'] },
  { id: 'carwash', name: 'Car Wash', emoji: '🧽', description: 'Clean a car', funFact: 'The first car wash opened in 1914!', steps: ['Rinse with water', 'Scrub with soap', 'Dry and shine!'] },
  { id: 'paintcar', name: 'Paint Cars', emoji: '🎨', description: 'Give cars new colors', funFact: 'White is the most popular car color!', steps: ['Sand the surface', 'Apply primer', 'Spray paint evenly!'] },
  { id: 'tirechange', name: 'Change Tires', emoji: '🛞', description: 'Replace car tires', funFact: 'Tires were originally white!', steps: ['Loosen bolts', 'Jack up car', 'Swap the tire!'] },
  { id: 'fillfuel', name: 'Fill Fuel', emoji: '⛽', description: 'Fill up the gas tank', funFact: 'Cars can run on electricity too!', steps: ['Open the cap', 'Insert the nozzle', 'Fill up and pay!'] },
  { id: 'checkengine', name: 'Check Engine', emoji: '🔍', description: 'Inspect the engine', funFact: 'Engines burn fuel to make motion!', steps: ['Open the hood', 'Check oil level', 'Look for problems!'] },
  { id: 'buildbike', name: 'Build Bicycle', emoji: '🚲', description: 'Assemble a bicycle', funFact: 'Bicycles were invented in 1817!', steps: ['Attach wheels', 'Add handlebars', 'Connect pedals!'] },
  { id: 'raceprep', name: 'Race Preparation', emoji: '🏎️', description: 'Prepare car for racing', funFact: 'F1 cars can go over 230 mph!', steps: ['Check the tires', 'Fill the fuel', 'Test the brakes!'] },
  { id: 'buildcar', name: 'Build Your Car', emoji: '🚙', description: 'Design your dream car', funFact: 'Kids can design cars that become real!', steps: ['Choose the body', 'Pick the color', 'Add cool features!'] },
  { id: 'airplane', name: 'Airplane Parts', emoji: '✈️', description: 'Learn airplane parts', funFact: 'Wings create lift to fly!', steps: ['Learn about wings', 'Learn about engine', 'Learn about tail!'] },
];

// 🌱 GARDENING & FARMING
export const gardeningFarmingSkills: SkillItem[] = [
  { id: 'plantflowers', name: 'Plant Flowers', emoji: '🌸', description: 'Plant beautiful flowers', funFact: 'Sunflowers follow the sun!', steps: ['Dig a hole', 'Place the seed', 'Cover and water!'] },
  { id: 'growveggies', name: 'Grow Vegetables', emoji: '🥕', description: 'Grow your own vegetables', funFact: 'Carrots were originally purple!', steps: ['Prepare the soil', 'Plant seeds in rows', 'Water regularly!'] },
  { id: 'watering', name: 'Water Plants', emoji: '💧', description: 'Keep plants hydrated', funFact: 'Plants drink through their roots!', steps: ['Fill watering can', 'Pour at the base', 'Check soil moisture!'] },
  { id: 'harvest', name: 'Harvest Fruits', emoji: '🍎', description: 'Pick ripe fruits', funFact: 'Apples float because they are 25% air!', steps: ['Check if ripe', 'Gently twist off', 'Place in basket!'] },
  { id: 'feedanimals', name: 'Feed Animals', emoji: '🐔', description: 'Feed farm animals', funFact: 'Chickens can recognize 100 faces!', steps: ['Get the food', 'Call the animals', 'Fill their bowls!'] },
  { id: 'decorategarden', name: 'Decorate Garden', emoji: '🏡', description: 'Make garden beautiful', funFact: 'Gardens reduce stress!', steps: ['Plan the layout', 'Add decorations', 'Arrange plants!'] },
  { id: 'composting', name: 'Composting', emoji: '♻️', description: 'Turn scraps into soil', funFact: 'Compost feeds plants naturally!', steps: ['Collect scraps', 'Add to bin', 'Mix and wait!'] },
  { id: 'butterflygarden', name: 'Butterfly Garden', emoji: '🦋', description: 'Attract butterflies', funFact: 'Butterflies taste with their feet!', steps: ['Plant colorful flowers', 'Add water source', 'Watch them come!'] },
  { id: 'herbgarden', name: 'Herb Garden', emoji: '🌿', description: 'Grow cooking herbs', funFact: 'Basil and mint are easy to grow!', steps: ['Fill pots with soil', 'Plant herb seeds', 'Place in sun!'] },
  { id: 'treeplanting', name: 'Tree Planting', emoji: '🌳', description: 'Plant trees for nature', funFact: 'Trees produce oxygen we breathe!', steps: ['Dig deep hole', 'Place tree in', 'Fill and water!'] },
];

// 🏥 MEDICAL CLINIC
export const medicalClinicSkills: SkillItem[] = [
  { id: 'heartbeat', name: 'Check Heartbeat', emoji: '💓', description: 'Listen to the heart', funFact: 'Your heart beats 100000 times a day!', steps: ['Place stethoscope', 'Listen quietly', 'Count the beats!'] },
  { id: 'bandage', name: 'Apply Bandage', emoji: '🩹', description: 'Wrap injuries safely', funFact: 'Band-aids were invented in 1920!', steps: ['Clean the wound', 'Apply bandage', 'Secure gently!'] },
  { id: 'temperature', name: 'Check Temperature', emoji: '🌡️', description: 'Take body temperature', funFact: 'Normal temperature is 98.6°F!', steps: ['Get thermometer', 'Place under tongue', 'Read the number!'] },
  { id: 'dental', name: 'Dental Care', emoji: '🦷', description: 'Learn about teeth care', funFact: 'You have 32 adult teeth!', steps: ['Brush twice daily', 'Floss between teeth', 'Visit dentist!'] },
  { id: 'eyecheck', name: 'Eye Check-up', emoji: '👁️', description: 'Test your vision', funFact: 'Your eyes can see 10 million colors!', steps: ['Cover one eye', 'Read the letters', 'Test both eyes!'] },
  { id: 'healthy', name: 'Healthy Habits', emoji: '💪', description: 'Learn to stay healthy', funFact: 'Kids need 9-12 hours of sleep!', steps: ['Eat vegetables', 'Exercise daily', 'Sleep early!'] },
  { id: 'firstaid', name: 'First Aid', emoji: '🏥', description: 'Basic first aid skills', funFact: 'First aid can save lives!', steps: ['Stay calm', 'Get help', 'Apply basic care!'] },
  { id: 'handwash', name: 'Hand Washing', emoji: '🧼', description: 'Proper hand washing', funFact: 'Washing hands prevents illness!', steps: ['Wet your hands', 'Scrub with soap', 'Rinse and dry!'] },
  { id: 'xray', name: 'X-Ray Learning', emoji: '🩻', description: 'Learn about X-rays', funFact: 'X-rays can see inside your body!', steps: ['Position patient', 'Take the image', 'Examine bones!'] },
  { id: 'ambulance', name: 'Ambulance Helper', emoji: '🚑', description: 'Help in emergencies', funFact: 'Ambulances have been around since 1487!', steps: ['Call for help', 'Stay with patient', 'Guide to hospital!'] },
];

// 🎨 ART & DESIGN STUDIO
export const artDesignSkills: SkillItem[] = [
  { id: 'drawing', name: 'Drawing', emoji: '✏️', description: 'Create drawings', funFact: 'Leonardo da Vinci filled 13000 pages with drawings!', steps: ['Sketch outline', 'Add details', 'Shade carefully!'] },
  { id: 'painting', name: 'Painting', emoji: '🖼️', description: 'Paint beautiful pictures', funFact: 'The Mona Lisa took 4 years to paint!', steps: ['Prepare canvas', 'Mix colors', 'Paint your vision!'] },
  { id: 'pottery', name: 'Pottery', emoji: '🏺', description: 'Shape clay into art', funFact: 'Pottery is 20000 years old!', steps: ['Knead the clay', 'Shape on wheel', 'Fire in kiln!'] },
  { id: 'origami', name: 'Origami', emoji: '🦢', description: 'Fold paper into shapes', funFact: 'Origami started in Japan!', steps: ['Get square paper', 'Follow the folds', 'Create amazing shapes!'] },
  { id: 'crafts', name: 'Craft Making', emoji: '✂️', description: 'Create fun crafts', funFact: 'Crafting boosts creativity!', steps: ['Gather materials', 'Cut and shape', 'Glue together!'] },
  { id: 'stickers', name: 'Sticker Design', emoji: '🏷️', description: 'Design your own stickers', funFact: 'Stickers were invented in 1935!', steps: ['Draw your design', 'Color it in', 'Cut it out!'] },
  { id: 'poster', name: 'Poster Creation', emoji: '📃', description: 'Make colorful posters', funFact: 'Posters are great for messages!', steps: ['Plan layout', 'Add images', 'Write text!'] },
  { id: 'sculpting', name: 'Sculpting', emoji: '🗿', description: 'Sculpt 3D art', funFact: 'Michelangelo carved David from marble!', steps: ['Get clay or dough', 'Shape your idea', 'Add details!'] },
  { id: 'collage', name: 'Collage Art', emoji: '🖼️', description: 'Create picture collages', funFact: 'Picasso made famous collages!', steps: ['Collect pictures', 'Arrange on paper', 'Glue down!'] },
  { id: 'tiedye', name: 'Tie-Dye', emoji: '🌈', description: 'Make colorful patterns', funFact: 'Tie-dye is 6000 years old!', steps: ['Fold the fabric', 'Apply dye', 'Rinse and reveal!'] },
];

// 💻 CODING & ROBOTICS
export const codingRoboticsSkills: SkillItem[] = [
  { id: 'basiccode', name: 'Basic Coding', emoji: '💻', description: 'Write simple code', funFact: 'Ada Lovelace was the first programmer in 1843!', steps: ['Think of a goal', 'Write step by step', 'Test your code!'] },
  { id: 'robotcontrol', name: 'Control Robots', emoji: '🤖', description: 'Command a robot', funFact: 'Robots can explore Mars!', steps: ['Give instructions', 'Watch it move', 'Adjust commands!'] },
  { id: 'buildrobot', name: 'Build Robots', emoji: '🦾', description: 'Assemble robot parts', funFact: 'Robot comes from a Czech word!', steps: ['Connect body parts', 'Add motors', 'Program brain!'] },
  { id: 'logic', name: 'Logic Puzzles', emoji: '🧩', description: 'Solve coding puzzles', funFact: 'Coding is like solving puzzles!', steps: ['Read the problem', 'Find the pattern', 'Apply the solution!'] },
  { id: 'animation', name: 'Create Animations', emoji: '🎬', description: 'Make things move', funFact: 'Animation uses 24 pictures per second!', steps: ['Draw frames', 'Set timing', 'Play animation!'] },
  { id: 'movement', name: 'Program Movement', emoji: '🎮', description: 'Make characters move', funFact: 'Video game characters use code to move!', steps: ['Set start position', 'Code direction', 'Add speed!'] },
  { id: 'loops', name: 'Using Loops', emoji: '🔁', description: 'Make code repeat', funFact: 'Loops save time in coding!', steps: ['Find repeating action', 'Create the loop', 'Set how many times!'] },
  { id: 'debugging', name: 'Bug Fixing', emoji: '🐛', description: 'Find and fix errors', funFact: 'The first bug was an actual moth!', steps: ['Find the problem', 'Understand why', 'Fix the code!'] },
  { id: 'gamedesign', name: 'Game Design', emoji: '🎮', description: 'Design simple games', funFact: 'The first video game was Pong!', steps: ['Create characters', 'Design levels', 'Add challenges!'] },
  { id: 'appinventor', name: 'App Invention', emoji: '📱', description: 'Invent simple apps', funFact: 'There are over 2 million apps!', steps: ['Decide app purpose', 'Design screens', 'Add buttons!'] },
];

// 🔬 SCIENCE LAB
export const scienceLabSkills: SkillItem[] = [
  { id: 'volcano', name: 'Volcano Experiment', emoji: '🌋', description: 'Make a volcano erupt', funFact: 'Real lava is over 2000 degrees!', steps: ['Build volcano shape', 'Add baking soda', 'Pour vinegar!'] },
  { id: 'fossil', name: 'Fossil Digging', emoji: '🦕', description: 'Discover fossils', funFact: 'Oldest fossils are 3.5 billion years old!', steps: ['Brush away dirt', 'Be very gentle', 'Identify the fossil!'] },
  { id: 'microscope', name: 'Microscope Explorer', emoji: '🔬', description: 'See tiny things big', funFact: 'Microscopes magnify 2000 times!', steps: ['Place item on slide', 'Look through lens', 'Adjust focus!'] },
  { id: 'weather', name: 'Weather Station', emoji: '🌤️', description: 'Track the weather', funFact: 'Lightning strikes 100 times per second!', steps: ['Check thermometer', 'Look at clouds', 'Record data!'] },
  { id: 'planets', name: 'Solar System', emoji: '🪐', description: 'Explore planets', funFact: '1300 Earths fit inside Jupiter!', steps: ['Learn planet order', 'Study each planet', 'Make a model!'] },
  { id: 'static', name: 'Static Electricity', emoji: '⚡', description: 'Create static charge', funFact: 'Lightning is giant static electricity!', steps: ['Rub balloon on hair', 'Hold near paper bits', 'Watch them jump!'] },
  { id: 'telescope', name: 'Star Gazing', emoji: '🔭', description: 'Look at stars', funFact: 'You can see 5000 stars with your eyes!', steps: ['Go outside at night', 'Look at the sky', 'Find constellations!'] },
  { id: 'chemistry', name: 'Simple Chemistry', emoji: '🧪', description: 'Mix safe chemicals', funFact: 'Everything is made of chemicals!', steps: ['Measure carefully', 'Mix ingredients', 'Observe reaction!'] },
  { id: 'magnets', name: 'Magnet Science', emoji: '🧲', description: 'Explore magnets', funFact: 'The Earth is a giant magnet!', steps: ['Get two magnets', 'Try to connect them', 'Find magnetic items!'] },
  { id: 'plants', name: 'Plant Science', emoji: '🌱', description: 'Study how plants grow', funFact: 'Plants make their own food!', steps: ['Plant a seed', 'Water daily', 'Watch it grow!'] },
];

// ALL CAREER CATEGORIES
export const careerCategories: SkillCategory[] = [
  { 
    id: 'cooking', 
    name: 'Cooking Studio', 
    emoji: '🍳', 
    color: '#ef4444', 
    gradient: 'from-red-400 to-orange-400',
    description: 'Learn to cook yummy food!',
    items: cookingStudioSkills 
  },
  { 
    id: 'beauty', 
    name: 'Beauty & Fashion', 
    emoji: '💄', 
    color: '#ec4899', 
    gradient: 'from-pink-400 to-fuchsia-400',
    description: 'Explore style and creativity!',
    items: beautyFashionSkills 
  },
  { 
    id: 'builder', 
    name: 'Builder Workshop', 
    emoji: '🔨', 
    color: '#f97316', 
    gradient: 'from-orange-400 to-amber-400',
    description: 'Build and fix things!',
    items: builderWorkshopSkills 
  },
  { 
    id: 'engineer', 
    name: 'Engineering Lab', 
    emoji: '⚙️', 
    color: '#3b82f6', 
    gradient: 'from-blue-400 to-cyan-400',
    description: 'Design and construct!',
    items: engineeringLabSkills 
  },
  { 
    id: 'factory', 
    name: 'Factory Simulator', 
    emoji: '🏭', 
    color: '#6b7280', 
    gradient: 'from-gray-400 to-slate-400',
    description: 'Run your own factory!',
    items: factorySkills 
  },
  { 
    id: 'garage', 
    name: 'Vehicle Garage', 
    emoji: '🚗', 
    color: '#ef4444', 
    gradient: 'from-red-400 to-rose-400',
    description: 'Fix and build vehicles!',
    items: vehicleGarageSkills 
  },
  { 
    id: 'garden', 
    name: 'Garden & Farm', 
    emoji: '🌱', 
    color: '#22c55e', 
    gradient: 'from-green-400 to-emerald-400',
    description: 'Grow plants and help animals!',
    items: gardeningFarmingSkills 
  },
  { 
    id: 'medical', 
    name: 'Medical Clinic', 
    emoji: '🏥', 
    color: '#06b6d4', 
    gradient: 'from-cyan-400 to-teal-400',
    description: 'Learn about health!',
    items: medicalClinicSkills 
  },
  { 
    id: 'art', 
    name: 'Art & Design', 
    emoji: '🎨', 
    color: '#a855f7', 
    gradient: 'from-purple-400 to-violet-400',
    description: 'Create beautiful art!',
    items: artDesignSkills 
  },
  { 
    id: 'coding', 
    name: 'Coding & Robotics', 
    emoji: '💻', 
    color: '#14b8a6', 
    gradient: 'from-teal-400 to-cyan-400',
    description: 'Program and build robots!',
    items: codingRoboticsSkills 
  },
  { 
    id: 'science', 
    name: 'Science Lab', 
    emoji: '🔬', 
    color: '#8b5cf6', 
    gradient: 'from-violet-400 to-purple-400',
    description: 'Discover and experiment!',
    items: scienceLabSkills 
  },
];

// GAME MODE DEFINITIONS
export interface GameMode {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
}

export const gameModes: GameMode[] = [
  { id: 'learn', name: 'Learn', emoji: '📚', description: 'Explore letters, numbers & more!', color: '#4fc3f7', gradient: 'from-blue-400 to-cyan-400' },
  { id: 'quiz', name: 'Quiz', emoji: '❓', description: 'Test what you know!', color: '#ab47bc', gradient: 'from-purple-400 to-pink-400' },
  { id: 'memory', name: 'Memory', emoji: '🧠', description: 'Match the pairs!', color: '#66bb6a', gradient: 'from-green-400 to-emerald-400' },
  { id: 'match', name: 'Match', emoji: '🎯', description: 'Sort items by category!', color: '#ffa726', gradient: 'from-orange-400 to-yellow-400' },
  { id: 'math', name: 'Math', emoji: '🧮', description: 'Fun with numbers!', color: '#ef5350', gradient: 'from-red-400 to-pink-400' },
  { id: 'wordbuilder', name: 'Words', emoji: '📝', description: 'Build words letter by letter!', color: '#29b6f6', gradient: 'from-sky-400 to-blue-400' },
  { id: 'coloring', name: 'Coloring', emoji: '🎨', description: 'Color beautiful pictures!', color: '#f06292', gradient: 'from-pink-400 to-rose-400' },
  { id: 'puzzle', name: 'Puzzle World', emoji: '🧩', description: 'Solve fun puzzles!', color: '#7e57c2', gradient: 'from-violet-400 to-purple-400' },
  { id: 'skills', name: 'Skills', emoji: '🌟', description: 'Learn fun real-world skills!', color: '#f59e0b', gradient: 'from-amber-400 to-yellow-400' },
];

// LEARN CATEGORIES
export interface LearnCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  items: LearnItem[];
}

export const learnCategories: LearnCategory[] = [
  { id: 'alphabet', name: 'Alphabet', emoji: '🔤', color: '#4fc3f7', gradient: 'from-blue-400 to-cyan-400', items: alphabetData },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', color: '#ff7043', gradient: 'from-orange-400 to-red-400', items: numbersData },
  { id: 'animals', name: 'Animals', emoji: '🦁', color: '#66bb6a', gradient: 'from-green-400 to-emerald-400', items: animalsData },
  { id: 'fruits', name: 'Fruits', emoji: '🍎', color: '#ef5350', gradient: 'from-red-400 to-pink-400', items: fruitsData },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥕', color: '#8bc34a', gradient: 'from-lime-400 to-green-400', items: vegetablesData },
  { id: 'shapes', name: 'Shapes', emoji: '🔺', color: '#ab47bc', gradient: 'from-purple-400 to-violet-400', items: shapesData },
  { id: 'colors', name: 'Colors', emoji: '🌈', color: '#ffa726', gradient: 'from-yellow-400 to-orange-400', items: colorsData },
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', color: '#29b6f6', gradient: 'from-sky-400 to-blue-400', items: vehiclesData },
  { id: 'birds', name: 'Birds', emoji: '🦅', color: '#f06292', gradient: 'from-pink-400 to-rose-400', items: birdsData },
  { id: 'body', name: 'Body Parts', emoji: '🧠', color: '#7e57c2', gradient: 'from-violet-400 to-purple-400', items: bodyPartsData },
];

// AVATAR OPTIONS
export const avatarOptions = [
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
];

// ACHIEVEMENT BADGES
export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number;
  type: 'quizzes' | 'stars' | 'streak' | 'lessons' | 'games';
}

export const achievements: Achievement[] = [
  { id: 'first-quiz', name: 'Quiz Star', emoji: '⭐', description: 'Complete your first quiz!', requirement: 1, type: 'quizzes' },
  { id: 'five-quizzes', name: 'Quiz Master', emoji: '🏆', description: 'Complete 5 quizzes!', requirement: 5, type: 'quizzes' },
  { id: 'ten-stars', name: 'Star Collector', emoji: '🌟', description: 'Earn 10 stars!', requirement: 10, type: 'stars' },
  { id: 'fifty-stars', name: 'Superstar', emoji: '💫', description: 'Earn 50 stars!', requirement: 50, type: 'stars' },
  { id: 'three-day', name: 'Consistent Learner', emoji: '🔥', description: '3-day streak!', requirement: 3, type: 'streak' },
  { id: 'seven-day', name: 'Week Warrior', emoji: '🎖️', description: '7-day streak!', requirement: 7, type: 'streak' },
  { id: 'five-lessons', name: 'Explorer', emoji: '🗺️', description: 'Complete 5 lessons!', requirement: 5, type: 'lessons' },
  { id: 'twenty-games', name: 'Game Champion', emoji: '👑', description: 'Play 20 games!', requirement: 20, type: 'games' },
];

// DAILY CHALLENGES
export interface DailyChallenge {
  id: string;
  title: string;
  emoji: string;
  gameMode: string;
  reward: number;
}

export const dailyChallenges: DailyChallenge[] = [
  { id: 'dc1', title: 'Answer 5 quiz questions', emoji: '❓', gameMode: 'quiz', reward: 5 },
  { id: 'dc2', title: 'Complete a memory game', emoji: '🧠', gameMode: 'memory', reward: 3 },
  { id: 'dc3', title: 'Build 3 words', emoji: '📝', gameMode: 'wordbuilder', reward: 4 },
  { id: 'dc4', title: 'Solve 5 math problems', emoji: '🧮', gameMode: 'math', reward: 5 },
  { id: 'dc5', title: 'Learn about 5 animals', emoji: '🦁', gameMode: 'learn', reward: 3 },
  { id: 'dc6', title: 'Match 6 items', emoji: '🎯', gameMode: 'match', reward: 4 },
  { id: 'dc7', title: 'Color a picture', emoji: '🎨', gameMode: 'coloring', reward: 3 },
];

// ENCOURAGEMENT MESSAGES
export const encouragementMessages = {
  correct: [
    '🎉 Amazing!', '⭐ Wonderful!', '🌟 Great job!', '🎊 You\'re a star!',
    '👏 Fantastic!', '🏆 Super!', '💪 You did it!', '🥳 Hooray!',
    '✨ Brilliant!', '🎯 Perfect!', '🦸 Hero!', '🚀 Out of this world!',
  ],
  incorrect: [
    '💪 Try again!', '🤔 Almost there!', '🌱 Keep trying!', '💖 You can do it!',
    '🎈 One more try!', '🌈 Don\'t give up!', '🤗 So close!', '⭐ Give it another go!',
  ],
  celebration: [
    '🎉🎊🎉 AMAZING JOB! 🎉🎊🎉',
    '⭐🌟💫 YOU ARE A SUPERSTAR! ⭐🌟💫',
    '🏆👑🏆 CHAMPION! 🏆👑🏆',
    '🚀✨🚀 INCREDIBLE! 🚀✨🚀',
  ],
};