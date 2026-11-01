import React, { useEffect, useState } from 'react';
import SparkMascot from './SparkMascot';
import {
  isSparkVoiceEnabled,
  playSparkVoice,
  preloadSparkVoice,
  subscribeSparkSpeaking,
} from '../utils/sparkVoice';

/**
 * Spark on the Home screen. A child taps him and he says hello.
 * A little "Tap me!" bubble shows until the first tap (it comes back next time the app opens).
 * Set his size with className, for example "w-[68px]".
 * Spacing is written inline on purpose: the phone CSS reset removes margin/padding classes.
 */
let hintDone = false; // for this app session

const CSS = `
@keyframes ks-tap-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@media (prefers-reduced-motion: reduce){ .ks-tap-hint{animation:none!important} }
`;

const SparkTapButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [speaking, setSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(() => !hintDone && isSparkVoiceEnabled());

  useEffect(() => subscribeSparkSpeaking(setSpeaking), []);

  /* fetch the voice clips quietly a moment after Home opens */
  useEffect(() => {
    const t = setTimeout(preloadSparkVoice, 2000);
    return () => clearTimeout(t);
  }, []);

  const onTap = () => {
    if (!isSparkVoiceEnabled()) return;
    hintDone = true;
    setShowHint(false);
    if (!speaking) playSparkVoice('hello');
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>{CSS}</style>

      {showHint && (
        <div
          className="ks-tap-hint"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            bottom: '88%',
            zIndex: 30,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: '#fff',
            color: '#7C3AED',
            fontFamily: "'Fredoka', 'Arial Black', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 1,
            padding: '6px 11px',
            borderRadius: 999,
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            animation: 'ks-tap-bob 1.1s ease-in-out infinite',
          }}
        >
          Tap me! 👆
          <span
            style={{
              position: 'absolute',
              bottom: -4,
              right: 24,
              width: 10,
              height: 10,
              background: '#fff',
              transform: 'rotate(45deg)',
              borderRadius: 2,
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={onTap}
        aria-label="Tap Spark to hear him say hello"
        style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
      >
        <SparkMascot mode={speaking ? 'talk' : 'hello'} className={className} />
      </button>
    </div>
  );
};

export default SparkTapButton;
