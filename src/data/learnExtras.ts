// ============================================================
// NEW LEARN CATEGORIES (batch 1)
// Days, Months, Seasons, Opposites, Feelings, Weather, Clothes,
// Sea Animals, Insects, Food & Drinks
// ============================================================
//
// Same shape as the other Learn data in gameData.ts (LearnItem).
// Every picture is an emoji from Unicode 11 or older so it shows on old
// Android phones. Where there is no good picture, the item is left out.

import type { LearnItem, LearnCategory } from './gameData';

/** A Learn category that can be flagged NEW on the Learn screen. */
export type NewableLearnCategory = LearnCategory & { isNew?: boolean };

/**
 * Categories in this file are shown first and marked NEW until this date.
 * After it passes they quietly move to the end of the list with no badge.
 * To keep the badge longer or shorter, change this one date.
 */
export const NEW_UNTIL = new Date('2026-12-31T23:59:59');
export const isNewPeriod = (now: Date = new Date()): boolean => now.getTime() <= NEW_UNTIL.getTime();

const make = (category: string, rows: [string, string, string?][]): LearnItem[] =>
  rows.map(([name, emoji, funFact]) => ({
    id: `${category}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    emoji,
    category,
    ...(funFact ? { funFact } : {}),
  }));

// ---------- Days of the week (drawn as calendar pages by DayGlyph; emoji is only a fallback) ----------
export const daysData: LearnItem[] = make('days', [
  ['Monday', '1️⃣', 'Monday is the 1st day of the week.'],
  ['Tuesday', '2️⃣', 'Tuesday is the 2nd day of the week.'],
  ['Wednesday', '3️⃣', 'Wednesday is the 3rd day of the week. It is in the middle!'],
  ['Thursday', '4️⃣', 'Thursday is the 4th day of the week.'],
  ['Friday', '5️⃣', 'Friday is the 5th day of the week.'],
  ['Saturday', '6️⃣', 'Saturday is the 6th day of the week.'],
  ['Sunday', '7️⃣', 'Sunday is the 7th day of the week. There are 7 days in a week!'],
]);

// ---------- Months ----------
export const monthsData: LearnItem[] = make('months', [
  ['January', '⛄', 'January is the 1st month of the year.'],
  ['February', '💝', 'February is the shortest month.'],
  ['March', '🌬️', 'March is the 3rd month. It can be very windy!'],
  ['April', '🌧️', 'April is the 4th month. Spring showers fall.'],
  ['May', '🌷', 'May is the 5th month. Flowers bloom.'],
  ['June', '☀️', 'June is the 6th month. The days are long and sunny.'],
  ['July', '🏖️', 'July is the 7th month. Time for the beach!'],
  ['August', '🍉', 'August is the 8th month. Watermelon time!'],
  ['September', '🎒', 'September is the 9th month. Back to school!'],
  ['October', '🍂', 'October is the 10th month. Leaves fall down.'],
  ['November', '🌫️', 'November is the 11th month. Misty mornings.'],
  ['December', '❄️', 'December is the 12th and last month of the year.'],
]);

// ---------- Seasons ----------
export const seasonsData: LearnItem[] = make('seasons', [
  ['Spring', '🌸', 'In spring, flowers bloom and baby animals are born.'],
  ['Summer', '☀️', 'Summer is the hottest season.'],
  ['Autumn', '🍁', 'In autumn, leaves turn red and orange and fall down.'],
  ['Winter', '❄️', 'Winter is the coldest season.'],
]);

// ---------- Opposites (each word shows its opposite in the fun fact) ----------
const opp = (a: [string, string], b: [string, string]): [string, string, string][] => [
  [a[0], a[1], `The opposite of ${a[0].toLowerCase()} is ${b[0].toLowerCase()}!`],
  [b[0], b[1], `The opposite of ${b[0].toLowerCase()} is ${a[0].toLowerCase()}!`],
];
export const oppositesData: LearnItem[] = make('opposites', [
  ...opp(['Hot', '🔥'], ['Cold', '🥶']),
  ...opp(['Big', '🐘'], ['Small', '🐜']),
  ...opp(['Fast', '🐆'], ['Slow', '🐢']),
  ...opp(['Happy', '😀'], ['Sad', '😢']),
  ...opp(['Day', '☀️'], ['Night', '🌙']),
  ...opp(['Up', '⬆️'], ['Down', '⬇️']),
  ...opp(['Open', '📖'], ['Closed', '📕']),
  ...opp(['Wet', '💧'], ['Dry', '🏜️']),
  ...opp(['Old', '👴'], ['Young', '👶']),
  ...opp(['Loud', '📣'], ['Quiet', '🤫']),
]);

// ---------- Feelings ----------
export const feelingsData: LearnItem[] = make('feelings', [
  ['Happy', '😀', 'We smile when we feel happy.'],
  ['Sad', '😢', 'It is okay to feel sad. A hug can help!'],
  ['Angry', '😠', 'When we are angry, we can take a deep breath.'],
  ['Scared', '😨', 'We feel scared when something frightens us.'],
  ['Surprised', '😮', 'We feel surprised when something happens suddenly!'],
  ['Sleepy', '😴', 'We feel sleepy when we need to rest.'],
  ['Excited', '🤩', 'We feel excited about a fun trip or a party!'],
  ['Shy', '😳', 'It is okay to feel shy when we meet new people.'],
  ['Sick', '🤒', 'When we feel sick, we rest and drink water.'],
  ['Loved', '😍', 'We feel loved when our family hugs us.'],
  ['Worried', '😟', 'Talk to someone you trust when you feel worried.'],
  ['Silly', '😜', 'Being silly and laughing is fun!'],
]);

// ---------- Weather ----------
export const weatherData: LearnItem[] = make('weather', [
  ['Sunny', '☀️', 'The sun makes the day bright and warm.'],
  ['Cloudy', '☁️', 'Clouds cover the sky on a cloudy day.'],
  ['Rainy', '🌧️', 'Rain falls from the clouds.'],
  ['Windy', '🌬️', 'Wind moves the leaves and flies kites.'],
  ['Snowy', '❄️', 'Snow is frozen water that falls from the sky.'],
  ['Stormy', '⛈️', 'A storm has thunder and lightning.'],
  ['Foggy', '🌫️', 'Fog is a cloud close to the ground.'],
  ['Rainbow', '🌈', 'A rainbow has 7 colours. It appears after rain!'],
]);

// ---------- Clothes ----------
export const clothesData: LearnItem[] = make('clothes', [
  ['Shirt', '👕', 'We wear a shirt on top.'],
  ['Pants', '👖', 'We wear pants on our legs.'],
  ['Dress', '👗', 'A dress is one piece of clothing.'],
  ['Coat', '🧥', 'We wear a coat to keep warm.'],
  ['Hat', '👒', 'A hat keeps the sun off our head.'],
  ['Shoes', '👟', 'We wear shoes on our feet.'],
  ['Boots', '👢', 'Boots keep our feet dry in the rain.'],
  ['Socks', '🧦', 'Socks keep our feet warm inside our shoes.'],
  ['Gloves', '🧤', 'Gloves keep our hands warm.'],
  ['Scarf', '🧣', 'A scarf keeps our neck warm.'],
  ['Sunglasses', '🕶️', 'Sunglasses protect our eyes from the sun.'],
  ['Umbrella', '☂️', 'An umbrella keeps us dry in the rain.'],
]);

// ---------- Sea animals ----------
export const seaAnimalsData: LearnItem[] = make('sea', [
  ['Fish', '🐟', 'Fish breathe underwater with gills.'],
  ['Dolphin', '🐬', 'Dolphins are very clever and love to jump.'],
  ['Whale', '🐳', 'The blue whale is the biggest animal in the world!'],
  ['Shark', '🦈', 'Sharks have lots of teeth.'],
  ['Octopus', '🐙', 'An octopus has 8 arms.'],
  ['Crab', '🦀', 'Crabs walk sideways.'],
  ['Turtle', '🐢', 'Sea turtles swim in the ocean.'],
  ['Shrimp', '🦐', 'A shrimp is a tiny sea animal.'],
  ['Squid', '🦑', 'A squid has 10 arms.'],
  ['Lobster', '🦞', 'A lobster has two big claws.'],
  ['Pufferfish', '🐡', 'A pufferfish puffs up like a ball!'],
  ['Tropical Fish', '🐠', 'Tropical fish live in warm, colourful reefs.'],
]);

// ---------- Insects ----------
export const insectsData: LearnItem[] = make('insects', [
  ['Bee', '🐝', 'Bees make honey and visit flowers.'],
  ['Butterfly', '🦋', 'A caterpillar grows into a butterfly!'],
  ['Ladybug', '🐞', 'A ladybug is red with black spots.'],
  ['Ant', '🐜', 'Ants are tiny but very strong.'],
  ['Caterpillar', '🐛', 'A caterpillar eats leaves and grows big.'],
  ['Cricket', '🦗', 'Crickets chirp at night.'],
  ['Mosquito', '🦟', 'Mosquitoes are tiny insects that bite.'],
  ['Snail', '🐌', 'A snail carries its house on its back.'],
  ['Spider', '🕷️', 'A spider has 8 legs and spins a web.'],
]);

// ---------- Food & drinks ----------
export const foodData: LearnItem[] = make('food', [
  ['Bread', '🍞', 'Bread is made from flour.'],
  ['Egg', '🥚', 'Eggs come from hens.'],
  ['Cheese', '🧀', 'Cheese is made from milk.'],
  ['Rice', '🍚', 'Rice grows in wet fields.'],
  ['Pizza', '🍕', 'Pizza is round and cut into slices.'],
  ['Burger', '🍔', 'A burger has a bun, and a patty inside.'],
  ['Chicken', '🍗', 'Chicken gives us protein to grow strong.'],
  ['Noodles', '🍜', 'Noodles are long and slurpy!'],
  ['Cake', '🍰', 'We eat cake on birthdays.'],
  ['Ice Cream', '🍦', 'Ice cream is cold and sweet.'],
  ['Cookie', '🍪', 'Cookies are baked in the oven.'],
  ['Honey', '🍯', 'Bees make honey.'],
  ['Milk', '🥛', 'Milk makes our bones strong.'],
  ['Water', '💧', 'Water keeps our body healthy. Drink lots!'],
  ['Juice', '🍹', 'Juice is made by squeezing fruit.'],
  ['Tea', '🍵', 'Tea is a warm drink.'],
]);

// ---------- Category cards (match the shape of learnCategories in gameData.ts) ----------
export const extraLearnCategories: LearnCategory[] = [
  { id: 'days', name: 'Days', emoji: '📅', color: '#6366f1', gradient: 'from-indigo-400 to-blue-500', items: daysData },
  { id: 'months', name: 'Months', emoji: '🗓️', color: '#ec4899', gradient: 'from-pink-400 to-rose-500', items: monthsData },
  { id: 'seasons', name: 'Seasons', emoji: '🍁', color: '#f97316', gradient: 'from-orange-400 to-amber-500', items: seasonsData },
  { id: 'opposites', name: 'Opposites', emoji: '↔️', color: '#14b8a6', gradient: 'from-teal-400 to-emerald-500', items: oppositesData },
  { id: 'feelings', name: 'Feelings', emoji: '😊', color: '#f59e0b', gradient: 'from-yellow-400 to-orange-400', items: feelingsData },
  { id: 'weather', name: 'Weather', emoji: '⛅', color: '#0ea5e9', gradient: 'from-sky-400 to-blue-500', items: weatherData },
  { id: 'clothes', name: 'Clothes', emoji: '👕', color: '#a855f7', gradient: 'from-purple-400 to-fuchsia-500', items: clothesData },
  { id: 'sea', name: 'Sea Animals', emoji: '🐠', color: '#0891b2', gradient: 'from-cyan-400 to-blue-500', items: seaAnimalsData },
  { id: 'insects', name: 'Insects', emoji: '🐞', color: '#65a30d', gradient: 'from-lime-400 to-green-500', items: insectsData },
  { id: 'food', name: 'Food & Drinks', emoji: '🍔', color: '#ef4444', gradient: 'from-red-400 to-orange-500', items: foodData },
];
