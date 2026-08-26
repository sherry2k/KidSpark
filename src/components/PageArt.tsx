import React, { useId } from 'react';
import { ColoringPage } from '../data/coloringPages';
import { Stroke } from '../utils/keepsakes';

/**
 * PageArt — draws one colouring page at any size.
 *
 * The same component renders the thumbnail on the picker, the big editable
 * canvas, and the saved picture on the My Stuff shelf, so a finished drawing
 * looks identical everywhere and stays crisp on every screen.
 *
 * Brush strokes are clipped to the outline of the picture, which means even a
 * wild scribble stays inside the lines. That one detail is why a four-year-old
 * can finish a page and be pleased with it.
 */

interface Props {
  page: ColoringPage;
  fills: Record<string, string>;
  strokes?: Stroke[];
  size: number;
  /** tap a region to fill it */
  onRegionTap?: (id: string) => void;
  /** pointer handlers for brush mode, applied to a full-page overlay */
  brushHandlers?: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
  /** show only part of the picture — used to slice a jigsaw without any assets */
  crop?: { x: number; y: number; w: number; h: number };
}

const PageArt: React.FC<Props> = ({
  page,
  fills,
  strokes = [],
  size,
  onRegionTap,
  brushHandlers,
  svgRef,
  className = '',
  crop,
}) => {
  const uid = useId().replace(/:/g, '');
  const clipId = `clip-${page.id}-${uid}`;

  return (
    <svg
      ref={svgRef}
      viewBox={crop ? `${crop.x} ${crop.y} ${crop.w} ${crop.h}` : '0 0 100 100'}
      width={size}
      height={size}
      className={className}
      style={{ touchAction: 'none', display: 'block' }}
    >
      {/* the picture's own silhouette, used to keep scribbles inside */}
      <defs>
        <clipPath id={clipId}>
          {page.regions.map((r) => (
            <path key={r.id} d={r.d} transform={r.t} />
          ))}
        </clipPath>
      </defs>

      {/* fillable regions */}
      {page.regions.map((r) => (
        <path
          key={r.id}
          d={r.d}
          transform={r.t}
          fill={fills[r.id] || '#FFFFFF'}
          stroke="#1B1B1F"
          strokeWidth={1.6}
          strokeLinejoin="round"
          onClick={onRegionTap ? () => onRegionTap(r.id) : undefined}
          style={{ cursor: onRegionTap ? 'pointer' : 'default' }}
        />
      ))}

      {/* brush strokes, trapped inside the outline */}
      <g clipPath={`url(#${clipId})`} pointerEvents="none">
        {strokes.map((s, i) => (
          <polyline
            key={i}
            points={s.pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* detail lines on top — whiskers, antennae, a smile */}
      {page.lines?.map((d, i) => (
        <path
          key={`l${i}`}
          d={d}
          fill="none"
          stroke="#1B1B1F"
          strokeWidth={1.6}
          strokeLinecap="round"
          pointerEvents="none"
        />
      ))}

      {/* invisible capture layer for brush mode */}
      {brushHandlers && (
        <rect
          x={0}
          y={0}
          width={100}
          height={100}
          fill="transparent"
          onPointerDown={brushHandlers.onPointerDown}
          onPointerMove={brushHandlers.onPointerMove}
          onPointerUp={brushHandlers.onPointerUp}
          onPointerCancel={brushHandlers.onPointerUp}
          style={{ cursor: 'crosshair' }}
        />
      )}
    </svg>
  );
};

export default PageArt;
