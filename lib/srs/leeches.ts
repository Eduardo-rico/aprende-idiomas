// lib/srs/leeches.ts
import { createEmptyCard } from "ts-fsrs";
import { type Card } from "../db/schema";
import { FSRS_CONFIG } from "./config";

/** A card is a "leech" once it has been failed (Again-from-Review) at least
 *  `leech_lapses_threshold` times. FSRS-5 only counts a lapse from the Review
 *  state — Again in Learning does not count, so the threshold is a real
 *  "this card is hard for you" signal, not just a fluky session. */
export function isLeech(card: Card): boolean {
  return card.lapses >= FSRS_CONFIG.leech_lapses_threshold;
}

export const LEECH_LADDER: Array<{ lapses: number; action: "warn" | "reset" | "focus" }> = [
  { lapses: 3, action: "warn" },
  { lapses: 5, action: "reset" },
  { lapses: 7, action: "focus" },
];

export interface LeechAction {
  level: "warn" | "reset" | "focus";
  message: string;
}

export function getLeechAction(lapses: number): LeechAction | null {
  const tier = LEECH_LADDER.find((t) => t.lapses === lapses);
  if (!tier) return null;
  switch (tier.action) {
    case "warn":
      return { level: "warn", message: "Esta card te está costando — la veré más seguido." };
    case "reset":
      return { level: "reset", message: "Card en 'reset' — la trataremos como nueva con más contexto." };
    case "focus":
      return { level: "focus", message: "Leech avanzado — sesión de foco con 3 variantes a continuación." };
  }
}

/** Rebuild a leech's FSRS state from scratch while keeping its identity
 *  (id, blockId, lessonId, contentHash) and its ORIGINAL `introducedAt` so
 *  it does not re-enter the "new cards today" pool after the reset.
 *
 *  The card is returned with state = 0 (New) and lapses = 0; the scheduler
 *  will pick a fresh learning interval on the first Good rating. */
export function resetLeech(card: Card, now = new Date()): Card {
  const empty = createEmptyCard(now);
  return {
    ...card,
    fsrs: empty,
    nextReviewAt: empty.due,
    state: empty.state,
    reps: 0,
    lapses: 0,
    lastRating: undefined,
    lastReviewedAt: now,
    // introducedAt preserved — the card was introduced long ago; resetting
    // it would let the user game the "new cards per day" cap.
  };
}
