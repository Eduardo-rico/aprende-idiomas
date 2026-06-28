// components/home/StreakRing.tsx
// Editorial 52×52 SVG progress ring. Stateless: callers pass value/max.
// Used by /[lang] home page in two color variants (streak = lesson-green,
// minutes = review-amber).
interface Props {
  value: number;
  max: number;
  /** CSS color (token reference or hex). Defaults to --lesson. */
  color?: string;
}

export function StreakRing({ value, max, color = "var(--lesson)" }: Props) {
  const pct = max <= 0 ? 0 : Math.min(value / max, 1);
  // Circumference of r=15.5 → 2π·15.5 ≈ 97.4. Mockup uses 97.
  const dash = 97;
  const offset = dash * (1 - pct);
  return (
    <svg
      viewBox="0 0 36 36"
      className="w-[52px] h-[52px] flex-none"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r="15.5"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="3"
      />
      <circle
        cx="18"
        cy="18"
        r="15.5"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={dash}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}