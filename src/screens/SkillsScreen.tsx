import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import Celebration from '../components/Celebration';
import { careerCategories, SkillCategory, SkillItem } from '../data/gameData';
import { GameProgress } from '../store/gameStore';

interface SkillsScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type View = 'career-select' | 'skill-list' | 'skill-detail';

// Activity data for each skill - defines what items to collect/assemble
const SKILL_ACTIVITIES: Record<string, {
  intro: string;
  correctItems: string[];
  allItems: string[];
  finalResult: string;
  successMessage: string;
}> = {
  // ============================================
  // 🍳 COOKING STUDIO
  // ============================================
  'sandwich': {
    intro: 'Build a yummy sandwich!',
    correctItems: ['🍞', '🥬', '🍅', '🧀', '🍞'],
    allItems: ['🍞', '🧀', '🍅', '🥬', '🍔', '🍟', '🍦', '🍿', '🍫', '🥚'],
    finalResult: '🥪',
    successMessage: 'Delicious sandwich ready!'
  },
  'baking': {
    intro: 'Bake a delicious cake!',
    correctItems: ['🌾', '🥚', '🥛', '🍯', '🎂'],
    allItems: ['🌾', '🥚', '🥛', '🍯', '🎂', '🍅', '🥩', '🌶️', '🧅', '🥕'],
    finalResult: '🎂',
    successMessage: 'Yummy cake baked!'
  },
  'cupcake': {
    intro: 'Decorate colorful cupcakes!',
    correctItems: ['🧁', '🍓', '🍫', '🌈', '⭐'],
    allItems: ['🧁', '🍓', '🍫', '🌈', '⭐', '🥕', '🥬', '🌶️', '🧅', '🥩'],
    finalResult: '🧁',
    successMessage: 'Beautiful cupcakes!'
  },
  'pizza': {
    intro: 'Make a tasty pizza!',
    correctItems: ['🍞', '🍅', '🧀', '🌶️', '🍄'],
    allItems: ['🍞', '🧀', '🍅', '🥩', '🌶️', '🥬', '🍄', '🥒', '🧅', '🍎'],
    finalResult: '🍕',
    successMessage: 'Delicious pizza ready!'
  },
  'burger': {
    intro: 'Build the perfect burger!',
    correctItems: ['🍞', '🥩', '🧀', '🥬', '🍅'],
    allItems: ['🍞', '🥩', '🧀', '🥬', '🍅', '🥕', '🍎', '🍿', '🍇', '🥭'],
    finalResult: '🍔',
    successMessage: 'Perfect burger!'
  },
  'juice': {
    intro: 'Squeeze fresh juice!',
    correctItems: ['🍊', '🍋', '🍏', '🍇'],
    allItems: ['🍊', '🍋', '🍏', '🍇', '🍅', '🥕', '🥩', '🧀', '🍔', '🍟'],
    finalResult: '🧃',
    successMessage: 'Fresh juice made!'
  },
  'vegwash': {
    intro: 'Wash the vegetables!',
    correctItems: ['🥬', '🥕', '🥒', '🌽', '🥦'],
    allItems: ['🥬', '🥕', '🥒', '🌽', '🥦', '🍦', '🍫', '🍔', '🍿', '🎂'],
    finalResult: '✨',
    successMessage: 'All clean and fresh!'
  },
  'mixing': {
    intro: 'Mix ingredients together!',
    correctItems: ['🥛', '🥚', '🌾', '🍯'],
    allItems: ['🥛', '🥚', '🌾', '🍯', '🌶️', '🧅', '🍔', '🍟', '🍕', '🥩'],
    finalResult: '🥣',
    successMessage: 'Well mixed!'
  },
  'safety': {
    intro: 'Choose safe kitchen items!',
    correctItems: ['🧤', '🧯', '🧼', '🥽'],
    allItems: ['🧤', '🧯', '🧼', '🥽', '🎮', '🎪', '🎨', '⚽', '🎈', '🎭'],
    finalResult: '✅',
    successMessage: 'Safety first!'
  },
  'recipe': {
    intro: 'Follow recipe steps in order!',
    correctItems: ['📖', '🥣', '🥄', '🍽️'],
    allItems: ['📖', '🥣', '🥄', '🍽️', '🎮', '📱', '📺', '🎧', '📚', '✏️'],
    finalResult: '👨‍🍳',
    successMessage: 'Recipe followed!'
  },
  'salad': {
    intro: 'Make a healthy salad!',
    correctItems: ['🥬', '🍅', '🥒', '🥕', '🌽'],
    allItems: ['🥬', '🍅', '🥒', '🥕', '🌽', '🍦', '🍫', '🎂', '🍔', '🍟'],
    finalResult: '🥗',
    successMessage: 'Healthy salad!'
  },
  'smoothie': {
    intro: 'Blend a yummy smoothie!',
    correctItems: ['🍓', '🍌', '🥛', '🍯'],
    allItems: ['🍓', '🍌', '🥛', '🍯', '🍔', '🥩', '🍟', '🌶️', '🧅', '🍕'],
    finalResult: '🥤',
    successMessage: 'Yummy smoothie!'
  },
  'cookie': {
    intro: 'Bake sweet cookies!',
    correctItems: ['🌾', '🥚', '🧈', '🍫'],
    allItems: ['🌾', '🥚', '🧈', '🍫', '🍅', '🥬', '🌶️', '🧅', '🥩', '🍔'],
    finalResult: '🍪',
    successMessage: 'Delicious cookies!'
  },
  'pancake': {
    intro: 'Make fluffy pancakes!',
    correctItems: ['🌾', '🥛', '🥚', '🧈'],
    allItems: ['🌾', '🥛', '🥚', '🧈', '🍔', '🍟', '🍫', '🍅', '🥬', '🍕'],
    finalResult: '🥞',
    successMessage: 'Perfect pancakes!'
  },

  // ============================================
  // 💄 BEAUTY & FASHION STUDIO
  // ============================================
  'dressup': {
    intro: 'Choose a complete outfit!',
    correctItems: ['👗', '👠', '👜', '👒'],
    allItems: ['👗', '👠', '👜', '👒', '🍕', '🚗', '📱', '🎮', '⚽', '🔨'],
    finalResult: '💃',
    successMessage: 'Stylish outfit!'
  },
  'hairstyle': {
    intro: 'Style your hair!',
    correctItems: ['💇', '💧', '🎀', '🪞'],
    allItems: ['💇', '💧', '🎀', '🪞', '🍔', '🚗', '⚽', '🎮', '📱', '🎨'],
    finalResult: '👱‍♀️',
    successMessage: 'Beautiful hair!'
  },
  'facepainting': {
    intro: 'Paint a fun design!',
    correctItems: ['🎨', '🖌️', '💧', '⭐'],
    allItems: ['🎨', '🖌️', '💧', '⭐', '🍔', '🚗', '📱', '🎮', '⚽', '📚'],
    finalResult: '🎭',
    successMessage: 'Amazing face paint!'
  },
  'nailart': {
    intro: 'Create colorful nails!',
    correctItems: ['💅', '💎', '⭐', '🌈'],
    allItems: ['💅', '💎', '⭐', '🌈', '🍔', '🚗', '⚽', '📱', '🎨', '📚'],
    finalResult: '💅',
    successMessage: 'Pretty nails!'
  },
  'accessory': {
    intro: 'Add stylish accessories!',
    correctItems: ['👜', '👒', '🕶️', '💍'],
    allItems: ['👜', '👒', '🕶️', '💍', '🍔', '🚗', '📱', '🎮', '⚽', '🎨'],
    finalResult: '✨',
    successMessage: 'So stylish!'
  },
  'colorcoord': {
    intro: 'Match beautiful colors!',
    correctItems: ['🔴', '🌸', '🌷', '❤️'],
    allItems: ['🔴', '🌸', '🌷', '❤️', '🍔', '⚽', '🚗', '📱', '🎮', '📚'],
    finalResult: '🎨',
    successMessage: 'Perfect colors!'
  },
  'fashiondesign': {
    intro: 'Design an outfit!',
    correctItems: ['✏️', '📏', '🎨', '🧵'],
    allItems: ['✏️', '📏', '🎨', '🧵', '🍔', '🚗', '⚽', '🎮', '📱', '🍕'],
    finalResult: '👗',
    successMessage: 'Amazing design!'
  },
  'jewelry': {
    intro: 'Make pretty jewelry!',
    correctItems: ['💎', '🔴', '🔵', '🟡'],
    allItems: ['💎', '🔴', '🔵', '🟡', '🍔', '🚗', '⚽', '🎮', '📱', '🎨'],
    finalResult: '📿',
    successMessage: 'Beautiful jewelry!'
  },
  'braiding': {
    intro: 'Braid the hair!',
    correctItems: ['👱‍♀️', '🎀', '💧', '🪞'],
    allItems: ['👱‍♀️', '🎀', '💧', '🪞', '🍔', '🚗', '⚽', '🎮', '📱', '📚'],
    finalResult: '👧',
    successMessage: 'Beautiful braids!'
  },
  'sewing': {
    intro: 'Sew with needle and thread!',
    correctItems: ['🧵', '🪡', '📏', '✂️'],
    allItems: ['🧵', '🪡', '📏', '✂️', '🍔', '🚗', '⚽', '🎮', '📱', '🍕'],
    finalResult: '👕',
    successMessage: 'Great sewing!'
  },

  // ============================================
  // 🔨 BUILDER WORKSHOP
  // ============================================
  'hammer': {
    intro: 'Hammer some nails!',
    correctItems: ['🔨', '📌', '🪵', '📐'],
    allItems: ['🔨', '📌', '🪵', '📐', '🍔', '🎮', '⚽', '📱', '🎨', '📚'],
    finalResult: '🏗️',
    successMessage: 'Great hammering!'
  },
  'screwdriver': {
    intro: 'Use the screwdriver!',
    correctItems: ['🪛', '🔩', '🔧', '🪵'],
    allItems: ['🪛', '🔩', '🔧', '🪵', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✅',
    successMessage: 'Well screwed in!'
  },
  'wrench': {
    intro: 'Use the wrench!',
    correctItems: ['🔧', '🔩', '⚙️', '🛠️'],
    allItems: ['🔧', '🔩', '⚙️', '🛠️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🔧',
    successMessage: 'Tight and secure!'
  },
  'measuring': {
    intro: 'Measure with tools!',
    correctItems: ['📏', '📐', '✏️', '📝'],
    allItems: ['📏', '📐', '✏️', '📝', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '📊',
    successMessage: 'Perfectly measured!'
  },
  'sawing': {
    intro: 'Cut wood safely!',
    correctItems: ['🪚', '🪵', '📐', '🥽'],
    allItems: ['🪚', '🪵', '📐', '🥽', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🪵',
    successMessage: 'Clean cut!'
  },
  'drilling': {
    intro: 'Drill some holes!',
    correctItems: ['🔩', '🪵', '📏', '🥽'],
    allItems: ['🔩', '🪵', '📏', '🥽', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '⚫',
    successMessage: 'Perfect holes!'
  },
  'buildchair': {
    intro: 'Build a chair!',
    correctItems: ['🪵', '🔨', '🔩', '📏'],
    allItems: ['🪵', '🔨', '🔩', '📏', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🪑',
    successMessage: 'Sturdy chair!'
  },
  'repairbike': {
    intro: 'Fix the bicycle!',
    correctItems: ['🔧', '🛞', '⚙️', '🚲'],
    allItems: ['🔧', '🛞', '⚙️', '🚲', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚴',
    successMessage: 'Bike fixed!'
  },
  'toolmatch': {
    intro: 'Match the right tools!',
    correctItems: ['🔨', '🪛', '🔧', '🪚'],
    allItems: ['🔨', '🪛', '🔧', '🪚', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧰',
    successMessage: 'Right tools!'
  },
  'fixtoy': {
    intro: 'Fix the broken toy!',
    correctItems: ['🔧', '🧸', '🩹', '✨'],
    allItems: ['🔧', '🧸', '🩹', '✨', '🍔', '⚽', '📱', '🎮', '🎨', '📚'],
    finalResult: '🧸',
    successMessage: 'Toy fixed!'
  },
  'birdhouse': {
    intro: 'Build a birdhouse!',
    correctItems: ['🪵', '🔨', '🔩', '🐦'],
    allItems: ['🪵', '🔨', '🔩', '🐦', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏠',
    successMessage: 'Cozy birdhouse!'
  },
  'painting': {
    intro: 'Paint the wood!',
    correctItems: ['🖌️', '🎨', '🪵', '💧'],
    allItems: ['🖌️', '🎨', '🪵', '💧', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🎨',
    successMessage: 'Beautiful paint!'
  },

  // ============================================
  // ⚙️ ENGINEERING LAB
  // ============================================
  'bridge': {
    intro: 'Build a strong bridge!',
    correctItems: ['🌉', '🧱', '🔩', '📏'],
    allItems: ['🌉', '🧱', '🔩', '📏', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌉',
    successMessage: 'Strong bridge!'
  },
  'house': {
    intro: 'Build a house!',
    correctItems: ['🧱', '🚪', '🪟', '🏠'],
    allItems: ['🧱', '🚪', '🪟', '🏠', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏡',
    successMessage: 'Beautiful house!'
  },
  'roads': {
    intro: 'Design a road!',
    correctItems: ['🛣️', '🚦', '🚧', '🚗'],
    allItems: ['🛣️', '🚦', '🚧', '🚗', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🛣️',
    successMessage: 'Smooth road!'
  },
  'tower': {
    intro: 'Build a tall tower!',
    correctItems: ['🗼', '🧱', '📐', '📏'],
    allItems: ['🗼', '🧱', '📐', '📏', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🗼',
    successMessage: 'Tall tower!'
  },
  'gears': {
    intro: 'Connect the gears!',
    correctItems: ['⚙️', '🔩', '🛠️', '🔧'],
    allItems: ['⚙️', '🔩', '🛠️', '🔧', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '⚙️',
    successMessage: 'Gears working!'
  },
  'pulley': {
    intro: 'Build a pulley system!',
    correctItems: ['⚙️', '🪢', '⚖️', '🔗'],
    allItems: ['⚙️', '🪢', '⚖️', '🔗', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏗️',
    successMessage: 'Pulley works!'
  },
  'crane': {
    intro: 'Operate the crane!',
    correctItems: ['🏗️', '🔗', '📦', '⚙️'],
    allItems: ['🏗️', '🔗', '📦', '⚙️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏗️',
    successMessage: 'Crane operational!'
  },
  'pipes': {
    intro: 'Connect the pipes!',
    correctItems: ['🔧', '💧', '🚰', '🛠️'],
    allItems: ['🔧', '💧', '🚰', '🛠️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚿',
    successMessage: 'Water flowing!'
  },
  'circuit': {
    intro: 'Light up the bulb!',
    correctItems: ['🔋', '💡', '⚡', '🔌'],
    allItems: ['🔋', '💡', '⚡', '🔌', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '💡',
    successMessage: 'Light is on!'
  },
  'solar': {
    intro: 'Set up solar power!',
    correctItems: ['☀️', '🔋', '💡', '⚡'],
    allItems: ['☀️', '🔋', '💡', '⚡', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '☀️',
    successMessage: 'Solar power ready!'
  },
  'windmill': {
    intro: 'Build a windmill!',
    correctItems: ['💨', '⚙️', '🏗️', '🌪️'],
    allItems: ['💨', '⚙️', '🏗️', '🌪️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌬️',
    successMessage: 'Windmill spinning!'
  },
  'robot': {
    intro: 'Design a robot!',
    correctItems: ['🤖', '⚙️', '🔩', '💻'],
    allItems: ['🤖', '⚙️', '🔩', '💻', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🤖',
    successMessage: 'Robot alive!'
  },

  // ============================================
  // 🏭 FACTORY SIMULATOR
  // ============================================
  'toyfactory': {
    intro: 'Make toys in factory!',
    correctItems: ['🧸', '🎁', '📦', '✨'],
    allItems: ['🧸', '🎁', '📦', '✨', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧸',
    successMessage: 'Toys made!'
  },
  'chocolate': {
    intro: 'Make chocolate bars!',
    correctItems: ['🍫', '🥛', '🍯', '📦'],
    allItems: ['🍫', '🥛', '🍯', '📦', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🍫',
    successMessage: 'Yummy chocolate!'
  },
  'juice': {
    intro: 'Make juice bottles!',
    correctItems: ['🍊', '💧', '🍶', '📦'],
    allItems: ['🍊', '💧', '🍶', '📦', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧃',
    successMessage: 'Juice bottled!'
  },
  'carfactory': {
    intro: 'Assemble a car!',
    correctItems: ['🚗', '🛞', '⚙️', '🔧'],
    allItems: ['🚗', '🛞', '⚙️', '🔧', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚗',
    successMessage: 'Car ready!'
  },
  'furniture': {
    intro: 'Build furniture!',
    correctItems: ['🪵', '🔨', '🪑', '🔩'],
    allItems: ['🪵', '🔨', '🪑', '🔩', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🪑',
    successMessage: 'Nice furniture!'
  },
  'recycle': {
    intro: 'Sort recyclables!',
    correctItems: ['♻️', '🥤', '📰', '🗑️'],
    allItems: ['♻️', '🥤', '📰', '🗑️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '♻️',
    successMessage: 'Great recycling!'
  },
  'assembly': {
    intro: 'Work on assembly line!',
    correctItems: ['📦', '⚙️', '🔧', '✅'],
    allItems: ['📦', '⚙️', '🔧', '✅', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏭',
    successMessage: 'Assembled!'
  },
  'packing': {
    intro: 'Pack the boxes!',
    correctItems: ['📦', '🎁', '📋', '✂️'],
    allItems: ['📦', '🎁', '📋', '✂️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '📦',
    successMessage: 'All packed!'
  },
  'quality': {
    intro: 'Check quality!',
    correctItems: ['🔍', '✅', '📋', '⭐'],
    allItems: ['🔍', '✅', '📋', '⭐', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '💯',
    successMessage: 'Top quality!'
  },

  // ============================================
  // 🚗 VEHICLE GARAGE
  // ============================================
  'carrepair': {
    intro: 'Fix the car!',
    correctItems: ['🚗', '🔧', '⚙️', '🛠️'],
    allItems: ['🚗', '🔧', '⚙️', '🛠️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚗',
    successMessage: 'Car fixed!'
  },
  'carwash': {
    intro: 'Wash the car!',
    correctItems: ['🚗', '🧽', '💧', '🧼'],
    allItems: ['🚗', '🧽', '💧', '🧼', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✨',
    successMessage: 'Sparkling clean!'
  },
  'paintcar': {
    intro: 'Paint the car!',
    correctItems: ['🎨', '🖌️', '🚗', '💧'],
    allItems: ['🎨', '🖌️', '🚗', '💧', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🚗',
    successMessage: 'Beautiful color!'
  },
  'tirechange': {
    intro: 'Change the tires!',
    correctItems: ['🛞', '🔧', '⚙️', '🚗'],
    allItems: ['🛞', '🔧', '⚙️', '🚗', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🛞',
    successMessage: 'New tires!'
  },
  'fillfuel': {
    intro: 'Fill the fuel!',
    correctItems: ['⛽', '🚗', '💧', '📊'],
    allItems: ['⛽', '🚗', '💧', '📊', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '⛽',
    successMessage: 'Tank full!'
  },
  'checkengine': {
    intro: 'Check the engine!',
    correctItems: ['🔍', '⚙️', '🔧', '📋'],
    allItems: ['🔍', '⚙️', '🔧', '📋', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✅',
    successMessage: 'Engine perfect!'
  },
  'buildbike': {
    intro: 'Build a bicycle!',
    correctItems: ['🛞', '⚙️', '🔧', '🚲'],
    allItems: ['🛞', '⚙️', '🔧', '🚲', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚲',
    successMessage: 'Bike ready!'
  },
  'raceprep': {
    intro: 'Prepare for race!',
    correctItems: ['🏎️', '🛞', '⛽', '🏁'],
    allItems: ['🏎️', '🛞', '⛽', '🏁', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏆',
    successMessage: 'Ready to race!'
  },
  'buildcar': {
    intro: 'Design your car!',
    correctItems: ['🚗', '🛞', '🎨', '⚙️'],
    allItems: ['🚗', '🛞', '🎨', '⚙️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚙',
    successMessage: 'Dream car!'
  },
  'airplane': {
    intro: 'Learn airplane parts!',
    correctItems: ['✈️', '🛩️', '🚁', '🛬'],
    allItems: ['✈️', '🛩️', '🚁', '🛬', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✈️',
    successMessage: 'Flying high!'
  },

  // ============================================
  // 🌱 GARDEN & FARM
  // ============================================
  'plantflowers': {
    intro: 'Plant flowers!',
    correctItems: ['🌱', '🪴', '💧', '☀️', '🌸'],
    allItems: ['🌱', '🪴', '💧', '☀️', '🌸', '🍔', '⚽', '🎮', '📱', '🎨'],
    finalResult: '🌺',
    successMessage: 'Flowers blooming!'
  },
  'growveggies': {
    intro: 'Grow vegetables!',
    correctItems: ['🌱', '💧', '☀️', '🥕'],
    allItems: ['🌱', '💧', '☀️', '🥕', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🥕',
    successMessage: 'Fresh veggies!'
  },
  'watering': {
    intro: 'Water the plants!',
    correctItems: ['💧', '🚿', '🌱', '☀️'],
    allItems: ['💧', '🚿', '🌱', '☀️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌿',
    successMessage: 'Plants happy!'
  },
  'harvest': {
    intro: 'Harvest fruits!',
    correctItems: ['🍎', '🍊', '🍇', '🧺'],
    allItems: ['🍎', '🍊', '🍇', '🧺', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🍎',
    successMessage: 'Fresh harvest!'
  },
  'feedanimals': {
    intro: 'Feed the animals!',
    correctItems: ['🌽', '🥕', '🐄', '🐔'],
    allItems: ['🌽', '🥕', '🐄', '🐔', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🐮',
    successMessage: 'Happy animals!'
  },
  'decorategarden': {
    intro: 'Decorate the garden!',
    correctItems: ['🌸', '🌷', '🪴', '🦋'],
    allItems: ['🌸', '🌷', '🪴', '🦋', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌷',
    successMessage: 'Beautiful garden!'
  },
  'composting': {
    intro: 'Make compost!',
    correctItems: ['🍎', '🥬', '🍌', '♻️'],
    allItems: ['🍎', '🥬', '🍌', '♻️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌱',
    successMessage: 'Great compost!'
  },
  'butterflygarden': {
    intro: 'Attract butterflies!',
    correctItems: ['🌸', '🌺', '🌻', '🦋'],
    allItems: ['🌸', '🌺', '🌻', '🦋', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🦋',
    successMessage: 'Butterflies came!'
  },
  'herbgarden': {
    intro: 'Grow herbs!',
    correctItems: ['🌿', '🪴', '💧', '☀️'],
    allItems: ['🌿', '🪴', '💧', '☀️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌿',
    successMessage: 'Fresh herbs!'
  },
  'treeplanting': {
    intro: 'Plant a tree!',
    correctItems: ['🌱', '🪴', '💧', '🌳'],
    allItems: ['🌱', '🪴', '💧', '🌳', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌳',
    successMessage: 'Tree growing!'
  },

  // ============================================
  // 🏥 MEDICAL CLINIC
  // ============================================
  'heartbeat': {
    intro: 'Check the heartbeat!',
    correctItems: ['💓', '🩺', '👂', '📋'],
    allItems: ['💓', '🩺', '👂', '📋', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '❤️',
    successMessage: 'Heart is healthy!'
  },
  'bandage': {
    intro: 'Apply the bandage!',
    correctItems: ['🩹', '🧴', '💧', '🩺'],
    allItems: ['🩹', '🧴', '💧', '🩺', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '❤️‍🩹',
    successMessage: 'All better!'
  },
  'temperature': {
    intro: 'Check temperature!',
    correctItems: ['🌡️', '📋', '💊', '🩺'],
    allItems: ['🌡️', '📋', '💊', '🩺', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌡️',
    successMessage: 'Temperature checked!'
  },
  'dental': {
    intro: 'Take care of teeth!',
    correctItems: ['🦷', '🪥', '💧', '🧴'],
    allItems: ['🦷', '🪥', '💧', '🧴', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '😁',
    successMessage: 'Shiny teeth!'
  },
  'eyecheck': {
    intro: 'Check the eyes!',
    correctItems: ['👁️', '🔍', '📋', '👓'],
    allItems: ['👁️', '🔍', '📋', '👓', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '👀',
    successMessage: 'Eyes are great!'
  },
  'healthy': {
    intro: 'Choose healthy items!',
    correctItems: ['🥗', '🏃', '💧', '😴'],
    allItems: ['🥗', '🏃', '💧', '😴', '🍔', '🍟', '🍕', '🍫', '🍦', '🍿'],
    finalResult: '💪',
    successMessage: 'Super healthy!'
  },
  'firstaid': {
    intro: 'First aid kit!',
    correctItems: ['🩹', '💊', '🧴', '🩺'],
    allItems: ['🩹', '💊', '🧴', '🩺', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏥',
    successMessage: 'First aid ready!'
  },
  'handwash': {
    intro: 'Wash your hands!',
    correctItems: ['💧', '🧼', '🫧', '🖐️'],
    allItems: ['💧', '🧼', '🫧', '🖐️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✨',
    successMessage: 'Clean hands!'
  },
  'xray': {
    intro: 'X-ray examination!',
    correctItems: ['🩻', '🦴', '📋', '💻'],
    allItems: ['🩻', '🦴', '📋', '💻', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🦴',
    successMessage: 'X-ray done!'
  },
  'ambulance': {
    intro: 'Emergency response!',
    correctItems: ['🚑', '🩺', '🏥', '⚡'],
    allItems: ['🚑', '🩺', '🏥', '⚡', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🚑',
    successMessage: 'Help on the way!'
  },

  // ============================================
  // 🎨 ART & DESIGN
  // ============================================
  'drawing': {
    intro: 'Draw a picture!',
    correctItems: ['✏️', '📄', '🎨', '🖌️'],
    allItems: ['✏️', '📄', '🎨', '🖌️', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🖼️',
    successMessage: 'Beautiful drawing!'
  },
  'painting': {
    intro: 'Paint a masterpiece!',
    correctItems: ['🎨', '🖌️', '🖼️', '💧'],
    allItems: ['🎨', '🖌️', '🖼️', '💧', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🖼️',
    successMessage: 'Masterpiece!'
  },
  'pottery': {
    intro: 'Make pottery!',
    correctItems: ['🏺', '💧', '🎨', '🔥'],
    allItems: ['🏺', '💧', '🎨', '🔥', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🏺',
    successMessage: 'Nice pottery!'
  },
  'origami': {
    intro: 'Fold origami!',
    correctItems: ['📄', '✂️', '🦢', '📐'],
    allItems: ['📄', '✂️', '🦢', '📐', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🦢',
    successMessage: 'Beautiful origami!'
  },
  'crafts': {
    intro: 'Make a craft!',
    correctItems: ['✂️', '📄', '🎨', '🖌️'],
    allItems: ['✂️', '📄', '🎨', '🖌️', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🎁',
    successMessage: 'Amazing craft!'
  },
  'stickers': {
    intro: 'Design stickers!',
    correctItems: ['🎨', '✏️', '✂️', '⭐'],
    allItems: ['🎨', '✏️', '✂️', '⭐', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🏷️',
    successMessage: 'Cool stickers!'
  },
  'poster': {
    intro: 'Create a poster!',
    correctItems: ['📃', '✏️', '🎨', '🖌️'],
    allItems: ['📃', '✏️', '🎨', '🖌️', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '📃',
    successMessage: 'Great poster!'
  },
  'sculpting': {
    intro: 'Sculpt something!',
    correctItems: ['🗿', '🎨', '🛠️', '💧'],
    allItems: ['🗿', '🎨', '🛠️', '💧', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🗿',
    successMessage: 'Amazing sculpture!'
  },
  'collage': {
    intro: 'Make a collage!',
    correctItems: ['🖼️', '📄', '✂️', '🎨'],
    allItems: ['🖼️', '📄', '✂️', '🎨', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🎨',
    successMessage: 'Cool collage!'
  },
  'tiedye': {
    intro: 'Create tie-dye!',
    correctItems: ['👕', '🌈', '💧', '🎨'],
    allItems: ['👕', '🌈', '💧', '🎨', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🌈',
    successMessage: 'Colorful!'
  },

  // ============================================
  // 💻 CODING & ROBOTICS
  // ============================================
  'basiccode': {
    intro: 'Write your first code!',
    correctItems: ['💻', '⌨️', '🖱️', '📝'],
    allItems: ['💻', '⌨️', '🖱️', '📝', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '👨‍💻',
    successMessage: 'You coded!'
  },
  'robotcontrol': {
    intro: 'Control the robot!',
    correctItems: ['🤖', '🎮', '📱', '⚙️'],
    allItems: ['🤖', '🎮', '📱', '⚙️', '🍔', '⚽', '🎨', '🍕', '📚', '🎈'],
    finalResult: '🤖',
    successMessage: 'Robot obeys!'
  },
  'buildrobot': {
    intro: 'Build a robot!',
    correctItems: ['🤖', '⚙️', '🔩', '💡'],
    allItems: ['🤖', '⚙️', '🔩', '💡', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🦾',
    successMessage: 'Robot ready!'
  },
  'logic': {
    intro: 'Solve the puzzle!',
    correctItems: ['🧩', '💡', '🔍', '✅'],
    allItems: ['🧩', '💡', '🔍', '✅', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧠',
    successMessage: 'Smart thinking!'
  },
  'animation': {
    intro: 'Create animation!',
    correctItems: ['🎬', '💻', '🎨', '🎭'],
    allItems: ['🎬', '💻', '🎨', '🎭', '🍔', '⚽', '🎮', '📱', '📚', '🍕'],
    finalResult: '🎬',
    successMessage: 'Cool animation!'
  },
  'movement': {
    intro: 'Program movement!',
    correctItems: ['⬆️', '⬇️', '⬅️', '➡️'],
    allItems: ['⬆️', '⬇️', '⬅️', '➡️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🏃',
    successMessage: 'Moving!'
  },
  'loops': {
    intro: 'Use loops!',
    correctItems: ['🔁', '🔄', '➰', '💻'],
    allItems: ['🔁', '🔄', '➰', '💻', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🔁',
    successMessage: 'Loop works!'
  },
  'debugging': {
    intro: 'Fix the bug!',
    correctItems: ['🐛', '🔍', '🛠️', '✅'],
    allItems: ['🐛', '🔍', '🛠️', '✅', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '✅',
    successMessage: 'Bug fixed!'
  },
  'gamedesign': {
    intro: 'Design a game!',
    correctItems: ['🎮', '👾', '🏆', '🎯'],
    allItems: ['🎮', '👾', '🏆', '🎯', '🍔', '⚽', '📱', '💻', '🎨', '📚'],
    finalResult: '🎮',
    successMessage: 'Fun game!'
  },
  'appinventor': {
    intro: 'Create an app!',
    correctItems: ['📱', '💻', '🎨', '⚙️'],
    allItems: ['📱', '💻', '🎨', '⚙️', '🍔', '⚽', '🎮', '📚', '🍕', '🎈'],
    finalResult: '📱',
    successMessage: 'App created!'
  },

  // ============================================
  // 🔬 SCIENCE LAB
  // ============================================
  'volcano': {
    intro: 'Make a volcano!',
    correctItems: ['🌋', '🧪', '💧', '🔴'],
    allItems: ['🌋', '🧪', '💧', '🔴', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌋',
    successMessage: 'Volcano erupted!'
  },
  'fossil': {
    intro: 'Dig for fossils!',
    correctItems: ['🦕', '🔨', '🔍', '🦴'],
    allItems: ['🦕', '🔨', '🔍', '🦴', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🦖',
    successMessage: 'Amazing fossil!'
  },
  'microscope': {
    intro: 'Use the microscope!',
    correctItems: ['🔬', '💧', '🧪', '📋'],
    allItems: ['🔬', '💧', '🧪', '📋', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🔬',
    successMessage: 'Amazing view!'
  },
  'weather': {
    intro: 'Track the weather!',
    correctItems: ['☀️', '🌧️', '⛅', '🌡️'],
    allItems: ['☀️', '🌧️', '⛅', '🌡️', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌤️',
    successMessage: 'Weather tracked!'
  },
  'planets': {
    intro: 'Learn about planets!',
    correctItems: ['🌍', '🪐', '🌙', '⭐'],
    allItems: ['🌍', '🪐', '🌙', '⭐', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌌',
    successMessage: 'Space explorer!'
  },
  'static': {
    intro: 'Static electricity!',
    correctItems: ['⚡', '🎈', '💇', '📄'],
    allItems: ['⚡', '🎈', '💇', '📄', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '⚡',
    successMessage: 'Zap!'
  },
  'telescope': {
    intro: 'Look at stars!',
    correctItems: ['🔭', '⭐', '🌙', '🌌'],
    allItems: ['🔭', '⭐', '🌙', '🌌', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌟',
    successMessage: 'Beautiful stars!'
  },
  'chemistry': {
    intro: 'Mix chemicals!',
    correctItems: ['🧪', '⚗️', '💧', '🧴'],
    allItems: ['🧪', '⚗️', '💧', '🧴', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧪',
    successMessage: 'Chemistry magic!'
  },
  'magnets': {
    intro: 'Play with magnets!',
    correctItems: ['🧲', '🔩', '📎', '🔧'],
    allItems: ['🧲', '🔩', '📎', '🔧', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🧲',
    successMessage: 'Magnets stick!'
  },
  'plants': {
    intro: 'Study plants!',
    correctItems: ['🌱', '💧', '☀️', '🪴'],
    allItems: ['🌱', '💧', '☀️', '🪴', '🍔', '⚽', '🎮', '📱', '🎨', '📚'],
    finalResult: '🌿',
    successMessage: 'Plant grew!'
  },

  // Default fallback for any missing skills
  'default': {
    intro: 'Complete this skill!',
    correctItems: ['⭐', '✨', '💫', '🌟'],
    allItems: ['⭐', '✨', '💫', '🌟', '🎈', '🎉', '🎊', '🏆', '🎁', '💝'],
    finalResult: '🎉',
    successMessage: 'Well done!'
  }
};


const getActivityForSkill = (skillId: string) => {
  return SKILL_ACTIVITIES[skillId] || SKILL_ACTIVITIES.default;
};

const SkillsScreen: React.FC<SkillsScreenProps> = ({ progress, onBack, onComplete }) => {
  const [view, setView] = useState<View>('career-select');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [wrongTaps, setWrongTaps] = useState<number[]>([]);
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);

  // Shuffle items when skill changes
  useEffect(() => {
    if (selectedSkill) {
      const activity = getActivityForSkill(selectedSkill.id);
      const combined = [...new Set([...activity.correctItems, ...activity.allItems])];
      const shuffled = [...combined].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setCollectedItems([]);
      setWrongTaps([]);
    }
  }, [selectedSkill]);

  const handleCategorySelect = (cat: SkillCategory) => {
    setSelectedCategory(cat);
    setView('skill-list');
  };

  const handleSkillSelect = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setView('skill-detail');
  };

  const handleItemTap = (item: string, index: number) => {
    if (!selectedSkill) return;
    const activity = getActivityForSkill(selectedSkill.id);
    
    // Check if this is the next correct item
    const nextExpectedItem = activity.correctItems[collectedItems.length];
    
    if (item === nextExpectedItem) {
      // Correct!
      const newCollected = [...collectedItems, item];
      setCollectedItems(newCollected);
      
      // Check if all correct items collected
      if (newCollected.length === activity.correctItems.length) {
        if (!completedSkills.includes(selectedSkill.id)) {
          setCompletedSkills((prev) => [...prev, selectedSkill.id]);
        }
        setTimeout(() => {
          setShowCelebration(true);
          onComplete(3);
          setTimeout(() => {
            setShowCelebration(false);
            setView('skill-list');
            setSelectedSkill(null);
          }, 2500);
        }, 500);
      }
    } else {
      // Wrong item - show red briefly
      setWrongTaps([...wrongTaps, index]);
      setTimeout(() => {
        setWrongTaps(prev => prev.filter(i => i !== index));
      }, 800);
    }
  };

  const handleReset = () => {
    if (selectedSkill) {
      const activity = getActivityForSkill(selectedSkill.id);
      const combined = [...new Set([...activity.correctItems, ...activity.allItems])];
      const shuffled = [...combined].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setCollectedItems([]);
      setWrongTaps([]);
    }
  };

  const goBackOne = () => {
    switch (view) {
      case 'skill-list':
        setView('career-select');
        setSelectedCategory(null);
        break;
      case 'skill-detail':
        setView('skill-list');
        setSelectedSkill(null);
        break;
      default:
        onBack();
    }
  };

  // =============================================
  // CAREER SELECTION
  // =============================================
  if (view === 'career-select') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🌟 Skills & Careers" onBack={onBack} stars={progress.stars} />

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.div
              className="text-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                Choose Your Adventure! 🚀
              </h2>
              <p className="text-gray-500 text-sm mt-1">Fun activities for boys and girls!</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              {careerCategories.map((cat, i) => {
                const completedInCat = cat.items.filter((s) => completedSkills.includes(s.id)).length;
                const progressPercent = (completedInCat / cat.items.length) * 100;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="game-card p-4 md:p-5 text-center relative overflow-hidden group"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    {completedInCat > 0 && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {completedInCat}/{cat.items.length}
                      </div>
                    )}
                    <motion.span
                      className="text-4xl md:text-5xl block mb-2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
                    >
                      {cat.emoji}
                    </motion.span>
                    <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{cat.name}</h4>
                    <p className="text-gray-400 text-xs mt-1 hidden md:block">{cat.description}</p>
                    {completedInCat > 0 && (
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="inline-flex items-center gap-4 bg-white/80 rounded-full px-6 py-3 shadow-md">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{completedSkills.length}</p>
                  <p className="text-xs text-gray-400">Skills Done</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{careerCategories.length}</p>
                  <p className="text-xs text-gray-400">Categories</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // =============================================
  // SKILL LIST
  // =============================================
  if (view === 'skill-list' && selectedCategory) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title={`${selectedCategory.emoji} ${selectedCategory.name}`} onBack={goBackOne} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
            <motion.div
              className={`bg-gradient-to-r ${selectedCategory.gradient} rounded-2xl p-4 mb-4 text-white text-center shadow-lg`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <span className="text-4xl">{selectedCategory.emoji}</span>
              <h3 className="text-lg font-bold mt-1">{selectedCategory.name}</h3>
              <p className="text-white/80 text-sm">{selectedCategory.description}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {selectedCategory.items.map((skill, i) => {
                const isCompleted = completedSkills.includes(skill.id);
                return (
                  <motion.button
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill)}
                    className={`game-card p-4 text-center relative overflow-hidden ${isCompleted ? 'ring-2 ring-green-300 bg-green-50/50' : ''}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isCompleted && (
                      <motion.div className="absolute top-1 right-1 text-green-500 text-sm" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        ✅
                      </motion.div>
                    )}
                    <motion.span
                      className="text-3xl md:text-4xl block mb-1"
                      animate={isCompleted ? {} : { y: [0, -3, 0] }}
                      transition={{ duration: 2 + i * 0.15, repeat: Infinity }}
                    >
                      {skill.emoji}
                    </motion.span>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{skill.name}</h4>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  // =============================================
  // SKILL DETAIL - INTERACTIVE ASSEMBLY!
  // =============================================
  if (view === 'skill-detail' && selectedSkill && selectedCategory) {
    const activity = getActivityForSkill(selectedSkill.id);
    const totalNeeded = activity.correctItems.length;
    const progress_percent = (collectedItems.length / totalNeeded) * 100;

    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation
            title={`${selectedSkill.emoji} ${selectedSkill.name}`}
            onBack={goBackOne}
            stars={progress.stars}
            showProgress
            progress={progress_percent}
          />

          <Celebration show={showCelebration} message={activity.successMessage} stars={3} />

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {/* Instruction Card */}
            <motion.div
              className={`bg-gradient-to-r ${selectedCategory.gradient} rounded-2xl p-4 mb-3 text-white text-center shadow-lg`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <motion.div
                className="text-4xl md:text-5xl mb-2"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedSkill.emoji}
              </motion.div>
              <h2 className="text-lg md:text-xl font-bold mb-1" style={{ fontFamily: "'Bubblegum One', cursive" }}>
                {activity.intro}
              </h2>
              <p className="text-white/90 text-sm">Tap items in the right order!</p>
            </motion.div>

            {/* Collection Area - Shows what user collected */}
            <motion.div
              className="bg-white/95 rounded-3xl p-4 mb-3 shadow-lg border-4 border-white"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <p className="text-center text-sm font-bold text-gray-600 mb-2">
                Your Progress ({collectedItems.length}/{totalNeeded})
              </p>
              <div className="flex justify-center items-center gap-2 flex-wrap min-h-[60px]">
                {activity.correctItems.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-4 ${
                      i < collectedItems.length 
                        ? 'bg-green-100 border-green-400' 
                        : 'bg-gray-100 border-gray-300 border-dashed'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {i < collectedItems.length ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring' }}
                      >
                        {collectedItems[i]}
                      </motion.span>
                    ) : (
                      <span className="text-gray-400 text-2xl">?</span>
                    )}
                    {i < activity.correctItems.length - 1 && i < collectedItems.length && (
                      <span className="text-green-400 ml-1">→</span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {collectedItems.length === totalNeeded && (
                <motion.div
                  className="text-center mt-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <p className="text-2xl">✨ → {activity.finalResult} → ✨</p>
                </motion.div>
              )}
            </motion.div>

            {/* Available Items to Tap */}
            <div className="mb-3">
              <p className="text-center text-sm font-bold text-gray-700 mb-2 bg-white/80 rounded-full px-4 py-1 mx-auto inline-block">
                👆 Tap the correct items!
              </p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 max-w-2xl mx-auto">
              {shuffledItems.map((item, i) => {
                const isCollected = collectedItems.filter(x => x === item).length >= 
                  activity.correctItems.filter(x => x === item).length;
                const isWrong = wrongTaps.includes(i);
                
                return (
                  <motion.button
                    key={`${item}-${i}`}
                    onClick={() => !isCollected && handleItemTap(item, i)}
                    disabled={isCollected}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg border-4 transition-all ${
                      isWrong 
                        ? 'bg-red-200 border-red-500 scale-95' 
                        : isCollected 
                          ? 'bg-gray-100 border-gray-300 opacity-40' 
                          : 'bg-white border-white hover:border-purple-300'
                    }`}
                    style={{
                      boxShadow: isWrong 
                        ? '0 4px 0 #B91C1C' 
                        : isCollected 
                          ? 'none' 
                          : '0 6px 0 rgba(0,0,0,0.15)',
                      minHeight: '65px',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: isWrong ? [-5, 5, -5, 5, 0] : 0
                    }}
                    transition={{ 
                      delay: i * 0.02,
                      x: { duration: 0.3 }
                    }}
                    whileHover={!isCollected ? { scale: 1.1, y: -3 } : {}}
                    whileTap={!isCollected ? { scale: 0.9, y: 3 } : {}}
                  >
                    {isCollected ? '✓' : item}
                  </motion.button>
                );
              })}
            </div>

            {/* Reset Button */}
            {collectedItems.length > 0 && collectedItems.length < totalNeeded && (
              <motion.button
                onClick={handleReset}
                className="mt-4 mx-auto block bg-orange-400 text-white rounded-2xl px-6 py-3 font-bold shadow-lg border-4 border-white"
                style={{
                  boxShadow: '0 4px 0 #C2410C',
                  fontFamily: "'Bubblegum One', cursive"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Try Again
              </motion.button>
            )}

            {/* Fun Fact */}
            <motion.div
              className="mt-4 bg-yellow-50 rounded-2xl p-3 border-2 border-yellow-200 max-w-md mx-auto"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-yellow-700 text-sm font-medium text-center">
                💡 {selectedSkill.funFact}
              </p>
            </motion.div>
          </div>
        </div>
      </GameBackground>
    );
  }

  return null;
};

export default SkillsScreen;
