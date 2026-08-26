/**
 * cookingRecipes.ts
 *
 * Cooking Studio as DATA, not as code.
 *
 * Every activity is a short list of steps, and every step is one of six
 * hand-actions. Add a new dish by adding a recipe here — no new components.
 *
 * The six verbs:
 *   gather   — drag ingredients into the bowl/pan/plate
 *   pour     — press and hold to fill to a marked line
 *   stir     — circle your finger until it's mixed
 *   time     — stop the sweeping bar in the green zone
 *   scrub    — rub back and forth to clean
 *   decorate — free play: colours, toppings, no wrong answer
 */

export interface Ingredient {
  /** emoji today, asset key tomorrow — see ItemIcon.tsx */
  icon: string;
  /** spoken and shown. Keep it a word a 4-year-old knows. */
  name: string;
}

export interface GatherStep {
  kind: 'gather';
  say: string;
  vessel: { icon: string; label: string };
  /** must all end up in the vessel. ORDER DOES NOT MATTER. */
  need: Ingredient[];
  /** wrong things on the tray. Tapping one is funny, not fatal. */
  decoys: Ingredient[];
  /** what the character says when a decoy is dropped in */
  decoyQuip?: string;
}

export interface PourStep {
  kind: 'pour';
  say: string;
  /** 0-100, where the line sits on the jug */
  target: number;
  /** how far off you can be and still pass */
  tolerance: number;
  liquid: { icon: string; name: string; color: string };
  /** e.g. "one cup", "half a cup" — spoken aloud */
  amountLabel: string;
}

export interface StirStep {
  kind: 'stir';
  say: string;
  /** full finger-circles required. 3 for little kids, 6 for older. */
  turns: number;
  vesselIcon: string;
  fromColor: string;
  toColor: string;
  /** what it becomes — spoken on completion */
  becomes: string;
}

export interface TimeStep {
  kind: 'time';
  say: string;
  /** 0-100 where the green zone starts, and how wide it is */
  zoneStart: number;
  zoneWidth: number;
  /** sweep speed, % per second */
  speed: number;
  sceneIcon: string;
  actionLabel: string;
  /** what happens if you stop too late */
  lateQuip: string;
}

export interface ScrubStep {
  kind: 'scrub';
  say: string;
  /** total px of back-and-forth travel needed */
  distance: number;
  dirtyIcon: string;
  cleanIcon: string;
}

export interface DecorateStep {
  kind: 'decorate';
  say: string;
  /** the thing being decorated */
  base: string;
  frostings: { name: string; color: string }[];
  toppings: Ingredient[];
}

export type CookStep =
  | GatherStep
  | PourStep
  | StirStep
  | TimeStep
  | ScrubStep
  | DecorateStep;

export interface Recipe {
  /** MUST match the skill id already in gameData.ts */
  id: string;
  title: string;
  /** shown once on the "start cooking" card, and spoken */
  hook: string;
  result: { icon: string; name: string };
  steps: CookStep[];
  /** one line for the parent, shown on the end card */
  learned: string;
  /** kid-sized fun fact, spoken aloud. Replaces "15000 pounds". */
  funFact: string;
}

/* =================================================================== */
/* Shared ingredient bank                                              */
/* =================================================================== */

