import React from 'react';
import ItemIcon from './mechanics/ItemIcon';
import { AnswerFace } from '../data/answerIcons';

/**
 * AnswerArt — draws the picture on an answer button.
 *
 * Colours and shapes are DRAWN, not typed. "Red" as a red circle and "Triangle"
 * as an actual triangle can't fall back to a missing glyph the way an emoji
 * can, and for a four-year-old a drawn shape is a clearer answer than any
 * character could be.
 */

const Shape: React.FC<{ kind: NonNullable<AnswerFace['shape']>; size: number }> = ({ kind, size }) => {
  const s = size;
  const fill = '#5B6079';
  const common = { fill, stroke: '#3B3F5C', strokeWidth: 3, strokeLinejoin: 'round' as const };

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      {kind === 'circle' && <circle cx="50" cy="50" r="40" {...common} />}
      {kind === 'square' && <rect x="12" y="12" width="76" height="76" rx="6" {...common} />}
      {kind === 'rectangle' && <rect x="6" y="26" width="88" height="48" rx="6" {...common} />}
      {kind === 'oval' && <ellipse cx="50" cy="50" rx="44" ry="30" {...common} />}
      {kind === 'triangle' && <polygon points="50,10 92,88 8,88" {...common} />}
      {kind === 'diamond' && <polygon points="50,8 92,50 50,92 8,50" {...common} />}
      {kind === 'star' && (
        <polygon
          points={Array.from({ length: 10 }, (_, i) => {
            const r = i % 2 === 0 ? 44 : 19;
            const a = (-90 + i * 36) * (Math.PI / 180);
            return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
          }).join(' ')}
          {...common}
        />
      )}
      {kind === 'heart' && (
        <path
          d="M50 86 C18 62 8 48 8 34 C8 20 19 12 30 12 C39 12 46 18 50 25 C54 18 61 12 70 12 C81 12 92 20 92 34 C92 48 82 62 50 86 Z"
          {...common}
        />
      )}
    </svg>
  );
};

const AnswerArt: React.FC<{ face: AnswerFace; size?: number }> = ({ face, size = 46 }) => {
  if (face.color) {
    return (
      <span
        className="rounded-full block"
        style={{
          width: size,
          height: size,
          background: face.color,
          border: '3px solid rgba(0,0,0,.22)',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.12)',
        }}
        aria-hidden="true"
      />
    );
  }

  if (face.shape) return <Shape kind={face.shape} size={size} />;

  if (face.text) {
    return (
      <span
        style={{
          fontFamily: "'Fredoka', ui-rounded, system-ui, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.86,
          lineHeight: 1,
          color: '#3B3F5C',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {face.text}
      </span>
    );
  }

  return <ItemIcon icon={face.icon || '❓'} size={size} />;
};

export default AnswerArt;
