

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  stars?: number;
  emoji?: string;
}

export default function Header({ title, subtitle, onBack, stars = 0, emoji = '🧩' }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
      <button
        onClick={onBack}
        className="btn-bounce flex items-center gap-2 bg-white/30 hover:bg-white/50 px-4 py-2 rounded-xl text-white font-bold text-lg transition-all"
      >
        <span className="text-2xl">←</span>
        <span className="hidden sm:inline">Back</span>
      </button>
      <div className="text-center flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-[Bubblegum_Sans] flex items-center justify-center gap-2">
          <span>{emoji}</span> {title}
        </h2>
        {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1 bg-white/30 px-4 py-2 rounded-xl">
        <span className="text-2xl">⭐</span>
        <span className="text-white font-bold text-lg">{stars}</span>
      </div>
    </div>
  );
}
