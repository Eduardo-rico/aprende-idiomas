// lib/stores/session.ts
"use client";
import { create } from "zustand";
import type { Session } from "@/lib/db/schema";

interface SessionStore {
  sessionId?: number;
  mode?: Session["mode"];
  startedAt?: Date;
  pendingReview: Set<string>;
  submitTokens: Map<string, number>;
  cardsReviewed: number;
  correctCount: number;

  beginSession: (id: number, mode: Session["mode"]) => void;
  endSession: () => void;
  markPending: (cardId: string) => void;
  clearPending: (cardId: string) => void;
  isPending: (cardId: string) => boolean;
  incrCorrect: (correct: boolean) => void;
}

export const useSession = create<SessionStore>((set, get) => ({
  pendingReview: new Set(),
  submitTokens: new Map(),
  cardsReviewed: 0,
  correctCount: 0,
  beginSession: (id, mode) =>
    set({ sessionId: id, mode, startedAt: new Date(), pendingReview: new Set(), cardsReviewed: 0, correctCount: 0 }),
  endSession: () => set({ sessionId: undefined, mode: undefined, startedAt: undefined }),
  markPending: (cardId) => set((s) => ({ pendingReview: new Set([...s.pendingReview, cardId]) })),
  clearPending: (cardId) => set((s) => {
    const next = new Set(s.pendingReview); next.delete(cardId); return { pendingReview: next };
  }),
  isPending: (cardId) => get().pendingReview.has(cardId),
  incrCorrect: (correct) => set((s) => ({ cardsReviewed: s.cardsReviewed + 1, correctCount: s.correctCount + (correct ? 1 : 0) })),
}));
