export default function Ornament({ className = '', light = false }) {
  return (
    <svg
      viewBox="0 0 140 16"
      fill="none"
      stroke="currentColor"
      className={`h-4 w-36 ${light ? 'text-gold-light' : 'text-gold'} ${className}`}
      aria-hidden="true"
    >
      <path d="M0 8h50M90 8h50" strokeWidth="0.75" />
      <path d="M70 1.5l6.5 6.5-6.5 6.5-6.5-6.5z" strokeWidth="1" />
      <path d="M70 5l3 3-3 3-3-3z" fill="currentColor" stroke="none" />
      <circle cx="56" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="84" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
