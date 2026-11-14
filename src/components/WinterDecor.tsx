// Winter theme building blocks for KidSpark.
// Everything uses inline styles + SVG (no Tailwind margin/padding classes), so the
// phone reset in index.css cannot break the layout. All parts are pointer-events:none.
import { useId, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Season switch                                                      */
/* ------------------------------------------------------------------ */
// Set to true / false to force winter on or off. Leave null for the automatic
// season (15 Nov -> 15 Feb).
const WINTER_FORCE: boolean | null = null;

export function isWinter(now: Date = new Date()): boolean {
  if (WINTER_FORCE !== null) return WINTER_FORCE;
  // preview helper: open the site with ?winter=1 (on) or ?winter=0 (off) to test without editing code
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('winter');
    if (q === '1') return true;
    if (q === '0') return false;
  }
  const m = now.getMonth(); // 0 = Jan
  const d = now.getDate();
  if (m === 10) return d >= 15; // Nov 15 -> Nov 30
  if (m === 11 || m === 0) return true; // Dec, Jan
  if (m === 1) return d <= 15; // Feb 1 -> Feb 15
  return false;
}

/* tiny seeded random so shapes never jump between renders */
function makeRnd(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const KEYFRAMES = `
@keyframes ks-fall { 0%{transform:translate3d(0,-8vh,0) rotate(0deg)} 100%{transform:translate3d(var(--ks-dx),108vh,0) rotate(360deg)} }
@keyframes ks-twinkle { 0%,100%{opacity:.5} 50%{opacity:1} }
@media (prefers-reduced-motion: reduce){ .ks-flake{animation:none !important} }
`;

/* ------------------------------------------------------------------ */
/*  Falling snow (fixed over the whole screen)                         */
/* ------------------------------------------------------------------ */
export function SnowFall({ count = 24, zIndex = 5 }: { count?: number; zIndex?: number }) {
  const flakes = useMemo(() => {
    const r = makeRnd(7);
    return Array.from({ length: count }, (_, i) => ({
      left: r() * 100,
      size: 10 + r() * 16,
      dur: 9 + r() * 9,
      delay: -r() * 18,
      dx: (r() - 0.5) * 80,
      op: 0.55 + r() * 0.4,
      glyph: i % 3 === 0 ? '❄' : i % 3 === 1 ? '❅' : '•',
    }));
  }, [count]);
  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex }}
    >
      <style>{KEYFRAMES}</style>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="ks-flake"
          style={{
            position: 'absolute',
            top: 0,
            left: `${f.left}%`,
            fontSize: f.size,
            lineHeight: 1,
            color: '#fff',
            opacity: f.op,
            textShadow: '0 0 4px rgba(150,170,255,.9)',
            ['--ks-dx' as string]: `${f.dx}px`,
            animation: `ks-fall ${f.dur}s linear ${f.delay}s infinite`,
            willChange: 'transform',
          }}
        >
          {f.glyph}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Snow cap with drips - sits on top of a card                        */
/*  Parent must be position:relative and overflow:visible              */
/* ------------------------------------------------------------------ */
function capPath(w: number, rnd: () => number) {
  let d = 'M0 20 Q4 4 20 6 ';
  const n = Math.max(3, Math.round(w / 26));
  const step = (w - 40) / n;
  let x = 20;
  for (let i = 0; i < n; i++) {
    d += `Q${x + step * 0.3} -6 ${x + step * 0.55} 4 `;
    x += step;
  }
  d += `L${w - 14} 6 Q${w} 4 ${w} 20 L${w - 5} 26 `;
  const m = Math.max(4, Math.round(w / 22));
  const s2 = (w - 10) / m;
  let bx = w - 5;
  for (let i = 0; i < m; i++) {
    const depth = 8 + rnd() * 13;
    const mx = bx - s2 / 2;
    const nx = bx - s2;
    d += `Q${bx - s2 * 0.15} ${26 + depth} ${mx} ${26 + depth * 0.6} Q${nx + s2 * 0.15} ${26 + depth * 0.2} ${nx} 26 `;
    bx = nx;
  }
  return d + 'Z';
}

