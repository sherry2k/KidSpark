// ============================================================
// ODD ONE OUT: rounds
// ============================================================
//
// Every round shows four pictures. Three belong together, one does not.
// Rounds are written by hand so that there is exactly ONE good answer.
// (A generated game would sooner or later ask "which is different?" about
// a banana, an apple, a pear and a tomato, and then nobody is right.)
//
// Three levels:
//   easy    the odd one comes from a completely different group
//   medium  all four are the same kind of thing, but one lives / works differently
//   hard    the child has to think about a rule: colour, legs, hot or cold ...
//
// Every picture is an emoji from Unicode 11 or older, so it shows on old
// Android phones. To add a round, add one line to the right list below.
// The names in the lines must exist in PIC. A test checks this.

export type OddLevel = 'easy' | 'medium' | 'hard';

export interface OddRound {
  id: string;
  level: OddLevel;
  /** the three that belong together (names, as written in PIC) */
  group: [string, string, string];
  /** the one that does not belong */
  odd: string;
  /** said and shown after a right answer */
  reason: string;
}

/** name -> emoji. Names are what the child sees under the picture. */
export const PIC: Record<string, string> = {
  // fruit
  Apple: '🍎', Banana: '🍌', Grapes: '🍇', Orange: '🍊', Strawberry: '🍓', Cherry: '🍒',
  Pineapple: '🍍', Lemon: '🍋',
  // vegetables
  Carrot: '🥕', Potato: '🥔', Broccoli: '🥦',
  // animals
  Dog: '🐶', Cat: '🐱', Cow: '🐮', Pig: '🐷', Horse: '🐴', Sheep: '🐑', Rabbit: '🐰',
  Lion: '🦁', Tiger: '🐯', Bear: '🐻', Elephant: '🐘', Giraffe: '🦒', Chicken: '🐔',
  Fish: '🐟', Crab: '🦀', Shark: '🦈', Dolphin: '🐬', Whale: '🐳',
  Bee: '🐝', Butterfly: '🦋', Ladybug: '🐞', Spider: '🕷️', Bird: '🐦', Eagle: '🦅',
  Duck: '🦆', Penguin: '🐧',
  // vehicles
  Car: '🚗', Bus: '🚌', Tractor: '🚜', Bicycle: '🚲', Boat: '⛵', Ship: '🚢',
  Plane: '✈️', Helicopter: '🚁', Rocket: '🚀',
  // clothes
  Shirt: '👕', Pants: '👖', Dress: '👗', Hat: '👒', Shoe: '👟', Coat: '🧥',
  Scarf: '🧣', Gloves: '🧤', Sunglasses: '🕶️',
  // nature
  Rose: '🌹', Tulip: '🌷', Sunflower: '🌻', Tree: '🌳', Flower: '🌸', Mushroom: '🍄',
  // sky and weather
  Sun: '☀️', Moon: '🌙', Star: '⭐', Snowman: '⛄', Snowflake: '❄️', Fire: '🔥',
  // food and drink
  Bread: '🍞', Cheese: '🧀', Cake: '🍰', Pizza: '🍕', 'Ice Cream': '🍦',
  Milk: '🥛', Juice: '🍹', 'Hot Tea': '🍵',
  // toys, music and school
  'Soccer Ball': '⚽', Basketball: '🏀', 'Tennis Ball': '🎾', 'Teddy Bear': '🧸',
  Balloon: '🎈', Drum: '🥁', Guitar: '🎸', Piano: '🎹',
  Pencil: '✏️', Book: '📖', Scissors: '✂️',
  // places
  House: '🏠', School: '🏫', Castle: '🏰',
  // other
  Heart: '❤️',
};

type Row = [string, string, string, string, string];

const make = (level: OddLevel, rows: Row[]): OddRound[] =>
  rows.map(([a, b, c, odd, reason], i) => ({
    id: `${level}-${i + 1}`,
    level,
    group: [a, b, c],
    odd,
    reason,
  }));

