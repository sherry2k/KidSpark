/**
 * activityTypes.ts
 *
 * The step vocabulary, extended past cooking.
 *
 * Every activity in every category is a list of steps, and every step is one
 * of these kinds. Adding a category means writing data, not components.
 */

import { CookStep, Recipe } from './cookingRecipes';
import { Sticker, Stroke, Layer, KeepsakeKind } from '../utils/keepsakes';

/* ---------------- MIX: combine two things, discover a third ------- */

export interface MixDiscovery {
  /** the two source colour names, in any order */
  a: string;
  b: string;
  name: string;
  color: string;
}

export interface MixStep {
  kind: 'mix';
  say: string;
  palette: { name: string; color: string }[];
  discoveries: MixDiscovery[];
  /** how many new discoveries end the step */
  goal: number;
}

/* ---------------- DRESS: layered free build ----------------------- */

export interface DressOption {
  icon: string;
  name: string;
  /** e.g. ['rain','warm'] — used by challenge mode */
  tags?: string[];
}

export interface DressSlot {
  id: string;
  label: string;
  /** vertical placement of this layer on the character, 0-100 */
  y: number;
  /** size as a fraction of the canvas */
  size: number;
  options: DressOption[];
}

export interface DressStep {
  kind: 'dress';
  say: string;
  character: string;
  background: string;
  slots: DressSlot[];
  /** optional brief: "dress for the rain" — many right answers, not one */
  challenge?: { prompt: string; requireTag: string; rewardLine: string };
}

/* ---------------- DRAW: finger painting --------------------------- */

export interface DrawStep {
  kind: 'draw';
  say: string;
  /** a faint guide underneath: a face, a hand, a shirt, or nothing */
  guide: string;
  background: string;
  colors: string[];
  /** mirror everything down the middle — turns scribbles into butterflies */
  symmetry?: boolean;
  /** strokes needed before "done" lights up */
  minStrokes: number;
  stickers?: { icon: string; name: string }[];
}

/* ---------------- SORT: put things in the right bin --------------- */

export interface SortStep {
  kind: 'sort';
  say: string;
  bins: { id: string; label: string; icon: string; color: string }[];
  items: { icon: string; name: string; bin: string }[];
}

/* ---------------- ANIMALS: give each one what it wants ------------ */

export interface AnimalStep {
  kind: 'animals';
  say: string;
  animals: { icon: string; name: string; wants: string; wantIcon: string; sound: string }[];
  extras: { icon: string; name: string }[];
}

/* ---------------- GARDEN: the care loop over real days ------------ */

export interface GardenStep {
  kind: 'garden';
  say: string;
  seeds: { id: string; icon: string; name: string; sprout: string; grown: string }[];
}

/* ---------------- the union --------------------------------------- */

export type AnyStep =
  | CookStep
  | MixStep
  | DressStep
  | DrawStep
  | SortStep
  | AnimalStep
  | GardenStep;

export interface Activity extends Omit<Recipe, 'steps'> {
  steps: AnyStep[];
}

/** What a stage can hand back to be saved as a keepsake. */
export interface StagePayload {
  kind?: KeepsakeKind;
  base?: string;
  color?: string;
  stickers?: Sticker[];
  strokes?: Stroke[];
  layers?: Layer[];
}

/** Human label for the step-map shown on the intro card. */
export const STEP_LABEL: Record<AnyStep['kind'], string> = {
  gather: '🧺 collect',
  pour: '🥛 pour',
  stir: '🥄 stir',
  time: '⏱️ time it',
  scrub: '🧽 scrub',
  decorate: '🎨 decorate',
  mix: '🧪 mix colours',
  dress: '👗 dress up',
  draw: '🖌️ draw',
  sort: '♻️ sort',
  animals: '🐄 animals',
  garden: '🌱 grow',
};
