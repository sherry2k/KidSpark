import React from 'react';
import { motion } from 'framer-motion';

/**
 * TenFrame — how schools actually teach number sense.
 *
 * A ten-frame is two rows of five. Because the top row fills first, a child
 * stops counting one-by-one surprisingly quickly and starts *seeing* seven as
 * "five and two more". That jump is the whole point of early number work, and
 * it's the thing a row of loose emoji can never teach.
 *
 * Drawn with plain circles rather than emoji, deliberately: uniform tokens are
 * what make the pattern readable, and there's no font that can fail to render
 * a circle.
 */

interface Props {
  count: number;
  color: string;
  /** total cells — 10 is standard; 5 works well for the youngest */
  size?: 5 | 10;
  cell?: number;
  /** highlight the nth dot (0-based) while counting aloud */
  highlight?: number | null;
  /** dots appear one after another instead of all at once */
  stagger?: boolean;
}

const TenFrame: React.FC<Props> = ({ count, color, size = 10, cell = 30, highlight = null, stagger = true }) => {
  const cols = 5;
  const rows = size / cols;
  const filled = Math.min(count, size);

  return (
    <div
      className="inline-grid rounded-xl overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        border: '3px solid rgba(0,0,0,.18)',
        background: '#fff',
      }}
    >
      {Array.from({ length: size }, (_, i) => {
        const on = i < filled;
        const lit = highlight === i;
        return (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.10)' }}
          >
            {on && (
              <motion.span
                className="rounded-full block"
                style={{
                  width: cell * 0.62,
                  height: cell * 0.62,
                  background: color,
                  boxShadow: lit ? `0 0 0 4px rgba(250,204,21,.85)` : 'inset 0 -2px 0 rgba(0,0,0,.15)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: lit ? 1.18 : 1 }}
                transition={{ delay: stagger ? i * 0.05 : 0, type: 'spring', stiffness: 480, damping: 18 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TenFrame;
