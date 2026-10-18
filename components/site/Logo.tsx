interface LogoMarkProps {
  /** Harus unik per instance, dipakai untuk id gradient SVG. */
  gradientId: string;
  size?: number;
}

export function LogoMark({ gradientId, size = 38 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6FF00" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      <path
        d="M14 12v24h12"
        stroke="#07070c"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M27 15l10 7-10 7z" fill="#07070c" />
      <circle cx="35" cy="35" r="3" fill="#8B5CF6" />
    </svg>
  );
}

interface LogoProps extends LogoMarkProps {
  /** Class tambahan untuk wordmark, contoh "text-xl" atau "text-3xl". */
  wordClassName?: string;
  /** Class tambahan untuk tagline "GAMES". */
  tagClassName?: string;
  className?: string;
}

/** Logo lengkap: ikon + wordmark LDICO + tagline GAMES. */
export function Logo({
  gradientId,
  size = 38,
  wordClassName = "text-xl",
  tagClassName = "text-[9px]",
  className = "",
}: LogoProps) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark gradientId={gradientId} size={size} />
      <span className="leading-none">
        <span className={`dp block font-bold tracking-wider ${wordClassName}`}>
          LDIC
          <span className="bg-gradient-to-r from-[#C6FF00] to-[#22D3EE] bg-clip-text text-transparent">
            O
          </span>
        </span>
        <span className={`block tracking-[.5em] text-[var(--mut)] mt-1 ${tagClassName}`}>GAMES</span>
      </span>
    </span>
  );
}
