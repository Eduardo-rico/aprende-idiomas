// components/LessonCard.tsx
"use client";
import Link from "next/link";
import type { Lesson } from "@/lib/data/curriculum-types";

interface Props { lesson: Lesson; dueCount: number; blockId: number; lang: string; }

export function LessonCard({ lesson, dueCount, blockId, lang }: Props) {
  // Links to the lesson intro page (app/[lang]/blocks/[id]/lessons/[lid]/page.tsx),
  // which in turn links to /[lang]/practice/[lessonId]. The href MUST be
  // lang-scoped — without the `/${lang}` prefix every lesson link 404s
  // (all routes live under app/[lang]/…).
  return (
    <Link
      href={`/${lang}/blocks/${blockId}/lessons/${lesson.id}`}
      className="block p-4 border border-border rounded-lg hover:bg-muted/5"
    >
      <h4 className="font-medium">{lesson.name}</h4>
      <div className="text-xs text-muted mt-1">
        {lesson.conceptIds.length} conceptos · {dueCount} due
      </div>
    </Link>
  );
}
