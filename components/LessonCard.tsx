// components/LessonCard.tsx
"use client";
import Link from "next/link";
import type { Lesson } from "@/lib/data/curriculum";

interface Props { lesson: Lesson; dueCount: number; blockId: number; }

export function LessonCard({ lesson, dueCount, blockId }: Props) {
  // Links to the lesson intro page (app/blocks/[id]/lessons/[lid]/page.tsx),
  // which in turn links to /practice/[lessonId]. (The plan snippet appended
  // /practice here, but no route exists at that path — it would 404.)
  return (
    <Link
      href={`/blocks/${blockId}/lessons/${lesson.id}`}
      className="block p-4 border border-border rounded-lg hover:bg-muted/5"
    >
      <h4 className="font-medium">{lesson.name}</h4>
      <div className="text-xs text-muted mt-1">
        {lesson.conceptIds.length} conceptos · {dueCount} due
      </div>
    </Link>
  );
}
