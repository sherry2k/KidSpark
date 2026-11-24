// ============================================================
// COMMUNITY HELPERS — for the "Who Helps Us?" game in the Memory hub
// ============================================================
//
// A round shows ONE helper (a firefighter) and three tools (a fire extinguisher,
// a frying pan, a drawn stethoscope). The child taps the tool that helper uses:
// one tool from the helper's own list, two from two OTHER helpers.
//
// SAFETY RULES for adding a helper or a tool:
//   1. Every tool must clearly belong to ONE helper only. Don't put a hammer on
//      both the builder and the mechanic. A tool never appears under two helpers.
//   2. At least two tools per helper (so a helper isn't always paired with the
//      same picture), and at least 6 helpers in total (a round has 6 questions,
//      one helper each).
//   3. Emoji must be Unicode 11 or older. The stethoscope emoji is newer than
//      that, so it is drawn (draw: 'stethoscope') — see ToolPicture in
//      MemoryGame.tsx.
//   4. `says` is what the app says aloud and shows, with its a / an.

export interface HelperTool {
  id: string;
  emoji: string;
  /** shown and spoken, e.g. "a fire extinguisher" */
  says: string;
  /** draws a picture where no good emoji exists */
  draw?: 'stethoscope';
}

export interface Helper {
  id: string;
  /** shown and spoken, e.g. "firefighter" */
  name: string;
  emoji: string;
  tools: HelperTool[];
}

export const HELPERS: Helper[] = [
  {
    id: 'firefighter', name: 'firefighter', emoji: '👨‍🚒',
    tools: [
      { id: 'extinguisher', emoji: '🧯', says: 'a fire extinguisher' },
      { id: 'firetruck', emoji: '🚒', says: 'a fire truck' },
    ],
  },
  {
    id: 'doctor', name: 'doctor', emoji: '👩‍⚕️',
    tools: [
      { id: 'stethoscope', emoji: '🩺', says: 'a stethoscope', draw: 'stethoscope' },
      { id: 'syringe', emoji: '💉', says: 'a syringe' },
      { id: 'thermometer', emoji: '🌡️', says: 'a thermometer' },
    ],
  },
  {
    id: 'chef', name: 'chef', emoji: '👨‍🍳',
    tools: [
      { id: 'pan', emoji: '🍳', says: 'a frying pan' },
      { id: 'spoon', emoji: '🥄', says: 'a spoon' },
      { id: 'pot', emoji: '🍲', says: 'a cooking pot' },
    ],
  },
  {
    id: 'farmer', name: 'farmer', emoji: '👩‍🌾',
    tools: [
      { id: 'tractor', emoji: '🚜', says: 'a tractor' },
      { id: 'wheat', emoji: '🌾', says: 'wheat' },
    ],
  },
  {
    id: 'builder', name: 'builder', emoji: '👷',
    tools: [
      { id: 'hammer', emoji: '🔨', says: 'a hammer' },
      { id: 'bricks', emoji: '🧱', says: 'bricks' },
    ],
  },
  {
    id: 'police', name: 'police officer', emoji: '👮',
    tools: [
      { id: 'policecar', emoji: '🚓', says: 'a police car' },
      { id: 'siren', emoji: '🚨', says: 'a siren light' },
    ],
  },
  {
    id: 'teacher', name: 'teacher', emoji: '👩‍🏫',
    tools: [
      { id: 'books', emoji: '📚', says: 'books' },
      { id: 'pencil', emoji: '✏️', says: 'a pencil' },
    ],
  },
  {
    id: 'pilot', name: 'pilot', emoji: '👨‍✈️',
    tools: [
      { id: 'plane', emoji: '✈️', says: 'an aeroplane' },
      { id: 'compass', emoji: '🧭', says: 'a compass' },
    ],
  },
  {
    id: 'artist', name: 'artist', emoji: '👩‍🎨',
    tools: [
      { id: 'palette', emoji: '🎨', says: 'a paint palette' },
      { id: 'brush', emoji: '🖌️', says: 'a paintbrush' },
    ],
  },
  {
    id: 'mechanic', name: 'mechanic', emoji: '👨‍🔧',
    tools: [
      { id: 'wrench', emoji: '🔧', says: 'a wrench' },
      { id: 'bolt', emoji: '🔩', says: 'a nut and bolt' },
    ],
  },
];
