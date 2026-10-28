export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#12a08c" />
      <circle cx="32" cy="35" r="17" fill="#fff" />
      <path d="M31 18c-3-6 4-9 7-5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="26" cy="34" r="2.2" fill="#1e2b2a" />
      <circle cx="38" cy="34" r="2.2" fill="#1e2b2a" />
      <path d="M27 40.5c3 2.6 7 2.6 10 0" fill="none" stroke="#1e2b2a" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22" cy="39" r="2.4" fill="#f6b5a4" />
      <circle cx="42" cy="39" r="2.4" fill="#f6b5a4" />
    </svg>
  );
}
