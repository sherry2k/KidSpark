/**
 * LearnIcon — decides how to draw a learn item, instead of always using its emoji.
 *
 * WHY THIS EXISTS
 *
 * Four of the learn categories have a correct representation that is NOT a
 * picture from a font we don't control:
 *
 *   colors   → the table already carries a hex value. Draw that.
 *   numbers  → draw the digit. Keycap emoji render 11 as two separate badges,
 *              and are a font away from not rendering at all.
 *   shapes   → draw the shape. Half the emoji in that table are objects:
 *              "Rectangle" was a green square, "Oval" was an egg, "Cylinder"
 *              was a tin of food, and Pentagon/Hexagon weren't emoji at all.
 *   anything else → the emoji, with an emoji font forced (see below).
 *
 * Everywhere else — animals, fruit, vehicles — emoji are fine. A tangerine
 * standing in for an orange harms nobody.
 *
 * USAGE: find wherever the learn screen renders `{item.emoji}` and replace it:
 *
 *     <LearnIcon item={item} size={64} />
 *
 * It falls back to the emoji for every category it doesn't handle, so nothing
 * you aren't expecting can change.
 */

import React from 'react';

export type LearnLike = {
  id?: string;
  name?: string;
  emoji?: string;
  /** hex value — present on the colors and fruits/vegetables tables */
  color?: string;
  category?: string;
};

type Props = {
  item: LearnLike;
  /** rendered size in px — the icon fills a square box of this size */
  size?: number;
  className?: string;
};

/* Emoji fonts are missing or incomplete on a lot of cheap Androids, and when
   the browser falls back to a text font you get a black-and-white glyph or an
   empty box. Naming the emoji fonts explicitly is what fixed the green ✓ tiles
   in the cooking screens. */
const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Android Emoji",EmojiOne,sans-serif';

/* ------------------------------------------------------------------ */
/* colours                                                             */
/* ------------------------------------------------------------------ */

function ColorSwatch({ hex, size }: { hex: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="presentation"
      style={{ display: 'block' }}
    >
      {/* soft drop so a pale colour still reads as an object on white */}
      <circle cx="50" cy="54" r="40" fill="rgba(23,26,35,.13)" />
      <circle cx="50" cy="50" r="40" fill={hex} stroke="rgba(23,26,35,.22)" strokeWidth="3" />
      {/* highlight — makes the circle look like a bead rather than a flat dot */}
      <ellipse cx="38" cy="34" rx="13" ry="9" fill="rgba(255,255,255,.45)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* numbers and letters                                                 */
/* ------------------------------------------------------------------ */

function GlyphText({ text, size }: { text: string; size: number }) {
  // shrink the type as the string gets longer so "100" still fits the box
  const fontSize = text.length >= 3 ? size * 0.42 : text.length === 2 ? size * 0.55 : size * 0.68;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize,
        lineHeight: 1,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: "'Bubblegum One', 'Fredoka', system-ui, sans-serif",
        color: 'currentColor',
      }}
    >
      {text}
    </span>
  );
}

/** "num-11" → "11"; "11 - Eleven" → "11"; "A - Apple" → "A" */
function numberFrom(item: LearnLike): string | null {
  const fromId = /^num-(\d+)$/.exec(item.id || '');
  if (fromId) return fromId[1];
  const fromName = /^\s*(\d+)/.exec(item.name || '');
  if (fromName) return fromName[1];
  return null;
}

/* ------------------------------------------------------------------ */
/* shapes                                                              */
/* ------------------------------------------------------------------ */

/** points of a regular n-sided polygon inscribed in a circle, flat-ish top */
function polygon(n: number, cx: number, cy: number, r: number, rotateDeg: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((i * 360) / n + rotateDeg) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/** a five-pointed star as one closed path — ten alternating points, no overlap */
function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * 36 - 90) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/**
 * An Archimedean spiral as a polyline. Drawn point by point rather than as a
 * chain of SVG arcs — the arc version looked like a blob, because arc flags
 * that size don't give you an evenly widening curve.
 */
function spiralPath(
  cx: number, cy: number, rStart: number, rEnd: number, turns: number, steps: number,
): string {
  const total = turns * 2 * Math.PI;
  let out = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * total;
    const r = rStart + ((rEnd - rStart) * t) / total;
    const x = cx + r * Math.cos(t - Math.PI / 2);
    const y = cy + r * Math.sin(t - Math.PI / 2);
    out += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return out.trim();
}

const SHAPE_FILL = '#8b3ff0';
const SHAPE_DARK = '#5c1fb3';

