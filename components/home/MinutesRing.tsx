// components/home/MinutesRing.tsx
// StreakRing variant with the review-amber accent. Used for the
// "minutos de hoy" stat on the home page.
import { StreakRing } from "./StreakRing";

export function MinutesRing(props: { value: number; max: number }) {
  return <StreakRing {...props} color="var(--review)" />;
}