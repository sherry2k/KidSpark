/**
 * skillActivities.ts — one lookup for every rebuilt activity.
 *
 * SkillsScreen asks this file whether a skill has been rebuilt. If yes it
 * runs the new engine; if no it falls through to the original tap-in-order
 * game, untouched. That's what lets you rebuild one category at a time
 * without ever breaking the others.
 */

import { Activity } from './activityTypes';
import { COOKING_RECIPES } from './cookingRecipes';
import { GARDEN_ACTIVITIES } from './gardenActivities';
import { BEAUTY_ACTIVITIES } from './beautyActivities';
import { ART_ACTIVITIES } from './artActivities';

export const ACTIVITIES: Record<string, Activity> = {
  ...COOKING_RECIPES,
  ...GARDEN_ACTIVITIES,
  ...BEAUTY_ACTIVITIES,
  ...ART_ACTIVITIES,
};

/** Categories that are fully rebuilt. Add to this as you finish more. */
export const REBUILT_CATEGORIES = ['cooking', 'garden', 'beauty', 'art'];

export const getActivity = (skillId: string): Activity | null => ACTIVITIES[skillId] ?? null;

export const isRebuilt = (categoryId: string, skillId: string): boolean =>
  REBUILT_CATEGORIES.includes(categoryId) && skillId in ACTIVITIES;
