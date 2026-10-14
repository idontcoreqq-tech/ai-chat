export function LauncherAvatarIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="launcherAvatarBg"
          x1="20"
          y1="0"
          x2="100"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="url(#launcherAvatarBg)" />
      <path fill="#1e3a5f" d="M18 108c8-22 28-34 42-34s34 12 42 34H18z" />
      <path fill="#2563eb" d="M32 98c10-14 24-20 28-20s18 6 28 20v22H32V98z" />
      <rect x="52" y="72" width="16" height="18" rx="6" fill="#f5c4a8" />
      <ellipse cx="60" cy="52" rx="28" ry="30" fill="#fcd9c4" />
      <path
        fill="#4a3728"
        d="M32 48c2-22 18-34 28-34s26 12 28 34c-6-8-16-12-28-12s-22 4-28 12z"
      />
      <path
        fill="#4a3728"
        d="M34 42c-4 10-3 22 2 30 4-14 12-22 24-24-12 2-20-4-26-6z"
      />
      <path
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinecap="round"
        d="M28 52c0-22 14-36 32-36s32 14 32 36"
      />
      <rect x="20" y="48" width="14" height="22" rx="6" fill="#334155" />
      <rect x="86" y="48" width="14" height="22" rx="6" fill="#334155" />
      <rect x="22" y="52" width="10" height="14" rx="4" fill="#64748b" />
      <rect x="88" y="52" width="10" height="14" rx="4" fill="#64748b" />
      <path
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
        d="M88 62c6 8 4 18-6 22"
      />
      <circle cx="78" cy="86" r="4" fill="#475569" />
      <ellipse cx="48" cy="54" rx="3" ry="4" fill="#1e293b" />
      <ellipse cx="72" cy="54" rx="3" ry="4" fill="#1e293b" />
      <path
        stroke="#c97b63"
        strokeWidth="2.5"
        strokeLinecap="round"
        d="M50 66c4 6 16 6 20 0"
      />
    </svg>
  );
}
