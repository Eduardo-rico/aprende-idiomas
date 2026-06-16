// lib/srs/intervals.ts
import type { Card } from "../db/schema";

/** How long until `card.nextReviewAt` from `now`, in milliseconds.
 *  Clamped to 0 so a card whose due time has passed reads as 0 (not negative). */
export function nextIntervalMs(card: Card, now = new Date()): number {
  return Math.max(0, card.nextReviewAt.getTime() - now.getTime());
}

/** Human-readable Spanish interval label for the small "Próxima: …" hint
 *  shown after a card is graded. Granularity matches what FSRS-5 actually
 *  produces (minutes → years), not arbitrary second-level precision. */
export function formatInterval(ms: number): string {
  if (ms < 0) return "ahora";

  const sec = Math.round(ms / 1000);
  if (sec < 60) return sec <= 1 ? "ahora" : `en ${sec} s`;

  const min = Math.round(sec / 60);
  if (min < 60) return `en ${min} min`;

  const hr = Math.round(min / 60);
  if (hr < 24) return `en ${hr} h`;

  const days = Math.round(hr / 24);
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days < 30) return `en ${days} días`;

  const months = Math.round(days / 30);
  if (months < 12) return `en ${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.round(months / 12);
  return `en ${years} ${years === 1 ? "año" : "años"}`;
}
