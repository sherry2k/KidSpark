/**
 * tones.ts — musical notes, generated, no audio files.
 *
 * Simon works because each pad has its OWN PITCH. The sequence stops being
 * four positions to memorise and becomes a little tune you can hum — and
 * melodic memory is far stronger than positional memory in young children.
 * Your Color Memory pads all played the same `playPop()`, which throws that
 * away entirely.
 *
 * Web Audio synthesises these, so it costs no assets and no download.
 */

let ctx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // browsers suspend the context until a real user gesture
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

/** Call once from a tap handler so the first note isn't swallowed. */
export const unlockAudio = () => {
  getCtx();
};

interface ToneOpts {
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  /** slide to this frequency by the end — used for the "oops" sound */
  glideTo?: number;
}

export function playTone(freq: number, opts: ToneOpts = {}) {
  const c = getCtx();
  if (!c) return;

  const { duration = 0.32, type = 'sine', volume = 0.18, glideTo } = opts;
  const now = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, glideTo), now + duration);

  // a soft attack and release — a raw square edge is harsh through a phone speaker
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/**
 * The four pad notes: C4 · E4 · G4 · C5.
 *
 * A major arpeggio, so any order sounds pleasant — there is no combination a
 * child can play that comes out sour. That matters when they'll hear it
 * hundreds of times.
 */
export const PAD_NOTES = [261.63, 329.63, 392.0, 523.25];

export const playPad = (index: number) =>
  playTone(PAD_NOTES[index % PAD_NOTES.length], { duration: 0.36, type: 'sine', volume: 0.2 });

/** Rising three-note flourish for a correct answer. */
export const playWin = () => {
  [523.25, 659.25, 783.99].forEach((f, i) =>
    window.setTimeout(() => playTone(f, { duration: 0.22, volume: 0.16 }), i * 90)
  );
};

/** A soft descending slide. Deliberately gentle — not a buzzer. */
export const playOops = () =>
  playTone(300, { duration: 0.4, type: 'triangle', volume: 0.14, glideTo: 150 });

/** Short blip for placing or revealing something. */
export const playBlip = (high = false) =>
  playTone(high ? 880 : 620, { duration: 0.12, type: 'triangle', volume: 0.12 });
