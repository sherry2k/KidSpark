// src/utils/sounds.ts
import { Howl, Howler } from 'howler';

// Sound file paths - ONLY files you actually have
const SOUND_FILES = {
  click: '/sounds/click.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  complete: '/sounds/complete.mp3',
  win: '/sounds/win.mp3',
  star: '/sounds/star.mp3',
};

type SoundName = keyof typeof SOUND_FILES;

// Cache sounds
const soundsCache: { [key: string]: Howl } = {};

// Sound enabled state
let soundEnabled = true;

// Load saved settings
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('soundEffectsEnabled');
  soundEnabled = saved === null ? true : saved === 'true';
}

// Get or create sound
function getSound(name: SoundName): Howl | null {
  if (soundsCache[name]) {
    return soundsCache[name];
  }

  try {
    const sound = new Howl({
      src: [SOUND_FILES[name]],
      volume: 0.5,
      preload: true,
      html5: false,
      onload: () => console.log(`✅ Sound loaded: ${name}`),
      onloaderror: (_, error) => console.log(`❌ Load error for ${name}:`, error),
    });
    soundsCache[name] = sound;
    return sound;
  } catch (error) {
    console.log(`Error creating sound ${name}:`, error);
    return null;
  }
}

// Play a sound
function playSoundEffect(name: SoundName, volume?: number) {
  if (!soundEnabled) return;

  const sound = getSound(name);
  if (!sound) return;

  try {
    if (volume !== undefined) {
      sound.volume(volume);
    }

    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => sound.play());
    } else {
      sound.play();
    }
  } catch (error) {
    console.log(`Play error (${name}):`, error);
  }
}

// ============================================
// PUBLIC SOUND FUNCTIONS
// ============================================

// Basic sounds
export function playClick() {
  playSoundEffect('click', 0.4);
}

export function playCorrect() {
  playSoundEffect('correct', 0.5);
}

export function playWrong() {
  playSoundEffect('wrong', 0.4);
}

export function playComplete() {
  playSoundEffect('complete', 0.6);
}

export function playWin() {
  playSoundEffect('win', 0.6);
}

export function playStar() {
  playSoundEffect('star', 0.5);
}

// Mapped sounds (using existing files)
export function playFlip() {
  playSoundEffect('click', 0.3); // Use click sound for flip (lower volume)
}

export function playPop() {
  playSoundEffect('click', 0.4); // Use click sound for pop
}

// ============================================
// SOUND CONTROL
// ============================================

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEffectsEnabled', String(soundEnabled));
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  localStorage.setItem('soundEffectsEnabled', String(soundEnabled));
}