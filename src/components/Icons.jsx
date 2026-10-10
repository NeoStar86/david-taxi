export function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.5 3.8h2.2c.4 0 .8.3.9.7l1 3.2a1 1 0 0 1-.3 1L9.6 10.2a12.4 12.4 0 0 0 4.2 4.2l1.5-1.7a1 1 0 0 1 1-.3l3.2 1c.4.1.7.5.7.9v2.2c0 .6-.4 1-1 1.1A16.2 16.2 0 0 1 4.4 4.8c.1-.6.5-1 1.1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoMark({ className = "h-11 w-11" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#f5c518" />
      <rect x="14" y="9" width="20" height="7" rx="2" fill="#0b0b0c" />
      <path
        d="M10 30c1.6-5 5-8 9.2-8h9.6c4.2 0 7.6 3 9.2 8"
        fill="none"
        stroke="#0b0b0c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M12 30h24" stroke="#0b0b0c" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="33.5" r="2.4" fill="#0b0b0c" />
      <circle cx="32" cy="33.5" r="2.4" fill="#0b0b0c" />
    </svg>
  );
}

export function SedanArt() {
  return (
    <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="איור של רכב הסעות">
      <ellipse cx="260" cy="188" rx="180" ry="14" fill="#000" opacity="0.45" />
      <path
        d="M78 150c8-38 36-62 86-70l46-28c18-10 38-16 60-16h62c28 0 52 10 70 28l28 36c22 6 40 22 48 46v18H78v-14Z"
        fill="#f6f3ea"
      />
      <path d="M186 86h150l28 40H150l36-40Z" fill="#0b0b0c" />
      <path d="M198 96h52l-16 24h-52l16-24Z" fill="#f5c518" />
      <path d="M262 96h62l18 24H246l16-24Z" fill="#8d8d92" opacity="0.7" />
      <circle cx="148" cy="164" r="26" fill="#0b0b0c" />
      <circle cx="148" cy="164" r="11" fill="#f5c518" />
      <circle cx="372" cy="164" r="26" fill="#0b0b0c" />
      <circle cx="372" cy="164" r="11" fill="#f5c518" />
      <path d="M118 132h28" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" />
      <path d="M392 128h36" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
