import React from 'react';
import ItemIcon from './mechanics/ItemIcon';
import { Keepsake, Sticker, Stroke, Layer } from '../utils/keepsakes';
import PageArt from './PageArt';
import { getPage } from '../data/coloringPages';

/**
 * KeepsakeView — renders anything the child has made, at any size.
 *
 * Stored as data rather than a screenshot, so the shelf, the result screen
 * and the full-screen "show a grown-up" view all draw the same record
 * crisply. Three shapes so far: decorated (cake, pizza), drawing (strokes),
 * dress-up (layered outfit).
 */

export interface KeepsakeShape {
  kind?: Keepsake['kind'];
  base: string;
  color: string;
  stickers?: Sticker[];
  strokes?: Stroke[];
  layers?: Layer[];
  pageId?: string;
  fills?: Record<string, string>;
  dataUrl?: string;
}

const Strokes: React.FC<{ strokes: Stroke[]; size: number }> = ({ strokes, size }) => (
  <svg width={size} height={size} className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
    {strokes.map((s, i) => (
      <polyline
        key={i}
        points={s.pts.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={s.color}
        strokeWidth={s.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    ))}
  </svg>
);

const KeepsakeView: React.FC<{ item: KeepsakeShape; size?: number }> = ({ item, size = 220 }) => {
  const kind = item.kind || 'decorated';

  /* ---- a free-canvas picture ---- */
  if (kind === 'image' && item.dataUrl) {
    return (
      <div
        className="rounded-3xl overflow-hidden flex items-center justify-center"
        style={{ width: size, height: size, background: '#FFFFFF' }}
      >
        <img
          src={item.dataUrl}
          alt="your picture"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  /* ---- a coloured-in page ---- */
  if (kind === 'coloring') {
    const page = item.pageId ? getPage(item.pageId) : undefined;
    if (page) {
      return (
        <div
          className="rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ width: size, height: size, background: '#FFFFFF' }}
        >
          <PageArt page={page} fills={item.fills || {}} strokes={item.strokes} size={size * 0.92} />
        </div>
      );
    }
  }

  /* ---- a drawing ---- */
  if (kind === 'drawing') {
    return (
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ width: size, height: size, background: item.color || '#FFFFFF' }}
      >
        {item.base && item.base !== 'blank' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <ItemIcon icon={item.base} size={size * 0.7} />
          </div>
        )}
        <Strokes strokes={item.strokes || []} size={size} />
        {(item.stickers || []).map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%,-50%) rotate(${s.rot}deg) scale(${s.scale})`,
            }}
          >
            <ItemIcon icon={s.icon} size={size * 0.15} />
          </div>
        ))}
      </div>
    );
  }

  /* ---- a dress-up look ---- */
  if (kind === 'dress') {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: item.color || '#FFE7F0' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ItemIcon icon={item.base} size={size * 0.5} label="character" />
        </div>
        {(item.layers || []).map((l, i) => (
          <div
            key={`${l.slot}-${i}`}
            className="absolute left-1/2"
            style={{ top: `${l.y}%`, transform: 'translate(-50%,-50%)' }}
          >
            <ItemIcon icon={l.icon} size={size * l.size} label={l.slot} />
          </div>
        ))}
      </div>
    );
  }

  /* ---- decorated food / objects (v1 shape) ---- */
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute left-1/2 top-1/2 rounded-[45%]"
        style={{
          width: size * 0.78,
          height: size * 0.6,
          background: item.color,
          transform: 'translate(-50%,-42%)',
          filter: 'blur(1px)',
          opacity: 0.92,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <ItemIcon icon={item.base} size={size * 0.62} label="your creation" />
      </div>
      {(item.stickers || []).map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%,-50%) rotate(${s.rot}deg) scale(${s.scale})`,
          }}
        >
          <ItemIcon icon={s.icon} size={size * 0.16} />
        </div>
      ))}
    </div>
  );
};

export default KeepsakeView;
