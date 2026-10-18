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
// ===== 1.3 NEW PAGES: paste this whole block into coloringPages.ts, ABOVE "export const COLORING_PAGES" =====
// (helpers have unique names so they never clash with the ones already in the file)
const nn = (v: number) => Math.round(v * 100) / 100;
const cc = (cx: number, cy: number, r: number) =>
  `M ${nn(cx - r)} ${nn(cy)} a ${nn(r)} ${nn(r)} 0 1 0 ${nn(2 * r)} 0 a ${nn(r)} ${nn(r)} 0 1 0 ${nn(-2 * r)} 0 Z`;
const ee = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${nn(cx - rx)} ${nn(cy)} a ${nn(rx)} ${nn(ry)} 0 1 0 ${nn(2 * rx)} 0 a ${nn(rx)} ${nn(ry)} 0 1 0 ${nn(-2 * rx)} 0 Z`;
const pp = (pts: [number, number][]) =>
  `M ${pts.map(([x, y]) => `${nn(x)} ${nn(y)}`).join(' L ')} Z`;

export const NEW_PAGE_IDS = new Set([
  'car', 'apple', 'snowman', 'elephant', 'turtle', 'owl', 'icecream', 'dino', 'boat',
]);

const NEW_PAGES: ColoringPage[] = [
  /* ---------------- car (side view) ---------------- */
  {
    id: 'car',
    name: 'Car',
    symmetric: false,
    regions: [
      { id: 'cabin', d: pp([[26, 54], [34, 32], [66, 32], [76, 54]]), name: 'the roof' },
      { id: 'body', d: 'M 8 74 L 8 60 Q 8 54 14 54 L 86 54 Q 92 54 92 60 L 92 74 Z', name: 'the car' },
      { id: 'window1', d: pp([[31, 52], [37, 37], [48, 37], [48, 52]]), name: 'a window' },
      { id: 'window2', d: pp([[52, 52], [52, 37], [63, 37], [70, 52]]), name: 'a window' },
      { id: 'light', d: cc(87, 62, 3.5), name: 'the light' },
      { id: 'wheel1', d: cc(28, 76, 11), name: 'a wheel' },
      { id: 'hub1', d: cc(28, 76, 4.5), name: 'a wheel centre' },
      { id: 'wheel2', d: cc(72, 76, 11), name: 'a wheel' },
      { id: 'hub2', d: cc(72, 76, 4.5), name: 'a wheel centre' },
    ],
    lines: ['M 50 56 L 50 70'],
  },

  /* ---------------- apple ---------------- */
  {
    id: 'apple',
    name: 'Apple',
    symmetric: false,
    regions: [
      { id: 'stem', d: pp([[47, 30], [53, 30], [55, 10], [50, 10]]), name: 'the stem' },
      { id: 'leaf', d: ee(64, 16, 11, 5.5), t: 'rotate(-25 64 16)', name: 'the leaf' },
      {
        id: 'apple',
        d: 'M 50 28 C 40 18 14 22 14 52 C 14 78 34 92 50 86 C 66 92 86 78 86 52 C 86 22 60 18 50 28 Z',
        name: 'the apple',
      },
      { id: 'shine', d: ee(30, 46, 4.5, 10), t: 'rotate(15 30 46)', name: 'the shine' },
    ],
  },

  /* ---------------- snowman ---------------- */
  {
    id: 'snowman',
    name: 'Snowman',
    symmetric: false,
    regions: [
      { id: 'bottom', d: cc(50, 78, 19), name: 'the bottom' },
      { id: 'middle', d: cc(50, 53, 16), name: 'the tummy' },
      { id: 'head', d: cc(50, 28, 13), name: 'the head' },
      { id: 'hatTop', d: pp([[40, 16], [60, 16], [58, 3], [42, 3]]), name: 'the hat' },
      { id: 'hatBrim', d: pp([[34, 16], [66, 16], [66, 20], [34, 20]]), name: 'the hat brim' },
      { id: 'scarf', d: pp([[35, 38], [65, 38], [66, 44], [34, 44]]), name: 'the scarf' },
      { id: 'scarfTail', d: pp([[57, 44], [65, 44], [68, 60], [60, 60]]), name: 'the scarf' },
      { id: 'nose', d: pp([[50, 28], [65, 30], [50, 32]]), name: 'the carrot nose' },
    ],
    lines: [
      cc(44, 25, 1.7), cc(56, 25, 1.7),
      'M 43 34 Q 50 38 57 34',
      cc(50, 52, 2), cc(50, 61, 2),
      'M 35 54 L 16 44', 'M 16 44 L 11 38', 'M 16 44 L 10 46',
      'M 65 54 L 84 44', 'M 84 44 L 89 38', 'M 84 44 L 90 46',
    ],
  },

  /* ---------------- elephant (front view, symmetric) ---------------- */
  {
    id: 'elephant',
    name: 'Elephant',
    symmetric: true,
    regions: [
      { id: 'earL', d: ee(19, 42, 14, 20), mirror: 'earR', name: 'an ear' },
      { id: 'earR', d: ee(81, 42, 14, 20), mirror: 'earL', name: 'an ear' },
      { id: 'head', d: cc(50, 44, 24), name: 'the head' },
      { id: 'trunk', d: 'M 42 56 L 58 56 L 58 84 Q 58 94 50 94 Q 42 94 42 84 Z', name: 'the trunk' },
      { id: 'tuskL', d: 'M 33 62 Q 28 76 35 82 Q 38 72 40 64 Z', mirror: 'tuskR', name: 'a tusk' },
      { id: 'tuskR', d: 'M 67 62 Q 72 76 65 82 Q 62 72 60 64 Z', mirror: 'tuskL', name: 'a tusk' },
      { id: 'eyeL', d: cc(39, 40, 3.5), mirror: 'eyeR', name: 'an eye' },
      { id: 'eyeR', d: cc(61, 40, 3.5), mirror: 'eyeL', name: 'an eye' },
    ],
    lines: ['M 45 66 L 55 66', 'M 45 74 L 55 74', 'M 43 28 Q 50 32 57 28'],
  },

  /* ---------------- turtle (side view) ---------------- */
  {
    id: 'turtle',
    name: 'Turtle',
    symmetric: false,
    regions: [
      { id: 'tail', d: pp([[16, 62], [4, 68], [16, 70]]), name: 'the tail' },
      { id: 'legBack', d: ee(30, 80, 9, 8), name: 'a leg' },
      { id: 'legFront', d: ee(70, 80, 9, 8), name: 'a leg' },
      { id: 'head', d: cc(88, 52, 10), name: 'the head' },
      { id: 'belly', d: 'M 12 66 L 88 66 Q 84 76 74 76 L 26 76 Q 16 76 12 66 Z', name: 'the belly' },
      { id: 'shell', d: 'M 14 66 C 14 34 34 24 52 24 C 70 24 86 36 86 66 Z', name: 'the shell' },
      { id: 'plate1', d: ee(33, 52, 8, 10), name: 'a shell pattern' },
      { id: 'plate2', d: ee(52, 44, 9, 11), name: 'a shell pattern' },
      { id: 'plate3', d: ee(70, 52, 8, 10), name: 'a shell pattern' },
    ],
    lines: [cc(91, 49, 1.6), 'M 90 57 Q 94 59 97 56'],
  },

  /* ---------------- owl (front view, symmetric) ---------------- */
  {
    id: 'owl',
    name: 'Owl',
    symmetric: true,
    regions: [
      { id: 'tuftL', d: pp([[26, 36], [27, 12], [43, 28]]), mirror: 'tuftR', name: 'an ear' },
      { id: 'tuftR', d: pp([[74, 36], [73, 12], [57, 28]]), mirror: 'tuftL', name: 'an ear' },
      { id: 'wingL', d: ee(21, 66, 9, 21), mirror: 'wingR', name: 'a wing' },
      { id: 'wingR', d: ee(79, 66, 9, 21), mirror: 'wingL', name: 'a wing' },
      { id: 'footL', d: ee(40, 94, 8, 4), mirror: 'footR', name: 'a foot' },
      { id: 'footR', d: ee(60, 94, 8, 4), mirror: 'footL', name: 'a foot' },
      { id: 'body', d: ee(50, 58, 30, 34), name: 'the owl' },
      { id: 'belly', d: ee(50, 72, 16, 17), name: 'the tummy' },
      { id: 'discL', d: cc(38, 44, 13), mirror: 'discR', name: 'an eye' },
      { id: 'discR', d: cc(62, 44, 13), mirror: 'discL', name: 'an eye' },
      { id: 'pupilL', d: cc(38, 44, 5.5), mirror: 'pupilR', name: 'an eye' },
      { id: 'pupilR', d: cc(62, 44, 5.5), mirror: 'pupilL', name: 'an eye' },
      { id: 'beak', d: pp([[45, 53], [55, 53], [50, 64]]), name: 'the beak' },
    ],
    lines: ['M 42 70 Q 46 74 50 70 Q 54 74 58 70', 'M 42 78 Q 46 82 50 78 Q 54 82 58 78'],
  },

  /* ---------------- ice cream ---------------- */
  {
    id: 'icecream',
    name: 'Ice Cream',
    symmetric: false,
    regions: [
      { id: 'cone', d: pp([[33, 52], [67, 52], [50, 96]]), name: 'the cone' },
      {
        id: 'scoop1',
        d: 'M 26 50 Q 26 36 50 36 Q 74 36 74 50 Q 74 57 67 55 Q 61 61 55 55 Q 50 61 45 55 Q 39 61 33 55 Q 26 57 26 50 Z',
        name: 'the bottom scoop',
      },
      { id: 'scoop2', d: cc(50, 27, 16), name: 'the top scoop' },
      { id: 'cherry', d: cc(50, 8, 5), name: 'the cherry' },
    ],
    lines: [
      'M 39 58 L 55 82', 'M 61 58 L 45 82', 'M 41 66 L 59 66',
      'M 42 24 L 45 26', 'M 55 21 L 58 23', 'M 49 31 L 52 32',
    ],
  },

  /* ---------------- dinosaur (side view) ---------------- */
  {
    id: 'dino',
    name: 'Dinosaur',
    symmetric: false,
    regions: [
      { id: 'tail', d: 'M 26 54 C 14 58 8 66 3 78 C 14 74 22 72 30 72 Z', name: 'the tail' },
      { id: 'plate1', d: pp([[24, 52], [30, 38], [36, 49]]), name: 'a back plate' },
      { id: 'plate2', d: pp([[36, 47], [42, 32], [48, 45]]), name: 'a back plate' },
      { id: 'plate3', d: pp([[48, 46], [54, 34], [59, 47]]), name: 'a back plate' },
      { id: 'legBack', d: pp([[28, 74], [40, 74], [41, 93], [27, 93]]), name: 'a leg' },
      { id: 'legFront', d: pp([[54, 74], [66, 74], [67, 93], [53, 93]]), name: 'a leg' },
      { id: 'body', d: ee(46, 62, 27, 18), name: 'the body' },
      { id: 'neck', d: pp([[60, 52], [66, 24], [78, 24], [77, 56]]), name: 'the neck' },
      { id: 'head', d: ee(84, 21, 12, 9), name: 'the head' },
      { id: 'spot1', d: cc(38, 62, 4.5), name: 'a spot' },
      { id: 'spot2', d: cc(52, 68, 4), name: 'a spot' },
      { id: 'spot3', d: cc(44, 54, 3.2), name: 'a spot' },
    ],
    lines: [cc(88, 19, 1.7), 'M 85 26 Q 90 28 94 24'],
  },

  /* ---------------- sailboat ---------------- */
  {
    id: 'boat',
    name: 'Sailboat',
    symmetric: false,
    regions: [
      { id: 'hull', d: pp([[12, 66], [88, 66], [76, 86], [24, 86]]), name: 'the boat' },
      { id: 'mast', d: pp([[48, 14], [52, 14], [52, 66], [48, 66]]), name: 'the mast' },
      { id: 'sailBig', d: pp([[55, 18], [55, 62], [84, 62]]), name: 'the big sail' },
      { id: 'sailSmall', d: pp([[45, 28], [45, 62], [20, 62]]), name: 'the little sail' },
      { id: 'flag', d: pp([[52, 14], [52, 4], [65, 9]]), name: 'the flag' },
      {
        id: 'sea',
        d: 'M 3 82 Q 11 75 19 82 T 35 82 T 51 82 T 67 82 T 83 82 T 97 82 L 97 97 L 3 97 Z',
        name: 'the sea',
      },
    ],
  },
];



const BASE_PAGES: ColoringPage[] = [
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

export const COLORING_PAGES: ColoringPage[] = [...NEW_PAGES, ...BASE_PAGES];

export const getPage = (id: string): ColoringPage | undefined =>

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
  { color: '#C9CFDA', name: 'light grey' },
  { color: '#8A90A0', name: 'grey' },
  { color: '#1B1B1F', name: 'black' },
];
