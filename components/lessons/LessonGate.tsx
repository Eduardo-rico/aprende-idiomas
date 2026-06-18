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
  /**
   * Content to render once the gate decides the user is "fresh" — i.e.
   * they have either never seen the lesson, or last saw it >1h ago
   * (in which case the gate silently flips to `skip` and redirects
   * straight to practice, so children are never visible in that case).
   * In the "show-lesson" branch the gate renders <LessonStep> instead
   * of `children`. While the gate is loading or skipping, `children`
   * is hidden behind a placeholder.
   *
   * L5 deviation: the original L4 design had the gate own the routing
   * (`router.replace`). The plan preferred a `children` prop pattern so
   * the practice page stays declarative — load data, wrap runner in
   * gate. We keep both flows: the gate still does the skip-via-redirect
   * (existing behavior) AND accepts children for callers that want the
   * declarative form. The practice page is the only caller that needs
   * children.
   */
  children?: React.ReactNode;
}

type GateState =
  | { status: "loading" }
  | { status: "show-lesson" }
  | { status: "skip" };

export function LessonGate({ lessonId, mdxPath, lang, children }: Props) {
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
    // Only redirect when we don't have `children` to render — otherwise
    // we'd loop back to this very page. The presence of children means
    // the caller (e.g. /practice) wants us to render them inline once
    // the user has seen the lesson recently enough.
    if (gate.status !== "skip") return;
    if (children !== undefined) return;
    router.replace(`/practice/${lang}/${lessonId}`);
  }, [gate, lessonId, lang, router, children]);

  if (gate.status === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-muted-foreground">
        Cargando lección…
      </div>
    );
  }
  if (gate.status === "skip") {
    // Two render modes:
    //   - children provided → render them (caller owns the destination;
    //     we're already on the practice page, so we hand control back).
    //   - no children → brief placeholder before the redirect effect
    //     fires (the redirect goes to /practice/[lang]/[lessonId] which
    //     IS this page, so this only fires for callers that mounted the
    //     gate from elsewhere — currently none, kept for back-compat).
    if (children !== undefined) {
      return <>{children}</>;
    }
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-muted-foreground">
        Cargando ejercicios…
      </div>
    );
  }
  return <LessonStep lessonId={lessonId} mdxPath={mdxPath} lang={lang} />;
}