/* ---------------- easy: a different group altogether ---------------- */
export const EASY: OddRound[] = make('easy', [
  ['Apple', 'Banana', 'Grapes', 'Dog', 'A dog is an animal. The others are fruits.'],
  ['Cat', 'Cow', 'Pig', 'Car', 'A car is a vehicle. The others are animals.'],
  ['Car', 'Bus', 'Boat', 'Apple', 'An apple is a fruit. The others are vehicles.'],
  ['Shirt', 'Hat', 'Shoe', 'Banana', 'A banana is a fruit. The others are clothes we wear.'],
  ['Rose', 'Tulip', 'Sunflower', 'Dog', 'A dog is an animal. The others are flowers.'],
  ['Lion', 'Tiger', 'Bear', 'Pizza', 'Pizza is food. The others are animals.'],
  ['Bread', 'Cheese', 'Cake', 'Cat', 'A cat is an animal. The others are food.'],
  ['Teddy Bear', 'Balloon', 'Drum', 'Strawberry', 'A strawberry is a fruit. The others are toys.'],
  ['Sun', 'Moon', 'Star', 'Dog', 'A dog is an animal. The others are in the sky.'],
  ['Fish', 'Crab', 'Shark', 'Bus', 'A bus is a vehicle. The others live in the sea.'],
  ['Plane', 'Rocket', 'Helicopter', 'Cow', 'A cow is an animal. The others are vehicles that fly.'],
  ['Pants', 'Dress', 'Coat', 'Cherry', 'A cherry is a fruit. The others are clothes.'],
  ['Pencil', 'Book', 'Scissors', 'Pig', 'A pig is an animal. The others are things we use at school.'],
  ['House', 'School', 'Castle', 'Banana', 'A banana is a fruit. The others are buildings.'],
]);

/* ---------------- medium: same family, one is different ---------------- */
export const MEDIUM: OddRound[] = make('medium', [
  ['Dog', 'Cat', 'Rabbit', 'Lion', 'A lion is a wild animal. The others can be pets.'],
  ['Fish', 'Dolphin', 'Whale', 'Elephant', 'An elephant lives on land. The others live in the sea.'],
  ['Elephant', 'Lion', 'Giraffe', 'Shark', 'A shark lives in the sea. The others live on land.'],
  ['Bee', 'Butterfly', 'Bird', 'Cat', 'A cat cannot fly. The others can fly.'],
  ['Apple', 'Banana', 'Grapes', 'Carrot', 'A carrot is a vegetable. The others are fruits.'],
  ['Carrot', 'Potato', 'Broccoli', 'Apple', 'An apple is a fruit. The others are vegetables.'],
  ['Car', 'Bus', 'Bicycle', 'Boat', 'A boat goes on water. The others go on the road.'],
  ['Plane', 'Helicopter', 'Rocket', 'Car', 'A car stays on the ground. The others fly.'],
  ['Milk', 'Juice', 'Hot Tea', 'Bread', 'Bread is food we eat. The others are drinks.'],
  ['Bread', 'Cheese', 'Cake', 'Milk', 'Milk is a drink. The others are food we eat.'],
  ['Sun', 'Moon', 'Star', 'Tree', 'A tree grows on the ground. The others are in the sky.'],
  ['Coat', 'Scarf', 'Gloves', 'Sunglasses', 'Sunglasses are for sunny days. The others keep us warm in winter.'],
  ['Piano', 'Guitar', 'Drum', 'Soccer Ball', 'A ball is for playing games. The others are music instruments.'],
  ['Rose', 'Tulip', 'Sunflower', 'Mushroom', 'A mushroom is not a flower. The others are flowers.'],
  ['Soccer Ball', 'Basketball', 'Tennis Ball', 'Teddy Bear', 'A teddy bear is a soft toy. The others are balls for sports.'],
]);

/* ---------------- hard: think about a rule ---------------- */
export const HARD: OddRound[] = make('hard', [
  ['Apple', 'Strawberry', 'Cherry', 'Banana', 'A banana is yellow. The others are red.'],
  ['Banana', 'Lemon', 'Pineapple', 'Grapes', 'Grapes are purple. The others are yellow.'],
  ['Heart', 'Strawberry', 'Cherry', 'Star', 'A star is yellow. The others are red.'],
  ['Dog', 'Cat', 'Cow', 'Chicken', 'A chicken has 2 legs. The others have 4 legs.'],
  ['Bee', 'Butterfly', 'Eagle', 'Penguin', 'A penguin cannot fly. The others can fly.'],
  ['Bee', 'Butterfly', 'Ladybug', 'Spider', 'A spider has 8 legs. The others are insects with 6 legs.'],
  ['Car', 'Bus', 'Tractor', 'Bicycle', 'A bicycle has 2 wheels and no engine. The others have engines.'],
  ['Ice Cream', 'Snowman', 'Snowflake', 'Fire', 'Fire is hot. The others are cold.'],
  ['Sun', 'Fire', 'Hot Tea', 'Snowman', 'A snowman is cold. The others are hot.'],
  ['Soccer Ball', 'Basketball', 'Orange', 'Banana', 'A banana is long. The others are round.'],
  ['Tree', 'Flower', 'Dog', 'Soccer Ball', 'A ball is not alive. The others are alive.'],
  ['Cow', 'Sheep', 'Horse', 'Lion', 'A lion eats meat. The others eat grass.'],
  ['Chicken', 'Bird', 'Duck', 'Cow', 'A cow does not have feathers. The others are birds.'],
]);

export const ROUNDS: Record<OddLevel, OddRound[]> = { easy: EASY, medium: MEDIUM, hard: HARD };
