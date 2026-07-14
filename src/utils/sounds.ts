// Simple sound effects using Web Audio API
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  try {
    audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // silently fail
  }
}

export function playCorrect() {
  playTone(523.25, 0.15, 'sine', 0.12);
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.12), 100);
  setTimeout(() => playTone(783.99, 0.2, 'sine', 0.12), 200);
}

export function playWrong() {
  playTone(200, 0.3, 'square', 0.08);
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.08);
}

export function playComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.3, 'sine', 0.12), i * 150);
  });
}

export function playPop() {
  playTone(1200, 0.08, 'sine', 0.1);
}

export function playFlip() {
  playTone(600, 0.1, 'sine', 0.08);
}
