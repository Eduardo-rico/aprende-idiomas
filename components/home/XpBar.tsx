// components/home/XpBar.tsx
// XP progress bar shown on the home page. Tier label maps to CEFR level
// (A1..C2) using a simple per-tier cap of 500 XP. The "current" and
// "nextLevel" props are the XP floor/ceiling of the current level band;
// we compute pct = current / nextLevel inside the component.
interface Props {
  /** XP already earned within the current level band. */
  current: number;
  /** XP required to complete the current level (band ceiling). */
  nextLevel: number;
  /** Total cumulative XP (used to derive the level label). */
  totalXp: number;
}

const TIERS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function XpBar({ current, nextLevel, totalXp }: Props) {
  const pct = Math.min(Math.max(current / Math.max(nextLevel, 1), 0), 1) * 100;
  const remaining = Math.max(0, nextLevel - current);
  return (
    <div className="mb-12">
      <div className="text-sm text-ink-muted mb-2 flex justify-between">
        <span>
          Nivel {levelFromXp(totalXp)} · {totalXp.toLocaleString("es")} XP
        </span>
        <span>próximo nivel en {remaining} XP</span>
      </div>
      <div className="h-2 bg-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-lesson rounded-full transition-[width] duration-300 ease-[var(--ease)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function levelFromXp(xp: number): string {
  // 500 XP per tier, capped at C2. Negative XP (shouldn't happen) → A1.
  const idx = Math.min(Math.floor(Math.max(xp, 0) / 500), TIERS.length - 1);
  return TIERS[idx] ?? "C2";
}