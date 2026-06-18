// lib/db/schema.ts
import Dexie, { type EntityTable } from "dexie";
import type { Card as FsrsCard } from "ts-fsrs";
import type { VariantKey } from "@/lib/data/variant";

export type CardId = string;
export type ConceptId = string;
export type LessonId = string;
export type BlockId = number;

// Phase 4 (multi-idioma): the legacy `Variant = "br" | "pt"` alias is
// removed. All consumers import `VariantKey` from `@/lib/data/variant`
// (the canonical home). The localStorage migration in
// `lib/stores/localstorage-migrate.ts` translates any persisted
// legacy "br"/"pt" value to the canonical "pt-br"/"pt-pt" on first load.
// Phase 1: 1 voice por variant hasta Plan #4 regen. Antes era literal
// "default"; ahora string libre para acomodar voces específicas por
// dialecto (ej. "vitoria", "joao", "francisca").
export type AudioVariant = string;
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
  /** Active target language for this card. Optional: cards created
   *  before schema v6 don't have the field; lazy-init to "pt" in
   *  Phase 4 (`getOrCreateVocabCard`, `recordAnswer`). Indexed in v6
   *  for per-language queries. */
  language?: string;
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
  variant: VariantKey;
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
  lastVariant: VariantKey;
}

export interface DiagnosticResultRow {
  id?: number;
  takenAt: Date;
  completed: boolean;
  answers: number[];
  recommendedStart: number;
  score: number;
}

/** L4 (lessons-before-exercises): a row per "user has seen this lesson
 *  content". Written by `recordLessonView` in the repository when the
 *  user clicks "Continuar a ejercicios →" on a `LessonStep`. Drives
 *  the `LessonGate` decision ("show lesson again or skip?") and the
 *  `/review` "Repasar lección" feature. Indexed by id (PK), lessonId,
 *  viewedAt, and language; compound `[language+viewedAt]` powers
 *  per-language time-sorted reads without a full scan. */
export interface LessonView {
  id: string;
  lessonId: string;
  language: string;
  viewedAt: number;
}

class AppDB extends Dexie {
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
  lessonViews!: EntityTable<LessonView, "id">;

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
    // v6: add `language` index on cards for per-language queries
    // (Phase 4 will populate it on write via `getOrCreateVocabCard`
    // and `recordAnswer`). Legacy cards don't have the field; the
    // index is empty for them, which is fine — they continue to
    // match queries that don't filter by language. No backfill.
    this.version(6).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, *tags, language, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
    });
    // v7: add `lessonViews` table — one row per user viewing a lesson
    // content page (written by `recordLessonView` in repository.ts when
    // the user clicks "Continuar a ejercicios →" on a `LessonStep`).
    // Drives the `LessonGate` decision ("has the user seen this lesson
    // in the last hour?") and the future /review "Repasar lección"
    // feature. The compound `[language+viewedAt]` index keeps per-lang
    // time-sorted reads O(log N). All other tables are unchanged
    // (Dexie allows adding a new table in a version bump without an
    // upgrade body — existing stores are inherited verbatim).
    this.version(7).stores({
      lessonViews: "id, lessonId, viewedAt, language, [language+viewedAt]",
    });
  }
}

export const db = new AppDB();