export function SnowCap({ seed = 1, width = 288 }: { seed?: number; width?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const d = useMemo(() => capPath(width, makeRnd(seed * 17 + 3)), [seed, width]);
  return (
    <svg
      aria-hidden
      viewBox={`0 -8 ${width} 64`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: -3,
        top: -13,
        width: 'calc(100% + 6px)',
        height: 40,
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <filter id={`cs${uid}`} x="-5%" y="-20%" width="110%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#5A6BD0" floodOpacity=".35" />
        </filter>
        <linearGradient id={`cg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#E6EEFF" />
        </linearGradient>
      </defs>
      <path filter={`url(#cs${uid})`} d={d} fill={`url(#cg${uid})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Icicles that hang from the top edge of a banner                    */
/* ------------------------------------------------------------------ */
export function Icicles({ seed = 3, inset = 0 }: { seed?: number; inset?: number }) {
  const d = useMemo(() => {
    const r = makeRnd(seed * 31 + 5);
    let p = 'M0 0 H572 V6 ';
    for (let x = 560; x > 10; x -= 26) {
      const h = 5 + r() * 9;
      p += `L${x} 6 L${x - 6} ${6 + h} L${x - 12} 6 `;
    }
    return p + 'L0 6 Z';
  }, [seed]);
  return (
    <svg
      aria-hidden
      viewBox="0 0 572 24"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: inset,
        top: -5,
        width: `calc(100% - ${inset * 2}px)`,
        height: 22,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      <path d={d} fill="#fff" opacity=".95" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Snowy ground with pine trees and the snowman                       */
/*  fixed = stuck to the bottom of the screen, otherwise it sits in    */
/*  the normal page flow (put it at the end of a scroll list)          */
/* ------------------------------------------------------------------ */
export function SnowDrift({
  fixed = true,
  snowman = true,
  trees = true,
  zIndex = 4,
}: {
  fixed?: boolean;
  snowman?: boolean;
  trees?: boolean;
  zIndex?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <div
      aria-hidden
      className="ks-drift"
      style={{
        position: fixed ? 'fixed' : 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(100%, 640px)',
        bottom: 0,
        zIndex,
        pointerEvents: 'none',
        lineHeight: 0,
      }}
    >
      {/* on wide screens (desktop) the ground is narrower than the app column, so soften its two ends.
          Phones are unchanged (rule only applies above 640px). */}
      <style>{`@media (min-width:641px){.ks-drift{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 7%,#000 93%,transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 7%,#000 93%,transparent 100%)}}`}</style>
      <svg viewBox="0 0 576 150" style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id={`dg${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#DCE6FF" />
          </linearGradient>
          <filter id={`ds${uid}`} x="-5%" y="-30%" width="110%" height="160%">
            <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#6B7BD6" floodOpacity=".35" />
          </filter>
        </defs>
        <path
          filter={`url(#ds${uid})`}
          d="M0 62 C60 30 120 40 190 56 C260 72 320 36 390 40 C460 44 520 66 576 46 L576 150 L0 150 Z"
          fill={`url(#dg${uid})`}
        />
        {trees && (
          <g transform="translate(40 8)">
            <rect x="22" y="76" width="10" height="16" fill="#8B5A2B" />
            <path d="M27 6 L52 42 H38 L58 70 H-4 L16 42 H2 Z" fill="#2E9D6A" />
            <path d="M27 6 L40 26 Q27 20 14 26 Z M12 44 Q27 38 42 44 L50 58 Q27 50 4 58 Z" fill="#fff" opacity=".92" />
          </g>
        )}
        {trees && (
          <g transform="translate(150 30) scale(.62)">
            <rect x="22" y="76" width="10" height="16" fill="#8B5A2B" />
            <path d="M27 6 L52 42 H38 L58 70 H-4 L16 42 H2 Z" fill="#2E9D6A" />
            <path d="M27 6 L40 26 Q27 20 14 26 Z M12 44 Q27 38 42 44 L50 58 Q27 50 4 58 Z" fill="#fff" opacity=".92" />
          </g>
        )}
        {snowman && (
          <g transform="translate(470 4)">
            <ellipse cx="42" cy="108" rx="40" ry="8" fill="#B9C6F2" opacity=".5" />
            <circle cx="42" cy="86" r="28" fill="#fff" stroke="#DCE6FF" strokeWidth="2" />
            <circle cx="42" cy="48" r="21" fill="#fff" stroke="#DCE6FF" strokeWidth="2" />
            <circle cx="35" cy="44" r="3" fill="#2B2B50" />
            <circle cx="49" cy="44" r="3" fill="#2B2B50" />
            <path d="M42 50 L58 54 L42 56 Z" fill="#FF8A3D" />
            <circle cx="42" cy="78" r="3" fill="#2B2B50" />
            <circle cx="42" cy="90" r="3" fill="#2B2B50" />
            <path d="M22 64 Q42 76 62 64 L62 72 Q42 84 22 72 Z" fill="#E5303A" />
            <path d="M56 70 L64 92 L56 94 Z" fill="#E5303A" />
            <rect x="26" y="22" width="32" height="8" rx="3" fill="#7C3AED" />
            <rect x="31" y="6" width="22" height="18" rx="3" fill="#7C3AED" />
            <rect x="31" y="18" width="22" height="5" fill="#FF6B8C" />
          </g>
        )}
      </svg>
    </div>
  );
}

/* Height of the snowy ground (same maths as the SVG's 576x150 box). Use it as
   padding-bottom on a scroll area so the last items are not hidden behind it. */
export const DRIFT_PAD = 'calc(min(100vw, 640px) * 0.26)';

/* Icy page background (use as the outer wrapper background) */
export const WINTER_BG =
  'linear-gradient(180deg,#CFE4FF 0%,#DCD3FF 45%,#EADBFF 100%)';
