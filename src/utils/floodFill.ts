/**
 * floodFill.ts — a paint bucket that fills the area you tapped.
 *
 * The old `fillArea(x, y)` ignored x and y entirely and painted the whole
 * canvas, so one tap destroyed the child's picture. This is the real thing:
 * a scanline flood fill bounded by whatever is already drawn.
 *
 * Tolerance matters here. Brush strokes are anti-aliased, so their edges are
 * a soft gradient rather than a hard line. Too low a tolerance leaves an ugly
 * halo of unfilled pixels; too high and colour leaks through the stroke. 48
 * is a good middle for chunky kid-sized brushes.
 */

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  hex: string,
  tolerance = 48
): boolean {
  const { width, height } = ctx.canvas;
  const x0 = Math.floor(startX);
  const y0 = Math.floor(startY);
  if (x0 < 0 || y0 < 0 || x0 >= width || y0 >= height) return false;

  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;
  const at = (x: number, y: number) => (y * width + x) * 4;

  const start = at(x0, y0);
  const sr = data[start];
  const sg = data[start + 1];
  const sb = data[start + 2];

  const [fr, fg, fb] = hexToRgb(hex);

  // already that colour — nothing to do, and it saves a pointless history step
  if (Math.abs(sr - fr) < 4 && Math.abs(sg - fg) < 4 && Math.abs(sb - fb) < 4) return false;

  const tol2 = tolerance * tolerance * 3;
  const matches = (i: number) => {
    const dr = data[i] - sr;
    const dg = data[i + 1] - sg;
    const db = data[i + 2] - sb;
    return dr * dr + dg * dg + db * db <= tol2;
  };

  const seen = new Uint8Array(width * height);
  const stack: number[] = [x0, y0];

  while (stack.length) {
    const y = stack.pop()!;
    const x = stack.pop()!;

    let left = x;
    while (left > 0 && matches(at(left - 1, y))) left--;
    let right = x;
    while (right < width - 1 && matches(at(right + 1, y))) right++;

    for (let sx = left; sx <= right; sx++) {
      const idx = at(sx, y);
      const flat = y * width + sx;
      if (seen[flat]) continue;
      seen[flat] = 1;
      data[idx] = fr;
      data[idx + 1] = fg;
      data[idx + 2] = fb;
      data[idx + 3] = 255;

      if (y > 0 && !seen[(y - 1) * width + sx] && matches(at(sx, y - 1))) stack.push(sx, y - 1);
      if (y < height - 1 && !seen[(y + 1) * width + sx] && matches(at(sx, y + 1))) stack.push(sx, y + 1);
    }
  }

  ctx.putImageData(img, 0, 0);
  return true;
}
