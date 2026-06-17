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
  /** Categorical tags. Indexed via multiEntry (`*tags`) so a single card
   *  can be found by any of its tags. Optional: cards created before
   *  schema v5 don't have the field; they just don't match any tag
   *  filter. No backfill — see plan. */
  tags?: string[];
}

export interface Session {
  id?: number;
  startedAt: Date;
  endedAt?: Date;
  blockId?: BlockId;
  lessonId?: LessonId;
  mode: "daily" | "lesson" | "drill" | "review_errors" | "story" | "review";
  cardsReviewed: number;
  correctCount: number;
  durationMs: number;
}

export interface AnswerEvent {
  id?: number;
  ts: Date;
  type: "answer";
  cardId: CardId;
  sessionId?: number;
  rating: Rating;
  correct: boolean;
  responseMs: number;
  mode: string;
  conceptIds: ConceptId[];
  variant: Variant;
}

export type AppEventType =
  | "answer"
  | "lesson_complete"
  | "session_complete"
  | "story_started"
  | "story_completed"
  | "streak_day"
  | "level_up"
  | "achievement_unlocked"
  | "diagnostic_completed";

export interface GenericEvent {
  id?: number;
  ts: Date;
  type: Exclude<AppEventType, "answer">;
  payload: Record<string, unknown>;
}

export type AppEvent = AnswerEvent | GenericEvent;

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

export interface DiagnosticResultRow {
  id?: number;
  takenAt: Date;
  completed: boolean;
  answers: number[];
  recommendedStart: number;
  score: number;
}

class PortuguesDB extends Dexie {
  cards!: EntityTable<Card, "id">;
  sessions!: EntityTable<Session, "id">;
  events!: EntityTable<AppEvent, "id">;
  errorQueue!: EntityTable<{ cardId: CardId; ts: Date; reason: string }, "cardId">;
  errorReasons!: EntityTable<{ id?: number; cardId: CardId; ts: Date; reason: string; conceptIds: ConceptId[] }, "id">;
  settings!: EntityTable<SettingsRow, "key">;
  achievements!: EntityTable<Achievement, "id">;
  streak!: EntityTable<StreakDay, "date">;
  xp!: EntityTable<XpRow, "key">;
  conceptMastery!: EntityTable<ConceptMastery, "conceptId">;
  storyProgress!: EntityTable<StoryProgressRow, "storyId">;
  diagnosticResults!: EntityTable<DiagnosticResultRow, "id">;

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
    this.version(3).stores({
      diagnosticResults: "++id, takenAt, completed",
    });
    // v4: add `introducedAt` index on cards so `getNewCardCountToday` and
    // the review-queue new-cards ordering are O(log N) instead of O(N).
    this.version(4).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
    });
    // v5: add `*tags` multiEntry index so `where("tags").equals(...)`
    // works on the cards table. Mirrors the existing `*conceptIds`
    // pattern on events (line above) and errorReasons. The `Card.tags?`
    // field is optional, so legacy rows deserialize fine.
    this.version(5).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, *tags, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
    });
  }
}

export const db = new PortuguesDB();
