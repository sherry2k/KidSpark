import React, { useEffect, useState } from 'react';
import { checkVersionChanged, appVersion } from '../pwa/appUpdates';

/**
 * UpdatedToast — a small "new games added!" note after the app updates itself.
 *
 * Two reasons this is worth the twenty lines:
 *
 * 1. A tester who gets a silent reload has no idea anything changed, so they
 *    don't go looking for the new games — and you get no feedback on them.
 * 2. The version chip means a screenshot from a tester tells you which build
 *    they're on. During a closed test that ends a lot of guessing.
 */

const FONT = "'Fredoka', ui-rounded, system-ui, sans-serif";

const UpdatedToast: React.FC<{ showVersionChip?: boolean }> = ({ showVersionChip = true }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (checkVersionChanged()) {
      setShow(true);
      const t = window.setTimeout(() => setShow(false), 5000);
      return () => window.clearTimeout(t);
    }
  }, []);

  return (
    <>
      {show && (
        <div
          role="status"
          className="fixed left-1/2 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm text-center border-4 border-white"
          style={{
            bottom: 24,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg,#22C55E,#0E9F6E)',
            boxShadow: '0 6px 0 #047857, 0 10px 24px rgba(0,0,0,.25)',
            fontFamily: FONT,
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          ✨ New games added! Have a look 🎉
        </div>
      )}

      {showVersionChip && (
        <span
          className="fixed z-40 rounded-full px-2 py-0.5 text-[10px] font-bold pointer-events-none"
          style={{
            right: 6,
            bottom: 6,
            background: 'rgba(0,0,0,.28)',
            color: '#fff',
            fontFamily: FONT,
            letterSpacing: '.04em',
          }}
        >
          v{appVersion()}
        </span>
      )}
    </>
  );
};

export default UpdatedToast;
