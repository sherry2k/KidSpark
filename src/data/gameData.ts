// ============================================================
// GAME DATA - All content for the educational game
// ============================================================

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
  { id: 'a', name: 'A - Apple', emoji: '🍎', category: 'alphabet', funFact: "A is the first letter and makes the 'ah' sound!" },
  { id: 'b', name: 'B - Ball', emoji: '⚽', category: 'alphabet', funFact: "B makes a 'buh' sound like in ball and bear!" },
  { id: 'c', name: 'C - Cat', emoji: '🐱', category: 'alphabet', funFact: "C can sound like 'k' in cat or 's' in city!" },
  { id: 'd', name: 'D - Dog', emoji: '🐶', category: 'alphabet', funFact: "D makes a 'duh' sound like in dog and dance!" },
  { id: 'e', name: 'E - Elephant', emoji: '🐘', category: 'alphabet', funFact: 'E is the most common letter in English!' },
  { id: 'f', name: 'F - Fish', emoji: '🐟', category: 'alphabet', funFact: "F makes a 'fff' sound by blowing air!" },
  { id: 'g', name: 'G - Grapes', emoji: '🍇', category: 'alphabet', funFact: "G can be hard like in 'go' or soft like in 'giraffe'!" },
  { id: 'h', name: 'H - Hat', emoji: '🎩', category: 'alphabet', funFact: "H makes a breathy 'huh' sound!" },
  { id: 'i', name: 'I - Ice Cream', emoji: '🍦', category: 'alphabet', funFact: "I can say its name like in 'ice' or say 'ih' like in 'igloo'!" },
  // Was Jellyfish 🪼 (2023 emoji, blank box on older Android). Swapped for a safe, old emoji.
  { id: 'j', name: 'J - Jacket', emoji: '🧥', category: 'alphabet', funFact: "J makes a 'juh' sound like in jump and joy!" },
  // Was Kite 🪁 (2019 emoji, too new for some devices). Swapped for a safe, old emoji.
  { id: 'k', name: 'K - Key', emoji: '🔑', category: 'alphabet', funFact: 'K makes the same sound as hard C!' },
  { id: 'l', name: 'L - Lion', emoji: '🦁', category: 'alphabet', funFact: "L makes a smooth 'lll' sound with your tongue!" },
  { id: 'm', name: 'M - Moon', emoji: '🌙', category: 'alphabet', funFact: "M makes a humming 'mmm' sound!" },
  // Was Nest 🪺 (2023 emoji, too new). Swapped for Nose - and the fun fact already talked about noses!
  { id: 'n', name: 'N - Nose', emoji: '👃', category: 'alphabet', funFact: "N makes a 'nnn' sound through your nose!" },
  { id: 'o', name: 'O - Orange', emoji: '🍊', category: 'alphabet', funFact: 'O is shaped like a circle and can say its name!' },
  { id: 'p', name: 'P - Penguin', emoji: '🐧', category: 'alphabet', funFact: "P makes a popping 'puh' sound!" },
  { id: 'q', name: 'Q - Queen', emoji: '👸', category: 'alphabet', funFact: 'Q almost always has U right after it!' },
  { id: 'r', name: 'R - Rainbow', emoji: '🌈', category: 'alphabet', funFact: "R makes a 'rrr' sound at the back of your mouth!" },
  { id: 's', name: 'S - Star', emoji: '⭐', category: 'alphabet', funFact: "S makes a hissing 'sss' sound like a snake!" },
  { id: 't', name: 'T - Tree', emoji: '🌳', category: 'alphabet', funFact: "T makes a 'tuh' sound with the tip of your tongue!" },
  { id: 'u', name: 'U - Umbrella', emoji: '☂️', category: 'alphabet', funFact: "U can say 'uh' like in umbrella or its name like in 'unicorn'!" },
  { id: 'v', name: 'V - Violin', emoji: '🎻', category: 'alphabet', funFact: 'V makes a buzzing "vvv" sound!' },
  { id: 'w', name: 'W - Watermelon', emoji: '🍉', category: 'alphabet', funFact: "W is called 'double-u' because it looks like two U's!" },
  { id: 'x', name: 'X - Xylophone', emoji: '🎵', category: 'alphabet', funFact: "X usually makes a 'ks' sound like in 'fox'!" },
  { id: 'y', name: 'Y - Yacht', emoji: '⛵', category: 'alphabet', funFact: 'Y can be a consonant or a vowel!' },
  { id: 'z', name: 'Z - Zebra', emoji: '🦓', category: 'alphabet', funFact: 'Z is the last letter and makes a "zzz" sound!' },
];

// NUMBERS DATA — LearnIcon draws these as text from the id (num-N), so the
// emoji field below is only a harmless fallback and is never actually shown.
export const numbersData: LearnItem[] = [
  { id: 'num-0', name: '0 - Zero', emoji: '0️⃣', category: 'numbers', funFact: 'Zero means nothing but is very important!' },
  { id: 'num-1', name: '1 - One', emoji: '1️⃣', category: 'numbers', funFact: 'One is the loneliest number - but also the first!' },
  { id: 'num-2', name: '2 - Two', emoji: '2️⃣', category: 'numbers', funFact: 'Two eyes two ears two hands - we have pairs!' },
  { id: 'num-3', name: '3 - Three', emoji: '3️⃣', category: 'numbers', funFact: 'Three is a magic number in many stories!' },
  { id: 'num-4', name: '4 - Four', emoji: '4️⃣', category: 'numbers', funFact: 'Four seasons: spring summer fall and winter!' },
  { id: 'num-5', name: '5 - Five', emoji: '5️⃣', category: 'numbers', funFact: 'You have five fingers on each hand!' },
  { id: 'num-6', name: '6 - Six', emoji: '6️⃣', category: 'numbers', funFact: 'Insects have six legs!' },
  { id: 'num-7', name: '7 - Seven', emoji: '7️⃣', category: 'numbers', funFact: 'Seven days make one week!' },
  { id: 'num-8', name: '8 - Eight', emoji: '8️⃣', category: 'numbers', funFact: 'Spiders have eight legs!' },
  { id: 'num-9', name: '9 - Nine', emoji: '9️⃣', category: 'numbers', funFact: 'Cats are said to have nine lives!' },
  { id: 'num-10', name: '10 - Ten', emoji: '🔟', category: 'numbers', funFact: 'Ten toes on your feet!' },
  { id: 'num-11', name: '11 - Eleven', emoji: '1️⃣1️⃣', category: 'numbers', funFact: 'Eleven is the first double-digit prime number!' },
  { id: 'num-12', name: '12 - Twelve', emoji: '1️⃣2️⃣', category: 'numbers', funFact: 'Twelve months make one year!' },
  { id: 'num-13', name: '13 - Thirteen', emoji: '1️⃣3️⃣', category: 'numbers', funFact: "A baker's dozen is 13!" },
  { id: 'num-14', name: '14 - Fourteen', emoji: '1️⃣4️⃣', category: 'numbers', funFact: 'Fourteen days make two weeks!' },
  { id: 'num-15', name: '15 - Fifteen', emoji: '1️⃣5️⃣', category: 'numbers', funFact: 'A quarter hour is 15 minutes!' },
  { id: 'num-16', name: '16 - Sixteen', emoji: '1️⃣6️⃣', category: 'numbers', funFact: 'Sixteen ounces make one pound!' },
  { id: 'num-17', name: '17 - Seventeen', emoji: '1️⃣7️⃣', category: 'numbers', funFact: 'Seventeen is a lucky prime number!' },
  { id: 'num-18', name: '18 - Eighteen', emoji: '1️⃣8️⃣', category: 'numbers', funFact: 'A golf course has 18 holes!' },
  { id: 'num-19', name: '19 - Nineteen', emoji: '1️⃣9️⃣', category: 'numbers', funFact: 'Nineteen is the last teen number!' },
  { id: 'num-20', name: '20 - Twenty', emoji: '2️⃣0️⃣', category: 'numbers', funFact: 'You have 20 baby teeth!' },
  { id: 'num-50', name: '50 - Fifty', emoji: '5️⃣0️⃣', category: 'numbers', funFact: 'Half of 100 is 50!' },
  { id: 'num-100', name: '100 - Hundred', emoji: '💯', category: 'numbers', funFact: 'One hundred pennies make one dollar!' },
];

