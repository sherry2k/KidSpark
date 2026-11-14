import React, { useEffect, useState } from 'react';
import SparkMascot from './SparkMascot';
import { isWinter, SnowCap } from './WinterDecor';

/**
 * "What's new" pop-up. Spark tells children who already play KidSpark what changed.
 *
 *  - Shows ONCE per WHATS_NEW_ID, on the Home screen, a moment after it opens.
 *  - Only for children who already played (someone opening the app for the first
 *    time never sees it; it is marked as seen for them quietly).
 *  - To announce something new later: change WHATS_NEW_ID (for example 'colours-2027')
 *    and edit WHATS_NEW_ITEMS. Everybody sees it once again.
 *  - To test it: open the site with ?whatsnew=1 (it ignores the "already seen" flag).
 *
 * Uses inline styles only, so the phone reset in index.css cannot change the layout.
 */
export const WHATS_NEW_ID = 'winter-2026';

const WHATS_NEW_ITEMS: { icon: string; title: string; text: string; color: string }[] = [
  { icon: '❄️', title: 'Winter is here!', text: 'Snow, icicles and a cosy snowman.', color: 'linear-gradient(135deg,#60A5FA,#22D3EE)' },
  { icon: '🌟', title: 'Spark talks!', text: 'Tap Spark on the Home screen. He cheers for you too!', color: 'linear-gradient(135deg,#FBBF24,#F97316)' },
  { icon: '🎵', title: 'Music games', text: 'Play the colour xylophone and your favourite songs.', color: 'linear-gradient(135deg,#2DD4BF,#06B6D4)' },
  { icon: '🔢', title: 'New Math games', text: 'Number Bonds, Skip Counting and Missing Numbers.', color: 'linear-gradient(135deg,#F87171,#EC4899)' },
];

const STORAGE_KEY = 'kidspark_whatsnew_seen';
const FONT = "'Fredoka', 'Arial Black', sans-serif";

const CSS = `
@keyframes wn-fade { from{opacity:0} to{opacity:1} }
@keyframes wn-pop  { 0%{transform:translateY(24px) scale(.9);opacity:0} 70%{transform:translateY(-4px) scale(1.02);opacity:1} 100%{transform:translateY(0) scale(1);opacity:1} }
@media (prefers-reduced-motion: reduce){ .wn-card,.wn-back{animation:none!important} }
`;

function readSeen(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
function writeSeen() {
  try { localStorage.setItem(STORAGE_KEY, WHATS_NEW_ID); } catch { /* private mode: it will just show again next time */ }
}

interface WhatsNewProps {
  /** true when the child has already played before (stars, games, lessons ...) */
  existingUser: boolean;
  onClose?: () => void;
}

const WhatsNew: React.FC<WhatsNewProps> = ({ existingUser, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let force = false;
    try { force = new URLSearchParams(window.location.search).get('whatsnew') === '1'; } catch { /* ignore */ }

    if (!force && readSeen() === WHATS_NEW_ID) return;
    if (!force && !existingUser) { writeSeen(); return; } // brand-new child: nothing is "new" yet

    const t = setTimeout(() => setOpen(true), 700); // let Home appear first
    return () => clearTimeout(t);
    // run once when Home opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const winter = isWinter();
  const close = () => {
    writeSeen();
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      className="wn-back"
      role="dialog"
      aria-modal="true"
      aria-label="What's new in KidSpark"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, boxSizing: 'border-box',
        background: 'rgba(43,23,92,.55)',
        animation: 'wn-fade .25s ease-out both',
      }}
    >
      <style>{CSS}</style>

      <div
        className="wn-card"
        style={{
          position: 'relative', width: 'min(100%, 380px)', maxHeight: '88vh',
          background: 'linear-gradient(180deg,#FFFFFF 0%,#F3EEFF 100%)',
          borderRadius: 28, border: '5px solid #fff',
          boxShadow: '0 10px 0 rgba(0,0,0,.18), 0 18px 40px rgba(0,0,0,.35)',
          animation: 'wn-pop .45s cubic-bezier(.2,.8,.3,1) both',
          boxSizing: 'border-box',
        }}
      >
        {winter && <SnowCap seed={7} />}

        {/* Spark pops out of the top-right corner of the card */}
        <div style={{ position: 'absolute', top: -62, right: 12, width: 92, zIndex: 3, pointerEvents: 'none' }}>
          <SparkMascot mode="hello" className="w-full" />
        </div>

        <div style={{ maxHeight: 'calc(88vh - 10px)', overflowY: 'auto', borderRadius: 24, padding: '26px 18px 18px', boxSizing: 'border-box' }}>
          <div style={{ paddingRight: 90, marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 26, lineHeight: 1.1, color: '#4A1D7A' }}>
              What&apos;s new! ✨
            </h2>
            <p style={{ margin: 0, marginTop: 6, fontSize: 14, fontWeight: 600, color: '#6B5B95' }}>
              Spark has some surprises for you!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WHATS_NEW_ITEMS.map((it) => (
              <div
                key={it.title}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#fff', borderRadius: 18, padding: 10,
                  boxShadow: '0 2px 0 rgba(106,44,255,.12)', border: '2px solid #EFE7FF',
                }}
              >
                <div
                  style={{
                    flex: '0 0 auto', width: 46, height: 46, borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, background: it.color, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.15)',
                  }}
                >
                  {it.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontFamily: FONT, fontWeight: 800, fontSize: 16, color: '#3B1F72' }}>{it.title}</p>
                  <p style={{ margin: 0, marginTop: 2, fontSize: 13, lineHeight: 1.25, color: '#6B6B80', fontWeight: 600 }}>{it.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={close}
            style={{
              display: 'block', width: '100%', marginTop: 16, padding: '14px 0',
              border: '3px solid #fff', borderRadius: 18, cursor: 'pointer',
              fontFamily: FONT, fontWeight: 900, fontSize: 20, color: '#fff',
              textShadow: '1px 2px 0 rgba(0,0,0,.2)',
              background: 'linear-gradient(90deg,#FBBF24,#F97316)',
              boxShadow: '0 6px 0 #C2410C, 0 10px 18px rgba(0,0,0,.2)',
            }}
          >
            Let&apos;s go! 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
