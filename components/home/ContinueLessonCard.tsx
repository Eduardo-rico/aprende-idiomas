// components/home/ContinueLessonCard.tsx
// Editorial "continue your reading" card. Distinct from the existing
// ContinueCard (which shows SRS due-count + repasa button). This one
// surfaces an in-progress lesson for the learner to resume.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";

interface Props {
  lang: string;
  chapterNum: number;
  sectionTitle: string;
  /** 0..100 — shown as a subtle accent but not rendered explicitly here. */
  progressPct: number;
}

export function ContinueLessonCard({ lang, chapterNum, sectionTitle }: Props) {
  const href = `/${lang}/blocks/${chapterNum}`;
  return (
    <Link href={href} className="block group" aria-label={`Continuar lección ${sectionTitle}`}>
      <Card className="p-5 transition-shadow duration-200 ease-[var(--ease)] group-hover:shadow-[var(--shadow-sm)]">
        <div className="text-xs uppercase tracking-[0.08em] text-ink-faint font-semibold mb-1.5">
          Lección {chapterNum}
        </div>
        <h3 className="font-display text-[22px] mb-1 leading-tight">{sectionTitle}</h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium text-lesson inline-flex items-center gap-1.5">
            <span aria-hidden="true">📖</span> Lectura a medias
          </span>
          <span className="text-sm font-medium text-ink border border-rule-strong rounded-md px-3.5 py-1.5 bg-paper-raised inline-flex items-center gap-1 transition-colors duration-150 ease-[var(--ease)] group-hover:bg-paper-sunken">
            Continuar <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </Card>
    </Link>
  );
}