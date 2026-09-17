import { useState } from 'react';
import ParentGate from './ParentGate';

/* ------------------------------------------------------------------ *
 *  SET THIS BEFORE YOU DEPLOY.                                       *
 *                                                                    *
 *  A mailto: address in a public web bundle gets scraped by spam      *
 *  bots within days. Use an address you can afford to burn — a        *
 *  Gmail alias like kidspark.feedback@gmail.com is ideal — rather    *
 *  than your personal inbox.                                          *
 * ------------------------------------------------------------------ */
const FEEDBACK_EMAIL = 'support@kid-spark.app';

/** Build id, stamped by the `define` block in vite.config.ts. */
function buildId(): string {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  return env?.VITE_APP_VERSION || 'dev';
}

/**
 * A tester's report is worth roughly nothing without the build they were on.
 * Three of our four rejections came down to not knowing whether someone was
 * looking at the current app or a cached one from two weeks ago, so every
 * message carries the build id, the screen size and a trimmed user-agent.
 */
function deviceLine(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const android = ua.match(/Android\s+([\d.]+)/);
  const model = ua.match(/;\s*([^;)]+)\s+Build\//);
  const parts = [
    model ? model[1].trim() : null,
    android ? `Android ${android[1]}` : null,
    `${window.screen?.width || '?'}×${window.screen?.height || '?'}`,
    // standalone means they opened the installed app, not a browser tab —
    // useful for spotting a tester who is on the Vercel URL instead of Play
    window.matchMedia?.('(display-mode: standalone)').matches ? 'installed' : 'browser tab',
  ].filter(Boolean);
  return parts.join(' · ');
}

function openMail() {
  const subject = `KidSpark feedback — build ${buildId()}`;
  const body = [
    'What did your child try?',
    '',
    '',
    'What happened, or what was confusing?',
    '',
    '',
    'Anything they really enjoyed?',
    '',
    '',
    '—————————————',
    `Build: ${buildId()}`,
    `Device: ${deviceLine()}`,
    'Please leave these two lines in — they tell me exactly which version you saw.',
  ].join('\n');

  window.location.href =
    `mailto:${FEEDBACK_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

/**
 * FeedbackButton — small, quiet, and behind a parental gate.
 *
 * Deliberately not colourful and not near the game cards: a four-year-old
 * should have no reason to press it, and a parent should be able to find it
 * without being told twice.
 */
export default function FeedbackButton({ className = '' }: { className?: string }) {
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setGateOpen(true)}
        aria-label="For grown-ups — send feedback"
        className={
          'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 ' +
          'text-xs font-medium text-slate-500 backdrop-blur transition-colors hover:text-purple-600 ' +
          className
        }
      >
        {/* inline SVG, not an emoji — emoji fonts are missing on some of the
            cheap Androids the testers use, and render as a blank or a box */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6.5h16v11H8.5L4 20.5v-14Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        For grown-ups
      </button>

      <ParentGate
        open={gateOpen}
        purpose="Answer this to send feedback to the people who made KidSpark."
        onCancel={() => setGateOpen(false)}
        onPass={() => {
          setGateOpen(false);
          openMail();
        }}
      />
    </>
  );
}

/** Exported in case you want the same build id on a version chip elsewhere. */
export { buildId };
