export default function Monogram({
  className = 'h-11 w-11',
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="شعار الحسن الرقمي"
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".38"
      />
      <path
        d="M17 45 28 18h7l12 27h-8l-2.5-6H26l-2.3 6H17Zm11.5-13h5.7l-2.9-7.1L28.5 32Z"
        fill="currentColor"
      />
      <path d="M39 18h7v27h-7z" fill="currentColor" opacity=".55" />
    </svg>
  );
}