// ANIMALS DATA
export const animalsData: LearnItem[] = [
  { id: 'lion', name: 'Lion', emoji: '🦁', category: 'animals', funFact: 'Lions are called the King of the Jungle!' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', category: 'animals', funFact: 'Elephants never forget and are very smart!' },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', category: 'animals', funFact: 'Giraffes are the tallest animals on Earth!' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒', category: 'animals', funFact: 'Monkeys love bananas and are very playful!' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', category: 'animals', funFact: "Penguins can't fly but are amazing swimmers!" },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', category: 'animals', funFact: 'Dolphins are one of the smartest animals!' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', category: 'animals', funFact: 'Rabbits love carrots and can hop very fast!' },
  { id: 'bear', name: 'Bear', emoji: '🐻', category: 'animals', funFact: 'Bears sleep all winter in a deep sleep called hibernation!' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', category: 'animals', funFact: 'Every tiger has unique stripes like fingerprints!' },
  { id: 'panda', name: 'Panda', emoji: '🐼', category: 'animals', funFact: 'Pandas eat bamboo for up to 12 hours a day!' },
  { id: 'koala', name: 'Koala', emoji: '🐨', category: 'animals', funFact: 'Koalas sleep up to 22 hours a day!' },
  { id: 'fox', name: 'Fox', emoji: '🦊', category: 'animals', funFact: 'Foxes are very clever and can hear mice underground!' },
  { id: 'dog', name: 'Dog', emoji: '🐶', category: 'animals', funFact: "Dogs are humans' best friends for over 15000 years!" },
  { id: 'cat', name: 'Cat', emoji: '🐱', category: 'animals', funFact: 'Cats can see in the dark and always land on their feet!' },
  { id: 'owl', name: 'Owl', emoji: '🦉', category: 'animals', funFact: 'Owls can turn their heads almost all the way around!' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'animals', funFact: 'Butterflies taste with their feet!' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', category: 'animals', funFact: 'No two zebras have the same stripe pattern!' },
  { id: 'hippo', name: 'Hippopotamus', emoji: '🦛', category: 'animals', funFact: 'Hippos can hold their breath for 5 minutes underwater!' },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘', category: 'animals', funFact: 'Baby kangaroos are called joeys and live in pouches!' },
  { id: 'crocodile', name: 'Crocodile', emoji: '🐊', category: 'animals', funFact: 'Crocodiles have been around since dinosaur times!' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', category: 'animals', funFact: 'Some turtles can live over 100 years!' },
  { id: 'snake', name: 'Snake', emoji: '🐍', category: 'animals', funFact: 'Snakes smell with their tongues!' },
  { id: 'frog', name: 'Frog', emoji: '🐸', category: 'animals', funFact: 'Frogs can jump 20 times their body length!' },
  { id: 'shark', name: 'Shark', emoji: '🦈', category: 'animals', funFact: 'Sharks have been around for 400 million years!' },
  { id: 'whale', name: 'Whale', emoji: '🐋', category: 'animals', funFact: 'Blue whales are the largest animals ever!' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', category: 'animals', funFact: 'Octopuses have three hearts and blue blood!' },
  { id: 'bee', name: 'Bee', emoji: '🐝', category: 'animals', funFact: 'Bees do a special dance to tell others where flowers are!' },
  { id: 'ant', name: 'Ant', emoji: '🐜', category: 'animals', funFact: 'Ants can carry 50 times their own body weight!' },
  { id: 'horse', name: 'Horse', emoji: '🐴', category: 'animals', funFact: 'Horses can sleep standing up!' },
  { id: 'cow', name: 'Cow', emoji: '🐄', category: 'animals', funFact: 'Cows have best friends and get stressed when separated!' },
  { id: 'pig', name: 'Pig', emoji: '🐷', category: 'animals', funFact: 'Pigs are smarter than dogs and very clean animals!' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', category: 'animals', funFact: 'Sheep can recognize up to 50 different faces!' },
  { id: 'goat', name: 'Goat', emoji: '🐐', category: 'animals', funFact: 'Goats have rectangular pupils in their eyes!' },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', category: 'animals', funFact: 'Chickens can remember over 100 different faces!' },
  { id: 'duck', name: 'Duck', emoji: '🦆', category: 'animals', funFact: "Ducks' quacks don't echo and nobody knows why!" },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', category: 'animals', funFact: 'Mice can squeeze through tiny spaces the size of a pencil!' },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', category: 'animals', funFact: 'Hamsters can run up to 8 miles a night on their wheel!' },
  { id: 'deer', name: 'Deer', emoji: '🦌', category: 'animals', funFact: 'Male deer grow new antlers every year!' },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️', category: 'animals', funFact: 'Squirrels plant thousands of trees by forgetting where they buried nuts!' },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', category: 'animals', funFact: 'Hedgehogs have about 5000 spines on their back!' },
];

// FRUITS DATA
// Dropped from the Airtable set: Pomegranate, Fig, Papaya, Passion Fruit,
// Plum, Guava, Apricot — none of these has an accurate emoji in Unicode
// (several were showing an olive, a heart, or duplicating another fruit's
// picture). Everything kept below has its own correct, unique picture.
export const fruitsData: LearnItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fruits', funFact: 'An apple a day keeps the doctor away!', color: '#ef4444' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fruits', funFact: 'Bananas are great for energy and have no fat!', color: '#eab308' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'fruits', funFact: 'Grapes can be red green or purple!', color: '#a855f7' },
  { id: 'orange', name: 'Orange', emoji: '🍊', category: 'fruits', funFact: 'Oranges are full of vitamin C to keep you healthy!', color: '#f97316' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'fruits', funFact: 'Strawberries are the only fruit with seeds on the outside!', color: '#ef4444' },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'fruits', funFact: 'Watermelons are 92% water - perfect for summer!', color: '#22c55e' },
  { id: 'peach', name: 'Peach', emoji: '🍑', category: 'fruits', funFact: 'Peaches are fuzzy on the outside and sweet inside!', color: '#fb923c' },
  { id: 'cherry', name: 'Cherry', emoji: '🍒', category: 'fruits', funFact: 'Cherries always grow in pairs!', color: '#dc2626' },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', category: 'fruits', funFact: 'It takes 2-3 years to grow one pineapple!', color: '#eab308' },
  { id: 'mango', name: 'Mango', emoji: '🥭', category: 'fruits', funFact: 'Mango is called the King of Fruits!', color: '#f97316' },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'fruits', funFact: 'Kiwis have more vitamin C than oranges!', color: '#22c55e' },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', category: 'fruits', funFact: 'Lemons can power a small light bulb!', color: '#fde047' },
  { id: 'coconut', name: 'Coconut', emoji: '🥥', category: 'fruits', funFact: 'Coconuts can float in the ocean for months!', color: '#a16207' },
  { id: 'pear', name: 'Pear', emoji: '🍐', category: 'fruits', funFact: 'Pears ripen better off the tree than on it!', color: '#84cc16' },
  { id: 'blueberry', name: 'Blueberry', emoji: '🫐', category: 'fruits', funFact: 'Blueberries are one of the healthiest foods!', color: '#3b82f6' },
  { id: 'melon', name: 'Melon', emoji: '🍈', category: 'fruits', funFact: 'Melons are related to cucumbers!', color: '#86efac' },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'fruits', funFact: 'Avocados are actually a fruit not a vegetable!', color: '#22c55e' },
  { id: 'dragonfruit', name: 'Dragon Fruit', emoji: '🐉', category: 'fruits', funFact: 'Dragon fruit comes from a cactus!', color: '#ec4899' },
];