function ShapeGlyph({ id, size }: { id: string; size: number }) {
  const f = SHAPE_FILL;
  const d = SHAPE_DARK;
  const common = { fill: f, stroke: d, strokeWidth: 4, strokeLinejoin: 'round' as const };

  let body: React.ReactNode = null;

  switch (id) {
    case 'circle':
      body = <circle cx="50" cy="50" r="38" {...common} />;
      break;
    case 'square':
      body = <rect x="14" y="14" width="72" height="72" rx="4" {...common} />;
      break;
    case 'rectangle':
      // genuinely a rectangle: clearly longer than it is tall
      body = <rect x="8" y="27" width="84" height="46" rx="4" {...common} />;
      break;
    case 'oval':
      body = <ellipse cx="50" cy="50" rx="42" ry="28" {...common} />;
      break;
    case 'triangle':
      body = <polygon points="50,12 90,84 10,84" {...common} />;
      break;
    case 'pentagon':
      body = <polygon points={polygon(5, 50, 52, 40, -90)} {...common} />;
      break;
    case 'hexagon':
      body = <polygon points={polygon(6, 50, 50, 40, -90)} {...common} />;
      break;
    case 'octagon':
      body = <polygon points={polygon(8, 50, 50, 40, -112.5)} {...common} />;
      break;
    case 'diamond':
      body = <polygon points="50,10 88,50 50,90 12,50" {...common} />;
      break;
    case 'star':
      body = <polygon points={starPoints(50, 52, 42, 17)} {...common} />;
      break;
    case 'heart':
      body = (
        <path
          d="M50 86 C18 63 10 44 10 33 A21 21 0 0 1 50 24 A21 21 0 0 1 90 33 C90 44 82 63 50 86 Z"
          {...common}
        />
      );
      break;
    case 'crescent':
      body = (
        <path
          d="M66 12 A40 40 0 1 0 66 88 A32 32 0 1 1 66 12 Z"
          {...common}
        />
      );
      break;
    case 'arrow':
      body = <polygon points="10,38 56,38 56,18 92,50 56,82 56,62 10,62" {...common} />;
      break;
    case 'cross':
      body = (
        <polygon
          points="38,10 62,10 62,38 90,38 90,62 62,62 62,90 38,90 38,62 10,62 10,38 38,38"
          {...common}
        />
      );
      break;
    case 'spiral':
      body = (
        <path
          d={spiralPath(50, 50, 4, 38, 3.2, 160)}
          fill="none"
          stroke={f}
          strokeWidth="9"
          strokeLinecap="round"
        />
      );
      break;

    /* --- the 3-D ones: drawn as simple solids so they read as 3-D --- */
    case 'cube':
      body = (
        <g strokeLinejoin="round" strokeWidth="4" stroke={d}>
          <polygon points="22,38 50,22 78,38 50,54" fill="#b884ff" />
          <polygon points="22,38 50,54 50,86 22,70" fill={f} />
          <polygon points="78,38 50,54 50,86 78,70" fill={d} />
        </g>
      );
      break;
    case 'sphere':
      body = (
        <g>
          <circle cx="50" cy="50" r="38" fill={f} stroke={d} strokeWidth="4" />
          <ellipse cx="38" cy="34" rx="13" ry="9" fill="rgba(255,255,255,.5)" />
          <path d="M14 56 A38 38 0 0 0 86 56" fill="none" stroke={d} strokeWidth="3" opacity=".45" />
        </g>
      );
      break;
    case 'cylinder':
      body = (
        <g stroke={d} strokeWidth="4" strokeLinejoin="round">
          <path d="M20 26 h60 v48 a30 12 0 0 1 -60 0 Z" fill={f} />
          <ellipse cx="50" cy="26" rx="30" ry="12" fill="#b884ff" />
        </g>
      );
      break;
    case 'cone':
      body = (
        <g stroke={d} strokeWidth="4" strokeLinejoin="round">
          <path d="M50 12 L80 72 a30 12 0 0 1 -60 0 Z" fill={f} />
          <path d="M20 72 a30 12 0 0 0 60 0" fill="#b884ff" />
        </g>
      );
      break;
    case 'pyramid':
      body = (
        <g stroke={d} strokeWidth="4" strokeLinejoin="round">
          <polygon points="50,14 86,76 50,62" fill={d} />
          <polygon points="50,14 14,76 50,62" fill={f} />
          <polygon points="14,76 50,62 86,76 50,88" fill="#b884ff" />
        </g>
      );
      break;
    default:
      return null;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="presentation" style={{ display: 'block' }}>
      {body}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export default function LearnIcon({ item, size = 64, className = '' }: Props) {
  const category = (item.category || '').toLowerCase();
  const id = (item.id || '').toLowerCase().trim();

  const wrap = (child: React.ReactNode) => (
    <span
      className={className}
      title={item.name || ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        lineHeight: 1,
      }}
    >
      {child}
    </span>
  );

  // 1. colours — draw the hex the table already carries
  if (category === 'colors' && item.color) {
    return wrap(<ColorSwatch hex={item.color} size={size} />);
  }

  // 2. numbers — draw the digits
  if (category === 'numbers') {
    const n = numberFrom(item);
    if (n) return wrap(<GlyphText text={n} size={size} />);
  }

  // 3. shapes — draw the shape
  if (category === 'shapes') {
    const glyph = <ShapeGlyph id={id} size={size} />;
    // ShapeGlyph returns null for an id it doesn't know, so fall through to
    // the emoji rather than rendering an empty box
    if (id && ShapeIds.has(id)) return wrap(glyph);
  }

  // 4. everything else — the emoji, with an emoji font actually named
  return wrap(
    <span
      aria-hidden="true"
      style={{
        fontSize: size * 0.78,
        lineHeight: 1,
        fontFamily: EMOJI_FONT,
      }}
    >
      {(item.emoji || '').trim()}
    </span>
  );
}

const ShapeIds = new Set([
  'circle', 'square', 'rectangle', 'oval', 'triangle', 'pentagon', 'hexagon',
  'octagon', 'diamond', 'star', 'heart', 'crescent', 'arrow', 'cross', 'spiral',
  'cube', 'sphere', 'cylinder', 'cone', 'pyramid',
]);
