// components/home/TocBook.tsx
// "Tu libro de texto" — a vertical TOC of chapters with mastery bars,
// matching mockup home.html. Roman numerals for chapter numbering (I..X),
// the active chapter highlighted in lesson-soft, locked chapters dimmed.
import Link from "next/link";
import { Eyebrow } from "@/components/ui";

export interface TocEntry {
  chapterNum: number;
  name: string;
  progressPct: number;
  locked?: boolean;
  current?: boolean;
}

interface Props {
  lang: string;
  chapters: TocEntry[];
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function romanize(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export function TocBook({ lang, chapters }: Props) {
  if (chapters.length === 0) return null;
  return (
    <section className="mt-12">
      <Eyebrow>Tu libro de texto</Eyebrow>
      <div className="bg-paper-raised border border-rule rounded-[10px] overflow-hidden shadow-[var(--shadow-xs)]">
        {chapters.map((c) => {
          const row = (
            <Link
              key={c.chapterNum}
              href={c.locked ? "#" : `/${lang}/blocks/${c.chapterNum}`}
              aria-disabled={c.locked}
              tabIndex={c.locked ? -1 : undefined}
              className={[
                "flex items-center gap-4 px-5 py-3.5 border-b border-rule last:border-b-0 transition-colors duration-150 ease-[var(--ease)] no-underline text-ink",
                c.current ? "bg-lesson-soft" : "",
                c.locked
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-paper-sunken",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="font-mono text-[13px] text-ink-faint w-7">
                {romanize(c.chapterNum)}
              </span>
              <span className="flex-1 font-display text-[18px] font-medium leading-snug">
                {c.name}
                {c.current && (
                  <span className="text-xs font-semibold text-lesson uppercase tracking-wider ml-1">
                    · actual
                  </span>
                )}
              </span>
              <div className="w-[90px] h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className="h-full bg-lesson transition-[width] duration-300 ease-[var(--ease)]"
                  style={{ width: `${Math.min(Math.max(c.progressPct, 0), 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink-muted w-10 text-right">
                {c.locked ? "🔒" : `${Math.round(c.progressPct)}%`}
              </span>
            </Link>
          );
          return row;
        })}
      </div>
    </section>
  );
}