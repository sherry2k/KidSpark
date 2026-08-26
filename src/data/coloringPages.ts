/**
 * coloringPages.ts
 *
 * Real colouring pages, as SVG regions.
 *
 * The old pages were made by drawing an EMOJI to a canvas and edge-detecting
 * it. Two problems with that: it depends on the device having that emoji glyph
 * (the same reason your item tiles rendered as blank ticks on some Androids),
 * and a silhouette has no interior — so there is nothing to fill.
 *
 * Every page here is a list of closed regions in a 0-100 viewBox. Each region
 * is tappable and fillable, they stay crisp at any screen size, and a finished
 * picture saves as a tiny map of region → colour.
 *
 * Paths are generated from geometry helpers rather than hand-typed, so they
 * cannot be subtly malformed.
 */

/* ---------------- geometry helpers ---------------- */

const n = (v: number) => Math.round(v * 100) / 100;

const circle = (cx: number, cy: number, r: number) =>
  `M ${n(cx - r)} ${n(cy)} a ${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0 a ${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0 Z`;

const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${n(cx - rx)} ${n(cy)} a ${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a ${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;

const poly = (pts: [number, number][]) =>
  `M ${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L ')} Z`;

/** one band of a rainbow, centred on (50, 80) */
const arcBand = (outer: number, inner: number) =>
  `M ${n(50 - outer)} 80 A ${n(outer)} ${n(outer)} 0 0 1 ${n(50 + outer)} 80 ` +
  `L ${n(50 + inner)} 80 A ${n(inner)} ${n(inner)} 0 0 0 ${n(50 - inner)} 80 Z`;

/** a whole star as one closed shape — alternating outer and inner points */
const starPath = (cx: number, cy: number, rOuter: number, rInner: number, points = 5) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (-90 + (i * 180) / points) * (Math.PI / 180);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return poly(pts);
};

/* ---------------- types ---------------- */

export interface Region {
  id: string;
  /** SVG path data in a 0-100 viewBox */
  d: string;
  /** optional SVG transform, e.g. a rotation for petals */
  t?: string;
  /** the region this one mirrors — used by symmetry mode */
  mirror?: string;
  /** spoken when tapped, and useful for a colour-by-name mode later */
  name: string;
}

export interface ColoringPage {
  id: string;
  name: string;
  /** true if the picture is left-right symmetrical — enables the mirror toggle */
  symmetric: boolean;
  regions: Region[];
  /** extra detail lines drawn on top, stroked only (whiskers, antennae) */
  lines?: string[];
}

/* ---------------- the pages ---------------- */



export const COLORING_PAGES: ColoringPage[] = [
  {
    id: 'star',
    name: 'Star',
    symmetric: false,
    regions: [
      { id: 'star', d: starPath(50, 50, 47, 20), name: 'the star' },
      { id: 'inner', d: starPath(50, 50, 26, 11), name: 'the little star' },
    ],
  },

  {
    id: 'heart',
    name: 'Heart',
    symmetric: true,
    regions: [
      {
        id: 'left',
        d: 'M 50 88 C 20 66 8 50 8 36 C 8 22 19 14 30 14 C 39 14 46 19 50 26 Z',
        mirror: 'right',
        name: 'the left side',
      },
      {
        id: 'right',
        d: 'M 50 88 C 80 66 92 50 92 36 C 92 22 81 14 70 14 C 61 14 54 19 50 26 Z',
        mirror: 'left',
        name: 'the right side',
      },
      { id: 'shine', d: circle(32, 32, 6), name: 'the shine' },
    ],
  },

  {
    id: 'flower',
    name: 'Flower',
    symmetric: true,
    regions: [
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `petal${i}`,
        d: ellipse(50, 26, 11, 20),
        t: `rotate(${i * 60} 50 50)`,
        mirror: i === 0 || i === 3 ? undefined : `petal${(6 - i) % 6}`,
        name: 'a petal',
      })),
      { id: 'centre', d: circle(50, 50, 13), name: 'the middle' },
    ],
  },

  {
    id: 'sun',
    name: 'Sun',
    symmetric: false,
    regions: [
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `ray${i}`,
        d: poly([
          [50, 4],
          [43, 22],
          [57, 22],
        ]),
        t: `rotate(${i * 45} 50 50)`,
        name: 'a sunbeam',
      })),
      { id: 'face', d: circle(50, 50, 24), name: 'the sun' },
    ],
    lines: [circle(43, 45, 2.5), circle(57, 45, 2.5), 'M 42 58 Q 50 66 58 58'],
  },

  {
    id: 'tree',
    name: 'Tree',
    symmetric: false,
    regions: [
      {
        id: 'trunk',
        d: poly([
          [44, 58],
          [56, 58],
          [58, 90],
          [42, 90],
        ]),
        name: 'the trunk',
      },
      { id: 'leaves1', d: circle(34, 50, 17), name: 'the leaves' },
      { id: 'leaves2', d: circle(66, 50, 17), name: 'the leaves' },
      { id: 'leaves3', d: circle(50, 30, 21), name: 'the top' },
    ],
  },

  {
    id: 'house',
    name: 'House',
    symmetric: false,
    regions: [
      {
        id: 'chimney',
        d: poly([
          [66, 16],
          [75, 16],
          [75, 40],
          [66, 40],
        ]),
        name: 'the chimney',
      },
      {
        id: 'wall',
        d: poly([
          [20, 46],
          [80, 46],
          [80, 88],
          [20, 88],
        ]),
        name: 'the wall',
      },
      {
        id: 'roof',
        d: poly([
          [12, 48],
          [50, 16],
          [88, 48],
        ]),
        name: 'the roof',
      },
      {
        id: 'door',
        d: poly([
          [43, 62],
          [57, 62],
          [57, 88],
          [43, 88],
        ]),
        name: 'the door',
      },
      { id: 'winL', d: circle(31, 58, 7), mirror: 'winR', name: 'a window' },
      { id: 'winR', d: circle(69, 58, 7), mirror: 'winL', name: 'a window' },
    ],
  },

  {
    id: 'butterfly',
    name: 'Butterfly',
    symmetric: true,
    regions: [
      { id: 'wingTL', d: ellipse(30, 33, 20, 21), mirror: 'wingTR', name: 'the top wing' },
      { id: 'wingTR', d: ellipse(70, 33, 20, 21), mirror: 'wingTL', name: 'the top wing' },
      { id: 'wingBL', d: ellipse(33, 68, 16, 18), mirror: 'wingBR', name: 'the bottom wing' },
      { id: 'wingBR', d: ellipse(67, 68, 16, 18), mirror: 'wingBL', name: 'the bottom wing' },
      { id: 'body', d: ellipse(50, 50, 5, 30), name: 'the body' },
    ],
    lines: ['M 47 22 Q 40 8 32 6', 'M 53 22 Q 60 8 68 6'],
  },

  {
    id: 'fish',
    name: 'Fish',
    symmetric: false,
    regions: [
      {
        id: 'tail',
        d: poly([
          [74, 50],
          [95, 32],
          [95, 68],
        ]),
        name: 'the tail',
      },
      {
        id: 'finTop',
        d: poly([
          [38, 32],
          [58, 28],
          [50, 44],
        ]),
        name: 'the fin',
      },
      { id: 'body', d: ellipse(46, 50, 30, 21), name: 'the body' },
      { id: 'eye', d: circle(30, 44, 5), name: 'the eye' },
    ],
    lines: ['M 60 40 Q 66 50 60 60', 'M 50 38 Q 56 50 50 62'],
  },

  {
    id: 'cat',
    name: 'Cat',
    symmetric: true,
    regions: [
      { id: 'body', d: ellipse(50, 84, 24, 15), name: 'the body' },
      {
        id: 'earL',
        d: poly([
          [26, 36],
          [32, 10],
          [48, 26],
        ]),
        mirror: 'earR',
        name: 'an ear',
      },
      {
        id: 'earR',
        d: poly([
          [74, 36],
          [68, 10],
          [52, 26],
        ]),
        mirror: 'earL',
        name: 'an ear',
      },
      { id: 'head', d: circle(50, 46, 27), name: 'the face' },
      { id: 'eyeL', d: circle(40, 42, 5), mirror: 'eyeR', name: 'an eye' },
      { id: 'eyeR', d: circle(60, 42, 5), mirror: 'eyeL', name: 'an eye' },
      {
        id: 'nose',
        d: poly([
          [45, 54],
          [55, 54],
          [50, 60],
        ]),
        name: 'the nose',
      },
    ],
    lines: ['M 50 60 Q 44 66 38 63', 'M 50 60 Q 56 66 62 63', 'M 18 50 L 32 52', 'M 82 50 L 68 52'],
  },

  {
    id: 'cupcake',
    name: 'Cupcake',
    symmetric: true,
    regions: [
      {
        id: 'case',
        d: poly([
          [28, 54],
          [72, 54],
          [64, 90],
          [36, 90],
        ]),
        name: 'the case',
      },
      { id: 'icingL', d: circle(37, 46, 15), mirror: 'icingR', name: 'the icing' },
      { id: 'icingR', d: circle(63, 46, 15), mirror: 'icingL', name: 'the icing' },
      { id: 'icingTop', d: circle(50, 34, 16), name: 'the icing' },
      { id: 'cherry', d: circle(50, 16, 8), name: 'the cherry' },
    ],
    lines: ['M 38 60 L 36 88', 'M 50 60 L 50 90', 'M 62 60 L 64 88'],
  },

  {
    id: 'rainbow',
    name: 'Rainbow',
    symmetric: false,
    regions: Array.from({ length: 6 }, (_, i) => ({
      id: `band${i}`,
      d: arcBand(46 - i * 7, 40 - i * 7),
      name: 'a stripe',
    })),
  },

  {
    id: 'rocket',
    name: 'Rocket',
    symmetric: true,
    regions: [
      {
        id: 'flame',
        d: poly([
          [42, 74],
          [58, 74],
          [50, 96],
        ]),
        name: 'the flame',
      },
      {
        id: 'finL',
        d: poly([
          [32, 54],
          [16, 80],
          [32, 80],
        ]),
        mirror: 'finR',
        name: 'a fin',
      },
      {
        id: 'finR',
        d: poly([
          [68, 54],
          [84, 80],
          [68, 80],
        ]),
        mirror: 'finL',
        name: 'a fin',
      },
      { id: 'body', d: 'M 50 6 C 65 22 71 46 71 78 L 29 78 C 29 46 35 22 50 6 Z', name: 'the rocket' },
      { id: 'window', d: circle(50, 38, 11), name: 'the window' },
    ],
  },
];

