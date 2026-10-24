import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import ItemIcon from '../components/mechanics/ItemIcon';
import { GameProgress } from '../store/gameStore';
import { buzz, POP } from '../utils/kidJuice';
import { playClick, playComplete } from '../utils/sounds';
import { playMusicNote, pauseMusicAudio } from '../utils/musicAudio';
import { NOTES, SONGS, Song, starsFor } from '../data/musicData';

/**
 * MusicGame — the Music hub.
 *
 *  Colour Xylophone   free play: eight coloured bars, tap them or slide a finger across.
 *  Play a Song        the next bar glows, the child taps it, and a tune comes out.
 *                     "Listen" plays the song first. Wrong bars never block: the
 *                     right bar keeps glowing until it is tapped.
 *
 * Sound is made with Web Audio (utils/musicAudio.ts), no audio files.
 * To add a song, add one entry to SONGS in data/musicData.ts.
 */

// Tailwind only creates the classes it can see in your source. The song card colours live in
// data/musicData.ts, so they are listed here too (harmless, and makes sure they are always built):
// from-amber-400 to-orange-500 from-emerald-400 to-teal-500 from-indigo-400 to-purple-500 from-pink-400 to-rose-500 from-sky-400 to-blue-500 from-violet-500 to-fuchsia-600

interface MusicGameProps {
  progress: GameProgress;
  onBack: () => void;
  onAnswer: (correct: boolean) => void;
  onComplete: (stars: number) => void;
}

const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";
const LISTEN_GAP_MS = 520; // time between notes when the app plays the song

type View = 'hub' | 'xylo' | 'song';

/* ============================================================
   The bars. Used by both the free-play xylophone and the song game.
   ============================================================ */

interface BarsProps {
  /** the bar that should be tapped next (song game), or null */
  target: number | null;
  /** bars that are ringing right now */
  lit: Record<number, boolean>;
  /** a bar that was tapped by mistake (shakes) */
  wrong: number | null;
  /** dragging a finger across the bars plays them (free play only) */
  slide: boolean;
  onHit: (note: number) => void;
}