// VEGETABLES DATA
// Dropped: Lettuce, Spinach, Cabbage, Celery, Asparagus, Cauliflower,
// Artichoke (Unicode only has ONE leafy-greens emoji, so these 7 were all
// showing the exact same picture), Radish and Beetroot (both were showing
// an olive), and Zucchini/Leek (duplicating Cucumber/Onion). Everything
// kept below has its own correct, unique picture.
export const vegetablesData: LearnItem[] = [
  { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'vegetables', funFact: 'Carrots help you see better in the dark!', color: '#f97316' },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'vegetables', funFact: 'Broccoli looks like tiny trees you can eat!', color: '#22c55e' },
  { id: 'corn', name: 'Corn', emoji: '🌽', category: 'vegetables', funFact: 'Corn can be popped into delicious popcorn!', color: '#eab308' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'vegetables', funFact: 'Tomatoes are actually fruits not vegetables!', color: '#ef4444' },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'vegetables', funFact: 'Potatoes were the first vegetable grown in space!', color: '#a16207' },
  { id: 'pepper', name: 'Bell Pepper', emoji: '🫑', category: 'vegetables', funFact: 'Bell peppers come in green red yellow and orange!', color: '#22c55e' },
  { id: 'eggplant', name: 'Eggplant', emoji: '🍆', category: 'vegetables', funFact: 'Eggplants are actually berries!', color: '#7c3aed' },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'vegetables', funFact: 'Cucumbers are 96% water - even more than watermelon!', color: '#22c55e' },
  { id: 'onion', name: 'Onion', emoji: '🧅', category: 'vegetables', funFact: 'Onions make you cry because of a special gas they release!', color: '#fef08a' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', category: 'vegetables', funFact: 'Garlic has been used as medicine for thousands of years!', color: '#fef9c3' },
  { id: 'mushroom', name: 'Mushroom', emoji: '🍄', category: 'vegetables', funFact: 'Mushrooms are not plants - they are fungi!', color: '#a16207' },
  { id: 'peas', name: 'Peas', emoji: '🫛', category: 'vegetables', funFact: 'Peas are one of the oldest vegetables humans eat!', color: '#22c55e' },
  { id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', category: 'vegetables', funFact: 'Pumpkins are 90% water and every part is edible!', color: '#f97316' },
  { id: 'sweetpotato', name: 'Sweet Potato', emoji: '🍠', category: 'vegetables', funFact: 'Sweet potatoes are not related to regular potatoes!', color: '#f97316' },
];

// SHAPES DATA — every id below matches LearnIcon's drawn-shape set, so the
// app renders a real drawn SVG for all 20, not the emoji field.
export const shapesData: LearnItem[] = [
  { id: 'circle', name: 'Circle', emoji: '🔴', category: 'shapes', funFact: 'A circle has no corners and no edges!' },
  { id: 'square', name: 'Square', emoji: '🟧', category: 'shapes', funFact: 'A square has 4 equal sides and 4 corners!' },
  { id: 'triangle', name: 'Triangle', emoji: '🔺', category: 'shapes', funFact: 'A triangle is the strongest shape in building!' },
  { id: 'star', name: 'Star', emoji: '⭐', category: 'shapes', funFact: 'Stars twinkle in the night sky!' },
  { id: 'heart', name: 'Heart', emoji: '❤️', category: 'shapes', funFact: 'The heart shape means love!' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', category: 'shapes', funFact: 'Diamonds are the hardest natural material!' },
  { id: 'rectangle', name: 'Rectangle', emoji: '🟩', category: 'shapes', funFact: 'A rectangle has 2 long sides and 2 short sides!' },
  { id: 'oval', name: 'Oval', emoji: '🥚', category: 'shapes', funFact: 'An oval is like a stretched circle - like an egg!' },
  { id: 'pentagon', name: 'Pentagon', emoji: '⬟', category: 'shapes', funFact: 'A pentagon has 5 sides - like a house shape!' },
  { id: 'hexagon', name: 'Hexagon', emoji: '⬡', category: 'shapes', funFact: 'Hexagons have 6 sides - bees make hexagon honeycombs!' },
  { id: 'octagon', name: 'Octagon', emoji: '🛑', category: 'shapes', funFact: 'An octagon has 8 sides - like a stop sign!' },
  { id: 'crescent', name: 'Crescent', emoji: '🌙', category: 'shapes', funFact: 'A crescent is shaped like the moon!' },
  { id: 'arrow', name: 'Arrow', emoji: '➡️', category: 'shapes', funFact: 'Arrows point the way to go!' },
  { id: 'cross', name: 'Cross', emoji: '➕', category: 'shapes', funFact: 'A cross is made of two lines crossing!' },
  { id: 'spiral', name: 'Spiral', emoji: '🌀', category: 'shapes', funFact: 'Spirals spin round and round like a snail shell!' },
  { id: 'cube', name: 'Cube', emoji: '🧊', category: 'shapes', funFact: 'A cube is a 3D square - like a dice!' },
  { id: 'sphere', name: 'Sphere', emoji: '🔮', category: 'shapes', funFact: 'A sphere is a 3D circle - like a ball!' },
  { id: 'cylinder', name: 'Cylinder', emoji: '🥫', category: 'shapes', funFact: 'A cylinder is like a can or a tube!' },
  { id: 'cone', name: 'Cone', emoji: '🍦', category: 'shapes', funFact: 'A cone is like an ice cream cone shape!' },
  { id: 'pyramid', name: 'Pyramid', emoji: '🔺', category: 'shapes', funFact: 'Pyramids were built in Egypt thousands of years ago!' },
];

// COLORS DATA — LearnIcon draws a swatch from the hex `color` field for
// every one of these, so the emoji field is never actually shown on screen.
export const colorsData: LearnItem[] = [
  { id: 'red', name: 'Red', emoji: '🔴', category: 'colors', funFact: 'Fire trucks and stop signs are red!', color: '#ef4444' },
  { id: 'blue', name: 'Blue', emoji: '🔵', category: 'colors', funFact: 'The sky and ocean are blue!', color: '#3b82f6' },
  { id: 'yellow', name: 'Yellow', emoji: '🟡', category: 'colors', funFact: 'The sun and bananas are yellow!', color: '#eab308' },
  { id: 'green', name: 'Green', emoji: '🟢', category: 'colors', funFact: 'Grass and leaves are green!', color: '#22c55e' },
  { id: 'purple', name: 'Purple', emoji: '🟣', category: 'colors', funFact: 'Purple was once only worn by kings and queens!', color: '#a855f7' },
  { id: 'orange', name: 'Orange', emoji: '🟠', category: 'colors', funFact: 'Oranges and carrots are orange!', color: '#f97316' },
  { id: 'pink', name: 'Pink', emoji: '🩷', category: 'colors', funFact: 'Flamingos and cotton candy are pink!', color: '#ec4899' },
  { id: 'brown', name: 'Brown', emoji: '🟤', category: 'colors', funFact: 'Chocolate and tree trunks are brown!', color: '#a16207' },
  { id: 'black', name: 'Black', emoji: '⚫', category: 'colors', funFact: 'Night time and space are black!', color: '#1f2937' },
  { id: 'white', name: 'White', emoji: '⚪', category: 'colors', funFact: 'Snow and clouds are white!', color: '#f8fafc' },
  { id: 'gray', name: 'Gray', emoji: '🩶', category: 'colors', funFact: 'Elephants and rain clouds are gray!', color: '#6b7280' },
  // Was #eab308 - identical to Yellow's hex, so the two swatches looked the
  // same. Gold now gets an actual metallic-gold tone.
  { id: 'gold', name: 'Gold', emoji: '🥇', category: 'colors', funFact: 'Gold medals are for first place winners!', color: '#d4af37' },
  { id: 'silver', name: 'Silver', emoji: '🥈', category: 'colors', funFact: 'Silver medals are for second place!', color: '#9ca3af' },
  { id: 'cyan', name: 'Cyan', emoji: '🩵', category: 'colors', funFact: 'Cyan is a blue-green color like tropical water!', color: '#06b6d4' },
  { id: 'magenta', name: 'Magenta', emoji: '💜', category: 'colors', funFact: 'Magenta is a mix of red and purple!', color: '#d946ef' },
  { id: 'turquoise', name: 'Turquoise', emoji: '💎', category: 'colors', funFact: 'Turquoise is the color of beautiful gemstones!', color: '#14b8a6' },
  { id: 'navy', name: 'Navy Blue', emoji: '🫐', category: 'colors', funFact: 'Navy blue is a very dark blue like the deep ocean!', color: '#1e3a8a' },
  { id: 'coral', name: 'Coral', emoji: '🪸', category: 'colors', funFact: 'Coral is a pinkish-orange like sea coral!', color: '#f87171' },
  { id: 'teal', name: 'Teal', emoji: '🦆', category: 'colors', funFact: "Teal is named after the color around a duck's eye!", color: '#0d9488' },
  { id: 'maroon', name: 'Maroon', emoji: '🫀', category: 'colors', funFact: 'Maroon is a dark brownish-red color!', color: '#7f1d1d' },
];

// VEHICLES DATA
// Dropped: Submarine (was showing a generic cruise ship, not a submarine —
// Unicode has no submarine emoji), Bulldozer and Steam Engine (duplicated
// Tractor's and Train's pictures exactly).
export const vehiclesData: LearnItem[] = [
  { id: 'car', name: 'Car', emoji: '🚗', category: 'vehicles', funFact: 'The first car was invented over 130 years ago!' },
  { id: 'bus', name: 'Bus', emoji: '🚌', category: 'vehicles', funFact: 'Some buses can carry over 100 passengers!' },
  { id: 'train', name: 'Train', emoji: '🚂', category: 'vehicles', funFact: 'The fastest trains can go over 300 miles per hour!' },
  { id: 'airplane', name: 'Airplane', emoji: '✈️', category: 'vehicles', funFact: 'Airplanes fly at about 30000 feet high!' },
  { id: 'boat', name: 'Boat', emoji: '⛵', category: 'vehicles', funFact: 'Sailboats use wind power to move!' },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', category: 'vehicles', funFact: 'Bicycles have been around for over 200 years!' },
  { id: 'helicopter', name: 'Helicopter', emoji: '🚁', category: 'vehicles', funFact: 'Helicopters can fly backwards and sideways!' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', category: 'vehicles', funFact: 'Rockets can travel at 25000 miles per hour!' },
  { id: 'firetruck', name: 'Fire Truck', emoji: '🚒', category: 'vehicles', funFact: 'Fire trucks carry over 500 gallons of water!' },
  { id: 'ambulance', name: 'Ambulance', emoji: '🚑', category: 'vehicles', funFact: 'Ambulances help sick people get to hospitals fast!' },
  { id: 'policeCar', name: 'Police Car', emoji: '🚓', category: 'vehicles', funFact: 'Police cars help keep our streets safe!' },
  { id: 'taxi', name: 'Taxi', emoji: '🚕', category: 'vehicles', funFact: 'Yellow taxis are famous in New York City!' },
  { id: 'motorcycle', name: 'Motorcycle', emoji: '🏍️', category: 'vehicles', funFact: 'Motorcycles have only 2 wheels like bicycles!' },
  { id: 'truck', name: 'Truck', emoji: '🚚', category: 'vehicles', funFact: 'Big trucks can carry tons of cargo!' },
  { id: 'tractor', name: 'Tractor', emoji: '🚜', category: 'vehicles', funFact: 'Tractors help farmers work in fields!' },
  { id: 'hotAirBalloon', name: 'Hot Air Balloon', emoji: '🎈', category: 'vehicles', funFact: 'Hot air balloons float because hot air rises!' },
  { id: 'skateboard', name: 'Skateboard', emoji: '🛹', category: 'vehicles', funFact: 'Skateboards were invented by surfers!' },
  { id: 'scooter', name: 'Scooter', emoji: '🛴', category: 'vehicles', funFact: 'Scooters are great for short trips!' },
  { id: 'jetski', name: 'Jet Ski', emoji: '🚤', category: 'vehicles', funFact: 'Jet skis can zoom across water very fast!' },
  { id: 'cableCar', name: 'Cable Car', emoji: '🚡', category: 'vehicles', funFact: 'Cable cars hang from cables high in the air!' },
  { id: 'monorail', name: 'Monorail', emoji: '🚝', category: 'vehicles', funFact: 'Monorails run on a single rail track!' },
  { id: 'spaceship', name: 'Spaceship', emoji: '🛸', category: 'vehicles', funFact: 'Spaceships travel to other planets!' },
];

// BIRDS DATA
// Dropped: Hummingbird, Woodpecker, Pelican, Toucan, Ostrich, Robin,
// Sparrow, Crow, Seagull, Stork, Kingfisher, Canary, Bluebird (all 13 were
// showing the exact same generic "bird" picture — Unicode has no specific
// emoji for any of them), and Falcon (duplicated Eagle's picture exactly).
// Everything kept below has its own correct, unique picture.
export const birdsData: LearnItem[] = [
  { id: 'eagle', name: 'Eagle', emoji: '🦅', category: 'birds', funFact: 'Eagles have eyesight 4 times better than humans!' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', category: 'birds', funFact: 'Parrots can learn to talk and repeat words!' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', category: 'birds', funFact: 'Penguins are birds that cannot fly but swim amazingly!' },
  { id: 'owl', name: 'Owl', emoji: '🦉', category: 'birds', funFact: 'Owls can turn their heads almost 270 degrees!' },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', category: 'birds', funFact: 'Flamingos are pink because of the shrimp they eat!' },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', category: 'birds', funFact: 'Male peacocks have beautiful colorful tail feathers!' },
  { id: 'duck', name: 'Duck', emoji: '🦆', category: 'birds', funFact: 'Ducks have waterproof feathers!' },
  { id: 'swan', name: 'Swan', emoji: '🦢', category: 'birds', funFact: 'Swans mate for life with one partner!' },
  { id: 'turkey', name: 'Turkey', emoji: '🦃', category: 'birds', funFact: 'Turkeys can run at 25 miles per hour!' },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', category: 'birds', funFact: 'Roosters crow to announce the morning!' },
  { id: 'dove', name: 'Dove', emoji: '🕊️', category: 'birds', funFact: 'Doves are symbols of peace around the world!' },
];

// BODY PARTS DATA
// Dropped: Stomach and Belly Button — these were showing pregnant-person
// emoji (🫃 🫄), which is exactly the bug a tester reported. There's no
// accurate "tummy" emoji in Unicode, so rather than show something else
// wrong, these two are left out. Also dropped Lungs (2019 emoji, too new
// for some older Android devices). Neck was showing a giraffe — swapped
// for a scarf, which is at least actually neck-related.
export const bodyPartsData: LearnItem[] = [
  { id: 'eyes', name: 'Eyes', emoji: '👀', category: 'body', funFact: 'Your eyes can see about 10 million different colors!' },
  { id: 'nose', name: 'Nose', emoji: '👃', category: 'body', funFact: 'Your nose can remember 50000 different smells!' },
  { id: 'mouth', name: 'Mouth', emoji: '👄', category: 'body', funFact: 'You use 200 muscles to take one step but only 17 to smile!' },
  { id: 'ear', name: 'Ear', emoji: '👂', category: 'body', funFact: 'Your ears never stop working even when you sleep!' },
  { id: 'hand', name: 'Hand', emoji: '✋', category: 'body', funFact: 'You have 27 bones in each hand!' },
  { id: 'foot', name: 'Foot', emoji: '🦶', category: 'body', funFact: 'Your feet have 250000 sweat glands!' },
  { id: 'brain', name: 'Brain', emoji: '🧠', category: 'body', funFact: "Your brain uses 20% of all your body's energy!" },
  { id: 'heart', name: 'Heart', emoji: '❤️', category: 'body', funFact: 'Your heart beats about 100000 times every day!' },
  { id: 'tongue', name: 'Tongue', emoji: '👅', category: 'body', funFact: 'Your tongue has about 10000 taste buds!' },
  { id: 'teeth', name: 'Teeth', emoji: '🦷', category: 'body', funFact: 'Teeth are as hard as rocks!' },
  { id: 'finger', name: 'Finger', emoji: '👆', category: 'body', funFact: 'Your fingerprints are unique - no one else has the same!' },
  { id: 'thumb', name: 'Thumb', emoji: '👍', category: 'body', funFact: 'Your thumb has its own pulse!' },
  { id: 'knee', name: 'Knee', emoji: '🦵', category: 'body', funFact: 'Your knee is the biggest joint in your body!' },
  { id: 'elbow', name: 'Elbow', emoji: '💪', category: 'body', funFact: 'You cannot lick your own elbow!' },
  { id: 'shoulder', name: 'Shoulder', emoji: '🤷', category: 'body', funFact: 'Your shoulder is the most flexible joint!' },
  { id: 'bones', name: 'Bones', emoji: '🦴', category: 'body', funFact: 'Babies have 300 bones but adults only have 206!' },
  { id: 'skin', name: 'Skin', emoji: '🖐️', category: 'body', funFact: 'Skin is the largest organ of your body!' },
  { id: 'hair', name: 'Hair', emoji: '💇', category: 'body', funFact: 'Your hair grows about 6 inches every year!' },
  { id: 'eyebrow', name: 'Eyebrow', emoji: '🤨', category: 'body', funFact: 'Eyebrows keep sweat out of your eyes!' },
  { id: 'eyelash', name: 'Eyelash', emoji: '👁️', category: 'body', funFact: 'Eyelashes protect your eyes from dust!' },
  { id: 'chin', name: 'Chin', emoji: '🗣️', category: 'body', funFact: 'Only humans have chins!' },
  { id: 'neck', name: 'Neck', emoji: '🧣', category: 'body', funFact: 'Your neck has the same number of bones as a giraffe!' },
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
  { question: 'Which animal is this?', emoji: '🐧', options: ['Penguin', 'Duck', 'Chicken', 'Owl'], correct: 0, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🦒', options: ['Zebra', 'Horse', 'Giraffe', 'Deer'], correct: 2, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐬', options: ['Shark', 'Whale', 'Fish', 'Dolphin'], correct: 3, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐻', options: ['Dog', 'Bear', 'Wolf', 'Tiger'], correct: 1, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐼', options: ['Polar Bear', 'Panda', 'Koala', 'Raccoon'], correct: 1, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🦊', options: ['Dog', 'Wolf', 'Fox', 'Cat'], correct: 2, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐨', options: ['Bear', 'Panda', 'Koala', 'Sloth'], correct: 2, category: 'animals' },
  { question: 'Which animal is this?', emoji: '🐸', options: ['Toad', 'Lizard', 'Frog', 'Snake'], correct: 2, category: 'animals' },
  // Fruits
  { question: 'Which fruit is this?', emoji: '🍎', options: ['Cherry', 'Strawberry', 'Apple', 'Tomato'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍌', options: ['Corn', 'Banana', 'Pineapple', 'Mango'], correct: 1, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍇', options: ['Blueberry', 'Plum', 'Grapes', 'Fig'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍊', options: ['Peach', 'Orange', 'Lemon', 'Mango'], correct: 1, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍓', options: ['Cherry', 'Raspberry', 'Strawberry', 'Apple'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍉', options: ['Melon', 'Apple', 'Watermelon', 'Pumpkin'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🍍', options: ['Lemon', 'Durian', 'Pineapple', 'Jackfruit'], correct: 2, category: 'fruits' },
  { question: 'Which fruit is this?', emoji: '🥭', options: ['Papaya', 'Mango', 'Peach', 'Apricot'], correct: 1, category: 'fruits' },
  // Vegetables
  { question: 'Which vegetable is this?', emoji: '🥕', options: ['Radish', 'Carrot', 'Beet', 'Parsnip'], correct: 1, category: 'vegetables' },
  { question: 'Which vegetable is this?', emoji: '🥦', options: ['Lettuce', 'Spinach', 'Broccoli', 'Cabbage'], correct: 2, category: 'vegetables' },
  { question: 'Which vegetable is this?', emoji: '🌽', options: ['Wheat', 'Rice', 'Corn', 'Barley'], correct: 2, category: 'vegetables' },
  { question: 'Which vegetable is this?', emoji: '🍅', options: ['Apple', 'Strawberry', 'Tomato', 'Cherry'], correct: 2, category: 'vegetables' },
  { question: 'Which vegetable is this?', emoji: '🥔', options: ['Onion', 'Garlic', 'Potato', 'Turnip'], correct: 2, category: 'vegetables' },
  // Colors
  { question: 'What color is a fire truck?', emoji: '🚒', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2, category: 'colors' },
  { question: 'What color is the sun?', emoji: '☀️', options: ['Red', 'Yellow', 'Orange', 'White'], correct: 1, category: 'colors' },
  { question: 'What color is grass?', emoji: '🌿', options: ['Blue', 'Yellow', 'Green', 'Brown'], correct: 2, category: 'colors' },
  { question: 'What color is the sky?', emoji: '🌤️', options: ['Blue', 'Green', 'Red', 'Purple'], correct: 0, category: 'colors' },
  { question: 'What color is a banana?', emoji: '🍌', options: ['Red', 'Yellow', 'Green', 'Orange'], correct: 1, category: 'colors' },
  { question: 'What color is an orange?', emoji: '🍊', options: ['Red', 'Yellow', 'Orange', 'Pink'], correct: 2, category: 'colors' },
  { question: 'What color is chocolate?', emoji: '🍫', options: ['Black', 'Brown', 'Red', 'Yellow'], correct: 1, category: 'colors' },
  // Numbers
  { question: 'How many legs does a dog have?', emoji: '🐶', options: ['2', '3', '4', '6'], correct: 2, category: 'numbers' },
  { question: 'How many eyes do you have?', emoji: '👀', options: ['1', '2', '3', '4'], correct: 1, category: 'numbers' },
  { question: 'How many fingers on one hand?', emoji: '✋', options: ['3', '4', '5', '6'], correct: 2, category: 'numbers' },
  { question: 'How many wheels does a bicycle have?', emoji: '🚲', options: ['1', '2', '3', '4'], correct: 1, category: 'numbers' },
  { question: 'How many legs does a spider have?', emoji: '🕷️', options: ['4', '6', '8', '10'], correct: 2, category: 'numbers' },
  { question: 'How many days in a week?', emoji: '📅', options: ['5', '6', '7', '8'], correct: 2, category: 'numbers' },
  // Shapes
  { question: 'How many sides does a triangle have?', emoji: '🔺', options: ['2', '3', '4', '5'], correct: 1, category: 'shapes' },
  { question: 'What shape is a ball?', emoji: '⚽', options: ['Square', 'Triangle', 'Circle', 'Star'], correct: 2, category: 'shapes' },
  { question: 'What shape is a dice?', emoji: '🎲', options: ['Circle', 'Cube', 'Triangle', 'Pyramid'], correct: 1, category: 'shapes' },
  { question: 'What shape has 4 equal sides?', emoji: '🟧', options: ['Circle', 'Rectangle', 'Square', 'Triangle'], correct: 2, category: 'shapes' },
  // Vehicles
  { question: 'Which vehicle flies?', emoji: '✈️', options: ['Car', 'Boat', 'Airplane', 'Bus'], correct: 2, category: 'vehicles' },
  { question: 'Which vehicle sails on water?', emoji: '⛵', options: ['Boat', 'Car', 'Train', 'Bus'], correct: 0, category: 'vehicles' },
  { question: 'Which vehicle has two wheels?', emoji: '🚲', options: ['Car', 'Bicycle', 'Bus', 'Truck'], correct: 1, category: 'vehicles' },
  { question: 'Which vehicle goes to space?', emoji: '🚀', options: ['Airplane', 'Helicopter', 'Rocket', 'Jet'], correct: 2, category: 'vehicles' },
  // Math
  { question: 'What is 1 + 1?', emoji: '🧮', options: ['1', '2', '3', '4'], correct: 1, category: 'math' },
  { question: 'What is 2 + 3?', emoji: '🧮', options: ['4', '5', '6', '7'], correct: 1, category: 'math' },
  { question: 'What is 5 - 2?', emoji: '🧮', options: ['1', '2', '3', '4'], correct: 2, category: 'math' },
  { question: 'What is 3 + 4?', emoji: '🧮', options: ['5', '6', '7', '8'], correct: 2, category: 'math' },
  { question: 'What is 10 - 5?', emoji: '🧮', options: ['3', '4', '5', '6'], correct: 2, category: 'math' },
  { question: 'What is 6 + 2?', emoji: '🧮', options: ['7', '8', '9', '10'], correct: 1, category: 'math' },
  { question: 'What is 4 + 4?', emoji: '🧮', options: ['6', '7', '8', '9'], correct: 2, category: 'math' },
  { question: 'What is 9 - 3?', emoji: '🧮', options: ['4', '5', '6', '7'], correct: 2, category: 'math' },
  { question: 'What is 2 x 3?', emoji: '🧮', options: ['4', '5', '6', '7'], correct: 2, category: 'math' },
  { question: 'What is 5 x 2?', emoji: '🧮', options: ['8', '9', '10', '11'], correct: 2, category: 'math' },
  // Birds
  { question: 'Which bird cannot fly?', emoji: '🐧', options: ['Eagle', 'Penguin', 'Sparrow', 'Crow'], correct: 1, category: 'birds' },
  { question: 'Which bird can talk?', emoji: '🦜', options: ['Owl', 'Parrot', 'Duck', 'Eagle'], correct: 1, category: 'birds' },
  { question: 'Which bird is pink?', emoji: '🦩', options: ['Swan', 'Dove', 'Flamingo', 'Pelican'], correct: 2, category: 'birds' },
  // Sounds
  { question: 'What sound does a cat make?', emoji: '🐱', options: ['Woof', 'Meow', 'Moo', 'Oink'], correct: 1, category: 'sounds' },
  { question: 'What sound does a dog make?', emoji: '🐶', options: ['Woof', 'Meow', 'Quack', 'Roar'], correct: 0, category: 'sounds' },
  { question: 'What sound does a cow make?', emoji: '🐄', options: ['Woof', 'Neigh', 'Moo', 'Baa'], correct: 2, category: 'sounds' },
  { question: 'What sound does a lion make?', emoji: '🦁', options: ['Meow', 'Bark', 'Roar', 'Hiss'], correct: 2, category: 'sounds' },
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
    { id: 'a', emoji: 'A', name: 'A' },
    { id: 'b', emoji: 'B', name: 'B' },
    { id: 'c', emoji: 'C', name: 'C' },
    { id: 'd', emoji: 'D', name: 'D' },
    { id: 'e', emoji: 'E', name: 'E' },
    { id: 'f', emoji: 'F', name: 'F' },
  ],
};

// WORD BUILDER WORDS
export interface WordBuilderWord {
  word: string;
  emoji: string;
  hint: string;
}

// Dropped MUG (duplicated CUP's cup-of-coffee emoji), JAM (duplicated JAR's
// jar emoji, and there's no accurate "jam" emoji to give it instead), and
// one of the two FROG entries (it was listed twice with the same emoji).
export const wordBuilderWords: WordBuilderWord[] = [
  { word: 'CAT', emoji: '🐱', hint: 'A furry pet that says meow' },
  { word: 'DOG', emoji: '🐶', hint: 'A pet that says woof and loves to play' },
  { word: 'SUN', emoji: '☀️', hint: 'It shines bright in the sky during the day' },
  { word: 'HAT', emoji: '🎩', hint: 'You wear it on your head' },
  { word: 'BUS', emoji: '🚌', hint: 'A big vehicle that carries many people' },
  { word: 'CUP', emoji: '☕', hint: 'You drink from this' },
  { word: 'BED', emoji: '🛏️', hint: 'You sleep in this at night' },
  { word: 'PIG', emoji: '🐷', hint: 'A pink farm animal that says oink' },
  { word: 'MAP', emoji: '🗺️', hint: 'Shows you where places are' },
  { word: 'PEN', emoji: '🖊️', hint: 'You write with this' },
  { word: 'FAN', emoji: '🌀', hint: 'Keeps you cool when it spins' },
  { word: 'BAT', emoji: '🦇', hint: 'An animal that flies at night' },
  { word: 'ANT', emoji: '🐜', hint: 'A tiny insect that is very strong' },
  { word: 'BEE', emoji: '🐝', hint: 'It makes honey and buzzes' },
  { word: 'EGG', emoji: '🥚', hint: 'Chickens lay these' },
  { word: 'OWL', emoji: '🦉', hint: 'A bird that hoots at night' },
  { word: 'FOX', emoji: '🦊', hint: 'A clever orange animal' },
  { word: 'BOX', emoji: '📦', hint: 'You put things inside this' },
  { word: 'NET', emoji: '🥅', hint: 'Used to catch fish or in sports' },
  { word: 'WEB', emoji: '🕸️', hint: 'A spider makes this' },
  { word: 'VAN', emoji: '🚐', hint: 'A vehicle bigger than a car' },
  { word: 'JAR', emoji: '🫙', hint: 'A glass container for storing things' },
  { word: 'LOG', emoji: '🪵', hint: 'A piece of wood from a tree' },
  { word: 'MOP', emoji: '🧹', hint: 'Used to clean floors' },
  { word: 'RUG', emoji: '🧶', hint: 'A soft cover for the floor' },
  { word: 'BUG', emoji: '🐛', hint: 'A small crawling insect' },
  { word: 'HUG', emoji: '🤗', hint: 'A loving squeeze between friends' },
  { word: 'JUG', emoji: '🫗', hint: 'A container for pouring drinks' },
  { word: 'FISH', emoji: '🐟', hint: 'It swims in water' },
  { word: 'FROG', emoji: '🐸', hint: 'It hops and says ribbit' },
  { word: 'STAR', emoji: '⭐', hint: 'It twinkles in the night sky' },
  { word: 'MOON', emoji: '🌙', hint: 'It glows in the night sky' },
  { word: 'TREE', emoji: '🌳', hint: 'It has leaves and branches' },
  { word: 'CAKE', emoji: '🎂', hint: 'A sweet treat for birthdays' },
  { word: 'BIRD', emoji: '🐦', hint: 'It has wings and can fly' },
  { word: 'BEAR', emoji: '🐻', hint: 'A big furry animal in forests' },
  { word: 'BOAT', emoji: '⛵', hint: 'It floats on water' },
  { word: 'BOOK', emoji: '📚', hint: 'You read stories in this' },
  { word: 'BALL', emoji: '⚽', hint: 'Round thing you play with' },
  { word: 'DUCK', emoji: '🦆', hint: 'A bird that says quack' },
  { word: 'KING', emoji: '👑', hint: 'He wears a crown and rules' },
  { word: 'LION', emoji: '🦁', hint: 'King of the jungle' },
  { word: 'RAIN', emoji: '🌧️', hint: 'Water falling from clouds' },
  { word: 'SNOW', emoji: '❄️', hint: 'White cold flakes in winter' },
  { word: 'HAND', emoji: '✋', hint: 'You have five fingers on this' },
  { word: 'FOOT', emoji: '🦶', hint: 'You walk with these' },
  { word: 'NOSE', emoji: '👃', hint: 'You smell with this' },
  { word: 'CLOUD', emoji: '☁️', hint: 'White fluffy thing in the sky' },
  { word: 'HOUSE', emoji: '🏠', hint: 'A place where families live' },
  { word: 'HORSE', emoji: '🐴', hint: 'An animal you can ride' },
  { word: 'MOUSE', emoji: '🐭', hint: 'A small animal that squeaks' },
  { word: 'TRAIN', emoji: '🚂', hint: 'It travels on tracks' },
  { word: 'PLANE', emoji: '✈️', hint: 'It flies high in the sky' },
  { word: 'SMILE', emoji: '😊', hint: 'A happy face you make' },
  { word: 'HEART', emoji: '❤️', hint: 'The shape of love' },
  { word: 'APPLE', emoji: '🍎', hint: 'A red fruit that is crunchy' },
  { word: 'GRAPE', emoji: '🍇', hint: 'Small round purple fruits' },
  { word: 'LEMON', emoji: '🍋', hint: 'A sour yellow fruit' },
  { word: 'ZEBRA', emoji: '🦓', hint: 'Black and white striped animal' },
  { word: 'TIGER', emoji: '🐯', hint: 'Orange cat with black stripes' },
  { word: 'PIZZA', emoji: '🍕', hint: 'Round food with cheese on top' },
  { word: 'WATER', emoji: '💧', hint: 'You drink this to stay healthy' },
  { word: 'CANDY', emoji: '🍬', hint: 'Sweet treat that tastes yummy' },
  { word: 'FLOWER', emoji: '🌸', hint: 'Pretty colorful plant' },
  { word: 'RABBIT', emoji: '🐰', hint: 'Animal with long ears that hops' },
  { word: 'MONKEY', emoji: '🐒', hint: 'Animal that swings in trees' },
  { word: 'BANANA', emoji: '🍌', hint: 'Yellow curved fruit' },
  { word: 'ORANGE', emoji: '🍊', hint: 'Round orange fruit' },
  { word: 'ROCKET', emoji: '🚀', hint: 'It flies to space' },
  { word: 'COOKIE', emoji: '🍪', hint: 'Sweet round baked treat' },
  { word: 'DRAGON', emoji: '🐉', hint: 'Mythical creature that breathes fire' },
  { word: 'PENGUIN', emoji: '🐧', hint: 'Black and white bird that swims' },
  { word: 'RAINBOW', emoji: '🌈', hint: 'Colorful arc after rain' },
  { word: 'DOLPHIN', emoji: '🐬', hint: 'Smart animal in the ocean' },
  { word: 'ELEPHANT', emoji: '🐘', hint: 'Big gray animal with a trunk' },
  { word: 'BUTTERFLY', emoji: '🦋', hint: 'Colorful insect with wings' },
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
// (Unchanged — not fed by Airtable, kept exactly as-is)
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
  { id: 'assembly', name: 'Assembly Line', emoji: '🏭', description: 'Work on assembly line', funFact: 'Henry Ford invented the assembly line!', steps: ['Wait for item', 'Add your part', 'Pass it on!'] },
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
  { id: 'puzzle', name: 'Puzzle', emoji: '🧩', description: 'Solve fun puzzles!', color: '#7e57c2', gradient: 'from-violet-400 to-purple-400' },
  { id: 'skills', name: 'Skills', emoji: '🌟', description: 'Learn fun real-world skills!', color: '#f59e0b', gradient: 'from-amber-400 to-yellow-400' },
  { id: 'creative', name: 'Creative', emoji: '🎨', description: 'Draw and create!', color: '#f97316', gradient: 'from-orange-400 to-pink-500' },
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
  description?: string;
}

// ✅ ONLY ONE dailyChallenges array - the new one with 7 days
export const dailyChallenges: DailyChallenge[] = [
  // Sunday (index 0) - getDay() = 0
  {
    id: 'sunday-quiz',
    title: 'Sunday Quiz Blast! 🎉',
    emoji: '❓',
    gameMode: 'quiz',
    reward: 50,
    description: 'Answer 5 quiz questions correctly!'
  },
  // Monday (index 1) - getDay() = 1
  {
    id: 'monday-memory',
    title: 'Monday Memory Match! 🧠',
    emoji: '🧠',
    gameMode: 'memory',
    reward: 40,
    description: 'Complete a full memory game!'
  },
  // Tuesday (index 2) - getDay() = 2
  {
    id: 'tuesday-math',
    title: 'Tuesday Math Magic! 🧮',
    emoji: '🧮',
    gameMode: 'math',
    reward: 50,
    description: 'Solve 5 math problems!'
  },
  // Wednesday (index 3) - getDay() = 3
  {
    id: 'wednesday-words',
    title: 'Wednesday Word Builder! 📝',
    emoji: '📝',
    gameMode: 'wordbuilder',
    reward: 45,
    description: 'Build 3 words correctly!'
  },
  // Thursday (index 4) - getDay() = 4
  {
    id: 'thursday-learn',
    title: 'Thursday Learning Time! 📚',
    emoji: '📚',
    gameMode: 'learn',
    reward: 35,
    description: 'Explore 5 new things!'
  },
  // Friday (index 5) - getDay() = 5
  {
    id: 'friday-match',
    title: 'Friday Match Frenzy! 🎯',
    emoji: '🎯',
    gameMode: 'match',
    reward: 45,
    description: 'Match all items correctly!'
  },
  // Saturday (index 6) - getDay() = 6
  {
    id: 'saturday-puzzle',
    title: 'Saturday Puzzle Party! 🧩',
    emoji: '🧩',
    gameMode: 'puzzle',
    reward: 60,
    description: 'Complete a fun puzzle!'
  },
];

// ✅ KEEP THIS - encouragement messages stay at the bottom
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
