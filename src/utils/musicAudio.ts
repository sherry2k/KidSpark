// ============================================================
// MUSIC AUDIO: a small xylophone made with the browser's Web Audio
// ============================================================
//
// No sound files. Each note is two sine waves (the note, plus a quick bright
// "ping" two octaves above) with a fast attack and a smooth fade-out, which
// sounds like a wooden xylophone bar.
//
// The audio context is only created on the first tap (browsers will not make
// sound before the child touches the screen) and is paused when the Music
// screen closes.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

const getCtx = (): AudioContext | null => {
  try {
    if (!ctx) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor(); // keeps several fast notes from clipping
      master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

/** play one xylophone note. `delay` is in seconds from now. */
export const playMusicNote = (freq: number, opts: { delay?: number; length?: number; volume?: number } = {}): void => {
  const c = getCtx();
  if (!c || !master) return;
  const { delay = 0, length = 0.9, volume = 0.5 } = opts;
  const t = c.currentTime + delay;

  const body = c.createOscillator();
  const bodyGain = c.createGain();
  body.type = 'sine';
  body.frequency.value = freq;
  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  body.connect(bodyGain);
  bodyGain.connect(master);
  body.start(t);
  body.stop(t + length + 0.05);

  const ping = c.createOscillator();
  const pingGain = c.createGain();
  ping.type = 'sine';
  ping.frequency.value = freq * 4;
  pingGain.gain.setValueAtTime(0.0001, t);
  pingGain.gain.exponentialRampToValueAtTime(volume * 0.28, t + 0.004);
  pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  ping.connect(pingGain);
  pingGain.connect(master);
  ping.start(t);
  ping.stop(t + 0.22);
};

/** pause the audio engine (called when the Music screen closes) */
export const pauseMusicAudio = (): void => {
  try {
    if (ctx && ctx.state === 'running') void ctx.suspend();
  } catch {
    /* nothing to do */
  }
};
