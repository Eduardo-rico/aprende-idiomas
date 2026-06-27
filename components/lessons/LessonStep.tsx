// components/lessons/LessonStep.tsx
// Client wrapper around LessonRenderer. The Runner hits the `lesson`
// branch and lands here. We:
//
//   1. Render the lesson content (MDX) via LessonRenderer.
//   2. Show a "Continuar a ejercicios →" button at the bottom.
//   3. On click: record the view in Dexie, then navigate to
//      `/practice/[lang]/[lessonId]` (the practice route, which is
//      the next thing L5 wires up).
//
// The MDX loading is shared with the standalone review page — that's
// why the renderer is now a client component (see L4.3 deviation
// note in LessonRenderer.tsx).
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordLessonView } from "@/lib/db/repository";
import type { LanguageId } from "@/lib/locales";

interface Props {
  lessonId: string;
  lang: LanguageId;
  /**
   * The lesson content (MDX) pre-rendered on the server and passed down
   * as a slot. LessonStep is a Client Component, so it can't render the
   * (async) MDX itself — see LessonRenderer's header note. `null` when
   * no lesson content is available.
   */
  lessonSlot: React.ReactNode;
  /**
   * Called after the lesson view is recorded, to advance the UI to the
   * exercises. When provided (the LessonGate case), the gate flips to its
   * "skip" branch and renders the exercise runner in place — no
   * navigation. When absent (legacy callers), we fall back to a route
   * push. Navigating to the SAME practice URL would NOT re-run the gate's
   * effect, so the callback is the reliable path.
   */
  onAdvance?: () => void;
}

export function LessonStep({ lessonId, lang, lessonSlot, onAdvance }: Props) {
  const router = useRouter();
  const [recording, setRecording] = useState(false);

  const onContinue = async () => {
    if (recording) return;
    setRecording(true);
    try {
      await recordLessonView(lessonId, lang);
    } catch (err) {
      // Don't block the user on a write failure — log and continue.
      // The gate will just re-show the lesson next time, which is
      // the safer UX.
      console.error("LessonStep: recordLessonView failed", err);
    }
    if (onAdvance) {
      onAdvance();
      return;
    }
    router.push(`/${lang}/practice/${lessonId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {lessonSlot}
      <div className="flex justify-end">
        <button
          onClick={onContinue}
          disabled={recording}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        >
          {recording ? "Guardando…" : "Continuar a ejercicios →"}
        </button>
      </div>
    </div>
  );
}