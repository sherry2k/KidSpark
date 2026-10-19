/**
 * DayGlyph — draws a day of the week as a little calendar page:
 * coloured top band with MON / TUE / ..., and the day number (1-7) big below.
 * No emoji font needed, so it looks the same on every phone.
 */


const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
// one colour per day so each page looks different
const BAND = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#d946ef'];

export const dayIndex = (name?: string): number => DAYS.indexOf((name || '').trim().toLowerCase());

export default function DayGlyph({ name, size }: { name: string; size: number }) {
  const i = dayIndex(name);
  if (i < 0) return null;
  const band = BAND[i];
  const abbr = DAYS[i].slice(0, 3).toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="presentation" style={{ display: 'block' }}>
      {/* soft drop shadow */}
      <rect x="12" y="16" width="76" height="80" rx="12" fill="rgba(23,26,35,.13)" />
      {/* page */}
      <rect x="12" y="12" width="76" height="80" rx="12" fill="#ffffff" stroke="rgba(23,26,35,.25)" strokeWidth="3" />
      {/* coloured top band */}
      <path d="M12 24 a12 12 0 0 1 12 -12 h52 a12 12 0 0 1 12 12 v18 h-76 Z" fill={band} />
      {/* binder rings */}
      <circle cx="32" cy="12" r="4.5" fill="#ffffff" stroke="rgba(23,26,35,.35)" strokeWidth="2" />
      <circle cx="68" cy="12" r="4.5" fill="#ffffff" stroke="rgba(23,26,35,.35)" strokeWidth="2" />
      <text
        x="50" y="35" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800"
        fontFamily="'Bubblegum One','Fredoka',system-ui,sans-serif" letterSpacing="1.5"
      >
        {abbr}
      </text>
      <text
        x="50" y="80" textAnchor="middle" fill={band} fontSize="38" fontWeight="800"
        fontFamily="'Bubblegum One','Fredoka',system-ui,sans-serif"
      >
        {i + 1}
      </text>
    </svg>
  );
}
