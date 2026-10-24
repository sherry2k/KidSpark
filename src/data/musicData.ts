// ============================================================
// MUSIC: the eight notes and the songs
// ============================================================
//
// The instrument is a C-major scale with eight coloured bars:
//   Do Re Mi Fa Sol La Ti Do   (C D E F G A B C)
//
// A song is just a list of bar numbers, 0 to 7 (0 = the first Do, 7 = the high Do).
// To add a song, add ONE entry to SONGS. Nothing else needs to change.
//
// Songs use only these 8 notes, so the same bars play every song.
// All songs are traditional (public domain).
//
// Pure data, no React.

export interface MusicNote {
  /** sung name, shown on the bar */
  name: string;
  /** letter name, for grown-ups */
  letter: string;
  /** frequency in Hz (C4 = middle C) */
  freq: number;
  color: string;
}

export const NOTES: MusicNote[] = [
  { name: 'Do', letter: 'C', freq: 261.63, color: '#E5383B' },
  { name: 'Re', letter: 'D', freq: 293.66, color: '#F77F00' },
  { name: 'Mi', letter: 'E', freq: 329.63, color: '#FFC21A' },
  { name: 'Fa', letter: 'F', freq: 349.23, color: '#57CC5B' },
  { name: 'Sol', letter: 'G', freq: 392.0, color: '#2CB5AF' },
  { name: 'La', letter: 'A', freq: 440.0, color: '#2C7BE5' },
  { name: 'Ti', letter: 'B', freq: 493.88, color: '#7B2CBF' },
  { name: 'Do', letter: 'C', freq: 523.25, color: '#FF6BA9' },
];

export interface Song {
  id: string;
  title: string;
  /** one emoji (Unicode 11 or older, so it shows on older phones) */
  icon: string;
  grad: string;
  shadow: string;
  diff: 1 | 2 | 3;
  /** bar numbers, 0 to 7, in the order they are played */
  notes: number[];
}

export const SONGS: Song[] = [
  // easiest: only three different bars (Mi Re Do)
  { id: 'buns', title: 'Hot Cross Buns', icon: '🍞', grad: 'from-amber-400 to-orange-500', shadow: '#C2410C', diff: 1,
    notes: [2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0] },
  { id: 'boat', title: 'Row Your Boat', icon: '🚣', grad: 'from-sky-400 to-blue-500', shadow: '#1D4ED8', diff: 1,
    notes: [0, 0, 0, 1, 2, 2, 1, 2, 3, 4] },
  { id: 'birthday', title: 'Happy Birthday', icon: '🎂', grad: 'from-pink-400 to-rose-500', shadow: '#BE123C', diff: 2,
    notes: [0, 0, 1, 0, 3, 2, 0, 0, 1, 0, 4, 3] },
  { id: 'mary', title: 'Mary Had a Little Lamb', icon: '🐑', grad: 'from-emerald-400 to-teal-500', shadow: '#0F766E', diff: 2,
    notes: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4] },
  { id: 'twinkle', title: 'Twinkle Twinkle', icon: '⭐', grad: 'from-indigo-400 to-purple-500', shadow: '#4338CA', diff: 2,
    notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] },
  { id: 'ode', title: 'Ode to Joy', icon: '🎻', grad: 'from-violet-500 to-fuchsia-600', shadow: '#86198F', diff: 3,
    notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1] },
];

/** how many wrong taps still earn each star level */
export const starsFor = (wrong: number, total: number): 1 | 2 | 3 => {
  if (wrong <= Math.max(1, Math.floor(total * 0.1))) return 3;
  if (wrong <= Math.ceil(total * 0.4)) return 2;
  return 1;
};
