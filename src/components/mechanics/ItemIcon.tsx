import React from 'react';

/**
 * ItemIcon — the fix for your green-tick bug.
 *
 * Right now every item is a raw emoji, and on a lot of Android builds the
 * glyph simply isn't in the system font, so the tile renders blank (that's
 * why half your Cake Baking tiles show a bare ✓).
 *
 * This component gives you ONE place to switch from emoji to your own art.
 * Today it falls back to emoji so nothing breaks. Tomorrow you drop PNGs in
 * `src/assets/items/` and fill in ART — every screen upgrades at once.
 *
 *   import flour from '../../assets/items/flour.png';
 *   const ART = { '🌾': flour, ... };
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ART: Record<string, string> = {
  // '🌾': require('../../assets/items/flour.png'),
  // '🥚': require('../../assets/items/egg.png'),
};

interface Props {
  icon: string;
  /** rendered pixel size */
  size?: number;
  className?: string;
  /** spoken/alt label — always pass it, screen readers and your future self */
  label?: string;
}

const ItemIcon: React.FC<Props> = ({ icon, size = 44, className = '', label }) => {
  const src = ART[icon];

  if (src) {
    return (
      <img
        src={src}
        alt={label || ''}
        width={size}
        height={size}
        draggable={false}
        className={`select-none pointer-events-none ${className}`}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={label || undefined}
      className={`select-none leading-none ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        // Force a font that actually HAS the emoji, instead of inheriting
        // Bubblegum One (which has none) and rendering a blank box.
        fontFamily:
          '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Android Emoji",EmojiOne,sans-serif',
      }}
    >
      {icon}
    </span>
  );
};

export default ItemIcon;
