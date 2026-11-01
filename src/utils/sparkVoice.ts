// src/utils/sparkVoice.ts
// Spark's voice clips (ElevenLabs). Short MP3 files in /public/sounds/spark-*.mp3
//
//  - playSparkVoice('hello' | 'correct' | 'wrong' | 'hint' | 'result3' | 'result2' | 'result1')
//  - playSparkIntro(gameId)  -> the opening line of a game (intro-<gameId>.mp3)
//  - sparkReact('correct' | 'wrong')  -> only now and then, so it never gets annoying
//  - the background music gets quieter while Spark speaks
//  - one on/off switch: setSparkVoiceEnabled(false)

import { Howl, Howler } from 'howler';

const BASE = '/sounds/spark-';

const GROUPS = {
  hello: ['hello-1', 'hello-2'],
  correct: ['correct-1', 'correct-2', 'correct-3', 'correct-4'],
  wrong: ['wrong-1', 'wrong-2', 'wrong-3'],
  hint: ['hint-1', 'hint-2'],
  result3: ['result-3star'],
  result2: ['result-2star'],
  result1: ['result-1star'],
} as const;

export type SparkGroup = keyof typeof GROUPS;

/* games that have an opening line (intro-<id>.mp3) */
const INTRO_IDS = ['learn', 'quiz', 'sounds', 'music', 'math', 'wordbuilder', 'memory', 'match', 'coloring', 'puzzle', 'skills', 'creative'];

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
  INTRO_IDS.forEach((id) => getHowl(`intro-${id}`));
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

/** Play one clip by file name (without the spark- prefix and .mp3). */
function playByName(name: string, delayMs: number): boolean {
  if (!enabled) return false;
  stopSparkVoice();

  const start = () => {
    delayTimer = null;
    const howl = getHowl(name);
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

/** Play one of Spark's clips from a group. Returns false when the voice is switched off. */
export function playSparkVoice(group: SparkGroup, delayMs = 0): boolean {
  return playByName(pick(group), delayMs);
}

/** The opening line of a game, for example playSparkIntro('math'). Call it when the game opens. */
export function playSparkIntro(gameId: string): boolean {
  if (!INTRO_IDS.includes(gameId)) return false;
  wrongStreak = 0;
  return playByName(`intro-${gameId}`, 300);
}

/** Counts wrong answers in a row, so two misses in a row get a gentle hint instead. */
let wrongStreak = 0;

/** A short comment after an answer. Only sometimes, and never while he is already talking. */
export function sparkReact(kind: 'correct' | 'wrong') {
  if (kind === 'correct') wrongStreak = 0;
  else wrongStreak += 1;

  if (!enabled || speaking) return;
  /* don't talk over the game's own question narration */
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) return;
  } catch {
    /* ignore */
  }
  const now = Date.now();
  if (now - lastReactionAt < REACT_MIN_GAP_MS) return;

  if (kind === 'wrong' && wrongStreak >= 2) {
    wrongStreak = 0;
    lastReactionAt = now;
    playSparkVoice('hint', 350);
    return;
  }

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