export const getPage = (id: string): ColoringPage | undefined =>
  COLORING_PAGES.find((p) => p.id === id);

/* ---------------- the palette ---------------- */

export interface Swatch {
  color: string;
  name: string;
}

/**
 * Two rows of nine. The old palette was fourteen fully-saturated colours in
 * one cramped row, ending in white-on-white — a child tapped it, nothing
 * appeared to happen, and it read as broken. This adds pastels and skin
 * tones, and white now has a visible ring.
 */
export const PALETTE: Swatch[] = [
  { color: '#E5383B', name: 'red' },
  { color: '#F77F00', name: 'orange' },
  { color: '#FFD23F', name: 'yellow' },
  { color: '#57CC5B', name: 'green' },
  { color: '#2CB5AF', name: 'teal' },
  { color: '#2C7BE5', name: 'blue' },
  { color: '#7B2CBF', name: 'purple' },
  { color: '#FF6BA9', name: 'pink' },
  { color: '#8B5A3C', name: 'brown' },

  { color: '#FFB4A2', name: 'peach' },
  { color: '#FFE5B4', name: 'cream' },
  { color: '#C5E8B7', name: 'mint' },
  { color: '#BDE0FE', name: 'baby blue' },
  { color: '#D8BFEA', name: 'lilac' },
  { color: '#F6D6C0', name: 'light skin' },
  { color: '#C68B62', name: 'tan skin' },
  { color: '#6B4430', name: 'deep skin' },
  { color: '#FFFFFF', name: 'white' },
];
