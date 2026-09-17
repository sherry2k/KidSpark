import { useEffect, useRef, useState } from 'react';

/**
 * ParentGate — a multiplication question that stands between a child and
 * anything that leaves the app.
 *
 * Google's Families policy requires a parental gate in front of links out of a
 * children's app: app stores, external sites, mail clients, share sheets. A
 * multiplication question is the standard form because a four-year-old can't
 * solve it and an adult doesn't have to think about it.
 *
 * No dependencies beyond React, so it drops in anywhere and can wrap anything
 * else you add later (a store link, a privacy policy, a share button).
 */

type Props = {
  open: boolean;
  onPass: () => void;
  onCancel: () => void;
  /** Shown under the question, e.g. "to send feedback to the developer". */
  purpose?: string;
};

function newQuestion() {
  // 3..9 × 3..9 — never trivial (no ×1, ×2), never more than two digits.
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  return { a, b, answer: a * b };
}

export default function ParentGate({ open, onPass, onCancel, purpose }: Props) {
  const [q, setQ] = useState(newQuestion);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fresh question every time the gate opens, so a child can't learn one answer.
  useEffect(() => {
    if (!open) return;
    setQ(newQuestion());
    setValue('');
    setWrong(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  // Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === String(q.answer)) {
      onPass();
      return;
    }
    setWrong(true);
    setValue('');
    setQ(newQuestion());
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-gate-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl">
        <p
          id="parent-gate-title"
          className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400"
        >
          Grown-ups only
        </p>

        <p className="mt-4 text-center text-3xl font-bold tabular-nums text-slate-800">
          {q.a} &times; {q.b} = ?
        </p>

        {purpose ? (
          <p className="mt-2 text-center text-sm leading-snug text-slate-500">{purpose}</p>
        ) : null}

        <form onSubmit={submit} className="mt-5">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/[^0-9]/g, ''));
              setWrong(false);
            }}
            aria-label={`What is ${q.a} times ${q.b}?`}
            aria-invalid={wrong}
            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tabular-nums text-slate-800 outline-none focus:border-purple-400"
          />

          <p
            className="mt-2 h-5 text-center text-sm font-medium text-rose-500"
            role="status"
            aria-live="polite"
          >
            {wrong ? 'Not quite — here is another one.' : ''}
          </p>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-2xl border-2 border-slate-200 py-3 font-semibold text-slate-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={value === ''}
              className="flex-1 rounded-2xl bg-purple-500 py-3 font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