const Bars: React.FC<BarsProps> = ({ target, lit, wrong, slide, onHit }) => {
  const down = useRef(false);
  const lastBar = useRef<number | null>(null);

  const barAt = (x: number, y: number): number | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const hit = el?.closest('[data-note]') as HTMLElement | null;
    if (!hit) return null;
    const n = Number(hit.getAttribute('data-note'));
    return Number.isNaN(n) ? null : n;
  };

  const handleDown = (e: React.PointerEvent) => {
    down.current = true;
    const n = barAt(e.clientX, e.clientY);
    lastBar.current = n;
    if (n !== null) onHit(n);
  };
  const handleMove = (e: React.PointerEvent) => {
    if (!slide || !down.current) return;
    const n = barAt(e.clientX, e.clientY);
    if (n !== null && n !== lastBar.current) {
      lastBar.current = n;
      onHit(n);
    }
  };
  const handleUp = () => {
    down.current = false;
    lastBar.current = null;
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-0 flex-1" style={{ maxHeight: 460 }}>
      {/* pointer row: shows where to tap next */}
      <div className="flex gap-1 px-0.5 shrink-0" style={{ height: 34 }} aria-hidden>
        {NOTES.map((_, i) => (
          <div key={i} className="flex-1 flex items-end justify-center">
            {target === i && (
              <motion.span
                data-kind="pointer"
                className="text-2xl leading-none"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
              >
                👇
              </motion.span>
            )}
          </div>
        ))}
      </div>

      <div
        data-kind="bars"
        className="flex-1 min-h-0 flex gap-1 px-0.5 items-center"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', minHeight: 200 }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onPointerLeave={handleUp}
      >
        {NOTES.map((n, i) => {
          const isTarget = target === i;
          const isLit = !!lit[i];
          const height = 100 - i * 6; // low notes are long, high notes are short, like a real xylophone
          return (
            <motion.div
              key={i}
              data-note={i}
              data-kind="bar"
              data-target={isTarget ? 'true' : 'false'}
              role="button"
              aria-label={`${n.name}`}
              className="flex-1 rounded-2xl relative flex flex-col items-center justify-between py-2 cursor-pointer"
              style={{
                height: `${height}%`,
                background: n.color,
                border: '3px solid rgba(255,255,255,.9)',
                boxShadow: isTarget
                  ? `0 0 0 4px #fff, 0 0 18px 6px ${n.color}, 0 6px 0 rgba(0,0,0,.22)`
                  : '0 6px 0 rgba(0,0,0,.22)',
                filter: isLit ? 'brightness(1.25)' : 'none',
                zIndex: isTarget ? 2 : 1,
              }}
              animate={
                wrong === i
                  ? { x: [0, -6, 6, -6, 0], scale: 1 }
                  : isLit
                    ? { scale: 0.94, y: 3, x: 0 }
                    : isTarget
                      ? { scale: [1, 1.07, 1], y: 0, x: 0 }
                      : { scale: 1, y: 0, x: 0 }
              }
              transition={isTarget && !isLit && wrong !== i ? { repeat: Infinity, duration: 0.9 } : { duration: 0.18 }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
              <span
                className="text-white font-bold leading-none"
                style={{ fontFamily: FONT, fontSize: 13, textShadow: '1px 1px 0 rgba(0,0,0,.35)' }}
              >
                {n.name}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/** a little picture of the eight bars, for the hub card */
const MiniBars: React.FC = () => (
  <div className="flex items-center justify-center gap-[3px]" style={{ height: 44 }} aria-hidden>
    {NOTES.map((n, i) => (
      <div
        key={i}
        style={{ width: 7, height: 44 - i * 3, background: n.color, borderRadius: 4, border: '1px solid rgba(255,255,255,.9)' }}
      />
    ))}
  </div>
);

/* ============================================================
   The screen
   ============================================================ */

const MusicGame: React.FC<MusicGameProps> = ({ progress, onBack, onAnswer, onComplete }) => {
  const [view, setView] = useState<View>('hub');
  const [song, setSong] = useState<Song | null>(null);

  // shared by both games
  const [lit, setLit] = useState<Record<number, boolean>>({});
  const litTimers = useRef<Record<number, number>>({});

  // song game
  const [idx, setIdx] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongBar, setWrongBar] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const idxRef = useRef(0);
  const wrongRef = useRef(0);
  const awarded = useRef(false);
  const listenTimers = useRef<number[]>([]);
  const msgTimer = useRef<number | null>(null);
  const wrongTimer = useRef<number | null>(null);
  const doneTimer = useRef<number | null>(null);

  /* ---------- timers ---------- */

  const clearListen = () => {
    listenTimers.current.forEach((t) => window.clearTimeout(t));
    listenTimers.current = [];
  };
  const clearAllTimers = () => {
    clearListen();
    Object.values(litTimers.current).forEach((t) => window.clearTimeout(t));
    litTimers.current = {};
    if (msgTimer.current !== null) window.clearTimeout(msgTimer.current);
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    if (doneTimer.current !== null) window.clearTimeout(doneTimer.current);
    msgTimer.current = wrongTimer.current = doneTimer.current = null;
  };

  useEffect(
    () => () => {
      clearAllTimers();
      pauseMusicAudio();
    },
    []
  );

  /* ---------- making a sound ---------- */

  const ring = (note: number, volume = 0.5) => {
    playMusicNote(NOTES[note].freq, { volume });
    setLit((l) => ({ ...l, [note]: true }));
    if (litTimers.current[note] !== undefined) window.clearTimeout(litTimers.current[note]);
    litTimers.current[note] = window.setTimeout(() => {
      setLit((l) => ({ ...l, [note]: false }));
    }, 240);
  };

  const flash = (text: string) => {
    setMessage(text);
    if (msgTimer.current !== null) window.clearTimeout(msgTimer.current);
    msgTimer.current = window.setTimeout(() => setMessage(null), 1700);
  };

  /* ---------- navigation inside the hub ---------- */

  const toHub = () => {
    clearAllTimers();
    setLit({});
    setListening(false);
    setMessage(null);
    setWrongBar(null);
    setDone(false);
    setSong(null);
    setView('hub');
  };

  const startSong = (s: Song) => {
    clearAllTimers();
    setLit({});
    setSong(s);
    setIdx(0);
    idxRef.current = 0;
    setWrongCount(0);
    wrongRef.current = 0;
    setWrongBar(null);
    setListening(false);
    setMessage(null);
    setDone(false);
    awarded.current = false;
    setView('song');
  };

  const listen = () => {
    if (!song || listening) return;
    clearListen();
    setMessage(null);
    setListening(true);
    song.notes.forEach((n, i) => {
      listenTimers.current.push(window.setTimeout(() => ring(n, 0.42), i * LISTEN_GAP_MS));
    });
    listenTimers.current.push(
      window.setTimeout(() => {
        setListening(false);
        listenTimers.current = [];
      }, song.notes.length * LISTEN_GAP_MS + 200)
    );
  };

  const finishSong = (s: Song) => {
    if (awarded.current) return;
    awarded.current = true;
    const stars = starsFor(wrongRef.current, s.notes.length);
    playComplete();
    buzz('success');
    onAnswer(true);
    onComplete(stars);
    // let the last note ring before the result screen
    doneTimer.current = window.setTimeout(() => setDone(true), 900);
  };

  /* ---------- a bar was tapped ---------- */

  const hitXylo = (note: number) => {
    ring(note);
    buzz('tick');
  };

  const hitSong = (note: number) => {
    if (!song || listening || done || awarded.current) return;
    const want = song.notes[idxRef.current];
    if (note === want) {
      ring(note);
      buzz('tick');
      const next = idxRef.current + 1;
      idxRef.current = next;
      setIdx(next);
      setMessage(null);
      if (next >= song.notes.length) finishSong(song);
    } else {
      ring(note, 0.22); // the wrong bar still sounds, but softly
      wrongRef.current += 1;
      setWrongCount(wrongRef.current);
      setWrongBar(note);
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
      wrongTimer.current = window.setTimeout(() => setWrongBar(null), 400);
      flash('Try the glowing bar! 👇');
    }
  };

  /* ============================================================
     Hub
     ============================================================ */
  if (view === 'hub') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🎵 Music" onBack={() => { playClick(); onBack(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center" style={{ fontFamily: FONT }}>
              Make some music! 🎶
            </h2>
            <p className="text-center text-xs text-gray-500 font-semibold mb-3">Tap the bars and listen.</p>

            <div className="max-w-lg mx-auto mb-4">
              <h3 className="text-sm font-bold text-gray-600 mb-2 px-1" style={{ fontFamily: FONT }}>
                Play
              </h3>
              <motion.button
                data-kind="mode"
                data-id="xylo"
                onClick={() => { playClick(); setView('xylo'); }}
                className="w-full rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br from-fuchsia-500 to-purple-600"
                style={{ boxShadow: '0 8px 0 #86198F, 0 12px 22px rgba(0,0,0,.18)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={POP}
                whileTap={{ scale: 0.96, y: 4 }}
              >
                <MiniBars />
                <h3 className="text-lg font-bold mt-2" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                  Colour Xylophone
                </h3>
                <p className="text-xs opacity-90">Tap or slide your finger!</p>
              </motion.button>
            </div>

            <div className="max-w-lg mx-auto mb-4">
              <h3 className="text-sm font-bold text-gray-600 mb-2 px-1 flex items-baseline gap-2" style={{ fontFamily: FONT }}>
                Play a Song
                <span className="text-xs font-semibold text-gray-400">follow the glowing bar</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SONGS.map((s, i) => (
                  <motion.button
                    key={s.id}
                    data-kind="mode"
                    data-id={s.id}
                    onClick={() => { playClick(); startSong(s); }}
                    className={`rounded-3xl p-4 text-white border-4 border-white bg-gradient-to-br ${s.grad}`}
                    style={{ boxShadow: `0 8px 0 ${s.shadow}, 0 12px 22px rgba(0,0,0,.18)`, minHeight: 140 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + Math.min(i, 8) * 0.05, ...POP }}
                    whileTap={{ scale: 0.94, y: 4 }}
                  >
                    <div className="flex justify-center mb-2">
                      <ItemIcon icon={s.icon} size={40} label={s.title} />
                    </div>
                    <h3 className="text-base font-bold leading-tight" style={{ fontFamily: FONT, textShadow: '2px 2px 0 rgba(0,0,0,.18)' }}>
                      {s.title}
                    </h3>
                    <p className="text-xs opacity-90">{s.notes.length} notes</p>
                    <div className="flex justify-center gap-0.5 mt-1.5">
                      {[1, 2, 3].map((d) => (
                        <span key={d} className="text-[11px]" style={{ opacity: d <= s.diff ? 1 : 0.28 }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ============================================================
     Free-play xylophone
     ============================================================ */
  if (view === 'xylo') {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title="🎵 Colour Xylophone" onBack={() => { playClick(); toHub(); }} stars={progress.stars} />
          <div className="flex-1 flex flex-col px-2 pb-3 min-h-0">
            <p className="text-center text-sm font-bold text-gray-700 mt-1" style={{ fontFamily: FONT }}>
              Tap the bars, or slide your finger across! 🎶
            </p>
            <Bars target={null} lit={lit} wrong={null} slide onHit={hitXylo} />
            <div className="flex justify-center mt-3">
              <motion.button
                data-kind="rainbow"
                onClick={() => {
                  playClick();
                  clearListen();
                  NOTES.forEach((_, i) => {
                    listenTimers.current.push(window.setTimeout(() => ring(i, 0.4), i * 240));
                  });
                }}
                className="rounded-2xl px-5 py-2.5 text-white font-bold border-4 border-white"
                style={{ background: 'linear-gradient(135deg,#C026D3,#7C3AED)', boxShadow: '0 5px 0 #5B21B6', fontFamily: FONT }}
                whileTap={{ scale: 0.95, y: 3 }}
              >
                🌈 Rainbow
              </motion.button>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ============================================================
     Song: result
     ============================================================ */
  if (!song) return null;

  if (done) {
    const stars = starsFor(wrongCount, song.notes.length);
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col overflow-x-hidden">
          <Navigation title={`🎵 ${song.title}`} onBack={() => { playClick(); toHub(); }} stars={progress.stars} />
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mt-4">{song.icon}</div>
              <p className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: FONT }}>
                {stars === 3 ? 'You played it!' : 'Lovely playing!'} 🎉
              </p>
              <p className="text-sm text-gray-500 font-semibold mt-1">{song.title}</p>

              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-4xl"
                    style={{ opacity: i < stars ? 1 : 0.2 }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.14, type: 'spring' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 bg-white/90 border-4 border-white rounded-2xl p-3 text-left">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">For grown-ups</p>
                <p className="text-sm text-gray-600 font-semibold">
                  Following the glowing bars builds listening, memory for a sequence and finger-and-eye coordination.
                  The bars use the sung note names, Do Re Mi Fa Sol La Ti Do, so your child learns them while playing.
                  Try singing along!
                </p>
              </div>

              <div className="flex gap-3 mt-5 justify-center">
                <motion.button
                  data-kind="again"
                  onClick={() => { playClick(); startSong(song); }}
                  className="rounded-2xl px-6 py-4 bg-white text-gray-700 font-bold border-4 border-white"
                  style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🔄 Again
                </motion.button>
                <motion.button
                  data-kind="newsong"
                  onClick={() => { playClick(); toHub(); }}
                  className="rounded-2xl px-6 py-4 text-white font-bold border-4 border-white"
                  style={{ background: 'linear-gradient(135deg,#C026D3,#7C3AED)', boxShadow: '0 5px 0 #5B21B6', fontFamily: FONT }}
                  whileTap={{ scale: 0.95, y: 3 }}
                >
                  🎵 New song
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  /* ============================================================
     Song: playing
     ============================================================ */
  const target = listening || idx >= song.notes.length ? null : song.notes[idx];

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col overflow-x-hidden">
        <Navigation
          title={`🎵 ${song.title}`}
          onBack={() => { playClick(); toHub(); }}
          stars={progress.stars}
          showProgress
          progress={(idx / song.notes.length) * 100}
        />

        <div className="flex-1 flex flex-col px-2 pb-3 min-h-0">
          {/* the tune as dots: coloured when played, ringed when next */}
          <div className="flex flex-wrap justify-center gap-[3px] mt-1 mb-1" data-kind="tune" aria-hidden>
            {song.notes.map((n, i) => (
              <span
                key={i}
                data-kind="tune-dot"
                data-state={i < idx ? 'done' : i === idx ? 'next' : 'todo'}
                className="rounded-full"
                style={{
                  width: 13,
                  height: 13,
                  background: i < idx ? NOTES[n].color : '#E5E7EB',
                  border: i === idx ? '3px solid #1F2937' : '2px solid #fff',
                  opacity: i < idx || i === idx ? 1 : 0.8,
                }}
              />
            ))}
          </div>

          <div className="h-6 flex items-center justify-center" data-kind="hint">
            <AnimatePresence mode="wait">
              <motion.p
                key={listening ? 'l' : message ?? 'tap'}
                className="text-sm font-bold text-gray-700"
                style={{ fontFamily: FONT }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {listening ? 'Listen… 👂' : message ?? 'Tap the glowing bar!'}
              </motion.p>
            </AnimatePresence>
          </div>

          <Bars target={target} lit={lit} wrong={wrongBar} slide={false} onHit={hitSong} />

          <div className="flex justify-center gap-3 mt-3">
            <motion.button
              data-kind="listen"
              onClick={() => { playClick(); listen(); }}
              disabled={listening}
              className="rounded-2xl px-5 py-2.5 text-white font-bold border-4 border-white"
              style={{
                background: 'linear-gradient(135deg,#0EA5E9,#2563EB)',
                boxShadow: '0 5px 0 #1D4ED8',
                fontFamily: FONT,
                opacity: listening ? 0.6 : 1,
              }}
              whileTap={{ scale: 0.95, y: 3 }}
            >
              🔊 Listen
            </motion.button>
            <motion.button
              data-kind="restart"
              onClick={() => { playClick(); startSong(song); }}
              className="rounded-2xl px-5 py-2.5 bg-white text-gray-700 font-bold border-4 border-white"
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,.12)', fontFamily: FONT }}
              whileTap={{ scale: 0.95, y: 3 }}
            >
              🔄 Restart
            </motion.button>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default MusicGame;