const I = {
  flour: { icon: '🌾', name: 'flour' },
  egg: { icon: '🥚', name: 'an egg' },
  milk: { icon: '🥛', name: 'milk' },
  honey: { icon: '🍯', name: 'honey' },
  butter: { icon: '🧈', name: 'butter' },
  choc: { icon: '🍫', name: 'chocolate' },
  bread: { icon: '🍞', name: 'bread' },
  cheese: { icon: '🧀', name: 'cheese' },
  tomato: { icon: '🍅', name: 'a tomato' },
  lettuce: { icon: '🥬', name: 'lettuce' },
  patty: { icon: '🥩', name: 'the patty' },
  mushroom: { icon: '🍄', name: 'mushrooms' },
  cucumber: { icon: '🥒', name: 'cucumber' },
  carrot: { icon: '🥕', name: 'a carrot' },
  corn: { icon: '🌽', name: 'corn' },
  broccoli: { icon: '🥦', name: 'broccoli' },
  orange: { icon: '🍊', name: 'an orange' },
  lemon: { icon: '🍋', name: 'a lemon' },
  apple: { icon: '🍏', name: 'an apple' },
  grapes: { icon: '🍇', name: 'grapes' },
  strawberry: { icon: '🍓', name: 'a strawberry' },
  banana: { icon: '🍌', name: 'a banana' },
  // decoys — silly, never gross
  sock: { icon: '🧦', name: 'a sock' },
  ball: { icon: '⚽', name: 'a football' },
  phone: { icon: '📱', name: 'a phone' },
  crayon: { icon: '🖍️', name: 'a crayon' },
  duck: { icon: '🦆', name: 'a duck' },
  boot: { icon: '🥾', name: 'a boot' },
  chilli: { icon: '🌶️', name: 'a hot chilli' },
  onion: { icon: '🧅', name: 'an onion' },
};

const SILLY = [I.sock, I.ball, I.phone, I.crayon, I.duck, I.boot];

/* =================================================================== */
/* The recipes — one per existing Cooking Studio skill id              */
/* =================================================================== */

