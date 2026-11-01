// src/utils/sparkVoice.ts
// Spark's voice clips (ElevenLabs). Short MP3 files in /public/sounds/spark-*.mp3
//
//  - playSparkVoice('hello' | 'correct' | 'wrong' | 'result3' | 'result2' | 'result1')
//  - sparkReact('correct' | 'wrong')  -> only now and then, so it never gets annoying
//  - the background music gets quieter while Spark speaks
//  - one on/off switch: setSparkVoiceEnabled(false)

import { Howl, Howler } from 'howler';

const BASE = '/sounds/spark-';

const GROUPS = {
  hello: ['hello-1', 'hello-2'],
  correct: ['correct-1', 'correct-2', 'correct-3', 'correct-4'],
  wrong: ['wrong-1', 'wrong-2', 'wrong-3'],
  result3: ['result-3star'],
  result2: ['result-2star'],
  result1: ['result-1star'],
} as const;

export type SparkGroup = keyof typeof GROUPS;

/* how often Spark comments on answers */
const REACT_CHANCE = { correct: 0.5, wrong: 1 };
const REACT_MIN_GAP_MS = 2500;

const KEY = 'sparkVoiceEnabled';
let enabled = true;
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(KEY);
    enabled = saved === null ? true : saved === 'true';
  } catch {
    /* ignore */
  }
}

const cache: Record<string, Howl> = {};
let current: Howl | null = null;
let delayTimer: ReturnType<typeof setTimeout> | null = null;
let speaking = false;
let lastReactionAt = 0;
const lastPick: Partial<Record<SparkGroup, string>> = {};
const listeners = new Set<(s: boolean) => void>();

function setSpeaking(v: boolean) {
  if (speaking === v) return;
  speaking = v;
  listeners.forEach((l) => l(v));
}

/** Lets a component (like the tappable Spark) know when he is talking. Returns an unsubscribe function. */
export function subscribeSparkSpeaking(cb: (speaking: boolean) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function isSparkSpeaking() {
  return speaking;
}

function getHowl(name: string): Howl {
  if (!cache[name]) {
    cache[name] = new Howl({ src: [`${BASE}${name}.mp3`], volume: 1, preload: true });
  }
  return cache[name];
}

/* ---- background music: a bit quieter while Spark talks ---- */
let duckedFrom: number | null = null;
function musicEl(): HTMLAudioElement | null {
  try {
    return (window as any).__kidsparkMusic?.audio ?? null;
  } catch {
    return null;
  }
}
function duck() {
  const a = musicEl();
  if (!a || a.paused || duckedFrom !== null) return;
  duckedFrom = a.volume;
  a.volume = Math.max(0, duckedFrom * 0.3);
}
function unduck() {
  const a = musicEl();
  if (a && duckedFrom !== null) a.volume = duckedFrom;
  duckedFrom = null;
}

/** Download all the clips quietly in the background (they are small) so they play without delay. */
export function preloadSparkVoice() {
  (Object.keys(GROUPS) as SparkGroup[]).forEach((g) => GROUPS[g].forEach((n) => getHowl(n)));
}

export function stopSparkVoice() {
  if (delayTimer) {
    clearTimeout(delayTimer);
    delayTimer = null;
  }
  if (current) {
    current.stop();
    current = null;
  }
  setSpeaking(false);
  unduck();
}

function pick(group: SparkGroup): string {
  const names = GROUPS[group] as readonly string[];
  let name = names[Math.floor(Math.random() * names.length)];
  if (names.length > 1 && name === lastPick[group]) {
    name = names[(names.indexOf(name) + 1) % names.length];
  }
  lastPick[group] = name;
  return name;
}

/** Play one of Spark's clips from a group. Returns false when the voice is switched off. */
export function playSparkVoice(group: SparkGroup, delayMs = 0): boolean {
  if (!enabled) return false;
  stopSparkVoice();

  const start = () => {
    delayTimer = null;
    const howl = getHowl(pick(group));
    current = howl;
    const finish = () => {
      if (current === howl) {
        current = null;
        setSpeaking(false);
        unduck();
      }
    };
    howl.once('end', finish);
    howl.once('stop', finish);
    howl.once('playerror', finish);
    howl.once('loaderror', finish);
    const go = () => {
      setSpeaking(true);
      duck();
      howl.play();
    };
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(go).catch(finish);
    } else {
      go();
    }
  };

  if (delayMs > 0) delayTimer = setTimeout(start, delayMs);
  else start();
  return true;
}

/** A short comment after an answer. Only sometimes, and never while he is already talking. */
export function sparkReact(kind: 'correct' | 'wrong') {
  if (!enabled || speaking) return;
  /* don't talk over the game's own question narration */
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) return;
  } catch {
    /* ignore */
  }
  const now = Date.now();
  if (now - lastReactionAt < REACT_MIN_GAP_MS) return;
  if (Math.random() > REACT_CHANCE[kind]) return;
  lastReactionAt = now;
  playSparkVoice(kind, 350);
}

export function isSparkVoiceEnabled() {
  return enabled;
}

export function setSparkVoiceEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, String(on));
  } catch {
    /* ignore */
  }
  if (!on) stopSparkVoice();
}
