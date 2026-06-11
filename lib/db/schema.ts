// lib/db/schema.ts
import Dexie, { type EntityTable } from "dexie";
import type { Card as FsrsCard } from "ts-fsrs";

export type CardId = string;
export type ConceptId = string;
export type LessonId = string;
export type BlockId = number;
export type Variant = "br" | "pt";
// CRITICAL FIX (C3): 1 voice per variant until Plan #4 regen. The 6-voice
// union (f/m × neutral/happy/calm) returns when b1.json carries AudioVariantSet.
export type AudioVariant = "default";
export type Rating = 1 | 2 | 3 | 4;
export const RATING = { Again: 1, Hard: 2, Good: 3, Easy: 4 } as const;

export interface Card {
  id: CardId;
  blockId: BlockId;
  lessonId: LessonId;
  contentHash: string;
  fsrs: FsrsCard;
  nextReviewAt: Date;
  state: number;
  reps: number;
  lapses: number;
  lastRating?: Rating;
  lastReviewedAt?: Date;
  introducedAt: Date;
}

export interface Session {
  id?: number;
  startedAt: Date;
  endedAt?: Date;
  blockId?: BlockId;
  lessonId?: LessonId;
  mode: "daily" | "lesson" | "drill" | "review_errors" | "story";
  cardsReviewed: number;
  correctCount: number;
  durationMs: number;
}

export interface ReviewEvent {
  id?: number;
  ts: Date;
  cardId: CardId;
  sessionId?: number;
  rating: Rating;
  correct: boolean;
  responseMs: number;
  mode: string;
  conceptIds: ConceptId[];
  variant: Variant;
}

export type SettingsKey =
  | "variant" | "voicePref" | "showContrast" | "showCompareToggle"
  | "dailyGoalMinutes" | "theme" | "soundFx" | "onboardingDone";

export interface SettingsRow<T = unknown> { key: SettingsKey; value: T; updatedAt: Date; }

export interface Achievement { id: string; unlockedAt: Date; }

export interface StreakDay { date: string; minutesStudied: number; cardsReviewed: number; xpEarned: number; }

export interface XpRow { key: "total"; value: number; updatedAt: Date; }

export interface ConceptMastery {
  conceptId: ConceptId;
  blockId: BlockId;
  accuracy: number;
  exposureCount: number;
  correctCount: number;
  lastReviewed?: Date;
  masteryPct: number;
  isMastered: boolean;
  updatedAt: Date;
}

export interface StoryProgressRow {
  storyId: string;
  startedAt: Date;
  completedAt: Date | null;
  lastVariant: Variant;
}

class PortuguesDB extends Dexie {
  cards!: EntityTable<Card, "id">;
  sessions!: EntityTable<Session, "id">;
  events!: EntityTable<ReviewEvent, "id">;
  errorQueue!: EntityTable<{ cardId: CardId; ts: Date; reason: string }, "cardId">;
  errorReasons!: EntityTable<{ id?: number; cardId: CardId; ts: Date; reason: string; conceptIds: ConceptId[] }, "id">;
  settings!: EntityTable<SettingsRow, "key">;
  achievements!: EntityTable<Achievement, "id">;
  streak!: EntityTable<StreakDay, "date">;
  xp!: EntityTable<XpRow, "key">;
  conceptMastery!: EntityTable<ConceptMastery, "conceptId">;
  storyProgress!: EntityTable<StoryProgressRow, "storyId">;

  constructor() {
    super("PortuguesAppDB");
    this.version(1).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
      sessions: "++id, startedAt, blockId, lessonId, mode",
      events: "++id, ts, cardId, sessionId, [cardId+ts], *conceptIds",
      errorQueue: "cardId, ts",
      // FIX: Dexie does not support compound indexes over arrays.
      // Use multiEntry (*conceptIds) for per-concept lookups.
      errorReasons: "++id, cardId, ts, *conceptIds",
      settings: "key",
      achievements: "id, unlockedAt",
      streak: "date",
      xp: "key",
      conceptMastery: "conceptId, blockId, isMastered",
    });
    this.version(2).stores({
      storyProgress: "storyId, completedAt",
    });
  }
}

export const db = new PortuguesDB();