export const COOKING_RECIPES: Record<string, Recipe> = {
  /* ---------------------------------------------------------------- */
  baking: {
    id: 'baking',
    title: 'Cake Baking',
    hook: "Let's bake a birthday cake!",
    result: { icon: '🎂', name: 'birthday cake' },
    learned: 'Measuring · following 5 steps in order · patience while it bakes',
    funFact: 'The biggest cake ever made was as heavy as three elephants!',
    steps: [
      {
        kind: 'gather',
        say: 'Drag the baking things into the bowl!',
        vessel: { icon: '🥣', label: 'mixing bowl' },
        need: [I.flour, I.egg, I.butter],
        decoys: [I.sock, I.ball, I.chilli, I.phone],
        decoyQuip: "That doesn't go in a cake! Silly.",
      },
      {
        kind: 'pour',
        say: 'Hold to pour the milk. Stop at the line!',
        target: 60,
        tolerance: 14,
        liquid: { icon: '🥛', name: 'milk', color: '#FDFBF4' },
        amountLabel: 'one cup of milk',
      },
      {
        kind: 'stir',
        say: 'Now stir! Go round and round with your finger.',
        turns: 4,
        vesselIcon: '🥣',
        fromColor: '#F2E4C7',
        toColor: '#F6D89A',
        becomes: 'smooth cake batter',
      },
      {
        kind: 'time',
        say: 'Into the oven! Tap when the cake is golden.',
        zoneStart: 62,
        zoneWidth: 22,
        speed: 42,
        sceneIcon: '🎂',
        actionLabel: 'Take it out!',
        lateQuip: 'Oops, a bit toasty! Try again.',
      },
      {
        kind: 'decorate',
        say: 'Your cake! Decorate it however you like.',
        base: '🎂',
        frostings: [
          { name: 'strawberry pink', color: '#FF8FB1' },
          { name: 'chocolate', color: '#8B5A3C' },
          { name: 'sky blue', color: '#7EC8F0' },
          { name: 'lemon yellow', color: '#FFD966' },
          { name: 'mint green', color: '#8FDCA6' },
          { name: 'grape purple', color: '#B79CEB' },
        ],
        toppings: [
          { icon: '🍓', name: 'strawberry' },
          { icon: '🫐', name: 'blueberry' },
          { icon: '🍒', name: 'cherry' },
          { icon: '⭐', name: 'star' },
          { icon: '🕯️', name: 'candle' },
          { icon: '🍬', name: 'sweet' },
          { icon: '🌈', name: 'rainbow' },
          { icon: '❤️', name: 'heart' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  pancake: {
    id: 'pancake',
    title: 'Fluffy Pancakes',
    hook: 'Pancakes for breakfast! Ready?',
    result: { icon: '🥞', name: 'pancake stack' },
    learned: 'Mixing · timing a flip · what happens when batter heats up',
    funFact: 'Some people can flip a pancake higher than a door!',
    steps: [
      {
        kind: 'gather',
        say: 'Put the pancake things in the bowl.',
        vessel: { icon: '🥣', label: 'mixing bowl' },
        need: [I.flour, I.egg, I.butter],
        decoys: [I.boot, I.duck, I.onion],
      },
      {
        kind: 'pour',
        say: 'Pour the milk up to the line.',
        target: 45,
        tolerance: 15,
        liquid: { icon: '🥛', name: 'milk', color: '#FDFBF4' },
        amountLabel: 'half a cup of milk',
      },
      {
        kind: 'stir',
        say: 'Stir until it is smooth and runny.',
        turns: 3,
        vesselIcon: '🥣',
        fromColor: '#EFE3CA',
        toColor: '#F8E8C2',
        becomes: 'pancake batter',
      },
      {
        kind: 'time',
        say: 'Flip it when the edges go golden!',
        zoneStart: 55,
        zoneWidth: 26,
        speed: 50,
        sceneIcon: '🥞',
        actionLabel: 'Flip!',
        lateQuip: 'A little dark on that side! Go again.',
      },
      {
        kind: 'decorate',
        say: 'Top your pancakes!',
        base: '🥞',
        frostings: [
          { name: 'maple syrup', color: '#C77D3A' },
          { name: 'chocolate sauce', color: '#6B4226' },
          { name: 'strawberry sauce', color: '#F17A93' },
        ],
        toppings: [
          { icon: '🍓', name: 'strawberry' },
          { icon: '🍌', name: 'banana' },
          { icon: '🫐', name: 'blueberry' },
          { icon: '🧈', name: 'butter' },
          { icon: '🍯', name: 'honey' },
          { icon: '🥜', name: 'nuts' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  pizza: {
    id: 'pizza',
    title: 'Pizza Parlour',
    hook: 'A customer is waiting for a pizza!',
    result: { icon: '🍕', name: 'pizza' },
    learned: 'Listening to an order · layering in order · fractions when slicing',
    funFact: 'The very first pizza had no cheese on it at all!',
    steps: [
      {
        kind: 'gather',
        say: 'Build the pizza. Sauce and cheese first!',
        vessel: { icon: '🫓', label: 'pizza base' },
        need: [I.tomato, I.cheese, I.mushroom],
        decoys: [I.crayon, I.sock, I.apple, I.phone],
        decoyQuip: 'On a pizza? Yuck! Try something else.',
      },
      {
        kind: 'time',
        say: 'Into the hot oven. Tap when the cheese bubbles!',
        zoneStart: 58,
        zoneWidth: 24,
        speed: 46,
        sceneIcon: '🍕',
        actionLabel: 'Out it comes!',
        lateQuip: 'Crispy! Maybe a bit too crispy.',
      },
      {
        kind: 'decorate',
        say: 'Finish your pizza the way you like it.',
        base: '🍕',
        frostings: [
          { name: 'tomato sauce', color: '#E3502F' },
          { name: 'white sauce', color: '#F3EBDC' },
          { name: 'pesto', color: '#7BA83F' },
        ],
        toppings: [
          { icon: '🍄', name: 'mushroom' },
          { icon: '🫒', name: 'olive' },
          { icon: '🌽', name: 'corn' },
          { icon: '🧀', name: 'cheese' },
          { icon: '🍅', name: 'tomato' },
          { icon: '🌶️', name: 'pepper' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  sandwich: {
    id: 'sandwich',
    title: 'Sandwich Stack',
    hook: "Let's build a big sandwich!",
    result: { icon: '🥪', name: 'sandwich' },
    learned: 'Stacking in order · naming vegetables · top and bottom',
    funFact: 'The tallest sandwich ever was taller than a grown-up!',
    steps: [
      {
        kind: 'gather',
        say: 'Stack it up! Everything into the sandwich.',
        vessel: { icon: '🍞', label: 'bottom slice' },
        need: [I.lettuce, I.tomato, I.cheese],
        decoys: [I.ball, I.crayon, I.duck],
      },
      {
        kind: 'decorate',
        say: 'Add whatever you like on top!',
        base: '🥪',
        frostings: [
          { name: 'butter', color: '#F6DE9B' },
          { name: 'ketchup', color: '#D93A2B' },
          { name: 'mayo', color: '#F7F2E4' },
        ],
        toppings: [
          { icon: '🥬', name: 'lettuce' },
          { icon: '🍅', name: 'tomato' },
          { icon: '🥒', name: 'cucumber' },
          { icon: '🧀', name: 'cheese' },
          { icon: '🥚', name: 'egg' },
          { icon: '🫒', name: 'olive' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  burger: {
    id: 'burger',
    title: 'Burger Build',
    hook: 'Build the biggest burger you can!',
    result: { icon: '🍔', name: 'burger' },
    learned: 'Order and layers · following an order · grill timing',
    funFact: 'People eat enough burgers each day to circle the whole world!',
    steps: [
      {
        kind: 'gather',
        say: 'Get the burger things ready.',
        vessel: { icon: '🍞', label: 'bun' },
        need: [I.patty, I.cheese, I.lettuce],
        decoys: [I.sock, I.phone, I.grapes],
      },
      {
        kind: 'time',
        say: 'Cook the patty. Tap when it is just right!',
        zoneStart: 60,
        zoneWidth: 22,
        speed: 48,
        sceneIcon: '🍔',
        actionLabel: 'Off the grill!',
        lateQuip: 'A bit burnt! One more go.',
      },
      {
        kind: 'decorate',
        say: 'Your burger, your rules.',
        base: '🍔',
        frostings: [
          { name: 'ketchup', color: '#D93A2B' },
          { name: 'mustard', color: '#E8B830' },
          { name: 'burger sauce', color: '#EFA36B' },
        ],
        toppings: [
          { icon: '🥬', name: 'lettuce' },
          { icon: '🍅', name: 'tomato' },
          { icon: '🧀', name: 'cheese' },
          { icon: '🥒', name: 'pickle' },
          { icon: '🧅', name: 'onion' },
          { icon: '🥓', name: 'bacon' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  smoothie: {
    id: 'smoothie',
    title: 'Smoothie Bar',
    hook: 'Blend a cold, fruity smoothie!',
    result: { icon: '🥤', name: 'smoothie' },
    learned: 'Half and quarter measures · naming fruits · mixing colours',
    funFact: 'Bananas are berries, but strawberries are not. Strange!',
    steps: [
      {
        kind: 'gather',
        say: 'Put the fruit in the blender!',
        vessel: { icon: '🫙', label: 'blender' },
        need: [I.strawberry, I.banana],
        decoys: [I.chilli, I.onion, I.boot, I.ball],
        decoyQuip: 'In a smoothie? That would taste funny!',
      },
      {
        kind: 'pour',
        say: 'Pour milk to the half line.',
        target: 50,
        tolerance: 12,
        liquid: { icon: '🥛', name: 'milk', color: '#FDFBF4' },
        amountLabel: 'half a cup of milk',
      },
      {
        kind: 'stir',
        say: 'Blend it! Spin your finger fast.',
        turns: 5,
        vesselIcon: '🫙',
        fromColor: '#FFD9E3',
        toColor: '#FF7FA6',
        becomes: 'a pink smoothie',
      },
      {
        kind: 'decorate',
        say: 'Dress up your drink!',
        base: '🥤',
        frostings: [
          { name: 'strawberry pink', color: '#FF7FA6' },
          { name: 'mango orange', color: '#FFB03A' },
          { name: 'blueberry blue', color: '#7C8CE0' },
          { name: 'kiwi green', color: '#8FCB5C' },
        ],
        toppings: [
          { icon: '🍓', name: 'strawberry' },
          { icon: '🥝', name: 'kiwi' },
          { icon: '🍒', name: 'cherry' },
          { icon: '🌈', name: 'sprinkles' },
          { icon: '⭐', name: 'star' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  juice: {
    id: 'juice',
    title: 'Fresh Juice',
    hook: 'Squeeze some fresh juice!',
    result: { icon: '🧃', name: 'fresh juice' },
    learned: 'Which fruits make juice · squeezing · filling to a line',
    funFact: 'It takes about three whole oranges to fill one glass!',
    steps: [
      {
        kind: 'gather',
        say: 'Only fruit that squeezes! Into the juicer.',
        vessel: { icon: '🍹', label: 'juicer' },
        need: [I.orange, I.lemon, I.apple],
        decoys: [I.carrot, I.sock, I.duck, I.bread],
        decoyQuip: 'That one will not squeeze!',
      },
      {
        kind: 'stir',
        say: 'Squeeze! Turn it round and round.',
        turns: 4,
        vesselIcon: '🍹',
        fromColor: '#FFE9B8',
        toColor: '#FFA92E',
        becomes: 'fresh orange juice',
      },
      {
        kind: 'pour',
        say: 'Fill the glass right to the line.',
        target: 75,
        tolerance: 12,
        liquid: { icon: '🧃', name: 'juice', color: '#FFA92E' },
        amountLabel: 'a full glass',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  cookie: {
    id: 'cookie',
    title: 'Cookie Bake',
    hook: 'Warm cookies coming up!',
    result: { icon: '🍪', name: 'cookies' },
    learned: 'Mixing · oven timing · counting how many you made',
    funFact: 'Chocolate chip cookies were invented completely by accident!',
    steps: [
      {
        kind: 'gather',
        say: 'Cookie things in the bowl!',
        vessel: { icon: '🥣', label: 'mixing bowl' },
        need: [I.flour, I.butter, I.choc],
        decoys: [I.chilli, I.phone, I.corn],
      },
      {
        kind: 'stir',
        say: 'Mix it into cookie dough.',
        turns: 4,
        vesselIcon: '🥣',
        fromColor: '#EBDCC0',
        toColor: '#C89B6A',
        becomes: 'cookie dough',
      },
      {
        kind: 'time',
        say: 'Bake them! Tap when they turn golden.',
        zoneStart: 60,
        zoneWidth: 20,
        speed: 50,
        sceneIcon: '🍪',
        actionLabel: 'Out of the oven!',
        lateQuip: 'Ooh, crunchy! Try again.',
      },
      {
        kind: 'decorate',
        say: 'Decorate your cookies!',
        base: '🍪',
        frostings: [
          { name: 'white icing', color: '#F7F2E4' },
          { name: 'pink icing', color: '#FF8FB1' },
          { name: 'chocolate', color: '#7A4B2B' },
        ],
        toppings: [
          { icon: '🍫', name: 'chocolate chip' },
          { icon: '🌈', name: 'sprinkles' },
          { icon: '⭐', name: 'star' },
          { icon: '❤️', name: 'heart' },
          { icon: '🥜', name: 'nut' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  cupcake: {
    id: 'cupcake',
    title: 'Cupcake Decorating',
    hook: 'Six plain cupcakes need your help!',
    result: { icon: '🧁', name: 'cupcake' },
    learned: 'Colour choices · patterns · making something your own',
    funFact: 'Cupcakes got their name because they were baked in teacups!',
    steps: [
      {
        kind: 'pour',
        say: 'Pour the batter into the case. Not too full!',
        target: 55,
        tolerance: 13,
        liquid: { icon: '🧁', name: 'batter', color: '#F6D89A' },
        amountLabel: 'just over half',
      },
      {
        kind: 'time',
        say: 'Bake them. Tap when they rise!',
        zoneStart: 58,
        zoneWidth: 26,
        speed: 44,
        sceneIcon: '🧁',
        actionLabel: 'Take them out!',
        lateQuip: 'A bit brown on top! Go again.',
      },
      {
        kind: 'decorate',
        say: 'Now the best bit. Decorate!',
        base: '🧁',
        frostings: [
          { name: 'strawberry pink', color: '#FF8FB1' },
          { name: 'sky blue', color: '#7EC8F0' },
          { name: 'lemon yellow', color: '#FFD966' },
          { name: 'mint green', color: '#8FDCA6' },
          { name: 'grape purple', color: '#B79CEB' },
          { name: 'chocolate', color: '#8B5A3C' },
        ],
        toppings: [
          { icon: '🍓', name: 'strawberry' },
          { icon: '🍒', name: 'cherry' },
          { icon: '🌈', name: 'sprinkles' },
          { icon: '⭐', name: 'star' },
          { icon: '❤️', name: 'heart' },
          { icon: '🍬', name: 'sweet' },
          { icon: '🦋', name: 'butterfly' },
          { icon: '🕯️', name: 'candle' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  salad: {
    id: 'salad',
    title: 'Healthy Salad',
    hook: 'Make a crunchy rainbow salad!',
    result: { icon: '🥗', name: 'salad' },
    learned: 'Naming vegetables · eating a rainbow · chopping safely',
    funFact: 'Cucumbers are almost all water — like a drink you can chew!',
    steps: [
      {
        kind: 'scrub',
        say: 'Wash the vegetables first. Rub them clean!',
        distance: 900,
        dirtyIcon: '🥬',
        cleanIcon: '🥬',
      },
      {
        kind: 'gather',
        say: 'Now into the bowl. Vegetables only!',
        vessel: { icon: '🥗', label: 'salad bowl' },
        need: [I.lettuce, I.tomato, I.cucumber, I.carrot],
        decoys: [I.choc, I.crayon, I.ball],
        decoyQuip: 'Not in a salad! Find a vegetable.',
      },
      {
        kind: 'decorate',
        say: 'Finish your salad.',
        base: '🥗',
        frostings: [
          { name: 'olive oil', color: '#C6D25A' },
          { name: 'creamy dressing', color: '#F4EBD6' },
          { name: 'balsamic', color: '#6A4130' },
        ],
        toppings: [
          { icon: '🌽', name: 'corn' },
          { icon: '🥦', name: 'broccoli' },
          { icon: '🫒', name: 'olive' },
          { icon: '🧀', name: 'cheese' },
          { icon: '🥕', name: 'carrot' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  vegwash: {
    id: 'vegwash',
    title: 'Wash the Veggies',
    hook: 'These vegetables came straight from the garden!',
    result: { icon: '✨', name: 'clean vegetables' },
    learned: 'Why we wash food · scrubbing · effort makes a change',
    funFact: 'Carrots used to be purple before they were orange!',
    steps: [
      { kind: 'scrub', say: 'Scrub the carrot clean!', distance: 700, dirtyIcon: '🥕', cleanIcon: '🥕' },
      { kind: 'scrub', say: 'Now the potato. Rub, rub, rub!', distance: 800, dirtyIcon: '🥔', cleanIcon: '🥔' },
      { kind: 'scrub', say: 'Last one — the broccoli!', distance: 700, dirtyIcon: '🥦', cleanIcon: '🥦' },
    ],
  },

  /* ---------------------------------------------------------------- */
  mixing: {
    id: 'mixing',
    title: 'Mixing Bowl',
    hook: 'Time to mix like a real chef!',
    result: { icon: '🥣', name: 'perfect mix' },
    learned: 'Wet and dry ingredients · stirring until smooth · measuring',
    funFact: 'Chefs stir one way only — it stops lumps forming!',
    steps: [
      {
        kind: 'gather',
        say: 'Dry things first — into the bowl!',
        vessel: { icon: '🥣', label: 'mixing bowl' },
        need: [I.flour, I.honey],
        decoys: [I.sock, I.duck, I.phone],
      },
      {
        kind: 'pour',
        say: 'Now the milk, up to the line.',
        target: 40,
        tolerance: 14,
        liquid: { icon: '🥛', name: 'milk', color: '#FDFBF4' },
        amountLabel: 'a small splash of milk',
      },
      {
        kind: 'stir',
        say: 'Stir until every lump is gone!',
        turns: 5,
        vesselIcon: '🥣',
        fromColor: '#EDE0C4',
        toColor: '#F7E7BE',
        becomes: 'a smooth mix',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  safety: {
    id: 'safety',
    title: 'Kitchen Safety',
    hook: 'Before we cook — let us be safe!',
    result: { icon: '✅', name: 'safe chef' },
    learned: 'Kitchen safety · washing hands · what is hot and what is not',
    funFact: 'Chefs wash their hands more than twenty times a day!',
    steps: [
      {
        kind: 'scrub',
        say: 'Wash your hands. Keep going — twenty seconds!',
        distance: 1200,
        dirtyIcon: '🖐️',
        cleanIcon: '✨',
      },
      {
        kind: 'gather',
        say: 'Grab the safe kitchen things.',
        vessel: { icon: '🧰', label: 'safety kit' },
        need: [
          { icon: '🧤', name: 'oven gloves' },
          { icon: '🥽', name: 'goggles' },
          { icon: '🧼', name: 'soap' },
        ],
        decoys: [
          { icon: '🔥', name: 'fire' },
          { icon: '🔪', name: 'a sharp knife' },
          { icon: '⚡', name: 'electricity' },
          I.ball,
        ],
        decoyQuip: 'Careful! That one is for grown-ups.',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  recipe: {
    id: 'recipe',
    title: 'Follow the Recipe',
    hook: 'A real chef follows every step!',
    result: { icon: '👨‍🍳', name: 'chef' },
    learned: 'Reading steps in order · measuring · finishing what you start',
    funFact: 'The oldest recipe ever found is nearly four thousand years old!',
    steps: [
      {
        kind: 'gather',
        say: 'Step one — get everything ready.',
        vessel: { icon: '🥣', label: 'work bowl' },
        need: [I.flour, I.egg, I.butter, I.honey],
        decoys: [I.crayon, I.boot],
      },
      {
        kind: 'pour',
        say: 'Step two — measure the milk exactly.',
        target: 50,
        tolerance: 8,
        liquid: { icon: '🥛', name: 'milk', color: '#FDFBF4' },
        amountLabel: 'exactly half a cup',
      },
      {
        kind: 'stir',
        say: 'Step three — mix it well.',
        turns: 4,
        vesselIcon: '🥣',
        fromColor: '#EFE1C3',
        toColor: '#F8E4B6',
        becomes: 'a perfect mixture',
      },
      {
        kind: 'time',
        say: 'Step four — bake it just right.',
        zoneStart: 60,
        zoneWidth: 20,
        speed: 48,
        sceneIcon: '🍞',
        actionLabel: 'Done!',
        lateQuip: 'Too long! A real chef watches the clock.',
      },
    ],
  },
};

export const getRecipe = (skillId: string): Recipe | null =>
  COOKING_RECIPES[skillId] ?? null;

export const hasRecipe = (skillId: string): boolean => skillId in COOKING_RECIPES;

/** Unused today, but keeps the silly-decoy bank importable for other categories. */
export const SILLY_DECOYS = SILLY;
