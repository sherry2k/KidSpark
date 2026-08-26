/**
 * kidJuice.ts — the "feel" layer.
 *
 * Two things that make a kids' app stop feeling dead:
 *   1. every touch answers back (haptic tick + sound)
 *   2. every instruction is SPOKEN, because half your audience can't read
 *
 * No assets, no dependencies. Works today.
 */

/* ------------------------------------------------------------------ */
/* Haptics                                                             */
/* ------------------------------------------------------------------ */

type Buzz = 'tick' | 'soft' | 'success' | 'oops';

const PATTERNS: Record<Buzz, number | number[]> = {
  tick: 8,              // every tap / drag pickup
  soft: 18,             // item landed, step advanced
  success: [0, 30, 60, 45],
  oops: [0, 25, 40, 25],
};

export function buzz(kind: Buzz = 'tick') {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(PATTERNS[kind] as number | number[]);
    }
  } catch {
    /* vibration unsupported — ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Voice — free voice-over via the OS speech engine                    */
/* ------------------------------------------------------------------ */

let voiceEnabled = true;
let chosenVoice: SpeechSynthesisVoice | null = null;

export function setVoiceEnabled(on: boolean) {
  voiceEnabled = on;
  if (!on) stopSpeaking();
}

export function isVoiceEnabled() {
  return voiceEnabled;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (chosenVoice) return chosenVoice;
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a female English voice — tests better with 3-7 year olds.
  chosenVoice =
    voices.find((v) => /en(-|_)(US|GB|AU)/i.test(v.lang) && /female|samantha|karen|zira|google uk english female/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  return chosenVoice;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    chosenVoice = null;
    pickVoice();
  };
}

/**
 * Say something out loud. Cancels whatever was being said.
 * Call this for EVERY instruction, and for the fun fact.
 */
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (!voiceEnabled || !text) return;
  try {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang || 'en-US';
    u.rate = opts.rate ?? 0.92; // a touch slower than adult speech
    u.pitch = opts.pitch ?? 1.15; // a touch brighter
    u.volume = 1;
    synth.speak(u);
  } catch {
    /* speech unsupported — the on-screen text still shows */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Motion presets — import these instead of retyping spring configs    */
/* ------------------------------------------------------------------ */

export const POP = { type: 'spring' as const, stiffness: 520, damping: 18 };
export const SETTLE = { type: 'spring' as const, stiffness: 260, damping: 22 };

/** Squash-and-stretch on tap. Spread onto any framer-motion element. */
export const tapSquash = {
  whileTap: { scale: 0.9, y: 3 },
  whileHover: { scale: 1.06, y: -3 },
  transition: POP,
};

/* ------------------------------------------------------------------ */
/* Confetti-free celebration helper                                    */
/* ------------------------------------------------------------------ */

/** Returns N evenly-spread sparkle positions around a centre, for burst FX. */
export function burstPoints(n = 8, radius = 70) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius, delay: i * 0.03 };
  });
}
