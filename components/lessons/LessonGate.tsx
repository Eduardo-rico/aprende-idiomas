// components/lessons/LessonGate.tsx
// Client wrapper that decides whether the user needs to see the
// lesson again before practicing, or can skip straight to the
// exercise runner.
//
// Rules (L4.3 of the plan):
//   - If the user has NOT viewed the lesson recently (no view OR
//     last view > 1 hour ago): render the lesson + the "Continuar"
//     button via LessonStep.
//   - If the user HAS viewed recently (< 1 hour ago): skip the
//     lesson and navigate straight to `/practice/[lang]/[lessonId]`.
//
// The 1-hour window is the "fresh enough" threshold — it's long
// enough to forgive reloads / accidental navigations, short enough
// that a user returning the next day still sees the lesson. Tunable
// via the constant below; no UI knob.
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LessonStep } from "./LessonStep";
import { getLastLessonView } from "@/lib/db/repository";
import type { LanguageId } from "@/lib/locales";

/** How recent a `lessonViews` row must be to consider the user
 *  "already seen" the lesson. */
const RECENT_VIEW_MS = 60 * 60 * 1000; // 1 hour

interface Props {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
}

type GateState =
  | { status: "loading" }
  | { status: "show-lesson" }
  | { status: "skip" };

export function LessonGate({ lessonId, mdxPath, lang }: Props) {
  const router = useRouter();
  const [gate, setGate] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const last = await getLastLessonView(lessonId, lang);
        if (cancelled) return;
        if (!last || Date.now() - last.viewedAt > RECENT_VIEW_MS) {
          setGate({ status: "show-lesson" });
        } else {
          setGate({ status: "skip" });
        }
      } catch (err) {
        // If Dexie read fails, default to showing the lesson — the
        // safer fallback (worst case: user re-reads the lesson).
        console.error("LessonGate: getLastLessonView failed", err);
        if (!cancelled) setGate({ status: "show-lesson" });
      }
    })();
    return () => { cancelled = true; };
  }, [lessonId, lang]);

  useEffect(() => {
    if (gate.status !== "skip") return;
    router.replace(`/practice/${lang}/${lessonId}`);
  }, [gate, lessonId, lang, router]);

  if (gate.status === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-muted-foreground">
        Cargando lección…
      </div>
    );
  }
  if (gate.status === "skip") {
    // Brief flash before the redirect effect fires — same loading
    // message so the user doesn't see a layout jump.
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-muted-foreground">
        Cargando ejercicios…
      </div>
    );
  }
  return <LessonStep lessonId={lessonId} mdxPath={mdxPath} lang={lang} />;
}